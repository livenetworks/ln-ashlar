// ─── Environment & Debug Gates ─────────────────────────────

export function hasActiveDebug() {
	if (typeof window === 'undefined') return false;
	if (window.lnDebug === true) return true;
	if (window.lnCore && window.lnCore._debugSink) return true;
	if (typeof document !== 'undefined' && document.body) {
		return document.body.hasAttribute('data-ln-debug') || document.body.querySelector('[data-ln-debug]') !== null;
	}
	return false;
}

export function isDevMode(el) {
	if (typeof window === 'undefined') return false;
	if (window.lnDebug === true) return true;

	// Authoritative gate check when ln-debug is active
	if (window.lnCore && window.lnCore._debugIsContained) {
		if (el) return window.lnCore._debugIsContained(el);
		return window.lnCore._debugSink !== null;
	}

	// Direct DOM containment fallback (e.g. standalone tests or before gate boots)
	if (el && el.closest) {
		const host = el.closest('[data-ln-debug]');
		if (!host || (typeof document !== 'undefined' && host === document.documentElement)) {
			return false;
		}
		return true;
	}
	if (typeof document !== 'undefined' && document.body) {
		return document.body.hasAttribute('data-ln-debug');
	}
	return false;
}

// ─── Global Console Warning Interceptor (Production Mode) ──
if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	if (!window.lnCore._warnBound) {
		window.lnCore._warnBound = true;
		const originalWarn = console.warn;
		console.warn = function (...args) {
			const isLibraryWarning = typeof args[0] === 'string' &&
				(args[0].startsWith('[ln-') || args[0].startsWith('[lnCore'));

			if (isLibraryWarning) {
				let el = null;
				for (let i = 1; i < args.length; i++) {
					if (args[i] && args[i].nodeType === 1) {
						el = args[i];
						break;
					}
				}
				if (!isDevMode(el)) {
					return;
				}
			}
			originalWarn.apply(console, args);
		};
	}
}

// ─── Event Dispatch & Sinks ────────────────────────────────

// Nullable console-observation sink. Installed/removed only by ln-debug's
// gate (components/ln-debug/src/gate.js). window.lnCore is guaranteed already
// initialized by the module-load-time block above (_warnBound),
// so the hot-path read needs no defensive "window.lnCore &&" guard.
export function setDebugSink(sink, isContained) {
	window.lnCore = window.lnCore || {};
	window.lnCore._debugSink = sink;
	window.lnCore._debugIsContained = isContained || null;
}

// Nullable persist restore/save sink. Installed/removed only by ln-persist
// (components/ln-persist/src/ln-persist.js) — mirrors setDebugSink exactly.
export function setPersistSink(sink) {
	window.lnCore = window.lnCore || {};
	window.lnCore._persistSink = sink;
}

export function dispatch(element, eventName, detail) {
	const payload = detail || {};
	if (window.lnCore._debugSink) window.lnCore._debugSink('event', eventName, element, payload);
	element.dispatchEvent(new CustomEvent(eventName, {
		bubbles: true,
		detail: payload
	}));
}

export function dispatchCancelable(element, eventName, detail) {
	const payload = detail || {};
	if (window.lnCore._debugSink) window.lnCore._debugSink('event', eventName, element, payload);
	const event = new CustomEvent(eventName, {
		bubbles: true,
		cancelable: true,
		detail: payload
	});
	element.dispatchEvent(event);
	return event;
}

/**
 * Re-filter / re-sort / re-render a data-driven list-like component, then
 * notify the coordinator that fresh data is requested.
 */
export function requestData(component, eventName, keyName) {
	component._applyFilterAndSort();
	component._vStart = -1;
	component._vEnd = -1;
	component._render();
	component._updateFooter();

	const detail = {
		sort: component.currentSort,
		filters: component.currentFilters,
		search: component.currentSearch
	};
	detail[keyName] = component.name;
	dispatch(component.dom, eventName, detail);
}
