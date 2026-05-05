import { dispatch, fillTemplate, registerComponent } from '../ln-core';
import { createBatcher } from '../ln-core';
import { persistGet, persistSet } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const INIT_ATTR = 'data-ln-filter-initialized';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const RESET_ATTR = 'data-ln-filter-reset';
	const COL_ATTR = 'data-ln-filter-col';

	// Shared column filter state per table (AND across columns, OR within column)
	const _tableFilters = new WeakMap();

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _isReset(input) {
		return input.hasAttribute(RESET_ATTR) || input.getAttribute(VALUE_ATTR) === '';
	}

	function _deriveActive(self) {
		let key = null;
		const values = [];
		for (let i = 0; i < self.inputs.length; i++) {
			const input = self.inputs[i];
			if (input.checked && !_isReset(input)) {
				if (key === null) key = input.getAttribute(KEY_ATTR);
				const v = input.getAttribute(VALUE_ATTR);
				if (v) values.push(v);
			}
		}
		return { key: key, values: values };
	}

	function _arraysDiffer(a, b) {
		if (a.length !== b.length) return true;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
		return false;
	}

	// ─── Auto-populate from table column ───────────────────────

	function _populateFromColumn(instance) {
		const dom = instance.dom;
		const colIndex = instance.colIndex;
		const tmpl = dom.querySelector('template');
		if (!tmpl || colIndex === null) return;

		const target = document.getElementById(instance.targetId);
		if (!target) return;

		const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
		if (!table || target.hasAttribute('data-ln-table')) return;

		// Collect unique values from column
		const seen = {};
		const values = [];
		const bodies = table.tBodies;
		for (let b = 0; b < bodies.length; b++) {
			const rows = bodies[b].rows;
			for (let r = 0; r < rows.length; r++) {
				const cell = rows[r].cells[colIndex];
				const text = cell ? cell.textContent.trim() : '';
				if (text && !seen[text]) {
					seen[text] = true;
					values.push(text);
				}
			}
		}
		values.sort(function (a, b) {
			return a.localeCompare(b);
		});

		// Determine the filter key from existing inputs or dom attribute
		const existingInput = dom.querySelector('[' + KEY_ATTR + ']');
		const filterKey = existingInput
			? existingInput.getAttribute(KEY_ATTR)
			: (dom.getAttribute('data-ln-filter-key') || 'col' + colIndex);

		// Clone template for each value
		for (let i = 0; i < values.length; i++) {
			const clone = tmpl.content.cloneNode(true);
			const input = clone.querySelector('input');
			if (!input) continue;
			input.setAttribute(KEY_ATTR, filterKey);
			input.setAttribute(VALUE_ATTR, values[i]);
			fillTemplate(clone, { text: values[i] });
			dom.appendChild(clone);
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		if (dom.hasAttribute(INIT_ATTR)) return this;

		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);

		// Column index for table filtering (null = not a table column filter)
		const colAttr = dom.getAttribute(COL_ATTR);
		this.colIndex = colAttr !== null ? parseInt(colAttr, 10) : null;

		// Auto-populate from table column if template present
		_populateFromColumn(this);

		// Collect inputs AFTER auto-populate (new inputs may have been added)
		this.inputs = Array.from(dom.querySelectorAll('[' + KEY_ATTR + ']'));
		this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(KEY_ATTR) : null;

		// Event-diff cache — null means never dispatched yet
		this._lastSnapshot = null;

		const self = this;

		const queueRender = createBatcher(
			function () { self._render(); },
			function () { self._afterRender(); }
		);

		// Stash for use in change handler
		this._queueRender = queueRender;

		this._attachHandlers();

		// ─── Restore persisted filter ─────────────────────────────
		let _persistRestored = false;
		if (dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('filter', dom);
			if (saved && saved.key && Array.isArray(saved.values) && saved.values.length > 0) {
				// Write input.checked on matching inputs
				for (let i = 0; i < this.inputs.length; i++) {
					const input = this.inputs[i];
					if (_isReset(input)) {
						input.checked = false;
					} else if (input.getAttribute(KEY_ATTR) === saved.key &&
					           saved.values.indexOf(input.getAttribute(VALUE_ATTR)) !== -1) {
						input.checked = true;
					} else {
						input.checked = false;
					}
				}
				queueRender();
				_persistRestored = true;
			}
		}

		if (!_persistRestored) {
			// DOM is already canonical — only schedule render if anything is pre-checked
			// so visibility is applied and the initial ln-filter:changed fires (via
			// null-snapshot diff in _afterRender).
			for (let i = 0; i < this.inputs.length; i++) {
				if (this.inputs[i].checked && !_isReset(this.inputs[i])) {
					queueRender();
					break;
				}
			}
		}

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handlers ──────────────────────────────────────────────

	_component.prototype._attachHandlers = function () {
		const self = this;

		this.inputs.forEach(function (input) {
			if (input[DOM_ATTRIBUTE + 'Bound']) return;
			input[DOM_ATTRIBUTE + 'Bound'] = true;

			input._lnFilterChange = function () {
				if (_isReset(input)) {
					// Reset sentinel — regardless of direction, enforce checked + clear values
					for (let i = 0; i < self.inputs.length; i++) {
						if (!_isReset(self.inputs[i])) self.inputs[i].checked = false;
					}
					// Force sentinel back to checked (clicking an already-checked sentinel
					// would natively uncheck it; force back to checked)
					input.checked = true;
					self._queueRender();
					return;
				}

				if (input.checked) {
					// Mutual exclusion: uncheck all reset sentinels
					for (let i = 0; i < self.inputs.length; i++) {
						if (_isReset(self.inputs[i])) self.inputs[i].checked = false;
					}
				} else {
					// If no non-reset values remain checked, fall back to reset
					let anyChecked = false;
					for (let i = 0; i < self.inputs.length; i++) {
						if (!_isReset(self.inputs[i]) && self.inputs[i].checked) {
							anyChecked = true;
							break;
						}
					}
					if (!anyChecked) {
						for (let i = 0; i < self.inputs.length; i++) {
							if (_isReset(self.inputs[i])) self.inputs[i].checked = true;
						}
					}
				}

				self._queueRender();
			};
			input.addEventListener('change', input._lnFilterChange);
		});
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		const self = this;
		const active = _deriveActive(this);
		const isReset = active.key === null || active.values.length === 0;

		// Build lowercase lookup for target filtering
		const lowerValues = [];
		for (let i = 0; i < active.values.length; i++) {
			lowerValues.push(active.values[i].toLowerCase());
		}

		// Apply filter
		if (self.colIndex !== null) {
			// Table column filtering — shared multi-column logic
			self._filterTableRows(active);
		} else {
			// Standard target-children filtering by data attribute
			const target = document.getElementById(self.targetId);
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

				if (attr === null) continue;

				// OR logic: visible if attr matches ANY active value
				if (lowerValues.indexOf(attr.toLowerCase()) === -1) {
					el.setAttribute(HIDE_ATTR, 'true');
				}
			}
		}
	};

	_component.prototype._afterRender = function () {
		const active = _deriveActive(this);
		const prev = this._lastSnapshot;
		const changed = !prev
			|| prev.key !== active.key
			|| _arraysDiffer(prev.values, active.values);

		if (changed) {
			// ln-filter:changed always fires when state moves
			this._dispatchOnBoth('ln-filter:changed', {
				key: active.key,
				values: active.values.slice()
			});

			// ln-filter:reset fires only on transition into reset state
			const wasActive = prev && prev.values.length > 0;
			const nowReset = active.values.length === 0;
			if (wasActive && nowReset) {
				this._dispatchOnBoth('ln-filter:reset', {});
			}

			this._lastSnapshot = { key: active.key, values: active.values.slice() };
		}

		// Persist current filter state
		if (this.dom.hasAttribute('data-ln-persist')) {
			if (active.key && active.values.length > 0) {
				persistSet('filter', this.dom, { key: active.key, values: active.values.slice() });
			} else {
				persistSet('filter', this.dom, null);
			}
		}
	};

	_component.prototype._dispatchOnBoth = function (eventName, detail) {
		dispatch(this.dom, eventName, detail);
		const target = document.getElementById(this.targetId);
		if (target && target !== this.dom) {
			dispatch(target, eventName, detail);
		}
	};

	// ─── Table Row Filtering ───────────────────────────────────

	_component.prototype._filterTableRows = function (active) {
		const target = document.getElementById(this.targetId);
		if (!target) return;

		const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
		if (!table) return;

		// Guard: don't filter if this is an ln-table (it handles its own filtering)
		if (target.hasAttribute('data-ln-table')) return;

		const key = active.key || this._filterKey;
		const values = active.values;

		// Get or create shared filter map for this table
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

		// Clean up table filter registry
		if (this.colIndex !== null) {
			const target = document.getElementById(this.targetId);
			if (target) {
				const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
				if (table && _tableFilters.has(table)) {
					const filters = _tableFilters.get(table);
					const key = this._filterKey;
					if (key && filters[key]) delete filters[key];
					if (Object.keys(filters).length === 0) _tableFilters.delete(table);
				}
			}
		}

		this.inputs.forEach(function (input) {
			if (input._lnFilterChange) {
				input.removeEventListener('change', input._lnFilterChange);
				delete input._lnFilterChange;
			}
			delete input[DOM_ATTRIBUTE + 'Bound'];
		});
		this.dom.removeAttribute(INIT_ATTR);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-filter');
})();
