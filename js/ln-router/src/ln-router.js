import {
	registerComponent, dispatch, dispatchCancelable, guardBody, findElements, shouldInterceptLink
} from '../../ln-core';

// Singleton router implementation
export const router = {
	navigate: function (fullPath) {
		_navigate(fullPath, { historyAction: 'push' });
	},
	replace: function (fullPath) {
		_navigate(fullPath, { historyAction: 'replace' });
	},
	current: function () {
		if (!currentRoute) return null;
		return {
			path: currentPath,
			params: currentParams,
			query: currentQuery,
			route: currentRoute,
			regions: currentRegions
		};
	}
};

const DOM_SELECTOR = 'data-ln-route';
const DOM_ATTRIBUTE = 'lnRoute';

if (typeof window !== 'undefined') {
	window.lnRouter = router;
}

// Per-region registry: Map<regionKey, { routes: Map<pattern, routeMetadata>, sorted: routeMetadata[] }>
// regionKey = data-ln-route-target id, or '__primary__' for the default outlet
const regionRegistry = new Map();

// Tracks which template is currently mounted in each keep-region target element
const mountedTemplates = new WeakMap();

// Per-region state snapshot (updated after each navigation)
let currentRegions = new Map();

let booted = false;
let currentPath = null;
let currentParams = {};
let currentQuery = {};
let currentRoute = null;
let _booting = false;

/**
 * Dispatch an event immediately, or defer one microtask when called from the boot path.
 * Boot-path dispatches are deferred so listeners registered in the same DOMContentLoaded
 * burst (i.e. after the <script> that loaded this bundle) always receive the event.
 * All subsequent (click/popstate/programmatic) navigations dispatch synchronously.
 */
function _dispatchMaybeDeferred(target, name, detail) {
	if (_booting) {
		queueMicrotask(function () { dispatch(target, name, detail); });
	} else {
		dispatch(target, name, detail);
	}
}

/**
 * Normalize path: collapse trailing slash, strip query/hash, parse query.
 */
function _normalizePath(fullPath) {
	// Absolute same-origin URLs (route() helpers, anchor.href) → reduce to
	// path+query+hash. new URL() handles both absolute (http://host/a/b) and
	// already-relative (/a/b) inputs identically. Leave fullPath unchanged if
	// it is not a parseable URL.
	try {
		const u = new URL(fullPath, window.location.origin);
		fullPath = u.pathname + u.search + u.hash;
	} catch (e) { /* not a parseable URL — use fullPath as-is */ }

	let [pathAndQuery] = fullPath.split('#');
	let [path, queryString] = pathAndQuery.split('?');

	const query = {};
	if (queryString) {
		const searchParams = new URLSearchParams(queryString);
		for (const [key, value] of searchParams.entries()) {
			query[key] = value;
		}
	}

	path = path.replace(/\/+$/, '');
	if (path === '') {
		path = '/';
	}

	return { path, query };
}

/**
 * Compare specificity of two route metadata objects.
 * Returns negative if a is more specific, positive if b is (descending order).
 */
function _compareSpecificity(a, b) {
	if (a.pattern === '*') return 1;
	if (b.pattern === '*') return -1;

	const aSegs = a.segments;
	const bSegs = b.segments;
	const len = Math.max(aSegs.length, bSegs.length);

	for (let i = 0; i < len; i++) {
		const aSeg = aSegs[i];
		const bSeg = bSegs[i];

		if (aSeg === undefined) return 1;
		if (bSeg === undefined) return -1;

		if (aSeg === '*') return 1;
		if (bSeg === '*') return -1;

		const aIsParam = aSeg.startsWith(':');
		const bIsParam = bSeg.startsWith(':');

		if (aIsParam && !bIsParam) return 1;
		if (!aIsParam && bIsParam) return -1;
	}

	return 0;
}

/**
 * Match path to a route in the provided sorted routes array.
 * Per-region: accepts the region's own sorted array rather than a module-level variable.
 */
