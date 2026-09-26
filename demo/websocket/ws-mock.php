<?php
/**
 * ln-websocket-connector demo mock — one process, one in-memory task list,
 * served over WebSocket and over the REST routes ln-api-connector calls.
 *
 *   php demo/websocket/ws-mock.php [port]      (default 8090)
 *
 *   ws://localhost:8090           — protocol of components/ln-websocket-connector/README.md
 *   http://localhost:8090/tasks   — GET ?since= | POST | PUT /{id} | DELETE /{id} | DELETE /bulk-delete
 *
 * Every few seconds a random change is pushed to every socket. Every write,
 * REST or socket, is pushed too. `synced_at` is one change counter shared by
 * the REST delta and the pushes.
 *
 * State lives in <system temp>/ln-ashlar-ws-mock.json, so a restart continues
 * the counter. Deleting that file starts a fresh list — clear the demo page's
 * site data too, or its cached sync token points past the new counter.
 *
 * Pure PHP streams, no extensions beyond the defaults. A local dev tool only.
 */

// demo/ is a public docroot — never run inside a web request.
if (PHP_SAPI !== 'cli') {
	http_response_code(404);
	exit;
}

const TICK_SECONDS = 3;
const MIN_TASKS = 12;
const MAX_TASKS = 40;
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

$port = (int) ($argv[1] ?? 8090);
$server = @stream_socket_server('tcp://0.0.0.0:' . $port, $errno, $errstr);
if (!$server) {
	fwrite(STDERR, "Cannot listen on port $port: $errstr\n");
	exit(1);
}
stream_set_blocking($server, false);

// ─── Data ────────────────────────────────────────────────────

final class Tasks
{
	private const TITLES = ['Review contract', 'Update invoice', 'Call supplier', 'Prepare report', 'Fix login bug',
		'Plan sprint', 'Write release notes', 'Audit permissions', 'Renew certificate', 'Migrate database',
		'Design landing page', 'Onboard new hire', 'Backup servers', 'Translate docs', 'Close ticket'];
	private const STATUSES = ['todo', 'in-progress', 'review', 'done'];
	private const PRIORITIES = ['low', 'medium', 'high'];
	private const PEOPLE = ['Ana', 'Marko', 'Elena', 'Stefan', 'Ivana', 'Petar'];

	public int $seq = 0;
	private int $nextId = 1;
	private array $records = [];   // id => record
	private array $changedAt = []; // id => seq of last change
	private array $deletedAt = []; // id => seq of deletion (tombstones)

	// State survives restarts: a browser keeps its IndexedDB cache and its
	// sync token, so a counter that started over would break the delta.
	public function __construct(private string $file, int $count)
	{
		$saved = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
		if (is_array($saved)) {
			foreach (['seq', 'nextId', 'records', 'changedAt', 'deletedAt'] as $key) $this->$key = $saved[$key];
			return;
		}
		for ($i = 0; $i < $count; $i++) $this->create([]);
		$this->save();
	}

	public function save(): void
	{
		file_put_contents($this->file, json_encode([
			'seq' => $this->seq, 'nextId' => $this->nextId, 'records' => $this->records,
			'changedAt' => $this->changedAt, 'deletedAt' => $this->deletedAt,
		]));
	}

	public function count(): int
	{
		return count($this->records);
	}

	public function get(int $id): ?array
	{
		return $this->records[$id] ?? null;
	}

	public function create(array $data): array
	{
		$id = $this->nextId++;
		$record = [
			'id' => $id,
			'title' => self::pick(self::TITLES),
			'status' => self::pick(self::STATUSES),
			'priority' => self::pick(self::PRIORITIES),
			'assignee' => self::pick(self::PEOPLE),
		];
		foreach (['title', 'status', 'priority', 'assignee'] as $field) {
			if (isset($data[$field]) && $data[$field] !== '') $record[$field] = (string) $data[$field];
		}
		return $this->touch($record);
	}

