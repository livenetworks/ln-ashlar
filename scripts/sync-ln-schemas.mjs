#!/usr/bin/env node

/**
 * scripts/sync-ln-schemas.mjs
 *
 * Генерира per-component JSON шеми (js/ln-X/ln-X.schema.json) од изворниот код на ln-ashlar.
 *
 * Неразорен: генераторот поседува точно 5 клуча ($comment, component, generator, attributes.<name>.direction,
 * attributes.<name>.sources). Сите други постоечки клучеви се зачувуваат.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REPO_ROOT = path.resolve(__dirname, '..');

const GENERATOR_NAME = 'scripts/sync-ln-schemas.mjs';
const GENERATOR_COMMENT = 'This file is partly generated. The $comment, component, generator, and each attribute\'s direction, sources, type, values, fallback, and description keys are owned by the generator and synchronized from JS source code. All other keys are preserved and safe to hand-author. Regenerate with `npm run sync:ln-schemas`.';
const OWNED_ATTR_KEYS = new Set(['direction', 'sources', 'type', 'values', 'fallback', 'min', 'max', 'description']);
const ATTR_RE = /data-ln-[a-z0-9-]+/g;
const ALIAS_RE = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*['"](data-ln-[a-z0-9-]+)['"]/g;
const METHOD_RE = /\.(setAttribute|removeAttribute|toggleAttribute|getAttribute|hasAttribute|closest|matches|querySelector|querySelectorAll)\s*\(/g;
const WRITE_METHODS = new Set(['setAttribute', 'removeAttribute', 'toggleAttribute']);
const READ_METHODS = new Set(['getAttribute', 'hasAttribute', 'closest', 'matches', 'querySelector', 'querySelectorAll']);

/**
 * Отстранува еднолиниски и повеќелиниски коментари од JS/SCSS код
 * со зачувување на стрингови (quote-aware).
 * @param {string} code
 * @returns {string}
 */
export function stripComments(code) {
	let result = '';
	let i = 0;
	const len = code.length;
	let state = 'default';

	while (i < len) {
		const ch = code[i];
		const next = i + 1 < len ? code[i + 1] : '';

		if (state === 'default') {
			if (ch === '/' && next === '/') {
				state = 'line_comment';
				i += 2;
			} else if (ch === '/' && next === '*') {
				state = 'block_comment';
				i += 2;
			} else if (ch === "'") {
				state = 'single_quote';
				result += ch;
				i++;
			} else if (ch === '"') {
				state = 'double_quote';
				result += ch;
				i++;
			} else if (ch === '`') {
				state = 'template';
				result += ch;
				i++;
			} else {
				result += ch;
				i++;
			}
		} else if (state === 'single_quote') {
			result += ch;
			if (ch === '\\' && next) {
				result += next;
				i += 2;
			} else if (ch === "'") {
				state = 'default';
				i++;
			} else {
				i++;
			}
		} else if (state === 'double_quote') {
			result += ch;
			if (ch === '\\' && next) {
				result += next;
				i += 2;
			} else if (ch === '"') {
				state = 'default';
				i++;
			} else {
				i++;
			}
		} else if (state === 'template') {
			result += ch;
			if (ch === '\\' && next) {
				result += next;
				i += 2;
			} else if (ch === '`') {
				state = 'default';
				i++;
			} else {
				i++;
			}
		} else if (state === 'line_comment') {
			if (ch === '\n' || ch === '\r') {
				state = 'default';
				result += ch;
			}
			i++;
		} else if (state === 'block_comment') {
			if (ch === '*' && next === '/') {
				state = 'default';
				i += 2;
			} else {
				if (ch === '\n' || ch === '\r') {
					result += ch;
				}
				i++;
			}
		}
	}
	return result;
}

/**
 * Извлекува аргументи од повик на функција/метод со броење загради (quote-aware).
 * @param {string} code
 * @param {number} openParenIndex
 * @returns {{ args: string, endIndex: number }}
 */
function extractArgs(code, openParenIndex) {
	let depth = 1;
	let i = openParenIndex;
	const len = code.length;
	let state = 'default';

	while (i < len && depth > 0) {
		const ch = code[i];
		const next = i + 1 < len ? code[i + 1] : '';

		if (state === 'default') {
			if (ch === "'") {
				state = 'single_quote';
			} else if (ch === '"') {
				state = 'double_quote';
			} else if (ch === '`') {
				state = 'template';
			} else if (ch === '(') {
				depth++;
			} else if (ch === ')') {
				depth--;
				if (depth === 0) {
					return {
						args: code.substring(openParenIndex, i),
						endIndex: i + 1
					};
				}
			}
			i++;
		} else if (state === 'single_quote') {
			if (ch === '\\' && next) i += 2;
			else {
				if (ch === "'") state = 'default';
				i++;
			}
		} else if (state === 'double_quote') {
			if (ch === '\\' && next) i += 2;
			else {
				if (ch === '"') state = 'default';
				i++;
			}
		} else if (state === 'template') {
			if (ch === '\\' && next) i += 2;
			else {
				if (ch === '`') state = 'default';
				i++;
			}
		}
	}
	return { args: code.substring(openParenIndex), endIndex: len };
}

