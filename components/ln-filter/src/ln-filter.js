import { createBatcher, dispatch, dispatchCancelable, hashFilterDecode, hashFilterEncode, hashGet, hashSet, matchesFilterValues, persistGet, persistSet, queueBoot, registerComponent, resolveHashNamespace } from '../../ln-core';
import { arraysDiffer, deriveActiveFilters, evaluateRowFilters } from './filter-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const RESET_ATTR = 'data-ln-filter-reset';
	const COL_ATTR = 'data-ln-filter-col';
	const HASH_ATTR = 'data-ln-hash';

	// Shared column filter state per plain table (AND across columns, OR within column)
	const _tableFilters = new WeakMap();

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
		this.targetId = dom.getAttribute(DOM_SELECTOR);

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

		if (!restored && dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('filter', dom);
			if (saved && saved.key && Array.isArray(saved.values) && saved.values.length > 0) {
				_applyInputValues(dom, saved.key, saved.values);
				queueBoot(function () {
					if (self._destroyed) return;
					self._render();
				});
				restored = true;
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

		if (this.dom.hasAttribute('data-ln-persist')) {
			if (active.key && active.values.length > 0) {
				persistSet('filter', this.dom, { key: active.key, values: active.values.slice() });
			} else {
				persistSet('filter', this.dom, null);
			}
		}

		if (this.hashEnabled) {
			const encoded = hashFilterEncode(active.key, active.values);
			hashSet(this.nsKey, encoded);
		}

		if (defaultPrevented) return;

		if (self.colIndex !== null) {
			self._filterTableRows(active);
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

	_component.prototype._filterTableRows = function (active) {
		const target = document.getElementById(this.targetId);
		if (!target) return;

		const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
		if (!table) return;

		const key = active.key || (this.dom.getAttribute('data-ln-filter-key') || 'col' + this.colIndex);
		const values = active.values;

		if (!_tableFilters.has(table)) {
			_tableFilters.set(table, {});
		}
		const filters = _tableFilters.get(table);

		if (key && values.length > 0) {
			filters[key] = { col: this.colIndex, values: values.slice() };
		} else if (key) {
			delete filters[key];
		}

		const bodies = table.tBodies;
		for (let b = 0; b < bodies.length; b++) {
			const rows = bodies[b].rows;
			for (let r = 0; r < rows.length; r++) {
				const row = rows[r];
				const cellValuesByCol = {};
				for (let c = 0; c < row.cells.length; c++) {
					cellValuesByCol[c] = row.cells[c].textContent.trim();
				}

				if (evaluateRowFilters(cellValuesByCol, filters)) {
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

		if (this.colIndex !== null) {
			const target = document.getElementById(this.targetId);
			if (target) {
				const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
				if (table && _tableFilters.has(table)) {
					const filters = _tableFilters.get(table);
					const key = this.dom.getAttribute('data-ln-filter-key') || 'col' + this.colIndex;
					if (key && filters[key]) delete filters[key];
					if (Object.keys(filters).length === 0) _tableFilters.delete(table);
				}
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
		}
	}

	// ─── Registration ──────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-filter', {
		extraAttributes: [HASH_ATTR],
		onAttributeChange: _syncAttribute
	});
})();
