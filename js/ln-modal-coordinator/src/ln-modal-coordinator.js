import { dispatch, hashGet, hashSet, hashParse, hashLinkClick } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnModalCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
			const target = document.getElementById(modalId);
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

				if (hasRecord && window.lnCore && typeof window.lnCore.fill === 'function') {
					window.lnCore.fill(target, record);
				} else if (target.dataset.lnModalMode === 'new') {
					_resetModalForm(target);
				}

				const current = target.getAttribute('data-ln-modal');
				if (current === 'open') {
					dispatch(target, 'ln-modal:request-close', {});
				} else {
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
		if (!modal || !modal.lnModal) return;

		if (modal.id) {
			const param = hashGet(modal.id);
			if (param) {
				modal.dataset.lnModalMode = 'edit';
				modal.dispatchEvent(new CustomEvent('ln-fill:request', {
					bubbles: true,
					detail: { id: param }
				}));
			} else if (param === '') {
				modal.dataset.lnModalMode = 'new';
				_resetModalForm(modal);
			}
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

					const hasErrors = !!(
						document.querySelector('.has-error, [data-ln-validate-error], .form-error, .alert-danger') ||
						modal.querySelector('.has-error, [data-ln-validate-error], .form-error, .alert-danger')
					);

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

	window.addEventListener('hashchange', _syncHashModals);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			setTimeout(_syncHashModals, 0);
		});
	} else {
		setTimeout(_syncHashModals, 0);
	}

	// ─── Form Submission Auto-Close Mediation ────────────────

	function _handleFormSuccess(e) {
		const modal = e.target.closest('[data-ln-modal]');
		if (!modal || !modal.lnModal) return;

		if (modal.id) {
			try {
				sessionStorage.removeItem('ln-modal-pending:' + modal.id);
			} catch (err) {}
			hashSet(modal.id, null);
		}

		dispatch(modal, 'ln-modal:request-close', {});
		_resetModalForm(modal);
	}

	document.addEventListener('ln-form:success', _handleFormSuccess);
	document.addEventListener('ln-ajax:success', _handleFormSuccess);

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

	window[DOM_ATTRIBUTE] = true;
})();
