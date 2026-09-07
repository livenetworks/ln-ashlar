/* greet — the "/spa-starter/hello/:name" view coordinator.
 * Shows the secure way to put a URL parameter on screen: fillTemplate walks
 * text nodes and replaces {{ name }} — it never touches innerHTML. */
(function () {
	'use strict';

	document.addEventListener('ln-router:navigated', function (e) {
		var pattern = e.detail && e.detail.route && e.detail.route.pattern;
		if (pattern !== '/spa-starter/hello/:name') return;

		if (e.detail.target && e.detail.params) {
			window.lnCore.fillTemplate(e.detail.target, { name: e.detail.params.name });
		}
	});
})();
