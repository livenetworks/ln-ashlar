/* shell — persistent app chrome behaviour.
 * Lives for the whole session, so it registers as a module (not a view). */
(function () {
	'use strict';

	App.defineModule(function () {
		var sidebar = document.getElementById('app-sidebar');
		var scrim = document.querySelector('.app-scrim');

		// On mobile the sidebar is a drawer over a scrim; close it after the
		// user navigates. On desktop the scrim is display:none, so this no-ops.
		document.addEventListener('ln-router:navigated', function () {
			if (sidebar && scrim && getComputedStyle(scrim).display !== 'none') {
				sidebar.setAttribute('data-ln-toggle', 'close');
			}
		});
	});
})();
