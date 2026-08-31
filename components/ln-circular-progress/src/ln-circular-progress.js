import { calculateProgress, dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-circular-progress';
	const DOM_ATTRIBUTE = 'lnCircularProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const SVG_NS = 'http://www.w3.org/2000/svg';
	const VIEW_SIZE = 36;
	const RADIUS = 16;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	function _constructor(dom) {
		this.dom = dom;
		this.svg = null;
		this.trackCircle = null;
		this.progressCircle = null;
		this.labelEl = null;
		_buildSvg.call(this);
		_render.call(this);
		return this;
	}

	_constructor.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this.svg) {
			this.svg.remove();
		}
		if (this.labelEl) {
			this.labelEl.remove();
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _createSvgElement(tag, attrs) {
		const el = document.createElementNS(SVG_NS, tag);
		for (const [key, val] of Object.entries(attrs)) {
			el.setAttribute(key, val);
		}
		return el;
	}

	function _buildSvg() {
		this.svg = _createSvgElement('svg', {
			viewBox: '0 0 ' + VIEW_SIZE + ' ' + VIEW_SIZE,
			width: VIEW_SIZE,
			height: VIEW_SIZE
		});
		this.svg.classList.add('ln-circular-progress__svg');

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

	function _render() {
		const rawVal = this.dom.getAttribute('data-ln-circular-progress');
		const rawMax = this.dom.getAttribute('data-ln-circular-progress-max');
		const result = calculateProgress(rawVal, rawMax || 100);

		const offset = CIRCUMFERENCE - (result.percentage / 100) * CIRCUMFERENCE;
		this.progressCircle.setAttribute('stroke-dashoffset', offset);

		const label = this.dom.getAttribute('data-ln-circular-progress-label');
		const labelText = label !== null ? label : Math.round(result.percentage) + '%';
		this.labelEl.textContent = labelText;

		// Sync ARIA properties
		this.dom.setAttribute('role', 'progressbar');
		this.dom.setAttribute('aria-valuemin', String(result.min));
		this.dom.setAttribute('aria-valuemax', String(result.max));
		this.dom.setAttribute('aria-valuenow', String(result.clampedValue));
		this.dom.setAttribute('aria-valuetext', labelText);

		dispatch(this.dom, 'ln-circular-progress:change', {
			target: this.dom,
			value: result.value,
			max: result.max,
			percentage: result.percentage
		});
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _constructor, 'ln-circular-progress', {
		extraAttributes: ['data-ln-circular-progress-max', 'data-ln-circular-progress-label'],
		onAttributeChange: function (el) {
			const inst = el[DOM_ATTRIBUTE];
			if (inst) _render.call(inst);
		}
	});
})();
