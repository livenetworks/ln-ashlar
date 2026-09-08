import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass-embedded';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CONFIG_DIR = path.join(REPO_ROOT, 'theme/config');

/**
 * Compiles a probe SCSS string that @use's the contrast module and emits
 * a single expression into a custom property, returning the raw compiled
 * CSS so callers can regex out the value.
 * @param {string} expr - Sass expression referencing `c.<fn>(...)`.
 * @returns {string}
 */
function compileProbe(expr) {
	const source = `
		@use 'contrast' as c;
		:root {
			--probe: #{${expr}};
		}
	`;
	const compiled = sass.compileString(source, {
		loadPaths: [CONFIG_DIR]
	});
	return compiled.css;
}

function probeValue(expr) {
	const css = compileProbe(expr);
	const match = css.match(/--probe:\s*([^;]*);/);
	return match ? match[1].trim() : '';
}

test('contrast(): ratio matches expected values within tolerance', () => {
	const cases = [
		['c.contrast(hsl(190, 80%, 35%), white)', 4.11],
		['c.contrast(hsl(221, 83%, 48%), white)', 6.15],
		['c.contrast(hsl(10, 80%, 50%), white)', 4.20],
		['c.contrast(hsl(218, 95%, 62%), white)', 3.50],
		['c.contrast(hsl(190, 80%, 60%), hsl(0, 0%, 10%))', 9.52]
	];

	for (const [expr, expected] of cases) {
		const raw = probeValue(expr);
		const actual = Number(raw);
		assert.ok(
			Math.abs(actual - expected) < 0.01,
			`${expr} → expected ≈${expected}, got ${raw}`
		);
	}
});

test('solve-l(): exact integer lightness match', () => {
	const cases = [
		['c.solve-l(190, 80%, 7, white)', 24],
		['c.solve-l(10, 80%, 7, white)', 36],
		['c.solve-l(265, 70%, 7, white)', 50],
		['c.solve-l(218, 95%, 7, white)', 41],
		['c.solve-l(221, 83%, 7, white)', 43]
	];

	for (const [expr, expected] of cases) {
		const raw = probeValue(expr);
		assert.equal(Number(raw), expected, `${expr} → expected ${expected}, got ${raw}`);
	}
});

test('solve-l(): unreachable target returns null (empty emitted value)', () => {
	const raw = probeValue('c.solve-l(190, 80%, 21.5, white)');
	assert.equal(raw, '', `expected empty value for unreachable target, got "${raw}"`);
});

test('on-color(): target 4.5 resolves to white', () => {
	const raw = probeValue('c.on-color(hsl(221, 83%, 48%), 4.5)');
	assert.equal(raw, 'white');
});

test('on-color(): target 7 has no legal pole and throws', () => {
	assert.throws(
		() => compileProbe('c.on-color(hsl(221, 83%, 48%), 7)'),
		/on-color\(\): no pole/
	);
});

test('public constants: $ln-contrast-text/fill/ui are declared with expected values', () => {
	const raw = fs.readFileSync(path.join(CONFIG_DIR, '_contrast.scss'), 'utf8');

	assert.match(raw, /^\$ln-contrast-text:\s*7;/m);
	assert.match(raw, /^\$ln-contrast-fill:\s*7;/m);
	assert.match(raw, /^\$ln-contrast-ui:\s*3;/m);
});

test('dark-ink pole constant: $_ln-contrast-ink is pinned to hsl(222 47% 11%)', () => {
	const raw = fs.readFileSync(path.join(CONFIG_DIR, '_contrast.scss'), 'utf8');

	assert.match(raw, /^\$_ln-contrast-ink:\s*hsl\(222 47% 11%\);/m);
});
