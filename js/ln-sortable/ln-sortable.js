(function () {
	'use strict';

	var DOM_SELECTOR = 'data-ln-sortable';
	var DOM_ATTRIBUTE = 'lnSortable';
	var HANDLE_ATTR = 'data-ln-sortable-handle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		var items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isEnabled = true;
		this._dragging = null;

		var self = this;

		// Delegated pointerdown on container
		dom.addEventListener('pointerdown', function (e) {
			if (!self.isEnabled) return;
			self._onPointerDown(e);
		});

		// Request events
		dom.addEventListener('ln-sortable:request-enable', function () {
			self.enable();
		});
		dom.addEventListener('ln-sortable:request-disable', function () {
			self.disable();
		});

		return this;
	}

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.enable = function () {
		this.isEnabled = true;
	};

	_component.prototype.disable = function () {
		this.isEnabled = false;
	};

	// ─── Pointer Handlers ──────────────────────────────────────

	_component.prototype._onPointerDown = function (e) {
		var handle = e.target.closest('[' + HANDLE_ATTR + ']');
		var item;

		if (handle) {
			// Handle found — walk up to find the direct child of this container
			item = handle;
			while (item && item.parentElement !== this.dom) {
				item = item.parentElement;
			}
			if (!item || item.parentElement !== this.dom) return;
		} else {
			// No handle clicked — check if handles exist at all
			if (this.dom.querySelector('[' + HANDLE_ATTR + ']')) return;

			// No handles anywhere — whole child is draggable
			item = e.target;
			while (item && item.parentElement !== this.dom) {
				item = item.parentElement;
			}
			if (!item || item.parentElement !== this.dom) return;
			handle = item;
		}

		// Cancelable before-drag event
		var children = Array.from(this.dom.children);
		var index = children.indexOf(item);

		var before = _dispatchCancelable(this.dom, 'ln-sortable:before-drag', {
			item: item,
			index: index
		});
		if (before.defaultPrevented) return;

		// Start drag
		e.preventDefault();
		handle.setPointerCapture(e.pointerId);

		this._dragging = item;

		item.classList.add('ln-sortable--dragging');
		this.dom.classList.add('ln-sortable--active');

		_dispatch(this.dom, 'ln-sortable:drag-start', {
			item: item,
			index: index
		});

		// Bind move + end on handle (pointer capture keeps events flowing)
		var self = this;
		var onMove = function (ev) { self._onPointerMove(ev); };
		var onEnd = function (ev) {
			self._onPointerEnd(ev);
			handle.removeEventListener('pointermove', onMove);
			handle.removeEventListener('pointerup', onEnd);
			handle.removeEventListener('pointercancel', onEnd);
		};

		handle.addEventListener('pointermove', onMove);
		handle.addEventListener('pointerup', onEnd);
		handle.addEventListener('pointercancel', onEnd);
	};

	_component.prototype._onPointerMove = function (e) {
		if (!this._dragging) return;

		var children = Array.from(this.dom.children);
		var dragging = this._dragging;

		// Clear existing drop indicators
		children.forEach(function (child) {
			child.classList.remove('ln-sortable--drop-before', 'ln-sortable--drop-after');
		});

		// Find drop target
		for (var i = 0; i < children.length; i++) {
			if (children[i] === dragging) continue;

			var rect = children[i].getBoundingClientRect();
			var mid = rect.top + rect.height / 2;

			if (e.clientY >= rect.top && e.clientY < mid) {
				children[i].classList.add('ln-sortable--drop-before');
				break;
			} else if (e.clientY >= mid && e.clientY <= rect.bottom) {
				children[i].classList.add('ln-sortable--drop-after');
				break;
			}
		}
	};

	_component.prototype._onPointerEnd = function (e) {
		if (!this._dragging) return;

		var item = this._dragging;
		var children = Array.from(this.dom.children);
		var oldIndex = children.indexOf(item);

		// Find drop target
		var dropTarget = null;
		var dropPosition = null;

		for (var i = 0; i < children.length; i++) {
			if (children[i].classList.contains('ln-sortable--drop-before')) {
				dropTarget = children[i];
				dropPosition = 'before';
				break;
			}
			if (children[i].classList.contains('ln-sortable--drop-after')) {
				dropTarget = children[i];
				dropPosition = 'after';
				break;
			}
		}

		// Clean up all classes
		children.forEach(function (child) {
			child.classList.remove('ln-sortable--drop-before', 'ln-sortable--drop-after');
		});
		item.classList.remove('ln-sortable--dragging');
		this.dom.classList.remove('ln-sortable--active');

		// Perform DOM reorder
		if (dropTarget && dropTarget !== item) {
			if (dropPosition === 'before') {
				this.dom.insertBefore(item, dropTarget);
			} else {
				this.dom.insertBefore(item, dropTarget.nextElementSibling);
			}

			var newChildren = Array.from(this.dom.children);
			var newIndex = newChildren.indexOf(item);

			_dispatch(this.dom, 'ln-sortable:reordered', {
				item: item,
				oldIndex: oldIndex,
				newIndex: newIndex
			});
		}

		this._dragging = null;
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
