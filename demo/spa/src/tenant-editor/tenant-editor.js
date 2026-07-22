(function () {
	'use strict';

	// Write path is native-first (data-ln-form-scope="tenants" on
	// #tenant-form) — react to the store outcome instead of a form-level event.
	document.addEventListener('ln-data-store:updated', function (e) {
		if (e.detail.store !== 'tenants') return;
		window.lnRouter.navigate('/spa/tenants');
	});
})();
