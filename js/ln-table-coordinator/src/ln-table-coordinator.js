import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table-coordinator';
	const DOM_ATTRIBUTE = 'lnTableCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Keyboard Navigation Search Focus ('/' shortcut) ──
	// Deliberate, user-approved exception to host-scoping: this is a
	// page-level keyboard affordance, not coordination between a host and
	// its children, so it stays a single module-scope document listener
	// exactly as it behaves today (unchanged resolution order). Registering
	// it per-instance inside _bindEvents would fire it once per coordinator
	// on the page — this is why it lives outside _component/_bindEvents.

	document.addEventListener('keydown', function (e) {
		if (e.key !== '/') return;
		if (e.defaultPrevented) return;
		if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

		// Resolve search input inside active coordinator wrapper or first visible search
		const searchHost = document.querySelector('[' + DOM_SELECTOR + '] [data-ln-search]') || document.querySelector('[data-ln-search]');
		if (!searchHost) return;

		const input = (searchHost.tagName === 'INPUT' || searchHost.tagName === 'TEXTAREA')
			? searchHost
			: searchHost.querySelector('input[type="search"], input[type="text"], input');

		if (input) {
			e.preventDefault();
			input.focus();
		}
	});

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		_bindEvents(this);
		return this;
	}

	// ─── Event Binding (host-scoped — own subtree only) ────

	function _bindEvents(self) {
		const dom = self.dom;

		self._handlers = {
			// ln-search dispatches ln-search:change directly on its resolved
			// target — when that target IS the table, e.target already carries
			// data-ln-table. No ID resolution needed here, only a guard.
			search: function (e) {
				const table = e.target;
				if (!table.hasAttribute || !table.hasAttribute('data-ln-table')) return;
				if (!table.lnTable) return;
				// SSR tables self-bind ln-search:change directly (see ln-table.js) —
				// the coordinator only owns the data-driven path. A table wrapped
				// here that happens to be SSR is a markup mistake (rule: coordinator
				// is data-driven-only); this guard prevents a double-fire rather
				// than silently mishandling it.
				if (!table.hasAttribute('data-ln-table-source')) return;

				e.preventDefault();
				const term = e.detail && e.detail.term != null ? e.detail.term : '';
				const name = table.lnTable.name || table.id;

				dispatch(table, 'ln-table:set-search', { query: term, term: term, table: name });
			},

			// ln-filter dispatches ln-filter:changed on both its own <ul> root
			// and (if different) directly on the table via getElementById — same
			// reasoning: no ID resolution needed, only a guard.
			filter: function (e) {
				if (!e.detail) return;
				const table = e.target;
				if (!table.hasAttribute || !table.hasAttribute('data-ln-table')) return;
				if (!table.lnTable) return;

				const key = e.detail.key;
				const values = e.detail.values || [];
				const name = table.lnTable.name || table.id;

				// Header filter-button indicator — Layer 2 policy; ln-table itself
				// never sets this class.
				const ths = table.querySelectorAll('th');
				for (let i = 0; i < ths.length; i++) {
					if (ths[i].getAttribute('data-ln-table-filter-col') === key) {
						const btn = ths[i].querySelector('[data-ln-table-col-filter]');
						if (btn) btn.classList.toggle('ln-filter-active', values.length > 0);
						break;
					}
				}

				dispatch(table, 'ln-table:set-filter', { key: key, values: values, table: name });
			},

			// Clear-all has no ID binding of its own — resolve structurally,
			// scoped to this host only (never document-wide).
			clear: function (e) {
				const clearBtn = e.target.closest('[data-ln-table-clear], [data-ln-table-clear-all]');
				if (!clearBtn) return;

				const table = clearBtn.closest('[data-ln-table]') || dom.querySelector('[data-ln-table]');
				if (!table || !table.lnTable) return;

				const name = table.lnTable.name || table.id;

				const ths = table.querySelectorAll('th');
				for (let i = 0; i < ths.length; i++) {
					const filterBtn = ths[i].querySelector('[data-ln-table-col-filter]');
					if (filterBtn) filterBtn.classList.remove('ln-filter-active');
				}

				const tableId = table.id;
				const searchEl = (tableId && dom.querySelector('[data-ln-search="' + tableId + '"]'))
					|| dom.querySelector('[data-ln-search]');
				if (searchEl) {
					const input = (searchEl.tagName === 'INPUT' || searchEl.tagName === 'TEXTAREA')
						? searchEl
						: searchEl.querySelector('input');
					if (input) input.value = '';
				}

				const filters = (tableId && dom.querySelectorAll('[data-ln-filter="' + tableId + '"]'))
					|| dom.querySelectorAll('[data-ln-filter]');
				for (let i = 0; i < filters.length; i++) {
					const resetInput = filters[i].querySelector('[data-ln-filter-reset]');
					if (resetInput) {
						resetInput.checked = true;
						resetInput.dispatchEvent(new Event('change', { bubbles: true }));
					}
				}

				dispatch(table, 'ln-table:request-clear-filters', { table: name });
			}
		};

		dom.addEventListener('ln-search:change', self._handlers.search);
		dom.addEventListener('ln-filter:changed', self._handlers.filter);
		dom.addEventListener('click', self._handlers.clear);
	}

	// ─── Destroy ────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this._handlers) {
			this.dom.removeEventListener('ln-search:change', this._handlers.search);
			this.dom.removeEventListener('ln-filter:changed', this._handlers.filter);
			this.dom.removeEventListener('click', this._handlers.clear);
			this._handlers = null;
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table-coordinator');
})();
