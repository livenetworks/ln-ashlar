#!/usr/bin/env node

/**
 * scripts/sync-css-tokens.mjs
 *
 * Source-first CSS token extractor and table generator for ln-ashlar.
 * Derives token values directly from:
 *  - theme/config/_tokens.scss
 *  - theme/config/_palette.scss
 *  - theme/config/_theme.scss
 *
 * Emits non-destructive fenced token tables into:
 *  - docs-mcp/css/tokens.md
 *  - docs-mcp/css/theming.md
 *
 * Supports --check flag for CI drift validation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REPO_ROOT = path.resolve(__dirname, '..');

const GENERATOR_NAME = 'scripts/sync-css-tokens.mjs';
const FENCE_START = '<!-- sync:css-tokens:start -->';
const FENCE_END = '<!-- sync:css-tokens:end -->';

/**
 * Strips comments from SCSS code.
 * @param {string} code
 * @returns {string}
 */
export function stripComments(code) {
	return code
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\/\/.*/g, '');
}

/**
 * Extracts custom properties (--token: value;) from SCSS block.
 * @param {string} code
 * @returns {Map<string, string>}
 */
export function extractCssVariables(code) {
	const vars = new Map();
	const clean = stripComments(code);
	const regex = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
	let match;
	while ((match = regex.exec(clean)) !== null) {
		const name = match[1].trim();
		const val = match[2].trim().replace(/\s+/g, ' ');
		vars.set(name, val);
	}
	return vars;
}

/**
 * Extracts content inside a named mixin block `@mixin name { ... }`.
 * @param {string} code
 * @param {string} mixinName
 * @returns {string}
 */
export function extractMixinBody(code, mixinName) {
	const mixinIdx = code.indexOf(`@mixin ${mixinName}`);
	if (mixinIdx === -1) return '';
	const openBrace = code.indexOf('{', mixinIdx);
	if (openBrace === -1) return '';

	let depth = 1;
	let i = openBrace + 1;
	while (i < code.length && depth > 0) {
		if (code[i] === '{') depth++;
		else if (code[i] === '}') depth--;
		if (depth === 0) {
			return code.substring(openBrace + 1, i);
		}
		i++;
	}
	return '';
}

/**
 * Strictly requires a variable from a map, throwing if absent.
 * @param {Map<string, string>} map
 * @param {string} name
 * @param {string} sourceName
 * @returns {string}
 */
export function requireVar(map, name, sourceName) {
	const val = map.get(name);
	if (val === undefined || val === null || val === '') {
		throw new Error(`[sync-css-tokens] Missing required CSS token "${name}" in ${sourceName}`);
	}
	return val;
}

/**
 * Parses all token sources in the repository.
 * @param {string} root
 */
export function parseTokenSources(root) {
	const tokensScssPath = path.join(root, 'theme/config/_tokens.scss');
	const paletteScssPath = path.join(root, 'theme/config/_palette.scss');
	const themeScssPath = path.join(root, 'theme/config/_theme.scss');

	const tokensRaw = fs.readFileSync(tokensScssPath, 'utf8');
	const paletteRaw = fs.readFileSync(paletteScssPath, 'utf8');
	const themeRaw = fs.readFileSync(themeScssPath, 'utf8');

	const tokensVars = extractCssVariables(tokensRaw);
	const lightVars = extractCssVariables(extractMixinBody(paletteRaw, 'ln-values-light'));
	const darkVars = extractCssVariables(extractMixinBody(paletteRaw, 'ln-values-dark'));
	const colorChainVars = extractCssVariables(paletteRaw);

	return {
		tokensVars,
		lightVars,
		darkVars,
		colorChainVars
	};
}

/**
 * Formats a markdown table row.
 * @param {string} name
 * @param {string} kind
 * @param {string} values
 * @param {string} description
 * @returns {string}
 */
function row(name, kind, values, description) {
	return `| \`${name}\` | ${kind} | \`${values.replace(/\|/g, '\\|')}\` | ${description} |`;
}

/**
 * Generates the token table markdown for docs-mcp/css/tokens.md.
 * @param {ReturnType<typeof parseTokenSources>} sources
 * @returns {string}
 */
