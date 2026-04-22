import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = join(__dir, 'pages');
const shellPath = join(__dir, 'shell.html');
const outDir = join(__dir, '..');

const metaPattern = /^<!--\s*ln-page:\s*title="([^"]+)"\s*h1="([^"]+)"\s*-->/;

function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

try {
	const shell = await readFile(shellPath, 'utf8');

	const entries = await readdir(pagesDir);
	const pages = entries.filter(f => f.endsWith('.html'));

	for (const file of pages) {
		const src = await readFile(join(pagesDir, file), 'utf8');
		const firstLine = src.trimStart().split('\n')[0];
		const match = firstLine.match(metaPattern);

		if (!match) {
			console.error(`[build-pages] Missing or malformed metadata comment in: ${file}`);
			process.exit(1);
		}

		const [, title, h1] = match;
		const body = src.trimStart().replace(metaPattern, '').trim();

		let out = shell
			.replace('{{PAGE_TITLE}}', title)
			.replace('{{PAGE_H1}}', h1)
			.replace('{{PAGE_CONTENT}}', body);

		const filenameEscaped = escapeRegex(file);
		out = out.replace(
			new RegExp(`href="${filenameEscaped}"`, 'g'),
			`href="${file}" aria-current="page"`
		);

		await writeFile(join(outDir, file), out, 'utf8');
		console.log(`  built ${file}`);
	}

	console.log(`Built ${pages.length} pages.`);
} catch (err) {
	console.error('[build-pages]', err.message);
	process.exit(1);
}
