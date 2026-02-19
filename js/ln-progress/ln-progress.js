// Usage:
(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';
	const ALLOWED_NOTE_TYPES = new Set([1, 2, 9, 10, 11]);

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
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
		_setEventListeners.call(this);
		return this;
	}

	function _domObserver() {
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type == "childList") {
					mutation.addedNodes.forEach(function (item) {
						if (ALLOWED_NOTE_TYPES.has(item.nodeType)) {
							_findElements(item);
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true
		});
	}

	_domObserver();

	function _listenValues() {
		let observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName.includes('data-progress')) {
					console.log(mutation);
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



	// Edit Below

	function _init() {
		this.values = {};
		this.values.progressMin = this.dom.dataset.progressMin || 0;
		this.values.progressMax = this.dom.dataset.progressMax || 100;
		this.values.progressValue = this.dom.dataset.progressValue || 100;

		_render.call(this);
		return this;
	}

	function _setEventListeners() {


	}

	function _render() {
		console.log(this.dom, this.values);

		let range = this.values.progressMax - this.values.progressMin;
		let correctedStartValue = this.values.progressValue - this.values.progressMin;
		let percentage = (correctedStartValue * 100) / range;
		if (percentage < 0) { percentage = 0; }

		this.dom.style.width = percentage + '%';
	}


	// make lnResizer globaly avaliable
	window[DOM_ATTRIBUTE] = constructor;
})();

document.addEventListener('DOMContentLoaded', function () {
	window.lnProgress(document.body);
});
