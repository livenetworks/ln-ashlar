import test from 'node:test';
import assert from 'node:assert/strict';

import {
	attrStr,
	attrInt,
	attrBool,
	attrList,
	attrEnum,
	attrFloat,
	attrJson,
	attrSpec,
	validateAttrValue,
	defineAttrs
} from '../components/ln-core/attrs.js';

test('attrEnum caches reader functions by values and fallback', () => {
	const reader1 = attrEnum(['open', 'close'], 'close');
	const reader2 = attrEnum(['open', 'close'], 'close');
	assert.equal(reader1, reader2, 'Identical values and fallback should reuse cached reader function');

	const reader3 = attrEnum(['open', 'close'], 'open');
	assert.notEqual(reader1, reader3, 'Different fallback should produce distinct reader function');
});

test('attrEnum returns valid enum value or fallback', () => {
	const reader = attrEnum(['open', 'close'], 'close');
	const mockEl = {
		getAttribute(name) {
			if (name === 'valid') return 'open';
			if (name === 'invalid') return 'unknown';
			return null;
		}
	};

	assert.equal(reader(mockEl, 'valid'), 'open');
	assert.equal(reader(mockEl, 'invalid'), 'close');
	assert.equal(reader(mockEl, 'missing'), 'close');
});

test('attrFloat parses float and safely falls back on NaN', () => {
	const mockEl = {
		getAttribute(name) {
			if (name === 'valid') return '3.14159';
			if (name === 'zero') return '0';
			if (name === 'invalid') return 'abc';
			return null;
		}
	};

	assert.equal(attrFloat(mockEl, 'valid', 0), 3.14159);
	assert.equal(attrFloat(mockEl, 'zero', 10), 0);
	assert.equal(attrFloat(mockEl, 'invalid', 42.5), 42.5);
	assert.equal(attrFloat(mockEl, 'missing', 1.0), 1.0);
});

test('attrJson safely parses JSON and falls back on syntax error', () => {
	const mockEl = {
		getAttribute(name) {
			if (name === 'valid') return '{"key":"val","count":5}';
			if (name === 'invalid') return '{unclosed:';
			if (name === 'empty') return '';
			return null;
		}
	};

	assert.deepEqual(attrJson(mockEl, 'valid', {}), { key: 'val', count: 5 });
	assert.deepEqual(attrJson(mockEl, 'invalid', { fallback: true }), { fallback: true });
	assert.deepEqual(attrJson(mockEl, 'empty', null), null);
	assert.deepEqual(attrJson(mockEl, 'missing', null), null);
});

test('attrSpec auto-infers readers from type when read is omitted', () => {
	const ATTRIBUTES = {
		'data-ln-status':  { prop: 'status',  type: 'enum', values: ['idle', 'busy'], fallback: 'idle' },
		'data-ln-count':   { prop: 'count',   type: 'integer', fallback: 10 },
		'data-ln-ratio':   { prop: 'ratio',   type: 'float', fallback: 0.5 },
		'data-ln-active':  { prop: 'active',  type: 'boolean' },
		'data-ln-tags':    { prop: 'tags',    type: 'list' },
		'data-ln-config':  { prop: 'config',  type: 'json', fallback: {} },
		'data-ln-title':   { prop: 'title',   type: 'string', fallback: 'Default' }
	};

	const spec = attrSpec(ATTRIBUTES);

	assert.ok(spec.status, 'status spec defined');
	assert.ok(spec.count, 'count spec defined');
	assert.ok(spec.ratio, 'ratio spec defined');
	assert.ok(spec.active, 'active spec defined');
	assert.ok(spec.tags, 'tags spec defined');
	assert.ok(spec.config, 'config spec defined');
	assert.ok(spec.title, 'title spec defined');

	const mockDom = {
		getAttribute(name) {
			const map = {
				'data-ln-status': 'busy',
				'data-ln-count': '42',
				'data-ln-ratio': '1.25',
				'data-ln-active': '',
				'data-ln-tags': 'one, two, three',
				'data-ln-config': '{"foo":"bar"}',
				'data-ln-title': 'Custom Title'
			};
			return map[name] !== undefined ? map[name] : null;
		},
		hasAttribute(name) {
			return name === 'data-ln-active';
		}
	};

	const instance = {};
	defineAttrs(instance, mockDom, spec);

	assert.equal(instance.status, 'busy');
	assert.equal(instance.count, 42);
	assert.equal(instance.ratio, 1.25);
	assert.equal(instance.active, true);
	assert.deepEqual(instance.tags, ['one', 'two', 'three']);
	assert.deepEqual(instance.config, { foo: 'bar' });
	assert.equal(instance.title, 'Custom Title');
});

