import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VALID_ATTRIBUTES } from '../components/ln-debug/src/generated-attributes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

test('schemas: ln-ashlar.html-data.json is valid and covers all attributes', () => {
	const filePath = path.join(root, 'ln-ashlar.html-data.json');
	assert.ok(fs.existsSync(filePath), 'ln-ashlar.html-data.json must exist');

	const content = fs.readFileSync(filePath, 'utf8');
	const data = JSON.parse(content);

	assert.equal(data.version, 1.1);
	assert.ok(Array.isArray(data.globalAttributes), 'globalAttributes must be an array');
	assert.ok(data.globalAttributes.length >= VALID_ATTRIBUTES.size, `Must contain all ${VALID_ATTRIBUTES.size} attributes`);

	const attrMap = new Map();
	for (const attr of data.globalAttributes) {
		assert.ok(attr.name.startsWith('data-ln-'), `Attribute name must start with data-ln-: ${attr.name}`);
		assert.ok(typeof attr.description === 'string' && attr.description.length > 0, `Description required: ${attr.name}`);
		attrMap.set(attr.name, attr);
	}

	for (const expected of VALID_ATTRIBUTES) {
		assert.ok(attrMap.has(expected), `Missing attribute in html-data.json: ${expected}`);
	}

	// Verify enum values mapping
	const modalAttr = attrMap.get('data-ln-modal');
	assert.ok(modalAttr, 'data-ln-modal must exist');
	assert.ok(Array.isArray(modalAttr.values), 'data-ln-modal must have values array');
	const modalValues = modalAttr.values.map(v => v.name);
	assert.ok(modalValues.includes('open') && modalValues.includes('close'), 'data-ln-modal values must include open and close');
});

test('schemas: web-types.json is valid and conforms to JetBrains Web-Types specification', () => {
	const filePath = path.join(root, 'web-types.json');
	assert.ok(fs.existsSync(filePath), 'web-types.json must exist');

	const content = fs.readFileSync(filePath, 'utf8');
	const data = JSON.parse(content);

	assert.equal(data.$schema, 'https://json.schemastore.org/web-types');
	assert.equal(data.name, '@livenetworks/ashlar');
	assert.ok(data.contributions && data.contributions.html && Array.isArray(data.contributions.html.attributes));

	const attributes = data.contributions.html.attributes;
	assert.ok(attributes.length >= VALID_ATTRIBUTES.size);

	const attrMap = new Map();
	for (const attr of attributes) {
		assert.ok(attr.name.startsWith('data-ln-'));
		assert.ok(attr.value && typeof attr.value.type === 'string');
		attrMap.set(attr.name, attr);
	}

	for (const expected of VALID_ATTRIBUTES) {
		assert.ok(attrMap.has(expected), `Missing attribute in web-types.json: ${expected}`);
	}

	// Check enum type
	const modalAttr = attrMap.get('data-ln-modal');
	assert.equal(modalAttr.value.type, 'enum');
	assert.ok(modalAttr.value.items.includes('open') && modalAttr.value.items.includes('close'));
});

test('schemas: ln-ashlar.xsd is well-formed XML and contains valid XSD schema elements', () => {
	const filePath = path.join(root, 'ln-ashlar.xsd');
	assert.ok(fs.existsSync(filePath), 'ln-ashlar.xsd must exist');

	const content = fs.readFileSync(filePath, 'utf8');

	assert.ok(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must start with XML declaration');
	assert.ok(content.includes('<xs:schema'), 'Must declare xs:schema root');
	assert.ok(content.endsWith('</xs:schema>\n') || content.endsWith('</xs:schema>'), 'Must terminate with </xs:schema>');
	assert.ok(content.includes('targetNamespace="https://livenetworks.mk/schema/ln-ashlar"'));
	assert.ok(content.includes('<xs:attributeGroup name="lnAshlarAttributes">'));

	// Check tag balance for basic XML well-formedness
	const openMatches = content.match(/<xs:([a-zA-Z]+)(?=[ >/])/g) || [];
	const closeMatches = content.match(/<\/xs:([a-zA-Z]+)>/g) || [];
	const selfCloseMatches = content.match(/<xs:([a-zA-Z]+)[^>]*\/>/g) || [];

	const openTags = openMatches.length;
	const closeTags = closeMatches.length;
	const selfCloseTags = selfCloseMatches.length;

	assert.equal(openTags, closeTags + selfCloseTags, 'Opening and closing XML tags must balance');

	// Verify all attributes are referenced in attributeGroup and defined as global attributes
	for (const expected of VALID_ATTRIBUTES) {
		assert.ok(content.includes(`<xs:attribute ref="${expected}"/>`), `AttributeGroup must reference ${expected}`);
		assert.ok(content.includes(`<xs:attribute name="${expected}"`), `Global attribute must define ${expected}`);
	}
});