function _matchRouteInRegion(path, sortedRoutes) {
	const pathSegs = path.split('/').filter(Boolean);

	for (const route of sortedRoutes) {
		if (route.pattern === '*') {
			return {
				route,
				params: { wildcard: path }
			};
		}

		const routeSegs = route.segments;
		const params = {};
		let matched = true;

		if (pathSegs.length > routeSegs.length && routeSegs[routeSegs.length - 1] !== '*') {
			continue;
		}

		for (let i = 0; i < routeSegs.length; i++) {
			const rSeg = routeSegs[i];
			const pSeg = pathSegs[i];

			if (rSeg === '*') {
				params.wildcard = pathSegs.slice(i).join('/');
				break;
			}

			if (pSeg === undefined) {
				matched = false;
				break;
			}

			if (rSeg.startsWith(':')) {
				params[rSeg.slice(1)] = decodeURIComponent(pSeg);
			} else if (rSeg !== pSeg) {
				matched = false;
				break;
			}
		}

		if (matched) {
			const hasWildcard = routeSegs.indexOf('*') !== -1;
			if (hasWildcard || pathSegs.length <= routeSegs.length) {
				return { route, params };
			}
		}
	}
	return null;
}

/**
 * Resolve target DOM element for a region.
 * Primary region (__primary__) uses the default outlet fallback chain.
 * Auxiliary regions resolve by element id (route.target).
 */
function _resolveRegionTarget(regionKey, route) {
	if (regionKey !== '__primary__') {
		const el = document.getElementById(route.target);
		if (!el) {
			console.warn(`[ln-router] Explicit target element #${route.target} not found in DOM`);
		}
		return el;
	}
	const defaultOutlet = document.querySelector('[data-ln-outlet]') || document.querySelector('main');
	if (!defaultOutlet) {
		console.warn('[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM');
	}
	return defaultOutlet;
}

/**
 * Perform teardown on all active components in the outgoing outlet tree.
 */
function _teardownOutlet(target) {
	if (!target) return;

	// 1. Traverse and destroy elements in the target subtree
	const descendants = Array.from(target.querySelectorAll('*'));
	const allElements = [target].concat(descendants);

	for (const el of allElements) {
		for (const key of Object.keys(el)) {
			if (key.startsWith('ln') && el[key] && typeof el[key].destroy === 'function') {
				try {
					el[key].destroy();
				} catch (e) {
					console.error(`[ln-router] Error destroying component ${key} on element:`, el, e);
				}
			}
		}
	}

	// 2. Close open popovers whose trigger lived inside the torn-down target. Popovers authored
	//    inside the outlet are already caught by the generic ln* destroy loop above (step 1) once
	//    they are real descendants again (no more DOM move on open); this second pass only matters for
	//    popovers authored outside the outlet (e.g. shell-level) but opened by a trigger inside it.
	const popovers = document.querySelectorAll('[data-ln-popover="open"]');
	for (const popover of popovers) {
		const inst = popover.lnPopover;
		if (inst && inst.trigger && target.contains(inst.trigger)) {
			try {
				inst.destroy();
			} catch (e) {
				console.error('[ln-router] Error destroying open popover:', e);
			}
		}
	}
}

/**
 * Multi-region navigation pipeline.
 * Matches path against every region's route table, computes which regions swap,
 * fires one cancelable before-navigate on the primary outlet, then atomically
 * swaps all regions that need it inside a single view transition.
 */
