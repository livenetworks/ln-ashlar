(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _isBar(el) {
		const val = el.getAttribute('data-ln-progress');
		return val !== null && val !== '';
	}

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _findElements(domRoot) {
		const items = Array.from(domRoot.querySelectorAll(DOM_SELECTOR));

		for (const item of items) {
			if (_isBar(item) && !item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			}
		}

		if (domRoot.hasAttribute && domRoot.hasAttribute('data-ln-progress') && _isBar(domRoot) && !domRoot[DOM_ATTRIBUTE]) {
			domRoot[DOM_ATTRIBUTE] = new _constructor(domRoot);
		}
	}

	function _constructor(dom) {
		this.dom = dom;
		this._attrObserver = null;
		this._parentObserver = null;
		_render.call(this);
		_listenValues.call(this);
		_listenParent.call(this);
		return this;
	}

	_constructor.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._attrObserver) {
			this._attrObserver.disconnect();
		}
		if (this._parentObserver) {
			this._parentObserver.disconnect();
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					for (const item of mutation.addedNodes) {
						if (item.nodeType === 1) {
							_findElements(item);
						}
					}
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-ln-progress']
		});
	}

	_domObserver();

	function _listenValues() {
		const self = this;
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'data-ln-progress' || mutation.attributeName === 'data-ln-progress-max') {
					_render.call(self);
				}
			}
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeFilter: ['data-ln-progress', 'data-ln-progress-max']
		});

		this._attrObserver = observer;
	}

	function _listenParent() {
		const self = this;
		const parent = this.dom.parentElement;
		if (!parent || !parent.hasAttribute('data-ln-progress-max')) return;

		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'data-ln-progress-max') {
					_render.call(self);
				}
			}
		});

		observer.observe(parent, {
			attributes: true,
			attributeFilter: ['data-ln-progress-max']
		});

		this._parentObserver = observer;
	}

	function _render() {
		const value = parseFloat(this.dom.getAttribute('data-ln-progress')) || 0;
		const parent = this.dom.parentElement;
		const parentMax = parent && parent.hasAttribute('data-ln-progress-max')
			? parseFloat(parent.getAttribute('data-ln-progress-max'))
			: null;
		const max = parentMax || parseFloat(this.dom.getAttribute('data-ln-progress-max')) || 100;
		let percentage = (max > 0) ? (value / max) * 100 : 0;

		if (percentage < 0) percentage = 0;
		if (percentage > 100) percentage = 100;

		this.dom.style.width = percentage + '%';
		_dispatch(this.dom, 'ln-progress:change', { target: this.dom, value: value, max: max, percentage: percentage });
	}

	window[DOM_ATTRIBUTE] = constructor;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
