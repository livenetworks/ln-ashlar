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
		if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) return;

		// Resolve search input inside active coordinator wrapper or first visible search
		const searchHost = document.querySelector('[' + DOM_SELECTOR + '] [data-ln-search-for]')
			|| document.querySelector('[data-ln-search-for]');
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

		// Point-to-point only: the event either landed on the table itself, or it
		// names the source that table is bound to. No "first table in the host"
		// fallback — ln-filter fires ln-filter:change on its own <ul>
		// root AND on the target, so a fallback makes the coordinator act twice
		// for one user change and emit two identical fetches.
		function _resolveTable(e) {
			const el = e.target;
			if (el && el.hasAttribute && el.hasAttribute('data-ln-table')) return el;
			const targetId = (e.detail && e.detail.targetId) || (el && el.id);
			if (!targetId) return null;
			return dom.querySelector('[data-ln-table-source="' + targetId + '"]') ||
			       dom.querySelector('[data-ln-table="' + targetId + '"]');
		}

		self._handlers = {
			// Query state is not forwarded here. The source owns search/filter/sort
			// (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
			// every view bound to it — a second forwarder would fetch twice for one
			// user change. What is left is the header indicator, which is Layer 2
			// policy: ln-table never sets this class itself.
			filter: function (e) {
				if (!e.detail) return;
				const table = _resolveTable(e);
				if (!table || !table.hasAttribute || !table.hasAttribute('data-ln-table')) return;

				const key = e.detail.key;
				const values = e.detail.values || [];

				const ths = table.querySelectorAll('th');
				for (let i = 0; i < ths.length; i++) {
					if (ths[i].getAttribute('data-ln-table-filter-col') === key) {
						const btn = ths[i].querySelector('[data-ln-table-col-filter]');
						if (btn) btn.classList.toggle('ln-filter-active', values.length > 0);
						break;
					}
				}
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

				// Query controls address the source (docs/architecture/shared-query.md);
				// only an SSR table is its own source.
				const sourceId = table.getAttribute('data-ln-table-source') || table.id;
				const sourceEl = sourceId ? document.getElementById(sourceId) : null;
				if (sourceEl && sourceEl.hasAttribute('data-ln-search')) {
					sourceEl.setAttribute('data-ln-search', '');
				}

				const searchEl = (sourceId && dom.querySelector('[data-ln-search-for="' + sourceId + '"]'))
					|| dom.querySelector('[data-ln-search-for]');
				if (searchEl) {
					const input = (searchEl.tagName === 'INPUT' || searchEl.tagName === 'TEXTAREA')
						? searchEl
						: searchEl.querySelector('input');
					if (input && input.value !== '') {
						input.value = '';
						input.dispatchEvent(new Event('input', { bubbles: true }));
					}
				}

				const filters = (sourceId && dom.querySelectorAll('[data-ln-filter="' + sourceId + '"]'))
					|| dom.querySelectorAll('[data-ln-filter]');
				for (let i = 0; i < filters.length; i++) {
					const resetInput = filters[i].querySelector('[data-ln-filter-reset]');
					if (resetInput) {
						resetInput.checked = true;
						resetInput.dispatchEvent(new Event('change', { bubbles: true }));
					}
				}

				// A data-driven table is refreshed by its source: the control resets
				// above already emit the query change. Only an SSR table, which holds
				// its own rows, still needs to be told directly.
				if (!table.hasAttribute('data-ln-table-source')) {
					dispatch(table, 'ln-table:request-clear-filters', { table: name });
				}
			}
		};

		dom.addEventListener('ln-filter:change', self._handlers.filter);
		dom.addEventListener('click', self._handlers.clear);
	}

	// ─── Destroy ────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this._handlers) {
			this.dom.removeEventListener('ln-filter:change', this._handlers.filter);
			this.dom.removeEventListener('click', this._handlers.clear);
			this._handlers = null;
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table-coordinator');
})();
