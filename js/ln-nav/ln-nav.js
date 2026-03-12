(function () {
	const DOM_SELECTOR = 'data-ln-nav';
	const DOM_ATTRIBUTE = 'lnNav';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const navInstances = new WeakMap();

	// ─── pushState singleton patch ──────────────────────────────
	const _pushStateCallbacks = [];

	if (!history._lnNavPatched) {
		const _origPushState = history.pushState;
		history.pushState = function () {
			_origPushState.apply(history, arguments);
			for (const cb of _pushStateCallbacks) { cb(); }
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
		navElement[DOM_ATTRIBUTE] = instance;
	}

	function _initializeNav(navElement, activeClass) {
		let links = Array.from(navElement.querySelectorAll('a'));

		_updateActiveState(links, activeClass, window.location.pathname);

		const updateHandler = function () {
			links = Array.from(navElement.querySelectorAll('a'));
			_updateActiveState(links, activeClass, window.location.pathname);
		};

		window.addEventListener('popstate', updateHandler);
		_pushStateCallbacks.push(updateHandler);

		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
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
					}

					for (const node of mutation.removedNodes) {
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
					}
				}
			}
		});

		observer.observe(navElement, { childList: true, subtree: true });

		return {
			navElement: navElement,
			activeClass: activeClass,
			observer: observer,
			updateHandler: updateHandler,
			destroy: function () {
				observer.disconnect();
				window.removeEventListener('popstate', updateHandler);
				const idx = _pushStateCallbacks.indexOf(updateHandler);
				if (idx !== -1) _pushStateCallbacks.splice(idx, 1);
				navInstances.delete(navElement);
				delete navElement[DOM_ATTRIBUTE];
			}
		};
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

		for (const link of links) {
			const href = link.getAttribute('href');
			if (!href) continue;

			const normalizedHref = _normalizeUrl(href);

			link.classList.remove(activeClass);

			const isExact = normalizedHref === normalizedCurrent;
			const isParent = normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/');

			if (isExact || isParent) {
				link.classList.add(activeClass);
			}
		}
	}

	// ─── Global DOM Observer ───────────────────────────────────

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							if (node.hasAttribute && node.hasAttribute(DOM_SELECTOR)) {
								constructor(node);
							}
							if (node.querySelectorAll) {
								for (const el of node.querySelectorAll('[' + DOM_SELECTOR + ']')) {
									constructor(el);
								}
							}
						}
					}
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;

	function _initializeAll() {
		for (const el of document.querySelectorAll('[' + DOM_SELECTOR + ']')) {
			constructor(el);
		}
	}

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
