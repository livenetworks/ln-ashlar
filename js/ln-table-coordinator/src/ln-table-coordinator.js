import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-table-coordinator';
	const DOM_ATTRIBUTE = 'lnTableCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Helper: Resolve Target Table from Host/Attribute/Wrapper ───

	function _findTargetTable(triggerEl, explicitId) {
		if (explicitId) {
			const el = document.getElementById(explicitId);
			if (el && el.hasAttribute('data-ln-table')) return el;
		}

		if (triggerEl) {
			const tableAttr = triggerEl.getAttribute('data-ln-search') || triggerEl.getAttribute('data-ln-filter');
			if (tableAttr) {
				const el = document.getElementById(tableAttr) || document.querySelector('[data-ln-table="' + tableAttr + '"]');
				if (el) return el;
			}

			// Look up for closest [data-ln-table-coordinator] wrapper
			const coordinatorWrapper = triggerEl.closest('[' + DOM_SELECTOR + ']');
			if (coordinatorWrapper) {
				const table = coordinatorWrapper.querySelector('[data-ln-table]');
				if (table) return table;
			}

			const closestTable = triggerEl.closest('[data-ln-table]');
			if (closestTable) return closestTable;
		}

		return document.querySelector('[data-ln-table]');
	}

	// ─── Search Integration ───────────────────────────────

	document.addEventListener('ln-search:change', function (e) {
		const term = e.detail && e.detail.term != null ? e.detail.term : '';
		const searchHost = e.target;
		const tableId = searchHost.getAttribute ? searchHost.getAttribute('data-ln-search') : null;
		const table = _findTargetTable(searchHost, tableId);

		if (!table || !table.lnTable) return;
		e.preventDefault();

		// Value-mirror on search input if host contains input
		const input = (searchHost.tagName === 'INPUT' || searchHost.tagName === 'TEXTAREA')
			? searchHost
			: searchHost.querySelector ? searchHost.querySelector('input[type="search"], input[type="text"], input') : null;

		if (input && input.value !== term) {
			input.value = term;
		}

		dispatch(table, 'ln-table:set-search', {
			query: term,
			term: term,
			table: table.lnTable.name || table.id
		});
	});

	// ─── Column Filter Integration ─────────────────────────

	document.addEventListener('ln-filter:changed', function (e) {
		if (!e.detail) return;
		const key = e.detail.key;
		const values = e.detail.values || [];
		const filterHost = e.target;
		if (!filterHost.hasAttribute || !filterHost.hasAttribute('data-ln-filter')) return;
		const tableId = filterHost.getAttribute ? filterHost.getAttribute('data-ln-filter') : null;
		const table = _findTargetTable(filterHost, tableId);

		if (!table || !table.lnTable) return;

		// Toggle visual indicator class on header filter button
		const ths = table.querySelectorAll('th');
		for (let i = 0; i < ths.length; i++) {
			if (ths[i].getAttribute('data-ln-table-filter-col') === key) {
				const btn = ths[i].querySelector('[data-ln-table-col-filter]');
				if (btn) {
					btn.classList.toggle('ln-filter-active', values.length > 0);
				}
				break;
			}
		}

		dispatch(table, 'ln-table:set-filter', {
			key: key,
			values: values,
			table: table.lnTable.name || table.id
		});
	});

	// ─── Clear All / Clear Filters Click Handler ──────────

	document.addEventListener('click', function (e) {
		const clearBtn = e.target.closest('[data-ln-table-clear-all], [data-ln-table-clear]');
		if (!clearBtn) return;

		const table = _findTargetTable(clearBtn);
		if (!table || !table.lnTable) return;

		// 1. Reset visual indicators on filter buttons inside table
		const ths = table.querySelectorAll('th');
		for (let i = 0; i < ths.length; i++) {
			const filterBtn = ths[i].querySelector('[data-ln-table-col-filter]');
			if (filterBtn) filterBtn.classList.remove('ln-filter-active');
		}

		// 2. Clear linked search input inside wrapper/scope or document
		const wrapper = clearBtn.closest('[' + DOM_SELECTOR + ']');
		const scopeRoot = wrapper || document;
		const tableId = table.id;

		const searchEl = (tableId && scopeRoot.querySelector('[data-ln-search="' + tableId + '"]'))
			|| scopeRoot.querySelector('[data-ln-search]');

		if (searchEl) {
			const input = (searchEl.tagName === 'INPUT' || searchEl.tagName === 'TEXTAREA')
				? searchEl
				: searchEl.querySelector('input');
			if (input) input.value = '';
		}

		// 3. Clear linked filter popovers / form reset inputs
		const filters = (tableId && scopeRoot.querySelectorAll('[data-ln-filter="' + tableId + '"]'))
			|| scopeRoot.querySelectorAll('[data-ln-filter]');
		for (let i = 0; i < filters.length; i++) {
			const resetInput = filters[i].querySelector('[data-ln-filter-reset]');
			if (resetInput) {
				resetInput.checked = true;
				resetInput.dispatchEvent(new Event('change', { bubbles: true }));
			}
		}

		// 4. Dispatch clear filters request event to table
		dispatch(table, 'ln-table:request-clear-filters', {
			table: table.lnTable.name || table.id
		});
	});

	// ─── Keyboard Navigation Search Focus ('/' shortcut) ──

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

	// ─── Component Constructor & Registration ────────────

	function _component(dom) {
		this.dom = dom;
		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-table-coordinator');
})();
