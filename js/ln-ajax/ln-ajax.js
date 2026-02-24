(function () {
	const DOM_SELECTOR = 'data-ln-ajax';
	const DOM_ATTRIBUTE = 'lnAjax';

	// If component already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	function _constructor(domRoot) {
		if (!domRoot.hasAttribute(DOM_SELECTOR)) {
			return;
		}

		// Prevent double initialization
		if (domRoot[DOM_ATTRIBUTE]) {
			return;
		}
		domRoot[DOM_ATTRIBUTE] = true;

		const items = _findElements(domRoot);
		_attachLinksAjax(items.links);
		_attachFormsAjax(items.forms);
	}

	function _attachLinksAjax(links) {
		links.forEach(function (link) {
			if (link._lnAjaxAttached) return;

			// Exclude links with #anchor structure
			const href = link.getAttribute('href');
			if (href && href.includes('#')) return;

			link._lnAjaxAttached = true;

			link.addEventListener('click', function (e) {
				// Allow ctrl/cmd + click and middle-click (open in new tab)
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
			if (form._lnAjaxAttached) return;
			form._lnAjaxAttached = true;

			form.addEventListener('submit', function (e) {
				e.preventDefault();
				const method = form.method.toUpperCase();
				const action = form.action;
				const formData = new FormData(form);

				form.querySelectorAll('button, input[type="submit"]').forEach(function (btn) {
					btn.disabled = true;
				});

				_makeAjaxRequest(method, action, formData, form, function () {
					form.querySelectorAll('button, input[type="submit"]').forEach(function (btn) {
						btn.disabled = false;
					});
				});
			});
		});
	}

	function _makeAjaxRequest(method, url, data, element, callback) {
		var before = _dispatchCancelable(element, 'ln-ajax:before-start', { method: method, url: url });
		if (before.defaultPrevented) return;

		_dispatch(element, 'ln-ajax:start', { method, url });

		element.classList.add('ln-ajax--loading');
		const spinner = document.createElement('span');
		spinner.className = 'ln-ajax-spinner';
		element.appendChild(spinner);

		function _cleanup() {
			element.classList.remove('ln-ajax--loading');
			const s = element.querySelector('.ln-ajax-spinner');
			if (s) s.remove();
			if (callback) callback();
		}

		let finalUrl = url;

		const csrfToken = document.querySelector('meta[name="csrf-token"]');
		const token = csrfToken ? csrfToken.getAttribute('content') : null;

		if (data instanceof FormData && token) {
			data.append('_token', token);
		}

		const options = {
			method: method,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		};

		if (token) {
			options.headers['X-CSRF-TOKEN'] = token;
		}

		if (method === 'GET' && data) {
			const params = new URLSearchParams(data);
			finalUrl = url + (url.includes('?') ? '&' : '?') + params.toString();
		} else if (method !== 'GET' && data) {
			options.body = data;
		}

		fetch(finalUrl, options)
			.then(response => response.json())
			.then(data => {
				if (data.title) {
					document.title = data.title;
				}

				if (data.content) {
					for (let targetId in data.content) {
						const targetElement = document.getElementById(targetId);
						if (targetElement) {
							targetElement.innerHTML = data.content[targetId];
						}
					}
				}

				if (element.tagName === 'A') {
					const historyUrl = element.getAttribute('href');
					if (historyUrl) {
						window.history.pushState({ ajax: true }, '', historyUrl);
					}
				} else if (element.tagName === 'FORM' && element.method.toUpperCase() === 'GET') {
					window.history.pushState({ ajax: true }, '', finalUrl);
				}

				_dispatch(element, 'ln-ajax:success', { method, url: finalUrl, data });
				_dispatch(element, 'ln-ajax:complete', { method, url: finalUrl });
				_cleanup();
			})
			.catch(error => {
				_dispatch(element, 'ln-ajax:error', { method, url: finalUrl, error });
				_dispatch(element, 'ln-ajax:complete', { method, url: finalUrl });
				_cleanup();
			});
	}

	function _findElements(domRoot) {
		const items = { links: [], forms: [] };

		if (domRoot.tagName === 'A' && domRoot.getAttribute(DOM_SELECTOR) !== 'false') {
			items.links.push(domRoot);
		} else if (domRoot.tagName === 'FORM' && domRoot.getAttribute(DOM_SELECTOR) !== 'false') {
			items.forms.push(domRoot);
		} else {
			items.links = Array.from(domRoot.querySelectorAll('a:not([data-ln-ajax="false"])'));
			items.forms = Array.from(domRoot.querySelectorAll('form:not([data-ln-ajax="false"])'));
		}

		return items;
	}

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_constructor(node);

							if (!node.hasAttribute(DOM_SELECTOR)) {
								node.querySelectorAll('[' + DOM_SELECTOR + ']').forEach(function (el) {
									_constructor(el);
								});

								// Node injected inside an already-initialized root — attach handlers to its links/forms
								var ajaxRoot = node.closest && node.closest('[' + DOM_SELECTOR + ']');
								if (ajaxRoot && ajaxRoot.getAttribute(DOM_SELECTOR) !== 'false') {
									var items = _findElements(node);
									_attachLinksAjax(items.links);
									_attachFormsAjax(items.forms);
								}
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

	function _initializeAll() {
		document.querySelectorAll('[' + DOM_SELECTOR + ']').forEach(function (element) {
			_constructor(element);
		});
	}

	window[DOM_ATTRIBUTE] = _constructor;

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
