#!/usr/bin/env node

/**
 * scripts/extract-manifest.mjs
 *
 * Извлекува хиерархиска структура од маркапот на Ashlar компонентите,
 * со содржината на <template> елементите, состојбените класи и авторитативните шеми.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// 25 состојбени класи што ги пишува JS
const KNOWN_STATE_CLASSES = [
	'ln-modal-open',
	'ln-out',
	'ln-enter',
	'ln-row-selected',
	'ln-row-focused',
	'ln-item-selected',
	'ln-table--loading',
	'ln-list--loading',
	'ln-filter-active',
	'ln-editor-active',
	'ln-sortable--dragging',
	'ln-sortable--drop-before',
	'ln-sortable--drop-after',
	'ln-sortable--active',
	'ln-ajax--loading',
	'ln-chart--loading',
	'ln-chart--empty',
	'ln-confirm-tooltip',
	'ln-link-status--visible',
	'ln-circular-progress__track',
	'ln-circular-progress__fill',
	'ln-circular-progress__label',
	'is-loading',
	'open',
	'hidden'
];

// Мапирање на состојбени класи и атрибути по компонента
const COMPONENT_STATE_MAPPING = {
	'ln-modal': ['.ln-modal-open', '.ln-out', '.ln-enter', '[open]'],
	'ln-table': ['.ln-row-selected', '.ln-row-focused', '.ln-table--loading'],
	'ln-list': ['.ln-item-selected', '.ln-list--loading'],
	'ln-filter': ['.ln-filter-active'],
	'ln-editor': ['.ln-editor-active'],
	'ln-sortable': ['.ln-sortable--dragging', '.ln-sortable--drop-before', '.ln-sortable--drop-after'],
	'ln-ajax': ['.ln-ajax--loading'],
	'ln-chart': ['.ln-chart--loading', '.ln-chart--empty'],
	'ln-confirm': ['.ln-confirm-tooltip'],
	'ln-link': ['.ln-link-status--visible'],
	'ln-circular-progress': ['.ln-circular-progress__track', '.ln-circular-progress__fill', '.ln-circular-progress__label'],
	'ln-toggle': ['[open]', '.open'],
	'ln-accordion': ['[open]'],
	'ln-dropdown': ['[open]', '.open'],
	'ln-form': ['.is-loading'],
	'ln-validate': ['.is-loading']
};

// Void HTML elements
const VOID_ELEMENTS = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
	'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/**
 * Чита CLI аргументи
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const options = {
		htmlDirs: [],
		schemasDir: path.join(REPO_ROOT, 'components'),
		outputFile: null,
		maxDepth: 4,
		format: 'text'
	};

	for (const arg of args) {
		if (arg === '--check') {
			options.check = true;
		} else if (arg.startsWith('--target=')) {
			options.targetPath = path.resolve(REPO_ROOT, arg.slice('--target='.length).trim());
		} else if (arg.startsWith('--html=')) {
			const pathsStr = arg.slice('--html='.length);
			options.htmlDirs = pathsStr.split(',').map((p) => path.resolve(REPO_ROOT, p.trim()));
		} else if (arg.startsWith('--schemas=')) {
			options.schemasDir = path.resolve(REPO_ROOT, arg.slice('--schemas='.length).trim());
		} else if (arg.startsWith('--output=')) {
			options.outputFile = path.resolve(REPO_ROOT, arg.slice('--output='.length).trim());
		} else if (arg.startsWith('--max-depth=')) {
			options.maxDepth = parseInt(arg.slice('--max-depth='.length), 10) || 4;
		} else if (arg.startsWith('--format=')) {
			options.format = arg.slice('--format='.length).trim();
		}
	}

	if (!options.targetPath && options.check) {
		options.targetPath = path.join(REPO_ROOT, 'theme', 'tailwind');
	}

	// Доколку нема поставено патеки за HTML, употреби стандардни во овој проект
	if (options.htmlDirs.length === 0) {
		options.htmlDirs = [
			path.join(REPO_ROOT, 'demo', 'admin'),
			path.join(REPO_ROOT, 'demo', 'spa'),
			path.join(REPO_ROOT, 'demo', 'docuflow')
		];
	}

	return options;
}

/**
 * Вчитај ги 49-те автогенерирани шеми
 */
