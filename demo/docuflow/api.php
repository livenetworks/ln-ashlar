<?php
// DocuFlow Admin SPA — fake API backend
// Plain procedural PHP, no framework. Seed data persisted to data/db.json.

header('Content-Type: application/json');

define('DB_FILE', __DIR__ . '/data/db.json');

// ─── Seed ───────────────────────────────────────────────────

function seed_data() {
	return [
		'packages' => [
			1 => [
				'id'             => 1,
				'name'           => 'Starter',
				'max_users'      => 5,
				'max_guests'     => 2,
				'max_standards'  => 1,
				'max_documents'  => 100,
				'max_storage'    => 5,
				'active'         => true,
			],
			2 => [
				'id'             => 2,
				'name'           => 'Professional',
				'max_users'      => 25,
				'max_guests'     => 10,
				'max_standards'  => 5,
				'max_documents'  => 1000,
				'max_storage'    => 50,
				'active'         => true,
			],
			3 => [
				'id'             => 3,
				'name'           => 'Enterprise',
				'max_users'      => 0,
				'max_guests'     => 100,
				'max_standards'  => 50,
				'max_documents'  => 100000,
				'max_storage'    => 500,
				'active'         => true,
			],
			4 => [
				'id'             => 4,
				'name'           => 'Legacy',
				'max_users'      => 10,
				'max_guests'     => 0,
				'max_standards'  => 2,
				'max_documents'  => 250,
				'max_storage'    => 10,
				'active'         => false,
			],
		],
		'tenants' => [
			1 => [
				'id'                   => 1,
				'name'                 => 'Acme Corp',
				'slug'                 => 'acme',
				'custom_domain'        => '',
				'package_id'           => 1,
				'auth_method'          => 'Local',
				'doc_numbering_scheme' => '{TYPE}-{SEQ:4}',
				'review_interval'      => 365,
				'brand_primary'        => '#2563eb',
				'brand_secondary'      => '#1e40af',
				'read_confirmation'    => true,
				'active'               => true,
			],
			2 => [
				'id'                   => 2,
				'name'                 => 'Globex',
				'slug'                 => 'globex',
				'custom_domain'        => 'globex.example.com',
				'package_id'           => 1,
				'auth_method'          => 'LDAP',
				'doc_numbering_scheme' => '{TYPE}-{SEQ:4}',
				'review_interval'      => 365,
				'brand_primary'        => '#16a34a',
				'brand_secondary'      => '#15803d',
				'read_confirmation'    => false,
				'active'               => true,
			],
			3 => [
				'id'                   => 3,
				'name'                 => 'Initech',
				'slug'                 => 'initech',
				'custom_domain'        => '',
				'package_id'           => 2,
				'auth_method'          => 'Local',
				'doc_numbering_scheme' => '{TYPE}-{SEQ:4}',
				'review_interval'      => 365,
				'brand_primary'        => '#dc2626',
				'brand_secondary'      => '#b91c1c',
				'read_confirmation'    => true,
				'active'               => true,
			],
			4 => [
				'id'                   => 4,
				'name'                 => 'Umbrella',
				'slug'                 => 'umbrella',
				'custom_domain'        => 'umbrella.example.com',
				'package_id'           => 2,
				'auth_method'          => 'LDAP',
				'doc_numbering_scheme' => '{TYPE}-{SEQ:4}',
				'review_interval'      => 365,
				'brand_primary'        => '#7c3aed',
				'brand_secondary'      => '#6d28d9',
				'read_confirmation'    => false,
				'active'               => true,
			],
			5 => [
				'id'                   => 5,
				'name'                 => 'Wayne Enterprises',
				'slug'                 => 'wayne',
				'custom_domain'        => '',
				'package_id'           => 3,
				'auth_method'          => 'Local',
				'doc_numbering_scheme' => '{TYPE}-{SEQ:4}',
				'review_interval'      => 365,
				'brand_primary'        => '#0f172a',
				'brand_secondary'      => '#1e293b',
				'read_confirmation'    => true,
				'active'               => true,
			],
		],
		'next_id' => [
			'packages' => 5,
			'tenants'  => 6,
		],
	];
}

// ─── Persistence ─────────────────────────────────────────────

function db_load() {
	if (!file_exists(DB_FILE)) {
		db_save(seed_data());
	}
	$raw = file_get_contents(DB_FILE);
	$db  = json_decode($raw, true);
	// Restore integer keys (JSON encodes object keys as strings)
	foreach (['packages', 'tenants'] as $e) {
		if (isset($db[$e])) {
			$keyed = [];
			foreach ($db[$e] as $item) {
				$keyed[(int)$item['id']] = $item;
			}
			$db[$e] = $keyed;
		}
	}
	return $db;
}

