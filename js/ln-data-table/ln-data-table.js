import { cloneTemplateScoped, dispatch, registerComponent } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-data-table';
	const DOM_ATTRIBUTE = 'lnDataTable';

	// Tuning constant — duplicated in ln-table for component independence
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ROWS = 15;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Singleton formatter — same locale for all instances
	const _numFmt = typeof Intl !== 'undefined'
		? new Intl.NumberFormat(document.documentElement.lang || undefined)
		: null;

	function _formatNum(n) {
		return _numFmt ? _numFmt.format(n) : String(n);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.name = dom.getAttribute(DOM_SELECTOR) || '';
		this.table = dom.querySelector('table');
		this.tbody = dom.querySelector('[data-ln-data-table-body]') || dom.querySelector('tbody');
		this.thead = dom.querySelector('thead');
		this.ths = this.thead ? Array.from(this.thead.querySelectorAll('th')) : [];

		// Instance state
		this.isLoaded = false;
		this.totalCount = 0;
		this.visibleCount = 0;
		this.currentSort = null;
		this.currentFilters = {};
		this.currentSearch = '';
		this.selectedIds = new Set();

		// Internal data cache (last received payload)
		this._data = [];
		this._lastTotal = 0;
		this._lastFiltered = 0;

		// Virtual scroll state
		this._virtual = false;
		this._rowHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._rafId = null;
		this._scrollHandler = null;

		// Footer elements
		this._totalSpan = dom.querySelector('[data-ln-data-table-total]');
		this._filteredSpan = dom.querySelector('[data-ln-data-table-filtered]');

		// Filtered separator — the parent that wraps "· X filtered" text
		// Hide it when there's no active filtering
		if (this._filteredSpan) {
			this._filteredWrap = this._filteredSpan.parentElement !== dom
				? this._filteredSpan.closest('[data-ln-data-table-filtered-wrap]') || this._filteredSpan.parentNode
				: null;
		}

		// Selected count — the parent that wraps "· X selected" text
		// Hidden when nothing is selected
		this._selectedSpan = dom.querySelector('[data-ln-data-table-selected]');
		if (this._selectedSpan) {
			this._selectedWrap = this._selectedSpan.parentElement !== dom
				? this._selectedSpan.closest('[data-ln-data-table-selected-wrap]') || this._selectedSpan.parentNode
				: null;
		}

		const self = this;

		// ─── set-data event ────────────────────────────────────
		this._onSetData = function (e) {
			const detail = e.detail || {};
			self._data = detail.data || [];
			self._lastTotal = detail.total != null ? detail.total : self._data.length;
			self._lastFiltered = detail.filtered != null ? detail.filtered : self._data.length;

			self.totalCount = self._lastTotal;
			self.visibleCount = self._lastFiltered;
			self.isLoaded = true;

			self._renderRows();
			self._updateFooter();

			dispatch(dom, 'ln-data-table:rendered', {
				table: self.name,
				total: self.totalCount,
				visible: self.visibleCount
			});
		};
		dom.addEventListener('ln-data-table:set-data', this._onSetData);

		// ─── set-loading event ─────────────────────────────────
		this._onSetLoading = function (e) {
			const loading = e.detail && e.detail.loading;
			dom.classList.toggle('ln-data-table--loading', !!loading);
			if (loading) {
				self.isLoaded = false;
			}
		};
		dom.addEventListener('ln-data-table:set-loading', this._onSetLoading);

		// ─── Sort — click on [data-ln-col-sort] buttons ───────
		this._sortButtons = Array.from(dom.querySelectorAll('[data-ln-col-sort]'));
		this._onSortClick = function (e) {
			const btn = e.target.closest('[data-ln-col-sort]');
			if (!btn) return;
			const th = btn.closest('th');
			if (!th) return;
			const field = th.getAttribute('data-ln-col');
			if (!field) return;
			self._handleSort(field, th);
		};
		if (this.thead) {
			this.thead.addEventListener('click', this._onSortClick);
		}

		// ─── Filter — click on [data-ln-col-filter] buttons ───
		this._activeDropdown = null;     // { field, th, el }
		this._onFilterClick = function (e) {
			const btn = e.target.closest('[data-ln-col-filter]');
			if (!btn) return;
			e.stopPropagation();
			const th = btn.closest('th');
			if (!th) return;
			const field = th.getAttribute('data-ln-col');
			if (!field) return;

			// Toggle: close if already open for this field
			if (self._activeDropdown && self._activeDropdown.field === field) {
				self._closeFilterDropdown();
				return;
			}
			self._openFilterDropdown(field, th, btn);
		};
		if (this.thead) {
			this.thead.addEventListener('click', this._onFilterClick);
		}

		// Outside click closes filter dropdown
		this._onDocClick = function () {
			if (self._activeDropdown) self._closeFilterDropdown();
		};
		document.addEventListener('click', this._onDocClick);

		// Clear all filters button
		this._onClearAll = function (e) {
			const btn = e.target.closest('[data-ln-data-table-clear-all]');
			if (!btn) return;
			self.currentFilters = {};
			self._updateFilterIndicators();
			dispatch(dom, 'ln-data-table:clear-filters', { table: self.name });
			self._requestData();
		};
		dom.addEventListener('click', this._onClearAll);

		// ─── Selection — row checkboxes + select-all ──────────
		this._selectable = dom.hasAttribute('data-ln-data-table-selectable');
		if (this._selectable) {
			this._onSelectionChange = function (e) {
				const checkbox = e.target.closest('[data-ln-row-select]');
				if (!checkbox) return;
				const tr = checkbox.closest('[data-ln-row]');
				if (!tr) return;
				const id = tr.getAttribute('data-ln-row-id');
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

				dispatch(dom, 'ln-data-table:select', {
					table: self.name,
					selectedIds: self.selectedIds,
					count: self.selectedCount
				});
			};
			if (this.tbody) this.tbody.addEventListener('change', this._onSelectionChange);

			// Select-all checkbox in header
			this._selectAllCheckbox = dom.querySelector('[data-ln-col-select] input[type="checkbox"]')
				|| dom.querySelector('[data-ln-col-select]');
			if (this._selectAllCheckbox && this._selectAllCheckbox.tagName === 'TH') {
				// Create a checkbox inside the th if it doesn't have one
				const cb = document.createElement('input');
				cb.type = 'checkbox';
				cb.setAttribute('aria-label', 'Select all');
				this._selectAllCheckbox.appendChild(cb);
				this._selectAllCheckbox = cb;
			}

			if (this._selectAllCheckbox) {
				this._onSelectAll = function () {
					const checked = self._selectAllCheckbox.checked;
					const rows = self.tbody ? self.tbody.querySelectorAll('[data-ln-row]') : [];

					for (let i = 0; i < rows.length; i++) {
						const id = rows[i].getAttribute('data-ln-row-id');
						const rowCb = rows[i].querySelector('[data-ln-row-select]');
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
					dispatch(dom, 'ln-data-table:select-all', {
						table: self.name,
						selected: checked
					});
					dispatch(dom, 'ln-data-table:select', {
						table: self.name,
						selectedIds: self.selectedIds,
						count: self.selectedCount
					});
					self._updateFooter();
				};
				this._selectAllCheckbox.addEventListener('change', this._onSelectAll);
			}

			// Sync initial checkbox state (browser form restore)
			if (this.tbody) {
				const rows = this.tbody.querySelectorAll('[data-ln-row]');
				for (let i = 0; i < rows.length; i++) {
					const cb = rows[i].querySelector('[data-ln-row-select]');
					const id = rows[i].getAttribute('data-ln-row-id');
					if (cb && cb.checked && id != null) {
						this.selectedIds.add(id);
						rows[i].classList.add('ln-row-selected');
					}
				}
				this.selectedCount = this.selectedIds.size;
				if (this.selectedCount > 0) this._updateSelectAll();
			}
		}

		// ─── Row click + Row actions ───────────────────────────
		this._onRowClick = function (e) {
			// Skip if clicking checkbox, action button, link, or button
			if (e.target.closest('[data-ln-row-select]')) return;
			if (e.target.closest('[data-ln-row-action]')) return;
			if (e.target.closest('a') || e.target.closest('button')) return;

			// Allow ctrl/meta/middle-click to pass through
			if (e.ctrlKey || e.metaKey || e.button === 1) return;

			const tr = e.target.closest('[data-ln-row]');
			if (!tr) return;

			const id = tr.getAttribute('data-ln-row-id');
			const record = tr._lnRecord || {};

			dispatch(dom, 'ln-data-table:row-click', {
				table: self.name,
				id: id,
				record: record
			});
		};
		if (this.tbody) this.tbody.addEventListener('click', this._onRowClick);

		// Row action buttons
		this._onRowAction = function (e) {
			const btn = e.target.closest('[data-ln-row-action]');
			if (!btn) return;

			e.stopPropagation();
			const tr = btn.closest('[data-ln-row]');
			if (!tr) return;

			const action = btn.getAttribute('data-ln-row-action');
			const id = tr.getAttribute('data-ln-row-id');
			const record = tr._lnRecord || {};

			dispatch(dom, 'ln-data-table:row-action', {
				table: self.name,
				id: id,
				action: action,
				record: record
			});
		};
		if (this.tbody) this.tbody.addEventListener('click', this._onRowAction);

		// ─── Search — input on [data-ln-data-table-search] ────
		this._searchInput = dom.querySelector('[data-ln-data-table-search]');
		if (this._searchInput) {
			this._onSearchInput = function () {
				self.currentSearch = self._searchInput.value;
				dispatch(dom, 'ln-data-table:search', {
					table: self.name,
					query: self.currentSearch
				});
				self._requestData();
			};
			this._searchInput.addEventListener('input', this._onSearchInput);
		}

		// ─── Keyboard navigation ──────────────────────────────
		this._focusedRowIndex = -1;

		this._onKeydown = function (e) {
			// Only handle keys when table area has focus
			if (!dom.contains(document.activeElement) && document.activeElement !== document.body) return;
			// Don't intercept when typing in search/filter inputs
			if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

			// / focuses search (only when no input is active — checked above)
			if (e.key === '/') {
				if (self._searchInput) {
					e.preventDefault();
					self._searchInput.focus();
				}
				return;
			}

			const rows = self.tbody ? Array.from(self.tbody.querySelectorAll('[data-ln-row]')) : [];
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
						dispatch(dom, 'ln-data-table:row-click', {
							table: self.name,
							id: tr.getAttribute('data-ln-row-id'),
							record: tr._lnRecord || {}
						});
					}
					break;
				case ' ':
					if (self._selectable && self._focusedRowIndex >= 0 && self._focusedRowIndex < rows.length) {
						e.preventDefault();
						const cb = rows[self._focusedRowIndex].querySelector('[data-ln-row-select]');
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

		// Fire initial request-data so coordinator knows table is ready
		dispatch(dom, 'ln-data-table:request-data', {
			table: this.name,
			sort: this.currentSort,
			filters: this.currentFilters,
			search: this.currentSearch
		});

		return this;
	}

	// ─── Sort ──────────────────────────────────────────────────

	_component.prototype._handleSort = function (field, th) {
		let newDir;

		if (!this.currentSort || this.currentSort.field !== field) {
			newDir = 'asc';
		} else if (this.currentSort.direction === 'asc') {
			newDir = 'desc';
		} else {
			newDir = null;
		}

		// Reset all sort classes
		for (let i = 0; i < this.ths.length; i++) {
			this.ths[i].classList.remove('ln-sort-asc', 'ln-sort-desc');
		}

		if (newDir) {
			this.currentSort = { field: field, direction: newDir };
			th.classList.add(newDir === 'asc' ? 'ln-sort-asc' : 'ln-sort-desc');
		} else {
			this.currentSort = null;
		}

		dispatch(this.dom, 'ln-data-table:sort', {
			table: this.name,
			field: field,
			direction: newDir
		});

		this._requestData();
	};

	// ─── Request data (shared helper) ──────────────────────────

	_component.prototype._requestData = function () {
		dispatch(this.dom, 'ln-data-table:request-data', {
			table: this.name,
			sort: this.currentSort,
			filters: this.currentFilters,
			search: this.currentSearch
		});
	};

	// ─── Selection helpers ─────────────────────────────────────

	_component.prototype._updateSelectAll = function () {
		if (!this._selectAllCheckbox || !this.tbody) return;
		const rows = this.tbody.querySelectorAll('[data-ln-row]');
		let allSelected = rows.length > 0;
		for (let i = 0; i < rows.length; i++) {
			const id = rows[i].getAttribute('data-ln-row-id');
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

	// ─── Keyboard focus ───────────────────────────────────────

	_component.prototype._focusRow = function (rows) {
		// Remove focus from all
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

	// ─── Filter dropdown ───────────────────────────────────────

	_component.prototype._openFilterDropdown = function (field, th, btn) {
		this._closeFilterDropdown();

		// Try table-scoped template first, fall back to generic
		const clone = cloneTemplateScoped(this.dom, this.name + '-column-filter', 'ln-data-table')
			|| cloneTemplateScoped(this.dom, 'column-filter', 'ln-data-table');
		if (!clone) return;

		const dropdown = clone.firstElementChild;
		if (!dropdown) return;

		// Populate checkboxes with unique values from data
		const uniqueValues = this._getUniqueValues(field);
		const optionsList = dropdown.querySelector('[data-ln-filter-options]');
		const searchInput = dropdown.querySelector('[data-ln-filter-search]');
		const activeValues = this.currentFilters[field] || [];
		const self = this;

		// Hide search if <=8 values
		if (searchInput && uniqueValues.length <= 8) {
			searchInput.classList.add('hidden');
		}

		// Build checkbox items
		if (optionsList) {
			for (let i = 0; i < uniqueValues.length; i++) {
				const val = uniqueValues[i];
				const li = document.createElement('li');
				const label = document.createElement('label');
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.value = val;
				checkbox.checked = activeValues.length === 0 || activeValues.indexOf(val) !== -1;
				label.appendChild(checkbox);
				label.appendChild(document.createTextNode(' ' + val));
				li.appendChild(label);
				optionsList.appendChild(li);
			}

			// Checkbox change handler
			optionsList.addEventListener('change', function (e) {
				if (e.target.type !== 'checkbox') return;
				self._onFilterChange(field, optionsList);
			});
		}

		// Search within dropdown values
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

		// Clear filter button
		const clearBtn = dropdown.querySelector('[data-ln-filter-clear]');
		if (clearBtn) {
			clearBtn.addEventListener('click', function () {
				delete self.currentFilters[field];
				self._closeFilterDropdown();
				self._updateFilterIndicators();
				dispatch(self.dom, 'ln-data-table:filter', {
					table: self.name,
					field: field,
					values: []
				});
				self._requestData();
			});
		}

		// Append to th — CSS handles positioning (th is relative, dropdown is absolute)
		th.appendChild(dropdown);

		this._activeDropdown = { field: field, th: th, el: dropdown };

		// Stop click propagation inside dropdown
		dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
	};

	_component.prototype._closeFilterDropdown = function () {
		if (!this._activeDropdown) return;
		if (this._activeDropdown.el && this._activeDropdown.el.parentNode) {
			this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el);
		}
		this._activeDropdown = null;
	};

	_component.prototype._onFilterChange = function (field, optionsList) {
		const checkboxes = optionsList.querySelectorAll('input[type="checkbox"]');
		const checked = [];
		let allChecked = true;

		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) {
				checked.push(checkboxes[i].value);
			} else {
				allChecked = false;
			}
		}

		// All checked = no filter active for this field
		if (allChecked || checked.length === 0) {
			delete this.currentFilters[field];
		} else {
			this.currentFilters[field] = checked;
		}

		this._updateFilterIndicators();

		dispatch(this.dom, 'ln-data-table:filter', {
			table: this.name,
			field: field,
			values: allChecked ? [] : checked
		});

		this._requestData();
	};

	_component.prototype._getUniqueValues = function (field) {
		const seen = {};
		const result = [];
		const data = this._data;

		for (let i = 0; i < data.length; i++) {
			const val = data[i][field];
			if (val != null && !seen[val]) {
				seen[val] = true;
				result.push(String(val));
			}
		}

		result.sort();
		return result;
	};

	_component.prototype._updateFilterIndicators = function () {
		const ths = this.ths;
		for (let i = 0; i < ths.length; i++) {
			const th = ths[i];
			const field = th.getAttribute('data-ln-col');
			if (!field) continue;
			const btn = th.querySelector('[data-ln-col-filter]');
			if (!btn) continue;
			const hasFilter = this.currentFilters[field] && this.currentFilters[field].length > 0;
			btn.classList.toggle('ln-filter-active', !!hasFilter);
		}
	};

	// ─── Row rendering ─────────────────────────────────────────

	_component.prototype._renderRows = function () {
		if (!this.tbody) return;

		const data = this._data;
		const total = this._lastTotal;
		const filtered = this._lastFiltered;

		// Empty state: no data at all
		if (total === 0) {
			this._disableVirtualScroll();
			this._showEmptyState(this.name + '-empty');
			return;
		}

		// Empty state: filters returned zero
		if (data.length === 0 || filtered === 0) {
			this._disableVirtualScroll();
			this._showEmptyState(this.name + '-empty-filtered');
			return;
		}

		if (data.length > VIRTUAL_THRESHOLD) {
			this._enableVirtualScroll();
			this._renderVirtual();
		} else {
			this._disableVirtualScroll();
			this._renderAll();
		}
	};

	_component.prototype._renderAll = function () {
		const data = this._data;
		const frag = document.createDocumentFragment();

		for (let i = 0; i < data.length; i++) {
			const tr = this._buildRow(data[i]);
			if (!tr) break;
			frag.appendChild(tr);
		}

		this.tbody.textContent = '';
		this.tbody.appendChild(frag);

		if (this._selectable) this._updateSelectAll();
	};

	_component.prototype._buildRow = function (record) {
		const clone = cloneTemplateScoped(this.dom, this.name + '-row', 'ln-data-table');
		if (!clone) return null;

		const tr = clone.querySelector('[data-ln-row]') || clone.firstElementChild;
		if (!tr) return null;

		this._fillRow(tr, record);

		tr._lnRecord = record;
		if (record.id != null) {
			tr.setAttribute('data-ln-row-id', record.id);
		}

		// Restore selection state
		if (this._selectable && record.id != null && this.selectedIds.has(String(record.id))) {
			tr.classList.add('ln-row-selected');
			const rowCb = tr.querySelector('[data-ln-row-select]');
			if (rowCb) rowCb.checked = true;
		}

		return tr;
	};

	// ─── Virtual scroll ────────────────────────────────────────

	_component.prototype._enableVirtualScroll = function () {
		if (this._virtual) return;
		this._virtual = true;
		this._vStart = -1;
		this._vEnd = -1;
		const self = this;

		// Measure row height from first row
		if (!this._rowHeight) {
			const tempRow = this._buildRow(this._data[0]);
			if (tempRow) {
				this.tbody.textContent = '';
				this.tbody.appendChild(tempRow);
				this._rowHeight = tempRow.offsetHeight || 40;
				this.tbody.textContent = '';
			}
		}

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
		const data = this._data;
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
		const frag = document.createDocumentFragment();

		// Top spacer
		if (topH > 0) {
			const topSpacer = document.createElement('tr');
			topSpacer.className = 'ln-data-table__spacer';
			topSpacer.setAttribute('aria-hidden', 'true');
			const topTd = document.createElement('td');
			topTd.setAttribute('colspan', colSpan);
			topTd.style.height = topH + 'px';
			topSpacer.appendChild(topTd);
			frag.appendChild(topSpacer);
		}

		// Visible rows
		for (let i = startRow; i < endRow; i++) {
			const tr = this._buildRow(data[i]);
			if (tr) frag.appendChild(tr);
		}

		// Bottom spacer
		if (bottomH > 0) {
			const bottomSpacer = document.createElement('tr');
			bottomSpacer.className = 'ln-data-table__spacer';
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
	};

	// ─── Fill row cells ────────────────────────────────────────

	_component.prototype._fillRow = function (tr, record) {
		// data-ln-cell="field" → textContent
		const cells = tr.querySelectorAll('[data-ln-cell]');
		for (let i = 0; i < cells.length; i++) {
			const el = cells[i];
			const field = el.getAttribute('data-ln-cell');
			if (record[field] != null) {
				el.textContent = record[field];
			}
		}

		// data-ln-cell-attr="field:attr" → setAttribute
		const cellAttrs = tr.querySelectorAll('[data-ln-cell-attr]');
		for (let i = 0; i < cellAttrs.length; i++) {
			const el = cellAttrs[i];
			const pairs = el.getAttribute('data-ln-cell-attr').split(',');
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

	// ─── Empty state ───────────────────────────────────────────

	_component.prototype._showEmptyState = function (templateName) {
		const clone = cloneTemplateScoped(this.dom, templateName, 'ln-data-table');
		this.tbody.textContent = '';
		if (clone) {
			this.tbody.appendChild(clone);
		}
	};

	// ─── Footer ────────────────────────────────────────────────

	_component.prototype._updateFooter = function () {
		const total = this._lastTotal;
		const filtered = this._lastFiltered;
		const isFiltered = filtered < total;

		if (this._totalSpan) {
			this._totalSpan.textContent = _formatNum(total);
		}

		if (this._filteredSpan) {
			this._filteredSpan.textContent = isFiltered ? _formatNum(filtered) : '';
		}

		// Hide filtered wrapper when not filtering
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

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-data-table:set-data', this._onSetData);
		this.dom.removeEventListener('ln-data-table:set-loading', this._onSetLoading);
		if (this.thead) {
			this.thead.removeEventListener('click', this._onSortClick);
			this.thead.removeEventListener('click', this._onFilterClick);
		}
		document.removeEventListener('click', this._onDocClick);
		document.removeEventListener('keydown', this._onKeydown);
		if (this._searchInput) this._searchInput.removeEventListener('input', this._onSearchInput);
		if (this.tbody) {
			this.tbody.removeEventListener('click', this._onRowClick);
			this.tbody.removeEventListener('click', this._onRowAction);
		}
		if (this._selectable && this.tbody) this.tbody.removeEventListener('change', this._onSelectionChange);
		if (this._selectAllCheckbox) this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);
		this.dom.removeEventListener('click', this._onClearAll);
		this._closeFilterDropdown();
		this._disableVirtualScroll();
		this._data = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-table');
})();
