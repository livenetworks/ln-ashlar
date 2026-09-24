function $(t, e, i) {
  const s = t.getAttribute(e);
  return s === null ? i : s;
}
function xt(t, e, i) {
  const s = parseInt(t.getAttribute(e), 10);
  return isNaN(s) ? i : s;
}
function It(t, e, i = !1) {
  const s = t.getAttribute(e);
  if (s === null) return !!i;
  const p = s.trim().toLowerCase();
  return !(p === "false" || p === "0");
}
function dn(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const de = /* @__PURE__ */ new Map();
function vi(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (de.has(i)) return de.get(i);
  const s = new Set(t || []), p = function(h, r) {
    const l = h.getAttribute(r);
    return l !== null && s.has(l) ? l : e;
  };
  return de.set(i, p), p;
}
function wi(t, e, i) {
  const s = parseFloat(t.getAttribute(e));
  return isNaN(s) ? i : s;
}
function Ei(t, e, i) {
  const s = t.getAttribute(e);
  if (!s) return i;
  try {
    return JSON.parse(s);
  } catch {
    return i;
  }
}
function un(t, e, i, s, p) {
  if (!t || e === null) return !0;
  const h = s || "ln-component", r = t.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || e === "" && t.fallback !== void 0)
    return !0;
  const l = (c) => {
    p ? console.warn(c, p) : console.warn(c);
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
  for (const s in i) {
    const [p, h, r] = i[s];
    Object.defineProperty(t, s, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return p(e, h, r);
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
    const s = t[i];
    if (!s || !s.prop) continue;
    let p = s.read;
    if (!p && s.type)
      switch (s.type) {
        case "enum":
          p = vi(s.values, s.fallback);
          break;
        case "integer":
          p = xt;
          break;
        case "float":
          p = wi;
          break;
        case "boolean":
          p = It;
          break;
        case "list":
          p = dn;
          break;
        case "json":
          p = Ei;
          break;
        case "string":
        default:
          p = $;
          break;
      }
    p || (p = $), e[s.prop] = [p, i, s.fallback];
  }
  return e;
}
function Ai(t) {
  const e = {};
  for (const i in t) {
    const s = t[i];
    s && s.effect && (e[i] = s.effect);
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
    const s = t[i];
    if (!(s === "" || s == null) && (e = !0, !Number.isFinite(Number(s))))
      return "string";
  }
  return e ? "number" : "string";
}
function Le(t, e, i, s) {
  if (i === "number") {
    const r = parseFloat(t), l = parseFloat(e);
    return (isNaN(r) ? 0 : r) - (isNaN(l) ? 0 : l);
  }
  const p = t != null ? String(t) : "", h = e != null ? String(e) : "";
  return s ? s.compare(p, h) : p < h ? -1 : p > h ? 1 : 0;
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
      let s = null;
      for (let p = 1; p < e.length; p++)
        if (e[p] && e[p].nodeType === 1) {
          s = e[p];
          break;
        }
      if (!qe(s))
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
  const s = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, s), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: s
  }));
}
function Z(t, e, i) {
  const s = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, s);
  const p = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: s
  });
  return t.dispatchEvent(p), p;
}
function hn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const s = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  s[i] = t.name, L(t.dom, e, s);
}
function pt(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < i.length; r++) {
    const l = i[r], c = l.getAttribute("data-ln-field");
    e[c] != null && (l.textContent = e[c]);
  }
  const s = t.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < s.length; r++) {
    const l = s[r], c = l.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const u = o[0].trim(), m = o[1].trim();
      e[m] != null && l.setAttribute(u, e[m]);
    }
  }
  const p = t.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < p.length; r++) {
    const l = p[r], c = l.getAttribute("data-ln-show");
    c in e && l.classList.toggle("hidden", !e[c]);
  }
  const h = t.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < h.length; r++) {
    const l = h[r], c = l.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const u = o[0].trim(), m = o[1].trim();
      m in e && l.classList.toggle(u, !!e[m]);
    }
  }
  return t;
}
function ki(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let s = 0; s < i.length; s++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[s], e ?? null), i[s].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
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
function jt(t, e) {
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
  const s = function(h, r) {
    return e[r] !== void 0 ? e[r] : "";
  }, p = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && p.push(t);
  for (let h = 0; h < p.length; h++) {
    const r = p[h], l = r.attributes;
    for (let c = 0; c < l.length; c++) {
      const n = l[c];
      n.value.indexOf("{{") !== -1 && r.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, s));
    }
  }
  return t;
}
function Li(t, e, i, s, p, h) {
  const r = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], o = n.getAttribute("data-ln-render-key");
    o && (r[o] = n);
  }
  const l = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], o = String(s(n));
    let u = r[o];
    if (u)
      p(u, n, c);
    else {
      const m = Jt(i, h);
      if (!m || (jt(m, n), u = m.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-render-key", o), p(u, n, c);
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
    const s = t.querySelector('[data-ln-template="' + e + '"]');
    if (s) return s.content.cloneNode(!0);
  }
  return Jt(e, i);
}
function ie(t, e) {
  const i = {}, s = t.querySelectorAll("[" + e + "]");
  for (let p = 0; p < s.length; p++)
    i[s[p].getAttribute(e)] = s[p].textContent, s[p].remove();
  return i;
}
function xe(t, e, i, s) {
  if (t.nodeType !== 1) return;
  const h = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", r = Array.from(t.querySelectorAll(h));
  t.matches && t.matches(h) && r.push(t);
  for (const l of r)
    l[i] || (window.lnCore._persistSink && l.hasAttribute("data-ln-persist") && window.lnCore._persistSink(l, e), l[i] = new s(l));
}
function Ht(t) {
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
  return !t || !document.contains(t) || mn(t) || e && typeof t[e] != "function" ? !1 : Ht(t);
}
function Ii(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function gn(t, e) {
  const i = !!(e && e.typed), s = e && e.exclude, p = {}, h = t.elements, r = {};
  if (i)
    for (let l = 0; l < h.length; l++) {
      const c = h[l];
      c.name && c.type === "checkbox" && !c.disabled && (r[c.name] = (r[c.name] || 0) + 1);
    }
  for (let l = 0; l < h.length; l++) {
    const c = h[l];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(s && c.matches && c.matches(s)))
      if (c.type === "checkbox")
        i && r[c.name] === 1 ? p[c.name] = c.checked : (p[c.name] || (p[c.name] = []), c.checked && p[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (p[c.name] = c.value);
      else if (c.type === "select-multiple") {
        p[c.name] = [];
        for (let n = 0; n < c.options.length; n++)
          c.options[n].selected && p[c.name].push(c.options[n].value);
      } else if (i && c.type === "hidden")
        p[c.name] = c.value;
      else if (i && (c.type === "number" || c.type === "range")) {
        const n = Number(c.value);
        p[c.name] = c.value === "" || isNaN(n) ? null : n;
      } else
        p[c.name] = c.value;
  }
  return p;
}
function Di(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function _n(t, e) {
  const i = t.elements, s = [], p = {};
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    r.name && r.type === "checkbox" && (p[r.name] = (p[r.name] || 0) + 1);
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
      else if (p[r.name] > 1) {
        const n = String(c).split(",").map(function(o) {
          return o.trim();
        });
        r.checked = n.indexOf(r.value) !== -1;
      } else
        r.checked = Di(c);
      s.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(c), s.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < r.options.length; n++)
          r.options[n].selected = c.indexOf(r.options[n].value) !== -1;
      s.push(r);
    } else
      r.value = c, s.push(r);
  }
  return s;
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
  const s = i.trim().toLowerCase();
  return s.indexOf("-") === -1 && Be[s] ? Be[s] : i;
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
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function yn(t, e, { get: i, set: s }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(p) {
      s ? s.call(this, p, (h) => e.set.call(this, h)) : e.set.call(this, p);
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
  for (let s = 0; s < i.length; s++) {
    const p = i[s];
    e.byAttr.has(p) || e.byAttr.set(p, []), e.byAttr.get(p).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const s in t.attributes) {
      e.byDeclaredAttr.has(s) || e.byDeclaredAttr.set(s, []);
      const p = e.byDeclaredAttr.get(s);
      p.some((h) => h.componentTag === t.componentTag) || p.push({
        spec: t.attributes[s],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const s = Si(t);
    if (s === null)
      e.reactiveWildcard.push(t);
    else
      for (const p of s)
        e.byReactive.has(p) || e.byReactive.set(p, []), e.byReactive.get(p).push(t);
  }
  t.persist && e.persist.push(t);
}
function Ue(t, e, i, s) {
  for (let p = 0; p < t.length; p++) {
    const h = t[p];
    if (!e[h.attribute]) continue;
    const r = h.effects && h.effects[i];
    r ? r(e, i, s) : h.onAttrChange && (!h.declared || h.declared.has(i)) && h.onAttrChange(e, i, s);
  }
}
function Oi(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const s = vn(), p = s.byAttr.get(i);
  if (fn() && s.byDeclaredAttr && s.byDeclaredAttr.has(i) && qe(e)) {
    const h = s.byDeclaredAttr.get(i), r = e.getAttribute(i);
    for (let l = 0; l < h.length; l++)
      un(h[l].spec, r, i, h[l].componentTag, e);
  }
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || p) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const h = s.byReactive.get(i);
    h && Ue(h, e, i, t.oldValue), s.reactiveWildcard.length && Ue(s.reactiveWildcard, e, i, t.oldValue);
  }
  if (p)
    for (let h = 0; h < p.length; h++) {
      const r = p[h];
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
        const s = e[i];
        if (s.onSubtreeChange) {
          const p = s.query, h = t.target.nodeType === 1 ? t.target.matches(p) ? t.target : t.target.closest(p) : t.target.parentElement ? t.target.parentElement.closest(p) : null;
          h && s.onSubtreeChange(h, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const s = t.addedNodes[i];
      if (s.nodeType === 1)
        for (let p = 0; p < e.length; p++) {
          const h = e[p];
          xe(s, h.selector, h.attribute, h.ComponentFn), h.onInit && h.onInit(s);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const s = t.removedNodes[i];
      if (s.nodeType === 1)
        for (let p = 0; p < e.length; p++) {
          const h = e[p], r = h.query, l = Array.from(s.querySelectorAll(r));
          s.matches && s.matches(r) && l.push(s);
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
        const s = e[i];
        s.type === "childList" && Mi(s);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Vt(t, e) {
  wn({ observed: t, handler: e }), En();
}
function j(t, e, i, s, p = {}) {
  const h = p.extraAttributes || [], r = p.onAttributeChange || null, l = p.onSubtreeChange || null, c = p.onInit || null, n = p.onAttrChange || null, o = p.effects || null, u = p.attributes || null, m = u ? Ai(u) : o, w = u ? new Set(Object.keys(u)) : null, v = p.persist || null;
  function S(a) {
    const g = a || document.body;
    if (xe(g, t, e, i), u && fn())
      for (const b in u) {
        const T = u[b], y = Array.from(g.querySelectorAll("[" + b + "]"));
        g.matches && g.matches("[" + b + "]") && y.push(g);
        for (let E = 0; E < y.length; E++) {
          const C = y[E];
          qe(C) && un(T, C.getAttribute(b), b, s, C);
        }
      }
    c && c(g);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const a = /\[([\w-]+)/g;
    let g;
    for (; (g = a.exec(t)) !== null; )
      A.push(g[1]);
  } else
    A.push(t);
  wn({
    selector: t,
    attribute: e,
    componentTag: s,
    attributes: u,
    ComponentFn: i,
    onInit: c,
    observed: A.concat(h),
    onAttributeChange: r,
    onAttrChange: n,
    effects: m,
    declared: w,
    persist: v
  }), En();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  An().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: c,
    onSubtreeChange: l,
    query: _
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
function Nt(t, e) {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Fi, window.lnCore.getDataMapper = Pi, window.lnCore.registerLocaleFallback = Ie, window.lnCore.getLocaleFallback = Lt, window.lnCore.fillTemplate = jt, window.lnCore.fill = pt, window.lnCore.lnFill = ki, window.lnCore.renderList = Li, window.lnCore.ensureLocaleObserver = re);
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
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, s = t.threshold != null ? t.threshold : 25, p = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const h = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, r = typeof t.onChange == "function" ? t.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let o = 0, u = 0, m = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, f = !1;
  function _(b) {
    c.set(b, ++S);
  }
  function d() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function a() {
    if (l.size <= e) return;
    const b = Array.from(l.keys()).sort(function(y, E) {
      return (c.get(y) || 0) - (c.get(E) || 0);
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
      return m;
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
        l.has(I) && _(I);
      if (o <= 0) return;
      const y = Math.max(0, b - s), E = Math.min(o, T + s), C = Math.floor(y / i), q = Math.floor(Math.max(0, E - 1) / i);
      let D = -1;
      for (let I = C; I <= q; I++) {
        const R = I * i, O = Math.min(i, o - R);
        let P = !1;
        const B = Math.max(R, y), H = Math.min(R + O, E);
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
      }, p));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== m) return !1;
      const T = b.offset || 0, y = b.data || [];
      let E = 0;
      for (let C = 0; C < y.length; C++)
        y[C] != null && E++;
      if (E === 0 && (b.provisional || b.filtered > 0))
        return n.delete(T), !1;
      f && (l.clear(), c.clear(), f = !1), b.provisional || (u = b.total != null ? b.total : u, o = b.filtered != null ? b.filtered : b.data ? b.data.length : o);
      for (let C = 0; C < y.length; C++)
        y[C] != null && (l.set(T + C, y[C]), _(T + C));
      return n.delete(T), a(), r(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (w = b), g(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(b) {
      m++, n.clear(), clearTimeout(v), b && (w = b), f = !0, g(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      m++, n.clear(), clearTimeout(v), f = !0;
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
        const y = b.windowSize < e;
        e = b.windowSize, y && a(), T = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (i = b.pageSize), b.threshold != null && b.threshold >= 0 && (s = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (p = b.fetchDebounce), T && r();
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
  const e = t === void 0 ? location.hash : t, i = {}, s = qn(e);
  if (!s) return i;
  const p = s.split("&");
  for (let h = 0; h < p.length; h++) {
    const r = p[h];
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
function ot(t) {
  if (!t) return null;
  const e = se();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const i = se();
  e == null ? delete i[t] : i[t] = String(e);
  const p = Object.keys(i).map(function(h) {
    const r = i[h];
    return r === "" ? h : h + ":" + encodeURIComponent(r);
  }).join("&");
  qn(location.hash) !== p && (location.hash = p);
}
function De(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const s = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return s ? e ? s + "-" + e : s : e || null;
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
  const i = t.slice(0, e), s = t.slice(e + 1), p = s ? s.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: i, values: p };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = De, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = xn, window.lnCore.hashSortDecode = ye, window.lnCore.hashFilterEncode = In, window.lnCore.hashFilterDecode = be);
function Zt(t, e, i, s) {
  const p = typeof s == "number" ? s : 4, h = window.innerWidth, r = window.innerHeight, l = e.width, c = e.height, n = (i || "bottom").split("-"), o = n[0], u = n[1] === "start" || n[1] === "end" ? n[1] : "center", m = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = m[o] || m.bottom;
  function v(d) {
    return d === "top" || d === "bottom" ? u === "start" ? t.left : u === "end" ? t.right - l : t.left + (t.width - l) / 2 : u === "start" ? t.top : u === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(d) {
    let a, g, b = !0;
    return d === "top" ? (a = t.top - p - c, g = v(d), a < 0 && (b = !1)) : d === "bottom" ? (a = t.bottom + p, g = v(d), a + c > r && (b = !1)) : d === "left" ? (a = v(d), g = t.left - p - l, g < 0 && (b = !1)) : (a = v(d), g = t.right + p, g + l > h && (b = !1)), { top: a, left: g, side: d, fits: b };
  }
  let A = null;
  for (let d = 0; d < w.length; d++) {
    const a = S(w[d]);
    if (a.fits) {
      A = a;
      break;
    }
  }
  A || (A = S(w[0]));
  let f = A.top, _ = A.left;
  return l >= h ? _ = 0 : (_ < 0 && (_ = 0), _ + l > h && (_ = h - l)), c >= r ? f = 0 : (f < 0 && (f = 0), f + c > r && (f = r - c)), { top: f, left: _, placement: A.side };
}
function ve(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, s = e.display, p = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const h = t.offsetWidth, r = t.offsetHeight;
  return e.visibility = i, e.display = s, e.position = p, { width: h, height: r };
}
let zt = null;
const Bi = "ln-ashlar:storage-salt:v1", He = 32768;
function ze(t) {
  let e = "";
  const i = t.byteLength;
  for (let s = 0; s < i; s += He)
    e += String.fromCharCode.apply(
      null,
      t.subarray(s, Math.min(s + He, i))
    );
  return btoa(e);
}
function Ke(t) {
  const e = atob(t), i = e.length, s = new Uint8Array(i);
  for (let p = 0; p < i; p++)
    s[p] = e.charCodeAt(p);
  return s;
}
function Dn(t, e) {
  let i = zt, s = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (s = t, typeof CryptoKey < "u" && s.key instanceof CryptoKey && (i = s.key)), { key: i, options: s };
}
async function Ui(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", s = new TextEncoder();
  if (i === "sha256") {
    const c = await crypto.subtle.digest("SHA-256", s.encode(t));
    return crypto.subtle.importKey(
      "raw",
      c,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const p = e.salt || Bi, h = typeof p == "string" ? s.encode(p) : p, r = e.iterations || 1e5, l = await crypto.subtle.importKey(
    "raw",
    s.encode(t),
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
    zt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    zt = await Ui(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), zt = null, i;
  }
}
function At() {
  return zt;
}
async function Hi(t, e, i) {
  const { key: s } = Dn(e);
  if (t == null)
    return t;
  if (!s)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const p = new TextEncoder(), h = crypto.getRandomValues(new Uint8Array(12)), r = typeof t == "string" ? t : JSON.stringify(t), l = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: h },
      s,
      p.encode(r)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: ze(h),
      data: ze(new Uint8Array(l))
    };
  } catch (p) {
    throw console.error("[ln-core/crypto] Encryption failed:", p), new Error("[ln-crypto] Encryption failed: " + (p && p.message ? p.message : String(p)));
  }
}
async function zi(t, e, i) {
  const { key: s, options: p } = Dn(e), h = p.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!s) {
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
      s,
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
  const s = parseFloat(String(t)) || 0, p = parseFloat(String(e)) || 100, h = parseFloat(String(i)) || 0, r = Math.max(h, Math.min(s, p)), l = p - h;
  let c = 0;
  return l > 0 && (c = (r - h) / l * 100), c = Math.max(0, Math.min(100, c)), {
    value: s,
    min: h,
    max: p,
    clampedValue: r,
    percentage: c
  };
}
function st(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const i = e < 1e11 ? e * 1e3 : e, s = new Date(i);
    return isNaN(s.getTime()) ? null : s;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const s = new Date(i);
    return isNaN(s.getTime()) ? null : s;
  }
  return null;
}
function Ft(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + s;
}
const bt = {};
function te(t) {
  const e = t || "default";
  if (!bt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), s = i.formatToParts(1234.5);
    let p = "", h = ".";
    for (let r = 0; r < s.length; r++)
      s[r].type === "group" && (p = s[r].value), s[r].type === "decimal" && (h = s[r].value);
    bt[e] = { groupSep: p, decimalSep: h, fmt: i };
  }
  return bt[e];
}
function On(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let s = t.trim();
  return s === "" ? "" : (s = s.replace(/[$€£¥]/g, ""), e && (s = s.split(e).join("")), s = s.replace(/\s/g, ""), i && i !== "." && (s = s.replace(i, ".")), s = s.replace(/[^\d.-]/g, ""), s);
}
function Ki(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const s = te(e), p = On(i, s.groupSep, s.decimalSep);
  if (p === "" || p === "-") return NaN;
  const h = parseFloat(p);
  return isNaN(h) ? NaN : h;
}
function ct(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const s = e || "default", p = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, h = i.userDecimals != null ? i.userDecimals : null;
  if (p !== null) {
    const r = s + "|max:" + p;
    return bt[r] || (bt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: p
    })), bt[r].format(t);
  }
  if (h !== null && h > 0) {
    const r = s + "|exact:" + h;
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
  for (let s = 0; s < e.length; s++)
    if (i.indexOf(e[s]) === -1) return !1;
  return !0;
}
function Vi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Re(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let s = 0; s < e.length; s++)
    if (String(e[s]).trim().toLowerCase() === i)
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
  function s(r, l) {
    l = l || {};
    const c = Wi(r), n = Gi(r, l), o = $i(c, n);
    Qi(n) && e.has(o) && (e.get(o).abort(), e.delete(o));
    const u = new AbortController(), m = l.signal;
    let w = null;
    m && (m.aborted ? u.abort(m.reason) : (w = function() {
      u.abort(m.reason);
    }, m.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, l, { signal: u.signal });
    return e.set(o, u), t(r, v).finally(function() {
      m && w && m.removeEventListener("abort", w), e.get(o) === u && e.delete(o);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function p(r) {
    if (!r.detail || !r.detail.url) return;
    const l = r.target, c = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), n = r.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const o = new AbortController(), u = r.detail.signal;
    let m = null;
    u && (u.aborted ? o.abort(u.reason) : (m = function() {
      o.abort(u.reason);
    }, u.addEventListener("abort", m, { once: !0 }))), n && i.set(n, o);
    const w = { method: c, signal: o.signal };
    r.detail.body !== void 0 && (w.body = r.detail.body), window.fetch(r.detail.url, w).then(function(v) {
      u && m && u.removeEventListener("abort", m), n && i.get(n) === o && i.delete(n), L(l, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      u && m && u.removeEventListener("abort", m), n && i.get(n) === o && i.delete(n), !(v && v.name === "AbortError") && L(l, "ln-http:error", {
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
  document.addEventListener("ln-http:request", p), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
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
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", p), document.removeEventListener("ln-http:cancel", h), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: $, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, s = et(i), p = /* @__PURE__ */ new Map();
  function h(r) {
    if (this.dom = r, tt(this, r, s), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Ri(), this._held = !0;
    const l = this, c = this.url;
    let n = p.get(c);
    return n || (n = fetch(c).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw p.delete(c), o;
    }), p.set(c, n)), n.then(function(o) {
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
  }, s = et(i);
  function p(h) {
    this.dom = h, tt(this, h, s), this._baseAction = h.getAttribute("action") || "";
    const r = this;
    return this._onLnFill = function(l) {
      l.target === r.dom && (l.detail ? (r.fill(l.detail), r._applyActionMode(l.detail)) : r.dom.reset());
    }, this._onReset = function() {
      r._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  p.prototype.fill = function(h) {
    const r = _n(this.dom, h);
    for (let l = 0; l < r.length; l++) {
      const c = r[l], n = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, p.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const r = h && h.id != null && h.id !== "" ? h.id : null, l = this._ensureMethodInput();
    if (r !== null) {
      const c = this._actionEdit;
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(r))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(r)), l.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, p, "ln-form", {
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
    const s = Object.keys(Ve);
    for (let p = 0; p < s.length; p++) {
      const h = s[p], r = Ve[h];
      t[r] && i.push(h);
    }
  }
  if (e) {
    const s = Array.from(e);
    for (let p = 0; p < s.length; p++)
      s[p] && i.indexOf(s[p]) === -1 && i.push(s[p]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", s = "data-ln-validate-error", p = "ln-validate-valid", h = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function l(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, o = c.tagName, u = c.type, m = o === "SELECT" || u === "checkbox" || u === "radio";
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
        const _ = f.querySelector("[" + s + '="' + A + '"]');
        _ && _.classList.remove("hidden");
      }
      c.classList.remove(p), c.classList.add(h), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, f = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), f) {
          const _ = f.querySelector("[" + s + '="' + A + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(_) {
          if (f) {
            const d = f.querySelector("[" + s + '="' + _ + '"]');
            d && d.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, m || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = c.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(S) {
      n._touched = !0, !n.validate() && S.detail && S.detail.invalidFields && S.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(S) {
      const A = { invalidFields: [] };
      L(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((f, _) => f.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (c.value && c.value.trim() !== "" || c.checked) && (this._touched = !0, this.validate()), this;
  }
  l.prototype.validate = function() {
    const c = this.dom, n = c.validity, o = We(n, this._customErrors.size), u = Xi(n, this._customErrors), m = c.closest(".form-element");
    if (m) {
      const v = m.querySelector("[" + i + "]");
      if (v) {
        const S = v.querySelectorAll("[" + s + "]");
        for (let A = 0; A < S.length; A++) {
          const f = S[A].getAttribute(s);
          S[A].classList.toggle("hidden", !u.includes(f));
        }
      }
    }
    return c.classList.toggle(p, o), c.classList.toggle(h, !o), c.setAttribute("aria-invalid", o ? "false" : "true"), L(c, o ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: u }), o;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, h), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + s + "]");
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
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(p, h), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, l, "ln-validate", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function s(u) {
    if (!u.hasAttribute(t) || u[e]) return;
    u[e] = !0;
    const m = c(u);
    p(m.links), h(m.forms);
  }
  function p(u) {
    for (const m of u) {
      if (m[e + "Trigger"] || m.hostname && m.hostname !== window.location.hostname) continue;
      const w = m.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!Sn(S, m)) return;
        S.preventDefault();
        const A = m.getAttribute("href");
        A && l("GET", A, null, m);
      };
      m.addEventListener("click", v), m[e + "Trigger"] = v;
    }
  }
  function h(u) {
    for (const m of u) {
      if (m[e + "Trigger"]) continue;
      if (m.hasAttribute(i)) {
        m[e + "ScopeWarned"] || (m[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const S = m.method.toUpperCase(), A = m.action, f = new FormData(m);
        for (const _ of m.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        l(S, A, f, m, function() {
          for (const _ of m.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      m.addEventListener("submit", w), m[e + "Trigger"] = w;
    }
  }
  function r(u) {
    if (!u[e]) return;
    const m = c(u);
    for (const w of m.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of m.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete u[e];
  }
  function l(u, m, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: u, url: m }).defaultPrevented) return;
    L(v, "ln-ajax:start", { method: u, url: m }), v.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", v.appendChild(f);
    function _() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let d = m;
    const a = document.querySelector('meta[name="csrf-token"]'), g = a ? a.getAttribute("content") : null;
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
      d = m + (m.includes("?") ? "&" : "?") + T.toString();
    } else u !== "GET" && w && (b.body = w);
    fetch(d, b).then(function(T) {
      const y = T.ok, E = T.status;
      return T.text().then(function(C) {
        let q = null, D = null;
        if (C && C.trim())
          try {
            q = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: y, status: E, data: q, parseError: D };
      });
    }).then(function(T) {
      const y = T.status, E = T.data, C = T.parseError;
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
          status: y,
          data: E,
          error: C || null
        });
      L(v, "ln-ajax:complete", { method: u, url: d }), _();
    }).catch(function(T) {
      L(v, "ln-ajax:error", { method: u, url: d, status: 0, data: null, error: T }), L(v, "ln-ajax:complete", { method: u, url: d }), _();
    });
  }
  function c(u) {
    const m = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(t) !== "false" ? m.links.push(u) : u.tagName === "FORM" && u.getAttribute(t) !== "false" ? m.forms.push(u) : (m.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), m.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), m;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(m) {
        for (const w of m)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (s(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  s(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = c(v);
                  p(A.links), h(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(m) {
        s(m);
      });
    }, "ln-ajax");
  }
  function o() {
    for (const u of document.querySelectorAll("[" + t + "]"))
      s(u);
  }
  window[e] = s, window[e].destroy = r, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
function Yi(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: s = null } = {}) {
  const p = i ? !s : !t.some((n) => n.match), h = [], r = [];
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
  return { notFound: p, clears: h, swaps: r, owner: c };
}
const Fn = {
  navigate: function(t) {
    Kt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Kt(t, { historyAction: "replace" });
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
  let [e] = t.split("#"), [i, s] = e.split("?");
  const p = {};
  if (s) {
    const h = new URLSearchParams(s);
    for (const [r, l] of h.entries())
      p[r] = l;
  }
  return i = i.replace(/\/+$/, ""), i === "" && (i = "/"), { path: i, query: p };
}
function Kn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, s = e.segments, p = Math.max(i.length, s.length);
  for (let h = 0; h < p; h++) {
    const r = i[h], l = s[h];
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
  for (const s of e) {
    if (s.pattern === "*")
      return {
        route: s,
        params: { wildcard: t }
      };
    const p = s.segments, h = {};
    let r = !0;
    if (!(i.length > p.length && p[p.length - 1] !== "*")) {
      for (let l = 0; l < p.length; l++) {
        const c = p[l], n = i[l];
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
      if (r && (p.indexOf("*") !== -1 || i.length <= p.length))
        return { route: s, params: h };
    }
  }
  return null;
}
function Ae(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const p = document.getElementById(t);
    return !p && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), p;
  }
  const s = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !s && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), s;
}
function Qe(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const p of i)
    for (const h of Object.keys(p))
      if (h.startsWith("ln") && p[h] && typeof p[h].destroy == "function")
        try {
          p[h].destroy();
        } catch (r) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, p, r);
        }
  const s = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of s) {
    const h = p.lnPopover;
    if (h && h.trigger && t.contains(h.trigger))
      try {
        h.destroy();
      } catch (r) {
        console.error("[ln-router] Error destroying open popover:", r);
      }
  }
}
function Kt(t, e = {}) {
  const { path: i, query: s } = ne(t), p = /* @__PURE__ */ new Map();
  for (const [m, w] of _t)
    p.set(m, jn(i, w.sorted));
  const h = p.get("__primary__") || null, r = Ae("__primary__", { warn: !!h }), l = _t.has("__primary__"), c = [];
  for (const [m, w] of p) {
    const v = m === "__primary__" ? r : Ae(m, { warn: !1 }), S = !v && !!(h && h.route && h.route.templateNode && h.route.templateNode.content && h.route.templateNode.content.querySelector("#" + CSS.escape(m)));
    !v && !S && w && console.warn(`[ln-router] Explicit target element #${m} not found in DOM`), c.push({
      regionKey: m,
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
    query: s
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const u = function() {
    for (const m of n.clears)
      Qe(m.targetEl), m.targetEl.replaceChildren(), pe.delete(m.targetEl);
    for (const m of n.swaps) {
      if ((m.isPending || !m.targetEl || !document.contains(m.targetEl)) && (m.targetEl = m.regionKey === "__primary__" ? r : document.getElementById(m.regionKey)), !m.targetEl) {
        console.warn(`[ln-router] Target element #${m.regionKey} could not be resolved`);
        continue;
      }
      if (m.skipMount || (Qe(m.targetEl), m.targetEl.replaceChildren(m.match.route.templateNode.content.cloneNode(!0))), pe.set(m.targetEl, m.match.route.templateNode), n.owner && m.regionKey === n.owner.regionKey) {
        if (m.match.route.title) {
          let w = m.match.route.title;
          if (m.match.params)
            for (const [v, S] of Object.entries(m.match.params))
              w = w.replace(new RegExp("\\{\\{\\s*" + v + "\\s*\\}\\}", "g"), S);
          document.title = w;
        }
        if (!e.isHydration) {
          m.targetEl.hasAttribute("tabindex") || m.targetEl.setAttribute("tabindex", "-1");
          const w = m.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          w ? (w.setAttribute("tabindex", "-1"), w.focus()) : m.targetEl.focus(), m.regionKey === "__primary__" && m.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      $e(m.targetEl, "ln-router:navigated", {
        path: t,
        params: m.match.params,
        query: s,
        route: m.match.route,
        target: m.targetEl,
        region: m.regionKey
      });
    }
    ee = t, Hn = s, zn = h ? h.route : null, Un = h ? h.params : {}, Bn = new Map(
      Array.from(p.entries()).map(([m, w]) => [m, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(u) : u();
}
function Zi(t) {
  const e = t.target.closest("a");
  if (!e || !Sn(t, e)) return;
  const i = e.getAttribute("href"), { path: s } = ne(i);
  for (const p of _t.values())
    if (jn(s, p.sorted)) {
      t.preventDefault(), Kt(i, { historyAction: "push" });
      return;
    }
}
function tr(t, e) {
  const i = Object.keys(t), s = Object.keys(e);
  if (i.length !== s.length) return !1;
  for (let p = 0; p < i.length; p++) {
    const h = i[p];
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
  Kt(t, { historyAction: "skip" });
}
function Vn() {
  Ge || (Ge = !0, gt(function() {
    document.addEventListener("click", Zi), window.addEventListener("popstate", er), Ee = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Kt(t, { historyAction: "replace", isHydration: !0 }), Ee = !1;
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
  const s = i || "__primary__";
  _t.has(s) || _t.set(s, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = _t.get(s);
  if (p.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${s}"`);
    return;
  }
  const h = t.getAttribute("data-ln-route-title"), r = e.split("/").filter(Boolean), l = {
    pattern: e,
    segments: r,
    target: i,
    title: h,
    templateNode: t
  }, c = Ae(s);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), p.routes.set(e, l), p.sorted = Array.from(p.routes.values()).sort(Kn);
}
function Gn(t) {
  const e = t.getAttribute(Oe);
  if (!e) return;
  const s = t.getAttribute("data-ln-route-target") || null || "__primary__", p = _t.get(s);
  p && (p.routes.delete(e), p.sorted = Array.from(p.routes.values()).sort(Kn), p.routes.size === 0 && _t.delete(s));
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
      effect: p,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  };
  function s(h) {
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
  s.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, s.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, s.prototype.toggle = function() {
    const h = this.dom.getAttribute(t);
    this.dom.setAttribute(t, h === "open" ? "close" : "open");
  }, s.prototype.destroy = function() {
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
  function p(h) {
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
        if (o && Ht(o))
          o.focus();
        else {
          const u = h.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), m = Array.prototype.find.call(u, Ht);
          if (m) m.focus();
          else {
            const w = h.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, Ht);
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
  j(t, e, s, "ln-modal", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", i = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-ui-coordinator": { type: "marker", description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts" },
    "data-ln-ui-coordinator-dict": { type: "string", description: "Dictionary key prefix mapping for translatable UI coordinator messages" }
  };
  function p(f) {
    const _ = {};
    let d = f;
    const a = [];
    for (; d; ) {
      const g = d.closest("[" + t + "]");
      if (!g) break;
      g[e] && g[e].dict && a.unshift(g[e].dict), d = g.parentElement;
    }
    for (const g of a)
      Object.assign(_, g);
    return _;
  }
  function h(f, _) {
    if (_) {
      if (f) {
        const a = f.closest("[" + t + "]");
        if (a) {
          if (a.id === _ && a.hasAttribute("data-ln-modal")) return a;
          const g = a.querySelector("#" + CSS.escape(_) + '[data-ln-modal], [data-ln-modal="' + _ + '"]');
          if (g) return g;
        }
      }
      const d = document.getElementById(_) || document.querySelector('[data-ln-modal="' + _ + '"]');
      if (d) return d;
    }
    if (f) {
      const d = f.closest("[" + t + "]");
      if (d) {
        if (d.hasAttribute("data-ln-modal")) return d;
        const g = d.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const a = f.closest("[data-ln-modal]");
      if (a) return a;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function r(f, _) {
    if (f !== "edit") return "";
    if (_) {
      const d = _.getAttribute("data-ln-fill-id");
      if (d) return d;
    }
    return "edit";
  }
  function l(f) {
    if (!f) return;
    const _ = f.querySelectorAll("[data-ln-field]");
    for (let a = 0; a < _.length; a++)
      _[a].textContent = "";
    const d = f.querySelectorAll("form");
    for (let a = 0; a < d.length; a++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(d[a], null) : d[a].reset();
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const _ = f.target.closest("[data-ln-modal-for]");
    if (_) {
      const a = _.getAttribute("data-ln-modal-for"), g = h(_, a);
      if (g && g.lnModal) {
        f.preventDefault();
        const b = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, y = _.dataset;
        for (const q in y) {
          if (!q.startsWith("lnModal") || b[q]) continue;
          const D = q.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = y[q]);
        }
        const E = Object.keys(T).length > 0;
        _.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = _.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, T) : g.dataset.lnModalMode === "new" && l(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && dt(g.id, r(g.dataset.lnModalMode, _)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const d = f.target.closest('a[href^="#"]');
    if (d) {
      const a = se(d.getAttribute("href"));
      for (const g in a) {
        const b = document.getElementById(g);
        if (b && b.lnModal) {
          if (!De(f)) return;
          dt(g, a[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(f) {
    const _ = f.target;
    if (!_ || !_.lnModal) return;
    (_.dataset.lnModalMode || "new") === "new" && l(_);
  }), document.addEventListener("ln-modal:open", function(f) {
    const _ = f.target;
    if (!_ || !_.lnModal || !_.id) return;
    let d = ot(_.id);
    d === null && (d = r(_.dataset.lnModalMode, null), dt(_.id, d)), d ? (_.dataset.lnModalMode = "edit", L(_, "ln-fill:request", { id: d })) : (_.dataset.lnModalMode = "new", l(_));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const f = document.querySelectorAll("[data-ln-modal][id]");
        for (let _ = 0; _ < f.length; _++) {
          const d = f[_];
          if (!d.lnModal) continue;
          const a = d.id, g = ot(a), b = g !== null, T = d.lnModal.isOpen;
          if (b) {
            const y = g ? "edit" : "new";
            d.dataset.lnModalMode = y, T ? g ? L(d, "ln-fill:request", { id: g }) : l(d) : L(d, "ln-modal:request-open", {});
          } else T && L(d, "ln-modal:request-close", {});
        }
      } finally {
        c = !1;
      }
    }
  }
  function o() {
    const f = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let _ = 0; _ < f.length; _++) {
      const d = f[_];
      d.lnModal && ot(d.id) === null && dt(d.id, r(d.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function u() {
    o(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(u);
  }) : mt(u);
  function m(f) {
    const d = (f.detail || {}).data;
    if (d && d.message) {
      const g = d.message;
      L(window, "ln-toast:enqueue", {
        type: g.type || "success",
        title: g.title || "",
        message: g.body || ""
      });
    }
    const a = f.target.closest("[data-ln-modal]");
    a && a.lnModal && (a.id && dt(a.id, null), L(a, "ln-modal:request-close", {}), l(a));
  }
  function w(f) {
    const _ = f.detail || {}, d = _.data, a = _.status || 0, g = p(f.target);
    if (d && d.message) {
      const b = d.message;
      L(window, "ln-toast:enqueue", {
        type: b.type || "error",
        title: b.title || "",
        message: b.body || ""
      });
    } else a === 0 ? L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["network-error-title"] || "",
      message: g["network-error"] || "Network error"
    }) : L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["server-error-title"] || "",
      message: g["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", m), document.addEventListener("ln-ajax:error", w);
  function v(f) {
    const _ = f.detail || {}, d = p(f.target), a = _.message || (_.reason === "max-size" ? d["upload-max-size"] || "File is too large" : _.reason === "max-files" ? d["upload-max-files"] || "Maximum file count exceeded" : d["upload-invalid-type"] || "This file type is not allowed"), g = d["upload-invalid-title"] || "Invalid File";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: a
    });
  }
  function S(f) {
    const _ = f.detail || {}, d = p(f.target), a = _.message || d["upload-failed"] || "Failed to upload file", g = d["upload-error-title"] || "Upload Error";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: a
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(f) {
    const _ = f.target;
    !_ || !_.lnModal || (_.id && ot(_.id) !== null && dt(_.id, null), _.dataset.lnModalMode === "new" && l(_));
  });
  function A(f) {
    return this.dom = f, this.dict = ie(f, i), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: s
  });
})();
function nr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, s = 0;
  for (let p = 0; p < t.length && i > 0; p++)
    s = p + 1, /[0-9]/.test(t[p]) && i--;
  return i > 0 && (s = t.length), s;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(r) {
    const l = r[e];
    l && (l.isTextElement ? l._initTextElement() : isNaN(l.value) || l._displayFormatted(l.value));
  }
  const s = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
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
        return p.get.call(c);
      },
      set: function(o) {
        if (p.set.call(c, o), o !== "" && !isNaN(parseFloat(o))) {
          const u = l.dom.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(ct(parseFloat(o), it(l.dom), { maxDecimals: u }));
        } else
          l._setDisplayRaw("");
        l.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), yn(r, p, {
      get: function() {
        return p.get.call(r);
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
          const m = r.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(ct(u, it(r), { maxDecimals: m }));
        }
        r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      l._handleInput();
    }, r.addEventListener("input", this._onInput), this._onKeyDown = function(o) {
      if (o.key !== "Backspace") return;
      const u = r.selectionStart, m = r.selectionEnd;
      if (u !== m || u === 0) return;
      const w = te(it(r)), v = p.get.call(r), S = v[u - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        o.preventDefault();
        const A = u - 2 >= 0 ? u - 2 : 0, f = v.slice(0, A) + v.slice(u);
        p.set.call(r, f), r.setSelectionRange(A, A), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, r.addEventListener("keydown", this._onKeyDown), this._onPaste = function(o) {
      o.preventDefault();
      const u = (o.clipboardData || window.clipboardData).getData("text"), m = Ki(u, it(r));
      l.value = isNaN(m) ? NaN : m;
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
    const r = this.dom, l = p.get.call(r);
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
    let m = l, w = On(l, u.groupSep, u.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: l });
      return;
    }
    const S = r.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const g = parseInt(S, 10), b = w.slice(A + 1);
      if (g === 0)
        w = w.slice(0, A), m = m.split(u.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(m);
      else if (b.length > g) {
        w = w.slice(0, A + 1 + g);
        const T = m.split(u.decimalSep);
        m = T[0] + u.decimalSep + T[1].slice(0, g), v = parseFloat(w), this._setDisplayRaw(m);
      }
    }
    const f = r.getAttribute("data-ln-number-max");
    if (f !== null && v > parseFloat(f)) {
      const g = parseFloat(f), b = ct(g, o, { maxDecimals: S });
      this._setDisplayRaw(b), this._setHiddenRaw(g), r.setSelectionRange(b.length, b.length), L(r, "ln-number:input", { value: g, formatted: b });
      return;
    }
    if (m.endsWith(u.decimalSep) || u.decimalSep !== "." && m.endsWith(".")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: m });
      return;
    }
    const _ = w.indexOf(".");
    if (_ !== -1 && w.slice(_ + 1).endsWith("0")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: m });
      return;
    }
    let d;
    if (S !== null)
      d = ct(v, o, { maxDecimals: S });
    else {
      const g = _ !== -1 ? w.slice(_ + 1).length : 0;
      d = ct(v, o, { userDecimals: g });
    }
    this._setDisplayRaw(d);
    const a = nr(d, n);
    r.setSelectionRange(a, a), this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: d });
  }, h.prototype._setHiddenRaw = function(r) {
    this._hidden && p.set.call(this._hidden, String(r));
  }, h.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : p.set.call(this.dom, String(r));
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
      const r = p.get.call(this._hidden);
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
      return this.isTextElement ? this.dom.textContent : p.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, h, "ln-number", {
    attributes: s,
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
function Wt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, s;
  if (e.indexOf(".") !== -1)
    i = ".", s = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", s = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", s = e.split("-");
  else
    return null;
  if (s.length !== 3) return null;
  const p = [];
  for (let n = 0; n < 3; n++) {
    const o = parseInt(s[n], 10);
    if (isNaN(o)) return null;
    p.push(o);
  }
  let h, r, l;
  i === "." ? (h = p[0], r = p[1], l = p[2]) : i === "/" ? (r = p[0], h = p[1], l = p[2]) : s[0].length === 4 ? (l = p[0], r = p[1], h = p[2]) : (h = p[0], r = p[1], l = p[2]), l < 100 && (l += l < 50 ? 2e3 : 1900);
  const c = new Date(l, r - 1, h);
  return c.getFullYear() !== l || c.getMonth() !== r - 1 || c.getDate() !== h ? null : c;
}
function me(t, e, i, s) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const p = t.getDate(), h = t.getMonth(), r = t.getFullYear(), l = t.getHours(), c = t.getMinutes();
  let n, o;
  const u = (i || "").toLowerCase().split("-")[0];
  let m = !1;
  try {
    const S = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    m = !!(s && S !== u);
  } catch {
    m = !!s;
  }
  if (m && s && s.monthsLong)
    n = s.monthsLong[h];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(h + 1);
    }
  if (m && s && s.monthsShort)
    o = s.monthsShort[h];
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
    dd: String(p).padStart(2, "0"),
    d: String(p),
    HH: String(l).padStart(2, "0"),
    mm: String(c).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, i, s) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const p = rr(e);
  if (p)
    try {
      const h = new Intl.DateTimeFormat(i, p), r = (i || "").toLowerCase().split("-")[0], l = h.resolvedOptions().locale.toLowerCase().split("-")[0];
      return s && l !== r ? me(t, "dd.MM.yyyy", i, s) : h.format(t);
    } catch {
      return me(t, "dd.MM.yyyy", i, s);
    }
  return me(t, e || "dd.MM.yyyy", i, s);
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
        const u = st(o.value);
        u && o._displayFormatted(u);
      }
    }
  }
  const s = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: i, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: i, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: i, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: i, description: "Raw ISO date string or timestamp" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(n, o, u) {
    L(n.dom, "ln-date:change", {
      value: o,
      formatted: n.dom.value,
      date: u
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function r(n, o, u, m) {
    n._setHiddenRaw(o), p.set.call(n._picker, o), n._lastISO = o, m !== void 0 ? (n._isFormatting = !0, n.dom.value = m, n._isFormatting = !1) : u && n._displayFormatted(u), h(n, o, u);
  }
  function l(n) {
    n._setHiddenRaw(""), p.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", h(n, "", null);
  }
  function c(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const _ = st(o.value);
        _ && o._displayFormatted(_);
      }
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const u = n.value, m = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const _ = w.querySelectorAll("[data-ln-date-dict]");
      for (let d = 0; d < _.length; d++) {
        const a = _[d].getAttribute("data-ln-date-dict");
        if (a) {
          const g = ie(_[d], "data-ln-date-dict-key");
          g["months-long"] && (g.monthsLong = g["months-long"].split(",").map((b) => b.trim())), g["months-short"] && (g.monthsShort = g["months-short"].split(",").map((b) => b.trim())), Ie(a, g);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const S = document.createElement("input");
    S.type = "hidden", S.name = m, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && S.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", S), this._hidden = S;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", S.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const f = document.createElement("button");
    if (f.type = "button", f.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), f.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", f), this._btn = f, this._lastISO = "", Object.defineProperty(S, "value", {
      get: function() {
        return p.get.call(S);
      },
      set: function(_) {
        if (p.set.call(S, _), _ && _ !== "") {
          const d = st(_);
          d && r(o, _, d);
        } else _ === "" && l(o);
      }
    }), yn(n, p, {
      get: function() {
        return p.get.call(n);
      },
      set: function(_, d) {
        if (o._isFormatting) {
          d(_);
          return;
        }
        if (!_ || _ === "") {
          d(""), l(o);
          return;
        }
        const a = st(_) || Wt(_);
        if (a) {
          const g = Ft(a), b = n.getAttribute(t) || "", T = it(n), y = Lt(T), E = Gt(a, b, T, y);
          d(E), r(o, g, a, E);
        } else
          d(String(_)), l(o);
      }
    }), this._onPickerChange = function() {
      const _ = A.value;
      if (_) {
        const d = st(_);
        d && r(o, _, d);
      } else
        l(o);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const _ = o.dom.value.trim();
      if (_ === "") {
        o._lastISO !== "" && l(o);
        return;
      }
      if (o._lastISO) {
        const a = st(o._lastISO);
        if (a) {
          const g = o.dom.getAttribute(t) || "", b = it(o.dom), T = Lt(b);
          if (_ === Gt(a, g, b, T)) return;
        }
      }
      const d = Wt(_);
      if (d) {
        const a = Ft(d);
        r(o, a, d);
      } else if (o._lastISO) {
        const a = st(o._lastISO);
        a && o._displayFormatted(a);
      } else
        o.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, f.addEventListener("click", this._onBtnClick), u && u !== "") {
      const _ = st(u);
      _ && r(o, u, _);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, o = n.getAttribute("data-ln-value"), u = n.getAttribute("data-ln-date"), m = n.getAttribute("datetime");
    let w = null;
    o !== null && o !== "" ? w = o : m !== null && m !== "" ? w = m : u !== null && u !== "" && u !== "true" && !Se.test(u) ? w = u : w = n.textContent.trim();
    const v = st(w) || Wt(w);
    if (v && !isNaN(v.getTime())) {
      const S = Ft(v);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = st(this._rawValue);
      if (n) {
        let u = this.dom.getAttribute("data-ln-date-format");
        if (!u) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Se.test(v) && (u = v);
        }
        const m = it(this.dom), w = Lt(m);
        this.dom.textContent = Gt(n, u || "medium", m, w);
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
    p.set.call(this._hidden, n);
  }, c.prototype._displayFormatted = function(n) {
    const o = this.dom.getAttribute(t) || "", u = it(this.dom), m = Lt(u);
    this._isFormatting = !0, this.dom.value = Gt(n, o, u, m), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : p.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const u = st(n) || Wt(n);
        if (!u) return;
        const m = Ft(u);
        this._rawValue = m, this.dom.setAttribute("data-ln-value", m), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        l(this);
        return;
      }
      const o = st(n);
      o && r(this, n, o);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? st(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = Ft(n);
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
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, c, "ln-date", {
    attributes: s,
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
  }, s = et(i);
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
  function p(l) {
    return this.dom = l, tt(this, l, s), this.activeClass = l.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(l, { childList: !0, subtree: !0 }), this.update(), this;
  }
  p.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, o = h(n), u = [];
    for (const m of c) {
      const w = m.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        m.classList.remove(this.activeClass), m.removeAttribute("aria-current");
        continue;
      }
      if (m.hostname && m.hostname !== window.location.hostname) {
        m.classList.remove(this.activeClass), m.removeAttribute("aria-current");
        continue;
      }
      const v = h(w), S = v === o, A = !this.exact && v !== "/" && o.startsWith(v + "/");
      S || A ? (m.classList.add(this.activeClass), m.setAttribute("aria-current", "page"), u.push(m)) : (m.classList.remove(this.activeClass), m.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: u });
  }, p.prototype.destroy = function() {
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
          const m = l.querySelectorAll("a");
          for (const w of m)
            o && w.classList.remove(o);
          n.activeClass = u;
        }
      }
      n.update();
    }
  }
  j(t, e, p, "ln-nav", {
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
  function s() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const r = "__ln_persist_test__";
      return localStorage.setItem(r, r), localStorage.removeItem(r), i = !0;
    } catch {
      return i = !1;
    }
  }
  const p = /* @__PURE__ */ new Set();
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
    if (p.has(u.attr) || (p.add(u.attr), Vt([u.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || u.hashActive && u.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !s()) return;
      const f = v.getAttribute(S);
      try {
        f === null ? localStorage.removeItem(A) : localStorage.setItem(A, f);
      } catch {
      }
    })), u.hashActive && u.hashActive(r)) return;
    const m = e(r, u.attr);
    if (!m || !s()) return;
    const w = localStorage.getItem(m);
    w !== null && r.setAttribute(u.attr, w);
  }
  Ti(h);
})();
function Xe(t, e, i, s) {
  const p = (t || "").toLowerCase().trim();
  if (p) return p;
  if ((e || "").toUpperCase() !== "A") return "";
  const h = i || "";
  if (!h.startsWith("#")) return "";
  const r = h.slice(1);
  if (!r) return "";
  const l = r.split("&"), c = (s || "").toLowerCase().trim();
  if (c)
    for (const u of l) {
      const m = u.indexOf(":");
      if (m > 0 && u.slice(0, m).toLowerCase().trim() === c)
        return u.slice(m + 1).toLowerCase().trim();
    }
  const n = l[l.length - 1] || "", o = n.indexOf(":");
  return (o > 0 ? n.slice(o + 1) : n).toLowerCase().trim();
}
function Ye(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (h) => (h.tagName || "").toUpperCase() === "A" && (h.href || "").startsWith("#")
  ), s = i.length > 0 && i.length === t.length, p = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : s && !p ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: s && !!p,
    warning: null
  };
}
function Je(t, e, i) {
  const s = (t || "").toLowerCase().trim();
  return s && Array.isArray(e) && e.includes(s) ? s : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(c) {
    const n = c.getAttribute("data-ln-tabs-active");
    c[e] && c[e]._applyActive(n);
  }
  function s(c, n) {
    return (c.getAttribute(n) || c.id || "").toLowerCase().trim();
  }
  const p = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: s, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, h = et(p);
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
      const m = Xe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
      m ? this.mapTabs[m] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const m = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      m && (this.mapPanels[m] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const o = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[e + "Trigger"]) continue;
      const m = function(w) {
        const v = u.tagName === "A";
        if (!v && (w.ctrlKey || w.metaKey || w.button === 1)) return;
        const S = Xe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), o.nsKey);
        S && (v && !De(w) || (o.hashEnabled ? ot(o.nsKey) === S ? o.dom.setAttribute("data-ln-tabs-active", S) : dt(o.nsKey, S) : o.dom.setAttribute("data-ln-tabs-active", S)));
      };
      u.addEventListener("click", m), u[e + "Trigger"] = m, o._clickHandlers.push({ el: u, handler: m });
    }
    if (this._onRequestSelect = function(u) {
      const m = u.detail && (u.detail.key || u.detail.tab);
      m && o.select(m);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const u = ot(o.nsKey);
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
    n && (this.hashEnabled ? ot(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : dt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
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
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && ot(this.nsKey) !== n && dt(this.nsKey, n));
      return;
    }
    this.activeKey = c;
    for (const u in this.mapTabs) {
      const m = this.mapTabs[u];
      u === c ? (m.setAttribute("data-active", ""), m.setAttribute("aria-selected", "true")) : (m.removeAttribute("data-active"), m.setAttribute("aria-selected", "false"));
    }
    for (const u in this.mapPanels) {
      const m = this.mapPanels[u], w = u === c;
      m.classList.toggle("hidden", !w), m.setAttribute("aria-hidden", w ? "false" : "true");
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
    attributes: p,
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
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", s = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-toggle": { effect: m, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
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
      const f = v.getAttribute(s) || "toggle", _ = A.getAttribute(t);
      A.setAttribute(t, l(_, f));
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
  function m(w) {
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
    attributes: p,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function s(p) {
    return this.dom = p, this._onToggleOpen = function(h) {
      if (h.detail.target.closest("[data-ln-accordion]") !== p) return;
      const r = p.querySelectorAll("[data-ln-toggle]");
      for (const l of r)
        l !== h.detail.target && l.closest("[data-ln-accordion]") === p && l.getAttribute("data-ln-toggle") === "open" && l.setAttribute("data-ln-toggle", "close");
      L(p, "ln-accordion:change", { target: h.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, s, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: i, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, p = et(s);
  function h(r) {
    this.dom = r, tt(this, r, p), this.toggleEl = r.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = r.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
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
          const m = l._getMenuItems();
          m.length > 0 && l._focusItem(m, c.key === "ArrowDown" ? 0 : m.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const u = o.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const m = u < o.length - 1 ? u + 1 : 0;
        l._focusItem(o, m);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const m = u > 0 ? u - 1 : o.length - 1;
        l._focusItem(o, m);
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
    attributes: s
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", s = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: u, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, h = [];
  let r = null;
  function l() {
    r || (r = function(m) {
      if (m.key !== "Escape" || h.length === 0) return;
      h[h.length - 1].close();
    }, document.addEventListener("keydown", r));
  }
  function c() {
    h.length > 0 || r && (document.removeEventListener("keydown", r), r = null);
  }
  function n(m) {
    this.dom = m, this.isOpen = m.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.open(S);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.toggle(S);
    }, m.addEventListener("ln-popover:request-open", this._onRequestOpen), m.addEventListener("ln-popover:request-close", this._onRequestClose), m.addEventListener("ln-popover:request-toggle", this._onRequestToggle), m.hasAttribute("tabindex") || m.setAttribute("tabindex", "-1"), m.hasAttribute("role") || m.setAttribute("role", "dialog"), m.hasAttribute("popover") || m.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(m) {
    this.isOpen || (this.trigger = m || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(m) {
    this.isOpen ? this.close() : this.open(m);
  }, n.prototype._applyOpen = function(m) {
    this.isOpen = !0, m && (this.trigger = m), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const w = ve(this.dom);
    if (this.trigger) {
      const f = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(s) || "bottom", d = Zt(f, w, _, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, Ht);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(f) {
      A.dom.contains(f.target) || A.trigger && A.trigger.contains(f.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const f = A.trigger.getBoundingClientRect(), _ = ve(A.dom), d = A.dom.getAttribute(s) || "bottom", a = Zt(f, _, d, 8);
      A.dom.style.top = a.top + "px", A.dom.style.left = a.left + "px", A.dom.setAttribute("data-ln-popover-placement", a.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), h.push(this), l(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const m = h.indexOf(this);
    m !== -1 && h.splice(m, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
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
  function o(m) {
    this.dom = m;
    const w = m.getAttribute(i);
    return m.setAttribute("aria-haspopup", "dialog"), m.setAttribute("aria-expanded", "false"), m.setAttribute("aria-controls", w), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const S = document.getElementById(w);
      if (!S) return;
      S[e] && (S[e].trigger = m);
      const A = S.getAttribute(t);
      S.setAttribute(t, A === "open" ? "closed" : "open");
    }, m.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function u(m) {
    const w = m[e];
    if (!w) return;
    const S = m.getAttribute(t) === "open";
    if (S !== w.isOpen)
      if (S) {
        if (Z(m, "ln-popover:before-open", {
          popoverId: m.id,
          target: m,
          trigger: w.trigger
        }).defaultPrevented) {
          m.setAttribute(t, "closed");
          return;
        }
        w._applyOpen(w.trigger);
      } else {
        if (Z(m, "ln-popover:before-close", {
          popoverId: m.id,
          target: m,
          trigger: w.trigger
        }).defaultPrevented) {
          m.setAttribute(t, "open");
          return;
        }
        w._applyClose();
      }
  }
  j(t, e, n, "ln-popover", {
    attributes: p
  }), j(i, e + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", s = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[s] !== void 0) return;
  const h = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let r = 0, l = null, c = null, n = null, o = null, u = null, m = null;
  function w() {
    return l && l.parentNode || (l = document.getElementById(p), l || (l = document.createElement("div"), l.id = p, document.body.appendChild(l)), l.hasAttribute("popover") || l.setAttribute("popover", "manual")), l;
  }
  function v() {
    m || (m = function(d) {
      d.key === "Escape" && f();
    }, document.addEventListener("keydown", m));
  }
  function S() {
    m && (document.removeEventListener("keydown", m), m = null);
  }
  function A(d) {
    if (n === d) return;
    f();
    const a = d.getAttribute(e) || d.getAttribute("title");
    if (!a) return;
    w(), typeof l.showPopover == "function" && l.showPopover(), d.hasAttribute("title") && (o = d.getAttribute("title"), d.removeAttribute("title"));
    const g = d.getAttribute("aria-describedby");
    g ? u = g : u = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = a, d[s + "Uid"] || (r += 1, d[s + "Uid"] = "ln-tooltip-" + r), b.id = d[s + "Uid"], l.appendChild(b);
    const T = b.offsetWidth, y = b.offsetHeight, E = d.getBoundingClientRect(), C = d.getAttribute(i) || "top", q = Zt(E, { width: T, height: y }, C, 6);
    b.style.top = q.top + "px", b.style.left = q.left + "px", b.setAttribute("data-ln-tooltip-placement", q.placement), u ? d.setAttribute("aria-describedby", u + " " + b.id) : d.setAttribute("aria-describedby", b.id), c = b, n = d, v();
  }
  function f() {
    if (!c) {
      S();
      return;
    }
    n && (u !== null ? n.setAttribute("aria-describedby", u) : n.removeAttribute("aria-describedby"), u = null, o !== null && n.setAttribute("title", o)), o = null, c.parentNode && c.parentNode.removeChild(c), c = null, n = null, l && typeof l.hidePopover == "function" && l.matches(":popover-open") && l.hidePopover(), S();
  }
  function _(d) {
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
  _.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), n === d && f(), this._addedEnhancedAttr && d.removeAttribute("data-ln-tooltip-enhanced"), delete d[s], delete d[s + "Uid"], L(d, "ln-tooltip:destroyed", { trigger: d });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    s,
    _,
    "ln-tooltip",
    {
      attributes: h
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: xt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: xt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, p = et(s);
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
    this.dom = A, tt(this, A, p);
    const f = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; f.length > this.max; ) A.removeChild(f.shift());
    for (const _ of f) w(_, this);
    return f.length > 0 && h(A), this;
  }
  l.prototype.enqueue = function(A) {
    if (!A) return;
    const f = c(A, this.dom);
    if (!f) return;
    const _ = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    o(this, f), _ > 0 && (f._timer = setTimeout(() => u(f), _));
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
    const _ = ((A.type || "") + "").trim().toLowerCase(), d = Ct(f, i, "ln-toast");
    if (!d)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    pt(d, {
      type: _,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const a = d.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const g = a.querySelector(".body");
    g && n(g, A);
    const b = a.querySelector("[data-ln-toast-close]");
    return b && b.addEventListener("click", function() {
      u(a);
    }), a;
  }
  function n(A, f) {
    if (Array.isArray(f.message)) {
      const _ = document.createElement("ul");
      for (const d of f.message) {
        const a = document.createElement("li");
        a.textContent = d, _.appendChild(a);
      }
      A.appendChild(_);
    }
    if (f.data && f.data.errors) {
      const _ = document.createElement("ul");
      for (const d of Object.values(f.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = d, _.appendChild(a);
      }
      A.appendChild(_);
    }
  }
  function o(A, f) {
    const _ = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length >= A.max && _.length > 0; ) A.dom.removeChild(_.shift());
    A.dom.appendChild(f), h(A.dom), requestAnimationFrame(() => f.classList.remove("ln-enter"));
  }
  function u(A) {
    if (!A || !A.parentNode) return;
    const f = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), r(f));
    }, 200);
  }
  function m(A) {
    let f = A && A.container;
    return typeof f == "string" && (f = document.querySelector(f)), f instanceof HTMLElement || (f = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), f || null;
  }
  function w(A, f) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const _ = A.querySelector("[data-ln-toast-close]");
    _ && _.addEventListener("click", function() {
      u(A);
    });
    const d = +(A.getAttribute("data-ln-toast-timeout") ?? f.timeoutDefault);
    d > 0 && (A._timer = setTimeout(function() {
      u(A);
    }, d));
  }
  function v(A) {
    const f = A.detail || {}, _ = m(f);
    if (!_) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (_[e] || (_[e] = new l(_))).enqueue(f);
  }
  function S(A) {
    const f = A && A.detail || {};
    if (f.container) {
      const _ = m(f);
      _ && (_[e] || (_[e] = new l(_))).clear();
    } else {
      const _ = document.querySelectorAll("[" + t + "]");
      for (const d of Array.from(_))
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
    attributes: s
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
  const i = Qn(t.name), s = String(t.type || "").toLowerCase();
  return e.some((p) => {
    if (p.includes("/")) {
      if (p.endsWith("/*")) {
        const h = p.slice(0, -1);
        return s.startsWith(h);
      }
      return s === p;
    }
    return i === p;
  });
}
function ar(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const s = 1024, p = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], h = Math.floor(Math.log(t) / Math.log(s)), r = Math.min(h, p.length - 1), l = t / Math.pow(s, r);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(l) + " " + p[r];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", s = "file_ids[]";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-upload": { prop: "uploadUrl", read: $, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: $, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: $, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: $, type: "string", fallback: s, description: "Form field name for submitting uploaded file IDs" },
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
  }, h = et(p);
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
    for (let m = 0; m < o.length; m++) {
      const w = o[m], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), f = w.querySelector('[data-ln-field="sizeText"]'), _ = w.getAttribute("data-ln-upload-size"), d = _ ? parseInt(_, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: d !== null && !isNaN(d) ? d : f ? f.textContent.trim() : ""
      });
    }
    const u = this.dom.querySelectorAll('input[type="hidden"]');
    for (let m = 0; m < u.length; m++) {
      const w = u[m];
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
        const m = document.createElement("input");
        m.type = "hidden", m.name = n.idsFieldName, m.value = u.serverId, n.dom.appendChild(m);
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
      const m = u.closest("[data-ln-upload-item]");
      if (m) {
        const w = m.getAttribute("data-ln-upload-local-id");
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
    for (let m = 0; m < u.length; m++) {
      const w = u[m];
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
    const o = this, u = "file-" + ++o.fileIdCounter, m = Qn(n.name);
    let w = null;
    if (this.list) {
      const _ = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (_ && (w = _.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", u), w.setAttribute("data-ln-upload-ext", m), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: o.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const d = w.querySelector('[data-ln-upload-action="remove"]');
        d && (d.disabled = !0);
        const a = w.querySelector("[data-ln-progress]");
        a && a.setAttribute("data-ln-progress", "0"), o.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(o.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let _ = 0; _ < S.length; _++) {
      const d = S[_];
      !d.name || d.name === o.idsFieldName || d.type === "file" || (d.type === "checkbox" || d.type === "radio") && !d.checked || v.append(d.name, d.value);
    }
    const A = new XMLHttpRequest();
    o.uploadedFiles.set(u, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(_) {
      if (_.lengthComputable) {
        const d = Math.round(_.loaded / _.total * 100);
        if (w) {
          const a = w.querySelector("[data-ln-progress]");
          a && a.setAttribute("data-ln-progress", String(d)), pt(w, { sizeText: d + "%" });
        }
        L(o.dom, "ln-upload:progress", {
          localId: u,
          file: n,
          percent: d,
          loaded: _.loaded,
          total: _.total
        });
      }
    }), A.addEventListener("load", function() {
      const _ = o.uploadedFiles.get(u);
      if (_ && delete _.xhr, A.status >= 200 && A.status < 300) {
        let d;
        try {
          d = JSON.parse(A.responseText);
        } catch (g) {
          f(o.dict.error || "Error", A.status, g);
          return;
        }
        const a = d.id || d.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), a && w.setAttribute("data-ln-upload-id", String(a)), pt(w, {
            sizeText: r(d.size || n.size, o.locale, o.dict),
            uploading: !1
          });
          const g = w.querySelector('[data-ln-upload-action="remove"]');
          g && (g.disabled = !1);
        }
        _ && (_.serverId = a, _.size = d.size || n.size, _.name = d.name || n.name), o._syncHiddenInputs(), L(o.dom, "ln-upload:uploaded", {
          localId: u,
          serverId: a,
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
      const _ = o.uploadedFiles.get(u);
      _ && delete _.xhr, f("", 0, null);
    });
    function f(_, d, a) {
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
        message: _,
        status: d,
        error: a
      });
    }
    o.uploadUrl ? (A.open("POST", o.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", l()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const o = this;
    let u = null, m = null;
    if (o.uploadedFiles.has(n))
      u = n, m = o.uploadedFiles.get(n);
    else
      for (const [A, f] of o.uploadedFiles)
        if (String(f.serverId) === String(n)) {
          u = A, m = f;
          break;
        }
    if (!u || !m || Z(o.dom, "ln-upload:before-remove", {
      localId: u,
      serverId: m.serverId
    }).defaultPrevented) return;
    const v = o.list ? o.list.querySelector('[data-ln-upload-local-id="' + u + '"]') : null;
    if (m.xhr && typeof m.xhr.abort == "function" && m.xhr.abort(), !m.serverId) {
      v && v.remove(), o.uploadedFiles.delete(u), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: u, serverId: null });
      return;
    }
    let S = null;
    if (o.deleteUrlPattern ? S = o.deleteUrlPattern.replace("{id}", encodeURIComponent(m.serverId)) : o.uploadUrl && o.uploadUrl.includes("{id}") && (S = o.uploadUrl.replace("{id}", encodeURIComponent(m.serverId))), !S) {
      v && v.remove(), o.uploadedFiles.delete(u), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: u, serverId: m.serverId });
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
        serverId: m.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: m,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: m,
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
          let m = null;
          n.deleteUrlPattern ? m = n.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (m = n.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), m && fetch(m, {
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
    attributes: p
  });
})();
function Xn(t, e) {
  if (t.length !== 1) return t;
  const i = t.charCodeAt(0);
  if (i >= 65 && i <= 90) {
    const s = ((i - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + s);
  }
  if (i >= 97 && i <= 122) {
    const s = ((i - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + s);
  }
  if (i >= 48 && i <= 57) {
    const s = ((i - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + s);
  }
  return t;
}
function Yn(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let s = "";
    const p = i.length;
    for (let h = 0; h < p; h++)
      s += String.fromCharCode(i[h]);
    return btoa(s);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function Jn(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), s = new Uint8Array(i.length);
      for (let p = 0; p < i.length; p++)
        s[p] = i.charCodeAt(p);
      return new TextDecoder().decode(s);
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
  let s;
  typeof TextEncoder < "u" ? s = new TextEncoder().encode(i) : typeof Buffer < "u" ? s = Buffer.from(i, "utf-8") : s = [108, 110];
  const p = s.length || 1, h = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    h[r] = t[r] ^ s[r % p];
  return h;
}
function ti(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let s;
  if (typeof TextEncoder < "u")
    s = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    s = Buffer.from(i, "utf-8");
  else
    return "";
  const p = Zn(s, e);
  let h = "";
  for (let r = 0; r < p.length; r++)
    h += String.fromCharCode(p[r]);
  return typeof btoa < "u" ? btoa(h) : typeof Buffer < "u" ? Buffer.from(p).toString("base64") : "";
}
function ei(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const i = String(t).trim();
    let s = "";
    if (typeof atob < "u")
      s = atob(i);
    else if (typeof Buffer < "u")
      s = Buffer.from(i, "base64").toString("binary");
    else
      return t;
    const p = new Uint8Array(s.length);
    for (let r = 0; r < s.length; r++)
      p[r] = s.charCodeAt(r);
    const h = Zn(p, e);
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
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", s = Number(t.shift) || 13, p = t.key || "ln-ashlar";
    return { codec: i, shift: s, key: p };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function lr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ni(e);
  return i.codec === "base64" ? Yn(t) : i.codec === "xor" ? ti(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (s) => Xn(s, i.shift));
}
function ge(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ni(e);
  return i.codec === "base64" ? Jn(t) : i.codec === "xor" ? ei(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (s) => Xn(s, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(r) {
    const l = r[e];
    l && l.deobfuscate();
  }
  const s = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function p(r) {
    return r[e] ? r[e] : (r[e] = this, this.dom = r, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  p.prototype.deobfuscate = function() {
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
    const c = this.dom.getAttribute(t), n = parseInt(c, 10), o = isNaN(n) ? 13 : n, u = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), m = this.dom.getAttribute("data-ln-obfuscator-key");
    let w = "rot";
    u === "xor" || u === "base64" ? w = u : m && (w = "xor");
    const v = m || "ln-ashlar", S = { codec: w, shift: o, key: v };
    if (r && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const A = this.dom.querySelectorAll(".sr-only");
      for (let _ = 0; _ < A.length; _++)
        A[_].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const f = (this.dom.rel || "").split(/\s+/).filter(function(_) {
        return _ && _ !== "noopener" && _ !== "noreferrer";
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
  }, p.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let r = 0; r < this._originalTextNodes.length; r++) {
          const l = this._originalTextNodes[r];
          l.node && l.raw && (l.node.nodeValue = l.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), L(this.dom, "ln-obfuscator:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  const h = j(t, e, p, "ln-obfuscator", {
    attributes: s
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
  function s(l) {
    l = l || document.body;
    for (const c of l.querySelectorAll("a, area"))
      i(c);
  }
  function p() {
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
      }), Vt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && i(c);
      });
    }, "ln-external-links");
  }
  function r() {
    p(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      s();
    }) : s();
  }
  window[t] = {
    process: s
  }, r();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function s() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function p(f) {
    i && (i.textContent = f, i.classList.add("ln-link-status--visible"));
  }
  function h() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function r(f, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const d = f.querySelector("a");
    if (!d) return;
    const a = d.getAttribute("href");
    if (!a) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(a, "_blank", "noopener,noreferrer");
      return;
    }
    Z(f, "ln-link:navigate", { target: f, href: a, link: d }).defaultPrevented || d.click();
  }
  function l(f) {
    const _ = f.querySelector("a");
    if (!_) return;
    const d = _.getAttribute("href");
    d && p(d);
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
    const _ = f.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const d = _ === "TABLE" && f.querySelector("tbody") || f;
      for (const a of d.querySelectorAll("tr"))
        o(a);
    } else
      o(f);
    delete f[e + "Init"];
  }
  function m(f) {
    if (f[e + "Init"]) return;
    f[e + "Init"] = !0;
    const _ = f.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const d = _ === "TABLE" && f.querySelector("tbody") || f;
      for (const a of d.querySelectorAll("tr"))
        n(a);
    } else
      n(f);
  }
  function w(f) {
    f.hasAttribute && f.hasAttribute(t) && m(f);
    const _ = f.querySelectorAll ? f.querySelectorAll("[" + t + "]") : [];
    for (const d of _)
      m(d);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(_) {
        for (const d of _)
          if (d.type === "childList") {
            for (const a of d.addedNodes)
              if (a.nodeType === 1) {
                w(a);
                const g = a.closest("[" + t + "]");
                if (g)
                  if (a.tagName === "TR")
                    n(a);
                  else {
                    const b = g.tagName;
                    if (b === "TABLE" || b === "TBODY") {
                      const T = a.querySelectorAll ? a.querySelectorAll("tr") : [];
                      for (const y of T)
                        n(y);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(_) {
        _.hasAttribute && _.hasAttribute(t) ? w(_) : u(_);
      });
    }, "ln-link");
  }
  function S(f) {
    w(f);
  }
  window[e] = { init: S, destroy: u };
  function A() {
    s(), v(), S(document.body);
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
  function s(p) {
    if (p[e]) return p[e];
    if (!(!p || p.tagName !== "A" && p.tagName !== "BUTTON"))
      return p[e] = this, this.dom = p, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  s.prototype._handleClick = function(p) {
    if (this.dom.tagName === "A" && (p.ctrlKey || p.metaKey || p.shiftKey || p.altKey || p.button !== 0))
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
    p.preventDefault();
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
    const m = this.dom.getAttribute("data-ln-scroll-focus");
    if (m !== "false" && m !== "0") {
      const w = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), v = isNaN(w) ? 450 : w;
      window.setTimeout(function() {
        let S = null;
        if (m && m !== "true" && m !== "1")
          try {
            S = document.querySelector(m);
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
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), L(this.dom, "ln-scroll:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, s, "ln-scroll", {
    attributes: i
  });
})();
const Ut = ["Ctrl", "Alt", "Shift", "Meta"], cr = {
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
  const i = e.split("+"), s = /* @__PURE__ */ new Set();
  let p = "";
  for (let r = 0; r < i.length; r++) {
    const l = ii(i[r]);
    if (!l) return "";
    if (Ut.indexOf(l) !== -1) {
      s.add(l);
      continue;
    }
    if (p) return "";
    p = l;
  }
  if (!p) return "";
  const h = [];
  for (let r = 0; r < Ut.length; r++)
    s.has(Ut[r]) && h.push(Ut[r]);
  return h.push(p), h.join("+");
}
function dr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), s = [];
  for (let p = 0; p < i.length; p++) {
    const h = ri(i[p]);
    h && s.indexOf(h) === -1 && s.push(h);
  }
  return s;
}
function ur(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const s = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(s) ? "" : ri(s ? s + "+" + i : i);
}
function fr(t) {
  if (!t) return "";
  const e = ii(t.key);
  if (!e || Ut.indexOf(e) !== -1) return "";
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
function pr(t, e, i, s) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const p = String(e.tagName || "").toLowerCase();
  return p === "button" ? s === "Enter" || s === "Space" : p === "a" && e.hasAttribute && e.hasAttribute("href") && s === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", s = "data-ln-key-allow-input", p = "data-ln-key-modifier", h = "data-ln-key-for", r = "lnKeyFor";
  if (window[e] !== void 0) return;
  function l(_) {
    const d = _[e];
    if (d) {
      if (!_.hasAttribute(t)) {
        d.destroy();
        return;
      }
      d.sync();
    }
  }
  function c(_) {
    const d = _[r];
    d && !_.hasAttribute(h) && d.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: l, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: l, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: l, description: "Permits shortcut execution even when focused inside an editable input" }
  }, o = {
    "data-ln-key-for": { type: "string", effect: c, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, u = /* @__PURE__ */ new Set();
  let m = null;
  function w() {
    m || (m = function(_) {
      if (_.defaultPrevented || _.isComposing || _.repeat) return;
      const d = fr(_);
      if (!d) return;
      const a = qi(_.target), g = document.querySelectorAll("[" + t + "], [" + h + "]");
      let b = null, T = !1, y = !1;
      for (let q = 0; q < g.length; q++) {
        const D = g[q], I = D[e] || D[r];
        if (!I || !I.matches(d) || a && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = hr(R);
        if (!(!O || !xi(R, O))) {
          if (pr(_, R, O, d)) {
            y = !0;
            continue;
          }
          b ? T = !0 : b = { host: D, target: R, action: O };
        }
      }
      if (y || !b) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + d + '"; first DOM match wins.');
      const E = {
        source: b.host,
        target: b.target,
        action: b.action,
        key: d,
        event: _
      };
      Z(b.host, "ln-key:before-trigger", E).defaultPrevented || (_.preventDefault(), b.target[b.action](), L(b.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", m));
  }
  function v() {
    u.size > 0 || !m || (document.removeEventListener("keydown", m), m = null);
  }
  function S(_) {
    return this.dom = _, this.shortcuts = [], u.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = dr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(_) {
    return this.shortcuts.indexOf(_) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(s);
  }, S.prototype.resolveTarget = function() {
    const _ = this.dom.getAttribute(i);
    return _ ? f(_, i) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (u.delete(this), delete this.dom[e], v(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(_) {
    return this.dom = _, u.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + p + "]");
  }, A.prototype.shortcut = function() {
    const _ = this._modifierContext(), d = _ ? _.getAttribute(p) : "";
    return ur(d, this.dom.textContent);
  }, A.prototype.matches = function(_) {
    return this.shortcut() === _;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(s)) return !0;
    const _ = this._modifierContext();
    return !!(_ && _.hasAttribute(s));
  }, A.prototype.resolveTarget = function() {
    return f(this.dom.getAttribute(h), h);
  }, A.prototype.destroy = function() {
    this.dom[r] && (u.delete(this), delete this.dom[r], v(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function f(_, d) {
    if (!_) return null;
    try {
      const a = document.querySelector(_);
      return a || console.warn("[ln-key] Target not found for " + d + ' selector "' + _ + '".'), a;
    } catch {
      return console.warn("[ln-key] Invalid " + d + ' selector "' + _ + '".'), null;
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
    const s = parseFloat(String(e));
    if (!isNaN(s) && s > 0) return s;
  }
  if (t != null && t !== "") {
    const s = parseFloat(String(t));
    if (!isNaN(s) && s > 0) return s;
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
  const s = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function p(l) {
    return this.dom = l, this._parentObserver = null, r.call(this), h.call(this), this;
  }
  p.prototype.destroy = function() {
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
    const l = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, o = this.dom.getAttribute("data-ln-progress-max"), u = mr(o, n, 100), m = Rn(l, u);
    this.dom.style.width = m.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(m.min)), this.dom.setAttribute("aria-valuemax", String(m.max)), this.dom.setAttribute("aria-valuenow", String(m.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: m.value,
      max: m.max,
      percentage: m.percentage
    });
  }
  j(
    t,
    e,
    p,
    "ln-progress",
    {
      attributes: s
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
  const s = Object.keys(e);
  if (s.length === 0) return !0;
  for (let p = 0; p < s.length; p++) {
    const h = e[s[p]];
    let r = "";
    if (h.col !== null && h.col !== void 0 ? r = t[h.col] || "" : h.attr && i && typeof i.getAttribute == "function" && (r = i.getAttribute(h.attr) || ""), !Re(r, h.values))
      return !1;
  }
  return !0;
}
function Ze(t, e, i, s) {
  if (s != null && !isNaN(s))
    return parseInt(s, 10);
  if (e && typeof e.getAttribute == "function") {
    const p = e.getAttribute("data-ln-filter-col");
    if (p !== null && !isNaN(parseInt(p, 10)))
      return parseInt(p, 10);
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
    const p = t.querySelectorAll("thead th, tr:first-child th"), h = String(i).trim().toLowerCase();
    for (let r = 0; r < p.length; r++) {
      const l = p[r], c = l.getAttribute("data-ln-table-filter-col") || l.getAttribute("data-ln-filter-col") || l.getAttribute("data-ln-filter-key") || l.getAttribute("data-ln-table-col") || l.getAttribute("data-ln-col") || l.getAttribute("data-ln-field");
      if (c && c.trim().toLowerCase() === h)
        return typeof l.cellIndex == "number" ? l.cellIndex : r;
    }
    if (e) {
      const r = e.closest ? e.closest("[data-ln-popover], [id]") : null, l = r && r.id || e.id || null;
      if (l)
        for (let c = 0; c < p.length; c++) {
          const n = p[c];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + l + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : c;
        }
    }
    for (let r = 0; r < p.length; r++) {
      const l = p[r], n = Array.from(l.childNodes || []).filter((u) => u.nodeType === 3), o = (n.length > 0 ? n.map((u) => u.textContent.trim()).join(" ") : l.textContent || "").trim().toLowerCase();
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
  for (let s = 0; s < t.length; s++) {
    const p = t[s];
    !e && p.key && (e = p.key), p.checked && !p.isReset && p.value && i.push(p.value);
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
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", s = "data-ln-filter-value", p = "data-ln-filter-hide", h = "data-ln-filter-reset", r = "data-ln-filter-col", l = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-filter": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: _, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: _, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" }
  }, u = et(o);
  function m(d) {
    return d.hasAttribute(h) || !d.getAttribute(s);
  }
  function w(d) {
    const a = d.dom.querySelectorAll("[" + i + "]"), g = [];
    for (let T = 0; T < a.length; T++) {
      const y = a[T];
      g.push({
        key: y.getAttribute(i),
        value: y.getAttribute(s) || "",
        checked: y.checked,
        isReset: m(y)
      });
    }
    const b = yr(g);
    return { key: b.key, values: b.values, targetId: d.targetId };
  }
  function v(d, a, g) {
    const b = d.querySelectorAll("[" + i + "]"), T = Array.isArray(g) && g.length > 0;
    for (let y = 0; y < b.length; y++) {
      const E = b[y];
      m(E) ? E.checked = !T : T && E.getAttribute(i) === a && g.indexOf(E.getAttribute(s)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(d) {
    this.dom = d, tt(this, d, u);
    const a = d.getAttribute(r);
    this.colIndex = a !== null ? parseInt(a, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(d, "filter"), this.hashEnabled = !!this.nsKey;
    const g = this, b = oe(function() {
      g._render();
    });
    this._queueRender = b, this._attachHandlers(), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const y = ot(g.nsKey), E = be(y);
      E && E.key && E.values.length > 0 ? v(g.dom, E.key, E.values) : v(g.dom, null, []), g._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const y = ot(this.nsKey), E = be(y);
      E && E.key && E.values.length > 0 && (v(d, E.key, E.values), mt(function() {
        g._destroyed || g._render();
      }), T = !0);
    }
    if (!T) {
      const y = tn(d.getAttribute(c));
      if (y.length > 0) {
        const E = d.querySelector("[" + i + "]"), C = E ? E.getAttribute(i) : null;
        C && (v(d, C, y), mt(function() {
          g._destroyed || g._render();
        }), T = !0);
      }
    }
    if (!T) {
      const y = d.querySelectorAll("[" + i + "]");
      for (let E = 0; E < y.length; E++)
        if (y[E].checked && !m(y[E])) {
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
    this._onDomChange = function(a) {
      const g = a.target;
      if (!g || !g.hasAttribute || !g.hasAttribute(i)) return;
      const b = Array.from(d.dom.querySelectorAll("[" + i + "]"));
      if (m(g)) {
        for (let T = 0; T < b.length; T++)
          m(b[T]) || (b[T].checked = !1);
        g.checked = !0, d._queueRender();
        return;
      }
      if (g.checked) {
        for (let y = 0; y < b.length; y++)
          m(b[y]) && (b[y].checked = !1);
        let T = !1;
        for (let y = 0; y < b.length; y++)
          if (m(b[y])) {
            T = !0;
            break;
          }
        if (T) {
          let y = !0;
          for (let E = 0; E < b.length; E++)
            if (!m(b[E]) && !b[E].checked) {
              y = !1;
              break;
            }
          if (y)
            for (let E = 0; E < b.length; E++)
              m(b[E]) ? b[E].checked = !0 : b[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let y = 0; y < b.length; y++)
          if (!m(b[y]) && b[y].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let y = 0; y < b.length; y++)
            m(b[y]) && (b[y].checked = !0);
      }
      d._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const d = this, a = w(this), g = this._lastSnapshot;
    if (!(!g || g.key !== a.key || gr(g.values, a.values))) return;
    const T = a.key === null || a.values.length === 0, y = document.getElementById(d.targetId), E = {
      key: a.key,
      values: a.values.slice(),
      targetId: d.targetId
    };
    L(d.dom, "ln-filter:change", E);
    let C = !1;
    y && y !== d.dom && Z(y, "ln-filter:change", E).defaultPrevented && (C = !0);
    const q = g && g.values.length > 0, D = a.values.length === 0;
    if (q && D) {
      const O = { targetId: d.targetId };
      L(d.dom, "ln-filter:reset", O), y && y !== d.dom && L(y, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: a.key, values: a.values.slice() };
    const I = br(a.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = In(a.key, a.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = y && (y.tagName === "TABLE" ? y : y.querySelector ? y.querySelector("table") : null);
    if (R)
      d._filterTableRows(a, R);
    else {
      if (!y) return;
      const O = y.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(p), T) continue;
        const H = B.getAttribute("data-" + a.key);
        H !== null && (Re(H, a.values) || B.setAttribute(p, "true"));
      }
    }
  };
  function A(d) {
    if (!d) return "";
    const a = d.querySelector ? d.querySelector("[data-ln-value]") : null;
    return vt(a || d);
  }
  function f(d) {
    return !!(!d || typeof d != "object" || d.tagName === "TEMPLATE" || typeof d.hasAttribute == "function" && (d.hasAttribute("data-ln-sort-exclude") || d.hasAttribute("hidden")) || d.classList && d.classList.contains("hidden") || d.style && d.style.display === "none" || typeof d.matches == "function" && d.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof d.querySelector == "function" && d.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(d, a) {
    if (!a) {
      const C = document.getElementById(this.targetId);
      if (!C || (a = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !a)) return;
    }
    const g = Ze(a, this.dom, d.key, this.colIndex), b = d.key || this.dom.getAttribute("data-ln-filter-key") || (g !== null ? "col" + g : "attr-filter"), T = d.values;
    n.has(a) || n.set(a, {});
    const y = n.get(a);
    b && T.length > 0 ? y[b] = {
      col: g,
      values: T.slice(),
      attr: "data-" + b
    } : b && delete y[b];
    const E = a.tBodies;
    for (let C = 0; C < E.length; C++) {
      const q = E[C].rows;
      for (let D = 0; D < q.length; D++) {
        const I = q[D];
        if (f(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        _r(R, y, I) ? I.removeAttribute(p) : I.setAttribute(p, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const d = document.getElementById(this.targetId);
    if (d) {
      const a = d.tagName === "TABLE" ? d : d.querySelector ? d.querySelector("table") : null;
      if (a && n.has(a)) {
        const g = n.get(a), b = Ze(a, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (b !== null ? "col" + b : this.colIndex !== null ? "col" + this.colIndex : null);
        T && g[T] && (delete g[T], this._filterTableRows({ key: null, values: [] }, a)), Object.keys(g).length === 0 && n.delete(a);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function _(d, a) {
    const g = d[e];
    if (!(!g || g._destroyed)) {
      if (a === l)
        g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = wt(d, "filter"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange);
      else if (a === c) {
        const b = tn(d.getAttribute(c)), T = d.querySelector("[" + i + "]"), y = T ? T.getAttribute(i) : null;
        y && (v(d, y, b), g._render());
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
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", s = "lnSearchControl", p = "data-ln-search-items", h = "data-ln-search-fields", r = "data-ln-search-exclude", l = "data-ln-search-hide", c = "data-ln-hash";
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
  function u(a) {
    const g = wt(a, "search");
    if (g) return g;
    if (a.id) {
      const b = document.querySelector("[" + i + '="' + a.id + '"]');
      if (b) {
        const T = wt(b, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function m(a) {
    return a.matches("input, textarea") ? a : a.querySelector("input, textarea");
  }
  function w(a, g) {
    const b = a.childNodes;
    for (let T = 0; T < b.length; T++) {
      const y = b[T];
      if (y.nodeType === 3) {
        g.push(y.nodeValue);
        continue;
      }
      y.nodeType === 1 && (y.hasAttribute(r) || w(y, g));
    }
  }
  function v(a) {
    if (a._lnSearchText !== void 0) return a._lnSearchText;
    const g = [];
    w(a, g);
    const b = Vi(g);
    return a._lnSearchText = b, b;
  }
  function S(a, g) {
    if (!a.id) return;
    const b = document.querySelectorAll("[" + i + '="' + a.id + '"]');
    for (const T of b) {
      const y = m(T);
      y && y.value !== g && (y.value = g);
    }
  }
  function A(a) {
    this.dom = a, this.term = a.getAttribute(t) || "", this._destroyed = !1;
    const g = this;
    return this.nsKey = u(a), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const b = ot(g.nsKey), T = g.dom.getAttribute(t) || "";
      b !== null && b !== T ? g.dom.setAttribute(t, b) : b === null && T !== "" && g.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!g._destroyed) {
        if (g.hashEnabled) {
          const b = ot(g.nsKey);
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
    const a = this.dom, g = we(this.term), b = Mn(g);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = ji(a.getAttribute(h));
    if (Z(a, "ln-search:change", {
      term: g,
      tokens: b,
      targetId: a.id,
      fields: T
    }).defaultPrevented) return;
    const E = a.getAttribute(p), C = E ? a.querySelectorAll(E) : a.children;
    for (let q = 0; q < C.length; q++) {
      const D = C[q];
      if (D.removeAttribute(l), D.hasAttribute(r) || b.length === 0) continue;
      const I = v(D);
      Nn(I, b) || D.setAttribute(l, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function f(a) {
    if (this.dom = a, tt(this, a, o), this.input = m(a), this._attachHandler(), this.input && this.input.value.trim()) {
      const g = this;
      mt(function() {
        const b = document.getElementById(g.targetId);
        b && ((b.getAttribute(t) || "").trim() || g._write(g.input.value));
      });
    }
    return this;
  }
  f.prototype._write = function(a) {
    const g = document.getElementById(this.targetId);
    g && g.getAttribute(t) !== a && g.setAttribute(t, a);
  }, f.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      a._write(a.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype.destroy = function() {
    this.dom[s] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[s]);
  };
  function _(a) {
    const g = a.getAttribute("data-ln-search-clear-for");
    if (g) {
      const C = document.getElementById(g), q = document.querySelector("[" + i + '="' + g + '"]'), D = q ? m(q) : null;
      return { target: C, input: D };
    }
    const b = a.closest("[" + t + "]");
    if (b) {
      const C = b.id ? document.querySelector("[" + i + '="' + b.id + '"]') : null, q = C ? m(C) : null;
      return { target: b, input: q };
    }
    const T = a.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), q = C ? document.getElementById(C) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + i + '="' + C + '"]'), I = D ? m(D) : null;
        return { target: q, input: I };
      }
    }
    const y = a.closest("[" + i + "]");
    if (y) {
      const C = y.getAttribute(i), q = C ? document.getElementById(C) : null, D = m(y);
      return { target: q, input: D };
    }
    const E = a.parentElement;
    if (E) {
      const C = E.querySelector("[" + i + "]");
      if (C) {
        const q = C.getAttribute(i), D = q ? document.getElementById(q) : null, I = m(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(a) {
    const g = a.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!g) return;
    const b = _(g);
    !b.target && !b.input || (a.preventDefault(), b.input && (b.input.value = "", b.input.focus()), b.target && b.target.setAttribute(t, ""));
  });
  function d(a, g) {
    const b = a[e];
    if (!b || b._destroyed) return;
    if (g === c) {
      b._onHashChange && window.removeEventListener("hashchange", b._onHashChange), b.nsKey = u(a), b.hashEnabled = !!b.nsKey, b.hashEnabled && window.addEventListener("hashchange", b._onHashChange);
      return;
    }
    const T = a.getAttribute(t) || "";
    T !== b.term && (b.term = T, S(a, T), b._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(a, g) {
      const b = g.target;
      b && b._lnSearchText !== void 0 && delete b._lnSearchText, b && b.parentElement && b.parentElement._lnSearchText !== void 0 && delete b.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(a) {
        return !!u(a);
      }
    }
  }), j(i, s, f, "ln-search-control");
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
function Er(t, e, i, s) {
  const p = St(t);
  if (p === "none") return () => 0;
  const h = p === "desc" ? -1 : 1, r = typeof s == "function" ? s : (l) => l;
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
    const s = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (s)
      return Array.from(s.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", s = "data-ln-sort-state", p = "data-ln-sort-dir", h = "data-ln-hash";
  if (window[e] !== void 0) return;
  function r(w, v) {
    return w.getAttribute(v) || null;
  }
  const l = {
    "data-ln-sort": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: r, effect: m, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: r, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: m, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: m, description: "URL hash routing key for sort state persistence" }
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
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(s)), w.hasAttribute(s) || w.setAttribute(s, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(f) {
      const _ = f.target.closest("[" + p + "]");
      if (!_) return;
      const d = St(_.getAttribute(p));
      S._apply(d);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(f) {
      if (S._destroyed || !f.detail) return;
      const _ = S._resolveTarget();
      if (!(_ && (f.target === _ || _.contains(f.target)) || f.detail.targetId && f.detail.targetId === S.targetId)) return;
      if (wr(
        { field: S.field, column: S.column },
        { field: f.detail.field, column: f.detail.column }
      )) {
        const g = St(f.detail.direction);
        g && w.getAttribute(s) !== g && (S._state = g, w.setAttribute(s, g), S._updateAriaSort(g));
        return;
      }
      w.getAttribute(s) !== "none" && (S._state = "none", w.setAttribute(s, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const f = ot(S.nsKey), _ = ye(f);
      if (_)
        S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn ? S._state !== _.direction && S._apply(_.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(s, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(s, "none"), S._updateAriaSort("none");
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
      const f = ot(this.nsKey), _ = ye(f);
      _ && ((S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(_.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const f = St(w.getAttribute(s));
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
    this._state = S, this.dom.getAttribute(s) !== S && this.dom.setAttribute(s, S), this._updateAriaSort(S);
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
    let _;
    if (v === "none") {
      const g = n.get(w) || f;
      n.delete(w), _ = g.filter(function(b) {
        return b.parentNode === A && !_e(b);
      });
    } else {
      const g = this.field, b = this.column, T = f.map(function(q) {
        return o(q, g, b);
      }), y = ke(T), E = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Er(v, y, E, function(q) {
        return o(q, g, b);
      });
      _ = f.slice().sort(C);
    }
    const d = document.createDocumentFragment();
    let a = 0;
    for (let g = 0; g < S.length; g++) {
      const b = S[g];
      _e(b) ? d.appendChild(b) : a < _.length && d.appendChild(_[a++]);
    }
    A.appendChild(d);
  }, u.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function m(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === i) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === s) {
        const A = St(w.getAttribute(s));
        A !== S._state && S._apply(A);
      } else v === h && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, u, "ln-sort", {
    attributes: l,
    persist: {
      attr: s,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function en(t, e, i, s, p = 15) {
  if (s <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const h = Math.max(0, t || 0), r = Math.max(0, e || 0), l = Math.floor(h / i), c = Math.ceil(r / i), n = Math.max(0, l - p), o = Math.min(s, l + c + p), u = n * i, m = Math.max(0, (s - o) * i);
  return { start: n, end: o, topPadding: u, bottomPadding: m };
}
function Sr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, s = e instanceof Set ? e : new Set(e || []);
  let p = 0;
  if (Array.isArray(t))
    for (let l = 0; l < t.length; l++)
      s.has(t[l]) && p++;
  else
    p = s.size;
  const h = i > 0 && p === i, r = p > 0 && p < i;
  return { totalCount: i, selectedCount: p, isAllSelected: h, isIndeterminate: r };
}
function nn(t, e, i) {
  const s = new Set(t);
  return e == null || ((i !== void 0 ? i : !s.has(e)) ? s.add(e) : s.delete(e)), s;
}
function rn(t, e, i) {
  const s = new Set(t);
  if (!Array.isArray(e)) return s;
  if (i)
    for (let p = 0; p < e.length; p++)
      e[p] != null && s.add(e[p]);
  else
    for (let p = 0; p < e.length; p++)
      s.delete(e[p]);
  return s;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function c(f, _) {
    if (!f || !f.isDataDriven) return;
    const d = f.dom.hasAttribute("data-ln-table-window");
    if (d && !f._windowed)
      f._enterWindowedMode(), f._kickWindowInitial();
    else if (!d && f._windowed)
      f._exitWindowedMode();
    else if (d && f._windowed) {
      const a = parseInt(_, 10);
      a > 0 && f._cache.configure({ windowSize: a });
    }
  }
  function n(f, _) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(_, 10);
    d > 0 && f._cache.configure({ pageSize: d });
  }
  function o(f, _) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(_, 10);
    d >= 0 && f._cache.configure({ threshold: d });
  }
  function u(f, _) {
    if (!f || !f.isDataDriven || !f._windowed || !f._cache) return;
    const d = parseInt(_, 10);
    d >= 0 && f._cache.setGrandTotal(d);
  }
  const m = {
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
  }, w = et(m);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(f, _) {
    if (f == null || isNaN(f)) return "";
    try {
      return new Intl.NumberFormat(it(_)).format(f);
    } catch {
      return String(f);
    }
  }
  function S(f) {
    let _ = f.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const a = getComputedStyle(_).overflowY;
      if (a === "auto" || a === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function A(f) {
    this.dom = f, tt(this, f, w), this.table = f.querySelector("table"), this.tbody = f.querySelector("[data-ln-table-body]") || f.querySelector("tbody"), this.thead = f.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = f.querySelector("[data-ln-table-total]"), this._filteredSpan = f.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== f ? this._filteredSpan.parentElement : null), this._selectedSpan = f.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== f ? this._selectedSpan.parentElement : null), this.isDataDriven = f.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const d = this;
    return this._onSetSearch = function(a) {
      const g = (a.detail && a.detail.query != null ? a.detail.query : a.detail && a.detail.term != null ? a.detail.term : "").trim();
      d.isDataDriven ? (d.currentSearch = g, L(f, "ln-table:search", {
        table: d.name,
        query: d.currentSearch
      }), d._requestData()) : (d._searchTerm = g.toLowerCase(), d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(f, "ln-table:filter", {
        term: d._searchTerm,
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, f.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(a) {
      a.preventDefault(), d._onSetSearch(a);
    }, f.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      d.isDataDriven ? (d.currentFilters = {}, d.currentSearch = "", L(f, "ln-table:clear-filters", { table: d.name }), d._requestData()) : (d._searchTerm = "", d._columnFilters = {}, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(f, "ln-table:filter", {
        term: "",
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, f.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && f.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(a) {
      const g = a.detail || {}, b = g.data || [], T = g.total != null ? g.total : b.length;
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
    }, f.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(a) {
      const g = a.detail && a.detail.loading;
      f.classList.toggle("ln-table--loading", !!g), g && (d.isLoaded = !1);
    }, f.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(a) {
      !d._windowed || !d._cache || d._cache.release(a.detail && a.detail.offset);
    }, f.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !d._windowed || !d._cache || d._cache.revalidate();
    }, f.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !d._windowed || !d._cache || d._requestData();
    }, f.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(a) {
      a.preventDefault(), d.currentSort = a.detail.direction === "none" ? null : { field: a.detail.field, direction: a.detail.direction }, d._requestData();
    }, f.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(a) {
      if (a.target.closest("[data-ln-table-row-select]") || a.target.closest("[data-ln-table-row-action]") || a.target.closest("a") || a.target.closest("button") || a.ctrlKey || a.metaKey || a.button === 1) return;
      const g = a.target.closest("[data-ln-table-row]");
      if (!g) return;
      const b = g.getAttribute("data-ln-table-row-id"), T = g._lnRecord || {};
      L(f, "ln-table:row-click", {
        table: d.name,
        id: b,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(a) {
      const g = a.target.closest("[data-ln-table-row-action]");
      if (!g) return;
      const b = g.closest("[data-ln-table-row]");
      if (!b) return;
      const T = g.getAttribute("data-ln-table-row-action"), y = b.getAttribute("data-ln-table-row-id"), E = b._lnRecord || {};
      L(f, "ln-table:row-action", {
        table: d.name,
        id: y,
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
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(a) {
      a.preventDefault();
      const g = a.detail.direction === "none" ? null : a.detail.direction;
      d._sortCol = g === null ? -1 : a.detail.column, d._sortDir = g, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), L(f, "ln-table:sorted", {
        column: a.detail.column,
        direction: a.detail.direction,
        matched: d._filteredData.length,
        total: d._data.length
      });
    }, f.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(a) {
      if (a.preventDefault(), !a.detail) return;
      const g = a.detail.key, b = a.detail.values || [];
      if (g) {
        if (b.length === 0)
          delete d._columnFilters[g];
        else {
          const T = [];
          for (let y = 0; y < b.length; y++)
            T.push(b[y].toLowerCase());
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
    const f = this.tbody.rows, _ = this.ths;
    this._data = [], f.length > 0 && (this._rowHeight = f[0].offsetHeight || 40), this._lockColumnWidths();
    for (let d = 0; d < f.length; d++) {
      const a = f[d], g = [], b = [], T = [];
      for (let E = 0; E < a.cells.length; E++) {
        const C = a.cells[E], q = C.textContent.trim();
        g[E] = vt(C), b[E] = q.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(q.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const E = a.getAttribute("data-ln-table-row-id");
        E != null && (y.id = E);
        for (let C = 0; C < _.length; C++) {
          const q = _[C].getAttribute("data-ln-table-col");
          if (q) {
            const D = C;
            if (D < a.cells.length) {
              const I = a.cells[D];
              y[q] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: g,
        rawTexts: b,
        html: a.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
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
    this.ths.forEach(function(_) {
      const d = document.createElement("col");
      d.style.width = _.offsetWidth + "px", f.appendChild(d);
    }), this.table.insertBefore(f, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = f;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const f = this._lastTotal, _ = this.visibleCount;
        if (f === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
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
      const f = this._filteredData, _ = document.createDocumentFragment();
      for (let d = 0; d < f.length; d++) {
        const a = this._buildRow(f[d]);
        if (!a) break;
        _.appendChild(a);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const f = [], _ = this._filteredData;
      for (let d = 0; d < _.length; d++) f.push(_[d].html);
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
          const a = this._cache ? this._cache.peek() : null;
          d = a ? this._buildRow(a) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (d = this._buildRow(this._data[0]));
        d && this.tbody && (this.tbody.appendChild(d), this._rowHeight = d.offsetHeight || 40, d.remove());
      }
    this.isDataDriven ? this._scrollContainer = S(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      f._rafId || (f._rafId = requestAnimationFrame(function() {
        f._rafId = null, f._windowed ? f._renderWindowed() : f._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const f = this._filteredData, _ = f.length, d = this._rowHeight;
    if (!d || !_) return;
    const a = this.thead ? this.thead.offsetHeight : 0, g = this._scrollContainer;
    let b, T;
    if (g) {
      const R = this.table.getBoundingClientRect(), O = g.getBoundingClientRect(), P = R.top - O.top + g.scrollTop + a;
      b = g.scrollTop - P, T = g.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + a;
      b = window.scrollY - P, T = window.innerHeight;
    }
    const y = en(b, T, d, _, 15), E = y.start, C = y.end;
    if (E === this._vStart && C === this._vEnd) return;
    this._vStart = E, this._vEnd = C;
    const q = this.ths.length || 1, D = y.topPadding, I = y.bottomPadding;
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
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", f.appendChild(_), f;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const f = this._rowHeight;
    if (!f) return;
    const _ = this._cache.logicalTotal, d = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let g, b;
    if (a) {
      const R = this.table.getBoundingClientRect(), O = a.getBoundingClientRect(), P = R.top - O.top + a.scrollTop + d;
      g = a.scrollTop - P, b = a.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + d;
      g = window.scrollY - P, b = window.innerHeight;
    }
    const T = en(g, b, f, _, 15), y = T.start, E = T.end, C = this.ths.length || 1, q = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (q > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = q + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = y; R < E; R++)
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
    this.tbody.replaceChildren(I), this._vStart = y, this._vEnd = E, this._cache.ensure(y, E);
  }, A.prototype._showEmptyState = function() {
    const f = this.ths.length || 1;
    let _ = null, d = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount === 0 && a > 0, T = b ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = Ct(this.dom, T, "ln-table"), !d) {
        const y = this.dom.querySelector("template[data-ln-table-empty]");
        if (y) {
          const E = b ? "search" : "initial", C = y.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || y.content.firstElementChild;
          C && (d = document.importNode(C, !0));
        }
      }
      if (d)
        if (d.tagName === "TR")
          _ = d;
        else {
          const y = document.createElement("td");
          y.setAttribute("colspan", String(f)), y.appendChild(d);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(y), _ = E;
        }
    } else {
      const a = this.dom.querySelector("template[" + i + "]"), g = document.createElement("td");
      g.setAttribute("colspan", String(f)), a && g.appendChild(document.importNode(a.content, !0));
      const b = document.createElement("tr");
      b.className = "ln-table__empty", b.appendChild(g), _ = b;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(f, _) {
    jt(f, _);
    const d = f.querySelectorAll("[data-ln-table-cell-attr]");
    for (let a = 0; a < d.length; a++) {
      const g = d[a], b = g.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < b.length; T++) {
        const y = b[T].trim().split(":");
        if (y.length !== 2) continue;
        const E = y[0].trim(), C = y[1].trim();
        _[E] != null && g.setAttribute(C, _[E]);
      }
    }
  }, A.prototype._buildRow = function(f) {
    let _ = Ct(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const a = this.dom.querySelector("template[data-ln-table-row]");
      a && (_ = document.importNode(a.content, !0));
    }
    let d = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (d)
      this._fillRow(d, f);
    else if (f && f.html) {
      const a = document.createElement("tbody");
      a.innerHTML = f.html, d = a.firstElementChild;
    } else {
      d = document.createElement("tr"), d.setAttribute("data-ln-table-row", "");
      const a = this.ths;
      for (let g = 0; g < a.length; g++) {
        const b = a[g].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (b) {
          const y = document.createElement("input");
          y.type = "checkbox", y.setAttribute("data-ln-table-row-select", ""), y.setAttribute("aria-label", "Select row"), T.appendChild(y);
        } else {
          const y = a[g].getAttribute("data-ln-table-col");
          y && f[y] != null && (T.textContent = String(f[y]));
        }
        d.appendChild(T);
      }
    }
    if (d._lnRecord = f, f.id != null && d.setAttribute("data-ln-table-row-id", f.id), this._selectable && f.id != null && this.selectedIds.has(String(f.id))) {
      d.classList.add("ln-row-selected");
      const a = d.querySelector("[data-ln-table-row-select]");
      a && (a.checked = !0);
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
    const f = this, _ = this.dom, d = parseInt(_.getAttribute("data-ln-table-window"), 10), a = parseInt(_.getAttribute("data-ln-table-window-page"), 10), g = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !f._windowed || !f._cache || (f.totalCount = f._cache.grandTotal, f.visibleCount = f._cache.logicalTotal, f._lastTotal = f._cache.grandTotal, f.isLoaded = !0, f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), L(_, "ln-table:rendered", {
        table: f.name,
        total: f.totalCount,
        visible: f.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Ln({
      windowSize: d > 0 ? d : 1e3,
      pageSize: a > 0 ? a : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(b, T, y) {
        L(_, "ln-table:request-data", {
          table: f.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
          offset: T,
          limit: y,
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
      const _ = f > 0 ? f : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: _,
        filtered: _
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
    const f = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let a = 0; a < f.length; a++) {
      const g = f[a].getAttribute("data-ln-table-row-id");
      g != null && _.push(g);
    }
    const d = Sr(_, this.selectedIds);
    this._selectAllCheckbox.checked = d.isAllSelected, this._selectAllCheckbox.indeterminate = d.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const f = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < f.length; _++) {
      const d = f[_].getAttribute("data-ln-table-row-id"), a = d != null && this.selectedIds.has(d);
      f[_].classList.toggle("ln-row-selected", a);
      const g = f[_].querySelector("[data-ln-table-row-select]");
      g && (g.checked = a);
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
    if (this._onSelectionChange = function(_) {
      const d = _.target.closest("[data-ln-table-row-select]");
      if (!d) return;
      const a = d.closest("[data-ln-table-row]");
      if (!a) return;
      const g = a.getAttribute("data-ln-table-row-id");
      g != null && (f.selectedIds = nn(f.selectedIds, g, d.checked), a.classList.toggle("ln-row-selected", d.checked), f.selectedCount = f.selectedIds.size, f._updateSelectAll(), f._updateFooter(), L(f.dom, "ln-table:select", {
        table: f.name,
        selectedIds: f.selectedIds,
        count: f.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const d = f.dom.querySelector('[data-ln-table-dict="select-all"]'), a = f.dom.getAttribute("data-ln-table-select-all-label") || (d ? d.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", a), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = f._selectAllCheckbox.checked, d = f.tbody ? f.tbody.querySelectorAll("[data-ln-table-row]") : [], a = [];
      for (let g = 0; g < d.length; g++) {
        const b = d[g].getAttribute("data-ln-table-row-id"), T = d[g].querySelector("[data-ln-table-row-select]");
        b != null && (a.push(b), d[g].classList.toggle("ln-row-selected", _), T && (T.checked = _));
      }
      f.selectedIds = rn(f.selectedIds, a, _), f.selectedCount = f.selectedIds.size, L(f.dom, "ln-table:select-all", {
        table: f.name,
        selected: _
      }), L(f.dom, "ln-table:select", {
        table: f.name,
        selectedIds: f.selectedIds,
        count: f.selectedCount
      }), f._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < _.length; d++) {
        const a = _[d].querySelector("[data-ln-table-row-select]"), g = _[d].getAttribute("data-ln-table-row-id");
        a && a.checked && g != null && (f.selectedIds = nn(f.selectedIds, g, !0), _[d].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const f = this.dom.querySelector("[data-ln-table-col-select]");
    if (f) {
      const _ = f.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = rn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < _.length; d++) {
        _[d].classList.remove("ln-row-selected");
        const a = _[d].querySelector("[data-ln-table-row-select]");
        a && (a.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let f = 0, _ = 0;
    this.isDataDriven ? (f = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (f = this._data.length, _ = this._filteredData.length);
    const d = _ < f;
    if (this._totalSpan && (this._totalSpan.textContent = v(f, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = d ? v(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !d), this._selectedSpan) {
      const a = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = a > 0 ? v(a, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", a === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, A, "ln-table", {
    attributes: m
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
  function s(l) {
    return this.dom = l, r(this), this;
  }
  function p(l, c) {
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
      const m = o.detail && o.detail.targetId || u && u.id;
      return m ? c.querySelector('[data-ln-table-source="' + m + '"]') || c.querySelector('[data-ln-table="' + m + '"]') || c.querySelector("#" + m) || (c.id === m ? c : null) || document.getElementById(m) : null;
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
        const m = o.detail.key, w = o.detail.values || [], v = u.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === m) {
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
        const m = u.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!m) return;
        const w = m.lnTable && m.lnTable.name || m.id, v = m.querySelectorAll("th");
        for (let _ = 0; _ < v.length; _++) {
          const d = v[_].querySelector("[data-ln-table-col-filter], .table-filter");
          d && d.classList.remove("ln-filter-active");
        }
        const S = m.getAttribute("data-ln-table-source") || m.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const _ = p(c, S);
          _ && _.value !== "" && (_.value = "", _.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const f = h(c, S);
        for (let _ = 0; _ < f.length; _++) {
          const d = f[_].querySelector("[data-ln-filter-reset]");
          if (!d) continue;
          const a = f[_].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!d.checked || a) && (d.checked = !0, d.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        m.lnTable && !m.hasAttribute("data-ln-table-source") && L(m, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", l._handlers.filter), c.addEventListener("click", l._handlers.clear);
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, s, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(a, g) {
    if (!a || !a.isDataDriven) return;
    const b = a.dom.hasAttribute("data-ln-list-window");
    if (b && !a._windowed)
      a._enterWindowedMode(), a._kickWindowInitial();
    else if (!b && a._windowed)
      a._exitWindowedMode();
    else if (b && a._windowed) {
      const T = parseInt(g, 10);
      T > 0 && a._cache.configure({ windowSize: T });
    }
  }
  function n(a, g) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const b = parseInt(g, 10);
    b > 0 && a._cache.configure({ pageSize: b });
  }
  function o(a, g) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const b = parseInt(g, 10);
    b >= 0 && a._cache.configure({ threshold: b });
  }
  function u(a, g) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const b = parseInt(g, 10);
    b >= 0 && a._cache.setGrandTotal(b);
  }
  const m = {
    "data-ln-list": { prop: "name", type: "string", read: $, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: c, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: u, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, w = et(m);
  function v(a, g) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(it(g)).format(a);
    } catch {
      return String(a);
    }
  }
  function S(a) {
    let g = a;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const T = getComputedStyle(g).overflowY;
      if (T === "auto" || T === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function A(a) {
    const g = a._scrollContainer || S(a.dom);
    return {
      container: g,
      top: g ? g.scrollTop : window.scrollY
    };
  }
  function f(a) {
    a.container ? a.container.scrollTop = a.top : window.scrollTo(window.scrollX, a.top);
  }
  function _(a) {
    if (!a) return 0;
    const g = getComputedStyle(a), b = parseFloat(g.marginTop) || 0, T = parseFloat(g.marginBottom) || 0;
    return a.offsetHeight + b + T;
  }
  function d(a) {
    this.dom = a, tt(this, a, w), this.tbody = a.querySelector("[data-ln-list-body]") || a, this.isDataDriven = a.hasAttribute("data-ln-list-source"), this._totalSpan = a.querySelector("[data-ln-list-total]"), this._filteredSpan = a.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const g = this;
    return this._onSetSearch = function(b) {
      const T = (b.detail && b.detail.query != null ? b.detail.query : b.detail && b.detail.term != null ? b.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = T, L(a, "ln-list:search", {
        list: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = T.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(a, "ln-list:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, a.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(b) {
      b.preventDefault(), g._onSetSearch(b);
    }, a.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", L(a, "ln-list:clear-filters", { list: g.name }), g._requestData()) : (g._searchTerm = "", g._filters = {}, g._sortField = null, g._sortDir = null, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(a, "ln-list:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, a.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, a.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(b) {
      const T = b.detail || {}, y = T.data || [], E = T.total != null ? T.total : y.length;
      if (!(g._hasInitialSeed && !g.isLoaded && y.length === 0 && E === 0)) {
        if (g._windowed) {
          g._cache.ingest(T) && !T.provisional && a.classList.remove("ln-list--loading");
          return;
        }
        g._data = y, g._lastTotal = E, g._lastFiltered = T.filtered != null ? T.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, a.classList.remove("ln-list--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), L(a, "ln-list:rendered", {
          list: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, a.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(b) {
      const T = b.detail && b.detail.loading;
      a.classList.toggle("ln-list--loading", !!T), T && (g.isLoaded = !1);
    }, a.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(b) {
      !g._windowed || !g._cache || g._cache.release(b.detail && b.detail.offset);
    }, a.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, a.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, a.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(b) {
      b.detail.field != null && (b.preventDefault(), g.currentSort = b.detail.direction === "none" ? null : { field: b.detail.field, direction: b.detail.direction }, g._requestData());
    }, a.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(b) {
      if (b.target.closest("[data-ln-item-select]") || b.target.closest("[data-ln-item-action]") || b.target.closest("a") || b.target.closest("button") || b.ctrlKey || b.metaKey || b.button === 1) return;
      const T = b.target.closest("[data-ln-item]");
      if (!T) return;
      const y = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      L(a, "ln-list:item-click", {
        list: g.name,
        id: y,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(b) {
      const T = b.target.closest("[data-ln-item-action]");
      if (!T) return;
      const y = T.closest("[data-ln-item]");
      if (!y) return;
      const E = T.getAttribute("data-ln-item-action"), C = y.getAttribute("data-ln-item-id"), q = y._lnRecord || {};
      L(a, "ln-list:item-action", {
        list: g.name,
        id: C,
        action: E,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(a, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      g.tbody.children.length > 0 && (g._emptyObserver.disconnect(), g._emptyObserver = null, g._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(b) {
      if (b.preventDefault(), !b.detail) return;
      const T = b.detail.key, y = b.detail.values || [];
      if (T) {
        if (y.length === 0)
          delete g._filters[T];
        else {
          const E = [];
          for (let C = 0; C < y.length; C++)
            E.push(y[C].toLowerCase());
          g._filters[T] = E;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(a, "ln-list:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, a.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(b) {
      if (b.detail && b.detail.field == null) return;
      b.preventDefault();
      const T = b.detail && b.detail.direction === "none" ? null : b.detail && b.detail.direction;
      g._sortField = T === null ? null : b.detail && b.detail.field, g._sortDir = T, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(a, "ln-list:sorted", {
        field: g._sortField,
        direction: b.detail && b.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, a.addEventListener("ln-sort:change", this._onSort)), this;
  }
  d.prototype._parseChildren = function() {
    const a = Array.from(this.tbody.children).filter((g) => !g.classList.contains("ln-list__spacer"));
    this._data = [], a.length > 0 && (this._itemHeight = _(a[0]) || 50);
    for (let g = 0; g < a.length; g++) {
      const b = a[g], T = b.getAttribute("data-ln-item-id") || b.getAttribute("id"), y = b.textContent.trim().toLowerCase();
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
        searchText: y,
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
      const a = this._searchTerm, g = a ? a.split(/\s+/).filter(Boolean) : [], b = this._filters || {}, T = Object.keys(b).length > 0;
      if (g.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(y) {
        if (g.length > 0 && !g.every(function(C) {
          return y.searchText && y.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in b) {
            const C = b[E];
            if (C && C.length > 0) {
              const q = y.fields && y.fields[E] !== void 0 ? y.fields[E] : y[E] !== void 0 ? y[E] : null, D = q != null ? String(q).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const y = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(I) {
          return I.fields && I.fields[y] !== void 0 ? I.fields[y] : I[y];
        }), D = ke(q);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[y] !== void 0 ? I.fields[y] : I[y], P = R.fields && R.fields[y] !== void 0 ? R.fields[y] : R[y];
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
        const a = this._lastTotal, g = this.visibleCount;
        if (a === 0 || this._filteredData.length === 0 || g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, d.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, g = document.createDocumentFragment();
      for (let T = 0; T < a.length; T++) {
        const y = this._buildItem(a[T]);
        y && g.appendChild(y);
      }
      const b = A(this);
      this.tbody.replaceChildren(g), f(b), this._selectable && this._updateSelectAll();
    } else {
      const a = [], g = this._filteredData;
      for (let T = 0; T < g.length; T++) a.push(g[T].html);
      const b = A(this);
      this.tbody.innerHTML = a.join(""), f(b), this._selectable && this._restoreSelection();
    }
  }, d.prototype._readGridLayout = function() {
    const a = getComputedStyle(this.tbody), g = a.gridTemplateColumns;
    let b = 1;
    if (g && g !== "none") {
      const y = g.trim().split(/\s+/).filter(Boolean);
      y.length > 0 && (b = y.length);
    }
    const T = parseFloat(a.rowGap);
    return { columns: b, rowGap: isNaN(T) ? 0 : T };
  }, d.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const a = this._cache.peek(), g = a ? this._buildItem(a) : this._buildPlaceholderItem();
      g && (this.tbody.textContent = "", this.tbody.appendChild(g), this._itemHeight = _(g) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const a = this._buildItem(this._data[0]);
        a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = _(a) || 50, this.tbody.textContent = "");
      }
    } else {
      const a = this.tbody.children;
      a.length > 0 && (this._itemHeight = _(a[0]) || 50);
    }
  }, d.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      a._itemHeight = 0, a._measureItemHeight(), a._vStart = -1, a._vEnd = -1, a._windowed ? a._renderWindowed() : a._renderVirtual();
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, d.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, d.prototype._renderVirtual = function() {
    const a = this._filteredData, g = a.length, b = this._itemHeight;
    if (!b || !g) return;
    const T = this._scrollContainer;
    let y, E;
    if (T) {
      const X = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : X.top - V.top + T.scrollTop;
      y = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), q = C.columns, D = C.rowGap, I = b + D, R = Math.ceil(g / q);
    let O = Math.max(0, Math.floor(y / I) - 15);
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
        const ft = this._buildItem(a[G]);
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
        X += a[G].html;
      Y > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Y}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = X, f(V), this._selectable && this._restoreSelection();
    }
  }, d.prototype._buildPlaceholderItem = function() {
    const a = document.createElement(this.isUl ? "li" : "div");
    return a.className = "ln-list__placeholder", a.setAttribute("aria-hidden", "true"), a.style.height = this._itemHeight + "px", a;
  }, d.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._itemHeight;
    if (!a) return;
    const g = this._scrollContainer;
    let b, T;
    if (g) {
      const V = this.tbody.getBoundingClientRect(), G = g.getBoundingClientRect(), ft = g === this.tbody ? 0 : V.top - G.top + g.scrollTop;
      b = g.scrollTop - ft, T = g.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - G, T = window.innerHeight;
    }
    const y = this._readGridLayout(), E = y.columns, C = y.rowGap, q = a + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
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
    let a = null;
    if (this.isDataDriven) {
      const g = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && g > 0, y = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = Ct(this.dom, y, "ln-list"), !a) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", q = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          q && (a = document.importNode(q, !0));
        }
      }
    } else {
      const g = this.dom.querySelector(`template[${i}]`);
      if (g) {
        const b = g.content.firstElementChild;
        b && (a = document.importNode(b, !0));
      }
    }
    if (a)
      if (a.tagName === "LI" || a.tagName === "TR")
        this.tbody.replaceChildren(a);
      else {
        const g = document.createElement(this.isUl ? "li" : "div");
        g.appendChild(a), this.tbody.replaceChildren(g);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, d.prototype._buildItem = function(a) {
    let g = Ct(this.dom, this.name + "-row", "ln-list");
    if (!g) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (g = document.importNode(T.content, !0));
    }
    let b = g ? g.querySelector("[data-ln-item]") || g.firstElementChild : null;
    if (b)
      jt(b, a), pt(b, a);
    else if (a && a.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = a.html, b = T.firstElementChild;
    } else if (b = document.createElement(this.isUl ? "li" : "div"), b.setAttribute("data-ln-item", ""), a && typeof a == "object") {
      for (const T in a)
        if (T !== "html" && a[T] != null) {
          const y = document.createElement("span");
          y.setAttribute("data-ln-field", T), y.textContent = String(a[T]), b.appendChild(y);
        }
    }
    if (b._lnRecord = a, a && a.id != null && (b.setAttribute("data-ln-item-id", a.id), this._selectable && this.selectedIds.has(String(a.id)))) {
      b.classList.add("ln-item-selected");
      const T = b.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return b;
  }, d.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    for (let g = 0; g < a.length; g++) {
      const b = a[g].getAttribute("data-ln-item-id"), T = b != null && this.selectedIds.has(String(b));
      a[g].classList.toggle("ln-item-selected", T);
      const y = a[g].querySelector("[data-ln-item-select]");
      y && (y.checked = T);
    }
    this._updateSelectAll();
  }, d.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const a = this;
    this._onSelectionChange = function(g) {
      const b = g.target.closest("[data-ln-item-select]");
      if (!b) return;
      const T = b.closest("[data-ln-item]");
      if (!T) return;
      const y = T.getAttribute("data-ln-item-id");
      y != null && (b.checked ? (a.selectedIds.add(String(y)), T.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(y)), T.classList.remove("ln-item-selected")), a._updateSelectAll(), a._updateFooter(), L(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = a._selectAllCheckbox.checked, b = a.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < b.length; T++) {
        const y = b[T], E = y.getAttribute("data-ln-item-id"), C = y.querySelector("[data-ln-item-select]");
        E != null && (g ? (a.selectedIds.add(String(E)), y.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(E)), y.classList.remove("ln-item-selected")), C && (C.checked = g));
      }
      L(a.dom, "ln-list:select-all", { list: a.name, selected: g }), L(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, d.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    let g = a.length > 0;
    for (let b = 0; b < a.length; b++) {
      const T = a[b].getAttribute("data-ln-item-id");
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
    const a = this, g = this.dom, b = parseInt(g.getAttribute("data-ln-list-window"), 10), T = parseInt(g.getAttribute("data-ln-list-window-page"), 10), y = parseInt(g.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), L(g, "ln-list:rendered", {
        list: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Ln({
      windowSize: b > 0 ? b : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: y >= 0 ? y : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, q) {
        L(g, "ln-list:request-data", {
          list: a.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: C,
          limit: q,
          queryGen: a._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, d.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const a = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), g = a > 0 ? a : this._data.length;
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
    let a = 0, g = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (a = this._data.length, g = this._filteredData.length);
    const b = g < a;
    if (this._totalSpan && (this._totalSpan.textContent = v(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? v(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, d.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, d, "ln-list", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(m) {
    const w = m[e];
    w && u.call(w);
  }
  const s = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, p = "http://www.w3.org/2000/svg", h = 36, r = 16, l = 2 * Math.PI * r;
  function c(m) {
    return this.dom = m, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, o.call(this), u.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(m, w) {
    const v = document.createElementNS(p, m);
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
    const m = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = Rn(m, w || 100), S = l - v.percentage / 100 * l;
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
    attributes: s
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-sortable": { effect: h, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function p(r) {
    this.dom = r, this.isEnabled = r.getAttribute(t) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(c) {
      l.isEnabled && l._handlePointerDown(c);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, p.prototype._handlePointerDown = function(r) {
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
    const m = this, w = function(S) {
      m._handlePointerMove(S);
    }, v = function(S) {
      m._handlePointerEnd(S), l.removeEventListener("pointermove", w), l.removeEventListener("pointerup", v), l.removeEventListener("pointercancel", v);
    };
    l.addEventListener("pointermove", w), l.addEventListener("pointerup", v), l.addEventListener("pointercancel", v);
  }, p.prototype._handlePointerMove = function(r) {
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
  }, p.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const l = this._dragging, c = Array.from(this.dom.children), n = c.indexOf(l);
    let o = null, u = null;
    for (const m of c) {
      if (m.classList.contains("ln-sortable--drop-before")) {
        o = m, u = "before";
        break;
      }
      if (m.classList.contains("ln-sortable--drop-after")) {
        o = m, u = "after";
        break;
      }
    }
    for (const m of c)
      m.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
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
  j(t, e, p, "ln-sortable", {
    attributes: s
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", s = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const p = {
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
      const m = this._initial[u];
      if (!m.isConnected) continue;
      const w = m.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || o < this.max ? (v = this.selected, o++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(m);
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
    const m = u.parentElement;
    if (m !== this.available && m !== this.selected) return;
    if (!this.isEnabled) {
      o.checked = !o.checked;
      return;
    }
    const w = o.checked ? this.selected : this.available;
    if (m === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      o.checked = !o.checked, L(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: u,
        checkbox: o,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: u, from: m, to: w, checkbox: o };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      o.checked = !o.checked;
      return;
    }
    const S = document.activeElement === o;
    w.appendChild(u), S && o.focus(), L(this.dom, "ln-picklist:move", v);
  };
  function r(n) {
    const o = n.getAttribute(s);
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
    attributes: p
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", s = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function h(u, m, w) {
    return u.getAttribute(m) || w;
  }
  function r(u, m, w) {
    const v = parseFloat(u.getAttribute(m));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function l(u) {
    const m = document.createElement("span");
    return m.setAttribute(s, ""), m.setAttribute("role", "alert"), m.textContent = u, m;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: h, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: r, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (u, m) => u.getAttribute(m) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = et(c);
  function o(u) {
    this.dom = u, tt(this, u, n), this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : u.textContent.trim();
    const m = this;
    return this._onClick = function(w) {
      if (!pn(w))
        if (!m.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), m._enterConfirm();
        else {
          if (m._submitted) return;
          m._submitted = !0, w.stopPropagation(), m._reset();
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
    const u = this, m = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, m);
  }, o.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalIconHref && u.setAttribute("href", this.originalIconHref);
      const m = this.dom.querySelector("[" + s + "]");
      m && m.remove(), this.isIconButton = !1, this.originalIconHref = null;
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
  }, s = et(i), p = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function h(r) {
    if (this.dom = r, tt(this, r, s), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = r.querySelector("[data-ln-translations-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = p, this._localesRaw)
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
      u.setAttribute("data-ln-translations-lang", n), u.textContent = this.locales[n], u.addEventListener("click", function(m) {
        m.ctrlKey || m.metaKey || m.button === 1 || (m.preventDefault(), m.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(n));
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
      const u = n.querySelector("button"), m = r.locales[l] || l.toUpperCase();
      u.setAttribute("aria-label", r.removeLabel.replace("{lang}", m)), u.addEventListener("click", function(w) {
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
      const m = u.getAttribute("data-ln-translatable"), w = u.getAttribute("data-ln-translations-prefix") || "", v = u.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + r + "][" + m + "]" : S.name = "trans[" + r + "][" + m + "]", S.value = l[m] !== void 0 ? l[m] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", c)), S.setAttribute("data-ln-translatable-lang", r);
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
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", s = "data-ln-autosave-debounce-input", p = '[data-ln-autosave-exclude], input[type="password"]';
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
    let m = null;
    function w() {
      const f = gn(c, { exclude: p });
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
      let _;
      try {
        _ = JSON.parse(f);
      } catch {
        return;
      }
      if (Z(c, "ln-autosave:before-restore", { target: c, data: _ }).defaultPrevented) return;
      const a = _n(c, _);
      for (let g = 0; g < a.length; g++)
        a[g].dispatchEvent(new Event("input", { bubbles: !0 })), a[g].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(c, "ln-autosave:restored", { target: c, data: _ });
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
      const _ = f.target;
      r(_) && _.name && !_.matches(p) && w();
    }, this._onChange = function(f) {
      const _ = f.target;
      r(_) && _.name && !_.matches(p) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(f) {
      f.target.closest("[" + i + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = Lr(c.getAttribute(s));
    return A > 0 && (this._onInput = function(f) {
      const _ = f.target;
      !r(_) || !_.name || _.matches(p) || (m !== null && clearTimeout(m), m = setTimeout(w, A));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return m;
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
  function s(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const h = this;
    return this._onInput = function() {
      h._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  s.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, s, "ln-autoresize", {
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
  }, s = {
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
    return !!(p[f] || h[f] || r[f] || f === "link");
  }
  function n(f) {
    this.dom = f;
    const _ = this;
    if (this._textarea = f.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", f), this;
    const d = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), d && this._surface.setAttribute("data-placeholder", d);
    const a = this._textarea.id;
    if (a) {
      const y = f.querySelector('label[for="' + a + '"]');
      y && (y.id || (y.id = a + "-label"), this._surface.setAttribute("aria-labelledby", y.id));
    }
    this._surface.id = a ? a + "-surface" : "ln-editor-surface-" + ++l;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const b = f.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? f.insertBefore(this._surface, b.nextSibling) : f.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const y = b.querySelectorAll("[data-ln-editor-action]");
      for (let E = 0; E < y.length; E++) {
        const C = y[E].getAttribute("data-ln-editor-action");
        c(C) && y[E].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      _._syncToTextarea(), L(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      });
    }, this._onMousedownToolbar = function(y) {
      y.target.closest("[data-ln-editor-action]") && y.preventDefault();
    }, this._onClickToolbar = function(y) {
      const E = y.target.closest("[data-ln-editor-action]");
      if (!E) return;
      const C = E.getAttribute("data-ln-editor-action");
      _._execAction(C);
    }, this._onPaste = function(y) {
      m(_, y);
    }, this._onKeydown = function(y) {
      S(_, y);
    }, this._onSelectionChange = function() {
      document.contains(_._surface) && _._updateActiveStates();
    }, this._onFocus = function() {
      L(_.dom, "ln-editor:focus", { target: _.dom });
    }, this._onBlur = function() {
      _._syncToTextarea(), L(_.dom, "ln-editor:blur", { target: _.dom });
    }, this._onTextareaInput = function() {
      _._surface.innerHTML !== _._textarea.value && (_._surface.innerHTML = _._textarea.value, L(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(y) {
      const E = y.detail && y.detail.html;
      E !== void 0 && (_._surface.innerHTML = E, _._syncToTextarea(), L(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, f.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        _._surface.innerHTML = _._textarea.value, L(f, "ln-editor:changed", {
          html: _._textarea.value,
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
      if (this._surface.focus(), p[f])
        document.execCommand(p[f], !1, null);
      else if (h[f]) {
        const d = h[f], a = o(this._surface);
        a && a.toLowerCase() === d ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + d + ">");
      } else r[f] ? document.execCommand(r[f], !1, null) : f === "link" ? A(this) : f === "unlink" ? document.execCommand("unlink", !1, null) : f === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const f = this.dom.querySelector('[role="toolbar"]');
    if (!f) return;
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const d = _.anchorNode;
    if (!d || !this._surface.contains(d)) return;
    const a = f.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < a.length; g++) {
      const b = a[g], T = b.getAttribute("data-ln-editor-action");
      let y = !1;
      if (p[T])
        try {
          y = document.queryCommandState(p[T]);
        } catch {
        }
      else if (h[T]) {
        const E = o(this._surface);
        y = E && E.toLowerCase() === h[T];
      } else if (r[T])
        try {
          y = document.queryCommandState(r[T]);
        } catch {
        }
      else T === "link" && (y = !!u(_.anchorNode, "A", this._surface));
      c(T) && b.setAttribute("aria-pressed", String(y)), y ? b.classList.add("ln-editor-active") : b.classList.remove("ln-editor-active");
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
    const _ = this._textarea ? this._textarea.form : null;
    if (_ && this._onFormReset && _.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const d = this.dom.querySelector(".ln-editor__link-popover");
      d && d.remove();
    }
    L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function o(f) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return null;
    let d = _.anchorNode;
    if (!d) return null;
    for (; d && d !== f; ) {
      if (d.nodeType === 1) {
        const a = d.tagName;
        if (a === "H2" || a === "H3" || a === "H4" || a === "BLOCKQUOTE" || a === "PRE" || a === "P")
          return a;
      }
      d = d.parentNode;
    }
    return null;
  }
  function u(f, _, d) {
    for (; f && f !== d; ) {
      if (f.nodeType === 1 && f.tagName === _)
        return f;
      f = f.parentNode;
    }
    return null;
  }
  function m(f, _) {
    _.preventDefault();
    let d = "";
    if (_.clipboardData && (d = _.clipboardData.getData("text/html"), !d)) {
      const g = _.clipboardData.getData("text/plain");
      g && (d = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), d = "<p>" + d + "</p>");
    }
    if (!d) return;
    const a = w(d);
    a && document.execCommand("insertHTML", !1, a);
  }
  function w(f) {
    const _ = document.createElement("div");
    return _.innerHTML = f, v(_), _.innerHTML;
  }
  function v(f) {
    const _ = Array.from(f.childNodes);
    for (let d = 0; d < _.length; d++) {
      const a = _[d];
      if (a.nodeType !== 3) {
        if (a.nodeType !== 1) {
          f.removeChild(a);
          continue;
        }
        if (s[a.tagName]) {
          const g = Array.from(a.attributes);
          for (let b = 0; b < g.length; b++) {
            const T = g[b].name;
            if (a.tagName === "A" && T === "href") {
              const y = a.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(y) || a.removeAttribute("href");
            } else
              a.removeAttribute(T);
          }
          a.tagName === "A" && a.setAttribute("rel", "noopener noreferrer"), v(a);
        } else {
          for (; a.firstChild; )
            f.insertBefore(a.firstChild, a);
          f.removeChild(a);
        }
      }
    }
  }
  function S(f, _) {
    if (!(_.ctrlKey || _.metaKey)) return;
    let d = null;
    switch (_.key.toLowerCase()) {
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
    d && (_.preventDefault(), f._execAction(d));
  }
  function A(f) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const d = u(_.anchorNode, "A", f._surface), a = _.getRangeAt(0).cloneRange();
    f._closeLinkPopover && f._closeLinkPopover();
    const g = Ct(f.dom, "ln-editor-link-popover", "ln-editor");
    if (!g) return;
    const b = g.firstElementChild;
    if (!b) return;
    const T = b.querySelector('input[type="url"]'), y = b.querySelector('[data-ln-editor-action="confirm-link"]'), E = b.querySelector('[data-ln-editor-action="cancel-link"]');
    d && (T.value = d.getAttribute("href") || "");
    const C = f.dom.querySelector('[role="toolbar"]');
    C ? C.after(b) : f.dom.insertBefore(b, f._surface), T.focus();
    function q() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(a);
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
    f._closeLinkPopover = D, y.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
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
  function i(p) {
    const h = {}, r = p.dataset;
    for (const l in r) {
      if (!l.startsWith("lnFill") || e[l]) continue;
      const c = l.slice(6);
      c && (h[c.charAt(0).toLowerCase() + c.slice(1)] = r[l]);
    }
    return h;
  }
  function s(p, h) {
    const r = window.CSS && CSS.escape ? CSS.escape(h) : h, l = document.querySelectorAll('[data-ln-fill-id="' + r + '"]');
    if (l.length === 0) return null;
    for (let c = 0; c < l.length; c++) {
      const n = l[c].getAttribute("data-ln-fill-form");
      if (n) {
        const o = document.getElementById(n);
        if (o && p.contains(o)) return l[c];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const h = p.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const r = h.getAttribute("href");
    if (r && r.indexOf("#") !== -1) return;
    const l = h.getAttribute("data-ln-fill-form"), c = document.getElementById(l);
    if (!c) return;
    const n = i(h), o = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, o ? n : null);
  }), document.addEventListener("ln-fill:request", function(p) {
    const h = p.detail;
    if (!h) return;
    const r = p.target, l = h.id;
    if (l == null) {
      window.lnCore.lnFill(r, null);
      return;
    }
    const c = s(r, l);
    if (!c) return;
    const n = i(c);
    window.lnCore.lnFill(r, n);
  }), window[t] = !0;
})();
function qr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", s = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${s}+`, "g"), i).replace(new RegExp(`^${s}+|${s}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: $, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, s = et(i);
  function p(h) {
    if (h.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", h.tagName), this;
    const r = h.form;
    if (!r)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", h), this;
    tt(this, h, s);
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
  p.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = qr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, p, "ln-slug", {
    attributes: i
  });
})();
function xr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), s = t.getTime(), p = Math.floor((s - i) / 1e3), h = Math.abs(p);
  return h < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : h < 60 ? { value: p, unit: "second", isOlderThanMonth: !1 } : h < 3600 ? { value: Math.round(p / 60), unit: "minute", isOlderThanMonth: !1 } : h < 86400 ? { value: Math.round(p / 3600), unit: "hour", isOlderThanMonth: !1 } : h < 604800 ? { value: Math.round(p / 86400), unit: "day", isOlderThanMonth: !1 } : h < 2592e3 ? { value: Math.round(p / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(p / 2592e3), unit: "month", isOlderThanMonth: !0 };
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
      const s = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (s.year = "numeric"), s;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: a, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: a, description: "BCP 47 language tag override for time formatting" }
  }, s = {}, p = {};
  function h(b) {
    return b.getAttribute("data-ln-time-locale") || it(b);
  }
  function r(b, T) {
    const y = (b || "") + "|" + JSON.stringify(T);
    return s[y] || (s[y] = new Intl.DateTimeFormat(b, T)), s[y];
  }
  function l(b) {
    const T = b || "";
    return p[T] || (p[T] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), p[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function o() {
    n || (n = setInterval(m, 6e4));
  }
  function u() {
    n && (clearInterval(n), n = null);
  }
  function m() {
    for (const b of c) {
      if (!document.body.contains(b.dom)) {
        c.delete(b);
        continue;
      }
      _(b);
    }
    c.size === 0 && u();
  }
  function w(b, T) {
    const y = Lt(T), E = (T || "").toLowerCase().split("-")[0], C = r(T, $t("full", b)), q = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (y && q !== E && y.monthsLong) {
      const D = y.monthsLong[b.getMonth()], I = b.getDate(), R = b.getFullYear(), O = String(b.getHours()).padStart(2, "0"), P = String(b.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(b);
  }
  function v(b, T) {
    const y = $t("short", b), E = Lt(T), C = (T || "").toLowerCase().split("-")[0], q = r(T, y), D = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[b.getMonth()], R = b.getDate(), O = y.year ? " " + b.getFullYear() : "";
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
    const y = xr(b);
    return y.isOlderThanMonth ? v(b, T) : l(T).format(y.value, y.unit);
  }
  function _(b) {
    const T = b.dom.getAttribute("datetime");
    if (!T) return;
    const y = st(T);
    if (!y) return;
    const E = b.dom.getAttribute(t) || "short", C = h(b.dom);
    let q;
    switch (E) {
      case "relative":
        q = f(y, C);
        break;
      case "full":
        q = w(y, C);
        break;
      case "date":
        q = S(y, C);
        break;
      case "time":
        q = A(y, C);
        break;
      default:
        q = v(y, C);
        break;
    }
    b.dom.textContent = q, E !== "full" && (b.dom.title = w(y, C));
  }
  function d(b) {
    this.dom = b;
    const T = this;
    return this._onLocaleChange = function() {
      _(T);
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), _(this), b.getAttribute(t) === "relative" && (c.add(this), o()), this;
  }
  d.prototype.render = function() {
    _(this);
  }, d.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), c.delete(this), c.size === 0 && u(), delete this.dom[e];
  };
  function a(b) {
    const T = b[e];
    if (!T) return;
    b.getAttribute(t) === "relative" ? (c.add(T), o()) : (c.delete(T), c.size === 0 && u()), _(T);
  }
  function g(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(t) && b[e] && _(b[e]);
  }
  j(t, e, d, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: a,
    onInit: g
  });
})();
function Ir(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, s = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, h = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let l = 0, c = 0, n = 0, o = !1, u = null;
  function m(S, A) {
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
    r.add(S), clearTimeout(u), u = setTimeout(() => p(S, i, A), s);
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
      return m(S, A), A;
    },
    ensure: (S, A, f) => {
      if (!o && !r.has(0)) return v(0, f);
      if (l <= 0) return;
      const _ = Math.max(0, S), d = Math.min(l, A);
      for (let a = _; a < d; a++)
        if (!h.has(a)) {
          const g = Math.floor(a / i) * i;
          if (!r.has(g)) return v(g, f);
        }
    },
    ingest: (S, A, f, _, d) => {
      if (d != null && d !== n) return [];
      o = !0, f != null && (c = f), _ != null && (l = _);
      for (let a = 0; a < A.length; a++)
        m(S + a, A[a]);
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
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (i = S.pageSize), S.fetchDebounce >= 0 && (s = S.fetchDebounce), A;
    }
  };
}
function Dr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: s, direction: p } = e, h = p === "desc", r = t.map((c) => c ? c[s] : void 0), l = ke(r);
  return [...t].sort((c, n) => {
    const o = c ? c[s] : void 0, u = n ? n[s] : void 0, m = Le(o, u, l, i);
    return h ? -m : m;
  });
}
function oi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((s) => Array.isArray(e[s]) && e[s].length > 0);
  return i.length ? t.filter((s) => s ? i.every((p) => Re(s[p], e[p])) : !1) : t;
}
function Rr(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const s = Mn(e);
  return s.length ? t.filter((p) => p ? s.every(
    (h) => i.some((r) => {
      const l = p[r];
      return l != null && Nn(String(l), [h]);
    })
  ) : !1) : t;
}
function Or(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const s = t.map((h) => h && h[e] != null ? parseFloat(h[e]) : NaN).filter((h) => Number.isFinite(h)), p = s.reduce((h, r) => h + r, 0);
  return i === "sum" ? p : i === "avg" && s.length ? p / s.length : 0;
}
function Mr(t, e = {}, i = [], s) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const p = t.length;
  let h = t;
  e.filters && (h = oi(h, e.filters)), e.search && (h = Rr(h, e.search, i));
  const r = h.length;
  if (e.sort && (h = Dr(h, e.sort, s)), e.offset || e.limit) {
    const l = e.offset || 0, c = e.limit || h.length;
    h = h.slice(l, l + c);
  }
  return { records: h, total: p, filtered: r };
}
function Nr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const s = { ...i };
    for (const [p, h] of Object.entries(e))
      if (typeof h == "function")
        try {
          s[p] = h(i);
        } catch {
          s[p] = void 0;
        }
    return s;
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
  const s = {
    "data-ln-data-store": { type: "marker", effect: Pe, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: Pe, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: dn, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: yi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: bi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, p = et(s), h = "ln_app_cache", r = "_meta", l = "1.0";
  let c = null, n = null;
  const o = {};
  function u(k) {
    k && k.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: k });
  }
  function m() {
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
      const x = m(), M = Object.keys(x), N = indexedDB.open(h);
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
              const Mt = at.createObjectStore(Tt, { keyPath: "id" });
              for (const ce of x[Tt].indexes)
                Mt.createIndex(ce, ce, { unique: !1 });
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
  const _ = (k, x) => S().then((M) => M ? M.transaction(k, x).objectStore(k) : null);
  function d(k) {
    return new Promise((x, M) => {
      k.onsuccess = () => x(k.result), k.onerror = () => {
        u(k.error), M(k.error);
      };
    });
  }
  const a = (k) => _(k, "readonly").then((x) => x ? d(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => f(M))) : x), g = (k, x) => _(k, "readonly").then((M) => M ? d(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? d(M.get(Number(x))) : typeof x == "number" ? d(M.get(String(x))) : null) : null).then((M) => M ? f(M) : null), b = (k, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(k, "readonly").objectStore(k), U = x.map((K) => d(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? d(F.get(Number(K))) : typeof K == "number" ? d(F.get(String(K))) : null));
    return Promise.all(U).then((K) => At() ? Promise.all(K.map((W) => W ? f(W) : null)) : K);
  }), T = (k, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => _(k, "readwrite").then((F) => F ? d(F.put(N)) : null)), y = (k, x) => _(k, "readwrite").then((M) => M ? d(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return d(M.delete(Number(x)));
    if (typeof x == "number")
      return d(M.delete(String(x)));
  }) : null), E = (k) => _(k, "readwrite").then((x) => x ? d(x.clear()) : null), C = (k) => _(k, "readonly").then((x) => x ? d(x.count()) : 0), q = (k) => _(r, "readonly").then((x) => x ? d(x.get(k)) : null), D = (k, x) => _(r, "readwrite").then((M) => {
    if (M)
      return x.key = k, d(M.put(x));
  });
  function I(k) {
    return this.dom = k, this._name = k.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", k), tt(this, k, p), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, k.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Ir({
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
      return y(k._name, F).then(() => P(k, -1)).then(() => {
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
  function Ot(k, x) {
    return Nr(x, k.presenters && k.presenters.computed);
  }
  function pi(k) {
    return !k.sort && !At();
  }
  function mi(k, x, M) {
    const N = ci(x.filters), F = x.search ? ui(x.search) : [], U = k._searchFields, K = F.length > 0 && U && U.length > 0;
    return _(k._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ht = [], at = W.openCursor();
      at.onsuccess = () => {
        const Tt = at.result;
        if (!Tt || ht.length >= M) {
          J(ht);
          return;
        }
        const Mt = Tt.value;
        (!N.length || di(Mt, N, x.filters)) && (!K || fi(Mt, F, U)) && ht.push(Mt), Tt.continue();
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
        data: Ot(k, W),
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
          data: Ot(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Fe(x, M, N);
        return pi(k) ? mi(x, k, F).then((K) => U(K.slice(M, F))) : a(x._name).then((K) => U(Ne(x, K, k).records));
      }
      return Fe(x, M, N);
    }
    return a(x._name).then((M) => {
      const N = Ne(x, M, k);
      return {
        data: Ot(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(k) {
    return g(this._name, k).then((x) => x ? Ot(this, [x])[0] : null);
  }, I.prototype.count = function(k) {
    return k && Object.keys(k).length > 0 ? a(this._name).then((M) => oi(M, k).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(k, x) {
    return a(this._name).then((M) => hi(M, k, x));
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
    return k.length > 0 && (N = N.then(() => G(M._name, k))), N.then(() => C(M._name)).then((F) => (M.totalCount = x.total !== void 0 ? x.total : F, k.length > 0 && (M.canServe = !0), Ot(M, k))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
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
    attributes: s
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
    const s = String(e);
    return i === 0 ? s.replace(/\/+$/, "") : s.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Pr(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Fr);
  if (e && typeof e == "object")
    for (const p in e)
      e[p] !== void 0 && e[p] !== null && e[p] !== "" && (i[p] = e[p]);
  const s = new URLSearchParams();
  return t.search && s.append(i.search, t.search), t.offset != null && s.append(i.offset, t.offset), t.limit != null && s.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (s.append(i.sortField, t.sort.field), s.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((p) => {
    const h = t.filters[p];
    Array.isArray(h) && h.length > 0 && s.append(p, h.join(","));
  }), s.toString();
}
function Br(t, e, i) {
  let s = kt(t, e);
  return i && (s += (s.indexOf("?") !== -1 ? "&" : "?") + i), s;
}
function on(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function s(n) {
    const o = n[e];
    o && o.refreshConfig();
  }
  const p = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: $, type: "string", fallback: "", effect: s, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: $, type: "string", fallback: "", effect: s, description: "Resource path appended to base URL" },
    "data-ln-api-headers": { prop: "rawHeaders", read: $, type: "json", fallback: null, effect: s, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: s, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: s, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: s, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: s, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: s, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: s, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, h = et(p);
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
    const m = n.getAttribute("data-ln-api-param-limit");
    m && (o.limit = m);
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
    let m = kt(u.baseUrl, u.path);
    n != null && n !== "" && (m += (m.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = o || "sync";
    u._inflight.has(w) && u._inflight.get(w).abort();
    const v = new AbortController();
    return u._inflight.set(w, v), window.fetch(m, {
      method: "GET",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      signal: v.signal
    }).then(r).finally(function() {
      u._inflight.get(w) === v && u._inflight.delete(w);
    });
  }, l.prototype.query = function(n, o) {
    const u = this, m = Pr(n, u.paramKeys), w = Br(u.baseUrl, u.path, m), v = o || "query";
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
    const m = this;
    return window.fetch(kt(m.baseUrl, o || m.path), {
      method: "POST",
      headers: m._reqHeaders(u),
      credentials: m.credentials,
      body: JSON.stringify(n)
    }).then(r);
  }, l.prototype.update = function(n, o, u, m, w) {
    const v = this;
    u != null && (o = Object.assign({}, o, { expected_version: u }));
    const S = m ? kt(v.baseUrl, m) : kt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(o)
    }).then(r);
  }, l.prototype.delete = function(n, o, u) {
    const m = this;
    return window.fetch(kt(m.baseUrl, o || m.path, n), {
      method: "DELETE",
      headers: m._reqHeaders(u),
      credentials: m.credentials
    }).then(r);
  }, l.prototype.bulkDelete = function(n, o, u) {
    const m = this;
    return window.fetch(kt(m.baseUrl, o || m.path, "bulk-delete"), {
      method: "DELETE",
      headers: m._reqHeaders(u),
      credentials: m.credentials,
      body: JSON.stringify({ ids: n })
    }).then(r);
  };
  function c(n) {
    n._handlers = {
      sync: function(o) {
        const u = o.detail || {}, m = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        n.fetchDelta(u.since, m).then(function(w) {
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
        const u = o.detail || {}, m = u.query || u, w = u.meta && u.meta.targetEl ? u.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(_, d, a) {
          n.query(d, a).then(function(g) {
            const b = g || {};
            L(n.dom, "ln-api-connector:fetched", {
              data: b.data || (Array.isArray(b) ? b : []),
              total: b.total,
              filtered: b.filtered,
              offset: d.offset,
              queryGen: d.queryGen,
              meta: _.meta || null
            });
          }).catch(function(g) {
            g && g.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
              action: "query",
              error: g.message,
              status: g.status || 0,
              data: g.data || null,
              meta: _.meta || null
            });
          });
        }
        if (S === 0) {
          A(u, m, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const f = setTimeout(function() {
          n._queryTimers.delete(v), A(u, m, w);
        }, S);
        n._queryTimers.set(v, f);
      },
      cancel: function(o) {
        const u = o.detail || {}, m = u.meta && u.meta.targetEl ? u.meta.targetEl : u.targetEl || u.key;
        m && n.cancel(m);
      },
      create: function(o) {
        const u = o.detail || {};
        n.create(u.data, u.url, u.idempotencyKey).then(function(m) {
          const w = on(m);
          L(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: u.tempId,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "create",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(o) {
        const u = o.detail || {};
        n.update(u.id, u.data, u.expected_version, u.url, u.idempotencyKey).then(function(m) {
          const w = on(m);
          L(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: u.id,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "update",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            id: u.id,
            conflictData: m.status === 409 ? m.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(o) {
        const u = o.detail || {};
        n.delete(u.id, u.url, u.idempotencyKey).then(function(m) {
          const w = m && m.message ? m.message : null;
          L(n.dom, "ln-api-connector:deleted", {
            response: m,
            id: u.id,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const u = o.detail || {};
        n.bulkDelete(u.ids, u.url, u.idempotencyKey).then(function(m) {
          const w = m && m.message ? m.message : null;
          L(n.dom, "ln-api-connector:bulk-deleted", {
            response: m,
            ids: u.ids,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
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
    attributes: p
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function s(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const p = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: $, type: "string", fallback: "", effect: s, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: $, type: "string", fallback: "", effect: s, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: $, type: "string", fallback: "", effect: s, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: s, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, h = et(p);
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
    const f = Object.assign({}, Nt(v.headers, v.auth), A || {});
    return S && (f["Idempotency-Key"] = S), f;
  }
  l.prototype.fetchDelta = function(v) {
    const S = this, A = ["include_docs=true", "feed=normal"];
    v && A.push("since=" + encodeURIComponent(v));
    const f = Et(S.url, S.db, "_changes") + "?" + A.join("&");
    return window.fetch(f, { method: "GET", headers: Nt(S.headers, S.auth), credentials: S.credentials }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const d = _.results || [];
      return {
        data: d.filter((a) => !a.deleted && a.doc).map((a) => Object.assign({}, a.doc, { id: a.doc._id })),
        deleted: d.filter((a) => a.deleted).map((a) => a.id),
        synced_at: _.last_seq || v || ""
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
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const d = r(_), a = d.content;
      return { record: Object.assign({}, f, { id: a.id, _id: a.id, _rev: a.rev }), message: d.message };
    });
  }
  l.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function o(v, S, A, f) {
    const _ = Object.assign({ id: String(S), _id: String(S) }, A), d = _._rev || _.rev;
    return (d ? Promise.resolve(d) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision mapping");
      return g.json().then((b) => b._rev);
    })).then((g) => {
      const b = Object.assign({}, _, { _rev: g });
      delete b.rev;
      const T = c(v, f, { "If-Match": g });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(b)
      }).then((y) => {
        if (y.ok) return y.json().then((E) => {
          const C = r(E);
          return { record: Object.assign({}, b, { _rev: C.content.rev }), message: C.message };
        });
        if (y.status === 409) return y.json().then((E) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = E, C;
        });
        throw new Error("HTTP " + y.status + ": " + y.statusText);
      });
    });
  }
  l.prototype.update = function(v, S, A) {
    return o(this, v, S, A).then((f) => f.record);
  };
  function u(v, S, A, f) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision delete");
      return d.json().then((a) => a._rev);
    })).then((d) => {
      const a = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(d);
      return window.fetch(a, { method: "DELETE", headers: c(v, f), credentials: v.credentials }).then((g) => {
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
  function m(v, S, A) {
    return !S || S.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Nt(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: S })
    }).then((f) => {
      if (!f.ok) throw new Error("HTTP " + f.status + ": " + f.statusText);
      return f.json();
    }).then((f) => {
      const d = (f.rows || []).filter((a) => !a.error && a.value && a.value.rev).map((a) => ({ _id: a.id, _rev: a.value.rev, _deleted: !0 }));
      return d.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: d })
      }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      }).then((a) => {
        const g = r(a);
        return { response: { ok: !0, results: g.content, deletedCount: d.length }, message: g.message };
      });
    });
  }
  l.prototype.bulkDelete = function(v, S) {
    return m(this, v, S).then((A) => A.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(A) {
        const f = A.detail || {};
        v.fetchDelta(f.since).then(function(_) {
          L(v.dom, "ln-couchdb-connector:fetched", { data: _, since: f.since, meta: f.meta || null });
        }).catch(function(_) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            since: f.since,
            meta: f.meta || null
          });
        });
      },
      create: function(A) {
        const f = A.detail || {};
        n(v, f.data, f.idempotencyKey).then(function(_) {
          L(v.dom, "ln-couchdb-connector:created", { record: _.record, tempId: f.tempId, message: _.message, meta: f.meta || null });
        }).catch(function(_) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(A) {
        const f = A.detail || {}, _ = Object.assign({}, f.data);
        f.expected_version !== void 0 && (_._rev = f.expected_version), o(v, f.id, _, f.idempotencyKey).then(function(d) {
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
        u(v, f.id, f.rev, f.idempotencyKey).then(function(_) {
          L(v.dom, "ln-couchdb-connector:deleted", { response: _.response, id: f.id, message: _.message, meta: f.meta || null });
        }).catch(function(_) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const f = A.detail || {};
        m(v, f.ids, f.idempotencyKey).then(function(_) {
          L(v.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: f.ids, message: _.message, meta: f.meta || null });
        }).catch(function(_) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
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
    attributes: p
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
function Pt(t, e) {
  const i = !t || !!t.initializationError, s = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || s) ? "remote" : t && !t.initializationError ? "store" : "none";
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
    return new Promise((i, s) => {
      this._pending.set(e, { resolve: i, reject: s });
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
    for (const s of this._pending.values()) s.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const s = e && e.requestId;
    if (!s) return !1;
    const p = this._pending.get(s);
    return p ? (this._pending.delete(s), i ? p.reject(e.error || new Error("Store mutation failed")) : p.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope", s = "data-ln-data-coordinator-search", p = "data-ln-data-coordinator-filters", h = "data-ln-data-coordinator-sort-field", r = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function l(y) {
    const E = y[e];
    E && E.refreshMapper();
  }
  function c(y) {
    const E = y[e];
    E && E._queueQueryRefresh();
  }
  function n(y, E) {
    return y.getAttribute(E) || y.id;
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
  }, u = et(o), m = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function f() {
    w || (w = !0, v = function() {
      L(document, "ln-data-coordinator:online", {}), m.forEach(function(y) {
        y._maybeSync();
      });
    }, S = function() {
      L(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && m.forEach(function(y) {
        const E = y.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !y._noAutosync && (!C.hasCache || y._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function _() {
    w && (m.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", S), document.removeEventListener("visibilitychange", A), v = null, S = null, A = null, w = !1));
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
  const a = ["ln-api-connector", "ln-couchdb-connector"];
  function g(y) {
    return y ? y.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : y.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function b(y) {
    const E = this;
    return this.dom = y, tt(this, y, u), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", y), y[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Hr(), this._dict = ie(y, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), m.add(this), f(), this._checkInitialSync(), this;
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
    const y = this.findChildren(), E = y.store;
    !E || E.initializationError || !y.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, b.prototype._checkInitialSync = function() {
    const y = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (y._destroyed) return;
      const q = y.findChildren(), D = q.store;
      if (D && D.initializationError) {
        y._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !q.connector || y._noAutosync || D.isSyncing || (!D.hasCache || y._isStale()) && D.forceSync();
    }).catch(function(q) {
      y._destroyed || y._reportReconciliationError("store-initialize", q, null);
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
    const y = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: y,
      connectorEl: E,
      queueEl: C,
      store: y ? y.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, b.prototype._handleSubmitRecord = function(y) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = y.data || {}, q = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = y.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, y.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, q, I, D, y.action);
  }, b.prototype._fanOutCreate = function(y, E, C) {
    this.refreshMapper();
    const q = "_temp_" + d();
    y.storeEl && L(y.storeEl, "ln-data-store:request-create", { tempId: q, data: E }), y.queue ? L(y.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: q,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: q, action: C }
    }) : y.connector && L(y.connectorEl, g(y.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: d(), queued: !1, op: "create", tempId: q }
    });
  }, b.prototype._fanOutUpdate = function(y, E, C, q, D) {
    this.refreshMapper(), y.storeEl && L(y.storeEl, "ln-data-store:request-update", { id: E, data: C }), y.queue ? L(y.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: q,
      meta: { id: E, action: D }
    }) : y.connector && L(y.connectorEl, g(y.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: q,
      url: D,
      meta: { entryId: d(), queued: !1, op: "update", id: E }
    });
  }, b.prototype._fanOutDelete = function(y, E) {
    this.refreshMapper(), y.storeEl && L(y.storeEl, "ln-data-store:request-delete", { id: E }), y.queue ? L(y.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : y.connector && L(y.connectorEl, g(y.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: d(), queued: !1, op: "delete", id: E }
    });
  }, b.prototype._fanOutBulkDelete = function(y, E) {
    this.refreshMapper();
    const C = E.join(",");
    y.storeEl && L(y.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), y.queue ? L(y.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : y.connector && L(y.connectorEl, g(y.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: d(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, b.prototype._toastFromMessage = function(y) {
    y && L(window, "ln-toast:enqueue", {
      type: y.type || "success",
      title: y.title || "",
      message: y.body || ""
    });
  }, b.prototype._toastFromDict = function(y) {
    const E = this._dict[y];
    E && L(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, b.prototype._requestStoreMutation = function(y, E, C) {
    const q = y.storeEl;
    if (!q) return Promise.reject(new Error("Store element not found"));
    const D = d(), I = this._mutationReceipts.wait(D);
    return L(q, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, b.prototype._reportReconciliationError = function(y, E, C) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", {
      operation: y,
      error: E,
      meta: C || null
    });
  };
  function T(y) {
    y._handlers = {
      sync: function(E) {
        y.refreshMapper();
        const C = y.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(C.connectorEl, g(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = y.findChildren();
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
        const C = y.findChildren();
        y._fanOutCreate(C, E.detail.data || {}, E.detail.action);
      },
      reqUpdate: function(E) {
        const C = y.findChildren();
        y._fanOutUpdate(C, E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action);
      },
      reqDelete: function(E) {
        const C = y.findChildren();
        y._fanOutDelete(C, E.detail.id);
      },
      reqBulkDelete: function(E) {
        const C = y.findChildren();
        y._fanOutBulkDelete(C, E.detail.ids || []);
      },
      queueFailed: function() {
        y._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(E) {
        y.refreshMapper();
        const C = y.findChildren();
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
        if (q ? D = y._owns(q) : D = C.closest("[data-ln-data-coordinator]") === y.dom, !D) return;
        const I = Ii(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = gn(C);
        delete R._method, delete R._token, y._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(E) {
        const C = E.detail.meta || {}, q = y.findChildren();
        y.refreshMapper();
        const D = E.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => y.mapper.ingress(B));
        if (q.store && !q.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? q.store.applyQuery(P, { total: E.detail.total }).then(function(B) {
            C.queryGen != null && !y._isCurrentGen(C.targetEl, C.queryGen) || (L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: E.detail.total !== void 0 ? E.detail.total : B.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : B.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), y._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? q.store.applyQuery(P, { total: E.detail.total }).then(function() {
            return q.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !y._isCurrentGen(C.targetEl, C.queryGen) || L(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && q.store.applyQuery(P, { total: E.detail.total }).then(function() {
            if (C.queryGen != null && !y._isCurrentGen(C.targetEl, C.queryGen)) return;
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
            }), y._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            L(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(E) {
        const C = y.findChildren(), q = E.detail.meta || {}, D = y.mapper.ingress(E.detail.record);
        (C.storeEl ? y._requestStoreMutation(C, "update", { id: q.tempId, data: D }) : Promise.resolve()).then(function() {
          y._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: q.entryId,
            oldKey: q.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          y._reportReconciliationError("create-reconcile", R, q);
        });
      },
      connUpdated: function(E) {
        const C = y.findChildren(), q = E.detail.meta || {}, D = y.mapper.ingress(E.detail.record);
        (C.storeEl ? y._requestStoreMutation(C, "update", { id: q.id, data: D }) : Promise.resolve()).then(function() {
          y._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
        }).catch(function(R) {
          y._reportReconciliationError("update-reconcile", R, q);
        });
      },
      connDeleted: function(E) {
        const C = y.findChildren(), q = E.detail.meta || {};
        y._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connBulkDeleted: function(E) {
        const C = y.findChildren(), q = E.detail.meta || {};
        y._toastFromMessage(E.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connError: function(E) {
        const C = E.detail || {}, q = C.meta || {}, D = q.op || C.action, I = C.status || C.error && C.error.status || 0, R = y.findChildren();
        if (D === "sync") {
          R.storeEl && L(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          q.targetEl && q.kind && (L(q.targetEl, "ln-" + q.kind + ":set-loading", { loading: !1 }), (q.kind === "table" || q.kind === "list") && L(q.targetEl, "ln-" + q.kind + ":page-failed", { offset: q.offset })), y._reportReconciliationError("query", C.error || C, q);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          y._toastFromDict("auth"), q.queued && R.queue && L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "auth" });
          return;
        }
        if (P) {
          q.queued && R.queue ? L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "retry" }) : y._toastFromDict("network");
          return;
        }
        let H = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? y.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (H = y._requestStoreMutation(R, "update", { id: q.id, data: z })), y._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (H = y._requestStoreMutation(R, "delete", { id: q.tempId })), y._toastFromDict("rejected");
        q.queued && R.queue ? H.then(function() {
          L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "drop" });
        }).catch(function(z) {
          y._reportReconciliationError("deterministic-reconcile", z, q);
        }) : H.catch(function(z) {
          y._reportReconciliationError("deterministic-reconcile", z, q);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(E) {
        const C = y.findChildren(), q = C.store;
        if (!q || q.initializationError || !C.connector || y._noAutosync || q.isSyncing) return;
        (E.detail || {}).hasCache ? y._isStale() && q.forceSync() : q.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(E) {
        y._serveData(E, "table");
      },
      reqListData: function(E) {
        y._serveData(E, "list");
      },
      reqChartData: function(E) {
        y._serveData(E, "chart");
      },
      reqOptions: function(E) {
        y._serveOptions(E);
      },
      reqStat: function(E) {
        y._serveStat(E);
      },
      refreshQuery: function() {
        y._refreshAll(null, !0);
      },
      refresh: function(E) {
        y._mutationReceipts.resolve(E.detail), y._refreshAll(null, !1);
      },
      mutationError: function(E) {
        y._mutationReceipts.reject(E.detail);
      },
      refreshSynced: function(E) {
        E.detail && E.detail.changed && y._refreshAll(E.detail.meta, !1);
      },
      searchChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.term != null ? E.detail.term : "";
        C !== (y.dom.getAttribute(s) || "") && y.dom.setAttribute(s, C);
      },
      filterChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.key;
        if (!C) return;
        const q = (E.detail.values || []).slice(), D = y._currentQuery().filters, I = D[C];
        if (I ? I.length === q.length && I.every((B, H) => B === q[H]) : !q.length) return;
        q.length ? D[C] = q : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(H) {
            O.append(B, H);
          });
        });
        const P = O.toString();
        P ? y.dom.setAttribute(p, P) : y.dom.removeAttribute(p);
      },
      sortChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.field, q = E.detail && E.detail.direction, D = C && q && q !== "none" ? { field: C, direction: q } : null, I = y._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (y.dom.setAttribute(h, D.field), y.dom.setAttribute(r, D.direction)) : (y.dom.removeAttribute(h), y.dom.removeAttribute(r)));
      }
    }, y.dom.addEventListener("ln-data-store:request-remote-sync", y._handlers.sync), y.dom.addEventListener("ln-data-store:request-page", y._handlers.requestPage), y.dom.addEventListener("ln-data-coordinator:request-create", y._handlers.reqCreate), y.dom.addEventListener("ln-data-coordinator:request-update", y._handlers.reqUpdate), y.dom.addEventListener("ln-data-coordinator:request-delete", y._handlers.reqDelete), y.dom.addEventListener("ln-data-coordinator:request-bulk-delete", y._handlers.reqBulkDelete), y.dom.addEventListener("ln-api-queue:send", y._handlers.queueSend), y.dom.addEventListener("ln-api-queue:failed", y._handlers.queueFailed), y.dom.addEventListener("ln-data-store:initialized", y._handlers.storeInitialized), document.addEventListener("submit", y._handlers.formSubmit), a.forEach(function(E) {
      y.dom.addEventListener(E + ":fetched", y._handlers.connFetched), y.dom.addEventListener(E + ":created", y._handlers.connCreated), y.dom.addEventListener(E + ":updated", y._handlers.connUpdated), y.dom.addEventListener(E + ":deleted", y._handlers.connDeleted), y.dom.addEventListener(E + ":bulk-deleted", y._handlers.connBulkDeleted), y.dom.addEventListener(E + ":error", y._handlers.connError);
    }), document.addEventListener("ln-table:request-data", y._handlers.reqTableData), document.addEventListener("ln-list:request-data", y._handlers.reqListData), document.addEventListener("ln-chart:request-data", y._handlers.reqChartData), document.addEventListener("ln-options:request-data", y._handlers.reqOptions), document.addEventListener("ln-stat:request-count", y._handlers.reqStat), y.dom.addEventListener("ln-data-store:ready", y._handlers.refresh), y.dom.addEventListener("ln-data-store:created", y._handlers.refresh), y.dom.addEventListener("ln-data-store:updated", y._handlers.refresh), y.dom.addEventListener("ln-data-store:deleted", y._handlers.refresh), y.dom.addEventListener("ln-data-store:mutation-error", y._handlers.mutationError), y.dom.addEventListener("ln-data-store:synced", y._handlers.refreshSynced), y.dom.addEventListener("ln-data-store:query-changed", y._handlers.refreshQuery), y.dom.addEventListener("ln-search:change", y._handlers.searchChange), y.dom.addEventListener("ln-filter:change", y._handlers.filterChange), y.dom.addEventListener("ln-sort:change", y._handlers.sortChange);
  }
  b.prototype._owns = function(y) {
    return !!y && y === this._name;
  }, b.prototype._currentQuery = function() {
    const y = this.dom.getAttribute(h), E = this.dom.getAttribute(r), C = new URLSearchParams(this.dom.getAttribute(p) || ""), q = {};
    for (const D of new Set(C.keys())) q[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(s) || "",
      filters: q,
      sort: y && E ? { field: y, direction: E } : null
    };
  }, b.prototype._nextQueryGen = function(y) {
    const E = (this._queryGens.get(y) || 0) + 1;
    return this._queryGens.set(y, E), E;
  }, b.prototype._isCurrentGen = function(y, E) {
    return this._queryGens.get(y) === E;
  }, b.prototype._serveData = function(y, E) {
    const C = y.target, q = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(q);
    if (!D || !this._owns(D)) return;
    const I = y.detail || {}, R = Ur(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Pt(B, O.connector), Q = sn(R, P._currentQuery());
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
  }, b.prototype._serveOptions = function(y) {
    const E = y.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const q = this.findChildren(), D = q.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Pt(D, q.connector);
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
  }, b.prototype._serveStat = function(y) {
    const E = y.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const q = y.detail && y.detail.filters ? y.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = q && Object.keys(q).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), H = B ? "remote" : Pt(I, D.connector);
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
  }, b.prototype._refreshAll = function(y, E) {
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
        if (Pt(B, P.connector) === "remote") {
          const X = C._nextQueryGen(I);
          L(I, "ln-" + O + ":set-loading", { loading: !0 }), L(P.connectorEl, g(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
          });
          continue;
        }
        const Q = Qt(B, P.connector, Pt(B, P.connector)), Y = Q ? C._nextQueryGen(I) : null;
        Q && L(P.connectorEl, g(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
        }), (function(X, V, G, ft) {
          B.getAll(z).then(function(yt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(X, ft)) return;
            const ae = {
              data: yt.data,
              total: y && y.total !== void 0 ? y.total : yt.total,
              filtered: y && y.filtered !== void 0 ? y.filtered : yt.filtered,
              offset: yt.offset !== void 0 ? yt.offset : y && y.offset !== void 0 ? y.offset : H.offset,
              queryGen: yt.queryGen !== void 0 ? yt.queryGen : y && y.queryGen !== void 0 ? y.queryGen : H.queryGen
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
    const y = this;
    y._handlers && (y.dom.removeEventListener("ln-data-store:request-remote-sync", y._handlers.sync), y.dom.removeEventListener("ln-data-store:request-page", y._handlers.requestPage), y.dom.removeEventListener("ln-data-coordinator:request-create", y._handlers.reqCreate), y.dom.removeEventListener("ln-data-coordinator:request-update", y._handlers.reqUpdate), y.dom.removeEventListener("ln-data-coordinator:request-delete", y._handlers.reqDelete), y.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", y._handlers.reqBulkDelete), y.dom.removeEventListener("ln-api-queue:send", y._handlers.queueSend), y.dom.removeEventListener("ln-api-queue:failed", y._handlers.queueFailed), y.dom.removeEventListener("ln-data-store:initialized", y._handlers.storeInitialized), document.removeEventListener("submit", y._handlers.formSubmit), a.forEach(function(E) {
      y.dom.removeEventListener(E + ":fetched", y._handlers.connFetched), y.dom.removeEventListener(E + ":created", y._handlers.connCreated), y.dom.removeEventListener(E + ":updated", y._handlers.connUpdated), y.dom.removeEventListener(E + ":deleted", y._handlers.connDeleted), y.dom.removeEventListener(E + ":bulk-deleted", y._handlers.connBulkDeleted), y.dom.removeEventListener(E + ":error", y._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", y._handlers.reqTableData), document.removeEventListener("ln-list:request-data", y._handlers.reqListData), document.removeEventListener("ln-chart:request-data", y._handlers.reqChartData), document.removeEventListener("ln-options:request-data", y._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", y._handlers.reqStat), y.dom.removeEventListener("ln-data-store:ready", y._handlers.refresh), y.dom.removeEventListener("ln-data-store:created", y._handlers.refresh), y.dom.removeEventListener("ln-data-store:updated", y._handlers.refresh), y.dom.removeEventListener("ln-data-store:deleted", y._handlers.refresh), y.dom.removeEventListener("ln-data-store:mutation-error", y._handlers.mutationError), y.dom.removeEventListener("ln-data-store:synced", y._handlers.refreshSynced), y.dom.removeEventListener("ln-data-store:query-changed", y._handlers.refreshQuery), y.dom.removeEventListener("ln-search:change", y._handlers.searchChange), y.dom.removeEventListener("ln-filter:change", y._handlers.filterChange), y.dom.removeEventListener("ln-sort:change", y._handlers.sortChange), y._handlers = null), y._boundQueries = null, y._boundDelivered = null, y._queryGens = null, y._queueQueryRefresh = null, y._mutationReceipts.close(new Error("Data coordinator destroyed")), y._mutationReceipts = null, m.delete(this), _(), delete this.dom[e];
  }, j(t, e, b, "ln-data-coordinator", {
    attributes: o
  });
})();
const zr = "ln_api_queue", Kr = 2, rt = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function Dt(t, e) {
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
function Vr(t, e, i, s) {
  const p = /* @__PURE__ */ new Map(), h = [], r = [];
  for (const l of t || [])
    p.has(l.chainKey) || p.set(l.chainKey, []), p.get(l.chainKey).push(l);
  return p.forEach((l, c) => {
    l.sort((o, u) => o.seq - u.seq);
    const n = l[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > s) {
        r.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > s) {
        r.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = s + i, n.updatedAt = s, h.push(n);
    }
  }), { entries: h, wakeups: r };
}
function Wr(t, e, i, s, p) {
  const h = [], r = [];
  for (const l of t || []) {
    if (l.entryId === e) {
      r.push(l.entryId);
      continue;
    }
    l.chainKey === i && (l.chainKey = s, l.targetId === i && (l.targetId = s), l.meta && l.meta.id === i && (l.meta.id = s), l.meta && typeof l.meta.action == "string" && (l.meta.action = jr(l.meta.action, i, s)), l.updatedAt = p, h.push(l));
  }
  return { changed: h, deleted: r };
}
class Gr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || zr, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const s = this.indexedDB.open(this.dbName, Kr);
      s.onupgradeneeded = (p) => {
        const h = p.target.result;
        let r;
        h.objectStoreNames.contains(rt) ? r = p.target.transaction.objectStore(rt) : r = h.createObjectStore(rt, { keyPath: "entryId" }), r.indexNames.contains("by_scope_chain") || r.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), r.indexNames.contains("by_scope_seq") || r.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(lt) || h.createObjectStore(lt, { keyPath: "key" });
      }, s.onerror = () => i(ut(s, "Queue database open failed")), s.onsuccess = (p) => {
        this._db = p.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const s = this.indexedDB.deleteDatabase(this.dbName);
      s.onsuccess = () => e(), s.onerror = () => i(ut(s, "Queue database delete failed")), s.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((s, p) => {
      const r = i.transaction(rt, "readonly").objectStore(rt).index("by_scope_seq").getAll(Dt(this.keyRange, e));
      r.onsuccess = () => s(r.result || []), r.onerror = () => p(ut(r, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((s) => s ? new Promise((p, h) => {
      const r = s.transaction([lt, rt], "readwrite"), l = r.objectStore(lt), c = r.objectStore(rt), n = an(e);
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
      }, m = l.get(n);
      m.onerror = () => h(ut(m, "Queue sequence read failed")), m.onsuccess = () => {
        const w = m.result;
        if (w && typeof w.value == "number") {
          u(w.value);
          return;
        }
        const v = c.index("by_scope_seq").getAll(Dt(this.keyRange, e));
        v.onerror = () => h(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, f) => Math.max(A, f.seq || 0), 0);
          u(S);
        };
      }, r.oncomplete = () => p(o), r.onerror = () => h(r.error || new Error("Queue enqueue transaction failed")), r.onabort = () => h(r.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, s) {
    return this.open().then((p) => p ? new Promise((h, r) => {
      const l = p.transaction(rt, "readwrite"), c = l.objectStore(rt), n = c.index("by_scope_seq").getAll(Dt(this.keyRange, e)), o = this.now();
      let u = { entries: [], wakeups: [] };
      n.onerror = () => r(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        u = Vr(n.result || [], i, s, o);
        for (const m of u.entries) c.put(m);
      }, l.oncomplete = () => h(u), l.onerror = () => r(l.error || new Error("Queue claim transaction failed")), l.onabort = () => r(l.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (s, p) => (p.delete(s.entryId), { status: "acked", entry: s }));
  }
  nack(e, i, s, p) {
    p = p || {};
    const h = p.maxAttempts || 8, r = p.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((l) => l ? new Promise((c, n) => {
      const o = l.transaction([rt, lt], "readwrite"), u = o.objectStore(rt), m = o.objectStore(lt), w = u.get(i);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (s === "drop") {
            u.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (ln(S), S.updatedAt = this.now(), s === "auth") {
            S.status = "pending", u.put(S), m.put({ key: Xt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (s === "retry") {
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
  remap(e, i, s) {
    return this._remapTransaction(e, null, i, s);
  }
  resolveCreate(e, i, s, p) {
    return this._remapTransaction(e, i, s, p);
  }
  _remapTransaction(e, i, s, p) {
    return this.open().then((h) => h ? new Promise((r, l) => {
      const c = h.transaction(rt, "readwrite"), n = c.objectStore(rt), o = n.index("by_scope_seq").getAll(Dt(this.keyRange, e));
      let u = { changed: [], deleted: [] };
      o.onerror = () => l(ut(o, "Queue remap read failed")), o.onsuccess = () => {
        u = Wr(o.result || [], i, s, p, this.now());
        for (const m of u.deleted) n.delete(m);
        for (const m of u.changed) n.put(m);
      }, c.oncomplete = () => r(u.changed), c.onerror = () => l(c.error || new Error("Queue remap transaction failed")), c.onabort = () => l(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((s, p) => {
      const h = i.transaction(rt, "readwrite"), r = h.objectStore(rt), l = r.index("by_scope_seq").getAll(Dt(this.keyRange, e));
      let c = 0;
      l.onerror = () => p(ut(l, "Queue failed-entry read failed")), l.onsuccess = () => {
        for (const n of l.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), ln(n), r.put(n), c++);
      }, h.oncomplete = () => s(c), h.onerror = () => p(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => p(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((s, p) => {
      const r = i.transaction(lt, "readonly").objectStore(lt).get(Xt(e));
      r.onsuccess = () => {
        const l = r.result ? r.result.value : !1;
        s(l || !1);
      }, r.onerror = () => p(ut(r, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((s) => {
      if (s)
        return new Promise((p, h) => {
          const r = s.transaction(lt, "readwrite"), l = typeof i == "string" ? i : i ? "manual" : !1;
          r.objectStore(lt).put({ key: Xt(e), value: l }), r.oncomplete = () => p(), r.onerror = () => h(r.error || new Error("Queue pause-state write failed")), r.onabort = () => h(r.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((s, p) => {
          const h = i.transaction([rt, lt], "readwrite"), l = h.objectStore(rt).index("by_scope_seq").openCursor(Dt(this.keyRange, e));
          l.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, l.onerror = () => p(ut(l, "Queue clear failed")), h.objectStore(lt).delete(an(e)), h.objectStore(lt).delete(Xt(e)), h.oncomplete = () => s(), h.onerror = () => p(h.error || new Error("Queue clear transaction failed")), h.onabort = () => p(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, s) {
    return this.open().then((p) => p ? new Promise((h, r) => {
      const l = p.transaction(rt, "readwrite"), c = l.objectStore(rt), n = c.get(i);
      let o = null;
      n.onerror = () => r(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const u = n.result;
        !u || u.scope !== e || (o = s(u, c));
      }, l.oncomplete = () => h(o), l.onerror = () => r(l.error || new Error("Queue entry transaction failed")), l.onabort = () => r(l.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], s = 8, p = 6e4;
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
        const m = Math.random() * 16 | 0;
        return (u === "x" ? m : m & 3 | 8).toString(16);
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
    const m = this;
    return c.open().then((w) => w ? c.getPaused(m.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (m._paused = !!w, m._paused) {
        const v = typeof w == "string" ? w : "auth";
        L(m.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return m._emitPendingCount();
    }).then(() => m._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), L(m.dom, "ln-api-queue:error", { operation: "initialize", error: w });
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
    const m = Math.max(0, u), w = this._timers.get(o);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(o), v._drain();
    }, m);
    this._timers.set(o, S);
  }, n.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = c.claimReady(o.scope, o._workerId, p).then((u) => {
      for (const m of u.wakeups)
        o._scheduleTimer(m.chainKey, m.at - Date.now());
      for (const m of u.entries)
        o._clearTimer(m.chainKey), L(o.dom, "ln-api-queue:send", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          op: m.op,
          targetId: m.targetId,
          payload: m.payload,
          expectedVersion: m.expectedVersion,
          idempotencyKey: m.entryId,
          meta: m.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), L(o.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, n.prototype._onEnqueue = function(o) {
    const u = this;
    return c.enqueue(u.scope, o.detail || {}).then((m) => {
      if (m)
        return u._emitPendingCount().then((w) => (L(u.dom, "ln-api-queue:enqueued", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          count: w.length
        }), u._drain()));
    }).catch((m) => {
      L(u.dom, "ln-api-queue:error", { operation: "enqueue", error: m });
    });
  }, n.prototype._onAck = function(o) {
    const u = this, m = o.detail || {};
    return c.ack(u.scope, m.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((w) => {
      L(u.dom, "ln-api-queue:error", { operation: "ack", entryId: m.entryId, error: w });
    });
  }, n.prototype._onNack = function(o) {
    const u = this, m = o.detail || {};
    return c.nack(u.scope, m.entryId, m.reason, {
      maxAttempts: s,
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
      L(u.dom, "ln-api-queue:error", { operation: "nack", entryId: m.entryId, error: w });
    });
  }, n.prototype._onRemap = function(o) {
    const u = this, m = o.detail || {};
    return c.remap(u.scope, m.oldKey, m.newId).catch((w) => {
      L(u.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(o) {
    const u = this, m = o.detail || {};
    return c.resolveCreate(u.scope, m.entryId, m.oldKey, m.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((w) => {
      L(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: m.entryId,
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
function Rt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function $r(t, e, i) {
  const s = si(t);
  return s === null || s < 0 ? 0 : Math.min(s, Math.min(e, i) / 2);
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
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, s = e.xField || "label", p = e.yField || "value", h = e.includeZero !== !1, r = $r(e.padding, i.width, i.height), l = Array.isArray(t) ? t : [], c = [];
  for (let a = 0; a < l.length; a++) {
    const g = l[a] || {}, b = si(g[p]);
    b !== null && c.push({
      record: g,
      sourceIndex: a,
      label: g[s] == null ? String(a + 1) : String(g[s]),
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
  for (let a = 1; a < c.length; a++)
    c[a].value < n && (n = c[a].value), c[a].value > o && (o = c[a].value);
  let u = n, m = o;
  h && (u = Math.min(0, u), m = Math.max(0, m)), u === m && (m === 0 ? m = 1 : m > 0 ? u = 0 : m = 0);
  const w = Math.max(1, i.width - r * 2), v = Math.max(1, i.height - r * 2), S = m - u, A = i.y + i.height - r - (0 - u) / S * v, f = [];
  for (let a = 0; a < c.length; a++) {
    const g = c[a], b = c.length === 1 ? 0.5 : a / (c.length - 1), T = i.x + r + b * w, y = i.y + i.height - r - (g.value - u) / S * v;
    f.push({
      record: g.record,
      sourceIndex: g.sourceIndex,
      label: g.label,
      value: g.value,
      x: T,
      y,
      pointString: Rt(T) + "," + Rt(y)
    });
  }
  const _ = f.map((a) => a.pointString).join(" ");
  let d = "";
  if (f.length > 0) {
    const a = f[0], g = f[f.length - 1], b = Rt(a.x) + "," + Rt(A), T = Rt(g.x) + "," + Rt(A);
    d = b + " " + _ + " " + T;
  }
  return {
    points: f,
    linePoints: _,
    areaPoints: d,
    count: f.length,
    min: n,
    max: o,
    domainMin: u,
    domainMax: m,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function s(n) {
    const o = n[e];
    o && o.requestData();
  }
  function p(n) {
    const o = n[e];
    o && o._render();
  }
  const h = {
    "data-ln-chart": { prop: "name", type: "string", read: $, fallback: "", effect: p, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: s, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: s, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: p, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: p, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: p, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: p, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: p, description: "Forces Y axis scale to start at zero" }
  }, r = et(h);
  function l(n, o) {
    n && (n.textContent = o);
  }
  function c(n) {
    this.dom = n, tt(this, n, r), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const o = this;
    return this._onSetData = function(u) {
      const m = u.detail || {};
      o._data = Array.isArray(m.data) ? m.data : [], o.isLoaded = !0, o._setLoading(!1), o._render();
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
    const m = Ct(this.dom, o, "ln-chart");
    if (!m) return;
    const w = it(this.dom);
    for (const v of n.points) {
      const S = m.cloneNode(!0);
      jt(S, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(S);
    }
  }, c.prototype._render = function() {
    const n = this._readOptions(), o = Yr(this._data, n);
    this.model = o, this.line && (this.line.setAttribute("points", o.linePoints), this.line.toggleAttribute("hidden", o.count === 0)), this.area && (this.area.setAttribute("points", o.areaPoints), this.area.toggleAttribute("hidden", o.count === 0 || n.type !== "area"));
    const u = o.count === 0;
    this.dom.classList.toggle("ln-chart--empty", u), this.empty && this.empty.toggleAttribute("hidden", !u);
    const m = it(this.dom);
    l(this.minimum, ct(o.min, m)), l(this.maximum, ct(o.max, m)), l(this.count, ct(o.count, m)), this._renderLabels(o), L(this.dom, "ln-chart:rendered", {
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
  }, s = et(i);
  function p(h) {
    this.dom = h, tt(this, h, s);
    const r = this;
    return this._onSetData = function(l) {
      r._rebuild(l.detail.data || []);
    }, h.addEventListener("ln-options:set-data", this._onSetData), L(h, "ln-options:request-data", { options: this._storeName }), this;
  }
  p.prototype._rebuild = function(h) {
    const r = this.dom, l = this._valueField, c = this._labelField, n = r.value, o = r.querySelectorAll("option");
    for (let m = o.length - 1; m >= 0; m--)
      o[m].value !== "" && r.removeChild(o[m]);
    for (let m = 0; m < h.length; m++) {
      const w = h[m], v = document.createElement("option");
      v.value = String(w[l]), v.textContent = w[c] != null ? w[c] : "", r.appendChild(v);
    }
    const u = r.options;
    for (let m = 0; m < u.length; m++)
      if (u[m].value === n) {
        r.value = n;
        break;
      }
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, p, "ln-options", {
    attributes: i
  });
})();
function Jr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), s = t.slice(e + 1).trim();
  if (!i) return null;
  const p = {};
  return p[i] = [s], p;
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
  }, s = et(i);
  function p(h) {
    return this.dom = h, tt(this, h, s), this._onSetCount = function(r) {
      h.textContent = Zr(r.detail && r.detail.count), h.classList.remove("is-loading");
    }, h.addEventListener("ln-stat:set-count", this._onSetCount), L(h, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Jr(this._filterRaw)
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, p, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", s = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let h = null;
  const r = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", n = "lni:v", o = "1";
  function u() {
    try {
      if (localStorage.getItem(n) !== o) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const d = localStorage.key(_);
          d && d.indexOf(c) === 0 && localStorage.removeItem(d);
        }
        localStorage.setItem(n, o);
      }
    } catch {
    }
  }
  u();
  function m() {
    return h || (h = document.getElementById(t), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = t, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function w(_) {
    return _.indexOf(i) === 0 ? l + "/" + _.slice(i.length) + ".svg" : r + "/" + _.slice(e.length) + ".svg";
  }
  function v(_, d) {
    const a = d.match(/viewBox="([^"]+)"/), g = a ? a[1] : "0 0 24 24", b = d.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = b ? b[1].trim() : "", y = d.match(/<svg([^>]*)>/i), E = y ? y[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = _, C.setAttribute("viewBox", g), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = E.match(new RegExp(q + '="([^"]*)"'));
      D && C.setAttribute(q, D[1]);
    }), C.innerHTML = T, m().querySelector("defs").appendChild(C);
  }
  function S(_) {
    if (s.has(_) || p.has(_)) return;
    if (_.indexOf(i) === 0 && !l) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const d = _.slice(1);
    try {
      const g = localStorage.getItem(c + d);
      if (g) {
        v(d, g), s.add(_);
        return;
      }
    } catch {
    }
    p.add(_);
    const a = w(_);
    fetch(a).then(function(g) {
      if (!g.ok) throw new Error(g.status);
      return g.text();
    }).then(function(g) {
      v(d, g), s.add(_), p.delete(_);
      try {
        localStorage.setItem(c + d, g);
      } catch {
      }
    }).catch(function(g) {
      console.error("[ln-icon] Fetch failed for:", d, g), p.delete(_);
    });
  }
  function A(_) {
    const d = 'use[href^="' + e + '"], use[href^="' + i + '"]', a = _.querySelectorAll ? _.querySelectorAll(d) : [];
    if (_.matches && _.matches(d)) {
      const g = _.getAttribute("href");
      g && S(g);
    }
    Array.prototype.forEach.call(a, function(g) {
      const b = g.getAttribute("href");
      b && S(b);
    });
  }
  function f() {
    A(document), new MutationObserver(function(_) {
      _.forEach(function(d) {
        if (d.type === "childList")
          d.addedNodes.forEach(function(a) {
            a.nodeType === 1 && A(a);
          });
        else if (d.type === "attributes" && d.attributeName === "href") {
          const a = d.target.getAttribute("href");
          a && (a.indexOf(e) === 0 || a.indexOf(i) === 0) && S(a);
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
  for (let s = 0; s <= e.length; s++) i[s] = [s];
  for (let s = 0; s <= t.length; s++) i[0][s] = s;
  for (let s = 1; s <= e.length; s++)
    for (let p = 1; p <= t.length; p++)
      e.charAt(s - 1) === t.charAt(p - 1) ? i[s][p] = i[s - 1][p - 1] : i[s][p] = Math.min(
        i[s - 1][p - 1] + 1,
        i[s][p - 1] + 1,
        i[s - 1][p] + 1
      );
  return i[e.length][t.length];
}
function eo(t, e = Me) {
  if (e.has(t)) return null;
  let i = null, s = 1 / 0;
  for (const h of e) {
    const r = to(t, h);
    r < s && (s = r, i = h);
  }
  const p = Math.max(3, Math.floor(t.length * 0.4));
  return s <= p ? i : null;
}
function ai(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function no(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const s = [], p = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < p.length; h++) {
    const r = p[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            s.push({
              type: "id-empty",
              element: r,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + ai(n)) || s.push({
            type: "id-unresolved",
            element: r,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return s;
}
function io(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const s = [], p = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < p.length; h++) {
    const r = p[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const o = (c.value || "").trim();
          if (!o) {
            s.push({
              type: "store-empty",
              element: r,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const u = ai(o), m = e.querySelector(`[data-ln-data-store="${u}"], [data-ln-store="${u}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(o);
          !m && !w && s.push({
            type: "store-unresolved",
            element: r,
            attribute: c.name,
            storeName: o,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${c.name}="${o}"> targets store "${o}", but no [data-ln-data-store="${o}"] exists in the document.`
          });
        }
      }
  }
  return s;
}
function ro(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], s = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && s.unshift(e);
  const p = /* @__PURE__ */ new Map();
  for (let h = 0; h < s.length; h++) {
    const r = s[h], l = (r.getAttribute("data-ln-data-store") || "").trim();
    l && (p.has(l) || p.set(l, []), p.get(l).push(r));
  }
  for (const [h, r] of p.entries())
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
  const s = [], p = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < p.length; h++) {
    const r = p[h];
    if (r.attributes)
      for (let l = 0; l < r.attributes.length; l++) {
        const c = r.attributes[l];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = eo(c.name, e), o = n ? ` Did you mean "${n}"?` : "";
          s.push({
            type: "attribute-unknown",
            element: r,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${r.tagName.toLowerCase()}>.${o}`
          });
        }
      }
  }
  return s;
}
function Ce(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Me, s = no(t), p = io(t), h = ro(t), r = oo(t, i), l = [
    ...s,
    ...p,
    ...h,
    ...r
  ];
  if (!e.silent)
    for (let c = 0; c < l.length; c++)
      console.warn(l[c].message);
  return {
    idIssues: s,
    storeIssues: p,
    uniquenessIssues: h,
    spellingIssues: r,
    total: l.length
  };
}
let Bt = null;
function Yt(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Bt && (clearTimeout(Bt), Bt = null);
  function s() {
    Bt = setTimeout(() => {
      Bt = null;
      const p = Ce(t);
      i && i(p);
    }, e);
  }
  bn() > 0 ? mt(s) : s();
}
function so(t, e, i, s) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", s), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", s.oldValue, "→", s.newValue), console.groupEnd());
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
function lo(t, e, i, s) {
  li(i) && so(t, e, i, s);
}
function Te() {
  ao(), Ci(qt.length > 0 ? lo : null, qt.length > 0 ? li : null);
}
function cn() {
  Te();
}
function co() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Te(), Vt(["data-ln-debug"], Te);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  co();
  function s(h) {
    return this.dom = h, Yt(h.ownerDocument || document), cn(), this;
  }
  s.prototype.verify = function(h, r) {
    return Ce(h || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, s.prototype.destroy = function() {
    delete this.dom[e], cn();
  };
  const p = j(t, e, s, "ln-debug", {
    attributes: i,
    onInit: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    },
    onSubtreeChange: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    }
  });
  p.verify = function(h, r) {
    return Ce(h || document, r);
  }, p.schedule = function(h, r, l) {
    return Yt(h || document, r, l);
  };
})();
