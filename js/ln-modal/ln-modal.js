(function() {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _dispatch(modal, eventName, detail) {
		modal.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: Object.assign({ modalId: modal.id, target: modal }, detail || {})
		}));
	}

	function _dispatchCancelable(modal, eventName) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: { modalId: modal.id, target: modal }
		});
		modal.dispatchEvent(event);
		return event;
	}

	function _openModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) {
			console.warn('[ln-modal] Modal with ID "' + modalId + '" not found');
			return;
		}

		const before = _dispatchCancelable(modal, 'ln-modal:before-open');
		if (before.defaultPrevented) return;

		modal.classList.add('ln-modal--open');
		document.body.classList.add('ln-modal-open');
		_dispatch(modal, 'ln-modal:open');
	}

	function _closeModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) return;

		const before = _dispatchCancelable(modal, 'ln-modal:before-close');
		if (before.defaultPrevented) return;

		modal.classList.remove('ln-modal--open');
		_dispatch(modal, 'ln-modal:close');

		if (!document.querySelector('.ln-modal.ln-modal--open')) {
			document.body.classList.remove('ln-modal-open');
		}
	}

	function _toggleModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) {
			console.warn('[ln-modal] Modal with ID "' + modalId + '" not found');
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

		for (const btn of closeButtons) {
			if (btn[DOM_ATTRIBUTE + 'Close']) continue;
			btn[DOM_ATTRIBUTE + 'Close'] = true;

			btn.addEventListener('click', function(e) {
				e.preventDefault();
				_closeModal(modal.id);
			});
		}
	}

	function _attachTriggerListeners(triggers) {
		for (const trigger of triggers) {
			if (trigger[DOM_ATTRIBUTE + 'Trigger']) continue;
			trigger[DOM_ATTRIBUTE + 'Trigger'] = true;

			trigger.addEventListener('click', function(e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;

				e.preventDefault();
				const modalId = trigger.getAttribute(DOM_SELECTOR);
				if (modalId) {
					_toggleModal(modalId);
				}
			});
		}
	}

	function _initializeAll() {
		const triggers = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		_attachTriggerListeners(triggers);

		const modals = document.querySelectorAll('.ln-modal');
		for (const modal of modals) {
			_attachCloseButtons(modal);
		}

		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				const openModals = document.querySelectorAll('.ln-modal.ln-modal--open');
				for (const modal of openModals) {
					_closeModal(modal.id);
				}
			}
		});
	}

	function _domObserver() {
		const observer = new MutationObserver(function(mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
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
							for (const modal of childModals) {
								_attachCloseButtons(modal);
							}
						}
					}
				} else if (mutation.type === 'attributes') {
					if (mutation.target.hasAttribute(DOM_SELECTOR)) {
						_attachTriggerListeners([mutation.target]);
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [DOM_SELECTOR]
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
