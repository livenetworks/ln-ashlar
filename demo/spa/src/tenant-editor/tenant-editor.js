(function () {
	'use strict';

	// Write path is now declarative (data-ln-form-scope="tenants" on
	// #tenant-form) — the coordinator claims ln-form:submit-record itself.
	document.addEventListener('ln-form:submit-record', function (e) {
		if (e.detail.scope !== 'tenants' || e.target.id !== 'tenant-form') return;
		window.lnRouter.navigate('/spa/tenants');
	});
})();
