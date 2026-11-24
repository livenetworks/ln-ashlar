import {
	cloneTemplateScoped,
	dispatch,
	dispatchCancelable,
	fill,
	registerComponent,
	defineAttrs,
	attrSpec,
	shouldIgnoreClick,
	hasActiveDebug
} from '../../ln-core';

import {
	hasIndexToken,
	applyIndexTokens,
	normalizeBounds,
	canAdd,
	canRemove,
	detectNextIndex,
	parseItemsPayload,
	extractLeafFieldName,
	replaceLeadingIndex
} from './repeater-model.js';

(function () {
	'use strict';

	const DOM_SELECTOR = 'data-ln-repeater';
	const DOM_ATTRIBUTE = 'lnRepeater';
	const LIST_ATTR = 'data-ln-repeater-list';
	const ITEM_ATTR = 'data-ln-repeater-item';
	const ADD_ATTR = 'data-ln-repeater-add';
	const ADD_FOR_ATTR = 'data-ln-repeater-add-for';
	const REMOVE_ATTR = 'data-ln-repeater-remove';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-repeater':         { prop: 'templateName', type: 'string', fallback: '', description: 'Mounts dynamic row repeater on container; optional value names the template and ln-fill array field key' },
		'data-ln-repeater-min':     { prop: '_minRaw', type: 'integer', fallback: 0, min: 0, effect: _syncBounds, description: 'Minimum number of rows; blocks removal below this count and auto-seeds rows on init when empty' },
		'data-ln-repeater-max':     { prop: '_maxRaw', type: 'integer', fallback: Infinity, min: 1, effect: _syncBounds, description: 'Maximum number of rows allowed; disables add triggers once reached' },
		'data-ln-repeater-reindex': { prop: 'reindex', type: 'boolean', fallback: false, description: 'When enabled, sequentially re-numbers indexed field attributes after remove or reorder' },
		'data-ln-repeater-list':    { type: 'marker', description: 'List container element (e.g. <ul> or <ol>) where repeated items are appended' },
		'data-ln-repeater-item':    { type: 'marker', description: 'Marks an individual repeated row element inside the repeater list' },
		'data-ln-repeater-add':     { type: 'trigger', description: 'Button trigger inside the repeater root that appends a new row from the template' },
		'data-ln-repeater-add-for': { type: 'string', description: 'External button trigger referencing a repeater container by element ID' },
		'data-ln-repeater-remove':  { type: 'trigger', description: 'Button trigger inside a repeated row that removes its owning item' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	const FOCUSABLE_CONTROL_SELECTOR = 'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)';

	// ─── Component Constructor ──────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);

		this._destroyed = false;
		this._attrTemplates = new WeakMap();
		this._textTemplates = new WeakMap();
		this._itemIndices = new WeakMap();

		this.listEl = this._resolveList();
		this._nextIndex = this._detectInitialNextIndex();

		const self = this;

		// Delegated click handler for internal add and per-row remove buttons
		this._onClick = function (e) {
			if (shouldIgnoreClick(e)) return;

			const addBtn = e.target.closest('[' + ADD_ATTR + ']');
			if (addBtn && self._ownsElement(addBtn)) {
				if (addBtn.disabled) return;
				e.preventDefault();
				self.add(null, { focus: true });
				return;
			}

			const removeBtn = e.target.closest('[' + REMOVE_ATTR + ']');
			if (removeBtn && self._ownsElement(removeBtn)) {
				if (removeBtn.disabled) return;
				e.preventDefault();
				const item = self._resolveItemFromDescendant(removeBtn);
				if (item) {
					self.remove(item, { focusNeighbor: true });
				}
			}
		};
		dom.addEventListener('click', this._onClick);

		// CQS request events on container
		this._onRequestAdd = function (e) {
			if (e.target !== self.dom) return;
			const detail = e.detail || {};
			self.add(detail.values !== undefined ? detail.values : null, {
				focus: !!detail.focus
			});
		};
		this._onRequestRemove = function (e) {
			if (e.target !== self.dom) return;
			if (!e.detail) return;
			const target = e.detail.item !== undefined ? e.detail.item : e.detail.index;
			if (target === undefined || target === null) return;
			self.remove(target, { focusNeighbor: !!e.detail.focusNeighbor });
		};
		dom.addEventListener('ln-repeater:request-add', this._onRequestAdd);
		dom.addEventListener('ln-repeater:request-remove', this._onRequestRemove);

		// Composition with ln-sortable: reindex after drag-and-drop reorder when reindex is enabled
		this._onReordered = function (e) {
			if (e.target !== self.listEl) return;
			if (self.reindex) {
				self._reindexItems();
			}
			self._syncControls();
		};
		this.listEl.addEventListener('ln-sortable:reordered', this._onReordered);

		// Fill hydration (Edit modal / Create reset)
		this._onFill = function (e) {
			if (e.target === self.dom) {
				self._handleFill(e.detail);
				return;
			}
			if (self._form && e.target === self._form && !self.dom.hasAttribute('data-ln-fillable')) {
				self._handleFill(e.detail);
			}
		};
		dom.addEventListener('ln-fill', this._onFill);

		this._form = dom.closest('form');
		if (this._form && this._form !== dom) {
			this._form.addEventListener('ln-fill', this._onFill);
		}

		// Ensure minimum rows on init (e.g. min="1" seeds 1 row when list starts empty)
		this._ensureMin();
		this._syncControls();

		return this;
	}

	// ─── Live Query Properties ──────────────────────────────

	Object.defineProperty(_component.prototype, 'items', {
		get: function () {
			return this._getItems();
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(_component.prototype, 'count', {
		get: function () {
			return this._getItems().length;
		},
		enumerable: true,
		configurable: true
	});

	// ─── Internal Helpers ───────────────────────────────────

	_component.prototype._ownsElement = function (el) {
		return !!el && el.closest('[' + DOM_SELECTOR + ']') === this.dom;
	};

	_component.prototype._getBounds = function () {
		return normalizeBounds(this._minRaw, this._maxRaw);
	};

	_component.prototype._resolveList = function () {
		const lists = this.dom.querySelectorAll('[' + LIST_ATTR + ']');
		for (let i = 0; i < lists.length; i++) {
			if (this._ownsElement(lists[i])) return lists[i];
		}
		return this.dom;
	};

	_component.prototype._getItems = function () {
		const children = this.listEl.children;
		const items = [];
		const listIsRoot = this.listEl === this.dom;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.tagName === 'TEMPLATE') continue;
			if (listIsRoot && !child.hasAttribute(ITEM_ATTR)) continue;
			items.push(child);
		}
		return items;
	};

	_component.prototype._resolveItemFromDescendant = function (el) {
		let cur = el;
		while (cur && cur.parentElement !== this.listEl) {
			cur = cur.parentElement;
		}
		if (!cur || cur.parentElement !== this.listEl || cur.tagName === 'TEMPLATE') return null;
		if (this.listEl === this.dom && !cur.hasAttribute(ITEM_ATTR)) return null;
		return cur;
	};

	_component.prototype._detectInitialNextIndex = function () {
		const existingItems = this._getItems();
		const names = [];
		for (let i = 0; i < existingItems.length; i++) {
			const item = existingItems[i];
			if (!item.hasAttribute(ITEM_ATTR)) {
				item.setAttribute(ITEM_ATTR, '');
			}
			const controls = item.querySelectorAll('[name]');
			for (let j = 0; j < controls.length; j++) {
				const n = controls[j].getAttribute('name');
				if (n) names.push(n);
			}
			this._itemIndices.set(item, i);
		}
		return detectNextIndex(names, existingItems.length);
	};

	_component.prototype._cloneRow = function () {
		const name = this.templateName;

		// 1. Named template: check owned local template first, then global via ln-core
		if (name) {
			const locals = this.dom.querySelectorAll('template[data-ln-template="' + name + '"]');
			for (let i = 0; i < locals.length; i++) {
				if (this._ownsElement(locals[i])) {
					return locals[i].content.cloneNode(true);
				}
			}
			return cloneTemplateScoped(this.dom, name, 'ln-repeater');
		}

		// 2. Anonymous inline <template> owned by this repeater
		const templates = this.dom.querySelectorAll('template');
		for (let i = 0; i < templates.length; i++) {
			if (this._ownsElement(templates[i])) {
				return templates[i].content.cloneNode(true);
			}
		}

		if (hasActiveDebug()) {
			console.warn('[ln-repeater] No <template> found for repeater', this.dom);
		}
		return null;
	};

	_component.prototype._applyTokens = function (row, index) {
		const elements = Array.from(row.querySelectorAll('*'));
		elements.unshift(row);

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			const attrs = el.attributes;
			let savedAttrs = null;

			for (let j = 0; j < attrs.length; j++) {
				const attr = attrs[j];
				if (hasIndexToken(attr.value)) {
					if (!savedAttrs) savedAttrs = new Map();
					savedAttrs.set(attr.name, attr.value);
					el.setAttribute(attr.name, applyIndexTokens(attr.value, index));
				}
			}

			if (savedAttrs) {
				this._attrTemplates.set(el, savedAttrs);
			}

			// Guard against duplicate static IDs across cloned rows
			if (el.id && (!savedAttrs || !savedAttrs.has('id')) && document.getElementById(el.id)) {
				el.removeAttribute('id');
			}
		}

		// Text-node tokens (e.g. "Option {index1}")
		if (typeof document.createTreeWalker === 'function') {
			const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
			while (walker.nextNode()) {
				const textNode = walker.currentNode;
				if (hasIndexToken(textNode.textContent)) {
					this._textTemplates.set(textNode, textNode.textContent);
					textNode.textContent = applyIndexTokens(textNode.textContent, index);
				}
			}
		}

		this._itemIndices.set(row, index);
	};

	_component.prototype._populateRow = function (row, values) {
		if (values === null || values === undefined) return;

		const controls = row.querySelectorAll('input, textarea, select');

		// Primitive value (e.g. ["Red", "Green", "Blue"]) -> populate first visible control
		if (typeof values !== 'object') {
			for (let i = 0; i < controls.length; i++) {
				const el = controls[i];
				if (el.type === 'hidden' || el.type === 'button' || el.type === 'submit' || el.type === 'file') continue;
				if (el.type === 'checkbox') {
					el.checked = !!values;
				} else {
					el.value = String(values);
				}
				break;
			}
			return;
		}

		// Object record -> match controls by data-ln-fill-as, exact name, or leaf field key
		for (let i = 0; i < controls.length; i++) {
			const el = controls[i];
			if (el.type === 'button' || el.type === 'submit' || el.type === 'file') continue;

			const fillAs = el.getAttribute('data-ln-fill-as');
			let key = null;
			if (fillAs && (fillAs in values)) {
				key = fillAs;
			} else if (el.name && (el.name in values)) {
				key = el.name;
			} else if (el.name) {
				const leaf = extractLeafFieldName(el.name);
				if (leaf && (leaf in values)) key = leaf;
			}

			if (key === null) continue;
			const val = values[key];

			if (el.type === 'checkbox') {
				if (Array.isArray(val)) {
					el.checked = val.indexOf(el.value) !== -1;
				} else {
					el.checked = !!val;
				}
			} else if (el.type === 'radio') {
				el.checked = el.value === String(val);
			} else if (el.type === 'select-multiple' && Array.isArray(val)) {
				for (let j = 0; j < el.options.length; j++) {
					el.options[j].selected = val.indexOf(el.options[j].value) !== -1;
				}
			} else {
				el.value = val == null ? '' : String(val);
				if (el.tagName === 'SELECT' && val != null) {
					el.setAttribute('data-ln-value', String(val));
				}
			}
		}

		// Also hydrate declarative display bindings ([data-ln-field], [data-ln-attr], etc.)
		fill(row, values);
	};

	_component.prototype._reindexItems = function () {
		const items = this._getItems();
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const oldIndex = this._itemIndices.has(item) ? this._itemIndices.get(item) : i;
			const elements = Array.from(item.querySelectorAll('*'));
			elements.unshift(item);

			for (let j = 0; j < elements.length; j++) {
				const el = elements[j];
				const savedAttrs = this._attrTemplates.get(el);
				if (savedAttrs) {
					savedAttrs.forEach(function (pattern, attrName) {
						el.setAttribute(attrName, applyIndexTokens(pattern, i));
					});
				} else if (oldIndex !== i) {
					// Keep dynamically inserted nested controls (without template snapshots) aligned
					const name = el.getAttribute('name');
					if (name && name.indexOf('[' + oldIndex + ']') !== -1) {
						el.setAttribute('name', replaceLeadingIndex(name, oldIndex, i));
					}
				}
			}

			if (typeof document.createTreeWalker === 'function') {
				const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
				while (walker.nextNode()) {
					const textNode = walker.currentNode;
					const pattern = this._textTemplates.get(textNode);
					if (pattern !== undefined) {
						textNode.textContent = applyIndexTokens(pattern, i);
					}
				}
			}

			this._itemIndices.set(item, i);
		}

		this._nextIndex = items.length;

		dispatch(this.dom, 'ln-repeater:reindexed', {
			target: this.dom,
			count: items.length
		});
	};

	_component.prototype._getAddTriggers = function () {
		const triggers = [];
		const internal = this.dom.querySelectorAll('[' + ADD_ATTR + ']');
		for (let i = 0; i < internal.length; i++) {
			if (this._ownsElement(internal[i])) triggers.push(internal[i]);
		}
		if (this.dom.id) {
			const escaped = (window.CSS && CSS.escape) ? CSS.escape(this.dom.id) : this.dom.id;
			const external = document.querySelectorAll('[' + ADD_FOR_ATTR + '="' + escaped + '"]');
			for (let i = 0; i < external.length; i++) {
				triggers.push(external[i]);
			}
		}
		return triggers;
	};

	_component.prototype._syncControls = function () {
		const bounds = this._getBounds();
		const items = this._getItems();
		const count = items.length;
		const allowAdd = canAdd(count, bounds.max);
		const allowRemove = canRemove(count, bounds.min);

		const addTriggers = this._getAddTriggers();
		for (let i = 0; i < addTriggers.length; i++) {
			const btn = addTriggers[i];
			btn.disabled = !allowAdd;
			if (!allowAdd) {
				btn.setAttribute('aria-disabled', 'true');
			} else {
				btn.removeAttribute('aria-disabled');
			}
		}

		for (let i = 0; i < items.length; i++) {
			const removeBtns = items[i].querySelectorAll('[' + REMOVE_ATTR + ']');
			for (let j = 0; j < removeBtns.length; j++) {
				const btn = removeBtns[j];
				if (!this._ownsElement(btn)) continue;
				btn.disabled = !allowRemove;
				if (!allowRemove) {
					btn.setAttribute('aria-disabled', 'true');
				} else {
					btn.removeAttribute('aria-disabled');
				}
			}
		}
	};

	_component.prototype._ensureMin = function () {
		const bounds = this._getBounds();
		let safety = bounds.min;
		while (this._getItems().length < bounds.min && safety-- > 0) {
			const added = this.add(null, { focus: false, _silent: true });
			if (!added) break;
		}
	};

	_component.prototype._handleFill = function (record) {
		if (record === null || record === undefined) {
			this.clear({ force: true, _silent: true });
			this._nextIndex = 0;
			this._ensureMin();
			this._syncControls();
			return;
		}

		const key = this.templateName;
		if (!key || !(key in record)) return;

		const list = parseItemsPayload(record[key]);
		if (list === null) return;

		this.clear({ force: true, _silent: true });
		this._nextIndex = 0;

		const bounds = this._getBounds();
		const limit = Math.min(list.length, bounds.max);
		for (let i = 0; i < limit; i++) {
			this.add(list[i], { focus: false });
		}

		this._ensureMin();
		this._syncControls();
	};

	_component.prototype._focusFirstControl = function (row) {
		if (!row) return;
		const control = row.querySelector(FOCUSABLE_CONTROL_SELECTOR);
		if (control && typeof control.focus === 'function') {
			control.focus();
		}
	};

	_component.prototype._focusAfterRemove = function (removedPosition) {
		const remaining = this._getItems();
		if (remaining.length > 0) {
			const targetRow = remaining[Math.min(removedPosition, remaining.length - 1)];
			const control = targetRow.querySelector(FOCUSABLE_CONTROL_SELECTOR) || targetRow.querySelector('[' + REMOVE_ATTR + ']:not(:disabled)');
			if (control && typeof control.focus === 'function') {
				control.focus();
				return;
			}
		}
		const addTriggers = this._getAddTriggers();
		for (let i = 0; i < addTriggers.length; i++) {
			if (!addTriggers[i].disabled && typeof addTriggers[i].focus === 'function') {
				addTriggers[i].focus();
				return;
			}
		}
	};

	// ─── Public API ─────────────────────────────────────────

	_component.prototype.add = function (values, options) {
		if (this._destroyed) return null;
		const opts = options || {};
		const bounds = this._getBounds();
		const currentCount = this._getItems().length;

		if (!canAdd(currentCount, bounds.max)) {
			dispatch(this.dom, 'ln-repeater:max-reached', {
				target: this.dom,
				max: bounds.max,
				count: currentCount
			});
			return null;
		}

		const index = this.reindex ? currentCount : this._nextIndex;

		if (!opts._silent) {
			const before = dispatchCancelable(this.dom, 'ln-repeater:before-add', {
				target: this.dom,
				index: index,
				count: currentCount
			});
			if (before.defaultPrevented) return null;
		}

		const frag = this._cloneRow();
		if (!frag) return null;

		const row = frag.firstElementChild;
		if (!row) return null;

		if (!row.hasAttribute(ITEM_ATTR)) {
			row.setAttribute(ITEM_ATTR, '');
		}

		this._applyTokens(row, index);
		this._populateRow(row, values);

		this.listEl.appendChild(row);
		this._nextIndex = Math.max(this._nextIndex + 1, index + 1);

		this._syncControls();

		if (opts.focus) {
			this._focusFirstControl(row);
		}

		if (!opts._silent) {
			dispatch(this.dom, 'ln-repeater:added', {
				target: this.dom,
				item: row,
				index: index,
				count: this._getItems().length
			});
		}

		return row;
	};

	_component.prototype.remove = function (itemOrIndex, options) {
		if (this._destroyed) return false;
		const opts = options || {};
		const bounds = this._getBounds();
		const items = this._getItems();

		let item = null;
		let pos = -1;
		if (typeof itemOrIndex === 'number') {
			pos = itemOrIndex;
			item = items[pos] || null;
		} else {
			item = itemOrIndex;
			pos = items.indexOf(item);
		}
		if (!item || pos === -1) return false;

		if (!opts.force && !canRemove(items.length, bounds.min)) {
			dispatch(this.dom, 'ln-repeater:min-reached', {
				target: this.dom,
				min: bounds.min,
				count: items.length
			});
			return false;
		}

		const logicalIndex = this._itemIndices.has(item) ? this._itemIndices.get(item) : pos;

		if (!opts._silent) {
			const before = dispatchCancelable(this.dom, 'ln-repeater:before-remove', {
				target: this.dom,
				item: item,
				index: logicalIndex,
				count: items.length
			});
			if (before.defaultPrevented) return false;
		}

		const hadFocus = !!(document.activeElement && item.contains(document.activeElement));

		if (item.parentNode) {
			item.parentNode.removeChild(item);
		}

		if (this.reindex && !opts._skipReindex) {
			this._reindexItems();
		}

		this._syncControls();

		if (opts.focusNeighbor && hadFocus) {
			this._focusAfterRemove(pos);
		}

		if (!opts._silent) {
			dispatch(this.dom, 'ln-repeater:removed', {
				target: this.dom,
				item: item,
				index: logicalIndex,
				count: this._getItems().length
			});
		}

		return true;
	};

	_component.prototype.clear = function (options) {
		if (this._destroyed) return;
		const opts = options || {};
		const items = this._getItems();
		for (let i = items.length - 1; i >= 0; i--) {
			const removed = this.remove(items[i], {
				force: !!opts.force,
				_silent: !!opts._silent,
				_skipReindex: true
			});
			if (!removed) break;
		}
		if (this.reindex && !opts._silent) {
			this._reindexItems();
		}
		this._syncControls();
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._destroyed = true;

		this.dom.removeEventListener('click', this._onClick);
		this.dom.removeEventListener('ln-repeater:request-add', this._onRequestAdd);
		this.dom.removeEventListener('ln-repeater:request-remove', this._onRequestRemove);
		this.dom.removeEventListener('ln-fill', this._onFill);
		this.listEl.removeEventListener('ln-sortable:reordered', this._onReordered);

		if (this._form && this._form !== this.dom) {
			this._form.removeEventListener('ln-fill', this._onFill);
		}

		// Reset disabled / aria-disabled on triggers
		const addTriggers = this._getAddTriggers();
		for (let i = 0; i < addTriggers.length; i++) {
			addTriggers[i].disabled = false;
			addTriggers[i].removeAttribute('aria-disabled');
		}
		const items = this._getItems();
		for (let i = 0; i < items.length; i++) {
			const removeBtns = items[i].querySelectorAll('[' + REMOVE_ATTR + ']');
			for (let j = 0; j < removeBtns.length; j++) {
				if (!this._ownsElement(removeBtns[j])) continue;
				removeBtns[j].disabled = false;
				removeBtns[j].removeAttribute('aria-disabled');
			}
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ─────────────────────────────────────

	function _syncBounds(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance._ensureMin();
		instance._syncControls();
	}

	// ─── External Add Trigger (Two-Host Pattern) ────────────

	if (typeof document !== 'undefined') {
		document.addEventListener('click', function (e) {
			if (shouldIgnoreClick(e)) return;
			const trigger = e.target.closest('[' + ADD_FOR_ATTR + ']');
			if (!trigger || trigger.disabled) return;
			const targetId = trigger.getAttribute(ADD_FOR_ATTR);
			if (!targetId) return;
			const target = document.getElementById(targetId);
			if (!target) return;
			e.preventDefault();
			dispatch(target, 'ln-repeater:request-add', { focus: true });
		});
	}

	// ─── Init ───────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-repeater', {
		attributes: ATTRIBUTES
	});
})();
