import { registerComponent, dispatch, dispatchCancelable } from '../ln-core';

(function () {
	'use strict';

	const DOM_SELECTOR = 'data-ln-sortable';
	const DOM_ATTRIBUTE = 'lnSortable';
	const HANDLE_ATTR = 'data-ln-sortable-handle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isEnabled = dom.getAttribute(DOM_SELECTOR) !== 'disabled';
		this._dragging = null;

		dom.setAttribute('aria-roledescription', 'sortable list');

		const self = this;

		this._onPointerDown = function (e) {
			if (!self.isEnabled) return;
			self._handlePointerDown(e);
		};
		dom.addEventListener('pointerdown', this._onPointerDown);

		return this;
	}

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.enable = function () {
		if (this.isEnabled) return;
		this.dom.setAttribute(DOM_SELECTOR, '');
	};

	_component.prototype.disable = function () {
		if (!this.isEnabled) return;
		this.dom.setAttribute(DOM_SELECTOR, 'disabled');
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('pointerdown', this._onPointerDown);
		dispatch(this.dom, 'ln-sortable:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Pointer Handlers ──────────────────────────────────────

	_component.prototype._handlePointerDown = function (e) {
		let handle = e.target.closest('[' + HANDLE_ATTR + ']');
		let item;

		if (handle) {
			item = handle;
			while (item && item.parentElement !== this.dom) {
				item = item.parentElement;
			}
			if (!item || item.parentElement !== this.dom) return;
		} else {
			if (this.dom.querySelector('[' + HANDLE_ATTR + ']')) return;

			item = e.target;
			while (item && item.parentElement !== this.dom) {
				item = item.parentElement;
			}
			if (!item || item.parentElement !== this.dom) return;
			handle = item;
		}

		const children = Array.from(this.dom.children);
		const index = children.indexOf(item);

		const before = dispatchCancelable(this.dom, 'ln-sortable:before-drag', {
			item: item,
			index: index
		});
		if (before.defaultPrevented) return;

		e.preventDefault();
		handle.setPointerCapture(e.pointerId);

		this._dragging = item;

		item.classList.add('ln-sortable--dragging');
		item.setAttribute('aria-grabbed', 'true');
		this.dom.classList.add('ln-sortable--active');

		dispatch(this.dom, 'ln-sortable:drag-start', {
			item: item,
			index: index
		});

		const self = this;
		const onMove = function (ev) { self._handlePointerMove(ev); };
		const onEnd = function (ev) {
			self._handlePointerEnd(ev);
			handle.removeEventListener('pointermove', onMove);
			handle.removeEventListener('pointerup', onEnd);
			handle.removeEventListener('pointercancel', onEnd);
		};

		handle.addEventListener('pointermove', onMove);
		handle.addEventListener('pointerup', onEnd);
		handle.addEventListener('pointercancel', onEnd);
	};

	_component.prototype._handlePointerMove = function (e) {
		if (!this._dragging) return;

		const children = Array.from(this.dom.children);
		const dragging = this._dragging;

		for (const child of children) {
			child.classList.remove('ln-sortable--drop-before', 'ln-sortable--drop-after');
		}

		for (const child of children) {
			if (child === dragging) continue;

			const rect = child.getBoundingClientRect();
			const mid = rect.top + rect.height / 2;

			if (e.clientY >= rect.top && e.clientY < mid) {
				child.classList.add('ln-sortable--drop-before');
				break;
			} else if (e.clientY >= mid && e.clientY <= rect.bottom) {
				child.classList.add('ln-sortable--drop-after');
				break;
			}
		}
	};

	_component.prototype._handlePointerEnd = function (e) {
		if (!this._dragging) return;

		const item = this._dragging;
		const children = Array.from(this.dom.children);
		const oldIndex = children.indexOf(item);

		let dropTarget = null;
		let dropPosition = null;

		for (const child of children) {
			if (child.classList.contains('ln-sortable--drop-before')) {
				dropTarget = child;
				dropPosition = 'before';
				break;
			}
			if (child.classList.contains('ln-sortable--drop-after')) {
				dropTarget = child;
				dropPosition = 'after';
				break;
			}
		}

		for (const child of children) {
			child.classList.remove('ln-sortable--drop-before', 'ln-sortable--drop-after');
		}
		item.classList.remove('ln-sortable--dragging');
		item.removeAttribute('aria-grabbed');
		this.dom.classList.remove('ln-sortable--active');

		if (dropTarget && dropTarget !== item) {
			if (dropPosition === 'before') {
				this.dom.insertBefore(item, dropTarget);
			} else {
				this.dom.insertBefore(item, dropTarget.nextElementSibling);
			}

			const newChildren = Array.from(this.dom.children);
			const newIndex = newChildren.indexOf(item);

			dispatch(this.dom, 'ln-sortable:reordered', {
				item: item,
				oldIndex: oldIndex,
				newIndex: newIndex
			});
		}

		this._dragging = null;
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncEnabled(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		const shouldBeEnabled = el.getAttribute(DOM_SELECTOR) !== 'disabled';
		if (shouldBeEnabled === instance.isEnabled) return;
		instance.isEnabled = shouldBeEnabled;
		dispatch(el, shouldBeEnabled ? 'ln-sortable:enabled' : 'ln-sortable:disabled', { target: el });
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-sortable', {
		onAttributeChange: _syncEnabled
	});
})();
