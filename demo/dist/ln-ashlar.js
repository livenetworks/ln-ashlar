function pe() {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink) return !0;
  if (typeof document < "u") {
    if (document.documentElement && document.documentElement.hasAttribute("data-ln-debug")) return !0;
    if (document.body)
      return document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null;
  }
  return !1;
}
function ze(t) {
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
      let l = null;
      for (let p = 1; p < e.length; p++)
        if (e[p] && e[p].nodeType === 1) {
          l = e[p];
          break;
        }
      if (!ze(l))
        return;
    }
    t.apply(console, e);
  };
}
function Ki(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function ji(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, n) {
  const l = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: l
  }));
}
function W(t, e, n) {
  const l = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l);
  const p = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: l
  });
  return t.dispatchEvent(p), p;
}
function Dn(t, e, n) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const l = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  l[n] = t.name, L(t.dom, e, l);
}
function ft(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ft(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function Vt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function xt(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Wi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Ke(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Vi(t, e) {
  return !t || !document.contains(t) || Ke(t) || e && typeof t[e] != "function" ? !1 : Vt(t);
}
function On(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const n = e.getAttribute("href");
  return !(!n || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || n.startsWith("mailto:") || n.startsWith("tel:") || n === "#" || n.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function yt(t) {
  return t.hasAttribute("value") ? t.getAttribute("value") : t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.textContent.trim();
}
function Nn(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function je(t, e) {
  const n = !!(e && e.typed), l = e && e.exclude, p = {}, m = t.elements, u = {};
  if (n)
    for (let d = 0; d < m.length; d++) {
      const h = m[d];
      h.name && h.type === "checkbox" && !h.disabled && (u[h.name] = (u[h.name] || 0) + 1);
    }
  for (let d = 0; d < m.length; d++) {
    const h = m[d];
    if (!(!h.name || h.disabled || h.type === "file" || h.type === "submit" || h.type === "button") && !(l && h.matches && h.matches(l)))
      if (h.type === "checkbox")
        n && u[h.name] === 1 ? p[h.name] = h.checked : (p[h.name] || (p[h.name] = []), h.checked && p[h.name].push(h.value));
      else if (h.type === "radio")
        h.checked && (p[h.name] = h.value);
      else if (h.type === "select-multiple") {
        p[h.name] = [];
        for (let s = 0; s < h.options.length; s++)
          h.options[s].selected && p[h.name].push(h.options[s].value);
      } else if (n && h.type === "hidden")
        p[h.name] = h.value;
      else if (n && (h.type === "number" || h.type === "range")) {
        const s = Number(h.value);
        p[h.name] = h.value === "" || isNaN(s) ? null : s;
      } else
        p[h.name] = h.value;
  }
  return p;
}
function le(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function We(t, e) {
  const n = t.elements, l = [], p = {};
  for (let m = 0; m < n.length; m++) {
    const u = n[m];
    u.name && u.type === "checkbox" && (p[u.name] = (p[u.name] || 0) + 1);
  }
  for (let m = 0; m < n.length; m++) {
    const u = n[m];
    if (u.type === "file" || u.type === "submit" || u.type === "button") continue;
    const d = u.getAttribute("data-ln-fill-as") || u.name;
    if (!d || !(d in e)) continue;
    const h = e[d];
    if (u.type === "checkbox") {
      if (Array.isArray(h))
        u.checked = h.indexOf(u.value) !== -1;
      else if (p[u.name] > 1) {
        const s = String(h).split(",").map(function(b) {
          return b.trim();
        });
        u.checked = s.indexOf(u.value) !== -1;
      } else
        u.checked = le(h);
      l.push(u);
    } else if (u.type === "radio")
      u.checked = u.value === String(h), l.push(u);
    else if (u.type === "select-multiple") {
      if (Array.isArray(h))
        for (let s = 0; s < u.options.length; s++)
          u.options[s].selected = h.indexOf(u.options[s].value) !== -1;
      l.push(u);
    } else
      u.value = h, u.tagName === "SELECT" && h != null && u.setAttribute("data-ln-value", h), l.push(u);
  }
  return l;
}
function Ve(t, e, { get: n, set: l }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return n ? n.call(this) : e.get.call(this);
    },
    set: function(p) {
      l ? l.call(this, p, (m) => e.set.call(this, m)) : e.set.call(this, p);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.coerceBool = le, window.lnCore.populateForm = We, window.lnCore.serializeForm = je, window.lnCore.resolveFormMethod = Nn);
function wt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, n) => n === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Kt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function Mn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (n) {
    return console.error(`[${e}] Invalid headers JSON:`, n), {};
  }
}
const Fn = {};
function $i(t, e) {
  Fn[t] = e;
}
function Gi(t) {
  return Fn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = $i, window.lnCore.getDataMapper = Gi);
function J(t) {
  const e = t ? t.closest("[lang]") : null, n = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return n ? n.trim() : "en-US";
}
function me() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ft(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const Pn = {};
function Bn(t, e) {
  if (!t || typeof e != "object") return;
  const n = t.toLowerCase().split("-")[0];
  Pn[n] = e;
}
function Tt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return Pn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Bn, window.lnCore.getLocaleFallback = Tt, window.lnCore.ensureLocaleObserver = me);
const ye = {};
function ce(t, e) {
  ye[t] || (ye[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const n = ye[t];
  return n ? n.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function et(t, e, n) {
  if (t) {
    const l = t.querySelector('[data-ln-template="' + e + '"]');
    if (l) return l.content.cloneNode(!0);
  }
  return ce(e, n);
}
function dt(t, e) {
  if (!t || !e) return t;
  const n = t.querySelectorAll("[data-ln-field]");
  for (let u = 0; u < n.length; u++) {
    const d = n[u], h = d.getAttribute("data-ln-field");
    e[h] != null && (d.textContent = e[h]);
  }
  const l = t.querySelectorAll("[data-ln-attr]");
  for (let u = 0; u < l.length; u++) {
    const d = l[u], h = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < h.length; s++) {
      const b = h[s].trim().split(":");
      if (b.length !== 2) continue;
      const v = b[0].trim(), g = b[1].trim();
      e[g] != null && d.setAttribute(v, e[g]);
    }
  }
  const p = t.querySelectorAll("[data-ln-show]");
  for (let u = 0; u < p.length; u++) {
    const d = p[u], h = d.getAttribute("data-ln-show");
    h in e && d.classList.toggle("hidden", !e[h]);
  }
  const m = t.querySelectorAll("[data-ln-class]");
  for (let u = 0; u < m.length; u++) {
    const d = m[u], h = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < h.length; s++) {
      const b = h[s].trim().split(":");
      if (b.length !== 2) continue;
      const v = b[0].trim(), g = b[1].trim();
      g in e && d.classList.toggle(v, !!e[g]);
    }
  }
  return t;
}
function Qi(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const n = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let l = 0; l < n.length; l++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", n[l], e ?? null), n[l].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      dt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let n = 0; n < e.length; n++)
        e[n].textContent = "";
    }
})));
function Yt(t, e) {
  if (!t || !e) return t;
  const n = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; n.nextNode(); ) {
    const m = n.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(u, d) {
        return e[d] !== void 0 ? e[d] : "";
      }
    ));
  }
  const l = function(m, u) {
    return e[u] !== void 0 ? e[u] : "";
  }, p = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && p.push(t);
  for (let m = 0; m < p.length; m++) {
    const u = p[m], d = u.attributes;
    for (let h = 0; h < d.length; h++) {
      const s = d[h];
      s.value.indexOf("{{") !== -1 && u.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, l));
    }
  }
  return t;
}
function Xi(t, e, n, l, p, m) {
  const u = {};
  for (let h = 0; h < t.children.length; h++) {
    const s = t.children[h], b = s.getAttribute("data-ln-render-key");
    b && (u[b] = s);
  }
  const d = document.createDocumentFragment();
  for (let h = 0; h < e.length; h++) {
    const s = e[h], b = String(l(s));
    let v = u[b];
    if (v)
      p(v, s, h);
    else {
      const g = ce(n, m);
      if (!g || (Yt(g, s), v = g.firstElementChild, !v)) continue;
      v.setAttribute("data-ln-render-key", b), p(v, s, h);
    }
    d.appendChild(v);
  }
  t.textContent = "", t.appendChild(d);
}
function $e(t, e) {
  const n = {}, l = t.querySelectorAll("[" + e + "]");
  for (let p = 0; p < l.length; p++)
    n[l[p].getAttribute(e)] = l[p].textContent, l[p].remove();
  return n;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Yt, window.lnCore.fill = dt, window.lnCore.lnFill = Qi, window.lnCore.renderList = Xi);
function K(t, e, n) {
  const l = t.getAttribute(e);
  return l === null ? n : l;
}
function Ht(t, e, n) {
  const l = parseInt(t.getAttribute(e), 10);
  return isNaN(l) ? n : l;
}
function Et(t, e, n = !1) {
  const l = t.getAttribute(e);
  if (l === null) return !!n;
  const p = l.trim().toLowerCase();
  return !(p === "false" || p === "0");
}
function Ge(t, e) {
  return (t.getAttribute(e) || "").split(",").map((n) => n.trim()).filter(Boolean);
}
const ve = /* @__PURE__ */ new Map();
function Hn(t, e) {
  const n = (t ? t.join("|") : "") + "::" + e;
  if (ve.has(n)) return ve.get(n);
  const l = new Set(t || []), p = function(m, u) {
    const d = m.getAttribute(u);
    return d !== null && l.has(d) ? d : e;
  };
  return ve.set(n, p), p;
}
function Un(t, e, n) {
  const l = parseFloat(t.getAttribute(e));
  return isNaN(l) ? n : l;
}
function Qe(t, e, n) {
  const l = t.getAttribute(e);
  if (!l) return n;
  try {
    return JSON.parse(l);
  } catch {
    return n;
  }
}
function zn(t, e, n, l, p) {
  if (!t || e === null) return !0;
  const m = l || "ln-component", u = t.type;
  if (u === "trigger" || u === "marker" || u === "string" || u === "list" || !u || e === "" && t.fallback !== void 0)
    return !0;
  const d = (h) => {
    p ? console.warn(h, p) : console.warn(h);
  };
  if (u === "boolean") {
    const h = e.trim().toLowerCase();
    return h !== "" && h !== "true" && h !== "false" && h !== "1" && h !== "0" ? (d(`[${m}] Invalid value "${e}" for boolean attribute "${n}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (u === "enum") {
    const h = t.values || [];
    return h.includes(e) ? !0 : (d(`[${m}] Invalid value "${e}" for attribute "${n}". Allowed: ${h.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (u === "integer") {
    if (!/^-?\d+$/.test(e))
      return d(`[${m}] Invalid integer "${e}" for attribute "${n}". Fallback: ${t.fallback}.`), !1;
    const h = parseInt(e, 10);
    return t.min !== void 0 && h < t.min ? (d(`[${m}] Value ${h} for attribute "${n}" is less than min (${t.min}).`), !1) : t.max !== void 0 && h > t.max ? (d(`[${m}] Value ${h} for attribute "${n}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (u === "float")
    return isNaN(Number(e)) ? (d(`[${m}] Invalid float "${e}" for attribute "${n}". Fallback: ${t.fallback}.`), !1) : !0;
  if (u === "json")
    try {
      return JSON.parse(e), !0;
    } catch (h) {
      return d(`[${m}] Invalid JSON for attribute "${n}": ${h.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function X(t, e, n) {
  for (const l in n) {
    const [p, m, u] = n[l];
    Object.defineProperty(t, l, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return p(e, m, u);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function Y(t) {
  const e = {};
  for (const n in t) {
    const l = t[n];
    if (!l || !l.prop) continue;
    let p = l.read;
    if (!p && l.type)
      switch (l.type) {
        case "enum":
          p = Hn(l.values, l.fallback);
          break;
        case "integer":
          p = Ht;
          break;
        case "float":
          p = Un;
          break;
        case "boolean":
          p = Et;
          break;
        case "list":
          p = Ge;
          break;
        case "json":
          p = Qe;
          break;
        case "string":
        default:
          p = K;
          break;
      }
    p || (p = K), e[l.prop] = [p, n, l.fallback];
  }
  return e;
}
function Yi(t) {
  const e = {};
  for (const n in t) {
    const l = t[n];
    l && l.effect && (e[n] = l.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Ji(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const n in t.effects) e.add(n);
  if (t.onAttrChange && t.declared) for (const n of t.declared) e.add(n);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = X, window.lnCore.attrSpec = Y, window.lnCore.attrStr = K, window.lnCore.attrInt = Ht, window.lnCore.attrBool = Et, window.lnCore.attrList = Ge, window.lnCore.attrEnum = Hn, window.lnCore.attrFloat = Un, window.lnCore.attrJson = Qe);
function de(t, e) {
  if (!t[e.attribute]) {
    window.lnCore._persistSink && t.hasAttribute && t.hasAttribute("data-ln-persist") && window.lnCore._persistSink(t, e.selector);
    try {
      t[e.attribute] = new e.ComponentFn(t);
    } catch (n) {
      console.error("[" + e.attribute + "] init failed", t, n);
    }
  }
}
function Kn(t, e, n, l) {
  if (t.nodeType !== 1) return;
  const m = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", u = { selector: e, attribute: n, ComponentFn: l };
  if (t.matches && t.matches(m) && de(t, u), t.querySelectorAll) {
    const d = t.querySelectorAll(m);
    for (let h = 0; h < d.length; h++)
      de(d[h], u);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Zi() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function we() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function jn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ut(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Wn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Vn(t) {
  const e = Wn(), n = t.observed || [];
  for (let l = 0; l < n.length; l++) {
    const p = n[l];
    e.byAttr.has(p) || e.byAttr.set(p, []), e.byAttr.get(p).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const l in t.attributes) {
      e.byDeclaredAttr.has(l) || e.byDeclaredAttr.set(l, []);
      const p = e.byDeclaredAttr.get(l);
      p.some((m) => m.componentTag === t.componentTag) || p.push({
        spec: t.attributes[l],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const l = Ji(t);
    if (l === null)
      e.reactiveWildcard.push(t);
    else
      for (const p of l)
        e.byReactive.has(p) || e.byReactive.set(p, []), e.byReactive.get(p).push(t);
  }
  t.persist && e.persist.push(t);
}
function sn(t, e, n, l) {
  for (let p = 0; p < t.length; p++) {
    const m = t[p];
    if (!e[m.attribute]) continue;
    const u = m.effects && m.effects[n];
    u ? u(e, n, l) : m.onAttrChange && (!m.declared || m.declared.has(n)) && m.onAttrChange(e, n, l);
  }
}
function tr(t) {
  const e = t.attributeName, n = e.indexOf("data-ln-") === 0, l = Wn(), p = l.byAttr.get(e), m = pe() && l.byDeclaredAttr && l.byDeclaredAttr.has(e);
  if (!n && !p && !m)
    return;
  const u = t.target;
  if (t.oldValue !== u.getAttribute(e)) {
    if (m && ze(u)) {
      const d = l.byDeclaredAttr.get(e), h = u.getAttribute(e);
      for (let s = 0; s < d.length; s++)
        zn(d[s].spec, h, e, d[s].componentTag, u);
    }
    if (window.lnCore._debugSink && (n || p) && window.lnCore._debugSink("attr", e, u, { oldValue: t.oldValue, newValue: u.getAttribute(e) }), n) {
      const d = l.byReactive.get(e);
      d && sn(d, u, e, t.oldValue), l.reactiveWildcard.length && sn(l.reactiveWildcard, u, e, t.oldValue);
    }
    if (p)
      for (let d = 0; d < p.length; d++) {
        const h = p[d];
        if (h.handler) {
          h.handler(u, e, t.oldValue);
          continue;
        }
        h.onAttributeChange && u[h.attribute] ? h.onAttributeChange(u, e) : (Kn(u, h.selector, h.attribute, h.ComponentFn), h.onInit && h.onInit(u));
      }
  }
}
function $n() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ft(function() {
    new MutationObserver(function(e) {
      for (let n = 0; n < e.length; n++)
        try {
          tr(e[n]);
        } catch (l) {
          console.error("[ln-core] mutation handler failed", e[n].target, l);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Xe() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Ye() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function an(t, e) {
  if (!document.contains(t))
    if (e.attribute) {
      const n = t[e.attribute];
      if (n && typeof n.destroy == "function")
        try {
          n.destroy();
        } catch (l) {
          console.error("[" + e.attribute + "] destroy failed", t, l);
        }
      delete t[e.attribute];
    } else e.onDestroy && e.onDestroy(t);
}
function Gn(t) {
  const e = Xe();
  if (!e.length) return;
  const n = t.target;
  if (n) {
    const p = n.nodeType === 1 ? n : n.parentElement;
    if (p && (p.isContentEditable || p.closest && p.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const l = Ye();
  if (t.target && l.length)
    for (let p = 0; p < l.length; p++) {
      const m = l[p], u = m.query, d = t.target.nodeType === 1 ? t.target.matches && t.target.matches(u) ? t.target : t.target.closest ? t.target.closest(u) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(u) : null;
      d && m.onSubtreeChange(d, t);
    }
  for (let p = 0; p < t.addedNodes.length; p++) {
    const m = t.addedNodes[p];
    if (m.nodeType !== 1) continue;
    const u = !!(m.firstElementChild || m.children && m.children.length);
    for (let d = 0; d < e.length; d++) {
      const h = e[d], s = h.query;
      if (s && (m.matches && m.matches(s) && (h.ComponentFn && de(m, h), h.onInit && h.onInit(m)), u && m.querySelectorAll)) {
        const b = m.querySelectorAll(s);
        for (let v = 0; v < b.length; v++)
          h.ComponentFn && de(b[v], h), h.onInit && h.onInit(b[v]);
      }
    }
  }
  for (let p = 0; p < t.removedNodes.length; p++) {
    const m = t.removedNodes[p];
    if (m.nodeType !== 1 || document.contains(m)) continue;
    const u = !!(m.firstElementChild || m.children && m.children.length);
    for (let d = 0; d < e.length; d++) {
      const h = e[d], s = h.query;
      if (s && (m.matches && m.matches(s) && an(m, h), u && m.querySelectorAll)) {
        const b = m.querySelectorAll(s);
        for (let v = 0; v < b.length; v++) an(b[v], h);
      }
    }
  }
}
function Qn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ft(function() {
    const t = new MutationObserver(function(e) {
      for (let n = 0; n < e.length; n++) {
        const l = e[n];
        if (l.type === "childList")
          try {
            Gn(l);
          } catch (p) {
            console.error("[ln-core] lifecycle handler failed", l.target, p);
          }
      }
    });
    window.lnCore._lifecycleObserver = t, t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Xn(t) {
  if (typeof window > "u") return t();
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._lifecycleObserver;
  if (!e) return t();
  const n = e.takeRecords();
  for (let l = 0; l < n.length; l++) {
    const p = n[l];
    if (p.type === "childList")
      try {
        Gn(p);
      } catch (m) {
        console.error("[ln-core] lifecycle handler failed", p.target, m);
      }
  }
  e.disconnect();
  try {
    return t();
  } finally {
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}
function qt(t, e) {
  Vn({ observed: t, handler: e }), $n();
}
function Jt(t) {
  Xe().push(t), t.onSubtreeChange && t.query && Ye().push(t), Qn();
}
function B(t, e, n, l, p = {}) {
  const m = p.extraAttributes || [], u = p.onAttributeChange || null, d = p.onSubtreeChange || null, h = p.onInit || null, s = p.onAttrChange || null, b = p.effects || null, v = p.attributes || null, g = v ? Yi(v) : b, f = v ? new Set(Object.keys(v)) : null, c = p.persist || null;
  function a(A) {
    const w = A || document.body;
    if (Kn(w, t, e, n), v && pe())
      for (const S in v) {
        const E = v[S], C = Array.from(w.querySelectorAll("[" + S + "]"));
        w.matches && w.matches("[" + S + "]") && C.push(w);
        for (let T = 0; T < C.length; T++) {
          const x = C[T];
          ze(x) && zn(E, x.getAttribute(S), S, l, x);
        }
      }
    h && h(w);
  }
  const i = [];
  if (t.indexOf("[") !== -1) {
    const A = /\[([\w-]+)/g;
    let w;
    for (; (w = A.exec(t)) !== null; )
      i.push(w[1]);
  } else
    i.push(t);
  Vn({
    selector: t,
    attribute: e,
    componentTag: l,
    attributes: v,
    ComponentFn: n,
    onInit: h,
    observed: i.concat(m),
    onAttributeChange: u,
    onAttrChange: s,
    effects: g,
    declared: f,
    persist: c
  }), $n();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, r = p.subtreeQuery || (_ ? t : "[" + t + "]"), y = {
    selector: t,
    attribute: e,
    ComponentFn: n,
    onInit: h,
    onSubtreeChange: d,
    query: r
  };
  Xe().push(y), d && r && Ye().push(y), Qn(), window[e] = a, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = B, window.lnCore.observeLifecycle = Jt, window.lnCore.withoutLifecycle = Xn);
  function o() {
    jn() > 0 ? ut(function() {
      a(document.body);
    }) : a(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o(), a;
}
function ge(t) {
  let e = !1;
  for (let n = 0; n < t.length; n++) {
    const l = t[n];
    if (!(l === "" || l == null) && (e = !0, !Number.isFinite(Number(l))))
      return "string";
  }
  return e ? "number" : "string";
}
function _e(t, e, n, l) {
  if (n === "number") {
    const u = parseFloat(t), d = parseFloat(e);
    return (isNaN(u) ? 0 : u) - (isNaN(d) ? 0 : d);
  }
  const p = t != null ? String(t) : "", m = e != null ? String(e) : "";
  return l ? l.compare(p, m) : p < m ? -1 : p > m ? 1 : 0;
}
function Ut(t, e) {
  let n = !1;
  return function() {
    n || (n = !0, queueMicrotask(function() {
      n = !1, t();
    }));
  };
}
function Yn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, n = t.pageSize > 0 ? t.pageSize : 200, l = t.threshold != null ? t.threshold : 25, p = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, u = typeof t.onChange == "function" ? t.onChange : function() {
  }, d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let b = 0, v = 0, g = 0, f = { sort: null, filters: {}, search: "" }, c = null, a = 0, i = 0, _ = !1;
  function r(w) {
    h.set(w, ++a);
  }
  function y() {
    return !!(f && (f.search || f.filters && Object.keys(f.filters).length));
  }
  function o() {
    if (d.size <= e) return;
    const w = Array.from(d.keys()).sort(function(E, C) {
      return (h.get(E) || 0) - (h.get(C) || 0);
    });
    let S = 0;
    for (; d.size > e && S < w.length; )
      d.delete(w[S]), h.delete(w[S]), S++;
  }
  function A(w, S) {
    s.add(w), m(f, w, S);
  }
  return {
    get: function(w) {
      return d.get(w);
    },
    has: function(w) {
      return d.has(w);
    },
    peek: function() {
      return d.size ? d.values().next().value : void 0;
    },
    get logicalTotal() {
      return b;
    },
    get grandTotal() {
      return v;
    },
    get queryGen() {
      return g;
    },
    get size() {
      return d.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, S) {
      clearTimeout(c), i = w;
      for (let q = w; q < S; q++)
        d.has(q) && r(q);
      if (b <= 0) return;
      const E = Math.max(0, w - l), C = Math.min(b, S + l), T = Math.floor(E / n), x = Math.floor(Math.max(0, C - 1) / n);
      let I = -1;
      for (let q = T; q <= x; q++) {
        const D = q * n, N = Math.min(n, b - D);
        let F = !1;
        const H = Math.max(D, E), U = Math.min(D + N, C);
        for (let G = H; G < U; G++)
          if (!d.has(G)) {
            F = !0;
            break;
          }
        if (F && !s.has(D)) {
          I = D;
          break;
        }
      }
      I !== -1 && (c = setTimeout(function() {
        A(I, n);
      }, p));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== g) return !1;
      const S = w.offset || 0, E = w.data || [];
      let C = 0;
      for (let T = 0; T < E.length; T++)
        E[T] != null && C++;
      if (C === 0 && w.filtered > 0)
        return s.delete(S), !1;
      _ && (d.clear(), h.clear(), _ = !1), v = w.total != null ? w.total : v, b = w.filtered != null ? w.filtered : w.data ? w.data.length : b;
      for (let T = 0; T < E.length; T++)
        E[T] != null && (d.set(S + T, E[T]), r(S + T));
      return s.delete(S), o(), u(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (f = w), A(0, n);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      g++, s.clear(), clearTimeout(c), w && (f = w), _ = !0, A(0, n);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      g++, s.clear(), clearTimeout(c), _ = !0;
      const w = Math.max(0, Math.floor(i / n) * n);
      A(w, n);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      s.delete(w);
    },
    destroy: function() {
      clearTimeout(c), d.clear(), h.clear(), s.clear();
    },
    configure: function(w) {
      w = w || {};
      let S = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== e) {
        const E = w.windowSize < e;
        e = w.windowSize, E && o(), S = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (n = w.pageSize), w.threshold != null && w.threshold >= 0 && (l = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (p = w.fetchDebounce), S && u();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (v = w, y() || (b = w), u());
    }
  };
}
function Jn(t) {
  return (t || "").replace(/^#/, "");
}
function Qt(t) {
  const e = t === void 0 ? location.hash : t, n = {}, l = Jn(e);
  if (!l) return n;
  const p = l.split("&");
  for (let m = 0; m < p.length; m++) {
    const u = p[m];
    if (!u) continue;
    const d = u.indexOf(":"), h = d > -1 ? u.slice(0, d) : u, s = d > -1 ? u.slice(d + 1) : "";
    if (h)
      try {
        n[h] = decodeURIComponent(s);
      } catch {
        n[h] = s;
      }
  }
  return n;
}
function at(t) {
  if (!t) return null;
  const e = Qt();
  return t in e ? e[t] : null;
}
function mt(t, e) {
  if (!t) return;
  const n = Qt();
  e == null ? delete n[t] : n[t] = String(e);
  const p = Object.keys(n).map(function(m) {
    const u = n[m];
    return u === "" ? m : m + ":" + encodeURIComponent(u);
  }).join("&");
  Jn(location.hash) !== p && (location.hash = p);
}
function Je(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function vt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const n = t.getAttribute("data-ln-hash");
  if (n && n.trim() !== "") return n.trim();
  const l = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return l ? e ? l + "-" + e : l : e || null;
}
function Zn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function xe(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function ti(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function Ie(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const n = t.slice(0, e), l = t.slice(e + 1), p = l ? l.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: n, values: p };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Qt, window.lnCore.hashGet = at, window.lnCore.hashSet = mt, window.lnCore.hashLinkClick = Je, window.lnCore.resolveHashNamespace = vt, window.lnCore.hashSortEncode = Zn, window.lnCore.hashSortDecode = xe, window.lnCore.hashFilterEncode = ti, window.lnCore.hashFilterDecode = Ie);
function er(t) {
  return (t || "").replace(/^\?/, "");
}
function qe(t) {
  const e = t === void 0 ? typeof window < "u" ? window.location.search : "" : t, n = {}, l = er(e);
  if (!l) return n;
  const p = new URLSearchParams(l);
  for (const [m, u] of p.entries())
    n[m] = u;
  return n;
}
function It(t) {
  if (!t || typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function be(t, e) {
  if (!t || typeof window > "u") return;
  const n = new URL(window.location.href);
  if (e == null || e === "" ? n.searchParams.delete(t) : n.searchParams.set(t, String(e)), n.search === window.location.search) return;
  const l = n.pathname + n.search + n.hash;
  window.history.replaceState(window.history.state, "", l);
}
function kt(t, e) {
  if (!t || !t.hasAttribute("data-ln-query")) return null;
  const n = t.getAttribute("data-ln-query");
  if (n && n.trim() !== "") return n.trim();
  const l = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return l ? e ? l + "_" + e : l : e || null;
}
function ei(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Re(t, e) {
  if (t && typeof t == "string") {
    if (t.endsWith(".asc"))
      return { fieldOrColumn: t.slice(0, -4), direction: "asc" };
    if (t.endsWith(".desc"))
      return { fieldOrColumn: t.slice(0, -5), direction: "desc" };
  }
  if (e && typeof e == "object") {
    const n = e.sort_field || e.sort_by;
    if (n) {
      const l = e.sort_dir && String(e.sort_dir).toLowerCase() === "desc" ? "desc" : "asc";
      return { fieldOrColumn: n, direction: l };
    }
  }
  return null;
}
function ni(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function De(t) {
  return !t || typeof t != "string" ? [] : t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e.trim());
    } catch {
      return e.trim();
    }
  }).filter(Boolean);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.queryParse = qe, window.lnCore.queryGet = It, window.lnCore.querySet = be, window.lnCore.resolveQueryParam = kt, window.lnCore.querySortEncode = ei, window.lnCore.querySortDecode = Re, window.lnCore.queryFilterEncode = ni, window.lnCore.queryFilterDecode = De);
function ue(t, e, n, l) {
  const p = typeof l == "number" ? l : 4, m = window.innerWidth, u = window.innerHeight, d = e.width, h = e.height, s = (n || "bottom").split("-"), b = s[0], v = s[1] === "start" || s[1] === "end" ? s[1] : "center", g = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, f = g[b] || g.bottom;
  function c(y) {
    return y === "top" || y === "bottom" ? v === "start" ? t.left : v === "end" ? t.right - d : t.left + (t.width - d) / 2 : v === "start" ? t.top : v === "end" ? t.bottom - h : t.top + (t.height - h) / 2;
  }
  function a(y) {
    let o, A, w = !0;
    return y === "top" ? (o = t.top - p - h, A = c(y), o < 0 && (w = !1)) : y === "bottom" ? (o = t.bottom + p, A = c(y), o + h > u && (w = !1)) : y === "left" ? (o = c(y), A = t.left - p - d, A < 0 && (w = !1)) : (o = c(y), A = t.right + p, A + d > m && (w = !1)), { top: o, left: A, side: y, fits: w };
  }
  let i = null;
  for (let y = 0; y < f.length; y++) {
    const o = a(f[y]);
    if (o.fits) {
      i = o;
      break;
    }
  }
  i || (i = a(f[0]));
  let _ = i.top, r = i.left;
  return d >= m ? r = 0 : (r < 0 && (r = 0), r + d > m && (r = m - d)), h >= u ? _ = 0 : (_ < 0 && (_ = 0), _ + h > u && (_ = u - h)), { top: _, left: r, placement: i.side };
}
function Oe(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, n = e.visibility, l = e.display, p = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const m = t.offsetWidth, u = t.offsetHeight;
  return e.visibility = n, e.display = l, e.position = p, { width: m, height: u };
}
let $t = null;
const nr = "ln-ashlar:storage-salt:v1", ln = 32768;
function cn(t) {
  let e = "";
  const n = t.byteLength;
  for (let l = 0; l < n; l += ln)
    e += String.fromCharCode.apply(
      null,
      t.subarray(l, Math.min(l + ln, n))
    );
  return btoa(e);
}
function dn(t) {
  const e = atob(t), n = e.length, l = new Uint8Array(n);
  for (let p = 0; p < n; p++)
    l[p] = e.charCodeAt(p);
  return l;
}
function ii(t, e) {
  let n = $t, l = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? n = t : t && typeof t == "object" && (l = t, typeof CryptoKey < "u" && l.key instanceof CryptoKey && (n = l.key)), { key: n, options: l };
}
async function ir(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const n = e.method || "pbkdf2", l = new TextEncoder();
  if (n === "sha256") {
    const h = await crypto.subtle.digest("SHA-256", l.encode(t));
    return crypto.subtle.importKey(
      "raw",
      h,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const p = e.salt || nr, m = typeof p == "string" ? l.encode(p) : p, u = e.iterations || 1e5, d = await crypto.subtle.importKey(
    "raw",
    l.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: m,
      iterations: u,
      hash: "SHA-256"
    },
    d,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function un(t, e = {}) {
  if (!t) {
    $t = null;
    return;
  }
  try {
    const n = e.method || "sha256";
    $t = await ir(t, { ...e, method: n });
  } catch (n) {
    throw console.error("[ln-core/crypto] Key derivation failed:", n), $t = null, n;
  }
}
function Mt() {
  return $t;
}
async function rr(t, e, n) {
  const { key: l } = ii(e);
  if (t == null)
    return t;
  if (!l)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const p = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), u = typeof t == "string" ? t : JSON.stringify(t), d = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      l,
      p.encode(u)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: cn(m),
      data: cn(new Uint8Array(d))
    };
  } catch (p) {
    throw console.error("[ln-core/crypto] Encryption failed:", p), new Error("[ln-crypto] Encryption failed: " + (p && p.message ? p.message : String(p)));
  }
}
async function or(t, e, n) {
  const { key: l, options: p } = ii(e), m = p.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!l) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const u = new TextDecoder(), d = dn(t.iv), h = dn(t.data), s = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: d },
      l,
      h
    ), b = u.decode(s);
    try {
      return JSON.parse(b);
    } catch {
      return b;
    }
  } catch (u) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", u), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (u && u.message ? u.message : String(u)));
  }
}
function _t() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = _t);
function ri(t, e = 100, n = 0) {
  const l = parseFloat(String(t)) || 0, p = parseFloat(String(e)) || 100, m = parseFloat(String(n)) || 0, u = Math.max(m, Math.min(l, p)), d = p - m;
  let h = 0;
  return d > 0 && (h = (u - m) / d * 100), h = Math.max(0, Math.min(100, h)), {
    value: l,
    min: m,
    max: p,
    clampedValue: u,
    percentage: h
  };
}
function it(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const n = e < 1e11 ? e * 1e3 : e, l = new Date(n);
    return isNaN(l.getTime()) ? null : l;
  }
  if (typeof t == "string") {
    const n = t.trim();
    if (!n) return null;
    const l = /^(\d{4})-(\d{2})-(\d{2})$/.exec(n);
    if (l) {
      const m = +l[1], u = +l[2], d = +l[3], h = new Date(m, u - 1, d);
      return h.getFullYear() !== m || h.getMonth() !== u - 1 || h.getDate() !== d ? null : h;
    }
    const p = new Date(n);
    return isNaN(p.getTime()) ? null : p;
  }
  return null;
}
function Ft(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0");
  return e + "-" + n + "-" + l;
}
const bt = {};
function fe(t) {
  const e = t || "default";
  if (!bt[e]) {
    const n = new Intl.NumberFormat(t, { useGrouping: !0 }), l = n.formatToParts(1234.5);
    let p = "", m = ".";
    for (let u = 0; u < l.length; u++)
      l[u].type === "group" && (p = l[u].value), l[u].type === "decimal" && (m = l[u].value);
    bt[e] = { groupSep: p, decimalSep: m, fmt: n };
  }
  return bt[e];
}
function oi(t, e, n) {
  if (t == null || typeof t != "string") return "";
  let l = t.trim();
  return l === "" ? "" : (l = l.replace(/[$€£¥]/g, ""), e && (l = l.split(e).join("")), l = l.replace(/\s/g, ""), n && n !== "." && (l = l.replace(n, ".")), l = l.replace(/[^\d.-]/g, ""), l);
}
function sr(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const n = t.trim();
  if (n === "" || n === "-") return NaN;
  const l = fe(e), p = oi(n, l.groupSep, l.decimalSep);
  if (p === "" || p === "-") return NaN;
  const m = parseFloat(p);
  return isNaN(m) ? NaN : m;
}
function rt(t, e, n = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const l = e || "default", p = n.maxDecimals != null ? parseInt(n.maxDecimals, 10) : null, m = n.userDecimals != null ? n.userDecimals : null;
  if (p !== null) {
    const u = l + "|max:" + p;
    return bt[u] || (bt[u] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: p
    })), bt[u].format(t);
  }
  if (m !== null && m > 0) {
    const u = l + "|exact:" + m;
    return bt[u] || (bt[u] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: m,
      maximumFractionDigits: m
    })), bt[u].format(t);
  }
  return fe(e).fmt.format(t);
}
function ae(t) {
  return String(t || "").trim().toLowerCase();
}
function si(t) {
  const e = ae(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ar(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((n) => n.trim()).filter(Boolean);
  return e.length ? e : null;
}
function ai(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const n = String(t).toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (n.indexOf(e[l]) === -1) return !1;
  return !0;
}
function lr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ze(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const n = String(t).trim().toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (String(e[l]).trim().toLowerCase() === n)
      return !0;
  return !1;
}
function cr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function dr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function ur(t, e) {
  return (e || "GET") + " " + (t || "");
}
function fr(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  function l(u, d) {
    d = d || {};
    const h = cr(u), s = dr(u, d), b = ur(h, s);
    fr(s) && e.has(b) && (e.get(b).abort(), e.delete(b));
    const v = new AbortController(), g = d.signal;
    let f = null;
    g && (g.aborted ? v.abort(g.reason) : (f = function() {
      v.abort(g.reason);
    }, g.addEventListener("abort", f, { once: !0 })));
    const c = Object.assign({}, d, { signal: v.signal });
    return e.set(b, v), t(u, c).finally(function() {
      g && f && g.removeEventListener("abort", f), e.get(b) === v && e.delete(b);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function p(u) {
    if (!u.detail || !u.detail.url) return;
    const d = u.target, h = (u.detail.method || (u.detail.body ? "POST" : "GET")).toUpperCase(), s = u.detail.key;
    s && n.has(s) && (n.get(s).abort(), n.delete(s));
    const b = new AbortController(), v = u.detail.signal;
    let g = null;
    v && (v.aborted ? b.abort(v.reason) : (g = function() {
      b.abort(v.reason);
    }, v.addEventListener("abort", g, { once: !0 }))), s && n.set(s, b);
    const f = { method: h, signal: b.signal };
    u.detail.body !== void 0 && (f.body = u.detail.body), window.fetch(u.detail.url, f).then(function(c) {
      v && g && v.removeEventListener("abort", g), s && n.get(s) === b && n.delete(s), L(d, "ln-http:response", {
        ok: c.ok,
        status: c.status,
        response: c
      });
    }).catch(function(c) {
      v && g && v.removeEventListener("abort", g), s && n.get(s) === b && n.delete(s), !(c && c.name === "AbortError") && L(d, "ln-http:error", {
        ok: !1,
        status: 0,
        error: c
      });
    });
  }
  function m(u) {
    const d = u.detail || {};
    d.all ? window.lnHttp.cancelAll() : d.key ? window.lnHttp.cancelByKey(d.key) : d.url && window.lnHttp.cancel(d.url);
  }
  document.addEventListener("ln-http:request", p), document.addEventListener("ln-http:cancel", m), window.lnHttp = {
    cancel: function(u) {
      let d = !1;
      return e.forEach(function(h, s) {
        s.endsWith(" " + u) && (h.abort(), e.delete(s), d = !0);
      }), d;
    },
    cancelByKey: function(u) {
      return n.has(u) ? (n.get(u).abort(), n.delete(u), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(u) {
        u.abort();
      }), e.clear(), n.forEach(function(u) {
        u.abort();
      }), n.clear();
    },
    get inflight() {
      const u = [];
      return e.forEach(function(d, h) {
        const s = h.indexOf(" ");
        u.push({ method: h.slice(0, s), url: h.slice(s + 1) });
      }), n.forEach(function(d, h) {
        u.push({ key: h });
      }), u;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", p), document.removeEventListener("ln-http:cancel", m), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-include": { prop: "url", read: K, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, l = Y(n), p = /* @__PURE__ */ new Map();
  function m(u) {
    if (this.dom = u, X(this, u, l), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Zi(), this._held = !0;
    const d = this, h = this.url;
    let s = p.get(h);
    return s || (s = fetch(h).then(function(b) {
      if (!b.ok)
        throw new Error("HTTP error! status: " + b.status);
      return b.text();
    }).catch(function(b) {
      throw p.delete(h), b;
    }), p.set(h, s)), s.then(function(b) {
      if (d._destroyed) return;
      const v = document.createElement("template");
      v.innerHTML = b, d.dom.content.appendChild(v.content), L(d.dom, "ln-include:loaded", { target: d.dom, url: d.url }), d._held && (d._held = !1, we());
    }).catch(function(b) {
      d._destroyed || (console.error("[ln-include] Failed to fetch template from " + d.url + ":", b), L(d.dom, "ln-include:error", { target: d.dom, url: d.url, error: b }), d._held && (d._held = !1, we()));
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, we()), delete this.dom[e]);
  }, B(t, e, m, "ln-include", {
    attributes: n
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: K, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, l = Y(n);
  function p(m) {
    this.dom = m, X(this, m, l), this._baseAction = m.getAttribute("action") || "";
    const u = this;
    function d() {
      const s = u.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let b = 0; b < s.length; b++)
        s[b].hasAttribute("data-ln-initial-value") || s[b].setAttribute("data-ln-initial-value", s[b].getAttribute("value") || "");
    }
    function h() {
      const s = u.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let b = 0; b < s.length; b++)
        s[b].value = s[b].getAttribute("data-ln-initial-value") || "";
    }
    return d(), this._onLnFill = function(s) {
      s.target === u.dom && (s.detail ? (d(), u.fill(s.detail), u._applyActionMode(s.detail)) : (u.dom.reset(), h()));
    }, this._onReset = function() {
      u._applyActionMode(null), h();
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  p.prototype.fill = function(m) {
    const u = We(this.dom, m);
    for (let d = 0; d < u.length; d++) {
      const h = u[d], s = h.tagName === "SELECT" || h.type === "checkbox" || h.type === "radio";
      h.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype.reset = function() {
    this.dom.reset(), this._applyActionMode(null);
    const m = this.dom.elements;
    for (let u = 0; u < m.length; u++) {
      const d = m[u], h = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(h ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, p.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const u = m && m.id != null && m.id !== "" ? m.id : null, d = this._ensureMethodInput();
    if (u !== null) {
      const h = this._actionEdit;
      h ? this.dom.setAttribute("action", h.replace(":id", encodeURIComponent(u))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(u)), d.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), d.value = "";
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, B(t, e, p, "ln-form", {
    attributes: n
  });
})();
const fn = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function hn(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function hr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function pr(t, e) {
  const n = [];
  if (t) {
    const l = Object.keys(fn);
    for (let p = 0; p < l.length; p++) {
      const m = l[p], u = fn[m];
      t[u] && n.push(m);
    }
  }
  if (e) {
    const l = Array.from(e);
    for (let p = 0; p < l.length; p++)
      l[p] && n.indexOf(l[p]) === -1 && n.push(l[p]);
  }
  return n;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", n = "data-ln-validate-errors", l = "data-ln-validate-error", p = "ln-validate-valid", m = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function d(h) {
    this.dom = h, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const s = this, b = h.tagName, v = h.type, g = b === "SELECT" || v === "checkbox" || v === "radio";
    this._onInput = function() {
      s._touched = !0, s.validate();
    }, this._onChange = function() {
      s._touched = !0, s.validate();
    }, this._onSetCustom = function(c) {
      const a = c.detail && c.detail.error;
      if (!a) return;
      s._customErrors.add(a), s._touched = !0;
      const i = s._getErrorItems();
      if (i)
        for (let _ = 0; _ < i.length; _++)
          i[_].key === a && i[_].el.classList.remove("hidden");
      h.classList.remove(p), h.classList.add(m), h.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(c) {
      const a = c.detail && c.detail.error, i = s._getErrorItems();
      if (a) {
        if (s._customErrors.delete(a), i)
          for (let _ = 0; _ < i.length; _++)
            i[_].key === a && i[_].el.classList.add("hidden");
      } else {
        if (i)
          for (let _ = 0; _ < i.length; _++)
            s._customErrors.has(i[_].key) && i[_].el.classList.add("hidden");
        s._customErrors.clear();
      }
      s._touched && s.validate();
    }, g || h.addEventListener("input", this._onInput), h.addEventListener("change", this._onChange), h.addEventListener("ln-validate:set-custom", this._onSetCustom), h.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const f = h.form;
    return f && (f.hasAttribute("novalidate") || f.setAttribute("novalidate", ""), this._onFormReset = function() {
      s.reset();
    }, this._onValidateRequest = function(c) {
      s._touched = !0, !s.validate() && c.detail && c.detail.invalidFields && c.detail.invalidFields.push(s.dom);
    }, f.addEventListener("reset", this._onFormReset), f.addEventListener("ln-validate:request-validate", this._onValidateRequest), f._lnValidateGateBound || (f._lnValidateGateBound = !0, f.addEventListener("submit", function(c) {
      const a = { invalidFields: [] };
      L(f, "ln-validate:request-validate", a), a.invalidFields.length > 0 && (c.preventDefault(), a.invalidFields.sort((i, _) => i.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), a.invalidFields[0].focus());
    }))), hr(h) && (this._touched = !0, this.validate()), this;
  }
  d.prototype._getErrorItems = function() {
    if (this._errorItems !== void 0) return this._errorItems;
    const h = this.dom.closest(":has(> [" + n + "])");
    if (h) {
      const s = h.querySelector("[" + n + "]");
      if (s) {
        const b = s.querySelectorAll("[" + l + "]");
        this._errorItems = [];
        for (let v = 0; v < b.length; v++)
          this._errorItems.push({
            el: b[v],
            key: b[v].getAttribute(l)
          });
        return this._errorItems;
      }
    }
    return this._errorItems = null, null;
  }, d.prototype.validate = function() {
    const h = this.dom, s = h.validity, b = hn(s, this._customErrors.size), v = pr(s, this._customErrors), g = this._getErrorItems();
    if (g)
      for (let a = 0; a < g.length; a++) {
        const i = !v.includes(g[a].key);
        g[a].el.classList.contains("hidden") !== i && g[a].el.classList.toggle("hidden", i);
      }
    h.classList.contains(p) !== b && h.classList.toggle(p, b), h.classList.contains(m) === b && h.classList.toggle(m, !b);
    const f = b ? "false" : "true";
    return h.getAttribute("aria-invalid") !== f && h.setAttribute("aria-invalid", f), L(h, b ? "ln-validate:valid" : "ln-validate:invalid", { target: h, field: h.name, errors: v }), b;
  }, d.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(p) && this.dom.classList.remove(p), this.dom.classList.contains(m) && this.dom.classList.remove(m), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const h = this._getErrorItems();
    if (h)
      for (let s = 0; s < h.length; s++)
        h[s].el.classList.contains("hidden") || h[s].el.classList.add("hidden");
  }, Object.defineProperty(d.prototype, "isValid", {
    get: function() {
      return hn(this.dom.validity, this._customErrors.size);
    }
  }), d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const h = this.dom.form;
    h && (this._onFormReset && h.removeEventListener("reset", this._onFormReset), this._onValidateRequest && h.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(p, m), this.dom.removeAttribute("aria-invalid"), this._errorItems = null, delete this.dom[e];
  }, B(t, e, d, "ln-validate", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", n = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let l = null;
  function p(g) {
    if (!g.hasAttribute(t) || g[e]) return;
    g[e] = !0;
    const f = s(g);
    m(f.links), u(f.forms);
  }
  function m(g) {
    for (const f of g) {
      if (f[e + "Trigger"] || f.hostname && f.hostname !== window.location.hostname) continue;
      const c = f.getAttribute("href");
      if (c && c.includes("#")) continue;
      const a = function(i) {
        if (!On(i, f)) return;
        i.preventDefault();
        const _ = f.getAttribute("href");
        _ && h("GET", _, null, f);
      };
      f.addEventListener("click", a), f[e + "Trigger"] = a;
    }
  }
  function u(g) {
    for (const f of g) {
      if (f[e + "Trigger"]) continue;
      if (f.hasAttribute(n)) {
        f[e + "ScopeWarned"] || (f[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const c = function(a) {
        if (a.defaultPrevented) return;
        a.preventDefault();
        const i = f.method.toUpperCase(), _ = f.action, r = new FormData(f);
        for (const y of f.querySelectorAll('button, input[type="submit"]'))
          y.disabled = !0;
        h(i, _, r, f, function() {
          for (const y of f.querySelectorAll('button, input[type="submit"]'))
            y.disabled = !1;
        });
      };
      f.addEventListener("submit", c), f[e + "Trigger"] = c;
    }
  }
  function d(g) {
    if (!g[e]) return;
    const f = s(g);
    for (const c of f.links)
      c[e + "Trigger"] && (c.removeEventListener("click", c[e + "Trigger"]), delete c[e + "Trigger"]);
    for (const c of f.forms)
      c[e + "Trigger"] && (c.removeEventListener("submit", c[e + "Trigger"]), delete c[e + "Trigger"]);
    delete g[e];
  }
  function h(g, f, c, a, i) {
    if (W(a, "ln-ajax:before-start", { method: g, url: f }).defaultPrevented) return;
    g === "GET" && l && l(), L(a, "ln-ajax:start", { method: g, url: f }), a.classList.add("ln-ajax--loading");
    const r = document.createElement("span");
    r.className = "ln-ajax-spinner", a.appendChild(r);
    function y() {
      a.classList.remove("ln-ajax--loading");
      const C = a.querySelector(".ln-ajax-spinner");
      C && C.remove(), i && i();
    }
    let o = f;
    const A = document.querySelector('meta[name="csrf-token"]'), w = A ? A.getAttribute("content") : null;
    c instanceof FormData && w && c.append("_token", w);
    const S = {
      method: g,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (S.headers["X-CSRF-TOKEN"] = w), g === "GET" && c) {
      const C = new URLSearchParams(c);
      o = f + (f.includes("?") ? "&" : "?") + C.toString();
    } else g !== "GET" && c && (S.body = c);
    let E = null;
    if (g === "GET") {
      const C = new AbortController();
      S.signal = C.signal, E = function() {
        l = null, C.abort(), y(), L(a, "ln-ajax:aborted", { method: g, url: o });
      }, l = E;
    }
    fetch(o, S).then(function(C) {
      const T = C.ok, x = C.status;
      return C.text().then(function(I) {
        let q = null, D = null;
        if (I && I.trim())
          try {
            q = JSON.parse(I);
          } catch (N) {
            D = N;
          }
        return { ok: T, status: x, data: q, parseError: D };
      });
    }).then(function(C) {
      E && l === E && (l = null);
      const T = C.status, x = C.data, I = C.parseError;
      if (C.ok && !I) {
        if (x && x.title && (document.title = x.title), x && x.content)
          for (const q in x.content) {
            const D = document.getElementById(q);
            D && (D.innerHTML = x.content[q]);
          }
        if (a.tagName === "A") {
          const q = a.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else a.tagName === "FORM" && a.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", o);
        L(a, "ln-ajax:success", { method: g, url: o, data: x });
      } else
        L(a, "ln-ajax:error", {
          method: g,
          url: o,
          status: T,
          data: x,
          error: I || null
        });
      y(), L(a, "ln-ajax:complete", { method: g, url: o });
    }).catch(function(C) {
      C && C.name === "AbortError" || (E && l === E && (l = null), L(a, "ln-ajax:error", { method: g, url: o, status: 0, data: null, error: C }), y(), L(a, "ln-ajax:complete", { method: g, url: o }));
    });
  }
  function s(g) {
    const f = { links: [], forms: [] };
    return g.tagName === "A" && g.getAttribute(t) !== "false" ? f.links.push(g) : g.tagName === "FORM" && g.getAttribute(t) !== "false" ? f.forms.push(g) : (f.links = Array.from(g.querySelectorAll('a:not([data-ln-ajax="false"])')), f.forms = Array.from(g.querySelectorAll('form:not([data-ln-ajax="false"])'))), f;
  }
  function b() {
    ft(function() {
      Jt({
        onInit: function(g) {
          if (p(g), !g.hasAttribute(t)) {
            for (const c of g.querySelectorAll("[" + t + "]"))
              p(c);
            const f = g.closest && g.closest("[" + t + "]");
            if (f && f.getAttribute(t) !== "false") {
              const c = s(g);
              m(c.links), u(c.forms);
            }
          }
        }
      }), qt([t], function(g) {
        p(g);
      });
    }, "ln-ajax");
  }
  function v() {
    for (const g of document.querySelectorAll("[" + t + "]"))
      p(g);
  }
  window[e] = p, window[e].destroy = d, b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", v) : v();
})();
function mr(t, { isHydration: e = !1, hasPrimaryRegion: n = !1, primaryMatch: l = null } = {}) {
  const p = n ? !l : !t.some((s) => s.match), m = [], u = [];
  for (const s of t)
    if (!(!s.targetEl && !s.isPending)) {
      if (!s.match) {
        const b = e && s.hasHydrate && s.hasChildren;
        !s.hasKeep && s.hasChildren && !b && s.targetEl && m.push(s);
        continue;
      }
      s.hasKeep && s.mountedTemplate === s.match.route.templateNode || u.push(Object.assign({}, s, {
        skipMount: e && s.hasHydrate && s.hasChildren
      }));
    }
  u.sort((s, b) => s.regionKey === "__primary__" ? -1 : b.regionKey === "__primary__" ? 1 : 0);
  const h = u.find((s) => s.regionKey === "__primary__") || u[0] || null;
  return { notFound: p, clears: m, swaps: u, owner: h };
}
function Gt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function gr(t, e) {
  const n = Gt(e);
  if (!n) return t && t.replace(/\/+$/, "") || "/";
  const l = (t || "/").replace(/\/+$/, "") || "/";
  return l === n ? "/" : l.startsWith(n + "/") ? l.slice(n.length).replace(/\/+$/, "") || "/" : l;
}
function li(t, e) {
  const n = Gt(e);
  if (!n) return t || "/";
  const l = t || "/", p = l.indexOf("#"), m = p !== -1 ? l.slice(0, p) : l, u = p !== -1 ? l.slice(p) : "", d = m.indexOf("?"), h = d !== -1 ? m.slice(0, d) : m, s = d !== -1 ? m.slice(d) : "";
  let b;
  if (h === n)
    b = n + "/";
  else if (h.startsWith(n + "/"))
    b = h;
  else {
    const v = h.startsWith("/") ? h : "/" + h;
    b = v === "/" ? n + "/" : n + v;
  }
  return b + s + u;
}
function Ne() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Gt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const n = new URL(e.getAttribute("href"), window.location.origin);
      return Gt(n.pathname);
    } catch {
      return Gt(e.getAttribute("href"));
    }
  return "";
}
const ci = {
  navigate: function(t) {
    Xt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Xt(t, { historyAction: "replace" });
  },
  base: function() {
    return Ne();
  },
  toUrl: function(t) {
    return li(t, Ne());
  },
  current: function() {
    return he === null ? null : {
      path: he,
      fullPath: fi,
      base: hi,
      params: pi,
      query: mi,
      route: gi,
      regions: ui
    };
  }
}, tn = "data-ln-route", di = "lnRoute";
typeof window < "u" && (window.lnRouter = ci);
function Ae(t) {
  wi(t), vi(t), gt.size > 0 && yi();
}
const _r = {
  "data-ln-route": { effect: Ae, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: Ae, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: Ae, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, gt = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new WeakMap();
let ui = /* @__PURE__ */ new Map(), pn = !1, he = null, fi = null, hi = "", pi = {}, mi = {}, gi = null, Me = !1;
function mn(t, e, n) {
  Me ? queueMicrotask(function() {
    L(t, e, n);
  }) : L(t, e, n);
}
function en(t) {
  try {
    const d = new URL(t, window.location.origin);
    t = d.pathname + d.search + d.hash;
  } catch {
  }
  let [e] = t.split("#"), [n, l] = e.split("?");
  const p = {};
  if (l) {
    const d = new URLSearchParams(l);
    for (const [h, s] of d.entries())
      p[h] = s;
  }
  const m = Ne();
  return { path: gr(n, m), query: p, base: m };
}
function _i(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const n = t.segments, l = e.segments, p = Math.max(n.length, l.length);
  for (let m = 0; m < p; m++) {
    const u = n[m], d = l[m];
    if (u === void 0) return 1;
    if (d === void 0) return -1;
    if (u === "*") return 1;
    if (d === "*") return -1;
    const h = u.startsWith(":"), s = d.startsWith(":");
    if (h && !s) return 1;
    if (!h && s) return -1;
  }
  return 0;
}
function bi(t, e) {
  const n = t.split("/").filter(Boolean);
  for (const l of e) {
    if (l.pattern === "*")
      return {
        route: l,
        params: { wildcard: t }
      };
    const p = l.segments, m = {};
    let u = !0;
    if (!(n.length > p.length && p[p.length - 1] !== "*")) {
      for (let d = 0; d < p.length; d++) {
        const h = p[d], s = n[d];
        if (h === "*") {
          m.wildcard = n.slice(d).join("/");
          break;
        }
        if (s === void 0) {
          u = !1;
          break;
        }
        if (h.startsWith(":"))
          m[h.slice(1)] = decodeURIComponent(s);
        else if (h !== s) {
          u = !1;
          break;
        }
      }
      if (u && (p.indexOf("*") !== -1 || n.length <= p.length))
        return { route: l, params: m };
    }
  }
  return null;
}
function Fe(t, e = {}) {
  const n = e.warn !== !1;
  if (t !== "__primary__") {
    const p = document.getElementById(t);
    return !p && n && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), p;
  }
  const l = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !l && n && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), l;
}
function gn(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), n = [t].concat(e);
  for (const p of n)
    for (const m of Object.keys(p))
      if (m.startsWith("ln") && p[m] && typeof p[m].destroy == "function")
        try {
          p[m].destroy();
        } catch (u) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, p, u);
        }
  const l = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of l) {
    const m = p.lnPopover;
    if (m && m.trigger && t.contains(m.trigger))
      try {
        m.destroy();
      } catch (u) {
        console.error("[ln-router] Error destroying open popover:", u);
      }
  }
}
function Xt(t, e = {}) {
  const { path: n, query: l, base: p } = en(t), m = li(t, p), u = /* @__PURE__ */ new Map();
  for (const [c, a] of gt)
    u.set(c, bi(n, a.sorted));
  const d = u.get("__primary__") || null, h = Fe("__primary__", { warn: !!d }), s = gt.has("__primary__"), b = [];
  for (const [c, a] of u) {
    const i = c === "__primary__" ? h : Fe(c, { warn: !1 }), _ = !i && !!(d && d.route && d.route.templateNode && d.route.templateNode.content && d.route.templateNode.content.querySelector("#" + CSS.escape(c)));
    !i && !_ && a && console.warn(`[ln-router] Explicit target element #${c} not found in DOM`), b.push({
      regionKey: c,
      match: a,
      targetEl: i,
      isPending: _,
      hasKeep: !!i && i.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!i && i.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!i && i.children.length > 0,
      mountedTemplate: i && Ee.get(i) || null
    });
  }
  const v = mr(b, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: s,
    primaryMatch: d
  });
  if (v.notFound) {
    mn(document.body, "ln-router:not-found", { path: n });
    return;
  }
  if (W(h || document.body, "ln-router:before-navigate", {
    from: he,
    to: m,
    path: n,
    params: d ? d.params : {},
    query: l
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", m) : e.historyAction === "replace" && window.history.replaceState(null, "", m);
  const f = function() {
    for (const c of v.clears)
      gn(c.targetEl), c.targetEl.replaceChildren(), Ee.delete(c.targetEl);
    for (const c of v.swaps) {
      if ((c.isPending || !c.targetEl || !document.contains(c.targetEl)) && (c.targetEl = c.regionKey === "__primary__" ? h : document.getElementById(c.regionKey)), !c.targetEl) {
        console.warn(`[ln-router] Target element #${c.regionKey} could not be resolved`);
        continue;
      }
      if (c.skipMount || (gn(c.targetEl), c.targetEl.replaceChildren(c.match.route.templateNode.content.cloneNode(!0))), Ee.set(c.targetEl, c.match.route.templateNode), v.owner && c.regionKey === v.owner.regionKey) {
        if (c.match.route.title) {
          let a = c.match.route.title;
          if (c.match.params)
            for (const [i, _] of Object.entries(c.match.params))
              a = a.replace(new RegExp("\\{\\{\\s*" + i + "\\s*\\}\\}", "g"), _);
          document.title = a;
        }
        if (!e.isHydration) {
          c.targetEl.hasAttribute("tabindex") || c.targetEl.setAttribute("tabindex", "-1");
          const a = c.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          a ? (a.setAttribute("tabindex", "-1"), a.focus()) : c.targetEl.focus(), c.regionKey === "__primary__" && c.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      mn(c.targetEl, "ln-router:navigated", {
        path: n,
        fullPath: m,
        base: p,
        params: c.match.params,
        query: l,
        route: c.match.route,
        target: c.targetEl,
        region: c.regionKey
      });
    }
    he = n, fi = m, hi = p, mi = l, gi = d ? d.route : null, pi = d ? d.params : {}, ui = new Map(
      Array.from(u.entries()).map(([c, a]) => [c, a ? { route: a.route, params: a.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(f) : f();
}
function br(t) {
  const e = t.target.closest("a");
  if (!e || !On(t, e)) return;
  const n = e.getAttribute("href"), { path: l } = en(n);
  for (const p of gt.values())
    if (bi(l, p.sorted)) {
      t.preventDefault(), Xt(n, { historyAction: "push" });
      return;
    }
}
function yr(t, e) {
  const n = Object.keys(t), l = Object.keys(e);
  if (n.length !== l.length) return !1;
  for (let p = 0; p < n.length; p++) {
    const m = n[p];
    if (t[m] !== e[m]) return !1;
  }
  return !0;
}
function vr() {
  const t = window.location.pathname + window.location.search, e = ci.current();
  if (e && e.path != null) {
    const n = en(t);
    if (e.path === n.path && yr(e.query, n.query))
      return;
  }
  Xt(t, { historyAction: "skip" });
}
function yi() {
  pn || (pn = !0, ft(function() {
    document.addEventListener("click", br), window.addEventListener("popstate", vr), Me = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Xt(t, { historyAction: "replace", isHydration: !0 }), Me = !1;
  }, "ln-router"));
}
function vi(t) {
  const e = t.getAttribute(tn);
  if (!e) return;
  const n = t.getAttribute("data-ln-route-target") || null;
  if (n === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const l = n || "__primary__";
  gt.has(l) || gt.set(l, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = gt.get(l);
  if (p.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${l}"`);
    return;
  }
  const m = t.getAttribute("data-ln-route-title"), u = e.split("/").filter(Boolean), d = {
    pattern: e,
    segments: u,
    target: n,
    title: m,
    templateNode: t
  }, h = Fe(l);
  h && h.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), p.routes.set(e, d), p.sorted = Array.from(p.routes.values()).sort(_i);
}
function wi(t) {
  const e = t.getAttribute(tn);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null || "__primary__", p = gt.get(l);
  p && (p.routes.delete(e), p.sorted = Array.from(p.routes.values()).sort(_i), p.routes.size === 0 && gt.delete(l));
}
function Ai(t) {
  return this.dom = t, vi(t), this;
}
Ai.prototype.destroy = function() {
  wi(this.dom), delete this.dom[di];
};
B(tn, di, Ai, "ln-router", {
  attributes: _r,
  onInit: function() {
    gt.size > 0 && yi();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", n = "data-ln-modal-for", l = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: b,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-for": {
      type: "string",
      description: "Target modal ID to open on trigger click"
    },
    "data-ln-modal-mode": {
      type: "enum",
      values: ["new", "edit"],
      fallback: "new",
      description: "Operational mode of the modal (new vs edit)"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  }, m = /* @__PURE__ */ new Set();
  let u = null;
  function d() {
    u || (u = function(v) {
      if (xt(v)) return;
      const g = v.target.closest("[" + n + "]");
      if (!g || Ke(g)) return;
      const f = g.getAttribute(n);
      if (!f) return;
      const c = document.getElementById(f);
      !c || !c[e] || (v.preventDefault(), g.hasAttribute("data-ln-modal-mode") ? c.setAttribute("data-ln-modal-mode", g.getAttribute("data-ln-modal-mode")) : c.hasAttribute("data-ln-modal-mode") && c.setAttribute("data-ln-modal-mode", "new"), c.setAttribute(t, "open"));
    }, document.addEventListener("click", u));
  }
  function h() {
    m.size > 0 || !u || (document.removeEventListener("click", u), u = null);
  }
  function s(v) {
    this.dom = v, this.isOpen = v.getAttribute(t) === "open";
    const g = this;
    return this._onRequestOpen = function() {
      g.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      g.dom.setAttribute(t, "close");
    }, this._onCancel = function(f) {
      f.preventDefault(), g.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !g.isOpen || g.dom.getAttribute(t) !== "open" || g.dom.open || (g._isNativeClosing = !0, g.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(f) {
      const c = f.target.closest("[" + l + "]");
      c && g.dom.contains(c) && (f.preventDefault(), g.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), m.add(this), d(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), L(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  s.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, s.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, s.prototype.toggle = function() {
    const v = this.dom.getAttribute(t);
    this.dom.setAttribute(t, v === "open" ? "close" : "open");
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), m.delete(this), h(), this.isOpen) {
        const v = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(f) {
            return f !== v;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function b(v) {
    const g = v[e];
    if (!g) return;
    const f = !!g._isNativeClosing;
    g._isNativeClosing = !1;
    const a = v.getAttribute(t) === "open";
    if (a === g.isOpen) {
      a && v.isConnected && !v.open && typeof v.showModal == "function" && v.showModal();
      return;
    }
    if (a) {
      if (W(v, "ln-modal:before-open", { modalId: v.id, target: v }).defaultPrevented) {
        v.setAttribute(t, "close");
        return;
      }
      g.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof v.showModal == "function" && v.showModal();
      const _ = v.querySelector("[autofocus]");
      if (_ && Vt(_))
        _.focus();
      else {
        const r = v.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), y = Array.prototype.find.call(r, Vt);
        if (y) y.focus();
        else {
          const o = v.querySelectorAll("a[href], button:not([disabled])"), A = Array.prototype.find.call(o, Vt);
          A && A.focus();
        }
      }
      L(v, "ln-modal:open", { modalId: v.id, target: v });
    } else {
      if (!f && W(v, "ln-modal:before-close", { modalId: v.id, target: v }).defaultPrevented) {
        v.setAttribute(t, "open");
        return;
      }
      g.isOpen = !1, v.hasAttribute("data-ln-modal-mode") && v.setAttribute("data-ln-modal-mode", "new"), typeof v.close == "function" && v.open && v.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), L(v, "ln-modal:close", { modalId: v.id, target: v });
    }
  }
  B(t, e, s, "ln-modal", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-ui-coordinator": {
      type: "marker",
      description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts"
    }
  };
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const u = m.target.closest('a[href^="#"]');
    if (!u) return;
    const d = u.getAttribute("href"), h = Qt(d);
    for (const s in h) {
      const b = document.getElementById(s);
      if (b && b.lnModal) {
        if (!Je(m)) return;
        mt(s, h[s]), b.lnModal.isOpen || L(b, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function l() {
    const m = location.hash;
    if (!m) return;
    const u = Qt(m);
    for (const d in u) {
      const h = document.getElementById(d);
      h && h.lnModal && !h.lnModal.isOpen && L(h, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", l), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l(), document.addEventListener("ln-modal:close", function(m) {
    const u = m.target;
    u && u.id && at(u.id) !== null && mt(u.id, null);
  }), document.addEventListener("ln-ajax:success", function(m) {
    const d = (m.detail || {}).data;
    if (d && d.message) {
      const s = d.message;
      L(window, "ln-toast:enqueue", {
        type: s.type || "success",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
    const h = m.target.closest("[data-ln-modal]");
    h && h.lnModal && (h.id && at(h.id) !== null && mt(h.id, null), L(h, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(m) {
    const d = (m.detail || {}).data;
    if (d && d.message) {
      const h = d.message;
      L(window, "ln-toast:enqueue", {
        type: h.type || "error",
        title: h.title || "",
        message: typeof h == "string" ? h : h.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(m) {
    const u = m.detail || {};
    u.message && L(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: u.message
    });
  });
  function p(m) {
    return this.dom = m, this;
  }
  p.prototype.destroy = function() {
    delete this.dom[e];
  }, B(t, e, p, "ln-ui-coordinator", {
    attributes: n
  });
})();
function wr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let n = e, l = 0;
  for (let p = 0; p < t.length && n > 0; p++)
    l = p + 1, /[0-9]/.test(t[p]) && n--;
  return n > 0 && (l = t.length), l;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function n(b) {
    const v = b[e];
    v && (v.isTextElement ? v._initTextElement() : isNaN(v.value) || v._displayFormatted(v.value));
  }
  const l = {
    "data-ln-number": { type: "marker", effect: n, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: n, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: n, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: n, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: n, description: "Maximum allowed numeric value" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), m = /* @__PURE__ */ new Set();
  let u = !1;
  function d() {
    me(), !u && (u = !0, document.addEventListener("ln-core:locale-change", function() {
      m.forEach(function(b) {
        b.isTextElement ? b._formatTextContent() : isNaN(b.value) || b._displayFormatted(b.value);
      });
    }));
  }
  function h(b) {
    if (b[e]) return b[e];
    b[e] = this, this.dom = b;
    const v = this;
    if (m.add(this), d(), b.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const g = document.createElement("input");
    g.type = "hidden", g.name = b.name, b.removeAttribute("name"), b.hasAttribute("data-ln-fill-as") && g.setAttribute("data-ln-fill-as", b.getAttribute("data-ln-fill-as")), b.type = "text", b.setAttribute("inputmode", "decimal"), b.insertAdjacentElement("afterend", g), this._hidden = g, Object.defineProperty(g, "value", {
      get: function() {
        return p.get.call(g);
      },
      set: function(c) {
        if (p.set.call(g, c), c !== "" && !isNaN(parseFloat(c))) {
          const a = v.dom.getAttribute("data-ln-number-decimals");
          v._setDisplayRaw(rt(parseFloat(c), J(v.dom), { maxDecimals: a }));
        } else
          v._setDisplayRaw("");
        v.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Ve(b, p, {
      get: function() {
        return p.get.call(b);
      },
      set: function(c) {
        if (c === "") {
          v._setDisplayRaw(""), v._setHiddenRaw(""), b.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const a = typeof c == "number" ? c : parseFloat(String(c));
        if (isNaN(a))
          v._setDisplayRaw(String(c)), v._setHiddenRaw("");
        else {
          v._setHiddenRaw(a);
          const i = b.getAttribute("data-ln-number-decimals");
          v._setDisplayRaw(rt(a, J(b), { maxDecimals: i }));
        }
        b.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      v._handleInput();
    }, b.addEventListener("input", this._onInput), this._onKeyDown = function(c) {
      if (c.key !== "Backspace") return;
      const a = b.selectionStart, i = b.selectionEnd;
      if (a !== i || a === 0) return;
      const _ = fe(J(b)), r = p.get.call(b), y = r[a - 1];
      if (y === _.groupSep || /\s/.test(y)) {
        c.preventDefault();
        const o = a - 2 >= 0 ? a - 2 : 0, A = r.slice(0, o) + r.slice(a);
        p.set.call(b, A), b.setSelectionRange(o, o), b.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, b.addEventListener("keydown", this._onKeyDown), this._onPaste = function(c) {
      c.preventDefault();
      const a = (c.clipboardData || window.clipboardData).getData("text"), i = sr(a, J(b));
      v.value = isNaN(i) ? NaN : i;
    }, b.addEventListener("paste", this._onPaste);
    const f = b.value;
    if (f !== "") {
      const c = parseFloat(f);
      if (!isNaN(c)) {
        const a = b.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(c), this._setDisplayRaw(rt(c, J(b), { maxDecimals: a })), b.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return b.form && (this._onFormReset = function() {
      setTimeout(function() {
        const c = b.defaultValue;
        if (c !== "") {
          const a = parseFloat(c);
          if (!isNaN(a)) {
            const i = b.getAttribute("data-ln-number-decimals");
            v._setHiddenRaw(a), v._setDisplayRaw(rt(a, J(b), { maxDecimals: i })), b.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        v._setHiddenRaw(""), v._setDisplayRaw(""), b.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, b.form.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype._initTextElement = function() {
    const b = this.dom;
    let v = b.getAttribute("data-ln-value"), g = b.getAttribute("data-ln-number"), f = null;
    v !== null && v !== "" ? f = v : g !== null && g !== "" && g !== "true" ? f = g : f = b.textContent.trim();
    const c = parseFloat(f);
    isNaN(c) ? this._rawValue = null : (this._rawValue = c, b.hasAttribute("data-ln-value") || (this._autoValue = !0, b.setAttribute("data-ln-value", String(c))), this._formatTextContent());
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const b = this.dom.getAttribute("data-ln-number-decimals"), v = rt(this._rawValue, J(this.dom), { maxDecimals: b });
      this._formattedText = v, this.dom.textContent !== v && (this.dom.textContent = v);
    }
  }, h.prototype._handleInput = function() {
    const b = this.dom, v = p.get.call(b);
    if (v === "") {
      this._setHiddenRaw(""), L(b, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (v === "-") {
      this._setHiddenRaw(""), L(b, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const g = b.selectionStart;
    let f = 0;
    for (let C = 0; C < g; C++)
      /[0-9]/.test(v[C]) && f++;
    const c = J(b), a = fe(c);
    let i = v, _ = oi(v, a.groupSep, a.decimalSep), r = parseFloat(_);
    if (isNaN(r)) {
      this._setHiddenRaw(""), L(b, "ln-number:input", { value: NaN, formatted: v });
      return;
    }
    const y = b.getAttribute("data-ln-number-decimals"), o = _.indexOf(".");
    if (y !== null && o !== -1) {
      const C = parseInt(y, 10), T = _.slice(o + 1);
      if (C === 0)
        _ = _.slice(0, o), i = i.split(a.decimalSep)[0], r = parseFloat(_), this._setDisplayRaw(i);
      else if (T.length > C) {
        _ = _.slice(0, o + 1 + C);
        const x = i.split(a.decimalSep);
        i = x[0] + a.decimalSep + x[1].slice(0, C), r = parseFloat(_), this._setDisplayRaw(i);
      }
    }
    const A = b.getAttribute("data-ln-number-max");
    if (A !== null && r > parseFloat(A)) {
      const C = parseFloat(A), T = rt(C, c, { maxDecimals: y });
      this._setDisplayRaw(T), this._setHiddenRaw(C), b.setSelectionRange(T.length, T.length), L(b, "ln-number:input", { value: C, formatted: T });
      return;
    }
    if (i.endsWith(a.decimalSep) || a.decimalSep !== "." && i.endsWith(".")) {
      this._setHiddenRaw(r), L(b, "ln-number:input", { value: r, formatted: i });
      return;
    }
    const w = _.indexOf(".");
    if (w !== -1 && _.slice(w + 1).endsWith("0")) {
      this._setHiddenRaw(r), L(b, "ln-number:input", { value: r, formatted: i });
      return;
    }
    let S;
    if (y !== null)
      S = rt(r, c, { maxDecimals: y });
    else {
      const C = w !== -1 ? _.slice(w + 1).length : 0;
      S = rt(r, c, { userDecimals: C });
    }
    this._setDisplayRaw(S);
    const E = wr(S, f);
    b.setSelectionRange(E, E), this._setHiddenRaw(r), L(b, "ln-number:input", { value: r, formatted: S });
  }, h.prototype._setHiddenRaw = function(b) {
    this._hidden && p.set.call(this._hidden, String(b));
  }, h.prototype._setDisplayRaw = function(b) {
    this.isTextElement ? this.dom.textContent = String(b) : p.set.call(this.dom, String(b));
  }, h.prototype._displayFormatted = function(b) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const v = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(b, J(this.dom), { maxDecimals: v }));
    }
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const b = p.get.call(this._hidden);
      return b === "" ? NaN : parseFloat(b);
    },
    set: function(b) {
      const v = typeof b == "number" ? b : parseFloat(b);
      if (this.isTextElement) {
        isNaN(v) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = v, this.dom.setAttribute("data-ln-value", String(v)), this._formatTextContent());
        return;
      }
      if (isNaN(v)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(v);
      const g = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(v, J(this.dom), { maxDecimals: g })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : p.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (m.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  };
  function s(b) {
    const v = b[e];
    !v || !v.isTextElement || b.textContent !== v._formattedText && (v._autoValue && b.removeAttribute("data-ln-value"), v._initTextElement());
  }
  B(t, e, h, "ln-number", {
    attributes: l,
    extraAttributes: ["lang"],
    onAttributeChange: n,
    onSubtreeChange: s
  });
})();
const Pe = /^(short|medium|long)(\s+datetime)?$/, Ar = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Er(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Pe) ? Ar[t.trim()] : null;
}
function jt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let n, l;
  if (e.indexOf(".") !== -1)
    n = ".", l = e.split(".");
  else if (e.indexOf("/") !== -1)
    n = "/", l = e.split("/");
  else if (e.indexOf("-") !== -1)
    n = "-", l = e.split("-");
  else
    return null;
  if (l.length !== 3) return null;
  const p = [];
  for (let s = 0; s < 3; s++) {
    const b = parseInt(l[s], 10);
    if (isNaN(b)) return null;
    p.push(b);
  }
  let m, u, d;
  n === "." ? (m = p[0], u = p[1], d = p[2]) : n === "/" ? (u = p[0], m = p[1], d = p[2]) : l[0].length === 4 ? (d = p[0], u = p[1], m = p[2]) : (m = p[0], u = p[1], d = p[2]), d < 100 && (d += d < 50 ? 2e3 : 1900);
  const h = new Date(d, u - 1, m);
  return h.getFullYear() !== d || h.getMonth() !== u - 1 || h.getDate() !== m ? null : h;
}
function Se(t, e, n, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const p = t.getDate(), m = t.getMonth(), u = t.getFullYear(), d = t.getHours(), h = t.getMinutes();
  let s, b;
  const v = (n || "").toLowerCase().split("-")[0];
  let g = !1;
  try {
    const a = new Intl.DateTimeFormat(n, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    g = !!(l && a !== v);
  } catch {
    g = !!l;
  }
  if (g && l && l.monthsLong)
    s = l.monthsLong[m];
  else
    try {
      s = new Intl.DateTimeFormat(n, { month: "long" }).format(t);
    } catch {
      s = String(m + 1);
    }
  if (g && l && l.monthsShort)
    b = l.monthsShort[m];
  else
    try {
      b = new Intl.DateTimeFormat(n, { month: "short" }).format(t);
    } catch {
      b = String(m + 1);
    }
  const f = {
    yyyy: String(u),
    yy: String(u).slice(-2),
    MMMM: s,
    MMM: b,
    MM: String(m + 1).padStart(2, "0"),
    M: String(m + 1),
    dd: String(p).padStart(2, "0"),
    d: String(p),
    HH: String(d).padStart(2, "0"),
    mm: String(h).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(c) {
    return f[c] !== void 0 ? f[c] : c;
  });
}
function ne(t, e, n, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const p = Er(e);
  if (p)
    try {
      const m = new Intl.DateTimeFormat(n, p), u = (n || "").toLowerCase().split("-")[0], d = m.resolvedOptions().locale.toLowerCase().split("-")[0];
      return l && d !== u ? Se(t, "dd.MM.yyyy", n, l) : m.format(t);
    } catch {
      return Se(t, "dd.MM.yyyy", n, l);
    }
  return Se(t, e || "dd.MM.yyyy", n, l);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function n(f) {
    const c = f[e];
    if (c) {
      if (c.isTextElement)
        c._initTextElement();
      else if (c.value) {
        const a = it(c.value);
        a && c._displayFormatted(a);
      }
    }
  }
  const l = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: n, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: n, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: n, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: n, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(f, c, a) {
    L(f.dom, "ln-date:change", {
      value: c,
      formatted: f.dom.value,
      date: a
    }), f.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function u(f, c, a, i) {
    f._setHiddenRaw(c), p.set.call(f._picker, c), f._lastISO = c, i !== void 0 ? (f._isFormatting = !0, f.dom.value = i, f._isFormatting = !1) : a && f._displayFormatted(a), m(f, c, a);
  }
  function d(f) {
    f._setHiddenRaw(""), p.set.call(f._picker, ""), f._isFormatting = !0, f.dom.value = "", f._isFormatting = !1, f._lastISO = "", m(f, "", null);
  }
  const h = /* @__PURE__ */ new Set();
  let s = !1;
  function b() {
    me(), !s && (s = !0, document.addEventListener("ln-core:locale-change", function() {
      h.forEach(function(f) {
        if (f.isTextElement)
          f._formatTextContent();
        else if (f.value) {
          const c = it(f.value);
          c && f._displayFormatted(c);
        }
      });
    }));
  }
  function v(f) {
    if (f[e]) return f[e];
    f[e] = this, this.dom = f;
    const c = this;
    if (h.add(this), b(), f.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const a = f.value, i = f.name, _ = f.parentNode;
    if (_) {
      const S = _.querySelectorAll("[data-ln-date-dict]");
      for (let E = 0; E < S.length; E++) {
        const C = S[E].getAttribute("data-ln-date-dict");
        if (C) {
          const T = $e(S[E], "data-ln-date-dict-key");
          T["months-long"] && (T.monthsLong = T["months-long"].split(",").map((x) => x.trim())), T["months-short"] && (T.monthsShort = T["months-short"].split(",").map((x) => x.trim())), Bn(C, T);
        }
      }
    }
    const r = document.createElement("span");
    r.setAttribute("data-ln-date-field", ""), f.parentNode.insertBefore(r, f), r.appendChild(f), this._wrapper = r;
    const y = document.createElement("input");
    y.type = "hidden", y.name = i, f.removeAttribute("name"), f.hasAttribute("data-ln-fill-as") && y.setAttribute("data-ln-fill-as", f.getAttribute("data-ln-fill-as")), f.insertAdjacentElement("afterend", y), this._hidden = y;
    const o = document.createElement("input");
    o.type = "date", o.tabIndex = -1, o.setAttribute("tabindex", "-1"), o.setAttribute("aria-hidden", "true"), o.setAttribute("aria-label", f.getAttribute("data-ln-date-label") || "Date picker"), o.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", o), this._picker = o, f.type = "text";
    const A = document.createElement("button");
    A.type = "button", A.setAttribute("aria-label", f.getAttribute("data-ln-date-label") || "Open date picker"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', o.insertAdjacentElement("afterend", A), this._btn = A, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return p.get.call(y);
      },
      set: function(S) {
        if (p.set.call(y, S), S && S !== "") {
          const E = it(S);
          E && u(c, S, E);
        } else S === "" && d(c);
      }
    }), Ve(f, p, {
      get: function() {
        return p.get.call(f);
      },
      set: function(S, E) {
        if (c._isFormatting) {
          E(S);
          return;
        }
        if (!S || S === "") {
          E(""), d(c);
          return;
        }
        const C = it(S) || jt(S);
        if (C) {
          const T = Ft(C), x = f.getAttribute(t) || "", I = J(f), q = Tt(I), D = ne(C, x, I, q);
          E(D), u(c, T, C, D);
        } else
          E(String(S)), d(c);
      }
    }), this._onPickerChange = function() {
      const S = o.value;
      if (S) {
        const E = it(S);
        E && u(c, S, E);
      } else
        d(c);
    }, o.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const S = c.dom.value.trim();
      if (S === "") {
        c._lastISO !== "" && d(c);
        return;
      }
      if (c._lastISO) {
        const C = it(c._lastISO);
        if (C) {
          const T = c.dom.getAttribute(t) || "", x = J(c.dom), I = Tt(x);
          if (S === ne(C, T, x, I)) return;
        }
      }
      const E = jt(S);
      if (E) {
        const C = Ft(E);
        u(c, C, E);
      } else if (c._lastISO) {
        const C = it(c._lastISO);
        C && c._displayFormatted(C);
      } else
        c.dom.value = "";
    }, f.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, A.addEventListener("click", this._onBtnClick);
    const w = f.form;
    if (w && (this._form = w, this._onFormReset = function() {
      setTimeout(function() {
        const S = c.dom.value;
        if (S) {
          const E = it(S) || jt(S);
          if (E) {
            const C = Ft(E);
            u(c, C, E);
            return;
          }
        }
        d(c);
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), a && a !== "") {
      const S = it(a);
      S && u(c, a, S);
    }
    return this;
  }
  v.prototype._initTextElement = function() {
    const f = this.dom, c = f.getAttribute("data-ln-value"), a = f.getAttribute("data-ln-date"), i = f.getAttribute("datetime");
    let _ = null;
    f.tagName === "TIME" && i !== null && i !== "" ? _ = i : c !== null && c !== "" ? _ = c : i !== null && i !== "" ? _ = i : a !== null && a !== "" && a !== "true" && !Pe.test(a) ? _ = a : _ = f.textContent.trim();
    const r = it(_) || jt(_);
    if (r && !isNaN(r.getTime())) {
      const y = Ft(r);
      this._rawValue = y, f.tagName !== "TIME" && !f.hasAttribute("data-ln-value") && (this._autoValue = !0, f.setAttribute("data-ln-value", y)), this._formatTextContent();
    } else
      this._rawValue = null;
  }, v.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const f = it(this._rawValue);
      if (f) {
        let a = this.dom.getAttribute("data-ln-date-format");
        if (!a) {
          const y = this.dom.getAttribute("data-ln-date");
          y && Pe.test(y) && (a = y);
        }
        const i = J(this.dom), _ = Tt(i), r = ne(f, a || "medium", i, _);
        this._formattedText = r, this.dom.textContent !== r && (this.dom.textContent = r);
      }
    }
  }, v.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, v.prototype._setHiddenRaw = function(f) {
    p.set.call(this._hidden, f);
  }, v.prototype._displayFormatted = function(f) {
    const c = this.dom.getAttribute(t) || "", a = J(this.dom), i = Tt(a);
    this._isFormatting = !0, this.dom.value = ne(f, c, a, i), this._isFormatting = !1;
  }, Object.defineProperty(v.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : p.get.call(this._hidden);
    },
    set: function(f) {
      if (this.isTextElement) {
        if (!f || f === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const a = it(f) || jt(f);
        if (!a) return;
        const i = Ft(a);
        this._rawValue = i, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", i) : this.dom.setAttribute("data-ln-value", i), this._formatTextContent();
        return;
      }
      if (!f || f === "") {
        d(this);
        return;
      }
      const c = it(f);
      c && u(this, f, c);
    }
  }), Object.defineProperty(v.prototype, "date", {
    get: function() {
      const f = this.value;
      return f ? it(f) : null;
    },
    set: function(f) {
      if (!f || !(f instanceof Date) || isNaN(f.getTime())) {
        this.value = "";
        return;
      }
      this.value = Ft(f);
    }
  }), Object.defineProperty(v.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), v.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (h.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const f = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", f && (this.dom.value = f), delete this.dom[e];
  };
  function g(f) {
    const c = f[e];
    !c || !c.isTextElement || f.textContent !== c._formattedText && (c._autoValue && f.removeAttribute("data-ln-value"), c._initTextElement());
  }
  B(t, e, v, "ln-date", {
    attributes: l,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: n,
    onSubtreeChange: g
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-nav": { effect: u, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: Et, effect: u, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, l = Y(n);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const d = history.pushState;
    history.pushState = function() {
      d.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    };
    const h = history.replaceState;
    history.replaceState = function() {
      h.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    }, history._lnNavPatched = !0;
  }
  function p(d) {
    return this.dom = d, X(this, d, l), this.activeClass = d.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  p.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const h = Array.from(this.dom.querySelectorAll("a")), s = window.location.pathname, b = m(s), v = [];
    for (const g of h) {
      const f = g.getAttribute("href");
      if (!f || f === "#" || f.startsWith("#") || f.startsWith("javascript:") || f.startsWith("mailto:") || f.startsWith("tel:")) {
        g.classList.remove(this.activeClass), g.removeAttribute("aria-current");
        continue;
      }
      if (g.hostname && g.hostname !== window.location.hostname) {
        g.classList.remove(this.activeClass), g.removeAttribute("aria-current");
        continue;
      }
      const c = m(f), a = c === b, i = !this.exact && c !== "/" && b.startsWith(c + "/");
      a || i ? (g.classList.add(this.activeClass), g.setAttribute("aria-current", "page"), v.push(g)) : (g.classList.remove(this.activeClass), g.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: v });
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const d = history._lnNavCallbacks.indexOf(this.updateHandler);
    d !== -1 && history._lnNavCallbacks.splice(d, 1), delete this.dom[e];
  };
  function m(d) {
    try {
      return new URL(d, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return d.replace(/\/$/, "") || "/";
    }
  }
  function u(d, h) {
    const s = d[e];
    if (s) {
      if (h === t) {
        if (!d.hasAttribute(t)) {
          s.destroy();
          return;
        }
        const b = s.activeClass, v = d.getAttribute(t) || "active";
        if (b !== v) {
          const g = d.querySelectorAll("a");
          for (const f of g)
            b && f.classList.remove(b);
          s.activeClass = v;
        }
      }
      s.update();
    }
  }
  B(t, e, p, "ln-nav", {
    attributes: n,
    onSubtreeChange: function(d) {
      d[e] && d[e].update();
    }
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(u, d) {
    const h = u.getAttribute("data-ln-persist"), s = h !== null && h !== "" ? h : u.id;
    return s ? u.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + s + ":" + t() + ":" + d : "ln:" + s + ":" + d : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', u), null);
  }
  let n = null;
  function l() {
    if (n !== null) return n;
    try {
      if (typeof localStorage > "u") return n = !1;
      const u = "__ln_persist_test__";
      return localStorage.setItem(u, u), localStorage.removeItem(u), n = !0;
    } catch {
      return n = !1;
    }
  }
  const p = /* @__PURE__ */ new Set();
  function m(u, d) {
    const h = window.lnCore && window.lnCore._attrRegistry, s = h && h.persist || [];
    let b = null;
    for (let c = 0; c < s.length; c++)
      if (s[c].selector === d) {
        b = s[c];
        break;
      }
    if (!b) return;
    const v = b.persist;
    if (p.has(v.attr) || (p.add(v.attr), qt([v.attr], function(c, a) {
      if (!c.hasAttribute("data-ln-persist") || v.hashActive && v.hashActive(c)) return;
      const i = e(c, a);
      if (!i || !l()) return;
      const _ = c.getAttribute(a);
      try {
        _ === null ? localStorage.removeItem(i) : localStorage.setItem(i, _);
      } catch {
      }
    })), v.hashActive && v.hashActive(u)) return;
    const g = e(u, v.attr);
    if (!g || !l()) return;
    const f = localStorage.getItem(g);
    f !== null && u.setAttribute(v.attr, f);
  }
  ji(m);
})();
function _n(t, e, n, l) {
  const p = (t || "").toLowerCase().trim();
  if (p) return p;
  if ((e || "").toUpperCase() !== "A") return "";
  const m = n || "";
  if (!m.startsWith("#")) return "";
  const u = m.slice(1);
  if (!u) return "";
  const d = u.split("&"), h = (l || "").toLowerCase().trim();
  if (h)
    for (const v of d) {
      const g = v.indexOf(":");
      if (g > 0 && v.slice(0, g).toLowerCase().trim() === h)
        return v.slice(g + 1).toLowerCase().trim();
    }
  const s = d[d.length - 1] || "", b = s.indexOf(":");
  return (b > 0 ? s.slice(b + 1) : s).toLowerCase().trim();
}
function bn(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const n = t.filter(
    (m) => (m.tagName || "").toUpperCase() === "A" && (m.href || "").startsWith("#")
  ), l = n.length > 0 && n.length === t.length, p = (e || "").toLowerCase().trim();
  return n.length > 0 && n.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : l && !p ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: l && !!p,
    warning: null
  };
}
function yn(t, e, n) {
  const l = (t || "").toLowerCase().trim();
  return l && Array.isArray(e) && e.includes(l) ? l : (n || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function n(h) {
    const s = h.getAttribute("data-ln-tabs-active");
    h[e] && h[e]._applyActive(s);
  }
  function l(h, s) {
    return (h.getAttribute(s) || h.id || "").toLowerCase().trim();
  }
  const p = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: n, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: Et, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: l, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, m = Y(p);
  function u(h) {
    return this.dom = h, X(this, h, m), this.activeKey = null, d.call(this), this;
  }
  function d() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const h = this.tabs.map((v) => ({
      tagName: v.tagName,
      href: v.getAttribute("href")
    })), s = bn(h, this.nsKey);
    this.hashEnabled = s.hashEnabled, s.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : s.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const v of this.tabs) {
      const g = _n(v.getAttribute("data-ln-tab"), v.tagName, v.getAttribute("href"), this.nsKey);
      g ? this.mapTabs[g] = v : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', v);
    }
    for (const v of this.panels) {
      const g = (v.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      g && (this.mapPanels[g] = v);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const b = this;
    this._clickHandlers = [];
    for (const v of this.tabs) {
      if (v[e + "Trigger"]) continue;
      const g = function(f) {
        const c = v.tagName === "A";
        if (!c && (f.ctrlKey || f.metaKey || f.button === 1)) return;
        const a = _n(v.getAttribute("data-ln-tab"), v.tagName, v.getAttribute("href"), b.nsKey);
        a && (c && !Je(f) || (b.hashEnabled ? at(b.nsKey) === a ? b.dom.setAttribute("data-ln-tabs-active", a) : mt(b.nsKey, a) : b.dom.setAttribute("data-ln-tabs-active", a)));
      };
      v.addEventListener("click", g), v[e + "Trigger"] = g, b._clickHandlers.push({ el: v, handler: g });
    }
    if (this._onRequestSelect = function(v) {
      const g = v.detail && (v.detail.key || v.detail.tab);
      g && b.select(g);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!b.hashEnabled) return;
      const v = at(b.nsKey);
      b.dom.setAttribute("data-ln-tabs-active", v !== null ? v : b.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const v = yn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", v);
    }
  }
  u.prototype.select = function(h) {
    const s = (h + "").toLowerCase().trim();
    s && (this.hashEnabled ? at(this.nsKey) === s ? this.dom.setAttribute("data-ln-tabs-active", s) : mt(this.nsKey, s) : this.dom.setAttribute("data-ln-tabs-active", s));
  }, u.prototype._applyActive = function(h) {
    var b;
    if (h = yn(h, Object.keys(this.mapPanels), this.defaultKey), h === this.activeKey) return;
    const s = this.activeKey;
    if (s !== null && W(this.dom, "ln-tabs:before-change", {
      key: h,
      previousKey: s,
      tab: this.mapTabs[h],
      panel: this.mapPanels[h],
      target: this.dom
    }).defaultPrevented) {
      s in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", s), this.hashEnabled && at(this.nsKey) !== s && mt(this.nsKey, s));
      return;
    }
    this.activeKey = h;
    for (const v in this.mapTabs) {
      const g = this.mapTabs[v];
      v === h ? (g.hasAttribute("data-active") || g.setAttribute("data-active", ""), g.getAttribute("aria-selected") !== "true" && g.setAttribute("aria-selected", "true")) : (g.hasAttribute("data-active") && g.removeAttribute("data-active"), g.getAttribute("aria-selected") !== "false" && g.setAttribute("aria-selected", "false"));
    }
    for (const v in this.mapPanels) {
      const g = this.mapPanels[v], f = v === h;
      g.hidden !== !f && (g.hidden = !f), g.classList.contains("hidden") !== !f && g.classList.toggle("hidden", !f);
      const c = f ? "false" : "true";
      g.getAttribute("aria-hidden") !== c && g.setAttribute("aria-hidden", c);
    }
    if (this.autoFocus) {
      const v = (b = this.mapPanels[h]) == null ? void 0 : b.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      v && setTimeout(() => v.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: h,
      previousKey: s,
      tab: this.mapTabs[h],
      panel: this.mapPanels[h],
      target: this.dom
    });
  }, u.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: h, handler: s } of this._clickHandlers)
        h.removeEventListener("click", s), delete h[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, B(t, e, u, "ln-tabs", {
    attributes: p,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(h) {
        const s = Array.from(h.querySelectorAll("[data-ln-tab]")).map(function(v) {
          return { tagName: v.tagName, href: v.getAttribute("href") };
        }), b = (h.getAttribute("data-ln-tabs-key") || h.id || "").toLowerCase().trim();
        return bn(s, b).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", n = "data-ln-toggle-for", l = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-toggle": { effect: g, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, m = /* @__PURE__ */ new Set();
  let u = null;
  function d(f, c) {
    return c === "open" ? "open" : c === "close" || f === "open" ? "close" : "open";
  }
  function h() {
    u || (u = function(f) {
      if (xt(f)) return;
      const c = f.target.closest("[" + n + "]");
      if (!c || Ke(c)) return;
      const a = c.getAttribute(n);
      if (!a) return;
      const i = document.getElementById(a);
      if (!i || !i[e]) return;
      f.preventDefault();
      const _ = c.getAttribute(l) || "toggle", r = i.getAttribute(t);
      i.setAttribute(t, d(r, _));
    }, document.addEventListener("click", u));
  }
  function s() {
    m.size > 0 || !u || (document.removeEventListener("click", u), u = null);
  }
  function b(f, c) {
    if (!f || !f.id) return;
    const a = document.querySelectorAll(
      "[" + n + '="' + f.id + '"]'
    );
    for (let i = 0; i < a.length; i++)
      a[i].setAttribute("aria-expanded", c ? "true" : "false");
  }
  function v(f) {
    this.dom = f;
    const c = this;
    return this._onRequestOpen = function() {
      c.open();
    }, this._onRequestClose = function() {
      c.close();
    }, this._onRequestToggle = function() {
      c.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = f.getAttribute(t) === "open", this.isOpen && f.classList.add("open"), b(f, this.isOpen), m.add(this), h(), this;
  }
  v.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, v.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, v.prototype.toggle = function() {
    const f = this.dom.getAttribute(t);
    this.dom.setAttribute(t, d(f, "toggle"));
  }, v.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.delete(this), delete this.dom[e], s());
  };
  function g(f) {
    const c = f[e];
    if (!c) return;
    const i = f.getAttribute(t) === "open";
    if (i !== c.isOpen)
      if (i) {
        if (W(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(t, "close");
          return;
        }
        c.isOpen = !0, f.classList.add("open"), b(f, !0), L(f, "ln-toggle:open", { target: f });
      } else {
        if (W(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(t, "open");
          return;
        }
        c.isOpen = !1, f.classList.remove("open"), b(f, !1), L(f, "ln-toggle:close", { target: f });
      }
  }
  B(t, e, v, "ln-toggle", {
    attributes: p,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function l(p) {
    return this.dom = p, this._onToggleOpen = function(m) {
      if (!m.detail || !m.detail.target || m.detail.target.closest("[data-ln-accordion]") !== p) return;
      const u = p.querySelectorAll("[data-ln-toggle]");
      for (const d of u)
        d !== m.detail.target && d.closest("[data-ln-accordion]") === p && d.getAttribute("data-ln-toggle") === "open" && d.setAttribute("data-ln-toggle", "close");
      L(p, "ln-accordion:change", { target: m.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, B(t, e, l, "ln-accordion", {
    attributes: n
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", n = "bottom-end";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: n, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, p = Y(l);
  function m(u) {
    this.dom = u, X(this, u, p), this.toggleEl = u.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = u.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const d = this;
    return this._onRequestOpen = function() {
      d.toggleEl && d.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      d.toggleEl && d.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (d.toggleEl) {
        const h = d.toggleEl.getAttribute("data-ln-toggle");
        d.toggleEl.setAttribute("data-ln-toggle", h === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(h) {
      const s = d.toggleEl && d.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (h.key === "Escape") {
        s && (h.preventDefault(), h.stopPropagation(), d.toggleEl.setAttribute("data-ln-toggle", "close"), d.triggerBtn && d.triggerBtn.focus());
        return;
      }
      if (h.key === "Tab") {
        s && (d.triggerBtn && d.triggerBtn.focus(), d.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const b = d._getMenuItems();
      if (b.length === 0) return;
      if (!s && (h.key === "ArrowDown" || h.key === "ArrowUp")) {
        h.preventDefault(), d.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const g = d._getMenuItems();
          g.length > 0 && d._focusItem(g, h.key === "ArrowDown" ? 0 : g.length - 1);
        }, 0);
        return;
      }
      if (!s) return;
      const v = b.indexOf(document.activeElement);
      if (h.key === "ArrowDown") {
        h.preventDefault();
        const g = v < b.length - 1 ? v + 1 : 0;
        d._focusItem(b, g);
      } else if (h.key === "ArrowUp") {
        h.preventDefault();
        const g = v > 0 ? v - 1 : b.length - 1;
        d._focusItem(b, g);
      } else h.key === "Home" ? (h.preventDefault(), d._focusItem(b, 0)) : h.key === "End" && (h.preventDefault(), d._focusItem(b, b.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(h) {
      !h.detail || h.detail.target !== d.toggleEl || (d.triggerBtn && d.triggerBtn.setAttribute("aria-expanded", "true"), typeof d.toggleEl.showPopover == "function" && d.toggleEl.showPopover(), d._initMenuAria(), d._reposition(), d._addOutsideClickListener(), d._addScrollRepositionListener(), d._addResizeCloseListener(), L(u, "ln-dropdown:open", { target: h.detail.target }));
    }, this._onToggleClose = function(h) {
      !h.detail || h.detail.target !== d.toggleEl || (d.triggerBtn && d.triggerBtn.setAttribute("aria-expanded", "false"), d._removeOutsideClickListener(), d._removeScrollRepositionListener(), d._removeResizeCloseListener(), d.toggleEl.style.top = "", d.toggleEl.style.left = "", d.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof d.toggleEl.hidePopover == "function" && d.toggleEl.matches(":popover-open") && d.toggleEl.hidePopover(), L(u, "ln-dropdown:close", { target: h.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const u = this.toggleEl.querySelectorAll("li");
    for (const h of u)
      h.setAttribute("role", "none");
    const d = this._getMenuItems();
    for (let h = 0; h < d.length; h++)
      d[h].setAttribute("role", "menuitem"), d[h].setAttribute("tabindex", h === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(u, d) {
    for (let h = 0; h < u.length; h++)
      u[h].setAttribute("tabindex", h === d ? "0" : "-1");
    u[d] && u[d].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl || !document.contains(this.toggleEl)) return;
    const u = this.triggerBtn.getBoundingClientRect(), d = Oe(this.toggleEl), h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, s = this.position || n, b = ue(u, d, s, h), v = b.top + "px", g = b.left + "px";
    this.toggleEl.style.top !== v && (this.toggleEl.style.top = v), this.toggleEl.style.left !== g && (this.toggleEl.style.left = g), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== b.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", b.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const u = this;
    this._boundDocClick = function(d) {
      u.dom.contains(d.target) || u.toggleEl && u.toggleEl.contains(d.target) || u.toggleEl && u.toggleEl.getAttribute("data-ln-toggle") === "open" && u.toggleEl.setAttribute("data-ln-toggle", "close");
    }, u._docClickTimeout = setTimeout(function() {
      u._docClickTimeout = null, document.addEventListener("click", u._boundDocClick);
    }, 0);
  }, m.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, m.prototype._addScrollRepositionListener = function() {
    const u = this;
    this._scrollRepositionRaf = null, this._boundScrollReposition = function() {
      u._scrollRepositionRaf || (u._scrollRepositionRaf = requestAnimationFrame(function() {
        u._scrollRepositionRaf = null, u._reposition();
      }));
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, m.prototype._removeScrollRepositionListener = function() {
    this._scrollRepositionRaf && (cancelAnimationFrame(this._scrollRepositionRaf), this._scrollRepositionRaf = null), this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, m.prototype._addResizeCloseListener = function() {
    const u = this;
    this._boundResizeClose = function() {
      u.toggleEl && u.toggleEl.getAttribute("data-ln-toggle") === "open" && u.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, m.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, B(t, e, m, "ln-dropdown", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", n = "data-ln-popover-for", l = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: v, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, m = [];
  let u = null;
  function d() {
    u || (u = function(g) {
      if (g.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", u));
  }
  function h() {
    m.length > 0 || u && (document.removeEventListener("keydown", u), u = null);
  }
  function s(g) {
    this.dom = g, this.isOpen = g.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const f = this;
    return this._onRequestOpen = function(c) {
      const a = c.detail && c.detail.trigger ? c.detail.trigger : null;
      f.open(a);
    }, this._onRequestClose = function() {
      f.close();
    }, this._onRequestToggle = function(c) {
      const a = c.detail && c.detail.trigger ? c.detail.trigger : null;
      f.toggle(a);
    }, this._onNativeToggle = function(c) {
      c.newState === "closed" && f.isOpen && (f._applyClose(), f.dom.setAttribute(t, "closed"));
    }, g.addEventListener("ln-popover:request-open", this._onRequestOpen), g.addEventListener("ln-popover:request-close", this._onRequestClose), g.addEventListener("ln-popover:request-toggle", this._onRequestToggle), g.addEventListener("toggle", this._onNativeToggle), g.hasAttribute("tabindex") || g.setAttribute("tabindex", "-1"), g.hasAttribute("role") || g.setAttribute("role", "dialog"), g.hasAttribute("popover") || g.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  s.prototype.open = function(g) {
    this.isOpen || (this.trigger = g || null, this.dom.setAttribute(t, "open"));
  }, s.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, s.prototype.toggle = function(g) {
    this.isOpen ? this.close() : this.open(g);
  }, s.prototype._applyOpen = function(g) {
    this.isOpen = !0, g && (this.trigger = g), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const f = Oe(this.dom);
    if (this.trigger) {
      const _ = this.trigger.getBoundingClientRect(), r = this.dom.getAttribute(l) || "bottom", y = ue(_, f, r, 8);
      this.dom.style.top = y.top + "px", this.dom.style.left = y.left + "px", this.dom.setAttribute("data-ln-popover-placement", y.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const c = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), a = Array.prototype.find.call(c, Vt);
    a ? a.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(_) {
      i.dom.contains(_.target) || i.trigger && i.trigger.contains(_.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!i.trigger || !document.contains(i.dom)) return;
      const _ = i.trigger.getBoundingClientRect(), r = Oe(i.dom), y = i.dom.getAttribute(l) || "bottom", o = ue(_, r, y, 8), A = o.top + "px", w = o.left + "px";
      i.dom.style.top !== A && (i.dom.style.top = A), i.dom.style.left !== w && (i.dom.style.left = w), i.dom.getAttribute("data-ln-popover-placement") !== o.placement && i.dom.setAttribute("data-ln-popover-placement", o.placement);
    }, this._boundReposition = function() {
      i._repositionRaf || (i._repositionRaf = requestAnimationFrame(function() {
        i._repositionRaf = null, i._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), d(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, s.prototype._applyClose = function() {
    this.isOpen = !1, this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const g = m.indexOf(this);
    g !== -1 && m.splice(g, 1), h(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function b(g) {
    this.dom = g;
    const f = g.getAttribute(n);
    return g.setAttribute("aria-haspopup", "dialog"), g.setAttribute("aria-expanded", "false"), g.setAttribute("aria-controls", f), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const a = document.getElementById(f);
      if (!a) return;
      a[e] && (a[e].trigger = g);
      const i = a.getAttribute(t);
      a.setAttribute(t, i === "open" ? "closed" : "open");
    }, g.addEventListener("click", this._onClick), this;
  }
  b.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function v(g) {
    const f = g[e];
    if (!f) return;
    const a = g.getAttribute(t) === "open";
    if (a !== f.isOpen)
      if (a) {
        if (W(g, "ln-popover:before-open", {
          popoverId: g.id,
          target: g,
          trigger: f.trigger
        }).defaultPrevented) {
          g.setAttribute(t, "closed");
          return;
        }
        f._applyOpen(f.trigger);
      } else {
        if (W(g, "ln-popover:before-close", {
          popoverId: g.id,
          target: g,
          trigger: f.trigger
        }).defaultPrevented) {
          g.setAttribute(t, "open");
          return;
        }
        f._applyClose();
      }
  }
  B(t, e, s, "ln-popover", {
    attributes: p
  }), B(n, e + "Trigger", b, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", n = "data-ln-tooltip-position", l = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[l] !== void 0) return;
  const m = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let u = 0, d = null, h = null, s = null, b = null, v = null, g = null;
  function f() {
    return d && d.parentNode || (d = document.getElementById(p), d || (d = document.createElement("div"), d.id = p, document.body.appendChild(d)), d.hasAttribute("popover") || d.setAttribute("popover", "manual")), d;
  }
  function c() {
    g || (g = function(y) {
      y.key === "Escape" && _();
    }, document.addEventListener("keydown", g));
  }
  function a() {
    g && (document.removeEventListener("keydown", g), g = null);
  }
  function i(y) {
    if (s === y) return;
    _();
    const o = y.getAttribute(e) || y.getAttribute("title");
    if (!o) return;
    f(), typeof d.showPopover == "function" && d.showPopover(), y.hasAttribute("title") && (b = y.getAttribute("title"), y.removeAttribute("title"));
    const A = y.getAttribute("aria-describedby");
    A ? v = A : v = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = o, y[l + "Uid"] || (u += 1, y[l + "Uid"] = "ln-tooltip-" + u), w.id = y[l + "Uid"], d.appendChild(w);
    const S = w.offsetWidth, E = w.offsetHeight, C = y.getBoundingClientRect(), T = y.getAttribute(n) || "top", x = ue(C, { width: S, height: E }, T, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), v ? y.setAttribute("aria-describedby", v + " " + w.id) : y.setAttribute("aria-describedby", w.id), h = w, s = y, c();
  }
  function _() {
    if (!h) {
      a();
      return;
    }
    s && (v !== null ? s.setAttribute("aria-describedby", v) : s.removeAttribute("aria-describedby"), v = null, b !== null && s.setAttribute("title", b)), b = null, h.parentNode && h.parentNode.removeChild(h), h = null, s = null, d && typeof d.hidePopover == "function" && d.matches(":popover-open") && d.hidePopover(), a();
  }
  function r(y) {
    return this.dom = y, y.hasAttribute("data-ln-tooltip-enhanced") || (y.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      i(y);
    }, this._onLeave = function() {
      s === y && !y.contains(document.activeElement) && _();
    }, this._onFocus = function() {
      i(y);
    }, this._onBlur = function() {
      s === y && !y.matches(":hover") && _();
    }, y.addEventListener("mouseenter", this._onEnter), y.addEventListener("mouseleave", this._onLeave), y.addEventListener("focus", this._onFocus, !0), y.addEventListener("blur", this._onBlur, !0), this;
  }
  r.prototype.destroy = function() {
    const y = this.dom;
    y.removeEventListener("mouseenter", this._onEnter), y.removeEventListener("mouseleave", this._onLeave), y.removeEventListener("focus", this._onFocus, !0), y.removeEventListener("blur", this._onBlur, !0), s === y && _(), this._addedEnhancedAttr && y.removeAttribute("data-ln-tooltip-enhanced"), delete y[l], delete y[l + "Uid"];
  }, B(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    l,
    r,
    "ln-tooltip",
    {
      attributes: m
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", n = "ln-toast-item";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: Ht, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: Ht, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, p = Y(l);
  function m(i) {
    if (!(!i || !(i instanceof HTMLElement)) && (i.hasAttribute("popover") || i.setAttribute("popover", "manual"), typeof i.showPopover == "function")) {
      if (i.matches(":popover-open"))
        try {
          i.hidePopover();
        } catch {
        }
      try {
        i.showPopover();
      } catch {
      }
    }
  }
  function u(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function d(i) {
    this.dom = i, X(this, i, p);
    const _ = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length > this.max; ) i.removeChild(_.shift());
    for (const r of _) f(r, this);
    return _.length > 0 && m(i), this;
  }
  d.prototype.enqueue = function(i) {
    if (!i) return;
    const _ = h(i, this.dom);
    if (!_) return;
    const r = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    b(this, _), r > 0 && (_._timer = setTimeout(() => v(_), r));
  }, d.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      v(i);
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        v(i);
      u(this.dom), delete this.dom[e];
    }
  };
  function h(i, _) {
    const r = ((i.type || "") + "").trim().toLowerCase(), y = et(_, n, "ln-toast");
    if (!y)
      return console.warn('[ln-toast] Template "' + n + '" not found'), null;
    dt(y, {
      type: r,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const o = y.firstElementChild;
    if (!o) return null;
    o.hasAttribute("data-ln-toast-item") || o.setAttribute("data-ln-toast-item", ""), o.classList.add("ln-enter");
    const A = o.querySelector('[data-ln-field="message"]');
    A && s(A, i);
    const w = o.querySelector("[data-ln-toast-close]");
    return w && w.addEventListener("click", function() {
      v(o);
    }), o;
  }
  function s(i, _) {
    if (Array.isArray(_.message)) {
      const r = document.createElement("ul");
      for (const y of _.message) {
        const o = document.createElement("li");
        o.textContent = y, r.appendChild(o);
      }
      i.appendChild(r);
    }
    if (_.data && _.data.errors) {
      const r = document.createElement("ul");
      for (const y of Object.values(_.data.errors).flat()) {
        const o = document.createElement("li");
        o.textContent = y, r.appendChild(o);
      }
      i.appendChild(r);
    }
  }
  function b(i, _) {
    const r = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length >= i.max && r.length > 0; ) i.dom.removeChild(r.shift());
    i.dom.appendChild(_), m(i.dom), requestAnimationFrame(() => _.classList.remove("ln-enter"));
  }
  function v(i) {
    if (!i || !i.parentNode) return;
    const _ = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), u(_));
    }, 200);
  }
  function g(i) {
    let _ = i && i.container;
    return typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), _ || null;
  }
  function f(i, _) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const r = i.querySelector("[data-ln-toast-close]");
    r && r.addEventListener("click", function() {
      v(i);
    });
    const y = +(i.getAttribute("data-ln-toast-timeout") ?? _.timeoutDefault);
    y > 0 && (i._timer = setTimeout(function() {
      v(i);
    }, y));
  }
  function c(i) {
    const _ = i.detail || {}, r = g(_);
    if (!r) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (r[e] || (r[e] = new d(r))).enqueue(_);
  }
  function a(i) {
    const _ = i && i.detail || {};
    if (_.container) {
      const r = g(_);
      r && (r[e] || (r[e] = new d(r))).clear();
    } else {
      const r = document.querySelectorAll("[" + t + "]");
      for (const y of Array.from(r))
        (y[e] || (y[e] = new d(y))).clear();
    }
  }
  ft(function() {
    window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", a), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const _ of Array.from(i))
        _.querySelectorAll("[data-ln-toast-item]").length > 0 && m(_);
    });
  }, "ln-toast"), B(t, e, d, "ln-toast", {
    attributes: l
  });
})();
function Sr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((n) => n.trim().toLowerCase()).filter(Boolean).map((n) => n.startsWith(".") ? n.slice(1) : n);
  return e.length ? e : null;
}
function Ei(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Cr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const n = Ei(t.name), l = String(t.type || "").toLowerCase();
  return e.some((p) => {
    if (p.includes("/")) {
      if (p.endsWith("/*")) {
        const m = p.slice(0, -1);
        return l.startsWith(m);
      }
      return l === p;
    }
    return n === p;
  });
}
function Tr(t, e = "en", n = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (n["unit-b"] || "B");
  const l = 1024, p = [
    n["unit-b"] || "B",
    n["unit-kb"] || "KB",
    n["unit-mb"] || "MB",
    n["unit-gb"] || "GB"
  ], m = Math.floor(Math.log(t) / Math.log(l)), u = Math.min(m, p.length - 1), d = t / Math.pow(l, u);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(d) + " " + p[u];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", n = "file", l = "file_ids[]";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-upload": { prop: "uploadUrl", read: K, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: K, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: Ht, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: Ht, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: K, type: "string", fallback: n, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: K, type: "string", fallback: l, description: "Form field name for submitting uploaded file IDs" },
    "data-ln-upload-dict": { type: "string", description: "Dictionary key prefix mapping for translatable upload messages" },
    "data-ln-upload-zone": { type: "marker", description: "Designates container as dropzone for drag-and-drop file uploads" },
    "data-ln-upload-list": { type: "marker", description: "Container element holding rendered upload items" },
    "data-ln-upload-item": { type: "marker", description: "Container element for an individual file upload item" },
    "data-ln-upload-action": { type: "enum", values: ["remove", "retry"], description: "Action button within upload item" },
    "data-ln-upload-state": { type: "enum", values: ["ready", "dragover", "pending", "uploading", "success", "error"], description: "Runtime status of dropzone or individual upload item" },
    "data-ln-upload-id": { type: "string", description: "Server-assigned file identifier for completed upload" },
    "data-ln-upload-local-id": { type: "string", description: "Client-generated unique ID for tracking file item in DOM" },
    "data-ln-upload-size": { type: "integer", min: 0, description: "File size in bytes" },
    "data-ln-upload-ext": { type: "string", description: "Normalized file extension" }
  }, m = Y(p);
  function u(s, b, v) {
    return Tr(s, b, v);
  }
  function d() {
    const s = document.querySelector('meta[name="csrf-token"]');
    return s ? s.getAttribute("content") : "";
  }
  function h(s) {
    this.dom = s, X(this, s, m), this.dict = $e(s, "data-ln-upload-dict"), this.locale = J(s), this.zone = s.querySelector("[data-ln-upload-zone]") || s, this.list = s.querySelector("[data-ln-upload-list]"), this.input = s.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', s);
    const b = s.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Sr(b), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  h.prototype._hydrate = function() {
    const s = this;
    if (!this.list) return;
    const b = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let g = 0; g < b.length; g++) {
      const f = b[g], c = f.getAttribute("data-ln-upload-id"), a = "file-" + ++s.fileIdCounter;
      f.setAttribute("data-ln-upload-local-id", a);
      const i = f.querySelector('[data-ln-field="name"]'), _ = f.querySelector('[data-ln-field="sizeText"]'), r = f.getAttribute("data-ln-upload-size"), y = r ? parseInt(r, 10) : null;
      s.uploadedFiles.set(a, {
        serverId: c || null,
        name: i ? i.textContent.trim() : "",
        size: y !== null && !isNaN(y) ? y : _ ? _.textContent.trim() : ""
      });
    }
    const v = this.dom.querySelectorAll('input[type="hidden"]');
    for (let g = 0; g < v.length; g++) {
      const f = v[g];
      if (f.name === s.idsFieldName && f.value && !Array.from(s.uploadedFiles.values()).some(function(a) {
        return String(a.serverId) === String(f.value);
      })) {
        const a = "file-" + ++s.fileIdCounter;
        s.uploadedFiles.set(a, {
          serverId: f.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, h.prototype._syncHiddenInputs = function() {
    const s = this, b = this.dom.querySelectorAll('input[type="hidden"]');
    for (let v = 0; v < b.length; v++)
      b[v].name === s.idsFieldName && b[v].remove();
    for (const [, v] of this.uploadedFiles)
      if (v.serverId) {
        const g = document.createElement("input");
        g.type = "hidden", g.name = s.idsFieldName, g.value = v.serverId, s.dom.appendChild(g);
      }
  }, h.prototype._bindEvents = function() {
    const s = this;
    this._onZoneClick = function(b) {
      s.zone === s.dom && b.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || s.input && b.target !== s.input && s.input.click();
    }, this._onInputChange = function() {
      s.input && s.input.files && (s.upload(s.input.files), s.input.value = "");
    }, this._onDragEnter = function(b) {
      b.preventDefault(), b.stopPropagation(), s._dragDepth++, s.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(b) {
      b.preventDefault(), b.stopPropagation(), s.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(b) {
      b.preventDefault(), b.stopPropagation(), s._dragDepth--, s._dragDepth <= 0 && (s._dragDepth = 0, s.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(b) {
      b.preventDefault(), b.stopPropagation(), s._dragDepth = 0, s.zone.removeAttribute("data-ln-upload-state"), b.dataTransfer && b.dataTransfer.files && s.upload(b.dataTransfer.files);
    }, this._onListClick = function(b) {
      const v = b.target.closest('[data-ln-upload-action="remove"]');
      if (!v || !s.list || !s.list.contains(v) || v.disabled) return;
      const g = v.closest("[data-ln-upload-item]");
      if (g) {
        const f = g.getAttribute("data-ln-upload-local-id");
        f && s.remove(f);
      }
    }, this._onRequestUpload = function(b) {
      b.detail && b.detail.files && s.upload(b.detail.files);
    }, this._onRequestRemove = function(b) {
      if (b.detail) {
        const v = b.detail.localId !== void 0 ? b.detail.localId : b.detail.serverId;
        v !== void 0 && s.remove(v);
      }
    }, this._onRequestClear = function() {
      s.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, h.prototype.upload = function(s) {
    const b = this, v = Array.from(s);
    for (let g = 0; g < v.length; g++) {
      const f = v[g];
      if (b.maxFiles > 0 && b.uploadedFiles.size >= b.maxFiles) {
        L(b.dom, "ln-upload:invalid", {
          file: f,
          reason: "max-files"
        });
        continue;
      }
      if (!Cr(f, b.allowedExts)) {
        L(b.dom, "ln-upload:invalid", {
          file: f,
          reason: "accept"
        });
        continue;
      }
      if (b.maxSize > 0 && f.size > b.maxSize) {
        L(b.dom, "ln-upload:invalid", {
          file: f,
          reason: "max-size"
        });
        continue;
      }
      W(b.dom, "ln-upload:before-upload", { file: f }).defaultPrevented || b._uploadSingleFile(f);
    }
  }, h.prototype._uploadSingleFile = function(s) {
    const b = this, v = "file-" + ++b.fileIdCounter, g = Ei(s.name);
    let f = null;
    if (this.list) {
      const r = et(this.dom, "ln-upload-item", "ln-upload");
      if (r && (f = r.firstElementChild, f)) {
        f.setAttribute("data-ln-upload-item", ""), f.setAttribute("data-ln-upload-local-id", v), f.setAttribute("data-ln-upload-ext", g), f.setAttribute("data-ln-upload-state", "uploading"), dt(f, {
          name: s.name,
          sizeText: "0%",
          removeLabel: b.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const y = f.querySelector('[data-ln-upload-action="remove"]');
        y && (y.disabled = !0);
        const o = f.querySelector("[data-ln-progress]");
        o && o.setAttribute("data-ln-progress", "0"), b.list.appendChild(f);
      }
    }
    const c = new FormData();
    c.append(b.fileFieldName, s);
    const a = this.dom.querySelectorAll("input, select, textarea");
    for (let r = 0; r < a.length; r++) {
      const y = a[r];
      !y.name || y.name === b.idsFieldName || y.type === "file" || (y.type === "checkbox" || y.type === "radio") && !y.checked || c.append(y.name, y.value);
    }
    const i = new XMLHttpRequest();
    b.uploadedFiles.set(v, {
      serverId: null,
      name: s.name,
      size: s.size,
      xhr: i
    }), i.upload.addEventListener("progress", function(r) {
      if (r.lengthComputable) {
        const y = Math.round(r.loaded / r.total * 100);
        if (f) {
          const o = f.querySelector("[data-ln-progress]");
          o && o.setAttribute("data-ln-progress", String(y)), dt(f, { sizeText: y + "%" });
        }
        L(b.dom, "ln-upload:progress", {
          localId: v,
          file: s,
          percent: y,
          loaded: r.loaded,
          total: r.total
        });
      }
    }), i.addEventListener("load", function() {
      const r = b.uploadedFiles.get(v);
      if (r && delete r.xhr, i.status >= 200 && i.status < 300) {
        let y;
        try {
          y = JSON.parse(i.responseText);
        } catch (A) {
          _(b.dict.error || "Error", i.status, A);
          return;
        }
        const o = y.id || y.serverId;
        if (f) {
          f.removeAttribute("data-ln-upload-state"), o && f.setAttribute("data-ln-upload-id", String(o)), dt(f, {
            sizeText: u(y.size || s.size, b.locale, b.dict),
            uploading: !1
          });
          const A = f.querySelector('[data-ln-upload-action="remove"]');
          A && (A.disabled = !1);
        }
        r && (r.serverId = o, r.size = y.size || s.size, r.name = y.name || s.name), b._syncHiddenInputs(), L(b.dom, "ln-upload:uploaded", {
          localId: v,
          serverId: o,
          name: y.name || s.name,
          size: y.size || s.size,
          response: y
        });
      } else {
        let y = "";
        try {
          y = JSON.parse(i.responseText).message || "";
        } catch {
        }
        _(y, i.status, null);
      }
    }), i.addEventListener("error", function() {
      const r = b.uploadedFiles.get(v);
      r && delete r.xhr, _("", 0, null);
    });
    function _(r, y, o) {
      if (f) {
        f.setAttribute("data-ln-upload-state", "error"), dt(f, {
          sizeText: b.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const A = f.querySelector('[data-ln-upload-action="remove"]');
        A && (A.disabled = !1);
      }
      L(b.dom, "ln-upload:error", {
        file: s,
        message: r,
        status: y,
        error: o
      });
    }
    b.uploadUrl ? (i.open("POST", b.uploadUrl), i.setRequestHeader("X-CSRF-TOKEN", d()), i.setRequestHeader("X-Requested-With", "XMLHttpRequest"), i.setRequestHeader("Accept", "application/json"), i.send(c)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, h.prototype.remove = function(s) {
    const b = this;
    let v = null, g = null;
    if (b.uploadedFiles.has(s))
      v = s, g = b.uploadedFiles.get(s);
    else
      for (const [i, _] of b.uploadedFiles)
        if (String(_.serverId) === String(s)) {
          v = i, g = _;
          break;
        }
    if (!v || !g || W(b.dom, "ln-upload:before-remove", {
      localId: v,
      serverId: g.serverId
    }).defaultPrevented) return;
    const c = b.list ? b.list.querySelector('[data-ln-upload-local-id="' + v + '"]') : null;
    if (g.xhr && typeof g.xhr.abort == "function" && g.xhr.abort(), !g.serverId) {
      c && c.remove(), b.uploadedFiles.delete(v), b._syncHiddenInputs(), L(b.dom, "ln-upload:removed", { localId: v, serverId: null });
      return;
    }
    let a = null;
    if (b.deleteUrlPattern ? a = b.deleteUrlPattern.replace("{id}", encodeURIComponent(g.serverId)) : b.uploadUrl && b.uploadUrl.includes("{id}") && (a = b.uploadUrl.replace("{id}", encodeURIComponent(g.serverId))), !a) {
      c && c.remove(), b.uploadedFiles.delete(v), b._syncHiddenInputs(), L(b.dom, "ln-upload:removed", { localId: v, serverId: g.serverId });
      return;
    }
    c && (c.setAttribute("data-ln-upload-state", "deleting"), dt(c, { deleting: !0 })), fetch(a, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": d(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(i) {
      i.ok ? (c && c.remove(), b.uploadedFiles.delete(v), b._syncHiddenInputs(), L(b.dom, "ln-upload:removed", {
        localId: v,
        serverId: g.serverId
      })) : (c && (c.removeAttribute("data-ln-upload-state"), dt(c, { deleting: !1 })), L(b.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: i.status
      }));
    }).catch(function(i) {
      c && (c.removeAttribute("data-ln-upload-state"), dt(c, { deleting: !1 })), L(b.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: 0,
        error: i
      });
    });
  }, h.prototype.clear = function() {
    const s = this;
    if (!W(s.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, v] of this.uploadedFiles)
        if (v.xhr && typeof v.xhr.abort == "function" && v.xhr.abort(), v.serverId) {
          let g = null;
          s.deleteUrlPattern ? g = s.deleteUrlPattern.replace("{id}", encodeURIComponent(v.serverId)) : s.uploadUrl && s.uploadUrl.includes("{id}") && (g = s.uploadUrl.replace("{id}", encodeURIComponent(v.serverId))), g && fetch(g, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": d(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      s.uploadedFiles.clear(), s.list && (s.list.innerHTML = ""), s._syncHiddenInputs(), L(s.dom, "ln-upload:cleared", {});
    }
  }, h.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(s) {
      return s.serverId;
    }).filter(Boolean);
  }, h.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(s) {
      return {
        serverId: s.serverId,
        name: s.name,
        size: s.size
      };
    });
  }, h.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, s] of this.uploadedFiles)
        s.xhr && typeof s.xhr.abort == "function" && s.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, delete this.dom[e];
    }
  }, B(t, e, h, "ln-upload", {
    attributes: p
  });
})();
function Si(t, e) {
  if (t.length !== 1) return t;
  const n = t.charCodeAt(0);
  if (n >= 65 && n <= 90) {
    const l = ((n - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + l);
  }
  if (n >= 97 && n <= 122) {
    const l = ((n - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + l);
  }
  if (n >= 48 && n <= 57) {
    const l = ((n - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + l);
  }
  return t;
}
function Ci(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const n = new TextEncoder().encode(e);
    let l = "";
    const p = n.length;
    for (let m = 0; m < p; m++)
      l += String.fromCharCode(n[m]);
    return btoa(l);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function Ti(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const n = atob(e), l = new Uint8Array(n.length);
      for (let p = 0; p < n.length; p++)
        l[p] = n.charCodeAt(p);
      return new TextDecoder().decode(l);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function ki(t, e) {
  const n = String(e || "ln-ashlar");
  let l;
  typeof TextEncoder < "u" ? l = new TextEncoder().encode(n) : typeof Buffer < "u" ? l = Buffer.from(n, "utf-8") : l = [108, 110];
  const p = l.length || 1, m = new Uint8Array(t.length);
  for (let u = 0; u < t.length; u++)
    m[u] = t[u] ^ l[u % p];
  return m;
}
function Li(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const n = String(t);
  let l;
  if (typeof TextEncoder < "u")
    l = new TextEncoder().encode(n);
  else if (typeof Buffer < "u")
    l = Buffer.from(n, "utf-8");
  else
    return "";
  const p = ki(l, e);
  let m = "";
  for (let u = 0; u < p.length; u++)
    m += String.fromCharCode(p[u]);
  return typeof btoa < "u" ? btoa(m) : typeof Buffer < "u" ? Buffer.from(p).toString("base64") : "";
}
function xi(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const n = String(t).trim();
    let l = "";
    if (typeof atob < "u")
      l = atob(n);
    else if (typeof Buffer < "u")
      l = Buffer.from(n, "base64").toString("binary");
    else
      return t;
    const p = new Uint8Array(l.length);
    for (let u = 0; u < l.length; u++)
      p[u] = l.charCodeAt(u);
    const m = ki(p, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(m);
    if (typeof Buffer < "u")
      return Buffer.from(m).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Ii(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), n = e === "xor" || e === "base64" ? e : "rot", l = Number(t.shift) || 13, p = t.key || "ln-ashlar";
    return { codec: n, shift: l, key: p };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function kr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const n = Ii(e);
  return n.codec === "base64" ? Ci(t) : n.codec === "xor" ? Li(t, n.key) : t.replace(/[a-zA-Z0-9]/g, (l) => Si(l, n.shift));
}
function Ce(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const n = Ii(e);
  return n.codec === "base64" ? Ti(t) : n.codec === "xor" ? xi(t, n.key) : t.replace(/[a-zA-Z0-9]/g, (l) => Si(l, -n.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function n(u) {
    const d = u[e];
    d && d.deobfuscate();
  }
  const l = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: n, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: n, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: n, description: "Encryption or masking key for XOR codec" }
  };
  function p(u) {
    return u[e] ? u[e] : (u[e] = this, this.dom = u, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  p.prototype.deobfuscate = function() {
    const u = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && u && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((i) => !this.dom.contains(i.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const i = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(_) {
          return _.parentElement && _.parentElement.hasAttribute("data-ln-external-links-hint") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; i.nextNode(); )
        this._originalTextNodes.push({
          node: i.currentNode,
          raw: i.currentNode.nodeValue
        });
    }
    const h = this.dom.getAttribute(t), s = parseInt(h, 10), b = isNaN(s) ? 13 : s, v = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), g = this.dom.getAttribute("data-ln-obfuscator-key");
    let f = "rot";
    v === "xor" || v === "base64" ? f = v : g && (f = "xor");
    const c = g || "ln-ashlar", a = { codec: f, shift: b, key: c };
    if (u && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const i = this.dom.querySelectorAll("[data-ln-external-links-hint]");
      for (let r = 0; r < i.length; r++)
        i[r].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const _ = (this.dom.rel || "").split(/\s+/).filter(function(r) {
        return r && r !== "noopener" && r !== "noreferrer";
      });
      _.length > 0 ? this.dom.rel = _.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let i = 0; i < this._originalTextNodes.length; i++) {
        const _ = this._originalTextNodes[i];
        _.node && _.raw && _.raw.length > 0 && (_.node.nodeValue = Ce(_.raw, a));
      }
    if (u && this._originalHref) {
      const i = Ce(this._originalHref, a);
      this.dom.setAttribute("href", i);
    }
    L(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: f,
      shift: b,
      key: f === "xor" ? c : null
    });
  }, p.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let u = 0; u < this._originalTextNodes.length; u++) {
          const d = this._originalTextNodes[u];
          d.node && d.raw && (d.node.nodeValue = d.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const m = B(t, e, p, "ln-obfuscator", {
    attributes: l
  });
  m.obfuscate = kr, m.deobfuscate = Ce, m.utf8ToBase64 = Ci, m.base64ToUtf8 = Ti, m.xorObfuscate = Li, m.xorDeobfuscate = xi;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(d) {
    return d.hostname && d.hostname !== window.location.hostname;
  }
  function n(d) {
    if (d.getAttribute("data-ln-external-link") === "processed" || !e(d)) return;
    d.target = "_blank";
    const h = (d.rel || "").split(/\s+/).filter(Boolean);
    h.includes("noopener") || h.push("noopener"), h.includes("noreferrer") || h.push("noreferrer"), d.rel = h.join(" ");
    const s = document.createElement("span");
    s.setAttribute("data-ln-external-links-hint", ""), s.textContent = "(opens in new tab)", d.appendChild(s), d.setAttribute("data-ln-external-link", "processed"), L(d, "ln-external-links:processed", {
      link: d,
      href: d.href
    });
  }
  function l(d) {
    d = d || document.body;
    for (const h of d.querySelectorAll("a, area"))
      n(h);
  }
  function p() {
    ft(function() {
      document.body.addEventListener("click", function(d) {
        const h = d.target.closest("a, area");
        h && h.getAttribute("data-ln-external-link") === "processed" && L(h, "ln-external-links:clicked", {
          link: h,
          href: h.href,
          text: h.textContent || h.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    ft(function() {
      Jt({
        onInit: function(d) {
          if (d.matches && (d.matches("a") || d.matches("area")) && n(d), d.querySelectorAll)
            for (const h of d.querySelectorAll("a, area"))
              n(h);
        }
      }), qt(["href"], function(d) {
        d.matches && (d.matches("a") || d.matches("area")) && n(d);
      });
    }, "ln-external-links");
  }
  function u() {
    p(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      l();
    }) : l();
  }
  window[t] = {
    process: l
  }, u();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let n = null;
  function l() {
    n = document.createElement("div"), n.className = "ln-link-status", document.body.appendChild(n);
  }
  function p(_) {
    n && (n.textContent = _, n.classList.add("ln-link-status--visible"));
  }
  function m() {
    n && n.classList.remove("ln-link-status--visible");
  }
  function u(_, r) {
    if (r.target.closest("a, button, input, select, textarea")) return;
    const y = _.querySelector("a");
    if (!y) return;
    const o = y.getAttribute("href");
    if (!o) return;
    if (r.ctrlKey || r.metaKey || r.button === 1) {
      window.open(o, "_blank", "noopener,noreferrer");
      return;
    }
    W(_, "ln-link:navigate", { target: _, href: o, link: y }).defaultPrevented || y.click();
  }
  function d(_) {
    const r = _.querySelector("a");
    if (!r) return;
    const y = r.getAttribute("href");
    y && p(y);
  }
  function h() {
    m();
  }
  function s(_) {
    _[e + "Row"] || !_.querySelector("a") || (_[e + "Row"] = !0, _._lnLinkClick = function(y) {
      u(_, y);
    }, _._lnLinkEnter = function() {
      d(_);
    }, _.addEventListener("click", _._lnLinkClick), _.addEventListener("mouseenter", _._lnLinkEnter), _.addEventListener("mouseleave", h));
  }
  function b(_) {
    _[e + "Row"] && (_._lnLinkClick && _.removeEventListener("click", _._lnLinkClick), _._lnLinkEnter && _.removeEventListener("mouseenter", _._lnLinkEnter), _.removeEventListener("mouseleave", h), delete _._lnLinkClick, delete _._lnLinkEnter, delete _[e + "Row"]);
  }
  function v(_) {
    if (!_[e + "Init"]) return;
    const r = _.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const y = r === "TABLE" && _.querySelector("tbody") || _;
      for (const o of y.querySelectorAll("tr"))
        b(o);
    } else
      b(_);
    delete _[e + "Init"];
  }
  function g(_) {
    if (_[e + "Init"]) return;
    _[e + "Init"] = !0;
    const r = _.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const y = r === "TABLE" && _.querySelector("tbody") || _;
      for (const o of y.querySelectorAll("tr"))
        s(o);
    } else
      s(_);
  }
  function f(_) {
    _.hasAttribute && _.hasAttribute(t) && g(_);
    const r = _.querySelectorAll ? _.querySelectorAll("[" + t + "]") : [];
    for (const y of r)
      g(y);
  }
  function c() {
    ft(function() {
      Jt({
        query: "[" + t + "]",
        onInit: function(_) {
          f(_);
        },
        onSubtreeChange: function(_, r) {
          for (let y = 0; y < r.addedNodes.length; y++) {
            const o = r.addedNodes[y];
            if (o.nodeType === 1) {
              if (o.tagName === "TR")
                s(o);
              else if (o.querySelectorAll) {
                const A = o.querySelectorAll("tr");
                for (let w = 0; w < A.length; w++)
                  s(A[w]);
              }
            }
          }
        }
      }), qt([t], function(_) {
        _.hasAttribute && _.hasAttribute(t) ? f(_) : v(_);
      });
    }, "ln-link");
  }
  function a(_) {
    f(_);
  }
  window[e] = { init: a, destroy: v };
  function i() {
    l(), c(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const t = "data-ln-scroll", e = "lnScroll";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-scroll": { effect: null, type: "string", description: "Target element ID or CSS selector to scroll into view" },
    "data-ln-scroll-behavior": { effect: null, type: "enum", values: ["smooth", "auto"], fallback: "smooth", description: "Scroll animation behavior transition" },
    "data-ln-scroll-block": { effect: null, type: "enum", values: ["start", "center", "end", "nearest"], fallback: "start", description: "Vertical alignment positioning of scrolled target" },
    "data-ln-scroll-set": { effect: null, type: "string", description: "Optional state attribute assignment on target after scroll (e.g. data-ln-toggle=open)" },
    "data-ln-scroll-focus": { effect: null, type: "string", description: 'CSS selector of element to focus after scroll, or "false" to disable' },
    "data-ln-scroll-delay": { effect: null, type: "integer", fallback: 450, min: 0, description: "Delay in milliseconds before shifting keyboard focus" },
    "data-ln-scroll-update-hash": { effect: null, type: "boolean", fallback: !1, description: "Whether to update URL hash with target ID" }
  };
  function l(p) {
    if (p[e]) return p[e];
    if (!(!p || p.tagName !== "A" && p.tagName !== "BUTTON"))
      return p[e] = this, this.dom = p, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  l.prototype._handleClick = function(p) {
    if (this.dom.tagName === "A" && (p.ctrlKey || p.metaKey || p.shiftKey || p.altKey || p.button !== 0))
      return;
    let m = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (m || (m = (this.dom.getAttribute("href") || "").trim()), !m || m === "#")
      return;
    !m.startsWith("#") && !m.startsWith(".") && !m.startsWith("[") && (m = "#" + m);
    let u = null;
    try {
      u = document.querySelector(m);
    } catch {
      const c = m.replace(/^#/, "");
      u = document.getElementById(c);
    }
    if (!u) return;
    p.preventDefault();
    const d = this.dom.getAttribute("data-ln-scroll-set");
    if (d) {
      const f = d.indexOf(":");
      if (f !== -1) {
        const c = d.slice(0, f).trim(), a = d.slice(f + 1).trim();
        try {
          const i = document.querySelector(c);
          i && (i.value = a, i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (W(this.dom, "ln-scroll:before-scroll", {
      target: u,
      link: this.dom,
      href: m
    }).defaultPrevented) return;
    const s = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", b = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (u.scrollIntoView({ behavior: s, block: b }), Et(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", m);
      } catch {
      }
    const g = this.dom.getAttribute("data-ln-scroll-focus");
    if (g !== "false" && g !== "0") {
      const f = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), c = isNaN(f) ? 450 : f;
      window.setTimeout(function() {
        let a = null;
        if (g && g !== "true" && g !== "1")
          try {
            a = document.querySelector(g);
          } catch {
          }
        a || (a = u.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !a && u.getAttribute("tabindex") !== null && (a = u), a && typeof a.focus == "function" && a.focus({ preventScroll: !0 });
      }, c);
    }
    L(this.dom, "ln-scroll:scrolled", {
      target: u,
      link: this.dom,
      href: m
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, B(t, e, l, "ln-scroll", {
    attributes: n
  });
})();
const Wt = ["Ctrl", "Alt", "Shift", "Meta"], Lr = {
  alt: "Alt",
  control: "Ctrl",
  ctrl: "Ctrl",
  meta: "Meta",
  command: "Meta",
  cmd: "Meta",
  option: "Alt",
  shift: "Shift",
  esc: "Escape",
  escape: "Escape",
  space: "Space",
  spacebar: "Space",
  enter: "Enter",
  return: "Enter",
  tab: "Tab",
  backspace: "Backspace",
  delete: "Delete",
  del: "Delete",
  insert: "Insert",
  home: "Home",
  end: "End",
  pageup: "PageUp",
  pagedown: "PageDown",
  arrowup: "ArrowUp",
  up: "ArrowUp",
  arrowdown: "ArrowDown",
  down: "ArrowDown",
  arrowleft: "ArrowLeft",
  left: "ArrowLeft",
  arrowright: "ArrowRight",
  right: "ArrowRight"
};
function qi(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const n = Lr[e.toLowerCase()];
  return n || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Ri(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const n = e.split("+"), l = /* @__PURE__ */ new Set();
  let p = "";
  for (let u = 0; u < n.length; u++) {
    const d = qi(n[u]);
    if (!d) return "";
    if (Wt.indexOf(d) !== -1) {
      l.add(d);
      continue;
    }
    if (p) return "";
    p = d;
  }
  if (!p) return "";
  const m = [];
  for (let u = 0; u < Wt.length; u++)
    l.has(Wt[u]) && m.push(Wt[u]);
  return m.push(p), m.join("+");
}
function xr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const n = e.split(/[\s,]+/), l = [];
  for (let p = 0; p < n.length; p++) {
    const m = Ri(n[p]);
    m && l.indexOf(m) === -1 && l.push(m);
  }
  return l;
}
function Ir(t, e) {
  const n = String(e || "").trim();
  if (!n || /[\s,]/.test(n)) return "";
  const l = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(l) ? "" : Ri(l ? l + "+" + n : n);
}
function qr(t) {
  if (!t) return "";
  const e = qi(t.key);
  if (!e || Wt.indexOf(e) !== -1) return "";
  const n = [];
  return t.ctrlKey && n.push("Ctrl"), t.altKey && n.push("Alt"), t.shiftKey && n.push("Shift"), t.metaKey && n.push("Meta"), n.push(e), n.join("+");
}
function Rr(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const n = t.getAttribute("contenteditable");
    if (n === "" || String(n).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Dr(t, e, n, l) {
  if (!t || !e || n !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const p = String(e.tagName || "").toLowerCase();
  return p === "button" ? l === "Enter" || l === "Space" : p === "a" && e.hasAttribute && e.hasAttribute("href") && l === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", n = "data-ln-key-target", l = "data-ln-key-allow-input", p = "data-ln-key-modifier", m = "data-ln-key-for", u = "lnKeyFor";
  if (window[e] !== void 0) return;
  function d(r) {
    const y = r[e];
    if (y) {
      if (!r.hasAttribute(t)) {
        y.destroy();
        return;
      }
      y.sync();
    }
  }
  function h(r) {
    const y = r[u];
    y && !r.hasAttribute(m) && y.destroy();
  }
  const s = {
    "data-ln-key": { type: "string", effect: d, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: d, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: d, description: "Permits shortcut execution even when focused inside an editable input" }
  }, b = {
    "data-ln-key-for": { type: "string", effect: h, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" },
    "data-ln-key-map": { type: "string", description: "Container modifier context alias for external shortcut badges" }
  }, v = /* @__PURE__ */ new Set();
  let g = null;
  function f() {
    g || (g = function(r) {
      if (r.defaultPrevented || r.isComposing || r.repeat) return;
      const y = qr(r);
      if (!y) return;
      const o = Wi(r.target), A = document.querySelectorAll("[" + t + "], [" + m + "]");
      let w = null, S = !1, E = !1;
      for (let x = 0; x < A.length; x++) {
        const I = A[x], q = I[e] || I[u];
        if (!q || !q.matches(y) || o && !q.allowsInput()) continue;
        const D = q.resolveTarget(), N = Rr(D);
        if (!(!N || !Vi(D, N))) {
          if (Dr(r, D, N, y)) {
            E = !0;
            continue;
          }
          w ? S = !0 : w = { host: I, target: D, action: N };
        }
      }
      if (E || !w) return;
      S && console.warn('[ln-key] Duplicate active shortcut "' + y + '"; first DOM match wins.');
      const C = {
        source: w.host,
        target: w.target,
        action: w.action,
        key: y,
        event: r
      };
      W(w.host, "ln-key:before-trigger", C).defaultPrevented || (r.preventDefault(), w.target[w.action](), L(w.host, "ln-key:trigger", C));
    }, document.addEventListener("keydown", g));
  }
  function c() {
    v.size > 0 || !g || (document.removeEventListener("keydown", g), g = null);
  }
  function a(r) {
    return this.dom = r, this.shortcuts = [], v.add(this), this.sync(), f(), this;
  }
  a.prototype.sync = function() {
    this.shortcuts = xr(this.dom.getAttribute(t));
  }, a.prototype.matches = function(r) {
    return this.shortcuts.indexOf(r) !== -1;
  }, a.prototype.allowsInput = function() {
    return this.dom.hasAttribute(l);
  }, a.prototype.resolveTarget = function() {
    const r = this.dom.getAttribute(n);
    return r ? _(r, n) : this.dom;
  }, a.prototype.destroy = function() {
    this.dom[e] && (v.delete(this), delete this.dom[e], c());
  };
  function i(r) {
    return this.dom = r, v.add(this), f(), this;
  }
  i.prototype._modifierContext = function() {
    return this.dom.closest("[" + p + "], [data-ln-key-map]");
  }, i.prototype.shortcut = function() {
    const r = this._modifierContext(), y = r && (r.getAttribute(p) || r.getAttribute("data-ln-key-map")) || "";
    return Ir(y, this.dom.textContent);
  }, i.prototype.matches = function(r) {
    return this.shortcut() === r;
  }, i.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(l)) return !0;
    const r = this._modifierContext();
    return !!(r && r.hasAttribute(l));
  }, i.prototype.resolveTarget = function() {
    return _(this.dom.getAttribute(m), m);
  }, i.prototype.destroy = function() {
    this.dom[u] && (v.delete(this), delete this.dom[u], c());
  };
  function _(r, y) {
    if (!r) return null;
    try {
      const o = document.querySelector(r) || document.getElementById(r);
      return o || console.warn("[ln-key] Target not found for " + y + ' selector or ID "' + r + '".'), o;
    } catch {
      const A = document.getElementById(r);
      return A || (console.warn("[ln-key] Invalid " + y + ' selector "' + r + '".'), null);
    }
  }
  B(t, e, a, "ln-key", {
    attributes: s
  }), B(m, u, i, "ln-key-for", {
    attributes: b
  });
})();
function Or(t, e, n = 100) {
  if (e != null && e !== "") {
    const l = parseFloat(String(e));
    if (!isNaN(l) && l > 0) return l;
  }
  if (t != null && t !== "") {
    const l = parseFloat(String(t));
    if (!isNaN(l) && l > 0) return l;
  }
  return n;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function n(u) {
    const d = u[e];
    d && m.call(d);
  }
  const l = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: n, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: n, description: "Maximum progress scale value" }
  };
  function p(u) {
    return this.dom = u, this._parentObserver = null, m.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function m() {
    const u = this.dom.getAttribute("data-ln-progress"), d = this.dom.parentElement, h = d ? d.getAttribute("data-ln-progress-max") : null, s = this.dom.getAttribute("data-ln-progress-max"), b = Or(s, h, 100), v = ri(u, b);
    this.dom.style.width = v.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  B(
    t,
    e,
    p,
    "ln-progress",
    {
      attributes: l
    }
  ), qt(["data-ln-progress-max"], function(u) {
    const d = u.querySelectorAll ? u.querySelectorAll(t) : [];
    for (let h = 0; h < d.length; h++) {
      const s = d[h][e];
      s && m.call(s);
    }
  });
})();
function Nr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e[n]) return !0;
  return !1;
}
function Mr(t, e, n) {
  if (!e || typeof e != "object") return !0;
  const l = Object.keys(e);
  if (l.length === 0) return !0;
  for (let p = 0; p < l.length; p++) {
    const m = e[l[p]];
    let u = "";
    if (m.col !== null && m.col !== void 0 ? u = t[m.col] || "" : m.attr && n && typeof n.getAttribute == "function" && (u = n.getAttribute(m.attr) || ""), !Ze(u, m.values))
      return !1;
  }
  return !0;
}
function vn(t, e, n, l) {
  if (l != null && !isNaN(l))
    return parseInt(l, 10);
  if (e && typeof e.getAttribute == "function") {
    const p = e.getAttribute("data-ln-filter-col");
    if (p !== null && !isNaN(parseInt(p, 10)))
      return parseInt(p, 10);
    if (typeof e.closest == "function") {
      const m = e.closest("th");
      if (m && typeof m.cellIndex == "number")
        return m.cellIndex;
      const u = e.closest("[data-ln-popover], [id]");
      if (u && u.id) {
        const d = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (d && typeof d.querySelector == "function") {
          const h = d.querySelector('[data-ln-popover-for="' + u.id + '"]');
          if (h && typeof h.closest == "function") {
            const s = h.closest("th");
            if (s && typeof s.cellIndex == "number")
              return s.cellIndex;
          }
        }
      }
    }
  }
  if (t && n && typeof t.querySelectorAll == "function") {
    const p = t.querySelectorAll("thead th, tr:first-child th"), m = String(n).trim().toLowerCase();
    for (let u = 0; u < p.length; u++) {
      const d = p[u], h = d.getAttribute("data-ln-table-filter-col") || d.getAttribute("data-ln-filter-col") || d.getAttribute("data-ln-filter-key") || d.getAttribute("data-ln-table-col") || d.getAttribute("data-ln-col") || d.getAttribute("data-ln-field");
      if (h && h.trim().toLowerCase() === m)
        return typeof d.cellIndex == "number" ? d.cellIndex : u;
    }
    if (e) {
      const u = e.closest ? e.closest("[data-ln-popover], [id]") : null, d = u && u.id || e.id || null;
      if (d)
        for (let h = 0; h < p.length; h++) {
          const s = p[h];
          if (typeof s.querySelector == "function" && s.querySelector('[data-ln-popover-for="' + d + '"]'))
            return typeof s.cellIndex == "number" ? s.cellIndex : h;
        }
    }
    for (let u = 0; u < p.length; u++) {
      const d = p[u], s = Array.from(d.childNodes || []).filter((v) => v.nodeType === 3), b = (s.length > 0 ? s.map((v) => v.textContent.trim()).join(" ") : d.textContent || "").trim().toLowerCase();
      if (b && b === m)
        return typeof d.cellIndex == "number" ? d.cellIndex : u;
    }
  }
  return null;
}
function Fr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const n = [];
  for (let l = 0; l < t.length; l++) {
    const p = t[l];
    !e && p.key && (e = p.key), p.checked && !p.isReset && p.value && n.push(p.value);
  }
  return { key: e, values: n };
}
function Pr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function wn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", n = "data-ln-filter-key", l = "data-ln-filter-value", p = "data-ln-filter-hide", m = "data-ln-filter-reset", u = "data-ln-filter-col", d = "data-ln-hash", h = "data-ln-query", s = "data-ln-filter-values", b = "data-ln-filter-target", v = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-filter": { prop: "targetId", type: "string", read: K, fallback: null, effect: A, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: A, description: "URL hash routing key for filter state persistence" },
    "data-ln-query": { type: "string", effect: A, description: "URL query parameter name for filter state synchronization" },
    "data-ln-filter-values": { type: "string", effect: A, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, f = Y(g);
  function c(w) {
    if (!w.hasAttribute(h)) return null;
    const S = w.getAttribute(h);
    if (S && S.trim() !== "") return S.trim();
    const E = w.getAttribute(u);
    if (E && isNaN(parseInt(E, 10))) return E.trim();
    const C = w.querySelector("[" + n + "]");
    if (C) {
      const T = C.getAttribute(n);
      if (T && T.trim() !== "") return T.trim();
    }
    return kt(w, "filter");
  }
  function a(w) {
    return w.hasAttribute(m) || !w.getAttribute(l);
  }
  function i(w) {
    const S = w.dom.querySelectorAll("[" + n + "]"), E = [];
    for (let T = 0; T < S.length; T++) {
      const x = S[T];
      E.push({
        key: x.getAttribute(n),
        value: x.getAttribute(l) || "",
        checked: x.checked,
        isReset: a(x)
      });
    }
    const C = Fr(E);
    return { key: C.key, values: C.values, targetId: w.targetId };
  }
  function _(w, S, E) {
    const C = w.querySelectorAll("[" + n + "]"), T = Array.isArray(E) && E.length > 0;
    for (let x = 0; x < C.length; x++) {
      const I = C[x];
      a(I) ? I.checked = !T : T && I.getAttribute(n) === S && E.indexOf(I.getAttribute(l)) !== -1 ? I.checked = !0 : I.checked = !1;
    }
  }
  function r(w) {
    this.dom = w, X(this, w, f);
    const S = w.getAttribute(u);
    this.colIndex = S !== null ? parseInt(S, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = vt(w, "filter"), this.hashEnabled = !!this.nsKey, this.queryParam = c(w), this.queryEnabled = !!this.queryParam;
    const E = this, C = Ut(function() {
      E._destroyed || E._render();
    });
    this._queueRender = C;
    const T = Ut(function() {
      E._destroyed || E._applyDomFilter();
    });
    this._queueDomFilter = T;
    function x() {
      if (!E.targetId) return;
      const q = document.getElementById(E.targetId);
      q && !q.hasAttribute(b) && q.setAttribute(b, E.targetId);
    }
    this._ensureTargetMarked = x, x(), ut(function() {
      E._destroyed || x();
    }), this._attachHandlers(), this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const q = at(E.nsKey), D = Ie(q);
      D && D.key && D.values.length > 0 ? _(E.dom, D.key, D.values) : _(E.dom, null, []), E._render();
    }, this._onPopState = function() {
      if (E._destroyed || !E.queryEnabled) return;
      const q = It(E.queryParam), D = De(q), N = E.dom.querySelector("[" + n + "]"), F = N ? N.getAttribute(n) : E.queryParam;
      _(E.dom, F, D), E._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let I = !1;
    if (this.hashEnabled) {
      const q = at(this.nsKey), D = Ie(q);
      D && D.key && D.values.length > 0 && (_(w, D.key, D.values), ut(function() {
        E._destroyed || E._render();
      }), I = !0);
    } else if (this.queryEnabled) {
      const q = It(this.queryParam), D = De(q);
      if (D.length > 0) {
        const N = w.querySelector("[" + n + "]"), F = N ? N.getAttribute(n) : E.queryParam;
        _(w, F, D), ut(function() {
          E._destroyed || E._render();
        }), I = !0;
      }
    }
    if (!I) {
      const q = wn(w.getAttribute(s));
      if (q.length > 0) {
        const D = w.querySelector("[" + n + "]"), N = D ? D.getAttribute(n) : null;
        N && (_(w, N, q), ut(function() {
          E._destroyed || E._render();
        }), I = !0);
      }
    }
    if (!I) {
      const q = w.querySelectorAll("[" + n + "]");
      for (let D = 0; D < q.length; D++)
        if (q[D].checked && !a(q[D])) {
          ut(function() {
            E._destroyed || E._render();
          });
          break;
        }
    }
    return this;
  }
  r.prototype._attachHandlers = function() {
    const w = this;
    this._onDomChange = function(S) {
      const E = S.target;
      if (!E || !E.hasAttribute || !E.hasAttribute(n)) return;
      const C = Array.from(w.dom.querySelectorAll("[" + n + "]"));
      if (a(E)) {
        for (let T = 0; T < C.length; T++)
          a(C[T]) || (C[T].checked = !1);
        E.checked = !0, w._queueRender();
        return;
      }
      if (E.checked) {
        for (let x = 0; x < C.length; x++)
          a(C[x]) && (C[x].checked = !1);
        let T = !1;
        for (let x = 0; x < C.length; x++)
          if (a(C[x])) {
            T = !0;
            break;
          }
        if (T) {
          let x = !0;
          for (let I = 0; I < C.length; I++)
            if (!a(C[I]) && !C[I].checked) {
              x = !1;
              break;
            }
          if (x)
            for (let I = 0; I < C.length; I++)
              a(C[I]) ? C[I].checked = !0 : C[I].checked = !1;
        }
      } else {
        let T = !1;
        for (let x = 0; x < C.length; x++)
          if (!a(C[x]) && C[x].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let x = 0; x < C.length; x++)
            a(C[x]) && (C[x].checked = !0);
      }
      w._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, r.prototype._render = function() {
    const w = this, S = i(this), E = this._lastSnapshot;
    if (!(!E || E.key !== S.key || Nr(E.values, S.values))) return;
    S.key === null || S.values.length;
    const T = document.getElementById(w.targetId), x = {
      key: S.key,
      values: S.values.slice(),
      targetId: w.targetId
    };
    L(w.dom, "ln-filter:change", x);
    let I = !1;
    T && T !== w.dom && W(T, "ln-filter:change", x).defaultPrevented && (I = !0);
    const q = E && E.values.length > 0, D = S.values.length === 0;
    if (q && D) {
      const F = { targetId: w.targetId };
      L(w.dom, "ln-filter:reset", F), T && T !== w.dom && L(T, "ln-filter:reset", F);
    }
    this._lastSnapshot = { key: S.key, values: S.values.slice() };
    const N = Pr(S.values);
    if (N ? this.dom.setAttribute(s, N) : this.dom.removeAttribute(s), this.hashEnabled) {
      const F = ti(S.key, S.values);
      mt(this.nsKey, F);
    } else if (this.queryEnabled) {
      const F = ni(S.values), H = this.queryParam || S.key;
      H && be(H, F);
    }
    I || w._applyDomFilter(T);
  }, r.prototype._applyDomFilter = function(w) {
    const S = w || document.getElementById(this.targetId);
    if (!S) return;
    const E = i(this), C = E.key === null || E.values.length === 0, T = S.tagName === "TABLE" ? S : S.querySelector ? S.querySelector("table") : null;
    if (T)
      this._filterTableRows(E, T);
    else {
      const x = S.children;
      for (let I = 0; I < x.length; I++) {
        const q = x[I], D = C ? null : q.getAttribute("data-" + E.key), N = !C && D !== null && !Ze(D, E.values), F = q.hasAttribute(p);
        N && !F ? q.setAttribute(p, "true") : !N && F && q.removeAttribute(p);
      }
    }
  };
  function y(w) {
    if (!w) return "";
    const S = w.querySelector ? w.querySelector("[data-ln-value]") : null;
    return yt(S || w);
  }
  function o(w) {
    return !!(!w || typeof w != "object" || w.tagName === "TEMPLATE" || typeof w.hasAttribute == "function" && (w.hasAttribute("data-ln-sort-exclude") || w.hasAttribute("data-ln-table-empty") || w.hasAttribute("hidden")) || w.classList && w.classList.contains("hidden") || w.style && w.style.display === "none");
  }
  r.prototype._filterTableRows = function(w, S) {
    if (!S) {
      const q = document.getElementById(this.targetId);
      if (!q || (S = q.tagName === "TABLE" ? q : q.querySelector ? q.querySelector("table") : null, !S)) return;
    }
    const E = vn(S, this.dom, w.key, this.colIndex), C = w.key || this.dom.getAttribute("data-ln-filter-key") || (E !== null ? "col" + E : "attr-filter"), T = w.values;
    v.has(S) || v.set(S, {});
    const x = v.get(S);
    C && T.length > 0 ? x[C] = {
      col: E,
      values: T.slice(),
      attr: "data-" + C
    } : C && delete x[C];
    const I = S.tBodies;
    for (let q = 0; q < I.length; q++) {
      const D = I[q].rows;
      for (let N = 0; N < D.length; N++) {
        const F = D[N];
        if (o(F)) continue;
        const H = {};
        for (let Z = 0; Z < F.cells.length; Z++)
          H[Z] = y(F.cells[Z]);
        const U = !Mr(H, x, F), G = F.hasAttribute(p);
        U && !G ? F.setAttribute(p, "true") : !U && G && F.removeAttribute(p);
      }
    }
  }, r.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const w = document.getElementById(this.targetId);
    if (w) {
      const S = w.tagName === "TABLE" ? w : w.querySelector ? w.querySelector("table") : null;
      if (S && v.has(S)) {
        const E = v.get(S), C = vn(S, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (C !== null ? "col" + C : this.colIndex !== null ? "col" + this.colIndex : null);
        T && E[T] && (delete E[T], this._filterTableRows({ key: null, values: [] }, S)), Object.keys(E).length === 0 && v.delete(S);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && w.removeAttribute(b);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e];
  };
  function A(w, S) {
    const E = w[e];
    if (!(!E || E._destroyed))
      if (S === d)
        E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = vt(w, "filter"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      else if (S === h)
        E.queryEnabled && E._onPopState && window.removeEventListener("popstate", E._onPopState), E.queryParam = c(w), E.queryEnabled = !!E.queryParam, E.queryEnabled && window.addEventListener("popstate", E._onPopState);
      else if (S === s) {
        const C = wn(w.getAttribute(s)), T = w.querySelector("[" + n + "]"), x = T ? T.getAttribute(n) : null;
        x && (_(w, x, C), E._render());
      } else S === t && (E.targetId = w.getAttribute(t) || null, E._ensureTargetMarked(), E._render());
  }
  B(t, e, r, "ln-filter", {
    attributes: g,
    subtreeQuery: "[" + t + "], [" + b + "]",
    onSubtreeChange: function(w, S) {
      if (S.addedNodes.length === 0 && S.removedNodes.length === 0) return;
      let E = null, C = null;
      if (w.hasAttribute(b) ? (C = w, E = w.getAttribute(b) || w.id) : w.hasAttribute(t) && (E = w.getAttribute(t), C = E ? document.getElementById(E) : null), !E || !C) return;
      const T = document.querySelectorAll("[" + t + '="' + E + '"]');
      for (let x = 0; x < T.length; x++) {
        const I = T[x][e];
        I && !I._destroyed && i(I).values.length > 0 && I._queueDomFilter();
      }
    },
    persist: {
      attr: s,
      hashActive: function(w) {
        return !!vt(w, "filter") || !!c(w);
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", n = "data-ln-search-for", l = "lnSearchControl", p = "data-ln-search-items", m = "data-ln-search-fields", u = "data-ln-search-exclude", d = "data-ln-search-hide", h = "data-ln-hash", s = "data-ln-query";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-search": { type: "string", effect: A, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: A, description: "URL hash routing key for search state persistence" },
    "data-ln-query": { type: "string", effect: A, description: "URL query parameter name for search query state synchronization" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, v = Y(b);
  function g(w) {
    const S = vt(w, "search");
    if (S) return S;
    if (w.id) {
      const E = document.querySelector("[" + n + '="' + w.id + '"]');
      if (E) {
        const C = vt(E, "search");
        if (C) return C;
      }
    }
    return null;
  }
  function f(w) {
    const S = kt(w, "search");
    if (S) return S;
    if (w.id) {
      const E = document.querySelector("[" + n + '="' + w.id + '"]');
      if (E) {
        const C = kt(E, "search");
        if (C) return C;
      }
    }
    return null;
  }
  function c(w) {
    return w.matches("input, textarea") ? w : w.querySelector("input, textarea");
  }
  function a(w, S) {
    const E = w.childNodes;
    for (let C = 0; C < E.length; C++) {
      const T = E[C];
      if (T.nodeType === 3) {
        S.push(T.nodeValue);
        continue;
      }
      T.nodeType === 1 && (T.hasAttribute(u) || a(T, S));
    }
  }
  function i(w) {
    if (w._lnSearchText !== void 0) return w._lnSearchText;
    const S = [];
    a(w, S);
    const E = lr(S);
    return w._lnSearchText = E, E;
  }
  function _(w, S) {
    if (!w.id) return;
    const E = document.querySelectorAll("[" + n + '="' + w.id + '"]');
    for (const C of E) {
      const T = c(C);
      T && T.value !== S && (T.value = S);
    }
  }
  function r(w) {
    this.dom = w, this.term = w.getAttribute(t) || "", this._destroyed = !1;
    const S = this;
    return this.nsKey = g(w), this.hashEnabled = !!this.nsKey, this.queryParam = f(w), this.queryEnabled = !!this.queryParam, this._queueApply = Ut(function() {
      S._destroyed || S._apply();
    }), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const E = at(S.nsKey), C = S.dom.getAttribute(t) || "";
      E !== null && E !== C ? S.dom.setAttribute(t, E) : E === null && C !== "" && S.dom.setAttribute(t, "");
    }, this._onPopState = function() {
      if (S._destroyed || !S.queryEnabled) return;
      const E = It(S.queryParam) || "", C = S.dom.getAttribute(t) || "";
      E !== C && S.dom.setAttribute(t, E);
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState), ut(function() {
      if (!S._destroyed) {
        if (S.hashEnabled) {
          const E = at(S.nsKey);
          if (E !== null && E !== S.term) {
            S.term = E, S.dom.setAttribute(t, E), _(S.dom, E), S._apply();
            return;
          }
        } else if (S.queryEnabled) {
          const E = It(S.queryParam);
          if (E !== null && E !== S.term) {
            S.term = E, S.dom.setAttribute(t, E), _(S.dom, E), S._apply();
            return;
          }
        }
        ae(S.term) && (_(S.dom, S.term), S._apply());
      }
    }), this;
  }
  r.prototype._apply = function() {
    const w = this.dom, S = ae(this.term), E = si(S);
    this.hashEnabled ? mt(this.nsKey, this.term ? this.term : null) : this.queryEnabled && be(this.queryParam, this.term ? this.term : null);
    const C = ar(w.getAttribute(m));
    if (W(w, "ln-search:change", {
      term: S,
      tokens: E,
      targetId: w.id,
      fields: C
    }).defaultPrevented) return;
    const x = w.getAttribute(p), I = x ? w.querySelectorAll(x) : w.children;
    for (let q = 0; q < I.length; q++) {
      const D = I[q];
      if (D.hasAttribute(u)) {
        D.hasAttribute(d) && D.removeAttribute(d);
        continue;
      }
      const N = E.length > 0 && !ai(i(D), E), F = D.hasAttribute(d);
      N && !F ? D.setAttribute(d, "true") : !N && F && D.removeAttribute(d);
    }
  }, r.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function y(w) {
    if (this.dom = w, X(this, w, v), this.input = c(w), this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      ut(function() {
        const E = document.getElementById(S.targetId);
        E && ((E.getAttribute(t) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  y.prototype._write = function(w) {
    const S = document.getElementById(this.targetId);
    S && S.getAttribute(t) !== w && S.setAttribute(t, w);
  }, y.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      w._write(w.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, y.prototype.destroy = function() {
    this.dom[l] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[l]);
  };
  function o(w) {
    const S = w.getAttribute("data-ln-search-clear-for");
    if (S) {
      const I = document.getElementById(S), q = document.querySelector("[" + n + '="' + S + '"]'), D = q ? c(q) : null;
      return { target: I, input: D };
    }
    const E = w.closest("[" + t + "]");
    if (E) {
      const I = E.id ? document.querySelector("[" + n + '="' + E.id + '"]') : null, q = I ? c(I) : null;
      return { target: E, input: q };
    }
    const C = w.closest("[data-ln-table-source], [data-ln-list-source]");
    if (C) {
      const I = C.getAttribute("data-ln-table-source") || C.getAttribute("data-ln-list-source"), q = I ? document.getElementById(I) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + n + '="' + I + '"]'), N = D ? c(D) : null;
        return { target: q, input: N };
      }
    }
    const T = w.closest("[" + n + "]");
    if (T) {
      const I = T.getAttribute(n), q = I ? document.getElementById(I) : null, D = c(T);
      return { target: q, input: D };
    }
    const x = w.parentElement;
    if (x) {
      const I = x.querySelector("[" + n + "]");
      if (I) {
        const q = I.getAttribute(n), D = q ? document.getElementById(q) : null, N = c(I);
        return { target: D, input: N };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(w) {
    const S = w.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!S) return;
    const E = o(S);
    !E.target && !E.input || (w.preventDefault(), E.input && (E.input.value = "", E.input.focus()), E.target && E.target.setAttribute(t, ""));
  });
  function A(w, S) {
    const E = w[e];
    if (!E || E._destroyed) return;
    if (S === h) {
      E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = g(w), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      return;
    }
    if (S === s) {
      E._onPopState && window.removeEventListener("popstate", E._onPopState), E.queryParam = f(w), E.queryEnabled = !!E.queryParam, E.queryEnabled && window.addEventListener("popstate", E._onPopState);
      return;
    }
    const C = w.getAttribute(t) || "";
    C !== E.term && (E.term = C, _(w, C), E._apply());
  }
  B(t, e, r, "ln-search", {
    attributes: b,
    onSubtreeChange: function(w, S) {
      const E = S.target;
      E && E._lnSearchText !== void 0 && delete E._lnSearchText, E && E.parentElement && E.parentElement._lnSearchText !== void 0 && delete E.parentElement._lnSearchText;
      const C = w[e];
      if (C && !C._destroyed && ae(C.term) && (S.addedNodes.length > 0 || S.removedNodes.length > 0)) {
        for (let T = 0; T < S.addedNodes.length; T++) {
          const x = S.addedNodes[T];
          x._lnSearchText !== void 0 && delete x._lnSearchText;
        }
        C._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(w) {
        return !!g(w) || !!f(w);
      }
    }
  }), B(n, l, y, "ln-search-control");
})();
function At(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Br(t) {
  const e = At(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Hr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Ur(t, e, n, l) {
  const p = At(t);
  if (p === "none") return () => 0;
  const m = p === "desc" ? -1 : 1, u = typeof l == "function" ? l : (d) => d;
  return function(d, h) {
    const s = u(d), b = u(h);
    return _e(s, b, e, n) * m;
  };
}
function Te(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("data-ln-table-empty") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none");
}
function zr(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const n = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (n && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(n));
  if (t.tagName === "TABLE") {
    const l = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (l)
      return Array.from(l.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", n = "data-ln-sort-field", l = "data-ln-sort-state", p = "data-ln-sort-dir", m = "data-ln-hash", u = "data-ln-query";
  if (window[e] !== void 0) return;
  function d(c, a) {
    return c.getAttribute(a) || null;
  }
  const h = {
    "data-ln-sort": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: d, effect: f, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: d, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: f, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: f, description: "URL hash routing key for sort state persistence" },
    "data-ln-query": { type: "string", effect: f, description: "URL query parameter name for sort state persistence" }
  }, s = Y(h), b = /* @__PURE__ */ new WeakMap();
  function v(c, a, i) {
    if (a) {
      const _ = c.querySelector('[data-ln-field="' + a + '"]');
      return _ ? yt(_) : "";
    }
    return i != null && c.cells && c.cells[i] ? yt(c.cells[i]) : yt(c);
  }
  function g(c) {
    this.dom = c, X(this, c, s);
    const a = c.closest("th");
    this.column = !this.field && a ? a.cellIndex : null, this._state = At(c.getAttribute(l)), c.hasAttribute(l) || c.setAttribute(l, this._state), this._destroyed = !1, this.nsKey = vt(c, "sort"), this.hashEnabled = !!this.nsKey, this.queryParam = kt(c, "sort"), this.queryEnabled = !!this.queryParam;
    const i = this;
    this._onClick = function(r) {
      const y = r.target.closest("[" + p + "]");
      if (!y) return;
      const o = At(y.getAttribute(p));
      i._apply(o);
    }, c.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (i._destroyed || !r.detail) return;
      const y = i._resolveTarget();
      if (!(y && (r.target === y || y.contains(r.target)) || r.detail.targetId && r.detail.targetId === i.targetId)) return;
      if (Hr(
        { field: i.field, column: i.column },
        { field: r.detail.field, column: r.detail.column }
      )) {
        const w = At(r.detail.direction);
        w && c.getAttribute(l) !== w && (i._state = w, c.setAttribute(l, w), i._updateAriaSort(w));
        return;
      }
      c.getAttribute(l) !== "none" && (i._state = "none", c.setAttribute(l, "none"), i._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (i._destroyed || !i.hashEnabled) return;
      const r = at(i.nsKey), y = xe(r);
      if (y)
        i.field !== null && y.fieldOrColumn === i.field || i.column !== null && String(i.column) === y.fieldOrColumn ? i._state !== y.direction && i._apply(y.direction, !0) : i._state !== "none" && (i._state = "none", c.setAttribute(l, "none"), i._updateAriaSort("none"));
      else if (i._state !== "none") {
        i._state = "none", c.setAttribute(l, "none"), i._updateAriaSort("none");
        const o = i._resolveTarget();
        o && (W(o, "ln-sort:change", {
          field: i.field,
          column: i.column,
          direction: "none",
          targetId: i.targetId
        }).defaultPrevented || i._defaultSort(o, "none"));
      }
    }, this._onPopState = function() {
      if (i._destroyed || !i.queryEnabled) return;
      const r = It(i.queryParam), y = qe(), o = Re(r, y);
      if (o)
        i.field !== null && o.fieldOrColumn === i.field || i.column !== null && String(i.column) === o.fieldOrColumn ? i._state !== o.direction && i._apply(o.direction, !0) : i._state !== "none" && (i._state = "none", c.setAttribute(l, "none"), i._updateAriaSort("none"));
      else if (i._state !== "none") {
        i._state = "none", c.setAttribute(l, "none"), i._updateAriaSort("none");
        const A = i._resolveTarget();
        A && (W(A, "ln-sort:change", {
          field: i.field,
          column: i.column,
          direction: "none",
          targetId: i.targetId
        }).defaultPrevented || i._defaultSort(A, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let _ = !1;
    if (this.hashEnabled) {
      const r = at(this.nsKey), y = xe(r);
      y && ((i.field !== null && y.fieldOrColumn === i.field || i.column !== null && String(i.column) === y.fieldOrColumn) && ut(function() {
        i._destroyed || i._apply(y.direction, !0);
      }), _ = !0);
    } else if (this.queryEnabled) {
      const r = It(this.queryParam), y = qe(), o = Re(r, y);
      o && ((i.field !== null && o.fieldOrColumn === i.field || i.column !== null && String(i.column) === o.fieldOrColumn) && ut(function() {
        i._destroyed || i._apply(o.direction, !0);
      }), _ = !0);
    }
    if (!_) {
      const r = At(c.getAttribute(l));
      r && r !== "none" && ut(function() {
        i._destroyed || i._apply(r, !0);
      });
    }
    return this;
  }
  g.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, g.prototype._updateAriaSort = function(c) {
    const a = this.dom.closest("th");
    a && a.setAttribute("aria-sort", Br(c));
  }, g.prototype._apply = function(c, a) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const o = this.dom.closest("th");
      o && o.cellIndex !== void 0 && (this.column = o.cellIndex);
    }
    const i = At(c);
    this._state = i, this.dom.getAttribute(l) !== i && this.dom.setAttribute(l, i), this._updateAriaSort(i);
    const _ = this._resolveTarget();
    if (!_) return;
    const r = {
      field: this.field,
      column: this.column,
      direction: i,
      targetId: this.targetId
    };
    if (!a) {
      if (this.hashEnabled) {
        const o = Zn(this.field !== null ? this.field : this.column, i);
        mt(this.nsKey, o);
      } else if (this.queryEnabled) {
        const o = ei(this.field !== null ? this.field : this.column, i);
        be(this.queryParam, o);
      }
    }
    W(_, "ln-sort:change", r).defaultPrevented || this._defaultSort(_, i);
  }, g.prototype._defaultSort = function(c, a) {
    const i = zr(c, this.itemsSelector);
    if (!i.length) return;
    const _ = i[0].parentNode, r = i.filter(function(o) {
      return !Te(o);
    });
    if (!r.length) return;
    b.has(c) || b.set(c, r.slice());
    let y;
    if (a === "none") {
      const o = b.get(c) || r;
      b.delete(c), y = o.filter(function(A) {
        return A.parentNode === _ && !Te(A);
      });
    } else {
      const o = this.field, A = this.column, w = r.map(function(T) {
        return { el: T, val: v(T, o, A) };
      }), S = ge(w.map(function(T) {
        return T.val;
      })), E = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Ur(a, S, E, function(T) {
        return T.val;
      });
      w.sort(C), y = w.map(function(T) {
        return T.el;
      });
    }
    Xn(function() {
      const o = document.createDocumentFragment();
      let A = 0;
      for (let w = 0; w < i.length; w++) {
        const S = i[w];
        Te(S) ? o.appendChild(S) : A < y.length && o.appendChild(y[A++]);
      }
      _.appendChild(o);
    });
  }, g.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function f(c, a) {
    const i = c[e];
    if (!(!i || i._destroyed))
      if (a === n) {
        const _ = c.closest("th");
        i.column = !i.field && _ ? _.cellIndex : null;
      } else if (a === l) {
        const _ = At(c.getAttribute(l));
        _ !== i._state && i._apply(_);
      } else a === m ? (i.hashEnabled && i._onHashChange && window.removeEventListener("hashchange", i._onHashChange), i.nsKey = vt(c, "sort"), i.hashEnabled = !!i.nsKey, i.hashEnabled && window.addEventListener("hashchange", i._onHashChange)) : a === u && (i.queryEnabled && i._onPopState && window.removeEventListener("popstate", i._onPopState), i.queryParam = kt(c, "sort"), i.queryEnabled = !!i.queryParam, i.queryEnabled && window.addEventListener("popstate", i._onPopState));
  }
  B(t, e, g, "ln-sort", {
    attributes: h,
    persist: {
      attr: l,
      hashActive: function(c) {
        return !!vt(c, "sort") || !!kt(c, "sort");
      }
    }
  });
})();
function An(t, e, n, l, p = 15) {
  if (l <= 0 || n <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const m = Math.max(0, t || 0), u = Math.max(0, e || 0), d = Math.floor(m / n), h = Math.ceil(u / n), s = Math.max(0, d - p), b = Math.min(l, d + h + p), v = s * n, g = Math.max(0, (l - b) * n);
  return { start: s, end: b, topPadding: v, bottomPadding: g };
}
function Kr(t, e) {
  const n = Array.isArray(t) ? t.length : 0, l = e instanceof Set ? e : new Set(e || []);
  let p = 0;
  if (Array.isArray(t))
    for (let d = 0; d < t.length; d++)
      l.has(t[d]) && p++;
  else
    p = l.size;
  const m = n > 0 && p === n, u = p > 0 && p < n;
  return { totalCount: n, selectedCount: p, isAllSelected: m, isIndeterminate: u };
}
function En(t, e, n) {
  const l = new Set(t);
  return e == null || ((n !== void 0 ? n : !l.has(e)) ? l.add(e) : l.delete(e)), l;
}
function Sn(t, e, n) {
  const l = new Set(t);
  if (!Array.isArray(e)) return l;
  if (n)
    for (let p = 0; p < e.length; p++)
      e[p] != null && l.add(e[p]);
  else
    for (let p = 0; p < e.length; p++)
      l.delete(e[p]);
  return l;
}
(function() {
  const t = "data-ln-table", e = "lnTable";
  if (window[e] !== void 0) return;
  function h(r) {
    const y = r[e];
    if (!y || !y.isDataDriven) return;
    const o = r.hasAttribute("data-ln-table-window");
    o && !y._windowed ? (y._enterWindowedMode(), y._kickWindowInitial()) : !o && y._windowed ? y._exitWindowedMode() : o && y._cache.configure({ windowSize: y._windowSize });
  }
  function s(r) {
    const y = r[e];
    !y || !y._windowed || y._cache.configure({ pageSize: y._windowPage });
  }
  function b(r) {
    const y = r[e];
    !y || !y._windowed || y._cache.configure({ threshold: y._windowThreshold });
  }
  function v(r) {
    const y = r[e];
    !y || !y._windowed || !(y._declaredTotal >= 0) || y._cache.setGrandTotal(y._declaredTotal);
  }
  const g = {
    "data-ln-table": { prop: "name", type: "string", read: K, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: Et, description: "Enables row selection check controls" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" },
    "data-ln-table-window": { prop: "_windowSize", type: "integer", fallback: 1e3, min: 10, effect: h, description: "Opt-in server-side sliding window (data-driven mode); value is the resident-row cap" },
    "data-ln-table-window-page": { prop: "_windowPage", type: "integer", fallback: 200, min: 5, effect: s, description: "Rows requested per page in windowed mode" },
    "data-ln-table-window-threshold": { prop: "_windowThreshold", type: "integer", fallback: 25, min: 0, effect: b, description: "Prefetch margin in rows before an unloaded page boundary in windowed mode" },
    "data-ln-table-count": { prop: "_declaredTotal", type: "integer", min: 0, effect: v, description: "Declared unfiltered grand total for a windowed table" }
  }, f = Y(g), c = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function a(r, y) {
    if (!r) return;
    if (y == null || isNaN(y)) {
      r.removeAttribute("data-ln-value"), "value" in r && r.tagName === "DATA" && (r.value = ""), r.lnNumber ? r.lnNumber.value = NaN : r.textContent = "";
      return;
    }
    const o = String(y);
    r.setAttribute("data-ln-value", o), "value" in r && r.tagName === "DATA" && (r.value = o), r.lnNumber ? r.lnNumber.value = y : r.textContent = o;
  }
  function i(r, y) {
    let o = y ? y.parentElement : r;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const w = getComputedStyle(o).overflowY;
      if (w === "auto" || w === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function _(r) {
    this.dom = r, X(this, r, f), this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const y = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = y ? Array.from(y.querySelectorAll("th")) : [], this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._loadingIndicator = r.querySelector("[data-ln-table-loading]"), this._loadingIndicator && this._loadingIndicator.classList.add("hidden"), this.isDataDriven = r.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._vResized = !1, this._vTop = 0, this._scrollContainer = null, this._colgroup = null, this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const o = this;
    return this._onSetSearch = function(A) {
      const w = (A.detail && A.detail.query != null ? A.detail.query : A.detail && A.detail.term != null ? A.detail.term : "").trim();
      o.isDataDriven ? (o.currentSearch = w, L(r, "ln-table:search", {
        table: o.name,
        query: o.currentSearch
      }), o._requestData()) : (o._searchTerm = w.toLowerCase(), o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), L(r, "ln-table:filter", {
        term: o._searchTerm,
        matched: o._filteredData.length,
        total: o._data.length
      }));
    }, r.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(A) {
      A.preventDefault(), o._onSetSearch(A);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      o.isDataDriven ? (o.currentFilters = {}, o.currentSearch = "", L(r, "ln-table:clear-filters", { table: o.name }), o._requestData()) : (o._searchTerm = "", o._columnFilters = {}, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), L(r, "ln-table:filter", {
        term: "",
        matched: o._filteredData.length,
        total: o._data.length
      }));
    }, r.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this._initialLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(A) {
      const w = A.detail || {}, S = w.data || [], E = w.total != null ? w.total : S.length;
      if (!(o._hasInitialSeed && !o.isLoaded && S.length === 0 && E === 0)) {
        if (o._windowed) {
          o._cache.ingest(w) && (r.classList.remove("ln-table--loading"), r.setAttribute("aria-busy", "false"), o._loadingIndicator && o._loadingIndicator.classList.add("hidden"));
          return;
        }
        o._data = S, o._lastTotal = E, o._lastFiltered = w.filtered != null ? w.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, o._initialLoaded = !0, o._hasInitialSeed = !1, r.classList.remove("ln-table--loading"), r.setAttribute("aria-busy", "false"), o._loadingIndicator && o._loadingIndicator.classList.add("hidden"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), L(r, "ln-table:rendered", {
          table: o.name,
          total: o.totalCount,
          visible: o.visibleCount
        });
      }
    }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(A) {
      const w = !!(A.detail && A.detail.loading);
      w && o._windowed && o._initialLoaded || (r.classList.toggle("ln-table--loading", w), r.setAttribute("aria-busy", w ? "true" : "false"), w && !o._initialLoaded && (o.isLoaded = !1, o._showLoadingState()), o._loadingIndicator && o._loadingIndicator.classList.toggle("hidden", !(w && o._initialLoaded)));
    }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onRequestRevalidate = function() {
      o._windowed && o._cache.revalidate();
    }, r.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onPageFailed = function(A) {
      o._windowed && o._cache.release(A.detail && A.detail.offset);
    }, r.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestInvalidate = function() {
      o._windowed && o._requestData();
    }, r.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(A) {
      !A.detail || A.detail.field == null || (A.preventDefault(), o.currentSort = A.detail.direction === "none" ? null : { field: A.detail.field, direction: A.detail.direction }, o._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onRowClick = function(A) {
      if (A.target.closest("[data-ln-table-row-select]") || A.target.closest("[data-ln-table-row-action]") || A.target.closest("a") || A.target.closest("button") || A.ctrlKey || A.metaKey || A.button === 1) return;
      const w = A.target.closest("[data-ln-table-row]");
      if (!w) return;
      const S = w.getAttribute("data-ln-table-row-id"), E = w._lnRecord || {};
      L(r, "ln-table:row-click", {
        table: o.name,
        id: S,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(A) {
      const w = A.target.closest("[data-ln-table-row-action]");
      if (!w) return;
      const S = w.closest("[data-ln-table-row]");
      if (!S) return;
      const E = w.getAttribute("data-ln-table-row-action"), C = S.getAttribute("data-ln-table-row-id"), T = S._lnRecord || {};
      L(r, "ln-table:row-action", {
        table: o.name,
        id: C,
        action: E,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : (this._showLoadingState(), r.setAttribute("aria-busy", "true")), setTimeout(function() {
      if (!(!o.dom || !document.contains(o.dom))) {
        if (o._windowed) {
          o._kickWindowInitial();
          return;
        }
        L(r, "ln-table:request-data", {
          table: o.name,
          sort: o.currentSort,
          filters: o.currentFilters,
          search: o.currentSearch
        });
      }
    }, 0)) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      o.tbody.rows.length > 0 && (o._emptyTbodyObserver.disconnect(), o._emptyTbodyObserver = null, o._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(A) {
      if (!A.detail || A.detail.column == null && A.detail.field == null) return;
      A.preventDefault();
      const w = A.detail.direction === "none" ? null : A.detail.direction;
      let S = A.detail.column;
      if (S == null && A.detail.field != null) {
        for (let E = 0; E < o.ths.length; E++)
          if (o.ths[E].getAttribute("data-ln-table-col") === A.detail.field) {
            S = E;
            break;
          }
      }
      o._sortCol = w === null || S == null ? -1 : S, o._sortDir = w, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), L(r, "ln-table:sorted", {
        column: S,
        direction: A.detail.direction,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(A) {
      if (A.preventDefault(), !A.detail) return;
      const w = A.detail.key, S = A.detail.values || [];
      if (w) {
        if (S.length === 0)
          delete o._columnFilters[w];
        else {
          const E = [];
          for (let C = 0; C < S.length; C++)
            E.push(S[C].toLowerCase());
          o._columnFilters[w] = E;
        }
        o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), L(r, "ln-table:filter", {
          term: o._searchTerm,
          matched: o._filteredData.length,
          total: o._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  _.prototype._parseRows = function() {
    const r = this.tbody.rows, y = this.ths;
    this._data = [], r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let o = 0; o < r.length; o++) {
      const A = r[o], w = [], S = [], E = [];
      for (let x = 0; x < A.cells.length; x++) {
        const I = A.cells[x], q = I.textContent.trim();
        w[x] = yt(I), S[x] = q.toLowerCase(), I.querySelector("[data-ln-table-row-action]") || E.push(q.toLowerCase());
      }
      let C = null;
      if (this.isDataDriven) {
        C = {};
        const x = A.getAttribute("data-ln-table-row-id");
        x != null && (C.id = x);
        for (let I = 0; I < y.length; I++) {
          const q = y[I].getAttribute("data-ln-table-col");
          if (q) {
            const D = I;
            if (D < A.cells.length) {
              const N = A.cells[D];
              C[q] = yt(N);
            }
          }
        }
      }
      const T = {};
      for (let x = 0; x < A.attributes.length; x++) {
        const I = A.attributes[x];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const q = I.name.slice(5);
          q && (T[q] = I.value.toLowerCase());
        }
      }
      this._data.push({
        values: w,
        rawTexts: S,
        attrs: T,
        html: A.outerHTML,
        searchText: E.join(" "),
        id: this.isDataDriven && C ? C.id : void 0,
        ...C
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
      return;
    }
    const r = this._data || [], y = this._searchTerm, o = y ? y.split(/\s+/).filter(Boolean) : [], A = this._columnFilters || {}, w = Object.keys(A), S = w.length > 0, E = {};
    if (S)
      for (let C = 0; C < w.length; C++) {
        const T = w[C];
        let x = -1;
        for (let I = 0; I < this.ths.length; I++) {
          const q = this.ths[I];
          if ((q.getAttribute("data-ln-table-filter-col") || q.getAttribute("data-ln-filter-col") || q.getAttribute("data-ln-filter-key") || q.getAttribute("data-ln-table-col")) === T) {
            x = I;
            break;
          }
        }
        E[T] = x;
      }
    if (o.length === 0 && !S ? this._filteredData = r.slice() : this._filteredData = r.filter(function(C) {
      if (o.length > 0) {
        for (let T = 0; T < o.length; T++)
          if (!C.searchText || C.searchText.indexOf(o[T]) === -1) return !1;
      }
      if (S)
        for (let T = 0; T < w.length; T++) {
          const x = w[T], I = A[x];
          if (!I || I.length === 0) continue;
          const q = E[x];
          let D = !1;
          if (q !== -1) {
            const N = C.rawTexts && C.rawTexts[q] != null ? C.rawTexts[q] : "", F = C.values && C.values[q] != null ? String(C.values[q]).toLowerCase() : "";
            (I.indexOf(N) !== -1 || I.indexOf(F) !== -1) && (D = !0);
          }
          if (!D && C.attrs && C.attrs[x] !== void 0 && I.indexOf(C.attrs[x]) !== -1 && (D = !0), !D) return !1;
        }
      return !0;
    }), this._sortCol >= 0 && this._sortDir) {
      const C = this._sortCol, T = this._sortDir === "desc" ? -1 : 1, x = this._filteredData.map(function(q) {
        return q.values ? q.values[C] : void 0;
      }), I = ge(x);
      this._filteredData.sort(function(q, D) {
        const N = q.values ? q.values[C] : void 0, F = D.values ? D.values[C] : void 0;
        return _e(N, F, I, c) * T;
      });
    }
    this.visibleCount = this._filteredData.length;
  }, _.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup || this.ths.length && !this.ths[0].offsetWidth) return;
    const r = document.createElement("colgroup");
    this.ths.forEach(function(y) {
      const o = document.createElement("col");
      o.style.width = y.offsetWidth + "px", r.appendChild(o);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, _.prototype._render = function() {
    if (this.tbody) {
      if (this._windowed) {
        this._renderWindowed();
        return;
      }
      if (this.isDataDriven) {
        const r = this._lastTotal, y = this.visibleCount;
        if (r === 0) {
          if (this._disableVirtualScroll(), !this.isLoaded) {
            this._showLoadingState();
            return;
          }
          this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || y === 0) {
          if (this._disableVirtualScroll(), !this.isLoaded) {
            this._showLoadingState();
            return;
          }
          this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
    }
  }, _.prototype._renderAll = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const r = this._filteredData;
    if (this.isDataDriven || r.length > 0 && !r[0].html) {
      const y = document.createDocumentFragment();
      for (let o = 0; o < r.length; o++) {
        const A = this._buildRow(r[o]);
        if (!A) break;
        y.appendChild(A);
      }
      this.tbody.replaceChildren(y), this._selectable && this._updateSelectAll();
    } else {
      const y = [];
      for (let o = 0; o < r.length; o++) y.push(r[o].html);
      this.tbody.innerHTML = y.join(""), this._selectable && this._restoreSelection();
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    if (!this._rowHeight)
      if (this._windowed)
        this._rowHeight = this._measureWindowedRow();
      else if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let o = null;
        this.isDataDriven && this._data.length > 0 && (o = this._buildRow(this._data[0])), o && this.tbody && (this.tbody.appendChild(o), this._rowHeight = o.offsetHeight || 40, o.remove());
      }
    this._scrollContainer = i(this.dom, this.table);
    const y = this._scrollContainer || window;
    this.dom && (this.dom.style.overflowAnchor = "none"), this.table && (this.table.style.overflowAnchor = "none"), this.tbody && (this.tbody.style.overflowAnchor = "none"), this._scrollContainer && (this._scrollContainer.style.overflowAnchor = "none"), this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._lockColumnWidths(), r._vResized = !0, r._scrollHandler();
    }, y.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._resizeHandler), this._scrollHandler = null, this._resizeHandler = null), this.dom && (this.dom.style.overflowAnchor = ""), this.table && (this.table.style.overflowAnchor = ""), this.tbody && (this.tbody.style.overflowAnchor = ""), this._scrollContainer && (this._scrollContainer.style.overflowAnchor = ""), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1, this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null);
  }, _.prototype._compileRowBindings = function(r) {
    const y = {
      textNodes: [],
      attrs: [],
      cellAttrs: []
    }, o = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
    for (; o.nextNode(); ) {
      const w = o.currentNode;
      if (w.textContent.indexOf("{{") !== -1) {
        const S = w.parentElement;
        y.textNodes.push({
          node: w,
          raw: w.textContent,
          el: S,
          isLeaf: !!(S && S.children.length === 0)
        });
      }
    }
    const A = Array.from(r.querySelectorAll("*"));
    r.nodeType === 1 && A.push(r);
    for (let w = 0; w < A.length; w++) {
      const S = A[w];
      if (S.hasAttribute("data-ln-table-cell-attr")) {
        const C = S.getAttribute("data-ln-table-cell-attr").split(",");
        for (let T = 0; T < C.length; T++) {
          const x = C[T].trim().split(":");
          x.length === 2 && y.cellAttrs.push({
            el: S,
            field: x[0].trim(),
            attr: x[1].trim()
          });
        }
      }
      const E = S.attributes;
      for (let C = 0; C < E.length; C++) {
        const T = E[C];
        T.value.indexOf("{{") !== -1 && y.attrs.push({
          el: S,
          name: T.name,
          raw: T.value
        });
      }
    }
    return r._lnBindings = y, y;
  }, _.prototype._createTemplateRow = function() {
    let r = et(this.dom, this.name + "-row", "ln-table");
    if (!r) {
      const o = this.dom.querySelector("template[data-ln-table-row]");
      o && (r = document.importNode(o.content, !0));
    }
    let y = r ? r.querySelector("[data-ln-table-row]") || r.firstElementChild : null;
    return y ? (this._compileRowBindings(y), y) : ((window.lnDebug || typeof document < "u" && document.body && document.body.hasAttribute("data-ln-debug")) && console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`), null);
  }, _.prototype._updateRow = function(r, y) {
    if (!y) return;
    r._lnRecord = y, y.id != null && r.setAttribute("data-ln-table-row-id", y.id);
    const o = r._lnBindings || this._compileRowBindings(r), A = o.textNodes;
    for (let E = 0; E < A.length; E++) {
      const C = A[E], T = C.raw.replace(
        /\{\{\s*(\w+)\s*\}\}/g,
        function(x, I) {
          return y[I] !== void 0 && y[I] !== null ? y[I] : "";
        }
      );
      C.isLeaf && C.el ? C.el.textContent = T : C.node && C.node.parentNode ? C.node.textContent = T : C.el && (C.el.textContent = T);
    }
    const w = o.attrs;
    for (let E = 0; E < w.length; E++) {
      const C = w[E];
      C.el.setAttribute(
        C.name,
        C.raw.replace(
          /\{\{\s*(\w+)\s*\}\}/g,
          function(T, x) {
            return y[x] !== void 0 && y[x] !== null ? y[x] : "";
          }
        )
      );
    }
    const S = o.cellAttrs;
    for (let E = 0; E < S.length; E++) {
      const C = S[E], T = y[C.field];
      T != null && C.el.setAttribute(C.attr, T);
    }
    if (o.textNodes.length === 0 && o.attrs.length === 0 && this.ths.length > 0)
      for (let E = 0; E < this.ths.length; E++) {
        const C = this.ths[E].getAttribute("data-ln-table-col");
        C && E < r.cells.length && y[C] != null && (r.cells[E].textContent = String(y[C]));
      }
    if (this._selectable) {
      const E = y.id != null ? String(y.id) : null, C = E != null && this.selectedIds.has(E);
      r.classList.toggle("ln-row-selected", C);
      const T = r.querySelector("[data-ln-table-row-select]");
      T && (T.checked = C);
    }
  }, _.prototype._ensureRowPool = function(r, y) {
    for (this._rowPool ? this._topTd && this._topTd.getAttribute("colspan") !== String(y) && (this._topTd.setAttribute("colspan", y), this._bottomTd.setAttribute("colspan", y)) : (this._rowPool = [], this._topSpacer = document.createElement("tr"), this._topSpacer.className = "ln-table__spacer", this._topSpacer.setAttribute("aria-hidden", "true"), this._topSpacer.style.overflowAnchor = "none", this._topTd = document.createElement("td"), this._topTd.setAttribute("colspan", y), this._topTd.style.padding = "0", this._topTd.style.border = "none", this._topTd.style.overflowAnchor = "none", this._topSpacer.appendChild(this._topTd), this._bottomSpacer = document.createElement("tr"), this._bottomSpacer.className = "ln-table__spacer", this._bottomSpacer.setAttribute("aria-hidden", "true"), this._bottomSpacer.style.overflowAnchor = "none", this._bottomTd = document.createElement("td"), this._bottomTd.setAttribute("colspan", y), this._bottomTd.style.padding = "0", this._bottomTd.style.border = "none", this._bottomTd.style.overflowAnchor = "none", this._bottomSpacer.appendChild(this._bottomTd), this.tbody.replaceChildren(this._topSpacer, this._bottomSpacer)); this._rowPool.length < r; ) {
      const o = this._createTemplateRow();
      if (!o) break;
      this._rowPool.push(o), this.tbody.insertBefore(o, this._bottomSpacer);
    }
  }, _.prototype._scrollMetrics = function() {
    const r = this.thead ? this.thead.offsetHeight : 0, y = this._scrollContainer, o = this.table.getBoundingClientRect();
    if (y) {
      const S = y.getBoundingClientRect(), E = o.top - S.top + y.scrollTop + r;
      return { scrollIntoData: y.scrollTop - E, viewportH: y.clientHeight };
    }
    const w = o.top + window.scrollY + r;
    return { scrollIntoData: window.scrollY - w, viewportH: window.innerHeight };
  }, _.prototype._renderVirtual = function() {
    const r = this._filteredData, y = r.length;
    if (!this._rowHeight || !y) return;
    const o = this._scrollContainer, A = this._scrollMetrics(), w = A.scrollIntoData, S = A.viewportH;
    let E = w;
    if (this._vResized) {
      this._vResized = !1;
      const N = this._vEnd - this._vStart, F = this._rowPool && this._rowPool[N - 1], H = F ? (F.getBoundingClientRect().bottom - this._rowPool[0].getBoundingClientRect().top) / N : 0;
      H && H !== this._rowHeight && (this._rowHeight = H, this._vStart = -1, this._vTop > 0 && (E = this._vTop * H));
    }
    const C = this._rowHeight;
    this._vTop = E / C;
    const T = An(E, S, C, y, 15), x = T.start, I = T.end;
    if (x === this._vStart && I === this._vEnd) return;
    this._vStart = x, this._vEnd = I;
    const q = this.ths.length || 1, D = I - x;
    this._ensureRowPool(D, q), T.topPadding > 0 ? (this._topTd.style.height = T.topPadding + "px", this._topSpacer.style.display = "") : (this._topTd.style.height = "0px", this._topSpacer.style.display = "none"), T.bottomPadding > 0 ? (this._bottomTd.style.height = T.bottomPadding + "px", this._bottomSpacer.style.display = "") : (this._bottomTd.style.height = "0px", this._bottomSpacer.style.display = "none");
    for (let N = 0; N < this._rowPool.length; N++) {
      const F = this._rowPool[N], H = x + N;
      if (N < D && H < y) {
        F.style.display = "";
        const U = r[H];
        if (U && U.html) {
          const G = document.createElement("tbody");
          G.innerHTML = U.html;
          const Z = G.firstElementChild;
          Z && (F.innerHTML = Z.innerHTML, F.className = Z.className, F._lnRecord = U, U.id != null && F.setAttribute("data-ln-table-row-id", U.id));
        } else
          this._updateRow(F, U);
      } else
        F.style.display = "none";
    }
    this._selectable && this._updateSelectAll(), E !== w && (o ? o.scrollTop += E - w : window.scrollTo(window.scrollX, window.scrollY + E - w));
  }, _.prototype._showLoadingState = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const r = this.ths.length || 1;
    let y = null, o = et(this.dom, this.name + "-loading", "ln-table") || et(this.dom, "table-loading", "ln-table");
    if (!o) {
      const A = this.dom.querySelector("template[data-ln-table-loading]");
      A && (o = document.importNode(A.content, !0));
    }
    if (o)
      if (o.tagName === "TR")
        y = o;
      else {
        const A = document.createElement("td");
        A.setAttribute("colspan", String(r)), A.appendChild(o);
        const w = document.createElement("tr");
        w.appendChild(A), y = w;
      }
    y ? (y.setAttribute("data-ln-table-empty", ""), this.tbody.replaceChildren(y)) : this.tbody.replaceChildren();
  }, _.prototype._showEmptyState = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const r = this.ths.length || 1;
    let y = null, o = null;
    if (this.isDataDriven) {
      const A = this._lastTotal != null ? this._lastTotal : this._data.length, S = this.visibleCount === 0 && A > 0, E = S ? this.name + "-empty-filtered" : this.name + "-empty";
      if (o = et(this.dom, E, "ln-table") || et(this.dom, S ? "table-empty-filtered" : "table-empty", "ln-table"), !o) {
        const C = this.dom.querySelector("template[data-ln-table-empty]");
        if (C) {
          const T = S ? "search" : "initial", x = C.content.querySelector('[data-ln-table-empty-when="' + T + '"]') || C.content.firstElementChild;
          x && (o = document.importNode(x, !0));
        }
      }
    } else if (o = et(this.dom, this.name + "-empty", "ln-table") || et(this.dom, "table-empty", "ln-table"), !o) {
      const A = this.dom.querySelector("template[data-ln-table-empty]");
      A && (o = document.importNode(A.content, !0));
    }
    if (o)
      if (o.tagName === "TR")
        y = o;
      else {
        const A = document.createElement("td");
        A.setAttribute("colspan", String(r)), A.appendChild(o);
        const w = document.createElement("tr");
        w.appendChild(A), y = w;
      }
    y ? (y.setAttribute("data-ln-table-empty", ""), this.tbody.replaceChildren(y)) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._fillRow = function(r, y) {
    Yt(r, y);
    const o = r.querySelectorAll("[data-ln-table-cell-attr]");
    for (let A = 0; A < o.length; A++) {
      const w = o[A], S = w.getAttribute("data-ln-table-cell-attr").split(",");
      for (let E = 0; E < S.length; E++) {
        const C = S[E].trim().split(":");
        if (C.length !== 2) continue;
        const T = C[0].trim(), x = C[1].trim();
        y[T] != null && w.setAttribute(x, y[T]);
      }
    }
  }, _.prototype._buildRow = function(r) {
    let y = et(this.dom, this.name + "-row", "ln-table");
    if (!y) {
      const A = this.dom.querySelector("template[data-ln-table-row]");
      A && (y = document.importNode(A.content, !0));
    }
    let o = y ? y.querySelector("[data-ln-table-row]") || y.firstElementChild : null;
    if (o)
      this._fillRow(o, r);
    else if (r && r.html) {
      const A = document.createElement("tbody");
      A.innerHTML = r.html, o = A.firstElementChild;
    } else
      return (window.lnDebug || typeof document < "u" && document.body && document.body.hasAttribute("data-ln-debug")) && console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`), null;
    if (o._lnRecord = r, r.id != null && o.setAttribute("data-ln-table-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
      o.classList.add("ln-row-selected");
      const A = o.querySelector("[data-ln-table-row-select]");
      A && (A.checked = !0);
    }
    return o;
  }, _.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this.dom.setAttribute("aria-busy", "true"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Dn(this, "ln-table:request-data", "table");
  }, _.prototype._enterWindowedMode = function() {
    const r = this, y = this.dom;
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._initialLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(y, "ln-table:rendered", {
        table: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = Ut(this._onCacheChange), this._cache = Yn({
      windowSize: this._windowSize,
      pageSize: this._windowPage,
      threshold: this._windowThreshold,
      fetchDebounce: 120,
      requestPage: function(o, A, w) {
        L(y, "ln-table:request-data", {
          table: r.name,
          sort: o.sort,
          filters: o.filters,
          search: o.search,
          offset: A,
          limit: w,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectAllCheckbox && (this._selectAllCheckbox.hidden = !0);
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = this._declaredTotal > 0 ? this._declaredTotal : this._data.length;
      this._cache.ingest({ data: this._data, offset: 0, total: r, filtered: r });
    } else
      this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, _.prototype._teardownWindow = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && (this._selectAllCheckbox.hidden = !1);
  }, _.prototype._exitWindowedMode = function() {
    this._teardownWindow(), this._data = [], this._filteredData = [], this._lastTotal = 0, this._lastFiltered = 0, this.isLoaded = !1, this._vStart = -1, this._vEnd = -1, this._requestData();
  }, _.prototype._measureWindowedRow = function() {
    const r = this._cache.peek(), y = r ? this._buildRow(r) : null;
    if (!y || !this.tbody) return 0;
    this.tbody.appendChild(y);
    const o = y.offsetHeight || 40;
    return y.remove(), o;
  }, _.prototype._buildPlaceholderRow = function(r) {
    const y = document.createElement("tr");
    y.className = "ln-table__placeholder", y.setAttribute("aria-hidden", "true"), y.style.height = this._rowHeight + "px";
    const o = document.createElement("td");
    return o.setAttribute("colspan", r), y.appendChild(o), y;
  }, _.prototype._buildSpacerRow = function(r, y) {
    const o = document.createElement("tr");
    o.className = "ln-table__spacer", o.setAttribute("aria-hidden", "true");
    const A = document.createElement("td");
    return A.setAttribute("colspan", r), A.style.height = y + "px", o.appendChild(A), o;
  }, _.prototype._renderWindowed = function() {
    const r = this._cache;
    if (this.isLoaded && r.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    if (this._virtual || this._enableVirtualScroll(), this._vResized) {
      this._vResized = !1;
      const E = this._measureWindowedRow();
      E && E !== this._rowHeight && (this._rowHeight = E, this._vStart = -1);
    }
    const y = r.logicalTotal;
    if (!this._rowHeight || !y) return;
    const o = this._scrollMetrics(), A = An(o.scrollIntoData, o.viewportH, this._rowHeight, y, 15);
    if (A.start === this._vStart && A.end === this._vEnd) return;
    this._vStart = A.start, this._vEnd = A.end;
    const w = this.ths.length || 1, S = document.createDocumentFragment();
    A.topPadding > 0 && S.appendChild(this._buildSpacerRow(w, A.topPadding));
    for (let E = A.start; E < A.end; E++) {
      const C = r.has(E) ? this._buildRow(r.get(E)) : this._buildPlaceholderRow(w);
      C && S.appendChild(C);
    }
    A.bottomPadding > 0 && S.appendChild(this._buildSpacerRow(w, A.bottomPadding)), this.tbody.replaceChildren(S), this._lockColumnWidths(), r.ensure(A.start, A.end);
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]"), y = [];
    for (let A = 0; A < r.length; A++) {
      const w = r[A].getAttribute("data-ln-table-row-id");
      w != null && y.push(w);
    }
    const o = Kr(y, this.selectedIds);
    this._selectAllCheckbox.checked = o.isAllSelected, this._selectAllCheckbox.indeterminate = o.isIndeterminate;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let y = 0; y < r.length; y++) {
      const o = r[y].getAttribute("data-ln-table-row-id"), A = o != null && this.selectedIds.has(o);
      r[y].classList.toggle("ln-row-selected", A);
      const w = r[y].querySelector("[data-ln-table-row-select]");
      w && (w.checked = A);
    }
    this._updateSelectAll();
  }, Object.defineProperty(_.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    if (this._onSelectionChange = function(y) {
      const o = y.target.closest("[data-ln-table-row-select]");
      if (!o) return;
      const A = o.closest("[data-ln-table-row]");
      if (!A) return;
      const w = A.getAttribute("data-ln-table-row-id");
      w != null && (r.selectedIds = En(r.selectedIds, w, o.checked), A.classList.toggle("ln-row-selected", o.checked), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), L(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const y = document.createElement("input");
      y.type = "checkbox";
      const o = r.dom.querySelector('[data-ln-table-dict="select-all"]'), A = r.dom.getAttribute("data-ln-table-select-all-label") || (o ? o.textContent.trim() : null) || "Select all";
      y.setAttribute("aria-label", A), this._selectAllCheckbox.appendChild(y), this._selectAllCheckbox = y;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const y = r._selectAllCheckbox.checked, o = r.tbody ? r.tbody.querySelectorAll("[data-ln-table-row]") : [], A = [];
      for (let w = 0; w < o.length; w++) {
        const S = o[w].getAttribute("data-ln-table-row-id"), E = o[w].querySelector("[data-ln-table-row-select]");
        S != null && (A.push(S), o[w].classList.toggle("ln-row-selected", y), E && (E.checked = y));
      }
      r.selectedIds = Sn(r.selectedIds, A, y), r.selectedCount = r.selectedIds.size, L(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: y
      }), L(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let o = 0; o < y.length; o++) {
        const A = y[o].querySelector("[data-ln-table-row-select]"), w = y[o].getAttribute("data-ln-table-row-id");
        A && A.checked && w != null && (r.selectedIds = En(r.selectedIds, w, !0), y[o].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, _.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-table-col-select]");
    if (r) {
      const y = r.querySelector('input[type="checkbox"]');
      y && y.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Sn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let o = 0; o < y.length; o++) {
        y[o].classList.remove("ln-row-selected");
        const A = y[o].querySelector("[data-ln-table-row-select]");
        A && (A.checked = !1);
      }
    }
    this._updateFooter();
  }, _.prototype._updateFooter = function() {
    let r = 0, y = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount) : (r = this._data.length, y = this._filteredData.length);
    const o = y < r;
    if (this._totalSpan && a(this._totalSpan, r), this._filteredSpan && a(this._filteredSpan, o ? y : null), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !o), this._selectedSpan) {
      const A = this.selectedIds ? this.selectedIds.size : 0;
      a(this._selectedSpan, A > 0 ? A : null), this._selectedWrap && this._selectedWrap.classList.toggle("hidden", A === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction))) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._windowed && this._teardownWindow(), this.dom.classList.remove("ln-table--loading"), this.dom.removeAttribute("aria-busy"), this._loadingIndicator = null, this._data = [], this._filteredData = [], delete this.dom[e]);
  }, B(t, e, _, "ln-table", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(v) {
    if (v.key !== "/" || v.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const g = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!g) return;
    const f = g.tagName === "INPUT" || g.tagName === "TEXTAREA" ? g : g.querySelector('input[type="search"], input[type="text"], input');
    f && (v.preventDefault(), f.focus());
  });
  function l(v) {
    return !(v.hasAttribute("data-ln-search-hide") || v.hasAttribute("data-ln-filter-hide") || v.hidden || v.classList && v.classList.contains("hidden") || v.style && v.style.display === "none");
  }
  function p(v) {
    if (v._emptyEl) return v._emptyEl;
    const g = v.dom.querySelector("template[data-ln-table-empty]");
    if (!g) return null;
    const f = g.content.firstElementChild;
    if (!f) return null;
    const c = document.importNode(f, !0);
    c.setAttribute("data-ln-table-empty", ""), c.classList.add("hidden"), c.hidden = !0;
    const a = v.dom.querySelector("table");
    return a ? ((a.closest(".table-container") || a).insertAdjacentElement("afterend", c), v._emptyEl = c, c) : null;
  }
  function m(v) {
    const g = v.dom.querySelector("table");
    if (!g || g.hasAttribute("data-ln-table") || g.parentElement && g.parentElement.hasAttribute("data-ln-table") || !v.dom.querySelector("template[data-ln-table-empty]")) return;
    const c = p(v);
    if (!c) return;
    const a = g.querySelectorAll("tbody tr");
    let i = !1;
    for (let r = 0; r < a.length; r++) {
      const y = a[r];
      if (!y.hasAttribute("data-ln-table-empty") && l(y)) {
        i = !0;
        break;
      }
    }
    a.length > 0 && !i ? (c.classList.remove("hidden"), c.hidden = !1) : (c.classList.add("hidden"), c.hidden = !0);
  }
  function u(v) {
    const g = v.dom.querySelector("table");
    if (!g || g.hasAttribute("data-ln-table") || g.parentElement && g.parentElement.hasAttribute("data-ln-table") || !v.dom.querySelector("template[data-ln-table-empty]")) return;
    const c = g.querySelector("tbody") || g, a = new MutationObserver(function() {
      m(v);
    });
    a.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-search-hide", "data-ln-filter-hide", "hidden", "class", "style"],
      subtree: !0,
      childList: !0
    }), v._emptyObserver = a, m(v);
  }
  function d(v) {
    return this.dom = v, this._emptyEl = null, this._emptyObserver = null, b(this), u(this), this;
  }
  function h(v, g) {
    const f = g ? '[data-ln-search-for="' + g + '"]' : "[data-ln-search-for]", c = v.querySelector(f) || document.querySelector(f);
    return c ? c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector("input, textarea") : null;
  }
  function s(v, g) {
    if (g) {
      const c = v.querySelectorAll('[data-ln-filter="' + g + '"]');
      if (c.length > 0) return c;
      const a = document.querySelectorAll('[data-ln-filter="' + g + '"]');
      if (a.length > 0) return a;
    }
    const f = v.querySelectorAll("[data-ln-filter]");
    return f.length > 0 ? f : document.querySelectorAll("[data-ln-filter]");
  }
  function b(v) {
    const g = v.dom;
    function f(c) {
      const a = c.target;
      if (a && a.hasAttribute && (a.hasAttribute("data-ln-table") || a.tagName === "TABLE")) return a;
      const i = c.detail && c.detail.targetId || a && a.id;
      if (!i) return null;
      const _ = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(i) : i.replace(/(["\\])/g, "\\$1");
      return g.querySelector('[data-ln-table-source="' + _ + '"]') || g.querySelector('[data-ln-table="' + _ + '"]') || (g.id === i ? g : null) || document.getElementById(i);
    }
    v._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(c) {
        if (!c.detail) return;
        const a = f(c);
        if (!a) return;
        const i = c.detail.key, _ = c.detail.values || [], r = a.querySelectorAll("th");
        for (let y = 0; y < r.length; y++)
          if ((r[y].getAttribute("data-ln-table-filter-col") || r[y].getAttribute("data-ln-filter-col") || r[y].getAttribute("data-ln-filter-key") || r[y].getAttribute("data-ln-field")) === i) {
            const A = r[y].querySelector("[data-ln-table-col-filter]");
            A && A.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
        m(v);
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(c) {
        const a = c.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!a) return;
        const i = a.closest("[data-ln-table], table") || g.querySelector("[data-ln-table], table");
        if (!i) return;
        const _ = i.lnTable && i.lnTable.name || i.id, r = i.querySelectorAll("th");
        for (let S = 0; S < r.length; S++) {
          const E = r[S].querySelector("[data-ln-table-col-filter]");
          E && E.classList.remove("ln-filter-active");
        }
        const y = i.getAttribute("data-ln-table-source") || i.id, o = y ? document.getElementById(y) || g.querySelector('[data-ln-data-coordinator="' + y + '"]') : null;
        if (o && o.hasAttribute("data-ln-search"))
          o.setAttribute("data-ln-search", "");
        else {
          const S = h(g, y);
          S && S.value !== "" && (S.value = "", S.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const A = o && o.hasAttribute("data-ln-data-coordinator") ? o : o && o.closest ? o.closest("[data-ln-data-coordinator]") : null;
        A && A.getAttribute("data-ln-data-coordinator-search") && A.setAttribute("data-ln-data-coordinator-search", "");
        const w = s(g, y);
        for (let S = 0; S < w.length; S++) {
          const E = w[S].querySelector("[data-ln-filter-reset]");
          if (!E) continue;
          const C = w[S].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!E.checked || C) && (E.checked = !0, E.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        i.lnTable && !i.hasAttribute("data-ln-table-source") && L(i, "ln-table:request-clear-filters", { table: _ }), m(v);
      }
    }, g.addEventListener("ln-filter:change", v._handlers.filter), g.addEventListener("click", v._handlers.clear);
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._emptyEl && (this._emptyEl.parentNode && this._emptyEl.remove(), this._emptyEl = null), this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, B(t, e, d, "ln-table-coordinator", {
    attributes: n
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", n = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function h(o) {
    const A = o[e];
    if (!A || !A.isDataDriven) return;
    const w = o.hasAttribute("data-ln-list-window");
    w && !A._windowed ? (A._enterWindowedMode(), A._kickWindowInitial()) : !w && A._windowed ? A._exitWindowedMode() : w && A._windowed && A._cache.configure({ windowSize: A._windowSize });
  }
  function s(o) {
    const A = o[e];
    !A || !A.isDataDriven || !A._windowed || !A._cache || A._cache.configure({ pageSize: A._windowPage });
  }
  function b(o) {
    const A = o[e];
    !A || !A.isDataDriven || !A._windowed || !A._cache || A._cache.configure({ threshold: A._windowThreshold });
  }
  function v(o) {
    const A = o[e];
    !A || !A.isDataDriven || !A._windowed || !A._cache || !(A._declaredTotal >= 0) || A._cache.setGrandTotal(A._declaredTotal);
  }
  const g = {
    "data-ln-list": { prop: "name", type: "string", read: K, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: Et, description: "Enables item selection controls" },
    "data-ln-list-window": { prop: "_windowSize", type: "integer", fallback: 1e3, min: 10, effect: h, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { prop: "_windowPage", type: "integer", fallback: 200, min: 5, effect: s, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { prop: "_windowThreshold", type: "integer", fallback: 25, min: 0, effect: b, description: "Scroll threshold margin in items to trigger page fetch" },
    "data-ln-list-count": { prop: "_declaredTotal", type: "integer", min: 0, effect: v, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, f = Y(g);
  function c(o, A) {
    if (o == null || isNaN(o)) return "";
    try {
      return new Intl.NumberFormat(J(A)).format(o);
    } catch {
      return String(o);
    }
  }
  function a(o) {
    let A = o;
    for (; A && A !== document.body && A !== document.documentElement; ) {
      const S = getComputedStyle(A).overflowY;
      if (S === "auto" || S === "scroll") return A;
      A = A.parentElement;
    }
    return null;
  }
  function i(o) {
    const A = o._scrollContainer || a(o.dom);
    return {
      container: A,
      top: A ? A.scrollTop : window.scrollY
    };
  }
  function _(o) {
    o.container ? o.container.scrollTop = o.top : window.scrollTo(window.scrollX, o.top);
  }
  function r(o) {
    if (!o) return 0;
    const A = getComputedStyle(o), w = parseFloat(A.marginTop) || 0, S = parseFloat(A.marginBottom) || 0;
    return o.offsetHeight + w + S;
  }
  function y(o) {
    this.dom = o, X(this, o, f), this.tbody = o.querySelector("[data-ln-list-body]") || o, this.isDataDriven = o.hasAttribute("data-ln-list-source"), this._totalSpan = o.querySelector("[data-ln-list-total]"), this._filteredSpan = o.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.parentElement : null), this._selectedSpan = o.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const A = this;
    return this._onSetSearch = function(w) {
      const S = (w.detail && w.detail.query != null ? w.detail.query : w.detail && w.detail.term != null ? w.detail.term : "").trim();
      A.isDataDriven ? (A.currentSearch = S, L(o, "ln-list:search", {
        list: A.name,
        query: A.currentSearch
      }), A._requestData()) : (A._searchTerm = S.toLowerCase(), A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(o, "ln-list:filter", {
        term: A._searchTerm,
        matched: A._filteredData.length,
        total: A._data.length
      }));
    }, o.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(w) {
      w.preventDefault(), A._onSetSearch(w);
    }, o.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      A.isDataDriven ? (A.currentFilters = {}, A.currentSearch = "", L(o, "ln-list:clear-filters", { list: A.name }), A._requestData()) : (A._searchTerm = "", A._filters = {}, A._sortField = null, A._sortDir = null, A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(o, "ln-list:filter", {
        term: "",
        matched: A._filteredData.length,
        total: A._data.length
      }));
    }, o.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, o.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(w) {
      const S = w.detail || {}, E = S.data || [], C = S.total != null ? S.total : E.length;
      if (!(A._hasInitialSeed && !A.isLoaded && E.length === 0 && C === 0)) {
        if (A._windowed) {
          A._cache.ingest(S) && o.classList.remove("ln-list--loading");
          return;
        }
        A._data = E, A._lastTotal = C, A._lastFiltered = S.filtered != null ? S.filtered : A._data.length, A.totalCount = A._lastTotal, A.visibleCount = A._lastFiltered, A.isLoaded = !0, A._hasInitialSeed = !1, o.classList.remove("ln-list--loading"), A._vStart = -1, A._vEnd = -1, A._applyFilterAndSort(), A._render(), A._updateFooter(), L(o, "ln-list:rendered", {
          list: A.name,
          total: A.totalCount,
          visible: A.visibleCount
        });
      }
    }, o.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(w) {
      const S = w.detail && w.detail.loading;
      o.classList.toggle("ln-list--loading", !!S), S && (A.isLoaded = !1);
    }, o.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(w) {
      !A._windowed || !A._cache || A._cache.release(w.detail && w.detail.offset);
    }, o.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !A._windowed || !A._cache || A._cache.revalidate();
    }, o.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !A._windowed || !A._cache || A._requestData();
    }, o.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(w) {
      !w.detail || w.detail.field == null || (w.preventDefault(), A.currentSort = w.detail.direction === "none" ? null : { field: w.detail.field, direction: w.detail.direction }, A._requestData());
    }, o.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(w) {
      if (w.target.closest("[data-ln-item-select]") || w.target.closest("[data-ln-item-action]") || w.target.closest("a") || w.target.closest("button") || w.ctrlKey || w.metaKey || w.button === 1) return;
      const S = w.target.closest("[data-ln-item]");
      if (!S) return;
      const E = S.getAttribute("data-ln-item-id"), C = S._lnRecord || {};
      L(o, "ln-list:item-click", {
        list: A.name,
        id: E,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(w) {
      const S = w.target.closest("[data-ln-item-action]");
      if (!S) return;
      const E = S.closest("[data-ln-item]");
      if (!E) return;
      const C = S.getAttribute("data-ln-item-action"), T = E.getAttribute("data-ln-item-id"), x = E._lnRecord || {};
      L(o, "ln-list:item-action", {
        list: A.name,
        id: T,
        action: C,
        record: x
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(o, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      A.tbody.children.length > 0 && (A._emptyObserver.disconnect(), A._emptyObserver = null, A._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(w) {
      if (w.preventDefault(), !w.detail) return;
      const S = w.detail.key, E = w.detail.values || [];
      if (S) {
        if (E.length === 0)
          delete A._filters[S];
        else {
          const C = [];
          for (let T = 0; T < E.length; T++)
            C.push(E[T].toLowerCase());
          A._filters[S] = C;
        }
        A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(o, "ln-list:filter", {
          term: A._searchTerm,
          matched: A._filteredData.length,
          total: A._data.length
        });
      }
    }, o.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(w) {
      if (!w.detail || w.detail.field == null) return;
      w.preventDefault();
      const S = w.detail.direction === "none" ? null : w.detail.direction;
      A._sortField = S === null ? null : w.detail.field, A._sortDir = S, A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(o, "ln-list:sorted", {
        field: A._sortField,
        direction: w.detail && w.detail.direction,
        matched: A._filteredData.length,
        total: A._data.length
      });
    }, o.addEventListener("ln-sort:change", this._onSort)), this;
  }
  y.prototype._parseChildren = function() {
    const o = Array.from(this.tbody.children).filter((A) => !A.classList.contains("ln-list__spacer"));
    this._data = [], o.length > 0 && (this._itemHeight = r(o[0]) || 50);
    for (let A = 0; A < o.length; A++) {
      const w = o[A], S = w.getAttribute("data-ln-item-id") || w.getAttribute("id"), E = w.textContent.trim().toLowerCase();
      let C = null;
      if (this.isDataDriven) {
        C = {}, S != null && (C.id = S);
        const I = w.querySelectorAll("[data-ln-list-field]");
        for (let q = 0; q < I.length; q++) {
          const D = I[q], N = D.getAttribute("data-ln-list-field");
          N && (C[N] = yt(D));
        }
      }
      const T = {}, x = w.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let I = 0; I < x.length; I++) {
        const q = x[I], D = q.getAttribute("data-ln-list-field") || q.getAttribute("data-ln-field");
        D && (T[D] = yt(q));
      }
      for (let I = 0; I < w.attributes.length; I++) {
        const q = w.attributes[I];
        if (q.name.startsWith("data-") && !q.name.startsWith("data-ln-")) {
          const D = q.name.slice(5);
          D && (T[D] = q.value);
        }
      }
      this._data.push({
        html: w.outerHTML,
        id: S,
        searchText: E,
        fields: T,
        ...C || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const o = this._searchTerm, A = o ? o.split(/\s+/).filter(Boolean) : [], w = this._filters || {}, S = Object.keys(w).length > 0;
      if (A.length === 0 && !S ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (A.length > 0 && !A.every(function(T) {
          return E.searchText && E.searchText.indexOf(T) !== -1;
        }))
          return !1;
        if (S)
          for (const C in w) {
            const T = w[C];
            if (T && T.length > 0) {
              const x = E.fields && E.fields[C] !== void 0 ? E.fields[C] : E[C] !== void 0 ? E[C] : null, I = x != null ? String(x).toLowerCase() : "";
              if (T.indexOf(I) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const E = this._sortField, C = this._sortDir === "desc" ? -1 : 1, T = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, x = this._filteredData.map(function(q) {
          return q.fields && q.fields[E] !== void 0 ? q.fields[E] : q[E];
        }), I = ge(x);
        this._filteredData.sort(function(q, D) {
          const N = q.fields && q.fields[E] !== void 0 ? q.fields[E] : q[E], F = D.fields && D.fields[E] !== void 0 ? D.fields[E] : D[E];
          return _e(N, F, I, T) * C;
        });
      }
    }
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const o = this._lastTotal, A = this.visibleCount;
        if (o === 0 || this._filteredData.length === 0 || A === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, A = document.createDocumentFragment();
      for (let S = 0; S < o.length; S++) {
        const E = this._buildItem(o[S]);
        E && A.appendChild(E);
      }
      const w = i(this);
      this.tbody.replaceChildren(A), _(w), this._selectable && this._updateSelectAll();
    } else {
      const o = [], A = this._filteredData;
      for (let S = 0; S < A.length; S++) o.push(A[S].html);
      const w = i(this);
      this.tbody.innerHTML = o.join(""), _(w), this._selectable && this._restoreSelection();
    }
  }, y.prototype._readGridLayout = function() {
    const o = getComputedStyle(this.tbody), A = o.gridTemplateColumns;
    let w = 1;
    if (A && A !== "none") {
      const E = A.trim().split(/\s+/).filter(Boolean);
      E.length > 0 && (w = E.length);
    }
    const S = parseFloat(o.rowGap);
    return { columns: w, rowGap: isNaN(S) ? 0 : S };
  }, y.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const o = this._cache.peek(), A = o ? this._buildItem(o) : this._buildPlaceholderItem();
      A && (this.tbody.textContent = "", this.tbody.appendChild(A), this._itemHeight = r(A) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const o = this._buildItem(this._data[0]);
        o && (this.tbody.textContent = "", this.tbody.appendChild(o), this._itemHeight = r(o) || 50, this.tbody.textContent = "");
      }
    } else {
      const o = this.tbody.children;
      o.length > 0 && (this._itemHeight = r(o[0]) || 50);
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = a(this.dom);
    const A = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      o._resizeRafId || (o._resizeRafId = requestAnimationFrame(function() {
        o._resizeRafId = null, o._itemHeight = 0, o._measureItemHeight(), o._vStart = -1, o._vEnd = -1, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, A.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const o = this._filteredData, A = o.length, w = this._itemHeight;
    if (!w || !A) return;
    const S = this._scrollContainer;
    let E, C;
    if (S) {
      const nt = this.tbody.getBoundingClientRect(), V = S.getBoundingClientRect(), j = S === this.tbody ? 0 : nt.top - V.top + S.scrollTop;
      E = S.scrollTop - j, C = S.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      E = window.scrollY - V, C = window.innerHeight;
    }
    const T = this._readGridLayout(), x = T.columns, I = T.rowGap, q = w + I, D = Math.ceil(A / x);
    let N = Math.max(0, Math.floor(E / q) - 15);
    N = Math.min(N, D);
    const F = Math.ceil(C / q) + 30, H = Math.min(N + F, D), U = Math.min(N * x, A), G = Math.min(H * x, A);
    if (U === this._vStart && G === this._vEnd) return;
    this._vStart = U, this._vEnd = G;
    const Z = N * q, lt = (D - H) * q;
    if (this.isDataDriven) {
      const nt = document.createDocumentFragment();
      if (Z > 0) {
        const j = document.createElement(this.isUl ? "li" : "div");
        j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = Z + "px", nt.appendChild(j);
      }
      for (let j = U; j < G; j++) {
        const St = this._buildItem(o[j]);
        St && nt.appendChild(St);
      }
      if (lt > 0) {
        const j = document.createElement(this.isUl ? "li" : "div");
        j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = lt + "px", nt.appendChild(j);
      }
      const V = i(this);
      this.tbody.replaceChildren(nt), _(V), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      Z > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Z}px"></${this.isUl ? "li" : "div"}>`);
      for (let j = U; j < G; j++)
        nt += o[j].html;
      lt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${lt}px"></${this.isUl ? "li" : "div"}>`);
      const V = i(this);
      this.tbody.innerHTML = nt, _(V), this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderItem = function() {
    const o = document.createElement(this.isUl ? "li" : "div");
    return o.className = "ln-list__placeholder", o.setAttribute("aria-hidden", "true"), o.style.height = this._itemHeight + "px", o;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const o = this._itemHeight;
    if (!o) return;
    const A = this._scrollContainer;
    let w, S;
    if (A) {
      const V = this.tbody.getBoundingClientRect(), j = A.getBoundingClientRect(), St = A === this.tbody ? 0 : V.top - j.top + A.scrollTop;
      w = A.scrollTop - St, S = A.clientHeight;
    } else {
      const j = this.tbody.getBoundingClientRect().top + window.scrollY;
      w = window.scrollY - j, S = window.innerHeight;
    }
    const E = this._readGridLayout(), C = E.columns, T = E.rowGap, x = o + T, I = this._cache.logicalTotal, q = Math.ceil(I / C);
    let D = Math.max(0, Math.floor(w / x) - 15);
    D = Math.min(D, q);
    const N = Math.ceil(S / x) + 30, F = Math.min(D + N, q), H = Math.min(D * C, I), U = Math.min(F * C, I), G = D * x, Z = (q - F) * x, lt = document.createDocumentFragment();
    if (G > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = G + "px", lt.appendChild(V);
    }
    for (let V = H; V < U; V++)
      if (this._cache.has(V)) {
        const j = this._buildItem(this._cache.get(V));
        j && lt.appendChild(j);
      } else
        lt.appendChild(this._buildPlaceholderItem());
    if (Z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = Z + "px", lt.appendChild(V);
    }
    const nt = i(this);
    this.tbody.replaceChildren(lt), _(nt), this._vStart = H, this._vEnd = U, this._cache.ensure(H, U);
  }, y.prototype._showEmptyState = function() {
    let o = null;
    if (this.isDataDriven) {
      const A = this._lastTotal != null ? this._lastTotal : this._data.length, S = this.visibleCount === 0 && A > 0, E = S ? this.name + "-empty-filtered" : this.name + "-empty";
      if (o = et(this.dom, E, "ln-list"), !o) {
        const C = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (C) {
          const T = S ? "search" : "initial", x = C.content.querySelector(`[data-ln-empty-when="${T}"]`) || C.content.firstElementChild;
          x && (o = document.importNode(x, !0));
        }
      }
    } else {
      const A = this.dom.querySelector(`template[${n}]`);
      if (A) {
        const w = A.content.firstElementChild;
        w && (o = document.importNode(w, !0));
      }
    }
    if (o)
      if (o.tagName === "LI" || o.tagName === "TR")
        this.tbody.replaceChildren(o);
      else {
        const A = document.createElement(this.isUl ? "li" : "div");
        A.appendChild(o), this.tbody.replaceChildren(A);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._buildItem = function(o) {
    let A = et(this.dom, this.name + "-row", "ln-list");
    if (!A) {
      const S = this.dom.querySelector("template[data-ln-item]");
      S && (A = document.importNode(S.content, !0));
    }
    let w = A ? A.querySelector("[data-ln-item]") || A.firstElementChild : null;
    if (w)
      Yt(w, o), dt(w, o);
    else if (o && o.html) {
      const S = document.createElement(this.isUl ? "ul" : "div");
      S.innerHTML = o.html, w = S.firstElementChild;
    } else if (w = document.createElement(this.isUl ? "li" : "div"), w.setAttribute("data-ln-item", ""), o && typeof o == "object") {
      for (const S in o)
        if (S !== "html" && o[S] != null) {
          const E = document.createElement("span");
          E.setAttribute("data-ln-field", S), E.textContent = String(o[S]), w.appendChild(E);
        }
    }
    if (w._lnRecord = o, o && o.id != null && (w.setAttribute("data-ln-item-id", o.id), this._selectable && this.selectedIds.has(String(o.id)))) {
      w.classList.add("ln-item-selected");
      const S = w.querySelector("[data-ln-item-select]");
      S && (S.checked = !0);
    }
    return w;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-item]");
    for (let A = 0; A < o.length; A++) {
      const w = o[A].getAttribute("data-ln-item-id"), S = w != null && this.selectedIds.has(String(w));
      o[A].classList.toggle("ln-item-selected", S);
      const E = o[A].querySelector("[data-ln-item-select]");
      E && (E.checked = S);
    }
    this._updateSelectAll();
  }, y.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const o = this;
    this._onSelectionChange = function(A) {
      const w = A.target.closest("[data-ln-item-select]");
      if (!w) return;
      const S = w.closest("[data-ln-item]");
      if (!S) return;
      const E = S.getAttribute("data-ln-item-id");
      E != null && (w.checked ? (o.selectedIds.add(String(E)), S.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(E)), S.classList.remove("ln-item-selected")), o._updateSelectAll(), o._updateFooter(), L(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const A = o._selectAllCheckbox.checked, w = o.tbody.querySelectorAll("[data-ln-item]");
      for (let S = 0; S < w.length; S++) {
        const E = w[S], C = E.getAttribute("data-ln-item-id"), T = E.querySelector("[data-ln-item-select]");
        C != null && (A ? (o.selectedIds.add(String(C)), E.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(C)), E.classList.remove("ln-item-selected")), T && (T.checked = A));
      }
      L(o.dom, "ln-list:select-all", { list: o.name, selected: A }), L(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const o = this.tbody.querySelectorAll("[data-ln-item]");
    let A = o.length > 0;
    for (let w = 0; w < o.length; w++) {
      const S = o[w].getAttribute("data-ln-item-id");
      if (S != null && !this.selectedIds.has(String(S))) {
        A = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = A;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Dn(this, "ln-list:request-data", "list");
  }, y.prototype._enterWindowedMode = function() {
    const o = this, A = this.dom, w = parseInt(A.getAttribute("data-ln-list-window"), 10), S = parseInt(A.getAttribute("data-ln-list-window-page"), 10), E = parseInt(A.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !o._windowed || !o._cache || (o.totalCount = o._cache.grandTotal, o.visibleCount = o._cache.logicalTotal, o._lastTotal = o._cache.grandTotal, o.isLoaded = !0, o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), L(A, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      }));
    }, this._renderBatch = Ut(this._onCacheChange), this._cache = Yn({
      windowSize: w > 0 ? w : 1e3,
      pageSize: S > 0 ? S : 200,
      threshold: E >= 0 ? E : 25,
      fetchDebounce: 120,
      requestPage: function(C, T, x) {
        L(A, "ln-list:request-data", {
          list: o.name,
          sort: C.sort,
          filters: C.filters,
          search: C.search,
          offset: T,
          limit: x,
          queryGen: o._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const o = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), A = o > 0 ? o : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: A,
        filtered: A
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, y.prototype._updateFooter = function() {
    let o = 0, A = 0;
    this.isDataDriven ? (o = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount) : (o = this._data.length, A = this._filteredData.length);
    const w = A < o;
    if (this._totalSpan && (this._totalSpan.textContent = c(o, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = w ? c(A, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !w), this._selectedSpan) {
      const S = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = S > 0 ? c(S, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", S === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, B(t, e, y, "ln-list", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function n(g) {
    const f = g[e];
    f && v.call(f);
  }
  const l = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: n, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: n, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: n, description: "Text label format or template inside circular progress" }
  }, p = "http://www.w3.org/2000/svg", m = 36, u = 16, d = 2 * Math.PI * u;
  function h(g) {
    return this.dom = g, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, b.call(this), v.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function s(g, f) {
    const c = document.createElementNS(p, g);
    for (const [a, i] of Object.entries(f))
      c.setAttribute(a, i);
    return c;
  }
  function b() {
    this.svg = s("svg", {
      viewBox: "0 0 " + m + " " + m,
      width: m,
      height: m
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = s("circle", {
      cx: m / 2,
      cy: m / 2,
      r: u,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: m / 2,
      cy: m / 2,
      r: u,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": d,
      "stroke-dashoffset": d,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function v() {
    const g = this.dom.getAttribute("data-ln-circular-progress"), f = this.dom.getAttribute("data-ln-circular-progress-max"), c = ri(g, f || 100), a = d - c.percentage / 100 * d;
    this.progressCircle.setAttribute("stroke-dashoffset", a);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), _ = i !== null ? i : Math.round(c.percentage) + "%";
    this.labelEl.textContent = _, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(c.min)), this.dom.setAttribute("aria-valuemax", String(c.max)), this.dom.setAttribute("aria-valuenow", String(c.clampedValue)), this.dom.setAttribute("aria-valuetext", _), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: c.value,
      max: c.max,
      percentage: c.percentage
    });
  }
  B(t, e, h, "ln-circular-progress", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", n = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-sortable": { effect: m, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function p(u) {
    this.dom = u, this.isEnabled = u.getAttribute(t) !== "disabled", this._dragging = null, u.setAttribute("aria-roledescription", "sortable list");
    const d = this;
    return this._onPointerDown = function(h) {
      d.isEnabled && d._handlePointerDown(h);
    }, u.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, p.prototype._handlePointerDown = function(u) {
    let d = u.target.closest("[" + n + "]"), h;
    if (d) {
      for (h = d; h && h.parentElement !== this.dom; )
        h = h.parentElement;
      if (!h || h.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + n + "]")) return;
      for (h = u.target; h && h.parentElement !== this.dom; )
        h = h.parentElement;
      if (!h || h.parentElement !== this.dom) return;
      d = h;
    }
    const b = Array.from(this.dom.children).indexOf(h);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: h,
      index: b
    }).defaultPrevented) return;
    u.preventDefault(), d.setPointerCapture(u.pointerId), this._dragging = h, h.classList.add("ln-sortable--dragging"), h.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: h,
      index: b
    });
    const g = this;
    let f = null, c = null;
    const a = function(_) {
      c = _, !f && (f = requestAnimationFrame(function() {
        f = null, c && g._handlePointerMove(c);
      }));
    }, i = function(_) {
      f && (cancelAnimationFrame(f), f = null), g._handlePointerEnd(_), d.removeEventListener("pointermove", a), d.removeEventListener("pointerup", i), d.removeEventListener("pointercancel", i);
    };
    d.addEventListener("pointermove", a), d.addEventListener("pointerup", i), d.addEventListener("pointercancel", i);
  }, p.prototype._handlePointerMove = function(u) {
    if (!this._dragging) return;
    const d = Array.from(this.dom.children), h = this._dragging;
    let s = null, b = null;
    for (let v = 0; v < d.length; v++) {
      const g = d[v];
      if (g === h) continue;
      const f = g.getBoundingClientRect(), c = f.top + f.height / 2;
      if (u.clientY >= f.top && u.clientY < c) {
        s = g, b = "before";
        break;
      } else if (u.clientY >= c && u.clientY <= f.bottom) {
        s = g, b = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === s && this._lastDropPos === b)) {
      this._lastDropTarget && this._lastDropTarget !== s && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = s, this._lastDropPos = b;
      for (let v = 0; v < d.length; v++) {
        const g = d[v];
        g !== s && (g.classList.contains("ln-sortable--drop-before") && g.classList.remove("ln-sortable--drop-before"), g.classList.contains("ln-sortable--drop-after") && g.classList.remove("ln-sortable--drop-after"));
      }
      if (s) {
        const v = b === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", g = b === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        s.classList.contains(g) && s.classList.remove(g), s.classList.contains(v) || s.classList.add(v);
      }
    }
  }, p.prototype._handlePointerEnd = function(u) {
    if (!this._dragging) return;
    const d = this._dragging, h = Array.from(this.dom.children), s = h.indexOf(d);
    let b = null, v = null;
    for (const g of h) {
      if (g.classList.contains("ln-sortable--drop-before")) {
        b = g, v = "before";
        break;
      }
      if (g.classList.contains("ln-sortable--drop-after")) {
        b = g, v = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const g of h)
      g.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (d.classList.remove("ln-sortable--dragging"), d.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), b && b !== d) {
      v === "before" ? this.dom.insertBefore(d, b) : this.dom.insertBefore(d, b.nextElementSibling);
      const f = Array.from(this.dom.children).indexOf(d);
      L(this.dom, "ln-sortable:reordered", {
        item: d,
        oldIndex: s,
        newIndex: f
      });
    }
    this._dragging = null;
  };
  function m(u) {
    const d = u[e];
    if (!d) return;
    const h = u.getAttribute(t) !== "disabled";
    h !== d.isEnabled && (d.isEnabled = h, L(u, h ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: u }));
  }
  B(t, e, p, "ln-sortable", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", n = "data-ln-picklist-list", l = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: d, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: h, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function m(s) {
    if (this.dom = s, this.isEnabled = s.getAttribute(t) !== "disabled", this.max = u(s), this.available = s.querySelector("[" + n + '="available"]'), this.selected = s.querySelector("[" + n + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + n + '="available"] and [' + n + '="selected"]', s), this;
    this._onChange = this._onChange.bind(this), s.addEventListener("change", this._onChange), this._initial = [];
    for (const b of [this.available, this.selected])
      for (const v of b.children)
        this._initial.push(v);
    return this.sync(), this._form = s.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), delete this.dom[e]);
  }, m.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, m.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, m.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const s = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let v = 0; v < s.length; v++)
      this._initial.includes(s[v]) || this._initial.push(s[v]);
    let b = 0;
    for (let v = 0; v < this._initial.length; v++) {
      const g = this._initial[v];
      if (!g.isConnected) continue;
      const f = g.querySelector('input[type="checkbox"]');
      if (!f) continue;
      let c;
      f.checked ? this.max === null || b < this.max ? (c = this.selected, b++) : (f.checked = !1, c = this.available) : c = this.available, c.appendChild(g);
    }
  }, m.prototype._onFormReset = function(s) {
    const b = this;
    setTimeout(function() {
      b._destroyed || s.defaultPrevented || b.sync();
    }, 0);
  }, m.prototype._onChange = function(s) {
    const b = s.target.closest('input[type="checkbox"]');
    if (!b) return;
    const v = b.closest("li");
    if (!v) return;
    const g = v.parentElement;
    if (g !== this.available && g !== this.selected) return;
    if (!this.isEnabled) {
      b.checked = !b.checked;
      return;
    }
    const f = b.checked ? this.selected : this.available;
    if (g === f) return;
    if (f === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      b.checked = !b.checked, L(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: v,
        checkbox: b,
        count: this.selected.children.length
      });
      return;
    }
    const c = { item: v, from: g, to: f, checkbox: b };
    if (W(this.dom, "ln-picklist:before-move", c).defaultPrevented) {
      b.checked = !b.checked;
      return;
    }
    const a = document.activeElement === b;
    f.appendChild(v), a && b.focus(), L(this.dom, "ln-picklist:move", c);
  };
  function u(s) {
    const b = s.getAttribute(l);
    if (b === null || b === "") return null;
    const v = parseInt(b, 10);
    return isNaN(v) || v < 0 ? null : v;
  }
  function d(s) {
    const b = s[e];
    if (!b) return;
    const v = s.getAttribute(t) !== "disabled";
    v !== b.isEnabled && (b.isEnabled = v, L(s, v ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: s }));
  }
  function h(s) {
    const b = s[e];
    b && (b.max = u(s));
  }
  B(t, e, m, "ln-picklist", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", n = "data-ln-confirm-state", l = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function m(v, g, f) {
    return v.getAttribute(g) || f;
  }
  function u(v, g, f) {
    const c = parseFloat(v.getAttribute(g));
    return isNaN(c) || c <= 0 ? f : c;
  }
  function d(v) {
    const g = document.createElement("span");
    return g.setAttribute(l, ""), g.setAttribute("role", "alert"), g.textContent = v, g;
  }
  const h = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: m, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: u, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (v, g) => v.getAttribute(g) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, s = Y(h);
  function b(v) {
    this.dom = v, X(this, v, s), this.revertTimer = null, this._submitted = !1, this.idleEl = v.querySelector("[data-ln-confirm-idle]"), this.activeEl = v.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : v.textContent.trim();
    const g = this;
    return this._onClick = function(f) {
      if (!xt(f))
        if (!g.confirming)
          f.preventDefault(), f.stopImmediatePropagation(), g._enterConfirm();
        else {
          if (g._submitted) return;
          g._submitted = !0, g._reset();
        }
    }, v.addEventListener("click", this._onClick), this;
  }
  b.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(n, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const v = this.activeEl ? this.activeEl.textContent.trim() : "";
      v && (this.dom.setAttribute("aria-label", v), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const v = this.dom.querySelector("svg.ln-icon use");
      v && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = v.getAttribute("href"), v.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(d(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, b.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const v = this, g = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      v._reset();
    }, g);
  }, b.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(n), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const v = this.dom.querySelector("svg.ln-icon use");
      v && this.originalIconHref && v.setAttribute("href", this.originalIconHref);
      const g = this.dom.querySelector("[" + l + "]");
      g && g.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, B(t, e, b, "ln-confirm", {
    attributes: h
  });
})();
function Cn(t) {
  return typeof t == "string" && (t.indexOf("{index}") !== -1 || t.indexOf("{index1}") !== -1);
}
function ie(t, e) {
  if (typeof t != "string") return "";
  const n = Math.max(0, Math.floor(Number(e) || 0));
  return t.replaceAll("{index1}", String(n + 1)).replaceAll("{index}", String(n));
}
function jr(t, e) {
  const n = typeof t == "number" && Number.isFinite(t) && t >= 0 ? Math.floor(t) : 0;
  let l = typeof e == "number" && Number.isFinite(e) && e >= 1 ? Math.floor(e) : 1 / 0;
  return Number.isFinite(l) && l < n && (l = n), { min: n, max: l };
}
function Tn(t, e) {
  return t < e;
}
function kn(t, e) {
  return t > e;
}
function Wr(t, e = 0) {
  let n = -1;
  if (Array.isArray(t)) {
    const p = /\[(\d+)\]/g;
    for (let m = 0; m < t.length; m++) {
      const u = t[m];
      if (typeof u != "string") continue;
      p.lastIndex = 0;
      let d;
      for (; (d = p.exec(u)) !== null; ) {
        const h = parseInt(d[1], 10);
        h > n && (n = h);
      }
    }
  }
  const l = Math.max(0, Math.floor(Number(e) || 0));
  return n >= 0 ? Math.max(n + 1, l) : l;
}
function Vr(t) {
  if (Array.isArray(t)) return t;
  if (typeof t == "string" && t.trim() !== "")
    try {
      const e = JSON.parse(t);
      if (Array.isArray(e)) return e;
    } catch {
      return null;
    }
  return null;
}
function $r(t) {
  if (typeof t != "string" || !t) return "";
  const e = t.match(/\[([^\]]*)\]/g);
  if (!e || e.length === 0) return t;
  for (let l = e.length - 1; l >= 0; l--) {
    const p = e[l].slice(1, -1);
    if (p !== "" && !/^\d+$/.test(p))
      return p;
  }
  const n = t.indexOf("[");
  return n > 0 ? t.slice(0, n) : t;
}
function Gr(t, e, n) {
  if (typeof t != "string" || e === n) return t || "";
  const l = "[" + e + "]", p = t.indexOf(l);
  return p === -1 ? t : t.slice(0, p) + "[" + n + "]" + t.slice(p + l.length);
}
(function() {
  const t = "data-ln-repeater", e = "lnRepeater", n = "data-ln-repeater-list", l = "data-ln-repeater-item", p = "data-ln-repeater-add", m = "data-ln-repeater-add-for", u = "data-ln-repeater-remove";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-repeater": { prop: "templateName", type: "string", fallback: "", description: "Mounts dynamic row repeater on container; optional value names the template and ln-fill array field key" },
    "data-ln-repeater-min": { prop: "_minRaw", type: "integer", fallback: 0, min: 0, effect: v, description: "Minimum number of rows; blocks removal below this count and auto-seeds rows on init when empty" },
    "data-ln-repeater-max": { prop: "_maxRaw", type: "integer", fallback: 1 / 0, min: 1, effect: v, description: "Maximum number of rows allowed; disables add triggers once reached" },
    "data-ln-repeater-reindex": { prop: "reindex", type: "boolean", fallback: !1, description: "When enabled, sequentially re-numbers indexed field attributes after remove or reorder" },
    "data-ln-repeater-list": { type: "marker", description: "List container element (e.g. <ul> or <ol>) where repeated items are appended" },
    "data-ln-repeater-item": { type: "marker", description: "Marks an individual repeated row element inside the repeater list" },
    "data-ln-repeater-add": { type: "trigger", description: "Button trigger inside the repeater root that appends a new row from the template" },
    "data-ln-repeater-add-for": { type: "string", description: "External button trigger referencing a repeater container by element ID" },
    "data-ln-repeater-remove": { type: "trigger", description: "Button trigger inside a repeated row that removes its owning item" }
  }, h = Y(d), s = 'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)';
  function b(g) {
    this.dom = g, X(this, g, h), this._destroyed = !1, this._attrTemplates = /* @__PURE__ */ new WeakMap(), this._textTemplates = /* @__PURE__ */ new WeakMap(), this._itemIndices = /* @__PURE__ */ new WeakMap(), this._triggerSnapshots = /* @__PURE__ */ new Map(), this.listEl = this._resolveList(), this._nextIndex = this._detectInitialNextIndex();
    const f = this;
    return this._onClick = function(c) {
      if (xt(c)) return;
      const a = c.target.closest("[" + p + "]");
      if (a && f._ownsElement(a)) {
        if (a.disabled) return;
        c.preventDefault(), f.add(null, { focus: !0 });
        return;
      }
      const i = c.target.closest("[" + u + "]");
      if (i && f._ownsElement(i)) {
        if (i.disabled) return;
        c.preventDefault();
        const _ = f._resolveItemFromDescendant(i);
        _ && f.remove(_, { focusNeighbor: !0 });
      }
    }, g.addEventListener("click", this._onClick), this._onRequestAdd = function(c) {
      if (c.target !== f.dom) return;
      const a = c.detail || {};
      f.add(a.values !== void 0 ? a.values : null, {
        focus: !!a.focus
      });
    }, this._onRequestRemove = function(c) {
      if (c.target !== f.dom || !c.detail) return;
      const a = c.detail.item !== void 0 ? c.detail.item : c.detail.index;
      a != null && f.remove(a, { focusNeighbor: !!c.detail.focusNeighbor });
    }, g.addEventListener("ln-repeater:request-add", this._onRequestAdd), g.addEventListener("ln-repeater:request-remove", this._onRequestRemove), this._onReordered = function(c) {
      c.target === f.listEl && (f.reindex && f._reindexItems(), f._syncControls());
    }, this.listEl.addEventListener("ln-sortable:reordered", this._onReordered), this._onFill = function(c) {
      if (c.target === f.dom) {
        f._handleFill(c.detail);
        return;
      }
      f._form && c.target === f._form && !f.dom.hasAttribute("data-ln-fillable") && f._handleFill(c.detail);
    }, g.addEventListener("ln-fill", this._onFill), this._form = g.closest("form"), this._form && this._form !== g && this._form.addEventListener("ln-fill", this._onFill), this._ensureMin(), this._syncControls(), this;
  }
  Object.defineProperty(b.prototype, "items", {
    get: function() {
      return this._getItems();
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(b.prototype, "count", {
    get: function() {
      return this._getItems().length;
    },
    enumerable: !0,
    configurable: !0
  }), b.prototype._ownsElement = function(g) {
    return !!g && g.closest("[" + t + "]") === this.dom;
  }, b.prototype._getBounds = function() {
    return jr(this._minRaw, this._maxRaw);
  }, b.prototype._resolveList = function() {
    const g = this.dom.querySelectorAll("[" + n + "]");
    for (let f = 0; f < g.length; f++)
      if (this._ownsElement(g[f])) return g[f];
    return this.dom;
  }, b.prototype._getItems = function() {
    const g = this.listEl.children, f = [], c = this.listEl === this.dom;
    for (let a = 0; a < g.length; a++) {
      const i = g[a];
      i.tagName !== "TEMPLATE" && (c && !i.hasAttribute(l) || f.push(i));
    }
    return f;
  }, b.prototype._resolveItemFromDescendant = function(g) {
    let f = g;
    for (; f && f.parentElement !== this.listEl; )
      f = f.parentElement;
    return !f || f.parentElement !== this.listEl || f.tagName === "TEMPLATE" || this.listEl === this.dom && !f.hasAttribute(l) ? null : f;
  }, b.prototype._detectInitialNextIndex = function() {
    const g = this._getItems(), f = [];
    for (let c = 0; c < g.length; c++) {
      const a = g[c];
      a.hasAttribute(l) || a.setAttribute(l, "");
      const i = a.querySelectorAll("[name]");
      for (let _ = 0; _ < i.length; _++) {
        const r = i[_].getAttribute("name");
        r && f.push(r);
      }
      this._itemIndices.set(a, c);
    }
    return Wr(f, g.length);
  }, b.prototype._cloneRow = function() {
    const g = this.templateName;
    if (g) {
      const c = this.dom.querySelectorAll('template[data-ln-template="' + g + '"]');
      for (let a = 0; a < c.length; a++)
        if (this._ownsElement(c[a]))
          return c[a].content.cloneNode(!0);
      return et(this.dom, g, "ln-repeater");
    }
    const f = this.dom.querySelectorAll("template");
    for (let c = 0; c < f.length; c++)
      if (this._ownsElement(f[c]))
        return f[c].content.cloneNode(!0);
    return pe() && console.warn("[ln-repeater] No <template> found for repeater", this.dom), null;
  }, b.prototype._applyTokens = function(g, f) {
    const c = Array.from(g.querySelectorAll("*"));
    c.unshift(g);
    for (let a = 0; a < c.length; a++) {
      const i = c[a], _ = i.attributes;
      let r = null;
      for (let y = 0; y < _.length; y++) {
        const o = _[y];
        Cn(o.value) && (r || (r = /* @__PURE__ */ new Map()), r.set(o.name, o.value), i.setAttribute(o.name, ie(o.value, f)));
      }
      r && this._attrTemplates.set(i, r), i.id && (!r || !r.has("id")) && document.getElementById(i.id) && i.removeAttribute("id");
    }
    if (typeof document.createTreeWalker == "function") {
      const a = document.createTreeWalker(g, NodeFilter.SHOW_TEXT);
      for (; a.nextNode(); ) {
        const i = a.currentNode;
        Cn(i.textContent) && (this._textTemplates.set(i, i.textContent), i.textContent = ie(i.textContent, f));
      }
    }
    this._itemIndices.set(g, f);
  }, b.prototype._populateRow = function(g, f) {
    if (f == null) return;
    const c = g.querySelectorAll("input, textarea, select");
    if (typeof f != "object") {
      for (let a = 0; a < c.length; a++) {
        const i = c[a];
        if (!(i.type === "hidden" || i.type === "button" || i.type === "submit" || i.type === "file")) {
          i.type === "checkbox" ? i.checked = le(f) : i.value = String(f);
          break;
        }
      }
      return;
    }
    for (let a = 0; a < c.length; a++) {
      const i = c[a];
      if (i.type === "button" || i.type === "submit" || i.type === "file") continue;
      const _ = i.getAttribute("data-ln-fill-as");
      let r = null;
      if (_ && _ in f)
        r = _;
      else if (i.name && i.name in f)
        r = i.name;
      else if (i.name) {
        const o = $r(i.name);
        o && o in f && (r = o);
      }
      if (r === null) continue;
      const y = f[r];
      if (i.type === "checkbox")
        Array.isArray(y) ? i.checked = y.indexOf(i.value) !== -1 : i.checked = le(y);
      else if (i.type === "radio")
        i.checked = i.value === String(y);
      else if (i.type === "select-multiple" && Array.isArray(y))
        for (let o = 0; o < i.options.length; o++)
          i.options[o].selected = y.indexOf(i.options[o].value) !== -1;
      else
        i.value = y == null ? "" : String(y), i.tagName === "SELECT" && y != null && i.setAttribute("data-ln-value", String(y));
    }
    dt(g, f);
  }, b.prototype._reindexItems = function() {
    const g = this._getItems();
    for (let f = 0; f < g.length; f++) {
      const c = g[f], a = this._itemIndices.has(c) ? this._itemIndices.get(c) : f, i = Array.from(c.querySelectorAll("*"));
      i.unshift(c);
      for (let _ = 0; _ < i.length; _++) {
        const r = i[_], y = this._attrTemplates.get(r);
        if (y)
          y.forEach(function(o, A) {
            r.setAttribute(A, ie(o, f));
          });
        else if (a !== f) {
          const o = r.getAttribute("name");
          o && o.indexOf("[" + a + "]") !== -1 && r.setAttribute("name", Gr(o, a, f));
        }
      }
      if (typeof document.createTreeWalker == "function") {
        const _ = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
        for (; _.nextNode(); ) {
          const r = _.currentNode, y = this._textTemplates.get(r);
          y !== void 0 && (r.textContent = ie(y, f));
        }
      }
      this._itemIndices.set(c, f);
    }
    this._nextIndex = g.length, L(this.dom, "ln-repeater:reindexed", {
      target: this.dom,
      count: g.length
    });
  }, b.prototype._getAddTriggers = function() {
    const g = [], f = this.dom.querySelectorAll("[" + p + "]");
    for (let c = 0; c < f.length; c++)
      this._ownsElement(f[c]) && g.push(f[c]);
    if (this.dom.id) {
      const c = window.CSS && CSS.escape ? CSS.escape(this.dom.id) : this.dom.id, a = document.querySelectorAll("[" + m + '="' + c + '"]');
      for (let i = 0; i < a.length; i++)
        g.push(a[i]);
    }
    return g;
  }, b.prototype._snapshotTrigger = function(g) {
    this._triggerSnapshots.has(g) || this._triggerSnapshots.set(g, {
      disabled: g.disabled,
      ariaDisabled: g.getAttribute("aria-disabled")
    });
  }, b.prototype._restoreTrigger = function(g) {
    const f = this._triggerSnapshots.get(g);
    f && (g.disabled = f.disabled, f.ariaDisabled !== null ? g.setAttribute("aria-disabled", f.ariaDisabled) : g.removeAttribute("aria-disabled"), this._triggerSnapshots.delete(g));
  }, b.prototype._syncControls = function() {
    const g = this._getBounds(), f = this._getItems(), c = f.length, a = Tn(c, g.max), i = kn(c, g.min), _ = this._getAddTriggers();
    for (let r = 0; r < _.length; r++) {
      const y = _[r];
      this._snapshotTrigger(y), y.disabled = !a, a ? y.removeAttribute("aria-disabled") : y.setAttribute("aria-disabled", "true");
    }
    for (let r = 0; r < f.length; r++) {
      const y = f[r].querySelectorAll("[" + u + "]");
      for (let o = 0; o < y.length; o++) {
        const A = y[o];
        this._ownsElement(A) && (this._snapshotTrigger(A), A.disabled = !i, i ? A.removeAttribute("aria-disabled") : A.setAttribute("aria-disabled", "true"));
      }
    }
  }, b.prototype._ensureMin = function() {
    const g = this._getBounds();
    let f = g.min;
    for (; this._getItems().length < g.min && f-- > 0 && this.add(null, { focus: !1, _silent: !0 }); )
      ;
  }, b.prototype._handleFill = function(g) {
    if (g == null) {
      this.clear({ force: !0, _silent: !0 }), this._nextIndex = 0, this._ensureMin(), this._syncControls();
      return;
    }
    const f = this.templateName;
    if (!f || !(f in g)) return;
    const c = Vr(g[f]);
    if (c === null) return;
    this.clear({ force: !0, _silent: !0 }), this._nextIndex = 0;
    const a = this._getBounds(), i = Math.min(c.length, a.max);
    for (let _ = 0; _ < i; _++)
      this.add(c[_], { focus: !1 });
    this._ensureMin(), this._syncControls();
  }, b.prototype._focusFirstControl = function(g) {
    if (!g) return;
    const f = g.querySelector(s);
    f && typeof f.focus == "function" && f.focus();
  }, b.prototype._focusAfterRemove = function(g) {
    const f = this._getItems();
    if (f.length > 0) {
      const a = f[Math.min(g, f.length - 1)], i = a.querySelector(s) || a.querySelector("[" + u + "]:not(:disabled)");
      if (i && typeof i.focus == "function") {
        i.focus();
        return;
      }
    }
    const c = this._getAddTriggers();
    for (let a = 0; a < c.length; a++)
      if (!c[a].disabled && typeof c[a].focus == "function") {
        c[a].focus();
        return;
      }
  }, b.prototype.add = function(g, f) {
    if (this._destroyed) return null;
    const c = f || {}, a = this._getBounds(), i = this._getItems().length;
    if (!Tn(i, a.max))
      return L(this.dom, "ln-repeater:max-reached", {
        target: this.dom,
        max: a.max,
        count: i
      }), null;
    const _ = this.reindex ? i : this._nextIndex;
    if (!c._silent && W(this.dom, "ln-repeater:before-add", {
      target: this.dom,
      index: _,
      count: i
    }).defaultPrevented)
      return null;
    const r = this._cloneRow();
    if (!r) return null;
    const y = r.firstElementChild;
    return y ? (y.hasAttribute(l) || y.setAttribute(l, ""), this._applyTokens(y, _), this._populateRow(y, g), this.listEl.appendChild(y), this._nextIndex = Math.max(this._nextIndex + 1, _ + 1), this._syncControls(), c.focus && this._focusFirstControl(y), c._silent || L(this.dom, "ln-repeater:added", {
      target: this.dom,
      item: y,
      index: _,
      count: this._getItems().length
    }), y) : null;
  }, b.prototype.remove = function(g, f) {
    if (this._destroyed) return !1;
    const c = f || {}, a = this._getBounds(), i = this._getItems();
    let _ = null, r = -1;
    if (typeof g == "number" ? (r = g, _ = i[r] || null) : (_ = g, r = i.indexOf(_)), !_ || r === -1) return !1;
    if (!c.force && !kn(i.length, a.min))
      return L(this.dom, "ln-repeater:min-reached", {
        target: this.dom,
        min: a.min,
        count: i.length
      }), !1;
    const y = this._itemIndices.has(_) ? this._itemIndices.get(_) : r;
    if (!c._silent && W(this.dom, "ln-repeater:before-remove", {
      target: this.dom,
      item: _,
      index: y,
      count: i.length
    }).defaultPrevented)
      return !1;
    const o = !!(document.activeElement && _.contains(document.activeElement));
    return _.parentNode && _.parentNode.removeChild(_), this.reindex && !c._skipReindex && this._reindexItems(), this._syncControls(), c.focusNeighbor && o && this._focusAfterRemove(r), c._silent || L(this.dom, "ln-repeater:removed", {
      target: this.dom,
      item: _,
      index: y,
      count: this._getItems().length
    }), !0;
  }, b.prototype.clear = function(g) {
    if (this._destroyed) return;
    const f = g || {}, c = this._getItems();
    for (let a = c.length - 1; a >= 0 && this.remove(c[a], {
      force: !!f.force,
      _silent: !!f._silent,
      _skipReindex: !0
    }); a--)
      ;
    this.reindex && !f._silent && this._reindexItems(), this._syncControls();
  }, b.prototype.destroy = function() {
    if (this.dom[e]) {
      this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), this.dom.removeEventListener("ln-repeater:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-repeater:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-fill", this._onFill), this.listEl.removeEventListener("ln-sortable:reordered", this._onReordered), this._form && this._form !== this.dom && this._form.removeEventListener("ln-fill", this._onFill);
      for (const g of Array.from(this._triggerSnapshots.keys()))
        this._restoreTrigger(g);
      this._triggerSnapshots.clear(), delete this.dom[e];
    }
  };
  function v(g) {
    const f = g[e];
    f && (f._ensureMin(), f._syncControls());
  }
  typeof document < "u" && document.addEventListener("click", function(g) {
    if (xt(g)) return;
    const f = g.target.closest("[" + m + "]");
    if (!f || f.disabled) return;
    const c = f.getAttribute(m);
    if (!c) return;
    const a = document.getElementById(c);
    a && (g.preventDefault(), L(a, "ln-repeater:request-add", { focus: !0 }));
  }), B(t, e, b, "ln-repeater", {
    attributes: d
  });
})();
function Qr(t, e, n = "") {
  return !t || !e ? "" : n ? `${n}[trans][${e}][${t}]` : `trans[${e}][${t}]`;
}
function Xr(t, e) {
  return (t || "{lang} translation").replaceAll("{lang}", e || "");
}
function Yr(t, e) {
  return (t || "Remove {lang}").replaceAll("{lang}", e || "");
}
function Ln(t, e = {}) {
  if (!t) return { ...e };
  if (typeof t == "object" && t !== null && !Array.isArray(t))
    return { ...t };
  if (typeof t == "string")
    try {
      const n = JSON.parse(t);
      if (typeof n == "object" && n !== null && !Array.isArray(n))
        return n;
    } catch {
    }
  return { ...e };
}
function ke(t, e = {}, n = "") {
  if (!t) return "";
  if (e && e[t])
    return e[t];
  if (typeof Intl < "u" && typeof Intl.DisplayNames == "function")
    try {
      const p = new Intl.DisplayNames(n ? [n] : void 0, {
        type: "language",
        fallback: "none"
      }).of(t);
      if (p) return p;
    } catch {
    }
  return t;
}
function Jr(t, e, n = "") {
  if (!t || typeof t != "object") return [];
  const l = e instanceof Set ? e : new Set(e || []), p = (n || "").toLowerCase().trim(), m = [];
  for (const [u, d] of Object.entries(t)) {
    const h = u.toLowerCase().trim();
    !l.has(u) && !l.has(h) && (!p || h !== p) && m.push([u, d]);
  }
  return m;
}
function Zr(t, e, n = "") {
  if (!t || typeof t != "object" || !e) return "";
  if (n) {
    const l = n.replace(/\]/g, "").split("[").filter(Boolean);
    let p = t;
    for (let d = 0; d < l.length; d++) {
      if (p == null || typeof p != "object") {
        p = void 0;
        break;
      }
      p = p[l[d]];
    }
    if (p && typeof p == "object" && p[e] !== void 0 && p[e] !== null)
      return String(p[e]);
    const m = `${n}[${e}]`;
    if (t[m] !== void 0 && t[m] !== null)
      return String(t[m]);
    const u = `${n}.${e}`;
    return t[u] !== void 0 && t[u] !== null ? String(t[u]) : "";
  }
  return t[e] !== void 0 && t[e] !== null ? String(t[e]) : "";
}
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-translations": { type: "marker", description: "Mounts multi-language translation coordinator on form container" },
    "data-ln-translations-default": { prop: "defaultLang", read: K, type: "string", fallback: "", description: "Default primary language code (e.g. en)" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: K, type: "string", fallback: "{lang} translation", description: "Placeholder label pattern for cloned translation inputs" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: K, type: "string", fallback: "Remove {lang}", description: "Accessible label template for translation removal buttons" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: Qe, type: "json", fallback: null, description: "JSON dictionary of supported locale codes and display labels" },
    "data-ln-translations-dict": { type: "string", description: "Dictionary key prefix mapping for translatable labels" },
    "data-ln-translations-menu": { type: "marker", description: "Menu container holding available language items" },
    "data-ln-translations-active": { type: "marker", description: "Container holding active language badge tags" },
    "data-ln-translations-add": { type: "trigger", description: "Trigger button to open translation language menu" },
    "data-ln-translations-lang": { type: "string", description: "Language code associated with active language badge or menu item" },
    "data-ln-translations-prefix": { type: "string", description: "Prefix format pattern for nested translatable field names" },
    "data-ln-translatable": { type: "string", description: "Marks form control container as translatable, value is field name" },
    "data-ln-translatable-lang": { type: "string", description: "Language code assigned to specific translatable input instance" }
  }, l = Y(n);
  function p(m) {
    this.dom = m, X(this, m, l), this.dict = $e(m, "data-ln-translations-dict"), this.locale = J(m), this.activeLanguages = /* @__PURE__ */ new Set(), this._clonedFields = /* @__PURE__ */ new Set(), this._flaggedOriginals = /* @__PURE__ */ new Set(), this._triggerHiddenSnapshots = /* @__PURE__ */ new WeakMap(), this.badgesEl = m.querySelector("[data-ln-translations-active]"), this.menuEl = m.querySelector("[data-ln-translations-menu]") || m.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = Ln(this._localesRaw, {}), this._applyDefaultLang();
    const u = this;
    return this.menuEl && (this._boundMenuClick = function(d) {
      if (xt(d)) return;
      const h = d.target.closest("button[data-ln-translations-lang]");
      if (!h || !u.menuEl.contains(h)) return;
      d.preventDefault(), d.stopPropagation();
      const s = h.getAttribute("data-ln-translations-lang");
      u.menuEl.getAttribute("data-ln-toggle") === "open" && u.menuEl.setAttribute("data-ln-toggle", "close"), s && u.addLanguage(s);
    }, this.menuEl.addEventListener("click", this._boundMenuClick)), this.badgesEl && (this._boundBadgesClick = function(d) {
      if (xt(d)) return;
      const h = d.target.closest("button");
      if (!h || !u.badgesEl.contains(h)) return;
      const s = h.closest("[data-ln-translations-lang]"), b = s ? s.getAttribute("data-ln-translations-lang") : null;
      b && (d.preventDefault(), d.stopPropagation(), u.removeLanguage(b));
    }, this.badgesEl.addEventListener("click", this._boundBadgesClick)), this._updateDropdown(), this._onRequestAdd = function(d) {
      d.detail && d.detail.lang && u.addLanguage(d.detail.lang, d.detail.values);
    }, this._onRequestRemove = function(d) {
      d.detail && d.detail.lang && u.removeLanguage(d.detail.lang);
    }, m.addEventListener("ln-translations:request-add", this._onRequestAdd), m.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._onFill = function(d) {
      if (d.target !== u.dom || (u._clearLanguages(), !d.detail)) return;
      const h = Ln(d.detail.trans);
      for (const s of Object.keys(h))
        u.addLanguage(s, h[s]);
    }, m.addEventListener("ln-fill", this._onFill), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLangToWrapper = function(m) {
    if (!this.defaultLang || !m) return;
    const u = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
    for (const d of u)
      d.setAttribute("data-ln-translatable-lang", this.defaultLang), this._flaggedOriginals.add(d);
  }, p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of m)
      this._applyDefaultLangToWrapper(u);
  }, p.prototype._cloneForWrapper = function(m, u, d) {
    if (!m || !u || m.querySelector('[data-ln-translatable-lang="' + u + '"]')) return;
    const h = m.getAttribute("data-ln-translatable"), s = m.getAttribute("data-ln-translations-prefix") || "", b = m.querySelector('[data-ln-translatable-lang="' + this.defaultLang + '"]') || m.querySelector("input, textarea, select");
    if (!b) return;
    const v = ke(u, this.locales, this.locale), g = this.dict && this.dict.placeholder || this.placeholderLabel, f = Xr(g, v), c = b.cloneNode(b.tagName === "SELECT");
    c.name = Qr(h, u, s), c.value = d ? Zr(d, h, s) : "", c.removeAttribute("id"), "placeholder" in c && (c.placeholder = f), c.setAttribute("aria-label", f), c.setAttribute("data-ln-translatable-lang", u);
    const a = m.querySelectorAll("[data-ln-translatable-lang]"), i = a.length > 0 ? a[a.length - 1] : b;
    i.parentNode.insertBefore(c, i.nextSibling), this._clonedFields.add(c);
  }, p.prototype._syncWrapper = function(m) {
    if (m) {
      this._applyDefaultLangToWrapper(m);
      for (const u of this.activeLanguages)
        this._cloneForWrapper(m, u, null);
    }
  }, p.prototype._onSubtreeChange = function(m) {
    if (!(!m || !m.addedNodes || !m.addedNodes.length))
      for (let u = 0; u < m.addedNodes.length; u++) {
        const d = m.addedNodes[u];
        if (d.nodeType === 1 && (d.matches && d.matches("[data-ln-translatable]") && this._syncWrapper(d), d.querySelectorAll)) {
          const h = d.querySelectorAll("[data-ln-translatable]");
          for (let s = 0; s < h.length; s++)
            this._syncWrapper(h[s]);
        }
      }
  }, p.prototype._detectExisting = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of m) {
      const d = u.getAttribute("data-ln-translatable-lang");
      d && d !== this.defaultLang && this.activeLanguages.add(d);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const m = Jr(this.locales, this.activeLanguages, this.defaultLang);
    for (let d = 0; d < m.length; d++) {
      const [h, s] = m[d], b = et(this.dom, "ln-translations-menu-item") || ce("ln-translations-menu-item", "ln-translations");
      if (!b) return;
      const v = b.querySelector("[data-ln-translations-lang]");
      v && (v.setAttribute("data-ln-translations-lang", h), v.textContent = s, this.menuEl.appendChild(b));
    }
    const u = this.dom.querySelector("[data-ln-translations-add]");
    u && (this._triggerHiddenSnapshots.has(u) || this._triggerHiddenSnapshots.set(u, u.hidden), u.hidden = m.length === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const m = this, u = this.dict && this.dict["remove-label"] || this.removeLabel;
    this.activeLanguages.forEach(function(d) {
      const h = et(m.dom, "ln-translations-badge") || ce("ln-translations-badge", "ln-translations");
      if (!h) return;
      const s = h.querySelector("[data-ln-translations-lang]");
      if (!s) return;
      s.setAttribute("data-ln-translations-lang", d);
      const b = ke(d, m.locales, m.locale), v = s.querySelector("span");
      v && (v.textContent = b);
      const g = s.querySelector("button");
      g && g.setAttribute("aria-label", Yr(u, b)), m.badgesEl.appendChild(h);
    });
  }, p.prototype._removeLanguageFields = function(m) {
    const u = this.dom.querySelectorAll('[data-ln-translatable-lang="' + m + '"]');
    for (const d of u)
      this._clonedFields.delete(d), d.parentNode.removeChild(d);
    this.activeLanguages.delete(m);
  }, p.prototype._clearLanguages = function() {
    for (const m of Array.from(this.activeLanguages))
      this._removeLanguageFields(m);
    this._updateDropdown(), this._updateBadges();
  }, p.prototype.addLanguage = function(m, u) {
    if (!m || m === this.defaultLang || this.activeLanguages.has(m)) return;
    const d = ke(m, this.locales, this.locale);
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: m,
      langName: d
    }).defaultPrevented) return;
    this.activeLanguages.add(m), u = u || {};
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of s)
      this._cloneForWrapper(b, m, u);
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: m,
      langName: d
    });
  }, p.prototype.sync = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of m)
      this._syncWrapper(u);
  }, p.prototype.removeLanguage = function(m) {
    !m || m === this.defaultLang || !this.activeLanguages.has(m) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: m
    }).defaultPrevented || (this._removeLanguageFields(m), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: m
    }));
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(m) {
    return this.activeLanguages.has(m);
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    for (const u of this._clonedFields)
      u.parentNode && u.parentNode.removeChild(u);
    this._clonedFields.clear();
    for (const u of this._flaggedOriginals)
      u.removeAttribute("data-ln-translatable-lang");
    this._flaggedOriginals.clear(), this.badgesEl && (this.badgesEl.textContent = "", this._boundBadgesClick && (this.badgesEl.removeEventListener("click", this._boundBadgesClick), this._boundBadgesClick = null)), this.menuEl && (this.menuEl.textContent = "", this._boundMenuClick && (this.menuEl.removeEventListener("click", this._boundMenuClick), this._boundMenuClick = null));
    const m = this.dom.querySelector("[data-ln-translations-add]");
    m && this._triggerHiddenSnapshots.has(m) && (m.hidden = this._triggerHiddenSnapshots.get(m), this._triggerHiddenSnapshots.delete(m)), this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-fill", this._onFill), this.activeLanguages.clear(), delete this.dom[e];
  }, B(t, e, p, "ln-translations", {
    attributes: n,
    onSubtreeChange: function(m, u) {
      m[e] && m[e]._onSubtreeChange(u);
    }
  });
})();
const to = "ln-autosave:", eo = 1e3;
function no(t, e) {
  return e ? to + (t || "") + ":" + e : null;
}
function io(t, e = eo) {
  if (t == null) return 0;
  if (t === "") return e;
  const n = parseInt(String(t), 10);
  return isNaN(n) || n < 0 ? e : n;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", n = "data-ln-autosave-clear", l = "data-ln-autosave-debounce-input", p = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function u(h) {
    const s = h.tagName;
    return s === "INPUT" || s === "TEXTAREA" || s === "SELECT";
  }
  function d(h) {
    const b = h.getAttribute(t) || h.id, v = no(window.location.pathname, b);
    if (!v) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", h);
      return;
    }
    this.dom = h, this.key = v;
    let g = null;
    function f() {
      const _ = je(h, { exclude: p });
      try {
        localStorage.setItem(v, JSON.stringify(_));
      } catch {
        return;
      }
      L(h, "ln-autosave:saved", { target: h, data: _ });
    }
    function c() {
      let _;
      try {
        _ = localStorage.getItem(v);
      } catch {
        return;
      }
      if (!_) return;
      let r;
      try {
        r = JSON.parse(_);
      } catch {
        return;
      }
      if (W(h, "ln-autosave:before-restore", { target: h, data: r }).defaultPrevented) return;
      const o = We(h, r);
      for (let A = 0; A < o.length; A++)
        o[A].dispatchEvent(new Event("input", { bubbles: !0 })), o[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(h, "ln-autosave:restored", { target: h, data: r });
    }
    function a() {
      try {
        localStorage.removeItem(v);
      } catch {
        return;
      }
      L(h, "ln-autosave:cleared", { target: h });
    }
    this._onFocusout = function(_) {
      const r = _.target;
      u(r) && r.name && !r.matches(p) && f();
    }, this._onChange = function(_) {
      const r = _.target;
      u(r) && r.name && !r.matches(p) && f();
    }, this._onSubmit = function() {
      a();
    }, this._onReset = function() {
      a();
    }, this._onClearClick = function(_) {
      _.target.closest("[" + n + "]") && a();
    }, h.addEventListener("focusout", this._onFocusout), h.addEventListener("change", this._onChange), h.addEventListener("submit", this._onSubmit), h.addEventListener("reset", this._onReset), h.addEventListener("click", this._onClearClick);
    const i = io(h.getAttribute(l));
    return i > 0 && (this._onInput = function(_) {
      const r = _.target;
      !u(r) || !r.name || r.matches(p) || (g !== null && clearTimeout(g), g = setTimeout(f, i));
    }, h.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return g;
    }, c(), this;
  }
  d.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const h = this._getInputTimer();
        h !== null && clearTimeout(h);
      }
      delete this.dom[e];
    }
  }, B(t, e, d, "ln-autosave", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-editor": { type: "marker", description: "Mounts rich text editor instance on container" },
    "data-ln-editor-action": { type: "enum", values: ["bold", "italic", "underline", "strikethrough", "heading-2", "heading-3", "heading-4", "blockquote", "code", "paragraph", "ordered-list", "unordered-list", "link", "unlink", "clear", "confirm-link", "cancel-link"], description: "Rich text toolbar formatting action" },
    "data-ln-editor-source": { type: "string", description: "Selector or ID of backing textarea synchronized with editor content" }
  }, l = {
    P: !0,
    BR: !0,
    STRONG: !0,
    B: !0,
    EM: !0,
    I: !0,
    U: !0,
    S: !0,
    A: !0,
    UL: !0,
    OL: !0,
    LI: !0,
    H2: !0,
    H3: !0,
    H4: !0,
    BLOCKQUOTE: !0,
    PRE: !0,
    CODE: !0,
    DIV: !0
  }, p = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, m = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, u = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let d = 0;
  function h(_) {
    return !!(p[_] || m[_] || u[_] || _ === "link");
  }
  function s(_) {
    this.dom = _;
    const r = this;
    if (this._textarea = _.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", _), this;
    const y = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), y && this._surface.setAttribute("data-placeholder", y);
    const o = this._textarea.id;
    if (o) {
      const E = _.querySelector('label[for="' + o + '"]');
      E && (E.id || (E.id = o + "-label"), this._surface.setAttribute("aria-labelledby", E.id));
    }
    this._surface.id = o ? o + "-surface" : "ln-editor-surface-" + ++d;
    const A = this._textarea.value.trim();
    A && (this._surface.innerHTML = A);
    const w = _.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? _.insertBefore(this._surface, w.nextSibling) : _.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const E = w.querySelectorAll("[data-ln-editor-action]");
      for (let C = 0; C < E.length; C++) {
        const T = E[C].getAttribute("data-ln-editor-action");
        h(T) && E[C].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      r._syncToTextarea(), L(r.dom, "ln-editor:changed", {
        html: r._textarea.value,
        target: r.dom
      });
    }, this._onMousedownToolbar = function(E) {
      E.target.closest("[data-ln-editor-action]") && E.preventDefault();
    }, this._onClickToolbar = function(E) {
      const C = E.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const T = C.getAttribute("data-ln-editor-action");
      r._execAction(T);
    }, this._onPaste = function(E) {
      g(r, E);
    }, this._onKeydown = function(E) {
      a(r, E);
    }, this._listeningSelection = !1, this._rafSelection = null, this._onSelectionChange = function() {
      r._rafSelection || (r._rafSelection = requestAnimationFrame(function() {
        r._rafSelection = null, document.contains(r._surface) && r._updateActiveStates();
      }));
    }, this._attachSelection = function() {
      r._listeningSelection || (r._listeningSelection = !0, document.addEventListener("selectionchange", r._onSelectionChange));
    }, this._detachSelection = function() {
      r._listeningSelection && (r._listeningSelection = !1, document.removeEventListener("selectionchange", r._onSelectionChange)), r._rafSelection && (cancelAnimationFrame(r._rafSelection), r._rafSelection = null);
    }, this._onFocus = function() {
      r._attachSelection(), r._updateActiveStates(), L(r.dom, "ln-editor:focus", { target: r.dom });
    }, this._onBlur = function() {
      r._detachSelection(), r._syncToTextarea(), L(r.dom, "ln-editor:blur", { target: r.dom });
    }, this._onTextareaInput = function() {
      r._surface.innerHTML !== r._textarea.value && (r._surface.innerHTML = r._textarea.value, L(r.dom, "ln-editor:changed", {
        html: r._textarea.value,
        target: r.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(E) {
      const C = E.detail && E.detail.html;
      C !== void 0 && (r._surface.innerHTML = C, r._syncToTextarea(), L(r.dom, "ln-editor:changed", {
        html: r._textarea.value,
        target: r.dom
      }));
    }, _.addEventListener("ln-editor:set-content", this._onSetContent);
    const S = this._textarea.form;
    return S && (this._onFormReset = function() {
      setTimeout(function() {
        r._surface.innerHTML = r._textarea.value, L(_, "ln-editor:changed", {
          html: r._textarea.value,
          target: _
        });
      }, 0);
    }, S.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, s.prototype._execAction = function(_) {
    if (!(!_ || W(this.dom, "ln-editor:before-change", {
      action: _,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), p[_])
        document.execCommand(p[_], !1, null);
      else if (m[_]) {
        const y = m[_], o = b(this._surface);
        o && o.toLowerCase() === y ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + y + ">");
      } else u[_] ? document.execCommand(u[_], !1, null) : _ === "link" ? i(this) : _ === "unlink" ? document.execCommand("unlink", !1, null) : _ === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, s.prototype._updateActiveStates = function() {
    const _ = this.dom.querySelector('[role="toolbar"]');
    if (!_) return;
    const r = window.getSelection();
    if (!r || r.rangeCount === 0) return;
    const y = r.anchorNode;
    if (!y || !this._surface.contains(y)) return;
    const o = _.querySelectorAll("[data-ln-editor-action]");
    for (let A = 0; A < o.length; A++) {
      const w = o[A], S = w.getAttribute("data-ln-editor-action");
      let E = !1;
      if (p[S])
        try {
          E = document.queryCommandState(p[S]);
        } catch {
        }
      else if (m[S]) {
        const C = b(this._surface);
        E = C && C.toLowerCase() === m[S];
      } else if (u[S])
        try {
          E = document.queryCommandState(u[S]);
        } catch {
        }
      else S === "link" && (E = !!v(r.anchorNode, "A", this._surface));
      if (h(S)) {
        const C = String(E);
        w.getAttribute("aria-pressed") !== C && w.setAttribute("aria-pressed", C);
      }
      E ? w.classList.contains("ln-editor-active") || w.classList.add("ln-editor-active") : w.classList.contains("ln-editor-active") && w.classList.remove("ln-editor-active");
    }
  }, s.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, s.prototype.setHTML = function(_) {
    this._surface && (this._surface.innerHTML = _, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const _ = this.dom.querySelector('[role="toolbar"]');
    _ && (_.removeEventListener("mousedown", this._onMousedownToolbar), _.removeEventListener("click", this._onClickToolbar)), this._detachSelection ? this._detachSelection() : document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const r = this._textarea ? this._textarea.form : null;
    if (r && this._onFormReset && r.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const y = this.dom.querySelector(".ln-editor__link-popover");
      y && y.remove();
    }
    delete this.dom[e];
  };
  function b(_) {
    const r = window.getSelection();
    if (!r || r.rangeCount === 0) return null;
    let y = r.anchorNode;
    if (!y) return null;
    for (; y && y !== _; ) {
      if (y.nodeType === 1) {
        const o = y.tagName;
        if (o === "H2" || o === "H3" || o === "H4" || o === "BLOCKQUOTE" || o === "PRE" || o === "P")
          return o;
      }
      y = y.parentNode;
    }
    return null;
  }
  function v(_, r, y) {
    for (; _ && _ !== y; ) {
      if (_.nodeType === 1 && _.tagName === r)
        return _;
      _ = _.parentNode;
    }
    return null;
  }
  function g(_, r) {
    r.preventDefault();
    let y = "";
    if (r.clipboardData && (y = r.clipboardData.getData("text/html"), !y)) {
      const A = r.clipboardData.getData("text/plain");
      A && (y = A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), y = "<p>" + y + "</p>");
    }
    if (!y) return;
    const o = f(y);
    o && document.execCommand("insertHTML", !1, o);
  }
  function f(_) {
    const r = document.createElement("div");
    return r.innerHTML = _, c(r), r.innerHTML;
  }
  function c(_) {
    const r = Array.from(_.childNodes);
    for (let y = 0; y < r.length; y++) {
      const o = r[y];
      if (o.nodeType !== 3) {
        if (o.nodeType !== 1) {
          _.removeChild(o);
          continue;
        }
        if (l[o.tagName]) {
          const A = Array.from(o.attributes);
          for (let w = 0; w < A.length; w++) {
            const S = A[w].name;
            if (o.tagName === "A" && S === "href") {
              const E = o.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(E) || o.removeAttribute("href");
            } else
              o.removeAttribute(S);
          }
          o.tagName === "A" && o.setAttribute("rel", "noopener noreferrer"), c(o);
        } else {
          for (; o.firstChild; )
            _.insertBefore(o.firstChild, o);
          _.removeChild(o);
        }
      }
    }
  }
  function a(_, r) {
    if (!(r.ctrlKey || r.metaKey)) return;
    let y = null;
    switch (r.key.toLowerCase()) {
      case "b":
        y = "bold";
        break;
      case "i":
        y = "italic";
        break;
      case "u":
        y = "underline";
        break;
      case "k":
        y = "link";
        break;
    }
    y && (r.preventDefault(), _._execAction(y));
  }
  function i(_) {
    const r = window.getSelection();
    if (!r || r.rangeCount === 0) return;
    const y = v(r.anchorNode, "A", _._surface), o = r.getRangeAt(0).cloneRange();
    _._closeLinkPopover && _._closeLinkPopover();
    const A = et(_.dom, "ln-editor-link-popover", "ln-editor");
    if (!A) return;
    const w = A.firstElementChild;
    if (!w) return;
    const S = w.querySelector('input[type="url"]'), E = w.querySelector('[data-ln-editor-action="confirm-link"]'), C = w.querySelector('[data-ln-editor-action="cancel-link"]');
    y && (S.value = y.getAttribute("href") || "");
    const T = _.dom.querySelector('[role="toolbar"]');
    T ? T.after(w) : _.dom.insertBefore(w, _._surface), S.focus();
    function x() {
      const H = window.getSelection();
      H.removeAllRanges(), H.addRange(o);
    }
    function I() {
      document.removeEventListener("mousedown", F), _._closeLinkPopover = null, w.remove();
    }
    function q() {
      const H = S.value.trim();
      if (I(), x(), _._surface.focus(), H)
        if (y)
          y.setAttribute("href", H), y.setAttribute("rel", "noopener noreferrer"), _._syncToTextarea(), L(_.dom, "ln-editor:changed", {
            html: _._textarea.value,
            target: _.dom
          });
        else {
          document.execCommand("createLink", !1, H);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const G = v(U.anchorNode, "A", _._surface);
            G && (G.setAttribute("rel", "noopener noreferrer"), _._syncToTextarea());
          }
        }
      else y && document.execCommand("unlink", !1, null);
    }
    function D() {
      I(), x(), _._surface.focus();
    }
    function N() {
      I();
    }
    function F(H) {
      const U = _.dom.contains(H.target) && H.target.closest('[data-ln-editor-action="link"]');
      !w.contains(H.target) && !U && N();
    }
    _._closeLinkPopover = I, E.addEventListener("click", q), C.addEventListener("click", D), S.addEventListener("keydown", function(H) {
      H.key === "Enter" ? (H.preventDefault(), q()) : H.key === "Escape" && (H.preventDefault(), D());
    }), document.addEventListener("mousedown", F);
  }
  B(t, e, s, "ln-editor", {
    attributes: n
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function n(p) {
    const m = {}, u = p.dataset;
    for (const d in u) {
      if (!d.startsWith("lnFill") || e[d]) continue;
      const h = d.slice(6);
      h && (m[h.charAt(0).toLowerCase() + h.slice(1)] = u[d]);
    }
    return m;
  }
  function l(p, m) {
    const u = window.CSS && CSS.escape ? CSS.escape(m) : m, d = document.querySelectorAll('[data-ln-fill-id="' + u + '"]');
    if (d.length === 0) return null;
    for (let h = 0; h < d.length; h++) {
      const s = d[h].getAttribute("data-ln-fill-form");
      if (s) {
        const b = document.getElementById(s);
        if (b && p.contains(b)) return d[h];
      }
    }
    return d[0];
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const m = p.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const u = m.getAttribute("data-ln-fill-form"), d = document.getElementById(u);
    if (!d) return;
    const h = n(m), s = Object.keys(h).length > 0;
    window.lnCore.lnFill(d, s ? h : null);
  }), document.addEventListener("ln-fill:request", function(p) {
    const m = p.detail;
    if (!m) return;
    const u = p.target, d = m.id;
    if (d == null) {
      window.lnCore.lnFill(u, null);
      return;
    }
    const h = l(u, d);
    if (!h) return;
    const s = n(h);
    window.lnCore.lnFill(u, s);
  }), window[t] = !0;
})();
function ro(t, e = "-") {
  if (t == null) return "";
  const n = e || "-", l = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, n).replace(new RegExp(`${l}+`, "g"), n).replace(new RegExp(`^${l}+|${l}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: K, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, l = Y(n), p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(u) {
    if (u.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", u.tagName), this;
    const d = u.form;
    if (!d)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", u), this;
    X(this, u, l);
    const h = d.elements[this.sourceName];
    if (!h)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', u), this;
    if (typeof h.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', u), this;
    this.dom = u, this.form = d, this.source = h, this._pristine = u.value === "", this._mirroring = !1;
    const s = this;
    return Ve(u, p, {
      get: function() {
        return p.get.call(u);
      },
      set: function(b) {
        p.set.call(u, b), s._mirroring || (s._pristine = b === "" || b === null || b === void 0);
      }
    }), this._onSource = function() {
      s._pristine && s._mirror();
    }, this._onSlug = function() {
      s._mirroring || (s._pristine = s.dom.value === "");
    }, this._onFormReset = function() {
      setTimeout(function() {
        s._pristine = s.dom.value === "";
      }, 0);
    }, h.addEventListener("input", this._onSource), u.addEventListener("input", this._onSlug), d.addEventListener("reset", this._onFormReset), this._pristine && h.value && h.value.trim() !== "" && this._mirror(), this;
  }
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = ro(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", p), delete this.dom[e]);
  }, B(t, e, m, "ln-slug", {
    attributes: n
  });
})();
function oo(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const n = typeof e == "number" ? e : e.getTime(), l = t.getTime(), p = Math.floor((l - n) / 1e3), m = Math.abs(p);
  return m < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : m < 60 ? { value: p, unit: "second", isOlderThanMonth: !1 } : m < 3600 ? { value: Math.round(p / 60), unit: "minute", isOlderThanMonth: !1 } : m < 86400 ? { value: Math.round(p / 3600), unit: "hour", isOlderThanMonth: !1 } : m < 604800 ? { value: Math.round(p / 86400), unit: "day", isOlderThanMonth: !1 } : m < 2592e3 ? { value: Math.round(p / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(p / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function re(t, e, n = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const l = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== n.getFullYear() && (l.year = "numeric"), l;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: S, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: S, description: "BCP 47 language tag override for time formatting" }
  }, l = {}, p = {};
  function m(T) {
    return T.getAttribute("data-ln-time-locale") || J(T);
  }
  function u(T, x) {
    const I = (T || "") + "|" + JSON.stringify(x);
    return l[I] || (l[I] = new Intl.DateTimeFormat(T, x)), l[I];
  }
  function d(T) {
    const x = T || "";
    return p[x] || (p[x] = new Intl.RelativeTimeFormat(T, { numeric: "auto", style: "narrow" })), p[x];
  }
  const h = /* @__PURE__ */ new Set();
  let s = null;
  function b() {
    s || (s = setInterval(g, 6e4));
  }
  function v() {
    s && (clearInterval(s), s = null);
  }
  function g() {
    for (const T of h) {
      if (!document.body.contains(T.dom)) {
        h.delete(T);
        continue;
      }
      r(T);
    }
    h.size === 0 && v();
  }
  function f(T, x) {
    const I = Tt(x), q = (x || "").toLowerCase().split("-")[0], D = u(x, re("full", T)), N = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (I && N !== q && I.monthsLong) {
      const F = I.monthsLong[T.getMonth()], H = T.getDate(), U = T.getFullYear(), G = String(T.getHours()).padStart(2, "0"), Z = String(T.getMinutes()).padStart(2, "0");
      return `${H} ${F} ${U}, ${G}:${Z}`;
    }
    return D.format(T);
  }
  function c(T, x) {
    const I = re("short", T), q = Tt(x), D = (x || "").toLowerCase().split("-")[0], N = u(x, I), F = N.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (q && F !== D && q.monthsShort) {
      const H = q.monthsShort[T.getMonth()], U = T.getDate(), G = I.year ? " " + T.getFullYear() : "";
      return `${U} ${H}${G}`;
    }
    return N.format(T);
  }
  function a(T, x) {
    return u(x, re("date", T)).format(T);
  }
  function i(T, x) {
    return u(x, re("time", T)).format(T);
  }
  function _(T, x) {
    const I = oo(T);
    return I.isOlderThanMonth ? c(T, x) : d(x).format(I.value, I.unit);
  }
  function r(T) {
    const x = T.dom.getAttribute("datetime");
    if (!x) return;
    const I = it(x);
    if (!I) return;
    const q = T.dom.getAttribute(t) || "short", D = m(T.dom);
    let N;
    switch (q) {
      case "relative":
        N = _(I, D);
        break;
      case "full":
        N = f(I, D);
        break;
      case "date":
        N = a(I, D);
        break;
      case "time":
        N = i(I, D);
        break;
      default:
        N = c(I, D);
        break;
    }
    T._formattedText = N, T.dom.textContent !== N && (T.dom.textContent = N), q !== "full" && (T.dom.title = f(I, D));
  }
  const y = /* @__PURE__ */ new Set();
  let o = !1;
  function A() {
    me(), !o && (o = !0, document.addEventListener("ln-core:locale-change", function() {
      y.forEach(function(T) {
        r(T);
      });
    }));
  }
  function w(T) {
    return this.dom = T, y.add(this), A(), r(this), T.getAttribute(t) === "relative" && (h.add(this), b()), this;
  }
  w.prototype.render = function() {
    r(this);
  }, w.prototype.destroy = function() {
    y.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), h.delete(this), h.size === 0 && v(), delete this.dom[e];
  };
  function S(T) {
    const x = T[e];
    if (!x) return;
    T.getAttribute(t) === "relative" ? (h.add(x), b()) : (h.delete(x), h.size === 0 && v()), r(x);
  }
  function E(T) {
    T.nodeType === 1 && T.hasAttribute && T.hasAttribute(t) && T[e] && r(T[e]);
  }
  function C(T) {
    const x = T[e];
    x && T.textContent !== x._formattedText && r(x);
  }
  B(t, e, w, "ln-time", {
    attributes: n,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: S,
    onSubtreeChange: C,
    onInit: E
  });
})();
function so(t, e, n) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: l, direction: p } = e, m = p === "desc", u = t.map((h) => h ? h[l] : void 0), d = ge(u);
  return [...t].sort((h, s) => {
    const b = h ? h[l] : void 0, v = s ? s[l] : void 0, g = _e(b, v, d, n);
    return m ? -g : g;
  });
}
function Be(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const n = Object.keys(e).filter((l) => Array.isArray(e[l]) && e[l].length > 0);
  return n.length ? t.filter((l) => l ? n.every((p) => Ze(l[p], e[p])) : !1) : t;
}
function ao(t, e, n) {
  if (!Array.isArray(t) || !e || !n || !n.length) return t;
  const l = si(e);
  return l.length ? t.filter((p) => p ? l.every(
    (m) => n.some((u) => {
      const d = p[u];
      return d != null && ai(String(d), [m]);
    })
  ) : !1) : t;
}
function lo(t, e, n) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (n === "count") return t.length;
  const l = t.map((m) => m && m[e] != null ? parseFloat(m[e]) : NaN).filter((m) => Number.isFinite(m)), p = l.reduce((m, u) => m + u, 0);
  return n === "sum" ? p : n === "avg" && l.length ? p / l.length : 0;
}
function co(t, e = {}, n = [], l) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const p = t.length;
  let m = t;
  e.filters && (m = Be(m, e.filters)), e.search && (m = ao(m, e.search, n));
  const u = m.length;
  if (e.sort && (m = so(m, e.sort, l)), e.offset || e.limit) {
    const d = e.offset || 0, h = e.limit || m.length;
    m = m.slice(d, d + h);
  }
  return { records: m, total: p, filtered: u };
}
function uo(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((n) => {
    if (!n) return null;
    const l = { ...n };
    for (const [p, m] of Object.entries(e))
      if (typeof m == "function")
        try {
          l[p] = m(n);
        } catch {
          l[p] = void 0;
        }
    return l;
  });
}
function fo(t, e, n, l = "_meta") {
  if (!Array.isArray(t) || !t.includes(l)) return !0;
  for (const p of Object.keys(e || {})) {
    if (!t.includes(p)) return !0;
    const m = e[p] && e[p].indexes || [], u = n && n[p] || [];
    if (m.some((d) => !u.includes(d))) return !0;
  }
  return !1;
}
function ho(t) {
  return { ok: !1, error: t && t.message ? t.message : String(t) };
}
function po(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    return Array.isArray(n) ? n : null;
  } catch {
    return null;
  }
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function n(k, R, O) {
    const P = k.getAttribute(R);
    if (P === "never" || P === "-1") return -1;
    const M = parseInt(P, 10);
    return isNaN(M) ? O : M;
  }
  const l = {
    "data-ln-data-store": { type: "marker", effect: on, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: on, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-seed": { type: "string", description: "Selector or element ID of an external seed script block" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: n, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: Ge, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: Et, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, p = Y(l), m = "ln_app_cache", u = "_meta", d = "1.0";
  let h = null, s = null;
  const b = {};
  function v(k) {
    k && k.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: k });
  }
  function g() {
    const k = {};
    for (const R of document.querySelectorAll(`[${t}]`)) {
      const O = R.id;
      if (O) {
        const P = R.getAttribute("data-ln-data-store-indexes") || "";
        k[O] = {
          indexes: P.split(",").map((M) => M.trim()).filter(Boolean)
        };
      }
    }
    return k;
  }
  function f() {
    return s || (s = new Promise((k) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), k(null);
      const R = g(), O = Object.keys(R), P = indexedDB.open(m);
      P.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed"), k(null);
      }, P.onsuccess = (M) => {
        const z = M.target.result, $ = Array.from(z.objectStoreNames), Q = O.filter((pt) => $.includes(pt));
        let ot = {};
        if (Q.length > 0) {
          const pt = z.transaction(Q, "readonly");
          for (const ht of Q)
            ot[ht] = Array.from(pt.objectStore(ht).indexNames);
        }
        if (!fo($, R, ot, u))
          return c(z), h = z, k(z);
        const Ui = z.version;
        z.close();
        const te = indexedDB.open(m, Ui + 1);
        let Dt = !1, Ot = null;
        te.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), L(document, "ln-data-store:blocked", { db: m }), Ot || (Ot = setTimeout(() => {
            Dt || (console.warn("[ln-data-store] Database upgrade timed out while blocked"), Dt = !0, s = null, k(null));
          }, 5e3));
        }, te.onerror = () => {
          Dt || (Ot && clearTimeout(Ot), Dt = !0, s = null, console.warn("[ln-data-store] Database upgrade failed"), k(null));
        }, te.onupgradeneeded = (pt) => {
          const ht = pt.target.result, zi = pt.target.transaction;
          ht.objectStoreNames.contains(u) || ht.createObjectStore(u, { keyPath: "key" });
          for (const zt of O)
            if (ht.objectStoreNames.contains(zt)) {
              const ee = zi.objectStore(zt);
              for (const Nt of R[zt].indexes)
                ee.indexNames.contains(Nt) || ee.createIndex(Nt, Nt, { unique: !1 });
            } else {
              const ee = ht.createObjectStore(zt, { keyPath: "id" });
              for (const Nt of R[zt].indexes)
                ee.createIndex(Nt, Nt, { unique: !1 });
            }
        }, te.onsuccess = (pt) => {
          if (Dt) {
            pt.target.result && pt.target.result.close();
            return;
          }
          Ot && clearTimeout(Ot), Dt = !0;
          const ht = pt.target.result;
          c(ht), h = ht, k(ht);
        };
      };
    }), s);
  }
  function c(k) {
    k.onversionchange = () => {
      k.close(), h = null, s = null;
    };
  }
  function a() {
    return h ? Promise.resolve(h) : (s = null, f());
  }
  async function i(k) {
    if (!Mt() || !k) return k;
    const R = { ...k }, O = R.id, P = await rr(R);
    return !P || !P.encrypted ? k : {
      ...P,
      id: O
    };
  }
  async function _(k) {
    return !k || !k.encrypted || !Mt() ? k : or(k, { silent: !0 });
  }
  const r = (k, R) => a().then((O) => O ? O.transaction(k, R).objectStore(k) : null);
  function y(k) {
    return new Promise((R, O) => {
      k.onsuccess = () => R(k.result), k.onerror = () => {
        v(k.error), O(k.error);
      };
    });
  }
  const o = (k) => r(k, "readonly").then((R) => R ? y(R.getAll()) : []).then((R) => Mt() ? Promise.all(R.map((O) => _(O))) : R), A = (k, R) => r(k, "readonly").then((O) => O ? y(O.get(R)).then((P) => P !== void 0 ? P : typeof R == "string" && R.trim() !== "" && !isNaN(Number(R)) ? y(O.get(Number(R))) : typeof R == "number" ? y(O.get(String(R))) : null) : null).then((O) => O ? _(O) : null), w = (k, R) => (Mt() ? i(R) : Promise.resolve(R)).then((P) => r(k, "readwrite").then((M) => M ? y(M.put(P)) : null)), S = (k, R) => r(k, "readwrite").then((O) => O ? y(O.delete(R)).then(() => {
    if (typeof R == "string" && R.trim() !== "" && !isNaN(Number(R)))
      return y(O.delete(Number(R)));
    if (typeof R == "number")
      return y(O.delete(String(R)));
  }) : null), E = (k) => r(k, "readwrite").then((R) => R ? y(R.clear()) : null), C = (k) => r(k, "readonly").then((R) => R ? y(R.count()) : 0), T = (k) => r(u, "readonly").then((R) => R ? y(R.get(k)) : null), x = (k, R) => r(u, "readwrite").then((O) => {
    if (O)
      return R.key = k, y(O.put(R));
  });
  function I(k) {
    return this.dom = k, this._name = k.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", k), X(this, k, p), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), b[this._name] = this, q(this), this.ready = nt(this), this;
  }
  function q(k) {
    k._handlers = {
      create: (R) => D(k, "create", R.detail, () => F(k, R.detail)),
      update: (R) => D(k, "update", R.detail, () => H(k, R.detail)),
      delete: (R) => D(k, "delete", R.detail, () => U(k, R.detail)),
      "bulk-delete": (R) => D(k, "bulk-delete", R.detail, () => G(k, R.detail)),
      "sync-failed": (R) => {
        k.isSyncing = !1, L(k.dom, "ln-data-store:sync-error", {
          store: k._name,
          error: R.detail && R.detail.error,
          status: R.detail && R.detail.status
        });
      }
    };
    for (const [R, O] of Object.entries(k._handlers))
      k.dom.addEventListener(`ln-data-store:request-${R}`, O);
  }
  function D(k, R, O, P) {
    const M = O && O.requestId;
    return k._mutationChain = k._mutationChain.then(() => k.ready).then(() => {
      if (k.initializationError) throw k.initializationError;
      return P();
    }).catch((z) => Z(k, R, M, z)), k._mutationChain;
  }
  function N(k) {
    return C(k._name).then((R) => (k.totalCount = R, k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, x(k._name, {
      schema_version: d,
      last_synced_at: k.lastSyncedAt,
      has_cache: !0,
      record_count: k.totalCount
    })));
  }
  function F(k, { tempId: R, data: O = {}, requestId: P } = {}) {
    const M = { ...O, id: R };
    return w(k._name, M).then(() => N(k)).then(() => {
      L(k.dom, "ln-data-store:created", { store: k._name, record: M, tempId: R, requestId: P });
    });
  }
  function H(k, { id: R, data: O = {}, requestId: P } = {}) {
    return A(k._name, R).then((M) => {
      if (!M) throw new Error(`Record not found: ${R}`);
      const z = M.id, $ = { ...M, ...O, id: z }, Q = O.id, ot = Q !== void 0 && Q !== z;
      return (ot ? Mi(k._name, z, { ...$, id: Q }) : w(k._name, $)).then(() => N(k)).then(() => {
        L(k.dom, "ln-data-store:updated", { store: k._name, record: ot ? { ...$, id: Q } : $, previous: M, requestId: P });
      });
    });
  }
  function U(k, { id: R, requestId: O } = {}) {
    return A(k._name, R).then((P) => {
      if (!P) {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: R, requestId: O, missing: !0 });
        return;
      }
      const M = P.id;
      return S(k._name, M).then(() => N(k)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: M, requestId: O });
      });
    });
  }
  function G(k, { ids: R = [], requestId: O } = {}) {
    return R.length ? Promise.all(R.map((P) => A(k._name, P))).then((P) => {
      const M = P.filter(Boolean).map((z) => z.id);
      return St(k._name, M).then(() => N(k)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, ids: M, requestId: O });
      });
    }) : (L(k.dom, "ln-data-store:deleted", { store: k._name, ids: [], requestId: O }), Promise.resolve());
  }
  function Z(k, R, O, P) {
    console.error("[ln-data-store] " + R + " failed:", P), L(k.dom, "ln-data-store:mutation-error", {
      store: k._name,
      action: R,
      requestId: O,
      error: P
    });
  }
  function lt(k) {
    let R = null;
    const O = k.dom.getAttribute("data-ln-data-store-seed");
    if (O && (R = document.getElementById(O), !R))
      try {
        R = document.querySelector(O);
      } catch {
      }
    return R || (R = k.dom.querySelector('script[type="application/json"]') || k.dom.querySelector("script")), R && R.textContent ? po(R.textContent) : null;
  }
  function nt(k) {
    const R = lt(k);
    return k._seedRecords = R, R ? (k.lastSyncedAt = Math.floor(Date.now() / 1e3), k.totalCount = R.length, k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, k.isInitialized = !0, setTimeout(() => {
      L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "seed" }), L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !0, lastSyncedAt: k.lastSyncedAt, count: k.totalCount, source: "seed" });
    }, 0), f().then((O) => {
      if (O)
        return E(k._name).then(() => j(k._name, R)).then(() => x(k._name, {
          schema_version: d,
          last_synced_at: k.lastSyncedAt,
          has_cache: !0,
          record_count: k.totalCount
        }));
    }).catch(() => {
    }), Promise.resolve({ ok: !0, source: "seed" })) : f().then((O) => {
      if (!O) throw new Error("IndexedDB is unavailable");
      return T(k._name);
    }).then((O) => {
      if (!R)
        if (k.initializationError = null, O && O.schema_version === d)
          k.lastSyncedAt = O.last_synced_at || null, k.totalCount = O.record_count || 0, k.hasCache = O.has_cache === !0 || k.totalCount > 0, k.hasCache && (k.isLoaded = !0, k.canServe = !0, L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "cache" })), k.isInitialized = !0, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: k.hasCache, lastSyncedAt: k.lastSyncedAt, count: k.totalCount });
        else {
          if (O && O.schema_version !== d)
            return E(k._name).then(() => x(k._name, { schema_version: d, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
              k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
            });
          k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
        }
    }).catch((O) => R ? (k.lastSyncedAt = Math.floor(Date.now() / 1e3), k.totalCount = R.length, k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, k.isInitialized = !0, L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "seed" }), L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !0, lastSyncedAt: k.lastSyncedAt, count: k.totalCount, source: "seed" }), { ok: !0, source: "seed" }) : (k.isInitialized = !0, k.isLoaded = !1, k.canServe = !1, k.hasCache = !1, k.isSyncing = !1, k.initializationError = O, L(k.dom, "ln-data-store:initialization-error", { store: k._name, error: O }), { ok: !1, error: O }));
  }
  function V(k) {
    k.isSyncing = !0, L(k.dom, "ln-data-store:request-remote-sync", { since: k.lastSyncedAt });
  }
  function j(k, R) {
    return a().then((O) => O ? (Mt() ? Promise.all(R.map((M) => i(M))) : Promise.resolve(R)).then((M) => new Promise((z, $) => {
      const Q = O.transaction(k, "readwrite"), ot = Q.objectStore(k);
      M.forEach((Rt) => ot.put(Rt)), Q.oncomplete = () => z(), Q.onerror = () => {
        v(Q.error), $(Q.error);
      };
    })) : void 0);
  }
  function St(k, R) {
    return a().then((O) => {
      if (O)
        return new Promise((P, M) => {
          const z = O.transaction(k, "readwrite"), $ = z.objectStore(k);
          R.forEach((Q) => {
            $.delete(Q), typeof Q == "string" && Q.trim() !== "" && !isNaN(Number(Q)) ? $.delete(Number(Q)) : typeof Q == "number" && $.delete(String(Q));
          }), z.oncomplete = () => P(), z.onerror = () => M(z.error);
        });
    });
  }
  function Mi(k, R, O) {
    return (Mt() ? i(O) : Promise.resolve(O)).then((M) => a().then((z) => {
      if (z)
        return new Promise(($, Q) => {
          const ot = z.transaction(k, "readwrite"), Rt = ot.objectStore(k);
          Rt.put(M), Rt.delete(R), ot.oncomplete = () => $(), ot.onerror = () => {
            v(ot.error), Q(ot.error);
          };
        });
    }));
  }
  const Fi = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Pi(k, R, O) {
    return lo(k, R, O);
  }
  function Zt(k, R) {
    return uo(R, k.presenters && k.presenters.computed);
  }
  function rn(k, R, O) {
    return co(R, O, k._searchFields, Fi);
  }
  I.prototype.getAll = function(k = {}) {
    const R = this;
    if (R._seedRecords) {
      const O = rn(R, R._seedRecords, k);
      return Promise.resolve({
        data: Zt(R, O.records),
        total: O.total,
        filtered: O.filtered
      });
    }
    return o(R._name).then((O) => {
      const P = rn(R, O, k);
      return {
        data: Zt(R, P.records),
        total: P.total,
        filtered: P.filtered
      };
    });
  }, I.prototype.getById = function(k) {
    return A(this._name, k).then((R) => R ? Zt(this, [R])[0] : null);
  }, I.prototype.count = function(k) {
    if (this._seedRecords) {
      const O = k && Object.keys(k).length > 0;
      return Promise.resolve(O ? Be(this._seedRecords, k).length : this._seedRecords.length);
    }
    return k && Object.keys(k).length > 0 ? o(this._name).then((O) => Be(O, k).length) : C(this._name);
  }, I.prototype.aggregate = function(k, R) {
    return o(this._name).then((O) => Pi(O, k, R));
  }, I.prototype.setPresenters = function(k) {
    this.presenters = k;
  }, I.prototype.applySync = function(k, R, O, P) {
    P = P || {};
    const M = this;
    let z = a().then(($) => {
      if (!$) throw new Error("IndexedDB unavailable");
    });
    return k.length > 0 && (z = z.then(() => j(M._name, k))), R.length > 0 && (z = z.then(() => St(M._name, R))), z.then(() => C(M._name)).then(($) => (M.totalCount = P.total !== void 0 ? P.total : $, M.hasCache = !0, x(M._name, {
      schema_version: d,
      last_synced_at: O,
      has_cache: !0,
      record_count: M.totalCount
    }))).then(() => {
      const $ = !M.isLoaded;
      return M.isLoaded = !0, M.canServe = !0, M.isSyncing = !1, M.lastSyncedAt = O, $ ? (L(M.dom, "ln-data-store:loaded", { store: M._name, count: M.totalCount, meta: P }), L(M.dom, "ln-data-store:ready", { store: M._name, count: M.totalCount, source: "server", meta: P })) : L(M.dom, "ln-data-store:synced", {
        store: M._name,
        added: k.length,
        deleted: R.length,
        changed: !0,
        meta: P
      }), { ok: !0 };
    }).catch(($) => {
      M.isSyncing = !1;
      const Q = $ && $.message ? $.message : String($);
      return console.error("[ln-data-store] applySync failed:", $), L(M.dom, "ln-data-store:sync-error", {
        store: M._name,
        error: Q
      }), ho($);
    });
  }, I.prototype.applyQuery = function(k, R) {
    R = R || {};
    const O = this;
    let P = Promise.resolve();
    return k.length > 0 && (P = P.then(() => j(O._name, k))), P.then(() => C(O._name)).then((M) => (O.totalCount = R.total !== void 0 ? R.total : M, k.length > 0 && (O.canServe = !0), Zt(O, k))).catch((M) => (console.error("[ln-data-store] applyQuery failed:", M), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const k = this;
    return E(k._name).then(() => x(k._name, {
      schema_version: d,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      k.isLoaded = !1, k.hasCache = !1, k.lastSyncedAt = null, k.totalCount = 0, V(k);
    });
  }, I.prototype.destroy = function() {
    if (this._handlers) {
      for (const [k, R] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${k}`, R);
      this._handlers = null;
    }
    delete b[this._name], delete this.dom[e];
  };
  function Bi() {
    return a().then((k) => {
      if (!k) return;
      const R = Array.from(k.objectStoreNames);
      return new Promise((O, P) => {
        const M = k.transaction(R, "readwrite");
        R.forEach((z) => M.objectStore(z).clear()), M.oncomplete = () => O(), M.onerror = () => P(M.error);
      });
    }).then(() => {
      Object.values(b).forEach((k) => {
        k.isLoaded = !1, k.canServe = !1, k.isInitialized = !1, k.initializationError = null, k.hasCache = !1, k.isSyncing = !1, k.lastSyncedAt = null, k.totalCount = 0;
      });
    });
  }
  const Hi = "data-ln-data-store-frozen";
  function on(k, R) {
    k.setAttribute(Hi, R);
  }
  B(t, e, I, "ln-data-store", {
    attributes: l
  }), window[e].clearAll = Bi, window[e].init = window[e], window[e].setStorageKey = un, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = un);
})();
const mo = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Ct(...t) {
  return t.filter((e) => e != null && e !== "").map((e, n) => {
    const l = String(e);
    return n === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function go(t, e) {
  if (!t || typeof t != "object") return "";
  const n = Object.assign({}, mo);
  if (e && typeof e == "object")
    for (const p in e)
      e[p] !== void 0 && e[p] !== null && e[p] !== "" && (n[p] = e[p]);
  const l = new URLSearchParams();
  return t.search && l.append(n.search, t.search), t.offset != null && l.append(n.offset, t.offset), t.limit != null && l.append(n.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (l.append(n.sortField, t.sort.field), l.append(n.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((p) => {
    const m = t.filters[p];
    Array.isArray(m) && m.length > 0 && l.append(p, m.join(","));
  }), l.toString();
}
function _o(t, e, n) {
  let l = Ct(t, e);
  return n && (l += (l.indexOf("?") !== -1 ? "&" : "?") + n), l;
}
function xn(t) {
  const e = t && t.content !== void 0 ? t.content : t, n = t && t.message ? t.message : null;
  return { record: e, message: n };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", n = "lnConnector";
  if (window[e] !== void 0) return;
  function l(f) {
    const c = f[e];
    c && c.refreshConfig();
  }
  function p(f) {
    return f.getAttribute("data-ln-api-path") || f.getAttribute("data-ln-api-endpoint") || "";
  }
  const m = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: K, type: "string", fallback: "", effect: l, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: p, type: "string", fallback: "", effect: l, description: "Resource path appended to base URL" },
    "data-ln-api-endpoint": { read: p, type: "string", fallback: "", effect: l, description: "Alias for data-ln-api-path" },
    "data-ln-api-headers": { prop: "rawHeaders", read: K, type: "json", fallback: null, effect: l, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: l, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: l, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: l, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: l, type: "string", fallback: "sort_field", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: l, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: l, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, u = Y(m);
  function d(f) {
    return f.ok ? f.status === 204 ? null : f.json() : f.json().catch(() => null).then((c) => {
      const a = new Error("HTTP " + f.status + ": " + f.statusText);
      throw a.status = f.status, a.data = c, a;
    });
  }
  const h = /* @__PURE__ */ new WeakMap();
  let s = 0;
  function b(f, c) {
    return !f || c == null ? f || "query" : (h.has(f) || h.set(f, ++s), "page:" + h.get(f) + ":" + c);
  }
  function v(f) {
    return this.dom = f, X(this, f, u), f[e] = this, f[n] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, g(this), this;
  }
  v.prototype.refreshConfig = function() {
    const f = this.dom;
    this.credentials = "same-origin", this.headers = Mn(this.rawHeaders);
    const c = {}, a = f.getAttribute("data-ln-api-param-offset");
    a && (c.offset = a);
    const i = f.getAttribute("data-ln-api-param-limit");
    i && (c.limit = i);
    const _ = f.getAttribute("data-ln-api-param-search");
    _ && (c.search = _);
    const r = f.getAttribute("data-ln-api-param-sort-field");
    r && (c.sortField = r);
    const y = f.getAttribute("data-ln-api-param-sort-dir");
    y && (c.sortDir = y), this.paramKeys = c;
    const o = f.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = o !== null ? +o : 200, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, v.prototype._reqHeaders = function(f) {
    const c = Object.assign({}, this.headers);
    return !c.Accept && !c.accept && (c.Accept = "application/json"), !c["Content-Type"] && !c["content-type"] && (c["Content-Type"] = "application/json"), f && (c["X-Idempotency-Key"] = f), c;
  }, v.prototype.cancel = function(f) {
    return f && this._inflight.has(f) ? (this._inflight.get(f).abort(), this._inflight.delete(f), !0) : !1;
  }, v.prototype.fetchDelta = function(f, c) {
    const a = this;
    let i = Ct(a.baseUrl, a.path);
    f != null && f !== "" && (i += (i.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(f));
    const _ = c || "sync";
    a._inflight.has(_) && a._inflight.get(_).abort();
    const r = new AbortController();
    return a._inflight.set(_, r), window.fetch(i, {
      method: "GET",
      headers: a._reqHeaders(),
      credentials: a.credentials,
      signal: r.signal
    }).then(d).finally(function() {
      a._inflight.get(_) === r && a._inflight.delete(_);
    });
  }, v.prototype.query = function(f, c) {
    const a = this, i = go(f, a.paramKeys), _ = _o(a.baseUrl, a.path, i), r = b(c, f && f.offset);
    a._inflight.has(r) && a._inflight.get(r).abort();
    const y = new AbortController();
    return a._inflight.set(r, y), window.fetch(_, {
      method: "GET",
      headers: a._reqHeaders(),
      credentials: a.credentials,
      signal: y.signal
    }).then(d).finally(function() {
      a._inflight.get(r) === y && a._inflight.delete(r);
    });
  }, v.prototype.create = function(f, c, a) {
    const i = this;
    return window.fetch(Ct(i.baseUrl, c || i.path), {
      method: "POST",
      headers: i._reqHeaders(a),
      credentials: i.credentials,
      body: JSON.stringify(f)
    }).then(d);
  }, v.prototype.update = function(f, c, a, i, _) {
    const r = this;
    a != null && (c = Object.assign({}, c, { expected_version: a }));
    const y = i ? Ct(r.baseUrl, i) : Ct(r.baseUrl, r.path, f);
    return window.fetch(y, {
      method: "PUT",
      headers: r._reqHeaders(_),
      credentials: r.credentials,
      body: JSON.stringify(c)
    }).then(d);
  }, v.prototype.delete = function(f, c, a) {
    const i = this;
    return window.fetch(Ct(i.baseUrl, c || i.path, f), {
      method: "DELETE",
      headers: i._reqHeaders(a),
      credentials: i.credentials
    }).then(d);
  }, v.prototype.bulkDelete = function(f, c, a) {
    const i = this;
    return window.fetch(Ct(i.baseUrl, c || i.path, "bulk-delete"), {
      method: "DELETE",
      headers: i._reqHeaders(a),
      credentials: i.credentials,
      body: JSON.stringify({ ids: f })
    }).then(d);
  };
  function g(f) {
    f._handlers = {
      sync: function(c) {
        const a = c.detail || {}, i = a.meta && a.meta.targetEl ? a.meta.targetEl : null;
        f.fetchDelta(a.since, i).then(function(_) {
          L(f.dom, "ln-api-connector:fetched", { data: _, since: a.since, meta: a.meta || null });
        }).catch(function(_) {
          _ && _.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            since: a.since,
            meta: a.meta || null
          });
        });
      },
      query: function(c) {
        const a = c.detail || {}, i = a.query || a, _ = a.meta && a.meta.targetEl ? a.meta.targetEl : null, r = b(_, i.offset), y = f.queryDebounce;
        function o(w, S, E) {
          f.query(S, E).then(function(C) {
            const T = C || {};
            L(f.dom, "ln-api-connector:fetched", {
              data: T.data || (Array.isArray(T) ? T : []),
              total: T.total,
              filtered: T.filtered,
              offset: S.offset,
              queryGen: S.queryGen,
              meta: w.meta || null
            });
          }).catch(function(C) {
            C && C.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
              action: "query",
              error: C.message,
              status: C.status || 0,
              data: C.data || null,
              meta: w.meta || null
            });
          });
        }
        if (y === 0) {
          o(a, i, _);
          return;
        }
        f._queryTimers.has(r) && clearTimeout(f._queryTimers.get(r));
        const A = setTimeout(function() {
          f._queryTimers.delete(r), o(a, i, _);
        }, y);
        f._queryTimers.set(r, A);
      },
      cancel: function(c) {
        const a = c.detail || {}, i = a.meta && a.meta.targetEl ? a.meta.targetEl : a.targetEl || a.key;
        i && f.cancel(i);
      },
      create: function(c) {
        const a = c.detail || {};
        f.create(a.data, a.url, a.idempotencyKey).then(function(i) {
          const _ = xn(i);
          L(f.dom, "ln-api-connector:created", {
            record: _.record,
            tempId: a.tempId,
            message: _.message,
            meta: a.meta || null
          });
        }).catch(function(i) {
          i && i.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
            action: "create",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            tempId: a.tempId,
            meta: a.meta || null
          });
        });
      },
      update: function(c) {
        const a = c.detail || {};
        f.update(a.id, a.data, a.expected_version, a.url, a.idempotencyKey).then(function(i) {
          const _ = xn(i);
          L(f.dom, "ln-api-connector:updated", {
            record: _.record,
            id: a.id,
            message: _.message,
            meta: a.meta || null
          });
        }).catch(function(i) {
          i && i.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            id: a.id,
            conflictData: i.status === 409 ? i.data : null,
            meta: a.meta || null
          });
        });
      },
      delete: function(c) {
        const a = c.detail || {};
        f.delete(a.id, a.url, a.idempotencyKey).then(function(i) {
          const _ = i && i.message ? i.message : null;
          L(f.dom, "ln-api-connector:deleted", {
            response: i,
            id: a.id,
            message: _,
            meta: a.meta || null
          });
        }).catch(function(i) {
          i && i.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
            action: "delete",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            id: a.id,
            meta: a.meta || null
          });
        });
      },
      bulkDelete: function(c) {
        const a = c.detail || {};
        f.bulkDelete(a.ids, a.url, a.idempotencyKey).then(function(i) {
          const _ = i && i.message ? i.message : null;
          L(f.dom, "ln-api-connector:bulk-deleted", {
            response: i,
            ids: a.ids,
            message: _,
            meta: a.meta || null
          });
        }).catch(function(i) {
          i && i.name === "AbortError" || L(f.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            ids: a.ids,
            meta: a.meta || null
          });
        });
      }
    }, f.dom.addEventListener("ln-api-connector:request-sync", f._handlers.sync), f.dom.addEventListener("ln-api-connector:request-query", f._handlers.query), f.dom.addEventListener("ln-api-connector:request-cancel", f._handlers.cancel), f.dom.addEventListener("ln-api-connector:request-create", f._handlers.create), f.dom.addEventListener("ln-api-connector:request-update", f._handlers.update), f.dom.addEventListener("ln-api-connector:request-delete", f._handlers.delete), f.dom.addEventListener("ln-api-connector:request-bulk-delete", f._handlers.bulkDelete);
  }
  v.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const f = this;
    f._inflight && (f._inflight.forEach(function(c) {
      c.abort();
    }), f._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(c) {
      c && clearTimeout(c);
    }), this._queryTimers.clear()), this._handlers && (f.dom.removeEventListener("ln-api-connector:request-sync", f._handlers.sync), f.dom.removeEventListener("ln-api-connector:request-query", f._handlers.query), f.dom.removeEventListener("ln-api-connector:request-cancel", f._handlers.cancel), f.dom.removeEventListener("ln-api-connector:request-create", f._handlers.create), f.dom.removeEventListener("ln-api-connector:request-update", f._handlers.update), f.dom.removeEventListener("ln-api-connector:request-delete", f._handlers.delete), f.dom.removeEventListener("ln-api-connector:request-bulk-delete", f._handlers.bulkDelete), f._handlers = null), delete this.dom[e], delete this.dom[n];
  }, B(t, e, v, "ln-api-connector", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", n = "lnConnector";
  if (window[e] !== void 0) return;
  function l(c) {
    const a = c[e];
    a && a.refreshConfig();
  }
  const p = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: K, type: "string", fallback: "", effect: l, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: K, type: "string", fallback: "", effect: l, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: K, type: "string", fallback: "", effect: l, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: l, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, m = Y(p);
  function u(c) {
    const a = c && c.content !== void 0 ? c.content : c, i = c && c.message ? c.message : null;
    return { content: a, message: i };
  }
  function d(c) {
    return this.dom = c, X(this, c, m), c[e] = this, c[n] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, f(this), this;
  }
  d.prototype.refreshConfig = function() {
    const c = this.dom;
    this.credentials = "same-origin";
    const a = c.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Mn(a, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), a.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(c, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function h(c, a, i) {
    const _ = Object.assign({}, Kt(c.headers, c.auth), i || {});
    return a && (_["Idempotency-Key"] = a), _;
  }
  d.prototype.fetchDelta = function(c) {
    const a = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const i = this._deltaController.signal, _ = ["include_docs=true", "feed=normal"];
    c && _.push("since=" + encodeURIComponent(c));
    const r = wt(a.url, a.db, "_changes") + "?" + _.join("&");
    return window.fetch(r, { method: "GET", headers: Kt(a.headers, a.auth), credentials: a.credentials, signal: i }).then((y) => {
      if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
      return y.json();
    }).then((y) => {
      const o = y.results || [];
      return {
        data: o.filter((A) => !A.deleted && A.doc).map((A) => Object.assign({}, A.doc, { id: A.doc._id })),
        deleted: o.filter((A) => A.deleted).map((A) => A.id),
        synced_at: y.last_seq || c || ""
      };
    }).finally(() => {
      a._deltaController && a._deltaController.signal === i && (a._deltaController = null);
    });
  };
  function s(c, a, i) {
    const _ = Object.assign({ _id: a.id }, a);
    return _._id || delete _._id, window.fetch(wt(c.url, c.db), {
      method: "POST",
      headers: h(c, i),
      credentials: c.credentials,
      body: JSON.stringify(_)
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const y = u(r), o = y.content;
      return { record: Object.assign({}, _, { id: o.id, _id: o.id, _rev: o.rev }), message: y.message };
    });
  }
  d.prototype.create = function(c, a) {
    return s(this, c, a).then((i) => i.record);
  };
  function b(c, a, i, _) {
    const r = Object.assign({ id: String(a), _id: String(a) }, i), y = r._rev || r.rev;
    return (y ? Promise.resolve(y) : window.fetch(wt(c.url, c.db, null, a), { method: "GET", headers: Kt(c.headers, c.auth), credentials: c.credentials }).then((A) => {
      if (!A.ok) throw new Error("Could not retrieve document for revision mapping");
      return A.json().then((w) => w._rev);
    })).then((A) => {
      const w = Object.assign({}, r, { _rev: A });
      delete w.rev;
      const S = h(c, _, { "If-Match": A });
      return window.fetch(wt(c.url, c.db, null, a), {
        method: "PUT",
        headers: S,
        credentials: c.credentials,
        body: JSON.stringify(w)
      }).then((E) => {
        if (E.ok) return E.json().then((C) => {
          const T = u(C);
          return { record: Object.assign({}, w, { _rev: T.content.rev }), message: T.message };
        });
        if (E.status === 409) return E.json().then((C) => {
          const T = new Error("Conflict");
          throw T.status = 409, T.data = C, T;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  d.prototype.update = function(c, a, i) {
    return b(this, c, a, i).then((_) => _.record);
  };
  function v(c, a, i, _) {
    return (i ? Promise.resolve(i) : window.fetch(wt(c.url, c.db, null, a), { method: "GET", headers: Kt(c.headers, c.auth), credentials: c.credentials }).then((y) => {
      if (!y.ok) throw new Error("Could not retrieve document for revision delete");
      return y.json().then((o) => o._rev);
    })).then((y) => {
      const o = wt(c.url, c.db, null, a) + "?rev=" + encodeURIComponent(y);
      return window.fetch(o, { method: "DELETE", headers: h(c, _), credentials: c.credentials }).then((A) => {
        if (!A.ok) throw new Error("HTTP " + A.status + ": " + A.statusText);
        return A.json();
      }).then((A) => {
        const w = u(A);
        return { response: w.content, message: w.message };
      });
    });
  }
  d.prototype.delete = function(c, a, i) {
    return v(this, c, a, i).then((_) => _.response);
  };
  function g(c, a, i) {
    return !a || a.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(wt(c.url, c.db, "_all_docs"), {
      method: "POST",
      headers: Kt(c.headers, c.auth),
      credentials: c.credentials,
      body: JSON.stringify({ keys: a })
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const y = (_.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return y.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(wt(c.url, c.db, "_bulk_docs"), {
        method: "POST",
        headers: h(c, i),
        credentials: c.credentials,
        body: JSON.stringify({ docs: y })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const A = u(o);
        return { response: { ok: !0, results: A.content, deletedCount: y.length }, message: A.message };
      });
    });
  }
  d.prototype.bulkDelete = function(c, a) {
    return g(this, c, a).then((i) => i.response);
  };
  function f(c) {
    c._handlers = {
      sync: function(a) {
        const i = a.detail || {};
        c.fetchDelta(i.since).then(function(_) {
          L(c.dom, "ln-couchdb-connector:fetched", { data: _, since: i.since, meta: i.meta || null });
        }).catch(function(_) {
          _ && _.name === "AbortError" || L(c.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(a) {
        const i = a.detail || {};
        s(c, i.data, i.idempotencyKey).then(function(_) {
          L(c.dom, "ln-couchdb-connector:created", { record: _.record, tempId: i.tempId, message: _.message, meta: i.meta || null });
        }).catch(function(_) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(a) {
        const i = a.detail || {}, _ = Object.assign({}, i.data);
        i.expected_version !== void 0 && (_._rev = i.expected_version), b(c, i.id, _, i.idempotencyKey).then(function(r) {
          L(c.dom, "ln-couchdb-connector:updated", { record: r.record, id: i.id, message: r.message, meta: i.meta || null });
        }).catch(function(r) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: i.id,
            data: r.status === 409 ? r.data : null,
            conflictData: r.status === 409 ? r.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(a) {
        const i = a.detail || {};
        v(c, i.id, i.rev, i.idempotencyKey).then(function(_) {
          L(c.dom, "ln-couchdb-connector:deleted", { response: _.response, id: i.id, message: _.message, meta: i.meta || null });
        }).catch(function(_) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(a) {
        const i = a.detail || {};
        g(c, i.ids, i.idempotencyKey).then(function(_) {
          L(c.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: i.ids, message: _.message, meta: i.meta || null });
        }).catch(function(_) {
          L(c.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, c.dom.addEventListener("ln-couchdb-connector:request-sync", c._handlers.sync), c.dom.addEventListener("ln-couchdb-connector:request-create", c._handlers.create), c.dom.addEventListener("ln-couchdb-connector:request-update", c._handlers.update), c.dom.addEventListener("ln-couchdb-connector:request-delete", c._handlers.delete), c.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", c._handlers.bulkDelete);
  }
  d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const c = this;
    c._deltaController && (c._deltaController.abort(), c._deltaController = null), c._handlers && (c.dom.removeEventListener("ln-couchdb-connector:request-sync", c._handlers.sync), c.dom.removeEventListener("ln-couchdb-connector:request-create", c._handlers.create), c.dom.removeEventListener("ln-couchdb-connector:request-update", c._handlers.update), c.dom.removeEventListener("ln-couchdb-connector:request-delete", c._handlers.delete), c.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", c._handlers.bulkDelete), c._handlers = null), delete this.dom[e], delete this.dom[n];
  }, B(t, e, d, "ln-couchdb-connector", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", n = "lnConnector";
  if (window[e] !== void 0) return;
  const l = 1e3, p = 3e4;
  function m(g) {
    const f = g[e];
    f && (f.command === "connect" ? f._open() : f._disconnect());
  }
  function u(g) {
    const f = g[e];
    !f || f.command !== "connect" || (f._drop("url-changed"), f._open());
  }
  const d = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: m, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: K, type: "string", fallback: "", effect: u, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, h = Y(d), s = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function b(g, f) {
    return g === "sync" ? { since: f.since } : g === "query" ? { query: f.query || {} } : g === "create" ? { data: f.data, idempotencyKey: f.idempotencyKey } : g === "update" ? { id: f.id, data: f.data, expected_version: f.expected_version, idempotencyKey: f.idempotencyKey } : g === "delete" ? { id: f.id, idempotencyKey: f.idempotencyKey } : { ids: f.ids, idempotencyKey: f.idempotencyKey };
  }
  function v(g) {
    this.dom = g, X(this, g, h), g[e] = this, g[n] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const f = this;
    this._onRequest = function(c) {
      f._request(s[c.type], c.detail || {});
    };
    for (const c in s) g.addEventListener(c, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  v.prototype._open = function() {
    if (this._socket || this._timer) return;
    const g = this, f = this.url;
    this._attempt++, this._status = "connecting", L(this.dom, "ln-websocket-connector:connecting", { url: f, attempt: this._attempt });
    let c;
    try {
      c = new WebSocket(f);
    } catch (a) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, a.message), this._held = [], L(this.dom, "ln-websocket-connector:disconnected", { url: f, code: 0, reason: a.message, willReconnect: !1 });
      return;
    }
    this._socket = c, c.onopen = function() {
      g._status = "connected", g._attempt = 0, L(g.dom, "ln-websocket-connector:connected", { url: f });
      const a = g._held;
      g._held = [];
      for (let i = 0; i < a.length; i++) g._send(a[i]);
    }, c.onmessage = function(a) {
      g._receive(a.data);
    }, c.onclose = function(a) {
      g._socket = null, g._status = "disconnected", g._failPending("connection closed");
      const i = g.command === "connect";
      L(g.dom, "ln-websocket-connector:disconnected", { url: f, code: a.code, reason: a.reason, willReconnect: i }), i && g._scheduleReconnect();
    };
  }, v.prototype._scheduleReconnect = function() {
    const g = this, f = Math.min(l * Math.pow(2, Math.max(0, this._attempt - 1)), p);
    this._timer = setTimeout(function() {
      g._timer = null, g._open();
    }, f);
  }, v.prototype._drop = function(g) {
    const f = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, g), this._socket = null), f && (this._status = "disconnected", this._failPending("connection closed"), L(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: g, willReconnect: !1 }));
  }, v.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, v.prototype._request = function(g, f) {
    const c = { ref: String(++this._seq), type: g, detail: f };
    this._status === "connected" ? this._send(c) : this.command === "connect" ? this._held.push(c) : this._fail(c, 0, "disconnected", null);
  }, v.prototype._send = function(g) {
    this._pending.set(g.ref, g), this._socket.send(JSON.stringify(Object.assign({ ref: g.ref, type: g.type }, b(g.type, g.detail))));
  }, v.prototype._receive = function(g) {
    let f;
    try {
      f = JSON.parse(g);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", g);
      return;
    }
    if (f.ref !== void 0) {
      const c = this._pending.get(String(f.ref));
      if (!c) return;
      this._pending.delete(c.ref), f.ok ? this._resolve(c, f.content, f.message || null) : this._fail(c, f.status || 0, f.error, f.data);
      return;
    }
    f.type === "changes" && L(this.dom, "ln-websocket-connector:fetched", {
      data: { data: f.data || [], deleted: f.deleted || [], synced_at: f.synced_at },
      since: null,
      meta: null
    });
  }, v.prototype._resolve = function(g, f, c) {
    const a = g.detail, i = a.meta || null, _ = this.dom;
    if (g.type === "sync")
      L(_, "ln-websocket-connector:fetched", { data: f, since: a.since, meta: i });
    else if (g.type === "query") {
      const r = a.query || {}, y = f || {};
      L(_, "ln-websocket-connector:fetched", {
        data: y.data || [],
        total: y.total,
        filtered: y.filtered,
        offset: r.offset,
        queryGen: r.queryGen,
        meta: i
      });
    } else g.type === "create" ? L(_, "ln-websocket-connector:created", { record: f, tempId: a.tempId, message: c, meta: i }) : g.type === "update" ? L(_, "ln-websocket-connector:updated", { record: f, id: a.id, message: c, meta: i }) : g.type === "delete" ? L(_, "ln-websocket-connector:deleted", { response: f, id: a.id, message: c, meta: i }) : L(_, "ln-websocket-connector:bulk-deleted", { response: f, ids: a.ids, message: c, meta: i });
  }, v.prototype._fail = function(g, f, c, a) {
    const i = g.detail;
    L(this.dom, "ln-websocket-connector:error", {
      action: g.type,
      error: c,
      status: f,
      data: a || null,
      conflictData: f === 409 && a || null,
      since: i.since,
      id: i.id,
      ids: i.ids,
      tempId: i.tempId,
      meta: i.meta || null
    });
  }, v.prototype._failAll = function(g, f) {
    for (let c = 0; c < g.length; c++) this._fail(g[c], 0, f, null);
  }, v.prototype._failPending = function(g) {
    const f = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(f, g);
  }, v.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const g in s) this.dom.removeEventListener(g, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[n];
    }
  }, B(t, e, v, "ln-websocket-connector", {
    attributes: d
  });
})();
function bo(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function yo(t, e) {
  const n = !t || !!t.initializationError, l = !!(t && t.noLocalQuery);
  return e && (n || !t.canServe || l) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function vo(t, e) {
  const n = t || {}, l = e || {}, p = n.filters && typeof n.filters == "object" ? n.filters : {}, m = l.filters && typeof l.filters == "object" ? l.filters : {};
  return {
    offset: n.offset,
    limit: n.limit,
    queryGen: n.queryGen,
    filters: Object.assign({}, p, m),
    search: l.search || n.search || "",
    sort: l.sort || n.sort || null
  };
}
class wo {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((n, l) => {
      this._pending.set(e, { resolve: n, reject: l });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const n = e || new Error("Mutation receipt registry closed");
    for (const l of this._pending.values()) l.reject(n);
    this._pending.clear();
  }
  _settle(e, n) {
    const l = e && e.requestId;
    if (!l) return !1;
    const p = this._pending.get(l);
    return p ? (this._pending.delete(l), n ? p.reject(e.error || new Error("Store mutation failed")) : p.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", n = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const l = "data-ln-data-coordinator-search", p = "data-ln-data-coordinator-filters", m = "data-ln-data-coordinator-sort-field", u = "data-ln-data-coordinator-sort-direction", d = {
    "data-ln-data-coordinator": { prop: "_name", type: "string", description: "Coordinator name or identifier for data routing" },
    "data-ln-data-coordinator-scope": { type: "string", description: "Scope name addressing the bound data store and connector" },
    "data-ln-data-coordinator-connector": { type: "string", description: "Selector, identifier, or namespace of the bound connector" },
    "data-ln-data-coordinator-mapper": { type: "string", effect: c, description: "Name of the registered data mapper transform" },
    "data-ln-data-coordinator-search": { prop: "_searchAttr", type: "string", effect: c, description: "Active search query term" },
    "data-ln-data-coordinator-filters": { prop: "_filtersAttr", type: "string", effect: c, description: "Active encoded filter parameters" },
    "data-ln-data-coordinator-sort-field": { prop: "_sortFieldAttr", type: "string", effect: c, description: "Sort field name" },
    "data-ln-data-coordinator-sort-direction": { prop: "_sortDirAttr", type: "enum", values: ["asc", "desc"], fallback: "asc", effect: c, description: "Sort direction" },
    "data-ln-data-coordinator-stale": { type: "string", description: "Staleness threshold in seconds, or never/-1" },
    "data-ln-data-coordinator-no-autosync": { type: "boolean", description: "Disables automatic synchronization upon state changes" }
  }, h = Y(d), s = [
    ["[data-ln-table-source]", "data-ln-table-source", "table"],
    ["[data-ln-list-source]", "data-ln-list-source", "list"],
    ["[data-ln-chart-source]", "data-ln-chart-source", "chart"],
    ["[data-ln-options]", "data-ln-options", "options"],
    ["[data-ln-stat]", "data-ln-stat", "stat"]
  ];
  function b(a) {
    const i = a.getAttribute("data-ln-data-coordinator-connector");
    if (i) return a.querySelector(i) || document.querySelector(i) || document.getElementById(i);
    const _ = a.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (_) return _;
    for (const r of a.querySelectorAll("*")) {
      if (r.lnConnector) return r;
      for (const y of r.attributes) if (y.name.startsWith("data-ln-") && y.name.endsWith("-connector")) return r;
    }
    return null;
  }
  function v(a) {
    var _;
    if (!a) return "ln-connector";
    if ((_ = a.lnConnector) != null && _.namespace) return a.lnConnector.namespace;
    const i = a.getAttribute("data-ln-connector");
    if (i && i !== "true") return i.startsWith("ln-") ? i : "ln-" + i + (i.endsWith("-connector") ? "" : "-connector");
    for (const r of a.attributes) if (r.name.startsWith("data-ln-") && r.name.endsWith("-connector")) return r.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function g(a) {
    const i = this;
    return this.dom = a, X(this, a, h), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", a), a[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new wo(), this._queueQueryRefresh = Ut(() => {
      i._destroyed || i._refreshAll(null, !0);
    }), this.refreshMapper(), f(this), this._checkInitialSync(), this;
  }
  g.prototype._noAutosync = function(a) {
    var i;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((i = a.storeEl) != null && i.hasAttribute("data-ln-data-store-no-autosync"));
  }, g.prototype._isStale = function(a) {
    var _, r;
    const i = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((_ = a.storeEl) == null ? void 0 : _.getAttribute("data-ln-data-store-stale"));
    return i === "never" || i === "-1" ? !1 : !((r = a.store) != null && r.lastSyncedAt) || Date.now() / 1e3 - a.store.lastSyncedAt > (parseInt(i, 10) || 300);
  }, g.prototype._checkInitialSync = function() {
    const a = this, i = this.findChildren();
    i.store && Promise.resolve(i.store.ready).then(() => {
      if (a._destroyed) return;
      const _ = a.findChildren();
      _.store && _.connector && !a._noAutosync(_) && !_.store.isSyncing && (!_.store.hasCache || a._isStale(_)) && _.store.forceSync();
    }).catch((_) => a._reportError("store-initialize", _, null));
  }, g.prototype.refreshMapper = function() {
    var _, r;
    const a = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, i = a && ((r = (_ = window.lnCore) == null ? void 0 : _.getDataMapper) == null ? void 0 : r.call(_, a)) || null;
    this.mapper = { ingress: (i == null ? void 0 : i.ingress) || ((y) => y), egress: (i == null ? void 0 : i.egress) || ((y) => y) };
  }, g.prototype.findChildren = function() {
    const a = this.dom.querySelector("[data-ln-data-store]"), i = b(this.dom), _ = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: a, connectorEl: i, queueEl: _, store: (a == null ? void 0 : a.lnDataStore) || null, connector: (i == null ? void 0 : i.lnConnector) || (i == null ? void 0 : i.lnApiConnector) || (i == null ? void 0 : i.lnCouchDbConnector) || (i == null ? void 0 : i.lnWebsocketConnector) || null, queue: (_ == null ? void 0 : _.lnApiQueue) || null };
  }, g.prototype._fanOutRemote = function(a, i, _, r) {
    this.refreshMapper(), a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", _) : a.connector && L(a.connectorEl, v(a.connectorEl) + ":request-" + i, r);
  }, g.prototype._fanOutCreate = function(a, i, _) {
    const r = "_temp_" + _t(), y = this.mapper.egress(i);
    a.storeEl && L(a.storeEl, "ln-data-store:request-create", { tempId: r, data: y }), this._fanOutRemote(a, "create", { chainKey: r, op: "create", targetId: null, payload: y, expectedVersion: null, meta: { tempId: r, action: _ } }, { data: y, url: _, meta: { entryId: _t(), queued: !1, op: "create", tempId: r } });
  }, g.prototype._fanOutUpdate = function(a, i, _, r, y) {
    const o = this, A = (w) => {
      const S = o.mapper.egress(_);
      a.storeEl && L(a.storeEl, "ln-data-store:request-update", { id: i, data: S }), o._fanOutRemote(a, "update", { chainKey: i, op: "update", targetId: i, payload: S, expectedVersion: r, meta: { id: i, action: y, snapshot: w } }, { id: i, data: S, expected_version: r, url: y, meta: { entryId: _t(), queued: !1, op: "update", id: i, snapshot: w } });
    };
    a.store && typeof a.store.getById == "function" ? a.store.getById(i).then((w) => A(w ? Object.assign({}, w) : null)).catch(() => A(null)) : A(null);
  }, g.prototype._fanOutDelete = function(a, i) {
    const _ = this, r = (y) => {
      a.storeEl && L(a.storeEl, "ln-data-store:request-delete", { id: i }), _._fanOutRemote(a, "delete", { chainKey: i, op: "delete", targetId: i, payload: null, expectedVersion: null, meta: { id: i, snapshot: y } }, { id: i, meta: { entryId: _t(), queued: !1, op: "delete", id: i, snapshot: y } });
    };
    a.store && typeof a.store.getById == "function" ? a.store.getById(i).then((y) => r(y ? Object.assign({}, y) : null)).catch(() => r(null)) : r(null);
  }, g.prototype._fanOutBulkDelete = function(a, i) {
    const _ = i.join(",");
    a.storeEl && L(a.storeEl, "ln-data-store:request-bulk-delete", { ids: i }), this._fanOutRemote(a, "bulk-delete", { chainKey: _, op: "bulk-delete", targetId: null, payload: { ids: i }, expectedVersion: null, meta: { bulkKey: _, ids: i } }, { ids: i, meta: { entryId: _t(), queued: !1, op: "bulk-delete", bulkKey: _ } });
  }, g.prototype._requestStoreMutation = function(a, i, _) {
    if (!a.storeEl) return Promise.reject(new Error("Store element not found"));
    const r = _t(), y = this._mutationReceipts.wait(r);
    return L(a.storeEl, "ln-data-store:request-" + i, Object.assign({}, _, { requestId: r })), y;
  }, g.prototype._reportError = function(a, i, _) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", { operation: a, error: i, meta: _ || null });
  }, g.prototype._owns = function(a) {
    var _;
    const i = this._name || ((_ = this.findChildren().storeEl) == null ? void 0 : _.id);
    return !!a && a === i;
  }, g.prototype._currentQuery = function() {
    const a = this.dom.getAttribute(m), i = this.dom.getAttribute(u), _ = new URLSearchParams(this.dom.getAttribute(p) || ""), r = {};
    for (const y of new Set(_.keys())) r[y] = _.getAll(y);
    return { search: this.dom.getAttribute(l) || "", filters: r, sort: a && i ? { field: a, direction: i } : null };
  }, g.prototype._refreshAll = function(a, i) {
    for (const [_, r, y] of s)
      for (const o of this.dom.ownerDocument.querySelectorAll(_))
        if (this._owns(o.getAttribute(r))) {
          if ((y === "table" || y === "list") && o.hasAttribute(y === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            L(o, "ln-" + y + (i ? ":request-invalidate" : ":request-revalidate"), { query: this._currentQuery() });
            continue;
          }
          this._serveElement(o, y, null, a);
        }
  }, g.prototype._serveElement = function(a, i, _, r) {
    const y = this.findChildren(), o = y.store;
    _ && this._boundQueries.set(a, _);
    const A = this._boundQueries.get(a) || { sort: null, filters: {}, search: "" }, w = vo(A, this._currentQuery()), S = this;
    return Promise.resolve(o == null ? void 0 : o.ready).then(() => {
      if (S._destroyed) return;
      const E = yo(o, y.connector);
      if (i === "table" || i === "list" || i === "chart")
        return E === "remote" ? (L(a, "ln-" + i + ":set-loading", { loading: !0 }), L(y.connectorEl, v(y.connectorEl) + ":request-query", { query: w, meta: { targetEl: a, kind: i, offset: w.offset, limit: w.limit, queryGen: A.queryGen } })) : E !== "store" ? L(a, "ln-" + i + ":set-loading", { loading: !1 }) : o.getAll(w).then((C) => {
          S._destroyed || !S._boundDelivered || (L(a, "ln-" + i + ":set-loading", { loading: !1 }), L(a, "ln-" + i + ":set-data", { data: C.data, total: (r == null ? void 0 : r.total) ?? C.total, filtered: (r == null ? void 0 : r.filtered) ?? C.filtered, offset: A.offset, queryGen: A.queryGen }), S._boundDelivered.set(a, !0));
        });
      if (i === "options") {
        if (E === "remote") return L(y.connectorEl, v(y.connectorEl) + ":request-query", { query: {}, meta: { targetEl: a, kind: i } });
        if (E === "store") return o.getAll({}).then((C) => !S._destroyed && L(a, "ln-options:set-data", { data: C.data }));
      }
      if (i === "stat") {
        let C = _ == null ? void 0 : _.filters;
        if (!C) {
          const T = a.getAttribute("data-ln-stat-filter");
          if (T != null && T.includes(":")) {
            const x = T.split(":");
            C = { [x[0].trim()]: [x.slice(1).join(":").trim()] };
          }
        }
        if (E === "remote") return L(y.connectorEl, v(y.connectorEl) + ":request-query", { query: { filters: C }, meta: { targetEl: a, kind: i } });
        if (E === "store") return o.count(C).then((T) => !S._destroyed && L(a, "ln-stat:set-count", { count: T }));
      }
    }).catch((E) => {
      S._destroyed || ((i === "table" || i === "list" || i === "chart") && L(a, "ln-" + i + ":set-loading", { loading: !1 }), S._reportError(i + "-query", E, { targetEl: a, kind: i }));
    });
  };
  function f(a) {
    const i = a._unsubs = [], _ = (E, C, T) => {
      E.addEventListener(C, T), i.push(() => E.removeEventListener(C, T));
    };
    _(a.dom, "ln-data-store:request-remote-sync", (E) => {
      a.refreshMapper();
      const C = a.findChildren();
      C.store && C.connector && L(C.connectorEl, v(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
    }), _(a.dom, "ln-data-coordinator:request-create", (E) => a._fanOutCreate(a.findChildren(), E.detail.data || {}, E.detail.action)), _(a.dom, "ln-data-coordinator:request-update", (E) => a._fanOutUpdate(a.findChildren(), E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action)), _(a.dom, "ln-data-coordinator:request-delete", (E) => a._fanOutDelete(a.findChildren(), E.detail.id)), _(a.dom, "ln-data-coordinator:request-bulk-delete", (E) => a._fanOutBulkDelete(a.findChildren(), E.detail.ids || [])), _(a.dom, "ln-api-queue:send", (E) => a._onQueueSend(E.detail || {})), _(a.dom, "ln-api-queue:failed", (E) => {
      var C;
      return a._reportError("queue-failed", ((C = E == null ? void 0 : E.detail) == null ? void 0 : C.error) || new Error("Queue failed"), (E == null ? void 0 : E.detail) || null);
    }), _(a.dom, "ln-data-store:initialized", (E) => {
      var T;
      const C = a.findChildren();
      C.store && !C.store.initializationError && C.connector && !a._noAutosync(C) && !C.store.isSyncing && (!((T = E.detail) != null && T.hasCache) || a._isStale(C)) && C.store.forceSync();
    });
    const r = () => {
      const E = a.findChildren();
      E.store && !E.store.initializationError && E.connector && !a._noAutosync(E) && E.store.isInitialized && !E.store.isSyncing && E.store.forceSync();
    };
    _(a.dom, "ln-websocket-connector:connected", r), _(document, "submit", (E) => a._onFormSubmit(E));
    const y = (E, C, T) => {
      var x;
      a._owns(E.target.getAttribute(T)) && a._serveElement(E.target, C, C === "stat" ? { filters: ((x = E.detail) == null ? void 0 : x.filters) || null } : C === "options" ? null : bo(E.detail || {}), null);
    };
    _(document, "ln-table:request-data", (E) => y(E, "table", "data-ln-table-source")), _(document, "ln-list:request-data", (E) => y(E, "list", "data-ln-list-source")), _(document, "ln-chart:request-data", (E) => y(E, "chart", "data-ln-chart-source")), _(document, "ln-options:request-data", (E) => y(E, "options", "data-ln-options")), _(document, "ln-stat:request-count", (E) => y(E, "stat", "data-ln-stat"));
    const o = (E) => {
      a._mutationReceipts.resolve(E.detail), a._refreshAll(null, !1);
    };
    _(a.dom, "ln-data-store:ready", o), _(a.dom, "ln-data-store:created", o), _(a.dom, "ln-data-store:updated", o), _(a.dom, "ln-data-store:deleted", o), _(a.dom, "ln-data-store:mutation-error", (E) => a._mutationReceipts.reject(E.detail)), _(a.dom, "ln-data-store:synced", (E) => {
      var C;
      (C = E.detail) != null && C.changed && a._refreshAll(E.detail.meta, !1);
    }), _(a.dom, "ln-search:change", (E) => {
      var T;
      E.preventDefault();
      const C = ((T = E.detail) == null ? void 0 : T.term) != null ? E.detail.term : "";
      C !== (a.dom.getAttribute(l) || "") && a.dom.setAttribute(l, C);
    }), _(a.dom, "ln-filter:change", (E) => {
      var N;
      E.preventDefault();
      const C = (N = E.detail) == null ? void 0 : N.key;
      if (!C) return;
      const T = (E.detail.values || []).slice(), x = a._currentQuery().filters, I = x[C];
      if (I ? I.length === T.length && I.every((F, H) => F === T[H]) : !T.length) return;
      T.length ? x[C] = T : delete x[C];
      const q = new URLSearchParams();
      Object.keys(x).forEach((F) => x[F].forEach((H) => q.append(F, H)));
      const D = q.toString();
      D ? a.dom.setAttribute(p, D) : a.dom.removeAttribute(p);
    }), _(a.dom, "ln-sort:change", (E) => {
      var q, D;
      E.preventDefault();
      const C = (q = E.detail) == null ? void 0 : q.field, T = (D = E.detail) == null ? void 0 : D.direction, x = C && T && T !== "none" ? { field: C, direction: T } : null, I = a._currentQuery().sort;
      !I && !x || I && x && I.field === x.field && I.direction === x.direction || (x ? (a.dom.setAttribute(m, x.field), a.dom.setAttribute(u, x.direction)) : (a.dom.removeAttribute(m), a.dom.removeAttribute(u)));
    });
    const A = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), w = a.findChildren().connectorEl;
    if (w) {
      const E = v(w);
      A.add(E), _(a.dom, E + ":connected", r);
    }
    const S = () => {
      const E = a.findChildren().store;
      (!E || E.initializationError) && a._refreshAll(null, !1);
    };
    A.forEach((E) => {
      _(a.dom, E + ":fetched", (C) => a._reconcileServerFetch(C.detail)), _(a.dom, E + ":created", (C) => a._reconcileServerMutation("create", C.detail)), _(a.dom, E + ":updated", (C) => a._reconcileServerMutation("update", C.detail)), _(a.dom, E + ":deleted", (C) => a._reconcileServerMutation("ack", C.detail)), _(a.dom, E + ":bulk-deleted", (C) => a._reconcileServerMutation("ack", C.detail)), _(a.dom, E + ":created", S), _(a.dom, E + ":updated", S), _(a.dom, E + ":deleted", S), _(a.dom, E + ":bulk-deleted", S), _(a.dom, E + ":error", (C) => a._reconcileServerMutation("error", C.detail));
    });
  }
  g.prototype._onQueueSend = function(a) {
    this.refreshMapper();
    const i = this.findChildren();
    if (!i.connector || !i.queue) return;
    const _ = a.meta || {}, r = v(i.connectorEl), y = a.idempotencyKey || a.entryId, o = {
      create: () => L(i.connectorEl, r + ":request-create", { data: a.payload, url: _.action || null, idempotencyKey: y, meta: { entryId: a.entryId, queued: !0, op: "create", tempId: _.tempId } }),
      update: () => L(i.connectorEl, r + ":request-update", { id: a.targetId, data: a.payload, expected_version: a.expectedVersion, url: _.action || null, idempotencyKey: y, meta: { entryId: a.entryId, queued: !0, op: "update", id: a.targetId } }),
      delete: () => L(i.connectorEl, r + ":request-delete", { id: a.targetId, idempotencyKey: y, meta: { entryId: a.entryId, queued: !0, op: "delete", id: a.targetId } }),
      "bulk-delete": () => {
        var A;
        return L(i.connectorEl, r + ":request-bulk-delete", { ids: ((A = a.payload) == null ? void 0 : A.ids) || [], idempotencyKey: y, meta: { entryId: a.entryId, queued: !0, op: "bulk-delete", bulkKey: _.bulkKey } });
      }
    };
    o[a.op] && o[a.op]();
  }, g.prototype._onFormSubmit = function(a) {
    const i = a.target;
    if (a.defaultPrevented) return;
    const _ = i.hasAttribute(n) ? i.getAttribute(n) : null;
    if (_ === null || (_ ? !this._owns(_) : i.closest("[" + t + "]") !== this.dom)) return;
    const r = Nn(i);
    if (r !== "POST" && r !== "PUT" && r !== "PATCH") return;
    a.preventDefault();
    const y = je(i);
    delete y._method, delete y._token;
    const o = y.id, A = y.expected_version, w = i.getAttribute("action") || "", S = this.findChildren();
    delete y.id, delete y.expected_version, r === "POST" ? this._fanOutCreate(S, y, w) : this._fanOutUpdate(S, o, y, A, w);
  }, g.prototype._reconcileServerFetch = function(a) {
    if (!a) return;
    const i = a.meta || {}, _ = this.findChildren(), r = a.data;
    this.refreshMapper();
    const y = Array.isArray(r) ? r : (r == null ? void 0 : r.data) || [], o = Array.isArray(r == null ? void 0 : r.deleted) ? r.deleted : [], A = Array.isArray(r) ? Math.floor(Date.now() / 1e3) : (r == null ? void 0 : r.synced_at) ?? (r == null ? void 0 : r.since) ?? Math.floor(Date.now() / 1e3), w = y.map((E) => this.mapper.ingress(E)), S = !_.store || _.store.initializationError;
    if (!(S && !i.kind)) {
      if (!i.kind) return _.store.applySync(w, o, A, { total: a.total, filtered: a.filtered });
      (S ? Promise.resolve(w) : _.store.applyQuery(w, { total: a.total })).then((E) => {
        const C = i.kind;
        C === "table" || C === "list" || C === "chart" ? (L(i.targetEl, "ln-" + C + ":set-loading", { loading: !1 }), L(i.targetEl, "ln-" + C + ":set-data", { data: E, total: a.total ?? E.length, filtered: a.filtered ?? E.length, offset: a.offset, queryGen: i.queryGen }), this._boundDelivered.set(i.targetEl, !0)) : C === "options" ? S ? L(i.targetEl, "ln-options:set-data", { data: E }) : _.store.getAll({}).then((T) => L(i.targetEl, "ln-options:set-data", { data: T.data })) : C === "stat" && L(i.targetEl, "ln-stat:set-count", { count: a.filtered ?? a.total ?? w.length });
      });
    }
  }, g.prototype._reconcileServerMutation = function(a, i) {
    var y;
    if (!i) return;
    const _ = this.findChildren(), r = i.meta || {};
    if (a === "create") {
      if (!i.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), r);
      const o = this.mapper.ingress(i.record);
      (_.storeEl ? this._requestStoreMutation(_, "update", { id: r.tempId, data: o }) : Promise.resolve()).then(() => {
        r.queued && _.queue && L(_.queueEl, "ln-api-queue:resolve-create", { entryId: r.entryId, oldKey: r.tempId, newId: o.id });
      }).catch((A) => this._reportError("create-reconcile", A, r));
    } else if (a === "update") {
      const o = i.record ? this.mapper.ingress(i.record) : null;
      (_.storeEl && o ? this._requestStoreMutation(_, "update", { id: r.id, data: o }) : Promise.resolve()).then(() => {
        r.queued && _.queue && L(_.queueEl, "ln-api-queue:ack", { entryId: r.entryId });
      }).catch((A) => this._reportError("update-reconcile", A, r));
    } else if (a === "ack")
      r.queued && _.queue && L(_.queueEl, "ln-api-queue:ack", { entryId: r.entryId });
    else if (a === "error") {
      const o = i.status || ((y = i.error) == null ? void 0 : y.status) || 0;
      r.kind && r.offset != null && L(r.targetEl, "ln-" + r.kind + ":page-failed", { offset: r.offset }), r.queued && _.queue && L(_.queueEl, "ln-api-queue:nack", { entryId: r.entryId, reason: o === 401 || o === 419 ? "auth" : o === 0 || o >= 500 ? "retry" : "drop" }), _.storeEl && (L(_.storeEl, "ln-data-store:request-sync-failed", { error: i.error || i, status: o }), r.queued || (r.op === "update" && r.snapshot ? L(_.storeEl, "ln-data-store:request-update", { id: r.id, data: r.snapshot }) : r.op === "create" && r.tempId ? L(_.storeEl, "ln-data-store:request-delete", { id: r.tempId }) : r.op === "delete" && r.snapshot && L(_.storeEl, "ln-data-store:request-create", { tempId: r.id, data: r.snapshot }))), this._reportError("connector-error", i.error || i, r);
    }
  }, g.prototype.destroy = function() {
    var a;
    if (this.dom[e]) {
      for (this._destroyed = !0; (a = this._unsubs) != null && a.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function c(a, i) {
    const _ = a[e];
    if (_) {
      if (i === "data-ln-data-coordinator-mapper") _.refreshMapper();
      else if (i === l || i === p || i === m || i === u) {
        if (i === l) {
          const r = a.getAttribute(l) || "";
          a.hasAttribute("data-ln-search") && a.getAttribute("data-ln-search") !== r && a.setAttribute("data-ln-search", r);
        }
        _._queueQueryRefresh();
      }
    }
  }
  B(t, e, g, "ln-data-coordinator", {
    attributes: d
  }), window[e].init = window[e];
})();
const Ao = "ln_api_queue", Eo = 2, tt = "outbox", st = "_queue_meta";
function ct(t, e) {
  return t.error || new Error(e);
}
function Pt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function In(t) {
  return "seq:" + t;
}
function oe(t) {
  return "paused:" + t;
}
function qn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function So(t, e, n) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(n);
}
function Co(t, e, n, l) {
  const p = /* @__PURE__ */ new Map(), m = [], u = [];
  for (const d of t || [])
    p.has(d.chainKey) || p.set(d.chainKey, []), p.get(d.chainKey).push(d);
  return p.forEach((d, h) => {
    d.sort((b, v) => b.seq - v.seq);
    const s = d[0];
    if (!(!s || s.status === "failed")) {
      if (s.status === "inflight" && (s.leaseUntil || 0) > l) {
        u.push({ chainKey: h, at: s.leaseUntil });
        return;
      }
      if ((s.nextAttemptAt || 0) > l) {
        u.push({ chainKey: h, at: s.nextAttemptAt });
        return;
      }
      s.status = "inflight", s.leaseOwner = e, s.leaseUntil = l + n, s.updatedAt = l, m.push(s);
    }
  }), { entries: m, wakeups: u };
}
function To(t, e, n, l, p) {
  const m = [], u = [];
  for (const d of t || []) {
    if (d.entryId === e) {
      u.push(d.entryId);
      continue;
    }
    d.chainKey === n && (d.chainKey = l, d.targetId === n && (d.targetId = l), d.meta && d.meta.id === n && (d.meta.id = l), d.meta && typeof d.meta.action == "string" && (d.meta.action = So(d.meta.action, n, l)), d.updatedAt = p, m.push(d));
  }
  return { changed: m, deleted: u };
}
class ko {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || Ao, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, n) => {
      const l = this.indexedDB.open(this.dbName, Eo);
      l.onupgradeneeded = (p) => {
        const m = p.target.result;
        let u;
        m.objectStoreNames.contains(tt) ? u = p.target.transaction.objectStore(tt) : u = m.createObjectStore(tt, { keyPath: "entryId" }), u.indexNames.contains("by_scope_chain") || u.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), u.indexNames.contains("by_scope_seq") || u.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(st) || m.createObjectStore(st, { keyPath: "key" });
      }, l.onerror = () => n(ct(l, "Queue database open failed")), l.onsuccess = (p) => {
        this._db = p.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, n) => {
      const l = this.indexedDB.deleteDatabase(this.dbName);
      l.onsuccess = () => e(), l.onerror = () => n(ct(l, "Queue database delete failed")), l.onblocked = () => n(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((n) => n ? new Promise((l, p) => {
      const u = n.transaction(tt, "readonly").objectStore(tt).index("by_scope_seq").getAll(Pt(this.keyRange, e));
      u.onsuccess = () => l(u.result || []), u.onerror = () => p(ct(u, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, n) {
    return n = n || {}, this.open().then((l) => l ? new Promise((p, m) => {
      const u = l.transaction([st, tt], "readwrite"), d = u.objectStore(st), h = u.objectStore(tt), s = In(e);
      let b = null;
      const v = (f) => {
        const c = f + 1;
        b = {
          entryId: this.uuid(),
          scope: e,
          chainKey: n.chainKey,
          seq: c,
          op: n.op,
          targetId: n.targetId !== void 0 ? n.targetId : null,
          payload: n.payload,
          expectedVersion: n.expectedVersion !== void 0 ? n.expectedVersion : null,
          meta: n.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, d.put({ key: s, value: c }), h.put(b);
      }, g = d.get(s);
      g.onerror = () => m(ct(g, "Queue sequence read failed")), g.onsuccess = () => {
        const f = g.result;
        if (f && typeof f.value == "number") {
          v(f.value);
          return;
        }
        const c = h.index("by_scope_seq").getAll(Pt(this.keyRange, e));
        c.onerror = () => m(ct(c, "Queue sequence migration failed")), c.onsuccess = () => {
          const a = (c.result || []).reduce((i, _) => Math.max(i, _.seq || 0), 0);
          v(a);
        };
      }, u.oncomplete = () => p(b), u.onerror = () => m(u.error || new Error("Queue enqueue transaction failed")), u.onabort = () => m(u.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, n, l) {
    return this.open().then((p) => p ? new Promise((m, u) => {
      const d = p.transaction(tt, "readwrite"), h = d.objectStore(tt), s = h.index("by_scope_seq").getAll(Pt(this.keyRange, e)), b = this.now();
      let v = { entries: [], wakeups: [] };
      s.onerror = () => u(ct(s, "Queue claim read failed")), s.onsuccess = () => {
        v = Co(s.result || [], n, l, b);
        for (const g of v.entries) h.put(g);
      }, d.oncomplete = () => m(v), d.onerror = () => u(d.error || new Error("Queue claim transaction failed")), d.onabort = () => u(d.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, n) {
    return this._updateEntry(e, n, (l, p) => (p.delete(l.entryId), { status: "acked", entry: l }));
  }
  nack(e, n, l, p) {
    p = p || {};
    const m = p.maxAttempts || 8, u = p.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((d) => d ? new Promise((h, s) => {
      const b = d.transaction([tt, st], "readwrite"), v = b.objectStore(tt), g = b.objectStore(st), f = v.get(n);
      let c = null;
      f.onerror = () => s(ct(f, "Queue nack read failed")), f.onsuccess = () => {
        const a = f.result;
        if (!(!a || a.scope !== e)) {
          if (l === "drop") {
            v.delete(a.entryId), c = { status: "dropped", entry: a };
            return;
          }
          if (qn(a), a.updatedAt = this.now(), l === "auth") {
            a.status = "pending", v.put(a), g.put({ key: oe(e), value: "auth" }), c = { status: "auth", entry: a };
            return;
          }
          if (l === "retry") {
            if (a.attempts = (a.attempts || 0) + 1, a.attempts >= m) {
              a.status = "failed", a.nextAttemptAt = 0, v.put(a), c = { status: "failed", entry: a };
              return;
            }
            const i = u[Math.min(a.attempts - 1, u.length - 1)];
            a.status = "pending", a.nextAttemptAt = this.now() + i, v.put(a), c = { status: "retry", entry: a, delay: i };
          }
        }
      }, b.oncomplete = () => h(c), b.onerror = () => s(b.error || new Error("Queue nack transaction failed")), b.onabort = () => s(b.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, n, l) {
    return this._remapTransaction(e, null, n, l);
  }
  resolveCreate(e, n, l, p) {
    return this._remapTransaction(e, n, l, p);
  }
  _remapTransaction(e, n, l, p) {
    return this.open().then((m) => m ? new Promise((u, d) => {
      const h = m.transaction(tt, "readwrite"), s = h.objectStore(tt), b = s.index("by_scope_seq").getAll(Pt(this.keyRange, e));
      let v = { changed: [], deleted: [] };
      b.onerror = () => d(ct(b, "Queue remap read failed")), b.onsuccess = () => {
        v = To(b.result || [], n, l, p, this.now());
        for (const g of v.deleted) s.delete(g);
        for (const g of v.changed) s.put(g);
      }, h.oncomplete = () => u(v.changed), h.onerror = () => d(h.error || new Error("Queue remap transaction failed")), h.onabort = () => d(h.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((n) => n ? new Promise((l, p) => {
      const m = n.transaction(tt, "readwrite"), u = m.objectStore(tt), d = u.index("by_scope_seq").getAll(Pt(this.keyRange, e));
      let h = 0;
      d.onerror = () => p(ct(d, "Queue failed-entry read failed")), d.onsuccess = () => {
        for (const s of d.result || [])
          s.status === "failed" && (s.status = "pending", s.attempts = 0, s.nextAttemptAt = 0, s.updatedAt = this.now(), qn(s), u.put(s), h++);
      }, m.oncomplete = () => l(h), m.onerror = () => p(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => p(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((n) => n ? new Promise((l, p) => {
      const u = n.transaction(st, "readonly").objectStore(st).get(oe(e));
      u.onsuccess = () => {
        const d = u.result ? u.result.value : !1;
        l(d || !1);
      }, u.onerror = () => p(ct(u, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, n) {
    return this.open().then((l) => {
      if (l)
        return new Promise((p, m) => {
          const u = l.transaction(st, "readwrite"), d = typeof n == "string" ? n : n ? "manual" : !1;
          u.objectStore(st).put({ key: oe(e), value: d }), u.oncomplete = () => p(), u.onerror = () => m(u.error || new Error("Queue pause-state write failed")), u.onabort = () => m(u.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((n) => {
      if (n)
        return new Promise((l, p) => {
          const m = n.transaction([tt, st], "readwrite"), d = m.objectStore(tt).index("by_scope_seq").openCursor(Pt(this.keyRange, e));
          d.onsuccess = (h) => {
            const s = h.target.result;
            s && (s.delete(), s.continue());
          }, d.onerror = () => p(ct(d, "Queue clear failed")), m.objectStore(st).delete(In(e)), m.objectStore(st).delete(oe(e)), m.oncomplete = () => l(), m.onerror = () => p(m.error || new Error("Queue clear transaction failed")), m.onabort = () => p(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, n, l) {
    return this.open().then((p) => p ? new Promise((m, u) => {
      const d = p.transaction(tt, "readwrite"), h = d.objectStore(tt), s = h.get(n);
      let b = null;
      s.onerror = () => u(ct(s, "Queue entry read failed")), s.onsuccess = () => {
        const v = s.result;
        !v || v.scope !== e || (b = l(v, h));
      }, d.oncomplete = () => m(b), d.onerror = () => u(d.error || new Error("Queue entry transaction failed")), d.onabort = () => u(d.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", n = [2e3, 5e3, 15e3, 6e4, 3e5], l = 8, p = 6e4;
  if (window[e] !== void 0) return;
  function m(s) {
    const b = s[e];
    b && b._drain();
  }
  const u = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: m, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, d = new ko({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: _t
  });
  function h(s) {
    this.dom = s, s[e] = this;
    const b = s.closest("[data-ln-data-coordinator]");
    this.scope = s.id || (b ? b.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = _t(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const v = this;
    return d.open().then((g) => g ? d.getPaused(v.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((g) => {
      if (v._paused = !!g, v._paused) {
        const f = typeof g == "string" ? g : "auth";
        L(v.dom, "ln-api-queue:paused", { reason: f, restored: !0 });
      }
      return v._emitPendingCount();
    }).then(() => v._drain()).catch((g) => {
      console.error("[ln-api-queue] Initialization failed:", g), L(v.dom, "ln-api-queue:error", { operation: "initialize", error: g });
    }), this;
  }
  h.prototype._isOnline = function() {
    const s = this.dom.getAttribute("data-ln-api-queue-online");
    return s === "true" ? !0 : s === "false" ? !1 : navigator.onLine;
  }, h.prototype._emitPendingCount = function() {
    const s = this;
    return d.allForScope(s.scope).then((b) => (L(s.dom, "ln-api-queue:pending-count", { count: b.length, scope: s.scope }), b.length === 0 && L(s.dom, "ln-api-queue:drained", { scope: s.scope }), b));
  }, h.prototype._clearTimer = function(s) {
    const b = this._timers.get(s);
    b && (clearTimeout(b), this._timers.delete(s));
  }, h.prototype._scheduleTimer = function(s, b) {
    const v = Math.max(0, b), g = this._timers.get(s);
    g && clearTimeout(g);
    const f = this, c = setTimeout(() => {
      f._timers.delete(s), f._drain();
    }, v);
    this._timers.set(s, c);
  }, h.prototype._drain = function() {
    const s = this;
    return s._paused || !s._isOnline() ? Promise.resolve() : (s._drainPromise || (s._drainPromise = d.claimReady(s.scope, s._workerId, p).then((b) => {
      for (const v of b.wakeups)
        s._scheduleTimer(v.chainKey, v.at - Date.now());
      for (const v of b.entries)
        s._clearTimer(v.chainKey), L(s.dom, "ln-api-queue:send", {
          entryId: v.entryId,
          chainKey: v.chainKey,
          op: v.op,
          targetId: v.targetId,
          payload: v.payload,
          expectedVersion: v.expectedVersion,
          idempotencyKey: v.entryId,
          meta: v.meta
        });
    }).catch((b) => {
      console.error("[ln-api-queue] Drain failed:", b), L(s.dom, "ln-api-queue:error", { operation: "drain", error: b });
    }).finally(() => {
      s._drainPromise = null;
    })), s._drainPromise);
  }, h.prototype._onEnqueue = function(s) {
    const b = this;
    return d.enqueue(b.scope, s.detail || {}).then((v) => {
      if (v)
        return b._emitPendingCount().then((g) => (L(b.dom, "ln-api-queue:enqueued", {
          entryId: v.entryId,
          chainKey: v.chainKey,
          count: g.length
        }), b._drain()));
    }).catch((v) => {
      L(b.dom, "ln-api-queue:error", { operation: "enqueue", error: v });
    });
  }, h.prototype._onAck = function(s) {
    const b = this, v = s.detail || {};
    return d.ack(b.scope, v.entryId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      L(b.dom, "ln-api-queue:error", { operation: "ack", entryId: v.entryId, error: g });
    });
  }, h.prototype._onNack = function(s) {
    const b = this, v = s.detail || {};
    return d.nack(b.scope, v.entryId, v.reason, {
      maxAttempts: l,
      backoff: n
    }).then((g) => {
      if (g)
        return g.status === "failed" ? L(b.dom, "ln-api-queue:failed", {
          entryId: g.entry.entryId,
          chainKey: g.entry.chainKey,
          attempts: g.entry.attempts
        }) : g.status === "retry" ? b._scheduleTimer(g.entry.chainKey, g.delay) : g.status === "auth" && (b._paused = !0, L(b.dom, "ln-api-queue:paused", { reason: "auth" }), L(b.dom, "ln-api-queue:auth-required", {
          entryId: g.entry.entryId,
          chainKey: g.entry.chainKey
        })), b._emitPendingCount().then(() => {
          if (g.status === "dropped") return b._drain();
        });
    }).catch((g) => {
      L(b.dom, "ln-api-queue:error", { operation: "nack", entryId: v.entryId, error: g });
    });
  }, h.prototype._onRemap = function(s) {
    const b = this, v = s.detail || {};
    return d.remap(b.scope, v.oldKey, v.newId).catch((g) => {
      L(b.dom, "ln-api-queue:error", { operation: "remap", error: g });
    });
  }, h.prototype._onResolveCreate = function(s) {
    const b = this, v = s.detail || {};
    return d.resolveCreate(b.scope, v.entryId, v.oldKey, v.newId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      L(b.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: v.entryId,
        error: g
      });
    });
  }, h.prototype._onResume = function() {
    const s = this;
    return d.setPaused(s.scope, !1).then(() => (s._paused = !1, L(s.dom, "ln-api-queue:resumed", {}), s._drain())).catch((b) => {
      L(s.dom, "ln-api-queue:error", { operation: "resume", error: b });
    });
  }, h.prototype._onPause = function() {
    const s = this;
    return d.setPaused(s.scope, "manual").then(() => {
      s._paused = !0, L(s.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((b) => {
      L(s.dom, "ln-api-queue:error", { operation: "pause", error: b });
    });
  }, h.prototype._onDrain = function() {
    const s = this;
    return d.resetFailed(s.scope).then(() => {
      const b = s._drainPromise;
      return b ? b.then(() => s._drain()) : s._drain();
    }).catch((b) => {
      L(s.dom, "ln-api-queue:error", { operation: "manual-drain", error: b });
    });
  }, h.prototype._onClear = function() {
    const s = this;
    return s._timers.forEach((b) => clearTimeout(b)), s._timers.clear(), d.clear(s.scope).then(() => {
      s._paused = !1, L(s.dom, "ln-api-queue:pending-count", { count: 0, scope: s.scope }), L(s.dom, "ln-api-queue:drained", { scope: s.scope });
    }).catch((b) => {
      L(s.dom, "ln-api-queue:error", { operation: "clear", error: b });
    });
  }, h.prototype._bindEvents = function() {
    const s = this;
    s._handlers = {
      enqueue: (b) => s._onEnqueue(b),
      ack: (b) => s._onAck(b),
      nack: (b) => s._onNack(b),
      remap: (b) => s._onRemap(b),
      resolveCreate: (b) => s._onResolveCreate(b),
      resume: () => s._onResume(),
      pause: () => s._onPause(),
      drain: () => s._onDrain(),
      clear: () => s._onClear()
    }, s.dom.addEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.addEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.addEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.addEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.addEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.addEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.addEventListener("ln-api-queue:request-pause", s._handlers.pause), s.dom.addEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.addEventListener("ln-api-queue:request-clear", s._handlers.clear);
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const s = this;
    s.dom.removeEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.removeEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.removeEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.removeEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.removeEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.removeEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.removeEventListener("ln-api-queue:request-pause", s._handlers.pause), s.dom.removeEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.removeEventListener("ln-api-queue:request-clear", s._handlers.clear), window.removeEventListener("online", s._onlineHandler), s._timers.forEach((b) => clearTimeout(b)), s._timers.clear(), delete s.dom[e];
  }, B(t, e, h, "ln-api-queue", {
    attributes: u
  });
})();
function Di(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Bt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Lo(t, e, n) {
  const l = Di(t);
  return l === null || l < 0 ? 0 : Math.min(l, Math.min(e, n) / 2);
}
function xo(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((n) => !Number.isFinite(n)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Io(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), n = e[0].trim();
  return n ? {
    field: n,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function qo(t, e) {
  e = e || {};
  const n = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, l = e.xField || "label", p = e.yField || "value", m = e.includeZero !== !1, u = Lo(e.padding, n.width, n.height), d = Array.isArray(t) ? t : [], h = [];
  for (let o = 0; o < d.length; o++) {
    const A = d[o] || {}, w = Di(A[p]);
    w !== null && h.push({
      record: A,
      sourceIndex: o,
      label: A[l] == null ? String(o + 1) : String(A[l]),
      value: w
    });
  }
  if (h.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: n.y + n.height - u
    };
  let s = h[0].value, b = h[0].value;
  for (let o = 1; o < h.length; o++)
    h[o].value < s && (s = h[o].value), h[o].value > b && (b = h[o].value);
  let v = s, g = b;
  m && (v = Math.min(0, v), g = Math.max(0, g)), v === g && (g === 0 ? g = 1 : g > 0 ? v = 0 : g = 0);
  const f = Math.max(1, n.width - u * 2), c = Math.max(1, n.height - u * 2), a = g - v, i = n.y + n.height - u - (0 - v) / a * c, _ = [];
  for (let o = 0; o < h.length; o++) {
    const A = h[o], w = h.length === 1 ? 0.5 : o / (h.length - 1), S = n.x + u + w * f, E = n.y + n.height - u - (A.value - v) / a * c;
    _.push({
      record: A.record,
      sourceIndex: A.sourceIndex,
      label: A.label,
      value: A.value,
      x: S,
      y: E,
      pointString: Bt(S) + "," + Bt(E)
    });
  }
  const r = _.map((o) => o.pointString).join(" ");
  let y = "";
  if (_.length > 0) {
    const o = _[0], A = _[_.length - 1], w = Bt(o.x) + "," + Bt(i), S = Bt(A.x) + "," + Bt(i);
    y = w + " " + r + " " + S;
  }
  return {
    points: _,
    linePoints: r,
    areaPoints: y,
    count: _.length,
    min: s,
    max: b,
    domainMin: v,
    domainMax: g,
    baselineY: i
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", n = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function l(s) {
    const b = s[e];
    b && b.requestData();
  }
  function p(s) {
    const b = s[e];
    b && b._render();
  }
  const m = {
    "data-ln-chart": { prop: "name", type: "string", read: K, fallback: "", effect: p, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: l, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: l, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: p, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: p, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: p, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: p, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: p, description: "Forces Y axis scale to start at zero" }
  }, u = Y(m);
  function d(s, b) {
    s && (s.textContent = b);
  }
  function h(s) {
    this.dom = s, X(this, s, u), this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const b = this;
    return this._onSetData = function(v) {
      const g = v.detail || {};
      b._data = Array.isArray(g.data) ? g.data : [], b.isLoaded = !0, b._setLoading(!1), b._render();
    }, this._onSetLoading = function(v) {
      b._setLoading(!!(v.detail && v.detail.loading));
    }, this._onRefresh = function() {
      b.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  h.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), b = s === null ? NaN : Number(s), v = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(b) && b >= 0 ? b : 16,
      type: v === "area" || v === "polygon" ? "area" : "line",
      viewBox: this.plot && xo(this.plot.getAttribute("viewBox")) || n
    };
  }, h.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, h.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const b = this.name + "-label", v = '[data-ln-template="' + b + '"]';
    if (!this.dom.querySelector(v) && !document.querySelector(v)) return;
    const g = et(this.dom, b, "ln-chart");
    if (!g) return;
    const f = J(this.dom);
    for (const c of s.points) {
      const a = g.cloneNode(!0);
      Yt(a, {
        label: c.label,
        value: rt(c.value, f)
      }), this.labels.appendChild(a);
    }
  }, h.prototype._render = function() {
    const s = this._readOptions(), b = qo(this._data, s);
    this.model = b, this.line && (this.line.setAttribute("points", b.linePoints), this.line.toggleAttribute("hidden", b.count === 0)), this.area && (this.area.setAttribute("points", b.areaPoints), this.area.toggleAttribute("hidden", b.count === 0 || s.type !== "area"));
    const v = b.count === 0;
    this.dom.classList.toggle("ln-chart--empty", v), this.empty && this.empty.toggleAttribute("hidden", !v);
    const g = J(this.dom);
    d(this.minimum, rt(b.min, g)), d(this.maximum, rt(b.max, g)), d(this.count, rt(b.count, g)), this._renderLabels(b), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: b.count,
      min: b.min,
      max: b.max
    });
  }, h.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Io(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, B(t, e, h, "ln-chart", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-options": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: K, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: K, fallback: "name", description: "Field name used for option visible label text" }
  }, l = Y(n);
  function p(m) {
    this.dom = m, X(this, m, l);
    const u = this;
    return this._onSetData = function(d) {
      d.detail && u._rebuild(d.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), L(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  p.prototype._rebuild = function(m) {
    const u = this.dom, d = this._valueField, h = this._labelField, s = u.getAttribute("data-ln-value") || u.value, b = u.querySelectorAll("option");
    for (let g = b.length - 1; g >= 0; g--)
      b[g].value !== "" && u.removeChild(b[g]);
    for (let g = 0; g < m.length; g++) {
      const f = m[g], c = document.createElement("option");
      c.value = String(f[d]), c.textContent = f[h] != null ? f[h] : "", u.appendChild(c);
    }
    const v = u.options;
    for (let g = 0; g < v.length; g++)
      if (v[g].value === String(s)) {
        u.value = String(s);
        break;
      }
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, B(t, e, p, "ln-options", {
    attributes: n
  });
})();
function Ro(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const n = t.slice(0, e).trim(), l = t.slice(e + 1).trim();
  if (!n) return null;
  const p = {};
  return p[n] = [l], p;
}
function Do(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: K, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, l = Y(n);
  function p(m) {
    return this.dom = m, X(this, m, l), this._onSetCount = function(u) {
      m.textContent = Do(u.detail && u.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), L(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Ro(this._filterRaw)
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, B(t, e, p, "ln-stat", {
    attributes: n
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", n = "#ln-icon-custom-", l = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let m = null;
  const u = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), d = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), h = "lni:", s = "lni:v", b = "1";
  function v() {
    try {
      if (localStorage.getItem(s) !== b) {
        for (let r = localStorage.length - 1; r >= 0; r--) {
          const y = localStorage.key(r);
          y && y.indexOf(h) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(s, b);
      }
    } catch {
    }
  }
  v();
  function g() {
    return m || (m = document.getElementById(t), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = t, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function f(r) {
    return r.indexOf(n) === 0 ? d + "/" + r.slice(n.length) + ".svg" : u + "/" + r.slice(e.length) + ".svg";
  }
  function c(r, y) {
    const o = y.match(/viewBox="([^"]+)"/), A = o ? o[1] : "0 0 24 24", w = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), S = w ? w[1].trim() : "", E = y.match(/<svg([^>]*)>/i), C = E ? E[1] : "", T = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    T.id = r, T.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const I = C.match(new RegExp(x + '="([^"]*)"'));
      I && T.setAttribute(x, I[1]);
    }), T.innerHTML = S, g().querySelector("defs").appendChild(T);
  }
  function a(r) {
    if (l.has(r) || p.has(r)) return;
    if (r.indexOf(n) === 0 && !d) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", r);
      return;
    }
    const y = r.slice(1);
    try {
      const A = localStorage.getItem(h + y);
      if (A) {
        c(y, A), l.add(r);
        return;
      }
    } catch {
    }
    p.add(r);
    const o = f(r);
    fetch(o).then(function(A) {
      if (!A.ok) throw new Error(A.status);
      return A.text();
    }).then(function(A) {
      c(y, A), l.add(r), p.delete(r);
      try {
        localStorage.setItem(h + y, A);
      } catch {
      }
    }).catch(function(A) {
      console.error("[ln-icon] Fetch failed for:", y, A), p.delete(r);
    });
  }
  function i(r) {
    const y = 'use[href^="' + e + '"], use[href^="' + n + '"]', o = r.querySelectorAll ? r.querySelectorAll(y) : [];
    if (r.matches && r.matches(y)) {
      const A = r.getAttribute("href");
      A && a(A);
    }
    Array.prototype.forEach.call(o, function(A) {
      const w = A.getAttribute("href");
      w && a(w);
    });
  }
  function _() {
    i(document), ft(function() {
      Jt({
        query: 'use[href^="#ln-icon-"]',
        onInit: function(r) {
          i(r);
        }
      }), qt(["href"], function(r) {
        if ((r.tagName ? r.tagName.toLowerCase() : "") === "use") {
          const o = r.getAttribute("href");
          o && (o.indexOf(e) === 0 || o.indexOf(n) === 0) && a(o);
        }
      });
    }, "ln-icon");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
const nn = /* @__PURE__ */ new Set([
  "data-ln-accordion",
  "data-ln-ajax",
  "data-ln-api-base-url",
  "data-ln-api-connector",
  "data-ln-api-connector-query-debounce",
  "data-ln-api-endpoint",
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
  "data-ln-connector",
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-connector",
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
  "data-ln-data-store-seed",
  "data-ln-data-store-stale",
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
  "data-ln-external-links-hint",
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
  "data-ln-filter-target",
  "data-ln-filter-value",
  "data-ln-filter-values",
  "data-ln-fluid",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
  "data-ln-hash",
  "data-ln-include",
  "data-ln-initial-value",
  "data-ln-item",
  "data-ln-item-action",
  "data-ln-item-id",
  "data-ln-item-select",
  "data-ln-key",
  "data-ln-key-allow-input",
  "data-ln-key-for",
  "data-ln-key-map",
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
  "data-ln-query",
  "data-ln-render-key",
  "data-ln-repeater",
  "data-ln-repeater-add",
  "data-ln-repeater-add-for",
  "data-ln-repeater-item",
  "data-ln-repeater-list",
  "data-ln-repeater-max",
  "data-ln-repeater-min",
  "data-ln-repeater-reindex",
  "data-ln-repeater-remove",
  "data-ln-route",
  "data-ln-route-keep",
  "data-ln-route-target",
  "data-ln-route-title",
  "data-ln-router-base",
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
  "data-ln-table-loading",
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
  "data-ln-translations-dict",
  "data-ln-translations-lang",
  "data-ln-translations-locales",
  "data-ln-translations-menu",
  "data-ln-translations-placeholder",
  "data-ln-translations-prefix",
  "data-ln-translations-remove-label",
  "data-ln-ui-coordinator",
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
function Oo(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const n = [];
  for (let l = 0; l <= e.length; l++) n[l] = [l];
  for (let l = 0; l <= t.length; l++) n[0][l] = l;
  for (let l = 1; l <= e.length; l++)
    for (let p = 1; p <= t.length; p++)
      e.charAt(l - 1) === t.charAt(p - 1) ? n[l][p] = n[l - 1][p - 1] : n[l][p] = Math.min(
        n[l - 1][p - 1] + 1,
        n[l][p - 1] + 1,
        n[l - 1][p] + 1
      );
  return n[e.length][t.length];
}
function No(t, e = nn) {
  if (e.has(t)) return null;
  let n = null, l = 1 / 0;
  const p = Math.max(3, Math.floor(t.length * 0.4));
  for (const m of e) {
    if (Math.abs(t.length - m.length) > 3 || Math.abs(t.length - m.length) >= l) continue;
    const u = Oo(t, m);
    u < l && (l = u, n = m);
  }
  return l <= p ? n : null;
}
function Oi(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Mo(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const l = [], p = [n, ...n.querySelectorAll("*")];
  for (let m = 0; m < p.length; m++) {
    const u = p[m];
    if (u.attributes)
      for (let d = 0; d < u.attributes.length; d++) {
        const h = u.attributes[d];
        if (h.name.startsWith("data-ln-") && h.name.endsWith("-for")) {
          const s = (h.value || "").trim();
          if (!s) {
            l.push({
              type: "id-empty",
              element: u,
              attribute: h.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${u.tagName.toLowerCase()} ${h.name}="">.`
            });
            continue;
          }
          e.getElementById(s) || e.querySelector("#" + Oi(s)) || l.push({
            type: "id-unresolved",
            element: u,
            attribute: h.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${u.tagName.toLowerCase()} ${h.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return l;
}
function Fo(t = document) {
  const e = t.ownerDocument || t, n = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!n) return [];
  const l = [], p = [n, ...n.querySelectorAll("*")];
  for (let m = 0; m < p.length; m++) {
    const u = p[m];
    if (u.attributes)
      for (let d = 0; d < u.attributes.length; d++) {
        const h = u.attributes[d];
        if (h.name.startsWith("data-ln-") && (h.name.endsWith("-source") || h.name.endsWith("-store")) && h.name !== "data-ln-data-store") {
          const b = (h.value || "").trim();
          if (!b) {
            l.push({
              type: "store-empty",
              element: u,
              attribute: h.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${u.tagName.toLowerCase()} ${h.name}="">.`
            });
            continue;
          }
          const v = Oi(b), g = e.querySelector(`[data-ln-data-store="${v}"], [data-ln-store="${v}"]`), f = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(b);
          !g && !f && l.push({
            type: "store-unresolved",
            element: u,
            attribute: h.name,
            storeName: b,
            message: `[ln-debug] Unresolved store reference: <${u.tagName.toLowerCase()} ${h.name}="${b}"> targets store "${b}", but no [data-ln-data-store="${b}"] exists in the document.`
          });
        }
      }
  }
  return l;
}
function Po(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const n = [], l = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && l.unshift(e);
  const p = /* @__PURE__ */ new Map();
  for (let m = 0; m < l.length; m++) {
    const u = l[m], d = (u.getAttribute("data-ln-data-store") || "").trim();
    d && (p.has(d) || p.set(d, []), p.get(d).push(u));
  }
  for (const [m, u] of p.entries())
    u.length > 1 && n.push({
      type: "store-duplicate",
      storeName: m,
      elements: u,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${m}". Store names must be unique across the document.`
    });
  return n;
}
function Bo(t = typeof document < "u" ? document : null, e = nn) {
  const n = t && (t.nodeType === 9 ? t.body || t.documentElement : t);
  if (!n) return [];
  const l = [], p = [n, ...n.querySelectorAll("*")];
  for (let m = 0; m < p.length; m++) {
    const u = p[m];
    if (u.attributes)
      for (let d = 0; d < u.attributes.length; d++) {
        const h = u.attributes[d];
        if (!h.name.startsWith("data-ln-") || e.has(h.name)) continue;
        const s = No(h.name, e);
        l.push({
          type: "attribute-unknown",
          element: u,
          attribute: h.name,
          suggestion: s,
          message: `[ln-debug] Unknown attribute "${h.name}" on <${u.tagName.toLowerCase()}>.${s ? ` Did you mean "${s}"?` : ""}`
        });
      }
  }
  return l;
}
function He(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const n = e.validAttributes || nn, l = Mo(t), p = Fo(t), m = Po(t), u = Bo(t, n), d = [
    ...l,
    ...p,
    ...m,
    ...u
  ];
  if (!e.silent)
    for (let h = 0; h < d.length; h++)
      console.warn(d[h].message);
  return {
    idIssues: l,
    storeIssues: p,
    uniquenessIssues: m,
    spellingIssues: u,
    total: d.length
  };
}
let Le = null;
function se(t = typeof document < "u" ? document : null, e = 50, n = null) {
  if (!t || !pe()) return;
  clearTimeout(Le);
  const l = () => {
    Le = setTimeout(() => {
      Le = null;
      const p = He(t);
      n && n(p);
    }, e);
  };
  if (jn() > 0) return ut(l);
  l();
}
function Ho(t, e, n, l) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", n), console.log("detail", l), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", n), console.log("old → new", l.oldValue, "→", l.newValue), console.groupEnd());
}
let Lt = [];
function Uo() {
  Lt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Lt.push(document.body);
}
function Ni(t) {
  if (t === window || t === document)
    return Lt.indexOf(document.body) !== -1;
  for (let e = 0; e < Lt.length; e++)
    if (Lt[e].contains(t)) return !0;
  return !1;
}
function zo(t, e, n, l) {
  Ni(n) && Ho(t, e, n, l);
}
function Ue() {
  Uo(), Ki(Lt.length > 0 ? zo : null, Lt.length > 0 ? Ni : null);
}
function Rn() {
  Ue();
}
function Ko() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ft(function() {
    Ue(), qt(["data-ln-debug"], Ue);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const n = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Ko();
  function l(m) {
    return this.dom = m, se(m), Rn(), this;
  }
  l.prototype.verify = function(m, u) {
    return He(m || (this.dom ? this.dom.ownerDocument || this.dom : document), u);
  }, l.prototype.destroy = function() {
    delete this.dom[e], Rn();
  };
  const p = B(t, e, l, "ln-debug", {
    attributes: n,
    onInit: (m) => se(m),
    onSubtreeChange: (m) => se(m)
  });
  p.verify = function(m, u) {
    return He(m || document, u);
  }, p.schedule = function(m, u, d) {
    return se(m || document, u, d);
  };
})();
