import { cloneTemplateScoped, dispatch, fill, fillTemplate, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-list';
	const DOM_ATTRIBUTE = 'lnList';
	const EMPTY_TEMPLATE = 'data-ln-list-empty';
	const VIRTUAL_THRESHOLD = 200;
	const BUFFER_ITEMS = 15;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
		this.tbody = dom.querySelector('[data-ln-list-body]') || dom;
		this.isDataDriven = dom.hasAttribute('data-ln-list-source');
		this.name = dom.getAttribute(DOM_SELECTOR) || '';
		this.source = dom.getAttribute('data-ln-list-source') || '';

		this._data = [];
		this._filteredData = [];
		this._searchTerm = '';
		this._columnFilters = {};

		// Virtual scroll state
		this._virtual = false;
		this._itemHeight = 0;
		this._vStart = -1;
		this._vEnd = -1;
		this._rafId = null;
		this._scrollHandler = null;
		this._scrollContainer = null;
		this.isUl = this.tbody.tagName === 'UL' || this.tbody.tagName === 'OL';

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

			// Footer elements
			this._totalSpan = dom.querySelector('[data-ln-list-total]');
			this._filteredSpan = dom.querySelector('[data-ln-list-filtered]');
			if (this._filteredSpan) {
				this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== dom
					? this._filteredSpan.closest('[data-ln-list-filtered-wrap]') || this._filteredSpan.parentNode
					: null;
			}
			this._selectedSpan = dom.querySelector('[data-ln-list-selected]');
			if (this._selectedSpan) {
				this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== dom
					? this._selectedSpan.closest('[data-ln-list-selected-wrap]') || this._selectedSpan.parentNode
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

			// Clear all
			this._onClearAll = function (e) {
				const btn = e.target.closest('[data-ln-list-clear-all]') || e.target.closest('[data-ln-data-list-clear-all]');
				if (!btn) return;
				self.currentFilters = {};
				dispatch(dom, 'ln-list:clear-filters', { list: self.name });
				self._requestData();
			};
			dom.addEventListener('click', this._onClearAll);

			// --- Selection ---
			this._selectable = dom.hasAttribute('data-ln-list-selectable');
			this._selectableActive = false;
			if (this._selectable) {
				this._enableSelection();
			}

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

			// --- Search Change ---
			this._onSearchChange = function (e) {
				e.preventDefault();
				self.currentSearch = e.detail.term;
				dispatch(dom, 'ln-list:search', {
					list: self.name,
					query: self.currentSearch
				});
				self._requestData();
			};
			dom.addEventListener('ln-search:change', this._onSearchChange);

			// Local hydration of initial items
			if (this.tbody && this.tbody.children.length > 0) {
				this._parseChildren();
			}

			// Initial request-data
			dispatch(dom, 'ln-list:request-data', {
				table: this.name,
				sort: this.currentSort,
				filters: this.currentFilters,
				search: this.currentSearch
			});

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

			this._onSearch = function (e) {
				e.preventDefault();
				self._searchTerm = e.detail.term;
				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				dispatch(dom, 'ln-list:filter', {
					term: self._searchTerm,
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('ln-search:change', this._onSearch);

			this._onClear = function (e) {
				const btn = e.target.closest('[data-ln-list-clear]');
				if (!btn) return;

				self._searchTerm = '';
				const searchEl = document.querySelector('[data-ln-search="' + dom.id + '"]');
				if (searchEl) {
					const input = searchEl.tagName === 'INPUT' ? searchEl : searchEl.querySelector('input');
					if (input) input.value = '';
				}

				self._applyFilterAndSort();
				self._vStart = -1;
				self._vEnd = -1;
				self._render();
				dispatch(dom, 'ln-list:filter', {
					term: '',
					matched: self._filteredData.length,
					total: self._data.length
				});
			};
			dom.addEventListener('click', this._onClear);
		}

		return this;
	}

	// ─── Parse Children into in-memory array ───────────────────

	_component.prototype._parseChildren = function () {
		const children = Array.from(this.tbody.children).filter(el => !el.classList.contains('ln-list__spacer'));
		this._data = [];

		if (children.length > 0) this._itemHeight = children[0].offsetHeight || 50;

		for (let i = 0; i < children.length; i++) {
			const el = children[i];
			const id = el.getAttribute('data-ln-item-id') || el.getAttribute('id');
			const text = el.textContent.trim().toLowerCase();

			let record = null;
			if (this.isDataDriven) {
				record = {};
				if (id != null) record.id = id;

				const fields = el.querySelectorAll('[data-ln-field]');
				for (let j = 0; j < fields.length; j++) {
					const f = fields[j];
					const prop = f.getAttribute('data-ln-field');
					if (prop) {
						record[prop] = f.textContent.trim();
					}
				}
			}

			this._data.push({
				html: el.outerHTML,
				searchText: text,
				id: id,
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

		dispatch(this.dom, 'ln-list:ready', {
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
			const multiplier = this.currentSort.direction === 'desc' ? -1 : 1;

			const compare = typeof Intl !== 'undefined'
				? new Intl.Collator(document.documentElement.lang || undefined, { sensitivity: 'base' }).compare
				: function (a, b) { return a < b ? -1 : a > b ? 1 : 0; };

			this._filteredData.sort(function (a, b) {
				const valA = a[field];
				const valB = b[field];

				if (typeof valA === 'number' && typeof valB === 'number') {
					return (valA - valB) * multiplier;
				}

				const strA = valA != null ? String(valA) : '';
				const strB = valB != null ? String(valB) : '';
				return compare(strA, strB) * multiplier;
			});

		} else {
			const term = this._searchTerm;
			if (!term) {
				this._filteredData = this._data.slice();
			} else {
				this._filteredData = this._data.filter(function (row) {
					return row.searchText.indexOf(term) !== -1;
				});
			}
		}
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		if (!this.tbody) return;

		if (this.isDataDriven) {
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
		}
	};

	_component.prototype._renderAll = function () {
		if (this.isDataDriven) {
			const data = this._filteredData;
			const frag = document.createDocumentFragment();

			for (let i = 0; i < data.length; i++) {
				const el = this._buildItem(data[i]);
				if (!el) break;
				frag.appendChild(el);
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

		if (!this._itemHeight) {
			if (this.isDataDriven) {
				if (this._data.length > 0) {
					const el = this._buildItem(this._data[0]);
					if (el) {
						this.tbody.textContent = '';
						this.tbody.appendChild(el);
						this._itemHeight = el.offsetHeight || 50;
						this.tbody.textContent = '';
					}
				}
			} else {
				const children = this.tbody.children;
				if (children.length > 0) {
					this._itemHeight = children[0].offsetHeight || 50;
				}
			}
		}

		this._scrollContainer = _findScrollContainer(this.dom);
		const container = this._scrollContainer || window;

		this._scrollHandler = function () {
			if (!self._rafId) {
				self._rafId = requestAnimationFrame(function () {
					self._rafId = null;
					self._renderVirtual();
				});
			}
		};

		container.addEventListener('scroll', this._scrollHandler, { passive: true });
		window.addEventListener('resize', this._scrollHandler, { passive: true });
	};

	_component.prototype._disableVirtualScroll = function () {
		if (!this._virtual) return;
		this._virtual = false;

		if (this._scrollHandler) {
			const container = this._scrollContainer || window;
			container.removeEventListener('scroll', this._scrollHandler);
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
		const count = data.length;
		const itemHeight = this._itemHeight;
		if (!itemHeight || !count) return;

		const container = this._scrollContainer;
		let scrollTop, viewportHeight;

		if (container) {
			const rect = this.tbody.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const relativeTop = rect.top - containerRect.top + container.scrollTop;
			scrollTop = container.scrollTop - relativeTop;
			viewportHeight = container.clientHeight;
		} else {
			const rect = this.tbody.getBoundingClientRect();
			const absoluteTop = rect.top + window.scrollY;
			scrollTop = window.scrollY - absoluteTop;
			viewportHeight = window.innerHeight;
		}

		let start = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER_ITEMS);
		start = Math.min(start, count);
		const end = Math.min(start + Math.ceil(viewportHeight / itemHeight) + BUFFER_ITEMS * 2, count);

		if (start === this._vStart && end === this._vEnd) return;

		this._vStart = start;
		this._vEnd = end;

		const topSpacerHeight = start * itemHeight;
		const bottomSpacerHeight = (count - end) * itemHeight;

		if (this.isDataDriven) {
			const frag = document.createDocumentFragment();

			if (topSpacerHeight > 0) {
				const topSpacer = document.createElement(this.isUl ? 'li' : 'div');
				topSpacer.className = 'ln-list__spacer';
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
				bottomSpacer.style.height = bottomSpacerHeight + 'px';
				frag.appendChild(bottomSpacer);
			}

			this.tbody.textContent = '';
			this.tbody.appendChild(frag);

			if (this._selectable) this._updateSelectAll();
		} else {
			let html = '';
			if (topSpacerHeight > 0) {
				html += `<${this.isUl ? 'li' : 'div'} class="ln-list__spacer" style="height:${topSpacerHeight}px;padding:0;border:none"></${this.isUl ? 'li' : 'div'}>`;
			}
			for (let i = start; i < end; i++) {
				html += data[i].html;
			}
			if (bottomSpacerHeight > 0) {
				html += `<${this.isUl ? 'li' : 'div'} class="ln-list__spacer" style="height:${bottomSpacerHeight}px;padding:0;border:none"></${this.isUl ? 'li' : 'div'}>`;
			}
			this.tbody.innerHTML = html;
		}
	};

	_component.prototype._showEmptyState = function () {
		this.tbody.textContent = '';

		let el = null;
		if (this.isDataDriven) {
			const total = this._lastTotal != null ? this._lastTotal : this._data.length;
			const visible = this.visibleCount;
			const isFiltered = this.currentSearch && (visible < total || visible === 0);
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
				el = document.importNode(fallback.content, true);
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

	_component.prototype._updateFooter = function () {
		if (!this.isDataDriven) return;
		const total = this._lastTotal != null ? this._lastTotal : this._data.length;
		const filtered = this.visibleCount;
		const hasActiveFilter = filtered < total;

		if (this._totalSpan) this._totalSpan.textContent = total;
		if (this._filteredSpan) this._filteredSpan.textContent = hasActiveFilter ? filtered : '';
		if (this._filteredWrap) this._filteredWrap.classList.toggle('hidden', !hasActiveFilter);

		if (this._selectedSpan) {
			const selected = this.selectedIds.size;
			this._selectedSpan.textContent = selected > 0 ? selected : '';
			if (this._selectedWrap) {
				this._selectedWrap.classList.toggle('hidden', selected === 0);
			}
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this._disableVirtualScroll();

		if (this.isDataDriven) {
			this.dom.removeEventListener('ln-list:set-data', this._onSetData);
			this.dom.removeEventListener('ln-list:set-loading', this._onSetLoading);
			this.dom.removeEventListener('click', this._onClearAll);

			if (this.tbody) {
				this.tbody.removeEventListener('click', this._onItemClick);
				this.tbody.removeEventListener('click', this._onItemAction);
			}

			if (this._onSelectionChange && this.tbody) {
				this.tbody.removeEventListener('change', this._onSelectionChange);
			}
			if (this._selectAllCheckbox && this._onSelectAll) {
				this._selectAllCheckbox.removeEventListener('change', this._onSelectAll);
			}

			this.dom.removeEventListener('ln-search:change', this._onSearchChange);
		} else {
			if (this._emptyObserver) {
				this._emptyObserver.disconnect();
				this._emptyObserver = null;
			}
			this.dom.removeEventListener('ln-search:change', this._onSearch);
			this.dom.removeEventListener('click', this._onClear);
		}

		this._data = [];
		this._filteredData = [];
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-list');
})();
