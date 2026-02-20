(function () {
	const DOM_SELECTOR = '[data-ln-box]';
	const DOM_ATTRIBUTE = 'lnBox';

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(domRoot) {
		let items = domRoot.querySelectorAll(DOM_SELECTOR) || [];

		if (domRoot.hasAttribute('data-ln-box')) {
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
		_setEventListeners.call(this);
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

	function _init() {
		this.buttons = {};
		this.buttons.collapse = this.dom.querySelectorAll('[data-ln-box-action="collapse"]');
		this.buttons.expand = this.dom.querySelectorAll('[data-ln-box-action="expand"]');

		return this;
	}

	function _setEventListeners() {
		// Collapse
		this.buttons.collapse.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				collapse.call(this);
			}, false)
		})
		// Expand
		this.buttons.expand.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				expand.call(this);
			}, false)
		})
	}

	function collapse() {
		this.dom.setAttribute('data-ln-box', "collapsed");
	}
	function expand() {
		this.dom.setAttribute('data-ln-box', "");
	}

	// make lnBox globally available
	window[DOM_ATTRIBUTE] = constructor;
	_constructor.prototype.collapse = collapse;
	_constructor.prototype.expand = expand;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			window.lnBox(document.body);
		});
	} else {
		window.lnBox(document.body);
	}
})();