test('attrBool handles presence, boolean values, and fallback', () => {
	const mockEl = {
		getAttribute(name) {
			const map = {
				empty: '',
				strTrue: 'true',
				strFalse: 'false',
				numOne: '1',
				numZero: '0'
			};
			return map[name] !== undefined ? map[name] : null;
		}
	};

	assert.equal(attrBool(mockEl, 'empty'), true, 'Bare presence should be true');
	assert.equal(attrBool(mockEl, 'strTrue'), true, '"true" should be true');
	assert.equal(attrBool(mockEl, 'numOne'), true, '"1" should be true');
	assert.equal(attrBool(mockEl, 'strFalse'), false, '"false" should be false');
	assert.equal(attrBool(mockEl, 'numZero'), false, '"0" should be false');
	assert.equal(attrBool(mockEl, 'missing'), false, 'Missing with default fallback should be false');
	assert.equal(attrBool(mockEl, 'missing', true), true, 'Missing with fallback: true should be true');
	assert.equal(attrBool(mockEl, 'strFalse', true), false, '"false" must override fallback: true');
});

test('validateAttrValue validates all types and outputs dev warnings on failure', () => {
	const warnings = [];
	const origWarn = console.warn;
	console.warn = (...args) => warnings.push(args.join(' '));

	try {
		// Absent attribute (value === null) -> always valid
		assert.equal(validateAttrValue({ type: 'integer' }, null, 'data-ln-test', 'ln-test'), true);

		// Trigger and Marker -> valueless, always valid
		assert.equal(validateAttrValue({ type: 'trigger' }, 'click', 'data-ln-trigger', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'marker' }, '', 'data-ln-marker', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'string' }, 'any text', 'data-ln-str', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'list' }, 'a,b,c', 'data-ln-list', 'ln-test'), true);

		// Boolean presence and values ("true", "false", "1", "0", "")
		assert.equal(validateAttrValue({ type: 'boolean' }, '', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, 'true', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, 'false', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, '1', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, '0', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, 'invalid', 'data-ln-bool', 'ln-test'), false);
		assert.ok(warnings.some(w => w.includes('[ln-test]') && w.includes('Invalid value "invalid" for boolean attribute "data-ln-bool"')));

		// Enum
		warnings.length = 0;
		const enumEntry = { type: 'enum', values: ['open', 'close'], fallback: 'close' };
		assert.equal(validateAttrValue(enumEntry, 'open', 'data-ln-state', 'ln-modal'), true);
		assert.equal(validateAttrValue(enumEntry, 'invalid', 'data-ln-state', 'ln-modal'), false);
		assert.ok(warnings.some(w => w.includes('[ln-modal]') && w.includes('Invalid value "invalid"')));
		// Bare enum with fallback -> valid (no warning)
		assert.equal(validateAttrValue(enumEntry, '', 'data-ln-modal', 'ln-modal'), true);
		// Bare enum without fallback -> invalid
		assert.equal(validateAttrValue({ type: 'enum', values: ['open', 'close'] }, '', 'data-ln-state', 'ln-modal'), false);

		// Integer with bounds
		warnings.length = 0;
		const intEntry = { type: 'integer', fallback: 10, min: 1, max: 100 };
		assert.equal(validateAttrValue(intEntry, '50', 'data-ln-count', 'ln-test'), true);
		assert.equal(validateAttrValue(intEntry, '', 'data-ln-count', 'ln-test'), true, 'Bare integer with fallback is valid');
		assert.equal(validateAttrValue(intEntry, 'abc', 'data-ln-count', 'ln-test'), false);
		assert.equal(validateAttrValue(intEntry, '0', 'data-ln-count', 'ln-test'), false);
		assert.equal(validateAttrValue(intEntry, '150', 'data-ln-count', 'ln-test'), false);

		// Float
		warnings.length = 0;
		const floatEntry = { type: 'float', fallback: 0.0 };
		assert.equal(validateAttrValue(floatEntry, '3.14', 'data-ln-pi', 'ln-test'), true);
		assert.equal(validateAttrValue(floatEntry, '', 'data-ln-pi', 'ln-test'), true, 'Bare float with fallback is valid');
		assert.equal(validateAttrValue(floatEntry, 'bad', 'data-ln-pi', 'ln-test'), false);

		// JSON
		warnings.length = 0;
		const jsonEntry = { type: 'json', fallback: {} };
		assert.equal(validateAttrValue(jsonEntry, '{"ok":true}', 'data-ln-cfg', 'ln-test'), true);
		assert.equal(validateAttrValue(jsonEntry, '{unclosed', 'data-ln-cfg', 'ln-test'), false);
	} finally {
		console.warn = origWarn;
	}
});

