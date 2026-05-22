// SVG icon loader — fetches icons on demand, builds a hidden sprite.
// Fetched SVGs are cached in localStorage (prefix "lni:") so subsequent
// page loads resolve instantly without network requests.
//
// Two prefixes:
//   #ln-{name}   → Tabler CDN  (https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline)
//   #lnc-{name}  → Custom CDN  (window.LN_ICONS_CUSTOM_CDN)
//
// Config — set on window BEFORE this script loads:
//   window.LN_ICONS_CDN        = 'https://...'   (override Tabler CDN base)
//   window.LN_ICONS_CUSTOM_CDN = 'https://...'   (required for lnc- icons)
//
// Cache: bump CACHE_VERSION to invalidate all cached icons.
//
// Usage:
//   <svg class="ln-icon" aria-hidden="true"><use href="#ln-home"></use></svg>
//   <svg class="ln-icon" aria-hidden="true"><use href="#lnc-file-pdf"></use></svg>

(function () {
	const SPRITE_ID  = 'ln-icons-sprite';
	const PREFIX_LN  = '#ln-';
	const PREFIX_LNC = '#lnc-';

	const loaded  = new Set();
	const pending = new Set();
	let spriteEl = null;

	// Pinned version for cache stability — bump explicitly when upgrading. Override: window.LN_ICONS_CDN
	const BASE_CDN   = (window.LN_ICONS_CDN        || 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline').replace(/\/$/, '');
	const CUSTOM_CDN = (window.LN_ICONS_CUSTOM_CDN || '').replace(/\/$/, '');

	const CACHE_PREFIX  = 'lni:';
	const CACHE_VER_KEY = 'lni:v';
	const CACHE_VERSION = '1';

	function _checkCacheVersion() {
		try {
			if (localStorage.getItem(CACHE_VER_KEY) !== CACHE_VERSION) {
				for (let i = localStorage.length - 1; i >= 0; i--) {
					const key = localStorage.key(i);
					if (key && key.indexOf(CACHE_PREFIX) === 0) localStorage.removeItem(key);
				}
				localStorage.setItem(CACHE_VER_KEY, CACHE_VERSION);
			}
		} catch (e) { /* localStorage unavailable or full — proceed without cache */ }
	}

	_checkCacheVersion();

	function _getSprite() {
		if (!spriteEl) {
			spriteEl = document.getElementById(SPRITE_ID);
			if (!spriteEl) {
				spriteEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				spriteEl.id = SPRITE_ID;
				spriteEl.setAttribute('hidden', '');
				spriteEl.setAttribute('aria-hidden', 'true');
				spriteEl.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'));
				document.body.insertBefore(spriteEl, document.body.firstChild);
			}
		}
		return spriteEl;
	}

	function _url(href) {
		if (href.indexOf(PREFIX_LNC) === 0) return CUSTOM_CDN + '/' + href.slice(PREFIX_LNC.length) + '.svg';
		return BASE_CDN + '/' + href.slice(PREFIX_LN.length) + '.svg';
	}

	function _addSymbol(id, raw) {
		const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
		const viewBox      = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
		const innerMatch   = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
		const inner        = innerMatch ? innerMatch[1].trim() : '';
		const attrsMatch   = raw.match(/<svg([^>]*)>/i);
		const rawAttrs     = attrsMatch ? attrsMatch[1] : '';

		const sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
		sym.id = id;
		sym.setAttribute('viewBox', viewBox);

		['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (attr) {
			const m = rawAttrs.match(new RegExp(attr + '="([^"]*)"'));
			if (m) sym.setAttribute(attr, m[1]);
		});

		// Trust boundary: SVG content fetched from pinned CDN version (see BASE_CDN) or localStorage cache
		sym.innerHTML = inner;
		_getSprite().querySelector('defs').appendChild(sym);
	}

	function _load(href) {
		if (loaded.has(href) || pending.has(href)) return;
		if (href.indexOf(PREFIX_LNC) === 0 && !CUSTOM_CDN) return;

		const id = href.slice(1);

		// Check localStorage first
		try {
			const cached = localStorage.getItem(CACHE_PREFIX + id);
			if (cached) {
				_addSymbol(id, cached);
				loaded.add(href);
				return;
			}
		} catch (e) { /* proceed to fetch */ }

		pending.add(href);

		fetch(_url(href))
			.then(function (r) {
				if (!r.ok) throw new Error(r.status);
				return r.text();
			})
			.then(function (raw) {
				_addSymbol(id, raw);
				loaded.add(href);
				pending.delete(href);
				try { localStorage.setItem(CACHE_PREFIX + id, raw); } catch (e) { /* storage full */ }
			})
			.catch(function () {
				pending.delete(href);
			});
	}

	function _scan(root) {
		const sel  = 'use[href^="' + PREFIX_LN + '"], use[href^="' + PREFIX_LNC + '"]';
		const uses = root.querySelectorAll ? root.querySelectorAll(sel) : [];
		if (root.matches && root.matches(sel)) {
			const h = root.getAttribute('href');
			if (h) _load(h);
		}
		Array.prototype.forEach.call(uses, function (use) {
			const h = use.getAttribute('href');
			if (h) _load(h);
		});
	}

	function _init() {
		_scan(document);
		new MutationObserver(function (mutations) {
			mutations.forEach(function (m) {
				if (m.type === 'childList') {
					m.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) _scan(node);
					});
				} else if (m.type === 'attributes' && m.attributeName === 'href') {
					// A <use href="..."> was swapped at runtime (e.g. ln-confirm
					// replacing an icon). Trigger a load for the new target.
					const h = m.target.getAttribute('href');
					if (h && (h.indexOf(PREFIX_LN) === 0 || h.indexOf(PREFIX_LNC) === 0)) {
						_load(h);
					}
				}
			});
		}).observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['href']
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _init);
	} else {
		_init();
	}
})();
