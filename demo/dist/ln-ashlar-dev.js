if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const S = {};
function R(t, e) {
  S[t] || (S[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const a = S[t];
  return a ? a.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function _(t, e) {
  if (!t || !e) return t;
  const a = t.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < a.length; l++) {
    const i = a[l], o = i.getAttribute("data-ln-field");
    e[o] != null && (i.textContent = e[o]);
  }
  const n = t.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < n.length; l++) {
    const i = n[l], o = i.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const f = c[0].trim(), m = c[1].trim();
      e[m] != null && i.setAttribute(f, e[m]);
    }
  }
  const d = t.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < d.length; l++) {
    const i = d[l], o = i.getAttribute("data-ln-show");
    o in e && i.classList.toggle("hidden", !e[o]);
  }
  const r = t.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < r.length; l++) {
    const i = r[l], o = i.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const f = c[0].trim(), m = c[1].trim();
      m in e && i.classList.toggle(f, !!e[m]);
    }
  }
  return t;
}
function U(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  const a = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let n = 0; n < a.length; n++)
    a[n].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      _(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let a = 0; a < e.length; a++)
        e[a].textContent = "";
    }
})));
function T(t, e) {
  if (!t || !e) return t;
  const a = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; a.nextNode(); ) {
    const r = a.currentNode;
    r.textContent.indexOf("{{") !== -1 && (r.textContent = r.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, i) {
        return e[i] !== void 0 ? e[i] : "";
      }
    ));
  }
  const n = function(r, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, d = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && d.push(t);
  for (let r = 0; r < d.length; r++) {
    const l = d[r], i = l.attributes;
    for (let o = 0; o < i.length; o++) {
      const s = i[o];
      s.value.indexOf("{{") !== -1 && l.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, n));
    }
  }
  return t;
}
function H(t, e, a, n, d, r) {
  const l = {};
  for (let o = 0; o < t.children.length; o++) {
    const s = t.children[o], c = s.getAttribute("data-ln-render-key");
    c && (l[c] = s);
  }
  const i = document.createDocumentFragment();
  for (let o = 0; o < e.length; o++) {
    const s = e[o], c = String(n(s));
    let f = l[c];
    if (f)
      d(f, s, o);
    else {
      const m = R(a, r);
      if (!m || (T(m, s), f = m.firstElementChild, !f)) continue;
      f.setAttribute("data-ln-render-key", c), d(f, s, o);
    }
    i.appendChild(f);
  }
  t.textContent = "", t.appendChild(i);
}
function k(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      k(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function D(t, e, a, n) {
  if (t.nodeType !== 1) return;
  const r = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = Array.from(t.querySelectorAll(r));
  t.matches && t.matches(r) && l.push(t);
  for (const i of l)
    i[a] || (i[a] = new n(i));
}
function z() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, k(function() {
    new MutationObserver(function() {
      document.dispatchEvent(new CustomEvent("ln-core:locale-change", {
        bubbles: !0,
        detail: {}
      }));
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function $() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function M(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Q(t, e, a, n, d = {}) {
  const r = d.extraAttributes || [], l = d.onAttributeChange || null, i = d.onSubtreeChange || null, o = d.onInit || null;
  function s(f) {
    const m = f || document.body;
    D(m, t, e, a), o && o(m);
  }
  k(function() {
    const f = new MutationObserver(function(w) {
      for (let b = 0; b < w.length; b++) {
        const u = w[b];
        if (u.type === "childList") {
          if (i && u.target) {
            const p = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", C = u.target.nodeType === 1 ? u.target.matches(p) ? u.target : u.target.closest(p) : u.target.parentElement ? u.target.parentElement.closest(p) : null;
            C && i(C, u);
          }
          for (let h = 0; h < u.addedNodes.length; h++) {
            const p = u.addedNodes[h];
            p.nodeType === 1 && (D(p, t, e, a), o && o(p));
          }
          for (let h = 0; h < u.removedNodes.length; h++) {
            const p = u.removedNodes[h];
            if (p.nodeType === 1) {
              const I = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", x = Array.from(p.querySelectorAll(I));
              p.matches && p.matches(I) && x.push(p);
              for (let v = 0; v < x.length; v++) {
                const O = x[v];
                if (!document.contains(O)) {
                  const A = O[e];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else u.type === "attributes" && (l && u.target[e] ? l(u.target, u.attributeName) : (D(u.target, t, e, a), o && o(u.target)));
      }
    });
    let m = [];
    if (t.indexOf("[") !== -1) {
      const w = /\[([\w-]+)/g;
      let b;
      for (; (b = w.exec(t)) !== null; )
        m.push(b[1]);
    } else
      m.push(t);
    f.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: m.concat(r)
    });
  }, n), window[e] = s;
  function c() {
    $() > 0 ? M(function() {
      s(document.body);
    }) : s(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c(), s;
}
const N = {};
function K(t, e) {
  N[t] = e;
}
function G(t) {
  return N[t] || { ingress: (e) => e, egress: (e) => e };
}
const j = {};
function W(t, e) {
  if (!t || typeof e != "object") return;
  const a = t.toLowerCase().split("-")[0];
  j[a] = e;
}
function V(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return j[e] || null;
}
W("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = K, window.lnCore.getDataMapper = G, window.lnCore.registerLocaleFallback = W, window.lnCore.getLocaleFallback = V, window.lnCore.fillTemplate = T, window.lnCore.fill = _, window.lnCore.lnFill = U, window.lnCore.renderList = H, window.lnCore.ensureLocaleObserver = z);
function B(t) {
  return (t || "").replace(/^#/, "");
}
function L(t) {
  const e = t === void 0 ? location.hash : t, a = {}, n = B(e);
  if (!n) return a;
  const d = n.split("&");
  for (let r = 0; r < d.length; r++) {
    const l = d[r];
    if (!l) continue;
    const i = l.indexOf(":"), o = i > -1 ? l.slice(0, i) : l, s = i > -1 ? l.slice(i + 1) : "";
    if (o)
      try {
        a[o] = decodeURIComponent(s);
      } catch {
        a[o] = s;
      }
  }
  return a;
}
function P(t) {
  if (!t) return null;
  const e = L();
  return t in e ? e[t] : null;
}
function X(t, e) {
  if (!t) return;
  const a = L();
  e == null ? delete a[t] : a[t] = String(e);
  const d = Object.keys(a).map(function(r) {
    const l = a[r];
    return l === "" ? r : r + ":" + encodeURIComponent(l);
  }).join("&");
  B(location.hash) !== d && (location.hash = d);
}
function J(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function Y(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const a = t.getAttribute("data-ln-hash");
  if (a && a.trim() !== "") return a.trim();
  const n = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return n ? e ? n + "-" + e : n : e || null;
}
function Z(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function tt(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function et(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function nt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const a = t.slice(0, e), n = t.slice(e + 1), d = n ? n.split(",").map(function(r) {
    try {
      return decodeURIComponent(r);
    } catch {
      return r;
    }
  }).filter(Boolean) : [];
  return { key: a, values: d };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = L, window.lnCore.hashGet = P, window.lnCore.hashSet = X, window.lnCore.hashLinkClick = J, window.lnCore.resolveHashNamespace = Y, window.lnCore.hashSortEncode = Z, window.lnCore.hashSortDecode = tt, window.lnCore.hashFilterEncode = et, window.lnCore.hashFilterDecode = nt);
const q = /* @__PURE__ */ new Set([
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
  "data-ln-translations-lang",
  "data-ln-translations-locales",
  "data-ln-translations-prefix",
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
function at(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const a = [];
  for (let n = 0; n <= e.length; n++) a[n] = [n];
  for (let n = 0; n <= t.length; n++) a[0][n] = n;
  for (let n = 1; n <= e.length; n++)
    for (let d = 1; d <= t.length; d++)
      e.charAt(n - 1) === t.charAt(d - 1) ? a[n][d] = a[n - 1][d - 1] : a[n][d] = Math.min(
        a[n - 1][d - 1] + 1,
        a[n][d - 1] + 1,
        a[n - 1][d] + 1
      );
  return a[e.length][t.length];
}
function lt(t, e = q) {
  if (e.has(t)) return null;
  let a = null, n = 1 / 0;
  for (const r of e) {
    const l = at(t, r);
    l < n && (n = l, a = r);
  }
  const d = Math.max(3, Math.floor(t.length * 0.4));
  return n <= d ? a : null;
}
function F(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function ot(t = document) {
  const e = t.ownerDocument || t, a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const n = [], d = [a, ...a.querySelectorAll("*")];
  for (let r = 0; r < d.length; r++) {
    const l = d[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const o = l.attributes[i];
        if (o.name.startsWith("data-ln-") && o.name.endsWith("-for")) {
          const s = (o.value || "").trim();
          if (!s) {
            n.push({
              type: "id-empty",
              element: l,
              attribute: o.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          e.getElementById(s) || e.querySelector("#" + F(s)) || n.push({
            type: "id-unresolved",
            element: l,
            attribute: o.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${o.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return n;
}
function dt(t = document) {
  const e = t.ownerDocument || t, a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const n = [], d = [a, ...a.querySelectorAll("*")];
  for (let r = 0; r < d.length; r++) {
    const l = d[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const o = l.attributes[i];
        if (o.name.startsWith("data-ln-") && (o.name.endsWith("-source") || o.name.endsWith("-store")) && o.name !== "data-ln-data-store") {
          const c = (o.value || "").trim();
          if (!c) {
            n.push({
              type: "store-empty",
              element: l,
              attribute: o.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          const f = F(c), m = e.querySelector(`[data-ln-data-store="${f}"], [data-ln-store="${f}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !m && !w && n.push({
            type: "store-unresolved",
            element: l,
            attribute: o.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${o.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return n;
}
function rt(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const a = [], n = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && n.unshift(e);
  const d = /* @__PURE__ */ new Map();
  for (let r = 0; r < n.length; r++) {
    const l = n[r], i = (l.getAttribute("data-ln-data-store") || "").trim();
    i && (d.has(i) || d.set(i, []), d.get(i).push(l));
  }
  for (const [r, l] of d.entries())
    l.length > 1 && a.push({
      type: "store-duplicate",
      storeName: r,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${r}". Store names must be unique across the document.`
    });
  return a;
}
function it(t = document, e = q) {
  const a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const n = [], d = [a, ...a.querySelectorAll("*")];
  for (let r = 0; r < d.length; r++) {
    const l = d[r];
    if (l.attributes)
      for (let i = 0; i < l.attributes.length; i++) {
        const o = l.attributes[i];
        if (o.name.startsWith("data-ln-") && !e.has(o.name)) {
          const s = lt(o.name, e), c = s ? ` Did you mean "${s}"?` : "";
          n.push({
            type: "attribute-unknown",
            element: l,
            attribute: o.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${o.name}" on <${l.tagName.toLowerCase()}>.${c}`
          });
        }
      }
  }
  return n;
}
function E(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const a = e.validAttributes || q, n = ot(t), d = dt(t), r = rt(t), l = it(t, a), i = [
    ...n,
    ...d,
    ...r,
    ...l
  ];
  if (!e.silent)
    for (let o = 0; o < i.length; o++)
      console.warn(i[o].message);
  return {
    idIssues: n,
    storeIssues: d,
    uniquenessIssues: r,
    spellingIssues: l,
    total: i.length
  };
}
let g = null;
function y(t = typeof document < "u" ? document : null, e = 50, a = null) {
  if (!t) return;
  g && (clearTimeout(g), g = null);
  function n() {
    g = setTimeout(() => {
      g = null;
      const d = E(t);
      a && a(d);
    }, e);
  }
  $() > 0 ? M(n) : n();
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  function a(n) {
    return this.dom = n, y(n.ownerDocument || document), this;
  }
  a.prototype.verify = function(n, d) {
    return E(n || (this.dom ? this.dom.ownerDocument || this.dom : document), d);
  }, a.prototype.destroy = function() {
    delete this.dom[e];
  }, typeof window < "u" && (window.lnDebug = {
    verify: function(n, d) {
      return E(n || document, d);
    },
    schedule: function(n, d, r) {
      return y(n || document, d, r);
    }
  }), Q(t, e, a, "ln-debug", {
    onInit: function(n) {
      typeof document < "u" && y(n && n.ownerDocument ? n.ownerDocument : document);
    },
    onSubtreeChange: function(n) {
      typeof document < "u" && y(n && n.ownerDocument ? n.ownerDocument : document);
    }
  });
})();
export {
  y as scheduleVerification,
  E as verifyDOM
};
