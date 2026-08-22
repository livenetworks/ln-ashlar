// ==========================================================================
// ln-ashlar — Master Components Entry (Pure JavaScript)
// ==========================================================================
// All autonomous components are registered here.
// Stylesheets are separate and explicit (dist/ln-ashlar.css, dist/ln-ashlar-core.css).
// ==========================================================================

// JS Components
import './ln-http/src/ln-http.js';
// ln-include must be the FIRST registerComponent caller: under `defer` the
// readyState is already 'interactive', so every registerComponent takes the
// synchronous boot branch during module evaluation, and ln-include's sweep has
// to raise the boot gate before any other component sweeps. It sits AFTER
// ln-http because its own fetch must go through the wrapped window.fetch.
import './ln-include/src/ln-include.js';
import './ln-form/src/ln-form.js';
// ln-validate must attach its submit listener before ln-ajax's: a <form>
// can carry both data-ln-validate fields and data-ln-ajax, and
// same-target same-event listeners fire in registration order.
// ln-validate's validation gate has to run first so ln-ajax can see
// e.defaultPrevented. ln-data-coordinator's own write-claim listener is
// unaffected by this ordering — it lives on `document` (bubble phase),
// strictly after every listener registered directly on the form itself.
import './ln-validate/src/ln-validate.js';
import './ln-ajax/src/ln-ajax.js';
import './ln-router/src/ln-router.js';
import './ln-modal/src/ln-modal.js';
import './ln-ui-coordinator/src/ln-ui-coordinator.js';
import './ln-number/src/ln-number.js';
import './ln-date/src/ln-date.js';
import './ln-nav/src/ln-nav.js';
import './ln-tabs/src/ln-tabs.js';
import './ln-toggle/src/ln-toggle.js';
import './ln-accordion/src/ln-accordion.js';
import './ln-dropdown/src/ln-dropdown.js';
import './ln-popover/src/ln-popover.js';
import './ln-tooltip/src/ln-tooltip.js';
import './ln-toast/src/ln-toast.js';
import './ln-upload/src/ln-upload.js';
import './ln-external-links/src/ln-external-links.js';
import './ln-link/src/ln-link.js';
import './ln-progress/src/ln-progress.js';
import './ln-filter/src/ln-filter.js';
import './ln-search/src/ln-search.js';
import './ln-sort/src/ln-sort.js';
import './ln-table/src/ln-table.js';
import './ln-table-coordinator/src/ln-table-coordinator.js';
import './ln-list/src/ln-list.js';
import './ln-circular-progress/src/ln-circular-progress.js';
import './ln-sortable/src/ln-sortable.js';
import './ln-confirm/src/ln-confirm.js';
import './ln-translations/src/ln-translations.js';
import './ln-autosave/src/ln-autosave.js';
import './ln-autoresize/src/ln-autoresize.js';
import './ln-editor/src/ln-editor.js';
import './ln-fill/src/ln-fill.js';
import './ln-slug/src/ln-slug.js';
import './ln-time/src/ln-time.js';
import './ln-data-store/src/ln-data-store.js';
import './ln-api-connector/src/ln-api-connector.js';
import './ln-couchdb-connector/src/ln-couchdb-connector.js';
import './ln-data-coordinator/src/ln-data-coordinator.js';
import './ln-api-queue/src/ln-api-queue.js';
import './ln-chart/src/ln-chart.js';
import './ln-options/src/ln-options.js';
import './ln-stat/src/ln-stat.js';
import './ln-icon/src/ln-icon.js';
import './ln-debug/src/ln-debug.js';
