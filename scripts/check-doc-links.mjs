#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const ROOTS = ['README.md', 'DOCTRINE.md', 'CLAUDE.md', 'docs', 'docs-mcp', 'components'];
const SKIP_DIRS = new Set(['node_modules', '.git']);
const SKIP_PREFIXES = ['docs-mcp/_templates'];

function collectMarkdownFiles(entry, out) {
	const abs = path.join(ROOT, entry);
	if (!fs.existsSync(abs)) return;
	const stat = fs.statSync(abs);
	if (stat.isFile()) {
		if (abs.endsWith('.md')) out.push(abs);
		return;
	}
	for (const name of fs.readdirSync(abs)) {
		if (SKIP_DIRS.has(name)) continue;
		const rel = path.relative(ROOT, path.join(abs, name)).replace(/\\/g, '/');
		if (SKIP_PREFIXES.some((prefix) => rel === prefix || rel.startsWith(prefix + '/'))) continue;
		collectMarkdownFiles(rel, out);
	}
}

function stripCodePreservingLines(markdown) {
	// Replace fenced code blocks while keeping newlines so line numbers stay accurate
	let text = markdown.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ''));
	// Replace single-line inline code spans with spaces of equal length
	text = text.replace(/`[^`\n]+`/g, (span) => ' '.repeat(span.length));
	return text;
}

const files = [];
for (const rootEntry of ROOTS) {
	collectMarkdownFiles(rootEntry, files);
}

const errors = [];
const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;

for (const file of files) {
	const relFile = path.relative(ROOT, file).replace(/\\/g, '/');
	const raw = fs.readFileSync(file, 'utf8');
	const sanitized = stripCodePreservingLines(raw);
	const lines = sanitized.split(/\r?\n/);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		linkRe.lastIndex = 0;
		let match;
		while ((match = linkRe.exec(line)) !== null) {
			const targetRaw = match[1].trim().split(/\s+/)[0];
			if (/^(https?:|mailto:|#)/i.test(targetRaw)) continue;
			if (/^file:/i.test(targetRaw)) {
				errors.push(`${relFile}:${i + 1} — forbidden file:// link: ${targetRaw}`);
				continue;
			}
			const cleanPath = targetRaw.split('#')[0].split('?')[0];
			if (!cleanPath) continue;
			const resolved = path.resolve(path.dirname(file), cleanPath);
			if (!fs.existsSync(resolved)) {
				errors.push(`${relFile}:${i + 1} — missing target: ${targetRaw}`);
			}
		}
	}
}

if (errors.length) {
	console.error(`check-doc-links: found ${errors.length} broken or forbidden link(s):`);
	for (const err of errors) {
		console.error(`  ✗ ${err}`);
	}
	process.exit(1);
}

console.log(`check-doc-links: OK (${files.length} markdown files verified, 0 broken links)`);
