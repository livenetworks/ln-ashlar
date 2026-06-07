<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET');

$jsonFile = __DIR__ . '/documents.json';
if (!file_exists($jsonFile)) {
	echo json_encode(['data' => [], 'error' => 'Data file not found.']);
	exit;
}

$rawJson = file_get_contents($jsonFile);
$data = json_decode($rawJson, true);
$records = isset($data['data']) ? $data['data'] : [];

// Support query parameter 'search' or 'q'
$search = isset($_GET['search']) ? trim($_GET['search']) : (isset($_GET['q']) ? trim($_GET['q']) : '');

if ($search !== '') {
	$searchLower = mb_strtolower($search, 'UTF-8');
	$filtered = [];
	foreach ($records as $record) {
		$match = false;
		
		// Search title
		if (isset($record['title']) && mb_strpos(mb_strtolower($record['title'], 'UTF-8'), $searchLower) !== false) {
			$match = true;
		}
		// Search department
		elseif (isset($record['department']) && mb_strpos(mb_strtolower($record['department'], 'UTF-8'), $searchLower) !== false) {
			$match = true;
		}
		// Search owner
		elseif (isset($record['owner']) && mb_strpos(mb_strtolower($record['owner'], 'UTF-8'), $searchLower) !== false) {
			$match = true;
		}
		// Search tags
		elseif (isset($record['tags']) && is_array($record['tags'])) {
			foreach ($record['tags'] as $tag) {
				if (mb_strpos(mb_strtolower($tag, 'UTF-8'), $searchLower) !== false) {
					$match = true;
					break;
				}
			}
		}
		
		if ($match) {
			$filtered[] = $record;
		}
	}
	$records = $filtered;
}

// Support filters by department and status (comma-separated lists)
$departmentFilter = isset($_GET['department']) && $_GET['department'] !== '' ? explode(',', $_GET['department']) : [];
$statusFilter = isset($_GET['status']) && $_GET['status'] !== '' ? explode(',', $_GET['status']) : [];

if (!empty($departmentFilter)) {
	$filtered = [];
	foreach ($records as $record) {
		if (isset($record['department']) && in_array($record['department'], $departmentFilter)) {
			$filtered[] = $record;
		}
	}
	$records = $filtered;
}

if (!empty($statusFilter)) {
	$filtered = [];
	foreach ($records as $record) {
		if (isset($record['status']) && in_array($record['status'], $statusFilter)) {
			$filtered[] = $record;
		}
	}
	$records = $filtered;
}

// Check sorting parameters
$sortField = isset($_GET['sort_field']) ? $_GET['sort_field'] : '';
$sortDir = isset($_GET['sort_dir']) ? strtolower($_GET['sort_dir']) : 'asc';

if ($sortField !== '') {
	usort($records, function ($a, $b) use ($sortField, $sortDir) {
		$valA = isset($a[$sortField]) ? $a[$sortField] : '';
		$valB = isset($b[$sortField]) ? $b[$sortField] : '';
		
		if (is_numeric($valA) && is_numeric($valB)) {
			$diff = $valA - $valB;
		} else {
			$diff = strcmp((string)$valA, (string)$valB);
		}
		
		return $sortDir === 'desc' ? -$diff : $diff;
	});
}

// Pagination
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

$totalCount = count($records);

if ($limit > 0) {
	$records = array_slice($records, $offset, $limit);
}

echo json_encode([
	'data' => $records,
	'total' => $totalCount,
	'filtered' => $totalCount
]);
