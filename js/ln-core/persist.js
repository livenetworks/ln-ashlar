// ─── Persist (localStorage) ───────────────────────────────

const PREFIX = 'ln:';

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
	const key = _resolveKey(component, el);
	if (!key) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		// localStorage full or disabled — silent
	}
}

export function persistRemove(component, el) {
	const key = _resolveKey(component, el);
	if (!key) return;
	try {
		localStorage.removeItem(key);
	} catch (e) {}
}

export function persistClear(component) {
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
