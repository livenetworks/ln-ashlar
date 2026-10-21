// Dual-engine test for demo/admin/page-header.html (Ashlar SCSS vs Tailwind v4)
// Validates visual layout consistency, functional reactivity, and performance metrics.
import { runDualEngineTest } from '../_dual_harness.mjs';
import { getPageSpec } from '../_page_specs.mjs';

await runDualEngineTest(getPageSpec('page-header'));
