#!/usr/bin/env node

/**
 * scripts/sync-ln-events.mjs
 *
 * Source-first event extraction, reconciliation, and catalog generator for ln-ashlar.
 * Derives events from components/star/src/star.js and components/ln-core/star.js,
 * enriches them with descriptions/details from docs-mcp/components/star.md,
 * and produces:
 *  - docs-mcp/schemas/ln-ashlar-events-by-component.json
 *  - docs-mcp/schemas/ln-ashlar-events-index.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REPO_ROOT = path.resolve(__dirname, '..');

const GENERATOR_NAME = 'scripts/sync-ln-events.mjs';

// Strict event literal: prefix 'ln-' followed by kebab-case token, colon, and kebab-case action
export const EVENT_REGEX = /['"`](ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)['"`]/g;
export const EVENT_DOC_RE = /\b(ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)\b/g;

/**
 * Dynamic event allowlist: concrete events produced dynamically per file.
 */
export const DYNAMIC_ALLOWLIST = [
	{
		file: 'components/ln-data-coordinator/src/ln-data-coordinator.js',
		emits: [
			'ln-table:set-loading',
			'ln-table:set-data',
			'ln-table:page-failed',
			'ln-table:request-invalidate',
			'ln-table:request-revalidate',
			'ln-list:set-loading',
			'ln-list:set-data',
			'ln-list:page-failed',
			'ln-list:request-invalidate',
			'ln-list:request-revalidate',
			'ln-chart:set-loading',
			'ln-chart:set-data',
			'ln-data-store:request-create',
			'ln-data-store:request-update',
			'ln-data-store:request-delete',
			'ln-data-store:request-bulk-delete'
		],
		listens: [
			'ln-api-connector:fetched',
			'ln-api-connector:created',
			'ln-api-connector:updated',
			'ln-api-connector:deleted',
			'ln-api-connector:bulk-deleted',
			'ln-api-connector:error',
			'ln-couchdb-connector:fetched',
			'ln-couchdb-connector:created',
			'ln-couchdb-connector:updated',
			'ln-couchdb-connector:deleted',
			'ln-couchdb-connector:bulk-deleted',
			'ln-couchdb-connector:error'
		]
	},
	{
		file: 'components/ln-data-store/src/ln-data-store.js',
		emits: [],
		listens: [
			'ln-data-store:request-create',
			'ln-data-store:request-update',
			'ln-data-store:request-delete',
			'ln-data-store:request-bulk-delete',
			'ln-data-store:request-sync-failed'
		]
	},
	{
		file: 'components/ln-couchdb-connector/src/ln-couchdb-connector.js',
		emits: [],
		listens: [
			'ln-couchdb-connector:request-sync',
			'ln-couchdb-connector:request-fetch',
			'ln-couchdb-connector:request-create',
			'ln-couchdb-connector:request-update',
			'ln-couchdb-connector:request-delete',
			'ln-couchdb-connector:request-bulk-delete',
			'ln-api-connector:request-sync',
			'ln-api-connector:request-fetch',
			'ln-api-connector:request-create',
			'ln-api-connector:request-update',
			'ln-api-connector:request-delete',
			'ln-api-connector:request-bulk-delete'
		]
	}
];

/**
 * Strips single-line and multi-line comments from JS code with quote awareness.
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
 * Extracts function call arguments string handling nested parenthesis and quotes.
 * @param {string} code
 * @param {number} openParenIndex
 * @returns {{ args: string, endIndex: number }}
 */
