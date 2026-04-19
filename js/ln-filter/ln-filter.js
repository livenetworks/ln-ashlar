import { dispatch, fillTemplate, registerComponent } from '../ln-core';
import { deepReactive, createBatcher } from '../ln-core';
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
		this._pendingEvents = [];

		// Column index for table filtering (null = not a table column filter)
		const colAttr = dom.getAttribute(COL_ATTR);
		this.colIndex = colAttr !== null ? parseInt(colAttr, 10) : null;

		// Auto-populate from table column if template present
		_populateFromColumn(this);

		// Collect inputs AFTER auto-populate (new inputs may have been added)
		this.inputs = Array.from(dom.querySelectorAll('[' + KEY_ATTR + ']'));
		this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(KEY_ATTR) : null;

		const self = this;

		const queueRender = createBatcher(
			function () { self._render(); },
			function () { self._afterRender(); }
		);

		this.state = deepReactive({
			key: null,
			values: []
		}, queueRender);

		this._attachHandlers();

		// ─── Restore persisted filter ─────────────────────────────
		let _persistRestored = false;
		if (dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('filter', dom);
			if (saved && saved.key && Array.isArray(saved.values) && saved.values.length > 0) {
				this.state.key = saved.key;
				this.state.values = saved.values;
				_persistRestored = true;
			}
		}

		if (!_persistRestored) {
			// Initialize from existing DOM — collect all pre-checked inputs
			let initKey = null;
			const initValues = [];
			for (let i = 0; i < this.inputs.length; i++) {
				const input = this.inputs[i];
				if (input.checked && !_isReset(input)) {
					if (!initKey) initKey = input.getAttribute(KEY_ATTR);
					const val = input.getAttribute(VALUE_ATTR);
					if (val) initValues.push(val);
				}
			}
			if (initValues.length > 0) {
				this.state.key = initKey;
				this.state.values = initValues;
				this._pendingEvents.push({
					name: 'ln-filter:changed',
					detail: { key: initKey, values: initValues }
				});
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
				const key = input.getAttribute(KEY_ATTR);
				const value = input.getAttribute(VALUE_ATTR) || '';

				if (_isReset(input)) {
					// "All" checkbox -- reset everything
					self._pendingEvents.push({
						name: 'ln-filter:changed',
						detail: { key: key, values: [] }
					});
					self.reset();
					return;
				}

				// Non-reset checkbox toggled
				if (input.checked) {
					// Add value to active set
					if (self.state.values.indexOf(value) === -1) {
						self.state.key = key;
						self.state.values.push(value);
					}
				} else {
					// Remove value from active set
					const idx = self.state.values.indexOf(value);
					if (idx !== -1) {
						self.state.values.splice(idx, 1);
					}
					// If no values left, auto-reset
					if (self.state.values.length === 0) {
						self._pendingEvents.push({
							name: 'ln-filter:changed',
							detail: { key: key, values: [] }
						});
						self.reset();
						return;
					}
				}

				self._pendingEvents.push({
					name: 'ln-filter:changed',
					detail: { key: self.state.key, values: self.state.values.slice() }
				});
			};
			input.addEventListener('change', input._lnFilterChange);
		});
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		const self = this;
		const activeKey = this.state.key;
		const activeValues = this.state.values;
		const isReset = activeKey === null || activeValues.length === 0;

		// Build lowercase lookup for target filtering
		const lowerValues = [];
		for (let i = 0; i < activeValues.length; i++) {
			lowerValues.push(activeValues[i].toLowerCase());
		}

		// Update input checked states
		this.inputs.forEach(function (input) {
			if (isReset) {
				// Reset state -- only "All" is checked
				input.checked = _isReset(input);
			} else if (_isReset(input)) {
				// Active filters -- "All" is unchecked
				input.checked = false;
			} else {
				// Check if this input's value is in the active set
				const inputValue = input.getAttribute(VALUE_ATTR) || '';
				input.checked = activeValues.indexOf(inputValue) !== -1;
			}
		});

		// Apply filter
		if (self.colIndex !== null) {
			// Table column filtering — shared multi-column logic
			self._filterTableRows();
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

				const attr = el.getAttribute('data-' + activeKey);
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
		const events = this._pendingEvents;
		this._pendingEvents = [];

		for (let i = 0; i < events.length; i++) {
			this._dispatchOnBoth(events[i].name, events[i].detail);
		}

		// Persist current filter state
		if (this.dom.hasAttribute('data-ln-persist')) {
			if (this.state.key && this.state.values.length > 0) {
				persistSet('filter', this.dom, { key: this.state.key, values: this.state.values.slice() });
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

	_component.prototype._filterTableRows = function () {
		const target = document.getElementById(this.targetId);
		if (!target) return;

		const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
		if (!table) return;

		// Guard: don't filter if this is an ln-table (it handles its own filtering)
		if (target.hasAttribute('data-ln-table')) return;

		const key = this.state.key || this._filterKey;
		const values = this.state.values;

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

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.filter = function (key, value) {
		if (Array.isArray(value)) {
			// Bulk set: replace all values
			if (value.length === 0) {
				this.reset();
				return;
			}
			this.state.key = key;
			this.state.values = value.slice();
		} else if (!value) {
			// Empty/falsy value: reset
			this.reset();
			return;
		} else {
			// Single value: set as sole active filter
			this.state.key = key;
			this.state.values = [value];
		}
		this._pendingEvents.push({
			name: 'ln-filter:changed',
			detail: { key: this.state.key, values: this.state.values.slice() }
		});
	};

	_component.prototype.reset = function () {
		this._pendingEvents.push({ name: 'ln-filter:reset', detail: {} });
		this.state.key = null;
		this.state.values = [];
	};

	_component.prototype.getActive = function () {
		if (this.state.key === null || this.state.values.length === 0) return null;
		return { key: this.state.key, values: this.state.values.slice() };
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		// Clean up table filter registry
		if (this.colIndex !== null) {
			const target = document.getElementById(this.targetId);
			if (target) {
				const table = target.tagName === 'TABLE' ? target : target.querySelector('table');
				if (table && _tableFilters.has(table)) {
					const filters = _tableFilters.get(table);
					const key = this.state.key || this._filterKey;
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
