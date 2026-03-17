(function () {
	const DOM_SELECTOR = 'data-ln-table';
	const DOM_ATTRIBUTE = 'lnTable';
	const SEARCH_SELECTOR = 'data-ln-table-search';
	const CLEAR_SELECTOR = 'data-ln-table-clear';
	const SORT_ATTR = 'data-ln-sort';
	const SORT_ACTIVE_ATTR = 'data-ln-sort-active';
	const INIT_ATTR = 'data-ln-table-initialized';
	const DEBOUNCE_MS = 150;
	const VIRTUAL_THRESHOLD = 200;  // virtualize above this row count
	const BUFFER_ROWS = 15;         // extra rows rendered above/below viewport

	// Cached collator for Cyrillic-aware string sorting (created once, reused)
	var _collator = typeof Intl !== 'undefined'
		? new Intl.Collator('mk', { sensitivity: 'base' })
		: null;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		var items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		if (dom.hasAttribute(INIT_ATTR)) return this;

		this.dom = dom;
		this.table = dom.querySelector('table');
		this.tbody = dom.querySelector('tbody');
		this.thead = dom.querySelector('thead');
		this.ths = this.thead ? Array.from(this.thead.querySelectorAll('th')) : [];
		this.countEl = dom.querySelector('.ln-table__count');
		this.footerCountEl = dom.querySelector('.ln-table__footer strong');
		this.timingEl = dom.querySelector('.ln-table__timing');

		// Search input targets this table by ID (data-ln-table-search="tableId")
		this.searchInput = dom.id
			? document.querySelector('[' + SEARCH_SELECTOR + '="' + dom.id + '"]')
			: null;

		this._data = [];
		this._filteredData = [];
		this._sortCol = -1;
		this._sortDir = null;
		this._searchTerm = '';
		this._totalCount = 0;
		this._debounceTimer = null;

		// Virtual scroll state
		this._virtual = false;
		this._rowHeight = 0;
		this._vStart = -1;  // currently rendered range start
		this._vEnd = -1;    // currently rendered range end
		this._rafId = null;
		this._scrollHandler = null;
		this._colgroup = null;

		// Measure toolbar height for sticky thead offset
		var toolbar = dom.querySelector('.ln-table__toolbar');
		if (toolbar) {
			var h = toolbar.offsetHeight;
			dom.style.setProperty('--ln-table-toolbar-h', h + 'px');
		}

		var self = this;

		// If tbody already has rows, parse immediately
		if (this.tbody && this.tbody.rows.length > 0) {
			this._parseRows();
			this._attachSortHandlers();
		} else if (this.tbody) {
			// Observe tbody for dynamically added rows
			this._tbodyObserver = new MutationObserver(function () {
				if (self.tbody.rows.length > 0) {
					self._tbodyObserver.disconnect();
					self._parseRows();
					self._attachSortHandlers();
				}
			});
			this._tbodyObserver.observe(this.tbody, { childList: true });
		}

		this._attachSearchHandler();
		this._attachClearHandler();

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Parse rows into in-memory array ───────────────────────

	_component.prototype._parseRows = function () {
		var rows = this.tbody.rows;
		var ths = this.ths;
		this._data = [];

		// Pre-read sort types per column for typed key extraction
		var sortTypes = [];
		for (var c = 0; c < ths.length; c++) {
			sortTypes[c] = ths[c].getAttribute(SORT_ATTR);
		}

		// Measure row height from first rendered row (before we modify DOM)
		if (rows.length > 0) {
			this._rowHeight = rows[0].offsetHeight || 40;
		}

		// Lock column widths before virtualizing (prevents width jumps)
		this._lockColumnWidths();

		for (var i = 0; i < rows.length; i++) {
			var tr = rows[i];
			var sortKeys = [];
			var searchParts = [];

			for (var j = 0; j < tr.cells.length; j++) {
				var td = tr.cells[j];
				var text = td.textContent.trim();
				var raw = td.hasAttribute('data-ln-value')
					? td.getAttribute('data-ln-value')
					: text;

				var type = sortTypes[j];
				if (type === 'number' || type === 'date') {
					sortKeys[j] = parseFloat(raw) || 0;
				} else if (type === 'string') {
					sortKeys[j] = String(raw);
				} else {
					sortKeys[j] = null;
				}

				if (j < tr.cells.length - 1) {
					searchParts.push(text.toLowerCase());
				}
			}

			this._data.push({
				index: i,
				sortKeys: sortKeys,
				html: tr.outerHTML,
				searchText: searchParts.join(' ')
			});
		}

		this._totalCount = this._data.length;
		this._filteredData = this._data;

		// Activate virtual scroll if needed
		this._render();
	};

	// ─── Column width locking (prevents width jumps in virtual mode) ──

	_component.prototype._lockColumnWidths = function () {
		if (!this.table || !this.thead || this._colgroup) return;

		var ths = this.ths;
		var colgroup = document.createElement('colgroup');

		for (var i = 0; i < ths.length; i++) {
			var col = document.createElement('col');
			col.style.width = ths[i].offsetWidth + 'px';
			colgroup.appendChild(col);
		}

		this.table.insertBefore(colgroup, this.table.firstChild);
		this.table.style.tableLayout = 'fixed';
		this._colgroup = colgroup;
	};

	// ─── Sort handlers ─────────────────────────────────────────

	_component.prototype._attachSortHandlers = function () {
		var self = this;

		this.ths.forEach(function (th, colIndex) {
			if (!th.hasAttribute(SORT_ATTR)) return;
			if (th[DOM_ATTRIBUTE + 'SortBound']) return;
			th[DOM_ATTRIBUTE + 'SortBound'] = true;

			th.addEventListener('click', function () {
				self._handleSort(colIndex, th);
			});
		});
	};

	_component.prototype._handleSort = function (colIndex, th) {
		var sortType = th.getAttribute(SORT_ATTR);
		var newDir;

		if (this._sortCol !== colIndex) {
			newDir = 'asc';
		} else if (this._sortDir === 'asc') {
			newDir = 'desc';
		} else if (this._sortDir === 'desc') {
			newDir = null;
		} else {
			newDir = 'asc';
		}

		this.ths.forEach(function (t) {
			t.removeAttribute(SORT_ACTIVE_ATTR);
		});

		var t0 = performance.now();

		if (newDir === null) {
			this._sortCol = -1;
			this._sortDir = null;
			this._applyFilter();
		} else {
			this._sortCol = colIndex;
			this._sortDir = newDir;
			th.setAttribute(SORT_ACTIVE_ATTR, newDir);
			this._sortData(colIndex, sortType, newDir);
		}

		// Reset virtual scroll range so it fully re-renders
		this._vStart = -1;
		this._vEnd = -1;
		this._render();

		var elapsed = performance.now() - t0;
		this._updateTiming(elapsed);
		_dispatch(this.dom, 'ln-table:sort', {
			column: colIndex,
			direction: newDir,
			duration: elapsed
		});
	};

	_component.prototype._sortData = function (colIndex, sortType, direction) {
		var multiplier = direction === 'desc' ? -1 : 1;
		var isNumeric = (sortType === 'number' || sortType === 'date');
		var compare = _collator ? _collator.compare : function (a, b) {
			return a < b ? -1 : a > b ? 1 : 0;
		};

		this._filteredData.sort(function (a, b) {
			var aKey = a.sortKeys[colIndex];
			var bKey = b.sortKeys[colIndex];

			if (isNumeric) {
				return (aKey - bKey) * multiplier;
			}
			return compare(aKey, bKey) * multiplier;
		});
	};

	// ─── Filter / Search ───────────────────────────────────────

	_component.prototype._attachSearchHandler = function () {
		if (!this.searchInput) return;
		var self = this;

		this.searchInput.addEventListener('input', function () {
			clearTimeout(self._debounceTimer);
			self._debounceTimer = setTimeout(function () {
				var t0 = performance.now();

				self._searchTerm = self.searchInput.value.trim().toLowerCase();
				self._applyFilter();

				if (self._sortCol >= 0 && self._sortDir) {
					var th = self.ths[self._sortCol];
					var sortType = th.getAttribute(SORT_ATTR);
					self._sortData(self._sortCol, sortType, self._sortDir);
				}

				// Reset virtual scroll range
				self._vStart = -1;
				self._vEnd = -1;
				self._render();

				var elapsed = performance.now() - t0;
				self._updateTiming(elapsed);

				_dispatch(self.dom, 'ln-table:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._totalCount,
					duration: elapsed
				});
			}, DEBOUNCE_MS);
		});
	};

	_component.prototype._applyFilter = function () {
		if (!this._searchTerm) {
			this._filteredData = this._data.slice();
		} else {
			var term = this._searchTerm;
			this._filteredData = this._data.filter(function (row) {
				return row.searchText.indexOf(term) !== -1;
			});
		}
	};

	_component.prototype._attachClearHandler = function () {
		var self = this;
		this.dom.addEventListener('click', function (e) {
			var btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
			if (!btn) return;

			if (self.searchInput) {
				self.searchInput.value = '';
				self.searchInput.focus();
			}
			self._searchTerm = '';
			self._applyFilter();

			if (self._sortCol >= 0 && self._sortDir) {
				var th = self.ths[self._sortCol];
				var sortType = th.getAttribute(SORT_ATTR);
				self._sortData(self._sortCol, sortType, self._sortDir);
			}

			self._vStart = -1;
			self._vEnd = -1;
			self._render();
			self._updateTiming(0);
		});
	};

	// ─── Render (dispatches to virtual or simple) ──────────────

	_component.prototype._render = function () {
		if (!this.tbody) return;
		var count = this._filteredData.length;

		if (count === 0 && this._searchTerm) {
			this._disableVirtualScroll();
			this._showEmptyState();
		} else if (count > VIRTUAL_THRESHOLD) {
			this._enableVirtualScroll();
			this._renderVirtual();
		} else {
			this._disableVirtualScroll();
			this._renderAll();
		}

		this._updateCounts(count, this._totalCount);
	};

	// ─── Simple render (all rows at once) ──────────────────────

	_component.prototype._renderAll = function () {
		var html = [];
		var data = this._filteredData;
		for (var i = 0; i < data.length; i++) {
			html.push(data[i].html);
		}
		this.tbody.innerHTML = html.join('');
	};

	// ─── Virtual scroll ────────────────────────────────────────

	_component.prototype._enableVirtualScroll = function () {
		if (this._virtual) return;
		this._virtual = true;

		var self = this;
		this._scrollHandler = function () {
			if (self._rafId) return; // already scheduled
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
		var data = this._filteredData;
		var total = data.length;
		var rowH = this._rowHeight;
		if (!rowH || !total) return;

		var totalHeight = total * rowH;

		// Calculate visible range based on scroll position
		// The table's position in the page (accounting for elements above it)
		var tableRect = this.table.getBoundingClientRect();
		var tableTopInPage = tableRect.top + window.scrollY;
		var viewTop = window.scrollY;
		var viewBottom = viewTop + window.innerHeight;

		// How far into the table data area are we?
		// Account for thead height (it's sticky, so data starts below it visually)
		var theadH = this.thead ? this.thead.offsetHeight : 0;
		var dataStartInPage = tableTopInPage + theadH;

		var scrollIntoData = viewTop - dataStartInPage;
		var startRow = Math.floor(scrollIntoData / rowH) - BUFFER_ROWS;
		startRow = Math.max(0, startRow);

		var visibleRows = Math.ceil(window.innerHeight / rowH) + (BUFFER_ROWS * 2);
		var endRow = Math.min(startRow + visibleRows, total);

		// Skip re-render if visible range hasn't changed
		if (startRow === this._vStart && endRow === this._vEnd) return;
		this._vStart = startRow;
		this._vEnd = endRow;

		// Build HTML: spacer-top + visible rows + spacer-bottom
		var colSpan = this.ths.length || 1;
		var topH = startRow * rowH;
		var bottomH = (total - endRow) * rowH;

		var html = '';

		if (topH > 0) {
			html += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' +
				colSpan + '" style="height:' + topH + 'px;padding:0;border:none"></td></tr>';
		}

		for (var i = startRow; i < endRow; i++) {
			html += data[i].html;
		}

		if (bottomH > 0) {
			html += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' +
				colSpan + '" style="height:' + bottomH + 'px;padding:0;border:none"></td></tr>';
		}

		this.tbody.innerHTML = html;
	};

	// ─── Empty state ───────────────────────────────────────────

	_component.prototype._showEmptyState = function () {
		var colSpan = this.ths.length || 1;
		var term = _escapeHtml(this._searchTerm);

		this.tbody.innerHTML =
			'<tr class="ln-table__empty">' +
				'<td colspan="' + colSpan + '">' +
					'<article class="ln-table__empty-state">' +
						'<span class="ln-icon-filter ln-icon--xl"></span>' +
						'<h3>Нема резултати</h3>' +
						'<p>Пребарувањето \u201E<strong>' + term + '</strong>\u201C не врати резултати.</p>' +
						'<button class="btn btn--secondary" ' + CLEAR_SELECTOR + '>Исчисти пребарување</button>' +
					'</article>' +
				'</td>' +
			'</tr>';
	};

	// ─── UI Updates ────────────────────────────────────────────

	_component.prototype._updateCounts = function (filtered, total) {
		var totalFormatted = _formatNumber(total);

		if (this.countEl) {
			if (this._searchTerm && filtered !== total) {
				this.countEl.innerHTML =
					'<strong>' + _formatNumber(filtered) + '</strong> / ' +
					totalFormatted + ' записи';
			} else {
				this.countEl.textContent = totalFormatted + ' записи';
			}
		}

		if (this.footerCountEl) {
			this.footerCountEl.textContent = this._searchTerm
				? _formatNumber(filtered) + ' / ' + totalFormatted
				: totalFormatted;
		}
	};

	_component.prototype._updateTiming = function (ms) {
		if (this.timingEl) {
			this.timingEl.textContent = ms > 0 ? ms.toFixed(0) + 'ms' : '';
		}
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _formatNumber(n) {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	function _escapeHtml(str) {
		var div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_findElements(node);
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
