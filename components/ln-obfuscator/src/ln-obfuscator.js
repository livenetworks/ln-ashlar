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

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _syncAttribute(el) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst) return;
		inst.deobfuscate();
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-obfuscator':       { type: 'enum', values: ['rot13', 'base64', 'xor'], fallback: 'rot13', effect: _syncAttribute, description: 'Codec used to deobfuscate text or links' },
		'data-ln-obfuscator-codec': { type: 'enum', values: ['rot13', 'base64', 'xor'], fallback: 'rot13', effect: _syncAttribute, description: 'Explicit codec override attribute' },
		'data-ln-obfuscator-key':   { type: 'string', effect: _syncAttribute, description: 'Encryption or masking key for XOR codec' }
	};

	// ─── Component Constructor ───────────────────────────────
	function _component(dom) {
		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		dom[DOM_ATTRIBUTE] = this;
		this.dom = dom;
		this._originalTextNodes = null;
		this._originalHref = null;

		this.deobfuscate();
		return this;
	}

	// ─── Core Deobfuscation Logic ────────────────────────────
	_component.prototype.deobfuscate = function () {
		const isLink = Boolean(this.dom.matches && (this.dom.matches('a') || this.dom.matches('area')));

		// Capture initial raw href before first mutation
		if (this._originalHref === null && isLink && this.dom.hasAttribute('href')) {
			this._originalHref = this.dom.getAttribute('href');
		}

		// Capture initial raw text nodes (or re-capture if child nodes were replaced)
		const needsRescan = !this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some(item => !this.dom.contains(item.node));
		if (needsRescan) {
			this._originalTextNodes = [];
			if (typeof document !== 'undefined' && document.createTreeWalker) {
				const walker = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
					acceptNode: function (node) {
						if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains('sr-only')) {
							return NodeFilter.FILTER_REJECT;
						}
						return NodeFilter.FILTER_ACCEPT;
					}
				});
				while (walker.nextNode()) {
					this._originalTextNodes.push({
						node: walker.currentNode,
						raw: walker.currentNode.nodeValue
					});
				}
			}
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

		// Apply deobfuscation to text nodes using the stored original raw text
		if (this._originalTextNodes) {
			for (let i = 0; i < this._originalTextNodes.length; i++) {
				const item = this._originalTextNodes[i];
				if (item.node && item.raw && item.raw.length > 0) {
					item.node.nodeValue = deobfuscate(item.raw, options);
				}
			}
		}

		// Apply deobfuscation to href attribute using stored original raw href
		if (isLink && this._originalHref) {
			const deobfuscatedHref = deobfuscate(this._originalHref, options);
			this.dom.setAttribute('href', deobfuscatedHref);
		}

		dispatch(this.dom, 'ln-obfuscator:deobfuscated', {
			target: this.dom,
			codec: codec,
			shift: shift,
			key: codec === 'xor' ? key : null
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._originalTextNodes) {
			for (let i = 0; i < this._originalTextNodes.length; i++) {
				const item = this._originalTextNodes[i];
				if (item.node && item.raw) {
					item.node.nodeValue = item.raw;
				}
			}
		}
		if (this._originalHref !== null) {
			this.dom.setAttribute('href', this._originalHref);
		}
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
