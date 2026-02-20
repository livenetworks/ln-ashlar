/* Live Networks - lnTabs (hash-aware tabs via <a href="#key">) */
(function () {
	const DOM_SELECTOR = "data-ln-tabs";
	const DOM_ATTRIBUTE = "lnTabs";

	if (window[DOM_ATTRIBUTE] !== undefined && window[DOM_ATTRIBUTE] !== null) return;

	function constructor(domRoot = document.body) { _findElements(domRoot); }

	function _findElements(root) {
		if (root.nodeType !== 1) return;
		let items = Array.from(root.querySelectorAll("[" + DOM_SELECTOR + "]"));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) items.push(root);
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) el[DOM_ATTRIBUTE] = new _component(el);
		});
	}

	function _component(dom) { this.dom = dom; _init.call(this); return this; }

	function _init() {
		this.tabs   = Array.from(this.dom.querySelectorAll("[data-ln-tab]"));
		this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));

		this.mapTabs = {};
		this.mapPanels = {};
		for (const t of this.tabs) {
			const key = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
			if (key) this.mapTabs[key] = t;
		}
		for (const p of this.panels) {
			const key = (p.getAttribute("data-ln-panel") || "").toLowerCase().trim();
			if (key) this.mapPanels[key] = p;
		}

		this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim()
			|| Object.keys(this.mapTabs)[0] || "";
		this.autoFocus  = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";

		this.tabs.forEach((t) => {
			t.addEventListener("click", () => {
				const key = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
				if (!key) return;
				if (location.hash === "#" + key) {
					this.activate(key);
				} else {
					location.hash = key;
				}
			});
		});

		this._hashHandler = () => {
			const h = (location.hash || "").replace("#", "").toLowerCase();
			this.activate(h || this.defaultKey);
		};
		window.addEventListener("hashchange", this._hashHandler);

		this._hashHandler(); // initial
	}

	_component.prototype.activate = function (key) {
		if (!key || !(key in this.mapPanels)) key = this.defaultKey;
		for (const k in this.mapTabs) {
			const btn = this.mapTabs[k];
			const active = (k === key);
			btn.setAttribute("data-active", active ? "true" : "false");
			btn.setAttribute("aria-selected", active ? "true" : "false");
		}
		for (const k in this.mapPanels) {
			const panel = this.mapPanels[k];
			const show = (k === key);
			panel.classList.toggle("hidden", !show);
			panel.setAttribute("aria-hidden", show ? "false" : "true");
		}
		if (this.autoFocus) {
			const first = this.mapPanels[key]?.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
			if (first) setTimeout(() => first.focus({ preventScroll: true }), 0);
		}
	};

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(function (node) { _findElements(node); });
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	_domObserver();
	window[DOM_ATTRIBUTE] = constructor;
	constructor(document.body);
})();
