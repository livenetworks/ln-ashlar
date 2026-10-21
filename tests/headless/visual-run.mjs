// Visual & Design / Interaction Test Suite Runner
// Validates visual layout consistency, responsive bounds, and UI interaction states
// across CSS engines (Ashlar SCSS vs Tailwind v4) for all 67 demo admin pages.
//
// Usage:
//   node tests/headless/visual-run.mjs              # Run all 67 pages
//   node tests/headless/visual-run.mjs --static     # Run only 21 pure CSS & layout pages
//   node tests/headless/visual-run.mjs --interactive# Run only 46 interactive pages
//   node tests/headless/visual-run.mjs forms modal  # Run specific pages
//   node tests/headless/visual-run.mjs --screenshots# Capture PNG screenshots

import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_SPECS } from './_page_specs.mjs';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'dual');
const TIMEOUT_MS = 60000;

let names = readdirSync(dir)
	.filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
	.map((f) => f.slice(0, -4))
	.sort();

const args = process.argv.slice(2);

// Filter by category if requested
if (args.includes('--static')) {
	names = names.filter((n) => PAGE_SPECS[n] && !PAGE_SPECS[n].interactive);
} else if (args.includes('--interactive')) {
	names = names.filter((n) => PAGE_SPECS[n] && PAGE_SPECS[n].interactive);
} else {
	const specifiedNames = args.filter((a) => !a.startsWith('--'));
	if (specifiedNames.length > 0) {
		names = names.filter((n) => specifiedNames.includes(n));
	}
}

console.log(`\n===============================================================`);
console.log(`🎨 VISUAL & DESIGN / INTERACTION SUITE (Ashlar vs Tailwind v4)`);
console.log(`Evaluating visual layout & structure for ${names.length} demo pages...`);
console.log(`===============================================================\n`);

const runOne = (name) => new Promise((resolve) => {
	const start = Date.now();
	let out = '';
	let timedOut = false;

	const child = spawn(process.execPath, [join(dir, name + '.mjs')], { cwd: dir });

	const timer = setTimeout(() => {
		timedOut = true;
		try { process.kill(child.pid); } catch {}
	}, TIMEOUT_MS);

	child.stdout.on('data', (d) => { out += d; });
	child.stderr.on('data', (d) => { out += d; });

	child.on('close', (code) => {
		clearTimeout(timer);
		const lines = out.split(/\r?\n/);
		const pass = lines.filter((l) => l.startsWith('  ✓')).length;
		const fail = lines.filter((l) => l.startsWith('  ✗') || l.includes('Assertion failed')).length;

		resolve({
			name,
			code,
			timedOut,
			secs: (Date.now() - start) / 1000,
			pass,
			fail,
			out
		});
	});
});

const results = [];

for (const name of names) {
	process.stdout.write(`Testing visual layout ${name.padEnd(24)} `);
	const r = await runOne(name);
	results.push(r);

	if (r.timedOut) {
		console.log(`⏱️ TIMEOUT (${r.secs.toFixed(1)}s)`);
	} else if (r.code === 0) {
		console.log(`✅ PASS  (${r.secs.toFixed(1)}s) [${r.pass} visual & state assertions]`);
	} else {
		console.log(`❌ FAIL  (${r.secs.toFixed(1)}s) [${r.fail} failure(s)]`);
	}
}

// Summary table
const rows = [['Page Name', 'Category', 'Status', 'Visual Assertions', 'Failures', 'Duration (s)']];
for (const r of results) {
	const isInteractive = PAGE_SPECS[r.name]?.interactive;
	const category = isInteractive ? 'Interactive UI' : 'Static Layout';
	const status = r.timedOut ? 'TIMEOUT' : (r.code === 0 ? 'PASS' : 'FAIL');
	rows.push([r.name, category, status, String(r.pass), String(r.fail), r.secs.toFixed(1)]);
}

const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
console.log('\n' + rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));

const passed = results.filter((r) => r.code === 0).length;
console.log(`\nVisual Suite Result: ${passed}/${results.length} passed.`);
if (passed === results.length) {
	console.log(`✨ All tested pages exhibit consistent visual structure and responsive layout equivalence.\n`);
}