test('isDevMode evaluates dynamically without stale memoization and scopes to debug hosts', async () => {
	const { isDevMode } = await import('../components/ln-core/helpers.js');
	const origWindow = global.window;
	const origDocument = global.document;

	try {
		global.window = {};
		global.document = {
			documentElement: { hasAttribute: (a) => a === 'data-ln-debug' },
			body: { hasAttribute: () => false }
		};
		// <html> is explicitly NOT a supported host per gate.js:18-32
		assert.equal(isDevMode(), false, 'Must reject html[data-ln-debug]');

		// Toggle on via document.body
		global.document.body.hasAttribute = (a) => a === 'data-ln-debug';
		assert.equal(isDevMode(), true, 'Must detect body[data-ln-debug] dynamically');

		// Toggle off on body
		global.document.body.hasAttribute = () => false;
		assert.equal(isDevMode(), false, 'Must return false when body has no debug attribute');

		// Scoped element check
		const insideEl = { closest: (sel) => sel === '[data-ln-debug]' ? {} : null };
		const outsideEl = { closest: () => null };
		const htmlScopedEl = { closest: (sel) => sel === '[data-ln-debug]' ? global.document.documentElement : null };
		assert.equal(isDevMode(insideEl), true, 'Element contained in debug host must be dev mode');
		assert.equal(isDevMode(outsideEl), false, 'Element outside debug host must not be dev mode');
		assert.equal(isDevMode(htmlScopedEl), false, 'Element whose closest debug host is html must be rejected');

		// Global toggle on via window.lnDebug
		global.window.lnDebug = true;
		assert.equal(isDevMode(), true, 'Must detect window.lnDebug');
		assert.equal(isDevMode(outsideEl), true, 'window.lnDebug overrides element scope');
	} finally {
		global.window = origWindow;
		global.document = origDocument;
	}
});

