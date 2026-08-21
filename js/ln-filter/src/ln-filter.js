import { dispatch, dispatchCancelable, registerComponent, queueBoot } from '../../ln-core';
import { createBatcher } from '../../ln-core';
import { persistGet, persistSet } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const RESET_ATTR = 'data-ln-filter-reset';
	const COL_ATTR = 'data-ln-filter-col';

	// Shared column filter state per plain table (AND across columns, OR within column)
	const _tableFilters = new WeakMap();

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _isReset(input) {
		return input.hasAttribute(RESET_ATTR) || input.getAttribute(VALUE_ATTR) === '';
	}

	function _deriveActive(self) {
		const inputs = self.dom.querySelectorAll('[' + KEY_ATTR + ']');
		let key = null;
		const values = [];
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			if (!key) key = input.getAttribute(KEY_ATTR);
			if (input.checked && !_isReset(input)) {
				const v = input.getAttribute(VALUE_ATTR);
				if (v) values.push(v);
			}
		}
		return { key: key, values: values, targetId: self.targetId };
	}

	function _arraysDiffer(a, b) {
		if (a.length !== b.length) return true;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
		return false;
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

		const self = this;

		const queueRender = createBatcher(
			function () { self._render(); }
		);

		this._queueRender = queueRender;

		this._attachHandlers();

		// ─── Restore persisted filter or boot pre-checked state ────
		// Deferred via queueBoot so all sibling/consumer components have initialized listeners
		let _persistRestored = false;
		if (dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('filter', dom);
			if (saved && saved.key && Array.isArray(saved.values) && saved.values.length > 0) {
				const inputs = dom.querySelectorAll('[' + KEY_ATTR + ']');
				for (let i = 0; i < inputs.length; i++) {
					const input = inputs[i];
					if (_isReset(input)) {
						input.checked = false;
					} else if (input.getAttribute(KEY_ATTR) === saved.key &&
					           saved.values.indexOf(input.getAttribute(VALUE_ATTR)) !== -1) {
						input.checked = true;
					} else {
						input.checked = false;
					}
				}
				queueBoot(function () { self._render(); });
				_persistRestored = true;
			}
		}

		if (!_persistRestored) {
			// DOM is already canonical — schedule boot render if anything is pre-checked
			const inputs = dom.querySelectorAll('[' + KEY_ATTR + ']');
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].checked && !_isReset(inputs[i])) {
					queueBoot(function () { self._render(); });
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
				// Reset sentinel — enforce checked on reset, uncheck all values
				for (let i = 0; i < allInputs.length; i++) {
					if (!_isReset(allInputs[i])) allInputs[i].checked = false;
				}
				input.checked = true;
				self._queueRender();
				return;
			}

			if (input.checked) {
				// Mutual exclusion: uncheck all reset sentinels
				for (let i = 0; i < allInputs.length; i++) {
					if (_isReset(allInputs[i])) allInputs[i].checked = false;
				}
				// If all non-reset inputs are now checked → collapse to sentinel
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
				// If no non-reset values remain checked, fall back to reset sentinel
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
			|| _arraysDiffer(prev.values, active.values);

		// Event-diff gating: only dispatch and render when filter state actually moved
		if (!changed) return;

		const isReset = active.key === null || active.values.length === 0;
		const target = document.getElementById(self.targetId);
		const detail = {
			key: active.key,
			values: active.values.slice(),
			targetId: self.targetId
		};

		// Two-Host Bridge:
		// 1. Dispatch on this.dom (Control Host) -> bubbles to ln-table-coordinator for UI headers
		dispatch(self.dom, 'ln-filter:change', detail);

		// 2. Dispatch cancelable on target (State/Data Host) -> bubbles to ln-data-store / ln-table
		let defaultPrevented = false;
		if (target && target !== self.dom) {
			const evt = dispatchCancelable(target, 'ln-filter:change', detail);
			if (evt.defaultPrevented) defaultPrevented = true;
		}

		// Fire ln-filter:reset only on transition into reset state
		const wasActive = prev && prev.values.length > 0;
		const nowReset = active.values.length === 0;
		if (wasActive && nowReset) {
			const resetDetail = { targetId: self.targetId };
			dispatch(self.dom, 'ln-filter:reset', resetDetail);
			if (target && target !== self.dom) {
				dispatch(target, 'ln-filter:reset', resetDetail);
			}
		}

		// Update diff cache snapshot
		this._lastSnapshot = { key: active.key, values: active.values.slice() };

		// Persist current filter state
		if (this.dom.hasAttribute('data-ln-persist')) {
			if (active.key && active.values.length > 0) {
				persistSet('filter', this.dom, { key: active.key, values: active.values.slice() });
			} else {
				persistSet('filter', this.dom, null);
			}
		}

		// If a consumer (ln-table, ln-list, ln-data-store) claimed the event, skip default DOM filtering
		if (defaultPrevented) return;

		// Build lowercase lookup for target filtering
		const lowerValues = [];
		for (let i = 0; i < active.values.length; i++) {
			lowerValues.push(active.values[i].toLowerCase());
		}

		// Apply default DOM filtering
		if (self.colIndex !== null) {
			// Plain table column filtering — shared multi-column logic
			self._filterTableRows(active);
		} else {
			// Standard target-children filtering by data-[key] attribute
			if (!target) return;

			const children = target.children;
			for (let i = 0; i < children.length; i++) {
				const el = children[i];

				if (isReset) {
					el.removeAttribute(HIDE_ATTR);
					continue;
				}

				const attr = el.getAttribute('data-' + active.key);
				el.removeAttribute(HIDE_ATTR);

				// Elements without data-{key} are exempt from filtering
				if (attr === null) continue;

				// OR logic: visible if attr matches ANY active value
				if (lowerValues.indexOf(attr.toLowerCase()) === -1) {
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

		// Get or create shared filter map for this plain table
		if (!_tableFilters.has(table)) {
			_tableFilters.set(table, {});
		}
		const filters = _tableFilters.get(table);

		// Update this filter's entry
		if (key && values.length > 0) {
			const lower = [];
			for (let i = 0; i < values.length; i++) {
				lower.push(values[i].toLowerCase());
			}
			filters[key] = { col: this.colIndex, values: lower };
		} else if (key) {
			delete filters[key];
		}

		// Check if any column filters are active
		const filterKeys = Object.keys(filters);
		const hasFilters = filterKeys.length > 0;

		// Apply all active filters to all rows (AND across columns, OR within column)
		const bodies = table.tBodies;
		for (let b = 0; b < bodies.length; b++) {
			const rows = bodies[b].rows;
			for (let r = 0; r < rows.length; r++) {
				const row = rows[r];

				if (!hasFilters) {
					row.removeAttribute(HIDE_ATTR);
					continue;
				}

				let visible = true;
				for (let f = 0; f < filterKeys.length; f++) {
					const filter = filters[filterKeys[f]];
					const cell = row.cells[filter.col];
					const cellText = cell ? cell.textContent.trim().toLowerCase() : '';
					// OR within column: visible if cell text matches ANY filter value
					if (filter.values.indexOf(cellText) === -1) {
						visible = false;
						break; // AND across columns: fail fast
					}
				}

				if (visible) {
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

		// Clean up plain table filter registry
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

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-filter');
})();
