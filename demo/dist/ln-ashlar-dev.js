function B() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function L(e) {
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
      let n = null;
      for (let r = 1; r < t.length; r++)
        if (t[r] && t[r].nodeType === 1) {
          n = t[r];
          break;
        }
      if (!L(n))
        return;
    }
    e.apply(console, t);
  };
}
function we(e, t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = e, window.lnCore._debugIsContained = t || null;
}
function pe(e, t, a) {
  const n = a || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", t, e, n), e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    detail: n
  }));
}
function g(e, t) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      g(e, t);
    }), console.warn("[" + t + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  e();
}
function be(e) {
  const t = e.querySelector('input[name="_method"]');
  return ((t && t.value !== "" ? t.value : e.method) || "").toUpperCase();
}
function he(e, t) {
  const a = !!(t && t.typed), n = t && t.exclude, r = {}, i = e.elements, o = {};
  if (a)
    for (let d = 0; d < i.length; d++) {
      const l = i[d];
      l.name && l.type === "checkbox" && !l.disabled && (o[l.name] = (o[l.name] || 0) + 1);
    }
  for (let d = 0; d < i.length; d++) {
    const l = i[d];
    if (!(!l.name || l.disabled || l.type === "file" || l.type === "submit" || l.type === "button") && !(n && l.matches && l.matches(n)))
      if (l.type === "checkbox")
        a && o[l.name] === 1 ? r[l.name] = l.checked : (r[l.name] || (r[l.name] = []), l.checked && r[l.name].push(l.value));
      else if (l.type === "radio")
        l.checked && (r[l.name] = l.value);
      else if (l.type === "select-multiple") {
        r[l.name] = [];
        for (let s = 0; s < l.options.length; s++)
          l.options[s].selected && r[l.name].push(l.options[s].value);
      } else if (a && l.type === "hidden")
        r[l.name] = l.value;
      else if (a && (l.type === "number" || l.type === "range")) {
        const s = Number(l.value);
        r[l.name] = l.value === "" || isNaN(s) ? null : s;
      } else
        r[l.name] = l.value;
  }
  return r;
}
function me(e) {
  if (typeof e != "string") return !!e;
  const t = e.trim().toLowerCase();
  return t !== "false" && t !== "0" && t !== "" && t !== "off" && t !== "no";
}
function ge(e, t) {
  const a = e.elements, n = [], r = {};
  for (let i = 0; i < a.length; i++) {
    const o = a[i];
    o.name && o.type === "checkbox" && (r[o.name] = (r[o.name] || 0) + 1);
  }
  for (let i = 0; i < a.length; i++) {
    const o = a[i];
    if (o.type === "file" || o.type === "submit" || o.type === "button") continue;
    const d = o.getAttribute("data-ln-fill-as") || o.name;
    if (!d || !(d in t)) continue;
    const l = t[d];
    if (o.type === "checkbox") {
      if (Array.isArray(l))
        o.checked = l.indexOf(o.value) !== -1;
      else if (r[o.name] > 1) {
        const s = String(l).split(",").map(function(c) {
          return c.trim();
        });
        o.checked = s.indexOf(o.value) !== -1;
      } else
        o.checked = me(l);
      n.push(o);
    } else if (o.type === "radio")
      o.checked = o.value === String(l), n.push(o);
    else if (o.type === "select-multiple") {
      if (Array.isArray(l))
        for (let s = 0; s < o.options.length; s++)
          o.options[s].selected = l.indexOf(o.options[s].value) !== -1;
      n.push(o);
    } else
      o.value = l, o.tagName === "SELECT" && l != null && o.setAttribute("data-ln-value", l), n.push(o);
  }
  return n;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = ge, window.lnCore.serializeForm = he, window.lnCore.resolveFormMethod = be);
const W = {};
function ye(e, t) {
  W[e] = t;
}
function Ce(e) {
  return W[e] || { ingress: (t) => t, egress: (t) => t };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ye, window.lnCore.getDataMapper = Ce);
