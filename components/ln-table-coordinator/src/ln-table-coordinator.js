import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table-coordinator';
	const DOM_ATTRIBUTE = 'lnTableCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-table-coordinator': { type: 'marker', description: 'Mounts table coordinator mediating between table, search, filter, and pagination' }
	};

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

	// ─── Empty State Mediation (Plain SSR Tables) ───────────

	function _isRowVisible(tr) {
		if (tr.hasAttribute('data-ln-search-hide') || tr.hasAttribute('data-ln-filter-hide')) return false;
		if (tr.hidden || (tr.classList && tr.classList.contains('hidden'))) return false;
		if (tr.style && tr.style.display === 'none') return false;
		return true;
	}

	function _ensureEmptyElement(self) {
		if (self._emptyEl) return self._emptyEl;
		const template = self.dom.querySelector('template[data-ln-table-empty]');
		if (!template) return null;
		const subEl = template.content.firstElementChild;
		if (!subEl) return null;

		const clone = document.importNode(subEl, true);
		clone.setAttribute('data-ln-table-empty', '');
		clone.classList.add('hidden');
		clone.hidden = true;

		const table = self.dom.querySelector('table');
		if (!table) return null;
		const mountTarget = table.closest('.table-container') || table;
		mountTarget.insertAdjacentElement('afterend', clone);
		self._emptyEl = clone;
		return clone;
	}

	function _syncEmptyState(self) {
		const table = self.dom.querySelector('table');
		if (!table) return;
		if (table.hasAttribute('data-ln-table') || (table.parentElement && table.parentElement.hasAttribute('data-ln-table'))) return;

		const template = self.dom.querySelector('template[data-ln-table-empty]');
		if (!template) return;

		const emptyEl = _ensureEmptyElement(self);
		if (!emptyEl) return;

		const rows = table.querySelectorAll('tbody tr');
		let hasVisible = false;
		for (let i = 0; i < rows.length; i++) {
			const tr = rows[i];
			if (tr.hasAttribute('data-ln-table-empty')) continue;
			if (_isRowVisible(tr)) {
				hasVisible = true;
				break;
			}
		}

		const shouldShow = rows.length > 0 && !hasVisible;
		if (shouldShow) {
			emptyEl.classList.remove('hidden');
			emptyEl.hidden = false;
		} else {
			emptyEl.classList.add('hidden');
			emptyEl.hidden = true;
		}
	}

	function _setupEmptyState(self) {
		const table = self.dom.querySelector('table');
		if (!table) return;
		if (table.hasAttribute('data-ln-table') || (table.parentElement && table.parentElement.hasAttribute('data-ln-table'))) return;

		const template = self.dom.querySelector('template[data-ln-table-empty]');
		if (!template) return;

		const tbody = table.querySelector('tbody') || table;
		const observer = new MutationObserver(function () {
			_syncEmptyState(self);
		});

		observer.observe(tbody, {
			attributes: true,
			attributeFilter: ['data-ln-search-hide', 'data-ln-filter-hide', 'hidden', 'class', 'style'],
			subtree: true,
			childList: true
		});

		self._emptyObserver = observer;
		_syncEmptyState(self);
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._emptyEl = null;
		this._emptyObserver = null;
		_bindEvents(this);
		_setupEmptyState(this);
		return this;
	}

	function _findSearchInput(dom, sourceId) {
		const sel = sourceId ? '[data-ln-search-for="' + sourceId + '"]' : '[data-ln-search-for]';
		const host = dom.querySelector(sel) || document.querySelector(sel);
		if (!host) return null;
		return (host.tagName === 'INPUT' || host.tagName === 'TEXTAREA')
			? host
			: host.querySelector('input, textarea');
	}

	function _findFilterElements(dom, sourceId) {
		if (sourceId) {
			const scoped = dom.querySelectorAll('[data-ln-filter="' + sourceId + '"]');
			if (scoped.length > 0) return scoped;
			const global = document.querySelectorAll('[data-ln-filter="' + sourceId + '"]');
			if (global.length > 0) return global;
		}
		const fallbackScoped = dom.querySelectorAll('[data-ln-filter]');
		return fallbackScoped.length > 0 ? fallbackScoped : document.querySelectorAll('[data-ln-filter]');
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
			if (el && el.hasAttribute && (el.hasAttribute('data-ln-table') || el.tagName === 'TABLE')) return el;
			const targetId = (e.detail && e.detail.targetId) || (el && el.id);
			if (!targetId) return null;
			const safeId = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') ? CSS.escape(targetId) : targetId.replace(/(["\\])/g, '\\$1');
			return dom.querySelector('[data-ln-table-source="' + safeId + '"]') ||
			       dom.querySelector('[data-ln-table="' + safeId + '"]') ||
			       (dom.id === targetId ? dom : null) ||
			       document.getElementById(targetId);
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
				if (!table) return;

				const key = e.detail.key;
				const values = e.detail.values || [];

				const ths = table.querySelectorAll('th');
				for (let i = 0; i < ths.length; i++) {
					const colKey = ths[i].getAttribute('data-ln-table-filter-col') ||
					               ths[i].getAttribute('data-ln-filter-col') ||
					               ths[i].getAttribute('data-ln-filter-key') ||
					               ths[i].getAttribute('data-ln-field');
					if (colKey === key) {
						const btn = ths[i].querySelector('[data-ln-table-col-filter]');
						if (btn) btn.classList.toggle('ln-filter-active', values.length > 0);
						break;
					}
				}

				_syncEmptyState(self);
			},

			// Clear-all has no ID binding of its own — resolve structurally,
			// scoped to this host only (never document-wide).
			clear: function (e) {
				const clearBtn = e.target.closest('[data-ln-table-clear], [data-ln-table-clear-all]');
				if (!clearBtn) return;

				const table = clearBtn.closest('[data-ln-table], table') || dom.querySelector('[data-ln-table], table');
				if (!table) return;

				const name = (table.lnTable && table.lnTable.name) || table.id;

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
					// State component syncs input controls and emits ln-search:change
					sourceEl.setAttribute('data-ln-search', '');
				} else {
					const input = _findSearchInput(dom, sourceId);
					if (input && input.value !== '') {
						input.value = '';
						input.dispatchEvent(new Event('input', { bubbles: true }));
					}
				}

				const filterEls = _findFilterElements(dom, sourceId);
				for (let i = 0; i < filterEls.length; i++) {
					const resetInput = filterEls[i].querySelector('[data-ln-filter-reset]');
					if (!resetInput) continue;
					const hasActiveValues = filterEls[i].querySelectorAll('input:not([data-ln-filter-reset]):checked').length > 0;
					if (!resetInput.checked || hasActiveValues) {
						resetInput.checked = true;
						resetInput.dispatchEvent(new Event('change', { bubbles: true }));
					}
				}

				// A data-driven table is refreshed by its source: the control resets
				// above already emit the query change. Only an SSR table, which holds
				// its own rows, still needs to be told directly.
				if (table.lnTable && !table.hasAttribute('data-ln-table-source')) {
					dispatch(table, 'ln-table:request-clear-filters', { table: name });
				}

				_syncEmptyState(self);
			}
		};

		dom.addEventListener('ln-filter:change', self._handlers.filter);
		dom.addEventListener('click', self._handlers.clear);
	}

	// ─── Destroy ────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this._emptyObserver) {
			this._emptyObserver.disconnect();
			this._emptyObserver = null;
		}

		if (this._emptyEl) {
			if (this._emptyEl.parentNode) this._emptyEl.remove();
			this._emptyEl = null;
		}

		if (this._handlers) {
			this.dom.removeEventListener('ln-filter:change', this._handlers.filter);
			this.dom.removeEventListener('click', this._handlers.clear);
			this._handlers = null;
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table-coordinator', {
		attributes: ATTRIBUTES
	});
})();
