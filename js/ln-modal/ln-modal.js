(function() {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	// If component already defined, return
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
		return;
	}

	/**
	 * Toggle modal visibility by ID
	 * @param {string} modalId - ID of the modal element
	 */
	function _toggleModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) {
			console.warn('Modal with ID "' + modalId + '" not found');
			return;
		}

		const isOpen = modal.classList.contains('ln-modal--open');

		if (isOpen) {
			modal.classList.remove('ln-modal--open');
			document.body.classList.remove('ln-modal-open');
		} else {
			modal.classList.add('ln-modal--open');
			document.body.classList.add('ln-modal-open');
		}
	}

	/**
	 * Close modal by ID
	 * @param {string} modalId - ID of the modal element
	 */
	function _closeModal(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) return;

		modal.classList.remove('ln-modal--open');
		document.body.classList.remove('ln-modal-open');
	}

	/**
	 * Attach listeners to close buttons within a modal
	 * @param {HTMLElement} modal - The modal element
	 */
	function _attachCloseButtons(modal) {
		const closeButtons = modal.querySelectorAll('[data-ln-modal-close]');
		const modalId = modal.id;

		closeButtons.forEach(function(btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				_closeModal(modalId);
			});
		});
	}

	/**
	 * Attach click listeners to trigger buttons/links with data-ln-modal
	 * @param {NodeList} triggers - Trigger elements with data-ln-modal attribute
	 */
	function _attachTriggerListeners(triggers) {
		triggers.forEach(function(trigger) {
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

	/**
	 * Initialize all modals and trigger buttons
	 */
	function _initializeAll() {
		// Find all trigger buttons/links with data-ln-modal
		const triggers = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		_attachTriggerListeners(triggers);

		// Find all modals and attach their close buttons
		const modals = document.querySelectorAll('[id]');
		modals.forEach(function(modal) {
			if (modal.classList.contains('ln-modal')) {
				_attachCloseButtons(modal);
			}
		});

		// Attach ESC key listener to close modals
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' || e.keyCode === 27) {
				// Close all open modals
				const openModals = document.querySelectorAll('.ln-modal.ln-modal--open');
				openModals.forEach(function(modal) {
					_closeModal(modal.id);
				});
			}
		});
	}

	/**
	 * Watch for dynamically added modals and trigger buttons
	 */
	function _domObserver() {
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function(node) {
						if (node.nodeType === 1) {
							// Check if node is a trigger button
							if (node.hasAttribute(DOM_SELECTOR)) {
								_attachTriggerListeners([node]);
							}

							// Check if node contains trigger buttons
							const childTriggers = node.querySelectorAll('[' + DOM_SELECTOR + ']');
							if (childTriggers.length > 0) {
								_attachTriggerListeners(childTriggers);
							}

							// Check if node is a modal
							if (node.id && node.classList.contains('ln-modal')) {
								_attachCloseButtons(node);
							}

							// Check if node contains modals
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

	// Expose global API
	window[DOM_ATTRIBUTE] = {
		toggle: _toggleModal,
		close: _closeModal,
		open: function(modalId) {
			const modal = document.getElementById(modalId);
			if (modal) {
				modal.classList.add('modal--open');
				document.body.classList.add('modal-open');
			}
		}
	};

	// Start watching for dynamic elements
	_domObserver();

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
