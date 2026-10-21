import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\Dalibor Sojic\\.gemini\\antigravity-ide\\brain\\219968ec-984d-46d7-af52-9f1167aedafd\\screenshots';
const BASE_URL = 'http://localhost/ln-ashlar/demo/admin/';

const BROWSER_CANDIDATES = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

if (!existsSync(ARTIFACT_DIR)) {
	mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runVisualTests() {
	const executablePath = BROWSER_CANDIDATES.find(p => existsSync(p));
	if (!executablePath) {
		throw new Error('No compatible browser executable found.');
	}

	console.log(`Starting headless browser: ${executablePath}`);
	const browser = await puppeteer.launch({
		executablePath,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });

	const testCases = [
		{ page: 'index.html', name: 'dashboard' },
		{ page: 'cards.html', name: 'cards' },
		{ page: 'tables.html', name: 'tables' },
		{ page: 'forms.html', name: 'forms' },
		{ page: 'modal.html', name: 'modal' }
	];

	for (const tc of testCases) {
		const url = `${BASE_URL}${tc.page}`;
		console.log(`\nTesting ${tc.page}...`);

		// 1. Ashlar SCSS Mode
		await page.evaluateOnNewDocument(() => {
			localStorage.setItem('ln-demo-engine', 'ashlar');
			localStorage.setItem('ln-demo-mode', 'light');
		});
		await page.goto(url, { waitUntil: 'networkidle0' });
		await new Promise(r => setTimeout(r, 600));

		const ashlarPath = join(ARTIFACT_DIR, `${tc.name}-ashlar.png`);
		await page.screenshot({ path: ashlarPath, fullPage: false });
		console.log(`  ✓ Saved Ashlar SCSS: ${ashlarPath}`);

		// 2. Tailwind v4 Light Mode
		await page.evaluate(() => {
			localStorage.setItem('ln-demo-engine', 'tailwind');
			localStorage.setItem('ln-demo-mode', 'light');
			document.documentElement.setAttribute('data-css-engine', 'tailwind');
			document.documentElement.setAttribute('data-mode', 'light');
			const ashlar = document.getElementById('theme-ashlar');
			const tw = document.getElementById('theme-tailwind');
			if (ashlar) ashlar.disabled = true;
			if (tw) tw.disabled = false;
		});
		await new Promise(r => setTimeout(r, 600));

		const twLightPath = join(ARTIFACT_DIR, `${tc.name}-tailwind-light.png`);
		await page.screenshot({ path: twLightPath, fullPage: false });
		console.log(`  ✓ Saved Tailwind v4 Light: ${twLightPath}`);

		// Special case: if modal page, click trigger to open modal and capture
		if (tc.page === 'modal.html') {
			await page.click('button[data-ln-modal-for="demo-basic"]');
			await new Promise(r => setTimeout(r, 400));
			const modalOpenPath = join(ARTIFACT_DIR, 'modal-open-tailwind.png');
			await page.screenshot({ path: modalOpenPath, fullPage: false });
			console.log(`  ✓ Saved Open Modal in Tailwind v4: ${modalOpenPath}`);
			// Close modal
			await page.click('#demo-basic [data-ln-modal-close]');
			await new Promise(r => setTimeout(r, 300));
		}

		// 3. Tailwind v4 Dark Mode
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-mode', 'dark');
			localStorage.setItem('ln-demo-mode', 'dark');
		});
		await new Promise(r => setTimeout(r, 400));

		const twDarkPath = join(ARTIFACT_DIR, `${tc.name}-tailwind-dark.png`);
		await page.screenshot({ path: twDarkPath, fullPage: false });
		console.log(`  ✓ Saved Tailwind v4 Dark: ${twDarkPath}`);
	}

	await browser.close();
	console.log('\n✓ All visual screenshots captured successfully!');
}

runVisualTests().catch(err => {
	console.error('Visual test failed:', err);
	process.exit(1);
});
