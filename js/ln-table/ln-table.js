import { guardBody, dispatch } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table';
	const DOM_ATTRIBUTE = 'lnTable';
	const SORT_ATTR = 'data-ln-sort';        // read-only: column type metadata (number/date/string) used when parsing rows
	const EMPTY_TEMPLATE = 'data-ln-table-empty';
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Singleton — same lang for all table instances on the page
	const _collator = typeof Intl !== 'undefined'
		? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
		: null;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) items.push(root);
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) el[DOM_ATTRIBUTE] = new _component(el);
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.table = dom.querySelector('table');
		this.tbody = dom.querySelector('tbody');
		this.thead = dom.querySelector('thead');
		this.ths = this.thead ? Array.from(this.thead.querySelectorAll('th')) : [];

		this._data = [];
		this._filteredData = [];
		this._searchTerm = '';
		this._sortCol = -1;
		this._sortDir = null;
		this._sortType = null;
		this._columnFilters = {};

		// Virtual scroll state
		this._virtual = false;
		this._rowHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._rafId = null;
		this._scrollHandler = null;
		this._colgroup = null;

		const toolbar = dom.querySelector('.ln-table__toolbar');
		if (toolbar) dom.style.setProperty('--ln-table-toolbar-h', toolbar.offsetHeight + 'px');

		const self = this;

		if (this.tbody && this.tbody.rows.length > 0) {
			this._parseRows();
		} else if (this.tbody) {
			const observer = new MutationObserver(function () {
				if (self.tbody.rows.length > 0) {
					observer.disconnect();
					self._parseRows();
				}
			});
			observer.observe(this.tbody, { childList: true });
		}

		// ─── Search — ln-search dispatches ln-search:change on the target ─────
		// preventDefault() tells ln-search to skip its own DOM show/hide logic.

		this._onSearch = function (e) {
			e.preventDefault();
			self._searchTerm = e.detail.term;
			self._applyFilterAndSort();
			self._vStart = -1;
			self._vEnd = -1;
			self._render();
			dispatch(dom, 'ln-table:filter', {
				term: self._searchTerm,
				matched: self._filteredData.length,
				total: self._data.length
			});
		};
		dom.addEventListener('ln-search:change', this._onSearch);

		// ─── Coordinate with ln-table-sort ─────────────────────

		this._onSort = function (e) {
			self._sortCol = e.detail.direction === null ? -1 : e.detail.column;
			self._sortDir = e.detail.direction;
			self._sortType = e.detail.sortType;
			self._applyFilterAndSort();
			self._vStart = -1;
			self._vEnd = -1;
			self._render();
			dispatch(dom, 'ln-table:sorted', {
				column: e.detail.column,
				direction: e.detail.direction,
				matched: self._filteredData.length,
				total: self._data.length
			});
		};
		dom.addEventListener('ln-table:sort', this._onSort);

		// ─── Column filters — ln-filter dispatches on target via bubbling ──

		this._onColumnFilter = function (e) {
			const key = e.detail.key;
			const value = e.detail.value;
			if (!value) {
				delete self._columnFilters[key];
			} else {
				self._columnFilters[key] = value.toLowerCase();
			}
			self._applyFilterAndSort();
			self._vStart = -1;
			self._vEnd = -1;
			self._render();
			dispatch(dom, 'ln-table:filter', {
				term: self._searchTerm,
				matched: self._filteredData.length,
				total: self._data.length
			});
		};
		dom.addEventListener('ln-filter:changed', this._onColumnFilter);

		return this;
	}

	// ─── Parse rows into in-memory array ───────────────────────

	_component.prototype._parseRows = function () {
		const rows = this.tbody.rows;
		const ths = this.ths;
		this._data = [];

		const sortTypes = [];
		for (let c = 0; c < ths.length; c++) {
			sortTypes[c] = ths[c].getAttribute(SORT_ATTR);
		}

		if (rows.length > 0) this._rowHeight = rows[0].offsetHeight || 40;
		this._lockColumnWidths();

		for (let i = 0; i < rows.length; i++) {
			const tr = rows[i];
			const sortKeys = [];
			const rawTexts = [];
			const searchParts = [];

			for (let j = 0; j < tr.cells.length; j++) {
				const td = tr.cells[j];
				const text = td.textContent.trim();
				const raw = td.hasAttribute('data-ln-value') ? td.getAttribute('data-ln-value') : text;
				const type = sortTypes[j];

				rawTexts[j] = text.toLowerCase();

				if (type === 'number' || type === 'date') {
					sortKeys[j] = parseFloat(raw) || 0;
				} else if (type === 'string') {
					sortKeys[j] = String(raw);
				} else {
					sortKeys[j] = null;
				}

				if (j < tr.cells.length - 1) searchParts.push(text.toLowerCase());
			}

			this._data.push({
				sortKeys: sortKeys,
				rawTexts: rawTexts,
				html: tr.outerHTML,
				searchText: searchParts.join(' ')
			});
		}

		this._filteredData = this._data.slice();
		this._render();

		dispatch(this.dom, 'ln-table:ready', {
			total: this._data.length
		});
	};

	// ─── Filter + Sort ─────────────────────────────────────────

	_component.prototype._applyFilterAndSort = function () {
		const term = this._searchTerm;
		const colFilters = this._columnFilters;
		const hasColFilters = Object.keys(colFilters).length > 0;
		const ths = this.ths;

		// Build column index lookup: { "status": 6, "dept": 2 }
		const colIndexByKey = {};
		if (hasColFilters) {
			for (let i = 0; i < ths.length; i++) {
				const filterKey = ths[i].getAttribute('data-ln-filter-col');
				if (filterKey) colIndexByKey[filterKey] = i;
			}
		}

		if (!term && !hasColFilters) {
			this._filteredData = this._data.slice();
		} else {
			this._filteredData = this._data.filter(function (row) {
				if (term && row.searchText.indexOf(term) === -1) return false;
				if (hasColFilters) {
					for (const key in colFilters) {
						const idx = colIndexByKey[key];
						if (idx !== undefined && row.rawTexts[idx] !== colFilters[key]) return false;
					}
				}
				return true;
			});
		}

		if (this._sortCol < 0 || !this._sortDir) return;

		const colIndex = this._sortCol;
		const multiplier = this._sortDir === 'desc' ? -1 : 1;
		const isNumeric = (this._sortType === 'number' || this._sortType === 'date');
		const compare = _collator
			? _collator.compare
			: function (a, b) { return a < b ? -1 : a > b ? 1 : 0; };

		this._filteredData.sort(function (a, b) {
			const aKey = a.sortKeys[colIndex];
			const bKey = b.sortKeys[colIndex];
			if (isNumeric) return (aKey - bKey) * multiplier;
			return compare(aKey, bKey) * multiplier;
		});
	};

	// ─── Column width locking ──────────────────────────────────

	_component.prototype._lockColumnWidths = function () {
		if (!this.table || !this.thead || this._colgroup) return;

		const colgroup = document.createElement('colgroup');
		this.ths.forEach(function (th) {
			const col = document.createElement('col');
			col.style.width = th.offsetWidth + 'px';
			colgroup.appendChild(col);
		});

		this.table.insertBefore(colgroup, this.table.firstChild);
		this.table.style.tableLayout = 'fixed';
		this._colgroup = colgroup;
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		if (!this.tbody) return;
		const count = this._filteredData.length;

		if (count === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0)) {
			this._disableVirtualScroll();
			this._showEmptyState();
		} else if (count > VIRTUAL_THRESHOLD) {
			this._enableVirtualScroll();
			this._renderVirtual();
		} else {
			this._disableVirtualScroll();
			this._renderAll();
		}
	};

	_component.prototype._renderAll = function () {
		const html = [];
		const data = this._filteredData;
		for (let i = 0; i < data.length; i++) html.push(data[i].html);
		this.tbody.innerHTML = html.join('');
	};

	// ─── Virtual scroll ────────────────────────────────────────

	_component.prototype._enableVirtualScroll = function () {
		if (this._virtual) return;
		this._virtual = true;
		const self = this;

		this._scrollHandler = function () {
			if (self._rafId) return;
			self._rafId = requestAnimationFrame(function () {
				self._rafId = null;
				self._renderVirtual();
			});
		};

		window.addEventListener('scroll', this._scrollHandler, { passive: true });
		window.addEventListener('resize', this._scrollHandler, { passive: true });
	};

	_component.prototype._disableVirtualScroll = function () {
		if (!this._virtual) return;
		this._virtual = false;

		if (this._scrollHandler) {
			window.removeEventListener('scroll', this._scrollHandler);
			window.removeEventListener('resize', this._scrollHandler);
			this._scrollHandler = null;
		}
		if (this._rafId) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}
		this._vStart = -1;
		this._vEnd = -1;
	};

	_component.prototype._renderVirtual = function () {
		const data = this._filteredData;
		const total = data.length;
		const rowH = this._rowHeight;
		if (!rowH || !total) return;

		const tableRect = this.table.getBoundingClientRect();
		const tableTopInPage = tableRect.top + window.scrollY;
		const theadH = this.thead ? this.thead.offsetHeight : 0;
		const dataStartInPage = tableTopInPage + theadH;

		const scrollIntoData = window.scrollY - dataStartInPage;
		const startRow = Math.max(0, Math.floor(scrollIntoData / rowH) - BUFFER_ROWS);
		const endRow = Math.min(startRow + Math.ceil(window.innerHeight / rowH) + (BUFFER_ROWS * 2), total);

		if (startRow === this._vStart && endRow === this._vEnd) return;
		this._vStart = startRow;
		this._vEnd = endRow;

		const colSpan = this.ths.length || 1;
		const topH = startRow * rowH;
		const bottomH = (total - endRow) * rowH;
		const html = '';

		if (topH > 0) {
			html += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' +
				colSpan + '" style="height:' + topH + 'px;padding:0;border:none"></td></tr>';
		}
		for (let i = startRow; i < endRow; i++) html += data[i].html;
		if (bottomH > 0) {
			html += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' +
				colSpan + '" style="height:' + bottomH + 'px;padding:0;border:none"></td></tr>';
		}

		this.tbody.innerHTML = html;
	};

	// ─── Empty state ───────────────────────────────────────────
	// Clones <template data-ln-table-empty> if present, then dispatches ln-table:empty.

	_component.prototype._showEmptyState = function () {
		const colSpan = this.ths.length || 1;
		const tpl = this.dom.querySelector('template[' + EMPTY_TEMPLATE + ']');

		const td = document.createElement('td');
		td.setAttribute('colspan', String(colSpan));
		if (tpl) td.appendChild(document.importNode(tpl.content, true));

		const tr = document.createElement('tr');
		tr.className = 'ln-table__empty';
		tr.appendChild(td);

		this.tbody.innerHTML = '';
		this.tbody.appendChild(tr);

		dispatch(this.dom, 'ln-table:empty', {
			term: this._searchTerm,
			total: this._data.length
		});
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._disableVirtualScroll();
		this.dom.removeEventListener('ln-search:change', this._onSearch);
		this.dom.removeEventListener('ln-table:sort', this._onSort);
		this.dom.removeEventListener('ln-filter:changed', this._onColumnFilter);
		if (this._colgroup) {
			this._colgroup.remove();
			this._colgroup = null;
		}
		if (this.table) this.table.style.tableLayout = '';
		this._data = [];
		this._filteredData = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

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
			observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [DOM_SELECTOR] });
		}, 'ln-table');
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
