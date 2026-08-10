import { cloneTemplateScoped, dispatch, requestData, fill, fillTemplate, registerComponent, readValue, createWindowCache, createBatcher, getLocale, detectValueType, compareValues } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table';
	const DOM_ATTRIBUTE = 'lnTable';
	const EMPTY_TEMPLATE = 'data-ln-table-empty';
	// Tuning constant — duplicated in ln-data-table for component independence
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;
	const WINDOW_DEFAULT = 1000;
	const WINDOW_PAGE = 200;
	const FETCH_DEBOUNCE = 120;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Singleton — same lang for all table instances on the page
	const _collator = typeof Intl !== 'undefined'
		? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
		: null;

	function _formatNum(n, dom) {
		if (n == null || isNaN(n)) return '';
		try {
			return new Intl.NumberFormat(getLocale(dom)).format(n);
		} catch (e) {
			return String(n);
		}
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

		// Footer elements — both modes
		this._totalSpan = dom.querySelector('[data-ln-table-total]');
		this._filteredSpan = dom.querySelector('[data-ln-table-filtered]');
		if (this._filteredSpan) {
			this._filteredWrap = this._filteredSpan.parentElement !== dom
				? this._filteredSpan.parentElement
				: null;
		}
		this._selectedSpan = dom.querySelector('[data-ln-table-selected]');
		if (this._selectedSpan) {
			this._selectedWrap = this._selectedSpan.parentElement !== dom
				? this._selectedSpan.parentElement
				: null;
		}

		this.isDataDriven = dom.hasAttribute('data-ln-table-source');
		this.name = dom.getAttribute(DOM_SELECTOR) || '';
		this.source = dom.getAttribute('data-ln-table-source') || '';

		this._data = [];
		this._filteredData = [];
		this._searchTerm = '';
		this._sortCol = -1;
		this._sortDir = null;
		this._columnFilters = {};
		this.selectedIds = new Set();

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

		// --- Layer 1 Command / Request Event Handlers ---

		this._onSetSearch = function (e) {
			const term = (e.detail && e.detail.query != null ? e.detail.query : (e.detail && e.detail.term != null ? e.detail.term : '')).trim();
			if (self.isDataDriven) {
				self.currentSearch = term;
				dispatch(dom, 'ln-table:search', {
					table: self.name,
					query: self.currentSearch
				});
				self._requestData();
			} else {
				self._searchTerm = term.toLowerCase();
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-table:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._data.length
				});
			}
		};
		dom.addEventListener('ln-table:set-search', this._onSetSearch);

		this._onSetFilter = function (e) {
			if (!e.detail) return;
			const key = e.detail.key;
			const values = e.detail.values;

			if (self.isDataDriven) {
				if (!values || values.length === 0) {
					delete self.currentFilters[key];
				} else {
					self.currentFilters[key] = values;
				}
				self._requestData();
			} else {
				if (!values || values.length === 0) {
					delete self._columnFilters[key];
				} else {
					const lower = [];
					for (let i = 0; i < values.length; i++) {
						lower.push(values[i].toLowerCase());
					}
					self._columnFilters[key] = lower;
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
			}
		};
		dom.addEventListener('ln-table:set-filter', this._onSetFilter);

		this._onRequestClearFilters = function () {
			if (self.isDataDriven) {
				self.currentFilters = {};
				self.currentSearch = '';
				dispatch(dom, 'ln-table:clear-filters', { table: self.name });
				self._requestData();
			} else {
				self._searchTerm = '';
				self._columnFilters = {};
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-table:filter', {
					term: '',
					matched: self._filteredData.length,
					total: self._data.length
				});
			}
		};
		dom.addEventListener('ln-table:request-clear-filters', this._onRequestClearFilters);

		// --- Selection (both modes) ---
		this._selectable = dom.hasAttribute('data-ln-table-selectable');
		this._selectableActive = false;
		if (this._selectable) {
			this._enableSelection();
		}

		if (this.isDataDriven) {
			this.isLoaded = false;
			this.totalCount = 0;
			this.visibleCount = 0;
			this.currentSort = null;
			this.currentFilters = {};
			this.currentSearch = '';

			this._lastTotal = 0;
			this._lastFiltered = 0;

			// Windowed (sliding-window) server-side virtualization — opt-in
			this._windowed = false;
			this._cache = null;
			if (this.isDataDriven && dom.hasAttribute('data-ln-table-window')) this._enterWindowedMode();

			// --- Event listeners ---
			this._onSetData = function (e) {
				const detail = e.detail || {};
				if (self._windowed) {
					dom.classList.remove('ln-table--loading');
					self._cache.ingest(detail);
					return;
				}
				self._data = detail.data || [];
				self._lastTotal = detail.total != null ? detail.total : self._data.length;
				self._lastFiltered = detail.filtered != null ? detail.filtered : self._data.length;

				self.totalCount = self._lastTotal;
				self.visibleCount = self._lastFiltered;
				self.isLoaded = true;

				dom.classList.remove('ln-table--loading');

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

			// --- Sort ---
			this._onSort = function (e) {
				e.preventDefault();
				self.currentSort = e.detail.direction === 'none' ? null : { field: e.detail.field, direction: e.detail.direction };
				self._requestData();
			};
			dom.addEventListener('ln-sort:change', this._onSort);

			// D4 — windowed tables cannot select rows they have never fetched
			if (this._windowed && this._selectable && this._selectAllCheckbox) {
				this._selectAllCheckbox.classList.add('hidden');
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

			// --- Keyboard navigation (tbody rows) ---
			this._focusedRowIndex = -1;
			this._onKeydown = function (e) {
				if (!dom.contains(document.activeElement) && document.activeElement !== document.body) return;
				if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

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
				}
			};
			document.addEventListener('keydown', this._onKeydown);

			// Local hydration of initial SSR rows
			if (this.tbody && this.tbody.rows.length > 0) {
				this._parseRows();
			}

			// Initial request-data
			if (this._windowed) {
				this._kickWindowInitial();
			} else {
				dispatch(dom, 'ln-table:request-data', {
					table: this.name,
					sort: this.currentSort,
					filters: this.currentFilters,
					search: this.currentSearch
				});
			}

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

			this._onSort = function (e) {
				e.preventDefault();
				const direction = e.detail.direction === 'none' ? null : e.detail.direction;
				self._sortCol = direction === null ? -1 : e.detail.column;
				self._sortDir = direction;
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
			dom.addEventListener('ln-sort:change', this._onSort);
		}

		return this;
	}

	// ─── Parse rows into in-memory array ───────────────────────

	_component.prototype._parseRows = function () {
		const rows = this.tbody.rows;
		const ths = this.ths;
		this._data = [];

		if (rows.length > 0) this._rowHeight = rows[0].offsetHeight || 40;
		this._lockColumnWidths();

		for (let i = 0; i < rows.length; i++) {
			const tr = rows[i];
			const values = [];
			const rawTexts = [];
			const searchParts = [];

			for (let j = 0; j < tr.cells.length; j++) {
				const td = tr.cells[j];
				const text = td.textContent.trim();

				values[j] = readValue(td);
				rawTexts[j] = text.toLowerCase();

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
				values: values,
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

			const values = this._filteredData.map(function (row) { return row[field]; });
			const type = detectValueType(values);

			this._filteredData.sort(function (a, b) {
				return compareValues(a[field], b[field], type, _collator) * multiplier;
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
			const values = this._filteredData.map(function (row) { return row.values[colIndex]; });
			const type = detectValueType(values);

			this._filteredData.sort(function (a, b) {
				return compareValues(a.values[colIndex], b.values[colIndex], type, _collator) * multiplier;
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
			if (this._windowed) { this._renderWindowed(); return; }
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
			if (this._selectable) this._restoreSelection();
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
			if (this._windowed) {
				let tempRow = null;
				const sample = this._cache.peek();
				if (sample) {
					tempRow = this._buildRow(sample);
				} else {
					tempRow = this._buildPlaceholderRow();
				}
				if (tempRow) {
					this.tbody.textContent = '';
					this.tbody.appendChild(tempRow);
					this._rowHeight = tempRow.offsetHeight || 40;
					this.tbody.textContent = '';
				}
			} else if (this.isDataDriven) {
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
				self._windowed ? self._renderWindowed() : self._renderVirtual();
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
			if (this._selectable) this._restoreSelection();
		}
	};

	// ─── Windowed virtualization (opt-in sliding window) ───────

	_component.prototype._buildPlaceholderRow = function () {
		const tr = document.createElement('tr');
		tr.className = 'ln-table__placeholder';
		tr.setAttribute('aria-hidden', 'true');
		const td = document.createElement('td');
		td.setAttribute('colspan', this.ths.length || 1);
		td.style.height = this._rowHeight + 'px';
		tr.appendChild(td);
		return tr;
	};

	_component.prototype._renderWindowed = function () {
		if (this.isLoaded && this._cache.logicalTotal === 0) {
			this._disableVirtualScroll();
			this._showEmptyState();
			return;
		}

		if (!this._virtual) this._enableVirtualScroll();

		const rowH = this._rowHeight;
		if (!rowH) return;

		const total = this._cache.logicalTotal;
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

		const colSpan = this.ths.length || 1;
		const topH = startRow * rowH;
		const bottomH = (total - endRow) * rowH;

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
			if (this._cache.has(i)) {
				const tr = this._buildRow(this._cache.get(i));
				if (tr) frag.appendChild(tr);
			} else {
				frag.appendChild(this._buildPlaceholderRow());
			}
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

		// Select-all is disabled in windowed mode (D4) — no _updateSelectAll() call.
		this._vStart = startRow;
		this._vEnd = endRow;

		this._cache.ensure(startRow, endRow);
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

	_component.prototype._requestData = function () {
		if (this._windowed) {
			this.dom.classList.add('ln-table--loading');
			this._cache.invalidate({
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});
			return;
		}
		requestData(this, 'ln-table:request-data', 'table');
	};

	// ─── Windowed Mode — enter/exit/seed (live toggle) ──────────

	_component.prototype._enterWindowedMode = function () {
		const self = this;
		const dom = this.dom;
		const winAttr = parseInt(dom.getAttribute('data-ln-table-window'), 10);
		const pageAttr = parseInt(dom.getAttribute('data-ln-table-window-page'), 10);
		const threshAttr = parseInt(dom.getAttribute('data-ln-table-window-threshold'), 10);

		// Cache change → sync totals off the cache, re-render (pull), notify.
		this._onCacheChange = function () {
			if (!self._windowed || !self._cache) return;
			self.totalCount = self._cache.grandTotal;
			self.visibleCount = self._cache.logicalTotal;
			self._lastTotal = self._cache.grandTotal;
			self.isLoaded = true;
			self._vStart = -1;
			self._vEnd = -1;
			self._render();
			self._updateFooter();
			dispatch(dom, 'ln-table:rendered', {
				table: self.name,
				total: self.totalCount,
				visible: self.visibleCount
			});
		};
		this._renderBatch = createBatcher(this._onCacheChange);

		this._cache = createWindowCache({
			windowSize: winAttr > 0 ? winAttr : WINDOW_DEFAULT,
			pageSize: pageAttr > 0 ? pageAttr : WINDOW_PAGE,
			threshold: threshAttr >= 0 ? threshAttr : 25,
			fetchDebounce: FETCH_DEBOUNCE,
			requestPage: function (query, offset, limit) {
				dispatch(dom, 'ln-table:request-data', {
					table: self.name,
					sort: query.sort,
					filters: query.filters,
					search: query.search,
					offset: offset,
					limit: limit,
					queryGen: self._cache.queryGen
				});
			},
			onChange: this._renderBatch
		});

		this._windowed = true;

		// D4 — windowed tables cannot select rows they have never fetched
		if (this._selectable && this._selectAllCheckbox) {
			this._selectAllCheckbox.classList.add('hidden');
		}
	};

	_component.prototype._kickWindowInitial = function () {
		if (this._data.length > 0) {
			// SSR-seeded / warm-seeded: page 0 is already resident, the grand
			// total is declared in markup — no initial fetch needed. No
			// queryGen on the seed — it must never be dropped as stale.
			let declaredTotal = parseInt(this.dom.getAttribute('data-ln-table-count'), 10);
			if (isNaN(declaredTotal) && this._totalSpan) {
				const spanText = this._totalSpan.textContent.replace(/[^\d]/g, '');
				if (spanText) declaredTotal = parseInt(spanText, 10);
			}
			const seedTotal = (declaredTotal > 0) ? declaredTotal : this._data.length;
			this._cache.ingest({
				data: this._data,
				offset: 0,
				total: seedTotal,
				filtered: seedTotal
			});
		} else {
			this.dom.classList.add('ln-table--loading');
			this._cache.requestInitial({
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});
		}
	};

	_component.prototype._exitWindowedMode = function () {
		this._disableVirtualScroll();
		if (this._cache) this._cache.destroy();
		this._cache = null;
		this._windowed = false;
		this._renderBatch = null;
		this._onCacheChange = null;
		if (this._selectAllCheckbox) {
			this._selectAllCheckbox.classList.remove('hidden');
		}
		this._rowHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._data = [];
		this._filteredData = [];
		this.dom.classList.add('ln-table--loading');
		this._requestData();
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

	// SSR re-render replays cached row HTML — reapply live selection state.
	_component.prototype._restoreSelection = function () {
		if (!this.tbody) return;
		const rows = this.tbody.querySelectorAll('[data-ln-table-row]');
		for (let i = 0; i < rows.length; i++) {
			const id = rows[i].getAttribute('data-ln-table-row-id');
			const selected = id != null && this.selectedIds.has(id);
			rows[i].classList.toggle('ln-row-selected', selected);
			const cb = rows[i].querySelector('[data-ln-table-row-select]');
			if (cb) cb.checked = selected;
		}
		this._updateSelectAll();
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
			const dictEl = self.dom.querySelector('[data-ln-table-dict="select-all"]');
			const label = self.dom.getAttribute('data-ln-table-select-all-label') || (dictEl ? dictEl.textContent.trim() : null) || 'Select all';
			cb.setAttribute('aria-label', label);
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
		let total = 0;
		let filtered = 0;

		if (this.isDataDriven) {
			total = this._lastTotal != null ? this._lastTotal : this._data.length;
			filtered = this.visibleCount;
		} else {
			total = this._data.length;
			filtered = this._filteredData.length;
		}

		const isFiltered = filtered < total;

		if (this._totalSpan) {
			this._totalSpan.textContent = _formatNum(total, this.dom);
		}

		if (this._filteredSpan) {
			this._filteredSpan.textContent = isFiltered ? _formatNum(filtered, this.dom) : '';
		}

		if (this._filteredWrap) {
			this._filteredWrap.classList.toggle('hidden', !isFiltered);
		}

		if (this._selectedSpan) {
			const count = this.selectedIds ? this.selectedIds.size : 0;
			this._selectedSpan.textContent = count > 0 ? _formatNum(count, this.dom) : '';
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

		this.dom.removeEventListener('ln-table:set-search', this._onSetSearch);
		this.dom.removeEventListener('ln-table:set-filter', this._onSetFilter);
		this.dom.removeEventListener('ln-table:request-clear-filters', this._onRequestClearFilters);

		if (this.isDataDriven) {
			this.dom.removeEventListener('ln-table:set-data', this._onSetData);
			this.dom.removeEventListener('ln-table:set-loading', this._onSetLoading);
			this.dom.removeEventListener('ln-sort:change', this._onSort);
			document.removeEventListener('keydown', this._onKeydown);
			if (this.tbody) {
				this.tbody.removeEventListener('click', this._onRowClick);
				this.tbody.removeEventListener('click', this._onRowAction);
			}
			if (this._cache) this._cache.destroy();
		} else {
			if (this._emptyTbodyObserver) {
				this._emptyTbodyObserver.disconnect();
				this._emptyTbodyObserver = null;
			}
			this.dom.removeEventListener('ln-sort:change', this._onSort);
		}

		if (this._onSelectionChange && this.tbody) this.tbody.removeEventListener('change', this._onSelectionChange);
		if (this._selectAllCheckbox && this._onSelectAll) this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);

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

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table', {
		extraAttributes: [
			'data-ln-table-window',
			'data-ln-table-window-page',
			'data-ln-table-window-threshold',
			'data-ln-table-count'
		],
		onAttributeChange: function (el, attrName) {
			const inst = el[DOM_ATTRIBUTE];
			if (!inst || !inst.isDataDriven) return;

			if (attrName === 'data-ln-table-window') {
				const present = el.hasAttribute('data-ln-table-window');
				if (present && !inst._windowed) {
					inst._enterWindowedMode();
					inst._kickWindowInitial();
				} else if (!present && inst._windowed) {
					inst._exitWindowedMode();
				} else if (present && inst._windowed) {
					const v = parseInt(el.getAttribute('data-ln-table-window'), 10);
					if (v > 0) inst._cache.configure({ windowSize: v });
				}
				return;
			}

			if (!inst._windowed || !inst._cache) return;
			if (attrName === 'data-ln-table-window-page') {
				const v = parseInt(el.getAttribute('data-ln-table-window-page'), 10);
				if (v > 0) inst._cache.configure({ pageSize: v });
			} else if (attrName === 'data-ln-table-window-threshold') {
				const v = parseInt(el.getAttribute('data-ln-table-window-threshold'), 10);
				if (v >= 0) inst._cache.configure({ threshold: v });
			} else if (attrName === 'data-ln-table-count') {
				const v = parseInt(el.getAttribute('data-ln-table-count'), 10);
				if (v >= 0) inst._cache.setGrandTotal(v);
			}
		}
	});
})();