export function generateTokensTable(sources) {
	const { tokensVars, lightVars, darkVars, colorChainVars } = sources;

	const rows = [
		'| Name | Kind | Parameters / Values | Description |',
		'|---|---|---|---|',
		'| **Brand & Status Triplets (Bare HSL)** | | | |',
		row('--brand-primary', 'token', requireVar(lightVars, '--brand-primary', '_palette.scss (ln-values-light)'), 'Primary brand bare HSL triplet'),
		row('--brand-secondary', 'token', requireVar(lightVars, '--brand-secondary', '_palette.scss (ln-values-light)'), 'Brand secondary accent bare HSL triplet'),
		row('--color-success', 'token', requireVar(lightVars, '--color-success', '_palette.scss (ln-values-light)'), 'Success status bare HSL triplet'),
		row('--color-error', 'token', requireVar(lightVars, '--color-error', '_palette.scss (ln-values-light)'), 'Error status bare HSL triplet'),
		row('--color-warning', 'token', requireVar(lightVars, '--color-warning', '_palette.scss (ln-values-light)'), 'Caution status bare HSL triplet'),
		row('--color-info', 'token', requireVar(lightVars, '--color-info', '_palette.scss (ln-values-light)'), 'Info status bare HSL triplet'),
		'| **Vocabulary Tokens (Light vs. Dark)** | | | |',
		row('--bg-base', 'token', `${requireVar(lightVars, '--bg-base', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-base', '_palette.scss (ln-values-dark)')} (dark)`, 'Base canvas background'),
		row('--bg-elevated', 'token', `${requireVar(lightVars, '--bg-elevated', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-elevated', '_palette.scss (ln-values-dark)')} (dark)`, 'Raised card background'),
		row('--bg-sunken', 'token', `${requireVar(lightVars, '--bg-sunken', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-sunken', '_palette.scss (ln-values-dark)')} (dark)`, 'Static sunken well and table header fill (flips lighter in dark)'),
		row('--bg-recessed', 'token', `${requireVar(lightVars, '--bg-recessed', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-recessed', '_palette.scss (ln-values-dark)')} (dark)`, 'Recessed ground and input fill'),
		row('--bg-hover', 'token', `${requireVar(lightVars, '--bg-hover', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-hover', '_palette.scss (ln-values-dark)')} (dark)`, 'Neutral interactive hover background'),
		row('--bg-active', 'token', `${requireVar(lightVars, '--bg-active', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-active', '_palette.scss (ln-values-dark)')} (dark)`, 'Neutral interactive active/pressed background'),
		row('--fg-default', 'token', `${requireVar(lightVars, '--fg-default', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--fg-default', '_palette.scss (ln-values-dark)')} (dark)`, 'High-contrast primary text'),
		row('--fg-muted', 'token', `${requireVar(lightVars, '--fg-muted', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--fg-muted', '_palette.scss (ln-values-dark)')} (dark)`, 'Muted secondary text and captions'),
		row('--fg-subtle', 'token', `${requireVar(lightVars, '--fg-subtle', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--fg-subtle', '_palette.scss (ln-values-dark)')} (dark)`, 'Subtle secondary text'),
		row('--border-subtle', 'token', `${requireVar(lightVars, '--border-subtle', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--border-subtle', '_palette.scss (ln-values-dark)')} (dark)`, 'Subtle separator border'),
		row('--border-strong', 'token', `${requireVar(lightVars, '--border-strong', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--border-strong', '_palette.scss (ln-values-dark)')} (dark)`, 'Focused and high-contrast border'),
		'| **Interaction State Tokens** | | | |',
		row('--tint-hover', 'token', requireVar(tokensVars, '--tint-hover', '_tokens.scss'), 'Accent-wash ratio for interactive hover'),
		row('--tint-selected', 'token', requireVar(tokensVars, '--tint-selected', '_tokens.scss'), 'Accent-wash ratio for selected items'),
		row('--tint-active', 'token', requireVar(tokensVars, '--tint-active', '_tokens.scss'), 'Accent-wash ratio for active/pressed items'),
		row('--color-accent-tint', 'token', requireVar(colorChainVars, '--color-accent-tint', '_palette.scss (ln-color-chain)'), 'Computed light accent wash'),
		row('--color-accent-tint-strong', 'token', requireVar(colorChainVars, '--color-accent-tint-strong', '_palette.scss (ln-color-chain)'), 'Computed strong accent wash'),
		'| **Spacing Scale Primitives** | | | |',
		row('--size-2xs', 'token', requireVar(tokensVars, '--size-2xs', '_tokens.scss'), '2px spacing step'),
		row('--size-xs', 'token', requireVar(tokensVars, '--size-xs', '_tokens.scss'), '4px spacing step'),
		row('--size-xs-up', 'token', requireVar(tokensVars, '--size-xs-up', '_tokens.scss'), '6px spacing step'),
		row('--size-sm', 'token', requireVar(tokensVars, '--size-sm', '_tokens.scss'), '8px spacing step'),
		row('--size-sm-up', 'token', requireVar(tokensVars, '--size-sm-up', '_tokens.scss'), '12px spacing step'),
		row('--size-md', 'token', requireVar(tokensVars, '--size-md', '_tokens.scss'), '16px base spacing step'),
		row('--size-md-up', 'token', requireVar(tokensVars, '--size-md-up', '_tokens.scss'), '20px spacing step'),
		row('--size-lg', 'token', requireVar(tokensVars, '--size-lg', '_tokens.scss'), '24px spacing step'),
		row('--size-xl', 'token', requireVar(tokensVars, '--size-xl', '_tokens.scss'), '32px spacing step'),
		row('--size-2xl', 'token', requireVar(tokensVars, '--size-2xl', '_tokens.scss'), '48px spacing step'),
		row('--size-3xl', 'token', requireVar(tokensVars, '--size-3xl', '_tokens.scss'), '64px spacing step'),
		'| **Radii & Dimensions** | | | |',
		row('--radius-xs', 'token', requireVar(tokensVars, '--radius-xs', '_tokens.scss'), '2px border radius'),
		row('--radius-sm', 'token', requireVar(tokensVars, '--radius-sm', '_tokens.scss'), '4px border radius'),
		row('--radius-md', 'token', requireVar(tokensVars, '--radius-md', '_tokens.scss'), '6px border radius'),
		row('--radius-lg', 'token', requireVar(tokensVars, '--radius-lg', '_tokens.scss'), '8px border radius'),
		row('--radius-xl', 'token', requireVar(tokensVars, '--radius-xl', '_tokens.scss'), '12px border radius'),
		row('--radius-2xl', 'token', requireVar(tokensVars, '--radius-2xl', '_tokens.scss'), '16px border radius'),
		row('--radius-full', 'token', requireVar(tokensVars, '--radius-full', '_tokens.scss'), 'Pill / circular radius'),
		row('--border-width', 'token', requireVar(tokensVars, '--border-width', '_tokens.scss'), 'Standard 1px border stroke'),
		row('--border-width-strong', 'token', requireVar(tokensVars, '--border-width-strong', '_tokens.scss'), 'Thick 2px border stroke'),
		'| **Typography Primitives & Scale** | | | |',
		row('--font-size', 'token', requireVar(tokensVars, '--font-size', '_tokens.scss'), 'Default body font size primitive'),
		row('--line-height', 'token', requireVar(tokensVars, '--line-height', '_tokens.scss'), 'Default line height primitive'),
		row('--text-heading-lg', 'token', requireVar(tokensVars, '--text-heading-lg', '_tokens.scss'), 'Large heading font size'),
		row('--text-heading-md', 'token', requireVar(tokensVars, '--text-heading-md', '_tokens.scss'), 'Medium heading font size'),
		row('--text-title-md', 'token', requireVar(tokensVars, '--text-title-md', '_tokens.scss'), 'Title / card header font size'),
		row('--text-body-md', 'token', requireVar(tokensVars, '--text-body-md', '_tokens.scss'), 'Primary body font size (14px)'),
		row('--text-caption', 'token', requireVar(tokensVars, '--text-caption', '_tokens.scss'), 'Small caption font size (12px)'),
		'| **Z-Index Layer Scale** | | | |',
		row('--z-sticky', 'token', requireVar(tokensVars, '--z-sticky', '_tokens.scss'), 'Sticky elements'),
		row('--z-dropdown', 'token', requireVar(tokensVars, '--z-dropdown', '_tokens.scss'), 'Dropdown menus (non-top-layer fallback)'),
		row('--z-overlay', 'token', requireVar(tokensVars, '--z-overlay', '_tokens.scss'), 'Backdrop overlays'),
		row('--z-modal', 'token', requireVar(tokensVars, '--z-modal', '_tokens.scss'), 'Modal dialogs (non-top-layer fallback)'),
		row('--z-toast', 'token', requireVar(tokensVars, '--z-toast', '_tokens.scss'), 'Toast notification stack'),
		'| **Logical Primitives (What Mixins Read)** | | | |',
		row('--color-bg', 'token', requireVar(colorChainVars, '--color-bg', '_palette.scss (ln-color-chain)'), 'Active surface background'),
		row('--color-fg', 'token', requireVar(colorChainVars, '--color-fg', '_palette.scss (ln-color-chain)'), 'Active text color'),
		row('--color-border', 'token', requireVar(colorChainVars, '--color-border', '_palette.scss (ln-color-chain)'), 'Active border color'),
		row('--shadow', 'token', requireVar(colorChainVars, '--shadow', '_palette.scss (ln-color-chain)'), 'Active surface elevation shadow'),
		row('--padding-x', 'token', requireVar(tokensVars, '--padding-x', '_tokens.scss'), 'Horizontal padding primitive'),
		row('--padding-y', 'token', requireVar(tokensVars, '--padding-y', '_tokens.scss'), 'Vertical padding primitive'),
		row('--gap', 'token', requireVar(tokensVars, '--gap', '_tokens.scss'), 'Layout gap primitive'),
		row('--radius', 'token', requireVar(tokensVars, '--radius', '_tokens.scss'), 'Component corner radius primitive')
	];

	return rows.join('\n');
}

