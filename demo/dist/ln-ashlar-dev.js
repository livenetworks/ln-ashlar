function R() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
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
function se(e, t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = e, window.lnCore._debugIsContained = t || null;
}
function ce(e, t, n) {
  const a = n || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", t, e, a), e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    detail: a
  }));
}
function m(e, t) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      m(e, t);
    }), console.warn("[" + t + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  e();
}
function ue(e) {
  const t = e.querySelector('input[name="_method"]');
  return ((t && t.value !== "" ? t.value : e.method) || "").toUpperCase();
}
function fe(e, t) {
  const n = !!(t && t.typed), a = t && t.exclude, l = {}, i = e.elements, o = {};
  if (n)
    for (let d = 0; d < i.length; d++) {
      const r = i[d];
      r.name && r.type === "checkbox" && !r.disabled && (o[r.name] = (o[r.name] || 0) + 1);
    }
  for (let d = 0; d < i.length; d++) {
    const r = i[d];
    if (!(!r.name || r.disabled || r.type === "file" || r.type === "submit" || r.type === "button") && !(a && r.matches && r.matches(a)))
      if (r.type === "checkbox")
        n && o[r.name] === 1 ? l[r.name] = r.checked : (l[r.name] || (l[r.name] = []), r.checked && l[r.name].push(r.value));
      else if (r.type === "radio")
        r.checked && (l[r.name] = r.value);
      else if (r.type === "select-multiple") {
        l[r.name] = [];
        for (let s = 0; s < r.options.length; s++)
          r.options[s].selected && l[r.name].push(r.options[s].value);
      } else if (n && r.type === "hidden")
        l[r.name] = r.value;
      else if (n && (r.type === "number" || r.type === "range")) {
        const s = Number(r.value);
        l[r.name] = r.value === "" || isNaN(s) ? null : s;
      } else
        l[r.name] = r.value;
  }
  return l;
}
function we(e) {
  if (typeof e != "string") return !!e;
  const t = e.trim().toLowerCase();
  return t !== "false" && t !== "0" && t !== "" && t !== "off" && t !== "no";
}
function pe(e, t) {
  const n = e.elements, a = [], l = {};
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    o.name && o.type === "checkbox" && (l[o.name] = (l[o.name] || 0) + 1);
  }
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    if (o.type === "file" || o.type === "submit" || o.type === "button") continue;
    const d = o.getAttribute("data-ln-fill-as") || o.name;
    if (!d || !(d in t)) continue;
    const r = t[d];
    if (o.type === "checkbox") {
      if (Array.isArray(r))
        o.checked = r.indexOf(o.value) !== -1;
      else if (l[o.name] > 1) {
        const s = String(r).split(",").map(function(c) {
          return c.trim();
        });
        o.checked = s.indexOf(o.value) !== -1;
      } else
        o.checked = we(r);
      a.push(o);
    } else if (o.type === "radio")
      o.checked = o.value === String(r), a.push(o);
    else if (o.type === "select-multiple") {
      if (Array.isArray(r))
        for (let s = 0; s < o.options.length; s++)
          o.options[s].selected = r.indexOf(o.options[s].value) !== -1;
      a.push(o);
    } else
      o.value = r, o.tagName === "SELECT" && r != null && o.setAttribute("data-ln-value", r), a.push(o);
  }
  return a;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = pe, window.lnCore.serializeForm = fe, window.lnCore.resolveFormMethod = ue);
const j = {};
function be(e, t) {
  j[e] = t;
}
function he(e) {
  return j[e] || { ingress: (t) => t, egress: (t) => t };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = be, window.lnCore.getDataMapper = he);
