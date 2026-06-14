/* home — the "/spa-starter" view.
 * Demonstrates the view lifecycle: a ticking clock started on mount and, more
 * importantly, CLEARED on unmount. Forgetting that teardown is the classic
 * leak when a monolithic app.js is split into per-view modules. */
(function () {
	'use strict';

	var timer = null;

	App.defineView('/spa-starter', {
		mount: function (ctx) {
			var clock = ctx.target.querySelector('[data-clock]');
			function tick() { if (clock) clock.textContent = new Date().toLocaleTimeString(); }
			tick();
			timer = setInterval(tick, 1000);

			// Cross-module messaging via a public event — no shared variables.
			var ping = ctx.target.querySelector('[data-ping]');
			if (ping) {
				ping.addEventListener('click', function () {
					window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
						detail: { type: 'success', title: 'Hello', message: 'Toast dispatched from the home module.' }
					}));
				});
			}
			// The click listener lives on ctx.target, which the router discards on
			// navigation — so only the interval needs explicit teardown below.
		},
		unmount: function () {
			clearInterval(timer);
			timer = null;
		}
	});
})();