export function extractArgs(code, openParenIndex) {
	let depth = 1;
	let i = openParenIndex;
	const len = code.length;
	let state = 'default';

	while (i < len && depth > 0) {
		const ch = code[i];
		const next = i + 1 < len ? code[i + 1] : '';

		if (state === 'default') {
			if (ch === "'") state = 'single_quote';
			else if (ch === '"') state = 'double_quote';
			else if (ch === '`') state = 'template';
			else if (ch === '(') depth++;
			else if (ch === ')') {
				depth--;
				if (depth === 0) {
					return { args: code.substring(openParenIndex, i), endIndex: i + 1 };
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
 * Splits quote-aware and bracket-aware argument string by commas.
 * @param {string} argsString
 * @returns {string[]}
 */
export function splitArgs(argsString) {
	const argList = [];
	let currentArg = '';
	let depth = 0;
	let st = 'default';
	for (let i = 0; i < argsString.length; i++) {
		const ch = argsString[i];
		const next = i + 1 < argsString.length ? argsString[i + 1] : '';
		if (st === 'default') {
			if (ch === "'") { st = 'single_quote'; currentArg += ch; }
			else if (ch === '"') { st = 'double_quote'; currentArg += ch; }
			else if (ch === '`') { st = 'template'; currentArg += ch; }
			else if (ch === '(' || ch === '{' || ch === '[') { depth++; currentArg += ch; }
			else if (ch === ')' || ch === '}' || ch === ']') { depth--; currentArg += ch; }
			else if (ch === ',' && depth === 0) {
				argList.push(currentArg.trim());
				currentArg = '';
			} else {
				currentArg += ch;
			}
		} else if (st === 'single_quote') {
			currentArg += ch;
			if (ch === '\\' && next) { currentArg += next; i++; }
			else if (ch === "'") st = 'default';
		} else if (st === 'double_quote') {
			currentArg += ch;
			if (ch === '\\' && next) { currentArg += next; i++; }
			else if (ch === '"') st = 'default';
		} else if (st === 'template') {
			currentArg += ch;
			if (ch === '\\' && next) { currentArg += next; i++; }
			else if (ch === '`') st = 'default';
		}
	}
	if (currentArg.trim()) argList.push(currentArg.trim());
	return argList;
}

/**
 * Recursively walks directory for given extensions.
 * @param {string} dir
 * @param {string[]} exts
 * @param {string[]} [acc]
 * @returns {string[]}
 */
export function walk(dir, exts, acc = []) {
	let entries;
	try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, exts, acc);
		else if (exts.includes(path.extname(entry.name))) acc.push(full);
	}
	return acc;
}

/**
 * Splits a markdown table row by unescaped pipe '|'.
 * @param {string} row
 * @returns {string[]}
 */
export function splitMarkdownRow(row) {
	const unescaped = row.trim().replace(/^\||\|$/g, '');
	const cells = [];
	let current = '';
	for (let i = 0; i < unescaped.length; i++) {
		const ch = unescaped[i];
		if (ch === '\\' && i + 1 < unescaped.length && unescaped[i + 1] === '|') {
			current += '|';
			i++;
		} else if (ch === '|') {
			cells.push(current.trim());
			current = '';
		} else {
			current += ch;
		}
	}
	cells.push(current.trim());
	return cells;
}

/**
 * Anti-rot dynamic construction scanner.
 * Hard-fails on dynamic event construction not covered by the allowlist.
 * @param {Array<{ comp?: string, file: string, rel?: string }>} filesToScan
 * @param {Array<{ file: string }>} allowlist
 * @returns {Array<{ file: string, lineNo: number, callee: string, eventArg: string }>}
 */
export function scanDynamicGuard(filesToScan, allowlist = DYNAMIC_ALLOWLIST) {
	const allowedFiles = new Set(allowlist.map(a => path.normalize(a.file).replace(/\\/g, '/')));
	const CALL_RE = /\b(dispatch|dispatchCancelable|_dispatchMaybeDeferred|addEventListener|removeEventListener|requestData|CustomEvent)\s*\(/g;
	const violations = [];

	for (const { file, rel } of filesToScan) {
		const normRel = rel ? ('components/' + rel).replace(/\\/g, '/') : path.normalize(file).replace(/\\/g, '/');
		const raw = fs.readFileSync(file, 'utf8');
		const clean = stripComments(raw);
		let match;
		while ((match = CALL_RE.exec(clean)) !== null) {
			const callee = match[1];
			const openParenIdx = match.index + match[0].length;
			const { args } = extractArgs(clean, openParenIdx);
			const lineNo = raw.substring(0, match.index).split('\n').length;
			
			const argList = splitArgs(args);
			let eventArgIdx = 0;
			if (callee.toLowerCase().includes('dispatch') || callee === 'requestData') {
				eventArgIdx = 1;
			}
			const eventArg = argList[eventArgIdx];
			if (!eventArg) continue;
			
			// Is it a static literal?
			const staticMatch = eventArg.match(/^['"`](ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)['"`]$/);
			if (staticMatch) continue;
			
			// Is it an inline ternary with static literals?
			const inlineTernary = eventArg.match(/^[^?:]+\?\s*['"`](ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)['"`]\s*:\s*['"`](ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)['"`]$/);
			if (inlineTernary) continue;
			
			// Is it a variable with resolved static indirection in scope?
			const isSimpleIdentifier = /^[a-zA-Z0-9_$]+$/.test(eventArg);
			if (isSimpleIdentifier) {
				const beforeText = clean.substring(Math.max(0, match.index - 300), match.index);
				const varDecl = new RegExp(`\\b(?:const|let|var)\\s+${eventArg}\\s*=\\s*[^;]+['"\`](ln-[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)['"\`]`);
				if (varDecl.test(beforeText)) continue;
			}
			
			// Dynamic construction with event colon or dynamic interpolation
			if (eventArg.includes(':') || eventArg.includes('+') || eventArg.includes('`') || eventArg.includes('${')) {
				if (!allowedFiles.has(normRel)) {
					violations.push({ file: normRel, lineNo, callee, eventArg });
				}
			}
		}
	}
	return violations;
}

/**
 * Collects component source files to scan.
 * @param {string} root
 * @returns {{ compDirs: string[], filesToScan: Array<{ comp: string, file: string, rel: string }> }}
 */
export function getComponentFiles(root) {
	const compDir = path.join(root, 'components');
	if (!fs.existsSync(compDir)) {
		throw new Error(`Directory components/ not found in root: ${root}`);
	}

	const compDirs = fs.readdirSync(compDir).filter((f) => {
		const p = path.join(compDir, f);
		return fs.statSync(p).isDirectory();
	}).sort();

	const filesToScan = [];
	for (const comp of compDirs) {
		const compPath = path.join(compDir, comp);
		const srcPath = path.join(compPath, 'src');
		let files = [];
		if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
			files = walk(srcPath, ['.js']);
		} else {
			files = walk(compPath, ['.js']);
		}
		for (const f of files) {
			filesToScan.push({ comp, file: f, rel: path.relative(compDir, f).replace(/\\/g, '/') });
		}
	}
	return { compDirs, filesToScan };
}

/**
 * Extracts and classifies events from component source files.
 * @param {Array<{ comp: string, file: string, rel: string }>} filesToScan
 * @param {string[]} compDirs
 * @returns {{ componentEvents: Map<string, { emits: Set<string>, listens: Set<string> }>, staticUniqueEvents: Set<string>, unclassifiedLiterals: Array<object> }}
 */
export function extractStaticEvents(filesToScan, compDirs) {
	const componentEvents = new Map();
	for (const comp of compDirs) {
		componentEvents.set(comp, { emits: new Set(), listens: new Set() });
	}

	const staticUniqueEvents = new Set();
	const unclassifiedLiterals = [];

	for (const { comp, file, rel } of filesToScan) {
		const raw = fs.readFileSync(file, 'utf8');
		const clean = stripComments(raw);
		let match;
		while ((match = EVENT_REGEX.exec(clean)) !== null) {
			const eventName = match[1];
			const matchIdx = match.index;
			const matchLen = match[0].length;
			const lineNo = raw.substring(0, matchIdx).split('\n').length;
			
			staticUniqueEvents.add(eventName);
			
			const afterTrim = clean.substring(matchIdx + matchLen).trimStart();
			const beforeTrim = clean.substring(0, matchIdx).trimEnd();

			if ((beforeTrim.endsWith('{') || beforeTrim.endsWith(',')) && afterTrim.startsWith(':') && !afterTrim.startsWith('::')) {
				// Object key in handler map -> listen
				componentEvents.get(comp).listens.add(eventName);
				continue;
			}
			
			let depth = 0;
			let callName = null;
			for (let i = matchIdx - 1; i >= 0; i--) {
				const ch = clean[i];
				if (ch === ')') depth++;
				else if (ch === '(') {
					if (depth === 0) {
						const preParen = clean.substring(Math.max(0, i - 80), i).trimEnd();
						const idMatch = preParen.match(/([a-zA-Z0-9_$.]+)$/);
						if (idMatch) callName = idMatch[1];
						break;
					} else {
						depth--;
					}
				} else if (ch === ';' || ch === '{' || ch === '}') {
					break;
				}
			}
			
			if (callName) {
				const calleeLower = callName.toLowerCase();
				if (calleeLower.includes('dispatch') || callName === 'CustomEvent' || callName.endsWith('.CustomEvent') || callName === 'requestData' || callName.endsWith('.requestData')) {
					componentEvents.get(comp).emits.add(eventName);
					continue;
				}
				if (calleeLower.includes('addeventlistener') || calleeLower.includes('removeeventlistener')) {
					componentEvents.get(comp).listens.add(eventName);
					continue;
				}
			}
			
			// Indirection pass
			let stmtStart = Math.max(0, matchIdx - 200);
			for (let i = matchIdx - 1; i >= 0; i--) {
				if (clean[i] === ';' || clean[i] === '{' || clean[i] === '}') {
					stmtStart = i + 1;
					break;
				}
			}
			const stmtText = clean.substring(stmtStart, matchIdx);
			const varDeclMatch = stmtText.match(/\b(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/);
			if (varDeclMatch) {
				const varName = varDeclMatch[1];
				const forwardText = clean.substring(matchIdx + matchLen, Math.min(clean.length, matchIdx + matchLen + 500));
				const dispatchWithVarRegex = new RegExp(`dispatch\\s*\\([^,]+,\\s*${varName}\\b`, 'i');
				if (dispatchWithVarRegex.test(forwardText)) {
					componentEvents.get(comp).emits.add(eventName);
					continue;
				}
			}
			
			unclassifiedLiterals.push({ comp, file: rel, lineNo, eventName });
		}
	}

	return { componentEvents, staticUniqueEvents, unclassifiedLiterals };
}

/**
 * Parses markdown component docs from `docs-mcp/components/*.md`.
 * @param {string} root
 * @returns {{ docEventsByComp: Map<string, Array<object>|null>, docEventsGlobal: Map<string, Array<object>>, docErrors: string[] }}
 */
export function parseDocs(root) {
	const docsDir = path.join(root, 'docs-mcp', 'components');
	const docEventsByComp = new Map();
	const docEventsGlobal = new Map();
	const docErrors = [];

	if (!fs.existsSync(docsDir)) return { docEventsByComp, docEventsGlobal, docErrors };

	const docFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();

	for (const file of docFiles) {
		const compName = path.basename(file, '.md');
		const raw = fs.readFileSync(path.join(docsDir, file), 'utf8');
		const eventsApiIdx = raw.indexOf('### Events API');
		if (eventsApiIdx === -1) {
			docEventsByComp.set(compName, null);
			continue;
		}

		const sectionStart = eventsApiIdx + '### Events API'.length;
		const afterSection = raw.substring(sectionStart);
		// Stop at next ## or ### heading (excluding Events API itself)
		const nextHeadingIdx = afterSection.search(/\n#{2,3}\s/);
		const sectionBody = (nextHeadingIdx !== -1 ? afterSection.substring(0, nextHeadingIdx) : afterSection).trim();

		if (sectionBody.includes('emits and listens to no custom ln-* events.') ||
			sectionBody.includes('emits and listens to no custom DOM events directly.')) {
			docEventsByComp.set(compName, []);
			continue;
		}

		// Split section into table blocks
		const lines = sectionBody.split('\n').map(l => l.trim());
		const tableBlocks = [];
		let currentBlock = [];

		for (const line of lines) {
			if (line.startsWith('|') && line.endsWith('|')) {
				currentBlock.push(line);
			} else {
				if (currentBlock.length >= 2) {
					tableBlocks.push(currentBlock);
				}
				currentBlock = [];
			}
		}
		if (currentBlock.length >= 2) {
			tableBlocks.push(currentBlock);
		}

		if (tableBlocks.length === 0) {
			docEventsByComp.set(compName, []);
			continue;
		}

		const list = [];
		for (const block of tableBlocks) {
			const headerCells = splitMarkdownRow(block[0]).map(c => c.toLowerCase());
			const eventIdx = headerCells.findIndex(c => c.includes('event'));
			const dirIdx = headerCells.findIndex(c => c.includes('direction'));
			const cancelIdx = headerCells.findIndex(c => c.includes('cancel'));
			const descIdx = headerCells.findIndex(c => c.includes('description'));
			const detailIdx = headerCells.findIndex(c => c.includes('detail'));

			if (eventIdx === -1 || dirIdx === -1) continue;

			for (let i = 2; i < block.length; i++) {
				const row = block[i];
				if (row.includes('---')) continue;
				const cells = splitMarkdownRow(row);
				if (cells.length < 3) continue;

				const eventCell = cells[eventIdx] || '';
				if (eventCell.toLowerCase() === 'event') continue;

				const matches = [...eventCell.matchAll(EVENT_DOC_RE)].map(m => m[1]);

				const direction = (cells[dirIdx] || '').replace(/[`*]/g, '').trim();
				if (direction && direction !== 'Emits' && direction !== 'Listens') {
					docErrors.push(`[${compName}.md] Non-conforming Direction "${direction}" for row "${eventCell}"`);
				}

				const rawCancel = (cells[cancelIdx] || '').replace(/[`*]/g, '').trim().toLowerCase();
				const cancelable = rawCancel === 'yes' || rawCancel === 'true';
				const description = cells[descIdx] || '';
				const detail = (cells[detailIdx] || '').replace(/^`|`$/g, '').trim();

				if (matches.length === 0) {
					const bareName = eventCell.replace(/[`*]/g, '').trim();
					if (bareName.startsWith('ln-')) {
						matches.push(bareName);
					}
				}

				for (const eventName of matches) {
					const entry = { name: eventName, direction, cancelable, description, detail };
					list.push(entry);
					if (!docEventsGlobal.has(eventName)) docEventsGlobal.set(eventName, []);
					docEventsGlobal.get(eventName).push({ comp: compName, ...entry });
				}
			}
		}

		docEventsByComp.set(compName, list);
	}

	return { docEventsByComp, docEventsGlobal, docErrors };
}

/**
 * Builds the by-component and flat index catalogs.
 * @param {Map<string, { emits: Set<string>, listens: Set<string> }>} componentEvents
 * @param {Set<string>} staticUniqueEvents
 * @param {Map<string, Array<object>|null>} docEventsByComp
 * @param {Map<string, Array<object>>} docEventsGlobal
 * @returns {{ byComponentJson: string, indexJson: string, allEvents: Map<string, object> }}
 */
export function buildCatalogs(componentEvents, staticUniqueEvents, docEventsByComp, docEventsGlobal) {
	const componentsOut = {};
	const allEvents = new Map();

	const sortedCompNames = [...componentEvents.keys()].sort();

	function findDocInfo(eventName, compName, direction) {
		const compList = docEventsByComp.get(compName);
		if (compList) {
			const match = compList.find(e => e.name === eventName && (direction ? e.direction.toLowerCase() === direction.toLowerCase() : true));
			if (match) return match;
			const nameMatch = compList.find(e => e.name === eventName);
			if (nameMatch) return nameMatch;
		}
		const globalList = docEventsGlobal.get(eventName);
		if (globalList && globalList.length > 0) {
			const dirMatch = direction ? globalList.find(e => e.direction.toLowerCase() === direction.toLowerCase()) : null;
			return dirMatch || globalList[0];
		}
		return null;
	}

	for (const comp of sortedCompNames) {
		const { emits, listens } = componentEvents.get(comp);
		const sortedEmits = [...emits].sort();
		const sortedListens = [...listens].sort();

		const emitsArr = sortedEmits.map((name) => {
			const doc = findDocInfo(name, comp, 'Emits');
			const isStatic = staticUniqueEvents.has(name);
			return {
				name,
				cancelable: doc ? doc.cancelable : name.includes(':before-'),
				description: doc ? doc.description : '',
				detail: doc ? doc.detail : '',
				source: isStatic ? 'static' : 'dynamic-allowlist'
			};
		});

		const listensArr = sortedListens.map((name) => {
			const doc = findDocInfo(name, comp, 'Listens');
			const isStatic = staticUniqueEvents.has(name);
			return {
				name,
				cancelable: doc ? doc.cancelable : false,
				description: doc ? doc.description : '',
				detail: doc ? doc.detail : '',
				source: isStatic ? 'static' : 'dynamic-allowlist'
			};
		});

		componentsOut[comp] = {
			emits: emitsArr,
			listens: listensArr
		};

		for (const item of emitsArr) {
			if (!allEvents.has(item.name)) {
				allEvents.set(item.name, {
					emitted_by: new Set(),
					listened_by: new Set(),
					cancelable: item.cancelable,
					description: item.description,
					detail: item.detail,
					source: item.source
				});
			}
			const entry = allEvents.get(item.name);
			entry.emitted_by.add(comp);
			if (item.source === 'static') entry.source = 'static';
			if (item.cancelable) entry.cancelable = true;
			if (!entry.description && item.description) entry.description = item.description;
			if (!entry.detail && item.detail) entry.detail = item.detail;
		}

		for (const item of listensArr) {
			if (!allEvents.has(item.name)) {
				allEvents.set(item.name, {
					emitted_by: new Set(),
					listened_by: new Set(),
					cancelable: item.cancelable,
					description: item.description,
					detail: item.detail,
					source: item.source
				});
			}
			const entry = allEvents.get(item.name);
			entry.listened_by.add(comp);
			if (item.source === 'static') entry.source = 'static';
			if (!entry.description && item.description) entry.description = item.description;
			if (!entry.detail && item.detail) entry.detail = item.detail;
		}
	}

	for (const [eventName, entry] of allEvents.entries()) {
		const prefix = eventName.split(':')[0];
		const nsDoc = findDocInfo(eventName, prefix, null);
		if (nsDoc) {
			if (nsDoc.cancelable) entry.cancelable = true;
			if (nsDoc.description) entry.description = nsDoc.description;
			if (nsDoc.detail) entry.detail = nsDoc.detail;
		}
	}

	const byComponentObj = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		title: 'ln-ashlar Events by Component Catalog',
		description: 'Machine-readable catalog of events emitted and listened to per component. Generated from source by scripts/sync-ln-events.mjs — do not hand-edit. The detail field is a human-readable signature, not a machine-checkable type.',
		generator: GENERATOR_NAME,
		components: componentsOut
	};

	const flatEventsObj = {};
	const sortedEventNames = [...allEvents.keys()].sort();
	for (const eventName of sortedEventNames) {
		const data = allEvents.get(eventName);
		flatEventsObj[eventName] = {
			emitted_by: [...data.emitted_by].sort(),
			listened_by: [...data.listened_by].sort(),
			cancelable: Boolean(data.cancelable),
			description: data.description || '',
			detail: data.detail || '',
			source: data.source
		};
	}

	const indexObj = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		title: 'ln-ashlar Flat Events Index',
		description: 'Flat index of all ln-* events for lookup. Generated — do not hand-edit. The detail field is a human-readable signature, not a machine-checkable type.',
		generator: GENERATOR_NAME,
		events: flatEventsObj
	};

	for (const evName of sortedEventNames) {
		if (evName.endsWith(':') || evName.endsWith('-') || evName.includes('${') || evName.includes('`')) {
			throw new Error(`Hard error: Invalid event key produced: "${evName}"`);
		}
	}

	const byComponentJson = JSON.stringify(byComponentObj, null, '\t') + '\n';
	const indexJson = JSON.stringify(indexObj, null, '\t') + '\n';

	return { byComponentJson, indexJson, allEvents };
}

function resolveRoot(argv) {
	const explicit = argv
		.filter((a) => a.startsWith('--root='))
		.map((a) => a.slice('--root='.length).trim())
		.filter(Boolean);
	if (explicit.length) return path.resolve(explicit[0]);
	return DEFAULT_REPO_ROOT;
}

export function main() {
	const argv = process.argv.slice(2);
	const checkOnly = argv.includes('--check');
	const strictMode = argv.includes('--strict');
	const root = resolveRoot(argv);

	const { compDirs, filesToScan } = getComponentFiles(root);

	// 1. Anti-rot guard
	const guardViolations = scanDynamicGuard(filesToScan, DYNAMIC_ALLOWLIST);
	if (guardViolations.length > 0) {
		console.error('\nsync-ln-events: FATAL — dynamic event dispatch guard failed:');
		for (const v of guardViolations) {
			console.error(`  - ${v.file}:${v.lineNo} (${v.callee}): ${v.eventArg}`);
		}
		console.error('Update DYNAMIC_ALLOWLIST in scripts/sync-ln-events.mjs to cover approved dynamic sites.\n');
		process.exit(1);
	}

	// 2. Extract static events
	const { componentEvents, staticUniqueEvents, unclassifiedLiterals } = extractStaticEvents(filesToScan, compDirs);

	// 3. Merge Dynamic Allowlist
	for (const entry of DYNAMIC_ALLOWLIST) {
		const relFile = entry.file.replace(/\\/g, '/');
		const compMatch = relFile.match(/^components\/([^/]+)/);
		const comp = compMatch ? compMatch[1] : null;
		if (comp && componentEvents.has(comp)) {
			for (const ev of entry.emits) componentEvents.get(comp).emits.add(ev);
			for (const ev of entry.listens) componentEvents.get(comp).listens.add(ev);
		}
	}

	// 4. Parse Docs
	const { docEventsByComp, docEventsGlobal, docErrors } = parseDocs(root);
	if (docErrors.length > 0) {
		console.warn('\nsync-ln-events: Documentation warnings:');
		for (const err of docErrors) console.warn(`  ⚠ ${err}`);
	}

	// 5. Build Catalogs
	const { byComponentJson, indexJson, allEvents } = buildCatalogs(
		componentEvents,
		staticUniqueEvents,
		docEventsByComp,
		docEventsGlobal
	);

	// 6. Reconciliation Stats
	const undocumented = [];
	for (const ev of allEvents.keys()) {
		if (!docEventsGlobal.has(ev)) undocumented.push(ev);
	}

	const phantoms = [];
	for (const [ev, entries] of docEventsGlobal.entries()) {
		if (!allEvents.has(ev)) phantoms.push({ name: ev, docs: entries.map(e => e.comp) });
	}

	// Output paths
	const schemasDir = path.join(root, 'docs-mcp', 'schemas');
	const byComponentPath = path.join(schemasDir, 'ln-ashlar-events-by-component.json');
	const indexPath = path.join(schemasDir, 'ln-ashlar-events-index.json');

	let existingByComp = null;
	let existingIndex = null;
	try { existingByComp = fs.readFileSync(byComponentPath, 'utf8').replace(/\r\n/g, '\n'); } catch { /* ignore */ }
	try { existingIndex = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n'); } catch { /* ignore */ }

	const byCompChanged = existingByComp !== byComponentJson;
	const indexChanged = existingIndex !== indexJson;
	const anyStale = byCompChanged || indexChanged;

	// Print summary report
	console.log(`sync-ln-events: root: ${root}`);
	console.log(`  scanned component files: ${filesToScan.length}`);
	console.log(`  statically extracted events: ${staticUniqueEvents.size}`);
	console.log(`  total unique events cataloged: ${allEvents.size}`);
	console.log(`  documented events: ${docEventsGlobal.size}`);
	console.log(`  undocumented events (source-only): ${undocumented.length}`);
	console.log(`  phantom events (docs-only): ${phantoms.length}`);

	if (unclassifiedLiterals.length > 0) {
		console.log(`\n  ⚠ Unclassified event literals (${unclassifiedLiterals.length}):`);
		for (const u of unclassifiedLiterals) {
			console.log(`    - [${u.comp}] ${u.file}:${u.lineNo} -> ${u.eventName}`);
		}
	}

	if (checkOnly || strictMode) {
		if (anyStale) {
			console.error(`\nsync-ln-events --check: schemas are stale and require generation.`);
			if (byCompChanged) console.error(`  - ${path.relative(root, byComponentPath)}`);
			if (indexChanged) console.error(`  - ${path.relative(root, indexPath)}`);
			console.error('\nRun `npm run sync:ln-events` to regenerate.');
			process.exit(1);
		}

		console.log('\nsync-ln-events --check: schemas up-to-date ✓ (drift: ' + undocumented.length + ' undocumented, ' + phantoms.length + ' phantom)');

		if (strictMode && (undocumented.length > 0 || phantoms.length > 0)) {
			console.error(`\nsync-ln-events --strict: FATAL — event drift detected (${undocumented.length} undocumented, ${phantoms.length} phantom).`);
			process.exit(1);
		}

		return;
	}

	// Write files
	if (!fs.existsSync(schemasDir)) {
		fs.mkdirSync(schemasDir, { recursive: true });
	}

	let writtenCount = 0;
	if (byCompChanged) {
		fs.writeFileSync(byComponentPath, byComponentJson, 'utf8');
		writtenCount++;
	}
	if (indexChanged) {
		fs.writeFileSync(indexPath, indexJson, 'utf8');
		writtenCount++;
	}

	if (writtenCount === 0) {
		console.log('\nsync-ln-events: no changes ✓ (both catalogs are up-to-date)');
	} else {
		console.log(`\nsync-ln-events: wrote ${writtenCount} catalog file(s).`);
	}
}

// Auto-run if executed as script
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
	main();
}
