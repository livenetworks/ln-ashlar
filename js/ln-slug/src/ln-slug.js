import { registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-slug-from';
	const DOM_ATTRIBUTE = 'lnSlug';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function slugify(s) {
		return String(s).toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function _component(dom) {
		if (dom.tagName !== 'INPUT') {
			console.warn('[ln-slug] Can only be applied to <input>, got:', dom.tagName);
			return this;
		}
		const form = dom.form;
		if (!form) {
			console.warn('[ln-slug] Slug input is not inside a <form>:', dom);
			return this;
		}
		const sourceName = dom.getAttribute(DOM_SELECTOR);
		const source = form.elements[sourceName];
		if (!source) {
			console.warn('[ln-slug] Source field "' + sourceName + '" not found in form:', dom);
			return this;
		}
		if (typeof source.addEventListener !== 'function') {
			console.warn('[ln-slug] Source field "' + sourceName + '" is a RadioNodeList (same-name group) — single source field required:', dom);
			return this;
		}

		this.dom = dom;
		this.source = source;
		this._pristine = dom.value === '';
		this._mirroring = false;

		const self = this;

		this._onSource = function () {
			if (!self._pristine) return;
			self._mirror();
		};
		this._onSlug = function () {
			if (self._mirroring) return;
			self._pristine = (self.dom.value === '');
		};

		source.addEventListener('input', this._onSource);
		dom.addEventListener('input', this._onSlug);

		return this;
	}

	_component.prototype._mirror = function () {
		this._mirroring = true;
		this.dom.value = slugify(this.source.value);
		this.dom.dispatchEvent(new Event('input', { bubbles: true }));
		this._mirroring = false;
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.source.removeEventListener('input', this._onSource);
		this.dom.removeEventListener('input', this._onSlug);
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-slug');
})();
