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
const GENERATOR_COMMENT = 'This file is partly generated. The $comment, component, generator, and each attribute\'s direction and sources keys are owned by the generator and overwritten on every run. All other keys are preserved and safe to hand-author. Regenerate with `npm run sync:ln-schemas`.';
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
			attrObj.direction = newAttrs[attrName].direction;
			attrObj.sources = newAttrs[attrName].sources;
		} else {
			// Застарен запис: човечките полиња остануваат, генераторските се ресетираат
			attrObj.direction = null;
			attrObj.sources = [];
		}

		// Зачувај ги сите други човечки клучеви во нивниот постоечки редослед
		for (const key of Object.keys(existingAttrObj)) {
			if (key !== 'direction' && key !== 'sources') {
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
	const jsDir = path.join(root, 'js');
	const scssDir = path.join(root, 'scss');

	if (!fs.existsSync(jsDir)) {
		console.error(`sync-ln-schemas: не постои js/ папка во root: ${root}`);
		process.exit(1);
	}

	const compDirs = fs.readdirSync(jsDir).filter((f) => {
		const p = path.join(jsDir, f);
		return fs.statSync(p).isDirectory();
	}).sort();

	const constructedTokens = new Set();
	let totalBundlesSkipped = 0;
	const allComponentAttrs = new Set();
	const staleAttributesReport = [];
	const pendingWrites = [];

	for (const comp of compDirs) {
		const compPath = path.join(jsDir, comp);
		const srcPath = path.join(compPath, 'src');
		const hasSrc = fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory();

		let filesToScan = [];
		let skippedBundles = 0;

		if (hasSrc) {
			const jsFiles = walk(srcPath, ['.js']);
			const scssFiles = walk(compPath, ['.scss']);
			filesToScan = [...jsFiles, ...scssFiles];

			const topJs = fs.readdirSync(compPath).filter((f) =>
				f.endsWith('.js') && fs.statSync(path.join(compPath, f)).isFile()
			);
			skippedBundles = topJs.length;
		} else {
			// ln-core или компонента без src/
			filesToScan = walk(compPath, ['.js', '.scss']);
		}

		totalBundlesSkipped += skippedBundles;

		const compAttrs = new Map(); // attrName -> { read: bool, written: bool, sources: Set<string> }

		for (const file of filesToScan) {
			const { relPath, fileAttrs } = analyzeFile(file, compPath, constructedTokens);
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

			scannedAttrs[name] = {
				direction,
				sources: [...sources].sort()
			};
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

	// Скенирај го коренскиот scss/ за несместливи атрибути
	const rootScssFiles = fs.existsSync(scssDir) ? walk(scssDir, ['.scss']) : [];
	const rootScssAttrs = new Map();

	for (const file of rootScssFiles) {
		const rel = path.relative(root, file).replace(/\\/g, '/');
		const cleaned = stripComments(fs.readFileSync(file, 'utf8'));
		for (const m of cleaned.matchAll(ATTR_RE)) {
			const attr = m[0];
			if (attr.endsWith('-')) {
				constructedTokens.add(attr);
				continue;
			}
			if (!rootScssAttrs.has(attr)) rootScssAttrs.set(attr, new Set());
			rootScssAttrs.get(attr).add(rel);
		}
	}

	const unplaced = [];
	for (const [attr, sources] of rootScssAttrs.entries()) {
		if (!allComponentAttrs.has(attr)) {
			unplaced.push({ attr, sources: [...sources].sort() });
		}
	}
	unplaced.sort((a, b) => a.attr.localeCompare(b.attr));

	// Вградена гаранција: union(компоненти) ∪ несместливи == целото скен-множество
	const totalScanUniverse = new Set([...allComponentAttrs, ...rootScssAttrs.keys()]);
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

	if (checkOnly) {
		if (changedFiles.length > 0) {
			console.error(`\nsync-ln-schemas --check: ${changedFiles.length} шема(и) бараат ажурирање:`);
			for (const f of changedFiles) {
				console.error(`  - ${path.relative(root, f.schemaPath)}`);
			}
			console.error('\nПушти `npm run sync:ln-schemas` за да ги ажурираш.');
			process.exit(1);
		}
		console.log('\nsync-ln-schemas --check: свеж ✓ (сите 49 шеми се ажурирани)');
		return;
	}

	if (changedFiles.length === 0) {
		console.log('\nsync-ln-schemas: без промени ✓ (сите 49 шеми се синхронизирани)');
		return;
	}

	for (const item of changedFiles) {
		fs.writeFileSync(item.schemaPath, item.rendered, 'utf8');
	}

	console.log(`\nsync-ln-schemas: запишани ${changedFiles.length} фајлови.`);
}

main();
