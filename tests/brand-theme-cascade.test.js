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

	// Assert against LIVE css only — the dark block below is a commented-out
	// opt-in and must not satisfy these matches.
	const live = brandCss.replace(/\/\*[\s\S]*?\*\//g, '');

	// :root at (0,1,0) outranks the library's :where(:root) at (0,0,0),
	// regardless of stylesheet load order. That is brand.css's guarantee.
	assert.match(live, /^:root \{/m);

	// Brand carries no polarity opinion — the template declares it once.
	assert.doesNotMatch(live, /\[data-mode=["']?(light|dark)["']?\]/);

	// Bare HSL triplets — hsl() wrapping would break slash-syntax alpha.
	assert.match(live, /--brand-primary:\s*\d+\s+\d+%\s+\d+%;/);
	assert.match(live, /--brand-secondary:\s*\d+\s+\d+%\s+\d+%;/);
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
	assert.equal(requireVar(sources.colorChainVars, '--brand-primary', '_palette.scss'), '221 83% 48%');
	assert.equal(requireVar(sources.tokensVars, '--size-md', '_tokens.scss'), '1rem');
});

test('Values symmetry: a vocabulary token declared in one polarity must be declared in both', () => {
	const raw = fs.readFileSync(path.join(REPO_ROOT, 'theme/config/_palette.scss'), 'utf8');

	// Surface vocabulary only — this is the class that carries a polarity-
	// dependent value and therefore leaks its stale substitution across an
	// island boundary. Status hues are a separate concern; see plan §Д.
	const VOCABULARY = /^--(bg|fg|border|input)-/;

	const bodyOf = (name) => {
		const start = raw.indexOf(`@mixin ${name} {`);
		let depth = 0, out = '', open = false;
		for (let i = start; i < raw.length; i++) {
			const ch = raw[i];
			if (ch === '{') { depth++; open = true; }
			else if (ch === '}') { depth--; if (open && depth === 0) break; }
			out += ch;
		}
		return out;
	};
	const propsOf = (body) =>
		new Set(
			[...body.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)]
				.map((m) => m[1])
				.filter((p) => VOCABULARY.test(p))
		);

	const light = propsOf(bodyOf('ln-values-light'));
	const dark = propsOf(bodyOf('ln-values-dark'));

	const asymmetric = [
		...[...light].filter((p) => !dark.has(p)).map((p) => `${p} (light only)`),
		...[...dark].filter((p) => !light.has(p)).map((p) => `${p} (dark only)`)
	];

	assert.deepEqual(
		asymmetric,
		[],
		`A token declared in one values mixin but not the other inherits its stale\n` +
		`value across every island boundary. Declare it in both, or in neither:\n  ` +
		`${asymmetric.join('\n  ')}`
	);
});

test('Polarity-free literals: a value identical in both mixins belongs at :where(:root)', () => {
	const raw = fs.readFileSync(path.join(REPO_ROOT, 'theme/config/_palette.scss'), 'utf8');

	const bodyOf = (name) => {
		const start = raw.indexOf(`@mixin ${name} {`);
		let depth = 0, out = '', open = false;
		for (let i = start; i < raw.length; i++) {
			const ch = raw[i];
			if (ch === '{') { depth++; open = true; }
			else if (ch === '}') { depth--; if (open && depth === 0) break; }
			out += ch;
		}
		return out;
	};

	// name -> value, EXCLUDING var()-valued declarations. A var()-valued token
	// (e.g. --bg-recessed: hsl(var(--color-neutral-50))) is textually identical
	// across both mixins on purpose — the --color-neutral-* ramp inverts
	// underneath it. Hoisting those to :where(:root) would freeze the var()
	// substitution at <html> and break the ramp inversion (the --radius failure
	// mode). Only a byte-identical LITERAL carries no polarity opinion.
	const literalsOf = (body) => {
		const map = new Map();
		for (const m of body.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*(.+?);/gim)) {
			const [, name, value] = m;
			if (/var\(/.test(value)) continue;
			map.set(name, value);
		}
		return map;
	};

	const light = literalsOf(bodyOf('ln-values-light'));
	const dark = literalsOf(bodyOf('ln-values-dark'));

	const polarityFree = [...light.keys()]
		.filter((name) => dark.has(name) && dark.get(name) === light.get(name))
		.map((name) => `${name}: ${light.get(name)}`);

	assert.deepEqual(
		polarityFree,
		[],
		`A token with a byte-identical literal value in both mixins carries no\n` +
		`polarity opinion. Move it out of ln-values-light / ln-values-dark into the\n` +
		`:where(:root) brand block in _palette.scss:\n  ${polarityFree.join('\n  ')}`
	);
});
