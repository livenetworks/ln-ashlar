(function () {
	const DOM_SELECTOR = 'data-ln-nav';
	const DOM_ATTRIBUTE = 'lnNav';

	// Early exit if already defined
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
		return;
	}

	// WeakMap to store nav instances
	const navInstances = new WeakMap();

	function constructor(navElement) {
		// Validate navElement
		if (!navElement.hasAttribute(DOM_SELECTOR)) return;
		if (navInstances.has(navElement)) return; // Prevent double-init

		// Get active class name from data attribute value
		const activeClass = navElement.getAttribute(DOM_SELECTOR);
		if (!activeClass) return; // Require class name

		// Initialize navigation instance
		const instance = _initializeNav(navElement, activeClass);
		navInstances.set(navElement, instance);
	}

	function _initializeNav(navElement, activeClass) {
		// Find all <a> elements within the nav
		let links = Array.from(navElement.querySelectorAll('a'));

		// Set initial active state based on current URL
		_updateActiveState(links, activeClass, window.location.pathname);

		// Listen for popstate events (browser back/forward button AND pushState)
		const popstateHandler = function() {
			links = Array.from(navElement.querySelectorAll('a')); // Refresh link list
			_updateActiveState(links, activeClass, window.location.pathname);
		};
		window.addEventListener('popstate', popstateHandler);

		// Watch for URL changes via history.pushState (used by ln-ajax)
		// We'll override pushState to detect URL changes
		const originalPushState = history.pushState;
		history.pushState = function() {
			originalPushState.apply(history, arguments);
			// Trigger update after pushState
			links = Array.from(navElement.querySelectorAll('a'));
			_updateActiveState(links, activeClass, window.location.pathname);
		};

		// Observe DOM changes within this nav element for dynamic links
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function(node) {
						// Check if added node is a link or contains links
						if (node.nodeType === 1) {
							if (node.tagName === 'A') {
								links.push(node);
								// Apply current active state to new link
								_updateActiveState([node], activeClass, window.location.pathname);
							} else if (node.querySelectorAll) {
								const newLinks = Array.from(node.querySelectorAll('a'));
								links = links.concat(newLinks);
								// Apply current active state to new links
								_updateActiveState(newLinks, activeClass, window.location.pathname);
							}
						}
					});

					// Handle removed links - prevents memory leaks and stale references
					// If we don't clean up, we'd keep references to removed DOM nodes
					mutation.removedNodes.forEach(function(node) {
						if (node.nodeType === 1) {
							if (node.tagName === 'A') {
								links = links.filter(function(link) { return link !== node; });
							} else if (node.querySelectorAll) {
								const removedLinks = Array.from(node.querySelectorAll('a'));
								links = links.filter(function(link) {
									return !removedLinks.includes(link);
								});
							}
						}
					});
				}
			});
		});

		observer.observe(navElement, {
			childList: true,
			subtree: true
		});

		// Return instance data (stored in WeakMap for potential cleanup/destroy method)
		// Currently not used, but keeps the door open for future destroy() functionality
		return {
			navElement: navElement,
			activeClass: activeClass,
			observer: observer
		};
	}

	function _normalizeUrl(url) {
		try {
			const urlObj = new URL(url, window.location.origin);
			return urlObj.pathname.replace(/\/$/, '') || '/'; // Remove trailing slash
		} catch (e) {
			return url.replace(/\/$/, '') || '/';
		}
	}

	function _updateActiveState(links, activeClass, currentPath) {
		const normalizedCurrent = _normalizeUrl(currentPath);

		links.forEach(function(link) {
			const href = link.getAttribute('href');
			if (!href) return;

			const normalizedHref = _normalizeUrl(href);

			// Remove any previous active class first
			link.classList.remove(activeClass);

			// Determine if this link should be active
			const isExact = normalizedHref === normalizedCurrent;
			const isParent = normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/');

			if (isExact || isParent) {
				link.classList.add(activeClass);
			}
		});
	}

	// Expose global API
	window[DOM_ATTRIBUTE] = constructor;

	// Initialize all nav elements on DOM ready
	function _initializeAll() {
		const navElements = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		navElements.forEach(function(nav) {
			constructor(nav);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