function _navigate(fullPath, opts = {}) {
	const { path, query } = _normalizePath(fullPath);

	// 1. Per-region match
	const regionMatches = new Map();
	for (const [regionKey, regionData] of regionRegistry) {
		regionMatches.set(regionKey, _matchRouteInRegion(path, regionData.sorted));
	}

	const hasPrimaryRegion = regionRegistry.has('__primary__');
	const primaryMatch = regionMatches.get('__primary__'); // undefined if no primary region

	// 2. Not-found — ONLY when a primary region exists but did not match.
	//    Auxiliary-only pages (no '__primary__' region) skip not-found and
	//    proceed to paint their auxiliary regions. Use _dispatchMaybeDeferred
	//    so the boot path defers exactly like the legacy code did.
	if (hasPrimaryRegion && !primaryMatch) {
		_dispatchMaybeDeferred(document.body, 'ln-router:not-found', { path });
		return;
	}

	// 3 + 4. Resolve primary outlet and fire the single cancelable
	//        before-navigate — both conditional on a primary MATCH.
	let primaryTarget = null;
	if (primaryMatch) {
		primaryTarget = _resolveRegionTarget('__primary__', primaryMatch.route);
		if (!primaryTarget) return; // warn already emitted in _resolveRegionTarget

		const beforeEvent = dispatchCancelable(primaryTarget, 'ln-router:before-navigate', {
			from: currentPath,
			to: fullPath,
			params: primaryMatch.params,
			query
		});
		if (beforeEvent.defaultPrevented) return; // aborts ALL regions + history
	}

	// 5. Compute swap plans — which regions will actually change DOM
	const swapPlans = [];
	for (const [regionKey, match] of regionMatches) {
		if (!match) continue;
		const targetEl = _resolveRegionTarget(regionKey, match.route);
		if (!targetEl) continue;

		// Keep-skip applies to AUXILIARY regions only — primary is always active.
		if (regionKey !== '__primary__' && targetEl.hasAttribute('data-ln-route-keep')) {
			const currentTmpl = mountedTemplates.get(targetEl);
			if (currentTmpl === match.route.templateNode) {
				// Same template — skip (keep-region state survival)
				continue;
			}
		}
		swapPlans.push({ regionKey, match, targetEl });
	}

	// 6. History update (once per navigation)
	if (opts.historyAction === 'push') {
		window.history.pushState(null, '', fullPath);
	} else if (opts.historyAction === 'replace') {
		window.history.replaceState(null, '', fullPath);
	}

	// 7. Atomic swap — one view transition wraps all region swaps
	const executeSwaps = function () {
		for (const { regionKey, match, targetEl } of swapPlans) {
			// Per-region hydration check
			const isRegionHydration = opts.isHydration
				&& targetEl.hasAttribute('data-ln-router-hydrate')
				&& targetEl.children.length > 0;

			if (!isRegionHydration) {
				_teardownOutlet(targetEl);
				const clone = match.route.templateNode.content.cloneNode(true);
				targetEl.replaceChildren(clone);
			}

			// Track mounted template for keep-region logic — recorded even on
			// hydration so the keep diff has a baseline after boot.
			mountedTemplates.set(targetEl, match.route.templateNode);

			// Focus, scroll, and title — primary region only
			if (regionKey === '__primary__') {
				if (match.route.title) {
					document.title = match.route.title;
				}
				if (!opts.isHydration) {
					if (!targetEl.hasAttribute('tabindex')) {
						targetEl.setAttribute('tabindex', '-1');
					}
					const firstHeading = targetEl.querySelector('h1, h2, h3, h4, h5, h6');
					if (firstHeading) {
						firstHeading.setAttribute('tabindex', '-1');
						firstHeading.focus();
					} else {
						targetEl.focus();
					}
					targetEl.scrollIntoView({ block: 'start', behavior: 'instant' });
				}
			}

			// Dispatch navigated per swapped region
			_dispatchMaybeDeferred(targetEl, 'ln-router:navigated', {
				path: fullPath,
				params: match.params,
				query,
				route: match.route,
				target: targetEl,
				region: regionKey
			});
		}

		// Update global primary state — only when a primary match exists.
		// On auxiliary-only pages currentRoute stays null (current() returns null).
		if (primaryMatch) {
			currentPath = fullPath;
			currentParams = primaryMatch.params;
			currentQuery = query;
			currentRoute = primaryMatch.route;
		}
		// currentRegions reflects every region's match (null when unmatched).
		// Built from regionMatches — never from the loop variable `match`.
		currentRegions = new Map(
			Array.from(regionMatches.entries()).map(([k, m]) => [k, m ? { route: m.route, params: m.params } : null])
		);
	};

	if (document.startViewTransition && !opts.isHydration) {
		document.startViewTransition(executeSwaps);
	} else {
		executeSwaps();
	}
}

// ─── Click & Popstate Handlers ─────────────────────────────

function _onClick(e) {
	const anchor = e.target.closest('a');
	if (!anchor || !shouldInterceptLink(e, anchor)) return;

	const fullPath = anchor.getAttribute('href');
	const { path } = _normalizePath(fullPath);

	// Intercept only if primary region has a match (auxiliary-only matches don't drive SPA nav)
	const primaryData = regionRegistry.get('__primary__');
	if (!primaryData) return;
	const match = _matchRouteInRegion(path, primaryData.sorted);
	if (match) {
		e.preventDefault();
		_navigate(fullPath, { historyAction: 'push' });
	}
}

function _queryEqual(a, b) {
	const ak = Object.keys(a);
	const bk = Object.keys(b);
	if (ak.length !== bk.length) return false;
	for (let i = 0; i < ak.length; i++) {
		const k = ak[i];
		if (a[k] !== b[k]) return false;
	}
	return true;
}

