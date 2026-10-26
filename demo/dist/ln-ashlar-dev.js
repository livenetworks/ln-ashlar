function L() {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink) return !0;
  if (typeof document < "u") {
    if (document.documentElement && document.documentElement.hasAttribute("data-ln-debug")) return !0;
    if (document.body)
      return document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null;
  }
  return !1;
}
function O(e) {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0) return !0;
  if (window.lnCore && window.lnCore._debugIsContained)
    return e ? window.lnCore._debugIsContained(e) : window.lnCore._debugSink !== null;
  if (e && e.closest) {
    const t = e.closest("[data-ln-debug]");
    return !(!t || typeof document < "u" && t === document.documentElement);
  }
  return typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") : !1;
}
if (typeof window < "u" && (window.lnCore = window.lnCore || {}, !window.lnCore._warnBound)) {
  window.lnCore._warnBound = !0;
  const e = console.warn;
  console.warn = function(...t) {
    if (typeof t[0] == "string" && (t[0].startsWith("[ln-") || t[0].startsWith("[lnCore"))) {
      let a = null;
      for (let l = 1; l < t.length; l++)
        if (t[l] && t[l].nodeType === 1) {
          a = t[l];
          break;
        }
      if (!O(a))
        return;
    }
    e.apply(console, t);
  };
}
function be(e, t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = e, window.lnCore._debugIsContained = t || null;
}
function me(e, t, n) {
  const a = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", t, e, a), e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    detail: a
  }));
}
function b(e, t) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      b(e, t);
    }), console.warn("[" + t + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  e();
}
function ge(e) {
  const t = e.querySelector('input[name="_method"]');
  return ((t && t.value !== "" ? t.value : e.method) || "").toUpperCase();
}
function ye(e, t) {
  const n = !!(t && t.typed), a = t && t.exclude, l = {}, i = e.elements, r = {};
  if (n)
    for (let d = 0; d < i.length; d++) {
      const o = i[d];
      o.name && o.type === "checkbox" && !o.disabled && (r[o.name] = (r[o.name] || 0) + 1);
    }
  for (let d = 0; d < i.length; d++) {
    const o = i[d];
    if (!(!o.name || o.disabled || o.type === "file" || o.type === "submit" || o.type === "button") && !(a && o.matches && o.matches(a)))
      if (o.type === "checkbox")
        n && r[o.name] === 1 ? l[o.name] = o.checked : (l[o.name] || (l[o.name] = []), o.checked && l[o.name].push(o.value));
      else if (o.type === "radio")
        o.checked && (l[o.name] = o.value);
      else if (o.type === "select-multiple") {
        l[o.name] = [];
        for (let s = 0; s < o.options.length; s++)
          o.options[s].selected && l[o.name].push(o.options[s].value);
      } else if (n && o.type === "hidden")
        l[o.name] = o.value;
      else if (n && (o.type === "number" || o.type === "range")) {
        const s = Number(o.value);
        l[o.name] = o.value === "" || isNaN(s) ? null : s;
      } else
        l[o.name] = o.value;
  }
  return l;
}
function Ce(e) {
  if (typeof e != "string") return !!e;
  const t = e.trim().toLowerCase();
  return t !== "false" && t !== "0" && t !== "" && t !== "off" && t !== "no";
}
function Ae(e, t) {
  const n = e.elements, a = [], l = {};
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    r.name && r.type === "checkbox" && (l[r.name] = (l[r.name] || 0) + 1);
  }
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    if (r.type === "file" || r.type === "submit" || r.type === "button") continue;
    const d = r.getAttribute("data-ln-fill-as") || r.name;
    if (!d || !(d in t)) continue;
    const o = t[d];
    if (r.type === "checkbox") {
      if (Array.isArray(o))
        r.checked = o.indexOf(r.value) !== -1;
      else if (l[r.name] > 1) {
        const s = String(o).split(",").map(function(c) {
          return c.trim();
        });
        r.checked = s.indexOf(r.value) !== -1;
      } else
        r.checked = Ce(o);
      a.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(o), a.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(o))
        for (let s = 0; s < r.options.length; s++)
          r.options[s].selected = o.indexOf(r.options[s].value) !== -1;
      a.push(r);
    } else
      r.value = o, r.tagName === "SELECT" && o != null && r.setAttribute("data-ln-value", o), a.push(r);
  }
  return a;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = Ae, window.lnCore.serializeForm = ye, window.lnCore.resolveFormMethod = ge);
