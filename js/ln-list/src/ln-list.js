import { cloneTemplateScoped, dispatch, requestData, fill, fillTemplate, registerComponent, readValue, createWindowCache, createBatcher, getLocale, detectValueType, compareValues } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-list';
	const DOM_ATTRIBUTE = 'lnList';
	const EMPTY_TEMPLATE = 'data-ln-list-empty';
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;
	const WINDOW_DEFAULT = 1000;
	const WINDOW_PAGE = 200;
	const FETCH_DEBOUNCE = 120;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _formatNum(n, dom) {
		if (n == null || isNaN(n)) return '';
		try {
			return new Intl.NumberFormat(getLocale(dom)).format(n);
		} catch (e) {
			return String(n);
		}
	}

	function _findScrollContainer(el) {
		let p = el;
		while (p && p !== document.body && p !== document.documentElement) {
			const cs = getComputedStyle(p);
			const oy = cs.overflowY;
			if (oy === 'auto' || oy === 'scroll') return p;
			p = p.parentElement;
		}
		return null;
	}

	function _saveScroll(self) {
		const sc = self._scrollContainer || _findScrollContainer(self.dom);
		return {
			container: sc,
			top: sc ? sc.scrollTop : window.scrollY
		};
	}

	function _restoreScroll(state) {
		if (state.container) {
			state.container.scrollTop = state.top;
		} else {
			window.scrollTo(window.scrollX, state.top);
		}
	}


	function _getOuterHeight(el) {
		if (!el) return 0;
		const cs = getComputedStyle(el);
		const mt = parseFloat(cs.marginTop) || 0;
		const mb = parseFloat(cs.marginBottom) || 0;
		return el.offsetHeight + mt + mb;
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.tbody = dom.querySelector('[data-ln-list-body]') || dom;
		this.isDataDriven = dom.hasAttribute('data-ln-list-source');
		this.name = dom.getAttribute(DOM_SELECTOR) || '';
		this.source = dom.getAttribute('data-ln-list-source') || '';

		// Footer elements — both modes
		this._totalSpan = dom.querySelector('[data-ln-list-total]');
		this._filteredSpan = dom.querySelector('[data-ln-list-filtered]');
		if (this._filteredSpan) {
			this._filteredWrap = this._filteredSpan.parentElement !== dom
				? this._filteredSpan.parentElement
				: null;
		}
		this._selectedSpan = dom.querySelector('[data-ln-list-selected]');
		if (this._selectedSpan) {
			this._selectedWrap = this._selectedSpan.parentElement !== dom
				? this._selectedSpan.parentElement
				: null;
		}

		this._data = [];
		this._filteredData = [];
		this.selectedIds = new Set();

		// SSR filtering / sorting state
		this._searchTerm = '';
		this._filters = {};
		this._sortField = null;
		this._sortDir = null;

		// Virtual scroll state
		this._virtual = false;
		this._itemHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._rafId = null;
		this._scrollHandler = null;
		this._resizeHandler = null;
		this._scrollContainer = null;
		this.isUl = this.tbody.tagName === 'UL' || this.tbody.tagName === 'OL';

		const self = this;

		// --- Layer 1 Command Handlers ---
		this._onRequestClearFilters = function () {
			if (self.isDataDriven) {
				self.currentFilters = {};
				self.currentSearch = '';
				dispatch(dom, 'ln-list:clear-filters', { list: self.name });
				self._requestData();
			} else {
				self._searchTerm = '';
				self._filters = {};
				self._sortField = null;
				self._sortDir = null;
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-list:filter', {
					term: '',
					matched: self._filteredData.length,
					total: self._data.length
				});
			}
		};
		dom.addEventListener('ln-list:request-clear-filters', this._onRequestClearFilters);

		// --- Selection (both modes) ---
		this._selectable = dom.hasAttribute('data-ln-list-selectable');
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

			this._windowed = false;
			this._cache = null;
			if (dom.hasAttribute('data-ln-list-window')) this._enterWindowedMode();

			this._lastTotal = 0;
			this._lastFiltered = 0;

			// --- Event listeners ---
			this._onSetData = function (e) {
				const detail = e.detail || {};
				if (self._windowed) {
					dom.classList.remove('ln-list--loading');
					self._cache.ingest(detail);
					return;
				}
				self._data = detail.data || [];
				self._lastTotal = detail.total != null ? detail.total : self._data.length;
				self._lastFiltered = detail.filtered != null ? detail.filtered : self._data.length;

				self.totalCount = self._lastTotal;
				self.visibleCount = self._lastFiltered;
				self.isLoaded = true;

				dom.classList.remove('ln-list--loading');

				self._vStart = -1;
				self._vEnd = -1;

				self._applyFilterAndSort();
				self._render();
				self._updateFooter();

				dispatch(dom, 'ln-list:rendered', {
					list: self.name,
					total: self.totalCount,
					visible: self.visibleCount
				});
			};
			dom.addEventListener('ln-list:set-data', this._onSetData);

			this._onSetLoading = function (e) {
				const loading = e.detail && e.detail.loading;
				dom.classList.toggle('ln-list--loading', !!loading);
				if (loading) {
					self.isLoaded = false;
				}
			};
			dom.addEventListener('ln-list:set-loading', this._onSetLoading);

			this._onPageFailed = function (e) {
				if (!self._windowed || !self._cache) return;
				self._cache.release(e.detail && e.detail.offset);
			};
			dom.addEventListener('ln-list:page-failed', this._onPageFailed);

			this._onRequestRevalidate = function () {
				if (!self._windowed || !self._cache) return;
				self._cache.revalidate();
			};
			dom.addEventListener('ln-list:request-revalidate', this._onRequestRevalidate);

			// The source owns the query, so a query change reaches the view as a
			// restart order, not as query state — the window drops to page 0 and
			// the composed query is resolved at serve time.
			this._onRequestInvalidate = function () {
				if (!self._windowed || !self._cache) return;
				self._requestData();
			};
			dom.addEventListener('ln-list:request-invalidate', this._onRequestInvalidate);

			// --- Sort ---
			// Mirrors ln-table's own data-driven ln-sort:change handler: windowed lists
			// invalidate the sliding-window cache and re-fetch (via the existing
			// _requestData(), which already branches on this._windowed — see its
			// definition further down this file); non-windowed lists re-sort the
			// already-fetched in-memory data locally, no server round-trip.
			this._onSort = function (e) {
				// Index-only event (field === null) has nothing to key a record by — ignore.
				if (e.detail.field == null) return;
				e.preventDefault();
				self.currentSort = e.detail.direction === 'none' ? null : { field: e.detail.field, direction: e.detail.direction };
				if (self._windowed) {
					self._requestData();
				} else {
					self._applyFilterAndSort();
					self._vStart = -1;
					self._vEnd = -1;
					self._render();
					self._updateFooter();
					dispatch(dom, 'ln-list:sorted', {
						field: self.currentSort ? self.currentSort.field : null,
						direction: e.detail.direction,
						matched: self.visibleCount,
						total: self.totalCount
					});
				}
			};
			dom.addEventListener('ln-sort:change', this._onSort);

			// --- Item Click & Actions ---
			this._onItemClick = function (e) {
				if (e.target.closest('[data-ln-item-select]')) return;
				if (e.target.closest('[data-ln-item-action]')) return;
				if (e.target.closest('a') || e.target.closest('button')) return;
				if (e.ctrlKey || e.metaKey || e.button === 1) return;

				const itemEl = e.target.closest('[data-ln-item]');
				if (!itemEl) return;

				const id = itemEl.getAttribute('data-ln-item-id');
				const record = itemEl._lnRecord || {};

				dispatch(dom, 'ln-list:item-click', {
					list: self.name,
					id: id,
					record: record
				});
			};
			if (this.tbody) this.tbody.addEventListener('click', this._onItemClick);

			this._onItemAction = function (e) {
				const btn = e.target.closest('[data-ln-item-action]');
				if (!btn) return;

				e.stopPropagation();
				const itemEl = btn.closest('[data-ln-item]');
				if (!itemEl) return;

				const action = btn.getAttribute('data-ln-item-action');
				const id = itemEl.getAttribute('data-ln-item-id');
				const record = itemEl._lnRecord || {};

				dispatch(dom, 'ln-list:item-action', {
					list: self.name,
					id: id,
					action: action,
					record: record
				});
			};
			if (this.tbody) this.tbody.addEventListener('click', this._onItemAction);

			// Local hydration of initial items
			if (this.tbody && this.tbody.children.length > 0) {
				this._parseChildren();
			}

			// Initial request-data
			if (this._windowed) {
				this._kickWindowInitial();
			} else {
				dispatch(dom, 'ln-list:request-data', {
					list: this.name,
					sort: this.currentSort,
					filters: this.currentFilters,
					search: this.currentSearch
				});
			}

		} else {
			// SSR Mode
			this._emptyObserver = null;

			if (this.tbody && this.tbody.children.length > 0) {
				this._parseChildren();
			} else if (this.tbody) {
				this._emptyObserver = new MutationObserver(function () {
					if (self.tbody.children.length > 0) {
						self._emptyObserver.disconnect();
						self._emptyObserver = null;
						self._parseChildren();
					}
				});
				this._emptyObserver.observe(this.tbody, { childList: true });
			}

			this._onSearchChange = function (e) {
				e.preventDefault();
				const term = (e.detail && e.detail.term != null ? e.detail.term : '').trim();
				self._searchTerm = term.toLowerCase();
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-list:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-search:change', this._onSearchChange);

			this._onFilterChange = function (e) {
				e.preventDefault();
				if (!e.detail) return;
				const key = e.detail.key;
				const values = e.detail.values || [];
				if (!key) return;

				if (values.length === 0) {
					delete self._filters[key];
				} else {
					const lower = [];
					for (let i = 0; i < values.length; i++) {
						lower.push(values[i].toLowerCase());
					}
					self._filters[key] = lower;
				}
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-list:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-filter:change', this._onFilterChange);

			this._onSort = function (e) {
				if (e.detail && e.detail.field == null) return;
				e.preventDefault();
				const direction = e.detail && e.detail.direction === 'none' ? null : (e.detail && e.detail.direction);
				self._sortField = direction === null ? null : (e.detail && e.detail.field);
				self._sortDir = direction;
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				self._updateFooter();
				dispatch(dom, 'ln-list:sorted', {
					field: self._sortField,
					direction: e.detail && e.detail.direction,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-sort:change', this._onSort);
		}

		return this;
	}

	// ─── Parse Children into in-memory array ───────────────────

	_component.prototype._parseChildren = function () {
		const children = Array.from(this.tbody.children).filter(el => !el.classList.contains('ln-list__spacer'));
		this._data = [];

		if (children.length > 0) this._itemHeight = _getOuterHeight(children[0]) || 50;

		for (let i = 0; i < children.length; i++) {
			const el = children[i];
			const id = el.getAttribute('data-ln-item-id') || el.getAttribute('id');
			const text = el.textContent.trim().toLowerCase();

			let record = null;
			if (this.isDataDriven) {
				record = {};
				if (id != null) record.id = id;

				const fields = el.querySelectorAll('[data-ln-list-field]');
				for (let j = 0; j < fields.length; j++) {
					const f = fields[j];
					const prop = f.getAttribute('data-ln-list-field');
					if (prop) {
						record[prop] = readValue(f);
					}
				}
			}

			// SSR and fallback field extraction via readValue
			const fields = {};
			const fieldNodes = el.querySelectorAll('[data-ln-list-field], [data-ln-field]');
			for (let j = 0; j < fieldNodes.length; j++) {
				const f = fieldNodes[j];
				const prop = f.getAttribute('data-ln-list-field') || f.getAttribute('data-ln-field');
				if (prop) fields[prop] = readValue(f);
			}
			for (let j = 0; j < el.attributes.length; j++) {
				const attr = el.attributes[j];
				if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ln-')) {
					const key = attr.name.slice(5);
					if (key) fields[key] = attr.value;
				}
			}

			this._data.push({
				html: el.outerHTML,
				id: id,
				searchText: text,
				fields: fields,
				...(record || {})
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

		dispatch(this.dom, 'ln-list:ready', {
			total: this._data.length
		});
	};

	// ─── Filter + Sort ─────────────────────────────────────────

	_component.prototype._applyFilterAndSort = function () {
		if (this.isDataDriven) {
			this._filteredData = this._data.slice();
			this.visibleCount = this._filteredData.length;

			// Sort
			if (!this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;

			const field = this.currentSort.field;
			const multiplier = this.currentSort.direction === 'desc' ? -1 : 1;

			const values = this._filteredData.map(function (row) { return row[field]; });
			const type = detectValueType(values);
			const collator = typeof Intl !== 'undefined'
				? new Intl.Collator(getLocale(this.dom), { sensitivity: 'base' })
				: null;

			this._filteredData.sort(function (a, b) {
				return compareValues(a[field], b[field], type, collator) * multiplier;
			});
		} else {
			const term = this._searchTerm;
			const tokens = term ? term.split(/\s+/).filter(Boolean) : [];
			const filters = this._filters || {};
			const hasFilters = Object.keys(filters).length > 0;

			if (tokens.length === 0 && !hasFilters) {
				this._filteredData = this._data.slice();
			} else {
				this._filteredData = this._data.filter(function (row) {
					if (tokens.length > 0) {
						const match = tokens.every(function (token) {
							return row.searchText && row.searchText.indexOf(token) !== -1;
						});
						if (!match) return false;
					}
					if (hasFilters) {
						for (const key in filters) {
							const activeVals = filters[key];
							if (activeVals && activeVals.length > 0) {
								const val = (row.fields && row.fields[key] !== undefined)
									? row.fields[key]
									: (row[key] !== undefined ? row[key] : null);
								const sVal = val != null ? String(val).toLowerCase() : '';
								if (activeVals.indexOf(sVal) === -1) return false;
							}
						}
					}
					return true;
				});
			}

			// SSR Sort
			if (this._sortField && this._sortDir) {
				const field = this._sortField;
				const multiplier = this._sortDir === 'desc' ? -1 : 1;
				const collator = typeof Intl !== 'undefined'
					? new Intl.Collator(getLocale(this.dom), { sensitivity: 'base' })
					: null;

				const values = this._filteredData.map(function (row) {
					return (row.fields && row.fields[field] !== undefined) ? row.fields[field] : row[field];
				});
				const type = detectValueType(values);

				this._filteredData.sort(function (a, b) {
					const valA = (a.fields && a.fields[field] !== undefined) ? a.fields[field] : a[field];
					const valB = (b.fields && b.fields[field] !== undefined) ? b.fields[field] : b[field];
					return compareValues(valA, valB, type, collator) * multiplier;
				});
			}
		}
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		if (!this.tbody) return;

		if (this.isDataDriven) {
			if (this._windowed) { this._renderWindowed(); return; }
			const total = this._lastTotal;
			const filtered = this.visibleCount;

			if (total === 0 || this._filteredData.length === 0 || filtered === 0) {
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
			const isFiltered = count === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0);

			if (isFiltered) {
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
				const el = this._buildItem(data[i]);
				if (el) frag.appendChild(el);
			}

			const scrollState = _saveScroll(this);
			this.tbody.textContent = '';
			this.tbody.appendChild(frag);
			_restoreScroll(scrollState);

			if (this._selectable) this._updateSelectAll();
		} else {
			const html = [];
			const data = this._filteredData;
			for (let i = 0; i < data.length; i++) html.push(data[i].html);

			const scrollState = _saveScroll(this);
			this.tbody.innerHTML = html.join('');
			_restoreScroll(scrollState);

			if (this._selectable) this._restoreSelection();
		}
	};

	// ─── Virtual scroll ────────────────────────────────────────

	_component.prototype._readGridLayout = function () {
		const cs = getComputedStyle(this.tbody);
		const tracks = cs.gridTemplateColumns;
		let columns = 1;
		if (tracks && tracks !== 'none') {
			const parts = tracks.trim().split(/\s+/).filter(Boolean);
			if (parts.length > 0) columns = parts.length;
		}
		const rowGap = parseFloat(cs.rowGap);
		return { columns: columns, rowGap: isNaN(rowGap) ? 0 : rowGap };
	};

	_component.prototype._measureItemHeight = function () {
		if (this._windowed) {
			const sample = this._cache.peek();
			const el = sample ? this._buildItem(sample) : this._buildPlaceholderItem();
			if (el) {
				this.tbody.textContent = '';
				this.tbody.appendChild(el);
				this._itemHeight = _getOuterHeight(el) || 50;
				this.tbody.textContent = '';
			}
		} else if (this.isDataDriven) {
			if (this._data.length > 0) {
				const el = this._buildItem(this._data[0]);
				if (el) {
					this.tbody.textContent = '';
					this.tbody.appendChild(el);
					this._itemHeight = _getOuterHeight(el) || 50;
					this.tbody.textContent = '';
				}
			}
		} else {
			const children = this.tbody.children;
			if (children.length > 0) {
				this._itemHeight = _getOuterHeight(children[0]) || 50;
			}
		}
	};

	_component.prototype._enableVirtualScroll = function () {
		if (this._virtual) return;
		this._virtual = true;
		this._vStart = -1;
		this._vEnd = -1;
		const self = this;

		if (!this._itemHeight) {
			this._measureItemHeight();
		}

		this._scrollContainer = _findScrollContainer(this.dom);
		const container = this._scrollContainer || window;

		this._scrollHandler = function () {
			if (!self._rafId) {
				self._rafId = requestAnimationFrame(function () {
					self._rafId = null;
					self._windowed ? self._renderWindowed() : self._renderVirtual();
				});
			}
		};

		this._resizeHandler = function () {
			self._itemHeight = 0;
			self._measureItemHeight();
			self._vStart = -1;
			self._vEnd = -1;
			self._windowed ? self._renderWindowed() : self._renderVirtual();
		};

		container.addEventListener('scroll', this._scrollHandler, { passive: true });
		window.addEventListener('resize', this._resizeHandler, { passive: true });
	};

	_component.prototype._disableVirtualScroll = function () {
		if (!this._virtual) return;
		this._virtual = false;

		if (this._scrollHandler) {
			const container = this._scrollContainer || window;
			container.removeEventListener('scroll', this._scrollHandler);
			this._scrollHandler = null;
		}
		if (this._resizeHandler) {
			window.removeEventListener('resize', this._resizeHandler);
			this._resizeHandler = null;
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
		const count = data.length;
		const itemHeight = this._itemHeight;
		if (!itemHeight || !count) return;

		const container = this._scrollContainer;
		let scrollTop, viewportHeight;

		if (container) {
			const rect = this.tbody.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const relativeTop = (container === this.tbody) ? 0 : (rect.top - containerRect.top + container.scrollTop);
			scrollTop = container.scrollTop - relativeTop;
			viewportHeight = container.clientHeight;
		} else {
			const rect = this.tbody.getBoundingClientRect();
			const absoluteTop = rect.top + window.scrollY;
			scrollTop = window.scrollY - absoluteTop;
			viewportHeight = window.innerHeight;
		}

		const layout = this._readGridLayout();
		const columns = layout.columns;
		const rowGap = layout.rowGap;
		const rowHeight = itemHeight + rowGap;
		const totalRows = Math.ceil(count / columns);

		let firstRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
		firstRow = Math.min(firstRow, totalRows);
		const visibleRows = Math.ceil(viewportHeight / rowHeight) + BUFFER_ROWS * 2;
		const lastRow = Math.min(firstRow + visibleRows, totalRows);

		const start = Math.min(firstRow * columns, count);
		const end = Math.min(lastRow * columns, count);

		if (start === this._vStart && end === this._vEnd) return;

		this._vStart = start;
		this._vEnd = end;

		const topSpacerHeight = firstRow * rowHeight;
		const bottomSpacerHeight = (totalRows - lastRow) * rowHeight;

		if (this.isDataDriven) {
			const frag = document.createDocumentFragment();

			if (topSpacerHeight > 0) {
				const topSpacer = document.createElement(this.isUl ? 'li' : 'div');
				topSpacer.className = 'ln-list__spacer';
				topSpacer.setAttribute('aria-hidden', 'true');
				topSpacer.style.height = topSpacerHeight + 'px';
				frag.appendChild(topSpacer);
			}

			for (let i = start; i < end; i++) {
				const el = this._buildItem(data[i]);
				if (el) frag.appendChild(el);
			}

			if (bottomSpacerHeight > 0) {
				const bottomSpacer = document.createElement(this.isUl ? 'li' : 'div');
				bottomSpacer.className = 'ln-list__spacer';
				bottomSpacer.setAttribute('aria-hidden', 'true');
				bottomSpacer.style.height = bottomSpacerHeight + 'px';
				frag.appendChild(bottomSpacer);
			}

			const scrollState = _saveScroll(this);
			this.tbody.textContent = '';
			this.tbody.appendChild(frag);
			_restoreScroll(scrollState);

			if (this._selectable) this._updateSelectAll();
		} else {
			let html = '';
			if (topSpacerHeight > 0) {
				html += `<${this.isUl ? 'li' : 'div'} class="ln-list__spacer" aria-hidden="true" style="height:${topSpacerHeight}px"></${this.isUl ? 'li' : 'div'}>`;
			}
			for (let i = start; i < end; i++) {
				html += data[i].html;
			}
			if (bottomSpacerHeight > 0) {
				html += `<${this.isUl ? 'li' : 'div'} class="ln-list__spacer" aria-hidden="true" style="height:${bottomSpacerHeight}px"></${this.isUl ? 'li' : 'div'}>`;
			}

			const scrollState = _saveScroll(this);
			this.tbody.innerHTML = html;
			_restoreScroll(scrollState);

			if (this._selectable) this._restoreSelection();
		}
	};

	_component.prototype._buildPlaceholderItem = function () {
		const el = document.createElement(this.isUl ? 'li' : 'div');
		el.className = 'ln-list__placeholder';
		el.setAttribute('aria-hidden', 'true');
		el.style.height = this._itemHeight + 'px';
		return el;
	};

	_component.prototype._renderWindowed = function () {
		if (this.isLoaded && this._cache.logicalTotal === 0) {
			this._disableVirtualScroll();
			this._showEmptyState();
			return;
		}
		if (!this._virtual) this._enableVirtualScroll();

		const itemHeight = this._itemHeight;
		if (!itemHeight) return;

		const container = this._scrollContainer;
		let scrollTop, viewportHeight;
		if (container) {
			const rect = this.tbody.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const relativeTop = (container === this.tbody) ? 0 : (rect.top - containerRect.top + container.scrollTop);
			scrollTop = container.scrollTop - relativeTop;
			viewportHeight = container.clientHeight;
		} else {
			const rect = this.tbody.getBoundingClientRect();
			const absoluteTop = rect.top + window.scrollY;
			scrollTop = window.scrollY - absoluteTop;
			viewportHeight = window.innerHeight;
		}

		const layout = this._readGridLayout();
		const columns = layout.columns;
		const rowGap = layout.rowGap;
		const rowHeight = itemHeight + rowGap;
		const total = this._cache.logicalTotal;
		const totalRows = Math.ceil(total / columns);

		let firstRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
		firstRow = Math.min(firstRow, totalRows);
		const visibleRows = Math.ceil(viewportHeight / rowHeight) + BUFFER_ROWS * 2;
		const lastRow = Math.min(firstRow + visibleRows, totalRows);

		const start = Math.min(firstRow * columns, total);
		const end = Math.min(lastRow * columns, total);

		// No start===_vStart early-return: windowed must re-render when a page
		// splices in even if the range is unchanged.

		const topSpacerHeight = firstRow * rowHeight;
		const bottomSpacerHeight = (totalRows - lastRow) * rowHeight;

		const frag = document.createDocumentFragment();
		if (topSpacerHeight > 0) {
			const topSpacer = document.createElement(this.isUl ? 'li' : 'div');
			topSpacer.className = 'ln-list__spacer';
			topSpacer.setAttribute('aria-hidden', 'true');
			topSpacer.style.height = topSpacerHeight + 'px';
			frag.appendChild(topSpacer);
		}
		for (let i = start; i < end; i++) {
			if (this._cache.has(i)) {
				const el = this._buildItem(this._cache.get(i));
				if (el) frag.appendChild(el);
			} else {
				frag.appendChild(this._buildPlaceholderItem());
			}
		}
		if (bottomSpacerHeight > 0) {
			const bottomSpacer = document.createElement(this.isUl ? 'li' : 'div');
			bottomSpacer.className = 'ln-list__spacer';
			bottomSpacer.setAttribute('aria-hidden', 'true');
			bottomSpacer.style.height = bottomSpacerHeight + 'px';
			frag.appendChild(bottomSpacer);
		}

		const scrollState = _saveScroll(this);
		this.tbody.textContent = '';
		this.tbody.appendChild(frag);
		_restoreScroll(scrollState);

		// Select-all disabled in windowed mode — no _updateSelectAll().
		this._vStart = start;
		this._vEnd = end;

		this._cache.ensure(start, end);
	};

	_component.prototype._showEmptyState = function () {
		this.tbody.textContent = '';

		let el = null;
		if (this.isDataDriven) {
			const total = this._lastTotal != null ? this._lastTotal : this._data.length;
			const visible = this.visibleCount;
			// The source owns the query (docs/architecture/shared-query.md) — narrowed to
			// zero while records exist is the only signal the view gets.
			const isFiltered = visible === 0 && total > 0;
			const templateName = isFiltered ? this.name + '-empty-filtered' : this.name + '-empty';

			el = cloneTemplateScoped(this.dom, templateName, 'ln-list');
			if (!el) {
				const fallback = this.dom.querySelector('template[data-ln-empty]');
				if (fallback) {
					const condition = isFiltered ? 'search' : 'initial';
					const matched = fallback.content.querySelector(`[data-ln-empty-when="${condition}"]`) || fallback.content.firstElementChild;
					if (matched) el = document.importNode(matched, true);
				}
			}
		} else {
			const fallback = this.dom.querySelector(`template[${EMPTY_TEMPLATE}]`);
			if (fallback) {
				const matched = fallback.content.firstElementChild;
				if (matched) {
					el = document.importNode(matched, true);
				}
			}
		}

		if (el) {
			if (el.tagName === 'LI' || el.tagName === 'TR') {
				this.tbody.appendChild(el);
			} else {
				const item = document.createElement(this.isUl ? 'li' : 'div');
				item.appendChild(el);
				this.tbody.appendChild(item);
			}
		}

		dispatch(this.dom, 'ln-list:empty', {
			term: this.isDataDriven ? this.currentSearch : this._searchTerm,
			total: this.isDataDriven ? (this._lastTotal != null ? this._lastTotal : this._data.length) : this._data.length
		});
	};

	_component.prototype._buildItem = function (item) {
		const clone = cloneTemplateScoped(this.dom, this.name + '-row', 'ln-list');
		if (!clone) return null;

		const el = clone.querySelector('[data-ln-item]') || clone.firstElementChild;
		if (!el) return null;

		fillTemplate(el, item);
		fill(el, item);

		el._lnRecord = item;
		if (item.id != null) {
			el.setAttribute('data-ln-item-id', item.id);
			if (this._selectable && this.selectedIds.has(String(item.id))) {
				el.classList.add('ln-item-selected');
				const cb = el.querySelector('[data-ln-item-select]');
				if (cb) cb.checked = true;
			}
		}

		return el;
	};

	// ─── Selection Helpers ─────────────────────────────────────

	_component.prototype._restoreSelection = function () {
		if (!this.tbody) return;
		const items = this.tbody.querySelectorAll('[data-ln-item]');
		for (let i = 0; i < items.length; i++) {
			const id = items[i].getAttribute('data-ln-item-id');
			const selected = id != null && this.selectedIds.has(String(id));
			items[i].classList.toggle('ln-item-selected', selected);
			const cb = items[i].querySelector('[data-ln-item-select]');
			if (cb) cb.checked = selected;
		}
		this._updateSelectAll();
	};

	_component.prototype._enableSelection = function () {
		if (this._selectableActive) return;
		this._selectableActive = true;

		const self = this;

		this._onSelectionChange = function (e) {
			const cb = e.target.closest('[data-ln-item-select]');
			if (!cb) return;

			const itemEl = cb.closest('[data-ln-item]');
			if (!itemEl) return;

			const id = itemEl.getAttribute('data-ln-item-id');
			if (id == null) return;

			if (cb.checked) {
				self.selectedIds.add(String(id));
				itemEl.classList.add('ln-item-selected');
			} else {
				self.selectedIds.delete(String(id));
				itemEl.classList.remove('ln-item-selected');
			}

			self._updateSelectAll();
			self._updateFooter();

			dispatch(self.dom, 'ln-list:select', {
				list: self.name,
				selectedIds: self.selectedIds,
				count: self.selectedIds.size
			});
		};
		this.tbody.addEventListener('change', this._onSelectionChange);

		this._selectAllCheckbox = this.dom.querySelector('[data-ln-list-select-all]');
		if (this._selectAllCheckbox) {
			this._onSelectAll = function () {
				const checked = self._selectAllCheckbox.checked;
				const items = self.tbody.querySelectorAll('[data-ln-item]');
				for (let i = 0; i < items.length; i++) {
					const itemEl = items[i];
					const id = itemEl.getAttribute('data-ln-item-id');
					const cb = itemEl.querySelector('[data-ln-item-select]');
					if (id != null) {
						if (checked) {
							self.selectedIds.add(String(id));
							itemEl.classList.add('ln-item-selected');
						} else {
							self.selectedIds.delete(String(id));
							itemEl.classList.remove('ln-item-selected');
						}
						if (cb) cb.checked = checked;
					}
				}

				dispatch(self.dom, 'ln-list:select-all', { list: self.name, selected: checked });
				dispatch(self.dom, 'ln-list:select', {
					list: self.name,
					selectedIds: self.selectedIds,
					count: self.selectedIds.size
				});
				self._updateFooter();
			};
			this._selectAllCheckbox.addEventListener('change', this._onSelectAll);
		}
	};

	_component.prototype._updateSelectAll = function () {
		if (!this._selectAllCheckbox) return;
		const items = this.tbody.querySelectorAll('[data-ln-item]');
		let allSelected = items.length > 0;
		for (let i = 0; i < items.length; i++) {
			const id = items[i].getAttribute('data-ln-item-id');
			if (id != null && !this.selectedIds.has(String(id))) {
				allSelected = false;
				break;
			}
		}
		this._selectAllCheckbox.checked = allSelected;
	};

	_component.prototype._requestData = function () {
		if (this._windowed) {
			this.dom.classList.add('ln-list--loading');
			this._cache.invalidate({
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});
			return;
		}
		requestData(this, 'ln-list:request-data', 'list');
	};

	// ─── Windowed Mode — enter/exit/seed (live toggle) ──────────

	_component.prototype._enterWindowedMode = function () {
		const self = this;
		const dom = this.dom;
		const winAttr = parseInt(dom.getAttribute('data-ln-list-window'), 10);
		const pageAttr = parseInt(dom.getAttribute('data-ln-list-window-page'), 10);
		const threshAttr = parseInt(dom.getAttribute('data-ln-list-window-threshold'), 10);

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
			dispatch(dom, 'ln-list:rendered', {
				list: self.name,
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
				dispatch(dom, 'ln-list:request-data', {
					list: self.name,
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

		if (this._selectable && this._selectAllCheckbox) {
			this._selectAllCheckbox.classList.add('hidden');
		}
	};

	_component.prototype._kickWindowInitial = function () {
		if (this._data.length > 0) {
			// SSR-seeded / warm-seeded: page 0 is already resident, the grand
			// total is declared in markup — no initial fetch needed. No
			// queryGen on the seed — it must never be dropped as stale.
			const declaredTotal = parseInt(this.dom.getAttribute('data-ln-list-count'), 10);
			const seedTotal = declaredTotal > 0 ? declaredTotal : this._data.length;
			this._cache.ingest({
				data: this._data,
				offset: 0,
				total: seedTotal,
				filtered: seedTotal
			});
		} else {
			this.dom.classList.add('ln-list--loading');
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
		this._itemHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._data = [];
		this._filteredData = [];
		this.dom.classList.add('ln-list--loading');
		this._requestData();
	};

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

		const hasActiveFilter = filtered < total;

		if (this._totalSpan) this._totalSpan.textContent = _formatNum(total, this.dom);
		if (this._filteredSpan) this._filteredSpan.textContent = hasActiveFilter ? _formatNum(filtered, this.dom) : '';
		if (this._filteredWrap) this._filteredWrap.classList.toggle('hidden', !hasActiveFilter);

		if (this._selectedSpan) {
			const selected = this.selectedIds ? this.selectedIds.size : 0;
			this._selectedSpan.textContent = selected > 0 ? _formatNum(selected, this.dom) : '';
			if (this._selectedWrap) {
				this._selectedWrap.classList.toggle('hidden', selected === 0);
			}
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this._disableVirtualScroll();
		this.dom.removeEventListener('ln-list:request-clear-filters', this._onRequestClearFilters);

		if (this.isDataDriven) {
			if (this._cache) this._cache.destroy();
			this.dom.removeEventListener('ln-list:set-data', this._onSetData);
			this.dom.removeEventListener('ln-list:set-loading', this._onSetLoading);
			this.dom.removeEventListener('ln-list:page-failed', this._onPageFailed);
			this.dom.removeEventListener('ln-list:request-revalidate', this._onRequestRevalidate);
			this.dom.removeEventListener('ln-list:request-invalidate', this._onRequestInvalidate);
			this.dom.removeEventListener('ln-sort:change', this._onSort);

			if (this.tbody) {
				this.tbody.removeEventListener('click', this._onItemClick);
				this.tbody.removeEventListener('click', this._onItemAction);
			}
		} else {
			if (this._emptyObserver) {
				this._emptyObserver.disconnect();
				this._emptyObserver = null;
			}
			if (this._onSearchChange) this.dom.removeEventListener('ln-search:change', this._onSearchChange);
			if (this._onFilterChange) this.dom.removeEventListener('ln-filter:change', this._onFilterChange);
			if (this._onSort) this.dom.removeEventListener('ln-sort:change', this._onSort);
		}

		if (this._onSelectionChange && this.tbody) {
			this.tbody.removeEventListener('change', this._onSelectionChange);
		}
		if (this._selectAllCheckbox && this._onSelectAll) {
			this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);
		}

		this._data = [];
		this._filteredData = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-list', {
		extraAttributes: [
			'data-ln-list-window',
			'data-ln-list-window-page',
			'data-ln-list-window-threshold',
			'data-ln-list-count'
		],
		onAttributeChange: function (el, attrName) {
			const inst = el[DOM_ATTRIBUTE];
			if (!inst || !inst.isDataDriven) return;

			if (attrName === 'data-ln-list-window') {
				const present = el.hasAttribute('data-ln-list-window');
				if (present && !inst._windowed) {
					inst._enterWindowedMode();
					inst._kickWindowInitial();
				} else if (!present && inst._windowed) {
					inst._exitWindowedMode();
				} else if (present && inst._windowed) {
					const v = parseInt(el.getAttribute('data-ln-list-window'), 10);
					if (v > 0) inst._cache.configure({ windowSize: v });
				}
				return;
			}

			if (!inst._windowed || !inst._cache) return;
			if (attrName === 'data-ln-list-window-page') {
				const v = parseInt(el.getAttribute('data-ln-list-window-page'), 10);
				if (v > 0) inst._cache.configure({ pageSize: v });
			} else if (attrName === 'data-ln-list-window-threshold') {
				const v = parseInt(el.getAttribute('data-ln-list-window-threshold'), 10);
				if (v >= 0) inst._cache.configure({ threshold: v });
			} else if (attrName === 'data-ln-list-count') {
				const v = parseInt(el.getAttribute('data-ln-list-count'), 10);
				if (v >= 0) inst._cache.setGrandTotal(v);
			}
		}
	});
})();

