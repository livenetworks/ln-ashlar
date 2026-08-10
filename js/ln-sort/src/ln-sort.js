import { dispatchCancelable, readValue, getLocale, detectValueType, compareValues, registerComponent, persistGet, persistSet } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-sort';
	const DOM_ATTRIBUTE = 'lnSort';
	const FIELD_ATTR = 'data-ln-sort-field';
	const STATE_ATTR = 'data-ln-sort-state';
	const DIR_ATTR = 'data-ln-sort-dir';
	const ITEMS_ATTR = 'data-ln-sort-items';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Read the value a default-DOM sort compares by: field-matched descendant
	// first, else the item itself. Never the column-index fallback — that
	// path is SSR/DOM-payload only (see README "No index/field bridge").
	function _readItemValue(item, field) {
		if (field) {
			const el = item.querySelector('[data-ln-field="' + field + '"]');
			if (el) return readValue(el);
		}
		return readValue(item);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);
		this.field = dom.getAttribute(FIELD_ATTR) || null;

		// Index fallback — resolved once, only when no field is authored.
		// SSR/DOM-payload path only; never bridged back to `field`.
		const th = dom.closest('th');
		this.column = (!this.field && th) ? th.cellIndex : null;

		this.itemsSelector = dom.getAttribute(ITEMS_ATTR) || null;

		// Snapshot the pre-sort DOM order once — the only state this
		// component holds, needed to restore direction "none".
		this._initialOrder = null;
		const target = document.getElementById(this.targetId);
		if (target) {
			this._initialOrder = this.itemsSelector
				? Array.from(target.querySelectorAll(this.itemsSelector))
				: Array.from(target.children);
		}
		this._target = target;

		const self = this;

		this._onClick = function (e) {
			const btn = e.target.closest('[' + DIR_ATTR + ']');
			if (!btn) return;
			self._apply(btn.getAttribute(DIR_ATTR));
		};
		dom.addEventListener('click', this._onClick);

		// Mutual exclusion — listen on the TARGET (not self). A sibling
		// ln-sort instance targeting the same target wins; this instance
		// resets to "none". Self-originated events naturally compare equal
		// (own field/column always matches itself) and no-op here.
		this._onTargetChange = function (e) {
			const same = self.field
				? e.detail.field === self.field
				: e.detail.column === self.column;
			if (same) return;
			dom.setAttribute(STATE_ATTR, 'none');
			// Single-sort invariant holds in storage too — a losing instance
			// must drop its key, else two non-null keys race on next load.
			if (dom.hasAttribute('data-ln-persist')) persistSet('sort', dom, null);
		};
		if (target) target.addEventListener('ln-sort:change', this._onTargetChange);

		// ─── Restore persisted sort ─────────────────────────────
		// Deferred — same hazard as ln-search's form-restore dispatch
		// (js/ln-search/src/ln-search.js): _apply() dispatches synchronously,
		// and a consumer (ln-table/ln-list) targeting the same id may not
		// have bound its ln-sort:change listener yet if it constructs later
		// in this same init sweep. queueMicrotask waits for that sweep to
		// finish first.
		if (dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('sort', dom);
			if (saved && saved.direction) {
				queueMicrotask(function () {
					self._apply(saved.direction, true);
				});
			}
		}

		return this;
	}

	_component.prototype._apply = function (direction, skipPersist) {
		this.dom.setAttribute(STATE_ATTR, direction);

		const target = this._target || document.getElementById(this.targetId);
		if (!target) return;

		const detail = {
			field: this.field,
			column: this.column,
			direction: direction,
			targetId: this.targetId
		};

		if (!skipPersist && this.dom.hasAttribute('data-ln-persist')) {
			persistSet('sort', this.dom, direction === 'none' ? null : detail);
		}

		const evt = dispatchCancelable(target, 'ln-sort:change', detail);
		if (evt.defaultPrevented) return;

		this._defaultSort(target, direction);
	};

	// ─── Default DOM behaviour (no consumer claimed the event) ────

	_component.prototype._defaultSort = function (target, direction) {
		const items = this.itemsSelector
			? Array.from(target.querySelectorAll(this.itemsSelector))
			: Array.from(target.children);
		if (!items.length) return;
		const parent = items[0].parentNode;

		let ordered;
		if (direction === 'none') {
			ordered = (this._initialOrder || items).filter(function (el) {
				return el.parentNode === parent;
			});
		} else {
			const field = this.field;
			const values = items.map(function (el) { return _readItemValue(el, field); });
			const type = detectValueType(values);
			const collator = typeof Intl !== 'undefined'
				? new Intl.Collator(getLocale(this.dom), { sensitivity: 'base' })
				: null;
			const multiplier = direction === 'desc' ? -1 : 1;

			ordered = items.slice().sort(function (a, b) {
				return compareValues(_readItemValue(a, field), _readItemValue(b, field), type, collator) * multiplier;
			});
		}

		const frag = document.createDocumentFragment();
		for (let i = 0; i < ordered.length; i++) frag.appendChild(ordered[i]);
		parent.appendChild(frag);
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('click', this._onClick);
		if (this._target) this._target.removeEventListener('ln-sort:change', this._onTargetChange);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-sort');
})();
