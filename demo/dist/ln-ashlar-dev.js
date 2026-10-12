function V() {
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
      let o = null;
      for (let r = 1; r < t.length; r++)
        if (t[r] && t[r].nodeType === 1) {
          o = t[r];
          break;
        }
      if (!L(o))
        return;
    }
    e.apply(console, t);
  };
}
function be(e, t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = e, window.lnCore._debugIsContained = t || null;
}
function he(e, t, a) {
  const o = a || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", t, e, o), e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    detail: o
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
function me(e) {
  const t = e.querySelector('input[name="_method"]');
  return ((t && t.value !== "" ? t.value : e.method) || "").toUpperCase();
}
function ge(e, t) {
  const a = !!(t && t.typed), o = t && t.exclude, r = {}, i = e.elements, l = {};
  if (a)
    for (let d = 0; d < i.length; d++) {
      const n = i[d];
      n.name && n.type === "checkbox" && !n.disabled && (l[n.name] = (l[n.name] || 0) + 1);
    }
  for (let d = 0; d < i.length; d++) {
    const n = i[d];
    if (!(!n.name || n.disabled || n.type === "file" || n.type === "submit" || n.type === "button") && !(o && n.matches && n.matches(o)))
      if (n.type === "checkbox")
        a && l[n.name] === 1 ? r[n.name] = n.checked : (r[n.name] || (r[n.name] = []), n.checked && r[n.name].push(n.value));
      else if (n.type === "radio")
        n.checked && (r[n.name] = n.value);
      else if (n.type === "select-multiple") {
        r[n.name] = [];
        for (let s = 0; s < n.options.length; s++)
          n.options[s].selected && r[n.name].push(n.options[s].value);
      } else if (a && n.type === "hidden")
        r[n.name] = n.value;
      else if (a && (n.type === "number" || n.type === "range")) {
        const s = Number(n.value);
        r[n.name] = n.value === "" || isNaN(s) ? null : s;
      } else
        r[n.name] = n.value;
  }
  return r;
}
function ye(e) {
  if (typeof e != "string") return !!e;
  const t = e.trim().toLowerCase();
  return t !== "false" && t !== "0" && t !== "" && t !== "off" && t !== "no";
}
function Ce(e, t) {
  const a = e.elements, o = [], r = {};
  for (let i = 0; i < a.length; i++) {
    const l = a[i];
    l.name && l.type === "checkbox" && (r[l.name] = (r[l.name] || 0) + 1);
  }
  for (let i = 0; i < a.length; i++) {
    const l = a[i];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const d = l.getAttribute("data-ln-fill-as") || l.name;
    if (!d || !(d in t)) continue;
    const n = t[d];
    if (l.type === "checkbox") {
      if (Array.isArray(n))
        l.checked = n.indexOf(l.value) !== -1;
      else if (r[l.name] > 1) {
        const s = String(n).split(",").map(function(c) {
          return c.trim();
        });
        l.checked = s.indexOf(l.value) !== -1;
      } else
        l.checked = ye(n);
      o.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(n), o.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(n))
        for (let s = 0; s < l.options.length; s++)
          l.options[s].selected = n.indexOf(l.options[s].value) !== -1;
      o.push(l);
    } else
      l.value = n, l.tagName === "SELECT" && n != null && l.setAttribute("data-ln-value", n), o.push(l);
  }
  return o;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = Ce, window.lnCore.serializeForm = ge, window.lnCore.resolveFormMethod = me);
const H = {};
function ve(e, t) {
  H[e] = t;
}
function Ae(e) {
  return H[e] || { ingress: (t) => t, egress: (t) => t };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ve, window.lnCore.getDataMapper = Ae);
