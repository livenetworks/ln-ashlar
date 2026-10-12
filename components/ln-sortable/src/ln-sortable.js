import { registerComponent, dispatch, dispatchCancelable } from '../../ln-core';

(function () {
	'use strict';

	const DOM_SELECTOR = 'data-ln-sortable';
	const DOM_ATTRIBUTE = 'lnSortable';
	const HANDLE_ATTR = 'data-ln-sortable-handle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-sortable':        { effect: _syncEnabled, type: 'enum', values: ['enabled', 'disabled'], fallback: 'enabled', description: 'Enables drag-and-drop item reordering or disables when set to disabled' },
		'data-ln-sortable-handle': { type: 'marker', description: 'Designates an element as the drag handle for its parent sortable item' }
	};

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

	// ─── Lifecycle ─────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('pointerdown', this._onPointerDown);
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
		let rafMove = null;
		let lastEvent = null;

		const onMove = function (ev) {
			lastEvent = ev;
			if (rafMove) return;
			rafMove = requestAnimationFrame(function () {
				rafMove = null;
				if (lastEvent) self._handlePointerMove(lastEvent);
			});
		};
		const onEnd = function (ev) {
			if (rafMove) {
				cancelAnimationFrame(rafMove);
				rafMove = null;
			}
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

		let targetChild = null;
		let targetPos = null;

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child === dragging) continue;

			const rect = child.getBoundingClientRect();
			const mid = rect.top + rect.height / 2;

			if (e.clientY >= rect.top && e.clientY < mid) {
				targetChild = child;
				targetPos = 'before';
				break;
			} else if (e.clientY >= mid && e.clientY <= rect.bottom) {
				targetChild = child;
				targetPos = 'after';
				break;
			}
		}

		if (this._lastDropTarget === targetChild && this._lastDropPos === targetPos) {
			return;
		}

		if (this._lastDropTarget && this._lastDropTarget !== targetChild) {
			this._lastDropTarget.classList.remove('ln-sortable--drop-before', 'ln-sortable--drop-after');
		}

		this._lastDropTarget = targetChild;
		this._lastDropPos = targetPos;

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child !== targetChild) {
				if (child.classList.contains('ln-sortable--drop-before')) child.classList.remove('ln-sortable--drop-before');
				if (child.classList.contains('ln-sortable--drop-after')) child.classList.remove('ln-sortable--drop-after');
			}
		}

		if (targetChild) {
			const cls = targetPos === 'before' ? 'ln-sortable--drop-before' : 'ln-sortable--drop-after';
			const otherCls = targetPos === 'before' ? 'ln-sortable--drop-after' : 'ln-sortable--drop-before';
			if (targetChild.classList.contains(otherCls)) targetChild.classList.remove(otherCls);
			if (!targetChild.classList.contains(cls)) targetChild.classList.add(cls);
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

		this._lastDropTarget = null;
		this._lastDropPos = null;

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
		attributes: ATTRIBUTES
	});
})();
