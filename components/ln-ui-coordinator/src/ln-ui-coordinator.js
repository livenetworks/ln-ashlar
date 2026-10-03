import { registerComponent, dispatch, hashGet, hashSet, hashParse, hashLinkClick } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-ui-coordinator';
	const DOM_ATTRIBUTE = 'lnUiCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-ui-coordinator': {
			type: 'marker',
			description: 'Mounts UI coordinator mediating global hash-routing, modals, and toasts'
		}
	};

	// ─── Hash Navigation (Anchors & hashchange) ─────────────

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		const hashAnchor = e.target.closest('a[href^="#"]');
		if (!hashAnchor) return;

		const rawHref = hashAnchor.getAttribute('href');
		const map = hashParse(rawHref);

		for (const ns in map) {
			const modal = document.getElementById(ns);
			if (modal && modal.lnModal) {
				if (!hashLinkClick(e)) return;
				hashSet(ns, map[ns]);
				if (!modal.lnModal.isOpen) {
					dispatch(modal, 'ln-modal:request-open', {});
				}
				return;
			}
		}
	});

	function _syncHashModals() {
		const hash = location.hash;
		if (!hash) return;

		const map = hashParse(hash);
		for (const ns in map) {
			const modal = document.getElementById(ns);
			if (modal && modal.lnModal && !modal.lnModal.isOpen) {
				dispatch(modal, 'ln-modal:request-open', {});
			}
		}
	}

	window.addEventListener('hashchange', _syncHashModals);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _syncHashModals);
	} else {
		_syncHashModals();
	}

	// ─── Modal Close Hash Cleanup ───────────────────────────

	document.addEventListener('ln-modal:close', function (e) {
		const modal = e.target;
		if (modal && modal.id && hashGet(modal.id) !== null) {
			hashSet(modal.id, null);
		}
	});

	// ─── AJAX Toast & Modal Auto-Close Mediation ───────────

	document.addEventListener('ln-ajax:success', function (e) {
		const detail = e.detail || {};
		const data = detail.data;

		// 1. Dispatch toast if server returned a message
		if (data && data.message) {
			const msg = data.message;
			dispatch(window, 'ln-toast:enqueue', {
				type: msg.type || 'success',
				title: msg.title || '',
				message: typeof msg === 'string' ? msg : (msg.body || '')
			});
		}

		// 2. If submitted inside a modal, close modal and clear URL hash
		const modal = e.target.closest('[data-ln-modal]');
		if (modal && modal.lnModal) {
			if (modal.id && hashGet(modal.id) !== null) {
				hashSet(modal.id, null);
			}
			dispatch(modal, 'ln-modal:request-close', {});
		}
	});

	document.addEventListener('ln-ajax:error', function (e) {
		const detail = e.detail || {};
		const data = detail.data;

		// Dispatch toast if server returned an error message
		if (data && data.message) {
			const msg = data.message;
			dispatch(window, 'ln-toast:enqueue', {
				type: msg.type || 'error',
				title: msg.title || '',
				message: typeof msg === 'string' ? msg : (msg.body || '')
			});
		}
	});

	// ─── Upload Toast Mediation ─────────────────────────────

	document.addEventListener('ln-upload:error', function (e) {
		const detail = e.detail || {};
		if (detail.message) {
			dispatch(window, 'ln-toast:enqueue', {
				type: 'error',
				title: '',
				message: detail.message
			});
		}
	});


	// ─── Component Constructor & Registration ──────────────

	function _component(dom) {
		this.dom = dom;
		return this;
	}

	_component.prototype.destroy = function () {
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-ui-coordinator', {
		attributes: ATTRIBUTES
	});
})();
