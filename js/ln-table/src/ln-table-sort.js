import { guardBody, dispatch } from '../../ln-core';
import { persistGet, persistSet } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnTableSort';
	const SORT_ATTR = 'data-ln-sort';
	const BUTTON_HOOK = 'data-ln-table-sort';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────
	// Auto-initializes any <table> that contains th[data-ln-sort] headers.

	function constructor(domRoot) {
		findElements(domRoot);
	}

	// Local findElements — intentional divergence from ln-core helper: tag selector ('table') + two-arg constructor (table, ths).
	function findElements(root) {
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

			// D1/Option A: bind click to the sort button, not the whole <th>.
			// Columns without a [data-ln-table-sort] button skip binding.
			const btn = th.querySelector('[' + BUTTON_HOOK + ']');
			if (!btn) return;

			btn._lnSortClick = function () {
				self._handleClick(index, th);
			};
			btn.addEventListener('click', btn._lnSortClick);
		});

		// ─── Restore persisted sort ───────────────────────────────
		const persistRoot = table.closest('[data-ln-table][data-ln-persist]');
		if (persistRoot) {
			const saved = persistGet('table-sort', persistRoot);
			if (saved && saved.dir && saved.col >= 0 && saved.col < ths.length) {
				// Programmatically trigger the saved sort
				this._handleClick(saved.col, ths[saved.col]);
				if (saved.dir === 'desc') {
					this._handleClick(saved.col, ths[saved.col]);
				}
			}
		}

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

		// JS-2: use state classes on <th>; CSS owns icon visibility.
		this.ths.forEach(function (t) {
			t.classList.remove('ln-sort-asc', 'ln-sort-desc');
		});

		if (newDir === null) {
			this._col = -1;
			this._dir = null;
		} else {
			this._col = colIndex;
			this._dir = newDir;
			th.classList.add(newDir === 'asc' ? 'ln-sort-asc' : 'ln-sort-desc');
		}

		dispatch(this.table, 'ln-table:sort', {
			column: colIndex,
			sortType: th.getAttribute(SORT_ATTR),
			direction: newDir
		});
		const persistRoot = this.table.closest('[data-ln-table][data-ln-persist]');
		if (persistRoot) {
			if (newDir === null) {
				persistSet('table-sort', persistRoot, null);
			} else {
				persistSet('table-sort', persistRoot, { col: colIndex, dir: newDir });
			}
		}
	};

	_component.prototype.destroy = function () {
		if (!this.table[DOM_ATTRIBUTE]) return;
		this.ths.forEach(function (th) {
			const btn = th.querySelector('[' + BUTTON_HOOK + ']');
			if (btn && btn._lnSortClick) {
				btn.removeEventListener('click', btn._lnSortClick);
				delete btn._lnSortClick;
			}
			delete th[DOM_ATTRIBUTE + 'Bound'];
		});
		delete this.table[DOM_ATTRIBUTE];
	};

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach(function (node) {
							if (node.nodeType === 1) findElements(node);
						});
					} else if (mutation.type === 'attributes') {
						findElements(mutation.target);
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
