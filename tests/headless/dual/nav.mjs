// Dual-engine test for demo/admin/nav.html (Ashlar SCSS vs Tailwind v4)
// Validates visual layout consistency, functional reactivity, and performance metrics.
import { runDualEngineTest } from '../_dual_harness.mjs';
import { getPageSpec } from '../_page_specs.mjs';

await runDualEngineTest(getPageSpec('nav'));
