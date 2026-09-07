import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass-embedded';
import { requireVar, parseTokenSources } from '../scripts/sync-css-tokens.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

test('theme cascade: _theme.scss uses :where() zero-specificity selectors for default themes', () => {
	const themeScssPath = path.join(REPO_ROOT, 'theme/config/_theme.scss');

	// Compile SCSS to CSS
	const compiled = sass.compile(themeScssPath, {
		loadPaths: [path.join(REPO_ROOT, 'theme')]
	});
	const css = compiled.css;

	// Verify :where(:root) or :where([data-mode=light]) exists in compiled CSS
	assert.match(
		css,
		/:where\(:root\)|:where\(\[data-mode=["']?light["']?\]\)/,
		'_theme.scss must wrap default light theme in :where() for zero specificity'
	);

	// Verify :where([data-mode=dark]) exists in compiled CSS
	assert.match(
		css,
		/:where\(\[data-mode=["']?dark["']?\]\)/,
		'_theme.scss must wrap default dark theme in :where() for zero specificity'
	);
});

test('theme cascade (§6.8): brand.css overrides default theme regardless of stylesheet order', () => {
	const brandCssPath = path.join(REPO_ROOT, 'theme/brand.css');
	const brandCss = fs.readFileSync(brandCssPath, 'utf8');

	// brand.css uses standard :root, [data-mode="light"] which has specificity (0,1,0)
	assert.match(brandCss, /:root,\s*\[data-mode=["']?light["']?\]/);
	assert.match(brandCss, /\[data-mode=["']?dark["']?\]/);

	// Verify bare HSL triplets format
	assert.match(brandCss, /--brand-primary:\s*\d+\s+\d+%\s+\d+%;/);
	assert.match(brandCss, /--brand-secondary:\s*\d+\s+\d+%\s+\d+%;/);
});

test('theme cascade (§6.4/§6.5): scoped-theme demo page is valid and linked from sitemap', () => {
	const scopedThemePath = path.join(REPO_ROOT, 'demo/scoped-theme.html');
	assert.ok(fs.existsSync(scopedThemePath), 'demo/scoped-theme.html must exist');

	const sitemapPath = path.join(REPO_ROOT, 'demo/sitemap.xml');
	const sitemap = fs.readFileSync(sitemapPath, 'utf8');
	assert.match(sitemap, /<loc>scoped-theme\.html<\/loc>/, 'sitemap.xml must list scoped-theme.html');

	const demoIndexPath = path.join(REPO_ROOT, 'demo/index.html');
	const demoIndex = fs.readFileSync(demoIndexPath, 'utf8');
	assert.match(demoIndex, /href=["']scoped-theme\.html["']/, 'demo/index.html must link to scoped-theme.html');
});

/**
 * Collects every `var(--x)` appearing in a custom-property value declared
 * DIRECTLY at a top-level [data-skin=…] / [data-theme=…] root. Nested blocks
 * are excluded: those sit on the consuming element, where component-local
 * tokens legitimately resolve.
 * @param {string} raw
 * @returns {{selector: string, prop: string, ref: string}[]}
 */
function collectSkinRootVarRefs(raw) {
	const refs = [];
	let depth = 0;
	let blockDepth = null;
	let selector = null;

	for (const line of raw.split('\n')) {
		const trimmed = line.trim();

		if (blockDepth === null && /^\[data-(?:skin|theme)="[^"]+"\]\s*[,{]/.test(trimmed)) {
			selector = trimmed.replace(/\s*[,{].*$/, '');
			blockDepth = depth;
		}

		if (blockDepth !== null && depth === blockDepth + 1) {
			const decl = trimmed.match(/^(--[a-z0-9-]+)\s*:\s*(.+);$/i);
			if (decl) {
				for (const ref of decl[2].matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
					refs.push({ selector, prop: decl[1], ref: ref[1] });
				}
			}
		}

		depth += (line.match(/\{/g) || []).length;
		depth -= (line.match(/\}/g) || []).length;

		if (blockDepth !== null && depth <= blockDepth) {
			blockDepth = null;
			selector = null;
		}
	}

	return refs;
}

test('Root-Resolvability: skin/theme roots only reference tokens that resolve at <html>', () => {
	const raw = fs.readFileSync(path.join(REPO_ROOT, 'theme/config/_theme.scss'), 'utf8');
	const sources = parseTokenSources(REPO_ROOT);

	// A var() inside a custom-property value is substituted at the element
	// carrying the selector. data-skin/data-theme sit on <html>, so only tokens
	// declared by _tokens.scss :root or _palette.scss resolve there. A token
	// that exists only inside a component mixin yields an invalid value that
	// silently clobbers the correct base default.
	const rootResolvable = new Set([
		...sources.tokensVars.keys(),
		...sources.lightVars.keys(),
		...sources.darkVars.keys(),
		...sources.colorChainVars.keys()
	]);

	const offenders = collectSkinRootVarRefs(raw)
		.filter(({ ref }) => !rootResolvable.has(ref))
		.map(({ selector, prop, ref }) => `${selector} { ${prop}: … var(${ref}) }`);

	assert.deepEqual(
		offenders,
		[],
		`Skin/theme root declarations must not reference component-local tokens:\n  ${offenders.join('\n  ')}`
	);
});

test('Ramp binding: the dark vocabulary derives from the neutral ramp, never from literals', () => {
	const { darkVars } = parseTokenSources(REPO_ROOT);

	const literals = [];
	for (const [name, value] of darkVars) {
		if (!/^--(?:bg|fg|border)-/.test(name)) continue;
		if (!/var\(--color-neutral-/.test(value)) literals.push(`${name}: ${value}`);
	}

	assert.deepEqual(
		literals,
		[],
		`ln-values-dark must bind surface/text/border tokens to --color-neutral-*, not hand-tuned literals:\n  ${literals.join('\n  ')}`
	);
});

test('Derivation selector stays at normal specificity, unlike the paints beside it', () => {
	const raw = fs.readFileSync(path.join(REPO_ROOT, 'theme/config/_theme.scss'), 'utf8');

	// The chain must NOT be :where()-wrapped — it has to outrank the
	// zero-specificity value blocks. The color/background paints below it must.
	assert.match(
		raw,
		/^:root,\n\[data-theme\],\n\[data-mode\] \{\n\t@include ln-color-chain;/m,
		'ln-color-chain must stay on unwrapped :root, [data-theme], [data-mode]'
	);
	assert.match(raw, /^:where\(\[data-mode\]\) \{\n\tcolor: var\(--color-fg\);/m);
	assert.match(raw, /^:where\(\[data-mode\]:not\(html\):not\(body\)\) \{\n\tbackground-color: var\(--color-bg\);/m);
});

test('sync-css-tokens integrity: requireVar throws loudly on missing tokens', () => {
	const emptyMap = new Map();
	assert.throws(
		() => requireVar(emptyMap, '--missing-token', 'test-source'),
		/\[sync-css-tokens\] Missing required CSS token "--missing-token"/
	);

	const sources = parseTokenSources(REPO_ROOT);
	// Real sources must contain all required primitives
	assert.equal(requireVar(sources.lightVars, '--brand-primary', '_palette.scss'), '221 83% 48%');
	assert.equal(requireVar(sources.tokensVars, '--size-md', '_tokens.scss'), '1rem');
});
