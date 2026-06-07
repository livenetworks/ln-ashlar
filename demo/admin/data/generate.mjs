// Generator for documents.json — 10,000 records for ln-table / ln-store demos.
// Run: node demo/admin/data/generate.mjs
// Output: demo/admin/data/documents.json
//
// Schema (10 fields, 8 visible columns + id + tags):
//   id          integer       1..TOTAL
//   title       string        "{topic} {type} #{id}"
//   department  enum string   IT | Finance | Legal | Marketing | HR | Sales | Operations
//   status      enum string   Approved | Draft | Pending | Rejected | Archived
//   priority    enum string   Critical | High | Medium | Low
//   owner       string        "{first} {last}"
//   file_size   integer       KB, 10..50000
//   tags        string[]      1..3 tags from pool
//   created_at  unix seconds  within last 2 years
//   updated_at  unix seconds  >= created_at, <= now

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, 'documents.json');
const TOTAL = 10000;

const topics = [
	'Security', 'Privacy', 'Compliance', 'Risk', 'Audit', 'Operations',
	'Finance', 'HR', 'Legal', 'Marketing', 'Sales', 'Engineering',
	'Quality', 'Vendor', 'Customer', 'Product'
];
const docTypes = [
	'Policy', 'Report', 'Manual', 'Guide', 'Procedure', 'Specification',
	'Agreement', 'Plan', 'Review', 'Notice', 'Memo', 'Analysis',
	'Assessment', 'Strategy', 'Roadmap', 'Charter'
];
const departments = ['IT', 'Finance', 'Legal', 'Marketing', 'HR', 'Sales', 'Operations'];
const statuses    = ['Approved', 'Draft', 'Pending', 'Rejected', 'Archived'];
const priorities  = ['Critical', 'High', 'Medium', 'Low'];

const firstNames = [
	'Anna', 'John', 'Maria', 'David', 'Sofia', 'Alex', 'Elena', 'Marko',
	'Sara', 'Igor', 'Petra', 'Stefan', 'Ana', 'Nikola', 'Vera', 'Boris',
	'Lena', 'Goran', 'Mila', 'Dejan'
];
const lastNames = [
	'Petrović', 'Smith', 'Jovanovska', 'Johnson', 'Tomić', 'Williams',
	'Stojanovska', 'Brown', 'Mitrovska', 'Jones', 'Đorđevska', 'Davis',
	'Stanković', 'Miller', 'Vukomanovska', 'Wilson', 'Ilieva', 'Garcia',
	'Risteska', 'Martinez'
];

const tagPool = [
	'confidential', 'public', 'internal', 'draft', 'review',
	'urgent', 'archived', 'policy', 'process', 'audit',
	'iso', 'gdpr', 'soc2', 'v1', 'v2', 'v3',
	'critical', 'reviewed', 'expired'
];

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
	const copy = arr.slice();
	const out = [];
	for (let i = 0; i < n && copy.length; i++) {
		const idx = Math.floor(Math.random() * copy.length);
		out.push(copy.splice(idx, 1)[0]);
	}
	return out;
}

const now = Math.floor(Date.now() / 1000);
const TWO_YEARS = 60 * 60 * 24 * 730;

const data = [];
for (let i = 0; i < TOTAL; i++) {
	const id = i + 1;
	const topic = topics[i % topics.length];
	const docType = docTypes[(i * 7) % docTypes.length]; // de-correlate from topic
	const created = now - Math.floor(Math.random() * TWO_YEARS);
	const updated = created + Math.floor(Math.random() * (now - created));
	const tagCount = 1 + Math.floor(Math.random() * 3); // 1..3 tags

	data.push({
		id,
		title:       `${topic} ${docType} #${id}`,
		department:  pick(departments),
		status:      pick(statuses),
		priority:    pick(priorities),
		owner:       `${pick(firstNames)} ${pick(lastNames)}`,
		file_size:   10 + Math.floor(Math.random() * 49990),
		tags:        pickN(tagPool, tagCount),
		created_at:  created,
		updated_at:  updated
	});
}

const payload = {
	data,
	total: data.length,
	synced_at: now
};

writeFileSync(OUT_PATH, JSON.stringify(payload));
console.log(`Wrote ${data.length} records to ${OUT_PATH}`);
console.log(`File size: ${(JSON.stringify(payload).length / 1024 / 1024).toFixed(2)} MB`);
