import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

export const BASE_URL = 'http://localhost/ln-ashlar/demo/admin/';

const BROWSER_CANDIDATES = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

export function assert(condition, message) {
	if (!condition) {
		console.error(`  ✗ Assertion failed: ${message}`);
		throw new Error(`Assertion failed: ${message}`);
	}
	console.log(`  ✓ ${message}`);
}

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function launch() {
	const executablePath = BROWSER_CANDIDATES.find(p => existsSync(p));
	if (!executablePath) {
		throw new Error('No compatible browser executable found.');
	}

	console.log(`Starting headless browser via: ${executablePath}`);
	const browser = await puppeteer.launch({
		executablePath,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 900 });

	const pageErrors = [];
	page.on('pageerror', err => {
		pageErrors.push(err.message);
		console.error('  [BROWSER UNCAUGHT ERROR]', err.message);
	});

	return { browser, page, pageErrors };
}

// Runs one headless test: launches the browser, calls fn({ page, baseUrl }),
// always closes the browser, then requires zero uncaught page errors.
// Exits the process with code 1 on any failure.
export async function run(name, fn) {
	console.log(`\n=== ${name} ===`);

	let ctx = null;
	let failure = null;

	try {
		ctx = await launch();
		await fn({ page: ctx.page, baseUrl: BASE_URL });
	} catch (err) {
		failure = err;
	}

	if (ctx) {
		await ctx.browser.close().catch(() => {});
		if (!failure) {
			try {
				console.log(`\nUncaught page errors: ${ctx.pageErrors.length}`);
				assert(ctx.pageErrors.length === 0, 'Zero uncaught page errors');
			} catch (err) {
				failure = err;
			}
		}
	}

	if (failure) {
		console.error(`\nFAILED: ${name}\n`, failure);
		process.exit(1);
	}

	console.log(`\nPASSED: ${name}`);
}
