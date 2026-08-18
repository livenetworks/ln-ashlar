import { dispatch, registerComponent, holdInit, releaseInit } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'template[data-ln-include]';
	const DOM_ATTRIBUTE = 'lnInclude';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Module-level deduplication Map for shared fetch requests
	const _fetchCache = new Map();

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.url = dom.getAttribute('data-ln-include');
		this._held = false;
		this._destroyed = false;

		// 1. Bail if empty URL
		if (!this.url) {
			return this;
		}

		// 2. Take hold ONLY after validation checks pass
		holdInit();
		this._held = true;

		const self = this;

		// Deduplicate: check cache for existing promise
		const url = this.url;
		let promise = _fetchCache.get(url);
		if (!promise) {
			promise = fetch(url)
				.then(function (res) {
					if (!res.ok) {
						throw new Error('HTTP error! status: ' + res.status);
					}
					return res.text();
				})
				.catch(function (err) {
					_fetchCache.delete(url);   // allow a later host to retry
					throw err;
				});
			_fetchCache.set(url, promise);
		}

		promise.then(function (html) {
			if (self._destroyed) return;

			// Parse content using a throwaway <template> to retain table elements (tr/td/option)
			const parser = document.createElement('template');
			parser.innerHTML = html;

			// Append DocumentFragment directly to dom.content
			self.dom.content.appendChild(parser.content);

			// Dispatch success event
			dispatch(self.dom, 'ln-include:loaded', { target: self.dom, url: self.url });

			// Release gate
			if (self._held) {
				self._held = false;
				releaseInit();
			}
		}).catch(function (err) {
			if (self._destroyed) return;

			console.error('[ln-include] Failed to fetch template from ' + self.url + ':', err);

			// Dispatch error event
			dispatch(self.dom, 'ln-include:error', { target: self.dom, url: self.url, error: err });

			// Always release gate on error
			if (self._held) {
				self._held = false;
				releaseInit();
			}
		});

		return this;
	}

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this._destroyed = true;

		if (this._held) {
			this._held = false;
			releaseInit();
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-include');
})();