const H = {};
function ve(e, t) {
  H[e] = t;
}
function Se(e) {
  return H[e] || { ingress: (t) => t, egress: (t) => t };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ve, window.lnCore.getDataMapper = Se);
function xe() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, b(function() {
    new MutationObserver(function() {
      me(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const z = {};
function ke(e, t) {
  if (!e || typeof t != "object") return;
  const n = e.toLowerCase().split("-")[0];
  z[n] = t;
}
function _e(e) {
  if (!e) return null;
  const t = e.toLowerCase().split("-")[0];
  return z[t] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = ke, window.lnCore.getLocaleFallback = _e, window.lnCore.ensureLocaleObserver = xe);
const _ = {};
function Ee(e, t) {
  _[e] || (_[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const n = _[e];
  return n ? n.content.cloneNode(!0) : (console.warn("[" + (t || "ln-core") + '] Template "' + e + '" not found'), null);
}
function G(e, t) {
  if (!e || !t) return e;
  const n = e.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < n.length; r++) {
    const d = n[r], o = d.getAttribute("data-ln-field");
    t[o] != null && (d.textContent = t[o]);
  }
  const a = e.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < a.length; r++) {
    const d = a[r], o = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      t[f] != null && d.setAttribute(u, t[f]);
    }
  }
  const l = e.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < l.length; r++) {
    const d = l[r], o = d.getAttribute("data-ln-show");
    o in t && d.classList.toggle("hidden", !t[o]);
  }
  const i = e.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < i.length; r++) {
    const d = i[r], o = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in t && d.classList.toggle(u, !!t[f]);
    }
  }
  return e;
}
function De(e, t) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", e, t ?? null), e.dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 })));
  const n = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let a = 0; a < n.length; a++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", n[a], t ?? null), n[a].dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 }));
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(e) {
  if (!(!e.target.matches || !e.target.matches("[data-ln-fillable]")))
    if (e.detail)
      G(e.target, e.detail);
    else {
      const t = e.target.querySelectorAll("[data-ln-field]");
      for (let n = 0; n < t.length; n++)
        t[n].textContent = "";
    }
})));
function Q(e, t) {
  if (!e || !t) return e;
  const n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (; n.nextNode(); ) {
    const i = n.currentNode;
    i.textContent.indexOf("{{") !== -1 && (i.textContent = i.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(r, d) {
        return t[d] !== void 0 ? t[d] : "";
      }
    ));
  }
  const a = function(i, r) {
    return t[r] !== void 0 ? t[r] : "";
  }, l = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && l.push(e);
  for (let i = 0; i < l.length; i++) {
    const r = l[i], d = r.attributes;
    for (let o = 0; o < d.length; o++) {
      const s = d[o];
      s.value.indexOf("{{") !== -1 && r.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return e;
}
function Ie(e, t, n, a, l, i) {
  const r = {};
  for (let o = 0; o < e.children.length; o++) {
    const s = e.children[o], c = s.getAttribute("data-ln-render-key");
    c && (r[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let o = 0; o < t.length; o++) {
    const s = t[o], c = String(a(s));
    let u = r[c];
    if (u)
      l(u, s, o);
    else {
      const f = Ee(n, i);
      if (!f || (Q(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), l(u, s, o);
    }
    d.appendChild(u);
  }
  e.textContent = "", e.appendChild(d);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Q, window.lnCore.fill = G, window.lnCore.lnFill = De, window.lnCore.renderList = Ie);
function I(e, t, n) {
  const a = e.getAttribute(t);
  return a === null ? n : a;
}
function J(e, t, n) {
  const a = parseInt(e.getAttribute(t), 10);
  return isNaN(a) ? n : a;
}
function K(e, t, n = !1) {
  const a = e.getAttribute(t);
  if (a === null) return !!n;
  const l = a.trim().toLowerCase();
  return !(l === "false" || l === "0");
}
function P(e, t) {
  return (e.getAttribute(t) || "").split(",").map((n) => n.trim()).filter(Boolean);
}
const E = /* @__PURE__ */ new Map();
function X(e, t) {
  const n = (e ? e.join("|") : "") + "::" + t;
  if (E.has(n)) return E.get(n);
  const a = new Set(e || []), l = function(i, r) {
    const d = i.getAttribute(r);
    return d !== null && a.has(d) ? d : t;
  };
  return E.set(n, l), l;
}
function Y(e, t, n) {
  const a = parseFloat(e.getAttribute(t));
  return isNaN(a) ? n : a;
}
function Z(e, t, n) {
  const a = e.getAttribute(t);
  if (!a) return n;
  try {
    return JSON.parse(a);
  } catch {
    return n;
  }
}
function ee(e, t, n, a, l) {
  if (!e || t === null) return !0;
  const i = a || "ln-component", r = e.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || t === "" && e.fallback !== void 0)
    return !0;
  const d = (o) => {
    l ? console.warn(o, l) : console.warn(o);
  };
  if (r === "boolean") {
    const o = t.trim().toLowerCase();
    return o !== "" && o !== "true" && o !== "false" && o !== "1" && o !== "0" ? (d(`[${i}] Invalid value "${t}" for boolean attribute "${n}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (r === "enum") {
    const o = e.values || [];
    return o.includes(t) ? !0 : (d(`[${i}] Invalid value "${t}" for attribute "${n}". Allowed: ${o.join(", ")}. Fallback: "${e.fallback}".`), !1);
  }
  if (r === "integer") {
    if (!/^-?\d+$/.test(t))
      return d(`[${i}] Invalid integer "${t}" for attribute "${n}". Fallback: ${e.fallback}.`), !1;
    const o = parseInt(t, 10);
    return e.min !== void 0 && o < e.min ? (d(`[${i}] Value ${o} for attribute "${n}" is less than min (${e.min}).`), !1) : e.max !== void 0 && o > e.max ? (d(`[${i}] Value ${o} for attribute "${n}" is greater than max (${e.max}).`), !1) : !0;
  }
  if (r === "float")
    return isNaN(Number(t)) ? (d(`[${i}] Invalid float "${t}" for attribute "${n}". Fallback: ${e.fallback}.`), !1) : !0;
  if (r === "json")
    try {
      return JSON.parse(t), !0;
    } catch (o) {
      return d(`[${i}] Invalid JSON for attribute "${n}": ${o.message}. Fallback: ${e.fallback}.`), !1;
    }
  return !0;
}
function qe(e, t, n) {
  for (const a in n) {
    const [l, i, r] = n[a];
    Object.defineProperty(e, a, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return l(t, i, r);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return e;
}
function $e(e) {
  const t = {};
  for (const n in e) {
    const a = e[n];
    if (!a || !a.prop) continue;
    let l = a.read;
    if (!l && a.type)
      switch (a.type) {
        case "enum":
          l = X(a.values, a.fallback);
          break;
        case "integer":
          l = J;
          break;
        case "float":
          l = Y;
          break;
        case "boolean":
          l = K;
          break;
        case "list":
          l = P;
          break;
        case "json":
          l = Z;
          break;
        case "string":
        default:
          l = I;
          break;
      }
    l || (l = I), t[a.prop] = [l, n, a.fallback];
  }
  return t;
}
function Le(e) {
  const t = {};
  for (const n in e) {
    const a = e[n];
    a && a.effect && (t[n] = a.effect);
  }
  return Object.keys(t).length ? t : null;
}
function Oe(e) {
  if (e.onAttrChange && !e.declared) return null;
  const t = /* @__PURE__ */ new Set();
  if (e.effects) for (const n in e.effects) t.add(n);
  if (e.onAttrChange && e.declared) for (const n of e.declared) t.add(n);
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = qe, window.lnCore.attrSpec = $e, window.lnCore.attrStr = I, window.lnCore.attrInt = J, window.lnCore.attrBool = K, window.lnCore.attrList = P, window.lnCore.attrEnum = X, window.lnCore.attrFloat = Y, window.lnCore.attrJson = Z);
function y(e, t) {
  if (!e[t.attribute]) {
    window.lnCore._persistSink && e.hasAttribute && e.hasAttribute("data-ln-persist") && window.lnCore._persistSink(e, t.selector);
    try {
      e[t.attribute] = new t.ComponentFn(e);
    } catch (n) {
      console.error("[" + t.attribute + "] init failed", e, n);
    }
  }
}
function te(e, t, n, a) {
  if (e.nodeType !== 1) return;
  const i = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", r = { selector: t, attribute: n, ComponentFn: a };
  if (e.matches && e.matches(i) && y(e, r), e.querySelectorAll) {
    const d = e.querySelectorAll(i);
    for (let o = 0; o < d.length; o++)
      y(d[o], r);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ne() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ae(e) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(e) : setTimeout(e, 0)) : e();
}
function oe() {
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return e.byReactive = e.byReactive || /* @__PURE__ */ new Map(), e.reactiveWildcard = e.reactiveWildcard || [], e;
}
function re(e) {
  const t = oe(), n = e.observed || [];
  for (let a = 0; a < n.length; a++) {
    const l = n[a];
    t.byAttr.has(l) || t.byAttr.set(l, []), t.byAttr.get(l).push(e);
  }
  if (t.byDeclaredAttr = t.byDeclaredAttr || /* @__PURE__ */ new Map(), e.attributes)
    for (const a in e.attributes) {
      t.byDeclaredAttr.has(a) || t.byDeclaredAttr.set(a, []);
      const l = t.byDeclaredAttr.get(a);
      l.some((i) => i.componentTag === e.componentTag) || l.push({
        spec: e.attributes[a],
        componentTag: e.componentTag
      });
    }
  if (e.onAttrChange || e.effects) {
    t.reactive.push(e);
    const a = Oe(e);
    if (a === null)
      t.reactiveWildcard.push(e);
    else
      for (const l of a)
        t.byReactive.has(l) || t.byReactive.set(l, []), t.byReactive.get(l).push(e);
  }
  e.persist && t.persist.push(e);
}
function W(e, t, n, a) {
  for (let l = 0; l < e.length; l++) {
    const i = e[l];
    if (!t[i.attribute]) continue;
    const r = i.effects && i.effects[n];
    r ? r(t, n, a) : i.onAttrChange && (!i.declared || i.declared.has(n)) && i.onAttrChange(t, n, a);
  }
}
function Te(e) {
  const t = e.attributeName, n = t.indexOf("data-ln-") === 0, a = oe(), l = a.byAttr.get(t), i = L() && a.byDeclaredAttr && a.byDeclaredAttr.has(t);
  if (!n && !l && !i)
    return;
  const r = e.target;
  if (e.oldValue !== r.getAttribute(t)) {
    if (i && O(r)) {
      const d = a.byDeclaredAttr.get(t), o = r.getAttribute(t);
      for (let s = 0; s < d.length; s++)
        ee(d[s].spec, o, t, d[s].componentTag, r);
    }
    if (window.lnCore._debugSink && (n || l) && window.lnCore._debugSink("attr", t, r, { oldValue: e.oldValue, newValue: r.getAttribute(t) }), n) {
      const d = a.byReactive.get(t);
      d && W(d, r, t, e.oldValue), a.reactiveWildcard.length && W(a.reactiveWildcard, r, t, e.oldValue);
    }
    if (l)
      for (let d = 0; d < l.length; d++) {
        const o = l[d];
        if (o.handler) {
          o.handler(r, t, e.oldValue);
          continue;
        }
        o.onAttributeChange && r[o.attribute] ? o.onAttributeChange(r, t) : (te(r, o.selector, o.attribute, o.ComponentFn), o.onInit && o.onInit(r));
      }
  }
}
function le() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, b(function() {
    new MutationObserver(function(t) {
      for (let n = 0; n < t.length; n++)
        try {
          Te(t[n]);
        } catch (a) {
          console.error("[ln-core] mutation handler failed", t[n].target, a);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function T() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function F() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function U(e, t) {
  if (!document.contains(e))
    if (t.attribute) {
      const n = e[t.attribute];
      if (n && typeof n.destroy == "function")
        try {
          n.destroy();
        } catch (a) {
          console.error("[" + t.attribute + "] destroy failed", e, a);
        }
      delete e[t.attribute];
    } else t.onDestroy && t.onDestroy(e);
}
function ie(e) {
  const t = T();
  if (!t.length) return;
  const n = e.target;
  if (n) {
    const l = n.nodeType === 1 ? n : n.parentElement;
    if (l && (l.isContentEditable || l.closest && l.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const a = F();
  if (e.target && a.length)
    for (let l = 0; l < a.length; l++) {
      const i = a[l], r = i.query, d = e.target.nodeType === 1 ? e.target.matches && e.target.matches(r) ? e.target : e.target.closest ? e.target.closest(r) : null : e.target.parentElement && e.target.parentElement.closest ? e.target.parentElement.closest(r) : null;
      d && i.onSubtreeChange(d, e);
    }
  for (let l = 0; l < e.addedNodes.length; l++) {
    const i = e.addedNodes[l];
    if (i.nodeType !== 1) continue;
    const r = !!(i.firstElementChild || i.children && i.children.length);
    for (let d = 0; d < t.length; d++) {
      const o = t[d], s = o.query;
      if (s && (i.matches && i.matches(s) && (o.ComponentFn && y(i, o), o.onInit && o.onInit(i)), r && i.querySelectorAll)) {
        const c = i.querySelectorAll(s);
        for (let u = 0; u < c.length; u++)
          o.ComponentFn && y(c[u], o), o.onInit && o.onInit(c[u]);
      }
    }
  }
  for (let l = 0; l < e.removedNodes.length; l++) {
    const i = e.removedNodes[l];
    if (i.nodeType !== 1 || document.contains(i)) continue;
    const r = !!(i.firstElementChild || i.children && i.children.length);
    for (let d = 0; d < t.length; d++) {
      const o = t[d], s = o.query;
      if (s && (i.matches && i.matches(s) && U(i, o), r && i.querySelectorAll)) {
        const c = i.querySelectorAll(s);
        for (let u = 0; u < c.length; u++) U(c[u], o);
      }
    }
  }
}
function de() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, b(function() {
    const e = new MutationObserver(function(t) {
      for (let n = 0; n < t.length; n++) {
        const a = t[n];
        if (a.type === "childList")
          try {
            ie(a);
          } catch (l) {
            console.error("[ln-core] lifecycle handler failed", a.target, l);
          }
      }
    });
    window.lnCore._lifecycleObserver = e, e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Fe(e) {
  if (typeof window > "u") return e();
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._lifecycleObserver;
  if (!t) return e();
  const n = t.takeRecords();
  for (let a = 0; a < n.length; a++) {
    const l = n[a];
    if (l.type === "childList")
      try {
        ie(l);
      } catch (i) {
        console.error("[ln-core] lifecycle handler failed", l.target, i);
      }
  }
  t.disconnect();
  try {
    return e();
  } finally {
    t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}
function Re(e, t) {
  re({ observed: e, handler: t }), le();
}
function Me(e) {
  T().push(e), e.onSubtreeChange && e.query && F().push(e), de();
}
function se(e, t, n, a, l = {}) {
  const i = l.extraAttributes || [], r = l.onAttributeChange || null, d = l.onSubtreeChange || null, o = l.onInit || null, s = l.onAttrChange || null, c = l.effects || null, u = l.attributes || null, f = u ? Le(u) : c, C = u ? new Set(Object.keys(u)) : null, we = l.persist || null;
  function m(v) {
    const w = v || document.body;
    if (te(w, e, t, n), u && L())
      for (const h in u) {
        const he = u[h], S = Array.from(w.querySelectorAll("[" + h + "]"));
        w.matches && w.matches("[" + h + "]") && S.push(w);
        for (let x = 0; x < S.length; x++) {
          const k = S[x];
          O(k) && ee(he, k.getAttribute(h), h, a, k);
        }
      }
    o && o(w);
  }
  const A = [];
  if (e.indexOf("[") !== -1) {
    const v = /\[([\w-]+)/g;
    let w;
    for (; (w = v.exec(e)) !== null; )
      A.push(w[1]);
  } else
    A.push(e);
  re({
    selector: e,
    attribute: t,
    componentTag: a,
    attributes: u,
    ComponentFn: n,
    onInit: o,
    observed: A.concat(i),
    onAttributeChange: r,
    onAttrChange: s,
    effects: f,
    declared: C,
    persist: we
  }), le();
  const pe = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1, N = l.subtreeQuery || (pe ? e : "[" + e + "]"), j = {
    selector: e,
    attribute: t,
    ComponentFn: n,
    onInit: o,
    onSubtreeChange: d,
    query: N
  };
  T().push(j), d && N && F().push(j), de(), window[t] = m, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = se, window.lnCore.observeLifecycle = Me, window.lnCore.withoutLifecycle = Fe);
  function B() {
    ne() > 0 ? ae(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", B) : B(), m;
}
function ce(e) {
  return (e || "").replace(/^#/, "");
}
function R(e) {
  const t = e === void 0 ? location.hash : e, n = {}, a = ce(t);
  if (!a) return n;
  const l = a.split("&");
  for (let i = 0; i < l.length; i++) {
    const r = l[i];
    if (!r) continue;
    const d = r.indexOf(":"), o = d > -1 ? r.slice(0, d) : r, s = d > -1 ? r.slice(d + 1) : "";
    if (o)
      try {
        n[o] = decodeURIComponent(s);
      } catch {
        n[o] = s;
      }
  }
  return n;
}
function Ne(e) {
  if (!e) return null;
  const t = R();
  return e in t ? t[e] : null;
}
function je(e, t) {
  if (!e) return;
  const n = R();
  t == null ? delete n[e] : n[e] = String(t);
  const l = Object.keys(n).map(function(i) {
    const r = n[i];
    return r === "" ? i : i + ":" + encodeURIComponent(r);
  }).join("&");
  ce(location.hash) !== l && (location.hash = l);
}
function Be(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function We(e, t) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const n = e.getAttribute("data-ln-hash");
  if (n && n.trim() !== "") return n.trim();
  const a = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return a ? t ? a + "-" + t : a : t || null;
}
function Ue(e, t) {
  return !t || t === "none" || e === null || e === void 0 ? null : String(e) + "." + t;
}
function Ve(e) {
  return !e || typeof e != "string" ? null : e.endsWith(".asc") ? { fieldOrColumn: e.slice(0, -4), direction: "asc" } : e.endsWith(".desc") ? { fieldOrColumn: e.slice(0, -5), direction: "desc" } : null;
}
function He(e, t) {
  return !e || !Array.isArray(t) || t.length === 0 ? null : e + ":" + t.map(encodeURIComponent).join(",");
}
function ze(e) {
  if (!e || typeof e != "string") return null;
  const t = e.indexOf(":");
  if (t === -1) return null;
  const n = e.slice(0, t), a = e.slice(t + 1), l = a ? a.split(",").map(function(i) {
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  }).filter(Boolean) : [];
  return { key: n, values: l };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = R, window.lnCore.hashGet = Ne, window.lnCore.hashSet = je, window.lnCore.hashLinkClick = Be, window.lnCore.resolveHashNamespace = We, window.lnCore.hashSortEncode = Ue, window.lnCore.hashSortDecode = Ve, window.lnCore.hashFilterEncode = He, window.lnCore.hashFilterDecode = ze);
function Ge(e) {
  return (e || "").replace(/^\?/, "");
}
function Qe(e) {
  const t = e === void 0 ? typeof window < "u" ? window.location.search : "" : e, n = {}, a = Ge(t);
  if (!a) return n;
  const l = new URLSearchParams(a);
  for (const [i, r] of l.entries())
    n[i] = r;
  return n;
}
function Je(e) {
  if (!e || typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search);
  return t.has(e) ? t.get(e) : null;
}
function Ke(e, t) {
  if (!e || typeof window > "u") return;
  const n = new URL(window.location.href);
  if (t == null || t === "" ? n.searchParams.delete(e) : n.searchParams.set(e, String(t)), n.search === window.location.search) return;
  const a = n.pathname + n.search + n.hash;
  window.history.replaceState(window.history.state, "", a);
}
function Pe(e, t) {
  if (!e || !e.hasAttribute("data-ln-query")) return null;
  const n = e.getAttribute("data-ln-query");
  if (n && n.trim() !== "") return n.trim();
  const a = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return a ? t ? a + "_" + t : a : t || null;
}
function Xe(e, t) {
  return !t || t === "none" || e === null || e === void 0 ? null : String(e) + "." + t;
}
function Ye(e, t) {
  if (e && typeof e == "string") {
    if (e.endsWith(".asc"))
      return { fieldOrColumn: e.slice(0, -4), direction: "asc" };
    if (e.endsWith(".desc"))
      return { fieldOrColumn: e.slice(0, -5), direction: "desc" };
  }
  if (t && typeof t == "object") {
    const n = t.sort_field || t.sort_by;
    if (n) {
      const a = t.sort_dir && String(t.sort_dir).toLowerCase() === "desc" ? "desc" : "asc";
      return { fieldOrColumn: n, direction: a };
    }
  }
  return null;
}
function Ze(e) {
  return !Array.isArray(e) || e.length === 0 ? null : e.map(encodeURIComponent).join(",");
}
function et(e) {
  return !e || typeof e != "string" ? [] : e.split(",").map(function(t) {
    try {
      return decodeURIComponent(t.trim());
    } catch {
      return t.trim();
    }
  }).filter(Boolean);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.queryParse = Qe, window.lnCore.queryGet = Je, window.lnCore.querySet = Ke, window.lnCore.resolveQueryParam = Pe, window.lnCore.querySortEncode = Xe, window.lnCore.querySortDecode = Ye, window.lnCore.queryFilterEncode = Ze, window.lnCore.queryFilterDecode = et);
function tt() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = tt);
const M = /* @__PURE__ */ new Set([
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
  "data-ln-filter-target",
  "data-ln-filter-value",
  "data-ln-filter-values",
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
function nt(e, t) {
  if (e === t) return 0;
  if (!e.length) return t.length;
  if (!t.length) return e.length;
  const n = [];
  for (let a = 0; a <= t.length; a++) n[a] = [a];
  for (let a = 0; a <= e.length; a++) n[0][a] = a;
  for (let a = 1; a <= t.length; a++)
    for (let l = 1; l <= e.length; l++)
      t.charAt(a - 1) === e.charAt(l - 1) ? n[a][l] = n[a - 1][l - 1] : n[a][l] = Math.min(
        n[a - 1][l - 1] + 1,
        n[a][l - 1] + 1,
        n[a - 1][l] + 1
      );
  return n[t.length][e.length];
}
function at(e, t = M) {
  if (t.has(e)) return null;
  let n = null, a = 1 / 0;
  const l = Math.max(3, Math.floor(e.length * 0.4));
  for (const i of t) {
    if (Math.abs(e.length - i.length) > 3 || Math.abs(e.length - i.length) >= a) continue;
    const r = nt(e, i);
    r < a && (a = r, n = i);
  }
  return a <= l ? n : null;
}
function ue(e) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(e) : e.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function ot(e = document) {
  const t = e.ownerDocument || e, n = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const r = l[i];
    if (r.attributes)
      for (let d = 0; d < r.attributes.length; d++) {
        const o = r.attributes[d];
        if (o.name.startsWith("data-ln-") && o.name.endsWith("-for")) {
          const s = (o.value || "").trim();
          if (!s) {
            a.push({
              type: "id-empty",
              element: r,
              attribute: o.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          t.getElementById(s) || t.querySelector("#" + ue(s)) || a.push({
            type: "id-unresolved",
            element: r,
            attribute: o.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${o.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function rt(e = document) {
  const t = e.ownerDocument || e, n = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const r = l[i];
    if (r.attributes)
      for (let d = 0; d < r.attributes.length; d++) {
        const o = r.attributes[d];
        if (o.name.startsWith("data-ln-") && (o.name.endsWith("-source") || o.name.endsWith("-store")) && o.name !== "data-ln-data-store") {
          const c = (o.value || "").trim();
          if (!c) {
            a.push({
              type: "store-empty",
              element: r,
              attribute: o.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          const u = ue(c), f = t.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), C = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !C && a.push({
            type: "store-unresolved",
            element: r,
            attribute: o.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${o.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function lt(e = document) {
  e.ownerDocument;
  const t = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!t) return [];
  const n = [], a = Array.from(t.querySelectorAll("[data-ln-data-store]"));
  t.hasAttribute && t.hasAttribute("data-ln-data-store") && a.unshift(t);
  const l = /* @__PURE__ */ new Map();
  for (let i = 0; i < a.length; i++) {
    const r = a[i], d = (r.getAttribute("data-ln-data-store") || "").trim();
    d && (l.has(d) || l.set(d, []), l.get(d).push(r));
  }
  for (const [i, r] of l.entries())
    r.length > 1 && n.push({
      type: "store-duplicate",
      storeName: i,
      elements: r,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${i}". Store names must be unique across the document.`
    });
  return n;
}
function it(e = typeof document < "u" ? document : null, t = M) {
  const n = e && (e.nodeType === 9 ? e.body || e.documentElement : e);
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const r = l[i];
    if (r.attributes)
      for (let d = 0; d < r.attributes.length; d++) {
        const o = r.attributes[d];
        if (!o.name.startsWith("data-ln-") || t.has(o.name)) continue;
        const s = at(o.name, t);
        a.push({
          type: "attribute-unknown",
          element: r,
          attribute: o.name,
          suggestion: s,
          message: `[ln-debug] Unknown attribute "${o.name}" on <${r.tagName.toLowerCase()}>.${s ? ` Did you mean "${s}"?` : ""}`
        });
      }
  }
  return a;
}
function q(e = typeof document < "u" ? document : null, t = {}) {
  if (!e)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const n = t.validAttributes || M, a = ot(e), l = rt(e), i = lt(e), r = it(e, n), d = [
    ...a,
    ...l,
    ...i,
    ...r
  ];
  if (!t.silent)
    for (let o = 0; o < d.length; o++)
      console.warn(d[o].message);
  return {
    idIssues: a,
    storeIssues: l,
    uniquenessIssues: i,
    spellingIssues: r,
    total: d.length
  };
}
let D = null;
function g(e = typeof document < "u" ? document : null, t = 50, n = null) {
  if (!e || !L()) return;
  clearTimeout(D);
  const a = () => {
    D = setTimeout(() => {
      D = null;
      const l = q(e);
      n && n(l);
    }, t);
  };
  if (ne() > 0) return ae(a);
  a();
}
function dt(e, t, n, a) {
  e === "event" ? (console.groupCollapsed("[ln-debug] event", t), console.log("target", n), console.log("detail", a), console.groupEnd()) : e === "attr" && (console.groupCollapsed("[ln-debug] attr", t), console.log("target", n), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let p = [];
function st() {
  p = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && p.push(document.body);
}
function fe(e) {
  if (e === window || e === document)
    return p.indexOf(document.body) !== -1;
  for (let t = 0; t < p.length; t++)
    if (p[t].contains(e)) return !0;
  return !1;
}
function ct(e, t, n, a) {
  fe(n) && dt(e, t, n, a);
}
function $() {
  st(), be(p.length > 0 ? ct : null, p.length > 0 ? fe : null);
}
function V() {
  $();
}
function ut() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, b(function() {
    $(), Re(["data-ln-debug"], $);
  }, "ln-debug")));
}
(function() {
  const e = "data-ln-debug", t = "lnDebug";
  if (typeof window < "u" && window[t] !== void 0) return;
  const n = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  ut();
  function a(i) {
    return this.dom = i, g(i), V(), this;
  }
  a.prototype.verify = function(i, r) {
    return q(i || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, a.prototype.destroy = function() {
    delete this.dom[t], V();
  };
  const l = se(e, t, a, "ln-debug", {
    attributes: n,
    onInit: (i) => g(i),
    onSubtreeChange: (i) => g(i)
  });
  l.verify = function(i, r) {
    return q(i || document, r);
  }, l.schedule = function(i, r, d) {
    return g(i || document, r, d);
  };
})();
export {
  g as scheduleVerification,
  q as verifyDOM
};
