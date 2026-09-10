import { registerComponent } from '../../ln-core/index.js';
import { verifyDOM, scheduleVerification } from './debug-verifier.js';
import { ensureDebugGate, refreshDebugHosts } from './gate.js';

(function () {
	const DOM_SELECTOR = 'data-ln-debug';
	const DOM_ATTRIBUTE = 'lnDebug';

	if (typeof window !== 'undefined' && window[DOM_ATTRIBUTE] !== undefined) return;

	ensureDebugGate();

	function _component(dom) {
		this.dom = dom;
		scheduleVerification(dom.ownerDocument || document);
		refreshDebugHosts();
		return this;
	}

	_component.prototype.verify = function (rootDom, options) {
		return verifyDOM(rootDom || (this.dom ? this.dom.ownerDocument || this.dom : document), options);
	};

	_component.prototype.destroy = function () {
		delete this.dom[DOM_ATTRIBUTE];
		refreshDebugHosts();
	};

	const _ctor = registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-debug', {
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

	// registerComponent assigns window[DOM_ATTRIBUTE] = constructor, so the
	// static API has to hang off that constructor. Assigning a separate
	// object to window.lnDebug beforehand is silently overwritten.
	_ctor.verify = function (rootDom, options) {
		return verifyDOM(rootDom || document, options);
	};

	_ctor.schedule = function (rootDom, delay, callback) {
		return scheduleVerification(rootDom || document, delay, callback);
	};
})();

export { verifyDOM, scheduleVerification };
