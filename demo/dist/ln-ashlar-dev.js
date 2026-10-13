function V() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function q(e) {
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
      if (!q(n))
        return;
    }
    e.apply(console, t);
  };
}
function he(e, t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = e, window.lnCore._debugIsContained = t || null;
}
function me(e, t, a) {
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
function ge(e) {
  const t = e.querySelector('input[name="_method"]');
  return ((t && t.value !== "" ? t.value : e.method) || "").toUpperCase();
}
function ye(e, t) {
  const a = !!(t && t.typed), n = t && t.exclude, r = {}, i = e.elements, l = {};
  if (a)
    for (let d = 0; d < i.length; d++) {
      const o = i[d];
      o.name && o.type === "checkbox" && !o.disabled && (l[o.name] = (l[o.name] || 0) + 1);
    }
  for (let d = 0; d < i.length; d++) {
    const o = i[d];
    if (!(!o.name || o.disabled || o.type === "file" || o.type === "submit" || o.type === "button") && !(n && o.matches && o.matches(n)))
      if (o.type === "checkbox")
        a && l[o.name] === 1 ? r[o.name] = o.checked : (r[o.name] || (r[o.name] = []), o.checked && r[o.name].push(o.value));
      else if (o.type === "radio")
        o.checked && (r[o.name] = o.value);
      else if (o.type === "select-multiple") {
        r[o.name] = [];
        for (let s = 0; s < o.options.length; s++)
          o.options[s].selected && r[o.name].push(o.options[s].value);
      } else if (a && o.type === "hidden")
        r[o.name] = o.value;
      else if (a && (o.type === "number" || o.type === "range")) {
        const s = Number(o.value);
        r[o.name] = o.value === "" || isNaN(s) ? null : s;
      } else
        r[o.name] = o.value;
  }
  return r;
}
function Ce(e) {
  if (typeof e != "string") return !!e;
  const t = e.trim().toLowerCase();
  return t !== "false" && t !== "0" && t !== "" && t !== "off" && t !== "no";
}
function ve(e, t) {
  const a = e.elements, n = [], r = {};
  for (let i = 0; i < a.length; i++) {
    const l = a[i];
    l.name && l.type === "checkbox" && (r[l.name] = (r[l.name] || 0) + 1);
  }
  for (let i = 0; i < a.length; i++) {
    const l = a[i];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const d = l.getAttribute("data-ln-fill-as") || l.name;
    if (!d || !(d in t)) continue;
    const o = t[d];
    if (l.type === "checkbox") {
      if (Array.isArray(o))
        l.checked = o.indexOf(l.value) !== -1;
      else if (r[l.name] > 1) {
        const s = String(o).split(",").map(function(c) {
          return c.trim();
        });
        l.checked = s.indexOf(l.value) !== -1;
      } else
        l.checked = Ce(o);
      n.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(o), n.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(o))
        for (let s = 0; s < l.options.length; s++)
          l.options[s].selected = o.indexOf(l.options[s].value) !== -1;
      n.push(l);
    } else
      l.value = o, l.tagName === "SELECT" && o != null && l.setAttribute("data-ln-value", o), n.push(l);
  }
  return n;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = ve, window.lnCore.serializeForm = ye, window.lnCore.resolveFormMethod = ge);
const H = {};
function Ae(e, t) {
  H[e] = t;
}
function xe(e) {
  return H[e] || { ingress: (t) => t, egress: (t) => t };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Ae, window.lnCore.getDataMapper = xe);
