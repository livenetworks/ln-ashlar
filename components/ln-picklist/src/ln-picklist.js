import { registerComponent, dispatch, dispatchCancelable } from '../../ln-core';

(function () {
	'use strict';

	const DOM_SELECTOR = 'data-ln-picklist';
	const DOM_ATTRIBUTE = 'lnPicklist';
	const LIST_ATTR = 'data-ln-picklist-list';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-picklist':      { effect: _syncEnabled },
		'data-ln-picklist-list': {}
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

		// Snapshot the authored placement. A form reset restores `checked` —
		// the browser cannot put the nodes back where they came from.
		this._initial = [];
		for (const list of [this.available, this.selected]) {
			for (const item of list.children) {
				this._initial.push({ item: item, list: list });
			}
		}

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

	// ─── Form Reset ────────────────────────────────────────────
	//
	// Resetting a form restores every control to its default SILENTLY — the
	// spec fires no `change` and no `input` for them, only `reset` on the form
	// itself. So the change handler never hears about it, and the items would
	// stay in whichever list the user left them while their boxes flipped back.

	_component.prototype._onFormReset = function (e) {
		const self = this;

		// `reset` fires BEFORE the controls are restored, and it is cancelable,
		// so the work is deferred and re-checked — the same shape ln-editor
		// uses to re-read its textarea. Re-appending in the recorded order
		// rebuilds both lists exactly as they were authored.
		setTimeout(function () {
			if (self._destroyed || e.defaultPrevented) return;

			for (const entry of self._initial) {
				// Never resurrect an item the page removed on purpose.
				if (entry.item.isConnected) entry.list.appendChild(entry.item);
			}
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

	function _syncEnabled(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		const shouldBeEnabled = el.getAttribute(DOM_SELECTOR) !== 'disabled';
		if (shouldBeEnabled === instance.isEnabled) return;
		instance.isEnabled = shouldBeEnabled;
		dispatch(el, shouldBeEnabled ? 'ln-picklist:enabled' : 'ln-picklist:disabled', { target: el });
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-picklist', {
		attributes: ATTRIBUTES
	});
})();
