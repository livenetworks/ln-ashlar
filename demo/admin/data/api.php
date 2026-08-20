<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET');

$jsonFile   = __DIR__ . '/documents.json';
$sqliteFile = __DIR__ . '/documents.sqlite';

if (!file_exists($jsonFile)) {
	echo json_encode(['data' => [], 'error' => 'Data file not found.']);
	exit;
}

$pdo = new PDO('sqlite:' . $sqliteFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Check if SQLite cache needs initial creation or synchronization
$needsSync = !file_exists($sqliteFile)
	|| filesize($sqliteFile) === 0
	|| (filemtime($jsonFile) > filemtime($sqliteFile));

if (!$needsSync) {
	// Verify table exists
	$tableCheck = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='documents'")->fetchColumn();
	if (!$tableCheck) {
		$needsSync = true;
	}
}

if ($needsSync) {
	$pdo->exec("CREATE TABLE IF NOT EXISTS documents (
		id INTEGER PRIMARY KEY,
		title TEXT,
		department TEXT,
		status TEXT,
		priority TEXT,
		owner TEXT,
		file_size INTEGER,
		tags TEXT,
		created_at INTEGER,
		updated_at INTEGER
	)");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_doc_dept ON documents(department);");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_doc_status ON documents(status);");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_doc_priority ON documents(priority);");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_doc_updated ON documents(updated_at);");

	$rawJson = file_get_contents($jsonFile);
	$data = json_decode($rawJson, true);
	$records = isset($data['data']) ? $data['data'] : [];

	$pdo->beginTransaction();
	$pdo->exec("DELETE FROM documents");
	$stmt = $pdo->prepare("INSERT INTO documents (id, title, department, status, priority, owner, file_size, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

	foreach ($records as $r) {
		$stmt->execute([
			$r['id'] ?? null,
			$r['title'] ?? '',
			$r['department'] ?? '',
			$r['status'] ?? '',
			$r['priority'] ?? '',
			$r['owner'] ?? '',
			$r['file_size'] ?? 0,
			json_encode($r['tags'] ?? []),
			$r['created_at'] ?? 0,
			$r['updated_at'] ?? 0
		]);
	}
	$pdo->commit();
	touch($sqliteFile, filemtime($jsonFile));
}

// 1. Total records count in database
$grandTotal = (int)$pdo->query("SELECT COUNT(*) FROM documents")->fetchColumn();

// 2. Build WHERE clauses for Search & Filters
$where = [];
$params = [];

// Support query parameter 'search' or 'q'
$search = isset($_GET['search']) ? trim($_GET['search']) : (isset($_GET['q']) ? trim($_GET['q']) : '');
if ($search !== '') {
	$where[] = "(title LIKE ? OR department LIKE ? OR owner LIKE ? OR tags LIKE ?)";
	$term = '%' . $search . '%';
	$params[] = $term;
	$params[] = $term;
	$params[] = $term;
	$params[] = $term;
}

// Support filters by department and status (comma-separated lists)
if (!empty($_GET['department'])) {
	$depts = array_values(array_filter(array_map('trim', explode(',', $_GET['department']))));
	if (!empty($depts)) {
		$in = implode(',', array_fill(0, count($depts), '?'));
		$where[] = "department IN ($in)";
		$params = array_merge($params, $depts);
	}
}

if (!empty($_GET['status'])) {
	$statuses = array_values(array_filter(array_map('trim', explode(',', $_GET['status']))));
	if (!empty($statuses)) {
		$in = implode(',', array_fill(0, count($statuses), '?'));
		$where[] = "status IN ($in)";
		$params = array_merge($params, $statuses);
	}
}

if (!empty($_GET['priority'])) {
	$priorities = array_values(array_filter(array_map('trim', explode(',', $_GET['priority']))));
	if (!empty($priorities)) {
		$in = implode(',', array_fill(0, count($priorities), '?'));
		$where[] = "priority IN ($in)";
		$params = array_merge($params, $priorities);
	}
}

$whereSql = !empty($where) ? ' WHERE ' . implode(' AND ', $where) : '';

// 3. Count filtered records
if (!empty($where)) {
	$countStmt = $pdo->prepare("SELECT COUNT(*) FROM documents" . $whereSql);
	$countStmt->execute($params);
	$filteredCount = (int)$countStmt->fetchColumn();
} else {
	$filteredCount = $grandTotal;
}

// 4. Sorting
$sortField = isset($_GET['sort_field']) ? $_GET['sort_field'] : '';
$allowedSort = ['id', 'title', 'department', 'status', 'priority', 'owner', 'file_size', 'created_at', 'updated_at'];
$orderSql = '';

if ($sortField !== '' && in_array($sortField, $allowedSort, true)) {
	$sortDir = (isset($_GET['sort_dir']) && strtolower($_GET['sort_dir']) === 'desc') ? 'DESC' : 'ASC';
	$orderSql = " ORDER BY $sortField $sortDir";
}

// 5. Pagination
$limit = isset($_GET['limit']) ? max(0, (int)$_GET['limit']) : 0;
$offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
$limitSql = $limit > 0 ? " LIMIT $limit OFFSET $offset" : '';

// 6. Fetch paginated data
$query = "SELECT * FROM documents" . $whereSql . $orderSql . $limitSql;
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 7. Format display fields (only for the requested page slice)
foreach ($rows as &$rec) {
	$rec['id'] = (int)$rec['id'];
	$rec['file_size'] = (int)$rec['file_size'];
	$rec['created_at'] = (int)$rec['created_at'];
	$rec['updated_at'] = (int)$rec['updated_at'];
	if (is_string($rec['tags'])) {
		$rec['tags'] = json_decode($rec['tags'], true) ?: [];
	}
	$b = $rec['file_size'];
	$rec['file_size_display'] = $b >= 1048576 ? round($b / 1048576, 1) . ' MB' : round($b / 1024, 1) . ' KB';
	$rec['updated_display'] = date('Y-m-d', $rec['updated_at']);
}
unset($rec);

echo json_encode([
	'data'     => $rows,
	'total'    => $grandTotal,
	'filtered' => $filteredCount
]);
