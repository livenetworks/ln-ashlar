import fs from 'node:fs';
import path from 'node:path';
import { PAGE_SPECS } from '../tests/headless/_page_specs.mjs';

const dualDir = path.resolve('tests/headless/dual');
if (!fs.existsSync(dualDir)) {
	fs.mkdirSync(dualDir, { recursive: true });
}

const names = Object.keys(PAGE_SPECS).sort();
console.log(`Generating individual dual test files for ${names.length} pages in ${dualDir}...`);

for (const name of names) {
	const filePath = path.join(dualDir, `${name}.mjs`);
	const code = `// Dual-engine test for demo/admin/${name}.html (Ashlar SCSS vs Tailwind v4)
// Validates visual layout consistency, functional reactivity, and performance metrics.
import { runDualEngineTest } from '../_dual_harness.mjs';
import { getPageSpec } from '../_page_specs.mjs';

await runDualEngineTest(getPageSpec('${name}'));
`;
	fs.writeFileSync(filePath, code);
}

console.log(`✓ Generated ${names.length} individual test files in tests/headless/dual/`);
