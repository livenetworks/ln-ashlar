(function () {
	const DOM_SELECTOR = '[data-ln-circular-progress]';
	const DOM_ATTRIBUTE = 'lnCircularProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	var SVG_NS = 'http://www.w3.org/2000/svg';
	var VIEW_SIZE = 36;
	var RADIUS = 16;
	var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
			if (!item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			}
		});

		if (domRoot.hasAttribute && domRoot.hasAttribute('data-ln-circular-progress') && !domRoot[DOM_ATTRIBUTE]) {
			domRoot[DOM_ATTRIBUTE] = new _constructor(domRoot);
		}
	}

	function _constructor(dom) {
		this.dom = dom;
		this.svg = null;
		this.trackCircle = null;
		this.progressCircle = null;
		this.labelEl = null;
		_buildSvg.call(this);
		_render.call(this);
		_listenValues.call(this);
		dom.setAttribute('data-ln-circular-progress-initialized', '');
		return this;
	}

	function _createSvgElement(tag, attrs) {
		var el = document.createElementNS(SVG_NS, tag);
		for (var key in attrs) {
			el.setAttribute(key, attrs[key]);
		}
		return el;
	}

	function _buildSvg() {
		this.svg = _createSvgElement('svg', {
			viewBox: '0 0 ' + VIEW_SIZE + ' ' + VIEW_SIZE,
			'aria-hidden': 'true'
		});

		this.trackCircle = _createSvgElement('circle', {
			cx: VIEW_SIZE / 2,
			cy: VIEW_SIZE / 2,
			r: RADIUS,
			fill: 'none',
			'stroke-width': '3'
		});
		this.trackCircle.classList.add('ln-circular-progress__track');

		this.progressCircle = _createSvgElement('circle', {
			cx: VIEW_SIZE / 2,
			cy: VIEW_SIZE / 2,
			r: RADIUS,
			fill: 'none',
			'stroke-width': '3',
			'stroke-linecap': 'round',
			'stroke-dasharray': CIRCUMFERENCE,
			'stroke-dashoffset': CIRCUMFERENCE,
			transform: 'rotate(-90 ' + (VIEW_SIZE / 2) + ' ' + (VIEW_SIZE / 2) + ')'
		});
		this.progressCircle.classList.add('ln-circular-progress__fill');

		this.svg.appendChild(this.trackCircle);
		this.svg.appendChild(this.progressCircle);

		this.labelEl = document.createElement('strong');
		this.labelEl.classList.add('ln-circular-progress__label');

		this.dom.appendChild(this.svg);
		this.dom.appendChild(this.labelEl);
	}

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
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
				if (mutation.attributeName === 'data-ln-circular-progress' ||
					mutation.attributeName === 'data-ln-circular-progress-max') {
					_render.call(self);
				}
			});
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeFilter: ['data-ln-circular-progress', 'data-ln-circular-progress-max']
		});
	}

	function _render() {
		var value = parseFloat(this.dom.getAttribute('data-ln-circular-progress')) || 0;
		var max = parseFloat(this.dom.getAttribute('data-ln-circular-progress-max')) || 100;
		var percentage = (max > 0) ? (value / max) * 100 : 0;

		if (percentage < 0) percentage = 0;
		if (percentage > 100) percentage = 100;

		var offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
		this.progressCircle.setAttribute('stroke-dashoffset', offset);

		var label = this.dom.getAttribute('data-ln-circular-progress-label');
		this.labelEl.textContent = label !== null ? label : Math.round(percentage) + '%';

		_dispatch(this.dom, 'ln-circular-progress:change', {
			target: this.dom,
			value: value,
			max: max,
			percentage: percentage
		});
	}

	window[DOM_ATTRIBUTE] = constructor;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			window.lnCircularProgress(document.body);
		});
	} else {
		window.lnCircularProgress(document.body);
	}
})();
