import { registerComponent } from '../../ln-core/index.js';
import { verifyDOM, scheduleVerification } from './debug-verifier.js';
import { ensureDebugGate, refreshDebugHosts } from './gate.js';

(function () {
	const DOM_SELECTOR = 'data-ln-debug';
	const DOM_ATTRIBUTE = 'lnDebug';

	if (typeof window !== 'undefined' && window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-debug': { type: 'marker', description: 'Enables developer diagnostics overlay, live validation badges, and inspection logging' }
	};

	ensureDebugGate();

	function _component(dom) {
		this.dom = dom;
		scheduleVerification(dom);
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
		attributes: ATTRIBUTES,
		onInit: (node) => scheduleVerification(node),
		onSubtreeChange: (host) => scheduleVerification(host)
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