function loadSchemas(schemasDir) {
	const schemaMap = new Map(); // componentName -> { rootAttr, attrs: Set }

	if (!fs.existsSync(schemasDir)) return schemaMap;

	const entries = fs.readdirSync(schemasDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const schemaPath = path.join(schemasDir, entry.name, `${entry.name}.schema.json`);
		if (fs.existsSync(schemaPath)) {
			try {
				const content = fs.readFileSync(schemaPath, 'utf8');
				const json = JSON.parse(content);
				const compName = json.component || entry.name;
				const rootAttr = `data-${compName}`;
				const attrs = new Set(Object.keys(json.attributes || {}));

				schemaMap.set(compName, {
					compName,
					rootAttr,
					attrs
				});
			} catch (err) {
				console.warn(`[extract-manifest] Не можам да ја парсирам шемата ${schemaPath}:`, err.message);
			}
		}
	}

	return schemaMap;
}

/**
 * Рекурзивно пронаоѓање на сите компајлирани HTML фајлови
 */
function findCompiledHtmlFiles(inputPaths) {
	const htmlFiles = [];

	function walk(itemPath) {
		if (!fs.existsSync(itemPath)) return;
		const stat = fs.statSync(itemPath);

		if (stat.isDirectory()) {
			// Прескокни 'src' во demo/admin/ (бидејќи немаат школка)
			const baseName = path.basename(itemPath);
			if (baseName === 'src' || baseName === 'node_modules' || baseName.startsWith('.')) {
				return;
			}
			const children = fs.readdirSync(itemPath);
			for (const child of children) {
				walk(path.join(itemPath, child));
			}
		} else if (stat.isFile() && itemPath.endsWith('.html')) {
			htmlFiles.push(itemPath);
		}
	}

	for (const p of inputPaths) {
		walk(p);
	}

	return htmlFiles.sort();
}

/**
 * Нисконивоски HTML парсер (zero-dependency)
 */
function parseHTML(html) {
	const root = { tagName: 'root', attributes: {}, children: [], parent: null };
	const stack = [root];
	let current = root;

	let i = 0;
	const len = html.length;

	while (i < len) {
		if (html[i] === '<') {
			// Коментар <!-- ... -->
			if (html.startsWith('<!--', i)) {
				const end = html.indexOf('-->', i + 4);
				if (end !== -1) {
					i = end + 3;
					continue;
				}
			}

			// Затворачки таг </tagName>
			if (html[i + 1] === '/') {
				const end = html.indexOf('>', i + 2);
				if (end !== -1) {
					const closeName = html.slice(i + 2, end).trim().toLowerCase().split(/\s+/)[0];
					while (stack.length > 1) {
						const popped = stack.pop();
						if (popped.tagName === closeName) {
							break;
						}
					}
					current = stack[stack.length - 1];
					i = end + 1;
					continue;
				}
			}

			// Скрипти и стилови
			if (current.tagName === 'script' || current.tagName === 'style') {
				const closeTag = `</${current.tagName}>`;
				const end = html.toLowerCase().indexOf(closeTag, i);
				if (end !== -1) {
					i = end + closeTag.length;
					stack.pop();
					current = stack[stack.length - 1];
					continue;
				}
			}

			// Отворачки таг
			const tagMatch = html.slice(i).match(/^<([a-zA-Z0-9:-]+)/);
			if (tagMatch) {
				const tagName = tagMatch[1].toLowerCase();
				let cursor = i + tagMatch[0].length;
				const attributes = {};
				let selfClosing = false;

				while (cursor < len) {
					while (cursor < len && /\s/.test(html[cursor])) {
						cursor++;
					}
					if (cursor >= len) break;

					if (html[cursor] === '>') {
						cursor++;
						break;
					}
					if (html.startsWith('/>', cursor)) {
						selfClosing = true;
						cursor += 2;
						break;
					}

					const attrNameMatch = html.slice(cursor).match(/^[^\s/>=]+/);
					if (!attrNameMatch) {
						cursor++;
						continue;
					}
					const attrName = attrNameMatch[0];
					cursor += attrName.length;

					while (cursor < len && /\s/.test(html[cursor])) {
						cursor++;
					}

					let attrVal = '';
					if (cursor < len && html[cursor] === '=') {
						cursor++;
						while (cursor < len && /\s/.test(html[cursor])) {
							cursor++;
						}
						if (cursor < len) {
							const quote = html[cursor];
							if (quote === '"' || quote === "'") {
								cursor++;
								const valEnd = html.indexOf(quote, cursor);
								if (valEnd !== -1) {
									attrVal = html.slice(cursor, valEnd);
									cursor = valEnd + 1;
								} else {
									attrVal = html.slice(cursor);
									cursor = len;
								}
							} else {
								const valMatch = html.slice(cursor).match(/^[^\s/>]+/);
								if (valMatch) {
									attrVal = valMatch[0];
									cursor += attrVal.length;
								}
							}
						}
					}

					attributes[attrName] = attrVal;
				}

				const element = {
					tagName,
					attributes,
					children: [],
					parent: current
				};

				current.children.push(element);

				// Извлекување на содржината на <template> како DOM подстебло
				if (tagName === 'template') {
					const tEnd = findMatchingClosingTag(html, cursor, 'template');
					const innerHTML = html.slice(cursor, tEnd);
					if (innerHTML.trim()) {
						const parsedTemplate = parseHTML(innerHTML);
						for (const child of parsedTemplate.children) {
							child.parent = element;
							element.children.push(child);
						}
					}
					i = tEnd + '</template>'.length;
					continue;
				}

				if (!selfClosing && !VOID_ELEMENTS.has(tagName)) {
					stack.push(element);
					current = element;
				}

				i = cursor;
				continue;
			}
		}

		i++;
	}

	return root;
}

