import { guardBody, observeAttributes, setDebugSink } from '../../ln-core/index.js';
import { consoleSink } from './console-sink.js';

// ─── Console Observation Gate ──────────────────────────────
//
// The single place that decides which data-ln-debug hosts are active and
// scopes the console sink to them. A host is any element carrying
// data-ln-debug; multiple hosts may coexist. No other component ever
// carries a debug conditional.
//
// Scope: host containment. An event or attribute mutation logs only when
// some active host .contains() the target element — this layer observes
// its own subtree, exactly like every other component in the library.
// Exception: a handful of dispatch() calls target window or document
// directly (no element subtree can contain them) — those log only when
// document.body itself is a host.
//
// data-ln-debug is read from document.body's subtree via the shared
// attribute observer (ln-core's observeAttributes), which fires on both
// add and remove — so the host list stays correct when an attribute is
// removed, not just when it's added. <html> is outside that subtree and
// is not a supported host for this layer.

let _hosts = [];

// Scans exactly the subtree ln-core's shared attribute observer covers
// (document.body's subtree, body itself included) — never document-wide.
// A document-wide scan would pick up a stray <html data-ln-debug> on some
// consumer page; that element would become a "host" whose REMOVAL can
// never be observed (the shared observer can't see <html>, it's the
// parent of the observed subtree, not inside it), leaving a permanently
// stale _hosts entry and silently reviving <html> support D3 removed.
//
// No `document.body &&` guard: this function is only ever reached from
// inside the guardBody callback below (direct call, or via
// observeAttributes' mutation handler, which itself can only fire after
// ln-core's own body-scoped observer was installed) — document.body is
// guaranteed to exist on every call path this file has. Guarding for a
// call path that doesn't exist is exactly the defensive coding this
// project forbids.
function _refreshHosts() {
	_hosts = Array.from(document.body.querySelectorAll('[data-ln-debug]'));
	if (document.body.hasAttribute('data-ln-debug')) _hosts.push(document.body);
}

function _isContained(target) {
	for (let i = 0; i < _hosts.length; i++) {
		if (_hosts[i].contains(target)) return true;
	}
	return false;
}

function _scopedSink(kind, name, element, payload) {
	if (element === window || element === document) {
		// Reads the cache, not a live DOM property — consistent with the
		// per-element path below, and correct: _hosts already only ever
		// contains document.body when it carries the attribute (see
		// _refreshHosts above).
		if (_hosts.indexOf(document.body) !== -1) {
			consoleSink(kind, name, element, payload);
		}
		return;
	}
	if (_isContained(element)) {
		consoleSink(kind, name, element, payload);
	}
}

function _syncSink() {
	_refreshHosts();
	setDebugSink(_hosts.length > 0 ? _scopedSink : null);
}

/**
 * Re-derive the active host list. Called by ln-debug's component lifecycle
 * (construction and destruction) so a host inserted or removed as a whole
 * element — a childList mutation, which the attribute observer never sees —
 * is picked up immediately, not just an attribute toggled on an element
 * that was already in the DOM.
 */
export function refreshDebugHosts() {
	_syncSink();
}

export function ensureDebugGate() {
	if (typeof window === 'undefined') return;
	window.lnCore = window.lnCore || {};
	if (window.lnCore._debugGateBound) return;
	window.lnCore._debugGateBound = true;

	// _debugGateBound is set synchronously, above, before guardBody runs —
	// so a second ensureDebugGate() call (another bundle) short-circuits at
	// the guard check above and never reaches guardBody, even if
	// document.body doesn't exist yet. Only one DOMContentLoaded callback is
	// ever scheduled. Mirrors _ensureAttrObserver / ensureLocaleObserver in
	// ln-core/helpers.js, both of which use this exact guard-then-guardBody
	// shape.
	guardBody(function () {
		_syncSink();
		observeAttributes(['data-ln-debug'], _syncSink);
	}, 'ln-debug');
}
