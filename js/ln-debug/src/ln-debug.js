import { registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-debug';
	const DOM_ATTRIBUTE = 'lnDebug';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _component(dom) {
		this.dom = dom;
		window.lnDebug = true;
		return this;
	}

	_component.prototype.destroy = function () {
		window.lnDebug = false;
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-debug');
})();