function Se() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, g(function() {
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
  const a = e.toLowerCase().split("-")[0];
  z[a] = t;
}
function _e(e) {
  if (!e) return null;
  const t = e.toLowerCase().split("-")[0];
  return z[t] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = ke, window.lnCore.getLocaleFallback = _e, window.lnCore.ensureLocaleObserver = Se);
const D = {};
function De(e, t) {
  D[e] || (D[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const a = D[e];
  return a ? a.content.cloneNode(!0) : (console.warn("[" + (t || "ln-core") + '] Template "' + e + '" not found'), null);
}
function G(e, t) {
  if (!e || !t) return e;
  const a = e.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < a.length; l++) {
    const d = a[l], o = d.getAttribute("data-ln-field");
    t[o] != null && (d.textContent = t[o]);
  }
  const n = e.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < n.length; l++) {
    const d = n[l], o = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      t[f] != null && d.setAttribute(u, t[f]);
    }
  }
  const r = e.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < r.length; l++) {
    const d = r[l], o = d.getAttribute("data-ln-show");
    o in t && d.classList.toggle("hidden", !t[o]);
  }
  const i = e.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < i.length; l++) {
    const d = i[l], o = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < o.length; s++) {
      const c = o[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in t && d.classList.toggle(u, !!t[f]);
    }
  }
  return e;
}
function Ee(e, t) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", e, t ?? null), e.dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 })));
  const a = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let n = 0; n < a.length; n++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", a[n], t ?? null), a[n].dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 }));
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
  const n = function(i, l) {
    return t[l] !== void 0 ? t[l] : "";
  }, r = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && r.push(e);
  for (let i = 0; i < r.length; i++) {
    const l = r[i], d = l.attributes;
    for (let o = 0; o < d.length; o++) {
      const s = d[o];
      s.value.indexOf("{{") !== -1 && l.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, n));
    }
  }
  return e;
}
function $e(e, t, a, n, r, i) {
  const l = {};
  for (let o = 0; o < e.children.length; o++) {
    const s = e.children[o], c = s.getAttribute("data-ln-render-key");
    c && (l[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let o = 0; o < t.length; o++) {
    const s = t[o], c = String(n(s));
    let u = l[c];
    if (u)
      r(u, s, o);
    else {
      const f = De(a, i);
      if (!f || (Q(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), r(u, s, o);
    }
    d.appendChild(u);
  }
  e.textContent = "", e.appendChild(d);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Q, window.lnCore.fill = G, window.lnCore.lnFill = Ee, window.lnCore.renderList = $e);
function I(e, t, a) {
  const n = e.getAttribute(t);
  return n === null ? a : n;
}
function J(e, t, a) {
  const n = parseInt(e.getAttribute(t), 10);
  return isNaN(n) ? a : n;
}
function K(e, t, a = !1) {
  const n = e.getAttribute(t);
  if (n === null) return !!a;
  const r = n.trim().toLowerCase();
  return !(r === "false" || r === "0");
}
function P(e, t) {
  return (e.getAttribute(t) || "").split(",").map((a) => a.trim()).filter(Boolean);
}
const E = /* @__PURE__ */ new Map();
function X(e, t) {
  const a = (e ? e.join("|") : "") + "::" + t;
  if (E.has(a)) return E.get(a);
  const n = new Set(e || []), r = function(i, l) {
    const d = i.getAttribute(l);
    return d !== null && n.has(d) ? d : t;
  };
  return E.set(a, r), r;
}
function Y(e, t, a) {
  const n = parseFloat(e.getAttribute(t));
  return isNaN(n) ? a : n;
}
function Z(e, t, a) {
  const n = e.getAttribute(t);
  if (!n) return a;
  try {
    return JSON.parse(n);
  } catch {
    return a;
  }
}
function ee(e, t, a, n, r) {
  if (!e || t === null) return !0;
  const i = n || "ln-component", l = e.type;
  if (l === "trigger" || l === "marker" || l === "string" || l === "list" || !l || t === "" && e.fallback !== void 0)
    return !0;
  const d = (o) => {
    r ? console.warn(o, r) : console.warn(o);
  };
  if (l === "boolean") {
    const o = t.trim().toLowerCase();
    return o !== "" && o !== "true" && o !== "false" && o !== "1" && o !== "0" ? (d(`[${i}] Invalid value "${t}" for boolean attribute "${a}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (l === "enum") {
    const o = e.values || [];
    return o.includes(t) ? !0 : (d(`[${i}] Invalid value "${t}" for attribute "${a}". Allowed: ${o.join(", ")}. Fallback: "${e.fallback}".`), !1);
  }
  if (l === "integer") {
    if (!/^-?\d+$/.test(t))
      return d(`[${i}] Invalid integer "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1;
    const o = parseInt(t, 10);
    return e.min !== void 0 && o < e.min ? (d(`[${i}] Value ${o} for attribute "${a}" is less than min (${e.min}).`), !1) : e.max !== void 0 && o > e.max ? (d(`[${i}] Value ${o} for attribute "${a}" is greater than max (${e.max}).`), !1) : !0;
  }
  if (l === "float")
    return isNaN(Number(t)) ? (d(`[${i}] Invalid float "${t}" for attribute "${a}". Fallback: ${e.fallback}.`), !1) : !0;
  if (l === "json")
    try {
      return JSON.parse(t), !0;
    } catch (o) {
      return d(`[${i}] Invalid JSON for attribute "${a}": ${o.message}. Fallback: ${e.fallback}.`), !1;
    }
  return !0;
}
function Ie(e, t, a) {
  for (const n in a) {
    const [r, i, l] = a[n];
    Object.defineProperty(e, n, {
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
function Le(e) {
  const t = {};
  for (const a in e) {
    const n = e[a];
    if (!n || !n.prop) continue;
    let r = n.read;
    if (!r && n.type)
      switch (n.type) {
        case "enum":
          r = X(n.values, n.fallback);
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
    r || (r = I), t[n.prop] = [r, a, n.fallback];
  }
  return t;
}
function Oe(e) {
  const t = {};
  for (const a in e) {
    const n = e[a];
    n && n.effect && (t[a] = n.effect);
  }
  return Object.keys(t).length ? t : null;
}
function qe(e) {
  if (e.onAttrChange && !e.declared) return null;
  const t = /* @__PURE__ */ new Set();
  if (e.effects) for (const a in e.effects) t.add(a);
  if (e.onAttrChange && e.declared) for (const a of e.declared) t.add(a);
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = Ie, window.lnCore.attrSpec = Le, window.lnCore.attrStr = I, window.lnCore.attrInt = J, window.lnCore.attrBool = K, window.lnCore.attrList = P, window.lnCore.attrEnum = X, window.lnCore.attrFloat = Y, window.lnCore.attrJson = Z);
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
function te(e, t, a, n) {
  if (e.nodeType !== 1) return;
  const i = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", l = { selector: t, attribute: a, ComponentFn: n };
  if (e.matches && e.matches(i) && m(e, l), e.querySelectorAll) {
    const d = e.querySelectorAll(i);
    for (let o = 0; o < d.length; o++)
      m(d[o], l);
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
    const n = qe(e);
    if (n === null)
      t.reactiveWildcard.push(e);
    else
      for (const r of n)
        t.byReactive.has(r) || t.byReactive.set(r, []), t.byReactive.get(r).push(e);
  }
  e.persist && t.persist.push(e);
}
function W(e, t, a, n) {
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (!t[i.attribute]) continue;
    const l = i.effects && i.effects[a];
    l ? l(t, a, n) : i.onAttrChange && (!i.declared || i.declared.has(a)) && i.onAttrChange(t, a, n);
  }
}
function Te(e) {
  const t = e.attributeName, a = t.indexOf("data-ln-") === 0, n = oe(), r = n.byAttr.get(t), i = V() && n.byDeclaredAttr && n.byDeclaredAttr.has(t);
  if (!a && !r && !i)
    return;
  const l = e.target;
  if (e.oldValue !== l.getAttribute(t)) {
    if (i && q(l)) {
      const d = n.byDeclaredAttr.get(t), o = l.getAttribute(t);
      for (let s = 0; s < d.length; s++)
        ee(d[s].spec, o, t, d[s].componentTag, l);
    }
    if (window.lnCore._debugSink && (a || r) && window.lnCore._debugSink("attr", t, l, { oldValue: e.oldValue, newValue: l.getAttribute(t) }), a) {
      const d = n.byReactive.get(t);
      d && W(d, l, t, e.oldValue), n.reactiveWildcard.length && W(n.reactiveWildcard, l, t, e.oldValue);
    }
    if (r)
      for (let d = 0; d < r.length; d++) {
        const o = r[d];
        if (o.handler) {
          o.handler(l, t, e.oldValue);
          continue;
        }
        o.onAttributeChange && l[o.attribute] ? o.onAttributeChange(l, t) : (te(l, o.selector, o.attribute, o.ComponentFn), o.onInit && o.onInit(l));
      }
  }
}
function re() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, g(function() {
    new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++)
        try {
          Te(t[a]);
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
        } catch (n) {
          console.error("[" + t.attribute + "] destroy failed", e, n);
        }
      delete e[t.attribute];
    } else t.onDestroy && t.onDestroy(e);
}
function ie(e) {
  const t = T();
  if (!t.length) return;
  const a = e.target;
  if (a) {
    const r = a.nodeType === 1 ? a : a.parentElement;
    if (r && (r.isContentEditable || r.closest && r.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const n = M();
  if (e.target && n.length)
    for (let r = 0; r < n.length; r++) {
      const i = n[r], l = i.query, d = e.target.nodeType === 1 ? e.target.matches && e.target.matches(l) ? e.target : e.target.closest ? e.target.closest(l) : null : e.target.parentElement && e.target.parentElement.closest ? e.target.parentElement.closest(l) : null;
      d && i.onSubtreeChange(d, e);
    }
  for (let r = 0; r < e.addedNodes.length; r++) {
    const i = e.addedNodes[r];
    if (i.nodeType === 1) {
      const l = !!(i.firstElementChild || i.children && i.children.length);
      for (let d = 0; d < t.length; d++) {
        const o = t[d];
        if (o.selector && o.attribute && o.ComponentFn) {
          if (!l)
            i.matches && i.matches(o.query) && m(i, o);
          else if (i.matches && i.matches(o.query) && m(i, o), i.querySelectorAll) {
            const s = i.querySelectorAll(o.query);
            for (let c = 0; c < s.length; c++)
              m(s[c], o);
          }
        }
        o.onInit && o.onInit(i);
      }
    }
  }
  for (let r = 0; r < e.removedNodes.length; r++) {
    const i = e.removedNodes[r];
    if (i.nodeType === 1) {
      if (document.contains(i)) continue;
      const l = !!(i.firstElementChild || i.children && i.children.length);
      for (let d = 0; d < t.length; d++) {
        const o = t[d], s = o.query;
        if (s) {
          if (!l)
            i.matches && i.matches(s) && $(i, o);
          else if (i.matches && i.matches(s) && $(i, o), i.querySelectorAll) {
            const c = i.querySelectorAll(s);
            for (let u = 0; u < c.length; u++)
              $(c[u], o);
          }
        }
      }
    }
  }
}
function de() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, g(function() {
    const e = new MutationObserver(function(t) {
      for (let a = 0; a < t.length; a++) {
        const n = t[a];
        if (n.type === "childList")
          try {
            ie(n);
          } catch (r) {
            console.error("[ln-core] lifecycle handler failed", n.target, r);
          }
      }
    });
    window.lnCore._lifecycleObserver = e, e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Me(e) {
  if (typeof window > "u") return e();
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._lifecycleObserver;
  if (!t) return e();
  const a = t.takeRecords();
  for (let n = 0; n < a.length; n++) {
    const r = a[n];
    if (r.type === "childList")
      try {
        ie(r);
      } catch (i) {
        console.error("[ln-core] lifecycle handler failed", r.target, i);
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
function Ne(e, t) {
  le({ observed: e, handler: t }), re();
}
function Fe(e) {
  T().push(e), e.onSubtreeChange && e.query && M().push(e), de();
}
function se(e, t, a, n, r = {}) {
  const i = r.extraAttributes || [], l = r.onAttributeChange || null, d = r.onSubtreeChange || null, o = r.onInit || null, s = r.onAttrChange || null, c = r.effects || null, u = r.attributes || null, f = u ? Oe(u) : c, v = u ? new Set(Object.keys(u)) : null, we = r.persist || null;
  function y(x) {
    const w = x || document.body;
    if (te(w, e, t, a), u && V())
      for (const b in u) {
        const be = u[b], S = Array.from(w.querySelectorAll("[" + b + "]"));
        w.matches && w.matches("[" + b + "]") && S.push(w);
        for (let k = 0; k < S.length; k++) {
          const _ = S[k];
          q(_) && ee(be, _.getAttribute(b), b, n, _);
        }
      }
    o && o(w);
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
    componentTag: n,
    attributes: u,
    ComponentFn: a,
    onInit: o,
    observed: A.concat(i),
    onAttributeChange: l,
    onAttrChange: s,
    effects: f,
    declared: v,
    persist: we
  }), re();
  const pe = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1, R = r.subtreeQuery || (pe ? e : "[" + e + "]"), j = {
    selector: e,
    attribute: t,
    ComponentFn: a,
    onInit: o,
    onSubtreeChange: d,
    query: R
  };
  T().push(j), d && R && M().push(j), de(), window[t] = y, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = se, window.lnCore.observeLifecycle = Fe, window.lnCore.withoutLifecycle = Me);
  function B() {
    ne() > 0 ? ae(function() {
      y(document.body);
    }) : y(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", B) : B(), y;
}
function ce(e) {
  return (e || "").replace(/^#/, "");
}
function N(e) {
  const t = e === void 0 ? location.hash : e, a = {}, n = ce(t);
  if (!n) return a;
  const r = n.split("&");
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (!l) continue;
    const d = l.indexOf(":"), o = d > -1 ? l.slice(0, d) : l, s = d > -1 ? l.slice(d + 1) : "";
    if (o)
      try {
        a[o] = decodeURIComponent(s);
      } catch {
        a[o] = s;
      }
  }
  return a;
}
function Re(e) {
  if (!e) return null;
  const t = N();
  return e in t ? t[e] : null;
}
function je(e, t) {
  if (!e) return;
  const a = N();
  t == null ? delete a[e] : a[e] = String(t);
  const r = Object.keys(a).map(function(i) {
    const l = a[i];
    return l === "" ? i : i + ":" + encodeURIComponent(l);
  }).join("&");
  ce(location.hash) !== r && (location.hash = r);
}
function Be(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function We(e, t) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const a = e.getAttribute("data-ln-hash");
  if (a && a.trim() !== "") return a.trim();
  const n = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return n ? t ? n + "-" + t : n : t || null;
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
  const a = e.slice(0, t), n = e.slice(t + 1), r = n ? n.split(",").map(function(i) {
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  }).filter(Boolean) : [];
  return { key: a, values: r };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = N, window.lnCore.hashGet = Re, window.lnCore.hashSet = je, window.lnCore.hashLinkClick = Be, window.lnCore.resolveHashNamespace = We, window.lnCore.hashSortEncode = Ue, window.lnCore.hashSortDecode = Ve, window.lnCore.hashFilterEncode = He, window.lnCore.hashFilterDecode = ze);
function Ge() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = Ge);
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
function Qe(e, t) {
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
function Je(e, t = F) {
  if (t.has(e)) return null;
  let a = null, n = 1 / 0;
  for (const i of t) {
    const l = Qe(e, i);
    l < n && (n = l, a = i);
  }
  const r = Math.max(3, Math.floor(e.length * 0.4));
  return n <= r ? a : null;
}
function ue(e) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(e) : e.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Ke(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const o = l.attributes[d];
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
          t.getElementById(s) || t.querySelector("#" + ue(s)) || n.push({
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
function Pe(e = document) {
  const t = e.ownerDocument || e, a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const o = l.attributes[d];
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
          const u = ue(c), f = t.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), v = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !v && n.push({
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
function Xe(e = document) {
  e.ownerDocument;
  const t = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!t) return [];
  const a = [], n = Array.from(t.querySelectorAll("[data-ln-data-store]"));
  t.hasAttribute && t.hasAttribute("data-ln-data-store") && n.unshift(t);
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < n.length; i++) {
    const l = n[i], d = (l.getAttribute("data-ln-data-store") || "").trim();
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
function Ye(e = document, t = F) {
  const a = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!a) return [];
  const n = [], r = [a, ...a.querySelectorAll("*")];
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (l.attributes)
      for (let d = 0; d < l.attributes.length; d++) {
        const o = l.attributes[d];
        if (o.name.startsWith("data-ln-") && !t.has(o.name)) {
          const s = Je(o.name, t), c = s ? ` Did you mean "${s}"?` : "";
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
function L(e = typeof document < "u" ? document : null, t = {}) {
  if (!e)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const a = t.validAttributes || F, n = Ke(e), r = Pe(e), i = Xe(e), l = Ye(e, a), d = [
    ...n,
    ...r,
    ...i,
    ...l
  ];
  if (!t.silent)
    for (let o = 0; o < d.length; o++)
      console.warn(d[o].message);
  return {
    idIssues: n,
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
  function n() {
    h = setTimeout(() => {
      h = null;
      const r = L(e);
      a && a(r);
    }, t);
  }
  ne() > 0 ? ae(n) : n();
}
function Ze(e, t, a, n) {
  e === "event" ? (console.groupCollapsed("[ln-debug] event", t), console.log("target", a), console.log("detail", n), console.groupEnd()) : e === "attr" && (console.groupCollapsed("[ln-debug] attr", t), console.log("target", a), console.log("old → new", n.oldValue, "→", n.newValue), console.groupEnd());
}
let p = [];
function et() {
  p = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && p.push(document.body);
}
function fe(e) {
  if (e === window || e === document)
    return p.indexOf(document.body) !== -1;
  for (let t = 0; t < p.length; t++)
    if (p[t].contains(e)) return !0;
  return !1;
}
function tt(e, t, a, n) {
  fe(a) && Ze(e, t, a, n);
}
function O() {
  et(), he(p.length > 0 ? tt : null, p.length > 0 ? fe : null);
}
function U() {
  O();
}
function nt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, g(function() {
    O(), Ne(["data-ln-debug"], O);
  }, "ln-debug")));
}
(function() {
  const e = "data-ln-debug", t = "lnDebug";
  if (typeof window < "u" && window[t] !== void 0) return;
  const a = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  nt();
  function n(i) {
    return this.dom = i, C(i.ownerDocument || document), U(), this;
  }
  n.prototype.verify = function(i, l) {
    return L(i || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, n.prototype.destroy = function() {
    delete this.dom[t], U();
  };
  const r = se(e, t, n, "ln-debug", {
    attributes: a,
    onInit: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    },
    onSubtreeChange: function(i) {
      typeof document < "u" && C(i && i.ownerDocument ? i.ownerDocument : document);
    }
  });
  r.verify = function(i, l) {
    return L(i || document, l);
  }, r.schedule = function(i, l, d) {
    return C(i || document, l, d);
  };
})();
export {
  C as scheduleVerification,
  L as verifyDOM
};