/**
 * Наоѓа соодветен затворачки таг за <template>
 */
function findMatchingClosingTag(html, startIndex, tagName) {
	let depth = 1;
	let i = startIndex;
	const lowerTag = tagName.toLowerCase();
	const openStr = `<${lowerTag}`;
	const closeStr = `</${lowerTag}>`;

	while (i < html.length) {
		const nextOpen = html.toLowerCase().indexOf(openStr, i);
		const nextClose = html.toLowerCase().indexOf(closeStr, i);

		if (nextClose === -1) return html.length;

		if (nextOpen !== -1 && nextOpen < nextClose) {
			depth++;
			i = nextOpen + openStr.length;
		} else {
			depth--;
			if (depth === 0) {
				return nextClose;
			}
			i = nextClose + closeStr.length;
		}
	}

	return html.length;
}

/**
 * Нормализира DOM елемент во концизен селектор (таг, класи, data-ln-* атрибути, состојби)
 */
function normalizeElement(node) {
	const tag = node.tagName;
	const attrs = node.attributes || {};

	// Зачувај `data-ln-*` атрибути
	const dataLnAttrs = Object.keys(attrs).filter((a) => a.startsWith('data-ln-'));

	// Зачувај релевантни CSS класи
	const classAttr = attrs.class || '';
	const classes = classAttr
		.split(/\s+/)
		.filter(Boolean)
		.filter((c) => !c.startsWith('demo-') && !c.startsWith('js-') && c !== 'active');

	// Корен или специјални data-ln- атрибути
	const hasDataLnRoot = dataLnAttrs.some((a) => a === 'data-ln-modal' || a === 'data-ln-table' || a === 'data-ln-form' || a === 'data-ln-tabs' || a === 'data-ln-accordion' || a === 'data-ln-toggle');

	if (hasDataLnRoot) {
		const rootAttr = dataLnAttrs.find((a) => a === 'data-ln-modal' || a === 'data-ln-table' || a === 'data-ln-form' || a === 'data-ln-tabs' || a === 'data-ln-accordion' || a === 'data-ln-toggle');
		return `[${rootAttr}]`;
	}

	// Состојбени атрибути
	const stateAttrs = [];
	if ('open' in attrs) stateAttrs.push('[open]');
	if ('hidden' in attrs) stateAttrs.push('[hidden]');
	if ('disabled' in attrs) stateAttrs.push('[disabled]');

	// Компонирај репрезентација
	let sel = tag;
	if (classes.length > 0) {
		sel += '.' + classes.slice(0, 2).join('.');
	}

	for (const attr of dataLnAttrs) {
		sel += `[${attr}]`;
	}

	for (const sa of stateAttrs) {
		sel += sa;
	}

	return sel;
}