/**
 * Generates the theming table markdown for docs-mcp/css/theming.md.
 * @param {ReturnType<typeof parseTokenSources>} sources
 * @returns {string}
 */
export function generateThemingTable(sources) {
	const { lightVars, darkVars } = sources;

	const rows = [
		'| Name | Kind | Parameters / Values | Description |',
		'|---|---|---|---|',
		'| `ln-values-light` | mixin | — | Injects default light mode neutral scale, status tints, and vocabulary |',
		'| `ln-values-dark` | mixin | — | Injects dark mode inverted neutral scale, status tints, and vocabulary |',
		'| `ln-color-chain` | mixin | — | Evaluates semantic colors, shadows, and computed accent tints at `:root`, `[data-theme]`, `[data-mode]` |',
		'| `data-mode="dark"` | attribute | — | Activates dark polarity (bg/fg base values + native color-scheme) |',
		'| `data-mode="light"` | attribute | — | Forces light polarity vocabulary and color-scheme |',
		'| `data-theme="ocean"` | attribute | — | Oceanic teal brand palette preset (`--brand-primary: 190 80% 35%`) |',
		'| `data-theme="sunset"` | attribute | — | Sunset warm coral brand palette preset (`--brand-primary: 10 80% 50%`) |',
		'| `data-theme="midnight"` | attribute | — | Midnight deep purple brand palette preset (`--brand-primary: 265 70% 60%`); pair with `data-mode="dark"` |',
		'| `data-theme="glass"` | attribute | — | Glass luminous blue brand palette preset (`--brand-primary: 218 95% 62%`) |',
		'| `data-skin="glass"` | attribute | — | Glass structural preset — flat radius/shadow, translucent button chrome, accent nav/menu rebinds. Polarity-agnostic |',
		row('--brand-primary', 'token', requireVar(lightVars, '--brand-primary', '_palette.scss (ln-values-light)'), 'Primary brand color bare HSL triplet'),
		row('--brand-secondary', 'token', requireVar(lightVars, '--brand-secondary', '_palette.scss (ln-values-light)'), 'Secondary brand color bare HSL triplet'),
		row('--bg-base', 'token', `${requireVar(lightVars, '--bg-base', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-base', '_palette.scss (ln-values-dark)')} (dark)`, 'Base canvas background'),
		row('--bg-elevated', 'token', `${requireVar(lightVars, '--bg-elevated', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-elevated', '_palette.scss (ln-values-dark)')} (dark)`, 'Elevated card surface (flat in light, +6% in dark)'),
		row('--bg-sunken', 'token', `${requireVar(lightVars, '--bg-sunken', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-sunken', '_palette.scss (ln-values-dark)')} (dark)`, 'Sunken well surface (darker in light, +9% in dark)'),
		row('--bg-recessed', 'token', `${requireVar(lightVars, '--bg-recessed', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--bg-recessed', '_palette.scss (ln-values-dark)')} (dark)`, 'Page ground and recessed fill (darker in both themes)'),
		row('--fg-default', 'token', `${requireVar(lightVars, '--fg-default', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--fg-default', '_palette.scss (ln-values-dark)')} (dark)`, 'Primary text color'),
		row('--fg-muted', 'token', `${requireVar(lightVars, '--fg-muted', '_palette.scss (ln-values-light)')} (light) / ${requireVar(darkVars, '--fg-muted', '_palette.scss (ln-values-dark)')} (dark)`, 'Muted text color')
	];

	return rows.join('\n');
}

