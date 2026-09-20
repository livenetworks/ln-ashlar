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
    const [b, _, i] = o[h];
    Object.defineProperty(t, h, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return b(e, _, i);
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
    const i = parseFloat(t), s = parseFloat(e);
    return (isNaN(i) ? 0 : i) - (isNaN(s) ? 0 : s);
  }
  const b = t != null ? String(t) : "", _ = e != null ? String(e) : "";
  return h ? h.compare(b, _) : b < _ ? -1 : b > _ ? 1 : 0;
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
  for (let i = 0; i < o.length; i++) {
    const s = o[i], c = s.getAttribute("data-ln-field");
    e[c] != null && (s.textContent = e[c]);
  }
  const h = t.querySelectorAll("[data-ln-attr]");
  for (let i = 0; i < h.length; i++) {
    const s = h[i], c = s.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const a = c[n].trim().split(":");
      if (a.length !== 2) continue;
      const p = a[0].trim(), u = a[1].trim();
      e[u] != null && s.setAttribute(p, e[u]);
    }
  }
  const b = t.querySelectorAll("[data-ln-show]");
  for (let i = 0; i < b.length; i++) {
    const s = b[i], c = s.getAttribute("data-ln-show");
    c in e && s.classList.toggle("hidden", !e[c]);
  }
  const _ = t.querySelectorAll("[data-ln-class]");
  for (let i = 0; i < _.length; i++) {
    const s = _[i], c = s.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < c.length; n++) {
      const a = c[n].trim().split(":");
      if (a.length !== 2) continue;
      const p = a[0].trim(), u = a[1].trim();
      u in e && s.classList.toggle(p, !!e[u]);
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
    const _ = o.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(i, s) {
        return e[s] !== void 0 ? e[s] : "";
      }
    ));
  }
  const h = function(_, i) {
    return e[i] !== void 0 ? e[i] : "";
  }, b = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && b.push(t);
  for (let _ = 0; _ < b.length; _++) {
    const i = b[_], s = i.attributes;
    for (let c = 0; c < s.length; c++) {
      const n = s[c];
      n.value.indexOf("{{") !== -1 && i.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, h));
    }
  }
  return t;
}
function cr(t, e, o, h, b, _) {
  const i = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], a = n.getAttribute("data-ln-render-key");
    a && (i[a] = n);
  }
  const s = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], a = String(h(n));
    let p = i[a];
    if (p)
      b(p, n, c);
    else {
      const u = Jt(o, _);
      if (!u || (jt(u, n), p = u.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-render-key", a), b(p, n, c);
    }
    s.appendChild(p);
  }
  t.textContent = "", t.appendChild(s);
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
  const _ = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", i = Array.from(t.querySelectorAll(_));
  t.matches && t.matches(_) && i.push(t);
  for (const s of i)
    s[o] || (window.lnCore._persistSink && s.hasAttribute("data-ln-persist") && window.lnCore._persistSink(s, e), s[o] = new h(s));
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
  const o = !!(e && e.typed), h = e && e.exclude, b = {}, _ = t.elements, i = {};
  if (o)
    for (let s = 0; s < _.length; s++) {
      const c = _[s];
      c.name && c.type === "checkbox" && !c.disabled && (i[c.name] = (i[c.name] || 0) + 1);
    }
  for (let s = 0; s < _.length; s++) {
    const c = _[s];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(h && c.matches && c.matches(h)))
      if (c.type === "checkbox")
        o && i[c.name] === 1 ? b[c.name] = c.checked : (b[c.name] || (b[c.name] = []), c.checked && b[c.name].push(c.value));
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
  for (let _ = 0; _ < o.length; _++) {
    const i = o[_];
    i.name && i.type === "checkbox" && (b[i.name] = (b[i.name] || 0) + 1);
  }
  for (let _ = 0; _ < o.length; _++) {
    const i = o[_];
    if (i.type === "file" || i.type === "submit" || i.type === "button") continue;
    const s = i.getAttribute("data-ln-fill-as") || i.name;
    if (!s || !(s in e)) continue;
    const c = e[s];
    if (i.type === "checkbox") {
      if (Array.isArray(c))
        i.checked = c.indexOf(i.value) !== -1;
      else if (b[i.name] > 1) {
        const n = String(c).split(",").map(function(a) {
          return a.trim();
        });
        i.checked = n.indexOf(i.value) !== -1;
      } else
        i.checked = fr(c);
      h.push(i);
    } else if (i.type === "radio")
      i.checked = i.value === String(c), h.push(i);
    else if (i.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < i.options.length; n++)
          i.options[n].selected = c.indexOf(i.options[n].value) !== -1;
      h.push(i);
    } else
      i.value = c, h.push(i);
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
      h ? h.call(this, b, (_) => e.set.call(this, _)) : e.set.call(this, b);
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
    const _ = t[b];
    if (!e[_.attribute]) continue;
    const i = _.effects && _.effects[o];
    i ? i(e, o, h) : _.onAttrChange && (!_.declared || _.declared.has(o)) && _.onAttrChange(e, o, h);
  }
}
function mr(t) {
  const e = t.target, o = t.attributeName;
  if (t.oldValue === e.getAttribute(o)) return;
  const h = hn(), b = h.byAttr.get(o);
  if (window.lnCore._debugSink && (o.indexOf("data-ln-") === 0 || b) && window.lnCore._debugSink("attr", o, e, { oldValue: t.oldValue, newValue: e.getAttribute(o) }), o.indexOf("data-ln-") === 0) {
    const _ = h.byReactive.get(o);
    _ && Fe(_, e, o, t.oldValue), h.reactiveWildcard.length && Fe(h.reactiveWildcard, e, o, t.oldValue);
  }
  if (b)
    for (let _ = 0; _ < b.length; _++) {
      const i = b[_];
      if (i.handler) {
        i.handler(e, o, t.oldValue);
        continue;
      }
      i.onAttributeChange && e[i.attribute] ? i.onAttributeChange(e, o) : (Le(e, i.selector, i.attribute, i.ComponentFn), i.onInit && i.onInit(e));
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
          const b = h.query, _ = t.target.nodeType === 1 ? t.target.matches(b) ? t.target : t.target.closest(b) : t.target.parentElement ? t.target.parentElement.closest(b) : null;
          _ && h.onSubtreeChange(_, t);
        }
      }
    for (let o = 0; o < t.addedNodes.length; o++) {
      const h = t.addedNodes[o];
      if (h.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const _ = e[b];
          Le(h, _.selector, _.attribute, _.ComponentFn), _.onInit && _.onInit(h);
        }
    }
    for (let o = 0; o < t.removedNodes.length; o++) {
      const h = t.removedNodes[o];
      if (h.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const _ = e[b], i = _.query, s = Array.from(h.querySelectorAll(i));
          h.matches && h.matches(i) && s.push(h);
          for (let c = 0; c < s.length; c++) {
            const n = s[c];
            if (!document.contains(n)) {
              const a = n[_.attribute];
              a && typeof a.destroy == "function" && a.destroy(), delete n[_.attribute];
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
  const _ = b.extraAttributes || [], i = b.onAttributeChange || null, s = b.onSubtreeChange || null, c = b.onInit || null, n = b.onAttrChange || null, a = b.effects || null, p = b.attributes || null, u = p ? ir(p) : a, w = p ? new Set(Object.keys(p)) : null, v = b.persist || null;
  function S(r) {
    const f = r || document.body;
    Le(f, t, e, o), c && c(f);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const r = /\[([\w-]+)/g;
    let f;
    for (; (f = r.exec(t)) !== null; )
      A.push(f[1]);
  } else
    A.push(t);
  fn({
    selector: t,
    attribute: e,
    ComponentFn: o,
    onInit: c,
    observed: A.concat(_),
    onAttributeChange: i,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: v
  }), pn();
  const g = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  mn().push({
    selector: t,
    attribute: e,
    ComponentFn: o,
    onInit: c,
    onSubtreeChange: s,
    query: g
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
  const _ = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, i = typeof t.onChange == "function" ? t.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = 0, p = 0, u = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, d = !1;
  function g(y) {
    c.set(y, ++S);
  }
  function l() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function r() {
    if (s.size <= e) return;
    const y = Array.from(s.keys()).sort(function(m, E) {
      return (c.get(m) || 0) - (c.get(E) || 0);
    });
    let T = 0;
    for (; s.size > e && T < y.length; )
      s.delete(y[T]), c.delete(y[T]), T++;
  }
  function f(y, T) {
    n.add(y), _(w, y, T);
  }
  return {
    get: function(y) {
      return s.get(y);
    },
    has: function(y) {
      return s.has(y);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return a;
    },
    get grandTotal() {
      return p;
    },
    get queryGen() {
      return u;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(y, T) {
      clearTimeout(v), A = y;
      for (let I = y; I < T; I++)
        s.has(I) && g(I);
      if (a <= 0) return;
      const m = Math.max(0, y - h), E = Math.min(a, T + h), C = Math.floor(m / o), k = Math.floor(Math.max(0, E - 1) / o);
      let D = -1;
      for (let I = C; I <= k; I++) {
        const R = I * o, O = Math.min(o, a - R);
        let P = !1;
        const B = Math.max(R, m), U = Math.min(R + O, E);
        for (let z = B; z < U; z++)
          if (!s.has(z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (v = setTimeout(function() {
        f(D, o);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== u) return !1;
      const T = y.offset || 0, m = y.data || [];
      let E = 0;
      for (let C = 0; C < m.length; C++)
        m[C] != null && E++;
      if (E === 0 && (y.provisional || y.filtered > 0))
        return n.delete(T), !1;
      d && (s.clear(), c.clear(), d = !1), y.provisional || (p = y.total != null ? y.total : p, a = y.filtered != null ? y.filtered : y.data ? y.data.length : a);
      for (let C = 0; C < m.length; C++)
        m[C] != null && (s.set(T + C, m[C]), g(T + C));
      return n.delete(T), r(), i(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (w = y), f(0, o);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(y) {
      u++, n.clear(), clearTimeout(v), y && (w = y), d = !0, f(0, o);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(v), d = !0;
      const y = Math.max(0, Math.floor(A / o) * o);
      f(y, o);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(y) {
      n.delete(y);
    },
    destroy: function() {
      clearTimeout(v), s.clear(), c.clear(), n.clear();
    },
    configure: function(y) {
      y = y || {};
      let T = !1;
      if (y.windowSize != null && y.windowSize > 0 && y.windowSize !== e) {
        const m = y.windowSize < e;
        e = y.windowSize, m && r(), T = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (o = y.pageSize), y.threshold != null && y.threshold >= 0 && (h = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (b = y.fetchDebounce), T && i();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (p = y, l() || (a = y), i());
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
  for (let _ = 0; _ < b.length; _++) {
    const i = b[_];
    if (!i) continue;
    const s = i.indexOf(":"), c = s > -1 ? i.slice(0, s) : i, n = s > -1 ? i.slice(s + 1) : "";
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
  const b = Object.keys(o).map(function(_) {
    const i = o[_];
    return i === "" ? _ : _ + ":" + encodeURIComponent(i);
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
  const o = t.slice(0, e), h = t.slice(e + 1), b = h ? h.split(",").map(function(_) {
    try {
      return decodeURIComponent(_);
    } catch {
      return _;
    }
  }).filter(Boolean) : [];
  return { key: o, values: b };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = ke, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = En, window.lnCore.hashSortDecode = ge, window.lnCore.hashFilterEncode = An, window.lnCore.hashFilterDecode = _e);
function Zt(t, e, o, h) {
  const b = typeof h == "number" ? h : 4, _ = window.innerWidth, i = window.innerHeight, s = e.width, c = e.height, n = (o || "bottom").split("-"), a = n[0], p = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[a] || u.bottom;
  function v(l) {
    return l === "top" || l === "bottom" ? p === "start" ? t.left : p === "end" ? t.right - s : t.left + (t.width - s) / 2 : p === "start" ? t.top : p === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(l) {
    let r, f, y = !0;
    return l === "top" ? (r = t.top - b - c, f = v(l), r < 0 && (y = !1)) : l === "bottom" ? (r = t.bottom + b, f = v(l), r + c > i && (y = !1)) : l === "left" ? (r = v(l), f = t.left - b - s, f < 0 && (y = !1)) : (r = v(l), f = t.right + b, f + s > _ && (y = !1)), { top: r, left: f, side: l, fits: y };
  }
  let A = null;
  for (let l = 0; l < w.length; l++) {
    const r = S(w[l]);
    if (r.fits) {
      A = r;
      break;
    }
  }
  A || (A = S(w[0]));
  let d = A.top, g = A.left;
  return s >= _ ? g = 0 : (g < 0 && (g = 0), g + s > _ && (g = _ - s)), c >= i ? d = 0 : (d < 0 && (d = 0), d + c > i && (d = i - c)), { top: d, left: g, placement: A.side };
}
function be(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, o = e.visibility, h = e.display, b = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const _ = t.offsetWidth, i = t.offsetHeight;
  return e.visibility = o, e.display = h, e.position = b, { width: _, height: i };
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
    const h = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), _ = typeof t == "string" ? t : JSON.stringify(t), i = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      o,
      h.encode(_)
    ), s = btoa(String.fromCharCode(...b)), c = btoa(String.fromCharCode(...new Uint8Array(i)));
    return {
      encrypted: !0,
      iv: s,
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
    const h = new TextDecoder(), b = Uint8Array.from(atob(t.iv), (c) => c.charCodeAt(0)), _ = Uint8Array.from(atob(t.data), (c) => c.charCodeAt(0)), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      o,
      _
    ), s = h.decode(i);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (h) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", h), { ...t, decryptionError: !0 };
  }
}
function Sn(t, e = 100, o = 0) {
  const h = parseFloat(String(t)) || 0, b = parseFloat(String(e)) || 100, _ = parseFloat(String(o)) || 0, i = Math.max(_, Math.min(h, b)), s = b - _;
  let c = 0;
  return s > 0 && (c = (i - _) / s * 100), c = Math.max(0, Math.min(100, c)), {
    value: h,
    min: _,
    max: b,
    clampedValue: i,
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
    let b = "", _ = ".";
    for (let i = 0; i < h.length; i++)
      h[i].type === "group" && (b = h[i].value), h[i].type === "decimal" && (_ = h[i].value);
    yt[e] = { groupSep: b, decimalSep: _, fmt: o };
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
  const _ = parseFloat(b);
  return isNaN(_) ? NaN : _;
}
function ct(t, e, o = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const h = e || "default", b = o.maxDecimals != null ? parseInt(o.maxDecimals, 10) : null, _ = o.userDecimals != null ? o.userDecimals : null;
  if (b !== null) {
    const i = h + "|max:" + b;
    return yt[i] || (yt[i] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: b
    })), yt[i].format(t);
  }
  if (_ !== null && _ > 0) {
    const i = h + "|exact:" + _;
    return yt[i] || (yt[i] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: _,
      maximumFractionDigits: _
    })), yt[i].format(t);
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
  function h(i, s) {
    s = s || {};
    const c = Cr(i), n = Tr(i, s), a = Lr(c, n);
    qr(n) && e.has(a) && (e.get(a).abort(), e.delete(a));
    const p = new AbortController(), u = s.signal;
    let w = null;
    u && (u.aborted ? p.abort(u.reason) : (w = function() {
      p.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, s, { signal: p.signal });
    return e.set(a, p), t(i, v).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(a) === p && e.delete(a);
    });
  }
  h.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = h;
  function b(i) {
    if (!i.detail || !i.detail.url) return;
    const s = i.target, c = (i.detail.method || (i.detail.body ? "POST" : "GET")).toUpperCase(), n = i.detail.key;
    n && o.has(n) && (o.get(n).abort(), o.delete(n));
    const a = new AbortController(), p = i.detail.signal;
    let u = null;
    p && (p.aborted ? a.abort(p.reason) : (u = function() {
      a.abort(p.reason);
    }, p.addEventListener("abort", u, { once: !0 }))), n && o.set(n, a);
    const w = { method: c, signal: a.signal };
    i.detail.body !== void 0 && (w.body = i.detail.body), window.fetch(i.detail.url, w).then(function(v) {
      p && u && p.removeEventListener("abort", u), n && o.get(n) === a && o.delete(n), q(s, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      p && u && p.removeEventListener("abort", u), n && o.get(n) === a && o.delete(n), !(v && v.name === "AbortError") && q(s, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
      });
    });
  }
  function _(i) {
    const s = i.detail || {};
    s.all ? window.lnHttp.cancelAll() : s.key ? window.lnHttp.cancelByKey(s.key) : s.url && window.lnHttp.cancel(s.url);
  }
  document.addEventListener("ln-http:request", b), document.addEventListener("ln-http:cancel", _), window.lnHttp = {
    cancel: function(i) {
      let s = !1;
      return e.forEach(function(c, n) {
        n.endsWith(" " + i) && (c.abort(), e.delete(n), s = !0);
      }), s;
    },
    cancelByKey: function(i) {
      return o.has(i) ? (o.get(i).abort(), o.delete(i), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(i) {
        i.abort();
      }), e.clear(), o.forEach(function(i) {
        i.abort();
      }), o.clear();
    },
    get inflight() {
      const i = [];
      return e.forEach(function(s, c) {
        const n = c.indexOf(" ");
        i.push({ method: c.slice(0, n), url: c.slice(n + 1) });
      }), o.forEach(function(s, c) {
        i.push({ key: c });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", b), document.removeEventListener("ln-http:cancel", _), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-include": { prop: "url", read: Q, fallback: "" }
  }, h = et(o), b = /* @__PURE__ */ new Map();
  function _(i) {
    if (this.dom = i, tt(this, i, h), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    pr(), this._held = !0;
    const s = this, c = this.url;
    let n = b.get(c);
    return n || (n = fetch(c).then(function(a) {
      if (!a.ok)
        throw new Error("HTTP error! status: " + a.status);
      return a.text();
    }).catch(function(a) {
      throw b.delete(c), a;
    }), b.set(c, n)), n.then(function(a) {
      if (s._destroyed) return;
      const p = document.createElement("template");
      p.innerHTML = a, s.dom.content.appendChild(p.content), q(s.dom, "ln-include:loaded", { target: s.dom, url: s.url }), s._held && (s._held = !1, ue());
    }).catch(function(a) {
      s._destroyed || (console.error("[ln-include] Failed to fetch template from " + s.url + ":", a), q(s.dom, "ln-include:error", { target: s.dom, url: s.url, error: a }), s._held && (s._held = !1, ue()));
    }), this;
  }
  _.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ue()), delete this.dom[e]);
  }, j(t, e, _, "ln-include", {
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
  function b(_) {
    this.dom = _, tt(this, _, h), this._baseAction = _.getAttribute("action") || "";
    const i = this;
    return this._onLnFill = function(s) {
      s.target === i.dom && (s.detail ? (i.fill(s.detail), i._applyActionMode(s.detail)) : i.dom.reset());
    }, this._onReset = function() {
      i._applyActionMode(null);
    }, _.addEventListener("ln-fill", this._onLnFill), _.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(_) {
    const i = cn(this.dom, _);
    for (let s = 0; s < i.length; s++) {
      const c = i[s], n = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let _ = this.dom.querySelector('input[name="_method"]');
    return _ || (_ = document.createElement("input"), _.type = "hidden", _.name = "_method", _.value = "", this.dom.appendChild(_)), _;
  }, b.prototype._applyActionMode = function(_) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const i = _ && _.id != null && _.id !== "" ? _.id : null, s = this._ensureMethodInput();
    if (i !== null) {
      const c = this._actionEdit;
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(i))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(i)), s.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
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
      const _ = h[b], i = Be[_];
      t[i] && o.push(_);
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
  const t = "data-ln-validate", e = "lnValidate", o = "data-ln-validate-errors", h = "data-ln-validate-error", b = "ln-validate-valid", _ = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-validate": {},
    "data-ln-validate-errors": {},
    "data-ln-validate-error": {}
  };
  function s(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, a = c.tagName, p = c.type, u = a === "SELECT" || p === "checkbox" || p === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(S) {
      const A = S.detail && S.detail.error;
      if (!A) return;
      n._customErrors.add(A), n._touched = !0;
      const d = c.closest(".form-element");
      if (d) {
        const g = d.querySelector("[" + h + '="' + A + '"]');
        g && g.classList.remove("hidden");
      }
      c.classList.remove(b), c.classList.add(_), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, d = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), d) {
          const g = d.querySelector("[" + h + '="' + A + '"]');
          g && g.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(g) {
          if (d) {
            const l = d.querySelector("[" + h + '="' + g + '"]');
            l && l.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, u || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = c.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(S) {
      n._touched = !0, !n.validate() && S.detail && S.detail.invalidFields && S.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(S) {
      const A = { invalidFields: [] };
      q(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((d, g) => d.compareDocumentPosition(g) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (c.value && c.value.trim() !== "" || c.checked) && (this._touched = !0, this.validate()), this;
  }
  s.prototype.validate = function() {
    const c = this.dom, n = c.validity, a = He(n, this._customErrors.size), p = kr(n, this._customErrors), u = c.closest(".form-element");
    if (u) {
      const v = u.querySelector("[" + o + "]");
      if (v) {
        const S = v.querySelectorAll("[" + h + "]");
        for (let A = 0; A < S.length; A++) {
          const d = S[A].getAttribute(h);
          S[A].classList.toggle("hidden", !p.includes(d));
        }
      }
    }
    return c.classList.toggle(b, a), c.classList.toggle(_, !a), c.setAttribute("aria-invalid", a ? "false" : "true"), q(c, a ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: p }), a;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, _), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + h + "]");
      for (let a = 0; a < n.length; a++)
        n[a].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return He(this.dom.validity, this._customErrors.size);
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, _), this.dom.removeAttribute("aria-invalid"), q(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, s, "ln-validate", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", o = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function h(p) {
    if (!p.hasAttribute(t) || p[e]) return;
    p[e] = !0;
    const u = c(p);
    b(u.links), _(u.forms);
  }
  function b(p) {
    for (const u of p) {
      if (u[e + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const w = u.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!gn(S, u)) return;
        S.preventDefault();
        const A = u.getAttribute("href");
        A && s("GET", A, null, u);
      };
      u.addEventListener("click", v), u[e + "Trigger"] = v;
    }
  }
  function _(p) {
    for (const u of p) {
      if (u[e + "Trigger"]) continue;
      if (u.hasAttribute(o)) {
        u[e + "ScopeWarned"] || (u[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const S = u.method.toUpperCase(), A = u.action, d = new FormData(u);
        for (const g of u.querySelectorAll('button, input[type="submit"]'))
          g.disabled = !0;
        s(S, A, d, u, function() {
          for (const g of u.querySelectorAll('button, input[type="submit"]'))
            g.disabled = !1;
        });
      };
      u.addEventListener("submit", w), u[e + "Trigger"] = w;
    }
  }
  function i(p) {
    if (!p[e]) return;
    const u = c(p);
    for (const w of u.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of u.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete p[e];
  }
  function s(p, u, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: p, url: u }).defaultPrevented) return;
    q(v, "ln-ajax:start", { method: p, url: u }), v.classList.add("ln-ajax--loading");
    const d = document.createElement("span");
    d.className = "ln-ajax-spinner", v.appendChild(d);
    function g() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let l = u;
    const r = document.querySelector('meta[name="csrf-token"]'), f = r ? r.getAttribute("content") : null;
    w instanceof FormData && f && w.append("_token", f);
    const y = {
      method: p,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (f && (y.headers["X-CSRF-TOKEN"] = f), p === "GET" && w) {
      const T = new URLSearchParams(w);
      l = u + (u.includes("?") ? "&" : "?") + T.toString();
    } else p !== "GET" && w && (y.body = w);
    fetch(l, y).then(function(T) {
      const m = T.ok, E = T.status;
      return T.text().then(function(C) {
        let k = null, D = null;
        if (C && C.trim())
          try {
            k = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: m, status: E, data: k, parseError: D };
      });
    }).then(function(T) {
      const m = T.status, E = T.data, C = T.parseError;
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
        q(v, "ln-ajax:success", { method: p, url: l, data: E });
      } else
        q(v, "ln-ajax:error", {
          method: p,
          url: l,
          status: m,
          data: E,
          error: C || null
        });
      q(v, "ln-ajax:complete", { method: p, url: l }), g();
    }).catch(function(T) {
      q(v, "ln-ajax:error", { method: p, url: l, status: 0, data: null, error: T }), q(v, "ln-ajax:complete", { method: p, url: l }), g();
    });
  }
  function c(p) {
    const u = { links: [], forms: [] };
    return p.tagName === "A" && p.getAttribute(t) !== "false" ? u.links.push(p) : p.tagName === "FORM" && p.getAttribute(t) !== "false" ? u.forms.push(p) : (u.links = Array.from(p.querySelectorAll('a:not([data-ln-ajax="false"])')), u.forms = Array.from(p.querySelectorAll('form:not([data-ln-ajax="false"])'))), u;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(u) {
        for (const w of u)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (h(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  h(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = c(v);
                  b(A.links), _(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(u) {
        h(u);
      });
    }, "ln-ajax");
  }
  function a() {
    for (const p of document.querySelectorAll("[" + t + "]"))
      h(p);
  }
  window[e] = h, window[e].destroy = i, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
function xr(t, { isHydration: e = !1, hasPrimaryRegion: o = !1, primaryMatch: h = null } = {}) {
  const b = o ? !h : !t.some((n) => n.match), _ = [], i = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const a = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !a && n.targetEl && _.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || i.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  i.sort((n, a) => n.regionKey === "__primary__" ? -1 : a.regionKey === "__primary__" ? 1 : 0);
  const c = i.find((n) => n.regionKey === "__primary__") || i[0] || null;
  return { notFound: b, clears: _, swaps: i, owner: c };
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
    const _ = new URL(t, window.location.origin);
    t = _.pathname + _.search + _.hash;
  } catch {
  }
  let [e] = t.split("#"), [o, h] = e.split("?");
  const b = {};
  if (h) {
    const _ = new URLSearchParams(h);
    for (const [i, s] of _.entries())
      b[i] = s;
  }
  return o = o.replace(/\/+$/, ""), o === "" && (o = "/"), { path: o, query: b };
}
function On(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const o = t.segments, h = e.segments, b = Math.max(o.length, h.length);
  for (let _ = 0; _ < b; _++) {
    const i = o[_], s = h[_];
    if (i === void 0) return 1;
    if (s === void 0) return -1;
    if (i === "*") return 1;
    if (s === "*") return -1;
    const c = i.startsWith(":"), n = s.startsWith(":");
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
    const b = h.segments, _ = {};
    let i = !0;
    if (!(o.length > b.length && b[b.length - 1] !== "*")) {
      for (let s = 0; s < b.length; s++) {
        const c = b[s], n = o[s];
        if (c === "*") {
          _.wildcard = o.slice(s).join("/");
          break;
        }
        if (n === void 0) {
          i = !1;
          break;
        }
        if (c.startsWith(":"))
          _[c.slice(1)] = decodeURIComponent(n);
        else if (c !== n) {
          i = !1;
          break;
        }
      }
      if (i && (b.indexOf("*") !== -1 || o.length <= b.length))
        return { route: h, params: _ };
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
    for (const _ of Object.keys(b))
      if (_.startsWith("ln") && b[_] && typeof b[_].destroy == "function")
        try {
          b[_].destroy();
        } catch (i) {
          console.error(`[ln-router] Error destroying component ${_} on element:`, b, i);
        }
  const h = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of h) {
    const _ = b.lnPopover;
    if (_ && _.trigger && t.contains(_.trigger))
      try {
        _.destroy();
      } catch (i) {
        console.error("[ln-router] Error destroying open popover:", i);
      }
  }
}
function zt(t, e = {}) {
  const { path: o, query: h } = ne(t), b = /* @__PURE__ */ new Map();
  for (const [u, w] of _t)
    b.set(u, Mn(o, w.sorted));
  const _ = b.get("__primary__") || null, i = we("__primary__", { warn: !!_ }), s = _t.has("__primary__"), c = [];
  for (const [u, w] of b) {
    const v = u === "__primary__" ? i : we(u, { warn: !1 }), S = !v && !!(_ && _.route && _.route.templateNode && _.route.templateNode.content && _.route.templateNode.content.querySelector("#" + CSS.escape(u)));
    !v && !S && w && console.warn(`[ln-router] Explicit target element #${u} not found in DOM`), c.push({
      regionKey: u,
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
    hasPrimaryRegion: s,
    primaryMatch: _
  });
  if (n.notFound) {
    ze(document.body, "ln-router:not-found", { path: o });
    return;
  }
  if (Z(i || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: _ ? _.params : {},
    query: h
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const p = function() {
    for (const u of n.clears)
      Ke(u.targetEl), u.targetEl.replaceChildren(), fe.delete(u.targetEl);
    for (const u of n.swaps) {
      if ((u.isPending || !u.targetEl || !document.contains(u.targetEl)) && (u.targetEl = u.regionKey === "__primary__" ? i : document.getElementById(u.regionKey)), !u.targetEl) {
        console.warn(`[ln-router] Target element #${u.regionKey} could not be resolved`);
        continue;
      }
      if (u.skipMount || (Ke(u.targetEl), u.targetEl.replaceChildren(u.match.route.templateNode.content.cloneNode(!0))), fe.set(u.targetEl, u.match.route.templateNode), n.owner && u.regionKey === n.owner.regionKey) {
        if (u.match.route.title) {
          let w = u.match.route.title;
          if (u.match.params)
            for (const [v, S] of Object.entries(u.match.params))
              w = w.replace(new RegExp("\\{\\{\\s*" + v + "\\s*\\}\\}", "g"), S);
          document.title = w;
        }
        if (!e.isHydration) {
          u.targetEl.hasAttribute("tabindex") || u.targetEl.setAttribute("tabindex", "-1");
          const w = u.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          w ? (w.setAttribute("tabindex", "-1"), w.focus()) : u.targetEl.focus(), u.regionKey === "__primary__" && u.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      ze(u.targetEl, "ln-router:navigated", {
        path: t,
        params: u.match.params,
        query: h,
        route: u.match.route,
        target: u.targetEl,
        region: u.regionKey
      });
    }
    ee = t, Dn = h, Rn = _ ? _.route : null, In = _ ? _.params : {}, xn = new Map(
      Array.from(b.entries()).map(([u, w]) => [u, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(p) : p();
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
    const _ = o[b];
    if (t[_] !== e[_]) return !1;
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
  const _ = t.getAttribute("data-ln-route-title"), i = e.split("/").filter(Boolean), s = {
    pattern: e,
    segments: i,
    target: o,
    title: _,
    templateNode: t
  }, c = we(h);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), b.routes.set(e, s), b.sorted = Array.from(b.routes.values()).sort(On);
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
  function h(_) {
    this.dom = _, this.isOpen = _.getAttribute(t) === "open";
    const i = this;
    return this._onRequestOpen = function() {
      i.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      i.dom.setAttribute(t, "close");
    }, this._onCancel = function(s) {
      s.preventDefault(), i.dom.setAttribute(t, "close");
    }, this._onClickClose = function(s) {
      const c = s.target.closest("[data-ln-modal-close]");
      c && i.dom.contains(c) && (s.preventDefault(), i.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  h.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, h.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, h.prototype.toggle = function() {
    const _ = this.dom.getAttribute(t);
    this.dom.setAttribute(t, _ === "open" ? "close" : "open");
  }, h.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(s) {
            return s !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      q(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function b(_) {
    const i = _[e];
    if (!i) return;
    const c = _.getAttribute(t) === "open";
    if (c !== i.isOpen)
      if (c) {
        if (Z(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(t, "close");
          return;
        }
        i.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const a = _.querySelector("[autofocus]");
        if (a && Ut(a))
          a.focus();
        else {
          const p = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(p, Ut);
          if (u) u.focus();
          else {
            const w = _.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, Ut);
            v && v.focus();
          }
        }
        q(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (Z(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(t, "open");
          return;
        }
        i.isOpen = !1, q(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
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
  function b(d) {
    const g = {};
    let l = d;
    const r = [];
    for (; l; ) {
      const f = l.closest("[" + t + "]");
      if (!f) break;
      f[e] && f[e].dict && r.unshift(f[e].dict), l = f.parentElement;
    }
    for (const f of r)
      Object.assign(g, f);
    return g;
  }
  function _(d, g) {
    if (g) {
      if (d) {
        const r = d.closest("[" + t + "]");
        if (r) {
          if (r.id === g && r.hasAttribute("data-ln-modal")) return r;
          const f = r.querySelector("#" + CSS.escape(g) + '[data-ln-modal], [data-ln-modal="' + g + '"]');
          if (f) return f;
        }
      }
      const l = document.getElementById(g) || document.querySelector('[data-ln-modal="' + g + '"]');
      if (l) return l;
    }
    if (d) {
      const l = d.closest("[" + t + "]");
      if (l) {
        if (l.hasAttribute("data-ln-modal")) return l;
        const f = l.querySelector("[data-ln-modal]");
        if (f) return f;
      }
      const r = d.closest("[data-ln-modal]");
      if (r) return r;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function i(d, g) {
    if (d !== "edit") return "";
    if (g) {
      const l = g.getAttribute("data-ln-fill-id");
      if (l) return l;
    }
    return "edit";
  }
  function s(d) {
    if (!d) return;
    const g = d.querySelectorAll("[data-ln-field]");
    for (let r = 0; r < g.length; r++)
      g[r].textContent = "";
    const l = d.querySelectorAll("form");
    for (let r = 0; r < l.length; r++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(l[r], null) : l[r].reset();
  }
  document.addEventListener("click", function(d) {
    if (d.ctrlKey || d.metaKey || d.button === 1) return;
    const g = d.target.closest("[data-ln-modal-for]");
    if (g) {
      const r = g.getAttribute("data-ln-modal-for"), f = _(g, r);
      if (f && f.lnModal) {
        d.preventDefault();
        const y = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, m = g.dataset;
        for (const k in m) {
          if (!k.startsWith("lnModal") || y[k]) continue;
          const D = k.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = m[k]);
        }
        const E = Object.keys(T).length > 0;
        g.hasAttribute("data-ln-modal-mode") ? f.dataset.lnModalMode = g.getAttribute("data-ln-modal-mode") : f.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(f, T) : f.dataset.lnModalMode === "new" && s(f), f.getAttribute("data-ln-modal") === "open" ? q(f, "ln-modal:request-close", {}) : (f.id && dt(f.id, i(f.dataset.lnModalMode, g)), q(f, "ln-modal:request-open", {}));
      }
      return;
    }
    const l = d.target.closest('a[href^="#"]');
    if (l) {
      const r = se(l.getAttribute("href"));
      for (const f in r) {
        const y = document.getElementById(f);
        if (y && y.lnModal) {
          if (!ke(d)) return;
          dt(f, r[f]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(d) {
    const g = d.target;
    if (!g || !g.lnModal) return;
    (g.dataset.lnModalMode || "new") === "new" && s(g);
  }), document.addEventListener("ln-modal:open", function(d) {
    const g = d.target;
    if (!g || !g.lnModal || !g.id) return;
    let l = ot(g.id);
    l === null && (l = i(g.dataset.lnModalMode, null), dt(g.id, l)), l ? (g.dataset.lnModalMode = "edit", q(g, "ln-fill:request", { id: l })) : (g.dataset.lnModalMode = "new", s(g));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const d = document.querySelectorAll("[data-ln-modal][id]");
        for (let g = 0; g < d.length; g++) {
          const l = d[g];
          if (!l.lnModal) continue;
          const r = l.id, f = ot(r), y = f !== null, T = l.lnModal.isOpen;
          if (y) {
            const m = f ? "edit" : "new";
            l.dataset.lnModalMode = m, T ? f ? q(l, "ln-fill:request", { id: f }) : s(l) : q(l, "ln-modal:request-open", {});
          } else T && q(l, "ln-modal:request-close", {});
        }
      } finally {
        c = !1;
      }
    }
  }
  function a() {
    const d = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let g = 0; g < d.length; g++) {
      const l = d[g];
      l.lnModal && ot(l.id) === null && dt(l.id, i(l.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function p() {
    a(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(p);
  }) : mt(p);
  function u(d) {
    const l = (d.detail || {}).data;
    if (l && l.message) {
      const f = l.message;
      q(window, "ln-toast:enqueue", {
        type: f.type || "success",
        title: f.title || "",
        message: f.body || ""
      });
    }
    const r = d.target.closest("[data-ln-modal]");
    r && r.lnModal && (r.id && dt(r.id, null), q(r, "ln-modal:request-close", {}), s(r));
  }
  function w(d) {
    const g = d.detail || {}, l = g.data, r = g.status || 0, f = b(d.target);
    if (l && l.message) {
      const y = l.message;
      q(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else r === 0 ? q(window, "ln-toast:enqueue", {
      type: "error",
      title: f["network-error-title"] || "",
      message: f["network-error"] || "Network error"
    }) : q(window, "ln-toast:enqueue", {
      type: "error",
      title: f["server-error-title"] || "",
      message: f["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", u), document.addEventListener("ln-ajax:error", w);
  function v(d) {
    const g = d.detail || {}, l = b(d.target), r = g.message || (g.reason === "max-size" ? l["upload-max-size"] || "File is too large" : g.reason === "max-files" ? l["upload-max-files"] || "Maximum file count exceeded" : l["upload-invalid-type"] || "This file type is not allowed"), f = l["upload-invalid-title"] || "Invalid File";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: f,
      message: r
    });
  }
  function S(d) {
    const g = d.detail || {}, l = b(d.target), r = g.message || l["upload-failed"] || "Failed to upload file", f = l["upload-error-title"] || "Upload Error";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: f,
      message: r
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(d) {
    const g = d.target;
    !g || !g.lnModal || (g.id && ot(g.id) !== null && dt(g.id, null), g.dataset.lnModalMode === "new" && s(g));
  });
  function A(d) {
    return this.dom = d, this.dict = re(d, o), this;
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
  function o(i) {
    const s = i[e];
    s && (s.isTextElement ? s._initTextElement() : isNaN(s.value) || s._displayFormatted(s.value));
  }
  const h = {
    "data-ln-number": { effect: o },
    "data-ln-value": { effect: o },
    "data-ln-number-decimals": { effect: o },
    "data-ln-number-min": { effect: o },
    "data-ln-number-max": { effect: o }
  }, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(i) {
    if (i[e]) return i[e];
    i[e] = this, this.dom = i;
    const s = this;
    if (this._onLocaleChange = function() {
      s.isTextElement ? s._formatTextContent() : isNaN(s.value) || s._displayFormatted(s.value);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = i.name, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.type = "text", i.setAttribute("inputmode", "decimal"), i.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return b.get.call(c);
      },
      set: function(a) {
        if (b.set.call(c, a), a !== "" && !isNaN(parseFloat(a))) {
          const p = s.dom.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ct(parseFloat(a), rt(s.dom), { maxDecimals: p }));
        } else
          s._setDisplayRaw("");
        s.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), dn(i, b, {
      get: function() {
        return b.get.call(i);
      },
      set: function(a) {
        if (a === "") {
          s._setDisplayRaw(""), s._setHiddenRaw(""), i.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const p = typeof a == "number" ? a : parseFloat(String(a));
        if (isNaN(p))
          s._setDisplayRaw(String(a)), s._setHiddenRaw("");
        else {
          s._setHiddenRaw(p);
          const u = i.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ct(p, rt(i), { maxDecimals: u }));
        }
        i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      s._handleInput();
    }, i.addEventListener("input", this._onInput), this._onKeyDown = function(a) {
      if (a.key !== "Backspace") return;
      const p = i.selectionStart, u = i.selectionEnd;
      if (p !== u || p === 0) return;
      const w = te(rt(i)), v = b.get.call(i), S = v[p - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        a.preventDefault();
        const A = p - 2 >= 0 ? p - 2 : 0, d = v.slice(0, A) + v.slice(p);
        b.set.call(i, d), i.setSelectionRange(A, A), i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, i.addEventListener("keydown", this._onKeyDown), this._onPaste = function(a) {
      a.preventDefault();
      const p = (a.clipboardData || window.clipboardData).getData("text"), u = Er(p, rt(i));
      s.value = isNaN(u) ? NaN : u;
    }, i.addEventListener("paste", this._onPaste);
    const n = i.value;
    if (n !== "") {
      const a = parseFloat(n);
      if (!isNaN(a)) {
        const p = i.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(a), this._setDisplayRaw(ct(a, rt(i), { maxDecimals: p })), i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  _.prototype._initTextElement = function() {
    const i = this.dom;
    let s = i.getAttribute("data-ln-value"), c = i.getAttribute("data-ln-number"), n = null;
    s !== null && s !== "" ? n = s : c !== null && c !== "" && c !== "true" ? n = c : n = i.textContent.trim();
    const a = parseFloat(n);
    isNaN(a) ? this._rawValue = null : (this._rawValue = a, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", String(a)), this._formatTextContent());
  }, _.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const i = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, rt(this.dom), { maxDecimals: i });
    }
  }, _.prototype._handleInput = function() {
    const i = this.dom, s = b.get.call(i);
    if (s === "") {
      this._setHiddenRaw(""), q(i, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (s === "-") {
      this._setHiddenRaw(""), q(i, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = i.selectionStart;
    let n = 0;
    for (let f = 0; f < c; f++)
      /[0-9]/.test(s[f]) && n++;
    const a = rt(i), p = te(a);
    let u = s, w = Cn(s, p.groupSep, p.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), q(i, "ln-number:input", { value: NaN, formatted: s });
      return;
    }
    const S = i.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const f = parseInt(S, 10), y = w.slice(A + 1);
      if (f === 0)
        w = w.slice(0, A), u = u.split(p.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(u);
      else if (y.length > f) {
        w = w.slice(0, A + 1 + f);
        const T = u.split(p.decimalSep);
        u = T[0] + p.decimalSep + T[1].slice(0, f), v = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const d = i.getAttribute("data-ln-number-max");
    if (d !== null && v > parseFloat(d)) {
      const f = parseFloat(d), y = ct(f, a, { maxDecimals: S });
      this._setDisplayRaw(y), this._setHiddenRaw(f), i.setSelectionRange(y.length, y.length), q(i, "ln-number:input", { value: f, formatted: y });
      return;
    }
    if (u.endsWith(p.decimalSep) || p.decimalSep !== "." && u.endsWith(".")) {
      this._setHiddenRaw(v), q(i, "ln-number:input", { value: v, formatted: u });
      return;
    }
    const g = w.indexOf(".");
    if (g !== -1 && w.slice(g + 1).endsWith("0")) {
      this._setHiddenRaw(v), q(i, "ln-number:input", { value: v, formatted: u });
      return;
    }
    let l;
    if (S !== null)
      l = ct(v, a, { maxDecimals: S });
    else {
      const f = g !== -1 ? w.slice(g + 1).length : 0;
      l = ct(v, a, { userDecimals: f });
    }
    this._setDisplayRaw(l);
    const r = Mr(l, n);
    i.setSelectionRange(r, r), this._setHiddenRaw(v), q(i, "ln-number:input", { value: v, formatted: l });
  }, _.prototype._setHiddenRaw = function(i) {
    this._hidden && b.set.call(this._hidden, String(i));
  }, _.prototype._setDisplayRaw = function(i) {
    this.isTextElement ? this.dom.textContent = String(i) : b.set.call(this.dom, String(i));
  }, _.prototype._displayFormatted = function(i) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(i, rt(this.dom), { maxDecimals: s }));
    }
  }, Object.defineProperty(_.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const i = b.get.call(this._hidden);
      return i === "" ? NaN : parseFloat(i);
    },
    set: function(i) {
      const s = typeof i == "number" ? i : parseFloat(i);
      if (this.isTextElement) {
        isNaN(s) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = s, this.dom.setAttribute("data-ln-value", String(s)), this._formatTextContent());
        return;
      }
      if (isNaN(s)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(s);
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(s, rt(this.dom), { maxDecimals: c })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(_.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), _.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), q(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, _, "ln-number", {
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
    const a = parseInt(h[n], 10);
    if (isNaN(a)) return null;
    b.push(a);
  }
  let _, i, s;
  o === "." ? (_ = b[0], i = b[1], s = b[2]) : o === "/" ? (i = b[0], _ = b[1], s = b[2]) : h[0].length === 4 ? (s = b[0], i = b[1], _ = b[2]) : (_ = b[0], i = b[1], s = b[2]), s < 100 && (s += s < 50 ? 2e3 : 1900);
  const c = new Date(s, i - 1, _);
  return c.getFullYear() !== s || c.getMonth() !== i - 1 || c.getDate() !== _ ? null : c;
}
function pe(t, e, o, h) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const b = t.getDate(), _ = t.getMonth(), i = t.getFullYear(), s = t.getHours(), c = t.getMinutes();
  let n, a;
  const p = (o || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const S = new Intl.DateTimeFormat(o, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(h && S !== p);
  } catch {
    u = !!h;
  }
  if (u && h && h.monthsLong)
    n = h.monthsLong[_];
  else
    try {
      n = new Intl.DateTimeFormat(o, { month: "long" }).format(t);
    } catch {
      n = String(_ + 1);
    }
  if (u && h && h.monthsShort)
    a = h.monthsShort[_];
  else
    try {
      a = new Intl.DateTimeFormat(o, { month: "short" }).format(t);
    } catch {
      a = String(_ + 1);
    }
  const w = {
    yyyy: String(i),
    yy: String(i).slice(-2),
    MMMM: n,
    MMM: a,
    MM: String(_ + 1).padStart(2, "0"),
    M: String(_ + 1),
    dd: String(b).padStart(2, "0"),
    d: String(b),
    HH: String(s).padStart(2, "0"),
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
      const _ = new Intl.DateTimeFormat(o, b), i = (o || "").toLowerCase().split("-")[0], s = _.resolvedOptions().locale.toLowerCase().split("-")[0];
      return h && s !== i ? pe(t, "dd.MM.yyyy", o, h) : _.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", o, h);
    }
  return pe(t, e || "dd.MM.yyyy", o, h);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function o(n) {
    const a = n[e];
    if (a) {
      if (a.isTextElement)
        a._initTextElement();
      else if (a.value) {
        const p = st(a.value);
        p && a._displayFormatted(p);
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
  function _(n, a, p) {
    q(n.dom, "ln-date:change", {
      value: a,
      formatted: n.dom.value,
      date: p
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function i(n, a, p, u) {
    n._setHiddenRaw(a), b.set.call(n._picker, a), n._lastISO = a, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : p && n._displayFormatted(p), _(n, a, p);
  }
  function s(n) {
    n._setHiddenRaw(""), b.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", _(n, "", null);
  }
  function c(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const a = this;
    if (this._onLocaleChange = function() {
      if (a.isTextElement)
        a._formatTextContent();
      else if (a.value) {
        const g = st(a.value);
        g && a._displayFormatted(g);
      }
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const g = w.querySelectorAll("[data-ln-date-dict]");
      for (let l = 0; l < g.length; l++) {
        const r = g[l].getAttribute("data-ln-date-dict");
        if (r) {
          const f = re(g[l], "data-ln-date-dict-key");
          f["months-long"] && (f.monthsLong = f["months-long"].split(",").map((y) => y.trim())), f["months-short"] && (f.monthsShort = f["months-short"].split(",").map((y) => y.trim())), qe(r, f);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const S = document.createElement("input");
    S.type = "hidden", S.name = u, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && S.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", S), this._hidden = S;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", S.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const d = document.createElement("button");
    if (d.type = "button", d.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), d.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", d), this._btn = d, this._lastISO = "", Object.defineProperty(S, "value", {
      get: function() {
        return b.get.call(S);
      },
      set: function(g) {
        if (b.set.call(S, g), g && g !== "") {
          const l = st(g);
          l && i(a, g, l);
        } else g === "" && s(a);
      }
    }), dn(n, b, {
      get: function() {
        return b.get.call(n);
      },
      set: function(g, l) {
        if (a._isFormatting) {
          l(g);
          return;
        }
        if (!g || g === "") {
          l(""), s(a);
          return;
        }
        const r = st(g) || Wt(g);
        if (r) {
          const f = Ft(r), y = n.getAttribute(t) || "", T = rt(n), m = kt(T), E = Gt(r, y, T, m);
          l(E), i(a, f, r, E);
        } else
          l(String(g)), s(a);
      }
    }), this._onPickerChange = function() {
      const g = A.value;
      if (g) {
        const l = st(g);
        l && i(a, g, l);
      } else
        s(a);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const g = a.dom.value.trim();
      if (g === "") {
        a._lastISO !== "" && s(a);
        return;
      }
      if (a._lastISO) {
        const r = st(a._lastISO);
        if (r) {
          const f = a.dom.getAttribute(t) || "", y = rt(a.dom), T = kt(y);
          if (g === Gt(r, f, y, T)) return;
        }
      }
      const l = Wt(g);
      if (l) {
        const r = Ft(l);
        i(a, r, l);
      } else if (a._lastISO) {
        const r = st(a._lastISO);
        r && a._displayFormatted(r);
      } else
        a.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      a._openPicker();
    }, d.addEventListener("click", this._onBtnClick), p && p !== "") {
      const g = st(p);
      g && i(a, p, g);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, a = n.getAttribute("data-ln-value"), p = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    a !== null && a !== "" ? w = a : u !== null && u !== "" ? w = u : p !== null && p !== "" && p !== "true" && !Ee.test(p) ? w = p : w = n.textContent.trim();
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
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Ee.test(v) && (p = v);
        }
        const u = rt(this.dom), w = kt(u);
        this.dom.textContent = Gt(n, p || "medium", u, w);
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
    const a = this.dom.getAttribute(t) || "", p = rt(this.dom), u = kt(p);
    this._isFormatting = !0, this.dom.value = Gt(n, a, p, u), this._isFormatting = !1;
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
        const p = st(n) || Wt(n);
        if (!p) return;
        const u = Ft(p);
        this._rawValue = u, this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        s(this);
        return;
      }
      const a = st(n);
      a && i(this, n, a);
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
    "data-ln-nav": { effect: i },
    "data-ln-nav-exact": { prop: "exact", read: Kt, effect: i }
  }, h = et(o);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const s = history.pushState;
    history.pushState = function() {
      s.apply(history, arguments);
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
  function b(s) {
    return this.dom = s, tt(this, s, h), this.activeClass = s.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(s, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, a = _(n), p = [];
    for (const u of c) {
      const w = u.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const v = _(w), S = v === a, A = !this.exact && v !== "/" && a.startsWith(v + "/");
      S || A ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), p.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    q(this.dom, "ln-nav:update", { target: this.dom, activeLinks: p });
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const s = history._lnNavCallbacks.indexOf(this.updateHandler);
    s !== -1 && history._lnNavCallbacks.splice(s, 1), q(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function _(s) {
    try {
      return new URL(s, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return s.replace(/\/$/, "") || "/";
    }
  }
  function i(s, c) {
    const n = s[e];
    if (n) {
      if (c === t) {
        if (!s.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const a = n.activeClass, p = s.getAttribute(t) || "active";
        if (a !== p) {
          const u = s.querySelectorAll("a");
          for (const w of u)
            a && w.classList.remove(a);
          n.activeClass = p;
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
  function e(i, s) {
    const c = i.getAttribute("data-ln-persist"), n = c !== null && c !== "" ? c : i.id;
    return n ? i.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + s : "ln:" + n + ":" + s : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', i), null);
  }
  let o = null;
  function h() {
    if (o !== null) return o;
    try {
      if (typeof localStorage > "u") return o = !1;
      const i = "__ln_persist_test__";
      return localStorage.setItem(i, i), localStorage.removeItem(i), o = !0;
    } catch {
      return o = !1;
    }
  }
  const b = /* @__PURE__ */ new Set();
  function _(i, s) {
    const c = window.lnCore && window.lnCore._attrRegistry, n = c && c.persist || [];
    let a = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === s) {
        a = n[v];
        break;
      }
    if (!a) return;
    const p = a.persist;
    if (b.has(p.attr) || (b.add(p.attr), Vt([p.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || p.hashActive && p.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !h()) return;
      const d = v.getAttribute(S);
      try {
        d === null ? localStorage.removeItem(A) : localStorage.setItem(A, d);
      } catch {
      }
    })), p.hashActive && p.hashActive(i)) return;
    const u = e(i, p.attr);
    if (!u || !h()) return;
    const w = localStorage.getItem(u);
    w !== null && i.setAttribute(p.attr, w);
  }
  ar(_);
})();
function je(t, e, o, h) {
  const b = (t || "").toLowerCase().trim();
  if (b) return b;
  if ((e || "").toUpperCase() !== "A") return "";
  const _ = o || "";
  if (!_.startsWith("#")) return "";
  const i = _.slice(1);
  if (!i) return "";
  const s = i.split("&"), c = (h || "").toLowerCase().trim();
  if (c)
    for (const p of s) {
      const u = p.indexOf(":");
      if (u > 0 && p.slice(0, u).toLowerCase().trim() === c)
        return p.slice(u + 1).toLowerCase().trim();
    }
  const n = s[s.length - 1] || "", a = n.indexOf(":");
  return (a > 0 ? n.slice(a + 1) : n).toLowerCase().trim();
}
function Ve(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const o = t.filter(
    (_) => (_.tagName || "").toUpperCase() === "A" && (_.href || "").startsWith("#")
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
    const a = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(a);
  }
  function h(n, a) {
    return (n.getAttribute(a) || n.id || "").toLowerCase().trim();
  }
  function b(n, a) {
    return (n.getAttribute(a) || "true").toLowerCase() !== "false";
  }
  const _ = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: o },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": { prop: "autoFocus", read: b },
    "data-ln-tabs-key": { prop: "nsKey", read: h },
    "data-ln-tab": {}
  }, i = et(_);
  function s(n) {
    return this.dom = n, tt(this, n, i), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.map((u) => ({
      tagName: u.tagName,
      href: u.getAttribute("href")
    })), a = Ve(n, this.nsKey);
    this.hashEnabled = a.hashEnabled, a.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : a.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const w = je(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
      w ? this.mapTabs[w] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const w = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      w && (this.mapPanels[w] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const p = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[e + "Trigger"]) continue;
      const w = function(v) {
        const S = u.tagName === "A";
        if (!S && (v.ctrlKey || v.metaKey || v.button === 1)) return;
        const A = je(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), p.nsKey);
        A && (S && !ke(v) || (p.hashEnabled ? ot(p.nsKey) === A ? p.dom.setAttribute("data-ln-tabs-active", A) : dt(p.nsKey, A) : p.dom.setAttribute("data-ln-tabs-active", A)));
      };
      u.addEventListener("click", w), u[e + "Trigger"] = w, p._clickHandlers.push({ el: u, handler: w });
    }
    if (this._onRequestSelect = function(u) {
      const w = u.detail && (u.detail.key || u.detail.tab);
      w && p.select(w);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!p.hashEnabled) return;
      const u = ot(p.nsKey);
      p.dom.setAttribute("data-ln-tabs-active", u !== null ? u : p.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const u = We(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  s.prototype.select = function(n) {
    const a = (n + "").toLowerCase().trim();
    a && (this.hashEnabled ? ot(this.nsKey) === a ? this.dom.setAttribute("data-ln-tabs-active", a) : dt(this.nsKey, a) : this.dom.setAttribute("data-ln-tabs-active", a));
  }, s.prototype._applyActive = function(n) {
    var p;
    if (n = We(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
    const a = this.activeKey;
    if (a !== null && Z(this.dom, "ln-tabs:before-change", {
      key: n,
      previousKey: a,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    }).defaultPrevented) {
      a in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", a), this.hashEnabled && ot(this.nsKey) !== a && dt(this.nsKey, a));
      return;
    }
    this.activeKey = n;
    for (const u in this.mapTabs) {
      const w = this.mapTabs[u];
      u === n ? (w.setAttribute("data-active", ""), w.setAttribute("aria-selected", "true")) : (w.removeAttribute("data-active"), w.setAttribute("aria-selected", "false"));
    }
    for (const u in this.mapPanels) {
      const w = this.mapPanels[u], v = u === n;
      w.classList.toggle("hidden", !v), w.setAttribute("aria-hidden", v ? "false" : "true");
    }
    if (this.autoFocus) {
      const u = (p = this.mapPanels[n]) == null ? void 0 : p.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      u && setTimeout(() => u.focus({ preventScroll: !0 }), 0);
    }
    q(this.dom, "ln-tabs:change", {
      key: n,
      previousKey: a,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    });
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: n, handler: a } of this._clickHandlers)
        n.removeEventListener("click", a), delete n[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), q(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, s, "ln-tabs", {
    attributes: _,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(n) {
        const a = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(u) {
          return { tagName: u.tagName, href: u.getAttribute("href") };
        }), p = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return Ve(a, p).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", o = "data-ln-toggle-for", h = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-toggle": { effect: u },
    "data-ln-toggle-for": {},
    "data-ln-toggle-action": {}
  }, _ = /* @__PURE__ */ new Set();
  let i = null;
  function s(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function c() {
    i || (i = function(w) {
      if (sn(w)) return;
      const v = w.target.closest("[" + o + "]");
      if (!v || an(v)) return;
      const S = v.getAttribute(o);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const d = v.getAttribute(h) || "toggle", g = A.getAttribute(t);
      A.setAttribute(t, s(g, d));
    }, document.addEventListener("click", i));
  }
  function n() {
    _.size > 0 || !i || (document.removeEventListener("click", i), i = null);
  }
  function a(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + o + '="' + w.id + '"]'
    );
    for (let A = 0; A < S.length; A++)
      S[A].setAttribute("aria-expanded", v ? "true" : "false");
  }
  function p(w) {
    this.dom = w;
    const v = this;
    return this._onRequestOpen = function() {
      v.open();
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function() {
      v.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), a(w, this.isOpen), _.add(this), c(), this;
  }
  p.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, p.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, p.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, s(w, "toggle"));
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), _.delete(this), delete this.dom[e], n(), q(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function u(w) {
    const v = w[e];
    if (!v) return;
    const A = w.getAttribute(t) === "open";
    if (A !== v.isOpen)
      if (A) {
        if (Z(w, "ln-toggle:before-open", { target: w }).defaultPrevented) {
          w.setAttribute(t, "close");
          return;
        }
        v.isOpen = !0, w.classList.add("open"), a(w, !0), q(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), a(w, !1), q(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, p, "ln-toggle", {
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
    return this.dom = b, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== b) return;
      const i = b.querySelectorAll("[data-ln-toggle]");
      for (const s of i)
        s !== _.detail.target && s.closest("[data-ln-accordion]") === b && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      q(b, "ln-accordion:change", { target: _.detail.target });
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
  function _(i) {
    this.dom = i, tt(this, i, b), this.toggleEl = i.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = i.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const s = this;
    return this._onRequestOpen = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (s.toggleEl) {
        const c = s.toggleEl.getAttribute("data-ln-toggle");
        s.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const n = s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        n && (c.preventDefault(), c.stopPropagation(), s.toggleEl.setAttribute("data-ln-toggle", "close"), s.triggerBtn && s.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        n && (s.triggerBtn && s.triggerBtn.focus(), s.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const a = s._getMenuItems();
      if (a.length === 0) return;
      if (!n && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = s._getMenuItems();
          u.length > 0 && s._focusItem(u, c.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const p = a.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const u = p < a.length - 1 ? p + 1 : 0;
        s._focusItem(a, u);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const u = p > 0 ? p - 1 : a.length - 1;
        s._focusItem(a, u);
      } else c.key === "Home" ? (c.preventDefault(), s._focusItem(a, 0)) : c.key === "End" && (c.preventDefault(), s._focusItem(a, a.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "true"), typeof s.toggleEl.showPopover == "function" && s.toggleEl.showPopover(), s._initMenuAria(), s._reposition(), s._addOutsideClickListener(), s._addScrollRepositionListener(), s._addResizeCloseListener(), q(i, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "false"), s._removeOutsideClickListener(), s._removeScrollRepositionListener(), s._removeResizeCloseListener(), s.toggleEl.style.top = "", s.toggleEl.style.left = "", s.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof s.toggleEl.hidePopover == "function" && s.toggleEl.matches(":popover-open") && s.toggleEl.hidePopover(), q(i, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  _.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const i = this.toggleEl.querySelectorAll("li");
    for (const c of i)
      c.setAttribute("role", "none");
    const s = this._getMenuItems();
    for (let c = 0; c < s.length; c++)
      s[c].setAttribute("role", "menuitem"), s[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, _.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, _.prototype._focusItem = function(i, s) {
    for (let c = 0; c < i.length; c++)
      i[c].setAttribute("tabindex", c === s ? "0" : "-1");
    i[s] && i[s].focus();
  }, _.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const i = this.triggerBtn.getBoundingClientRect(), s = be(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || o, a = Zt(i, s, n, c);
    this.toggleEl.style.top = a.top + "px", this.toggleEl.style.left = a.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", a.placement);
  }, _.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const i = this;
    this._boundDocClick = function(s) {
      i.dom.contains(s.target) || i.toggleEl && i.toggleEl.contains(s.target) || i.toggleEl && i.toggleEl.getAttribute("data-ln-toggle") === "open" && i.toggleEl.setAttribute("data-ln-toggle", "close");
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0);
  }, _.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, _.prototype._addScrollRepositionListener = function() {
    const i = this;
    this._boundScrollReposition = function() {
      i._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, _.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, _.prototype._addResizeCloseListener = function() {
    const i = this;
    this._boundResizeClose = function() {
      i.toggleEl && i.toggleEl.getAttribute("data-ln-toggle") === "open" && i.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, _.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, _.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), q(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, _, "ln-dropdown", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", o = "data-ln-popover-for", h = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-popover": { effect: p },
    "data-ln-popover-for": {},
    "data-ln-popover-position": {},
    "data-ln-popover-placement": {}
  }, _ = [];
  let i = null;
  function s() {
    i || (i = function(u) {
      if (u.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", i));
  }
  function c() {
    _.length > 0 || i && (document.removeEventListener("keydown", i), i = null);
  }
  function n(u) {
    this.dom = u, this.isOpen = u.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.open(S);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(v) {
      const S = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.toggle(S);
    }, u.addEventListener("ln-popover:request-open", this._onRequestOpen), u.addEventListener("ln-popover:request-close", this._onRequestClose), u.addEventListener("ln-popover:request-toggle", this._onRequestToggle), u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1"), u.hasAttribute("role") || u.setAttribute("role", "dialog"), u.hasAttribute("popover") || u.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(u) {
    this.isOpen || (this.trigger = u || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(u) {
    this.isOpen ? this.close() : this.open(u);
  }, n.prototype._applyOpen = function(u) {
    this.isOpen = !0, u && (this.trigger = u), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const w = be(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(h) || "bottom", l = Zt(d, w, g, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, Ut);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(d) {
      A.dom.contains(d.target) || A.trigger && A.trigger.contains(d.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const d = A.trigger.getBoundingClientRect(), g = be(A.dom), l = A.dom.getAttribute(h) || "bottom", r = Zt(d, g, l, 8);
      A.dom.style.top = r.top + "px", A.dom.style.left = r.left + "px", A.dom.setAttribute("data-ln-popover-placement", r.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), s(), q(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = _.indexOf(this);
    u !== -1 && _.splice(u, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, q(this.dom, "ln-popover:close", {
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
  function a(u) {
    this.dom = u;
    const w = u.getAttribute(o);
    return u.setAttribute("aria-haspopup", "dialog"), u.setAttribute("aria-expanded", "false"), u.setAttribute("aria-controls", w), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const S = document.getElementById(w);
      if (!S) return;
      S[e] && (S[e].trigger = u);
      const A = S.getAttribute(t);
      S.setAttribute(t, A === "open" ? "closed" : "open");
    }, u.addEventListener("click", this._onClick), this;
  }
  a.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function p(u) {
    const w = u[e];
    if (!w) return;
    const S = u.getAttribute(t) === "open";
    if (S !== w.isOpen)
      if (S) {
        if (Z(u, "ln-popover:before-open", {
          popoverId: u.id,
          target: u,
          trigger: w.trigger
        }).defaultPrevented) {
          u.setAttribute(t, "closed");
          return;
        }
        w._applyOpen(w.trigger);
      } else {
        if (Z(u, "ln-popover:before-close", {
          popoverId: u.id,
          target: u,
          trigger: w.trigger
        }).defaultPrevented) {
          u.setAttribute(t, "open");
          return;
        }
        w._applyClose();
      }
  }
  j(t, e, n, "ln-popover", {
    attributes: b
  }), j(o, e + "Trigger", a);
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", o = "data-ln-tooltip-position", h = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[h] !== void 0) return;
  const _ = {
    "data-ln-tooltip-enhance": {},
    "data-ln-tooltip-enhanced": {},
    "data-ln-tooltip": {},
    "data-ln-tooltip-position": {},
    "data-ln-tooltip-placement": {}
  };
  let i = 0, s = null, c = null, n = null, a = null, p = null, u = null;
  function w() {
    return s && s.parentNode || (s = document.getElementById(b), s || (s = document.createElement("div"), s.id = b, document.body.appendChild(s)), s.hasAttribute("popover") || s.setAttribute("popover", "manual")), s;
  }
  function v() {
    u || (u = function(l) {
      l.key === "Escape" && d();
    }, document.addEventListener("keydown", u));
  }
  function S() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function A(l) {
    if (n === l) return;
    d();
    const r = l.getAttribute(e) || l.getAttribute("title");
    if (!r) return;
    w(), typeof s.showPopover == "function" && s.showPopover(), l.hasAttribute("title") && (a = l.getAttribute("title"), l.removeAttribute("title"));
    const f = l.getAttribute("aria-describedby");
    f ? p = f : p = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = r, l[h + "Uid"] || (i += 1, l[h + "Uid"] = "ln-tooltip-" + i), y.id = l[h + "Uid"], s.appendChild(y);
    const T = y.offsetWidth, m = y.offsetHeight, E = l.getBoundingClientRect(), C = l.getAttribute(o) || "top", k = Zt(E, { width: T, height: m }, C, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), p ? l.setAttribute("aria-describedby", p + " " + y.id) : l.setAttribute("aria-describedby", y.id), c = y, n = l, v();
  }
  function d() {
    if (!c) {
      S();
      return;
    }
    n && (p !== null ? n.setAttribute("aria-describedby", p) : n.removeAttribute("aria-describedby"), p = null, a !== null && n.setAttribute("title", a)), a = null, c.parentNode && c.parentNode.removeChild(c), c = null, n = null, s && typeof s.hidePopover == "function" && s.matches(":popover-open") && s.hidePopover(), S();
  }
  function g(l) {
    return this.dom = l, l.hasAttribute("data-ln-tooltip-enhanced") || (l.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(l);
    }, this._onLeave = function() {
      n === l && !l.contains(document.activeElement) && d();
    }, this._onFocus = function() {
      A(l);
    }, this._onBlur = function() {
      n === l && !l.matches(":hover") && d();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), n === l && d(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[h], delete l[h + "Uid"], q(l, "ln-tooltip:destroyed", { trigger: l });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    h,
    g,
    "ln-tooltip",
    {
      attributes: _
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
  function _(A) {
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
  function i(A) {
    if (!A || !(A instanceof HTMLElement)) return;
    if (A.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof A.hidePopover == "function" && A.matches(":popover-open"))
      try {
        A.hidePopover();
      } catch {
      }
  }
  function s(A) {
    this.dom = A, tt(this, A, b);
    const d = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; d.length > this.max; ) A.removeChild(d.shift());
    for (const g of d) w(g, this);
    return d.length > 0 && _(A), this;
  }
  s.prototype.enqueue = function(A) {
    if (!A) return;
    const d = c(A, this.dom);
    if (!d) return;
    const g = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    a(this, d), g > 0 && (d._timer = setTimeout(() => p(d), g));
  }, s.prototype.clear = function() {
    for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      p(A);
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        p(A);
      i(this.dom), q(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function c(A, d) {
    const g = ((A.type || "") + "").trim().toLowerCase(), l = Tt(d, o, "ln-toast");
    if (!l)
      return console.warn('[ln-toast] Template "' + o + '" not found'), null;
    pt(l, {
      type: g,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const r = l.firstElementChild;
    if (!r) return null;
    r.hasAttribute("data-ln-toast-item") || r.setAttribute("data-ln-toast-item", ""), r.classList.add("ln-enter");
    const f = r.querySelector(".body");
    f && n(f, A);
    const y = r.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      p(r);
    }), r;
  }
  function n(A, d) {
    if (Array.isArray(d.message)) {
      const g = document.createElement("ul");
      for (const l of d.message) {
        const r = document.createElement("li");
        r.textContent = l, g.appendChild(r);
      }
      A.appendChild(g);
    }
    if (d.data && d.data.errors) {
      const g = document.createElement("ul");
      for (const l of Object.values(d.data.errors).flat()) {
        const r = document.createElement("li");
        r.textContent = l, g.appendChild(r);
      }
      A.appendChild(g);
    }
  }
  function a(A, d) {
    const g = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; g.length >= A.max && g.length > 0; ) A.dom.removeChild(g.shift());
    A.dom.appendChild(d), _(A.dom), requestAnimationFrame(() => d.classList.remove("ln-enter"));
  }
  function p(A) {
    if (!A || !A.parentNode) return;
    const d = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), i(d));
    }, 200);
  }
  function u(A) {
    let d = A && A.container;
    return typeof d == "string" && (d = document.querySelector(d)), d instanceof HTMLElement || (d = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), d || null;
  }
  function w(A, d) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const g = A.querySelector("[data-ln-toast-close]");
    g && g.addEventListener("click", function() {
      p(A);
    });
    const l = +(A.getAttribute("data-ln-toast-timeout") ?? d.timeoutDefault);
    l > 0 && (A._timer = setTimeout(function() {
      p(A);
    }, l));
  }
  function v(A) {
    const d = A.detail || {}, g = u(d);
    if (!g) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (g[e] || (g[e] = new s(g))).enqueue(d);
  }
  function S(A) {
    const d = A && A.detail || {};
    if (d.container) {
      const g = u(d);
      g && (g[e] || (g[e] = new s(g))).clear();
    } else {
      const g = document.querySelectorAll("[" + t + "]");
      for (const l of Array.from(g))
        (l[e] || (l[e] = new s(l))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const d of Array.from(A))
        d.querySelectorAll("[data-ln-toast-item]").length > 0 && _(d);
    });
  }, "ln-toast"), j(t, e, s, "ln-toast", {
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
        const _ = b.slice(0, -1);
        return h.startsWith(_);
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
  ], _ = Math.floor(Math.log(t) / Math.log(h)), i = Math.min(_, b.length - 1), s = t / Math.pow(h, i);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(s) + " " + b[i];
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
  }, _ = et(b);
  function i(n, a, p) {
    return Hr(n, a, p);
  }
  function s() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function c(n) {
    this.dom = n, tt(this, n, _), this.dict = re(n, "data-ln-upload-dict"), this.locale = rt(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const a = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Pr(a), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  c.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const a = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < a.length; u++) {
      const w = a[u], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), d = w.querySelector('[data-ln-field="sizeText"]'), g = w.getAttribute("data-ln-upload-size"), l = g ? parseInt(g, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: l !== null && !isNaN(l) ? l : d ? d.textContent.trim() : ""
      });
    }
    const p = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < p.length; u++) {
      const w = p[u];
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
    const n = this, a = this.dom.querySelectorAll('input[type="hidden"]');
    for (let p = 0; p < a.length; p++)
      a[p].name === n.idsFieldName && a[p].remove();
    for (const [, p] of this.uploadedFiles)
      if (p.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = p.serverId, n.dom.appendChild(u);
      }
  }, c.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(a) {
      n.zone === n.dom && a.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && a.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(a) {
      a.preventDefault(), a.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(a) {
      a.preventDefault(), a.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(a) {
      a.preventDefault(), a.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(a) {
      a.preventDefault(), a.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), a.dataTransfer && a.dataTransfer.files && n.upload(a.dataTransfer.files);
    }, this._onListClick = function(a) {
      const p = a.target.closest('[data-ln-upload-action="remove"]');
      if (!p || !n.list || !n.list.contains(p) || p.disabled) return;
      const u = p.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(a) {
      a.detail && a.detail.files && n.upload(a.detail.files);
    }, this._onRequestRemove = function(a) {
      if (a.detail) {
        const p = a.detail.localId !== void 0 ? a.detail.localId : a.detail.serverId;
        p !== void 0 && n.remove(p);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, c.prototype.upload = function(n) {
    const a = this, p = Array.from(n);
    for (let u = 0; u < p.length; u++) {
      const w = p[u];
      if (a.maxFiles > 0 && a.uploadedFiles.size >= a.maxFiles) {
        q(a.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!Br(w, a.allowedExts)) {
        q(a.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (a.maxSize > 0 && w.size > a.maxSize) {
        q(a.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(a.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || a._uploadSingleFile(w);
    }
  }, c.prototype._uploadSingleFile = function(n) {
    const a = this, p = "file-" + ++a.fileIdCounter, u = Hn(n.name);
    let w = null;
    if (this.list) {
      const g = Tt(this.dom, "ln-upload-item", "ln-upload");
      if (g && (w = g.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", p), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: a.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const l = w.querySelector('[data-ln-upload-action="remove"]');
        l && (l.disabled = !0);
        const r = w.querySelector("[data-ln-progress]");
        r && r.setAttribute("data-ln-progress", "0"), a.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(a.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let g = 0; g < S.length; g++) {
      const l = S[g];
      !l.name || l.name === a.idsFieldName || l.type === "file" || (l.type === "checkbox" || l.type === "radio") && !l.checked || v.append(l.name, l.value);
    }
    const A = new XMLHttpRequest();
    a.uploadedFiles.set(p, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(g) {
      if (g.lengthComputable) {
        const l = Math.round(g.loaded / g.total * 100);
        if (w) {
          const r = w.querySelector("[data-ln-progress]");
          r && r.setAttribute("data-ln-progress", String(l)), pt(w, { sizeText: l + "%" });
        }
        q(a.dom, "ln-upload:progress", {
          localId: p,
          file: n,
          percent: l,
          loaded: g.loaded,
          total: g.total
        });
      }
    }), A.addEventListener("load", function() {
      const g = a.uploadedFiles.get(p);
      if (g && delete g.xhr, A.status >= 200 && A.status < 300) {
        let l;
        try {
          l = JSON.parse(A.responseText);
        } catch (f) {
          d(a.dict.error || "Error", A.status, f);
          return;
        }
        const r = l.id || l.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), r && w.setAttribute("data-ln-upload-id", String(r)), pt(w, {
            sizeText: i(l.size || n.size, a.locale, a.dict),
            uploading: !1
          });
          const f = w.querySelector('[data-ln-upload-action="remove"]');
          f && (f.disabled = !1);
        }
        g && (g.serverId = r, g.size = l.size || n.size, g.name = l.name || n.name), a._syncHiddenInputs(), q(a.dom, "ln-upload:uploaded", {
          localId: p,
          serverId: r,
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
        d(l, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const g = a.uploadedFiles.get(p);
      g && delete g.xhr, d("", 0, null);
    });
    function d(g, l, r) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: a.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const f = w.querySelector('[data-ln-upload-action="remove"]');
        f && (f.disabled = !1);
      }
      q(a.dom, "ln-upload:error", {
        file: n,
        message: g,
        status: l,
        error: r
      });
    }
    a.uploadUrl ? (A.open("POST", a.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", s()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const a = this;
    let p = null, u = null;
    if (a.uploadedFiles.has(n))
      p = n, u = a.uploadedFiles.get(n);
    else
      for (const [A, d] of a.uploadedFiles)
        if (String(d.serverId) === String(n)) {
          p = A, u = d;
          break;
        }
    if (!p || !u || Z(a.dom, "ln-upload:before-remove", {
      localId: p,
      serverId: u.serverId
    }).defaultPrevented) return;
    const v = a.list ? a.list.querySelector('[data-ln-upload-local-id="' + p + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      v && v.remove(), a.uploadedFiles.delete(p), a._syncHiddenInputs(), q(a.dom, "ln-upload:removed", { localId: p, serverId: null });
      return;
    }
    let S = null;
    if (a.deleteUrlPattern ? S = a.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : a.uploadUrl && a.uploadUrl.includes("{id}") && (S = a.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !S) {
      v && v.remove(), a.uploadedFiles.delete(p), a._syncHiddenInputs(), q(a.dom, "ln-upload:removed", { localId: p, serverId: u.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), pt(v, { deleting: !0 })), fetch(S, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": s(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(A) {
      A.ok ? (v && v.remove(), a.uploadedFiles.delete(p), a._syncHiddenInputs(), q(a.dom, "ln-upload:removed", {
        localId: p,
        serverId: u.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(a.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(a.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: 0,
        error: A
      });
    });
  }, c.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, p] of this.uploadedFiles)
        if (p.xhr && typeof p.xhr.abort == "function" && p.xhr.abort(), p.serverId) {
          let u = null;
          n.deleteUrlPattern ? u = n.deleteUrlPattern.replace("{id}", encodeURIComponent(p.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (u = n.uploadUrl.replace("{id}", encodeURIComponent(p.serverId))), u && fetch(u, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": s(),
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
  function e(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function o(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !e(s)) return;
    s.target = "_blank";
    const c = (s.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), s.rel = c.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", s.appendChild(n), s.setAttribute("data-ln-external-link", "processed"), q(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function h(s) {
    s = s || document.body;
    for (const c of s.querySelectorAll("a, area"))
      o(c);
  }
  function b() {
    gt(function() {
      document.body.addEventListener("click", function(s) {
        const c = s.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && q(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function _() {
    gt(function() {
      new MutationObserver(function(c) {
        for (const n of c)
          if (n.type === "childList") {
            for (const a of n.addedNodes)
              if (a.nodeType === 1 && (a.matches && (a.matches("a") || a.matches("area")) && o(a), a.querySelectorAll))
                for (const p of a.querySelectorAll("a, area"))
                  o(p);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && o(c);
      });
    }, "ln-external-links");
  }
  function i() {
    b(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      h();
    }) : h();
  }
  window[t] = {
    process: h
  }, i();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let o = null;
  function h() {
    o = document.createElement("div"), o.className = "ln-link-status", document.body.appendChild(o);
  }
  function b(d) {
    o && (o.textContent = d, o.classList.add("ln-link-status--visible"));
  }
  function _() {
    o && o.classList.remove("ln-link-status--visible");
  }
  function i(d, g) {
    if (g.target.closest("a, button, input, select, textarea")) return;
    const l = d.querySelector("a");
    if (!l) return;
    const r = l.getAttribute("href");
    if (!r) return;
    if (g.ctrlKey || g.metaKey || g.button === 1) {
      window.open(r, "_blank", "noopener,noreferrer");
      return;
    }
    Z(d, "ln-link:navigate", { target: d, href: r, link: l }).defaultPrevented || l.click();
  }
  function s(d) {
    const g = d.querySelector("a");
    if (!g) return;
    const l = g.getAttribute("href");
    l && b(l);
  }
  function c() {
    _();
  }
  function n(d) {
    d[e + "Row"] || !d.querySelector("a") || (d[e + "Row"] = !0, d._lnLinkClick = function(l) {
      i(d, l);
    }, d._lnLinkEnter = function() {
      s(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", c));
  }
  function a(d) {
    d[e + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", c), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[e + "Row"]);
  }
  function p(d) {
    if (!d[e + "Init"]) return;
    const g = d.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const l = g === "TABLE" && d.querySelector("tbody") || d;
      for (const r of l.querySelectorAll("tr"))
        a(r);
    } else
      a(d);
    delete d[e + "Init"];
  }
  function u(d) {
    if (d[e + "Init"]) return;
    d[e + "Init"] = !0;
    const g = d.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const l = g === "TABLE" && d.querySelector("tbody") || d;
      for (const r of l.querySelectorAll("tr"))
        n(r);
    } else
      n(d);
  }
  function w(d) {
    d.hasAttribute && d.hasAttribute(t) && u(d);
    const g = d.querySelectorAll ? d.querySelectorAll("[" + t + "]") : [];
    for (const l of g)
      u(l);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(g) {
        for (const l of g)
          if (l.type === "childList") {
            for (const r of l.addedNodes)
              if (r.nodeType === 1) {
                w(r);
                const f = r.closest("[" + t + "]");
                if (f)
                  if (r.tagName === "TR")
                    n(r);
                  else {
                    const y = f.tagName;
                    if (y === "TABLE" || y === "TBODY") {
                      const T = r.querySelectorAll ? r.querySelectorAll("tr") : [];
                      for (const m of T)
                        n(m);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(g) {
        g.hasAttribute && g.hasAttribute(t) ? w(g) : p(g);
      });
    }, "ln-link");
  }
  function S(d) {
    w(d);
  }
  window[e] = { init: S, destroy: p };
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
  for (let i = 0; i < o.length; i++) {
    const s = Un(o[i]);
    if (!s) return "";
    if (Ht.indexOf(s) !== -1) {
      h.add(s);
      continue;
    }
    if (b) return "";
    b = s;
  }
  if (!b) return "";
  const _ = [];
  for (let i = 0; i < Ht.length; i++)
    h.has(Ht[i]) && _.push(Ht[i]);
  return _.push(b), _.join("+");
}
function zr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const o = e.split(/[\s,]+/), h = [];
  for (let b = 0; b < o.length; b++) {
    const _ = zn(o[b]);
    _ && h.indexOf(_) === -1 && h.push(_);
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
  const t = "data-ln-key", e = "lnKey", o = "data-ln-key-target", h = "data-ln-key-allow-input", b = "data-ln-key-modifier", _ = "data-ln-key-for", i = "lnKeyFor";
  if (window[e] !== void 0) return;
  function s(g) {
    const l = g[e];
    if (l) {
      if (!g.hasAttribute(t)) {
        l.destroy();
        return;
      }
      l.sync();
    }
  }
  function c(g) {
    const l = g[i];
    l && !g.hasAttribute(_) && l.destroy();
  }
  const n = {
    "data-ln-key": { effect: s },
    "data-ln-key-target": { effect: s },
    "data-ln-key-allow-input": { effect: s }
  }, a = {
    "data-ln-key-for": { effect: c },
    "data-ln-key-modifier": {}
  }, p = /* @__PURE__ */ new Set();
  let u = null;
  function w() {
    u || (u = function(g) {
      if (g.defaultPrevented || g.isComposing || g.repeat) return;
      const l = jr(g);
      if (!l) return;
      const r = dr(g.target), f = document.querySelectorAll("[" + t + "], [" + _ + "]");
      let y = null, T = !1, m = !1;
      for (let k = 0; k < f.length; k++) {
        const D = f[k], I = D[e] || D[i];
        if (!I || !I.matches(l) || r && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = Vr(R);
        if (!(!O || !ur(R, O))) {
          if (Wr(g, R, O, l)) {
            m = !0;
            continue;
          }
          y ? T = !0 : y = { host: D, target: R, action: O };
        }
      }
      if (m || !y) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + l + '"; first DOM match wins.');
      const E = {
        source: y.host,
        target: y.target,
        action: y.action,
        key: l,
        event: g
      };
      Z(y.host, "ln-key:before-trigger", E).defaultPrevented || (g.preventDefault(), y.target[y.action](), q(y.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", u));
  }
  function v() {
    p.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function S(g) {
    return this.dom = g, this.shortcuts = [], p.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = zr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(g) {
    return this.shortcuts.indexOf(g) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(h);
  }, S.prototype.resolveTarget = function() {
    const g = this.dom.getAttribute(o);
    return g ? d(g, o) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), delete this.dom[e], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(g) {
    return this.dom = g, p.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + b + "]");
  }, A.prototype.shortcut = function() {
    const g = this._modifierContext(), l = g ? g.getAttribute(b) : "";
    return Kr(l, this.dom.textContent);
  }, A.prototype.matches = function(g) {
    return this.shortcut() === g;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(h)) return !0;
    const g = this._modifierContext();
    return !!(g && g.hasAttribute(h));
  }, A.prototype.resolveTarget = function() {
    return d(this.dom.getAttribute(_), _);
  }, A.prototype.destroy = function() {
    this.dom[i] && (p.delete(this), delete this.dom[i], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function d(g, l) {
    if (!g) return null;
    try {
      const r = document.querySelector(g);
      return r || console.warn("[ln-key] Target not found for " + l + ' selector "' + g + '".'), r;
    } catch {
      return console.warn("[ln-key] Invalid " + l + ' selector "' + g + '".'), null;
    }
  }
  j(t, e, S, "ln-key", {
    attributes: n
  }), j(_, i, A, "ln-key-for", {
    attributes: a
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
  function o(s) {
    const c = s[e];
    c && i.call(c);
  }
  const h = {
    "data-ln-progress": { effect: o },
    "data-ln-progress-max": { effect: o }
  };
  function b(s) {
    return this.dom = s, this._parentObserver = null, i.call(this), _.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function _() {
    const s = this, c = this.dom.parentElement;
    if (!c) return;
    const n = new MutationObserver(function(a) {
      for (const p of a)
        p.attributeName === "data-ln-progress-max" && i.call(s);
    });
    n.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function i() {
    const s = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, a = this.dom.getAttribute("data-ln-progress-max"), p = Gr(a, n, 100), u = Sn(s, p);
    this.dom.style.width = u.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(u.min)), this.dom.setAttribute("aria-valuemax", String(u.max)), this.dom.setAttribute("aria-valuenow", String(u.clampedValue)), q(this.dom, "ln-progress:change", {
      target: this.dom,
      value: u.value,
      max: u.max,
      percentage: u.percentage
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
    const _ = e[h[b]];
    let i = "";
    if (_.col !== null && _.col !== void 0 ? i = t[_.col] || "" : _.attr && o && typeof o.getAttribute == "function" && (i = o.getAttribute(_.attr) || ""), !xe(i, _.values))
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
      const _ = e.closest("th");
      if (_ && typeof _.cellIndex == "number")
        return _.cellIndex;
      const i = e.closest("[data-ln-popover], [id]");
      if (i && i.id) {
        const s = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (s && typeof s.querySelector == "function") {
          const c = s.querySelector('[data-ln-popover-for="' + i.id + '"]');
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
    const b = t.querySelectorAll("thead th, tr:first-child th"), _ = String(o).trim().toLowerCase();
    for (let i = 0; i < b.length; i++) {
      const s = b[i], c = s.getAttribute("data-ln-table-filter-col") || s.getAttribute("data-ln-filter-col") || s.getAttribute("data-ln-filter-key") || s.getAttribute("data-ln-table-col") || s.getAttribute("data-ln-col") || s.getAttribute("data-ln-field");
      if (c && c.trim().toLowerCase() === _)
        return typeof s.cellIndex == "number" ? s.cellIndex : i;
    }
    if (e) {
      const i = e.closest ? e.closest("[data-ln-popover], [id]") : null, s = i && i.id || e.id || null;
      if (s)
        for (let c = 0; c < b.length; c++) {
          const n = b[c];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + s + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : c;
        }
    }
    for (let i = 0; i < b.length; i++) {
      const s = b[i], n = Array.from(s.childNodes || []).filter((p) => p.nodeType === 3), a = (n.length > 0 ? n.map((p) => p.textContent.trim()).join(" ") : s.textContent || "").trim().toLowerCase();
      if (a && a === _)
        return typeof s.cellIndex == "number" ? s.cellIndex : i;
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
  const t = "data-ln-filter", e = "lnFilter", o = "data-ln-filter-key", h = "data-ln-filter-value", b = "data-ln-filter-hide", _ = "data-ln-filter-reset", i = "data-ln-filter-col", s = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-filter": { prop: "targetId", read: Q, fallback: null },
    "data-ln-hash": { effect: g },
    "data-ln-filter-values": { effect: g },
    "data-ln-filter-col": {},
    "data-ln-filter-key": {},
    "data-ln-filter-reset": {},
    "data-ln-filter-value": {},
    "data-ln-filter-hide": {}
  }, p = et(a);
  function u(l) {
    return l.hasAttribute(_) || !l.getAttribute(h);
  }
  function w(l) {
    const r = l.dom.querySelectorAll("[" + o + "]"), f = [];
    for (let T = 0; T < r.length; T++) {
      const m = r[T];
      f.push({
        key: m.getAttribute(o),
        value: m.getAttribute(h) || "",
        checked: m.checked,
        isReset: u(m)
      });
    }
    const y = Yr(f);
    return { key: y.key, values: y.values, targetId: l.targetId };
  }
  function v(l, r, f) {
    const y = l.querySelectorAll("[" + o + "]"), T = Array.isArray(f) && f.length > 0;
    for (let m = 0; m < y.length; m++) {
      const E = y[m];
      u(E) ? E.checked = !T : T && E.getAttribute(o) === r && f.indexOf(E.getAttribute(h)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(l) {
    this.dom = l, tt(this, l, p);
    const r = l.getAttribute(i);
    this.colIndex = r !== null ? parseInt(r, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(l, "filter"), this.hashEnabled = !!this.nsKey;
    const f = this, y = oe(function() {
      f._render();
    });
    this._queueRender = y, this._attachHandlers(), this._onHashChange = function() {
      if (f._destroyed || !f.hashEnabled) return;
      const m = ot(f.nsKey), E = _e(m);
      E && E.key && E.values.length > 0 ? v(f.dom, E.key, E.values) : v(f.dom, null, []), f._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const m = ot(this.nsKey), E = _e(m);
      E && E.key && E.values.length > 0 && (v(l, E.key, E.values), mt(function() {
        f._destroyed || f._render();
      }), T = !0);
    }
    if (!T) {
      const m = Qe(l.getAttribute(c));
      if (m.length > 0) {
        const E = l.querySelector("[" + o + "]"), C = E ? E.getAttribute(o) : null;
        C && (v(l, C, m), mt(function() {
          f._destroyed || f._render();
        }), T = !0);
      }
    }
    if (!T) {
      const m = l.querySelectorAll("[" + o + "]");
      for (let E = 0; E < m.length; E++)
        if (m[E].checked && !u(m[E])) {
          mt(function() {
            f._destroyed || f._render();
          });
          break;
        }
    }
    return this;
  }
  S.prototype._attachHandlers = function() {
    const l = this;
    this._onDomChange = function(r) {
      const f = r.target;
      if (!f || !f.hasAttribute || !f.hasAttribute(o)) return;
      const y = Array.from(l.dom.querySelectorAll("[" + o + "]"));
      if (u(f)) {
        for (let T = 0; T < y.length; T++)
          u(y[T]) || (y[T].checked = !1);
        f.checked = !0, l._queueRender();
        return;
      }
      if (f.checked) {
        for (let m = 0; m < y.length; m++)
          u(y[m]) && (y[m].checked = !1);
        let T = !1;
        for (let m = 0; m < y.length; m++)
          if (u(y[m])) {
            T = !0;
            break;
          }
        if (T) {
          let m = !0;
          for (let E = 0; E < y.length; E++)
            if (!u(y[E]) && !y[E].checked) {
              m = !1;
              break;
            }
          if (m)
            for (let E = 0; E < y.length; E++)
              u(y[E]) ? y[E].checked = !0 : y[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let m = 0; m < y.length; m++)
          if (!u(y[m]) && y[m].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let m = 0; m < y.length; m++)
            u(y[m]) && (y[m].checked = !0);
      }
      l._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const l = this, r = w(this), f = this._lastSnapshot;
    if (!(!f || f.key !== r.key || Qr(f.values, r.values))) return;
    const T = r.key === null || r.values.length === 0, m = document.getElementById(l.targetId), E = {
      key: r.key,
      values: r.values.slice(),
      targetId: l.targetId
    };
    q(l.dom, "ln-filter:change", E);
    let C = !1;
    m && m !== l.dom && Z(m, "ln-filter:change", E).defaultPrevented && (C = !0);
    const k = f && f.values.length > 0, D = r.values.length === 0;
    if (k && D) {
      const O = { targetId: l.targetId };
      q(l.dom, "ln-filter:reset", O), m && m !== l.dom && q(m, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: r.key, values: r.values.slice() };
    const I = Xr(r.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = An(r.key, r.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = m && (m.tagName === "TABLE" ? m : m.querySelector ? m.querySelector("table") : null);
    if (R)
      l._filterTableRows(r, R);
    else {
      if (!m) return;
      const O = m.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(b), T) continue;
        const U = B.getAttribute("data-" + r.key);
        U !== null && (xe(U, r.values) || B.setAttribute(b, "true"));
      }
    }
  };
  function A(l) {
    if (!l) return "";
    const r = l.querySelector ? l.querySelector("[data-ln-value]") : null;
    return vt(r || l);
  }
  function d(l) {
    return !!(!l || typeof l != "object" || l.tagName === "TEMPLATE" || typeof l.hasAttribute == "function" && (l.hasAttribute("data-ln-sort-exclude") || l.hasAttribute("hidden")) || l.classList && l.classList.contains("hidden") || l.style && l.style.display === "none" || typeof l.matches == "function" && l.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof l.querySelector == "function" && l.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(l, r) {
    if (!r) {
      const C = document.getElementById(this.targetId);
      if (!C || (r = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !r)) return;
    }
    const f = Ge(r, this.dom, l.key, this.colIndex), y = l.key || this.dom.getAttribute("data-ln-filter-key") || (f !== null ? "col" + f : "attr-filter"), T = l.values;
    n.has(r) || n.set(r, {});
    const m = n.get(r);
    y && T.length > 0 ? m[y] = {
      col: f,
      values: T.slice(),
      attr: "data-" + y
    } : y && delete m[y];
    const E = r.tBodies;
    for (let C = 0; C < E.length; C++) {
      const k = E[C].rows;
      for (let D = 0; D < k.length; D++) {
        const I = k[D];
        if (d(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        $r(R, m, I) ? I.removeAttribute(b) : I.setAttribute(b, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const l = document.getElementById(this.targetId);
    if (l) {
      const r = l.tagName === "TABLE" ? l : l.querySelector ? l.querySelector("table") : null;
      if (r && n.has(r)) {
        const f = n.get(r), y = Ge(r, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (y !== null ? "col" + y : this.colIndex !== null ? "col" + this.colIndex : null);
        T && f[T] && (delete f[T], this._filterTableRows({ key: null, values: [] }, r)), Object.keys(f).length === 0 && n.delete(r);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function g(l, r) {
    const f = l[e];
    if (!(!f || f._destroyed)) {
      if (r === s)
        f.hashEnabled && f._onHashChange && window.removeEventListener("hashchange", f._onHashChange), f.nsKey = wt(l, "filter"), f.hashEnabled = !!f.nsKey, f.hashEnabled && window.addEventListener("hashchange", f._onHashChange);
      else if (r === c) {
        const y = Qe(l.getAttribute(c)), T = l.querySelector("[" + o + "]"), m = T ? T.getAttribute(o) : null;
        m && (v(l, m, y), f._render());
      }
    }
  }
  j(t, e, S, "ln-filter", {
    attributes: a,
    persist: {
      attr: c,
      hashActive: function(l) {
        return !!wt(l, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", o = "data-ln-search-for", h = "lnSearchControl", b = "data-ln-search-items", _ = "data-ln-search-fields", i = "data-ln-search-exclude", s = "data-ln-search-hide", c = "data-ln-hash";
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
  }, a = et(n);
  function p(r) {
    const f = wt(r, "search");
    if (f) return f;
    if (r.id) {
      const y = document.querySelector("[" + o + '="' + r.id + '"]');
      if (y) {
        const T = wt(y, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(r) {
    return r.matches("input, textarea") ? r : r.querySelector("input, textarea");
  }
  function w(r, f) {
    const y = r.childNodes;
    for (let T = 0; T < y.length; T++) {
      const m = y[T];
      if (m.nodeType === 3) {
        f.push(m.nodeValue);
        continue;
      }
      m.nodeType === 1 && (m.hasAttribute(i) || w(m, f));
    }
  }
  function v(r) {
    if (r._lnSearchText !== void 0) return r._lnSearchText;
    const f = [];
    w(r, f);
    const y = Sr(f);
    return r._lnSearchText = y, y;
  }
  function S(r, f) {
    if (!r.id) return;
    const y = document.querySelectorAll("[" + o + '="' + r.id + '"]');
    for (const T of y) {
      const m = u(T);
      m && m.value !== f && (m.value = f);
    }
  }
  function A(r) {
    this.dom = r, this.term = r.getAttribute(t) || "", this._destroyed = !1;
    const f = this;
    return this.nsKey = p(r), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (f._destroyed || !f.hashEnabled) return;
      const y = ot(f.nsKey), T = f.dom.getAttribute(t) || "";
      y !== null && y !== T ? f.dom.setAttribute(t, y) : y === null && T !== "" && f.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!f._destroyed) {
        if (f.hashEnabled) {
          const y = ot(f.nsKey);
          if (y !== null && y !== f.term) {
            f.term = y, f.dom.setAttribute(t, y), S(f.dom, y), f._apply();
            return;
          }
        }
        ye(f.term) && (S(f.dom, f.term), f._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const r = this.dom, f = ye(this.term), y = Tn(f);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = Ar(r.getAttribute(_));
    if (Z(r, "ln-search:change", {
      term: f,
      tokens: y,
      targetId: r.id,
      fields: T
    }).defaultPrevented) return;
    const E = r.getAttribute(b), C = E ? r.querySelectorAll(E) : r.children;
    for (let k = 0; k < C.length; k++) {
      const D = C[k];
      if (D.removeAttribute(s), D.hasAttribute(i) || y.length === 0) continue;
      const I = v(D);
      Ln(I, y) || D.setAttribute(s, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function d(r) {
    if (this.dom = r, tt(this, r, a), this.input = u(r), this._attachHandler(), this.input && this.input.value.trim()) {
      const f = this;
      mt(function() {
        const y = document.getElementById(f.targetId);
        y && ((y.getAttribute(t) || "").trim() || f._write(f.input.value));
      });
    }
    return this;
  }
  d.prototype._write = function(r) {
    const f = document.getElementById(this.targetId);
    f && f.getAttribute(t) !== r && f.setAttribute(t, r);
  }, d.prototype._attachHandler = function() {
    if (!this.input) return;
    const r = this;
    this._onInput = function() {
      r._write(r.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, d.prototype.destroy = function() {
    this.dom[h] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[h]);
  };
  function g(r) {
    const f = r.getAttribute("data-ln-search-clear-for");
    if (f) {
      const C = document.getElementById(f), k = document.querySelector("[" + o + '="' + f + '"]'), D = k ? u(k) : null;
      return { target: C, input: D };
    }
    const y = r.closest("[" + t + "]");
    if (y) {
      const C = y.id ? document.querySelector("[" + o + '="' + y.id + '"]') : null, k = C ? u(C) : null;
      return { target: y, input: k };
    }
    const T = r.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), k = C ? document.getElementById(C) : null;
      if (k && k.hasAttribute(t)) {
        const D = document.querySelector("[" + o + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: k, input: I };
      }
    }
    const m = r.closest("[" + o + "]");
    if (m) {
      const C = m.getAttribute(o), k = C ? document.getElementById(C) : null, D = u(m);
      return { target: k, input: D };
    }
    const E = r.parentElement;
    if (E) {
      const C = E.querySelector("[" + o + "]");
      if (C) {
        const k = C.getAttribute(o), D = k ? document.getElementById(k) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(r) {
    const f = r.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!f) return;
    const y = g(f);
    !y.target && !y.input || (r.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function l(r, f) {
    const y = r[e];
    if (!y || y._destroyed) return;
    if (f === c) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = p(r), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const T = r.getAttribute(t) || "";
    T !== y.term && (y.term = T, S(r, T), y._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(r, f) {
      const y = f.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(r) {
        return !!p(r);
      }
    }
  }), j(o, h, d);
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
  const _ = b === "desc" ? -1 : 1, i = typeof h == "function" ? h : (s) => s;
  return function(s, c) {
    const n = i(s), a = i(c);
    return Te(n, a, e, o) * _;
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
  const t = "data-ln-sort", e = "lnSort", o = "data-ln-sort-field", h = "data-ln-sort-state", b = "data-ln-sort-dir", _ = "data-ln-hash";
  if (window[e] !== void 0) return;
  function i(w, v) {
    return w.getAttribute(v) || null;
  }
  const s = {
    "data-ln-sort": { prop: "targetId", read: Q, fallback: null },
    "data-ln-sort-field": { prop: "field", read: i, effect: u },
    "data-ln-sort-dir": {},
    "data-ln-sort-items": { prop: "itemsSelector", read: i },
    "data-ln-sort-state": { effect: u },
    "data-ln-hash": { effect: u }
  }, c = et(s), n = /* @__PURE__ */ new WeakMap();
  function a(w, v, S) {
    if (v) {
      const A = w.querySelector('[data-ln-field="' + v + '"]');
      return A ? vt(A) : "";
    }
    return S != null && w.cells && w.cells[S] ? vt(w.cells[S]) : vt(w);
  }
  function p(w) {
    this.dom = w, tt(this, w, c);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(h)), w.hasAttribute(h) || w.setAttribute(h, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(d) {
      const g = d.target.closest("[" + b + "]");
      if (!g) return;
      const l = St(g.getAttribute(b));
      S._apply(l);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(d) {
      if (S._destroyed || !d.detail) return;
      const g = S._resolveTarget();
      if (!(g && (d.target === g || g.contains(d.target)) || d.detail.targetId && d.detail.targetId === S.targetId)) return;
      if (Zr(
        { field: S.field, column: S.column },
        { field: d.detail.field, column: d.detail.column }
      )) {
        const f = St(d.detail.direction);
        f && w.getAttribute(h) !== f && (S._state = f, w.setAttribute(h, f), S._updateAriaSort(f));
        return;
      }
      w.getAttribute(h) !== "none" && (S._state = "none", w.setAttribute(h, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const d = ot(S.nsKey), g = ge(d);
      if (g)
        S.field !== null && g.fieldOrColumn === S.field || S.column !== null && String(S.column) === g.fieldOrColumn ? S._state !== g.direction && S._apply(g.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(h, "none"), S._updateAriaSort("none"));
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
      const d = ot(this.nsKey), g = ge(d);
      g && ((S.field !== null && g.fieldOrColumn === S.field || S.column !== null && String(S.column) === g.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(g.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const d = St(w.getAttribute(h));
      d && d !== "none" && mt(function() {
        S._destroyed || S._apply(d, !0);
      });
    }
    return this;
  }
  p.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, p.prototype._updateAriaSort = function(w) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", Jr(w));
  }, p.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const l = this.dom.closest("th");
      l && l.cellIndex !== void 0 && (this.column = l.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(h) !== S && this.dom.setAttribute(h, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const d = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const l = En(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, l);
    }
    Z(A, "ln-sort:change", d).defaultPrevented || this._defaultSort(A, S);
  }, p.prototype._defaultSort = function(w, v) {
    const S = ei(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, d = S.filter(function(f) {
      return !me(f);
    });
    if (!d.length) return;
    n.has(w) || n.set(w, d.slice());
    let g;
    if (v === "none") {
      const f = n.get(w) || d;
      n.delete(w), g = f.filter(function(y) {
        return y.parentNode === A && !me(y);
      });
    } else {
      const f = this.field, y = this.column, T = d.map(function(k) {
        return a(k, f, y);
      }), m = Ce(T), E = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = ti(v, m, E, function(k) {
        return a(k, f, y);
      });
      g = d.slice().sort(C);
    }
    const l = document.createDocumentFragment();
    let r = 0;
    for (let f = 0; f < S.length; f++) {
      const y = S[f];
      me(y) ? l.appendChild(y) : r < g.length && l.appendChild(g[r++]);
    }
    A.appendChild(l);
  }, p.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === o) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === h) {
        const A = St(w.getAttribute(h));
        A !== S._state && S._apply(A);
      } else v === _ && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, p, "ln-sort", {
    attributes: s,
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
  const _ = Math.max(0, t || 0), i = Math.max(0, e || 0), s = Math.floor(_ / o), c = Math.ceil(i / o), n = Math.max(0, s - b), a = Math.min(h, s + c + b), p = n * o, u = Math.max(0, (h - a) * o);
  return { start: n, end: a, topPadding: p, bottomPadding: u };
}
function ni(t, e) {
  const o = Array.isArray(t) ? t.length : 0, h = e instanceof Set ? e : new Set(e || []);
  let b = 0;
  if (Array.isArray(t))
    for (let s = 0; s < t.length; s++)
      h.has(t[s]) && b++;
  else
    b = h.size;
  const _ = o > 0 && b === o, i = b > 0 && b < o;
  return { totalCount: o, selectedCount: b, isAllSelected: _, isIndeterminate: i };
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
  function c(d, g) {
    if (!d || !d.isDataDriven) return;
    const l = d.dom.hasAttribute("data-ln-table-window");
    if (l && !d._windowed)
      d._enterWindowedMode(), d._kickWindowInitial();
    else if (!l && d._windowed)
      d._exitWindowedMode();
    else if (l && d._windowed) {
      const r = parseInt(g, 10);
      r > 0 && d._cache.configure({ windowSize: r });
    }
  }
  function n(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const l = parseInt(g, 10);
    l > 0 && d._cache.configure({ pageSize: l });
  }
  function a(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const l = parseInt(g, 10);
    l >= 0 && d._cache.configure({ threshold: l });
  }
  function p(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const l = parseInt(g, 10);
    l >= 0 && d._cache.setGrandTotal(l);
  }
  const u = {
    "data-ln-table": { prop: "name", read: Q, fallback: "" },
    "data-ln-table-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-table-selectable": { prop: "_selectable", read: Kt },
    "data-ln-table-window": { effect: c },
    "data-ln-table-window-page": { effect: n },
    "data-ln-table-window-threshold": { effect: a },
    "data-ln-table-count": { effect: p },
    "data-ln-table-row": {},
    "data-ln-table-row-id": {},
    "data-ln-table-row-action": {},
    "data-ln-table-row-select": {},
    "data-ln-table-col": {},
    "data-ln-table-col-select": {},
    "data-ln-table-cell-attr": {},
    "data-ln-table-empty": {},
    "data-ln-table-select-all-label": {}
  }, w = et(u);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(d, g) {
    if (d == null || isNaN(d)) return "";
    try {
      return new Intl.NumberFormat(rt(g)).format(d);
    } catch {
      return String(d);
    }
  }
  function S(d) {
    let g = d.parentElement;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const r = getComputedStyle(g).overflowY;
      if (r === "auto" || r === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function A(d) {
    this.dom = d, tt(this, d, w), this.table = d.querySelector("table"), this.tbody = d.querySelector("[data-ln-table-body]") || d.querySelector("tbody"), this.thead = d.querySelector("thead");
    const g = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = g ? Array.from(g.querySelectorAll("th")) : [], this._totalSpan = d.querySelector("[data-ln-table-total]"), this._filteredSpan = d.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== d ? this._filteredSpan.parentElement : null), this._selectedSpan = d.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== d ? this._selectedSpan.parentElement : null), this.isDataDriven = d.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    return this._onSetSearch = function(r) {
      const f = (r.detail && r.detail.query != null ? r.detail.query : r.detail && r.detail.term != null ? r.detail.term : "").trim();
      l.isDataDriven ? (l.currentSearch = f, q(d, "ln-table:search", {
        table: l.name,
        query: l.currentSearch
      }), l._requestData()) : (l._searchTerm = f.toLowerCase(), l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(d, "ln-table:filter", {
        term: l._searchTerm,
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, d.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(r) {
      r.preventDefault(), l._onSetSearch(r);
    }, d.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      l.isDataDriven ? (l.currentFilters = {}, l.currentSearch = "", q(d, "ln-table:clear-filters", { table: l.name }), l._requestData()) : (l._searchTerm = "", l._columnFilters = {}, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(d, "ln-table:filter", {
        term: "",
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, d.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && d.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(r) {
      const f = r.detail || {}, y = f.data || [], T = f.total != null ? f.total : y.length;
      if (!(l._hasInitialSeed && !l.isLoaded && y.length === 0 && T === 0)) {
        if (l._windowed) {
          l._cache.ingest(f) && !f.provisional && d.classList.remove("ln-table--loading");
          return;
        }
        l._data = y, l._lastTotal = T, l._lastFiltered = f.filtered != null ? f.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, l._hasInitialSeed = !1, d.classList.remove("ln-table--loading"), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), q(d, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }
    }, d.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
      const f = r.detail && r.detail.loading;
      d.classList.toggle("ln-table--loading", !!f), f && (l.isLoaded = !1);
    }, d.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(r) {
      !l._windowed || !l._cache || l._cache.release(r.detail && r.detail.offset);
    }, d.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !l._windowed || !l._cache || l._cache.revalidate();
    }, d.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !l._windowed || !l._cache || l._requestData();
    }, d.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(r) {
      r.preventDefault(), l.currentSort = r.detail.direction === "none" ? null : { field: r.detail.field, direction: r.detail.direction }, l._requestData();
    }, d.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(r) {
      if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const f = r.target.closest("[data-ln-table-row]");
      if (!f) return;
      const y = f.getAttribute("data-ln-table-row-id"), T = f._lnRecord || {};
      q(d, "ln-table:row-click", {
        table: l.name,
        id: y,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
      const f = r.target.closest("[data-ln-table-row-action]");
      if (!f) return;
      const y = f.closest("[data-ln-table-row]");
      if (!y) return;
      const T = f.getAttribute("data-ln-table-row-action"), m = y.getAttribute("data-ln-table-row-id"), E = y._lnRecord || {};
      q(d, "ln-table:row-action", {
        table: l.name,
        id: m,
        action: T,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : q(d, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(r) {
      r.preventDefault();
      const f = r.detail.direction === "none" ? null : r.detail.direction;
      l._sortCol = f === null ? -1 : r.detail.column, l._sortDir = f, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), q(d, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: l._filteredData.length,
        total: l._data.length
      });
    }, d.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(r) {
      if (r.preventDefault(), !r.detail) return;
      const f = r.detail.key, y = r.detail.values || [];
      if (f) {
        if (y.length === 0)
          delete l._columnFilters[f];
        else {
          const T = [];
          for (let m = 0; m < y.length; m++)
            T.push(y[m].toLowerCase());
          l._columnFilters[f] = T;
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(d, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }
    }, d.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const d = this.tbody.rows, g = this.ths;
    this._data = [], d.length > 0 && (this._rowHeight = d[0].offsetHeight || 40), this._lockColumnWidths();
    for (let l = 0; l < d.length; l++) {
      const r = d[l], f = [], y = [], T = [];
      for (let E = 0; E < r.cells.length; E++) {
        const C = r.cells[E], k = C.textContent.trim();
        f[E] = vt(C), y[E] = k.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(k.toLowerCase());
      }
      let m = null;
      if (this.isDataDriven) {
        m = {};
        const E = r.getAttribute("data-ln-table-row-id");
        E != null && (m.id = E);
        for (let C = 0; C < g.length; C++) {
          const k = g[C].getAttribute("data-ln-table-col");
          if (k) {
            const D = C;
            if (D < r.cells.length) {
              const I = r.cells[D];
              m[k] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: f,
        rawTexts: y,
        html: r.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && m ? m.id : void 0,
        ...m
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), q(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const d = document.createElement("colgroup");
    this.ths.forEach(function(g) {
      const l = document.createElement("col");
      l.style.width = g.offsetWidth + "px", d.appendChild(l);
    }), this.table.insertBefore(d, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = d;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const d = this._lastTotal, g = this.visibleCount;
        if (d === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const d = this._filteredData.length;
        d === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : d > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const d = this._filteredData, g = document.createDocumentFragment();
      for (let l = 0; l < d.length; l++) {
        const r = this._buildRow(d[l]);
        if (!r) break;
        g.appendChild(r);
      }
      this.tbody.replaceChildren(g), this._selectable && this._updateSelectAll();
    } else {
      const d = [], g = this._filteredData;
      for (let l = 0; l < g.length; l++) d.push(g[l].html);
      this.tbody.innerHTML = d.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const d = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let l = null;
        if (this._windowed) {
          const r = this._cache ? this._cache.peek() : null;
          l = r ? this._buildRow(r) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (l = this._buildRow(this._data[0]));
        l && this.tbody && (this.tbody.appendChild(l), this._rowHeight = l.offsetHeight || 40, l.remove());
      }
    this.isDataDriven ? this._scrollContainer = S(this.dom) : this._scrollContainer = null;
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      d._rafId || (d._rafId = requestAnimationFrame(function() {
        d._rafId = null, d._windowed ? d._renderWindowed() : d._renderVirtual();
      }));
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const d = this._filteredData, g = d.length, l = this._rowHeight;
    if (!l || !g) return;
    const r = this.thead ? this.thead.offsetHeight : 0, f = this._scrollContainer;
    let y, T;
    if (f) {
      const R = this.table.getBoundingClientRect(), O = f.getBoundingClientRect(), P = R.top - O.top + f.scrollTop + r;
      y = f.scrollTop - P, T = f.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + r;
      y = window.scrollY - P, T = window.innerHeight;
    }
    const m = $e(y, T, l, g, 15), E = m.start, C = m.end;
    if (E === this._vStart && C === this._vEnd) return;
    this._vStart = E, this._vEnd = C;
    const k = this.ths.length || 1, D = m.topPadding, I = m.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", k), P.style.height = D + "px", O.appendChild(P), R.appendChild(O);
      }
      for (let O = E; O < C; O++) {
        const P = this._buildRow(d[O]);
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
      for (let O = E; O < C; O++) R += d[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + k + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const d = document.createElement("tr");
    d.className = "ln-table__placeholder", d.setAttribute("aria-hidden", "true");
    const g = document.createElement("td");
    return g.setAttribute("colspan", this.ths.length || 1), g.style.height = this._rowHeight + "px", d.appendChild(g), d;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const d = this._rowHeight;
    if (!d) return;
    const g = this._cache.logicalTotal, l = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let f, y;
    if (r) {
      const R = this.table.getBoundingClientRect(), O = r.getBoundingClientRect(), P = R.top - O.top + r.scrollTop + l;
      f = r.scrollTop - P, y = r.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + l;
      f = window.scrollY - P, y = window.innerHeight;
    }
    const T = $e(f, y, d, g, 15), m = T.start, E = T.end, C = this.ths.length || 1, k = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (k > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = k + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = m; R < E; R++)
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
    this.tbody.replaceChildren(I), this._vStart = m, this._vEnd = E, this._cache.ensure(m, E);
  }, A.prototype._showEmptyState = function() {
    const d = this.ths.length || 1;
    let g = null, l = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount === 0 && r > 0, T = y ? this.name + "-empty-filtered" : this.name + "-empty";
      if (l = Tt(this.dom, T, "ln-table"), !l) {
        const m = this.dom.querySelector("template[data-ln-table-empty]");
        if (m) {
          const E = y ? "search" : "initial", C = m.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || m.content.firstElementChild;
          C && (l = document.importNode(C, !0));
        }
      }
      if (l)
        if (l.tagName === "TR")
          g = l;
        else {
          const m = document.createElement("td");
          m.setAttribute("colspan", String(d)), m.appendChild(l);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(m), g = E;
        }
    } else {
      const r = this.dom.querySelector("template[" + o + "]"), f = document.createElement("td");
      f.setAttribute("colspan", String(d)), r && f.appendChild(document.importNode(r.content, !0));
      const y = document.createElement("tr");
      y.className = "ln-table__empty", y.appendChild(f), g = y;
    }
    g ? this.tbody.replaceChildren(g) : this.tbody.replaceChildren(), q(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(d, g) {
    jt(d, g);
    const l = d.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < l.length; r++) {
      const f = l[r], y = f.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < y.length; T++) {
        const m = y[T].trim().split(":");
        if (m.length !== 2) continue;
        const E = m[0].trim(), C = m[1].trim();
        g[E] != null && f.setAttribute(C, g[E]);
      }
    }
  }, A.prototype._buildRow = function(d) {
    let g = Tt(this.dom, this.name + "-row", "ln-table");
    if (!g) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (g = document.importNode(r.content, !0));
    }
    let l = g ? g.querySelector("[data-ln-table-row]") || g.firstElementChild : null;
    if (l)
      this._fillRow(l, d);
    else if (d && d.html) {
      const r = document.createElement("tbody");
      r.innerHTML = d.html, l = r.firstElementChild;
    } else {
      l = document.createElement("tr"), l.setAttribute("data-ln-table-row", "");
      const r = this.ths;
      for (let f = 0; f < r.length; f++) {
        const y = r[f].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (y) {
          const m = document.createElement("input");
          m.type = "checkbox", m.setAttribute("data-ln-table-row-select", ""), m.setAttribute("aria-label", "Select row"), T.appendChild(m);
        } else {
          const m = r[f].getAttribute("data-ln-table-col");
          m && d[m] != null && (T.textContent = String(d[m]));
        }
        l.appendChild(T);
      }
    }
    if (l._lnRecord = d, d.id != null && l.setAttribute("data-ln-table-row-id", d.id), this._selectable && d.id != null && this.selectedIds.has(String(d.id))) {
      l.classList.add("ln-row-selected");
      const r = l.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
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
    const d = this, g = this.dom, l = parseInt(g.getAttribute("data-ln-table-window"), 10), r = parseInt(g.getAttribute("data-ln-table-window-page"), 10), f = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !d._windowed || !d._cache || (d.totalCount = d._cache.grandTotal, d.visibleCount = d._cache.logicalTotal, d._lastTotal = d._cache.grandTotal, d.isLoaded = !0, d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), q(g, "ln-table:rendered", {
        table: d.name,
        total: d.totalCount,
        visible: d.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = vn({
      windowSize: l > 0 ? l : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: f >= 0 ? f : 25,
      fetchDebounce: 120,
      requestPage: function(y, T, m) {
        q(g, "ln-table:request-data", {
          table: d.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: T,
          limit: m,
          queryGen: d._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let d = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(d) && this._totalSpan) {
        const l = this._totalSpan.textContent.replace(/[^\d]/g, "");
        l && (d = parseInt(l, 10));
      }
      const g = d > 0 ? d : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: g,
        filtered: g
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
    const d = this.tbody.querySelectorAll("[data-ln-table-row]"), g = [];
    for (let r = 0; r < d.length; r++) {
      const f = d[r].getAttribute("data-ln-table-row-id");
      f != null && g.push(f);
    }
    const l = ni(g, this.selectedIds);
    this._selectAllCheckbox.checked = l.isAllSelected, this._selectAllCheckbox.indeterminate = l.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const d = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let g = 0; g < d.length; g++) {
      const l = d[g].getAttribute("data-ln-table-row-id"), r = l != null && this.selectedIds.has(l);
      d[g].classList.toggle("ln-row-selected", r);
      const f = d[g].querySelector("[data-ln-table-row-select]");
      f && (f.checked = r);
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
    const d = this;
    if (this._onSelectionChange = function(g) {
      const l = g.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const r = l.closest("[data-ln-table-row]");
      if (!r) return;
      const f = r.getAttribute("data-ln-table-row-id");
      f != null && (d.selectedIds = Ye(d.selectedIds, f, l.checked), r.classList.toggle("ln-row-selected", l.checked), d.selectedCount = d.selectedIds.size, d._updateSelectAll(), d._updateFooter(), q(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const g = document.createElement("input");
      g.type = "checkbox";
      const l = d.dom.querySelector('[data-ln-table-dict="select-all"]'), r = d.dom.getAttribute("data-ln-table-select-all-label") || (l ? l.textContent.trim() : null) || "Select all";
      g.setAttribute("aria-label", r), this._selectAllCheckbox.appendChild(g), this._selectAllCheckbox = g;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = d._selectAllCheckbox.checked, l = d.tbody ? d.tbody.querySelectorAll("[data-ln-table-row]") : [], r = [];
      for (let f = 0; f < l.length; f++) {
        const y = l[f].getAttribute("data-ln-table-row-id"), T = l[f].querySelector("[data-ln-table-row-select]");
        y != null && (r.push(y), l[f].classList.toggle("ln-row-selected", g), T && (T.checked = g));
      }
      d.selectedIds = Xe(d.selectedIds, r, g), d.selectedCount = d.selectedIds.size, q(d.dom, "ln-table:select-all", {
        table: d.name,
        selected: g
      }), q(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }), d._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < g.length; l++) {
        const r = g[l].querySelector("[data-ln-table-row-select]"), f = g[l].getAttribute("data-ln-table-row-id");
        r && r.checked && f != null && (d.selectedIds = Ye(d.selectedIds, f, !0), g[l].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const d = this.dom.querySelector("[data-ln-table-col-select]");
    if (d) {
      const g = d.querySelector('input[type="checkbox"]');
      g && g.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Xe(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < g.length; l++) {
        g[l].classList.remove("ln-row-selected");
        const r = g[l].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let d = 0, g = 0;
    this.isDataDriven ? (d = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (d = this._data.length, g = this._filteredData.length);
    const l = g < d;
    if (this._totalSpan && (this._totalSpan.textContent = v(d, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = l ? v(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? v(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, A, "ln-table", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-table-coordinator": {}
  };
  document.addEventListener("keydown", function(s) {
    if (s.key !== "/" || s.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const c = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!c) return;
    const n = c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector('input[type="search"], input[type="text"], input');
    n && (s.preventDefault(), n.focus());
  });
  function h(s) {
    return this.dom = s, i(this), this;
  }
  function b(s, c) {
    const n = c ? '[data-ln-search-for="' + c + '"]' : "[data-ln-search-for]", a = s.querySelector(n) || document.querySelector(n);
    return a ? a.tagName === "INPUT" || a.tagName === "TEXTAREA" ? a : a.querySelector("input, textarea") : null;
  }
  function _(s, c) {
    if (c) {
      const a = s.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (a.length > 0) return a;
      const p = document.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (p.length > 0) return p;
    }
    const n = s.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function i(s) {
    const c = s.dom;
    function n(a) {
      const p = a.target;
      if (p && p.hasAttribute && (p.hasAttribute("data-ln-table") || p.tagName === "TABLE")) return p;
      const u = a.detail && a.detail.targetId || p && p.id;
      return u ? c.querySelector('[data-ln-table-source="' + u + '"]') || c.querySelector('[data-ln-table="' + u + '"]') || c.querySelector("#" + u) || (c.id === u ? c : null) || document.getElementById(u) : null;
    }
    s._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(a) {
        if (!a.detail) return;
        const p = n(a);
        if (!p) return;
        const u = a.detail.key, w = a.detail.values || [], v = p.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === u) {
            const d = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            d && d.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(a) {
        const p = a.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!p) return;
        const u = p.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, v = u.querySelectorAll("th");
        for (let g = 0; g < v.length; g++) {
          const l = v[g].querySelector("[data-ln-table-col-filter], .table-filter");
          l && l.classList.remove("ln-filter-active");
        }
        const S = u.getAttribute("data-ln-table-source") || u.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const g = b(c, S);
          g && g.value !== "" && (g.value = "", g.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const d = _(c, S);
        for (let g = 0; g < d.length; g++) {
          const l = d[g].querySelector("[data-ln-filter-reset]");
          if (!l) continue;
          const r = d[g].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!l.checked || r) && (l.checked = !0, l.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && q(u, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", s._handlers.filter), c.addEventListener("click", s._handlers.clear);
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
  function c(r, f) {
    if (!r || !r.isDataDriven) return;
    const y = r.dom.hasAttribute("data-ln-list-window");
    if (y && !r._windowed)
      r._enterWindowedMode(), r._kickWindowInitial();
    else if (!y && r._windowed)
      r._exitWindowedMode();
    else if (y && r._windowed) {
      const T = parseInt(f, 10);
      T > 0 && r._cache.configure({ windowSize: T });
    }
  }
  function n(r, f) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const y = parseInt(f, 10);
    y > 0 && r._cache.configure({ pageSize: y });
  }
  function a(r, f) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const y = parseInt(f, 10);
    y >= 0 && r._cache.configure({ threshold: y });
  }
  function p(r, f) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const y = parseInt(f, 10);
    y >= 0 && r._cache.setGrandTotal(y);
  }
  const u = {
    "data-ln-list": { prop: "name", read: Q, fallback: "" },
    "data-ln-list-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-list-selectable": { prop: "_selectable", read: Kt },
    "data-ln-list-window": { effect: c },
    "data-ln-list-window-page": { effect: n },
    "data-ln-list-window-threshold": { effect: a },
    "data-ln-list-count": { effect: p },
    "data-ln-list-empty": {},
    "data-ln-list-field": {}
  }, w = et(u);
  function v(r, f) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(rt(f)).format(r);
    } catch {
      return String(r);
    }
  }
  function S(r) {
    let f = r;
    for (; f && f !== document.body && f !== document.documentElement; ) {
      const T = getComputedStyle(f).overflowY;
      if (T === "auto" || T === "scroll") return f;
      f = f.parentElement;
    }
    return null;
  }
  function A(r) {
    const f = r._scrollContainer || S(r.dom);
    return {
      container: f,
      top: f ? f.scrollTop : window.scrollY
    };
  }
  function d(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function g(r) {
    if (!r) return 0;
    const f = getComputedStyle(r), y = parseFloat(f.marginTop) || 0, T = parseFloat(f.marginBottom) || 0;
    return r.offsetHeight + y + T;
  }
  function l(r) {
    this.dom = r, tt(this, r, w), this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const f = this;
    return this._onSetSearch = function(y) {
      const T = (y.detail && y.detail.query != null ? y.detail.query : y.detail && y.detail.term != null ? y.detail.term : "").trim();
      f.isDataDriven ? (f.currentSearch = T, q(r, "ln-list:search", {
        list: f.name,
        query: f.currentSearch
      }), f._requestData()) : (f._searchTerm = T.toLowerCase(), f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), q(r, "ln-list:filter", {
        term: f._searchTerm,
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, r.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(y) {
      y.preventDefault(), f._onSetSearch(y);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      f.isDataDriven ? (f.currentFilters = {}, f.currentSearch = "", q(r, "ln-list:clear-filters", { list: f.name }), f._requestData()) : (f._searchTerm = "", f._filters = {}, f._sortField = null, f._sortDir = null, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), q(r, "ln-list:filter", {
        term: "",
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(y) {
      const T = y.detail || {}, m = T.data || [], E = T.total != null ? T.total : m.length;
      if (!(f._hasInitialSeed && !f.isLoaded && m.length === 0 && E === 0)) {
        if (f._windowed) {
          f._cache.ingest(T) && !T.provisional && r.classList.remove("ln-list--loading");
          return;
        }
        f._data = m, f._lastTotal = E, f._lastFiltered = T.filtered != null ? T.filtered : f._data.length, f.totalCount = f._lastTotal, f.visibleCount = f._lastFiltered, f.isLoaded = !0, f._hasInitialSeed = !1, r.classList.remove("ln-list--loading"), f._vStart = -1, f._vEnd = -1, f._applyFilterAndSort(), f._render(), f._updateFooter(), q(r, "ln-list:rendered", {
          list: f.name,
          total: f.totalCount,
          visible: f.visibleCount
        });
      }
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(y) {
      const T = y.detail && y.detail.loading;
      r.classList.toggle("ln-list--loading", !!T), T && (f.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(y) {
      !f._windowed || !f._cache || f._cache.release(y.detail && y.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !f._windowed || !f._cache || f._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !f._windowed || !f._cache || f._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(y) {
      y.detail.field != null && (y.preventDefault(), f.currentSort = y.detail.direction === "none" ? null : { field: y.detail.field, direction: y.detail.direction }, f._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(y) {
      if (y.target.closest("[data-ln-item-select]") || y.target.closest("[data-ln-item-action]") || y.target.closest("a") || y.target.closest("button") || y.ctrlKey || y.metaKey || y.button === 1) return;
      const T = y.target.closest("[data-ln-item]");
      if (!T) return;
      const m = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      q(r, "ln-list:item-click", {
        list: f.name,
        id: m,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(y) {
      const T = y.target.closest("[data-ln-item-action]");
      if (!T) return;
      const m = T.closest("[data-ln-item]");
      if (!m) return;
      const E = T.getAttribute("data-ln-item-action"), C = m.getAttribute("data-ln-item-id"), k = m._lnRecord || {};
      q(r, "ln-list:item-action", {
        list: f.name,
        id: C,
        action: E,
        record: k
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : q(r, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      f.tbody.children.length > 0 && (f._emptyObserver.disconnect(), f._emptyObserver = null, f._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(y) {
      if (y.preventDefault(), !y.detail) return;
      const T = y.detail.key, m = y.detail.values || [];
      if (T) {
        if (m.length === 0)
          delete f._filters[T];
        else {
          const E = [];
          for (let C = 0; C < m.length; C++)
            E.push(m[C].toLowerCase());
          f._filters[T] = E;
        }
        f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), q(r, "ln-list:filter", {
          term: f._searchTerm,
          matched: f._filteredData.length,
          total: f._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(y) {
      if (y.detail && y.detail.field == null) return;
      y.preventDefault();
      const T = y.detail && y.detail.direction === "none" ? null : y.detail && y.detail.direction;
      f._sortField = T === null ? null : y.detail && y.detail.field, f._sortDir = T, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), q(r, "ln-list:sorted", {
        field: f._sortField,
        direction: y.detail && y.detail.direction,
        matched: f._filteredData.length,
        total: f._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  l.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((f) => !f.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = g(r[0]) || 50);
    for (let f = 0; f < r.length; f++) {
      const y = r[f], T = y.getAttribute("data-ln-item-id") || y.getAttribute("id"), m = y.textContent.trim().toLowerCase();
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
        searchText: m,
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
      const r = this._searchTerm, f = r ? r.split(/\s+/).filter(Boolean) : [], y = this._filters || {}, T = Object.keys(y).length > 0;
      if (f.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(m) {
        if (f.length > 0 && !f.every(function(C) {
          return m.searchText && m.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in y) {
            const C = y[E];
            if (C && C.length > 0) {
              const k = m.fields && m.fields[E] !== void 0 ? m.fields[E] : m[E] !== void 0 ? m[E] : null, D = k != null ? String(k).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const m = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base" }) : null, k = this._filteredData.map(function(I) {
          return I.fields && I.fields[m] !== void 0 ? I.fields[m] : I[m];
        }), D = Ce(k);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[m] !== void 0 ? I.fields[m] : I[m], P = R.fields && R.fields[m] !== void 0 ? R.fields[m] : R[m];
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
        const r = this._lastTotal, f = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || f === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, l.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, f = document.createDocumentFragment();
      for (let T = 0; T < r.length; T++) {
        const m = this._buildItem(r[T]);
        m && f.appendChild(m);
      }
      const y = A(this);
      this.tbody.replaceChildren(f), d(y), this._selectable && this._updateSelectAll();
    } else {
      const r = [], f = this._filteredData;
      for (let T = 0; T < f.length; T++) r.push(f[T].html);
      const y = A(this);
      this.tbody.innerHTML = r.join(""), d(y), this._selectable && this._restoreSelection();
    }
  }, l.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), f = r.gridTemplateColumns;
    let y = 1;
    if (f && f !== "none") {
      const m = f.trim().split(/\s+/).filter(Boolean);
      m.length > 0 && (y = m.length);
    }
    const T = parseFloat(r.rowGap);
    return { columns: y, rowGap: isNaN(T) ? 0 : T };
  }, l.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), f = r ? this._buildItem(r) : this._buildPlaceholderItem();
      f && (this.tbody.textContent = "", this.tbody.appendChild(f), this._itemHeight = g(f) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = g(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = g(r[0]) || 50);
    }
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const f = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, f.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const r = this._filteredData, f = r.length, y = this._itemHeight;
    if (!y || !f) return;
    const T = this._scrollContainer;
    let m, E;
    if (T) {
      const Y = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : Y.top - V.top + T.scrollTop;
      m = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      m = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), k = C.columns, D = C.rowGap, I = y + D, R = Math.ceil(f / k);
    let O = Math.max(0, Math.floor(m / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(E / I) + 30, B = Math.min(O + P, R), U = Math.min(O * k, f), z = Math.min(B * k, f);
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
        const ht = this._buildItem(r[G]);
        ht && Y.appendChild(ht);
      }
      if (X > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = X + "px", Y.appendChild(G);
      }
      const V = A(this);
      this.tbody.replaceChildren(Y), d(V), this._selectable && this._updateSelectAll();
    } else {
      let Y = "";
      $ > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${$}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = U; G < z; G++)
        Y += r[G].html;
      X > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${X}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = Y, d(V), this._selectable && this._restoreSelection();
    }
  }, l.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, l.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const f = this._scrollContainer;
    let y, T;
    if (f) {
      const V = this.tbody.getBoundingClientRect(), G = f.getBoundingClientRect(), ht = f === this.tbody ? 0 : V.top - G.top + f.scrollTop;
      y = f.scrollTop - ht, T = f.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - G, T = window.innerHeight;
    }
    const m = this._readGridLayout(), E = m.columns, C = m.rowGap, k = r + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
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
    this.tbody.replaceChildren(X), d(Y), this._vStart = B, this._vEnd = U, this._cache.ensure(B, U);
  }, l.prototype._showEmptyState = function() {
    let r = null;
    if (this.isDataDriven) {
      const f = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && f > 0, m = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = Tt(this.dom, m, "ln-list"), !r) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", k = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          k && (r = document.importNode(k, !0));
        }
      }
    } else {
      const f = this.dom.querySelector(`template[${o}]`);
      if (f) {
        const y = f.content.firstElementChild;
        y && (r = document.importNode(y, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.replaceChildren(r);
      else {
        const f = document.createElement(this.isUl ? "li" : "div");
        f.appendChild(r), this.tbody.replaceChildren(f);
      }
    else
      this.tbody.replaceChildren();
    q(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, l.prototype._buildItem = function(r) {
    let f = Tt(this.dom, this.name + "-row", "ln-list");
    if (!f) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (f = document.importNode(T.content, !0));
    }
    let y = f ? f.querySelector("[data-ln-item]") || f.firstElementChild : null;
    if (y)
      jt(y, r), pt(y, r);
    else if (r && r.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = r.html, y = T.firstElementChild;
    } else if (y = document.createElement(this.isUl ? "li" : "div"), y.setAttribute("data-ln-item", ""), r && typeof r == "object") {
      for (const T in r)
        if (T !== "html" && r[T] != null) {
          const m = document.createElement("span");
          m.setAttribute("data-ln-field", T), m.textContent = String(r[T]), y.appendChild(m);
        }
    }
    if (y._lnRecord = r, r && r.id != null && (y.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      y.classList.add("ln-item-selected");
      const T = y.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return y;
  }, l.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let f = 0; f < r.length; f++) {
      const y = r[f].getAttribute("data-ln-item-id"), T = y != null && this.selectedIds.has(String(y));
      r[f].classList.toggle("ln-item-selected", T);
      const m = r[f].querySelector("[data-ln-item-select]");
      m && (m.checked = T);
    }
    this._updateSelectAll();
  }, l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(f) {
      const y = f.target.closest("[data-ln-item-select]");
      if (!y) return;
      const T = y.closest("[data-ln-item]");
      if (!T) return;
      const m = T.getAttribute("data-ln-item-id");
      m != null && (y.checked ? (r.selectedIds.add(String(m)), T.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(m)), T.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), q(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const f = r._selectAllCheckbox.checked, y = r.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < y.length; T++) {
        const m = y[T], E = m.getAttribute("data-ln-item-id"), C = m.querySelector("[data-ln-item-select]");
        E != null && (f ? (r.selectedIds.add(String(E)), m.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(E)), m.classList.remove("ln-item-selected")), C && (C.checked = f));
      }
      q(r.dom, "ln-list:select-all", { list: r.name, selected: f }), q(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let f = r.length > 0;
    for (let y = 0; y < r.length; y++) {
      const T = r[y].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        f = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = f;
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
    const r = this, f = this.dom, y = parseInt(f.getAttribute("data-ln-list-window"), 10), T = parseInt(f.getAttribute("data-ln-list-window-page"), 10), m = parseInt(f.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), q(f, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = vn({
      windowSize: y > 0 ? y : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: m >= 0 ? m : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, k) {
        q(f, "ln-list:request-data", {
          list: r.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: C,
          limit: k,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, l.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), f = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: f,
        filtered: f
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
    let r = 0, f = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, f = this.visibleCount) : (r = this._data.length, f = this._filteredData.length);
    const y = f < r;
    if (this._totalSpan && (this._totalSpan.textContent = v(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = y ? v(f, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !y), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, l.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, l, "ln-list", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function o(u) {
    const w = u[e];
    w && p.call(w);
  }
  const h = {
    "data-ln-circular-progress": { effect: o },
    "data-ln-circular-progress-max": { effect: o },
    "data-ln-circular-progress-label": { effect: o }
  }, b = "http://www.w3.org/2000/svg", _ = 36, i = 16, s = 2 * Math.PI * i;
  function c(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, a.call(this), p.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(u, w) {
    const v = document.createElementNS(b, u);
    for (const [S, A] of Object.entries(w))
      v.setAttribute(S, A);
    return v;
  }
  function a() {
    this.svg = n("svg", {
      viewBox: "0 0 " + _ + " " + _,
      width: _,
      height: _
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: i,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: i,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": s,
      "stroke-dashoffset": s,
      transform: "rotate(-90 " + _ / 2 + " " + _ / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function p() {
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = Sn(u, w || 100), S = s - v.percentage / 100 * s;
    this.progressCircle.setAttribute("stroke-dashoffset", S);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), d = A !== null ? A : Math.round(v.percentage) + "%";
    this.labelEl.textContent = d, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", d), q(this.dom, "ln-circular-progress:change", {
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
    "data-ln-sortable": { effect: _ },
    "data-ln-sortable-handle": {}
  };
  function b(i) {
    this.dom = i, this.isEnabled = i.getAttribute(t) !== "disabled", this._dragging = null, i.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(c) {
      s.isEnabled && s._handlePointerDown(c);
    }, i.addEventListener("pointerdown", this._onPointerDown), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), q(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, b.prototype._handlePointerDown = function(i) {
    let s = i.target.closest("[" + o + "]"), c;
    if (s) {
      for (c = s; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + o + "]")) return;
      for (c = i.target; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
      s = c;
    }
    const a = Array.from(this.dom.children).indexOf(c);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: c,
      index: a
    }).defaultPrevented) return;
    i.preventDefault(), s.setPointerCapture(i.pointerId), this._dragging = c, c.classList.add("ln-sortable--dragging"), c.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), q(this.dom, "ln-sortable:drag-start", {
      item: c,
      index: a
    });
    const u = this, w = function(S) {
      u._handlePointerMove(S);
    }, v = function(S) {
      u._handlePointerEnd(S), s.removeEventListener("pointermove", w), s.removeEventListener("pointerup", v), s.removeEventListener("pointercancel", v);
    };
    s.addEventListener("pointermove", w), s.addEventListener("pointerup", v), s.addEventListener("pointercancel", v);
  }, b.prototype._handlePointerMove = function(i) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), c = this._dragging;
    for (const n of s)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of s) {
      if (n === c) continue;
      const a = n.getBoundingClientRect(), p = a.top + a.height / 2;
      if (i.clientY >= a.top && i.clientY < p) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (i.clientY >= p && i.clientY <= a.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, b.prototype._handlePointerEnd = function(i) {
    if (!this._dragging) return;
    const s = this._dragging, c = Array.from(this.dom.children), n = c.indexOf(s);
    let a = null, p = null;
    for (const u of c) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        a = u, p = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        a = u, p = "after";
        break;
      }
    }
    for (const u of c)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), a && a !== s) {
      p === "before" ? this.dom.insertBefore(s, a) : this.dom.insertBefore(s, a.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(s);
      q(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function _(i) {
    const s = i[e];
    if (!s) return;
    const c = i.getAttribute(t) !== "disabled";
    c !== s.isEnabled && (s.isEnabled = c, q(i, c ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: i }));
  }
  j(t, e, b, "ln-sortable", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", o = "data-ln-picklist-list";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-picklist": { effect: _ },
    "data-ln-picklist-list": {}
  };
  function b(i) {
    if (this.dom = i, this.isEnabled = i.getAttribute(t) !== "disabled", this.available = i.querySelector("[" + o + '="available"]'), this.selected = i.querySelector("[" + o + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + o + '="available"] and [' + o + '="selected"]', i), this;
    this._onChange = this._onChange.bind(this), i.addEventListener("change", this._onChange), this._initial = [];
    for (const s of [this.available, this.selected])
      for (const c of s.children)
        this._initial.push({ item: c, list: s });
    return this._form = i.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), q(this.dom, "ln-picklist:destroyed", { target: this.dom }), delete this.dom[e]);
  }, b.prototype._onFormReset = function(i) {
    const s = this;
    setTimeout(function() {
      if (!(s._destroyed || i.defaultPrevented))
        for (const c of s._initial)
          c.item.isConnected && c.list.appendChild(c.item);
    }, 0);
  }, b.prototype._onChange = function(i) {
    const s = i.target.closest('input[type="checkbox"]');
    if (!s) return;
    const c = s.closest("li");
    if (!c) return;
    const n = c.parentElement;
    if (n !== this.available && n !== this.selected) return;
    if (!this.isEnabled) {
      s.checked = !s.checked;
      return;
    }
    const a = s.checked ? this.selected : this.available;
    if (n === a) return;
    const p = { item: c, from: n, to: a, checkbox: s };
    if (Z(this.dom, "ln-picklist:before-move", p).defaultPrevented) {
      s.checked = !s.checked;
      return;
    }
    const u = document.activeElement === s;
    a.appendChild(c), u && s.focus(), q(this.dom, "ln-picklist:move", p);
  };
  function _(i) {
    const s = i[e];
    if (!s) return;
    const c = i.getAttribute(t) !== "disabled";
    c !== s.isEnabled && (s.isEnabled = c, q(i, c ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: i }));
  }
  j(t, e, b, "ln-picklist", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", o = "data-ln-confirm-state", h = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function _(p, u, w) {
    return p.getAttribute(u) || w;
  }
  function i(p, u, w) {
    const v = parseFloat(p.getAttribute(u));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function s(p) {
    const u = document.createElement("span");
    return u.setAttribute(h, ""), u.setAttribute("role", "alert"), u.textContent = p, u;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", read: _, fallback: "Confirm?" },
    "data-ln-confirm-timeout": { prop: "timeout", read: i, fallback: 3 },
    "data-ln-confirm-state": { prop: "confirming", read: Kt }
  }, n = et(c);
  function a(p) {
    this.dom = p, tt(this, p, n), this.revertTimer = null, this._submitted = !1, this.idleEl = p.querySelector("[data-ln-confirm-idle]"), this.activeEl = p.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : p.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!sn(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, w.stopPropagation(), u._reset();
        }
    }, p.addEventListener("click", this._onClick), this;
  }
  a.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(o, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const p = this.activeEl ? this.activeEl.textContent.trim() : "";
      p && (this.dom.setAttribute("aria-label", p), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = p.getAttribute("href"), p.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(s(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), q(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, a.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const p = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      p._reset();
    }, u);
  }, a.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(o), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalIconHref && p.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + h + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], q(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, j(t, e, a, "ln-confirm", {
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
  function _(i) {
    if (this.dom = i, tt(this, i, h), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = i.querySelector("[data-ln-translations-active]"), this.menuEl = i.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = b, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(c) {
      c.detail && c.detail.lang && s.addLanguage(c.detail.lang);
    }, this._onRequestRemove = function(c) {
      c.detail && c.detail.lang && s.removeLanguage(c.detail.lang);
    }, i.addEventListener("ln-translations:request-add", this._onRequestAdd), i.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const i = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of i) {
      const c = s.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of c)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, _.prototype._detectExisting = function() {
    const i = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of i) {
      const c = s.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, _.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const i = this;
    let s = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      s++;
      const a = Jt("ln-translations-menu-item", "ln-translations");
      if (!a) return;
      const p = a.querySelector("[data-ln-translations-lang]");
      p.setAttribute("data-ln-translations-lang", n), p.textContent = this.locales[n], p.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), i.menuEl.getAttribute("data-ln-toggle") === "open" && i.menuEl.setAttribute("data-ln-toggle", "close"), i.addLanguage(n));
      }), this.menuEl.appendChild(a);
    }
    const c = this.dom.querySelector("[data-ln-translations-add]");
    c && (c.hidden = s === 0);
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const i = this;
    this.activeLanguages.forEach(function(s) {
      const c = Jt("ln-translations-badge", "ln-translations");
      if (!c) return;
      const n = c.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", s);
      const a = n.querySelector("span");
      a.textContent = i.locales[s] || s.toUpperCase();
      const p = n.querySelector("button"), u = i.locales[s] || s.toUpperCase();
      p.setAttribute("aria-label", i.removeLabel.replace("{lang}", u)), p.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), i.removeLanguage(s));
      }), i.badgesEl.appendChild(c);
    });
  }, _.prototype.addLanguage = function(i, s) {
    if (this.activeLanguages.has(i)) return;
    const c = this.locales[i] || i;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: i,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(i), s = s || {};
    const a = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of a) {
      const u = p.getAttribute("data-ln-translatable"), w = p.getAttribute("data-ln-translations-prefix") || "", v = p.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + i + "][" + u + "]" : S.name = "trans[" + i + "][" + u + "]", S.value = s[u] !== void 0 ? s[u] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", c)), S.setAttribute("data-ln-translatable-lang", i);
      const A = p.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = A.length > 0 ? A[A.length - 1] : v;
      d.parentNode.insertBefore(S, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), q(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: i,
      langName: c
    });
  }, _.prototype.removeLanguage = function(i) {
    if (!this.activeLanguages.has(i) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: i
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + i + '"]');
    for (const n of c)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(i), this._updateDropdown(), this._updateBadges(), q(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: i
    });
  }, _.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, _.prototype.hasLanguage = function(i) {
    return this.activeLanguages.has(i);
  }, _.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const i = this.defaultLang, s = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of s)
      c.getAttribute("data-ln-translatable-lang") !== i && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, _, "ln-translations", {
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
  const _ = {
    "data-ln-autosave": {},
    "data-ln-autosave-debounce-input": {},
    "data-ln-autosave-clear": {},
    "data-ln-autosave-exclude": {}
  };
  function i(c) {
    const n = c.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function s(c) {
    const a = c.getAttribute(t) || c.id, p = oi(window.location.pathname, a);
    if (!p) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = p;
    let u = null;
    function w() {
      const d = ln(c, { exclude: b });
      try {
        localStorage.setItem(p, JSON.stringify(d));
      } catch {
        return;
      }
      q(c, "ln-autosave:saved", { target: c, data: d });
    }
    function v() {
      let d;
      try {
        d = localStorage.getItem(p);
      } catch {
        return;
      }
      if (!d) return;
      let g;
      try {
        g = JSON.parse(d);
      } catch {
        return;
      }
      if (Z(c, "ln-autosave:before-restore", { target: c, data: g }).defaultPrevented) return;
      const r = cn(c, g);
      for (let f = 0; f < r.length; f++)
        r[f].dispatchEvent(new Event("input", { bubbles: !0 })), r[f].dispatchEvent(new Event("change", { bubbles: !0 }));
      q(c, "ln-autosave:restored", { target: c, data: g });
    }
    function S() {
      try {
        localStorage.removeItem(p);
      } catch {
        return;
      }
      q(c, "ln-autosave:cleared", { target: c });
    }
    this._onFocusout = function(d) {
      const g = d.target;
      i(g) && g.name && !g.matches(b) && w();
    }, this._onChange = function(d) {
      const g = d.target;
      i(g) && g.name && !g.matches(b) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(d) {
      d.target.closest("[" + o + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = si(c.getAttribute(h));
    return A > 0 && (this._onInput = function(d) {
      const g = d.target;
      !i(g) || !g.name || g.matches(b) || (u !== null && clearTimeout(u), u = setTimeout(w, A));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, v(), this;
  }
  s.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const c = this._getInputTimer();
        c !== null && clearTimeout(c);
      }
      q(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, s, "ln-autosave", {
    attributes: _
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
    const _ = this;
    return this._onInput = function() {
      _._resize();
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
  }, _ = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, i = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let s = 0;
  function c(d) {
    return !!(b[d] || _[d] || i[d] || d === "link");
  }
  function n(d) {
    this.dom = d;
    const g = this;
    if (this._textarea = d.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", d), this;
    const l = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), l && this._surface.setAttribute("data-placeholder", l);
    const r = this._textarea.id;
    if (r) {
      const m = d.querySelector('label[for="' + r + '"]');
      m && (m.id || (m.id = r + "-label"), this._surface.setAttribute("aria-labelledby", m.id));
    }
    this._surface.id = r ? r + "-surface" : "ln-editor-surface-" + ++s;
    const f = this._textarea.value.trim();
    f && (this._surface.innerHTML = f);
    const y = d.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? d.insertBefore(this._surface, y.nextSibling) : d.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const m = y.querySelectorAll("[data-ln-editor-action]");
      for (let E = 0; E < m.length; E++) {
        const C = m[E].getAttribute("data-ln-editor-action");
        c(C) && m[E].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      g._syncToTextarea(), q(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      });
    }, this._onMousedownToolbar = function(m) {
      m.target.closest("[data-ln-editor-action]") && m.preventDefault();
    }, this._onClickToolbar = function(m) {
      const E = m.target.closest("[data-ln-editor-action]");
      if (!E) return;
      const C = E.getAttribute("data-ln-editor-action");
      g._execAction(C);
    }, this._onPaste = function(m) {
      u(g, m);
    }, this._onKeydown = function(m) {
      S(g, m);
    }, this._onSelectionChange = function() {
      document.contains(g._surface) && g._updateActiveStates();
    }, this._onFocus = function() {
      q(g.dom, "ln-editor:focus", { target: g.dom });
    }, this._onBlur = function() {
      g._syncToTextarea(), q(g.dom, "ln-editor:blur", { target: g.dom });
    }, this._onTextareaInput = function() {
      g._surface.innerHTML !== g._textarea.value && (g._surface.innerHTML = g._textarea.value, q(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(m) {
      const E = m.detail && m.detail.html;
      E !== void 0 && (g._surface.innerHTML = E, g._syncToTextarea(), q(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      }));
    }, d.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        g._surface.innerHTML = g._textarea.value, q(d, "ln-editor:changed", {
          html: g._textarea.value,
          target: d
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(d) {
    if (!(!d || Z(this.dom, "ln-editor:before-change", {
      action: d,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), b[d])
        document.execCommand(b[d], !1, null);
      else if (_[d]) {
        const l = _[d], r = a(this._surface);
        r && r.toLowerCase() === l ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + l + ">");
      } else i[d] ? document.execCommand(i[d], !1, null) : d === "link" ? A(this) : d === "unlink" ? document.execCommand("unlink", !1, null) : d === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const d = this.dom.querySelector('[role="toolbar"]');
    if (!d) return;
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const l = g.anchorNode;
    if (!l || !this._surface.contains(l)) return;
    const r = d.querySelectorAll("[data-ln-editor-action]");
    for (let f = 0; f < r.length; f++) {
      const y = r[f], T = y.getAttribute("data-ln-editor-action");
      let m = !1;
      if (b[T])
        try {
          m = document.queryCommandState(b[T]);
        } catch {
        }
      else if (_[T]) {
        const E = a(this._surface);
        m = E && E.toLowerCase() === _[T];
      } else if (i[T])
        try {
          m = document.queryCommandState(i[T]);
        } catch {
        }
      else T === "link" && (m = !!p(g.anchorNode, "A", this._surface));
      c(T) && y.setAttribute("aria-pressed", String(m)), m ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(d) {
    this._surface && (this._surface.innerHTML = d, this._syncToTextarea(), q(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const d = this.dom.querySelector('[role="toolbar"]');
    d && (d.removeEventListener("mousedown", this._onMousedownToolbar), d.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const g = this._textarea ? this._textarea.form : null;
    if (g && this._onFormReset && g.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const l = this.dom.querySelector(".ln-editor__link-popover");
      l && l.remove();
    }
    q(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function a(d) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return null;
    let l = g.anchorNode;
    if (!l) return null;
    for (; l && l !== d; ) {
      if (l.nodeType === 1) {
        const r = l.tagName;
        if (r === "H2" || r === "H3" || r === "H4" || r === "BLOCKQUOTE" || r === "PRE" || r === "P")
          return r;
      }
      l = l.parentNode;
    }
    return null;
  }
  function p(d, g, l) {
    for (; d && d !== l; ) {
      if (d.nodeType === 1 && d.tagName === g)
        return d;
      d = d.parentNode;
    }
    return null;
  }
  function u(d, g) {
    g.preventDefault();
    let l = "";
    if (g.clipboardData && (l = g.clipboardData.getData("text/html"), !l)) {
      const f = g.clipboardData.getData("text/plain");
      f && (l = f.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), l = "<p>" + l + "</p>");
    }
    if (!l) return;
    const r = w(l);
    r && document.execCommand("insertHTML", !1, r);
  }
  function w(d) {
    const g = document.createElement("div");
    return g.innerHTML = d, v(g), g.innerHTML;
  }
  function v(d) {
    const g = Array.from(d.childNodes);
    for (let l = 0; l < g.length; l++) {
      const r = g[l];
      if (r.nodeType !== 3) {
        if (r.nodeType !== 1) {
          d.removeChild(r);
          continue;
        }
        if (h[r.tagName]) {
          const f = Array.from(r.attributes);
          for (let y = 0; y < f.length; y++) {
            const T = f[y].name;
            if (r.tagName === "A" && T === "href") {
              const m = r.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(m) || r.removeAttribute("href");
            } else
              r.removeAttribute(T);
          }
          r.tagName === "A" && r.setAttribute("rel", "noopener noreferrer"), v(r);
        } else {
          for (; r.firstChild; )
            d.insertBefore(r.firstChild, r);
          d.removeChild(r);
        }
      }
    }
  }
  function S(d, g) {
    if (!(g.ctrlKey || g.metaKey)) return;
    let l = null;
    switch (g.key.toLowerCase()) {
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
    l && (g.preventDefault(), d._execAction(l));
  }
  function A(d) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const l = p(g.anchorNode, "A", d._surface), r = g.getRangeAt(0).cloneRange();
    d._closeLinkPopover && d._closeLinkPopover();
    const f = Tt(d.dom, "ln-editor-link-popover", "ln-editor");
    if (!f) return;
    const y = f.firstElementChild;
    if (!y) return;
    const T = y.querySelector('input[type="url"]'), m = y.querySelector('[data-ln-editor-action="confirm-link"]'), E = y.querySelector('[data-ln-editor-action="cancel-link"]');
    l && (T.value = l.getAttribute("href") || "");
    const C = d.dom.querySelector('[role="toolbar"]');
    C ? C.after(y) : d.dom.insertBefore(y, d._surface), T.focus();
    function k() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(r);
    }
    function D() {
      document.removeEventListener("mousedown", P), d._closeLinkPopover = null, y.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), k(), d._surface.focus(), B)
        if (l)
          l.setAttribute("href", B), l.setAttribute("rel", "noopener noreferrer"), d._syncToTextarea(), q(d.dom, "ln-editor:changed", {
            html: d._textarea.value,
            target: d.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = p(U.anchorNode, "A", d._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), d._syncToTextarea());
          }
        }
      else l && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), k(), d._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const U = d.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !y.contains(B.target) && !U && O();
    }
    d._closeLinkPopover = D, m.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
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
    const _ = {}, i = b.dataset;
    for (const s in i) {
      if (!s.startsWith("lnFill") || e[s]) continue;
      const c = s.slice(6);
      c && (_[c.charAt(0).toLowerCase() + c.slice(1)] = i[s]);
    }
    return _;
  }
  function h(b, _) {
    const i = window.CSS && CSS.escape ? CSS.escape(_) : _, s = document.querySelectorAll('[data-ln-fill-id="' + i + '"]');
    if (s.length === 0) return null;
    for (let c = 0; c < s.length; c++) {
      const n = s[c].getAttribute("data-ln-fill-form");
      if (n) {
        const a = document.getElementById(n);
        if (a && b.contains(a)) return s[c];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const _ = b.target.closest("[data-ln-fill-form]");
    if (!_) return;
    const i = _.getAttribute("href");
    if (i && i.indexOf("#") !== -1) return;
    const s = _.getAttribute("data-ln-fill-form"), c = document.getElementById(s);
    if (!c) return;
    const n = o(_), a = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, a ? n : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const _ = b.detail;
    if (!_) return;
    const i = b.target, s = _.id;
    if (s == null) {
      window.lnCore.lnFill(i, null);
      return;
    }
    const c = h(i, s);
    if (!c) return;
    const n = o(c);
    window.lnCore.lnFill(i, n);
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
  function b(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const i = _.form;
    if (!i)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    tt(this, _, h);
    const s = i.elements[this.sourceName];
    if (!s)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', _), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = s, this._pristine = _.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, s.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
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
  const o = typeof e == "number" ? e : e.getTime(), h = t.getTime(), b = Math.floor((h - o) / 1e3), _ = Math.abs(b);
  return _ < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : _ < 60 ? { value: b, unit: "second", isOlderThanMonth: !1 } : _ < 3600 ? { value: Math.round(b / 60), unit: "minute", isOlderThanMonth: !1 } : _ < 86400 ? { value: Math.round(b / 3600), unit: "hour", isOlderThanMonth: !1 } : _ < 604800 ? { value: Math.round(b / 86400), unit: "day", isOlderThanMonth: !1 } : _ < 2592e3 ? { value: Math.round(b / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(b / 2592e3), unit: "month", isOlderThanMonth: !0 };
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
    "data-ln-time": { effect: r },
    "data-ln-time-locale": { effect: r }
  }, h = {}, b = {};
  function _(y) {
    return y.getAttribute("data-ln-time-locale") || rt(y);
  }
  function i(y, T) {
    const m = (y || "") + "|" + JSON.stringify(T);
    return h[m] || (h[m] = new Intl.DateTimeFormat(y, T)), h[m];
  }
  function s(y) {
    const T = y || "";
    return b[T] || (b[T] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), b[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function a() {
    n || (n = setInterval(u, 6e4));
  }
  function p() {
    n && (clearInterval(n), n = null);
  }
  function u() {
    for (const y of c) {
      if (!document.body.contains(y.dom)) {
        c.delete(y);
        continue;
      }
      g(y);
    }
    c.size === 0 && p();
  }
  function w(y, T) {
    const m = kt(T), E = (T || "").toLowerCase().split("-")[0], C = i(T, Qt("full", y)), k = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (m && k !== E && m.monthsLong) {
      const D = m.monthsLong[y.getMonth()], I = y.getDate(), R = y.getFullYear(), O = String(y.getHours()).padStart(2, "0"), P = String(y.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(y);
  }
  function v(y, T) {
    const m = Qt("short", y), E = kt(T), C = (T || "").toLowerCase().split("-")[0], k = i(T, m), D = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[y.getMonth()], R = y.getDate(), O = m.year ? " " + y.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return k.format(y);
  }
  function S(y, T) {
    return i(T, Qt("date", y)).format(y);
  }
  function A(y, T) {
    return i(T, Qt("time", y)).format(y);
  }
  function d(y, T) {
    const m = li(y);
    return m.isOlderThanMonth ? v(y, T) : s(T).format(m.value, m.unit);
  }
  function g(y) {
    const T = y.dom.getAttribute("datetime");
    if (!T) return;
    const m = st(T);
    if (!m) return;
    const E = y.dom.getAttribute(t) || "short", C = _(y.dom);
    let k;
    switch (E) {
      case "relative":
        k = d(m, C);
        break;
      case "full":
        k = w(m, C);
        break;
      case "date":
        k = S(m, C);
        break;
      case "time":
        k = A(m, C);
        break;
      default:
        k = v(m, C);
        break;
    }
    y.dom.textContent = k, E !== "full" && (y.dom.title = w(m, C));
  }
  function l(y) {
    this.dom = y;
    const T = this;
    return this._onLocaleChange = function() {
      g(T);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), g(this), y.getAttribute(t) === "relative" && (c.add(this), a()), this;
  }
  l.prototype.render = function() {
    g(this);
  }, l.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), c.delete(this), c.size === 0 && p(), delete this.dom[e];
  };
  function r(y) {
    const T = y[e];
    if (!T) return;
    y.getAttribute(t) === "relative" ? (c.add(T), a()) : (c.delete(T), c.size === 0 && p()), g(T);
  }
  function f(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && g(y[e]);
  }
  j(t, e, l, "ln-time", {
    attributes: o,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: r,
    onInit: f
  });
})();
function ci(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, o = t.pageSize > 0 ? t.pageSize : 200, h = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const b = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, _ = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  let s = 0, c = 0, n = 0, a = !1, p = null;
  function u(S, A) {
    _.delete(S), _.set(S, A);
  }
  function w() {
    if (_.size <= e) return [];
    const S = [];
    for (; _.size > e; ) {
      const d = _.keys().next().value;
      S.push(_.get(d)), _.delete(d);
    }
    const A = new Set(_.values());
    return S.filter((d) => !A.has(d));
  }
  function v(S, A) {
    i.add(S), clearTimeout(p), p = setTimeout(() => b(S, o, A), h);
  }
  return {
    get logicalTotal() {
      return s;
    },
    set logicalTotal(S) {
      s = S;
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
      return _.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return a;
    },
    getId: (S) => {
      if (!_.has(S)) return;
      const A = _.get(S);
      return u(S, A), A;
    },
    ensure: (S, A, d) => {
      if (!a && !i.has(0)) return v(0, d);
      if (s <= 0) return;
      const g = Math.max(0, S), l = Math.min(s, A);
      for (let r = g; r < l; r++)
        if (!_.has(r)) {
          const f = Math.floor(r / o) * o;
          if (!i.has(f)) return v(f, d);
        }
    },
    ingest: (S, A, d, g, l) => {
      if (l != null && l !== n) return [];
      a = !0, d != null && (c = d), g != null && (s = g);
      for (let r = 0; r < A.length; r++)
        u(S + r, A[r]);
      return i.delete(S), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      a = !1, _.clear(), i.clear(), clearTimeout(p);
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
  const { field: h, direction: b } = e, _ = b === "desc", i = t.map((c) => c ? c[h] : void 0), s = Ce(i);
  return [...t].sort((c, n) => {
    const a = c ? c[h] : void 0, p = n ? n[h] : void 0, u = Te(a, p, s, o);
    return _ ? -u : u;
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
    (_) => o.some((i) => {
      const s = b[i];
      return s != null && Ln(String(s), [_]);
    })
  ) : !1) : t;
}
function hi(t, e, o) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (o === "count") return t.length;
  const h = t.map((_) => _ && _[e] != null ? parseFloat(_[e]) : NaN).filter((_) => Number.isFinite(_)), b = h.reduce((_, i) => _ + i, 0);
  return o === "sum" ? b : o === "avg" && h.length ? b / h.length : 0;
}
function fi(t, e = {}, o = [], h) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const b = t.length;
  let _ = t;
  e.filters && (_ = Kn(_, e.filters)), e.search && (_ = ui(_, e.search, o));
  const i = _.length;
  if (e.sort && (_ = di(_, e.sort, h)), e.offset || e.limit) {
    const s = e.offset || 0, c = e.limit || _.length;
    _ = _.slice(s, s + c);
  }
  return { records: _, total: b, filtered: i };
}
function pi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((o) => {
    if (!o) return null;
    const h = { ...o };
    for (const [b, _] of Object.entries(e))
      if (typeof _ == "function")
        try {
          h[b] = _(o);
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
  }, b = et(h), _ = "ln_app_cache", i = "_meta", s = "1.0";
  let c = null, n = null;
  const a = {};
  function p(L) {
    L && L.name === "QuotaExceededError" && q(document, "ln-data-store:quota-exceeded", { error: L });
  }
  function u() {
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
      const x = u(), M = Object.keys(x), N = indexedDB.open(_);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), L(null);
      }, N.onsuccess = (F) => {
        const H = F.target.result, K = Array.from(H.objectStoreNames);
        if (!(!K.includes(i) || M.some((ft) => !K.includes(ft))))
          return v(H), c = H, L(H);
        const J = H.version;
        H.close();
        const nt = indexedDB.open(_, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), L(null);
        }, nt.onupgradeneeded = (ft) => {
          const at = ft.target.result;
          at.objectStoreNames.contains(i) || at.createObjectStore(i, { keyPath: "key" });
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
  async function d(L) {
    return !L || !L.encrypted || !At() ? L : wr(L);
  }
  const g = (L, x) => S().then((M) => M ? M.transaction(L, x).objectStore(L) : null);
  function l(L) {
    return new Promise((x, M) => {
      L.onsuccess = () => x(L.result), L.onerror = () => {
        p(L.error), M(L.error);
      };
    });
  }
  const r = (L) => g(L, "readonly").then((x) => x ? l(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => d(M))) : x), f = (L, x) => g(L, "readonly").then((M) => M ? l(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? l(M.get(Number(x))) : typeof x == "number" ? l(M.get(String(x))) : null) : null).then((M) => M ? d(M) : null), y = (L, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(L, "readonly").objectStore(L), H = x.map((K) => l(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? l(F.get(Number(K))) : typeof K == "number" ? l(F.get(String(K))) : null));
    return Promise.all(H).then((K) => At() ? Promise.all(K.map((W) => W ? d(W) : null)) : K);
  }), T = (L, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => g(L, "readwrite").then((F) => F ? l(F.put(N)) : null)), m = (L, x) => g(L, "readwrite").then((M) => M ? l(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return l(M.delete(Number(x)));
    if (typeof x == "number")
      return l(M.delete(String(x)));
  }) : null), E = (L) => g(L, "readwrite").then((x) => x ? l(x.clear()) : null), C = (L) => g(L, "readonly").then((x) => x ? l(x.count()) : 0), k = (L) => g(i, "readonly").then((x) => x ? l(x.get(L)) : null), D = (L, x) => g(i, "readwrite").then((M) => {
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
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), a[this._name] = this, R(this), this.ready = Y(this), this;
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
        schema_version: s,
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
    return f(L._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const H = F.id, K = { ...F, ...M, id: H }, W = M.id, J = W !== void 0 && W !== H;
      return (J ? bt(L._name, H, { ...K, id: W }) : T(L._name, K)).then(() => P(L, 0)).then(() => {
        q(L.dom, "ln-data-store:updated", { store: L._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(L, { id: x, requestId: M } = {}) {
    return f(L._name, x).then((N) => {
      if (!N) {
        q(L.dom, "ln-data-store:deleted", { store: L._name, id: x, requestId: M, missing: !0 });
        return;
      }
      const F = N.id;
      return m(L._name, F).then(() => P(L, -1)).then(() => {
        q(L.dom, "ln-data-store:deleted", { store: L._name, id: F, requestId: M });
      });
    });
  }
  function $(L, { ids: x = [], requestId: M } = {}) {
    return x.length ? Promise.all(x.map((N) => f(L._name, N))).then((N) => {
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
      if (L.initializationError = null, x && x.schema_version === s)
        L.lastSyncedAt = x.last_synced_at || null, L.totalCount = x.record_count || 0, L.hasCache = x.has_cache === !0 || L.totalCount > 0, L.hasCache && (L.isLoaded = !0, L.canServe = !0, q(L.dom, "ln-data-store:ready", { store: L._name, count: L.totalCount, source: "cache" })), L.isInitialized = !0, q(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: L.hasCache, lastSyncedAt: L.lastSyncedAt, count: L.totalCount });
      else {
        if (x && x.schema_version !== s)
          return E(L._name).then(() => D(L._name, { schema_version: s, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
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
        p(W.error), K(W.error);
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
            p(J.error), W(J.error);
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
    return g(L._name, "readonly").then((W) => W ? new Promise((J, nt) => {
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
        return Xn(L) ? Jn(x, L, F).then((K) => H(K.slice(M, F))) : r(x._name).then((K) => H(Re(x, K, L).records));
      }
      return Oe(x, M, N);
    }
    return r(x._name).then((M) => {
      const N = Re(x, M, L);
      return {
        data: Ot(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(L) {
    return f(this._name, L).then((x) => x ? Ot(this, [x])[0] : null);
  }, I.prototype.count = function(L) {
    return L && Object.keys(L).length > 0 ? r(this._name).then((M) => Kn(M, L).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(L, x) {
    return r(this._name).then((M) => Yn(M, L, x));
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
      schema_version: s,
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
      schema_version: s,
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
    delete a[this._name], delete this.dom[e], q(this.dom, "ln-data-store:destroyed", { store: this._name });
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
      Object.values(a).forEach((L) => {
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
    const _ = t.filters[b];
    Array.isArray(_) && _.length > 0 && h.append(b, _.join(","));
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
    const a = n[e];
    a && a.refreshConfig();
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
  }, _ = et(b);
  function i(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((a) => {
      const p = new Error("HTTP " + n.status + ": " + n.statusText);
      throw p.status = n.status, p.data = a, p;
    });
  }
  function s(n) {
    return this.dom = n, tt(this, n, _), n[e] = this, n[o] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  s.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = _n(this.rawHeaders);
    const a = {}, p = n.getAttribute("data-ln-api-param-offset");
    p && (a.offset = p);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (a.limit = u);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (a.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (a.sortField = v);
    const S = n.getAttribute("data-ln-api-param-sort-dir");
    S && (a.sortDir = S), this.paramKeys = a;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, q(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, s.prototype._reqHeaders = function(n) {
    const a = Object.assign({}, this.headers);
    return !a.Accept && !a.accept && (a.Accept = "application/json"), !a["Content-Type"] && !a["content-type"] && (a["Content-Type"] = "application/json"), n && (a["X-Idempotency-Key"] = n), a;
  }, s.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, s.prototype.fetchDelta = function(n, a) {
    const p = this;
    let u = qt(p.baseUrl, p.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = a || "sync";
    p._inflight.has(w) && p._inflight.get(w).abort();
    const v = new AbortController();
    return p._inflight.set(w, v), window.fetch(u, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: v.signal
    }).then(i).finally(function() {
      p._inflight.get(w) === v && p._inflight.delete(w);
    });
  }, s.prototype.query = function(n, a) {
    const p = this, u = gi(n, p.paramKeys), w = _i(p.baseUrl, p.path, u), v = a || "query";
    p._inflight.has(v) && p._inflight.get(v).abort();
    const S = new AbortController();
    return p._inflight.set(v, S), window.fetch(w, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: S.signal
    }).then(i).finally(function() {
      p._inflight.get(v) === S && p._inflight.delete(v);
    });
  }, s.prototype.create = function(n, a, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, a || u.path), {
      method: "POST",
      headers: u._reqHeaders(p),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(i);
  }, s.prototype.update = function(n, a, p, u, w) {
    const v = this;
    p != null && (a = Object.assign({}, a, { expected_version: p }));
    const S = u ? qt(v.baseUrl, u) : qt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(a)
    }).then(i);
  }, s.prototype.delete = function(n, a, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, a || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(p),
      credentials: u.credentials
    }).then(i);
  }, s.prototype.bulkDelete = function(n, a, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, a || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(p),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(i);
  };
  function c(n) {
    n._handlers = {
      sync: function(a) {
        const p = a.detail || {}, u = p.meta && p.meta.targetEl ? p.meta.targetEl : null;
        n.fetchDelta(p.since, u).then(function(w) {
          q(n.dom, "ln-api-connector:fetched", { data: w, since: p.since, meta: p.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: p.since,
            meta: p.meta || null
          });
        });
      },
      query: function(a) {
        const p = a.detail || {}, u = p.query || p, w = p.meta && p.meta.targetEl ? p.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(g, l, r) {
          n.query(l, r).then(function(f) {
            const y = f || {};
            q(n.dom, "ln-api-connector:fetched", {
              data: y.data || (Array.isArray(y) ? y : []),
              total: y.total,
              filtered: y.filtered,
              offset: l.offset,
              queryGen: l.queryGen,
              meta: g.meta || null
            });
          }).catch(function(f) {
            f && f.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
              action: "query",
              error: f.message,
              status: f.status || 0,
              data: f.data || null,
              meta: g.meta || null
            });
          });
        }
        if (S === 0) {
          A(p, u, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const d = setTimeout(function() {
          n._queryTimers.delete(v), A(p, u, w);
        }, S);
        n._queryTimers.set(v, d);
      },
      cancel: function(a) {
        const p = a.detail || {}, u = p.meta && p.meta.targetEl ? p.meta.targetEl : p.targetEl || p.key;
        u && n.cancel(u);
      },
      create: function(a) {
        const p = a.detail || {};
        n.create(p.data, p.url, p.idempotencyKey).then(function(u) {
          const w = Je(u);
          q(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: p.tempId,
            message: w.message,
            meta: p.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: p.tempId,
            meta: p.meta || null
          });
        });
      },
      update: function(a) {
        const p = a.detail || {};
        n.update(p.id, p.data, p.expected_version, p.url, p.idempotencyKey).then(function(u) {
          const w = Je(u);
          q(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: p.id,
            message: w.message,
            meta: p.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: p.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: p.meta || null
          });
        });
      },
      delete: function(a) {
        const p = a.detail || {};
        n.delete(p.id, p.url, p.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          q(n.dom, "ln-api-connector:deleted", {
            response: u,
            id: p.id,
            message: w,
            meta: p.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: p.id,
            meta: p.meta || null
          });
        });
      },
      bulkDelete: function(a) {
        const p = a.detail || {};
        n.bulkDelete(p.ids, p.url, p.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          q(n.dom, "ln-api-connector:bulk-deleted", {
            response: u,
            ids: p.ids,
            message: w,
            meta: p.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: p.ids,
            meta: p.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(a) {
      a.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(a) {
      a && clearTimeout(a);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), q(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[o];
  }, j(t, e, s, "ln-api-connector", {
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
  }, _ = et(b);
  function i(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function s(v) {
    return this.dom = v, tt(this, v, _), v[e] = this, v[o] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  s.prototype.refreshConfig = function() {
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
    const d = Object.assign({}, Nt(v.headers, v.auth), A || {});
    return S && (d["Idempotency-Key"] = S), d;
  }
  s.prototype.fetchDelta = function(v) {
    const S = this, A = ["include_docs=true", "feed=normal"];
    v && A.push("since=" + encodeURIComponent(v));
    const d = Et(S.url, S.db, "_changes") + "?" + A.join("&");
    return window.fetch(d, { method: "GET", headers: Nt(S.headers, S.auth), credentials: S.credentials }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const l = g.results || [];
      return {
        data: l.filter((r) => !r.deleted && r.doc).map((r) => Object.assign({}, r.doc, { id: r.doc._id })),
        deleted: l.filter((r) => r.deleted).map((r) => r.id),
        synced_at: g.last_seq || v || ""
      };
    });
  };
  function n(v, S, A) {
    const d = Object.assign({ _id: S.id }, S);
    return d._id || delete d._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: c(v, A),
      credentials: v.credentials,
      body: JSON.stringify(d)
    }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const l = i(g), r = l.content;
      return { record: Object.assign({}, d, { id: r.id, _id: r.id, _rev: r.rev }), message: l.message };
    });
  }
  s.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function a(v, S, A, d) {
    const g = Object.assign({ id: String(S), _id: String(S) }, A), l = g._rev || g.rev;
    return (l ? Promise.resolve(l) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((f) => {
      if (!f.ok) throw new Error("Could not retrieve document for revision mapping");
      return f.json().then((y) => y._rev);
    })).then((f) => {
      const y = Object.assign({}, g, { _rev: f });
      delete y.rev;
      const T = c(v, d, { "If-Match": f });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(y)
      }).then((m) => {
        if (m.ok) return m.json().then((E) => {
          const C = i(E);
          return { record: Object.assign({}, y, { _rev: C.content.rev }), message: C.message };
        });
        if (m.status === 409) return m.json().then((E) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = E, C;
        });
        throw new Error("HTTP " + m.status + ": " + m.statusText);
      });
    });
  }
  s.prototype.update = function(v, S, A) {
    return a(this, v, S, A).then((d) => d.record);
  };
  function p(v, S, A, d) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((l) => {
      if (!l.ok) throw new Error("Could not retrieve document for revision delete");
      return l.json().then((r) => r._rev);
    })).then((l) => {
      const r = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(l);
      return window.fetch(r, { method: "DELETE", headers: c(v, d), credentials: v.credentials }).then((f) => {
        if (!f.ok) throw new Error("HTTP " + f.status + ": " + f.statusText);
        return f.json();
      }).then((f) => {
        const y = i(f);
        return { response: y.content, message: y.message };
      });
    });
  }
  s.prototype.delete = function(v, S, A) {
    return p(this, v, S, A).then((d) => d.response);
  };
  function u(v, S, A) {
    return !S || S.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Nt(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: S })
    }).then((d) => {
      if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
      return d.json();
    }).then((d) => {
      const l = (d.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return l.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: l })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => {
        const f = i(r);
        return { response: { ok: !0, results: f.content, deletedCount: l.length }, message: f.message };
      });
    });
  }
  s.prototype.bulkDelete = function(v, S) {
    return u(this, v, S).then((A) => A.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(A) {
        const d = A.detail || {};
        v.fetchDelta(d.since).then(function(g) {
          q(v.dom, "ln-couchdb-connector:fetched", { data: g, since: d.since, meta: d.meta || null });
        }).catch(function(g) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: g.message,
            status: g.status || 0,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      create: function(A) {
        const d = A.detail || {};
        n(v, d.data, d.idempotencyKey).then(function(g) {
          q(v.dom, "ln-couchdb-connector:created", { record: g.record, tempId: d.tempId, message: g.message, meta: d.meta || null });
        }).catch(function(g) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: g.message,
            status: g.status || 0,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(A) {
        const d = A.detail || {}, g = Object.assign({}, d.data);
        d.expected_version !== void 0 && (g._rev = d.expected_version), a(v, d.id, g, d.idempotencyKey).then(function(l) {
          q(v.dom, "ln-couchdb-connector:updated", { record: l.record, id: d.id, message: l.message, meta: d.meta || null });
        }).catch(function(l) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: l.message,
            status: l.status || 0,
            id: d.id,
            data: l.status === 409 ? l.data : null,
            conflictData: l.status === 409 ? l.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(A) {
        const d = A.detail || {};
        p(v, d.id, d.rev, d.idempotencyKey).then(function(g) {
          q(v.dom, "ln-couchdb-connector:deleted", { response: g.response, id: d.id, message: g.message, meta: d.meta || null });
        }).catch(function(g) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: g.message,
            status: g.status || 0,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const d = A.detail || {};
        u(v, d.ids, d.idempotencyKey).then(function(g) {
          q(v.dom, "ln-couchdb-connector:bulk-deleted", { response: g.response, ids: d.ids, message: g.message, meta: d.meta || null });
        }).catch(function(g) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: g.message,
            status: g.status || 0,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.addEventListener(A + ":request-sync", v._handlers.sync), v.dom.addEventListener(A + ":request-fetch", v._handlers.sync), v.dom.addEventListener(A + ":request-create", v._handlers.create), v.dom.addEventListener(A + ":request-update", v._handlers.update), v.dom.addEventListener(A + ":request-delete", v._handlers.delete), v.dom.addEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    });
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const v = this;
    v._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      v.dom.removeEventListener(A + ":request-sync", v._handlers.sync), v.dom.removeEventListener(A + ":request-fetch", v._handlers.sync), v.dom.removeEventListener(A + ":request-create", v._handlers.create), v.dom.removeEventListener(A + ":request-update", v._handlers.update), v.dom.removeEventListener(A + ":request-delete", v._handlers.delete), v.dom.removeEventListener(A + ":request-bulk-delete", v._handlers.bulkDelete);
    }), v._handlers = null), q(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[o];
  }, j(t, e, s, "ln-couchdb-connector", {
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
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", o = "data-ln-data-coordinator-scope", h = "data-ln-data-coordinator-search", b = "data-ln-data-coordinator-filters", _ = "data-ln-data-coordinator-sort-field", i = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function s(m) {
    const E = m[e];
    E && E.refreshMapper();
  }
  function c(m) {
    const E = m[e];
    E && E._queueQueryRefresh();
  }
  function n(m, E) {
    return m.getAttribute(E) || m.id;
  }
  const a = {
    "data-ln-data-coordinator": { prop: "_name", read: n },
    "data-ln-data-coordinator-scope": {},
    "data-ln-data-coordinator-mapper": { effect: s },
    "data-ln-data-coordinator-search": { effect: c },
    "data-ln-data-coordinator-filters": { effect: c },
    "data-ln-data-coordinator-sort-field": { effect: c },
    "data-ln-data-coordinator-sort-direction": { effect: c },
    "data-ln-data-coordinator-stale": {},
    "data-ln-data-coordinator-no-autosync": {},
    "data-ln-data-coordinator-dict": {}
  }, p = et(a), u = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function d() {
    w || (w = !0, v = function() {
      q(document, "ln-data-coordinator:online", {}), u.forEach(function(m) {
        m._maybeSync();
      });
    }, S = function() {
      q(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && u.forEach(function(m) {
        const E = m.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !m._noAutosync && (!C.hasCache || m._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function g() {
    w && (u.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", S), document.removeEventListener("visibilitychange", A), v = null, S = null, A = null, w = !1));
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
  const r = ["ln-api-connector", "ln-couchdb-connector"];
  function f(m) {
    return m ? m.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : m.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function y(m) {
    const E = this;
    return this.dom = m, tt(this, m, p), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", m), m[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new yi(), this._dict = re(m, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), d(), this._checkInitialSync(), this;
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
    const m = this.findChildren(), E = m.store;
    !E || E.initializationError || !m.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, y.prototype._checkInitialSync = function() {
    const m = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (m._destroyed) return;
      const k = m.findChildren(), D = k.store;
      if (D && D.initializationError) {
        m._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !k.connector || m._noAutosync || D.isSyncing || (!D.hasCache || m._isStale()) && D.forceSync();
    }).catch(function(k) {
      m._destroyed || m._reportReconciliationError("store-initialize", k, null);
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
    const m = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: m,
      connectorEl: E,
      queueEl: C,
      store: m ? m.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, y.prototype._handleSubmitRecord = function(m) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = m.data || {}, k = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = m.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, m.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, k, I, D, m.action);
  }, y.prototype._fanOutCreate = function(m, E, C) {
    this.refreshMapper();
    const k = "_temp_" + l();
    m.storeEl && q(m.storeEl, "ln-data-store:request-create", { tempId: k, data: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: k,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: k, action: C }
    }) : m.connector && q(m.connectorEl, f(m.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: l(), queued: !1, op: "create", tempId: k }
    });
  }, y.prototype._fanOutUpdate = function(m, E, C, k, D) {
    this.refreshMapper(), m.storeEl && q(m.storeEl, "ln-data-store:request-update", { id: E, data: C }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: k,
      meta: { id: E, action: D }
    }) : m.connector && q(m.connectorEl, f(m.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: k,
      url: D,
      meta: { entryId: l(), queued: !1, op: "update", id: E }
    });
  }, y.prototype._fanOutDelete = function(m, E) {
    this.refreshMapper(), m.storeEl && q(m.storeEl, "ln-data-store:request-delete", { id: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : m.connector && q(m.connectorEl, f(m.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: l(), queued: !1, op: "delete", id: E }
    });
  }, y.prototype._fanOutBulkDelete = function(m, E) {
    this.refreshMapper();
    const C = E.join(",");
    m.storeEl && q(m.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : m.connector && q(m.connectorEl, f(m.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: l(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, y.prototype._toastFromMessage = function(m) {
    m && q(window, "ln-toast:enqueue", {
      type: m.type || "success",
      title: m.title || "",
      message: m.body || ""
    });
  }, y.prototype._toastFromDict = function(m) {
    const E = this._dict[m];
    E && q(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, y.prototype._requestStoreMutation = function(m, E, C) {
    const k = m.storeEl;
    if (!k) return Promise.reject(new Error("Store element not found"));
    const D = l(), I = this._mutationReceipts.wait(D);
    return q(k, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, y.prototype._reportReconciliationError = function(m, E, C) {
    this._destroyed || q(this.dom, "ln-data-coordinator:error", {
      operation: m,
      error: E,
      meta: C || null
    });
  };
  function T(m) {
    m._handlers = {
      sync: function(E) {
        m.refreshMapper();
        const C = m.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        q(C.connectorEl, f(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = m.findChildren();
        if (!C.connectorEl) return;
        const k = E.detail || {};
        q(C.connectorEl, f(C.connectorEl) + ":request-query", {
          query: Object.assign({}, k.query, {
            offset: k.offset,
            limit: k.limit,
            queryGen: k.queryGen
          })
        });
      },
      reqCreate: function(E) {
        const C = m.findChildren();
        m._fanOutCreate(C, E.detail.data || {}, E.detail.action);
      },
      reqUpdate: function(E) {
        const C = m.findChildren();
        m._fanOutUpdate(C, E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action);
      },
      reqDelete: function(E) {
        const C = m.findChildren();
        m._fanOutDelete(C, E.detail.id);
      },
      reqBulkDelete: function(E) {
        const C = m.findChildren();
        m._fanOutBulkDelete(C, E.detail.ids || []);
      },
      queueFailed: function() {
        m._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(E) {
        m.refreshMapper();
        const C = m.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const k = E.detail || {}, D = k.entryId, I = k.op, R = k.targetId, O = k.payload, P = k.expectedVersion, B = k.meta || {}, U = B.action || null, z = k.idempotencyKey || D;
        I === "create" ? q(C.connectorEl, f(C.connectorEl) + ":request-create", {
          data: O,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? q(C.connectorEl, f(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? q(C.connectorEl, f(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? q(C.connectorEl, f(C.connectorEl) + ":request-bulk-delete", {
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
        if (k ? D = m._owns(k) : D = C.closest("[data-ln-data-coordinator]") === m.dom, !D) return;
        const I = hr(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = ln(C);
        delete R._method, delete R._token, m._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(E) {
        const C = E.detail.meta || {}, k = m.findChildren();
        m.refreshMapper();
        const D = E.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => m.mapper.ingress(B));
        if (k.store && !k.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? k.store.applyQuery(P, { total: E.detail.total }).then(function(B) {
            C.queryGen != null && !m._isCurrentGen(C.targetEl, C.queryGen) || (q(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), q(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: E.detail.total !== void 0 ? E.detail.total : B.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : B.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), m._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? k.store.applyQuery(P, { total: E.detail.total }).then(function() {
            return k.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !m._isCurrentGen(C.targetEl, C.queryGen) || q(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && k.store.applyQuery(P, { total: E.detail.total }).then(function() {
            if (C.queryGen != null && !m._isCurrentGen(C.targetEl, C.queryGen)) return;
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
            }), m._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            q(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : P.length;
            q(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(E) {
        const C = m.findChildren(), k = E.detail.meta || {}, D = m.mapper.ingress(E.detail.record);
        (C.storeEl ? m._requestStoreMutation(C, "update", { id: k.tempId, data: D }) : Promise.resolve()).then(function() {
          m._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: k.entryId,
            oldKey: k.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          m._reportReconciliationError("create-reconcile", R, k);
        });
      },
      connUpdated: function(E) {
        const C = m.findChildren(), k = E.detail.meta || {}, D = m.mapper.ingress(E.detail.record);
        (C.storeEl ? m._requestStoreMutation(C, "update", { id: k.id, data: D }) : Promise.resolve()).then(function() {
          m._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
        }).catch(function(R) {
          m._reportReconciliationError("update-reconcile", R, k);
        });
      },
      connDeleted: function(E) {
        const C = m.findChildren(), k = E.detail.meta || {};
        m._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
      },
      connBulkDeleted: function(E) {
        const C = m.findChildren(), k = E.detail.meta || {};
        m._toastFromMessage(E.detail.message), k.queued && C.queue && q(C.queueEl, "ln-api-queue:ack", { entryId: k.entryId });
      },
      connError: function(E) {
        const C = E.detail || {}, k = C.meta || {}, D = k.op || C.action, I = C.status || C.error && C.error.status || 0, R = m.findChildren();
        if (D === "sync") {
          R.storeEl && q(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          k.targetEl && k.kind && (q(k.targetEl, "ln-" + k.kind + ":set-loading", { loading: !1 }), (k.kind === "table" || k.kind === "list") && q(k.targetEl, "ln-" + k.kind + ":page-failed", { offset: k.offset })), m._reportReconciliationError("query", C.error || C, k);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          m._toastFromDict("auth"), k.queued && R.queue && q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "auth" });
          return;
        }
        if (P) {
          k.queued && R.queue ? q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "retry" }) : m._toastFromDict("network");
          return;
        }
        let U = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? m.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (U = m._requestStoreMutation(R, "update", { id: k.id, data: z })), m._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (U = m._requestStoreMutation(R, "delete", { id: k.tempId })), m._toastFromDict("rejected");
        k.queued && R.queue ? U.then(function() {
          q(R.queueEl, "ln-api-queue:nack", { entryId: k.entryId, reason: "drop" });
        }).catch(function(z) {
          m._reportReconciliationError("deterministic-reconcile", z, k);
        }) : U.catch(function(z) {
          m._reportReconciliationError("deterministic-reconcile", z, k);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(E) {
        const C = m.findChildren(), k = C.store;
        if (!k || k.initializationError || !C.connector || m._noAutosync || k.isSyncing) return;
        (E.detail || {}).hasCache ? m._isStale() && k.forceSync() : k.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(E) {
        m._serveData(E, "table");
      },
      reqListData: function(E) {
        m._serveData(E, "list");
      },
      reqChartData: function(E) {
        m._serveData(E, "chart");
      },
      reqOptions: function(E) {
        m._serveOptions(E);
      },
      reqStat: function(E) {
        m._serveStat(E);
      },
      refreshQuery: function() {
        m._refreshAll(null, !0);
      },
      refresh: function(E) {
        m._mutationReceipts.resolve(E.detail), m._refreshAll(null, !1);
      },
      mutationError: function(E) {
        m._mutationReceipts.reject(E.detail);
      },
      refreshSynced: function(E) {
        E.detail && E.detail.changed && m._refreshAll(E.detail.meta, !1);
      },
      searchChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.term != null ? E.detail.term : "";
        C !== (m.dom.getAttribute(h) || "") && m.dom.setAttribute(h, C);
      },
      filterChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.key;
        if (!C) return;
        const k = (E.detail.values || []).slice(), D = m._currentQuery().filters, I = D[C];
        if (I ? I.length === k.length && I.every((B, U) => B === k[U]) : !k.length) return;
        k.length ? D[C] = k : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(U) {
            O.append(B, U);
          });
        });
        const P = O.toString();
        P ? m.dom.setAttribute(b, P) : m.dom.removeAttribute(b);
      },
      sortChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.field, k = E.detail && E.detail.direction, D = C && k && k !== "none" ? { field: C, direction: k } : null, I = m._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (m.dom.setAttribute(_, D.field), m.dom.setAttribute(i, D.direction)) : (m.dom.removeAttribute(_), m.dom.removeAttribute(i)));
      }
    }, m.dom.addEventListener("ln-data-store:request-remote-sync", m._handlers.sync), m.dom.addEventListener("ln-data-store:request-page", m._handlers.requestPage), m.dom.addEventListener("ln-data-coordinator:request-create", m._handlers.reqCreate), m.dom.addEventListener("ln-data-coordinator:request-update", m._handlers.reqUpdate), m.dom.addEventListener("ln-data-coordinator:request-delete", m._handlers.reqDelete), m.dom.addEventListener("ln-data-coordinator:request-bulk-delete", m._handlers.reqBulkDelete), m.dom.addEventListener("ln-api-queue:send", m._handlers.queueSend), m.dom.addEventListener("ln-api-queue:failed", m._handlers.queueFailed), m.dom.addEventListener("ln-data-store:initialized", m._handlers.storeInitialized), document.addEventListener("submit", m._handlers.formSubmit), r.forEach(function(E) {
      m.dom.addEventListener(E + ":fetched", m._handlers.connFetched), m.dom.addEventListener(E + ":created", m._handlers.connCreated), m.dom.addEventListener(E + ":updated", m._handlers.connUpdated), m.dom.addEventListener(E + ":deleted", m._handlers.connDeleted), m.dom.addEventListener(E + ":bulk-deleted", m._handlers.connBulkDeleted), m.dom.addEventListener(E + ":error", m._handlers.connError);
    }), document.addEventListener("ln-table:request-data", m._handlers.reqTableData), document.addEventListener("ln-list:request-data", m._handlers.reqListData), document.addEventListener("ln-chart:request-data", m._handlers.reqChartData), document.addEventListener("ln-options:request-data", m._handlers.reqOptions), document.addEventListener("ln-stat:request-count", m._handlers.reqStat), m.dom.addEventListener("ln-data-store:ready", m._handlers.refresh), m.dom.addEventListener("ln-data-store:created", m._handlers.refresh), m.dom.addEventListener("ln-data-store:updated", m._handlers.refresh), m.dom.addEventListener("ln-data-store:deleted", m._handlers.refresh), m.dom.addEventListener("ln-data-store:mutation-error", m._handlers.mutationError), m.dom.addEventListener("ln-data-store:synced", m._handlers.refreshSynced), m.dom.addEventListener("ln-data-store:query-changed", m._handlers.refreshQuery), m.dom.addEventListener("ln-search:change", m._handlers.searchChange), m.dom.addEventListener("ln-filter:change", m._handlers.filterChange), m.dom.addEventListener("ln-sort:change", m._handlers.sortChange);
  }
  y.prototype._owns = function(m) {
    return !!m && m === this._name;
  }, y.prototype._currentQuery = function() {
    const m = this.dom.getAttribute(_), E = this.dom.getAttribute(i), C = new URLSearchParams(this.dom.getAttribute(b) || ""), k = {};
    for (const D of new Set(C.keys())) k[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(h) || "",
      filters: k,
      sort: m && E ? { field: m, direction: E } : null
    };
  }, y.prototype._nextQueryGen = function(m) {
    const E = (this._queryGens.get(m) || 0) + 1;
    return this._queryGens.set(m, E), E;
  }, y.prototype._isCurrentGen = function(m, E) {
    return this._queryGens.get(m) === E;
  }, y.prototype._serveData = function(m, E) {
    const C = m.target, k = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(k);
    if (!D || !this._owns(D)) return;
    const I = m.detail || {}, R = bi(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Pt(B, O.connector), $ = Ze(R, P._currentQuery());
      if (z === "remote") {
        const V = P._nextQueryGen(C);
        q(C, "ln-" + E + ":set-loading", { loading: !0 }), q(O.connectorEl, f(O.connectorEl) + ":request-query", {
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
      return X && q(O.connectorEl, f(O.connectorEl) + ":request-query", {
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
  }, y.prototype._serveOptions = function(m) {
    const E = m.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const k = this.findChildren(), D = k.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Pt(D, k.connector);
      if (O === "remote") {
        const U = R._nextQueryGen(E);
        q(k.connectorEl, f(k.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: E, kind: "options", queryGen: U }
        });
        return;
      }
      if (O !== "store") return;
      const P = $t(D, k.connector, O), B = P ? R._nextQueryGen(E) : null;
      return P && q(k.connectorEl, f(k.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: E, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(U) {
        R._destroyed || P && !R._isCurrentGen(E, B) || q(E, "ln-options:set-data", { data: U.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: E, kind: "options" });
    });
  }, y.prototype._serveStat = function(m) {
    const E = m.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const k = m.detail && m.detail.filters ? m.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = k && Object.keys(k).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), U = B ? "remote" : Pt(I, D.connector);
      if (U === "remote") {
        const X = O._nextQueryGen(E);
        q(D.connectorEl, f(D.connectorEl) + ":request-query", {
          query: { filters: k },
          meta: { targetEl: E, kind: "stat", queryGen: X }
        });
        return;
      }
      if (U !== "store") return;
      const z = !B && $t(I, D.connector, U), $ = z ? O._nextQueryGen(E) : null;
      return z && q(D.connectorEl, f(D.connectorEl) + ":request-query", {
        query: { filters: k },
        meta: { targetEl: E, kind: "stat", queryGen: $ }
      }), I.count(k).then(function(X) {
        O._destroyed || z && !O._isCurrentGen(E, $) || q(E, "ln-stat:set-count", { count: X });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: E, kind: "stat" });
    });
  }, y.prototype._refreshAll = function(m, E) {
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
          q(I, "ln-" + O + ":set-loading", { loading: !0 }), q(P.connectorEl, f(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
          });
          continue;
        }
        const $ = $t(B, P.connector, Pt(B, P.connector)), X = $ ? C._nextQueryGen(I) : null;
        $ && q(P.connectorEl, f(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
        }), (function(Y, V, G, ht) {
          B.getAll(z).then(function(bt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(Y, ht)) return;
            const ae = {
              data: bt.data,
              total: m && m.total !== void 0 ? m.total : bt.total,
              filtered: m && m.filtered !== void 0 ? m.filtered : bt.filtered,
              offset: bt.offset !== void 0 ? bt.offset : m && m.offset !== void 0 ? m.offset : U.offset,
              queryGen: bt.queryGen !== void 0 ? bt.queryGen : m && m.queryGen !== void 0 ? m.queryGen : U.queryGen
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
    const m = this;
    m._handlers && (m.dom.removeEventListener("ln-data-store:request-remote-sync", m._handlers.sync), m.dom.removeEventListener("ln-data-store:request-page", m._handlers.requestPage), m.dom.removeEventListener("ln-data-coordinator:request-create", m._handlers.reqCreate), m.dom.removeEventListener("ln-data-coordinator:request-update", m._handlers.reqUpdate), m.dom.removeEventListener("ln-data-coordinator:request-delete", m._handlers.reqDelete), m.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", m._handlers.reqBulkDelete), m.dom.removeEventListener("ln-api-queue:send", m._handlers.queueSend), m.dom.removeEventListener("ln-api-queue:failed", m._handlers.queueFailed), m.dom.removeEventListener("ln-data-store:initialized", m._handlers.storeInitialized), document.removeEventListener("submit", m._handlers.formSubmit), r.forEach(function(E) {
      m.dom.removeEventListener(E + ":fetched", m._handlers.connFetched), m.dom.removeEventListener(E + ":created", m._handlers.connCreated), m.dom.removeEventListener(E + ":updated", m._handlers.connUpdated), m.dom.removeEventListener(E + ":deleted", m._handlers.connDeleted), m.dom.removeEventListener(E + ":bulk-deleted", m._handlers.connBulkDeleted), m.dom.removeEventListener(E + ":error", m._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", m._handlers.reqTableData), document.removeEventListener("ln-list:request-data", m._handlers.reqListData), document.removeEventListener("ln-chart:request-data", m._handlers.reqChartData), document.removeEventListener("ln-options:request-data", m._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", m._handlers.reqStat), m.dom.removeEventListener("ln-data-store:ready", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:created", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:updated", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:deleted", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:mutation-error", m._handlers.mutationError), m.dom.removeEventListener("ln-data-store:synced", m._handlers.refreshSynced), m.dom.removeEventListener("ln-data-store:query-changed", m._handlers.refreshQuery), m.dom.removeEventListener("ln-search:change", m._handlers.searchChange), m.dom.removeEventListener("ln-filter:change", m._handlers.filterChange), m.dom.removeEventListener("ln-sort:change", m._handlers.sortChange), m._handlers = null), m._boundQueries = null, m._boundDelivered = null, m._queryGens = null, m._queueQueryRefresh = null, m._mutationReceipts.close(new Error("Data coordinator destroyed")), m._mutationReceipts = null, u.delete(this), g(), delete this.dom[e];
  }, j(t, e, y, "ln-data-coordinator", {
    attributes: a
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
  const b = /* @__PURE__ */ new Map(), _ = [], i = [];
  for (const s of t || [])
    b.has(s.chainKey) || b.set(s.chainKey, []), b.get(s.chainKey).push(s);
  return b.forEach((s, c) => {
    s.sort((a, p) => a.seq - p.seq);
    const n = s[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > h) {
        i.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > h) {
        i.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = h + o, n.updatedAt = h, _.push(n);
    }
  }), { entries: _, wakeups: i };
}
function Si(t, e, o, h, b) {
  const _ = [], i = [];
  for (const s of t || []) {
    if (s.entryId === e) {
      i.push(s.entryId);
      continue;
    }
    s.chainKey === o && (s.chainKey = h, s.targetId === o && (s.targetId = h), s.meta && s.meta.id === o && (s.meta.id = h), s.meta && typeof s.meta.action == "string" && (s.meta.action = Ei(s.meta.action, o, h)), s.updatedAt = b, _.push(s));
  }
  return { changed: _, deleted: i };
}
class Ci {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || vi, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, o) => {
      const h = this.indexedDB.open(this.dbName, wi);
      h.onupgradeneeded = (b) => {
        const _ = b.target.result;
        let i;
        _.objectStoreNames.contains(it) ? i = b.target.transaction.objectStore(it) : i = _.createObjectStore(it, { keyPath: "entryId" }), i.indexNames.contains("by_scope_chain") || i.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), i.indexNames.contains("by_scope_seq") || i.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), _.objectStoreNames.contains(lt) || _.createObjectStore(lt, { keyPath: "key" });
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
      const i = o.transaction(it, "readonly").objectStore(it).index("by_scope_seq").getAll(xt(this.keyRange, e));
      i.onsuccess = () => h(i.result || []), i.onerror = () => b(ut(i, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, o) {
    return o = o || {}, this.open().then((h) => h ? new Promise((b, _) => {
      const i = h.transaction([lt, it], "readwrite"), s = i.objectStore(lt), c = i.objectStore(it), n = tn(e);
      let a = null;
      const p = (w) => {
        const v = w + 1;
        a = {
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
        }, s.put({ key: n, value: v }), c.put(a);
      }, u = s.get(n);
      u.onerror = () => _(ut(u, "Queue sequence read failed")), u.onsuccess = () => {
        const w = u.result;
        if (w && typeof w.value == "number") {
          p(w.value);
          return;
        }
        const v = c.index("by_scope_seq").getAll(xt(this.keyRange, e));
        v.onerror = () => _(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, d) => Math.max(A, d.seq || 0), 0);
          p(S);
        };
      }, i.oncomplete = () => b(a), i.onerror = () => _(i.error || new Error("Queue enqueue transaction failed")), i.onabort = () => _(i.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, o, h) {
    return this.open().then((b) => b ? new Promise((_, i) => {
      const s = b.transaction(it, "readwrite"), c = s.objectStore(it), n = c.index("by_scope_seq").getAll(xt(this.keyRange, e)), a = this.now();
      let p = { entries: [], wakeups: [] };
      n.onerror = () => i(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        p = Ai(n.result || [], o, h, a);
        for (const u of p.entries) c.put(u);
      }, s.oncomplete = () => _(p), s.onerror = () => i(s.error || new Error("Queue claim transaction failed")), s.onabort = () => i(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, o) {
    return this._updateEntry(e, o, (h, b) => (b.delete(h.entryId), { status: "acked", entry: h }));
  }
  nack(e, o, h, b) {
    b = b || {};
    const _ = b.maxAttempts || 8, i = b.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((c, n) => {
      const a = s.transaction([it, lt], "readwrite"), p = a.objectStore(it), u = a.objectStore(lt), w = p.get(o);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (h === "drop") {
            p.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (en(S), S.updatedAt = this.now(), h === "auth") {
            S.status = "pending", p.put(S), u.put({ key: Yt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (h === "retry") {
            if (S.attempts = (S.attempts || 0) + 1, S.attempts >= _) {
              S.status = "failed", S.nextAttemptAt = 0, p.put(S), v = { status: "failed", entry: S };
              return;
            }
            const A = i[Math.min(S.attempts - 1, i.length - 1)];
            S.status = "pending", S.nextAttemptAt = this.now() + A, p.put(S), v = { status: "retry", entry: S, delay: A };
          }
        }
      }, a.oncomplete = () => c(v), a.onerror = () => n(a.error || new Error("Queue nack transaction failed")), a.onabort = () => n(a.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, o, h) {
    return this._remapTransaction(e, null, o, h);
  }
  resolveCreate(e, o, h, b) {
    return this._remapTransaction(e, o, h, b);
  }
  _remapTransaction(e, o, h, b) {
    return this.open().then((_) => _ ? new Promise((i, s) => {
      const c = _.transaction(it, "readwrite"), n = c.objectStore(it), a = n.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let p = { changed: [], deleted: [] };
      a.onerror = () => s(ut(a, "Queue remap read failed")), a.onsuccess = () => {
        p = Si(a.result || [], o, h, b, this.now());
        for (const u of p.deleted) n.delete(u);
        for (const u of p.changed) n.put(u);
      }, c.oncomplete = () => i(p.changed), c.onerror = () => s(c.error || new Error("Queue remap transaction failed")), c.onabort = () => s(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((o) => o ? new Promise((h, b) => {
      const _ = o.transaction(it, "readwrite"), i = _.objectStore(it), s = i.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let c = 0;
      s.onerror = () => b(ut(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const n of s.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), en(n), i.put(n), c++);
      }, _.oncomplete = () => h(c), _.onerror = () => b(_.error || new Error("Queue failed-entry reset failed")), _.onabort = () => b(_.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((o) => o ? new Promise((h, b) => {
      const i = o.transaction(lt, "readonly").objectStore(lt).get(Yt(e));
      i.onsuccess = () => {
        const s = i.result ? i.result.value : !1;
        h(s || !1);
      }, i.onerror = () => b(ut(i, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, o) {
    return this.open().then((h) => {
      if (h)
        return new Promise((b, _) => {
          const i = h.transaction(lt, "readwrite"), s = typeof o == "string" ? o : o ? "manual" : !1;
          i.objectStore(lt).put({ key: Yt(e), value: s }), i.oncomplete = () => b(), i.onerror = () => _(i.error || new Error("Queue pause-state write failed")), i.onabort = () => _(i.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((o) => {
      if (o)
        return new Promise((h, b) => {
          const _ = o.transaction([it, lt], "readwrite"), s = _.objectStore(it).index("by_scope_seq").openCursor(xt(this.keyRange, e));
          s.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, s.onerror = () => b(ut(s, "Queue clear failed")), _.objectStore(lt).delete(tn(e)), _.objectStore(lt).delete(Yt(e)), _.oncomplete = () => h(), _.onerror = () => b(_.error || new Error("Queue clear transaction failed")), _.onabort = () => b(_.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, o, h) {
    return this.open().then((b) => b ? new Promise((_, i) => {
      const s = b.transaction(it, "readwrite"), c = s.objectStore(it), n = c.get(o);
      let a = null;
      n.onerror = () => i(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const p = n.result;
        !p || p.scope !== e || (a = h(p, c));
      }, s.oncomplete = () => _(a), s.onerror = () => i(s.error || new Error("Queue entry transaction failed")), s.onabort = () => i(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", o = [2e3, 5e3, 15e3, 6e4, 3e5], h = 8, b = 6e4;
  if (window[e] !== void 0) return;
  function _(a) {
    const p = a[e];
    p && p._drain();
  }
  const i = {
    "data-ln-api-queue": {},
    "data-ln-api-queue-online": { effect: _ }
  };
  function s() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (p) => {
        const u = Math.random() * 16 | 0;
        return (p === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const c = new Ci({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: s
  });
  function n(a) {
    this.dom = a, a[e] = this;
    const p = a.closest("[data-ln-data-coordinator]");
    this.scope = a.id || (p ? p.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = s(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return c.open().then((w) => w ? c.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (u._paused = !!w, u._paused) {
        const v = typeof w == "string" ? w : "auth";
        q(u.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return u._emitPendingCount();
    }).then(() => u._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), q(u.dom, "ln-api-queue:error", { operation: "initialize", error: w });
    }), this;
  }
  n.prototype._isOnline = function() {
    const a = this.dom.getAttribute("data-ln-api-queue-online");
    return a === "true" ? !0 : a === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const a = this;
    return c.allForScope(a.scope).then((p) => (q(a.dom, "ln-api-queue:pending-count", { count: p.length, scope: a.scope }), p.length === 0 && q(a.dom, "ln-api-queue:drained", { scope: a.scope }), p));
  }, n.prototype._clearTimer = function(a) {
    const p = this._timers.get(a);
    p && (clearTimeout(p), this._timers.delete(a));
  }, n.prototype._scheduleTimer = function(a, p) {
    const u = Math.max(0, p), w = this._timers.get(a);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(a), v._drain();
    }, u);
    this._timers.set(a, S);
  }, n.prototype._drain = function() {
    const a = this;
    return a._paused || !a._isOnline() ? Promise.resolve() : (a._drainPromise || (a._drainPromise = c.claimReady(a.scope, a._workerId, b).then((p) => {
      for (const u of p.wakeups)
        a._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of p.entries)
        a._clearTimer(u.chainKey), q(a.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((p) => {
      console.error("[ln-api-queue] Drain failed:", p), q(a.dom, "ln-api-queue:error", { operation: "drain", error: p });
    }).finally(() => {
      a._drainPromise = null;
    })), a._drainPromise);
  }, n.prototype._onEnqueue = function(a) {
    const p = this;
    return c.enqueue(p.scope, a.detail || {}).then((u) => {
      if (u)
        return p._emitPendingCount().then((w) => (q(p.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), p._drain()));
    }).catch((u) => {
      q(p.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(a) {
    const p = this, u = a.detail || {};
    return c.ack(p.scope, u.entryId).then(() => p._emitPendingCount()).then(() => p._drain()).catch((w) => {
      q(p.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(a) {
    const p = this, u = a.detail || {};
    return c.nack(p.scope, u.entryId, u.reason, {
      maxAttempts: h,
      backoff: o
    }).then((w) => {
      if (w)
        return w.status === "failed" ? q(p.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? p._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (p._paused = !0, q(p.dom, "ln-api-queue:paused", { reason: "auth" }), q(p.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), p._emitPendingCount().then(() => {
          if (w.status === "dropped") return p._drain();
        });
    }).catch((w) => {
      q(p.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onRemap = function(a) {
    const p = this, u = a.detail || {};
    return c.remap(p.scope, u.oldKey, u.newId).catch((w) => {
      q(p.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(a) {
    const p = this, u = a.detail || {};
    return c.resolveCreate(p.scope, u.entryId, u.oldKey, u.newId).then(() => p._emitPendingCount()).then(() => p._drain()).catch((w) => {
      q(p.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const a = this;
    return c.setPaused(a.scope, !1).then(() => (a._paused = !1, q(a.dom, "ln-api-queue:resumed", {}), a._drain())).catch((p) => {
      q(a.dom, "ln-api-queue:error", { operation: "resume", error: p });
    });
  }, n.prototype._onPause = function() {
    const a = this;
    return c.setPaused(a.scope, "manual").then(() => {
      a._paused = !0, q(a.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((p) => {
      q(a.dom, "ln-api-queue:error", { operation: "pause", error: p });
    });
  }, n.prototype._onDrain = function() {
    const a = this;
    return c.resetFailed(a.scope).then(() => {
      const p = a._drainPromise;
      return p ? p.then(() => a._drain()) : a._drain();
    }).catch((p) => {
      q(a.dom, "ln-api-queue:error", { operation: "manual-drain", error: p });
    });
  }, n.prototype._onClear = function() {
    const a = this;
    return a._timers.forEach((p) => clearTimeout(p)), a._timers.clear(), c.clear(a.scope).then(() => {
      a._paused = !1, q(a.dom, "ln-api-queue:pending-count", { count: 0, scope: a.scope }), q(a.dom, "ln-api-queue:drained", { scope: a.scope });
    }).catch((p) => {
      q(a.dom, "ln-api-queue:error", { operation: "clear", error: p });
    });
  }, n.prototype._bindEvents = function() {
    const a = this;
    a._handlers = {
      enqueue: (p) => a._onEnqueue(p),
      ack: (p) => a._onAck(p),
      nack: (p) => a._onNack(p),
      remap: (p) => a._onRemap(p),
      resolveCreate: (p) => a._onResolveCreate(p),
      resume: () => a._onResume(),
      pause: () => a._onPause(),
      drain: () => a._onDrain(),
      clear: () => a._onClear()
    }, a.dom.addEventListener("ln-api-queue:request-enqueue", a._handlers.enqueue), a.dom.addEventListener("ln-api-queue:ack", a._handlers.ack), a.dom.addEventListener("ln-api-queue:nack", a._handlers.nack), a.dom.addEventListener("ln-api-queue:request-remap", a._handlers.remap), a.dom.addEventListener("ln-api-queue:resolve-create", a._handlers.resolveCreate), a.dom.addEventListener("ln-api-queue:request-resume", a._handlers.resume), a.dom.addEventListener("ln-api-queue:request-pause", a._handlers.pause), a.dom.addEventListener("ln-api-queue:request-drain", a._handlers.drain), a.dom.addEventListener("ln-api-queue:request-clear", a._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const a = this;
    a.dom.removeEventListener("ln-api-queue:request-enqueue", a._handlers.enqueue), a.dom.removeEventListener("ln-api-queue:ack", a._handlers.ack), a.dom.removeEventListener("ln-api-queue:nack", a._handlers.nack), a.dom.removeEventListener("ln-api-queue:request-remap", a._handlers.remap), a.dom.removeEventListener("ln-api-queue:resolve-create", a._handlers.resolveCreate), a.dom.removeEventListener("ln-api-queue:request-resume", a._handlers.resume), a.dom.removeEventListener("ln-api-queue:request-pause", a._handlers.pause), a.dom.removeEventListener("ln-api-queue:request-drain", a._handlers.drain), a.dom.removeEventListener("ln-api-queue:request-clear", a._handlers.clear), window.removeEventListener("online", a._onlineHandler), a._timers.forEach((p) => clearTimeout(p)), a._timers.clear(), q(a.dom, "ln-api-queue:destroyed", { scope: a.scope }), delete a.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: i
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
  const o = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, h = e.xField || "label", b = e.yField || "value", _ = e.includeZero !== !1, i = Ti(e.padding, o.width, o.height), s = Array.isArray(t) ? t : [], c = [];
  for (let r = 0; r < s.length; r++) {
    const f = s[r] || {}, y = jn(f[b]);
    y !== null && c.push({
      record: f,
      sourceIndex: r,
      label: f[h] == null ? String(r + 1) : String(f[h]),
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
      baselineY: o.y + o.height - i
    };
  let n = c[0].value, a = c[0].value;
  for (let r = 1; r < c.length; r++)
    c[r].value < n && (n = c[r].value), c[r].value > a && (a = c[r].value);
  let p = n, u = a;
  _ && (p = Math.min(0, p), u = Math.max(0, u)), p === u && (u === 0 ? u = 1 : u > 0 ? p = 0 : u = 0);
  const w = Math.max(1, o.width - i * 2), v = Math.max(1, o.height - i * 2), S = u - p, A = o.y + o.height - i - (0 - p) / S * v, d = [];
  for (let r = 0; r < c.length; r++) {
    const f = c[r], y = c.length === 1 ? 0.5 : r / (c.length - 1), T = o.x + i + y * w, m = o.y + o.height - i - (f.value - p) / S * v;
    d.push({
      record: f.record,
      sourceIndex: f.sourceIndex,
      label: f.label,
      value: f.value,
      x: T,
      y: m,
      pointString: It(T) + "," + It(m)
    });
  }
  const g = d.map((r) => r.pointString).join(" ");
  let l = "";
  if (d.length > 0) {
    const r = d[0], f = d[d.length - 1], y = It(r.x) + "," + It(A), T = It(f.x) + "," + It(A);
    l = y + " " + g + " " + T;
  }
  return {
    points: d,
    linePoints: g,
    areaPoints: l,
    count: d.length,
    min: n,
    max: a,
    domainMin: p,
    domainMax: u,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", o = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function h(n) {
    const a = n[e];
    a && a.requestData();
  }
  function b(n) {
    const a = n[e];
    a && a._render();
  }
  const _ = {
    "data-ln-chart": { prop: "name", read: Q, fallback: "", effect: b },
    "data-ln-chart-source": { effect: h },
    "data-ln-chart-sort": { effect: h },
    "data-ln-chart-type": { effect: b },
    "data-ln-chart-x": { effect: b },
    "data-ln-chart-y": { effect: b },
    "data-ln-chart-padding": { effect: b },
    "data-ln-chart-zero": { effect: b }
  }, i = et(_);
  function s(n, a) {
    n && (n.textContent = a);
  }
  function c(n) {
    this.dom = n, tt(this, n, i), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const a = this;
    return this._onSetData = function(p) {
      const u = p.detail || {};
      a._data = Array.isArray(u.data) ? u.data : [], a.isLoaded = !0, a._setLoading(!1), a._render();
    }, this._onSetLoading = function(p) {
      a._setLoading(!!(p.detail && p.detail.loading));
    }, this._onRefresh = function() {
      a.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  c.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), a = n === null ? NaN : Number(n), p = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(a) && a >= 0 ? a : 16,
      type: p === "area" || p === "polygon" ? "area" : "line",
      viewBox: this.plot && Li(this.plot.getAttribute("viewBox")) || o
    };
  }, c.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, c.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const a = this.name + "-label", p = '[data-ln-template="' + a + '"]';
    if (!this.dom.querySelector(p) && !document.querySelector(p)) return;
    const u = Tt(this.dom, a, "ln-chart");
    if (!u) return;
    const w = rt(this.dom);
    for (const v of n.points) {
      const S = u.cloneNode(!0);
      jt(S, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(S);
    }
  }, c.prototype._render = function() {
    const n = this._readOptions(), a = ki(this._data, n);
    this.model = a, this.line && (this.line.setAttribute("points", a.linePoints), this.line.toggleAttribute("hidden", a.count === 0)), this.area && (this.area.setAttribute("points", a.areaPoints), this.area.toggleAttribute("hidden", a.count === 0 || n.type !== "area"));
    const p = a.count === 0;
    this.dom.classList.toggle("ln-chart--empty", p), this.empty && this.empty.toggleAttribute("hidden", !p);
    const u = rt(this.dom);
    s(this.minimum, ct(a.min, u)), s(this.maximum, ct(a.max, u)), s(this.count, ct(a.count, u)), this._renderLabels(a), q(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: a.count,
      min: a.min,
      max: a.max
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
    attributes: _
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
  function b(_) {
    this.dom = _, tt(this, _, h);
    const i = this;
    return this._onSetData = function(s) {
      i._rebuild(s.detail.data || []);
    }, _.addEventListener("ln-options:set-data", this._onSetData), q(_, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(_) {
    const i = this.dom, s = this._valueField, c = this._labelField, n = i.value, a = i.querySelectorAll("option");
    for (let u = a.length - 1; u >= 0; u--)
      a[u].value !== "" && i.removeChild(a[u]);
    for (let u = 0; u < _.length; u++) {
      const w = _[u], v = document.createElement("option");
      v.value = String(w[s]), v.textContent = w[c] != null ? w[c] : "", i.appendChild(v);
    }
    const p = i.options;
    for (let u = 0; u < p.length; u++)
      if (p[u].value === n) {
        i.value = n;
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
  function b(_) {
    return this.dom = _, tt(this, _, h), this._onSetCount = function(i) {
      _.textContent = Ii(i.detail && i.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), q(_, "ln-stat:request-count", {
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
  let _ = null;
  const i = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", n = "lni:v", a = "1";
  function p() {
    try {
      if (localStorage.getItem(n) !== a) {
        for (let g = localStorage.length - 1; g >= 0; g--) {
          const l = localStorage.key(g);
          l && l.indexOf(c) === 0 && localStorage.removeItem(l);
        }
        localStorage.setItem(n, a);
      }
    } catch {
    }
  }
  p();
  function u() {
    return _ || (_ = document.getElementById(t), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = t, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function w(g) {
    return g.indexOf(o) === 0 ? s + "/" + g.slice(o.length) + ".svg" : i + "/" + g.slice(e.length) + ".svg";
  }
  function v(g, l) {
    const r = l.match(/viewBox="([^"]+)"/), f = r ? r[1] : "0 0 24 24", y = l.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = y ? y[1].trim() : "", m = l.match(/<svg([^>]*)>/i), E = m ? m[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = g, C.setAttribute("viewBox", f), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const D = E.match(new RegExp(k + '="([^"]*)"'));
      D && C.setAttribute(k, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function S(g) {
    if (h.has(g) || b.has(g)) return;
    if (g.indexOf(o) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", g);
      return;
    }
    const l = g.slice(1);
    try {
      const f = localStorage.getItem(c + l);
      if (f) {
        v(l, f), h.add(g);
        return;
      }
    } catch {
    }
    b.add(g);
    const r = w(g);
    fetch(r).then(function(f) {
      if (!f.ok) throw new Error(f.status);
      return f.text();
    }).then(function(f) {
      v(l, f), h.add(g), b.delete(g);
      try {
        localStorage.setItem(c + l, f);
      } catch {
      }
    }).catch(function(f) {
      console.error("[ln-icon] Fetch failed for:", l, f), b.delete(g);
    });
  }
  function A(g) {
    const l = 'use[href^="' + e + '"], use[href^="' + o + '"]', r = g.querySelectorAll ? g.querySelectorAll(l) : [];
    if (g.matches && g.matches(l)) {
      const f = g.getAttribute("href");
      f && S(f);
    }
    Array.prototype.forEach.call(r, function(f) {
      const y = f.getAttribute("href");
      y && S(y);
    });
  }
  function d() {
    A(document), new MutationObserver(function(g) {
      g.forEach(function(l) {
        if (l.type === "childList")
          l.addedNodes.forEach(function(r) {
            r.nodeType === 1 && A(r);
          });
        else if (l.type === "attributes" && l.attributeName === "href") {
          const r = l.target.getAttribute("href");
          r && (r.indexOf(e) === 0 || r.indexOf(o) === 0) && S(r);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
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
  for (const _ of e) {
    const i = Di(t, _);
    i < h && (h = i, o = _);
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
  for (let _ = 0; _ < b.length; _++) {
    const i = b[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            h.push({
              type: "id-empty",
              element: i,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${i.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + Vn(n)) || h.push({
            type: "id-unresolved",
            element: i,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${i.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
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
  for (let _ = 0; _ < b.length; _++) {
    const i = b[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const a = (c.value || "").trim();
          if (!a) {
            h.push({
              type: "store-empty",
              element: i,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${i.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const p = Vn(a), u = e.querySelector(`[data-ln-data-store="${p}"], [data-ln-store="${p}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(a);
          !u && !w && h.push({
            type: "store-unresolved",
            element: i,
            attribute: c.name,
            storeName: a,
            message: `[ln-debug] Unresolved store reference: <${i.tagName.toLowerCase()} ${c.name}="${a}"> targets store "${a}", but no [data-ln-data-store="${a}"] exists in the document.`
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
  for (let _ = 0; _ < h.length; _++) {
    const i = h[_], s = (i.getAttribute("data-ln-data-store") || "").trim();
    s && (b.has(s) || b.set(s, []), b.get(s).push(i));
  }
  for (const [_, i] of b.entries())
    i.length > 1 && o.push({
      type: "store-duplicate",
      storeName: _,
      elements: i,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${_}". Store names must be unique across the document.`
    });
  return o;
}
function Fi(t = document, e = De) {
  const o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const h = [], b = [o, ...o.querySelectorAll("*")];
  for (let _ = 0; _ < b.length; _++) {
    const i = b[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = Ri(c.name, e), a = n ? ` Did you mean "${n}"?` : "";
          h.push({
            type: "attribute-unknown",
            element: i,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${i.tagName.toLowerCase()}>.${a}`
          });
        }
      }
  }
  return h;
}
function Ae(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const o = e.validAttributes || De, h = Oi(t), b = Mi(t), _ = Ni(t), i = Fi(t, o), s = [
    ...h,
    ...b,
    ..._,
    ...i
  ];
  if (!e.silent)
    for (let c = 0; c < s.length; c++)
      console.warn(s[c].message);
  return {
    idIssues: h,
    storeIssues: b,
    uniquenessIssues: _,
    spellingIssues: i,
    total: s.length
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
  function h(_) {
    return this.dom = _, Xt(_.ownerDocument || document), rn(), this;
  }
  h.prototype.verify = function(_, i) {
    return Ae(_ || (this.dom ? this.dom.ownerDocument || this.dom : document), i);
  }, h.prototype.destroy = function() {
    delete this.dom[e], rn();
  };
  const b = j(t, e, h, "ln-debug", {
    attributes: o,
    onInit: function(_) {
      typeof document < "u" && Xt(_ && _.ownerDocument ? _.ownerDocument : document);
    },
    onSubtreeChange: function(_) {
      typeof document < "u" && Xt(_ && _.ownerDocument ? _.ownerDocument : document);
    }
  });
  b.verify = function(_, i) {
    return Ae(_ || document, i);
  }, b.schedule = function(_, i, s) {
    return Xt(_ || document, i, s);
  };
})();
