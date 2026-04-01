/* Live Networks - lnTabs (hash-aware tabs via <a href="#key">) */
import { dispatch, guardBody } from '../ln-core';

(function () {
	const DOM_SELECTOR = "data-ln-tabs";
	const DOM_ATTRIBUTE = "lnTabs";

	if (window[DOM_ATTRIBUTE] !== undefined && window[DOM_ATTRIBUTE] !== null) return;

	function constructor(domRoot = document.body) { _findElements(domRoot); }

	function _findElements(root) {
		if (root.nodeType !== 1) return;
		const items = Array.from(root.querySelectorAll("[" + DOM_SELECTOR + "]"));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) items.push(root);
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) el[DOM_ATTRIBUTE] = new _component(el);
		}
	}

	function _parseHash() {
		const h = (location.hash || "").replace("#", "");
		const map = {};
		if (!h) return map;
		for (const part of h.split("&")) {
			const sep = part.indexOf(":");
			if (sep > 0) map[part.slice(0, sep)] = part.slice(sep + 1);
		}
		return map;
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

		this.defaultKey   = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim()
			|| Object.keys(this.mapTabs)[0] || "";
		this.autoFocus    = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
		this.nsKey        = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
		this.hashEnabled  = !!this.nsKey;

		const self = this;
		this._clickHandlers = [];
		for (const t of this.tabs) {
			if (t[DOM_ATTRIBUTE + 'Trigger']) continue;
			t[DOM_ATTRIBUTE + 'Trigger'] = true;
			const handler = function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				const key = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
				if (!key) return;
				if (self.hashEnabled) {
					const map = _parseHash();
					map[self.nsKey] = key;
					const newHash = Object.keys(map).map(function (k) { return k + ":" + map[k]; }).join("&");
					if (location.hash === "#" + newHash) self.activate(key);
					else location.hash = newHash;
				} else {
					self.activate(key);
				}
			};
			t.addEventListener("click", handler);
			self._clickHandlers.push({ el: t, handler: handler });
		}

		this._hashHandler = function () {
			if (!self.hashEnabled) return;
			const map = _parseHash();
			self.activate(self.nsKey in map ? map[self.nsKey] : self.defaultKey);
		};

		if (this.hashEnabled) {
			window.addEventListener("hashchange", this._hashHandler);
			this._hashHandler();
		} else {
			this.activate(this.defaultKey);
		}
	}

	_component.prototype.activate = function (key) {
		if (!key || !(key in this.mapPanels)) key = this.defaultKey;
		for (const k in this.mapTabs) {
			const btn = this.mapTabs[k];
			if (k === key) {
				btn.setAttribute("data-active", "");
				btn.setAttribute("aria-selected", "true");
			} else {
				btn.removeAttribute("data-active");
				btn.setAttribute("aria-selected", "false");
			}
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
		dispatch(this.dom, 'ln-tabs:change', { key: key, tab: this.mapTabs[key], panel: this.mapPanels[key] });
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		for (const { el, handler } of this._clickHandlers) {
			el.removeEventListener("click", handler);
		}
		if (this.hashEnabled) {
			window.removeEventListener("hashchange", this._hashHandler);
		}
		dispatch(this.dom, 'ln-tabs:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (const mutation of mutations) {
					if (mutation.type === 'attributes') { _findElements(mutation.target); continue; }
					for (const node of mutation.addedNodes) { _findElements(node); }
				}
			});
			observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [DOM_SELECTOR] });
		}, 'ln-tabs');
	}

	_domObserver();
	window[DOM_ATTRIBUTE] = constructor;
	constructor(document.body);
})();
