// Auto-populate code blocks from live demo HTML
document.querySelectorAll('.demo-split').forEach(function(split) {
	const src = split.querySelector('article');
	const code = split.querySelector('figure code');
	if (src && code) code.textContent = src.innerHTML.trim();
});

(function () {
	const SIDEBAR_ID = 'demo-sidebar';

	function readBpMd() {
		const value = getComputedStyle(document.documentElement).getPropertyValue('--bp-md');
		const parsed = parseInt(value, 10);
		return isNaN(parsed) ? 768 : parsed;
	}

	function init() {
		const sidebar = document.getElementById(SIDEBAR_ID);
		if (!sidebar) return;

		const bpMd = readBpMd();
		const mq = window.matchMedia('(max-width: ' + bpMd + 'px)');

		const closeSidebar = function () {
			if (sidebar.lnToggle) {
				sidebar.lnToggle.close();
			} else {
				sidebar.setAttribute('data-ln-toggle', 'close');
			}
		};

		const openSidebar = function () {
			if (sidebar.lnToggle) {
				sidebar.lnToggle.open();
			} else {
				sidebar.setAttribute('data-ln-toggle', 'open');
			}
		};

		if (mq.matches) {
			closeSidebar();
		}

		mq.addEventListener('change', function (e) {
			if (e.matches) {
				closeSidebar();
			} else {
				openSidebar();
			}
		});

		document.addEventListener('click', function (e) {
			if (!mq.matches) return;
			if (!sidebar.classList.contains('open')) return;
			const target = e.target;
			if (!(target instanceof Element)) return;
			if (target.closest('#' + SIDEBAR_ID)) return;
			if (target.closest('[data-ln-toggle-for="' + SIDEBAR_ID + '"]')) return;
			closeSidebar();
		});
	}

	init();
})();
