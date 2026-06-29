// ─── Hash codec (URL fragment as namespaced state) ─────────
//
// Grammar:  #nsA:valA&nsB:valB
// Each component owns ONE namespace, ignores all others, and PRESERVES
// foreign segments on write — this is what makes component isolation work.
//
// Three-state value model:
//   absent        → hashGet returns null   (e.g. closed)
//   #ns           → hashGet returns ''      (present, no value — e.g. "new")
//   #ns:val       → hashGet returns 'val'   (present, with param)
//
// Write mechanism: `location.hash =` (fires hashchange; identical value is a
// no-op so there are no loops). Never pushState here.

function _strip(str) {
	return (str || '').replace(/^#/, '');
}

export function hashParse(str) {
	const raw = (str === undefined) ? location.hash : str;
	const map = {};
	const h = _strip(raw);
	if (!h) return map;
	const parts = h.split('&');
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (!part) continue;
		const sep = part.indexOf(':');
		const ns = (sep > -1 ? part.slice(0, sep) : part);
		const val = (sep > -1 ? part.slice(sep + 1) : '');
		if (!ns) continue;
		try { map[ns] = decodeURIComponent(val); }
		catch (e) { map[ns] = val; }
	}
	return map;
}

export function hashGet(ns) {
	if (!ns) return null;
	const map = hashParse();
	return (ns in map) ? map[ns] : null;
}

export function hashSet(ns, value) {
	if (!ns) return;
	const map = hashParse();
	if (value === null || value === undefined) {
		delete map[ns];
	} else {
		map[ns] = String(value);
	}
	const keys = Object.keys(map);
	const next = keys.map(function (k) {
		const v = map[k];
		return (v === '') ? k : (k + ':' + encodeURIComponent(v));
	}).join('&');
	// Setting an identical hash is a no-op (no hashchange) → no loops.
	if (_strip(location.hash) === next) return;
	location.hash = next;
}

// ─── Hash-link click guard (shared by ln-tabs & ln-modal) ──
//
// A "hash link" is an <a href="#…"> whose click a component wants to drive
// through the codec instead of native fragment navigation (native nav replaces
// the WHOLE fragment and wipes foreign segments). Both ln-tabs and ln-modal
// funnel their own anchor clicks through here so the guard + preventDefault
// live in ONE place.
//
// Returns:
//   false → modifier / middle / shift-click: caller must return and let the
//           browser do native open-in-new-tab / new-window. No preventDefault.
//   true  → ordinary click: preventDefault() has been called; caller proceeds
//           with its OWN write (hashSet merge, or a component-specific branch
//           such as ln-tabs' already-current setAttribute).
//
// Deliberately does NOT call hashSet — ln-tabs needs an "already-current value
// → setAttribute active directly (no hash write)" branch, so the write differs
// per component. The shared, reusable surface is the guard + preventDefault.
export function hashLinkClick(e) {
	if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) return false;
	e.preventDefault();
	return true;
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.hashParse = hashParse;
	window.lnCore.hashGet = hashGet;
	window.lnCore.hashSet = hashSet;
	window.lnCore.hashLinkClick = hashLinkClick;
}
