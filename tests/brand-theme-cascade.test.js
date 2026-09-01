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

	// Verify :where(:root) or :where([data-theme=light]) exists in compiled CSS
	assert.match(
		css,
		/:where\(:root\)|:where\(\[data-theme=["']?light["']?\]\)/,
		'_theme.scss must wrap default light theme in :where() for zero specificity'
	);

	// Verify :where([data-theme=dark]) exists in compiled CSS
	assert.match(
		css,
		/:where\(\[data-theme=["']?dark["']?\]\)/,
		'_theme.scss must wrap default dark theme in :where() for zero specificity'
	);
});

test('theme cascade (§6.8): brand.css overrides default theme regardless of stylesheet order', () => {
	const brandCssPath = path.join(REPO_ROOT, 'theme/brand.css');
	const brandCss = fs.readFileSync(brandCssPath, 'utf8');

	// brand.css uses standard :root, [data-theme="light"] which has specificity (0,1,0)
	assert.match(brandCss, /:root,\s*\[data-theme=["']?light["']?\]/);
	assert.match(brandCss, /\[data-theme=["']?dark["']?\]/);

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