/**
 * Гради патека на хиерархиско подстебло за дадена компонента
 */
function buildTreePaths(node, currentDepth, maxDepth) {
	if (currentDepth > maxDepth) return [];

	const results = [];
	const norm = normalizeElement(node);

	const children = (node.children || []).filter((c) => c.tagName !== 'script' && c.tagName !== 'style');

	if (children.length === 0 || currentDepth === maxDepth) {
		return [[norm]];
	}

	for (const child of children) {
		const childPaths = buildTreePaths(child, currentDepth + 1, maxDepth);
		for (const cp of childPaths) {
			results.push([norm, ...cp]);
		}
	}

	return results;
}

/**
 * Парсира и извлекува сите компоненти и нивните хиерархиски структури
 */
function extractManifestData(htmlFiles, schemaMap, maxDepth) {
	const componentMap = new Map(); // componentRootSelector -> { totalCount: 0, pathCounts: Map<pathStr, count>, states: Set }

	// Иницијализирај компоненти од шемите
	for (const [compName, schema] of schemaMap.entries()) {
		const rootSel = `[${schema.rootAttr}]`;
		componentMap.set(rootSel, {
			compName,
			rootSel,
			totalCount: 0,
			pathCounts: new Map(),
			states: new Set(COMPONENT_STATE_MAPPING[compName] || [])
		});
	}

	function traverse(node) {
		const attrs = node.attributes || {};

		// Провери за секоја позната компонента
		for (const [compName, schema] of schemaMap.entries()) {
			const rootAttr = schema.rootAttr;
			if (rootAttr in attrs || (node.tagName === 'dialog' && compName === 'ln-modal')) {
				const rootSel = `[${rootAttr}]`;
				let entry = componentMap.get(rootSel);
				if (!entry) {
					entry = {
						compName,
						rootSel,
						totalCount: 0,
						pathCounts: new Map(),
						states: new Set(COMPONENT_STATE_MAPPING[compName] || [])
					};
					componentMap.set(rootSel, entry);
				}

				entry.totalCount++;

				// Извлечи детски патеки
				const children = node.children || [];
				for (const child of children) {
					if (child.tagName === 'script' || child.tagName === 'style') continue;
					const paths = buildTreePaths(child, 1, maxDepth);
					for (const p of paths) {
						const pathStr = p.join(' > ');
						entry.pathCounts.set(pathStr, (entry.pathCounts.get(pathStr) || 0) + 1);
					}
				}
			}
		}

		for (const child of node.children || []) {
			traverse(child);
		}
	}

	for (const file of htmlFiles) {
		const content = fs.readFileSync(file, 'utf8');
		const domTree = parseHTML(content);
		traverse(domTree);
	}

	return componentMap;
}

/**
 * Го форматира манифестот во чист текстуален приказ со вгнездени броеви
 */
function renderTextManifest(componentMap) {
	const outputLines = [];

	const sortedEntries = [...componentMap.entries()]
		.filter(([, data]) => data.totalCount > 0)
		.sort((a, b) => b[1].totalCount - a[1].totalCount);

	for (const [rootSel, data] of sortedEntries) {
		const headerLabel = `${rootSel}`.padEnd(50);
		outputLines.push(`${headerLabel} ×${data.totalCount}`);

		// Сортирај и земи ги најчестите хиерархиски патеки (до 15 за прегледност)
		const sortedPaths = [...data.pathCounts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 15);

		for (const [pathStr, count] of sortedPaths) {
			const indentedPath = `  ${pathStr}`.padEnd(50);
			outputLines.push(`${indentedPath} ×${count}`);
		}

		if (data.states && data.states.size > 0) {
			const statesStr = Array.from(data.states).join('  ');
			outputLines.push(`  состојби: ${statesStr}`);
		}

		outputLines.push('');
	}

	return outputLines.join('\n');
}

/**
  * Парсер на CSS/SCSS правила што извлекува вистински селектори (без коментари)
  */
