import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
	scanDynamicGuard,
	DYNAMIC_ALLOWLIST,
	getComponentFiles,
	extractStaticEvents,
	parseDocs,
	buildCatalogs
} from '../scripts/sync-ln-events.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

test('anti-rot guard detects unlisted dynamic dispatch in fixture', () => {
	const fixturePath = path.join(root, 'tests', 'fixtures', 'unlisted-dynamic-dispatch.js');
	const violations = scanDynamicGuard([{ file: fixturePath, rel: 'tests/fixtures/unlisted-dynamic-dispatch.js' }], DYNAMIC_ALLOWLIST);

	assert.equal(violations.length, 1, 'Should detect exactly one violation in fixture');
	assert.match(violations[0].eventArg, /'ln-' \+ kind \+ ':unlisted-action'/);
});

test('anti-rot guard reports zero violations across components/ on clean tree', () => {
	const { filesToScan } = getComponentFiles(root);
	const violations = scanDynamicGuard(filesToScan, DYNAMIC_ALLOWLIST);

	assert.equal(violations.length, 0, 'Clean codebase must have zero dynamic violations');
});

test('static extraction finds all expected events without unclassified literals', () => {
	const { compDirs, filesToScan } = getComponentFiles(root);
	const { componentEvents, staticUniqueEvents, unclassifiedLiterals } = extractStaticEvents(filesToScan, compDirs);

	assert.equal(unclassifiedLiterals.length, 0, 'There should be 0 unclassified event literals');
	assert.ok(staticUniqueEvents.size >= 236, `Static unique events count (${staticUniqueEvents.size}) must be >= 236`);

	// Verify indirection pass for ln-validate
	const validateEmits = componentEvents.get('ln-validate').emits;
	assert.ok(validateEmits.has('ln-validate:valid'), 'ln-validate must emit ln-validate:valid');
	assert.ok(validateEmits.has('ln-validate:invalid'), 'ln-validate must emit ln-validate:invalid');
});

test('generated catalogs have strict schemas and valid keys', () => {
	const byComponentPath = path.join(root, 'docs-mcp', 'schemas', 'ln-ashlar-events-by-component.json');
	const indexPath = path.join(root, 'docs-mcp', 'schemas', 'ln-ashlar-events-index.json');

	assert.ok(fs.existsSync(byComponentPath), 'by-component schema file must exist');
	assert.ok(fs.existsSync(indexPath), 'events-index schema file must exist');

	const byComponent = JSON.parse(fs.readFileSync(byComponentPath, 'utf8'));
	const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

	assert.equal(byComponent.$schema, 'http://json-schema.org/draft-07/schema#');
	assert.equal(index.$schema, 'http://json-schema.org/draft-07/schema#');

	// Verify all entries in flat index
	const eventNames = Object.keys(index.events);
	assert.ok(eventNames.length >= 240, `Flat index event count (${eventNames.length}) must be >= 240`);

	for (const name of eventNames) {
		const ev = index.events[name];
		assert.ok(!name.endsWith(':'), `Event name "${name}" must not end with :`);
		assert.ok(!name.endsWith('-'), `Event name "${name}" must not end with -`);
		assert.ok(!name.includes('${'), `Event name "${name}" must not contain interpolation marker`);

		assert.ok(Array.isArray(ev.emitted_by), `${name}: emitted_by must be array`);
		assert.ok(Array.isArray(ev.listened_by), `${name}: listened_by must be array`);
		assert.equal(typeof ev.cancelable, 'boolean', `${name}: cancelable must be boolean`);
		assert.equal(typeof ev.description, 'string', `${name}: description must be string`);
		assert.equal(typeof ev.detail, 'string', `${name}: detail must be string`);
		assert.ok(ev.source === 'static' || ev.source === 'dynamic-allowlist', `${name}: source must be static or dynamic-allowlist`);
	}

	// Verify ln-table:set-data attribution
	const tableSetData = index.events['ln-table:set-data'];
	assert.ok(tableSetData, 'ln-table:set-data must exist in index');
	assert.ok(tableSetData.emitted_by.includes('ln-data-coordinator'), 'ln-table:set-data must be emitted_by ln-data-coordinator');
	assert.ok(tableSetData.listened_by.includes('ln-table'), 'ln-table:set-data must be listened_by ln-table');
});
