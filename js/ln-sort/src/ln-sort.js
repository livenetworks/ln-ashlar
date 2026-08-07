import { dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-sort';
	const DOM_ATTRIBUTE = 'lnSort';
	const FIELD_ATTR = 'data-ln-sort-field';
	const ASC_CLASS = 'ln-sort-asc';
	const DESC_CLASS = 'ln-sort-desc';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _nextDirection(current, field) {
		if (!current || current.field !== field) return 'asc';
		if (current.direction === 'asc') return 'desc';
		return null;
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);
		this.triggers = Array.from(dom.querySelectorAll('[' + FIELD_ATTR + ']'));

		// Local best-guess of active sort — drives the click cycle.
		// Painting of asc/desc classes is driven separately by the store echo.
		this._current = null;

		// Event-diff cache — null means never dispatched yet
		this._lastSnapshot = null;

		const self = this;

		this._onClick = function (e) {
			const trigger = e.target.closest('[' + FIELD_ATTR + ']');
			if (!trigger || !dom.contains(trigger)) return;

			const field = trigger.getAttribute(FIELD_ATTR);
			const direction = _nextDirection(self._current, field);
			self._current = direction ? { field: field, direction: direction } : null;

			self._emit();
		};
		dom.addEventListener('click', this._onClick);

		this._onQueryChanged = function (e) {
			const detail = e.detail || {};
			if (detail.store !== self.targetId) return;
			self._paint(detail.query && detail.query.sort ? detail.query.sort : null);
		};
		document.addEventListener('ln-data-store:query-changed', this._onQueryChanged);

		return this;
	}

	// ─── Emit ──────────────────────────────────────────────────

	_component.prototype._emit = function () {
		const current = this._current;
		const prev = this._lastSnapshot;

		const unchanged = (!prev && !current)
			|| (prev && current && prev.field === current.field && prev.direction === current.direction);

		if (unchanged) return;

		this._lastSnapshot = current ? { field: current.field, direction: current.direction } : null;

		this._dispatchOnBoth('ln-sort:changed', {
			field: current ? current.field : null,
			direction: current ? current.direction : null
		});
	};

	_component.prototype._dispatchOnBoth = function (eventName, detail) {
		dispatch(this.dom, eventName, detail);
		const target = document.getElementById(this.targetId);
		if (target && target !== this.dom) {
			dispatch(target, eventName, detail);
		}
	};

	// ─── Paint (echo-driven, not local state) ──────────────────

	_component.prototype._paint = function (sort) {
		for (let i = 0; i < this.triggers.length; i++) {
			const trigger = this.triggers[i];
			const field = trigger.getAttribute(FIELD_ATTR);
			trigger.classList.remove(ASC_CLASS, DESC_CLASS);
			if (sort && sort.field === field) {
				trigger.classList.add(sort.direction === 'desc' ? DESC_CLASS : ASC_CLASS);
			}
		}
		this._current = sort ? { field: sort.field, direction: sort.direction } : null;
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('click', this._onClick);
		document.removeEventListener('ln-data-store:query-changed', this._onQueryChanged);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-sort');
})();
