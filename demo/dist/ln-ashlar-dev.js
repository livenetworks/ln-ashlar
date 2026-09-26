function R(t, e, n, a, r) {
  if (!t || e === null) return !0;
  const l = a || "ln-component", o = t.type;
  if (o === "trigger" || o === "marker" || o === "string" || o === "list" || !o || e === "" && t.fallback !== void 0)
    return !0;
  const d = (i) => {
    r ? console.warn(i, r) : console.warn(i);
  };
  if (o === "boolean") {
    const i = e.trim().toLowerCase();
    return i !== "" && i !== "true" && i !== "false" && i !== "1" && i !== "0" ? (d(`[${l}] Invalid value "${e}" for boolean attribute "${n}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (o === "enum") {
    const i = t.values || [];
    return i.includes(e) ? !0 : (d(`[${l}] Invalid value "${e}" for attribute "${n}". Allowed: ${i.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (o === "integer") {
    if (!/^-?\d+$/.test(e))
      return d(`[${l}] Invalid integer "${e}" for attribute "${n}". Fallback: ${t.fallback}.`), !1;
    const i = parseInt(e, 10);
    return t.min !== void 0 && i < t.min ? (d(`[${l}] Value ${i} for attribute "${n}" is less than min (${t.min}).`), !1) : t.max !== void 0 && i > t.max ? (d(`[${l}] Value ${i} for attribute "${n}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (o === "float")
    return isNaN(Number(e)) ? (d(`[${l}] Invalid float "${e}" for attribute "${n}". Fallback: ${t.fallback}.`), !1) : !0;
  if (o === "json")
    try {
      return JSON.parse(e), !0;
    } catch (i) {
      return d(`[${l}] Invalid JSON for attribute "${n}": ${i.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function et(t) {
  const e = {};
  for (const n in t) {
    const a = t[n];
    a && a.effect && (e[n] = a.effect);
  }
  return Object.keys(e).length ? e : null;
}
function nt(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const n in t.effects) e.add(n);
  if (t.onAttrChange && t.declared) for (const n of t.declared) e.add(n);
  return e;
}
function W() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function I(t) {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0) return !0;
  if (window.lnCore && window.lnCore._debugIsContained)
    return t ? window.lnCore._debugIsContained(t) : window.lnCore._debugSink !== null;
  if (t && t.closest) {
    const e = t.closest("[data-ln-debug]");
    return !(!e || typeof document < "u" && e === document.documentElement);
  }
  return typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") : !1;
}
if (typeof window < "u" && (window.lnCore = window.lnCore || {}, !window.lnCore._warnBound)) {
  window.lnCore._warnBound = !0;
  const t = console.warn;
  console.warn = function(...e) {
    if (typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore"))) {
      let a = null;
      for (let r = 1; r < e.length; r++)
        if (e[r] && e[r].nodeType === 1) {
          a = e[r];
          break;
        }
      if (!I(a))
        return;
    }
    t.apply(console, e);
  };
}
const x = {};
function at(t, e) {
  x[t] || (x[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const n = x[t];
  return n ? n.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function lt(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function ot(t, e, n) {
  const a = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: a
  }));
}
function B(t, e) {
  if (!t || !e) return t;
  const n = t.querySelectorAll("[data-ln-field]");
  for (let o = 0; o < n.length; o++) {
    const d = n[o], i = d.getAttribute("data-ln-field");
    e[i] != null && (d.textContent = e[i]);
  }
  const a = t.querySelectorAll("[data-ln-attr]");
  for (let o = 0; o < a.length; o++) {
    const d = a[o], i = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < i.length; s++) {
      const c = i[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      e[f] != null && d.setAttribute(u, e[f]);
    }
  }
  const r = t.querySelectorAll("[data-ln-show]");
  for (let o = 0; o < r.length; o++) {
    const d = r[o], i = d.getAttribute("data-ln-show");
    i in e && d.classList.toggle("hidden", !e[i]);
  }
  const l = t.querySelectorAll("[data-ln-class]");
  for (let o = 0; o < l.length; o++) {
    const d = l[o], i = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < i.length; s++) {
      const c = i[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in e && d.classList.toggle(u, !!e[f]);
    }
  }
  return t;
}
function rt(t, e) {
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
function N(t, e) {
  if (!t || !e) return t;
  const n = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; n.nextNode(); ) {
    const l = n.currentNode;
    l.textContent.indexOf("{{") !== -1 && (l.textContent = l.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(o, d) {
        return e[d] !== void 0 ? e[d] : "";
      }
    ));
  }
  const a = function(l, o) {
    return e[o] !== void 0 ? e[o] : "";
  }, r = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && r.push(t);
  for (let l = 0; l < r.length; l++) {
    const o = r[l], d = o.attributes;
    for (let i = 0; i < d.length; i++) {
      const s = d[i];
      s.value.indexOf("{{") !== -1 && o.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return t;
}
function it(t, e, n, a, r, l) {
  const o = {};
  for (let i = 0; i < t.children.length; i++) {
    const s = t.children[i], c = s.getAttribute("data-ln-render-key");
    c && (o[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let i = 0; i < e.length; i++) {
    const s = e[i], c = String(a(s));
    let u = o[c];
    if (u)
      r(u, s, i);
    else {
      const f = at(n, l);
      if (!f || (N(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), r(u, s, i);
    }
    d.appendChild(u);
  }
  t.textContent = "", t.appendChild(d);
}
function m(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      m(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function E(t, e, n, a) {
  if (t.nodeType !== 1) return;
  const l = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", o = Array.from(t.querySelectorAll(l));
  t.matches && t.matches(l) && o.push(t);
  for (const d of o)
    d[n] || (window.lnCore._persistSink && d.hasAttribute("data-ln-persist") && window.lnCore._persistSink(d, e), d[n] = new a(d));
}
function dt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, m(function() {
    new MutationObserver(function() {
      ot(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function j() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function F(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function V() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function H(t) {
  const e = V(), n = t.observed || [];
  for (let a = 0; a < n.length; a++) {
    const r = n[a];
    e.byAttr.has(r) || e.byAttr.set(r, []), e.byAttr.get(r).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const a in t.attributes) {
      e.byDeclaredAttr.has(a) || e.byDeclaredAttr.set(a, []);
      const r = e.byDeclaredAttr.get(a);
      r.some((l) => l.componentTag === t.componentTag) || r.push({
        spec: t.attributes[a],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const a = nt(t);
    if (a === null)
      e.reactiveWildcard.push(t);
    else
      for (const r of a)
        e.byReactive.has(r) || e.byReactive.set(r, []), e.byReactive.get(r).push(t);
  }
  t.persist && e.persist.push(t);
}
function L(t, e, n, a) {
  for (let r = 0; r < t.length; r++) {
    const l = t[r];
    if (!e[l.attribute]) continue;
    const o = l.effects && l.effects[n];
    o ? o(e, n, a) : l.onAttrChange && (!l.declared || l.declared.has(n)) && l.onAttrChange(e, n, a);
  }
}
function st(t) {
  const e = t.target, n = t.attributeName;
  if (t.oldValue === e.getAttribute(n)) return;
  const a = V(), r = a.byAttr.get(n);
  if (W() && a.byDeclaredAttr && a.byDeclaredAttr.has(n) && I(e)) {
    const l = a.byDeclaredAttr.get(n), o = e.getAttribute(n);
    for (let d = 0; d < l.length; d++)
      R(l[d].spec, o, n, l[d].componentTag, e);
  }
  if (window.lnCore._debugSink && (n.indexOf("data-ln-") === 0 || r) && window.lnCore._debugSink("attr", n, e, { oldValue: t.oldValue, newValue: e.getAttribute(n) }), n.indexOf("data-ln-") === 0) {
    const l = a.byReactive.get(n);
    l && L(l, e, n, t.oldValue), a.reactiveWildcard.length && L(a.reactiveWildcard, e, n, t.oldValue);
  }
  if (r)
    for (let l = 0; l < r.length; l++) {
      const o = r[l];
      if (o.handler) {
        o.handler(e, n, t.oldValue);
        continue;
      }
      o.onAttributeChange && e[o.attribute] ? o.onAttributeChange(e, n) : (E(e, o.selector, o.attribute, o.ComponentFn), o.onInit && o.onInit(e));
    }
}
function U() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, m(function() {
    new MutationObserver(function(e) {
      for (let n = 0; n < e.length; n++)
        st(e[n]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function z() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function ct(t) {
  const e = z();
  if (e.length) {
    if (t.target)
      for (let n = 0; n < e.length; n++) {
        const a = e[n];
        if (a.onSubtreeChange) {
          const r = a.query, l = t.target.nodeType === 1 ? t.target.matches(r) ? t.target : t.target.closest(r) : t.target.parentElement ? t.target.parentElement.closest(r) : null;
          l && a.onSubtreeChange(l, t);
        }
      }
    for (let n = 0; n < t.addedNodes.length; n++) {
      const a = t.addedNodes[n];
      if (a.nodeType === 1)
        for (let r = 0; r < e.length; r++) {
          const l = e[r];
          E(a, l.selector, l.attribute, l.ComponentFn), l.onInit && l.onInit(a);
        }
    }
    for (let n = 0; n < t.removedNodes.length; n++) {
      const a = t.removedNodes[n];
      if (a.nodeType === 1)
        for (let r = 0; r < e.length; r++) {
          const l = e[r], o = l.query, d = Array.from(a.querySelectorAll(o));
          a.matches && a.matches(o) && d.push(a);
          for (let i = 0; i < d.length; i++) {
            const s = d[i];
            if (!document.contains(s)) {
              const c = s[l.attribute];
              c && typeof c.destroy == "function" && c.destroy(), delete s[l.attribute];
            }
          }
        }
    }
  }
}
function ut() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, m(function() {
    new MutationObserver(function(e) {
      for (let n = 0; n < e.length; n++) {
        const a = e[n];
        a.type === "childList" && ct(a);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function ft(t, e) {
  H({ observed: t, handler: e }), U();
}
function bt(t, e, n, a, r = {}) {
  const l = r.extraAttributes || [], o = r.onAttributeChange || null, d = r.onSubtreeChange || null, i = r.onInit || null, s = r.onAttrChange || null, c = r.effects || null, u = r.attributes || null, f = u ? et(u) : c, C = u ? new Set(Object.keys(u)) : null, Y = r.persist || null;
  function g(A) {
    const b = A || document.body;
    if (E(b, t, e, n), u && W())
      for (const p in u) {
        const tt = u[p], S = Array.from(b.querySelectorAll("[" + p + "]"));
        b.matches && b.matches("[" + p + "]") && S.push(b);
        for (let _ = 0; _ < S.length; _++) {
          const k = S[_];
          I(k) && R(tt, k.getAttribute(p), p, a, k);
        }
      }
    i && i(b);
  }
  const v = [];
  if (t.indexOf("[") !== -1) {
    const A = /\[([\w-]+)/g;
    let b;
    for (; (b = A.exec(t)) !== null; )
      v.push(b[1]);
  } else
    v.push(t);
  H({
    selector: t,
    attribute: e,
    componentTag: a,
    attributes: u,
    ComponentFn: n,
    onInit: i,
    observed: v.concat(l),
    onAttributeChange: o,
    onAttrChange: s,
    effects: f,
    declared: C,
    persist: Y
  }), U();
  const Z = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  z().push({
    selector: t,
    attribute: e,
    ComponentFn: n,
    onInit: i,
    onSubtreeChange: d,
    query: Z
  }), ut(), window[e] = g;
  function q() {
    j() > 0 ? F(function() {
      g(document.body);
    }) : g(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", q) : q(), g;
}
const G = {};
function wt(t, e) {
  G[t] = e;
}
function pt(t) {
  return G[t] || { ingress: (e) => e, egress: (e) => e };
}
const Q = {};
function K(t, e) {
  if (!t || typeof e != "object") return;
  const n = t.toLowerCase().split("-")[0];
  Q[n] = e;
}
function ht(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return Q[e] || null;
}
K("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = wt, window.lnCore.getDataMapper = pt, window.lnCore.registerLocaleFallback = K, window.lnCore.getLocaleFallback = ht, window.lnCore.fillTemplate = N, window.lnCore.fill = B, window.lnCore.lnFill = rt, window.lnCore.renderList = it, window.lnCore.ensureLocaleObserver = dt);
function J(t) {
  return (t || "").replace(/^#/, "");
}
function O(t) {
  const e = t === void 0 ? location.hash : t, n = {}, a = J(e);
  if (!a) return n;
  const r = a.split("&");
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    if (!o) continue;
    const d = o.indexOf(":"), i = d > -1 ? o.slice(0, d) : o, s = d > -1 ? o.slice(d + 1) : "";
    if (i)
      try {
        n[i] = decodeURIComponent(s);
      } catch {
        n[i] = s;
      }
  }
  return n;
}
function mt(t) {
  if (!t) return null;
  const e = O();
  return t in e ? e[t] : null;
}
function gt(t, e) {
  if (!t) return;
  const n = O();
  e == null ? delete n[t] : n[t] = String(e);
  const r = Object.keys(n).map(function(l) {
    const o = n[l];
    return o === "" ? l : l + ":" + encodeURIComponent(o);
  }).join("&");
  J(location.hash) !== r && (location.hash = r);
}
function yt(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function Ct(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const n = t.getAttribute("data-ln-hash");
  if (n && n.trim() !== "") return n.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "-" + e : a : e || null;
}
function vt(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function At(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function St(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function _t(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const n = t.slice(0, e), a = t.slice(e + 1), r = a ? a.split(",").map(function(l) {
    try {
      return decodeURIComponent(l);
    } catch {
      return l;
    }
  }).filter(Boolean) : [];
  return { key: n, values: r };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = O, window.lnCore.hashGet = mt, window.lnCore.hashSet = gt, window.lnCore.hashLinkClick = yt, window.lnCore.resolveHashNamespace = Ct, window.lnCore.hashSortEncode = vt, window.lnCore.hashSortDecode = At, window.lnCore.hashFilterEncode = St, window.lnCore.hashFilterDecode = _t);
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
  "data-ln-col",
  "data-ln-confirm",
  "data-ln-confirm-active",
  "data-ln-confirm-announcer",
  "data-ln-confirm-idle",
  "data-ln-confirm-state",
  "data-ln-confirm-timeout",
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-dict",
  "data-ln-data-coordinator-filters",
  "data-ln-data-coordinator-mapper",
  "data-ln-data-coordinator-no-autosync",
  "data-ln-data-coordinator-scope",
  "data-ln-data-coordinator-search",
  "data-ln-data-coordinator-sort-direction",
  "data-ln-data-coordinator-sort-field",
  "data-ln-data-coordinator-stale",
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
  "data-ln-filter-values",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
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
  "data-ln-obfuscator",
  "data-ln-obfuscator-codec",
  "data-ln-obfuscator-key",
  "data-ln-options",
  "data-ln-options-label",
  "data-ln-options-value",
  "data-ln-outlet",
  "data-ln-panel",
  "data-ln-persist",
  "data-ln-persist-scope",
  "data-ln-picklist",
  "data-ln-picklist-list",
  "data-ln-picklist-max",
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
  "data-ln-scroll",
  "data-ln-scroll-behavior",
  "data-ln-scroll-block",
  "data-ln-scroll-delay",
  "data-ln-scroll-focus",
  "data-ln-scroll-set",
  "data-ln-scroll-update-hash",
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
  "data-ln-sort-exclude",
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
  "data-ln-websocket-connector",
  "data-ln-websocket-connector-url"
]);
function kt(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const n = [];
  for (let a = 0; a <= e.length; a++) n[a] = [a];
  for (let a = 0; a <= t.length; a++) n[0][a] = a;
  for (let a = 1; a <= e.length; a++)
    for (let r = 1; r <= t.length; r++)
      e.charAt(a - 1) === t.charAt(r - 1) ? n[a][r] = n[a - 1][r - 1] : n[a][r] = Math.min(
        n[a - 1][r - 1] + 1,
        n[a][r - 1] + 1,
        n[a - 1][r] + 1
      );
  return n[e.length][t.length];
}
function xt(t, e = T) {
  if (e.has(t)) return null;
  let n = null, a = 1 / 0;
  for (const l of e) {
    const o = kt(t, l);
    o < a && (a = o, n = l);
  }
  const r = Math.max(3, Math.floor(t.length * 0.4));
  return a <= r ? n : null;
}
function P(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function $t(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], r = [n, ...n.querySelectorAll("*")];
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const i = o.attributes[d];
        if (i.name.startsWith("data-ln-") && i.name.endsWith("-for")) {
          const s = (i.value || "").trim();
          if (!s) {
            a.push({
              type: "id-empty",
              element: o,
              attribute: i.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${o.tagName.toLowerCase()} ${i.name}="">.`
            });
            continue;
          }
          e.getElementById(s) || e.querySelector("#" + P(s)) || a.push({
            type: "id-unresolved",
            element: o,
            attribute: i.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${o.tagName.toLowerCase()} ${i.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function Dt(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], r = [n, ...n.querySelectorAll("*")];
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const i = o.attributes[d];
        if (i.name.startsWith("data-ln-") && (i.name.endsWith("-source") || i.name.endsWith("-store")) && i.name !== "data-ln-data-store") {
          const c = (i.value || "").trim();
          if (!c) {
            a.push({
              type: "store-empty",
              element: o,
              attribute: i.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${o.tagName.toLowerCase()} ${i.name}="">.`
            });
            continue;
          }
          const u = P(c), f = e.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), C = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !C && a.push({
            type: "store-unresolved",
            element: o,
            attribute: i.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${o.tagName.toLowerCase()} ${i.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function It(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const n = [], a = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && a.unshift(e);
  const r = /* @__PURE__ */ new Map();
  for (let l = 0; l < a.length; l++) {
    const o = a[l], d = (o.getAttribute("data-ln-data-store") || "").trim();
    d && (r.has(d) || r.set(d, []), r.get(d).push(o));
  }
  for (const [l, o] of r.entries())
    o.length > 1 && n.push({
      type: "store-duplicate",
      storeName: l,
      elements: o,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${l}". Store names must be unique across the document.`
    });
  return n;
}
function Et(t = document, e = T) {
  const n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const a = [], r = [n, ...n.querySelectorAll("*")];
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const i = o.attributes[d];
        if (i.name.startsWith("data-ln-") && !e.has(i.name)) {
          const s = xt(i.name, e), c = s ? ` Did you mean "${s}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: o,
            attribute: i.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${i.name}" on <${o.tagName.toLowerCase()}>.${c}`
          });
        }
      }
  }
  return a;
}
function $(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const n = e.validAttributes || T, a = $t(t), r = Dt(t), l = It(t), o = Et(t, n), d = [
    ...a,
    ...r,
    ...l,
    ...o
  ];
  if (!e.silent)
    for (let i = 0; i < d.length; i++)
      console.warn(d[i].message);
  return {
    idIssues: a,
    storeIssues: r,
    uniquenessIssues: l,
    spellingIssues: o,
    total: d.length
  };
}
let h = null;
function y(t = typeof document < "u" ? document : null, e = 50, n = null) {
  if (!t) return;
  h && (clearTimeout(h), h = null);
  function a() {
    h = setTimeout(() => {
      h = null;
      const r = $(t);
      n && n(r);
    }, e);
  }
  j() > 0 ? F(a) : a();
}
function Ot(t, e, n, a) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", n), console.log("detail", a), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", n), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let w = [];
function Tt() {
  w = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && w.push(document.body);
}
function X(t) {
  if (t === window || t === document)
    return w.indexOf(document.body) !== -1;
  for (let e = 0; e < w.length; e++)
    if (w[e].contains(t)) return !0;
  return !1;
}
function qt(t, e, n, a) {
  X(n) && Ot(t, e, n, a);
}
function D() {
  Tt(), lt(w.length > 0 ? qt : null, w.length > 0 ? X : null);
}
function M() {
  D();
}
function Lt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, m(function() {
    D(), ft(["data-ln-debug"], D);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const n = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Lt();
  function a(l) {
    return this.dom = l, y(l.ownerDocument || document), M(), this;
  }
  a.prototype.verify = function(l, o) {
    return $(l || (this.dom ? this.dom.ownerDocument || this.dom : document), o);
  }, a.prototype.destroy = function() {
    delete this.dom[e], M();
  };
  const r = bt(t, e, a, "ln-debug", {
    attributes: n,
    onInit: function(l) {
      typeof document < "u" && y(l && l.ownerDocument ? l.ownerDocument : document);
    },
    onSubtreeChange: function(l) {
      typeof document < "u" && y(l && l.ownerDocument ? l.ownerDocument : document);
    }
  });
  r.verify = function(l, o) {
    return $(l || document, o);
  }, r.schedule = function(l, o, d) {
    return y(l || document, o, d);
  };
})();
export {
  y as scheduleVerification,
  $ as verifyDOM
};
