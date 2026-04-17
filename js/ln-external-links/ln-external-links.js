import { dispatch, guardBody } from '../ln-core';

(function() {
	const DOM_ATTRIBUTE = 'lnExternalLinks';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _isExternalLink(link) {
		return link.hostname && link.hostname !== window.location.hostname;
	}

	function _processLink(link) {
		if (link.getAttribute('data-ln-external-link') === 'processed') return;
		if (!_isExternalLink(link)) return;

		link.target = '_blank';
		link.rel = 'noopener noreferrer';

		const hint = document.createElement('span');
		hint.className = 'sr-only';
		hint.textContent = '(opens in new tab)';
		link.appendChild(hint);

		link.setAttribute('data-ln-external-link', 'processed');

		dispatch(link, 'ln-external-links:processed', {
			link: link,
			href: link.href
		});
	}

	function _processLinks(container) {
		container = container || document.body;

		for (const link of container.querySelectorAll('a, area')) {
			_processLink(link);
		}
	}

	function _setupClickTracking() {
		document.body.addEventListener('click', function(e) {
			const link = e.target.closest('a, area');
			if (!link) return;

			if (link.getAttribute('data-ln-external-link') === 'processed') {
				dispatch(link, 'ln-external-links:clicked', {
					link: link,
					href: link.href,
					text: link.textContent || link.title || ''
				});
			}
		});
	}

	function _domObserver() {
		guardBody(function() {
			const observer = new MutationObserver(function(mutations) {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						for (const node of mutation.addedNodes) {
							if (node.nodeType === 1) {
								if (node.matches && (node.matches('a') || node.matches('area'))) {
									_processLink(node);
								}

								if (node.querySelectorAll) {
									for (const link of node.querySelectorAll('a, area')) {
										_processLink(link);
									}
								}
							}
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}, 'ln-external-links');
	}

	function _initialize() {
		_setupClickTracking();
		_domObserver();

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				_processLinks();
			});
		} else {
			_processLinks();
		}
	}

	window[DOM_ATTRIBUTE] = {
		process: _processLinks
	};

	_initialize();
})();
