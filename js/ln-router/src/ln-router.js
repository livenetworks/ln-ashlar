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
			route: currentRoute
		};
	}
};

const DOM_SELECTOR = 'data-ln-route';
const DOM_ATTRIBUTE = 'lnRoute';

if (typeof window !== 'undefined') {
	window.lnRouter = router;
}

// Registry Map of routes: pattern -> route metadata
const registry = new Map();
// Cache sorted route objects for matching
let sortedRoutes = [];
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
 * Match path to a route in the sorted registry.
 */
function _matchRoute(path) {
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
 * Resolve target DOM element (explicit target or default outlet).
 */
function _resolveTarget(route) {
	if (route.target) {
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

	// 2. Clear out open popovers teleported to <body> that were triggered by descendants of the target
	const popovers = document.querySelectorAll('[data-ln-popover="open"]');
	for (const popover of popovers) {
		const inst = popover.lnPopover;
		if (inst && inst.trigger && target.contains(inst.trigger)) {
			try {
				inst.destroy();
			} catch (e) {
				console.error('[ln-router] Error destroying open teleported popover:', e);
			}
		}
	}
}

/**
 * Execute navigation render pipeline.
 */
function _render(route, params, query, targetPath, opts = {}) {
	const targetEl = _resolveTarget(route);
	if (!targetEl) return;

	// Fire before-navigate (cancelable)
	const from = currentPath;
	const to = targetPath;
	const beforeEvent = dispatchCancelable(targetEl, 'ln-router:before-navigate', {
		from,
		to,
		params,
		query
	});

	if (beforeEvent.defaultPrevented) {
		return;
	}

	// Manage history state
	if (opts.historyAction === 'push') {
		window.history.pushState(null, '', targetPath);
	} else if (opts.historyAction === 'replace') {
		window.history.replaceState(null, '', targetPath);
	}

	const executeSwap = () => {
		// Teardown the outgoing view
		if (!opts.isHydration) {
			_teardownOutlet(targetEl);
		}

		// Perform swap if not hydrating
		if (!opts.isHydration) {
			const clone = route.templateNode.content.cloneNode(true);
			targetEl.replaceChildren(clone);
		}

		// Apply title
		if (route.title) {
			document.title = route.title;
		}

		// Accessibility and UX focus shift
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

			// Scroll to top
			targetEl.scrollIntoView({ block: 'start', behavior: 'instant' });
		}

		// Update current router state
		currentPath = targetPath;
		currentParams = params;
		currentQuery = query;
		currentRoute = route;

		// Dispatch navigated event
		_dispatchMaybeDeferred(targetEl, 'ln-router:navigated', {
			path: targetPath,
			params,
			query,
			route,
			target: targetEl
		});
	};

	// Progressive enhancement: view transitions
	if (document.startViewTransition && !opts.isHydration) {
		document.startViewTransition(executeSwap);
	} else {
		executeSwap();
	}
}

/**
 * Handle navigation trigger.
 */
function _navigate(fullPath, opts = {}) {
	const { path, query } = _normalizePath(fullPath);
	const match = _matchRoute(path);
	if (match) {
		_render(match.route, match.params, query, fullPath, opts);
	} else {
		dispatch(document.body, 'ln-router:not-found', { path });
	}
}

// ─── Click & Popstate Handlers ─────────────────────────────

function _onClick(e) {
	const anchor = e.target.closest('a');
	if (!anchor || !shouldInterceptLink(e, anchor)) return;

	const fullPath = anchor.getAttribute('href');
	const { path, query } = _normalizePath(fullPath);
	const match = _matchRoute(path);

	if (match) {
		e.preventDefault();
		_render(match.route, match.params, query, fullPath, { historyAction: 'push' });
	}
}

function _onPopState() {
	const fullPath = window.location.pathname + window.location.search;
	const { path, query } = _normalizePath(fullPath);
	const match = _matchRoute(path);

	if (match) {
		_render(match.route, match.params, query, fullPath, { historyAction: 'skip' });
	} else {
		dispatch(document.body, 'ln-router:not-found', { path });
	}
}

// ─── Boot & Initial Render ─────────────────────────────────

function _boot() {
	if (booted) return;
	booted = true;

	guardBody(function () {
		document.addEventListener('click', _onClick);
		window.addEventListener('popstate', _onPopState);

		// Trigger initial path resolution
		// _booting = true defers both navigated and not-found dispatches one microtask,
		// so listeners registered in the same DOMContentLoaded burst always receive them.
		_booting = true;
		const fullPath = window.location.pathname + window.location.search;
		const { path, query } = _normalizePath(fullPath);
		const match = _matchRoute(path);

		if (match) {
			const targetEl = _resolveTarget(match.route);
			const isHydration = targetEl && targetEl.hasAttribute('data-ln-router-hydrate') && targetEl.children.length > 0;
			_render(match.route, match.params, query, fullPath, {
				historyAction: 'replace',
				isHydration
			});
		} else {
			_dispatchMaybeDeferred(document.body, 'ln-router:not-found', { path });
		}
		_booting = false;
	}, 'ln-router');
}

// ─── Route Registration ────────────────────────────────────

function _registerRoute(tmpl) {
	const pattern = tmpl.getAttribute(DOM_SELECTOR);
	if (!pattern) return;

	if (registry.has(pattern)) {
		console.warn(`[ln-router] Duplicate route pattern registered: "${pattern}"`);
		return;
	}

	const targetId = tmpl.getAttribute('data-ln-route-target');
	const title = tmpl.getAttribute('data-ln-route-title');
	const segments = pattern.split('/').filter(Boolean);

	const routeMetadata = {
		pattern,
		segments,
		target: targetId,
		title,
		templateNode: tmpl
	};

	// Check container at registration time if possible
	const resolvedTarget = _resolveTarget(routeMetadata);
	if (resolvedTarget && resolvedTarget.contains(tmpl)) {
		console.warn(`[ln-router] Route template with pattern "${pattern}" is declared inside its own outlet element:`, tmpl);
	}

	registry.set(pattern, routeMetadata);

	// Re-sort routes by specificity
	sortedRoutes = Array.from(registry.values()).sort(_compareSpecificity);

	_boot();
}

function _unregisterRoute(tmpl) {
	const pattern = tmpl.getAttribute(DOM_SELECTOR);
	if (pattern && registry.has(pattern)) {
		registry.delete(pattern);
		sortedRoutes = Array.from(registry.values()).sort(_compareSpecificity);
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
	extraAttributes: ['data-ln-route-target', 'data-ln-route-title']
});
