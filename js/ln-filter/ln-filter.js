(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
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

		const initialActive = dom.querySelector('[data-ln-filter-key][data-ln-filter-value=""]');
		if (initialActive) {
			initialActive.setAttribute('data-active', '');
		}

		return this;
	}

	_component.prototype._bindEvents = function () {
		const self = this;

		this._clickHandler = function (e) {
			const btn = e.target.closest('[data-ln-filter-key]');
			if (!btn || !self.dom.contains(btn)) return;

			const key = btn.getAttribute('data-ln-filter-key');
			const value = btn.getAttribute('data-ln-filter-value');
			self.filter(key, value);
		};
		this.dom.addEventListener('click', this._clickHandler);
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.filter = function (key, value) {
		const buttons = Array.from(this.dom.querySelectorAll('[data-ln-filter-key]'));
		for (const btn of buttons) {
			btn.removeAttribute('data-active');
		}

		const matchBtn = this.dom.querySelector(
			'[data-ln-filter-key="' + key + '"][data-ln-filter-value="' + (value || '') + '"]'
		);
		if (matchBtn) matchBtn.setAttribute('data-active', '');

		if (!value) {
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
		const resetBtn = this.dom.querySelector('[data-ln-filter-key][data-ln-filter-value=""]');
		const key = resetBtn ? resetBtn.getAttribute('data-ln-filter-key') : '';
		this.filter(key, '');
	};

	_component.prototype.getActive = function () {
		if (!this._activeKey) return null;
		return { key: this._activeKey, value: this._activeValue };
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('click', this._clickHandler);
		if (this._targetObserver) {
			this._targetObserver.disconnect();
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Private ───────────────────────────────────────────────

	_component.prototype._resolveTarget = function () {
		if (!this._target) {
			const targetId = this.dom.getAttribute(DOM_SELECTOR);
			this._target = targetId ? document.getElementById(targetId) : null;
		}
		return this._target;
	};

	_component.prototype._getItems = function () {
		const target = this._resolveTarget();
		if (!target) return [];
		return Array.from(target.children);
	};

	_component.prototype._apply = function () {
		const key = this._activeKey;
		const value = this._activeValue;

		for (const el of this._getItems()) {
			if (!key || !value) {
				el.removeAttribute('data-ln-filter-hide');
			} else {
				const elValue = el.getAttribute('data-' + key);
				if (elValue !== null && elValue.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
					el.removeAttribute('data-ln-filter-hide');
				} else {
					el.setAttribute('data-ln-filter-hide', '');
				}
			}
		}
	};

	_component.prototype._ensureTargetObserver = function () {
		const target = this._resolveTarget();
		if (!target || this._targetObserver) return;

		const self = this;
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
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					}
				}
			}
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