	public function update(int $id, array $data): ?array
	{
		if (!isset($this->records[$id])) return null;
		$record = $this->records[$id];
		foreach (['title', 'status', 'priority', 'assignee'] as $field) {
			if (array_key_exists($field, $data)) $record[$field] = (string) $data[$field];
		}
		return $this->touch($record);
	}

	public function delete(int $id): bool
	{
		if (!isset($this->records[$id])) return false;
		unset($this->records[$id], $this->changedAt[$id]);
		$this->deletedAt[$id] = ++$this->seq;
		return true;
	}

	/** A random server-side change: mostly updates, sometimes a create or a delete. */
	public function randomChange(): array
	{
		$roll = mt_rand(1, 100);
		if ($this->count() < MIN_TASKS || ($roll <= 15 && $this->count() < MAX_TASKS)) {
			return ['data' => [$this->create([])], 'deleted' => []];
		}
		$id = array_rand($this->records);
		if ($roll <= 30) {
			$this->delete($id);
			return ['data' => [], 'deleted' => [$id]];
		}
		$field = self::pick(['status', 'priority', 'assignee']);
		$pool = ['status' => self::STATUSES, 'priority' => self::PRIORITIES, 'assignee' => self::PEOPLE][$field];
		return ['data' => [$this->update($id, [$field => self::pick($pool)])], 'deleted' => []];
	}

	/** Delta since a change counter; no counter means everything. */
	public function delta($since): array
	{
		$since = ($since === null || $since === '') ? null : (int) $since;
		$data = [];
		foreach ($this->records as $id => $record) {
			if ($since === null || $this->changedAt[$id] > $since) $data[] = $record;
		}
		$deleted = [];
		if ($since !== null) {
			foreach ($this->deletedAt as $id => $at) {
				if ($at > $since) $deleted[] = $id;
			}
		}
		return ['data' => $data, 'deleted' => $deleted, 'synced_at' => $this->seq];
	}

	/** One page: search, filters ({field: [values]}), sort, offset, limit. */
	public function query(array $q): array
	{
		$rows = array_values($this->records);
		$total = count($rows);

		$search = mb_strtolower(trim((string) ($q['search'] ?? '')));
		if ($search !== '') {
			$rows = array_values(array_filter($rows, function ($r) use ($search) {
				return str_contains(mb_strtolower(implode(' ', $r)), $search);
			}));
		}
		foreach (($q['filters'] ?? []) as $field => $values) {
			if (!is_array($values) || !$values) continue;
			$rows = array_values(array_filter($rows, fn($r) => in_array((string) ($r[$field] ?? ''), $values, true)));
		}
		$filtered = count($rows);

		$field = $q['sort']['field'] ?? null;
		if ($field) {
			$dir = strtolower($q['sort']['direction'] ?? 'asc') === 'desc' ? -1 : 1;
			usort($rows, fn($a, $b) => $dir * strnatcasecmp((string) ($a[$field] ?? ''), (string) ($b[$field] ?? '')));
		}
		$offset = max(0, (int) ($q['offset'] ?? 0));
		$limit = (int) ($q['limit'] ?? 0);
		$rows = $limit > 0 ? array_slice($rows, $offset, $limit) : array_slice($rows, $offset);

		return ['data' => $rows, 'total' => $total, 'filtered' => $filtered];
	}

	private function touch(array $record): array
	{
		$record['updated_at'] = time();
		$this->records[$record['id']] = $record;
		$this->changedAt[$record['id']] = ++$this->seq;
		return $record;
	}

	private static function pick(array $pool)
	{
		return $pool[array_rand($pool)];
	}
}

