// Sequential runner for tests/headless/*.mjs
// Usage: node tests/headless/run-all.mjs [name ...]   (names without extension)
import { spawn } from 'node:child_process';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 150000;

let names = readdirSync(dir)
	.filter((f) => f.endsWith('.mjs') && !f.startsWith('_') && f !== 'run-all.mjs')
	.map((f) => f.slice(0, -4))
	.sort();

const only = process.argv.slice(2);
if (only.length) names = names.filter((n) => only.includes(n));

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
		const failLines = lines.filter((l) => l.startsWith('  ✗') || l.includes('Assertion failed'));
		resolve({
			name,
			code,
			timedOut,
			secs: (Date.now() - start) / 1000,
			pass,
			fail: failLines.length,
			first: failLines[0] ? failLines[0].trim() : '',
			out,
		});
	});
});

const status = (r) => {
	if (r.timedOut) return 'TIMEOUT';
	if (r.code === 0) return 'PASS';
	return r.fail === 0 ? 'FAIL (no message)' : 'FAIL';
};

const outDir = join(tmpdir(), 'ln-headless-' + Date.now());
mkdirSync(outDir, { recursive: true });

const results = [];
for (const name of names) {
	let r = await runOne(name);
	let note = '';
	writeFileSync(join(outDir, name + '.txt'), r.out);
	if (status(r) === 'FAIL (no message)') {
		const first = status(r);
		const r2 = await runOne(name);
		writeFileSync(join(outDir, name + '.retry.txt'), r2.out);
		note = ' [1st: ' + first + ', retry: ' + status(r2) + ']';
		r = r2;
	}
	r.label = status(r) + note;
	results.push(r);
	console.log(name.padEnd(22) + r.label + '  (' + r.secs.toFixed(1) + 's)');
}

const rows = [['name', 'result', '✓', '✗', 'sec', 'first failure']];
for (const r of results) {
	rows.push([r.name, r.label, String(r.pass), String(r.fail), r.secs.toFixed(1), r.first]);
}
const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
console.log('\n' + rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));

const passed = results.filter((r) => r.label.startsWith('PASS')).length;
console.log('\n' + passed + '/' + results.length + ' passed, '
	+ results.reduce((s, r) => s + r.pass, 0) + ' ✓, '
	+ results.reduce((s, r) => s + r.fail, 0) + ' ✗');
console.log('Output: ' + outDir);

process.exit(results.every((r) => r.label === 'PASS' || r.label.endsWith('retry: PASS]')) ? 0 : 1);
