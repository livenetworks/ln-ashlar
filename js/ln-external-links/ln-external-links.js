/**
 * ln-external-links
 * Automatically processes external links to open in new tabs with security attributes
 *
 * Usage:
 * Just include this script and it will automatically:
 * - Process all external links on page load
 * - Watch for dynamically added links
 * - Dispatch events for tracking
 *
 * API:
 * window.lnExternalLinks.process(container) - Manually process links in a container
 *
 * Events:
 * - ln-external-links:processed - When a link is processed
 * - ln-external-links:clicked - When an external link is clicked
 */

(function() {
	const DOM_ATTRIBUTE = 'lnExternalLinks';

	// Prevent duplicate initialization
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
		return;
	}

	/**
	 * Dispatch a custom event
	 * @param {HTMLElement} element - Element to dispatch from
	 * @param {string} eventName - Name of the event
	 * @param {Object} detail - Event detail data
	 */
	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail
		}));
	}

	/**
	 * Check if a link is external
	 * @param {HTMLAnchorElement|HTMLAreaElement} link - Link element to check
	 * @returns {boolean} True if link is external
	 */
	function _isExternalLink(link) {
		// Check if link has a hostname and it differs from current hostname
		return link.hostname && link.hostname !== window.location.hostname;
	}

	/**
	 * Process a single link element
	 * @param {HTMLAnchorElement|HTMLAreaElement} link - Link to process
	 */
	function _processLink(link) {
		// Skip if already processed
		if (link.getAttribute('data-ln-external-link') === 'processed') {
			return;
		}

		// Skip if not external
		if (!_isExternalLink(link)) {
			return;
		}

		// Set target and rel attributes
		link.target = '_blank';
		link.rel = 'noopener noreferrer';

		// Mark as processed
		link.setAttribute('data-ln-external-link', 'processed');

		// Dispatch processed event
		_dispatch(link, 'ln-external-links:processed', {
			link: link,
			href: link.href
		});
	}

	/**
	 * Process all links in a container
	 * @param {HTMLElement} container - Container to search for links (defaults to document.body)
	 */
	function _processLinks(container) {
		container = container || document.body;

		// Get all anchor and area elements
		const links = container.querySelectorAll('a, area');

		// Process each link
		links.forEach(function(link) {
			_processLink(link);
		});
	}

	/**
	 * Set up click tracking for external links
	 */
	function _setupClickTracking() {
		// Use event delegation on document.body
		document.body.addEventListener('click', function(e) {
			// Check if clicked element is a link or inside a link
			const link = e.target.closest('a, area');

			if (!link) {
				return;
			}

			// Check if it's an external link that was processed
			if (link.getAttribute('data-ln-external-link') === 'processed') {
				// Dispatch clicked event
				_dispatch(link, 'ln-external-links:clicked', {
					link: link,
					href: link.href,
					text: link.textContent || link.title || ''
				});
			}
		});
	}

	/**
	 * Set up MutationObserver to watch for dynamically added links
	 */
	function _domObserver() {
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function(node) {
						// Only process element nodes
						if (node.nodeType === 1) {
							// Check if the node itself is a link
							if (node.matches && (node.matches('a') || node.matches('area'))) {
								_processLink(node);
							}

							// Check for links within the added node
							const links = node.querySelectorAll && node.querySelectorAll('a, area');
							if (links) {
								links.forEach(_processLink);
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

	/**
	 * Initialize the component
	 */
	function _initialize() {
		// Set up click tracking
		_setupClickTracking();

		// Start observing for dynamic content
		_domObserver();

		// Process existing links
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				_processLinks();
			});
		} else {
			_processLinks();
		}
	}

	// Expose global API
	window[DOM_ATTRIBUTE] = {
		process: _processLinks
	};

	// Initialize
	_initialize();

})();
