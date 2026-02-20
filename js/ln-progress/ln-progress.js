(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(domRoot) {
		let items = domRoot.querySelectorAll(DOM_SELECTOR) || [];

		if (domRoot.hasAttribute('data-ln-progress')) {
			items.push(domRoot);
		}

		items.forEach(function (item) {
			if (!item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			}
		})
	}

	function _constructor(dom) {
		this.dom = dom;
		_init.call(this);
		_listenValues.call(this);
		return this;
	}

	function _domObserver() {
		let observer = new MutationObserver(function (mutations) {
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
		let observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName.includes('data-progress')) {
					this.values = mutation.target.dataset;
					_render.call(this);
				}
			});
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeOldValue: true
		});
	}

	function _init() {
		this.values = {};
		this.values.progressMin = this.dom.dataset.progressMin || 0;
		this.values.progressMax = this.dom.dataset.progressMax || 100;
		this.values.progressValue = this.dom.dataset.progressValue || 100;

		_render.call(this);
		return this;
	}

	function _render() {
		let range = this.values.progressMax - this.values.progressMin;
		let correctedStartValue = this.values.progressValue - this.values.progressMin;
		let percentage = (correctedStartValue * 100) / range;
		if (percentage < 0) { percentage = 0; }

		this.dom.style.width = percentage + '%';
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
