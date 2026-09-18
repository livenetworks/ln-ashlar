import { attrSpec, attrStr, createBatcher, defineAttrs, dispatch, dispatchCancelable, hashFilterDecode, hashFilterEncode, hashGet, hashSet, matchesFilterValues, queueBoot, readValue, registerComponent, resolveHashNamespace } from '../../ln-core';
import { arraysDiffer, decodeFilterValues, deriveActiveFilters, encodeFilterValues, evaluateRowFilters, resolveColumnIndex } from './filter-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const RESET_ATTR = 'data-ln-filter-reset';
	const COL_ATTR = 'data-ln-filter-col';
	const HASH_ATTR = 'data-ln-hash';
	const VALUES_ATTR = 'data-ln-filter-values';

	// Shared column filter state per plain table (AND across columns, OR within column)
	const _tableFilters = new WeakMap();

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-filter':        { prop: 'targetId', read: attrStr, fallback: null },
		'data-ln-hash':          { effect: _syncAttribute },
		'data-ln-filter-values': { effect: _syncAttribute },
		'data-ln-filter-col':    {},
		'data-ln-filter-key':    {},
		'data-ln-filter-reset':  {},
		'data-ln-filter-value':  {},
		'data-ln-filter-hide':   {}
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	function _isReset(input) {
		return input.hasAttribute(RESET_ATTR) || !input.getAttribute(VALUE_ATTR);
	}

	function _deriveActive(self) {
		const inputs = self.dom.querySelectorAll('[' + KEY_ATTR + ']');
		const descriptors = [];
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			descriptors.push({
				key: input.getAttribute(KEY_ATTR),
				value: input.getAttribute(VALUE_ATTR) || '',
				checked: input.checked,
				isReset: _isReset(input)
			});
		}
		const active = deriveActiveFilters(descriptors);
		return { key: active.key, values: active.values, targetId: self.targetId };
	}

	function _applyInputValues(dom, key, values) {
		const inputs = dom.querySelectorAll('[' + KEY_ATTR + ']');
		const hasValues = Array.isArray(values) && values.length > 0;
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			if (_isReset(input)) {
				input.checked = !hasValues;
			} else if (hasValues && input.getAttribute(KEY_ATTR) === key && values.indexOf(input.getAttribute(VALUE_ATTR)) !== -1) {
				input.checked = true;
			} else {
				input.checked = false;
			}
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);

		// Column index for plain table row filtering (null = standard child attribute filter)
		const colAttr = dom.getAttribute(COL_ATTR);
		this.colIndex = colAttr !== null ? parseInt(colAttr, 10) : null;

		// Event-diff cache — null means never dispatched yet
		this._lastSnapshot = null;
		this._destroyed = false;

		this.nsKey = resolveHashNamespace(dom, 'filter');
		this.hashEnabled = !!this.nsKey;

		const self = this;

		const queueRender = createBatcher(function () {
			self._render();
		});

		this._queueRender = queueRender;
		this._attachHandlers();

		// Hash change listener
		this._onHashChange = function () {
			if (self._destroyed || !self.hashEnabled) return;
			const hashVal = hashGet(self.nsKey);
			const decoded = hashFilterDecode(hashVal);
			if (decoded && decoded.key && decoded.values.length > 0) {
				_applyInputValues(self.dom, decoded.key, decoded.values);
			} else {
				_applyInputValues(self.dom, null, []);
			}
			self._render();
		};

		if (this.hashEnabled) {
			window.addEventListener('hashchange', this._onHashChange);
		}

		// ─── Restore State on Boot ─────────────────────────────────
		let restored = false;

		if (this.hashEnabled) {
			const hashVal = hashGet(this.nsKey);
			const decoded = hashFilterDecode(hashVal);
			if (decoded && decoded.key && decoded.values.length > 0) {
				_applyInputValues(dom, decoded.key, decoded.values);
				queueBoot(function () {
					if (self._destroyed) return;
					self._render();
				});
				restored = true;
			}
		}

		if (!restored) {
			const values = decodeFilterValues(dom.getAttribute(VALUES_ATTR));
			if (values.length > 0) {
				const keyEl = dom.querySelector('[' + KEY_ATTR + ']');
				const key = keyEl ? keyEl.getAttribute(KEY_ATTR) : null;
				if (key) {
					_applyInputValues(dom, key, values);
					queueBoot(function () {
						if (self._destroyed) return;
						self._render();
					});
					restored = true;
				}
			}
		}

		if (!restored) {
			const inputs = dom.querySelectorAll('[' + KEY_ATTR + ']');
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].checked && !_isReset(inputs[i])) {
					queueBoot(function () {
						if (self._destroyed) return;
						self._render();
					});
					break;
				}
			}
		}

		return this;
	}

	// ─── Handlers (Delegated) ──────────────────────────────────

	_component.prototype._attachHandlers = function () {
		const self = this;

		this._onDomChange = function (e) {
			const input = e.target;
			if (!input || !input.hasAttribute || !input.hasAttribute(KEY_ATTR)) return;

			const allInputs = Array.from(self.dom.querySelectorAll('[' + KEY_ATTR + ']'));

			if (_isReset(input)) {
				for (let i = 0; i < allInputs.length; i++) {
					if (!_isReset(allInputs[i])) allInputs[i].checked = false;
				}
				input.checked = true;
				self._queueRender();
				return;
			}

			if (input.checked) {
				for (let i = 0; i < allInputs.length; i++) {
					if (_isReset(allInputs[i])) allInputs[i].checked = false;
				}
				let hasReset = false;
				for (let ri = 0; ri < allInputs.length; ri++) {
					if (_isReset(allInputs[ri])) { hasReset = true; break; }
				}
				if (hasReset) {
					let allChecked = true;
					for (let ci = 0; ci < allInputs.length; ci++) {
						if (!_isReset(allInputs[ci]) && !allInputs[ci].checked) {
							allChecked = false;
							break;
						}
					}
					if (allChecked) {
						for (let mi = 0; mi < allInputs.length; mi++) {
							if (_isReset(allInputs[mi])) allInputs[mi].checked = true;
							else allInputs[mi].checked = false;
						}
					}
				}
			} else {
				let anyChecked = false;
				for (let i = 0; i < allInputs.length; i++) {
					if (!_isReset(allInputs[i]) && allInputs[i].checked) {
						anyChecked = true;
						break;
					}
				}
				if (!anyChecked) {
					for (let i = 0; i < allInputs.length; i++) {
						if (_isReset(allInputs[i])) allInputs[i].checked = true;
					}
				}
			}

			self._queueRender();
		};

		this.dom.addEventListener('change', this._onDomChange);
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		const self = this;
		const active = _deriveActive(this);
		const prev = this._lastSnapshot;
		const changed = !prev
			|| prev.key !== active.key
			|| arraysDiffer(prev.values, active.values);

		if (!changed) return;

		const isReset = active.key === null || active.values.length === 0;
		const target = document.getElementById(self.targetId);
		const detail = {
			key: active.key,
			values: active.values.slice(),
			targetId: self.targetId
		};

		// 1. Dispatch on this.dom (Control Host) -> bubbles to ln-table-coordinator
		dispatch(self.dom, 'ln-filter:change', detail);

		// 2. Dispatch cancelable on target (State/Data Host) -> bubbles to ln-data-store / ln-table
		let defaultPrevented = false;
		if (target && target !== self.dom) {
			const evt = dispatchCancelable(target, 'ln-filter:change', detail);
			if (evt.defaultPrevented) defaultPrevented = true;
		}

		// Fire ln-filter:reset on transition into reset state
		const wasActive = prev && prev.values.length > 0;
		const nowReset = active.values.length === 0;
		if (wasActive && nowReset) {
			const resetDetail = { targetId: self.targetId };
			dispatch(self.dom, 'ln-filter:reset', resetDetail);
			if (target && target !== self.dom) {
				dispatch(target, 'ln-filter:reset', resetDetail);
			}
		}

		this._lastSnapshot = { key: active.key, values: active.values.slice() };

		const encoded = encodeFilterValues(active.values);
		if (encoded) this.dom.setAttribute(VALUES_ATTR, encoded);
		else this.dom.removeAttribute(VALUES_ATTR);

		if (this.hashEnabled) {
			const encoded = hashFilterEncode(active.key, active.values);
			hashSet(this.nsKey, encoded);
		}

		if (defaultPrevented) return;

		const table = target && (target.tagName === 'TABLE' ? target : (target.querySelector ? target.querySelector('table') : null));

		if (table) {
			self._filterTableRows(active, table);
		} else {
			if (!target) return;
			const children = target.children;
			for (let i = 0; i < children.length; i++) {
				const el = children[i];
				el.removeAttribute(HIDE_ATTR);
				if (isReset) continue;

				const attr = el.getAttribute('data-' + active.key);
				if (attr === null) continue;

				if (!matchesFilterValues(attr, active.values)) {
					el.setAttribute(HIDE_ATTR, 'true');
				}
			}
		}
	};

	// ─── Plain Table Row Filtering ─────────────────────────────

	function _readCell(cell) {
		if (!cell) return '';
		const childWithValue = cell.querySelector ? cell.querySelector('[data-ln-value]') : null;
		return childWithValue ? readValue(childWithValue) : readValue(cell);
	}

	function _isSkipRow(row) {
		if (!row || typeof row !== 'object') return true;
		if (row.tagName === 'TEMPLATE') return true;
		if (typeof row.hasAttribute === 'function' && (row.hasAttribute('data-ln-sort-exclude') || row.hasAttribute('hidden'))) return true;
		if (row.classList && row.classList.contains('hidden')) return true;
		if (row.style && row.style.display === 'none') return true;
		if (typeof row.matches === 'function' && row.matches('.empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]')) return true;
		if (typeof row.querySelector === 'function' && row.querySelector('.empty-state, [data-ln-empty], [data-ln-empty-state]')) return true;
		return false;
	}

	_component.prototype._filterTableRows = function (active, table) {
		if (!table) {
			const target = document.getElementById(this.targetId);
			if (!target) return;
			table = target.tagName === 'TABLE' ? target : (target.querySelector ? target.querySelector('table') : null);
			if (!table) return;
		}

		const resolvedCol = resolveColumnIndex(table, this.dom, active.key, this.colIndex);
		const key = active.key || (this.dom.getAttribute('data-ln-filter-key') || (resolvedCol !== null ? 'col' + resolvedCol : 'attr-filter'));
		const values = active.values;

		if (!_tableFilters.has(table)) {
			_tableFilters.set(table, {});
		}
		const filters = _tableFilters.get(table);

		if (key && values.length > 0) {
			filters[key] = {
				col: resolvedCol,
				values: values.slice(),
				attr: 'data-' + key
			};
		} else if (key) {
			delete filters[key];
		}

		const bodies = table.tBodies;
		for (let b = 0; b < bodies.length; b++) {
			const rows = bodies[b].rows;
			for (let r = 0; r < rows.length; r++) {
				const row = rows[r];
				if (_isSkipRow(row)) continue;

				const cellValuesByCol = {};
				for (let c = 0; c < row.cells.length; c++) {
					cellValuesByCol[c] = _readCell(row.cells[c]);
				}

				if (evaluateRowFilters(cellValuesByCol, filters, row)) {
					row.removeAttribute(HIDE_ATTR);
				} else {
					row.setAttribute(HIDE_ATTR, 'true');
				}
			}
		}
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._destroyed = true;

		const target = document.getElementById(this.targetId);
		if (target) {
			const table = target.tagName === 'TABLE' ? target : (target.querySelector ? target.querySelector('table') : null);
			if (table && _tableFilters.has(table)) {
				const filters = _tableFilters.get(table);
				const resolvedCol = resolveColumnIndex(table, this.dom, this.dom.getAttribute('data-ln-filter-key'), this.colIndex);
				const key = this.dom.getAttribute('data-ln-filter-key') || (resolvedCol !== null ? 'col' + resolvedCol : (this.colIndex !== null ? 'col' + this.colIndex : null));
				if (key && filters[key]) {
					delete filters[key];
					this._filterTableRows({ key: null, values: [] }, table);
				}
				if (Object.keys(filters).length === 0) _tableFilters.delete(table);
			}
		}

		if (this._onDomChange) {
			this.dom.removeEventListener('change', this._onDomChange);
			delete this._onDomChange;
		}

		if (this.hashEnabled && this._onHashChange) {
			window.removeEventListener('hashchange', this._onHashChange);
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || instance._destroyed) return;

		if (attrName === HASH_ATTR) {
			if (instance.hashEnabled && instance._onHashChange) {
				window.removeEventListener('hashchange', instance._onHashChange);
			}
			instance.nsKey = resolveHashNamespace(el, 'filter');
			instance.hashEnabled = !!instance.nsKey;
			if (instance.hashEnabled) {
				window.addEventListener('hashchange', instance._onHashChange);
			}
		} else if (attrName === VALUES_ATTR) {
			const values = decodeFilterValues(el.getAttribute(VALUES_ATTR));
			const keyEl = el.querySelector('[' + KEY_ATTR + ']');
			const key = keyEl ? keyEl.getAttribute(KEY_ATTR) : null;
			if (key) {
				_applyInputValues(el, key, values);
				instance._render();
			}
		}
	}

	// ─── Registration ──────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-filter', {
		attributes: ATTRIBUTES,
		persist: {
			attr: VALUES_ATTR,
			hashActive: function (el) { return !!resolveHashNamespace(el, 'filter'); }
		}
	});
})();
