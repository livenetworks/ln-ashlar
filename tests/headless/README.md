# 🧪 Headless Testing & Performance Benchmark Suite

This directory contains the headless Puppeteer automated testing, visual regression, and performance benchmarking infrastructure for `ln-ashlar`, comparing **Ashlar SCSS** and **Tailwind CSS v4** across all 67 demo admin pages.

---

## 🚀 Quick Commands

| Command | Purpose | Output / Artifact |
|---|---|---|
| `npm run test:visual` | Runs visual layout, responsive, and interaction assertions for all 67 pages. | Terminal table + status |
| `npm run test:perf` | Benchmarks execution latency (ms), DOM node churn, and JS heap memory (MB) across 46 interactive JS components. | `tests/headless/perf-history.json` |
| `npm run test:perf:history` | Displays chronological timeline of all recorded benchmark runs. | History summary |
| `npm run test:perf:compare` | Compares the latest two benchmark runs and flags regressions (`>20%`). | Delta diff table |
| `npm run test:dual -- --all` | Runs full dual-engine layout and reactive assertions across all pages. | Terminal summary |

---

## 🏗️ Architecture & Modules

```
tests/headless/
├── _dual_harness.mjs          # Puppeteer browser launcher, engine switcher, and DOM assertion helpers
├── _page_specs.mjs            # Page registry defining selectors, setup hooks, and interaction routines for 67 pages
├── visual-run.mjs             # Visual & Design Suite runner (static vs interactive pages)
├── perf-harness.mjs           # Performance measurement harness (isolated browser contexts, execution timers)
├── perf-run.mjs               # Benchmark suite runner with CLI flags and regression detection
├── perf-history-manager.mjs   # JSON storage, git commit tracking, and run-to-run comparison logic
├── perf-history.json          # Persistent historical record of benchmark runs
└── dual/                      # Individual test definitions for specific components
```

### 1. Visual & Design Suite (`visual-run.mjs`)
Verifies that all 67 demo pages render identically under both Ashlar SCSS and Tailwind v4:
- Horizontal overflow detection (`scrollWidth <= clientWidth`).
- Structural element presence and computed layout styles.
- Reactive state toggling (e.g. accordion expansion, modal opening, tab switching).
- Filters:
  ```sh
  npm run test:visual -- --static        # Run only 21 static layout pages
  npm run test:visual -- --interactive   # Run only 46 interactive JS pages
  npm run test:visual modal accordion    # Run specific pages
  ```

### 2. Performance & Benchmark Suite (`perf-run.mjs`)
Measures real browser execution performance when interacting with JS components:
- **Interaction Latency:** Duration in milliseconds for component state transitions.
- **DOM Node Churn:** Total DOM nodes before and after the interaction.
- **JS Heap Memory:** Memory footprint in megabytes.
- Options:
  ```sh
  npm run test:perf -- --iterations=3    # Average across 3 runs per engine
  npm run test:perf modal forms          # Benchmark specific components
  npm run test:perf -- --no-save         # Run without saving to history
  ```

### 3. Historical Tracking & Regression Guard (`perf-history-manager.mjs`)
- Every full benchmark run is automatically recorded in `tests/headless/perf-history.json`.
- Captures Git commit hash, branch, run ID, and per-component metrics.
- Flags performance degradations greater than **20%** with `⚠️ REGRESSION`.