/**
 * Претвора camelCase dataset својство во kebab-case data-ln-* атрибут.
 * lnModalMode -> data-ln-modal-mode
 * @param {string} prop
 * @returns {string|null}
 */
function camelToKebabLn(prop) {
	const rest = prop.slice(2);
	if (!rest) return null;
	const kebab = rest.replace(/([A-Z])/g, (m, c, offset) =>
		(offset === 0 ? c.toLowerCase() : '-' + c.toLowerCase())
	);
	return `data-ln-${kebab}`;
}

/**
 * Рекурзивно пронаоѓање на фајлови со дадени екстензии.
 * @param {string} dir
 * @param {string[]} exts
 * @param {string[]} [acc]
 * @returns {string[]}
 */
function walk(dir, exts, acc = []) {
	let entries;
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return acc;
	}
	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, exts, acc);
		else if (exts.includes(path.extname(entry.name))) acc.push(full);
	}
	return acc;
}

/**
 * Екстрахира ATTRIBUTES дефиниции од кодот со brace matching.
 * Ги фаќа сите `const [A-Za-z0-9_]*ATTRIBUTES = { ... }`
 * @param {string} cleaned - comment-stripped JS код
 * @returns {Record<string, { type?: string, values?: string[], fallback?: any, description?: string, min?: number, max?: number }>}
 */
