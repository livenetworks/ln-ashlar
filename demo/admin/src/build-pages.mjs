import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = join(__dir, 'pages');
const shellPath = join(__dir, 'shell.html');
const outDir = join(__dir, '..');


function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

try {
	const shell = await readFile(shellPath, 'utf8');

	// Copy mock scripts to dist directory
	const mockScripts = ['mock-related.js', 'mock-store-usecase.js', 'mock-http.js', 'mock-couchdb-connector.js', 'mock-api-queue.js', 'mock-write-workflow.js'];
	for (const script of mockScripts) {
		try {
			const mockSrc = await readFile(join(__dir, script), 'utf8');
			await writeFile(join(__dir, '..', 'dist', script), mockSrc, 'utf8');
			console.log(`  copied ${script} to dist/`);
		} catch (err) {
			console.warn(`[build-pages] Could not copy ${script}:`, err.message);
		}
	}

	const entries = await readdir(pagesDir);
	const pages = entries.filter(f => f.endsWith('.html'));

	const metaPattern = /^<!--\s*ln-page:\s*title="([^"]+)"\s*h1="([^"]+)"\s*-->/;

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

	// Generate demo sitemap.xml
	const sitemapEntries = [
		'\t<!-- Main Demos -->',
		'\t<url>\n\t\t<loc>index.html</loc>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>1.0</priority>\n\t</url>',
		'\t<url>\n\t\t<loc>admin/index.html</loc>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>0.9</priority>\n\t</url>',
		'\t<url>\n\t\t<loc>spa/index.html</loc>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>0.8</priority>\n\t</url>',
		'\t<url>\n\t\t<loc>docuflow/index.html</loc>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>0.7</priority>\n\t</url>',
		'\t<url>\n\t\t<loc>scoped-theme.html</loc>\n\t\t<changefreq>weekly</changefreq>\n\t\t<priority>0.7</priority>\n\t</url>',
		'',
		'\t<!-- Admin Demo Pages -->'
	];

	for (const file of pages.sort()) {
		if (file === 'index.html') continue;
		sitemapEntries.push(`\t<url>\n\t\t<loc>admin/${file}</loc>\n\t\t<changefreq>monthly</changefreq>\n\t\t<priority>0.6</priority>\n\t</url>`);
	}

	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
	await writeFile(join(__dir, '..', '..', 'sitemap.xml'), sitemapXml, 'utf8');
	console.log('  updated sitemap.xml');
} catch (err) {
	console.error('[build-pages]', err.message);
	process.exit(1);
}