function me() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, m(function() {
    new MutationObserver(function() {
      ce(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const B = {};
function ge(e, t) {
  if (!e || typeof t != "object") return;
  const n = e.toLowerCase().split("-")[0];
  B[n] = t;
}
function ye(e) {
  if (!e) return null;
  const t = e.toLowerCase().split("-")[0];
  return B[t] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = ge, window.lnCore.getLocaleFallback = ye, window.lnCore.ensureLocaleObserver = me);
const _ = {};
function Ce(e, t) {
  _[e] || (_[e] = document.querySelector('[data-ln-template="' + e + '"]'));
  const n = _[e];
  return n ? n.content.cloneNode(!0) : (console.warn("[" + (t || "ln-core") + '] Template "' + e + '" not found'), null);
}
function W(e, t) {
  if (!e || !t) return e;
  const n = e.querySelectorAll("[data-ln-field]");
  for (let o = 0; o < n.length; o++) {
    const d = n[o], r = d.getAttribute("data-ln-field");
    t[r] != null && (d.textContent = t[r]);
  }
  const a = e.querySelectorAll("[data-ln-attr]");
  for (let o = 0; o < a.length; o++) {
    const d = a[o], r = d.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < r.length; s++) {
      const c = r[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      t[f] != null && d.setAttribute(u, t[f]);
    }
  }
  const l = e.querySelectorAll("[data-ln-show]");
  for (let o = 0; o < l.length; o++) {
    const d = l[o], r = d.getAttribute("data-ln-show");
    r in t && d.classList.toggle("hidden", !t[r]);
  }
  const i = e.querySelectorAll("[data-ln-class]");
  for (let o = 0; o < i.length; o++) {
    const d = i[o], r = d.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < r.length; s++) {
      const c = r[s].trim().split(":");
      if (c.length !== 2) continue;
      const u = c[0].trim(), f = c[1].trim();
      f in t && d.classList.toggle(u, !!t[f]);
    }
  }
  return e;
}
function ve(e, t) {
  e.matches && e.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", e, t ?? null), e.dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 })));
  const n = e.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let a = 0; a < n.length; a++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", n[a], t ?? null), n[a].dispatchEvent(new CustomEvent("ln-fill", { detail: t ?? null, bubbles: !0 }));
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(e) {
  if (!(!e.target.matches || !e.target.matches("[data-ln-fillable]")))
    if (e.detail)
      W(e.target, e.detail);
    else {
      const t = e.target.querySelectorAll("[data-ln-field]");
      for (let n = 0; n < t.length; n++)
        t[n].textContent = "";
    }
})));
function U(e, t) {
  if (!e || !t) return e;
  const n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (; n.nextNode(); ) {
    const i = n.currentNode;
    i.textContent.indexOf("{{") !== -1 && (i.textContent = i.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(o, d) {
        return t[d] !== void 0 ? t[d] : "";
      }
    ));
  }
  const a = function(i, o) {
    return t[o] !== void 0 ? t[o] : "";
  }, l = Array.from(e.querySelectorAll("*"));
  e.nodeType === 1 && l.push(e);
  for (let i = 0; i < l.length; i++) {
    const o = l[i], d = o.attributes;
    for (let r = 0; r < d.length; r++) {
      const s = d[r];
      s.value.indexOf("{{") !== -1 && o.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return e;
}
function Ae(e, t, n, a, l, i) {
  const o = {};
  for (let r = 0; r < e.children.length; r++) {
    const s = e.children[r], c = s.getAttribute("data-ln-render-key");
    c && (o[c] = s);
  }
  const d = document.createDocumentFragment();
  for (let r = 0; r < t.length; r++) {
    const s = t[r], c = String(a(s));
    let u = o[c];
    if (u)
      l(u, s, r);
    else {
      const f = Ce(n, i);
      if (!f || (U(f, s), u = f.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", c), l(u, s, r);
    }
    d.appendChild(u);
  }
  e.textContent = "", e.appendChild(d);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = U, window.lnCore.fill = W, window.lnCore.lnFill = ve, window.lnCore.renderList = Ae);
function $(e, t, n) {
  const a = e.getAttribute(t);
  return a === null ? n : a;
}
function V(e, t, n) {
  const a = parseInt(e.getAttribute(t), 10);
  return isNaN(a) ? n : a;
}
function H(e, t, n = !1) {
  const a = e.getAttribute(t);
  if (a === null) return !!n;
  const l = a.trim().toLowerCase();
  return !(l === "false" || l === "0");
}
function z(e, t) {
  return (e.getAttribute(t) || "").split(",").map((n) => n.trim()).filter(Boolean);
}
const D = /* @__PURE__ */ new Map();
function G(e, t) {
  const n = (e ? e.join("|") : "") + "::" + t;
  if (D.has(n)) return D.get(n);
  const a = new Set(e || []), l = function(i, o) {
    const d = i.getAttribute(o);
    return d !== null && a.has(d) ? d : t;
  };
  return D.set(n, l), l;
}
function J(e, t, n) {
  const a = parseFloat(e.getAttribute(t));
  return isNaN(a) ? n : a;
}
function K(e, t, n) {
  const a = e.getAttribute(t);
  if (!a) return n;
  try {
    return JSON.parse(a);
  } catch {
    return n;
  }
}
function Q(e, t, n, a, l) {
  if (!e || t === null) return !0;
  const i = a || "ln-component", o = e.type;
  if (o === "trigger" || o === "marker" || o === "string" || o === "list" || !o || t === "" && e.fallback !== void 0)
    return !0;
  const d = (r) => {
    l ? console.warn(r, l) : console.warn(r);
  };
  if (o === "boolean") {
    const r = t.trim().toLowerCase();
    return r !== "" && r !== "true" && r !== "false" && r !== "1" && r !== "0" ? (d(`[${i}] Invalid value "${t}" for boolean attribute "${n}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (o === "enum") {
    const r = e.values || [];
    return r.includes(t) ? !0 : (d(`[${i}] Invalid value "${t}" for attribute "${n}". Allowed: ${r.join(", ")}. Fallback: "${e.fallback}".`), !1);
  }
  if (o === "integer") {
    if (!/^-?\d+$/.test(t))
      return d(`[${i}] Invalid integer "${t}" for attribute "${n}". Fallback: ${e.fallback}.`), !1;
    const r = parseInt(t, 10);
    return e.min !== void 0 && r < e.min ? (d(`[${i}] Value ${r} for attribute "${n}" is less than min (${e.min}).`), !1) : e.max !== void 0 && r > e.max ? (d(`[${i}] Value ${r} for attribute "${n}" is greater than max (${e.max}).`), !1) : !0;
  }
  if (o === "float")
    return isNaN(Number(t)) ? (d(`[${i}] Invalid float "${t}" for attribute "${n}". Fallback: ${e.fallback}.`), !1) : !0;
  if (o === "json")
    try {
      return JSON.parse(t), !0;
    } catch (r) {
      return d(`[${i}] Invalid JSON for attribute "${n}": ${r.message}. Fallback: ${e.fallback}.`), !1;
    }
  return !0;
}
function xe(e, t, n) {
  for (const a in n) {
    const [l, i, o] = n[a];
    Object.defineProperty(e, a, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return l(t, i, o);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return e;
}
function ke(e) {
  const t = {};
  for (const n in e) {
    const a = e[n];
    if (!a || !a.prop) continue;
    let l = a.read;
    if (!l && a.type)
      switch (a.type) {
        case "enum":
          l = G(a.values, a.fallback);
          break;
        case "integer":
          l = V;
          break;
        case "float":
          l = J;
          break;
        case "boolean":
          l = H;
          break;
        case "list":
          l = z;
          break;
        case "json":
          l = K;
          break;
        case "string":
        default:
          l = $;
          break;
      }
    l || (l = $), t[a.prop] = [l, n, a.fallback];
  }
  return t;
}
function Se(e) {
  const t = {};
  for (const n in e) {
    const a = e[n];
    a && a.effect && (t[n] = a.effect);
  }
  return Object.keys(t).length ? t : null;
}
function _e(e) {
  if (e.onAttrChange && !e.declared) return null;
  const t = /* @__PURE__ */ new Set();
  if (e.effects) for (const n in e.effects) t.add(n);
  if (e.onAttrChange && e.declared) for (const n of e.declared) t.add(n);
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = xe, window.lnCore.attrSpec = ke, window.lnCore.attrStr = $, window.lnCore.attrInt = V, window.lnCore.attrBool = H, window.lnCore.attrList = z, window.lnCore.attrEnum = G, window.lnCore.attrFloat = J, window.lnCore.attrJson = K);
function L(e, t, n, a) {
  if (e.nodeType !== 1) return;
  const i = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", o = Array.from(e.querySelectorAll(i));
  e.matches && e.matches(i) && o.push(e);
  for (const d of o)
    if (!d[n]) {
      window.lnCore._persistSink && d.hasAttribute("data-ln-persist") && window.lnCore._persistSink(d, t);
      try {
        d[n] = new a(d);
      } catch (r) {
        console.error("[" + n + "] init failed", d, r);
      }
    }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function P() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function X(e) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(e) : setTimeout(e, 0)) : e();
}
function Y() {
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return e.byReactive = e.byReactive || /* @__PURE__ */ new Map(), e.reactiveWildcard = e.reactiveWildcard || [], e;
}
function Z(e) {
  const t = Y(), n = e.observed || [];
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
    const a = _e(e);
    if (a === null)
      t.reactiveWildcard.push(e);
    else
      for (const l of a)
        t.byReactive.has(l) || t.byReactive.set(l, []), t.byReactive.get(l).push(e);
  }
  e.persist && t.persist.push(e);
}
function N(e, t, n, a) {
  for (let l = 0; l < e.length; l++) {
    const i = e[l];
    if (!t[i.attribute]) continue;
    const o = i.effects && i.effects[n];
    o ? o(t, n, a) : i.onAttrChange && (!i.declared || i.declared.has(n)) && i.onAttrChange(t, n, a);
  }
}
function De(e) {
  const t = e.target, n = e.attributeName;
  if (e.oldValue === t.getAttribute(n)) return;
  const a = Y(), l = a.byAttr.get(n);
  if (R() && a.byDeclaredAttr && a.byDeclaredAttr.has(n) && O(t)) {
    const i = a.byDeclaredAttr.get(n), o = t.getAttribute(n);
    for (let d = 0; d < i.length; d++)
      Q(i[d].spec, o, n, i[d].componentTag, t);
  }
  if (window.lnCore._debugSink && (n.indexOf("data-ln-") === 0 || l) && window.lnCore._debugSink("attr", n, t, { oldValue: e.oldValue, newValue: t.getAttribute(n) }), n.indexOf("data-ln-") === 0) {
    const i = a.byReactive.get(n);
    i && N(i, t, n, e.oldValue), a.reactiveWildcard.length && N(a.reactiveWildcard, t, n, e.oldValue);
  }
  if (l)
    for (let i = 0; i < l.length; i++) {
      const o = l[i];
      if (o.handler) {
        o.handler(t, n, e.oldValue);
        continue;
      }
      o.onAttributeChange && t[o.attribute] ? o.onAttributeChange(t, n) : (L(t, o.selector, o.attribute, o.ComponentFn), o.onInit && o.onInit(t));
    }
}
function ee() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, m(function() {
    new MutationObserver(function(t) {
      for (let n = 0; n < t.length; n++)
        try {
          De(t[n]);
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
function te() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function $e(e) {
  const t = te();
  if (t.length) {
    if (e.target)
      for (let n = 0; n < t.length; n++) {
        const a = t[n];
        if (a.onSubtreeChange) {
          const l = a.query, i = e.target.nodeType === 1 ? e.target.matches(l) ? e.target : e.target.closest(l) : e.target.parentElement ? e.target.parentElement.closest(l) : null;
          i && a.onSubtreeChange(i, e);
        }
      }
    for (let n = 0; n < e.addedNodes.length; n++) {
      const a = e.addedNodes[n];
      if (a.nodeType === 1)
        for (let l = 0; l < t.length; l++) {
          const i = t[l];
          L(a, i.selector, i.attribute, i.ComponentFn), i.onInit && i.onInit(a);
        }
    }
    for (let n = 0; n < e.removedNodes.length; n++) {
      const a = e.removedNodes[n];
      if (a.nodeType === 1)
        for (let l = 0; l < t.length; l++) {
          const i = t[l], o = i.query, d = Array.from(a.querySelectorAll(o));
          a.matches && a.matches(o) && d.push(a);
          for (let r = 0; r < d.length; r++) {
            const s = d[r];
            if (!document.contains(s)) {
              const c = s[i.attribute];
              if (c && typeof c.destroy == "function")
                try {
                  c.destroy();
                } catch (u) {
                  console.error("[" + i.attribute + "] destroy failed", s, u);
                }
              delete s[i.attribute];
            }
          }
        }
    }
  }
}
function Ie() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, m(function() {
    new MutationObserver(function(t) {
      for (let n = 0; n < t.length; n++) {
        const a = t[n];
        if (a.type === "childList")
          try {
            $e(a);
          } catch (l) {
            console.error("[ln-core] lifecycle handler failed", a.target, l);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Ee(e, t) {
  Z({ observed: e, handler: t }), ee();
}
function ne(e, t, n, a, l = {}) {
  const i = l.extraAttributes || [], o = l.onAttributeChange || null, d = l.onSubtreeChange || null, r = l.onInit || null, s = l.onAttrChange || null, c = l.effects || null, u = l.attributes || null, f = u ? Se(u) : c, C = u ? new Set(Object.keys(u)) : null, re = l.persist || null;
  function g(A) {
    const w = A || document.body;
    if (L(w, e, t, n), u && R())
      for (const b in u) {
        const de = u[b], x = Array.from(w.querySelectorAll("[" + b + "]"));
        w.matches && w.matches("[" + b + "]") && x.push(w);
        for (let k = 0; k < x.length; k++) {
          const S = x[k];
          O(S) && Q(de, S.getAttribute(b), b, a, S);
        }
      }
    r && r(w);
  }
  const v = [];
  if (e.indexOf("[") !== -1) {
    const A = /\[([\w-]+)/g;
    let w;
    for (; (w = A.exec(e)) !== null; )
      v.push(w[1]);
  } else
    v.push(e);
  Z({
    selector: e,
    attribute: t,
    componentTag: a,
    attributes: u,
    ComponentFn: n,
    onInit: r,
    observed: v.concat(i),
    onAttributeChange: o,
    onAttrChange: s,
    effects: f,
    declared: C,
    persist: re
  }), ee();
  const ie = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]";
  te().push({
    selector: e,
    attribute: t,
    ComponentFn: n,
    onInit: r,
    onSubtreeChange: d,
    query: ie
  }), Ie(), window[t] = g, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = ne);
  function M() {
    P() > 0 ? X(function() {
      g(document.body);
    }) : g(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", M) : M(), g;
}
function ae(e) {
  return (e || "").replace(/^#/, "");
}
function T(e) {
  const t = e === void 0 ? location.hash : e, n = {}, a = ae(t);
  if (!a) return n;
  const l = a.split("&");
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (!o) continue;
    const d = o.indexOf(":"), r = d > -1 ? o.slice(0, d) : o, s = d > -1 ? o.slice(d + 1) : "";
    if (r)
      try {
        n[r] = decodeURIComponent(s);
      } catch {
        n[r] = s;
      }
  }
  return n;
}
function Oe(e) {
  if (!e) return null;
  const t = T();
  return e in t ? t[e] : null;
}
function Le(e, t) {
  if (!e) return;
  const n = T();
  t == null ? delete n[e] : n[e] = String(t);
  const l = Object.keys(n).map(function(i) {
    const o = n[i];
    return o === "" ? i : i + ":" + encodeURIComponent(o);
  }).join("&");
  ae(location.hash) !== l && (location.hash = l);
}
function Te(e) {
  return e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey ? !1 : (e.preventDefault(), !0);
}
function qe(e, t) {
  if (!e || !e.hasAttribute("data-ln-hash")) return null;
  const n = e.getAttribute("data-ln-hash");
  if (n && n.trim() !== "") return n.trim();
  const a = e.getAttribute("data-ln-sort") || e.getAttribute("data-ln-search-for") || e.getAttribute("data-ln-search") || e.getAttribute("data-ln-filter") || e.id;
  return a ? t ? a + "-" + t : a : t || null;
}
function Me(e, t) {
  return !t || t === "none" || e === null || e === void 0 ? null : String(e) + "." + t;
}
function Ne(e) {
  return !e || typeof e != "string" ? null : e.endsWith(".asc") ? { fieldOrColumn: e.slice(0, -4), direction: "asc" } : e.endsWith(".desc") ? { fieldOrColumn: e.slice(0, -5), direction: "desc" } : null;
}
function Fe(e, t) {
  return !e || !Array.isArray(t) || t.length === 0 ? null : e + ":" + t.map(encodeURIComponent).join(",");
}
function Re(e) {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = T, window.lnCore.hashGet = Oe, window.lnCore.hashSet = Le, window.lnCore.hashLinkClick = Te, window.lnCore.resolveHashNamespace = qe, window.lnCore.hashSortEncode = Me, window.lnCore.hashSortDecode = Ne, window.lnCore.hashFilterEncode = Fe, window.lnCore.hashFilterDecode = Re);
function je() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = je);
const q = /* @__PURE__ */ new Set([
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
function Be(e, t) {
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
function We(e, t = q) {
  if (t.has(e)) return null;
  let n = null, a = 1 / 0;
  for (const i of t) {
    const o = Be(e, i);
    o < a && (a = o, n = i);
  }
  const l = Math.max(3, Math.floor(e.length * 0.4));
  return a <= l ? n : null;
}
function oe(e) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(e) : e.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Ue(e = document) {
  const t = e.ownerDocument || e, n = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const r = o.attributes[d];
        if (r.name.startsWith("data-ln-") && r.name.endsWith("-for")) {
          const s = (r.value || "").trim();
          if (!s) {
            a.push({
              type: "id-empty",
              element: o,
              attribute: r.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${o.tagName.toLowerCase()} ${r.name}="">.`
            });
            continue;
          }
          t.getElementById(s) || t.querySelector("#" + oe(s)) || a.push({
            type: "id-unresolved",
            element: o,
            attribute: r.name,
            targetId: s,
            message: `[ln-debug] Unresolved ID reference: <${o.tagName.toLowerCase()} ${r.name}="${s}"> targets "#${s}", but no element with id="${s}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function Ve(e = document) {
  const t = e.ownerDocument || e, n = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const r = o.attributes[d];
        if (r.name.startsWith("data-ln-") && (r.name.endsWith("-source") || r.name.endsWith("-store")) && r.name !== "data-ln-data-store") {
          const c = (r.value || "").trim();
          if (!c) {
            a.push({
              type: "store-empty",
              element: o,
              attribute: r.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${o.tagName.toLowerCase()} ${r.name}="">.`
            });
            continue;
          }
          const u = oe(c), f = t.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), C = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(c);
          !f && !C && a.push({
            type: "store-unresolved",
            element: o,
            attribute: r.name,
            storeName: c,
            message: `[ln-debug] Unresolved store reference: <${o.tagName.toLowerCase()} ${r.name}="${c}"> targets store "${c}", but no [data-ln-data-store="${c}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function He(e = document) {
  e.ownerDocument;
  const t = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!t) return [];
  const n = [], a = Array.from(t.querySelectorAll("[data-ln-data-store]"));
  t.hasAttribute && t.hasAttribute("data-ln-data-store") && a.unshift(t);
  const l = /* @__PURE__ */ new Map();
  for (let i = 0; i < a.length; i++) {
    const o = a[i], d = (o.getAttribute("data-ln-data-store") || "").trim();
    d && (l.has(d) || l.set(d, []), l.get(d).push(o));
  }
  for (const [i, o] of l.entries())
    o.length > 1 && n.push({
      type: "store-duplicate",
      storeName: i,
      elements: o,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${i}". Store names must be unique across the document.`
    });
  return n;
}
function ze(e = document, t = q) {
  const n = e.nodeType === 9 ? e.body || e.documentElement : e;
  if (!n) return [];
  const a = [], l = [n, ...n.querySelectorAll("*")];
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (o.attributes)
      for (let d = 0; d < o.attributes.length; d++) {
        const r = o.attributes[d];
        if (r.name.startsWith("data-ln-") && !t.has(r.name)) {
          const s = We(r.name, t), c = s ? ` Did you mean "${s}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: o,
            attribute: r.name,
            suggestion: s,
            message: `[ln-debug] Unknown attribute "${r.name}" on <${o.tagName.toLowerCase()}>.${c}`
          });
        }
      }
  }
  return a;
}
function I(e = typeof document < "u" ? document : null, t = {}) {
  if (!e)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const n = t.validAttributes || q, a = Ue(e), l = Ve(e), i = He(e), o = ze(e, n), d = [
    ...a,
    ...l,
    ...i,
    ...o
  ];
  if (!t.silent)
    for (let r = 0; r < d.length; r++)
      console.warn(d[r].message);
  return {
    idIssues: a,
    storeIssues: l,
    uniquenessIssues: i,
    spellingIssues: o,
    total: d.length
  };
}
let h = null;
function y(e = typeof document < "u" ? document : null, t = 50, n = null) {
  if (!e) return;
  h && (clearTimeout(h), h = null);
  function a() {
    h = setTimeout(() => {
      h = null;
      const l = I(e);
      n && n(l);
    }, t);
  }
  P() > 0 ? X(a) : a();
}
function Ge(e, t, n, a) {
  e === "event" ? (console.groupCollapsed("[ln-debug] event", t), console.log("target", n), console.log("detail", a), console.groupEnd()) : e === "attr" && (console.groupCollapsed("[ln-debug] attr", t), console.log("target", n), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let p = [];
function Je() {
  p = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && p.push(document.body);
}
function le(e) {
  if (e === window || e === document)
    return p.indexOf(document.body) !== -1;
  for (let t = 0; t < p.length; t++)
    if (p[t].contains(e)) return !0;
  return !1;
}
function Ke(e, t, n, a) {
  le(n) && Ge(e, t, n, a);
}
function E() {
  Je(), se(p.length > 0 ? Ke : null, p.length > 0 ? le : null);
}
function F() {
  E();
}
function Qe() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, m(function() {
    E(), Ee(["data-ln-debug"], E);
  }, "ln-debug")));
}
(function() {
  const e = "data-ln-debug", t = "lnDebug";
  if (typeof window < "u" && window[t] !== void 0) return;
  const n = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Qe();
  function a(i) {
    return this.dom = i, y(i.ownerDocument || document), F(), this;
  }
  a.prototype.verify = function(i, o) {
    return I(i || (this.dom ? this.dom.ownerDocument || this.dom : document), o);
  }, a.prototype.destroy = function() {
    delete this.dom[t], F();
  };
  const l = ne(e, t, a, "ln-debug", {
    attributes: n,
    onInit: function(i) {
      typeof document < "u" && y(i && i.ownerDocument ? i.ownerDocument : document);
    },
    onSubtreeChange: function(i) {
      typeof document < "u" && y(i && i.ownerDocument ? i.ownerDocument : document);
    }
  });
  l.verify = function(i, o) {
    return I(i || document, o);
  }, l.schedule = function(i, o, d) {
    return y(i || document, o, d);
  };
})();
export {
  y as scheduleVerification,
  I as verifyDOM
};
