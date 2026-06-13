/* greet — the "/spa-starter/hello/:name" view.
 * Shows the secure way to put a URL parameter on screen: fillTemplate walks
 * text nodes and replaces {{ name }} — it never touches innerHTML. */
(function () {
	'use strict';

	App.defineView('/spa-starter/hello/:name', {
		mount: function (ctx) {
			window.lnCore.fillTemplate(ctx.target, { name: ctx.params.name });
		}
	});
})();
