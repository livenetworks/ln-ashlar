/**
 * ln-select Component
 * Initializes Tom Select on select elements with data-ln-select attribute
 *
 * Usage:
 * <select data-ln-select>...</select>
 * <select data-ln-select='{"create": true, "maxItems": 3}'>...</select>
 */

import TomSelect from 'tom-select';

(function () {
	'use strict';

	const instances = new WeakMap();

	/**
	 * Initialize Tom Select on a select element
	 * @param {HTMLSelectElement} element - The select element to enhance
	 */
	function initializeSelect(element) {
		// Skip if already initialized
		if (instances.has(element)) {
			return;
		}

		// Get configuration from data attribute
		const configAttr = element.getAttribute('data-ln-select');
		let config = {};

		if (configAttr && configAttr.trim() !== '') {
			try {
				config = JSON.parse(configAttr);
			} catch (e) {
				console.warn('Invalid JSON in data-ln-select attribute:', e);
			}
		}

		// Default configuration
		const defaultConfig = {
			// Allow clearing selection
			allowEmptyOption: true,
			// Show dropdown arrow
			controlInput: null,
			// Disable creation by default
			create: false,
			// Highlight matching text
			highlight: true,
			// Close dropdown after selection (for single select)
			closeAfterSelect: true,
			// Placeholder handling
			placeholder: element.getAttribute('placeholder') || 'Select...',
			// Load throttle for search
			loadThrottle: 300,
		};

		// Merge configurations
		const finalConfig = { ...defaultConfig, ...config };

		// Initialize Tom Select
		try {
			const tomSelect = new TomSelect(element, finalConfig);
			instances.set(element, tomSelect);

			// Handle form reset
			const form = element.closest('form');
			if (form) {
				form.addEventListener('reset', () => {
					setTimeout(() => {
						tomSelect.clear();
						tomSelect.clearOptions();
						tomSelect.sync();
					}, 0);
				});
			}
		} catch (e) {
			console.error('Failed to initialize Tom Select:', e);
		}
	}

	/**
	 * Destroy Tom Select instance
	 * @param {HTMLSelectElement} element - The select element
	 */
	function destroySelect(element) {
		const instance = instances.get(element);
		if (instance) {
			instance.destroy();
			instances.delete(element);
		}
	}

	/**
	 * Initialize all select elements with data-ln-select
	 */
	function initializeAll() {
		const selects = document.querySelectorAll('select[data-ln-select]');
		selects.forEach(initializeSelect);
	}

	/**
	 * Observe DOM for dynamically added select elements
	 */
	function observeDOM() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Element node
						if (node.matches && node.matches('select[data-ln-select]')) {
							initializeSelect(node);
						}
						// Check children
						if (node.querySelectorAll) {
							const selects = node.querySelectorAll('select[data-ln-select]');
							selects.forEach(initializeSelect);
						}
					}
				});

				mutation.removedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						if (node.matches && node.matches('select[data-ln-select]')) {
							destroySelect(node);
						}
						if (node.querySelectorAll) {
							const selects = node.querySelectorAll('select[data-ln-select]');
							selects.forEach(destroySelect);
						}
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			initializeAll();
			observeDOM();
		});
	} else {
		initializeAll();
		observeDOM();
	}

	// Expose API for manual control if needed
	window.lnSelect = {
		initialize: initializeSelect,
		destroy: destroySelect,
		getInstance: (element) => instances.get(element),
	};
})();
