function Q(t, e, i) {
  const d = t.getAttribute(e);
  return d === null ? i : d;
}
function It(t, e, i) {
  const d = parseInt(t.getAttribute(e), 10);
  return isNaN(d) ? i : d;
}
function Kt(t, e) {
  return t.hasAttribute(e);
}
function ar(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
function tt(t, e, i) {
  for (const d in i) {
    const [b, m, s] = i[d];
    Object.defineProperty(t, d, {
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
  for (const i in t) {
    const d = t[i];
    !d || !d.prop || (e[d.prop] = [d.read, i, d.fallback]);
  }
  return e;
}
function lr(t) {
  const e = {};
  for (const i in t) {
    const d = t[i];
    d && d.effect && (e[i] = d.effect);
  }
  return Object.keys(e).length ? e : null;
}
function cr(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
function Ce(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const d = t[i];
    if (!(d === "" || d == null) && (e = !0, !Number.isFinite(Number(d))))
      return "string";
  }
  return e ? "number" : "string";
}
function Te(t, e, i, d) {
  if (i === "number") {
    const s = parseFloat(t), a = parseFloat(e);
    return (isNaN(s) ? 0 : s) - (isNaN(a) ? 0 : a);
  }
  const b = t != null ? String(t) : "", m = e != null ? String(e) : "";
  return d ? d.compare(b, m) : b < m ? -1 : b > m ? 1 : 0;
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
  const i = de[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function dr(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function ur(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function q(t, e, i) {
  const d = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: d
  }));
}
function Z(t, e, i) {
  const d = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d);
  const b = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d
  });
  return t.dispatchEvent(b), b;
}
function ln(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const d = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  d[i] = t.name, q(t.dom, e, d);
}
function pt(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < i.length; s++) {
    const a = i[s], c = a.getAttribute("data-ln-field");
    e[c] != null && (a.textContent = e[c]);
  }
  const d = t.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < d.length; s++) {
    const a = d[s], c = a.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const r = c[n].trim().split(":");
      if (r.length !== 2) continue;
      const f = r[0].trim(), u = r[1].trim();
      e[u] != null && a.setAttribute(f, e[u]);
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
      const f = r[0].trim(), u = r[1].trim();
      u in e && a.classList.toggle(f, !!e[u]);
    }
  }
  return t;
}
function hr(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let d = 0; d < i.length; d++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[d], e ?? null), i[d].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
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
    const m = i.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(s, a) {
        return e[a] !== void 0 ? e[a] : "";
      }
    ));
  }
  const d = function(m, s) {
    return e[s] !== void 0 ? e[s] : "";
  }, b = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && b.push(t);
  for (let m = 0; m < b.length; m++) {
    const s = b[m], a = s.attributes;
    for (let c = 0; c < a.length; c++) {
      const n = a[c];
      n.value.indexOf("{{") !== -1 && s.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function fr(t, e, i, d, b, m) {
  const s = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], r = n.getAttribute("data-ln-render-key");
    r && (s[r] = n);
  }
  const a = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], r = String(d(n));
    let f = s[r];
    if (f)
      b(f, n, c);
    else {
      const u = Jt(i, m);
      if (!u || (jt(u, n), f = u.firstElementChild, !f)) continue;
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
function Ct(t, e, i) {
  if (t) {
    const d = t.querySelector('[data-ln-template="' + e + '"]');
    if (d) return d.content.cloneNode(!0);
  }
  return Jt(e, i);
}
function re(t, e) {
  const i = {}, d = t.querySelectorAll("[" + e + "]");
  for (let b = 0; b < d.length; b++)
    i[d[b].getAttribute(e)] = d[b].textContent, d[b].remove();
  return i;
}
function Le(t, e, i, d) {
  if (t.nodeType !== 1) return;
  const m = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", s = Array.from(t.querySelectorAll(m));
  t.matches && t.matches(m) && s.push(t);
  for (const a of s)
    a[i] || (window.lnCore._persistSink && a.hasAttribute("data-ln-persist") && window.lnCore._persistSink(a, e), a[i] = new d(a));
}
function Ht(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function cn(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function pr(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function dn(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function mr(t, e) {
  return !t || !document.contains(t) || dn(t) || e && typeof t[e] != "function" ? !1 : Ht(t);
}
function gr(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function un(t, e) {
  const i = !!(e && e.typed), d = e && e.exclude, b = {}, m = t.elements, s = {};
  if (i)
    for (let a = 0; a < m.length; a++) {
      const c = m[a];
      c.name && c.type === "checkbox" && !c.disabled && (s[c.name] = (s[c.name] || 0) + 1);
    }
  for (let a = 0; a < m.length; a++) {
    const c = m[a];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(d && c.matches && c.matches(d)))
      if (c.type === "checkbox")
        i && s[c.name] === 1 ? b[c.name] = c.checked : (b[c.name] || (b[c.name] = []), c.checked && b[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (b[c.name] = c.value);
      else if (c.type === "select-multiple") {
        b[c.name] = [];
        for (let n = 0; n < c.options.length; n++)
          c.options[n].selected && b[c.name].push(c.options[n].value);
      } else if (i && c.type === "hidden")
        b[c.name] = c.value;
      else if (i && (c.type === "number" || c.type === "range")) {
        const n = Number(c.value);
        b[c.name] = c.value === "" || isNaN(n) ? null : n;
      } else
        b[c.name] = c.value;
  }
  return b;
}
function _r(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function hn(t, e) {
  const i = t.elements, d = [], b = {};
  for (let m = 0; m < i.length; m++) {
    const s = i[m];
    s.name && s.type === "checkbox" && (b[s.name] = (b[s.name] || 0) + 1);
  }
  for (let m = 0; m < i.length; m++) {
    const s = i[m];
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
        s.checked = _r(c);
      d.push(s);
    } else if (s.type === "radio")
      s.checked = s.value === String(c), d.push(s);
    else if (s.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < s.options.length; n++)
          s.options[n].selected = c.indexOf(s.options[n].value) !== -1;
      d.push(s);
    } else
      s.value = c, d.push(s);
  }
  return d;
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
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!i) return "en-US";
  const d = i.trim().toLowerCase();
  return d.indexOf("-") === -1 && Ne[d] ? Ne[d] : i;
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
function fn(t, e, { get: i, set: d }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(b) {
      d ? d.call(this, b, (m) => e.set.call(this, m)) : e.set.call(this, b);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function br() {
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
function pn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function mn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function gn(t) {
  const e = mn(), i = t.observed || [];
  for (let d = 0; d < i.length; d++) {
    const b = i[d];
    e.byAttr.has(b) || e.byAttr.set(b, []), e.byAttr.get(b).push(t);
  }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const d = cr(t);
    if (d === null)
      e.reactiveWildcard.push(t);
    else
      for (const b of d)
        e.byReactive.has(b) || e.byReactive.set(b, []), e.byReactive.get(b).push(t);
  }
  t.persist && e.persist.push(t);
}
function Fe(t, e, i, d) {
  for (let b = 0; b < t.length; b++) {
    const m = t[b];
    if (!e[m.attribute]) continue;
    const s = m.effects && m.effects[i];
    s ? s(e, i, d) : m.onAttrChange && (!m.declared || m.declared.has(i)) && m.onAttrChange(e, i, d);
  }
}
function yr(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const d = mn(), b = d.byAttr.get(i);
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || b) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const m = d.byReactive.get(i);
    m && Fe(m, e, i, t.oldValue), d.reactiveWildcard.length && Fe(d.reactiveWildcard, e, i, t.oldValue);
  }
  if (b)
    for (let m = 0; m < b.length; m++) {
      const s = b[m];
      if (s.handler) {
        s.handler(e, i, t.oldValue);
        continue;
      }
      s.onAttributeChange && e[s.attribute] ? s.onAttributeChange(e, i) : (Le(e, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(e));
    }
}
function _n() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        yr(e[i]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function bn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function vr(t) {
  const e = bn();
  if (e.length) {
    if (t.target)
      for (let i = 0; i < e.length; i++) {
        const d = e[i];
        if (d.onSubtreeChange) {
          const b = d.query, m = t.target.nodeType === 1 ? t.target.matches(b) ? t.target : t.target.closest(b) : t.target.parentElement ? t.target.parentElement.closest(b) : null;
          m && d.onSubtreeChange(m, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const d = t.addedNodes[i];
      if (d.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const m = e[b];
          Le(d, m.selector, m.attribute, m.ComponentFn), m.onInit && m.onInit(d);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const d = t.removedNodes[i];
      if (d.nodeType === 1)
        for (let b = 0; b < e.length; b++) {
          const m = e[b], s = m.query, a = Array.from(d.querySelectorAll(s));
          d.matches && d.matches(s) && a.push(d);
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
function wr() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const d = e[i];
        d.type === "childList" && vr(d);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Vt(t, e) {
  gn({ observed: t, handler: e }), _n();
}
function j(t, e, i, d, b = {}) {
  const m = b.extraAttributes || [], s = b.onAttributeChange || null, a = b.onSubtreeChange || null, c = b.onInit || null, n = b.onAttrChange || null, r = b.effects || null, f = b.attributes || null, u = f ? lr(f) : r, w = f ? new Set(Object.keys(f)) : null, v = b.persist || null;
  function S(o) {
    const p = o || document.body;
    Le(p, t, e, i), c && c(p);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const o = /\[([\w-]+)/g;
    let p;
    for (; (p = o.exec(t)) !== null; )
      A.push(p[1]);
  } else
    A.push(t);
  gn({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: c,
    observed: A.concat(m),
    onAttributeChange: s,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: v
  }), _n();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  bn().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: c,
    onSubtreeChange: a,
    query: _
  }), wr(), window[e] = S;
  function l() {
    pn() > 0 ? mt(function() {
      S(document.body);
    }) : S(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l(), S;
}
function yn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Mt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function vn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const wn = {};
function Er(t, e) {
  wn[t] = e;
}
function Ar(t) {
  return wn[t] || { ingress: (e) => e, egress: (e) => e };
}
const En = {};
function qe(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  En[i] = e;
}
function qt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return En[e] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Er, window.lnCore.getDataMapper = Ar, window.lnCore.registerLocaleFallback = qe, window.lnCore.getLocaleFallback = qt, window.lnCore.fillTemplate = jt, window.lnCore.fill = pt, window.lnCore.lnFill = hr, window.lnCore.renderList = fr, window.lnCore.ensureLocaleObserver = ie);
function oe(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function An(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, b = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, s = typeof t.onChange == "function" ? t.onChange : function() {
  }, a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let r = 0, f = 0, u = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, h = !1;
  function _(y) {
    c.set(y, ++S);
  }
  function l() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function o() {
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
      if (r <= 0) return;
      const g = Math.max(0, y - d), E = Math.min(r, T + d), C = Math.floor(g / i), k = Math.floor(Math.max(0, E - 1) / i);
      let D = -1;
      for (let I = C; I <= k; I++) {
        const R = I * i, O = Math.min(i, r - R);
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
        p(D, i);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== u) return !1;
      const T = y.offset || 0, g = y.data || [];
      let E = 0;
      for (let C = 0; C < g.length; C++)
        g[C] != null && E++;
      if (E === 0 && (y.provisional || y.filtered > 0))
        return n.delete(T), !1;
      h && (a.clear(), c.clear(), h = !1), y.provisional || (f = y.total != null ? y.total : f, r = y.filtered != null ? y.filtered : y.data ? y.data.length : r);
      for (let C = 0; C < g.length; C++)
        g[C] != null && (a.set(T + C, g[C]), _(T + C));
      return n.delete(T), o(), s(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (w = y), p(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(y) {
      u++, n.clear(), clearTimeout(v), y && (w = y), h = !0, p(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(v), h = !0;
      const y = Math.max(0, Math.floor(A / i) * i);
      p(y, i);
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
        e = y.windowSize, g && o(), T = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (i = y.pageSize), y.threshold != null && y.threshold >= 0 && (d = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (b = y.fetchDebounce), T && s();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (f = y, l() || (r = y), s());
    }
  };
}
function Sn(t) {
  return (t || "").replace(/^#/, "");
}
function se(t) {
  const e = t === void 0 ? location.hash : t, i = {}, d = Sn(e);
  if (!d) return i;
  const b = d.split("&");
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (!s) continue;
    const a = s.indexOf(":"), c = a > -1 ? s.slice(0, a) : s, n = a > -1 ? s.slice(a + 1) : "";
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
  const b = Object.keys(i).map(function(m) {
    const s = i[m];
    return s === "" ? m : m + ":" + encodeURIComponent(s);
  }).join("&");
  Sn(location.hash) !== b && (location.hash = b);
}
function ke(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const d = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return d ? e ? d + "-" + e : d : e || null;
}
function Cn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ge(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Tn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function _e(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), d = t.slice(e + 1), b = d ? d.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: i, values: b };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = ke, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = Cn, window.lnCore.hashSortDecode = ge, window.lnCore.hashFilterEncode = Tn, window.lnCore.hashFilterDecode = _e);
function Zt(t, e, i, d) {
  const b = typeof d == "number" ? d : 4, m = window.innerWidth, s = window.innerHeight, a = e.width, c = e.height, n = (i || "bottom").split("-"), r = n[0], f = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[r] || u.bottom;
  function v(l) {
    return l === "top" || l === "bottom" ? f === "start" ? t.left : f === "end" ? t.right - a : t.left + (t.width - a) / 2 : f === "start" ? t.top : f === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(l) {
    let o, p, y = !0;
    return l === "top" ? (o = t.top - b - c, p = v(l), o < 0 && (y = !1)) : l === "bottom" ? (o = t.bottom + b, p = v(l), o + c > s && (y = !1)) : l === "left" ? (o = v(l), p = t.left - b - a, p < 0 && (y = !1)) : (o = v(l), p = t.right + b, p + a > m && (y = !1)), { top: o, left: p, side: l, fits: y };
  }
  let A = null;
  for (let l = 0; l < w.length; l++) {
    const o = S(w[l]);
    if (o.fits) {
      A = o;
      break;
    }
  }
  A || (A = S(w[0]));
  let h = A.top, _ = A.left;
  return a >= m ? _ = 0 : (_ < 0 && (_ = 0), _ + a > m && (_ = m - a)), c >= s ? h = 0 : (h < 0 && (h = 0), h + c > s && (h = s - c)), { top: h, left: _, placement: A.side };
}
function be(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, d = e.display, b = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const m = t.offsetWidth, s = t.offsetHeight;
  return e.visibility = i, e.display = d, e.position = b, { width: m, height: s };
}
let Ut = null;
const Sr = "ln-ashlar:storage-salt:v1", Pe = 32768;
function Be(t) {
  let e = "";
  const i = t.byteLength;
  for (let d = 0; d < i; d += Pe)
    e += String.fromCharCode.apply(
      null,
      t.subarray(d, Math.min(d + Pe, i))
    );
  return btoa(e);
}
function He(t) {
  const e = atob(t), i = e.length, d = new Uint8Array(i);
  for (let b = 0; b < i; b++)
    d[b] = e.charCodeAt(b);
  return d;
}
function Ln(t, e) {
  let i = Ut, d = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (d = t, typeof CryptoKey < "u" && d.key instanceof CryptoKey && (i = d.key)), { key: i, options: d };
}
async function Cr(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", d = new TextEncoder();
  if (i === "sha256") {
    const c = await crypto.subtle.digest("SHA-256", d.encode(t));
    return crypto.subtle.importKey(
      "raw",
      c,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const b = e.salt || Sr, m = typeof b == "string" ? d.encode(b) : b, s = e.iterations || 1e5, a = await crypto.subtle.importKey(
    "raw",
    d.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: m,
      iterations: s,
      hash: "SHA-256"
    },
    a,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function Ue(t, e = {}) {
  if (!t) {
    Ut = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Ut = await Cr(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Ut = null, i;
  }
}
function At() {
  return Ut;
}
async function Tr(t, e, i) {
  const { key: d } = Ln(e);
  if (t == null)
    return t;
  if (!d)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const b = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), s = typeof t == "string" ? t : JSON.stringify(t), a = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      d,
      b.encode(s)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Be(m),
      data: Be(new Uint8Array(a))
    };
  } catch (b) {
    throw console.error("[ln-core/crypto] Encryption failed:", b), new Error("[ln-crypto] Encryption failed: " + (b && b.message ? b.message : String(b)));
  }
}
async function Lr(t, e, i) {
  const { key: d, options: b } = Ln(e), m = b.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!d) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const s = new TextDecoder(), a = He(t.iv), c = He(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: a },
      d,
      c
    ), r = s.decode(n);
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  } catch (s) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", s), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (s && s.message ? s.message : String(s)));
  }
}
function qn(t, e = 100, i = 0) {
  const d = parseFloat(String(t)) || 0, b = parseFloat(String(e)) || 100, m = parseFloat(String(i)) || 0, s = Math.max(m, Math.min(d, b)), a = b - m;
  let c = 0;
  return a > 0 && (c = (s - m) / a * 100), c = Math.max(0, Math.min(100, c)), {
    value: d,
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
    const i = e < 1e11 ? e * 1e3 : e, d = new Date(i);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const d = new Date(i);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function Nt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), d = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + d;
}
const yt = {};
function te(t) {
  const e = t || "default";
  if (!yt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), d = i.formatToParts(1234.5);
    let b = "", m = ".";
    for (let s = 0; s < d.length; s++)
      d[s].type === "group" && (b = d[s].value), d[s].type === "decimal" && (m = d[s].value);
    yt[e] = { groupSep: b, decimalSep: m, fmt: i };
  }
  return yt[e];
}
function kn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), i && i !== "." && (d = d.replace(i, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function qr(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const d = te(e), b = kn(i, d.groupSep, d.decimalSep);
  if (b === "" || b === "-") return NaN;
  const m = parseFloat(b);
  return isNaN(m) ? NaN : m;
}
function ct(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", b = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, m = i.userDecimals != null ? i.userDecimals : null;
  if (b !== null) {
    const s = d + "|max:" + b;
    return yt[s] || (yt[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: b
    })), yt[s].format(t);
  }
  if (m !== null && m > 0) {
    const s = d + "|exact:" + m;
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
function xn(t) {
  const e = ye(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function kr(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function In(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (i.indexOf(e[d]) === -1) return !1;
  return !0;
}
function xr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function xe(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (String(e[d]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function Ir(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Dr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Rr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function Or(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function d(s, a) {
    a = a || {};
    const c = Ir(s), n = Dr(s, a), r = Rr(c, n);
    Or(n) && e.has(r) && (e.get(r).abort(), e.delete(r));
    const f = new AbortController(), u = a.signal;
    let w = null;
    u && (u.aborted ? f.abort(u.reason) : (w = function() {
      f.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, a, { signal: f.signal });
    return e.set(r, f), t(s, v).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(r) === f && e.delete(r);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function b(s) {
    if (!s.detail || !s.detail.url) return;
    const a = s.target, c = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), n = s.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const r = new AbortController(), f = s.detail.signal;
    let u = null;
    f && (f.aborted ? r.abort(f.reason) : (u = function() {
      r.abort(f.reason);
    }, f.addEventListener("abort", u, { once: !0 }))), n && i.set(n, r);
    const w = { method: c, signal: r.signal };
    s.detail.body !== void 0 && (w.body = s.detail.body), window.fetch(s.detail.url, w).then(function(v) {
      f && u && f.removeEventListener("abort", u), n && i.get(n) === r && i.delete(n), q(a, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      f && u && f.removeEventListener("abort", u), n && i.get(n) === r && i.delete(n), !(v && v.name === "AbortError") && q(a, "ln-http:error", {
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
      return i.has(s) ? (i.get(s).abort(), i.delete(s), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(s) {
        s.abort();
      }), e.clear(), i.forEach(function(s) {
        s.abort();
      }), i.clear();
    },
    get inflight() {
      const s = [];
      return e.forEach(function(a, c) {
        const n = c.indexOf(" ");
        s.push({ method: c.slice(0, n), url: c.slice(n + 1) });
      }), i.forEach(function(a, c) {
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
  const i = {
    "data-ln-include": { prop: "url", read: Q, fallback: "" }
  }, d = et(i), b = /* @__PURE__ */ new Map();
  function m(s) {
    if (this.dom = s, tt(this, s, d), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    br(), this._held = !0;
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
    attributes: i
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-form": {},
    "data-ln-form-action-edit": { prop: "_actionEdit", read: Q, fallback: "" },
    "data-ln-form-action-method": { prop: "_actionMethod", read: Q, fallback: "PUT" }
  }, d = et(i);
  function b(m) {
    this.dom = m, tt(this, m, d), this._baseAction = m.getAttribute("action") || "";
    const s = this;
    return this._onLnFill = function(a) {
      a.target === s.dom && (a.detail ? (s.fill(a.detail), s._applyActionMode(a.detail)) : s.dom.reset());
    }, this._onReset = function() {
      s._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(m) {
    const s = hn(this.dom, m);
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
    attributes: i
  });
})();
const ze = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Ke(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function Mr(t, e) {
  const i = [];
  if (t) {
    const d = Object.keys(ze);
    for (let b = 0; b < d.length; b++) {
      const m = d[b], s = ze[m];
      t[s] && i.push(m);
    }
  }
  if (e) {
    const d = Array.from(e);
    for (let b = 0; b < d.length; b++)
      d[b] && i.indexOf(d[b]) === -1 && i.push(d[b]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", d = "data-ln-validate-error", b = "ln-validate-valid", m = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-validate": {},
    "data-ln-validate-errors": {},
    "data-ln-validate-error": {}
  };
  function a(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, r = c.tagName, f = c.type, u = r === "SELECT" || f === "checkbox" || f === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(S) {
      const A = S.detail && S.detail.error;
      if (!A) return;
      n._customErrors.add(A), n._touched = !0;
      const h = c.closest(".form-element");
      if (h) {
        const _ = h.querySelector("[" + d + '="' + A + '"]');
        _ && _.classList.remove("hidden");
      }
      c.classList.remove(b), c.classList.add(m), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, h = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), h) {
          const _ = h.querySelector("[" + d + '="' + A + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(_) {
          if (h) {
            const l = h.querySelector("[" + d + '="' + _ + '"]');
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
      q(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (S.preventDefault(), A.invalidFields.sort((h, _) => h.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (c.value && c.value.trim() !== "" || c.checked) && (this._touched = !0, this.validate()), this;
  }
  a.prototype.validate = function() {
    const c = this.dom, n = c.validity, r = Ke(n, this._customErrors.size), f = Mr(n, this._customErrors), u = c.closest(".form-element");
    if (u) {
      const v = u.querySelector("[" + i + "]");
      if (v) {
        const S = v.querySelectorAll("[" + d + "]");
        for (let A = 0; A < S.length; A++) {
          const h = S[A].getAttribute(d);
          S[A].classList.toggle("hidden", !f.includes(h));
        }
      }
    }
    return c.classList.toggle(b, r), c.classList.toggle(m, !r), c.setAttribute("aria-invalid", r ? "false" : "true"), q(c, r ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: f }), r;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + d + "]");
      for (let r = 0; r < n.length; r++)
        n[r].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return Ke(this.dom.validity, this._customErrors.size);
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
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function d(f) {
    if (!f.hasAttribute(t) || f[e]) return;
    f[e] = !0;
    const u = c(f);
    b(u.links), m(u.forms);
  }
  function b(f) {
    for (const u of f) {
      if (u[e + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const w = u.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!yn(S, u)) return;
        S.preventDefault();
        const A = u.getAttribute("href");
        A && a("GET", A, null, u);
      };
      u.addEventListener("click", v), u[e + "Trigger"] = v;
    }
  }
  function m(f) {
    for (const u of f) {
      if (u[e + "Trigger"]) continue;
      if (u.hasAttribute(i)) {
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
  function s(f) {
    if (!f[e]) return;
    const u = c(f);
    for (const w of u.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of u.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete f[e];
  }
  function a(f, u, w, v, S) {
    if (Z(v, "ln-ajax:before-start", { method: f, url: u }).defaultPrevented) return;
    q(v, "ln-ajax:start", { method: f, url: u }), v.classList.add("ln-ajax--loading");
    const h = document.createElement("span");
    h.className = "ln-ajax-spinner", v.appendChild(h);
    function _() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), S && S();
    }
    let l = u;
    const o = document.querySelector('meta[name="csrf-token"]'), p = o ? o.getAttribute("content") : null;
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
      l = u + (u.includes("?") ? "&" : "?") + T.toString();
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
    const u = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(t) !== "false" ? u.links.push(f) : f.tagName === "FORM" && f.getAttribute(t) !== "false" ? u.forms.push(f) : (u.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), u.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), u;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(u) {
        for (const w of u)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (d(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  d(A);
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
      }), Vt([t], function(u) {
        d(u);
      });
    }, "ln-ajax");
  }
  function r() {
    for (const f of document.querySelectorAll("[" + t + "]"))
      d(f);
  }
  window[e] = d, window[e].destroy = s, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
function Nr(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: d = null } = {}) {
  const b = i ? !d : !t.some((n) => n.match), m = [], s = [];
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
const Dn = {
  navigate: function(t) {
    zt(t, { historyAction: "push" });
  },
  replace: function(t) {
    zt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: Mn,
      query: Nn,
      route: Fn,
      regions: On
    };
  }
}, Ie = "data-ln-route", Rn = "lnRoute";
typeof window < "u" && (window.lnRouter = Dn);
function he(t) {
  zn(t), Un(t), _t.size > 0 && Hn();
}
const Fr = {
  "data-ln-route": { effect: he },
  "data-ln-route-target": { effect: he },
  "data-ln-route-title": { effect: he },
  "data-ln-route-keep": {},
  "data-ln-router-hydrate": {}
}, _t = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new WeakMap();
let On = /* @__PURE__ */ new Map(), je = !1, ee = null, Mn = {}, Nn = {}, Fn = null, ve = !1;
function Ve(t, e, i) {
  ve ? queueMicrotask(function() {
    q(t, e, i);
  }) : q(t, e, i);
}
function ne(t) {
  try {
    const m = new URL(t, window.location.origin);
    t = m.pathname + m.search + m.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, d] = e.split("?");
  const b = {};
  if (d) {
    const m = new URLSearchParams(d);
    for (const [s, a] of m.entries())
      b[s] = a;
  }
  return i = i.replace(/\/+$/, ""), i === "" && (i = "/"), { path: i, query: b };
}
function Pn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, d = e.segments, b = Math.max(i.length, d.length);
  for (let m = 0; m < b; m++) {
    const s = i[m], a = d[m];
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
function Bn(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const b = d.segments, m = {};
    let s = !0;
    if (!(i.length > b.length && b[b.length - 1] !== "*")) {
      for (let a = 0; a < b.length; a++) {
        const c = b[a], n = i[a];
        if (c === "*") {
          m.wildcard = i.slice(a).join("/");
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
      if (s && (b.indexOf("*") !== -1 || i.length <= b.length))
        return { route: d, params: m };
    }
  }
  return null;
}
function we(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const b = document.getElementById(t);
    return !b && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), b;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !d && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function We(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const b of i)
    for (const m of Object.keys(b))
      if (m.startsWith("ln") && b[m] && typeof b[m].destroy == "function")
        try {
          b[m].destroy();
        } catch (s) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, b, s);
        }
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of d) {
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
  const { path: i, query: d } = ne(t), b = /* @__PURE__ */ new Map();
  for (const [u, w] of _t)
    b.set(u, Bn(i, w.sorted));
  const m = b.get("__primary__") || null, s = we("__primary__", { warn: !!m }), a = _t.has("__primary__"), c = [];
  for (const [u, w] of b) {
    const v = u === "__primary__" ? s : we(u, { warn: !1 }), S = !v && !!(m && m.route && m.route.templateNode && m.route.templateNode.content && m.route.templateNode.content.querySelector("#" + CSS.escape(u)));
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
  const n = Nr(c, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: a,
    primaryMatch: m
  });
  if (n.notFound) {
    Ve(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Z(s || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: m ? m.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const f = function() {
    for (const u of n.clears)
      We(u.targetEl), u.targetEl.replaceChildren(), fe.delete(u.targetEl);
    for (const u of n.swaps) {
      if ((u.isPending || !u.targetEl || !document.contains(u.targetEl)) && (u.targetEl = u.regionKey === "__primary__" ? s : document.getElementById(u.regionKey)), !u.targetEl) {
        console.warn(`[ln-router] Target element #${u.regionKey} could not be resolved`);
        continue;
      }
      if (u.skipMount || (We(u.targetEl), u.targetEl.replaceChildren(u.match.route.templateNode.content.cloneNode(!0))), fe.set(u.targetEl, u.match.route.templateNode), n.owner && u.regionKey === n.owner.regionKey) {
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
      Ve(u.targetEl, "ln-router:navigated", {
        path: t,
        params: u.match.params,
        query: d,
        route: u.match.route,
        target: u.targetEl,
        region: u.regionKey
      });
    }
    ee = t, Nn = d, Fn = m ? m.route : null, Mn = m ? m.params : {}, On = new Map(
      Array.from(b.entries()).map(([u, w]) => [u, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(f) : f();
}
function Pr(t) {
  const e = t.target.closest("a");
  if (!e || !yn(t, e)) return;
  const i = e.getAttribute("href"), { path: d } = ne(i);
  for (const b of _t.values())
    if (Bn(d, b.sorted)) {
      t.preventDefault(), zt(i, { historyAction: "push" });
      return;
    }
}
function Br(t, e) {
  const i = Object.keys(t), d = Object.keys(e);
  if (i.length !== d.length) return !1;
  for (let b = 0; b < i.length; b++) {
    const m = i[b];
    if (t[m] !== e[m]) return !1;
  }
  return !0;
}
function Hr() {
  const t = window.location.pathname + window.location.search, e = Dn.current();
  if (e && e.path != null) {
    const i = ne(t);
    if (ne(e.path).path === i.path && Br(e.query, i.query))
      return;
  }
  zt(t, { historyAction: "skip" });
}
function Hn() {
  je || (je = !0, gt(function() {
    document.addEventListener("click", Pr), window.addEventListener("popstate", Hr), ve = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    zt(t, { historyAction: "replace", isHydration: !0 }), ve = !1;
  }, "ln-router"));
}
function Un(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const d = i || "__primary__";
  _t.has(d) || _t.set(d, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const b = _t.get(d);
  if (b.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${d}"`);
    return;
  }
  const m = t.getAttribute("data-ln-route-title"), s = e.split("/").filter(Boolean), a = {
    pattern: e,
    segments: s,
    target: i,
    title: m,
    templateNode: t
  }, c = we(d);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), b.routes.set(e, a), b.sorted = Array.from(b.routes.values()).sort(Pn);
}
function zn(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", b = _t.get(d);
  b && (b.routes.delete(e), b.sorted = Array.from(b.routes.values()).sort(Pn), b.routes.size === 0 && _t.delete(d));
}
function Kn(t) {
  return this.dom = t, Un(t), this;
}
Kn.prototype.destroy = function() {
  zn(this.dom), delete this.dom[Rn];
};
j(Ie, Rn, Kn, "ln-router", {
  attributes: Fr,
  onInit: function() {
    _t.size > 0 && Hn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-modal": { effect: b }
  };
  function d(m) {
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
  d.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, d.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, d.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, m === "open" ? "close" : "open");
  }, d.prototype.destroy = function() {
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
        if (r && Ht(r))
          r.focus();
        else {
          const f = m.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(f, Ht);
          if (u) u.focus();
          else {
            const w = m.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, Ht);
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
  j(t, e, d, "ln-modal", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", i = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-ui-coordinator": {},
    "data-ln-ui-coordinator-dict": {}
  };
  function b(h) {
    const _ = {};
    let l = h;
    const o = [];
    for (; l; ) {
      const p = l.closest("[" + t + "]");
      if (!p) break;
      p[e] && p[e].dict && o.unshift(p[e].dict), l = p.parentElement;
    }
    for (const p of o)
      Object.assign(_, p);
    return _;
  }
  function m(h, _) {
    if (_) {
      if (h) {
        const o = h.closest("[" + t + "]");
        if (o) {
          if (o.id === _ && o.hasAttribute("data-ln-modal")) return o;
          const p = o.querySelector("#" + CSS.escape(_) + '[data-ln-modal], [data-ln-modal="' + _ + '"]');
          if (p) return p;
        }
      }
      const l = document.getElementById(_) || document.querySelector('[data-ln-modal="' + _ + '"]');
      if (l) return l;
    }
    if (h) {
      const l = h.closest("[" + t + "]");
      if (l) {
        if (l.hasAttribute("data-ln-modal")) return l;
        const p = l.querySelector("[data-ln-modal]");
        if (p) return p;
      }
      const o = h.closest("[data-ln-modal]");
      if (o) return o;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function s(h, _) {
    if (h !== "edit") return "";
    if (_) {
      const l = _.getAttribute("data-ln-fill-id");
      if (l) return l;
    }
    return "edit";
  }
  function a(h) {
    if (!h) return;
    const _ = h.querySelectorAll("[data-ln-field]");
    for (let o = 0; o < _.length; o++)
      _[o].textContent = "";
    const l = h.querySelectorAll("form");
    for (let o = 0; o < l.length; o++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(l[o], null) : l[o].reset();
  }
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const _ = h.target.closest("[data-ln-modal-for]");
    if (_) {
      const o = _.getAttribute("data-ln-modal-for"), p = m(_, o);
      if (p && p.lnModal) {
        h.preventDefault();
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
    const l = h.target.closest('a[href^="#"]');
    if (l) {
      const o = se(l.getAttribute("href"));
      for (const p in o) {
        const y = document.getElementById(p);
        if (y && y.lnModal) {
          if (!ke(h)) return;
          dt(p, o[p]);
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
    let l = ot(_.id);
    l === null && (l = s(_.dataset.lnModalMode, null), dt(_.id, l)), l ? (_.dataset.lnModalMode = "edit", q(_, "ln-fill:request", { id: l })) : (_.dataset.lnModalMode = "new", a(_));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const h = document.querySelectorAll("[data-ln-modal][id]");
        for (let _ = 0; _ < h.length; _++) {
          const l = h[_];
          if (!l.lnModal) continue;
          const o = l.id, p = ot(o), y = p !== null, T = l.lnModal.isOpen;
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
    const h = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let _ = 0; _ < h.length; _++) {
      const l = h[_];
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
  function u(h) {
    const l = (h.detail || {}).data;
    if (l && l.message) {
      const p = l.message;
      q(window, "ln-toast:enqueue", {
        type: p.type || "success",
        title: p.title || "",
        message: p.body || ""
      });
    }
    const o = h.target.closest("[data-ln-modal]");
    o && o.lnModal && (o.id && dt(o.id, null), q(o, "ln-modal:request-close", {}), a(o));
  }
  function w(h) {
    const _ = h.detail || {}, l = _.data, o = _.status || 0, p = b(h.target);
    if (l && l.message) {
      const y = l.message;
      q(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else o === 0 ? q(window, "ln-toast:enqueue", {
      type: "error",
      title: p["network-error-title"] || "",
      message: p["network-error"] || "Network error"
    }) : q(window, "ln-toast:enqueue", {
      type: "error",
      title: p["server-error-title"] || "",
      message: p["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", u), document.addEventListener("ln-ajax:error", w);
  function v(h) {
    const _ = h.detail || {}, l = b(h.target), o = _.message || (_.reason === "max-size" ? l["upload-max-size"] || "File is too large" : _.reason === "max-files" ? l["upload-max-files"] || "Maximum file count exceeded" : l["upload-invalid-type"] || "This file type is not allowed"), p = l["upload-invalid-title"] || "Invalid File";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: p,
      message: o
    });
  }
  function S(h) {
    const _ = h.detail || {}, l = b(h.target), o = _.message || l["upload-failed"] || "Failed to upload file", p = l["upload-error-title"] || "Upload Error";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: p,
      message: o
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(h) {
    const _ = h.target;
    !_ || !_.lnModal || (_.id && ot(_.id) !== null && dt(_.id, null), _.dataset.lnModalMode === "new" && a(_));
  });
  function A(h) {
    return this.dom = h, this.dict = re(h, i), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: d
  });
})();
function Ur(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, d = 0;
  for (let b = 0; b < t.length && i > 0; b++)
    d = b + 1, /[0-9]/.test(t[b]) && i--;
  return i > 0 && (d = t.length), d;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(s) {
    const a = s[e];
    a && (a.isTextElement ? a._initTextElement() : isNaN(a.value) || a._displayFormatted(a.value));
  }
  const d = {
    "data-ln-number": { effect: i },
    "data-ln-value": { effect: i },
    "data-ln-number-decimals": { effect: i },
    "data-ln-number-min": { effect: i },
    "data-ln-number-max": { effect: i }
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
    }), fn(s, b, {
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
          const u = s.getAttribute("data-ln-number-decimals");
          a._setDisplayRaw(ct(f, rt(s), { maxDecimals: u }));
        }
        s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      a._handleInput();
    }, s.addEventListener("input", this._onInput), this._onKeyDown = function(r) {
      if (r.key !== "Backspace") return;
      const f = s.selectionStart, u = s.selectionEnd;
      if (f !== u || f === 0) return;
      const w = te(rt(s)), v = b.get.call(s), S = v[f - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        r.preventDefault();
        const A = f - 2 >= 0 ? f - 2 : 0, h = v.slice(0, A) + v.slice(f);
        b.set.call(s, h), s.setSelectionRange(A, A), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, s.addEventListener("keydown", this._onKeyDown), this._onPaste = function(r) {
      r.preventDefault();
      const f = (r.clipboardData || window.clipboardData).getData("text"), u = qr(f, rt(s));
      a.value = isNaN(u) ? NaN : u;
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
    let u = a, w = kn(a, f.groupSep, f.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), q(s, "ln-number:input", { value: NaN, formatted: a });
      return;
    }
    const S = s.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const p = parseInt(S, 10), y = w.slice(A + 1);
      if (p === 0)
        w = w.slice(0, A), u = u.split(f.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(u);
      else if (y.length > p) {
        w = w.slice(0, A + 1 + p);
        const T = u.split(f.decimalSep);
        u = T[0] + f.decimalSep + T[1].slice(0, p), v = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const h = s.getAttribute("data-ln-number-max");
    if (h !== null && v > parseFloat(h)) {
      const p = parseFloat(h), y = ct(p, r, { maxDecimals: S });
      this._setDisplayRaw(y), this._setHiddenRaw(p), s.setSelectionRange(y.length, y.length), q(s, "ln-number:input", { value: p, formatted: y });
      return;
    }
    if (u.endsWith(f.decimalSep) || f.decimalSep !== "." && u.endsWith(".")) {
      this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: u });
      return;
    }
    const _ = w.indexOf(".");
    if (_ !== -1 && w.slice(_ + 1).endsWith("0")) {
      this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: u });
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
    const o = Ur(l, n);
    s.setSelectionRange(o, o), this._setHiddenRaw(v), q(s, "ln-number:input", { value: v, formatted: l });
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
    attributes: d,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Ee = /^(short|medium|long)(\s+datetime)?$/, zr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Kr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ee) ? zr[t.trim()] : null;
}
function Wt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, d;
  if (e.indexOf(".") !== -1)
    i = ".", d = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", d = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", d = e.split("-");
  else
    return null;
  if (d.length !== 3) return null;
  const b = [];
  for (let n = 0; n < 3; n++) {
    const r = parseInt(d[n], 10);
    if (isNaN(r)) return null;
    b.push(r);
  }
  let m, s, a;
  i === "." ? (m = b[0], s = b[1], a = b[2]) : i === "/" ? (s = b[0], m = b[1], a = b[2]) : d[0].length === 4 ? (a = b[0], s = b[1], m = b[2]) : (m = b[0], s = b[1], a = b[2]), a < 100 && (a += a < 50 ? 2e3 : 1900);
  const c = new Date(a, s - 1, m);
  return c.getFullYear() !== a || c.getMonth() !== s - 1 || c.getDate() !== m ? null : c;
}
function pe(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const b = t.getDate(), m = t.getMonth(), s = t.getFullYear(), a = t.getHours(), c = t.getMinutes();
  let n, r;
  const f = (i || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const S = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(d && S !== f);
  } catch {
    u = !!d;
  }
  if (u && d && d.monthsLong)
    n = d.monthsLong[m];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(m + 1);
    }
  if (u && d && d.monthsShort)
    r = d.monthsShort[m];
  else
    try {
      r = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
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
function Gt(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const b = Kr(e);
  if (b)
    try {
      const m = new Intl.DateTimeFormat(i, b), s = (i || "").toLowerCase().split("-")[0], a = m.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && a !== s ? pe(t, "dd.MM.yyyy", i, d) : m.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", i, d);
    }
  return pe(t, e || "dd.MM.yyyy", i, d);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(n) {
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
  const d = {
    "data-ln-date": { effect: i },
    "data-ln-date-format": { effect: i },
    "data-ln-date-locale": { effect: i },
    "data-ln-value": { effect: i },
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
  function s(n, r, f, u) {
    n._setHiddenRaw(r), b.set.call(n._picker, r), n._lastISO = r, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : f && n._displayFormatted(f), m(n, r, f);
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
    const f = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const _ = w.querySelectorAll("[data-ln-date-dict]");
      for (let l = 0; l < _.length; l++) {
        const o = _[l].getAttribute("data-ln-date-dict");
        if (o) {
          const p = re(_[l], "data-ln-date-dict-key");
          p["months-long"] && (p.monthsLong = p["months-long"].split(",").map((y) => y.trim())), p["months-short"] && (p.monthsShort = p["months-short"].split(",").map((y) => y.trim())), qe(o, p);
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
        return b.get.call(S);
      },
      set: function(_) {
        if (b.set.call(S, _), _ && _ !== "") {
          const l = st(_);
          l && s(r, _, l);
        } else _ === "" && a(r);
      }
    }), fn(n, b, {
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
        const o = st(_) || Wt(_);
        if (o) {
          const p = Nt(o), y = n.getAttribute(t) || "", T = rt(n), g = qt(T), E = Gt(o, y, T, g);
          l(E), s(r, p, o, E);
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
        const o = st(r._lastISO);
        if (o) {
          const p = r.dom.getAttribute(t) || "", y = rt(r.dom), T = qt(y);
          if (_ === Gt(o, p, y, T)) return;
        }
      }
      const l = Wt(_);
      if (l) {
        const o = Nt(l);
        s(r, o, l);
      } else if (r._lastISO) {
        const o = st(r._lastISO);
        o && r._displayFormatted(o);
      } else
        r.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      r._openPicker();
    }, h.addEventListener("click", this._onBtnClick), f && f !== "") {
      const _ = st(f);
      _ && s(r, f, _);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, r = n.getAttribute("data-ln-value"), f = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    r !== null && r !== "" ? w = r : u !== null && u !== "" ? w = u : f !== null && f !== "" && f !== "true" && !Ee.test(f) ? w = f : w = n.textContent.trim();
    const v = st(w) || Wt(w);
    if (v && !isNaN(v.getTime())) {
      const S = Nt(v);
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
        const u = rt(this.dom), w = qt(u);
        this.dom.textContent = Gt(n, f || "medium", u, w);
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
    const r = this.dom.getAttribute(t) || "", f = rt(this.dom), u = qt(f);
    this._isFormatting = !0, this.dom.value = Gt(n, r, f, u), this._isFormatting = !1;
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
        const u = Nt(f);
        this._rawValue = u, this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
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
      this.value = Nt(n);
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
    attributes: d,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: s },
    "data-ln-nav-exact": { prop: "exact", read: Kt, effect: s }
  }, d = et(i);
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
    return this.dom = a, tt(this, a, d), this.activeClass = a.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(a, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, r = m(n), f = [];
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
      const v = m(w), S = v === r, A = !this.exact && v !== "/" && r.startsWith(v + "/");
      S || A ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), f.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
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
          const u = a.querySelectorAll("a");
          for (const w of u)
            r && w.classList.remove(r);
          n.activeClass = f;
        }
      }
      n.update();
    }
  }
  j(t, e, b, "ln-nav", {
    attributes: i
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
  let i = null;
  function d() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const s = "__ln_persist_test__";
      return localStorage.setItem(s, s), localStorage.removeItem(s), i = !0;
    } catch {
      return i = !1;
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
      if (!A || !d()) return;
      const h = v.getAttribute(S);
      try {
        h === null ? localStorage.removeItem(A) : localStorage.setItem(A, h);
      } catch {
      }
    })), f.hashActive && f.hashActive(s)) return;
    const u = e(s, f.attr);
    if (!u || !d()) return;
    const w = localStorage.getItem(u);
    w !== null && s.setAttribute(f.attr, w);
  }
  ur(m);
})();
function Ge(t, e, i, d) {
  const b = (t || "").toLowerCase().trim();
  if (b) return b;
  if ((e || "").toUpperCase() !== "A") return "";
  const m = i || "";
  if (!m.startsWith("#")) return "";
  const s = m.slice(1);
  if (!s) return "";
  const a = s.split("&"), c = (d || "").toLowerCase().trim();
  if (c)
    for (const f of a) {
      const u = f.indexOf(":");
      if (u > 0 && f.slice(0, u).toLowerCase().trim() === c)
        return f.slice(u + 1).toLowerCase().trim();
    }
  const n = a[a.length - 1] || "", r = n.indexOf(":");
  return (r > 0 ? n.slice(r + 1) : n).toLowerCase().trim();
}
function Qe(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (m) => (m.tagName || "").toUpperCase() === "A" && (m.href || "").startsWith("#")
  ), d = i.length > 0 && i.length === t.length, b = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : d && !b ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: d && !!b,
    warning: null
  };
}
function $e(t, e, i) {
  const d = (t || "").toLowerCase().trim();
  return d && Array.isArray(e) && e.includes(d) ? d : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(n) {
    const r = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(r);
  }
  function d(n, r) {
    return (n.getAttribute(r) || n.id || "").toLowerCase().trim();
  }
  function b(n, r) {
    return (n.getAttribute(r) || "true").toLowerCase() !== "false";
  }
  const m = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: i },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": { prop: "autoFocus", read: b },
    "data-ln-tabs-key": { prop: "nsKey", read: d },
    "data-ln-tab": {}
  }, s = et(m);
  function a(n) {
    return this.dom = n, tt(this, n, s), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.map((u) => ({
      tagName: u.tagName,
      href: u.getAttribute("href")
    })), r = Qe(n, this.nsKey);
    this.hashEnabled = r.hashEnabled, r.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : r.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const w = Ge(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
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
        const A = Ge(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), f.nsKey);
        A && (S && !ke(v) || (f.hashEnabled ? ot(f.nsKey) === A ? f.dom.setAttribute("data-ln-tabs-active", A) : dt(f.nsKey, A) : f.dom.setAttribute("data-ln-tabs-active", A)));
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
      const u = $e(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  a.prototype.select = function(n) {
    const r = (n + "").toLowerCase().trim();
    r && (this.hashEnabled ? ot(this.nsKey) === r ? this.dom.setAttribute("data-ln-tabs-active", r) : dt(this.nsKey, r) : this.dom.setAttribute("data-ln-tabs-active", r));
  }, a.prototype._applyActive = function(n) {
    var f;
    if (n = $e(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
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
        const r = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(u) {
          return { tagName: u.tagName, href: u.getAttribute("href") };
        }), f = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return Qe(r, f).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", d = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-toggle": { effect: u },
    "data-ln-toggle-for": {},
    "data-ln-toggle-action": {}
  }, m = /* @__PURE__ */ new Set();
  let s = null;
  function a(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function c() {
    s || (s = function(w) {
      if (cn(w)) return;
      const v = w.target.closest("[" + i + "]");
      if (!v || dn(v)) return;
      const S = v.getAttribute(i);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const h = v.getAttribute(d) || "toggle", _ = A.getAttribute(t);
      A.setAttribute(t, a(_, h));
    }, document.addEventListener("click", s));
  }
  function n() {
    m.size > 0 || !s || (document.removeEventListener("click", s), s = null);
  }
  function r(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + i + '="' + w.id + '"]'
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
  const i = {
    "data-ln-accordion": {}
  };
  function d(b) {
    return this.dom = b, this._onToggleOpen = function(m) {
      if (m.detail.target.closest("[data-ln-accordion]") !== b) return;
      const s = b.querySelectorAll("[data-ln-toggle]");
      for (const a of s)
        a !== m.detail.target && a.closest("[data-ln-accordion]") === b && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      q(b, "ln-accordion:change", { target: m.detail.target });
    }, b.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), q(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, d, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-dropdown": {},
    "data-ln-dropdown-position": { prop: "position", read: Q, fallback: i },
    "data-ln-dropdown-placement": {},
    "data-ln-dropdown-menu": {}
  }, b = et(d);
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
          const u = a._getMenuItems();
          u.length > 0 && a._focusItem(u, c.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const f = r.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const u = f < r.length - 1 ? f + 1 : 0;
        a._focusItem(r, u);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const u = f > 0 ? f - 1 : r.length - 1;
        a._focusItem(r, u);
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
    const s = this.triggerBtn.getBoundingClientRect(), a = be(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, r = Zt(s, a, n, c);
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
    attributes: d
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", d = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-popover": { effect: f },
    "data-ln-popover-for": {},
    "data-ln-popover-position": {},
    "data-ln-popover-placement": {}
  }, m = [];
  let s = null;
  function a() {
    s || (s = function(u) {
      if (u.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", s));
  }
  function c() {
    m.length > 0 || s && (document.removeEventListener("keydown", s), s = null);
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
      const h = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(d) || "bottom", l = Zt(h, w, _, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), S = Array.prototype.find.call(v, Ht);
    S ? S.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(h) {
      A.dom.contains(h.target) || A.trigger && A.trigger.contains(h.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const h = A.trigger.getBoundingClientRect(), _ = be(A.dom), l = A.dom.getAttribute(d) || "bottom", o = Zt(h, _, l, 8);
      A.dom.style.top = o.top + "px", A.dom.style.left = o.left + "px", A.dom.setAttribute("data-ln-popover-placement", o.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), a(), q(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = m.indexOf(this);
    u !== -1 && m.splice(u, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, q(this.dom, "ln-popover:close", {
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
  function r(u) {
    this.dom = u;
    const w = u.getAttribute(i);
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
  r.prototype.destroy = function() {
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
    attributes: b
  }), j(i, e + "Trigger", r);
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", d = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  const m = {
    "data-ln-tooltip-enhance": {},
    "data-ln-tooltip-enhanced": {},
    "data-ln-tooltip": {},
    "data-ln-tooltip-position": {},
    "data-ln-tooltip-placement": {}
  };
  let s = 0, a = null, c = null, n = null, r = null, f = null, u = null;
  function w() {
    return a && a.parentNode || (a = document.getElementById(b), a || (a = document.createElement("div"), a.id = b, document.body.appendChild(a)), a.hasAttribute("popover") || a.setAttribute("popover", "manual")), a;
  }
  function v() {
    u || (u = function(l) {
      l.key === "Escape" && h();
    }, document.addEventListener("keydown", u));
  }
  function S() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function A(l) {
    if (n === l) return;
    h();
    const o = l.getAttribute(e) || l.getAttribute("title");
    if (!o) return;
    w(), typeof a.showPopover == "function" && a.showPopover(), l.hasAttribute("title") && (r = l.getAttribute("title"), l.removeAttribute("title"));
    const p = l.getAttribute("aria-describedby");
    p ? f = p : f = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = o, l[d + "Uid"] || (s += 1, l[d + "Uid"] = "ln-tooltip-" + s), y.id = l[d + "Uid"], a.appendChild(y);
    const T = y.offsetWidth, g = y.offsetHeight, E = l.getBoundingClientRect(), C = l.getAttribute(i) || "top", k = Zt(E, { width: T, height: g }, C, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), f ? l.setAttribute("aria-describedby", f + " " + y.id) : l.setAttribute("aria-describedby", y.id), c = y, n = l, v();
  }
  function h() {
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
      n === l && !l.contains(document.activeElement) && h();
    }, this._onFocus = function() {
      A(l);
    }, this._onBlur = function() {
      n === l && !l.matches(":hover") && h();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  _.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), n === l && h(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[d], delete l[d + "Uid"], q(l, "ln-tooltip:destroyed", { trigger: l });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    _,
    "ln-tooltip",
    {
      attributes: m
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-toast": {},
    "data-ln-toast-timeout": { prop: "timeoutDefault", read: It, fallback: 6e3 },
    "data-ln-toast-max": { prop: "max", read: It, fallback: 5 },
    "data-ln-toast-close": {},
    "data-ln-toast-item": {}
  }, b = et(d);
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
    const h = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; h.length > this.max; ) A.removeChild(h.shift());
    for (const _ of h) w(_, this);
    return h.length > 0 && m(A), this;
  }
  a.prototype.enqueue = function(A) {
    if (!A) return;
    const h = c(A, this.dom);
    if (!h) return;
    const _ = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    r(this, h), _ > 0 && (h._timer = setTimeout(() => f(h), _));
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
  function c(A, h) {
    const _ = ((A.type || "") + "").trim().toLowerCase(), l = Ct(h, i, "ln-toast");
    if (!l)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    pt(l, {
      type: _,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const o = l.firstElementChild;
    if (!o) return null;
    o.hasAttribute("data-ln-toast-item") || o.setAttribute("data-ln-toast-item", ""), o.classList.add("ln-enter");
    const p = o.querySelector(".body");
    p && n(p, A);
    const y = o.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      f(o);
    }), o;
  }
  function n(A, h) {
    if (Array.isArray(h.message)) {
      const _ = document.createElement("ul");
      for (const l of h.message) {
        const o = document.createElement("li");
        o.textContent = l, _.appendChild(o);
      }
      A.appendChild(_);
    }
    if (h.data && h.data.errors) {
      const _ = document.createElement("ul");
      for (const l of Object.values(h.data.errors).flat()) {
        const o = document.createElement("li");
        o.textContent = l, _.appendChild(o);
      }
      A.appendChild(_);
    }
  }
  function r(A, h) {
    const _ = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length >= A.max && _.length > 0; ) A.dom.removeChild(_.shift());
    A.dom.appendChild(h), m(A.dom), requestAnimationFrame(() => h.classList.remove("ln-enter"));
  }
  function f(A) {
    if (!A || !A.parentNode) return;
    const h = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), s(h));
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
    const l = +(A.getAttribute("data-ln-toast-timeout") ?? h.timeoutDefault);
    l > 0 && (A._timer = setTimeout(function() {
      f(A);
    }, l));
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
      for (const l of Array.from(_))
        (l[e] || (l[e] = new a(l))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const h of Array.from(A))
        h.querySelectorAll("[data-ln-toast-item]").length > 0 && m(h);
    });
  }, "ln-toast"), j(t, e, a, "ln-toast", {
    attributes: d
  });
})();
function jr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function jn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Vr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = jn(t.name), d = String(t.type || "").toLowerCase();
  return e.some((b) => {
    if (b.includes("/")) {
      if (b.endsWith("/*")) {
        const m = b.slice(0, -1);
        return d.startsWith(m);
      }
      return d === b;
    }
    return i === b;
  });
}
function Wr(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const d = 1024, b = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], m = Math.floor(Math.log(t) / Math.log(d)), s = Math.min(m, b.length - 1), a = t / Math.pow(d, s);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(a) + " " + b[s];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", d = "file_ids[]";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-upload": { prop: "uploadUrl", read: Q, fallback: "" },
    "data-ln-upload-accept": {},
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: Q, fallback: "" },
    "data-ln-upload-max-size": { prop: "maxSize", read: It, fallback: 0 },
    "data-ln-upload-max-files": { prop: "maxFiles", read: It, fallback: 0 },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: Q, fallback: i },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: Q, fallback: d },
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
    return Wr(n, r, f);
  }
  function a() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function c(n) {
    this.dom = n, tt(this, n, m), this.dict = re(n, "data-ln-upload-dict"), this.locale = rt(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const r = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = jr(r), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  c.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const r = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < r.length; u++) {
      const w = r[u], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), h = w.querySelector('[data-ln-field="sizeText"]'), _ = w.getAttribute("data-ln-upload-size"), l = _ ? parseInt(_, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: l !== null && !isNaN(l) ? l : h ? h.textContent.trim() : ""
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
  }, c.prototype._syncHiddenInputs = function() {
    const n = this, r = this.dom.querySelectorAll('input[type="hidden"]');
    for (let f = 0; f < r.length; f++)
      r[f].name === n.idsFieldName && r[f].remove();
    for (const [, f] of this.uploadedFiles)
      if (f.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = f.serverId, n.dom.appendChild(u);
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
      const u = f.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
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
    for (let u = 0; u < f.length; u++) {
      const w = f[u];
      if (r.maxFiles > 0 && r.uploadedFiles.size >= r.maxFiles) {
        q(r.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!Vr(w, r.allowedExts)) {
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
    const r = this, f = "file-" + ++r.fileIdCounter, u = jn(n.name);
    let w = null;
    if (this.list) {
      const _ = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (_ && (w = _.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", f), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: r.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const l = w.querySelector('[data-ln-upload-action="remove"]');
        l && (l.disabled = !0);
        const o = w.querySelector("[data-ln-progress]");
        o && o.setAttribute("data-ln-progress", "0"), r.list.appendChild(w);
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
          const o = w.querySelector("[data-ln-progress]");
          o && o.setAttribute("data-ln-progress", String(l)), pt(w, { sizeText: l + "%" });
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
          h(r.dict.error || "Error", A.status, p);
          return;
        }
        const o = l.id || l.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), o && w.setAttribute("data-ln-upload-id", String(o)), pt(w, {
            sizeText: s(l.size || n.size, r.locale, r.dict),
            uploading: !1
          });
          const p = w.querySelector('[data-ln-upload-action="remove"]');
          p && (p.disabled = !1);
        }
        _ && (_.serverId = o, _.size = l.size || n.size, _.name = l.name || n.name), r._syncHiddenInputs(), q(r.dom, "ln-upload:uploaded", {
          localId: f,
          serverId: o,
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
        h(l, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const _ = r.uploadedFiles.get(f);
      _ && delete _.xhr, h("", 0, null);
    });
    function h(_, l, o) {
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
        error: o
      });
    }
    r.uploadUrl ? (A.open("POST", r.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", a()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const r = this;
    let f = null, u = null;
    if (r.uploadedFiles.has(n))
      f = n, u = r.uploadedFiles.get(n);
    else
      for (const [A, h] of r.uploadedFiles)
        if (String(h.serverId) === String(n)) {
          f = A, u = h;
          break;
        }
    if (!f || !u || Z(r.dom, "ln-upload:before-remove", {
      localId: f,
      serverId: u.serverId
    }).defaultPrevented) return;
    const v = r.list ? r.list.querySelector('[data-ln-upload-local-id="' + f + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      v && v.remove(), r.uploadedFiles.delete(f), r._syncHiddenInputs(), q(r.dom, "ln-upload:removed", { localId: f, serverId: null });
      return;
    }
    let S = null;
    if (r.deleteUrlPattern ? S = r.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (S = r.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !S) {
      v && v.remove(), r.uploadedFiles.delete(f), r._syncHiddenInputs(), q(r.dom, "ln-upload:removed", { localId: f, serverId: u.serverId });
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
        serverId: u.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(r.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(r.dom, "ln-upload:error", {
        file: u,
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
  function i(a) {
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
  function d(a) {
    a = a || document.body;
    for (const c of a.querySelectorAll("a, area"))
      i(c);
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
              if (r.nodeType === 1 && (r.matches && (r.matches("a") || r.matches("area")) && i(r), r.querySelectorAll))
                for (const f of r.querySelectorAll("a, area"))
                  i(f);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && i(c);
      });
    }, "ln-external-links");
  }
  function s() {
    b(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      d();
    }) : d();
  }
  window[t] = {
    process: d
  }, s();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function d() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function b(h) {
    i && (i.textContent = h, i.classList.add("ln-link-status--visible"));
  }
  function m() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function s(h, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const l = h.querySelector("a");
    if (!l) return;
    const o = l.getAttribute("href");
    if (!o) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(o, "_blank", "noopener,noreferrer");
      return;
    }
    Z(h, "ln-link:navigate", { target: h, href: o, link: l }).defaultPrevented || l.click();
  }
  function a(h) {
    const _ = h.querySelector("a");
    if (!_) return;
    const l = _.getAttribute("href");
    l && b(l);
  }
  function c() {
    m();
  }
  function n(h) {
    h[e + "Row"] || !h.querySelector("a") || (h[e + "Row"] = !0, h._lnLinkClick = function(l) {
      s(h, l);
    }, h._lnLinkEnter = function() {
      a(h);
    }, h.addEventListener("click", h._lnLinkClick), h.addEventListener("mouseenter", h._lnLinkEnter), h.addEventListener("mouseleave", c));
  }
  function r(h) {
    h[e + "Row"] && (h._lnLinkClick && h.removeEventListener("click", h._lnLinkClick), h._lnLinkEnter && h.removeEventListener("mouseenter", h._lnLinkEnter), h.removeEventListener("mouseleave", c), delete h._lnLinkClick, delete h._lnLinkEnter, delete h[e + "Row"]);
  }
  function f(h) {
    if (!h[e + "Init"]) return;
    const _ = h.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const l = _ === "TABLE" && h.querySelector("tbody") || h;
      for (const o of l.querySelectorAll("tr"))
        r(o);
    } else
      r(h);
    delete h[e + "Init"];
  }
  function u(h) {
    if (h[e + "Init"]) return;
    h[e + "Init"] = !0;
    const _ = h.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const l = _ === "TABLE" && h.querySelector("tbody") || h;
      for (const o of l.querySelectorAll("tr"))
        n(o);
    } else
      n(h);
  }
  function w(h) {
    h.hasAttribute && h.hasAttribute(t) && u(h);
    const _ = h.querySelectorAll ? h.querySelectorAll("[" + t + "]") : [];
    for (const l of _)
      u(l);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(_) {
        for (const l of _)
          if (l.type === "childList") {
            for (const o of l.addedNodes)
              if (o.nodeType === 1) {
                w(o);
                const p = o.closest("[" + t + "]");
                if (p)
                  if (o.tagName === "TR")
                    n(o);
                  else {
                    const y = p.tagName;
                    if (y === "TABLE" || y === "TBODY") {
                      const T = o.querySelectorAll ? o.querySelectorAll("tr") : [];
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
  function S(h) {
    w(h);
  }
  window[e] = { init: S, destroy: f };
  function A() {
    d(), v(), S(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
})();
const Bt = ["Ctrl", "Alt", "Shift", "Meta"], Gr = {
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
function Vn(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = Gr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Wn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), d = /* @__PURE__ */ new Set();
  let b = "";
  for (let s = 0; s < i.length; s++) {
    const a = Vn(i[s]);
    if (!a) return "";
    if (Bt.indexOf(a) !== -1) {
      d.add(a);
      continue;
    }
    if (b) return "";
    b = a;
  }
  if (!b) return "";
  const m = [];
  for (let s = 0; s < Bt.length; s++)
    d.has(Bt[s]) && m.push(Bt[s]);
  return m.push(b), m.join("+");
}
function Qr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), d = [];
  for (let b = 0; b < i.length; b++) {
    const m = Wn(i[b]);
    m && d.indexOf(m) === -1 && d.push(m);
  }
  return d;
}
function $r(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : Wn(d ? d + "+" + i : i);
}
function Yr(t) {
  if (!t) return "";
  const e = Vn(t.key);
  if (!e || Bt.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function Xr(t) {
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
function Jr(t, e, i, d) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const b = String(e.tagName || "").toLowerCase();
  return b === "button" ? d === "Enter" || d === "Space" : b === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", d = "data-ln-key-allow-input", b = "data-ln-key-modifier", m = "data-ln-key-for", s = "lnKeyFor";
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
  let u = null;
  function w() {
    u || (u = function(_) {
      if (_.defaultPrevented || _.isComposing || _.repeat) return;
      const l = Yr(_);
      if (!l) return;
      const o = pr(_.target), p = document.querySelectorAll("[" + t + "], [" + m + "]");
      let y = null, T = !1, g = !1;
      for (let k = 0; k < p.length; k++) {
        const D = p[k], I = D[e] || D[s];
        if (!I || !I.matches(l) || o && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = Xr(R);
        if (!(!O || !mr(R, O))) {
          if (Jr(_, R, O, l)) {
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
    }, document.addEventListener("keydown", u));
  }
  function v() {
    f.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function S(_) {
    return this.dom = _, this.shortcuts = [], f.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = Qr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(_) {
    return this.shortcuts.indexOf(_) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, S.prototype.resolveTarget = function() {
    const _ = this.dom.getAttribute(i);
    return _ ? h(_, i) : this.dom;
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
    return $r(l, this.dom.textContent);
  }, A.prototype.matches = function(_) {
    return this.shortcut() === _;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const _ = this._modifierContext();
    return !!(_ && _.hasAttribute(d));
  }, A.prototype.resolveTarget = function() {
    return h(this.dom.getAttribute(m), m);
  }, A.prototype.destroy = function() {
    this.dom[s] && (f.delete(this), delete this.dom[s], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function h(_, l) {
    if (!_) return null;
    try {
      const o = document.querySelector(_);
      return o || console.warn("[ln-key] Target not found for " + l + ' selector "' + _ + '".'), o;
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
function Zr(t, e, i = 100) {
  if (e != null && e !== "") {
    const d = parseFloat(String(e));
    if (!isNaN(d) && d > 0) return d;
  }
  if (t != null && t !== "") {
    const d = parseFloat(String(t));
    if (!isNaN(d) && d > 0) return d;
  }
  return i;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function i(a) {
    const c = a[e];
    c && s.call(c);
  }
  const d = {
    "data-ln-progress": { effect: i },
    "data-ln-progress-max": { effect: i }
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
    const a = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, r = this.dom.getAttribute("data-ln-progress-max"), f = Zr(r, n, 100), u = qn(a, f);
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
      attributes: d
    }
  );
})();
function ti(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function ei(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const d = Object.keys(e);
  if (d.length === 0) return !0;
  for (let b = 0; b < d.length; b++) {
    const m = e[d[b]];
    let s = "";
    if (m.col !== null && m.col !== void 0 ? s = t[m.col] || "" : m.attr && i && typeof i.getAttribute == "function" && (s = i.getAttribute(m.attr) || ""), !xe(s, m.values))
      return !1;
  }
  return !0;
}
function Ye(t, e, i, d) {
  if (d != null && !isNaN(d))
    return parseInt(d, 10);
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
  if (t && i && typeof t.querySelectorAll == "function") {
    const b = t.querySelectorAll("thead th, tr:first-child th"), m = String(i).trim().toLowerCase();
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
function ni(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let d = 0; d < t.length; d++) {
    const b = t[d];
    !e && b.key && (e = b.key), b.checked && !b.isReset && b.value && i.push(b.value);
  }
  return { key: e, values: i };
}
function ri(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Xe(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", d = "data-ln-filter-value", b = "data-ln-filter-hide", m = "data-ln-filter-reset", s = "data-ln-filter-col", a = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
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
  function u(l) {
    return l.hasAttribute(m) || !l.getAttribute(d);
  }
  function w(l) {
    const o = l.dom.querySelectorAll("[" + i + "]"), p = [];
    for (let T = 0; T < o.length; T++) {
      const g = o[T];
      p.push({
        key: g.getAttribute(i),
        value: g.getAttribute(d) || "",
        checked: g.checked,
        isReset: u(g)
      });
    }
    const y = ni(p);
    return { key: y.key, values: y.values, targetId: l.targetId };
  }
  function v(l, o, p) {
    const y = l.querySelectorAll("[" + i + "]"), T = Array.isArray(p) && p.length > 0;
    for (let g = 0; g < y.length; g++) {
      const E = y[g];
      u(E) ? E.checked = !T : T && E.getAttribute(i) === o && p.indexOf(E.getAttribute(d)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(l) {
    this.dom = l, tt(this, l, f);
    const o = l.getAttribute(s);
    this.colIndex = o !== null ? parseInt(o, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(l, "filter"), this.hashEnabled = !!this.nsKey;
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
      const g = Xe(l.getAttribute(c));
      if (g.length > 0) {
        const E = l.querySelector("[" + i + "]"), C = E ? E.getAttribute(i) : null;
        C && (v(l, C, g), mt(function() {
          p._destroyed || p._render();
        }), T = !0);
      }
    }
    if (!T) {
      const g = l.querySelectorAll("[" + i + "]");
      for (let E = 0; E < g.length; E++)
        if (g[E].checked && !u(g[E])) {
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
    this._onDomChange = function(o) {
      const p = o.target;
      if (!p || !p.hasAttribute || !p.hasAttribute(i)) return;
      const y = Array.from(l.dom.querySelectorAll("[" + i + "]"));
      if (u(p)) {
        for (let T = 0; T < y.length; T++)
          u(y[T]) || (y[T].checked = !1);
        p.checked = !0, l._queueRender();
        return;
      }
      if (p.checked) {
        for (let g = 0; g < y.length; g++)
          u(y[g]) && (y[g].checked = !1);
        let T = !1;
        for (let g = 0; g < y.length; g++)
          if (u(y[g])) {
            T = !0;
            break;
          }
        if (T) {
          let g = !0;
          for (let E = 0; E < y.length; E++)
            if (!u(y[E]) && !y[E].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let E = 0; E < y.length; E++)
              u(y[E]) ? y[E].checked = !0 : y[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let g = 0; g < y.length; g++)
          if (!u(y[g]) && y[g].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let g = 0; g < y.length; g++)
            u(y[g]) && (y[g].checked = !0);
      }
      l._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const l = this, o = w(this), p = this._lastSnapshot;
    if (!(!p || p.key !== o.key || ti(p.values, o.values))) return;
    const T = o.key === null || o.values.length === 0, g = document.getElementById(l.targetId), E = {
      key: o.key,
      values: o.values.slice(),
      targetId: l.targetId
    };
    q(l.dom, "ln-filter:change", E);
    let C = !1;
    g && g !== l.dom && Z(g, "ln-filter:change", E).defaultPrevented && (C = !0);
    const k = p && p.values.length > 0, D = o.values.length === 0;
    if (k && D) {
      const O = { targetId: l.targetId };
      q(l.dom, "ln-filter:reset", O), g && g !== l.dom && q(g, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: o.key, values: o.values.slice() };
    const I = ri(o.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = Tn(o.key, o.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = g && (g.tagName === "TABLE" ? g : g.querySelector ? g.querySelector("table") : null);
    if (R)
      l._filterTableRows(o, R);
    else {
      if (!g) return;
      const O = g.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(b), T) continue;
        const U = B.getAttribute("data-" + o.key);
        U !== null && (xe(U, o.values) || B.setAttribute(b, "true"));
      }
    }
  };
  function A(l) {
    if (!l) return "";
    const o = l.querySelector ? l.querySelector("[data-ln-value]") : null;
    return vt(o || l);
  }
  function h(l) {
    return !!(!l || typeof l != "object" || l.tagName === "TEMPLATE" || typeof l.hasAttribute == "function" && (l.hasAttribute("data-ln-sort-exclude") || l.hasAttribute("hidden")) || l.classList && l.classList.contains("hidden") || l.style && l.style.display === "none" || typeof l.matches == "function" && l.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof l.querySelector == "function" && l.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(l, o) {
    if (!o) {
      const C = document.getElementById(this.targetId);
      if (!C || (o = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !o)) return;
    }
    const p = Ye(o, this.dom, l.key, this.colIndex), y = l.key || this.dom.getAttribute("data-ln-filter-key") || (p !== null ? "col" + p : "attr-filter"), T = l.values;
    n.has(o) || n.set(o, {});
    const g = n.get(o);
    y && T.length > 0 ? g[y] = {
      col: p,
      values: T.slice(),
      attr: "data-" + y
    } : y && delete g[y];
    const E = o.tBodies;
    for (let C = 0; C < E.length; C++) {
      const k = E[C].rows;
      for (let D = 0; D < k.length; D++) {
        const I = k[D];
        if (h(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        ei(R, g, I) ? I.removeAttribute(b) : I.setAttribute(b, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const l = document.getElementById(this.targetId);
    if (l) {
      const o = l.tagName === "TABLE" ? l : l.querySelector ? l.querySelector("table") : null;
      if (o && n.has(o)) {
        const p = n.get(o), y = Ye(o, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (y !== null ? "col" + y : this.colIndex !== null ? "col" + this.colIndex : null);
        T && p[T] && (delete p[T], this._filterTableRows({ key: null, values: [] }, o)), Object.keys(p).length === 0 && n.delete(o);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function _(l, o) {
    const p = l[e];
    if (!(!p || p._destroyed)) {
      if (o === a)
        p.hashEnabled && p._onHashChange && window.removeEventListener("hashchange", p._onHashChange), p.nsKey = wt(l, "filter"), p.hashEnabled = !!p.nsKey, p.hashEnabled && window.addEventListener("hashchange", p._onHashChange);
      else if (o === c) {
        const y = Xe(l.getAttribute(c)), T = l.querySelector("[" + i + "]"), g = T ? T.getAttribute(i) : null;
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
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", d = "lnSearchControl", b = "data-ln-search-items", m = "data-ln-search-fields", s = "data-ln-search-exclude", a = "data-ln-search-hide", c = "data-ln-hash";
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
  function f(o) {
    const p = wt(o, "search");
    if (p) return p;
    if (o.id) {
      const y = document.querySelector("[" + i + '="' + o.id + '"]');
      if (y) {
        const T = wt(y, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(o) {
    return o.matches("input, textarea") ? o : o.querySelector("input, textarea");
  }
  function w(o, p) {
    const y = o.childNodes;
    for (let T = 0; T < y.length; T++) {
      const g = y[T];
      if (g.nodeType === 3) {
        p.push(g.nodeValue);
        continue;
      }
      g.nodeType === 1 && (g.hasAttribute(s) || w(g, p));
    }
  }
  function v(o) {
    if (o._lnSearchText !== void 0) return o._lnSearchText;
    const p = [];
    w(o, p);
    const y = xr(p);
    return o._lnSearchText = y, y;
  }
  function S(o, p) {
    if (!o.id) return;
    const y = document.querySelectorAll("[" + i + '="' + o.id + '"]');
    for (const T of y) {
      const g = u(T);
      g && g.value !== p && (g.value = p);
    }
  }
  function A(o) {
    this.dom = o, this.term = o.getAttribute(t) || "", this._destroyed = !1;
    const p = this;
    return this.nsKey = f(o), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
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
    const o = this.dom, p = ye(this.term), y = xn(p);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = kr(o.getAttribute(m));
    if (Z(o, "ln-search:change", {
      term: p,
      tokens: y,
      targetId: o.id,
      fields: T
    }).defaultPrevented) return;
    const E = o.getAttribute(b), C = E ? o.querySelectorAll(E) : o.children;
    for (let k = 0; k < C.length; k++) {
      const D = C[k];
      if (D.removeAttribute(a), D.hasAttribute(s) || y.length === 0) continue;
      const I = v(D);
      In(I, y) || D.setAttribute(a, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function h(o) {
    if (this.dom = o, tt(this, o, r), this.input = u(o), this._attachHandler(), this.input && this.input.value.trim()) {
      const p = this;
      mt(function() {
        const y = document.getElementById(p.targetId);
        y && ((y.getAttribute(t) || "").trim() || p._write(p.input.value));
      });
    }
    return this;
  }
  h.prototype._write = function(o) {
    const p = document.getElementById(this.targetId);
    p && p.getAttribute(t) !== o && p.setAttribute(t, o);
  }, h.prototype._attachHandler = function() {
    if (!this.input) return;
    const o = this;
    this._onInput = function() {
      o._write(o.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, h.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function _(o) {
    const p = o.getAttribute("data-ln-search-clear-for");
    if (p) {
      const C = document.getElementById(p), k = document.querySelector("[" + i + '="' + p + '"]'), D = k ? u(k) : null;
      return { target: C, input: D };
    }
    const y = o.closest("[" + t + "]");
    if (y) {
      const C = y.id ? document.querySelector("[" + i + '="' + y.id + '"]') : null, k = C ? u(C) : null;
      return { target: y, input: k };
    }
    const T = o.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), k = C ? document.getElementById(C) : null;
      if (k && k.hasAttribute(t)) {
        const D = document.querySelector("[" + i + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: k, input: I };
      }
    }
    const g = o.closest("[" + i + "]");
    if (g) {
      const C = g.getAttribute(i), k = C ? document.getElementById(C) : null, D = u(g);
      return { target: k, input: D };
    }
    const E = o.parentElement;
    if (E) {
      const C = E.querySelector("[" + i + "]");
      if (C) {
        const k = C.getAttribute(i), D = k ? document.getElementById(k) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(o) {
    const p = o.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!p) return;
    const y = _(p);
    !y.target && !y.input || (o.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function l(o, p) {
    const y = o[e];
    if (!y || y._destroyed) return;
    if (p === c) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = f(o), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const T = o.getAttribute(t) || "";
    T !== y.term && (y.term = T, S(o, T), y._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(o, p) {
      const y = p.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(o) {
        return !!f(o);
      }
    }
  }), j(i, d, h);
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function ii(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function oi(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function si(t, e, i, d) {
  const b = St(t);
  if (b === "none") return () => 0;
  const m = b === "desc" ? -1 : 1, s = typeof d == "function" ? d : (a) => a;
  return function(a, c) {
    const n = s(a), r = s(c);
    return Te(n, r, e, i) * m;
  };
}
function me(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function ai(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const i = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (i && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(i));
  if (t.tagName === "TABLE") {
    const d = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (d)
      return Array.from(d.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", d = "data-ln-sort-state", b = "data-ln-sort-dir", m = "data-ln-hash";
  if (window[e] !== void 0) return;
  function s(w, v) {
    return w.getAttribute(v) || null;
  }
  const a = {
    "data-ln-sort": { prop: "targetId", read: Q, fallback: null },
    "data-ln-sort-field": { prop: "field", read: s, effect: u },
    "data-ln-sort-dir": {},
    "data-ln-sort-items": { prop: "itemsSelector", read: s },
    "data-ln-sort-state": { effect: u },
    "data-ln-hash": { effect: u }
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
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(d)), w.hasAttribute(d) || w.setAttribute(d, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(h) {
      const _ = h.target.closest("[" + b + "]");
      if (!_) return;
      const l = St(_.getAttribute(b));
      S._apply(l);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(h) {
      if (S._destroyed || !h.detail) return;
      const _ = S._resolveTarget();
      if (!(_ && (h.target === _ || _.contains(h.target)) || h.detail.targetId && h.detail.targetId === S.targetId)) return;
      if (oi(
        { field: S.field, column: S.column },
        { field: h.detail.field, column: h.detail.column }
      )) {
        const p = St(h.detail.direction);
        p && w.getAttribute(d) !== p && (S._state = p, w.setAttribute(d, p), S._updateAriaSort(p));
        return;
      }
      w.getAttribute(d) !== "none" && (S._state = "none", w.setAttribute(d, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const h = ot(S.nsKey), _ = ge(h);
      if (_)
        S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn ? S._state !== _.direction && S._apply(_.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(d, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(d, "none"), S._updateAriaSort("none");
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
      const h = ot(this.nsKey), _ = ge(h);
      _ && ((S.field !== null && _.fieldOrColumn === S.field || S.column !== null && String(S.column) === _.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(_.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const h = St(w.getAttribute(d));
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
    v && v.setAttribute("aria-sort", ii(w));
  }, f.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const l = this.dom.closest("th");
      l && l.cellIndex !== void 0 && (this.column = l.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(d) !== S && this.dom.setAttribute(d, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const h = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const l = Cn(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, l);
    }
    Z(A, "ln-sort:change", h).defaultPrevented || this._defaultSort(A, S);
  }, f.prototype._defaultSort = function(w, v) {
    const S = ai(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, h = S.filter(function(p) {
      return !me(p);
    });
    if (!h.length) return;
    n.has(w) || n.set(w, h.slice());
    let _;
    if (v === "none") {
      const p = n.get(w) || h;
      n.delete(w), _ = p.filter(function(y) {
        return y.parentNode === A && !me(y);
      });
    } else {
      const p = this.field, y = this.column, T = h.map(function(k) {
        return r(k, p, y);
      }), g = Ce(T), E = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = si(v, g, E, function(k) {
        return r(k, p, y);
      });
      _ = h.slice().sort(C);
    }
    const l = document.createDocumentFragment();
    let o = 0;
    for (let p = 0; p < S.length; p++) {
      const y = S[p];
      me(y) ? l.appendChild(y) : o < _.length && l.appendChild(_[o++]);
    }
    A.appendChild(l);
  }, f.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === i) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === d) {
        const A = St(w.getAttribute(d));
        A !== S._state && S._apply(A);
      } else v === m && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, f, "ln-sort", {
    attributes: a,
    persist: {
      attr: d,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function Je(t, e, i, d, b = 15) {
  if (d <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const m = Math.max(0, t || 0), s = Math.max(0, e || 0), a = Math.floor(m / i), c = Math.ceil(s / i), n = Math.max(0, a - b), r = Math.min(d, a + c + b), f = n * i, u = Math.max(0, (d - r) * i);
  return { start: n, end: r, topPadding: f, bottomPadding: u };
}
function li(t, e) {
  const i = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let b = 0;
  if (Array.isArray(t))
    for (let a = 0; a < t.length; a++)
      d.has(t[a]) && b++;
  else
    b = d.size;
  const m = i > 0 && b === i, s = b > 0 && b < i;
  return { totalCount: i, selectedCount: b, isAllSelected: m, isIndeterminate: s };
}
function Ze(t, e, i) {
  const d = new Set(t);
  return e == null || ((i !== void 0 ? i : !d.has(e)) ? d.add(e) : d.delete(e)), d;
}
function tn(t, e, i) {
  const d = new Set(t);
  if (!Array.isArray(e)) return d;
  if (i)
    for (let b = 0; b < e.length; b++)
      e[b] != null && d.add(e[b]);
  else
    for (let b = 0; b < e.length; b++)
      d.delete(e[b]);
  return d;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function c(h, _) {
    if (!h || !h.isDataDriven) return;
    const l = h.dom.hasAttribute("data-ln-table-window");
    if (l && !h._windowed)
      h._enterWindowedMode(), h._kickWindowInitial();
    else if (!l && h._windowed)
      h._exitWindowedMode();
    else if (l && h._windowed) {
      const o = parseInt(_, 10);
      o > 0 && h._cache.configure({ windowSize: o });
    }
  }
  function n(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const l = parseInt(_, 10);
    l > 0 && h._cache.configure({ pageSize: l });
  }
  function r(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const l = parseInt(_, 10);
    l >= 0 && h._cache.configure({ threshold: l });
  }
  function f(h, _) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const l = parseInt(_, 10);
    l >= 0 && h._cache.setGrandTotal(l);
  }
  const u = {
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
      const o = getComputedStyle(_).overflowY;
      if (o === "auto" || o === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function A(h) {
    this.dom = h, tt(this, h, w), this.table = h.querySelector("table"), this.tbody = h.querySelector("[data-ln-table-body]") || h.querySelector("tbody"), this.thead = h.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = h.querySelector("[data-ln-table-total]"), this._filteredSpan = h.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== h ? this._filteredSpan.parentElement : null), this._selectedSpan = h.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== h ? this._selectedSpan.parentElement : null), this.isDataDriven = h.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    return this._onSetSearch = function(o) {
      const p = (o.detail && o.detail.query != null ? o.detail.query : o.detail && o.detail.term != null ? o.detail.term : "").trim();
      l.isDataDriven ? (l.currentSearch = p, q(h, "ln-table:search", {
        table: l.name,
        query: l.currentSearch
      }), l._requestData()) : (l._searchTerm = p.toLowerCase(), l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(h, "ln-table:filter", {
        term: l._searchTerm,
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, h.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(o) {
      o.preventDefault(), l._onSetSearch(o);
    }, h.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      l.isDataDriven ? (l.currentFilters = {}, l.currentSearch = "", q(h, "ln-table:clear-filters", { table: l.name }), l._requestData()) : (l._searchTerm = "", l._columnFilters = {}, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(h, "ln-table:filter", {
        term: "",
        matched: l._filteredData.length,
        total: l._data.length
      }));
    }, h.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && h.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(o) {
      const p = o.detail || {}, y = p.data || [], T = p.total != null ? p.total : y.length;
      if (!(l._hasInitialSeed && !l.isLoaded && y.length === 0 && T === 0)) {
        if (l._windowed) {
          l._cache.ingest(p) && !p.provisional && h.classList.remove("ln-table--loading");
          return;
        }
        l._data = y, l._lastTotal = T, l._lastFiltered = p.filtered != null ? p.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, l._hasInitialSeed = !1, h.classList.remove("ln-table--loading"), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), q(h, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }
    }, h.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(o) {
      const p = o.detail && o.detail.loading;
      h.classList.toggle("ln-table--loading", !!p), p && (l.isLoaded = !1);
    }, h.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(o) {
      !l._windowed || !l._cache || l._cache.release(o.detail && o.detail.offset);
    }, h.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !l._windowed || !l._cache || l._cache.revalidate();
    }, h.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !l._windowed || !l._cache || l._requestData();
    }, h.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(o) {
      o.preventDefault(), l.currentSort = o.detail.direction === "none" ? null : { field: o.detail.field, direction: o.detail.direction }, l._requestData();
    }, h.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(o) {
      if (o.target.closest("[data-ln-table-row-select]") || o.target.closest("[data-ln-table-row-action]") || o.target.closest("a") || o.target.closest("button") || o.ctrlKey || o.metaKey || o.button === 1) return;
      const p = o.target.closest("[data-ln-table-row]");
      if (!p) return;
      const y = p.getAttribute("data-ln-table-row-id"), T = p._lnRecord || {};
      q(h, "ln-table:row-click", {
        table: l.name,
        id: y,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(o) {
      const p = o.target.closest("[data-ln-table-row-action]");
      if (!p) return;
      const y = p.closest("[data-ln-table-row]");
      if (!y) return;
      const T = p.getAttribute("data-ln-table-row-action"), g = y.getAttribute("data-ln-table-row-id"), E = y._lnRecord || {};
      q(h, "ln-table:row-action", {
        table: l.name,
        id: g,
        action: T,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : q(h, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(o) {
      o.preventDefault();
      const p = o.detail.direction === "none" ? null : o.detail.direction;
      l._sortCol = p === null ? -1 : o.detail.column, l._sortDir = p, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), q(h, "ln-table:sorted", {
        column: o.detail.column,
        direction: o.detail.direction,
        matched: l._filteredData.length,
        total: l._data.length
      });
    }, h.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(o) {
      if (o.preventDefault(), !o.detail) return;
      const p = o.detail.key, y = o.detail.values || [];
      if (p) {
        if (y.length === 0)
          delete l._columnFilters[p];
        else {
          const T = [];
          for (let g = 0; g < y.length; g++)
            T.push(y[g].toLowerCase());
          l._columnFilters[p] = T;
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), q(h, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }
    }, h.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const h = this.tbody.rows, _ = this.ths;
    this._data = [], h.length > 0 && (this._rowHeight = h[0].offsetHeight || 40), this._lockColumnWidths();
    for (let l = 0; l < h.length; l++) {
      const o = h[l], p = [], y = [], T = [];
      for (let E = 0; E < o.cells.length; E++) {
        const C = o.cells[E], k = C.textContent.trim();
        p[E] = vt(C), y[E] = k.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(k.toLowerCase());
      }
      let g = null;
      if (this.isDataDriven) {
        g = {};
        const E = o.getAttribute("data-ln-table-row-id");
        E != null && (g.id = E);
        for (let C = 0; C < _.length; C++) {
          const k = _[C].getAttribute("data-ln-table-col");
          if (k) {
            const D = C;
            if (D < o.cells.length) {
              const I = o.cells[D];
              g[k] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: p,
        rawTexts: y,
        html: o.outerHTML,
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
    const h = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const l = document.createElement("col");
      l.style.width = _.offsetWidth + "px", h.appendChild(l);
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
      for (let l = 0; l < h.length; l++) {
        const o = this._buildRow(h[l]);
        if (!o) break;
        _.appendChild(o);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const h = [], _ = this._filteredData;
      for (let l = 0; l < _.length; l++) h.push(_[l].html);
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
        let l = null;
        if (this._windowed) {
          const o = this._cache ? this._cache.peek() : null;
          l = o ? this._buildRow(o) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (l = this._buildRow(this._data[0]));
        l && this.tbody && (this.tbody.appendChild(l), this._rowHeight = l.offsetHeight || 40, l.remove());
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
    const h = this._filteredData, _ = h.length, l = this._rowHeight;
    if (!l || !_) return;
    const o = this.thead ? this.thead.offsetHeight : 0, p = this._scrollContainer;
    let y, T;
    if (p) {
      const R = this.table.getBoundingClientRect(), O = p.getBoundingClientRect(), P = R.top - O.top + p.scrollTop + o;
      y = p.scrollTop - P, T = p.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + o;
      y = window.scrollY - P, T = window.innerHeight;
    }
    const g = Je(y, T, l, _, 15), E = g.start, C = g.end;
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
        const P = this._buildRow(h[O]);
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
      for (let O = E; O < C; O++) R += h[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + k + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
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
    const _ = this._cache.logicalTotal, l = this.thead ? this.thead.offsetHeight : 0, o = this._scrollContainer;
    let p, y;
    if (o) {
      const R = this.table.getBoundingClientRect(), O = o.getBoundingClientRect(), P = R.top - O.top + o.scrollTop + l;
      p = o.scrollTop - P, y = o.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + l;
      p = window.scrollY - P, y = window.innerHeight;
    }
    const T = Je(p, y, h, _, 15), g = T.start, E = T.end, C = this.ths.length || 1, k = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
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
    const h = this.ths.length || 1;
    let _ = null, l = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount === 0 && o > 0, T = y ? this.name + "-empty-filtered" : this.name + "-empty";
      if (l = Ct(this.dom, T, "ln-table"), !l) {
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
          g.setAttribute("colspan", String(h)), g.appendChild(l);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(g), _ = E;
        }
    } else {
      const o = this.dom.querySelector("template[" + i + "]"), p = document.createElement("td");
      p.setAttribute("colspan", String(h)), o && p.appendChild(document.importNode(o.content, !0));
      const y = document.createElement("tr");
      y.className = "ln-table__empty", y.appendChild(p), _ = y;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), q(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(h, _) {
    jt(h, _);
    const l = h.querySelectorAll("[data-ln-table-cell-attr]");
    for (let o = 0; o < l.length; o++) {
      const p = l[o], y = p.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < y.length; T++) {
        const g = y[T].trim().split(":");
        if (g.length !== 2) continue;
        const E = g[0].trim(), C = g[1].trim();
        _[E] != null && p.setAttribute(C, _[E]);
      }
    }
  }, A.prototype._buildRow = function(h) {
    let _ = Ct(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const o = this.dom.querySelector("template[data-ln-table-row]");
      o && (_ = document.importNode(o.content, !0));
    }
    let l = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (l)
      this._fillRow(l, h);
    else if (h && h.html) {
      const o = document.createElement("tbody");
      o.innerHTML = h.html, l = o.firstElementChild;
    } else {
      l = document.createElement("tr"), l.setAttribute("data-ln-table-row", "");
      const o = this.ths;
      for (let p = 0; p < o.length; p++) {
        const y = o[p].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (y) {
          const g = document.createElement("input");
          g.type = "checkbox", g.setAttribute("data-ln-table-row-select", ""), g.setAttribute("aria-label", "Select row"), T.appendChild(g);
        } else {
          const g = o[p].getAttribute("data-ln-table-col");
          g && h[g] != null && (T.textContent = String(h[g]));
        }
        l.appendChild(T);
      }
    }
    if (l._lnRecord = h, h.id != null && l.setAttribute("data-ln-table-row-id", h.id), this._selectable && h.id != null && this.selectedIds.has(String(h.id))) {
      l.classList.add("ln-row-selected");
      const o = l.querySelector("[data-ln-table-row-select]");
      o && (o.checked = !0);
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
    ln(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const h = this, _ = this.dom, l = parseInt(_.getAttribute("data-ln-table-window"), 10), o = parseInt(_.getAttribute("data-ln-table-window-page"), 10), p = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !h._windowed || !h._cache || (h.totalCount = h._cache.grandTotal, h.visibleCount = h._cache.logicalTotal, h._lastTotal = h._cache.grandTotal, h.isLoaded = !0, h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), q(_, "ln-table:rendered", {
        table: h.name,
        total: h.totalCount,
        visible: h.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = An({
      windowSize: l > 0 ? l : 1e3,
      pageSize: o > 0 ? o : 200,
      threshold: p >= 0 ? p : 25,
      fetchDebounce: 120,
      requestPage: function(y, T, g) {
        q(_, "ln-table:request-data", {
          table: h.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: T,
          limit: g,
          queryGen: h._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let h = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(h) && this._totalSpan) {
        const l = this._totalSpan.textContent.replace(/[^\d]/g, "");
        l && (h = parseInt(l, 10));
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
    for (let o = 0; o < h.length; o++) {
      const p = h[o].getAttribute("data-ln-table-row-id");
      p != null && _.push(p);
    }
    const l = li(_, this.selectedIds);
    this._selectAllCheckbox.checked = l.isAllSelected, this._selectAllCheckbox.indeterminate = l.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const h = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < h.length; _++) {
      const l = h[_].getAttribute("data-ln-table-row-id"), o = l != null && this.selectedIds.has(l);
      h[_].classList.toggle("ln-row-selected", o);
      const p = h[_].querySelector("[data-ln-table-row-select]");
      p && (p.checked = o);
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
      const l = _.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const o = l.closest("[data-ln-table-row]");
      if (!o) return;
      const p = o.getAttribute("data-ln-table-row-id");
      p != null && (h.selectedIds = Ze(h.selectedIds, p, l.checked), o.classList.toggle("ln-row-selected", l.checked), h.selectedCount = h.selectedIds.size, h._updateSelectAll(), h._updateFooter(), q(h.dom, "ln-table:select", {
        table: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const l = h.dom.querySelector('[data-ln-table-dict="select-all"]'), o = h.dom.getAttribute("data-ln-table-select-all-label") || (l ? l.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", o), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = h._selectAllCheckbox.checked, l = h.tbody ? h.tbody.querySelectorAll("[data-ln-table-row]") : [], o = [];
      for (let p = 0; p < l.length; p++) {
        const y = l[p].getAttribute("data-ln-table-row-id"), T = l[p].querySelector("[data-ln-table-row-select]");
        y != null && (o.push(y), l[p].classList.toggle("ln-row-selected", _), T && (T.checked = _));
      }
      h.selectedIds = tn(h.selectedIds, o, _), h.selectedCount = h.selectedIds.size, q(h.dom, "ln-table:select-all", {
        table: h.name,
        selected: _
      }), q(h.dom, "ln-table:select", {
        table: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedCount
      }), h._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < _.length; l++) {
        const o = _[l].querySelector("[data-ln-table-row-select]"), p = _[l].getAttribute("data-ln-table-row-id");
        o && o.checked && p != null && (h.selectedIds = Ze(h.selectedIds, p, !0), _[l].classList.add("ln-row-selected"));
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
    if (this._selectAllCheckbox = null, this.selectedIds = tn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < _.length; l++) {
        _[l].classList.remove("ln-row-selected");
        const o = _[l].querySelector("[data-ln-table-row-select]");
        o && (o.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let h = 0, _ = 0;
    this.isDataDriven ? (h = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (h = this._data.length, _ = this._filteredData.length);
    const l = _ < h;
    if (this._totalSpan && (this._totalSpan.textContent = v(h, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = l ? v(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const o = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = o > 0 ? v(o, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
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
  const i = {
    "data-ln-table-coordinator": {}
  };
  document.addEventListener("keydown", function(a) {
    if (a.key !== "/" || a.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const c = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!c) return;
    const n = c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector('input[type="search"], input[type="text"], input');
    n && (a.preventDefault(), n.focus());
  });
  function d(a) {
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
      const u = r.detail && r.detail.targetId || f && f.id;
      return u ? c.querySelector('[data-ln-table-source="' + u + '"]') || c.querySelector('[data-ln-table="' + u + '"]') || c.querySelector("#" + u) || (c.id === u ? c : null) || document.getElementById(u) : null;
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
        const u = r.detail.key, w = r.detail.values || [], v = f.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === u) {
            const h = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            h && h.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(r) {
        const f = r.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!f) return;
        const u = f.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, v = u.querySelectorAll("th");
        for (let _ = 0; _ < v.length; _++) {
          const l = v[_].querySelector("[data-ln-table-col-filter], .table-filter");
          l && l.classList.remove("ln-filter-active");
        }
        const S = u.getAttribute("data-ln-table-source") || u.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const _ = b(c, S);
          _ && _.value !== "" && (_.value = "", _.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const h = m(c, S);
        for (let _ = 0; _ < h.length; _++) {
          const l = h[_].querySelector("[data-ln-filter-reset]");
          if (!l) continue;
          const o = h[_].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!l.checked || o) && (l.checked = !0, l.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && q(u, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", a._handlers.filter), c.addEventListener("click", a._handlers.clear);
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, d, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(o, p) {
    if (!o || !o.isDataDriven) return;
    const y = o.dom.hasAttribute("data-ln-list-window");
    if (y && !o._windowed)
      o._enterWindowedMode(), o._kickWindowInitial();
    else if (!y && o._windowed)
      o._exitWindowedMode();
    else if (y && o._windowed) {
      const T = parseInt(p, 10);
      T > 0 && o._cache.configure({ windowSize: T });
    }
  }
  function n(o, p) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const y = parseInt(p, 10);
    y > 0 && o._cache.configure({ pageSize: y });
  }
  function r(o, p) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const y = parseInt(p, 10);
    y >= 0 && o._cache.configure({ threshold: y });
  }
  function f(o, p) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const y = parseInt(p, 10);
    y >= 0 && o._cache.setGrandTotal(y);
  }
  const u = {
    "data-ln-list": { prop: "name", read: Q, fallback: "" },
    "data-ln-list-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-list-selectable": { prop: "_selectable", read: Kt },
    "data-ln-list-window": { effect: c },
    "data-ln-list-window-page": { effect: n },
    "data-ln-list-window-threshold": { effect: r },
    "data-ln-list-count": { effect: f },
    "data-ln-list-empty": {},
    "data-ln-list-field": {}
  }, w = et(u);
  function v(o, p) {
    if (o == null || isNaN(o)) return "";
    try {
      return new Intl.NumberFormat(rt(p)).format(o);
    } catch {
      return String(o);
    }
  }
  function S(o) {
    let p = o;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const T = getComputedStyle(p).overflowY;
      if (T === "auto" || T === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function A(o) {
    const p = o._scrollContainer || S(o.dom);
    return {
      container: p,
      top: p ? p.scrollTop : window.scrollY
    };
  }
  function h(o) {
    o.container ? o.container.scrollTop = o.top : window.scrollTo(window.scrollX, o.top);
  }
  function _(o) {
    if (!o) return 0;
    const p = getComputedStyle(o), y = parseFloat(p.marginTop) || 0, T = parseFloat(p.marginBottom) || 0;
    return o.offsetHeight + y + T;
  }
  function l(o) {
    this.dom = o, tt(this, o, w), this.tbody = o.querySelector("[data-ln-list-body]") || o, this.isDataDriven = o.hasAttribute("data-ln-list-source"), this._totalSpan = o.querySelector("[data-ln-list-total]"), this._filteredSpan = o.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.parentElement : null), this._selectedSpan = o.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const p = this;
    return this._onSetSearch = function(y) {
      const T = (y.detail && y.detail.query != null ? y.detail.query : y.detail && y.detail.term != null ? y.detail.term : "").trim();
      p.isDataDriven ? (p.currentSearch = T, q(o, "ln-list:search", {
        list: p.name,
        query: p.currentSearch
      }), p._requestData()) : (p._searchTerm = T.toLowerCase(), p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(o, "ln-list:filter", {
        term: p._searchTerm,
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, o.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(y) {
      y.preventDefault(), p._onSetSearch(y);
    }, o.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      p.isDataDriven ? (p.currentFilters = {}, p.currentSearch = "", q(o, "ln-list:clear-filters", { list: p.name }), p._requestData()) : (p._searchTerm = "", p._filters = {}, p._sortField = null, p._sortDir = null, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(o, "ln-list:filter", {
        term: "",
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, o.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, o.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(y) {
      const T = y.detail || {}, g = T.data || [], E = T.total != null ? T.total : g.length;
      if (!(p._hasInitialSeed && !p.isLoaded && g.length === 0 && E === 0)) {
        if (p._windowed) {
          p._cache.ingest(T) && !T.provisional && o.classList.remove("ln-list--loading");
          return;
        }
        p._data = g, p._lastTotal = E, p._lastFiltered = T.filtered != null ? T.filtered : p._data.length, p.totalCount = p._lastTotal, p.visibleCount = p._lastFiltered, p.isLoaded = !0, p._hasInitialSeed = !1, o.classList.remove("ln-list--loading"), p._vStart = -1, p._vEnd = -1, p._applyFilterAndSort(), p._render(), p._updateFooter(), q(o, "ln-list:rendered", {
          list: p.name,
          total: p.totalCount,
          visible: p.visibleCount
        });
      }
    }, o.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(y) {
      const T = y.detail && y.detail.loading;
      o.classList.toggle("ln-list--loading", !!T), T && (p.isLoaded = !1);
    }, o.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(y) {
      !p._windowed || !p._cache || p._cache.release(y.detail && y.detail.offset);
    }, o.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !p._windowed || !p._cache || p._cache.revalidate();
    }, o.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !p._windowed || !p._cache || p._requestData();
    }, o.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(y) {
      y.detail.field != null && (y.preventDefault(), p.currentSort = y.detail.direction === "none" ? null : { field: y.detail.field, direction: y.detail.direction }, p._requestData());
    }, o.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(y) {
      if (y.target.closest("[data-ln-item-select]") || y.target.closest("[data-ln-item-action]") || y.target.closest("a") || y.target.closest("button") || y.ctrlKey || y.metaKey || y.button === 1) return;
      const T = y.target.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      q(o, "ln-list:item-click", {
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
      q(o, "ln-list:item-action", {
        list: p.name,
        id: C,
        action: E,
        record: k
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : q(o, "ln-list:request-data", {
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
        p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(o, "ln-list:filter", {
          term: p._searchTerm,
          matched: p._filteredData.length,
          total: p._data.length
        });
      }
    }, o.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(y) {
      if (y.detail && y.detail.field == null) return;
      y.preventDefault();
      const T = y.detail && y.detail.direction === "none" ? null : y.detail && y.detail.direction;
      p._sortField = T === null ? null : y.detail && y.detail.field, p._sortDir = T, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), q(o, "ln-list:sorted", {
        field: p._sortField,
        direction: y.detail && y.detail.direction,
        matched: p._filteredData.length,
        total: p._data.length
      });
    }, o.addEventListener("ln-sort:change", this._onSort)), this;
  }
  l.prototype._parseChildren = function() {
    const o = Array.from(this.tbody.children).filter((p) => !p.classList.contains("ln-list__spacer"));
    this._data = [], o.length > 0 && (this._itemHeight = _(o[0]) || 50);
    for (let p = 0; p < o.length; p++) {
      const y = o[p], T = y.getAttribute("data-ln-item-id") || y.getAttribute("id"), g = y.textContent.trim().toLowerCase();
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
      const o = this._searchTerm, p = o ? o.split(/\s+/).filter(Boolean) : [], y = this._filters || {}, T = Object.keys(y).length > 0;
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
        const o = this._lastTotal, p = this.visibleCount;
        if (o === 0 || this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, l.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, p = document.createDocumentFragment();
      for (let T = 0; T < o.length; T++) {
        const g = this._buildItem(o[T]);
        g && p.appendChild(g);
      }
      const y = A(this);
      this.tbody.replaceChildren(p), h(y), this._selectable && this._updateSelectAll();
    } else {
      const o = [], p = this._filteredData;
      for (let T = 0; T < p.length; T++) o.push(p[T].html);
      const y = A(this);
      this.tbody.innerHTML = o.join(""), h(y), this._selectable && this._restoreSelection();
    }
  }, l.prototype._readGridLayout = function() {
    const o = getComputedStyle(this.tbody), p = o.gridTemplateColumns;
    let y = 1;
    if (p && p !== "none") {
      const g = p.trim().split(/\s+/).filter(Boolean);
      g.length > 0 && (y = g.length);
    }
    const T = parseFloat(o.rowGap);
    return { columns: y, rowGap: isNaN(T) ? 0 : T };
  }, l.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const o = this._cache.peek(), p = o ? this._buildItem(o) : this._buildPlaceholderItem();
      p && (this.tbody.textContent = "", this.tbody.appendChild(p), this._itemHeight = _(p) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const o = this._buildItem(this._data[0]);
        o && (this.tbody.textContent = "", this.tbody.appendChild(o), this._itemHeight = _(o) || 50, this.tbody.textContent = "");
      }
    } else {
      const o = this.tbody.children;
      o.length > 0 && (this._itemHeight = _(o[0]) || 50);
    }
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      o._itemHeight = 0, o._measureItemHeight(), o._vStart = -1, o._vEnd = -1, o._windowed ? o._renderWindowed() : o._renderVirtual();
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const o = this._filteredData, p = o.length, y = this._itemHeight;
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
        const ht = this._buildItem(o[G]);
        ht && Y.appendChild(ht);
      }
      if (X > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = X + "px", Y.appendChild(G);
      }
      const V = A(this);
      this.tbody.replaceChildren(Y), h(V), this._selectable && this._updateSelectAll();
    } else {
      let Y = "";
      $ > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${$}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = U; G < z; G++)
        Y += o[G].html;
      X > 0 && (Y += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${X}px"></${this.isUl ? "li" : "div"}>`);
      const V = A(this);
      this.tbody.innerHTML = Y, h(V), this._selectable && this._restoreSelection();
    }
  }, l.prototype._buildPlaceholderItem = function() {
    const o = document.createElement(this.isUl ? "li" : "div");
    return o.className = "ln-list__placeholder", o.setAttribute("aria-hidden", "true"), o.style.height = this._itemHeight + "px", o;
  }, l.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const o = this._itemHeight;
    if (!o) return;
    const p = this._scrollContainer;
    let y, T;
    if (p) {
      const V = this.tbody.getBoundingClientRect(), G = p.getBoundingClientRect(), ht = p === this.tbody ? 0 : V.top - G.top + p.scrollTop;
      y = p.scrollTop - ht, T = p.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - G, T = window.innerHeight;
    }
    const g = this._readGridLayout(), E = g.columns, C = g.rowGap, k = o + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
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
    this.tbody.replaceChildren(X), h(Y), this._vStart = B, this._vEnd = U, this._cache.ensure(B, U);
  }, l.prototype._showEmptyState = function() {
    let o = null;
    if (this.isDataDriven) {
      const p = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && p > 0, g = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (o = Ct(this.dom, g, "ln-list"), !o) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", k = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          k && (o = document.importNode(k, !0));
        }
      }
    } else {
      const p = this.dom.querySelector(`template[${i}]`);
      if (p) {
        const y = p.content.firstElementChild;
        y && (o = document.importNode(y, !0));
      }
    }
    if (o)
      if (o.tagName === "LI" || o.tagName === "TR")
        this.tbody.replaceChildren(o);
      else {
        const p = document.createElement(this.isUl ? "li" : "div");
        p.appendChild(o), this.tbody.replaceChildren(p);
      }
    else
      this.tbody.replaceChildren();
    q(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, l.prototype._buildItem = function(o) {
    let p = Ct(this.dom, this.name + "-row", "ln-list");
    if (!p) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (p = document.importNode(T.content, !0));
    }
    let y = p ? p.querySelector("[data-ln-item]") || p.firstElementChild : null;
    if (y)
      jt(y, o), pt(y, o);
    else if (o && o.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = o.html, y = T.firstElementChild;
    } else if (y = document.createElement(this.isUl ? "li" : "div"), y.setAttribute("data-ln-item", ""), o && typeof o == "object") {
      for (const T in o)
        if (T !== "html" && o[T] != null) {
          const g = document.createElement("span");
          g.setAttribute("data-ln-field", T), g.textContent = String(o[T]), y.appendChild(g);
        }
    }
    if (y._lnRecord = o, o && o.id != null && (y.setAttribute("data-ln-item-id", o.id), this._selectable && this.selectedIds.has(String(o.id)))) {
      y.classList.add("ln-item-selected");
      const T = y.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return y;
  }, l.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-item]");
    for (let p = 0; p < o.length; p++) {
      const y = o[p].getAttribute("data-ln-item-id"), T = y != null && this.selectedIds.has(String(y));
      o[p].classList.toggle("ln-item-selected", T);
      const g = o[p].querySelector("[data-ln-item-select]");
      g && (g.checked = T);
    }
    this._updateSelectAll();
  }, l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const o = this;
    this._onSelectionChange = function(p) {
      const y = p.target.closest("[data-ln-item-select]");
      if (!y) return;
      const T = y.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id");
      g != null && (y.checked ? (o.selectedIds.add(String(g)), T.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(g)), T.classList.remove("ln-item-selected")), o._updateSelectAll(), o._updateFooter(), q(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = o._selectAllCheckbox.checked, y = o.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < y.length; T++) {
        const g = y[T], E = g.getAttribute("data-ln-item-id"), C = g.querySelector("[data-ln-item-select]");
        E != null && (p ? (o.selectedIds.add(String(E)), g.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(E)), g.classList.remove("ln-item-selected")), C && (C.checked = p));
      }
      q(o.dom, "ln-list:select-all", { list: o.name, selected: p }), q(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const o = this.tbody.querySelectorAll("[data-ln-item]");
    let p = o.length > 0;
    for (let y = 0; y < o.length; y++) {
      const T = o[y].getAttribute("data-ln-item-id");
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
    ln(this, "ln-list:request-data", "list");
  }, l.prototype._enterWindowedMode = function() {
    const o = this, p = this.dom, y = parseInt(p.getAttribute("data-ln-list-window"), 10), T = parseInt(p.getAttribute("data-ln-list-window-page"), 10), g = parseInt(p.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !o._windowed || !o._cache || (o.totalCount = o._cache.grandTotal, o.visibleCount = o._cache.logicalTotal, o._lastTotal = o._cache.grandTotal, o.isLoaded = !0, o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), q(p, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = An({
      windowSize: y > 0 ? y : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, k) {
        q(p, "ln-list:request-data", {
          list: o.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: C,
          limit: k,
          queryGen: o._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, l.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const o = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), p = o > 0 ? o : this._data.length;
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
    let o = 0, p = 0;
    this.isDataDriven ? (o = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount) : (o = this._data.length, p = this._filteredData.length);
    const y = p < o;
    if (this._totalSpan && (this._totalSpan.textContent = v(o, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = y ? v(p, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !y), this._selectedSpan) {
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
  function i(u) {
    const w = u[e];
    w && f.call(w);
  }
  const d = {
    "data-ln-circular-progress": { effect: i },
    "data-ln-circular-progress-max": { effect: i },
    "data-ln-circular-progress-label": { effect: i }
  }, b = "http://www.w3.org/2000/svg", m = 36, s = 16, a = 2 * Math.PI * s;
  function c(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, r.call(this), f.call(this), this;
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
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = qn(u, w || 100), S = a - v.percentage / 100 * a;
    this.progressCircle.setAttribute("stroke-dashoffset", S);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), h = A !== null ? A : Math.round(v.percentage) + "%";
    this.labelEl.textContent = h, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", h), q(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  j(t, e, c, "ln-circular-progress", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const d = {
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
    let a = s.target.closest("[" + i + "]"), c;
    if (a) {
      for (c = a; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
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
    const u = this, w = function(S) {
      u._handlePointerMove(S);
    }, v = function(S) {
      u._handlePointerEnd(S), a.removeEventListener("pointermove", w), a.removeEventListener("pointerup", v), a.removeEventListener("pointercancel", v);
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
    for (const u of c) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        r = u, f = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        r = u, f = "after";
        break;
      }
    }
    for (const u of c)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
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
    attributes: d
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", d = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const b = {
    "data-ln-picklist": { effect: a },
    "data-ln-picklist-max": { effect: c },
    "data-ln-picklist-list": {}
  };
  function m(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = s(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
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
      const u = this._initial[f];
      if (!u.isConnected) continue;
      const w = u.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || r < this.max ? (v = this.selected, r++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(u);
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
    const u = f.parentElement;
    if (u !== this.available && u !== this.selected) return;
    if (!this.isEnabled) {
      r.checked = !r.checked;
      return;
    }
    const w = r.checked ? this.selected : this.available;
    if (u === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      r.checked = !r.checked, q(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: f,
        checkbox: r,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: f, from: u, to: w, checkbox: r };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      r.checked = !r.checked;
      return;
    }
    const S = document.activeElement === r;
    w.appendChild(f), S && r.focus(), q(this.dom, "ln-picklist:move", v);
  };
  function s(n) {
    const r = n.getAttribute(d);
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
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", d = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function m(f, u, w) {
    return f.getAttribute(u) || w;
  }
  function s(f, u, w) {
    const v = parseFloat(f.getAttribute(u));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function a(f) {
    const u = document.createElement("span");
    return u.setAttribute(d, ""), u.setAttribute("role", "alert"), u.textContent = f, u;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", read: m, fallback: "Confirm?" },
    "data-ln-confirm-timeout": { prop: "timeout", read: s, fallback: 3 },
    "data-ln-confirm-state": { prop: "confirming", read: Kt }
  }, n = et(c);
  function r(f) {
    this.dom = f, tt(this, f, n), this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : f.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!cn(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, w.stopPropagation(), u._reset();
        }
    }, f.addEventListener("click", this._onClick), this;
  }
  r.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
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
    const f = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, u);
  }, r.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + d + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
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
  const i = {
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
  }, d = et(i), b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(s) {
    if (this.dom = s, tt(this, s, d), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = s.querySelector("[data-ln-translations-active]"), this.menuEl = s.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = b, this._localesRaw)
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
      f.setAttribute("data-ln-translations-lang", n), f.textContent = this.locales[n], f.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), s.menuEl.getAttribute("data-ln-toggle") === "open" && s.menuEl.setAttribute("data-ln-toggle", "close"), s.addLanguage(n));
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
      const f = n.querySelector("button"), u = s.locales[a] || a.toUpperCase();
      f.setAttribute("aria-label", s.removeLabel.replace("{lang}", u)), f.addEventListener("click", function(w) {
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
      const u = f.getAttribute("data-ln-translatable"), w = f.getAttribute("data-ln-translations-prefix") || "", v = f.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const S = v.cloneNode(v.tagName === "SELECT");
      w ? S.name = w + "[trans][" + s + "][" + u + "]" : S.name = "trans[" + s + "][" + u + "]", S.value = a[u] !== void 0 ? a[u] : "", S.removeAttribute("id"), "placeholder" in S && (S.placeholder = this.placeholderLabel.replace("{lang}", c)), S.setAttribute("data-ln-translatable-lang", s);
      const A = f.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), h = A.length > 0 ? A[A.length - 1] : v;
      h.parentNode.insertBefore(S, h.nextSibling);
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
    attributes: i
  });
})();
const ci = "ln-autosave:", di = 1e3;
function ui(t, e) {
  return e ? ci + (t || "") + ":" + e : null;
}
function hi(t, e = di) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", b = '[data-ln-autosave-exclude], input[type="password"]';
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
    const r = c.getAttribute(t) || c.id, f = ui(window.location.pathname, r);
    if (!f) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = f;
    let u = null;
    function w() {
      const h = un(c, { exclude: b });
      try {
        localStorage.setItem(f, JSON.stringify(h));
      } catch {
        return;
      }
      q(c, "ln-autosave:saved", { target: c, data: h });
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
      if (Z(c, "ln-autosave:before-restore", { target: c, data: _ }).defaultPrevented) return;
      const o = hn(c, _);
      for (let p = 0; p < o.length; p++)
        o[p].dispatchEvent(new Event("input", { bubbles: !0 })), o[p].dispatchEvent(new Event("change", { bubbles: !0 }));
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
    this._onFocusout = function(h) {
      const _ = h.target;
      s(_) && _.name && !_.matches(b) && w();
    }, this._onChange = function(h) {
      const _ = h.target;
      s(_) && _.name && !_.matches(b) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(h) {
      h.target.closest("[" + i + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = hi(c.getAttribute(d));
    return A > 0 && (this._onInput = function(h) {
      const _ = h.target;
      !s(_) || !_.name || _.matches(b) || (u !== null && clearTimeout(u), u = setTimeout(w, A));
    }, c.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
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
  const i = {
    "data-ln-autoresize": {}
  };
  function d(b) {
    if (b.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", b.tagName), this;
    this.dom = b;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, b.addEventListener("input", this._onInput), this._resize(), this;
  }
  d.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, d, "ln-autoresize", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-editor": {},
    "data-ln-editor-action": {},
    "data-ln-editor-source": {}
  }, d = {
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
  function c(h) {
    return !!(b[h] || m[h] || s[h] || h === "link");
  }
  function n(h) {
    this.dom = h;
    const _ = this;
    if (this._textarea = h.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", h), this;
    const l = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), l && this._surface.setAttribute("data-placeholder", l);
    const o = this._textarea.id;
    if (o) {
      const g = h.querySelector('label[for="' + o + '"]');
      g && (g.id || (g.id = o + "-label"), this._surface.setAttribute("aria-labelledby", g.id));
    }
    this._surface.id = o ? o + "-surface" : "ln-editor-surface-" + ++a;
    const p = this._textarea.value.trim();
    p && (this._surface.innerHTML = p);
    const y = h.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? h.insertBefore(this._surface, y.nextSibling) : h.appendChild(this._surface), y) {
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
      u(_, g);
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
    }, h.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        _._surface.innerHTML = _._textarea.value, q(h, "ln-editor:changed", {
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
      if (this._surface.focus(), b[h])
        document.execCommand(b[h], !1, null);
      else if (m[h]) {
        const l = m[h], o = r(this._surface);
        o && o.toLowerCase() === l ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + l + ">");
      } else s[h] ? document.execCommand(s[h], !1, null) : h === "link" ? A(this) : h === "unlink" ? document.execCommand("unlink", !1, null) : h === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const h = this.dom.querySelector('[role="toolbar"]');
    if (!h) return;
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const l = _.anchorNode;
    if (!l || !this._surface.contains(l)) return;
    const o = h.querySelectorAll("[data-ln-editor-action]");
    for (let p = 0; p < o.length; p++) {
      const y = o[p], T = y.getAttribute("data-ln-editor-action");
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
  }, n.prototype.setHTML = function(h) {
    this._surface && (this._surface.innerHTML = h, this._syncToTextarea(), q(this.dom, "ln-editor:changed", {
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
      const l = this.dom.querySelector(".ln-editor__link-popover");
      l && l.remove();
    }
    q(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function r(h) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return null;
    let l = _.anchorNode;
    if (!l) return null;
    for (; l && l !== h; ) {
      if (l.nodeType === 1) {
        const o = l.tagName;
        if (o === "H2" || o === "H3" || o === "H4" || o === "BLOCKQUOTE" || o === "PRE" || o === "P")
          return o;
      }
      l = l.parentNode;
    }
    return null;
  }
  function f(h, _, l) {
    for (; h && h !== l; ) {
      if (h.nodeType === 1 && h.tagName === _)
        return h;
      h = h.parentNode;
    }
    return null;
  }
  function u(h, _) {
    _.preventDefault();
    let l = "";
    if (_.clipboardData && (l = _.clipboardData.getData("text/html"), !l)) {
      const p = _.clipboardData.getData("text/plain");
      p && (l = p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), l = "<p>" + l + "</p>");
    }
    if (!l) return;
    const o = w(l);
    o && document.execCommand("insertHTML", !1, o);
  }
  function w(h) {
    const _ = document.createElement("div");
    return _.innerHTML = h, v(_), _.innerHTML;
  }
  function v(h) {
    const _ = Array.from(h.childNodes);
    for (let l = 0; l < _.length; l++) {
      const o = _[l];
      if (o.nodeType !== 3) {
        if (o.nodeType !== 1) {
          h.removeChild(o);
          continue;
        }
        if (d[o.tagName]) {
          const p = Array.from(o.attributes);
          for (let y = 0; y < p.length; y++) {
            const T = p[y].name;
            if (o.tagName === "A" && T === "href") {
              const g = o.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(g) || o.removeAttribute("href");
            } else
              o.removeAttribute(T);
          }
          o.tagName === "A" && o.setAttribute("rel", "noopener noreferrer"), v(o);
        } else {
          for (; o.firstChild; )
            h.insertBefore(o.firstChild, o);
          h.removeChild(o);
        }
      }
    }
  }
  function S(h, _) {
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
    l && (_.preventDefault(), h._execAction(l));
  }
  function A(h) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const l = f(_.anchorNode, "A", h._surface), o = _.getRangeAt(0).cloneRange();
    h._closeLinkPopover && h._closeLinkPopover();
    const p = Ct(h.dom, "ln-editor-link-popover", "ln-editor");
    if (!p) return;
    const y = p.firstElementChild;
    if (!y) return;
    const T = y.querySelector('input[type="url"]'), g = y.querySelector('[data-ln-editor-action="confirm-link"]'), E = y.querySelector('[data-ln-editor-action="cancel-link"]');
    l && (T.value = l.getAttribute("href") || "");
    const C = h.dom.querySelector('[role="toolbar"]');
    C ? C.after(y) : h.dom.insertBefore(y, h._surface), T.focus();
    function k() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(o);
    }
    function D() {
      document.removeEventListener("mousedown", P), h._closeLinkPopover = null, y.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), k(), h._surface.focus(), B)
        if (l)
          l.setAttribute("href", B), l.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea(), q(h.dom, "ln-editor:changed", {
            html: h._textarea.value,
            target: h.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = f(U.anchorNode, "A", h._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea());
          }
        }
      else l && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), k(), h._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const U = h.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !y.contains(B.target) && !U && O();
    }
    h._closeLinkPopover = D, g.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
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
  function i(b) {
    const m = {}, s = b.dataset;
    for (const a in s) {
      if (!a.startsWith("lnFill") || e[a]) continue;
      const c = a.slice(6);
      c && (m[c.charAt(0).toLowerCase() + c.slice(1)] = s[a]);
    }
    return m;
  }
  function d(b, m) {
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
    const n = i(m), r = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, r ? n : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const m = b.detail;
    if (!m) return;
    const s = b.target, a = m.id;
    if (a == null) {
      window.lnCore.lnFill(s, null);
      return;
    }
    const c = d(s, a);
    if (!c) return;
    const n = i(c);
    window.lnCore.lnFill(s, n);
  }), window[t] = !0;
})();
function fi(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", d = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${d}+`, "g"), i).replace(new RegExp(`^${d}+|${d}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", read: Q, fallback: "" }
  }, d = et(i);
  function b(m) {
    if (m.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", m.tagName), this;
    const s = m.form;
    if (!s)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", m), this;
    tt(this, m, d);
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
    this._mirroring = !0, this.dom.value = fi(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, b, "ln-slug", {
    attributes: i
  });
})();
function pi(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), d = t.getTime(), b = Math.floor((d - i) / 1e3), m = Math.abs(b);
  return m < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : m < 60 ? { value: b, unit: "second", isOlderThanMonth: !1 } : m < 3600 ? { value: Math.round(b / 60), unit: "minute", isOlderThanMonth: !1 } : m < 86400 ? { value: Math.round(b / 3600), unit: "hour", isOlderThanMonth: !1 } : m < 604800 ? { value: Math.round(b / 86400), unit: "day", isOlderThanMonth: !1 } : m < 2592e3 ? { value: Math.round(b / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(b / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Qt(t, e, i = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const d = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (d.year = "numeric"), d;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { effect: o },
    "data-ln-time-locale": { effect: o }
  }, d = {}, b = {};
  function m(y) {
    return y.getAttribute("data-ln-time-locale") || rt(y);
  }
  function s(y, T) {
    const g = (y || "") + "|" + JSON.stringify(T);
    return d[g] || (d[g] = new Intl.DateTimeFormat(y, T)), d[g];
  }
  function a(y) {
    const T = y || "";
    return b[T] || (b[T] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), b[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function r() {
    n || (n = setInterval(u, 6e4));
  }
  function f() {
    n && (clearInterval(n), n = null);
  }
  function u() {
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
    const g = qt(T), E = (T || "").toLowerCase().split("-")[0], C = s(T, Qt("full", y)), k = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (g && k !== E && g.monthsLong) {
      const D = g.monthsLong[y.getMonth()], I = y.getDate(), R = y.getFullYear(), O = String(y.getHours()).padStart(2, "0"), P = String(y.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(y);
  }
  function v(y, T) {
    const g = Qt("short", y), E = qt(T), C = (T || "").toLowerCase().split("-")[0], k = s(T, g), D = k.resolvedOptions().locale.toLowerCase().split("-")[0];
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
  function h(y, T) {
    const g = pi(y);
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
        k = h(g, C);
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
  function o(y) {
    const T = y[e];
    if (!T) return;
    y.getAttribute(t) === "relative" ? (c.add(T), r()) : (c.delete(T), c.size === 0 && f()), _(T);
  }
  function p(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && _(y[e]);
  }
  j(t, e, l, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: o,
    onInit: p
  });
})();
function mi(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const b = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, m = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let a = 0, c = 0, n = 0, r = !1, f = null;
  function u(S, A) {
    m.delete(S), m.set(S, A);
  }
  function w() {
    if (m.size <= e) return [];
    const S = [];
    for (; m.size > e; ) {
      const h = m.keys().next().value;
      S.push(m.get(h)), m.delete(h);
    }
    const A = new Set(m.values());
    return S.filter((h) => !A.has(h));
  }
  function v(S, A) {
    s.add(S), clearTimeout(f), f = setTimeout(() => b(S, i, A), d);
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
      return u(S, A), A;
    },
    ensure: (S, A, h) => {
      if (!r && !s.has(0)) return v(0, h);
      if (a <= 0) return;
      const _ = Math.max(0, S), l = Math.min(a, A);
      for (let o = _; o < l; o++)
        if (!m.has(o)) {
          const p = Math.floor(o / i) * i;
          if (!s.has(p)) return v(p, h);
        }
    },
    ingest: (S, A, h, _, l) => {
      if (l != null && l !== n) return [];
      r = !0, h != null && (c = h), _ != null && (a = _);
      for (let o = 0; o < A.length; o++)
        u(S + o, A[o]);
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
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (i = S.pageSize), S.fetchDebounce >= 0 && (d = S.fetchDebounce), A;
    }
  };
}
function gi(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: b } = e, m = b === "desc", s = t.map((c) => c ? c[d] : void 0), a = Ce(s);
  return [...t].sort((c, n) => {
    const r = c ? c[d] : void 0, f = n ? n[d] : void 0, u = Te(r, f, a, i);
    return m ? -u : u;
  });
}
function Gn(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return i.length ? t.filter((d) => d ? i.every((b) => xe(d[b], e[b])) : !1) : t;
}
function _i(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const d = xn(e);
  return d.length ? t.filter((b) => b ? d.every(
    (m) => i.some((s) => {
      const a = b[s];
      return a != null && In(String(a), [m]);
    })
  ) : !1) : t;
}
function bi(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const d = t.map((m) => m && m[e] != null ? parseFloat(m[e]) : NaN).filter((m) => Number.isFinite(m)), b = d.reduce((m, s) => m + s, 0);
  return i === "sum" ? b : i === "avg" && d.length ? b / d.length : 0;
}
function yi(t, e = {}, i = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const b = t.length;
  let m = t;
  e.filters && (m = Gn(m, e.filters)), e.search && (m = _i(m, e.search, i));
  const s = m.length;
  if (e.sort && (m = gi(m, e.sort, d)), e.offset || e.limit) {
    const a = e.offset || 0, c = e.limit || m.length;
    m = m.slice(a, a + c);
  }
  return { records: m, total: b, filtered: s };
}
function vi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const d = { ...i };
    for (const [b, m] of Object.entries(e))
      if (typeof m == "function")
        try {
          d[b] = m(i);
        } catch {
          d[b] = void 0;
        }
    return d;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(L, x, M) {
    const N = L.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const d = {
    "data-ln-data-store": { effect: Me },
    "data-ln-data-store-indexes": { effect: Me },
    "data-ln-data-store-stale": { prop: "_staleThreshold", read: i, fallback: 300 },
    "data-ln-data-store-search-fields": { prop: "_searchFields", read: ar },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", read: Kt },
    "data-ln-data-store-window": { prop: "_windowSize", read: It, fallback: 1e3, effect: or },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", read: It, fallback: 200, effect: sr },
    "data-ln-data-store-frozen": {}
  }, b = et(d), m = "ln_app_cache", s = "_meta", a = "1.0";
  let c = null, n = null;
  const r = {};
  function f(L) {
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
      const x = u(), M = Object.keys(x), N = indexedDB.open(m);
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
          for (const Tt of M)
            if (!at.objectStoreNames.contains(Tt)) {
              const Ot = at.createObjectStore(Tt, { keyPath: "id" });
              for (const ce of x[Tt].indexes)
                Ot.createIndex(ce, ce, { unique: !1 });
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
    const x = { ...L }, M = x.id, N = await Tr(x);
    return !N || !N.encrypted ? L : {
      ...N,
      id: M
    };
  }
  async function h(L) {
    return !L || !L.encrypted || !At() ? L : Lr(L, { silent: !0 });
  }
  const _ = (L, x) => S().then((M) => M ? M.transaction(L, x).objectStore(L) : null);
  function l(L) {
    return new Promise((x, M) => {
      L.onsuccess = () => x(L.result), L.onerror = () => {
        f(L.error), M(L.error);
      };
    });
  }
  const o = (L) => _(L, "readonly").then((x) => x ? l(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => h(M))) : x), p = (L, x) => _(L, "readonly").then((M) => M ? l(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? l(M.get(Number(x))) : typeof x == "number" ? l(M.get(String(x))) : null) : null).then((M) => M ? h(M) : null), y = (L, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(L, "readonly").objectStore(L), H = x.map((K) => l(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? l(F.get(Number(K))) : typeof K == "number" ? l(F.get(String(K))) : null));
    return Promise.all(H).then((K) => At() ? Promise.all(K.map((W) => W ? h(W) : null)) : K);
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
    return this.dom = L, this._name = L.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", L), tt(this, L, b), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, L.hasAttribute("data-ln-data-store-window") ? this._windowIndex = mi({
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
  function Yn(L) {
    return L ? Object.keys(L).filter((x) => Array.isArray(L[x]) && L[x].length > 0) : [];
  }
  function Xn(L, x, M) {
    return x.every((N) => M[N].map(String).includes(String(L[N])));
  }
  function Jn(L) {
    return String(L || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Zn(L, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const H = L[F];
        return H != null && String(H).toLowerCase().includes(N);
      })
    );
  }
  function tr(L, x, M) {
    return bi(L, x, M);
  }
  function Rt(L, x) {
    return vi(x, L.presenters && L.presenters.computed);
  }
  function er(L) {
    return !L.sort && !At();
  }
  function nr(L, x, M) {
    const N = Yn(x.filters), F = x.search ? Jn(x.search) : [], H = L._searchFields, K = F.length > 0 && H && H.length > 0;
    return _(L._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ft = [], at = W.openCursor();
      at.onsuccess = () => {
        const Tt = at.result;
        if (!Tt || ft.length >= M) {
          J(ft);
          return;
        }
        const Ot = Tt.value;
        (!N.length || Xn(Ot, N, x.filters)) && (!K || Zn(Ot, F, H)) && ft.push(Ot), Tt.continue();
      }, at.onerror = () => nt(at.error);
    }) : []);
  }
  function Re(L, x, M) {
    return yi(x, M, L._searchFields, ae);
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
        const F = M + N, H = (K) => K.length ? {
          data: Rt(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Oe(x, M, N);
        return er(L) ? nr(x, L, F).then((K) => H(K.slice(M, F))) : o(x._name).then((K) => H(Re(x, K, L).records));
      }
      return Oe(x, M, N);
    }
    return o(x._name).then((M) => {
      const N = Re(x, M, L);
      return {
        data: Rt(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(L) {
    return p(this._name, L).then((x) => x ? Rt(this, [x])[0] : null);
  }, I.prototype.count = function(L) {
    return L && Object.keys(L).length > 0 ? o(this._name).then((M) => Gn(M, L).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(L, x) {
    return o(this._name).then((M) => tr(M, L, x));
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
    delete r[this._name], delete this.dom[e], q(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function rr() {
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
  const ir = "data-ln-data-store-frozen";
  function Me(L, x) {
    L.setAttribute(ir, x);
  }
  function or(L) {
    const x = L[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ht(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function sr(L) {
    const x = L[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: d
  }), window[e].clearAll = rr, window[e].init = window[e], window[e].setStorageKey = Ue, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ue);
})();
const wi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Lt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const d = String(e);
    return i === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Ei(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, wi);
  if (e && typeof e == "object")
    for (const b in e)
      e[b] !== void 0 && e[b] !== null && e[b] !== "" && (i[b] = e[b]);
  const d = new URLSearchParams();
  return t.search && d.append(i.search, t.search), t.offset != null && d.append(i.offset, t.offset), t.limit != null && d.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(i.sortField, t.sort.field), d.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((b) => {
    const m = t.filters[b];
    Array.isArray(m) && m.length > 0 && d.append(b, m.join(","));
  }), d.toString();
}
function Ai(t, e, i) {
  let d = Lt(t, e);
  return i && (d += (d.indexOf("?") !== -1 ? "&" : "?") + i), d;
}
function en(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(n) {
    const r = n[e];
    r && r.refreshConfig();
  }
  const b = {
    "data-ln-api-connector": {},
    "data-ln-api-base-url": { prop: "baseUrl", read: Q, fallback: "", effect: d },
    "data-ln-api-path": { prop: "path", read: Q, fallback: "", effect: d },
    "data-ln-api-headers": { prop: "rawHeaders", read: Q, fallback: null, effect: d },
    "data-ln-api-param-offset": { effect: d },
    "data-ln-api-param-limit": { effect: d },
    "data-ln-api-param-search": { effect: d },
    "data-ln-api-param-sort-field": { effect: d },
    "data-ln-api-param-sort-dir": { effect: d },
    "data-ln-api-connector-query-debounce": { effect: d }
  }, m = et(b);
  function s(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((r) => {
      const f = new Error("HTTP " + n.status + ": " + n.statusText);
      throw f.status = n.status, f.data = r, f;
    });
  }
  function a(n) {
    return this.dom = n, tt(this, n, m), n[e] = this, n[i] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  a.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = vn(this.rawHeaders);
    const r = {}, f = n.getAttribute("data-ln-api-param-offset");
    f && (r.offset = f);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (r.limit = u);
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
    let u = Lt(f.baseUrl, f.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = r || "sync";
    f._inflight.has(w) && f._inflight.get(w).abort();
    const v = new AbortController();
    return f._inflight.set(w, v), window.fetch(u, {
      method: "GET",
      headers: f._reqHeaders(),
      credentials: f.credentials,
      signal: v.signal
    }).then(s).finally(function() {
      f._inflight.get(w) === v && f._inflight.delete(w);
    });
  }, a.prototype.query = function(n, r) {
    const f = this, u = Ei(n, f.paramKeys), w = Ai(f.baseUrl, f.path, u), v = r || "query";
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
    const u = this;
    return window.fetch(Lt(u.baseUrl, r || u.path), {
      method: "POST",
      headers: u._reqHeaders(f),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(s);
  }, a.prototype.update = function(n, r, f, u, w) {
    const v = this;
    f != null && (r = Object.assign({}, r, { expected_version: f }));
    const S = u ? Lt(v.baseUrl, u) : Lt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(r)
    }).then(s);
  }, a.prototype.delete = function(n, r, f) {
    const u = this;
    return window.fetch(Lt(u.baseUrl, r || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(f),
      credentials: u.credentials
    }).then(s);
  }, a.prototype.bulkDelete = function(n, r, f) {
    const u = this;
    return window.fetch(Lt(u.baseUrl, r || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(f),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(s);
  };
  function c(n) {
    n._handlers = {
      sync: function(r) {
        const f = r.detail || {}, u = f.meta && f.meta.targetEl ? f.meta.targetEl : null;
        n.fetchDelta(f.since, u).then(function(w) {
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
        const f = r.detail || {}, u = f.query || f, w = f.meta && f.meta.targetEl ? f.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(_, l, o) {
          n.query(l, o).then(function(p) {
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
          A(f, u, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const h = setTimeout(function() {
          n._queryTimers.delete(v), A(f, u, w);
        }, S);
        n._queryTimers.set(v, h);
      },
      cancel: function(r) {
        const f = r.detail || {}, u = f.meta && f.meta.targetEl ? f.meta.targetEl : f.targetEl || f.key;
        u && n.cancel(u);
      },
      create: function(r) {
        const f = r.detail || {};
        n.create(f.data, f.url, f.idempotencyKey).then(function(u) {
          const w = en(u);
          q(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: f.tempId,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: f.tempId,
            meta: f.meta || null
          });
        });
      },
      update: function(r) {
        const f = r.detail || {};
        n.update(f.id, f.data, f.expected_version, f.url, f.idempotencyKey).then(function(u) {
          const w = en(u);
          q(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: f.id,
            message: w.message,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
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
      delete: function(r) {
        const f = r.detail || {};
        n.delete(f.id, f.url, f.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          q(n.dom, "ln-api-connector:deleted", {
            response: u,
            id: f.id,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: f.id,
            meta: f.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const f = r.detail || {};
        n.bulkDelete(f.ids, f.url, f.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          q(n.dom, "ln-api-connector:bulk-deleted", {
            response: u,
            ids: f.ids,
            message: w,
            meta: f.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
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
    n._inflight && (n._inflight.forEach(function(r) {
      r.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(r) {
      r && clearTimeout(r);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), q(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[i];
  }, j(t, e, a, "ln-api-connector", {
    attributes: b
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const b = {
    "data-ln-couchdb-connector": {},
    "data-ln-couchdb-url": { prop: "url", read: Q, fallback: "", effect: d },
    "data-ln-couchdb-db": { prop: "db", read: Q, fallback: "", effect: d },
    "data-ln-couchdb-auth": { prop: "auth", read: Q, fallback: "", effect: d },
    "data-ln-couchdb-headers": { effect: d }
  }, m = et(b);
  function s(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function a(v) {
    return this.dom = v, tt(this, v, m), v[e] = this, v[i] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  a.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const S = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = vn(S, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), q(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function c(v, S, A) {
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
      const l = _.results || [];
      return {
        data: l.filter((o) => !o.deleted && o.doc).map((o) => Object.assign({}, o.doc, { id: o.doc._id })),
        deleted: l.filter((o) => o.deleted).map((o) => o.id),
        synced_at: _.last_seq || v || ""
      };
    });
  };
  function n(v, S, A) {
    const h = Object.assign({ _id: S.id }, S);
    return h._id || delete h._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: c(v, A),
      credentials: v.credentials,
      body: JSON.stringify(h)
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const l = s(_), o = l.content;
      return { record: Object.assign({}, h, { id: o.id, _id: o.id, _rev: o.rev }), message: l.message };
    });
  }
  a.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function r(v, S, A, h) {
    const _ = Object.assign({ id: String(S), _id: String(S) }, A), l = _._rev || _.rev;
    return (l ? Promise.resolve(l) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Mt(v.headers, v.auth), credentials: v.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((y) => y._rev);
    })).then((p) => {
      const y = Object.assign({}, _, { _rev: p });
      delete y.rev;
      const T = c(v, h, { "If-Match": p });
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
    return r(this, v, S, A).then((h) => h.record);
  };
  function f(v, S, A, h) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Mt(v.headers, v.auth), credentials: v.credentials }).then((l) => {
      if (!l.ok) throw new Error("Could not retrieve document for revision delete");
      return l.json().then((o) => o._rev);
    })).then((l) => {
      const o = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(l);
      return window.fetch(o, { method: "DELETE", headers: c(v, h), credentials: v.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      }).then((p) => {
        const y = s(p);
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
      const l = (h.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return l.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: l })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const p = s(o);
        return { response: { ok: !0, results: p.content, deletedCount: l.length }, message: p.message };
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
          q(v.dom, "ln-couchdb-connector:fetched", { data: _, since: h.since, meta: h.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
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
          q(v.dom, "ln-couchdb-connector:created", { record: _.record, tempId: h.tempId, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
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
        h.expected_version !== void 0 && (_._rev = h.expected_version), r(v, h.id, _, h.idempotencyKey).then(function(l) {
          q(v.dom, "ln-couchdb-connector:updated", { record: l.record, id: h.id, message: l.message, meta: h.meta || null });
        }).catch(function(l) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: l.message,
            status: l.status || 0,
            id: h.id,
            data: l.status === 409 ? l.data : null,
            conflictData: l.status === 409 ? l.data : null,
            meta: h.meta || null
          });
        });
      },
      delete: function(A) {
        const h = A.detail || {};
        f(v, h.id, h.rev, h.idempotencyKey).then(function(_) {
          q(v.dom, "ln-couchdb-connector:deleted", { response: _.response, id: h.id, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
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
          q(v.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: h.ids, message: _.message, meta: h.meta || null });
        }).catch(function(_) {
          q(v.dom, "ln-couchdb-connector:error", {
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
    }), v._handlers = null), q(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[i];
  }, j(t, e, a, "ln-couchdb-connector", {
    attributes: b
  });
})();
function Si(t) {
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
  const i = !t || !!t.initializationError, d = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || d) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function $t(t, e, i) {
  return i === "store" && !!e && !(t && t.windowed);
}
function nn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class Ci {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((i, d) => {
      this._pending.set(e, { resolve: i, reject: d });
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
    for (const d of this._pending.values()) d.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const d = e && e.requestId;
    if (!d) return !1;
    const b = this._pending.get(d);
    return b ? (this._pending.delete(d), i ? b.reject(e.error || new Error("Store mutation failed")) : b.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope", d = "data-ln-data-coordinator-search", b = "data-ln-data-coordinator-filters", m = "data-ln-data-coordinator-sort-field", s = "data-ln-data-coordinator-sort-direction";
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
  }, f = et(r), u = /* @__PURE__ */ new Set();
  let w = !1, v = null, S = null, A = null;
  function h() {
    w || (w = !0, v = function() {
      q(document, "ln-data-coordinator:online", {}), u.forEach(function(g) {
        g._maybeSync();
      });
    }, S = function() {
      q(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && u.forEach(function(g) {
        const E = g.findChildren(), C = E.store;
        C && E.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !g._noAutosync && (!C.hasCache || g._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", S), document.addEventListener("visibilitychange", A));
  }
  function _() {
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
  const o = ["ln-api-connector", "ln-couchdb-connector"];
  function p(g) {
    return g ? g.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : g.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function y(g) {
    const E = this;
    return this.dom = g, tt(this, g, f), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", g), g[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Ci(), this._dict = re(g, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), h(), this._checkInitialSync(), this;
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
        const k = C.hasAttribute(i) ? C.getAttribute(i) : null;
        if (k === null) return;
        let D;
        if (k ? D = g._owns(k) : D = C.closest("[data-ln-data-coordinator]") === g.dom, !D) return;
        const I = gr(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = un(C);
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
        C !== (g.dom.getAttribute(d) || "") && g.dom.setAttribute(d, C);
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
    }, g.dom.addEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.addEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.addEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.addEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.addEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.addEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.addEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.addEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.addEventListener("ln-data-store:initialized", g._handlers.storeInitialized), document.addEventListener("submit", g._handlers.formSubmit), o.forEach(function(E) {
      g.dom.addEventListener(E + ":fetched", g._handlers.connFetched), g.dom.addEventListener(E + ":created", g._handlers.connCreated), g.dom.addEventListener(E + ":updated", g._handlers.connUpdated), g.dom.addEventListener(E + ":deleted", g._handlers.connDeleted), g.dom.addEventListener(E + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.addEventListener(E + ":error", g._handlers.connError);
    }), document.addEventListener("ln-table:request-data", g._handlers.reqTableData), document.addEventListener("ln-list:request-data", g._handlers.reqListData), document.addEventListener("ln-chart:request-data", g._handlers.reqChartData), document.addEventListener("ln-options:request-data", g._handlers.reqOptions), document.addEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.addEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.addEventListener("ln-data-store:created", g._handlers.refresh), g.dom.addEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.addEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.addEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.addEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.addEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.addEventListener("ln-search:change", g._handlers.searchChange), g.dom.addEventListener("ln-filter:change", g._handlers.filterChange), g.dom.addEventListener("ln-sort:change", g._handlers.sortChange);
  }
  y.prototype._owns = function(g) {
    return !!g && g === this._name;
  }, y.prototype._currentQuery = function() {
    const g = this.dom.getAttribute(m), E = this.dom.getAttribute(s), C = new URLSearchParams(this.dom.getAttribute(b) || ""), k = {};
    for (const D of new Set(C.keys())) k[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(d) || "",
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
    const I = g.detail || {}, R = Si(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Ft(B, O.connector), $ = nn(R, P._currentQuery());
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
      const O = Ft(D, k.connector);
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
      const P = k && Object.keys(k).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), U = B ? "remote" : Ft(I, D.connector);
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
        const U = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = nn(U, C._currentQuery());
        if (Ft(B, P.connector) === "remote") {
          const Y = C._nextQueryGen(I);
          q(I, "ln-" + O + ":set-loading", { loading: !0 }), q(P.connectorEl, p(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
          });
          continue;
        }
        const $ = $t(B, P.connector, Ft(B, P.connector)), X = $ ? C._nextQueryGen(I) : null;
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
    g._handlers && (g.dom.removeEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.removeEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.removeEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.removeEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.removeEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.removeEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.removeEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.removeEventListener("ln-data-store:initialized", g._handlers.storeInitialized), document.removeEventListener("submit", g._handlers.formSubmit), o.forEach(function(E) {
      g.dom.removeEventListener(E + ":fetched", g._handlers.connFetched), g.dom.removeEventListener(E + ":created", g._handlers.connCreated), g.dom.removeEventListener(E + ":updated", g._handlers.connUpdated), g.dom.removeEventListener(E + ":deleted", g._handlers.connDeleted), g.dom.removeEventListener(E + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.removeEventListener(E + ":error", g._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", g._handlers.reqTableData), document.removeEventListener("ln-list:request-data", g._handlers.reqListData), document.removeEventListener("ln-chart:request-data", g._handlers.reqChartData), document.removeEventListener("ln-options:request-data", g._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.removeEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:created", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.removeEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.removeEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.removeEventListener("ln-search:change", g._handlers.searchChange), g.dom.removeEventListener("ln-filter:change", g._handlers.filterChange), g.dom.removeEventListener("ln-sort:change", g._handlers.sortChange), g._handlers = null), g._boundQueries = null, g._boundDelivered = null, g._queryGens = null, g._queueQueryRefresh = null, g._mutationReceipts.close(new Error("Data coordinator destroyed")), g._mutationReceipts = null, u.delete(this), _(), delete this.dom[e];
  }, j(t, e, y, "ln-data-coordinator", {
    attributes: r
  });
})();
const Ti = "ln_api_queue", Li = 2, it = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function kt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function rn(t) {
  return "seq:" + t;
}
function Yt(t) {
  return "paused:" + t;
}
function on(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function qi(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function ki(t, e, i, d) {
  const b = /* @__PURE__ */ new Map(), m = [], s = [];
  for (const a of t || [])
    b.has(a.chainKey) || b.set(a.chainKey, []), b.get(a.chainKey).push(a);
  return b.forEach((a, c) => {
    a.sort((r, f) => r.seq - f.seq);
    const n = a[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > d) {
        s.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > d) {
        s.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = d + i, n.updatedAt = d, m.push(n);
    }
  }), { entries: m, wakeups: s };
}
function xi(t, e, i, d, b) {
  const m = [], s = [];
  for (const a of t || []) {
    if (a.entryId === e) {
      s.push(a.entryId);
      continue;
    }
    a.chainKey === i && (a.chainKey = d, a.targetId === i && (a.targetId = d), a.meta && a.meta.id === i && (a.meta.id = d), a.meta && typeof a.meta.action == "string" && (a.meta.action = qi(a.meta.action, i, d)), a.updatedAt = b, m.push(a));
  }
  return { changed: m, deleted: s };
}
class Ii {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || Ti, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const d = this.indexedDB.open(this.dbName, Li);
      d.onupgradeneeded = (b) => {
        const m = b.target.result;
        let s;
        m.objectStoreNames.contains(it) ? s = b.target.transaction.objectStore(it) : s = m.createObjectStore(it, { keyPath: "entryId" }), s.indexNames.contains("by_scope_chain") || s.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), s.indexNames.contains("by_scope_seq") || s.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(lt) || m.createObjectStore(lt, { keyPath: "key" });
      }, d.onerror = () => i(ut(d, "Queue database open failed")), d.onsuccess = (b) => {
        this._db = b.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const d = this.indexedDB.deleteDatabase(this.dbName);
      d.onsuccess = () => e(), d.onerror = () => i(ut(d, "Queue database delete failed")), d.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((d, b) => {
      const s = i.transaction(it, "readonly").objectStore(it).index("by_scope_seq").getAll(kt(this.keyRange, e));
      s.onsuccess = () => d(s.result || []), s.onerror = () => b(ut(s, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((d) => d ? new Promise((b, m) => {
      const s = d.transaction([lt, it], "readwrite"), a = s.objectStore(lt), c = s.objectStore(it), n = rn(e);
      let r = null;
      const f = (w) => {
        const v = w + 1;
        r = {
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
        }, a.put({ key: n, value: v }), c.put(r);
      }, u = a.get(n);
      u.onerror = () => m(ut(u, "Queue sequence read failed")), u.onsuccess = () => {
        const w = u.result;
        if (w && typeof w.value == "number") {
          f(w.value);
          return;
        }
        const v = c.index("by_scope_seq").getAll(kt(this.keyRange, e));
        v.onerror = () => m(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const S = (v.result || []).reduce((A, h) => Math.max(A, h.seq || 0), 0);
          f(S);
        };
      }, s.oncomplete = () => b(r), s.onerror = () => m(s.error || new Error("Queue enqueue transaction failed")), s.onabort = () => m(s.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, d) {
    return this.open().then((b) => b ? new Promise((m, s) => {
      const a = b.transaction(it, "readwrite"), c = a.objectStore(it), n = c.index("by_scope_seq").getAll(kt(this.keyRange, e)), r = this.now();
      let f = { entries: [], wakeups: [] };
      n.onerror = () => s(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        f = ki(n.result || [], i, d, r);
        for (const u of f.entries) c.put(u);
      }, a.oncomplete = () => m(f), a.onerror = () => s(a.error || new Error("Queue claim transaction failed")), a.onabort = () => s(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (d, b) => (b.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, i, d, b) {
    b = b || {};
    const m = b.maxAttempts || 8, s = b.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((c, n) => {
      const r = a.transaction([it, lt], "readwrite"), f = r.objectStore(it), u = r.objectStore(lt), w = f.get(i);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (d === "drop") {
            f.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (on(S), S.updatedAt = this.now(), d === "auth") {
            S.status = "pending", f.put(S), u.put({ key: Yt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (d === "retry") {
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
  remap(e, i, d) {
    return this._remapTransaction(e, null, i, d);
  }
  resolveCreate(e, i, d, b) {
    return this._remapTransaction(e, i, d, b);
  }
  _remapTransaction(e, i, d, b) {
    return this.open().then((m) => m ? new Promise((s, a) => {
      const c = m.transaction(it, "readwrite"), n = c.objectStore(it), r = n.index("by_scope_seq").getAll(kt(this.keyRange, e));
      let f = { changed: [], deleted: [] };
      r.onerror = () => a(ut(r, "Queue remap read failed")), r.onsuccess = () => {
        f = xi(r.result || [], i, d, b, this.now());
        for (const u of f.deleted) n.delete(u);
        for (const u of f.changed) n.put(u);
      }, c.oncomplete = () => s(f.changed), c.onerror = () => a(c.error || new Error("Queue remap transaction failed")), c.onabort = () => a(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((d, b) => {
      const m = i.transaction(it, "readwrite"), s = m.objectStore(it), a = s.index("by_scope_seq").getAll(kt(this.keyRange, e));
      let c = 0;
      a.onerror = () => b(ut(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const n of a.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), on(n), s.put(n), c++);
      }, m.oncomplete = () => d(c), m.onerror = () => b(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => b(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((d, b) => {
      const s = i.transaction(lt, "readonly").objectStore(lt).get(Yt(e));
      s.onsuccess = () => {
        const a = s.result ? s.result.value : !1;
        d(a || !1);
      }, s.onerror = () => b(ut(s, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((d) => {
      if (d)
        return new Promise((b, m) => {
          const s = d.transaction(lt, "readwrite"), a = typeof i == "string" ? i : i ? "manual" : !1;
          s.objectStore(lt).put({ key: Yt(e), value: a }), s.oncomplete = () => b(), s.onerror = () => m(s.error || new Error("Queue pause-state write failed")), s.onabort = () => m(s.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((d, b) => {
          const m = i.transaction([it, lt], "readwrite"), a = m.objectStore(it).index("by_scope_seq").openCursor(kt(this.keyRange, e));
          a.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, a.onerror = () => b(ut(a, "Queue clear failed")), m.objectStore(lt).delete(rn(e)), m.objectStore(lt).delete(Yt(e)), m.oncomplete = () => d(), m.onerror = () => b(m.error || new Error("Queue clear transaction failed")), m.onabort = () => b(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, d) {
    return this.open().then((b) => b ? new Promise((m, s) => {
      const a = b.transaction(it, "readwrite"), c = a.objectStore(it), n = c.get(i);
      let r = null;
      n.onerror = () => s(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const f = n.result;
        !f || f.scope !== e || (r = d(f, c));
      }, a.oncomplete = () => m(r), a.onerror = () => s(a.error || new Error("Queue entry transaction failed")), a.onabort = () => s(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, b = 6e4;
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
        const u = Math.random() * 16 | 0;
        return (f === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const c = new Ii({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: a
  });
  function n(r) {
    this.dom = r, r[e] = this;
    const f = r.closest("[data-ln-data-coordinator]");
    this.scope = r.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = a(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
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
    const r = this.dom.getAttribute("data-ln-api-queue-online");
    return r === "true" ? !0 : r === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const r = this;
    return c.allForScope(r.scope).then((f) => (q(r.dom, "ln-api-queue:pending-count", { count: f.length, scope: r.scope }), f.length === 0 && q(r.dom, "ln-api-queue:drained", { scope: r.scope }), f));
  }, n.prototype._clearTimer = function(r) {
    const f = this._timers.get(r);
    f && (clearTimeout(f), this._timers.delete(r));
  }, n.prototype._scheduleTimer = function(r, f) {
    const u = Math.max(0, f), w = this._timers.get(r);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(r), v._drain();
    }, u);
    this._timers.set(r, S);
  }, n.prototype._drain = function() {
    const r = this;
    return r._paused || !r._isOnline() ? Promise.resolve() : (r._drainPromise || (r._drainPromise = c.claimReady(r.scope, r._workerId, b).then((f) => {
      for (const u of f.wakeups)
        r._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of f.entries)
        r._clearTimer(u.chainKey), q(r.dom, "ln-api-queue:send", {
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
      console.error("[ln-api-queue] Drain failed:", f), q(r.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      r._drainPromise = null;
    })), r._drainPromise);
  }, n.prototype._onEnqueue = function(r) {
    const f = this;
    return c.enqueue(f.scope, r.detail || {}).then((u) => {
      if (u)
        return f._emitPendingCount().then((w) => (q(f.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), f._drain()));
    }).catch((u) => {
      q(f.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(r) {
    const f = this, u = r.detail || {};
    return c.ack(f.scope, u.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      q(f.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(r) {
    const f = this, u = r.detail || {};
    return c.nack(f.scope, u.entryId, u.reason, {
      maxAttempts: d,
      backoff: i
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
      q(f.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onRemap = function(r) {
    const f = this, u = r.detail || {};
    return c.remap(f.scope, u.oldKey, u.newId).catch((w) => {
      q(f.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(r) {
    const f = this, u = r.detail || {};
    return c.resolveCreate(f.scope, u.entryId, u.oldKey, u.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((w) => {
      q(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
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
function Qn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function xt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Di(t, e, i) {
  const d = Qn(t);
  return d === null || d < 0 ? 0 : Math.min(d, Math.min(e, i) / 2);
}
function Ri(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Oi(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Mi(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", b = e.yField || "value", m = e.includeZero !== !1, s = Di(e.padding, i.width, i.height), a = Array.isArray(t) ? t : [], c = [];
  for (let o = 0; o < a.length; o++) {
    const p = a[o] || {}, y = Qn(p[b]);
    y !== null && c.push({
      record: p,
      sourceIndex: o,
      label: p[d] == null ? String(o + 1) : String(p[d]),
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
      baselineY: i.y + i.height - s
    };
  let n = c[0].value, r = c[0].value;
  for (let o = 1; o < c.length; o++)
    c[o].value < n && (n = c[o].value), c[o].value > r && (r = c[o].value);
  let f = n, u = r;
  m && (f = Math.min(0, f), u = Math.max(0, u)), f === u && (u === 0 ? u = 1 : u > 0 ? f = 0 : u = 0);
  const w = Math.max(1, i.width - s * 2), v = Math.max(1, i.height - s * 2), S = u - f, A = i.y + i.height - s - (0 - f) / S * v, h = [];
  for (let o = 0; o < c.length; o++) {
    const p = c[o], y = c.length === 1 ? 0.5 : o / (c.length - 1), T = i.x + s + y * w, g = i.y + i.height - s - (p.value - f) / S * v;
    h.push({
      record: p.record,
      sourceIndex: p.sourceIndex,
      label: p.label,
      value: p.value,
      x: T,
      y: g,
      pointString: xt(T) + "," + xt(g)
    });
  }
  const _ = h.map((o) => o.pointString).join(" ");
  let l = "";
  if (h.length > 0) {
    const o = h[0], p = h[h.length - 1], y = xt(o.x) + "," + xt(A), T = xt(p.x) + "," + xt(A);
    l = y + " " + _ + " " + T;
  }
  return {
    points: h,
    linePoints: _,
    areaPoints: l,
    count: h.length,
    min: n,
    max: r,
    domainMin: f,
    domainMax: u,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function d(n) {
    const r = n[e];
    r && r.requestData();
  }
  function b(n) {
    const r = n[e];
    r && r._render();
  }
  const m = {
    "data-ln-chart": { prop: "name", read: Q, fallback: "", effect: b },
    "data-ln-chart-source": { effect: d },
    "data-ln-chart-sort": { effect: d },
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
      const u = f.detail || {};
      r._data = Array.isArray(u.data) ? u.data : [], r.isLoaded = !0, r._setLoading(!1), r._render();
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
      viewBox: this.plot && Ri(this.plot.getAttribute("viewBox")) || i
    };
  }, c.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, c.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const r = this.name + "-label", f = '[data-ln-template="' + r + '"]';
    if (!this.dom.querySelector(f) && !document.querySelector(f)) return;
    const u = Ct(this.dom, r, "ln-chart");
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
    const n = this._readOptions(), r = Mi(this._data, n);
    this.model = r, this.line && (this.line.setAttribute("points", r.linePoints), this.line.toggleAttribute("hidden", r.count === 0)), this.area && (this.area.setAttribute("points", r.areaPoints), this.area.toggleAttribute("hidden", r.count === 0 || n.type !== "area"));
    const f = r.count === 0;
    this.dom.classList.toggle("ln-chart--empty", f), this.empty && this.empty.toggleAttribute("hidden", !f);
    const u = rt(this.dom);
    a(this.minimum, ct(r.min, u)), a(this.maximum, ct(r.max, u)), a(this.count, ct(r.count, u)), this._renderLabels(r), q(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: r.count,
      min: r.min,
      max: r.max
    });
  }, c.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, q(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Oi(this.dom.getAttribute("data-ln-chart-sort")),
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
  const i = {
    "data-ln-options": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-options-value": { prop: "_valueField", read: Q, fallback: "id" },
    "data-ln-options-label": { prop: "_labelField", read: Q, fallback: "name" }
  }, d = et(i);
  function b(m) {
    this.dom = m, tt(this, m, d);
    const s = this;
    return this._onSetData = function(a) {
      s._rebuild(a.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), q(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(m) {
    const s = this.dom, a = this._valueField, c = this._labelField, n = s.value, r = s.querySelectorAll("option");
    for (let u = r.length - 1; u >= 0; u--)
      r[u].value !== "" && s.removeChild(r[u]);
    for (let u = 0; u < m.length; u++) {
      const w = m[u], v = document.createElement("option");
      v.value = String(w[a]), v.textContent = w[c] != null ? w[c] : "", s.appendChild(v);
    }
    const f = s.options;
    for (let u = 0; u < f.length; u++)
      if (f[u].value === n) {
        s.value = n;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, b, "ln-options", {
    attributes: i
  });
})();
function Ni(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!i) return null;
  const b = {};
  return b[i] = [d], b;
}
function Fi(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-stat-filter": { prop: "_filterRaw", read: Q, fallback: "" }
  }, d = et(i);
  function b(m) {
    return this.dom = m, tt(this, m, d), this._onSetCount = function(s) {
      m.textContent = Fi(s.detail && s.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), q(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Ni(this._filterRaw)
    }), this;
  }
  b.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, b, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", d = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
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
  function u() {
    return m || (m = document.getElementById(t), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = t, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function w(_) {
    return _.indexOf(i) === 0 ? a + "/" + _.slice(i.length) + ".svg" : s + "/" + _.slice(e.length) + ".svg";
  }
  function v(_, l) {
    const o = l.match(/viewBox="([^"]+)"/), p = o ? o[1] : "0 0 24 24", y = l.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = y ? y[1].trim() : "", g = l.match(/<svg([^>]*)>/i), E = g ? g[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = _, C.setAttribute("viewBox", p), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const D = E.match(new RegExp(k + '="([^"]*)"'));
      D && C.setAttribute(k, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function S(_) {
    if (d.has(_) || b.has(_)) return;
    if (_.indexOf(i) === 0 && !a) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const l = _.slice(1);
    try {
      const p = localStorage.getItem(c + l);
      if (p) {
        v(l, p), d.add(_);
        return;
      }
    } catch {
    }
    b.add(_);
    const o = w(_);
    fetch(o).then(function(p) {
      if (!p.ok) throw new Error(p.status);
      return p.text();
    }).then(function(p) {
      v(l, p), d.add(_), b.delete(_);
      try {
        localStorage.setItem(c + l, p);
      } catch {
      }
    }).catch(function(p) {
      console.error("[ln-icon] Fetch failed for:", l, p), b.delete(_);
    });
  }
  function A(_) {
    const l = 'use[href^="' + e + '"], use[href^="' + i + '"]', o = _.querySelectorAll ? _.querySelectorAll(l) : [];
    if (_.matches && _.matches(l)) {
      const p = _.getAttribute("href");
      p && S(p);
    }
    Array.prototype.forEach.call(o, function(p) {
      const y = p.getAttribute("href");
      y && S(y);
    });
  }
  function h() {
    A(document), new MutationObserver(function(_) {
      _.forEach(function(l) {
        if (l.type === "childList")
          l.addedNodes.forEach(function(o) {
            o.nodeType === 1 && A(o);
          });
        else if (l.type === "attributes" && l.attributeName === "href") {
          const o = l.target.getAttribute("href");
          o && (o.indexOf(e) === 0 || o.indexOf(i) === 0) && S(o);
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
function Pi(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let d = 0; d <= e.length; d++) i[d] = [d];
  for (let d = 0; d <= t.length; d++) i[0][d] = d;
  for (let d = 1; d <= e.length; d++)
    for (let b = 1; b <= t.length; b++)
      e.charAt(d - 1) === t.charAt(b - 1) ? i[d][b] = i[d - 1][b - 1] : i[d][b] = Math.min(
        i[d - 1][b - 1] + 1,
        i[d][b - 1] + 1,
        i[d - 1][b] + 1
      );
  return i[e.length][t.length];
}
function Bi(t, e = De) {
  if (e.has(t)) return null;
  let i = null, d = 1 / 0;
  for (const m of e) {
    const s = Pi(t, m);
    s < d && (d = s, i = m);
  }
  const b = Math.max(3, Math.floor(t.length * 0.4));
  return d <= b ? i : null;
}
function $n(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Hi(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], b = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            d.push({
              type: "id-empty",
              element: s,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + $n(n)) || d.push({
            type: "id-unresolved",
            element: s,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${s.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return d;
}
function Ui(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], b = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const r = (c.value || "").trim();
          if (!r) {
            d.push({
              type: "store-empty",
              element: s,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const f = $n(r), u = e.querySelector(`[data-ln-data-store="${f}"], [data-ln-store="${f}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(r);
          !u && !w && d.push({
            type: "store-unresolved",
            element: s,
            attribute: c.name,
            storeName: r,
            message: `[ln-debug] Unresolved store reference: <${s.tagName.toLowerCase()} ${c.name}="${r}"> targets store "${r}", but no [data-ln-data-store="${r}"] exists in the document.`
          });
        }
      }
  }
  return d;
}
function zi(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], d = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && d.unshift(e);
  const b = /* @__PURE__ */ new Map();
  for (let m = 0; m < d.length; m++) {
    const s = d[m], a = (s.getAttribute("data-ln-data-store") || "").trim();
    a && (b.has(a) || b.set(a, []), b.get(a).push(s));
  }
  for (const [m, s] of b.entries())
    s.length > 1 && i.push({
      type: "store-duplicate",
      storeName: m,
      elements: s,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${m}". Store names must be unique across the document.`
    });
  return i;
}
function Ki(t = document, e = De) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], b = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < b.length; m++) {
    const s = b[m];
    if (s.attributes)
      for (let a = 0; a < s.attributes.length; a++) {
        const c = s.attributes[a];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = Bi(c.name, e), r = n ? ` Did you mean "${n}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: s,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${s.tagName.toLowerCase()}>.${r}`
          });
        }
      }
  }
  return d;
}
function Ae(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || De, d = Hi(t), b = Ui(t), m = zi(t), s = Ki(t, i), a = [
    ...d,
    ...b,
    ...m,
    ...s
  ];
  if (!e.silent)
    for (let c = 0; c < a.length; c++)
      console.warn(a[c].message);
  return {
    idIssues: d,
    storeIssues: b,
    uniquenessIssues: m,
    spellingIssues: s,
    total: a.length
  };
}
let Pt = null;
function Xt(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Pt && (clearTimeout(Pt), Pt = null);
  function d() {
    Pt = setTimeout(() => {
      Pt = null;
      const b = Ae(t);
      i && i(b);
    }, e);
  }
  pn() > 0 ? mt(d) : d();
}
function sn(t, e, i, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let Dt = [];
function ji() {
  Dt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Dt.push(document.body);
}
function Vi(t) {
  for (let e = 0; e < Dt.length; e++)
    if (Dt[e].contains(t)) return !0;
  return !1;
}
function Wi(t, e, i, d) {
  if (i === window || i === document) {
    Dt.indexOf(document.body) !== -1 && sn(t, e, i, d);
    return;
  }
  Vi(i) && sn(t, e, i, d);
}
function Se() {
  ji(), dr(Dt.length > 0 ? Wi : null);
}
function an() {
  Se();
}
function Gi() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Se(), Vt(["data-ln-debug"], Se);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": {}
  };
  Gi();
  function d(m) {
    return this.dom = m, Xt(m.ownerDocument || document), an(), this;
  }
  d.prototype.verify = function(m, s) {
    return Ae(m || (this.dom ? this.dom.ownerDocument || this.dom : document), s);
  }, d.prototype.destroy = function() {
    delete this.dom[e], an();
  };
  const b = j(t, e, d, "ln-debug", {
    attributes: i,
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
