// ─── Persist (localStorage) ───────────────────────────────
//
// Key format: ln:{component}:{pathname}:{elementId}
// Example:    ln:filter:/admin/users:status-filter
//
// Each component passes its own name ("filter", "table-sort", "toggle", "tabs"),
// so keys are namespaced per component — no cross-component collision risk.
// Element ID comes from data-ln-persist="key" or el.id.
//
// Note: ln-autosave uses its own separate prefix ("ln-autosave:") and does NOT
// go through this module. No collision between the two systems.

const PREFIX = 'ln:';

let _isStorageAvailable = null;
function _checkStorage() {
	if (_isStorageAvailable !== null) return _isStorageAvailable;
	try {
		if (typeof localStorage === 'undefined') {
			_isStorageAvailable = false;
			return false;
		}
		const testKey = '__ln_test__';
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		_isStorageAvailable = true;
	} catch (e) {
		_isStorageAvailable = false;
	}
	return _isStorageAvailable;
}

function _pageKey() {
	const path = location.pathname.replace(/\/+$/, '').toLowerCase();
	return path || '/';
}

function _resolveKey(component, el) {
	const persist = el.getAttribute('data-ln-persist');
	const id = (persist !== null && persist !== '') ? persist : el.id;
	if (!id) {
		console.warn('[ln-persist] Element requires id or data-ln-persist="key"', el);
		return null;
	}
	return PREFIX + component + ':' + _pageKey() + ':' + id;
}

export function persistGet(component, el) {
	if (!_checkStorage()) return null;
	const key = _resolveKey(component, el);
	if (!key) return null;
	try {
		const raw = localStorage.getItem(key);
		return raw !== null ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
}

export function persistSet(component, el, value) {
	if (!_checkStorage()) return;
	const key = _resolveKey(component, el);
	if (!key) return;
	try {
		if (value === null || value === undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	} catch (e) {
		// localStorage full — silent
	}
}

export function persistRemove(component, el) {
	if (!_checkStorage()) return;
	const key = _resolveKey(component, el);
	if (!key) return;
	try {
		localStorage.removeItem(key);
	} catch (e) {}
}

export function persistClear(component) {
	if (!_checkStorage()) return;
	try {
		const prefix = PREFIX + component + ':';
		const toRemove = [];
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && k.indexOf(prefix) === 0) toRemove.push(k);
		}
		for (let i = 0; i < toRemove.length; i++) {
			localStorage.removeItem(toRemove[i]);
		}
	} catch (e) {}
}
