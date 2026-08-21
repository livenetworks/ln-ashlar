import { registerComponent, dispatch, hashGet, hashSet, hashParse, hashLinkClick, queueBoot, buildDict } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-ui-coordinator';
	const DOM_ATTRIBUTE = 'lnUiCoordinator';
	const DICT_SELECTOR = 'data-ln-ui-coordinator-dict';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Resolve the active coordinator dictionary for a given event target.
	// Climbs the DOM hierarchy of UI coordinators and merges dictionary keys from
	// root to leaf so nested coordinators inherit and selectively override outer translations.
	function _getCoordinatorDict(target) {
		const dict = {};
		let current = target;
		const hosts = [];

		while (current) {
			const host = current.closest('[' + DOM_SELECTOR + ']');
			if (!host) break;
			if (host[DOM_ATTRIBUTE] && host[DOM_ATTRIBUTE].dict) {
				hosts.unshift(host[DOM_ATTRIBUTE].dict);
			}
			current = host.parentElement;
		}

		for (const hDict of hosts) {
			Object.assign(dict, hDict);
		}

		return dict;
	}

	// Helper to resolve target modal from trigger element / wrapper / ID
	function _findTargetModal(triggerEl, modalId) {
		if (modalId) {
			if (triggerEl) {
				const wrapper = triggerEl.closest('[' + DOM_SELECTOR + ']');
				if (wrapper) {
					if (wrapper.id === modalId && wrapper.hasAttribute('data-ln-modal')) return wrapper;
					const scoped = wrapper.querySelector('#' + CSS.escape(modalId) + '[data-ln-modal], [data-ln-modal="' + modalId + '"]');
					if (scoped) return scoped;
				}
			}
			const el = document.getElementById(modalId) || document.querySelector('[data-ln-modal="' + modalId + '"]');
			if (el) return el;
		}

		if (triggerEl) {
			const wrapper = triggerEl.closest('[' + DOM_SELECTOR + ']');
			if (wrapper) {
				if (wrapper.hasAttribute('data-ln-modal')) return wrapper;
				const scoped = wrapper.querySelector('[data-ln-modal]');
				if (scoped) return scoped;
			}
			const closest = triggerEl.closest('[data-ln-modal]');
			if (closest) return closest;
		}

		return document.querySelector('[data-ln-modal]');
	}

	// Hash param for a modal open. Edit opens must carry a TRUTHY segment so
	// foreign hashchanges never route them through the empty-param reset branch
	// (which would wipe the edit fill). Prefer the real entity id
	// (data-ln-fill-id) for a bookmarkable URL; fall back to the non-addressable
	// marker 'edit' when the trigger fills inline with no id. New opens carry ''.
	function _hashParamForOpen(mode, triggerEl) {
		if (mode !== 'edit') return '';
		if (triggerEl) {
			const fillId = triggerEl.getAttribute('data-ln-fill-id');
			if (fillId) return fillId;
		}
		return 'edit';
	}

	// Helper to reset all forms and display fields inside a modal panel
	function _resetModalForm(modal) {
		if (!modal) return;
		const fields = modal.querySelectorAll('[data-ln-field]');
		for (let i = 0; i < fields.length; i++) {
			fields[i].textContent = '';
		}
		const forms = modal.querySelectorAll('form');
		for (let i = 0; i < forms.length; i++) {
			if (window.lnCore && typeof window.lnCore.lnFill === 'function') {
				window.lnCore.lnFill(forms[i], null);
			} else {
				forms[i].reset();
			}
		}
	}

	// ─── Native Submit Pending Intake & Hash Clear ───────────

	document.addEventListener('submit', function (e) {
		if (e.defaultPrevented) return;
		const form = e.target;
		const modal = form.closest('[data-ln-modal]');
		if (modal && modal.id) {
			try {
				sessionStorage.setItem('ln-modal-pending:' + modal.id, 'true');
			} catch (err) {}
			// Clear hash before native submit/reload so browser reloads clean
			hashSet(modal.id, null);
		}
	});

	// ─── Trigger & Hash Navigation Delegation ──────────────

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		// 1. Handle trigger click [data-ln-modal-for="modalId"]
		const trigger = e.target.closest('[data-ln-modal-for]');
		if (trigger) {
			const modalId = trigger.getAttribute('data-ln-modal-for');
			const target = _findTargetModal(trigger, modalId);
			if (target && target.lnModal) {
				e.preventDefault();

				const MODAL_RESERVED = { lnModalFor: true, lnModalClose: true, lnModalMode: true };
				const record = {};
				const ds = trigger.dataset;
				for (const key in ds) {
					if (!key.startsWith('lnModal')) continue;
					if (MODAL_RESERVED[key]) continue;
					const suffix = key.slice(7);
					if (!suffix) continue;
					record[suffix.charAt(0).toLowerCase() + suffix.slice(1)] = ds[key];
				}

				const hasRecord = Object.keys(record).length > 0;

				if (trigger.hasAttribute('data-ln-modal-mode')) {
					target.dataset.lnModalMode = trigger.getAttribute('data-ln-modal-mode');
				} else {
					target.dataset.lnModalMode = hasRecord ? 'edit' : 'new';
				}

				if (hasRecord && window.lnCore && typeof window.lnCore.lnFill === 'function') {
					window.lnCore.lnFill(target, record);
				} else if (target.dataset.lnModalMode === 'new') {
					_resetModalForm(target);
				}

				const current = target.getAttribute('data-ln-modal');
				if (current === 'open') {
					dispatch(target, 'ln-modal:request-close', {});
				} else {
					// Restore per-open hash-write (pre-extraction invariant): every
					// open leaves a URL segment so _syncHashModals never closes it.
					if (target.id) {
						hashSet(target.id, _hashParamForOpen(target.dataset.lnModalMode, trigger));
					}
					dispatch(target, 'ln-modal:request-open', {});
				}
			}
			return;
		}

		// 2. Handle hash anchor click <a href="#modalId"> / <a href="#modalId:param">
		const hashAnchor = e.target.closest('a[href^="#"]');
		if (hashAnchor) {
			const map = hashParse(hashAnchor.getAttribute('href'));
			for (const ns in map) {
				const el = document.getElementById(ns);
				if (el && el.lnModal) {
					if (!hashLinkClick(e)) return;
					hashSet(ns, map[ns]);
					return;
				}
			}
		}
	});

	// ─── Before Open Reset Gate ────────────────────────────

	document.addEventListener('ln-modal:before-open', function (e) {
		const modal = e.target;
		if (!modal || !modal.lnModal) return;

		const mode = modal.dataset.lnModalMode || 'new';
		if (mode === 'new') {
			_resetModalForm(modal);
		}
	});

	// ─── Open Event Fill Dispatcher ───────────────────────

	document.addEventListener('ln-modal:open', function (e) {
		const modal = e.target;
		if (!modal || !modal.lnModal || !modal.id) return;

		let param = hashGet(modal.id);

		// Non-trigger opens (programmatic / SSR-via-mutation) reach here with no
		// segment — adopt one so foreign hashchanges never close the modal.
		// Trigger opens already wrote their segment, so this is skipped for them.
		if (param === null) {
			param = _hashParamForOpen(modal.dataset.lnModalMode, null);
			hashSet(modal.id, param);
		}

		if (param) {
			modal.dataset.lnModalMode = 'edit';
			modal.dispatchEvent(new CustomEvent('ln-fill:request', {
				bubbles: true,
				detail: { id: param }
			}));
		} else {
			modal.dataset.lnModalMode = 'new';
			_resetModalForm(modal);
		}
	});

	// ─── Hash Sync Listener & Pending Submit Resolution ────

	let _inSync = false;
	function _syncHashModals() {
		if (_inSync) return;
		_inSync = true;
		try {
			const modals = document.querySelectorAll('[data-ln-modal][id]');
			for (let i = 0; i < modals.length; i++) {
				const modal = modals[i];
				if (!modal.lnModal) continue;
				const hashNs = modal.id;

				const pendingKey = 'ln-modal-pending:' + hashNs;
				let isPending = false;
				try {
					isPending = sessionStorage.getItem(pendingKey) === 'true';
				} catch (err) {}

				if (isPending) {
					try {
						sessionStorage.removeItem(pendingKey);
					} catch (err) {}

					const hasErrors = !!modal.querySelector('[data-ln-validate-error], [aria-invalid="true"]');

					if (!hasErrors) {
						hashSet(hashNs, null);
						dispatch(modal, 'ln-modal:request-close', {});
						_resetModalForm(modal);
						continue;
					} else {
						modal.dataset.lnModalMode = 'edit';
						dispatch(modal, 'ln-modal:request-open', {});
						continue;
					}
				}

				const param = hashGet(hashNs);
				const present = param !== null;
				const isOpen = modal.lnModal.isOpen;

				if (present) {
					const mode = param ? 'edit' : 'new';
					modal.dataset.lnModalMode = mode;
					if (!isOpen) {
						dispatch(modal, 'ln-modal:request-open', {});
					} else {
						// Modal is already open, but hash param changed dynamically (e.g. #modal:42 -> #modal:5)
						if (param) {
							modal.dispatchEvent(new CustomEvent('ln-fill:request', {
								bubbles: true,
								detail: { id: param }
							}));
						} else {
							_resetModalForm(modal);
						}
					}
				} else if (isOpen) {
					dispatch(modal, 'ln-modal:request-close', {});
				}
			}
		} finally {
			_inSync = false;
		}
	}

	// SSR modals authored data-ln-modal="open" never pass through a trigger or
	// hash anchor, so they carry no URL segment. Adopt them into the hash BEFORE
	// the first sync, so _syncHashModals sees them present and keeps them open
	// instead of closing them as a phantom back-navigation. Skips modals that
	// already have a segment (e.g. an SSR deep-link URL).
	function _adoptOpenModals() {
		const openModals = document.querySelectorAll('[data-ln-modal="open"][id]');
		for (let i = 0; i < openModals.length; i++) {
			const modal = openModals[i];
			if (!modal.lnModal) continue;
			if (hashGet(modal.id) !== null) continue;
			hashSet(modal.id, _hashParamForOpen(modal.dataset.lnModalMode, null));
		}
	}

	window.addEventListener('hashchange', _syncHashModals);

	function _bootSync() {
		_adoptOpenModals();
		_syncHashModals();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			queueBoot(_bootSync);
		});
	} else {
		queueBoot(_bootSync);
	}

	// ─── AJAX Submission Mediation & Toast Routing ──────────

	function _handleAjaxSuccess(e) {
		const detail = e.detail || {};
		const data = detail.data;

		// 1. Dispatch UI toast notification if response envelope contains a message
		if (data && data.message) {
			const msg = data.message;
			window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
				detail: {
					type: msg.type || 'success',
					title: msg.title || '',
					message: msg.body || ''
				}
			}));
		}

		// 2. Auto-close modal and clean up if the submitting element was inside a modal
		const modal = e.target.closest('[data-ln-modal]');
		if (modal && modal.lnModal) {
			if (modal.id) {
				try {
					sessionStorage.removeItem('ln-modal-pending:' + modal.id);
				} catch (err) {}
				hashSet(modal.id, null);
			}

			dispatch(modal, 'ln-modal:request-close', {});
			_resetModalForm(modal);
		}
	}

	function _handleAjaxError(e) {
		const detail = e.detail || {};
		const data = detail.data;
		const status = detail.status || 0;
		const dict = _getCoordinatorDict(e.target);

		// 1. If server returned structured error message, toast it
		if (data && data.message) {
			const msg = data.message;
			window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
				detail: {
					type: msg.type || 'error',
					title: msg.title || '',
					message: msg.body || ''
				}
			}));
		} else if (status === 0) {
			// 2. Genuine network failure (DNS / offline / abort / connection dropped)
			window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
				detail: {
					type: 'error',
					title: dict['network-error-title'] || '',
					message: dict['network-error'] || 'Network error'
				}
			}));
		} else {
			// 3. Server HTTP error (status >= 400 or HTML error page) without structured JSON message
			window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
				detail: {
					type: 'error',
					title: dict['server-error-title'] || '',
					message: dict['server-error'] || 'Server error'
				}
			}));
		}

		// Note: We deliberately do NOT close the modal on error so form validation feedback remains visible
	}

	document.addEventListener('ln-ajax:success', _handleAjaxSuccess);
	document.addEventListener('ln-ajax:error', _handleAjaxError);

	// ─── Upload Feedback Mediation ──────────────────────────

	function _handleUploadInvalid(e) {
		const detail = e.detail || {};
		const dict = _getCoordinatorDict(e.target);
		const message = detail.message || (detail.reason === 'max-size' ? dict['upload-max-size'] || 'File is too large' : (detail.reason === 'max-files' ? dict['upload-max-files'] || 'Maximum file count exceeded' : dict['upload-invalid-type'] || 'This file type is not allowed'));
		const title = dict['upload-invalid-title'] || 'Invalid File';

		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: {
				type: 'error',
				title: title,
				message: message
			}
		}));
	}

	function _handleUploadError(e) {
		const detail = e.detail || {};
		const dict = _getCoordinatorDict(e.target);
		const message = detail.message || dict['upload-failed'] || 'Failed to upload file';
		const title = dict['upload-error-title'] || 'Upload Error';

		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: {
				type: 'error',
				title: title,
				message: message
			}
		}));
	}

	document.addEventListener('ln-upload:invalid', _handleUploadInvalid);
	document.addEventListener('ln-upload:error', _handleUploadError);

	// ─── Hash Cleanup & Reset on Modal Close ───────────────

	document.addEventListener('ln-modal:close', function (e) {
		const modal = e.target;
		if (!modal || !modal.lnModal) return;

		if (modal.id) {
			try {
				sessionStorage.removeItem('ln-modal-pending:' + modal.id);
			} catch (err) {}
			if (hashGet(modal.id) !== null) {
				hashSet(modal.id, null);
			}
		}

		if (modal.dataset.lnModalMode === 'new') {
			_resetModalForm(modal);
		}
	});

	// ─── Component Constructor & Registration ────────────

	function _component(dom) {
		this.dom = dom;
		this.dict = buildDict(dom, DICT_SELECTOR);
		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dict = {};
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-ui-coordinator');
})();
