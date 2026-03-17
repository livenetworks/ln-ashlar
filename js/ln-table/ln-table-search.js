(function () {
	const DOM_ATTRIBUTE = 'lnTableSearch';
	const SEARCH_SELECTOR = 'data-ln-table-search';
	const CLEAR_SELECTOR = 'data-ln-table-clear';
	const TABLE_SELECTOR = 'data-ln-table';
	const DEBOUNCE_MS = 150;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		var inputs = Array.from(root.querySelectorAll('[' + SEARCH_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(SEARCH_SELECTOR)) inputs.push(root);
		inputs.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) el[DOM_ATTRIBUTE] = new _component(el);
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(input) {
		this.input = input;
		this._timer = null;
		var self = this;

		input.addEventListener('input', function () {
			clearTimeout(self._timer);
			self._timer = setTimeout(function () {
				self._fire(input.value.trim().toLowerCase());
			}, DEBOUNCE_MS);
		});

		return this;
	}

	_component.prototype._fire = function (term) {
		var targetId = this.input.getAttribute(SEARCH_SELECTOR);
		var target = targetId ? document.getElementById(targetId) : null;
		if (!target) return;

		target.dispatchEvent(new CustomEvent('ln-table:search', {
			bubbles: true,
			detail: { term: term }
		}));
	};

	// ─── Clear button — global delegation ─────────────────────
	// Resolves: [data-ln-table-clear] → closest [data-ln-table] id
	// → finds matching [data-ln-table-search="id"] input

	document.addEventListener('click', function (e) {
		var btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
		if (!btn) return;

		var container = btn.closest('[' + TABLE_SELECTOR + ']');
		if (!container || !container.id) return;

		var input = document.querySelector('[' + SEARCH_SELECTOR + '="' + container.id + '"]');
		if (!input) return;

		input.value = '';
		input.focus();
		if (input[DOM_ATTRIBUTE]) input[DOM_ATTRIBUTE]._fire('');
	});

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) _findElements(node);
					});
				}
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
