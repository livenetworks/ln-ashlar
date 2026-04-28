/**
 * ln-select Component
 * Initializes Tom Select on select elements with data-ln-select attribute
 *
 * Usage:
 * <select data-ln-select>...</select>
 * <select data-ln-select='{"create": true, "maxItems": 3}'>...</select>
 */

import { guardBody } from '../ln-core';

(function () {
	'use strict';

	const TomSelect = window.TomSelect;
	if (!TomSelect) {
		console.warn('[ln-select] TomSelect not found. Load TomSelect before ln-ashlar.');
		window.lnSelect = { initialize: function(){}, destroy: function(){}, getInstance: function(){ return null; } };
		return;
	}

	const instances = new WeakMap();

	function initializeSelect(element) {
		if (instances.has(element)) return;

		const configAttr = element.getAttribute('data-ln-select');
		let config = {};

		if (configAttr && configAttr.trim() !== '') {
			try {
				config = JSON.parse(configAttr);
			} catch (e) {
				console.warn('[ln-select] Invalid JSON in data-ln-select attribute:', e);
			}
		}

		const defaultConfig = {
			allowEmptyOption: true,
			controlInput: null,
			create: false,
			highlight: true,
			closeAfterSelect: true,
			placeholder: element.getAttribute('placeholder') || 'Select...',
			loadThrottle: 300,
		};

		const finalConfig = { ...defaultConfig, ...config };

		try {
			const tomSelect = new TomSelect(element, finalConfig);
			instances.set(element, tomSelect);

			const form = element.closest('form');
			if (form) {
				const resetHandler = () => {
					setTimeout(() => {
						tomSelect.clear();
						tomSelect.clearOptions();
						tomSelect.sync();
					}, 0);
				};
				form.addEventListener('reset', resetHandler);
				tomSelect._lnResetHandler = resetHandler;
				tomSelect._lnResetForm = form;
			}
		} catch (e) {
			console.warn('[ln-select] Failed to initialize Tom Select:', e);
		}
	}

	function destroySelect(element) {
		const instance = instances.get(element);
		if (instance) {
			if (instance._lnResetForm && instance._lnResetHandler) {
				instance._lnResetForm.removeEventListener('reset', instance._lnResetHandler);
			}
			instance.destroy();
			instances.delete(element);
		}
	}

	function initializeAll() {
		for (const el of document.querySelectorAll('select[data-ln-select]')) {
			initializeSelect(el);
		}
	}

	function observeDOM() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (const mutation of mutations) {
					if (mutation.type === 'attributes') {
						if (mutation.target.matches && mutation.target.matches('select[data-ln-select]')) {
							initializeSelect(mutation.target);
						}
						continue;
					}

					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							if (node.matches && node.matches('select[data-ln-select]')) {
								initializeSelect(node);
							}
							if (node.querySelectorAll) {
								for (const el of node.querySelectorAll('select[data-ln-select]')) {
									initializeSelect(el);
								}
							}
						}
					}

					for (const node of mutation.removedNodes) {
						if (node.nodeType === 1) {
							if (node.matches && node.matches('select[data-ln-select]')) {
								destroySelect(node);
							}
							if (node.querySelectorAll) {
								for (const el of node.querySelectorAll('select[data-ln-select]')) {
									destroySelect(el);
								}
							}
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['data-ln-select']
			});
		}, 'ln-select');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			initializeAll();
			observeDOM();
		});
	} else {
		initializeAll();
		observeDOM();
	}

	window.lnSelect = {
		initialize: initializeSelect,
		destroy: destroySelect,
		getInstance: function (element) { return instances.get(element); },
	};
})();
