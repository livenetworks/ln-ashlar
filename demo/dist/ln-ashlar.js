function Q(t, e, o) {
  const h = t.getAttribute(e);
  return h === null ? o : h;
}
function Dt(t, e, o) {
  const h = parseInt(t.getAttribute(e), 10);
  return isNaN(h) ? o : h;
}
function Kt(t, e) {
  return t.hasAttribute(e);
}
function rr(t, e) {
  return (t.getAttribute(e) || "").split(",").map((o) => o.trim()).filter(Boolean);
}
function tt(t, e, o) {
  for (const h in o) {
    const [b, m, s] = o[h];
    Object.defineProperty(t, h, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return b(e, m, s);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function et(t) {
  const e = {};
  for (const o in t) {
    const h = t[o];
    !h || !h.prop || (e[h.prop] = [h.read, o, h.fallback]);
  }
  return e;
}
function ir(t) {
  const e = {};
  for (const o in t) {
    const h = t[o];
    h && h.effect && (e[o] = h.effect);
  }
  return Object.keys(e).length ? e : null;
}
function or(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const o in t.effects) e.add(o);
  if (t.onAttrChange && t.declared) for (const o of t.declared) e.add(o);
  return e;
}
function Ce(t) {
  let e = !1;
  for (let o = 0; o < t.length; o++) {
    const h = t[o];
    if (!(h === "" || h == null) && (e = !0, !Number.isFinite(Number(h))))
      return "string";
  }
  return e ? "number" : "string";
}
function Te(t, e, o, h) {
  if (o === "number") {
    const s = parseFloat(t), a = parseFloat(e);
    return (isNaN(s) ? 0 : s) - (isNaN(a) ? 0 : a);
  }
  const b = t != null ? String(t) : "", m = e != null ? String(e) : "";
  return h ? h.compare(b, m) : b < m ? -1 : b > m ? 1 : 0;
}
if (typeof window < "u" && (window.lnCore = window.lnCore || {}, !window.lnCore._warnBound)) {
  window.lnCore._warnBound = !0;
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const de = {};
function Jt(t, e) {
  de[t] || (de[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const o = de[t];
  return o ? o.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function sr(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function ar(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function q(t, e, o) {
  const h = o || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, h), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: h
  }));
}
function Z(t, e, o) {
  const h = o || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, h);
  const b = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: h
  });
  return t.dispatchEvent(b), b;
}
function on(t, e, o) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const h = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  h[o] = t.name, q(t.dom, e, h);
}
function pt(t, e) {
  if (!t || !e) return t;
  const o = t.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < o.length; s++) {
    const a = o[s], c = a.getAttribute("data-ln-field");
    e[c] != null && (a.textContent = e[c]);
  }
  const h = t.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < h.length; s++) {
    const a = h[s], c = a.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const r = c[n].trim().split(":");
      if (r.length !== 2) continue;
      const f = r[0].trim(), d = r[1].trim();
      e[d] != null && a.setAttribute(f, e[d]);
    }
  }
  const b = t.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < b.length; s++) {
    const a = b[s], c = a.getAttribute("data-ln-show");
    c in e && a.classList.toggle("hidden", !e[c]);
  }
  const m = t.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < m.length; s++) {
    const a = m[s], c = a.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < c.length; n++) {
      const r = c[n].trim().split(":");
      if (r.length !== 2) continue;
      const f = r[0].trim(), d = r[1].trim();
      d in e && a.classList.toggle(f, !!e[d]);
    }
  }
  return t;
}
function lr(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const o = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let h = 0; h < o.length; h++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", o[h], e ?? null), o[h].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      pt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let o = 0; o < e.length; o++)
        e[o].textContent = "";
    }
})));
function jt(t, e) {
  if (!t || !e) return t;
  const o = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; o.nextNode(); ) {
    const m = o.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(s, a) {
        return e[a] !== void 0 ? e[a] : "";
      }
    ));
  }
  const h = function(m, s) {
    return e[s] !== void 0 ? e[s] : "";
  }, b = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && b.push(t);
  for (let m = 0; m < b.length; m++) {
    const s = b[m], a = s.attributes;
    for (let c = 0; c < a.length; c++) {
      const n = a[c];
      n.value.indexOf("{{") !== -1 && s.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, h));
    }
  }
  return t;
}
function cr(t, e, o, h, b, m) {
  const s = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], r = n.getAttribute("data-ln-render-key");
    r && (s[r] = n);
  }
  const a = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], r = String(h(n));
    let f = s[r];
    if (f)
      b(f, n, c);
    else {
      const d = Jt(o, m);
      if (!d || (jt(d, n), f = d.firstElementChild, !f)) continue;
      f.setAttribute("data-ln-render-key", r), b(f, n, c);
    }
    a.appendChild(f);
  }
  t.textContent = "", t.appendChild(a);
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
function Tt(t, e, o) {
  if (t) {
    const h = t.querySelector('[data-ln-template="' + e + '"]');
    if (h) return h.content.cloneNode(!0);
  }
  return Jt(e, o);
}
function re(t, e) {
  const o = {}, h = t.querySelectorAll("[" + e + "]");
  for (let b = 0; b < h.length; b++)
    o[h[b].getAttribute(e)] = h[b].textContent, h[b].remove();
  return o;
}
function Le(t, e, o, h) {
  if (t.nodeType !== 1) return;
  const m = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", s = Array.from(t.querySelectorAll(m));
  t.matches && t.matches(m) && s.push(t);
  for (const a of s)
    a[o] || (window.lnCore._persistSink && a.hasAttribute("data-ln-persist") && window.lnCore._persistSink(a, e), a[o] = new h(a));
}
function Ut(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function sn(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function dr(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function an(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function ur(t, e) {
  return !t || !document.contains(t) || an(t) || e && typeof t[e] != "function" ? !1 : Ut(t);
}
function hr(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function ln(t, e) {
  const o = !!(e && e.typed), h = e && e.exclude, b = {}, m = t.elements, s = {};
  if (o)
    for (let a = 0; a < m.length; a++) {
      const c = m[a];
      c.name && c.type === "checkbox" && !c.disabled && (s[c.name] = (s[c.name] || 0) + 1);
    }
  for (let a = 0; a < m.length; a++) {
    const c = m[a];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(h && c.matches && c.matches(h)))
      if (c.type === "checkbox")
        o && s[c.name] === 1 ? b[c.name] = c.checked : (b[c.name] || (b[c.name] = []), c.checked && b[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (b[c.name] = c.value);
      else if (c.type === "select-multiple") {
        b[c.name] = [];
        for (let n = 0; n < c.options.length; n++)
          c.options[n].selected && b[c.name].push(c.options[n].value);
      } else if (o && c.type === "hidden")
        b[c.name] = c.value;
      else if (o && (c.type === "number" || c.type === "range")) {
        const n = Number(c.value);
        b[c.name] = c.value === "" || isNaN(n) ? null : n;
      } else
        b[c.name] = c.value;
  }
  return b;
}
function fr(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function cn(t, e) {
  const o = t.elements, h = [], b = {};
  for (let m = 0; m < o.length; m++) {
    const s = o[m];
    s.name && s.type === "checkbox" && (b[s.name] = (b[s.name] || 0) + 1);
  }
  for (let m = 0; m < o.length; m++) {
    const s = o[m];
    if (s.type === "file" || s.type === "submit" || s.type === "button") continue;
    const a = s.getAttribute("data-ln-fill-as") || s.name;
    if (!a || !(a in e)) continue;
    const c = e[a];
    if (s.type === "checkbox") {
      if (Array.isArray(c))
        s.checked = c.indexOf(s.value) !== -1;
      else if (b[s.name] > 1) {
        const n = String(c).split(",").map(function(r) {
          return r.trim();
        });
        s.checked = n.indexOf(s.value) !== -1;
      } else
        s.checked = fr(c);
      h.push(s);
    } else if (s.type === "radio")
      s.checked = s.value === String(c), h.push(s);
    else if (s.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < s.options.length; n++)
          s.options[n].selected = c.indexOf(s.options[n].value) !== -1;
      h.push(s);
    } else
      s.value = c, h.push(s);
  }
  return h;
}
const Ne = {
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
function rt(t) {
  const e = t ? t.closest("[lang]") : null, o = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!o) return "en-US";
  const h = o.trim().toLowerCase();
  return h.indexOf("-") === -1 && Ne[h] ? Ne[h] : o;
}
function ie() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, gt(function() {
    new MutationObserver(function() {
      q(document, "ln-core:locale-change", {});
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
function dn(t, e, { get: o, set: h }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return o ? o.call(this) : e.get.call(this);
    },
    set: function(b) {
      h ? h.call(this, b, (m) => e.set.call(this, m)) : e.set.call(this, b);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function pr() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function ue() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function un() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function hn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function fn(t) {
  const e = hn(), o = t.observed || [];
  for (let h = 0; h < o.length; h++) {
    const b = o[h];
    e.byAttr.has(b) || e.byAttr.set(b, []), e.byAttr.get(b).push(t);
  }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const h = or(t);
    if (h === null)
      e.reactiveWildcard.push(t);
    else
      for (const b of h)
        e.byReactive.has(b) || e.byReactive.set(b, []), e.byReactive.get(b).push(t);
  }
  t.persist && e.persist.push(t);
}
function Fe(t, e, o, h) {
  for (let b = 0; b < t.length; b++) {
    const m = t[b];
    if (!e[m.attribute]) continue;
    const s = m.effects && m.effects[o];
    s ? s(e, o, h) : m.onAttrChange && (!m.declared || m.declared.has(o)) && m.onAttrChange(e, o, h);
  }
}
function mr(t) {
  const e = t.target, o = t.attributeName;
  if (t.oldValue === e.getAttribute(o)) return;
  const h = hn(), b = h.byAttr.get(o);
  if (window.lnCore._debugSink && (o.indexOf("data-ln-") === 0 || b) && window.lnCore._debugSink("attr", o, e, { oldValue: t.oldValue, newValue: e.getAttribute(o) }), o.indexOf("data-ln-") === 0) {
    const m = h.byReactive.get(o);
    m && Fe(m, e, o, t.oldValue), h.reactiveWildcard.length && Fe(h.reactiveWildcard, e, o, t.oldValue);
  }
  if (b)
    for (let m = 0; m < b.length; m++) {
      const s = b[m];
      if (s.handler) {
        s.handler(e, o, t.oldValue);
        continue;
      }
      s.onAttributeChange && e[s.attribute] ? s.onAttributeChange(e, o) : (Le(e, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(e));
    }
}
function pn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let o = 0; o < e.length; o++)
        mr(e[o]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function mn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function gr(t) {
  const e = mn();
  if (e.length) {
    if (t.target)
      for (let o = 0; o < e.length; o++) {
        const h = e[o];
        if (h.onSubtreeChange) {
          const b = h.query, m = t.target.nodeType === 1 ? t.target.matches(b) ? t.target : t.target.closest(b) : t.target.parentElement ? t.target.parentElement.closest(b) : null;
          m && h.onSubtreeChange(m, t);
        }
      }
    for (let o = 0; o < t.addedNodes.length; o++) {
      const h = t.addedNodes[o];
      if (h.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const m = e[b];
          Le(h, m.selector, m.attribute, m.ComponentFn), m.onInit && m.onInit(h);
        }
    }
    for (let o = 0; o < t.removedNodes.length; o++) {
      const h = t.removedNodes[o];
      if (h.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const m = e[b], s = m.query, a = Array.from(h.querySelectorAll(s));
          h.matches && h.matches(s) && a.push(h);
          for (let c = 0; c < a.length; c++) {
            const n = a[c];
            if (!document.contains(n)) {
              const r = n[m.attribute];
              r && typeof r.destroy == "function" && r.destroy(), delete n[m.attribute];
            }
          }
        }
    }
  }
}
function _r() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let o = 0; o < e.length; o++) {
        const h = e[o];
        h.type === "childList" && gr(h);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Vt(t, e) {
  fn({ observed: t, handler: e }), pn();
}
function j(t, e, o, h, b = {}) {
  const m = b.extraAttributes || [], s = b.onAttributeChange || null, a = b.onSubtreeChange || null, c = b.onInit || null, n = b.onAttrChange || null, r = b.effects || null, f = b.attributes || null, d = f ? ir(f) : r, w = f ? new Set(Object.keys(f)) : null, v = b.persist || null;
  function S(i) {
    const p = i || document.body;
    Le(p, t, e, o), c && c(p);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const i = /\[([\w-]+)/g;
    let p;
    for (; (p = i.exec(t)) !== null; )
      A.push(p[1]);
  } else
    A.push(t);
  fn({
    selector: t,
    attribute: e,
    ComponentFn: o,
    onInit: c,
    observed: A.concat(m),
    onAttributeChange: s,
    onAttrChange: n,
    effects: d,
    declared: w,
    persist: v
  }), pn();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  mn().push({
    selector: t,
    attribute: e,
    ComponentFn: o,
    onInit: c,
    onSubtreeChange: a,
    query: _
  }), _r(), window[e] = S;
  function l() {
    un() > 0 ? mt(function() {
      S(document.body);
    }) : S(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l(), S;
}
function gn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const o = e.getAttribute("href");
  return !(!o || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || o.startsWith("mailto:") || o.startsWith("tel:") || o === "#" || o.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, o) => o === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Nt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function _n(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (o) {
    return console.error(`[${e}] Invalid headers JSON:`, o), {};
  }
}
const bn = {};
function br(t, e) {
  bn[t] = e;
}
function yr(t) {
  return bn[t] || { ingress: (e) => e, egress: (e) => e };
}
const yn = {};
function qe(t, e) {
  if (!t || typeof e != "object") return;
  const o = t.toLowerCase().split("-")[0];
  yn[o] = e;
}
function kt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return yn[e] || null;
}
qe("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = br, window.lnCore.getDataMapper = yr, window.lnCore.registerLocaleFallback = qe, window.lnCore.getLocaleFallback = kt, window.lnCore.fillTemplate = jt, window.lnCore.fill = pt, window.lnCore.lnFill = lr, window.lnCore.renderList = cr, window.lnCore.ensureLocaleObserver = ie);
function oe(t, e) {
  let o = !1;
  return function() {
    o || (o = !0, queueMicrotask(function() {
      o = !1, t();
    }));
  };
}
function vn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, o = t.pageSize > 0 ? t.pageSize : 200, h = t.threshold != null ? t.threshold : 25, b = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, s = typeof t.onChange == "function" ? t.onChange : function() {
  }, a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let r = 0, f = 0, d = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, u = !1;
  function _(y) {
    c.set(y, ++S);
  }
  function l() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function i() {
    if (a.size <= e) return;
    const y = Array.from(a.keys()).sort(function(g, E) {
      return (c.get(g) || 0) - (c.get(E) || 0);
    });
    let T = 0;
    for (; a.size > e && T < y.length; )
      a.delete(y[T]), c.delete(y[T]), T++;
  }
  function p(y, T) {
    n.add(y), m(w, y, T);
  }
  return {
    get: function(y) {
      return a.get(y);
    },
    has: function(y) {
      return a.has(y);
    },
    peek: function() {
      return a.size ? a.values().next().value : void 0;
    },
    get logicalTotal() {
      return r;
    },
    get grandTotal() {
      return f;
    },
    get queryGen() {
      return d;
    },
    get size() {
      return a.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(y, T) {
      clearTimeout(v), A = y;
      for (let I = y; I < T; I++)
        a.has(I) && _(I);
      if (r <= 0) return;
      const g = Math.max(0, y - h), E = Math.min(r, T + h), C = Math.floor(g / o), k = Math.floor(Math.max(0, E - 1) / o);
      let D = -1;
      for (let I = C; I <= k; I++) {
        const R = I * o, O = Math.min(o, r - R);
        let P = !1;
        const B = Math.max(R, g), U = Math.min(R + O, E);
        for (let z = B; z < U; z++)
          if (!a.has(z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (v = setTimeout(function() {
        p(D, o);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== d) return !1;
      const T = y.offset || 0, g = y.data || [];
      let E = 0;
      for (let C = 0; C < g.length; C++)
        g[C] != null && E++;
      if (E === 0 && (y.provisional || y.filtered > 0))
        return n.delete(T), !1;
      u && (a.clear(), c.clear(), u = !1), y.provisional || (f = y.total != null ? y.total : f, r = y.filtered != null ? y.filtered : y.data ? y.data.length : r);
      for (let C = 0; C < g.length; C++)
        g[C] != null && (a.set(T + C, g[C]), _(T + C));
      return n.delete(T), i(), s(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (w = y), p(0, o);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(y) {
      d++, n.clear(), clearTimeout(v), y && (w = y), u = !0, p(0, o);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      d++, n.clear(), clearTimeout(v), u = !0;
      const y = Math.max(0, Math.floor(A / o) * o);
      p(y, o);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(y) {
      n.delete(y);
    },
    destroy: function() {
      clearTimeout(v), a.clear(), c.clear(), n.clear();
    },
    configure: function(y) {
      y = y || {};
      let T = !1;
      if (y.windowSize != null && y.windowSize > 0 && y.windowSize !== e) {
        const g = y.windowSize < e;
        e = y.windowSize, g && i(), T = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (o = y.pageSize), y.threshold != null && y.threshold >= 0 && (h = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (b = y.fetchDebounce), T && s();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (f = y, l() || (r = y), s());
    }
  };
}
function wn(t) {
  return (t || "").replace(/^#/, "");
}
function se(t) {
  const e = t === void 0 ? location.hash : t, o = {}, h = wn(e);
  if (!h) return o;
  const b = h.split("&");
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (!s) continue;
    const a = s.indexOf(":"), c = a > -1 ? s.slice(0, a) : s, n = a > -1 ? s.slice(a + 1) : "";
    if (c)
      try {
        o[c] = decodeURIComponent(n);
      } catch {
        o[c] = n;
      }
  }
  return o;
}
function ot(t) {
  if (!t) return null;
  const e = se();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const o = se();
  e == null ? delete o[t] : o[t] = String(e);
  const b = Object.keys(o).map(function(m) {
    const s = o[m];
    return s === "" ? m : m + ":" + encodeURIComponent(s);
  }).join("&");
  wn(location.hash) !== b && (location.hash = b);
}
function ke(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const o = t.getAttribute("data-ln-hash");
  if (o && o.trim() !== "") return o.trim();
  const h = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return h ? e ? h + "-" + e : h : e || null;
}
function En(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ge(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function An(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function _e(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const o = t.slice(0, e), h = t.slice(e + 1), b = h ? h.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: o, values: b };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = ke, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = En, window.lnCore.hashSortDecode = ge, window.lnCore.hashFilterEncode = An, window.lnCore.hashFilterDecode = _e);
function Zt(t, e, o, h) {
  const b = typeof h == "number" ? h : 4, m = window.innerWidth, s = window.innerHeight, a = e.width, c = e.height, n = (o || "bottom").split("-"), r = n[0], f = n[1] === "start" || n[1] === "end" ? n[1] : "center", d = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = d[r] || d.bottom;
  function v(l) {
    return l === "top" || l === "bottom" ? f === "start" ? t.left : f === "end" ? t.right - a : t.left + (t.width - a) / 2 : f === "start" ? t.top : f === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(l) {
    let i, p, y = !0;
    return l === "top" ? (i = t.top - b - c, p = v(l), i < 0 && (y = !1)) : l === "bottom" ? (i = t.bottom + b, p = v(l), i + c > s && (y = !1)) : l === "left" ? (i = v(l), p = t.left - b - a, p < 0 && (y = !1)) : (i = v(l), p = t.right + b, p + a > m && (y = !1)), { top: i, left: p, side: l, fits: y };
  }
  let A = null;
  for (let l = 0; l < w.length; l++) {
    const i = S(w[l]);
    if (i.fits) {
      A = i;
      break;
    }
  }
  A || (A = S(w[0]));
  let u = A.top, _ = A.left;
  return a >= m ? _ = 0 : (_ < 0 && (_ = 0), _ + a > m && (_ = m - a)), c >= s ? u = 0 : (u < 0 && (u = 0), u + c > s && (u = s - c)), { top: u, left: _, placement: A.side };
}
function be(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, o = e.visibility, h = e.display, b = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const m = t.offsetWidth, s = t.offsetHeight;
  return e.visibility = o, e.display = h, e.position = b, { width: m, height: s };
}
let Ct = null;
async function Pe(t) {
  if (!t) {
    Ct = null;
    return;
  }
  try {
    const e = new TextEncoder(), o = await crypto.subtle.digest("SHA-256", e.encode(t));
    Ct = await crypto.subtle.importKey(
      "raw",
      o,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    console.error("[ln-core/crypto] Key derivation failed:", e), Ct = null;
  }
}
function At() {
  return Ct;
}
async function vr(t, e = Ct) {
  const o = e || Ct;
  if (!o || t === void 0 || t === null) return t;
  try {
    const h = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), m = typeof t == "string" ? t : JSON.stringify(t), s = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      o,
      h.encode(m)
    ), a = btoa(String.fromCharCode(...b)), c = btoa(String.fromCharCode(...new Uint8Array(s)));
    return {
      encrypted: !0,
      iv: a,
      data: c
    };
  } catch (h) {
    return console.error("[ln-core/crypto] Encryption failed:", h), t;
  }
}
async function wr(t, e = Ct) {
  const o = e || Ct;
  if (!t || !t.encrypted || !o) return t;
  try {
    const h = new TextDecoder(), b = Uint8Array.from(atob(t.iv), (c) => c.charCodeAt(0)), m = Uint8Array.from(atob(t.data), (c) => c.charCodeAt(0)), s = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      o,
      m
    ), a = h.decode(s);
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  } catch (h) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", h), { ...t, decryptionError: !0 };
  }
}
function Sn(t, e = 100, o = 0) {
  const h = parseFloat(String(t)) || 0, b = parseFloat(String(e)) || 100, m = parseFloat(String(o)) || 0, s = Math.max(m, Math.min(h, b)), a = b - m;
  let c = 0;
  return a > 0 && (c = (s - m) / a * 100), c = Math.max(0, Math.min(100, c)), {
    value: h,
    min: m,
    max: b,
    clampedValue: s,
    percentage: c
  };
}
function st(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const o = e < 1e11 ? e * 1e3 : e, h = new Date(o);
    return isNaN(h.getTime()) ? null : h;
  }
  if (typeof t == "string") {
    const o = t.trim();
    if (!o) return null;
    const h = new Date(o);
    return isNaN(h.getTime()) ? null : h;
  }
  return null;
}
function Ft(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), o = String(t.getMonth() + 1).padStart(2, "0"), h = String(t.getDate()).padStart(2, "0");
  return e + "-" + o + "-" + h;
}
const yt = {};
function te(t) {
  const e = t || "default";
  if (!yt[e]) {
    const o = new Intl.NumberFormat(t, { useGrouping: !0 }), h = o.formatToParts(1234.5);
    let b = "", m = ".";
    for (let s = 0; s < h.length; s++)
      h[s].type === "group" && (b = h[s].value), h[s].type === "decimal" && (m = h[s].value);
    yt[e] = { groupSep: b, decimalSep: m, fmt: o };
  }
  return yt[e];
}
function Cn(t, e, o) {
  if (t == null || typeof t != "string") return "";
  let h = t.trim();
  return h === "" ? "" : (h = h.replace(/[$€£¥]/g, ""), e && (h = h.split(e).join("")), h = h.replace(/\s/g, ""), o && o !== "." && (h = h.replace(o, ".")), h = h.replace(/[^\d.-]/g, ""), h);
}
function Er(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const o = t.trim();
  if (o === "" || o === "-") return NaN;
  const h = te(e), b = Cn(o, h.groupSep, h.decimalSep);
  if (b === "" || b === "-") return NaN;
  const m = parseFloat(b);
  return isNaN(m) ? NaN : m;
}
function ct(t, e, o = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const h = e || "default", b = o.maxDecimals != null ? parseInt(o.maxDecimals, 10) : null, m = o.userDecimals != null ? o.userDecimals : null;
  if (b !== null) {
    const s = h + "|max:" + b;
    return yt[s] || (yt[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: b
    })), yt[s].format(t);
  }
  if (m !== null && m > 0) {
    const s = h + "|exact:" + m;
    return yt[s] || (yt[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: m,
      maximumFractionDigits: m
    })), yt[s].format(t);
  }
  return te(e).fmt.format(t);
}
function ye(t) {
  return String(t || "").trim().toLowerCase();
}
function Tn(t) {
  const e = ye(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function Ar(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((o) => o.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Ln(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const o = String(t).toLowerCase();
  for (let h = 0; h < e.length; h++)
    if (o.indexOf(e[h]) === -1) return !1;
  return !0;
}
function Sr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function xe(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const o = String(t).trim().toLowerCase();
  for (let h = 0; h < e.length; h++)
    if (String(e[h]).trim().toLowerCase() === o)
      return !0;
  return !1;
}
function Cr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Tr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Lr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function qr(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function h(s, a) {
    a = a || {};
    const c = Cr(s), n = Tr(s, a), r = Lr(c, n);
    qr(n) && e.has(r) && (e.get(r).abort(), e.delete(r));
    const f = new AbortController(), d = a.signal;
    let w = null;
    d && (d.aborted ? f.abort(d.reason) : (w = function() {
      f.abort(d.reason);
    }, d.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, a, { signal: f.signal });
    return e.set(r, f), t(s, v).finally(function() {
      d && w && d.removeEventListener("abort", w), e.get(r) === f && e.delete(r);
    });
  }
  h.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = h;
  function b(s) {
    if (!s.detail || !s.detail.url) return;
    const a = s.target, c = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), n = s.detail.key;
    n && o.has(n) && (o.get(n).abort(), o.delete(n));
    const r = new AbortController(), f = s.detail.signal;
    let d = null;
    f && (f.aborted ? r.abort(f.reason) : (d = function() {
      r.abort(f.reason);
    }, f.addEventListener("abort", d, { once: !0 }))), n && o.set(n, r);
    const w = { method: c, signal: r.signal };
    s.detail.body !== void 0 && (w.body = s.detail.body), window.fetch(s.detail.url, w).then(function(v) {
      f && d && f.removeEventListener("abort", d), n && o.get(n) === r && o.delete(n), q(a, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      f && d && f.removeEventListener("abort", d), n && o.get(n) === r && o.delete(n), !(v && v.name === "AbortError") && q(a, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
      });
    });
  }
  function m(s) {
    const a = s.detail || {};
    a.all ? window.lnHttp.cancelAll() : a.key ? window.lnHttp.cancelByKey(a.key) : a.url && window.lnHttp.cancel(a.url);
  }
  document.addEventListener("ln-http:request", b), document.addEventListener("ln-http:cancel", m), window.lnHttp = {
    cancel: function(s) {
      let a = !1;
      return e.forEach(function(c, n) {
        n.endsWith(" " + s) && (c.abort(), e.delete(n), a = !0);
      }), a;
    },
    cancelByKey: function(s) {
      return o.has(s) ? (o.get(s).abort(), o.delete(s), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(s) {
        s.abort();
      }), e.clear(), o.forEach(function(s) {
        s.abort();
      }), o.clear();
    },
    get inflight() {
      const s = [];
      return e.forEach(function(a, c) {
        const n = c.indexOf(" ");
        s.push({ method: c.slice(0, n), url: c.slice(n + 1) });
      }), o.forEach(function(a, c) {
        s.push({ key: c });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", b), document.removeEventListener("ln-http:cancel", m), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-include": { prop: "url", read: Q, fallback: "" }
  }, h = et(o), b = /* @__PURE__ */ new Map();
  function m(s) {
    if (this.dom = s, tt(this, s, h), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    pr(), this._held = !0;
    const a = this, c = this.url;
    let n = b.get(c);
    return n || (n = fetch(c).then(function(r) {
      if (!r.ok)
        throw new Error("HTTP error! status: " + r.status);
      return r.text();
    }).catch(function(r) {
      throw b.delete(c), r;
    }), b.set(c, n)), n.then(function(r) {
      if (a._destroyed) return;
      const f = document.createElement("template");
      f.innerHTML = r, a.dom.content.appendChild(f.content), q(a.dom, "ln-include:loaded", { target: a.dom, url: a.url }), a._held && (a._held = !1, ue());
    }).catch(function(r) {
      a._destroyed || (console.error("[ln-include] Failed to fetch template from " + a.url + ":", r), q(a.dom, "ln-include:error", { target: a.dom, url: a.url, error: r }), a._held && (a._held = !1, ue()));
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ue()), delete this.dom[e]);
  }, j(t, e, m, "ln-include", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-form": {},
    "data-ln-form-action-edit": { prop: "_actionEdit", read: Q, fallback: "" },
    "data-ln-form-action-method": { prop: "_actionMethod", read: Q, fallback: "PUT" }
  }, h = et(o);
  function b(m) {
    this.dom = m, tt(this, m, h), this._baseAction = m.getAttribute("action") || "";
    const s = this;
    return this._onLnFill = function(a) {
      a.target === s.dom && (a.detail ? (s.fill(a.detail), s._applyActionMode(a.detail)) : s.dom.reset());
    }, this._onReset = function() {
      s._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(m) {
    const s = cn(this.dom, m);
    for (let a = 0; a < s.length; a++) {
      const c = s[a], n = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, b.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const s = m && m.id != null && m.id !== "" ? m.id : null, a = this._ensureMethodInput();
    if (s !== null) {
      const c = this._actionEdit;
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(s))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(s)), a.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), a.value = "";
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), q(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, b, "ln-form", {
    attributes: o
  });
})();
const Be = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function He(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function kr(t, e) {
  const o = [];
  if (t) {
    const h = Object.keys(Be);
    for (let b = 0; b < h.length; b++) {
      const m = h[b], s = Be[m];
      t[s] && o.push(m);
    }
  }
  if (e) {
    const h = Array.from(e);
    for (let b = 0; b < h.length; b++)
      h[b] && o.indexOf(h[b]) === -1 && o.push(h[b]);
  }
  return o;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", o = "data-ln-validate-errors", h = "data-ln-validate-error", b = "ln-validate-valid", m = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-validate": {},
    "data-ln-validate-errors": {},
    "data-ln-validate-error": {}
  };
  function a(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, r = c.tagName, f = c.type, d = r === "SELECT" || f === "checkbox" || f === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(S) {
      const A = S.detail && S.detail.error;
      if (!A) return;
      n._customErrors.add(A), n._touched = !0;
      const u = c.closest(".form-element");
      if (u) {
        const _ = u.querySelector("[" + h + '="' + A + '"]');
        _ && _.classList.remove("hidden");
      }
      c.classList.remove(b), c.classList.add(m), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, u = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), u) {
          const _ = u.querySelector("[" + h + '="' + A + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(_) {
          if (u) {
            const l = u.querySelector("[" + h + '="' + _ + '"]');
            l && l.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, d || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = c.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(S) {
      n._touched = !0, !n.validate() && S.detail && S.detail.invalidFields && S.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(S) {
      const A = { invalidFields: [] };
      q(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((u, _) => u.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (c.value && c.value.trim() !== "" || c.checked) && (this._touched = !0, this.validate()), this;
  }
  a.prototype.validate = function() {
    const c = this.dom, n = c.validity, r = He(n, this._customErrors.size), f = kr(n, this._customErrors), d = c.closest(".form-element");
    if (d) {
      const v = d.querySelector("[" + o + "]");
      if (v) {
        const S = v.querySelectorAll("[" + h + "]");
        for (let A = 0; A < S.length; A++) {
          const u = S[A].getAttribute(h);
          S[A].classList.toggle("hidden", !f.includes(u));
        }
      }
    }
    return c.classList.toggle(b, r), c.classList.toggle(m, !r), c.setAttribute("aria-invalid", r ? "false" : "true"), q(c, r ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: f }), r;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + h + "]");
      for (let r = 0; r < n.length; r++)
        n[r].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return He(this.dom.validity, this._customErrors.size);
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid"), q(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, a, "ln-validate", {
    attributes: s
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", o = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function h(f) {
    if (!f.hasAttribute(t) || f[e]) return;
    f[e] = !0;
    const d = c(f);
    b(d.links), m(d.forms);
  }
  function b(f) {
    for (const d of f) {
      if (d[e + "Trigger"] || d.hostname && d.hostname !== window.location.hostname) continue;
      const w = d.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!gn(S, d)) return;
        S.preventDefault();
        const A = d.getAttribute("href");
        A && a("GET", A, null, d);
      };
      d.addEventListener("click", v), d[e + "Trigger"] = v;
    }
  }
  function m(f) {
    for (const d of f) {
      if (d[e + "Trigger"]) continue;
      if (d.hasAttribute(o)) {
        d[e + "ScopeWarned"] || (d[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const S = d.method.toUpperCase(), A = d.action, u = new FormData(d);
        for (const _ of d.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        a(S, A, u, d, function() {
          for (const _ of d.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      d.addEventListener("submit", w), d[e + "Trigger"] = w;
    }
  }
  function s(f) {
    if (!f[e]) return;
    const d = c(f);
    for (const w of d.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of d.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete f[e];
  }
  function a(f, d, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: f, url: d }).defaultPrevented) return;
    q(v, "ln-ajax:start", { method: f, url: d }), v.classList.add("ln-ajax--loading");
    const u = document.createElement("span");
    u.className = "ln-ajax-spinner", v.appendChild(u);
    function _() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let l = d;
    const i = document.querySelector('meta[name="csrf-token"]'), p = i ? i.getAttribute("content") : null;
    w instanceof FormData && p && w.append("_token", p);
    const y = {
      method: f,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (p && (y.headers["X-CSRF-TOKEN"] = p), f === "GET" && w) {
      const T = new URLSearchParams(w);
      l = d + (d.includes("?") ? "&" : "?") + T.toString();
    } else f !== "GET" && w && (y.body = w);
    fetch(l, y).then(function(T) {
      const g = T.ok, E = T.status;
      return T.text().then(function(C) {
        let k = null, D = null;
        if (C && C.trim())
          try {
            k = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: g, status: E, data: k, parseError: D };
      });
    }).then(function(T) {
      const g = T.status, E = T.data, C = T.parseError;
      if (T.ok && !C) {
        if (E && E.title && (document.title = E.title), E && E.content)
          for (const k in E.content) {
            const D = document.getElementById(k);
            D && (D.innerHTML = E.content[k]);
          }
        if (v.tagName === "A") {
          const k = v.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else v.tagName === "FORM" && v.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", l);
        q(v, "ln-ajax:success", { method: f, url: l, data: E });
      } else
        q(v, "ln-ajax:error", {
          method: f,
          url: l,
          status: g,
          data: E,
          error: C || null
        });
      q(v, "ln-ajax:complete", { method: f, url: l }), _();
    }).catch(function(T) {
      q(v, "ln-ajax:error", { method: f, url: l, status: 0, data: null, error: T }), q(v, "ln-ajax:complete", { method: f, url: l }), _();
    });
  }
  function c(f) {
    const d = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(t) !== "false" ? d.links.push(f) : f.tagName === "FORM" && f.getAttribute(t) !== "false" ? d.forms.push(f) : (d.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), d.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), d;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(d) {
        for (const w of d)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (h(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  h(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = c(v);
                  b(A.links), m(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(d) {
        h(d);
      });
    }, "ln-ajax");
  }
  function r() {
    for (const f of document.querySelectorAll("[" + t + "]"))
      h(f);
  }
  window[e] = h, window[e].destroy = s, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
function xr(t, { isHydration: e = !1, hasPrimaryRegion: o = !1, primaryMatch: h = null } = {}) {
  const b = o ? !h : !t.some((n) => n.match), m = [], s = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const r = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !r && n.targetEl && m.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || s.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  s.sort((n, r) => n.regionKey === "__primary__" ? -1 : r.regionKey === "__primary__" ? 1 : 0);
  const c = s.find((n) => n.regionKey === "__primary__") || s[0] || null;
  return { notFound: b, clears: m, swaps: s, owner: c };
}
const qn = {
  navigate: function(t) {
    zt(t, { historyAction: "push" });
  },
  replace: function(t) {
    zt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: In,
      query: Dn,
      route: Rn,
      regions: xn
    };
  }
}, Ie = "data-ln-route", kn = "lnRoute";
typeof window < "u" && (window.lnRouter = qn);
function he(t) {
  Pn(t), Fn(t), _t.size > 0 && Nn();
}
const Ir = {
  "data-ln-route": { effect: he },
  "data-ln-route-target": { effect: he },
  "data-ln-route-title": { effect: he },
  "data-ln-route-keep": {},
  "data-ln-router-hydrate": {}
}, _t = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new WeakMap();
let xn = /* @__PURE__ */ new Map(), Ue = !1, ee = null, In = {}, Dn = {}, Rn = null, ve = !1;
function ze(t, e, o) {
  ve ? queueMicrotask(function() {
    q(t, e, o);
  }) : q(t, e, o);
}
function ne(t) {
  try {
    const m = new URL(t, window.location.origin);
    t = m.pathname + m.search + m.hash;
  } catch {
  }
  let [e] = t.split("#"), [o, h] = e.split("?");
  const b = {};
  if (h) {
    const m = new URLSearchParams(h);
    for (const [s, a] of m.entries())
      b[s] = a;
  }
  return o = o.replace(/\/+$/, ""), o === "" && (o = "/"), { path: o, query: b };
}
function On(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const o = t.segments, h = e.segments, b = Math.max(o.length, h.length);
  for (let m = 0; m < b; m++) {
    const s = o[m], a = h[m];
    if (s === void 0) return 1;
    if (a === void 0) return -1;
    if (s === "*") return 1;
    if (a === "*") return -1;
    const c = s.startsWith(":"), n = a.startsWith(":");
    if (c && !n) return 1;
    if (!c && n) return -1;
  }
  return 0;
}
function Mn(t, e) {
  const o = t.split("/").filter(Boolean);
  for (const h of e) {
    if (h.pattern === "*")
      return {
        route: h,
        params: { wildcard: t }
      };
    const b = h.segments, m = {};
    let s = !0;
    if (!(o.length > b.length && b[b.length - 1] !== "*")) {
      for (let a = 0; a < b.length; a++) {
        const c = b[a], n = o[a];
        if (c === "*") {
          m.wildcard = o.slice(a).join("/");
          break;
        }
        if (n === void 0) {
          s = !1;
          break;
        }
        if (c.startsWith(":"))
          m[c.slice(1)] = decodeURIComponent(n);
        else if (c !== n) {
          s = !1;
          break;
        }
      }
      if (s && (b.indexOf("*") !== -1 || o.length <= b.length))
        return { route: h, params: m };
    }
  }
  return null;
}
function we(t, e = {}) {
  const o = e.warn !== !1;
  if (t !== "__primary__") {
    const b = document.getElementById(t);
    return !b && o && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), b;
  }
  const h = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !h && o && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), h;
}
function Ke(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), o = [t].concat(e);
  for (const b of o)
    for (const m of Object.keys(b))
      if (m.startsWith("ln") && b[m] && typeof b[m].destroy == "function")
        try {
          b[m].destroy();
        } catch (s) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, b, s);
        }
  const h = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of h) {
    const m = b.lnPopover;
    if (m && m.trigger && t.contains(m.trigger))
      try {
        m.destroy();
      } catch (s) {
        console.error("[ln-router] Error destroying open popover:", s);
      }
  }
}
function zt(t, e = {}) {
  const { path: o, query: h } = ne(t), b = /* @__PURE__ */ new Map();
  for (const [d, w] of _t)
    b.set(d, Mn(o, w.sorted));
  const m = b.get("__primary__") || null, s = we("__primary__", { warn: !!m }), a = _t.has("__primary__"), c = [];
  for (const [d, w] of b) {
    const v = d === "__primary__" ? s : we(d, { warn: !1 }), S = !v && !!(m && m.route && m.route.templateNode && m.route.templateNode.content && m.route.templateNode.content.querySelector("#" + CSS.escape(d)));
    !v && !S && w && console.warn(`[ln-router] Explicit target element #${d} not found in DOM`), c.push({
      regionKey: d,
      match: w,
      targetEl: v,
      isPending: S,
      hasKeep: !!v && v.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!v && v.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!v && v.children.length > 0,
      mountedTemplate: v && fe.get(v) || null
    });
  }
  const n = xr(c, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: a,
    primaryMatch: m
  });
  if (n.notFound) {
    ze(document.body, "ln-router:not-found", { path: o });
    return;
  }
  if (Z(s || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: m ? m.params : {},
    query: h
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const f = function() {
    for (const d of n.clears)
      Ke(d.targetEl), d.targetEl.replaceChildren(), fe.delete(d.targetEl);
    for (const d of n.swaps) {
      if ((d.isPending || !d.targetEl || !document.contains(d.targetEl)) && (d.targetEl = d.regionKey === "__primary__" ? s : document.getElementById(d.regionKey)), !d.targetEl) {
        console.warn(`[ln-router] Target element #${d.regionKey} could not be resolved`);
        continue;
      }
      if (d.skipMount || (Ke(d.targetEl), d.targetEl.replaceChildren(d.match.route.templateNode.content.cloneNode(!0))), fe.set(d.targetEl, d.match.route.templateNode), n.owner && d.regionKey === n.owner.regionKey) {
        if (d.match.route.title) {
          let w = d.match.route.title;
          if (d.match.params)
            for (const [v, S] of Object.entries(d.match.params))
              w = w.replace(new RegExp("\\{\\{\\s*" + v + "\\s*\\}\\}", "g"), S);
          document.title = w;
        }
        if (!e.isHydration) {
          d.targetEl.hasAttribute("tabindex") || d.targetEl.setAttribute("tabindex", "-1");
          const w = d.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          w ? (w.setAttribute("tabindex", "-1"), w.focus()) : d.targetEl.focus(), d.regionKey === "__primary__" && d.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      ze(d.targetEl, "ln-router:navigated", {
        path: t,
        params: d.match.params,
        query: h,
        route: d.match.route,
        target: d.targetEl,
        region: d.regionKey
      });
    }
    ee = t, Dn = h, Rn = m ? m.route : null, In = m ? m.params : {}, xn = new Map(
      Array.from(b.entries()).map(([d, w]) => [d, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(f) : f();
}
function Dr(t) {
  const e = t.target.closest("a");
  if (!e || !gn(t, e)) return;
  const o = e.getAttribute("href"), { path: h } = ne(o);
  for (const b of _t.values())
    if (Mn(h, b.sorted)) {
      t.preventDefault(), zt(o, { historyAction: "push" });
      return;
    }
}
function Rr(t, e) {
  const o = Object.keys(t), h = Object.keys(e);
  if (o.length !== h.length) return !1;
  for (let b = 0; b < o.length; b++) {
    const m = o[b];
    if (t[m] !== e[m]) return !1;
  }
  return !0;
}
function Or() {
  const t = window.location.pathname + window.location.search, e = qn.current();
  if (e && e.path != null) {
    const o = ne(t);
    if (ne(e.path).path === o.path && Rr(e.query, o.query))
      return;
  }
  zt(t, { historyAction: "skip" });
}
function Nn() {
  Ue || (Ue = !0, gt(function() {
    document.addEventListener("click", Dr), window.addEventListener("popstate", Or), ve = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    zt(t, { historyAction: "replace", isHydration: !0 }), ve = !1;
  }, "ln-router"));
}
function Fn(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const o = t.getAttribute("data-ln-route-target") || null;
  if (o === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const h = o || "__primary__";
  _t.has(h) || _t.set(h, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const b = _t.get(h);
  if (b.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${h}"`);
    return;
  }
  const m = t.getAttribute("data-ln-route-title"), s = e.split("/").filter(Boolean), a = {
    pattern: e,
    segments: s,
    target: o,
    title: m,
    templateNode: t
  }, c = we(h);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), b.routes.set(e, a), b.sorted = Array.from(b.routes.values()).sort(On);
}
function Pn(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const h = t.getAttribute("data-ln-route-target") || null || "__primary__", b = _t.get(h);
  b && (b.routes.delete(e), b.sorted = Array.from(b.routes.values()).sort(On), b.routes.size === 0 && _t.delete(h));
}
function Bn(t) {
  return this.dom = t, Fn(t), this;
}
Bn.prototype.destroy = function() {
  Pn(this.dom), delete this.dom[kn];
};
j(Ie, kn, Bn, "ln-router", {
  attributes: Ir,
  onInit: function() {
    _t.size > 0 && Nn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-modal": { effect: b }
  };
  function h(m) {
    this.dom = m, this.isOpen = m.getAttribute(t) === "open";
    const s = this;
    return this._onRequestOpen = function() {
      s.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      s.dom.setAttribute(t, "close");
    }, this._onCancel = function(a) {
      a.preventDefault(), s.dom.setAttribute(t, "close");
    }, this._onClickClose = function(a) {
      const c = a.target.closest("[data-ln-modal-close]");
      c && s.dom.contains(c) && (a.preventDefault(), s.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  h.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, h.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, h.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, m === "open" ? "close" : "open");
  }, h.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const m = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(a) {
            return a !== m;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      q(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function b(m) {
    const s = m[e];
    if (!s) return;
    const c = m.getAttribute(t) === "open";
    if (c !== s.isOpen)
      if (c) {
        if (Z(m, "ln-modal:before-open", { modalId: m.id, target: m }).defaultPrevented) {
          m.setAttribute(t, "close");
          return;
        }
        s.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof m.showModal == "function" && m.showModal();
        const r = m.querySelector("[autofocus]");
        if (r && Ut(r))
          r.focus();
        else {
          const f = m.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), d = Array.prototype.find.call(f, Ut);
          if (d) d.focus();
          else {
            const w = m.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, Ut);
            v && v.focus();
          }
        }
        q(m, "ln-modal:open", { modalId: m.id, target: m });
      } else {
        if (Z(m, "ln-modal:before-close", { modalId: m.id, target: m }).defaultPrevented) {
          m.setAttribute(t, "open");
          return;
        }
        s.isOpen = !1, q(m, "ln-modal:close", { modalId: m.id, target: m }), typeof m.close == "function" && m.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  j(t, e, h, "ln-modal", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", o = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-ui-coordinator": {},
    "data-ln-ui-coordinator-dict": {}
  };
  function b(u) {
    const _ = {};
    let l = u;
    const i = [];
    for (; l; ) {
      const p = l.closest("[" + t + "]");
      if (!p) break;
      p[e] && p[e].dict && i.unshift(p[e].dict), l = p.parentElement;
    }
    for (const p of i)
      Object.assign(_, p);
    return _;
  }
  function m(u, _) {
    if (_) {
      if (u) {
        const i = u.closest("[" + t + "]");
        if (i) {
          if (i.id === _ && i.hasAttribute("data-ln-modal")) return i;
          const p = i.querySelector("#" + CSS.escape(_) + '[data-ln-modal], [data-ln-modal="' + _ + '"]');
          if (p) return p;
        }
      }
      const l = document.getElementById(_) || document.querySelector('[data-ln-modal="' + _ + '"]');
      if (l) return l;
    }
    if (u) {
      const l = u.closest("[" + t + "]");
      if (l) {
        if (l.hasAttribute("data-ln-modal")) return l;
        const p = l.querySelector("[data-ln-modal]");
        if (p) return p;
      }
      const i = u.closest("[data-ln-modal]");
      if (i) return i;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function s(u, _) {
    if (u !== "edit") return "";
    if (_) {
      const l = _.getAttribute("data-ln-fill-id");
      if (l) return l;
    }
    return "edit";
  }
  function a(u) {
    if (!u) return;
    const _ = u.querySelectorAll("[data-ln-field]");
    for (let i = 0; i < _.length; i++)
      _[i].textContent = "";
    const l = u.querySelectorAll("form");
    for (let i = 0; i < l.length; i++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(l[i], null) : l[i].reset();
  }
  document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const _ = u.target.closest("[data-ln-modal-for]");
    if (_) {
      const i = _.getAttribute("data-ln-modal-for"), p = m(_, i);
      if (p && p.lnModal) {
        u.preventDefault();
        const y = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, g = _.dataset;
        for (const k in g) {
          if (!k.startsWith("lnModal") || y[k]) continue;
          const D = k.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = g[k]);
        }
        const E = Object.keys(T).length > 0;
        _.hasAttribute("data-ln-modal-mode") ? p.dataset.lnModalMode = _.getAttribute("data-ln-modal-mode") : p.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(p, T) : p.dataset.lnModalMode === "new" && a(p), p.getAttribute("data-ln-modal") === "open" ? q(p, "ln-modal:request-close", {}) : (p.id && dt(p.id, s(p.dataset.lnModalMode, _)), q(p, "ln-modal:request-open", {}));
      }
      return;
    }
    const l = u.target.closest('a[href^="#"]');
    if (l) {
      const i = se(l.getAttribute("href"));
      for (const p in i) {
        const y = document.getElementById(p);
        if (y && y.lnModal) {
          if (!ke(u)) return;
          dt(p, i[p]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(u) {
    const _ = u.target;
    if (!_ || !_.lnModal) return;
    (_.dataset.lnModalMode || "new") === "new" && a(_);
  }), document.addEventListener("ln-modal:open", function(u) {
    const _ = u.target;
    if (!_ || !_.lnModal || !_.id) return;
    let l = ot(_.id);
    l === null && (l = s(_.dataset.lnModalMode, null), dt(_.id, l)), l ? (_.dataset.lnModalMode = "edit", q(_, "ln-fill:request", { id: l })) : (_.dataset.lnModalMode = "new", a(_));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const u = document.querySelectorAll("[data-ln-modal][id]");
        for (let _ = 0; _ < u.length; _++) {
          const l = u[_];
          if (!l.lnModal) continue;
          const i = l.id, p = ot(i), y = p !== null, T = l.lnModal.isOpen;
          if (y) {
            const g = p ? "edit" : "new";
            l.dataset.lnModalMode = g, T ? p ? q(l, "ln-fill:request", { id: p }) : a(l) : q(l, "ln-modal:request-open", {});
          } else T && q(l, "ln-modal:request-close", {});
        }
      } finally {
        c = !1;
      }
    }
  }
  function r() {
    const u = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let _ = 0; _ < u.length; _++) {
      const l = u[_];
      l.lnModal && ot(l.id) === null && dt(l.id, s(l.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function f() {
    r(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(f);
  }) : mt(f);
  function d(u) {
    const l = (u.detail || {}).data;
    if (l && l.message) {
      const p = l.message;
      q(window, "ln-toast:enqueue", {
        type: p.type || "success",
        title: p.title || "",
        message: p.body || ""
      });
    }
    const i = u.target.closest("[data-ln-modal]");
    i && i.lnModal && (i.id && dt(i.id, null), q(i, "ln-modal:request-close", {}), a(i));
  }
  function w(u) {
    const _ = u.detail || {}, l = _.data, i = _.status || 0, p = b(u.target);
    if (l && l.message) {
      const y = l.message;
      q(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else i === 0 ? q(window, "ln-toast:enqueue", {
      type: "error",
      title: p["network-error-title"] || "",
      message: p["network-error"] || "Network error"
    }) : q(window, "ln-toast:enqueue", {
      type: "error",
      title: p["server-error-title"] || "",
      message: p["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", d), document.addEventListener("ln-ajax:error", w);
  function v(u) {
    const _ = u.detail || {}, l = b(u.target), i = _.message || (_.reason === "max-size" ? l["upload-max-size"] || "File is too large" : _.reason === "max-files" ? l["upload-max-files"] || "Maximum file count exceeded" : l["upload-invalid-type"] || "This file type is not allowed"), p = l["upload-invalid-title"] || "Invalid File";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: p,
      message: i
    });
  }
  function S(u) {
    const _ = u.detail || {}, l = b(u.target), i = _.message || l["upload-failed"] || "Failed to upload file", p = l["upload-error-title"] || "Upload Error";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: p,
      message: i
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(u) {
    const _ = u.target;
    !_ || !_.lnModal || (_.id && ot(_.id) !== null && dt(_.id, null), _.dataset.lnModalMode === "new" && a(_));
  });
  function A(u) {
    return this.dom = u, this.dict = re(u, o), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: h
  });
})();
function Mr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let o = e, h = 0;
  for (let b = 0; b < t.length && o > 0; b++)
    h = b + 1, /[0-9]/.test(t[b]) && o--;
  return o > 0 && (h = t.length), h;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function o(s) {
    const a = s[e];
    a && (a.isTextElement ? a._initTextElement() : isNaN(a.value) || a._displayFormatted(a.value));
  }
  const h = {
    "data-ln-number": { effect: o },
    "data-ln-value": { effect: o },
    "data-ln-number-decimals": { effect: o },
    "data-ln-number-min": { effect: o },
    "data-ln-number-max": { effect: o }
  }, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(s) {
    if (s[e]) return s[e];
    s[e] = this, this.dom = s;
    const a = this;
    if (this._onLocaleChange = function() {
      a.isTextElement ? a._formatTextContent() : isNaN(a.value) || a._displayFormatted(a.value);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), s.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = s.name, s.removeAttribute("name"), s.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", s.getAttribute("data-ln-fill-as")), s.type = "text", s.setAttribute("inputmode", "decimal"), s.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return b.get.call(c);
      },
      set: function(r) {
        if (b.set.call(c, r), r !== "" && !isNaN(parseFloat(r))) {
          const f = a.dom.getAttribute("data-ln-number-decimals");
          a._setDisplayRaw(ct(parseFloat(r), rt(a.dom), { maxDecimals: f }));
        } else
          a._setDisplayRaw("");
        a.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), dn(s, b, {
      get: function() {
        return b.get.call(s);
      },
      set: function(r) {
        if (r === "") {
          a._setDisplayRaw(""), a._setHiddenRaw(""), s.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const f = typeof r == "number" ? r : parseFloat(String(r));
        if (isNaN(f))
          a._setDisplayRaw(String(r)), a._setHiddenRaw("");
        else {
          a._setHiddenRaw(f);
          const d = s.getAttribute("data-ln-number-decimals");
          a._setDisplayRaw(ct(f, rt(s), { maxDecimals: d }));
        }
        s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      a._handleInput();
    }, s.addEventListener("input", this._onInput), this._onKeyDown = function(r) {
      if (r.key !== "Backspace") return;
      const f = s.selectionStart, d = s.selectionEnd;
      if (f !== d || f === 0) return;
      const w = te(rt(s)), v = b.get.call(s), S = v[f - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        r.preventDefault();
        const A = f - 2 >= 0 ? f - 2 : 0, u = v.slice(0, A) + v.slice(f);
        b.set.call(s, u), s.setSelectionRange(A, A), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, s.addEventListener("keydown", this._onKeyDown), this._onPaste = function(r) {
      r.preventDefault();
      const f = (r.clipboardData || window.clipboardData).getData("text"), d = Er(f, rt(s));
      a.value = isNaN(d) ? NaN : d;
    }, s.addEventListener("paste", this._onPaste);
    const n = s.value;
    if (n !== "") {
      const r = parseFloat(n);
      if (!isNaN(r)) {
        const f = s.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(r), this._setDisplayRaw(ct(r, rt(s), { maxDecimals: f })), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  m.prototype._initTextElement = function() {
    const s = this.dom;
    let a = s.getAttribute("data-ln-value"), c = s.getAttribute("data-ln-number"), n = null;
    a !== null && a !== "" ? n = a : c !== null && c !== "" && c !== "true" ? n = c : n = s.textContent.trim();
    const r = parseFloat(n);
    isNaN(r) ? this._rawValue = null : (this._rawValue = r, s.hasAttribute("data-ln-value") || s.setAttribute("data-ln-value", String(r)), this._formatTextContent());
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, rt(this.dom), { maxDecimals: s });
    }
  }, m.prototype._handleInput = function() {
    const s = this.dom, a = b.get.call(s);
    if (a === "") {
      this._setHiddenRaw(""), q(s, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (a === "-") {
      this._setHiddenRaw(""), q(s, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = s.selectionStart;
    let n = 0;
    for (let p = 0; p < c; p++)
      /[0-9]/.test(a[p]) && n++;
    const r = rt(s), f = te(r);
    let d = a, w = Cn(a, f.groupSep, f.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), q(s, "ln-number:input", { value: NaN, formatted: a });
      return;
    }
    const S = s.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const p = parseInt(S, 10), y = w.slice(A + 1);
      if (p === 0)
        w = w.slice(0, A), d = d.split(f.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(d);
      else if (y.length > p) {
        w = w.slice(0, A + 1 + p);
        const T = d.split(f.decimalSep);
        d = T[0] + f.decimalSep + T[1].slice(0, p), v = parseFloat(w), this._setDisplayRaw(d);
      }
    }
    const u = s.getAttribute("data-ln-number-max");
    if (u !== null && v > parseFloat(u)) {
      const p = parseFloat(u), y = ct(p, r, { maxDecimals: S });
      this._setDisplayRaw(y), this._setHiddenRaw(p), s.setSelectionRange(y.length, y.length), q(s, "ln-number:input", { value: p, formatted: y });
      return;
    }
    if (d.endsWith(f.decimalSep) || f.decimalSep !== "." && d.endsWith(".")) {
      this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: d });
      return;
    }
    const _ = w.indexOf(".");
    if (_ !== -1 && w.slice(_ + 1).endsWith("0")) {
      this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: d });
      return;
    }
    let l;
    if (S !== null)
      l = ct(v, r, { maxDecimals: S });
    else {
      const p = _ !== -1 ? w.slice(_ + 1).length : 0;
      l = ct(v, r, { userDecimals: p });
    }
    this._setDisplayRaw(l);
    const i = Mr(l, n);
    s.setSelectionRange(i, i), this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: l });
  }, m.prototype._setHiddenRaw = function(s) {
    this._hidden && b.set.call(this._hidden, String(s));
  }, m.prototype._setDisplayRaw = function(s) {
    this.isTextElement ? this.dom.textContent = String(s) : b.set.call(this.dom, String(s));
  }, m.prototype._displayFormatted = function(s) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const a = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(s, rt(this.dom), { maxDecimals: a }));
    }
  }, Object.defineProperty(m.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const s = b.get.call(this._hidden);
      return s === "" ? NaN : parseFloat(s);
    },
    set: function(s) {
      const a = typeof s == "number" ? s : parseFloat(s);
      if (this.isTextElement) {
        isNaN(a) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = a, this.dom.setAttribute("data-ln-value", String(a)), this._formatTextContent());
        return;
      }
      if (isNaN(a)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(a);
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(a, rt(this.dom), { maxDecimals: c })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), m.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), q(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, m, "ln-number", {
    attributes: h,
    extraAttributes: ["lang"],
    onAttributeChange: o
  });
})();
const Ee = /^(short|medium|long)(\s+datetime)?$/, Nr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Fr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ee) ? Nr[t.trim()] : null;
}
function Wt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let o, h;
  if (e.indexOf(".") !== -1)
    o = ".", h = e.split(".");
  else if (e.indexOf("/") !== -1)
    o = "/", h = e.split("/");
  else if (e.indexOf("-") !== -1)
    o = "-", h = e.split("-");
  else
    return null;
  if (h.length !== 3) return null;
  const b = [];
  for (let n = 0; n < 3; n++) {
    const r = parseInt(h[n], 10);
    if (isNaN(r)) return null;
    b.push(r);
  }
  let m, s, a;
  o === "." ? (m = b[0], s = b[1], a = b[2]) : o === "/" ? (s = b[0], m = b[1], a = b[2]) : h[0].length === 4 ? (a = b[0], s = b[1], m = b[2]) : (m = b[0], s = b[1], a = b[2]), a < 100 && (a += a < 50 ? 2e3 : 1900);
  const c = new Date(a, s - 1, m);
  return c.getFullYear() !== a || c.getMonth() !== s - 1 || c.getDate() !== m ? null : c;
}
function pe(t, e, o, h) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const b = t.getDate(), m = t.getMonth(), s = t.getFullYear(), a = t.getHours(), c = t.getMinutes();
  let n, r;
  const f = (o || "").toLowerCase().split("-")[0];
  let d = !1;
  try {
    const S = new Intl.DateTimeFormat(o, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    d = !!(h && S !== f);
  } catch {
    d = !!h;
  }
  if (d && h && h.monthsLong)
    n = h.monthsLong[m];
  else
    try {
      n = new Intl.DateTimeFormat(o, { month: "long" }).format(t);
    } catch {
      n = String(m + 1);
    }
  if (d && h && h.monthsShort)
    r = h.monthsShort[m];
  else
    try {
      r = new Intl.DateTimeFormat(o, { month: "short" }).format(t);
    } catch {
      r = String(m + 1);
    }
  const w = {
    yyyy: String(s),
    yy: String(s).slice(-2),
    MMMM: n,
    MMM: r,
    MM: String(m + 1).padStart(2, "0"),
    M: String(m + 1),
    dd: String(b).padStart(2, "0"),
    d: String(b),
    HH: String(a).padStart(2, "0"),
    mm: String(c).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, o, h) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const b = Fr(e);
  if (b)
    try {
      const m = new Intl.DateTimeFormat(o, b), s = (o || "").toLowerCase().split("-")[0], a = m.resolvedOptions().locale.toLowerCase().split("-")[0];
      return h && a !== s ? pe(t, "dd.MM.yyyy", o, h) : m.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", o, h);
    }
  return pe(t, e || "dd.MM.yyyy", o, h);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function o(n) {
    const r = n[e];
    if (r) {
      if (r.isTextElement)
        r._initTextElement();
      else if (r.value) {
        const f = st(r.value);
        f && r._displayFormatted(f);
      }
    }
  }
  const h = {
    "data-ln-date": { effect: o },
    "data-ln-date-format": { effect: o },
    "data-ln-date-locale": { effect: o },
    "data-ln-value": { effect: o },
    "data-ln-date-dict": {},
    "data-ln-date-dict-key": {},
    "data-ln-date-field": {},
    "data-ln-date-label": {}
  }, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(n, r, f) {
    q(n.dom, "ln-date:change", {
      value: r,
      formatted: n.dom.value,
      date: f
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function s(n, r, f, d) {
    n._setHiddenRaw(r), b.set.call(n._picker, r), n._lastISO = r, d !== void 0 ? (n._isFormatting = !0, n.dom.value = d, n._isFormatting = !1) : f && n._displayFormatted(f), m(n, r, f);
  }
  function a(n) {
    n._setHiddenRaw(""), b.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", m(n, "", null);
  }
  function c(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const r = this;
    if (this._onLocaleChange = function() {
      if (r.isTextElement)
        r._formatTextContent();
      else if (r.value) {
        const _ = st(r.value);
        _ && r._displayFormatted(_);
      }
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const f = n.value, d = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const _ = w.querySelectorAll("[data-ln-date-dict]");
      for (let l = 0; l < _.length; l++) {
        const i = _[l].getAttribute("data-ln-date-dict");
        if (i) {
          const p = re(_[l], "data-ln-date-dict-key");
          p["months-long"] && (p.monthsLong = p["months-long"].split(",").map((y) => y.trim())), p["months-short"] && (p.monthsShort = p["months-short"].split(",").map((y) => y.trim())), qe(i, p);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const S = document.createElement("input");
    S.type = "hidden", S.name = d, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && S.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", S), this._hidden = S;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", S.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const u = document.createElement("button");
    if (u.type = "button", u.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), u.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", u), this._btn = u, this._lastISO = "", Object.defineProperty(S, "value", {
      get: function() {
        return b.get.call(S);
      },
      set: function(_) {
        if (b.set.call(S, _), _ && _ !== "") {
          const l = st(_);
          l && s(r, _, l);
        } else _ === "" && a(r);
      }
    }), dn(n, b, {
      get: function() {
        return b.get.call(n);
      },
      set: function(_, l) {
        if (r._isFormatting) {
          l(_);
          return;
        }
        if (!_ || _ === "") {
          l(""), a(r);
          return;
        }
        const i = st(_) || Wt(_);
        if (i) {
          const p = Ft(i), y = n.getAttribute(t) || "", T = rt(n), g = kt(T), E = Gt(i, y, T, g);
          l(E), s(r, p, i, E);
        } else
          l(String(_)), a(r);
      }
    }), this._onPickerChange = function() {
      const _ = A.value;
      if (_) {
        const l = st(_);
        l && s(r, _, l);
      } else
        a(r);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const _ = r.dom.value.trim();
      if (_ === "") {
        r._lastISO !== "" && a(r);
        return;
      }
      if (r._lastISO) {
        const i = st(r._lastISO);
        if (i) {
          const p = r.dom.getAttribute(t) || "", y = rt(r.dom), T = kt(y);
          if (_ === Gt(i, p, y, T)) return;
        }
      }
      const l = Wt(_);
      if (l) {
        const i = Ft(l);
        s(r, i, l);
      } else if (r._lastISO) {
        const i = st(r._lastISO);
        i && r._displayFormatted(i);
      } else
        r.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      r._openPicker();
    }, u.addEventListener("click", this._onBtnClick), f && f !== "") {
      const _ = st(f);
      _ && s(r, f, _);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, r = n.getAttribute("data-ln-value"), f = n.getAttribute("data-ln-date"), d = n.getAttribute("datetime");
    let w = null;
    r !== null && r !== "" ? w = r : d !== null && d !== "" ? w = d : f !== null && f !== "" && f !== "true" && !Ee.test(f) ? w = f : w = n.textContent.trim();
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
        let f = this.dom.getAttribute("data-ln-date-format");
        if (!f) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Ee.test(v) && (f = v);
        }
        const d = rt(this.dom), w = kt(d);
        this.dom.textContent = Gt(n, f || "medium", d, w);
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
    b.set.call(this._hidden, n);
  }, c.prototype._displayFormatted = function(n) {
    const r = this.dom.getAttribute(t) || "", f = rt(this.dom), d = kt(f);
    this._isFormatting = !0, this.dom.value = Gt(n, r, f, d), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : b.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const f = st(n) || Wt(n);
        if (!f) return;
        const d = Ft(f);
        this._rawValue = d, this.dom.setAttribute("data-ln-value", d), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        a(this);
        return;
      }
      const r = st(n);
      r && s(this, n, r);
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
      q(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), q(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, c, "ln-date", {
    attributes: h,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: o
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-nav": { effect: s },
    "data-ln-nav-exact": { prop: "exact", read: Kt, effect: s }
  }, h = et(o);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const a = history.pushState;
    history.pushState = function() {
      a.apply(history, arguments);
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
  function b(a) {
    return this.dom = a, tt(this, a, h), this.activeClass = a.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(a, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, r = m(n), f = [];
    for (const d of c) {
      const w = d.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      if (d.hostname && d.hostname !== window.location.hostname) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      const v = m(w), S = v === r, A = !this.exact && v !== "/" && r.startsWith(v + "/");
      S || A ? (d.classList.add(this.activeClass), d.setAttribute("aria-current", "page"), f.push(d)) : (d.classList.remove(this.activeClass), d.removeAttribute("aria-current"));
    }
    q(this.dom, "ln-nav:update", { target: this.dom, activeLinks: f });
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const a = history._lnNavCallbacks.indexOf(this.updateHandler);
    a !== -1 && history._lnNavCallbacks.splice(a, 1), q(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function m(a) {
    try {
      return new URL(a, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return a.replace(/\/$/, "") || "/";
    }
  }
  function s(a, c) {
    const n = a[e];
    if (n) {
      if (c === t) {
        if (!a.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const r = n.activeClass, f = a.getAttribute(t) || "active";
        if (r !== f) {
          const d = a.querySelectorAll("a");
          for (const w of d)
            r && w.classList.remove(r);
          n.activeClass = f;
        }
      }
      n.update();
    }
  }
  j(t, e, b, "ln-nav", {
    attributes: o
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(s, a) {
    const c = s.getAttribute("data-ln-persist"), n = c !== null && c !== "" ? c : s.id;
    return n ? s.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + a : "ln:" + n + ":" + a : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', s), null);
  }
  let o = null;
  function h() {
    if (o !== null) return o;
    try {
      if (typeof localStorage > "u") return o = !1;
      const s = "__ln_persist_test__";
      return localStorage.setItem(s, s), localStorage.removeItem(s), o = !0;
    } catch {
      return o = !1;
    }
  }
  const b = /* @__PURE__ */ new Set();
  function m(s, a) {
    const c = window.lnCore && window.lnCore._attrRegistry, n = c && c.persist || [];
    let r = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === a) {
        r = n[v];
        break;
      }
    if (!r) return;
    const f = r.persist;
    if (b.has(f.attr) || (b.add(f.attr), Vt([f.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || f.hashActive && f.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !h()) return;
      const u = v.getAttribute(S);
      try {
        u === null ? localStorage.removeItem(A) : localStorage.setItem(A, u);
      } catch {
      }
    })), f.hashActive && f.hashActive(s)) return;
    const d = e(s, f.attr);
    if (!d || !h()) return;
    const w = localStorage.getItem(d);
    w !== null && s.setAttribute(f.attr, w);
  }
  ar(m);
})();
function je(t, e, o, h) {
  const b = (t || "").toLowerCase().trim();
  if (b) return b;
  if ((e || "").toUpperCase() !== "A") return "";
  const m = o || "";
  if (!m.startsWith("#")) return "";
  const s = m.slice(1);
  if (!s) return "";
  const a = s.split("&"), c = (h || "").toLowerCase().trim();
  if (c)
    for (const f of a) {
      const d = f.indexOf(":");
      if (d > 0 && f.slice(0, d).toLowerCase().trim() === c)
        return f.slice(d + 1).toLowerCase().trim();
    }
  const n = a[a.length - 1] || "", r = n.indexOf(":");
  return (r > 0 ? n.slice(r + 1) : n).toLowerCase().trim();
}
function Ve(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const o = t.filter(
    (m) => (m.tagName || "").toUpperCase() === "A" && (m.href || "").startsWith("#")
  ), h = o.length > 0 && o.length === t.length, b = (e || "").toLowerCase().trim();
  return o.length > 0 && o.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : h && !b ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: h && !!b,
    warning: null
  };
}
function We(t, e, o) {
  const h = (t || "").toLowerCase().trim();
  return h && Array.isArray(e) && e.includes(h) ? h : (o || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function o(n) {
    const r = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(r);
  }
  function h(n, r) {
    return (n.getAttribute(r) || n.id || "").toLowerCase().trim();
  }
  function b(n, r) {
    return (n.getAttribute(r) || "true").toLowerCase() !== "false";
  }
  const m = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: o },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": { prop: "autoFocus", read: b },
    "data-ln-tabs-key": { prop: "nsKey", read: h },
    "data-ln-tab": {}
  }, s = et(m);
  function a(n) {
    return this.dom = n, tt(this, n, s), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.map((d) => ({
      tagName: d.tagName,
      href: d.getAttribute("href")
    })), r = Ve(n, this.nsKey);
    this.hashEnabled = r.hashEnabled, r.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : r.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const d of this.tabs) {
      const w = je(d.getAttribute("data-ln-tab"), d.tagName, d.getAttribute("href"), this.nsKey);
      w ? this.mapTabs[w] = d : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', d);
    }
    for (const d of this.panels) {
      const w = (d.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      w && (this.mapPanels[w] = d);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const f = this;
    this._clickHandlers = [];
    for (const d of this.tabs) {
      if (d[e + "Trigger"]) continue;
      const w = function(v) {
        const S = d.tagName === "A";
        if (!S && (v.ctrlKey || v.metaKey || v.button === 1)) return;
        const A = je(d.getAttribute("data-ln-tab"), d.tagName, d.getAttribute("href"), f.nsKey);
        A && (S && !ke(v) || (f.hashEnabled ? ot(f.nsKey) === A ? f.dom.setAttribute("data-ln-tabs-active", A) : dt(f.nsKey, A) : f.dom.setAttribute("data-ln-tabs-active", A)));
      };
      d.addEventListener("click", w), d[e + "Trigger"] = w, f._clickHandlers.push({ el: d, handler: w });
    }
    if (this._onRequestSelect = function(d) {
      const w = d.detail && (d.detail.key || d.detail.tab);
      w && f.select(w);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!f.hashEnabled) return;
      const d = ot(f.nsKey);
      f.dom.setAttribute("data-ln-tabs-active", d !== null ? d : f.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const d = We(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", d);
    }
  }
  a.prototype.select = function(n) {
    const r = (n + "").toLowerCase().trim();
    r && (this.hashEnabled ? ot(this.nsKey) === r ? this.dom.setAttribute("data-ln-tabs-active", r) : dt(this.nsKey, r) : this.dom.setAttribute("data-ln-tabs-active", r));
  }, a.prototype._applyActive = function(n) {
    var f;
    if (n = We(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
    const r = this.activeKey;
    if (r !== null && Z(this.dom, "ln-tabs:before-change", {
      key: n,
      previousKey: r,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    }).defaultPrevented) {
      r in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", r), this.hashEnabled && ot(this.nsKey) !== r && dt(this.nsKey, r));
      return;
    }
    this.activeKey = n;
    for (const d in this.mapTabs) {
      const w = this.mapTabs[d];
      d === n ? (w.setAttribute("data-active", ""), w.setAttribute("aria-selected", "true")) : (w.removeAttribute("data-active"), w.setAttribute("aria-selected", "false"));
    }
    for (const d in this.mapPanels) {
      const w = this.mapPanels[d], v = d === n;
      w.classList.toggle("hidden", !v), w.setAttribute("aria-hidden", v ? "false" : "true");
    }
    if (this.autoFocus) {
      const d = (f = this.mapPanels[n]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      d && setTimeout(() => d.focus({ preventScroll: !0 }), 0);
    }
    q(this.dom, "ln-tabs:change", {
      key: n,
      previousKey: r,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    });
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: n, handler: r } of this._clickHandlers)
        n.removeEventListener("click", r), delete n[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), q(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, a, "ln-tabs", {
    attributes: m,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(n) {
        const r = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(d) {
          return { tagName: d.tagName, href: d.getAttribute("href") };
        }), f = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return Ve(r, f).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", o = "data-ln-toggle-for", h = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-toggle": { effect: d },
    "data-ln-toggle-for": {},
    "data-ln-toggle-action": {}
  }, m = /* @__PURE__ */ new Set();
  let s = null;
  function a(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function c() {
    s || (s = function(w) {
      if (sn(w)) return;
      const v = w.target.closest("[" + o + "]");
      if (!v || an(v)) return;
      const S = v.getAttribute(o);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const u = v.getAttribute(h) || "toggle", _ = A.getAttribute(t);
      A.setAttribute(t, a(_, u));
    }, document.addEventListener("click", s));
  }
  function n() {
    m.size > 0 || !s || (document.removeEventListener("click", s), s = null);
  }
  function r(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + o + '="' + w.id + '"]'
    );
    for (let A = 0; A < S.length; A++)
      S[A].setAttribute("aria-expanded", v ? "true" : "false");
  }
  function f(w) {
    this.dom = w;
    const v = this;
    return this._onRequestOpen = function() {
      v.open();
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function() {
      v.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), r(w, this.isOpen), m.add(this), c(), this;
  }
  f.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, f.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, f.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, a(w, "toggle"));
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.delete(this), delete this.dom[e], n(), q(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function d(w) {
    const v = w[e];
    if (!v) return;
    const A = w.getAttribute(t) === "open";
    if (A !== v.isOpen)
      if (A) {
        if (Z(w, "ln-toggle:before-open", { target: w }).defaultPrevented) {
          w.setAttribute(t, "close");
          return;
        }
        v.isOpen = !0, w.classList.add("open"), r(w, !0), q(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), r(w, !1), q(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, f, "ln-toggle", {
    attributes: b,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-accordion": {}
  };
  function h(b) {
    return this.dom = b, this._onToggleOpen = function(m) {
      if (m.detail.target.closest("[data-ln-accordion]") !== b) return;
      const s = b.querySelectorAll("[data-ln-toggle]");
      for (const a of s)
        a !== m.detail.target && a.closest("[data-ln-accordion]") === b && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      q(b, "ln-accordion:change", { target: m.detail.target });
    }, b.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), q(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, h, "ln-accordion", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", o = "bottom-end";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-dropdown": {},
    "data-ln-dropdown-position": { prop: "position", read: Q, fallback: o },
    "data-ln-dropdown-placement": {},
    "data-ln-dropdown-menu": {}
  }, b = et(h);
  function m(s) {
    this.dom = s, tt(this, s, b), this.toggleEl = s.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = s.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const a = this;
    return this._onRequestOpen = function() {
      a.toggleEl && a.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      a.toggleEl && a.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (a.toggleEl) {
        const c = a.toggleEl.getAttribute("data-ln-toggle");
        a.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const n = a.toggleEl && a.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        n && (c.preventDefault(), c.stopPropagation(), a.toggleEl.setAttribute("data-ln-toggle", "close"), a.triggerBtn && a.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        n && (a.triggerBtn && a.triggerBtn.focus(), a.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const r = a._getMenuItems();
      if (r.length === 0) return;
      if (!n && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), a.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const d = a._getMenuItems();
          d.length > 0 && a._focusItem(d, c.key === "ArrowDown" ? 0 : d.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const f = r.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const d = f < r.length - 1 ? f + 1 : 0;
        a._focusItem(r, d);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const d = f > 0 ? f - 1 : r.length - 1;
        a._focusItem(r, d);
      } else c.key === "Home" ? (c.preventDefault(), a._focusItem(r, 0)) : c.key === "End" && (c.preventDefault(), a._focusItem(r, r.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== a.toggleEl || (a.triggerBtn && a.triggerBtn.setAttribute("aria-expanded", "true"), typeof a.toggleEl.showPopover == "function" && a.toggleEl.showPopover(), a._initMenuAria(), a._reposition(), a._addOutsideClickListener(), a._addScrollRepositionListener(), a._addResizeCloseListener(), q(s, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== a.toggleEl || (a.triggerBtn && a.triggerBtn.setAttribute("aria-expanded", "false"), a._removeOutsideClickListener(), a._removeScrollRepositionListener(), a._removeResizeCloseListener(), a.toggleEl.style.top = "", a.toggleEl.style.left = "", a.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof a.toggleEl.hidePopover == "function" && a.toggleEl.matches(":popover-open") && a.toggleEl.hidePopover(), q(s, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const s = this.toggleEl.querySelectorAll("li");
    for (const c of s)
      c.setAttribute("role", "none");
    const a = this._getMenuItems();
    for (let c = 0; c < a.length; c++)
      a[c].setAttribute("role", "menuitem"), a[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(s, a) {
    for (let c = 0; c < s.length; c++)
      s[c].setAttribute("tabindex", c === a ? "0" : "-1");
    s[a] && s[a].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const s = this.triggerBtn.getBoundingClientRect(), a = be(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || o, r = Zt(s, a, n, c);
    this.toggleEl.style.top = r.top + "px", this.toggleEl.style.left = r.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", r.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const s = this;
    this._boundDocClick = function(a) {
      s.dom.contains(a.target) || s.toggleEl && s.toggleEl.contains(a.target) || s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0);
  }, m.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, m.prototype._addScrollRepositionListener = function() {
    const s = this;
    this._boundScrollReposition = function() {
      s._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, m.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, m.prototype._addResizeCloseListener = function() {
    const s = this;
    this._boundResizeClose = function() {
      s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, m.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), q(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, m, "ln-dropdown", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", o = "data-ln-popover-for", h = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-popover": { effect: f },
    "data-ln-popover-for": {},
    "data-ln-popover-position": {},
    "data-ln-popover-placement": {}
  }, m = [];
  let s = null;
  function a() {
    s || (s = function(d) {
      if (d.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", s));
  }
  function c() {
    m.length > 0 || s && (document.removeEventListener("keydown", s), s = null);
  }
  function n(d) {
    this.dom = d, this.isOpen = d.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.open(S);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.toggle(S);
    }, d.addEventListener("ln-popover:request-open", this._onRequestOpen), d.addEventListener("ln-popover:request-close", this._onRequestClose), d.addEventListener("ln-popover:request-toggle", this._onRequestToggle), d.hasAttribute("tabindex") || d.setAttribute("tabindex", "-1"), d.hasAttribute("role") || d.setAttribute("role", "dialog"), d.hasAttribute("popover") || d.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(d) {
    this.isOpen || (this.trigger = d || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(d) {
    this.isOpen ? this.close() : this.open(d);
  }, n.prototype._applyOpen = function(d) {
    this.isOpen = !0, d && (this.trigger = d), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const w = be(this.dom);
    if (this.trigger) {
      const u = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(h) || "bottom", l = Zt(u, w, _, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, Ut);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(u) {
      A.dom.contains(u.target) || A.trigger && A.trigger.contains(u.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const u = A.trigger.getBoundingClientRect(), _ = be(A.dom), l = A.dom.getAttribute(h) || "bottom", i = Zt(u, _, l, 8);
      A.dom.style.top = i.top + "px", A.dom.style.left = i.left + "px", A.dom.setAttribute("data-ln-popover-placement", i.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), a(), q(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const d = m.indexOf(this);
    d !== -1 && m.splice(d, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, q(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], q(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function r(d) {
    this.dom = d;
    const w = d.getAttribute(o);
    return d.setAttribute("aria-haspopup", "dialog"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", w), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const S = document.getElementById(w);
      if (!S) return;
      S[e] && (S[e].trigger = d);
      const A = S.getAttribute(t);
      S.setAttribute(t, A === "open" ? "closed" : "open");
    }, d.addEventListener("click", this._onClick), this;
  }
  r.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function f(d) {
    const w = d[e];
    if (!w) return;
    const S = d.getAttribute(t) === "open";
    if (S !== w.isOpen)
      if (S) {
        if (Z(d, "ln-popover:before-open", {
          popoverId: d.id,
          target: d,
          trigger: w.trigger
        }).defaultPrevented) {
          d.setAttribute(t, "closed");
          return;
        }
        w._applyOpen(w.trigger);
      } else {
        if (Z(d, "ln-popover:before-close", {
          popoverId: d.id,
          target: d,
          trigger: w.trigger
        }).defaultPrevented) {
          d.setAttribute(t, "open");
          return;
        }
        w._applyClose();
      }
  }
  j(t, e, n, "ln-popover", {
    attributes: b
  }), j(o, e + "Trigger", r);
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", o = "data-ln-tooltip-position", h = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[h] !== void 0) return;
  const m = {
    "data-ln-tooltip-enhance": {},
    "data-ln-tooltip-enhanced": {},
    "data-ln-tooltip": {},
    "data-ln-tooltip-position": {},
    "data-ln-tooltip-placement": {}
  };
  let s = 0, a = null, c = null, n = null, r = null, f = null, d = null;
  function w() {
    return a && a.parentNode || (a = document.getElementById(b), a || (a = document.createElement("div"), a.id = b, document.body.appendChild(a)), a.hasAttribute("popover") || a.setAttribute("popover", "manual")), a;
  }
  function v() {
    d || (d = function(l) {
      l.key === "Escape" && u();
    }, document.addEventListener("keydown", d));
  }
  function S() {
    d && (document.removeEventListener("keydown", d), d = null);
  }
  function A(l) {
    if (n === l) return;
    u();
    const i = l.getAttribute(e) || l.getAttribute("title");
    if (!i) return;
    w(), typeof a.showPopover == "function" && a.showPopover(), l.hasAttribute("title") && (r = l.getAttribute("title"), l.removeAttribute("title"));
    const p = l.getAttribute("aria-describedby");
    p ? f = p : f = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = i, l[h + "Uid"] || (s += 1, l[h + "Uid"] = "ln-tooltip-" + s), y.id = l[h + "Uid"], a.appendChild(y);
    const T = y.offsetWidth, g = y.offsetHeight, E = l.getBoundingClientRect(), C = l.getAttribute(o) || "top", k = Zt(E, { width: T, height: g }, C, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), f ? l.setAttribute("aria-describedby", f + " " + y.id) : l.setAttribute("aria-describedby", y.id), c = y, n = l, v();
  }
  function u() {
    if (!c) {
      S();
      return;
    }
    n && (f !== null ? n.setAttribute("aria-describedby", f) : n.removeAttribute("aria-describedby"), f = null, r !== null && n.setAttribute("title", r)), r = null, c.parentNode && c.parentNode.removeChild(c), c = null, n = null, a && typeof a.hidePopover == "function" && a.matches(":popover-open") && a.hidePopover(), S();
  }
  function _(l) {
    return this.dom = l, l.hasAttribute("data-ln-tooltip-enhanced") || (l.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(l);
    }, this._onLeave = function() {
      n === l && !l.contains(document.activeElement) && u();
    }, this._onFocus = function() {
      A(l);
    }, this._onBlur = function() {
      n === l && !l.matches(":hover") && u();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  _.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), n === l && u(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[h], delete l[h + "Uid"], q(l, "ln-tooltip:destroyed", { trigger: l });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    h,
    _,
    "ln-tooltip",
    {
      attributes: m
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", o = "ln-toast-item";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-toast": {},
    "data-ln-toast-timeout": { prop: "timeoutDefault", read: Dt, fallback: 6e3 },
    "data-ln-toast-max": { prop: "max", read: Dt, fallback: 5 },
    "data-ln-toast-close": {},
    "data-ln-toast-item": {}
  }, b = et(h);
  function m(A) {
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
  function s(A) {
    if (!A || !(A instanceof HTMLElement)) return;
    if (A.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof A.hidePopover == "function" && A.matches(":popover-open"))
      try {
        A.hidePopover();
      } catch {
      }
  }
  function a(A) {
    this.dom = A, tt(this, A, b);
    const u = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; u.length > this.max; ) A.removeChild(u.shift());
    for (const _ of u) w(_, this);
    return u.length > 0 && m(A), this;
  }
  a.prototype.enqueue = function(A) {
    if (!A) return;
    const u = c(A, this.dom);
    if (!u) return;
    const _ = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    r(this, u), _ > 0 && (u._timer = setTimeout(() => f(u), _));
  }, a.prototype.clear = function() {
    for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      f(A);
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        f(A);
      s(this.dom), q(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function c(A, u) {
    const _ = ((A.type || "") + "").trim().toLowerCase(), l = Tt(u, o, "ln-toast");
    if (!l)
      return console.warn('[ln-toast] Template "' + o + '" not found'), null;
    pt(l, {
      type: _,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const i = l.firstElementChild;
    if (!i) return null;
    i.hasAttribute("data-ln-toast-item") || i.setAttribute("data-ln-toast-item", ""), i.classList.add("ln-enter");
    const p = i.querySelector(".body");
    p && n(p, A);
    const y = i.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      f(i);
    }), i;
  }
  function n(A, u) {
    if (Array.isArray(u.message)) {
      const _ = document.createElement("ul");
      for (const l of u.message) {
        const i = document.createElement("li");
        i.textContent = l, _.appendChild(i);
      }
      A.appendChild(_);
    }
    if (u.data && u.data.errors) {
      const _ = document.createElement("ul");
      for (const l of Object.values(u.data.errors).flat()) {
        const i = document.createElement("li");
        i.textContent = l, _.appendChild(i);
      }
      A.appendChild(_);
    }
  }
  function r(A, u) {
    const _ = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length >= A.max && _.length > 0; ) A.dom.removeChild(_.shift());
    A.dom.appendChild(u), m(A.dom), requestAnimationFrame(() => u.classList.remove("ln-enter"));
  }
  function f(A) {
    if (!A || !A.parentNode) return;
    const u = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), s(u));
    }, 200);
  }
  function d(A) {
    let u = A && A.container;
    return typeof u == "string" && (u = document.querySelector(u)), u instanceof HTMLElement || (u = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), u || null;
  }
  function w(A, u) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const _ = A.querySelector("[data-ln-toast-close]");
    _ && _.addEventListener("click", function() {
      f(A);
    });
    const l = +(A.getAttribute("data-ln-toast-timeout") ?? u.timeoutDefault);
    l > 0 && (A._timer = setTimeout(function() {
      f(A);
    }, l));
  }
  function v(A) {
    const u = A.detail || {}, _ = d(u);
    if (!_) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (_[e] || (_[e] = new a(_))).enqueue(u);
  }
  function S(A) {
    const u = A && A.detail || {};
    if (u.container) {
      const _ = d(u);
      _ && (_[e] || (_[e] = new a(_))).clear();
    } else {
      const _ = document.querySelectorAll("[" + t + "]");
      for (const l of Array.from(_))
        (l[e] || (l[e] = new a(l))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const u of Array.from(A))
        u.querySelectorAll("[data-ln-toast-item]").length > 0 && m(u);
    });
  }, "ln-toast"), j(t, e, a, "ln-toast", {
    attributes: h
  });
})();
function Pr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((o) => o.trim().toLowerCase()).filter(Boolean).map((o) => o.startsWith(".") ? o.slice(1) : o);
  return e.length ? e : null;
}
function Hn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Br(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const o = Hn(t.name), h = String(t.type || "").toLowerCase();
  return e.some((b) => {
    if (b.includes("/")) {
      if (b.endsWith("/*")) {
        const m = b.slice(0, -1);
        return h.startsWith(m);
      }
      return h === b;
    }
    return o === b;
  });
}
function Hr(t, e = "en", o = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (o["unit-b"] || "B");
  const h = 1024, b = [
    o["unit-b"] || "B",
    o["unit-kb"] || "KB",
    o["unit-mb"] || "MB",
    o["unit-gb"] || "GB"
  ], m = Math.floor(Math.log(t) / Math.log(h)), s = Math.min(m, b.length - 1), a = t / Math.pow(h, s);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(a) + " " + b[s];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", o = "file", h = "file_ids[]";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-upload": { prop: "uploadUrl", read: Q, fallback: "" },
    "data-ln-upload-accept": {},
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: Q, fallback: "" },
    "data-ln-upload-max-size": { prop: "maxSize", read: Dt, fallback: 0 },
    "data-ln-upload-max-files": { prop: "maxFiles", read: Dt, fallback: 0 },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: Q, fallback: o },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: Q, fallback: h },
    "data-ln-upload-dict": {},
    "data-ln-upload-zone": {},
    "data-ln-upload-list": {},
    "data-ln-upload-item": {},
    "data-ln-upload-action": {},
    "data-ln-upload-state": {},
    "data-ln-upload-id": {},
    "data-ln-upload-local-id": {},
    "data-ln-upload-size": {},
    "data-ln-upload-ext": {}
  }, m = et(b);
  function s(n, r, f) {
    return Hr(n, r, f);
  }
  function a() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function c(n) {
    this.dom = n, tt(this, n, m), this.dict = re(n, "data-ln-upload-dict"), this.locale = rt(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const r = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Pr(r), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  c.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const r = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let d = 0; d < r.length; d++) {
      const w = r[d], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), u = w.querySelector('[data-ln-field="sizeText"]'), _ = w.getAttribute("data-ln-upload-size"), l = _ ? parseInt(_, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: l !== null && !isNaN(l) ? l : u ? u.textContent.trim() : ""
      });
    }
    const f = this.dom.querySelectorAll('input[type="hidden"]');
    for (let d = 0; d < f.length; d++) {
      const w = f[d];
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
    const n = this, r = this.dom.querySelectorAll('input[type="hidden"]');
    for (let f = 0; f < r.length; f++)
      r[f].name === n.idsFieldName && r[f].remove();
    for (const [, f] of this.uploadedFiles)
      if (f.serverId) {
        const d = document.createElement("input");
        d.type = "hidden", d.name = n.idsFieldName, d.value = f.serverId, n.dom.appendChild(d);
      }
  }, c.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(r) {
      n.zone === n.dom && r.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && r.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(r) {
      r.preventDefault(), r.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(r) {
      r.preventDefault(), r.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(r) {
      r.preventDefault(), r.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(r) {
      r.preventDefault(), r.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), r.dataTransfer && r.dataTransfer.files && n.upload(r.dataTransfer.files);
    }, this._onListClick = function(r) {
      const f = r.target.closest('[data-ln-upload-action="remove"]');
      if (!f || !n.list || !n.list.contains(f) || f.disabled) return;
      const d = f.closest("[data-ln-upload-item]");
      if (d) {
        const w = d.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(r) {
      r.detail && r.detail.files && n.upload(r.detail.files);
    }, this._onRequestRemove = function(r) {
      if (r.detail) {
        const f = r.detail.localId !== void 0 ? r.detail.localId : r.detail.serverId;
        f !== void 0 && n.remove(f);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, c.prototype.upload = function(n) {
    const r = this, f = Array.from(n);
    for (let d = 0; d < f.length; d++) {
      const w = f[d];
      if (r.maxFiles > 0 && r.uploadedFiles.size >= r.maxFiles) {
        q(r.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!Br(w, r.allowedExts)) {
        q(r.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (r.maxSize > 0 && w.size > r.maxSize) {
        q(r.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(r.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || r._uploadSingleFile(w);
    }
  }, c.prototype._uploadSingleFile = function(n) {
    const r = this, f = "file-" + ++r.fileIdCounter, d = Hn(n.name);
    let w = null;
    if (this.list) {
      const _ = Tt(this.dom, "ln-upload-item", "ln-upload");
      if (_ && (w = _.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", f), w.setAttribute("data-ln-upload-ext", d), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: r.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const l = w.querySelector('[data-ln-upload-action="remove"]');
        l && (l.disabled = !0);
        const i = w.querySelector("[data-ln-progress]");
        i && i.setAttribute("data-ln-progress", "0"), r.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(r.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let _ = 0; _ < S.length; _++) {
      const l = S[_];
      !l.name || l.name === r.idsFieldName || l.type === "file" || (l.type === "checkbox" || l.type === "radio") && !l.checked || v.append(l.name, l.value);
    }
    const A = new XMLHttpRequest();
    r.uploadedFiles.set(f, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(_) {
      if (_.lengthComputable) {
        const l = Math.round(_.loaded / _.total * 100);
        if (w) {
          const i = w.querySelector("[data-ln-progress]");
          i && i.setAttribute("data-ln-progress", String(l)), pt(w, { sizeText: l + "%" });
        }
        q(r.dom, "ln-upload:progress", {
          localId: f,
          file: n,
          percent: l,
          loaded: _.loaded,
          total: _.total
        });
      }
    }), A.addEventListener("load", function() {
      const _ = r.uploadedFiles.get(f);
      if (_ && delete _.xhr, A.status >= 200 && A.status < 300) {
        let l;
        try {
          l = JSON.parse(A.responseText);
        } catch (p) {
          u(r.dict.error || "Error", A.status, p);
          return;
        }
        const i = l.id || l.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), i && w.setAttribute("data-ln-upload-id", String(i)), pt(w, {
            sizeText: s(l.size || n.size, r.locale, r.dict),
            uploading: !1
          });
          const p = w.querySelector('[data-ln-upload-action="remove"]');
          p && (p.disabled = !1);
        }
        _ && (_.serverId = i, _.size = l.size || n.size, _.name = l.name || n.name), r._syncHiddenInputs(), q(r.dom, "ln-upload:uploaded", {
          localId: f,
          serverId: i,
          name: l.name || n.name,
          size: l.size || n.size,
          response: l
        });
      } else {
        let l = "";
        try {
          l = JSON.parse(A.responseText).message || "";
        } catch {
        }
        u(l, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const _ = r.uploadedFiles.get(f);
      _ && delete _.xhr, u("", 0, null);
    });
    function u(_, l, i) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: r.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const p = w.querySelector('[data-ln-upload-action="remove"]');
        p && (p.disabled = !1);
      }
      q(r.dom, "ln-upload:error", {
        file: n,
        message: _,
        status: l,
        error: i
      });
    }
    r.uploadUrl ? (A.open("POST", r.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", a()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const r = this;
    let f = null, d = null;
    if (r.uploadedFiles.has(n))
      f = n, d = r.uploadedFiles.get(n);
    else
      for (const [A, u] of r.uploadedFiles)
        if (String(u.serverId) === String(n)) {
          f = A, d = u;
          break;
        }
    if (!f || !d || Z(r.dom, "ln-upload:before-remove", {
      localId: f,
      serverId: d.serverId
    }).defaultPrevented) return;
    const v = r.list ? r.list.querySelector('[data-ln-upload-local-id="' + f + '"]') : null;
    if (d.xhr && typeof d.xhr.abort == "function" && d.xhr.abort(), !d.serverId) {
      v && v.remove(), r.uploadedFiles.delete(f), r._syncHiddenInputs(), q(r.dom, "ln-upload:removed", { localId: f, serverId: null });
      return;
    }
    let S = null;
    if (r.deleteUrlPattern ? S = r.deleteUrlPattern.replace("{id}", encodeURIComponent(d.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (S = r.uploadUrl.replace("{id}", encodeURIComponent(d.serverId))), !S) {
      v && v.remove(), r.uploadedFiles.delete(f), r._syncHiddenInputs(), q(r.dom, "ln-upload:removed", { localId: f, serverId: d.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), pt(v, { deleting: !0 })), fetch(S, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": a(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(A) {
      A.ok ? (v && v.remove(), r.uploadedFiles.delete(f), r._syncHiddenInputs(), q(r.dom, "ln-upload:removed", {
        localId: f,
        serverId: d.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(r.dom, "ln-upload:error", {
        file: d,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(r.dom, "ln-upload:error", {
        file: d,
        message: "",
        status: 0,
        error: A
      });
    });
  }, c.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, f] of this.uploadedFiles)
        if (f.xhr && typeof f.xhr.abort == "function" && f.xhr.abort(), f.serverId) {
          let d = null;
          n.deleteUrlPattern ? d = n.deleteUrlPattern.replace("{id}", encodeURIComponent(f.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (d = n.uploadUrl.replace("{id}", encodeURIComponent(f.serverId))), d && fetch(d, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": a(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), q(n.dom, "ln-upload:cleared", {});
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
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, q(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, c, "ln-upload", {
    attributes: b
  });
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function o(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !e(a)) return;
    a.target = "_blank";
    const c = (a.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), a.rel = c.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", a.appendChild(n), a.setAttribute("data-ln-external-link", "processed"), q(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function h(a) {
    a = a || document.body;
    for (const c of a.querySelectorAll("a, area"))
      o(c);
  }
  function b() {
    gt(function() {
      document.body.addEventListener("click", function(a) {
        const c = a.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && q(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    gt(function() {
      new MutationObserver(function(c) {
        for (const n of c)
          if (n.type === "childList") {
            for (const r of n.addedNodes)
              if (r.nodeType === 1 && (r.matches && (r.matches("a") || r.matches("area")) && o(r), r.querySelectorAll))
                for (const f of r.querySelectorAll("a, area"))
                  o(f);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && o(c);
      });
    }, "ln-external-links");
  }
  function s() {
    b(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      h();
    }) : h();
  }
  window[t] = {
    process: h
  }, s();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let o = null;
  function h() {
    o = document.createElement("div"), o.className = "ln-link-status", document.body.appendChild(o);
  }
  function b(u) {
    o && (o.textContent = u, o.classList.add("ln-link-status--visible"));
  }
  function m() {
    o && o.classList.remove("ln-link-status--visible");
  }
  function s(u, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const l = u.querySelector("a");
    if (!l) return;
    const i = l.getAttribute("href");
    if (!i) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(i, "_blank", "noopener,noreferrer");
      return;
    }
    Z(u, "ln-link:navigate", { target: u, href: i, link: l }).defaultPrevented || l.click();
  }
  function a(u) {
    const _ = u.querySelector("a");
    if (!_) return;
    const l = _.getAttribute("href");
    l && b(l);
  }
  function c() {
    m();
  }
  function n(u) {
    u[e + "Row"] || !u.querySelector("a") || (u[e + "Row"] = !0, u._lnLinkClick = function(l) {
      s(u, l);
    }, u._lnLinkEnter = function() {
      a(u);
    }, u.addEventListener("click", u._lnLinkClick), u.addEventListener("mouseenter", u._lnLinkEnter), u.addEventListener("mouseleave", c));
  }
  function r(u) {
    u[e + "Row"] && (u._lnLinkClick && u.removeEventListener("click", u._lnLinkClick), u._lnLinkEnter && u.removeEventListener("mouseenter", u._lnLinkEnter), u.removeEventListener("mouseleave", c), delete u._lnLinkClick, delete u._lnLinkEnter, delete u[e + "Row"]);
  }
  function f(u) {
    if (!u[e + "Init"]) return;
    const _ = u.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const l = _ === "TABLE" && u.querySelector("tbody") || u;
      for (const i of l.querySelectorAll("tr"))
        r(i);
    } else
      r(u);
    delete u[e + "Init"];
  }
  function d(u) {
    if (u[e + "Init"]) return;
    u[e + "Init"] = !0;
    const _ = u.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const l = _ === "TABLE" && u.querySelector("tbody") || u;
      for (const i of l.querySelectorAll("tr"))
        n(i);
    } else
      n(u);
  }
  function w(u) {
    u.hasAttribute && u.hasAttribute(t) && d(u);
    const _ = u.querySelectorAll ? u.querySelectorAll("[" + t + "]") : [];
    for (const l of _)
      d(l);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(_) {
        for (const l of _)
          if (l.type === "childList") {
            for (const i of l.addedNodes)
              if (i.nodeType === 1) {
                w(i);
                const p = i.closest("[" + t + "]");
                if (p)
                  if (i.tagName === "TR")
                    n(i);
                  else {
                    const y = p.tagName;
                    if (y === "TABLE" || y === "TBODY") {
                      const T = i.querySelectorAll ? i.querySelectorAll("tr") : [];
                      for (const g of T)
                        n(g);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(_) {
        _.hasAttribute && _.hasAttribute(t) ? w(_) : f(_);
      });
    }, "ln-link");
  }
  function S(u) {
    w(u);
  }
  window[e] = { init: S, destroy: f };
  function A() {
    h(), v(), S(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
})();
const Ht = ["Ctrl", "Alt", "Shift", "Meta"], Ur = {
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
function Un(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const o = Ur[e.toLowerCase()];
  return o || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function zn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const o = e.split("+"), h = /* @__PURE__ */ new Set();
  let b = "";
  for (let s = 0; s < o.length; s++) {
    const a = Un(o[s]);
    if (!a) return "";
    if (Ht.indexOf(a) !== -1) {
      h.add(a);
      continue;
    }
    if (b) return "";
    b = a;
  }
  if (!b) return "";
  const m = [];
  for (let s = 0; s < Ht.length; s++)
    h.has(Ht[s]) && m.push(Ht[s]);
  return m.push(b), m.join("+");
}
function zr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const o = e.split(/[\s,]+/), h = [];
  for (let b = 0; b < o.length; b++) {
    const m = zn(o[b]);
    m && h.indexOf(m) === -1 && h.push(m);
  }
  return h;
}
function Kr(t, e) {
  const o = String(e || "").trim();
  if (!o || /[\s,]/.test(o)) return "";
  const h = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(h) ? "" : zn(h ? h + "+" + o : o);
}
function jr(t) {
  if (!t) return "";
  const e = Un(t.key);
  if (!e || Ht.indexOf(e) !== -1) return "";
  const o = [];
  return t.ctrlKey && o.push("Ctrl"), t.altKey && o.push("Alt"), t.shiftKey && o.push("Shift"), t.metaKey && o.push("Meta"), o.push(e), o.join("+");
}
function Vr(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const o = t.getAttribute("contenteditable");
    if (o === "" || String(o).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Wr(t, e, o, h) {
  if (!t || !e || o !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const b = String(e.tagName || "").toLowerCase();
  return b === "button" ? h === "Enter" || h === "Space" : b === "a" && e.hasAttribute && e.hasAttribute("href") && h === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", o = "data-ln-key-target", h = "data-ln-key-allow-input", b = "data-ln-key-modifier", m = "data-ln-key-for", s = "lnKeyFor";
  if (window[e] !== void 0) return;
  function a(_) {
    const l = _[e];
    if (l) {
      if (!_.hasAttribute(t)) {
        l.destroy();
        return;
      }
      l.sync();
    }
  }
  function c(_) {
    const l = _[s];
    l && !_.hasAttribute(m) && l.destroy();
  }
  const n = {
    "data-ln-key": { effect: a },
    "data-ln-key-target": { effect: a },
    "data-ln-key-allow-input": { effect: a }
  }, r = {
    "data-ln-key-for": { effect: c },
    "data-ln-key-modifier": {}
  }, f = /* @__PURE__ */ new Set();
  let d = null;
  function w() {
    d || (d = function(_) {
      if (_.defaultPrevented || _.isComposing || _.repeat) return;
      const l = jr(_);
      if (!l) return;
      const i = dr(_.target), p = document.querySelectorAll("[" + t + "], [" + m + "]");
      let y = null, T = !1, g = !1;
      for (let k = 0; k < p.length; k++) {
        const D = p[k], I = D[e] || D[s];
        if (!I || !I.matches(l) || i && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = Vr(R);
        if (!(!O || !ur(R, O))) {
          if (Wr(_, R, O, l)) {
            g = !0;
            continue;
          }
          y ? T = !0 : y = { host: D, target: R, action: O };
        }
      }
      if (g || !y) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + l + '"; first DOM match wins.');
      const E = {
        source: y.host,
        target: y.target,
        action: y.action,
        key: l,
        event: _
      };
      Z(y.host, "ln-key:before-trigger", E).defaultPrevented || (_.preventDefault(), y.target[y.action](), q(y.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", d));
  }
  function v() {
    f.size > 0 || !d || (document.removeEventListener("keydown", d), d = null);
  }
  function S(_) {
    return this.dom = _, this.shortcuts = [], f.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = zr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(_) {
    return this.shortcuts.indexOf(_) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(h);
  }, S.prototype.resolveTarget = function() {
    const _ = this.dom.getAttribute(o);
    return _ ? u(_, o) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (f.delete(this), delete this.dom[e], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(_) {
    return this.dom = _, f.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + b + "]");
  }, A.prototype.shortcut = function() {
    const _ = this._modifierContext(), l = _ ? _.getAttribute(b) : "";
    return Kr(l, this.dom.textContent);
  }, A.prototype.matches = function(_) {
    return this.shortcut() === _;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(h)) return !0;
    const _ = this._modifierContext();
    return !!(_ && _.hasAttribute(h));
  }, A.prototype.resolveTarget = function() {
    return u(this.dom.getAttribute(m), m);
  }, A.prototype.destroy = function() {
    this.dom[s] && (f.delete(this), delete this.dom[s], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function u(_, l) {
    if (!_) return null;
    try {
      const i = document.querySelector(_);
      return i || console.warn("[ln-key] Target not found for " + l + ' selector "' + _ + '".'), i;
    } catch {
      return console.warn("[ln-key] Invalid " + l + ' selector "' + _ + '".'), null;
    }
  }
  j(t, e, S, "ln-key", {
    attributes: n
  }), j(m, s, A, "ln-key-for", {
    attributes: r
  });
})();
function Gr(t, e, o = 100) {
  if (e != null && e !== "") {
    const h = parseFloat(String(e));
    if (!isNaN(h) && h > 0) return h;
  }
  if (t != null && t !== "") {
    const h = parseFloat(String(t));
    if (!isNaN(h) && h > 0) return h;
  }
  return o;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function o(a) {
    const c = a[e];
    c && s.call(c);
  }
  const h = {
    "data-ln-progress": { effect: o },
    "data-ln-progress-max": { effect: o }
  };
  function b(a) {
    return this.dom = a, this._parentObserver = null, s.call(this), m.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function m() {
    const a = this, c = this.dom.parentElement;
    if (!c) return;
    const n = new MutationObserver(function(r) {
      for (const f of r)
        f.attributeName === "data-ln-progress-max" && s.call(a);
    });
    n.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function s() {
    const a = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, r = this.dom.getAttribute("data-ln-progress-max"), f = Gr(r, n, 100), d = Sn(a, f);
    this.dom.style.width = d.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(d.min)), this.dom.setAttribute("aria-valuemax", String(d.max)), this.dom.setAttribute("aria-valuenow", String(d.clampedValue)), q(this.dom, "ln-progress:change", {
      target: this.dom,
      value: d.value,
      max: d.max,
      percentage: d.percentage
    });
  }
  j(
    t,
    e,
    b,
    "ln-progress",
    {
      attributes: h
    }
  );
})();
function Qr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let o = 0; o < t.length; o++)
    if (t[o] !== e[o]) return !0;
  return !1;
}
function $r(t, e, o) {
  if (!e || typeof e != "object") return !0;
  const h = Object.keys(e);
  if (h.length === 0) return !0;
  for (let b = 0; b < h.length; b++) {
    const m = e[h[b]];
    let s = "";
    if (m.col !== null && m.col !== void 0 ? s = t[m.col] || "" : m.attr && o && typeof o.getAttribute == "function" && (s = o.getAttribute(m.attr) || ""), !xe(s, m.values))
      return !1;
  }
  return !0;
}
function Ge(t, e, o, h) {
  if (h != null && !isNaN(h))
    return parseInt(h, 10);
  if (e && typeof e.getAttribute == "function") {
    const b = e.getAttribute("data-ln-filter-col");
    if (b !== null && !isNaN(parseInt(b, 10)))
      return parseInt(b, 10);
    if (typeof e.closest == "function") {
      const m = e.closest("th");
      if (m && typeof m.cellIndex == "number")
        return m.cellIndex;
      const s = e.closest("[data-ln-popover], [id]");
      if (s && s.id) {
        const a = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (a && typeof a.querySelector == "function") {
          const c = a.querySelector('[data-ln-popover-for="' + s.id + '"]');
          if (c && typeof c.closest == "function") {
            const n = c.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && o && typeof t.querySelectorAll == "function") {
    const b = t.querySelectorAll("thead th, tr:first-child th"), m = String(o).trim().toLowerCase();
    for (let s = 0; s < b.length; s++) {
      const a = b[s], c = a.getAttribute("data-ln-table-filter-col") || a.getAttribute("data-ln-filter-col") || a.getAttribute("data-ln-filter-key") || a.getAttribute("data-ln-table-col") || a.getAttribute("data-ln-col") || a.getAttribute("data-ln-field");
      if (c && c.trim().toLowerCase() === m)
        return typeof a.cellIndex == "number" ? a.cellIndex : s;
    }
    if (e) {
      const s = e.closest ? e.closest("[data-ln-popover], [id]") : null, a = s && s.id || e.id || null;
      if (a)
        for (let c = 0; c < b.length; c++) {
          const n = b[c];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + a + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : c;
        }
    }
    for (let s = 0; s < b.length; s++) {
      const a = b[s], n = Array.from(a.childNodes || []).filter((f) => f.nodeType === 3), r = (n.length > 0 ? n.map((f) => f.textContent.trim()).join(" ") : a.textContent || "").trim().toLowerCase();
      if (r && r === m)
        return typeof a.cellIndex == "number" ? a.cellIndex : s;
    }
  }
  return null;
}
function Yr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const o = [];
  for (let h = 0; h < t.length; h++) {
    const b = t[h];
    !e && b.key && (e = b.key), b.checked && !b.isReset && b.value && o.push(b.value);
  }
  return { key: e, values: o };
}
function Xr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Qe(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", o = "data-ln-filter-key", h = "data-ln-filter-value", b = "data-ln-filter-hide", m = "data-ln-filter-reset", s = "data-ln-filter-col", a = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-filter": { prop: "targetId", read: Q, fallback: null },
    "data-ln-hash": { effect: _ },
    "data-ln-filter-values": { effect: _ },
    "data-ln-filter-col": {},
    "data-ln-filter-key": {},
    "data-ln-filter-reset": {},
    "data-ln-filter-value": {},
    "data-ln-filter-hide": {}
  }, f = et(r);
  function d(l) {
    return l.hasAttribute(m) || !l.getAttribute(h);
  }
  function w(l) {
    const i = l.dom.querySelectorAll("[" + o + "]"), p = [];
    for (let T = 0; T < i.length; T++) {
      const g = i[T];
      p.push({
        key: g.getAttribute(o),
        value: g.getAttribute(h) || "",
        checked: g.checked,
        isReset: d(g)
      });
    }
    const y = Yr(p);
    return { key: y.key, values: y.values, targetId: l.targetId };
  }
  function v(l, i, p) {
    const y = l.querySelectorAll("[" + o + "]"), T = Array.isArray(p) && p.length > 0;
    for (let g = 0; g < y.length; g++) {
      const E = y[g];
      d(E) ? E.checked = !T : T && E.getAttribute(o) === i && p.indexOf(E.getAttribute(h)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(l) {
    this.dom = l, tt(this, l, f);
    const i = l.getAttribute(s);
    this.colIndex = i !== null ? parseInt(i, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(l, "filter"), this.hashEnabled = !!this.nsKey;
    const p = this, y = oe(function() {
      p._render();
    });
    this._queueRender = y, this._attachHandlers(), this._onHashChange = function() {
      if (p._destroyed || !p.hashEnabled) return;
      const g = ot(p.nsKey), E = _e(g);
      E && E.key && E.values.length > 0 ? v(p.dom, E.key, E.values) : v(p.dom, null, []), p._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const g = ot(this.nsKey), E = _e(g);
      E && E.key && E.values.length > 0 && (v(l, E.key, E.values), mt(function() {
        p._destroyed || p._render();
      }), T = !0);
    }
    if (!T) {
      const g = Qe(l.getAttribute(c));
      if (g.length > 0) {
        const E = l.querySelector("[" + o + "]"), C = E ? E.getAttribute(o) : null;
        C && (v(l, C, g), mt(function() {
          p._destroyed || p._render();
        }), T = !0);
      }
    }
    if (!T) {
      const g = l.querySelectorAll("[" + o + "]");
      for (let E = 0; E < g.length; E++)
        if (g[E].checked && !d(g[E])) {
          mt(function() {
            p._destroyed || p._render();
          });
          break;
        }
    }
    return this;
  }
  S.prototype._attachHandlers = function() {
    const l = this;
    this._onDomChange = function(i) {
      const p = i.target;
      if (!p || !p.hasAttribute || !p.hasAttribute(o)) return;
      const y = Array.from(l.dom.querySelectorAll("[" + o + "]"));
      if (d(p)) {
        for (let T = 0; T < y.length; T++)
          d(y[T]) || (y[T].checked = !1);
        p.checked = !0, l._queueRender();
        return;
      }
      if (p.checked) {
        for (let g = 0; g < y.length; g++)
          d(y[g]) && (y[g].checked = !1);
        let T = !1;
        for (let g = 0; g < y.length; g++)
          if (d(y[g])) {
            T = !0;
            break;
          }
        if (T) {
          let g = !0;
          for (let E = 0; E < y.length; E++)
            if (!d(y[E]) && !y[E].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let E = 0; E < y.length; E++)
              d(y[E]) ? y[E].checked = !0 : y[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let g = 0; g < y.length; g++)
          if (!d(y[g]) && y[g].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let g = 0; g < y.length; g++)
            d(y[g]) && (y[g].checked = !0);
      }
      l._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const l = this, i = w(this), p = this._lastSnapshot;
    if (!(!p || p.key !== i.key || Qr(p.values, i.values))) return;
    const T = i.key === null || i.values.length === 0, g = document.getElementById(l.targetId), E = {
      key: i.key,
      values: i.values.slice(),
      targetId: l.targetId
    };
    q(l.dom, "ln-filter:change", E);
    let C = !1;
    g && g !== l.dom && Z(g, "ln-filter:change", E).defaultPrevented && (C = !0);
    const k = p && p.values.length > 0, D = i.values.length === 0;
    if (k && D) {
      const O = { targetId: l.targetId };
      q(l.dom, "ln-filter:reset", O), g && g !== l.dom && q(g, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: i.key, values: i.values.slice() };
    const I = Xr(i.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = An(i.key, i.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = g && (g.tagName === "TABLE" ? g : g.querySelector ? g.querySelector("table") : null);
    if (R)
      l._filterTableRows(i, R);
    else {
      if (!g) return;
      const O = g.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(b), T) continue;
        const U = B.getAttribute("data-" + i.key);
        U !== null && (xe(U, i.values) || B.setAttribute(b, "true"));
      }
    }
  };
  function A(l) {
    if (!l) return "";
    const i = l.querySelector ? l.querySelector("[data-ln-value]") : null;
    return vt(i || l);
  }
  function u(l) {
    return !!(!l || typeof l != "object" || l.tagName === "TEMPLATE" || typeof l.hasAttribute == "function" && (l.hasAttribute("data-ln-sort-exclude") || l.hasAttribute("hidden")) || l.classList && l.classList.contains("hidden") || l.style && l.style.display === "none" || typeof l.matches == "function" && l.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof l.querySelector == "function" && l.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(l, i) {
    if (!i) {
      const C = document.getElementById(this.targetId);
      if (!C || (i = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !i)) return;
    }
    const p = Ge(i, this.dom, l.key, this.colIndex), y = l.key || this.dom.getAttribute("data-ln-filter-key") || (p !== null ? "col" + p : "attr-filter"), T = l.values;
    n.has(i) || n.set(i, {});
    const g = n.get(i);
    y && T.length > 0 ? g[y] = {
      col: p,
      values: T.slice(),
      attr: "data-" + y
    } : y && delete g[y];
    const E = i.tBodies;
    for (let C = 0; C < E.length; C++) {
      const k = E[C].rows;
      for (let D = 0; D < k.length; D++) {
        const I = k[D];
        if (u(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        $r(R, g, I) ? I.removeAttribute(b) : I.setAttribute(b, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const l = document.getElementById(this.targetId);
    if (l) {
      const i = l.tagName === "TABLE" ? l : l.querySelector ? l.querySelector("table") : null;
      if (i && n.has(i)) {
        const p = n.get(i), y = Ge(i, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (y !== null ? "col" + y : this.colIndex !== null ? "col" + this.colIndex : null);
        T && p[T] && (delete p[T], this._filterTableRows({ key: null, values: [] }, i)), Object.keys(p).length === 0 && n.delete(i);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function _(l, i) {
    const p = l[e];
    if (!(!p || p._destroyed)) {
      if (i === a)
        p.hashEnabled && p._onHashChange && window.removeEventListener("hashchange", p._onHashChange), p.nsKey = wt(l, "filter"), p.hashEnabled = !!p.nsKey, p.hashEnabled && window.addEventListener("hashchange", p._onHashChange);
      else if (i === c) {
        const y = Qe(l.getAttribute(c)), T = l.querySelector("[" + o + "]"), g = T ? T.getAttribute(o) : null;
        g && (v(l, g, y), p._render());
      }
    }
  }
  j(t, e, S, "ln-filter", {
    attributes: r,
    persist: {
      attr: c,
      hashActive: function(l) {
        return !!wt(l, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", o = "data-ln-search-for", h = "lnSearchControl", b = "data-ln-search-items", m = "data-ln-search-fields", s = "data-ln-search-exclude", a = "data-ln-search-hide", c = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { effect: l },
    "data-ln-hash": { effect: l },
    "data-ln-search-for": { prop: "targetId", read: Q, fallback: null },
    "data-ln-search-fields": {},
    "data-ln-search-items": {},
    "data-ln-search-exclude": {},
    "data-ln-search-hide": {},
    "data-ln-search-clear-for": {}
  }, r = et(n);
  function f(i) {
    const p = wt(i, "search");
    if (p) return p;
    if (i.id) {
      const y = document.querySelector("[" + o + '="' + i.id + '"]');
      if (y) {
        const T = wt(y, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function d(i) {
    return i.matches("input, textarea") ? i : i.querySelector("input, textarea");
  }
  function w(i, p) {
    const y = i.childNodes;
    for (let T = 0; T < y.length; T++) {
      const g = y[T];
      if (g.nodeType === 3) {
        p.push(g.nodeValue);
        continue;
      }
      g.nodeType === 1 && (g.hasAttribute(s) || w(g, p));
    }
  }
  function v(i) {
    if (i._lnSearchText !== void 0) return i._lnSearchText;
    const p = [];
    w(i, p);
    const y = Sr(p);
    return i._lnSearchText = y, y;
  }
  function S(i, p) {
    if (!i.id) return;
    const y = document.querySelectorAll("[" + o + '="' + i.id + '"]');
    for (const T of y) {
      const g = d(T);
      g && g.value !== p && (g.value = p);
    }
  }
  function A(i) {
    this.dom = i, this.term = i.getAttribute(t) || "", this._destroyed = !1;
    const p = this;
    return this.nsKey = f(i), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (p._destroyed || !p.hashEnabled) return;
      const y = ot(p.nsKey), T = p.dom.getAttribute(t) || "";
      y !== null && y !== T ? p.dom.setAttribute(t, y) : y === null && T !== "" && p.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!p._destroyed) {
        if (p.hashEnabled) {
          const y = ot(p.nsKey);
          if (y !== null && y !== p.term) {
            p.term = y, p.dom.setAttribute(t, y), S(p.dom, y), p._apply();
            return;
          }
        }
        ye(p.term) && (S(p.dom, p.term), p._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const i = this.dom, p = ye(this.term), y = Tn(p);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = Ar(i.getAttribute(m));
    if (Z(i, "ln-search:change", {
      term: p,
      tokens: y,
      targetId: i.id,
      fields: T
    }).defaultPrevented) return;
    const E = i.getAttribute(b), C = E ? i.querySelectorAll(E) : i.children;
    for (let k = 0; k < C.length; k++) {
      const D = C[k];
      if (D.removeAttribute(a), D.hasAttribute(s) || y.length === 0) continue;
      const I = v(D);
      Ln(I, y) || D.setAttribute(a, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(i) {
    if (this.dom = i, tt(this, i, r), this.input = d(i), this._attachHandler(), this.input && this.input.value.trim()) {
      const p = this;
      mt(function() {
        const y = document.getElementById(p.targetId);
        y && ((y.getAttribute(t) || "").trim() || p._write(p.input.value));
      });
    }
    return this;
  }
  u.prototype._write = function(i) {
    const p = document.getElementById(this.targetId);
    p && p.getAttribute(t) !== i && p.setAttribute(t, i);
  }, u.prototype._attachHandler = function() {
    if (!this.input) return;
    const i = this;
    this._onInput = function() {
      i._write(i.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, u.prototype.destroy = function() {
    this.dom[h] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[h]);
  };
  function _(i) {
    const p = i.getAttribute("data-ln-search-clear-for");
    if (p) {
      const C = document.getElementById(p), k = document.querySelector("[" + o + '="' + p + '"]'), D = k ? d(k) : null;
      return { target: C, input: D };
    }
    const y = i.closest("[" + t + "]");
    if (y) {
      const C = y.id ? document.querySelector("[" + o + '="' + y.id + '"]') : null, k = C ? d(C) : null;
      return { target: y, input: k };
    }
    const T = i.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), k = C ? document.getElementById(C) : null;
      if (k && k.hasAttribute(t)) {
        const D = document.querySelector("[" + o + '="' + C + '"]'), I = D ? d(D) : null;
        return { target: k, input: I };
      }
    }
    const g = i.closest("[" + o + "]");
    if (g) {
      const C = g.getAttribute(o), k = C ? document.getElementById(C) : null, D = d(g);
      return { target: k, input: D };
    }
    const E = i.parentElement;
    if (E) {
      const C = E.querySelector("[" + o + "]");
      if (C) {
        const k = C.getAttribute(o), D = k ? document.getElementById(k) : null, I = d(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(i) {
    const p = i.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!p) return;
    const y = _(p);
    !y.target && !y.input || (i.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function l(i, p) {
    const y = i[e];
    if (!y || y._destroyed) return;
    if (p === c) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = f(i), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const T = i.getAttribute(t) || "";
    T !== y.term && (y.term = T, S(i, T), y._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(i, p) {
      const y = p.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(i) {
        return !!f(i);
      }
    }
  }), j(o, h, u);
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Jr(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Zr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function ti(t, e, o, h) {
  const b = St(t);
  if (b === "none") return () => 0;
  const m = b === "desc" ? -1 : 1, s = typeof h == "function" ? h : (a) => a;
  return function(a, c) {
    const n = s(a), r = s(c);
    return Te(n, r, e, o) * m;
  };
}
function me(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function ei(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const o = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (o && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(o));
  if (t.tagName === "TABLE") {
    const h = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (h)
      return Array.from(h.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", o = "data-ln-sort-field", h = "data-ln-sort-state", b = "data-ln-sort-dir", m = "data-ln-hash";
  if (window[e] !== void 0) return;
  function s(w, v) {
    return w.getAttribute(v) || null;
  }
  const a = {
    "data-ln-sort": { prop: "targetId", read: Q, fallback: null },
    "data-ln-sort-field": { prop: "field", read: s, effect: d },
    "data-ln-sort-dir": {},
    "data-ln-sort-items": { prop: "itemsSelector", read: s },
    "data-ln-sort-state": { effect: d },
    "data-ln-hash": { effect: d }
  }, c = et(a), n = /* @__PURE__ */ new WeakMap();
  function r(w, v, S) {
    if (v) {
      const A = w.querySelector('[data-ln-field="' + v + '"]');
      return A ? vt(A) : "";
    }
    return S != null && w.cells && w.cells[S] ? vt(w.cells[S]) : vt(w);
  }
  function f(w) {
    this.dom = w, tt(this, w, c);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(h)), w.hasAttribute(h) || w.setAttribute(h, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(u) {
      const _ = u.target.closest("[" + b + "]");
      if (!_) return;
      const l = St(_.getAttribute(b));
      S._apply(l);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(u) {
      if (S._destroyed || !u.detail) return;
      const _ = S._resolveTarget();
      if (!(_ && (u.target === _ || _.contains(u.target)) || u.detail.targetId && u.detail.targetId === S.targetId)) return;
      if (Zr(
        { field: S.field, column: S.column },
        { field: u.detail.field, column: u.detail.column }
      )) {
        const p = St(u.detail.direction);
        p && w.getAttribute(h) !== p && (S._state = p, w.setAttribute(h, p), S._updateAriaSort(p));
        return;
      }
      w.getAttribute(h) !== "none" && (S._state = "none", w.setAttribute(h, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const u = ot(S.nsKey), _ = ge(u);
      if (_)
        S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn ? S._state !== _.direction && S._apply(_.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(h, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(h, "none"), S._updateAriaSort("none");
        const l = S._resolveTarget();
        l && (Z(l, "ln-sort:change", {
          field: S.field,
          column: S.column,
          direction: "none",
          targetId: S.targetId
        }).defaultPrevented || S._defaultSort(l, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const u = ot(this.nsKey), _ = ge(u);
      _ && ((S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(_.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const u = St(w.getAttribute(h));
      u && u !== "none" && mt(function() {
        S._destroyed || S._apply(u, !0);
      });
    }
    return this;
  }
  f.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, f.prototype._updateAriaSort = function(w) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", Jr(w));
  }, f.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const l = this.dom.closest("th");
      l && l.cellIndex !== void 0 && (this.column = l.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(h) !== S && this.dom.setAttribute(h, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const u = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const l = En(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, l);
    }
    Z(A, "ln-sort:change", u).defaultPrevented || this._defaultSort(A, S);
  }, f.prototype._defaultSort = function(w, v) {
    const S = ei(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, u = S.filter(function(p) {
      return !me(p);
    });
    if (!u.length) return;
    n.has(w) || n.set(w, u.slice());
    let _;
    if (v === "none") {
      const p = n.get(w) || u;
      n.delete(w), _ = p.filter(function(y) {
        return y.parentNode === A && !me(y);
      });
    } else {
      const p = this.field, y = this.column, T = u.map(function(k) {
        return r(k, p, y);
      }), g = Ce(T), E = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = ti(v, g, E, function(k) {
        return r(k, p, y);
      });
      _ = u.slice().sort(C);
    }
    const l = document.createDocumentFragment();
    let i = 0;
    for (let p = 0; p < S.length; p++) {
      const y = S[p];
      me(y) ? l.appendChild(y) : i < _.length && l.appendChild(_[i++]);
    }
    A.appendChild(l);
  }, f.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function d(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === o) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === h) {
        const A = St(w.getAttribute(h));
        A !== S._state && S._apply(A);
      } else v === m && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, f, "ln-sort", {
    attributes: a,
    persist: {
      attr: h,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function $e(t, e, o, h, b = 15) {
  if (h <= 0 || o <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const m = Math.max(0, t || 0), s = Math.max(0, e || 0), a = Math.floor(m / o), c = Math.ceil(s / o), n = Math.max(0, a - b), r = Math.min(h, a + c + b), f = n * o, d = Math.max(0, (h - r) * o);
  return { start: n, end: r, topPadding: f, bottomPadding: d };
}
function ni(t, e) {
  const o = Array.isArray(t) ? t.length : 0, h = e instanceof Set ? e : new Set(e || []);
  let b = 0;
  if (Array.isArray(t))
    for (let a = 0; a < t.length; a++)
      h.has(t[a]) && b++;
  else
    b = h.size;
  const m = o > 0 && b === o, s = b > 0 && b < o;
  return { totalCount: o, selectedCount: b, isAllSelected: m, isIndeterminate: s };
}
function Ye(t, e, o) {
  const h = new Set(t);
  return e == null || ((o !== void 0 ? o : !h.has(e)) ? h.add(e) : h.delete(e)), h;
}
function Xe(t, e, o) {
  const h = new Set(t);
  if (!Array.isArray(e)) return h;
  if (o)
    for (let b = 0; b < e.length; b++)
      e[b] != null && h.add(e[b]);
  else
    for (let b = 0; b < e.length; b++)
      h.delete(e[b]);
  return h;
}
(function() {
  const t = "data-ln-table", e = "lnTable", o = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function c(u, _) {
    if (!u || !u.isDataDriven) return;
    const l = u.dom.hasAttribute("data-ln-table-window");
    if (l && !u._windowed)
      u._enterWindowedMode(), u._kickWindowInitial();
    else if (!l && u._windowed)
      u._exitWindowedMode();
    else if (l && u._windowed) {
      const i = parseInt(_, 10);
      i > 0 && u._cache.configure({ windowSize: i });
    }
  }
  function n(u, _) {
    if (!u || !u.isDataDriven || !u._windowed || !u._cache) return;
    const l = parseInt(_, 10);
    l > 0 && u._cache.configure({ pageSize: l });
  }
  function r(u, _) {
    if (!u || !u.isDataDriven || !u._windowed || !u._cache) return;
    const l = parseInt(_, 10);
    l >= 0 && u._cache.configure({ threshold: l });
  }
  function f(u, _) {
    if (!u || !u.isDataDriven || !u._windowed || !u._cache) return;
    const l = parseInt(_, 10);
    l >= 0 && u._cache.setGrandTotal(l);
  }
  const d = {
    "data-ln-table": { prop: "name", read: Q, fallback: "" },
    "data-ln-table-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-table-selectable": { prop: "_selectable", read: Kt },
    "data-ln-table-window": { effect: c },
    "data-ln-table-window-page": { effect: n },
    "data-ln-table-window-threshold": { effect: r },
    "data-ln-table-count": { effect: f },
    "data-ln-table-row": {},
    "data-ln-table-row-id": {},
    "data-ln-table-row-action": {},
    "data-ln-table-row-select": {},
    "data-ln-table-col": {},
    "data-ln-table-col-select": {},
    "data-ln-table-cell-attr": {},
    "data-ln-table-empty": {},
    "data-ln-table-select-all-label": {}
  }, w = et(d);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(u, _) {
    if (u == null || isNaN(u)) return "";
    try {
      return new Intl.NumberFormat(rt(_)).format(u);
    } catch {
      return String(u);
    }
  }
  function S(u) {
    let _ = u.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const i = getComputedStyle(_).overflowY;
      if (i === "auto" || i === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function A(u) {
    this.dom = u, tt(this, u, w), this.table = u.querySelector("table"), this.tbody = u.querySelector("[data-ln-table-body]") || u.querySelector("tbody"), this.thead = u.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = u.querySelector("[data-ln-table-total]"), this._filteredSpan = u.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== u ? this._filteredSpan.parentElement : null), this._selectedSpan = u.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== u ? this._selectedSpan.parentElement : null), this.isDataDriven = u.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    return this._onSetSearch = function(i) {
      const p = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      l.isDataDriven ? (l.currentSearch = p, q(u, "ln-table:search", {
        table: l.name,
        query: l.currentSearch
      }), l._requestData()) : (l._searchTerm = p.toLowerCase(), l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(u, "ln-table:filter", {
        term: l._searchTerm,
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, u.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), l._onSetSearch(i);
    }, u.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      l.isDataDriven ? (l.currentFilters = {}, l.currentSearch = "", q(u, "ln-table:clear-filters", { table: l.name }), l._requestData()) : (l._searchTerm = "", l._columnFilters = {}, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(u, "ln-table:filter", {
        term: "",
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, u.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && u.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(i) {
      const p = i.detail || {}, y = p.data || [], T = p.total != null ? p.total : y.length;
      if (!(l._hasInitialSeed && !l.isLoaded && y.length === 0 && T === 0)) {
        if (l._windowed) {
          l._cache.ingest(p) && !p.provisional && u.classList.remove("ln-table--loading");
          return;
        }
        l._data = y, l._lastTotal = T, l._lastFiltered = p.filtered != null ? p.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, l._hasInitialSeed = !1, u.classList.remove("ln-table--loading"), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), q(u, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }
    }, u.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const p = i.detail && i.detail.loading;
      u.classList.toggle("ln-table--loading", !!p), p && (l.isLoaded = !1);
    }, u.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(i) {
      !l._windowed || !l._cache || l._cache.release(i.detail && i.detail.offset);
    }, u.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !l._windowed || !l._cache || l._cache.revalidate();
    }, u.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !l._windowed || !l._cache || l._requestData();
    }, u.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(i) {
      i.preventDefault(), l.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, l._requestData();
    }, u.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const p = i.target.closest("[data-ln-table-row]");
      if (!p) return;
      const y = p.getAttribute("data-ln-table-row-id"), T = p._lnRecord || {};
      q(u, "ln-table:row-click", {
        table: l.name,
        id: y,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const p = i.target.closest("[data-ln-table-row-action]");
      if (!p) return;
      const y = p.closest("[data-ln-table-row]");
      if (!y) return;
      const T = p.getAttribute("data-ln-table-row-action"), g = y.getAttribute("data-ln-table-row-id"), E = y._lnRecord || {};
      q(u, "ln-table:row-action", {
        table: l.name,
        id: g,
        action: T,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : q(u, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      i.preventDefault();
      const p = i.detail.direction === "none" ? null : i.detail.direction;
      l._sortCol = p === null ? -1 : i.detail.column, l._sortDir = p, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), q(u, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: l._filteredData.length,
        total: l._data.length
      });
    }, u.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const p = i.detail.key, y = i.detail.values || [];
      if (p) {
        if (y.length === 0)
          delete l._columnFilters[p];
        else {
          const T = [];
          for (let g = 0; g < y.length; g++)
            T.push(y[g].toLowerCase());
          l._columnFilters[p] = T;
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(u, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }
    }, u.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const u = this.tbody.rows, _ = this.ths;
    this._data = [], u.length > 0 && (this._rowHeight = u[0].offsetHeight || 40), this._lockColumnWidths();
    for (let l = 0; l < u.length; l++) {
      const i = u[l], p = [], y = [], T = [];
      for (let E = 0; E < i.cells.length; E++) {
        const C = i.cells[E], k = C.textContent.trim();
        p[E] = vt(C), y[E] = k.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(k.toLowerCase());
      }
      let g = null;
      if (this.isDataDriven) {
        g = {};
        const E = i.getAttribute("data-ln-table-row-id");
        E != null && (g.id = E);
        for (let C = 0; C < _.length; C++) {
          const k = _[C].getAttribute("data-ln-table-col");
          if (k) {
            const D = C;
            if (D < i.cells.length) {
              const I = i.cells[D];
              g[k] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: p,
        rawTexts: y,
        html: i.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && g ? g.id : void 0,
        ...g
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), q(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const u = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const l = document.createElement("col");
      l.style.width = _.offsetWidth + "px", u.appendChild(l);
    }), this.table.insertBefore(u, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = u;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const u = this._lastTotal, _ = this.visibleCount;
        if (u === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const u = this._filteredData.length;
        u === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : u > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const u = this._filteredData, _ = document.createDocumentFragment();
      for (let l = 0; l < u.length; l++) {
        const i = this._buildRow(u[l]);
        if (!i) break;
        _.appendChild(i);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const u = [], _ = this._filteredData;
      for (let l = 0; l < _.length; l++) u.push(_[l].html);
      this.tbody.innerHTML = u.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const u = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let l = null;
        if (this._windowed) {
          const i = this._cache ? this._cache.peek() : null;
          l = i ? this._buildRow(i) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (l = this._buildRow(this._data[0]));
        l && this.tbody && (this.tbody.appendChild(l), this._rowHeight = l.offsetHeight || 40, l.remove());
      }
    this.isDataDriven ? this._scrollContainer = S(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      u._rafId || (u._rafId = requestAnimationFrame(function() {
        u._rafId = null, u._windowed ? u._renderWindowed() : u._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const u = this._filteredData, _ = u.length, l = this._rowHeight;
    if (!l || !_) return;
    const i = this.thead ? this.thead.offsetHeight : 0, p = this._scrollContainer;
    let y, T;
    if (p) {
      const R = this.table.getBoundingClientRect(), O = p.getBoundingClientRect(), P = R.top - O.top + p.scrollTop + i;
      y = p.scrollTop - P, T = p.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + i;
      y = window.scrollY - P, T = window.innerHeight;
    }
    const g = $e(y, T, l, _, 15), E = g.start, C = g.end;
    if (E === this._vStart && C === this._vEnd) return;
    this._vStart = E, this._vEnd = C;
    const k = this.ths.length || 1, D = g.topPadding, I = g.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", k), P.style.height = D + "px", O.appendChild(P), R.appendChild(O);
      }
      for (let O = E; O < C; O++) {
        const P = this._buildRow(u[O]);
        P && R.appendChild(P);
      }
      if (I > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", k), P.style.height = I + "px", O.appendChild(P), R.appendChild(O);
      }
      this.tbody.replaceChildren(R), this._selectable && this._updateSelectAll();
    } else {
      let R = "";
      D > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + k + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>');
      for (let O = E; O < C; O++) R += u[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + k + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const u = document.createElement("tr");
    u.className = "ln-table__placeholder", u.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", u.appendChild(_), u;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const u = this._rowHeight;
    if (!u) return;
    const _ = this._cache.logicalTotal, l = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let p, y;
    if (i) {
      const R = this.table.getBoundingClientRect(), O = i.getBoundingClientRect(), P = R.top - O.top + i.scrollTop + l;
      p = i.scrollTop - P, y = i.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + l;
      p = window.scrollY - P, y = window.innerHeight;
    }
    const T = $e(p, y, u, _, 15), g = T.start, E = T.end, C = this.ths.length || 1, k = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (k > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = k + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = g; R < E; R++)
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
    this.tbody.replaceChildren(I), this._vStart = g, this._vEnd = E, this._cache.ensure(g, E);
  }, A.prototype._showEmptyState = function() {
    const u = this.ths.length || 1;
    let _ = null, l = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount === 0 && i > 0, T = y ? this.name + "-empty-filtered" : this.name + "-empty";
      if (l = Tt(this.dom, T, "ln-table"), !l) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const E = y ? "search" : "initial", C = g.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || g.content.firstElementChild;
          C && (l = document.importNode(C, !0));
        }
      }
      if (l)
        if (l.tagName === "TR")
          _ = l;
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(u)), g.appendChild(l);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(g), _ = E;
        }
    } else {
      const i = this.dom.querySelector("template[" + o + "]"), p = document.createElement("td");
      p.setAttribute("colspan", String(u)), i && p.appendChild(document.importNode(i.content, !0));
      const y = document.createElement("tr");
      y.className = "ln-table__empty", y.appendChild(p), _ = y;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), q(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(u, _) {
    jt(u, _);
    const l = u.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < l.length; i++) {
      const p = l[i], y = p.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < y.length; T++) {
        const g = y[T].trim().split(":");
        if (g.length !== 2) continue;
        const E = g[0].trim(), C = g[1].trim();
        _[E] != null && p.setAttribute(C, _[E]);
      }
    }
  }, A.prototype._buildRow = function(u) {
    let _ = Tt(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (_ = document.importNode(i.content, !0));
    }
    let l = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (l)
      this._fillRow(l, u);
    else if (u && u.html) {
      const i = document.createElement("tbody");
      i.innerHTML = u.html, l = i.firstElementChild;
    } else {
      l = document.createElement("tr"), l.setAttribute("data-ln-table-row", "");
      const i = this.ths;
      for (let p = 0; p < i.length; p++) {
        const y = i[p].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (y) {
          const g = document.createElement("input");
          g.type = "checkbox", g.setAttribute("data-ln-table-row-select", ""), g.setAttribute("aria-label", "Select row"), T.appendChild(g);
        } else {
          const g = i[p].getAttribute("data-ln-table-col");
          g && u[g] != null && (T.textContent = String(u[g]));
        }
        l.appendChild(T);
      }
    }
    if (l._lnRecord = u, u.id != null && l.setAttribute("data-ln-table-row-id", u.id), this._selectable && u.id != null && this.selectedIds.has(String(u.id))) {
      l.classList.add("ln-row-selected");
      const i = l.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return l;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    on(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const u = this, _ = this.dom, l = parseInt(_.getAttribute("data-ln-table-window"), 10), i = parseInt(_.getAttribute("data-ln-table-window-page"), 10), p = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !u._windowed || !u._cache || (u.totalCount = u._cache.grandTotal, u.visibleCount = u._cache.logicalTotal, u._lastTotal = u._cache.grandTotal, u.isLoaded = !0, u._vStart = -1, u._vEnd = -1, u._render(), u._updateFooter(), q(_, "ln-table:rendered", {
        table: u.name,
        total: u.totalCount,
        visible: u.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = vn({
      windowSize: l > 0 ? l : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: p >= 0 ? p : 25,
      fetchDebounce: 120,
      requestPage: function(y, T, g) {
        q(_, "ln-table:request-data", {
          table: u.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: T,
          limit: g,
          queryGen: u._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let u = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(u) && this._totalSpan) {
        const l = this._totalSpan.textContent.replace(/[^\d]/g, "");
        l && (u = parseInt(l, 10));
      }
      const _ = u > 0 ? u : this._data.length;
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
    const u = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let i = 0; i < u.length; i++) {
      const p = u[i].getAttribute("data-ln-table-row-id");
      p != null && _.push(p);
    }
    const l = ni(_, this.selectedIds);
    this._selectAllCheckbox.checked = l.isAllSelected, this._selectAllCheckbox.indeterminate = l.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const u = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < u.length; _++) {
      const l = u[_].getAttribute("data-ln-table-row-id"), i = l != null && this.selectedIds.has(l);
      u[_].classList.toggle("ln-row-selected", i);
      const p = u[_].querySelector("[data-ln-table-row-select]");
      p && (p.checked = i);
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
    const u = this;
    if (this._onSelectionChange = function(_) {
      const l = _.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const i = l.closest("[data-ln-table-row]");
      if (!i) return;
      const p = i.getAttribute("data-ln-table-row-id");
      p != null && (u.selectedIds = Ye(u.selectedIds, p, l.checked), i.classList.toggle("ln-row-selected", l.checked), u.selectedCount = u.selectedIds.size, u._updateSelectAll(), u._updateFooter(), q(u.dom, "ln-table:select", {
        table: u.name,
        selectedIds: u.selectedIds,
        count: u.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const l = u.dom.querySelector('[data-ln-table-dict="select-all"]'), i = u.dom.getAttribute("data-ln-table-select-all-label") || (l ? l.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = u._selectAllCheckbox.checked, l = u.tbody ? u.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let p = 0; p < l.length; p++) {
        const y = l[p].getAttribute("data-ln-table-row-id"), T = l[p].querySelector("[data-ln-table-row-select]");
        y != null && (i.push(y), l[p].classList.toggle("ln-row-selected", _), T && (T.checked = _));
      }
      u.selectedIds = Xe(u.selectedIds, i, _), u.selectedCount = u.selectedIds.size, q(u.dom, "ln-table:select-all", {
        table: u.name,
        selected: _
      }), q(u.dom, "ln-table:select", {
        table: u.name,
        selectedIds: u.selectedIds,
        count: u.selectedCount
      }), u._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < _.length; l++) {
        const i = _[l].querySelector("[data-ln-table-row-select]"), p = _[l].getAttribute("data-ln-table-row-id");
        i && i.checked && p != null && (u.selectedIds = Ye(u.selectedIds, p, !0), _[l].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const u = this.dom.querySelector("[data-ln-table-col-select]");
    if (u) {
      const _ = u.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Xe(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < _.length; l++) {
        _[l].classList.remove("ln-row-selected");
        const i = _[l].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let u = 0, _ = 0;
    this.isDataDriven ? (u = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (u = this._data.length, _ = this._filteredData.length);
    const l = _ < u;
    if (this._totalSpan && (this._totalSpan.textContent = v(u, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = l ? v(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? v(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, A, "ln-table", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-table-coordinator": {}
  };
  document.addEventListener("keydown", function(a) {
    if (a.key !== "/" || a.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const c = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!c) return;
    const n = c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector('input[type="search"], input[type="text"], input');
    n && (a.preventDefault(), n.focus());
  });
  function h(a) {
    return this.dom = a, s(this), this;
  }
  function b(a, c) {
    const n = c ? '[data-ln-search-for="' + c + '"]' : "[data-ln-search-for]", r = a.querySelector(n) || document.querySelector(n);
    return r ? r.tagName === "INPUT" || r.tagName === "TEXTAREA" ? r : r.querySelector("input, textarea") : null;
  }
  function m(a, c) {
    if (c) {
      const r = a.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (r.length > 0) return r;
      const f = document.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (f.length > 0) return f;
    }
    const n = a.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function s(a) {
    const c = a.dom;
    function n(r) {
      const f = r.target;
      if (f && f.hasAttribute && (f.hasAttribute("data-ln-table") || f.tagName === "TABLE")) return f;
      const d = r.detail && r.detail.targetId || f && f.id;
      return d ? c.querySelector('[data-ln-table-source="' + d + '"]') || c.querySelector('[data-ln-table="' + d + '"]') || c.querySelector("#" + d) || (c.id === d ? c : null) || document.getElementById(d) : null;
    }
    a._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(r) {
        if (!r.detail) return;
        const f = n(r);
        if (!f) return;
        const d = r.detail.key, w = r.detail.values || [], v = f.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === d) {
            const u = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            u && u.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(r) {
        const f = r.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!f) return;
        const d = f.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!d) return;
        const w = d.lnTable && d.lnTable.name || d.id, v = d.querySelectorAll("th");
        for (let _ = 0; _ < v.length; _++) {
          const l = v[_].querySelector("[data-ln-table-col-filter], .table-filter");
          l && l.classList.remove("ln-filter-active");
        }
        const S = d.getAttribute("data-ln-table-source") || d.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const _ = b(c, S);
          _ && _.value !== "" && (_.value = "", _.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const u = m(c, S);
        for (let _ = 0; _ < u.length; _++) {
          const l = u[_].querySelector("[data-ln-filter-reset]");
          if (!l) continue;
          const i = u[_].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!l.checked || i) && (l.checked = !0, l.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        d.lnTable && !d.hasAttribute("data-ln-table-source") && q(d, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", a._handlers.filter), c.addEventListener("click", a._handlers.clear);
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, h, "ln-table-coordinator", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", o = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(i, p) {
    if (!i || !i.isDataDriven) return;
    const y = i.dom.hasAttribute("data-ln-list-window");
    if (y && !i._windowed)
      i._enterWindowedMode(), i._kickWindowInitial();
    else if (!y && i._windowed)
      i._exitWindowedMode();
    else if (y && i._windowed) {
      const T = parseInt(p, 10);
      T > 0 && i._cache.configure({ windowSize: T });
    }
  }
  function n(i, p) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const y = parseInt(p, 10);
    y > 0 && i._cache.configure({ pageSize: y });
  }
  function r(i, p) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const y = parseInt(p, 10);
    y >= 0 && i._cache.configure({ threshold: y });
  }
  function f(i, p) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const y = parseInt(p, 10);
    y >= 0 && i._cache.setGrandTotal(y);
  }
  const d = {
    "data-ln-list": { prop: "name", read: Q, fallback: "" },
    "data-ln-list-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-list-selectable": { prop: "_selectable", read: Kt },
    "data-ln-list-window": { effect: c },
    "data-ln-list-window-page": { effect: n },
    "data-ln-list-window-threshold": { effect: r },
    "data-ln-list-count": { effect: f },
    "data-ln-list-empty": {},
    "data-ln-list-field": {}
  }, w = et(d);
  function v(i, p) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(rt(p)).format(i);
    } catch {
      return String(i);
    }
  }
  function S(i) {
    let p = i;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const T = getComputedStyle(p).overflowY;
      if (T === "auto" || T === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function A(i) {
    const p = i._scrollContainer || S(i.dom);
    return {
      container: p,
      top: p ? p.scrollTop : window.scrollY
    };
  }
  function u(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function _(i) {
    if (!i) return 0;
    const p = getComputedStyle(i), y = parseFloat(p.marginTop) || 0, T = parseFloat(p.marginBottom) || 0;
    return i.offsetHeight + y + T;
  }
  function l(i) {
    this.dom = i, tt(this, i, w), this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const p = this;
    return this._onSetSearch = function(y) {
      const T = (y.detail && y.detail.query != null ? y.detail.query : y.detail && y.detail.term != null ? y.detail.term : "").trim();
      p.isDataDriven ? (p.currentSearch = T, q(i, "ln-list:search", {
        list: p.name,
        query: p.currentSearch
      }), p._requestData()) : (p._searchTerm = T.toLowerCase(), p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(i, "ln-list:filter", {
        term: p._searchTerm,
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, i.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(y) {
      y.preventDefault(), p._onSetSearch(y);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      p.isDataDriven ? (p.currentFilters = {}, p.currentSearch = "", q(i, "ln-list:clear-filters", { list: p.name }), p._requestData()) : (p._searchTerm = "", p._filters = {}, p._sortField = null, p._sortDir = null, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(i, "ln-list:filter", {
        term: "",
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(y) {
      const T = y.detail || {}, g = T.data || [], E = T.total != null ? T.total : g.length;
      if (!(p._hasInitialSeed && !p.isLoaded && g.length === 0 && E === 0)) {
        if (p._windowed) {
          p._cache.ingest(T) && !T.provisional && i.classList.remove("ln-list--loading");
          return;
        }
        p._data = g, p._lastTotal = E, p._lastFiltered = T.filtered != null ? T.filtered : p._data.length, p.totalCount = p._lastTotal, p.visibleCount = p._lastFiltered, p.isLoaded = !0, p._hasInitialSeed = !1, i.classList.remove("ln-list--loading"), p._vStart = -1, p._vEnd = -1, p._applyFilterAndSort(), p._render(), p._updateFooter(), q(i, "ln-list:rendered", {
          list: p.name,
          total: p.totalCount,
          visible: p.visibleCount
        });
      }
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(y) {
      const T = y.detail && y.detail.loading;
      i.classList.toggle("ln-list--loading", !!T), T && (p.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(y) {
      !p._windowed || !p._cache || p._cache.release(y.detail && y.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !p._windowed || !p._cache || p._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !p._windowed || !p._cache || p._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(y) {
      y.detail.field != null && (y.preventDefault(), p.currentSort = y.detail.direction === "none" ? null : { field: y.detail.field, direction: y.detail.direction }, p._requestData());
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(y) {
      if (y.target.closest("[data-ln-item-select]") || y.target.closest("[data-ln-item-action]") || y.target.closest("a") || y.target.closest("button") || y.ctrlKey || y.metaKey || y.button === 1) return;
      const T = y.target.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      q(i, "ln-list:item-click", {
        list: p.name,
        id: g,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(y) {
      const T = y.target.closest("[data-ln-item-action]");
      if (!T) return;
      const g = T.closest("[data-ln-item]");
      if (!g) return;
      const E = T.getAttribute("data-ln-item-action"), C = g.getAttribute("data-ln-item-id"), k = g._lnRecord || {};
      q(i, "ln-list:item-action", {
        list: p.name,
        id: C,
        action: E,
        record: k
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : q(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      p.tbody.children.length > 0 && (p._emptyObserver.disconnect(), p._emptyObserver = null, p._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(y) {
      if (y.preventDefault(), !y.detail) return;
      const T = y.detail.key, g = y.detail.values || [];
      if (T) {
        if (g.length === 0)
          delete p._filters[T];
        else {
          const E = [];
          for (let C = 0; C < g.length; C++)
            E.push(g[C].toLowerCase());
          p._filters[T] = E;
        }
        p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(i, "ln-list:filter", {
          term: p._searchTerm,
          matched: p._filteredData.length,
          total: p._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(y) {
      if (y.detail && y.detail.field == null) return;
      y.preventDefault();
      const T = y.detail && y.detail.direction === "none" ? null : y.detail && y.detail.direction;
      p._sortField = T === null ? null : y.detail && y.detail.field, p._sortDir = T, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(i, "ln-list:sorted", {
        field: p._sortField,
        direction: y.detail && y.detail.direction,
        matched: p._filteredData.length,
        total: p._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  l.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((p) => !p.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = _(i[0]) || 50);
    for (let p = 0; p < i.length; p++) {
      const y = i[p], T = y.getAttribute("data-ln-item-id") || y.getAttribute("id"), g = y.textContent.trim().toLowerCase();
      let E = null;
      if (this.isDataDriven) {
        E = {}, T != null && (E.id = T);
        const D = y.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (E[O] = vt(R));
        }
      }
      const C = {}, k = y.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < k.length; D++) {
        const I = k[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        R && (C[R] = vt(I));
      }
      for (let D = 0; D < y.attributes.length; D++) {
        const I = y.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const R = I.name.slice(5);
          R && (C[R] = I.value);
        }
      }
      this._data.push({
        html: y.outerHTML,
        id: T,
        searchText: g,
        fields: C,
        ...E || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), q(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, l.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const i = this._searchTerm, p = i ? i.split(/\s+/).filter(Boolean) : [], y = this._filters || {}, T = Object.keys(y).length > 0;
      if (p.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(g) {
        if (p.length > 0 && !p.every(function(C) {
          return g.searchText && g.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in y) {
            const C = y[E];
            if (C && C.length > 0) {
              const k = g.fields && g.fields[E] !== void 0 ? g.fields[E] : g[E] !== void 0 ? g[E] : null, D = k != null ? String(k).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const g = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base" }) : null, k = this._filteredData.map(function(I) {
          return I.fields && I.fields[g] !== void 0 ? I.fields[g] : I[g];
        }), D = Ce(k);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[g] !== void 0 ? I.fields[g] : I[g], P = R.fields && R.fields[g] !== void 0 ? R.fields[g] : R[g];
          return Te(O, P, D, C) * E;
        });
      }
    }
  }, l.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, p = this.visibleCount;
        if (i === 0 || this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, l.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, p = document.createDocumentFragment();
      for (let T = 0; T < i.length; T++) {
        const g = this._buildItem(i[T]);
        g && p.appendChild(g);
      }
      const y = A(this);
      this.tbody.replaceChildren(p), u(y), this._selectable && this._updateSelectAll();
    } else {
      const i = [], p = this._filteredData;
      for (let T = 0; T < p.length; T++) i.push(p[T].html);
      const y = A(this);
      this.tbody.innerHTML = i.join(""), u(y), this._selectable && this._restoreSelection();
    }
  }, l.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), p = i.gridTemplateColumns;
    let y = 1;
    if (p && p !== "none") {
      const g = p.trim().split(/\s+/).filter(Boolean);
      g.length > 0 && (y = g.length);
    }
    const T = parseFloat(i.rowGap);
    return { columns: y, rowGap: isNaN(T) ? 0 : T };
  }, l.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), p = i ? this._buildItem(i) : this._buildPlaceholderItem();
      p && (this.tbody.textContent = "", this.tbody.appendChild(p), this._itemHeight = _(p) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = _(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = _(i[0]) || 50);
    }
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const i = this._filteredData, p = i.length, y = this._itemHeight;
    if (!y || !p) return;
    const T = this._scrollContainer;
    let g, E;
    if (T) {
      const Y = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : Y.top - V.top + T.scrollTop;
      g = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      g = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), k = C.columns, D = C.rowGap, I = y + D, R = Math.ceil(p / k);
    let O = Math.max(0, Math.floor(g / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(E / I) + 30, B = Math.min(O + P, R), U = Math.min(O * k, p), z = Math.min(B * k, p);
    if (U === this._vStart && z === this._vEnd) return;
    this._vStart = U, this._vEnd = z;
    const $ = O * I, X = (R - B) * I;
    if (this.isDataDriven) {
      const Y = document.createDocumentFragment();
      if ($ > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = $ + "px", Y.appendChild(G);
      }
      for (let G = U; G < z; G++) {
        const ht = this._buildItem(i[G]);
        ht && Y.appendChild(ht);
      }
      if (X > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = X + "px", Y.appendChild(G);
      }
      const V = A(this);
      this.tbody.replaceChildren(Y), u(V), this._selectable && this._updateSelectAll();
    } else {
      let Y = "";
      $ > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${$}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = U; G < z; G++)
        Y += i[G].html;
      X > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${X}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = Y, u(V), this._selectable && this._restoreSelection();
    }
  }, l.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, l.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const p = this._scrollContainer;
    let y, T;
    if (p) {
      const V = this.tbody.getBoundingClientRect(), G = p.getBoundingClientRect(), ht = p === this.tbody ? 0 : V.top - G.top + p.scrollTop;
      y = p.scrollTop - ht, T = p.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - G, T = window.innerHeight;
    }
    const g = this._readGridLayout(), E = g.columns, C = g.rowGap, k = i + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
    let R = Math.max(0, Math.floor(y / k) - 15);
    R = Math.min(R, I);
    const O = Math.ceil(T / k) + 30, P = Math.min(R + O, I), B = Math.min(R * E, D), U = Math.min(P * E, D), z = R * k, $ = (I - P) * k, X = document.createDocumentFragment();
    if (z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = z + "px", X.appendChild(V);
    }
    for (let V = B; V < U; V++)
      if (this._cache.has(V)) {
        const G = this._buildItem(this._cache.get(V));
        G && X.appendChild(G);
      } else
        X.appendChild(this._buildPlaceholderItem());
    if ($ > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = $ + "px", X.appendChild(V);
    }
    const Y = A(this);
    this.tbody.replaceChildren(X), u(Y), this._vStart = B, this._vEnd = U, this._cache.ensure(B, U);
  }, l.prototype._showEmptyState = function() {
    let i = null;
    if (this.isDataDriven) {
      const p = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && p > 0, g = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = Tt(this.dom, g, "ln-list"), !i) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", k = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          k && (i = document.importNode(k, !0));
        }
      }
    } else {
      const p = this.dom.querySelector(`template[${o}]`);
      if (p) {
        const y = p.content.firstElementChild;
        y && (i = document.importNode(y, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.replaceChildren(i);
      else {
        const p = document.createElement(this.isUl ? "li" : "div");
        p.appendChild(i), this.tbody.replaceChildren(p);
      }
    else
      this.tbody.replaceChildren();
    q(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, l.prototype._buildItem = function(i) {
    let p = Tt(this.dom, this.name + "-row", "ln-list");
    if (!p) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (p = document.importNode(T.content, !0));
    }
    let y = p ? p.querySelector("[data-ln-item]") || p.firstElementChild : null;
    if (y)
      jt(y, i), pt(y, i);
    else if (i && i.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = i.html, y = T.firstElementChild;
    } else if (y = document.createElement(this.isUl ? "li" : "div"), y.setAttribute("data-ln-item", ""), i && typeof i == "object") {
      for (const T in i)
        if (T !== "html" && i[T] != null) {
          const g = document.createElement("span");
          g.setAttribute("data-ln-field", T), g.textContent = String(i[T]), y.appendChild(g);
        }
    }
    if (y._lnRecord = i, i && i.id != null && (y.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      y.classList.add("ln-item-selected");
      const T = y.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return y;
  }, l.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let p = 0; p < i.length; p++) {
      const y = i[p].getAttribute("data-ln-item-id"), T = y != null && this.selectedIds.has(String(y));
      i[p].classList.toggle("ln-item-selected", T);
      const g = i[p].querySelector("[data-ln-item-select]");
      g && (g.checked = T);
    }
    this._updateSelectAll();
  }, l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(p) {
      const y = p.target.closest("[data-ln-item-select]");
      if (!y) return;
      const T = y.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id");
      g != null && (y.checked ? (i.selectedIds.add(String(g)), T.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(g)), T.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), q(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = i._selectAllCheckbox.checked, y = i.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < y.length; T++) {
        const g = y[T], E = g.getAttribute("data-ln-item-id"), C = g.querySelector("[data-ln-item-select]");
        E != null && (p ? (i.selectedIds.add(String(E)), g.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(E)), g.classList.remove("ln-item-selected")), C && (C.checked = p));
      }
      q(i.dom, "ln-list:select-all", { list: i.name, selected: p }), q(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let p = i.length > 0;
    for (let y = 0; y < i.length; y++) {
      const T = i[y].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        p = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = p;
  }, l.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    on(this, "ln-list:request-data", "list");
  }, l.prototype._enterWindowedMode = function() {
    const i = this, p = this.dom, y = parseInt(p.getAttribute("data-ln-list-window"), 10), T = parseInt(p.getAttribute("data-ln-list-window-page"), 10), g = parseInt(p.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), q(p, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = vn({
      windowSize: y > 0 ? y : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, k) {
        q(p, "ln-list:request-data", {
          list: i.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: C,
          limit: k,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, l.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const i = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), p = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: p,
        filtered: p
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, l.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, l.prototype._updateFooter = function() {
    let i = 0, p = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount) : (i = this._data.length, p = this._filteredData.length);
    const y = p < i;
    if (this._totalSpan && (this._totalSpan.textContent = v(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = y ? v(p, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !y), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, l.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, l, "ln-list", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function o(d) {
    const w = d[e];
    w && f.call(w);
  }
  const h = {
    "data-ln-circular-progress": { effect: o },
    "data-ln-circular-progress-max": { effect: o },
    "data-ln-circular-progress-label": { effect: o }
  }, b = "http://www.w3.org/2000/svg", m = 36, s = 16, a = 2 * Math.PI * s;
  function c(d) {
    return this.dom = d, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, r.call(this), f.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(d, w) {
    const v = document.createElementNS(b, d);
    for (const [S, A] of Object.entries(w))
      v.setAttribute(S, A);
    return v;
  }
  function r() {
    this.svg = n("svg", {
      viewBox: "0 0 " + m + " " + m,
      width: m,
      height: m
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: s,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: s,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": a,
      "stroke-dashoffset": a,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function f() {
    const d = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = Sn(d, w || 100), S = a - v.percentage / 100 * a;
    this.progressCircle.setAttribute("stroke-dashoffset", S);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), u = A !== null ? A : Math.round(v.percentage) + "%";
    this.labelEl.textContent = u, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", u), q(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  j(t, e, c, "ln-circular-progress", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", o = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-sortable": { effect: m },
    "data-ln-sortable-handle": {}
  };
  function b(s) {
    this.dom = s, this.isEnabled = s.getAttribute(t) !== "disabled", this._dragging = null, s.setAttribute("aria-roledescription", "sortable list");
    const a = this;
    return this._onPointerDown = function(c) {
      a.isEnabled && a._handlePointerDown(c);
    }, s.addEventListener("pointerdown", this._onPointerDown), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), q(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, b.prototype._handlePointerDown = function(s) {
    let a = s.target.closest("[" + o + "]"), c;
    if (a) {
      for (c = a; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + o + "]")) return;
      for (c = s.target; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
      a = c;
    }
    const r = Array.from(this.dom.children).indexOf(c);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: c,
      index: r
    }).defaultPrevented) return;
    s.preventDefault(), a.setPointerCapture(s.pointerId), this._dragging = c, c.classList.add("ln-sortable--dragging"), c.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), q(this.dom, "ln-sortable:drag-start", {
      item: c,
      index: r
    });
    const d = this, w = function(S) {
      d._handlePointerMove(S);
    }, v = function(S) {
      d._handlePointerEnd(S), a.removeEventListener("pointermove", w), a.removeEventListener("pointerup", v), a.removeEventListener("pointercancel", v);
    };
    a.addEventListener("pointermove", w), a.addEventListener("pointerup", v), a.addEventListener("pointercancel", v);
  }, b.prototype._handlePointerMove = function(s) {
    if (!this._dragging) return;
    const a = Array.from(this.dom.children), c = this._dragging;
    for (const n of a)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of a) {
      if (n === c) continue;
      const r = n.getBoundingClientRect(), f = r.top + r.height / 2;
      if (s.clientY >= r.top && s.clientY < f) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (s.clientY >= f && s.clientY <= r.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, b.prototype._handlePointerEnd = function(s) {
    if (!this._dragging) return;
    const a = this._dragging, c = Array.from(this.dom.children), n = c.indexOf(a);
    let r = null, f = null;
    for (const d of c) {
      if (d.classList.contains("ln-sortable--drop-before")) {
        r = d, f = "before";
        break;
      }
      if (d.classList.contains("ln-sortable--drop-after")) {
        r = d, f = "after";
        break;
      }
    }
    for (const d of c)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (a.classList.remove("ln-sortable--dragging"), a.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), r && r !== a) {
      f === "before" ? this.dom.insertBefore(a, r) : this.dom.insertBefore(a, r.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(a);
      q(this.dom, "ln-sortable:reordered", {
        item: a,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function m(s) {
    const a = s[e];
    if (!a) return;
    const c = s.getAttribute(t) !== "disabled";
    c !== a.isEnabled && (a.isEnabled = c, q(s, c ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: s }));
  }
  j(t, e, b, "ln-sortable", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", o = "data-ln-picklist-list", h = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-picklist": { effect: a },
    "data-ln-picklist-max": { effect: c },
    "data-ln-picklist-list": {}
  };
  function m(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = s(n), this.available = n.querySelector("[" + o + '="available"]'), this.selected = n.querySelector("[" + o + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + o + '="available"] and [' + o + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const r of [this.available, this.selected])
      for (const f of r.children)
        this._initial.push(f);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), q(this.dom, "ln-picklist:destroyed", { target: this.dom }), delete this.dom[e]);
  }, m.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, m.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, m.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let f = 0; f < n.length; f++)
      this._initial.includes(n[f]) || this._initial.push(n[f]);
    let r = 0;
    for (let f = 0; f < this._initial.length; f++) {
      const d = this._initial[f];
      if (!d.isConnected) continue;
      const w = d.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || r < this.max ? (v = this.selected, r++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(d);
    }
  }, m.prototype._onFormReset = function(n) {
    const r = this;
    setTimeout(function() {
      r._destroyed || n.defaultPrevented || r.sync();
    }, 0);
  }, m.prototype._onChange = function(n) {
    const r = n.target.closest('input[type="checkbox"]');
    if (!r) return;
    const f = r.closest("li");
    if (!f) return;
    const d = f.parentElement;
    if (d !== this.available && d !== this.selected) return;
    if (!this.isEnabled) {
      r.checked = !r.checked;
      return;
    }
    const w = r.checked ? this.selected : this.available;
    if (d === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      r.checked = !r.checked, q(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: f,
        checkbox: r,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: f, from: d, to: w, checkbox: r };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      r.checked = !r.checked;
      return;
    }
    const S = document.activeElement === r;
    w.appendChild(f), S && r.focus(), q(this.dom, "ln-picklist:move", v);
  };
  function s(n) {
    const r = n.getAttribute(h);
    if (r === null || r === "") return null;
    const f = parseInt(r, 10);
    return isNaN(f) || f < 0 ? null : f;
  }
  function a(n) {
    const r = n[e];
    if (!r) return;
    const f = n.getAttribute(t) !== "disabled";
    f !== r.isEnabled && (r.isEnabled = f, q(n, f ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function c(n) {
    const r = n[e];
    r && (r.max = s(n));
  }
  j(t, e, m, "ln-picklist", {
    attributes: b
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", o = "data-ln-confirm-state", h = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function m(f, d, w) {
    return f.getAttribute(d) || w;
  }
  function s(f, d, w) {
    const v = parseFloat(f.getAttribute(d));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function a(f) {
    const d = document.createElement("span");
    return d.setAttribute(h, ""), d.setAttribute("role", "alert"), d.textContent = f, d;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", read: m, fallback: "Confirm?" },
    "data-ln-confirm-timeout": { prop: "timeout", read: s, fallback: 3 },
    "data-ln-confirm-state": { prop: "confirming", read: Kt }
  }, n = et(c);
  function r(f) {
    this.dom = f, tt(this, f, n), this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : f.textContent.trim();
    const d = this;
    return this._onClick = function(w) {
      if (!sn(w))
        if (!d.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), d._enterConfirm();
        else {
          if (d._submitted) return;
          d._submitted = !0, w.stopPropagation(), d._reset();
        }
    }, f.addEventListener("click", this._onClick), this;
  }
  r.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(o, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const f = this.activeEl ? this.activeEl.textContent.trim() : "";
      f && (this.dom.setAttribute("aria-label", f), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(a(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), q(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, r.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, d = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, d);
  }, r.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(o), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref);
      const d = this.dom.querySelector("[" + h + "]");
      d && d.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, r.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], q(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, j(t, e, r, "ln-confirm", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-translations": {},
    "data-ln-translations-default": { prop: "defaultLang", read: Q, fallback: "" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: Q, fallback: "{lang} translation" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: Q, fallback: "Remove {lang}" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: Q, fallback: "" },
    "data-ln-translations-active": {},
    "data-ln-translations-add": {},
    "data-ln-translations-lang": {},
    "data-ln-translations-prefix": {},
    "data-ln-translatable": {},
    "data-ln-translatable-lang": {}
  }, h = et(o), b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(s) {
    if (this.dom = s, tt(this, s, h), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = s.querySelector("[data-ln-translations-active]"), this.menuEl = s.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = b, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const a = this;
    return this._onRequestAdd = function(c) {
      c.detail && c.detail.lang && a.addLanguage(c.detail.lang);
    }, this._onRequestRemove = function(c) {
      c.detail && c.detail.lang && a.removeLanguage(c.detail.lang);
    }, s.addEventListener("ln-translations:request-add", this._onRequestAdd), s.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const a of s) {
      const c = a.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of c)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const s = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of s) {
      const c = a.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const s = this;
    let a = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      a++;
      const r = Jt("ln-translations-menu-item", "ln-translations");
      if (!r) return;
      const f = r.querySelector("[data-ln-translations-lang]");
      f.setAttribute("data-ln-translations-lang", n), f.textContent = this.locales[n], f.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), s.menuEl.getAttribute("data-ln-toggle") === "open" && s.menuEl.setAttribute("data-ln-toggle", "close"), s.addLanguage(n));
      }), this.menuEl.appendChild(r);
    }
    const c = this.dom.querySelector("[data-ln-translations-add]");
    c && (c.hidden = a === 0);
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const s = this;
    this.activeLanguages.forEach(function(a) {
      const c = Jt("ln-translations-badge", "ln-translations");
      if (!c) return;
      const n = c.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", a);
      const r = n.querySelector("span");
      r.textContent = s.locales[a] || a.toUpperCase();
      const f = n.querySelector("button"), d = s.locales[a] || a.toUpperCase();
      f.setAttribute("aria-label", s.removeLabel.replace("{lang}", d)), f.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), s.removeLanguage(a));
      }), s.badgesEl.appendChild(c);
    });
  }, m.prototype.addLanguage = function(s, a) {
    if (this.activeLanguages.has(s)) return;
    const c = this.locales[s] || s;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: s,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(s), a = a || {};
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of r) {
      const d = f.getAttribute("data-ln-translatable"), w = f.getAttribute("data-ln-translations-prefix") || "", v = f.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + s + "][" + d + "]" : S.name = "trans[" + s + "][" + d + "]", S.value = a[d] !== void 0 ? a[d] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", c)), S.setAttribute("data-ln-translatable-lang", s);
      const A = f.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), u = A.length > 0 ? A[A.length - 1] : v;
      u.parentNode.insertBefore(S, u.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), q(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: s,
      langName: c
    });
  }, m.prototype.removeLanguage = function(s) {
    if (!this.activeLanguages.has(s) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: s
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + s + '"]');
    for (const n of c)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(s), this._updateDropdown(), this._updateBadges(), q(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: s
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(s) {
    return this.activeLanguages.has(s);
  }, m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const s = this.defaultLang, a = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of a)
      c.getAttribute("data-ln-translatable-lang") !== s && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, m, "ln-translations", {
    attributes: o
  });
})();
const ri = "ln-autosave:", ii = 1e3;
function oi(t, e) {
  return e ? ri + (t || "") + ":" + e : null;
}
function si(t, e = ii) {
  if (t == null) return 0;
  if (t === "") return e;
  const o = parseInt(String(t), 10);
  return isNaN(o) || o < 0 ? e : o;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", o = "data-ln-autosave-clear", h = "data-ln-autosave-debounce-input", b = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-autosave": {},
    "data-ln-autosave-debounce-input": {},
    "data-ln-autosave-clear": {},
    "data-ln-autosave-exclude": {}
  };
  function s(c) {
    const n = c.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function a(c) {
    const r = c.getAttribute(t) || c.id, f = oi(window.location.pathname, r);
    if (!f) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = f;
    let d = null;
    function w() {
      const u = ln(c, { exclude: b });
      try {
        localStorage.setItem(f, JSON.stringify(u));
      } catch {
        return;
      }
      q(c, "ln-autosave:saved", { target: c, data: u });
    }
    function v() {
      let u;
      try {
        u = localStorage.getItem(f);
      } catch {
        return;
      }
      if (!u) return;
      let _;
      try {
        _ = JSON.parse(u);
      } catch {
        return;
      }
      if (Z(c, "ln-autosave:before-restore", { target: c, data: _ }).defaultPrevented) return;
      const i = cn(c, _);
      for (let p = 0; p < i.length; p++)
        i[p].dispatchEvent(new Event("input", { bubbles: !0 })), i[p].dispatchEvent(new Event("change", { bubbles: !0 }));
      q(c, "ln-autosave:restored", { target: c, data: _ });
    }
    function S() {
      try {
        localStorage.removeItem(f);
      } catch {
        return;
      }
      q(c, "ln-autosave:cleared", { target: c });
    }
    this._onFocusout = function(u) {
      const _ = u.target;
      s(_) && _.name && !_.matches(b) && w();
    }, this._onChange = function(u) {
      const _ = u.target;
      s(_) && _.name && !_.matches(b) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(u) {
      u.target.closest("[" + o + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = si(c.getAttribute(h));
    return A > 0 && (this._onInput = function(u) {
      const _ = u.target;
      !s(_) || !_.name || _.matches(b) || (d !== null && clearTimeout(d), d = setTimeout(w, A));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return d;
    }, v(), this;
  }
  a.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const c = this._getInputTimer();
        c !== null && clearTimeout(c);
      }
      q(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, a, "ln-autosave", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-autoresize": {}
  };
  function h(b) {
    if (b.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", b.tagName), this;
    this.dom = b;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, b.addEventListener("input", this._onInput), this._resize(), this;
  }
  h.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, h, "ln-autoresize", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-editor": {},
    "data-ln-editor-action": {},
    "data-ln-editor-source": {}
  }, h = {
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
  }, b = {
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
  }, s = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let a = 0;
  function c(u) {
    return !!(b[u] || m[u] || s[u] || u === "link");
  }
  function n(u) {
    this.dom = u;
    const _ = this;
    if (this._textarea = u.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", u), this;
    const l = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), l && this._surface.setAttribute("data-placeholder", l);
    const i = this._textarea.id;
    if (i) {
      const g = u.querySelector('label[for="' + i + '"]');
      g && (g.id || (g.id = i + "-label"), this._surface.setAttribute("aria-labelledby", g.id));
    }
    this._surface.id = i ? i + "-surface" : "ln-editor-surface-" + ++a;
    const p = this._textarea.value.trim();
    p && (this._surface.innerHTML = p);
    const y = u.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? u.insertBefore(this._surface, y.nextSibling) : u.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const g = y.querySelectorAll("[data-ln-editor-action]");
      for (let E = 0; E < g.length; E++) {
        const C = g[E].getAttribute("data-ln-editor-action");
        c(C) && g[E].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      _._syncToTextarea(), q(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      });
    }, this._onMousedownToolbar = function(g) {
      g.target.closest("[data-ln-editor-action]") && g.preventDefault();
    }, this._onClickToolbar = function(g) {
      const E = g.target.closest("[data-ln-editor-action]");
      if (!E) return;
      const C = E.getAttribute("data-ln-editor-action");
      _._execAction(C);
    }, this._onPaste = function(g) {
      d(_, g);
    }, this._onKeydown = function(g) {
      S(_, g);
    }, this._onSelectionChange = function() {
      document.contains(_._surface) && _._updateActiveStates();
    }, this._onFocus = function() {
      q(_.dom, "ln-editor:focus", { target: _.dom });
    }, this._onBlur = function() {
      _._syncToTextarea(), q(_.dom, "ln-editor:blur", { target: _.dom });
    }, this._onTextareaInput = function() {
      _._surface.innerHTML !== _._textarea.value && (_._surface.innerHTML = _._textarea.value, q(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(g) {
      const E = g.detail && g.detail.html;
      E !== void 0 && (_._surface.innerHTML = E, _._syncToTextarea(), q(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, u.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        _._surface.innerHTML = _._textarea.value, q(u, "ln-editor:changed", {
          html: _._textarea.value,
          target: u
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(u) {
    if (!(!u || Z(this.dom, "ln-editor:before-change", {
      action: u,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), b[u])
        document.execCommand(b[u], !1, null);
      else if (m[u]) {
        const l = m[u], i = r(this._surface);
        i && i.toLowerCase() === l ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + l + ">");
      } else s[u] ? document.execCommand(s[u], !1, null) : u === "link" ? A(this) : u === "unlink" ? document.execCommand("unlink", !1, null) : u === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const u = this.dom.querySelector('[role="toolbar"]');
    if (!u) return;
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const l = _.anchorNode;
    if (!l || !this._surface.contains(l)) return;
    const i = u.querySelectorAll("[data-ln-editor-action]");
    for (let p = 0; p < i.length; p++) {
      const y = i[p], T = y.getAttribute("data-ln-editor-action");
      let g = !1;
      if (b[T])
        try {
          g = document.queryCommandState(b[T]);
        } catch {
        }
      else if (m[T]) {
        const E = r(this._surface);
        g = E && E.toLowerCase() === m[T];
      } else if (s[T])
        try {
          g = document.queryCommandState(s[T]);
        } catch {
        }
      else T === "link" && (g = !!f(_.anchorNode, "A", this._surface));
      c(T) && y.setAttribute("aria-pressed", String(g)), g ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(u) {
    this._surface && (this._surface.innerHTML = u, this._syncToTextarea(), q(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const u = this.dom.querySelector('[role="toolbar"]');
    u && (u.removeEventListener("mousedown", this._onMousedownToolbar), u.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const _ = this._textarea ? this._textarea.form : null;
    if (_ && this._onFormReset && _.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const l = this.dom.querySelector(".ln-editor__link-popover");
      l && l.remove();
    }
    q(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function r(u) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return null;
    let l = _.anchorNode;
    if (!l) return null;
    for (; l && l !== u; ) {
      if (l.nodeType === 1) {
        const i = l.tagName;
        if (i === "H2" || i === "H3" || i === "H4" || i === "BLOCKQUOTE" || i === "PRE" || i === "P")
          return i;
      }
      l = l.parentNode;
    }
    return null;
  }
  function f(u, _, l) {
    for (; u && u !== l; ) {
      if (u.nodeType === 1 && u.tagName === _)
        return u;
      u = u.parentNode;
    }
    return null;
  }
  function d(u, _) {
    _.preventDefault();
    let l = "";
    if (_.clipboardData && (l = _.clipboardData.getData("text/html"), !l)) {
      const p = _.clipboardData.getData("text/plain");
      p && (l = p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), l = "<p>" + l + "</p>");
    }
    if (!l) return;
    const i = w(l);
    i && document.execCommand("insertHTML", !1, i);
  }
  function w(u) {
    const _ = document.createElement("div");
    return _.innerHTML = u, v(_), _.innerHTML;
  }
  function v(u) {
    const _ = Array.from(u.childNodes);
    for (let l = 0; l < _.length; l++) {
      const i = _[l];
      if (i.nodeType !== 3) {
        if (i.nodeType !== 1) {
          u.removeChild(i);
          continue;
        }
        if (h[i.tagName]) {
          const p = Array.from(i.attributes);
          for (let y = 0; y < p.length; y++) {
            const T = p[y].name;
            if (i.tagName === "A" && T === "href") {
              const g = i.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(g) || i.removeAttribute("href");
            } else
              i.removeAttribute(T);
          }
          i.tagName === "A" && i.setAttribute("rel", "noopener noreferrer"), v(i);
        } else {
          for (; i.firstChild; )
            u.insertBefore(i.firstChild, i);
          u.removeChild(i);
        }
      }
    }
  }
  function S(u, _) {
    if (!(_.ctrlKey || _.metaKey)) return;
    let l = null;
    switch (_.key.toLowerCase()) {
      case "b":
        l = "bold";
        break;
      case "i":
        l = "italic";
        break;
      case "u":
        l = "underline";
        break;
      case "k":
        l = "link";
        break;
    }
    l && (_.preventDefault(), u._execAction(l));
  }
  function A(u) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const l = f(_.anchorNode, "A", u._surface), i = _.getRangeAt(0).cloneRange();
    u._closeLinkPopover && u._closeLinkPopover();
    const p = Tt(u.dom, "ln-editor-link-popover", "ln-editor");
    if (!p) return;
    const y = p.firstElementChild;
    if (!y) return;
    const T = y.querySelector('input[type="url"]'), g = y.querySelector('[data-ln-editor-action="confirm-link"]'), E = y.querySelector('[data-ln-editor-action="cancel-link"]');
    l && (T.value = l.getAttribute("href") || "");
    const C = u.dom.querySelector('[role="toolbar"]');
    C ? C.after(y) : u.dom.insertBefore(y, u._surface), T.focus();
    function k() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(i);
    }
    function D() {
      document.removeEventListener("mousedown", P), u._closeLinkPopover = null, y.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), k(), u._surface.focus(), B)
        if (l)
          l.setAttribute("href", B), l.setAttribute("rel", "noopener noreferrer"), u._syncToTextarea(), q(u.dom, "ln-editor:changed", {
            html: u._textarea.value,
            target: u.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = f(U.anchorNode, "A", u._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), u._syncToTextarea());
          }
        }
      else l && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), k(), u._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const U = u.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !y.contains(B.target) && !U && O();
    }
    u._closeLinkPopover = D, g.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), I()) : B.key === "Escape" && (B.preventDefault(), R());
    }), document.addEventListener("mousedown", P);
  }
  j(t, e, n, "ln-editor", {
    attributes: o
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function o(b) {
    const m = {}, s = b.dataset;
    for (const a in s) {
      if (!a.startsWith("lnFill") || e[a]) continue;
      const c = a.slice(6);
      c && (m[c.charAt(0).toLowerCase() + c.slice(1)] = s[a]);
    }
    return m;
  }
  function h(b, m) {
    const s = window.CSS && CSS.escape ? CSS.escape(m) : m, a = document.querySelectorAll('[data-ln-fill-id="' + s + '"]');
    if (a.length === 0) return null;
    for (let c = 0; c < a.length; c++) {
      const n = a[c].getAttribute("data-ln-fill-form");
      if (n) {
        const r = document.getElementById(n);
        if (r && b.contains(r)) return a[c];
      }
    }
    return a[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const m = b.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const s = m.getAttribute("href");
    if (s && s.indexOf("#") !== -1) return;
    const a = m.getAttribute("data-ln-fill-form"), c = document.getElementById(a);
    if (!c) return;
    const n = o(m), r = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, r ? n : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const m = b.detail;
    if (!m) return;
    const s = b.target, a = m.id;
    if (a == null) {
      window.lnCore.lnFill(s, null);
      return;
    }
    const c = h(s, a);
    if (!c) return;
    const n = o(c);
    window.lnCore.lnFill(s, n);
  }), window[t] = !0;
})();
function ai(t, e = "-") {
  if (t == null) return "";
  const o = e || "-", h = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, o).replace(new RegExp(`${h}+`, "g"), o).replace(new RegExp(`^${h}+|${h}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-slug-from": { prop: "sourceName", read: Q, fallback: "" }
  }, h = et(o);
  function b(m) {
    if (m.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", m.tagName), this;
    const s = m.form;
    if (!s)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", m), this;
    tt(this, m, h);
    const a = s.elements[this.sourceName];
    if (!a)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', m), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', m), this;
    this.dom = m, this.source = a, this._pristine = m.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, a.addEventListener("input", this._onSource), m.addEventListener("input", this._onSlug), this._pristine && a.value && a.value.trim() !== "" && this._mirror(), this;
  }
  b.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = ai(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, b, "ln-slug", {
    attributes: o
  });
})();
function li(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const o = typeof e == "number" ? e : e.getTime(), h = t.getTime(), b = Math.floor((h - o) / 1e3), m = Math.abs(b);
  return m < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : m < 60 ? { value: b, unit: "second", isOlderThanMonth: !1 } : m < 3600 ? { value: Math.round(b / 60), unit: "minute", isOlderThanMonth: !1 } : m < 86400 ? { value: Math.round(b / 3600), unit: "hour", isOlderThanMonth: !1 } : m < 604800 ? { value: Math.round(b / 86400), unit: "day", isOlderThanMonth: !1 } : m < 2592e3 ? { value: Math.round(b / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(b / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Qt(t, e, o = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const h = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== o.getFullYear() && (h.year = "numeric"), h;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-time": { effect: i },
    "data-ln-time-locale": { effect: i }
  }, h = {}, b = {};
  function m(y) {
    return y.getAttribute("data-ln-time-locale") || rt(y);
  }
  function s(y, T) {
    const g = (y || "") + "|" + JSON.stringify(T);
    return h[g] || (h[g] = new Intl.DateTimeFormat(y, T)), h[g];
  }
  function a(y) {
    const T = y || "";
    return b[T] || (b[T] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), b[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function r() {
    n || (n = setInterval(d, 6e4));
  }
  function f() {
    n && (clearInterval(n), n = null);
  }
  function d() {
    for (const y of c) {
      if (!document.body.contains(y.dom)) {
        c.delete(y);
        continue;
      }
      _(y);
    }
    c.size === 0 && f();
  }
  function w(y, T) {
    const g = kt(T), E = (T || "").toLowerCase().split("-")[0], C = s(T, Qt("full", y)), k = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (g && k !== E && g.monthsLong) {
      const D = g.monthsLong[y.getMonth()], I = y.getDate(), R = y.getFullYear(), O = String(y.getHours()).padStart(2, "0"), P = String(y.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(y);
  }
  function v(y, T) {
    const g = Qt("short", y), E = kt(T), C = (T || "").toLowerCase().split("-")[0], k = s(T, g), D = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[y.getMonth()], R = y.getDate(), O = g.year ? " " + y.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return k.format(y);
  }
  function S(y, T) {
    return s(T, Qt("date", y)).format(y);
  }
  function A(y, T) {
    return s(T, Qt("time", y)).format(y);
  }
  function u(y, T) {
    const g = li(y);
    return g.isOlderThanMonth ? v(y, T) : a(T).format(g.value, g.unit);
  }
  function _(y) {
    const T = y.dom.getAttribute("datetime");
    if (!T) return;
    const g = st(T);
    if (!g) return;
    const E = y.dom.getAttribute(t) || "short", C = m(y.dom);
    let k;
    switch (E) {
      case "relative":
        k = u(g, C);
        break;
      case "full":
        k = w(g, C);
        break;
      case "date":
        k = S(g, C);
        break;
      case "time":
        k = A(g, C);
        break;
      default:
        k = v(g, C);
        break;
    }
    y.dom.textContent = k, E !== "full" && (y.dom.title = w(g, C));
  }
  function l(y) {
    this.dom = y;
    const T = this;
    return this._onLocaleChange = function() {
      _(T);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), _(this), y.getAttribute(t) === "relative" && (c.add(this), r()), this;
  }
  l.prototype.render = function() {
    _(this);
  }, l.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), c.delete(this), c.size === 0 && f(), delete this.dom[e];
  };
  function i(y) {
    const T = y[e];
    if (!T) return;
    y.getAttribute(t) === "relative" ? (c.add(T), r()) : (c.delete(T), c.size === 0 && f()), _(T);
  }
  function p(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && _(y[e]);
  }
  j(t, e, l, "ln-time", {
    attributes: o,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i,
    onInit: p
  });
})();
function ci(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, o = t.pageSize > 0 ? t.pageSize : 200, h = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const b = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, m = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let a = 0, c = 0, n = 0, r = !1, f = null;
  function d(S, A) {
    m.delete(S), m.set(S, A);
  }
  function w() {
    if (m.size <= e) return [];
    const S = [];
    for (; m.size > e; ) {
      const u = m.keys().next().value;
      S.push(m.get(u)), m.delete(u);
    }
    const A = new Set(m.values());
    return S.filter((u) => !A.has(u));
  }
  function v(S, A) {
    s.add(S), clearTimeout(f), f = setTimeout(() => b(S, o, A), h);
  }
  return {
    get logicalTotal() {
      return a;
    },
    set logicalTotal(S) {
      a = S;
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
      return m.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return r;
    },
    getId: (S) => {
      if (!m.has(S)) return;
      const A = m.get(S);
      return d(S, A), A;
    },
    ensure: (S, A, u) => {
      if (!r && !s.has(0)) return v(0, u);
      if (a <= 0) return;
      const _ = Math.max(0, S), l = Math.min(a, A);
      for (let i = _; i < l; i++)
        if (!m.has(i)) {
          const p = Math.floor(i / o) * o;
          if (!s.has(p)) return v(p, u);
        }
    },
    ingest: (S, A, u, _, l) => {
      if (l != null && l !== n) return [];
      r = !0, u != null && (c = u), _ != null && (a = _);
      for (let i = 0; i < A.length; i++)
        d(S + i, A[i]);
      return s.delete(S), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      r = !1, m.clear(), s.clear(), clearTimeout(f);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (S = {}) => {
      let A = [];
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (o = S.pageSize), S.fetchDebounce >= 0 && (h = S.fetchDebounce), A;
    }
  };
}
function di(t, e, o) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: h, direction: b } = e, m = b === "desc", s = t.map((c) => c ? c[h] : void 0), a = Ce(s);
  return [...t].sort((c, n) => {
    const r = c ? c[h] : void 0, f = n ? n[h] : void 0, d = Te(r, f, a, o);
    return m ? -d : d;
  });
}
function Kn(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const o = Object.keys(e).filter((h) => Array.isArray(e[h]) && e[h].length > 0);
  return o.length ? t.filter((h) => h ? o.every((b) => xe(h[b], e[b])) : !1) : t;
}
function ui(t, e, o) {
  if (!Array.isArray(t) || !e || !o || !o.length) return t;
  const h = Tn(e);
  return h.length ? t.filter((b) => b ? h.every(
    (m) => o.some((s) => {
      const a = b[s];
      return a != null && Ln(String(a), [m]);
    })
  ) : !1) : t;
}
function hi(t, e, o) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (o === "count") return t.length;
  const h = t.map((m) => m && m[e] != null ? parseFloat(m[e]) : NaN).filter((m) => Number.isFinite(m)), b = h.reduce((m, s) => m + s, 0);
  return o === "sum" ? b : o === "avg" && h.length ? b / h.length : 0;
}
function fi(t, e = {}, o = [], h) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const b = t.length;
  let m = t;
  e.filters && (m = Kn(m, e.filters)), e.search && (m = ui(m, e.search, o));
  const s = m.length;
  if (e.sort && (m = di(m, e.sort, h)), e.offset || e.limit) {
    const a = e.offset || 0, c = e.limit || m.length;
    m = m.slice(a, a + c);
  }
  return { records: m, total: b, filtered: s };
}
function pi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((o) => {
    if (!o) return null;
    const h = { ...o };
    for (const [b, m] of Object.entries(e))
      if (typeof m == "function")
        try {
          h[b] = m(o);
        } catch {
          h[b] = void 0;
        }
    return h;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function o(L, x, M) {
    const N = L.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const h = {
    "data-ln-data-store": { effect: Me },
    "data-ln-data-store-indexes": { effect: Me },
    "data-ln-data-store-stale": { prop: "_staleThreshold", read: o, fallback: 300 },
    "data-ln-data-store-search-fields": { prop: "_searchFields", read: rr },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", read: Kt },
    "data-ln-data-store-window": { prop: "_windowSize", read: Dt, fallback: 1e3, effect: er },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", read: Dt, fallback: 200, effect: nr },
    "data-ln-data-store-frozen": {}
  }, b = et(h), m = "ln_app_cache", s = "_meta", a = "1.0";
  let c = null, n = null;
  const r = {};
  function f(L) {
    L && L.name === "QuotaExceededError" && q(document, "ln-data-store:quota-exceeded", { error: L });
  }
  function d() {
    const L = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const M = x.id;
      if (M) {
        const N = x.getAttribute("data-ln-data-store-indexes") || "";
        L[M] = {
          indexes: N.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return L;
  }
  function w() {
    return n || (n = new Promise((L) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), L(null);
      const x = d(), M = Object.keys(x), N = indexedDB.open(m);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), L(null);
      }, N.onsuccess = (F) => {
        const H = F.target.result, K = Array.from(H.objectStoreNames);
        if (!(!K.includes(s) || M.some((ft) => !K.includes(ft))))
          return v(H), c = H, L(H);
        const J = H.version;
        H.close();
        const nt = indexedDB.open(m, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), L(null);
        }, nt.onupgradeneeded = (ft) => {
          const at = ft.target.result;
          at.objectStoreNames.contains(s) || at.createObjectStore(s, { keyPath: "key" });
          for (const Lt of M)
            if (!at.objectStoreNames.contains(Lt)) {
              const Mt = at.createObjectStore(Lt, { keyPath: "id" });
              for (const ce of x[Lt].indexes)
                Mt.createIndex(ce, ce, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const at = ft.target.result;
          v(at), c = at, L(at);
        };
      };
    }), n);
  }
  function v(L) {
    L.onversionchange = () => {
      L.close(), c = null, n = null;
    };
  }
  function S() {
    return c ? Promise.resolve(c) : (n = null, w());
  }
  async function A(L) {
    if (!At() || !L) return L;
    const x = { ...L }, M = x.id, N = await vr(x);
    return !N || !N.encrypted ? L : {
      id: M,
      encrypted: !0,
      iv: N.iv,
      data: N.data
    };
  }
  async function u(L) {
    return !L || !L.encrypted || !At() ? L : wr(L);
  }
  const _ = (L, x) => S().then((M) => M ? M.transaction(L, x).objectStore(L) : null);
  function l(L) {
    return new Promise((x, M) => {
      L.onsuccess = () => x(L.result), L.onerror = () => {
        f(L.error), M(L.error);
      };
    });
  }
  const i = (L) => _(L, "readonly").then((x) => x ? l(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => u(M))) : x), p = (L, x) => _(L, "readonly").then((M) => M ? l(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? l(M.get(Number(x))) : typeof x == "number" ? l(M.get(String(x))) : null) : null).then((M) => M ? u(M) : null), y = (L, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(L, "readonly").objectStore(L), H = x.map((K) => l(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? l(F.get(Number(K))) : typeof K == "number" ? l(F.get(String(K))) : null));
    return Promise.all(H).then((K) => At() ? Promise.all(K.map((W) => W ? u(W) : null)) : K);
  }), T = (L, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => _(L, "readwrite").then((F) => F ? l(F.put(N)) : null)), g = (L, x) => _(L, "readwrite").then((M) => M ? l(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return l(M.delete(Number(x)));
    if (typeof x == "number")
      return l(M.delete(String(x)));
  }) : null), E = (L) => _(L, "readwrite").then((x) => x ? l(x.clear()) : null), C = (L) => _(L, "readonly").then((x) => x ? l(x.count()) : 0), k = (L) => _(s, "readonly").then((x) => x ? l(x.get(L)) : null), D = (L, x) => _(s, "readwrite").then((M) => {
    if (M)
      return x.key = L, l(M.put(x));
  });
  function I(L) {
    return this.dom = L, this._name = L.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", L), tt(this, L, b), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, L.hasAttribute("data-ln-data-store-window") ? this._windowIndex = ci({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, M, N) => {
        q(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: M,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), r[this._name] = this, R(this), this.ready = Y(this), this;
  }
  function R(L) {
    L._handlers = {
      create: (x) => O(L, "create", x.detail, () => B(L, x.detail)),
      update: (x) => O(L, "update", x.detail, () => U(L, x.detail)),
      delete: (x) => O(L, "delete", x.detail, () => z(L, x.detail)),
      "bulk-delete": (x) => O(L, "bulk-delete", x.detail, () => $(L, x.detail)),
      "sync-failed": (x) => {
        L.isSyncing = !1, q(L.dom, "ln-data-store:sync-error", {
          store: L._name,
          error: x.detail && x.detail.error,
          status: x.detail && x.detail.status
        });
      }
    };
    for (const [x, M] of Object.entries(L._handlers))
      L.dom.addEventListener(`ln-data-store:request-${x}`, M);
    L._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.term != null ? x.detail.term : "";
        M !== L.query.search && (L.query.search = M, le(L));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.key;
        if (!M) return;
        const N = (x.detail.values || []).slice(), F = L.query.filters[M];
        (F ? F.length === N.length && F.every((K, W) => K === N[W]) : !N.length) || (N.length ? L.query.filters[M] = N : delete L.query.filters[M], le(L));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.field, N = x.detail && x.detail.direction, F = N && N !== "none" ? { field: M, direction: N } : null, H = L.query.sort;
        !H && !F || H && F && H.field === F.field && H.direction === F.direction || (L.query.sort = F, le(L));
      }
    };
    for (const [x, M] of Object.entries(L._queryHandlers))
      L.dom.addEventListener(x, M);
  }
  function O(L, x, M, N) {
    const F = M && M.requestId;
    return L._mutationChain = L._mutationChain.then(() => L.ready).then(() => {
      if (L.initializationError) throw L.initializationError;
      return N();
    }).catch((H) => X(L, x, F, H)), L._mutationChain;
  }
  function P(L, x = 0) {
    return C(L._name).then((M) => {
      if (L._windowIndex || L.windowed) {
        const N = L.totalCount != null ? L.totalCount : M;
        L.totalCount = Math.max(0, N + x);
      } else
        L.totalCount = M;
      return L.hasCache = !0, L.isLoaded = !0, L.canServe = !0, D(L._name, {
        schema_version: a,
        last_synced_at: L.lastSyncedAt,
        has_cache: !0,
        record_count: L.totalCount
      });
    });
  }
  function B(L, { tempId: x, data: M = {}, requestId: N } = {}) {
    const F = { ...M, id: x };
    return T(L._name, F).then(() => P(L, 1)).then(() => {
      q(L.dom, "ln-data-store:created", { store: L._name, record: F, tempId: x, requestId: N });
    });
  }
  function U(L, { id: x, data: M = {}, requestId: N } = {}) {
    return p(L._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const H = F.id, K = { ...F, ...M, id: H }, W = M.id, J = W !== void 0 && W !== H;
      return (J ? bt(L._name, H, { ...K, id: W }) : T(L._name, K)).then(() => P(L, 0)).then(() => {
        q(L.dom, "ln-data-store:updated", { store: L._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(L, { id: x, requestId: M } = {}) {
    return p(L._name, x).then((N) => {
      if (!N) {
        q(L.dom, "ln-data-store:deleted", { store: L._name, id: x, requestId: M, missing: !0 });
        return;
      }
      const F = N.id;
      return g(L._name, F).then(() => P(L, -1)).then(() => {
        q(L.dom, "ln-data-store:deleted", { store: L._name, id: F, requestId: M });
      });
    });
  }
  function $(L, { ids: x = [], requestId: M } = {}) {
    return x.length ? Promise.all(x.map((N) => p(L._name, N))).then((N) => {
      const F = N.filter(Boolean).map((H) => H.id);
      return ht(L._name, F).then(() => P(L, -F.length)).then(() => {
        q(L.dom, "ln-data-store:deleted", { store: L._name, ids: F, requestId: M });
      });
    }) : (q(L.dom, "ln-data-store:deleted", { store: L._name, ids: [], requestId: M }), Promise.resolve());
  }
  function X(L, x, M, N) {
    console.error("[ln-data-store] " + x + " failed:", N), q(L.dom, "ln-data-store:mutation-error", {
      store: L._name,
      action: x,
      requestId: M,
      error: N
    });
  }
  function Y(L) {
    return w().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return k(L._name);
    }).then((x) => {
      if (L.initializationError = null, x && x.schema_version === a)
        L.lastSyncedAt = x.last_synced_at || null, L.totalCount = x.record_count || 0, L.hasCache = x.has_cache === !0 || L.totalCount > 0, L.hasCache && (L.isLoaded = !0, L.canServe = !0, q(L.dom, "ln-data-store:ready", { store: L._name, count: L.totalCount, source: "cache" })), L.isInitialized = !0, q(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: L.hasCache, lastSyncedAt: L.lastSyncedAt, count: L.totalCount });
      else {
        if (x && x.schema_version !== a)
          return E(L._name).then(() => D(L._name, { schema_version: a, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            L.isInitialized = !0, L.hasCache = !1, q(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        L.isInitialized = !0, L.hasCache = !1, q(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (L.isInitialized = !0, L.isLoaded = !1, L.canServe = !1, L.hasCache = !1, L.isSyncing = !1, L.initializationError = x, q(L.dom, "ln-data-store:initialization-error", { store: L._name, error: x }), { ok: !1, error: x }));
  }
  function V(L) {
    L.isSyncing = !0, q(L.dom, "ln-data-store:request-remote-sync", { since: L.lastSyncedAt });
  }
  function G(L, x) {
    return S().then((M) => M ? (At() ? Promise.all(x.map((F) => A(F))) : Promise.resolve(x)).then((F) => new Promise((H, K) => {
      const W = M.transaction(L, "readwrite"), J = W.objectStore(L);
      F.forEach((nt) => J.put(nt)), W.oncomplete = () => H(), W.onerror = () => {
        f(W.error), K(W.error);
      };
    })) : void 0);
  }
  function ht(L, x) {
    return S().then((M) => {
      if (M)
        return new Promise((N, F) => {
          const H = M.transaction(L, "readwrite"), K = H.objectStore(L);
          x.forEach((W) => {
            K.delete(W), typeof W == "string" && W.trim() !== "" && !isNaN(Number(W)) ? K.delete(Number(W)) : typeof W == "number" && K.delete(String(W));
          }), H.oncomplete = () => N(), H.onerror = () => F(H.error);
        });
    });
  }
  function bt(L, x, M) {
    return (At() ? A(M) : Promise.resolve(M)).then((F) => S().then((H) => {
      if (H)
        return new Promise((K, W) => {
          const J = H.transaction(L, "readwrite"), nt = J.objectStore(L);
          nt.put(F), nt.delete(x), J.oncomplete = () => K(), J.onerror = () => {
            f(J.error), W(J.error);
          };
        });
    }));
  }
  const ae = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Wn(L) {
    return L ? Object.keys(L).filter((x) => Array.isArray(L[x]) && L[x].length > 0) : [];
  }
  function Gn(L, x, M) {
    return x.every((N) => M[N].map(String).includes(String(L[N])));
  }
  function Qn(L) {
    return String(L || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function $n(L, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const H = L[F];
        return H != null && String(H).toLowerCase().includes(N);
      })
    );
  }
  function Yn(L, x, M) {
    return hi(L, x, M);
  }
  function Ot(L, x) {
    return pi(x, L.presenters && L.presenters.computed);
  }
  function Xn(L) {
    return !L.sort && !At();
  }
  function Jn(L, x, M) {
    const N = Wn(x.filters), F = x.search ? Qn(x.search) : [], H = L._searchFields, K = F.length > 0 && H && H.length > 0;
    return _(L._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ft = [], at = W.openCursor();
      at.onsuccess = () => {
        const Lt = at.result;
        if (!Lt || ft.length >= M) {
          J(ft);
          return;
        }
        const Mt = Lt.value;
        (!N.length || Gn(Mt, N, x.filters)) && (!K || $n(Mt, F, H)) && ft.push(Mt), Lt.continue();
      }, at.onerror = () => nt(at.error);
    }) : []);
  }
  function Re(L, x, M) {
    return fi(x, M, L._searchFields, ae);
  }
  function Oe(L, x, M) {
    const N = [];
    for (let H = x; H < x + M; H++) {
      const K = L._windowIndex.getId(H);
      N.push(K);
    }
    const F = Array.from(new Set(N.filter((H) => H !== void 0)));
    return y(L._name, F).then((H) => {
      const K = /* @__PURE__ */ new Map();
      for (let J = 0; J < H.length; J++) {
        const nt = H[J];
        nt && K.set(String(nt.id), nt);
      }
      const W = [];
      for (let J = 0; J < N.length; J++) {
        const nt = N[J];
        if (nt === void 0)
          W.push(null);
        else {
          const ft = K.get(String(nt));
          W.push(ft || null);
        }
      }
      return {
        data: Ot(L, W),
        total: L._windowIndex.grandTotal,
        filtered: L._windowIndex.logicalTotal,
        offset: x,
        queryGen: L._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(L = {}) {
    const x = this;
    if (x._windowIndex) {
      const M = L.offset || 0, N = L.limit || 200;
      if (x._windowIndex.ensure(M, M + N, L), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const F = M + N, H = (K) => K.length ? {
          data: Ot(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Oe(x, M, N);
        return Xn(L) ? Jn(x, L, F).then((K) => H(K.slice(M, F))) : i(x._name).then((K) => H(Re(x, K, L).records));
      }
      return Oe(x, M, N);
    }
    return i(x._name).then((M) => {
      const N = Re(x, M, L);
      return {
        data: Ot(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(L) {
    return p(this._name, L).then((x) => x ? Ot(this, [x])[0] : null);
  }, I.prototype.count = function(L) {
    return L && Object.keys(L).length > 0 ? i(this._name).then((M) => Kn(M, L).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(L, x) {
    return i(this._name).then((M) => Yn(M, L, x));
  }, I.prototype.setPresenters = function(L) {
    this.presenters = L;
  }, I.prototype.applySync = function(L, x, M, N) {
    N = N || {};
    const F = this;
    if (F._windowIndex && N.queryGen != null && N.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    L.length > 0 || x.length > 0;
    let H = Promise.resolve();
    return L.length > 0 && (H = H.then(() => G(F._name, L))), x.length > 0 && (H = H.then(() => ht(F._name, x))), H.then(() => {
      if (F._windowIndex && (N.offset != null || N.total != null)) {
        const K = N.offset != null ? N.offset : 0, W = L.map((nt) => nt.id), J = F._windowIndex.ingest(K, W, N.total, N.filtered, N.queryGen);
        if (J && J.length) return ht(F._name, J);
      }
    }).then(() => C(F._name)).then((K) => (F.totalCount = N.total !== void 0 ? N.total : K, F.hasCache = !0, D(F._name, {
      schema_version: a,
      last_synced_at: M,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const K = !F.isLoaded;
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = M, K ? (q(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: N }), q(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: N })) : q(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: L.length,
        deleted: x.length,
        changed: !0,
        meta: N
      });
    }).catch((K) => {
      F.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, I.prototype.applyQuery = function(L, x) {
    x = x || {};
    const M = this;
    let N = Promise.resolve();
    return L.length > 0 && (N = N.then(() => G(M._name, L))), N.then(() => C(M._name)).then((F) => (M.totalCount = x.total !== void 0 ? x.total : F, L.length > 0 && (M.canServe = !0), Ot(M, L))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const L = this;
    return E(L._name).then(() => D(L._name, {
      schema_version: a,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      L.isLoaded = !1, L.hasCache = !1, L.lastSyncedAt = null, L.totalCount = 0, V(L);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [L, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${L}`, x);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [L, x] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(L, x);
      this._queryHandlers = null;
    }
    delete r[this._name], delete this.dom[e], q(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Zn() {
    return S().then((L) => {
      if (!L) return;
      const x = Array.from(L.objectStoreNames);
      return new Promise((M, N) => {
        const F = L.transaction(x, "readwrite");
        x.forEach((H) => F.objectStore(H).clear()), F.oncomplete = () => M(), F.onerror = () => N(F.error);
      });
    }).then(() => {
      Object.values(r).forEach((L) => {
        L.isLoaded = !1, L.canServe = !1, L.isInitialized = !1, L.initializationError = null, L.hasCache = !1, L.isSyncing = !1, L.lastSyncedAt = null, L.totalCount = 0;
      });
    });
  }
  function le(L) {
    L._windowIndex && L._windowIndex.reset(), q(L.dom, "ln-data-store:query-changed", {
      store: L._name,
      query: {
        filters: Object.assign({}, L.query.filters),
        search: L.query.search,
        sort: L.query.sort ? Object.assign({}, L.query.sort) : null
      }
    });
  }
  const tr = "data-ln-data-store-frozen";
  function Me(L, x) {
    L.setAttribute(tr, x);
  }
  function er(L) {
    const x = L[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ht(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function nr(L) {
    const x = L[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: h
  }), window[e].clearAll = Zn, window[e].init = window[e], window[e].setStorageKey = Pe, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Pe);
})();
const mi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function qt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, o) => {
    const h = String(e);
    return o === 0 ? h.replace(/\/+$/, "") : h.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function gi(t, e) {
  if (!t || typeof t != "object") return "";
  const o = Object.assign({}, mi);
  if (e && typeof e == "object")
    for (const b in e)
      e[b] !== void 0 && e[b] !== null && e[b] !== "" && (o[b] = e[b]);
  const h = new URLSearchParams();
  return t.search && h.append(o.search, t.search), t.offset != null && h.append(o.offset, t.offset), t.limit != null && h.append(o.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (h.append(o.sortField, t.sort.field), h.append(o.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((b) => {
    const m = t.filters[b];
    Array.isArray(m) && m.length > 0 && h.append(b, m.join(","));
  }), h.toString();
}
function _i(t, e, o) {
  let h = qt(t, e);
  return o && (h += (h.indexOf("?") !== -1 ? "&" : "?") + o), h;
}
function Je(t) {
  const e = t && t.content !== void 0 ? t.content : t, o = t && t.message ? t.message : null;
  return { record: e, message: o };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", o = "lnConnector";
  if (window[e] !== void 0) return;
  function h(n) {
    const r = n[e];
    r && r.refreshConfig();
  }
  const b = {
    "data-ln-api-connector": {},
    "data-ln-api-base-url": { prop: "baseUrl", read: Q, fallback: "", effect: h },
    "data-ln-api-path": { prop: "path", read: Q, fallback: "", effect: h },
    "data-ln-api-headers": { prop: "rawHeaders", read: Q, fallback: null, effect: h },
    "data-ln-api-param-offset": { effect: h },
    "data-ln-api-param-limit": { effect: h },
    "data-ln-api-param-search": { effect: h },
    "data-ln-api-param-sort-field": { effect: h },
    "data-ln-api-param-sort-dir": { effect: h },
    "data-ln-api-connector-query-debounce": { effect: h }
  }, m = et(b);
  function s(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((r) => {
      const f = new Error("HTTP " + n.status + ": " + n.statusText);
      throw f.status = n.status, f.data = r, f;
    });
  }
  function a(n) {
    return this.dom = n, tt(this, n, m), n[e] = this, n[o] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  a.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = _n(this.rawHeaders);
    const r = {}, f = n.getAttribute("data-ln-api-param-offset");
    f && (r.offset = f);
    const d = n.getAttribute("data-ln-api-param-limit");
    d && (r.limit = d);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (r.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (r.sortField = v);
    const S = n.getAttribute("data-ln-api-param-sort-dir");
    S && (r.sortDir = S), this.paramKeys = r;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, q(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, a.prototype._reqHeaders = function(n) {
    const r = Object.assign({}, this.headers);
    return !r.Accept && !r.accept && (r.Accept = "application/json"), !r["Content-Type"] && !r["content-type"] && (r["Content-Type"] = "application/json"), n && (r["X-Idempotency-Key"] = n), r;
  }, a.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, a.prototype.fetchDelta = function(n, r) {
    const f = this;
    let d = qt(f.baseUrl, f.path);
    n != null && n !== "" && (d += (d.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = r || "sync";
    f._inflight.has(w) && f._inflight.get(w).abort();
    const v = new AbortController();
    return f._inflight.set(w, v), window.fetch(d, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: v.signal
    }).then(s).finally(function() {
      f._inflight.get(w) === v && f._inflight.delete(w);
    });
  }, a.prototype.query = function(n, r) {
    const f = this, d = gi(n, f.paramKeys), w = _i(f.baseUrl, f.path, d), v = r || "query";
    f._inflight.has(v) && f._inflight.get(v).abort();
    const S = new AbortController();
    return f._inflight.set(v, S), window.fetch(w, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: S.signal
    }).then(s).finally(function() {
      f._inflight.get(v) === S && f._inflight.delete(v);
    });
  }, a.prototype.create = function(n, r, f) {
    const d = this;
    return window.fetch(qt(d.baseUrl, r || d.path), {
      method: "POST",
      headers: d._reqHeaders(f),
      credentials: d.credentials,
      body: JSON.stringify(n)
    }).then(s);
  }, a.prototype.update = function(n, r, f, d, w) {
    const v = this;
    f != null && (r = Object.assign({}, r, { expected_version: f }));
    const S = d ? qt(v.baseUrl, d) : qt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(r)
    }).then(s);
  }, a.prototype.delete = function(n, r, f) {
    const d = this;
    return window.fetch(qt(d.baseUrl, r || d.path, n), {
      method: "DELETE",
      headers: d._reqHeaders(f),
      credentials: d.credentials
    }).then(s);
  }, a.prototype.bulkDelete = function(n, r, f) {
    const d = this;
    return window.fetch(qt(d.baseUrl, r || d.path, "bulk-delete"), {
      method: "DELETE",
      headers: d._reqHeaders(f),
      credentials: d.credentials,
      body: JSON.stringify({ ids: n })
    }).then(s);
  };
  function c(n) {
    n._handlers = {
      sync: function(r) {
        const f = r.detail || {}, d = f.meta && f.meta.targetEl ? f.meta.targetEl : null;
        n.fetchDelta(f.since, d).then(function(w) {
          q(n.dom, "ln-api-connector:fetched", { data: w, since: f.since, meta: f.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: f.since,
            meta: f.meta || null
          });
        });
      },
      query: function(r) {
        const f = r.detail || {}, d = f.query || f, w = f.meta && f.meta.targetEl ? f.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(_, l, i) {
          n.query(l, i).then(function(p) {
            const y = p || {};
            q(n.dom, "ln-api-connector:fetched", {
              data: y.data || (Array.isArray(y) ? y : []),
              total: y.total,
              filtered: y.filtered,
              offset: l.offset,
              queryGen: l.queryGen,
              meta: _.meta || null
            });
          }).catch(function(p) {
            p && p.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
              action: "query",
              error: p.message,
              status: p.status || 0,
              data: p.data || null,
              meta: _.meta || null
            });
          });
        }
        if (S === 0) {
          A(f, d, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const u = setTimeout(function() {
          n._queryTimers.delete(v), A(f, d, w);
        }, S);
        n._queryTimers.set(v, u);
      },
      cancel: function(r) {
        const f = r.detail || {}, d = f.meta && f.meta.targetEl ? f.meta.targetEl : f.targetEl || f.key;
        d && n.cancel(d);
      },
      create: function(r) {
        const f = r.detail || {};
        n.create(f.data, f.url, f.idempotencyKey).then(function(d) {
          const w = Je(d);
          q(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: f.tempId,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(d) {
          d && d.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "create",
            error: d.message,
            status: d.status || 0,
            data: d.data || null,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(r) {
        const f = r.detail || {};
        n.update(f.id, f.data, f.expected_version, f.url, f.idempotencyKey).then(function(d) {
          const w = Je(d);
          q(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: f.id,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(d) {
          d && d.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "update",
            error: d.message,
            status: d.status || 0,
            data: d.data || null,
            id: f.id,
            conflictData: d.status === 409 ? d.data : null,
            meta: f.meta || null
          });
        });
      },
      delete: function(r) {
        const f = r.detail || {};
        n.delete(f.id, f.url, f.idempotencyKey).then(function(d) {
          const w = d && d.message ? d.message : null;
          q(n.dom, "ln-api-connector:deleted", {
            response: d,
            id: f.id,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(d) {
          d && d.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: d.message,
            status: d.status || 0,
            data: d.data || null,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const f = r.detail || {};
        n.bulkDelete(f.ids, f.url, f.idempotencyKey).then(function(d) {
          const w = d && d.message ? d.message : null;
          q(n.dom, "ln-api-connector:bulk-deleted", {
            response: d,
            ids: f.ids,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(d) {
          d && d.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: d.message,
            status: d.status || 0,
            data: d.data || null,
            ids: f.ids,
            meta: f.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(r) {
      r.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(r) {
      r && clearTimeout(r);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), q(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[o];
  }, j(t, e, a, "ln-api-connector", {
    attributes: b
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", o = "lnConnector";
  if (window[e] !== void 0) return;
  function h(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const b = {
    "data-ln-couchdb-connector": {},
    "data-ln-couchdb-url": { prop: "url", read: Q, fallback: "", effect: h },
    "data-ln-couchdb-db": { prop: "db", read: Q, fallback: "", effect: h },
    "data-ln-couchdb-auth": { prop: "auth", read: Q, fallback: "", effect: h },
    "data-ln-couchdb-headers": { effect: h }
  }, m = et(b);
  function s(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function a(v) {
    return this.dom = v, tt(this, v, m), v[e] = this, v[o] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  a.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const S = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = _n(S, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), q(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function c(v, S, A) {
    const u = Object.assign({}, Nt(v.headers, v.auth), A || {});
    return S && (u["Idempotency-Key"] = S), u;
  }
  a.prototype.fetchDelta = function(v) {
    const S = this, A = ["include_docs=true", "feed=normal"];
    v && A.push("since=" + encodeURIComponent(v));
    const u = Et(S.url, S.db, "_changes") + "?" + A.join("&");
    return window.fetch(u, { method: "GET", headers: Nt(S.headers, S.auth), credentials: S.credentials }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const l = _.results || [];
      return {
        data: l.filter((i) => !i.deleted && i.doc).map((i) => Object.assign({}, i.doc, { id: i.doc._id })),
        deleted: l.filter((i) => i.deleted).map((i) => i.id),
        synced_at: _.last_seq || v || ""
      };
    });
  };
  function n(v, S, A) {
    const u = Object.assign({ _id: S.id }, S);
    return u._id || delete u._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: c(v, A),
      credentials: v.credentials,
      body: JSON.stringify(u)
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const l = s(_), i = l.content;
      return { record: Object.assign({}, u, { id: i.id, _id: i.id, _rev: i.rev }), message: l.message };
    });
  }
  a.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function r(v, S, A, u) {
    const _ = Object.assign({ id: String(S), _id: String(S) }, A), l = _._rev || _.rev;
    return (l ? Promise.resolve(l) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((y) => y._rev);
    })).then((p) => {
      const y = Object.assign({}, _, { _rev: p });
      delete y.rev;
      const T = c(v, u, { "If-Match": p });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(y)
      }).then((g) => {
        if (g.ok) return g.json().then((E) => {
          const C = s(E);
          return { record: Object.assign({}, y, { _rev: C.content.rev }), message: C.message };
        });
        if (g.status === 409) return g.json().then((E) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = E, C;
        });
        throw new Error("HTTP " + g.status + ": " + g.statusText);
      });
    });
  }
  a.prototype.update = function(v, S, A) {
    return r(this, v, S, A).then((u) => u.record);
  };
  function f(v, S, A, u) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((l) => {
      if (!l.ok) throw new Error("Could not retrieve document for revision delete");
      return l.json().then((i) => i._rev);
    })).then((l) => {
      const i = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(l);
      return window.fetch(i, { method: "DELETE", headers: c(v, u), credentials: v.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      }).then((p) => {
        const y = s(p);
        return { response: y.content, message: y.message };
      });
    });
  }
  a.prototype.delete = function(v, S, A) {
    return f(this, v, S, A).then((u) => u.response);
  };
  function d(v, S, A) {
    return !S || S.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Nt(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: S })
    }).then((u) => {
      if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
      return u.json();
    }).then((u) => {
      const l = (u.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return l.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: l })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => {
        const p = s(i);
        return { response: { ok: !0, results: p.content, deletedCount: l.length }, message: p.message };
      });
    });
  }
  a.prototype.bulkDelete = function(v, S) {
    return d(this, v, S).then((A) => A.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(A) {
        const u = A.detail || {};
        v.fetchDelta(u.since).then(function(_) {
          q(v.dom, "ln-couchdb-connector:fetched", { data: _, since: u.since, meta: u.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      create: function(A) {
        const u = A.detail || {};
        n(v, u.data, u.idempotencyKey).then(function(_) {
          q(v.dom, "ln-couchdb-connector:created", { record: _.record, tempId: u.tempId, message: _.message, meta: u.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(A) {
        const u = A.detail || {}, _ = Object.assign({}, u.data);
        u.expected_version !== void 0 && (_._rev = u.expected_version), r(v, u.id, _, u.idempotencyKey).then(function(l) {
          q(v.dom, "ln-couchdb-connector:updated", { record: l.record, id: u.id, message: l.message, meta: u.meta || null });
        }).catch(function(l) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: l.message,
            status: l.status || 0,
            id: u.id,
            data: l.status === 409 ? l.data : null,
            conflictData: l.status === 409 ? l.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(A) {
        const u = A.detail || {};
        f(v, u.id, u.rev, u.idempotencyKey).then(function(_) {
          q(v.dom, "ln-couchdb-connector:deleted", { response: _.response, id: u.id, message: _.message, meta: u.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const u = A.detail || {};
        d(v, u.ids, u.idempotencyKey).then(function(_) {
          q(v.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: u.ids, message: _.message, meta: u.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.addEventListener(A + ":request-sync", v._handlers.sync), v.dom.addEventListener(A + ":request-fetch", v._handlers.sync), v.dom.addEventListener(A + ":request-create", v._handlers.create), v.dom.addEventListener(A + ":request-update", v._handlers.update), v.dom.addEventListener(A + ":request-delete", v._handlers.delete), v.dom.addEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    });
  }
  a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const v = this;
    v._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.removeEventListener(A + ":request-sync", v._handlers.sync), v.dom.removeEventListener(A + ":request-fetch", v._handlers.sync), v.dom.removeEventListener(A + ":request-create", v._handlers.create), v.dom.removeEventListener(A + ":request-update", v._handlers.update), v.dom.removeEventListener(A + ":request-delete", v._handlers.delete), v.dom.removeEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    }), v._handlers = null), q(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[o];
  }, j(t, e, a, "ln-couchdb-connector", {
    attributes: b
  });
})();
function bi(t) {
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
  const o = !t || !!t.initializationError, h = !!(t && t.noLocalQuery && !t.windowed);
  return e && (o || !t.canServe || h) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function $t(t, e, o) {
  return o === "store" && !!e && !(t && t.windowed);
}
function Ze(t, e) {
  const o = Object.assign({}, t);
  return e && (o.filters = e.filters, o.search = e.search, o.sort = e.sort), o;
}
class yi {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((o, h) => {
      this._pending.set(e, { resolve: o, reject: h });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const o = e || new Error("Mutation receipt registry closed");
    for (const h of this._pending.values()) h.reject(o);
    this._pending.clear();
  }
  _settle(e, o) {
    const h = e && e.requestId;
    if (!h) return !1;
    const b = this._pending.get(h);
    return b ? (this._pending.delete(h), o ? b.reject(e.error || new Error("Store mutation failed")) : b.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", o = "data-ln-data-coordinator-scope", h = "data-ln-data-coordinator-search", b = "data-ln-data-coordinator-filters", m = "data-ln-data-coordinator-sort-field", s = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function a(g) {
    const E = g[e];
    E && E.refreshMapper();
  }
  function c(g) {
    const E = g[e];
    E && E._queueQueryRefresh();
  }
  function n(g, E) {
    return g.getAttribute(E) || g.id;
  }
  const r = {
    "data-ln-data-coordinator": { prop: "_name", read: n },
    "data-ln-data-coordinator-scope": {},
    "data-ln-data-coordinator-mapper": { effect: a },
    "data-ln-data-coordinator-search": { effect: c },
    "data-ln-data-coordinator-filters": { effect: c },
    "data-ln-data-coordinator-sort-field": { effect: c },
    "data-ln-data-coordinator-sort-direction": { effect: c },
    "data-ln-data-coordinator-stale": {},
    "data-ln-data-coordinator-no-autosync": {},
    "data-ln-data-coordinator-dict": {}
  }, f = et(r), d = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function u() {
    w || (w = !0, v = function() {
      q(document, "ln-data-coordinator:online", {}), d.forEach(function(g) {
        g._maybeSync();
      });
    }, S = function() {
      q(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && d.forEach(function(g) {
        const E = g.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !g._noAutosync && (!C.hasCache || g._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function _() {
    w && (d.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", S), document.removeEventListener("visibilitychange", A), v = null, S = null, A = null, w = !1));
  }
  function l() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (E) => {
        const C = Math.random() * 16 | 0;
        return (E === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  const i = ["ln-api-connector", "ln-couchdb-connector"];
  function p(g) {
    return g ? g.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : g.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function y(g) {
    const E = this;
    return this.dom = g, tt(this, g, f), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", g), g[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new yi(), this._dict = re(g, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), d.add(this), u(), this._checkInitialSync(), this;
  }
  Object.defineProperty(y.prototype, "_staleThreshold", {
    get: function() {
      const E = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (E ? E.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const k = parseInt(C, 10);
      return isNaN(k) ? 300 : k;
    }
  }), Object.defineProperty(y.prototype, "_noAutosync", {
    get: function() {
      const E = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (E ? E.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), y.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, y.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const E = this.findChildren().store;
    return !E || !E.lastSyncedAt ? !0 : Date.now() / 1e3 - E.lastSyncedAt > this._staleThreshold;
  }, y.prototype._maybeSync = function() {
    const g = this.findChildren(), E = g.store;
    !E || E.initializationError || !g.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, y.prototype._checkInitialSync = function() {
    const g = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (g._destroyed) return;
      const k = g.findChildren(), D = k.store;
      if (D && D.initializationError) {
        g._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !k.connector || g._noAutosync || D.isSyncing || (!D.hasCache || g._isStale()) && D.forceSync();
    }).catch(function(k) {
      g._destroyed || g._reportReconciliationError("store-initialize", k, null);
    });
  }, y.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const E = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    E && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(E)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(C) {
      return C;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(C) {
      return C;
    });
  }, y.prototype.findChildren = function() {
    const g = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: g,
      connectorEl: E,
      queueEl: C,
      store: g ? g.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, y.prototype._handleSubmitRecord = function(g) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = g.data || {}, k = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = g.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, g.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, k, I, D, g.action);
  }, y.prototype._fanOutCreate = function(g, E, C) {
    this.refreshMapper();
    const k = "_temp_" + l();
    g.storeEl && q(g.storeEl, "ln-data-store:request-create", { tempId: k, data: E }), g.queue ? q(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: k,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: k, action: C }
    }) : g.connector && q(g.connectorEl, p(g.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: l(), queued: !1, op: "create", tempId: k }
    });
  }, y.prototype._fanOutUpdate = function(g, E, C, k, D) {
    this.refreshMapper(), g.storeEl && q(g.storeEl, "ln-data-store:request-update", { id: E, data: C }), g.queue ? q(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: k,
      meta: { id: E, action: D }
    }) : g.connector && q(g.connectorEl, p(g.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: k,
      url: D,
      meta: { entryId: l(), queued: !1, op: "update", id: E }
    });
  }, y.prototype._fanOutDelete = function(g, E) {
    this.refreshMapper(), g.storeEl && q(g.storeEl, "ln-data-store:request-delete", { id: E }), g.queue ? q(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : g.connector && q(g.connectorEl, p(g.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: l(), queued: !1, op: "delete", id: E }
    });
  }, y.prototype._fanOutBulkDelete = function(g, E) {
    this.refreshMapper();
    const C = E.join(",");
    g.storeEl && q(g.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), g.queue ? q(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : g.connector && q(g.connectorEl, p(g.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: l(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, y.prototype._toastFromMessage = function(g) {
    g && q(window, "ln-toast:enqueue", {
      type: g.type || "success",
      title: g.title || "",
      message: g.body || ""
    });
  }, y.prototype._toastFromDict = function(g) {
    const E = this._dict[g];
    E && q(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, y.prototype._requestStoreMutation = function(g, E, C) {
    const k = g.storeEl;
    if (!k) return Promise.reject(new Error("Store element not found"));
    const D = l(), I = this._mutationReceipts.wait(D);
    return q(k, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, y.prototype._reportReconciliationError = function(g, E, C) {
    this._destroyed || q(this.dom, "ln-data-coordinator:error", {
      operation: g,
      error: E,
      meta: C || null
    });
  };
  function T(g) {
    g._handlers = {
      sync: function(E) {
        g.refreshMapper();
        const C = g.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        q(C.connectorEl, p(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = g.findChildren();
        if (!C.connectorEl) return;
        const k = E.detail || {};
        q(C.connectorEl, p(C.connectorEl) + ":request-query", {
          query: Object.assign({}, k.query, {
            offset: k.offset,
            limit: k.limit,
            queryGen: k.queryGen
          })
        });
      },
      reqCreate: function(E) {
        const C = g.findChildren();
        g._fanOutCreate(C, E.detail.data || {}, E.detail.action);
      },
      reqUpdate: function(E) {
        const C = g.findChildren();
        g._fanOutUpdate(C, E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action);
      },
      reqDelete: function(E) {
        const C = g.findChildren();
        g._fanOutDelete(C, E.detail.id);
      },
      reqBulkDelete: function(E) {
        const C = g.findChildren();
        g._fanOutBulkDelete(C, E.detail.ids || []);
      },
      queueFailed: function() {
        g._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(E) {
        g.refreshMapper();
        const C = g.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const k = E.detail || {}, D = k.entryId, I = k.op, R = k.targetId, O = k.payload, P = k.expectedVersion, B = k.meta || {}, U = B.action || null, z = k.idempotencyKey || D;
        I === "create" ? q(C.connectorEl, p(C.connectorEl) + ":request-create", {
          data: O,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? q(C.connectorEl, p(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? q(C.connectorEl, p(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? q(C.connectorEl, p(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: B.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(E) {
        const C = E.target;
        if (E.defaultPrevented) return;
        const k = C.hasAttribute(o) ? C.getAttribute(o) : null;
        if (k === null) return;
        let D;
        if (k ? D = g._owns(k) : D = C.closest("[data-ln-data-coordinator]") === g.dom, !D) return;
        const I = hr(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = ln(C);
        delete R._method, delete R._token, g._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(E) {
        const C = E.detail.meta || {}, k = g.findChildren();
        g.refreshMapper();
        const D = E.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => g.mapper.ingress(B));
        if (k.store && !k.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? k.store.applyQuery(P, { total: E.detail.total }).then(function(B) {
            C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen) || (q(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), q(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: E.detail.total !== void 0 ? E.detail.total : B.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : B.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), g._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? k.store.applyQuery(P, { total: E.detail.total }).then(function() {
            return k.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen) || q(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && k.store.applyQuery(P, { total: E.detail.total }).then(function() {
            if (C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen)) return;
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            q(C.targetEl, "ln-stat:set-count", { count: B });
          }) : k.store.applySync(P, R, O || Math.floor(Date.now() / 1e3), {
            total: E.detail.total,
            filtered: E.detail.filtered,
            offset: E.detail.offset,
            queryGen: E.detail.queryGen,
            targetEl: C.targetEl
          });
        else if (C.targetEl && C.kind) {
          if (C.kind === "table" || C.kind === "list" || C.kind === "chart")
            q(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), q(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: P,
              total: E.detail.total !== void 0 ? E.detail.total : P.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : P.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), g._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            q(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            q(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(E) {
        const C = g.findChildren(), k = E.detail.meta || {}, D = g.mapper.ingress(E.detail.record);
        (C.storeEl ? g._requestStoreMutation(C, "update", { id: k.tempId, data: D }) : Promise.resolve()).then(function() {
          g._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: k.entryId,
            oldKey: k.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          g._reportReconciliationError("create-reconcile", R, k);
        });
      },
      connUpdated: function(E) {
        const C = g.findChildren(), k = E.detail.meta || {}, D = g.mapper.ingress(E.detail.record);
        (C.storeEl ? g._requestStoreMutation(C, "update", { id: k.id, data: D }) : Promise.resolve()).then(function() {
          g._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
        }).catch(function(R) {
          g._reportReconciliationError("update-reconcile", R, k);
        });
      },
      connDeleted: function(E) {
        const C = g.findChildren(), k = E.detail.meta || {};
        g._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
      },
      connBulkDeleted: function(E) {
        const C = g.findChildren(), k = E.detail.meta || {};
        g._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
      },
      connError: function(E) {
        const C = E.detail || {}, k = C.meta || {}, D = k.op || C.action, I = C.status || C.error && C.error.status || 0, R = g.findChildren();
        if (D === "sync") {
          R.storeEl && q(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          k.targetEl && k.kind && (q(k.targetEl, "ln-" + k.kind + ":set-loading", { loading: !1 }), (k.kind === "table" || k.kind === "list") && q(k.targetEl, "ln-" + k.kind + ":page-failed", { offset: k.offset })), g._reportReconciliationError("query", C.error || C, k);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          g._toastFromDict("auth"), k.queued && R.queue && q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "auth" });
          return;
        }
        if (P) {
          k.queued && R.queue ? q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "retry" }) : g._toastFromDict("network");
          return;
        }
        let U = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? g.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (U = g._requestStoreMutation(R, "update", { id: k.id, data: z })), g._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (U = g._requestStoreMutation(R, "delete", { id: k.tempId })), g._toastFromDict("rejected");
        k.queued && R.queue ? U.then(function() {
          q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "drop" });
        }).catch(function(z) {
          g._reportReconciliationError("deterministic-reconcile", z, k);
        }) : U.catch(function(z) {
          g._reportReconciliationError("deterministic-reconcile", z, k);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(E) {
        const C = g.findChildren(), k = C.store;
        if (!k || k.initializationError || !C.connector || g._noAutosync || k.isSyncing) return;
        (E.detail || {}).hasCache ? g._isStale() && k.forceSync() : k.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(E) {
        g._serveData(E, "table");
      },
      reqListData: function(E) {
        g._serveData(E, "list");
      },
      reqChartData: function(E) {
        g._serveData(E, "chart");
      },
      reqOptions: function(E) {
        g._serveOptions(E);
      },
      reqStat: function(E) {
        g._serveStat(E);
      },
      refreshQuery: function() {
        g._refreshAll(null, !0);
      },
      refresh: function(E) {
        g._mutationReceipts.resolve(E.detail), g._refreshAll(null, !1);
      },
      mutationError: function(E) {
        g._mutationReceipts.reject(E.detail);
      },
      refreshSynced: function(E) {
        E.detail && E.detail.changed && g._refreshAll(E.detail.meta, !1);
      },
      searchChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.term != null ? E.detail.term : "";
        C !== (g.dom.getAttribute(h) || "") && g.dom.setAttribute(h, C);
      },
      filterChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.key;
        if (!C) return;
        const k = (E.detail.values || []).slice(), D = g._currentQuery().filters, I = D[C];
        if (I ? I.length === k.length && I.every((B, U) => B === k[U]) : !k.length) return;
        k.length ? D[C] = k : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(U) {
            O.append(B, U);
          });
        });
        const P = O.toString();
        P ? g.dom.setAttribute(b, P) : g.dom.removeAttribute(b);
      },
      sortChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.field, k = E.detail && E.detail.direction, D = C && k && k !== "none" ? { field: C, direction: k } : null, I = g._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (g.dom.setAttribute(m, D.field), g.dom.setAttribute(s, D.direction)) : (g.dom.removeAttribute(m), g.dom.removeAttribute(s)));
      }
    }, g.dom.addEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.addEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.addEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.addEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.addEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.addEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.addEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.addEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.addEventListener("ln-data-store:initialized", g._handlers.storeInitialized), document.addEventListener("submit", g._handlers.formSubmit), i.forEach(function(E) {
      g.dom.addEventListener(E + ":fetched", g._handlers.connFetched), g.dom.addEventListener(E + ":created", g._handlers.connCreated), g.dom.addEventListener(E + ":updated", g._handlers.connUpdated), g.dom.addEventListener(E + ":deleted", g._handlers.connDeleted), g.dom.addEventListener(E + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.addEventListener(E + ":error", g._handlers.connError);
    }), document.addEventListener("ln-table:request-data", g._handlers.reqTableData), document.addEventListener("ln-list:request-data", g._handlers.reqListData), document.addEventListener("ln-chart:request-data", g._handlers.reqChartData), document.addEventListener("ln-options:request-data", g._handlers.reqOptions), document.addEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.addEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.addEventListener("ln-data-store:created", g._handlers.refresh), g.dom.addEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.addEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.addEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.addEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.addEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.addEventListener("ln-search:change", g._handlers.searchChange), g.dom.addEventListener("ln-filter:change", g._handlers.filterChange), g.dom.addEventListener("ln-sort:change", g._handlers.sortChange);
  }
  y.prototype._owns = function(g) {
    return !!g && g === this._name;
  }, y.prototype._currentQuery = function() {
    const g = this.dom.getAttribute(m), E = this.dom.getAttribute(s), C = new URLSearchParams(this.dom.getAttribute(b) || ""), k = {};
    for (const D of new Set(C.keys())) k[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(h) || "",
      filters: k,
      sort: g && E ? { field: g, direction: E } : null
    };
  }, y.prototype._nextQueryGen = function(g) {
    const E = (this._queryGens.get(g) || 0) + 1;
    return this._queryGens.set(g, E), E;
  }, y.prototype._isCurrentGen = function(g, E) {
    return this._queryGens.get(g) === E;
  }, y.prototype._serveData = function(g, E) {
    const C = g.target, k = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(k);
    if (!D || !this._owns(D)) return;
    const I = g.detail || {}, R = bi(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Pt(B, O.connector), $ = Ze(R, P._currentQuery());
      if (z === "remote") {
        const V = P._nextQueryGen(C);
        q(C, "ln-" + E + ":set-loading", { loading: !0 }), q(O.connectorEl, p(O.connectorEl) + ":request-query", {
          query: $,
          meta: { targetEl: C, kind: E, offset: $.offset, limit: $.limit, queryGen: V }
        });
        return;
      }
      if (z !== "store") {
        q(C, "ln-" + E + ":set-loading", { loading: !1 });
        return;
      }
      const X = $t(B, O.connector, z), Y = X ? P._nextQueryGen(C) : null;
      return X && q(O.connectorEl, p(O.connectorEl) + ":request-query", {
        query: $,
        meta: { targetEl: C, kind: E, offset: $.offset, limit: $.limit, queryGen: Y }
      }), B.getAll($).then(function(V) {
        if (P._destroyed || !P._boundDelivered || X && !P._isCurrentGen(C, Y)) return;
        const G = {
          data: V.data,
          total: V.total,
          filtered: V.filtered,
          offset: I.offset !== void 0 ? I.offset : V.offset,
          queryGen: I.queryGen !== void 0 ? I.queryGen : V.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: X || V.provisional === !0
        };
        q(C, "ln-" + E + ":set-data", G), P._boundDelivered.set(C, !0);
      });
    }).catch(function(z) {
      P._destroyed || (q(C, "ln-" + E + ":set-loading", { loading: !1 }), q(P.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: E,
        store: D,
        target: C,
        error: z
      }));
    });
  }, y.prototype._serveOptions = function(g) {
    const E = g.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const k = this.findChildren(), D = k.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Pt(D, k.connector);
      if (O === "remote") {
        const U = R._nextQueryGen(E);
        q(k.connectorEl, p(k.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: E, kind: "options", queryGen: U }
        });
        return;
      }
      if (O !== "store") return;
      const P = $t(D, k.connector, O), B = P ? R._nextQueryGen(E) : null;
      return P && q(k.connectorEl, p(k.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: E, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(U) {
        R._destroyed || P && !R._isCurrentGen(E, B) || q(E, "ln-options:set-data", { data: U.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: E, kind: "options" });
    });
  }, y.prototype._serveStat = function(g) {
    const E = g.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const k = g.detail && g.detail.filters ? g.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = k && Object.keys(k).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), U = B ? "remote" : Pt(I, D.connector);
      if (U === "remote") {
        const X = O._nextQueryGen(E);
        q(D.connectorEl, p(D.connectorEl) + ":request-query", {
          query: { filters: k },
          meta: { targetEl: E, kind: "stat", queryGen: X }
        });
        return;
      }
      if (U !== "store") return;
      const z = !B && $t(I, D.connector, U), $ = z ? O._nextQueryGen(E) : null;
      return z && q(D.connectorEl, p(D.connectorEl) + ":request-query", {
        query: { filters: k },
        meta: { targetEl: E, kind: "stat", queryGen: $ }
      }), I.count(k).then(function(X) {
        O._destroyed || z && !O._isCurrentGen(E, $) || q(E, "ln-stat:set-count", { count: X });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: E, kind: "stat" });
    });
  }, y.prototype._refreshAll = function(g, E) {
    const C = this, k = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let D = 0; D < k.length; D++) {
      const I = k[D];
      let R, O;
      if (I.hasAttribute("data-ln-table-source") ? (R = I.getAttribute("data-ln-table-source"), O = "table") : I.hasAttribute("data-ln-list-source") ? (R = I.getAttribute("data-ln-list-source"), O = "list") : I.hasAttribute("data-ln-chart-source") ? (R = I.getAttribute("data-ln-chart-source"), O = "chart") : I.hasAttribute("data-ln-options") ? (R = I.getAttribute("data-ln-options"), O = "options") : I.hasAttribute("data-ln-stat") && (R = I.getAttribute("data-ln-stat"), O = "stat"), !C._owns(R)) continue;
      const P = C.findChildren(), B = P.store;
      if (O === "table" || O === "list") {
        const U = O === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (I.hasAttribute(U)) {
          q(I, "ln-" + O + (E ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (O === "table" || O === "list" || O === "chart") {
        const U = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = Ze(U, C._currentQuery());
        if (Pt(B, P.connector) === "remote") {
          const Y = C._nextQueryGen(I);
          q(I, "ln-" + O + ":set-loading", { loading: !0 }), q(P.connectorEl, p(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
          });
          continue;
        }
        const $ = $t(B, P.connector, Pt(B, P.connector)), X = $ ? C._nextQueryGen(I) : null;
        $ && q(P.connectorEl, p(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
        }), (function(Y, V, G, ht) {
          B.getAll(z).then(function(bt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(Y, ht)) return;
            const ae = {
              data: bt.data,
              total: g && g.total !== void 0 ? g.total : bt.total,
              filtered: g && g.filtered !== void 0 ? g.filtered : bt.filtered,
              offset: bt.offset !== void 0 ? bt.offset : g && g.offset !== void 0 ? g.offset : U.offset,
              queryGen: bt.queryGen !== void 0 ? bt.queryGen : g && g.queryGen !== void 0 ? g.queryGen : U.queryGen
            };
            q(Y, "ln-" + V + ":set-loading", { loading: !1 }), q(Y, "ln-" + V + ":set-data", ae), C._boundDelivered.set(Y, !0);
          }).catch(function() {
          });
        })(I, O, $, X);
      } else if (O === "options")
        (function(U) {
          B.getAll({}).then(function(z) {
            C._destroyed || q(U, "ln-options:set-data", { data: z.data });
          }).catch(function() {
          });
        })(I);
      else if (O === "stat") {
        const U = I.getAttribute("data-ln-stat-filter");
        let z = null;
        if (U) {
          const $ = U.indexOf(":");
          if ($ !== -1) {
            const X = U.slice(0, $).trim(), Y = U.slice($ + 1).trim();
            X && (z = {}, z[X] = [Y]);
          }
        }
        (function($, X) {
          B.count(X).then(function(Y) {
            C._destroyed || q($, "ln-stat:set-count", { count: Y });
          }).catch(function() {
          });
        })(I, z);
      }
    }
  }, y.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const g = this;
    g._handlers && (g.dom.removeEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.removeEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.removeEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.removeEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.removeEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.removeEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.removeEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.removeEventListener("ln-data-store:initialized", g._handlers.storeInitialized), document.removeEventListener("submit", g._handlers.formSubmit), i.forEach(function(E) {
      g.dom.removeEventListener(E + ":fetched", g._handlers.connFetched), g.dom.removeEventListener(E + ":created", g._handlers.connCreated), g.dom.removeEventListener(E + ":updated", g._handlers.connUpdated), g.dom.removeEventListener(E + ":deleted", g._handlers.connDeleted), g.dom.removeEventListener(E + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.removeEventListener(E + ":error", g._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", g._handlers.reqTableData), document.removeEventListener("ln-list:request-data", g._handlers.reqListData), document.removeEventListener("ln-chart:request-data", g._handlers.reqChartData), document.removeEventListener("ln-options:request-data", g._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.removeEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:created", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.removeEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.removeEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.removeEventListener("ln-search:change", g._handlers.searchChange), g.dom.removeEventListener("ln-filter:change", g._handlers.filterChange), g.dom.removeEventListener("ln-sort:change", g._handlers.sortChange), g._handlers = null), g._boundQueries = null, g._boundDelivered = null, g._queryGens = null, g._queueQueryRefresh = null, g._mutationReceipts.close(new Error("Data coordinator destroyed")), g._mutationReceipts = null, d.delete(this), _(), delete this.dom[e];
  }, j(t, e, y, "ln-data-coordinator", {
    attributes: r
  });
})();
const vi = "ln_api_queue", wi = 2, it = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function xt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function tn(t) {
  return "seq:" + t;
}
function Yt(t) {
  return "paused:" + t;
}
function en(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function Ei(t, e, o) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(o);
}
function Ai(t, e, o, h) {
  const b = /* @__PURE__ */ new Map(), m = [], s = [];
  for (const a of t || [])
    b.has(a.chainKey) || b.set(a.chainKey, []), b.get(a.chainKey).push(a);
  return b.forEach((a, c) => {
    a.sort((r, f) => r.seq - f.seq);
    const n = a[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > h) {
        s.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > h) {
        s.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = h + o, n.updatedAt = h, m.push(n);
    }
  }), { entries: m, wakeups: s };
}
function Si(t, e, o, h, b) {
  const m = [], s = [];
  for (const a of t || []) {
    if (a.entryId === e) {
      s.push(a.entryId);
      continue;
    }
    a.chainKey === o && (a.chainKey = h, a.targetId === o && (a.targetId = h), a.meta && a.meta.id === o && (a.meta.id = h), a.meta && typeof a.meta.action == "string" && (a.meta.action = Ei(a.meta.action, o, h)), a.updatedAt = b, m.push(a));
  }
  return { changed: m, deleted: s };
}
class Ci {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || vi, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, o) => {
      const h = this.indexedDB.open(this.dbName, wi);
      h.onupgradeneeded = (b) => {
        const m = b.target.result;
        let s;
        m.objectStoreNames.contains(it) ? s = b.target.transaction.objectStore(it) : s = m.createObjectStore(it, { keyPath: "entryId" }), s.indexNames.contains("by_scope_chain") || s.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), s.indexNames.contains("by_scope_seq") || s.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(lt) || m.createObjectStore(lt, { keyPath: "key" });
      }, h.onerror = () => o(ut(h, "Queue database open failed")), h.onsuccess = (b) => {
        this._db = b.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, o) => {
      const h = this.indexedDB.deleteDatabase(this.dbName);
      h.onsuccess = () => e(), h.onerror = () => o(ut(h, "Queue database delete failed")), h.onblocked = () => o(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((o) => o ? new Promise((h, b) => {
      const s = o.transaction(it, "readonly").objectStore(it).index("by_scope_seq").getAll(xt(this.keyRange, e));
      s.onsuccess = () => h(s.result || []), s.onerror = () => b(ut(s, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, o) {
    return o = o || {}, this.open().then((h) => h ? new Promise((b, m) => {
      const s = h.transaction([lt, it], "readwrite"), a = s.objectStore(lt), c = s.objectStore(it), n = tn(e);
      let r = null;
      const f = (w) => {
        const v = w + 1;
        r = {
          entryId: this.uuid(),
          scope: e,
          chainKey: o.chainKey,
          seq: v,
          op: o.op,
          targetId: o.targetId !== void 0 ? o.targetId : null,
          payload: o.payload,
          expectedVersion: o.expectedVersion !== void 0 ? o.expectedVersion : null,
          meta: o.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, a.put({ key: n, value: v }), c.put(r);
      }, d = a.get(n);
      d.onerror = () => m(ut(d, "Queue sequence read failed")), d.onsuccess = () => {
        const w = d.result;
        if (w && typeof w.value == "number") {
          f(w.value);
          return;
        }
        const v = c.index("by_scope_seq").getAll(xt(this.keyRange, e));
        v.onerror = () => m(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, u) => Math.max(A, u.seq || 0), 0);
          f(S);
        };
      }, s.oncomplete = () => b(r), s.onerror = () => m(s.error || new Error("Queue enqueue transaction failed")), s.onabort = () => m(s.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, o, h) {
    return this.open().then((b) => b ? new Promise((m, s) => {
      const a = b.transaction(it, "readwrite"), c = a.objectStore(it), n = c.index("by_scope_seq").getAll(xt(this.keyRange, e)), r = this.now();
      let f = { entries: [], wakeups: [] };
      n.onerror = () => s(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        f = Ai(n.result || [], o, h, r);
        for (const d of f.entries) c.put(d);
      }, a.oncomplete = () => m(f), a.onerror = () => s(a.error || new Error("Queue claim transaction failed")), a.onabort = () => s(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, o) {
    return this._updateEntry(e, o, (h, b) => (b.delete(h.entryId), { status: "acked", entry: h }));
  }
  nack(e, o, h, b) {
    b = b || {};
    const m = b.maxAttempts || 8, s = b.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((c, n) => {
      const r = a.transaction([it, lt], "readwrite"), f = r.objectStore(it), d = r.objectStore(lt), w = f.get(o);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (h === "drop") {
            f.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (en(S), S.updatedAt = this.now(), h === "auth") {
            S.status = "pending", f.put(S), d.put({ key: Yt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (h === "retry") {
            if (S.attempts = (S.attempts || 0) + 1, S.attempts >= m) {
              S.status = "failed", S.nextAttemptAt = 0, f.put(S), v = { status: "failed", entry: S };
              return;
            }
            const A = s[Math.min(S.attempts - 1, s.length - 1)];
            S.status = "pending", S.nextAttemptAt = this.now() + A, f.put(S), v = { status: "retry", entry: S, delay: A };
          }
        }
      }, r.oncomplete = () => c(v), r.onerror = () => n(r.error || new Error("Queue nack transaction failed")), r.onabort = () => n(r.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, o, h) {
    return this._remapTransaction(e, null, o, h);
  }
  resolveCreate(e, o, h, b) {
    return this._remapTransaction(e, o, h, b);
  }
  _remapTransaction(e, o, h, b) {
    return this.open().then((m) => m ? new Promise((s, a) => {
      const c = m.transaction(it, "readwrite"), n = c.objectStore(it), r = n.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let f = { changed: [], deleted: [] };
      r.onerror = () => a(ut(r, "Queue remap read failed")), r.onsuccess = () => {
        f = Si(r.result || [], o, h, b, this.now());
        for (const d of f.deleted) n.delete(d);
        for (const d of f.changed) n.put(d);
      }, c.oncomplete = () => s(f.changed), c.onerror = () => a(c.error || new Error("Queue remap transaction failed")), c.onabort = () => a(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((o) => o ? new Promise((h, b) => {
      const m = o.transaction(it, "readwrite"), s = m.objectStore(it), a = s.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let c = 0;
      a.onerror = () => b(ut(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const n of a.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), en(n), s.put(n), c++);
      }, m.oncomplete = () => h(c), m.onerror = () => b(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => b(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((o) => o ? new Promise((h, b) => {
      const s = o.transaction(lt, "readonly").objectStore(lt).get(Yt(e));
      s.onsuccess = () => {
        const a = s.result ? s.result.value : !1;
        h(a || !1);
      }, s.onerror = () => b(ut(s, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, o) {
    return this.open().then((h) => {
      if (h)
        return new Promise((b, m) => {
          const s = h.transaction(lt, "readwrite"), a = typeof o == "string" ? o : o ? "manual" : !1;
          s.objectStore(lt).put({ key: Yt(e), value: a }), s.oncomplete = () => b(), s.onerror = () => m(s.error || new Error("Queue pause-state write failed")), s.onabort = () => m(s.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((o) => {
      if (o)
        return new Promise((h, b) => {
          const m = o.transaction([it, lt], "readwrite"), a = m.objectStore(it).index("by_scope_seq").openCursor(xt(this.keyRange, e));
          a.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, a.onerror = () => b(ut(a, "Queue clear failed")), m.objectStore(lt).delete(tn(e)), m.objectStore(lt).delete(Yt(e)), m.oncomplete = () => h(), m.onerror = () => b(m.error || new Error("Queue clear transaction failed")), m.onabort = () => b(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, o, h) {
    return this.open().then((b) => b ? new Promise((m, s) => {
      const a = b.transaction(it, "readwrite"), c = a.objectStore(it), n = c.get(o);
      let r = null;
      n.onerror = () => s(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const f = n.result;
        !f || f.scope !== e || (r = h(f, c));
      }, a.oncomplete = () => m(r), a.onerror = () => s(a.error || new Error("Queue entry transaction failed")), a.onabort = () => s(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", o = [2e3, 5e3, 15e3, 6e4, 3e5], h = 8, b = 6e4;
  if (window[e] !== void 0) return;
  function m(r) {
    const f = r[e];
    f && f._drain();
  }
  const s = {
    "data-ln-api-queue": {},
    "data-ln-api-queue-online": { effect: m }
  };
  function a() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (f) => {
        const d = Math.random() * 16 | 0;
        return (f === "x" ? d : d & 3 | 8).toString(16);
      });
    }
  }
  const c = new Ci({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: a
  });
  function n(r) {
    this.dom = r, r[e] = this;
    const f = r.closest("[data-ln-data-coordinator]");
    this.scope = r.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = a(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const d = this;
    return c.open().then((w) => w ? c.getPaused(d.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (d._paused = !!w, d._paused) {
        const v = typeof w == "string" ? w : "auth";
        q(d.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return d._emitPendingCount();
    }).then(() => d._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), q(d.dom, "ln-api-queue:error", { operation: "initialize", error: w });
    }), this;
  }
  n.prototype._isOnline = function() {
    const r = this.dom.getAttribute("data-ln-api-queue-online");
    return r === "true" ? !0 : r === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const r = this;
    return c.allForScope(r.scope).then((f) => (q(r.dom, "ln-api-queue:pending-count", { count: f.length, scope: r.scope }), f.length === 0 && q(r.dom, "ln-api-queue:drained", { scope: r.scope }), f));
  }, n.prototype._clearTimer = function(r) {
    const f = this._timers.get(r);
    f && (clearTimeout(f), this._timers.delete(r));
  }, n.prototype._scheduleTimer = function(r, f) {
    const d = Math.max(0, f), w = this._timers.get(r);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(r), v._drain();
    }, d);
    this._timers.set(r, S);
  }, n.prototype._drain = function() {
    const r = this;
    return r._paused || !r._isOnline() ? Promise.resolve() : (r._drainPromise || (r._drainPromise = c.claimReady(r.scope, r._workerId, b).then((f) => {
      for (const d of f.wakeups)
        r._scheduleTimer(d.chainKey, d.at - Date.now());
      for (const d of f.entries)
        r._clearTimer(d.chainKey), q(r.dom, "ln-api-queue:send", {
          entryId: d.entryId,
          chainKey: d.chainKey,
          op: d.op,
          targetId: d.targetId,
          payload: d.payload,
          expectedVersion: d.expectedVersion,
          idempotencyKey: d.entryId,
          meta: d.meta
        });
    }).catch((f) => {
      console.error("[ln-api-queue] Drain failed:", f), q(r.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      r._drainPromise = null;
    })), r._drainPromise);
  }, n.prototype._onEnqueue = function(r) {
    const f = this;
    return c.enqueue(f.scope, r.detail || {}).then((d) => {
      if (d)
        return f._emitPendingCount().then((w) => (q(f.dom, "ln-api-queue:enqueued", {
          entryId: d.entryId,
          chainKey: d.chainKey,
          count: w.length
        }), f._drain()));
    }).catch((d) => {
      q(f.dom, "ln-api-queue:error", { operation: "enqueue", error: d });
    });
  }, n.prototype._onAck = function(r) {
    const f = this, d = r.detail || {};
    return c.ack(f.scope, d.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      q(f.dom, "ln-api-queue:error", { operation: "ack", entryId: d.entryId, error: w });
    });
  }, n.prototype._onNack = function(r) {
    const f = this, d = r.detail || {};
    return c.nack(f.scope, d.entryId, d.reason, {
      maxAttempts: h,
      backoff: o
    }).then((w) => {
      if (w)
        return w.status === "failed" ? q(f.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? f._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (f._paused = !0, q(f.dom, "ln-api-queue:paused", { reason: "auth" }), q(f.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), f._emitPendingCount().then(() => {
          if (w.status === "dropped") return f._drain();
        });
    }).catch((w) => {
      q(f.dom, "ln-api-queue:error", { operation: "nack", entryId: d.entryId, error: w });
    });
  }, n.prototype._onRemap = function(r) {
    const f = this, d = r.detail || {};
    return c.remap(f.scope, d.oldKey, d.newId).catch((w) => {
      q(f.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(r) {
    const f = this, d = r.detail || {};
    return c.resolveCreate(f.scope, d.entryId, d.oldKey, d.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      q(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: d.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const r = this;
    return c.setPaused(r.scope, !1).then(() => (r._paused = !1, q(r.dom, "ln-api-queue:resumed", {}), r._drain())).catch((f) => {
      q(r.dom, "ln-api-queue:error", { operation: "resume", error: f });
    });
  }, n.prototype._onPause = function() {
    const r = this;
    return c.setPaused(r.scope, "manual").then(() => {
      r._paused = !0, q(r.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((f) => {
      q(r.dom, "ln-api-queue:error", { operation: "pause", error: f });
    });
  }, n.prototype._onDrain = function() {
    const r = this;
    return c.resetFailed(r.scope).then(() => {
      const f = r._drainPromise;
      return f ? f.then(() => r._drain()) : r._drain();
    }).catch((f) => {
      q(r.dom, "ln-api-queue:error", { operation: "manual-drain", error: f });
    });
  }, n.prototype._onClear = function() {
    const r = this;
    return r._timers.forEach((f) => clearTimeout(f)), r._timers.clear(), c.clear(r.scope).then(() => {
      r._paused = !1, q(r.dom, "ln-api-queue:pending-count", { count: 0, scope: r.scope }), q(r.dom, "ln-api-queue:drained", { scope: r.scope });
    }).catch((f) => {
      q(r.dom, "ln-api-queue:error", { operation: "clear", error: f });
    });
  }, n.prototype._bindEvents = function() {
    const r = this;
    r._handlers = {
      enqueue: (f) => r._onEnqueue(f),
      ack: (f) => r._onAck(f),
      nack: (f) => r._onNack(f),
      remap: (f) => r._onRemap(f),
      resolveCreate: (f) => r._onResolveCreate(f),
      resume: () => r._onResume(),
      pause: () => r._onPause(),
      drain: () => r._onDrain(),
      clear: () => r._onClear()
    }, r.dom.addEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.addEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.addEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.addEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.addEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.addEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.addEventListener("ln-api-queue:request-pause", r._handlers.pause), r.dom.addEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.addEventListener("ln-api-queue:request-clear", r._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const r = this;
    r.dom.removeEventListener("ln-api-queue:request-enqueue", r._handlers.enqueue), r.dom.removeEventListener("ln-api-queue:ack", r._handlers.ack), r.dom.removeEventListener("ln-api-queue:nack", r._handlers.nack), r.dom.removeEventListener("ln-api-queue:request-remap", r._handlers.remap), r.dom.removeEventListener("ln-api-queue:resolve-create", r._handlers.resolveCreate), r.dom.removeEventListener("ln-api-queue:request-resume", r._handlers.resume), r.dom.removeEventListener("ln-api-queue:request-pause", r._handlers.pause), r.dom.removeEventListener("ln-api-queue:request-drain", r._handlers.drain), r.dom.removeEventListener("ln-api-queue:request-clear", r._handlers.clear), window.removeEventListener("online", r._onlineHandler), r._timers.forEach((f) => clearTimeout(f)), r._timers.clear(), q(r.dom, "ln-api-queue:destroyed", { scope: r.scope }), delete r.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: s
  });
})();
function jn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function It(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Ti(t, e, o) {
  const h = jn(t);
  return h === null || h < 0 ? 0 : Math.min(h, Math.min(e, o) / 2);
}
function Li(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((o) => !Number.isFinite(o)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function qi(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), o = e[0].trim();
  return o ? {
    field: o,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function ki(t, e) {
  e = e || {};
  const o = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, h = e.xField || "label", b = e.yField || "value", m = e.includeZero !== !1, s = Ti(e.padding, o.width, o.height), a = Array.isArray(t) ? t : [], c = [];
  for (let i = 0; i < a.length; i++) {
    const p = a[i] || {}, y = jn(p[b]);
    y !== null && c.push({
      record: p,
      sourceIndex: i,
      label: p[h] == null ? String(i + 1) : String(p[h]),
      value: y
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
      baselineY: o.y + o.height - s
    };
  let n = c[0].value, r = c[0].value;
  for (let i = 1; i < c.length; i++)
    c[i].value < n && (n = c[i].value), c[i].value > r && (r = c[i].value);
  let f = n, d = r;
  m && (f = Math.min(0, f), d = Math.max(0, d)), f === d && (d === 0 ? d = 1 : d > 0 ? f = 0 : d = 0);
  const w = Math.max(1, o.width - s * 2), v = Math.max(1, o.height - s * 2), S = d - f, A = o.y + o.height - s - (0 - f) / S * v, u = [];
  for (let i = 0; i < c.length; i++) {
    const p = c[i], y = c.length === 1 ? 0.5 : i / (c.length - 1), T = o.x + s + y * w, g = o.y + o.height - s - (p.value - f) / S * v;
    u.push({
      record: p.record,
      sourceIndex: p.sourceIndex,
      label: p.label,
      value: p.value,
      x: T,
      y: g,
      pointString: It(T) + "," + It(g)
    });
  }
  const _ = u.map((i) => i.pointString).join(" ");
  let l = "";
  if (u.length > 0) {
    const i = u[0], p = u[u.length - 1], y = It(i.x) + "," + It(A), T = It(p.x) + "," + It(A);
    l = y + " " + _ + " " + T;
  }
  return {
    points: u,
    linePoints: _,
    areaPoints: l,
    count: u.length,
    min: n,
    max: r,
    domainMin: f,
    domainMax: d,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", o = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function h(n) {
    const r = n[e];
    r && r.requestData();
  }
  function b(n) {
    const r = n[e];
    r && r._render();
  }
  const m = {
    "data-ln-chart": { prop: "name", read: Q, fallback: "", effect: b },
    "data-ln-chart-source": { effect: h },
    "data-ln-chart-sort": { effect: h },
    "data-ln-chart-type": { effect: b },
    "data-ln-chart-x": { effect: b },
    "data-ln-chart-y": { effect: b },
    "data-ln-chart-padding": { effect: b },
    "data-ln-chart-zero": { effect: b }
  }, s = et(m);
  function a(n, r) {
    n && (n.textContent = r);
  }
  function c(n) {
    this.dom = n, tt(this, n, s), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const r = this;
    return this._onSetData = function(f) {
      const d = f.detail || {};
      r._data = Array.isArray(d.data) ? d.data : [], r.isLoaded = !0, r._setLoading(!1), r._render();
    }, this._onSetLoading = function(f) {
      r._setLoading(!!(f.detail && f.detail.loading));
    }, this._onRefresh = function() {
      r.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  c.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), r = n === null ? NaN : Number(n), f = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(r) && r >= 0 ? r : 16,
      type: f === "area" || f === "polygon" ? "area" : "line",
      viewBox: this.plot && Li(this.plot.getAttribute("viewBox")) || o
    };
  }, c.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, c.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const r = this.name + "-label", f = '[data-ln-template="' + r + '"]';
    if (!this.dom.querySelector(f) && !document.querySelector(f)) return;
    const d = Tt(this.dom, r, "ln-chart");
    if (!d) return;
    const w = rt(this.dom);
    for (const v of n.points) {
      const S = d.cloneNode(!0);
      jt(S, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(S);
    }
  }, c.prototype._render = function() {
    const n = this._readOptions(), r = ki(this._data, n);
    this.model = r, this.line && (this.line.setAttribute("points", r.linePoints), this.line.toggleAttribute("hidden", r.count === 0)), this.area && (this.area.setAttribute("points", r.areaPoints), this.area.toggleAttribute("hidden", r.count === 0 || n.type !== "area"));
    const f = r.count === 0;
    this.dom.classList.toggle("ln-chart--empty", f), this.empty && this.empty.toggleAttribute("hidden", !f);
    const d = rt(this.dom);
    a(this.minimum, ct(r.min, d)), a(this.maximum, ct(r.max, d)), a(this.count, ct(r.count, d)), this._renderLabels(r), q(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: r.count,
      min: r.min,
      max: r.max
    });
  }, c.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, q(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: qi(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, j(t, e, c, "ln-chart", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-options": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-options-value": { prop: "_valueField", read: Q, fallback: "id" },
    "data-ln-options-label": { prop: "_labelField", read: Q, fallback: "name" }
  }, h = et(o);
  function b(m) {
    this.dom = m, tt(this, m, h);
    const s = this;
    return this._onSetData = function(a) {
      s._rebuild(a.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), q(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(m) {
    const s = this.dom, a = this._valueField, c = this._labelField, n = s.value, r = s.querySelectorAll("option");
    for (let d = r.length - 1; d >= 0; d--)
      r[d].value !== "" && s.removeChild(r[d]);
    for (let d = 0; d < m.length; d++) {
      const w = m[d], v = document.createElement("option");
      v.value = String(w[a]), v.textContent = w[c] != null ? w[c] : "", s.appendChild(v);
    }
    const f = s.options;
    for (let d = 0; d < f.length; d++)
      if (f[d].value === n) {
        s.value = n;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, b, "ln-options", {
    attributes: o
  });
})();
function xi(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const o = t.slice(0, e).trim(), h = t.slice(e + 1).trim();
  if (!o) return null;
  const b = {};
  return b[o] = [h], b;
}
function Ii(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-stat": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-stat-filter": { prop: "_filterRaw", read: Q, fallback: "" }
  }, h = et(o);
  function b(m) {
    return this.dom = m, tt(this, m, h), this._onSetCount = function(s) {
      m.textContent = Ii(s.detail && s.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), q(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: xi(this._filterRaw)
    }), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, b, "ln-stat", {
    attributes: o
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", o = "#ln-icon-custom-", h = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
  let m = null;
  const s = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", n = "lni:v", r = "1";
  function f() {
    try {
      if (localStorage.getItem(n) !== r) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const l = localStorage.key(_);
          l && l.indexOf(c) === 0 && localStorage.removeItem(l);
        }
        localStorage.setItem(n, r);
      }
    } catch {
    }
  }
  f();
  function d() {
    return m || (m = document.getElementById(t), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = t, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function w(_) {
    return _.indexOf(o) === 0 ? a + "/" + _.slice(o.length) + ".svg" : s + "/" + _.slice(e.length) + ".svg";
  }
  function v(_, l) {
    const i = l.match(/viewBox="([^"]+)"/), p = i ? i[1] : "0 0 24 24", y = l.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = y ? y[1].trim() : "", g = l.match(/<svg([^>]*)>/i), E = g ? g[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = _, C.setAttribute("viewBox", p), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const D = E.match(new RegExp(k + '="([^"]*)"'));
      D && C.setAttribute(k, D[1]);
    }), C.innerHTML = T, d().querySelector("defs").appendChild(C);
  }
  function S(_) {
    if (h.has(_) || b.has(_)) return;
    if (_.indexOf(o) === 0 && !a) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const l = _.slice(1);
    try {
      const p = localStorage.getItem(c + l);
      if (p) {
        v(l, p), h.add(_);
        return;
      }
    } catch {
    }
    b.add(_);
    const i = w(_);
    fetch(i).then(function(p) {
      if (!p.ok) throw new Error(p.status);
      return p.text();
    }).then(function(p) {
      v(l, p), h.add(_), b.delete(_);
      try {
        localStorage.setItem(c + l, p);
      } catch {
      }
    }).catch(function(p) {
      console.error("[ln-icon] Fetch failed for:", l, p), b.delete(_);
    });
  }
  function A(_) {
    const l = 'use[href^="' + e + '"], use[href^="' + o + '"]', i = _.querySelectorAll ? _.querySelectorAll(l) : [];
    if (_.matches && _.matches(l)) {
      const p = _.getAttribute("href");
      p && S(p);
    }
    Array.prototype.forEach.call(i, function(p) {
      const y = p.getAttribute("href");
      y && S(y);
    });
  }
  function u() {
    A(document), new MutationObserver(function(_) {
      _.forEach(function(l) {
        if (l.type === "childList")
          l.addedNodes.forEach(function(i) {
            i.nodeType === 1 && A(i);
          });
        else if (l.type === "attributes" && l.attributeName === "href") {
          const i = l.target.getAttribute("href");
          i && (i.indexOf(e) === 0 || i.indexOf(o) === 0) && S(i);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
const De = /* @__PURE__ */ new Set([
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
function Di(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const o = [];
  for (let h = 0; h <= e.length; h++) o[h] = [h];
  for (let h = 0; h <= t.length; h++) o[0][h] = h;
  for (let h = 1; h <= e.length; h++)
    for (let b = 1; b <= t.length; b++)
      e.charAt(h - 1) === t.charAt(b - 1) ? o[h][b] = o[h - 1][b - 1] : o[h][b] = Math.min(
        o[h - 1][b - 1] + 1,
        o[h][b - 1] + 1,
        o[h - 1][b] + 1
      );
  return o[e.length][t.length];
}
function Ri(t, e = De) {
  if (e.has(t)) return null;
  let o = null, h = 1 / 0;
  for (const m of e) {
    const s = Di(t, m);
    s < h && (h = s, o = m);
  }
  const b = Math.max(3, Math.floor(t.length * 0.4));
  return h <= b ? o : null;
}
function Vn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Oi(t = document) {
  const e = t.ownerDocument || t, o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const h = [], b = [o, ...o.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            h.push({
              type: "id-empty",
              element: s,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + Vn(n)) || h.push({
            type: "id-unresolved",
            element: s,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${s.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return h;
}
function Mi(t = document) {
  const e = t.ownerDocument || t, o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const h = [], b = [o, ...o.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const r = (c.value || "").trim();
          if (!r) {
            h.push({
              type: "store-empty",
              element: s,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const f = Vn(r), d = e.querySelector(`[data-ln-data-store="${f}"], [data-ln-store="${f}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(r);
          !d && !w && h.push({
            type: "store-unresolved",
            element: s,
            attribute: c.name,
            storeName: r,
            message: `[ln-debug] Unresolved store reference: <${s.tagName.toLowerCase()} ${c.name}="${r}"> targets store "${r}", but no [data-ln-data-store="${r}"] exists in the document.`
          });
        }
      }
  }
  return h;
}
function Ni(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const o = [], h = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && h.unshift(e);
  const b = /* @__PURE__ */ new Map();
  for (let m = 0; m < h.length; m++) {
    const s = h[m], a = (s.getAttribute("data-ln-data-store") || "").trim();
    a && (b.has(a) || b.set(a, []), b.get(a).push(s));
  }
  for (const [m, s] of b.entries())
    s.length > 1 && o.push({
      type: "store-duplicate",
      storeName: m,
      elements: s,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${m}". Store names must be unique across the document.`
    });
  return o;
}
function Fi(t = document, e = De) {
  const o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const h = [], b = [o, ...o.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = Ri(c.name, e), r = n ? ` Did you mean "${n}"?` : "";
          h.push({
            type: "attribute-unknown",
            element: s,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${s.tagName.toLowerCase()}>.${r}`
          });
        }
      }
  }
  return h;
}
function Ae(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const o = e.validAttributes || De, h = Oi(t), b = Mi(t), m = Ni(t), s = Fi(t, o), a = [
    ...h,
    ...b,
    ...m,
    ...s
  ];
  if (!e.silent)
    for (let c = 0; c < a.length; c++)
      console.warn(a[c].message);
  return {
    idIssues: h,
    storeIssues: b,
    uniquenessIssues: m,
    spellingIssues: s,
    total: a.length
  };
}
let Bt = null;
function Xt(t = typeof document < "u" ? document : null, e = 50, o = null) {
  if (!t) return;
  Bt && (clearTimeout(Bt), Bt = null);
  function h() {
    Bt = setTimeout(() => {
      Bt = null;
      const b = Ae(t);
      o && o(b);
    }, e);
  }
  un() > 0 ? mt(h) : h();
}
function nn(t, e, o, h) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", o), console.log("detail", h), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", o), console.log("old → new", h.oldValue, "→", h.newValue), console.groupEnd());
}
let Rt = [];
function Pi() {
  Rt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Rt.push(document.body);
}
function Bi(t) {
  for (let e = 0; e < Rt.length; e++)
    if (Rt[e].contains(t)) return !0;
  return !1;
}
function Hi(t, e, o, h) {
  if (o === window || o === document) {
    Rt.indexOf(document.body) !== -1 && nn(t, e, o, h);
    return;
  }
  Bi(o) && nn(t, e, o, h);
}
function Se() {
  Pi(), sr(Rt.length > 0 ? Hi : null);
}
function rn() {
  Se();
}
function Ui() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Se(), Vt(["data-ln-debug"], Se);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const o = {
    "data-ln-debug": {}
  };
  Ui();
  function h(m) {
    return this.dom = m, Xt(m.ownerDocument || document), rn(), this;
  }
  h.prototype.verify = function(m, s) {
    return Ae(m || (this.dom ? this.dom.ownerDocument || this.dom : document), s);
  }, h.prototype.destroy = function() {
    delete this.dom[e], rn();
  };
  const b = j(t, e, h, "ln-debug", {
    attributes: o,
    onInit: function(m) {
      typeof document < "u" && Xt(m && m.ownerDocument ? m.ownerDocument : document);
    },
    onSubtreeChange: function(m) {
      typeof document < "u" && Xt(m && m.ownerDocument ? m.ownerDocument : document);
    }
  });
  b.verify = function(m, s) {
    return Ae(m || document, s);
  }, b.schedule = function(m, s, a) {
    return Xt(m || document, s, a);
  };
})();