function xe() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, g(function() {
    new MutationObserver(function() {
      he(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const z = {};
function Se(e, t) {
  if (!e || typeof t != "object") return;
  const a = e.toLowerCase().split("-")[0];
  z[a] = t;
}
function ke(e) {
  if (!e) return null;
  const t = e.toLowerCase().split("-")[0];
  return z[t] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Se, window.lnCore.getLocaleFallback = ke, window.lnCore.ensureLocaleObserver = xe);
const D = {};
function _e(e, t) {
  D[e] || (D[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const a = D[e];
  return a ? a.content.cloneNode(!0) : (console.warn("[" + (t || "ln-core") + '] Template "' + e + '" not found'), null);
}
function G(e, t) {
  if (!e || !t) return e;
  const a = e.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < a.length; l++) {
    const d = a[l], n = d.getAttribute("data-ln-field");
    t[n] != null && (d.textContent = t[n]);
  }
  const o = e.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < o.length; l++) {
    const d = o[l], n = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < n.length; s++) {
      const c = n[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      t[f] != null && d.setAttribute(u, t[f]);
    }
  }
  const r = e.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < r.length; l++) {
    const d = r[l], n = d.getAttribute("data-ln-show");
    n in t && d.classList.toggle("hidden", !t[n]);
  }
  const i = e.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < i.length; l++) {
    const d = i[l], n = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < n.length; s++) {
      const c = n[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in t && d.classList.toggle(u, !!t[f]);
    }
  }
  return e;
}
function De(e, t) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", e, t ?? null), e.dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 })));
  const a = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let o = 0; o < a.length; o++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", a[o], t ?? null), a[o].dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 }));
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(e) {
  if (!(!e.target.matches || !e.target.matches("[data-ln-fillable]")))
    if (e.detail)
      G(e.target, e.detail);
    else {
      const t = e.target.querySelectorAll("[data-ln-field]");
      for (let a = 0; a < t.length; a++)
        t[a].textContent = "";
    }
})));
function Q(e, t) {
  if (!e || !t) return e;
  const a = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (; a.nextNode(); ) {
    const i = a.currentNode;
    i.textContent.indexOf("{{") !== -1 && (i.textContent = i.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, d) {
        return t[d] !== void 0 ? t[d] : "";
      }
    ));
  }
  const o = function(i, l) {
    return t[l] !== void 0 ? t[l] : "";
  }, r = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && r.push(e);
  for (let i = 0; i < r.length; i++) {
    const l = r[i], d = l.attributes;
    for (let n = 0; n < d.length; n++) {
      const s = d[n];
      s.value.indexOf("{{") !== -1 && l.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, o));
    }
  }
  return e;
}
function Ee(e, t, a, o, r, i) {
  const l = {};
  for (let n = 0; n < e.children.length; n++) {
    const s = e.children[n], c = s.getAttribute("data-ln-render-key");
    c && (l[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let n = 0; n < t.length; n++) {
    const s = t[n], c = String(o(s));
    let u = l[c];
    if (u)
      r(u, s, n);
    else {
      const f = _e(a, i);
      if (!f || (Q(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), r(u, s, n);
    }
    d.appendChild(u);
  }
  e.textContent = "", e.appendChild(d);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Q, window.lnCore.fill = G, window.lnCore.lnFill = De, window.lnCore.renderList = Ee);
function I(e, t, a) {
  const o = e.getAttribute(t);
  return o === null ? a : o;
}
function J(e, t, a) {
  const o = parseInt(e.getAttribute(t), 10);
  return isNaN(o) ? a : o;
}
function K(e, t, a = !1) {
  const o = e.getAttribute(t);
  if (o === null) return !!a;
  const r = o.trim().toLowerCase();
  return !(r === "false" || r === "0");
}
function P(e, t) {
  return (e.getAttribute(t) || "").split(",").map((a) => a.trim()).filter(Boolean);
}
const E = /* @__PURE__ */ new Map();
function X(e, t) {
  const a = (e ? e.join("|") : "") + "::" + t;
  if (E.has(a)) return E.get(a);
  const o = new Set(e || []), r = function(i, l) {
    const d = i.getAttribute(l);
    return d !== null && o.has(d) ? d : t;
  };
  return E.set(a, r), r;
}
function Y(e, t, a) {
  const o = parseFloat(e.getAttribute(t));
  return isNaN(o) ? a : o;
}
function Z(e, t, a) {
  const o = e.getAttribute(t);
  if (!o) return a;
  try {
    return JSON.parse(o);
  } catch {
    return a;
  }
}
function ee(e, t, a, o, r) {
  if (!e || t === null) return !0;
  const i = o || "ln-component", l = e.type;
  if (l === "trigger" || l === "marker" || l === "string" || l === "list" || !l || t === "" && e.fallback !== void 0)
    return !0;
  const d = (n) => {
    r ? console.warn(n, r) : console.warn(n);
  };
  if (l === "boolean") {
    const n = t.trim().toLowerCase();
    return n !== "" && n !== "true" && n !== "false" && n !== "1" && n !== "0" ? (d(`[${i}] Invalid value "${t}" for boolean attribute "${a}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (l === "enum") {
    const n = e.values || [];
    return n.includes(t) ? !0 : (d(`[${i}] Invalid value "${t}" for attribute "${a}". Allowed: ${n.join(", ")}. Fallback: "${e.fallback}".`), !1);
  }
  if (l === "integer") {
    if (!/^-?\d+$/.test(t))
      return d(`[${i}] Invalid integer "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1;
    const n = parseInt(t, 10);
    return e.min !== void 0 && n < e.min ? (d(`[${i}] Value ${n} for attribute "${a}" is less than min (${e.min}).`), !1) : e.max !== void 0 && n > e.max ? (d(`[${i}] Value ${n} for attribute "${a}" is greater than max (${e.max}).`), !1) : !0;
  }
  if (l === "float")
    return isNaN(Number(t)) ? (d(`[${i}] Invalid float "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1) : !0;
  if (l === "json")
    try {
      return JSON.parse(t), !0;
    } catch (n) {
      return d(`[${i}] Invalid JSON for attribute "${a}": ${n.message}. Fallback: ${e.fallback}.`), !1;
    }
  return !0;
}
function $e(e, t, a) {
  for (const o in a) {
    const [r, i, l] = a[o];
    Object.defineProperty(e, o, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return r(t, i, l);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return e;
}
function Ie(e) {
  const t = {};
  for (const a in e) {
    const o = e[a];
    if (!o || !o.prop) continue;
    let r = o.read;
    if (!r && o.type)
      switch (o.type) {
        case "enum":
          r = X(o.values, o.fallback);
          break;
        case "integer":
          r = J;
          break;
        case "float":
          r = Y;
          break;
        case "boolean":
          r = K;
          break;
        case "list":
          r = P;
          break;
        case "json":
          r = Z;
          break;
        case "string":
        default:
          r = I;
          break;
      }
    r || (r = I), t[o.prop] = [r, a, o.fallback];
  }
  return t;
}
function qe(e) {
  const t = {};
  for (const a in e) {
    const o = e[a];
    o && o.effect && (t[a] = o.effect);
  }
  return Object.keys(t).length ? t : null;
}
function Oe(e) {
  if (e.onAttrChange && !e.declared) return null;
  const t = /* @__PURE__ */ new Set();
  if (e.effects) for (const a in e.effects) t.add(a);
  if (e.onAttrChange && e.declared) for (const a of e.declared) t.add(a);
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = $e, window.lnCore.attrSpec = Ie, window.lnCore.attrStr = I, window.lnCore.attrInt = J, window.lnCore.attrBool = K, window.lnCore.attrList = P, window.lnCore.attrEnum = X, window.lnCore.attrFloat = Y, window.lnCore.attrJson = Z);
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
function te(e, t, a, o) {
  if (e.nodeType !== 1) return;
  const i = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", l = { selector: t, attribute: a, ComponentFn: o };
  if (e.matches && e.matches(i) && m(e, l), e.querySelectorAll) {
    const d = e.querySelectorAll(i);
    for (let n = 0; n < d.length; n++)
      m(d[n], l);
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
function le(e) {
  const t = oe(), a = e.observed || [];
  for (let o = 0; o < a.length; o++) {
    const r = a[o];
    t.byAttr.has(r) || t.byAttr.set(r, []), t.byAttr.get(r).push(e);
  }
  if (t.byDeclaredAttr = t.byDeclaredAttr || /* @__PURE__ */ new Map(), e.attributes)
    for (const o in e.attributes) {
      t.byDeclaredAttr.has(o) || t.byDeclaredAttr.set(o, []);
      const r = t.byDeclaredAttr.get(o);
      r.some((i) => i.componentTag === e.componentTag) || r.push({
        spec: e.attributes[o],
        componentTag: e.componentTag
      });
    }
  if (e.onAttrChange || e.effects) {
    t.reactive.push(e);
    const o = Oe(e);
    if (o === null)
      t.reactiveWildcard.push(e);
    else
      for (const r of o)
        t.byReactive.has(r) || t.byReactive.set(r, []), t.byReactive.get(r).push(e);
  }
  e.persist && t.persist.push(e);
}
function W(e, t, a, o) {
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (!t[i.attribute]) continue;
    const l = i.effects && i.effects[a];
    l ? l(t, a, o) : i.onAttrChange && (!i.declared || i.declared.has(a)) && i.onAttrChange(t, a, o);
  }
}
function Le(e) {
  const t = e.attributeName, a = t.indexOf("data-ln-") === 0, o = oe(), r = o.byAttr.get(t), i = V() && o.byDeclaredAttr && o.byDeclaredAttr.has(t);
  if (!a && !r && !i)
    return;
  const l = e.target;
  if (e.oldValue !== l.getAttribute(t)) {
    if (i && L(l)) {
      const d = o.byDeclaredAttr.get(t), n = l.getAttribute(t);
      for (let s = 0; s < d.length; s++)
        ee(d[s].spec, n, t, d[s].componentTag, l);
    }
    if (window.lnCore._debugSink && (a || r) && window.lnCore._debugSink("attr", t, l, { oldValue: e.oldValue, newValue: l.getAttribute(t) }), a) {
      const d = o.byReactive.get(t);
      d && W(d, l, t, e.oldValue), o.reactiveWildcard.length && W(o.reactiveWildcard, l, t, e.oldValue);
    }
    if (r)
      for (let d = 0; d < r.length; d++) {
        const n = r[d];
        if (n.handler) {
          n.handler(l, t, e.oldValue);
          continue;
        }
        n.onAttributeChange && l[n.attribute] ? n.onAttributeChange(l, t) : (te(l, n.selector, n.attribute, n.ComponentFn), n.onInit && n.onInit(l));
      }
  }
}
function re() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, g(function() {
    new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++)
        try {
          Le(t[a]);
        } catch (o) {
          console.error("[ln-core] mutation handler failed", t[a].target, o);
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
function M() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function $(e, t) {
  if (!document.contains(e))
    if (t.attribute) {
      const a = e[t.attribute];
      if (a && typeof a.destroy == "function")
        try {
          a.destroy();
        } catch (o) {
          console.error("[" + t.attribute + "] destroy failed", e, o);
        }
      delete e[t.attribute];
    } else t.onDestroy && t.onDestroy(e);
}
function Te(e) {
  const t = T();
  if (!t.length) return;
  const a = e.target;
  if (a) {
    const r = a.nodeType === 1 ? a : a.parentElement;
    if (r && (r.isContentEditable || r.closest && r.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const o = M();
  if (e.target && o.length)
    for (let r = 0; r < o.length; r++) {
      const i = o[r], l = i.query, d = e.target.nodeType === 1 ? e.target.matches && e.target.matches(l) ? e.target : e.target.closest ? e.target.closest(l) : null : e.target.parentElement && e.target.parentElement.closest ? e.target.parentElement.closest(l) : null;
      d && i.onSubtreeChange(d, e);
    }
  for (let r = 0; r < e.addedNodes.length; r++) {
    const i = e.addedNodes[r];
    if (i.nodeType === 1) {
      const l = !!(i.firstElementChild || i.children && i.children.length);
      for (let d = 0; d < t.length; d++) {
        const n = t[d];
        if (n.selector && n.attribute && n.ComponentFn) {
          if (!l)
            i.matches && i.matches(n.query) && m(i, n);
          else if (i.matches && i.matches(n.query) && m(i, n), i.querySelectorAll) {
            const s = i.querySelectorAll(n.query);
            for (let c = 0; c < s.length; c++)
              m(s[c], n);
          }
        }
        n.onInit && n.onInit(i);
      }
    }
  }
  for (let r = 0; r < e.removedNodes.length; r++) {
    const i = e.removedNodes[r];
    if (i.nodeType === 1) {
      const l = !!(i.firstElementChild || i.children && i.children.length);
      for (let d = 0; d < t.length; d++) {
        const n = t[d], s = n.query;
        if (s) {
          if (!l)
            i.matches && i.matches(s) && $(i, n);
          else if (i.matches && i.matches(s) && $(i, n), i.querySelectorAll) {
            const c = i.querySelectorAll(s);
            for (let u = 0; u < c.length; u++)
              $(c[u], n);
          }
        }
      }
    }
  }
}
function ie() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, g(function() {
    new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++) {
        const o = t[a];
        if (o.type === "childList")
          try {
            Te(o);
          } catch (r) {
            console.error("[ln-core] lifecycle handler failed", o.target, r);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Me(e, t) {
  le({ observed: e, handler: t }), re();
}
function Ne(e) {
  T().push(e), e.onSubtreeChange && e.query && M().push(e), ie();
}
function de(e, t, a, o, r = {}) {
  const i = r.extraAttributes || [], l = r.onAttributeChange || null, d = r.onSubtreeChange || null, n = r.onInit || null, s = r.onAttrChange || null, c = r.effects || null, u = r.attributes || null, f = u ? qe(u) : c, v = u ? new Set(Object.keys(u)) : null, fe = r.persist || null;
  function y(x) {
    const w = x || document.body;
    if (te(w, e, t, a), u && V())
      for (const b in u) {
        const pe = u[b], S = Array.from(w.querySelectorAll("[" + b + "]"));
        w.matches && w.matches("[" + b + "]") && S.push(w);
        for (let k = 0; k < S.length; k++) {
          const _ = S[k];
          L(_) && ee(pe, _.getAttribute(b), b, o, _);
        }
      }
    n && n(w);
  }
  const A = [];
  if (e.indexOf("[") !== -1) {
    const x = /\[([\w-]+)/g;
    let w;
    for (; (w = x.exec(e)) !== null; )
      A.push(w[1]);
  } else
    A.push(e);
  le({
    selector: e,
    attribute: t,
    componentTag: o,
    attributes: u,
    ComponentFn: a,
    onInit: n,
    observed: A.concat(i),
    onAttributeChange: l,
    onAttrChange: s,
    effects: f,
    declared: v,
    persist: fe
  }), re();
  const we = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1, R = r.subtreeQuery || (we ? e : "[" + e + "]"), j = {
    selector: e,
    attribute: t,
    ComponentFn: a,
    onInit: n,
    onSubtreeChange: d,
    query: R
  };
  T().push(j), d && R && M().push(j), ie(), window[t] = y, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = de, window.lnCore.observeLifecycle = Ne);
  function B() {
    ne() > 0 ? ae(function() {
      y(document.body);
    }) : y(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", B) : B(), y;
}
function se(e) {
  return (e || "").replace(/^#/, "");
}
function N(e) {
  const t = e === void 0 ? location.hash : e, a = {}, o = se(t);
  if (!o) return a;
  const r = o.split("&");
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (!l) continue;
    const d = l.indexOf(":"), n = d > -1 ? l.slice(0, d) : l, s = d > -1 ? l.slice(d + 1) : "";
    if (n)
      try {
        a[n] = decodeURIComponent(s);
      } catch {
        a[n] = s;
      }
  }
  return a;
}
function Fe(e) {
  if (!e) return null;
  const t = N();
  return e in t ? t[e] : null;
}
function Re(e, t) {
  if (!e) return;
  const a = N();
  t == null ? delete a[e] : a[e] = String(t);
  const r = Object.keys(a).map(function(i) {
    const l = a[i];
    return l === "" ? i : i + ":" + encodeURIComponent(l);
  }).join("&");
  se(location.hash) !== r && (location.hash = r);
}
function je(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function Be(e, t) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const a = e.getAttribute("data-ln-hash");
  if (a && a.trim() !== "") return a.trim();
  const o = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return o ? t ? o + "-" + t : o : t || null;
}
function We(e, t) {
  return !t || t === "none" || e === null || e === void 0 ? null : String(e) + "." + t;
}
function Ue(e) {
  return !e || typeof e != "string" ? null : e.endsWith(".asc") ? { fieldOrColumn: e.slice(0, -4), direction: "asc" } : e.endsWith(".desc") ? { fieldOrColumn: e.slice(0, -5), direction: "desc" } : null;
}
function Ve(e, t) {
  return !e || !Array.isArray(t) || t.length === 0 ? null : e + ":" + t.map(encodeURIComponent).join(",");
}
function He(e) {
  if (!e || typeof e != "string") return null;
  const t = e.indexOf(":");
  if (t === -1) return null;
  const a = e.slice(0, t), o = e.slice(t + 1), r = o ? o.split(",").map(function(i) {
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  }).filter(Boolean) : [];
  return { key: a, values: r };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = N, window.lnCore.hashGet = Fe, window.lnCore.hashSet = Re, window.lnCore.hashLinkClick = je, window.lnCore.resolveHashNamespace = Be, window.lnCore.hashSortEncode = We, window.lnCore.hashSortDecode = Ue, window.lnCore.hashFilterEncode = Ve, window.lnCore.hashFilterDecode = He);
function ze() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = ze);
const F = /* @__PURE__ */ new Set([
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
function Ge(e, t) {
  if (e === t) return 0;
  if (!e.length) return t.length;
  if (!t.length) return e.length;
  const a = [];
  for (let o = 0; o <= t.length; o++) a[o] = [o];
  for (let o = 0; o <= e.length; o++) a[0][o] = o;
  for (let o = 1; o <= t.length; o++)
    for (let r = 1; r <= e.length; r++)
      t.charAt(o - 1) === e.charAt(r - 1) ? a[o][r] = a[o - 1][r - 1] : a[o][r] = Math.min(
        a[o - 1][r - 1] + 1,
        a[o][r - 1] + 1,
        a[o - 1][r] + 1
      );
  return a[t.length][e.length];
}
function Qe(e, t = F) {
  if (t.has(e)) return null;
  let a = null, o = 1 / 0;
  for (const i of t) {
    const l = Ge(e, i);
    l < o && (o = l, a = i);
  }
  const r = Math.max(3, Math.floor(e.length * 0.4));
  return o <= r ? a : null;
}
function ce(e) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(e) : e.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Je(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const o = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const n = l.attributes[d];
        if (n.name.startsWith("data-ln-") && n.name.endsWith("-for")) {
          const s = (n.value || "").trim();
          if (!s) {
            o.push({
              type: "id-empty",
              element: l,
              attribute: n.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${n.name}="">.`
            });
            continue;
          }
          t.getElementById(s) || t.querySelector("#" + ce(s)) || o.push({
            type: "id-unresolved",
            element: l,
            attribute: n.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${n.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return o;
}
function Ke(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const o = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const n = l.attributes[d];
        if (n.name.startsWith("data-ln-") && (n.name.endsWith("-source") || n.name.endsWith("-store")) && n.name !== "data-ln-data-store") {
          const c = (n.value || "").trim();
          if (!c) {
            o.push({
              type: "store-empty",
              element: l,
              attribute: n.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${n.name}="">.`
            });
            continue;
          }
          const u = ce(c), f = t.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), v = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !v && o.push({
            type: "store-unresolved",
            element: l,
            attribute: n.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${n.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return o;
}
function Pe(e = document) {
  e.ownerDocument;
  const t = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!t) return [];
  const a = [], o = Array.from(t.querySelectorAll("[data-ln-data-store]"));
  t.hasAttribute && t.hasAttribute("data-ln-data-store") && o.unshift(t);
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < o.length; i++) {
    const l = o[i], d = (l.getAttribute("data-ln-data-store") || "").trim();
    d && (r.has(d) || r.set(d, []), r.get(d).push(l));
  }
  for (const [i, l] of r.entries())
    l.length > 1 && a.push({
      type: "store-duplicate",
      storeName: i,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${i}". Store names must be unique across the document.`
    });
  return a;
}
function Xe(e = document, t = F) {
  const a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const o = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const n = l.attributes[d];
        if (n.name.startsWith("data-ln-") && !t.has(n.name)) {
          const s = Qe(n.name, t), c = s ? ` Did you mean "${s}"?` : "";
          o.push({
            type: "attribute-unknown",
            element: l,
            attribute: n.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${n.name}" on <${l.tagName.toLowerCase()}>.${c}`
          });
        }
      }
  }
  return o;
}
function q(e = typeof document < "u" ? document : null, t = {}) {
  if (!e)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const a = t.validAttributes || F, o = Je(e), r = Ke(e), i = Pe(e), l = Xe(e, a), d = [
    ...o,
    ...r,
    ...i,
    ...l
  ];
  if (!t.silent)
    for (let n = 0; n < d.length; n++)
      console.warn(d[n].message);
  return {
    idIssues: o,
    storeIssues: r,
    uniquenessIssues: i,
    spellingIssues: l,
    total: d.length
  };
}
let h = null;
function C(e = typeof document < "u" ? document : null, t = 50, a = null) {
  if (!e) return;
  h && (clearTimeout(h), h = null);
  function o() {
    h = setTimeout(() => {
      h = null;
      const r = q(e);
      a && a(r);
    }, t);
  }
  ne() > 0 ? ae(o) : o();
}
function Ye(e, t, a, o) {
  e === "event" ? (console.groupCollapsed("[ln-debug] event", t), console.log("target", a), console.log("detail", o), console.groupEnd()) : e === "attr" && (console.groupCollapsed("[ln-debug] attr", t), console.log("target", a), console.log("old → new", o.oldValue, "→", o.newValue), console.groupEnd());
}
let p = [];
function Ze() {
  p = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && p.push(document.body);
}
function ue(e) {
  if (e === window || e === document)
    return p.indexOf(document.body) !== -1;
  for (let t = 0; t < p.length; t++)
    if (p[t].contains(e)) return !0;
  return !1;
}
function et(e, t, a, o) {
  ue(a) && Ye(e, t, a, o);
}
function O() {
  Ze(), be(p.length > 0 ? et : null, p.length > 0 ? ue : null);
}
function U() {
  O();
}
function tt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, g(function() {
    O(), Me(["data-ln-debug"], O);
  }, "ln-debug")));
}
(function() {
  const e = "data-ln-debug", t = "lnDebug";
  if (typeof window < "u" && window[t] !== void 0) return;
  const a = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  tt();
  function o(i) {
    return this.dom = i, C(i.ownerDocument || document), U(), this;
  }
  o.prototype.verify = function(i, l) {
    return q(i || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, o.prototype.destroy = function() {
    delete this.dom[t], U();
  };
  const r = de(e, t, o, "ln-debug", {
    attributes: a,
    onInit: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    },
    onSubtreeChange: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    }
  });
  r.verify = function(i, l) {
    return q(i || document, l);
  }, r.schedule = function(i, l, d) {
    return C(i || document, l, d);
  };
})();
export {
  C as scheduleVerification,
  q as verifyDOM
};