/**
 * Replaces or wraps table in fenced comments.
 * @param {string} content
 * @param {string} generatedTable
 * @returns {string}
 */
export function injectFencedTable(content, generatedTable) {
	const fenceBlock = `${FENCE_START}\n${generatedTable}\n${FENCE_END}`;
	const startIdx = content.indexOf(FENCE_START);
	const endIdx = content.indexOf(FENCE_END);

	if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
		return content.substring(0, startIdx) + fenceBlock + content.substring(endIdx + FENCE_END.length);
	}

	// Fallback: search for ## 3. SCSS API heading
	const headingRegex = /(## 3\. SCSS API[^\n]*\n\n)/;
	const match = headingRegex.exec(content);
	if (match) {
		const afterHeading = content.substring(match.index + match[0].length);
		// Find end of section before next ## heading
		const nextSectionMatch = /\n(## \d\.)/.exec(afterHeading);
		if (nextSectionMatch) {
			const restOfDoc = afterHeading.substring(nextSectionMatch.index);
			return content.substring(0, match.index + match[0].length) + fenceBlock + '\n' + restOfDoc;
		}
	}

	return content;
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
	const root = resolveRoot(argv);

	const tokensDocPath = path.join(root, 'docs-mcp/css/tokens.md');
	const themingDocPath = path.join(root, 'docs-mcp/css/theming.md');

	try {
		const sources = parseTokenSources(root);
		const generatedTokensTable = generateTokensTable(sources);
		const generatedThemingTable = generateThemingTable(sources);

		const tokensDocRaw = fs.readFileSync(tokensDocPath, 'utf8');
		const themingDocRaw = fs.readFileSync(themingDocPath, 'utf8');

		const updatedTokensDoc = injectFencedTable(tokensDocRaw, generatedTokensTable);
		const updatedThemingDoc = injectFencedTable(themingDocRaw, generatedThemingTable);

		const tokensChanged = tokensDocRaw.replace(/\r\n/g, '\n') !== updatedTokensDoc.replace(/\r\n/g, '\n');
		const themingChanged = themingDocRaw.replace(/\r\n/g, '\n') !== updatedThemingDoc.replace(/\r\n/g, '\n');

		if (checkOnly) {
			if (tokensChanged || themingChanged) {
				console.error('sync-css-tokens --check: token tables require updating:');
				if (tokensChanged) console.error('  - docs-mcp/css/tokens.md');
				if (themingChanged) console.error('  - docs-mcp/css/theming.md');
				console.error('\nRun `npm run sync:css-tokens` to regenerate token tables.');
				process.exit(1);
			}
			console.log('sync-css-tokens --check: fresh ✓ (all token tables match source)');
			return;
		}

		if (!tokensChanged && !themingChanged) {
			console.log('sync-css-tokens: no changes ✓ (token tables already synchronized)');
			return;
		}

		if (tokensChanged) {
			fs.writeFileSync(tokensDocPath, updatedTokensDoc, 'utf8');
			console.log('  ✓ Updated docs-mcp/css/tokens.md');
		}
		if (themingChanged) {
			fs.writeFileSync(themingDocPath, updatedThemingDoc, 'utf8');
			console.log('  ✓ Updated docs-mcp/css/theming.md');
		}
		console.log('sync-css-tokens: completed successfully.');
	} catch (err) {
		console.error(`sync-css-tokens error: ${err.message}`);
		process.exit(1);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main();
}
