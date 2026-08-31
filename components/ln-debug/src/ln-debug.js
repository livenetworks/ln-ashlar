import { registerComponent } from '../../ln-core/index.js';
import { verifyDOM, scheduleVerification } from './debug-verifier.js';

(function () {
	const DOM_SELECTOR = 'data-ln-debug';
	const DOM_ATTRIBUTE = 'lnDebug';

	if (typeof window !== 'undefined' && window[DOM_ATTRIBUTE] !== undefined) return;

	function _component(dom) {
		this.dom = dom;
		scheduleVerification(dom.ownerDocument || document);
		return this;
	}

	_component.prototype.verify = function (rootDom, options) {
		return verifyDOM(rootDom || (this.dom ? this.dom.ownerDocument || this.dom : document), options);
	};

	_component.prototype.destroy = function () {
		delete this.dom[DOM_ATTRIBUTE];
	};

	if (typeof window !== 'undefined') {
		window.lnDebug = {
			verify: function (rootDom, options) {
				return verifyDOM(rootDom || document, options);
			},
			schedule: function (rootDom, delay, callback) {
				return scheduleVerification(rootDom || document, delay, callback);
			}
		};
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-debug', {
		onInit: function (node) {
			if (typeof document !== 'undefined') {
				scheduleVerification(node && node.ownerDocument ? node.ownerDocument : document);
			}
		},
		onSubtreeChange: function (host) {
			if (typeof document !== 'undefined') {
				scheduleVerification(host && host.ownerDocument ? host.ownerDocument : document);
			}
		}
	});
})();

export { verifyDOM, scheduleVerification };
