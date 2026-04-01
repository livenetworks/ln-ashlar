import { guardBody } from '../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnTableSort';
	const SORT_ATTR = 'data-ln-sort';
	const SORT_ACTIVE_ATTR = 'data-ln-sort-active';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────
	// Auto-initializes any <table> that contains th[data-ln-sort] headers.

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const tables = Array.from(root.querySelectorAll('table'));
		if (root.tagName === 'TABLE') tables.push(root);

		tables.forEach(function (table) {
			if (table[DOM_ATTRIBUTE]) return;
			const ths = Array.from(table.querySelectorAll('th[' + SORT_ATTR + ']'));
			if (ths.length) table[DOM_ATTRIBUTE] = new _component(table, ths);
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(table, ths) {
		this.table = table;
		this.ths = ths;
		this._col = -1;
		this._dir = null;
		const self = this;

		ths.forEach(function (th, index) {
			if (th[DOM_ATTRIBUTE + 'Bound']) return;
			th[DOM_ATTRIBUTE + 'Bound'] = true;
			th.addEventListener('click', function () {
				self._handleClick(index, th);
			});
		});

		return this;
	}

	_component.prototype._handleClick = function (colIndex, th) {
		let newDir;

		if (this._col !== colIndex) {
			newDir = 'asc';
		} else if (this._dir === 'asc') {
			newDir = 'desc';
		} else if (this._dir === 'desc') {
			newDir = null;
		} else {
			newDir = 'asc';
		}

		this.ths.forEach(function (t) { t.removeAttribute(SORT_ACTIVE_ATTR); });

		if (newDir === null) {
			this._col = -1;
			this._dir = null;
		} else {
			this._col = colIndex;
			this._dir = newDir;
			th.setAttribute(SORT_ACTIVE_ATTR, newDir);
		}

		_dispatch(this.table, 'ln-table:sort', {
			column: colIndex,
			sortType: th.getAttribute(SORT_ATTR),
			direction: newDir
		});
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach(function (node) {
							if (node.nodeType === 1) _findElements(node);
						});
					} else if (mutation.type === 'attributes') {
						_findElements(mutation.target);
					}
				});
			});
			observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [SORT_ATTR] });
		}, 'ln-table-sort');
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
