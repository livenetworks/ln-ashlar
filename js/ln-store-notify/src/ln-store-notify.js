import { registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-store-notify';
	const DOM_ATTRIBUTE = 'lnStoreNotify';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Toast Dispatch ────────────────────────────────────────

	function _toast(type, title, message) {
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: { type: type, title: title, message: message }
		}));
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._savedTitle   = dom.getAttribute('data-ln-store-notify-saved')   || null;
		this._deletedTitle = dom.getAttribute('data-ln-store-notify-deleted')  || null;
		this._failedTitle  = dom.getAttribute('data-ln-store-notify-failed')   || null;

		const self = this;

		this._onConfirmed = function (e) {
			const detail = e.detail || {};
			const action = detail.action || 'confirmed';
			let title, message;

			if (action === 'create' || action === 'update') {
				title = self._savedTitle || action;
				message = detail.record && detail.record.name ? detail.record.name : undefined;
			} else if (action === 'delete') {
				title = self._deletedTitle || action;
				message = undefined;
			} else if (action === 'bulk-delete') {
				title = self._deletedTitle || action;
				const count = detail.ids ? detail.ids.length : 0;
				message = count ? String(count) : undefined;
			} else {
				title = self._savedTitle || action;
				message = undefined;
			}

			_toast('success', title, message);
		};

		this._onReverted = function (e) {
			const detail = e.detail || {};
			const action = detail.action || 'reverted';
			const title = self._failedTitle || action;
			const message = detail.error ? String(detail.error) : undefined;
			_toast('error', title, message);
		};

		dom.addEventListener('ln-store:confirmed', this._onConfirmed);
		dom.addEventListener('ln-store:reverted',  this._onReverted);

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-store:confirmed', this._onConfirmed);
		this.dom.removeEventListener('ln-store:reverted',  this._onReverted);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-store-notify');
})();