function ve() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, g(function() {
    new MutationObserver(function() {
      pe(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const U = {};
function Ae(e, t) {
  if (!e || typeof t != "object") return;
  const a = e.toLowerCase().split("-")[0];
  U[a] = t;
}
function xe(e) {
  if (!e) return null;
  const t = e.toLowerCase().split("-")[0];
  return U[t] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Ae, window.lnCore.getLocaleFallback = xe, window.lnCore.ensureLocaleObserver = ve);
const D = {};
function Se(e, t) {
  D[e] || (D[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const a = D[e];
  return a ? a.content.cloneNode(!0) : (console.warn("[" + (t || "ln-core") + '] Template "' + e + '" not found'), null);
}
function V(e, t) {
  if (!e || !t) return e;
  const a = e.querySelectorAll("[data-ln-field]");
  for (let o = 0; o < a.length; o++) {
    const d = a[o], l = d.getAttribute("data-ln-field");
    t[l] != null && (d.textContent = t[l]);
  }
  const n = e.querySelectorAll("[data-ln-attr]");
  for (let o = 0; o < n.length; o++) {
    const d = n[o], l = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < l.length; s++) {
      const c = l[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      t[f] != null && d.setAttribute(u, t[f]);
    }
  }
  const r = e.querySelectorAll("[data-ln-show]");
  for (let o = 0; o < r.length; o++) {
    const d = r[o], l = d.getAttribute("data-ln-show");
    l in t && d.classList.toggle("hidden", !t[l]);
  }
  const i = e.querySelectorAll("[data-ln-class]");
  for (let o = 0; o < i.length; o++) {
    const d = i[o], l = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < l.length; s++) {
      const c = l[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in t && d.classList.toggle(u, !!t[f]);
    }
  }
  return e;
}
function ke(e, t) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", e, t ?? null), e.dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 })));
  const a = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let n = 0; n < a.length; n++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", a[n], t ?? null), a[n].dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 }));
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(e) {
  if (!(!e.target.matches || !e.target.matches("[data-ln-fillable]")))
    if (e.detail)
      V(e.target, e.detail);
    else {
      const t = e.target.querySelectorAll("[data-ln-field]");
      for (let a = 0; a < t.length; a++)
        t[a].textContent = "";
    }
})));
function H(e, t) {
  if (!e || !t) return e;
  const a = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (; a.nextNode(); ) {
    const i = a.currentNode;
    i.textContent.indexOf("{{") !== -1 && (i.textContent = i.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(o, d) {
        return t[d] !== void 0 ? t[d] : "";
      }
    ));
  }
  const n = function(i, o) {
    return t[o] !== void 0 ? t[o] : "";
  }, r = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && r.push(e);
  for (let i = 0; i < r.length; i++) {
    const o = r[i], d = o.attributes;
    for (let l = 0; l < d.length; l++) {
      const s = d[l];
      s.value.indexOf("{{") !== -1 && o.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, n));
    }
  }
  return e;
}
function _e(e, t, a, n, r, i) {
  const o = {};
  for (let l = 0; l < e.children.length; l++) {
    const s = e.children[l], c = s.getAttribute("data-ln-render-key");
    c && (o[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let l = 0; l < t.length; l++) {
    const s = t[l], c = String(n(s));
    let u = o[c];
    if (u)
      r(u, s, l);
    else {
      const f = Se(a, i);
      if (!f || (H(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), r(u, s, l);
    }
    d.appendChild(u);
  }
  e.textContent = "", e.appendChild(d);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = H, window.lnCore.fill = V, window.lnCore.lnFill = ke, window.lnCore.renderList = _e);
function E(e, t, a) {
  const n = e.getAttribute(t);
  return n === null ? a : n;
}
function z(e, t, a) {
  const n = parseInt(e.getAttribute(t), 10);
  return isNaN(n) ? a : n;
}
function G(e, t, a = !1) {
  const n = e.getAttribute(t);
  if (n === null) return !!a;
  const r = n.trim().toLowerCase();
  return !(r === "false" || r === "0");
}
function Q(e, t) {
  return (e.getAttribute(t) || "").split(",").map((a) => a.trim()).filter(Boolean);
}
const $ = /* @__PURE__ */ new Map();
function J(e, t) {
  const a = (e ? e.join("|") : "") + "::" + t;
  if ($.has(a)) return $.get(a);
  const n = new Set(e || []), r = function(i, o) {
    const d = i.getAttribute(o);
    return d !== null && n.has(d) ? d : t;
  };
  return $.set(a, r), r;
}
function K(e, t, a) {
  const n = parseFloat(e.getAttribute(t));
  return isNaN(n) ? a : n;
}
function P(e, t, a) {
  const n = e.getAttribute(t);
  if (!n) return a;
  try {
    return JSON.parse(n);
  } catch {
    return a;
  }
}
function X(e, t, a, n, r) {
  if (!e || t === null) return !0;
  const i = n || "ln-component", o = e.type;
  if (o === "trigger" || o === "marker" || o === "string" || o === "list" || !o || t === "" && e.fallback !== void 0)
    return !0;
  const d = (l) => {
    r ? console.warn(l, r) : console.warn(l);
  };
  if (o === "boolean") {
    const l = t.trim().toLowerCase();
    return l !== "" && l !== "true" && l !== "false" && l !== "1" && l !== "0" ? (d(`[${i}] Invalid value "${t}" for boolean attribute "${a}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (o === "enum") {
    const l = e.values || [];
    return l.includes(t) ? !0 : (d(`[${i}] Invalid value "${t}" for attribute "${a}". Allowed: ${l.join(", ")}. Fallback: "${e.fallback}".`), !1);
  }
  if (o === "integer") {
    if (!/^-?\d+$/.test(t))
      return d(`[${i}] Invalid integer "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1;
    const l = parseInt(t, 10);
    return e.min !== void 0 && l < e.min ? (d(`[${i}] Value ${l} for attribute "${a}" is less than min (${e.min}).`), !1) : e.max !== void 0 && l > e.max ? (d(`[${i}] Value ${l} for attribute "${a}" is greater than max (${e.max}).`), !1) : !0;
  }
  if (o === "float")
    return isNaN(Number(t)) ? (d(`[${i}] Invalid float "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1) : !0;
  if (o === "json")
    try {
      return JSON.parse(t), !0;
    } catch (l) {
      return d(`[${i}] Invalid JSON for attribute "${a}": ${l.message}. Fallback: ${e.fallback}.`), !1;
    }
  return !0;
}
function De(e, t, a) {
  for (const n in a) {
    const [r, i, o] = a[n];
    Object.defineProperty(e, n, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return r(t, i, o);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return e;
}
function $e(e) {
  const t = {};
  for (const a in e) {
    const n = e[a];
    if (!n || !n.prop) continue;
    let r = n.read;
    if (!r && n.type)
      switch (n.type) {
        case "enum":
          r = J(n.values, n.fallback);
          break;
        case "integer":
          r = z;
          break;
        case "float":
          r = K;
          break;
        case "boolean":
          r = G;
          break;
        case "list":
          r = Q;
          break;
        case "json":
          r = P;
          break;
        case "string":
        default:
          r = E;
          break;
      }
    r || (r = E), t[n.prop] = [r, a, n.fallback];
  }
  return t;
}
function Ie(e) {
  const t = {};
  for (const a in e) {
    const n = e[a];
    n && n.effect && (t[a] = n.effect);
  }
  return Object.keys(t).length ? t : null;
}
function Ee(e) {
  if (e.onAttrChange && !e.declared) return null;
  const t = /* @__PURE__ */ new Set();
  if (e.effects) for (const a in e.effects) t.add(a);
  if (e.onAttrChange && e.declared) for (const a of e.declared) t.add(a);
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = De, window.lnCore.attrSpec = $e, window.lnCore.attrStr = E, window.lnCore.attrInt = z, window.lnCore.attrBool = G, window.lnCore.attrList = Q, window.lnCore.attrEnum = J, window.lnCore.attrFloat = K, window.lnCore.attrJson = P);
function m(e, t) {
  if (!e[t.attribute]) {
    window.lnCore._persistSink && e.hasAttribute && e.hasAttribute("data-ln-persist") && window.lnCore._persistSink(e, t.selector);
    try {
      e[t.attribute] = new t.ComponentFn(e);
    } catch (a) {
      console.error("[" + t.attribute + "] init failed", e, a);
    }
  }
}
function Y(e, t, a, n) {
  if (e.nodeType !== 1) return;
  const i = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", o = { selector: t, attribute: a, ComponentFn: n };
  if (e.matches && e.matches(i) && m(e, o), e.querySelectorAll) {
    const d = e.querySelectorAll(i);
    for (let l = 0; l < d.length; l++)
      m(d[l], o);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Z() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ee(e) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(e) : setTimeout(e, 0)) : e();
}
function te() {
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return e.byReactive = e.byReactive || /* @__PURE__ */ new Map(), e.reactiveWildcard = e.reactiveWildcard || [], e;
}
function ne(e) {
  const t = te(), a = e.observed || [];
  for (let n = 0; n < a.length; n++) {
    const r = a[n];
    t.byAttr.has(r) || t.byAttr.set(r, []), t.byAttr.get(r).push(e);
  }
  if (t.byDeclaredAttr = t.byDeclaredAttr || /* @__PURE__ */ new Map(), e.attributes)
    for (const n in e.attributes) {
      t.byDeclaredAttr.has(n) || t.byDeclaredAttr.set(n, []);
      const r = t.byDeclaredAttr.get(n);
      r.some((i) => i.componentTag === e.componentTag) || r.push({
        spec: e.attributes[n],
        componentTag: e.componentTag
      });
    }
  if (e.onAttrChange || e.effects) {
    t.reactive.push(e);
    const n = Ee(e);
    if (n === null)
      t.reactiveWildcard.push(e);
    else
      for (const r of n)
        t.byReactive.has(r) || t.byReactive.set(r, []), t.byReactive.get(r).push(e);
  }
  e.persist && t.persist.push(e);
}
function R(e, t, a, n) {
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (!t[i.attribute]) continue;
    const o = i.effects && i.effects[a];
    o ? o(t, a, n) : i.onAttrChange && (!i.declared || i.declared.has(a)) && i.onAttrChange(t, a, n);
  }
}
function qe(e) {
  const t = e.attributeName, a = t.indexOf("data-ln-") === 0, n = te(), r = n.byAttr.get(t), i = B() && n.byDeclaredAttr && n.byDeclaredAttr.has(t);
  if (!a && !r && !i)
    return;
  const o = e.target;
  if (e.oldValue !== o.getAttribute(t)) {
    if (i && L(o)) {
      const d = n.byDeclaredAttr.get(t), l = o.getAttribute(t);
      for (let s = 0; s < d.length; s++)
        X(d[s].spec, l, t, d[s].componentTag, o);
    }
    if (window.lnCore._debugSink && (a || r) && window.lnCore._debugSink("attr", t, o, { oldValue: e.oldValue, newValue: o.getAttribute(t) }), a) {
      const d = n.byReactive.get(t);
      d && R(d, o, t, e.oldValue), n.reactiveWildcard.length && R(n.reactiveWildcard, o, t, e.oldValue);
    }
    if (r)
      for (let d = 0; d < r.length; d++) {
        const l = r[d];
        if (l.handler) {
          l.handler(o, t, e.oldValue);
          continue;
        }
        l.onAttributeChange && o[l.attribute] ? l.onAttributeChange(o, t) : (Y(o, l.selector, l.attribute, l.ComponentFn), l.onInit && l.onInit(o));
      }
  }
}
function ae() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, g(function() {
    new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++)
        try {
          qe(t[a]);
        } catch (n) {
          console.error("[ln-core] mutation handler failed", t[a].target, n);
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
function I(e, t) {
  if (!document.contains(e))
    if (t.attribute) {
      const a = e[t.attribute];
      if (a && typeof a.destroy == "function")
        try {
          a.destroy();
        } catch (n) {
          console.error("[" + t.attribute + "] destroy failed", e, n);
        }
      delete e[t.attribute];
    } else t.onDestroy && t.onDestroy(e);
}
function Oe(e) {
  const t = T();
  if (t.length) {
    if (e.target)
      for (let a = 0; a < t.length; a++) {
        const n = t[a];
        if (n.onSubtreeChange && n.query) {
          const r = n.query, i = e.target.nodeType === 1 ? e.target.matches && e.target.matches(r) ? e.target : e.target.closest ? e.target.closest(r) : null : e.target.parentElement && e.target.parentElement.closest ? e.target.parentElement.closest(r) : null;
          i && n.onSubtreeChange(i, e);
        }
      }
    for (let a = 0; a < e.addedNodes.length; a++) {
      const n = e.addedNodes[a];
      if (n.nodeType === 1) {
        const r = !!(n.firstElementChild || n.children && n.children.length);
        for (let i = 0; i < t.length; i++) {
          const o = t[i];
          if (o.selector && o.attribute && o.ComponentFn) {
            if (!r)
              n.matches && n.matches(o.query) && m(n, o);
            else if (n.matches && n.matches(o.query) && m(n, o), n.querySelectorAll) {
              const d = n.querySelectorAll(o.query);
              for (let l = 0; l < d.length; l++)
                m(d[l], o);
            }
          }
          o.onInit && o.onInit(n);
        }
      }
    }
    for (let a = 0; a < e.removedNodes.length; a++) {
      const n = e.removedNodes[a];
      if (n.nodeType === 1) {
        const r = !!(n.firstElementChild || n.children && n.children.length);
        for (let i = 0; i < t.length; i++) {
          const o = t[i], d = o.query;
          if (d) {
            if (!r)
              n.matches && n.matches(d) && I(n, o);
            else if (n.matches && n.matches(d) && I(n, o), n.querySelectorAll) {
              const l = n.querySelectorAll(d);
              for (let s = 0; s < l.length; s++)
                I(l[s], o);
            }
          }
        }
      }
    }
  }
}
function oe() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, g(function() {
    new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++) {
        const n = t[a];
        if (n.type === "childList")
          try {
            Oe(n);
          } catch (r) {
            console.error("[ln-core] lifecycle handler failed", n.target, r);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Le(e, t) {
  ne({ observed: e, handler: t }), ae();
}
function Te(e) {
  T().push(e), oe();
}
function le(e, t, a, n, r = {}) {
  const i = r.extraAttributes || [], o = r.onAttributeChange || null, d = r.onSubtreeChange || null, l = r.onInit || null, s = r.onAttrChange || null, c = r.effects || null, u = r.attributes || null, f = u ? Ie(u) : c, v = u ? new Set(Object.keys(u)) : null, se = r.persist || null;
  function y(x) {
    const w = x || document.body;
    if (Y(w, e, t, a), u && B())
      for (const b in u) {
        const fe = u[b], S = Array.from(w.querySelectorAll("[" + b + "]"));
        w.matches && w.matches("[" + b + "]") && S.push(w);
        for (let k = 0; k < S.length; k++) {
          const _ = S[k];
          L(_) && X(fe, _.getAttribute(b), b, n, _);
        }
      }
    l && l(w);
  }
  const A = [];
  if (e.indexOf("[") !== -1) {
    const x = /\[([\w-]+)/g;
    let w;
    for (; (w = x.exec(e)) !== null; )
      A.push(w[1]);
  } else
    A.push(e);
  ne({
    selector: e,
    attribute: t,
    componentTag: n,
    attributes: u,
    ComponentFn: a,
    onInit: l,
    observed: A.concat(i),
    onAttributeChange: o,
    onAttrChange: s,
    effects: f,
    declared: v,
    persist: se
  }), ae();
  const ce = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1, ue = r.subtreeQuery || (ce ? e : "[" + e + "]");
  T().push({
    selector: e,
    attribute: t,
    ComponentFn: a,
    onInit: l,
    onSubtreeChange: d,
    query: ue
  }), oe(), window[t] = y, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = le, window.lnCore.observeLifecycle = Te);
  function F() {
    Z() > 0 ? ee(function() {
      y(document.body);
    }) : y(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", F) : F(), y;
}
function re(e) {
  return (e || "").replace(/^#/, "");
}
function M(e) {
  const t = e === void 0 ? location.hash : e, a = {}, n = re(t);
  if (!n) return a;
  const r = n.split("&");
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (!o) continue;
    const d = o.indexOf(":"), l = d > -1 ? o.slice(0, d) : o, s = d > -1 ? o.slice(d + 1) : "";
    if (l)
      try {
        a[l] = decodeURIComponent(s);
      } catch {
        a[l] = s;
      }
  }
  return a;
}
function Me(e) {
  if (!e) return null;
  const t = M();
  return e in t ? t[e] : null;
}
function Ne(e, t) {
  if (!e) return;
  const a = M();
  t == null ? delete a[e] : a[e] = String(t);
  const r = Object.keys(a).map(function(i) {
    const o = a[i];
    return o === "" ? i : i + ":" + encodeURIComponent(o);
  }).join("&");
  re(location.hash) !== r && (location.hash = r);
}
function Fe(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function Re(e, t) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const a = e.getAttribute("data-ln-hash");
  if (a && a.trim() !== "") return a.trim();
  const n = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return n ? t ? n + "-" + t : n : t || null;
}
function je(e, t) {
  return !t || t === "none" || e === null || e === void 0 ? null : String(e) + "." + t;
}
function Be(e) {
  return !e || typeof e != "string" ? null : e.endsWith(".asc") ? { fieldOrColumn: e.slice(0, -4), direction: "asc" } : e.endsWith(".desc") ? { fieldOrColumn: e.slice(0, -5), direction: "desc" } : null;
}
function We(e, t) {
  return !e || !Array.isArray(t) || t.length === 0 ? null : e + ":" + t.map(encodeURIComponent).join(",");
}
function Ue(e) {
  if (!e || typeof e != "string") return null;
  const t = e.indexOf(":");
  if (t === -1) return null;
  const a = e.slice(0, t), n = e.slice(t + 1), r = n ? n.split(",").map(function(i) {
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  }).filter(Boolean) : [];
  return { key: a, values: r };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = M, window.lnCore.hashGet = Me, window.lnCore.hashSet = Ne, window.lnCore.hashLinkClick = Fe, window.lnCore.resolveHashNamespace = Re, window.lnCore.hashSortEncode = je, window.lnCore.hashSortDecode = Be, window.lnCore.hashFilterEncode = We, window.lnCore.hashFilterDecode = Ue);
function Ve() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = Ve);
const N = /* @__PURE__ */ new Set([
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
function He(e, t) {
  if (e === t) return 0;
  if (!e.length) return t.length;
  if (!t.length) return e.length;
  const a = [];
  for (let n = 0; n <= t.length; n++) a[n] = [n];
  for (let n = 0; n <= e.length; n++) a[0][n] = n;
  for (let n = 1; n <= t.length; n++)
    for (let r = 1; r <= e.length; r++)
      t.charAt(n - 1) === e.charAt(r - 1) ? a[n][r] = a[n - 1][r - 1] : a[n][r] = Math.min(
        a[n - 1][r - 1] + 1,
        a[n][r - 1] + 1,
        a[n - 1][r] + 1
      );
  return a[t.length][e.length];
}
function ze(e, t = N) {
  if (t.has(e)) return null;
  let a = null, n = 1 / 0;
  for (const i of t) {
    const o = He(e, i);
    o < n && (n = o, a = i);
  }
  const r = Math.max(3, Math.floor(e.length * 0.4));
  return n <= r ? a : null;
}
function ie(e) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(e) : e.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Ge(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const l = o.attributes[d];
        if (l.name.startsWith("data-ln-") && l.name.endsWith("-for")) {
          const s = (l.value || "").trim();
          if (!s) {
            n.push({
              type: "id-empty",
              element: o,
              attribute: l.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${o.tagName.toLowerCase()} ${l.name}="">.`
            });
            continue;
          }
          t.getElementById(s) || t.querySelector("#" + ie(s)) || n.push({
            type: "id-unresolved",
            element: o,
            attribute: l.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${o.tagName.toLowerCase()} ${l.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return n;
}
function Qe(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const l = o.attributes[d];
        if (l.name.startsWith("data-ln-") && (l.name.endsWith("-source") || l.name.endsWith("-store")) && l.name !== "data-ln-data-store") {
          const c = (l.value || "").trim();
          if (!c) {
            n.push({
              type: "store-empty",
              element: o,
              attribute: l.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${o.tagName.toLowerCase()} ${l.name}="">.`
            });
            continue;
          }
          const u = ie(c), f = t.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), v = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !v && n.push({
            type: "store-unresolved",
            element: o,
            attribute: l.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${o.tagName.toLowerCase()} ${l.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return n;
}
function Je(e = document) {
  e.ownerDocument;
  const t = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!t) return [];
  const a = [], n = Array.from(t.querySelectorAll("[data-ln-data-store]"));
  t.hasAttribute && t.hasAttribute("data-ln-data-store") && n.unshift(t);
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < n.length; i++) {
    const o = n[i], d = (o.getAttribute("data-ln-data-store") || "").trim();
    d && (r.has(d) || r.set(d, []), r.get(d).push(o));
  }
  for (const [i, o] of r.entries())
    o.length > 1 && a.push({
      type: "store-duplicate",
      storeName: i,
      elements: o,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${i}". Store names must be unique across the document.`
    });
  return a;
}
function Ke(e = document, t = N) {
  const a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const l = o.attributes[d];
        if (l.name.startsWith("data-ln-") && !t.has(l.name)) {
          const s = ze(l.name, t), c = s ? ` Did you mean "${s}"?` : "";
          n.push({
            type: "attribute-unknown",
            element: o,
            attribute: l.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${l.name}" on <${o.tagName.toLowerCase()}>.${c}`
          });
        }
      }
  }
  return n;
}
function q(e = typeof document < "u" ? document : null, t = {}) {
  if (!e)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const a = t.validAttributes || N, n = Ge(e), r = Qe(e), i = Je(e), o = Ke(e, a), d = [
    ...n,
    ...r,
    ...i,
    ...o
  ];
  if (!t.silent)
    for (let l = 0; l < d.length; l++)
      console.warn(d[l].message);
  return {
    idIssues: n,
    storeIssues: r,
    uniquenessIssues: i,
    spellingIssues: o,
    total: d.length
  };
}
let h = null;
function C(e = typeof document < "u" ? document : null, t = 50, a = null) {
  if (!e) return;
  h && (clearTimeout(h), h = null);
  function n() {
    h = setTimeout(() => {
      h = null;
      const r = q(e);
      a && a(r);
    }, t);
  }
  Z() > 0 ? ee(n) : n();
}
function Pe(e, t, a, n) {
  e === "event" ? (console.groupCollapsed("[ln-debug] event", t), console.log("target", a), console.log("detail", n), console.groupEnd()) : e === "attr" && (console.groupCollapsed("[ln-debug] attr", t), console.log("target", a), console.log("old → new", n.oldValue, "→", n.newValue), console.groupEnd());
}
let p = [];
function Xe() {
  p = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && p.push(document.body);
}
function de(e) {
  if (e === window || e === document)
    return p.indexOf(document.body) !== -1;
  for (let t = 0; t < p.length; t++)
    if (p[t].contains(e)) return !0;
  return !1;
}
function Ye(e, t, a, n) {
  de(a) && Pe(e, t, a, n);
}
function O() {
  Xe(), we(p.length > 0 ? Ye : null, p.length > 0 ? de : null);
}
function j() {
  O();
}
function Ze() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, g(function() {
    O(), Le(["data-ln-debug"], O);
  }, "ln-debug")));
}
(function() {
  const e = "data-ln-debug", t = "lnDebug";
  if (typeof window < "u" && window[t] !== void 0) return;
  const a = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Ze();
  function n(i) {
    return this.dom = i, C(i.ownerDocument || document), j(), this;
  }
  n.prototype.verify = function(i, o) {
    return q(i || (this.dom ? this.dom.ownerDocument || this.dom : document), o);
  }, n.prototype.destroy = function() {
    delete this.dom[t], j();
  };
  const r = le(e, t, n, "ln-debug", {
    attributes: a,
    onInit: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    },
    onSubtreeChange: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    }
  });
  r.verify = function(i, o) {
    return q(i || document, o);
  }, r.schedule = function(i, o, d) {
    return C(i || document, o, d);
  };
})();
export {
  C as scheduleVerification,
  q as verifyDOM
};
