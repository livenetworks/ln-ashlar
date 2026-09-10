if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const E = {};
function X(t, e) {
  E[t] || (E[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const n = E[t];
  return n ? n.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function J(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function Y(t, e, n) {
  const a = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: a
  }));
}
function B(t, e) {
  if (!t || !e) return t;
  const n = t.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < n.length; l++) {
    const i = n[l], d = i.getAttribute("data-ln-field");
    e[d] != null && (i.textContent = e[d]);
  }
  const a = t.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < a.length; l++) {
    const i = a[l], d = i.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < d.length; s++) {
      const u = d[s].trim().split(":");
      if (u.length !== 2) continue;
      const c = u[0].trim(), f = u[1].trim();
      e[f] != null && i.setAttribute(c, e[f]);
    }
  }
  const o = t.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < o.length; l++) {
    const i = o[l], d = i.getAttribute("data-ln-show");
    d in e && i.classList.toggle("hidden", !e[d]);
  }
  const r = t.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < r.length; l++) {
    const i = r[l], d = i.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < d.length; s++) {
      const u = d[s].trim().split(":");
      if (u.length !== 2) continue;
      const c = u[0].trim(), f = u[1].trim();
      f in e && i.classList.toggle(c, !!e[f]);
    }
  }
  return t;
}
function Z(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const n = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let a = 0; a < n.length; a++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", n[a], e ?? null), n[a].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      B(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let n = 0; n < e.length; n++)
        e[n].textContent = "";
    }
})));
function W(t, e) {
  if (!t || !e) return t;
  const n = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; n.nextNode(); ) {
    const r = n.currentNode;
    r.textContent.indexOf("{{") !== -1 && (r.textContent = r.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, i) {
        return e[i] !== void 0 ? e[i] : "";
      }
    ));
  }
  const a = function(r, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, o = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && o.push(t);
  for (let r = 0; r < o.length; r++) {
    const l = o[r], i = l.attributes;
    for (let d = 0; d < i.length; d++) {
      const s = i[d];
      s.value.indexOf("{{") !== -1 && l.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return t;
}
function tt(t, e, n, a, o, r) {
  const l = {};
  for (let d = 0; d < t.children.length; d++) {
    const s = t.children[d], u = s.getAttribute("data-ln-render-key");
    u && (l[u] = s);
  }
  const i = document.createDocumentFragment();
  for (let d = 0; d < e.length; d++) {
    const s = e[d], u = String(a(s));
    let c = l[u];
    if (c)
      o(c, s, d);
    else {
      const f = X(n, r);
      if (!f || (W(f, s), c = f.firstElementChild, !c)) continue;
      c.setAttribute("data-ln-render-key", u), o(c, s, d);
    }
    i.appendChild(c);
  }
  t.textContent = "", t.appendChild(i);
}
function y(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      y(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function O(t, e, n, a) {
  if (t.nodeType !== 1) return;
  const r = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = Array.from(t.querySelectorAll(r));
  t.matches && t.matches(r) && l.push(t);
  for (const i of l)
    i[n] || (i[n] = new a(i));
}
function et() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, y(function() {
    new MutationObserver(function() {
      Y(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function R() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function V(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function F() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [] }, window.lnCore._attrRegistry;
}
function H(t) {
  const e = F(), n = t.observed || [];
  for (let a = 0; a < n.length; a++) {
    const o = n[a];
    e.byAttr.has(o) || e.byAttr.set(o, []), e.byAttr.get(o).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t);
}
function nt(t) {
  const e = t.target, n = t.attributeName;
  if (t.oldValue === e.getAttribute(n)) return;
  const a = F(), o = a.byAttr.get(n);
  if (window.lnCore._debugSink && (n.indexOf("data-ln-") === 0 || o) && window.lnCore._debugSink("attr", n, e, { oldValue: t.oldValue, newValue: e.getAttribute(n) }), n.indexOf("data-ln-") === 0)
    for (let r = 0; r < a.reactive.length; r++) {
      const l = a.reactive[r];
      if (!e[l.attribute]) continue;
      const i = l.effects && l.effects[n];
      i ? i(e, n, t.oldValue) : l.onAttrChange && l.onAttrChange(e, n, t.oldValue);
    }
  if (o)
    for (let r = 0; r < o.length; r++) {
      const l = o[r];
      if (l.handler) {
        l.handler(e, n, t.oldValue);
        continue;
      }
      l.onAttributeChange && e[l.attribute] ? l.onAttributeChange(e, n) : (O(e, l.selector, l.attribute, l.ComponentFn), l.onInit && l.onInit(e));
    }
}
function U() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, y(function() {
    new MutationObserver(function(e) {
      for (let n = 0; n < e.length; n++)
        nt(e[n]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function at(t, e) {
  H({ observed: t, handler: e }), U();
}
function lt(t, e, n, a, o = {}) {
  const r = o.extraAttributes || [], l = o.onAttributeChange || null, i = o.onSubtreeChange || null, d = o.onInit || null, s = o.onAttrChange || null, u = o.effects || null;
  function c(v) {
    const m = v || document.body;
    O(m, t, e, n), d && d(m);
  }
  const f = [];
  if (t.indexOf("[") !== -1) {
    const v = /\[([\w-]+)/g;
    let m;
    for (; (m = v.exec(t)) !== null; )
      f.push(m[1]);
  } else
    f.push(t);
  H({
    selector: t,
    attribute: e,
    ComponentFn: n,
    onInit: d,
    observed: f.concat(r),
    onAttributeChange: l,
    onAttrChange: s,
    effects: u
  }), U(), y(function() {
    new MutationObserver(function(m) {
      for (let S = 0; S < m.length; S++) {
        const p = m[S];
        if (p.type === "childList") {
          if (i && p.target) {
            const h = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", x = p.target.nodeType === 1 ? p.target.matches(h) ? p.target : p.target.closest(h) : p.target.parentElement ? p.target.parentElement.closest(h) : null;
            x && i(x, p);
          }
          for (let w = 0; w < p.addedNodes.length; w++) {
            const h = p.addedNodes[w];
            h.nodeType === 1 && (O(h, t, e, n), d && d(h));
          }
          for (let w = 0; w < p.removedNodes.length; w++) {
            const h = p.removedNodes[w];
            if (h.nodeType === 1) {
              const M = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", _ = Array.from(h.querySelectorAll(M));
              h.matches && h.matches(M) && _.push(h);
              for (let k = 0; k < _.length; k++) {
                const $ = _[k];
                if (!document.contains($)) {
                  const D = $[e];
                  D && typeof D.destroy == "function" && D.destroy();
                }
              }
            }
          }
        }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, a), window[e] = c;
  function C() {
    R() > 0 ? V(function() {
      c(document.body);
    }) : c(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", C) : C(), c;
}
const z = {};
function ot(t, e) {
  z[t] = e;
}
function rt(t) {
  return z[t] || { ingress: (e) => e, egress: (e) => e };
}
const G = {};
function Q(t, e) {
  if (!t || typeof e != "object") return;
  const n = t.toLowerCase().split("-")[0];
  G[n] = e;
}
function dt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return G[e] || null;
}
Q("mk", {
  monthsLong: [
    "јануари",
    "февруари",
    "март",
    "април",
    "мај",
    "јуни",
    "јули",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември"
  ],
  monthsShort: [
    "јан",
    "фев",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "септ",
    "окт",
    "ноем",
    "дек"
  ],
  daysLong: [
    "недела",
    "понеделник",
    "вторник",
    "среда",
    "четврток",
    "петок",
    "сабота"
  ],
  daysShort: [
    "нед",
    "пон",
    "вт",
    "ср",
    "чет",
    "пет",
    "саб"
  ]
});
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ot, window.lnCore.getDataMapper = rt, window.lnCore.registerLocaleFallback = Q, window.lnCore.getLocaleFallback = dt, window.lnCore.fillTemplate = W, window.lnCore.fill = B, window.lnCore.lnFill = Z, window.lnCore.renderList = tt, window.lnCore.ensureLocaleObserver = et);
function K(t) {
  return (t || "").replace(/^#/, "");
}
function q(t) {
  const e = t === void 0 ? location.hash : t, n = {}, a = K(e);
  if (!a) return n;
  const o = a.split("&");
  for (let r = 0; r < o.length; r++) {
    const l = o[r];
    if (!l) continue;
    const i = l.indexOf(":"), d = i > -1 ? l.slice(0, i) : l, s = i > -1 ? l.slice(i + 1) : "";
    if (d)
      try {
        n[d] = decodeURIComponent(s);
      } catch {
        n[d] = s;
      }
  }
  return n;
}
function it(t) {
  if (!t) return null;
  const e = q();
  return t in e ? e[t] : null;
}
function st(t, e) {
  if (!t) return;
  const n = q();
  e == null ? delete n[t] : n[t] = String(e);
  const o = Object.keys(n).map(function(r) {
    const l = n[r];
    return l === "" ? r : r + ":" + encodeURIComponent(l);
  }).join("&");
  K(location.hash) !== o && (location.hash = o);
}
function ut(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function ct(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const n = t.getAttribute("data-ln-hash");
  if (n && n.trim() !== "") return n.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "-" + e : a : e || null;
}
function ft(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function pt(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function ht(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function mt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const n = t.slice(0, e), a = t.slice(e + 1), o = a ? a.split(",").map(function(r) {
    try {
      return decodeURIComponent(r);
    } catch {
      return r;
    }
  }).filter(Boolean) : [];
  return { key: n, values: o };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = q, window.lnCore.hashGet = it, window.lnCore.hashSet = st, window.lnCore.hashLinkClick = ut, window.lnCore.resolveHashNamespace = ct, window.lnCore.hashSortEncode = ft, window.lnCore.hashSortDecode = pt, window.lnCore.hashFilterEncode = ht, window.lnCore.hashFilterDecode = mt);
const T = /* @__PURE__ */ new Set([
  "data-ln-accordion",
  "data-ln-ajax",
  "data-ln-api-base-url",
  "data-ln-api-connector",
  "data-ln-api-connector-query-debounce",
  "data-ln-api-headers",
  "data-ln-api-param-limit",
  "data-ln-api-param-offset",
  "data-ln-api-param-search",
  "data-ln-api-param-sort-dir",
  "data-ln-api-param-sort-field",
  "data-ln-api-path",
  "data-ln-api-queue",
  "data-ln-api-queue-online",
  "data-ln-attr",
  "data-ln-autoresize",
  "data-ln-autosave",
  "data-ln-autosave-clear",
  "data-ln-autosave-debounce-input",
  "data-ln-autosave-exclude",
  "data-ln-chart",
  "data-ln-chart-area",
  "data-ln-chart-count",
  "data-ln-chart-empty",
  "data-ln-chart-labels",
  "data-ln-chart-line",
  "data-ln-chart-max",
  "data-ln-chart-min",
  "data-ln-chart-padding",
  "data-ln-chart-plot",
  "data-ln-chart-sort",
  "data-ln-chart-source",
  "data-ln-chart-type",
  "data-ln-chart-x",
  "data-ln-chart-y",
  "data-ln-chart-zero",
  "data-ln-circular-progress",
  "data-ln-circular-progress-label",
  "data-ln-circular-progress-max",
  "data-ln-class",
  "data-ln-confirm",
  "data-ln-confirm-active",
  "data-ln-confirm-idle",
  "data-ln-confirm-timeout",
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-dict",
  "data-ln-data-coordinator-no-autosync",
  "data-ln-data-coordinator-stale",
  "data-ln-data-mapper",
  "data-ln-data-store",
  "data-ln-data-store-frozen",
  "data-ln-data-store-indexes",
  "data-ln-data-store-no-autosync",
  "data-ln-data-store-no-local-query",
  "data-ln-data-store-search-fields",
  "data-ln-data-store-stale",
  "data-ln-data-store-window",
  "data-ln-data-store-window-page",
  "data-ln-date",
  "data-ln-date-dict",
  "data-ln-date-dict-key",
  "data-ln-date-field",
  "data-ln-date-format",
  "data-ln-date-label",
  "data-ln-date-locale",
  "data-ln-debug",
  "data-ln-dropdown",
  "data-ln-dropdown-menu",
  "data-ln-dropdown-placement",
  "data-ln-dropdown-position",
  "data-ln-editor",
  "data-ln-editor-action",
  "data-ln-editor-source",
  "data-ln-empty",
  "data-ln-empty-state",
  "data-ln-empty-when",
  "data-ln-error",
  "data-ln-external-link",
  "data-ln-field",
  "data-ln-fill-as",
  "data-ln-fill-form",
  "data-ln-fill-id",
  "data-ln-fillable",
  "data-ln-filter",
  "data-ln-filter-col",
  "data-ln-filter-hide",
  "data-ln-filter-key",
  "data-ln-filter-options",
  "data-ln-filter-reset",
  "data-ln-filter-search",
  "data-ln-filter-value",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
  "data-ln-form-scope",
  "data-ln-hash",
  "data-ln-include",
  "data-ln-item",
  "data-ln-item-action",
  "data-ln-item-id",
  "data-ln-item-select",
  "data-ln-key",
  "data-ln-key-allow-input",
  "data-ln-key-for",
  "data-ln-key-modifier",
  "data-ln-key-target",
  "data-ln-link",
  "data-ln-list",
  "data-ln-list-body",
  "data-ln-list-count",
  "data-ln-list-empty",
  "data-ln-list-field",
  "data-ln-list-filtered",
  "data-ln-list-select-all",
  "data-ln-list-selectable",
  "data-ln-list-selected",
  "data-ln-list-source",
  "data-ln-list-total",
  "data-ln-list-window",
  "data-ln-list-window-page",
  "data-ln-list-window-threshold",
  "data-ln-mapper",
  "data-ln-modal",
  "data-ln-modal-close",
  "data-ln-modal-for",
  "data-ln-modal-mode",
  "data-ln-modal-when",
  "data-ln-nav",
  "data-ln-nav-exact",
  "data-ln-number",
  "data-ln-number-decimals",
  "data-ln-number-max",
  "data-ln-number-min",
  "data-ln-options",
  "data-ln-options-label",
  "data-ln-options-value",
  "data-ln-outlet",
  "data-ln-panel",
  "data-ln-persist",
  "data-ln-popover",
  "data-ln-popover-for",
  "data-ln-popover-placement",
  "data-ln-popover-position",
  "data-ln-progress",
  "data-ln-progress-max",
  "data-ln-render-key",
  "data-ln-route",
  "data-ln-route-keep",
  "data-ln-route-target",
  "data-ln-route-title",
  "data-ln-router-hydrate",
  "data-ln-search",
  "data-ln-search-clear",
  "data-ln-search-clear-for",
  "data-ln-search-exclude",
  "data-ln-search-fields",
  "data-ln-search-for",
  "data-ln-search-hide",
  "data-ln-search-items",
  "data-ln-show",
  "data-ln-slug-from",
  "data-ln-sort",
  "data-ln-sort-dir",
  "data-ln-sort-field",
  "data-ln-sort-icon",
  "data-ln-sort-items",
  "data-ln-sort-state",
  "data-ln-sortable",
  "data-ln-sortable-handle",
  "data-ln-stat",
  "data-ln-stat-card",
  "data-ln-stat-filter",
  "data-ln-stat-label",
  "data-ln-stat-trend",
  "data-ln-stat-value",
  "data-ln-step",
  "data-ln-step-label",
  "data-ln-stepper",
  "data-ln-store",
  "data-ln-tab",
  "data-ln-table",
  "data-ln-table-body",
  "data-ln-table-cell-attr",
  "data-ln-table-clear",
  "data-ln-table-clear-all",
  "data-ln-table-col",
  "data-ln-table-col-filter",
  "data-ln-table-col-select",
  "data-ln-table-col-sort",
  "data-ln-table-coordinator",
  "data-ln-table-count",
  "data-ln-table-dict",
  "data-ln-table-empty",
  "data-ln-table-empty-when",
  "data-ln-table-filter-col",
  "data-ln-table-filtered",
  "data-ln-table-row",
  "data-ln-table-row-action",
  "data-ln-table-row-id",
  "data-ln-table-row-select",
  "data-ln-table-select-all-label",
  "data-ln-table-selectable",
  "data-ln-table-selected",
  "data-ln-table-sort",
  "data-ln-table-source",
  "data-ln-table-total",
  "data-ln-table-window",
  "data-ln-table-window-page",
  "data-ln-table-window-threshold",
  "data-ln-tabs",
  "data-ln-tabs-active",
  "data-ln-tabs-default",
  "data-ln-tabs-focus",
  "data-ln-tabs-key",
  "data-ln-template",
  "data-ln-time",
  "data-ln-time-locale",
  "data-ln-toast",
  "data-ln-toast-close",
  "data-ln-toast-item",
  "data-ln-toast-max",
  "data-ln-toast-timeout",
  "data-ln-toast-when",
  "data-ln-toggle",
  "data-ln-toggle-action",
  "data-ln-toggle-for",
  "data-ln-tooltip",
  "data-ln-tooltip-enhance",
  "data-ln-tooltip-enhanced",
  "data-ln-tooltip-placement",
  "data-ln-tooltip-position",
  "data-ln-translatable",
  "data-ln-translatable-lang",
  "data-ln-translations",
  "data-ln-translations-active",
  "data-ln-translations-add",
  "data-ln-translations-default",
  "data-ln-translations-lang",
  "data-ln-translations-locales",
  "data-ln-translations-placeholder",
  "data-ln-translations-prefix",
  "data-ln-translations-remove-label",
  "data-ln-ui-coordinator",
  "data-ln-ui-coordinator-dict",
  "data-ln-upload",
  "data-ln-upload-accept",
  "data-ln-upload-action",
  "data-ln-upload-delete",
  "data-ln-upload-dict",
  "data-ln-upload-ext",
  "data-ln-upload-file-field",
  "data-ln-upload-id",
  "data-ln-upload-ids-field",
  "data-ln-upload-item",
  "data-ln-upload-list",
  "data-ln-upload-local-id",
  "data-ln-upload-max-files",
  "data-ln-upload-max-size",
  "data-ln-upload-progress",
  "data-ln-upload-size",
  "data-ln-upload-state",
  "data-ln-upload-zone",
  "data-ln-validate",
  "data-ln-validate-error",
  "data-ln-validate-errors",
  "data-ln-value",
  "data-ln-websocket-connector"
]);
function wt(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const n = [];
  for (let a = 0; a <= e.length; a++) n[a] = [a];
  for (let a = 0; a <= t.length; a++) n[0][a] = a;
  for (let a = 1; a <= e.length; a++)
    for (let o = 1; o <= t.length; o++)
      e.charAt(a - 1) === t.charAt(o - 1) ? n[a][o] = n[a - 1][o - 1] : n[a][o] = Math.min(
        n[a - 1][o - 1] + 1,
        n[a][o - 1] + 1,
        n[a - 1][o] + 1
      );
  return n[e.length][t.length];
}
function bt(t, e = T) {
  if (e.has(t)) return null;
  let n = null, a = 1 / 0;
  for (const r of e) {
    const l = wt(t, r);
    l < a && (a = l, n = r);
  }
  const o = Math.max(3, Math.floor(t.length * 0.4));
  return a <= o ? n : null;
}
function P(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function gt(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], o = [n, ...n.querySelectorAll("*")];
  for (let r = 0; r < o.length; r++) {
    const l = o[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const d = l.attributes[i];
        if (d.name.startsWith("data-ln-") && d.name.endsWith("-for")) {
          const s = (d.value || "").trim();
          if (!s) {
            a.push({
              type: "id-empty",
              element: l,
              attribute: d.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          e.getElementById(s) || e.querySelector("#" + P(s)) || a.push({
            type: "id-unresolved",
            element: l,
            attribute: d.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${d.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function yt(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], o = [n, ...n.querySelectorAll("*")];
  for (let r = 0; r < o.length; r++) {
    const l = o[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const d = l.attributes[i];
        if (d.name.startsWith("data-ln-") && (d.name.endsWith("-source") || d.name.endsWith("-store")) && d.name !== "data-ln-data-store") {
          const u = (d.value || "").trim();
          if (!u) {
            a.push({
              type: "store-empty",
              element: l,
              attribute: d.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          const c = P(u), f = e.querySelector(`[data-ln-data-store="${c}"], [data-ln-store="${c}"]`), C = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(u);
          !f && !C && a.push({
            type: "store-unresolved",
            element: l,
            attribute: d.name,
            storeName: u,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${d.name}="${u}"> targets store "${u}", but no [data-ln-data-store="${u}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function Ct(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const n = [], a = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && a.unshift(e);
  const o = /* @__PURE__ */ new Map();
  for (let r = 0; r < a.length; r++) {
    const l = a[r], i = (l.getAttribute("data-ln-data-store") || "").trim();
    i && (o.has(i) || o.set(i, []), o.get(i).push(l));
  }
  for (const [r, l] of o.entries())
    l.length > 1 && n.push({
      type: "store-duplicate",
      storeName: r,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${r}". Store names must be unique across the document.`
    });
  return n;
}
function vt(t = document, e = T) {
  const n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], o = [n, ...n.querySelectorAll("*")];
  for (let r = 0; r < o.length; r++) {
    const l = o[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const d = l.attributes[i];
        if (d.name.startsWith("data-ln-") && !e.has(d.name)) {
          const s = bt(d.name, e), u = s ? ` Did you mean "${s}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: l,
            attribute: d.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${d.name}" on <${l.tagName.toLowerCase()}>.${u}`
          });
        }
      }
  }
  return a;
}
function L(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const n = e.validAttributes || T, a = gt(t), o = yt(t), r = Ct(t), l = vt(t, n), i = [
    ...a,
    ...o,
    ...r,
    ...l
  ];
  if (!e.silent)
    for (let d = 0; d < i.length; d++)
      console.warn(i[d].message);
  return {
    idIssues: a,
    storeIssues: o,
    uniquenessIssues: r,
    spellingIssues: l,
    total: i.length
  };
}
let g = null;
function A(t = typeof document < "u" ? document : null, e = 50, n = null) {
  if (!t) return;
  g && (clearTimeout(g), g = null);
  function a() {
    g = setTimeout(() => {
      g = null;
      const o = L(t);
      n && n(o);
    }, e);
  }
  R() > 0 ? V(a) : a();
}
function N(t, e, n, a) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", n), console.log("detail", a), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", n), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let b = [];
function At() {
  b = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && b.push(document.body);
}
function St(t) {
  for (let e = 0; e < b.length; e++)
    if (b[e].contains(t)) return !0;
  return !1;
}
function xt(t, e, n, a) {
  if (n === window || n === document) {
    b.indexOf(document.body) !== -1 && N(t, e, n, a);
    return;
  }
  St(n) && N(t, e, n, a);
}
function I() {
  At(), J(b.length > 0 ? xt : null);
}
function j() {
  I();
}
function _t() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, y(function() {
    I(), at(["data-ln-debug"], I);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  _t();
  function n(o) {
    return this.dom = o, A(o.ownerDocument || document), j(), this;
  }
  n.prototype.verify = function(o, r) {
    return L(o || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, n.prototype.destroy = function() {
    delete this.dom[e], j();
  };
  const a = lt(t, e, n, "ln-debug", {
    onInit: function(o) {
      typeof document < "u" && A(o && o.ownerDocument ? o.ownerDocument : document);
    },
    onSubtreeChange: function(o) {
      typeof document < "u" && A(o && o.ownerDocument ? o.ownerDocument : document);
    }
  });
  a.verify = function(o, r) {
    return L(o || document, r);
  }, a.schedule = function(o, r, l) {
    return A(o || document, r, l);
  };
})();
export {
  A as scheduleVerification,
  L as verifyDOM
};
