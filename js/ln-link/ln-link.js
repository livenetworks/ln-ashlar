(function () {
	const DOM_SELECTOR = 'data-ln-link';
	const DOM_ATTRIBUTE = 'lnLink';

	// Prevent duplicate initialization
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	// ─── Status Bar ────────────────────────────────────────────

	var _statusEl = null;

	function _createStatusBar() {
		_statusEl = document.createElement('div');
		_statusEl.className = 'ln-link-status';
		document.body.appendChild(_statusEl);
	}

	function _showStatus(url) {
		if (!_statusEl) return;
		_statusEl.textContent = url;
		_statusEl.classList.add('ln-link-status--visible');
	}

	function _hideStatus() {
		if (!_statusEl) return;
		_statusEl.classList.remove('ln-link-status--visible');
	}

	// ─── Click Handler ─────────────────────────────────────────

	function _handleClick(row, e) {
		// Don't intercept clicks on interactive elements
		if (e.target.closest('a, button, input, select, textarea')) return;

		var link = row.querySelector('a');
		if (!link) return;

		var href = link.getAttribute('href');
		if (!href) return;

		// Ctrl/Meta/middle-click → open in new tab (native behavior)
		if (e.ctrlKey || e.metaKey || e.button === 1) {
			window.open(href, '_blank');
			return;
		}

		// Normal click → trigger click on the link
		// .click() triggers both event listeners (ln-ajax) and native navigation
		var before = _dispatchCancelable(row, 'ln-link:navigate', { target: row, href: href, link: link });
		if (before.defaultPrevented) return;
		link.click();
	}

	// ─── Hover Handlers ────────────────────────────────────────

	function _handleMouseEnter(row) {
		var link = row.querySelector('a');
		if (!link) return;

		var href = link.getAttribute('href');
		if (href) _showStatus(href);
	}

	function _handleMouseLeave() {
		_hideStatus();
	}

	// ─── Row Initialization ────────────────────────────────────

	function _initRow(row) {
		if (row._lnLinkInit) return;
		row._lnLinkInit = true;

		// Only init rows that actually contain a link
		if (!row.querySelector('a')) return;

		row.addEventListener('click', function (e) {
			_handleClick(row, e);
		});

		row.addEventListener('mouseenter', function () {
			_handleMouseEnter(row);
		});

		row.addEventListener('mouseleave', _handleMouseLeave);
	}

	// ─── Container Initialization ──────────────────────────────

	function _initContainer(container) {
		if (container._lnLinkInit) return;
		container._lnLinkInit = true;

		var tag = container.tagName;

		if (tag === 'TABLE' || tag === 'TBODY') {
			// Table mode: each <tr> in <tbody> becomes clickable
			var tbody = (tag === 'TABLE') ? container.querySelector('tbody') || container : container;
			var rows = tbody.querySelectorAll('tr');
			rows.forEach(_initRow);
		} else if (tag === 'TR') {
			_initRow(container);
		} else {
			// Generic container: the element itself is clickable
			_initRow(container);
		}
	}

	// ─── Find & Init ───────────────────────────────────────────

	function _findElements(root) {
		// Check if root itself has the attribute
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			_initContainer(root);
		}

		// Check descendants
		var containers = root.querySelectorAll ? root.querySelectorAll('[' + DOM_SELECTOR + ']') : [];
		containers.forEach(_initContainer);
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_findElements(node);

							// If a new <tr> is added inside an already-initialized container,
							// init the row directly
							if (node.tagName === 'TR') {
								var parent = node.closest('[' + DOM_SELECTOR + ']');
								if (parent) _initRow(node);
							}
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// ─── Constructor (public API) ──────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = { init: constructor };

	function _initializeAll() {
		_createStatusBar();
		_domObserver();
		constructor(document.body);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
