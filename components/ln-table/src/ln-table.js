import { cloneTemplateScoped, dispatch, fill, fillTemplate, readValue, detectValueType, compareValues, registerComponent, requestData, attrBool, attrStr, attrSpec, defineAttrs, createWindowCache, createBatcher } from '../../ln-core';
import { calculateSelectionState, calculateVirtualWindow, calculatePoolSize, toggleRowSelection, toggleSelectAll } from './table-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-table';
	const DOM_ATTRIBUTE = 'lnTable';
	// Tuning constant — duplicated in ln-data-table for component independence
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;
	const WINDOW_DEFAULT = 1000;
	const WINDOW_PAGE = 200;
	const WINDOW_THRESHOLD = 25;
	const FETCH_DEBOUNCE = 120;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Window attribute effects ───────────────────────────
	// The shared observer calls effect(el, name, oldValue): the first argument is the host element.
	function _applyWindow(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst || !inst.isDataDriven) return;
		const present = el.hasAttribute('data-ln-table-window');
		if (present && !inst._windowed) {
			inst._enterWindowedMode();
			inst._kickWindowInitial();
		} else if (!present && inst._windowed) {
			inst._exitWindowedMode();
		} else if (present) {
			inst._cache.configure({ windowSize: inst._windowSize });
		}
	}

	function _applyWindowPage(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst || !inst._windowed) return;
		inst._cache.configure({ pageSize: inst._windowPage });
	}

	function _applyWindowThreshold(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst || !inst._windowed) return;
		inst._cache.configure({ threshold: inst._windowThreshold });
	}

	function _applyCount(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst || !inst._windowed || !(inst._declaredTotal >= 0)) return;
		inst._cache.setGrandTotal(inst._declaredTotal);
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-table':                  { prop: 'name', type: 'string', read: attrStr, fallback: '', description: 'Table instance name or identifier' },
		'data-ln-table-source':           { prop: 'source', type: 'string', read: attrStr, fallback: '', description: 'Source store or coordinator addressing' },
		'data-ln-table-selectable':       { prop: '_selectable', type: 'boolean', read: attrBool, description: 'Enables row selection check controls' },
		'data-ln-table-row':              { type: 'marker', description: 'Table row template element' },
		'data-ln-table-row-id':           { type: 'string', description: 'Record identifier on row element' },
		'data-ln-table-row-action':       { type: 'trigger', description: 'Action trigger inside a table row' },
		'data-ln-table-row-select':       { type: 'trigger', description: 'Row selection checkbox trigger' },
		'data-ln-table-col':              { type: 'string', description: 'Column header identifier or field mapping' },
		'data-ln-table-col-select':       { type: 'trigger', description: 'Header select-all checkbox trigger' },
		'data-ln-table-cell-attr':        { type: 'string', description: 'Cell attribute template mapping' },
		'data-ln-table-select-all-label': { type: 'string', description: 'Accessibility label for select-all header trigger' },
		'data-ln-table-window':           { prop: '_windowSize',      type: 'integer', fallback: WINDOW_DEFAULT,   min: 10, effect: _applyWindow,          description: 'Opt-in server-side sliding window (data-driven mode); value is the resident-row cap' },
		'data-ln-table-window-page':      { prop: '_windowPage',      type: 'integer', fallback: WINDOW_PAGE,      min: 5,  effect: _applyWindowPage,      description: 'Rows requested per page in windowed mode' },
		'data-ln-table-window-threshold': { prop: '_windowThreshold', type: 'integer', fallback: WINDOW_THRESHOLD, min: 0,  effect: _applyWindowThreshold, description: 'Prefetch margin in rows before an unloaded page boundary in windowed mode' },
		'data-ln-table-count':            { prop: '_declaredTotal',   type: 'integer', min: 0, effect: _applyCount,                                         description: 'Declared unfiltered grand total for a windowed table' }
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// Singleton — same lang for all table instances on the page
	const _collator = typeof Intl !== 'undefined'
		? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' })
		: null;

	function _setNumberValue(el, val) {
		if (!el) return;
		if (val == null || isNaN(val)) {
			el.removeAttribute('data-ln-value');
			if ('value' in el && el.tagName === 'DATA') el.value = '';
			if (el.lnNumber) {
				el.lnNumber.value = NaN;
			} else {
				el.textContent = '';
			}
			return;
		}
		const s = String(val);
		el.setAttribute('data-ln-value', s);
		if ('value' in el && el.tagName === 'DATA') el.value = s;
		if (el.lnNumber) {
			el.lnNumber.value = val;
		} else {
			el.textContent = s;
		}
	}

	function _findScrollContainer(el, table) {
		let p = table ? table.parentElement : el;
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
		defineAttrs(this, dom, ATTR_SPEC);
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
		this._loadingIndicator = dom.querySelector('[data-ln-table-loading]');
		if (this._loadingIndicator) {
			this._loadingIndicator.classList.add('hidden');
		}

		this.isDataDriven = dom.hasAttribute('data-ln-table-source');

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
		this._resizeHandler = null;
		this._vResized = false;
		this._vTop = 0;
		this._scrollContainer = null;
		this._colgroup = null;
		this._rowPool = null;
		this._topSpacer = null;
		this._topTd = null;
		this._bottomSpacer = null;
		this._bottomTd = null;

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

		this._onSearchChange = function (e) {
			e.preventDefault();
			self._onSetSearch(e);
		};
		dom.addEventListener('ln-search:change', this._onSearchChange);

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
		this._selectableActive = false;
		if (this._selectable) {
			this._enableSelection();
		}

		if (this.isDataDriven) {
			this.isLoaded = false;
			this._initialLoaded = false;
			this.totalCount = 0;
			this.visibleCount = 0;
			this.currentSort = null;
			this.currentFilters = {};
			this.currentSearch = '';

			this._lastTotal = 0;
			this._lastFiltered = 0;
			this._hasInitialSeed = false;
			this._windowed = false;
			this._cache = null;
			if (dom.hasAttribute('data-ln-table-window')) this._enterWindowedMode();

			// --- Event listeners ---
			this._onSetData = function (e) {
				const detail = e.detail || {};
				const newData = detail.data || [];
				const newTotal = detail.total != null ? detail.total : newData.length;

				// Protect initial SSR seed rows: do not overwrite pre-rendered HTML rows with empty un-synced store payloads before initial API response arrives
				if (self._hasInitialSeed && !self.isLoaded && newData.length === 0 && newTotal === 0) {
					return;
				}

				if (self._windowed) {
					// Only an accepted page ends the refresh; a declined one leaves it running.
					if (self._cache.ingest(detail)) {
						dom.classList.remove('ln-table--loading');
						dom.setAttribute('aria-busy', 'false');
						if (self._loadingIndicator) self._loadingIndicator.classList.add('hidden');
					}
					return;
				}

				self._data = newData;
				self._lastTotal = newTotal;
				self._lastFiltered = detail.filtered != null ? detail.filtered : self._data.length;

				self.totalCount = self._lastTotal;
				self.visibleCount = self._lastFiltered;
				self.isLoaded = true;
				self._initialLoaded = true;
				self._hasInitialSeed = false;

				dom.classList.remove('ln-table--loading');
				dom.setAttribute('aria-busy', 'false');
				if (self._loadingIndicator) {
					self._loadingIndicator.classList.add('hidden');
				}

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
				const loading = !!(e.detail && e.detail.loading);
				// Windowed: a scroll page fetch is signalled by placeholder rows; a query change dims through _requestData.
				if (loading && self._windowed && self._initialLoaded) return;
				dom.classList.toggle('ln-table--loading', loading);
				dom.setAttribute('aria-busy', loading ? 'true' : 'false');
				if (loading && !self._initialLoaded) {
					self.isLoaded = false;
					self._showLoadingState();
				}
				if (self._loadingIndicator) {
					self._loadingIndicator.classList.toggle('hidden', !(loading && self._initialLoaded));
				}
			};
			dom.addEventListener('ln-table:set-loading', this._onSetLoading);

			this._onRequestRevalidate = function () {
				if (!self._windowed) return;
				self._cache.revalidate();
			};
			dom.addEventListener('ln-table:request-revalidate', this._onRequestRevalidate);

			this._onPageFailed = function (e) {
				if (!self._windowed) return;
				self._cache.release(e.detail && e.detail.offset);
			};
			dom.addEventListener('ln-table:page-failed', this._onPageFailed);

			// The source owns the query, so a query change reaches the view as a restart order,
			// not as query state: the window drops to page 0 and the composed query is resolved at serve time.
			this._onRequestInvalidate = function () {
				if (!self._windowed) return;
				self._requestData();
			};
			dom.addEventListener('ln-table:request-invalidate', this._onRequestInvalidate);

			// --- Sort ---
			this._onSort = function (e) {
				if (!e.detail || e.detail.field == null) return;
				e.preventDefault();
				self.currentSort = e.detail.direction === 'none' ? null : { field: e.detail.field, direction: e.detail.direction };
				self._requestData();
			};
			dom.addEventListener('ln-sort:change', this._onSort);

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

			// Local hydration of initial SSR rows or initial loading state
			if (this.tbody && this.tbody.rows.length > 0) {
				this._parseRows();
			} else {
				this._showLoadingState();
				dom.setAttribute('aria-busy', 'true');
			}

			// Initial request-data deferred so coordinators have attached listeners
			setTimeout(function () {
				if (!self.dom || !document.contains(self.dom)) return;
				if (self._windowed) {
					self._kickWindowInitial();
					return;
				}
				dispatch(dom, 'ln-table:request-data', {
					table: self.name,
					sort: self.currentSort,
					filters: self.currentFilters,
					search: self.currentSearch
				});
			}, 0);

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
				if (!e.detail || (e.detail.column == null && e.detail.field == null)) return;
				e.preventDefault();
				const direction = e.detail.direction === 'none' ? null : e.detail.direction;
				let colIdx = e.detail.column;
				if (colIdx == null && e.detail.field != null) {
					for (let j = 0; j < self.ths.length; j++) {
						if (self.ths[j].getAttribute('data-ln-table-col') === e.detail.field) {
							colIdx = j;
							break;
						}
					}
				}
				self._sortCol = (direction === null || colIdx == null) ? -1 : colIdx;
				self._sortDir = direction;
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				dispatch(dom, 'ln-table:sorted', {
					column: colIdx,
					direction: e.detail.direction,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-sort:change', this._onSort);

			this._onFilterChange = function (e) {
				e.preventDefault();
				if (!e.detail) return;
				const key = e.detail.key;
				const values = e.detail.values || [];
				if (!key) return;

				if (values.length === 0) {
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
				self._updateFooter();
				dispatch(dom, 'ln-table:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-filter:change', this._onFilterChange);
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

				if (!td.querySelector('[data-ln-table-row-action]')) {
					searchParts.push(text.toLowerCase());
				}
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

			const rowAttrs = {};
			for (let j = 0; j < tr.attributes.length; j++) {
				const attr = tr.attributes[j];
				if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ln-')) {
					const key = attr.name.slice(5);
					if (key) rowAttrs[key] = attr.value.toLowerCase();
				}
			}

			this._data.push({
				values: values,
				rawTexts: rawTexts,
				attrs: rowAttrs,
				html: tr.outerHTML,
				searchText: searchParts.join(' '),
				id: this.isDataDriven && record ? record.id : undefined,
				...record
			});
		}

		this._filteredData = this._data.slice();
		if (this._data.length > 0) {
			this._hasInitialSeed = true;
		}

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
			this._filteredData = this._data ? this._data.slice() : [];
			this.visibleCount = this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
			return;
		}

		const data = this._data || [];
		const term = this._searchTerm;
		const tokens = term ? term.split(/\s+/).filter(Boolean) : [];
		const filters = this._columnFilters || {};
		const filterKeys = Object.keys(filters);
		const hasFilters = filterKeys.length > 0;

		const colMap = {};
		if (hasFilters) {
			for (let k = 0; k < filterKeys.length; k++) {
				const key = filterKeys[k];
				let resolved = -1;
				for (let j = 0; j < this.ths.length; j++) {
					const th = this.ths[j];
					const colKey = th.getAttribute('data-ln-table-filter-col') ||
						th.getAttribute('data-ln-filter-col') ||
						th.getAttribute('data-ln-filter-key') ||
						th.getAttribute('data-ln-table-col');
					if (colKey === key) {
						resolved = j;
						break;
					}
				}
				colMap[key] = resolved;
			}
		}

		if (tokens.length === 0 && !hasFilters) {
			this._filteredData = data.slice();
		} else {
			this._filteredData = data.filter(function (row) {
				if (tokens.length > 0) {
					for (let t = 0; t < tokens.length; t++) {
						if (!row.searchText || row.searchText.indexOf(tokens[t]) === -1) return false;
					}
				}
				if (hasFilters) {
					for (let k = 0; k < filterKeys.length; k++) {
						const key = filterKeys[k];
						const activeVals = filters[key];
						if (!activeVals || activeVals.length === 0) continue;
						const colIdx = colMap[key];
						let matched = false;
						if (colIdx !== -1) {
							const rawText = row.rawTexts && row.rawTexts[colIdx] != null ? row.rawTexts[colIdx] : '';
							const valText = row.values && row.values[colIdx] != null ? String(row.values[colIdx]).toLowerCase() : '';
							if (activeVals.indexOf(rawText) !== -1 || activeVals.indexOf(valText) !== -1) {
								matched = true;
							}
						}
						if (!matched && row.attrs && row.attrs[key] !== undefined) {
							if (activeVals.indexOf(row.attrs[key]) !== -1) {
								matched = true;
							}
						}
						if (!matched) return false;
					}
				}
				return true;
			});
		}

		if (this._sortCol >= 0 && this._sortDir) {
			const col = this._sortCol;
			const multiplier = this._sortDir === 'desc' ? -1 : 1;
			const sampleValues = this._filteredData.map(function (r) {
				return r.values ? r.values[col] : undefined;
			});
			const valueType = detectValueType(sampleValues);
			this._filteredData.sort(function (a, b) {
				const va = a.values ? a.values[col] : undefined;
				const vb = b.values ? b.values[col] : undefined;
				return compareValues(va, vb, valueType, _collator) * multiplier;
			});
		}

		this.visibleCount = this._filteredData.length;
	};

	// ─── Column width locking ──────────────────────────────────

	_component.prototype._lockColumnWidths = function () {
		if (!this.table || !this.thead || this._colgroup) return;
		// Header row has no box (card mode, hidden ancestor): don't lock 0px columns; retried on resize.
		if (this.ths.length && !this.ths[0].offsetWidth) return;

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
		if (this._windowed) {
			this._renderWindowed();
			return;
		}

		if (this.isDataDriven) {
			const total = this._lastTotal;
			const filtered = this.visibleCount;

			if (total === 0) {
				this._disableVirtualScroll();
				if (!this.isLoaded) {
					this._showLoadingState();
					return;
				}
				this._showEmptyState();
				return;
			}

			if (this._filteredData.length === 0 || filtered === 0) {
				this._disableVirtualScroll();
				if (!this.isLoaded) {
					this._showLoadingState();
					return;
				}
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
		this._rowPool = null;
		this._topSpacer = null;
		this._topTd = null;
		this._bottomSpacer = null;
		this._bottomTd = null;

		const data = this._filteredData;

		if (this.isDataDriven || (data.length > 0 && !data[0].html)) {
			const frag = document.createDocumentFragment();

			for (let i = 0; i < data.length; i++) {
				const tr = this._buildRow(data[i]);
				if (!tr) break;
				frag.appendChild(tr);
			}

			this.tbody.replaceChildren(frag);

			if (this._selectable) this._updateSelectAll();
		} else {
			const html = [];
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
				this._rowHeight = this._measureWindowedRow();
			} else if (this.tbody && this.tbody.rows.length > 0) {
				this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
			} else {
				let tempRow = null;
				if (this.isDataDriven && this._data.length > 0) {
					tempRow = this._buildRow(this._data[0]);
				}
				if (tempRow && this.tbody) {
					this.tbody.appendChild(tempRow);
					this._rowHeight = tempRow.offsetHeight || 40;
					tempRow.remove();
				}
			}
		}

		this._scrollContainer = _findScrollContainer(this.dom, this.table);
		const scrollTarget = this._scrollContainer || window;

		// Disable browser scroll anchoring on table, tbody, and scroll container
		// to prevent runaway scroll feedback loops when spacer heights dynamically resize.
		if (this.dom) this.dom.style.overflowAnchor = 'none';
		if (this.table) this.table.style.overflowAnchor = 'none';
		if (this.tbody) this.tbody.style.overflowAnchor = 'none';
		if (this._scrollContainer) this._scrollContainer.style.overflowAnchor = 'none';

		this._scrollHandler = function () {
			if (self._rafId) return;
			self._rafId = requestAnimationFrame(function () {
				self._rafId = null;
				self._windowed ? self._renderWindowed() : self._renderVirtual();
			});
		};

		// Resize shares the scroll rAF; the flag scopes re-measuring to resize frames.
		// A lock deferred while the header row had no box happens here, before the re-measure.
		this._resizeHandler = function () {
			self._lockColumnWidths();
			self._vResized = true;
			self._scrollHandler();
		};

		scrollTarget.addEventListener('scroll', this._scrollHandler, { passive: true });
		window.addEventListener('resize', this._resizeHandler, { passive: true });
	};

	_component.prototype._disableVirtualScroll = function () {
		if (!this._virtual) return;
		this._virtual = false;

		if (this._scrollHandler) {
			const scrollTarget = this._scrollContainer || window;
			scrollTarget.removeEventListener('scroll', this._scrollHandler);
			window.removeEventListener('resize', this._resizeHandler);
			this._scrollHandler = null;
			this._resizeHandler = null;
		}
		if (this.dom) this.dom.style.overflowAnchor = '';
		if (this.table) this.table.style.overflowAnchor = '';
		if (this.tbody) this.tbody.style.overflowAnchor = '';
		if (this._scrollContainer) this._scrollContainer.style.overflowAnchor = '';
		this._scrollContainer = null;
		if (this._rafId) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}
		this._vStart = -1;
		this._vEnd = -1;
		this._rowPool = null;
		this._topSpacer = null;
		this._topTd = null;
		this._bottomSpacer = null;
		this._bottomTd = null;
	};

	// ─── Row Pool (Cheetah / Glide style DOM Recycling) ────────

	_component.prototype._compileRowBindings = function (tr) {
		const bindings = {
			textNodes: [],
			attrs: [],
			cellAttrs: []
		};

		const walker = document.createTreeWalker(tr, NodeFilter.SHOW_TEXT);
		while (walker.nextNode()) {
			const node = walker.currentNode;
			if (node.textContent.indexOf('{{') !== -1) {
				const parent = node.parentElement;
				bindings.textNodes.push({
					node: node,
					raw: node.textContent,
					el: parent,
					isLeaf: !!(parent && parent.children.length === 0)
				});
			}
		}

		const elements = Array.from(tr.querySelectorAll('*'));
		if (tr.nodeType === 1) elements.push(tr);

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (el.hasAttribute('data-ln-table-cell-attr')) {
				const pairs = el.getAttribute('data-ln-table-cell-attr').split(',');
				for (let j = 0; j < pairs.length; j++) {
					const parts = pairs[j].trim().split(':');
					if (parts.length === 2) {
						bindings.cellAttrs.push({
							el: el,
							field: parts[0].trim(),
							attr: parts[1].trim()
						});
					}
				}
			}

			const attrs = el.attributes;
			for (let j = 0; j < attrs.length; j++) {
				const a = attrs[j];
				if (a.value.indexOf('{{') !== -1) {
					bindings.attrs.push({
						el: el,
						name: a.name,
						raw: a.value
					});
				}
			}
		}

		tr._lnBindings = bindings;
		return bindings;
	};

	_component.prototype._createTemplateRow = function () {
		let clone = cloneTemplateScoped(this.dom, this.name + '-row', 'ln-table');
		if (!clone) {
			const genericTpl = this.dom.querySelector('template[data-ln-table-row]');
			if (genericTpl) {
				clone = document.importNode(genericTpl.content, true);
			}
		}

		let tr = clone ? (clone.querySelector('[data-ln-table-row]') || clone.firstElementChild) : null;

		if (!tr) {
			if (window.lnDebug || (typeof document !== 'undefined' && document.body && document.body.hasAttribute('data-ln-debug'))) {
				console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`);
			}
			return null;
		}

		this._compileRowBindings(tr);
		return tr;
	};

	_component.prototype._updateRow = function (tr, record) {
		if (!record) return;
		tr._lnRecord = record;
		if (record.id != null) {
			tr.setAttribute('data-ln-table-row-id', record.id);
		}

		const bindings = tr._lnBindings || this._compileRowBindings(tr);

		const textNodes = bindings.textNodes;
		for (let i = 0; i < textNodes.length; i++) {
			const item = textNodes[i];
			const val = item.raw.replace(
				/\{\{\s*(\w+)\s*\}\}/g,
				function (_, key) { return record[key] !== undefined && record[key] !== null ? record[key] : ''; }
			);
			if (item.isLeaf && item.el) {
				item.el.textContent = val;
			} else if (item.node && item.node.parentNode) {
				item.node.textContent = val;
			} else if (item.el) {
				item.el.textContent = val;
			}
		}

		const attrs = bindings.attrs;
		for (let i = 0; i < attrs.length; i++) {
			const item = attrs[i];
			item.el.setAttribute(
				item.name,
				item.raw.replace(
					/\{\{\s*(\w+)\s*\}\}/g,
					function (_, key) { return record[key] !== undefined && record[key] !== null ? record[key] : ''; }
				)
			);
		}

		const cellAttrs = bindings.cellAttrs;
		for (let i = 0; i < cellAttrs.length; i++) {
			const item = cellAttrs[i];
			const val = record[item.field];
			if (val != null) {
				item.el.setAttribute(item.attr, val);
			}
		}

		if (bindings.textNodes.length === 0 && bindings.attrs.length === 0 && this.ths.length > 0) {
			for (let j = 0; j < this.ths.length; j++) {
				const colName = this.ths[j].getAttribute('data-ln-table-col');
				if (colName && j < tr.cells.length && record[colName] != null) {
					tr.cells[j].textContent = String(record[colName]);
				}
			}
		}

		if (this._selectable) {
			const id = record.id != null ? String(record.id) : null;
			const isSelected = id != null && this.selectedIds.has(id);
			tr.classList.toggle('ln-row-selected', isSelected);
			const rowCb = tr.querySelector('[data-ln-table-row-select]');
			if (rowCb) rowCb.checked = isSelected;
		}
	};

	_component.prototype._ensureRowPool = function (requiredCount, colSpan) {
		if (!this._rowPool) {
			this._rowPool = [];
			this._topSpacer = document.createElement('tr');
			this._topSpacer.className = 'ln-table__spacer';
			this._topSpacer.setAttribute('aria-hidden', 'true');
			this._topSpacer.style.overflowAnchor = 'none';
			this._topTd = document.createElement('td');
			this._topTd.setAttribute('colspan', colSpan);
			this._topTd.style.padding = '0';
			this._topTd.style.border = 'none';
			this._topTd.style.overflowAnchor = 'none';
			this._topSpacer.appendChild(this._topTd);

			this._bottomSpacer = document.createElement('tr');
			this._bottomSpacer.className = 'ln-table__spacer';
			this._bottomSpacer.setAttribute('aria-hidden', 'true');
			this._bottomSpacer.style.overflowAnchor = 'none';
			this._bottomTd = document.createElement('td');
			this._bottomTd.setAttribute('colspan', colSpan);
			this._bottomTd.style.padding = '0';
			this._bottomTd.style.border = 'none';
			this._bottomTd.style.overflowAnchor = 'none';
			this._bottomSpacer.appendChild(this._bottomTd);

			this.tbody.replaceChildren(this._topSpacer, this._bottomSpacer);
		} else {
			if (this._topTd && this._topTd.getAttribute('colspan') !== String(colSpan)) {
				this._topTd.setAttribute('colspan', colSpan);
				this._bottomTd.setAttribute('colspan', colSpan);
			}
		}

		while (this._rowPool.length < requiredCount) {
			const tr = this._createTemplateRow();
			if (!tr) break;
			this._rowPool.push(tr);
			this.tbody.insertBefore(tr, this._bottomSpacer);
		}
	};

	// Viewport scroll position relative to the first data row, and viewport height.
	_component.prototype._scrollMetrics = function () {
		const theadH = this.thead ? this.thead.offsetHeight : 0;
		const sc = this._scrollContainer;
		const tableRect = this.table.getBoundingClientRect();
		if (sc) {
			const scRect = sc.getBoundingClientRect();
			const dataStartInContainer = (tableRect.top - scRect.top) + sc.scrollTop + theadH;
			return { scrollIntoData: sc.scrollTop - dataStartInContainer, viewportH: sc.clientHeight };
		}
		const tableTopInPage = tableRect.top + window.scrollY;
		const dataStartInPage = tableTopInPage + theadH;
		return { scrollIntoData: window.scrollY - dataStartInPage, viewportH: window.innerHeight };
	};

	_component.prototype._renderVirtual = function () {
		const data = this._filteredData;
		const total = data.length;
		if (!this._rowHeight || !total) return;

		const sc = this._scrollContainer;
		const metrics = this._scrollMetrics();
		const scrollIntoData = metrics.scrollIntoData;
		const viewportH = metrics.viewportH;

		// After a resize a media query may have restyled rows (e.g. stacked cards):
		// re-measure the rendered block's pitch (read before any write) and keep the
		// record that was at the viewport top in place.
		let target = scrollIntoData;
		if (this._vResized) {
			this._vResized = false;
			const n = this._vEnd - this._vStart;
			const last = this._rowPool && this._rowPool[n - 1];
			const pitch = last ? (last.getBoundingClientRect().bottom - this._rowPool[0].getBoundingClientRect().top) / n : 0;
			if (pitch && pitch !== this._rowHeight) {
				this._rowHeight = pitch;
				this._vStart = -1;
				if (this._vTop > 0) target = this._vTop * pitch;
			}
		}
		const rowH = this._rowHeight;
		this._vTop = target / rowH;

		const vw = calculateVirtualWindow(target, viewportH, rowH, total, BUFFER_ROWS);
		const startRow = vw.start;
		const endRow = vw.end;

		if (startRow === this._vStart && endRow === this._vEnd) return;
		this._vStart = startRow;
		this._vEnd = endRow;

		const colSpan = this.ths.length || 1;
		const neededRows = endRow - startRow;

		this._ensureRowPool(neededRows, colSpan);

		if (vw.topPadding > 0) {
			this._topTd.style.height = vw.topPadding + 'px';
			this._topSpacer.style.display = '';
		} else {
			this._topTd.style.height = '0px';
			this._topSpacer.style.display = 'none';
		}

		if (vw.bottomPadding > 0) {
			this._bottomTd.style.height = vw.bottomPadding + 'px';
			this._bottomSpacer.style.display = '';
		} else {
			this._bottomTd.style.height = '0px';
			this._bottomSpacer.style.display = 'none';
		}

		for (let k = 0; k < this._rowPool.length; k++) {
			const rowEl = this._rowPool[k];
			const dataIndex = startRow + k;
			if (k < neededRows && dataIndex < total) {
				rowEl.style.display = '';
				const rec = data[dataIndex];
				if (rec && rec.html) {
					const temp = document.createElement('tbody');
					temp.innerHTML = rec.html;
					const parsedTr = temp.firstElementChild;
					if (parsedTr) {
						rowEl.innerHTML = parsedTr.innerHTML;
						rowEl.className = parsedTr.className;
						rowEl._lnRecord = rec;
						if (rec.id != null) rowEl.setAttribute('data-ln-table-row-id', rec.id);
					}
				} else {
					this._updateRow(rowEl, rec);
				}
			} else {
				rowEl.style.display = 'none';
			}
		}

		if (this._selectable) this._updateSelectAll();

		if (target !== scrollIntoData) {
			if (sc) sc.scrollTop += target - scrollIntoData;
			else window.scrollTo(window.scrollX, window.scrollY + target - scrollIntoData);
		}
	};



	// ─── Loading state ──────────────────────────────────────────

	_component.prototype._showLoadingState = function () {
		this._rowPool = null;
		this._topSpacer = null;
		this._topTd = null;
		this._bottomSpacer = null;
		this._bottomTd = null;
		const colSpan = this.ths.length || 1;
		let loadingEl = null;

		let clone = cloneTemplateScoped(this.dom, this.name + '-loading', 'ln-table')
			|| cloneTemplateScoped(this.dom, 'table-loading', 'ln-table');

		if (!clone) {
			const genericTpl = this.dom.querySelector('template[data-ln-table-loading]');
			if (genericTpl) {
				clone = document.importNode(genericTpl.content, true);
			}
		}

		if (clone) {
			if (clone.tagName === 'TR') {
				loadingEl = clone;
			} else {
				const td = document.createElement('td');
				td.setAttribute('colspan', String(colSpan));
				td.appendChild(clone);
				const tr = document.createElement('tr');
				tr.appendChild(td);
				loadingEl = tr;
			}
		}

		if (loadingEl) {
			loadingEl.setAttribute('data-ln-table-empty', '');
			this.tbody.replaceChildren(loadingEl);
		} else {
			this.tbody.replaceChildren();
		}
	};

	// ─── Empty state ───────────────────────────────────────────

	_component.prototype._showEmptyState = function () {
		this._rowPool = null;
		this._topSpacer = null;
		this._topTd = null;
		this._bottomSpacer = null;
		this._bottomTd = null;
		const colSpan = this.ths.length || 1;
		let emptyEl = null;
		let clone = null;

		if (this.isDataDriven) {
			const total = this._lastTotal != null ? this._lastTotal : this._data.length;
			const filtered = this.visibleCount;
			// The source owns the query (docs/architecture/shared-query.md), so the view
			// cannot read a search term off itself — it only knows the source narrowed
			// to zero while still holding records.
			const isFiltered = filtered === 0 && total > 0;

			const templateName = isFiltered ? (this.name + '-empty-filtered') : (this.name + '-empty');
			clone = cloneTemplateScoped(this.dom, templateName, 'ln-table')
				|| cloneTemplateScoped(this.dom, isFiltered ? 'table-empty-filtered' : 'table-empty', 'ln-table');

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
		} else {
			clone = cloneTemplateScoped(this.dom, this.name + '-empty', 'ln-table')
				|| cloneTemplateScoped(this.dom, 'table-empty', 'ln-table');
			if (!clone) {
				const genericTpl = this.dom.querySelector('template[data-ln-table-empty]');
				if (genericTpl) {
					clone = document.importNode(genericTpl.content, true);
				}
			}
		}

		if (clone) {
			if (clone.tagName === 'TR') {
				emptyEl = clone;
			} else {
				const td = document.createElement('td');
				td.setAttribute('colspan', String(colSpan));
				td.appendChild(clone);
				const tr = document.createElement('tr');
				tr.appendChild(td);
				emptyEl = tr;
			}
		}

		if (emptyEl) {
			emptyEl.setAttribute('data-ln-table-empty', '');
			this.tbody.replaceChildren(emptyEl);
		} else {
			this.tbody.replaceChildren();
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
		let clone = cloneTemplateScoped(this.dom, this.name + '-row', 'ln-table');
		if (!clone) {
			const genericTpl = this.dom.querySelector('template[data-ln-table-row]');
			if (genericTpl) {
				clone = document.importNode(genericTpl.content, true);
			}
		}

		let tr = clone ? (clone.querySelector('[data-ln-table-row]') || clone.firstElementChild) : null;

		if (!tr) {
			if (record && record.html) {
				const temp = document.createElement('tbody');
				temp.innerHTML = record.html;
				tr = temp.firstElementChild;
			} else {
				if (window.lnDebug || (typeof document !== 'undefined' && document.body && document.body.hasAttribute('data-ln-debug'))) {
					console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`);
				}
				return null;
			}
		} else {
			this._fillRow(tr, record);
		}

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
			this.dom.setAttribute('aria-busy', 'true');
			this._cache.invalidate({
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});
			return;
		}
		requestData(this, 'ln-table:request-data', 'table');
	};

	// ─── Windowed mode ─────────────────────────────────────────

	_component.prototype._enterWindowedMode = function () {
		const self = this;
		const dom = this.dom;

		this._onCacheChange = function () {
			if (!self._windowed || !self._cache) return;
			self.totalCount = self._cache.grandTotal;
			self.visibleCount = self._cache.logicalTotal;
			self._lastTotal = self._cache.grandTotal;
			self.isLoaded = true;
			self._initialLoaded = true;
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
			windowSize: this._windowSize,
			pageSize: this._windowPage,
			threshold: this._windowThreshold,
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

		// Select-all would cover resident rows only.
		if (this._selectAllCheckbox) this._selectAllCheckbox.hidden = true;
	};

	_component.prototype._kickWindowInitial = function () {
		if (this._data.length > 0) {
			// Seeded from resident rows: page 0 is already here and the grand total is declared in
			// markup. No queryGen on the seed, so it is never dropped as stale.
			const seedTotal = this._declaredTotal > 0 ? this._declaredTotal : this._data.length;
			this._cache.ingest({ data: this._data, offset: 0, total: seedTotal, filtered: seedTotal });
		} else {
			this._cache.requestInitial({
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});
		}
	};

	_component.prototype._teardownWindow = function () {
		this._disableVirtualScroll();
		if (this._cache) this._cache.destroy();
		this._cache = null;
		this._windowed = false;
		this._renderBatch = null;
		this._onCacheChange = null;
		if (this._selectAllCheckbox) this._selectAllCheckbox.hidden = false;
	};

	_component.prototype._exitWindowedMode = function () {
		this._teardownWindow();
		this._data = [];
		this._filteredData = [];
		this._lastTotal = 0;
		this._lastFiltered = 0;
		this.isLoaded = false;
		this._vStart = -1;
		this._vEnd = -1;
		// Non-windowed now: full request-data, no offset/limit.
		this._requestData();
	};

	_component.prototype._measureWindowedRow = function () {
		const sample = this._cache.peek();
		const tr = sample ? this._buildRow(sample) : null;
		if (!tr || !this.tbody) return 0;
		this.tbody.appendChild(tr);
		const height = tr.offsetHeight || 40;
		tr.remove();
		return height;
	};

	_component.prototype._buildPlaceholderRow = function (colSpan) {
		const tr = document.createElement('tr');
		tr.className = 'ln-table__placeholder';
		tr.setAttribute('aria-hidden', 'true');
		tr.style.height = this._rowHeight + 'px';
		const td = document.createElement('td');
		td.setAttribute('colspan', colSpan);
		tr.appendChild(td);
		return tr;
	};

	_component.prototype._buildSpacerRow = function (colSpan, height) {
		const tr = document.createElement('tr');
		tr.className = 'ln-table__spacer';
		tr.setAttribute('aria-hidden', 'true');
		const td = document.createElement('td');
		td.setAttribute('colspan', colSpan);
		td.style.height = height + 'px';
		tr.appendChild(td);
		return tr;
	};

	_component.prototype._renderWindowed = function () {
		const cache = this._cache;
		if (this.isLoaded && cache.logicalTotal === 0) {
			this._disableVirtualScroll();
			this._showEmptyState();
			return;
		}
		if (!this._virtual) this._enableVirtualScroll();

		// A media query may have restyled rows on resize (e.g. stacked cards): re-measure the pitch.
		if (this._vResized) {
			this._vResized = false;
			const measured = this._measureWindowedRow();
			if (measured && measured !== this._rowHeight) {
				this._rowHeight = measured;
				this._vStart = -1;
			}
		}

		const total = cache.logicalTotal;
		if (!this._rowHeight || !total) return;

		const metrics = this._scrollMetrics();
		const vw = calculateVirtualWindow(metrics.scrollIntoData, metrics.viewportH, this._rowHeight, total, BUFFER_ROWS);
		if (vw.start === this._vStart && vw.end === this._vEnd) return;
		this._vStart = vw.start;
		this._vEnd = vw.end;

		const colSpan = this.ths.length || 1;
		const frag = document.createDocumentFragment();
		if (vw.topPadding > 0) frag.appendChild(this._buildSpacerRow(colSpan, vw.topPadding));
		for (let i = vw.start; i < vw.end; i++) {
			const tr = cache.has(i) ? this._buildRow(cache.get(i)) : this._buildPlaceholderRow(colSpan);
			if (tr) frag.appendChild(tr);
		}
		if (vw.bottomPadding > 0) frag.appendChild(this._buildSpacerRow(colSpan, vw.bottomPadding));
		this.tbody.replaceChildren(frag);

		// First data on screen: lock column widths once (no-op after the first success).
		this._lockColumnWidths();

		cache.ensure(vw.start, vw.end);
	};

	// ─── Selection Helpers ─────────────────────────────────────

	_component.prototype._updateSelectAll = function () {
		if (!this._selectAllCheckbox || !this.tbody) return;
		const rows = this.tbody.querySelectorAll('[data-ln-table-row]');
		const ids = [];
		for (let i = 0; i < rows.length; i++) {
			const id = rows[i].getAttribute('data-ln-table-row-id');
			if (id != null) ids.push(id);
		}
		const state = calculateSelectionState(ids, this.selectedIds);
		this._selectAllCheckbox.checked = state.isAllSelected;
		this._selectAllCheckbox.indeterminate = state.isIndeterminate;
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

			self.selectedIds = toggleRowSelection(self.selectedIds, id, checkbox.checked);
			tr.classList.toggle('ln-row-selected', checkbox.checked);

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
				const ids = [];

				for (let i = 0; i < rows.length; i++) {
					const id = rows[i].getAttribute('data-ln-table-row-id');
					const rowCb = rows[i].querySelector('[data-ln-table-row-select]');
					if (id == null) continue;
					ids.push(id);
					rows[i].classList.toggle('ln-row-selected', checked);
					if (rowCb) rowCb.checked = checked;
				}

				self.selectedIds = toggleSelectAll(self.selectedIds, ids, checked);
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
					self.selectedIds = toggleRowSelection(self.selectedIds, id, true);
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

		this.selectedIds = toggleSelectAll(this.selectedIds, Array.from(this.selectedIds), false);
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
			_setNumberValue(this._totalSpan, total);
		}

		if (this._filteredSpan) {
			_setNumberValue(this._filteredSpan, isFiltered ? filtered : null);
		}

		if (this._filteredWrap) {
			this._filteredWrap.classList.toggle('hidden', !isFiltered);
		}

		if (this._selectedSpan) {
			const count = this.selectedIds ? this.selectedIds.size : 0;
			_setNumberValue(this._selectedSpan, count > 0 ? count : null);
			if (this._selectedWrap) {
				this._selectedWrap.classList.toggle('hidden', count === 0);
			}
		}
	};



	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._disableVirtualScroll();

		this.dom.removeEventListener('ln-table:set-search', this._onSetSearch);
		this.dom.removeEventListener('ln-search:change', this._onSearchChange);
		this.dom.removeEventListener('ln-table:request-clear-filters', this._onRequestClearFilters);

		if (this.isDataDriven) {
			this.dom.removeEventListener('ln-table:set-data', this._onSetData);
			this.dom.removeEventListener('ln-table:set-loading', this._onSetLoading);
			this.dom.removeEventListener('ln-table:request-revalidate', this._onRequestRevalidate);
			this.dom.removeEventListener('ln-table:page-failed', this._onPageFailed);
			this.dom.removeEventListener('ln-table:request-invalidate', this._onRequestInvalidate);
			this.dom.removeEventListener('ln-sort:change', this._onSort);
			if (this.tbody) {
				this.tbody.removeEventListener('click', this._onRowClick);
				this.tbody.removeEventListener('click', this._onRowAction);
			}
		} else {
			if (this._emptyTbodyObserver) {
				this._emptyTbodyObserver.disconnect();
				this._emptyTbodyObserver = null;
			}
			this.dom.removeEventListener('ln-sort:change', this._onSort);
			this.dom.removeEventListener('ln-filter:change', this._onFilterChange);
		}

		if (this._onSelectionChange && this.tbody) this.tbody.removeEventListener('change', this._onSelectionChange);
		if (this._selectAllCheckbox && this._onSelectAll) this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);

		if (this._colgroup) {
			this._colgroup.remove();
			this._colgroup = null;
		}
		if (this.table) this.table.style.tableLayout = '';
		if (this._windowed) this._teardownWindow();
		this.dom.classList.remove('ln-table--loading');
		this.dom.removeAttribute('aria-busy');
		this._loadingIndicator = null;
		this._data = [];
		this._filteredData = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table', {
		attributes: ATTRIBUTES
	});
})();
