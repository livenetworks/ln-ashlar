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
    var SPRITE_ID  = 'ln-icons-sprite';
    var PREFIX_LN  = '#ln-';
    var PREFIX_LNC = '#lnc-';

    var loaded  = new Set();
    var pending = new Set();
    var spriteEl = null;

    var BASE_CDN   = (window.LN_ICONS_CDN        || 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline').replace(/\/$/, '');
    var CUSTOM_CDN = (window.LN_ICONS_CUSTOM_CDN || '').replace(/\/$/, '');

    var CACHE_PREFIX  = 'lni:';
    var CACHE_VER_KEY = 'lni:v';
    var CACHE_VERSION = '1';

    function _checkCacheVersion() {
        try {
            if (localStorage.getItem(CACHE_VER_KEY) !== CACHE_VERSION) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                    var key = localStorage.key(i);
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
        var viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
        var viewBox      = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
        var innerMatch   = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        var inner        = innerMatch ? innerMatch[1].trim() : '';
        var attrsMatch   = raw.match(/<svg([^>]*)>/i);
        var rawAttrs     = attrsMatch ? attrsMatch[1] : '';

        var sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        sym.id = id;
        sym.setAttribute('viewBox', viewBox);

        ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (attr) {
            var m = rawAttrs.match(new RegExp(attr + '="([^"]*)"'));
            if (m) sym.setAttribute(attr, m[1]);
        });

        sym.innerHTML = inner;
        _getSprite().querySelector('defs').appendChild(sym);
    }

    function _load(href) {
        if (loaded.has(href) || pending.has(href)) return;
        if (href.indexOf(PREFIX_LNC) === 0 && !CUSTOM_CDN) return;

        var id = href.slice(1);

        // Check localStorage first
        try {
            var cached = localStorage.getItem(CACHE_PREFIX + id);
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
        var sel  = 'use[href^="' + PREFIX_LN + '"], use[href^="' + PREFIX_LNC + '"]';
        var uses = root.querySelectorAll ? root.querySelectorAll(sel) : [];
        if (root.matches && root.matches(sel)) {
            var h = root.getAttribute('href');
            if (h) _load(h);
        }
        Array.prototype.forEach.call(uses, function (use) {
            var h = use.getAttribute('href');
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
                    var h = m.target.getAttribute('href');
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