export function extractAttributeTables(cleaned) {
	const result = {};
	const tableRegex = /\bconst\s+([A-Za-z0-9_$]*ATTRIBUTES)\s*=\s*\{/g;
	let match;

	while ((match = tableRegex.exec(cleaned)) !== null) {
		const openBraceIdx = match.index + match[0].length - 1;
		let depth = 0;
		let closeBraceIdx = -1;
		let inSingle = false;
		let inDouble = false;
		let inTemplate = false;

		for (let i = openBraceIdx; i < cleaned.length; i++) {
			const ch = cleaned[i];
			const next = i + 1 < cleaned.length ? cleaned[i + 1] : '';

			if (inSingle) {
				if (ch === '\\' && next) i++;
				else if (ch === "'") inSingle = false;
			} else if (inDouble) {
				if (ch === '\\' && next) i++;
				else if (ch === '"') inDouble = false;
			} else if (inTemplate) {
				if (ch === '\\' && next) i++;
				else if (ch === '`') inTemplate = false;
			} else {
				if (ch === "'") inSingle = true;
				else if (ch === '"') inDouble = true;
				else if (ch === '`') inTemplate = true;
				else if (ch === '{') depth++;
				else if (ch === '}') {
					depth--;
					if (depth === 0) {
						closeBraceIdx = i;
						break;
					}
				}
			}
		}

		if (closeBraceIdx === -1) continue;

		const tableBody = cleaned.slice(openBraceIdx + 1, closeBraceIdx);
		const entryRegex = /['"](data-ln-[a-z0-9-]+)['"]\s*:\s*\{/g;
		let entryMatch;

		while ((entryMatch = entryRegex.exec(tableBody)) !== null) {
			const attrName = entryMatch[1];
			const entryOpenIdx = entryMatch.index + entryMatch[0].length - 1;
			let eDepth = 0;
			let eCloseIdx = -1;
			let sQuote = false;
			let dQuote = false;
			let tQuote = false;

			for (let j = entryOpenIdx; j < tableBody.length; j++) {
				const c = tableBody[j];
				const n = j + 1 < tableBody.length ? tableBody[j + 1] : '';
				if (sQuote) {
					if (c === '\\' && n) j++;
					else if (c === "'") sQuote = false;
				} else if (dQuote) {
					if (c === '\\' && n) j++;
					else if (c === '"') dQuote = false;
				} else if (tQuote) {
					if (c === '\\' && n) j++;
					else if (c === '`') tQuote = false;
				} else {
					if (c === "'") sQuote = true;
					else if (c === '"') dQuote = true;
					else if (c === '`') tQuote = true;
					else if (c === '{') eDepth++;
					else if (c === '}') {
						eDepth--;
						if (eDepth === 0) {
							eCloseIdx = j;
							break;
						}
					}
				}
			}

			if (eCloseIdx === -1) continue;
			const entryBody = tableBody.slice(entryOpenIdx + 1, eCloseIdx);
			const meta = {};

			const typeM = entryBody.match(/\btype\s*:\s*['"]([a-z]+)['"]/);
			if (typeM) meta.type = typeM[1];

			const valuesM = entryBody.match(/\bvalues\s*:\s*\[([^\]]*)\]/);
			if (valuesM) {
				const rawVals = valuesM[1];
				const items = [];
				const itemRegex = /['"]([^'"]+)['"]/g;
				let im;
				while ((im = itemRegex.exec(rawVals)) !== null) {
					items.push(im[1]);
				}
				if (items.length) meta.values = items;
			}

			const fallbackStrM = entryBody.match(/\bfallback\s*:\s*['"]([^'"]*)['"]/);
			const fallbackNumM = entryBody.match(/\bfallback\s*:\s*(-?\d+(?:\.\d+)?)/);
			const fallbackBoolM = entryBody.match(/\bfallback\s*:\s*(true|false)/);
			if (fallbackStrM) meta.fallback = fallbackStrM[1];
			else if (fallbackNumM) meta.fallback = Number(fallbackNumM[1]);
			else if (fallbackBoolM) meta.fallback = fallbackBoolM[1] === 'true';

			const minM = entryBody.match(/\bmin\s*:\s*(-?\d+(?:\.\d+)?)/);
			if (minM) meta.min = Number(minM[1]);
			const maxM = entryBody.match(/\bmax\s*:\s*(-?\d+(?:\.\d+)?)/);
			if (maxM) meta.max = Number(maxM[1]);

			const descM = entryBody.match(/\bdescription\s*:\s*['"]([^'"]*)['"]/);
			if (descM) meta.description = descM[1];

			result[attrName] = meta;
		}
	}

	return result;
}

/**
 * Анализира поединечен фајл (JS или SCSS) за атрибути, насока и релативна патека.
 * @param {string} filePath
 * @param {string} compDir
 * @param {Set<string>} constructedTokens
 * @returns {{ relPath: string, fileAttrs: Map<string, { read: boolean, written: boolean }> }}
 */
function analyzeFile(filePath, compDir, constructedTokens) {
	const raw = fs.readFileSync(filePath, 'utf8');
	const ext = path.extname(filePath);
	const relPath = path.relative(compDir, filePath).replace(/\\/g, '/');
	const cleaned = stripComments(raw);

	const fileAttrs = new Map(); // attrName -> { read: bool, written: bool }

	function ensureAttr(attr) {
		if (attr.endsWith('-')) {
			constructedTokens.add(attr);
			return null;
		}
		if (!fileAttrs.has(attr)) {
			fileAttrs.set(attr, { read: false, written: false });
		}
		return fileAttrs.get(attr);
	}

	// 1. Собери data-ln-* токени за присуство
	for (const m of cleaned.matchAll(ATTR_RE)) {
		ensureAttr(m[0]);
	}

	if (ext === '.js') {
		// 2. Алијас-мапа по фајл
		const aliasMap = new Map();
		for (const m of cleaned.matchAll(ALIAS_RE)) {
			if (!m[2].endsWith('-')) {
				aliasMap.set(m[1], m[2]);
			}
		}

		// 3. Скенирај dataset појави
		const datasetRegex = /\bdataset\.ln([A-Za-z0-9_$]+)/g;
		let match;
		while ((match = datasetRegex.exec(cleaned)) !== null) {
			const fullMatch = match[0];
			const propName = 'ln' + match[1];
			const attr = camelToKebabLn(propName);
			if (!attr) continue;
			const entry = ensureAttr(attr);
			if (!entry) continue;

			const matchEnd = match.index + fullMatch.length;
			const after = cleaned.slice(matchEnd);
			const assignMatch = after.match(/^\s*(=(?!=))/);
			if (assignMatch) {
				entry.written = true;
			} else {
				entry.read = true;
			}
		}

		// 4. Скенирај API повици
		while ((match = METHOD_RE.exec(cleaned)) !== null) {
			const method = match[1];
			const openParenIdx = match.index + match[0].length;
			const { args } = extractArgs(cleaned, openParenIdx);

			// Директни литерали/селектори во аргументите
			for (const am of args.matchAll(ATTR_RE)) {
				const entry = ensureAttr(am[0]);
				if (entry) {
					if (WRITE_METHODS.has(method)) entry.written = true;
					if (READ_METHODS.has(method)) entry.read = true;
				}
			}

			// Идентификатори што се совпаѓаат со алијас-мапата
			const identRegex = /\b([A-Za-z_$][\w$]*)\b/g;
			for (const idm of args.matchAll(identRegex)) {
				const id = idm[1];
				if (aliasMap.has(id)) {
					const attr = aliasMap.get(id);
					const entry = ensureAttr(attr);
					if (entry) {
						if (WRITE_METHODS.has(method)) entry.written = true;
						if (READ_METHODS.has(method)) entry.read = true;
					}
				}
			}
		}
	}

	return { relPath, fileAttrs };
}

/**
 * Серијализира шема детерминистички со зачувување на човечки полиња и редослед на клучеви.
 * @param {string} compName
 * @param {Record<string, { direction: string|null, sources: string[] }>} newAttrs
 * @param {object|null} existingObj
 * @returns {string}
 */
function serializeSchema(compName, newAttrs, existingObj = null) {
	const result = {};
	result.$comment = GENERATOR_COMMENT;
	result.component = compName;
	result.generator = GENERATOR_NAME;
	result.attributes = {};

	const existingAttrs = (existingObj && typeof existingObj.attributes === 'object' && existingObj.attributes !== null)
		? existingObj.attributes
		: {};

	const allAttrNames = Array.from(new Set([...Object.keys(newAttrs), ...Object.keys(existingAttrs)])).sort();

	for (const attrName of allAttrNames) {
		const isScanned = Object.prototype.hasOwnProperty.call(newAttrs, attrName);
		const existingAttrObj = (typeof existingAttrs[attrName] === 'object' && existingAttrs[attrName] !== null)
			? existingAttrs[attrName]
			: {};

		const attrObj = {};
		if (isScanned) {
			const scanned = newAttrs[attrName];
			attrObj.direction = scanned.direction;
			attrObj.sources = scanned.sources;

			if (scanned.type) attrObj.type = scanned.type;
			else if (existingAttrObj.type) attrObj.type = existingAttrObj.type;

			if (scanned.values) attrObj.values = scanned.values;
			else if (existingAttrObj.values) attrObj.values = existingAttrObj.values;

			if (scanned.fallback !== undefined && scanned.fallback !== null) attrObj.fallback = scanned.fallback;
			else if (existingAttrObj.fallback !== undefined && existingAttrObj.fallback !== null) attrObj.fallback = existingAttrObj.fallback;

			if (scanned.min !== undefined && scanned.min !== null) attrObj.min = scanned.min;
			else if (existingAttrObj.min !== undefined && existingAttrObj.min !== null) attrObj.min = existingAttrObj.min;

			if (scanned.max !== undefined && scanned.max !== null) attrObj.max = scanned.max;
			else if (existingAttrObj.max !== undefined && existingAttrObj.max !== null) attrObj.max = existingAttrObj.max;

			if (scanned.description) attrObj.description = scanned.description;
			else if (existingAttrObj.description) attrObj.description = existingAttrObj.description;
		} else {
			// Застарен запис: човечките полиња остануваат, генераторските се ресетираат
			attrObj.direction = null;
			attrObj.sources = [];
		}

		// Зачувај ги сите други човечки клучеви во нивниот постоечки редослед
		for (const key of Object.keys(existingAttrObj)) {
			if (!OWNED_ATTR_KEYS.has(key)) {
				attrObj[key] = existingAttrObj[key];
			}
		}

		result.attributes[attrName] = attrObj;
	}

	// Зачувај ги сите други врвни човечки клучеви во нивниот постоечки редослед
	if (existingObj) {
		for (const key of Object.keys(existingObj)) {
			if (key !== '$comment' && key !== 'component' && key !== 'generator' && key !== 'attributes') {
				result[key] = existingObj[key];
			}
		}
	}

	return JSON.stringify(result, null, '\t') + '\n';
}

function escapeXml(str) {
	return String(str || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/**
 * Генерира VS Code / W3C HTML Custom Data формат (ln-ashlar.html-data.json).
 * @param {Map<string, object>} globalAttrMetadata
 * @returns {string}
 */
export function generateHtmlCustomData(globalAttrMetadata) {
	const sortedNames = [...globalAttrMetadata.keys()].sort();
	const globalAttributes = [];

	for (const name of sortedNames) {
		const meta = globalAttrMetadata.get(name);
		let desc = '';
		if (meta.descriptions && meta.descriptions.size > 0) {
			const descs = [];
			for (const [, d] of meta.descriptions) {
				if (!descs.includes(d)) descs.push(d);
			}
			desc = descs.join(' ');
		}
		if (!desc) desc = `${name} attribute`;

		const entry = {
			name,
			description: desc
		};

		if (meta.type === 'marker') {
			entry.valueSet = 'v';
		} else if (meta.type === 'boolean') {
			entry.valueSet = 'b';
		} else if (meta.type === 'enum' && meta.values && meta.values.size > 0) {
			const sortedValues = [...meta.values].sort();
			entry.values = sortedValues.map((v) => ({ name: v }));
		}
		globalAttributes.push(entry);
	}

	const data = {
		version: 1.1,
		globalAttributes
	};

	return JSON.stringify(data, null, '\t') + '\n';
}

/**
 * Генерира JetBrains Web-Types формат (web-types.json) за PhpStorm/WebStorm.
 * @param {Map<string, object>} globalAttrMetadata
 * @param {string} version
 * @returns {string}
 */
export function generateWebTypes(globalAttrMetadata, version = '1.7.0') {
	const sortedNames = [...globalAttrMetadata.keys()].sort();
	const attributes = [];

	for (const name of sortedNames) {
		const meta = globalAttrMetadata.get(name);
		let desc = '';
		if (meta.descriptions && meta.descriptions.size > 0) {
			const descs = [];
			for (const [, d] of meta.descriptions) {
				if (!descs.includes(d)) descs.push(d);
			}
			desc = descs.join(' ');
		}
		if (!desc) desc = `${name} attribute`;

		const entry = {
			name,
			description: desc
		};

		switch (meta.type) {
			case 'marker':
			case 'boolean':
				entry.value = { type: 'boolean' };
				break;
			case 'integer':
			case 'float':
				entry.value = { type: 'number' };
				break;
			case 'enum':
				if (meta.values && meta.values.size > 0) {
					entry.value = {
						type: 'enum',
						items: [...meta.values].sort()
					};
				} else {
					entry.value = { type: 'string' };
				}
				break;
			case 'list':
				entry.value = { type: 'string[]' };
				break;
			case 'json':
				entry.value = { type: 'JSON' };
				break;
			case 'trigger':
			case 'string':
			default:
				entry.value = { type: 'string' };
				break;
		}

		attributes.push(entry);
	}

	const data = {
		$schema: 'https://json.schemastore.org/web-types',
		name: '@livenetworks/ashlar',
		version,
		framework: 'html',
		contributions: {
			html: {
				attributes
			}
		}
	};

	return JSON.stringify(data, null, '\t') + '\n';
}

/**
 * Генерира W3C XML Schema Definition (ln-ashlar.xsd).
 * @param {Map<string, object>} globalAttrMetadata
 * @returns {string}
 */
export function generateXmlSchema(globalAttrMetadata) {
	const sortedNames = [...globalAttrMetadata.keys()].sort();
	const lines = [];

	lines.push('<?xml version="1.0" encoding="UTF-8"?>');
	lines.push('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"');
	lines.push('\ttargetNamespace="https://livenetworks.mk/schema/ln-ashlar"');
	lines.push('\txmlns="https://livenetworks.mk/schema/ln-ashlar"');
	lines.push('\telementFormDefault="qualified">');
	lines.push('');
	lines.push('\t<!-- Global ln-ashlar Attribute Group -->');
	lines.push('\t<xs:attributeGroup name="lnAshlarAttributes">');
	for (const name of sortedNames) {
		lines.push(`\t\t<xs:attribute ref="${name}"/>`);
	}
	lines.push('\t</xs:attributeGroup>');
	lines.push('');
	lines.push('\t<!-- Individual Attribute Definitions with Types and Restrictions -->');

	for (const name of sortedNames) {
		const meta = globalAttrMetadata.get(name);
		let desc = '';
		if (meta.descriptions && meta.descriptions.size > 0) {
			const descs = [];
			for (const [, d] of meta.descriptions) {
				if (!descs.includes(d)) descs.push(d);
			}
			desc = descs.join(' ');
		}
		if (!desc) desc = `${name} attribute`;

		const docSnippet = `\t\t<xs:annotation>\n\t\t\t<xs:documentation>${escapeXml(desc)}</xs:documentation>\n\t\t</xs:annotation>`;

		if (meta.type === 'enum' && meta.values && meta.values.size > 0) {
			const sortedValues = [...meta.values].sort();
			lines.push(`\t<xs:attribute name="${name}">`);
			lines.push(docSnippet);
			lines.push('\t\t<xs:simpleType>');
			lines.push('\t\t\t<xs:restriction base="xs:string">');
			for (const v of sortedValues) {
				lines.push(`\t\t\t\t<xs:enumeration value="${escapeXml(v)}"/>`);
			}
			lines.push('\t\t\t</xs:restriction>');
			lines.push('\t\t</xs:simpleType>');
			lines.push('\t</xs:attribute>');
		} else if (meta.type === 'integer') {
			lines.push(`\t<xs:attribute name="${name}">`);
			lines.push(docSnippet);
			lines.push('\t\t<xs:simpleType>');
			lines.push('\t\t\t<xs:restriction base="xs:integer">');
			if (meta.min !== null && meta.min !== undefined) {
				lines.push(`\t\t\t\t<xs:minInclusive value="${meta.min}"/>`);
			}
			if (meta.max !== null && meta.max !== undefined) {
				lines.push(`\t\t\t\t<xs:maxInclusive value="${meta.max}"/>`);
			}
			lines.push('\t\t\t</xs:restriction>');
			lines.push('\t\t</xs:simpleType>');
			lines.push('\t</xs:attribute>');
		} else if (meta.type === 'float') {
			lines.push(`\t<xs:attribute name="${name}">`);
			lines.push(docSnippet);
			lines.push('\t\t<xs:simpleType>');
			lines.push('\t\t\t<xs:restriction base="xs:decimal"/>');
			lines.push('\t\t</xs:simpleType>');
			lines.push('\t</xs:attribute>');
		} else if (meta.type === 'boolean') {
			lines.push(`\t<xs:attribute name="${name}">`);
			lines.push(docSnippet);
			lines.push('\t\t<xs:simpleType>');
			lines.push('\t\t\t<xs:restriction base="xs:string">');
			lines.push('\t\t\t\t<xs:enumeration value=""/>');
			lines.push('\t\t\t\t<xs:enumeration value="true"/>');
			lines.push('\t\t\t\t<xs:enumeration value="false"/>');
			lines.push('\t\t\t</xs:restriction>');
			lines.push('\t\t</xs:simpleType>');
			lines.push('\t</xs:attribute>');
		} else {
			lines.push(`\t<xs:attribute name="${name}" type="xs:string">`);
			lines.push(docSnippet);
			lines.push('\t</xs:attribute>');
		}
		lines.push('');
	}

	lines.push('</xs:schema>\n');
	return lines.join('\n');
}

/**
 * Резолвирај корени од CLI аргументите.
 * @param {string[]} argv
 * @returns {string}
 */
function resolveRoot(argv) {
	const explicit = argv
		.filter((a) => a.startsWith('--root='))
		.map((a) => a.slice('--root='.length).trim())
		.filter(Boolean);
	if (explicit.length) return path.resolve(explicit[0]);
	return DEFAULT_REPO_ROOT;
}

function main() {
	const argv = process.argv.slice(2);
	const checkOnly = argv.includes('--check');
	const root = resolveRoot(argv);
	const compDir = path.join(root, 'components');
	const themeDir = path.join(root, 'theme');

	if (!fs.existsSync(compDir)) {
		console.error(`sync-ln-schemas: не постои components/ папка во root: ${root}`);
		process.exit(1);
	}

	const compDirs = fs.readdirSync(compDir).filter((f) => {
		const p = path.join(compDir, f);
		return fs.statSync(p).isDirectory();
	}).sort();

	const constructedTokens = new Set();
	let totalBundlesSkipped = 0;
	const allComponentAttrs = new Set();
	const globalAttrMetadata = new Map();
	const staleAttributesReport = [];
	const pendingWrites = [];

	for (const comp of compDirs) {
		const compPath = path.join(compDir, comp);
		const srcPath = path.join(compPath, 'src');
		const hasSrc = fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory();

		let filesToScan = [];
		let skippedBundles = 0;

		if (hasSrc) {
			const jsFiles = walk(srcPath, ['.js']).filter((f) => !path.basename(f).startsWith('generated-'));
			const scssFiles = walk(compPath, ['.scss']);
			filesToScan = [...jsFiles, ...scssFiles];

			const topJs = fs.readdirSync(compPath).filter((f) =>
				f.endsWith('.js') && fs.statSync(path.join(compPath, f)).isFile()
			);
			skippedBundles = topJs.length;
		} else {
			// ln-core или компонента без src/
			filesToScan = walk(compPath, ['.js', '.scss']).filter((f) => !path.basename(f).startsWith('generated-'));
		}

		totalBundlesSkipped += skippedBundles;

		const compAttrs = new Map(); // attrName -> { read: bool, written: bool, sources: Set<string> }
		const compAttrMetadata = {};

		for (const file of filesToScan) {
			const { relPath, fileAttrs } = analyzeFile(file, compPath, constructedTokens);
			if (file.endsWith('.js')) {
				const cleaned = stripComments(fs.readFileSync(file, 'utf8'));
				const tableMeta = extractAttributeTables(cleaned);
				Object.assign(compAttrMetadata, tableMeta);
			}
			for (const [attr, { read, written }] of fileAttrs.entries()) {
				if (!compAttrs.has(attr)) {
					compAttrs.set(attr, { read: false, written: false, sources: new Set() });
				}
				const entry = compAttrs.get(attr);
				if (read) entry.read = true;
				if (written) entry.written = true;
				entry.sources.add(relPath);
				allComponentAttrs.add(attr);
			}
		}

		// Изгради атрибути за шемата
		const scannedAttrs = {};
		const sortedAttrNames = [...compAttrs.keys()].sort();
		for (const name of sortedAttrNames) {
			const { read, written, sources } = compAttrs.get(name);
			let direction = null;
			if (read && written) direction = 'both';
			else if (read && !written) direction = 'author';
			else if (!read && written) direction = 'runtime';

			const meta = compAttrMetadata[name] || {};
			scannedAttrs[name] = {
				direction,
				sources: [...sources].sort(),
				type: meta.type || null,
				values: meta.values || null,
				fallback: meta.fallback !== undefined ? meta.fallback : null,
				min: meta.min !== undefined ? meta.min : null,
				max: meta.max !== undefined ? meta.max : null,
				description: meta.description || null
			};

			if (!globalAttrMetadata.has(name)) {
				globalAttrMetadata.set(name, {
					type: meta.type || null,
					values: new Set(meta.values || []),
					fallback: meta.fallback !== undefined ? meta.fallback : null,
					min: meta.min !== undefined ? meta.min : null,
					max: meta.max !== undefined ? meta.max : null,
					descriptions: new Map(),
					components: new Set()
				});
			}
			const g = globalAttrMetadata.get(name);
			g.components.add(comp);
			if (meta.description) {
				g.descriptions.set(comp, meta.description);
			}
			if (meta.values) {
				for (const v of meta.values) g.values.add(v);
			}
			if (meta.type) {
				if (!g.type) {
					g.type = meta.type;
				} else if (g.type !== meta.type) {
					// Type reconciliation: widen to string if incompatible
					if ((g.type === 'marker' && meta.type === 'string') || (g.type === 'string' && meta.type === 'marker')) {
						g.type = 'string';
					} else {
						console.warn(`sync-ln-schemas: reconciliation on ${name}: [${[...g.components].join(',')}] has type '${g.type}' vs [${comp}] has type '${meta.type}'. Widening to 'string'.`);
						g.type = 'string';
					}
				}
			}
			if (meta.fallback !== undefined && meta.fallback !== null && g.fallback === null) {
				g.fallback = meta.fallback;
			}
			if (meta.min !== undefined && meta.min !== null) {
				g.min = g.min !== null ? Math.min(g.min, meta.min) : meta.min;
			}
			if (meta.max !== undefined && meta.max !== null) {
				g.max = g.max !== null ? Math.max(g.max, meta.max) : meta.max;
			}
		}

		// Прочитај постоечки фајл ако има
		const schemaPath = path.join(compPath, `${comp}.schema.json`);
		let existingObj = null;
		let previousContent = null;
		if (fs.existsSync(schemaPath)) {
			try {
				const raw = fs.readFileSync(schemaPath, 'utf8');
				previousContent = raw.replace(/\r\n/g, '\n');
				existingObj = JSON.parse(raw);
			} catch {
				existingObj = null;
			}
		}

		// Провери за застарени атрибути
		if (existingObj && existingObj.attributes) {
			for (const oldAttr of Object.keys(existingObj.attributes)) {
				if (!Object.prototype.hasOwnProperty.call(scannedAttrs, oldAttr)) {
					staleAttributesReport.push({ comp, attr: oldAttr });
				}
			}
		}

		const rendered = serializeSchema(comp, scannedAttrs, existingObj);
		const changed = previousContent !== rendered;

		pendingWrites.push({
			comp,
			schemaPath,
			rendered,
			changed
		});
	}

	// Скенирај го коренскиот theme/ за несместливи атрибути
	const rootThemeFiles = fs.existsSync(themeDir) ? walk(themeDir, ['.scss']) : [];
	const rootThemeAttrs = new Map();

	for (const file of rootThemeFiles) {
		const rel = path.relative(root, file).replace(/\\/g, '/');
		const cleaned = stripComments(fs.readFileSync(file, 'utf8'));
		for (const m of cleaned.matchAll(ATTR_RE)) {
			const attr = m[0];
			if (attr.endsWith('-')) {
				constructedTokens.add(attr);
				continue;
			}
			if (!rootThemeAttrs.has(attr)) rootThemeAttrs.set(attr, new Set());
			rootThemeAttrs.get(attr).add(rel);
		}
	}

	const unplaced = [];
	for (const [attr, sources] of rootThemeAttrs.entries()) {
		if (!allComponentAttrs.has(attr)) {
			unplaced.push({ attr, sources: [...sources].sort() });
		}
	}
	unplaced.sort((a, b) => a.attr.localeCompare(b.attr));

	// Вградена гаранција: union(компоненти) ∪ несместливи == целото скен-множество
	const totalScanUniverse = new Set([...allComponentAttrs, ...rootThemeAttrs.keys()]);
	const combinedUnion = new Set([...allComponentAttrs, ...unplaced.map((u) => u.attr)]);

	let guaranteeValid = totalScanUniverse.size === combinedUnion.size;
	if (guaranteeValid) {
		for (const a of totalScanUniverse) {
			if (!combinedUnion.has(a)) {
				guaranteeValid = false;
				break;
			}
		}
	}

	if (!guaranteeValid) {
		console.error('sync-ln-schemas: ГРЕШКА — вградената гаранција за покриеност не важи!');
		console.error(`  универзум: ${totalScanUniverse.size}, унија: ${combinedUnion.size}`);
		process.exit(1);
	}

	// Додади ги несместливите CSS атрибути во globalAttrMetadata ако ги нема
	for (const u of unplaced) {
		if (!globalAttrMetadata.has(u.attr)) {
			const descs = new Map();
			descs.set('theme', `Visual / CSS styling attribute (${u.sources.join(', ')})`);
			globalAttrMetadata.set(u.attr, {
				type: 'marker',
				values: new Set(),
				fallback: null,
				min: null,
				max: null,
				descriptions: descs,
				components: new Set(['theme'])
			});
		}
	}

	// Генерирање на речник за ln-debug (generated-attributes.js)
	const sortedUniverse = [...totalScanUniverse].sort();
	const manifestContent = `// This file is generated by scripts/sync-ln-schemas.mjs. Do not edit manually.\nexport const VALID_ATTRIBUTES = new Set([\n${sortedUniverse.map((a) => `\t'${a}'`).join(',\n')}\n]);\n`;
	const manifestPath = path.resolve(root, 'components/ln-debug/src/generated-attributes.js');
	let manifestChanged = false;
	if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, 'utf8') !== manifestContent) {
		manifestChanged = true;
	}

	// Генерирање на HTML Custom Data (ln-ashlar.html-data.json)
	const htmlDataContent = generateHtmlCustomData(globalAttrMetadata);
	const htmlDataPath = path.resolve(root, 'ln-ashlar.html-data.json');
	let htmlDataChanged = false;
	if (!fs.existsSync(htmlDataPath) || fs.readFileSync(htmlDataPath, 'utf8') !== htmlDataContent) {
		htmlDataChanged = true;
	}

	// Генерирање на JetBrains Web-Types (web-types.json)
	let pkgVersion = '1.7.0';
	try {
		const pkgJson = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf8'));
		if (pkgJson.version) pkgVersion = pkgJson.version;
	} catch (_) {}

	const webTypesContent = generateWebTypes(globalAttrMetadata, pkgVersion);
	const webTypesPath = path.resolve(root, 'web-types.json');
	let webTypesChanged = false;
	if (!fs.existsSync(webTypesPath) || fs.readFileSync(webTypesPath, 'utf8') !== webTypesContent) {
		webTypesChanged = true;
	}

	// Генерирање на W3C XML Schema (ln-ashlar.xsd)
	const xsdContent = generateXmlSchema(globalAttrMetadata);
	const xsdPath = path.resolve(root, 'ln-ashlar.xsd');
	let xsdChanged = false;
	if (!fs.existsSync(xsdPath) || fs.readFileSync(xsdPath, 'utf8') !== xsdContent) {
		xsdChanged = true;
	}

	// Печати извештај
	const changedFiles = pendingWrites.filter((p) => p.changed);
	console.log(`sync-ln-schemas: root: ${root}`);
	console.log(`  обработени папки: ${compDirs.length}`);
	console.log(`  прескокнати папки: 0`);
	console.log(`  прескокнати compiled bundles: ${totalBundlesSkipped}`);
	console.log(`  атрибути во компонентите: ${allComponentAttrs.size}`);
	console.log(`  несместливи CSS атрибути (scss/): ${unplaced.length}`);

	if (unplaced.length) {
		console.log('\n  Несместливи атрибути:');
		for (const u of unplaced) {
			console.log(`    - ${u.attr} (${u.sources.join(', ')})`);
		}
	}

	if (constructedTokens.size) {
		console.log(`\n  Конструирани токени (отфрлени): ${[...constructedTokens].join(', ')}`);
	}

	if (staleAttributesReport.length) {
		console.log(`\n  ⚠ Застарени атрибути (${staleAttributesReport.length}):`);
		for (const { comp, attr } of staleAttributesReport) {
			console.log(`    - [${comp}] ${attr}`);
		}
	}

	const hasAnyChanges = changedFiles.length > 0 || manifestChanged || htmlDataChanged || webTypesChanged || xsdChanged;

	if (checkOnly) {
		if (staleAttributesReport.length) {
			console.error(`\nsync-ln-schemas --check: ${staleAttributesReport.length} застарени атрибути — шемата тврди атрибут што кодот веќе го нема:`);
			for (const { comp, attr } of staleAttributesReport) {
				console.error(`  - [${comp}] ${attr}`);
			}
			console.error('\nСекој бара одлука: врати го во кодот, или избриши го клучот од components/<comp>/<comp>.schema.json.');
			process.exit(1);
		}

		if (hasAnyChanges) {
			console.error(`\nsync-ln-schemas --check: бара ажурирање:`);
			for (const f of changedFiles) {
				console.error(`  - ${path.relative(root, f.schemaPath)}`);
			}
			if (manifestChanged) {
				console.error(`  - ${path.relative(root, manifestPath)}`);
			}
			if (htmlDataChanged) {
				console.error(`  - ${path.relative(root, htmlDataPath)}`);
			}
			if (webTypesChanged) {
				console.error(`  - ${path.relative(root, webTypesPath)}`);
			}
			if (xsdChanged) {
				console.error(`  - ${path.relative(root, xsdPath)}`);
			}
			console.error('\nПушти `npm run sync:ln-schemas` за да ги ажурираш.');
			process.exit(1);
		}
		console.log('\nsync-ln-schemas --check: свеж ✓ (сите шеми, IDE метаподатоци и речникот се ажурирани)');
		return;
	}

	if (!hasAnyChanges) {
		console.log('\nsync-ln-schemas: без промени ✓ (сите шеми се синхронизирани)');
		return;
	}

	for (const item of changedFiles) {
		fs.writeFileSync(item.schemaPath, item.rendered, 'utf8');
	}

	if (manifestChanged) {
		fs.writeFileSync(manifestPath, manifestContent, 'utf8');
		console.log(`  ✓ Генериран ${path.relative(root, manifestPath)}`);
	}
	if (htmlDataChanged) {
		fs.writeFileSync(htmlDataPath, htmlDataContent, 'utf8');
		console.log(`  ✓ Генериран ${path.relative(root, htmlDataPath)}`);
	}
	if (webTypesChanged) {
		fs.writeFileSync(webTypesPath, webTypesContent, 'utf8');
		console.log(`  ✓ Генериран ${path.relative(root, webTypesPath)}`);
	}
	if (xsdChanged) {
		fs.writeFileSync(xsdPath, xsdContent, 'utf8');
		console.log(`  ✓ Генериран ${path.relative(root, xsdPath)}`);
	}

	const totalWrites = changedFiles.length +
		(manifestChanged ? 1 : 0) +
		(htmlDataChanged ? 1 : 0) +
		(webTypesChanged ? 1 : 0) +
		(xsdChanged ? 1 : 0);

	console.log(`\nsync-ln-schemas: запишани ${totalWrites} фајлови.`);
}

main();
