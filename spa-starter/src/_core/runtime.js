/* ──────────────────────────────────────────────────────────────────────────
 * _core/runtime.js — the starter's micro-runtime (loaded first; '_core' sorts
 * ahead of every lowercase module folder).
 *
 * It exposes window.App with two declarative registrars, built ONLY on the
 * public globals shipped by the ln-ashlar bundle:
 *
 *   App.defineModule(setup)            → persistent: runs once when the DOM is
 *                                        ready. For shell chrome, stores,
 *                                        modals, toasts, offline banners —
 *                                        anything that lives the whole session.
 *
 *   App.defineView(pattern, { mount, unmount })
 *                                      → transient: mount(ctx) when its route
 *                                        becomes active, unmount() when leaving.
 *                                        ctx = { target, params, query, path }.
 *
 * Why a runtime instead of ln-core's registerComponent? registerComponent is
 * an ESM export and is NOT on window.lnCore, so a plain (non-bundled) script
 * cannot call it. The route lifecycle below uses the ln-router:navigated event,
 * which IS public — keeping every module file concatenation-friendly.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
	'use strict';

	var views = [];     // { pattern, mount, unmount }
	var modules = [];    // persistent setup fns
	var active = null;   // currently mounted view record

	var App = {
		defineModule: function (setup) { modules.push(setup); },
		defineView: function (pattern, hooks) {
			views.push({ pattern: pattern, mount: hooks.mount, unmount: hooks.unmount });
		}
	};
	window.App = App;

	function safe(fn, label, arg) {
		if (!fn) return;
		try { fn(arg); } catch (err) { console.error('[App] ' + label + ' failed:', err); }
	}

	function onNavigated(e) {
		var pattern = e.detail.route && e.detail.route.pattern;

		// Tear down the outgoing view before mounting the incoming one.
		if (active && active.pattern !== pattern) {
			safe(active.unmount, 'unmount (' + active.pattern + ')');
		}
		active = null;

		for (var i = 0; i < views.length; i++) {
			if (views[i].pattern === pattern) {
				active = views[i];
				safe(active.mount, 'mount (' + pattern + ')', {
					target: e.detail.target,
					params: e.detail.params,
					query: e.detail.query,
					path: e.detail.path
				});
				return;
			}
		}
	}

	// ln-router defers its boot 'navigated' one microtask, so this listener —
	// attached from a <script defer> placed after the bundle — still receives it.
	document.addEventListener('ln-router:navigated', onNavigated);

	function bootModules() {
		for (var i = 0; i < modules.length; i++) safe(modules[i], 'module');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootModules);
	} else {
		bootModules();
	}
})();
