import { cloneTemplateScoped, dispatch, requestData, fill, fillTemplate, registerComponent, readValue } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table';
	const DOM_ATTRIBUTE = 'lnTable';
	const SORT_ATTR = 'data-ln-table-sort';
	const EMPTY_TEMPLATE = 'data-ln-table-empty';
	// Tuning constant — duplicated in ln-data-table for component independence
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Singleton — same lang for all table instances on the page
	const _collator = typeof Intl !== 'undefined'
		? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
		: null;

	const _numFmt = typeof Intl !== 'undefined'
		? new Intl.NumberFormat(document.documentElement.lang || undefined)
		: null;

	function _formatNum(n) {
		return _numFmt ? _numFmt.format(n) : String(n);
	}

	function _findScrollContainer(el) {
		let p = el.parentElement;
		while (p && p !== document.body && p !== document.documentElement) {
			const cs = getComputedStyle(p);
			const oy = cs.overflowY;
			if (oy === 'auto' || oy === 'scroll') return p;
			p = p.parentElement;
		}
		return null;
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.table = dom.querySelector('table');
		this.tbody = dom.querySelector('[data-ln-table-body]') || dom.querySelector('tbody');
		this.thead = dom.querySelector('thead');
		// Scope to the column-headers row (last <tr> in thead).
		const colHeaderRow = this.thead ? this.thead.querySelector('tr:last-child') : null;
		this.ths = colHeaderRow ? Array.from(colHeaderRow.querySelectorAll('th')) : [];

		this.isDataDriven = dom.hasAttribute('data-ln-table-source');
		this.name = dom.getAttribute(DOM_SELECTOR) || '';
		this.source = dom.getAttribute('data-ln-table-source') || '';

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
		this._scrollContainer = null;
		this._colgroup = null;

		const self = this;

		if (this.isDataDriven) {
			this.isLoaded = false;
			this.totalCount = 0;
			this.visibleCount = 0;
			this.currentSort = null;
			this.currentFilters = {};
			this.currentSearch = '';
			this.selectedIds = new Set();

			this._lastTotal = 0;
			this._lastFiltered = 0;
			this._filterOptions = {};
			this._filterableFields = this.ths
				.filter(function (th) {
					return th.getAttribute('data-ln-table-col') && th.querySelector('[data-ln-table-col-filter]');
				})
				.map(function (th) { return th.getAttribute('data-ln-table-col'); });

			// Footer elements
			this._totalSpan = dom.querySelector('[data-ln-table-total]');
			this._filteredSpan = dom.querySelector('[data-ln-table-filtered]');
			if (this._filteredSpan) {
				this._filteredWrap = this._filteredSpan.parentElement !== dom
					? this._filteredSpan.closest('[data-ln-table-filtered-wrap]') || this._filteredSpan.parentNode
					: null;
			}
			this._selectedSpan = dom.querySelector('[data-ln-table-selected]');
			if (this._selectedSpan) {
				this._selectedWrap = this._selectedSpan.parentElement !== dom
					? this._selectedSpan.closest('[data-ln-table-selected-wrap]') || this._selectedSpan.parentNode
					: null;
			}

			// --- Event listeners ---
			this._onSetData = function (e) {
				const detail = e.detail || {};
				self._data = detail.data || [];
				self._lastTotal = detail.total != null ? detail.total : self._data.length;
				self._lastFiltered = detail.filtered != null ? detail.filtered : self._data.length;

				self.totalCount = self._lastTotal;
				self.visibleCount = self._lastFiltered;
				self.isLoaded = true;

				dom.classList.remove('ln-table--loading');

				self._updateFilterOptions(detail.filterOptions);

				self._vStart = -1;
				self._vEnd = -1;

				self._applyFilterAndSort();
				self._render();
				self._updateFooter();

				dispatch(dom, 'ln-table:rendered', {
					table: self.name,
					total: self.totalCount,
					visible: self.visibleCount
				});
			};
			dom.addEventListener('ln-table:set-data', this._onSetData);

			this._onSetLoading = function (e) {
				const loading = e.detail && e.detail.loading;
				dom.classList.toggle('ln-table--loading', !!loading);
				if (loading) {
					self.isLoaded = false;
				}
			};
			dom.addEventListener('ln-table:set-loading', this._onSetLoading);

			// --- Sort Click ---
			this._onSortClick = function (e) {
				const btn = e.target.closest('[data-ln-table-col-sort]');
				if (!btn) return;
				const th = btn.closest('th');
				if (!th) return;
				const field = th.getAttribute('data-ln-table-col');
				if (!field) return;
				self._handleSort(field, th);
			};
			if (this.thead) {
				this.thead.addEventListener('click', this._onSortClick);
			}

			// --- Filter Click ---
			this._activeDropdown = null;
			this._onFilterClick = function (e) {
				const btn = e.target.closest('[data-ln-table-col-filter]');
				if (!btn) return;
				e.stopPropagation();
				const th = btn.closest('th');
				if (!th) return;
				const field = th.getAttribute('data-ln-table-col');
				if (!field) return;

				if (self._activeDropdown && self._activeDropdown.field === field) {
					self._closeFilterDropdown();
					return;
				}
				self._openFilterDropdown(field, th, btn);
			};
			if (this.thead) {
				this.thead.addEventListener('click', this._onFilterClick);
			}

			this._onDocClick = function () {
				if (self._activeDropdown) self._closeFilterDropdown();
			};
			document.addEventListener('click', this._onDocClick);

			// Clear all filters button
			this._onClearAll = function (e) {
				const btn = e.target.closest('[data-ln-table-clear-all]') || e.target.closest('[data-ln-data-table-clear-all]');
				if (!btn) return;
				self.currentFilters = {};
				self._updateFilterIndicators();
				dispatch(dom, 'ln-table:clear-filters', { table: self.name });
				self._requestData();
			};
			dom.addEventListener('click', this._onClearAll);

			// --- Selection ---
			this._selectable = dom.hasAttribute('data-ln-table-selectable');
			this._selectableActive = false;
			if (this._selectable) {
				this._enableSelection();
			}

			// --- Row Click & Actions ---
			this._onRowClick = function (e) {
				if (e.target.closest('[data-ln-table-row-select]')) return;
				if (e.target.closest('[data-ln-table-row-action]')) return;
				if (e.target.closest('a') || e.target.closest('button')) return;
				if (e.ctrlKey || e.metaKey || e.button === 1) return;

				const tr = e.target.closest('[data-ln-table-row]');
				if (!tr) return;

				const id = tr.getAttribute('data-ln-table-row-id');
				const record = tr._lnRecord || {};

				dispatch(dom, 'ln-table:row-click', {
					table: self.name,
					id: id,
					record: record
				});
			};
			if (this.tbody) this.tbody.addEventListener('click', this._onRowClick);

			this._onRowAction = function (e) {
				const btn = e.target.closest('[data-ln-table-row-action]');
				if (!btn) return;

				e.stopPropagation();
				const tr = btn.closest('[data-ln-table-row]');
				if (!tr) return;

				const action = btn.getAttribute('data-ln-table-row-action');
				const id = tr.getAttribute('data-ln-table-row-id');
				const record = tr._lnRecord || {};

				dispatch(dom, 'ln-table:row-action', {
					table: self.name,
					id: id,
					action: action,
					record: record
				});
			};
			if (this.tbody) this.tbody.addEventListener('click', this._onRowAction);

			// --- Search Input (resolved from the ln-search host that drives this table) ---
			// ln-table is driven by ln-search:change. We re-source _searchInput from the
			// ln-search host purely to support the value-mirror (_onSearchChange) and the
			// '/'-key focus shortcut — never as an independent search driver.
			const searchHost = document.querySelector('[data-ln-search="' + dom.id + '"]');
			if (searchHost) {
				const hostTag = searchHost.tagName;
				this._searchInput = (hostTag === 'INPUT' || hostTag === 'TEXTAREA')
					? searchHost
					: searchHost.querySelector('input[type="search"]')
						|| searchHost.querySelector('input[type="text"]')
						|| searchHost.querySelector('input');
			} else {
				this._searchInput = null;
			}

			this._onSearchChange = function (e) {
				e.preventDefault();
				self.currentSearch = e.detail.term;
				if (self._searchInput) {
					self._searchInput.value = e.detail.term;
				}
				dispatch(dom, 'ln-table:search', {
					table: self.name,
					query: self.currentSearch
				});
				self._requestData();
			};
			dom.addEventListener('ln-search:change', this._onSearchChange);

			// --- Keyboard navigation ---
			this._focusedRowIndex = -1;
			this._onKeydown = function (e) {
				if (!dom.contains(document.activeElement) && document.activeElement !== document.body) return;
				if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

				if (e.key === '/') {
					if (self._searchInput) {
						e.preventDefault();
						self._searchInput.focus();
					}
					return;
				}

				const rows = self.tbody ? Array.from(self.tbody.querySelectorAll('[data-ln-table-row]')) : [];
				if (!rows.length) return;

				switch (e.key) {
					case 'ArrowDown':
						e.preventDefault();
						self._focusedRowIndex = Math.min(self._focusedRowIndex + 1, rows.length - 1);
						self._focusRow(rows);
						break;
					case 'ArrowUp':
						e.preventDefault();
						self._focusedRowIndex = Math.max(self._focusedRowIndex - 1, 0);
						self._focusRow(rows);
						break;
					case 'Home':
						e.preventDefault();
						self._focusedRowIndex = 0;
						self._focusRow(rows);
						break;
					case 'End':
						e.preventDefault();
						self._focusedRowIndex = rows.length - 1;
						self._focusRow(rows);
						break;
					case 'Enter':
						if (self._focusedRowIndex >= 0 && self._focusedRowIndex < rows.length) {
							e.preventDefault();
							const tr = rows[self._focusedRowIndex];
							dispatch(dom, 'ln-table:row-click', {
								table: self.name,
								id: tr.getAttribute('data-ln-table-row-id'),
								record: tr._lnRecord || {}
							});
						}
						break;
					case ' ':
						if (self._selectable && self._focusedRowIndex >= 0 && self._focusedRowIndex < rows.length) {
							e.preventDefault();
							const cb = rows[self._focusedRowIndex].querySelector('[data-ln-table-row-select]');
							if (cb) {
								cb.checked = !cb.checked;
								cb.dispatchEvent(new Event('change', { bubbles: true }));
							}
						}
						break;
					case 'Escape':
						if (self._activeDropdown) {
							self._closeFilterDropdown();
						}
						break;
				}
			};
			document.addEventListener('keydown', this._onKeydown);

			// Local hydration of initial SSR rows
			if (this.tbody && this.tbody.rows.length > 0) {
				this._parseRows();
			}

			// Initial request-data
			dispatch(dom, 'ln-table:request-data', {
				table: this.name,
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});

		} else {
			// SSR Mode
			this._emptyTbodyObserver = null;

			if (this.tbody && this.tbody.rows.length > 0) {
				this._parseRows();
			} else if (this.tbody) {
				this._emptyTbodyObserver = new MutationObserver(function () {
					if (self.tbody.rows.length > 0) {
						self._emptyTbodyObserver.disconnect();
						self._emptyTbodyObserver = null;
						self._parseRows();
					}
				});
				this._emptyTbodyObserver.observe(this.tbody, { childList: true });
			}

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

			this._onColumnFilter = function (e) {
				const key = e.detail.key;
				let hasMappedColumn = false;
				for (let i = 0; i < self.ths.length; i++) {
					if (self.ths[i].getAttribute('data-ln-table-filter-col') === key) {
						hasMappedColumn = true;
						break;
					}
				}
				if (!hasMappedColumn) return;

				const values = e.detail.values;
				if (!values || values.length === 0) {
					delete self._columnFilters[key];
				} else {
					const lower = [];
					for (let i = 0; i < values.length; i++) {
						lower.push(values[i].toLowerCase());
					}
					self._columnFilters[key] = lower;
				}

				const th = self.dom.querySelector('th[data-ln-table-filter-col="' + key + '"]');
				if (th) {
					if (values && values.length > 0) {
						th.setAttribute('data-ln-table-filter-active', '');
					} else {
						th.removeAttribute('data-ln-table-filter-active');
					}
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

			this._onClear = function (e) {
				const btn = e.target.closest('[data-ln-table-clear]');
				if (!btn) return;

				self._searchTerm = '';
				const searchEl = document.querySelector('[data-ln-search="' + dom.id + '"]');
				if (searchEl) {
					const input = searchEl.tagName === 'INPUT' ? searchEl : searchEl.querySelector('input');
					if (input) input.value = '';
				}

				self._columnFilters = {};
				for (let i = 0; i < self.ths.length; i++) {
					self.ths[i].removeAttribute('data-ln-table-filter-active');
				}

				const filters = document.querySelectorAll('[data-ln-filter="' + dom.id + '"]');
				for (let i = 0; i < filters.length; i++) {
					const resetInput = filters[i].querySelector('[data-ln-filter-reset]');
					if (resetInput) {
						resetInput.checked = true;
						resetInput.dispatchEvent(new Event('change', { bubbles: true }));
					}
				}

				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				dispatch(dom, 'ln-table:filter', {
					term: '',
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('click', this._onClear);
		}

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
				const raw = readValue(td);
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

			let record = null;
			if (this.isDataDriven) {
				record = {};
				const id = tr.getAttribute('data-ln-table-row-id');
				if (id != null) record.id = id;
				
				for (let j = 0; j < ths.length; j++) {
					const field = ths[j].getAttribute('data-ln-table-col');
					if (field) {
						const cellIndex = j;
						if (cellIndex < tr.cells.length) {
							const td = tr.cells[cellIndex];
							record[field] = readValue(td);
						}
					}
				}
			}

			this._data.push({
				sortKeys: sortKeys,
				rawTexts: rawTexts,
				html: tr.outerHTML,
				searchText: searchParts.join(' '),
				id: this.isDataDriven && record ? record.id : undefined,
				...record
			});
		}

		this._filteredData = this._data.slice();
		
		if (this.isDataDriven) {
			this._lastTotal = this._data.length;
			this._lastFiltered = this._data.length;
			this.totalCount = this._data.length;
			this.visibleCount = this._data.length;
			this._updateFooter();
		}

		this._render();

		dispatch(this.dom, 'ln-table:ready', {
			total: this._data.length
		});
	};

	// ─── Filter + Sort ─────────────────────────────────────────

	_component.prototype._applyFilterAndSort = function () {
		if (this.isDataDriven) {
			const term = (this.currentSearch || '').trim().toLowerCase();
			const filters = this.currentFilters || {};
			const hasFilters = Object.keys(filters).length > 0;

			// 1. Filter
			this._filteredData = this._data.filter(function (row) {
				if (term) {
					let match = false;
					for (const key in row) {
						if (row.hasOwnProperty(key) && typeof row[key] === 'string' && key !== 'html' && key !== 'searchText') {
							if (row[key].toLowerCase().indexOf(term) !== -1) {
								match = true;
								break;
							}
						}
					}
					if (!match) return false;
				}

				if (hasFilters) {
					for (const field in filters) {
						const activeVals = filters[field];
						if (activeVals && activeVals.length > 0) {
							const val = row[field];
							const sVal = val != null ? String(val) : '';
							if (activeVals.indexOf(sVal) === -1) return false;
						}
					}
				}
				return true;
			});

			this.visibleCount = this._filteredData.length;

			// 2. Sort
			if (!this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;

			const field = this.currentSort.field;
			const direction = this.currentSort.direction;
			const multiplier = direction === 'desc' ? -1 : 1;

			let sortType = null;
			if (this.ths) {
				for (let i = 0; i < this.ths.length; i++) {
					if (this.ths[i].getAttribute('data-ln-table-col') === field) {
						sortType = this.ths[i].getAttribute(SORT_ATTR);
						break;
					}
				}
			}

			const compare = _collator
				? _collator.compare
				: function (a, b) { return a < b ? -1 : a > b ? 1 : 0; };

			this._filteredData.sort(function (a, b) {
				const valA = a[field];
				const valB = b[field];

				if (sortType === 'number' || sortType === 'date') {
					const numA = parseFloat(valA) || 0;
					const numB = parseFloat(valB) || 0;
					return (numA - numB) * multiplier;
				}

				if (typeof valA === 'number' && typeof valB === 'number') {
					return (valA - valB) * multiplier;
				}

				const strA = valA != null ? String(valA) : '';
				const strB = valB != null ? String(valB) : '';
				return compare(strA, strB) * multiplier;
			});

		} else {
			const term = this._searchTerm;
			const colFilters = this._columnFilters;
			const hasColFilters = Object.keys(colFilters).length > 0;
			const ths = this.ths;

			const colIndexByKey = {};
			if (hasColFilters) {
				for (let i = 0; i < ths.length; i++) {
					const filterKey = ths[i].getAttribute('data-ln-table-filter-col');
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
							if (idx !== undefined) {
								if (colFilters[key].indexOf(row.rawTexts[idx]) === -1) return false;
							}
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
		}
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

		if (this.isDataDriven) {
			const total = this._lastTotal;
			const filtered = this.visibleCount;

			if (total === 0) {
				this._disableVirtualScroll();
				this._showEmptyState();
				return;
			}

			if (this._filteredData.length === 0 || filtered === 0) {
				this._disableVirtualScroll();
				this._showEmptyState();
				return;
			}

			if (this._filteredData.length > VIRTUAL_THRESHOLD) {
				this._enableVirtualScroll();
				this._renderVirtual();
			} else {
				this._disableVirtualScroll();
				this._renderAll();
			}
		} else {
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
		}
	};

	_component.prototype._renderAll = function () {
		if (this.isDataDriven) {
			const data = this._filteredData;
			const frag = document.createDocumentFragment();

			for (let i = 0; i < data.length; i++) {
				const tr = this._buildRow(data[i]);
				if (!tr) break;
				frag.appendChild(tr);
			}

			this.tbody.textContent = '';
			this.tbody.appendChild(frag);

			if (this._selectable) this._updateSelectAll();
		} else {
			const html = [];
			const data = this._filteredData;
			for (let i = 0; i < data.length; i++) html.push(data[i].html);
			this.tbody.innerHTML = html.join('');
		}
	};

	// ─── Virtual scroll ────────────────────────────────────────

	_component.prototype._enableVirtualScroll = function () {
		if (this._virtual) return;
		this._virtual = true;
		this._vStart = -1;
		this._vEnd = -1;
		const self = this;

		if (!this._rowHeight) {
			if (this.isDataDriven) {
				if (this._data.length > 0) {
					const tempRow = this._buildRow(this._data[0]);
					if (tempRow) {
						this.tbody.textContent = '';
						this.tbody.appendChild(tempRow);
						this._rowHeight = tempRow.offsetHeight || 40;
						this.tbody.textContent = '';
					}
				}
			} else {
				const rows = this.tbody ? this.tbody.rows : [];
				if (rows.length > 0) {
					this._rowHeight = rows[0].offsetHeight || 40;
				}
			}
		}

		if (this.isDataDriven) {
			this._scrollContainer = _findScrollContainer(this.dom);
		} else {
			this._scrollContainer = null;
		}
		const scrollTarget = this._scrollContainer || window;

		this._scrollHandler = function () {
			if (self._rafId) return;
			self._rafId = requestAnimationFrame(function () {
				self._rafId = null;
				self._renderVirtual();
			});
		};

		scrollTarget.addEventListener('scroll', this._scrollHandler, { passive: true });
		window.addEventListener('resize', this._scrollHandler, { passive: true });
	};

	_component.prototype._disableVirtualScroll = function () {
		if (!this._virtual) return;
		this._virtual = false;

		if (this._scrollHandler) {
			const scrollTarget = this._scrollContainer || window;
			scrollTarget.removeEventListener('scroll', this._scrollHandler);
			window.removeEventListener('resize', this._scrollHandler);
			this._scrollHandler = null;
		}
		this._scrollContainer = null;
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

		const theadH = this.thead ? this.thead.offsetHeight : 0;
		const sc = this._scrollContainer;
		let scrollIntoData;
		let viewportH;

		if (sc) {
			const tableRect = this.table.getBoundingClientRect();
			const scRect = sc.getBoundingClientRect();
			const dataStartInContainer = (tableRect.top - scRect.top) + sc.scrollTop + theadH;
			scrollIntoData = sc.scrollTop - dataStartInContainer;
			viewportH = sc.clientHeight;
		} else {
			const tableRect = this.table.getBoundingClientRect();
			const tableTopInPage = tableRect.top + window.scrollY;
			const dataStartInPage = tableTopInPage + theadH;
			scrollIntoData = window.scrollY - dataStartInPage;
			viewportH = window.innerHeight;
		}

		let startRow = Math.max(0, Math.floor(scrollIntoData / rowH) - BUFFER_ROWS);
		startRow = Math.min(startRow, total);
		const endRow = Math.min(startRow + Math.ceil(viewportH / rowH) + (BUFFER_ROWS * 2), total);

		if (startRow === this._vStart && endRow === this._vEnd) return;
		this._vStart = startRow;
		this._vEnd = endRow;

		const colSpan = this.ths.length || 1;
		const topH = startRow * rowH;
		const bottomH = (total - endRow) * rowH;

		if (this.isDataDriven) {
			const frag = document.createDocumentFragment();

			if (topH > 0) {
				const topSpacer = document.createElement('tr');
				topSpacer.className = 'ln-table__spacer';
				topSpacer.setAttribute('aria-hidden', 'true');
				const topTd = document.createElement('td');
				topTd.setAttribute('colspan', colSpan);
				topTd.style.height = topH + 'px';
				topSpacer.appendChild(topTd);
				frag.appendChild(topSpacer);
			}

			for (let i = startRow; i < endRow; i++) {
				const tr = this._buildRow(data[i]);
				if (tr) frag.appendChild(tr);
			}

			if (bottomH > 0) {
				const bottomSpacer = document.createElement('tr');
				bottomSpacer.className = 'ln-table__spacer';
				bottomSpacer.setAttribute('aria-hidden', 'true');
				const bottomTd = document.createElement('td');
				bottomTd.setAttribute('colspan', colSpan);
				bottomTd.style.height = bottomH + 'px';
				bottomSpacer.appendChild(bottomTd);
				frag.appendChild(bottomSpacer);
			}

			this.tbody.textContent = '';
			this.tbody.appendChild(frag);

			if (this._selectable) this._updateSelectAll();
		} else {
			let html = '';

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
		}
	};

	// ─── Empty state ───────────────────────────────────────────

	_component.prototype._showEmptyState = function () {
		const colSpan = this.ths.length || 1;
		this.tbody.textContent = '';

		let clone = null;
		
		if (this.isDataDriven) {
			const total = this._lastTotal != null ? this._lastTotal : this._data.length;
			const filtered = this.visibleCount;
			const isFiltered = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (filtered < total || filtered === 0);

			const templateName = isFiltered ? (this.name + '-empty-filtered') : (this.name + '-empty');
			clone = cloneTemplateScoped(this.dom, templateName, 'ln-table');

			if (!clone) {
				const genericTpl = this.dom.querySelector('template[data-ln-table-empty]');
				if (genericTpl) {
					const whenVal = isFiltered ? 'search' : 'initial';
					const subEl = genericTpl.content.querySelector('[data-ln-table-empty-when="' + whenVal + '"]')
						|| genericTpl.content.firstElementChild;
					if (subEl) {
						clone = document.importNode(subEl, true);
					}
				}
			}

			if (clone) {
				if (clone.tagName === 'TR') {
					this.tbody.appendChild(clone);
				} else {
					const td = document.createElement('td');
					td.setAttribute('colspan', String(colSpan));
					td.appendChild(clone);
					const tr = document.createElement('tr');
					tr.className = 'ln-table__empty';
					tr.appendChild(td);
					this.tbody.appendChild(tr);
				}
			}
		} else {
			const tpl = this.dom.querySelector('template[' + EMPTY_TEMPLATE + ']');
			const td = document.createElement('td');
			td.setAttribute('colspan', String(colSpan));
			if (tpl) td.appendChild(document.importNode(tpl.content, true));

			const tr = document.createElement('tr');
			tr.className = 'ln-table__empty';
			tr.appendChild(td);
			this.tbody.appendChild(tr);
		}

		dispatch(this.dom, 'ln-table:empty', {
			term: this.isDataDriven ? (this.currentSearch || '') : this._searchTerm,
			total: this.isDataDriven ? (this._lastTotal != null ? this._lastTotal : this._data.length) : this._data.length
		});
	};

	// ─── Templating / Row helpers ──────────────────────────────

	_component.prototype._fillRow = function (tr, record) {
		fillTemplate(tr, record);

		const cellAttrs = tr.querySelectorAll('[data-ln-table-cell-attr]');
		for (let i = 0; i < cellAttrs.length; i++) {
			const el = cellAttrs[i];
			const pairs = el.getAttribute('data-ln-table-cell-attr').split(',');
			for (let j = 0; j < pairs.length; j++) {
				const parts = pairs[j].trim().split(':');
				if (parts.length !== 2) continue;
				const field = parts[0].trim();
				const attr = parts[1].trim();
				if (record[field] != null) {
					el.setAttribute(attr, record[field]);
				}
			}
		}
	};

	_component.prototype._buildRow = function (record) {
		const clone = cloneTemplateScoped(this.dom, this.name + '-row', 'ln-table');
		if (!clone) return null;

		const tr = clone.querySelector('[data-ln-table-row]') || clone.firstElementChild;
		if (!tr) return null;

		this._fillRow(tr, record);

		tr._lnRecord = record;
		if (record.id != null) {
			tr.setAttribute('data-ln-table-row-id', record.id);
		}

		if (this._selectable && record.id != null && this.selectedIds.has(String(record.id))) {
			tr.classList.add('ln-row-selected');
			const rowCb = tr.querySelector('[data-ln-table-row-select]');
			if (rowCb) rowCb.checked = true;
		}

		return tr;
	};

	// ─── Filter Helpers ────────────────────────────────────────

	_component.prototype._updateFilterOptions = function (authoritative) {
		if (authoritative !== null && typeof authoritative === 'object' && !Array.isArray(authoritative)) {
			const keys = Object.keys(authoritative);
			for (let i = 0; i < keys.length; i++) {
				const field = keys[i];
				const vals = authoritative[field];
				if (!Array.isArray(vals)) continue;
				const seen = {};
				const unique = [];
				for (let j = 0; j < vals.length; j++) {
					const entry = vals[j];
					if (entry !== null && typeof entry === 'object' && 'value' in entry) {
						// {value, label} object — preserve as-is, dedup by String(value)
						const key = String(entry.value);
						if (!seen[key]) { seen[key] = true; unique.push(entry); }
					} else {
						// plain string (existing behavior)
						const s = String(entry);
						if (!seen[s]) { seen[s] = true; unique.push(s); }
					}
				}
				unique.sort(function (a, b) {
					const la = (a !== null && typeof a === 'object') ? (a.label != null ? a.label : String(a.value)) : a;
					const lb = (b !== null && typeof b === 'object') ? (b.label != null ? b.label : String(b.value)) : b;
					return la < lb ? -1 : la > lb ? 1 : 0;
				});
				this._filterOptions[field] = unique;
			}
		} else {
			const fields = this._filterableFields;
			const data = this._data;
			for (let fi = 0; fi < fields.length; fi++) {
				const field = fields[fi];
				if (!this._filterOptions[field]) this._filterOptions[field] = [];
				const existing = this._filterOptions[field];
				const seen = {};
				for (let k = 0; k < existing.length; k++) { seen[existing[k]] = true; }
				for (let i = 0; i < data.length; i++) {
					const val = data[i][field];
					if (val != null) {
						const s = String(val);
						if (!seen[s]) { seen[s] = true; existing.push(s); }
					}
				}
				existing.sort();
			}
		}
	};

	_component.prototype._getUniqueValues = function (field) {
		return (this._filterOptions[field] || []).slice();
	};

	_component.prototype._updateFilterIndicators = function () {
		const ths = this.ths;
		for (let i = 0; i < ths.length; i++) {
			const th = ths[i];
			const field = th.getAttribute('data-ln-table-col');
			if (!field) continue;
			const btn = th.querySelector('[data-ln-table-col-filter]');
			if (!btn) continue;
			const hasFilter = this.currentFilters[field] && this.currentFilters[field].length > 0;
			btn.classList.toggle('ln-filter-active', !!hasFilter);
		}
	};

	_component.prototype._applyFilterMutualExclusion = function (cb, optionsList) {
		const isReset = cb.hasAttribute('data-ln-filter-reset');
		const resetCb = optionsList.querySelector('[data-ln-filter-reset]');
		const valueCbs = optionsList.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');

		if (isReset) {
			cb.checked = true;
			for (let i = 0; i < valueCbs.length; i++) valueCbs[i].checked = false;
		} else if (cb.checked) {
			if (resetCb) resetCb.checked = false;
		} else {
			let any = false;
			for (let i = 0; i < valueCbs.length; i++) {
				if (valueCbs[i].checked) { any = true; break; }
			}
			if (!any && resetCb) resetCb.checked = true;
		}
	};

	_component.prototype._onFilterChange = function (field, optionsList) {
		const resetCb = optionsList.querySelector('[data-ln-filter-reset]');
		const valueCbs = optionsList.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
		const checked = [];

		for (let i = 0; i < valueCbs.length; i++) {
			if (valueCbs[i].checked) checked.push(valueCbs[i].value);
		}

		const isReset = (resetCb && resetCb.checked) || checked.length === 0;
		if (isReset) {
			delete this.currentFilters[field];
		} else {
			this.currentFilters[field] = checked;
		}

		this._updateFilterIndicators();

		dispatch(this.dom, 'ln-table:filter', {
			table: this.name,
			field: field,
			values: isReset ? [] : checked
		});

		this._requestData();
	};

	_component.prototype._openFilterDropdown = function (field, th, btn) {
		this._closeFilterDropdown();

		const clone = cloneTemplateScoped(this.dom, this.name + '-column-filter', 'ln-table')
			|| cloneTemplateScoped(this.dom, 'column-filter', 'ln-table');
		if (!clone) return;

		const dropdown = clone.firstElementChild;
		if (!dropdown) return;

		const uniqueValues = this._getUniqueValues(field);
		const optionsList = dropdown.querySelector('[data-ln-filter-options]');
		const searchInput = dropdown.querySelector('[data-ln-filter-search]');
		const activeValues = this.currentFilters[field] || [];
		const self = this;

		if (searchInput && uniqueValues.length <= 8) {
			searchInput.classList.add('hidden');
		}

		if (optionsList) {
			const resetCheckbox = optionsList.querySelector('[data-ln-filter-reset]');
			if (resetCheckbox) {
				resetCheckbox.checked = activeValues.length === 0;
			}

			const itemTmpl = cloneTemplateScoped(dropdown, this.name + '-column-filter-item', 'ln-table')
				|| cloneTemplateScoped(dropdown, 'column-filter-item', 'ln-table');

			if (itemTmpl) {
				for (let i = 0; i < uniqueValues.length; i++) {
					const entry = uniqueValues[i];
					const optVal = (entry !== null && typeof entry === 'object') ? entry.value : entry;
					const optLabel = (entry !== null && typeof entry === 'object') ? (entry.label != null ? entry.label : String(entry.value)) : entry;
					const itemClone = itemTmpl.cloneNode(true);
					fill(itemClone, { value: optLabel });

					const checkbox = itemClone.querySelector('input[type="checkbox"]');
					if (checkbox) {
						checkbox.value = String(optVal);
						checkbox.checked = activeValues.length > 0 && activeValues.indexOf(String(optVal)) !== -1;
					}
					optionsList.appendChild(itemClone);
				}
			}

			optionsList.addEventListener('change', function (e) {
				if (e.target.type !== 'checkbox') return;
				self._applyFilterMutualExclusion(e.target, optionsList);
				self._onFilterChange(field, optionsList);
			});
		}

		if (searchInput) {
			searchInput.addEventListener('input', function () {
				const term = searchInput.value.toLowerCase();
				const items = optionsList.querySelectorAll('li');
				for (let i = 0; i < items.length; i++) {
					const text = items[i].textContent.toLowerCase();
					items[i].classList.toggle('hidden', term && text.indexOf(term) === -1);
				}
			});
		}

		th.appendChild(dropdown);

		this._activeDropdown = { field: field, th: th, el: dropdown };

		dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
	};

	_component.prototype._closeFilterDropdown = function () {
		if (!this._activeDropdown) return;
		if (this._activeDropdown.el && this._activeDropdown.el.parentNode) {
			this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el);
		}
		this._activeDropdown = null;
	};

	// ─── Sort Helpers ──────────────────────────────────────────

	_component.prototype._handleSort = function (field, th) {
		let newDir;

		if (!this.currentSort || this.currentSort.field !== field) {
			newDir = 'asc';
		} else if (this.currentSort.direction === 'asc') {
			newDir = 'desc';
		} else {
			newDir = null;
		}

		for (let i = 0; i < this.ths.length; i++) {
			this.ths[i].classList.remove('ln-sort-asc', 'ln-sort-desc');
		}

		if (newDir) {
			this.currentSort = { field: field, direction: newDir };
			th.classList.add(newDir === 'asc' ? 'ln-sort-asc' : 'ln-sort-desc');
		} else {
			this.currentSort = null;
		}

		dispatch(this.dom, 'ln-table:sort', {
			table: this.name,
			field: field,
			direction: newDir
		});

		this._requestData();
	};

	_component.prototype._requestData = function () {
		requestData(this, 'ln-table:request-data', 'table');
	};

	// ─── Selection Helpers ─────────────────────────────────────

	_component.prototype._updateSelectAll = function () {
		if (!this._selectAllCheckbox || !this.tbody) return;
		const rows = this.tbody.querySelectorAll('[data-ln-table-row]');
		let allSelected = rows.length > 0;
		for (let i = 0; i < rows.length; i++) {
			const id = rows[i].getAttribute('data-ln-table-row-id');
			if (id != null && !this.selectedIds.has(id)) {
				allSelected = false;
				break;
			}
		}
		this._selectAllCheckbox.checked = allSelected;
	};

	Object.defineProperty(_component.prototype, 'selectedCount', {
		get: function () { return this.selectedIds.size; },
		set: function () { /* computed from selectedIds */ }
	});

	_component.prototype._enableSelection = function () {
		if (this._selectableActive) return;
		this._selectableActive = true;

		const self = this;
		this._onSelectionChange = function (e) {
			const checkbox = e.target.closest('[data-ln-table-row-select]');
			if (!checkbox) return;
			const tr = checkbox.closest('[data-ln-table-row]');
			if (!tr) return;
			const id = tr.getAttribute('data-ln-table-row-id');
			if (id == null) return;

			if (checkbox.checked) {
				self.selectedIds.add(id);
				tr.classList.add('ln-row-selected');
			} else {
				self.selectedIds.delete(id);
				tr.classList.remove('ln-row-selected');
			}

			self.selectedCount = self.selectedIds.size;
			self._updateSelectAll();
			self._updateFooter();

			dispatch(self.dom, 'ln-table:select', {
				table: self.name,
				selectedIds: self.selectedIds,
				count: self.selectedCount
			});
		};
		if (this.tbody) this.tbody.addEventListener('change', this._onSelectionChange);

		this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]')
			|| this.dom.querySelector('[data-ln-table-col-select]');
		if (this._selectAllCheckbox && this._selectAllCheckbox.tagName === 'TH') {
			const cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.setAttribute('aria-label', 'Select all');
			this._selectAllCheckbox.appendChild(cb);
			this._selectAllCheckbox = cb;
		}

		if (this._selectAllCheckbox) {
			this._onSelectAll = function () {
				const checked = self._selectAllCheckbox.checked;
				const rows = self.tbody ? self.tbody.querySelectorAll('[data-ln-table-row]') : [];

				for (let i = 0; i < rows.length; i++) {
					const id = rows[i].getAttribute('data-ln-table-row-id');
					const rowCb = rows[i].querySelector('[data-ln-table-row-select]');
					if (id == null) continue;

					if (checked) {
						self.selectedIds.add(id);
						rows[i].classList.add('ln-row-selected');
					} else {
						self.selectedIds.delete(id);
						rows[i].classList.remove('ln-row-selected');
					}
					if (rowCb) rowCb.checked = checked;
				}

				self.selectedCount = self.selectedIds.size;
				dispatch(self.dom, 'ln-table:select-all', {
					table: self.name,
					selected: checked
				});
				dispatch(self.dom, 'ln-table:select', {
					table: self.name,
					selectedIds: self.selectedIds,
					count: self.selectedCount
				});
				self._updateFooter();
			};
			this._selectAllCheckbox.addEventListener('change', this._onSelectAll);
		}

		if (this.tbody) {
			const rows = this.tbody.querySelectorAll('[data-ln-table-row]');
			for (let i = 0; i < rows.length; i++) {
				const cb = rows[i].querySelector('[data-ln-table-row-select]');
				const id = rows[i].getAttribute('data-ln-table-row-id');
				if (cb && cb.checked && id != null) {
					this.selectedIds.add(id);
					rows[i].classList.add('ln-row-selected');
				}
			}
			this.selectedCount = this.selectedIds.size;
			if (this.selectedCount > 0) this._updateSelectAll();
		}
	};

	_component.prototype._disableSelection = function () {
		if (!this._selectableActive) return;
		this._selectableActive = false;

		if (this.tbody && this._onSelectionChange) {
			this.tbody.removeEventListener('change', this._onSelectionChange);
		}
		if (this._selectAllCheckbox && this._onSelectAll) {
			this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);
		}

		const th = this.dom.querySelector('[data-ln-table-col-select]');
		if (th) {
			const cb = th.querySelector('input[type="checkbox"]');
			if (cb) {
				cb.remove();
			}
		}
		this._selectAllCheckbox = null;

		this.selectedIds.clear();
		this.selectedCount = 0;

		if (this.tbody) {
			const rows = this.tbody.querySelectorAll('[data-ln-table-row]');
			for (let i = 0; i < rows.length; i++) {
				rows[i].classList.remove('ln-row-selected');
				const cb = rows[i].querySelector('[data-ln-table-row-select]');
				if (cb) cb.checked = false;
			}
		}

		this._updateFooter();
	};

	// ─── Footer Helpers ────────────────────────────────────────

	_component.prototype._updateFooter = function () {
		if (!this.isDataDriven) return;
		const total = this._lastTotal != null ? this._lastTotal : this._data.length;
		const filtered = this.visibleCount;
		const isFiltered = filtered < total;

		if (this._totalSpan) {
			this._totalSpan.textContent = _formatNum(total);
		}

		if (this._filteredSpan) {
			this._filteredSpan.textContent = isFiltered ? _formatNum(filtered) : '';
		}

		if (this._filteredWrap) {
			this._filteredWrap.classList.toggle('hidden', !isFiltered);
		}

		if (this._selectedSpan) {
			const count = this.selectedIds.size;
			this._selectedSpan.textContent = count > 0 ? _formatNum(count) : '';
			if (this._selectedWrap) {
				this._selectedWrap.classList.toggle('hidden', count === 0);
			}
		}
	};

	// ─── Keyboard Focus Helpers ────────────────────────────────

	_component.prototype._focusRow = function (rows) {
		for (let i = 0; i < rows.length; i++) {
			rows[i].classList.remove('ln-row-focused');
			rows[i].removeAttribute('tabindex');
		}

		if (this._focusedRowIndex >= 0 && this._focusedRowIndex < rows.length) {
			const row = rows[this._focusedRowIndex];
			row.classList.add('ln-row-focused');
			row.setAttribute('tabindex', '0');
			row.focus();
			row.scrollIntoView({ block: 'nearest' });
		}
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._disableVirtualScroll();

		if (this.isDataDriven) {
			this.dom.removeEventListener('ln-table:set-data', this._onSetData);
			this.dom.removeEventListener('ln-table:set-loading', this._onSetLoading);
			if (this.thead) {
				this.thead.removeEventListener('click', this._onSortClick);
				this.thead.removeEventListener('click', this._onFilterClick);
			}
			document.removeEventListener('click', this._onDocClick);
			document.removeEventListener('keydown', this._onKeydown);
if (this._onSearchChange) this.dom.removeEventListener('ln-search:change', this._onSearchChange);
			if (this.tbody) {
				this.tbody.removeEventListener('click', this._onRowClick);
				this.tbody.removeEventListener('click', this._onRowAction);
			}
			if (this._onSelectionChange && this.tbody) this.tbody.removeEventListener('change', this._onSelectionChange);
			if (this._selectAllCheckbox && this._onSelectAll) this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);
			this.dom.removeEventListener('click', this._onClearAll);

			this._closeFilterDropdown();
		} else {
			if (this._emptyTbodyObserver) {
				this._emptyTbodyObserver.disconnect();
				this._emptyTbodyObserver = null;
			}
			this.dom.removeEventListener('ln-search:change', this._onSearch);
			this.dom.removeEventListener('ln-table:sort', this._onSort);
			this.dom.removeEventListener('ln-filter:changed', this._onColumnFilter);
			this.dom.removeEventListener('click', this._onClear);
		}

		if (this._colgroup) {
			this._colgroup.remove();
			this._colgroup = null;
		}
		if (this.table) this.table.style.tableLayout = '';
		this._data = [];
		this._filteredData = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table');
})();
