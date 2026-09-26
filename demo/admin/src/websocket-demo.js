// Page wiring for websocket-connector.html.
// Connection status is announced by events, never an attribute — this page
// listens and writes its own data-status on the chip. The connect/disconnect
// buttons write the connector's command attribute.
(function () {
	['connecting', 'connected', 'disconnected'].forEach(function (status) {
		document.addEventListener('ln-websocket-connector:' + status, function (e) {
			const chips = document.querySelectorAll('[data-ws-status-for="' + e.target.id + '"]');
			for (let i = 0; i < chips.length; i++) chips[i].setAttribute('data-status', status);
		});
	});

	document.addEventListener('click', function (e) {
		const button = e.target.closest('[data-ws-command]');
		if (!button) return;
		const socket = document.getElementById(button.getAttribute('data-ws-for'));
		if (socket) socket.setAttribute('data-ln-websocket-connector', button.getAttribute('data-ws-command'));
	});
})();
