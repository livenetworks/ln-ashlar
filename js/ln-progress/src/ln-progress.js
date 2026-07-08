import { dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
		if (!parent) return;

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

		const clampedValue = Math.max(0, Math.min(value, max));
		this.dom.setAttribute('role', 'progressbar');
		this.dom.setAttribute('aria-valuemin', '0');
		this.dom.setAttribute('aria-valuemax', String(max));
		this.dom.setAttribute('aria-valuenow', String(clampedValue));

		dispatch(this.dom, 'ln-progress:change', { target: this.dom, value: value, max: max, percentage: percentage });
	}

	registerComponent(
		DOM_SELECTOR,
		DOM_ATTRIBUTE,
		_constructor,
		'ln-progress'
	);
})();