function _onPopState() {
	const fullPath = window.location.pathname + window.location.search;
	// Fragment-only popstate guard: when Back/Forward changes ONLY the hash
	// (path + query identical to the current SPA state), skip navigation so the
	// primary outlet is not torn down and re-cloned. Hash-bound components
	// (e.g. ln-modal) react to the accompanying hashchange independently.
	//
	// cur.query is the authoritative already-parsed query for the active route
	// (currentQuery), so compare target.query against it directly. cur.path is
	// the raw fullPath (retains the query string), so normalize it for the
	// pathname comparison only — do NOT re-parse it for the query.
	const cur = router.current();
	if (cur && cur.path != null) {
		const target = _normalizePath(fullPath);
		const currentPathNorm = _normalizePath(cur.path).path;
		if (currentPathNorm === target.path && _queryEqual(cur.query, target.query)) {
			return;
		}
	}
	_navigate(fullPath, { historyAction: 'skip' });
}

// ─── Boot & Initial Render ─────────────────────────────────

function _boot() {
	if (booted) return;
	booted = true;

	guardBody(function () {
		document.addEventListener('click', _onClick);
		window.addEventListener('popstate', _onPopState);

		// _booting = true defers navigated/not-found one microtask so listeners
		// registered in the same DOMContentLoaded burst still receive boot events.
		_booting = true;
		// Include the fragment so deep-link hash state survives boot. _navigate's
		// own replaceState would otherwise rewrite the URL without it, silently
		// dropping the fragment on every initial load. Hash-addressable
		// components (e.g. ln-modal #id:param deep links) depend on the fragment
		// being intact at boot to open in edit mode and fill from the matching
		// source. _normalizePath strips the fragment before route matching and
		// query parse, so this changes ONLY the preserved replaceState URL.
		const fullPath = window.location.pathname + window.location.search + window.location.hash;
		_navigate(fullPath, { historyAction: 'replace', isHydration: true });
		_booting = false;
	}, 'ln-router');
}

// ─── Route Registration ────────────────────────────────────

function _registerRoute(tmpl) {
	const pattern = tmpl.getAttribute(DOM_SELECTOR);
	if (!pattern) return;

	const targetId = tmpl.getAttribute('data-ln-route-target') || null;

	// Reserved-word guard: '__primary__' is the internal sentinel for the
	// default outlet. A template targeting an element with this id would
	// collide and silently render into the default outlet. Reject + warn.
	if (targetId === '__primary__') {
		console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${pattern}" rejected.`);
		return;
	}

	const regionKey = targetId || '__primary__';

	if (!regionRegistry.has(regionKey)) {
		regionRegistry.set(regionKey, { routes: new Map(), sorted: [] });
	}
	const region = regionRegistry.get(regionKey);

	// Duplicate guard is now per (pattern, regionKey) pair
	if (region.routes.has(pattern)) {
		console.warn(`[ln-router] Duplicate route pattern registered: "${pattern}" in region "${regionKey}"`);
		return;
	}

	const title = tmpl.getAttribute('data-ln-route-title');
	const segments = pattern.split('/').filter(Boolean);

	const routeMetadata = {
		pattern,
		segments,
		target: targetId,
		title,
		templateNode: tmpl
	};

	// Warn if template is declared inside its own outlet
	const resolvedTarget = _resolveRegionTarget(regionKey, routeMetadata);
	if (resolvedTarget && resolvedTarget.contains(tmpl)) {
		console.warn(`[ln-router] Route template with pattern "${pattern}" is declared inside its own outlet element:`, tmpl);
	}

	region.routes.set(pattern, routeMetadata);
	region.sorted = Array.from(region.routes.values()).sort(_compareSpecificity);
}

function _unregisterRoute(tmpl) {
	const pattern = tmpl.getAttribute(DOM_SELECTOR);
	if (!pattern) return;
	const targetId = tmpl.getAttribute('data-ln-route-target') || null;
	const regionKey = targetId || '__primary__';
	const region = regionRegistry.get(regionKey);
	if (!region) return;
	region.routes.delete(pattern);
	region.sorted = Array.from(region.routes.values()).sort(_compareSpecificity);
	if (region.routes.size === 0) {
		regionRegistry.delete(regionKey);
	}
}

// ─── Component Factory ─────────────────────────────────────

function _component(dom) {
	this.dom = dom;
	_registerRoute(dom);
	return this;
}

_component.prototype.destroy = function () {
	_unregisterRoute(this.dom);
	delete this.dom[DOM_ATTRIBUTE];
};

// registerComponent feeds registerRoute via onInit
registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-router', {
	extraAttributes: ['data-ln-route-target', 'data-ln-route-title'],
	onInit: function () { if (regionRegistry.size > 0) _boot(); }
});
