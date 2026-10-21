// Performance History Storage & Trend Manager
// Persists benchmark results to tests/headless/perf-history.json
// Supports historical comparison, delta calculations, and regression detection.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const HISTORY_FILE = resolve(__dirname, 'perf-history.json');
const MAX_HISTORY_ENTRIES = 50;

function getGitInfo() {
	try {
		const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
		const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
		const message = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim().split('\n')[0];
		return { branch, commit, message };
	} catch {
		return { branch: 'unknown', commit: 'unknown', message: '' };
	}
}

export function loadHistory() {
	if (!existsSync(HISTORY_FILE)) {
		return { version: 1, runs: [] };
	}
	try {
		const content = readFileSync(HISTORY_FILE, 'utf8');
		return JSON.parse(content);
	} catch (err) {
		console.warn(`[PERF HISTORY] Warning: Failed to parse history file, initializing fresh: ${err.message}`);
		return { version: 1, runs: [] };
	}
}

export function getLatestRun() {
	const history = loadHistory();
	if (!history.runs || history.runs.length === 0) return null;
	return history.runs[history.runs.length - 1];
}

export function saveRun(benchmarks, meta = {}) {
	const history = loadHistory();
	const git = getGitInfo();
	const timestamp = new Date().toISOString();
	const id = `run-${timestamp.replace(/[:.]/g, '-')}`;

	// Compute run summary
	const entries = Object.entries(benchmarks);
	let totalAshlarMs = 0;
	let totalTwMs = 0;
	let fasterInTw = 0;
	let fasterInAshlar = 0;

	for (const [_, b] of entries) {
		totalAshlarMs += b.ashlarMs;
		totalTwMs += b.tailwindMs;
		if (b.tailwindMs < b.ashlarMs * 0.95) fasterInTw++;
		else if (b.ashlarMs < b.tailwindMs * 0.95) fasterInAshlar++;
	}

	const count = entries.length;
	const avgAshlarMs = count > 0 ? parseFloat((totalAshlarMs / count).toFixed(2)) : 0;
	const avgTailwindMs = count > 0 ? parseFloat((totalTwMs / count).toFixed(2)) : 0;
	const overallSpeedup = avgAshlarMs > 0
		? parseFloat((((avgAshlarMs - avgTailwindMs) / avgAshlarMs) * 100).toFixed(1))
		: 0;

	const runData = {
		id,
		timestamp,
		git,
		meta: {
			nodeVersion: process.version,
			platform: process.platform,
			iterations: meta.iterations || 1,
			...meta
		},
		summary: {
			totalComponents: count,
			fasterInTailwind: fasterInTw,
			fasterInAshlar: fasterInAshlar,
			avgAshlarMs,
			avgTailwindMs,
			overallSpeedupPercent: overallSpeedup
		},
		benchmarks
	};

	history.runs.push(runData);
	if (history.runs.length > MAX_HISTORY_ENTRIES) {
		history.runs = history.runs.slice(-MAX_HISTORY_ENTRIES);
	}

	writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
	return runData;
}

/**
 * Compare current benchmark result with previous run
 * Returns comparative metrics with regression detection (>20% slower than previous)
 */
export function compareWithPrevious(currentBenchmarks, previousRun = null) {
	const prev = previousRun || getLatestRun();
	const comparison = {};

	for (const [name, curr] of Object.entries(currentBenchmarks)) {
		const prevBench = prev?.benchmarks?.[name];

		let prevTwMs = null;
		let deltaTwMs = null;
		let deltaPercent = null;
		let isRegression = false;

		if (prevBench && prevBench.tailwindMs > 0) {
			prevTwMs = prevBench.tailwindMs;
			deltaTwMs = parseFloat((curr.tailwindMs - prevTwMs).toFixed(2));
			deltaPercent = parseFloat(((deltaTwMs / prevTwMs) * 100).toFixed(1));
			// Regression: if Tailwind became >20% slower than previous run and >15ms delta
			if (deltaPercent > 20 && deltaTwMs > 15) {
				isRegression = true;
			}
		}

		comparison[name] = {
			currentAshlarMs: curr.ashlarMs,
			currentTailwindMs: curr.tailwindMs,
			speedupVsAshlar: curr.speedupPercent,
			fasterEngine: curr.fasterEngine,
			previousTailwindMs: prevTwMs,
			deltaTailwindMs: deltaTwMs,
			deltaPercent,
			isRegression
		};
	}

	return {
		previousRunId: prev ? prev.id : null,
		previousTimestamp: prev ? prev.timestamp : null,
		comparison
	};
}
