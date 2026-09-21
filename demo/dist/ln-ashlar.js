function Q(t, e, r) {
  const l = t.getAttribute(e);
  return l === null ? r : l;
}
function It(t, e, r) {
  const l = parseInt(t.getAttribute(e), 10);
  return isNaN(l) ? r : l;
}
function Kt(t, e) {
  return t.hasAttribute(e);
}
function mr(t, e) {
  return (t.getAttribute(e) || "").split(",").map((r) => r.trim()).filter(Boolean);
}
function tt(t, e, r) {
  for (const l in r) {
    const [g, p, o] = r[l];
    Object.defineProperty(t, l, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return g(e, p, o);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function et(t) {
  const e = {};
  for (const r in t) {
    const l = t[r];
    !l || !l.prop || (e[l.prop] = [l.read, r, l.fallback]);
  }
  return e;
}
function gr(t) {
  const e = {};
  for (const r in t) {
    const l = t[r];
    l && l.effect && (e[r] = l.effect);
  }
  return Object.keys(e).length ? e : null;
}
function _r(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const r in t.effects) e.add(r);
  if (t.onAttrChange && t.declared) for (const r of t.declared) e.add(r);
  return e;
}
function Te(t) {
  let e = !1;
  for (let r = 0; r < t.length; r++) {
    const l = t[r];
    if (!(l === "" || l == null) && (e = !0, !Number.isFinite(Number(l))))
      return "string";
  }
  return e ? "number" : "string";
}
function Le(t, e, r, l) {
  if (r === "number") {
    const o = parseFloat(t), a = parseFloat(e);
    return (isNaN(o) ? 0 : o) - (isNaN(a) ? 0 : a);
  }
  const g = t != null ? String(t) : "", p = e != null ? String(e) : "";
  return l ? l.compare(g, p) : g < p ? -1 : g > p ? 1 : 0;
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
  const r = de[t];
  return r ? r.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function br(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function yr(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function k(t, e, r) {
  const l = r || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: l
  }));
}
function Z(t, e, r) {
  const l = r || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l);
  const g = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: l
  });
  return t.dispatchEvent(g), g;
}
function cn(t, e, r) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const l = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  l[r] = t.name, k(t.dom, e, l);
}
function pt(t, e) {
  if (!t || !e) return t;
  const r = t.querySelectorAll("[data-ln-field]");
  for (let o = 0; o < r.length; o++) {
    const a = r[o], d = a.getAttribute("data-ln-field");
    e[d] != null && (a.textContent = e[d]);
  }
  const l = t.querySelectorAll("[data-ln-attr]");
  for (let o = 0; o < l.length; o++) {
    const a = l[o], d = a.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < d.length; n++) {
      const i = d[n].trim().split(":");
      if (i.length !== 2) continue;
      const f = i[0].trim(), u = i[1].trim();
      e[u] != null && a.setAttribute(f, e[u]);
    }
  }
  const g = t.querySelectorAll("[data-ln-show]");
  for (let o = 0; o < g.length; o++) {
    const a = g[o], d = a.getAttribute("data-ln-show");
    d in e && a.classList.toggle("hidden", !e[d]);
  }
  const p = t.querySelectorAll("[data-ln-class]");
  for (let o = 0; o < p.length; o++) {
    const a = p[o], d = a.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < d.length; n++) {
      const i = d[n].trim().split(":");
      if (i.length !== 2) continue;
      const f = i[0].trim(), u = i[1].trim();
      u in e && a.classList.toggle(f, !!e[u]);
    }
  }
  return t;
}
function vr(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const r = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let l = 0; l < r.length; l++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", r[l], e ?? null), r[l].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      pt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let r = 0; r < e.length; r++)
        e[r].textContent = "";
    }
})));
function jt(t, e) {
  if (!t || !e) return t;
  const r = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; r.nextNode(); ) {
    const p = r.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(o, a) {
        return e[a] !== void 0 ? e[a] : "";
      }
    ));
  }
  const l = function(p, o) {
    return e[o] !== void 0 ? e[o] : "";
  }, g = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && g.push(t);
  for (let p = 0; p < g.length; p++) {
    const o = g[p], a = o.attributes;
    for (let d = 0; d < a.length; d++) {
      const n = a[d];
      n.value.indexOf("{{") !== -1 && o.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, l));
    }
  }
  return t;
}
function wr(t, e, r, l, g, p) {
  const o = {};
  for (let d = 0; d < t.children.length; d++) {
    const n = t.children[d], i = n.getAttribute("data-ln-render-key");
    i && (o[i] = n);
  }
  const a = document.createDocumentFragment();
  for (let d = 0; d < e.length; d++) {
    const n = e[d], i = String(l(n));
    let f = o[i];
    if (f)
      g(f, n, d);
    else {
      const u = Jt(r, p);
      if (!u || (jt(u, n), f = u.firstElementChild, !f)) continue;
      f.setAttribute("data-ln-render-key", i), g(f, n, d);
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
function Ct(t, e, r) {
  if (t) {
    const l = t.querySelector('[data-ln-template="' + e + '"]');
    if (l) return l.content.cloneNode(!0);
  }
  return Jt(e, r);
}
function re(t, e) {
  const r = {}, l = t.querySelectorAll("[" + e + "]");
  for (let g = 0; g < l.length; g++)
    r[l[g].getAttribute(e)] = l[g].textContent, l[g].remove();
  return r;
}
function ke(t, e, r, l) {
  if (t.nodeType !== 1) return;
  const p = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", o = Array.from(t.querySelectorAll(p));
  t.matches && t.matches(p) && o.push(t);
  for (const a of o)
    a[r] || (window.lnCore._persistSink && a.hasAttribute("data-ln-persist") && window.lnCore._persistSink(a, e), a[r] = new l(a));
}
function Ut(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function dn(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Er(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function un(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Ar(t, e) {
  return !t || !document.contains(t) || un(t) || e && typeof t[e] != "function" ? !1 : Ut(t);
}
function Sr(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function hn(t, e) {
  const r = !!(e && e.typed), l = e && e.exclude, g = {}, p = t.elements, o = {};
  if (r)
    for (let a = 0; a < p.length; a++) {
      const d = p[a];
      d.name && d.type === "checkbox" && !d.disabled && (o[d.name] = (o[d.name] || 0) + 1);
    }
  for (let a = 0; a < p.length; a++) {
    const d = p[a];
    if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button") && !(l && d.matches && d.matches(l)))
      if (d.type === "checkbox")
        r && o[d.name] === 1 ? g[d.name] = d.checked : (g[d.name] || (g[d.name] = []), d.checked && g[d.name].push(d.value));
      else if (d.type === "radio")
        d.checked && (g[d.name] = d.value);
      else if (d.type === "select-multiple") {
        g[d.name] = [];
        for (let n = 0; n < d.options.length; n++)
          d.options[n].selected && g[d.name].push(d.options[n].value);
      } else if (r && d.type === "hidden")
        g[d.name] = d.value;
      else if (r && (d.type === "number" || d.type === "range")) {
        const n = Number(d.value);
        g[d.name] = d.value === "" || isNaN(n) ? null : n;
      } else
        g[d.name] = d.value;
  }
  return g;
}
function Cr(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function fn(t, e) {
  const r = t.elements, l = [], g = {};
  for (let p = 0; p < r.length; p++) {
    const o = r[p];
    o.name && o.type === "checkbox" && (g[o.name] = (g[o.name] || 0) + 1);
  }
  for (let p = 0; p < r.length; p++) {
    const o = r[p];
    if (o.type === "file" || o.type === "submit" || o.type === "button") continue;
    const a = o.getAttribute("data-ln-fill-as") || o.name;
    if (!a || !(a in e)) continue;
    const d = e[a];
    if (o.type === "checkbox") {
      if (Array.isArray(d))
        o.checked = d.indexOf(o.value) !== -1;
      else if (g[o.name] > 1) {
        const n = String(d).split(",").map(function(i) {
          return i.trim();
        });
        o.checked = n.indexOf(o.value) !== -1;
      } else
        o.checked = Cr(d);
      l.push(o);
    } else if (o.type === "radio")
      o.checked = o.value === String(d), l.push(o);
    else if (o.type === "select-multiple") {
      if (Array.isArray(d))
        for (let n = 0; n < o.options.length; n++)
          o.options[n].selected = d.indexOf(o.options[n].value) !== -1;
      l.push(o);
    } else
      o.value = d, l.push(o);
  }
  return l;
}
const Fe = {
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
  const e = t ? t.closest("[lang]") : null, r = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!r) return "en-US";
  const l = r.trim().toLowerCase();
  return l.indexOf("-") === -1 && Fe[l] ? Fe[l] : r;
}
function ie() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, gt(function() {
    new MutationObserver(function() {
      k(document, "ln-core:locale-change", {});
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
function pn(t, e, { get: r, set: l }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return r ? r.call(this) : e.get.call(this);
    },
    set: function(g) {
      l ? l.call(this, g, (p) => e.set.call(this, p)) : e.set.call(this, g);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Tr() {
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
function mn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function gn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function _n(t) {
  const e = gn(), r = t.observed || [];
  for (let l = 0; l < r.length; l++) {
    const g = r[l];
    e.byAttr.has(g) || e.byAttr.set(g, []), e.byAttr.get(g).push(t);
  }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const l = _r(t);
    if (l === null)
      e.reactiveWildcard.push(t);
    else
      for (const g of l)
        e.byReactive.has(g) || e.byReactive.set(g, []), e.byReactive.get(g).push(t);
  }
  t.persist && e.persist.push(t);
}
function Be(t, e, r, l) {
  for (let g = 0; g < t.length; g++) {
    const p = t[g];
    if (!e[p.attribute]) continue;
    const o = p.effects && p.effects[r];
    o ? o(e, r, l) : p.onAttrChange && (!p.declared || p.declared.has(r)) && p.onAttrChange(e, r, l);
  }
}
function Lr(t) {
  const e = t.target, r = t.attributeName;
  if (t.oldValue === e.getAttribute(r)) return;
  const l = gn(), g = l.byAttr.get(r);
  if (window.lnCore._debugSink && (r.indexOf("data-ln-") === 0 || g) && window.lnCore._debugSink("attr", r, e, { oldValue: t.oldValue, newValue: e.getAttribute(r) }), r.indexOf("data-ln-") === 0) {
    const p = l.byReactive.get(r);
    p && Be(p, e, r, t.oldValue), l.reactiveWildcard.length && Be(l.reactiveWildcard, e, r, t.oldValue);
  }
  if (g)
    for (let p = 0; p < g.length; p++) {
      const o = g[p];
      if (o.handler) {
        o.handler(e, r, t.oldValue);
        continue;
      }
      o.onAttributeChange && e[o.attribute] ? o.onAttributeChange(e, r) : (ke(e, o.selector, o.attribute, o.ComponentFn), o.onInit && o.onInit(e));
    }
}
function bn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let r = 0; r < e.length; r++)
        Lr(e[r]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function yn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function kr(t) {
  const e = yn();
  if (e.length) {
    if (t.target)
      for (let r = 0; r < e.length; r++) {
        const l = e[r];
        if (l.onSubtreeChange) {
          const g = l.query, p = t.target.nodeType === 1 ? t.target.matches(g) ? t.target : t.target.closest(g) : t.target.parentElement ? t.target.parentElement.closest(g) : null;
          p && l.onSubtreeChange(p, t);
        }
      }
    for (let r = 0; r < t.addedNodes.length; r++) {
      const l = t.addedNodes[r];
      if (l.nodeType === 1)
        for (let g = 0; g < e.length; g++) {
          const p = e[g];
          ke(l, p.selector, p.attribute, p.ComponentFn), p.onInit && p.onInit(l);
        }
    }
    for (let r = 0; r < t.removedNodes.length; r++) {
      const l = t.removedNodes[r];
      if (l.nodeType === 1)
        for (let g = 0; g < e.length; g++) {
          const p = e[g], o = p.query, a = Array.from(l.querySelectorAll(o));
          l.matches && l.matches(o) && a.push(l);
          for (let d = 0; d < a.length; d++) {
            const n = a[d];
            if (!document.contains(n)) {
              const i = n[p.attribute];
              i && typeof i.destroy == "function" && i.destroy(), delete n[p.attribute];
            }
          }
        }
    }
  }
}
function qr() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let r = 0; r < e.length; r++) {
        const l = e[r];
        l.type === "childList" && kr(l);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Vt(t, e) {
  _n({ observed: t, handler: e }), bn();
}
function j(t, e, r, l, g = {}) {
  const p = g.extraAttributes || [], o = g.onAttributeChange || null, a = g.onSubtreeChange || null, d = g.onInit || null, n = g.onAttrChange || null, i = g.effects || null, f = g.attributes || null, u = f ? gr(f) : i, w = f ? new Set(Object.keys(f)) : null, v = g.persist || null;
  function S(s) {
    const m = s || document.body;
    ke(m, t, e, r), d && d(m);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const s = /\[([\w-]+)/g;
    let m;
    for (; (m = s.exec(t)) !== null; )
      A.push(m[1]);
  } else
    A.push(t);
  _n({
    selector: t,
    attribute: e,
    ComponentFn: r,
    onInit: d,
    observed: A.concat(p),
    onAttributeChange: o,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: v
  }), bn();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  yn().push({
    selector: t,
    attribute: e,
    ComponentFn: r,
    onInit: d,
    onSubtreeChange: a,
    query: _
  }), qr(), window[e] = S;
  function c() {
    mn() > 0 ? mt(function() {
      S(document.body);
    }) : S(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c(), S;
}
function vn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const r = e.getAttribute("href");
  return !(!r || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || r.startsWith("mailto:") || r.startsWith("tel:") || r === "#" || r.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, r) => r === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Mt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function wn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (r) {
    return console.error(`[${e}] Invalid headers JSON:`, r), {};
  }
}
const En = {};
function xr(t, e) {
  En[t] = e;
}
function Ir(t) {
  return En[t] || { ingress: (e) => e, egress: (e) => e };
}
const An = {};
function qe(t, e) {
  if (!t || typeof e != "object") return;
  const r = t.toLowerCase().split("-")[0];
  An[r] = e;
}
function kt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return An[e] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = xr, window.lnCore.getDataMapper = Ir, window.lnCore.registerLocaleFallback = qe, window.lnCore.getLocaleFallback = kt, window.lnCore.fillTemplate = jt, window.lnCore.fill = pt, window.lnCore.lnFill = vr, window.lnCore.renderList = wr, window.lnCore.ensureLocaleObserver = ie);
function oe(t, e) {
  let r = !1;
  return function() {
    r || (r = !0, queueMicrotask(function() {
      r = !1, t();
    }));
  };
}
function Sn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, r = t.pageSize > 0 ? t.pageSize : 200, l = t.threshold != null ? t.threshold : 25, g = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, o = typeof t.onChange == "function" ? t.onChange : function() {
  }, a = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let i = 0, f = 0, u = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, h = !1;
  function _(y) {
    d.set(y, ++S);
  }
  function c() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function s() {
    if (a.size <= e) return;
    const y = Array.from(a.keys()).sort(function(b, E) {
      return (d.get(b) || 0) - (d.get(E) || 0);
    });
    let T = 0;
    for (; a.size > e && T < y.length; )
      a.delete(y[T]), d.delete(y[T]), T++;
  }
  function m(y, T) {
    n.add(y), p(w, y, T);
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
      return i;
    },
    get grandTotal() {
      return f;
    },
    get queryGen() {
      return u;
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
      if (i <= 0) return;
      const b = Math.max(0, y - l), E = Math.min(i, T + l), C = Math.floor(b / r), q = Math.floor(Math.max(0, E - 1) / r);
      let D = -1;
      for (let I = C; I <= q; I++) {
        const R = I * r, O = Math.min(r, i - R);
        let B = !1;
        const P = Math.max(R, b), H = Math.min(R + O, E);
        for (let z = P; z < H; z++)
          if (!a.has(z)) {
            B = !0;
            break;
          }
        if (B && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (v = setTimeout(function() {
        m(D, r);
      }, g));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== u) return !1;
      const T = y.offset || 0, b = y.data || [];
      let E = 0;
      for (let C = 0; C < b.length; C++)
        b[C] != null && E++;
      if (E === 0 && (y.provisional || y.filtered > 0))
        return n.delete(T), !1;
      h && (a.clear(), d.clear(), h = !1), y.provisional || (f = y.total != null ? y.total : f, i = y.filtered != null ? y.filtered : y.data ? y.data.length : i);
      for (let C = 0; C < b.length; C++)
        b[C] != null && (a.set(T + C, b[C]), _(T + C));
      return n.delete(T), s(), o(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (w = y), m(0, r);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(y) {
      u++, n.clear(), clearTimeout(v), y && (w = y), h = !0, m(0, r);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(v), h = !0;
      const y = Math.max(0, Math.floor(A / r) * r);
      m(y, r);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(y) {
      n.delete(y);
    },
    destroy: function() {
      clearTimeout(v), a.clear(), d.clear(), n.clear();
    },
    configure: function(y) {
      y = y || {};
      let T = !1;
      if (y.windowSize != null && y.windowSize > 0 && y.windowSize !== e) {
        const b = y.windowSize < e;
        e = y.windowSize, b && s(), T = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (r = y.pageSize), y.threshold != null && y.threshold >= 0 && (l = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (g = y.fetchDebounce), T && o();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (f = y, c() || (i = y), o());
    }
  };
}
function Cn(t) {
  return (t || "").replace(/^#/, "");
}
function se(t) {
  const e = t === void 0 ? location.hash : t, r = {}, l = Cn(e);
  if (!l) return r;
  const g = l.split("&");
  for (let p = 0; p < g.length; p++) {
    const o = g[p];
    if (!o) continue;
    const a = o.indexOf(":"), d = a > -1 ? o.slice(0, a) : o, n = a > -1 ? o.slice(a + 1) : "";
    if (d)
      try {
        r[d] = decodeURIComponent(n);
      } catch {
        r[d] = n;
      }
  }
  return r;
}
function ot(t) {
  if (!t) return null;
  const e = se();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const r = se();
  e == null ? delete r[t] : r[t] = String(e);
  const g = Object.keys(r).map(function(p) {
    const o = r[p];
    return o === "" ? p : p + ":" + encodeURIComponent(o);
  }).join("&");
  Cn(location.hash) !== g && (location.hash = g);
}
function xe(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const r = t.getAttribute("data-ln-hash");
  if (r && r.trim() !== "") return r.trim();
  const l = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return l ? e ? l + "-" + e : l : e || null;
}
function Tn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function _e(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Ln(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function be(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const r = t.slice(0, e), l = t.slice(e + 1), g = l ? l.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: r, values: g };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = xe, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = Tn, window.lnCore.hashSortDecode = _e, window.lnCore.hashFilterEncode = Ln, window.lnCore.hashFilterDecode = be);
function Zt(t, e, r, l) {
  const g = typeof l == "number" ? l : 4, p = window.innerWidth, o = window.innerHeight, a = e.width, d = e.height, n = (r || "bottom").split("-"), i = n[0], f = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[i] || u.bottom;
  function v(c) {
    return c === "top" || c === "bottom" ? f === "start" ? t.left : f === "end" ? t.right - a : t.left + (t.width - a) / 2 : f === "start" ? t.top : f === "end" ? t.bottom - d : t.top + (t.height - d) / 2;
  }
  function S(c) {
    let s, m, y = !0;
    return c === "top" ? (s = t.top - g - d, m = v(c), s < 0 && (y = !1)) : c === "bottom" ? (s = t.bottom + g, m = v(c), s + d > o && (y = !1)) : c === "left" ? (s = v(c), m = t.left - g - a, m < 0 && (y = !1)) : (s = v(c), m = t.right + g, m + a > p && (y = !1)), { top: s, left: m, side: c, fits: y };
  }
  let A = null;
  for (let c = 0; c < w.length; c++) {
    const s = S(w[c]);
    if (s.fits) {
      A = s;
      break;
    }
  }
  A || (A = S(w[0]));
  let h = A.top, _ = A.left;
  return a >= p ? _ = 0 : (_ < 0 && (_ = 0), _ + a > p && (_ = p - a)), d >= o ? h = 0 : (h < 0 && (h = 0), h + d > o && (h = o - d)), { top: h, left: _, placement: A.side };
}
function ye(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, r = e.visibility, l = e.display, g = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const p = t.offsetWidth, o = t.offsetHeight;
  return e.visibility = r, e.display = l, e.position = g, { width: p, height: o };
}
let Ht = null;
const Dr = "ln-ashlar:storage-salt:v1", Pe = 32768;
function Ue(t) {
  let e = "";
  const r = t.byteLength;
  for (let l = 0; l < r; l += Pe)
    e += String.fromCharCode.apply(
      null,
      t.subarray(l, Math.min(l + Pe, r))
    );
  return btoa(e);
}
function He(t) {
  const e = atob(t), r = e.length, l = new Uint8Array(r);
  for (let g = 0; g < r; g++)
    l[g] = e.charCodeAt(g);
  return l;
}
function kn(t, e) {
  let r = Ht, l = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? r = t : t && typeof t == "object" && (l = t, typeof CryptoKey < "u" && l.key instanceof CryptoKey && (r = l.key)), { key: r, options: l };
}
async function Rr(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const r = e.method || "pbkdf2", l = new TextEncoder();
  if (r === "sha256") {
    const d = await crypto.subtle.digest("SHA-256", l.encode(t));
    return crypto.subtle.importKey(
      "raw",
      d,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const g = e.salt || Dr, p = typeof g == "string" ? l.encode(g) : g, o = e.iterations || 1e5, a = await crypto.subtle.importKey(
    "raw",
    l.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: p,
      iterations: o,
      hash: "SHA-256"
    },
    a,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function ze(t, e = {}) {
  if (!t) {
    Ht = null;
    return;
  }
  try {
    const r = e.method || "sha256";
    Ht = await Rr(t, { ...e, method: r });
  } catch (r) {
    throw console.error("[ln-core/crypto] Key derivation failed:", r), Ht = null, r;
  }
}
function At() {
  return Ht;
}
async function Or(t, e, r) {
  const { key: l } = kn(e);
  if (t == null)
    return t;
  if (!l)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const g = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), o = typeof t == "string" ? t : JSON.stringify(t), a = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      l,
      g.encode(o)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Ue(p),
      data: Ue(new Uint8Array(a))
    };
  } catch (g) {
    throw console.error("[ln-core/crypto] Encryption failed:", g), new Error("[ln-crypto] Encryption failed: " + (g && g.message ? g.message : String(g)));
  }
}
async function Mr(t, e, r) {
  const { key: l, options: g } = kn(e), p = g.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!l) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const o = new TextDecoder(), a = He(t.iv), d = He(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: a },
      l,
      d
    ), i = o.decode(n);
    try {
      return JSON.parse(i);
    } catch {
      return i;
    }
  } catch (o) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", o), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (o && o.message ? o.message : String(o)));
  }
}
function qn(t, e = 100, r = 0) {
  const l = parseFloat(String(t)) || 0, g = parseFloat(String(e)) || 100, p = parseFloat(String(r)) || 0, o = Math.max(p, Math.min(l, g)), a = g - p;
  let d = 0;
  return a > 0 && (d = (o - p) / a * 100), d = Math.max(0, Math.min(100, d)), {
    value: l,
    min: p,
    max: g,
    clampedValue: o,
    percentage: d
  };
}
function st(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const r = e < 1e11 ? e * 1e3 : e, l = new Date(r);
    return isNaN(l.getTime()) ? null : l;
  }
  if (typeof t == "string") {
    const r = t.trim();
    if (!r) return null;
    const l = new Date(r);
    return isNaN(l.getTime()) ? null : l;
  }
  return null;
}
function Nt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0");
  return e + "-" + r + "-" + l;
}
const yt = {};
function te(t) {
  const e = t || "default";
  if (!yt[e]) {
    const r = new Intl.NumberFormat(t, { useGrouping: !0 }), l = r.formatToParts(1234.5);
    let g = "", p = ".";
    for (let o = 0; o < l.length; o++)
      l[o].type === "group" && (g = l[o].value), l[o].type === "decimal" && (p = l[o].value);
    yt[e] = { groupSep: g, decimalSep: p, fmt: r };
  }
  return yt[e];
}
function xn(t, e, r) {
  if (t == null || typeof t != "string") return "";
  let l = t.trim();
  return l === "" ? "" : (l = l.replace(/[$€£¥]/g, ""), e && (l = l.split(e).join("")), l = l.replace(/\s/g, ""), r && r !== "." && (l = l.replace(r, ".")), l = l.replace(/[^\d.-]/g, ""), l);
}
function Nr(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const r = t.trim();
  if (r === "" || r === "-") return NaN;
  const l = te(e), g = xn(r, l.groupSep, l.decimalSep);
  if (g === "" || g === "-") return NaN;
  const p = parseFloat(g);
  return isNaN(p) ? NaN : p;
}
function ct(t, e, r = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const l = e || "default", g = r.maxDecimals != null ? parseInt(r.maxDecimals, 10) : null, p = r.userDecimals != null ? r.userDecimals : null;
  if (g !== null) {
    const o = l + "|max:" + g;
    return yt[o] || (yt[o] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: g
    })), yt[o].format(t);
  }
  if (p !== null && p > 0) {
    const o = l + "|exact:" + p;
    return yt[o] || (yt[o] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: p,
      maximumFractionDigits: p
    })), yt[o].format(t);
  }
  return te(e).fmt.format(t);
}
function ve(t) {
  return String(t || "").trim().toLowerCase();
}
function In(t) {
  const e = ve(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function Fr(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((r) => r.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Dn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const r = String(t).toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (r.indexOf(e[l]) === -1) return !1;
  return !0;
}
function Br(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ie(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const r = String(t).trim().toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (String(e[l]).trim().toLowerCase() === r)
      return !0;
  return !1;
}
function Pr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Ur(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Hr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function zr(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  function l(o, a) {
    a = a || {};
    const d = Pr(o), n = Ur(o, a), i = Hr(d, n);
    zr(n) && e.has(i) && (e.get(i).abort(), e.delete(i));
    const f = new AbortController(), u = a.signal;
    let w = null;
    u && (u.aborted ? f.abort(u.reason) : (w = function() {
      f.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, a, { signal: f.signal });
    return e.set(i, f), t(o, v).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(i) === f && e.delete(i);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function g(o) {
    if (!o.detail || !o.detail.url) return;
    const a = o.target, d = (o.detail.method || (o.detail.body ? "POST" : "GET")).toUpperCase(), n = o.detail.key;
    n && r.has(n) && (r.get(n).abort(), r.delete(n));
    const i = new AbortController(), f = o.detail.signal;
    let u = null;
    f && (f.aborted ? i.abort(f.reason) : (u = function() {
      i.abort(f.reason);
    }, f.addEventListener("abort", u, { once: !0 }))), n && r.set(n, i);
    const w = { method: d, signal: i.signal };
    o.detail.body !== void 0 && (w.body = o.detail.body), window.fetch(o.detail.url, w).then(function(v) {
      f && u && f.removeEventListener("abort", u), n && r.get(n) === i && r.delete(n), k(a, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      f && u && f.removeEventListener("abort", u), n && r.get(n) === i && r.delete(n), !(v && v.name === "AbortError") && k(a, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
      });
    });
  }
  function p(o) {
    const a = o.detail || {};
    a.all ? window.lnHttp.cancelAll() : a.key ? window.lnHttp.cancelByKey(a.key) : a.url && window.lnHttp.cancel(a.url);
  }
  document.addEventListener("ln-http:request", g), document.addEventListener("ln-http:cancel", p), window.lnHttp = {
    cancel: function(o) {
      let a = !1;
      return e.forEach(function(d, n) {
        n.endsWith(" " + o) && (d.abort(), e.delete(n), a = !0);
      }), a;
    },
    cancelByKey: function(o) {
      return r.has(o) ? (r.get(o).abort(), r.delete(o), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(o) {
        o.abort();
      }), e.clear(), r.forEach(function(o) {
        o.abort();
      }), r.clear();
    },
    get inflight() {
      const o = [];
      return e.forEach(function(a, d) {
        const n = d.indexOf(" ");
        o.push({ method: d.slice(0, n), url: d.slice(n + 1) });
      }), r.forEach(function(a, d) {
        o.push({ key: d });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", g), document.removeEventListener("ln-http:cancel", p), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-include": { prop: "url", read: Q, fallback: "" }
  }, l = et(r), g = /* @__PURE__ */ new Map();
  function p(o) {
    if (this.dom = o, tt(this, o, l), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Tr(), this._held = !0;
    const a = this, d = this.url;
    let n = g.get(d);
    return n || (n = fetch(d).then(function(i) {
      if (!i.ok)
        throw new Error("HTTP error! status: " + i.status);
      return i.text();
    }).catch(function(i) {
      throw g.delete(d), i;
    }), g.set(d, n)), n.then(function(i) {
      if (a._destroyed) return;
      const f = document.createElement("template");
      f.innerHTML = i, a.dom.content.appendChild(f.content), k(a.dom, "ln-include:loaded", { target: a.dom, url: a.url }), a._held && (a._held = !1, ue());
    }).catch(function(i) {
      a._destroyed || (console.error("[ln-include] Failed to fetch template from " + a.url + ":", i), k(a.dom, "ln-include:error", { target: a.dom, url: a.url, error: i }), a._held && (a._held = !1, ue()));
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ue()), delete this.dom[e]);
  }, j(t, e, p, "ln-include", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-form": {},
    "data-ln-form-action-edit": { prop: "_actionEdit", read: Q, fallback: "" },
    "data-ln-form-action-method": { prop: "_actionMethod", read: Q, fallback: "PUT" }
  }, l = et(r);
  function g(p) {
    this.dom = p, tt(this, p, l), this._baseAction = p.getAttribute("action") || "";
    const o = this;
    return this._onLnFill = function(a) {
      a.target === o.dom && (a.detail ? (o.fill(a.detail), o._applyActionMode(a.detail)) : o.dom.reset());
    }, this._onReset = function() {
      o._applyActionMode(null);
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  g.prototype.fill = function(p) {
    const o = fn(this.dom, p);
    for (let a = 0; a < o.length; a++) {
      const d = o[a], n = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, g.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, g.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const o = p && p.id != null && p.id !== "" ? p.id : null, a = this._ensureMethodInput();
    if (o !== null) {
      const d = this._actionEdit;
      d ? this.dom.setAttribute("action", d.replace(":id", encodeURIComponent(o))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(o)), a.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), a.value = "";
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), k(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, g, "ln-form", {
    attributes: r
  });
})();
const Ke = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function je(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function Kr(t, e) {
  const r = [];
  if (t) {
    const l = Object.keys(Ke);
    for (let g = 0; g < l.length; g++) {
      const p = l[g], o = Ke[p];
      t[o] && r.push(p);
    }
  }
  if (e) {
    const l = Array.from(e);
    for (let g = 0; g < l.length; g++)
      l[g] && r.indexOf(l[g]) === -1 && r.push(l[g]);
  }
  return r;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", r = "data-ln-validate-errors", l = "data-ln-validate-error", g = "ln-validate-valid", p = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-validate": {},
    "data-ln-validate-errors": {},
    "data-ln-validate-error": {}
  };
  function a(d) {
    this.dom = d, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, i = d.tagName, f = d.type, u = i === "SELECT" || f === "checkbox" || f === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(S) {
      const A = S.detail && S.detail.error;
      if (!A) return;
      n._customErrors.add(A), n._touched = !0;
      const h = d.closest(".form-element");
      if (h) {
        const _ = h.querySelector("[" + l + '="' + A + '"]');
        _ && _.classList.remove("hidden");
      }
      d.classList.remove(g), d.classList.add(p), d.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, h = d.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), h) {
          const _ = h.querySelector("[" + l + '="' + A + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(_) {
          if (h) {
            const c = h.querySelector("[" + l + '="' + _ + '"]');
            c && c.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, u || d.addEventListener("input", this._onInput), d.addEventListener("change", this._onChange), d.addEventListener("ln-validate:set-custom", this._onSetCustom), d.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = d.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(S) {
      n._touched = !0, !n.validate() && S.detail && S.detail.invalidFields && S.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(S) {
      const A = { invalidFields: [] };
      k(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((h, _) => h.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (d.value && d.value.trim() !== "" || d.checked) && (this._touched = !0, this.validate()), this;
  }
  a.prototype.validate = function() {
    const d = this.dom, n = d.validity, i = je(n, this._customErrors.size), f = Kr(n, this._customErrors), u = d.closest(".form-element");
    if (u) {
      const v = u.querySelector("[" + r + "]");
      if (v) {
        const S = v.querySelectorAll("[" + l + "]");
        for (let A = 0; A < S.length; A++) {
          const h = S[A].getAttribute(l);
          S[A].classList.toggle("hidden", !f.includes(h));
        }
      }
    }
    return d.classList.toggle(g, i), d.classList.toggle(p, !i), d.setAttribute("aria-invalid", i ? "false" : "true"), k(d, i ? "ln-validate:valid" : "ln-validate:invalid", { target: d, field: d.name, errors: f }), i;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, p), this.dom.removeAttribute("aria-invalid");
    const d = this.dom.closest(".form-element");
    if (d) {
      const n = d.querySelectorAll("[" + l + "]");
      for (let i = 0; i < n.length; i++)
        n[i].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return je(this.dom.validity, this._customErrors.size);
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const d = this.dom.form;
    d && (this._onFormReset && d.removeEventListener("reset", this._onFormReset), this._onValidateRequest && d.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(g, p), this.dom.removeAttribute("aria-invalid"), k(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, a, "ln-validate", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", r = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function l(f) {
    if (!f.hasAttribute(t) || f[e]) return;
    f[e] = !0;
    const u = d(f);
    g(u.links), p(u.forms);
  }
  function g(f) {
    for (const u of f) {
      if (u[e + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const w = u.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!vn(S, u)) return;
        S.preventDefault();
        const A = u.getAttribute("href");
        A && a("GET", A, null, u);
      };
      u.addEventListener("click", v), u[e + "Trigger"] = v;
    }
  }
  function p(f) {
    for (const u of f) {
      if (u[e + "Trigger"]) continue;
      if (u.hasAttribute(r)) {
        u[e + "ScopeWarned"] || (u[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const S = u.method.toUpperCase(), A = u.action, h = new FormData(u);
        for (const _ of u.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        a(S, A, h, u, function() {
          for (const _ of u.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      u.addEventListener("submit", w), u[e + "Trigger"] = w;
    }
  }
  function o(f) {
    if (!f[e]) return;
    const u = d(f);
    for (const w of u.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of u.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete f[e];
  }
  function a(f, u, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: f, url: u }).defaultPrevented) return;
    k(v, "ln-ajax:start", { method: f, url: u }), v.classList.add("ln-ajax--loading");
    const h = document.createElement("span");
    h.className = "ln-ajax-spinner", v.appendChild(h);
    function _() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let c = u;
    const s = document.querySelector('meta[name="csrf-token"]'), m = s ? s.getAttribute("content") : null;
    w instanceof FormData && m && w.append("_token", m);
    const y = {
      method: f,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (m && (y.headers["X-CSRF-TOKEN"] = m), f === "GET" && w) {
      const T = new URLSearchParams(w);
      c = u + (u.includes("?") ? "&" : "?") + T.toString();
    } else f !== "GET" && w && (y.body = w);
    fetch(c, y).then(function(T) {
      const b = T.ok, E = T.status;
      return T.text().then(function(C) {
        let q = null, D = null;
        if (C && C.trim())
          try {
            q = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: b, status: E, data: q, parseError: D };
      });
    }).then(function(T) {
      const b = T.status, E = T.data, C = T.parseError;
      if (T.ok && !C) {
        if (E && E.title && (document.title = E.title), E && E.content)
          for (const q in E.content) {
            const D = document.getElementById(q);
            D && (D.innerHTML = E.content[q]);
          }
        if (v.tagName === "A") {
          const q = v.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else v.tagName === "FORM" && v.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", c);
        k(v, "ln-ajax:success", { method: f, url: c, data: E });
      } else
        k(v, "ln-ajax:error", {
          method: f,
          url: c,
          status: b,
          data: E,
          error: C || null
        });
      k(v, "ln-ajax:complete", { method: f, url: c }), _();
    }).catch(function(T) {
      k(v, "ln-ajax:error", { method: f, url: c, status: 0, data: null, error: T }), k(v, "ln-ajax:complete", { method: f, url: c }), _();
    });
  }
  function d(f) {
    const u = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(t) !== "false" ? u.links.push(f) : f.tagName === "FORM" && f.getAttribute(t) !== "false" ? u.forms.push(f) : (u.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), u.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), u;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(u) {
        for (const w of u)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (l(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  l(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = d(v);
                  g(A.links), p(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(u) {
        l(u);
      });
    }, "ln-ajax");
  }
  function i() {
    for (const f of document.querySelectorAll("[" + t + "]"))
      l(f);
  }
  window[e] = l, window[e].destroy = o, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
function jr(t, { isHydration: e = !1, hasPrimaryRegion: r = !1, primaryMatch: l = null } = {}) {
  const g = r ? !l : !t.some((n) => n.match), p = [], o = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const i = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !i && n.targetEl && p.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || o.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  o.sort((n, i) => n.regionKey === "__primary__" ? -1 : i.regionKey === "__primary__" ? 1 : 0);
  const d = o.find((n) => n.regionKey === "__primary__") || o[0] || null;
  return { notFound: g, clears: p, swaps: o, owner: d };
}
const Rn = {
  navigate: function(t) {
    zt(t, { historyAction: "push" });
  },
  replace: function(t) {
    zt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: Nn,
      query: Fn,
      route: Bn,
      regions: Mn
    };
  }
}, De = "data-ln-route", On = "lnRoute";
typeof window < "u" && (window.lnRouter = Rn);
function he(t) {
  Kn(t), zn(t), _t.size > 0 && Hn();
}
const Vr = {
  "data-ln-route": { effect: he },
  "data-ln-route-target": { effect: he },
  "data-ln-route-title": { effect: he },
  "data-ln-route-keep": {},
  "data-ln-router-hydrate": {}
}, _t = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new WeakMap();
let Mn = /* @__PURE__ */ new Map(), Ve = !1, ee = null, Nn = {}, Fn = {}, Bn = null, we = !1;
function We(t, e, r) {
  we ? queueMicrotask(function() {
    k(t, e, r);
  }) : k(t, e, r);
}
function ne(t) {
  try {
    const p = new URL(t, window.location.origin);
    t = p.pathname + p.search + p.hash;
  } catch {
  }
  let [e] = t.split("#"), [r, l] = e.split("?");
  const g = {};
  if (l) {
    const p = new URLSearchParams(l);
    for (const [o, a] of p.entries())
      g[o] = a;
  }
  return r = r.replace(/\/+$/, ""), r === "" && (r = "/"), { path: r, query: g };
}
function Pn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const r = t.segments, l = e.segments, g = Math.max(r.length, l.length);
  for (let p = 0; p < g; p++) {
    const o = r[p], a = l[p];
    if (o === void 0) return 1;
    if (a === void 0) return -1;
    if (o === "*") return 1;
    if (a === "*") return -1;
    const d = o.startsWith(":"), n = a.startsWith(":");
    if (d && !n) return 1;
    if (!d && n) return -1;
  }
  return 0;
}
function Un(t, e) {
  const r = t.split("/").filter(Boolean);
  for (const l of e) {
    if (l.pattern === "*")
      return {
        route: l,
        params: { wildcard: t }
      };
    const g = l.segments, p = {};
    let o = !0;
    if (!(r.length > g.length && g[g.length - 1] !== "*")) {
      for (let a = 0; a < g.length; a++) {
        const d = g[a], n = r[a];
        if (d === "*") {
          p.wildcard = r.slice(a).join("/");
          break;
        }
        if (n === void 0) {
          o = !1;
          break;
        }
        if (d.startsWith(":"))
          p[d.slice(1)] = decodeURIComponent(n);
        else if (d !== n) {
          o = !1;
          break;
        }
      }
      if (o && (g.indexOf("*") !== -1 || r.length <= g.length))
        return { route: l, params: p };
    }
  }
  return null;
}
function Ee(t, e = {}) {
  const r = e.warn !== !1;
  if (t !== "__primary__") {
    const g = document.getElementById(t);
    return !g && r && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), g;
  }
  const l = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !l && r && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), l;
}
function Ge(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), r = [t].concat(e);
  for (const g of r)
    for (const p of Object.keys(g))
      if (p.startsWith("ln") && g[p] && typeof g[p].destroy == "function")
        try {
          g[p].destroy();
        } catch (o) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, g, o);
        }
  const l = document.querySelectorAll('[data-ln-popover="open"]');
  for (const g of l) {
    const p = g.lnPopover;
    if (p && p.trigger && t.contains(p.trigger))
      try {
        p.destroy();
      } catch (o) {
        console.error("[ln-router] Error destroying open popover:", o);
      }
  }
}
function zt(t, e = {}) {
  const { path: r, query: l } = ne(t), g = /* @__PURE__ */ new Map();
  for (const [u, w] of _t)
    g.set(u, Un(r, w.sorted));
  const p = g.get("__primary__") || null, o = Ee("__primary__", { warn: !!p }), a = _t.has("__primary__"), d = [];
  for (const [u, w] of g) {
    const v = u === "__primary__" ? o : Ee(u, { warn: !1 }), S = !v && !!(p && p.route && p.route.templateNode && p.route.templateNode.content && p.route.templateNode.content.querySelector("#" + CSS.escape(u)));
    !v && !S && w && console.warn(`[ln-router] Explicit target element #${u} not found in DOM`), d.push({
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
  const n = jr(d, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: a,
    primaryMatch: p
  });
  if (n.notFound) {
    We(document.body, "ln-router:not-found", { path: r });
    return;
  }
  if (Z(o || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: p ? p.params : {},
    query: l
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const f = function() {
    for (const u of n.clears)
      Ge(u.targetEl), u.targetEl.replaceChildren(), fe.delete(u.targetEl);
    for (const u of n.swaps) {
      if ((u.isPending || !u.targetEl || !document.contains(u.targetEl)) && (u.targetEl = u.regionKey === "__primary__" ? o : document.getElementById(u.regionKey)), !u.targetEl) {
        console.warn(`[ln-router] Target element #${u.regionKey} could not be resolved`);
        continue;
      }
      if (u.skipMount || (Ge(u.targetEl), u.targetEl.replaceChildren(u.match.route.templateNode.content.cloneNode(!0))), fe.set(u.targetEl, u.match.route.templateNode), n.owner && u.regionKey === n.owner.regionKey) {
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
      We(u.targetEl, "ln-router:navigated", {
        path: t,
        params: u.match.params,
        query: l,
        route: u.match.route,
        target: u.targetEl,
        region: u.regionKey
      });
    }
    ee = t, Fn = l, Bn = p ? p.route : null, Nn = p ? p.params : {}, Mn = new Map(
      Array.from(g.entries()).map(([u, w]) => [u, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(f) : f();
}
function Wr(t) {
  const e = t.target.closest("a");
  if (!e || !vn(t, e)) return;
  const r = e.getAttribute("href"), { path: l } = ne(r);
  for (const g of _t.values())
    if (Un(l, g.sorted)) {
      t.preventDefault(), zt(r, { historyAction: "push" });
      return;
    }
}
function Gr(t, e) {
  const r = Object.keys(t), l = Object.keys(e);
  if (r.length !== l.length) return !1;
  for (let g = 0; g < r.length; g++) {
    const p = r[g];
    if (t[p] !== e[p]) return !1;
  }
  return !0;
}
function Qr() {
  const t = window.location.pathname + window.location.search, e = Rn.current();
  if (e && e.path != null) {
    const r = ne(t);
    if (ne(e.path).path === r.path && Gr(e.query, r.query))
      return;
  }
  zt(t, { historyAction: "skip" });
}
function Hn() {
  Ve || (Ve = !0, gt(function() {
    document.addEventListener("click", Wr), window.addEventListener("popstate", Qr), we = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    zt(t, { historyAction: "replace", isHydration: !0 }), we = !1;
  }, "ln-router"));
}
function zn(t) {
  const e = t.getAttribute(De);
  if (!e) return;
  const r = t.getAttribute("data-ln-route-target") || null;
  if (r === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const l = r || "__primary__";
  _t.has(l) || _t.set(l, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const g = _t.get(l);
  if (g.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${l}"`);
    return;
  }
  const p = t.getAttribute("data-ln-route-title"), o = e.split("/").filter(Boolean), a = {
    pattern: e,
    segments: o,
    target: r,
    title: p,
    templateNode: t
  }, d = Ee(l);
  d && d.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), g.routes.set(e, a), g.sorted = Array.from(g.routes.values()).sort(Pn);
}
function Kn(t) {
  const e = t.getAttribute(De);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null || "__primary__", g = _t.get(l);
  g && (g.routes.delete(e), g.sorted = Array.from(g.routes.values()).sort(Pn), g.routes.size === 0 && _t.delete(l));
}
function jn(t) {
  return this.dom = t, zn(t), this;
}
jn.prototype.destroy = function() {
  Kn(this.dom), delete this.dom[On];
};
j(De, On, jn, "ln-router", {
  attributes: Vr,
  onInit: function() {
    _t.size > 0 && Hn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-modal": { effect: g }
  };
  function l(p) {
    this.dom = p, this.isOpen = p.getAttribute(t) === "open";
    const o = this;
    return this._onRequestOpen = function() {
      o.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      o.dom.setAttribute(t, "close");
    }, this._onCancel = function(a) {
      a.preventDefault(), o.dom.setAttribute(t, "close");
    }, this._onClickClose = function(a) {
      const d = a.target.closest("[data-ln-modal-close]");
      d && o.dom.contains(d) && (a.preventDefault(), o.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  l.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, l.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, l.prototype.toggle = function() {
    const p = this.dom.getAttribute(t);
    this.dom.setAttribute(t, p === "open" ? "close" : "open");
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(a) {
            return a !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      k(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function g(p) {
    const o = p[e];
    if (!o) return;
    const d = p.getAttribute(t) === "open";
    if (d !== o.isOpen)
      if (d) {
        if (Z(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(t, "close");
          return;
        }
        o.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof p.showModal == "function" && p.showModal();
        const i = p.querySelector("[autofocus]");
        if (i && Ut(i))
          i.focus();
        else {
          const f = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(f, Ut);
          if (u) u.focus();
          else {
            const w = p.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, Ut);
            v && v.focus();
          }
        }
        k(p, "ln-modal:open", { modalId: p.id, target: p });
      } else {
        if (Z(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(t, "open");
          return;
        }
        o.isOpen = !1, k(p, "ln-modal:close", { modalId: p.id, target: p }), typeof p.close == "function" && p.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  j(t, e, l, "ln-modal", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", r = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-ui-coordinator": {},
    "data-ln-ui-coordinator-dict": {}
  };
  function g(h) {
    const _ = {};
    let c = h;
    const s = [];
    for (; c; ) {
      const m = c.closest("[" + t + "]");
      if (!m) break;
      m[e] && m[e].dict && s.unshift(m[e].dict), c = m.parentElement;
    }
    for (const m of s)
      Object.assign(_, m);
    return _;
  }
  function p(h, _) {
    if (_) {
      if (h) {
        const s = h.closest("[" + t + "]");
        if (s) {
          if (s.id === _ && s.hasAttribute("data-ln-modal")) return s;
          const m = s.querySelector("#" + CSS.escape(_) + '[data-ln-modal], [data-ln-modal="' + _ + '"]');
          if (m) return m;
        }
      }
      const c = document.getElementById(_) || document.querySelector('[data-ln-modal="' + _ + '"]');
      if (c) return c;
    }
    if (h) {
      const c = h.closest("[" + t + "]");
      if (c) {
        if (c.hasAttribute("data-ln-modal")) return c;
        const m = c.querySelector("[data-ln-modal]");
        if (m) return m;
      }
      const s = h.closest("[data-ln-modal]");
      if (s) return s;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function o(h, _) {
    if (h !== "edit") return "";
    if (_) {
      const c = _.getAttribute("data-ln-fill-id");
      if (c) return c;
    }
    return "edit";
  }
  function a(h) {
    if (!h) return;
    const _ = h.querySelectorAll("[data-ln-field]");
    for (let s = 0; s < _.length; s++)
      _[s].textContent = "";
    const c = h.querySelectorAll("form");
    for (let s = 0; s < c.length; s++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(c[s], null) : c[s].reset();
  }
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const _ = h.target.closest("[data-ln-modal-for]");
    if (_) {
      const s = _.getAttribute("data-ln-modal-for"), m = p(_, s);
      if (m && m.lnModal) {
        h.preventDefault();
        const y = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, b = _.dataset;
        for (const q in b) {
          if (!q.startsWith("lnModal") || y[q]) continue;
          const D = q.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = b[q]);
        }
        const E = Object.keys(T).length > 0;
        _.hasAttribute("data-ln-modal-mode") ? m.dataset.lnModalMode = _.getAttribute("data-ln-modal-mode") : m.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(m, T) : m.dataset.lnModalMode === "new" && a(m), m.getAttribute("data-ln-modal") === "open" ? k(m, "ln-modal:request-close", {}) : (m.id && dt(m.id, o(m.dataset.lnModalMode, _)), k(m, "ln-modal:request-open", {}));
      }
      return;
    }
    const c = h.target.closest('a[href^="#"]');
    if (c) {
      const s = se(c.getAttribute("href"));
      for (const m in s) {
        const y = document.getElementById(m);
        if (y && y.lnModal) {
          if (!xe(h)) return;
          dt(m, s[m]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(h) {
    const _ = h.target;
    if (!_ || !_.lnModal) return;
    (_.dataset.lnModalMode || "new") === "new" && a(_);
  }), document.addEventListener("ln-modal:open", function(h) {
    const _ = h.target;
    if (!_ || !_.lnModal || !_.id) return;
    let c = ot(_.id);
    c === null && (c = o(_.dataset.lnModalMode, null), dt(_.id, c)), c ? (_.dataset.lnModalMode = "edit", k(_, "ln-fill:request", { id: c })) : (_.dataset.lnModalMode = "new", a(_));
  });
  let d = !1;
  function n() {
    if (!d) {
      d = !0;
      try {
        const h = document.querySelectorAll("[data-ln-modal][id]");
        for (let _ = 0; _ < h.length; _++) {
          const c = h[_];
          if (!c.lnModal) continue;
          const s = c.id, m = ot(s), y = m !== null, T = c.lnModal.isOpen;
          if (y) {
            const b = m ? "edit" : "new";
            c.dataset.lnModalMode = b, T ? m ? k(c, "ln-fill:request", { id: m }) : a(c) : k(c, "ln-modal:request-open", {});
          } else T && k(c, "ln-modal:request-close", {});
        }
      } finally {
        d = !1;
      }
    }
  }
  function i() {
    const h = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let _ = 0; _ < h.length; _++) {
      const c = h[_];
      c.lnModal && ot(c.id) === null && dt(c.id, o(c.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function f() {
    i(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(f);
  }) : mt(f);
  function u(h) {
    const c = (h.detail || {}).data;
    if (c && c.message) {
      const m = c.message;
      k(window, "ln-toast:enqueue", {
        type: m.type || "success",
        title: m.title || "",
        message: m.body || ""
      });
    }
    const s = h.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && dt(s.id, null), k(s, "ln-modal:request-close", {}), a(s));
  }
  function w(h) {
    const _ = h.detail || {}, c = _.data, s = _.status || 0, m = g(h.target);
    if (c && c.message) {
      const y = c.message;
      k(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else s === 0 ? k(window, "ln-toast:enqueue", {
      type: "error",
      title: m["network-error-title"] || "",
      message: m["network-error"] || "Network error"
    }) : k(window, "ln-toast:enqueue", {
      type: "error",
      title: m["server-error-title"] || "",
      message: m["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", u), document.addEventListener("ln-ajax:error", w);
  function v(h) {
    const _ = h.detail || {}, c = g(h.target), s = _.message || (_.reason === "max-size" ? c["upload-max-size"] || "File is too large" : _.reason === "max-files" ? c["upload-max-files"] || "Maximum file count exceeded" : c["upload-invalid-type"] || "This file type is not allowed"), m = c["upload-invalid-title"] || "Invalid File";
    k(window, "ln-toast:enqueue", {
      type: "error",
      title: m,
      message: s
    });
  }
  function S(h) {
    const _ = h.detail || {}, c = g(h.target), s = _.message || c["upload-failed"] || "Failed to upload file", m = c["upload-error-title"] || "Upload Error";
    k(window, "ln-toast:enqueue", {
      type: "error",
      title: m,
      message: s
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(h) {
    const _ = h.target;
    !_ || !_.lnModal || (_.id && ot(_.id) !== null && dt(_.id, null), _.dataset.lnModalMode === "new" && a(_));
  });
  function A(h) {
    return this.dom = h, this.dict = re(h, r), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: l
  });
})();
function $r(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let r = e, l = 0;
  for (let g = 0; g < t.length && r > 0; g++)
    l = g + 1, /[0-9]/.test(t[g]) && r--;
  return r > 0 && (l = t.length), l;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function r(o) {
    const a = o[e];
    a && (a.isTextElement ? a._initTextElement() : isNaN(a.value) || a._displayFormatted(a.value));
  }
  const l = {
    "data-ln-number": { effect: r },
    "data-ln-value": { effect: r },
    "data-ln-number-decimals": { effect: r },
    "data-ln-number-min": { effect: r },
    "data-ln-number-max": { effect: r }
  }, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(o) {
    if (o[e]) return o[e];
    o[e] = this, this.dom = o;
    const a = this;
    if (this._onLocaleChange = function() {
      a.isTextElement ? a._formatTextContent() : isNaN(a.value) || a._displayFormatted(a.value);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", d), this._hidden = d, Object.defineProperty(d, "value", {
      get: function() {
        return g.get.call(d);
      },
      set: function(i) {
        if (g.set.call(d, i), i !== "" && !isNaN(parseFloat(i))) {
          const f = a.dom.getAttribute("data-ln-number-decimals");
          a._setDisplayRaw(ct(parseFloat(i), rt(a.dom), { maxDecimals: f }));
        } else
          a._setDisplayRaw("");
        a.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), pn(o, g, {
      get: function() {
        return g.get.call(o);
      },
      set: function(i) {
        if (i === "") {
          a._setDisplayRaw(""), a._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const f = typeof i == "number" ? i : parseFloat(String(i));
        if (isNaN(f))
          a._setDisplayRaw(String(i)), a._setHiddenRaw("");
        else {
          a._setHiddenRaw(f);
          const u = o.getAttribute("data-ln-number-decimals");
          a._setDisplayRaw(ct(f, rt(o), { maxDecimals: u }));
        }
        o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      a._handleInput();
    }, o.addEventListener("input", this._onInput), this._onKeyDown = function(i) {
      if (i.key !== "Backspace") return;
      const f = o.selectionStart, u = o.selectionEnd;
      if (f !== u || f === 0) return;
      const w = te(rt(o)), v = g.get.call(o), S = v[f - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        i.preventDefault();
        const A = f - 2 >= 0 ? f - 2 : 0, h = v.slice(0, A) + v.slice(f);
        g.set.call(o, h), o.setSelectionRange(A, A), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, o.addEventListener("keydown", this._onKeyDown), this._onPaste = function(i) {
      i.preventDefault();
      const f = (i.clipboardData || window.clipboardData).getData("text"), u = Nr(f, rt(o));
      a.value = isNaN(u) ? NaN : u;
    }, o.addEventListener("paste", this._onPaste);
    const n = o.value;
    if (n !== "") {
      const i = parseFloat(n);
      if (!isNaN(i)) {
        const f = o.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(i), this._setDisplayRaw(ct(i, rt(o), { maxDecimals: f })), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  p.prototype._initTextElement = function() {
    const o = this.dom;
    let a = o.getAttribute("data-ln-value"), d = o.getAttribute("data-ln-number"), n = null;
    a !== null && a !== "" ? n = a : d !== null && d !== "" && d !== "true" ? n = d : n = o.textContent.trim();
    const i = parseFloat(n);
    isNaN(i) ? this._rawValue = null : (this._rawValue = i, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(i)), this._formatTextContent());
  }, p.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, rt(this.dom), { maxDecimals: o });
    }
  }, p.prototype._handleInput = function() {
    const o = this.dom, a = g.get.call(o);
    if (a === "") {
      this._setHiddenRaw(""), k(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (a === "-") {
      this._setHiddenRaw(""), k(o, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const d = o.selectionStart;
    let n = 0;
    for (let m = 0; m < d; m++)
      /[0-9]/.test(a[m]) && n++;
    const i = rt(o), f = te(i);
    let u = a, w = xn(a, f.groupSep, f.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), k(o, "ln-number:input", { value: NaN, formatted: a });
      return;
    }
    const S = o.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const m = parseInt(S, 10), y = w.slice(A + 1);
      if (m === 0)
        w = w.slice(0, A), u = u.split(f.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(u);
      else if (y.length > m) {
        w = w.slice(0, A + 1 + m);
        const T = u.split(f.decimalSep);
        u = T[0] + f.decimalSep + T[1].slice(0, m), v = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const h = o.getAttribute("data-ln-number-max");
    if (h !== null && v > parseFloat(h)) {
      const m = parseFloat(h), y = ct(m, i, { maxDecimals: S });
      this._setDisplayRaw(y), this._setHiddenRaw(m), o.setSelectionRange(y.length, y.length), k(o, "ln-number:input", { value: m, formatted: y });
      return;
    }
    if (u.endsWith(f.decimalSep) || f.decimalSep !== "." && u.endsWith(".")) {
      this._setHiddenRaw(v), k(o, "ln-number:input", { value: v, formatted: u });
      return;
    }
    const _ = w.indexOf(".");
    if (_ !== -1 && w.slice(_ + 1).endsWith("0")) {
      this._setHiddenRaw(v), k(o, "ln-number:input", { value: v, formatted: u });
      return;
    }
    let c;
    if (S !== null)
      c = ct(v, i, { maxDecimals: S });
    else {
      const m = _ !== -1 ? w.slice(_ + 1).length : 0;
      c = ct(v, i, { userDecimals: m });
    }
    this._setDisplayRaw(c);
    const s = $r(c, n);
    o.setSelectionRange(s, s), this._setHiddenRaw(v), k(o, "ln-number:input", { value: v, formatted: c });
  }, p.prototype._setHiddenRaw = function(o) {
    this._hidden && g.set.call(this._hidden, String(o));
  }, p.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : g.set.call(this.dom, String(o));
  }, p.prototype._displayFormatted = function(o) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const a = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(o, rt(this.dom), { maxDecimals: a }));
    }
  }, Object.defineProperty(p.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = g.get.call(this._hidden);
      return o === "" ? NaN : parseFloat(o);
    },
    set: function(o) {
      const a = typeof o == "number" ? o : parseFloat(o);
      if (this.isTextElement) {
        isNaN(a) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = a, this.dom.setAttribute("data-ln-value", String(a)), this._formatTextContent());
        return;
      }
      if (isNaN(a)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(a);
      const d = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(a, rt(this.dom), { maxDecimals: d })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(p.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : g.get.call(this.dom);
    }
  }), p.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), k(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, p, "ln-number", {
    attributes: l,
    extraAttributes: ["lang"],
    onAttributeChange: r
  });
})();
const Ae = /^(short|medium|long)(\s+datetime)?$/, Xr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Yr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ae) ? Xr[t.trim()] : null;
}
function Wt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let r, l;
  if (e.indexOf(".") !== -1)
    r = ".", l = e.split(".");
  else if (e.indexOf("/") !== -1)
    r = "/", l = e.split("/");
  else if (e.indexOf("-") !== -1)
    r = "-", l = e.split("-");
  else
    return null;
  if (l.length !== 3) return null;
  const g = [];
  for (let n = 0; n < 3; n++) {
    const i = parseInt(l[n], 10);
    if (isNaN(i)) return null;
    g.push(i);
  }
  let p, o, a;
  r === "." ? (p = g[0], o = g[1], a = g[2]) : r === "/" ? (o = g[0], p = g[1], a = g[2]) : l[0].length === 4 ? (a = g[0], o = g[1], p = g[2]) : (p = g[0], o = g[1], a = g[2]), a < 100 && (a += a < 50 ? 2e3 : 1900);
  const d = new Date(a, o - 1, p);
  return d.getFullYear() !== a || d.getMonth() !== o - 1 || d.getDate() !== p ? null : d;
}
function pe(t, e, r, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const g = t.getDate(), p = t.getMonth(), o = t.getFullYear(), a = t.getHours(), d = t.getMinutes();
  let n, i;
  const f = (r || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const S = new Intl.DateTimeFormat(r, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(l && S !== f);
  } catch {
    u = !!l;
  }
  if (u && l && l.monthsLong)
    n = l.monthsLong[p];
  else
    try {
      n = new Intl.DateTimeFormat(r, { month: "long" }).format(t);
    } catch {
      n = String(p + 1);
    }
  if (u && l && l.monthsShort)
    i = l.monthsShort[p];
  else
    try {
      i = new Intl.DateTimeFormat(r, { month: "short" }).format(t);
    } catch {
      i = String(p + 1);
    }
  const w = {
    yyyy: String(o),
    yy: String(o).slice(-2),
    MMMM: n,
    MMM: i,
    MM: String(p + 1).padStart(2, "0"),
    M: String(p + 1),
    dd: String(g).padStart(2, "0"),
    d: String(g),
    HH: String(a).padStart(2, "0"),
    mm: String(d).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, r, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const g = Yr(e);
  if (g)
    try {
      const p = new Intl.DateTimeFormat(r, g), o = (r || "").toLowerCase().split("-")[0], a = p.resolvedOptions().locale.toLowerCase().split("-")[0];
      return l && a !== o ? pe(t, "dd.MM.yyyy", r, l) : p.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", r, l);
    }
  return pe(t, e || "dd.MM.yyyy", r, l);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function r(n) {
    const i = n[e];
    if (i) {
      if (i.isTextElement)
        i._initTextElement();
      else if (i.value) {
        const f = st(i.value);
        f && i._displayFormatted(f);
      }
    }
  }
  const l = {
    "data-ln-date": { effect: r },
    "data-ln-date-format": { effect: r },
    "data-ln-date-locale": { effect: r },
    "data-ln-value": { effect: r },
    "data-ln-date-dict": {},
    "data-ln-date-dict-key": {},
    "data-ln-date-field": {},
    "data-ln-date-label": {}
  }, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(n, i, f) {
    k(n.dom, "ln-date:change", {
      value: i,
      formatted: n.dom.value,
      date: f
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function o(n, i, f, u) {
    n._setHiddenRaw(i), g.set.call(n._picker, i), n._lastISO = i, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : f && n._displayFormatted(f), p(n, i, f);
  }
  function a(n) {
    n._setHiddenRaw(""), g.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", p(n, "", null);
  }
  function d(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const i = this;
    if (this._onLocaleChange = function() {
      if (i.isTextElement)
        i._formatTextContent();
      else if (i.value) {
        const _ = st(i.value);
        _ && i._displayFormatted(_);
      }
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const f = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const _ = w.querySelectorAll("[data-ln-date-dict]");
      for (let c = 0; c < _.length; c++) {
        const s = _[c].getAttribute("data-ln-date-dict");
        if (s) {
          const m = re(_[c], "data-ln-date-dict-key");
          m["months-long"] && (m.monthsLong = m["months-long"].split(",").map((y) => y.trim())), m["months-short"] && (m.monthsShort = m["months-short"].split(",").map((y) => y.trim())), qe(s, m);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const S = document.createElement("input");
    S.type = "hidden", S.name = u, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && S.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", S), this._hidden = S;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", S.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const h = document.createElement("button");
    if (h.type = "button", h.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), h.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", h), this._btn = h, this._lastISO = "", Object.defineProperty(S, "value", {
      get: function() {
        return g.get.call(S);
      },
      set: function(_) {
        if (g.set.call(S, _), _ && _ !== "") {
          const c = st(_);
          c && o(i, _, c);
        } else _ === "" && a(i);
      }
    }), pn(n, g, {
      get: function() {
        return g.get.call(n);
      },
      set: function(_, c) {
        if (i._isFormatting) {
          c(_);
          return;
        }
        if (!_ || _ === "") {
          c(""), a(i);
          return;
        }
        const s = st(_) || Wt(_);
        if (s) {
          const m = Nt(s), y = n.getAttribute(t) || "", T = rt(n), b = kt(T), E = Gt(s, y, T, b);
          c(E), o(i, m, s, E);
        } else
          c(String(_)), a(i);
      }
    }), this._onPickerChange = function() {
      const _ = A.value;
      if (_) {
        const c = st(_);
        c && o(i, _, c);
      } else
        a(i);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const _ = i.dom.value.trim();
      if (_ === "") {
        i._lastISO !== "" && a(i);
        return;
      }
      if (i._lastISO) {
        const s = st(i._lastISO);
        if (s) {
          const m = i.dom.getAttribute(t) || "", y = rt(i.dom), T = kt(y);
          if (_ === Gt(s, m, y, T)) return;
        }
      }
      const c = Wt(_);
      if (c) {
        const s = Nt(c);
        o(i, s, c);
      } else if (i._lastISO) {
        const s = st(i._lastISO);
        s && i._displayFormatted(s);
      } else
        i.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      i._openPicker();
    }, h.addEventListener("click", this._onBtnClick), f && f !== "") {
      const _ = st(f);
      _ && o(i, f, _);
    }
    return this;
  }
  d.prototype._initTextElement = function() {
    const n = this.dom, i = n.getAttribute("data-ln-value"), f = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    i !== null && i !== "" ? w = i : u !== null && u !== "" ? w = u : f !== null && f !== "" && f !== "true" && !Ae.test(f) ? w = f : w = n.textContent.trim();
    const v = st(w) || Wt(w);
    if (v && !isNaN(v.getTime())) {
      const S = Nt(v);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, d.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = st(this._rawValue);
      if (n) {
        let f = this.dom.getAttribute("data-ln-date-format");
        if (!f) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Ae.test(v) && (f = v);
        }
        const u = rt(this.dom), w = kt(u);
        this.dom.textContent = Gt(n, f || "medium", u, w);
      }
    }
  }, d.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, d.prototype._setHiddenRaw = function(n) {
    g.set.call(this._hidden, n);
  }, d.prototype._displayFormatted = function(n) {
    const i = this.dom.getAttribute(t) || "", f = rt(this.dom), u = kt(f);
    this._isFormatting = !0, this.dom.value = Gt(n, i, f, u), this._isFormatting = !1;
  }, Object.defineProperty(d.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : g.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const f = st(n) || Wt(n);
        if (!f) return;
        const u = Nt(f);
        this._rawValue = u, this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        a(this);
        return;
      }
      const i = st(n);
      i && o(this, n, i);
    }
  }), Object.defineProperty(d.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? st(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = Nt(n);
    }
  }), Object.defineProperty(d.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      k(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), k(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, d, "ln-date", {
    attributes: l,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: r
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-nav": { effect: o },
    "data-ln-nav-exact": { prop: "exact", read: Kt, effect: o }
  }, l = et(r);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const a = history.pushState;
    history.pushState = function() {
      a.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const d = history.replaceState;
    history.replaceState = function() {
      d.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function g(a) {
    return this.dom = a, tt(this, a, l), this.activeClass = a.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(a, { childList: !0, subtree: !0 }), this.update(), this;
  }
  g.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const d = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, i = p(n), f = [];
    for (const u of d) {
      const w = u.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const v = p(w), S = v === i, A = !this.exact && v !== "/" && i.startsWith(v + "/");
      S || A ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), f.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: f });
  }, g.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const a = history._lnNavCallbacks.indexOf(this.updateHandler);
    a !== -1 && history._lnNavCallbacks.splice(a, 1), k(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function p(a) {
    try {
      return new URL(a, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return a.replace(/\/$/, "") || "/";
    }
  }
  function o(a, d) {
    const n = a[e];
    if (n) {
      if (d === t) {
        if (!a.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const i = n.activeClass, f = a.getAttribute(t) || "active";
        if (i !== f) {
          const u = a.querySelectorAll("a");
          for (const w of u)
            i && w.classList.remove(i);
          n.activeClass = f;
        }
      }
      n.update();
    }
  }
  j(t, e, g, "ln-nav", {
    attributes: r
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(o, a) {
    const d = o.getAttribute("data-ln-persist"), n = d !== null && d !== "" ? d : o.id;
    return n ? o.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + a : "ln:" + n + ":" + a : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', o), null);
  }
  let r = null;
  function l() {
    if (r !== null) return r;
    try {
      if (typeof localStorage > "u") return r = !1;
      const o = "__ln_persist_test__";
      return localStorage.setItem(o, o), localStorage.removeItem(o), r = !0;
    } catch {
      return r = !1;
    }
  }
  const g = /* @__PURE__ */ new Set();
  function p(o, a) {
    const d = window.lnCore && window.lnCore._attrRegistry, n = d && d.persist || [];
    let i = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === a) {
        i = n[v];
        break;
      }
    if (!i) return;
    const f = i.persist;
    if (g.has(f.attr) || (g.add(f.attr), Vt([f.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || f.hashActive && f.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !l()) return;
      const h = v.getAttribute(S);
      try {
        h === null ? localStorage.removeItem(A) : localStorage.setItem(A, h);
      } catch {
      }
    })), f.hashActive && f.hashActive(o)) return;
    const u = e(o, f.attr);
    if (!u || !l()) return;
    const w = localStorage.getItem(u);
    w !== null && o.setAttribute(f.attr, w);
  }
  yr(p);
})();
function Qe(t, e, r, l) {
  const g = (t || "").toLowerCase().trim();
  if (g) return g;
  if ((e || "").toUpperCase() !== "A") return "";
  const p = r || "";
  if (!p.startsWith("#")) return "";
  const o = p.slice(1);
  if (!o) return "";
  const a = o.split("&"), d = (l || "").toLowerCase().trim();
  if (d)
    for (const f of a) {
      const u = f.indexOf(":");
      if (u > 0 && f.slice(0, u).toLowerCase().trim() === d)
        return f.slice(u + 1).toLowerCase().trim();
    }
  const n = a[a.length - 1] || "", i = n.indexOf(":");
  return (i > 0 ? n.slice(i + 1) : n).toLowerCase().trim();
}
function $e(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const r = t.filter(
    (p) => (p.tagName || "").toUpperCase() === "A" && (p.href || "").startsWith("#")
  ), l = r.length > 0 && r.length === t.length, g = (e || "").toLowerCase().trim();
  return r.length > 0 && r.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : l && !g ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: l && !!g,
    warning: null
  };
}
function Xe(t, e, r) {
  const l = (t || "").toLowerCase().trim();
  return l && Array.isArray(e) && e.includes(l) ? l : (r || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function r(n) {
    const i = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(i);
  }
  function l(n, i) {
    return (n.getAttribute(i) || n.id || "").toLowerCase().trim();
  }
  function g(n, i) {
    return (n.getAttribute(i) || "true").toLowerCase() !== "false";
  }
  const p = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: r },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": { prop: "autoFocus", read: g },
    "data-ln-tabs-key": { prop: "nsKey", read: l },
    "data-ln-tab": {}
  }, o = et(p);
  function a(n) {
    return this.dom = n, tt(this, n, o), this.activeKey = null, d.call(this), this;
  }
  function d() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.map((u) => ({
      tagName: u.tagName,
      href: u.getAttribute("href")
    })), i = $e(n, this.nsKey);
    this.hashEnabled = i.hashEnabled, i.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : i.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const w = Qe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
      w ? this.mapTabs[w] = u : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', u);
    }
    for (const u of this.panels) {
      const w = (u.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      w && (this.mapPanels[w] = u);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const f = this;
    this._clickHandlers = [];
    for (const u of this.tabs) {
      if (u[e + "Trigger"]) continue;
      const w = function(v) {
        const S = u.tagName === "A";
        if (!S && (v.ctrlKey || v.metaKey || v.button === 1)) return;
        const A = Qe(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), f.nsKey);
        A && (S && !xe(v) || (f.hashEnabled ? ot(f.nsKey) === A ? f.dom.setAttribute("data-ln-tabs-active", A) : dt(f.nsKey, A) : f.dom.setAttribute("data-ln-tabs-active", A)));
      };
      u.addEventListener("click", w), u[e + "Trigger"] = w, f._clickHandlers.push({ el: u, handler: w });
    }
    if (this._onRequestSelect = function(u) {
      const w = u.detail && (u.detail.key || u.detail.tab);
      w && f.select(w);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!f.hashEnabled) return;
      const u = ot(f.nsKey);
      f.dom.setAttribute("data-ln-tabs-active", u !== null ? u : f.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const u = Xe(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  a.prototype.select = function(n) {
    const i = (n + "").toLowerCase().trim();
    i && (this.hashEnabled ? ot(this.nsKey) === i ? this.dom.setAttribute("data-ln-tabs-active", i) : dt(this.nsKey, i) : this.dom.setAttribute("data-ln-tabs-active", i));
  }, a.prototype._applyActive = function(n) {
    var f;
    if (n = Xe(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
    const i = this.activeKey;
    if (i !== null && Z(this.dom, "ln-tabs:before-change", {
      key: n,
      previousKey: i,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    }).defaultPrevented) {
      i in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", i), this.hashEnabled && ot(this.nsKey) !== i && dt(this.nsKey, i));
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
      const u = (f = this.mapPanels[n]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      u && setTimeout(() => u.focus({ preventScroll: !0 }), 0);
    }
    k(this.dom, "ln-tabs:change", {
      key: n,
      previousKey: i,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    });
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: n, handler: i } of this._clickHandlers)
        n.removeEventListener("click", i), delete n[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), k(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, a, "ln-tabs", {
    attributes: p,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(n) {
        const i = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(u) {
          return { tagName: u.tagName, href: u.getAttribute("href") };
        }), f = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return $e(i, f).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", r = "data-ln-toggle-for", l = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-toggle": { effect: u },
    "data-ln-toggle-for": {},
    "data-ln-toggle-action": {}
  }, p = /* @__PURE__ */ new Set();
  let o = null;
  function a(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function d() {
    o || (o = function(w) {
      if (dn(w)) return;
      const v = w.target.closest("[" + r + "]");
      if (!v || un(v)) return;
      const S = v.getAttribute(r);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const h = v.getAttribute(l) || "toggle", _ = A.getAttribute(t);
      A.setAttribute(t, a(_, h));
    }, document.addEventListener("click", o));
  }
  function n() {
    p.size > 0 || !o || (document.removeEventListener("click", o), o = null);
  }
  function i(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + r + '="' + w.id + '"]'
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
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), i(w, this.isOpen), p.add(this), d(), this;
  }
  f.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, f.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, f.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, a(w, "toggle"));
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.delete(this), delete this.dom[e], n(), k(this.dom, "ln-toggle:destroyed", { target: this.dom }));
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
        v.isOpen = !0, w.classList.add("open"), i(w, !0), k(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), i(w, !1), k(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, f, "ln-toggle", {
    attributes: g,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-accordion": {}
  };
  function l(g) {
    return this.dom = g, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== g) return;
      const o = g.querySelectorAll("[data-ln-toggle]");
      for (const a of o)
        a !== p.detail.target && a.closest("[data-ln-accordion]") === g && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      k(g, "ln-accordion:change", { target: p.detail.target });
    }, g.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), k(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, l, "ln-accordion", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", r = "bottom-end";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-dropdown": {},
    "data-ln-dropdown-position": { prop: "position", read: Q, fallback: r },
    "data-ln-dropdown-placement": {},
    "data-ln-dropdown-menu": {}
  }, g = et(l);
  function p(o) {
    this.dom = o, tt(this, o, g), this.toggleEl = o.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = o.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const a = this;
    return this._onRequestOpen = function() {
      a.toggleEl && a.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      a.toggleEl && a.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (a.toggleEl) {
        const d = a.toggleEl.getAttribute("data-ln-toggle");
        a.toggleEl.setAttribute("data-ln-toggle", d === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(d) {
      const n = a.toggleEl && a.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (d.key === "Escape") {
        n && (d.preventDefault(), d.stopPropagation(), a.toggleEl.setAttribute("data-ln-toggle", "close"), a.triggerBtn && a.triggerBtn.focus());
        return;
      }
      if (d.key === "Tab") {
        n && (a.triggerBtn && a.triggerBtn.focus(), a.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const i = a._getMenuItems();
      if (i.length === 0) return;
      if (!n && (d.key === "ArrowDown" || d.key === "ArrowUp")) {
        d.preventDefault(), a.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = a._getMenuItems();
          u.length > 0 && a._focusItem(u, d.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const f = i.indexOf(document.activeElement);
      if (d.key === "ArrowDown") {
        d.preventDefault();
        const u = f < i.length - 1 ? f + 1 : 0;
        a._focusItem(i, u);
      } else if (d.key === "ArrowUp") {
        d.preventDefault();
        const u = f > 0 ? f - 1 : i.length - 1;
        a._focusItem(i, u);
      } else d.key === "Home" ? (d.preventDefault(), a._focusItem(i, 0)) : d.key === "End" && (d.preventDefault(), a._focusItem(i, i.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(d) {
      !d.detail || d.detail.target !== a.toggleEl || (a.triggerBtn && a.triggerBtn.setAttribute("aria-expanded", "true"), typeof a.toggleEl.showPopover == "function" && a.toggleEl.showPopover(), a._initMenuAria(), a._reposition(), a._addOutsideClickListener(), a._addScrollRepositionListener(), a._addResizeCloseListener(), k(o, "ln-dropdown:open", { target: d.detail.target }));
    }, this._onToggleClose = function(d) {
      !d.detail || d.detail.target !== a.toggleEl || (a.triggerBtn && a.triggerBtn.setAttribute("aria-expanded", "false"), a._removeOutsideClickListener(), a._removeScrollRepositionListener(), a._removeResizeCloseListener(), a.toggleEl.style.top = "", a.toggleEl.style.left = "", a.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof a.toggleEl.hidePopover == "function" && a.toggleEl.matches(":popover-open") && a.toggleEl.hidePopover(), k(o, "ln-dropdown:close", { target: d.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  p.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const o = this.toggleEl.querySelectorAll("li");
    for (const d of o)
      d.setAttribute("role", "none");
    const a = this._getMenuItems();
    for (let d = 0; d < a.length; d++)
      a[d].setAttribute("role", "menuitem"), a[d].setAttribute("tabindex", d === 0 ? "0" : "-1");
  }, p.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, p.prototype._focusItem = function(o, a) {
    for (let d = 0; d < o.length; d++)
      o[d].setAttribute("tabindex", d === a ? "0" : "-1");
    o[a] && o[a].focus();
  }, p.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const o = this.triggerBtn.getBoundingClientRect(), a = ye(this.toggleEl), d = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || r, i = Zt(o, a, n, d);
    this.toggleEl.style.top = i.top + "px", this.toggleEl.style.left = i.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", i.placement);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const o = this;
    this._boundDocClick = function(a) {
      o.dom.contains(a.target) || o.toggleEl && o.toggleEl.contains(a.target) || o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open" && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, o._docClickTimeout = setTimeout(function() {
      o._docClickTimeout = null, document.addEventListener("click", o._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const o = this;
    this._boundScrollReposition = function() {
      o._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const o = this;
    this._boundResizeClose = function() {
      o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open" && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, p.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), k(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, p, "ln-dropdown", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", r = "data-ln-popover-for", l = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-popover": { effect: f },
    "data-ln-popover-for": {},
    "data-ln-popover-position": {},
    "data-ln-popover-placement": {}
  }, p = [];
  let o = null;
  function a() {
    o || (o = function(u) {
      if (u.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", o));
  }
  function d() {
    p.length > 0 || o && (document.removeEventListener("keydown", o), o = null);
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
    const w = ye(this.dom);
    if (this.trigger) {
      const h = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(l) || "bottom", c = Zt(h, w, _, 8);
      this.dom.style.top = c.top + "px", this.dom.style.left = c.left + "px", this.dom.setAttribute("data-ln-popover-placement", c.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, Ut);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(h) {
      A.dom.contains(h.target) || A.trigger && A.trigger.contains(h.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const h = A.trigger.getBoundingClientRect(), _ = ye(A.dom), c = A.dom.getAttribute(l) || "bottom", s = Zt(h, _, c, 8);
      A.dom.style.top = s.top + "px", A.dom.style.left = s.left + "px", A.dom.setAttribute("data-ln-popover-placement", s.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), a(), k(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = p.indexOf(this);
    u !== -1 && p.splice(u, 1), d(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, k(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], k(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function i(u) {
    this.dom = u;
    const w = u.getAttribute(r);
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
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function f(u) {
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
    attributes: g
  }), j(r, e + "Trigger", i);
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", r = "data-ln-tooltip-position", l = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[l] !== void 0) return;
  const p = {
    "data-ln-tooltip-enhance": {},
    "data-ln-tooltip-enhanced": {},
    "data-ln-tooltip": {},
    "data-ln-tooltip-position": {},
    "data-ln-tooltip-placement": {}
  };
  let o = 0, a = null, d = null, n = null, i = null, f = null, u = null;
  function w() {
    return a && a.parentNode || (a = document.getElementById(g), a || (a = document.createElement("div"), a.id = g, document.body.appendChild(a)), a.hasAttribute("popover") || a.setAttribute("popover", "manual")), a;
  }
  function v() {
    u || (u = function(c) {
      c.key === "Escape" && h();
    }, document.addEventListener("keydown", u));
  }
  function S() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function A(c) {
    if (n === c) return;
    h();
    const s = c.getAttribute(e) || c.getAttribute("title");
    if (!s) return;
    w(), typeof a.showPopover == "function" && a.showPopover(), c.hasAttribute("title") && (i = c.getAttribute("title"), c.removeAttribute("title"));
    const m = c.getAttribute("aria-describedby");
    m ? f = m : f = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = s, c[l + "Uid"] || (o += 1, c[l + "Uid"] = "ln-tooltip-" + o), y.id = c[l + "Uid"], a.appendChild(y);
    const T = y.offsetWidth, b = y.offsetHeight, E = c.getBoundingClientRect(), C = c.getAttribute(r) || "top", q = Zt(E, { width: T, height: b }, C, 6);
    y.style.top = q.top + "px", y.style.left = q.left + "px", y.setAttribute("data-ln-tooltip-placement", q.placement), f ? c.setAttribute("aria-describedby", f + " " + y.id) : c.setAttribute("aria-describedby", y.id), d = y, n = c, v();
  }
  function h() {
    if (!d) {
      S();
      return;
    }
    n && (f !== null ? n.setAttribute("aria-describedby", f) : n.removeAttribute("aria-describedby"), f = null, i !== null && n.setAttribute("title", i)), i = null, d.parentNode && d.parentNode.removeChild(d), d = null, n = null, a && typeof a.hidePopover == "function" && a.matches(":popover-open") && a.hidePopover(), S();
  }
  function _(c) {
    return this.dom = c, c.hasAttribute("data-ln-tooltip-enhanced") || (c.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(c);
    }, this._onLeave = function() {
      n === c && !c.contains(document.activeElement) && h();
    }, this._onFocus = function() {
      A(c);
    }, this._onBlur = function() {
      n === c && !c.matches(":hover") && h();
    }, c.addEventListener("mouseenter", this._onEnter), c.addEventListener("mouseleave", this._onLeave), c.addEventListener("focus", this._onFocus, !0), c.addEventListener("blur", this._onBlur, !0), this;
  }
  _.prototype.destroy = function() {
    const c = this.dom;
    c.removeEventListener("mouseenter", this._onEnter), c.removeEventListener("mouseleave", this._onLeave), c.removeEventListener("focus", this._onFocus, !0), c.removeEventListener("blur", this._onBlur, !0), n === c && h(), this._addedEnhancedAttr && c.removeAttribute("data-ln-tooltip-enhanced"), delete c[l], delete c[l + "Uid"], k(c, "ln-tooltip:destroyed", { trigger: c });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    l,
    _,
    "ln-tooltip",
    {
      attributes: p
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", r = "ln-toast-item";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-toast": {},
    "data-ln-toast-timeout": { prop: "timeoutDefault", read: It, fallback: 6e3 },
    "data-ln-toast-max": { prop: "max", read: It, fallback: 5 },
    "data-ln-toast-close": {},
    "data-ln-toast-item": {}
  }, g = et(l);
  function p(A) {
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
  function o(A) {
    if (!A || !(A instanceof HTMLElement)) return;
    if (A.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof A.hidePopover == "function" && A.matches(":popover-open"))
      try {
        A.hidePopover();
      } catch {
      }
  }
  function a(A) {
    this.dom = A, tt(this, A, g);
    const h = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; h.length > this.max; ) A.removeChild(h.shift());
    for (const _ of h) w(_, this);
    return h.length > 0 && p(A), this;
  }
  a.prototype.enqueue = function(A) {
    if (!A) return;
    const h = d(A, this.dom);
    if (!h) return;
    const _ = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    i(this, h), _ > 0 && (h._timer = setTimeout(() => f(h), _));
  }, a.prototype.clear = function() {
    for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      f(A);
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        f(A);
      o(this.dom), k(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function d(A, h) {
    const _ = ((A.type || "") + "").trim().toLowerCase(), c = Ct(h, r, "ln-toast");
    if (!c)
      return console.warn('[ln-toast] Template "' + r + '" not found'), null;
    pt(c, {
      type: _,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const s = c.firstElementChild;
    if (!s) return null;
    s.hasAttribute("data-ln-toast-item") || s.setAttribute("data-ln-toast-item", ""), s.classList.add("ln-enter");
    const m = s.querySelector(".body");
    m && n(m, A);
    const y = s.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      f(s);
    }), s;
  }
  function n(A, h) {
    if (Array.isArray(h.message)) {
      const _ = document.createElement("ul");
      for (const c of h.message) {
        const s = document.createElement("li");
        s.textContent = c, _.appendChild(s);
      }
      A.appendChild(_);
    }
    if (h.data && h.data.errors) {
      const _ = document.createElement("ul");
      for (const c of Object.values(h.data.errors).flat()) {
        const s = document.createElement("li");
        s.textContent = c, _.appendChild(s);
      }
      A.appendChild(_);
    }
  }
  function i(A, h) {
    const _ = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length >= A.max && _.length > 0; ) A.dom.removeChild(_.shift());
    A.dom.appendChild(h), p(A.dom), requestAnimationFrame(() => h.classList.remove("ln-enter"));
  }
  function f(A) {
    if (!A || !A.parentNode) return;
    const h = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), o(h));
    }, 200);
  }
  function u(A) {
    let h = A && A.container;
    return typeof h == "string" && (h = document.querySelector(h)), h instanceof HTMLElement || (h = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), h || null;
  }
  function w(A, h) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const _ = A.querySelector("[data-ln-toast-close]");
    _ && _.addEventListener("click", function() {
      f(A);
    });
    const c = +(A.getAttribute("data-ln-toast-timeout") ?? h.timeoutDefault);
    c > 0 && (A._timer = setTimeout(function() {
      f(A);
    }, c));
  }
  function v(A) {
    const h = A.detail || {}, _ = u(h);
    if (!_) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (_[e] || (_[e] = new a(_))).enqueue(h);
  }
  function S(A) {
    const h = A && A.detail || {};
    if (h.container) {
      const _ = u(h);
      _ && (_[e] || (_[e] = new a(_))).clear();
    } else {
      const _ = document.querySelectorAll("[" + t + "]");
      for (const c of Array.from(_))
        (c[e] || (c[e] = new a(c))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const h of Array.from(A))
        h.querySelectorAll("[data-ln-toast-item]").length > 0 && p(h);
    });
  }, "ln-toast"), j(t, e, a, "ln-toast", {
    attributes: l
  });
})();
function Jr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((r) => r.trim().toLowerCase()).filter(Boolean).map((r) => r.startsWith(".") ? r.slice(1) : r);
  return e.length ? e : null;
}
function Vn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Zr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const r = Vn(t.name), l = String(t.type || "").toLowerCase();
  return e.some((g) => {
    if (g.includes("/")) {
      if (g.endsWith("/*")) {
        const p = g.slice(0, -1);
        return l.startsWith(p);
      }
      return l === g;
    }
    return r === g;
  });
}
function ti(t, e = "en", r = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (r["unit-b"] || "B");
  const l = 1024, g = [
    r["unit-b"] || "B",
    r["unit-kb"] || "KB",
    r["unit-mb"] || "MB",
    r["unit-gb"] || "GB"
  ], p = Math.floor(Math.log(t) / Math.log(l)), o = Math.min(p, g.length - 1), a = t / Math.pow(l, o);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(a) + " " + g[o];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", r = "file", l = "file_ids[]";
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-upload": { prop: "uploadUrl", read: Q, fallback: "" },
    "data-ln-upload-accept": {},
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: Q, fallback: "" },
    "data-ln-upload-max-size": { prop: "maxSize", read: It, fallback: 0 },
    "data-ln-upload-max-files": { prop: "maxFiles", read: It, fallback: 0 },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: Q, fallback: r },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: Q, fallback: l },
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
  }, p = et(g);
  function o(n, i, f) {
    return ti(n, i, f);
  }
  function a() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function d(n) {
    this.dom = n, tt(this, n, p), this.dict = re(n, "data-ln-upload-dict"), this.locale = rt(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const i = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Jr(i), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  d.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const i = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < i.length; u++) {
      const w = i[u], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), h = w.querySelector('[data-ln-field="sizeText"]'), _ = w.getAttribute("data-ln-upload-size"), c = _ ? parseInt(_, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: c !== null && !isNaN(c) ? c : h ? h.textContent.trim() : ""
      });
    }
    const f = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < f.length; u++) {
      const w = f[u];
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
  }, d.prototype._syncHiddenInputs = function() {
    const n = this, i = this.dom.querySelectorAll('input[type="hidden"]');
    for (let f = 0; f < i.length; f++)
      i[f].name === n.idsFieldName && i[f].remove();
    for (const [, f] of this.uploadedFiles)
      if (f.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = f.serverId, n.dom.appendChild(u);
      }
  }, d.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(i) {
      n.zone === n.dom && i.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && i.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(i) {
      i.preventDefault(), i.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(i) {
      i.preventDefault(), i.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(i) {
      i.preventDefault(), i.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(i) {
      i.preventDefault(), i.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), i.dataTransfer && i.dataTransfer.files && n.upload(i.dataTransfer.files);
    }, this._onListClick = function(i) {
      const f = i.target.closest('[data-ln-upload-action="remove"]');
      if (!f || !n.list || !n.list.contains(f) || f.disabled) return;
      const u = f.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(i) {
      i.detail && i.detail.files && n.upload(i.detail.files);
    }, this._onRequestRemove = function(i) {
      if (i.detail) {
        const f = i.detail.localId !== void 0 ? i.detail.localId : i.detail.serverId;
        f !== void 0 && n.remove(f);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, d.prototype.upload = function(n) {
    const i = this, f = Array.from(n);
    for (let u = 0; u < f.length; u++) {
      const w = f[u];
      if (i.maxFiles > 0 && i.uploadedFiles.size >= i.maxFiles) {
        k(i.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!Zr(w, i.allowedExts)) {
        k(i.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (i.maxSize > 0 && w.size > i.maxSize) {
        k(i.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(i.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || i._uploadSingleFile(w);
    }
  }, d.prototype._uploadSingleFile = function(n) {
    const i = this, f = "file-" + ++i.fileIdCounter, u = Vn(n.name);
    let w = null;
    if (this.list) {
      const _ = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (_ && (w = _.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", f), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: i.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const c = w.querySelector('[data-ln-upload-action="remove"]');
        c && (c.disabled = !0);
        const s = w.querySelector("[data-ln-progress]");
        s && s.setAttribute("data-ln-progress", "0"), i.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(i.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let _ = 0; _ < S.length; _++) {
      const c = S[_];
      !c.name || c.name === i.idsFieldName || c.type === "file" || (c.type === "checkbox" || c.type === "radio") && !c.checked || v.append(c.name, c.value);
    }
    const A = new XMLHttpRequest();
    i.uploadedFiles.set(f, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(_) {
      if (_.lengthComputable) {
        const c = Math.round(_.loaded / _.total * 100);
        if (w) {
          const s = w.querySelector("[data-ln-progress]");
          s && s.setAttribute("data-ln-progress", String(c)), pt(w, { sizeText: c + "%" });
        }
        k(i.dom, "ln-upload:progress", {
          localId: f,
          file: n,
          percent: c,
          loaded: _.loaded,
          total: _.total
        });
      }
    }), A.addEventListener("load", function() {
      const _ = i.uploadedFiles.get(f);
      if (_ && delete _.xhr, A.status >= 200 && A.status < 300) {
        let c;
        try {
          c = JSON.parse(A.responseText);
        } catch (m) {
          h(i.dict.error || "Error", A.status, m);
          return;
        }
        const s = c.id || c.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), s && w.setAttribute("data-ln-upload-id", String(s)), pt(w, {
            sizeText: o(c.size || n.size, i.locale, i.dict),
            uploading: !1
          });
          const m = w.querySelector('[data-ln-upload-action="remove"]');
          m && (m.disabled = !1);
        }
        _ && (_.serverId = s, _.size = c.size || n.size, _.name = c.name || n.name), i._syncHiddenInputs(), k(i.dom, "ln-upload:uploaded", {
          localId: f,
          serverId: s,
          name: c.name || n.name,
          size: c.size || n.size,
          response: c
        });
      } else {
        let c = "";
        try {
          c = JSON.parse(A.responseText).message || "";
        } catch {
        }
        h(c, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const _ = i.uploadedFiles.get(f);
      _ && delete _.xhr, h("", 0, null);
    });
    function h(_, c, s) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: i.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const m = w.querySelector('[data-ln-upload-action="remove"]');
        m && (m.disabled = !1);
      }
      k(i.dom, "ln-upload:error", {
        file: n,
        message: _,
        status: c,
        error: s
      });
    }
    i.uploadUrl ? (A.open("POST", i.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", a()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, d.prototype.remove = function(n) {
    const i = this;
    let f = null, u = null;
    if (i.uploadedFiles.has(n))
      f = n, u = i.uploadedFiles.get(n);
    else
      for (const [A, h] of i.uploadedFiles)
        if (String(h.serverId) === String(n)) {
          f = A, u = h;
          break;
        }
    if (!f || !u || Z(i.dom, "ln-upload:before-remove", {
      localId: f,
      serverId: u.serverId
    }).defaultPrevented) return;
    const v = i.list ? i.list.querySelector('[data-ln-upload-local-id="' + f + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      v && v.remove(), i.uploadedFiles.delete(f), i._syncHiddenInputs(), k(i.dom, "ln-upload:removed", { localId: f, serverId: null });
      return;
    }
    let S = null;
    if (i.deleteUrlPattern ? S = i.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : i.uploadUrl && i.uploadUrl.includes("{id}") && (S = i.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !S) {
      v && v.remove(), i.uploadedFiles.delete(f), i._syncHiddenInputs(), k(i.dom, "ln-upload:removed", { localId: f, serverId: u.serverId });
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
      A.ok ? (v && v.remove(), i.uploadedFiles.delete(f), i._syncHiddenInputs(), k(i.dom, "ln-upload:removed", {
        localId: f,
        serverId: u.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), k(i.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), k(i.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: 0,
        error: A
      });
    });
  }, d.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, f] of this.uploadedFiles)
        if (f.xhr && typeof f.xhr.abort == "function" && f.xhr.abort(), f.serverId) {
          let u = null;
          n.deleteUrlPattern ? u = n.deleteUrlPattern.replace("{id}", encodeURIComponent(f.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (u = n.uploadUrl.replace("{id}", encodeURIComponent(f.serverId))), u && fetch(u, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": a(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), k(n.dom, "ln-upload:cleared", {});
    }
  }, d.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, d.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, k(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, d, "ln-upload", {
    attributes: g
  });
})();
function Wn(t, e) {
  if (t.length !== 1) return t;
  const r = t.charCodeAt(0);
  if (r >= 65 && r <= 90) {
    const l = ((r - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + l);
  }
  if (r >= 97 && r <= 122) {
    const l = ((r - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + l);
  }
  if (r >= 48 && r <= 57) {
    const l = ((r - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + l);
  }
  return t;
}
function Gn(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const r = new TextEncoder().encode(e);
    let l = "";
    const g = r.length;
    for (let p = 0; p < g; p++)
      l += String.fromCharCode(r[p]);
    return btoa(l);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function Qn(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const r = atob(e), l = new Uint8Array(r.length);
      for (let g = 0; g < r.length; g++)
        l[g] = r.charCodeAt(g);
      return new TextDecoder().decode(l);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function $n(t, e) {
  const r = String(e || "ln-ashlar");
  let l;
  typeof TextEncoder < "u" ? l = new TextEncoder().encode(r) : typeof Buffer < "u" ? l = Buffer.from(r, "utf-8") : l = [108, 110];
  const g = l.length || 1, p = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++)
    p[o] = t[o] ^ l[o % g];
  return p;
}
function Xn(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const r = String(t);
  let l;
  if (typeof TextEncoder < "u")
    l = new TextEncoder().encode(r);
  else if (typeof Buffer < "u")
    l = Buffer.from(r, "utf-8");
  else
    return "";
  const g = $n(l, e);
  let p = "";
  for (let o = 0; o < g.length; o++)
    p += String.fromCharCode(g[o]);
  return typeof btoa < "u" ? btoa(p) : typeof Buffer < "u" ? Buffer.from(g).toString("base64") : "";
}
function Yn(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const r = String(t).trim();
    let l = "";
    if (typeof atob < "u")
      l = atob(r);
    else if (typeof Buffer < "u")
      l = Buffer.from(r, "base64").toString("binary");
    else
      return t;
    const g = new Uint8Array(l.length);
    for (let o = 0; o < l.length; o++)
      g[o] = l.charCodeAt(o);
    const p = $n(g, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(p);
    if (typeof Buffer < "u")
      return Buffer.from(p).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Jn(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), r = e === "xor" || e === "base64" ? e : "rot", l = Number(t.shift) || 13, g = t.key || "ln-ashlar";
    return { codec: r, shift: l, key: g };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function ei(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const r = Jn(e);
  return r.codec === "base64" ? Gn(t) : r.codec === "xor" ? Xn(t, r.key) : t.replace(/[a-zA-Z0-9]/g, (l) => Wn(l, r.shift));
}
function me(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const r = Jn(e);
  return r.codec === "base64" ? Qn(t) : r.codec === "xor" ? Yn(t, r.key) : t.replace(/[a-zA-Z0-9]/g, (l) => Wn(l, -r.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator", r = /* @__PURE__ */ new WeakSet();
  if (window[e] !== void 0) return;
  function l(a) {
    const d = a[e];
    d && d.deobfuscate();
  }
  const g = {
    "data-ln-obfuscator": { effect: l },
    "data-ln-obfuscator-codec": { effect: l },
    "data-ln-obfuscator-key": { effect: l }
  };
  function p(a) {
    return a[e] ? a[e] : (a[e] = this, this.dom = a, this._processed = !1, this.deobfuscate(), this);
  }
  p.prototype.deobfuscate = function() {
    if (this._processed || r.has(this.dom))
      return;
    const a = this.dom.getAttribute(t), d = parseInt(a, 10), n = isNaN(d) ? 13 : d, i = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), f = this.dom.getAttribute("data-ln-obfuscator-key");
    let u = "rot";
    i === "xor" || i === "base64" ? u = i : f && (u = "xor");
    const w = f || "ln-ashlar", v = { codec: u, shift: n, key: w }, S = this.dom.matches && (this.dom.matches("a") || this.dom.matches("area"));
    if (S && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const A = this.dom.querySelectorAll(".sr-only");
      for (let _ = 0; _ < A.length; _++)
        A[_].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const h = (this.dom.rel || "").split(/\s+/).filter(function(_) {
        return _ && _ !== "noopener" && _ !== "noreferrer";
      });
      h.length > 0 ? this.dom.rel = h.join(" ") : this.dom.removeAttribute("rel");
    }
    if (typeof document < "u" && document.createTreeWalker) {
      const A = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(_) {
          return _.parentElement && _.parentElement.classList && _.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      }), h = [];
      for (; A.nextNode(); )
        h.push(A.currentNode);
      for (let _ = 0; _ < h.length; _++) {
        const c = h[_];
        c.nodeValue && c.nodeValue.length > 0 && (c.nodeValue = me(c.nodeValue, v));
      }
    }
    if (S && this.dom.hasAttribute("href")) {
      const A = this.dom.getAttribute("href");
      if (A) {
        const h = me(A, v);
        this.dom.setAttribute("href", h);
      }
    }
    this._processed = !0, r.add(this.dom), k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: u,
      shift: n,
      key: u === "xor" ? w : null
    });
  }, p.prototype.destroy = function() {
    this.dom[e] && (k(this.dom, "ln-obfuscator:destroyed", { target: this.dom }), delete this.dom[e]);
  };
  const o = j(t, e, p, "ln-obfuscator", {
    attributes: g
  });
  o.obfuscate = ei, o.deobfuscate = me, o.utf8ToBase64 = Gn, o.base64ToUtf8 = Qn, o.xorObfuscate = Xn, o.xorDeobfuscate = Yn;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function r(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !e(a)) return;
    a.target = "_blank";
    const d = (a.rel || "").split(/\s+/).filter(Boolean);
    d.includes("noopener") || d.push("noopener"), d.includes("noreferrer") || d.push("noreferrer"), a.rel = d.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", a.appendChild(n), a.setAttribute("data-ln-external-link", "processed"), k(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function l(a) {
    a = a || document.body;
    for (const d of a.querySelectorAll("a, area"))
      r(d);
  }
  function g() {
    gt(function() {
      document.body.addEventListener("click", function(a) {
        const d = a.target.closest("a, area");
        d && d.getAttribute("data-ln-external-link") === "processed" && k(d, "ln-external-links:clicked", {
          link: d,
          href: d.href,
          text: d.textContent || d.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    gt(function() {
      new MutationObserver(function(d) {
        for (const n of d)
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (i.matches && (i.matches("a") || i.matches("area")) && r(i), i.querySelectorAll))
                for (const f of i.querySelectorAll("a, area"))
                  r(f);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt(["href"], function(d) {
        d.matches && (d.matches("a") || d.matches("area")) && r(d);
      });
    }, "ln-external-links");
  }
  function o() {
    g(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      l();
    }) : l();
  }
  window[t] = {
    process: l
  }, o();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let r = null;
  function l() {
    r = document.createElement("div"), r.className = "ln-link-status", document.body.appendChild(r);
  }
  function g(h) {
    r && (r.textContent = h, r.classList.add("ln-link-status--visible"));
  }
  function p() {
    r && r.classList.remove("ln-link-status--visible");
  }
  function o(h, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const c = h.querySelector("a");
    if (!c) return;
    const s = c.getAttribute("href");
    if (!s) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(s, "_blank", "noopener,noreferrer");
      return;
    }
    Z(h, "ln-link:navigate", { target: h, href: s, link: c }).defaultPrevented || c.click();
  }
  function a(h) {
    const _ = h.querySelector("a");
    if (!_) return;
    const c = _.getAttribute("href");
    c && g(c);
  }
  function d() {
    p();
  }
  function n(h) {
    h[e + "Row"] || !h.querySelector("a") || (h[e + "Row"] = !0, h._lnLinkClick = function(c) {
      o(h, c);
    }, h._lnLinkEnter = function() {
      a(h);
    }, h.addEventListener("click", h._lnLinkClick), h.addEventListener("mouseenter", h._lnLinkEnter), h.addEventListener("mouseleave", d));
  }
  function i(h) {
    h[e + "Row"] && (h._lnLinkClick && h.removeEventListener("click", h._lnLinkClick), h._lnLinkEnter && h.removeEventListener("mouseenter", h._lnLinkEnter), h.removeEventListener("mouseleave", d), delete h._lnLinkClick, delete h._lnLinkEnter, delete h[e + "Row"]);
  }
  function f(h) {
    if (!h[e + "Init"]) return;
    const _ = h.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const c = _ === "TABLE" && h.querySelector("tbody") || h;
      for (const s of c.querySelectorAll("tr"))
        i(s);
    } else
      i(h);
    delete h[e + "Init"];
  }
  function u(h) {
    if (h[e + "Init"]) return;
    h[e + "Init"] = !0;
    const _ = h.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const c = _ === "TABLE" && h.querySelector("tbody") || h;
      for (const s of c.querySelectorAll("tr"))
        n(s);
    } else
      n(h);
  }
  function w(h) {
    h.hasAttribute && h.hasAttribute(t) && u(h);
    const _ = h.querySelectorAll ? h.querySelectorAll("[" + t + "]") : [];
    for (const c of _)
      u(c);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(_) {
        for (const c of _)
          if (c.type === "childList") {
            for (const s of c.addedNodes)
              if (s.nodeType === 1) {
                w(s);
                const m = s.closest("[" + t + "]");
                if (m)
                  if (s.tagName === "TR")
                    n(s);
                  else {
                    const y = m.tagName;
                    if (y === "TABLE" || y === "TBODY") {
                      const T = s.querySelectorAll ? s.querySelectorAll("tr") : [];
                      for (const b of T)
                        n(b);
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
  function S(h) {
    w(h);
  }
  window[e] = { init: S, destroy: f };
  function A() {
    l(), v(), S(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
})();
(function() {
  const t = "data-ln-scroll", e = "lnScroll";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-scroll": { effect: null },
    "data-ln-scroll-behavior": { effect: null },
    "data-ln-scroll-block": { effect: null },
    "data-ln-scroll-set": { effect: null },
    "data-ln-scroll-focus": { effect: null },
    "data-ln-scroll-delay": { effect: null },
    "data-ln-scroll-update-hash": { effect: null }
  };
  function l(g) {
    if (g[e]) return g[e];
    if (!(!g || g.tagName !== "A" && g.tagName !== "BUTTON"))
      return g[e] = this, this.dom = g, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  l.prototype._handleClick = function(g) {
    if (this.dom.tagName === "A" && (g.ctrlKey || g.metaKey || g.shiftKey || g.altKey || g.button !== 0))
      return;
    let p = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (p || (p = (this.dom.getAttribute("href") || "").trim()), !p || p === "#")
      return;
    !p.startsWith("#") && !p.startsWith(".") && !p.startsWith("[") && (p = "#" + p);
    let o = null;
    try {
      o = document.querySelector(p);
    } catch {
      const v = p.replace(/^#/, "");
      o = document.getElementById(v);
    }
    if (!o) return;
    g.preventDefault();
    const a = this.dom.getAttribute("data-ln-scroll-set");
    if (a) {
      const w = a.indexOf(":");
      if (w !== -1) {
        const v = a.slice(0, w).trim(), S = a.slice(w + 1).trim();
        try {
          const A = document.querySelector(v);
          A && (A.value = S, A.dispatchEvent(new Event("input", { bubbles: !0 })), A.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Z(this.dom, "ln-scroll:before-scroll", {
      target: o,
      link: this.dom,
      href: p
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", i = this.dom.getAttribute("data-ln-scroll-block") || "start";
    o.scrollIntoView({ behavior: n, block: i });
    const f = this.dom.getAttribute("data-ln-scroll-update-hash");
    if (f === "true" || f === "1")
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", p);
      } catch {
      }
    const u = this.dom.getAttribute("data-ln-scroll-focus");
    if (u !== "false") {
      const w = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), v = isNaN(w) ? 450 : w;
      window.setTimeout(function() {
        let S = null;
        if (u && u !== "true")
          try {
            S = document.querySelector(u);
          } catch {
          }
        S || (S = o.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !S && o.getAttribute("tabindex") !== null && (S = o), S && typeof S.focus == "function" && S.focus({ preventScroll: !0 });
      }, v);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: o,
      link: this.dom,
      href: p
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), k(this.dom, "ln-scroll:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, l, "ln-scroll", {
    attributes: r
  });
})();
const Pt = ["Ctrl", "Alt", "Shift", "Meta"], ni = {
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
function Zn(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const r = ni[e.toLowerCase()];
  return r || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function tr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const r = e.split("+"), l = /* @__PURE__ */ new Set();
  let g = "";
  for (let o = 0; o < r.length; o++) {
    const a = Zn(r[o]);
    if (!a) return "";
    if (Pt.indexOf(a) !== -1) {
      l.add(a);
      continue;
    }
    if (g) return "";
    g = a;
  }
  if (!g) return "";
  const p = [];
  for (let o = 0; o < Pt.length; o++)
    l.has(Pt[o]) && p.push(Pt[o]);
  return p.push(g), p.join("+");
}
function ri(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const r = e.split(/[\s,]+/), l = [];
  for (let g = 0; g < r.length; g++) {
    const p = tr(r[g]);
    p && l.indexOf(p) === -1 && l.push(p);
  }
  return l;
}
function ii(t, e) {
  const r = String(e || "").trim();
  if (!r || /[\s,]/.test(r)) return "";
  const l = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(l) ? "" : tr(l ? l + "+" + r : r);
}
function oi(t) {
  if (!t) return "";
  const e = Zn(t.key);
  if (!e || Pt.indexOf(e) !== -1) return "";
  const r = [];
  return t.ctrlKey && r.push("Ctrl"), t.altKey && r.push("Alt"), t.shiftKey && r.push("Shift"), t.metaKey && r.push("Meta"), r.push(e), r.join("+");
}
function si(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const r = t.getAttribute("contenteditable");
    if (r === "" || String(r).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function ai(t, e, r, l) {
  if (!t || !e || r !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const g = String(e.tagName || "").toLowerCase();
  return g === "button" ? l === "Enter" || l === "Space" : g === "a" && e.hasAttribute && e.hasAttribute("href") && l === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", r = "data-ln-key-target", l = "data-ln-key-allow-input", g = "data-ln-key-modifier", p = "data-ln-key-for", o = "lnKeyFor";
  if (window[e] !== void 0) return;
  function a(_) {
    const c = _[e];
    if (c) {
      if (!_.hasAttribute(t)) {
        c.destroy();
        return;
      }
      c.sync();
    }
  }
  function d(_) {
    const c = _[o];
    c && !_.hasAttribute(p) && c.destroy();
  }
  const n = {
    "data-ln-key": { effect: a },
    "data-ln-key-target": { effect: a },
    "data-ln-key-allow-input": { effect: a }
  }, i = {
    "data-ln-key-for": { effect: d },
    "data-ln-key-modifier": {}
  }, f = /* @__PURE__ */ new Set();
  let u = null;
  function w() {
    u || (u = function(_) {
      if (_.defaultPrevented || _.isComposing || _.repeat) return;
      const c = oi(_);
      if (!c) return;
      const s = Er(_.target), m = document.querySelectorAll("[" + t + "], [" + p + "]");
      let y = null, T = !1, b = !1;
      for (let q = 0; q < m.length; q++) {
        const D = m[q], I = D[e] || D[o];
        if (!I || !I.matches(c) || s && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = si(R);
        if (!(!O || !Ar(R, O))) {
          if (ai(_, R, O, c)) {
            b = !0;
            continue;
          }
          y ? T = !0 : y = { host: D, target: R, action: O };
        }
      }
      if (b || !y) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + c + '"; first DOM match wins.');
      const E = {
        source: y.host,
        target: y.target,
        action: y.action,
        key: c,
        event: _
      };
      Z(y.host, "ln-key:before-trigger", E).defaultPrevented || (_.preventDefault(), y.target[y.action](), k(y.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", u));
  }
  function v() {
    f.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function S(_) {
    return this.dom = _, this.shortcuts = [], f.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = ri(this.dom.getAttribute(t));
  }, S.prototype.matches = function(_) {
    return this.shortcuts.indexOf(_) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(l);
  }, S.prototype.resolveTarget = function() {
    const _ = this.dom.getAttribute(r);
    return _ ? h(_, r) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (f.delete(this), delete this.dom[e], v(), k(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(_) {
    return this.dom = _, f.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + g + "]");
  }, A.prototype.shortcut = function() {
    const _ = this._modifierContext(), c = _ ? _.getAttribute(g) : "";
    return ii(c, this.dom.textContent);
  }, A.prototype.matches = function(_) {
    return this.shortcut() === _;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(l)) return !0;
    const _ = this._modifierContext();
    return !!(_ && _.hasAttribute(l));
  }, A.prototype.resolveTarget = function() {
    return h(this.dom.getAttribute(p), p);
  }, A.prototype.destroy = function() {
    this.dom[o] && (f.delete(this), delete this.dom[o], v(), k(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function h(_, c) {
    if (!_) return null;
    try {
      const s = document.querySelector(_);
      return s || console.warn("[ln-key] Target not found for " + c + ' selector "' + _ + '".'), s;
    } catch {
      return console.warn("[ln-key] Invalid " + c + ' selector "' + _ + '".'), null;
    }
  }
  j(t, e, S, "ln-key", {
    attributes: n
  }), j(p, o, A, "ln-key-for", {
    attributes: i
  });
})();
function li(t, e, r = 100) {
  if (e != null && e !== "") {
    const l = parseFloat(String(e));
    if (!isNaN(l) && l > 0) return l;
  }
  if (t != null && t !== "") {
    const l = parseFloat(String(t));
    if (!isNaN(l) && l > 0) return l;
  }
  return r;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function r(a) {
    const d = a[e];
    d && o.call(d);
  }
  const l = {
    "data-ln-progress": { effect: r },
    "data-ln-progress-max": { effect: r }
  };
  function g(a) {
    return this.dom = a, this._parentObserver = null, o.call(this), p.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function p() {
    const a = this, d = this.dom.parentElement;
    if (!d) return;
    const n = new MutationObserver(function(i) {
      for (const f of i)
        f.attributeName === "data-ln-progress-max" && o.call(a);
    });
    n.observe(d, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function o() {
    const a = this.dom.getAttribute("data-ln-progress"), d = this.dom.parentElement, n = d ? d.getAttribute("data-ln-progress-max") : null, i = this.dom.getAttribute("data-ln-progress-max"), f = li(i, n, 100), u = qn(a, f);
    this.dom.style.width = u.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(u.min)), this.dom.setAttribute("aria-valuemax", String(u.max)), this.dom.setAttribute("aria-valuenow", String(u.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: u.value,
      max: u.max,
      percentage: u.percentage
    });
  }
  j(
    t,
    e,
    g,
    "ln-progress",
    {
      attributes: l
    }
  );
})();
function ci(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let r = 0; r < t.length; r++)
    if (t[r] !== e[r]) return !0;
  return !1;
}
function di(t, e, r) {
  if (!e || typeof e != "object") return !0;
  const l = Object.keys(e);
  if (l.length === 0) return !0;
  for (let g = 0; g < l.length; g++) {
    const p = e[l[g]];
    let o = "";
    if (p.col !== null && p.col !== void 0 ? o = t[p.col] || "" : p.attr && r && typeof r.getAttribute == "function" && (o = r.getAttribute(p.attr) || ""), !Ie(o, p.values))
      return !1;
  }
  return !0;
}
function Ye(t, e, r, l) {
  if (l != null && !isNaN(l))
    return parseInt(l, 10);
  if (e && typeof e.getAttribute == "function") {
    const g = e.getAttribute("data-ln-filter-col");
    if (g !== null && !isNaN(parseInt(g, 10)))
      return parseInt(g, 10);
    if (typeof e.closest == "function") {
      const p = e.closest("th");
      if (p && typeof p.cellIndex == "number")
        return p.cellIndex;
      const o = e.closest("[data-ln-popover], [id]");
      if (o && o.id) {
        const a = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (a && typeof a.querySelector == "function") {
          const d = a.querySelector('[data-ln-popover-for="' + o.id + '"]');
          if (d && typeof d.closest == "function") {
            const n = d.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && r && typeof t.querySelectorAll == "function") {
    const g = t.querySelectorAll("thead th, tr:first-child th"), p = String(r).trim().toLowerCase();
    for (let o = 0; o < g.length; o++) {
      const a = g[o], d = a.getAttribute("data-ln-table-filter-col") || a.getAttribute("data-ln-filter-col") || a.getAttribute("data-ln-filter-key") || a.getAttribute("data-ln-table-col") || a.getAttribute("data-ln-col") || a.getAttribute("data-ln-field");
      if (d && d.trim().toLowerCase() === p)
        return typeof a.cellIndex == "number" ? a.cellIndex : o;
    }
    if (e) {
      const o = e.closest ? e.closest("[data-ln-popover], [id]") : null, a = o && o.id || e.id || null;
      if (a)
        for (let d = 0; d < g.length; d++) {
          const n = g[d];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + a + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : d;
        }
    }
    for (let o = 0; o < g.length; o++) {
      const a = g[o], n = Array.from(a.childNodes || []).filter((f) => f.nodeType === 3), i = (n.length > 0 ? n.map((f) => f.textContent.trim()).join(" ") : a.textContent || "").trim().toLowerCase();
      if (i && i === p)
        return typeof a.cellIndex == "number" ? a.cellIndex : o;
    }
  }
  return null;
}
function ui(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const r = [];
  for (let l = 0; l < t.length; l++) {
    const g = t[l];
    !e && g.key && (e = g.key), g.checked && !g.isReset && g.value && r.push(g.value);
  }
  return { key: e, values: r };
}
function hi(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Je(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", r = "data-ln-filter-key", l = "data-ln-filter-value", g = "data-ln-filter-hide", p = "data-ln-filter-reset", o = "data-ln-filter-col", a = "data-ln-hash", d = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-filter": { prop: "targetId", read: Q, fallback: null },
    "data-ln-hash": { effect: _ },
    "data-ln-filter-values": { effect: _ },
    "data-ln-filter-col": {},
    "data-ln-filter-key": {},
    "data-ln-filter-reset": {},
    "data-ln-filter-value": {},
    "data-ln-filter-hide": {}
  }, f = et(i);
  function u(c) {
    return c.hasAttribute(p) || !c.getAttribute(l);
  }
  function w(c) {
    const s = c.dom.querySelectorAll("[" + r + "]"), m = [];
    for (let T = 0; T < s.length; T++) {
      const b = s[T];
      m.push({
        key: b.getAttribute(r),
        value: b.getAttribute(l) || "",
        checked: b.checked,
        isReset: u(b)
      });
    }
    const y = ui(m);
    return { key: y.key, values: y.values, targetId: c.targetId };
  }
  function v(c, s, m) {
    const y = c.querySelectorAll("[" + r + "]"), T = Array.isArray(m) && m.length > 0;
    for (let b = 0; b < y.length; b++) {
      const E = y[b];
      u(E) ? E.checked = !T : T && E.getAttribute(r) === s && m.indexOf(E.getAttribute(l)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(c) {
    this.dom = c, tt(this, c, f);
    const s = c.getAttribute(o);
    this.colIndex = s !== null ? parseInt(s, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(c, "filter"), this.hashEnabled = !!this.nsKey;
    const m = this, y = oe(function() {
      m._render();
    });
    this._queueRender = y, this._attachHandlers(), this._onHashChange = function() {
      if (m._destroyed || !m.hashEnabled) return;
      const b = ot(m.nsKey), E = be(b);
      E && E.key && E.values.length > 0 ? v(m.dom, E.key, E.values) : v(m.dom, null, []), m._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const b = ot(this.nsKey), E = be(b);
      E && E.key && E.values.length > 0 && (v(c, E.key, E.values), mt(function() {
        m._destroyed || m._render();
      }), T = !0);
    }
    if (!T) {
      const b = Je(c.getAttribute(d));
      if (b.length > 0) {
        const E = c.querySelector("[" + r + "]"), C = E ? E.getAttribute(r) : null;
        C && (v(c, C, b), mt(function() {
          m._destroyed || m._render();
        }), T = !0);
      }
    }
    if (!T) {
      const b = c.querySelectorAll("[" + r + "]");
      for (let E = 0; E < b.length; E++)
        if (b[E].checked && !u(b[E])) {
          mt(function() {
            m._destroyed || m._render();
          });
          break;
        }
    }
    return this;
  }
  S.prototype._attachHandlers = function() {
    const c = this;
    this._onDomChange = function(s) {
      const m = s.target;
      if (!m || !m.hasAttribute || !m.hasAttribute(r)) return;
      const y = Array.from(c.dom.querySelectorAll("[" + r + "]"));
      if (u(m)) {
        for (let T = 0; T < y.length; T++)
          u(y[T]) || (y[T].checked = !1);
        m.checked = !0, c._queueRender();
        return;
      }
      if (m.checked) {
        for (let b = 0; b < y.length; b++)
          u(y[b]) && (y[b].checked = !1);
        let T = !1;
        for (let b = 0; b < y.length; b++)
          if (u(y[b])) {
            T = !0;
            break;
          }
        if (T) {
          let b = !0;
          for (let E = 0; E < y.length; E++)
            if (!u(y[E]) && !y[E].checked) {
              b = !1;
              break;
            }
          if (b)
            for (let E = 0; E < y.length; E++)
              u(y[E]) ? y[E].checked = !0 : y[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let b = 0; b < y.length; b++)
          if (!u(y[b]) && y[b].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let b = 0; b < y.length; b++)
            u(y[b]) && (y[b].checked = !0);
      }
      c._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const c = this, s = w(this), m = this._lastSnapshot;
    if (!(!m || m.key !== s.key || ci(m.values, s.values))) return;
    const T = s.key === null || s.values.length === 0, b = document.getElementById(c.targetId), E = {
      key: s.key,
      values: s.values.slice(),
      targetId: c.targetId
    };
    k(c.dom, "ln-filter:change", E);
    let C = !1;
    b && b !== c.dom && Z(b, "ln-filter:change", E).defaultPrevented && (C = !0);
    const q = m && m.values.length > 0, D = s.values.length === 0;
    if (q && D) {
      const O = { targetId: c.targetId };
      k(c.dom, "ln-filter:reset", O), b && b !== c.dom && k(b, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: s.key, values: s.values.slice() };
    const I = hi(s.values);
    if (I ? this.dom.setAttribute(d, I) : this.dom.removeAttribute(d), this.hashEnabled) {
      const O = Ln(s.key, s.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = b && (b.tagName === "TABLE" ? b : b.querySelector ? b.querySelector("table") : null);
    if (R)
      c._filterTableRows(s, R);
    else {
      if (!b) return;
      const O = b.children;
      for (let B = 0; B < O.length; B++) {
        const P = O[B];
        if (P.removeAttribute(g), T) continue;
        const H = P.getAttribute("data-" + s.key);
        H !== null && (Ie(H, s.values) || P.setAttribute(g, "true"));
      }
    }
  };
  function A(c) {
    if (!c) return "";
    const s = c.querySelector ? c.querySelector("[data-ln-value]") : null;
    return vt(s || c);
  }
  function h(c) {
    return !!(!c || typeof c != "object" || c.tagName === "TEMPLATE" || typeof c.hasAttribute == "function" && (c.hasAttribute("data-ln-sort-exclude") || c.hasAttribute("hidden")) || c.classList && c.classList.contains("hidden") || c.style && c.style.display === "none" || typeof c.matches == "function" && c.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof c.querySelector == "function" && c.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(c, s) {
    if (!s) {
      const C = document.getElementById(this.targetId);
      if (!C || (s = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !s)) return;
    }
    const m = Ye(s, this.dom, c.key, this.colIndex), y = c.key || this.dom.getAttribute("data-ln-filter-key") || (m !== null ? "col" + m : "attr-filter"), T = c.values;
    n.has(s) || n.set(s, {});
    const b = n.get(s);
    y && T.length > 0 ? b[y] = {
      col: m,
      values: T.slice(),
      attr: "data-" + y
    } : y && delete b[y];
    const E = s.tBodies;
    for (let C = 0; C < E.length; C++) {
      const q = E[C].rows;
      for (let D = 0; D < q.length; D++) {
        const I = q[D];
        if (h(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        di(R, b, I) ? I.removeAttribute(g) : I.setAttribute(g, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const c = document.getElementById(this.targetId);
    if (c) {
      const s = c.tagName === "TABLE" ? c : c.querySelector ? c.querySelector("table") : null;
      if (s && n.has(s)) {
        const m = n.get(s), y = Ye(s, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (y !== null ? "col" + y : this.colIndex !== null ? "col" + this.colIndex : null);
        T && m[T] && (delete m[T], this._filterTableRows({ key: null, values: [] }, s)), Object.keys(m).length === 0 && n.delete(s);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function _(c, s) {
    const m = c[e];
    if (!(!m || m._destroyed)) {
      if (s === a)
        m.hashEnabled && m._onHashChange && window.removeEventListener("hashchange", m._onHashChange), m.nsKey = wt(c, "filter"), m.hashEnabled = !!m.nsKey, m.hashEnabled && window.addEventListener("hashchange", m._onHashChange);
      else if (s === d) {
        const y = Je(c.getAttribute(d)), T = c.querySelector("[" + r + "]"), b = T ? T.getAttribute(r) : null;
        b && (v(c, b, y), m._render());
      }
    }
  }
  j(t, e, S, "ln-filter", {
    attributes: i,
    persist: {
      attr: d,
      hashActive: function(c) {
        return !!wt(c, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", r = "data-ln-search-for", l = "lnSearchControl", g = "data-ln-search-items", p = "data-ln-search-fields", o = "data-ln-search-exclude", a = "data-ln-search-hide", d = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { effect: c },
    "data-ln-hash": { effect: c },
    "data-ln-search-for": { prop: "targetId", read: Q, fallback: null },
    "data-ln-search-fields": {},
    "data-ln-search-items": {},
    "data-ln-search-exclude": {},
    "data-ln-search-hide": {},
    "data-ln-search-clear-for": {}
  }, i = et(n);
  function f(s) {
    const m = wt(s, "search");
    if (m) return m;
    if (s.id) {
      const y = document.querySelector("[" + r + '="' + s.id + '"]');
      if (y) {
        const T = wt(y, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(s) {
    return s.matches("input, textarea") ? s : s.querySelector("input, textarea");
  }
  function w(s, m) {
    const y = s.childNodes;
    for (let T = 0; T < y.length; T++) {
      const b = y[T];
      if (b.nodeType === 3) {
        m.push(b.nodeValue);
        continue;
      }
      b.nodeType === 1 && (b.hasAttribute(o) || w(b, m));
    }
  }
  function v(s) {
    if (s._lnSearchText !== void 0) return s._lnSearchText;
    const m = [];
    w(s, m);
    const y = Br(m);
    return s._lnSearchText = y, y;
  }
  function S(s, m) {
    if (!s.id) return;
    const y = document.querySelectorAll("[" + r + '="' + s.id + '"]');
    for (const T of y) {
      const b = u(T);
      b && b.value !== m && (b.value = m);
    }
  }
  function A(s) {
    this.dom = s, this.term = s.getAttribute(t) || "", this._destroyed = !1;
    const m = this;
    return this.nsKey = f(s), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (m._destroyed || !m.hashEnabled) return;
      const y = ot(m.nsKey), T = m.dom.getAttribute(t) || "";
      y !== null && y !== T ? m.dom.setAttribute(t, y) : y === null && T !== "" && m.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!m._destroyed) {
        if (m.hashEnabled) {
          const y = ot(m.nsKey);
          if (y !== null && y !== m.term) {
            m.term = y, m.dom.setAttribute(t, y), S(m.dom, y), m._apply();
            return;
          }
        }
        ve(m.term) && (S(m.dom, m.term), m._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const s = this.dom, m = ve(this.term), y = In(m);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = Fr(s.getAttribute(p));
    if (Z(s, "ln-search:change", {
      term: m,
      tokens: y,
      targetId: s.id,
      fields: T
    }).defaultPrevented) return;
    const E = s.getAttribute(g), C = E ? s.querySelectorAll(E) : s.children;
    for (let q = 0; q < C.length; q++) {
      const D = C[q];
      if (D.removeAttribute(a), D.hasAttribute(o) || y.length === 0) continue;
      const I = v(D);
      Dn(I, y) || D.setAttribute(a, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function h(s) {
    if (this.dom = s, tt(this, s, i), this.input = u(s), this._attachHandler(), this.input && this.input.value.trim()) {
      const m = this;
      mt(function() {
        const y = document.getElementById(m.targetId);
        y && ((y.getAttribute(t) || "").trim() || m._write(m.input.value));
      });
    }
    return this;
  }
  h.prototype._write = function(s) {
    const m = document.getElementById(this.targetId);
    m && m.getAttribute(t) !== s && m.setAttribute(t, s);
  }, h.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._onInput = function() {
      s._write(s.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, h.prototype.destroy = function() {
    this.dom[l] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[l]);
  };
  function _(s) {
    const m = s.getAttribute("data-ln-search-clear-for");
    if (m) {
      const C = document.getElementById(m), q = document.querySelector("[" + r + '="' + m + '"]'), D = q ? u(q) : null;
      return { target: C, input: D };
    }
    const y = s.closest("[" + t + "]");
    if (y) {
      const C = y.id ? document.querySelector("[" + r + '="' + y.id + '"]') : null, q = C ? u(C) : null;
      return { target: y, input: q };
    }
    const T = s.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), q = C ? document.getElementById(C) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + r + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: q, input: I };
      }
    }
    const b = s.closest("[" + r + "]");
    if (b) {
      const C = b.getAttribute(r), q = C ? document.getElementById(C) : null, D = u(b);
      return { target: q, input: D };
    }
    const E = s.parentElement;
    if (E) {
      const C = E.querySelector("[" + r + "]");
      if (C) {
        const q = C.getAttribute(r), D = q ? document.getElementById(q) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(s) {
    const m = s.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!m) return;
    const y = _(m);
    !y.target && !y.input || (s.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function c(s, m) {
    const y = s[e];
    if (!y || y._destroyed) return;
    if (m === d) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = f(s), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const T = s.getAttribute(t) || "";
    T !== y.term && (y.term = T, S(s, T), y._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(s, m) {
      const y = m.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(s) {
        return !!f(s);
      }
    }
  }), j(r, l, h);
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function fi(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function pi(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function mi(t, e, r, l) {
  const g = St(t);
  if (g === "none") return () => 0;
  const p = g === "desc" ? -1 : 1, o = typeof l == "function" ? l : (a) => a;
  return function(a, d) {
    const n = o(a), i = o(d);
    return Le(n, i, e, r) * p;
  };
}
function ge(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function gi(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const r = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (r && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(r));
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
  const t = "data-ln-sort", e = "lnSort", r = "data-ln-sort-field", l = "data-ln-sort-state", g = "data-ln-sort-dir", p = "data-ln-hash";
  if (window[e] !== void 0) return;
  function o(w, v) {
    return w.getAttribute(v) || null;
  }
  const a = {
    "data-ln-sort": { prop: "targetId", read: Q, fallback: null },
    "data-ln-sort-field": { prop: "field", read: o, effect: u },
    "data-ln-sort-dir": {},
    "data-ln-sort-items": { prop: "itemsSelector", read: o },
    "data-ln-sort-state": { effect: u },
    "data-ln-hash": { effect: u }
  }, d = et(a), n = /* @__PURE__ */ new WeakMap();
  function i(w, v, S) {
    if (v) {
      const A = w.querySelector('[data-ln-field="' + v + '"]');
      return A ? vt(A) : "";
    }
    return S != null && w.cells && w.cells[S] ? vt(w.cells[S]) : vt(w);
  }
  function f(w) {
    this.dom = w, tt(this, w, d);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(l)), w.hasAttribute(l) || w.setAttribute(l, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(h) {
      const _ = h.target.closest("[" + g + "]");
      if (!_) return;
      const c = St(_.getAttribute(g));
      S._apply(c);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(h) {
      if (S._destroyed || !h.detail) return;
      const _ = S._resolveTarget();
      if (!(_ && (h.target === _ || _.contains(h.target)) || h.detail.targetId && h.detail.targetId === S.targetId)) return;
      if (pi(
        { field: S.field, column: S.column },
        { field: h.detail.field, column: h.detail.column }
      )) {
        const m = St(h.detail.direction);
        m && w.getAttribute(l) !== m && (S._state = m, w.setAttribute(l, m), S._updateAriaSort(m));
        return;
      }
      w.getAttribute(l) !== "none" && (S._state = "none", w.setAttribute(l, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const h = ot(S.nsKey), _ = _e(h);
      if (_)
        S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn ? S._state !== _.direction && S._apply(_.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(l, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(l, "none"), S._updateAriaSort("none");
        const c = S._resolveTarget();
        c && (Z(c, "ln-sort:change", {
          field: S.field,
          column: S.column,
          direction: "none",
          targetId: S.targetId
        }).defaultPrevented || S._defaultSort(c, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const h = ot(this.nsKey), _ = _e(h);
      _ && ((S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(_.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const h = St(w.getAttribute(l));
      h && h !== "none" && mt(function() {
        S._destroyed || S._apply(h, !0);
      });
    }
    return this;
  }
  f.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, f.prototype._updateAriaSort = function(w) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", fi(w));
  }, f.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const c = this.dom.closest("th");
      c && c.cellIndex !== void 0 && (this.column = c.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(l) !== S && this.dom.setAttribute(l, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const h = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const c = Tn(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, c);
    }
    Z(A, "ln-sort:change", h).defaultPrevented || this._defaultSort(A, S);
  }, f.prototype._defaultSort = function(w, v) {
    const S = gi(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, h = S.filter(function(m) {
      return !ge(m);
    });
    if (!h.length) return;
    n.has(w) || n.set(w, h.slice());
    let _;
    if (v === "none") {
      const m = n.get(w) || h;
      n.delete(w), _ = m.filter(function(y) {
        return y.parentNode === A && !ge(y);
      });
    } else {
      const m = this.field, y = this.column, T = h.map(function(q) {
        return i(q, m, y);
      }), b = Te(T), E = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = mi(v, b, E, function(q) {
        return i(q, m, y);
      });
      _ = h.slice().sort(C);
    }
    const c = document.createDocumentFragment();
    let s = 0;
    for (let m = 0; m < S.length; m++) {
      const y = S[m];
      ge(y) ? c.appendChild(y) : s < _.length && c.appendChild(_[s++]);
    }
    A.appendChild(c);
  }, f.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === r) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === l) {
        const A = St(w.getAttribute(l));
        A !== S._state && S._apply(A);
      } else v === p && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, f, "ln-sort", {
    attributes: a,
    persist: {
      attr: l,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function Ze(t, e, r, l, g = 15) {
  if (l <= 0 || r <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const p = Math.max(0, t || 0), o = Math.max(0, e || 0), a = Math.floor(p / r), d = Math.ceil(o / r), n = Math.max(0, a - g), i = Math.min(l, a + d + g), f = n * r, u = Math.max(0, (l - i) * r);
  return { start: n, end: i, topPadding: f, bottomPadding: u };
}
function _i(t, e) {
  const r = Array.isArray(t) ? t.length : 0, l = e instanceof Set ? e : new Set(e || []);
  let g = 0;
  if (Array.isArray(t))
    for (let a = 0; a < t.length; a++)
      l.has(t[a]) && g++;
  else
    g = l.size;
  const p = r > 0 && g === r, o = g > 0 && g < r;
  return { totalCount: r, selectedCount: g, isAllSelected: p, isIndeterminate: o };
}
function tn(t, e, r) {
  const l = new Set(t);
  return e == null || ((r !== void 0 ? r : !l.has(e)) ? l.add(e) : l.delete(e)), l;
}
function en(t, e, r) {
  const l = new Set(t);
  if (!Array.isArray(e)) return l;
  if (r)
    for (let g = 0; g < e.length; g++)
      e[g] != null && l.add(e[g]);
  else
    for (let g = 0; g < e.length; g++)
      l.delete(e[g]);
  return l;
}
(function() {
  const t = "data-ln-table", e = "lnTable", r = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function d(h, _) {
    if (!h || !h.isDataDriven) return;
    const c = h.dom.hasAttribute("data-ln-table-window");
    if (c && !h._windowed)
      h._enterWindowedMode(), h._kickWindowInitial();
    else if (!c && h._windowed)
      h._exitWindowedMode();
    else if (c && h._windowed) {
      const s = parseInt(_, 10);
      s > 0 && h._cache.configure({ windowSize: s });
    }
  }
  function n(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const c = parseInt(_, 10);
    c > 0 && h._cache.configure({ pageSize: c });
  }
  function i(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const c = parseInt(_, 10);
    c >= 0 && h._cache.configure({ threshold: c });
  }
  function f(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const c = parseInt(_, 10);
    c >= 0 && h._cache.setGrandTotal(c);
  }
  const u = {
    "data-ln-table": { prop: "name", read: Q, fallback: "" },
    "data-ln-table-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-table-selectable": { prop: "_selectable", read: Kt },
    "data-ln-table-window": { effect: d },
    "data-ln-table-window-page": { effect: n },
    "data-ln-table-window-threshold": { effect: i },
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
  }, w = et(u);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(h, _) {
    if (h == null || isNaN(h)) return "";
    try {
      return new Intl.NumberFormat(rt(_)).format(h);
    } catch {
      return String(h);
    }
  }
  function S(h) {
    let _ = h.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const s = getComputedStyle(_).overflowY;
      if (s === "auto" || s === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function A(h) {
    this.dom = h, tt(this, h, w), this.table = h.querySelector("table"), this.tbody = h.querySelector("[data-ln-table-body]") || h.querySelector("tbody"), this.thead = h.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = h.querySelector("[data-ln-table-total]"), this._filteredSpan = h.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== h ? this._filteredSpan.parentElement : null), this._selectedSpan = h.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== h ? this._selectedSpan.parentElement : null), this.isDataDriven = h.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const c = this;
    return this._onSetSearch = function(s) {
      const m = (s.detail && s.detail.query != null ? s.detail.query : s.detail && s.detail.term != null ? s.detail.term : "").trim();
      c.isDataDriven ? (c.currentSearch = m, k(h, "ln-table:search", {
        table: c.name,
        query: c.currentSearch
      }), c._requestData()) : (c._searchTerm = m.toLowerCase(), c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), k(h, "ln-table:filter", {
        term: c._searchTerm,
        matched: c._filteredData.length,
        total: c._data.length
      }));
    }, h.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(s) {
      s.preventDefault(), c._onSetSearch(s);
    }, h.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      c.isDataDriven ? (c.currentFilters = {}, c.currentSearch = "", k(h, "ln-table:clear-filters", { table: c.name }), c._requestData()) : (c._searchTerm = "", c._columnFilters = {}, c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), k(h, "ln-table:filter", {
        term: "",
        matched: c._filteredData.length,
        total: c._data.length
      }));
    }, h.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && h.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(s) {
      const m = s.detail || {}, y = m.data || [], T = m.total != null ? m.total : y.length;
      if (!(c._hasInitialSeed && !c.isLoaded && y.length === 0 && T === 0)) {
        if (c._windowed) {
          c._cache.ingest(m) && !m.provisional && h.classList.remove("ln-table--loading");
          return;
        }
        c._data = y, c._lastTotal = T, c._lastFiltered = m.filtered != null ? m.filtered : c._data.length, c.totalCount = c._lastTotal, c.visibleCount = c._lastFiltered, c.isLoaded = !0, c._hasInitialSeed = !1, h.classList.remove("ln-table--loading"), c._vStart = -1, c._vEnd = -1, c._applyFilterAndSort(), c._render(), c._updateFooter(), k(h, "ln-table:rendered", {
          table: c.name,
          total: c.totalCount,
          visible: c.visibleCount
        });
      }
    }, h.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(s) {
      const m = s.detail && s.detail.loading;
      h.classList.toggle("ln-table--loading", !!m), m && (c.isLoaded = !1);
    }, h.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(s) {
      !c._windowed || !c._cache || c._cache.release(s.detail && s.detail.offset);
    }, h.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !c._windowed || !c._cache || c._cache.revalidate();
    }, h.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !c._windowed || !c._cache || c._requestData();
    }, h.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(s) {
      s.preventDefault(), c.currentSort = s.detail.direction === "none" ? null : { field: s.detail.field, direction: s.detail.direction }, c._requestData();
    }, h.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(s) {
      if (s.target.closest("[data-ln-table-row-select]") || s.target.closest("[data-ln-table-row-action]") || s.target.closest("a") || s.target.closest("button") || s.ctrlKey || s.metaKey || s.button === 1) return;
      const m = s.target.closest("[data-ln-table-row]");
      if (!m) return;
      const y = m.getAttribute("data-ln-table-row-id"), T = m._lnRecord || {};
      k(h, "ln-table:row-click", {
        table: c.name,
        id: y,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(s) {
      const m = s.target.closest("[data-ln-table-row-action]");
      if (!m) return;
      const y = m.closest("[data-ln-table-row]");
      if (!y) return;
      const T = m.getAttribute("data-ln-table-row-action"), b = y.getAttribute("data-ln-table-row-id"), E = y._lnRecord || {};
      k(h, "ln-table:row-action", {
        table: c.name,
        id: b,
        action: T,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : k(h, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      c.tbody.rows.length > 0 && (c._emptyTbodyObserver.disconnect(), c._emptyTbodyObserver = null, c._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(s) {
      s.preventDefault();
      const m = s.detail.direction === "none" ? null : s.detail.direction;
      c._sortCol = m === null ? -1 : s.detail.column, c._sortDir = m, c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), k(h, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: c._filteredData.length,
        total: c._data.length
      });
    }, h.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(s) {
      if (s.preventDefault(), !s.detail) return;
      const m = s.detail.key, y = s.detail.values || [];
      if (m) {
        if (y.length === 0)
          delete c._columnFilters[m];
        else {
          const T = [];
          for (let b = 0; b < y.length; b++)
            T.push(y[b].toLowerCase());
          c._columnFilters[m] = T;
        }
        c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), k(h, "ln-table:filter", {
          term: c._searchTerm,
          matched: c._filteredData.length,
          total: c._data.length
        });
      }
    }, h.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const h = this.tbody.rows, _ = this.ths;
    this._data = [], h.length > 0 && (this._rowHeight = h[0].offsetHeight || 40), this._lockColumnWidths();
    for (let c = 0; c < h.length; c++) {
      const s = h[c], m = [], y = [], T = [];
      for (let E = 0; E < s.cells.length; E++) {
        const C = s.cells[E], q = C.textContent.trim();
        m[E] = vt(C), y[E] = q.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(q.toLowerCase());
      }
      let b = null;
      if (this.isDataDriven) {
        b = {};
        const E = s.getAttribute("data-ln-table-row-id");
        E != null && (b.id = E);
        for (let C = 0; C < _.length; C++) {
          const q = _[C].getAttribute("data-ln-table-col");
          if (q) {
            const D = C;
            if (D < s.cells.length) {
              const I = s.cells[D];
              b[q] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: m,
        rawTexts: y,
        html: s.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && b ? b.id : void 0,
        ...b
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const h = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const c = document.createElement("col");
      c.style.width = _.offsetWidth + "px", h.appendChild(c);
    }), this.table.insertBefore(h, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = h;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const h = this._lastTotal, _ = this.visibleCount;
        if (h === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const h = this._filteredData.length;
        h === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : h > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const h = this._filteredData, _ = document.createDocumentFragment();
      for (let c = 0; c < h.length; c++) {
        const s = this._buildRow(h[c]);
        if (!s) break;
        _.appendChild(s);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const h = [], _ = this._filteredData;
      for (let c = 0; c < _.length; c++) h.push(_[c].html);
      this.tbody.innerHTML = h.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const h = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let c = null;
        if (this._windowed) {
          const s = this._cache ? this._cache.peek() : null;
          c = s ? this._buildRow(s) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (c = this._buildRow(this._data[0]));
        c && this.tbody && (this.tbody.appendChild(c), this._rowHeight = c.offsetHeight || 40, c.remove());
      }
    this.isDataDriven ? this._scrollContainer = S(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      h._rafId || (h._rafId = requestAnimationFrame(function() {
        h._rafId = null, h._windowed ? h._renderWindowed() : h._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const h = this._filteredData, _ = h.length, c = this._rowHeight;
    if (!c || !_) return;
    const s = this.thead ? this.thead.offsetHeight : 0, m = this._scrollContainer;
    let y, T;
    if (m) {
      const R = this.table.getBoundingClientRect(), O = m.getBoundingClientRect(), B = R.top - O.top + m.scrollTop + s;
      y = m.scrollTop - B, T = m.clientHeight;
    } else {
      const B = this.table.getBoundingClientRect().top + window.scrollY + s;
      y = window.scrollY - B, T = window.innerHeight;
    }
    const b = Ze(y, T, c, _, 15), E = b.start, C = b.end;
    if (E === this._vStart && C === this._vEnd) return;
    this._vStart = E, this._vEnd = C;
    const q = this.ths.length || 1, D = b.topPadding, I = b.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const B = document.createElement("td");
        B.setAttribute("colspan", q), B.style.height = D + "px", O.appendChild(B), R.appendChild(O);
      }
      for (let O = E; O < C; O++) {
        const B = this._buildRow(h[O]);
        B && R.appendChild(B);
      }
      if (I > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const B = document.createElement("td");
        B.setAttribute("colspan", q), B.style.height = I + "px", O.appendChild(B), R.appendChild(O);
      }
      this.tbody.replaceChildren(R), this._selectable && this._updateSelectAll();
    } else {
      let R = "";
      D > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>');
      for (let O = E; O < C; O++) R += h[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const h = document.createElement("tr");
    h.className = "ln-table__placeholder", h.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", h.appendChild(_), h;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const h = this._rowHeight;
    if (!h) return;
    const _ = this._cache.logicalTotal, c = this.thead ? this.thead.offsetHeight : 0, s = this._scrollContainer;
    let m, y;
    if (s) {
      const R = this.table.getBoundingClientRect(), O = s.getBoundingClientRect(), B = R.top - O.top + s.scrollTop + c;
      m = s.scrollTop - B, y = s.clientHeight;
    } else {
      const B = this.table.getBoundingClientRect().top + window.scrollY + c;
      m = window.scrollY - B, y = window.innerHeight;
    }
    const T = Ze(m, y, h, _, 15), b = T.start, E = T.end, C = this.ths.length || 1, q = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (q > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = q + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = b; R < E; R++)
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
    this.tbody.replaceChildren(I), this._vStart = b, this._vEnd = E, this._cache.ensure(b, E);
  }, A.prototype._showEmptyState = function() {
    const h = this.ths.length || 1;
    let _ = null, c = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount === 0 && s > 0, T = y ? this.name + "-empty-filtered" : this.name + "-empty";
      if (c = Ct(this.dom, T, "ln-table"), !c) {
        const b = this.dom.querySelector("template[data-ln-table-empty]");
        if (b) {
          const E = y ? "search" : "initial", C = b.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || b.content.firstElementChild;
          C && (c = document.importNode(C, !0));
        }
      }
      if (c)
        if (c.tagName === "TR")
          _ = c;
        else {
          const b = document.createElement("td");
          b.setAttribute("colspan", String(h)), b.appendChild(c);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(b), _ = E;
        }
    } else {
      const s = this.dom.querySelector("template[" + r + "]"), m = document.createElement("td");
      m.setAttribute("colspan", String(h)), s && m.appendChild(document.importNode(s.content, !0));
      const y = document.createElement("tr");
      y.className = "ln-table__empty", y.appendChild(m), _ = y;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(h, _) {
    jt(h, _);
    const c = h.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < c.length; s++) {
      const m = c[s], y = m.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < y.length; T++) {
        const b = y[T].trim().split(":");
        if (b.length !== 2) continue;
        const E = b[0].trim(), C = b[1].trim();
        _[E] != null && m.setAttribute(C, _[E]);
      }
    }
  }, A.prototype._buildRow = function(h) {
    let _ = Ct(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const s = this.dom.querySelector("template[data-ln-table-row]");
      s && (_ = document.importNode(s.content, !0));
    }
    let c = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (c)
      this._fillRow(c, h);
    else if (h && h.html) {
      const s = document.createElement("tbody");
      s.innerHTML = h.html, c = s.firstElementChild;
    } else {
      c = document.createElement("tr"), c.setAttribute("data-ln-table-row", "");
      const s = this.ths;
      for (let m = 0; m < s.length; m++) {
        const y = s[m].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (y) {
          const b = document.createElement("input");
          b.type = "checkbox", b.setAttribute("data-ln-table-row-select", ""), b.setAttribute("aria-label", "Select row"), T.appendChild(b);
        } else {
          const b = s[m].getAttribute("data-ln-table-col");
          b && h[b] != null && (T.textContent = String(h[b]));
        }
        c.appendChild(T);
      }
    }
    if (c._lnRecord = h, h.id != null && c.setAttribute("data-ln-table-row-id", h.id), this._selectable && h.id != null && this.selectedIds.has(String(h.id))) {
      c.classList.add("ln-row-selected");
      const s = c.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return c;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    cn(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const h = this, _ = this.dom, c = parseInt(_.getAttribute("data-ln-table-window"), 10), s = parseInt(_.getAttribute("data-ln-table-window-page"), 10), m = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !h._windowed || !h._cache || (h.totalCount = h._cache.grandTotal, h.visibleCount = h._cache.logicalTotal, h._lastTotal = h._cache.grandTotal, h.isLoaded = !0, h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), k(_, "ln-table:rendered", {
        table: h.name,
        total: h.totalCount,
        visible: h.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Sn({
      windowSize: c > 0 ? c : 1e3,
      pageSize: s > 0 ? s : 200,
      threshold: m >= 0 ? m : 25,
      fetchDebounce: 120,
      requestPage: function(y, T, b) {
        k(_, "ln-table:request-data", {
          table: h.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: T,
          limit: b,
          queryGen: h._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let h = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(h) && this._totalSpan) {
        const c = this._totalSpan.textContent.replace(/[^\d]/g, "");
        c && (h = parseInt(c, 10));
      }
      const _ = h > 0 ? h : this._data.length;
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
    const h = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let s = 0; s < h.length; s++) {
      const m = h[s].getAttribute("data-ln-table-row-id");
      m != null && _.push(m);
    }
    const c = _i(_, this.selectedIds);
    this._selectAllCheckbox.checked = c.isAllSelected, this._selectAllCheckbox.indeterminate = c.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const h = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < h.length; _++) {
      const c = h[_].getAttribute("data-ln-table-row-id"), s = c != null && this.selectedIds.has(c);
      h[_].classList.toggle("ln-row-selected", s);
      const m = h[_].querySelector("[data-ln-table-row-select]");
      m && (m.checked = s);
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
    const h = this;
    if (this._onSelectionChange = function(_) {
      const c = _.target.closest("[data-ln-table-row-select]");
      if (!c) return;
      const s = c.closest("[data-ln-table-row]");
      if (!s) return;
      const m = s.getAttribute("data-ln-table-row-id");
      m != null && (h.selectedIds = tn(h.selectedIds, m, c.checked), s.classList.toggle("ln-row-selected", c.checked), h.selectedCount = h.selectedIds.size, h._updateSelectAll(), h._updateFooter(), k(h.dom, "ln-table:select", {
        table: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const c = h.dom.querySelector('[data-ln-table-dict="select-all"]'), s = h.dom.getAttribute("data-ln-table-select-all-label") || (c ? c.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", s), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = h._selectAllCheckbox.checked, c = h.tbody ? h.tbody.querySelectorAll("[data-ln-table-row]") : [], s = [];
      for (let m = 0; m < c.length; m++) {
        const y = c[m].getAttribute("data-ln-table-row-id"), T = c[m].querySelector("[data-ln-table-row-select]");
        y != null && (s.push(y), c[m].classList.toggle("ln-row-selected", _), T && (T.checked = _));
      }
      h.selectedIds = en(h.selectedIds, s, _), h.selectedCount = h.selectedIds.size, k(h.dom, "ln-table:select-all", {
        table: h.name,
        selected: _
      }), k(h.dom, "ln-table:select", {
        table: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedCount
      }), h._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let c = 0; c < _.length; c++) {
        const s = _[c].querySelector("[data-ln-table-row-select]"), m = _[c].getAttribute("data-ln-table-row-id");
        s && s.checked && m != null && (h.selectedIds = tn(h.selectedIds, m, !0), _[c].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const h = this.dom.querySelector("[data-ln-table-col-select]");
    if (h) {
      const _ = h.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = en(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let c = 0; c < _.length; c++) {
        _[c].classList.remove("ln-row-selected");
        const s = _[c].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let h = 0, _ = 0;
    this.isDataDriven ? (h = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (h = this._data.length, _ = this._filteredData.length);
    const c = _ < h;
    if (this._totalSpan && (this._totalSpan.textContent = v(h, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = c ? v(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !c), this._selectedSpan) {
      const s = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = s > 0 ? v(s, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
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
  const r = {
    "data-ln-table-coordinator": {}
  };
  document.addEventListener("keydown", function(a) {
    if (a.key !== "/" || a.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const d = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!d) return;
    const n = d.tagName === "INPUT" || d.tagName === "TEXTAREA" ? d : d.querySelector('input[type="search"], input[type="text"], input');
    n && (a.preventDefault(), n.focus());
  });
  function l(a) {
    return this.dom = a, o(this), this;
  }
  function g(a, d) {
    const n = d ? '[data-ln-search-for="' + d + '"]' : "[data-ln-search-for]", i = a.querySelector(n) || document.querySelector(n);
    return i ? i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input, textarea") : null;
  }
  function p(a, d) {
    if (d) {
      const i = a.querySelectorAll('[data-ln-filter="' + d + '"]');
      if (i.length > 0) return i;
      const f = document.querySelectorAll('[data-ln-filter="' + d + '"]');
      if (f.length > 0) return f;
    }
    const n = a.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function o(a) {
    const d = a.dom;
    function n(i) {
      const f = i.target;
      if (f && f.hasAttribute && (f.hasAttribute("data-ln-table") || f.tagName === "TABLE")) return f;
      const u = i.detail && i.detail.targetId || f && f.id;
      return u ? d.querySelector('[data-ln-table-source="' + u + '"]') || d.querySelector('[data-ln-table="' + u + '"]') || d.querySelector("#" + u) || (d.id === u ? d : null) || document.getElementById(u) : null;
    }
    a._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(i) {
        if (!i.detail) return;
        const f = n(i);
        if (!f) return;
        const u = i.detail.key, w = i.detail.values || [], v = f.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === u) {
            const h = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            h && h.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(i) {
        const f = i.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!f) return;
        const u = f.closest("[data-ln-table], table") || d.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, v = u.querySelectorAll("th");
        for (let _ = 0; _ < v.length; _++) {
          const c = v[_].querySelector("[data-ln-table-col-filter], .table-filter");
          c && c.classList.remove("ln-filter-active");
        }
        const S = u.getAttribute("data-ln-table-source") || u.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const _ = g(d, S);
          _ && _.value !== "" && (_.value = "", _.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const h = p(d, S);
        for (let _ = 0; _ < h.length; _++) {
          const c = h[_].querySelector("[data-ln-filter-reset]");
          if (!c) continue;
          const s = h[_].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!c.checked || s) && (c.checked = !0, c.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && k(u, "ln-table:request-clear-filters", { table: w });
      }
    }, d.addEventListener("ln-filter:change", a._handlers.filter), d.addEventListener("click", a._handlers.clear);
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, l, "ln-table-coordinator", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", r = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function d(s, m) {
    if (!s || !s.isDataDriven) return;
    const y = s.dom.hasAttribute("data-ln-list-window");
    if (y && !s._windowed)
      s._enterWindowedMode(), s._kickWindowInitial();
    else if (!y && s._windowed)
      s._exitWindowedMode();
    else if (y && s._windowed) {
      const T = parseInt(m, 10);
      T > 0 && s._cache.configure({ windowSize: T });
    }
  }
  function n(s, m) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const y = parseInt(m, 10);
    y > 0 && s._cache.configure({ pageSize: y });
  }
  function i(s, m) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const y = parseInt(m, 10);
    y >= 0 && s._cache.configure({ threshold: y });
  }
  function f(s, m) {
    if (!s || !s.isDataDriven || !s._windowed || !s._cache) return;
    const y = parseInt(m, 10);
    y >= 0 && s._cache.setGrandTotal(y);
  }
  const u = {
    "data-ln-list": { prop: "name", read: Q, fallback: "" },
    "data-ln-list-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-list-selectable": { prop: "_selectable", read: Kt },
    "data-ln-list-window": { effect: d },
    "data-ln-list-window-page": { effect: n },
    "data-ln-list-window-threshold": { effect: i },
    "data-ln-list-count": { effect: f },
    "data-ln-list-empty": {},
    "data-ln-list-field": {}
  }, w = et(u);
  function v(s, m) {
    if (s == null || isNaN(s)) return "";
    try {
      return new Intl.NumberFormat(rt(m)).format(s);
    } catch {
      return String(s);
    }
  }
  function S(s) {
    let m = s;
    for (; m && m !== document.body && m !== document.documentElement; ) {
      const T = getComputedStyle(m).overflowY;
      if (T === "auto" || T === "scroll") return m;
      m = m.parentElement;
    }
    return null;
  }
  function A(s) {
    const m = s._scrollContainer || S(s.dom);
    return {
      container: m,
      top: m ? m.scrollTop : window.scrollY
    };
  }
  function h(s) {
    s.container ? s.container.scrollTop = s.top : window.scrollTo(window.scrollX, s.top);
  }
  function _(s) {
    if (!s) return 0;
    const m = getComputedStyle(s), y = parseFloat(m.marginTop) || 0, T = parseFloat(m.marginBottom) || 0;
    return s.offsetHeight + y + T;
  }
  function c(s) {
    this.dom = s, tt(this, s, w), this.tbody = s.querySelector("[data-ln-list-body]") || s, this.isDataDriven = s.hasAttribute("data-ln-list-source"), this._totalSpan = s.querySelector("[data-ln-list-total]"), this._filteredSpan = s.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== s ? this._filteredSpan.parentElement : null), this._selectedSpan = s.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== s ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const m = this;
    return this._onSetSearch = function(y) {
      const T = (y.detail && y.detail.query != null ? y.detail.query : y.detail && y.detail.term != null ? y.detail.term : "").trim();
      m.isDataDriven ? (m.currentSearch = T, k(s, "ln-list:search", {
        list: m.name,
        query: m.currentSearch
      }), m._requestData()) : (m._searchTerm = T.toLowerCase(), m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(s, "ln-list:filter", {
        term: m._searchTerm,
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, s.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(y) {
      y.preventDefault(), m._onSetSearch(y);
    }, s.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      m.isDataDriven ? (m.currentFilters = {}, m.currentSearch = "", k(s, "ln-list:clear-filters", { list: m.name }), m._requestData()) : (m._searchTerm = "", m._filters = {}, m._sortField = null, m._sortDir = null, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(s, "ln-list:filter", {
        term: "",
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, s.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, s.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(y) {
      const T = y.detail || {}, b = T.data || [], E = T.total != null ? T.total : b.length;
      if (!(m._hasInitialSeed && !m.isLoaded && b.length === 0 && E === 0)) {
        if (m._windowed) {
          m._cache.ingest(T) && !T.provisional && s.classList.remove("ln-list--loading");
          return;
        }
        m._data = b, m._lastTotal = E, m._lastFiltered = T.filtered != null ? T.filtered : m._data.length, m.totalCount = m._lastTotal, m.visibleCount = m._lastFiltered, m.isLoaded = !0, m._hasInitialSeed = !1, s.classList.remove("ln-list--loading"), m._vStart = -1, m._vEnd = -1, m._applyFilterAndSort(), m._render(), m._updateFooter(), k(s, "ln-list:rendered", {
          list: m.name,
          total: m.totalCount,
          visible: m.visibleCount
        });
      }
    }, s.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(y) {
      const T = y.detail && y.detail.loading;
      s.classList.toggle("ln-list--loading", !!T), T && (m.isLoaded = !1);
    }, s.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(y) {
      !m._windowed || !m._cache || m._cache.release(y.detail && y.detail.offset);
    }, s.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !m._windowed || !m._cache || m._cache.revalidate();
    }, s.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !m._windowed || !m._cache || m._requestData();
    }, s.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(y) {
      y.detail.field != null && (y.preventDefault(), m.currentSort = y.detail.direction === "none" ? null : { field: y.detail.field, direction: y.detail.direction }, m._requestData());
    }, s.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(y) {
      if (y.target.closest("[data-ln-item-select]") || y.target.closest("[data-ln-item-action]") || y.target.closest("a") || y.target.closest("button") || y.ctrlKey || y.metaKey || y.button === 1) return;
      const T = y.target.closest("[data-ln-item]");
      if (!T) return;
      const b = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      k(s, "ln-list:item-click", {
        list: m.name,
        id: b,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(y) {
      const T = y.target.closest("[data-ln-item-action]");
      if (!T) return;
      const b = T.closest("[data-ln-item]");
      if (!b) return;
      const E = T.getAttribute("data-ln-item-action"), C = b.getAttribute("data-ln-item-id"), q = b._lnRecord || {};
      k(s, "ln-list:item-action", {
        list: m.name,
        id: C,
        action: E,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : k(s, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      m.tbody.children.length > 0 && (m._emptyObserver.disconnect(), m._emptyObserver = null, m._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(y) {
      if (y.preventDefault(), !y.detail) return;
      const T = y.detail.key, b = y.detail.values || [];
      if (T) {
        if (b.length === 0)
          delete m._filters[T];
        else {
          const E = [];
          for (let C = 0; C < b.length; C++)
            E.push(b[C].toLowerCase());
          m._filters[T] = E;
        }
        m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(s, "ln-list:filter", {
          term: m._searchTerm,
          matched: m._filteredData.length,
          total: m._data.length
        });
      }
    }, s.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(y) {
      if (y.detail && y.detail.field == null) return;
      y.preventDefault();
      const T = y.detail && y.detail.direction === "none" ? null : y.detail && y.detail.direction;
      m._sortField = T === null ? null : y.detail && y.detail.field, m._sortDir = T, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(s, "ln-list:sorted", {
        field: m._sortField,
        direction: y.detail && y.detail.direction,
        matched: m._filteredData.length,
        total: m._data.length
      });
    }, s.addEventListener("ln-sort:change", this._onSort)), this;
  }
  c.prototype._parseChildren = function() {
    const s = Array.from(this.tbody.children).filter((m) => !m.classList.contains("ln-list__spacer"));
    this._data = [], s.length > 0 && (this._itemHeight = _(s[0]) || 50);
    for (let m = 0; m < s.length; m++) {
      const y = s[m], T = y.getAttribute("data-ln-item-id") || y.getAttribute("id"), b = y.textContent.trim().toLowerCase();
      let E = null;
      if (this.isDataDriven) {
        E = {}, T != null && (E.id = T);
        const D = y.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (E[O] = vt(R));
        }
      }
      const C = {}, q = y.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < q.length; D++) {
        const I = q[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
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
        searchText: b,
        fields: C,
        ...E || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, c.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const s = this._searchTerm, m = s ? s.split(/\s+/).filter(Boolean) : [], y = this._filters || {}, T = Object.keys(y).length > 0;
      if (m.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(b) {
        if (m.length > 0 && !m.every(function(C) {
          return b.searchText && b.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in y) {
            const C = y[E];
            if (C && C.length > 0) {
              const q = b.fields && b.fields[E] !== void 0 ? b.fields[E] : b[E] !== void 0 ? b[E] : null, D = q != null ? String(q).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const b = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(I) {
          return I.fields && I.fields[b] !== void 0 ? I.fields[b] : I[b];
        }), D = Te(q);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[b] !== void 0 ? I.fields[b] : I[b], B = R.fields && R.fields[b] !== void 0 ? R.fields[b] : R[b];
          return Le(O, B, D, C) * E;
        });
      }
    }
  }, c.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const s = this._lastTotal, m = this.visibleCount;
        if (s === 0 || this._filteredData.length === 0 || m === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const s = this._filteredData.length;
        s === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : s > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, c.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const s = this._filteredData, m = document.createDocumentFragment();
      for (let T = 0; T < s.length; T++) {
        const b = this._buildItem(s[T]);
        b && m.appendChild(b);
      }
      const y = A(this);
      this.tbody.replaceChildren(m), h(y), this._selectable && this._updateSelectAll();
    } else {
      const s = [], m = this._filteredData;
      for (let T = 0; T < m.length; T++) s.push(m[T].html);
      const y = A(this);
      this.tbody.innerHTML = s.join(""), h(y), this._selectable && this._restoreSelection();
    }
  }, c.prototype._readGridLayout = function() {
    const s = getComputedStyle(this.tbody), m = s.gridTemplateColumns;
    let y = 1;
    if (m && m !== "none") {
      const b = m.trim().split(/\s+/).filter(Boolean);
      b.length > 0 && (y = b.length);
    }
    const T = parseFloat(s.rowGap);
    return { columns: y, rowGap: isNaN(T) ? 0 : T };
  }, c.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const s = this._cache.peek(), m = s ? this._buildItem(s) : this._buildPlaceholderItem();
      m && (this.tbody.textContent = "", this.tbody.appendChild(m), this._itemHeight = _(m) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const s = this._buildItem(this._data[0]);
        s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._itemHeight = _(s) || 50, this.tbody.textContent = "");
      }
    } else {
      const s = this.tbody.children;
      s.length > 0 && (this._itemHeight = _(s[0]) || 50);
    }
  }, c.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const s = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const m = this._scrollContainer || window;
    this._scrollHandler = function() {
      s._rafId || (s._rafId = requestAnimationFrame(function() {
        s._rafId = null, s._windowed ? s._renderWindowed() : s._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      s._itemHeight = 0, s._measureItemHeight(), s._vStart = -1, s._vEnd = -1, s._windowed ? s._renderWindowed() : s._renderVirtual();
    }, m.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, c.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, c.prototype._renderVirtual = function() {
    const s = this._filteredData, m = s.length, y = this._itemHeight;
    if (!y || !m) return;
    const T = this._scrollContainer;
    let b, E;
    if (T) {
      const X = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : X.top - V.top + T.scrollTop;
      b = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), q = C.columns, D = C.rowGap, I = y + D, R = Math.ceil(m / q);
    let O = Math.max(0, Math.floor(b / I) - 15);
    O = Math.min(O, R);
    const B = Math.ceil(E / I) + 30, P = Math.min(O + B, R), H = Math.min(O * q, m), z = Math.min(P * q, m);
    if (H === this._vStart && z === this._vEnd) return;
    this._vStart = H, this._vEnd = z;
    const $ = O * I, Y = (R - P) * I;
    if (this.isDataDriven) {
      const X = document.createDocumentFragment();
      if ($ > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = $ + "px", X.appendChild(G);
      }
      for (let G = H; G < z; G++) {
        const ht = this._buildItem(s[G]);
        ht && X.appendChild(ht);
      }
      if (Y > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Y + "px", X.appendChild(G);
      }
      const V = A(this);
      this.tbody.replaceChildren(X), h(V), this._selectable && this._updateSelectAll();
    } else {
      let X = "";
      $ > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${$}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = H; G < z; G++)
        X += s[G].html;
      Y > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Y}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = X, h(V), this._selectable && this._restoreSelection();
    }
  }, c.prototype._buildPlaceholderItem = function() {
    const s = document.createElement(this.isUl ? "li" : "div");
    return s.className = "ln-list__placeholder", s.setAttribute("aria-hidden", "true"), s.style.height = this._itemHeight + "px", s;
  }, c.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const s = this._itemHeight;
    if (!s) return;
    const m = this._scrollContainer;
    let y, T;
    if (m) {
      const V = this.tbody.getBoundingClientRect(), G = m.getBoundingClientRect(), ht = m === this.tbody ? 0 : V.top - G.top + m.scrollTop;
      y = m.scrollTop - ht, T = m.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - G, T = window.innerHeight;
    }
    const b = this._readGridLayout(), E = b.columns, C = b.rowGap, q = s + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
    let R = Math.max(0, Math.floor(y / q) - 15);
    R = Math.min(R, I);
    const O = Math.ceil(T / q) + 30, B = Math.min(R + O, I), P = Math.min(R * E, D), H = Math.min(B * E, D), z = R * q, $ = (I - B) * q, Y = document.createDocumentFragment();
    if (z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = z + "px", Y.appendChild(V);
    }
    for (let V = P; V < H; V++)
      if (this._cache.has(V)) {
        const G = this._buildItem(this._cache.get(V));
        G && Y.appendChild(G);
      } else
        Y.appendChild(this._buildPlaceholderItem());
    if ($ > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = $ + "px", Y.appendChild(V);
    }
    const X = A(this);
    this.tbody.replaceChildren(Y), h(X), this._vStart = P, this._vEnd = H, this._cache.ensure(P, H);
  }, c.prototype._showEmptyState = function() {
    let s = null;
    if (this.isDataDriven) {
      const m = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && m > 0, b = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (s = Ct(this.dom, b, "ln-list"), !s) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", q = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          q && (s = document.importNode(q, !0));
        }
      }
    } else {
      const m = this.dom.querySelector(`template[${r}]`);
      if (m) {
        const y = m.content.firstElementChild;
        y && (s = document.importNode(y, !0));
      }
    }
    if (s)
      if (s.tagName === "LI" || s.tagName === "TR")
        this.tbody.replaceChildren(s);
      else {
        const m = document.createElement(this.isUl ? "li" : "div");
        m.appendChild(s), this.tbody.replaceChildren(m);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, c.prototype._buildItem = function(s) {
    let m = Ct(this.dom, this.name + "-row", "ln-list");
    if (!m) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (m = document.importNode(T.content, !0));
    }
    let y = m ? m.querySelector("[data-ln-item]") || m.firstElementChild : null;
    if (y)
      jt(y, s), pt(y, s);
    else if (s && s.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = s.html, y = T.firstElementChild;
    } else if (y = document.createElement(this.isUl ? "li" : "div"), y.setAttribute("data-ln-item", ""), s && typeof s == "object") {
      for (const T in s)
        if (T !== "html" && s[T] != null) {
          const b = document.createElement("span");
          b.setAttribute("data-ln-field", T), b.textContent = String(s[T]), y.appendChild(b);
        }
    }
    if (y._lnRecord = s, s && s.id != null && (y.setAttribute("data-ln-item-id", s.id), this._selectable && this.selectedIds.has(String(s.id)))) {
      y.classList.add("ln-item-selected");
      const T = y.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return y;
  }, c.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const s = this.tbody.querySelectorAll("[data-ln-item]");
    for (let m = 0; m < s.length; m++) {
      const y = s[m].getAttribute("data-ln-item-id"), T = y != null && this.selectedIds.has(String(y));
      s[m].classList.toggle("ln-item-selected", T);
      const b = s[m].querySelector("[data-ln-item-select]");
      b && (b.checked = T);
    }
    this._updateSelectAll();
  }, c.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const s = this;
    this._onSelectionChange = function(m) {
      const y = m.target.closest("[data-ln-item-select]");
      if (!y) return;
      const T = y.closest("[data-ln-item]");
      if (!T) return;
      const b = T.getAttribute("data-ln-item-id");
      b != null && (y.checked ? (s.selectedIds.add(String(b)), T.classList.add("ln-item-selected")) : (s.selectedIds.delete(String(b)), T.classList.remove("ln-item-selected")), s._updateSelectAll(), s._updateFooter(), k(s.dom, "ln-list:select", {
        list: s.name,
        selectedIds: s.selectedIds,
        count: s.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const m = s._selectAllCheckbox.checked, y = s.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < y.length; T++) {
        const b = y[T], E = b.getAttribute("data-ln-item-id"), C = b.querySelector("[data-ln-item-select]");
        E != null && (m ? (s.selectedIds.add(String(E)), b.classList.add("ln-item-selected")) : (s.selectedIds.delete(String(E)), b.classList.remove("ln-item-selected")), C && (C.checked = m));
      }
      k(s.dom, "ln-list:select-all", { list: s.name, selected: m }), k(s.dom, "ln-list:select", {
        list: s.name,
        selectedIds: s.selectedIds,
        count: s.selectedIds.size
      }), s._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, c.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const s = this.tbody.querySelectorAll("[data-ln-item]");
    let m = s.length > 0;
    for (let y = 0; y < s.length; y++) {
      const T = s[y].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        m = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = m;
  }, c.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    cn(this, "ln-list:request-data", "list");
  }, c.prototype._enterWindowedMode = function() {
    const s = this, m = this.dom, y = parseInt(m.getAttribute("data-ln-list-window"), 10), T = parseInt(m.getAttribute("data-ln-list-window-page"), 10), b = parseInt(m.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !s._windowed || !s._cache || (s.totalCount = s._cache.grandTotal, s.visibleCount = s._cache.logicalTotal, s._lastTotal = s._cache.grandTotal, s.isLoaded = !0, s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), k(m, "ln-list:rendered", {
        list: s.name,
        total: s.totalCount,
        visible: s.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = Sn({
      windowSize: y > 0 ? y : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: b >= 0 ? b : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, q) {
        k(m, "ln-list:request-data", {
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
  }, c.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const s = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), m = s > 0 ? s : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: m,
        filtered: m
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, c.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, c.prototype._updateFooter = function() {
    let s = 0, m = 0;
    this.isDataDriven ? (s = this._lastTotal != null ? this._lastTotal : this._data.length, m = this.visibleCount) : (s = this._data.length, m = this._filteredData.length);
    const y = m < s;
    if (this._totalSpan && (this._totalSpan.textContent = v(s, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = y ? v(m, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !y), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, c.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, c, "ln-list", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function r(u) {
    const w = u[e];
    w && f.call(w);
  }
  const l = {
    "data-ln-circular-progress": { effect: r },
    "data-ln-circular-progress-max": { effect: r },
    "data-ln-circular-progress-label": { effect: r }
  }, g = "http://www.w3.org/2000/svg", p = 36, o = 16, a = 2 * Math.PI * o;
  function d(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, i.call(this), f.call(this), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(u, w) {
    const v = document.createElementNS(g, u);
    for (const [S, A] of Object.entries(w))
      v.setAttribute(S, A);
    return v;
  }
  function i() {
    this.svg = n("svg", {
      viewBox: "0 0 " + p + " " + p,
      width: p,
      height: p
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: o,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: o,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": a,
      "stroke-dashoffset": a,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function f() {
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = qn(u, w || 100), S = a - v.percentage / 100 * a;
    this.progressCircle.setAttribute("stroke-dashoffset", S);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), h = A !== null ? A : Math.round(v.percentage) + "%";
    this.labelEl.textContent = h, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", h), k(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  j(t, e, d, "ln-circular-progress", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", r = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-sortable": { effect: p },
    "data-ln-sortable-handle": {}
  };
  function g(o) {
    this.dom = o, this.isEnabled = o.getAttribute(t) !== "disabled", this._dragging = null, o.setAttribute("aria-roledescription", "sortable list");
    const a = this;
    return this._onPointerDown = function(d) {
      a.isEnabled && a._handlePointerDown(d);
    }, o.addEventListener("pointerdown", this._onPointerDown), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), k(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, g.prototype._handlePointerDown = function(o) {
    let a = o.target.closest("[" + r + "]"), d;
    if (a) {
      for (d = a; d && d.parentElement !== this.dom; )
        d = d.parentElement;
      if (!d || d.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + r + "]")) return;
      for (d = o.target; d && d.parentElement !== this.dom; )
        d = d.parentElement;
      if (!d || d.parentElement !== this.dom) return;
      a = d;
    }
    const i = Array.from(this.dom.children).indexOf(d);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: d,
      index: i
    }).defaultPrevented) return;
    o.preventDefault(), a.setPointerCapture(o.pointerId), this._dragging = d, d.classList.add("ln-sortable--dragging"), d.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: d,
      index: i
    });
    const u = this, w = function(S) {
      u._handlePointerMove(S);
    }, v = function(S) {
      u._handlePointerEnd(S), a.removeEventListener("pointermove", w), a.removeEventListener("pointerup", v), a.removeEventListener("pointercancel", v);
    };
    a.addEventListener("pointermove", w), a.addEventListener("pointerup", v), a.addEventListener("pointercancel", v);
  }, g.prototype._handlePointerMove = function(o) {
    if (!this._dragging) return;
    const a = Array.from(this.dom.children), d = this._dragging;
    for (const n of a)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of a) {
      if (n === d) continue;
      const i = n.getBoundingClientRect(), f = i.top + i.height / 2;
      if (o.clientY >= i.top && o.clientY < f) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (o.clientY >= f && o.clientY <= i.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, g.prototype._handlePointerEnd = function(o) {
    if (!this._dragging) return;
    const a = this._dragging, d = Array.from(this.dom.children), n = d.indexOf(a);
    let i = null, f = null;
    for (const u of d) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        i = u, f = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        i = u, f = "after";
        break;
      }
    }
    for (const u of d)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (a.classList.remove("ln-sortable--dragging"), a.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== a) {
      f === "before" ? this.dom.insertBefore(a, i) : this.dom.insertBefore(a, i.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(a);
      k(this.dom, "ln-sortable:reordered", {
        item: a,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function p(o) {
    const a = o[e];
    if (!a) return;
    const d = o.getAttribute(t) !== "disabled";
    d !== a.isEnabled && (a.isEnabled = d, k(o, d ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: o }));
  }
  j(t, e, g, "ln-sortable", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", r = "data-ln-picklist-list", l = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-picklist": { effect: a },
    "data-ln-picklist-max": { effect: d },
    "data-ln-picklist-list": {}
  };
  function p(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = o(n), this.available = n.querySelector("[" + r + '="available"]'), this.selected = n.querySelector("[" + r + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + r + '="available"] and [' + r + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const i of [this.available, this.selected])
      for (const f of i.children)
        this._initial.push(f);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), k(this.dom, "ln-picklist:destroyed", { target: this.dom }), delete this.dom[e]);
  }, p.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, p.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, p.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let f = 0; f < n.length; f++)
      this._initial.includes(n[f]) || this._initial.push(n[f]);
    let i = 0;
    for (let f = 0; f < this._initial.length; f++) {
      const u = this._initial[f];
      if (!u.isConnected) continue;
      const w = u.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || i < this.max ? (v = this.selected, i++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(u);
    }
  }, p.prototype._onFormReset = function(n) {
    const i = this;
    setTimeout(function() {
      i._destroyed || n.defaultPrevented || i.sync();
    }, 0);
  }, p.prototype._onChange = function(n) {
    const i = n.target.closest('input[type="checkbox"]');
    if (!i) return;
    const f = i.closest("li");
    if (!f) return;
    const u = f.parentElement;
    if (u !== this.available && u !== this.selected) return;
    if (!this.isEnabled) {
      i.checked = !i.checked;
      return;
    }
    const w = i.checked ? this.selected : this.available;
    if (u === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      i.checked = !i.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: f,
        checkbox: i,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: f, from: u, to: w, checkbox: i };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      i.checked = !i.checked;
      return;
    }
    const S = document.activeElement === i;
    w.appendChild(f), S && i.focus(), k(this.dom, "ln-picklist:move", v);
  };
  function o(n) {
    const i = n.getAttribute(l);
    if (i === null || i === "") return null;
    const f = parseInt(i, 10);
    return isNaN(f) || f < 0 ? null : f;
  }
  function a(n) {
    const i = n[e];
    if (!i) return;
    const f = n.getAttribute(t) !== "disabled";
    f !== i.isEnabled && (i.isEnabled = f, k(n, f ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function d(n) {
    const i = n[e];
    i && (i.max = o(n));
  }
  j(t, e, p, "ln-picklist", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", r = "data-ln-confirm-state", l = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function p(f, u, w) {
    return f.getAttribute(u) || w;
  }
  function o(f, u, w) {
    const v = parseFloat(f.getAttribute(u));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function a(f) {
    const u = document.createElement("span");
    return u.setAttribute(l, ""), u.setAttribute("role", "alert"), u.textContent = f, u;
  }
  const d = {
    "data-ln-confirm": { prop: "confirmText", read: p, fallback: "Confirm?" },
    "data-ln-confirm-timeout": { prop: "timeout", read: o, fallback: 3 },
    "data-ln-confirm-state": { prop: "confirming", read: Kt }
  }, n = et(d);
  function i(f) {
    this.dom = f, tt(this, f, n), this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : f.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!dn(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, w.stopPropagation(), u._reset();
        }
    }, f.addEventListener("click", this._onClick), this;
  }
  i.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(r, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const f = this.activeEl ? this.activeEl.textContent.trim() : "";
      f && (this.dom.setAttribute("aria-label", f), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(a(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, i.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, u);
  }, i.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(r), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + l + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, i.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], k(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, j(t, e, i, "ln-confirm", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const r = {
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
  }, l = et(r), g = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(o) {
    if (this.dom = o, tt(this, o, l), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = o.querySelector("[data-ln-translations-active]"), this.menuEl = o.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = g, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const a = this;
    return this._onRequestAdd = function(d) {
      d.detail && d.detail.lang && a.addLanguage(d.detail.lang);
    }, this._onRequestRemove = function(d) {
      d.detail && d.detail.lang && a.removeLanguage(d.detail.lang);
    }, o.addEventListener("ln-translations:request-add", this._onRequestAdd), o.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const a of o) {
      const d = a.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of d)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const o = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of o) {
      const d = a.getAttribute("data-ln-translatable-lang");
      d && d !== this.defaultLang && this.activeLanguages.add(d);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const o = this;
    let a = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      a++;
      const i = Jt("ln-translations-menu-item", "ln-translations");
      if (!i) return;
      const f = i.querySelector("[data-ln-translations-lang]");
      f.setAttribute("data-ln-translations-lang", n), f.textContent = this.locales[n], f.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), o.menuEl.getAttribute("data-ln-toggle") === "open" && o.menuEl.setAttribute("data-ln-toggle", "close"), o.addLanguage(n));
      }), this.menuEl.appendChild(i);
    }
    const d = this.dom.querySelector("[data-ln-translations-add]");
    d && (d.hidden = a === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const o = this;
    this.activeLanguages.forEach(function(a) {
      const d = Jt("ln-translations-badge", "ln-translations");
      if (!d) return;
      const n = d.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", a);
      const i = n.querySelector("span");
      i.textContent = o.locales[a] || a.toUpperCase();
      const f = n.querySelector("button"), u = o.locales[a] || a.toUpperCase();
      f.setAttribute("aria-label", o.removeLabel.replace("{lang}", u)), f.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), o.removeLanguage(a));
      }), o.badgesEl.appendChild(d);
    });
  }, p.prototype.addLanguage = function(o, a) {
    if (this.activeLanguages.has(o)) return;
    const d = this.locales[o] || o;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: o,
      langName: d
    }).defaultPrevented) return;
    this.activeLanguages.add(o), a = a || {};
    const i = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of i) {
      const u = f.getAttribute("data-ln-translatable"), w = f.getAttribute("data-ln-translations-prefix") || "", v = f.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + o + "][" + u + "]" : S.name = "trans[" + o + "][" + u + "]", S.value = a[u] !== void 0 ? a[u] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", d)), S.setAttribute("data-ln-translatable-lang", o);
      const A = f.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), h = A.length > 0 ? A[A.length - 1] : v;
      h.parentNode.insertBefore(S, h.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: o,
      langName: d
    });
  }, p.prototype.removeLanguage = function(o) {
    if (!this.activeLanguages.has(o) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: o
    }).defaultPrevented) return;
    const d = this.dom.querySelectorAll('[data-ln-translatable-lang="' + o + '"]');
    for (const n of d)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(o), this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: o
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(o) {
    return this.activeLanguages.has(o);
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this.defaultLang, a = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const d of a)
      d.getAttribute("data-ln-translatable-lang") !== o && d.parentNode.removeChild(d);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, p, "ln-translations", {
    attributes: r
  });
})();
const bi = "ln-autosave:", yi = 1e3;
function vi(t, e) {
  return e ? bi + (t || "") + ":" + e : null;
}
function wi(t, e = yi) {
  if (t == null) return 0;
  if (t === "") return e;
  const r = parseInt(String(t), 10);
  return isNaN(r) || r < 0 ? e : r;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", r = "data-ln-autosave-clear", l = "data-ln-autosave-debounce-input", g = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-autosave": {},
    "data-ln-autosave-debounce-input": {},
    "data-ln-autosave-clear": {},
    "data-ln-autosave-exclude": {}
  };
  function o(d) {
    const n = d.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function a(d) {
    const i = d.getAttribute(t) || d.id, f = vi(window.location.pathname, i);
    if (!f) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = f;
    let u = null;
    function w() {
      const h = hn(d, { exclude: g });
      try {
        localStorage.setItem(f, JSON.stringify(h));
      } catch {
        return;
      }
      k(d, "ln-autosave:saved", { target: d, data: h });
    }
    function v() {
      let h;
      try {
        h = localStorage.getItem(f);
      } catch {
        return;
      }
      if (!h) return;
      let _;
      try {
        _ = JSON.parse(h);
      } catch {
        return;
      }
      if (Z(d, "ln-autosave:before-restore", { target: d, data: _ }).defaultPrevented) return;
      const s = fn(d, _);
      for (let m = 0; m < s.length; m++)
        s[m].dispatchEvent(new Event("input", { bubbles: !0 })), s[m].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(d, "ln-autosave:restored", { target: d, data: _ });
    }
    function S() {
      try {
        localStorage.removeItem(f);
      } catch {
        return;
      }
      k(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(h) {
      const _ = h.target;
      o(_) && _.name && !_.matches(g) && w();
    }, this._onChange = function(h) {
      const _ = h.target;
      o(_) && _.name && !_.matches(g) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(h) {
      h.target.closest("[" + r + "]") && S();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const A = wi(d.getAttribute(l));
    return A > 0 && (this._onInput = function(h) {
      const _ = h.target;
      !o(_) || !_.name || _.matches(g) || (u !== null && clearTimeout(u), u = setTimeout(w, A));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, v(), this;
  }
  a.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      k(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, a, "ln-autosave", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-autoresize": {}
  };
  function l(g) {
    if (g.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", g.tagName), this;
    this.dom = g;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, g.addEventListener("input", this._onInput), this._resize(), this;
  }
  l.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, l, "ln-autoresize", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-editor": {},
    "data-ln-editor-action": {},
    "data-ln-editor-source": {}
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
  }, g = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, p = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, o = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let a = 0;
  function d(h) {
    return !!(g[h] || p[h] || o[h] || h === "link");
  }
  function n(h) {
    this.dom = h;
    const _ = this;
    if (this._textarea = h.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", h), this;
    const c = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), c && this._surface.setAttribute("data-placeholder", c);
    const s = this._textarea.id;
    if (s) {
      const b = h.querySelector('label[for="' + s + '"]');
      b && (b.id || (b.id = s + "-label"), this._surface.setAttribute("aria-labelledby", b.id));
    }
    this._surface.id = s ? s + "-surface" : "ln-editor-surface-" + ++a;
    const m = this._textarea.value.trim();
    m && (this._surface.innerHTML = m);
    const y = h.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? h.insertBefore(this._surface, y.nextSibling) : h.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const b = y.querySelectorAll("[data-ln-editor-action]");
      for (let E = 0; E < b.length; E++) {
        const C = b[E].getAttribute("data-ln-editor-action");
        d(C) && b[E].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      _._syncToTextarea(), k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      });
    }, this._onMousedownToolbar = function(b) {
      b.target.closest("[data-ln-editor-action]") && b.preventDefault();
    }, this._onClickToolbar = function(b) {
      const E = b.target.closest("[data-ln-editor-action]");
      if (!E) return;
      const C = E.getAttribute("data-ln-editor-action");
      _._execAction(C);
    }, this._onPaste = function(b) {
      u(_, b);
    }, this._onKeydown = function(b) {
      S(_, b);
    }, this._onSelectionChange = function() {
      document.contains(_._surface) && _._updateActiveStates();
    }, this._onFocus = function() {
      k(_.dom, "ln-editor:focus", { target: _.dom });
    }, this._onBlur = function() {
      _._syncToTextarea(), k(_.dom, "ln-editor:blur", { target: _.dom });
    }, this._onTextareaInput = function() {
      _._surface.innerHTML !== _._textarea.value && (_._surface.innerHTML = _._textarea.value, k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(b) {
      const E = b.detail && b.detail.html;
      E !== void 0 && (_._surface.innerHTML = E, _._syncToTextarea(), k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, h.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        _._surface.innerHTML = _._textarea.value, k(h, "ln-editor:changed", {
          html: _._textarea.value,
          target: h
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(h) {
    if (!(!h || Z(this.dom, "ln-editor:before-change", {
      action: h,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), g[h])
        document.execCommand(g[h], !1, null);
      else if (p[h]) {
        const c = p[h], s = i(this._surface);
        s && s.toLowerCase() === c ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + c + ">");
      } else o[h] ? document.execCommand(o[h], !1, null) : h === "link" ? A(this) : h === "unlink" ? document.execCommand("unlink", !1, null) : h === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const h = this.dom.querySelector('[role="toolbar"]');
    if (!h) return;
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const c = _.anchorNode;
    if (!c || !this._surface.contains(c)) return;
    const s = h.querySelectorAll("[data-ln-editor-action]");
    for (let m = 0; m < s.length; m++) {
      const y = s[m], T = y.getAttribute("data-ln-editor-action");
      let b = !1;
      if (g[T])
        try {
          b = document.queryCommandState(g[T]);
        } catch {
        }
      else if (p[T]) {
        const E = i(this._surface);
        b = E && E.toLowerCase() === p[T];
      } else if (o[T])
        try {
          b = document.queryCommandState(o[T]);
        } catch {
        }
      else T === "link" && (b = !!f(_.anchorNode, "A", this._surface));
      d(T) && y.setAttribute("aria-pressed", String(b)), b ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(h) {
    this._surface && (this._surface.innerHTML = h, this._syncToTextarea(), k(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const h = this.dom.querySelector('[role="toolbar"]');
    h && (h.removeEventListener("mousedown", this._onMousedownToolbar), h.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const _ = this._textarea ? this._textarea.form : null;
    if (_ && this._onFormReset && _.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const c = this.dom.querySelector(".ln-editor__link-popover");
      c && c.remove();
    }
    k(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function i(h) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return null;
    let c = _.anchorNode;
    if (!c) return null;
    for (; c && c !== h; ) {
      if (c.nodeType === 1) {
        const s = c.tagName;
        if (s === "H2" || s === "H3" || s === "H4" || s === "BLOCKQUOTE" || s === "PRE" || s === "P")
          return s;
      }
      c = c.parentNode;
    }
    return null;
  }
  function f(h, _, c) {
    for (; h && h !== c; ) {
      if (h.nodeType === 1 && h.tagName === _)
        return h;
      h = h.parentNode;
    }
    return null;
  }
  function u(h, _) {
    _.preventDefault();
    let c = "";
    if (_.clipboardData && (c = _.clipboardData.getData("text/html"), !c)) {
      const m = _.clipboardData.getData("text/plain");
      m && (c = m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), c = "<p>" + c + "</p>");
    }
    if (!c) return;
    const s = w(c);
    s && document.execCommand("insertHTML", !1, s);
  }
  function w(h) {
    const _ = document.createElement("div");
    return _.innerHTML = h, v(_), _.innerHTML;
  }
  function v(h) {
    const _ = Array.from(h.childNodes);
    for (let c = 0; c < _.length; c++) {
      const s = _[c];
      if (s.nodeType !== 3) {
        if (s.nodeType !== 1) {
          h.removeChild(s);
          continue;
        }
        if (l[s.tagName]) {
          const m = Array.from(s.attributes);
          for (let y = 0; y < m.length; y++) {
            const T = m[y].name;
            if (s.tagName === "A" && T === "href") {
              const b = s.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(b) || s.removeAttribute("href");
            } else
              s.removeAttribute(T);
          }
          s.tagName === "A" && s.setAttribute("rel", "noopener noreferrer"), v(s);
        } else {
          for (; s.firstChild; )
            h.insertBefore(s.firstChild, s);
          h.removeChild(s);
        }
      }
    }
  }
  function S(h, _) {
    if (!(_.ctrlKey || _.metaKey)) return;
    let c = null;
    switch (_.key.toLowerCase()) {
      case "b":
        c = "bold";
        break;
      case "i":
        c = "italic";
        break;
      case "u":
        c = "underline";
        break;
      case "k":
        c = "link";
        break;
    }
    c && (_.preventDefault(), h._execAction(c));
  }
  function A(h) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const c = f(_.anchorNode, "A", h._surface), s = _.getRangeAt(0).cloneRange();
    h._closeLinkPopover && h._closeLinkPopover();
    const m = Ct(h.dom, "ln-editor-link-popover", "ln-editor");
    if (!m) return;
    const y = m.firstElementChild;
    if (!y) return;
    const T = y.querySelector('input[type="url"]'), b = y.querySelector('[data-ln-editor-action="confirm-link"]'), E = y.querySelector('[data-ln-editor-action="cancel-link"]');
    c && (T.value = c.getAttribute("href") || "");
    const C = h.dom.querySelector('[role="toolbar"]');
    C ? C.after(y) : h.dom.insertBefore(y, h._surface), T.focus();
    function q() {
      const P = window.getSelection();
      P.removeAllRanges(), P.addRange(s);
    }
    function D() {
      document.removeEventListener("mousedown", B), h._closeLinkPopover = null, y.remove();
    }
    function I() {
      const P = T.value.trim();
      if (D(), q(), h._surface.focus(), P)
        if (c)
          c.setAttribute("href", P), c.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea(), k(h.dom, "ln-editor:changed", {
            html: h._textarea.value,
            target: h.dom
          });
        else {
          document.execCommand("createLink", !1, P);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = f(H.anchorNode, "A", h._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea());
          }
        }
      else c && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), q(), h._surface.focus();
    }
    function O() {
      D();
    }
    function B(P) {
      const H = h.dom.contains(P.target) && P.target.closest('[data-ln-editor-action="link"]');
      !y.contains(P.target) && !H && O();
    }
    h._closeLinkPopover = D, b.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(P) {
      P.key === "Enter" ? (P.preventDefault(), I()) : P.key === "Escape" && (P.preventDefault(), R());
    }), document.addEventListener("mousedown", B);
  }
  j(t, e, n, "ln-editor", {
    attributes: r
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function r(g) {
    const p = {}, o = g.dataset;
    for (const a in o) {
      if (!a.startsWith("lnFill") || e[a]) continue;
      const d = a.slice(6);
      d && (p[d.charAt(0).toLowerCase() + d.slice(1)] = o[a]);
    }
    return p;
  }
  function l(g, p) {
    const o = window.CSS && CSS.escape ? CSS.escape(p) : p, a = document.querySelectorAll('[data-ln-fill-id="' + o + '"]');
    if (a.length === 0) return null;
    for (let d = 0; d < a.length; d++) {
      const n = a[d].getAttribute("data-ln-fill-form");
      if (n) {
        const i = document.getElementById(n);
        if (i && g.contains(i)) return a[d];
      }
    }
    return a[0];
  }
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const p = g.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const o = p.getAttribute("href");
    if (o && o.indexOf("#") !== -1) return;
    const a = p.getAttribute("data-ln-fill-form"), d = document.getElementById(a);
    if (!d) return;
    const n = r(p), i = Object.keys(n).length > 0;
    window.lnCore.lnFill(d, i ? n : null);
  }), document.addEventListener("ln-fill:request", function(g) {
    const p = g.detail;
    if (!p) return;
    const o = g.target, a = p.id;
    if (a == null) {
      window.lnCore.lnFill(o, null);
      return;
    }
    const d = l(o, a);
    if (!d) return;
    const n = r(d);
    window.lnCore.lnFill(o, n);
  }), window[t] = !0;
})();
function Ei(t, e = "-") {
  if (t == null) return "";
  const r = e || "-", l = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, r).replace(new RegExp(`${l}+`, "g"), r).replace(new RegExp(`^${l}+|${l}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-slug-from": { prop: "sourceName", read: Q, fallback: "" }
  }, l = et(r);
  function g(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const o = p.form;
    if (!o)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    tt(this, p, l);
    const a = o.elements[this.sourceName];
    if (!a)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', p), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = a, this._pristine = p.value === "", this._mirroring = !1;
    const d = this;
    return this._onSource = function() {
      d._pristine && d._mirror();
    }, this._onSlug = function() {
      d._mirroring || (d._pristine = d.dom.value === "");
    }, a.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this._pristine && a.value && a.value.trim() !== "" && this._mirror(), this;
  }
  g.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Ei(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, g, "ln-slug", {
    attributes: r
  });
})();
function Ai(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const r = typeof e == "number" ? e : e.getTime(), l = t.getTime(), g = Math.floor((l - r) / 1e3), p = Math.abs(g);
  return p < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : p < 60 ? { value: g, unit: "second", isOlderThanMonth: !1 } : p < 3600 ? { value: Math.round(g / 60), unit: "minute", isOlderThanMonth: !1 } : p < 86400 ? { value: Math.round(g / 3600), unit: "hour", isOlderThanMonth: !1 } : p < 604800 ? { value: Math.round(g / 86400), unit: "day", isOlderThanMonth: !1 } : p < 2592e3 ? { value: Math.round(g / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(g / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Qt(t, e, r = /* @__PURE__ */ new Date()) {
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
      return e && e.getFullYear() !== r.getFullYear() && (l.year = "numeric"), l;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-time": { effect: s },
    "data-ln-time-locale": { effect: s }
  }, l = {}, g = {};
  function p(y) {
    return y.getAttribute("data-ln-time-locale") || rt(y);
  }
  function o(y, T) {
    const b = (y || "") + "|" + JSON.stringify(T);
    return l[b] || (l[b] = new Intl.DateTimeFormat(y, T)), l[b];
  }
  function a(y) {
    const T = y || "";
    return g[T] || (g[T] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), g[T];
  }
  const d = /* @__PURE__ */ new Set();
  let n = null;
  function i() {
    n || (n = setInterval(u, 6e4));
  }
  function f() {
    n && (clearInterval(n), n = null);
  }
  function u() {
    for (const y of d) {
      if (!document.body.contains(y.dom)) {
        d.delete(y);
        continue;
      }
      _(y);
    }
    d.size === 0 && f();
  }
  function w(y, T) {
    const b = kt(T), E = (T || "").toLowerCase().split("-")[0], C = o(T, Qt("full", y)), q = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (b && q !== E && b.monthsLong) {
      const D = b.monthsLong[y.getMonth()], I = y.getDate(), R = y.getFullYear(), O = String(y.getHours()).padStart(2, "0"), B = String(y.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${B}`;
    }
    return C.format(y);
  }
  function v(y, T) {
    const b = Qt("short", y), E = kt(T), C = (T || "").toLowerCase().split("-")[0], q = o(T, b), D = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[y.getMonth()], R = y.getDate(), O = b.year ? " " + y.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return q.format(y);
  }
  function S(y, T) {
    return o(T, Qt("date", y)).format(y);
  }
  function A(y, T) {
    return o(T, Qt("time", y)).format(y);
  }
  function h(y, T) {
    const b = Ai(y);
    return b.isOlderThanMonth ? v(y, T) : a(T).format(b.value, b.unit);
  }
  function _(y) {
    const T = y.dom.getAttribute("datetime");
    if (!T) return;
    const b = st(T);
    if (!b) return;
    const E = y.dom.getAttribute(t) || "short", C = p(y.dom);
    let q;
    switch (E) {
      case "relative":
        q = h(b, C);
        break;
      case "full":
        q = w(b, C);
        break;
      case "date":
        q = S(b, C);
        break;
      case "time":
        q = A(b, C);
        break;
      default:
        q = v(b, C);
        break;
    }
    y.dom.textContent = q, E !== "full" && (y.dom.title = w(b, C));
  }
  function c(y) {
    this.dom = y;
    const T = this;
    return this._onLocaleChange = function() {
      _(T);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), _(this), y.getAttribute(t) === "relative" && (d.add(this), i()), this;
  }
  c.prototype.render = function() {
    _(this);
  }, c.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), d.delete(this), d.size === 0 && f(), delete this.dom[e];
  };
  function s(y) {
    const T = y[e];
    if (!T) return;
    y.getAttribute(t) === "relative" ? (d.add(T), i()) : (d.delete(T), d.size === 0 && f()), _(T);
  }
  function m(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && _(y[e]);
  }
  j(t, e, c, "ln-time", {
    attributes: r,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: s,
    onInit: m
  });
})();
function Si(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, r = t.pageSize > 0 ? t.pageSize : 200, l = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const g = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, p = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let a = 0, d = 0, n = 0, i = !1, f = null;
  function u(S, A) {
    p.delete(S), p.set(S, A);
  }
  function w() {
    if (p.size <= e) return [];
    const S = [];
    for (; p.size > e; ) {
      const h = p.keys().next().value;
      S.push(p.get(h)), p.delete(h);
    }
    const A = new Set(p.values());
    return S.filter((h) => !A.has(h));
  }
  function v(S, A) {
    o.add(S), clearTimeout(f), f = setTimeout(() => g(S, r, A), l);
  }
  return {
    get logicalTotal() {
      return a;
    },
    set logicalTotal(S) {
      a = S;
    },
    get grandTotal() {
      return d;
    },
    set grandTotal(S) {
      d = S;
    },
    get queryGen() {
      return n;
    },
    set queryGen(S) {
      n = S;
    },
    get size() {
      return p.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return i;
    },
    getId: (S) => {
      if (!p.has(S)) return;
      const A = p.get(S);
      return u(S, A), A;
    },
    ensure: (S, A, h) => {
      if (!i && !o.has(0)) return v(0, h);
      if (a <= 0) return;
      const _ = Math.max(0, S), c = Math.min(a, A);
      for (let s = _; s < c; s++)
        if (!p.has(s)) {
          const m = Math.floor(s / r) * r;
          if (!o.has(m)) return v(m, h);
        }
    },
    ingest: (S, A, h, _, c) => {
      if (c != null && c !== n) return [];
      i = !0, h != null && (d = h), _ != null && (a = _);
      for (let s = 0; s < A.length; s++)
        u(S + s, A[s]);
      return o.delete(S), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      i = !1, p.clear(), o.clear(), clearTimeout(f);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (S = {}) => {
      let A = [];
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (r = S.pageSize), S.fetchDebounce >= 0 && (l = S.fetchDebounce), A;
    }
  };
}
function Ci(t, e, r) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: l, direction: g } = e, p = g === "desc", o = t.map((d) => d ? d[l] : void 0), a = Te(o);
  return [...t].sort((d, n) => {
    const i = d ? d[l] : void 0, f = n ? n[l] : void 0, u = Le(i, f, a, r);
    return p ? -u : u;
  });
}
function er(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const r = Object.keys(e).filter((l) => Array.isArray(e[l]) && e[l].length > 0);
  return r.length ? t.filter((l) => l ? r.every((g) => Ie(l[g], e[g])) : !1) : t;
}
function Ti(t, e, r) {
  if (!Array.isArray(t) || !e || !r || !r.length) return t;
  const l = In(e);
  return l.length ? t.filter((g) => g ? l.every(
    (p) => r.some((o) => {
      const a = g[o];
      return a != null && Dn(String(a), [p]);
    })
  ) : !1) : t;
}
function Li(t, e, r) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (r === "count") return t.length;
  const l = t.map((p) => p && p[e] != null ? parseFloat(p[e]) : NaN).filter((p) => Number.isFinite(p)), g = l.reduce((p, o) => p + o, 0);
  return r === "sum" ? g : r === "avg" && l.length ? g / l.length : 0;
}
function ki(t, e = {}, r = [], l) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const g = t.length;
  let p = t;
  e.filters && (p = er(p, e.filters)), e.search && (p = Ti(p, e.search, r));
  const o = p.length;
  if (e.sort && (p = Ci(p, e.sort, l)), e.offset || e.limit) {
    const a = e.offset || 0, d = e.limit || p.length;
    p = p.slice(a, a + d);
  }
  return { records: p, total: g, filtered: o };
}
function qi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((r) => {
    if (!r) return null;
    const l = { ...r };
    for (const [g, p] of Object.entries(e))
      if (typeof p == "function")
        try {
          l[g] = p(r);
        } catch {
          l[g] = void 0;
        }
    return l;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function r(L, x, M) {
    const N = L.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const l = {
    "data-ln-data-store": { effect: Ne },
    "data-ln-data-store-indexes": { effect: Ne },
    "data-ln-data-store-stale": { prop: "_staleThreshold", read: r, fallback: 300 },
    "data-ln-data-store-search-fields": { prop: "_searchFields", read: mr },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", read: Kt },
    "data-ln-data-store-window": { prop: "_windowSize", read: It, fallback: 1e3, effect: fr },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", read: It, fallback: 200, effect: pr },
    "data-ln-data-store-frozen": {}
  }, g = et(l), p = "ln_app_cache", o = "_meta", a = "1.0";
  let d = null, n = null;
  const i = {};
  function f(L) {
    L && L.name === "QuotaExceededError" && k(document, "ln-data-store:quota-exceeded", { error: L });
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
      const x = u(), M = Object.keys(x), N = indexedDB.open(p);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), L(null);
      }, N.onsuccess = (F) => {
        const U = F.target.result, K = Array.from(U.objectStoreNames);
        if (!(!K.includes(o) || M.some((ft) => !K.includes(ft))))
          return v(U), d = U, L(U);
        const J = U.version;
        U.close();
        const nt = indexedDB.open(p, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), L(null);
        }, nt.onupgradeneeded = (ft) => {
          const at = ft.target.result;
          at.objectStoreNames.contains(o) || at.createObjectStore(o, { keyPath: "key" });
          for (const Tt of M)
            if (!at.objectStoreNames.contains(Tt)) {
              const Ot = at.createObjectStore(Tt, { keyPath: "id" });
              for (const ce of x[Tt].indexes)
                Ot.createIndex(ce, ce, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const at = ft.target.result;
          v(at), d = at, L(at);
        };
      };
    }), n);
  }
  function v(L) {
    L.onversionchange = () => {
      L.close(), d = null, n = null;
    };
  }
  function S() {
    return d ? Promise.resolve(d) : (n = null, w());
  }
  async function A(L) {
    if (!At() || !L) return L;
    const x = { ...L }, M = x.id, N = await Or(x);
    return !N || !N.encrypted ? L : {
      ...N,
      id: M
    };
  }
  async function h(L) {
    return !L || !L.encrypted || !At() ? L : Mr(L, { silent: !0 });
  }
  const _ = (L, x) => S().then((M) => M ? M.transaction(L, x).objectStore(L) : null);
  function c(L) {
    return new Promise((x, M) => {
      L.onsuccess = () => x(L.result), L.onerror = () => {
        f(L.error), M(L.error);
      };
    });
  }
  const s = (L) => _(L, "readonly").then((x) => x ? c(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => h(M))) : x), m = (L, x) => _(L, "readonly").then((M) => M ? c(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? c(M.get(Number(x))) : typeof x == "number" ? c(M.get(String(x))) : null) : null).then((M) => M ? h(M) : null), y = (L, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(L, "readonly").objectStore(L), U = x.map((K) => c(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? c(F.get(Number(K))) : typeof K == "number" ? c(F.get(String(K))) : null));
    return Promise.all(U).then((K) => At() ? Promise.all(K.map((W) => W ? h(W) : null)) : K);
  }), T = (L, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => _(L, "readwrite").then((F) => F ? c(F.put(N)) : null)), b = (L, x) => _(L, "readwrite").then((M) => M ? c(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return c(M.delete(Number(x)));
    if (typeof x == "number")
      return c(M.delete(String(x)));
  }) : null), E = (L) => _(L, "readwrite").then((x) => x ? c(x.clear()) : null), C = (L) => _(L, "readonly").then((x) => x ? c(x.count()) : 0), q = (L) => _(o, "readonly").then((x) => x ? c(x.get(L)) : null), D = (L, x) => _(o, "readwrite").then((M) => {
    if (M)
      return x.key = L, c(M.put(x));
  });
  function I(L) {
    return this.dom = L, this._name = L.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", L), tt(this, L, g), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, L.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Si({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, M, N) => {
        k(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: M,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), i[this._name] = this, R(this), this.ready = X(this), this;
  }
  function R(L) {
    L._handlers = {
      create: (x) => O(L, "create", x.detail, () => P(L, x.detail)),
      update: (x) => O(L, "update", x.detail, () => H(L, x.detail)),
      delete: (x) => O(L, "delete", x.detail, () => z(L, x.detail)),
      "bulk-delete": (x) => O(L, "bulk-delete", x.detail, () => $(L, x.detail)),
      "sync-failed": (x) => {
        L.isSyncing = !1, k(L.dom, "ln-data-store:sync-error", {
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
        const M = x.detail && x.detail.field, N = x.detail && x.detail.direction, F = N && N !== "none" ? { field: M, direction: N } : null, U = L.query.sort;
        !U && !F || U && F && U.field === F.field && U.direction === F.direction || (L.query.sort = F, le(L));
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
    }).catch((U) => Y(L, x, F, U)), L._mutationChain;
  }
  function B(L, x = 0) {
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
  function P(L, { tempId: x, data: M = {}, requestId: N } = {}) {
    const F = { ...M, id: x };
    return T(L._name, F).then(() => B(L, 1)).then(() => {
      k(L.dom, "ln-data-store:created", { store: L._name, record: F, tempId: x, requestId: N });
    });
  }
  function H(L, { id: x, data: M = {}, requestId: N } = {}) {
    return m(L._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const U = F.id, K = { ...F, ...M, id: U }, W = M.id, J = W !== void 0 && W !== U;
      return (J ? bt(L._name, U, { ...K, id: W }) : T(L._name, K)).then(() => B(L, 0)).then(() => {
        k(L.dom, "ln-data-store:updated", { store: L._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(L, { id: x, requestId: M } = {}) {
    return m(L._name, x).then((N) => {
      if (!N) {
        k(L.dom, "ln-data-store:deleted", { store: L._name, id: x, requestId: M, missing: !0 });
        return;
      }
      const F = N.id;
      return b(L._name, F).then(() => B(L, -1)).then(() => {
        k(L.dom, "ln-data-store:deleted", { store: L._name, id: F, requestId: M });
      });
    });
  }
  function $(L, { ids: x = [], requestId: M } = {}) {
    return x.length ? Promise.all(x.map((N) => m(L._name, N))).then((N) => {
      const F = N.filter(Boolean).map((U) => U.id);
      return ht(L._name, F).then(() => B(L, -F.length)).then(() => {
        k(L.dom, "ln-data-store:deleted", { store: L._name, ids: F, requestId: M });
      });
    }) : (k(L.dom, "ln-data-store:deleted", { store: L._name, ids: [], requestId: M }), Promise.resolve());
  }
  function Y(L, x, M, N) {
    console.error("[ln-data-store] " + x + " failed:", N), k(L.dom, "ln-data-store:mutation-error", {
      store: L._name,
      action: x,
      requestId: M,
      error: N
    });
  }
  function X(L) {
    return w().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return q(L._name);
    }).then((x) => {
      if (L.initializationError = null, x && x.schema_version === a)
        L.lastSyncedAt = x.last_synced_at || null, L.totalCount = x.record_count || 0, L.hasCache = x.has_cache === !0 || L.totalCount > 0, L.hasCache && (L.isLoaded = !0, L.canServe = !0, k(L.dom, "ln-data-store:ready", { store: L._name, count: L.totalCount, source: "cache" })), L.isInitialized = !0, k(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: L.hasCache, lastSyncedAt: L.lastSyncedAt, count: L.totalCount });
      else {
        if (x && x.schema_version !== a)
          return E(L._name).then(() => D(L._name, { schema_version: a, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            L.isInitialized = !0, L.hasCache = !1, k(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        L.isInitialized = !0, L.hasCache = !1, k(L.dom, "ln-data-store:initialized", { store: L._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (L.isInitialized = !0, L.isLoaded = !1, L.canServe = !1, L.hasCache = !1, L.isSyncing = !1, L.initializationError = x, k(L.dom, "ln-data-store:initialization-error", { store: L._name, error: x }), { ok: !1, error: x }));
  }
  function V(L) {
    L.isSyncing = !0, k(L.dom, "ln-data-store:request-remote-sync", { since: L.lastSyncedAt });
  }
  function G(L, x) {
    return S().then((M) => M ? (At() ? Promise.all(x.map((F) => A(F))) : Promise.resolve(x)).then((F) => new Promise((U, K) => {
      const W = M.transaction(L, "readwrite"), J = W.objectStore(L);
      F.forEach((nt) => J.put(nt)), W.oncomplete = () => U(), W.onerror = () => {
        f(W.error), K(W.error);
      };
    })) : void 0);
  }
  function ht(L, x) {
    return S().then((M) => {
      if (M)
        return new Promise((N, F) => {
          const U = M.transaction(L, "readwrite"), K = U.objectStore(L);
          x.forEach((W) => {
            K.delete(W), typeof W == "string" && W.trim() !== "" && !isNaN(Number(W)) ? K.delete(Number(W)) : typeof W == "number" && K.delete(String(W));
          }), U.oncomplete = () => N(), U.onerror = () => F(U.error);
        });
    });
  }
  function bt(L, x, M) {
    return (At() ? A(M) : Promise.resolve(M)).then((F) => S().then((U) => {
      if (U)
        return new Promise((K, W) => {
          const J = U.transaction(L, "readwrite"), nt = J.objectStore(L);
          nt.put(F), nt.delete(x), J.oncomplete = () => K(), J.onerror = () => {
            f(J.error), W(J.error);
          };
        });
    }));
  }
  const ae = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function ir(L) {
    return L ? Object.keys(L).filter((x) => Array.isArray(L[x]) && L[x].length > 0) : [];
  }
  function or(L, x, M) {
    return x.every((N) => M[N].map(String).includes(String(L[N])));
  }
  function sr(L) {
    return String(L || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function ar(L, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const U = L[F];
        return U != null && String(U).toLowerCase().includes(N);
      })
    );
  }
  function lr(L, x, M) {
    return Li(L, x, M);
  }
  function Rt(L, x) {
    return qi(x, L.presenters && L.presenters.computed);
  }
  function cr(L) {
    return !L.sort && !At();
  }
  function dr(L, x, M) {
    const N = ir(x.filters), F = x.search ? sr(x.search) : [], U = L._searchFields, K = F.length > 0 && U && U.length > 0;
    return _(L._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ft = [], at = W.openCursor();
      at.onsuccess = () => {
        const Tt = at.result;
        if (!Tt || ft.length >= M) {
          J(ft);
          return;
        }
        const Ot = Tt.value;
        (!N.length || or(Ot, N, x.filters)) && (!K || ar(Ot, F, U)) && ft.push(Ot), Tt.continue();
      }, at.onerror = () => nt(at.error);
    }) : []);
  }
  function Oe(L, x, M) {
    return ki(x, M, L._searchFields, ae);
  }
  function Me(L, x, M) {
    const N = [];
    for (let U = x; U < x + M; U++) {
      const K = L._windowIndex.getId(U);
      N.push(K);
    }
    const F = Array.from(new Set(N.filter((U) => U !== void 0)));
    return y(L._name, F).then((U) => {
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
          const ft = K.get(String(nt));
          W.push(ft || null);
        }
      }
      return {
        data: Rt(L, W),
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
        const F = M + N, U = (K) => K.length ? {
          data: Rt(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Me(x, M, N);
        return cr(L) ? dr(x, L, F).then((K) => U(K.slice(M, F))) : s(x._name).then((K) => U(Oe(x, K, L).records));
      }
      return Me(x, M, N);
    }
    return s(x._name).then((M) => {
      const N = Oe(x, M, L);
      return {
        data: Rt(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(L) {
    return m(this._name, L).then((x) => x ? Rt(this, [x])[0] : null);
  }, I.prototype.count = function(L) {
    return L && Object.keys(L).length > 0 ? s(this._name).then((M) => er(M, L).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(L, x) {
    return s(this._name).then((M) => lr(M, L, x));
  }, I.prototype.setPresenters = function(L) {
    this.presenters = L;
  }, I.prototype.applySync = function(L, x, M, N) {
    N = N || {};
    const F = this;
    if (F._windowIndex && N.queryGen != null && N.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    L.length > 0 || x.length > 0;
    let U = Promise.resolve();
    return L.length > 0 && (U = U.then(() => G(F._name, L))), x.length > 0 && (U = U.then(() => ht(F._name, x))), U.then(() => {
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
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = M, K ? (k(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: N }), k(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: N })) : k(F.dom, "ln-data-store:synced", {
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
    return L.length > 0 && (N = N.then(() => G(M._name, L))), N.then(() => C(M._name)).then((F) => (M.totalCount = x.total !== void 0 ? x.total : F, L.length > 0 && (M.canServe = !0), Rt(M, L))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
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
    delete i[this._name], delete this.dom[e], k(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function ur() {
    return S().then((L) => {
      if (!L) return;
      const x = Array.from(L.objectStoreNames);
      return new Promise((M, N) => {
        const F = L.transaction(x, "readwrite");
        x.forEach((U) => F.objectStore(U).clear()), F.oncomplete = () => M(), F.onerror = () => N(F.error);
      });
    }).then(() => {
      Object.values(i).forEach((L) => {
        L.isLoaded = !1, L.canServe = !1, L.isInitialized = !1, L.initializationError = null, L.hasCache = !1, L.isSyncing = !1, L.lastSyncedAt = null, L.totalCount = 0;
      });
    });
  }
  function le(L) {
    L._windowIndex && L._windowIndex.reset(), k(L.dom, "ln-data-store:query-changed", {
      store: L._name,
      query: {
        filters: Object.assign({}, L.query.filters),
        search: L.query.search,
        sort: L.query.sort ? Object.assign({}, L.query.sort) : null
      }
    });
  }
  const hr = "data-ln-data-store-frozen";
  function Ne(L, x) {
    L.setAttribute(hr, x);
  }
  function fr(L) {
    const x = L[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ht(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function pr(L) {
    const x = L[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: l
  }), window[e].clearAll = ur, window[e].init = window[e], window[e].setStorageKey = ze, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ze);
})();
const xi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Lt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, r) => {
    const l = String(e);
    return r === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Ii(t, e) {
  if (!t || typeof t != "object") return "";
  const r = Object.assign({}, xi);
  if (e && typeof e == "object")
    for (const g in e)
      e[g] !== void 0 && e[g] !== null && e[g] !== "" && (r[g] = e[g]);
  const l = new URLSearchParams();
  return t.search && l.append(r.search, t.search), t.offset != null && l.append(r.offset, t.offset), t.limit != null && l.append(r.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (l.append(r.sortField, t.sort.field), l.append(r.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((g) => {
    const p = t.filters[g];
    Array.isArray(p) && p.length > 0 && l.append(g, p.join(","));
  }), l.toString();
}
function Di(t, e, r) {
  let l = Lt(t, e);
  return r && (l += (l.indexOf("?") !== -1 ? "&" : "?") + r), l;
}
function nn(t) {
  const e = t && t.content !== void 0 ? t.content : t, r = t && t.message ? t.message : null;
  return { record: e, message: r };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", r = "lnConnector";
  if (window[e] !== void 0) return;
  function l(n) {
    const i = n[e];
    i && i.refreshConfig();
  }
  const g = {
    "data-ln-api-connector": {},
    "data-ln-api-base-url": { prop: "baseUrl", read: Q, fallback: "", effect: l },
    "data-ln-api-path": { prop: "path", read: Q, fallback: "", effect: l },
    "data-ln-api-headers": { prop: "rawHeaders", read: Q, fallback: null, effect: l },
    "data-ln-api-param-offset": { effect: l },
    "data-ln-api-param-limit": { effect: l },
    "data-ln-api-param-search": { effect: l },
    "data-ln-api-param-sort-field": { effect: l },
    "data-ln-api-param-sort-dir": { effect: l },
    "data-ln-api-connector-query-debounce": { effect: l }
  }, p = et(g);
  function o(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((i) => {
      const f = new Error("HTTP " + n.status + ": " + n.statusText);
      throw f.status = n.status, f.data = i, f;
    });
  }
  function a(n) {
    return this.dom = n, tt(this, n, p), n[e] = this, n[r] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, d(this), this;
  }
  a.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = wn(this.rawHeaders);
    const i = {}, f = n.getAttribute("data-ln-api-param-offset");
    f && (i.offset = f);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (i.limit = u);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (i.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (i.sortField = v);
    const S = n.getAttribute("data-ln-api-param-sort-dir");
    S && (i.sortDir = S), this.paramKeys = i;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, k(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, a.prototype._reqHeaders = function(n) {
    const i = Object.assign({}, this.headers);
    return !i.Accept && !i.accept && (i.Accept = "application/json"), !i["Content-Type"] && !i["content-type"] && (i["Content-Type"] = "application/json"), n && (i["X-Idempotency-Key"] = n), i;
  }, a.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, a.prototype.fetchDelta = function(n, i) {
    const f = this;
    let u = Lt(f.baseUrl, f.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = i || "sync";
    f._inflight.has(w) && f._inflight.get(w).abort();
    const v = new AbortController();
    return f._inflight.set(w, v), window.fetch(u, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: v.signal
    }).then(o).finally(function() {
      f._inflight.get(w) === v && f._inflight.delete(w);
    });
  }, a.prototype.query = function(n, i) {
    const f = this, u = Ii(n, f.paramKeys), w = Di(f.baseUrl, f.path, u), v = i || "query";
    f._inflight.has(v) && f._inflight.get(v).abort();
    const S = new AbortController();
    return f._inflight.set(v, S), window.fetch(w, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: S.signal
    }).then(o).finally(function() {
      f._inflight.get(v) === S && f._inflight.delete(v);
    });
  }, a.prototype.create = function(n, i, f) {
    const u = this;
    return window.fetch(Lt(u.baseUrl, i || u.path), {
      method: "POST",
      headers: u._reqHeaders(f),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(o);
  }, a.prototype.update = function(n, i, f, u, w) {
    const v = this;
    f != null && (i = Object.assign({}, i, { expected_version: f }));
    const S = u ? Lt(v.baseUrl, u) : Lt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(i)
    }).then(o);
  }, a.prototype.delete = function(n, i, f) {
    const u = this;
    return window.fetch(Lt(u.baseUrl, i || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(f),
      credentials: u.credentials
    }).then(o);
  }, a.prototype.bulkDelete = function(n, i, f) {
    const u = this;
    return window.fetch(Lt(u.baseUrl, i || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(f),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(o);
  };
  function d(n) {
    n._handlers = {
      sync: function(i) {
        const f = i.detail || {}, u = f.meta && f.meta.targetEl ? f.meta.targetEl : null;
        n.fetchDelta(f.since, u).then(function(w) {
          k(n.dom, "ln-api-connector:fetched", { data: w, since: f.since, meta: f.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: f.since,
            meta: f.meta || null
          });
        });
      },
      query: function(i) {
        const f = i.detail || {}, u = f.query || f, w = f.meta && f.meta.targetEl ? f.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(_, c, s) {
          n.query(c, s).then(function(m) {
            const y = m || {};
            k(n.dom, "ln-api-connector:fetched", {
              data: y.data || (Array.isArray(y) ? y : []),
              total: y.total,
              filtered: y.filtered,
              offset: c.offset,
              queryGen: c.queryGen,
              meta: _.meta || null
            });
          }).catch(function(m) {
            m && m.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
              action: "query",
              error: m.message,
              status: m.status || 0,
              data: m.data || null,
              meta: _.meta || null
            });
          });
        }
        if (S === 0) {
          A(f, u, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const h = setTimeout(function() {
          n._queryTimers.delete(v), A(f, u, w);
        }, S);
        n._queryTimers.set(v, h);
      },
      cancel: function(i) {
        const f = i.detail || {}, u = f.meta && f.meta.targetEl ? f.meta.targetEl : f.targetEl || f.key;
        u && n.cancel(u);
      },
      create: function(i) {
        const f = i.detail || {};
        n.create(f.data, f.url, f.idempotencyKey).then(function(u) {
          const w = nn(u);
          k(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: f.tempId,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(i) {
        const f = i.detail || {};
        n.update(f.id, f.data, f.expected_version, f.url, f.idempotencyKey).then(function(u) {
          const w = nn(u);
          k(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: f.id,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: f.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: f.meta || null
          });
        });
      },
      delete: function(i) {
        const f = i.detail || {};
        n.delete(f.id, f.url, f.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          k(n.dom, "ln-api-connector:deleted", {
            response: u,
            id: f.id,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const f = i.detail || {};
        n.bulkDelete(f.ids, f.url, f.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          k(n.dom, "ln-api-connector:bulk-deleted", {
            response: u,
            ids: f.ids,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
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
    n._inflight && (n._inflight.forEach(function(i) {
      i.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(i) {
      i && clearTimeout(i);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), k(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[r];
  }, j(t, e, a, "ln-api-connector", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", r = "lnConnector";
  if (window[e] !== void 0) return;
  function l(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const g = {
    "data-ln-couchdb-connector": {},
    "data-ln-couchdb-url": { prop: "url", read: Q, fallback: "", effect: l },
    "data-ln-couchdb-db": { prop: "db", read: Q, fallback: "", effect: l },
    "data-ln-couchdb-auth": { prop: "auth", read: Q, fallback: "", effect: l },
    "data-ln-couchdb-headers": { effect: l }
  }, p = et(g);
  function o(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function a(v) {
    return this.dom = v, tt(this, v, p), v[e] = this, v[r] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  a.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const S = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = wn(S, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), k(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function d(v, S, A) {
    const h = Object.assign({}, Mt(v.headers, v.auth), A || {});
    return S && (h["Idempotency-Key"] = S), h;
  }
  a.prototype.fetchDelta = function(v) {
    const S = this, A = ["include_docs=true", "feed=normal"];
    v && A.push("since=" + encodeURIComponent(v));
    const h = Et(S.url, S.db, "_changes") + "?" + A.join("&");
    return window.fetch(h, { method: "GET", headers: Mt(S.headers, S.auth), credentials: S.credentials }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const c = _.results || [];
      return {
        data: c.filter((s) => !s.deleted && s.doc).map((s) => Object.assign({}, s.doc, { id: s.doc._id })),
        deleted: c.filter((s) => s.deleted).map((s) => s.id),
        synced_at: _.last_seq || v || ""
      };
    });
  };
  function n(v, S, A) {
    const h = Object.assign({ _id: S.id }, S);
    return h._id || delete h._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: d(v, A),
      credentials: v.credentials,
      body: JSON.stringify(h)
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const c = o(_), s = c.content;
      return { record: Object.assign({}, h, { id: s.id, _id: s.id, _rev: s.rev }), message: c.message };
    });
  }
  a.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function i(v, S, A, h) {
    const _ = Object.assign({ id: String(S), _id: String(S) }, A), c = _._rev || _.rev;
    return (c ? Promise.resolve(c) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Mt(v.headers, v.auth), credentials: v.credentials }).then((m) => {
      if (!m.ok) throw new Error("Could not retrieve document for revision mapping");
      return m.json().then((y) => y._rev);
    })).then((m) => {
      const y = Object.assign({}, _, { _rev: m });
      delete y.rev;
      const T = d(v, h, { "If-Match": m });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(y)
      }).then((b) => {
        if (b.ok) return b.json().then((E) => {
          const C = o(E);
          return { record: Object.assign({}, y, { _rev: C.content.rev }), message: C.message };
        });
        if (b.status === 409) return b.json().then((E) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = E, C;
        });
        throw new Error("HTTP " + b.status + ": " + b.statusText);
      });
    });
  }
  a.prototype.update = function(v, S, A) {
    return i(this, v, S, A).then((h) => h.record);
  };
  function f(v, S, A, h) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Mt(v.headers, v.auth), credentials: v.credentials }).then((c) => {
      if (!c.ok) throw new Error("Could not retrieve document for revision delete");
      return c.json().then((s) => s._rev);
    })).then((c) => {
      const s = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(c);
      return window.fetch(s, { method: "DELETE", headers: d(v, h), credentials: v.credentials }).then((m) => {
        if (!m.ok) throw new Error("HTTP " + m.status + ": " + m.statusText);
        return m.json();
      }).then((m) => {
        const y = o(m);
        return { response: y.content, message: y.message };
      });
    });
  }
  a.prototype.delete = function(v, S, A) {
    return f(this, v, S, A).then((h) => h.response);
  };
  function u(v, S, A) {
    return !S || S.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Mt(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: S })
    }).then((h) => {
      if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
      return h.json();
    }).then((h) => {
      const c = (h.rows || []).filter((s) => !s.error && s.value && s.value.rev).map((s) => ({ _id: s.id, _rev: s.value.rev, _deleted: !0 }));
      return c.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: d(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: c })
      }).then((s) => {
        if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
        return s.json();
      }).then((s) => {
        const m = o(s);
        return { response: { ok: !0, results: m.content, deletedCount: c.length }, message: m.message };
      });
    });
  }
  a.prototype.bulkDelete = function(v, S) {
    return u(this, v, S).then((A) => A.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(A) {
        const h = A.detail || {};
        v.fetchDelta(h.since).then(function(_) {
          k(v.dom, "ln-couchdb-connector:fetched", { data: _, since: h.since, meta: h.meta || null });
        }).catch(function(_) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            since: h.since,
            meta: h.meta || null
          });
        });
      },
      create: function(A) {
        const h = A.detail || {};
        n(v, h.data, h.idempotencyKey).then(function(_) {
          k(v.dom, "ln-couchdb-connector:created", { record: _.record, tempId: h.tempId, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            tempId: h.tempId,
            meta: h.meta || null
          });
        });
      },
      update: function(A) {
        const h = A.detail || {}, _ = Object.assign({}, h.data);
        h.expected_version !== void 0 && (_._rev = h.expected_version), i(v, h.id, _, h.idempotencyKey).then(function(c) {
          k(v.dom, "ln-couchdb-connector:updated", { record: c.record, id: h.id, message: c.message, meta: h.meta || null });
        }).catch(function(c) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: c.message,
            status: c.status || 0,
            id: h.id,
            data: c.status === 409 ? c.data : null,
            conflictData: c.status === 409 ? c.data : null,
            meta: h.meta || null
          });
        });
      },
      delete: function(A) {
        const h = A.detail || {};
        f(v, h.id, h.rev, h.idempotencyKey).then(function(_) {
          k(v.dom, "ln-couchdb-connector:deleted", { response: _.response, id: h.id, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            id: h.id,
            meta: h.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const h = A.detail || {};
        u(v, h.ids, h.idempotencyKey).then(function(_) {
          k(v.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: h.ids, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            ids: h.ids,
            meta: h.meta || null
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
    }), v._handlers = null), k(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[r];
  }, j(t, e, a, "ln-couchdb-connector", {
    attributes: g
  });
})();
function Ri(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Ft(t, e) {
  const r = !t || !!t.initializationError, l = !!(t && t.noLocalQuery && !t.windowed);
  return e && (r || !t.canServe || l) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function $t(t, e, r) {
  return r === "store" && !!e && !(t && t.windowed);
}
function rn(t, e) {
  const r = Object.assign({}, t);
  return e && (r.filters = e.filters, r.search = e.search, r.sort = e.sort), r;
}
class Oi {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((r, l) => {
      this._pending.set(e, { resolve: r, reject: l });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const r = e || new Error("Mutation receipt registry closed");
    for (const l of this._pending.values()) l.reject(r);
    this._pending.clear();
  }
  _settle(e, r) {
    const l = e && e.requestId;
    if (!l) return !1;
    const g = this._pending.get(l);
    return g ? (this._pending.delete(l), r ? g.reject(e.error || new Error("Store mutation failed")) : g.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", r = "data-ln-data-coordinator-scope", l = "data-ln-data-coordinator-search", g = "data-ln-data-coordinator-filters", p = "data-ln-data-coordinator-sort-field", o = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function a(b) {
    const E = b[e];
    E && E.refreshMapper();
  }
  function d(b) {
    const E = b[e];
    E && E._queueQueryRefresh();
  }
  function n(b, E) {
    return b.getAttribute(E) || b.id;
  }
  const i = {
    "data-ln-data-coordinator": { prop: "_name", read: n },
    "data-ln-data-coordinator-scope": {},
    "data-ln-data-coordinator-mapper": { effect: a },
    "data-ln-data-coordinator-search": { effect: d },
    "data-ln-data-coordinator-filters": { effect: d },
    "data-ln-data-coordinator-sort-field": { effect: d },
    "data-ln-data-coordinator-sort-direction": { effect: d },
    "data-ln-data-coordinator-stale": {},
    "data-ln-data-coordinator-no-autosync": {},
    "data-ln-data-coordinator-dict": {}
  }, f = et(i), u = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function h() {
    w || (w = !0, v = function() {
      k(document, "ln-data-coordinator:online", {}), u.forEach(function(b) {
        b._maybeSync();
      });
    }, S = function() {
      k(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && u.forEach(function(b) {
        const E = b.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !b._noAutosync && (!C.hasCache || b._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function _() {
    w && (u.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", S), document.removeEventListener("visibilitychange", A), v = null, S = null, A = null, w = !1));
  }
  function c() {
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
  function m(b) {
    return b ? b.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : b.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function y(b) {
    const E = this;
    return this.dom = b, tt(this, b, f), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", b), b[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Oi(), this._dict = re(b, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), h(), this._checkInitialSync(), this;
  }
  Object.defineProperty(y.prototype, "_staleThreshold", {
    get: function() {
      const E = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (E ? E.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const q = parseInt(C, 10);
      return isNaN(q) ? 300 : q;
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
    const b = this.findChildren(), E = b.store;
    !E || E.initializationError || !b.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, y.prototype._checkInitialSync = function() {
    const b = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (b._destroyed) return;
      const q = b.findChildren(), D = q.store;
      if (D && D.initializationError) {
        b._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !q.connector || b._noAutosync || D.isSyncing || (!D.hasCache || b._isStale()) && D.forceSync();
    }).catch(function(q) {
      b._destroyed || b._reportReconciliationError("store-initialize", q, null);
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
    const b = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: b,
      connectorEl: E,
      queueEl: C,
      store: b ? b.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, y.prototype._handleSubmitRecord = function(b) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = b.data || {}, q = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = b.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, b.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, q, I, D, b.action);
  }, y.prototype._fanOutCreate = function(b, E, C) {
    this.refreshMapper();
    const q = "_temp_" + c();
    b.storeEl && k(b.storeEl, "ln-data-store:request-create", { tempId: q, data: E }), b.queue ? k(b.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: q,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: q, action: C }
    }) : b.connector && k(b.connectorEl, m(b.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: c(), queued: !1, op: "create", tempId: q }
    });
  }, y.prototype._fanOutUpdate = function(b, E, C, q, D) {
    this.refreshMapper(), b.storeEl && k(b.storeEl, "ln-data-store:request-update", { id: E, data: C }), b.queue ? k(b.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: q,
      meta: { id: E, action: D }
    }) : b.connector && k(b.connectorEl, m(b.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: q,
      url: D,
      meta: { entryId: c(), queued: !1, op: "update", id: E }
    });
  }, y.prototype._fanOutDelete = function(b, E) {
    this.refreshMapper(), b.storeEl && k(b.storeEl, "ln-data-store:request-delete", { id: E }), b.queue ? k(b.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : b.connector && k(b.connectorEl, m(b.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: c(), queued: !1, op: "delete", id: E }
    });
  }, y.prototype._fanOutBulkDelete = function(b, E) {
    this.refreshMapper();
    const C = E.join(",");
    b.storeEl && k(b.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), b.queue ? k(b.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : b.connector && k(b.connectorEl, m(b.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: c(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, y.prototype._toastFromMessage = function(b) {
    b && k(window, "ln-toast:enqueue", {
      type: b.type || "success",
      title: b.title || "",
      message: b.body || ""
    });
  }, y.prototype._toastFromDict = function(b) {
    const E = this._dict[b];
    E && k(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, y.prototype._requestStoreMutation = function(b, E, C) {
    const q = b.storeEl;
    if (!q) return Promise.reject(new Error("Store element not found"));
    const D = c(), I = this._mutationReceipts.wait(D);
    return k(q, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, y.prototype._reportReconciliationError = function(b, E, C) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", {
      operation: b,
      error: E,
      meta: C || null
    });
  };
  function T(b) {
    b._handlers = {
      sync: function(E) {
        b.refreshMapper();
        const C = b.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        k(C.connectorEl, m(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = b.findChildren();
        if (!C.connectorEl) return;
        const q = E.detail || {};
        k(C.connectorEl, m(C.connectorEl) + ":request-query", {
          query: Object.assign({}, q.query, {
            offset: q.offset,
            limit: q.limit,
            queryGen: q.queryGen
          })
        });
      },
      reqCreate: function(E) {
        const C = b.findChildren();
        b._fanOutCreate(C, E.detail.data || {}, E.detail.action);
      },
      reqUpdate: function(E) {
        const C = b.findChildren();
        b._fanOutUpdate(C, E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action);
      },
      reqDelete: function(E) {
        const C = b.findChildren();
        b._fanOutDelete(C, E.detail.id);
      },
      reqBulkDelete: function(E) {
        const C = b.findChildren();
        b._fanOutBulkDelete(C, E.detail.ids || []);
      },
      queueFailed: function() {
        b._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(E) {
        b.refreshMapper();
        const C = b.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const q = E.detail || {}, D = q.entryId, I = q.op, R = q.targetId, O = q.payload, B = q.expectedVersion, P = q.meta || {}, H = P.action || null, z = q.idempotencyKey || D;
        I === "create" ? k(C.connectorEl, m(C.connectorEl) + ":request-create", {
          data: O,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: P.tempId }
        }) : I === "update" ? k(C.connectorEl, m(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: B,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? k(C.connectorEl, m(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? k(C.connectorEl, m(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: P.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(E) {
        const C = E.target;
        if (E.defaultPrevented) return;
        const q = C.hasAttribute(r) ? C.getAttribute(r) : null;
        if (q === null) return;
        let D;
        if (q ? D = b._owns(q) : D = C.closest("[data-ln-data-coordinator]") === b.dom, !D) return;
        const I = Sr(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = hn(C);
        delete R._method, delete R._token, b._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(E) {
        const C = E.detail.meta || {}, q = b.findChildren();
        b.refreshMapper();
        const D = E.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const B = I.map((P) => b.mapper.ingress(P));
        if (q.store && !q.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? q.store.applyQuery(B, { total: E.detail.total }).then(function(P) {
            C.queryGen != null && !b._isCurrentGen(C.targetEl, C.queryGen) || (k(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), k(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: P,
              total: E.detail.total !== void 0 ? E.detail.total : P.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : P.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), b._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? q.store.applyQuery(B, { total: E.detail.total }).then(function() {
            return q.store.getAll({});
          }).then(function(P) {
            C.queryGen != null && !b._isCurrentGen(C.targetEl, C.queryGen) || k(C.targetEl, "ln-options:set-data", { data: P.data });
          }) : C.kind === "stat" && q.store.applyQuery(B, { total: E.detail.total }).then(function() {
            if (C.queryGen != null && !b._isCurrentGen(C.targetEl, C.queryGen)) return;
            const P = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : B.length;
            k(C.targetEl, "ln-stat:set-count", { count: P });
          }) : q.store.applySync(B, R, O || Math.floor(Date.now() / 1e3), {
            total: E.detail.total,
            filtered: E.detail.filtered,
            offset: E.detail.offset,
            queryGen: E.detail.queryGen,
            targetEl: C.targetEl
          });
        else if (C.targetEl && C.kind) {
          if (C.kind === "table" || C.kind === "list" || C.kind === "chart")
            k(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), k(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: E.detail.total !== void 0 ? E.detail.total : B.length,
              filtered: E.detail.filtered !== void 0 ? E.detail.filtered : B.length,
              offset: E.detail.offset,
              queryGen: E.detail.queryGen
            }), b._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            k(C.targetEl, "ln-options:set-data", { data: B });
          else if (C.kind === "stat") {
            const P = E.detail.filtered !== void 0 ? E.detail.filtered : E.detail.total !== void 0 ? E.detail.total : B.length;
            k(C.targetEl, "ln-stat:set-count", { count: P });
          }
        }
      },
      connCreated: function(E) {
        const C = b.findChildren(), q = E.detail.meta || {}, D = b.mapper.ingress(E.detail.record);
        (C.storeEl ? b._requestStoreMutation(C, "update", { id: q.tempId, data: D }) : Promise.resolve()).then(function() {
          b._toastFromMessage(E.detail.message), q.queued && C.queue && k(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: q.entryId,
            oldKey: q.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          b._reportReconciliationError("create-reconcile", R, q);
        });
      },
      connUpdated: function(E) {
        const C = b.findChildren(), q = E.detail.meta || {}, D = b.mapper.ingress(E.detail.record);
        (C.storeEl ? b._requestStoreMutation(C, "update", { id: q.id, data: D }) : Promise.resolve()).then(function() {
          b._toastFromMessage(E.detail.message), q.queued && C.queue && k(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
        }).catch(function(R) {
          b._reportReconciliationError("update-reconcile", R, q);
        });
      },
      connDeleted: function(E) {
        const C = b.findChildren(), q = E.detail.meta || {};
        b._toastFromMessage(E.detail.message), q.queued && C.queue && k(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connBulkDeleted: function(E) {
        const C = b.findChildren(), q = E.detail.meta || {};
        b._toastFromMessage(E.detail.message), q.queued && C.queue && k(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connError: function(E) {
        const C = E.detail || {}, q = C.meta || {}, D = q.op || C.action, I = C.status || C.error && C.error.status || 0, R = b.findChildren();
        if (D === "sync") {
          R.storeEl && k(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          q.targetEl && q.kind && (k(q.targetEl, "ln-" + q.kind + ":set-loading", { loading: !1 }), (q.kind === "table" || q.kind === "list") && k(q.targetEl, "ln-" + q.kind + ":page-failed", { offset: q.offset })), b._reportReconciliationError("query", C.error || C, q);
          return;
        }
        const O = I === 401 || I === 419, B = I === 0 || I >= 500, P = I === 409 || I === 412;
        if (O) {
          b._toastFromDict("auth"), q.queued && R.queue && k(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "auth" });
          return;
        }
        if (B) {
          q.queued && R.queue ? k(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "retry" }) : b._toastFromDict("network");
          return;
        }
        let H = Promise.resolve();
        if (P && D === "update") {
          const z = C.data && C.data.remote ? b.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (H = b._requestStoreMutation(R, "update", { id: q.id, data: z })), b._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (H = b._requestStoreMutation(R, "delete", { id: q.tempId })), b._toastFromDict("rejected");
        q.queued && R.queue ? H.then(function() {
          k(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "drop" });
        }).catch(function(z) {
          b._reportReconciliationError("deterministic-reconcile", z, q);
        }) : H.catch(function(z) {
          b._reportReconciliationError("deterministic-reconcile", z, q);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(E) {
        const C = b.findChildren(), q = C.store;
        if (!q || q.initializationError || !C.connector || b._noAutosync || q.isSyncing) return;
        (E.detail || {}).hasCache ? b._isStale() && q.forceSync() : q.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(E) {
        b._serveData(E, "table");
      },
      reqListData: function(E) {
        b._serveData(E, "list");
      },
      reqChartData: function(E) {
        b._serveData(E, "chart");
      },
      reqOptions: function(E) {
        b._serveOptions(E);
      },
      reqStat: function(E) {
        b._serveStat(E);
      },
      refreshQuery: function() {
        b._refreshAll(null, !0);
      },
      refresh: function(E) {
        b._mutationReceipts.resolve(E.detail), b._refreshAll(null, !1);
      },
      mutationError: function(E) {
        b._mutationReceipts.reject(E.detail);
      },
      refreshSynced: function(E) {
        E.detail && E.detail.changed && b._refreshAll(E.detail.meta, !1);
      },
      searchChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.term != null ? E.detail.term : "";
        C !== (b.dom.getAttribute(l) || "") && b.dom.setAttribute(l, C);
      },
      filterChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.key;
        if (!C) return;
        const q = (E.detail.values || []).slice(), D = b._currentQuery().filters, I = D[C];
        if (I ? I.length === q.length && I.every((P, H) => P === q[H]) : !q.length) return;
        q.length ? D[C] = q : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(P) {
          D[P].forEach(function(H) {
            O.append(P, H);
          });
        });
        const B = O.toString();
        B ? b.dom.setAttribute(g, B) : b.dom.removeAttribute(g);
      },
      sortChange: function(E) {
        E.preventDefault();
        const C = E.detail && E.detail.field, q = E.detail && E.detail.direction, D = C && q && q !== "none" ? { field: C, direction: q } : null, I = b._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (b.dom.setAttribute(p, D.field), b.dom.setAttribute(o, D.direction)) : (b.dom.removeAttribute(p), b.dom.removeAttribute(o)));
      }
    }, b.dom.addEventListener("ln-data-store:request-remote-sync", b._handlers.sync), b.dom.addEventListener("ln-data-store:request-page", b._handlers.requestPage), b.dom.addEventListener("ln-data-coordinator:request-create", b._handlers.reqCreate), b.dom.addEventListener("ln-data-coordinator:request-update", b._handlers.reqUpdate), b.dom.addEventListener("ln-data-coordinator:request-delete", b._handlers.reqDelete), b.dom.addEventListener("ln-data-coordinator:request-bulk-delete", b._handlers.reqBulkDelete), b.dom.addEventListener("ln-api-queue:send", b._handlers.queueSend), b.dom.addEventListener("ln-api-queue:failed", b._handlers.queueFailed), b.dom.addEventListener("ln-data-store:initialized", b._handlers.storeInitialized), document.addEventListener("submit", b._handlers.formSubmit), s.forEach(function(E) {
      b.dom.addEventListener(E + ":fetched", b._handlers.connFetched), b.dom.addEventListener(E + ":created", b._handlers.connCreated), b.dom.addEventListener(E + ":updated", b._handlers.connUpdated), b.dom.addEventListener(E + ":deleted", b._handlers.connDeleted), b.dom.addEventListener(E + ":bulk-deleted", b._handlers.connBulkDeleted), b.dom.addEventListener(E + ":error", b._handlers.connError);
    }), document.addEventListener("ln-table:request-data", b._handlers.reqTableData), document.addEventListener("ln-list:request-data", b._handlers.reqListData), document.addEventListener("ln-chart:request-data", b._handlers.reqChartData), document.addEventListener("ln-options:request-data", b._handlers.reqOptions), document.addEventListener("ln-stat:request-count", b._handlers.reqStat), b.dom.addEventListener("ln-data-store:ready", b._handlers.refresh), b.dom.addEventListener("ln-data-store:created", b._handlers.refresh), b.dom.addEventListener("ln-data-store:updated", b._handlers.refresh), b.dom.addEventListener("ln-data-store:deleted", b._handlers.refresh), b.dom.addEventListener("ln-data-store:mutation-error", b._handlers.mutationError), b.dom.addEventListener("ln-data-store:synced", b._handlers.refreshSynced), b.dom.addEventListener("ln-data-store:query-changed", b._handlers.refreshQuery), b.dom.addEventListener("ln-search:change", b._handlers.searchChange), b.dom.addEventListener("ln-filter:change", b._handlers.filterChange), b.dom.addEventListener("ln-sort:change", b._handlers.sortChange);
  }
  y.prototype._owns = function(b) {
    return !!b && b === this._name;
  }, y.prototype._currentQuery = function() {
    const b = this.dom.getAttribute(p), E = this.dom.getAttribute(o), C = new URLSearchParams(this.dom.getAttribute(g) || ""), q = {};
    for (const D of new Set(C.keys())) q[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(l) || "",
      filters: q,
      sort: b && E ? { field: b, direction: E } : null
    };
  }, y.prototype._nextQueryGen = function(b) {
    const E = (this._queryGens.get(b) || 0) + 1;
    return this._queryGens.set(b, E), E;
  }, y.prototype._isCurrentGen = function(b, E) {
    return this._queryGens.get(b) === E;
  }, y.prototype._serveData = function(b, E) {
    const C = b.target, q = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(q);
    if (!D || !this._owns(D)) return;
    const I = b.detail || {}, R = Ri(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), B = this, P = O.store;
    return (P && P.ready ? P.ready : Promise.resolve()).then(function() {
      if (B._destroyed) return;
      const z = Ft(P, O.connector), $ = rn(R, B._currentQuery());
      if (z === "remote") {
        const V = B._nextQueryGen(C);
        k(C, "ln-" + E + ":set-loading", { loading: !0 }), k(O.connectorEl, m(O.connectorEl) + ":request-query", {
          query: $,
          meta: { targetEl: C, kind: E, offset: $.offset, limit: $.limit, queryGen: V }
        });
        return;
      }
      if (z !== "store") {
        k(C, "ln-" + E + ":set-loading", { loading: !1 });
        return;
      }
      const Y = $t(P, O.connector, z), X = Y ? B._nextQueryGen(C) : null;
      return Y && k(O.connectorEl, m(O.connectorEl) + ":request-query", {
        query: $,
        meta: { targetEl: C, kind: E, offset: $.offset, limit: $.limit, queryGen: X }
      }), P.getAll($).then(function(V) {
        if (B._destroyed || !B._boundDelivered || Y && !B._isCurrentGen(C, X)) return;
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
        k(C, "ln-" + E + ":set-data", G), B._boundDelivered.set(C, !0);
      });
    }).catch(function(z) {
      B._destroyed || (k(C, "ln-" + E + ":set-loading", { loading: !1 }), k(B.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: E,
        store: D,
        target: C,
        error: z
      }));
    });
  }, y.prototype._serveOptions = function(b) {
    const E = b.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const q = this.findChildren(), D = q.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Ft(D, q.connector);
      if (O === "remote") {
        const H = R._nextQueryGen(E);
        k(q.connectorEl, m(q.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: E, kind: "options", queryGen: H }
        });
        return;
      }
      if (O !== "store") return;
      const B = $t(D, q.connector, O), P = B ? R._nextQueryGen(E) : null;
      return B && k(q.connectorEl, m(q.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: E, kind: "options", queryGen: P }
      }), D.getAll({}).then(function(H) {
        R._destroyed || B && !R._isCurrentGen(E, P) || k(E, "ln-options:set-data", { data: H.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: E, kind: "options" });
    });
  }, y.prototype._serveStat = function(b) {
    const E = b.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const q = b.detail && b.detail.filters ? b.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const B = q && Object.keys(q).length > 0, P = !!(D.connector && I && (I.windowed && B || I.noLocalQuery)), H = P ? "remote" : Ft(I, D.connector);
      if (H === "remote") {
        const Y = O._nextQueryGen(E);
        k(D.connectorEl, m(D.connectorEl) + ":request-query", {
          query: { filters: q },
          meta: { targetEl: E, kind: "stat", queryGen: Y }
        });
        return;
      }
      if (H !== "store") return;
      const z = !P && $t(I, D.connector, H), $ = z ? O._nextQueryGen(E) : null;
      return z && k(D.connectorEl, m(D.connectorEl) + ":request-query", {
        query: { filters: q },
        meta: { targetEl: E, kind: "stat", queryGen: $ }
      }), I.count(q).then(function(Y) {
        O._destroyed || z && !O._isCurrentGen(E, $) || k(E, "ln-stat:set-count", { count: Y });
      });
    }).catch(function(B) {
      O._destroyed || O._reportReconciliationError("stat-query", B, { targetEl: E, kind: "stat" });
    });
  }, y.prototype._refreshAll = function(b, E) {
    const C = this, q = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let D = 0; D < q.length; D++) {
      const I = q[D];
      let R, O;
      if (I.hasAttribute("data-ln-table-source") ? (R = I.getAttribute("data-ln-table-source"), O = "table") : I.hasAttribute("data-ln-list-source") ? (R = I.getAttribute("data-ln-list-source"), O = "list") : I.hasAttribute("data-ln-chart-source") ? (R = I.getAttribute("data-ln-chart-source"), O = "chart") : I.hasAttribute("data-ln-options") ? (R = I.getAttribute("data-ln-options"), O = "options") : I.hasAttribute("data-ln-stat") && (R = I.getAttribute("data-ln-stat"), O = "stat"), !C._owns(R)) continue;
      const B = C.findChildren(), P = B.store;
      if (O === "table" || O === "list") {
        const H = O === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (I.hasAttribute(H)) {
          k(I, "ln-" + O + (E ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (O === "table" || O === "list" || O === "chart") {
        const H = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = rn(H, C._currentQuery());
        if (Ft(P, B.connector) === "remote") {
          const X = C._nextQueryGen(I);
          k(I, "ln-" + O + ":set-loading", { loading: !0 }), k(B.connectorEl, m(B.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
          });
          continue;
        }
        const $ = $t(P, B.connector, Ft(P, B.connector)), Y = $ ? C._nextQueryGen(I) : null;
        $ && k(B.connectorEl, m(B.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
        }), (function(X, V, G, ht) {
          P.getAll(z).then(function(bt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(X, ht)) return;
            const ae = {
              data: bt.data,
              total: b && b.total !== void 0 ? b.total : bt.total,
              filtered: b && b.filtered !== void 0 ? b.filtered : bt.filtered,
              offset: bt.offset !== void 0 ? bt.offset : b && b.offset !== void 0 ? b.offset : H.offset,
              queryGen: bt.queryGen !== void 0 ? bt.queryGen : b && b.queryGen !== void 0 ? b.queryGen : H.queryGen
            };
            k(X, "ln-" + V + ":set-loading", { loading: !1 }), k(X, "ln-" + V + ":set-data", ae), C._boundDelivered.set(X, !0);
          }).catch(function() {
          });
        })(I, O, $, Y);
      } else if (O === "options")
        (function(H) {
          P.getAll({}).then(function(z) {
            C._destroyed || k(H, "ln-options:set-data", { data: z.data });
          }).catch(function() {
          });
        })(I);
      else if (O === "stat") {
        const H = I.getAttribute("data-ln-stat-filter");
        let z = null;
        if (H) {
          const $ = H.indexOf(":");
          if ($ !== -1) {
            const Y = H.slice(0, $).trim(), X = H.slice($ + 1).trim();
            Y && (z = {}, z[Y] = [X]);
          }
        }
        (function($, Y) {
          P.count(Y).then(function(X) {
            C._destroyed || k($, "ln-stat:set-count", { count: X });
          }).catch(function() {
          });
        })(I, z);
      }
    }
  }, y.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const b = this;
    b._handlers && (b.dom.removeEventListener("ln-data-store:request-remote-sync", b._handlers.sync), b.dom.removeEventListener("ln-data-store:request-page", b._handlers.requestPage), b.dom.removeEventListener("ln-data-coordinator:request-create", b._handlers.reqCreate), b.dom.removeEventListener("ln-data-coordinator:request-update", b._handlers.reqUpdate), b.dom.removeEventListener("ln-data-coordinator:request-delete", b._handlers.reqDelete), b.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", b._handlers.reqBulkDelete), b.dom.removeEventListener("ln-api-queue:send", b._handlers.queueSend), b.dom.removeEventListener("ln-api-queue:failed", b._handlers.queueFailed), b.dom.removeEventListener("ln-data-store:initialized", b._handlers.storeInitialized), document.removeEventListener("submit", b._handlers.formSubmit), s.forEach(function(E) {
      b.dom.removeEventListener(E + ":fetched", b._handlers.connFetched), b.dom.removeEventListener(E + ":created", b._handlers.connCreated), b.dom.removeEventListener(E + ":updated", b._handlers.connUpdated), b.dom.removeEventListener(E + ":deleted", b._handlers.connDeleted), b.dom.removeEventListener(E + ":bulk-deleted", b._handlers.connBulkDeleted), b.dom.removeEventListener(E + ":error", b._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", b._handlers.reqTableData), document.removeEventListener("ln-list:request-data", b._handlers.reqListData), document.removeEventListener("ln-chart:request-data", b._handlers.reqChartData), document.removeEventListener("ln-options:request-data", b._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", b._handlers.reqStat), b.dom.removeEventListener("ln-data-store:ready", b._handlers.refresh), b.dom.removeEventListener("ln-data-store:created", b._handlers.refresh), b.dom.removeEventListener("ln-data-store:updated", b._handlers.refresh), b.dom.removeEventListener("ln-data-store:deleted", b._handlers.refresh), b.dom.removeEventListener("ln-data-store:mutation-error", b._handlers.mutationError), b.dom.removeEventListener("ln-data-store:synced", b._handlers.refreshSynced), b.dom.removeEventListener("ln-data-store:query-changed", b._handlers.refreshQuery), b.dom.removeEventListener("ln-search:change", b._handlers.searchChange), b.dom.removeEventListener("ln-filter:change", b._handlers.filterChange), b.dom.removeEventListener("ln-sort:change", b._handlers.sortChange), b._handlers = null), b._boundQueries = null, b._boundDelivered = null, b._queryGens = null, b._queueQueryRefresh = null, b._mutationReceipts.close(new Error("Data coordinator destroyed")), b._mutationReceipts = null, u.delete(this), _(), delete this.dom[e];
  }, j(t, e, y, "ln-data-coordinator", {
    attributes: i
  });
})();
const Mi = "ln_api_queue", Ni = 2, it = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function qt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function on(t) {
  return "seq:" + t;
}
function Xt(t) {
  return "paused:" + t;
}
function sn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function Fi(t, e, r) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(r);
}
function Bi(t, e, r, l) {
  const g = /* @__PURE__ */ new Map(), p = [], o = [];
  for (const a of t || [])
    g.has(a.chainKey) || g.set(a.chainKey, []), g.get(a.chainKey).push(a);
  return g.forEach((a, d) => {
    a.sort((i, f) => i.seq - f.seq);
    const n = a[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > l) {
        o.push({ chainKey: d, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > l) {
        o.push({ chainKey: d, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = l + r, n.updatedAt = l, p.push(n);
    }
  }), { entries: p, wakeups: o };
}
function Pi(t, e, r, l, g) {
  const p = [], o = [];
  for (const a of t || []) {
    if (a.entryId === e) {
      o.push(a.entryId);
      continue;
    }
    a.chainKey === r && (a.chainKey = l, a.targetId === r && (a.targetId = l), a.meta && a.meta.id === r && (a.meta.id = l), a.meta && typeof a.meta.action == "string" && (a.meta.action = Fi(a.meta.action, r, l)), a.updatedAt = g, p.push(a));
  }
  return { changed: p, deleted: o };
}
class Ui {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || Mi, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, r) => {
      const l = this.indexedDB.open(this.dbName, Ni);
      l.onupgradeneeded = (g) => {
        const p = g.target.result;
        let o;
        p.objectStoreNames.contains(it) ? o = g.target.transaction.objectStore(it) : o = p.createObjectStore(it, { keyPath: "entryId" }), o.indexNames.contains("by_scope_chain") || o.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), o.indexNames.contains("by_scope_seq") || o.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(lt) || p.createObjectStore(lt, { keyPath: "key" });
      }, l.onerror = () => r(ut(l, "Queue database open failed")), l.onsuccess = (g) => {
        this._db = g.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, r) => {
      const l = this.indexedDB.deleteDatabase(this.dbName);
      l.onsuccess = () => e(), l.onerror = () => r(ut(l, "Queue database delete failed")), l.onblocked = () => r(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((r) => r ? new Promise((l, g) => {
      const o = r.transaction(it, "readonly").objectStore(it).index("by_scope_seq").getAll(qt(this.keyRange, e));
      o.onsuccess = () => l(o.result || []), o.onerror = () => g(ut(o, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, r) {
    return r = r || {}, this.open().then((l) => l ? new Promise((g, p) => {
      const o = l.transaction([lt, it], "readwrite"), a = o.objectStore(lt), d = o.objectStore(it), n = on(e);
      let i = null;
      const f = (w) => {
        const v = w + 1;
        i = {
          entryId: this.uuid(),
          scope: e,
          chainKey: r.chainKey,
          seq: v,
          op: r.op,
          targetId: r.targetId !== void 0 ? r.targetId : null,
          payload: r.payload,
          expectedVersion: r.expectedVersion !== void 0 ? r.expectedVersion : null,
          meta: r.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, a.put({ key: n, value: v }), d.put(i);
      }, u = a.get(n);
      u.onerror = () => p(ut(u, "Queue sequence read failed")), u.onsuccess = () => {
        const w = u.result;
        if (w && typeof w.value == "number") {
          f(w.value);
          return;
        }
        const v = d.index("by_scope_seq").getAll(qt(this.keyRange, e));
        v.onerror = () => p(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, h) => Math.max(A, h.seq || 0), 0);
          f(S);
        };
      }, o.oncomplete = () => g(i), o.onerror = () => p(o.error || new Error("Queue enqueue transaction failed")), o.onabort = () => p(o.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, r, l) {
    return this.open().then((g) => g ? new Promise((p, o) => {
      const a = g.transaction(it, "readwrite"), d = a.objectStore(it), n = d.index("by_scope_seq").getAll(qt(this.keyRange, e)), i = this.now();
      let f = { entries: [], wakeups: [] };
      n.onerror = () => o(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        f = Bi(n.result || [], r, l, i);
        for (const u of f.entries) d.put(u);
      }, a.oncomplete = () => p(f), a.onerror = () => o(a.error || new Error("Queue claim transaction failed")), a.onabort = () => o(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, r) {
    return this._updateEntry(e, r, (l, g) => (g.delete(l.entryId), { status: "acked", entry: l }));
  }
  nack(e, r, l, g) {
    g = g || {};
    const p = g.maxAttempts || 8, o = g.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((d, n) => {
      const i = a.transaction([it, lt], "readwrite"), f = i.objectStore(it), u = i.objectStore(lt), w = f.get(r);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (l === "drop") {
            f.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (sn(S), S.updatedAt = this.now(), l === "auth") {
            S.status = "pending", f.put(S), u.put({ key: Xt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (l === "retry") {
            if (S.attempts = (S.attempts || 0) + 1, S.attempts >= p) {
              S.status = "failed", S.nextAttemptAt = 0, f.put(S), v = { status: "failed", entry: S };
              return;
            }
            const A = o[Math.min(S.attempts - 1, o.length - 1)];
            S.status = "pending", S.nextAttemptAt = this.now() + A, f.put(S), v = { status: "retry", entry: S, delay: A };
          }
        }
      }, i.oncomplete = () => d(v), i.onerror = () => n(i.error || new Error("Queue nack transaction failed")), i.onabort = () => n(i.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, r, l) {
    return this._remapTransaction(e, null, r, l);
  }
  resolveCreate(e, r, l, g) {
    return this._remapTransaction(e, r, l, g);
  }
  _remapTransaction(e, r, l, g) {
    return this.open().then((p) => p ? new Promise((o, a) => {
      const d = p.transaction(it, "readwrite"), n = d.objectStore(it), i = n.index("by_scope_seq").getAll(qt(this.keyRange, e));
      let f = { changed: [], deleted: [] };
      i.onerror = () => a(ut(i, "Queue remap read failed")), i.onsuccess = () => {
        f = Pi(i.result || [], r, l, g, this.now());
        for (const u of f.deleted) n.delete(u);
        for (const u of f.changed) n.put(u);
      }, d.oncomplete = () => o(f.changed), d.onerror = () => a(d.error || new Error("Queue remap transaction failed")), d.onabort = () => a(d.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((r) => r ? new Promise((l, g) => {
      const p = r.transaction(it, "readwrite"), o = p.objectStore(it), a = o.index("by_scope_seq").getAll(qt(this.keyRange, e));
      let d = 0;
      a.onerror = () => g(ut(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const n of a.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), sn(n), o.put(n), d++);
      }, p.oncomplete = () => l(d), p.onerror = () => g(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => g(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((r) => r ? new Promise((l, g) => {
      const o = r.transaction(lt, "readonly").objectStore(lt).get(Xt(e));
      o.onsuccess = () => {
        const a = o.result ? o.result.value : !1;
        l(a || !1);
      }, o.onerror = () => g(ut(o, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, r) {
    return this.open().then((l) => {
      if (l)
        return new Promise((g, p) => {
          const o = l.transaction(lt, "readwrite"), a = typeof r == "string" ? r : r ? "manual" : !1;
          o.objectStore(lt).put({ key: Xt(e), value: a }), o.oncomplete = () => g(), o.onerror = () => p(o.error || new Error("Queue pause-state write failed")), o.onabort = () => p(o.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((r) => {
      if (r)
        return new Promise((l, g) => {
          const p = r.transaction([it, lt], "readwrite"), a = p.objectStore(it).index("by_scope_seq").openCursor(qt(this.keyRange, e));
          a.onsuccess = (d) => {
            const n = d.target.result;
            n && (n.delete(), n.continue());
          }, a.onerror = () => g(ut(a, "Queue clear failed")), p.objectStore(lt).delete(on(e)), p.objectStore(lt).delete(Xt(e)), p.oncomplete = () => l(), p.onerror = () => g(p.error || new Error("Queue clear transaction failed")), p.onabort = () => g(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, r, l) {
    return this.open().then((g) => g ? new Promise((p, o) => {
      const a = g.transaction(it, "readwrite"), d = a.objectStore(it), n = d.get(r);
      let i = null;
      n.onerror = () => o(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const f = n.result;
        !f || f.scope !== e || (i = l(f, d));
      }, a.oncomplete = () => p(i), a.onerror = () => o(a.error || new Error("Queue entry transaction failed")), a.onabort = () => o(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", r = [2e3, 5e3, 15e3, 6e4, 3e5], l = 8, g = 6e4;
  if (window[e] !== void 0) return;
  function p(i) {
    const f = i[e];
    f && f._drain();
  }
  const o = {
    "data-ln-api-queue": {},
    "data-ln-api-queue-online": { effect: p }
  };
  function a() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (f) => {
        const u = Math.random() * 16 | 0;
        return (f === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const d = new Ui({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: a
  });
  function n(i) {
    this.dom = i, i[e] = this;
    const f = i.closest("[data-ln-data-coordinator]");
    this.scope = i.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = a(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return d.open().then((w) => w ? d.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (u._paused = !!w, u._paused) {
        const v = typeof w == "string" ? w : "auth";
        k(u.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return u._emitPendingCount();
    }).then(() => u._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), k(u.dom, "ln-api-queue:error", { operation: "initialize", error: w });
    }), this;
  }
  n.prototype._isOnline = function() {
    const i = this.dom.getAttribute("data-ln-api-queue-online");
    return i === "true" ? !0 : i === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const i = this;
    return d.allForScope(i.scope).then((f) => (k(i.dom, "ln-api-queue:pending-count", { count: f.length, scope: i.scope }), f.length === 0 && k(i.dom, "ln-api-queue:drained", { scope: i.scope }), f));
  }, n.prototype._clearTimer = function(i) {
    const f = this._timers.get(i);
    f && (clearTimeout(f), this._timers.delete(i));
  }, n.prototype._scheduleTimer = function(i, f) {
    const u = Math.max(0, f), w = this._timers.get(i);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(i), v._drain();
    }, u);
    this._timers.set(i, S);
  }, n.prototype._drain = function() {
    const i = this;
    return i._paused || !i._isOnline() ? Promise.resolve() : (i._drainPromise || (i._drainPromise = d.claimReady(i.scope, i._workerId, g).then((f) => {
      for (const u of f.wakeups)
        i._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of f.entries)
        i._clearTimer(u.chainKey), k(i.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((f) => {
      console.error("[ln-api-queue] Drain failed:", f), k(i.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      i._drainPromise = null;
    })), i._drainPromise);
  }, n.prototype._onEnqueue = function(i) {
    const f = this;
    return d.enqueue(f.scope, i.detail || {}).then((u) => {
      if (u)
        return f._emitPendingCount().then((w) => (k(f.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), f._drain()));
    }).catch((u) => {
      k(f.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(i) {
    const f = this, u = i.detail || {};
    return d.ack(f.scope, u.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      k(f.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(i) {
    const f = this, u = i.detail || {};
    return d.nack(f.scope, u.entryId, u.reason, {
      maxAttempts: l,
      backoff: r
    }).then((w) => {
      if (w)
        return w.status === "failed" ? k(f.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? f._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (f._paused = !0, k(f.dom, "ln-api-queue:paused", { reason: "auth" }), k(f.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), f._emitPendingCount().then(() => {
          if (w.status === "dropped") return f._drain();
        });
    }).catch((w) => {
      k(f.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onRemap = function(i) {
    const f = this, u = i.detail || {};
    return d.remap(f.scope, u.oldKey, u.newId).catch((w) => {
      k(f.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(i) {
    const f = this, u = i.detail || {};
    return d.resolveCreate(f.scope, u.entryId, u.oldKey, u.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      k(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const i = this;
    return d.setPaused(i.scope, !1).then(() => (i._paused = !1, k(i.dom, "ln-api-queue:resumed", {}), i._drain())).catch((f) => {
      k(i.dom, "ln-api-queue:error", { operation: "resume", error: f });
    });
  }, n.prototype._onPause = function() {
    const i = this;
    return d.setPaused(i.scope, "manual").then(() => {
      i._paused = !0, k(i.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((f) => {
      k(i.dom, "ln-api-queue:error", { operation: "pause", error: f });
    });
  }, n.prototype._onDrain = function() {
    const i = this;
    return d.resetFailed(i.scope).then(() => {
      const f = i._drainPromise;
      return f ? f.then(() => i._drain()) : i._drain();
    }).catch((f) => {
      k(i.dom, "ln-api-queue:error", { operation: "manual-drain", error: f });
    });
  }, n.prototype._onClear = function() {
    const i = this;
    return i._timers.forEach((f) => clearTimeout(f)), i._timers.clear(), d.clear(i.scope).then(() => {
      i._paused = !1, k(i.dom, "ln-api-queue:pending-count", { count: 0, scope: i.scope }), k(i.dom, "ln-api-queue:drained", { scope: i.scope });
    }).catch((f) => {
      k(i.dom, "ln-api-queue:error", { operation: "clear", error: f });
    });
  }, n.prototype._bindEvents = function() {
    const i = this;
    i._handlers = {
      enqueue: (f) => i._onEnqueue(f),
      ack: (f) => i._onAck(f),
      nack: (f) => i._onNack(f),
      remap: (f) => i._onRemap(f),
      resolveCreate: (f) => i._onResolveCreate(f),
      resume: () => i._onResume(),
      pause: () => i._onPause(),
      drain: () => i._onDrain(),
      clear: () => i._onClear()
    }, i.dom.addEventListener("ln-api-queue:request-enqueue", i._handlers.enqueue), i.dom.addEventListener("ln-api-queue:ack", i._handlers.ack), i.dom.addEventListener("ln-api-queue:nack", i._handlers.nack), i.dom.addEventListener("ln-api-queue:request-remap", i._handlers.remap), i.dom.addEventListener("ln-api-queue:resolve-create", i._handlers.resolveCreate), i.dom.addEventListener("ln-api-queue:request-resume", i._handlers.resume), i.dom.addEventListener("ln-api-queue:request-pause", i._handlers.pause), i.dom.addEventListener("ln-api-queue:request-drain", i._handlers.drain), i.dom.addEventListener("ln-api-queue:request-clear", i._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const i = this;
    i.dom.removeEventListener("ln-api-queue:request-enqueue", i._handlers.enqueue), i.dom.removeEventListener("ln-api-queue:ack", i._handlers.ack), i.dom.removeEventListener("ln-api-queue:nack", i._handlers.nack), i.dom.removeEventListener("ln-api-queue:request-remap", i._handlers.remap), i.dom.removeEventListener("ln-api-queue:resolve-create", i._handlers.resolveCreate), i.dom.removeEventListener("ln-api-queue:request-resume", i._handlers.resume), i.dom.removeEventListener("ln-api-queue:request-pause", i._handlers.pause), i.dom.removeEventListener("ln-api-queue:request-drain", i._handlers.drain), i.dom.removeEventListener("ln-api-queue:request-clear", i._handlers.clear), window.removeEventListener("online", i._onlineHandler), i._timers.forEach((f) => clearTimeout(f)), i._timers.clear(), k(i.dom, "ln-api-queue:destroyed", { scope: i.scope }), delete i.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: o
  });
})();
function nr(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function xt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Hi(t, e, r) {
  const l = nr(t);
  return l === null || l < 0 ? 0 : Math.min(l, Math.min(e, r) / 2);
}
function zi(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((r) => !Number.isFinite(r)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Ki(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), r = e[0].trim();
  return r ? {
    field: r,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function ji(t, e) {
  e = e || {};
  const r = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, l = e.xField || "label", g = e.yField || "value", p = e.includeZero !== !1, o = Hi(e.padding, r.width, r.height), a = Array.isArray(t) ? t : [], d = [];
  for (let s = 0; s < a.length; s++) {
    const m = a[s] || {}, y = nr(m[g]);
    y !== null && d.push({
      record: m,
      sourceIndex: s,
      label: m[l] == null ? String(s + 1) : String(m[l]),
      value: y
    });
  }
  if (d.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: r.y + r.height - o
    };
  let n = d[0].value, i = d[0].value;
  for (let s = 1; s < d.length; s++)
    d[s].value < n && (n = d[s].value), d[s].value > i && (i = d[s].value);
  let f = n, u = i;
  p && (f = Math.min(0, f), u = Math.max(0, u)), f === u && (u === 0 ? u = 1 : u > 0 ? f = 0 : u = 0);
  const w = Math.max(1, r.width - o * 2), v = Math.max(1, r.height - o * 2), S = u - f, A = r.y + r.height - o - (0 - f) / S * v, h = [];
  for (let s = 0; s < d.length; s++) {
    const m = d[s], y = d.length === 1 ? 0.5 : s / (d.length - 1), T = r.x + o + y * w, b = r.y + r.height - o - (m.value - f) / S * v;
    h.push({
      record: m.record,
      sourceIndex: m.sourceIndex,
      label: m.label,
      value: m.value,
      x: T,
      y: b,
      pointString: xt(T) + "," + xt(b)
    });
  }
  const _ = h.map((s) => s.pointString).join(" ");
  let c = "";
  if (h.length > 0) {
    const s = h[0], m = h[h.length - 1], y = xt(s.x) + "," + xt(A), T = xt(m.x) + "," + xt(A);
    c = y + " " + _ + " " + T;
  }
  return {
    points: h,
    linePoints: _,
    areaPoints: c,
    count: h.length,
    min: n,
    max: i,
    domainMin: f,
    domainMax: u,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", r = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function l(n) {
    const i = n[e];
    i && i.requestData();
  }
  function g(n) {
    const i = n[e];
    i && i._render();
  }
  const p = {
    "data-ln-chart": { prop: "name", read: Q, fallback: "", effect: g },
    "data-ln-chart-source": { effect: l },
    "data-ln-chart-sort": { effect: l },
    "data-ln-chart-type": { effect: g },
    "data-ln-chart-x": { effect: g },
    "data-ln-chart-y": { effect: g },
    "data-ln-chart-padding": { effect: g },
    "data-ln-chart-zero": { effect: g }
  }, o = et(p);
  function a(n, i) {
    n && (n.textContent = i);
  }
  function d(n) {
    this.dom = n, tt(this, n, o), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const i = this;
    return this._onSetData = function(f) {
      const u = f.detail || {};
      i._data = Array.isArray(u.data) ? u.data : [], i.isLoaded = !0, i._setLoading(!1), i._render();
    }, this._onSetLoading = function(f) {
      i._setLoading(!!(f.detail && f.detail.loading));
    }, this._onRefresh = function() {
      i.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  d.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), i = n === null ? NaN : Number(n), f = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(i) && i >= 0 ? i : 16,
      type: f === "area" || f === "polygon" ? "area" : "line",
      viewBox: this.plot && zi(this.plot.getAttribute("viewBox")) || r
    };
  }, d.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, d.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const i = this.name + "-label", f = '[data-ln-template="' + i + '"]';
    if (!this.dom.querySelector(f) && !document.querySelector(f)) return;
    const u = Ct(this.dom, i, "ln-chart");
    if (!u) return;
    const w = rt(this.dom);
    for (const v of n.points) {
      const S = u.cloneNode(!0);
      jt(S, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(S);
    }
  }, d.prototype._render = function() {
    const n = this._readOptions(), i = ji(this._data, n);
    this.model = i, this.line && (this.line.setAttribute("points", i.linePoints), this.line.toggleAttribute("hidden", i.count === 0)), this.area && (this.area.setAttribute("points", i.areaPoints), this.area.toggleAttribute("hidden", i.count === 0 || n.type !== "area"));
    const f = i.count === 0;
    this.dom.classList.toggle("ln-chart--empty", f), this.empty && this.empty.toggleAttribute("hidden", !f);
    const u = rt(this.dom);
    a(this.minimum, ct(i.min, u)), a(this.maximum, ct(i.max, u)), a(this.count, ct(i.count, u)), this._renderLabels(i), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: i.count,
      min: i.min,
      max: i.max
    });
  }, d.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, k(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Ki(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, j(t, e, d, "ln-chart", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-options": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-options-value": { prop: "_valueField", read: Q, fallback: "id" },
    "data-ln-options-label": { prop: "_labelField", read: Q, fallback: "name" }
  }, l = et(r);
  function g(p) {
    this.dom = p, tt(this, p, l);
    const o = this;
    return this._onSetData = function(a) {
      o._rebuild(a.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), k(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  g.prototype._rebuild = function(p) {
    const o = this.dom, a = this._valueField, d = this._labelField, n = o.value, i = o.querySelectorAll("option");
    for (let u = i.length - 1; u >= 0; u--)
      i[u].value !== "" && o.removeChild(i[u]);
    for (let u = 0; u < p.length; u++) {
      const w = p[u], v = document.createElement("option");
      v.value = String(w[a]), v.textContent = w[d] != null ? w[d] : "", o.appendChild(v);
    }
    const f = o.options;
    for (let u = 0; u < f.length; u++)
      if (f[u].value === n) {
        o.value = n;
        break;
      }
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, g, "ln-options", {
    attributes: r
  });
})();
function Vi(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const r = t.slice(0, e).trim(), l = t.slice(e + 1).trim();
  if (!r) return null;
  const g = {};
  return g[r] = [l], g;
}
function Wi(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-stat": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-stat-filter": { prop: "_filterRaw", read: Q, fallback: "" }
  }, l = et(r);
  function g(p) {
    return this.dom = p, tt(this, p, l), this._onSetCount = function(o) {
      p.textContent = Wi(o.detail && o.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), k(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Vi(this._filterRaw)
    }), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, g, "ln-stat", {
    attributes: r
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", r = "#ln-icon-custom-", l = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let p = null;
  const o = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), d = "lni:", n = "lni:v", i = "1";
  function f() {
    try {
      if (localStorage.getItem(n) !== i) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const c = localStorage.key(_);
          c && c.indexOf(d) === 0 && localStorage.removeItem(c);
        }
        localStorage.setItem(n, i);
      }
    } catch {
    }
  }
  f();
  function u() {
    return p || (p = document.getElementById(t), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = t, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function w(_) {
    return _.indexOf(r) === 0 ? a + "/" + _.slice(r.length) + ".svg" : o + "/" + _.slice(e.length) + ".svg";
  }
  function v(_, c) {
    const s = c.match(/viewBox="([^"]+)"/), m = s ? s[1] : "0 0 24 24", y = c.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = y ? y[1].trim() : "", b = c.match(/<svg([^>]*)>/i), E = b ? b[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = _, C.setAttribute("viewBox", m), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = E.match(new RegExp(q + '="([^"]*)"'));
      D && C.setAttribute(q, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function S(_) {
    if (l.has(_) || g.has(_)) return;
    if (_.indexOf(r) === 0 && !a) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const c = _.slice(1);
    try {
      const m = localStorage.getItem(d + c);
      if (m) {
        v(c, m), l.add(_);
        return;
      }
    } catch {
    }
    g.add(_);
    const s = w(_);
    fetch(s).then(function(m) {
      if (!m.ok) throw new Error(m.status);
      return m.text();
    }).then(function(m) {
      v(c, m), l.add(_), g.delete(_);
      try {
        localStorage.setItem(d + c, m);
      } catch {
      }
    }).catch(function(m) {
      console.error("[ln-icon] Fetch failed for:", c, m), g.delete(_);
    });
  }
  function A(_) {
    const c = 'use[href^="' + e + '"], use[href^="' + r + '"]', s = _.querySelectorAll ? _.querySelectorAll(c) : [];
    if (_.matches && _.matches(c)) {
      const m = _.getAttribute("href");
      m && S(m);
    }
    Array.prototype.forEach.call(s, function(m) {
      const y = m.getAttribute("href");
      y && S(y);
    });
  }
  function h() {
    A(document), new MutationObserver(function(_) {
      _.forEach(function(c) {
        if (c.type === "childList")
          c.addedNodes.forEach(function(s) {
            s.nodeType === 1 && A(s);
          });
        else if (c.type === "attributes" && c.attributeName === "href") {
          const s = c.target.getAttribute("href");
          s && (s.indexOf(e) === 0 || s.indexOf(r) === 0) && S(s);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
const Re = /* @__PURE__ */ new Set([
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
function Gi(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const r = [];
  for (let l = 0; l <= e.length; l++) r[l] = [l];
  for (let l = 0; l <= t.length; l++) r[0][l] = l;
  for (let l = 1; l <= e.length; l++)
    for (let g = 1; g <= t.length; g++)
      e.charAt(l - 1) === t.charAt(g - 1) ? r[l][g] = r[l - 1][g - 1] : r[l][g] = Math.min(
        r[l - 1][g - 1] + 1,
        r[l][g - 1] + 1,
        r[l - 1][g] + 1
      );
  return r[e.length][t.length];
}
function Qi(t, e = Re) {
  if (e.has(t)) return null;
  let r = null, l = 1 / 0;
  for (const p of e) {
    const o = Gi(t, p);
    o < l && (l = o, r = p);
  }
  const g = Math.max(3, Math.floor(t.length * 0.4));
  return l <= g ? r : null;
}
function rr(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function $i(t = document) {
  const e = t.ownerDocument || t, r = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!r) return [];
  const l = [], g = [r, ...r.querySelectorAll("*")];
  for (let p = 0; p < g.length; p++) {
    const o = g[p];
    if (o.attributes)
      for (let a = 0; a < o.attributes.length; a++) {
        const d = o.attributes[a];
        if (d.name.startsWith("data-ln-") && d.name.endsWith("-for")) {
          const n = (d.value || "").trim();
          if (!n) {
            l.push({
              type: "id-empty",
              element: o,
              attribute: d.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${o.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + rr(n)) || l.push({
            type: "id-unresolved",
            element: o,
            attribute: d.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${o.tagName.toLowerCase()} ${d.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return l;
}
function Xi(t = document) {
  const e = t.ownerDocument || t, r = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!r) return [];
  const l = [], g = [r, ...r.querySelectorAll("*")];
  for (let p = 0; p < g.length; p++) {
    const o = g[p];
    if (o.attributes)
      for (let a = 0; a < o.attributes.length; a++) {
        const d = o.attributes[a];
        if (d.name.startsWith("data-ln-") && (d.name.endsWith("-source") || d.name.endsWith("-store")) && d.name !== "data-ln-data-store") {
          const i = (d.value || "").trim();
          if (!i) {
            l.push({
              type: "store-empty",
              element: o,
              attribute: d.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${o.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          const f = rr(i), u = e.querySelector(`[data-ln-data-store="${f}"], [data-ln-store="${f}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(i);
          !u && !w && l.push({
            type: "store-unresolved",
            element: o,
            attribute: d.name,
            storeName: i,
            message: `[ln-debug] Unresolved store reference: <${o.tagName.toLowerCase()} ${d.name}="${i}"> targets store "${i}", but no [data-ln-data-store="${i}"] exists in the document.`
          });
        }
      }
  }
  return l;
}
function Yi(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const r = [], l = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && l.unshift(e);
  const g = /* @__PURE__ */ new Map();
  for (let p = 0; p < l.length; p++) {
    const o = l[p], a = (o.getAttribute("data-ln-data-store") || "").trim();
    a && (g.has(a) || g.set(a, []), g.get(a).push(o));
  }
  for (const [p, o] of g.entries())
    o.length > 1 && r.push({
      type: "store-duplicate",
      storeName: p,
      elements: o,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${p}". Store names must be unique across the document.`
    });
  return r;
}
function Ji(t = document, e = Re) {
  const r = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!r) return [];
  const l = [], g = [r, ...r.querySelectorAll("*")];
  for (let p = 0; p < g.length; p++) {
    const o = g[p];
    if (o.attributes)
      for (let a = 0; a < o.attributes.length; a++) {
        const d = o.attributes[a];
        if (d.name.startsWith("data-ln-") && !e.has(d.name)) {
          const n = Qi(d.name, e), i = n ? ` Did you mean "${n}"?` : "";
          l.push({
            type: "attribute-unknown",
            element: o,
            attribute: d.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${d.name}" on <${o.tagName.toLowerCase()}>.${i}`
          });
        }
      }
  }
  return l;
}
function Se(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const r = e.validAttributes || Re, l = $i(t), g = Xi(t), p = Yi(t), o = Ji(t, r), a = [
    ...l,
    ...g,
    ...p,
    ...o
  ];
  if (!e.silent)
    for (let d = 0; d < a.length; d++)
      console.warn(a[d].message);
  return {
    idIssues: l,
    storeIssues: g,
    uniquenessIssues: p,
    spellingIssues: o,
    total: a.length
  };
}
let Bt = null;
function Yt(t = typeof document < "u" ? document : null, e = 50, r = null) {
  if (!t) return;
  Bt && (clearTimeout(Bt), Bt = null);
  function l() {
    Bt = setTimeout(() => {
      Bt = null;
      const g = Se(t);
      r && r(g);
    }, e);
  }
  mn() > 0 ? mt(l) : l();
}
function an(t, e, r, l) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", r), console.log("detail", l), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", r), console.log("old → new", l.oldValue, "→", l.newValue), console.groupEnd());
}
let Dt = [];
function Zi() {
  Dt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Dt.push(document.body);
}
function to(t) {
  for (let e = 0; e < Dt.length; e++)
    if (Dt[e].contains(t)) return !0;
  return !1;
}
function eo(t, e, r, l) {
  if (r === window || r === document) {
    Dt.indexOf(document.body) !== -1 && an(t, e, r, l);
    return;
  }
  to(r) && an(t, e, r, l);
}
function Ce() {
  Zi(), br(Dt.length > 0 ? eo : null);
}
function ln() {
  Ce();
}
function no() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Ce(), Vt(["data-ln-debug"], Ce);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const r = {
    "data-ln-debug": {}
  };
  no();
  function l(p) {
    return this.dom = p, Yt(p.ownerDocument || document), ln(), this;
  }
  l.prototype.verify = function(p, o) {
    return Se(p || (this.dom ? this.dom.ownerDocument || this.dom : document), o);
  }, l.prototype.destroy = function() {
    delete this.dom[e], ln();
  };
  const g = j(t, e, l, "ln-debug", {
    attributes: r,
    onInit: function(p) {
      typeof document < "u" && Yt(p && p.ownerDocument ? p.ownerDocument : document);
    },
    onSubtreeChange: function(p) {
      typeof document < "u" && Yt(p && p.ownerDocument ? p.ownerDocument : document);
    }
  });
  g.verify = function(p, o) {
    return Se(p || document, o);
  }, g.schedule = function(p, o, a) {
    return Yt(p || document, o, a);
  };
})();
