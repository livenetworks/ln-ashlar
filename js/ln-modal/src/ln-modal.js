import { registerComponent, dispatch, dispatchCancelable, isVisible } from '../../ln-core';
import { hashGet, hashSet, hashParse, hashLinkClick } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;




	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		const self = this;

		this._hashNs = dom.id || null;

		this._onHashChange = function () {
			if (!self._hashNs) return;
			const present = hashGet(self._hashNs) !== null;
			if (present && !self.isOpen) self.dom.setAttribute(DOM_SELECTOR, 'open');
			else if (!present && self.isOpen) self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		this._onCancel = function (e) {
			// Native ESC on an open <dialog> fires cancelable 'cancel' then 'close'.
			// Prevent the browser's own auto-close and route through the attribute
			// instead, so before-close/hash-cleanup/native close() all run through
			// the single _syncAttribute path — never a parallel native-only close.
			e.preventDefault();
			self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		this._onAjaxSuccess = function () {
			if (self.isOpen) {
				self.dom.setAttribute(DOM_SELECTOR, 'close');
			}
		};

		this.dom.addEventListener('cancel', this._onCancel);

		// Apply initial state if open
		if (this.isOpen) {
			if (typeof this.dom.showModal === 'function') this.dom.showModal();
			document.body.classList.add('ln-modal-open');
		}

		if (this._hashNs) {
			window.addEventListener('hashchange', this._onHashChange);
			if (hashGet(this._hashNs) !== null && !this.isOpen) {
				this.dom.setAttribute(DOM_SELECTOR, 'open');
			}
		}

		this.dom.addEventListener('ln-ajax:success', this._onAjaxSuccess);

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this.dom.removeEventListener('ln-ajax:success', this._onAjaxSuccess);
		this.dom.removeEventListener('cancel', this._onCancel);

		if (this.isOpen) {
			// Self-excluding: a still-attached modal reads "open" during its own destroy.
			// No attribute write here — it would race the observer into re-creating an instance.
			const dom = this.dom;
			const otherOpen = Array.prototype.some.call(
				document.querySelectorAll('[' + DOM_SELECTOR + '="open"]'),
				function (el) { return el !== dom; }
			);
			if (!otherOpen) {
				document.body.classList.remove('ln-modal-open');
			}
		}

		if (this._hashNs) {
			window.removeEventListener('hashchange', this._onHashChange);
		}

		dispatch(this.dom, 'ln-modal:destroyed', { modalId: this.dom.id, target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		const value = el.getAttribute(DOM_SELECTOR);
		const shouldBeOpen = value === 'open';

		if (shouldBeOpen === instance.isOpen) return;

		if (shouldBeOpen) {
			const before = dispatchCancelable(el, 'ln-modal:before-open', { modalId: el.id, target: el });
			if (before.defaultPrevented) {
				// A prevented open must not leave a stale hash segment behind.
				// The 'close' reset below early-returns on its own sync
				// (shouldBeOpen === isOpen, both false), so the CLOSE-branch
				// hashSet(ns, null) never runs — clear the segment here.
				if (instance._hashNs) hashSet(instance._hashNs, null);
				el.setAttribute(DOM_SELECTOR, 'close');
				return;
			}
			instance.isOpen = true;
			document.body.classList.add('ln-modal-open');
			if (typeof el.showModal === 'function') el.showModal();

			const autoFocusEl = el.querySelector('[autofocus]');
			if (autoFocusEl && isVisible(autoFocusEl)) {
				autoFocusEl.focus();
			} else {
				const inputs = el.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
				const firstInput = Array.prototype.find.call(inputs, isVisible);
				if (firstInput) firstInput.focus();
				else {
					const buttons = el.querySelectorAll('a[href], button:not([disabled])');
					const firstFocusable = Array.prototype.find.call(buttons, isVisible);
					if (firstFocusable) firstFocusable.focus();
				}
			}

			if (instance._hashNs) {
				if (hashGet(instance._hashNs) === null) hashSet(instance._hashNs, '');
				const rawParam = hashGet(instance._hashNs);
				const param = rawParam ? rawParam : null; // '' (new) → null
				el.dataset.lnModalMode = param ? 'edit' : 'new';
				dispatch(el, 'ln-modal:open', { modalId: el.id, target: el, hashNs: instance._hashNs, param: param });
			} else {
				dispatch(el, 'ln-modal:open', { modalId: el.id, target: el });
			}
		} else {
			const before = dispatchCancelable(el, 'ln-modal:before-close', { modalId: el.id, target: el });
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance.isOpen = false;
			dispatch(el, 'ln-modal:close', { modalId: el.id, target: el });
			if (instance._hashNs) hashSet(instance._hashNs, null);

			if (typeof el.close === 'function') el.close();

			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}
		}
	}

	// ─── Event Delegation ──────────────────────────────────────

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		// Handle trigger click [data-ln-modal-for]
		const trigger = e.target.closest('[data-ln-modal-for]');
		if (trigger) {
			const modalId = trigger.getAttribute('data-ln-modal-for');
			const target = document.getElementById(modalId);
			if (target && target[DOM_ATTRIBUTE]) {
				e.preventDefault();

				// Build display record from data-ln-modal-* dataset keys (excluding reserved).
				const MODAL_RESERVED = { lnModalFor: true, lnModalClose: true, lnModalMode: true };
				const record = {};
				const ds = trigger.dataset;
				for (const key in ds) {
					if (!key.startsWith('lnModal')) continue;
					if (MODAL_RESERVED[key]) continue;
					const suffix = key.slice(7); // strip 'lnModal'
					if (!suffix) continue;
					record[suffix.charAt(0).toLowerCase() + suffix.slice(1)] = ds[key];
				}

				const hasRecord = Object.keys(record).length > 0;

				// Fill display fields or clear them.
				if (hasRecord) {
					window.lnCore.fill(target, record);
				} else {
					const fields = target.querySelectorAll('[data-ln-field]');
					for (let i = 0; i < fields.length; i++) {
						fields[i].textContent = '';
					}
				}

				// Set modal mode: explicit trigger attribute wins; else infer from record.
				// Composes with [data-ln-modal-when]/[data-ln-modal-mode] SCSS toggle.
				if (trigger.hasAttribute('data-ln-modal-mode')) {
					target.dataset.lnModalMode = trigger.getAttribute('data-ln-modal-mode');
				} else {
					target.dataset.lnModalMode = hasRecord ? 'edit' : 'new';
				}

				const current = target.getAttribute(DOM_SELECTOR);
				target.setAttribute(DOM_SELECTOR, current === 'open' ? 'close' : 'open');
			}
			return;
		}

		// Handle hash-anchor click <a href="#modalId"> / <a href="#modalId:param">
		// Per-component interception: modal anchors are NOT scoped to a wrapper
		// (they live in table rows, page headers, anywhere), so resolve them at
		// document level by checking whether the fragment namespace maps to a
		// live [data-ln-modal] element by id. Route the write through hashSet
		// (merge-preserving) instead of native fragment replacement, which would
		// wipe foreign segments (e.g. an ln-tabs segment). The guard +
		// preventDefault is shared with ln-tabs via the core hashLinkClick helper.
		const hashAnchor = e.target.closest('a[href^="#"]');
		if (hashAnchor) {
			const map = hashParse(hashAnchor.getAttribute('href'));
			for (const ns in map) {
				const el = document.getElementById(ns);
				if (el && el[DOM_ATTRIBUTE]) {
					// ns resolves to a live modal — own this click.
					// hashLinkClick: false → modifier/middle/shift → let native
					// open-in-new-tab/window happen; true → preventDefault done.
					if (!hashLinkClick(e)) return;
					// map[ns]: '' for bare #id (new) or the param (edit).
					hashSet(ns, map[ns]);
					return;
				}
			}
			// No segment maps to a modal — fall through. Plain #section scroll
			// anchors and ln-tabs anchors stay unaffected (ln-tabs handles its
			// own; the close branch below still gets a chance for the edge case
			// of data-ln-modal-close on an anchor).
		}

		// Handle close button click [data-ln-modal-close]
		const closeBtn = e.target.closest('[data-ln-modal-close]');
		if (closeBtn) {
			const modal = closeBtn.closest('[' + DOM_SELECTOR + ']');
			if (modal && modal[DOM_ATTRIBUTE]) {
				e.preventDefault();
				modal.setAttribute(DOM_SELECTOR, 'close');
			}
		}
	});

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-modal', {
		onAttributeChange: _syncAttribute
	});
})();
