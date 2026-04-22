// One-time extraction script — reads demo/admin/*.html, extracts content section,
// writes demo/admin/src/pages/{name}.html fragments. Run once for Pass 2, then delete.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
const sourceDir = join(__dir, '..');
const outDir = join(__dir, 'pages');

const files = await readdir(sourceDir);
const pages = files.filter(f => f.endsWith('.html')).sort();

let count = 0;

for (const file of pages) {
	const src = await readFile(join(sourceDir, file), 'utf8');

	// Extract PAGE_TITLE from <title>...</title>
	const titleMatch = src.match(/<title>([^<]+)<\/title>/);
	if (!titleMatch) {
		console.error(`[extract] No <title> in ${file}`);
		process.exit(1);
	}
	const title = titleMatch[1].trim();

	// Extract PAGE_H1 — first <h1> inside .header-left
	const h1Match = src.match(/<div class="header-left">[\s\S]*?<h1>([^<]+)<\/h1>/);
	if (!h1Match) {
		console.error(`[extract] No header <h1> in ${file}`);
		process.exit(1);
	}
	const h1 = h1Match[1].trim();

	// Extract content section inner HTML.
	//
	// Strategy: find the two-tab <section> open that comes after </aside>
	// in the app-main, then collect everything until we reach the app-wrapper
	// closing comment. Within that range, find the content section open and
	// trim everything from the footer/wrapper close backwards.
	//
	// Reliable markers present in all pages:
	//   OPEN:  \t\t<section>\n  (the content section, after sidebar)
	//   CLOSE: \t\t</main>\n\t</div><!-- /.app-wrapper -->
	//          OR: \t\t</section>\n\t\t</main>\n\t</div><!-- /.app-wrapper -->
	//
	// We extract the INNER HTML of the content <section>:
	// everything after \t\t<section>\n and before the app-wrapper close.
	// The "before" anchor is: look backwards from </main>\n\t</div><!-- /.app-wrapper -->
	// for the last occurrence of the two-tab level content close.
	//
	// Simplest reliable approach: split on \t\t<section>\n to get the
	// content region, then strip trailing chrome (footer + /main + app-wrapper close).

	// Find the first \t\t<section> that is the content section (not inside sidebar)
	// The sidebar ends with \t\t</aside> and then the scrim. After that comes the content section.
	const afterSidebarMatch = src.match(/\t\t<\/aside>[\s\S]*?\t\t<section>([\s\S]*)/);
	if (!afterSidebarMatch) {
		console.error(`[extract] Cannot find content section start in ${file}`);
		process.exit(1);
	}
	const fromSectionOpen = afterSidebarMatch[1];

	// Now find where to stop. The content ends before the footer + main/wrapper close.
	// The footer pattern (both variants):
	//   \n\t\t\t\t<footer class="footer"> ... </footer>\n\t\t\t</main>
	//   \n\t\t\t<!-- Footer -->\n\t\t\t<footer class="footer"> ... </footer>\n\t\t\t</main>
	//   OR the section closes and then main closes: \n\t\t</section>\n\t\t</main>
	//   OR just: \n\t\t</main> (if section unclosed)
	//
	// Find the last footer/main close before the app-wrapper end comment.
	// Strategy: find where \t\t</main> (closing app-main) appears,
	// and take everything before it (after stripping the inner footer).

	// Find the </main>\n\t</div><!-- /.app-wrapper --> sentinel
	const appWrapperCloseIdx = fromSectionOpen.search(/\n\t\t<\/main>\n\t<\/div><!-- \/.app-wrapper -->/);
	if (appWrapperCloseIdx === -1) {
		console.error(`[extract] Cannot find app-wrapper close in ${file}`);
		process.exit(1);
	}

	let contentRegion = fromSectionOpen.slice(0, appWrapperCloseIdx);

	// Strip trailing footer chrome from contentRegion.
	// The footer can be:
	//   \n\n\t\t\t<!-- Footer -->\n\t\t\t<footer class="footer">...</footer>\n
	//   \n\n\t\t\t\t<footer class="footer">...</footer>\n
	//   \n\t\t</section>\n  (some pages close section before main)
	//
	// Find the footer start: look for <footer class="footer"> and strip from there.
	// Also strip any <!-- Footer --> comment before it.
	// Also strip any trailing \t\t</section> that closes the outer content section.

	// Step 1: strip the <footer class="footer"> block and anything after it
	const footerStart = contentRegion.search(/\n[\t ]*(?:<!-- Footer -->[\s\S]*?)?<footer class="footer">/);
	if (footerStart !== -1) {
		contentRegion = contentRegion.slice(0, footerStart);
	}

	// Step 2: strip trailing \t\t</section> (closing the outer content section)
	contentRegion = contentRegion.replace(/\n\t\t<\/section>\s*$/, '');

	// Trim trailing whitespace
	const content = contentRegion.trimEnd();

	const escapedTitle = title.replace(/"/g, '&quot;');
	const escapedH1 = h1.replace(/"/g, '&quot;');
	const fragment = `<!-- ln-page: title="${escapedTitle}" h1="${escapedH1}" -->\n${content}`;
	await writeFile(join(outDir, file), fragment, 'utf8');
	console.log(`  extracted ${file}`);
	count++;
}

console.log(`Extracted ${count} pages.`);
