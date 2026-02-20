(function () {
	const DOM_SELECTOR = 'data-ln-ajax';
	const DOM_ATTRIBUTE = 'lnAjax';

	// If component already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function constructor(domRoot) {
		console.log(domRoot);
		// Only process if domRoot has data-ln-ajax attribute
		if (!domRoot.hasAttribute(DOM_SELECTOR)) {
			return;
		}

		// Prevent double initialization
		if (domRoot[DOM_ATTRIBUTE]) {
			return;
		}

		// Mark as initialized IMMEDIATELY to prevent double-init
		domRoot[DOM_ATTRIBUTE] = true;

		console.log('constructor called with:', domRoot);
		let items = _findElements(domRoot);
		console.log('Items found:', items);

		// Attach AJAX to all links
		_attachLinksAjax(items.links);

		// Attach AJAX to all forms
		_attachFormsAjax(items.forms);
	}

	function _attachLinksAjax(links) {
		links.forEach(function (link) {
			// Skip if already has AJAX attached
			if (link._lnAjaxAttached) {
				return;
			}
			// Exclude if link has #anchor structure
			const href = link.getAttribute('href');
			if (href && href.includes('#')) {
				return;
			}

			link._lnAjaxAttached = true;

			link.addEventListener('click', function (e) {
				// Ignore ctrl/cmd + click and middle-click (open in new tab)
				if (e.ctrlKey || e.metaKey || e.button === 1) {
					return;
				}

				e.preventDefault();
				const url = link.getAttribute('href');
				if (url) {
					_makeAjaxRequest('GET', url, null, link);
				}
			});
		});
	}

	function _attachFormsAjax(forms) {
		forms.forEach(function (form) {
			// Skip if already has AJAX attached
			if (form._lnAjaxAttached) {
				return;
			}
			form._lnAjaxAttached = true;

			form.addEventListener('submit', function (e) {
				e.preventDefault();
				const method = form.method.toUpperCase();
				const action = form.action;
				const formData = new FormData(form);
				console.log('Form submitted:', method, action);

				// Disable all buttons in the form
				form.querySelectorAll('button, input[type="submit"]').forEach(function (btn) {
					btn.disabled = true;
				});

				_makeAjaxRequest(method, action, formData, form, function () {
					// Re-enable buttons after request completes
					form.querySelectorAll('button, input[type="submit"]').forEach(function (btn) {
						btn.disabled = false;
					});
				});
			});
		});
	}

	function _makeAjaxRequest(method, url, data, element, callback) {
		console.log('Making AJAX request:', method, url);

		element.classList.add('ln-ajax--loading');

		// Store final URL for history (will be modified for GET with data)
		let finalUrl = url;

		// Extract CSRF token from meta tag
		const csrfToken = document.querySelector('meta[name="csrf-token"]');
		const token = csrfToken ? csrfToken.getAttribute('content') : null;

		// For FormData objects (form submissions), add CSRF token
		if (data instanceof FormData && token) {
			data.append('_token', token);
		}

		// Prepare request options
		const options = {
			method: method,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		};

		// Add CSRF token to header if not using FormData
		if (token) {
			options.headers['X-CSRF-TOKEN'] = token;
		}

		// Handle request body/URL based on method
		if (method === 'GET' && data) {
			// For GET requests, append form data as query parameters
			const params = new URLSearchParams(data);
			finalUrl = url + (url.includes('?') ? '&' : '?') + params.toString();
		} else if (method !== 'GET' && data) {
			options.body = data;
		}

		// Make the fetch request and handle response
		fetch(finalUrl, options)
			.then(response => response.json())
			.then(data => {
				// Update document title if provided
				if (data.title) {
					document.title = data.title;
				}

				// Update DOM with response content
				// Each key in data.content maps to an element ID
				if (data.content) {
					for (let targetId in data.content) {
						const targetElement = document.getElementById(targetId);
						if (targetElement) {
							targetElement.innerHTML = data.content[targetId];
						}
					}
				}

				// Push to browser history for links and GET forms
				if (element.tagName === 'A') {
					let historyUrl = element.getAttribute('href');
					if (historyUrl) {
						window.history.pushState({ ajax: true }, '', historyUrl);
					}
				} else if (element.tagName === 'FORM' && element.method.toUpperCase() === 'GET') {
					// For GET forms, push the URL with query parameters
					window.history.pushState({ ajax: true }, '', finalUrl);
				}

				// Display message if present
				if (data.message && window.lnToast) {
					window.lnToast.enqueue({
						type: data.message.type,
						title: data.message.title,
						message: data.message.body,
						data: data.message.data
					});
				}

				// Remove loading state after response
				element.classList.remove('ln-ajax--loading');

				// Execute callback if provided
				if (callback) {
					callback();
				}
			})
			.catch(error => {
				console.error('AJAX error:', error);
				element.classList.remove('ln-ajax--loading');

				// Execute callback on error too
				if (callback) {
					callback();
				}
			});
	}

	function _findElements(domRoot) {
		let items = {
			links: [],
			forms: []
		};

		// If domRoot is <a> or <form>, add it (unless it has data-ln-ajax="false")
		if (domRoot.tagName === 'A' && domRoot.getAttribute(DOM_SELECTOR) !== 'false') {
			items.links.push(domRoot);
		} else if (domRoot.tagName === 'FORM' && domRoot.getAttribute(DOM_SELECTOR) !== 'false') {
			items.forms.push(domRoot);
		} else {
			// If domRoot is not <a> or <form>, find all child <a> and <form> elements
			let links = domRoot.querySelectorAll('a:not([data-ln-ajax="false"])') || [];
			let forms = domRoot.querySelectorAll('form:not([data-ln-ajax="false"])') || [];

			items.links = Array.from(links);
			items.forms = Array.from(forms);
		}

		return items;
	}

	function _domObserver() {
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type == 'childList') {
					mutation.addedNodes.forEach(function (item) {
						if (item.nodeType === 1) {
							// Check if the added node itself has data-ln-ajax
							constructor(item);

							// Also check for any data-ln-ajax elements within the added node
							if (item.hasAttribute && !item.hasAttribute(DOM_SELECTOR)) {
								let ajaxElements = item.querySelectorAll('[' + DOM_SELECTOR + ']');
								ajaxElements.forEach(function (element) {
									constructor(element);
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

	_domObserver();

	// Initialize component
	function _init() {
		// Initialization logic will go here
		console.log('ln-ajax initialized on:', this.dom);
		return this;
	}

	// Make lnAjax globally available
	window[DOM_ATTRIBUTE] = constructor;

	// Initialize on DOM ready
	function _initializeAll() {
		// Find all elements with data-ln-ajax attribute and initialize each one
		let elements = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		elements.forEach(function (element) {
			constructor(element);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