function parseCssRules(cssText) {
	// Отстрани коментари
	let clean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
	clean = clean.replace(/\/\/.*$/gm, '');

	const rules = [];
	let i = 0;
	const len = clean.length;

	while (i < len) {
		const openBrace = clean.indexOf('{', i);
		if (openBrace === -1) break;

		const selectorText = clean.slice(i, openBrace).trim();
		let depth = 1;
		let cursor = openBrace + 1;
		while (cursor < len && depth > 0) {
			if (clean[cursor] === '{') depth++;
			else if (clean[cursor] === '}') depth--;
			cursor++;
		}

		const declText = clean.slice(openBrace + 1, cursor - 1).trim();

		if (selectorText && !selectorText.startsWith('@import') && !selectorText.startsWith('@use') && !selectorText.startsWith('@charset') && !selectorText.startsWith('@keyframes')) {
			const subSelectors = selectorText.split(',').map((s) => s.trim()).filter(Boolean);
			for (const sel of subSelectors) {
				rules.push({ selector: sel, declarations: declText });
			}
		}

		i = cursor;
	}

	return rules;
}

/**
 * Скенира ЕДНА специфична цел (--target) за CSS/SCSS фајлови и правила
 */
function scanTargetCss(targetPath) {
	const files = [];
	if (!fs.existsSync(targetPath)) return { files: [], rules: [], rawCss: '' };

	function walk(p) {
		const stat = fs.statSync(p);
		if (stat.isFile() && (p.endsWith('.css') || p.endsWith('.scss'))) {
			files.push(p);
		} else if (stat.isDirectory()) {
			for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
				if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
					walk(path.join(p, entry.name));
				}
			}
		}
	}

	walk(targetPath);

	let rawCss = '';
	const rules = [];
	for (const file of files) {
		const content = fs.readFileSync(file, 'utf8');
		rawCss += '\n' + content;
		rules.push(...parseCssRules(content));
	}

	return { files, rules, rawCss };
}

// Headless / безвизуелни логички JS компоненти што немаат CSS корен/слој
const HEADLESS_COMPONENTS = new Set([
	'ln-api-connector',
	'ln-http',
	'ln-couchdb-connector',
	'ln-data-store',
	'ln-data-coordinator',
	'ln-slug',
	'ln-time',
	'ln-include',
	'ln-autoresize',
	'ln-autosave',
	'ln-fill',
	'ln-router',
	'ln-api-queue',
	'ln-options',
	'ln-table-coordinator',
	'ln-ui-coordinator'
]);

/**
 * Проверува дали селекторските правила во ЦЕЛТА ги покриваат корените, состојбите И хиерархиските патеки од манифестот
 */
function validateManifestAgainstTarget(componentMap, schemaMap, targetInfo, targetPathRel) {
	const missingItems = [];
	const { files, rules } = targetInfo;

	if (files.length === 0 || rules.length === 0) {
		missingItems.push({
			compName: 'ALL',
			type: 'target-empty',
			detail: `Целата '${targetPathRel}' содржи 0 CSS/SCSS фајлови или 0 селекторски правила.`
		});
		return missingItems;
	}

	const selectorStrings = rules.map((r) => r.selector);

	const activeEntries = [...componentMap.entries()].filter(([, data]) => data.totalCount > 0);

	for (const [rootSel, data] of activeEntries) {
		const compName = data.compName;

		if (HEADLESS_COMPONENTS.has(compName)) continue;

		const schema = schemaMap.get(compName);
		const rootAttr = schema ? schema.rootAttr : `data-${compName}`;

		// 1. Проверка на корен во селекторите
		const rootAttrPattern = `data-${compName}`;
		const compClassPattern = `.${compName}`;

		const rootMatched = selectorStrings.some((sel) =>
			sel.includes(rootAttrPattern) || sel.includes(compClassPattern) || sel.includes(`[${rootAttr}]`)
		);

		if (!rootMatched) {
			missingItems.push({
				compName,
				type: 'component-root',
				detail: `Коренот ${rootSel} нема соодветно селекторско правило во целниот CSS ('${targetPathRel}').`
			});
		}

		// 2. Проверка на хиерархиските патеки од манифестот
		const topPaths = [...data.pathCounts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);

		for (const [pathStr] of topPaths) {
			const pathTokens = pathStr.split(' > ').map((t) => t.trim());
			const lastToken = pathTokens[pathTokens.length - 1];

			const attrMatch = lastToken.match(/\[([a-z0-9-]+)\]/);
			const classMatch = lastToken.match(/\.([a-z0-9_-]+)/);
			const tagMatch = lastToken.match(/^([a-z0-9]+)/);

			const keyToken = attrMatch ? attrMatch[1] : (classMatch ? classMatch[1] : (tagMatch ? tagMatch[1] : lastToken));

			const pathMatched = selectorStrings.some((sel) => {
				const relatesToComp = sel.includes(rootAttrPattern) || sel.includes(compClassPattern) || sel.includes(compName);
				const relatesToChild = sel.includes(keyToken) || (attrMatch && sel.includes(attrMatch[1]));
				return relatesToComp || relatesToChild;
			});

			if (!pathMatched) {
				missingItems.push({
					compName,
					type: 'hierarchical-path',
					detail: `Хиерархиската патека '${pathStr}' за компонентата ${compName} нема соодветно CSS правило во целата.`
				});
			}
		}

		// 3. Проверка на состојбени класи во селекторите
		if (data.states && data.states.size > 0) {
			for (const stateItem of data.states) {
				const rawToken = stateItem.replace(/^\./, '').replace(/^\[/, '').replace(/\]$/, '');
				const stateMatched = selectorStrings.some((sel) => sel.includes(rawToken));
				if (!stateMatched) {
					missingItems.push({
						compName,
						type: 'state-class',
						detail: `Состојбата '${stateItem}' за компонентата ${compName} нема соодветно селекторско правило во целата.`
					});
				}
			}
		}
	}

	return missingItems;
}

