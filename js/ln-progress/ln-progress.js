(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function _isBar(el) {
		var val = el.getAttribute('data-ln-progress');
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
		var items = Array.from(domRoot.querySelectorAll(DOM_SELECTOR));

		items.forEach(function (item) {
			if (_isBar(item) && !item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			}
		});

		if (domRoot.hasAttribute && domRoot.hasAttribute('data-ln-progress') && _isBar(domRoot) && !domRoot[DOM_ATTRIBUTE]) {
			domRoot[DOM_ATTRIBUTE] = new _constructor(domRoot);
		}
	}

	function _constructor(dom) {
		this.dom = dom;
		_render.call(this);
		_listenValues.call(this);
		return this;
	}

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach(function (item) {
						if (item.nodeType === 1) {
							_findElements(item);
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

	_domObserver();

	function _listenValues() {
		var self = this;
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.attributeName === 'data-ln-progress' || mutation.attributeName === 'data-ln-progress-max') {
					_render.call(self);
				}
			});
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeFilter: ['data-ln-progress', 'data-ln-progress-max']
		});
	}

	function _render() {
		var value = parseFloat(this.dom.getAttribute('data-ln-progress')) || 0;
		var max = parseFloat(this.dom.getAttribute('data-ln-progress-max')) || 100;
		var percentage = (max > 0) ? (value / max) * 100 : 0;

		if (percentage < 0) percentage = 0;
		if (percentage > 100) percentage = 100;

		this.dom.style.width = percentage + '%';
		_dispatch(this.dom, 'ln-progress:change', { target: this.dom, value: value, max: max, percentage: percentage });
	}

	// make lnProgress globally available
	window[DOM_ATTRIBUTE] = constructor;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			window.lnProgress(document.body);
		});
	} else {
		window.lnProgress(document.body);
	}
})();
