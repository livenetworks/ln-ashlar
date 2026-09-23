/* Live Networks - lnTabs (hash-aware tabs — supports <button> and <a href="#nsKey:key"> triggers) */
import { dispatch, dispatchCancelable, hashGet, hashLinkClick, hashSet, registerComponent, attrSpec, defineAttrs, attrBool } from '../../ln-core';
import { deriveKeyFromTrigger, determineTabsMode, resolveActiveTabKey } from './tabs-model.js';

(function () {
	const DOM_SELECTOR = "data-ln-tabs";
	const DOM_ATTRIBUTE = "lnTabs";

	if (window[DOM_ATTRIBUTE] !== undefined && window[DOM_ATTRIBUTE] !== null) return;

	function _syncActive(el) {
		const key = el.getAttribute('data-ln-tabs-active');
		if (el[DOM_ATTRIBUTE]) el[DOM_ATTRIBUTE]._applyActive(key);
	}

	function _readTabsKey(el, name)     { return (el.getAttribute(name) || el.id || '').toLowerCase().trim(); }

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-tabs':         { type: 'marker', description: 'Mounts lnTabs component instance on tabs container' },
		'data-ln-tabs-active':  { effect: _syncActive, type: 'string', description: 'Active tab key identifier' },
		'data-ln-tabs-default': { type: 'string', description: 'Default fallback tab key when none selected' },
		'data-ln-tabs-focus':   { prop: 'autoFocus', read: attrBool, type: 'boolean', fallback: true, description: 'Whether to shift focus to newly activated tab panel' },
		'data-ln-tabs-key':     { prop: 'nsKey', read: _readTabsKey, type: 'string', description: 'Hash namespace key for URL hash synchronization' },
		'data-ln-tab':          { type: 'string', description: 'Tab trigger key identifier' },
		'data-ln-panel':        { type: 'string', description: 'Tab content panel key identifier matching corresponding tab' }
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	function _component(dom) { this.dom = dom; defineAttrs(this, dom, ATTR_SPEC); this.activeKey = null; _init.call(this); return this; }

	function _init() {
		this.tabs   = Array.from(this.dom.querySelectorAll("[data-ln-tab]"));
		this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));

		const triggerDescriptors = this.tabs.map(t => ({
			tagName: t.tagName,
			href: t.getAttribute('href')
		}));
		const modeInfo = determineTabsMode(triggerDescriptors, this.nsKey);
		this.hashEnabled = modeInfo.hashEnabled;

		if (modeInfo.warning === 'mixed') {
			console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom);
		} else if (modeInfo.warning === 'missing-namespace') {
			console.warn('[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.', this.dom);
		}

		this.mapTabs = {};
		this.mapPanels = {};
		for (const t of this.tabs) {
			const key = deriveKeyFromTrigger(t.getAttribute('data-ln-tab'), t.tagName, t.getAttribute('href'), this.nsKey);
			if (key) {
				this.mapTabs[key] = t;
			} else {
				console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', t);
			}
		}
		for (const p of this.panels) {
			const key = (p.getAttribute("data-ln-panel") || "").toLowerCase().trim();
			if (key) this.mapPanels[key] = p;
		}

		// Not a pure attribute mirror: falls back to the first tab key, which
		// only exists once mapTabs is built. A reader cannot reach instance state.
		this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim()
			|| Object.keys(this.mapTabs)[0] || "";

		const self = this;
		this._clickHandlers = [];
		for (const t of this.tabs) {
			if (t[DOM_ATTRIBUTE + 'Trigger']) continue;
			const handler = function (e) {
				const isAnchor = t.tagName === "A";
				if (!isAnchor && (e.ctrlKey || e.metaKey || e.button === 1)) return;
				const key = deriveKeyFromTrigger(t.getAttribute('data-ln-tab'), t.tagName, t.getAttribute('href'), self.nsKey);
				if (!key) return;
				if (isAnchor && !hashLinkClick(e)) return;
				if (self.hashEnabled) {
					if (hashGet(self.nsKey) === key) self.dom.setAttribute('data-ln-tabs-active', key);
					else hashSet(self.nsKey, key);
				} else {
					self.dom.setAttribute('data-ln-tabs-active', key);
				}
			};
			t.addEventListener("click", handler);
			t[DOM_ATTRIBUTE + 'Trigger'] = handler;
			self._clickHandlers.push({ el: t, handler: handler });
		}

		this._onRequestSelect = function (e) {
			const key = e.detail && (e.detail.key || e.detail.tab);
			if (key) self.select(key);
		};
		this.dom.addEventListener('ln-tabs:request-select', this._onRequestSelect);

		this._hashHandler = function () {
			if (!self.hashEnabled) return;
			const val = hashGet(self.nsKey);
			self.dom.setAttribute('data-ln-tabs-active', val !== null ? val : self.defaultKey);
		};

		if (this.hashEnabled) {
			window.addEventListener("hashchange", this._hashHandler);
			this._hashHandler();
		} else {
			const initialKey = resolveActiveTabKey(this.dom.getAttribute('data-ln-tabs-active'), Object.keys(this.mapPanels), this.defaultKey);
			this.dom.setAttribute('data-ln-tabs-active', initialKey);
		}
	}

	_component.prototype.select = function (key) {
		const k = (key + '').toLowerCase().trim();
		if (!k) return;
		if (this.hashEnabled) {
			if (hashGet(this.nsKey) === k) this.dom.setAttribute('data-ln-tabs-active', k);
			else hashSet(this.nsKey, k);
		} else {
			this.dom.setAttribute('data-ln-tabs-active', k);
		}
	};

	_component.prototype._applyActive = function (key) {
		key = resolveActiveTabKey(key, Object.keys(this.mapPanels), this.defaultKey);
		if (key === this.activeKey) return;

		const prevKey = this.activeKey;
		if (prevKey !== null) {
			const before = dispatchCancelable(this.dom, 'ln-tabs:before-change', {
				key: key,
				previousKey: prevKey,
				tab: this.mapTabs[key],
				panel: this.mapPanels[key],
				target: this.dom
			});
			if (before.defaultPrevented) {
				if (prevKey in this.mapPanels) {
					this.dom.setAttribute('data-ln-tabs-active', prevKey);
					if (this.hashEnabled && hashGet(this.nsKey) !== prevKey) {
						hashSet(this.nsKey, prevKey);
					}
				}
				return;
			}
		}

		this.activeKey = key;

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
		dispatch(this.dom, 'ln-tabs:change', {
			key: key,
			previousKey: prevKey,
			tab: this.mapTabs[key],
			panel: this.mapPanels[key],
			target: this.dom
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-tabs:request-select', this._onRequestSelect);
		for (const { el, handler } of this._clickHandlers) {
			el.removeEventListener("click", handler);
			delete el[DOM_ATTRIBUTE + 'Trigger'];
		}
		if (this.hashEnabled) {
			window.removeEventListener("hashchange", this._hashHandler);
		}
		dispatch(this.dom, 'ln-tabs:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-tabs', {
		attributes: ATTRIBUTES,
		persist: {
			attr: 'data-ln-tabs-active',
			hashActive: function (el) {
				const triggers = Array.from(el.querySelectorAll('[data-ln-tab]')).map(function (t) {
					return { tagName: t.tagName, href: t.getAttribute('href') };
				});
				const nsKey = (el.getAttribute('data-ln-tabs-key') || el.id || '').toLowerCase().trim();
				return determineTabsMode(triggers, nsKey).hashEnabled;
			}
		}
	});
})();
