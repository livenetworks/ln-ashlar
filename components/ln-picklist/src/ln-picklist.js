import { registerComponent, dispatch, dispatchCancelable } from '../../ln-core';

(function () {
	'use strict';

	const DOM_SELECTOR = 'data-ln-picklist';
	const DOM_ATTRIBUTE = 'lnPicklist';
	const LIST_ATTR = 'data-ln-picklist-list';
	const MAX_ATTR = 'data-ln-picklist-max';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-picklist':      { type: 'enum', values: ['enabled', 'disabled'], fallback: 'enabled', effect: _syncEnabled, description: 'Controls enabled/disabled state of the dual-list picklist' },
		'data-ln-picklist-max':  { type: 'integer', fallback: Infinity, min: 1, effect: _syncMax, description: 'Maximum selectable items in the selected list' },
		'data-ln-picklist-list': { type: 'enum', values: ['available', 'selected'], description: 'Role marker for available or selected picklist columns' }
	};

	// ─── Component ─────────────────────────────────────────────
	//
	// The checkbox IS the state. Its `checked` property and the list the item
	// currently sits in are the same fact, and `name`/`value` carry the
	// selection to the server natively — unchecked boxes are not submitted.
	// Hence no hidden inputs, no state attribute and no JS mirror.

	function _component(dom) {
		this.dom = dom;
		this.isEnabled = dom.getAttribute(DOM_SELECTOR) !== 'disabled';
		this.max = _readMax(dom);

		this.available = dom.querySelector('[' + LIST_ATTR + '="available"]');
		this.selected = dom.querySelector('[' + LIST_ATTR + '="selected"]');

		// Report the gap rather than failing on the first click.
		if (!this.available || !this.selected) {
			console.warn('[ln-picklist] requires both [' + LIST_ATTR + '="available"] and [' + LIST_ATTR + '="selected"]', dom);
			return this;
		}

		// Bound once so destroy() can detach the same reference.
		this._onChange = this._onChange.bind(this);
		dom.addEventListener('change', this._onChange);

		// Snapshot the authored items in document order.
		this._initial = [];
		for (const list of [this.available, this.selected]) {
			for (const item of list.children) {
				this._initial.push(item);
			}
		}

		// Initial sync: transfer checked items to selected, unchecked to available.
		this.sync();

		this._form = dom.closest('form');
		if (this._form) {
			this._onFormReset = this._onFormReset.bind(this);
			this._form.addEventListener('reset', this._onFormReset);
		}

		return this;
	}

	// ─── Lifecycle ─────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._destroyed = true;
		if (this._onChange) this.dom.removeEventListener('change', this._onChange);
		if (this._form) this._form.removeEventListener('reset', this._onFormReset);
		dispatch(this.dom, 'ln-picklist:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Instance API ──────────────────────────────────────────

	_component.prototype.enable = function () {
		this.dom.setAttribute(DOM_SELECTOR, '');
	};

	_component.prototype.disable = function () {
		this.dom.setAttribute(DOM_SELECTOR, 'disabled');
	};

	_component.prototype.sync = function () {
		if (!this.available || !this.selected) return;

		// Include any dynamically added items not yet tracked
		const currentItems = Array.from(this.available.children).concat(Array.from(this.selected.children));
		for (let i = 0; i < currentItems.length; i++) {
			if (!this._initial.includes(currentItems[i])) {
				this._initial.push(currentItems[i]);
			}
		}

		let selectedCount = 0;
		for (let i = 0; i < this._initial.length; i++) {
			const item = this._initial[i];
			if (!item.isConnected) continue;
			const checkbox = item.querySelector('input[type="checkbox"]');
			if (!checkbox) continue;

			let targetList;
			if (checkbox.checked) {
				if (this.max === null || selectedCount < this.max) {
					targetList = this.selected;
					selectedCount++;
				} else {
					checkbox.checked = false;
					targetList = this.available;
				}
			} else {
				targetList = this.available;
			}
			targetList.appendChild(item);
		}
	};

	// ─── Form Reset ────────────────────────────────────────────
	//
	// Resetting a form restores every control to its default SILENTLY — the
	// spec fires no `change` and no `input` for them, only `reset` on the form
	// itself. Re-syncing in recorded order rebuilds both lists according to
	// defaultChecked.

	_component.prototype._onFormReset = function (e) {
		const self = this;

		// `reset` fires BEFORE the controls are restored, and it is cancelable,
		// so the work is deferred and re-checked — the same shape ln-editor
		// uses to re-read its textarea.
		setTimeout(function () {
			if (self._destroyed || e.defaultPrevented) return;
			self.sync();
		}, 0);
	};

	// ─── Change Handler ────────────────────────────────────────

	_component.prototype._onChange = function (e) {
		// `change` bubbles, so anything the author composes inside the root —
		// an ln-search input, a select — reaches this listener. Filter hard.
		const checkbox = e.target.closest('input[type="checkbox"]');
		if (!checkbox) return;

		const item = checkbox.closest('li');
		if (!item) return;

		const from = item.parentElement;
		if (from !== this.available && from !== this.selected) return;

		// The browser has already toggled the box by the time this runs, so a
		// bare return would leave it checked while the item stays put — which
		// is exactly the contradiction this component exists to avoid.
		if (!this.isEnabled) {
			checkbox.checked = !checkbox.checked;
			return;
		}

		const to = checkbox.checked ? this.selected : this.available;

		// Inconsistent authored markup (a checked item rendered on the left),
		// or a synthetic change that did not flip the box, would otherwise
		// re-append in place and emit a move that never happened.
		if (from === to) return;

		// Enforce maximum selection limit if configured
		if (to === this.selected && this.max !== null && this.selected.children.length >= this.max) {
			checkbox.checked = !checkbox.checked;
			dispatch(this.dom, 'ln-picklist:max-reached', {
				max: this.max,
				item: item,
				checkbox: checkbox,
				count: this.selected.children.length
			});
			return;
		}

		// One record, both events — they describe the same move.
		const detail = { item: item, from: from, to: to, checkbox: checkbox };

		if (dispatchCancelable(this.dom, 'ln-picklist:before-move', detail).defaultPrevented) {
			checkbox.checked = !checkbox.checked;
			return;
		}

		// Re-parenting a node that holds focus blurs it to <body> in Chromium.
		// Only restore when the focus really was here: a synthetic change from
		// a script must not steal focus away from whatever the user is using.
		const hadFocus = document.activeElement === checkbox;

		to.appendChild(item);

		if (hadFocus) checkbox.focus();

		dispatch(this.dom, 'ln-picklist:move', detail);
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _readMax(el) {
		const raw = el.getAttribute(MAX_ATTR);
		if (raw === null || raw === '') return null;
		const parsed = parseInt(raw, 10);
		return isNaN(parsed) || parsed < 0 ? null : parsed;
	}

	function _syncEnabled(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		const shouldBeEnabled = el.getAttribute(DOM_SELECTOR) !== 'disabled';
		if (shouldBeEnabled === instance.isEnabled) return;
		instance.isEnabled = shouldBeEnabled;
		dispatch(el, shouldBeEnabled ? 'ln-picklist:enabled' : 'ln-picklist:disabled', { target: el });
	}

	function _syncMax(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance.max = _readMax(el);
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-picklist', {
		attributes: ATTRIBUTES
	});
})();
