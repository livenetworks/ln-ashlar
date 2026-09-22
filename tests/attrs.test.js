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

		// Boolean presence
		assert.equal(validateAttrValue({ type: 'boolean' }, '', 'data-ln-bool', 'ln-test'), true);
		assert.equal(validateAttrValue({ type: 'boolean' }, 'false', 'data-ln-bool', 'ln-test'), false);
		assert.ok(warnings.some(w => w.includes('Boolean attribute') && w.includes('should be valueless')));

		// Enum
		warnings.length = 0;
		const enumEntry = { type: 'enum', values: ['open', 'close'], fallback: 'close' };
		assert.equal(validateAttrValue(enumEntry, 'open', 'data-ln-state', 'ln-modal'), true);
		assert.equal(validateAttrValue(enumEntry, 'invalid', 'data-ln-state', 'ln-modal'), false);
		assert.ok(warnings.some(w => w.includes('[ln-modal]') && w.includes('Invalid value "invalid"')));

		// Integer with bounds
		warnings.length = 0;
		const intEntry = { type: 'integer', fallback: 10, min: 1, max: 100 };
		assert.equal(validateAttrValue(intEntry, '50', 'data-ln-count', 'ln-test'), true);
		assert.equal(validateAttrValue(intEntry, 'abc', 'data-ln-count', 'ln-test'), false);
		assert.equal(validateAttrValue(intEntry, '0', 'data-ln-count', 'ln-test'), false);
		assert.equal(validateAttrValue(intEntry, '150', 'data-ln-count', 'ln-test'), false);

		// Float
		warnings.length = 0;
		const floatEntry = { type: 'float', fallback: 0.0 };
		assert.equal(validateAttrValue(floatEntry, '3.14', 'data-ln-pi', 'ln-test'), true);
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
