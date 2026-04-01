import { dispatch, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-circular-progress';
	const DOM_ATTRIBUTE = 'lnCircularProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const SVG_NS = 'http://www.w3.org/2000/svg';
	const VIEW_SIZE = 36;
	const RADIUS = 16;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _constructor);
	}

	function _constructor(dom) {
		this.dom = dom;
		this.svg = null;
		this.trackCircle = null;
		this.progressCircle = null;
		this.labelEl = null;
		this._attrObserver = null;
		_buildSvg.call(this);
		_render.call(this);
		_listenValues.call(this);
		dom.setAttribute('data-ln-circular-progress-initialized', '');
		return this;
	}

	_constructor.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._attrObserver) {
			this._attrObserver.disconnect();
		}
		if (this.svg) {
			this.svg.remove();
		}
		if (this.labelEl) {
			this.labelEl.remove();
		}
		this.dom.removeAttribute('data-ln-circular-progress-initialized');
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _createSvgElement(tag, attrs) {
		const el = document.createElementNS(SVG_NS, tag);
		for (const key in attrs) {
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
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const item of mutation.addedNodes) {
						if (item.nodeType === 1) {
							findElements(item, DOM_SELECTOR, DOM_ATTRIBUTE, _constructor);
						}
					}
				} else if (mutation.type === 'attributes') {
					findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _constructor);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-ln-circular-progress']
		});
	}

	_domObserver();

	function _listenValues() {
		const self = this;
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'data-ln-circular-progress' ||
					mutation.attributeName === 'data-ln-circular-progress-max') {
					_render.call(self);
				}
			}
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeFilter: ['data-ln-circular-progress', 'data-ln-circular-progress-max']
		});

		this._attrObserver = observer;
	}

	function _render() {
		const value = parseFloat(this.dom.getAttribute('data-ln-circular-progress')) || 0;
		const max = parseFloat(this.dom.getAttribute('data-ln-circular-progress-max')) || 100;
		let percentage = (max > 0) ? (value / max) * 100 : 0;

		if (percentage < 0) percentage = 0;
		if (percentage > 100) percentage = 100;

		const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
		this.progressCircle.setAttribute('stroke-dashoffset', offset);

		const label = this.dom.getAttribute('data-ln-circular-progress-label');
		this.labelEl.textContent = label !== null ? label : Math.round(percentage) + '%';

		dispatch(this.dom, 'ln-circular-progress:change', {
			target: this.dom,
			value: value,
			max: max,
			percentage: percentage
		});
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
