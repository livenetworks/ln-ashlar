import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const REPO_ROOT = resolve();

const distDir = join(REPO_ROOT, 'dist');
const demoDistDir = join(REPO_ROOT, 'demo/dist');
const adminDistDir = join(REPO_ROOT, 'demo/admin/dist');

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
if (!existsSync(demoDistDir)) mkdirSync(demoDistDir, { recursive: true });
if (!existsSync(adminDistDir)) mkdirSync(adminDistDir, { recursive: true });

console.log('[tailwind] Compiling Tailwind v4 theme bundle...');
const twBin = process.platform === 'win32'
	? join(REPO_ROOT, 'node_modules/.bin/tailwindcss.cmd')
	: join(REPO_ROOT, 'node_modules/.bin/tailwindcss');

execSync(`"${twBin}" -i theme/tailwind/entry.css -o dist/ln-ashlar-tailwind.css --minify`, {
	stdio: 'inherit',
	cwd: REPO_ROOT
});

const builtFile = join(distDir, 'ln-ashlar-tailwind.css');
if (existsSync(builtFile)) {
	copyFileSync(builtFile, join(demoDistDir, 'ln-ashlar-tailwind.css'));
	copyFileSync(builtFile, join(adminDistDir, 'admin-tailwind.css'));
	const bytes = statSync(builtFile).size;
	console.log(`✓ Tailwind v4 bundle built & mirrored (${(bytes / 1024).toFixed(1)} KB)`);
} else {
	console.error('❌ Failed to find dist/ln-ashlar-tailwind.css after build.');
	process.exit(1);
}