$tasks = new Tasks(sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ln-ashlar-ws-mock.json', 20);
$clients = []; // int id => ['sock' => resource, 'buf' => string, 'ws' => bool]

function out(string $line): void
{
	echo '[' . date('H:i:s') . '] ' . $line . PHP_EOL;
}

// ─── Transport helpers ───────────────────────────────────────

function write_all($sock, string $bytes): void
{
	while ($bytes !== '') {
		$n = @fwrite($sock, $bytes);
		if ($n === false) return;
		if ($n === 0) { usleep(1000); continue; }
		$bytes = substr($bytes, $n);
	}
}

function ws_frame(string $payload, int $opcode = 0x1): string
{
	$len = strlen($payload);
	$head = chr(0x80 | $opcode);
	if ($len < 126) $head .= chr($len);
	elseif ($len < 65536) $head .= chr(126) . pack('n', $len);
	else $head .= chr(127) . pack('J', $len);
	return $head . $payload;
}

function ws_send(array $client, array $message): void
{
	write_all($client['sock'], ws_frame(json_encode($message)));
}

function broadcast(array $clients, array $change, Tasks $tasks): void
{
	$tasks->save();
	$message = ['type' => 'changes', 'data' => $change['data'], 'deleted' => $change['deleted'], 'synced_at' => $tasks->seq];
	$sockets = 0;
	foreach ($clients as $client) {
		if ($client['ws']) { ws_send($client, $message); $sockets++; }
	}
	out(sprintf('push → %d socket(s): %d upserted, %d deleted, synced_at %d', $sockets, count($change['data']), count($change['deleted']), $tasks->seq));
}

/** Parses complete frames off the buffer. Returns [frames, rest]; a frame is [opcode, payload]. */
function ws_parse(string $buf): array
{
	$frames = [];
	while (strlen($buf) >= 2) {
		$b1 = ord($buf[0]);
		$b2 = ord($buf[1]);
		$masked = ($b2 & 0x80) !== 0;
		$len = $b2 & 0x7f;
		$pos = 2;
		if ($len === 126) {
			if (strlen($buf) < 4) break;
			$len = unpack('n', substr($buf, 2, 2))[1];
			$pos = 4;
		} elseif ($len === 127) {
			if (strlen($buf) < 10) break;
			$len = unpack('J', substr($buf, 2, 8))[1];
			$pos = 10;
		}
		$maskLen = $masked ? 4 : 0;
		if (strlen($buf) < $pos + $maskLen + $len) break;
		$mask = $masked ? substr($buf, $pos, 4) : '';
		$payload = substr($buf, $pos + $maskLen, $len);
		if ($masked) {
			for ($i = 0; $i < $len; $i++) $payload[$i] = $payload[$i] ^ $mask[$i % 4];
		}
		$frames[] = [$b1 & 0x0f, $payload];
		$buf = substr($buf, $pos + $maskLen + $len);
	}
	return [$frames, $buf];
}

// ─── HTTP ────────────────────────────────────────────────────

/** Returns [method, path, query, headers, body] once the request is complete, else null. */
function http_parse(string $buf): ?array
{
	$end = strpos($buf, "\r\n\r\n");
	if ($end === false) return null;
	$lines = explode("\r\n", substr($buf, 0, $end));
	[$method, $target] = explode(' ', array_shift($lines)) + [1 => '/'];
	$headers = [];
	foreach ($lines as $line) {
		$colon = strpos($line, ':');
		if ($colon !== false) $headers[strtolower(trim(substr($line, 0, $colon)))] = trim(substr($line, $colon + 1));
	}
	$length = (int) ($headers['content-length'] ?? 0);
	if (strlen($buf) < $end + 4 + $length) return null;
	$body = substr($buf, $end + 4, $length);
	$path = parse_url($target, PHP_URL_PATH) ?: '/';
	parse_str((string) parse_url($target, PHP_URL_QUERY), $query);
	return [$method, $path, $query, $headers, $body];
}

function http_respond($sock, int $status, $payload, array $headers): void
{
	$reasons = [200 => 'OK', 201 => 'Created', 204 => 'No Content', 400 => 'Bad Request', 404 => 'Not Found'];
	$body = $payload === null ? '' : json_encode($payload);
	$cors = [
		'Access-Control-Allow-Origin: ' . ($headers['origin'] ?? '*'),
		'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers: ' . ($headers['access-control-request-headers'] ?? 'Content-Type'),
		'Vary: Origin',
	];
	$head = "HTTP/1.1 $status " . ($reasons[$status] ?? 'OK') . "\r\n"
		. implode("\r\n", $cors) . "\r\n"
		. ($body === '' ? '' : "Content-Type: application/json\r\n")
		. 'Content-Length: ' . strlen($body) . "\r\nConnection: close\r\n\r\n";
	write_all($sock, $head . $body);
}

/** REST routes of ln-api-connector over the same task list. Returns [status, payload, change|null]. */
function rest_route(string $method, string $path, array $query, string $body, Tasks $tasks): array
{
	$parts = array_values(array_filter(explode('/', $path)));
	if (($parts[0] ?? '') !== 'tasks') return [404, ['error' => 'Not found'], null];
	$data = $body === '' ? [] : (json_decode($body, true) ?? []);
	$tail = $parts[1] ?? null;

	if ($method === 'GET' && $tail === null) {
		$page = $tasks->query([
			'search' => $query['search'] ?? '',
			'sort' => ['field' => $query['sort_by'] ?? ($query['sort_field'] ?? null), 'direction' => $query['sort_dir'] ?? 'asc'],
			'offset' => $query['offset'] ?? 0,
			'limit' => $query['limit'] ?? 0,
		]);
		$delta = $tasks->delta($query['since'] ?? null);
		$rows = isset($query['since']) ? $delta['data'] : $page['data'];
		return [200, ['data' => $rows, 'deleted' => $delta['deleted'], 'synced_at' => $delta['synced_at'], 'total' => $page['total'], 'filtered' => $page['filtered']], null];
	}
	if ($method === 'POST' && $tail === null) {
		$record = $tasks->create($data);
		return [201, $record, ['data' => [$record], 'deleted' => []]];
	}
	if ($method === 'DELETE' && $tail === 'bulk-delete') {
		$ids = array_values(array_filter(array_map('intval', $data['ids'] ?? []), [$tasks, 'delete']));
		return [200, ['ok' => true, 'deletedCount' => count($ids)], ['data' => [], 'deleted' => $ids]];
	}
	if ($tail !== null && $method === 'PUT') {
		$record = $tasks->update((int) $tail, $data);
		return $record ? [200, $record, ['data' => [$record], 'deleted' => []]] : [404, ['error' => 'Not found'], null];
	}
	if ($tail !== null && $method === 'DELETE') {
		return $tasks->delete((int) $tail) ? [204, null, ['data' => [], 'deleted' => [(int) $tail]]] : [404, ['error' => 'Not found'], null];
	}
	return [400, ['error' => 'Unsupported route'], null];
}

// ─── WebSocket protocol ──────────────────────────────────────

/** Answers one request frame. Returns [reply, change|null]. */
function ws_route(array $msg, Tasks $tasks): array
{
	$ref = $msg['ref'] ?? null;
	$ok = fn($content) => ['ref' => $ref, 'ok' => true, 'content' => $content, 'message' => null];
	$missing = ['ref' => $ref, 'ok' => false, 'status' => 404, 'error' => 'Not found', 'data' => null];

	switch ($msg['type'] ?? '') {
		case 'sync':
			return [$ok($tasks->delta($msg['since'] ?? null)), null];
		case 'query':
			return [$ok($tasks->query($msg['query'] ?? [])), null];
		case 'create':
			$record = $tasks->create($msg['data'] ?? []);
			return [$ok($record), ['data' => [$record], 'deleted' => []]];
		case 'update':
			$record = $tasks->update((int) ($msg['id'] ?? 0), $msg['data'] ?? []);
			return $record ? [$ok($record), ['data' => [$record], 'deleted' => []]] : [$missing, null];
		case 'delete':
			$id = (int) ($msg['id'] ?? 0);
			return $tasks->delete($id) ? [$ok(['ok' => true]), ['data' => [], 'deleted' => [$id]]] : [$missing, null];
		case 'bulk-delete':
			$ids = array_values(array_filter(array_map('intval', $msg['ids'] ?? []), [$tasks, 'delete']));
			return [$ok(['ok' => true, 'deletedCount' => count($ids)]), ['data' => [], 'deleted' => $ids]];
	}
	return [['ref' => $ref, 'ok' => false, 'status' => 400, 'error' => 'Unknown type', 'data' => null], null];
}

// ─── Event loop ──────────────────────────────────────────────

out("ws-mock on ws://localhost:$port and http://localhost:$port/tasks — Ctrl+C to stop");
$nextTick = time() + TICK_SECONDS;

while (true) {
	$read = [$server];
	foreach ($clients as $client) $read[] = $client['sock'];
	$write = $except = null;
	if (@stream_select($read, $write, $except, 0, 200000) === false) continue;

	foreach ($read as $sock) {
		if ($sock === $server) {
			$conn = @stream_socket_accept($server, 0);
			if ($conn) {
				stream_set_blocking($conn, false);
				$clients[(int) $conn] = ['sock' => $conn, 'buf' => '', 'ws' => false];
			}
			continue;
		}

		$id = (int) $sock;
		$chunk = @fread($sock, 65536);
		if ($chunk === '' || $chunk === false) {
			if (feof($sock)) {
				if ($clients[$id]['ws']) out('socket closed');
				fclose($sock);
				unset($clients[$id]);
			}
			continue;
		}
		$clients[$id]['buf'] .= $chunk;

		// HTTP request: a WebSocket upgrade or a REST call.
		if (!$clients[$id]['ws']) {
			$request = http_parse($clients[$id]['buf']);
			if (!$request) continue;
			[$method, $path, $query, $headers, $body] = $request;

			if (strtolower($headers['upgrade'] ?? '') === 'websocket') {
				$accept = base64_encode(sha1(($headers['sec-websocket-key'] ?? '') . WS_GUID, true));
				write_all($sock, "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: $accept\r\n\r\n");
				$clients[$id]['ws'] = true;
				$clients[$id]['buf'] = '';
				out('socket opened');
				continue;
			}

			if ($method === 'OPTIONS') {
				http_respond($sock, 204, null, $headers);
			} else {
				[$status, $payload, $change] = rest_route($method, $path, $query, $body, $tasks);
				http_respond($sock, $status, $payload, $headers);
				out("REST $method $path → $status");
				if ($change) broadcast($clients, $change, $tasks);
			}
			fclose($sock);
			unset($clients[$id]);
			continue;
		}

		// WebSocket frames.
		[$frames, $rest] = ws_parse($clients[$id]['buf']);
		$clients[$id]['buf'] = $rest;
		foreach ($frames as [$opcode, $payload]) {
			if ($opcode === 0x8) {
				write_all($sock, ws_frame($payload, 0x8));
				fclose($sock);
				unset($clients[$id]);
				out('socket closed');
				break;
			}
			if ($opcode === 0x9) { write_all($sock, ws_frame($payload, 0xA)); continue; }
			if ($opcode !== 0x1) continue;

			$msg = json_decode($payload, true);
			if (!is_array($msg)) continue;
			[$reply, $change] = ws_route($msg, $tasks);
			ws_send($clients[$id], $reply);
			out('socket ' . ($msg['type'] ?? '?') . ' #' . ($msg['ref'] ?? '?') . ' → ' . ($reply['ok'] ? 'ok' : $reply['status']));
			if ($change) broadcast($clients, $change, $tasks);
		}
	}

	if (time() >= $nextTick) {
		$nextTick = time() + TICK_SECONDS;
		broadcast($clients, $tasks->randomChange(), $tasks);
	}
}
