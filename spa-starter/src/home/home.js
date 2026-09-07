/* home — the "/spa-starter" view coordinator. */
(function () {
	'use strict';

	var timer = null;

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	document.addEventListener('ln-router:navigated', function (e) {
		stopTimer();

		var pattern = e.detail && e.detail.route && e.detail.route.pattern;
		if (pattern !== '/spa-starter') return;

		var target = e.detail.target;
		if (!target) return;

		var clock = target.querySelector('[data-clock]');
		function tick() { if (clock) clock.textContent = new Date().toLocaleTimeString(); }
		tick();
		timer = setInterval(tick, 1000);

		// Cross-module messaging via a public event — no shared variables.
		var ping = target.querySelector('[data-ping]');
		if (ping) {
			ping.addEventListener('click', function () {
				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: { type: 'success', title: 'Hello', message: 'Toast dispatched from the home module.' }
				}));
			});
		}
	});
})();
