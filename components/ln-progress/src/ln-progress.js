import { calculateProgress, dispatch, registerComponent } from '../../ln-core';
import { resolveProgressMax } from './progress-model.js';

(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _constructor(dom) {
		this.dom = dom;
		this._parentObserver = null;
		_render.call(this);
		_listenParent.call(this);
		return this;
	}

	_constructor.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._parentObserver) {
			this._parentObserver.disconnect();
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

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
		const rawVal = this.dom.getAttribute('data-ln-progress');
		const parent = this.dom.parentElement;
		const rawParentMax = parent ? parent.getAttribute('data-ln-progress-max') : null;
		const rawElemMax = this.dom.getAttribute('data-ln-progress-max');

		const max = resolveProgressMax(rawElemMax, rawParentMax, 100);
		const result = calculateProgress(rawVal, max);

		this.dom.style.width = result.percentage + '%';

		this.dom.setAttribute('role', 'progressbar');
		this.dom.setAttribute('aria-valuemin', String(result.min));
		this.dom.setAttribute('aria-valuemax', String(result.max));
		this.dom.setAttribute('aria-valuenow', String(result.clampedValue));

		dispatch(this.dom, 'ln-progress:change', {
			target: this.dom,
			value: result.value,
			max: result.max,
			percentage: result.percentage
		});
	}

	registerComponent(
		DOM_SELECTOR,
		DOM_ATTRIBUTE,
		_constructor,
		'ln-progress',
		{
			extraAttributes: ['data-ln-progress-max'],
			onAttributeChange: function (el) {
				const inst = el[DOM_ATTRIBUTE];
				if (inst) _render.call(inst);
			}
		}
	);
})();
