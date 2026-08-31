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
	assert.equal(validateEmits.get('ln-validate:valid'), 'static');
	assert.equal(validateEmits.get('ln-validate:invalid'), 'static');
});

test('generated catalogs have strict schemas, shape preservation, and accurate provenance', () => {
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
	assert.equal(eventNames.length, 242, 'Flat index event count must be exactly 242');

	const validIndexSources = new Set(['static', 'dynamic-allowlist', 'mixed']);
	const validByCompSources = new Set(['static', 'dynamic-allowlist']);
	const expectedKeys = ['emitted_by', 'listened_by', 'cancelable', 'description', 'detail', 'source'];

	for (const name of eventNames) {
		const ev = index.events[name];
		assert.ok(!name.endsWith(':'), `Event name "${name}" must not end with :`);
		assert.ok(!name.endsWith('-'), `Event name "${name}" must not end with -`);
		assert.ok(!name.includes('${'), `Event name "${name}" must not contain interpolation marker`);

		// Strict shape assertion: exactly the 6 keys
		const keys = Object.keys(ev).sort();
		assert.deepEqual(keys, [...expectedKeys].sort(), `${name}: keys must match expected schema shape exactly`);

		assert.ok(Array.isArray(ev.emitted_by), `${name}: emitted_by must be array`);
		for (const emitter of ev.emitted_by) {
			assert.equal(typeof emitter, 'string', `${name}: emitted_by elements must be plain strings`);
		}

		assert.ok(Array.isArray(ev.listened_by), `${name}: listened_by must be array`);
		for (const listener of ev.listened_by) {
			assert.equal(typeof listener, 'string', `${name}: listened_by elements must be plain strings`);
		}

		assert.equal(typeof ev.cancelable, 'boolean', `${name}: cancelable must be boolean`);
		assert.equal(typeof ev.description, 'string', `${name}: description must be string`);
		assert.equal(typeof ev.detail, 'string', `${name}: detail must be string`);
		assert.ok(validIndexSources.has(ev.source), `${name}: source "${ev.source}" must be one of static, dynamic-allowlist, mixed`);
	}

	// Verify by-component catalog source counts and values
	let dynamicAllowlistCount = 0;
	let staticCount = 0;

	for (const [compName, compData] of Object.entries(byComponent.components)) {
		assert.ok(Array.isArray(compData.emits), `${compName}: emits must be array`);
		assert.ok(Array.isArray(compData.listens), `${compName}: listens must be array`);

		for (const item of compData.emits) {
			assert.ok(validByCompSources.has(item.source), `${compName} emits ${item.name}: invalid source ${item.source}`);
			if (item.source === 'dynamic-allowlist') dynamicAllowlistCount++;
			else staticCount++;
		}
		for (const item of compData.listens) {
			assert.ok(validByCompSources.has(item.source), `${compName} listens ${item.name}: invalid source ${item.source}`);
			if (item.source === 'dynamic-allowlist') dynamicAllowlistCount++;
			else staticCount++;
		}
	}

	// 41 allowlist entries across by-component (12 dc emits + 12 dc listens + 5 ds listens + 12 couch listens)
	assert.equal(dynamicAllowlistCount, 41, 'by-component dynamic-allowlist entries count must be exactly 41');
	assert.equal(staticCount, 297, 'by-component static entries count must be exactly 297');

	// Acceptance criteria 1, 2, 3: ln-table:set-data
	const dcEmits = byComponent.components['ln-data-coordinator'].emits;
	const dcTableSetData = dcEmits.find(e => e.name === 'ln-table:set-data');
	assert.ok(dcTableSetData, 'ln-data-coordinator must emit ln-table:set-data');
	assert.equal(dcTableSetData.source, 'dynamic-allowlist', 'ln-data-coordinator emits ln-table:set-data must have source: dynamic-allowlist');

	const tableListens = byComponent.components['ln-table'].listens;
	const tableSetDataListen = tableListens.find(e => e.name === 'ln-table:set-data');
	assert.ok(tableSetDataListen, 'ln-table must listen to ln-table:set-data');
	assert.equal(tableSetDataListen.source, 'static', 'ln-table listens ln-table:set-data must have source: static');

	const flatTableSetData = index.events['ln-table:set-data'];
	assert.ok(flatTableSetData, 'ln-table:set-data must exist in flat index');
	assert.equal(flatTableSetData.source, 'mixed', 'flat index ln-table:set-data must have source: mixed');
	assert.deepEqual(flatTableSetData.emitted_by, ['ln-data-coordinator']);
	assert.deepEqual(flatTableSetData.listened_by, ['ln-table']);
});