function db_save($db) {
	// Normalise to plain arrays for storage (re-index so JSON encodes as array)
	$out = $db;
	$out['packages'] = array_values($db['packages']);
	$out['tenants']  = array_values($db['tenants']);
	file_put_contents(DB_FILE, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function next_id(&$db, $e) {
	$id = $db['next_id'][$e];
	$db['next_id'][$e]++;
	return $id;
}

// ─── Response helper ─────────────────────────────────────────

function respond($status, $payload) {
	http_response_code($status);
	echo json_encode($payload);
	exit;
}

// ─── Field whitelisting ──────────────────────────────────────

function pick_fields($e, $body) {
	if ($e === 'packages') {
		return [
			'name'          => isset($body['name'])          ? (string)$body['name']          : '',
			'max_users'     => isset($body['max_users'])     ? (int)$body['max_users']         : 0,
			'max_guests'    => isset($body['max_guests'])    ? (int)$body['max_guests']        : 0,
			'max_standards' => isset($body['max_standards']) ? (int)$body['max_standards']     : 0,
			'max_documents' => isset($body['max_documents']) ? (int)$body['max_documents']     : 0,
			'max_storage'   => isset($body['max_storage'])   ? (int)$body['max_storage']       : 0,
			'active'        => isset($body['active'])        ? (bool)$body['active']           : false,
		];
	}
	// tenants
	return [
		'name'                 => isset($body['name'])                 ? (string)$body['name']                 : '',
		'slug'                 => isset($body['slug'])                 ? (string)$body['slug']                 : '',
		'custom_domain'        => isset($body['custom_domain'])        ? (string)$body['custom_domain']        : '',
		'package_id'           => isset($body['package_id'])           ? (int)$body['package_id']              : 0,
		'auth_method'          => isset($body['auth_method'])          ? (string)$body['auth_method']          : 'Local',
		'doc_numbering_scheme' => isset($body['doc_numbering_scheme']) ? (string)$body['doc_numbering_scheme'] : '{TYPE}-{SEQ:4}',
		'review_interval'      => isset($body['review_interval'])      ? (int)$body['review_interval']         : 365,
		'brand_primary'        => isset($body['brand_primary'])        ? (string)$body['brand_primary']        : '#000000',
		'brand_secondary'      => isset($body['brand_secondary'])      ? (string)$body['brand_secondary']      : '#000000',
		'read_confirmation'    => isset($body['read_confirmation'])    ? (bool)$body['read_confirmation']      : false,
		'active'               => isset($body['active'])               ? (bool)$body['active']                 : false,
	];
}

// ─── Handlers ────────────────────────────────────────────────

function list_entity($e) {
	$db = db_load();
	respond(200, [
		'data'      => array_values($db[$e]),
		'deleted'   => [],
		'synced_at' => time(),
	]);
}

function create_entity($e, $body) {
	$db     = db_load();
	$fields = pick_fields($e, $body);
	$id     = next_id($db, $e);
	$record = array_merge(['id' => $id], $fields);
	$db[$e][$id] = $record;
	db_save($db);
	respond(201, $record);
}

function update_entity($e, $id, $body) {
	$db = db_load();
	if (!isset($db[$e][$id])) {
		respond(404, ['error' => 'Not found']);
	}
	$fields = pick_fields($e, $body);
	$record = array_merge($db[$e][$id], $fields, ['id' => $id]);
	$db[$e][$id] = $record;
	db_save($db);
	respond(200, $record);
}

function destroy_entity($e, $id) {
	$db = db_load();
	if (!isset($db[$e][$id])) {
		respond(404, ['error' => 'Not found']);
	}
	if ($e === 'packages') {
		$count = 0;
		foreach ($db['tenants'] as $t) {
			if ((int)$t['package_id'] === $id) {
				$count++;
			}
		}
		if ($count > 0) {
			respond(422, [
				'error'      => 'Package has dependent tenants',
				'code'       => 'has_dependents',
				'dependents' => $count,
			]);
		}
	}
	unset($db[$e][$id]);
	db_save($db);
	respond(200, ['ok' => true]);
}

function bulk_delete($e, $ids) {
	// No dependent check for bulk in this demo — caller is responsible for pre-checking.
	$db = db_load();
	foreach ($ids as $id) {
		unset($db[$e][(int)$id]);
	}
	db_save($db);
	respond(200, ['ok' => true]);
}

// ─── Router ──────────────────────────────────────────────────

$method = $_SERVER['REQUEST_METHOD'];

// Parse path, strip query string
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segs = array_values(array_filter(explode('/', $path), function($s) { return $s !== ''; }));

// Find the 'api' segment (prefix-agnostic — works under any subdir or vhost root)
$apiIndex = null;
foreach ($segs as $i => $seg) {
	if ($seg === 'api') {
		$apiIndex = $i;
		break;
	}
}

if ($apiIndex === null) {
	respond(404, ['error' => 'Not found']);
}

$entity = $segs[$apiIndex + 1] ?? null;
$tail   = $segs[$apiIndex + 2] ?? null;

// Reset convenience endpoint
if ($entity === 'reset') {
	db_save(seed_data());
	respond(200, ['ok' => true]);
}

// Validate entity
if (!in_array($entity, ['packages', 'tenants'], true)) {
	respond(404, ['error' => 'Unknown entity']);
}

// Parse JSON body for mutating methods
$body = null;
if (in_array($method, ['POST', 'PUT', 'DELETE'], true)) {
	$raw = file_get_contents('php://input');
	if ($raw !== '' && $raw !== false) {
		$body = json_decode($raw, true);
		if ($body === null && json_last_error() !== JSON_ERROR_NONE) {
			respond(400, ['error' => 'Invalid JSON']);
		}
	}
}

// Dispatch
if ($method === 'GET') {
	list_entity($entity);
} elseif ($method === 'POST') {
	create_entity($entity, $body ?? []);
} elseif ($method === 'PUT' && $tail !== null) {
	update_entity($entity, (int)$tail, $body ?? []);
} elseif ($method === 'DELETE' && $tail === 'bulk-delete') {
	// bulk-delete MUST be matched before the :id branch
	bulk_delete($entity, $body['ids'] ?? []);
} elseif ($method === 'DELETE' && $tail !== null) {
	destroy_entity($entity, (int)$tail);
} else {
	respond(405, ['error' => 'Method not allowed']);
}
