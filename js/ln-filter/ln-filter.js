(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';

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
		dom[DOM_ATTRIBUTE] = this;

		this._activeKey = null;
		this._activeValue = null;
		this._target = null;
		this._targetObserver = null;

		this._bindEvents();

		// Set initial active (first button with empty value)
		var initialActive = dom.querySelector('[data-ln-filter-key][data-ln-filter-value=""]');
		if (initialActive) {
			initialActive.setAttribute('data-active', '');
		}

		return this;
	}

	_component.prototype._bindEvents = function () {
		var self = this;

		// Event delegation on own DOM
		this.dom.addEventListener('click', function (e) {
			var btn = e.target.closest('[data-ln-filter-key]');
			if (!btn || !self.dom.contains(btn)) return;

			var key = btn.getAttribute('data-ln-filter-key');
			var value = btn.getAttribute('data-ln-filter-value');
			self.filter(key, value);
		});
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.filter = function (key, value) {
		// Update data-active on buttons
		var buttons = Array.from(this.dom.querySelectorAll('[data-ln-filter-key]'));
		buttons.forEach(function (btn) {
			btn.removeAttribute('data-active');
		});

		// Find and activate matching button
		var matchBtn = this.dom.querySelector(
			'[data-ln-filter-key="' + key + '"][data-ln-filter-value="' + (value || '') + '"]'
		);
		if (matchBtn) matchBtn.setAttribute('data-active', '');

		if (!value) {
			// Empty value = reset (show all)
			this._activeKey = null;
			this._activeValue = null;
			this._apply();
			_dispatch(this.dom, 'ln-filter:reset', {});
			return;
		}

		this._activeKey = key;
		this._activeValue = value;
		this._apply();
		this._ensureTargetObserver();

		_dispatch(this.dom, 'ln-filter:changed', {
			key: key,
			value: value
		});
	};

	_component.prototype.reset = function () {
		// Find the reset button (empty value) key, or use current key
		var resetBtn = this.dom.querySelector('[data-ln-filter-key][data-ln-filter-value=""]');
		var key = resetBtn ? resetBtn.getAttribute('data-ln-filter-key') : '';
		this.filter(key, '');
	};

	_component.prototype.getActive = function () {
		if (!this._activeKey) return null;
		return { key: this._activeKey, value: this._activeValue };
	};

	// ─── Private ───────────────────────────────────────────────

	_component.prototype._resolveTarget = function () {
		if (!this._target) {
			var targetId = this.dom.getAttribute(DOM_SELECTOR);
			this._target = targetId ? document.getElementById(targetId) : null;
		}
		return this._target;
	};

	_component.prototype._getItems = function () {
		var target = this._resolveTarget();
		if (!target) return [];
		return Array.from(target.children);
	};

	_component.prototype._apply = function () {
		var key = this._activeKey;
		var value = this._activeValue;

		this._getItems().forEach(function (el) {
			if (!key || !value) {
				// No active filter — show all
				el.removeAttribute('data-ln-filter-hide');
			} else {
				var elValue = el.getAttribute('data-' + key);
				if (elValue !== null && elValue.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
					el.removeAttribute('data-ln-filter-hide');
				} else {
					el.setAttribute('data-ln-filter-hide', '');
				}
			}
		});
	};

	_component.prototype._ensureTargetObserver = function () {
		var target = this._resolveTarget();
		if (!target || this._targetObserver) return;

		var self = this;
		this._targetObserver = new MutationObserver(function () {
			if (self._activeKey) self._apply();
		});
		this._targetObserver.observe(target, { childList: true });
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
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
