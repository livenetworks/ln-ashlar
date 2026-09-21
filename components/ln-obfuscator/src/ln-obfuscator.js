import { dispatch, registerComponent } from '../../ln-core';
import {
	obfuscate,
	deobfuscate,
	utf8ToBase64,
	base64ToUtf8,
	xorObfuscate,
	xorDeobfuscate
} from './obfuscator-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-obfuscator';
	const DOM_ATTRIBUTE = 'lnObfuscator';
	const _processed = new WeakSet();

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _syncAttribute(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst) return;
		inst.deobfuscate();
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-obfuscator': { effect: _syncAttribute },
		'data-ln-obfuscator-codec': { effect: _syncAttribute },
		'data-ln-obfuscator-key': { effect: _syncAttribute }
	};

	// ─── Component Constructor ───────────────────────────────
	function _component(dom) {
		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		dom[DOM_ATTRIBUTE] = this;
		this.dom = dom;
		this._processed = false;

		this.deobfuscate();
		return this;
	}

	// ─── Core Deobfuscation Logic ────────────────────────────
	_component.prototype.deobfuscate = function () {
		if (this._processed || _processed.has(this.dom)) {
			return;
		}

		const rawShift = this.dom.getAttribute(DOM_SELECTOR);
		const parsed = parseInt(rawShift, 10);
		const shift = isNaN(parsed) ? 13 : parsed;

		const rawCodec = (this.dom.getAttribute('data-ln-obfuscator-codec') || '').toLowerCase().trim();
		const rawKey = this.dom.getAttribute('data-ln-obfuscator-key');

		let codec = 'rot';
		if (rawCodec === 'xor' || rawCodec === 'base64') {
			codec = rawCodec;
		} else if (rawKey) {
			codec = 'xor';
		}

		const key = rawKey || 'ln-ashlar';
		const options = { codec, shift, key };

		const isLink = this.dom.matches && (this.dom.matches('a') || this.dom.matches('area'));

		// Reset premature ln-external-links decoration if present
		if (isLink && this.dom.getAttribute('data-ln-external-link') === 'processed') {
			const hints = this.dom.querySelectorAll('.sr-only');
			for (let i = 0; i < hints.length; i++) {
				hints[i].remove();
			}
			this.dom.removeAttribute('data-ln-external-link');
			this.dom.removeAttribute('target');
			const relParts = (this.dom.rel || '').split(/\s+/).filter(function (r) {
				return r && r !== 'noopener' && r !== 'noreferrer';
			});
			if (relParts.length > 0) {
				this.dom.rel = relParts.join(' ');
			} else {
				this.dom.removeAttribute('rel');
			}
		}

		// Walk text nodes, skipping any .sr-only nodes
		if (typeof document !== 'undefined' && document.createTreeWalker) {
			const walker = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
				acceptNode: function (node) {
					if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains('sr-only')) {
						return NodeFilter.FILTER_REJECT;
					}
					return NodeFilter.FILTER_ACCEPT;
				}
			});

			const textNodes = [];
			while (walker.nextNode()) {
				textNodes.push(walker.currentNode);
			}

			for (let i = 0; i < textNodes.length; i++) {
				const node = textNodes[i];
				if (node.nodeValue && node.nodeValue.length > 0) {
					node.nodeValue = deobfuscate(node.nodeValue, options);
				}
			}
		}

		// Deobfuscate href if present on link element
		if (isLink && this.dom.hasAttribute('href')) {
			const rawHref = this.dom.getAttribute('href');
			if (rawHref) {
				const deobfuscatedHref = deobfuscate(rawHref, options);
				this.dom.setAttribute('href', deobfuscatedHref);
			}
		}

		this._processed = true;
		_processed.add(this.dom);

		dispatch(this.dom, 'ln-obfuscator:deobfuscated', {
			target: this.dom,
			codec: codec,
			shift: shift,
			key: codec === 'xor' ? key : null
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		dispatch(this.dom, 'ln-obfuscator:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Registration & Global Helpers ──────────────────────
	const constructor = registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-obfuscator', {
		attributes: ATTRIBUTES
	});

	constructor.obfuscate = obfuscate;
	constructor.deobfuscate = deobfuscate;
	constructor.utf8ToBase64 = utf8ToBase64;
	constructor.base64ToUtf8 = base64ToUtf8;
	constructor.xorObfuscate = xorObfuscate;
	constructor.xorDeobfuscate = xorDeobfuscate;
})();
