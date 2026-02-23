(function() {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	// If component already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function _dispatch(modal, eventName) {
		modal.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: { modalId: modal.id }
		}));
	}

	function _openModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) {
			console.warn('Modal with ID "' + modalId + '" not found');
			return;
		}

		modal.classList.add('ln-modal--open');
		document.body.classList.add('ln-modal-open');
		_dispatch(modal, 'ln-modal:open');
	}

	function _closeModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) return;

		modal.classList.remove('ln-modal--open');
		_dispatch(modal, 'ln-modal:close');

		// Only remove body class when no modals remain open
		if (!document.querySelector('.ln-modal.ln-modal--open')) {
			document.body.classList.remove('ln-modal-open');
		}
	}

	function _toggleModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) {
			console.warn('Modal with ID "' + modalId + '" not found');
			return;
		}

		if (modal.classList.contains('ln-modal--open')) {
			_closeModal(modalId);
		} else {
			_openModal(modalId);
		}
	}

	function _attachCloseButtons(modal) {
		const closeButtons = modal.querySelectorAll('[data-ln-modal-close]');
		const modalId = modal.id;

		closeButtons.forEach(function(btn) {
			if (btn._lnModalCloseAttached) return;
			btn._lnModalCloseAttached = true;

			btn.addEventListener('click', function(e) {
				e.preventDefault();
				_closeModal(modalId);
			});
		});
	}

	function _attachTriggerListeners(triggers) {
		triggers.forEach(function(trigger) {
			if (trigger._lnModalAttached) return;
			trigger._lnModalAttached = true;

			trigger.addEventListener('click', function(e) {
				// Allow ctrl/cmd + click and middle-click (open in new tab)
				if (e.ctrlKey || e.metaKey || e.button === 1) {
					return;
				}

				e.preventDefault();
				const modalId = trigger.getAttribute(DOM_SELECTOR);
				if (modalId) {
					_toggleModal(modalId);
				}
			});
		});
	}

	function _initializeAll() {
		const triggers = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		_attachTriggerListeners(triggers);

		const modals = document.querySelectorAll('.ln-modal');
		modals.forEach(function(modal) {
			_attachCloseButtons(modal);
		});

		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				const openModals = document.querySelectorAll('.ln-modal.ln-modal--open');
				openModals.forEach(function(modal) {
					_closeModal(modal.id);
				});
			}
		});
	}

	function _domObserver() {
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function(node) {
						if (node.nodeType === 1) {
							if (node.hasAttribute(DOM_SELECTOR)) {
								_attachTriggerListeners([node]);
							}

							const childTriggers = node.querySelectorAll('[' + DOM_SELECTOR + ']');
							if (childTriggers.length > 0) {
								_attachTriggerListeners(childTriggers);
							}

							if (node.id && node.classList.contains('ln-modal')) {
								_attachCloseButtons(node);
							}

							const childModals = node.querySelectorAll('.ln-modal');
							if (childModals.length > 0) {
								childModals.forEach(function(modal) {
									_attachCloseButtons(modal);
								});
							}
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	window[DOM_ATTRIBUTE] = {
		open: _openModal,
		close: _closeModal,
		toggle: _toggleModal
	};

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
