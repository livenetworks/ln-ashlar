import { dispatchCancelable, guardBody, observeAttributes, observeLifecycle } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-link';
	const DOM_ATTRIBUTE = 'lnLink';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-link': { type: 'marker', description: 'Makes entire table row or container clickable based on child anchor link' }
	};

	// ─── Status Bar ────────────────────────────────────────────

	let _statusEl = null;

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
		if (e.target.closest('a, button, input, select, textarea')) return;

		const link = row.querySelector('a');
		if (!link) return;

		const href = link.getAttribute('href');
		if (!href) return;

		if (e.ctrlKey || e.metaKey || e.button === 1) {
			window.open(href, '_blank', 'noopener,noreferrer');
			return;
		}

		const before = dispatchCancelable(row, 'ln-link:navigate', { target: row, href: href, link: link });
		if (before.defaultPrevented) return;
		link.click();
	}

	// ─── Hover Handlers ────────────────────────────────────────

	function _handleMouseEnter(row) {
		const link = row.querySelector('a');
		if (!link) return;

		const href = link.getAttribute('href');
		if (href) _showStatus(href);
	}

	function _handleMouseLeave() {
		_hideStatus();
	}

	// ─── Row Initialization ────────────────────────────────────

	function _initRow(row) {
		if (row[DOM_ATTRIBUTE + 'Row']) return;

		const link = row.querySelector('a');
		if (!link) return;

		row[DOM_ATTRIBUTE + 'Row'] = true;

		row._lnLinkClick = function (e) {
			_handleClick(row, e);
		};
		row._lnLinkEnter = function () {
			_handleMouseEnter(row);
		};

		row.addEventListener('click', row._lnLinkClick);
		row.addEventListener('mouseenter', row._lnLinkEnter);
		row.addEventListener('mouseleave', _handleMouseLeave);
	}

	function _destroyRow(row) {
		if (!row[DOM_ATTRIBUTE + 'Row']) return;
		if (row._lnLinkClick) row.removeEventListener('click', row._lnLinkClick);
		if (row._lnLinkEnter) row.removeEventListener('mouseenter', row._lnLinkEnter);
		row.removeEventListener('mouseleave', _handleMouseLeave);
		delete row._lnLinkClick;
		delete row._lnLinkEnter;
		delete row[DOM_ATTRIBUTE + 'Row'];
	}

	function _destroyContainer(container) {
		if (!container[DOM_ATTRIBUTE + 'Init']) return;
		const tag = container.tagName;

		if (tag === 'TABLE' || tag === 'TBODY') {
			const tbody = (tag === 'TABLE') ? container.querySelector('tbody') || container : container;
			for (const row of tbody.querySelectorAll('tr')) {
				_destroyRow(row);
			}
		} else {
			_destroyRow(container);
		}

		delete container[DOM_ATTRIBUTE + 'Init'];
	}

	// ─── Container Initialization ──────────────────────────────

	function _initContainer(container) {
		if (container[DOM_ATTRIBUTE + 'Init']) return;
		container[DOM_ATTRIBUTE + 'Init'] = true;

		const tag = container.tagName;

		if (tag === 'TABLE' || tag === 'TBODY') {
			const tbody = (tag === 'TABLE') ? container.querySelector('tbody') || container : container;
			for (const row of tbody.querySelectorAll('tr')) {
				_initRow(row);
			}
		} else {
			_initRow(container);
		}
	}

	// ─── Find & Init ───────────────────────────────────────────

	// Local findElements — intentional divergence from ln-core helper: invokes _initContainer (function, flag-based) and processes child rows.
	function findElements(root) {
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			_initContainer(root);
		}

		const containers = root.querySelectorAll ? root.querySelectorAll('[' + DOM_SELECTOR + ']') : [];
		for (const c of containers) {
			_initContainer(c);
		}
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			observeLifecycle({
				query: '[' + DOM_SELECTOR + ']',
				onInit: function (node) {
					findElements(node);
				},
				onSubtreeChange: function (host, mutation) {
					for (let i = 0; i < mutation.addedNodes.length; i++) {
						const node = mutation.addedNodes[i];
						if (node.nodeType === 1) {
							if (node.tagName === 'TR') {
								_initRow(node);
							} else if (node.querySelectorAll) {
								const rows = node.querySelectorAll('tr');
								for (let r = 0; r < rows.length; r++) {
									_initRow(rows[r]);
								}
							}
						}
					}
				}
			});

			observeAttributes([DOM_SELECTOR], function (el) {
				if (el.hasAttribute && el.hasAttribute(DOM_SELECTOR)) {
					findElements(el);
				} else {
					_destroyContainer(el);
				}
			});
		}, 'ln-link');
	}

	// ─── Constructor (public API) ──────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot);
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = { init: constructor, destroy: _destroyContainer };

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
