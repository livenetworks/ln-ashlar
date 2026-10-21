// Dual Engine Test Runner (Ashlar SCSS vs Tailwind v4)
// Sequential runner for tests/headless/dual/*.mjs
// Usage: node tests/headless/dual-run.mjs [name ...]
//        node tests/headless/dual-run.mjs --all

import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'dual');
const TIMEOUT_MS = 60000;

let names = readdirSync(dir)
	.filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
	.map((f) => f.slice(0, -4))
	.sort();

const args = process.argv.slice(2);
if (args.length && !args.includes('--all')) {
	names = names.filter((n) => args.includes(n));
}

console.log(`\n===============================================================`);
console.log(`🚀 DUAL ENGINE HEADLESS SUITE (Ashlar SCSS vs Tailwind v4)`);
console.log(`Running tests for ${names.length} demo pages...`);
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

		// Extract perf numbers if present
		let ashlarPerf = '-';
		let twPerf = '-';
		const ashlarMatch = out.match(/Ashlar SCSS:\s+([\d\.]+)ms/);
		if (ashlarMatch) ashlarPerf = `${ashlarMatch[1]}ms`;
		const twMatch = out.match(/Tailwind v4:\s+([\d\.]+)ms/);
		if (twMatch) twPerf = `${twMatch[1]}ms`;

		resolve({
			name,
			code,
			timedOut,
			secs: (Date.now() - start) / 1000,
			pass,
			fail,
			ashlarPerf,
			twPerf,
			out
		});
	});
});

const results = [];

for (const name of names) {
	process.stdout.write(`Testing ${name.padEnd(24)} `);
	const r = await runOne(name);
	results.push(r);

	if (r.timedOut) {
		console.log(`⏱️ TIMEOUT (${r.secs.toFixed(1)}s)`);
	} else if (r.code === 0) {
		console.log(`✅ PASS  (${r.secs.toFixed(1)}s) [Ashlar: ${r.ashlarPerf}, TW: ${r.twPerf}]`);
	} else {
		console.log(`❌ FAIL  (${r.secs.toFixed(1)}s) [${r.fail} failure(s)]`);
	}
}

// Summary table
const rows = [['Page Name', 'Status', '✓ Assertions', '✗ Fails', 'Ashlar', 'Tailwind', 'Total (s)']];
for (const r of results) {
	const status = r.timedOut ? 'TIMEOUT' : (r.code === 0 ? 'PASS' : 'FAIL');
	rows.push([r.name, status, String(r.pass), String(r.fail), r.ashlarPerf, r.twPerf, r.secs.toFixed(1)]);
}

const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
console.log('\n' + rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));

const passed = results.filter((r) => r.code === 0).length;
console.log(`\nResult: ${passed}/${results.length} passed.`);

if (passed !== results.length) {
	process.exit(1);
}