function main() {
	const options = parseArgs();

	console.log(`[extract-manifest] Вчитувам шеми од: ${options.schemasDir}`);
	const schemaMap = loadSchemas(options.schemasDir);
	console.log(`[extract-manifest] Вчитани ${schemaMap.size} компоненти од шемите.`);

	console.log(`[extract-manifest] Пребарувам компајлирани HTML фајлови...`);
	const htmlFiles = findCompiledHtmlFiles(options.htmlDirs);
	console.log(`[extract-manifest] Пронајдени ${htmlFiles.length} компајлирани HTML фајлови.`);

	console.log(`[extract-manifest] Анализирам маркап и содржина на <template> елементи...`);
	const componentMap = extractManifestData(htmlFiles, schemaMap, options.maxDepth);

	const textOutput = renderTextManifest(componentMap);

	if (options.check) {
		const targetPathRel = path.relative(REPO_ROOT, options.targetPath).replace(/\\/g, '/') || options.targetPath;
		console.log(`[extract-manifest] --check: Скенирам ЕДНА ЦЕЛ: ${targetPathRel}...`);
		const targetInfo = scanTargetCss(options.targetPath);
		console.log(`[extract-manifest] --check: Проверени ${targetInfo.files.length} фајлови и ${targetInfo.rules.length} селекторски правила во целата.`);

		const missing = validateManifestAgainstTarget(componentMap, schemaMap, targetInfo, targetPathRel);

		if (missing.length > 0) {
			console.error(`\n❌ [extract-manifest] --check ГРЕШКА — Пронајдени се ${missing.length} непокриени ставки од манифестот во целата '${targetPathRel}':\n`);
			for (const item of missing) {
				console.error(`  - [${item.compName}] (${item.type}): ${item.detail}`);
			}
			console.error(`\nПортата блокираше! Додадете соодветни CSS правила во '${targetPathRel}' пред да продолжите.\n`);
			process.exit(1);
		}

		console.log(`\n✓ [extract-manifest] --check помина: Сите UI компоненти, состојби и патеки се покриени во целата '${targetPathRel}'!\n`);
		process.exit(0);
	}

	if (options.outputFile) {
		const outDir = path.dirname(options.outputFile);
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir, { recursive: true });
		}
		fs.writeFileSync(options.outputFile, textOutput, 'utf8');
		console.log(`[extract-manifest] Манифестот е успешно запишан во: ${options.outputFile}`);
	} else {
		console.log('\n--- ИЗВЛЕЧЕН ХИЕРАРХИСКИ МАНИФЕСТ ---\n');
		console.log(textOutput);
	}
}

main();
