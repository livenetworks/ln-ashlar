function $(t, e, i) {
  const a = t.getAttribute(e);
  return a === null ? i : a;
}
function xt(t, e, i) {
  const a = parseInt(t.getAttribute(e), 10);
  return isNaN(a) ? i : a;
}
function It(t, e, i = !1) {
  const a = t.getAttribute(e);
  if (a === null) return !!i;
  const m = a.trim().toLowerCase();
  return !(m === "false" || m === "0");
}
function dn(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const de = /* @__PURE__ */ new Map();
function vi(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (de.has(i)) return de.get(i);
  const a = new Set(t || []), m = function(h, r) {
    const l = h.getAttribute(r);
    return l !== null && a.has(l) ? l : e;
  };
  return de.set(i, m), m;
}
function wi(t, e, i) {
  const a = parseFloat(t.getAttribute(e));
  return isNaN(a) ? i : a;
}
function Ei(t, e, i) {
  const a = t.getAttribute(e);
  if (!a) return i;
  try {
    return JSON.parse(a);
  } catch {
    return i;
  }
}
function un(t, e, i, a, m) {
  if (!t || e === null) return !0;
  const h = a || "ln-component", r = t.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || e === "" && t.fallback !== void 0)
    return !0;
  const l = (c) => {
    m ? console.warn(c, m) : console.warn(c);
  };
  if (r === "boolean") {
    const c = e.trim().toLowerCase();
    return c !== "" && c !== "true" && c !== "false" && c !== "1" && c !== "0" ? (l(`[${h}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (r === "enum") {
    const c = t.values || [];
    return c.includes(e) ? !0 : (l(`[${h}] Invalid value "${e}" for attribute "${i}". Allowed: ${c.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (r === "integer") {
    if (!/^-?\d+$/.test(e))
      return l(`[${h}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const c = parseInt(e, 10);
    return t.min !== void 0 && c < t.min ? (l(`[${h}] Value ${c} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && c > t.max ? (l(`[${h}] Value ${c} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (r === "float")
    return isNaN(Number(e)) ? (l(`[${h}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (r === "json")
    try {
      return JSON.parse(e), !0;
    } catch (c) {
      return l(`[${h}] Invalid JSON for attribute "${i}": ${c.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function tt(t, e, i) {
  for (const a in i) {
    const [m, h, r] = i[a];
    Object.defineProperty(t, a, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return m(e, h, r);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function et(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    if (!a || !a.prop) continue;
    let m = a.read;
    if (!m && a.type)
      switch (a.type) {
        case "enum":
          m = vi(a.values, a.fallback);
          break;
        case "integer":
          m = xt;
          break;
        case "float":
          m = wi;
          break;
        case "boolean":
          m = It;
          break;
        case "list":
          m = dn;
          break;
        case "json":
          m = Ei;
          break;
        case "string":
        default:
          m = $;
          break;
      }
    m || (m = $), e[a.prop] = [m, i, a.fallback];
  }
  return e;
}
function Ai(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    a && a.effect && (e[i] = a.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Si(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
function ke(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const a = t[i];
    if (!(a === "" || a == null) && (e = !0, !Number.isFinite(Number(a))))
      return "string";
  }
  return e ? "number" : "string";
}
function Le(t, e, i, a) {
  if (i === "number") {
    const r = parseFloat(t), l = parseFloat(e);
    return (isNaN(r) ? 0 : r) - (isNaN(l) ? 0 : l);
  }
  const m = t != null ? String(t) : "", h = e != null ? String(e) : "";
  return a ? a.compare(m, h) : m < h ? -1 : m > h ? 1 : 0;
}
function fn() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function qe(t) {
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
      for (let m = 1; m < e.length; m++)
        if (e[m] && e[m].nodeType === 1) {
          a = e[m];
          break;
        }
      if (!qe(a))
        return;
    }
    t.apply(console, e);
  };
}
const ue = {};
function Jt(t, e) {
  ue[t] || (ue[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = ue[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Ci(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function Ti(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: a
  }));
}
function Z(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a);
  const m = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: a
  });
  return t.dispatchEvent(m), m;
}
function hn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const a = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  a[i] = t.name, L(t.dom, e, a);
}
function pt(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < i.length; r++) {
    const l = i[r], c = l.getAttribute("data-ln-field");
    e[c] != null && (l.textContent = e[c]);
  }
  const a = t.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < a.length; r++) {
    const l = a[r], c = l.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const u = o[0].trim(), p = o[1].trim();
      e[p] != null && l.setAttribute(u, e[p]);
    }
  }
  const m = t.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < m.length; r++) {
    const l = m[r], c = l.getAttribute("data-ln-show");
    c in e && l.classList.toggle("hidden", !e[c]);
  }
  const h = t.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < h.length; r++) {
    const l = h[r], c = l.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const u = o[0].trim(), p = o[1].trim();
      p in e && l.classList.toggle(u, !!e[p]);
    }
  }
  return t;
}
function ki(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let a = 0; a < i.length; a++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[a], e ?? null), i[a].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      pt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let i = 0; i < e.length; i++)
        e[i].textContent = "";
    }
})));
function Vt(t, e) {
  if (!t || !e) return t;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; i.nextNode(); ) {
    const h = i.currentNode;
    h.textContent.indexOf("{{") !== -1 && (h.textContent = h.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(r, l) {
        return e[l] !== void 0 ? e[l] : "";
      }
    ));
  }
  const a = function(h, r) {
    return e[r] !== void 0 ? e[r] : "";
  }, m = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && m.push(t);
  for (let h = 0; h < m.length; h++) {
    const r = m[h], l = r.attributes;
    for (let c = 0; c < l.length; c++) {
      const n = l[c];
      n.value.indexOf("{{") !== -1 && r.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return t;
}
function Li(t, e, i, a, m, h) {
  const r = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], o = n.getAttribute("data-ln-render-key");
    o && (r[o] = n);
  }
  const l = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], o = String(a(n));
    let u = r[o];
    if (u)
      m(u, n, c);
    else {
      const p = Jt(i, h);
      if (!p || (Vt(p, n), u = p.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", o), m(u, n, c);
    }
    l.appendChild(u);
  }
  t.textContent = "", t.appendChild(l);
}
function gt(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      gt(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function Ct(t, e, i) {
  if (t) {
    const a = t.querySelector('[data-ln-template="' + e + '"]');
    if (a) return a.content.cloneNode(!0);
  }
  return Jt(e, i);
}
function ie(t, e) {
  const i = {}, a = t.querySelectorAll("[" + e + "]");
  for (let m = 0; m < a.length; m++)
    i[a[m].getAttribute(e)] = a[m].textContent, a[m].remove();
  return i;
}
function xe(t, e, i, a) {
  if (t.nodeType !== 1) return;
  const h = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", r = Array.from(t.querySelectorAll(h));
  t.matches && t.matches(h) && r.push(t);
  for (const l of r)
    l[i] || (window.lnCore._persistSink && l.hasAttribute("data-ln-persist") && window.lnCore._persistSink(l, e), l[i] = new a(l));
}
function zt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function pn(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function qi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function mn(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function xi(t, e) {
  return !t || !document.contains(t) || mn(t) || e && typeof t[e] != "function" ? !1 : zt(t);
}
function Ii(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function gn(t, e) {
  const i = !!(e && e.typed), a = e && e.exclude, m = {}, h = t.elements, r = {};
  if (i)
    for (let l = 0; l < h.length; l++) {
      const c = h[l];
      c.name && c.type === "checkbox" && !c.disabled && (r[c.name] = (r[c.name] || 0) + 1);
    }
  for (let l = 0; l < h.length; l++) {
    const c = h[l];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(a && c.matches && c.matches(a)))
      if (c.type === "checkbox")
        i && r[c.name] === 1 ? m[c.name] = c.checked : (m[c.name] || (m[c.name] = []), c.checked && m[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (m[c.name] = c.value);
      else if (c.type === "select-multiple") {
        m[c.name] = [];
        for (let n = 0; n < c.options.length; n++)
          c.options[n].selected && m[c.name].push(c.options[n].value);
      } else if (i && c.type === "hidden")
        m[c.name] = c.value;
      else if (i && (c.type === "number" || c.type === "range")) {
        const n = Number(c.value);
        m[c.name] = c.value === "" || isNaN(n) ? null : n;
      } else
        m[c.name] = c.value;
  }
  return m;
}
function Di(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function _n(t, e) {
  const i = t.elements, a = [], m = {};
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    r.name && r.type === "checkbox" && (m[r.name] = (m[r.name] || 0) + 1);
  }
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    if (r.type === "file" || r.type === "submit" || r.type === "button") continue;
    const l = r.getAttribute("data-ln-fill-as") || r.name;
    if (!l || !(l in e)) continue;
    const c = e[l];
    if (r.type === "checkbox") {
      if (Array.isArray(c))
        r.checked = c.indexOf(r.value) !== -1;
      else if (m[r.name] > 1) {
        const n = String(c).split(",").map(function(o) {
          return o.trim();
        });
        r.checked = n.indexOf(r.value) !== -1;
      } else
        r.checked = Di(c);
      a.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(c), a.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < r.options.length; n++)
          r.options[n].selected = c.indexOf(r.options[n].value) !== -1;
      a.push(r);
    } else
      r.value = c, a.push(r);
  }
  return a;
}
const Be = {
  mk: "mk-MK",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  nl: "nl-NL",
  pt: "pt-PT",
  ru: "ru-RU",
  bg: "bg-BG",
  hr: "hr-HR",
  sr: "sr-RS",
  sq: "sq-AL",
  el: "el-GR",
  en: "en-US"
};
function it(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!i) return "en-US";
  const a = i.trim().toLowerCase();
  return a.indexOf("-") === -1 && Be[a] ? Be[a] : i;
}
function re() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, gt(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function vt(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.tagName === "DATA" && t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
}
function yn(t, e, { get: i, set: a }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(m) {
      a ? a.call(this, m, (h) => e.set.call(this, h)) : e.set.call(this, m);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Ri() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function fe() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function bn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function vn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function wn(t) {
  const e = vn(), i = t.observed || [];
  for (let a = 0; a < i.length; a++) {
    const m = i[a];
    e.byAttr.has(m) || e.byAttr.set(m, []), e.byAttr.get(m).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const a in t.attributes) {
      e.byDeclaredAttr.has(a) || e.byDeclaredAttr.set(a, []);
      const m = e.byDeclaredAttr.get(a);
      m.some((h) => h.componentTag === t.componentTag) || m.push({
        spec: t.attributes[a],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const a = Si(t);
    if (a === null)
      e.reactiveWildcard.push(t);
    else
      for (const m of a)
        e.byReactive.has(m) || e.byReactive.set(m, []), e.byReactive.get(m).push(t);
  }
  t.persist && e.persist.push(t);
}
function Ue(t, e, i, a) {
  for (let m = 0; m < t.length; m++) {
    const h = t[m];
    if (!e[h.attribute]) continue;
    const r = h.effects && h.effects[i];
    r ? r(e, i, a) : h.onAttrChange && (!h.declared || h.declared.has(i)) && h.onAttrChange(e, i, a);
  }
}
function Oi(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const a = vn(), m = a.byAttr.get(i);
  if (fn() && a.byDeclaredAttr && a.byDeclaredAttr.has(i) && qe(e)) {
    const h = a.byDeclaredAttr.get(i), r = e.getAttribute(i);
    for (let l = 0; l < h.length; l++)
      un(h[l].spec, r, i, h[l].componentTag, e);
  }
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || m) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const h = a.byReactive.get(i);
    h && Ue(h, e, i, t.oldValue), a.reactiveWildcard.length && Ue(a.reactiveWildcard, e, i, t.oldValue);
  }
  if (m)
    for (let h = 0; h < m.length; h++) {
      const r = m[h];
      if (r.handler) {
        r.handler(e, i, t.oldValue);
        continue;
      }
      r.onAttributeChange && e[r.attribute] ? r.onAttributeChange(e, i) : (xe(e, r.selector, r.attribute, r.ComponentFn), r.onInit && r.onInit(e));
    }
}
function En() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        Oi(e[i]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function An() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Mi(t) {
  const e = An();
  if (e.length) {
    if (t.target)
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.onSubtreeChange) {
          const m = a.query, h = t.target.nodeType === 1 ? t.target.matches(m) ? t.target : t.target.closest(m) : t.target.parentElement ? t.target.parentElement.closest(m) : null;
          h && a.onSubtreeChange(h, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const a = t.addedNodes[i];
      if (a.nodeType === 1)
        for (let m = 0; m < e.length; m++) {
          const h = e[m];
          xe(a, h.selector, h.attribute, h.ComponentFn), h.onInit && h.onInit(a);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const a = t.removedNodes[i];
      if (a.nodeType === 1)
        for (let m = 0; m < e.length; m++) {
          const h = e[m], r = h.query, l = Array.from(a.querySelectorAll(r));
          a.matches && a.matches(r) && l.push(a);
          for (let c = 0; c < l.length; c++) {
            const n = l[c];
            if (!document.contains(n)) {
              const o = n[h.attribute];
              o && typeof o.destroy == "function" && o.destroy(), delete n[h.attribute];
            }
          }
        }
    }
  }
}
function Ni() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        a.type === "childList" && Mi(a);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Wt(t, e) {
  wn({ observed: t, handler: e }), En();
}
function j(t, e, i, a, m = {}) {
  const h = m.extraAttributes || [], r = m.onAttributeChange || null, l = m.onSubtreeChange || null, c = m.onInit || null, n = m.onAttrChange || null, o = m.effects || null, u = m.attributes || null, p = u ? Ai(u) : o, w = u ? new Set(Object.keys(u)) : null, v = m.persist || null;
  function S(s) {
    const g = s || document.body;
    if (xe(g, t, e, i), u && fn())
      for (const b in u) {
        const T = u[b], _ = Array.from(g.querySelectorAll("[" + b + "]"));
        g.matches && g.matches("[" + b + "]") && _.push(g);
        for (let E = 0; E < _.length; E++) {
          const C = _[E];
          qe(C) && un(T, C.getAttribute(b), b, a, C);
        }
      }
    c && c(g);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const s = /\[([\w-]+)/g;
    let g;
    for (; (g = s.exec(t)) !== null; )
      A.push(g[1]);
  } else
    A.push(t);
  wn({
    selector: t,
    attribute: e,
    componentTag: a,
    attributes: u,
    ComponentFn: i,
    onInit: c,
    observed: A.concat(h),
    onAttributeChange: r,
    onAttrChange: n,
    effects: p,
    declared: w,
    persist: v
  }), En();
  const y = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  An().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: c,
    onSubtreeChange: l,
    query: y
  }), Ni(), window[e] = S;
  function d() {
    bn() > 0 ? mt(function() {
      S(document.body);
    }) : S(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), S;
}
function Sn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Ft(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function Cn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const Tn = {};
function Fi(t, e) {
  Tn[t] = e;
}
function Pi(t) {
  return Tn[t] || { ingress: (e) => e, egress: (e) => e };
}
const kn = {};
function Ie(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  kn[i] = e;
}
function Lt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return kn[e] || null;
}
Ie("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Fi, window.lnCore.getDataMapper = Pi, window.lnCore.registerLocaleFallback = Ie, window.lnCore.getLocaleFallback = Lt, window.lnCore.fillTemplate = Vt, window.lnCore.fill = pt, window.lnCore.lnFill = ki, window.lnCore.renderList = Li, window.lnCore.ensureLocaleObserver = re);
function oe(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function Ln(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.threshold != null ? t.threshold : 25, m = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const h = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, r = typeof t.onChange == "function" ? t.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let o = 0, u = 0, p = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, f = !1;
  function y(b) {
    c.set(b, ++S);
  }
  function d() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function s() {
    if (l.size <= e) return;
    const b = Array.from(l.keys()).sort(function(_, E) {
      return (c.get(_) || 0) - (c.get(E) || 0);
    });
    let T = 0;
    for (; l.size > e && T < b.length; )
      l.delete(b[T]), c.delete(b[T]), T++;
  }
  function g(b, T) {
    n.add(b), h(w, b, T);
  }
  return {
    get: function(b) {
      return l.get(b);
    },
    has: function(b) {
      return l.has(b);
    },
    peek: function() {
      return l.size ? l.values().next().value : void 0;
    },
    get logicalTotal() {
      return o;
    },
    get grandTotal() {
      return u;
    },
    get queryGen() {
      return p;
    },
    get size() {
      return l.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(b, T) {
      clearTimeout(v), A = b;
      for (let I = b; I < T; I++)
        l.has(I) && y(I);
      if (o <= 0) return;
      const _ = Math.max(0, b - a), E = Math.min(o, T + a), C = Math.floor(_ / i), q = Math.floor(Math.max(0, E - 1) / i);
      let D = -1;
      for (let I = C; I <= q; I++) {
        const R = I * i, O = Math.min(i, o - R);
        let P = !1;
        const B = Math.max(R, _), H = Math.min(R + O, E);
        for (let z = B; z < H; z++)
          if (!l.has(z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (v = setTimeout(function() {
        g(D, i);
      }, m));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== p) return !1;
      const T = b.offset || 0, _ = b.data || [];
      let E = 0;
      for (let C = 0; C < _.length; C++)
        _[C] != null && E++;
      if (E === 0 && (b.provisional || b.filtered > 0))
        return n.delete(T), !1;
      f && (l.clear(), c.clear(), f = !1), b.provisional || (u = b.total != null ? b.total : u, o = b.filtered != null ? b.filtered : b.data ? b.data.length : o);
      for (let C = 0; C < _.length; C++)
        _[C] != null && (l.set(T + C, _[C]), y(T + C));
      return n.delete(T), s(), r(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (w = b), g(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(b) {
      p++, n.clear(), clearTimeout(v), b && (w = b), f = !0, g(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      p++, n.clear(), clearTimeout(v), f = !0;
      const b = Math.max(0, Math.floor(A / i) * i);
      g(b, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(b) {
      n.delete(b);
    },
    destroy: function() {
      clearTimeout(v), l.clear(), c.clear(), n.clear();
    },
    configure: function(b) {
      b = b || {};
      let T = !1;
      if (b.windowSize != null && b.windowSize > 0 && b.windowSize !== e) {
        const _ = b.windowSize < e;
        e = b.windowSize, _ && s(), T = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (i = b.pageSize), b.threshold != null && b.threshold >= 0 && (a = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (m = b.fetchDebounce), T && r();
    },
    setGrandTotal: function(b) {
      b == null || isNaN(b) || b < 0 || (u = b, d() || (o = b), r());
    }
  };
}
function qn(t) {
  return (t || "").replace(/^#/, "");
}
function se(t) {
  const e = t === void 0 ? location.hash : t, i = {}, a = qn(e);
  if (!a) return i;
  const m = a.split("&");
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (!r) continue;
    const l = r.indexOf(":"), c = l > -1 ? r.slice(0, l) : r, n = l > -1 ? r.slice(l + 1) : "";
    if (c)
      try {
        i[c] = decodeURIComponent(n);
      } catch {
        i[c] = n;
      }
  }
  return i;
}
function st(t) {
  if (!t) return null;
  const e = se();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const i = se();
  e == null ? delete i[t] : i[t] = String(e);
  const m = Object.keys(i).map(function(h) {
    const r = i[h];
    return r === "" ? h : h + ":" + encodeURIComponent(r);
  }).join("&");
  qn(location.hash) !== m && (location.hash = m);
}
function De(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "-" + e : a : e || null;
}
function xn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ye(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function In(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function be(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), a = t.slice(e + 1), m = a ? a.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: i, values: m };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = st, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = De, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = xn, window.lnCore.hashSortDecode = ye, window.lnCore.hashFilterEncode = In, window.lnCore.hashFilterDecode = be);
function Zt(t, e, i, a) {
  const m = typeof a == "number" ? a : 4, h = window.innerWidth, r = window.innerHeight, l = e.width, c = e.height, n = (i || "bottom").split("-"), o = n[0], u = n[1] === "start" || n[1] === "end" ? n[1] : "center", p = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = p[o] || p.bottom;
  function v(d) {
    return d === "top" || d === "bottom" ? u === "start" ? t.left : u === "end" ? t.right - l : t.left + (t.width - l) / 2 : u === "start" ? t.top : u === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(d) {
    let s, g, b = !0;
    return d === "top" ? (s = t.top - m - c, g = v(d), s < 0 && (b = !1)) : d === "bottom" ? (s = t.bottom + m, g = v(d), s + c > r && (b = !1)) : d === "left" ? (s = v(d), g = t.left - m - l, g < 0 && (b = !1)) : (s = v(d), g = t.right + m, g + l > h && (b = !1)), { top: s, left: g, side: d, fits: b };
  }
  let A = null;
  for (let d = 0; d < w.length; d++) {
    const s = S(w[d]);
    if (s.fits) {
      A = s;
      break;
    }
  }
  A || (A = S(w[0]));
  let f = A.top, y = A.left;
  return l >= h ? y = 0 : (y < 0 && (y = 0), y + l > h && (y = h - l)), c >= r ? f = 0 : (f < 0 && (f = 0), f + c > r && (f = r - c)), { top: f, left: y, placement: A.side };
}
function ve(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, a = e.display, m = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const h = t.offsetWidth, r = t.offsetHeight;
  return e.visibility = i, e.display = a, e.position = m, { width: h, height: r };
}
let Kt = null;
const Bi = "ln-ashlar:storage-salt:v1", He = 32768;
function ze(t) {
  let e = "";
  const i = t.byteLength;
  for (let a = 0; a < i; a += He)
    e += String.fromCharCode.apply(
      null,
      t.subarray(a, Math.min(a + He, i))
    );
  return btoa(e);
}
function Ke(t) {
  const e = atob(t), i = e.length, a = new Uint8Array(i);
  for (let m = 0; m < i; m++)
    a[m] = e.charCodeAt(m);
  return a;
}
function Dn(t, e) {
  let i = Kt, a = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (a = t, typeof CryptoKey < "u" && a.key instanceof CryptoKey && (i = a.key)), { key: i, options: a };
}
async function Ui(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", a = new TextEncoder();
  if (i === "sha256") {
    const c = await crypto.subtle.digest("SHA-256", a.encode(t));
    return crypto.subtle.importKey(
      "raw",
      c,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const m = e.salt || Bi, h = typeof m == "string" ? a.encode(m) : m, r = e.iterations || 1e5, l = await crypto.subtle.importKey(
    "raw",
    a.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: h,
      iterations: r,
      hash: "SHA-256"
    },
    l,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function je(t, e = {}) {
  if (!t) {
    Kt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Kt = await Ui(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Kt = null, i;
  }
}
function At() {
  return Kt;
}
async function Hi(t, e, i) {
  const { key: a } = Dn(e);
  if (t == null)
    return t;
  if (!a)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const m = new TextEncoder(), h = crypto.getRandomValues(new Uint8Array(12)), r = typeof t == "string" ? t : JSON.stringify(t), l = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: h },
      a,
      m.encode(r)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: ze(h),
      data: ze(new Uint8Array(l))
    };
  } catch (m) {
    throw console.error("[ln-core/crypto] Encryption failed:", m), new Error("[ln-crypto] Encryption failed: " + (m && m.message ? m.message : String(m)));
  }
}
async function zi(t, e, i) {
  const { key: a, options: m } = Dn(e), h = m.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!a) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const r = new TextDecoder(), l = Ke(t.iv), c = Ke(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: l },
      a,
      c
    ), o = r.decode(n);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (r) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", r), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (r && r.message ? r.message : String(r)));
  }
}
function Rn(t, e = 100, i = 0) {
  const a = parseFloat(String(t)) || 0, m = parseFloat(String(e)) || 100, h = parseFloat(String(i)) || 0, r = Math.max(h, Math.min(a, m)), l = m - h;
  let c = 0;
  return l > 0 && (c = (r - h) / l * 100), c = Math.max(0, Math.min(100, c)), {
    value: a,
    min: h,
    max: m,
    clampedValue: r,
    percentage: c
  };
}
function ot(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const i = e < 1e11 ? e * 1e3 : e, a = new Date(i);
    return isNaN(a.getTime()) ? null : a;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const a = new Date(i);
    return isNaN(a.getTime()) ? null : a;
  }
  return null;
}
function Dt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + a;
}
const bt = {};
function te(t) {
  const e = t || "default";
  if (!bt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), a = i.formatToParts(1234.5);
    let m = "", h = ".";
    for (let r = 0; r < a.length; r++)
      a[r].type === "group" && (m = a[r].value), a[r].type === "decimal" && (h = a[r].value);
    bt[e] = { groupSep: m, decimalSep: h, fmt: i };
  }
  return bt[e];
}
function On(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let a = t.trim();
  return a === "" ? "" : (a = a.replace(/[$€£¥]/g, ""), e && (a = a.split(e).join("")), a = a.replace(/\s/g, ""), i && i !== "." && (a = a.replace(i, ".")), a = a.replace(/[^\d.-]/g, ""), a);
}
function Ki(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const a = te(e), m = On(i, a.groupSep, a.decimalSep);
  if (m === "" || m === "-") return NaN;
  const h = parseFloat(m);
  return isNaN(h) ? NaN : h;
}
function ct(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const a = e || "default", m = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, h = i.userDecimals != null ? i.userDecimals : null;
  if (m !== null) {
    const r = a + "|max:" + m;
    return bt[r] || (bt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: m
    })), bt[r].format(t);
  }
  if (h !== null && h > 0) {
    const r = a + "|exact:" + h;
    return bt[r] || (bt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: h,
      maximumFractionDigits: h
    })), bt[r].format(t);
  }
  return te(e).fmt.format(t);
}
function we(t) {
  return String(t || "").trim().toLowerCase();
}
function Mn(t) {
  const e = we(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ji(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Nn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (i.indexOf(e[a]) === -1) return !1;
  return !0;
}
function Vi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Re(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (String(e[a]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function Wi(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Gi(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function $i(t, e) {
  return (e || "GET") + " " + (t || "");
}
function Qi(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function a(r, l) {
    l = l || {};
    const c = Wi(r), n = Gi(r, l), o = $i(c, n);
    Qi(n) && e.has(o) && (e.get(o).abort(), e.delete(o));
    const u = new AbortController(), p = l.signal;
    let w = null;
    p && (p.aborted ? u.abort(p.reason) : (w = function() {
      u.abort(p.reason);
    }, p.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, l, { signal: u.signal });
    return e.set(o, u), t(r, v).finally(function() {
      p && w && p.removeEventListener("abort", w), e.get(o) === u && e.delete(o);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function m(r) {
    if (!r.detail || !r.detail.url) return;
    const l = r.target, c = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), n = r.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const o = new AbortController(), u = r.detail.signal;
    let p = null;
    u && (u.aborted ? o.abort(u.reason) : (p = function() {
      o.abort(u.reason);
    }, u.addEventListener("abort", p, { once: !0 }))), n && i.set(n, o);
    const w = { method: c, signal: o.signal };
    r.detail.body !== void 0 && (w.body = r.detail.body), window.fetch(r.detail.url, w).then(function(v) {
      u && p && u.removeEventListener("abort", p), n && i.get(n) === o && i.delete(n), L(l, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      u && p && u.removeEventListener("abort", p), n && i.get(n) === o && i.delete(n), !(v && v.name === "AbortError") && L(l, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
      });
    });
  }
  function h(r) {
    const l = r.detail || {};
    l.all ? window.lnHttp.cancelAll() : l.key ? window.lnHttp.cancelByKey(l.key) : l.url && window.lnHttp.cancel(l.url);
  }
  document.addEventListener("ln-http:request", m), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
    cancel: function(r) {
      let l = !1;
      return e.forEach(function(c, n) {
        n.endsWith(" " + r) && (c.abort(), e.delete(n), l = !0);
      }), l;
    },
    cancelByKey: function(r) {
      return i.has(r) ? (i.get(r).abort(), i.delete(r), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(r) {
        r.abort();
      }), e.clear(), i.forEach(function(r) {
        r.abort();
      }), i.clear();
    },
    get inflight() {
      const r = [];
      return e.forEach(function(l, c) {
        const n = c.indexOf(" ");
        r.push({ method: c.slice(0, n), url: c.slice(n + 1) });
      }), i.forEach(function(l, c) {
        r.push({ key: c });
      }), r;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", m), document.removeEventListener("ln-http:cancel", h), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: $, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, a = et(i), m = /* @__PURE__ */ new Map();
  function h(r) {
    if (this.dom = r, tt(this, r, a), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Ri(), this._held = !0;
    const l = this, c = this.url;
    let n = m.get(c);
    return n || (n = fetch(c).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw m.delete(c), o;
    }), m.set(c, n)), n.then(function(o) {
      if (l._destroyed) return;
      const u = document.createElement("template");
      u.innerHTML = o, l.dom.content.appendChild(u.content), L(l.dom, "ln-include:loaded", { target: l.dom, url: l.url }), l._held && (l._held = !1, fe());
    }).catch(function(o) {
      l._destroyed || (console.error("[ln-include] Failed to fetch template from " + l.url + ":", o), L(l.dom, "ln-include:error", { target: l.dom, url: l.url, error: o }), l._held && (l._held = !1, fe()));
    }), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, fe()), delete this.dom[e]);
  }, j(t, e, h, "ln-include", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: $, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, a = et(i);
  function m(h) {
    this.dom = h, tt(this, h, a), this._baseAction = h.getAttribute("action") || "";
    const r = this;
    return this._onLnFill = function(l) {
      l.target === r.dom && (l.detail ? (r.fill(l.detail), r._applyActionMode(l.detail)) : r.dom.reset());
    }, this._onReset = function() {
      r._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  m.prototype.fill = function(h) {
    const r = _n(this.dom, h);
    for (let l = 0; l < r.length; l++) {
      const c = r[l], n = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, m.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const r = h && h.id != null && h.id !== "" ? h.id : null, l = this._ensureMethodInput();
    if (r !== null) {
      const c = this._actionEdit;
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(r))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(r)), l.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, m, "ln-form", {
    attributes: i
  });
})();
const Ve = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function We(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function Xi(t, e) {
  const i = [];
  if (t) {
    const a = Object.keys(Ve);
    for (let m = 0; m < a.length; m++) {
      const h = a[m], r = Ve[h];
      t[r] && i.push(h);
    }
  }
  if (e) {
    const a = Array.from(e);
    for (let m = 0; m < a.length; m++)
      a[m] && i.indexOf(a[m]) === -1 && i.push(a[m]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", a = "data-ln-validate-error", m = "ln-validate-valid", h = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function l(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, o = c.tagName, u = c.type, p = o === "SELECT" || u === "checkbox" || u === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(S) {
      const A = S.detail && S.detail.error;
      if (!A) return;
      n._customErrors.add(A), n._touched = !0;
      const f = c.closest(".form-element");
      if (f) {
        const y = f.querySelector("[" + a + '="' + A + '"]');
        y && y.classList.remove("hidden");
      }
      c.classList.remove(m), c.classList.add(h), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, f = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), f) {
          const y = f.querySelector("[" + a + '="' + A + '"]');
          y && y.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(y) {
          if (f) {
            const d = f.querySelector("[" + a + '="' + y + '"]');
            d && d.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, p || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = c.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(S) {
      n._touched = !0, !n.validate() && S.detail && S.detail.invalidFields && S.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(S) {
      const A = { invalidFields: [] };
      L(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((f, y) => f.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (c.value && c.value.trim() !== "" || c.checked) && (this._touched = !0, this.validate()), this;
  }
  l.prototype.validate = function() {
    const c = this.dom, n = c.validity, o = We(n, this._customErrors.size), u = Xi(n, this._customErrors), p = c.closest(".form-element");
    if (p) {
      const v = p.querySelector("[" + i + "]");
      if (v) {
        const S = v.querySelectorAll("[" + a + "]");
        for (let A = 0; A < S.length; A++) {
          const f = S[A].getAttribute(a);
          S[A].classList.toggle("hidden", !u.includes(f));
        }
      }
    }
    return c.classList.toggle(m, o), c.classList.toggle(h, !o), c.setAttribute("aria-invalid", o ? "false" : "true"), L(c, o ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: u }), o;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, h), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + a + "]");
      for (let o = 0; o < n.length; o++)
        n[o].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return We(this.dom.validity, this._customErrors.size);
    }
  }), l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(m, h), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, l, "ln-validate", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function a(u) {
    if (!u.hasAttribute(t) || u[e]) return;
    u[e] = !0;
    const p = c(u);
    m(p.links), h(p.forms);
  }
  function m(u) {
    for (const p of u) {
      if (p[e + "Trigger"] || p.hostname && p.hostname !== window.location.hostname) continue;
      const w = p.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!Sn(S, p)) return;
        S.preventDefault();
        const A = p.getAttribute("href");
        A && l("GET", A, null, p);
      };
      p.addEventListener("click", v), p[e + "Trigger"] = v;
    }
  }
  function h(u) {
    for (const p of u) {
      if (p[e + "Trigger"]) continue;
      if (p.hasAttribute(i)) {
        p[e + "ScopeWarned"] || (p[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const S = p.method.toUpperCase(), A = p.action, f = new FormData(p);
        for (const y of p.querySelectorAll('button, input[type="submit"]'))
          y.disabled = !0;
        l(S, A, f, p, function() {
          for (const y of p.querySelectorAll('button, input[type="submit"]'))
            y.disabled = !1;
        });
      };
      p.addEventListener("submit", w), p[e + "Trigger"] = w;
    }
  }
  function r(u) {
    if (!u[e]) return;
    const p = c(u);
    for (const w of p.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of p.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete u[e];
  }
  function l(u, p, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: u, url: p }).defaultPrevented) return;
    L(v, "ln-ajax:start", { method: u, url: p }), v.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", v.appendChild(f);
    function y() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let d = p;
    const s = document.querySelector('meta[name="csrf-token"]'), g = s ? s.getAttribute("content") : null;
    w instanceof FormData && g && w.append("_token", g);
    const b = {
      method: u,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (g && (b.headers["X-CSRF-TOKEN"] = g), u === "GET" && w) {
      const T = new URLSearchParams(w);
      d = p + (p.includes("?") ? "&" : "?") + T.toString();
    } else u !== "GET" && w && (b.body = w);
    fetch(d, b).then(function(T) {
      const _ = T.ok, E = T.status;
      return T.text().then(function(C) {
        let q = null, D = null;
        if (C && C.trim())
          try {
            q = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: _, status: E, data: q, parseError: D };
      });
    }).then(function(T) {
      const _ = T.status, E = T.data, C = T.parseError;
      if (T.ok && !C) {
        if (E && E.title && (document.title = E.title), E && E.content)
          for (const q in E.content) {
            const D = document.getElementById(q);
            D && (D.innerHTML = E.content[q]);
          }
        if (v.tagName === "A") {
          const q = v.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else v.tagName === "FORM" && v.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", d);
        L(v, "ln-ajax:success", { method: u, url: d, data: E });
      } else
        L(v, "ln-ajax:error", {
          method: u,
          url: d,
          status: _,
          data: E,
          error: C || null
        });
      L(v, "ln-ajax:complete", { method: u, url: d }), y();
    }).catch(function(T) {
      L(v, "ln-ajax:error", { method: u, url: d, status: 0, data: null, error: T }), L(v, "ln-ajax:complete", { method: u, url: d }), y();
    });
  }
  function c(u) {
    const p = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(t) !== "false" ? p.links.push(u) : u.tagName === "FORM" && u.getAttribute(t) !== "false" ? p.forms.push(u) : (p.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), p.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), p;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(p) {
        for (const w of p)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (a(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  a(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = c(v);
                  m(A.links), h(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt([t], function(p) {
        a(p);
      });
    }, "ln-ajax");
  }
  function o() {
    for (const u of document.querySelectorAll("[" + t + "]"))
      a(u);
  }
  window[e] = a, window[e].destroy = r, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
function Yi(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: a = null } = {}) {
  const m = i ? !a : !t.some((n) => n.match), h = [], r = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const o = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !o && n.targetEl && h.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || r.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  r.sort((n, o) => n.regionKey === "__primary__" ? -1 : o.regionKey === "__primary__" ? 1 : 0);
  const c = r.find((n) => n.regionKey === "__primary__") || r[0] || null;
  return { notFound: m, clears: h, swaps: r, owner: c };
}
const Fn = {
  navigate: function(t) {
    jt(t, { historyAction: "push" });
  },
  replace: function(t) {
    jt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: Un,
      query: Hn,
      route: zn,
      regions: Bn
    };
  }
}, Oe = "data-ln-route", Pn = "lnRoute";
typeof window < "u" && (window.lnRouter = Fn);
function he(t) {
  Gn(t), Wn(t), _t.size > 0 && Vn();
}
const Ji = {
  "data-ln-route": { effect: he, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: he, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: he, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, _t = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new WeakMap();
let Bn = /* @__PURE__ */ new Map(), Ge = !1, ee = null, Un = {}, Hn = {}, zn = null, Ee = !1;
function $e(t, e, i) {
  Ee ? queueMicrotask(function() {
    L(t, e, i);
  }) : L(t, e, i);
}
function ne(t) {
  try {
    const h = new URL(t, window.location.origin);
    t = h.pathname + h.search + h.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, a] = e.split("?");
  const m = {};
  if (a) {
    const h = new URLSearchParams(a);
    for (const [r, l] of h.entries())
      m[r] = l;
  }
  return i = i.replace(/\/+$/, ""), i === "" && (i = "/"), { path: i, query: m };
}
function Kn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, a = e.segments, m = Math.max(i.length, a.length);
  for (let h = 0; h < m; h++) {
    const r = i[h], l = a[h];
    if (r === void 0) return 1;
    if (l === void 0) return -1;
    if (r === "*") return 1;
    if (l === "*") return -1;
    const c = r.startsWith(":"), n = l.startsWith(":");
    if (c && !n) return 1;
    if (!c && n) return -1;
  }
  return 0;
}
function jn(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const a of e) {
    if (a.pattern === "*")
      return {
        route: a,
        params: { wildcard: t }
      };
    const m = a.segments, h = {};
    let r = !0;
    if (!(i.length > m.length && m[m.length - 1] !== "*")) {
      for (let l = 0; l < m.length; l++) {
        const c = m[l], n = i[l];
        if (c === "*") {
          h.wildcard = i.slice(l).join("/");
          break;
        }
        if (n === void 0) {
          r = !1;
          break;
        }
        if (c.startsWith(":"))
          h[c.slice(1)] = decodeURIComponent(n);
        else if (c !== n) {
          r = !1;
          break;
        }
      }
      if (r && (m.indexOf("*") !== -1 || i.length <= m.length))
        return { route: a, params: h };
    }
  }
  return null;
}
function Ae(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const m = document.getElementById(t);
    return !m && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), m;
  }
  const a = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !a && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), a;
}
function Qe(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const m of i)
    for (const h of Object.keys(m))
      if (h.startsWith("ln") && m[h] && typeof m[h].destroy == "function")
        try {
          m[h].destroy();
        } catch (r) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, m, r);
        }
  const a = document.querySelectorAll('[data-ln-popover="open"]');
  for (const m of a) {
    const h = m.lnPopover;
    if (h && h.trigger && t.contains(h.trigger))
      try {
        h.destroy();
      } catch (r) {
        console.error("[ln-router] Error destroying open popover:", r);
      }
  }
}
function jt(t, e = {}) {
  const { path: i, query: a } = ne(t), m = /* @__PURE__ */ new Map();
  for (const [p, w] of _t)
    m.set(p, jn(i, w.sorted));
  const h = m.get("__primary__") || null, r = Ae("__primary__", { warn: !!h }), l = _t.has("__primary__"), c = [];
  for (const [p, w] of m) {
    const v = p === "__primary__" ? r : Ae(p, { warn: !1 }), S = !v && !!(h && h.route && h.route.templateNode && h.route.templateNode.content && h.route.templateNode.content.querySelector("#" + CSS.escape(p)));
    !v && !S && w && console.warn(`[ln-router] Explicit target element #${p} not found in DOM`), c.push({
      regionKey: p,
      match: w,
      targetEl: v,
      isPending: S,
      hasKeep: !!v && v.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!v && v.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!v && v.children.length > 0,
      mountedTemplate: v && pe.get(v) || null
    });
  }
  const n = Yi(c, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: l,
    primaryMatch: h
  });
  if (n.notFound) {
    $e(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Z(r || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: h ? h.params : {},
    query: a
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const u = function() {
    for (const p of n.clears)
      Qe(p.targetEl), p.targetEl.replaceChildren(), pe.delete(p.targetEl);
    for (const p of n.swaps) {
      if ((p.isPending || !p.targetEl || !document.contains(p.targetEl)) && (p.targetEl = p.regionKey === "__primary__" ? r : document.getElementById(p.regionKey)), !p.targetEl) {
        console.warn(`[ln-router] Target element #${p.regionKey} could not be resolved`);
        continue;
      }
      if (p.skipMount || (Qe(p.targetEl), p.targetEl.replaceChildren(p.match.route.templateNode.content.cloneNode(!0))), pe.set(p.targetEl, p.match.route.templateNode), n.owner && p.regionKey === n.owner.regionKey) {
        if (p.match.route.title) {
          let w = p.match.route.title;
          if (p.match.params)
            for (const [v, S] of Object.entries(p.match.params))
              w = w.replace(new RegExp("\\{\\{\\s*" + v + "\\s*\\}\\}", "g"), S);
          document.title = w;
        }
        if (!e.isHydration) {
          p.targetEl.hasAttribute("tabindex") || p.targetEl.setAttribute("tabindex", "-1");
          const w = p.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          w ? (w.setAttribute("tabindex", "-1"), w.focus()) : p.targetEl.focus(), p.regionKey === "__primary__" && p.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      $e(p.targetEl, "ln-router:navigated", {
        path: t,
        params: p.match.params,
        query: a,
        route: p.match.route,
        target: p.targetEl,
        region: p.regionKey
      });
    }
    ee = t, Hn = a, zn = h ? h.route : null, Un = h ? h.params : {}, Bn = new Map(
      Array.from(m.entries()).map(([p, w]) => [p, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(u) : u();
}
function Zi(t) {
  const e = t.target.closest("a");
  if (!e || !Sn(t, e)) return;
  const i = e.getAttribute("href"), { path: a } = ne(i);
  for (const m of _t.values())
    if (jn(a, m.sorted)) {
      t.preventDefault(), jt(i, { historyAction: "push" });
      return;
    }
}
function tr(t, e) {
  const i = Object.keys(t), a = Object.keys(e);
  if (i.length !== a.length) return !1;
  for (let m = 0; m < i.length; m++) {
    const h = i[m];
    if (t[h] !== e[h]) return !1;
  }
  return !0;
}
function er() {
  const t = window.location.pathname + window.location.search, e = Fn.current();
  if (e && e.path != null) {
    const i = ne(t);
    if (ne(e.path).path === i.path && tr(e.query, i.query))
      return;
  }
  jt(t, { historyAction: "skip" });
}
function Vn() {
  Ge || (Ge = !0, gt(function() {
    document.addEventListener("click", Zi), window.addEventListener("popstate", er), Ee = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    jt(t, { historyAction: "replace", isHydration: !0 }), Ee = !1;
  }, "ln-router"));
}
function Wn(t) {
  const e = t.getAttribute(Oe);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const a = i || "__primary__";
  _t.has(a) || _t.set(a, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const m = _t.get(a);
  if (m.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${a}"`);
    return;
  }
  const h = t.getAttribute("data-ln-route-title"), r = e.split("/").filter(Boolean), l = {
    pattern: e,
    segments: r,
    target: i,
    title: h,
    templateNode: t
  }, c = Ae(a);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), m.routes.set(e, l), m.sorted = Array.from(m.routes.values()).sort(Kn);
}
function Gn(t) {
  const e = t.getAttribute(Oe);
  if (!e) return;
  const a = t.getAttribute("data-ln-route-target") || null || "__primary__", m = _t.get(a);
  m && (m.routes.delete(e), m.sorted = Array.from(m.routes.values()).sort(Kn), m.routes.size === 0 && _t.delete(a));
}
function $n(t) {
  return this.dom = t, Wn(t), this;
}
$n.prototype.destroy = function() {
  Gn(this.dom), delete this.dom[Pn];
};
j(Oe, Pn, $n, "ln-router", {
  attributes: Ji,
  onInit: function() {
    _t.size > 0 && Vn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: m,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  };
  function a(h) {
    this.dom = h, this.isOpen = h.getAttribute(t) === "open";
    const r = this;
    return this._onRequestOpen = function() {
      r.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      r.dom.setAttribute(t, "close");
    }, this._onCancel = function(l) {
      l.preventDefault(), r.dom.setAttribute(t, "close");
    }, this._onClickClose = function(l) {
      const c = l.target.closest("[data-ln-modal-close]");
      c && r.dom.contains(c) && (l.preventDefault(), r.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  a.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, a.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, a.prototype.toggle = function() {
    const h = this.dom.getAttribute(t);
    this.dom.setAttribute(t, h === "open" ? "close" : "open");
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const h = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(l) {
            return l !== h;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function m(h) {
    const r = h[e];
    if (!r) return;
    const c = h.getAttribute(t) === "open";
    if (c !== r.isOpen)
      if (c) {
        if (Z(h, "ln-modal:before-open", { modalId: h.id, target: h }).defaultPrevented) {
          h.setAttribute(t, "close");
          return;
        }
        r.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof h.showModal == "function" && h.showModal();
        const o = h.querySelector("[autofocus]");
        if (o && zt(o))
          o.focus();
        else {
          const u = h.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(u, zt);
          if (p) p.focus();
          else {
            const w = h.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, zt);
            v && v.focus();
          }
        }
        L(h, "ln-modal:open", { modalId: h.id, target: h });
      } else {
        if (Z(h, "ln-modal:before-close", { modalId: h.id, target: h }).defaultPrevented) {
          h.setAttribute(t, "open");
          return;
        }
        r.isOpen = !1, L(h, "ln-modal:close", { modalId: h.id, target: h }), typeof h.close == "function" && h.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  j(t, e, a, "ln-modal", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", i = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-ui-coordinator": { type: "marker", description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts" },
    "data-ln-ui-coordinator-dict": { type: "string", description: "Dictionary key prefix mapping for translatable UI coordinator messages" }
  };
  function m(f) {
    const y = {};
    let d = f;
    const s = [];
    for (; d; ) {
      const g = d.closest("[" + t + "]");
      if (!g) break;
      g[e] && g[e].dict && s.unshift(g[e].dict), d = g.parentElement;
    }
    for (const g of s)
      Object.assign(y, g);
    return y;
  }
  function h(f, y) {
    if (y) {
      if (f) {
        const s = f.closest("[" + t + "]");
        if (s) {
          if (s.id === y && s.hasAttribute("data-ln-modal")) return s;
          const g = s.querySelector("#" + CSS.escape(y) + '[data-ln-modal], [data-ln-modal="' + y + '"]');
          if (g) return g;
        }
      }
      const d = document.getElementById(y) || document.querySelector('[data-ln-modal="' + y + '"]');
      if (d) return d;
    }
    if (f) {
      const d = f.closest("[" + t + "]");
      if (d) {
        if (d.hasAttribute("data-ln-modal")) return d;
        const g = d.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const s = f.closest("[data-ln-modal]");
      if (s) return s;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function r(f, y) {
    if (f !== "edit") return "";
    if (y) {
      const d = y.getAttribute("data-ln-fill-id");
      if (d) return d;
    }
    return "edit";
  }
  function l(f) {
    if (!f) return;
    const y = f.querySelectorAll("[data-ln-field]");
    for (let s = 0; s < y.length; s++)
      y[s].textContent = "";
    const d = f.querySelectorAll("form");
    for (let s = 0; s < d.length; s++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(d[s], null) : d[s].reset();
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const y = f.target.closest("[data-ln-modal-for]");
    if (y) {
      const s = y.getAttribute("data-ln-modal-for"), g = h(y, s);
      if (g && g.lnModal) {
        f.preventDefault();
        const b = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, _ = y.dataset;
        for (const q in _) {
          if (!q.startsWith("lnModal") || b[q]) continue;
          const D = q.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = _[q]);
        }
        const E = Object.keys(T).length > 0;
        y.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = y.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, T) : g.dataset.lnModalMode === "new" && l(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && dt(g.id, r(g.dataset.lnModalMode, y)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const d = f.target.closest('a[href^="#"]');
    if (d) {
      const s = se(d.getAttribute("href"));
      for (const g in s) {
        const b = document.getElementById(g);
        if (b && b.lnModal) {
          if (!De(f)) return;
          dt(g, s[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(f) {
    const y = f.target;
    if (!y || !y.lnModal) return;
    (y.dataset.lnModalMode || "new") === "new" && l(y);
  }), document.addEventListener("ln-modal:open", function(f) {
    const y = f.target;
    if (!y || !y.lnModal || !y.id) return;
    let d = st(y.id);
    d === null && (d = r(y.dataset.lnModalMode, null), dt(y.id, d)), d ? (y.dataset.lnModalMode = "edit", L(y, "ln-fill:request", { id: d })) : (y.dataset.lnModalMode = "new", l(y));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const f = document.querySelectorAll("[data-ln-modal][id]");
        for (let y = 0; y < f.length; y++) {
          const d = f[y];
          if (!d.lnModal) continue;
          const s = d.id, g = st(s), b = g !== null, T = d.lnModal.isOpen;
          if (b) {
            const _ = g ? "edit" : "new";
            d.dataset.lnModalMode = _, T ? g ? L(d, "ln-fill:request", { id: g }) : l(d) : L(d, "ln-modal:request-open", {});
          } else T && L(d, "ln-modal:request-close", {});
        }
      } finally {
        c = !1;
      }
    }
  }
  function o() {
    const f = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let y = 0; y < f.length; y++) {
      const d = f[y];
      d.lnModal && st(d.id) === null && dt(d.id, r(d.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function u() {
    o(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(u);
  }) : mt(u);
  function p(f) {
    const d = (f.detail || {}).data;
    if (d && d.message) {
      const g = d.message;
      L(window, "ln-toast:enqueue", {
        type: g.type || "success",
        title: g.title || "",
        message: g.body || ""
      });
    }
    const s = f.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && dt(s.id, null), L(s, "ln-modal:request-close", {}), l(s));
  }
  function w(f) {
    const y = f.detail || {}, d = y.data, s = y.status || 0, g = m(f.target);
    if (d && d.message) {
      const b = d.message;
      L(window, "ln-toast:enqueue", {
        type: b.type || "error",
        title: b.title || "",
        message: b.body || ""
      });
    } else s === 0 ? L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["network-error-title"] || "",
      message: g["network-error"] || "Network error"
    }) : L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["server-error-title"] || "",
      message: g["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", p), document.addEventListener("ln-ajax:error", w);
  function v(f) {
    const y = f.detail || {}, d = m(f.target), s = y.message || (y.reason === "max-size" ? d["upload-max-size"] || "File is too large" : y.reason === "max-files" ? d["upload-max-files"] || "Maximum file count exceeded" : d["upload-invalid-type"] || "This file type is not allowed"), g = d["upload-invalid-title"] || "Invalid File";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: s
    });
  }
  function S(f) {
    const y = f.detail || {}, d = m(f.target), s = y.message || d["upload-failed"] || "Failed to upload file", g = d["upload-error-title"] || "Upload Error";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: s
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(f) {
    const y = f.target;
    !y || !y.lnModal || (y.id && st(y.id) !== null && dt(y.id, null), y.dataset.lnModalMode === "new" && l(y));
  });
  function A(f) {
    return this.dom = f, this.dict = ie(f, i), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: a
  });
})();
function nr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, a = 0;
  for (let m = 0; m < t.length && i > 0; m++)
    a = m + 1, /[0-9]/.test(t[m]) && i--;
  return i > 0 && (a = t.length), a;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(r) {
    const l = r[e];
    l && (l.isTextElement ? l._initTextElement() : isNaN(l.value) || l._displayFormatted(l.value));
  }
  const a = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const l = this;
    if (this._onLocaleChange = function() {
      l.isTextElement ? l._formatTextContent() : isNaN(l.value) || l._displayFormatted(l.value);
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return m.get.call(c);
      },
      set: function(o) {
        if (m.set.call(c, o), o !== "" && !isNaN(parseFloat(o))) {
          const u = l.dom.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(ct(parseFloat(o), it(l.dom), { maxDecimals: u }));
        } else
          l._setDisplayRaw("");
        l.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), yn(r, m, {
      get: function() {
        return m.get.call(r);
      },
      set: function(o) {
        if (o === "") {
          l._setDisplayRaw(""), l._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const u = typeof o == "number" ? o : parseFloat(String(o));
        if (isNaN(u))
          l._setDisplayRaw(String(o)), l._setHiddenRaw("");
        else {
          l._setHiddenRaw(u);
          const p = r.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(ct(u, it(r), { maxDecimals: p }));
        }
        r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      l._handleInput();
    }, r.addEventListener("input", this._onInput), this._onKeyDown = function(o) {
      if (o.key !== "Backspace") return;
      const u = r.selectionStart, p = r.selectionEnd;
      if (u !== p || u === 0) return;
      const w = te(it(r)), v = m.get.call(r), S = v[u - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        o.preventDefault();
        const A = u - 2 >= 0 ? u - 2 : 0, f = v.slice(0, A) + v.slice(u);
        m.set.call(r, f), r.setSelectionRange(A, A), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, r.addEventListener("keydown", this._onKeyDown), this._onPaste = function(o) {
      o.preventDefault();
      const u = (o.clipboardData || window.clipboardData).getData("text"), p = Ki(u, it(r));
      l.value = isNaN(p) ? NaN : p;
    }, r.addEventListener("paste", this._onPaste);
    const n = r.value;
    if (n !== "") {
      const o = parseFloat(n);
      if (!isNaN(o)) {
        const u = r.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(o), this._setDisplayRaw(ct(o, it(r), { maxDecimals: u })), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  h.prototype._initTextElement = function() {
    const r = this.dom;
    let l = r.getAttribute("data-ln-value"), c = r.getAttribute("data-ln-number"), n = null;
    l !== null && l !== "" ? n = l : c !== null && c !== "" && c !== "true" ? n = c : n = r.textContent.trim();
    const o = parseFloat(n);
    isNaN(o) ? this._rawValue = null : (this._rawValue = o, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(o)), this._formatTextContent());
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, it(this.dom), { maxDecimals: r });
    }
  }, h.prototype._handleInput = function() {
    const r = this.dom, l = m.get.call(r);
    if (l === "") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (l === "-") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = r.selectionStart;
    let n = 0;
    for (let g = 0; g < c; g++)
      /[0-9]/.test(l[g]) && n++;
    const o = it(r), u = te(o);
    let p = l, w = On(l, u.groupSep, u.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: l });
      return;
    }
    const S = r.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const g = parseInt(S, 10), b = w.slice(A + 1);
      if (g === 0)
        w = w.slice(0, A), p = p.split(u.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(p);
      else if (b.length > g) {
        w = w.slice(0, A + 1 + g);
        const T = p.split(u.decimalSep);
        p = T[0] + u.decimalSep + T[1].slice(0, g), v = parseFloat(w), this._setDisplayRaw(p);
      }
    }
    const f = r.getAttribute("data-ln-number-max");
    if (f !== null && v > parseFloat(f)) {
      const g = parseFloat(f), b = ct(g, o, { maxDecimals: S });
      this._setDisplayRaw(b), this._setHiddenRaw(g), r.setSelectionRange(b.length, b.length), L(r, "ln-number:input", { value: g, formatted: b });
      return;
    }
    if (p.endsWith(u.decimalSep) || u.decimalSep !== "." && p.endsWith(".")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: p });
      return;
    }
    const y = w.indexOf(".");
    if (y !== -1 && w.slice(y + 1).endsWith("0")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: p });
      return;
    }
    let d;
    if (S !== null)
      d = ct(v, o, { maxDecimals: S });
    else {
      const g = y !== -1 ? w.slice(y + 1).length : 0;
      d = ct(v, o, { userDecimals: g });
    }
    this._setDisplayRaw(d);
    const s = nr(d, n);
    r.setSelectionRange(s, s), this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: d });
  }, h.prototype._setHiddenRaw = function(r) {
    this._hidden && m.set.call(this._hidden, String(r));
  }, h.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : m.set.call(this.dom, String(r));
  }, h.prototype._displayFormatted = function(r) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const l = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(r, it(this.dom), { maxDecimals: l }));
    }
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = m.get.call(this._hidden);
      return r === "" ? NaN : parseFloat(r);
    },
    set: function(r) {
      const l = typeof r == "number" ? r : parseFloat(r);
      if (this.isTextElement) {
        isNaN(l) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = l, this.dom.setAttribute("data-ln-value", String(l)), this._formatTextContent());
        return;
      }
      if (isNaN(l)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(l);
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(l, it(this.dom), { maxDecimals: c })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : m.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, h, "ln-number", {
    attributes: a,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Se = /^(short|medium|long)(\s+datetime)?$/, ir = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function rr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Se) ? ir[t.trim()] : null;
}
function Pt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, a;
  if (e.indexOf(".") !== -1)
    i = ".", a = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", a = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", a = e.split("-");
  else
    return null;
  if (a.length !== 3) return null;
  const m = [];
  for (let n = 0; n < 3; n++) {
    const o = parseInt(a[n], 10);
    if (isNaN(o)) return null;
    m.push(o);
  }
  let h, r, l;
  i === "." ? (h = m[0], r = m[1], l = m[2]) : i === "/" ? (r = m[0], h = m[1], l = m[2]) : a[0].length === 4 ? (l = m[0], r = m[1], h = m[2]) : (h = m[0], r = m[1], l = m[2]), l < 100 && (l += l < 50 ? 2e3 : 1900);
  const c = new Date(l, r - 1, h);
  return c.getFullYear() !== l || c.getMonth() !== r - 1 || c.getDate() !== h ? null : c;
}
function me(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const m = t.getDate(), h = t.getMonth(), r = t.getFullYear(), l = t.getHours(), c = t.getMinutes();
  let n, o;
  const u = (i || "").toLowerCase().split("-")[0];
  let p = !1;
  try {
    const S = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    p = !!(a && S !== u);
  } catch {
    p = !!a;
  }
  if (p && a && a.monthsLong)
    n = a.monthsLong[h];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(h + 1);
    }
  if (p && a && a.monthsShort)
    o = a.monthsShort[h];
  else
    try {
      o = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      o = String(h + 1);
    }
  const w = {
    yyyy: String(r),
    yy: String(r).slice(-2),
    MMMM: n,
    MMM: o,
    MM: String(h + 1).padStart(2, "0"),
    M: String(h + 1),
    dd: String(m).padStart(2, "0"),
    d: String(m),
    HH: String(l).padStart(2, "0"),
    mm: String(c).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const m = rr(e);
  if (m)
    try {
      const h = new Intl.DateTimeFormat(i, m), r = (i || "").toLowerCase().split("-")[0], l = h.resolvedOptions().locale.toLowerCase().split("-")[0];
      return a && l !== r ? me(t, "dd.MM.yyyy", i, a) : h.format(t);
    } catch {
      return me(t, "dd.MM.yyyy", i, a);
    }
  return me(t, e || "dd.MM.yyyy", i, a);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(n) {
    const o = n[e];
    if (o) {
      if (o.isTextElement)
        o._initTextElement();
      else if (o.value) {
        const u = ot(o.value);
        u && o._displayFormatted(u);
      }
    }
  }
  const a = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: i, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: i, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: i, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: i, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(n, o, u) {
    L(n.dom, "ln-date:change", {
      value: o,
      formatted: n.dom.value,
      date: u
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function r(n, o, u, p) {
    n._setHiddenRaw(o), m.set.call(n._picker, o), n._lastISO = o, p !== void 0 ? (n._isFormatting = !0, n.dom.value = p, n._isFormatting = !1) : u && n._displayFormatted(u), h(n, o, u);
  }
  function l(n) {
    n._setHiddenRaw(""), m.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", h(n, "", null);
  }
  function c(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const d = ot(o.value);
        d && o._displayFormatted(d);
      }
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const u = n.value, p = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const d = w.querySelectorAll("[data-ln-date-dict]");
      for (let s = 0; s < d.length; s++) {
        const g = d[s].getAttribute("data-ln-date-dict");
        if (g) {
          const b = ie(d[s], "data-ln-date-dict-key");
          b["months-long"] && (b.monthsLong = b["months-long"].split(",").map((T) => T.trim())), b["months-short"] && (b.monthsShort = b["months-short"].split(",").map((T) => T.trim())), Ie(g, b);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const S = document.createElement("input");
    S.type = "hidden", S.name = p, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && S.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", S), this._hidden = S;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", S.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const f = document.createElement("button");
    f.type = "button", f.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), f.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", f), this._btn = f, this._lastISO = "", Object.defineProperty(S, "value", {
      get: function() {
        return m.get.call(S);
      },
      set: function(d) {
        if (m.set.call(S, d), d && d !== "") {
          const s = ot(d);
          s && r(o, d, s);
        } else d === "" && l(o);
      }
    }), yn(n, m, {
      get: function() {
        return m.get.call(n);
      },
      set: function(d, s) {
        if (o._isFormatting) {
          s(d);
          return;
        }
        if (!d || d === "") {
          s(""), l(o);
          return;
        }
        const g = ot(d) || Pt(d);
        if (g) {
          const b = Dt(g), T = n.getAttribute(t) || "", _ = it(n), E = Lt(_), C = Gt(g, T, _, E);
          s(C), r(o, b, g, C);
        } else
          s(String(d)), l(o);
      }
    }), this._onPickerChange = function() {
      const d = A.value;
      if (d) {
        const s = ot(d);
        s && r(o, d, s);
      } else
        l(o);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const d = o.dom.value.trim();
      if (d === "") {
        o._lastISO !== "" && l(o);
        return;
      }
      if (o._lastISO) {
        const g = ot(o._lastISO);
        if (g) {
          const b = o.dom.getAttribute(t) || "", T = it(o.dom), _ = Lt(T);
          if (d === Gt(g, b, T, _)) return;
        }
      }
      const s = Pt(d);
      if (s) {
        const g = Dt(s);
        r(o, g, s);
      } else if (o._lastISO) {
        const g = ot(o._lastISO);
        g && o._displayFormatted(g);
      } else
        o.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, f.addEventListener("click", this._onBtnClick);
    const y = n.form;
    if (y && (this._form = y, this._onFormReset = function() {
      setTimeout(function() {
        const d = o.dom.value;
        if (d) {
          const s = ot(d) || Pt(d);
          if (s) {
            const g = Dt(s);
            r(o, g, s);
            return;
          }
        }
        l(o);
      }, 0);
    }, y.addEventListener("reset", this._onFormReset)), u && u !== "") {
      const d = ot(u);
      d && r(o, u, d);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, o = n.getAttribute("data-ln-value"), u = n.getAttribute("data-ln-date"), p = n.getAttribute("datetime");
    let w = null;
    n.tagName === "TIME" && p !== null && p !== "" ? w = p : o !== null && o !== "" ? w = o : p !== null && p !== "" ? w = p : u !== null && u !== "" && u !== "true" && !Se.test(u) ? w = u : w = n.textContent.trim();
    const v = ot(w) || Pt(w);
    if (v && !isNaN(v.getTime())) {
      const S = Dt(v);
      this._rawValue = S, n.tagName !== "TIME" && !n.hasAttribute("data-ln-value") && n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = ot(this._rawValue);
      if (n) {
        let u = this.dom.getAttribute("data-ln-date-format");
        if (!u) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Se.test(v) && (u = v);
        }
        const p = it(this.dom), w = Lt(p);
        this.dom.textContent = Gt(n, u || "medium", p, w);
      }
    }
  }, c.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, c.prototype._setHiddenRaw = function(n) {
    m.set.call(this._hidden, n);
  }, c.prototype._displayFormatted = function(n) {
    const o = this.dom.getAttribute(t) || "", u = it(this.dom), p = Lt(u);
    this._isFormatting = !0, this.dom.value = Gt(n, o, u, p), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : m.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const u = ot(n) || Pt(n);
        if (!u) return;
        const p = Dt(u);
        this._rawValue = p, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", p) : this.dom.setAttribute("data-ln-value", p), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        l(this);
        return;
      }
      const o = ot(n);
      o && r(this, n, o);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? ot(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = Dt(n);
    }
  }), Object.defineProperty(c.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, c, "ln-date", {
    attributes: a,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: r, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: It, effect: r, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, a = et(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const l = history.pushState;
    history.pushState = function() {
      l.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const c = history.replaceState;
    history.replaceState = function() {
      c.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function m(l) {
    return this.dom = l, tt(this, l, a), this.activeClass = l.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(l, { childList: !0, subtree: !0 }), this.update(), this;
  }
  m.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, o = h(n), u = [];
    for (const p of c) {
      const w = p.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        p.classList.remove(this.activeClass), p.removeAttribute("aria-current");
        continue;
      }
      if (p.hostname && p.hostname !== window.location.hostname) {
        p.classList.remove(this.activeClass), p.removeAttribute("aria-current");
        continue;
      }
      const v = h(w), S = v === o, A = !this.exact && v !== "/" && o.startsWith(v + "/");
      S || A ? (p.classList.add(this.activeClass), p.setAttribute("aria-current", "page"), u.push(p)) : (p.classList.remove(this.activeClass), p.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: u });
  }, m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const l = history._lnNavCallbacks.indexOf(this.updateHandler);
    l !== -1 && history._lnNavCallbacks.splice(l, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function h(l) {
    try {
      return new URL(l, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return l.replace(/\/$/, "") || "/";
    }
  }
  function r(l, c) {
    const n = l[e];
    if (n) {
      if (c === t) {
        if (!l.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const o = n.activeClass, u = l.getAttribute(t) || "active";
        if (o !== u) {
          const p = l.querySelectorAll("a");
          for (const w of p)
            o && w.classList.remove(o);
          n.activeClass = u;
        }
      }
      n.update();
    }
  }
  j(t, e, m, "ln-nav", {
    attributes: i
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(r, l) {
    const c = r.getAttribute("data-ln-persist"), n = c !== null && c !== "" ? c : r.id;
    return n ? r.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + l : "ln:" + n + ":" + l : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', r), null);
  }
  let i = null;
  function a() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const r = "__ln_persist_test__";
      return localStorage.setItem(r, r), localStorage.removeItem(r), i = !0;
    } catch {
      return i = !1;
    }
  }
  const m = /* @__PURE__ */ new Set();
  function h(r, l) {
    const c = window.lnCore && window.lnCore._attrRegistry, n = c && c.persist || [];
    let o = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === l) {
        o = n[v];
        break;
      }
    if (!o) return;
    const u = o.persist;
    if (m.has(u.attr) || (m.add(u.attr), Wt([u.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || u.hashActive && u.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !a()) return;
      const f = v.getAttribute(S);
      try {
        f === null ? localStorage.removeItem(A) : localStorage.setItem(A, f);
      } catch {
      }
    })), u.hashActive && u.hashActive(r)) return;
    const p = e(r, u.attr);
    if (!p || !a()) return;
    const w = localStorage.getItem(p);
    w !== null && r.setAttribute(u.attr, w);
  }
  Ti(h);
})();
function Xe(t, e, i, a) {
  const m = (t || "").toLowerCase().trim();
  if (m) return m;
  if ((e || "").toUpperCase() !== "A") return "";
  const h = i || "";
  if (!h.startsWith("#")) return "";
  const r = h.slice(1);
  if (!r) return "";
  const l = r.split("&"), c = (a || "").toLowerCase().trim();
  if (c)
    for (const u of l) {
      const p = u.indexOf(":");
      if (p > 0 && u.slice(0, p).toLowerCase().trim() === c)
        return u.slice(p + 1).toLowerCase().trim();
    }
  const n = l[l.length - 1] || "", o = n.indexOf(":");
  return (o > 0 ? n.slice(o + 1) : n).toLowerCase().trim();
}
function Ye(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (h) => (h.tagName || "").toUpperCase() === "A" && (h.href || "").startsWith("#")
  ), a = i.length > 0 && i.length === t.length, m = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : a && !m ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: a && !!m,
    warning: null
  };
}
function Je(t, e, i) {
  const a = (t || "").toLowerCase().trim();
  return a && Array.isArray(e) && e.includes(a) ? a : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(c) {
    const n = c.getAttribute("data-ln-tabs-active");
    c[e] && c[e]._applyActive(n);
  }
  function a(c, n) {
    return (c.getAttribute(n) || c.id || "").toLowerCase().trim();
  }
  const m = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: a, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, h = et(m);
  function r(c) {
    return this.dom = c, tt(this, c, h), this.activeKey = null, l.call(this), this;
  }
  function l() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const c = this.tabs.map((u) => ({
      tagName: u.tagName,
      href: u.getAttribute("href")
    })), n = Ye(c, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const p = Xe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
      p ? this.mapTabs[p] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const p = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      p && (this.mapPanels[p] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const o = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[e + "Trigger"]) continue;
      const p = function(w) {
        const v = u.tagName === "A";
        if (!v && (w.ctrlKey || w.metaKey || w.button === 1)) return;
        const S = Xe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), o.nsKey);
        S && (v && !De(w) || (o.hashEnabled ? st(o.nsKey) === S ? o.dom.setAttribute("data-ln-tabs-active", S) : dt(o.nsKey, S) : o.dom.setAttribute("data-ln-tabs-active", S)));
      };
      u.addEventListener("click", p), u[e + "Trigger"] = p, o._clickHandlers.push({ el: u, handler: p });
    }
    if (this._onRequestSelect = function(u) {
      const p = u.detail && (u.detail.key || u.detail.tab);
      p && o.select(p);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const u = st(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", u !== null ? u : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const u = Je(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  r.prototype.select = function(c) {
    const n = (c + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : dt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, r.prototype._applyActive = function(c) {
    var o;
    if (c = Je(c, Object.keys(this.mapPanels), this.defaultKey), c === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && Z(this.dom, "ln-tabs:before-change", {
      key: c,
      previousKey: n,
      tab: this.mapTabs[c],
      panel: this.mapPanels[c],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && st(this.nsKey) !== n && dt(this.nsKey, n));
      return;
    }
    this.activeKey = c;
    for (const u in this.mapTabs) {
      const p = this.mapTabs[u];
      u === c ? (p.setAttribute("data-active", ""), p.setAttribute("aria-selected", "true")) : (p.removeAttribute("data-active"), p.setAttribute("aria-selected", "false"));
    }
    for (const u in this.mapPanels) {
      const p = this.mapPanels[u], w = u === c;
      p.classList.toggle("hidden", !w), p.setAttribute("aria-hidden", w ? "false" : "true");
    }
    if (this.autoFocus) {
      const u = (o = this.mapPanels[c]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      u && setTimeout(() => u.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: c,
      previousKey: n,
      tab: this.mapTabs[c],
      panel: this.mapPanels[c],
      target: this.dom
    });
  }, r.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: c, handler: n } of this._clickHandlers)
        c.removeEventListener("click", n), delete c[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, r, "ln-tabs", {
    attributes: m,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(c) {
        const n = Array.from(c.querySelectorAll("[data-ln-tab]")).map(function(u) {
          return { tagName: u.tagName, href: u.getAttribute("href") };
        }), o = (c.getAttribute("data-ln-tabs-key") || c.id || "").toLowerCase().trim();
        return Ye(n, o).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", a = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-toggle": { effect: p, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, h = /* @__PURE__ */ new Set();
  let r = null;
  function l(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function c() {
    r || (r = function(w) {
      if (pn(w)) return;
      const v = w.target.closest("[" + i + "]");
      if (!v || mn(v)) return;
      const S = v.getAttribute(i);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const f = v.getAttribute(a) || "toggle", y = A.getAttribute(t);
      A.setAttribute(t, l(y, f));
    }, document.addEventListener("click", r));
  }
  function n() {
    h.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function o(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + i + '="' + w.id + '"]'
    );
    for (let A = 0; A < S.length; A++)
      S[A].setAttribute("aria-expanded", v ? "true" : "false");
  }
  function u(w) {
    this.dom = w;
    const v = this;
    return this._onRequestOpen = function() {
      v.open();
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function() {
      v.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), o(w, this.isOpen), h.add(this), c(), this;
  }
  u.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, u.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, u.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, l(w, "toggle"));
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.delete(this), delete this.dom[e], n(), L(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function p(w) {
    const v = w[e];
    if (!v) return;
    const A = w.getAttribute(t) === "open";
    if (A !== v.isOpen)
      if (A) {
        if (Z(w, "ln-toggle:before-open", { target: w }).defaultPrevented) {
          w.setAttribute(t, "close");
          return;
        }
        v.isOpen = !0, w.classList.add("open"), o(w, !0), L(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), o(w, !1), L(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, u, "ln-toggle", {
    attributes: m,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function a(m) {
    return this.dom = m, this._onToggleOpen = function(h) {
      if (h.detail.target.closest("[data-ln-accordion]") !== m) return;
      const r = m.querySelectorAll("[data-ln-toggle]");
      for (const l of r)
        l !== h.detail.target && l.closest("[data-ln-accordion]") === m && l.getAttribute("data-ln-toggle") === "open" && l.setAttribute("data-ln-toggle", "close");
      L(m, "ln-accordion:change", { target: h.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, a, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: i, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, m = et(a);
  function h(r) {
    this.dom = r, tt(this, r, m), this.toggleEl = r.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = r.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const l = this;
    return this._onRequestOpen = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (l.toggleEl) {
        const c = l.toggleEl.getAttribute("data-ln-toggle");
        l.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const n = l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        n && (c.preventDefault(), c.stopPropagation(), l.toggleEl.setAttribute("data-ln-toggle", "close"), l.triggerBtn && l.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        n && (l.triggerBtn && l.triggerBtn.focus(), l.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const o = l._getMenuItems();
      if (o.length === 0) return;
      if (!n && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), l.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const p = l._getMenuItems();
          p.length > 0 && l._focusItem(p, c.key === "ArrowDown" ? 0 : p.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const u = o.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const p = u < o.length - 1 ? u + 1 : 0;
        l._focusItem(o, p);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const p = u > 0 ? u - 1 : o.length - 1;
        l._focusItem(o, p);
      } else c.key === "Home" ? (c.preventDefault(), l._focusItem(o, 0)) : c.key === "End" && (c.preventDefault(), l._focusItem(o, o.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "true"), typeof l.toggleEl.showPopover == "function" && l.toggleEl.showPopover(), l._initMenuAria(), l._reposition(), l._addOutsideClickListener(), l._addScrollRepositionListener(), l._addResizeCloseListener(), L(r, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "false"), l._removeOutsideClickListener(), l._removeScrollRepositionListener(), l._removeResizeCloseListener(), l.toggleEl.style.top = "", l.toggleEl.style.left = "", l.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof l.toggleEl.hidePopover == "function" && l.toggleEl.matches(":popover-open") && l.toggleEl.hidePopover(), L(r, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  h.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const r = this.toggleEl.querySelectorAll("li");
    for (const c of r)
      c.setAttribute("role", "none");
    const l = this._getMenuItems();
    for (let c = 0; c < l.length; c++)
      l[c].setAttribute("role", "menuitem"), l[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, h.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, h.prototype._focusItem = function(r, l) {
    for (let c = 0; c < r.length; c++)
      r[c].setAttribute("tabindex", c === l ? "0" : "-1");
    r[l] && r[l].focus();
  }, h.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const r = this.triggerBtn.getBoundingClientRect(), l = ve(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, o = Zt(r, l, n, c);
    this.toggleEl.style.top = o.top + "px", this.toggleEl.style.left = o.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", o.placement);
  }, h.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const r = this;
    this._boundDocClick = function(l) {
      r.dom.contains(l.target) || r.toggleEl && r.toggleEl.contains(l.target) || r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0);
  }, h.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, h.prototype._addScrollRepositionListener = function() {
    const r = this;
    this._boundScrollReposition = function() {
      r._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, h.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, h.prototype._addResizeCloseListener = function() {
    const r = this;
    this._boundResizeClose = function() {
      r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, h.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, h, "ln-dropdown", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", a = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: u, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, h = [];
  let r = null;
  function l() {
    r || (r = function(p) {
      if (p.key !== "Escape" || h.length === 0) return;
      h[h.length - 1].close();
    }, document.addEventListener("keydown", r));
  }
  function c() {
    h.length > 0 || r && (document.removeEventListener("keydown", r), r = null);
  }
  function n(p) {
    this.dom = p, this.isOpen = p.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.open(S);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.toggle(S);
    }, p.addEventListener("ln-popover:request-open", this._onRequestOpen), p.addEventListener("ln-popover:request-close", this._onRequestClose), p.addEventListener("ln-popover:request-toggle", this._onRequestToggle), p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1"), p.hasAttribute("role") || p.setAttribute("role", "dialog"), p.hasAttribute("popover") || p.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(p) {
    this.isOpen || (this.trigger = p || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(p) {
    this.isOpen ? this.close() : this.open(p);
  }, n.prototype._applyOpen = function(p) {
    this.isOpen = !0, p && (this.trigger = p), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const w = ve(this.dom);
    if (this.trigger) {
      const f = this.trigger.getBoundingClientRect(), y = this.dom.getAttribute(a) || "bottom", d = Zt(f, w, y, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, zt);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(f) {
      A.dom.contains(f.target) || A.trigger && A.trigger.contains(f.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const f = A.trigger.getBoundingClientRect(), y = ve(A.dom), d = A.dom.getAttribute(a) || "bottom", s = Zt(f, y, d, 8);
      A.dom.style.top = s.top + "px", A.dom.style.left = s.left + "px", A.dom.setAttribute("data-ln-popover-placement", s.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), h.push(this), l(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const p = h.indexOf(this);
    p !== -1 && h.splice(p, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(p) {
    this.dom = p;
    const w = p.getAttribute(i);
    return p.setAttribute("aria-haspopup", "dialog"), p.setAttribute("aria-expanded", "false"), p.setAttribute("aria-controls", w), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const S = document.getElementById(w);
      if (!S) return;
      S[e] && (S[e].trigger = p);
      const A = S.getAttribute(t);
      S.setAttribute(t, A === "open" ? "closed" : "open");
    }, p.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function u(p) {
    const w = p[e];
    if (!w) return;
    const S = p.getAttribute(t) === "open";
    if (S !== w.isOpen)
      if (S) {
        if (Z(p, "ln-popover:before-open", {
          popoverId: p.id,
          target: p,
          trigger: w.trigger
        }).defaultPrevented) {
          p.setAttribute(t, "closed");
          return;
        }
        w._applyOpen(w.trigger);
      } else {
        if (Z(p, "ln-popover:before-close", {
          popoverId: p.id,
          target: p,
          trigger: w.trigger
        }).defaultPrevented) {
          p.setAttribute(t, "open");
          return;
        }
        w._applyClose();
      }
  }
  j(t, e, n, "ln-popover", {
    attributes: m
  }), j(i, e + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", a = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[a] !== void 0) return;
  const h = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let r = 0, l = null, c = null, n = null, o = null, u = null, p = null;
  function w() {
    return l && l.parentNode || (l = document.getElementById(m), l || (l = document.createElement("div"), l.id = m, document.body.appendChild(l)), l.hasAttribute("popover") || l.setAttribute("popover", "manual")), l;
  }
  function v() {
    p || (p = function(d) {
      d.key === "Escape" && f();
    }, document.addEventListener("keydown", p));
  }
  function S() {
    p && (document.removeEventListener("keydown", p), p = null);
  }
  function A(d) {
    if (n === d) return;
    f();
    const s = d.getAttribute(e) || d.getAttribute("title");
    if (!s) return;
    w(), typeof l.showPopover == "function" && l.showPopover(), d.hasAttribute("title") && (o = d.getAttribute("title"), d.removeAttribute("title"));
    const g = d.getAttribute("aria-describedby");
    g ? u = g : u = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = s, d[a + "Uid"] || (r += 1, d[a + "Uid"] = "ln-tooltip-" + r), b.id = d[a + "Uid"], l.appendChild(b);
    const T = b.offsetWidth, _ = b.offsetHeight, E = d.getBoundingClientRect(), C = d.getAttribute(i) || "top", q = Zt(E, { width: T, height: _ }, C, 6);
    b.style.top = q.top + "px", b.style.left = q.left + "px", b.setAttribute("data-ln-tooltip-placement", q.placement), u ? d.setAttribute("aria-describedby", u + " " + b.id) : d.setAttribute("aria-describedby", b.id), c = b, n = d, v();
  }
  function f() {
    if (!c) {
      S();
      return;
    }
    n && (u !== null ? n.setAttribute("aria-describedby", u) : n.removeAttribute("aria-describedby"), u = null, o !== null && n.setAttribute("title", o)), o = null, c.parentNode && c.parentNode.removeChild(c), c = null, n = null, l && typeof l.hidePopover == "function" && l.matches(":popover-open") && l.hidePopover(), S();
  }
  function y(d) {
    return this.dom = d, d.hasAttribute("data-ln-tooltip-enhanced") || (d.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(d);
    }, this._onLeave = function() {
      n === d && !d.contains(document.activeElement) && f();
    }, this._onFocus = function() {
      A(d);
    }, this._onBlur = function() {
      n === d && !d.matches(":hover") && f();
    }, d.addEventListener("mouseenter", this._onEnter), d.addEventListener("mouseleave", this._onLeave), d.addEventListener("focus", this._onFocus, !0), d.addEventListener("blur", this._onBlur, !0), this;
  }
  y.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), n === d && f(), this._addedEnhancedAttr && d.removeAttribute("data-ln-tooltip-enhanced"), delete d[a], delete d[a + "Uid"], L(d, "ln-tooltip:destroyed", { trigger: d });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    a,
    y,
    "ln-tooltip",
    {
      attributes: h
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: xt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: xt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, m = et(a);
  function h(A) {
    if (!(!A || !(A instanceof HTMLElement)) && (A.hasAttribute("popover") || A.setAttribute("popover", "manual"), typeof A.showPopover == "function")) {
      if (A.matches(":popover-open"))
        try {
          A.hidePopover();
        } catch {
        }
      try {
        A.showPopover();
      } catch {
      }
    }
  }
  function r(A) {
    if (!A || !(A instanceof HTMLElement)) return;
    if (A.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof A.hidePopover == "function" && A.matches(":popover-open"))
      try {
        A.hidePopover();
      } catch {
      }
  }
  function l(A) {
    this.dom = A, tt(this, A, m);
    const f = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; f.length > this.max; ) A.removeChild(f.shift());
    for (const y of f) w(y, this);
    return f.length > 0 && h(A), this;
  }
  l.prototype.enqueue = function(A) {
    if (!A) return;
    const f = c(A, this.dom);
    if (!f) return;
    const y = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    o(this, f), y > 0 && (f._timer = setTimeout(() => u(f), y));
  }, l.prototype.clear = function() {
    for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      u(A);
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        u(A);
      r(this.dom), L(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function c(A, f) {
    const y = ((A.type || "") + "").trim().toLowerCase(), d = Ct(f, i, "ln-toast");
    if (!d)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    pt(d, {
      type: y,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const s = d.firstElementChild;
    if (!s) return null;
    s.hasAttribute("data-ln-toast-item") || s.setAttribute("data-ln-toast-item", ""), s.classList.add("ln-enter");
    const g = s.querySelector(".body");
    g && n(g, A);
    const b = s.querySelector("[data-ln-toast-close]");
    return b && b.addEventListener("click", function() {
      u(s);
    }), s;
  }
  function n(A, f) {
    if (Array.isArray(f.message)) {
      const y = document.createElement("ul");
      for (const d of f.message) {
        const s = document.createElement("li");
        s.textContent = d, y.appendChild(s);
      }
      A.appendChild(y);
    }
    if (f.data && f.data.errors) {
      const y = document.createElement("ul");
      for (const d of Object.values(f.data.errors).flat()) {
        const s = document.createElement("li");
        s.textContent = d, y.appendChild(s);
      }
      A.appendChild(y);
    }
  }
  function o(A, f) {
    const y = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; y.length >= A.max && y.length > 0; ) A.dom.removeChild(y.shift());
    A.dom.appendChild(f), h(A.dom), requestAnimationFrame(() => f.classList.remove("ln-enter"));
  }
  function u(A) {
    if (!A || !A.parentNode) return;
    const f = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), r(f));
    }, 200);
  }
  function p(A) {
    let f = A && A.container;
    return typeof f == "string" && (f = document.querySelector(f)), f instanceof HTMLElement || (f = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), f || null;
  }
  function w(A, f) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const y = A.querySelector("[data-ln-toast-close]");
    y && y.addEventListener("click", function() {
      u(A);
    });
    const d = +(A.getAttribute("data-ln-toast-timeout") ?? f.timeoutDefault);
    d > 0 && (A._timer = setTimeout(function() {
      u(A);
    }, d));
  }
  function v(A) {
    const f = A.detail || {}, y = p(f);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (y[e] || (y[e] = new l(y))).enqueue(f);
  }
  function S(A) {
    const f = A && A.detail || {};
    if (f.container) {
      const y = p(f);
      y && (y[e] || (y[e] = new l(y))).clear();
    } else {
      const y = document.querySelectorAll("[" + t + "]");
      for (const d of Array.from(y))
        (d[e] || (d[e] = new l(d))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const f of Array.from(A))
        f.querySelectorAll("[data-ln-toast-item]").length > 0 && h(f);
    });
  }, "ln-toast"), j(t, e, l, "ln-toast", {
    attributes: a
  });
})();
function or(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function Qn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function sr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = Qn(t.name), a = String(t.type || "").toLowerCase();
  return e.some((m) => {
    if (m.includes("/")) {
      if (m.endsWith("/*")) {
        const h = m.slice(0, -1);
        return a.startsWith(h);
      }
      return a === m;
    }
    return i === m;
  });
}
function ar(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const a = 1024, m = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], h = Math.floor(Math.log(t) / Math.log(a)), r = Math.min(h, m.length - 1), l = t / Math.pow(a, r);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(l) + " " + m[r];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", a = "file_ids[]";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-upload": { prop: "uploadUrl", read: $, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: $, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: $, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: $, type: "string", fallback: a, description: "Form field name for submitting uploaded file IDs" },
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
  }, h = et(m);
  function r(n, o, u) {
    return ar(n, o, u);
  }
  function l() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function c(n) {
    this.dom = n, tt(this, n, h), this.dict = ie(n, "data-ln-upload-dict"), this.locale = it(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const o = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = or(o), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  c.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const o = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let p = 0; p < o.length; p++) {
      const w = o[p], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), f = w.querySelector('[data-ln-field="sizeText"]'), y = w.getAttribute("data-ln-upload-size"), d = y ? parseInt(y, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: d !== null && !isNaN(d) ? d : f ? f.textContent.trim() : ""
      });
    }
    const u = this.dom.querySelectorAll('input[type="hidden"]');
    for (let p = 0; p < u.length; p++) {
      const w = u[p];
      if (w.name === n.idsFieldName && w.value && !Array.from(n.uploadedFiles.values()).some(function(S) {
        return String(S.serverId) === String(w.value);
      })) {
        const S = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(S, {
          serverId: w.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, c.prototype._syncHiddenInputs = function() {
    const n = this, o = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < o.length; u++)
      o[u].name === n.idsFieldName && o[u].remove();
    for (const [, u] of this.uploadedFiles)
      if (u.serverId) {
        const p = document.createElement("input");
        p.type = "hidden", p.name = n.idsFieldName, p.value = u.serverId, n.dom.appendChild(p);
      }
  }, c.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(o) {
      n.zone === n.dom && o.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && o.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(o) {
      o.preventDefault(), o.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), o.dataTransfer && o.dataTransfer.files && n.upload(o.dataTransfer.files);
    }, this._onListClick = function(o) {
      const u = o.target.closest('[data-ln-upload-action="remove"]');
      if (!u || !n.list || !n.list.contains(u) || u.disabled) return;
      const p = u.closest("[data-ln-upload-item]");
      if (p) {
        const w = p.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(o) {
      o.detail && o.detail.files && n.upload(o.detail.files);
    }, this._onRequestRemove = function(o) {
      if (o.detail) {
        const u = o.detail.localId !== void 0 ? o.detail.localId : o.detail.serverId;
        u !== void 0 && n.remove(u);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, c.prototype.upload = function(n) {
    const o = this, u = Array.from(n);
    for (let p = 0; p < u.length; p++) {
      const w = u[p];
      if (o.maxFiles > 0 && o.uploadedFiles.size >= o.maxFiles) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!sr(w, o.allowedExts)) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (o.maxSize > 0 && w.size > o.maxSize) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(o.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || o._uploadSingleFile(w);
    }
  }, c.prototype._uploadSingleFile = function(n) {
    const o = this, u = "file-" + ++o.fileIdCounter, p = Qn(n.name);
    let w = null;
    if (this.list) {
      const y = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (y && (w = y.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", u), w.setAttribute("data-ln-upload-ext", p), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: o.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const d = w.querySelector('[data-ln-upload-action="remove"]');
        d && (d.disabled = !0);
        const s = w.querySelector("[data-ln-progress]");
        s && s.setAttribute("data-ln-progress", "0"), o.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(o.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let y = 0; y < S.length; y++) {
      const d = S[y];
      !d.name || d.name === o.idsFieldName || d.type === "file" || (d.type === "checkbox" || d.type === "radio") && !d.checked || v.append(d.name, d.value);
    }
    const A = new XMLHttpRequest();
    o.uploadedFiles.set(u, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(y) {
      if (y.lengthComputable) {
        const d = Math.round(y.loaded / y.total * 100);
        if (w) {
          const s = w.querySelector("[data-ln-progress]");
          s && s.setAttribute("data-ln-progress", String(d)), pt(w, { sizeText: d + "%" });
        }
        L(o.dom, "ln-upload:progress", {
          localId: u,
          file: n,
          percent: d,
          loaded: y.loaded,
          total: y.total
        });
      }
    }), A.addEventListener("load", function() {
      const y = o.uploadedFiles.get(u);
      if (y && delete y.xhr, A.status >= 200 && A.status < 300) {
        let d;
        try {
          d = JSON.parse(A.responseText);
        } catch (g) {
          f(o.dict.error || "Error", A.status, g);
          return;
        }
        const s = d.id || d.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), s && w.setAttribute("data-ln-upload-id", String(s)), pt(w, {
            sizeText: r(d.size || n.size, o.locale, o.dict),
            uploading: !1
          });
          const g = w.querySelector('[data-ln-upload-action="remove"]');
          g && (g.disabled = !1);
        }
        y && (y.serverId = s, y.size = d.size || n.size, y.name = d.name || n.name), o._syncHiddenInputs(), L(o.dom, "ln-upload:uploaded", {
          localId: u,
          serverId: s,
          name: d.name || n.name,
          size: d.size || n.size,
          response: d
        });
      } else {
        let d = "";
        try {
          d = JSON.parse(A.responseText).message || "";
        } catch {
        }
        f(d, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const y = o.uploadedFiles.get(u);
      y && delete y.xhr, f("", 0, null);
    });
    function f(y, d, s) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: o.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const g = w.querySelector('[data-ln-upload-action="remove"]');
        g && (g.disabled = !1);
      }
      L(o.dom, "ln-upload:error", {
        file: n,
        message: y,
        status: d,
        error: s
      });
    }
    o.uploadUrl ? (A.open("POST", o.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", l()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const o = this;
    let u = null, p = null;
    if (o.uploadedFiles.has(n))
      u = n, p = o.uploadedFiles.get(n);
    else
      for (const [A, f] of o.uploadedFiles)
        if (String(f.serverId) === String(n)) {
          u = A, p = f;
          break;
        }
    if (!u || !p || Z(o.dom, "ln-upload:before-remove", {
      localId: u,
      serverId: p.serverId
    }).defaultPrevented) return;
    const v = o.list ? o.list.querySelector('[data-ln-upload-local-id="' + u + '"]') : null;
    if (p.xhr && typeof p.xhr.abort == "function" && p.xhr.abort(), !p.serverId) {
      v && v.remove(), o.uploadedFiles.delete(u), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: u, serverId: null });
      return;
    }
    let S = null;
    if (o.deleteUrlPattern ? S = o.deleteUrlPattern.replace("{id}", encodeURIComponent(p.serverId)) : o.uploadUrl && o.uploadUrl.includes("{id}") && (S = o.uploadUrl.replace("{id}", encodeURIComponent(p.serverId))), !S) {
      v && v.remove(), o.uploadedFiles.delete(u), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: u, serverId: p.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), pt(v, { deleting: !0 })), fetch(S, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": l(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(A) {
      A.ok ? (v && v.remove(), o.uploadedFiles.delete(u), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", {
        localId: u,
        serverId: p.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: p,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: p,
        message: "",
        status: 0,
        error: A
      });
    });
  }, c.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, u] of this.uploadedFiles)
        if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), u.serverId) {
          let p = null;
          n.deleteUrlPattern ? p = n.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (p = n.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), p && fetch(p, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": l(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), L(n.dom, "ln-upload:cleared", {});
    }
  }, c.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, c.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, L(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, c, "ln-upload", {
    attributes: m
  });
})();
function Xn(t, e) {
  if (t.length !== 1) return t;
  const i = t.charCodeAt(0);
  if (i >= 65 && i <= 90) {
    const a = ((i - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + a);
  }
  if (i >= 97 && i <= 122) {
    const a = ((i - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + a);
  }
  if (i >= 48 && i <= 57) {
    const a = ((i - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + a);
  }
  return t;
}
function Yn(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let a = "";
    const m = i.length;
    for (let h = 0; h < m; h++)
      a += String.fromCharCode(i[h]);
    return btoa(a);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function Jn(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), a = new Uint8Array(i.length);
      for (let m = 0; m < i.length; m++)
        a[m] = i.charCodeAt(m);
      return new TextDecoder().decode(a);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Zn(t, e) {
  const i = String(e || "ln-ashlar");
  let a;
  typeof TextEncoder < "u" ? a = new TextEncoder().encode(i) : typeof Buffer < "u" ? a = Buffer.from(i, "utf-8") : a = [108, 110];
  const m = a.length || 1, h = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    h[r] = t[r] ^ a[r % m];
  return h;
}
function ti(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let a;
  if (typeof TextEncoder < "u")
    a = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    a = Buffer.from(i, "utf-8");
  else
    return "";
  const m = Zn(a, e);
  let h = "";
  for (let r = 0; r < m.length; r++)
    h += String.fromCharCode(m[r]);
  return typeof btoa < "u" ? btoa(h) : typeof Buffer < "u" ? Buffer.from(m).toString("base64") : "";
}
function ei(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const i = String(t).trim();
    let a = "";
    if (typeof atob < "u")
      a = atob(i);
    else if (typeof Buffer < "u")
      a = Buffer.from(i, "base64").toString("binary");
    else
      return t;
    const m = new Uint8Array(a.length);
    for (let r = 0; r < a.length; r++)
      m[r] = a.charCodeAt(r);
    const h = Zn(m, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(h);
    if (typeof Buffer < "u")
      return Buffer.from(h).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function ni(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", a = Number(t.shift) || 13, m = t.key || "ln-ashlar";
    return { codec: i, shift: a, key: m };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function lr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ni(e);
  return i.codec === "base64" ? Yn(t) : i.codec === "xor" ? ti(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => Xn(a, i.shift));
}
function ge(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ni(e);
  return i.codec === "base64" ? Jn(t) : i.codec === "xor" ? ei(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => Xn(a, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(r) {
    const l = r[e];
    l && l.deobfuscate();
  }
  const a = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function m(r) {
    return r[e] ? r[e] : (r[e] = this, this.dom = r, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  m.prototype.deobfuscate = function() {
    const r = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && r && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((A) => !this.dom.contains(A.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const A = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(f) {
          return f.parentElement && f.parentElement.classList && f.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; A.nextNode(); )
        this._originalTextNodes.push({
          node: A.currentNode,
          raw: A.currentNode.nodeValue
        });
    }
    const c = this.dom.getAttribute(t), n = parseInt(c, 10), o = isNaN(n) ? 13 : n, u = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), p = this.dom.getAttribute("data-ln-obfuscator-key");
    let w = "rot";
    u === "xor" || u === "base64" ? w = u : p && (w = "xor");
    const v = p || "ln-ashlar", S = { codec: w, shift: o, key: v };
    if (r && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const A = this.dom.querySelectorAll(".sr-only");
      for (let y = 0; y < A.length; y++)
        A[y].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const f = (this.dom.rel || "").split(/\s+/).filter(function(y) {
        return y && y !== "noopener" && y !== "noreferrer";
      });
      f.length > 0 ? this.dom.rel = f.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let A = 0; A < this._originalTextNodes.length; A++) {
        const f = this._originalTextNodes[A];
        f.node && f.raw && f.raw.length > 0 && (f.node.nodeValue = ge(f.raw, S));
      }
    if (r && this._originalHref) {
      const A = ge(this._originalHref, S);
      this.dom.setAttribute("href", A);
    }
    L(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: w,
      shift: o,
      key: w === "xor" ? v : null
    });
  }, m.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let r = 0; r < this._originalTextNodes.length; r++) {
          const l = this._originalTextNodes[r];
          l.node && l.raw && (l.node.nodeValue = l.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), L(this.dom, "ln-obfuscator:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  const h = j(t, e, m, "ln-obfuscator", {
    attributes: a
  });
  h.obfuscate = lr, h.deobfuscate = ge, h.utf8ToBase64 = Yn, h.base64ToUtf8 = Jn, h.xorObfuscate = ti, h.xorDeobfuscate = ei;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function i(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !e(l)) return;
    l.target = "_blank";
    const c = (l.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), l.rel = c.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", l.appendChild(n), l.setAttribute("data-ln-external-link", "processed"), L(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function a(l) {
    l = l || document.body;
    for (const c of l.querySelectorAll("a, area"))
      i(c);
  }
  function m() {
    gt(function() {
      document.body.addEventListener("click", function(l) {
        const c = l.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && L(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function h() {
    gt(function() {
      new MutationObserver(function(c) {
        for (const n of c)
          if (n.type === "childList") {
            for (const o of n.addedNodes)
              if (o.nodeType === 1 && (o.matches && (o.matches("a") || o.matches("area")) && i(o), o.querySelectorAll))
                for (const u of o.querySelectorAll("a, area"))
                  i(u);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && i(c);
      });
    }, "ln-external-links");
  }
  function r() {
    m(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      a();
    }) : a();
  }
  window[t] = {
    process: a
  }, r();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function a() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function m(f) {
    i && (i.textContent = f, i.classList.add("ln-link-status--visible"));
  }
  function h() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function r(f, y) {
    if (y.target.closest("a, button, input, select, textarea")) return;
    const d = f.querySelector("a");
    if (!d) return;
    const s = d.getAttribute("href");
    if (!s) return;
    if (y.ctrlKey || y.metaKey || y.button === 1) {
      window.open(s, "_blank", "noopener,noreferrer");
      return;
    }
    Z(f, "ln-link:navigate", { target: f, href: s, link: d }).defaultPrevented || d.click();
  }
  function l(f) {
    const y = f.querySelector("a");
    if (!y) return;
    const d = y.getAttribute("href");
    d && m(d);
  }
  function c() {
    h();
  }
  function n(f) {
    f[e + "Row"] || !f.querySelector("a") || (f[e + "Row"] = !0, f._lnLinkClick = function(d) {
      r(f, d);
    }, f._lnLinkEnter = function() {
      l(f);
    }, f.addEventListener("click", f._lnLinkClick), f.addEventListener("mouseenter", f._lnLinkEnter), f.addEventListener("mouseleave", c));
  }
  function o(f) {
    f[e + "Row"] && (f._lnLinkClick && f.removeEventListener("click", f._lnLinkClick), f._lnLinkEnter && f.removeEventListener("mouseenter", f._lnLinkEnter), f.removeEventListener("mouseleave", c), delete f._lnLinkClick, delete f._lnLinkEnter, delete f[e + "Row"]);
  }
  function u(f) {
    if (!f[e + "Init"]) return;
    const y = f.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const d = y === "TABLE" && f.querySelector("tbody") || f;
      for (const s of d.querySelectorAll("tr"))
        o(s);
    } else
      o(f);
    delete f[e + "Init"];
  }
  function p(f) {
    if (f[e + "Init"]) return;
    f[e + "Init"] = !0;
    const y = f.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const d = y === "TABLE" && f.querySelector("tbody") || f;
      for (const s of d.querySelectorAll("tr"))
        n(s);
    } else
      n(f);
  }
  function w(f) {
    f.hasAttribute && f.hasAttribute(t) && p(f);
    const y = f.querySelectorAll ? f.querySelectorAll("[" + t + "]") : [];
    for (const d of y)
      p(d);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(y) {
        for (const d of y)
          if (d.type === "childList") {
            for (const s of d.addedNodes)
              if (s.nodeType === 1) {
                w(s);
                const g = s.closest("[" + t + "]");
                if (g)
                  if (s.tagName === "TR")
                    n(s);
                  else {
                    const b = g.tagName;
                    if (b === "TABLE" || b === "TBODY") {
                      const T = s.querySelectorAll ? s.querySelectorAll("tr") : [];
                      for (const _ of T)
                        n(_);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt([t], function(y) {
        y.hasAttribute && y.hasAttribute(t) ? w(y) : u(y);
      });
    }, "ln-link");
  }
  function S(f) {
    w(f);
  }
  window[e] = { init: S, destroy: u };
  function A() {
    a(), v(), S(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
})();
(function() {
  const t = "data-ln-scroll", e = "lnScroll";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-scroll": { effect: null, type: "string", description: "Target element ID or CSS selector to scroll into view" },
    "data-ln-scroll-behavior": { effect: null, type: "enum", values: ["smooth", "auto"], fallback: "smooth", description: "Scroll animation behavior transition" },
    "data-ln-scroll-block": { effect: null, type: "enum", values: ["start", "center", "end", "nearest"], fallback: "start", description: "Vertical alignment positioning of scrolled target" },
    "data-ln-scroll-set": { effect: null, type: "string", description: "Optional state attribute assignment on target after scroll (e.g. data-ln-toggle=open)" },
    "data-ln-scroll-focus": { effect: null, type: "string", description: 'CSS selector of element to focus after scroll, or "false" to disable' },
    "data-ln-scroll-delay": { effect: null, type: "integer", fallback: 450, min: 0, description: "Delay in milliseconds before shifting keyboard focus" },
    "data-ln-scroll-update-hash": { effect: null, type: "boolean", fallback: !1, description: "Whether to update URL hash with target ID" }
  };
  function a(m) {
    if (m[e]) return m[e];
    if (!(!m || m.tagName !== "A" && m.tagName !== "BUTTON"))
      return m[e] = this, this.dom = m, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  a.prototype._handleClick = function(m) {
    if (this.dom.tagName === "A" && (m.ctrlKey || m.metaKey || m.shiftKey || m.altKey || m.button !== 0))
      return;
    let h = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (h || (h = (this.dom.getAttribute("href") || "").trim()), !h || h === "#")
      return;
    !h.startsWith("#") && !h.startsWith(".") && !h.startsWith("[") && (h = "#" + h);
    let r = null;
    try {
      r = document.querySelector(h);
    } catch {
      const v = h.replace(/^#/, "");
      r = document.getElementById(v);
    }
    if (!r) return;
    m.preventDefault();
    const l = this.dom.getAttribute("data-ln-scroll-set");
    if (l) {
      const w = l.indexOf(":");
      if (w !== -1) {
        const v = l.slice(0, w).trim(), S = l.slice(w + 1).trim();
        try {
          const A = document.querySelector(v);
          A && (A.value = S, A.dispatchEvent(new Event("input", { bubbles: !0 })), A.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Z(this.dom, "ln-scroll:before-scroll", {
      target: r,
      link: this.dom,
      href: h
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", o = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (r.scrollIntoView({ behavior: n, block: o }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", h);
      } catch {
      }
    const p = this.dom.getAttribute("data-ln-scroll-focus");
    if (p !== "false" && p !== "0") {
      const w = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), v = isNaN(w) ? 450 : w;
      window.setTimeout(function() {
        let S = null;
        if (p && p !== "true" && p !== "1")
          try {
            S = document.querySelector(p);
          } catch {
          }
        S || (S = r.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !S && r.getAttribute("tabindex") !== null && (S = r), S && typeof S.focus == "function" && S.focus({ preventScroll: !0 });
      }, v);
    }
    L(this.dom, "ln-scroll:scrolled", {
      target: r,
      link: this.dom,
      href: h
    });
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), L(this.dom, "ln-scroll:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, a, "ln-scroll", {
    attributes: i
  });
})();
const Ht = ["Ctrl", "Alt", "Shift", "Meta"], cr = {
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
function ii(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = cr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function ri(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), a = /* @__PURE__ */ new Set();
  let m = "";
  for (let r = 0; r < i.length; r++) {
    const l = ii(i[r]);
    if (!l) return "";
    if (Ht.indexOf(l) !== -1) {
      a.add(l);
      continue;
    }
    if (m) return "";
    m = l;
  }
  if (!m) return "";
  const h = [];
  for (let r = 0; r < Ht.length; r++)
    a.has(Ht[r]) && h.push(Ht[r]);
  return h.push(m), h.join("+");
}
function dr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), a = [];
  for (let m = 0; m < i.length; m++) {
    const h = ri(i[m]);
    h && a.indexOf(h) === -1 && a.push(h);
  }
  return a;
}
function ur(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const a = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(a) ? "" : ri(a ? a + "+" + i : i);
}
function fr(t) {
  if (!t) return "";
  const e = ii(t.key);
  if (!e || Ht.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function hr(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const i = t.getAttribute("contenteditable");
    if (i === "" || String(i).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function pr(t, e, i, a) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const m = String(e.tagName || "").toLowerCase();
  return m === "button" ? a === "Enter" || a === "Space" : m === "a" && e.hasAttribute && e.hasAttribute("href") && a === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", a = "data-ln-key-allow-input", m = "data-ln-key-modifier", h = "data-ln-key-for", r = "lnKeyFor";
  if (window[e] !== void 0) return;
  function l(y) {
    const d = y[e];
    if (d) {
      if (!y.hasAttribute(t)) {
        d.destroy();
        return;
      }
      d.sync();
    }
  }
  function c(y) {
    const d = y[r];
    d && !y.hasAttribute(h) && d.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: l, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: l, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: l, description: "Permits shortcut execution even when focused inside an editable input" }
  }, o = {
    "data-ln-key-for": { type: "string", effect: c, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, u = /* @__PURE__ */ new Set();
  let p = null;
  function w() {
    p || (p = function(y) {
      if (y.defaultPrevented || y.isComposing || y.repeat) return;
      const d = fr(y);
      if (!d) return;
      const s = qi(y.target), g = document.querySelectorAll("[" + t + "], [" + h + "]");
      let b = null, T = !1, _ = !1;
      for (let q = 0; q < g.length; q++) {
        const D = g[q], I = D[e] || D[r];
        if (!I || !I.matches(d) || s && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = hr(R);
        if (!(!O || !xi(R, O))) {
          if (pr(y, R, O, d)) {
            _ = !0;
            continue;
          }
          b ? T = !0 : b = { host: D, target: R, action: O };
        }
      }
      if (_ || !b) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + d + '"; first DOM match wins.');
      const E = {
        source: b.host,
        target: b.target,
        action: b.action,
        key: d,
        event: y
      };
      Z(b.host, "ln-key:before-trigger", E).defaultPrevented || (y.preventDefault(), b.target[b.action](), L(b.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", p));
  }
  function v() {
    u.size > 0 || !p || (document.removeEventListener("keydown", p), p = null);
  }
  function S(y) {
    return this.dom = y, this.shortcuts = [], u.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = dr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(y) {
    return this.shortcuts.indexOf(y) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(a);
  }, S.prototype.resolveTarget = function() {
    const y = this.dom.getAttribute(i);
    return y ? f(y, i) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (u.delete(this), delete this.dom[e], v(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(y) {
    return this.dom = y, u.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + m + "]");
  }, A.prototype.shortcut = function() {
    const y = this._modifierContext(), d = y ? y.getAttribute(m) : "";
    return ur(d, this.dom.textContent);
  }, A.prototype.matches = function(y) {
    return this.shortcut() === y;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(a)) return !0;
    const y = this._modifierContext();
    return !!(y && y.hasAttribute(a));
  }, A.prototype.resolveTarget = function() {
    return f(this.dom.getAttribute(h), h);
  }, A.prototype.destroy = function() {
    this.dom[r] && (u.delete(this), delete this.dom[r], v(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function f(y, d) {
    if (!y) return null;
    try {
      const s = document.querySelector(y);
      return s || console.warn("[ln-key] Target not found for " + d + ' selector "' + y + '".'), s;
    } catch {
      return console.warn("[ln-key] Invalid " + d + ' selector "' + y + '".'), null;
    }
  }
  j(t, e, S, "ln-key", {
    attributes: n
  }), j(h, r, A, "ln-key-for", {
    attributes: o
  });
})();
function mr(t, e, i = 100) {
  if (e != null && e !== "") {
    const a = parseFloat(String(e));
    if (!isNaN(a) && a > 0) return a;
  }
  if (t != null && t !== "") {
    const a = parseFloat(String(t));
    if (!isNaN(a) && a > 0) return a;
  }
  return i;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function i(l) {
    const c = l[e];
    c && r.call(c);
  }
  const a = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function m(l) {
    return this.dom = l, this._parentObserver = null, r.call(this), h.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function h() {
    const l = this, c = this.dom.parentElement;
    if (!c) return;
    const n = new MutationObserver(function(o) {
      for (const u of o)
        u.attributeName === "data-ln-progress-max" && r.call(l);
    });
    n.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function r() {
    const l = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, o = this.dom.getAttribute("data-ln-progress-max"), u = mr(o, n, 100), p = Rn(l, u);
    this.dom.style.width = p.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(p.min)), this.dom.setAttribute("aria-valuemax", String(p.max)), this.dom.setAttribute("aria-valuenow", String(p.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: p.value,
      max: p.max,
      percentage: p.percentage
    });
  }
  j(
    t,
    e,
    m,
    "ln-progress",
    {
      attributes: a
    }
  );
})();
function gr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function _r(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const a = Object.keys(e);
  if (a.length === 0) return !0;
  for (let m = 0; m < a.length; m++) {
    const h = e[a[m]];
    let r = "";
    if (h.col !== null && h.col !== void 0 ? r = t[h.col] || "" : h.attr && i && typeof i.getAttribute == "function" && (r = i.getAttribute(h.attr) || ""), !Re(r, h.values))
      return !1;
  }
  return !0;
}
function Ze(t, e, i, a) {
  if (a != null && !isNaN(a))
    return parseInt(a, 10);
  if (e && typeof e.getAttribute == "function") {
    const m = e.getAttribute("data-ln-filter-col");
    if (m !== null && !isNaN(parseInt(m, 10)))
      return parseInt(m, 10);
    if (typeof e.closest == "function") {
      const h = e.closest("th");
      if (h && typeof h.cellIndex == "number")
        return h.cellIndex;
      const r = e.closest("[data-ln-popover], [id]");
      if (r && r.id) {
        const l = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (l && typeof l.querySelector == "function") {
          const c = l.querySelector('[data-ln-popover-for="' + r.id + '"]');
          if (c && typeof c.closest == "function") {
            const n = c.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && i && typeof t.querySelectorAll == "function") {
    const m = t.querySelectorAll("thead th, tr:first-child th"), h = String(i).trim().toLowerCase();
    for (let r = 0; r < m.length; r++) {
      const l = m[r], c = l.getAttribute("data-ln-table-filter-col") || l.getAttribute("data-ln-filter-col") || l.getAttribute("data-ln-filter-key") || l.getAttribute("data-ln-table-col") || l.getAttribute("data-ln-col") || l.getAttribute("data-ln-field");
      if (c && c.trim().toLowerCase() === h)
        return typeof l.cellIndex == "number" ? l.cellIndex : r;
    }
    if (e) {
      const r = e.closest ? e.closest("[data-ln-popover], [id]") : null, l = r && r.id || e.id || null;
      if (l)
        for (let c = 0; c < m.length; c++) {
          const n = m[c];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + l + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : c;
        }
    }
    for (let r = 0; r < m.length; r++) {
      const l = m[r], n = Array.from(l.childNodes || []).filter((u) => u.nodeType === 3), o = (n.length > 0 ? n.map((u) => u.textContent.trim()).join(" ") : l.textContent || "").trim().toLowerCase();
      if (o && o === h)
        return typeof l.cellIndex == "number" ? l.cellIndex : r;
    }
  }
  return null;
}
function yr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let a = 0; a < t.length; a++) {
    const m = t[a];
    !e && m.key && (e = m.key), m.checked && !m.isReset && m.value && i.push(m.value);
  }
  return { key: e, values: i };
}
function br(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function tn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", a = "data-ln-filter-value", m = "data-ln-filter-hide", h = "data-ln-filter-reset", r = "data-ln-filter-col", l = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-filter": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: y, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: y, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" }
  }, u = et(o);
  function p(d) {
    return d.hasAttribute(h) || !d.getAttribute(a);
  }
  function w(d) {
    const s = d.dom.querySelectorAll("[" + i + "]"), g = [];
    for (let T = 0; T < s.length; T++) {
      const _ = s[T];
      g.push({
        key: _.getAttribute(i),
        value: _.getAttribute(a) || "",
        checked: _.checked,
        isReset: p(_)
      });
    }
    const b = yr(g);
    return { key: b.key, values: b.values, targetId: d.targetId };
  }
  function v(d, s, g) {
    const b = d.querySelectorAll("[" + i + "]"), T = Array.isArray(g) && g.length > 0;
    for (let _ = 0; _ < b.length; _++) {
      const E = b[_];
      p(E) ? E.checked = !T : T && E.getAttribute(i) === s && g.indexOf(E.getAttribute(a)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(d) {
    this.dom = d, tt(this, d, u);
    const s = d.getAttribute(r);
    this.colIndex = s !== null ? parseInt(s, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(d, "filter"), this.hashEnabled = !!this.nsKey;
    const g = this, b = oe(function() {
      g._render();
    });
    this._queueRender = b, this._attachHandlers(), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const _ = st(g.nsKey), E = be(_);
      E && E.key && E.values.length > 0 ? v(g.dom, E.key, E.values) : v(g.dom, null, []), g._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const _ = st(this.nsKey), E = be(_);
      E && E.key && E.values.length > 0 && (v(d, E.key, E.values), mt(function() {
        g._destroyed || g._render();
      }), T = !0);
    }
    if (!T) {
      const _ = tn(d.getAttribute(c));
      if (_.length > 0) {
        const E = d.querySelector("[" + i + "]"), C = E ? E.getAttribute(i) : null;
        C && (v(d, C, _), mt(function() {
          g._destroyed || g._render();
        }), T = !0);
      }
    }
    if (!T) {
      const _ = d.querySelectorAll("[" + i + "]");
      for (let E = 0; E < _.length; E++)
        if (_[E].checked && !p(_[E])) {
          mt(function() {
            g._destroyed || g._render();
          });
          break;
        }
    }
    return this;
  }
  S.prototype._attachHandlers = function() {
    const d = this;
    this._onDomChange = function(s) {
      const g = s.target;
      if (!g || !g.hasAttribute || !g.hasAttribute(i)) return;
      const b = Array.from(d.dom.querySelectorAll("[" + i + "]"));
      if (p(g)) {
        for (let T = 0; T < b.length; T++)
          p(b[T]) || (b[T].checked = !1);
        g.checked = !0, d._queueRender();
        return;
      }
      if (g.checked) {
        for (let _ = 0; _ < b.length; _++)
          p(b[_]) && (b[_].checked = !1);
        let T = !1;
        for (let _ = 0; _ < b.length; _++)
          if (p(b[_])) {
            T = !0;
            break;
          }
        if (T) {
          let _ = !0;
          for (let E = 0; E < b.length; E++)
            if (!p(b[E]) && !b[E].checked) {
              _ = !1;
              break;
            }
          if (_)
            for (let E = 0; E < b.length; E++)
              p(b[E]) ? b[E].checked = !0 : b[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let _ = 0; _ < b.length; _++)
          if (!p(b[_]) && b[_].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let _ = 0; _ < b.length; _++)
            p(b[_]) && (b[_].checked = !0);
      }
      d._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const d = this, s = w(this), g = this._lastSnapshot;
    if (!(!g || g.key !== s.key || gr(g.values, s.values))) return;
    const T = s.key === null || s.values.length === 0, _ = document.getElementById(d.targetId), E = {
      key: s.key,
      values: s.values.slice(),
      targetId: d.targetId
    };
    L(d.dom, "ln-filter:change", E);
    let C = !1;
    _ && _ !== d.dom && Z(_, "ln-filter:change", E).defaultPrevented && (C = !0);
    const q = g && g.values.length > 0, D = s.values.length === 0;
    if (q && D) {
      const O = { targetId: d.targetId };
      L(d.dom, "ln-filter:reset", O), _ && _ !== d.dom && L(_, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: s.key, values: s.values.slice() };
    const I = br(s.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = In(s.key, s.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = _ && (_.tagName === "TABLE" ? _ : _.querySelector ? _.querySelector("table") : null);
    if (R)
      d._filterTableRows(s, R);
    else {
      if (!_) return;
      const O = _.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(m), T) continue;
        const H = B.getAttribute("data-" + s.key);
        H !== null && (Re(H, s.values) || B.setAttribute(m, "true"));
      }
    }
  };
  function A(d) {
    if (!d) return "";
    const s = d.querySelector ? d.querySelector("[data-ln-value]") : null;
    return vt(s || d);
  }
  function f(d) {
    return !!(!d || typeof d != "object" || d.tagName === "TEMPLATE" || typeof d.hasAttribute == "function" && (d.hasAttribute("data-ln-sort-exclude") || d.hasAttribute("hidden")) || d.classList && d.classList.contains("hidden") || d.style && d.style.display === "none" || typeof d.matches == "function" && d.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof d.querySelector == "function" && d.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(d, s) {
    if (!s) {
      const C = document.getElementById(this.targetId);
      if (!C || (s = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !s)) return;
    }
    const g = Ze(s, this.dom, d.key, this.colIndex), b = d.key || this.dom.getAttribute("data-ln-filter-key") || (g !== null ? "col" + g : "attr-filter"), T = d.values;
    n.has(s) || n.set(s, {});
    const _ = n.get(s);
    b && T.length > 0 ? _[b] = {
      col: g,
      values: T.slice(),
      attr: "data-" + b
    } : b && delete _[b];
    const E = s.tBodies;
    for (let C = 0; C < E.length; C++) {
      const q = E[C].rows;
      for (let D = 0; D < q.length; D++) {
        const I = q[D];
        if (f(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        _r(R, _, I) ? I.removeAttribute(m) : I.setAttribute(m, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const d = document.getElementById(this.targetId);
    if (d) {
      const s = d.tagName === "TABLE" ? d : d.querySelector ? d.querySelector("table") : null;
      if (s && n.has(s)) {
        const g = n.get(s), b = Ze(s, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (b !== null ? "col" + b : this.colIndex !== null ? "col" + this.colIndex : null);
        T && g[T] && (delete g[T], this._filterTableRows({ key: null, values: [] }, s)), Object.keys(g).length === 0 && n.delete(s);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function y(d, s) {
    const g = d[e];
    if (!(!g || g._destroyed)) {
      if (s === l)
        g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = wt(d, "filter"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange);
      else if (s === c) {
        const b = tn(d.getAttribute(c)), T = d.querySelector("[" + i + "]"), _ = T ? T.getAttribute(i) : null;
        _ && (v(d, _, b), g._render());
      }
    }
  }
  j(t, e, S, "ln-filter", {
    attributes: o,
    persist: {
      attr: c,
      hashActive: function(d) {
        return !!wt(d, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", a = "lnSearchControl", m = "data-ln-search-items", h = "data-ln-search-fields", r = "data-ln-search-exclude", l = "data-ln-search-hide", c = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: d, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: d, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, o = et(n);
  function u(s) {
    const g = wt(s, "search");
    if (g) return g;
    if (s.id) {
      const b = document.querySelector("[" + i + '="' + s.id + '"]');
      if (b) {
        const T = wt(b, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function p(s) {
    return s.matches("input, textarea") ? s : s.querySelector("input, textarea");
  }
  function w(s, g) {
    const b = s.childNodes;
    for (let T = 0; T < b.length; T++) {
      const _ = b[T];
      if (_.nodeType === 3) {
        g.push(_.nodeValue);
        continue;
      }
      _.nodeType === 1 && (_.hasAttribute(r) || w(_, g));
    }
  }
  function v(s) {
    if (s._lnSearchText !== void 0) return s._lnSearchText;
    const g = [];
    w(s, g);
    const b = Vi(g);
    return s._lnSearchText = b, b;
  }
  function S(s, g) {
    if (!s.id) return;
    const b = document.querySelectorAll("[" + i + '="' + s.id + '"]');
    for (const T of b) {
      const _ = p(T);
      _ && _.value !== g && (_.value = g);
    }
  }
  function A(s) {
    this.dom = s, this.term = s.getAttribute(t) || "", this._destroyed = !1;
    const g = this;
    return this.nsKey = u(s), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const b = st(g.nsKey), T = g.dom.getAttribute(t) || "";
      b !== null && b !== T ? g.dom.setAttribute(t, b) : b === null && T !== "" && g.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!g._destroyed) {
        if (g.hashEnabled) {
          const b = st(g.nsKey);
          if (b !== null && b !== g.term) {
            g.term = b, g.dom.setAttribute(t, b), S(g.dom, b), g._apply();
            return;
          }
        }
        we(g.term) && (S(g.dom, g.term), g._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const s = this.dom, g = we(this.term), b = Mn(g);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = ji(s.getAttribute(h));
    if (Z(s, "ln-search:change", {
      term: g,
      tokens: b,
      targetId: s.id,
      fields: T
    }).defaultPrevented) return;
    const E = s.getAttribute(m), C = E ? s.querySelectorAll(E) : s.children;
    for (let q = 0; q < C.length; q++) {
      const D = C[q];
      if (D.removeAttribute(l), D.hasAttribute(r) || b.length === 0) continue;
      const I = v(D);
      Nn(I, b) || D.setAttribute(l, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function f(s) {
    if (this.dom = s, tt(this, s, o), this.input = p(s), this._attachHandler(), this.input && this.input.value.trim()) {
      const g = this;
      mt(function() {
        const b = document.getElementById(g.targetId);
        b && ((b.getAttribute(t) || "").trim() || g._write(g.input.value));
      });
    }
    return this;
  }
  f.prototype._write = function(s) {
    const g = document.getElementById(this.targetId);
    g && g.getAttribute(t) !== s && g.setAttribute(t, s);
  }, f.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._onInput = function() {
      s._write(s.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[a]);
  };
  function y(s) {
    const g = s.getAttribute("data-ln-search-clear-for");
    if (g) {
      const C = document.getElementById(g), q = document.querySelector("[" + i + '="' + g + '"]'), D = q ? p(q) : null;
      return { target: C, input: D };
    }
    const b = s.closest("[" + t + "]");
    if (b) {
      const C = b.id ? document.querySelector("[" + i + '="' + b.id + '"]') : null, q = C ? p(C) : null;
      return { target: b, input: q };
    }
    const T = s.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), q = C ? document.getElementById(C) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + i + '="' + C + '"]'), I = D ? p(D) : null;
        return { target: q, input: I };
      }
    }
    const _ = s.closest("[" + i + "]");
    if (_) {
      const C = _.getAttribute(i), q = C ? document.getElementById(C) : null, D = p(_);
      return { target: q, input: D };
    }
    const E = s.parentElement;
    if (E) {
      const C = E.querySelector("[" + i + "]");
      if (C) {
        const q = C.getAttribute(i), D = q ? document.getElementById(q) : null, I = p(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(s) {
    const g = s.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!g) return;
    const b = y(g);
    !b.target && !b.input || (s.preventDefault(), b.input && (b.input.value = "", b.input.focus()), b.target && b.target.setAttribute(t, ""));
  });
  function d(s, g) {
    const b = s[e];
    if (!b || b._destroyed) return;
    if (g === c) {
      b._onHashChange && window.removeEventListener("hashchange", b._onHashChange), b.nsKey = u(s), b.hashEnabled = !!b.nsKey, b.hashEnabled && window.addEventListener("hashchange", b._onHashChange);
      return;
    }
    const T = s.getAttribute(t) || "";
    T !== b.term && (b.term = T, S(s, T), b._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(s, g) {
      const b = g.target;
      b && b._lnSearchText !== void 0 && delete b._lnSearchText, b && b.parentElement && b.parentElement._lnSearchText !== void 0 && delete b.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(s) {
        return !!u(s);
      }
    }
  }), j(i, a, f, "ln-search-control");
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function vr(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function wr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Er(t, e, i, a) {
  const m = St(t);
  if (m === "none") return () => 0;
  const h = m === "desc" ? -1 : 1, r = typeof a == "function" ? a : (l) => l;
  return function(l, c) {
    const n = r(l), o = r(c);
    return Le(n, o, e, i) * h;
  };
}
function _e(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Ar(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const i = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (i && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(i));
  if (t.tagName === "TABLE") {
    const a = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (a)
      return Array.from(a.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", a = "data-ln-sort-state", m = "data-ln-sort-dir", h = "data-ln-hash";
  if (window[e] !== void 0) return;
  function r(w, v) {
    return w.getAttribute(v) || null;
  }
  const l = {
    "data-ln-sort": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: r, effect: p, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: r, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: p, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: p, description: "URL hash routing key for sort state persistence" }
  }, c = et(l), n = /* @__PURE__ */ new WeakMap();
  function o(w, v, S) {
    if (v) {
      const A = w.querySelector('[data-ln-field="' + v + '"]');
      return A ? vt(A) : "";
    }
    return S != null && w.cells && w.cells[S] ? vt(w.cells[S]) : vt(w);
  }
  function u(w) {
    this.dom = w, tt(this, w, c);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(a)), w.hasAttribute(a) || w.setAttribute(a, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(f) {
      const y = f.target.closest("[" + m + "]");
      if (!y) return;
      const d = St(y.getAttribute(m));
      S._apply(d);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(f) {
      if (S._destroyed || !f.detail) return;
      const y = S._resolveTarget();
      if (!(y && (f.target === y || y.contains(f.target)) || f.detail.targetId && f.detail.targetId === S.targetId)) return;
      if (wr(
        { field: S.field, column: S.column },
        { field: f.detail.field, column: f.detail.column }
      )) {
        const g = St(f.detail.direction);
        g && w.getAttribute(a) !== g && (S._state = g, w.setAttribute(a, g), S._updateAriaSort(g));
        return;
      }
      w.getAttribute(a) !== "none" && (S._state = "none", w.setAttribute(a, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const f = st(S.nsKey), y = ye(f);
      if (y)
        S.field !== null && y.fieldOrColumn === S.field || S.column !== null && String(S.column) === y.fieldOrColumn ? S._state !== y.direction && S._apply(y.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(a, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(a, "none"), S._updateAriaSort("none");
        const d = S._resolveTarget();
        d && (Z(d, "ln-sort:change", {
          field: S.field,
          column: S.column,
          direction: "none",
          targetId: S.targetId
        }).defaultPrevented || S._defaultSort(d, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const f = st(this.nsKey), y = ye(f);
      y && ((S.field !== null && y.fieldOrColumn === S.field || S.column !== null && String(S.column) === y.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(y.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const f = St(w.getAttribute(a));
      f && f !== "none" && mt(function() {
        S._destroyed || S._apply(f, !0);
      });
    }
    return this;
  }
  u.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, u.prototype._updateAriaSort = function(w) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", vr(w));
  }, u.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const d = this.dom.closest("th");
      d && d.cellIndex !== void 0 && (this.column = d.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(a) !== S && this.dom.setAttribute(a, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const f = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const d = xn(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, d);
    }
    Z(A, "ln-sort:change", f).defaultPrevented || this._defaultSort(A, S);
  }, u.prototype._defaultSort = function(w, v) {
    const S = Ar(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, f = S.filter(function(g) {
      return !_e(g);
    });
    if (!f.length) return;
    n.has(w) || n.set(w, f.slice());
    let y;
    if (v === "none") {
      const g = n.get(w) || f;
      n.delete(w), y = g.filter(function(b) {
        return b.parentNode === A && !_e(b);
      });
    } else {
      const g = this.field, b = this.column, T = f.map(function(q) {
        return o(q, g, b);
      }), _ = ke(T), E = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Er(v, _, E, function(q) {
        return o(q, g, b);
      });
      y = f.slice().sort(C);
    }
    const d = document.createDocumentFragment();
    let s = 0;
    for (let g = 0; g < S.length; g++) {
      const b = S[g];
      _e(b) ? d.appendChild(b) : s < y.length && d.appendChild(y[s++]);
    }
    A.appendChild(d);
  }, u.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function p(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === i) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === a) {
        const A = St(w.getAttribute(a));
        A !== S._state && S._apply(A);
      } else v === h && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, u, "ln-sort", {
    attributes: l,
    persist: {
      attr: a,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function en(t, e, i, a, m = 15) {
  if (a <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const h = Math.max(0, t || 0), r = Math.max(0, e || 0), l = Math.floor(h / i), c = Math.ceil(r / i), n = Math.max(0, l - m), o = Math.min(a, l + c + m), u = n * i, p = Math.max(0, (a - o) * i);
  return { start: n, end: o, topPadding: u, bottomPadding: p };
}
function Sr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, a = e instanceof Set ? e : new Set(e || []);
  let m = 0;
  if (Array.isArray(t))
    for (let l = 0; l < t.length; l++)
      a.has(t[l]) && m++;
  else
    m = a.size;
  const h = i > 0 && m === i, r = m > 0 && m < i;
  return { totalCount: i, selectedCount: m, isAllSelected: h, isIndeterminate: r };
}
function nn(t, e, i) {
  const a = new Set(t);
  return e == null || ((i !== void 0 ? i : !a.has(e)) ? a.add(e) : a.delete(e)), a;
}
function rn(t, e, i) {
  const a = new Set(t);
  if (!Array.isArray(e)) return a;
  if (i)
    for (let m = 0; m < e.length; m++)
      e[m] != null && a.add(e[m]);
  else
    for (let m = 0; m < e.length; m++)
      a.delete(e[m]);
  return a;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function c(f, y) {
    if (!f || !f.isDataDriven) return;
    const d = f.dom.hasAttribute("data-ln-table-window");
    if (d && !f._windowed)
      f._enterWindowedMode(), f._kickWindowInitial();
    else if (!d && f._windowed)
      f._exitWindowedMode();
    else if (d && f._windowed) {
      const s = parseInt(y, 10);
      s > 0 && f._cache.configure({ windowSize: s });
    }
  }
  function n(f, y) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(y, 10);
    d > 0 && f._cache.configure({ pageSize: d });
  }
  function o(f, y) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(y, 10);
    d >= 0 && f._cache.configure({ threshold: d });
  }
  function u(f, y) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(y, 10);
    d >= 0 && f._cache.setGrandTotal(d);
  }
  const p = {
    "data-ln-table": { prop: "name", type: "string", read: $, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: c, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: u, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, w = et(p);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(f, y) {
    if (f == null || isNaN(f)) return "";
    try {
      return new Intl.NumberFormat(it(y)).format(f);
    } catch {
      return String(f);
    }
  }
  function S(f) {
    let y = f.parentElement;
    for (; y && y !== document.body && y !== document.documentElement; ) {
      const s = getComputedStyle(y).overflowY;
      if (s === "auto" || s === "scroll") return y;
      y = y.parentElement;
    }
    return null;
  }
  function A(f) {
    this.dom = f, tt(this, f, w), this.table = f.querySelector("table"), this.tbody = f.querySelector("[data-ln-table-body]") || f.querySelector("tbody"), this.thead = f.querySelector("thead");
    const y = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = y ? Array.from(y.querySelectorAll("th")) : [], this._totalSpan = f.querySelector("[data-ln-table-total]"), this._filteredSpan = f.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== f ? this._filteredSpan.parentElement : null), this._selectedSpan = f.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== f ? this._selectedSpan.parentElement : null), this.isDataDriven = f.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const d = this;
    return this._onSetSearch = function(s) {
      const g = (s.detail && s.detail.query != null ? s.detail.query : s.detail && s.detail.term != null ? s.detail.term : "").trim();
      d.isDataDriven ? (d.currentSearch = g, L(f, "ln-table:search", {
        table: d.name,
        query: d.currentSearch
      }), d._requestData()) : (d._searchTerm = g.toLowerCase(), d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(f, "ln-table:filter", {
        term: d._searchTerm,
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, f.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(s) {
      s.preventDefault(), d._onSetSearch(s);
    }, f.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      d.isDataDriven ? (d.currentFilters = {}, d.currentSearch = "", L(f, "ln-table:clear-filters", { table: d.name }), d._requestData()) : (d._searchTerm = "", d._columnFilters = {}, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(f, "ln-table:filter", {
        term: "",
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, f.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && f.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(s) {
      const g = s.detail || {}, b = g.data || [], T = g.total != null ? g.total : b.length;
      if (!(d._hasInitialSeed && !d.isLoaded && b.length === 0 && T === 0)) {
        if (d._windowed) {
          d._cache.ingest(g) && !g.provisional && f.classList.remove("ln-table--loading");
          return;
        }
        d._data = b, d._lastTotal = T, d._lastFiltered = g.filtered != null ? g.filtered : d._data.length, d.totalCount = d._lastTotal, d.visibleCount = d._lastFiltered, d.isLoaded = !0, d._hasInitialSeed = !1, f.classList.remove("ln-table--loading"), d._vStart = -1, d._vEnd = -1, d._applyFilterAndSort(), d._render(), d._updateFooter(), L(f, "ln-table:rendered", {
          table: d.name,
          total: d.totalCount,
          visible: d.visibleCount
        });
      }
    }, f.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(s) {
      const g = s.detail && s.detail.loading;
      f.classList.toggle("ln-table--loading", !!g), g && (d.isLoaded = !1);
    }, f.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(s) {
      !d._windowed || !d._cache || d._cache.release(s.detail && s.detail.offset);
    }, f.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !d._windowed || !d._cache || d._cache.revalidate();
    }, f.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !d._windowed || !d._cache || d._requestData();
    }, f.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(s) {
      s.preventDefault(), d.currentSort = s.detail.direction === "none" ? null : { field: s.detail.field, direction: s.detail.direction }, d._requestData();
    }, f.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(s) {
      if (s.target.closest("[data-ln-table-row-select]") || s.target.closest("[data-ln-table-row-action]") || s.target.closest("a") || s.target.closest("button") || s.ctrlKey || s.metaKey || s.button === 1) return;
      const g = s.target.closest("[data-ln-table-row]");
      if (!g) return;
      const b = g.getAttribute("data-ln-table-row-id"), T = g._lnRecord || {};
      L(f, "ln-table:row-click", {
        table: d.name,
        id: b,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(s) {
      const g = s.target.closest("[data-ln-table-row-action]");
      if (!g) return;
      const b = g.closest("[data-ln-table-row]");
      if (!b) return;
      const T = g.getAttribute("data-ln-table-row-action"), _ = b.getAttribute("data-ln-table-row-id"), E = b._lnRecord || {};
      L(f, "ln-table:row-action", {
        table: d.name,
        id: _,
        action: T,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(f, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      d.tbody.rows.length > 0 && (d._emptyTbodyObserver.disconnect(), d._emptyTbodyObserver = null, d._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(s) {
      s.preventDefault();
      const g = s.detail.direction === "none" ? null : s.detail.direction;
      d._sortCol = g === null ? -1 : s.detail.column, d._sortDir = g, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), L(f, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: d._filteredData.length,
        total: d._data.length
      });
    }, f.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(s) {
      if (s.preventDefault(), !s.detail) return;
      const g = s.detail.key, b = s.detail.values || [];
      if (g) {
        if (b.length === 0)
          delete d._columnFilters[g];
        else {
          const T = [];
          for (let _ = 0; _ < b.length; _++)
            T.push(b[_].toLowerCase());
          d._columnFilters[g] = T;
        }
        d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(f, "ln-table:filter", {
          term: d._searchTerm,
          matched: d._filteredData.length,
          total: d._data.length
        });
      }
    }, f.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const f = this.tbody.rows, y = this.ths;
    this._data = [], f.length > 0 && (this._rowHeight = f[0].offsetHeight || 40), this._lockColumnWidths();
    for (let d = 0; d < f.length; d++) {
      const s = f[d], g = [], b = [], T = [];
      for (let E = 0; E < s.cells.length; E++) {
        const C = s.cells[E], q = C.textContent.trim();
        g[E] = vt(C), b[E] = q.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(q.toLowerCase());
      }
      let _ = null;
      if (this.isDataDriven) {
        _ = {};
        const E = s.getAttribute("data-ln-table-row-id");
        E != null && (_.id = E);
        for (let C = 0; C < y.length; C++) {
          const q = y[C].getAttribute("data-ln-table-col");
          if (q) {
            const D = C;
            if (D < s.cells.length) {
              const I = s.cells[D];
              _[q] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: g,
        rawTexts: b,
        html: s.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && _ ? _.id : void 0,
        ..._
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const f = document.createElement("colgroup");
    this.ths.forEach(function(y) {
      const d = document.createElement("col");
      d.style.width = y.offsetWidth + "px", f.appendChild(d);
    }), this.table.insertBefore(f, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = f;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const f = this._lastTotal, y = this.visibleCount;
        if (f === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || y === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const f = this._filteredData.length;
        f === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : f > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const f = this._filteredData, y = document.createDocumentFragment();
      for (let d = 0; d < f.length; d++) {
        const s = this._buildRow(f[d]);
        if (!s) break;
        y.appendChild(s);
      }
      this.tbody.replaceChildren(y), this._selectable && this._updateSelectAll();
    } else {
      const f = [], y = this._filteredData;
      for (let d = 0; d < y.length; d++) f.push(y[d].html);
      this.tbody.innerHTML = f.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const f = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let d = null;
        if (this._windowed) {
          const s = this._cache ? this._cache.peek() : null;
          d = s ? this._buildRow(s) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (d = this._buildRow(this._data[0]));
        d && this.tbody && (this.tbody.appendChild(d), this._rowHeight = d.offsetHeight || 40, d.remove());
      }
    this.isDataDriven ? this._scrollContainer = S(this.dom) : this._scrollContainer = null;
    const y = this._scrollContainer || window;
    this._scrollHandler = function() {
      f._rafId || (f._rafId = requestAnimationFrame(function() {
        f._rafId = null, f._windowed ? f._renderWindowed() : f._renderVirtual();
      }));
    }, y.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const f = this._filteredData, y = f.length, d = this._rowHeight;
    if (!d || !y) return;
    const s = this.thead ? this.thead.offsetHeight : 0, g = this._scrollContainer;
    let b, T;
    if (g) {
      const R = this.table.getBoundingClientRect(), O = g.getBoundingClientRect(), P = R.top - O.top + g.scrollTop + s;
      b = g.scrollTop - P, T = g.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + s;
      b = window.scrollY - P, T = window.innerHeight;
    }
    const _ = en(b, T, d, y, 15), E = _.start, C = _.end;
    if (E === this._vStart && C === this._vEnd) return;
    this._vStart = E, this._vEnd = C;
    const q = this.ths.length || 1, D = _.topPadding, I = _.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", q), P.style.height = D + "px", O.appendChild(P), R.appendChild(O);
      }
      for (let O = E; O < C; O++) {
        const P = this._buildRow(f[O]);
        P && R.appendChild(P);
      }
      if (I > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", q), P.style.height = I + "px", O.appendChild(P), R.appendChild(O);
      }
      this.tbody.replaceChildren(R), this._selectable && this._updateSelectAll();
    } else {
      let R = "";
      D > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>');
      for (let O = E; O < C; O++) R += f[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const f = document.createElement("tr");
    f.className = "ln-table__placeholder", f.setAttribute("aria-hidden", "true");
    const y = document.createElement("td");
    return y.setAttribute("colspan", this.ths.length || 1), y.style.height = this._rowHeight + "px", f.appendChild(y), f;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const f = this._rowHeight;
    if (!f) return;
    const y = this._cache.logicalTotal, d = this.thead ? this.thead.offsetHeight : 0, s = this._scrollContainer;
    let g, b;
    if (s) {
      const R = this.table.getBoundingClientRect(), O = s.getBoundingClientRect(), P = R.top - O.top + s.scrollTop + d;
      g = s.scrollTop - P, b = s.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + d;
      g = window.scrollY - P, b = window.innerHeight;
    }
    const T = en(g, b, f, y, 15), _ = T.start, E = T.end, C = this.ths.length || 1, q = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (q > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = q + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = _; R < E; R++)
      if (this._cache.has(R)) {
        const O = this._buildRow(this._cache.get(R));
        O && I.appendChild(O);
      } else
        I.appendChild(this._buildPlaceholderRow());
    if (D > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = D + "px", R.appendChild(O), I.appendChild(R);
    }
    this.tbody.replaceChildren(I), this._vStart = _, this._vEnd = E, this._cache.ensure(_, E);
  }, A.prototype._showEmptyState = function() {
    const f = this.ths.length || 1;
    let y = null, d = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount === 0 && s > 0, T = b ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = Ct(this.dom, T, "ln-table"), !d) {
        const _ = this.dom.querySelector("template[data-ln-table-empty]");
        if (_) {
          const E = b ? "search" : "initial", C = _.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || _.content.firstElementChild;
          C && (d = document.importNode(C, !0));
        }
      }
      if (d)
        if (d.tagName === "TR")
          y = d;
        else {
          const _ = document.createElement("td");
          _.setAttribute("colspan", String(f)), _.appendChild(d);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(_), y = E;
        }
    } else {
      const s = this.dom.querySelector("template[" + i + "]"), g = document.createElement("td");
      g.setAttribute("colspan", String(f)), s && g.appendChild(document.importNode(s.content, !0));
      const b = document.createElement("tr");
      b.className = "ln-table__empty", b.appendChild(g), y = b;
    }
    y ? this.tbody.replaceChildren(y) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(f, y) {
    Vt(f, y);
    const d = f.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < d.length; s++) {
      const g = d[s], b = g.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < b.length; T++) {
        const _ = b[T].trim().split(":");
        if (_.length !== 2) continue;
        const E = _[0].trim(), C = _[1].trim();
        y[E] != null && g.setAttribute(C, y[E]);
      }
    }
  }, A.prototype._buildRow = function(f) {
    let y = Ct(this.dom, this.name + "-row", "ln-table");
    if (!y) {
      const s = this.dom.querySelector("template[data-ln-table-row]");
      s && (y = document.importNode(s.content, !0));
    }
    let d = y ? y.querySelector("[data-ln-table-row]") || y.firstElementChild : null;
    if (d)
      this._fillRow(d, f);
    else if (f && f.html) {
      const s = document.createElement("tbody");
      s.innerHTML = f.html, d = s.firstElementChild;
    } else {
      d = document.createElement("tr"), d.setAttribute("data-ln-table-row", "");
      const s = this.ths;
      for (let g = 0; g < s.length; g++) {
        const b = s[g].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (b) {
          const _ = document.createElement("input");
          _.type = "checkbox", _.setAttribute("data-ln-table-row-select", ""), _.setAttribute("aria-label", "Select row"), T.appendChild(_);
        } else {
          const _ = s[g].getAttribute("data-ln-table-col");
          _ && f[_] != null && (T.textContent = String(f[_]));
        }
        d.appendChild(T);
      }
    }
    if (d._lnRecord = f, f.id != null && d.setAttribute("data-ln-table-row-id", f.id), this._selectable && f.id != null && this.selectedIds.has(String(f.id))) {
      d.classList.add("ln-row-selected");
      const s = d.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return d;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    hn(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const f = this, y = this.dom, d = parseInt(y.getAttribute("data-ln-table-window"), 10), s = parseInt(y.getAttribute("data-ln-table-window-page"), 10), g = parseInt(y.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !f._windowed || !f._cache || (f.totalCount = f._cache.grandTotal, f.visibleCount = f._cache.logicalTotal, f._lastTotal = f._cache.grandTotal, f.isLoaded = !0, f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), L(y, "ln-table:rendered", {
        table: f.name,
        total: f.totalCount,
        visible: f.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Ln({
      windowSize: d > 0 ? d : 1e3,
      pageSize: s > 0 ? s : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(b, T, _) {
        L(y, "ln-table:request-data", {
          table: f.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
          offset: T,
          limit: _,
          queryGen: f._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let f = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(f) && this._totalSpan) {
        const d = this._totalSpan.textContent.replace(/[^\d]/g, "");
        d && (f = parseInt(d, 10));
      }
      const y = f > 0 ? f : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: y,
        filtered: y
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, A.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, A.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const f = this.tbody.querySelectorAll("[data-ln-table-row]"), y = [];
    for (let s = 0; s < f.length; s++) {
      const g = f[s].getAttribute("data-ln-table-row-id");
      g != null && y.push(g);
    }
    const d = Sr(y, this.selectedIds);
    this._selectAllCheckbox.checked = d.isAllSelected, this._selectAllCheckbox.indeterminate = d.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const f = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let y = 0; y < f.length; y++) {
      const d = f[y].getAttribute("data-ln-table-row-id"), s = d != null && this.selectedIds.has(d);
      f[y].classList.toggle("ln-row-selected", s);
      const g = f[y].querySelector("[data-ln-table-row-select]");
      g && (g.checked = s);
    }
    this._updateSelectAll();
  }, Object.defineProperty(A.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), A.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const f = this;
    if (this._onSelectionChange = function(y) {
      const d = y.target.closest("[data-ln-table-row-select]");
      if (!d) return;
      const s = d.closest("[data-ln-table-row]");
      if (!s) return;
      const g = s.getAttribute("data-ln-table-row-id");
      g != null && (f.selectedIds = nn(f.selectedIds, g, d.checked), s.classList.toggle("ln-row-selected", d.checked), f.selectedCount = f.selectedIds.size, f._updateSelectAll(), f._updateFooter(), L(f.dom, "ln-table:select", {
        table: f.name,
        selectedIds: f.selectedIds,
        count: f.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const y = document.createElement("input");
      y.type = "checkbox";
      const d = f.dom.querySelector('[data-ln-table-dict="select-all"]'), s = f.dom.getAttribute("data-ln-table-select-all-label") || (d ? d.textContent.trim() : null) || "Select all";
      y.setAttribute("aria-label", s), this._selectAllCheckbox.appendChild(y), this._selectAllCheckbox = y;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const y = f._selectAllCheckbox.checked, d = f.tbody ? f.tbody.querySelectorAll("[data-ln-table-row]") : [], s = [];
      for (let g = 0; g < d.length; g++) {
        const b = d[g].getAttribute("data-ln-table-row-id"), T = d[g].querySelector("[data-ln-table-row-select]");
        b != null && (s.push(b), d[g].classList.toggle("ln-row-selected", y), T && (T.checked = y));
      }
      f.selectedIds = rn(f.selectedIds, s, y), f.selectedCount = f.selectedIds.size, L(f.dom, "ln-table:select-all", {
        table: f.name,
        selected: y
      }), L(f.dom, "ln-table:select", {
        table: f.name,
        selectedIds: f.selectedIds,
        count: f.selectedCount
      }), f._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < y.length; d++) {
        const s = y[d].querySelector("[data-ln-table-row-select]"), g = y[d].getAttribute("data-ln-table-row-id");
        s && s.checked && g != null && (f.selectedIds = nn(f.selectedIds, g, !0), y[d].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const f = this.dom.querySelector("[data-ln-table-col-select]");
    if (f) {
      const y = f.querySelector('input[type="checkbox"]');
      y && y.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = rn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < y.length; d++) {
        y[d].classList.remove("ln-row-selected");
        const s = y[d].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let f = 0, y = 0;
    this.isDataDriven ? (f = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount) : (f = this._data.length, y = this._filteredData.length);
    const d = y < f;
    if (this._totalSpan && (this._totalSpan.textContent = v(f, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = d ? v(y, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !d), this._selectedSpan) {
      const s = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = s > 0 ? v(s, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, A, "ln-table", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(l) {
    if (l.key !== "/" || l.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const c = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!c) return;
    const n = c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector('input[type="search"], input[type="text"], input');
    n && (l.preventDefault(), n.focus());
  });
  function a(l) {
    return this.dom = l, r(this), this;
  }
  function m(l, c) {
    const n = c ? '[data-ln-search-for="' + c + '"]' : "[data-ln-search-for]", o = l.querySelector(n) || document.querySelector(n);
    return o ? o.tagName === "INPUT" || o.tagName === "TEXTAREA" ? o : o.querySelector("input, textarea") : null;
  }
  function h(l, c) {
    if (c) {
      const o = l.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (o.length > 0) return o;
      const u = document.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (u.length > 0) return u;
    }
    const n = l.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function r(l) {
    const c = l.dom;
    function n(o) {
      const u = o.target;
      if (u && u.hasAttribute && (u.hasAttribute("data-ln-table") || u.tagName === "TABLE")) return u;
      const p = o.detail && o.detail.targetId || u && u.id;
      return p ? c.querySelector('[data-ln-table-source="' + p + '"]') || c.querySelector('[data-ln-table="' + p + '"]') || c.querySelector("#" + p) || (c.id === p ? c : null) || document.getElementById(p) : null;
    }
    l._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const u = n(o);
        if (!u) return;
        const p = o.detail.key, w = o.detail.values || [], v = u.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === p) {
            const f = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            f && f.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const u = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!u) return;
        const p = u.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!p) return;
        const w = p.lnTable && p.lnTable.name || p.id, v = p.querySelectorAll("th");
        for (let y = 0; y < v.length; y++) {
          const d = v[y].querySelector("[data-ln-table-col-filter], .table-filter");
          d && d.classList.remove("ln-filter-active");
        }
        const S = p.getAttribute("data-ln-table-source") || p.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const y = m(c, S);
          y && y.value !== "" && (y.value = "", y.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const f = h(c, S);
        for (let y = 0; y < f.length; y++) {
          const d = f[y].querySelector("[data-ln-filter-reset]");
          if (!d) continue;
          const s = f[y].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!d.checked || s) && (d.checked = !0, d.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        p.lnTable && !p.hasAttribute("data-ln-table-source") && L(p, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", l._handlers.filter), c.addEventListener("click", l._handlers.clear);
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, a, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(s, g) {
    if (!s || !s.isDataDriven) return;
    const b = s.dom.hasAttribute("data-ln-list-window");
    if (b && !s._windowed)
      s._enterWindowedMode(), s._kickWindowInitial();
    else if (!b && s._windowed)
      s._exitWindowedMode();
    else if (b && s._windowed) {
      const T = parseInt(g, 10);
      T > 0 && s._cache.configure({ windowSize: T });
    }
  }
  function n(s, g) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const b = parseInt(g, 10);
    b > 0 && s._cache.configure({ pageSize: b });
  }
  function o(s, g) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const b = parseInt(g, 10);
    b >= 0 && s._cache.configure({ threshold: b });
  }
  function u(s, g) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const b = parseInt(g, 10);
    b >= 0 && s._cache.setGrandTotal(b);
  }
  const p = {
    "data-ln-list": { prop: "name", type: "string", read: $, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: c, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: u, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, w = et(p);
  function v(s, g) {
    if (s == null || isNaN(s)) return "";
    try {
      return new Intl.NumberFormat(it(g)).format(s);
    } catch {
      return String(s);
    }
  }
  function S(s) {
    let g = s;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const T = getComputedStyle(g).overflowY;
      if (T === "auto" || T === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function A(s) {
    const g = s._scrollContainer || S(s.dom);
    return {
      container: g,
      top: g ? g.scrollTop : window.scrollY
    };
  }
  function f(s) {
    s.container ? s.container.scrollTop = s.top : window.scrollTo(window.scrollX, s.top);
  }
  function y(s) {
    if (!s) return 0;
    const g = getComputedStyle(s), b = parseFloat(g.marginTop) || 0, T = parseFloat(g.marginBottom) || 0;
    return s.offsetHeight + b + T;
  }
  function d(s) {
    this.dom = s, tt(this, s, w), this.tbody = s.querySelector("[data-ln-list-body]") || s, this.isDataDriven = s.hasAttribute("data-ln-list-source"), this._totalSpan = s.querySelector("[data-ln-list-total]"), this._filteredSpan = s.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== s ? this._filteredSpan.parentElement : null), this._selectedSpan = s.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== s ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const g = this;
    return this._onSetSearch = function(b) {
      const T = (b.detail && b.detail.query != null ? b.detail.query : b.detail && b.detail.term != null ? b.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = T, L(s, "ln-list:search", {
        list: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = T.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(s, "ln-list:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, s.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(b) {
      b.preventDefault(), g._onSetSearch(b);
    }, s.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", L(s, "ln-list:clear-filters", { list: g.name }), g._requestData()) : (g._searchTerm = "", g._filters = {}, g._sortField = null, g._sortDir = null, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(s, "ln-list:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, s.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, s.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(b) {
      const T = b.detail || {}, _ = T.data || [], E = T.total != null ? T.total : _.length;
      if (!(g._hasInitialSeed && !g.isLoaded && _.length === 0 && E === 0)) {
        if (g._windowed) {
          g._cache.ingest(T) && !T.provisional && s.classList.remove("ln-list--loading");
          return;
        }
        g._data = _, g._lastTotal = E, g._lastFiltered = T.filtered != null ? T.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, s.classList.remove("ln-list--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), L(s, "ln-list:rendered", {
          list: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, s.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(b) {
      const T = b.detail && b.detail.loading;
      s.classList.toggle("ln-list--loading", !!T), T && (g.isLoaded = !1);
    }, s.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(b) {
      !g._windowed || !g._cache || g._cache.release(b.detail && b.detail.offset);
    }, s.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, s.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, s.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(b) {
      b.detail.field != null && (b.preventDefault(), g.currentSort = b.detail.direction === "none" ? null : { field: b.detail.field, direction: b.detail.direction }, g._requestData());
    }, s.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(b) {
      if (b.target.closest("[data-ln-item-select]") || b.target.closest("[data-ln-item-action]") || b.target.closest("a") || b.target.closest("button") || b.ctrlKey || b.metaKey || b.button === 1) return;
      const T = b.target.closest("[data-ln-item]");
      if (!T) return;
      const _ = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      L(s, "ln-list:item-click", {
        list: g.name,
        id: _,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(b) {
      const T = b.target.closest("[data-ln-item-action]");
      if (!T) return;
      const _ = T.closest("[data-ln-item]");
      if (!_) return;
      const E = T.getAttribute("data-ln-item-action"), C = _.getAttribute("data-ln-item-id"), q = _._lnRecord || {};
      L(s, "ln-list:item-action", {
        list: g.name,
        id: C,
        action: E,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(s, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      g.tbody.children.length > 0 && (g._emptyObserver.disconnect(), g._emptyObserver = null, g._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(b) {
      if (b.preventDefault(), !b.detail) return;
      const T = b.detail.key, _ = b.detail.values || [];
      if (T) {
        if (_.length === 0)
          delete g._filters[T];
        else {
          const E = [];
          for (let C = 0; C < _.length; C++)
            E.push(_[C].toLowerCase());
          g._filters[T] = E;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(s, "ln-list:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, s.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(b) {
      if (b.detail && b.detail.field == null) return;
      b.preventDefault();
      const T = b.detail && b.detail.direction === "none" ? null : b.detail && b.detail.direction;
      g._sortField = T === null ? null : b.detail && b.detail.field, g._sortDir = T, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(s, "ln-list:sorted", {
        field: g._sortField,
        direction: b.detail && b.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, s.addEventListener("ln-sort:change", this._onSort)), this;
  }
  d.prototype._parseChildren = function() {
    const s = Array.from(this.tbody.children).filter((g) => !g.classList.contains("ln-list__spacer"));
    this._data = [], s.length > 0 && (this._itemHeight = y(s[0]) || 50);
    for (let g = 0; g < s.length; g++) {
      const b = s[g], T = b.getAttribute("data-ln-item-id") || b.getAttribute("id"), _ = b.textContent.trim().toLowerCase();
      let E = null;
      if (this.isDataDriven) {
        E = {}, T != null && (E.id = T);
        const D = b.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (E[O] = vt(R));
        }
      }
      const C = {}, q = b.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < q.length; D++) {
        const I = q[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        R && (C[R] = vt(I));
      }
      for (let D = 0; D < b.attributes.length; D++) {
        const I = b.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const R = I.name.slice(5);
          R && (C[R] = I.value);
        }
      }
      this._data.push({
        html: b.outerHTML,
        id: T,
        searchText: _,
        fields: C,
        ...E || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, d.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const s = this._searchTerm, g = s ? s.split(/\s+/).filter(Boolean) : [], b = this._filters || {}, T = Object.keys(b).length > 0;
      if (g.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
        if (g.length > 0 && !g.every(function(C) {
          return _.searchText && _.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in b) {
            const C = b[E];
            if (C && C.length > 0) {
              const q = _.fields && _.fields[E] !== void 0 ? _.fields[E] : _[E] !== void 0 ? _[E] : null, D = q != null ? String(q).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const _ = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(I) {
          return I.fields && I.fields[_] !== void 0 ? I.fields[_] : I[_];
        }), D = ke(q);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[_] !== void 0 ? I.fields[_] : I[_], P = R.fields && R.fields[_] !== void 0 ? R.fields[_] : R[_];
          return Le(O, P, D, C) * E;
        });
      }
    }
  }, d.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const s = this._lastTotal, g = this.visibleCount;
        if (s === 0 || this._filteredData.length === 0 || g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const s = this._filteredData.length;
        s === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : s > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, d.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const s = this._filteredData, g = document.createDocumentFragment();
      for (let T = 0; T < s.length; T++) {
        const _ = this._buildItem(s[T]);
        _ && g.appendChild(_);
      }
      const b = A(this);
      this.tbody.replaceChildren(g), f(b), this._selectable && this._updateSelectAll();
    } else {
      const s = [], g = this._filteredData;
      for (let T = 0; T < g.length; T++) s.push(g[T].html);
      const b = A(this);
      this.tbody.innerHTML = s.join(""), f(b), this._selectable && this._restoreSelection();
    }
  }, d.prototype._readGridLayout = function() {
    const s = getComputedStyle(this.tbody), g = s.gridTemplateColumns;
    let b = 1;
    if (g && g !== "none") {
      const _ = g.trim().split(/\s+/).filter(Boolean);
      _.length > 0 && (b = _.length);
    }
    const T = parseFloat(s.rowGap);
    return { columns: b, rowGap: isNaN(T) ? 0 : T };
  }, d.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const s = this._cache.peek(), g = s ? this._buildItem(s) : this._buildPlaceholderItem();
      g && (this.tbody.textContent = "", this.tbody.appendChild(g), this._itemHeight = y(g) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const s = this._buildItem(this._data[0]);
        s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._itemHeight = y(s) || 50, this.tbody.textContent = "");
      }
    } else {
      const s = this.tbody.children;
      s.length > 0 && (this._itemHeight = y(s[0]) || 50);
    }
  }, d.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const s = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      s._rafId || (s._rafId = requestAnimationFrame(function() {
        s._rafId = null, s._windowed ? s._renderWindowed() : s._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      s._itemHeight = 0, s._measureItemHeight(), s._vStart = -1, s._vEnd = -1, s._windowed ? s._renderWindowed() : s._renderVirtual();
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, d.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, d.prototype._renderVirtual = function() {
    const s = this._filteredData, g = s.length, b = this._itemHeight;
    if (!b || !g) return;
    const T = this._scrollContainer;
    let _, E;
    if (T) {
      const X = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : X.top - V.top + T.scrollTop;
      _ = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      _ = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), q = C.columns, D = C.rowGap, I = b + D, R = Math.ceil(g / q);
    let O = Math.max(0, Math.floor(_ / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(E / I) + 30, B = Math.min(O + P, R), H = Math.min(O * q, g), z = Math.min(B * q, g);
    if (H === this._vStart && z === this._vEnd) return;
    this._vStart = H, this._vEnd = z;
    const Q = O * I, Y = (R - B) * I;
    if (this.isDataDriven) {
      const X = document.createDocumentFragment();
      if (Q > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Q + "px", X.appendChild(G);
      }
      for (let G = H; G < z; G++) {
        const ft = this._buildItem(s[G]);
        ft && X.appendChild(ft);
      }
      if (Y > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Y + "px", X.appendChild(G);
      }
      const V = A(this);
      this.tbody.replaceChildren(X), f(V), this._selectable && this._updateSelectAll();
    } else {
      let X = "";
      Q > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Q}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = H; G < z; G++)
        X += s[G].html;
      Y > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Y}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = X, f(V), this._selectable && this._restoreSelection();
    }
  }, d.prototype._buildPlaceholderItem = function() {
    const s = document.createElement(this.isUl ? "li" : "div");
    return s.className = "ln-list__placeholder", s.setAttribute("aria-hidden", "true"), s.style.height = this._itemHeight + "px", s;
  }, d.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const s = this._itemHeight;
    if (!s) return;
    const g = this._scrollContainer;
    let b, T;
    if (g) {
      const V = this.tbody.getBoundingClientRect(), G = g.getBoundingClientRect(), ft = g === this.tbody ? 0 : V.top - G.top + g.scrollTop;
      b = g.scrollTop - ft, T = g.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - G, T = window.innerHeight;
    }
    const _ = this._readGridLayout(), E = _.columns, C = _.rowGap, q = s + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
    let R = Math.max(0, Math.floor(b / q) - 15);
    R = Math.min(R, I);
    const O = Math.ceil(T / q) + 30, P = Math.min(R + O, I), B = Math.min(R * E, D), H = Math.min(P * E, D), z = R * q, Q = (I - P) * q, Y = document.createDocumentFragment();
    if (z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = z + "px", Y.appendChild(V);
    }
    for (let V = B; V < H; V++)
      if (this._cache.has(V)) {
        const G = this._buildItem(this._cache.get(V));
        G && Y.appendChild(G);
      } else
        Y.appendChild(this._buildPlaceholderItem());
    if (Q > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = Q + "px", Y.appendChild(V);
    }
    const X = A(this);
    this.tbody.replaceChildren(Y), f(X), this._vStart = B, this._vEnd = H, this._cache.ensure(B, H);
  }, d.prototype._showEmptyState = function() {
    let s = null;
    if (this.isDataDriven) {
      const g = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && g > 0, _ = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (s = Ct(this.dom, _, "ln-list"), !s) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", q = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          q && (s = document.importNode(q, !0));
        }
      }
    } else {
      const g = this.dom.querySelector(`template[${i}]`);
      if (g) {
        const b = g.content.firstElementChild;
        b && (s = document.importNode(b, !0));
      }
    }
    if (s)
      if (s.tagName === "LI" || s.tagName === "TR")
        this.tbody.replaceChildren(s);
      else {
        const g = document.createElement(this.isUl ? "li" : "div");
        g.appendChild(s), this.tbody.replaceChildren(g);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, d.prototype._buildItem = function(s) {
    let g = Ct(this.dom, this.name + "-row", "ln-list");
    if (!g) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (g = document.importNode(T.content, !0));
    }
    let b = g ? g.querySelector("[data-ln-item]") || g.firstElementChild : null;
    if (b)
      Vt(b, s), pt(b, s);
    else if (s && s.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = s.html, b = T.firstElementChild;
    } else if (b = document.createElement(this.isUl ? "li" : "div"), b.setAttribute("data-ln-item", ""), s && typeof s == "object") {
      for (const T in s)
        if (T !== "html" && s[T] != null) {
          const _ = document.createElement("span");
          _.setAttribute("data-ln-field", T), _.textContent = String(s[T]), b.appendChild(_);
        }
    }
    if (b._lnRecord = s, s && s.id != null && (b.setAttribute("data-ln-item-id", s.id), this._selectable && this.selectedIds.has(String(s.id)))) {
      b.classList.add("ln-item-selected");
      const T = b.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return b;
  }, d.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const s = this.tbody.querySelectorAll("[data-ln-item]");
    for (let g = 0; g < s.length; g++) {
      const b = s[g].getAttribute("data-ln-item-id"), T = b != null && this.selectedIds.has(String(b));
      s[g].classList.toggle("ln-item-selected", T);
      const _ = s[g].querySelector("[data-ln-item-select]");
      _ && (_.checked = T);
    }
    this._updateSelectAll();
  }, d.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const s = this;
    this._onSelectionChange = function(g) {
      const b = g.target.closest("[data-ln-item-select]");
      if (!b) return;
      const T = b.closest("[data-ln-item]");
      if (!T) return;
      const _ = T.getAttribute("data-ln-item-id");
      _ != null && (b.checked ? (s.selectedIds.add(String(_)), T.classList.add("ln-item-selected")) : (s.selectedIds.delete(String(_)), T.classList.remove("ln-item-selected")), s._updateSelectAll(), s._updateFooter(), L(s.dom, "ln-list:select", {
        list: s.name,
        selectedIds: s.selectedIds,
        count: s.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = s._selectAllCheckbox.checked, b = s.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < b.length; T++) {
        const _ = b[T], E = _.getAttribute("data-ln-item-id"), C = _.querySelector("[data-ln-item-select]");
        E != null && (g ? (s.selectedIds.add(String(E)), _.classList.add("ln-item-selected")) : (s.selectedIds.delete(String(E)), _.classList.remove("ln-item-selected")), C && (C.checked = g));
      }
      L(s.dom, "ln-list:select-all", { list: s.name, selected: g }), L(s.dom, "ln-list:select", {
        list: s.name,
        selectedIds: s.selectedIds,
        count: s.selectedIds.size
      }), s._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, d.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const s = this.tbody.querySelectorAll("[data-ln-item]");
    let g = s.length > 0;
    for (let b = 0; b < s.length; b++) {
      const T = s[b].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        g = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = g;
  }, d.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    hn(this, "ln-list:request-data", "list");
  }, d.prototype._enterWindowedMode = function() {
    const s = this, g = this.dom, b = parseInt(g.getAttribute("data-ln-list-window"), 10), T = parseInt(g.getAttribute("data-ln-list-window-page"), 10), _ = parseInt(g.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !s._windowed || !s._cache || (s.totalCount = s._cache.grandTotal, s.visibleCount = s._cache.logicalTotal, s._lastTotal = s._cache.grandTotal, s.isLoaded = !0, s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), L(g, "ln-list:rendered", {
        list: s.name,
        total: s.totalCount,
        visible: s.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Ln({
      windowSize: b > 0 ? b : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: _ >= 0 ? _ : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, q) {
        L(g, "ln-list:request-data", {
          list: s.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: C,
          limit: q,
          queryGen: s._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, d.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const s = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), g = s > 0 ? s : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: g,
        filtered: g
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, d.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, d.prototype._updateFooter = function() {
    let s = 0, g = 0;
    this.isDataDriven ? (s = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (s = this._data.length, g = this._filteredData.length);
    const b = g < s;
    if (this._totalSpan && (this._totalSpan.textContent = v(s, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? v(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, d.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, d, "ln-list", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(p) {
    const w = p[e];
    w && u.call(w);
  }
  const a = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, m = "http://www.w3.org/2000/svg", h = 36, r = 16, l = 2 * Math.PI * r;
  function c(p) {
    return this.dom = p, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, o.call(this), u.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(p, w) {
    const v = document.createElementNS(m, p);
    for (const [S, A] of Object.entries(w))
      v.setAttribute(S, A);
    return v;
  }
  function o() {
    this.svg = n("svg", {
      viewBox: "0 0 " + h + " " + h,
      width: h,
      height: h
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: h / 2,
      cy: h / 2,
      r,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: h / 2,
      cy: h / 2,
      r,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": l,
      "stroke-dashoffset": l,
      transform: "rotate(-90 " + h / 2 + " " + h / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function u() {
    const p = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = Rn(p, w || 100), S = l - v.percentage / 100 * l;
    this.progressCircle.setAttribute("stroke-dashoffset", S);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), f = A !== null ? A : Math.round(v.percentage) + "%";
    this.labelEl.textContent = f, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", f), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  j(t, e, c, "ln-circular-progress", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-sortable": { effect: h, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function m(r) {
    this.dom = r, this.isEnabled = r.getAttribute(t) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(c) {
      l.isEnabled && l._handlePointerDown(c);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, m.prototype._handlePointerDown = function(r) {
    let l = r.target.closest("[" + i + "]"), c;
    if (l) {
      for (c = l; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (c = r.target; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
      l = c;
    }
    const o = Array.from(this.dom.children).indexOf(c);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: c,
      index: o
    }).defaultPrevented) return;
    r.preventDefault(), l.setPointerCapture(r.pointerId), this._dragging = c, c.classList.add("ln-sortable--dragging"), c.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: c,
      index: o
    });
    const p = this, w = function(S) {
      p._handlePointerMove(S);
    }, v = function(S) {
      p._handlePointerEnd(S), l.removeEventListener("pointermove", w), l.removeEventListener("pointerup", v), l.removeEventListener("pointercancel", v);
    };
    l.addEventListener("pointermove", w), l.addEventListener("pointerup", v), l.addEventListener("pointercancel", v);
  }, m.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const l = Array.from(this.dom.children), c = this._dragging;
    for (const n of l)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of l) {
      if (n === c) continue;
      const o = n.getBoundingClientRect(), u = o.top + o.height / 2;
      if (r.clientY >= o.top && r.clientY < u) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= u && r.clientY <= o.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const l = this._dragging, c = Array.from(this.dom.children), n = c.indexOf(l);
    let o = null, u = null;
    for (const p of c) {
      if (p.classList.contains("ln-sortable--drop-before")) {
        o = p, u = "before";
        break;
      }
      if (p.classList.contains("ln-sortable--drop-after")) {
        o = p, u = "after";
        break;
      }
    }
    for (const p of c)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (l.classList.remove("ln-sortable--dragging"), l.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== l) {
      u === "before" ? this.dom.insertBefore(l, o) : this.dom.insertBefore(l, o.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(l);
      L(this.dom, "ln-sortable:reordered", {
        item: l,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function h(r) {
    const l = r[e];
    if (!l) return;
    const c = r.getAttribute(t) !== "disabled";
    c !== l.isEnabled && (l.isEnabled = c, L(r, c ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: r }));
  }
  j(t, e, m, "ln-sortable", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", a = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: l, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: c, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function h(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = r(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const o of [this.available, this.selected])
      for (const u of o.children)
        this._initial.push(u);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), L(this.dom, "ln-picklist:destroyed", { target: this.dom }), delete this.dom[e]);
  }, h.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, h.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, h.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let u = 0; u < n.length; u++)
      this._initial.includes(n[u]) || this._initial.push(n[u]);
    let o = 0;
    for (let u = 0; u < this._initial.length; u++) {
      const p = this._initial[u];
      if (!p.isConnected) continue;
      const w = p.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || o < this.max ? (v = this.selected, o++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(p);
    }
  }, h.prototype._onFormReset = function(n) {
    const o = this;
    setTimeout(function() {
      o._destroyed || n.defaultPrevented || o.sync();
    }, 0);
  }, h.prototype._onChange = function(n) {
    const o = n.target.closest('input[type="checkbox"]');
    if (!o) return;
    const u = o.closest("li");
    if (!u) return;
    const p = u.parentElement;
    if (p !== this.available && p !== this.selected) return;
    if (!this.isEnabled) {
      o.checked = !o.checked;
      return;
    }
    const w = o.checked ? this.selected : this.available;
    if (p === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      o.checked = !o.checked, L(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: u,
        checkbox: o,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: u, from: p, to: w, checkbox: o };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      o.checked = !o.checked;
      return;
    }
    const S = document.activeElement === o;
    w.appendChild(u), S && o.focus(), L(this.dom, "ln-picklist:move", v);
  };
  function r(n) {
    const o = n.getAttribute(a);
    if (o === null || o === "") return null;
    const u = parseInt(o, 10);
    return isNaN(u) || u < 0 ? null : u;
  }
  function l(n) {
    const o = n[e];
    if (!o) return;
    const u = n.getAttribute(t) !== "disabled";
    u !== o.isEnabled && (o.isEnabled = u, L(n, u ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function c(n) {
    const o = n[e];
    o && (o.max = r(n));
  }
  j(t, e, h, "ln-picklist", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", a = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function h(u, p, w) {
    return u.getAttribute(p) || w;
  }
  function r(u, p, w) {
    const v = parseFloat(u.getAttribute(p));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function l(u) {
    const p = document.createElement("span");
    return p.setAttribute(a, ""), p.setAttribute("role", "alert"), p.textContent = u, p;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: h, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: r, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (u, p) => u.getAttribute(p) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = et(c);
  function o(u) {
    this.dom = u, tt(this, u, n), this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : u.textContent.trim();
    const p = this;
    return this._onClick = function(w) {
      if (!pn(w))
        if (!p.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), p._enterConfirm();
        else {
          if (p._submitted) return;
          p._submitted = !0, w.stopPropagation(), p._reset();
        }
    }, u.addEventListener("click", this._onClick), this;
  }
  o.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const u = this.activeEl ? this.activeEl.textContent.trim() : "";
      u && (this.dom.setAttribute("aria-label", u), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = u.getAttribute("href"), u.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(l(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, o.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const u = this, p = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, p);
  }, o.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalIconHref && u.setAttribute("href", this.originalIconHref);
      const p = this.dom.querySelector("[" + a + "]");
      p && p.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], L(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, j(t, e, o, "ln-confirm", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-translations": { type: "marker", description: "Mounts multi-language translation manager on form container" },
    "data-ln-translations-default": { prop: "defaultLang", read: $, type: "string", fallback: "", description: "Default primary language code (e.g. en)" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: $, type: "string", fallback: "{lang} translation", description: "Placeholder label pattern for cloned translation inputs" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: $, type: "string", fallback: "Remove {lang}", description: "Accessible label template for translation removal buttons" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: $, type: "json", fallback: "", description: "JSON dictionary of supported locale codes and display labels" },
    "data-ln-translations-active": { type: "marker", description: "Container holding active language badge tags" },
    "data-ln-translations-add": { type: "string", description: "Trigger button action to add specified language translation fields" },
    "data-ln-translations-lang": { type: "string", description: "Language code associated with active language badge" },
    "data-ln-translations-prefix": { type: "string", description: "Prefix format pattern for cloned translated field names" },
    "data-ln-translatable": { type: "marker", description: "Marks form control as translatable into multiple languages" },
    "data-ln-translatable-lang": { type: "string", description: "Language code assigned to specific translatable input instance" }
  }, a = et(i), m = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function h(r) {
    if (this.dom = r, tt(this, r, a), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = r.querySelector("[data-ln-translations-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = m, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const l = this;
    return this._onRequestAdd = function(c) {
      c.detail && c.detail.lang && l.addLanguage(c.detail.lang);
    }, this._onRequestRemove = function(c) {
      c.detail && c.detail.lang && l.removeLanguage(c.detail.lang);
    }, r.addEventListener("ln-translations:request-add", this._onRequestAdd), r.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  h.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const l of r) {
      const c = l.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of c)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, h.prototype._detectExisting = function() {
    const r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const l of r) {
      const c = l.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, h.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const r = this;
    let l = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      l++;
      const o = Jt("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const u = o.querySelector("[data-ln-translations-lang]");
      u.setAttribute("data-ln-translations-lang", n), u.textContent = this.locales[n], u.addEventListener("click", function(p) {
        p.ctrlKey || p.metaKey || p.button === 1 || (p.preventDefault(), p.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(n));
      }), this.menuEl.appendChild(o);
    }
    const c = this.dom.querySelector("[data-ln-translations-add]");
    c && (c.hidden = l === 0);
  }, h.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const r = this;
    this.activeLanguages.forEach(function(l) {
      const c = Jt("ln-translations-badge", "ln-translations");
      if (!c) return;
      const n = c.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", l);
      const o = n.querySelector("span");
      o.textContent = r.locales[l] || l.toUpperCase();
      const u = n.querySelector("button"), p = r.locales[l] || l.toUpperCase();
      u.setAttribute("aria-label", r.removeLabel.replace("{lang}", p)), u.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), r.removeLanguage(l));
      }), r.badgesEl.appendChild(c);
    });
  }, h.prototype.addLanguage = function(r, l) {
    if (this.activeLanguages.has(r)) return;
    const c = this.locales[r] || r;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: r,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(r), l = l || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of o) {
      const p = u.getAttribute("data-ln-translatable"), w = u.getAttribute("data-ln-translations-prefix") || "", v = u.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + r + "][" + p + "]" : S.name = "trans[" + r + "][" + p + "]", S.value = l[p] !== void 0 ? l[p] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", c)), S.setAttribute("data-ln-translatable-lang", r);
      const A = u.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), f = A.length > 0 ? A[A.length - 1] : v;
      f.parentNode.insertBefore(S, f.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: r,
      langName: c
    });
  }, h.prototype.removeLanguage = function(r) {
    if (!this.activeLanguages.has(r) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: r
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + r + '"]');
    for (const n of c)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(r), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: r
    });
  }, h.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, h.prototype.hasLanguage = function(r) {
    return this.activeLanguages.has(r);
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const r = this.defaultLang, l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of l)
      c.getAttribute("data-ln-translatable-lang") !== r && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, h, "ln-translations", {
    attributes: i
  });
})();
const Cr = "ln-autosave:", Tr = 1e3;
function kr(t, e) {
  return e ? Cr + (t || "") + ":" + e : null;
}
function Lr(t, e = Tr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", a = "data-ln-autosave-debounce-input", m = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function r(c) {
    const n = c.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function l(c) {
    const o = c.getAttribute(t) || c.id, u = kr(window.location.pathname, o);
    if (!u) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = u;
    let p = null;
    function w() {
      const f = gn(c, { exclude: m });
      try {
        localStorage.setItem(u, JSON.stringify(f));
      } catch {
        return;
      }
      L(c, "ln-autosave:saved", { target: c, data: f });
    }
    function v() {
      let f;
      try {
        f = localStorage.getItem(u);
      } catch {
        return;
      }
      if (!f) return;
      let y;
      try {
        y = JSON.parse(f);
      } catch {
        return;
      }
      if (Z(c, "ln-autosave:before-restore", { target: c, data: y }).defaultPrevented) return;
      const s = _n(c, y);
      for (let g = 0; g < s.length; g++)
        s[g].dispatchEvent(new Event("input", { bubbles: !0 })), s[g].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(c, "ln-autosave:restored", { target: c, data: y });
    }
    function S() {
      try {
        localStorage.removeItem(u);
      } catch {
        return;
      }
      L(c, "ln-autosave:cleared", { target: c });
    }
    this._onFocusout = function(f) {
      const y = f.target;
      r(y) && y.name && !y.matches(m) && w();
    }, this._onChange = function(f) {
      const y = f.target;
      r(y) && y.name && !y.matches(m) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(f) {
      f.target.closest("[" + i + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = Lr(c.getAttribute(a));
    return A > 0 && (this._onInput = function(f) {
      const y = f.target;
      !r(y) || !y.name || y.matches(m) || (p !== null && clearTimeout(p), p = setTimeout(w, A));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return p;
    }, v(), this;
  }
  l.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const c = this._getInputTimer();
        c !== null && clearTimeout(c);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, l, "ln-autosave", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-autoresize": { type: "marker", description: "Automatically adjusts textarea height to match its scrollable content" }
  };
  function a(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const h = this;
    return this._onInput = function() {
      h._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  a.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, a, "ln-autoresize", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-editor": { type: "marker", description: "Mounts rich text editor instance on container" },
    "data-ln-editor-action": { type: "enum", values: ["bold", "italic", "underline", "strikethrough", "heading-2", "heading-3", "heading-4", "blockquote", "code", "paragraph", "ordered-list", "unordered-list", "link", "unlink", "clear", "confirm-link", "cancel-link"], description: "Rich text toolbar formatting action" },
    "data-ln-editor-source": { type: "string", description: "Selector or ID of backing textarea synchronized with editor content" }
  }, a = {
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
  }, m = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, h = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, r = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let l = 0;
  function c(f) {
    return !!(m[f] || h[f] || r[f] || f === "link");
  }
  function n(f) {
    this.dom = f;
    const y = this;
    if (this._textarea = f.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", f), this;
    const d = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), d && this._surface.setAttribute("data-placeholder", d);
    const s = this._textarea.id;
    if (s) {
      const _ = f.querySelector('label[for="' + s + '"]');
      _ && (_.id || (_.id = s + "-label"), this._surface.setAttribute("aria-labelledby", _.id));
    }
    this._surface.id = s ? s + "-surface" : "ln-editor-surface-" + ++l;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const b = f.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? f.insertBefore(this._surface, b.nextSibling) : f.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const _ = b.querySelectorAll("[data-ln-editor-action]");
      for (let E = 0; E < _.length; E++) {
        const C = _[E].getAttribute("data-ln-editor-action");
        c(C) && _[E].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      y._syncToTextarea(), L(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      });
    }, this._onMousedownToolbar = function(_) {
      _.target.closest("[data-ln-editor-action]") && _.preventDefault();
    }, this._onClickToolbar = function(_) {
      const E = _.target.closest("[data-ln-editor-action]");
      if (!E) return;
      const C = E.getAttribute("data-ln-editor-action");
      y._execAction(C);
    }, this._onPaste = function(_) {
      p(y, _);
    }, this._onKeydown = function(_) {
      S(y, _);
    }, this._onSelectionChange = function() {
      document.contains(y._surface) && y._updateActiveStates();
    }, this._onFocus = function() {
      L(y.dom, "ln-editor:focus", { target: y.dom });
    }, this._onBlur = function() {
      y._syncToTextarea(), L(y.dom, "ln-editor:blur", { target: y.dom });
    }, this._onTextareaInput = function() {
      y._surface.innerHTML !== y._textarea.value && (y._surface.innerHTML = y._textarea.value, L(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(_) {
      const E = _.detail && _.detail.html;
      E !== void 0 && (y._surface.innerHTML = E, y._syncToTextarea(), L(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      }));
    }, f.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        y._surface.innerHTML = y._textarea.value, L(f, "ln-editor:changed", {
          html: y._textarea.value,
          target: f
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(f) {
    if (!(!f || Z(this.dom, "ln-editor:before-change", {
      action: f,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), m[f])
        document.execCommand(m[f], !1, null);
      else if (h[f]) {
        const d = h[f], s = o(this._surface);
        s && s.toLowerCase() === d ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + d + ">");
      } else r[f] ? document.execCommand(r[f], !1, null) : f === "link" ? A(this) : f === "unlink" ? document.execCommand("unlink", !1, null) : f === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const f = this.dom.querySelector('[role="toolbar"]');
    if (!f) return;
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const d = y.anchorNode;
    if (!d || !this._surface.contains(d)) return;
    const s = f.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < s.length; g++) {
      const b = s[g], T = b.getAttribute("data-ln-editor-action");
      let _ = !1;
      if (m[T])
        try {
          _ = document.queryCommandState(m[T]);
        } catch {
        }
      else if (h[T]) {
        const E = o(this._surface);
        _ = E && E.toLowerCase() === h[T];
      } else if (r[T])
        try {
          _ = document.queryCommandState(r[T]);
        } catch {
        }
      else T === "link" && (_ = !!u(y.anchorNode, "A", this._surface));
      c(T) && b.setAttribute("aria-pressed", String(_)), _ ? b.classList.add("ln-editor-active") : b.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(f) {
    this._surface && (this._surface.innerHTML = f, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const f = this.dom.querySelector('[role="toolbar"]');
    f && (f.removeEventListener("mousedown", this._onMousedownToolbar), f.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const y = this._textarea ? this._textarea.form : null;
    if (y && this._onFormReset && y.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const d = this.dom.querySelector(".ln-editor__link-popover");
      d && d.remove();
    }
    L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function o(f) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return null;
    let d = y.anchorNode;
    if (!d) return null;
    for (; d && d !== f; ) {
      if (d.nodeType === 1) {
        const s = d.tagName;
        if (s === "H2" || s === "H3" || s === "H4" || s === "BLOCKQUOTE" || s === "PRE" || s === "P")
          return s;
      }
      d = d.parentNode;
    }
    return null;
  }
  function u(f, y, d) {
    for (; f && f !== d; ) {
      if (f.nodeType === 1 && f.tagName === y)
        return f;
      f = f.parentNode;
    }
    return null;
  }
  function p(f, y) {
    y.preventDefault();
    let d = "";
    if (y.clipboardData && (d = y.clipboardData.getData("text/html"), !d)) {
      const g = y.clipboardData.getData("text/plain");
      g && (d = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), d = "<p>" + d + "</p>");
    }
    if (!d) return;
    const s = w(d);
    s && document.execCommand("insertHTML", !1, s);
  }
  function w(f) {
    const y = document.createElement("div");
    return y.innerHTML = f, v(y), y.innerHTML;
  }
  function v(f) {
    const y = Array.from(f.childNodes);
    for (let d = 0; d < y.length; d++) {
      const s = y[d];
      if (s.nodeType !== 3) {
        if (s.nodeType !== 1) {
          f.removeChild(s);
          continue;
        }
        if (a[s.tagName]) {
          const g = Array.from(s.attributes);
          for (let b = 0; b < g.length; b++) {
            const T = g[b].name;
            if (s.tagName === "A" && T === "href") {
              const _ = s.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(_) || s.removeAttribute("href");
            } else
              s.removeAttribute(T);
          }
          s.tagName === "A" && s.setAttribute("rel", "noopener noreferrer"), v(s);
        } else {
          for (; s.firstChild; )
            f.insertBefore(s.firstChild, s);
          f.removeChild(s);
        }
      }
    }
  }
  function S(f, y) {
    if (!(y.ctrlKey || y.metaKey)) return;
    let d = null;
    switch (y.key.toLowerCase()) {
      case "b":
        d = "bold";
        break;
      case "i":
        d = "italic";
        break;
      case "u":
        d = "underline";
        break;
      case "k":
        d = "link";
        break;
    }
    d && (y.preventDefault(), f._execAction(d));
  }
  function A(f) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const d = u(y.anchorNode, "A", f._surface), s = y.getRangeAt(0).cloneRange();
    f._closeLinkPopover && f._closeLinkPopover();
    const g = Ct(f.dom, "ln-editor-link-popover", "ln-editor");
    if (!g) return;
    const b = g.firstElementChild;
    if (!b) return;
    const T = b.querySelector('input[type="url"]'), _ = b.querySelector('[data-ln-editor-action="confirm-link"]'), E = b.querySelector('[data-ln-editor-action="cancel-link"]');
    d && (T.value = d.getAttribute("href") || "");
    const C = f.dom.querySelector('[role="toolbar"]');
    C ? C.after(b) : f.dom.insertBefore(b, f._surface), T.focus();
    function q() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(s);
    }
    function D() {
      document.removeEventListener("mousedown", P), f._closeLinkPopover = null, b.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), q(), f._surface.focus(), B)
        if (d)
          d.setAttribute("href", B), d.setAttribute("rel", "noopener noreferrer"), f._syncToTextarea(), L(f.dom, "ln-editor:changed", {
            html: f._textarea.value,
            target: f.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = u(H.anchorNode, "A", f._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), f._syncToTextarea());
          }
        }
      else d && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), q(), f._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const H = f.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !b.contains(B.target) && !H && O();
    }
    f._closeLinkPopover = D, _.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), I()) : B.key === "Escape" && (B.preventDefault(), R());
    }), document.addEventListener("mousedown", P);
  }
  j(t, e, n, "ln-editor", {
    attributes: i
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function i(m) {
    const h = {}, r = m.dataset;
    for (const l in r) {
      if (!l.startsWith("lnFill") || e[l]) continue;
      const c = l.slice(6);
      c && (h[c.charAt(0).toLowerCase() + c.slice(1)] = r[l]);
    }
    return h;
  }
  function a(m, h) {
    const r = window.CSS && CSS.escape ? CSS.escape(h) : h, l = document.querySelectorAll('[data-ln-fill-id="' + r + '"]');
    if (l.length === 0) return null;
    for (let c = 0; c < l.length; c++) {
      const n = l[c].getAttribute("data-ln-fill-form");
      if (n) {
        const o = document.getElementById(n);
        if (o && m.contains(o)) return l[c];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const h = m.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const r = h.getAttribute("href");
    if (r && r.indexOf("#") !== -1) return;
    const l = h.getAttribute("data-ln-fill-form"), c = document.getElementById(l);
    if (!c) return;
    const n = i(h), o = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, o ? n : null);
  }), document.addEventListener("ln-fill:request", function(m) {
    const h = m.detail;
    if (!h) return;
    const r = m.target, l = h.id;
    if (l == null) {
      window.lnCore.lnFill(r, null);
      return;
    }
    const c = a(r, l);
    if (!c) return;
    const n = i(c);
    window.lnCore.lnFill(r, n);
  }), window[t] = !0;
})();
function qr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", a = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${a}+`, "g"), i).replace(new RegExp(`^${a}+|${a}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: $, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, a = et(i);
  function m(h) {
    if (h.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", h.tagName), this;
    const r = h.form;
    if (!r)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", h), this;
    tt(this, h, a);
    const l = r.elements[this.sourceName];
    if (!l)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', h), this;
    if (typeof l.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', h), this;
    this.dom = h, this.source = l, this._pristine = h.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, l.addEventListener("input", this._onSource), h.addEventListener("input", this._onSlug), this._pristine && l.value && l.value.trim() !== "" && this._mirror(), this;
  }
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = qr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, m, "ln-slug", {
    attributes: i
  });
})();
function xr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), a = t.getTime(), m = Math.floor((a - i) / 1e3), h = Math.abs(m);
  return h < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : h < 60 ? { value: m, unit: "second", isOlderThanMonth: !1 } : h < 3600 ? { value: Math.round(m / 60), unit: "minute", isOlderThanMonth: !1 } : h < 86400 ? { value: Math.round(m / 3600), unit: "hour", isOlderThanMonth: !1 } : h < 604800 ? { value: Math.round(m / 86400), unit: "day", isOlderThanMonth: !1 } : h < 2592e3 ? { value: Math.round(m / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(m / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function $t(t, e, i = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const a = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (a.year = "numeric"), a;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: s, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: s, description: "BCP 47 language tag override for time formatting" }
  }, a = {}, m = {};
  function h(b) {
    return b.getAttribute("data-ln-time-locale") || it(b);
  }
  function r(b, T) {
    const _ = (b || "") + "|" + JSON.stringify(T);
    return a[_] || (a[_] = new Intl.DateTimeFormat(b, T)), a[_];
  }
  function l(b) {
    const T = b || "";
    return m[T] || (m[T] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), m[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function o() {
    n || (n = setInterval(p, 6e4));
  }
  function u() {
    n && (clearInterval(n), n = null);
  }
  function p() {
    for (const b of c) {
      if (!document.body.contains(b.dom)) {
        c.delete(b);
        continue;
      }
      y(b);
    }
    c.size === 0 && u();
  }
  function w(b, T) {
    const _ = Lt(T), E = (T || "").toLowerCase().split("-")[0], C = r(T, $t("full", b)), q = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (_ && q !== E && _.monthsLong) {
      const D = _.monthsLong[b.getMonth()], I = b.getDate(), R = b.getFullYear(), O = String(b.getHours()).padStart(2, "0"), P = String(b.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(b);
  }
  function v(b, T) {
    const _ = $t("short", b), E = Lt(T), C = (T || "").toLowerCase().split("-")[0], q = r(T, _), D = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[b.getMonth()], R = b.getDate(), O = _.year ? " " + b.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return q.format(b);
  }
  function S(b, T) {
    return r(T, $t("date", b)).format(b);
  }
  function A(b, T) {
    return r(T, $t("time", b)).format(b);
  }
  function f(b, T) {
    const _ = xr(b);
    return _.isOlderThanMonth ? v(b, T) : l(T).format(_.value, _.unit);
  }
  function y(b) {
    const T = b.dom.getAttribute("datetime");
    if (!T) return;
    const _ = ot(T);
    if (!_) return;
    const E = b.dom.getAttribute(t) || "short", C = h(b.dom);
    let q;
    switch (E) {
      case "relative":
        q = f(_, C);
        break;
      case "full":
        q = w(_, C);
        break;
      case "date":
        q = S(_, C);
        break;
      case "time":
        q = A(_, C);
        break;
      default:
        q = v(_, C);
        break;
    }
    b.dom.textContent = q, E !== "full" && (b.dom.title = w(_, C));
  }
  function d(b) {
    this.dom = b;
    const T = this;
    return this._onLocaleChange = function() {
      y(T);
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), y(this), b.getAttribute(t) === "relative" && (c.add(this), o()), this;
  }
  d.prototype.render = function() {
    y(this);
  }, d.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), c.delete(this), c.size === 0 && u(), delete this.dom[e];
  };
  function s(b) {
    const T = b[e];
    if (!T) return;
    b.getAttribute(t) === "relative" ? (c.add(T), o()) : (c.delete(T), c.size === 0 && u()), y(T);
  }
  function g(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(t) && b[e] && y(b[e]);
  }
  j(t, e, d, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: s,
    onInit: g
  });
})();
function Ir(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, h = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let l = 0, c = 0, n = 0, o = !1, u = null;
  function p(S, A) {
    h.delete(S), h.set(S, A);
  }
  function w() {
    if (h.size <= e) return [];
    const S = [];
    for (; h.size > e; ) {
      const f = h.keys().next().value;
      S.push(h.get(f)), h.delete(f);
    }
    const A = new Set(h.values());
    return S.filter((f) => !A.has(f));
  }
  function v(S, A) {
    r.add(S), clearTimeout(u), u = setTimeout(() => m(S, i, A), a);
  }
  return {
    get logicalTotal() {
      return l;
    },
    set logicalTotal(S) {
      l = S;
    },
    get grandTotal() {
      return c;
    },
    set grandTotal(S) {
      c = S;
    },
    get queryGen() {
      return n;
    },
    set queryGen(S) {
      n = S;
    },
    get size() {
      return h.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return o;
    },
    getId: (S) => {
      if (!h.has(S)) return;
      const A = h.get(S);
      return p(S, A), A;
    },
    ensure: (S, A, f) => {
      if (!o && !r.has(0)) return v(0, f);
      if (l <= 0) return;
      const y = Math.max(0, S), d = Math.min(l, A);
      for (let s = y; s < d; s++)
        if (!h.has(s)) {
          const g = Math.floor(s / i) * i;
          if (!r.has(g)) return v(g, f);
        }
    },
    ingest: (S, A, f, y, d) => {
      if (d != null && d !== n) return [];
      o = !0, f != null && (c = f), y != null && (l = y);
      for (let s = 0; s < A.length; s++)
        p(S + s, A[s]);
      return r.delete(S), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      o = !1, h.clear(), r.clear(), clearTimeout(u);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (S = {}) => {
      let A = [];
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (i = S.pageSize), S.fetchDebounce >= 0 && (a = S.fetchDebounce), A;
    }
  };
}
function Dr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: a, direction: m } = e, h = m === "desc", r = t.map((c) => c ? c[a] : void 0), l = ke(r);
  return [...t].sort((c, n) => {
    const o = c ? c[a] : void 0, u = n ? n[a] : void 0, p = Le(o, u, l, i);
    return h ? -p : p;
  });
}
function oi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((a) => Array.isArray(e[a]) && e[a].length > 0);
  return i.length ? t.filter((a) => a ? i.every((m) => Re(a[m], e[m])) : !1) : t;
}
function Rr(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const a = Mn(e);
  return a.length ? t.filter((m) => m ? a.every(
    (h) => i.some((r) => {
      const l = m[r];
      return l != null && Nn(String(l), [h]);
    })
  ) : !1) : t;
}
function Or(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const a = t.map((h) => h && h[e] != null ? parseFloat(h[e]) : NaN).filter((h) => Number.isFinite(h)), m = a.reduce((h, r) => h + r, 0);
  return i === "sum" ? m : i === "avg" && a.length ? m / a.length : 0;
}
function Mr(t, e = {}, i = [], a) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const m = t.length;
  let h = t;
  e.filters && (h = oi(h, e.filters)), e.search && (h = Rr(h, e.search, i));
  const r = h.length;
  if (e.sort && (h = Dr(h, e.sort, a)), e.offset || e.limit) {
    const l = e.offset || 0, c = e.limit || h.length;
    h = h.slice(l, l + c);
  }
  return { records: h, total: m, filtered: r };
}
function Nr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const a = { ...i };
    for (const [m, h] of Object.entries(e))
      if (typeof h == "function")
        try {
          a[m] = h(i);
        } catch {
          a[m] = void 0;
        }
    return a;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(k, x, M) {
    const N = k.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const a = {
    "data-ln-data-store": { type: "marker", effect: Pe, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: Pe, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: dn, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: yi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: bi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, m = et(a), h = "ln_app_cache", r = "_meta", l = "1.0";
  let c = null, n = null;
  const o = {};
  function u(k) {
    k && k.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: k });
  }
  function p() {
    const k = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const M = x.id;
      if (M) {
        const N = x.getAttribute("data-ln-data-store-indexes") || "";
        k[M] = {
          indexes: N.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return k;
  }
  function w() {
    return n || (n = new Promise((k) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), k(null);
      const x = p(), M = Object.keys(x), N = indexedDB.open(h);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), k(null);
      }, N.onsuccess = (F) => {
        const U = F.target.result, K = Array.from(U.objectStoreNames);
        if (!(!K.includes(r) || M.some((ht) => !K.includes(ht))))
          return v(U), c = U, k(U);
        const J = U.version;
        U.close();
        const nt = indexedDB.open(h, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), k(null);
        }, nt.onupgradeneeded = (ht) => {
          const at = ht.target.result;
          at.objectStoreNames.contains(r) || at.createObjectStore(r, { keyPath: "key" });
          for (const Tt of M)
            if (!at.objectStoreNames.contains(Tt)) {
              const Nt = at.createObjectStore(Tt, { keyPath: "id" });
              for (const ce of x[Tt].indexes)
                Nt.createIndex(ce, ce, { unique: !1 });
            }
        }, nt.onsuccess = (ht) => {
          const at = ht.target.result;
          v(at), c = at, k(at);
        };
      };
    }), n);
  }
  function v(k) {
    k.onversionchange = () => {
      k.close(), c = null, n = null;
    };
  }
  function S() {
    return c ? Promise.resolve(c) : (n = null, w());
  }
  async function A(k) {
    if (!At() || !k) return k;
    const x = { ...k }, M = x.id, N = await Hi(x);
    return !N || !N.encrypted ? k : {
      ...N,
      id: M
    };
  }
  async function f(k) {
    return !k || !k.encrypted || !At() ? k : zi(k, { silent: !0 });
  }
  const y = (k, x) => S().then((M) => M ? M.transaction(k, x).objectStore(k) : null);
  function d(k) {
    return new Promise((x, M) => {
      k.onsuccess = () => x(k.result), k.onerror = () => {
        u(k.error), M(k.error);
      };
    });
  }
  const s = (k) => y(k, "readonly").then((x) => x ? d(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => f(M))) : x), g = (k, x) => y(k, "readonly").then((M) => M ? d(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? d(M.get(Number(x))) : typeof x == "number" ? d(M.get(String(x))) : null) : null).then((M) => M ? f(M) : null), b = (k, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(k, "readonly").objectStore(k), U = x.map((K) => d(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? d(F.get(Number(K))) : typeof K == "number" ? d(F.get(String(K))) : null));
    return Promise.all(U).then((K) => At() ? Promise.all(K.map((W) => W ? f(W) : null)) : K);
  }), T = (k, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => y(k, "readwrite").then((F) => F ? d(F.put(N)) : null)), _ = (k, x) => y(k, "readwrite").then((M) => M ? d(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return d(M.delete(Number(x)));
    if (typeof x == "number")
      return d(M.delete(String(x)));
  }) : null), E = (k) => y(k, "readwrite").then((x) => x ? d(x.clear()) : null), C = (k) => y(k, "readonly").then((x) => x ? d(x.count()) : 0), q = (k) => y(r, "readonly").then((x) => x ? d(x.get(k)) : null), D = (k, x) => y(r, "readwrite").then((M) => {
    if (M)
      return x.key = k, d(M.put(x));
  });
  function I(k) {
    return this.dom = k, this._name = k.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", k), tt(this, k, m), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, k.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Ir({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, M, N) => {
        L(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: M,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, R(this), this.ready = X(this), this;
  }
  function R(k) {
    k._handlers = {
      create: (x) => O(k, "create", x.detail, () => B(k, x.detail)),
      update: (x) => O(k, "update", x.detail, () => H(k, x.detail)),
      delete: (x) => O(k, "delete", x.detail, () => z(k, x.detail)),
      "bulk-delete": (x) => O(k, "bulk-delete", x.detail, () => Q(k, x.detail)),
      "sync-failed": (x) => {
        k.isSyncing = !1, L(k.dom, "ln-data-store:sync-error", {
          store: k._name,
          error: x.detail && x.detail.error,
          status: x.detail && x.detail.status
        });
      }
    };
    for (const [x, M] of Object.entries(k._handlers))
      k.dom.addEventListener(`ln-data-store:request-${x}`, M);
    k._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.term != null ? x.detail.term : "";
        M !== k.query.search && (k.query.search = M, le(k));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.key;
        if (!M) return;
        const N = (x.detail.values || []).slice(), F = k.query.filters[M];
        (F ? F.length === N.length && F.every((K, W) => K === N[W]) : !N.length) || (N.length ? k.query.filters[M] = N : delete k.query.filters[M], le(k));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.field, N = x.detail && x.detail.direction, F = N && N !== "none" ? { field: M, direction: N } : null, U = k.query.sort;
        !U && !F || U && F && U.field === F.field && U.direction === F.direction || (k.query.sort = F, le(k));
      }
    };
    for (const [x, M] of Object.entries(k._queryHandlers))
      k.dom.addEventListener(x, M);
  }
  function O(k, x, M, N) {
    const F = M && M.requestId;
    return k._mutationChain = k._mutationChain.then(() => k.ready).then(() => {
      if (k.initializationError) throw k.initializationError;
      return N();
    }).catch((U) => Y(k, x, F, U)), k._mutationChain;
  }
  function P(k, x = 0) {
    return C(k._name).then((M) => {
      if (k._windowIndex || k.windowed) {
        const N = k.totalCount != null ? k.totalCount : M;
        k.totalCount = Math.max(0, N + x);
      } else
        k.totalCount = M;
      return k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, D(k._name, {
        schema_version: l,
        last_synced_at: k.lastSyncedAt,
        has_cache: !0,
        record_count: k.totalCount
      });
    });
  }
  function B(k, { tempId: x, data: M = {}, requestId: N } = {}) {
    const F = { ...M, id: x };
    return T(k._name, F).then(() => P(k, 1)).then(() => {
      L(k.dom, "ln-data-store:created", { store: k._name, record: F, tempId: x, requestId: N });
    });
  }
  function H(k, { id: x, data: M = {}, requestId: N } = {}) {
    return g(k._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const U = F.id, K = { ...F, ...M, id: U }, W = M.id, J = W !== void 0 && W !== U;
      return (J ? yt(k._name, U, { ...K, id: W }) : T(k._name, K)).then(() => P(k, 0)).then(() => {
        L(k.dom, "ln-data-store:updated", { store: k._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(k, { id: x, requestId: M } = {}) {
    return g(k._name, x).then((N) => {
      if (!N) {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: x, requestId: M, missing: !0 });
        return;
      }
      const F = N.id;
      return _(k._name, F).then(() => P(k, -1)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: F, requestId: M });
      });
    });
  }
  function Q(k, { ids: x = [], requestId: M } = {}) {
    return x.length ? Promise.all(x.map((N) => g(k._name, N))).then((N) => {
      const F = N.filter(Boolean).map((U) => U.id);
      return ft(k._name, F).then(() => P(k, -F.length)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, ids: F, requestId: M });
      });
    }) : (L(k.dom, "ln-data-store:deleted", { store: k._name, ids: [], requestId: M }), Promise.resolve());
  }
  function Y(k, x, M, N) {
    console.error("[ln-data-store] " + x + " failed:", N), L(k.dom, "ln-data-store:mutation-error", {
      store: k._name,
      action: x,
      requestId: M,
      error: N
    });
  }
  function X(k) {
    return w().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return q(k._name);
    }).then((x) => {
      if (k.initializationError = null, x && x.schema_version === l)
        k.lastSyncedAt = x.last_synced_at || null, k.totalCount = x.record_count || 0, k.hasCache = x.has_cache === !0 || k.totalCount > 0, k.hasCache && (k.isLoaded = !0, k.canServe = !0, L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "cache" })), k.isInitialized = !0, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: k.hasCache, lastSyncedAt: k.lastSyncedAt, count: k.totalCount });
      else {
        if (x && x.schema_version !== l)
          return E(k._name).then(() => D(k._name, { schema_version: l, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (k.isInitialized = !0, k.isLoaded = !1, k.canServe = !1, k.hasCache = !1, k.isSyncing = !1, k.initializationError = x, L(k.dom, "ln-data-store:initialization-error", { store: k._name, error: x }), { ok: !1, error: x }));
  }
  function V(k) {
    k.isSyncing = !0, L(k.dom, "ln-data-store:request-remote-sync", { since: k.lastSyncedAt });
  }
  function G(k, x) {
    return S().then((M) => M ? (At() ? Promise.all(x.map((F) => A(F))) : Promise.resolve(x)).then((F) => new Promise((U, K) => {
      const W = M.transaction(k, "readwrite"), J = W.objectStore(k);
      F.forEach((nt) => J.put(nt)), W.oncomplete = () => U(), W.onerror = () => {
        u(W.error), K(W.error);
      };
    })) : void 0);
  }
  function ft(k, x) {
    return S().then((M) => {
      if (M)
        return new Promise((N, F) => {
          const U = M.transaction(k, "readwrite"), K = U.objectStore(k);
          x.forEach((W) => {
            K.delete(W), typeof W == "string" && W.trim() !== "" && !isNaN(Number(W)) ? K.delete(Number(W)) : typeof W == "number" && K.delete(String(W));
          }), U.oncomplete = () => N(), U.onerror = () => F(U.error);
        });
    });
  }
  function yt(k, x, M) {
    return (At() ? A(M) : Promise.resolve(M)).then((F) => S().then((U) => {
      if (U)
        return new Promise((K, W) => {
          const J = U.transaction(k, "readwrite"), nt = J.objectStore(k);
          nt.put(F), nt.delete(x), J.oncomplete = () => K(), J.onerror = () => {
            u(J.error), W(J.error);
          };
        });
    }));
  }
  const ae = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function ci(k) {
    return k ? Object.keys(k).filter((x) => Array.isArray(k[x]) && k[x].length > 0) : [];
  }
  function di(k, x, M) {
    return x.every((N) => M[N].map(String).includes(String(k[N])));
  }
  function ui(k) {
    return String(k || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function fi(k, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const U = k[F];
        return U != null && String(U).toLowerCase().includes(N);
      })
    );
  }
  function hi(k, x, M) {
    return Or(k, x, M);
  }
  function Mt(k, x) {
    return Nr(x, k.presenters && k.presenters.computed);
  }
  function pi(k) {
    return !k.sort && !At();
  }
  function mi(k, x, M) {
    const N = ci(x.filters), F = x.search ? ui(x.search) : [], U = k._searchFields, K = F.length > 0 && U && U.length > 0;
    return y(k._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ht = [], at = W.openCursor();
      at.onsuccess = () => {
        const Tt = at.result;
        if (!Tt || ht.length >= M) {
          J(ht);
          return;
        }
        const Nt = Tt.value;
        (!N.length || di(Nt, N, x.filters)) && (!K || fi(Nt, F, U)) && ht.push(Nt), Tt.continue();
      }, at.onerror = () => nt(at.error);
    }) : []);
  }
  function Ne(k, x, M) {
    return Mr(x, M, k._searchFields, ae);
  }
  function Fe(k, x, M) {
    const N = [];
    for (let U = x; U < x + M; U++) {
      const K = k._windowIndex.getId(U);
      N.push(K);
    }
    const F = Array.from(new Set(N.filter((U) => U !== void 0)));
    return b(k._name, F).then((U) => {
      const K = /* @__PURE__ */ new Map();
      for (let J = 0; J < U.length; J++) {
        const nt = U[J];
        nt && K.set(String(nt.id), nt);
      }
      const W = [];
      for (let J = 0; J < N.length; J++) {
        const nt = N[J];
        if (nt === void 0)
          W.push(null);
        else {
          const ht = K.get(String(nt));
          W.push(ht || null);
        }
      }
      return {
        data: Mt(k, W),
        total: k._windowIndex.grandTotal,
        filtered: k._windowIndex.logicalTotal,
        offset: x,
        queryGen: k._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(k = {}) {
    const x = this;
    if (x._windowIndex) {
      const M = k.offset || 0, N = k.limit || 200;
      if (x._windowIndex.ensure(M, M + N, k), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const F = M + N, U = (K) => K.length ? {
          data: Mt(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Fe(x, M, N);
        return pi(k) ? mi(x, k, F).then((K) => U(K.slice(M, F))) : s(x._name).then((K) => U(Ne(x, K, k).records));
      }
      return Fe(x, M, N);
    }
    return s(x._name).then((M) => {
      const N = Ne(x, M, k);
      return {
        data: Mt(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(k) {
    return g(this._name, k).then((x) => x ? Mt(this, [x])[0] : null);
  }, I.prototype.count = function(k) {
    return k && Object.keys(k).length > 0 ? s(this._name).then((M) => oi(M, k).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(k, x) {
    return s(this._name).then((M) => hi(M, k, x));
  }, I.prototype.setPresenters = function(k) {
    this.presenters = k;
  }, I.prototype.applySync = function(k, x, M, N) {
    N = N || {};
    const F = this;
    if (F._windowIndex && N.queryGen != null && N.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    k.length > 0 || x.length > 0;
    let U = Promise.resolve();
    return k.length > 0 && (U = U.then(() => G(F._name, k))), x.length > 0 && (U = U.then(() => ft(F._name, x))), U.then(() => {
      if (F._windowIndex && (N.offset != null || N.total != null)) {
        const K = N.offset != null ? N.offset : 0, W = k.map((nt) => nt.id), J = F._windowIndex.ingest(K, W, N.total, N.filtered, N.queryGen);
        if (J && J.length) return ft(F._name, J);
      }
    }).then(() => C(F._name)).then((K) => (F.totalCount = N.total !== void 0 ? N.total : K, F.hasCache = !0, D(F._name, {
      schema_version: l,
      last_synced_at: M,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const K = !F.isLoaded;
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = M, K ? (L(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: N }), L(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: N })) : L(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: k.length,
        deleted: x.length,
        changed: !0,
        meta: N
      });
    }).catch((K) => {
      F.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, I.prototype.applyQuery = function(k, x) {
    x = x || {};
    const M = this;
    let N = Promise.resolve();
    return k.length > 0 && (N = N.then(() => G(M._name, k))), N.then(() => C(M._name)).then((F) => (M.totalCount = x.total !== void 0 ? x.total : F, k.length > 0 && (M.canServe = !0), Mt(M, k))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const k = this;
    return E(k._name).then(() => D(k._name, {
      schema_version: l,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      k.isLoaded = !1, k.hasCache = !1, k.lastSyncedAt = null, k.totalCount = 0, V(k);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [k, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${k}`, x);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [k, x] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(k, x);
      this._queryHandlers = null;
    }
    delete o[this._name], delete this.dom[e], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function gi() {
    return S().then((k) => {
      if (!k) return;
      const x = Array.from(k.objectStoreNames);
      return new Promise((M, N) => {
        const F = k.transaction(x, "readwrite");
        x.forEach((U) => F.objectStore(U).clear()), F.oncomplete = () => M(), F.onerror = () => N(F.error);
      });
    }).then(() => {
      Object.values(o).forEach((k) => {
        k.isLoaded = !1, k.canServe = !1, k.isInitialized = !1, k.initializationError = null, k.hasCache = !1, k.isSyncing = !1, k.lastSyncedAt = null, k.totalCount = 0;
      });
    });
  }
  function le(k) {
    k._windowIndex && k._windowIndex.reset(), L(k.dom, "ln-data-store:query-changed", {
      store: k._name,
      query: {
        filters: Object.assign({}, k.query.filters),
        search: k.query.search,
        sort: k.query.sort ? Object.assign({}, k.query.sort) : null
      }
    });
  }
  const _i = "data-ln-data-store-frozen";
  function Pe(k, x) {
    k.setAttribute(_i, x);
  }
  function yi(k) {
    const x = k[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ft(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function bi(k) {
    const x = k[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: a
  }), window[e].clearAll = gi, window[e].init = window[e], window[e].setStorageKey = je, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = je);
})();
const Fr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function kt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const a = String(e);
    return i === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Pr(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Fr);
  if (e && typeof e == "object")
    for (const m in e)
      e[m] !== void 0 && e[m] !== null && e[m] !== "" && (i[m] = e[m]);
  const a = new URLSearchParams();
  return t.search && a.append(i.search, t.search), t.offset != null && a.append(i.offset, t.offset), t.limit != null && a.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (a.append(i.sortField, t.sort.field), a.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((m) => {
    const h = t.filters[m];
    Array.isArray(h) && h.length > 0 && a.append(m, h.join(","));
  }), a.toString();
}
function Br(t, e, i) {
  let a = kt(t, e);
  return i && (a += (a.indexOf("?") !== -1 ? "&" : "?") + i), a;
}
function on(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(n) {
    const o = n[e];
    o && o.refreshConfig();
  }
  const m = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: $, type: "string", fallback: "", effect: a, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: $, type: "string", fallback: "", effect: a, description: "Resource path appended to base URL" },
    "data-ln-api-headers": { prop: "rawHeaders", read: $, type: "json", fallback: null, effect: a, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: a, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: a, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: a, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: a, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: a, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: a, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, h = et(m);
  function r(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((o) => {
      const u = new Error("HTTP " + n.status + ": " + n.statusText);
      throw u.status = n.status, u.data = o, u;
    });
  }
  function l(n) {
    return this.dom = n, tt(this, n, h), n[e] = this, n[i] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  l.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = Cn(this.rawHeaders);
    const o = {}, u = n.getAttribute("data-ln-api-param-offset");
    u && (o.offset = u);
    const p = n.getAttribute("data-ln-api-param-limit");
    p && (o.limit = p);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (o.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (o.sortField = v);
    const S = n.getAttribute("data-ln-api-param-sort-dir");
    S && (o.sortDir = S), this.paramKeys = o;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, l.prototype._reqHeaders = function(n) {
    const o = Object.assign({}, this.headers);
    return !o.Accept && !o.accept && (o.Accept = "application/json"), !o["Content-Type"] && !o["content-type"] && (o["Content-Type"] = "application/json"), n && (o["X-Idempotency-Key"] = n), o;
  }, l.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, l.prototype.fetchDelta = function(n, o) {
    const u = this;
    let p = kt(u.baseUrl, u.path);
    n != null && n !== "" && (p += (p.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = o || "sync";
    u._inflight.has(w) && u._inflight.get(w).abort();
    const v = new AbortController();
    return u._inflight.set(w, v), window.fetch(p, {
      method: "GET",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      signal: v.signal
    }).then(r).finally(function() {
      u._inflight.get(w) === v && u._inflight.delete(w);
    });
  }, l.prototype.query = function(n, o) {
    const u = this, p = Pr(n, u.paramKeys), w = Br(u.baseUrl, u.path, p), v = o || "query";
    u._inflight.has(v) && u._inflight.get(v).abort();
    const S = new AbortController();
    return u._inflight.set(v, S), window.fetch(w, {
      method: "GET",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      signal: S.signal
    }).then(r).finally(function() {
      u._inflight.get(v) === S && u._inflight.delete(v);
    });
  }, l.prototype.create = function(n, o, u) {
    const p = this;
    return window.fetch(kt(p.baseUrl, o || p.path), {
      method: "POST",
      headers: p._reqHeaders(u),
      credentials: p.credentials,
      body: JSON.stringify(n)
    }).then(r);
  }, l.prototype.update = function(n, o, u, p, w) {
    const v = this;
    u != null && (o = Object.assign({}, o, { expected_version: u }));
    const S = p ? kt(v.baseUrl, p) : kt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(o)
    }).then(r);
  }, l.prototype.delete = function(n, o, u) {
    const p = this;
    return window.fetch(kt(p.baseUrl, o || p.path, n), {
      method: "DELETE",
      headers: p._reqHeaders(u),
      credentials: p.credentials
    }).then(r);
  }, l.prototype.bulkDelete = function(n, o, u) {
    const p = this;
    return window.fetch(kt(p.baseUrl, o || p.path, "bulk-delete"), {
      method: "DELETE",
      headers: p._reqHeaders(u),
      credentials: p.credentials,
      body: JSON.stringify({ ids: n })
    }).then(r);
  };
  function c(n) {
    n._handlers = {
      sync: function(o) {
        const u = o.detail || {}, p = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        n.fetchDelta(u.since, p).then(function(w) {
          L(n.dom, "ln-api-connector:fetched", { data: w, since: u.since, meta: u.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      query: function(o) {
        const u = o.detail || {}, p = u.query || u, w = u.meta && u.meta.targetEl ? u.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(y, d, s) {
          n.query(d, s).then(function(g) {
            const b = g || {};
            L(n.dom, "ln-api-connector:fetched", {
              data: b.data || (Array.isArray(b) ? b : []),
              total: b.total,
              filtered: b.filtered,
              offset: d.offset,
              queryGen: d.queryGen,
              meta: y.meta || null
            });
          }).catch(function(g) {
            g && g.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
              action: "query",
              error: g.message,
              status: g.status || 0,
              data: g.data || null,
              meta: y.meta || null
            });
          });
        }
        if (S === 0) {
          A(u, p, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const f = setTimeout(function() {
          n._queryTimers.delete(v), A(u, p, w);
        }, S);
        n._queryTimers.set(v, f);
      },
      cancel: function(o) {
        const u = o.detail || {}, p = u.meta && u.meta.targetEl ? u.meta.targetEl : u.targetEl || u.key;
        p && n.cancel(p);
      },
      create: function(o) {
        const u = o.detail || {};
        n.create(u.data, u.url, u.idempotencyKey).then(function(p) {
          const w = on(p);
          L(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: u.tempId,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "create",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(o) {
        const u = o.detail || {};
        n.update(u.id, u.data, u.expected_version, u.url, u.idempotencyKey).then(function(p) {
          const w = on(p);
          L(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: u.id,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "update",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            id: u.id,
            conflictData: p.status === 409 ? p.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(o) {
        const u = o.detail || {};
        n.delete(u.id, u.url, u.idempotencyKey).then(function(p) {
          const w = p && p.message ? p.message : null;
          L(n.dom, "ln-api-connector:deleted", {
            response: p,
            id: u.id,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const u = o.detail || {};
        n.bulkDelete(u.ids, u.url, u.idempotencyKey).then(function(p) {
          const w = p && p.message ? p.message : null;
          L(n.dom, "ln-api-connector:bulk-deleted", {
            response: p,
            ids: u.ids,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(o) {
      o.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(o) {
      o && clearTimeout(o);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[i];
  }, j(t, e, l, "ln-api-connector", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const m = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: $, type: "string", fallback: "", effect: a, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: $, type: "string", fallback: "", effect: a, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: $, type: "string", fallback: "", effect: a, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: a, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, h = et(m);
  function r(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function l(v) {
    return this.dom = v, tt(this, v, h), v[e] = this, v[i] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  l.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const S = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Cn(S, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function c(v, S, A) {
    const f = Object.assign({}, Ft(v.headers, v.auth), A || {});
    return S && (f["Idempotency-Key"] = S), f;
  }
  l.prototype.fetchDelta = function(v) {
    const S = this, A = ["include_docs=true", "feed=normal"];
    v && A.push("since=" + encodeURIComponent(v));
    const f = Et(S.url, S.db, "_changes") + "?" + A.join("&");
    return window.fetch(f, { method: "GET", headers: Ft(S.headers, S.auth), credentials: S.credentials }).then((y) => {
      if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
      return y.json();
    }).then((y) => {
      const d = y.results || [];
      return {
        data: d.filter((s) => !s.deleted && s.doc).map((s) => Object.assign({}, s.doc, { id: s.doc._id })),
        deleted: d.filter((s) => s.deleted).map((s) => s.id),
        synced_at: y.last_seq || v || ""
      };
    });
  };
  function n(v, S, A) {
    const f = Object.assign({ _id: S.id }, S);
    return f._id || delete f._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: c(v, A),
      credentials: v.credentials,
      body: JSON.stringify(f)
    }).then((y) => {
      if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
      return y.json();
    }).then((y) => {
      const d = r(y), s = d.content;
      return { record: Object.assign({}, f, { id: s.id, _id: s.id, _rev: s.rev }), message: d.message };
    });
  }
  l.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function o(v, S, A, f) {
    const y = Object.assign({ id: String(S), _id: String(S) }, A), d = y._rev || y.rev;
    return (d ? Promise.resolve(d) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Ft(v.headers, v.auth), credentials: v.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision mapping");
      return g.json().then((b) => b._rev);
    })).then((g) => {
      const b = Object.assign({}, y, { _rev: g });
      delete b.rev;
      const T = c(v, f, { "If-Match": g });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(b)
      }).then((_) => {
        if (_.ok) return _.json().then((E) => {
          const C = r(E);
          return { record: Object.assign({}, b, { _rev: C.content.rev }), message: C.message };
        });
        if (_.status === 409) return _.json().then((E) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = E, C;
        });
        throw new Error("HTTP " + _.status + ": " + _.statusText);
      });
    });
  }
  l.prototype.update = function(v, S, A) {
    return o(this, v, S, A).then((f) => f.record);
  };
  function u(v, S, A, f) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Ft(v.headers, v.auth), credentials: v.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision delete");
      return d.json().then((s) => s._rev);
    })).then((d) => {
      const s = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(d);
      return window.fetch(s, { method: "DELETE", headers: c(v, f), credentials: v.credentials }).then((g) => {
        if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
        return g.json();
      }).then((g) => {
        const b = r(g);
        return { response: b.content, message: b.message };
      });
    });
  }
  l.prototype.delete = function(v, S, A) {
    return u(this, v, S, A).then((f) => f.response);
  };
  function p(v, S, A) {
    return !S || S.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Ft(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: S })
    }).then((f) => {
      if (!f.ok) throw new Error("HTTP " + f.status + ": " + f.statusText);
      return f.json();
    }).then((f) => {
      const d = (f.rows || []).filter((s) => !s.error && s.value && s.value.rev).map((s) => ({ _id: s.id, _rev: s.value.rev, _deleted: !0 }));
      return d.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: d })
      }).then((s) => {
        if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
        return s.json();
      }).then((s) => {
        const g = r(s);
        return { response: { ok: !0, results: g.content, deletedCount: d.length }, message: g.message };
      });
    });
  }
  l.prototype.bulkDelete = function(v, S) {
    return p(this, v, S).then((A) => A.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(A) {
        const f = A.detail || {};
        v.fetchDelta(f.since).then(function(y) {
          L(v.dom, "ln-couchdb-connector:fetched", { data: y, since: f.since, meta: f.meta || null });
        }).catch(function(y) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: y.message,
            status: y.status || 0,
            since: f.since,
            meta: f.meta || null
          });
        });
      },
      create: function(A) {
        const f = A.detail || {};
        n(v, f.data, f.idempotencyKey).then(function(y) {
          L(v.dom, "ln-couchdb-connector:created", { record: y.record, tempId: f.tempId, message: y.message, meta: f.meta || null });
        }).catch(function(y) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: y.message,
            status: y.status || 0,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(A) {
        const f = A.detail || {}, y = Object.assign({}, f.data);
        f.expected_version !== void 0 && (y._rev = f.expected_version), o(v, f.id, y, f.idempotencyKey).then(function(d) {
          L(v.dom, "ln-couchdb-connector:updated", { record: d.record, id: f.id, message: d.message, meta: f.meta || null });
        }).catch(function(d) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: d.message,
            status: d.status || 0,
            id: f.id,
            data: d.status === 409 ? d.data : null,
            conflictData: d.status === 409 ? d.data : null,
            meta: f.meta || null
          });
        });
      },
      delete: function(A) {
        const f = A.detail || {};
        u(v, f.id, f.rev, f.idempotencyKey).then(function(y) {
          L(v.dom, "ln-couchdb-connector:deleted", { response: y.response, id: f.id, message: y.message, meta: f.meta || null });
        }).catch(function(y) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: y.message,
            status: y.status || 0,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const f = A.detail || {};
        p(v, f.ids, f.idempotencyKey).then(function(y) {
          L(v.dom, "ln-couchdb-connector:bulk-deleted", { response: y.response, ids: f.ids, message: y.message, meta: f.meta || null });
        }).catch(function(y) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: y.message,
            status: y.status || 0,
            ids: f.ids,
            meta: f.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.addEventListener(A + ":request-sync", v._handlers.sync), v.dom.addEventListener(A + ":request-fetch", v._handlers.sync), v.dom.addEventListener(A + ":request-create", v._handlers.create), v.dom.addEventListener(A + ":request-update", v._handlers.update), v.dom.addEventListener(A + ":request-delete", v._handlers.delete), v.dom.addEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    });
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const v = this;
    v._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.removeEventListener(A + ":request-sync", v._handlers.sync), v.dom.removeEventListener(A + ":request-fetch", v._handlers.sync), v.dom.removeEventListener(A + ":request-create", v._handlers.create), v.dom.removeEventListener(A + ":request-update", v._handlers.update), v.dom.removeEventListener(A + ":request-delete", v._handlers.delete), v.dom.removeEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    }), v._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[i];
  }, j(t, e, l, "ln-couchdb-connector", {
    attributes: m
  });
})();
function Ur(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Bt(t, e) {
  const i = !t || !!t.initializationError, a = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || a) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Qt(t, e, i) {
  return i === "store" && !!e && !(t && t.windowed);
}
function sn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class Hr {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((i, a) => {
      this._pending.set(e, { resolve: i, reject: a });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const i = e || new Error("Mutation receipt registry closed");
    for (const a of this._pending.values()) a.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const a = e && e.requestId;
    if (!a) return !1;
    const m = this._pending.get(a);
    return m ? (this._pending.delete(a), i ? m.reject(e.error || new Error("Store mutation failed")) : m.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope", a = "data-ln-data-coordinator-search", m = "data-ln-data-coordinator-filters", h = "data-ln-data-coordinator-sort-field", r = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function l(_) {
    const E = _[e];
    E && E.refreshMapper();
  }
  function c(_) {
    const E = _[e];
    E && E._queueQueryRefresh();
  }
  function n(_, E) {
    return _.getAttribute(E) || _.id;
  }
  const o = {
    "data-ln-data-coordinator": { prop: "_name", type: "string", read: n, description: "Coordinator name or identifier for data routing" },
    "data-ln-data-coordinator-scope": { type: "string", description: "Scope name addressing the bound data store and connector" },
    "data-ln-data-coordinator-mapper": { type: "string", effect: l, description: "Name of the registered data mapper transform" },
    "data-ln-data-coordinator-search": { type: "string", effect: c, description: "Active search query term" },
    "data-ln-data-coordinator-filters": { type: "string", effect: c, description: "Active encoded filter parameters" },
    "data-ln-data-coordinator-sort-field": { type: "string", effect: c, description: "Active sort field property name" },
    "data-ln-data-coordinator-sort-direction": { type: "enum", values: ["asc", "desc"], fallback: "asc", effect: c, description: "Sort direction" },
    "data-ln-data-coordinator-stale": { type: "marker", description: "Flag indicating data needs re-synchronization" },
    "data-ln-data-coordinator-no-autosync": { type: "boolean", description: "Disables automatic synchronization upon state changes" },
    "data-ln-data-coordinator-dict": { type: "marker", description: "Marks dictionary container for coordinator translatable messages" }
  }, u = et(o), p = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function f() {
    w || (w = !0, v = function() {
      L(document, "ln-data-coordinator:online", {}), p.forEach(function(_) {
        _._maybeSync();
      });
    }, S = function() {
      L(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && p.forEach(function(_) {
        const E = _.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !_._noAutosync && (!C.hasCache || _._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function y() {
    w && (p.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", S), document.removeEventListener("visibilitychange", A), v = null, S = null, A = null, w = !1));
  }
  function d() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (E) => {
        const C = Math.random() * 16 | 0;
        return (E === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  const s = ["ln-api-connector", "ln-couchdb-connector"];
  function g(_) {
    return _ ? _.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : _.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function b(_) {
    const E = this;
    return this.dom = _, tt(this, _, u), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", _), _[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Hr(), this._dict = ie(_, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), p.add(this), f(), this._checkInitialSync(), this;
  }
  Object.defineProperty(b.prototype, "_staleThreshold", {
    get: function() {
      const E = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (E ? E.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const q = parseInt(C, 10);
      return isNaN(q) ? 300 : q;
    }
  }), Object.defineProperty(b.prototype, "_noAutosync", {
    get: function() {
      const E = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (E ? E.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), b.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, b.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const E = this.findChildren().store;
    return !E || !E.lastSyncedAt ? !0 : Date.now() / 1e3 - E.lastSyncedAt > this._staleThreshold;
  }, b.prototype._maybeSync = function() {
    const _ = this.findChildren(), E = _.store;
    !E || E.initializationError || !_.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, b.prototype._checkInitialSync = function() {
    const _ = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (_._destroyed) return;
      const q = _.findChildren(), D = q.store;
      if (D && D.initializationError) {
        _._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !q.connector || _._noAutosync || D.isSyncing || (!D.hasCache || _._isStale()) && D.forceSync();
    }).catch(function(q) {
      _._destroyed || _._reportReconciliationError("store-initialize", q, null);
    });
  }, b.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const E = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    E && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(E)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(C) {
      return C;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(C) {
      return C;
    });
  }, b.prototype.findChildren = function() {
    const _ = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: _,
      connectorEl: E,
      queueEl: C,
      store: _ ? _.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, b.prototype._handleSubmitRecord = function(_) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = _.data || {}, q = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = _.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, _.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, q, I, D, _.action);
  }, b.prototype._fanOutCreate = function(_, E, C) {
    this.refreshMapper();
    const q = "_temp_" + d();
    _.storeEl && L(_.storeEl, "ln-data-store:request-create", { tempId: q, data: E }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: q,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: q, action: C }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: d(), queued: !1, op: "create", tempId: q }
    });
  }, b.prototype._fanOutUpdate = function(_, E, C, q, D) {
    this.refreshMapper(), _.storeEl && L(_.storeEl, "ln-data-store:request-update", { id: E, data: C }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: q,
      meta: { id: E, action: D }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: q,
      url: D,
      meta: { entryId: d(), queued: !1, op: "update", id: E }
    });
  }, b.prototype._fanOutDelete = function(_, E) {
    this.refreshMapper(), _.storeEl && L(_.storeEl, "ln-data-store:request-delete", { id: E }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: d(), queued: !1, op: "delete", id: E }
    });
  }, b.prototype._fanOutBulkDelete = function(_, E) {
    this.refreshMapper();
    const C = E.join(",");
    _.storeEl && L(_.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: d(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, b.prototype._toastFromMessage = function(_) {
    _ && L(window, "ln-toast:enqueue", {
      type: _.type || "success",
      title: _.title || "",
      message: _.body || ""
    });
  }, b.prototype._toastFromDict = function(_) {
    const E = this._dict[_];
    E && L(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, b.prototype._requestStoreMutation = function(_, E, C) {
    const q = _.storeEl;
    if (!q) return Promise.reject(new Error("Store element not found"));
    const D = d(), I = this._mutationReceipts.wait(D);
    return L(q, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, b.prototype._reportReconciliationError = function(_, E, C) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", {
      operation: _,
      error: E,
      meta: C || null
    });
  };
  function T(_) {
    _._handlers = {
      sync: function(E) {
        _.refreshMapper();
        const C = _.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(C.connectorEl, g(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = _.findChildren();
        if (!C.connectorEl) return;
        const q = E.detail || {};
        L(C.connectorEl, g(C.connectorEl) + ":request-query", {
          query: Object.assign({}, q.query, {
            offset: q.offset,
            limit: q.limit,
            queryGen: q.queryGen
          })
        });
      },
      reqCreate: function(E) {
        const C = _.findChildren();
        _._fanOutCreate(C, E.detail.data || {}, E.detail.action);
      },
      reqUpdate: function(E) {
        const C = _.findChildren();
        _._fanOutUpdate(C, E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action);
      },
      reqDelete: function(E) {
        const C = _.findChildren();
        _._fanOutDelete(C, E.detail.id);
      },
      reqBulkDelete: function(E) {
        const C = _.findChildren();
        _._fanOutBulkDelete(C, E.detail.ids || []);
      },
      queueFailed: function() {
        _._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(E) {
        _.refreshMapper();
        const C = _.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const q = E.detail || {}, D = q.entryId, I = q.op, R = q.targetId, O = q.payload, P = q.expectedVersion, B = q.meta || {}, H = B.action || null, z = q.idempotencyKey || D;
        I === "create" ? L(C.connectorEl, g(C.connectorEl) + ":request-create", {
          data: O,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? L(C.connectorEl, g(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? L(C.connectorEl, g(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? L(C.connectorEl, g(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: B.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(E) {
        const C = E.target;
        if (E.defaultPrevented) return;
        const q = C.hasAttribute(i) ? C.getAttribute(i) : null;
        if (q === null) return;
        let D;
        if (q ? D = _._owns(q) : D = C.closest("[data-ln-data-coordinator]") === _.dom, !D) return;
        const I = Ii(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = gn(C);
        delete R._method, delete R._token, _._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(E) {
        const C = E.detail.meta || {}, q = _.findChildren();
        _.refreshMapper();
        const D = E.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => _.mapper.ingress(B));
        if (q.store && !q.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? q.store.applyQuery(P, { total: E.detail.total }).then(function(B) {
            C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen) || (L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: E.detail.total !== void 0 ? E.detail.total : B.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : B.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), _._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? q.store.applyQuery(P, { total: E.detail.total }).then(function() {
            return q.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen) || L(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && q.store.applyQuery(P, { total: E.detail.total }).then(function() {
            if (C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen)) return;
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }) : q.store.applySync(P, R, O || Math.floor(Date.now() / 1e3), {
            total: E.detail.total,
            filtered: E.detail.filtered,
            offset: E.detail.offset,
            queryGen: E.detail.queryGen,
            targetEl: C.targetEl
          });
        else if (C.targetEl && C.kind) {
          if (C.kind === "table" || C.kind === "list" || C.kind === "chart")
            L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: P,
              total: E.detail.total !== void 0 ? E.detail.total : P.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : P.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), _._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            L(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(E) {
        const C = _.findChildren(), q = E.detail.meta || {}, D = _.mapper.ingress(E.detail.record);
        (C.storeEl ? _._requestStoreMutation(C, "update", { id: q.tempId, data: D }) : Promise.resolve()).then(function() {
          _._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: q.entryId,
            oldKey: q.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          _._reportReconciliationError("create-reconcile", R, q);
        });
      },
      connUpdated: function(E) {
        const C = _.findChildren(), q = E.detail.meta || {}, D = _.mapper.ingress(E.detail.record);
        (C.storeEl ? _._requestStoreMutation(C, "update", { id: q.id, data: D }) : Promise.resolve()).then(function() {
          _._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
        }).catch(function(R) {
          _._reportReconciliationError("update-reconcile", R, q);
        });
      },
      connDeleted: function(E) {
        const C = _.findChildren(), q = E.detail.meta || {};
        _._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connBulkDeleted: function(E) {
        const C = _.findChildren(), q = E.detail.meta || {};
        _._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connError: function(E) {
        const C = E.detail || {}, q = C.meta || {}, D = q.op || C.action, I = C.status || C.error && C.error.status || 0, R = _.findChildren();
        if (D === "sync") {
          R.storeEl && L(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          q.targetEl && q.kind && (L(q.targetEl, "ln-" + q.kind + ":set-loading", { loading: !1 }), (q.kind === "table" || q.kind === "list") && L(q.targetEl, "ln-" + q.kind + ":page-failed", { offset: q.offset })), _._reportReconciliationError("query", C.error || C, q);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          _._toastFromDict("auth"), q.queued && R.queue && L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "auth" });
          return;
        }
        if (P) {
          q.queued && R.queue ? L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "retry" }) : _._toastFromDict("network");
          return;
        }
        let H = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? _.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (H = _._requestStoreMutation(R, "update", { id: q.id, data: z })), _._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (H = _._requestStoreMutation(R, "delete", { id: q.tempId })), _._toastFromDict("rejected");
        q.queued && R.queue ? H.then(function() {
          L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "drop" });
        }).catch(function(z) {
          _._reportReconciliationError("deterministic-reconcile", z, q);
        }) : H.catch(function(z) {
          _._reportReconciliationError("deterministic-reconcile", z, q);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(E) {
        const C = _.findChildren(), q = C.store;
        if (!q || q.initializationError || !C.connector || _._noAutosync || q.isSyncing) return;
        (E.detail || {}).hasCache ? _._isStale() && q.forceSync() : q.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(E) {
        _._serveData(E, "table");
      },
      reqListData: function(E) {
        _._serveData(E, "list");
      },
      reqChartData: function(E) {
        _._serveData(E, "chart");
      },
      reqOptions: function(E) {
        _._serveOptions(E);
      },
      reqStat: function(E) {
        _._serveStat(E);
      },
      refreshQuery: function() {
        _._refreshAll(null, !0);
      },
      refresh: function(E) {
        _._mutationReceipts.resolve(E.detail), _._refreshAll(null, !1);
      },
      mutationError: function(E) {
        _._mutationReceipts.reject(E.detail);
      },
      refreshSynced: function(E) {
        E.detail && E.detail.changed && _._refreshAll(E.detail.meta, !1);
      },
      searchChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.term != null ? E.detail.term : "";
        C !== (_.dom.getAttribute(a) || "") && _.dom.setAttribute(a, C);
      },
      filterChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.key;
        if (!C) return;
        const q = (E.detail.values || []).slice(), D = _._currentQuery().filters, I = D[C];
        if (I ? I.length === q.length && I.every((B, H) => B === q[H]) : !q.length) return;
        q.length ? D[C] = q : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(H) {
            O.append(B, H);
          });
        });
        const P = O.toString();
        P ? _.dom.setAttribute(m, P) : _.dom.removeAttribute(m);
      },
      sortChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.field, q = E.detail && E.detail.direction, D = C && q && q !== "none" ? { field: C, direction: q } : null, I = _._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (_.dom.setAttribute(h, D.field), _.dom.setAttribute(r, D.direction)) : (_.dom.removeAttribute(h), _.dom.removeAttribute(r)));
      }
    }, _.dom.addEventListener("ln-data-store:request-remote-sync", _._handlers.sync), _.dom.addEventListener("ln-data-store:request-page", _._handlers.requestPage), _.dom.addEventListener("ln-data-coordinator:request-create", _._handlers.reqCreate), _.dom.addEventListener("ln-data-coordinator:request-update", _._handlers.reqUpdate), _.dom.addEventListener("ln-data-coordinator:request-delete", _._handlers.reqDelete), _.dom.addEventListener("ln-data-coordinator:request-bulk-delete", _._handlers.reqBulkDelete), _.dom.addEventListener("ln-api-queue:send", _._handlers.queueSend), _.dom.addEventListener("ln-api-queue:failed", _._handlers.queueFailed), _.dom.addEventListener("ln-data-store:initialized", _._handlers.storeInitialized), document.addEventListener("submit", _._handlers.formSubmit), s.forEach(function(E) {
      _.dom.addEventListener(E + ":fetched", _._handlers.connFetched), _.dom.addEventListener(E + ":created", _._handlers.connCreated), _.dom.addEventListener(E + ":updated", _._handlers.connUpdated), _.dom.addEventListener(E + ":deleted", _._handlers.connDeleted), _.dom.addEventListener(E + ":bulk-deleted", _._handlers.connBulkDeleted), _.dom.addEventListener(E + ":error", _._handlers.connError);
    }), document.addEventListener("ln-table:request-data", _._handlers.reqTableData), document.addEventListener("ln-list:request-data", _._handlers.reqListData), document.addEventListener("ln-chart:request-data", _._handlers.reqChartData), document.addEventListener("ln-options:request-data", _._handlers.reqOptions), document.addEventListener("ln-stat:request-count", _._handlers.reqStat), _.dom.addEventListener("ln-data-store:ready", _._handlers.refresh), _.dom.addEventListener("ln-data-store:created", _._handlers.refresh), _.dom.addEventListener("ln-data-store:updated", _._handlers.refresh), _.dom.addEventListener("ln-data-store:deleted", _._handlers.refresh), _.dom.addEventListener("ln-data-store:mutation-error", _._handlers.mutationError), _.dom.addEventListener("ln-data-store:synced", _._handlers.refreshSynced), _.dom.addEventListener("ln-data-store:query-changed", _._handlers.refreshQuery), _.dom.addEventListener("ln-search:change", _._handlers.searchChange), _.dom.addEventListener("ln-filter:change", _._handlers.filterChange), _.dom.addEventListener("ln-sort:change", _._handlers.sortChange);
  }
  b.prototype._owns = function(_) {
    return !!_ && _ === this._name;
  }, b.prototype._currentQuery = function() {
    const _ = this.dom.getAttribute(h), E = this.dom.getAttribute(r), C = new URLSearchParams(this.dom.getAttribute(m) || ""), q = {};
    for (const D of new Set(C.keys())) q[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(a) || "",
      filters: q,
      sort: _ && E ? { field: _, direction: E } : null
    };
  }, b.prototype._nextQueryGen = function(_) {
    const E = (this._queryGens.get(_) || 0) + 1;
    return this._queryGens.set(_, E), E;
  }, b.prototype._isCurrentGen = function(_, E) {
    return this._queryGens.get(_) === E;
  }, b.prototype._serveData = function(_, E) {
    const C = _.target, q = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(q);
    if (!D || !this._owns(D)) return;
    const I = _.detail || {}, R = Ur(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Bt(B, O.connector), Q = sn(R, P._currentQuery());
      if (z === "remote") {
        const V = P._nextQueryGen(C);
        L(C, "ln-" + E + ":set-loading", { loading: !0 }), L(O.connectorEl, g(O.connectorEl) + ":request-query", {
          query: Q,
          meta: { targetEl: C, kind: E, offset: Q.offset, limit: Q.limit, queryGen: V }
        });
        return;
      }
      if (z !== "store") {
        L(C, "ln-" + E + ":set-loading", { loading: !1 });
        return;
      }
      const Y = Qt(B, O.connector, z), X = Y ? P._nextQueryGen(C) : null;
      return Y && L(O.connectorEl, g(O.connectorEl) + ":request-query", {
        query: Q,
        meta: { targetEl: C, kind: E, offset: Q.offset, limit: Q.limit, queryGen: X }
      }), B.getAll(Q).then(function(V) {
        if (P._destroyed || !P._boundDelivered || Y && !P._isCurrentGen(C, X)) return;
        const G = {
          data: V.data,
          total: V.total,
          filtered: V.filtered,
          offset: I.offset !== void 0 ? I.offset : V.offset,
          queryGen: I.queryGen !== void 0 ? I.queryGen : V.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: Y || V.provisional === !0
        };
        L(C, "ln-" + E + ":set-data", G), P._boundDelivered.set(C, !0);
      });
    }).catch(function(z) {
      P._destroyed || (L(C, "ln-" + E + ":set-loading", { loading: !1 }), L(P.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: E,
        store: D,
        target: C,
        error: z
      }));
    });
  }, b.prototype._serveOptions = function(_) {
    const E = _.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const q = this.findChildren(), D = q.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Bt(D, q.connector);
      if (O === "remote") {
        const H = R._nextQueryGen(E);
        L(q.connectorEl, g(q.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: E, kind: "options", queryGen: H }
        });
        return;
      }
      if (O !== "store") return;
      const P = Qt(D, q.connector, O), B = P ? R._nextQueryGen(E) : null;
      return P && L(q.connectorEl, g(q.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: E, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(H) {
        R._destroyed || P && !R._isCurrentGen(E, B) || L(E, "ln-options:set-data", { data: H.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: E, kind: "options" });
    });
  }, b.prototype._serveStat = function(_) {
    const E = _.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const q = _.detail && _.detail.filters ? _.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = q && Object.keys(q).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), H = B ? "remote" : Bt(I, D.connector);
      if (H === "remote") {
        const Y = O._nextQueryGen(E);
        L(D.connectorEl, g(D.connectorEl) + ":request-query", {
          query: { filters: q },
          meta: { targetEl: E, kind: "stat", queryGen: Y }
        });
        return;
      }
      if (H !== "store") return;
      const z = !B && Qt(I, D.connector, H), Q = z ? O._nextQueryGen(E) : null;
      return z && L(D.connectorEl, g(D.connectorEl) + ":request-query", {
        query: { filters: q },
        meta: { targetEl: E, kind: "stat", queryGen: Q }
      }), I.count(q).then(function(Y) {
        O._destroyed || z && !O._isCurrentGen(E, Q) || L(E, "ln-stat:set-count", { count: Y });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: E, kind: "stat" });
    });
  }, b.prototype._refreshAll = function(_, E) {
    const C = this, q = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let D = 0; D < q.length; D++) {
      const I = q[D];
      let R, O;
      if (I.hasAttribute("data-ln-table-source") ? (R = I.getAttribute("data-ln-table-source"), O = "table") : I.hasAttribute("data-ln-list-source") ? (R = I.getAttribute("data-ln-list-source"), O = "list") : I.hasAttribute("data-ln-chart-source") ? (R = I.getAttribute("data-ln-chart-source"), O = "chart") : I.hasAttribute("data-ln-options") ? (R = I.getAttribute("data-ln-options"), O = "options") : I.hasAttribute("data-ln-stat") && (R = I.getAttribute("data-ln-stat"), O = "stat"), !C._owns(R)) continue;
      const P = C.findChildren(), B = P.store;
      if (O === "table" || O === "list") {
        const H = O === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (I.hasAttribute(H)) {
          L(I, "ln-" + O + (E ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (O === "table" || O === "list" || O === "chart") {
        const H = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = sn(H, C._currentQuery());
        if (Bt(B, P.connector) === "remote") {
          const X = C._nextQueryGen(I);
          L(I, "ln-" + O + ":set-loading", { loading: !0 }), L(P.connectorEl, g(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
          });
          continue;
        }
        const Q = Qt(B, P.connector, Bt(B, P.connector)), Y = Q ? C._nextQueryGen(I) : null;
        Q && L(P.connectorEl, g(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
        }), (function(X, V, G, ft) {
          B.getAll(z).then(function(yt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(X, ft)) return;
            const ae = {
              data: yt.data,
              total: _ && _.total !== void 0 ? _.total : yt.total,
              filtered: _ && _.filtered !== void 0 ? _.filtered : yt.filtered,
              offset: yt.offset !== void 0 ? yt.offset : _ && _.offset !== void 0 ? _.offset : H.offset,
              queryGen: yt.queryGen !== void 0 ? yt.queryGen : _ && _.queryGen !== void 0 ? _.queryGen : H.queryGen
            };
            L(X, "ln-" + V + ":set-loading", { loading: !1 }), L(X, "ln-" + V + ":set-data", ae), C._boundDelivered.set(X, !0);
          }).catch(function() {
          });
        })(I, O, Q, Y);
      } else if (O === "options")
        (function(H) {
          B.getAll({}).then(function(z) {
            C._destroyed || L(H, "ln-options:set-data", { data: z.data });
          }).catch(function() {
          });
        })(I);
      else if (O === "stat") {
        const H = I.getAttribute("data-ln-stat-filter");
        let z = null;
        if (H) {
          const Q = H.indexOf(":");
          if (Q !== -1) {
            const Y = H.slice(0, Q).trim(), X = H.slice(Q + 1).trim();
            Y && (z = {}, z[Y] = [X]);
          }
        }
        (function(Q, Y) {
          B.count(Y).then(function(X) {
            C._destroyed || L(Q, "ln-stat:set-count", { count: X });
          }).catch(function() {
          });
        })(I, z);
      }
    }
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const _ = this;
    _._handlers && (_.dom.removeEventListener("ln-data-store:request-remote-sync", _._handlers.sync), _.dom.removeEventListener("ln-data-store:request-page", _._handlers.requestPage), _.dom.removeEventListener("ln-data-coordinator:request-create", _._handlers.reqCreate), _.dom.removeEventListener("ln-data-coordinator:request-update", _._handlers.reqUpdate), _.dom.removeEventListener("ln-data-coordinator:request-delete", _._handlers.reqDelete), _.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", _._handlers.reqBulkDelete), _.dom.removeEventListener("ln-api-queue:send", _._handlers.queueSend), _.dom.removeEventListener("ln-api-queue:failed", _._handlers.queueFailed), _.dom.removeEventListener("ln-data-store:initialized", _._handlers.storeInitialized), document.removeEventListener("submit", _._handlers.formSubmit), s.forEach(function(E) {
      _.dom.removeEventListener(E + ":fetched", _._handlers.connFetched), _.dom.removeEventListener(E + ":created", _._handlers.connCreated), _.dom.removeEventListener(E + ":updated", _._handlers.connUpdated), _.dom.removeEventListener(E + ":deleted", _._handlers.connDeleted), _.dom.removeEventListener(E + ":bulk-deleted", _._handlers.connBulkDeleted), _.dom.removeEventListener(E + ":error", _._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", _._handlers.reqTableData), document.removeEventListener("ln-list:request-data", _._handlers.reqListData), document.removeEventListener("ln-chart:request-data", _._handlers.reqChartData), document.removeEventListener("ln-options:request-data", _._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", _._handlers.reqStat), _.dom.removeEventListener("ln-data-store:ready", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:created", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:updated", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:deleted", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:mutation-error", _._handlers.mutationError), _.dom.removeEventListener("ln-data-store:synced", _._handlers.refreshSynced), _.dom.removeEventListener("ln-data-store:query-changed", _._handlers.refreshQuery), _.dom.removeEventListener("ln-search:change", _._handlers.searchChange), _.dom.removeEventListener("ln-filter:change", _._handlers.filterChange), _.dom.removeEventListener("ln-sort:change", _._handlers.sortChange), _._handlers = null), _._boundQueries = null, _._boundDelivered = null, _._queryGens = null, _._queueQueryRefresh = null, _._mutationReceipts.close(new Error("Data coordinator destroyed")), _._mutationReceipts = null, p.delete(this), y(), delete this.dom[e];
  }, j(t, e, b, "ln-data-coordinator", {
    attributes: o
  });
})();
const zr = "ln_api_queue", Kr = 2, rt = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function Rt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function an(t) {
  return "seq:" + t;
}
function Xt(t) {
  return "paused:" + t;
}
function ln(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function jr(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function Vr(t, e, i, a) {
  const m = /* @__PURE__ */ new Map(), h = [], r = [];
  for (const l of t || [])
    m.has(l.chainKey) || m.set(l.chainKey, []), m.get(l.chainKey).push(l);
  return m.forEach((l, c) => {
    l.sort((o, u) => o.seq - u.seq);
    const n = l[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > a) {
        r.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > a) {
        r.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = a + i, n.updatedAt = a, h.push(n);
    }
  }), { entries: h, wakeups: r };
}
function Wr(t, e, i, a, m) {
  const h = [], r = [];
  for (const l of t || []) {
    if (l.entryId === e) {
      r.push(l.entryId);
      continue;
    }
    l.chainKey === i && (l.chainKey = a, l.targetId === i && (l.targetId = a), l.meta && l.meta.id === i && (l.meta.id = a), l.meta && typeof l.meta.action == "string" && (l.meta.action = jr(l.meta.action, i, a)), l.updatedAt = m, h.push(l));
  }
  return { changed: h, deleted: r };
}
class Gr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || zr, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const a = this.indexedDB.open(this.dbName, Kr);
      a.onupgradeneeded = (m) => {
        const h = m.target.result;
        let r;
        h.objectStoreNames.contains(rt) ? r = m.target.transaction.objectStore(rt) : r = h.createObjectStore(rt, { keyPath: "entryId" }), r.indexNames.contains("by_scope_chain") || r.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), r.indexNames.contains("by_scope_seq") || r.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(lt) || h.createObjectStore(lt, { keyPath: "key" });
      }, a.onerror = () => i(ut(a, "Queue database open failed")), a.onsuccess = (m) => {
        this._db = m.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const a = this.indexedDB.deleteDatabase(this.dbName);
      a.onsuccess = () => e(), a.onerror = () => i(ut(a, "Queue database delete failed")), a.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const r = i.transaction(rt, "readonly").objectStore(rt).index("by_scope_seq").getAll(Rt(this.keyRange, e));
      r.onsuccess = () => a(r.result || []), r.onerror = () => m(ut(r, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((a) => a ? new Promise((m, h) => {
      const r = a.transaction([lt, rt], "readwrite"), l = r.objectStore(lt), c = r.objectStore(rt), n = an(e);
      let o = null;
      const u = (w) => {
        const v = w + 1;
        o = {
          entryId: this.uuid(),
          scope: e,
          chainKey: i.chainKey,
          seq: v,
          op: i.op,
          targetId: i.targetId !== void 0 ? i.targetId : null,
          payload: i.payload,
          expectedVersion: i.expectedVersion !== void 0 ? i.expectedVersion : null,
          meta: i.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, l.put({ key: n, value: v }), c.put(o);
      }, p = l.get(n);
      p.onerror = () => h(ut(p, "Queue sequence read failed")), p.onsuccess = () => {
        const w = p.result;
        if (w && typeof w.value == "number") {
          u(w.value);
          return;
        }
        const v = c.index("by_scope_seq").getAll(Rt(this.keyRange, e));
        v.onerror = () => h(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, f) => Math.max(A, f.seq || 0), 0);
          u(S);
        };
      }, r.oncomplete = () => m(o), r.onerror = () => h(r.error || new Error("Queue enqueue transaction failed")), r.onabort = () => h(r.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, a) {
    return this.open().then((m) => m ? new Promise((h, r) => {
      const l = m.transaction(rt, "readwrite"), c = l.objectStore(rt), n = c.index("by_scope_seq").getAll(Rt(this.keyRange, e)), o = this.now();
      let u = { entries: [], wakeups: [] };
      n.onerror = () => r(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        u = Vr(n.result || [], i, a, o);
        for (const p of u.entries) c.put(p);
      }, l.oncomplete = () => h(u), l.onerror = () => r(l.error || new Error("Queue claim transaction failed")), l.onabort = () => r(l.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (a, m) => (m.delete(a.entryId), { status: "acked", entry: a }));
  }
  nack(e, i, a, m) {
    m = m || {};
    const h = m.maxAttempts || 8, r = m.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((l) => l ? new Promise((c, n) => {
      const o = l.transaction([rt, lt], "readwrite"), u = o.objectStore(rt), p = o.objectStore(lt), w = u.get(i);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (a === "drop") {
            u.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (ln(S), S.updatedAt = this.now(), a === "auth") {
            S.status = "pending", u.put(S), p.put({ key: Xt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (a === "retry") {
            if (S.attempts = (S.attempts || 0) + 1, S.attempts >= h) {
              S.status = "failed", S.nextAttemptAt = 0, u.put(S), v = { status: "failed", entry: S };
              return;
            }
            const A = r[Math.min(S.attempts - 1, r.length - 1)];
            S.status = "pending", S.nextAttemptAt = this.now() + A, u.put(S), v = { status: "retry", entry: S, delay: A };
          }
        }
      }, o.oncomplete = () => c(v), o.onerror = () => n(o.error || new Error("Queue nack transaction failed")), o.onabort = () => n(o.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, a) {
    return this._remapTransaction(e, null, i, a);
  }
  resolveCreate(e, i, a, m) {
    return this._remapTransaction(e, i, a, m);
  }
  _remapTransaction(e, i, a, m) {
    return this.open().then((h) => h ? new Promise((r, l) => {
      const c = h.transaction(rt, "readwrite"), n = c.objectStore(rt), o = n.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let u = { changed: [], deleted: [] };
      o.onerror = () => l(ut(o, "Queue remap read failed")), o.onsuccess = () => {
        u = Wr(o.result || [], i, a, m, this.now());
        for (const p of u.deleted) n.delete(p);
        for (const p of u.changed) n.put(p);
      }, c.oncomplete = () => r(u.changed), c.onerror = () => l(c.error || new Error("Queue remap transaction failed")), c.onabort = () => l(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const h = i.transaction(rt, "readwrite"), r = h.objectStore(rt), l = r.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let c = 0;
      l.onerror = () => m(ut(l, "Queue failed-entry read failed")), l.onsuccess = () => {
        for (const n of l.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), ln(n), r.put(n), c++);
      }, h.oncomplete = () => a(c), h.onerror = () => m(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => m(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const r = i.transaction(lt, "readonly").objectStore(lt).get(Xt(e));
      r.onsuccess = () => {
        const l = r.result ? r.result.value : !1;
        a(l || !1);
      }, r.onerror = () => m(ut(r, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((a) => {
      if (a)
        return new Promise((m, h) => {
          const r = a.transaction(lt, "readwrite"), l = typeof i == "string" ? i : i ? "manual" : !1;
          r.objectStore(lt).put({ key: Xt(e), value: l }), r.oncomplete = () => m(), r.onerror = () => h(r.error || new Error("Queue pause-state write failed")), r.onabort = () => h(r.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((a, m) => {
          const h = i.transaction([rt, lt], "readwrite"), l = h.objectStore(rt).index("by_scope_seq").openCursor(Rt(this.keyRange, e));
          l.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, l.onerror = () => m(ut(l, "Queue clear failed")), h.objectStore(lt).delete(an(e)), h.objectStore(lt).delete(Xt(e)), h.oncomplete = () => a(), h.onerror = () => m(h.error || new Error("Queue clear transaction failed")), h.onabort = () => m(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, a) {
    return this.open().then((m) => m ? new Promise((h, r) => {
      const l = m.transaction(rt, "readwrite"), c = l.objectStore(rt), n = c.get(i);
      let o = null;
      n.onerror = () => r(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const u = n.result;
        !u || u.scope !== e || (o = a(u, c));
      }, l.oncomplete = () => h(o), l.onerror = () => r(l.error || new Error("Queue entry transaction failed")), l.onabort = () => r(l.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], a = 8, m = 6e4;
  if (window[e] !== void 0) return;
  function h(o) {
    const u = o[e];
    u && u._drain();
  }
  const r = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: h, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  };
  function l() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (u) => {
        const p = Math.random() * 16 | 0;
        return (u === "x" ? p : p & 3 | 8).toString(16);
      });
    }
  }
  const c = new Gr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: l
  });
  function n(o) {
    this.dom = o, o[e] = this;
    const u = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (u ? u.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = l(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const p = this;
    return c.open().then((w) => w ? c.getPaused(p.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (p._paused = !!w, p._paused) {
        const v = typeof w == "string" ? w : "auth";
        L(p.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return p._emitPendingCount();
    }).then(() => p._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), L(p.dom, "ln-api-queue:error", { operation: "initialize", error: w });
    }), this;
  }
  n.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const o = this;
    return c.allForScope(o.scope).then((u) => (L(o.dom, "ln-api-queue:pending-count", { count: u.length, scope: o.scope }), u.length === 0 && L(o.dom, "ln-api-queue:drained", { scope: o.scope }), u));
  }, n.prototype._clearTimer = function(o) {
    const u = this._timers.get(o);
    u && (clearTimeout(u), this._timers.delete(o));
  }, n.prototype._scheduleTimer = function(o, u) {
    const p = Math.max(0, u), w = this._timers.get(o);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(o), v._drain();
    }, p);
    this._timers.set(o, S);
  }, n.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = c.claimReady(o.scope, o._workerId, m).then((u) => {
      for (const p of u.wakeups)
        o._scheduleTimer(p.chainKey, p.at - Date.now());
      for (const p of u.entries)
        o._clearTimer(p.chainKey), L(o.dom, "ln-api-queue:send", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          op: p.op,
          targetId: p.targetId,
          payload: p.payload,
          expectedVersion: p.expectedVersion,
          idempotencyKey: p.entryId,
          meta: p.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), L(o.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, n.prototype._onEnqueue = function(o) {
    const u = this;
    return c.enqueue(u.scope, o.detail || {}).then((p) => {
      if (p)
        return u._emitPendingCount().then((w) => (L(u.dom, "ln-api-queue:enqueued", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          count: w.length
        }), u._drain()));
    }).catch((p) => {
      L(u.dom, "ln-api-queue:error", { operation: "enqueue", error: p });
    });
  }, n.prototype._onAck = function(o) {
    const u = this, p = o.detail || {};
    return c.ack(u.scope, p.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((w) => {
      L(u.dom, "ln-api-queue:error", { operation: "ack", entryId: p.entryId, error: w });
    });
  }, n.prototype._onNack = function(o) {
    const u = this, p = o.detail || {};
    return c.nack(u.scope, p.entryId, p.reason, {
      maxAttempts: a,
      backoff: i
    }).then((w) => {
      if (w)
        return w.status === "failed" ? L(u.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? u._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (u._paused = !0, L(u.dom, "ln-api-queue:paused", { reason: "auth" }), L(u.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), u._emitPendingCount().then(() => {
          if (w.status === "dropped") return u._drain();
        });
    }).catch((w) => {
      L(u.dom, "ln-api-queue:error", { operation: "nack", entryId: p.entryId, error: w });
    });
  }, n.prototype._onRemap = function(o) {
    const u = this, p = o.detail || {};
    return c.remap(u.scope, p.oldKey, p.newId).catch((w) => {
      L(u.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(o) {
    const u = this, p = o.detail || {};
    return c.resolveCreate(u.scope, p.entryId, p.oldKey, p.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((w) => {
      L(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: p.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const o = this;
    return c.setPaused(o.scope, !1).then(() => (o._paused = !1, L(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "resume", error: u });
    });
  }, n.prototype._onPause = function() {
    const o = this;
    return c.setPaused(o.scope, "manual").then(() => {
      o._paused = !0, L(o.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "pause", error: u });
    });
  }, n.prototype._onDrain = function() {
    const o = this;
    return c.resetFailed(o.scope).then(() => {
      const u = o._drainPromise;
      return u ? u.then(() => o._drain()) : o._drain();
    }).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: u });
    });
  }, n.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((u) => clearTimeout(u)), o._timers.clear(), c.clear(o.scope).then(() => {
      o._paused = !1, L(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), L(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "clear", error: u });
    });
  }, n.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (u) => o._onEnqueue(u),
      ack: (u) => o._onAck(u),
      nack: (u) => o._onNack(u),
      remap: (u) => o._onRemap(u),
      resolveCreate: (u) => o._onResolveCreate(u),
      resume: () => o._onResume(),
      pause: () => o._onPause(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((u) => clearTimeout(u)), o._timers.clear(), L(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: r
  });
})();
function si(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Ot(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function $r(t, e, i) {
  const a = si(t);
  return a === null || a < 0 ? 0 : Math.min(a, Math.min(e, i) / 2);
}
function Qr(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Xr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Yr(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, a = e.xField || "label", m = e.yField || "value", h = e.includeZero !== !1, r = $r(e.padding, i.width, i.height), l = Array.isArray(t) ? t : [], c = [];
  for (let s = 0; s < l.length; s++) {
    const g = l[s] || {}, b = si(g[m]);
    b !== null && c.push({
      record: g,
      sourceIndex: s,
      label: g[a] == null ? String(s + 1) : String(g[a]),
      value: b
    });
  }
  if (c.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: i.y + i.height - r
    };
  let n = c[0].value, o = c[0].value;
  for (let s = 1; s < c.length; s++)
    c[s].value < n && (n = c[s].value), c[s].value > o && (o = c[s].value);
  let u = n, p = o;
  h && (u = Math.min(0, u), p = Math.max(0, p)), u === p && (p === 0 ? p = 1 : p > 0 ? u = 0 : p = 0);
  const w = Math.max(1, i.width - r * 2), v = Math.max(1, i.height - r * 2), S = p - u, A = i.y + i.height - r - (0 - u) / S * v, f = [];
  for (let s = 0; s < c.length; s++) {
    const g = c[s], b = c.length === 1 ? 0.5 : s / (c.length - 1), T = i.x + r + b * w, _ = i.y + i.height - r - (g.value - u) / S * v;
    f.push({
      record: g.record,
      sourceIndex: g.sourceIndex,
      label: g.label,
      value: g.value,
      x: T,
      y: _,
      pointString: Ot(T) + "," + Ot(_)
    });
  }
  const y = f.map((s) => s.pointString).join(" ");
  let d = "";
  if (f.length > 0) {
    const s = f[0], g = f[f.length - 1], b = Ot(s.x) + "," + Ot(A), T = Ot(g.x) + "," + Ot(A);
    d = b + " " + y + " " + T;
  }
  return {
    points: f,
    linePoints: y,
    areaPoints: d,
    count: f.length,
    min: n,
    max: o,
    domainMin: u,
    domainMax: p,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function a(n) {
    const o = n[e];
    o && o.requestData();
  }
  function m(n) {
    const o = n[e];
    o && o._render();
  }
  const h = {
    "data-ln-chart": { prop: "name", type: "string", read: $, fallback: "", effect: m, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: a, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: a, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: m, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: m, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: m, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: m, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: m, description: "Forces Y axis scale to start at zero" }
  }, r = et(h);
  function l(n, o) {
    n && (n.textContent = o);
  }
  function c(n) {
    this.dom = n, tt(this, n, r), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const o = this;
    return this._onSetData = function(u) {
      const p = u.detail || {};
      o._data = Array.isArray(p.data) ? p.data : [], o.isLoaded = !0, o._setLoading(!1), o._render();
    }, this._onSetLoading = function(u) {
      o._setLoading(!!(u.detail && u.detail.loading));
    }, this._onRefresh = function() {
      o.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  c.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), o = n === null ? NaN : Number(n), u = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(o) && o >= 0 ? o : 16,
      type: u === "area" || u === "polygon" ? "area" : "line",
      viewBox: this.plot && Qr(this.plot.getAttribute("viewBox")) || i
    };
  }, c.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, c.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const o = this.name + "-label", u = '[data-ln-template="' + o + '"]';
    if (!this.dom.querySelector(u) && !document.querySelector(u)) return;
    const p = Ct(this.dom, o, "ln-chart");
    if (!p) return;
    const w = it(this.dom);
    for (const v of n.points) {
      const S = p.cloneNode(!0);
      Vt(S, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(S);
    }
  }, c.prototype._render = function() {
    const n = this._readOptions(), o = Yr(this._data, n);
    this.model = o, this.line && (this.line.setAttribute("points", o.linePoints), this.line.toggleAttribute("hidden", o.count === 0)), this.area && (this.area.setAttribute("points", o.areaPoints), this.area.toggleAttribute("hidden", o.count === 0 || n.type !== "area"));
    const u = o.count === 0;
    this.dom.classList.toggle("ln-chart--empty", u), this.empty && this.empty.toggleAttribute("hidden", !u);
    const p = it(this.dom);
    l(this.minimum, ct(o.min, p)), l(this.maximum, ct(o.max, p)), l(this.count, ct(o.count, p)), this._renderLabels(o), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: o.count,
      min: o.min,
      max: o.max
    });
  }, c.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Xr(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, j(t, e, c, "ln-chart", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-options": { prop: "_storeName", type: "string", read: $, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: $, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: $, fallback: "name", description: "Field name used for option visible label text" }
  }, a = et(i);
  function m(h) {
    this.dom = h, tt(this, h, a);
    const r = this;
    return this._onSetData = function(l) {
      r._rebuild(l.detail.data || []);
    }, h.addEventListener("ln-options:set-data", this._onSetData), L(h, "ln-options:request-data", { options: this._storeName }), this;
  }
  m.prototype._rebuild = function(h) {
    const r = this.dom, l = this._valueField, c = this._labelField, n = r.value, o = r.querySelectorAll("option");
    for (let p = o.length - 1; p >= 0; p--)
      o[p].value !== "" && r.removeChild(o[p]);
    for (let p = 0; p < h.length; p++) {
      const w = h[p], v = document.createElement("option");
      v.value = String(w[l]), v.textContent = w[c] != null ? w[c] : "", r.appendChild(v);
    }
    const u = r.options;
    for (let p = 0; p < u.length; p++)
      if (u[p].value === n) {
        r.value = n;
        break;
      }
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, m, "ln-options", {
    attributes: i
  });
})();
function Jr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), a = t.slice(e + 1).trim();
  if (!i) return null;
  const m = {};
  return m[i] = [a], m;
}
function Zr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: $, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: $, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, a = et(i);
  function m(h) {
    return this.dom = h, tt(this, h, a), this._onSetCount = function(r) {
      h.textContent = Zr(r.detail && r.detail.count), h.classList.remove("is-loading");
    }, h.addEventListener("ln-stat:set-count", this._onSetCount), L(h, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Jr(this._filterRaw)
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, m, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", a = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let h = null;
  const r = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", n = "lni:v", o = "1";
  function u() {
    try {
      if (localStorage.getItem(n) !== o) {
        for (let y = localStorage.length - 1; y >= 0; y--) {
          const d = localStorage.key(y);
          d && d.indexOf(c) === 0 && localStorage.removeItem(d);
        }
        localStorage.setItem(n, o);
      }
    } catch {
    }
  }
  u();
  function p() {
    return h || (h = document.getElementById(t), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = t, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function w(y) {
    return y.indexOf(i) === 0 ? l + "/" + y.slice(i.length) + ".svg" : r + "/" + y.slice(e.length) + ".svg";
  }
  function v(y, d) {
    const s = d.match(/viewBox="([^"]+)"/), g = s ? s[1] : "0 0 24 24", b = d.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = b ? b[1].trim() : "", _ = d.match(/<svg([^>]*)>/i), E = _ ? _[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = y, C.setAttribute("viewBox", g), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = E.match(new RegExp(q + '="([^"]*)"'));
      D && C.setAttribute(q, D[1]);
    }), C.innerHTML = T, p().querySelector("defs").appendChild(C);
  }
  function S(y) {
    if (a.has(y) || m.has(y)) return;
    if (y.indexOf(i) === 0 && !l) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", y);
      return;
    }
    const d = y.slice(1);
    try {
      const g = localStorage.getItem(c + d);
      if (g) {
        v(d, g), a.add(y);
        return;
      }
    } catch {
    }
    m.add(y);
    const s = w(y);
    fetch(s).then(function(g) {
      if (!g.ok) throw new Error(g.status);
      return g.text();
    }).then(function(g) {
      v(d, g), a.add(y), m.delete(y);
      try {
        localStorage.setItem(c + d, g);
      } catch {
      }
    }).catch(function(g) {
      console.error("[ln-icon] Fetch failed for:", d, g), m.delete(y);
    });
  }
  function A(y) {
    const d = 'use[href^="' + e + '"], use[href^="' + i + '"]', s = y.querySelectorAll ? y.querySelectorAll(d) : [];
    if (y.matches && y.matches(d)) {
      const g = y.getAttribute("href");
      g && S(g);
    }
    Array.prototype.forEach.call(s, function(g) {
      const b = g.getAttribute("href");
      b && S(b);
    });
  }
  function f() {
    A(document), new MutationObserver(function(y) {
      y.forEach(function(d) {
        if (d.type === "childList")
          d.addedNodes.forEach(function(s) {
            s.nodeType === 1 && A(s);
          });
        else if (d.type === "attributes" && d.attributeName === "href") {
          const s = d.target.getAttribute("href");
          s && (s.indexOf(e) === 0 || s.indexOf(i) === 0) && S(s);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
const Me = /* @__PURE__ */ new Set([
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
  "data-ln-websocket-connector"
]);
function to(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let a = 0; a <= e.length; a++) i[a] = [a];
  for (let a = 0; a <= t.length; a++) i[0][a] = a;
  for (let a = 1; a <= e.length; a++)
    for (let m = 1; m <= t.length; m++)
      e.charAt(a - 1) === t.charAt(m - 1) ? i[a][m] = i[a - 1][m - 1] : i[a][m] = Math.min(
        i[a - 1][m - 1] + 1,
        i[a][m - 1] + 1,
        i[a - 1][m] + 1
      );
  return i[e.length][t.length];
}
function eo(t, e = Me) {
  if (e.has(t)) return null;
  let i = null, a = 1 / 0;
  for (const h of e) {
    const r = to(t, h);
    r < a && (a = r, i = h);
  }
  const m = Math.max(3, Math.floor(t.length * 0.4));
  return a <= m ? i : null;
}
function ai(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function no(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            a.push({
              type: "id-empty",
              element: r,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + ai(n)) || a.push({
            type: "id-unresolved",
            element: r,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function io(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const o = (c.value || "").trim();
          if (!o) {
            a.push({
              type: "store-empty",
              element: r,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const u = ai(o), p = e.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(o);
          !p && !w && a.push({
            type: "store-unresolved",
            element: r,
            attribute: c.name,
            storeName: o,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${c.name}="${o}"> targets store "${o}", but no [data-ln-data-store="${o}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function ro(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], a = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && a.unshift(e);
  const m = /* @__PURE__ */ new Map();
  for (let h = 0; h < a.length; h++) {
    const r = a[h], l = (r.getAttribute("data-ln-data-store") || "").trim();
    l && (m.has(l) || m.set(l, []), m.get(l).push(r));
  }
  for (const [h, r] of m.entries())
    r.length > 1 && i.push({
      type: "store-duplicate",
      storeName: h,
      elements: r,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${h}". Store names must be unique across the document.`
    });
  return i;
}
function oo(t = document, e = Me) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = eo(c.name, e), o = n ? ` Did you mean "${n}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: r,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${r.tagName.toLowerCase()}>.${o}`
          });
        }
      }
  }
  return a;
}
function Ce(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Me, a = no(t), m = io(t), h = ro(t), r = oo(t, i), l = [
    ...a,
    ...m,
    ...h,
    ...r
  ];
  if (!e.silent)
    for (let c = 0; c < l.length; c++)
      console.warn(l[c].message);
  return {
    idIssues: a,
    storeIssues: m,
    uniquenessIssues: h,
    spellingIssues: r,
    total: l.length
  };
}
let Ut = null;
function Yt(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Ut && (clearTimeout(Ut), Ut = null);
  function a() {
    Ut = setTimeout(() => {
      Ut = null;
      const m = Ce(t);
      i && i(m);
    }, e);
  }
  bn() > 0 ? mt(a) : a();
}
function so(t, e, i, a) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", a), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let qt = [];
function ao() {
  qt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && qt.push(document.body);
}
function li(t) {
  if (t === window || t === document)
    return qt.indexOf(document.body) !== -1;
  for (let e = 0; e < qt.length; e++)
    if (qt[e].contains(t)) return !0;
  return !1;
}
function lo(t, e, i, a) {
  li(i) && so(t, e, i, a);
}
function Te() {
  ao(), Ci(qt.length > 0 ? lo : null, qt.length > 0 ? li : null);
}
function cn() {
  Te();
}
function co() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Te(), Wt(["data-ln-debug"], Te);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  co();
  function a(h) {
    return this.dom = h, Yt(h.ownerDocument || document), cn(), this;
  }
  a.prototype.verify = function(h, r) {
    return Ce(h || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, a.prototype.destroy = function() {
    delete this.dom[e], cn();
  };
  const m = j(t, e, a, "ln-debug", {
    attributes: i,
    onInit: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    },
    onSubtreeChange: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    }
  });
  m.verify = function(h, r) {
    return Ce(h || document, r);
  }, m.schedule = function(h, r, l) {
    return Yt(h || document, r, l);
  };
})();
