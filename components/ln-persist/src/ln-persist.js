import { setPersistSink, observeAttributes } from '../../ln-core/index.js';

(function () {
	if (window.lnCore && window.lnCore._persistBound) return;
	window.lnCore = window.lnCore || {};
	window.lnCore._persistBound = true;

	function _pageKey() {
		const path = location.pathname.replace(/\/+$/, '').toLowerCase();
		return path || '/';
	}

	// el-first key: ln:{id}:{attr}, or ln:{id}:{pathname}:{attr} when
	// data-ln-persist-scope="page" is present.
	function _resolveKey(el, attr) {
		const explicit = el.getAttribute('data-ln-persist');
		const id = (explicit !== null && explicit !== '') ? explicit : el.id;
		if (!id) {
			console.warn('[ln-persist] Element requires id or data-ln-persist="key"', el);
			return null;
		}
		const scoped = el.getAttribute('data-ln-persist-scope') === 'page';
		return scoped
			? ('ln:' + id + ':' + _pageKey() + ':' + attr)
			: ('ln:' + id + ':' + attr);
	}

	let _storageOk = null;
	function _checkStorage() {
		if (_storageOk !== null) return _storageOk;
		try {
			if (typeof localStorage === 'undefined') return (_storageOk = false);
			const t = '__ln_persist_test__';
			localStorage.setItem(t, t);
			localStorage.removeItem(t);
			return (_storageOk = true);
		} catch (e) {
			return (_storageOk = false);
		}
	}

	const _wiredAttrs = new Set();

	function _persistSink(el, selector) {
		const registry = window.lnCore && window.lnCore._attrRegistry;
		const entries = (registry && registry.persist) || [];
		let entry = null;
		for (let i = 0; i < entries.length; i++) {
			if (entries[i].selector === selector) { entry = entries[i]; break; }
		}
		if (!entry) return;
		const persist = entry.persist;

		if (!_wiredAttrs.has(persist.attr)) {
			_wiredAttrs.add(persist.attr);
			observeAttributes([persist.attr], function (changedEl, name) {
				if (!changedEl.hasAttribute('data-ln-persist')) return;
				if (persist.hashActive && persist.hashActive(changedEl)) return;
				const key = _resolveKey(changedEl, name);
				if (!key || !_checkStorage()) return;
				const value = changedEl.getAttribute(name);
				try {
					if (value === null) localStorage.removeItem(key);
					else localStorage.setItem(key, value);
				} catch (e) { /* quota / private mode — silent */ }
			});
		}

		if (persist.hashActive && persist.hashActive(el)) return;
		const key = _resolveKey(el, persist.attr);
		if (!key || !_checkStorage()) return;
		const saved = localStorage.getItem(key);
		if (saved !== null) el.setAttribute(persist.attr, saved);
	}

	setPersistSink(_persistSink);
})();
