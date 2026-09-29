// ==========================================================================
// ln-core — Shared Helpers & Runtime Kernel Facade (Barrel File)
// ==========================================================================
// All primitives are modularized into cohesive single-responsibility modules.
// This barrel re-exports the entire public surface with 100% backward
// compatibility. Evaluation order preserves module initialization invariants:
// events.js evaluates first to ensure window.lnCore and console warning
// interception are established before subsequent modules load.
// ==========================================================================

// Events & Debug
export { dispatch, dispatchCancelable, requestData, setDebugSink, setPersistSink, hasActiveDebug, isDevMode } from './events.js';

// DOM & Target Predicates
export { guardBody, isVisible, shouldIgnoreClick, isEditableTarget, isTargetDisabled, isUsableTarget, shouldInterceptLink, readValue } from './dom.js';

// Form Utilities
export { resolveFormMethod, serializeForm, populateForm, interceptValueProperty } from './form.js';

// HTTP & Data Mappers
export { buildUrl, getHeaders, parseHeaders, registerDataMapper, getDataMapper } from './http.js';

// Locale & i18n
export { getLocale, ensureLocaleObserver, registerLocaleFallback, getLocaleFallback } from './locale.js';

// Templates & DOM Fill
export { cloneTemplate, cloneTemplateScoped, fill, lnFill, fillTemplate, renderList, buildDict } from './template.js';

// Lifecycle & Kernel Registration
export { findElements, holdInit, releaseInit, pendingCount, queueBoot, observeAttributes, registerComponent } from './lifecycle.js';

// Value Comparison Primitives (re-exported from compare.js for backward compatibility)
export { compareValues, detectValueType } from './compare.js';
