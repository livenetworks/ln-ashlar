(function () {
	const DOM_SELECTOR = 'data-ln-nav';
	const DOM_ATTRIBUTE = 'lnNav';

	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	// WeakMap to store nav instances
	const navInstances = new WeakMap();

	// ─── pushState singleton patch ──────────────────────────────
	// Patched once globally — prevents multiply-nested overrides when
	// multiple [data-ln-nav] elements exist on the same page.

	var _pushStateCallbacks = [];

	if (!history._lnNavPatched) {
		var _origPushState = history.pushState;
		history.pushState = function () {
			_origPushState.apply(history, arguments);
			_pushStateCallbacks.forEach(function (cb) { cb(); });
		};
		history._lnNavPatched = true;
	}

	// ─── Constructor ───────────────────────────────────────────

	function constructor(navElement) {
		if (!navElement.hasAttribute(DOM_SELECTOR)) return;
		if (navInstances.has(navElement)) return;

		const activeClass = navElement.getAttribute(DOM_SELECTOR);
		if (!activeClass) return;

		const instance = _initializeNav(navElement, activeClass);
		navInstances.set(navElement, instance);
	}

	function _initializeNav(navElement, activeClass) {
		let links = Array.from(navElement.querySelectorAll('a'));

		_updateActiveState(links, activeClass, window.location.pathname);

		// Shared handler for both popstate and pushState
		var updateHandler = function () {
			links = Array.from(navElement.querySelectorAll('a'));
			_updateActiveState(links, activeClass, window.location.pathname);
		};

		window.addEventListener('popstate', updateHandler);
		_pushStateCallbacks.push(updateHandler);

		// Watch for DOM changes within this nav (new/removed links)
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							if (node.tagName === 'A') {
								links.push(node);
								_updateActiveState([node], activeClass, window.location.pathname);
							} else if (node.querySelectorAll) {
								const newLinks = Array.from(node.querySelectorAll('a'));
								links = links.concat(newLinks);
								_updateActiveState(newLinks, activeClass, window.location.pathname);
							}
						}
					});

					mutation.removedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							if (node.tagName === 'A') {
								links = links.filter(function (link) { return link !== node; });
							} else if (node.querySelectorAll) {
								const removedLinks = Array.from(node.querySelectorAll('a'));
								links = links.filter(function (link) {
									return !removedLinks.includes(link);
								});
							}
						}
					});
				}
			});
		});

		observer.observe(navElement, { childList: true, subtree: true });

		return { navElement: navElement, activeClass: activeClass, observer: observer };
	}

	function _normalizeUrl(url) {
		try {
			const urlObj = new URL(url, window.location.href);
			return urlObj.pathname.replace(/\/$/, '') || '/';
		} catch (e) {
			return url.replace(/\/$/, '') || '/';
		}
	}

	function _updateActiveState(links, activeClass, currentPath) {
		const normalizedCurrent = _normalizeUrl(currentPath);

		links.forEach(function (link) {
			const href = link.getAttribute('href');
			if (!href) return;

			const normalizedHref = _normalizeUrl(href);

			link.classList.remove(activeClass);

			const isExact = normalizedHref === normalizedCurrent;
			const isParent = normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/');

			if (isExact || isParent) {
				link.classList.add(activeClass);
			}
		});
	}

	// ─── Global DOM Observer ───────────────────────────────────
	// Auto-initialize new [data-ln-nav] elements added dynamically.

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							if (node.hasAttribute && node.hasAttribute(DOM_SELECTOR)) {
								constructor(node);
							}
							node.querySelectorAll && node.querySelectorAll('[' + DOM_SELECTOR + ']').forEach(constructor);
						}
					});
				}
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;

	function _initializeAll() {
		document.querySelectorAll('[' + DOM_SELECTOR + ']').forEach(constructor);
	}

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
