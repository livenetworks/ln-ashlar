(function () {
	const DOM_SELECTOR = 'data-ln-ajax';
	const DOM_ATTRIBUTE = 'lnAjax';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	function _constructor(domRoot) {
		if (!domRoot.hasAttribute(DOM_SELECTOR)) return;
		if (domRoot[DOM_ATTRIBUTE]) return;
		domRoot[DOM_ATTRIBUTE] = true;

		const items = _findElements(domRoot);
		_attachLinksAjax(items.links);
		_attachFormsAjax(items.forms);
	}

	function _attachLinksAjax(links) {
		for (const link of links) {
			if (link[DOM_ATTRIBUTE + 'Trigger']) continue;

			// Skip external links — CORS blocks them and they should open normally
			if (link.hostname && link.hostname !== window.location.hostname) continue;

			const href = link.getAttribute('href');
			if (href && href.includes('#')) continue;

			const handler = function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;

				e.preventDefault();
				const url = link.getAttribute('href');
				if (url) {
					_makeAjaxRequest('GET', url, null, link);
				}
			};

			link.addEventListener('click', handler);
			link[DOM_ATTRIBUTE + 'Trigger'] = handler;
		}
	}

	function _attachFormsAjax(forms) {
		for (const form of forms) {
			if (form[DOM_ATTRIBUTE + 'Trigger']) continue;

			const handler = function (e) {
				e.preventDefault();
				const method = form.method.toUpperCase();
				const action = form.action;
				const formData = new FormData(form);

				for (const btn of form.querySelectorAll('button, input[type="submit"]')) {
					btn.disabled = true;
				}

				_makeAjaxRequest(method, action, formData, form, function () {
					for (const btn of form.querySelectorAll('button, input[type="submit"]')) {
						btn.disabled = false;
					}
				});
			};

			form.addEventListener('submit', handler);
			form[DOM_ATTRIBUTE + 'Trigger'] = handler;
		}
	}

	function _destroy(domRoot) {
		if (!domRoot[DOM_ATTRIBUTE]) return;

		const items = _findElements(domRoot);
		for (const link of items.links) {
			if (link[DOM_ATTRIBUTE + 'Trigger']) {
				link.removeEventListener('click', link[DOM_ATTRIBUTE + 'Trigger']);
				delete link[DOM_ATTRIBUTE + 'Trigger'];
			}
		}
		for (const form of items.forms) {
			if (form[DOM_ATTRIBUTE + 'Trigger']) {
				form.removeEventListener('submit', form[DOM_ATTRIBUTE + 'Trigger']);
				delete form[DOM_ATTRIBUTE + 'Trigger'];
			}
		}

		delete domRoot[DOM_ATTRIBUTE];
	}

	function _makeAjaxRequest(method, url, data, element, callback) {
		const before = _dispatchCancelable(element, 'ln-ajax:before-start', { method: method, url: url });
		if (before.defaultPrevented) return;

		_dispatch(element, 'ln-ajax:start', { method: method, url: url });

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
			.then(function (response) {
				var ok = response.ok;
				return response.json().then(function (data) {
					return { ok: ok, status: response.status, data: data };
				});
			})
			.then(function (result) {
				var data = result.data;

				if (result.ok) {
					if (data.title) {
						document.title = data.title;
					}

					if (data.content) {
						for (const targetId in data.content) {
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

					_dispatch(element, 'ln-ajax:success', { method: method, url: finalUrl, data: data });
				} else {
					_dispatch(element, 'ln-ajax:error', { method: method, url: finalUrl, status: result.status, data: data });
				}

				// Auto-show response message as toast
				if (data.message && window.lnToast) {
					var msg = data.message;
					window.lnToast.enqueue({
						type: msg.type || (result.ok ? 'success' : 'error'),
						title: msg.title || '',
						message: msg.body || ''
					});
				}

				_dispatch(element, 'ln-ajax:complete', { method: method, url: finalUrl });
				_cleanup();
			})
			.catch(function (error) {
				_dispatch(element, 'ln-ajax:error', { method: method, url: finalUrl, error: error });
				_dispatch(element, 'ln-ajax:complete', { method: method, url: finalUrl });
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
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_constructor(node);

							if (!node.hasAttribute(DOM_SELECTOR)) {
								for (const el of node.querySelectorAll('[' + DOM_SELECTOR + ']')) {
									_constructor(el);
								}

								const ajaxRoot = node.closest && node.closest('[' + DOM_SELECTOR + ']');
								if (ajaxRoot && ajaxRoot.getAttribute(DOM_SELECTOR) !== 'false') {
									const items = _findElements(node);
									_attachLinksAjax(items.links);
									_attachFormsAjax(items.forms);
								}
							}
						}
					}
				} else if (mutation.type === 'attributes') {
					_constructor(mutation.target);
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

	function _initializeAll() {
		for (const element of document.querySelectorAll('[' + DOM_SELECTOR + ']')) {
			_constructor(element);
		}
	}

	window[DOM_ATTRIBUTE] = _constructor;
	window[DOM_ATTRIBUTE].destroy = _destroy;

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();