test('registerComponent validates each element once without duplicate warnings on nested hosts', async () => {
	const { registerComponent } = await import('../components/ln-core/helpers.js');
	const origWindow = global.window;
	const origDocument = global.document;

	const warnings = [];
	const origWarn = console.warn;
	console.warn = (...args) => warnings.push(args.join(' '));

	const origMutationObserver = global.MutationObserver;

	try {
		global.window = { lnDebug: true };
		global.MutationObserver = class { observe() {} disconnect() {} };

		// Mock DOM: outer and inner nested elements
		const innerEl = {
			tagName: 'DIV',
			getAttribute(name) { return name === 'data-ln-nest' ? 'bad_val' : null; },
			hasAttribute(name) { return name === 'data-ln-nest'; },
			matches(sel) { return sel === '[data-ln-nest]' || sel === 'data-ln-nest'; },
			querySelectorAll() { return []; }
		};

		const outerEl = {
			tagName: 'DIV',
			getAttribute(name) { return name === 'data-ln-nest' ? 'open' : null; },
			hasAttribute(name) { return name === 'data-ln-nest'; },
			matches(sel) { return sel === '[data-ln-nest]' || sel === 'data-ln-nest'; },
			querySelectorAll(sel) {
				if (sel === '[data-ln-nest]') return [innerEl];
				return [];
			}
		};

		const mockRoot = {
			matches() { return false; },
			querySelectorAll(sel) {
				if (sel === '[data-ln-nest]' || sel === 'data-ln-nest') return [outerEl, innerEl];
				return [];
			}
		};

		global.document = {
			body: mockRoot
		};

		function DummyComp(dom) { this.dom = dom; dom.lnNest = this; }

		registerComponent('data-ln-nest', 'lnNest', DummyComp, 'ln-nest', {
			attributes: {
				'data-ln-nest': { type: 'enum', values: ['open', 'close'], fallback: 'close' }
			}
		});

		// registerComponent automatically boots on document.body (mockRoot)

		// innerEl had "bad_val" -> should only emit ONE warning, NOT multiple warnings!
		const badValWarnings = warnings.filter(w => w.includes('Invalid value "bad_val"'));
		assert.equal(badValWarnings.length, 1, 'Must emit exactly one warning for nested host');
	} finally {
		console.warn = origWarn;
		global.window = origWindow;
		global.document = origDocument;
		global.MutationObserver = origMutationObserver;
	}
});

test('hasActiveDebug detects debug activation dynamically and bypasses when inactive', async () => {
	const { hasActiveDebug } = await import('../components/ln-core/helpers.js');
	const origWindow = global.window;
	const origDocument = global.document;

	try {
		global.window = {};
		global.document = {
			body: {
				hasAttribute: () => false,
				querySelector: () => null
			}
		};

		assert.equal(hasActiveDebug(), false, 'Inactive when no debug flags exist');

		// window.lnDebug
		global.window.lnDebug = true;
		assert.equal(hasActiveDebug(), true);
		global.window.lnDebug = false;

		// body attribute
		global.document.body.hasAttribute = (a) => a === 'data-ln-debug';
		assert.equal(hasActiveDebug(), true);
		global.document.body.hasAttribute = () => false;

		// nested debug host in DOM
		global.document.body.querySelector = (s) => s === '[data-ln-debug]' ? {} : null;
		assert.equal(hasActiveDebug(), true);
		global.document.body.querySelector = () => null;

		// _debugSink active
		global.window.lnCore = { _debugSink: () => {} };
		assert.equal(hasActiveDebug(), true);
	} finally {
		global.window = origWindow;
		global.document = origDocument;
	}
});

test('ln-confirm state enum accepts "confirming" without warnings', () => {
	const warnings = [];
	const origWarn = console.warn;
	console.warn = (...args) => warnings.push(args.join(' '));

	try {
		const confirmStateEntry = { type: 'enum', values: ['confirming'] };
		assert.equal(validateAttrValue(confirmStateEntry, 'confirming', 'data-ln-confirm-state', 'ln-confirm'), true);
		assert.equal(warnings.length, 0, 'Must not warn on valid "confirming" state');

		// Invalid value still warns
		assert.equal(validateAttrValue(confirmStateEntry, 'invalid', 'data-ln-confirm-state', 'ln-confirm'), false);
		assert.equal(warnings.length, 1);
	} finally {
		console.warn = origWarn;
	}
});
