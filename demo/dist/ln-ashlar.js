function ge(t) {
  let e = !1;
  for (let l = 0; l < t.length; l++) {
    const f = t[l];
    if (!(f === "" || f == null) && (e = !0, !Number.isFinite(Number(f))))
      return "string";
  }
  return e ? "number" : "string";
}
function _e(t, e, l, f) {
  if (l === "number") {
    const s = parseFloat(t), n = parseFloat(e);
    return (isNaN(s) ? 0 : s) - (isNaN(n) ? 0 : n);
  }
  const o = t != null ? String(t) : "", p = e != null ? String(e) : "";
  return f ? f.compare(o, p) : o < p ? -1 : o > p ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const ne = {};
function jt(t, e) {
  ne[t] || (ne[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const l = ne[t];
  return l ? l.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Kn(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function jn(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, l) {
  const f = l || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, f), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: f
  }));
}
function W(t, e, l) {
  const f = l || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, f);
  const o = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: f
  });
  return t.dispatchEvent(o), o;
}
function Ge(t, e, l) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const f = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  f[l] = t.name, L(t.dom, e, f);
}
function ot(t, e) {
  if (!t || !e) return t;
  const l = t.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < l.length; s++) {
    const n = l[s], c = n.getAttribute("data-ln-field");
    e[c] != null && (n.textContent = e[c]);
  }
  const f = t.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < f.length; s++) {
    const n = f[s], c = n.getAttribute("data-ln-attr").split(",");
    for (let d = 0; d < c.length; d++) {
      const y = c[d].trim().split(":");
      if (y.length !== 2) continue;
      const g = y[0].trim(), m = y[1].trim();
      e[m] != null && n.setAttribute(g, e[m]);
    }
  }
  const o = t.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < o.length; s++) {
    const n = o[s], c = n.getAttribute("data-ln-show");
    c in e && n.classList.toggle("hidden", !e[c]);
  }
  const p = t.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < p.length; s++) {
    const n = p[s], c = n.getAttribute("data-ln-class").split(",");
    for (let d = 0; d < c.length; d++) {
      const y = c[d].trim().split(":");
      if (y.length !== 2) continue;
      const g = y[0].trim(), m = y[1].trim();
      m in e && n.classList.toggle(g, !!e[m]);
    }
  }
  return t;
}
function Vn(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const l = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let f = 0; f < l.length; f++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", l[f], e ?? null), l[f].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ot(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let l = 0; l < e.length; l++)
        e[l].textContent = "";
    }
})));
function Ot(t, e) {
  if (!t || !e) return t;
  const l = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; l.nextNode(); ) {
    const p = l.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(s, n) {
        return e[n] !== void 0 ? e[n] : "";
      }
    ));
  }
  const f = function(p, s) {
    return e[s] !== void 0 ? e[s] : "";
  }, o = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && o.push(t);
  for (let p = 0; p < o.length; p++) {
    const s = o[p], n = s.attributes;
    for (let c = 0; c < n.length; c++) {
      const d = n[c];
      d.value.indexOf("{{") !== -1 && s.setAttribute(d.name, d.value.replace(/\{\{\s*(\w+)\s*\}\}/g, f));
    }
  }
  return t;
}
function Wn(t, e, l, f, o, p) {
  const s = {};
  for (let c = 0; c < t.children.length; c++) {
    const d = t.children[c], y = d.getAttribute("data-ln-render-key");
    y && (s[y] = d);
  }
  const n = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const d = e[c], y = String(f(d));
    let g = s[y];
    if (g)
      o(g, d, c);
    else {
      const m = jt(l, p);
      if (!m || (Ot(m, d), g = m.firstElementChild, !g)) continue;
      g.setAttribute("data-ln-render-key", y), o(g, d, c);
    }
    n.appendChild(g);
  }
  t.textContent = "", t.appendChild(n);
}
function at(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      at(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function gt(t, e, l) {
  if (t) {
    const f = t.querySelector('[data-ln-template="' + e + '"]');
    if (f) return f.content.cloneNode(!0);
  }
  return jt(e, l);
}
function $t(t, e) {
  const l = {}, f = t.querySelectorAll("[" + e + "]");
  for (let o = 0; o < f.length; o++)
    l[f[o].getAttribute(e)] = f[o].textContent, f[o].remove();
  return l;
}
function se(t, e, l, f) {
  if (t.nodeType !== 1) return;
  const p = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", s = Array.from(t.querySelectorAll(p));
  t.matches && t.matches(p) && s.push(t);
  for (const n of s)
    n[l] || (window.lnCore._persistSink && n.hasAttribute("data-ln-persist") && window.lnCore._persistSink(n, e), n[l] = new f(n));
}
function It(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Qe(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Gn(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function $e(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Qn(t, e) {
  return !t || !document.contains(t) || $e(t) || e && typeof t[e] != "function" ? !1 : It(t);
}
function $n(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Ye(t, e) {
  const l = !!(e && e.typed), f = e && e.exclude, o = {}, p = t.elements, s = {};
  if (l)
    for (let n = 0; n < p.length; n++) {
      const c = p[n];
      c.name && c.type === "checkbox" && !c.disabled && (s[c.name] = (s[c.name] || 0) + 1);
    }
  for (let n = 0; n < p.length; n++) {
    const c = p[n];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(f && c.matches && c.matches(f)))
      if (c.type === "checkbox")
        l && s[c.name] === 1 ? o[c.name] = c.checked : (o[c.name] || (o[c.name] = []), c.checked && o[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (o[c.name] = c.value);
      else if (c.type === "select-multiple") {
        o[c.name] = [];
        for (let d = 0; d < c.options.length; d++)
          c.options[d].selected && o[c.name].push(c.options[d].value);
      } else if (l && c.type === "hidden")
        o[c.name] = c.value;
      else if (l && (c.type === "number" || c.type === "range")) {
        const d = Number(c.value);
        o[c.name] = c.value === "" || isNaN(d) ? null : d;
      } else
        o[c.name] = c.value;
  }
  return o;
}
function Yn(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function Xe(t, e) {
  const l = t.elements, f = [], o = {};
  for (let p = 0; p < l.length; p++) {
    const s = l[p];
    s.name && s.type === "checkbox" && (o[s.name] = (o[s.name] || 0) + 1);
  }
  for (let p = 0; p < l.length; p++) {
    const s = l[p];
    if (s.type === "file" || s.type === "submit" || s.type === "button") continue;
    const n = s.getAttribute("data-ln-fill-as") || s.name;
    if (!n || !(n in e)) continue;
    const c = e[n];
    if (s.type === "checkbox") {
      if (Array.isArray(c))
        s.checked = c.indexOf(s.value) !== -1;
      else if (o[s.name] > 1) {
        const d = String(c).split(",").map(function(y) {
          return y.trim();
        });
        s.checked = d.indexOf(s.value) !== -1;
      } else
        s.checked = Yn(c);
      f.push(s);
    } else if (s.type === "radio")
      s.checked = s.value === String(c), f.push(s);
    else if (s.type === "select-multiple") {
      if (Array.isArray(c))
        for (let d = 0; d < s.options.length; d++)
          s.options[d].selected = c.indexOf(s.options[d].value) !== -1;
      f.push(s);
    } else
      s.value = c, f.push(s);
  }
  return f;
}
const Le = {
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
function G(t) {
  const e = t ? t.closest("[lang]") : null, l = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!l) return "en-US";
  const f = l.trim().toLowerCase();
  return f.indexOf("-") === -1 && Le[f] ? Le[f] : l;
}
function Yt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, at(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function Et(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function Je(t, e, { get: l, set: f }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return l ? l.call(this) : e.get.call(this);
    },
    set: function(o) {
      f ? f.call(this, o, (p) => e.set.call(this, p)) : e.set.call(this, o);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Xn() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function ie() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Ze() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function st(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function tn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] }, window.lnCore._attrRegistry;
}
function en(t) {
  const e = tn(), l = t.observed || [];
  for (let f = 0; f < l.length; f++) {
    const o = l[f];
    e.byAttr.has(o) || e.byAttr.set(o, []), e.byAttr.get(o).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t), t.persist && e.persist.push(t);
}
function Jn(t) {
  const e = t.target, l = t.attributeName;
  if (t.oldValue === e.getAttribute(l)) return;
  const f = tn(), o = f.byAttr.get(l);
  if (window.lnCore._debugSink && (l.indexOf("data-ln-") === 0 || o) && window.lnCore._debugSink("attr", l, e, { oldValue: t.oldValue, newValue: e.getAttribute(l) }), l.indexOf("data-ln-") === 0)
    for (let p = 0; p < f.reactive.length; p++) {
      const s = f.reactive[p];
      if (!e[s.attribute]) continue;
      const n = s.effects && s.effects[l];
      n ? n(e, l, t.oldValue) : s.onAttrChange && s.onAttrChange(e, l, t.oldValue);
    }
  if (o)
    for (let p = 0; p < o.length; p++) {
      const s = o[p];
      if (s.handler) {
        s.handler(e, l, t.oldValue);
        continue;
      }
      s.onAttributeChange && e[s.attribute] ? s.onAttributeChange(e, l) : (se(e, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(e));
    }
}
function nn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, at(function() {
    new MutationObserver(function(e) {
      for (let l = 0; l < e.length; l++)
        Jn(e[l]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Mt(t, e) {
  en({ observed: t, handler: e }), nn();
}
function U(t, e, l, f, o = {}) {
  const p = o.extraAttributes || [], s = o.onAttributeChange || null, n = o.onSubtreeChange || null, c = o.onInit || null, d = o.onAttrChange || null, y = o.effects || null, g = o.persist || null;
  function m(r) {
    const h = r || document.body;
    se(h, t, e, l), c && c(h);
  }
  const b = [];
  if (t.indexOf("[") !== -1) {
    const r = /\[([\w-]+)/g;
    let h;
    for (; (h = r.exec(t)) !== null; )
      b.push(h[1]);
  } else
    b.push(t);
  en({
    selector: t,
    attribute: e,
    ComponentFn: l,
    onInit: c,
    observed: b.concat(p),
    onAttributeChange: s,
    onAttrChange: d,
    effects: y,
    persist: g
  }), nn(), at(function() {
    new MutationObserver(function(h) {
      for (let u = 0; u < h.length; u++) {
        const _ = h[u];
        if (_.type === "childList") {
          if (n && _.target) {
            const a = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", v = _.target.nodeType === 1 ? _.target.matches(a) ? _.target : _.target.closest(a) : _.target.parentElement ? _.target.parentElement.closest(a) : null;
            v && n(v, _);
          }
          for (let E = 0; E < _.addedNodes.length; E++) {
            const a = _.addedNodes[E];
            a.nodeType === 1 && (se(a, t, e, l), c && c(a));
          }
          for (let E = 0; E < _.removedNodes.length; E++) {
            const a = _.removedNodes[E];
            if (a.nodeType === 1) {
              const w = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", A = Array.from(a.querySelectorAll(w));
              a.matches && a.matches(w) && A.push(a);
              for (let C = 0; C < A.length; C++) {
                const T = A[C];
                if (!document.contains(T)) {
                  const x = T[e];
                  x && typeof x.destroy == "function" && x.destroy();
                }
              }
            }
          }
        }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, f || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[e] = m;
  function i() {
    Ze() > 0 ? st(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i(), m;
}
function rn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const l = e.getAttribute("href");
  return !(!l || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || l.startsWith("mailto:") || l.startsWith("tel:") || l === "#" || l.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function ht(...t) {
  return t.filter((e) => e != null && e !== "").map((e, l) => l === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Tt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function on(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (l) {
    return console.error(`[${e}] Invalid headers JSON:`, l), {};
  }
}
const sn = {};
function Zn(t, e) {
  sn[t] = e;
}
function ti(t) {
  return sn[t] || { ingress: (e) => e, egress: (e) => e };
}
const an = {};
function be(t, e) {
  if (!t || typeof e != "object") return;
  const l = t.toLowerCase().split("-")[0];
  an[l] = e;
}
function yt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return an[e] || null;
}
be("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Zn, window.lnCore.getDataMapper = ti, window.lnCore.registerLocaleFallback = be, window.lnCore.getLocaleFallback = yt, window.lnCore.fillTemplate = Ot, window.lnCore.fill = ot, window.lnCore.lnFill = Vn, window.lnCore.renderList = Wn, window.lnCore.ensureLocaleObserver = Yt);
function Xt(t, e) {
  let l = !1;
  return function() {
    l || (l = !0, queueMicrotask(function() {
      l = !1, t();
    }));
  };
}
function ln(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, l = t.pageSize > 0 ? t.pageSize : 200, f = t.threshold != null ? t.threshold : 25, o = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, s = typeof t.onChange == "function" ? t.onChange : function() {
  }, n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let y = 0, g = 0, m = 0, b = { sort: null, filters: {}, search: "" }, i = null, r = 0, h = 0, u = !1;
  function _(w) {
    c.set(w, ++r);
  }
  function E() {
    return !!(b && (b.search || b.filters && Object.keys(b.filters).length));
  }
  function a() {
    if (n.size <= e) return;
    const w = Array.from(n.keys()).sort(function(C, T) {
      return (c.get(C) || 0) - (c.get(T) || 0);
    });
    let A = 0;
    for (; n.size > e && A < w.length; )
      n.delete(w[A]), c.delete(w[A]), A++;
  }
  function v(w, A) {
    d.add(w), p(b, w, A);
  }
  return {
    get: function(w) {
      return n.get(w);
    },
    has: function(w) {
      return n.has(w);
    },
    peek: function() {
      return n.size ? n.values().next().value : void 0;
    },
    get logicalTotal() {
      return y;
    },
    get grandTotal() {
      return g;
    },
    get queryGen() {
      return m;
    },
    get size() {
      return n.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, A) {
      clearTimeout(i), h = w;
      for (let M = w; M < A; M++)
        n.has(M) && _(M);
      if (y <= 0) return;
      const C = Math.max(0, w - f), T = Math.min(y, A + f), x = Math.floor(C / l), D = Math.floor(Math.max(0, T - 1) / l);
      let R = -1;
      for (let M = x; M <= D; M++) {
        const P = M * l, N = Math.min(l, y - P);
        let B = !1;
        const H = Math.max(P, C), z = Math.min(P + N, T);
        for (let Q = H; Q < z; Q++)
          if (!n.has(Q)) {
            B = !0;
            break;
          }
        if (B && !d.has(P)) {
          R = P;
          break;
        }
      }
      R !== -1 && (i = setTimeout(function() {
        v(R, l);
      }, o));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== m) return !1;
      const A = w.offset || 0, C = w.data || [];
      let T = 0;
      for (let x = 0; x < C.length; x++)
        C[x] != null && T++;
      if (T === 0 && (w.provisional || w.filtered > 0))
        return d.delete(A), !1;
      u && (n.clear(), c.clear(), u = !1), w.provisional || (g = w.total != null ? w.total : g, y = w.filtered != null ? w.filtered : w.data ? w.data.length : y);
      for (let x = 0; x < C.length; x++)
        C[x] != null && (n.set(A + x, C[x]), _(A + x));
      return d.delete(A), a(), s(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (b = w), v(0, l);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      m++, d.clear(), clearTimeout(i), w && (b = w), u = !0, v(0, l);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      m++, d.clear(), clearTimeout(i), u = !0;
      const w = Math.max(0, Math.floor(h / l) * l);
      v(w, l);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      d.delete(w);
    },
    destroy: function() {
      clearTimeout(i), n.clear(), c.clear(), d.clear();
    },
    configure: function(w) {
      w = w || {};
      let A = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== e) {
        const C = w.windowSize < e;
        e = w.windowSize, C && a(), A = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (l = w.pageSize), w.threshold != null && w.threshold >= 0 && (f = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (o = w.fetchDebounce), A && s();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (g = w, E() || (y = w), s());
    }
  };
}
function cn(t) {
  return (t || "").replace(/^#/, "");
}
function Jt(t) {
  const e = t === void 0 ? location.hash : t, l = {}, f = cn(e);
  if (!f) return l;
  const o = f.split("&");
  for (let p = 0; p < o.length; p++) {
    const s = o[p];
    if (!s) continue;
    const n = s.indexOf(":"), c = n > -1 ? s.slice(0, n) : s, d = n > -1 ? s.slice(n + 1) : "";
    if (c)
      try {
        l[c] = decodeURIComponent(d);
      } catch {
        l[c] = d;
      }
  }
  return l;
}
function X(t) {
  if (!t) return null;
  const e = Jt();
  return t in e ? e[t] : null;
}
function nt(t, e) {
  if (!t) return;
  const l = Jt();
  e == null ? delete l[t] : l[t] = String(e);
  const o = Object.keys(l).map(function(p) {
    const s = l[p];
    return s === "" ? p : p + ":" + encodeURIComponent(s);
  }).join("&");
  cn(location.hash) !== o && (location.hash = o);
}
function ye(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function dt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const l = t.getAttribute("data-ln-hash");
  if (l && l.trim() !== "") return l.trim();
  const f = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return f ? e ? f + "-" + e : f : e || null;
}
function dn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ae(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function un(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function le(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const l = t.slice(0, e), f = t.slice(e + 1), o = f ? f.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: l, values: o };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Jt, window.lnCore.hashGet = X, window.lnCore.hashSet = nt, window.lnCore.hashLinkClick = ye, window.lnCore.resolveHashNamespace = dt, window.lnCore.hashSortEncode = dn, window.lnCore.hashSortDecode = ae, window.lnCore.hashFilterEncode = un, window.lnCore.hashFilterDecode = le);
function Vt(t, e, l, f) {
  const o = typeof f == "number" ? f : 4, p = window.innerWidth, s = window.innerHeight, n = e.width, c = e.height, d = (l || "bottom").split("-"), y = d[0], g = d[1] === "start" || d[1] === "end" ? d[1] : "center", m = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, b = m[y] || m.bottom;
  function i(E) {
    return E === "top" || E === "bottom" ? g === "start" ? t.left : g === "end" ? t.right - n : t.left + (t.width - n) / 2 : g === "start" ? t.top : g === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function r(E) {
    let a, v, w = !0;
    return E === "top" ? (a = t.top - o - c, v = i(E), a < 0 && (w = !1)) : E === "bottom" ? (a = t.bottom + o, v = i(E), a + c > s && (w = !1)) : E === "left" ? (a = i(E), v = t.left - o - n, v < 0 && (w = !1)) : (a = i(E), v = t.right + o, v + n > p && (w = !1)), { top: a, left: v, side: E, fits: w };
  }
  let h = null;
  for (let E = 0; E < b.length; E++) {
    const a = r(b[E]);
    if (a.fits) {
      h = a;
      break;
    }
  }
  h || (h = r(b[0]));
  let u = h.top, _ = h.left;
  return n >= p ? _ = 0 : (_ < 0 && (_ = 0), _ + n > p && (_ = p - n)), c >= s ? u = 0 : (u < 0 && (u = 0), u + c > s && (u = s - c)), { top: u, left: _, placement: h.side };
}
function ce(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, l = e.visibility, f = e.display, o = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const p = t.offsetWidth, s = t.offsetHeight;
  return e.visibility = l, e.display = f, e.position = o, { width: p, height: s };
}
let mt = null;
async function Te(t) {
  if (!t) {
    mt = null;
    return;
  }
  try {
    const e = new TextEncoder(), l = await crypto.subtle.digest("SHA-256", e.encode(t));
    mt = await crypto.subtle.importKey(
      "raw",
      l,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    console.error("[ln-core/crypto] Key derivation failed:", e), mt = null;
  }
}
function ft() {
  return mt;
}
async function ei(t, e = mt) {
  const l = e || mt;
  if (!l || t === void 0 || t === null) return t;
  try {
    const f = new TextEncoder(), o = crypto.getRandomValues(new Uint8Array(12)), p = typeof t == "string" ? t : JSON.stringify(t), s = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: o },
      l,
      f.encode(p)
    ), n = btoa(String.fromCharCode(...o)), c = btoa(String.fromCharCode(...new Uint8Array(s)));
    return {
      encrypted: !0,
      iv: n,
      data: c
    };
  } catch (f) {
    return console.error("[ln-core/crypto] Encryption failed:", f), t;
  }
}
async function ni(t, e = mt) {
  const l = e || mt;
  if (!t || !t.encrypted || !l) return t;
  try {
    const f = new TextDecoder(), o = Uint8Array.from(atob(t.iv), (c) => c.charCodeAt(0)), p = Uint8Array.from(atob(t.data), (c) => c.charCodeAt(0)), s = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: o },
      l,
      p
    ), n = f.decode(s);
    try {
      return JSON.parse(n);
    } catch {
      return n;
    }
  } catch (f) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", f), { ...t, decryptionError: !0 };
  }
}
function hn(t, e = 100, l = 0) {
  const f = parseFloat(String(t)) || 0, o = parseFloat(String(e)) || 100, p = parseFloat(String(l)) || 0, s = Math.max(p, Math.min(f, o)), n = o - p;
  let c = 0;
  return n > 0 && (c = (s - p) / n * 100), c = Math.max(0, Math.min(100, c)), {
    value: f,
    min: p,
    max: o,
    clampedValue: s,
    percentage: c
  };
}
function J(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const l = e < 1e11 ? e * 1e3 : e, f = new Date(l);
    return isNaN(f.getTime()) ? null : f;
  }
  if (typeof t == "string") {
    const l = t.trim();
    if (!l) return null;
    const f = new Date(l);
    return isNaN(f.getTime()) ? null : f;
  }
  return null;
}
function qt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), l = String(t.getMonth() + 1).padStart(2, "0"), f = String(t.getDate()).padStart(2, "0");
  return e + "-" + l + "-" + f;
}
const ct = {};
function Wt(t) {
  const e = t || "default";
  if (!ct[e]) {
    const l = new Intl.NumberFormat(t, { useGrouping: !0 }), f = l.formatToParts(1234.5);
    let o = "", p = ".";
    for (let s = 0; s < f.length; s++)
      f[s].type === "group" && (o = f[s].value), f[s].type === "decimal" && (p = f[s].value);
    ct[e] = { groupSep: o, decimalSep: p, fmt: l };
  }
  return ct[e];
}
function fn(t, e, l) {
  if (t == null || typeof t != "string") return "";
  let f = t.trim();
  return f === "" ? "" : (f = f.replace(/[$€£¥]/g, ""), e && (f = f.split(e).join("")), f = f.replace(/\s/g, ""), l && l !== "." && (f = f.replace(l, ".")), f = f.replace(/[^\d.-]/g, ""), f);
}
function ii(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const l = t.trim();
  if (l === "" || l === "-") return NaN;
  const f = Wt(e), o = fn(l, f.groupSep, f.decimalSep);
  if (o === "" || o === "-") return NaN;
  const p = parseFloat(o);
  return isNaN(p) ? NaN : p;
}
function et(t, e, l = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const f = e || "default", o = l.maxDecimals != null ? parseInt(l.maxDecimals, 10) : null, p = l.userDecimals != null ? l.userDecimals : null;
  if (o !== null) {
    const s = f + "|max:" + o;
    return ct[s] || (ct[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: o
    })), ct[s].format(t);
  }
  if (p !== null && p > 0) {
    const s = f + "|exact:" + p;
    return ct[s] || (ct[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: p,
      maximumFractionDigits: p
    })), ct[s].format(t);
  }
  return Wt(e).fmt.format(t);
}
function de(t) {
  return String(t || "").trim().toLowerCase();
}
function pn(t) {
  const e = de(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ri(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((l) => l.trim()).filter(Boolean);
  return e.length ? e : null;
}
function mn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const l = String(t).toLowerCase();
  for (let f = 0; f < e.length; f++)
    if (l.indexOf(e[f]) === -1) return !1;
  return !0;
}
function oi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function ve(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const l = String(t).trim().toLowerCase();
  for (let f = 0; f < e.length; f++)
    if (String(e[f]).trim().toLowerCase() === l)
      return !0;
  return !1;
}
function qe(t, e, l) {
  const f = parseInt(t.getAttribute(e), 10);
  return isNaN(f) ? l : f;
}
function si(t, e) {
  return t.hasAttribute(e);
}
function ai(t, e) {
  return (t.getAttribute(e) || "").split(",").map((l) => l.trim()).filter(Boolean);
}
function li(t, e, l) {
  for (const f in l) {
    const [o, p, s] = l[f];
    Object.defineProperty(t, f, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return o(e, p, s);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function ci(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function di(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function ui(t, e) {
  return (e || "GET") + " " + (t || "");
}
function hi(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  function f(s, n) {
    n = n || {};
    const c = ci(s), d = di(s, n), y = ui(c, d);
    hi(d) && e.has(y) && (e.get(y).abort(), e.delete(y));
    const g = new AbortController(), m = n.signal;
    let b = null;
    m && (m.aborted ? g.abort(m.reason) : (b = function() {
      g.abort(m.reason);
    }, m.addEventListener("abort", b, { once: !0 })));
    const i = Object.assign({}, n, { signal: g.signal });
    return e.set(y, g), t(s, i).finally(function() {
      m && b && m.removeEventListener("abort", b), e.get(y) === g && e.delete(y);
    });
  }
  f.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = f;
  function o(s) {
    if (!s.detail || !s.detail.url) return;
    const n = s.target, c = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), d = s.detail.key;
    d && l.has(d) && (l.get(d).abort(), l.delete(d));
    const y = new AbortController(), g = s.detail.signal;
    let m = null;
    g && (g.aborted ? y.abort(g.reason) : (m = function() {
      y.abort(g.reason);
    }, g.addEventListener("abort", m, { once: !0 }))), d && l.set(d, y);
    const b = { method: c, signal: y.signal };
    s.detail.body !== void 0 && (b.body = s.detail.body), window.fetch(s.detail.url, b).then(function(i) {
      g && m && g.removeEventListener("abort", m), d && l.get(d) === y && l.delete(d), L(n, "ln-http:response", {
        ok: i.ok,
        status: i.status,
        response: i
      });
    }).catch(function(i) {
      g && m && g.removeEventListener("abort", m), d && l.get(d) === y && l.delete(d), !(i && i.name === "AbortError") && L(n, "ln-http:error", {
        ok: !1,
        status: 0,
        error: i
      });
    });
  }
  function p(s) {
    const n = s.detail || {};
    n.all ? window.lnHttp.cancelAll() : n.key ? window.lnHttp.cancelByKey(n.key) : n.url && window.lnHttp.cancel(n.url);
  }
  document.addEventListener("ln-http:request", o), document.addEventListener("ln-http:cancel", p), window.lnHttp = {
    cancel: function(s) {
      let n = !1;
      return e.forEach(function(c, d) {
        d.endsWith(" " + s) && (c.abort(), e.delete(d), n = !0);
      }), n;
    },
    cancelByKey: function(s) {
      return l.has(s) ? (l.get(s).abort(), l.delete(s), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(s) {
        s.abort();
      }), e.clear(), l.forEach(function(s) {
        s.abort();
      }), l.clear();
    },
    get inflight() {
      const s = [];
      return e.forEach(function(n, c) {
        const d = c.indexOf(" ");
        s.push({ method: c.slice(0, d), url: c.slice(d + 1) });
      }), l.forEach(function(n, c) {
        s.push({ key: c });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", o), document.removeEventListener("ln-http:cancel", p), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const l = /* @__PURE__ */ new Map();
  function f(o) {
    if (this.dom = o, this.url = o.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Xn(), this._held = !0;
    const p = this, s = this.url;
    let n = l.get(s);
    return n || (n = fetch(s).then(function(c) {
      if (!c.ok)
        throw new Error("HTTP error! status: " + c.status);
      return c.text();
    }).catch(function(c) {
      throw l.delete(s), c;
    }), l.set(s, n)), n.then(function(c) {
      if (p._destroyed) return;
      const d = document.createElement("template");
      d.innerHTML = c, p.dom.content.appendChild(d.content), L(p.dom, "ln-include:loaded", { target: p.dom, url: p.url }), p._held && (p._held = !1, ie());
    }).catch(function(c) {
      p._destroyed || (console.error("[ln-include] Failed to fetch template from " + p.url + ":", c), L(p.dom, "ln-include:error", { target: p.dom, url: p.url, error: c }), p._held && (p._held = !1, ie()));
    }), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ie()), delete this.dom[e]);
  }, U(t, e, f, "ln-include");
})();
(function() {
  const t = "data-ln-form", e = "lnForm", l = "data-ln-form-action-edit", f = "data-ln-form-action-method";
  if (window[e] !== void 0) return;
  function o(p) {
    this.dom = p, this._baseAction = p.getAttribute("action") || "";
    const s = this;
    return this._onLnFill = function(n) {
      n.target === s.dom && (n.detail ? (s.fill(n.detail), s._applyActionMode(n.detail)) : s.dom.reset());
    }, this._onReset = function() {
      s._applyActionMode(null);
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  o.prototype.fill = function(p) {
    const s = Xe(this.dom, p);
    for (let n = 0; n < s.length; n++) {
      const c = s[n], d = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(d ? "change" : "input", { bubbles: !0 }));
    }
  }, o.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, o.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute(l)) return;
    const s = p && p.id != null && p.id !== "" ? p.id : null, n = this._ensureMethodInput();
    if (s !== null) {
      const c = this.dom.getAttribute(l);
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(s))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(s)), n.value = this.dom.getAttribute(f) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), n.value = "";
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, o, "ln-form");
})();
const xe = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function ke(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function fi(t, e) {
  const l = [];
  if (t) {
    const f = Object.keys(xe);
    for (let o = 0; o < f.length; o++) {
      const p = f[o], s = xe[p];
      t[s] && l.push(p);
    }
  }
  if (e) {
    const f = Array.from(e);
    for (let o = 0; o < f.length; o++)
      f[o] && l.indexOf(f[o]) === -1 && l.push(f[o]);
  }
  return l;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", l = "data-ln-validate-errors", f = "data-ln-validate-error", o = "ln-validate-valid", p = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  function s(n) {
    this.dom = n, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const c = this, d = n.tagName, y = n.type, g = d === "SELECT" || y === "checkbox" || y === "radio";
    this._onInput = function() {
      c._touched = !0, c.validate();
    }, this._onChange = function() {
      c._touched = !0, c.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      c._customErrors.add(r), c._touched = !0;
      const h = n.closest(".form-element");
      if (h) {
        const u = h.querySelector("[" + f + '="' + r + '"]');
        u && u.classList.remove("hidden");
      }
      n.classList.remove(o), n.classList.add(p), n.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, h = n.closest(".form-element");
      if (r) {
        if (c._customErrors.delete(r), h) {
          const u = h.querySelector("[" + f + '="' + r + '"]');
          u && u.classList.add("hidden");
        }
      } else
        c._customErrors.forEach(function(u) {
          if (h) {
            const _ = h.querySelector("[" + f + '="' + u + '"]');
            _ && _.classList.add("hidden");
          }
        }), c._customErrors.clear();
      c._touched && c.validate();
    }, g || n.addEventListener("input", this._onInput), n.addEventListener("change", this._onChange), n.addEventListener("ln-validate:set-custom", this._onSetCustom), n.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const m = n.form;
    return m && (m.hasAttribute("novalidate") || m.setAttribute("novalidate", ""), this._onFormReset = function() {
      c.reset();
    }, this._onValidateRequest = function(i) {
      c._touched = !0, !c.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(c.dom);
    }, m.addEventListener("reset", this._onFormReset), m.addEventListener("ln-validate:request-validate", this._onValidateRequest), m._lnValidateGateBound || (m._lnValidateGateBound = !0, m.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      L(m, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((h, u) => h.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), (n.value && n.value.trim() !== "" || n.checked) && (this._touched = !0, this.validate()), this;
  }
  s.prototype.validate = function() {
    const n = this.dom, c = n.validity, d = ke(c, this._customErrors.size), y = fi(c, this._customErrors), g = n.closest(".form-element");
    if (g) {
      const b = g.querySelector("[" + l + "]");
      if (b) {
        const i = b.querySelectorAll("[" + f + "]");
        for (let r = 0; r < i.length; r++) {
          const h = i[r].getAttribute(f);
          i[r].classList.toggle("hidden", !y.includes(h));
        }
      }
    }
    return n.classList.toggle(o, d), n.classList.toggle(p, !d), n.setAttribute("aria-invalid", d ? "false" : "true"), L(n, d ? "ln-validate:valid" : "ln-validate:invalid", { target: n, field: n.name, errors: y }), d;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(o, p), this.dom.removeAttribute("aria-invalid");
    const n = this.dom.closest(".form-element");
    if (n) {
      const c = n.querySelectorAll("[" + f + "]");
      for (let d = 0; d < c.length; d++)
        c[d].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return ke(this.dom.validity, this._customErrors.size);
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const n = this.dom.form;
    n && (this._onFormReset && n.removeEventListener("reset", this._onFormReset), this._onValidateRequest && n.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(o, p), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, s, "ln-validate");
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", l = "data-ln-form-scope";
  if (window[e] !== void 0) return;
  function f(g) {
    if (!g.hasAttribute(t) || g[e]) return;
    g[e] = !0;
    const m = c(g);
    o(m.links), p(m.forms);
  }
  function o(g) {
    for (const m of g) {
      if (m[e + "Trigger"] || m.hostname && m.hostname !== window.location.hostname) continue;
      const b = m.getAttribute("href");
      if (b && b.includes("#")) continue;
      const i = function(r) {
        if (!rn(r, m)) return;
        r.preventDefault();
        const h = m.getAttribute("href");
        h && n("GET", h, null, m);
      };
      m.addEventListener("click", i), m[e + "Trigger"] = i;
    }
  }
  function p(g) {
    for (const m of g) {
      if (m[e + "Trigger"]) continue;
      if (m.hasAttribute(l)) {
        m[e + "ScopeWarned"] || (m[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const b = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = m.method.toUpperCase(), h = m.action, u = new FormData(m);
        for (const _ of m.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        n(r, h, u, m, function() {
          for (const _ of m.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      m.addEventListener("submit", b), m[e + "Trigger"] = b;
    }
  }
  function s(g) {
    if (!g[e]) return;
    const m = c(g);
    for (const b of m.links)
      b[e + "Trigger"] && (b.removeEventListener("click", b[e + "Trigger"]), delete b[e + "Trigger"]);
    for (const b of m.forms)
      b[e + "Trigger"] && (b.removeEventListener("submit", b[e + "Trigger"]), delete b[e + "Trigger"]);
    delete g[e];
  }
  function n(g, m, b, i, r) {
    if (W(i, "ln-ajax:before-start", { method: g, url: m }).defaultPrevented) return;
    L(i, "ln-ajax:start", { method: g, url: m }), i.classList.add("ln-ajax--loading");
    const u = document.createElement("span");
    u.className = "ln-ajax-spinner", i.appendChild(u);
    function _() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let E = m;
    const a = document.querySelector('meta[name="csrf-token"]'), v = a ? a.getAttribute("content") : null;
    b instanceof FormData && v && b.append("_token", v);
    const w = {
      method: g,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (v && (w.headers["X-CSRF-TOKEN"] = v), g === "GET" && b) {
      const A = new URLSearchParams(b);
      E = m + (m.includes("?") ? "&" : "?") + A.toString();
    } else g !== "GET" && b && (w.body = b);
    fetch(E, w).then(function(A) {
      const C = A.ok, T = A.status;
      return A.text().then(function(x) {
        let D = null, R = null;
        if (x && x.trim())
          try {
            D = JSON.parse(x);
          } catch (M) {
            R = M;
          }
        return { ok: C, status: T, data: D, parseError: R };
      });
    }).then(function(A) {
      const C = A.status, T = A.data, x = A.parseError;
      if (A.ok && !x) {
        if (T && T.title && (document.title = T.title), T && T.content)
          for (const D in T.content) {
            const R = document.getElementById(D);
            R && (R.innerHTML = T.content[D]);
          }
        if (i.tagName === "A") {
          const D = i.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", E);
        L(i, "ln-ajax:success", { method: g, url: E, data: T });
      } else
        L(i, "ln-ajax:error", {
          method: g,
          url: E,
          status: C,
          data: T,
          error: x || null
        });
      L(i, "ln-ajax:complete", { method: g, url: E }), _();
    }).catch(function(A) {
      L(i, "ln-ajax:error", { method: g, url: E, status: 0, data: null, error: A }), L(i, "ln-ajax:complete", { method: g, url: E }), _();
    });
  }
  function c(g) {
    const m = { links: [], forms: [] };
    return g.tagName === "A" && g.getAttribute(t) !== "false" ? m.links.push(g) : g.tagName === "FORM" && g.getAttribute(t) !== "false" ? m.forms.push(g) : (m.links = Array.from(g.querySelectorAll('a:not([data-ln-ajax="false"])')), m.forms = Array.from(g.querySelectorAll('form:not([data-ln-ajax="false"])'))), m;
  }
  function d() {
    at(function() {
      new MutationObserver(function(m) {
        for (const b of m)
          if (b.type === "childList") {
            for (const i of b.addedNodes)
              if (i.nodeType === 1 && (f(i), !i.hasAttribute(t))) {
                for (const h of i.querySelectorAll("[" + t + "]"))
                  f(h);
                const r = i.closest && i.closest("[" + t + "]");
                if (r && r.getAttribute(t) !== "false") {
                  const h = c(i);
                  o(h.links), p(h.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Mt([t], function(m) {
        f(m);
      });
    }, "ln-ajax");
  }
  function y() {
    for (const g of document.querySelectorAll("[" + t + "]"))
      f(g);
  }
  window[e] = f, window[e].destroy = s, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y();
})();
function pi(t, { isHydration: e = !1, hasPrimaryRegion: l = !1, primaryMatch: f = null } = {}) {
  const o = l ? !f : !t.some((d) => d.match), p = [], s = [];
  for (const d of t)
    if (!(!d.targetEl && !d.isPending)) {
      if (!d.match) {
        const y = e && d.hasHydrate && d.hasChildren;
        !d.hasKeep && d.hasChildren && !y && d.targetEl && p.push(d);
        continue;
      }
      d.hasKeep && d.mountedTemplate === d.match.route.templateNode || s.push(Object.assign({}, d, {
        skipMount: e && d.hasHydrate && d.hasChildren
      }));
    }
  s.sort((d, y) => d.regionKey === "__primary__" ? -1 : y.regionKey === "__primary__" ? 1 : 0);
  const c = s.find((d) => d.regionKey === "__primary__") || s[0] || null;
  return { notFound: o, clears: p, swaps: s, owner: c };
}
const gn = {
  navigate: function(t) {
    Rt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Rt(t, { historyAction: "replace" });
  },
  current: function() {
    return Gt === null ? null : {
      path: Gt,
      params: yn,
      query: vn,
      route: wn,
      regions: bn
    };
  }
}, we = "data-ln-route", _n = "lnRoute";
typeof window < "u" && (window.lnRouter = gn);
const ut = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new WeakMap();
let bn = /* @__PURE__ */ new Map(), De = !1, Gt = null, yn = {}, vn = {}, wn = null, ue = !1;
function Ie(t, e, l) {
  ue ? queueMicrotask(function() {
    L(t, e, l);
  }) : L(t, e, l);
}
function Qt(t) {
  try {
    const p = new URL(t, window.location.origin);
    t = p.pathname + p.search + p.hash;
  } catch {
  }
  let [e] = t.split("#"), [l, f] = e.split("?");
  const o = {};
  if (f) {
    const p = new URLSearchParams(f);
    for (const [s, n] of p.entries())
      o[s] = n;
  }
  return l = l.replace(/\/+$/, ""), l === "" && (l = "/"), { path: l, query: o };
}
function En(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const l = t.segments, f = e.segments, o = Math.max(l.length, f.length);
  for (let p = 0; p < o; p++) {
    const s = l[p], n = f[p];
    if (s === void 0) return 1;
    if (n === void 0) return -1;
    if (s === "*") return 1;
    if (n === "*") return -1;
    const c = s.startsWith(":"), d = n.startsWith(":");
    if (c && !d) return 1;
    if (!c && d) return -1;
  }
  return 0;
}
function An(t, e) {
  const l = t.split("/").filter(Boolean);
  for (const f of e) {
    if (f.pattern === "*")
      return {
        route: f,
        params: { wildcard: t }
      };
    const o = f.segments, p = {};
    let s = !0;
    if (!(l.length > o.length && o[o.length - 1] !== "*")) {
      for (let n = 0; n < o.length; n++) {
        const c = o[n], d = l[n];
        if (c === "*") {
          p.wildcard = l.slice(n).join("/");
          break;
        }
        if (d === void 0) {
          s = !1;
          break;
        }
        if (c.startsWith(":"))
          p[c.slice(1)] = decodeURIComponent(d);
        else if (c !== d) {
          s = !1;
          break;
        }
      }
      if (s && (o.indexOf("*") !== -1 || l.length <= o.length))
        return { route: f, params: p };
    }
  }
  return null;
}
function he(t, e = {}) {
  const l = e.warn !== !1;
  if (t !== "__primary__") {
    const o = document.getElementById(t);
    return !o && l && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), o;
  }
  const f = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !f && l && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), f;
}
function Re(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), l = [t].concat(e);
  for (const o of l)
    for (const p of Object.keys(o))
      if (p.startsWith("ln") && o[p] && typeof o[p].destroy == "function")
        try {
          o[p].destroy();
        } catch (s) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, o, s);
        }
  const f = document.querySelectorAll('[data-ln-popover="open"]');
  for (const o of f) {
    const p = o.lnPopover;
    if (p && p.trigger && t.contains(p.trigger))
      try {
        p.destroy();
      } catch (s) {
        console.error("[ln-router] Error destroying open popover:", s);
      }
  }
}
function Rt(t, e = {}) {
  const { path: l, query: f } = Qt(t), o = /* @__PURE__ */ new Map();
  for (const [m, b] of ut)
    o.set(m, An(l, b.sorted));
  const p = o.get("__primary__") || null, s = he("__primary__", { warn: !!p }), n = ut.has("__primary__"), c = [];
  for (const [m, b] of o) {
    const i = m === "__primary__" ? s : he(m, { warn: !1 }), r = !i && !!(p && p.route && p.route.templateNode && p.route.templateNode.content && p.route.templateNode.content.querySelector("#" + CSS.escape(m)));
    !i && !r && b && console.warn(`[ln-router] Explicit target element #${m} not found in DOM`), c.push({
      regionKey: m,
      match: b,
      targetEl: i,
      isPending: r,
      hasKeep: !!i && i.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!i && i.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!i && i.children.length > 0,
      mountedTemplate: i && re.get(i) || null
    });
  }
  const d = pi(c, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: p
  });
  if (d.notFound) {
    Ie(document.body, "ln-router:not-found", { path: l });
    return;
  }
  if (W(s || document.body, "ln-router:before-navigate", {
    from: Gt,
    to: t,
    params: p ? p.params : {},
    query: f
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const g = function() {
    for (const m of d.clears)
      Re(m.targetEl), m.targetEl.replaceChildren(), re.delete(m.targetEl);
    for (const m of d.swaps) {
      if ((m.isPending || !m.targetEl || !document.contains(m.targetEl)) && (m.targetEl = m.regionKey === "__primary__" ? s : document.getElementById(m.regionKey)), !m.targetEl) {
        console.warn(`[ln-router] Target element #${m.regionKey} could not be resolved`);
        continue;
      }
      if (m.skipMount || (Re(m.targetEl), m.targetEl.replaceChildren(m.match.route.templateNode.content.cloneNode(!0))), re.set(m.targetEl, m.match.route.templateNode), d.owner && m.regionKey === d.owner.regionKey) {
        if (m.match.route.title) {
          let b = m.match.route.title;
          if (m.match.params)
            for (const [i, r] of Object.entries(m.match.params))
              b = b.replace(new RegExp("\\{\\{\\s*" + i + "\\s*\\}\\}", "g"), r);
          document.title = b;
        }
        if (!e.isHydration) {
          m.targetEl.hasAttribute("tabindex") || m.targetEl.setAttribute("tabindex", "-1");
          const b = m.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          b ? (b.setAttribute("tabindex", "-1"), b.focus()) : m.targetEl.focus(), m.regionKey === "__primary__" && m.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Ie(m.targetEl, "ln-router:navigated", {
        path: t,
        params: m.match.params,
        query: f,
        route: m.match.route,
        target: m.targetEl,
        region: m.regionKey
      });
    }
    Gt = t, vn = f, wn = p ? p.route : null, yn = p ? p.params : {}, bn = new Map(
      Array.from(o.entries()).map(([m, b]) => [m, b ? { route: b.route, params: b.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(g) : g();
}
function mi(t) {
  const e = t.target.closest("a");
  if (!e || !rn(t, e)) return;
  const l = e.getAttribute("href"), { path: f } = Qt(l);
  for (const o of ut.values())
    if (An(f, o.sorted)) {
      t.preventDefault(), Rt(l, { historyAction: "push" });
      return;
    }
}
function gi(t, e) {
  const l = Object.keys(t), f = Object.keys(e);
  if (l.length !== f.length) return !1;
  for (let o = 0; o < l.length; o++) {
    const p = l[o];
    if (t[p] !== e[p]) return !1;
  }
  return !0;
}
function _i() {
  const t = window.location.pathname + window.location.search, e = gn.current();
  if (e && e.path != null) {
    const l = Qt(t);
    if (Qt(e.path).path === l.path && gi(e.query, l.query))
      return;
  }
  Rt(t, { historyAction: "skip" });
}
function bi() {
  De || (De = !0, at(function() {
    document.addEventListener("click", mi), window.addEventListener("popstate", _i), ue = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Rt(t, { historyAction: "replace", isHydration: !0 }), ue = !1;
  }, "ln-router"));
}
function yi(t) {
  const e = t.getAttribute(we);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null;
  if (l === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const f = l || "__primary__";
  ut.has(f) || ut.set(f, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const o = ut.get(f);
  if (o.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${f}"`);
    return;
  }
  const p = t.getAttribute("data-ln-route-title"), s = e.split("/").filter(Boolean), n = {
    pattern: e,
    segments: s,
    target: l,
    title: p,
    templateNode: t
  }, c = he(f);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), o.routes.set(e, n), o.sorted = Array.from(o.routes.values()).sort(En);
}
function vi(t) {
  const e = t.getAttribute(we);
  if (!e) return;
  const f = t.getAttribute("data-ln-route-target") || null || "__primary__", o = ut.get(f);
  o && (o.routes.delete(e), o.sorted = Array.from(o.routes.values()).sort(En), o.routes.size === 0 && ut.delete(f));
}
function Sn(t) {
  return this.dom = t, yi(t), this;
}
Sn.prototype.destroy = function() {
  vi(this.dom), delete this.dom[_n];
};
U(we, _n, Sn, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ut.size > 0 && bi();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  function l(o) {
    this.dom = o, this.isOpen = o.getAttribute(t) === "open";
    const p = this;
    return this._onRequestOpen = function() {
      p.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      p.dom.setAttribute(t, "close");
    }, this._onCancel = function(s) {
      s.preventDefault(), p.dom.setAttribute(t, "close");
    }, this._onClickClose = function(s) {
      const n = s.target.closest("[data-ln-modal-close]");
      n && p.dom.contains(n) && (s.preventDefault(), p.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  l.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, l.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, l.prototype.toggle = function() {
    const o = this.dom.getAttribute(t);
    this.dom.setAttribute(t, o === "open" ? "close" : "open");
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const o = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(s) {
            return s !== o;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function f(o) {
    const p = o[e];
    if (!p) return;
    const n = o.getAttribute(t) === "open";
    if (n !== p.isOpen)
      if (n) {
        if (W(o, "ln-modal:before-open", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(t, "close");
          return;
        }
        p.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof o.showModal == "function" && o.showModal();
        const d = o.querySelector("[autofocus]");
        if (d && It(d))
          d.focus();
        else {
          const y = o.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), g = Array.prototype.find.call(y, It);
          if (g) g.focus();
          else {
            const m = o.querySelectorAll("a[href], button:not([disabled])"), b = Array.prototype.find.call(m, It);
            b && b.focus();
          }
        }
        L(o, "ln-modal:open", { modalId: o.id, target: o });
      } else {
        if (W(o, "ln-modal:before-close", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(t, "open");
          return;
        }
        p.isOpen = !1, L(o, "ln-modal:close", { modalId: o.id, target: o }), typeof o.close == "function" && o.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(t, e, l, "ln-modal", {
    onAttributeChange: f
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", l = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  function f(h) {
    const u = {};
    let _ = h;
    const E = [];
    for (; _; ) {
      const a = _.closest("[" + t + "]");
      if (!a) break;
      a[e] && a[e].dict && E.unshift(a[e].dict), _ = a.parentElement;
    }
    for (const a of E)
      Object.assign(u, a);
    return u;
  }
  function o(h, u) {
    if (u) {
      if (h) {
        const E = h.closest("[" + t + "]");
        if (E) {
          if (E.id === u && E.hasAttribute("data-ln-modal")) return E;
          const a = E.querySelector("#" + CSS.escape(u) + '[data-ln-modal], [data-ln-modal="' + u + '"]');
          if (a) return a;
        }
      }
      const _ = document.getElementById(u) || document.querySelector('[data-ln-modal="' + u + '"]');
      if (_) return _;
    }
    if (h) {
      const _ = h.closest("[" + t + "]");
      if (_) {
        if (_.hasAttribute("data-ln-modal")) return _;
        const a = _.querySelector("[data-ln-modal]");
        if (a) return a;
      }
      const E = h.closest("[data-ln-modal]");
      if (E) return E;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function p(h, u) {
    if (h !== "edit") return "";
    if (u) {
      const _ = u.getAttribute("data-ln-fill-id");
      if (_) return _;
    }
    return "edit";
  }
  function s(h) {
    if (!h) return;
    const u = h.querySelectorAll("[data-ln-field]");
    for (let E = 0; E < u.length; E++)
      u[E].textContent = "";
    const _ = h.querySelectorAll("form");
    for (let E = 0; E < _.length; E++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(_[E], null) : _[E].reset();
  }
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const u = h.target.closest("[data-ln-modal-for]");
    if (u) {
      const E = u.getAttribute("data-ln-modal-for"), a = o(u, E);
      if (a && a.lnModal) {
        h.preventDefault();
        const v = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, w = {}, A = u.dataset;
        for (const x in A) {
          if (!x.startsWith("lnModal") || v[x]) continue;
          const D = x.slice(7);
          D && (w[D.charAt(0).toLowerCase() + D.slice(1)] = A[x]);
        }
        const C = Object.keys(w).length > 0;
        u.hasAttribute("data-ln-modal-mode") ? a.dataset.lnModalMode = u.getAttribute("data-ln-modal-mode") : a.dataset.lnModalMode = C ? "edit" : "new", C && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(a, w) : a.dataset.lnModalMode === "new" && s(a), a.getAttribute("data-ln-modal") === "open" ? L(a, "ln-modal:request-close", {}) : (a.id && nt(a.id, p(a.dataset.lnModalMode, u)), L(a, "ln-modal:request-open", {}));
      }
      return;
    }
    const _ = h.target.closest('a[href^="#"]');
    if (_) {
      const E = Jt(_.getAttribute("href"));
      for (const a in E) {
        const v = document.getElementById(a);
        if (v && v.lnModal) {
          if (!ye(h)) return;
          nt(a, E[a]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(h) {
    const u = h.target;
    if (!u || !u.lnModal) return;
    (u.dataset.lnModalMode || "new") === "new" && s(u);
  }), document.addEventListener("ln-modal:open", function(h) {
    const u = h.target;
    if (!u || !u.lnModal || !u.id) return;
    let _ = X(u.id);
    _ === null && (_ = p(u.dataset.lnModalMode, null), nt(u.id, _)), _ ? (u.dataset.lnModalMode = "edit", L(u, "ln-fill:request", { id: _ })) : (u.dataset.lnModalMode = "new", s(u));
  });
  let n = !1;
  function c() {
    if (!n) {
      n = !0;
      try {
        const h = document.querySelectorAll("[data-ln-modal][id]");
        for (let u = 0; u < h.length; u++) {
          const _ = h[u];
          if (!_.lnModal) continue;
          const E = _.id, a = X(E), v = a !== null, w = _.lnModal.isOpen;
          if (v) {
            const A = a ? "edit" : "new";
            _.dataset.lnModalMode = A, w ? a ? L(_, "ln-fill:request", { id: a }) : s(_) : L(_, "ln-modal:request-open", {});
          } else w && L(_, "ln-modal:request-close", {});
        }
      } finally {
        n = !1;
      }
    }
  }
  function d() {
    const h = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let u = 0; u < h.length; u++) {
      const _ = h[u];
      _.lnModal && X(_.id) === null && nt(_.id, p(_.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", c);
  function y() {
    d(), c();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    st(y);
  }) : st(y);
  function g(h) {
    const _ = (h.detail || {}).data;
    if (_ && _.message) {
      const a = _.message;
      L(window, "ln-toast:enqueue", {
        type: a.type || "success",
        title: a.title || "",
        message: a.body || ""
      });
    }
    const E = h.target.closest("[data-ln-modal]");
    E && E.lnModal && (E.id && nt(E.id, null), L(E, "ln-modal:request-close", {}), s(E));
  }
  function m(h) {
    const u = h.detail || {}, _ = u.data, E = u.status || 0, a = f(h.target);
    if (_ && _.message) {
      const v = _.message;
      L(window, "ln-toast:enqueue", {
        type: v.type || "error",
        title: v.title || "",
        message: v.body || ""
      });
    } else E === 0 ? L(window, "ln-toast:enqueue", {
      type: "error",
      title: a["network-error-title"] || "",
      message: a["network-error"] || "Network error"
    }) : L(window, "ln-toast:enqueue", {
      type: "error",
      title: a["server-error-title"] || "",
      message: a["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", g), document.addEventListener("ln-ajax:error", m);
  function b(h) {
    const u = h.detail || {}, _ = f(h.target), E = u.message || (u.reason === "max-size" ? _["upload-max-size"] || "File is too large" : u.reason === "max-files" ? _["upload-max-files"] || "Maximum file count exceeded" : _["upload-invalid-type"] || "This file type is not allowed"), a = _["upload-invalid-title"] || "Invalid File";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: a,
      message: E
    });
  }
  function i(h) {
    const u = h.detail || {}, _ = f(h.target), E = u.message || _["upload-failed"] || "Failed to upload file", a = _["upload-error-title"] || "Upload Error";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: a,
      message: E
    });
  }
  document.addEventListener("ln-upload:invalid", b), document.addEventListener("ln-upload:error", i), document.addEventListener("ln-modal:close", function(h) {
    const u = h.target;
    !u || !u.lnModal || (u.id && X(u.id) !== null && nt(u.id, null), u.dataset.lnModalMode === "new" && s(u));
  });
  function r(h) {
    return this.dom = h, this.dict = $t(h, l), this;
  }
  r.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, U(t, e, r, "ln-ui-coordinator");
})();
function wi(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let l = e, f = 0;
  for (let o = 0; o < t.length && l > 0; o++)
    f = o + 1, /[0-9]/.test(t[o]) && l--;
  return l > 0 && (f = t.length), f;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  const l = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(o) {
    if (o[e]) return o[e];
    o[e] = this, this.dom = o;
    const p = this;
    if (this._onLocaleChange = function() {
      p.isTextElement ? p._formatTextContent() : isNaN(p.value) || p._displayFormatted(p.value);
    }, Yt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const s = document.createElement("input");
    s.type = "hidden", s.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && s.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", s), this._hidden = s, Object.defineProperty(s, "value", {
      get: function() {
        return l.get.call(s);
      },
      set: function(c) {
        if (l.set.call(s, c), c !== "" && !isNaN(parseFloat(c))) {
          const d = p.dom.getAttribute("data-ln-number-decimals");
          p._setDisplayRaw(et(parseFloat(c), G(p.dom), { maxDecimals: d }));
        } else
          p._setDisplayRaw("");
        p.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Je(o, l, {
      get: function() {
        return l.get.call(o);
      },
      set: function(c) {
        if (c === "") {
          p._setDisplayRaw(""), p._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const d = typeof c == "number" ? c : parseFloat(String(c));
        if (isNaN(d))
          p._setDisplayRaw(String(c)), p._setHiddenRaw("");
        else {
          p._setHiddenRaw(d);
          const y = o.getAttribute("data-ln-number-decimals");
          p._setDisplayRaw(et(d, G(o), { maxDecimals: y }));
        }
        o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      p._handleInput();
    }, o.addEventListener("input", this._onInput), this._onKeyDown = function(c) {
      if (c.key !== "Backspace") return;
      const d = o.selectionStart, y = o.selectionEnd;
      if (d !== y || d === 0) return;
      const g = Wt(G(o)), m = l.get.call(o), b = m[d - 1];
      if (b === g.groupSep || /\s/.test(b)) {
        c.preventDefault();
        const i = d - 2 >= 0 ? d - 2 : 0, r = m.slice(0, i) + m.slice(d);
        l.set.call(o, r), o.setSelectionRange(i, i), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, o.addEventListener("keydown", this._onKeyDown), this._onPaste = function(c) {
      c.preventDefault();
      const d = (c.clipboardData || window.clipboardData).getData("text"), y = ii(d, G(o));
      p.value = isNaN(y) ? NaN : y;
    }, o.addEventListener("paste", this._onPaste);
    const n = o.value;
    if (n !== "") {
      const c = parseFloat(n);
      if (!isNaN(c)) {
        const d = o.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(c), this._setDisplayRaw(et(c, G(o), { maxDecimals: d })), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  f.prototype._initTextElement = function() {
    const o = this.dom;
    let p = o.getAttribute("data-ln-value"), s = o.getAttribute("data-ln-number"), n = null;
    p !== null && p !== "" ? n = p : s !== null && s !== "" && s !== "true" ? n = s : n = o.textContent.trim();
    const c = parseFloat(n);
    isNaN(c) ? this._rawValue = null : (this._rawValue = c, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(c)), this._formatTextContent());
  }, f.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = et(this._rawValue, G(this.dom), { maxDecimals: o });
    }
  }, f.prototype._handleInput = function() {
    const o = this.dom, p = l.get.call(o);
    if (p === "") {
      this._setHiddenRaw(""), L(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (p === "-") {
      this._setHiddenRaw(""), L(o, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const s = o.selectionStart;
    let n = 0;
    for (let E = 0; E < s; E++)
      /[0-9]/.test(p[E]) && n++;
    const c = G(o), d = Wt(c);
    let y = p, g = fn(p, d.groupSep, d.decimalSep), m = parseFloat(g);
    if (isNaN(m)) {
      this._setHiddenRaw(""), L(o, "ln-number:input", { value: NaN, formatted: p });
      return;
    }
    const b = o.getAttribute("data-ln-number-decimals"), i = g.indexOf(".");
    if (b !== null && i !== -1) {
      const E = parseInt(b, 10), a = g.slice(i + 1);
      if (E === 0)
        g = g.slice(0, i), y = y.split(d.decimalSep)[0], m = parseFloat(g), this._setDisplayRaw(y);
      else if (a.length > E) {
        g = g.slice(0, i + 1 + E);
        const v = y.split(d.decimalSep);
        y = v[0] + d.decimalSep + v[1].slice(0, E), m = parseFloat(g), this._setDisplayRaw(y);
      }
    }
    const r = o.getAttribute("data-ln-number-max");
    if (r !== null && m > parseFloat(r)) {
      const E = parseFloat(r), a = et(E, c, { maxDecimals: b });
      this._setDisplayRaw(a), this._setHiddenRaw(E), o.setSelectionRange(a.length, a.length), L(o, "ln-number:input", { value: E, formatted: a });
      return;
    }
    if (y.endsWith(d.decimalSep) || d.decimalSep !== "." && y.endsWith(".")) {
      this._setHiddenRaw(m), L(o, "ln-number:input", { value: m, formatted: y });
      return;
    }
    const h = g.indexOf(".");
    if (h !== -1 && g.slice(h + 1).endsWith("0")) {
      this._setHiddenRaw(m), L(o, "ln-number:input", { value: m, formatted: y });
      return;
    }
    let u;
    if (b !== null)
      u = et(m, c, { maxDecimals: b });
    else {
      const E = h !== -1 ? g.slice(h + 1).length : 0;
      u = et(m, c, { userDecimals: E });
    }
    this._setDisplayRaw(u);
    const _ = wi(u, n);
    o.setSelectionRange(_, _), this._setHiddenRaw(m), L(o, "ln-number:input", { value: m, formatted: u });
  }, f.prototype._setHiddenRaw = function(o) {
    this._hidden && l.set.call(this._hidden, String(o));
  }, f.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : l.set.call(this.dom, String(o));
  }, f.prototype._displayFormatted = function(o) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const p = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(et(o, G(this.dom), { maxDecimals: p }));
    }
  }, Object.defineProperty(f.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = l.get.call(this._hidden);
      return o === "" ? NaN : parseFloat(o);
    },
    set: function(o) {
      const p = typeof o == "number" ? o : parseFloat(o);
      if (this.isTextElement) {
        isNaN(p) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = p, this.dom.setAttribute("data-ln-value", String(p)), this._formatTextContent());
        return;
      }
      if (isNaN(p)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(p);
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(et(p, G(this.dom), { maxDecimals: s })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(f.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : l.get.call(this.dom);
    }
  }), f.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, f, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const p = o[e];
      p && (p.isTextElement ? p._initTextElement() : isNaN(p.value) || p._displayFormatted(p.value));
    }
  });
})();
const fe = /^(short|medium|long)(\s+datetime)?$/, Ei = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Ai(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(fe) ? Ei[t.trim()] : null;
}
function Pt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let l, f;
  if (e.indexOf(".") !== -1)
    l = ".", f = e.split(".");
  else if (e.indexOf("/") !== -1)
    l = "/", f = e.split("/");
  else if (e.indexOf("-") !== -1)
    l = "-", f = e.split("-");
  else
    return null;
  if (f.length !== 3) return null;
  const o = [];
  for (let d = 0; d < 3; d++) {
    const y = parseInt(f[d], 10);
    if (isNaN(y)) return null;
    o.push(y);
  }
  let p, s, n;
  l === "." ? (p = o[0], s = o[1], n = o[2]) : l === "/" ? (s = o[0], p = o[1], n = o[2]) : f[0].length === 4 ? (n = o[0], s = o[1], p = o[2]) : (p = o[0], s = o[1], n = o[2]), n < 100 && (n += n < 50 ? 2e3 : 1900);
  const c = new Date(n, s - 1, p);
  return c.getFullYear() !== n || c.getMonth() !== s - 1 || c.getDate() !== p ? null : c;
}
function oe(t, e, l, f) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const o = t.getDate(), p = t.getMonth(), s = t.getFullYear(), n = t.getHours(), c = t.getMinutes();
  let d, y;
  const g = (l || "").toLowerCase().split("-")[0];
  let m = !1;
  try {
    const r = new Intl.DateTimeFormat(l, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    m = !!(f && r !== g);
  } catch {
    m = !!f;
  }
  if (m && f && f.monthsLong)
    d = f.monthsLong[p];
  else
    try {
      d = new Intl.DateTimeFormat(l, { month: "long" }).format(t);
    } catch {
      d = String(p + 1);
    }
  if (m && f && f.monthsShort)
    y = f.monthsShort[p];
  else
    try {
      y = new Intl.DateTimeFormat(l, { month: "short" }).format(t);
    } catch {
      y = String(p + 1);
    }
  const b = {
    yyyy: String(s),
    yy: String(s).slice(-2),
    MMMM: d,
    MMM: y,
    MM: String(p + 1).padStart(2, "0"),
    M: String(p + 1),
    dd: String(o).padStart(2, "0"),
    d: String(o),
    HH: String(n).padStart(2, "0"),
    mm: String(c).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(i) {
    return b[i] !== void 0 ? b[i] : i;
  });
}
function Bt(t, e, l, f) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const o = Ai(e);
  if (o)
    try {
      const p = new Intl.DateTimeFormat(l, o), s = (l || "").toLowerCase().split("-")[0], n = p.resolvedOptions().locale.toLowerCase().split("-")[0];
      return f && n !== s ? oe(t, "dd.MM.yyyy", l, f) : p.format(t);
    } catch {
      return oe(t, "dd.MM.yyyy", l, f);
    }
  return oe(t, e || "dd.MM.yyyy", l, f);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  const l = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(n, c, d) {
    L(n.dom, "ln-date:change", {
      value: c,
      formatted: n.dom.value,
      date: d
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function o(n, c, d, y) {
    n._setHiddenRaw(c), l.set.call(n._picker, c), n._lastISO = c, y !== void 0 ? (n._isFormatting = !0, n.dom.value = y, n._isFormatting = !1) : d && n._displayFormatted(d), f(n, c, d);
  }
  function p(n) {
    n._setHiddenRaw(""), l.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", f(n, "", null);
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const c = this;
    if (this._onLocaleChange = function() {
      if (c.isTextElement)
        c._formatTextContent();
      else if (c.value) {
        const h = J(c.value);
        h && c._displayFormatted(h);
      }
    }, Yt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const d = n.value, y = n.name, g = n.closest(".form-element, form") || n.parentNode;
    if (g) {
      const h = g.querySelectorAll("[data-ln-date-dict]");
      for (let u = 0; u < h.length; u++) {
        const _ = h[u].getAttribute("data-ln-date-dict");
        if (_) {
          const E = $t(h[u], "data-ln-date-dict-key");
          E["months-long"] && (E.monthsLong = E["months-long"].split(",").map((a) => a.trim())), E["months-short"] && (E.monthsShort = E["months-short"].split(",").map((a) => a.trim())), be(_, E);
        }
      }
    }
    const m = document.createElement("span");
    m.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(m, n), m.appendChild(n), this._wrapper = m;
    const b = document.createElement("input");
    b.type = "hidden", b.name = y, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && b.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", b), this._hidden = b;
    const i = document.createElement("input");
    i.type = "date", i.tabIndex = -1, i.setAttribute("tabindex", "-1"), i.setAttribute("aria-hidden", "true"), i.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), i.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", b.insertAdjacentElement("afterend", i), this._picker = i, n.type = "text";
    const r = document.createElement("button");
    if (r.type = "button", r.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), r.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', i.insertAdjacentElement("afterend", r), this._btn = r, this._lastISO = "", Object.defineProperty(b, "value", {
      get: function() {
        return l.get.call(b);
      },
      set: function(h) {
        if (l.set.call(b, h), h && h !== "") {
          const u = J(h);
          u && o(c, h, u);
        } else h === "" && p(c);
      }
    }), Je(n, l, {
      get: function() {
        return l.get.call(n);
      },
      set: function(h, u) {
        if (c._isFormatting) {
          u(h);
          return;
        }
        if (!h || h === "") {
          u(""), p(c);
          return;
        }
        const _ = J(h) || Pt(h);
        if (_) {
          const E = qt(_), a = n.getAttribute(t) || "", v = G(n), w = yt(v), A = Bt(_, a, v, w);
          u(A), o(c, E, _, A);
        } else
          u(String(h)), p(c);
      }
    }), this._onPickerChange = function() {
      const h = i.value;
      if (h) {
        const u = J(h);
        u && o(c, h, u);
      } else
        p(c);
    }, i.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const h = c.dom.value.trim();
      if (h === "") {
        c._lastISO !== "" && p(c);
        return;
      }
      if (c._lastISO) {
        const _ = J(c._lastISO);
        if (_) {
          const E = c.dom.getAttribute(t) || "", a = G(c.dom), v = yt(a);
          if (h === Bt(_, E, a, v)) return;
        }
      }
      const u = Pt(h);
      if (u) {
        const _ = qt(u);
        o(c, _, u);
      } else if (c._lastISO) {
        const _ = J(c._lastISO);
        _ && c._displayFormatted(_);
      } else
        c.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, r.addEventListener("click", this._onBtnClick), d && d !== "") {
      const h = J(d);
      h && o(c, d, h);
    }
    return this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom, c = n.getAttribute("data-ln-value"), d = n.getAttribute("data-ln-date"), y = n.getAttribute("datetime");
    let g = null;
    c !== null && c !== "" ? g = c : y !== null && y !== "" ? g = y : d !== null && d !== "" && d !== "true" && !fe.test(d) ? g = d : g = n.textContent.trim();
    const m = J(g) || Pt(g);
    if (m && !isNaN(m.getTime())) {
      const b = qt(m);
      this._rawValue = b, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", b), this._formatTextContent();
    } else
      this._rawValue = null;
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = J(this._rawValue);
      if (n) {
        let d = this.dom.getAttribute("data-ln-date-format");
        if (!d) {
          const m = this.dom.getAttribute("data-ln-date");
          m && fe.test(m) && (d = m);
        }
        const y = G(this.dom), g = yt(y);
        this.dom.textContent = Bt(n, d || "medium", y, g);
      }
    }
  }, s.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, s.prototype._setHiddenRaw = function(n) {
    l.set.call(this._hidden, n);
  }, s.prototype._displayFormatted = function(n) {
    const c = this.dom.getAttribute(t) || "", d = G(this.dom), y = yt(d);
    this._isFormatting = !0, this.dom.value = Bt(n, c, d, y), this._isFormatting = !1;
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : l.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const d = J(n) || Pt(n);
        if (!d) return;
        const y = qt(d);
        this._rawValue = y, this.dom.setAttribute("data-ln-value", y), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        p(this);
        return;
      }
      const c = J(n);
      c && o(this, n, c);
    }
  }), Object.defineProperty(s.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? J(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = qt(n);
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, s, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const c = n[e];
      if (c) {
        if (c.isTextElement)
          c._initTextElement();
        else if (c.value) {
          const d = J(c.value);
          d && c._displayFormatted(d);
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const p = history.pushState;
    history.pushState = function() {
      p.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const s = history.replaceState;
    history.replaceState = function() {
      s.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function l(p) {
    return this.dom = p, this.activeClass = p.getAttribute(t) || "active", this.exact = p.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(p, { childList: !0, subtree: !0 }), this.update(), this;
  }
  l.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, c = f(n), d = [];
    for (const y of s) {
      const g = y.getAttribute("href");
      if (!g || g === "#" || g.startsWith("#") || g.startsWith("javascript:") || g.startsWith("mailto:") || g.startsWith("tel:")) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      if (y.hostname && y.hostname !== window.location.hostname) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      const m = f(g), b = m === c, i = !this.exact && m !== "/" && c.startsWith(m + "/");
      b || i ? (y.classList.add(this.activeClass), y.setAttribute("aria-current", "page"), d.push(y)) : (y.classList.remove(this.activeClass), y.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: d });
  }, l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const p = history._lnNavCallbacks.indexOf(this.updateHandler);
    p !== -1 && history._lnNavCallbacks.splice(p, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function f(p) {
    try {
      return new URL(p, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return p.replace(/\/$/, "") || "/";
    }
  }
  function o(p, s) {
    const n = p[e];
    if (n) {
      if (s === t) {
        if (!p.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const c = n.activeClass, d = p.getAttribute(t) || "active";
        if (c !== d) {
          const y = p.querySelectorAll("a");
          for (const g of y)
            c && g.classList.remove(c);
          n.activeClass = d;
        }
      } else s === "data-ln-nav-exact" && (n.exact = p.hasAttribute("data-ln-nav-exact"));
      n.update();
    }
  }
  U(t, e, l, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: o
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(s, n) {
    const c = s.getAttribute("data-ln-persist"), d = c !== null && c !== "" ? c : s.id;
    return d ? s.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + d + ":" + t() + ":" + n : "ln:" + d + ":" + n : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', s), null);
  }
  let l = null;
  function f() {
    if (l !== null) return l;
    try {
      if (typeof localStorage > "u") return l = !1;
      const s = "__ln_persist_test__";
      return localStorage.setItem(s, s), localStorage.removeItem(s), l = !0;
    } catch {
      return l = !1;
    }
  }
  const o = /* @__PURE__ */ new Set();
  function p(s, n) {
    const c = window.lnCore && window.lnCore._attrRegistry, d = c && c.persist || [];
    let y = null;
    for (let i = 0; i < d.length; i++)
      if (d[i].selector === n) {
        y = d[i];
        break;
      }
    if (!y) return;
    const g = y.persist;
    if (o.has(g.attr) || (o.add(g.attr), Mt([g.attr], function(i, r) {
      if (!i.hasAttribute("data-ln-persist") || g.hashActive && g.hashActive(i)) return;
      const h = e(i, r);
      if (!h || !f()) return;
      const u = i.getAttribute(r);
      try {
        u === null ? localStorage.removeItem(h) : localStorage.setItem(h, u);
      } catch {
      }
    })), g.hashActive && g.hashActive(s)) return;
    const m = e(s, g.attr);
    if (!m || !f()) return;
    const b = localStorage.getItem(m);
    b !== null && s.setAttribute(g.attr, b);
  }
  jn(p);
})();
function Oe(t, e, l, f) {
  const o = (t || "").toLowerCase().trim();
  if (o) return o;
  if ((e || "").toUpperCase() !== "A") return "";
  const p = l || "";
  if (!p.startsWith("#")) return "";
  const s = p.slice(1);
  if (!s) return "";
  const n = s.split("&"), c = (f || "").toLowerCase().trim();
  if (c)
    for (const g of n) {
      const m = g.indexOf(":");
      if (m > 0 && g.slice(0, m).toLowerCase().trim() === c)
        return g.slice(m + 1).toLowerCase().trim();
    }
  const d = n[n.length - 1] || "", y = d.indexOf(":");
  return (y > 0 ? d.slice(y + 1) : d).toLowerCase().trim();
}
function Me(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const l = t.filter(
    (p) => (p.tagName || "").toUpperCase() === "A" && (p.href || "").startsWith("#")
  ), f = l.length > 0 && l.length === t.length, o = (e || "").toLowerCase().trim();
  return l.length > 0 && l.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : f && !o ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: f && !!o,
    warning: null
  };
}
function Fe(t, e, l) {
  const f = (t || "").toLowerCase().trim();
  return f && Array.isArray(e) && e.includes(f) ? f : (l || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function l(o) {
    return this.dom = o, this.activeKey = null, f.call(this), this;
  }
  function f() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const o = this.tabs.map((n) => ({
      tagName: n.tagName,
      href: n.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const p = Me(o, this.nsKey);
    this.hashEnabled = p.hashEnabled, p.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : p.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const c = Oe(n.getAttribute("data-ln-tab"), n.tagName, n.getAttribute("href"), this.nsKey);
      c ? this.mapTabs[c] = n : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', n);
    }
    for (const n of this.panels) {
      const c = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      c && (this.mapPanels[c] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[e + "Trigger"]) continue;
      const c = function(d) {
        const y = n.tagName === "A";
        if (!y && (d.ctrlKey || d.metaKey || d.button === 1)) return;
        const g = Oe(n.getAttribute("data-ln-tab"), n.tagName, n.getAttribute("href"), s.nsKey);
        g && (y && !ye(d) || (s.hashEnabled ? X(s.nsKey) === g ? s.dom.setAttribute("data-ln-tabs-active", g) : nt(s.nsKey, g) : s.dom.setAttribute("data-ln-tabs-active", g)));
      };
      n.addEventListener("click", c), n[e + "Trigger"] = c, s._clickHandlers.push({ el: n, handler: c });
    }
    if (this._onRequestSelect = function(n) {
      const c = n.detail && (n.detail.key || n.detail.tab);
      c && s.select(c);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const n = X(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", n !== null ? n : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const n = Fe(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", n);
    }
  }
  l.prototype.select = function(o) {
    const p = (o + "").toLowerCase().trim();
    p && (this.hashEnabled ? X(this.nsKey) === p ? this.dom.setAttribute("data-ln-tabs-active", p) : nt(this.nsKey, p) : this.dom.setAttribute("data-ln-tabs-active", p));
  }, l.prototype._applyActive = function(o) {
    var s;
    if (o = Fe(o, Object.keys(this.mapPanels), this.defaultKey), o === this.activeKey) return;
    const p = this.activeKey;
    if (p !== null && W(this.dom, "ln-tabs:before-change", {
      key: o,
      previousKey: p,
      tab: this.mapTabs[o],
      panel: this.mapPanels[o],
      target: this.dom
    }).defaultPrevented) {
      p in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", p), this.hashEnabled && X(this.nsKey) !== p && nt(this.nsKey, p));
      return;
    }
    this.activeKey = o;
    for (const n in this.mapTabs) {
      const c = this.mapTabs[n];
      n === o ? (c.setAttribute("data-active", ""), c.setAttribute("aria-selected", "true")) : (c.removeAttribute("data-active"), c.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const c = this.mapPanels[n], d = n === o;
      c.classList.toggle("hidden", !d), c.setAttribute("aria-hidden", d ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (s = this.mapPanels[o]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: o,
      previousKey: p,
      tab: this.mapTabs[o],
      panel: this.mapPanels[o],
      target: this.dom
    });
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: o, handler: p } of this._clickHandlers)
        o.removeEventListener("click", p), delete o[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, l, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(o) {
      const p = o.getAttribute("data-ln-tabs-active");
      o[e]._applyActive(p);
    },
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(o) {
        const p = Array.from(o.querySelectorAll("[data-ln-tab]")).map(function(n) {
          return { tagName: n.tagName, href: n.getAttribute("href") };
        }), s = (o.getAttribute("data-ln-tabs-key") || o.id || "").toLowerCase().trim();
        return Me(p, s).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", l = "data-ln-toggle-for", f = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const o = /* @__PURE__ */ new Set();
  let p = null;
  function s(m, b) {
    return b === "open" ? "open" : b === "close" || m === "open" ? "close" : "open";
  }
  function n() {
    p || (p = function(m) {
      if (Qe(m)) return;
      const b = m.target.closest("[" + l + "]");
      if (!b || $e(b)) return;
      const i = b.getAttribute(l);
      if (!i) return;
      const r = document.getElementById(i);
      if (!r || !r[e]) return;
      m.preventDefault();
      const h = b.getAttribute(f) || "toggle", u = r.getAttribute(t);
      r.setAttribute(t, s(u, h));
    }, document.addEventListener("click", p));
  }
  function c() {
    o.size > 0 || !p || (document.removeEventListener("click", p), p = null);
  }
  function d(m, b) {
    if (!m || !m.id) return;
    const i = document.querySelectorAll(
      "[" + l + '="' + m.id + '"]'
    );
    for (let r = 0; r < i.length; r++)
      i[r].setAttribute("aria-expanded", b ? "true" : "false");
  }
  function y(m) {
    this.dom = m;
    const b = this;
    return this._onRequestOpen = function() {
      b.open();
    }, this._onRequestClose = function() {
      b.close();
    }, this._onRequestToggle = function() {
      b.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = m.getAttribute(t) === "open", this.isOpen && m.classList.add("open"), d(m, this.isOpen), o.add(this), n(), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, y.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, s(m, "toggle"));
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), o.delete(this), delete this.dom[e], c(), L(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function g(m) {
    const b = m[e];
    if (!b) return;
    const r = m.getAttribute(t) === "open";
    if (r !== b.isOpen)
      if (r) {
        if (W(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(t, "close");
          return;
        }
        b.isOpen = !0, m.classList.add("open"), d(m, !0), L(m, "ln-toggle:open", { target: m });
      } else {
        if (W(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(t, "open");
          return;
        }
        b.isOpen = !1, m.classList.remove("open"), d(m, !1), L(m, "ln-toggle:close", { target: m });
      }
  }
  U(t, e, y, "ln-toggle", {
    onAttributeChange: g,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  function l(f) {
    return this.dom = f, this._onToggleOpen = function(o) {
      if (o.detail.target.closest("[data-ln-accordion]") !== f) return;
      const p = f.querySelectorAll("[data-ln-toggle]");
      for (const s of p)
        s !== o.detail.target && s.closest("[data-ln-accordion]") === f && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      L(f, "ln-accordion:change", { target: o.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, l, "ln-accordion");
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", l = "data-ln-dropdown-position", f = "data-ln-dropdown-placement", o = "bottom-end";
  if (window[e] !== void 0) return;
  function p(s) {
    this.dom = s, this.toggleEl = s.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = s.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const n = this;
    return this._onRequestOpen = function() {
      n.toggleEl && n.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      n.toggleEl && n.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (n.toggleEl) {
        const c = n.toggleEl.getAttribute("data-ln-toggle");
        n.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const d = n.toggleEl && n.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        d && (c.preventDefault(), c.stopPropagation(), n.toggleEl.setAttribute("data-ln-toggle", "close"), n.triggerBtn && n.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        d && (n.triggerBtn && n.triggerBtn.focus(), n.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const y = n._getMenuItems();
      if (y.length === 0) return;
      if (!d && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), n.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const m = n._getMenuItems();
          m.length > 0 && n._focusItem(m, c.key === "ArrowDown" ? 0 : m.length - 1);
        }, 0);
        return;
      }
      if (!d) return;
      const g = y.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const m = g < y.length - 1 ? g + 1 : 0;
        n._focusItem(y, m);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const m = g > 0 ? g - 1 : y.length - 1;
        n._focusItem(y, m);
      } else c.key === "Home" ? (c.preventDefault(), n._focusItem(y, 0)) : c.key === "End" && (c.preventDefault(), n._focusItem(y, y.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== n.toggleEl || (n.triggerBtn && n.triggerBtn.setAttribute("aria-expanded", "true"), typeof n.toggleEl.showPopover == "function" && n.toggleEl.showPopover(), n._initMenuAria(), n._reposition(), n._addOutsideClickListener(), n._addScrollRepositionListener(), n._addResizeCloseListener(), L(s, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== n.toggleEl || (n.triggerBtn && n.triggerBtn.setAttribute("aria-expanded", "false"), n._removeOutsideClickListener(), n._removeScrollRepositionListener(), n._removeResizeCloseListener(), n.toggleEl.style.top = "", n.toggleEl.style.left = "", n.toggleEl.removeAttribute(f), typeof n.toggleEl.hidePopover == "function" && n.toggleEl.matches(":popover-open") && n.toggleEl.hidePopover(), L(s, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  p.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const s = this.toggleEl.querySelectorAll("li");
    for (const c of s)
      c.setAttribute("role", "none");
    const n = this._getMenuItems();
    for (let c = 0; c < n.length; c++)
      n[c].setAttribute("role", "menuitem"), n[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, p.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, p.prototype._focusItem = function(s, n) {
    for (let c = 0; c < s.length; c++)
      s[c].setAttribute("tabindex", c === n ? "0" : "-1");
    s[n] && s[n].focus();
  }, p.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const s = this.triggerBtn.getBoundingClientRect(), n = ce(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, d = this.dom.getAttribute(l) || o, y = Vt(s, n, d, c);
    this.toggleEl.style.top = y.top + "px", this.toggleEl.style.left = y.left + "px", this.toggleEl.setAttribute(f, y.placement);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const s = this;
    this._boundDocClick = function(n) {
      s.dom.contains(n.target) || s.toggleEl && s.toggleEl.contains(n.target) || s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const s = this;
    this._boundScrollReposition = function() {
      s._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const s = this;
    this._boundResizeClose = function() {
      s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, p.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(f), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, p, "ln-dropdown");
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", l = "data-ln-popover-for", f = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const o = [];
  let p = null;
  function s() {
    p || (p = function(y) {
      if (y.key !== "Escape" || o.length === 0) return;
      o[o.length - 1].close();
    }, document.addEventListener("keydown", p));
  }
  function n() {
    o.length > 0 || p && (document.removeEventListener("keydown", p), p = null);
  }
  function c(y) {
    this.dom = y, this.isOpen = y.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const g = this;
    return this._onRequestOpen = function(m) {
      const b = m.detail && m.detail.trigger ? m.detail.trigger : null;
      g.open(b);
    }, this._onRequestClose = function() {
      g.close();
    }, this._onRequestToggle = function(m) {
      const b = m.detail && m.detail.trigger ? m.detail.trigger : null;
      g.toggle(b);
    }, y.addEventListener("ln-popover:request-open", this._onRequestOpen), y.addEventListener("ln-popover:request-close", this._onRequestClose), y.addEventListener("ln-popover:request-toggle", this._onRequestToggle), y.hasAttribute("tabindex") || y.setAttribute("tabindex", "-1"), y.hasAttribute("role") || y.setAttribute("role", "dialog"), y.hasAttribute("popover") || y.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  c.prototype.open = function(y) {
    this.isOpen || (this.trigger = y || null, this.dom.setAttribute(t, "open"));
  }, c.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, c.prototype.toggle = function(y) {
    this.isOpen ? this.close() : this.open(y);
  }, c.prototype._applyOpen = function(y) {
    this.isOpen = !0, y && (this.trigger = y), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const g = ce(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), h = this.dom.getAttribute(f) || "bottom", u = Vt(r, g, h, 8);
      this.dom.style.top = u.top + "px", this.dom.style.left = u.left + "px", this.dom.setAttribute("data-ln-popover-placement", u.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const m = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), b = Array.prototype.find.call(m, It);
    b ? b.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(r) {
      i.dom.contains(r.target) || i.trigger && i.trigger.contains(r.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const r = i.trigger.getBoundingClientRect(), h = ce(i.dom), u = i.dom.getAttribute(f) || "bottom", _ = Vt(r, h, u, 8);
      i.dom.style.top = _.top + "px", i.dom.style.left = _.left + "px", i.dom.setAttribute("data-ln-popover-placement", _.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), o.push(this), s(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, c.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const y = o.indexOf(this);
    y !== -1 && o.splice(y, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function d(y) {
    this.dom = y;
    const g = y.getAttribute(l);
    return y.setAttribute("aria-haspopup", "dialog"), y.setAttribute("aria-expanded", "false"), y.setAttribute("aria-controls", g), this._onClick = function(m) {
      if (m.ctrlKey || m.metaKey || m.button === 1) return;
      m.preventDefault();
      const b = document.getElementById(g);
      if (!b) return;
      b[e] && (b[e].trigger = y);
      const i = b.getAttribute(t);
      b.setAttribute(t, i === "open" ? "closed" : "open");
    }, y.addEventListener("click", this._onClick), this;
  }
  d.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  }, U(t, e, c, "ln-popover", {
    onAttributeChange: function(y) {
      const g = y[e];
      if (!g) return;
      const b = y.getAttribute(t) === "open";
      if (b !== g.isOpen)
        if (b) {
          if (W(y, "ln-popover:before-open", {
            popoverId: y.id,
            target: y,
            trigger: g.trigger
          }).defaultPrevented) {
            y.setAttribute(t, "closed");
            return;
          }
          g._applyOpen(g.trigger);
        } else {
          if (W(y, "ln-popover:before-close", {
            popoverId: y.id,
            target: y,
            trigger: g.trigger
          }).defaultPrevented) {
            y.setAttribute(t, "open");
            return;
          }
          g._applyClose();
        }
    }
  }), U(l, e + "Trigger", d, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", l = "data-ln-tooltip-position", f = "lnTooltipEnhance", o = "ln-tooltip-portal";
  if (window[f] !== void 0) return;
  let p = 0, s = null, n = null, c = null, d = null, y = null, g = null;
  function m() {
    return s && s.parentNode || (s = document.getElementById(o), s || (s = document.createElement("div"), s.id = o, document.body.appendChild(s)), s.hasAttribute("popover") || s.setAttribute("popover", "manual")), s;
  }
  function b() {
    g || (g = function(_) {
      _.key === "Escape" && h();
    }, document.addEventListener("keydown", g));
  }
  function i() {
    g && (document.removeEventListener("keydown", g), g = null);
  }
  function r(_) {
    if (c === _) return;
    h();
    const E = _.getAttribute(e) || _.getAttribute("title");
    if (!E) return;
    m(), typeof s.showPopover == "function" && s.showPopover(), _.hasAttribute("title") && (d = _.getAttribute("title"), _.removeAttribute("title"));
    const a = _.getAttribute("aria-describedby");
    a ? y = a : y = null;
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = E, _[f + "Uid"] || (p += 1, _[f + "Uid"] = "ln-tooltip-" + p), v.id = _[f + "Uid"], s.appendChild(v);
    const w = v.offsetWidth, A = v.offsetHeight, C = _.getBoundingClientRect(), T = _.getAttribute(l) || "top", x = Vt(C, { width: w, height: A }, T, 6);
    v.style.top = x.top + "px", v.style.left = x.left + "px", v.setAttribute("data-ln-tooltip-placement", x.placement), y ? _.setAttribute("aria-describedby", y + " " + v.id) : _.setAttribute("aria-describedby", v.id), n = v, c = _, b();
  }
  function h() {
    if (!n) {
      i();
      return;
    }
    c && (y !== null ? c.setAttribute("aria-describedby", y) : c.removeAttribute("aria-describedby"), y = null, d !== null && c.setAttribute("title", d)), d = null, n.parentNode && n.parentNode.removeChild(n), n = null, c = null, s && typeof s.hidePopover == "function" && s.matches(":popover-open") && s.hidePopover(), i();
  }
  function u(_) {
    return this.dom = _, _.hasAttribute("data-ln-tooltip-enhanced") || (_.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(_);
    }, this._onLeave = function() {
      c === _ && !_.contains(document.activeElement) && h();
    }, this._onFocus = function() {
      r(_);
    }, this._onBlur = function() {
      c === _ && !_.matches(":hover") && h();
    }, _.addEventListener("mouseenter", this._onEnter), _.addEventListener("mouseleave", this._onLeave), _.addEventListener("focus", this._onFocus, !0), _.addEventListener("blur", this._onBlur, !0), this;
  }
  u.prototype.destroy = function() {
    const _ = this.dom;
    _.removeEventListener("mouseenter", this._onEnter), _.removeEventListener("mouseleave", this._onLeave), _.removeEventListener("focus", this._onFocus, !0), _.removeEventListener("blur", this._onBlur, !0), c === _ && h(), this._addedEnhancedAttr && _.removeAttribute("data-ln-tooltip-enhanced"), delete _[f], delete _[f + "Uid"], L(_, "ln-tooltip:destroyed", { trigger: _ });
  }, U(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    f,
    u,
    "ln-tooltip"
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", l = "ln-toast-item";
  if (window[e] !== void 0) return;
  function f(i) {
    if (!(!i || !(i instanceof HTMLElement)) && (i.hasAttribute("popover") || i.setAttribute("popover", "manual"), typeof i.showPopover == "function")) {
      if (i.matches(":popover-open"))
        try {
          i.hidePopover();
        } catch {
        }
      try {
        i.showPopover();
      } catch {
      }
    }
  }
  function o(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function p(i) {
    this.dom = i, this.timeoutDefault = +(i.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(i.getAttribute("data-ln-toast-max") ?? 5);
    const r = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length > this.max; ) i.removeChild(r.shift());
    for (const h of r) g(h, this);
    return r.length > 0 && f(i), this;
  }
  p.prototype.enqueue = function(i) {
    if (!i) return;
    const r = s(i, this.dom);
    if (!r) return;
    const h = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    c(this, r), h > 0 && (r._timer = setTimeout(() => d(r), h));
  }, p.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      d(i);
  }, p.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(i);
      o(this.dom), L(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function s(i, r) {
    const h = ((i.type || "") + "").trim().toLowerCase(), u = gt(r, l, "ln-toast");
    if (!u)
      return console.warn('[ln-toast] Template "' + l + '" not found'), null;
    ot(u, {
      type: h,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const _ = u.firstElementChild;
    if (!_) return null;
    _.hasAttribute("data-ln-toast-item") || _.setAttribute("data-ln-toast-item", ""), _.classList.add("ln-enter");
    const E = _.querySelector(".body");
    E && n(E, i);
    const a = _.querySelector("[data-ln-toast-close]");
    return a && a.addEventListener("click", function() {
      d(_);
    }), _;
  }
  function n(i, r) {
    if (Array.isArray(r.message)) {
      const h = document.createElement("ul");
      for (const u of r.message) {
        const _ = document.createElement("li");
        _.textContent = u, h.appendChild(_);
      }
      i.appendChild(h);
    }
    if (r.data && r.data.errors) {
      const h = document.createElement("ul");
      for (const u of Object.values(r.data.errors).flat()) {
        const _ = document.createElement("li");
        _.textContent = u, h.appendChild(_);
      }
      i.appendChild(h);
    }
  }
  function c(i, r) {
    const h = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; h.length >= i.max && h.length > 0; ) i.dom.removeChild(h.shift());
    i.dom.appendChild(r), f(i.dom), requestAnimationFrame(() => r.classList.remove("ln-enter"));
  }
  function d(i) {
    if (!i || !i.parentNode) return;
    const r = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), o(r));
    }, 200);
  }
  function y(i) {
    let r = i && i.container;
    return typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), r || null;
  }
  function g(i, r) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const h = i.querySelector("[data-ln-toast-close]");
    h && h.addEventListener("click", function() {
      d(i);
    });
    const u = +(i.getAttribute("data-ln-toast-timeout") ?? r.timeoutDefault);
    u > 0 && (i._timer = setTimeout(function() {
      d(i);
    }, u));
  }
  function m(i) {
    const r = i.detail || {}, h = y(r);
    if (!h) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (h[e] || (h[e] = new p(h))).enqueue(r);
  }
  function b(i) {
    const r = i && i.detail || {};
    if (r.container) {
      const h = y(r);
      h && (h[e] || (h[e] = new p(h))).clear();
    } else {
      const h = document.querySelectorAll("[" + t + "]");
      for (const u of Array.from(h))
        (u[e] || (u[e] = new p(u))).clear();
    }
  }
  at(function() {
    window.addEventListener("ln-toast:enqueue", m), window.addEventListener("ln-toast:clear", b), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + t + "]");
      for (const r of Array.from(i))
        r.querySelectorAll("[data-ln-toast-item]").length > 0 && f(r);
    });
  }, "ln-toast"), U(t, e, p, "ln-toast");
})();
function Si(t) {
  if (!t) return null;
  const e = String(t).split(",").map((l) => l.trim().toLowerCase()).filter(Boolean).map((l) => l.startsWith(".") ? l.slice(1) : l);
  return e.length ? e : null;
}
function Cn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Ci(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const l = Cn(t.name), f = String(t.type || "").toLowerCase();
  return e.some((o) => {
    if (o.includes("/")) {
      if (o.endsWith("/*")) {
        const p = o.slice(0, -1);
        return f.startsWith(p);
      }
      return f === o;
    }
    return l === o;
  });
}
function Li(t, e = "en", l = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (l["unit-b"] || "B");
  const f = 1024, o = [
    l["unit-b"] || "B",
    l["unit-kb"] || "KB",
    l["unit-mb"] || "MB",
    l["unit-gb"] || "GB"
  ], p = Math.floor(Math.log(t) / Math.log(f)), s = Math.min(p, o.length - 1), n = t / Math.pow(f, s);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(n) + " " + o[s];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", l = "data-ln-upload-dict", f = "data-ln-upload-accept", o = "data-ln-upload-delete", p = "data-ln-upload-max-size", s = "data-ln-upload-max-files", n = "data-ln-upload-file-field", c = "data-ln-upload-ids-field", d = "file", y = "file_ids[]";
  if (window[e] !== void 0) return;
  function g(i, r, h) {
    return Li(i, r, h);
  }
  function m() {
    const i = document.querySelector('meta[name="csrf-token"]');
    return i ? i.getAttribute("content") : "";
  }
  function b(i) {
    this.dom = i, this.dict = $t(i, l), this.locale = G(i), this.zone = i.querySelector("[data-ln-upload-zone]") || i, this.list = i.querySelector("[data-ln-upload-list]"), this.input = i.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', i), this.uploadUrl = i.getAttribute(t) || "", this.deleteUrlPattern = i.getAttribute(o) || "", this.fileFieldName = i.getAttribute(n) || d, this.idsFieldName = i.getAttribute(c) || y, this.maxSize = +i.getAttribute(p) || 0, this.maxFiles = +i.getAttribute(s) || 0;
    const r = i.getAttribute(f) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Si(r), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  b.prototype._hydrate = function() {
    const i = this;
    if (!this.list) return;
    const r = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < r.length; u++) {
      const _ = r[u], E = _.getAttribute("data-ln-upload-id"), a = "file-" + ++i.fileIdCounter;
      _.setAttribute("data-ln-upload-local-id", a);
      const v = _.querySelector('[data-ln-field="name"]'), w = _.querySelector('[data-ln-field="sizeText"]'), A = _.getAttribute("data-ln-upload-size"), C = A ? parseInt(A, 10) : null;
      i.uploadedFiles.set(a, {
        serverId: E || null,
        name: v ? v.textContent.trim() : "",
        size: C !== null && !isNaN(C) ? C : w ? w.textContent.trim() : ""
      });
    }
    const h = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < h.length; u++) {
      const _ = h[u];
      if (_.name === i.idsFieldName && _.value && !Array.from(i.uploadedFiles.values()).some(function(a) {
        return String(a.serverId) === String(_.value);
      })) {
        const a = "file-" + ++i.fileIdCounter;
        i.uploadedFiles.set(a, {
          serverId: _.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, b.prototype._syncHiddenInputs = function() {
    const i = this, r = this.dom.querySelectorAll('input[type="hidden"]');
    for (let h = 0; h < r.length; h++)
      r[h].name === i.idsFieldName && r[h].remove();
    for (const [, h] of this.uploadedFiles)
      if (h.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = i.idsFieldName, u.value = h.serverId, i.dom.appendChild(u);
      }
  }, b.prototype._bindEvents = function() {
    const i = this;
    this._onZoneClick = function(r) {
      i.zone === i.dom && r.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || i.input && r.target !== i.input && i.input.click();
    }, this._onInputChange = function() {
      i.input && i.input.files && (i.upload(i.input.files), i.input.value = "");
    }, this._onDragEnter = function(r) {
      r.preventDefault(), r.stopPropagation(), i._dragDepth++, i.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(r) {
      r.preventDefault(), r.stopPropagation(), i.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(r) {
      r.preventDefault(), r.stopPropagation(), i._dragDepth--, i._dragDepth <= 0 && (i._dragDepth = 0, i.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(r) {
      r.preventDefault(), r.stopPropagation(), i._dragDepth = 0, i.zone.removeAttribute("data-ln-upload-state"), r.dataTransfer && r.dataTransfer.files && i.upload(r.dataTransfer.files);
    }, this._onListClick = function(r) {
      const h = r.target.closest('[data-ln-upload-action="remove"]');
      if (!h || !i.list || !i.list.contains(h) || h.disabled) return;
      const u = h.closest("[data-ln-upload-item]");
      if (u) {
        const _ = u.getAttribute("data-ln-upload-local-id");
        _ && i.remove(_);
      }
    }, this._onRequestUpload = function(r) {
      r.detail && r.detail.files && i.upload(r.detail.files);
    }, this._onRequestRemove = function(r) {
      if (r.detail) {
        const h = r.detail.localId !== void 0 ? r.detail.localId : r.detail.serverId;
        h !== void 0 && i.remove(h);
      }
    }, this._onRequestClear = function() {
      i.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, b.prototype.upload = function(i) {
    const r = this, h = Array.from(i);
    for (let u = 0; u < h.length; u++) {
      const _ = h[u];
      if (r.maxFiles > 0 && r.uploadedFiles.size >= r.maxFiles) {
        L(r.dom, "ln-upload:invalid", {
          file: _,
          reason: "max-files"
        });
        continue;
      }
      if (!Ci(_, r.allowedExts)) {
        L(r.dom, "ln-upload:invalid", {
          file: _,
          reason: "accept"
        });
        continue;
      }
      if (r.maxSize > 0 && _.size > r.maxSize) {
        L(r.dom, "ln-upload:invalid", {
          file: _,
          reason: "max-size"
        });
        continue;
      }
      W(r.dom, "ln-upload:before-upload", { file: _ }).defaultPrevented || r._uploadSingleFile(_);
    }
  }, b.prototype._uploadSingleFile = function(i) {
    const r = this, h = "file-" + ++r.fileIdCounter, u = Cn(i.name);
    let _ = null;
    if (this.list) {
      const A = gt(this.dom, "ln-upload-item", "ln-upload");
      if (A && (_ = A.firstElementChild, _)) {
        _.setAttribute("data-ln-upload-item", ""), _.setAttribute("data-ln-upload-local-id", h), _.setAttribute("data-ln-upload-ext", u), _.setAttribute("data-ln-upload-state", "uploading"), ot(_, {
          name: i.name,
          sizeText: "0%",
          removeLabel: r.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const C = _.querySelector('[data-ln-upload-action="remove"]');
        C && (C.disabled = !0);
        const T = _.querySelector("[data-ln-progress]");
        T && T.setAttribute("data-ln-progress", "0"), r.list.appendChild(_);
      }
    }
    const E = new FormData();
    E.append(r.fileFieldName, i);
    const a = this.dom.querySelectorAll("input, select, textarea");
    for (let A = 0; A < a.length; A++) {
      const C = a[A];
      !C.name || C.name === r.idsFieldName || C.type === "file" || (C.type === "checkbox" || C.type === "radio") && !C.checked || E.append(C.name, C.value);
    }
    const v = new XMLHttpRequest();
    r.uploadedFiles.set(h, {
      serverId: null,
      name: i.name,
      size: i.size,
      xhr: v
    }), v.upload.addEventListener("progress", function(A) {
      if (A.lengthComputable) {
        const C = Math.round(A.loaded / A.total * 100);
        if (_) {
          const T = _.querySelector("[data-ln-progress]");
          T && T.setAttribute("data-ln-progress", String(C)), ot(_, { sizeText: C + "%" });
        }
        L(r.dom, "ln-upload:progress", {
          localId: h,
          file: i,
          percent: C,
          loaded: A.loaded,
          total: A.total
        });
      }
    }), v.addEventListener("load", function() {
      const A = r.uploadedFiles.get(h);
      if (A && delete A.xhr, v.status >= 200 && v.status < 300) {
        let C;
        try {
          C = JSON.parse(v.responseText);
        } catch (x) {
          w(r.dict.error || "Error", v.status, x);
          return;
        }
        const T = C.id || C.serverId;
        if (_) {
          _.removeAttribute("data-ln-upload-state"), T && _.setAttribute("data-ln-upload-id", String(T)), ot(_, {
            sizeText: g(C.size || i.size, r.locale, r.dict),
            uploading: !1
          });
          const x = _.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        A && (A.serverId = T, A.size = C.size || i.size, A.name = C.name || i.name), r._syncHiddenInputs(), L(r.dom, "ln-upload:uploaded", {
          localId: h,
          serverId: T,
          name: C.name || i.name,
          size: C.size || i.size,
          response: C
        });
      } else {
        let C = "";
        try {
          C = JSON.parse(v.responseText).message || "";
        } catch {
        }
        w(C, v.status, null);
      }
    }), v.addEventListener("error", function() {
      const A = r.uploadedFiles.get(h);
      A && delete A.xhr, w("", 0, null);
    });
    function w(A, C, T) {
      if (_) {
        _.setAttribute("data-ln-upload-state", "error"), ot(_, {
          sizeText: r.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = _.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      L(r.dom, "ln-upload:error", {
        file: i,
        message: A,
        status: C,
        error: T
      });
    }
    r.uploadUrl ? (v.open("POST", r.uploadUrl), v.setRequestHeader("X-CSRF-TOKEN", m()), v.setRequestHeader("X-Requested-With", "XMLHttpRequest"), v.setRequestHeader("Accept", "application/json"), v.send(E)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, b.prototype.remove = function(i) {
    const r = this;
    let h = null, u = null;
    if (r.uploadedFiles.has(i))
      h = i, u = r.uploadedFiles.get(i);
    else
      for (const [v, w] of r.uploadedFiles)
        if (String(w.serverId) === String(i)) {
          h = v, u = w;
          break;
        }
    if (!h || !u || W(r.dom, "ln-upload:before-remove", {
      localId: h,
      serverId: u.serverId
    }).defaultPrevented) return;
    const E = r.list ? r.list.querySelector('[data-ln-upload-local-id="' + h + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      E && E.remove(), r.uploadedFiles.delete(h), r._syncHiddenInputs(), L(r.dom, "ln-upload:removed", { localId: h, serverId: null });
      return;
    }
    let a = null;
    if (r.deleteUrlPattern ? a = r.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (a = r.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !a) {
      E && E.remove(), r.uploadedFiles.delete(h), r._syncHiddenInputs(), L(r.dom, "ln-upload:removed", { localId: h, serverId: u.serverId });
      return;
    }
    E && (E.setAttribute("data-ln-upload-state", "deleting"), ot(E, { deleting: !0 })), fetch(a, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": m(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(v) {
      v.ok ? (E && E.remove(), r.uploadedFiles.delete(h), r._syncHiddenInputs(), L(r.dom, "ln-upload:removed", {
        localId: h,
        serverId: u.serverId
      })) : (E && (E.removeAttribute("data-ln-upload-state"), ot(E, { deleting: !1 })), L(r.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: v.status
      }));
    }).catch(function(v) {
      E && (E.removeAttribute("data-ln-upload-state"), ot(E, { deleting: !1 })), L(r.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: 0,
        error: v
      });
    });
  }, b.prototype.clear = function() {
    const i = this;
    if (!W(i.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, h] of this.uploadedFiles)
        if (h.xhr && typeof h.xhr.abort == "function" && h.xhr.abort(), h.serverId) {
          let u = null;
          i.deleteUrlPattern ? u = i.deleteUrlPattern.replace("{id}", encodeURIComponent(h.serverId)) : i.uploadUrl && i.uploadUrl.includes("{id}") && (u = i.uploadUrl.replace("{id}", encodeURIComponent(h.serverId))), u && fetch(u, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": m(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      i.uploadedFiles.clear(), i.list && (i.list.innerHTML = ""), i._syncHiddenInputs(), L(i.dom, "ln-upload:cleared", {});
    }
  }, b.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return i.serverId;
    }).filter(Boolean);
  }, b.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return {
        serverId: i.serverId,
        name: i.name,
        size: i.size
      };
    });
  }, b.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, i] of this.uploadedFiles)
        i.xhr && typeof i.xhr.abort == "function" && i.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, L(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, b, "ln-upload");
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function l(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !e(n)) return;
    n.target = "_blank";
    const c = (n.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), n.rel = c.join(" ");
    const d = document.createElement("span");
    d.className = "sr-only", d.textContent = "(opens in new tab)", n.appendChild(d), n.setAttribute("data-ln-external-link", "processed"), L(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function f(n) {
    n = n || document.body;
    for (const c of n.querySelectorAll("a, area"))
      l(c);
  }
  function o() {
    at(function() {
      document.body.addEventListener("click", function(n) {
        const c = n.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && L(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    at(function() {
      new MutationObserver(function(c) {
        for (const d of c)
          if (d.type === "childList") {
            for (const y of d.addedNodes)
              if (y.nodeType === 1 && (y.matches && (y.matches("a") || y.matches("area")) && l(y), y.querySelectorAll))
                for (const g of y.querySelectorAll("a, area"))
                  l(g);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Mt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && l(c);
      });
    }, "ln-external-links");
  }
  function s() {
    o(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      f();
    }) : f();
  }
  window[t] = {
    process: f
  }, s();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let l = null;
  function f() {
    l = document.createElement("div"), l.className = "ln-link-status", document.body.appendChild(l);
  }
  function o(u) {
    l && (l.textContent = u, l.classList.add("ln-link-status--visible"));
  }
  function p() {
    l && l.classList.remove("ln-link-status--visible");
  }
  function s(u, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const E = u.querySelector("a");
    if (!E) return;
    const a = E.getAttribute("href");
    if (!a) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(a, "_blank", "noopener,noreferrer");
      return;
    }
    W(u, "ln-link:navigate", { target: u, href: a, link: E }).defaultPrevented || E.click();
  }
  function n(u) {
    const _ = u.querySelector("a");
    if (!_) return;
    const E = _.getAttribute("href");
    E && o(E);
  }
  function c() {
    p();
  }
  function d(u) {
    u[e + "Row"] || !u.querySelector("a") || (u[e + "Row"] = !0, u._lnLinkClick = function(E) {
      s(u, E);
    }, u._lnLinkEnter = function() {
      n(u);
    }, u.addEventListener("click", u._lnLinkClick), u.addEventListener("mouseenter", u._lnLinkEnter), u.addEventListener("mouseleave", c));
  }
  function y(u) {
    u[e + "Row"] && (u._lnLinkClick && u.removeEventListener("click", u._lnLinkClick), u._lnLinkEnter && u.removeEventListener("mouseenter", u._lnLinkEnter), u.removeEventListener("mouseleave", c), delete u._lnLinkClick, delete u._lnLinkEnter, delete u[e + "Row"]);
  }
  function g(u) {
    if (!u[e + "Init"]) return;
    const _ = u.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && u.querySelector("tbody") || u;
      for (const a of E.querySelectorAll("tr"))
        y(a);
    } else
      y(u);
    delete u[e + "Init"];
  }
  function m(u) {
    if (u[e + "Init"]) return;
    u[e + "Init"] = !0;
    const _ = u.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && u.querySelector("tbody") || u;
      for (const a of E.querySelectorAll("tr"))
        d(a);
    } else
      d(u);
  }
  function b(u) {
    u.hasAttribute && u.hasAttribute(t) && m(u);
    const _ = u.querySelectorAll ? u.querySelectorAll("[" + t + "]") : [];
    for (const E of _)
      m(E);
  }
  function i() {
    at(function() {
      new MutationObserver(function(_) {
        for (const E of _)
          if (E.type === "childList") {
            for (const a of E.addedNodes)
              if (a.nodeType === 1) {
                b(a);
                const v = a.closest("[" + t + "]");
                if (v)
                  if (a.tagName === "TR")
                    d(a);
                  else {
                    const w = v.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = a.querySelectorAll ? a.querySelectorAll("tr") : [];
                      for (const C of A)
                        d(C);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Mt([t], function(_) {
        _.hasAttribute && _.hasAttribute(t) ? b(_) : g(_);
      });
    }, "ln-link");
  }
  function r(u) {
    b(u);
  }
  window[e] = { init: r, destroy: g };
  function h() {
    f(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
const Dt = ["Ctrl", "Alt", "Shift", "Meta"], Ti = {
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
function Ln(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const l = Ti[e.toLowerCase()];
  return l || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Tn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const l = e.split("+"), f = /* @__PURE__ */ new Set();
  let o = "";
  for (let s = 0; s < l.length; s++) {
    const n = Ln(l[s]);
    if (!n) return "";
    if (Dt.indexOf(n) !== -1) {
      f.add(n);
      continue;
    }
    if (o) return "";
    o = n;
  }
  if (!o) return "";
  const p = [];
  for (let s = 0; s < Dt.length; s++)
    f.has(Dt[s]) && p.push(Dt[s]);
  return p.push(o), p.join("+");
}
function qi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const l = e.split(/[\s,]+/), f = [];
  for (let o = 0; o < l.length; o++) {
    const p = Tn(l[o]);
    p && f.indexOf(p) === -1 && f.push(p);
  }
  return f;
}
function xi(t, e) {
  const l = String(e || "").trim();
  if (!l || /[\s,]/.test(l)) return "";
  const f = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(f) ? "" : Tn(f ? f + "+" + l : l);
}
function ki(t) {
  if (!t) return "";
  const e = Ln(t.key);
  if (!e || Dt.indexOf(e) !== -1) return "";
  const l = [];
  return t.ctrlKey && l.push("Ctrl"), t.altKey && l.push("Alt"), t.shiftKey && l.push("Shift"), t.metaKey && l.push("Meta"), l.push(e), l.join("+");
}
function Di(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const l = t.getAttribute("contenteditable");
    if (l === "" || String(l).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Ii(t, e, l, f) {
  if (!t || !e || l !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const o = String(e.tagName || "").toLowerCase();
  return o === "button" ? f === "Enter" || f === "Space" : o === "a" && e.hasAttribute && e.hasAttribute("href") && f === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", l = "data-ln-key-target", f = "data-ln-key-allow-input", o = "data-ln-key-modifier", p = "data-ln-key-for", s = "lnKeyFor";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new Set();
  let c = null;
  function d() {
    c || (c = function(i) {
      if (i.defaultPrevented || i.isComposing || i.repeat) return;
      const r = ki(i);
      if (!r) return;
      const h = Gn(i.target), u = document.querySelectorAll("[" + t + "], [" + p + "]");
      let _ = null, E = !1, a = !1;
      for (let A = 0; A < u.length; A++) {
        const C = u[A], T = C[e] || C[s];
        if (!T || !T.matches(r) || h && !T.allowsInput()) continue;
        const x = T.resolveTarget(), D = Di(x);
        if (!(!D || !Qn(x, D))) {
          if (Ii(i, x, D, r)) {
            a = !0;
            continue;
          }
          _ ? E = !0 : _ = { host: C, target: x, action: D };
        }
      }
      if (a || !_) return;
      E && console.warn('[ln-key] Duplicate active shortcut "' + r + '"; first DOM match wins.');
      const v = {
        source: _.host,
        target: _.target,
        action: _.action,
        key: r,
        event: i
      };
      W(_.host, "ln-key:before-trigger", v).defaultPrevented || (i.preventDefault(), _.target[_.action](), L(_.host, "ln-key:trigger", v));
    }, document.addEventListener("keydown", c));
  }
  function y() {
    n.size > 0 || !c || (document.removeEventListener("keydown", c), c = null);
  }
  function g(i) {
    return this.dom = i, this.shortcuts = [], n.add(this), this.sync(), d(), this;
  }
  g.prototype.sync = function() {
    this.shortcuts = qi(this.dom.getAttribute(t));
  }, g.prototype.matches = function(i) {
    return this.shortcuts.indexOf(i) !== -1;
  }, g.prototype.allowsInput = function() {
    return this.dom.hasAttribute(f);
  }, g.prototype.resolveTarget = function() {
    const i = this.dom.getAttribute(l);
    return i ? b(i, l) : this.dom;
  }, g.prototype.destroy = function() {
    this.dom[e] && (n.delete(this), delete this.dom[e], y(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function m(i) {
    return this.dom = i, n.add(this), d(), this;
  }
  m.prototype._modifierContext = function() {
    return this.dom.closest("[" + o + "]");
  }, m.prototype.shortcut = function() {
    const i = this._modifierContext(), r = i ? i.getAttribute(o) : "";
    return xi(r, this.dom.textContent);
  }, m.prototype.matches = function(i) {
    return this.shortcut() === i;
  }, m.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(f)) return !0;
    const i = this._modifierContext();
    return !!(i && i.hasAttribute(f));
  }, m.prototype.resolveTarget = function() {
    return b(this.dom.getAttribute(p), p);
  }, m.prototype.destroy = function() {
    this.dom[s] && (n.delete(this), delete this.dom[s], y(), L(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function b(i, r) {
    if (!i) return null;
    try {
      const h = document.querySelector(i);
      return h || console.warn("[ln-key] Target not found for " + r + ' selector "' + i + '".'), h;
    } catch {
      return console.warn("[ln-key] Invalid " + r + ' selector "' + i + '".'), null;
    }
  }
  U(t, e, g, "ln-key", {
    extraAttributes: [l, f],
    onAttributeChange: function(i) {
      const r = i[e];
      if (r) {
        if (!i.hasAttribute(t)) {
          r.destroy();
          return;
        }
        r.sync();
      }
    }
  }), U(p, s, m, "ln-key-for", {
    onAttributeChange: function(i) {
      const r = i[s];
      r && !i.hasAttribute(p) && r.destroy();
    }
  });
})();
function Ri(t, e, l = 100) {
  if (e != null && e !== "") {
    const f = parseFloat(String(e));
    if (!isNaN(f) && f > 0) return f;
  }
  if (t != null && t !== "") {
    const f = parseFloat(String(t));
    if (!isNaN(f) && f > 0) return f;
  }
  return l;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function l(p) {
    return this.dom = p, this._parentObserver = null, o.call(this), f.call(this), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function f() {
    const p = this, s = this.dom.parentElement;
    if (!s) return;
    const n = new MutationObserver(function(c) {
      for (const d of c)
        d.attributeName === "data-ln-progress-max" && o.call(p);
    });
    n.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function o() {
    const p = this.dom.getAttribute("data-ln-progress"), s = this.dom.parentElement, n = s ? s.getAttribute("data-ln-progress-max") : null, c = this.dom.getAttribute("data-ln-progress-max"), d = Ri(c, n, 100), y = hn(p, d);
    this.dom.style.width = y.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(y.min)), this.dom.setAttribute("aria-valuemax", String(y.max)), this.dom.setAttribute("aria-valuenow", String(y.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: y.value,
      max: y.max,
      percentage: y.percentage
    });
  }
  U(
    t,
    e,
    l,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(p) {
        const s = p[e];
        s && o.call(s);
      }
    }
  );
})();
function Oi(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let l = 0; l < t.length; l++)
    if (t[l] !== e[l]) return !0;
  return !1;
}
function Mi(t, e) {
  if (!e || typeof e != "object") return !0;
  const l = Object.keys(e);
  if (l.length === 0) return !0;
  for (let f = 0; f < l.length; f++) {
    const o = e[l[f]], p = t[o.col] || "";
    if (!ve(p, o.values))
      return !1;
  }
  return !0;
}
function Fi(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const l = [];
  for (let f = 0; f < t.length; f++) {
    const o = t[f];
    !e && o.key && (e = o.key), o.checked && !o.isReset && o.value && l.push(o.value);
  }
  return { key: e, values: l };
}
function Ni(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Ne(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", l = "data-ln-filter-key", f = "data-ln-filter-value", o = "data-ln-filter-hide", p = "data-ln-filter-reset", s = "data-ln-filter-col", n = "data-ln-hash", c = "data-ln-filter-values", d = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  function y(r) {
    return r.hasAttribute(p) || !r.getAttribute(f);
  }
  function g(r) {
    const h = r.dom.querySelectorAll("[" + l + "]"), u = [];
    for (let E = 0; E < h.length; E++) {
      const a = h[E];
      u.push({
        key: a.getAttribute(l),
        value: a.getAttribute(f) || "",
        checked: a.checked,
        isReset: y(a)
      });
    }
    const _ = Fi(u);
    return { key: _.key, values: _.values, targetId: r.targetId };
  }
  function m(r, h, u) {
    const _ = r.querySelectorAll("[" + l + "]"), E = Array.isArray(u) && u.length > 0;
    for (let a = 0; a < _.length; a++) {
      const v = _[a];
      y(v) ? v.checked = !E : E && v.getAttribute(l) === h && u.indexOf(v.getAttribute(f)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function b(r) {
    this.dom = r, this.targetId = r.getAttribute(t);
    const h = r.getAttribute(s);
    this.colIndex = h !== null ? parseInt(h, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = dt(r, "filter"), this.hashEnabled = !!this.nsKey;
    const u = this, _ = Xt(function() {
      u._render();
    });
    this._queueRender = _, this._attachHandlers(), this._onHashChange = function() {
      if (u._destroyed || !u.hashEnabled) return;
      const a = X(u.nsKey), v = le(a);
      v && v.key && v.values.length > 0 ? m(u.dom, v.key, v.values) : m(u.dom, null, []), u._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let E = !1;
    if (this.hashEnabled) {
      const a = X(this.nsKey), v = le(a);
      v && v.key && v.values.length > 0 && (m(r, v.key, v.values), st(function() {
        u._destroyed || u._render();
      }), E = !0);
    }
    if (!E) {
      const a = Ne(r.getAttribute(c));
      if (a.length > 0) {
        const v = r.querySelector("[" + l + "]"), w = v ? v.getAttribute(l) : null;
        w && (m(r, w, a), st(function() {
          u._destroyed || u._render();
        }), E = !0);
      }
    }
    if (!E) {
      const a = r.querySelectorAll("[" + l + "]");
      for (let v = 0; v < a.length; v++)
        if (a[v].checked && !y(a[v])) {
          st(function() {
            u._destroyed || u._render();
          });
          break;
        }
    }
    return this;
  }
  b.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(h) {
      const u = h.target;
      if (!u || !u.hasAttribute || !u.hasAttribute(l)) return;
      const _ = Array.from(r.dom.querySelectorAll("[" + l + "]"));
      if (y(u)) {
        for (let E = 0; E < _.length; E++)
          y(_[E]) || (_[E].checked = !1);
        u.checked = !0, r._queueRender();
        return;
      }
      if (u.checked) {
        for (let a = 0; a < _.length; a++)
          y(_[a]) && (_[a].checked = !1);
        let E = !1;
        for (let a = 0; a < _.length; a++)
          if (y(_[a])) {
            E = !0;
            break;
          }
        if (E) {
          let a = !0;
          for (let v = 0; v < _.length; v++)
            if (!y(_[v]) && !_[v].checked) {
              a = !1;
              break;
            }
          if (a)
            for (let v = 0; v < _.length; v++)
              y(_[v]) ? _[v].checked = !0 : _[v].checked = !1;
        }
      } else {
        let E = !1;
        for (let a = 0; a < _.length; a++)
          if (!y(_[a]) && _[a].checked) {
            E = !0;
            break;
          }
        if (!E)
          for (let a = 0; a < _.length; a++)
            y(_[a]) && (_[a].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, b.prototype._render = function() {
    const r = this, h = g(this), u = this._lastSnapshot;
    if (!(!u || u.key !== h.key || Oi(u.values, h.values))) return;
    const E = h.key === null || h.values.length === 0, a = document.getElementById(r.targetId), v = {
      key: h.key,
      values: h.values.slice(),
      targetId: r.targetId
    };
    L(r.dom, "ln-filter:change", v);
    let w = !1;
    a && a !== r.dom && W(a, "ln-filter:change", v).defaultPrevented && (w = !0);
    const A = u && u.values.length > 0, C = h.values.length === 0;
    if (A && C) {
      const x = { targetId: r.targetId };
      L(r.dom, "ln-filter:reset", x), a && a !== r.dom && L(a, "ln-filter:reset", x);
    }
    this._lastSnapshot = { key: h.key, values: h.values.slice() };
    const T = Ni(h.values);
    if (T ? this.dom.setAttribute(c, T) : this.dom.removeAttribute(c), this.hashEnabled) {
      const x = un(h.key, h.values);
      nt(this.nsKey, x);
    }
    if (!w)
      if (r.colIndex !== null)
        r._filterTableRows(h);
      else {
        if (!a) return;
        const x = a.children;
        for (let D = 0; D < x.length; D++) {
          const R = x[D];
          if (R.removeAttribute(o), E) continue;
          const M = R.getAttribute("data-" + h.key);
          M !== null && (ve(M, h.values) || R.setAttribute(o, "true"));
        }
      }
  }, b.prototype._filterTableRows = function(r) {
    const h = document.getElementById(this.targetId);
    if (!h) return;
    const u = h.tagName === "TABLE" ? h : h.querySelector("table");
    if (!u) return;
    const _ = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, E = r.values;
    d.has(u) || d.set(u, {});
    const a = d.get(u);
    _ && E.length > 0 ? a[_] = { col: this.colIndex, values: E.slice() } : _ && delete a[_];
    const v = u.tBodies;
    for (let w = 0; w < v.length; w++) {
      const A = v[w].rows;
      for (let C = 0; C < A.length; C++) {
        const T = A[C], x = {};
        for (let D = 0; D < T.cells.length; D++)
          x[D] = T.cells[D].textContent.trim();
        Mi(x, a) ? T.removeAttribute(o) : T.setAttribute(o, "true");
      }
    }
  }, b.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const h = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (h && d.has(h)) {
            const u = d.get(h), _ = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            _ && u[_] && delete u[_], Object.keys(u).length === 0 && d.delete(h);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
    }
  };
  function i(r, h) {
    const u = r[e];
    if (!(!u || u._destroyed)) {
      if (h === n)
        u.hashEnabled && u._onHashChange && window.removeEventListener("hashchange", u._onHashChange), u.nsKey = dt(r, "filter"), u.hashEnabled = !!u.nsKey, u.hashEnabled && window.addEventListener("hashchange", u._onHashChange);
      else if (h === c) {
        const _ = Ne(r.getAttribute(c)), E = r.querySelector("[" + l + "]"), a = E ? E.getAttribute(l) : null;
        a && (m(r, a, _), u._render());
      }
    }
  }
  U(t, e, b, "ln-filter", {
    extraAttributes: [n, c],
    onAttributeChange: i,
    persist: {
      attr: c,
      hashActive: function(r) {
        return !!dt(r, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", l = "data-ln-search-for", f = "lnSearchControl", o = "data-ln-search-items", p = "data-ln-search-fields", s = "data-ln-search-exclude", n = "data-ln-search-hide", c = "data-ln-hash";
  if (window[e] !== void 0) return;
  function d(_) {
    const E = dt(_, "search");
    if (E) return E;
    if (_.id) {
      const a = document.querySelector("[" + l + '="' + _.id + '"]');
      if (a) {
        const v = dt(a, "search");
        if (v) return v;
      }
    }
    return null;
  }
  function y(_) {
    return _.matches("input, textarea") ? _ : _.querySelector("input, textarea");
  }
  function g(_, E) {
    const a = _.childNodes;
    for (let v = 0; v < a.length; v++) {
      const w = a[v];
      if (w.nodeType === 3) {
        E.push(w.nodeValue);
        continue;
      }
      w.nodeType === 1 && (w.hasAttribute(s) || g(w, E));
    }
  }
  function m(_) {
    if (_._lnSearchText !== void 0) return _._lnSearchText;
    const E = [];
    g(_, E);
    const a = oi(E);
    return _._lnSearchText = a, a;
  }
  function b(_, E) {
    if (!_.id) return;
    const a = document.querySelectorAll("[" + l + '="' + _.id + '"]');
    for (const v of a) {
      const w = y(v);
      w && w.value !== E && (w.value = E);
    }
  }
  function i(_) {
    this.dom = _, this.term = _.getAttribute(t) || "", this._destroyed = !1;
    const E = this;
    return this.nsKey = d(_), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const a = X(E.nsKey), v = E.dom.getAttribute(t) || "";
      a !== null && a !== v ? E.dom.setAttribute(t, a) : a === null && v !== "" && E.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), st(function() {
      if (!E._destroyed) {
        if (E.hashEnabled) {
          const a = X(E.nsKey);
          if (a !== null && a !== E.term) {
            E.term = a, E.dom.setAttribute(t, a), b(E.dom, a), E._apply();
            return;
          }
        }
        de(E.term) && (b(E.dom, E.term), E._apply());
      }
    }), this;
  }
  i.prototype._apply = function() {
    const _ = this.dom, E = de(this.term), a = pn(E);
    this.hashEnabled && nt(this.nsKey, this.term ? this.term : null);
    const v = ri(_.getAttribute(p));
    if (W(_, "ln-search:change", {
      term: E,
      tokens: a,
      targetId: _.id,
      fields: v
    }).defaultPrevented) return;
    const A = _.getAttribute(o), C = A ? _.querySelectorAll(A) : _.children;
    for (let T = 0; T < C.length; T++) {
      const x = C[T];
      if (x.removeAttribute(n), x.hasAttribute(s) || a.length === 0) continue;
      const D = m(x);
      mn(D, a) || x.setAttribute(n, "true");
    }
  }, i.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function r(_) {
    if (this.dom = _, this.targetId = _.getAttribute(l), this.input = y(_), this._attachHandler(), this.input && this.input.value.trim()) {
      const E = this;
      st(function() {
        const a = document.getElementById(E.targetId);
        a && ((a.getAttribute(t) || "").trim() || E._write(E.input.value));
      });
    }
    return this;
  }
  r.prototype._write = function(_) {
    const E = document.getElementById(this.targetId);
    E && E.getAttribute(t) !== _ && E.setAttribute(t, _);
  }, r.prototype._attachHandler = function() {
    if (!this.input) return;
    const _ = this;
    this._onInput = function() {
      _._write(_.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, r.prototype.destroy = function() {
    this.dom[f] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[f]);
  };
  function h(_) {
    const E = _.getAttribute("data-ln-search-clear-for");
    if (E) {
      const C = document.getElementById(E), T = document.querySelector("[" + l + '="' + E + '"]'), x = T ? y(T) : null;
      return { target: C, input: x };
    }
    const a = _.closest("[" + t + "]");
    if (a) {
      const C = a.id ? document.querySelector("[" + l + '="' + a.id + '"]') : null, T = C ? y(C) : null;
      return { target: a, input: T };
    }
    const v = _.closest("[data-ln-table-source], [data-ln-list-source]");
    if (v) {
      const C = v.getAttribute("data-ln-table-source") || v.getAttribute("data-ln-list-source"), T = C ? document.getElementById(C) : null;
      if (T && T.hasAttribute(t)) {
        const x = document.querySelector("[" + l + '="' + C + '"]'), D = x ? y(x) : null;
        return { target: T, input: D };
      }
    }
    const w = _.closest("[" + l + "]");
    if (w) {
      const C = w.getAttribute(l), T = C ? document.getElementById(C) : null, x = y(w);
      return { target: T, input: x };
    }
    const A = _.parentElement;
    if (A) {
      const C = A.querySelector("[" + l + "]");
      if (C) {
        const T = C.getAttribute(l), x = T ? document.getElementById(T) : null, D = y(C);
        return { target: x, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(_) {
    const E = _.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!E) return;
    const a = h(E);
    !a.target && !a.input || (_.preventDefault(), a.input && (a.input.value = "", a.input.focus()), a.target && a.target.setAttribute(t, ""));
  });
  function u(_, E) {
    const a = _[e];
    if (!a || a._destroyed) return;
    if (E === c) {
      a._onHashChange && window.removeEventListener("hashchange", a._onHashChange), a.nsKey = d(_), a.hashEnabled = !!a.nsKey, a.hashEnabled && window.addEventListener("hashchange", a._onHashChange);
      return;
    }
    const v = _.getAttribute(t) || "";
    v !== a.term && (a.term = v, b(_, v), a._apply());
  }
  U(t, e, i, "ln-search", {
    extraAttributes: [c],
    onAttributeChange: u,
    onSubtreeChange: function(_, E) {
      const a = E.target;
      a && a._lnSearchText !== void 0 && delete a._lnSearchText, a && a.parentElement && a.parentElement._lnSearchText !== void 0 && delete a.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(_) {
        return !!d(_);
      }
    }
  }), U(l, f, r, "ln-search-control");
})();
function pt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Pi(t) {
  const e = pt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Bi(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Hi(t, e, l, f) {
  const o = pt(t);
  if (o === "none") return () => 0;
  const p = o === "desc" ? -1 : 1, s = typeof f == "function" ? f : (n) => n;
  return function(n, c) {
    const d = s(n), y = s(c);
    return _e(d, y, e, l) * p;
  };
}
(function() {
  const t = "data-ln-sort", e = "lnSort", l = "data-ln-sort-field", f = "data-ln-sort-state", o = "data-ln-sort-dir", p = "data-ln-sort-items", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new WeakMap();
  function c(g, m) {
    if (m) {
      const b = g.querySelector('[data-ln-field="' + m + '"]');
      return b ? Et(b) : "";
    }
    return Et(g);
  }
  function d(g) {
    this.dom = g, this.targetId = g.getAttribute(t), this.field = g.getAttribute(l) || null;
    const m = g.closest("th");
    this.column = !this.field && m ? m.cellIndex : null, this.itemsSelector = g.getAttribute(p) || null, this._state = pt(g.getAttribute(f)), this._destroyed = !1, this.nsKey = dt(g, "sort"), this.hashEnabled = !!this.nsKey;
    const b = this;
    this._onClick = function(r) {
      const h = r.target.closest("[" + o + "]");
      if (!h) return;
      const u = pt(h.getAttribute(o));
      b._apply(u);
    }, g.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (b._destroyed || !r.detail) return;
      const h = b._resolveTarget();
      if (!(h && (r.target === h || h.contains(r.target)) || r.detail.targetId && r.detail.targetId === b.targetId)) return;
      if (Bi(
        { field: b.field, column: b.column },
        { field: r.detail.field, column: r.detail.column }
      )) {
        const E = pt(r.detail.direction);
        E && g.getAttribute(f) !== E && (b._state = E, g.setAttribute(f, E), b._updateAriaSort(E));
        return;
      }
      g.getAttribute(f) !== "none" && (b._state = "none", g.setAttribute(f, "none"), b._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (b._destroyed || !b.hashEnabled) return;
      const r = X(b.nsKey), h = ae(r);
      if (h)
        b.field !== null && h.fieldOrColumn === b.field || b.column !== null && String(b.column) === h.fieldOrColumn ? b._state !== h.direction && b._apply(h.direction, !0) : b._state !== "none" && (b._state = "none", g.setAttribute(f, "none"), b._updateAriaSort("none"));
      else if (b._state !== "none") {
        b._state = "none", g.setAttribute(f, "none"), b._updateAriaSort("none");
        const u = b._resolveTarget();
        u && (W(u, "ln-sort:change", {
          field: b.field,
          column: b.column,
          direction: "none",
          targetId: b.targetId
        }).defaultPrevented || b._defaultSort(u, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const r = X(this.nsKey), h = ae(r);
      h && ((b.field !== null && h.fieldOrColumn === b.field || b.column !== null && String(b.column) === h.fieldOrColumn) && st(function() {
        b._destroyed || b._apply(h.direction, !0);
      }), i = !0);
    }
    if (!i) {
      const r = pt(g.getAttribute(f));
      r && r !== "none" && st(function() {
        b._destroyed || b._apply(r, !0);
      });
    }
    return this;
  }
  d.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, d.prototype._updateAriaSort = function(g) {
    const m = this.dom.closest("th");
    m && m.setAttribute("aria-sort", Pi(g));
  }, d.prototype._apply = function(g, m) {
    if (this._destroyed) return;
    const b = pt(g);
    this._state = b, this.dom.getAttribute(f) !== b && this.dom.setAttribute(f, b), this._updateAriaSort(b);
    const i = this._resolveTarget();
    if (!i) return;
    const r = {
      field: this.field,
      column: this.column,
      direction: b,
      targetId: this.targetId
    };
    if (!m && this.hashEnabled) {
      const u = dn(this.field !== null ? this.field : this.column, b);
      nt(this.nsKey, u);
    }
    W(i, "ln-sort:change", r).defaultPrevented || this._defaultSort(i, b);
  }, d.prototype._defaultSort = function(g, m) {
    const b = this.itemsSelector ? Array.from(g.querySelectorAll(this.itemsSelector)) : Array.from(g.children);
    if (!b.length) return;
    const i = b[0].parentNode;
    n.has(g) || n.set(g, b.slice());
    let r;
    if (m === "none")
      r = (n.get(g) || b).filter(function(_) {
        return _.parentNode === i;
      });
    else {
      const u = this.field, _ = b.map(function(w) {
        return c(w, u);
      }), E = ge(_), a = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, v = Hi(m, E, a, function(w) {
        return c(w, u);
      });
      r = b.slice().sort(v);
    }
    const h = document.createDocumentFragment();
    for (let u = 0; u < r.length; u++) h.appendChild(r[u]);
    i.appendChild(h);
  }, d.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function y(g, m) {
    const b = g[e];
    if (!(!b || b._destroyed))
      if (m === l) {
        b.field = g.getAttribute(l) || null;
        const i = g.closest("th");
        b.column = !b.field && i ? i.cellIndex : null;
      } else if (m === p)
        b.itemsSelector = g.getAttribute(p) || null;
      else if (m === f) {
        const i = pt(g.getAttribute(f));
        i !== b._state && b._apply(i);
      } else m === t ? b.targetId = g.getAttribute(t) : m === s && (b.hashEnabled && b._onHashChange && window.removeEventListener("hashchange", b._onHashChange), b.nsKey = dt(g, "sort"), b.hashEnabled = !!b.nsKey, b.hashEnabled && window.addEventListener("hashchange", b._onHashChange));
  }
  U(t, e, d, "ln-sort", {
    extraAttributes: [l, p, f, s],
    onAttributeChange: y,
    persist: {
      attr: f,
      hashActive: function(g) {
        return !!dt(g, "sort");
      }
    }
  });
})();
function Pe(t, e, l, f, o = 15) {
  if (f <= 0 || l <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const p = Math.max(0, t || 0), s = Math.max(0, e || 0), n = Math.floor(p / l), c = Math.ceil(s / l), d = Math.max(0, n - o), y = Math.min(f, n + c + o), g = d * l, m = Math.max(0, (f - y) * l);
  return { start: d, end: y, topPadding: g, bottomPadding: m };
}
function Ui(t, e) {
  const l = Array.isArray(t) ? t.length : 0, f = e instanceof Set ? e : new Set(e || []);
  let o = 0;
  if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      f.has(t[n]) && o++;
  else
    o = f.size;
  const p = l > 0 && o === l, s = o > 0 && o < l;
  return { totalCount: l, selectedCount: o, isAllSelected: p, isIndeterminate: s };
}
function Be(t, e, l) {
  const f = new Set(t);
  return e == null || ((l !== void 0 ? l : !f.has(e)) ? f.add(e) : f.delete(e)), f;
}
function He(t, e, l) {
  const f = new Set(t);
  if (!Array.isArray(e)) return f;
  if (l)
    for (let o = 0; o < e.length; o++)
      e[o] != null && f.add(e[o]);
  else
    for (let o = 0; o < e.length; o++)
      f.delete(e[o]);
  return f;
}
(function() {
  const t = "data-ln-table", e = "lnTable", l = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function c(g, m) {
    if (g == null || isNaN(g)) return "";
    try {
      return new Intl.NumberFormat(G(m)).format(g);
    } catch {
      return String(g);
    }
  }
  function d(g) {
    let m = g.parentElement;
    for (; m && m !== document.body && m !== document.documentElement; ) {
      const i = getComputedStyle(m).overflowY;
      if (i === "auto" || i === "scroll") return m;
      m = m.parentElement;
    }
    return null;
  }
  function y(g) {
    this.dom = g, this.table = g.querySelector("table"), this.tbody = g.querySelector("[data-ln-table-body]") || g.querySelector("tbody"), this.thead = g.querySelector("thead");
    const m = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = m ? Array.from(m.querySelectorAll("th")) : [], this._totalSpan = g.querySelector("[data-ln-table-total]"), this._filteredSpan = g.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== g ? this._filteredSpan.parentElement : null), this._selectedSpan = g.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== g ? this._selectedSpan.parentElement : null), this.isDataDriven = g.hasAttribute("data-ln-table-source"), this.name = g.getAttribute(t) || "", this.source = g.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const b = this;
    return this._onSetSearch = function(i) {
      const r = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      b.isDataDriven ? (b.currentSearch = r, L(g, "ln-table:search", {
        table: b.name,
        query: b.currentSearch
      }), b._requestData()) : (b._searchTerm = r.toLowerCase(), b._applyFilterAndSort(), b._vStart = -1, b._vEnd = -1, b._render(), b._updateFooter(), L(g, "ln-table:filter", {
        term: b._searchTerm,
        matched: b._filteredData.length,
        total: b._data.length
      }));
    }, g.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), b._onSetSearch(i);
    }, g.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      b.isDataDriven ? (b.currentFilters = {}, b.currentSearch = "", L(g, "ln-table:clear-filters", { table: b.name }), b._requestData()) : (b._searchTerm = "", b._columnFilters = {}, b._applyFilterAndSort(), b._vStart = -1, b._vEnd = -1, b._render(), b._updateFooter(), L(g, "ln-table:filter", {
        term: "",
        matched: b._filteredData.length,
        total: b._data.length
      }));
    }, g.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = g.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && g.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(i) {
      const r = i.detail || {}, h = r.data || [], u = r.total != null ? r.total : h.length;
      if (!(b._hasInitialSeed && !b.isLoaded && h.length === 0 && u === 0)) {
        if (b._windowed) {
          b._cache.ingest(r) && !r.provisional && g.classList.remove("ln-table--loading");
          return;
        }
        b._data = h, b._lastTotal = u, b._lastFiltered = r.filtered != null ? r.filtered : b._data.length, b.totalCount = b._lastTotal, b.visibleCount = b._lastFiltered, b.isLoaded = !0, b._hasInitialSeed = !1, g.classList.remove("ln-table--loading"), b._vStart = -1, b._vEnd = -1, b._applyFilterAndSort(), b._render(), b._updateFooter(), L(g, "ln-table:rendered", {
          table: b.name,
          total: b.totalCount,
          visible: b.visibleCount
        });
      }
    }, g.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const r = i.detail && i.detail.loading;
      g.classList.toggle("ln-table--loading", !!r), r && (b.isLoaded = !1);
    }, g.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(i) {
      !b._windowed || !b._cache || b._cache.release(i.detail && i.detail.offset);
    }, g.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !b._windowed || !b._cache || b._cache.revalidate();
    }, g.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !b._windowed || !b._cache || b._requestData();
    }, g.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(i) {
      i.preventDefault(), b.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, b._requestData();
    }, g.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const r = i.target.closest("[data-ln-table-row]");
      if (!r) return;
      const h = r.getAttribute("data-ln-table-row-id"), u = r._lnRecord || {};
      L(g, "ln-table:row-click", {
        table: b.name,
        id: h,
        record: u
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const r = i.target.closest("[data-ln-table-row-action]");
      if (!r) return;
      const h = r.closest("[data-ln-table-row]");
      if (!h) return;
      const u = r.getAttribute("data-ln-table-row-action"), _ = h.getAttribute("data-ln-table-row-id"), E = h._lnRecord || {};
      L(g, "ln-table:row-action", {
        table: b.name,
        id: _,
        action: u,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(g, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      b.tbody.rows.length > 0 && (b._emptyTbodyObserver.disconnect(), b._emptyTbodyObserver = null, b._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      i.preventDefault();
      const r = i.detail.direction === "none" ? null : i.detail.direction;
      b._sortCol = r === null ? -1 : i.detail.column, b._sortDir = r, b._applyFilterAndSort(), b._vStart = -1, b._vEnd = -1, b._render(), L(g, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: b._filteredData.length,
        total: b._data.length
      });
    }, g.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const r = i.detail.key, h = i.detail.values || [];
      if (r) {
        if (h.length === 0)
          delete b._columnFilters[r];
        else {
          const u = [];
          for (let _ = 0; _ < h.length; _++)
            u.push(h[_].toLowerCase());
          b._columnFilters[r] = u;
        }
        b._applyFilterAndSort(), b._vStart = -1, b._vEnd = -1, b._render(), b._updateFooter(), L(g, "ln-table:filter", {
          term: b._searchTerm,
          matched: b._filteredData.length,
          total: b._data.length
        });
      }
    }, g.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  y.prototype._parseRows = function() {
    const g = this.tbody.rows, m = this.ths;
    this._data = [], g.length > 0 && (this._rowHeight = g[0].offsetHeight || 40), this._lockColumnWidths();
    for (let b = 0; b < g.length; b++) {
      const i = g[b], r = [], h = [], u = [];
      for (let E = 0; E < i.cells.length; E++) {
        const a = i.cells[E], v = a.textContent.trim();
        r[E] = Et(a), h[E] = v.toLowerCase(), a.querySelector("[data-ln-table-row-action]") || u.push(v.toLowerCase());
      }
      let _ = null;
      if (this.isDataDriven) {
        _ = {};
        const E = i.getAttribute("data-ln-table-row-id");
        E != null && (_.id = E);
        for (let a = 0; a < m.length; a++) {
          const v = m[a].getAttribute("data-ln-table-col");
          if (v) {
            const w = a;
            if (w < i.cells.length) {
              const A = i.cells[w];
              _[v] = Et(A);
            }
          }
        }
      }
      this._data.push({
        values: r,
        rawTexts: h,
        html: i.outerHTML,
        searchText: u.join(" "),
        id: this.isDataDriven && _ ? _.id : void 0,
        ..._
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, y.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const g = document.createElement("colgroup");
    this.ths.forEach(function(m) {
      const b = document.createElement("col");
      b.style.width = m.offsetWidth + "px", g.appendChild(b);
    }), this.table.insertBefore(g, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = g;
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const g = this._lastTotal, m = this.visibleCount;
        if (g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || m === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const g = this._filteredData.length;
        g === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : g > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const g = this._filteredData, m = document.createDocumentFragment();
      for (let b = 0; b < g.length; b++) {
        const i = this._buildRow(g[b]);
        if (!i) break;
        m.appendChild(i);
      }
      this.tbody.replaceChildren(m), this._selectable && this._updateSelectAll();
    } else {
      const g = [], m = this._filteredData;
      for (let b = 0; b < m.length; b++) g.push(m[b].html);
      this.tbody.innerHTML = g.join(""), this._selectable && this._restoreSelection();
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const g = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let b = null;
        if (this._windowed) {
          const i = this._cache ? this._cache.peek() : null;
          b = i ? this._buildRow(i) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (b = this._buildRow(this._data[0]));
        b && this.tbody && (this.tbody.appendChild(b), this._rowHeight = b.offsetHeight || 40, b.remove());
      }
    this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const m = this._scrollContainer || window;
    this._scrollHandler = function() {
      g._rafId || (g._rafId = requestAnimationFrame(function() {
        g._rafId = null, g._windowed ? g._renderWindowed() : g._renderVirtual();
      }));
    }, m.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const g = this._filteredData, m = g.length, b = this._rowHeight;
    if (!b || !m) return;
    const i = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let h, u;
    if (r) {
      const C = this.table.getBoundingClientRect(), T = r.getBoundingClientRect(), x = C.top - T.top + r.scrollTop + i;
      h = r.scrollTop - x, u = r.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + i;
      h = window.scrollY - x, u = window.innerHeight;
    }
    const _ = Pe(h, u, b, m, 15), E = _.start, a = _.end;
    if (E === this._vStart && a === this._vEnd) return;
    this._vStart = E, this._vEnd = a;
    const v = this.ths.length || 1, w = _.topPadding, A = _.bottomPadding;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (w > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", v), x.style.height = w + "px", T.appendChild(x), C.appendChild(T);
      }
      for (let T = E; T < a; T++) {
        const x = this._buildRow(g[T]);
        x && C.appendChild(x);
      }
      if (A > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", v), x.style.height = A + "px", T.appendChild(x), C.appendChild(T);
      }
      this.tbody.replaceChildren(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>');
      for (let T = E; T < a; T++) C += g[T].html;
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C, this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderRow = function() {
    const g = document.createElement("tr");
    g.className = "ln-table__placeholder", g.setAttribute("aria-hidden", "true");
    const m = document.createElement("td");
    return m.setAttribute("colspan", this.ths.length || 1), m.style.height = this._rowHeight + "px", g.appendChild(m), g;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const g = this._rowHeight;
    if (!g) return;
    const m = this._cache.logicalTotal, b = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let r, h;
    if (i) {
      const C = this.table.getBoundingClientRect(), T = i.getBoundingClientRect(), x = C.top - T.top + i.scrollTop + b;
      r = i.scrollTop - x, h = i.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + b;
      r = window.scrollY - x, h = window.innerHeight;
    }
    const u = Pe(r, h, g, m, 15), _ = u.start, E = u.end, a = this.ths.length || 1, v = u.topPadding, w = u.bottomPadding, A = document.createDocumentFragment();
    if (v > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", a), T.style.height = v + "px", C.appendChild(T), A.appendChild(C);
    }
    for (let C = _; C < E; C++)
      if (this._cache.has(C)) {
        const T = this._buildRow(this._cache.get(C));
        T && A.appendChild(T);
      } else
        A.appendChild(this._buildPlaceholderRow());
    if (w > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", a), T.style.height = w + "px", C.appendChild(T), A.appendChild(C);
    }
    this.tbody.replaceChildren(A), this._vStart = _, this._vEnd = E, this._cache.ensure(_, E);
  }, y.prototype._showEmptyState = function() {
    const g = this.ths.length || 1;
    let m = null, b = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, h = this.visibleCount === 0 && i > 0, u = h ? this.name + "-empty-filtered" : this.name + "-empty";
      if (b = gt(this.dom, u, "ln-table"), !b) {
        const _ = this.dom.querySelector("template[data-ln-table-empty]");
        if (_) {
          const E = h ? "search" : "initial", a = _.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || _.content.firstElementChild;
          a && (b = document.importNode(a, !0));
        }
      }
      if (b)
        if (b.tagName === "TR")
          m = b;
        else {
          const _ = document.createElement("td");
          _.setAttribute("colspan", String(g)), _.appendChild(b);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(_), m = E;
        }
    } else {
      const i = this.dom.querySelector("template[" + l + "]"), r = document.createElement("td");
      r.setAttribute("colspan", String(g)), i && r.appendChild(document.importNode(i.content, !0));
      const h = document.createElement("tr");
      h.className = "ln-table__empty", h.appendChild(r), m = h;
    }
    m ? this.tbody.replaceChildren(m) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._fillRow = function(g, m) {
    Ot(g, m);
    const b = g.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < b.length; i++) {
      const r = b[i], h = r.getAttribute("data-ln-table-cell-attr").split(",");
      for (let u = 0; u < h.length; u++) {
        const _ = h[u].trim().split(":");
        if (_.length !== 2) continue;
        const E = _[0].trim(), a = _[1].trim();
        m[E] != null && r.setAttribute(a, m[E]);
      }
    }
  }, y.prototype._buildRow = function(g) {
    let m = gt(this.dom, this.name + "-row", "ln-table");
    if (!m) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (m = document.importNode(i.content, !0));
    }
    let b = m ? m.querySelector("[data-ln-table-row]") || m.firstElementChild : null;
    if (b)
      this._fillRow(b, g);
    else if (g && g.html) {
      const i = document.createElement("tbody");
      i.innerHTML = g.html, b = i.firstElementChild;
    } else {
      b = document.createElement("tr"), b.setAttribute("data-ln-table-row", "");
      const i = this.ths;
      for (let r = 0; r < i.length; r++) {
        const h = i[r].hasAttribute("data-ln-table-col-select"), u = document.createElement("td");
        if (h) {
          const _ = document.createElement("input");
          _.type = "checkbox", _.setAttribute("data-ln-table-row-select", ""), _.setAttribute("aria-label", "Select row"), u.appendChild(_);
        } else {
          const _ = i[r].getAttribute("data-ln-table-col");
          _ && g[_] != null && (u.textContent = String(g[_]));
        }
        b.appendChild(u);
      }
    }
    if (b._lnRecord = g, g.id != null && b.setAttribute("data-ln-table-row-id", g.id), this._selectable && g.id != null && this.selectedIds.has(String(g.id))) {
      b.classList.add("ln-row-selected");
      const i = b.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return b;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ge(this, "ln-table:request-data", "table");
  }, y.prototype._enterWindowedMode = function() {
    const g = this, m = this.dom, b = parseInt(m.getAttribute("data-ln-table-window"), 10), i = parseInt(m.getAttribute("data-ln-table-window-page"), 10), r = parseInt(m.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !g._windowed || !g._cache || (g.totalCount = g._cache.grandTotal, g.visibleCount = g._cache.logicalTotal, g._lastTotal = g._cache.grandTotal, g.isLoaded = !0, g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(m, "ln-table:rendered", {
        table: g.name,
        total: g.totalCount,
        visible: g.visibleCount
      }));
    }, this._renderBatch = Xt(this._onCacheChange), this._cache = ln({
      windowSize: b > 0 ? b : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: r >= 0 ? r : 25,
      fetchDebounce: 120,
      requestPage: function(h, u, _) {
        L(m, "ln-table:request-data", {
          table: g.name,
          sort: h.sort,
          filters: h.filters,
          search: h.search,
          offset: u,
          limit: _,
          queryGen: g._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let g = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(g) && this._totalSpan) {
        const b = this._totalSpan.textContent.replace(/[^\d]/g, "");
        b && (g = parseInt(b, 10));
      }
      const m = g > 0 ? g : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: m,
        filtered: m
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const g = this.tbody.querySelectorAll("[data-ln-table-row]"), m = [];
    for (let i = 0; i < g.length; i++) {
      const r = g[i].getAttribute("data-ln-table-row-id");
      r != null && m.push(r);
    }
    const b = Ui(m, this.selectedIds);
    this._selectAllCheckbox.checked = b.isAllSelected, this._selectAllCheckbox.indeterminate = b.isIndeterminate;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const g = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let m = 0; m < g.length; m++) {
      const b = g[m].getAttribute("data-ln-table-row-id"), i = b != null && this.selectedIds.has(b);
      g[m].classList.toggle("ln-row-selected", i);
      const r = g[m].querySelector("[data-ln-table-row-select]");
      r && (r.checked = i);
    }
    this._updateSelectAll();
  }, Object.defineProperty(y.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), y.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const g = this;
    if (this._onSelectionChange = function(m) {
      const b = m.target.closest("[data-ln-table-row-select]");
      if (!b) return;
      const i = b.closest("[data-ln-table-row]");
      if (!i) return;
      const r = i.getAttribute("data-ln-table-row-id");
      r != null && (g.selectedIds = Be(g.selectedIds, r, b.checked), i.classList.toggle("ln-row-selected", b.checked), g.selectedCount = g.selectedIds.size, g._updateSelectAll(), g._updateFooter(), L(g.dom, "ln-table:select", {
        table: g.name,
        selectedIds: g.selectedIds,
        count: g.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const m = document.createElement("input");
      m.type = "checkbox";
      const b = g.dom.querySelector('[data-ln-table-dict="select-all"]'), i = g.dom.getAttribute("data-ln-table-select-all-label") || (b ? b.textContent.trim() : null) || "Select all";
      m.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(m), this._selectAllCheckbox = m;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const m = g._selectAllCheckbox.checked, b = g.tbody ? g.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let r = 0; r < b.length; r++) {
        const h = b[r].getAttribute("data-ln-table-row-id"), u = b[r].querySelector("[data-ln-table-row-select]");
        h != null && (i.push(h), b[r].classList.toggle("ln-row-selected", m), u && (u.checked = m));
      }
      g.selectedIds = He(g.selectedIds, i, m), g.selectedCount = g.selectedIds.size, L(g.dom, "ln-table:select-all", {
        table: g.name,
        selected: m
      }), L(g.dom, "ln-table:select", {
        table: g.name,
        selectedIds: g.selectedIds,
        count: g.selectedCount
      }), g._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const m = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let b = 0; b < m.length; b++) {
        const i = m[b].querySelector("[data-ln-table-row-select]"), r = m[b].getAttribute("data-ln-table-row-id");
        i && i.checked && r != null && (g.selectedIds = Be(g.selectedIds, r, !0), m[b].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, y.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const g = this.dom.querySelector("[data-ln-table-col-select]");
    if (g) {
      const m = g.querySelector('input[type="checkbox"]');
      m && m.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = He(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const m = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let b = 0; b < m.length; b++) {
        m[b].classList.remove("ln-row-selected");
        const i = m[b].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, y.prototype._updateFooter = function() {
    let g = 0, m = 0;
    this.isDataDriven ? (g = this._lastTotal != null ? this._lastTotal : this._data.length, m = this.visibleCount) : (g = this._data.length, m = this._filteredData.length);
    const b = m < g;
    if (this._totalSpan && (this._totalSpan.textContent = c(g, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? c(m, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? c(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, y, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(g, m) {
      const b = g[e];
      if (!(!b || !b.isDataDriven)) {
        if (m === "data-ln-table-window") {
          const i = g.hasAttribute("data-ln-table-window");
          if (i && !b._windowed)
            b._enterWindowedMode(), b._kickWindowInitial();
          else if (!i && b._windowed)
            b._exitWindowedMode();
          else if (i && b._windowed) {
            const r = parseInt(g.getAttribute("data-ln-table-window"), 10);
            r > 0 && b._cache.configure({ windowSize: r });
          }
          return;
        }
        if (!(!b._windowed || !b._cache)) {
          if (m === "data-ln-table-window-page") {
            const i = parseInt(g.getAttribute("data-ln-table-window-page"), 10);
            i > 0 && b._cache.configure({ pageSize: i });
          } else if (m === "data-ln-table-window-threshold") {
            const i = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
            i >= 0 && b._cache.configure({ threshold: i });
          } else if (m === "data-ln-table-count") {
            const i = parseInt(g.getAttribute("data-ln-table-count"), 10);
            i >= 0 && b._cache.setGrandTotal(i);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  document.addEventListener("keydown", function(s) {
    if (s.key !== "/" || s.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const n = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!n) return;
    const c = n.tagName === "INPUT" || n.tagName === "TEXTAREA" ? n : n.querySelector('input[type="search"], input[type="text"], input');
    c && (s.preventDefault(), c.focus());
  });
  function l(s) {
    return this.dom = s, p(this), this;
  }
  function f(s, n) {
    const c = n ? '[data-ln-search-for="' + n + '"]' : "[data-ln-search-for]", d = s.querySelector(c) || document.querySelector(c);
    return d ? d.tagName === "INPUT" || d.tagName === "TEXTAREA" ? d : d.querySelector("input, textarea") : null;
  }
  function o(s, n) {
    if (n) {
      const d = s.querySelectorAll('[data-ln-filter="' + n + '"]');
      if (d.length > 0) return d;
      const y = document.querySelectorAll('[data-ln-filter="' + n + '"]');
      if (y.length > 0) return y;
    }
    const c = s.querySelectorAll("[data-ln-filter]");
    return c.length > 0 ? c : document.querySelectorAll("[data-ln-filter]");
  }
  function p(s) {
    const n = s.dom;
    function c(d) {
      const y = d.target;
      if (y && y.hasAttribute && y.hasAttribute("data-ln-table")) return y;
      const g = d.detail && d.detail.targetId || y && y.id;
      return g ? n.querySelector('[data-ln-table-source="' + g + '"]') || n.querySelector('[data-ln-table="' + g + '"]') : null;
    }
    s._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(d) {
        if (!d.detail) return;
        const y = c(d);
        if (!y || !y.hasAttribute || !y.hasAttribute("data-ln-table")) return;
        const g = d.detail.key, m = d.detail.values || [], b = y.querySelectorAll("th");
        for (let i = 0; i < b.length; i++)
          if (b[i].getAttribute("data-ln-table-filter-col") === g) {
            const r = b[i].querySelector("[data-ln-table-col-filter]");
            r && r.classList.toggle("ln-filter-active", m.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(d) {
        const y = d.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!y) return;
        const g = y.closest("[data-ln-table]") || n.querySelector("[data-ln-table]");
        if (!g || !g.lnTable) return;
        const m = g.lnTable.name || g.id, b = g.querySelectorAll("th");
        for (let u = 0; u < b.length; u++) {
          const _ = b[u].querySelector("[data-ln-table-col-filter]");
          _ && _.classList.remove("ln-filter-active");
        }
        const i = g.getAttribute("data-ln-table-source") || g.id, r = i ? document.getElementById(i) : null;
        if (r && r.hasAttribute("data-ln-search"))
          r.setAttribute("data-ln-search", "");
        else {
          const u = f(n, i);
          u && u.value !== "" && (u.value = "", u.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const h = o(n, i);
        for (let u = 0; u < h.length; u++) {
          const _ = h[u].querySelector("[data-ln-filter-reset]");
          if (!_) continue;
          const E = h[u].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!_.checked || E) && (_.checked = !0, _.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        g.hasAttribute("data-ln-table-source") || L(g, "ln-table:request-clear-filters", { table: m });
      }
    }, n.addEventListener("ln-filter:change", s._handlers.filter), n.addEventListener("click", s._handlers.clear);
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, U(t, e, l, "ln-table-coordinator");
})();
(function() {
  const t = "data-ln-list", e = "lnList", l = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(G(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function d(i) {
    let r = i;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const u = getComputedStyle(r).overflowY;
      if (u === "auto" || u === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function y(i) {
    const r = i._scrollContainer || d(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function g(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function m(i) {
    if (!i) return 0;
    const r = getComputedStyle(i), h = parseFloat(r.marginTop) || 0, u = parseFloat(r.marginBottom) || 0;
    return i.offsetHeight + h + u;
  }
  function b(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(t) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const r = this;
    return this._onSetSearch = function(h) {
      const u = (h.detail && h.detail.query != null ? h.detail.query : h.detail && h.detail.term != null ? h.detail.term : "").trim();
      r.isDataDriven ? (r.currentSearch = u, L(i, "ln-list:search", {
        list: r.name,
        query: r.currentSearch
      }), r._requestData()) : (r._searchTerm = u.toLowerCase(), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(h) {
      h.preventDefault(), r._onSetSearch(h);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      r.isDataDriven ? (r.currentFilters = {}, r.currentSearch = "", L(i, "ln-list:clear-filters", { list: r.name }), r._requestData()) : (r._searchTerm = "", r._filters = {}, r._sortField = null, r._sortDir = null, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(h) {
      const u = h.detail || {}, _ = u.data || [], E = u.total != null ? u.total : _.length;
      if (!(r._hasInitialSeed && !r.isLoaded && _.length === 0 && E === 0)) {
        if (r._windowed) {
          r._cache.ingest(u) && !u.provisional && i.classList.remove("ln-list--loading");
          return;
        }
        r._data = _, r._lastTotal = E, r._lastFiltered = u.filtered != null ? u.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, r._hasInitialSeed = !1, i.classList.remove("ln-list--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), L(i, "ln-list:rendered", {
          list: r.name,
          total: r.totalCount,
          visible: r.visibleCount
        });
      }
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(h) {
      const u = h.detail && h.detail.loading;
      i.classList.toggle("ln-list--loading", !!u), u && (r.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(h) {
      !r._windowed || !r._cache || r._cache.release(h.detail && h.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !r._windowed || !r._cache || r._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !r._windowed || !r._cache || r._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(h) {
      h.detail.field != null && (h.preventDefault(), r.currentSort = h.detail.direction === "none" ? null : { field: h.detail.field, direction: h.detail.direction }, r._requestData());
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(h) {
      if (h.target.closest("[data-ln-item-select]") || h.target.closest("[data-ln-item-action]") || h.target.closest("a") || h.target.closest("button") || h.ctrlKey || h.metaKey || h.button === 1) return;
      const u = h.target.closest("[data-ln-item]");
      if (!u) return;
      const _ = u.getAttribute("data-ln-item-id"), E = u._lnRecord || {};
      L(i, "ln-list:item-click", {
        list: r.name,
        id: _,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(h) {
      const u = h.target.closest("[data-ln-item-action]");
      if (!u) return;
      const _ = u.closest("[data-ln-item]");
      if (!_) return;
      const E = u.getAttribute("data-ln-item-action"), a = _.getAttribute("data-ln-item-id"), v = _._lnRecord || {};
      L(i, "ln-list:item-action", {
        list: r.name,
        id: a,
        action: E,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      r.tbody.children.length > 0 && (r._emptyObserver.disconnect(), r._emptyObserver = null, r._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(h) {
      if (h.preventDefault(), !h.detail) return;
      const u = h.detail.key, _ = h.detail.values || [];
      if (u) {
        if (_.length === 0)
          delete r._filters[u];
        else {
          const E = [];
          for (let a = 0; a < _.length; a++)
            E.push(_[a].toLowerCase());
          r._filters[u] = E;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(h) {
      if (h.detail && h.detail.field == null) return;
      h.preventDefault();
      const u = h.detail && h.detail.direction === "none" ? null : h.detail && h.detail.direction;
      r._sortField = u === null ? null : h.detail && h.detail.field, r._sortDir = u, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:sorted", {
        field: r._sortField,
        direction: h.detail && h.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  b.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((r) => !r.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = m(i[0]) || 50);
    for (let r = 0; r < i.length; r++) {
      const h = i[r], u = h.getAttribute("data-ln-item-id") || h.getAttribute("id"), _ = h.textContent.trim().toLowerCase();
      let E = null;
      if (this.isDataDriven) {
        E = {}, u != null && (E.id = u);
        const w = h.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < w.length; A++) {
          const C = w[A], T = C.getAttribute("data-ln-list-field");
          T && (E[T] = Et(C));
        }
      }
      const a = {}, v = h.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let w = 0; w < v.length; w++) {
        const A = v[w], C = A.getAttribute("data-ln-list-field") || A.getAttribute("data-ln-field");
        C && (a[C] = Et(A));
      }
      for (let w = 0; w < h.attributes.length; w++) {
        const A = h.attributes[w];
        if (A.name.startsWith("data-") && !A.name.startsWith("data-ln-")) {
          const C = A.name.slice(5);
          C && (a[C] = A.value);
        }
      }
      this._data.push({
        html: h.outerHTML,
        id: u,
        searchText: _,
        fields: a,
        ...E || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, b.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], h = this._filters || {}, u = Object.keys(h).length > 0;
      if (r.length === 0 && !u ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
        if (r.length > 0 && !r.every(function(a) {
          return _.searchText && _.searchText.indexOf(a) !== -1;
        }))
          return !1;
        if (u)
          for (const E in h) {
            const a = h[E];
            if (a && a.length > 0) {
              const v = _.fields && _.fields[E] !== void 0 ? _.fields[E] : _[E] !== void 0 ? _[E] : null, w = v != null ? String(v).toLowerCase() : "";
              if (a.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const _ = this._sortField, E = this._sortDir === "desc" ? -1 : 1, a = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, v = this._filteredData.map(function(A) {
          return A.fields && A.fields[_] !== void 0 ? A.fields[_] : A[_];
        }), w = ge(v);
        this._filteredData.sort(function(A, C) {
          const T = A.fields && A.fields[_] !== void 0 ? A.fields[_] : A[_], x = C.fields && C.fields[_] !== void 0 ? C.fields[_] : C[_];
          return _e(T, x, w, a) * E;
        });
      }
    }
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, r = this.visibleCount;
        if (i === 0 || this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let u = 0; u < i.length; u++) {
        const _ = this._buildItem(i[u]);
        _ && r.appendChild(_);
      }
      const h = y(this);
      this.tbody.replaceChildren(r), g(h), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let u = 0; u < r.length; u++) i.push(r[u].html);
      const h = y(this);
      this.tbody.innerHTML = i.join(""), g(h), this._selectable && this._restoreSelection();
    }
  }, b.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), r = i.gridTemplateColumns;
    let h = 1;
    if (r && r !== "none") {
      const _ = r.trim().split(/\s+/).filter(Boolean);
      _.length > 0 && (h = _.length);
    }
    const u = parseFloat(i.rowGap);
    return { columns: h, rowGap: isNaN(u) ? 0 : u };
  }, b.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), r = i ? this._buildItem(i) : this._buildPlaceholderItem();
      r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = m(r) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = m(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = m(i[0]) || 50);
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = d(this.dom);
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, h = this._itemHeight;
    if (!h || !r) return;
    const u = this._scrollContainer;
    let _, E;
    if (u) {
      const B = this.tbody.getBoundingClientRect(), H = u.getBoundingClientRect(), z = u === this.tbody ? 0 : B.top - H.top + u.scrollTop;
      _ = u.scrollTop - z, E = u.clientHeight;
    } else {
      const H = this.tbody.getBoundingClientRect().top + window.scrollY;
      _ = window.scrollY - H, E = window.innerHeight;
    }
    const a = this._readGridLayout(), v = a.columns, w = a.rowGap, A = h + w, C = Math.ceil(r / v);
    let T = Math.max(0, Math.floor(_ / A) - 15);
    T = Math.min(T, C);
    const x = Math.ceil(E / A) + 30, D = Math.min(T + x, C), R = Math.min(T * v, r), M = Math.min(D * v, r);
    if (R === this._vStart && M === this._vEnd) return;
    this._vStart = R, this._vEnd = M;
    const P = T * A, N = (C - D) * A;
    if (this.isDataDriven) {
      const B = document.createDocumentFragment();
      if (P > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = P + "px", B.appendChild(z);
      }
      for (let z = R; z < M; z++) {
        const Q = this._buildItem(i[z]);
        Q && B.appendChild(Q);
      }
      if (N > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = N + "px", B.appendChild(z);
      }
      const H = y(this);
      this.tbody.replaceChildren(B), g(H), this._selectable && this._updateSelectAll();
    } else {
      let B = "";
      P > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${P}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = R; z < M; z++)
        B += i[z].html;
      N > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      const H = y(this);
      this.tbody.innerHTML = B, g(H), this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const r = this._scrollContainer;
    let h, u;
    if (r) {
      const H = this.tbody.getBoundingClientRect(), z = r.getBoundingClientRect(), Q = r === this.tbody ? 0 : H.top - z.top + r.scrollTop;
      h = r.scrollTop - Q, u = r.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      h = window.scrollY - z, u = window.innerHeight;
    }
    const _ = this._readGridLayout(), E = _.columns, a = _.rowGap, v = i + a, w = this._cache.logicalTotal, A = Math.ceil(w / E);
    let C = Math.max(0, Math.floor(h / v) - 15);
    C = Math.min(C, A);
    const T = Math.ceil(u / v) + 30, x = Math.min(C + T, A), D = Math.min(C * E, w), R = Math.min(x * E, w), M = C * v, P = (A - x) * v, N = document.createDocumentFragment();
    if (M > 0) {
      const H = document.createElement(this.isUl ? "li" : "div");
      H.className = "ln-list__spacer", H.setAttribute("aria-hidden", "true"), H.style.height = M + "px", N.appendChild(H);
    }
    for (let H = D; H < R; H++)
      if (this._cache.has(H)) {
        const z = this._buildItem(this._cache.get(H));
        z && N.appendChild(z);
      } else
        N.appendChild(this._buildPlaceholderItem());
    if (P > 0) {
      const H = document.createElement(this.isUl ? "li" : "div");
      H.className = "ln-list__spacer", H.setAttribute("aria-hidden", "true"), H.style.height = P + "px", N.appendChild(H);
    }
    const B = y(this);
    this.tbody.replaceChildren(N), g(B), this._vStart = D, this._vEnd = R, this._cache.ensure(D, R);
  }, b.prototype._showEmptyState = function() {
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount === 0 && r > 0, _ = u ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = gt(this.dom, _, "ln-list"), !i) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const a = u ? "search" : "initial", v = E.content.querySelector(`[data-ln-empty-when="${a}"]`) || E.content.firstElementChild;
          v && (i = document.importNode(v, !0));
        }
      }
    } else {
      const r = this.dom.querySelector(`template[${l}]`);
      if (r) {
        const h = r.content.firstElementChild;
        h && (i = document.importNode(h, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.replaceChildren(i);
      else {
        const r = document.createElement(this.isUl ? "li" : "div");
        r.appendChild(i), this.tbody.replaceChildren(r);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._buildItem = function(i) {
    let r = gt(this.dom, this.name + "-row", "ln-list");
    if (!r) {
      const u = this.dom.querySelector("template[data-ln-item]");
      u && (r = document.importNode(u.content, !0));
    }
    let h = r ? r.querySelector("[data-ln-item]") || r.firstElementChild : null;
    if (h)
      Ot(h, i), ot(h, i);
    else if (i && i.html) {
      const u = document.createElement(this.isUl ? "ul" : "div");
      u.innerHTML = i.html, h = u.firstElementChild;
    } else if (h = document.createElement(this.isUl ? "li" : "div"), h.setAttribute("data-ln-item", ""), i && typeof i == "object") {
      for (const u in i)
        if (u !== "html" && i[u] != null) {
          const _ = document.createElement("span");
          _.setAttribute("data-ln-field", u), _.textContent = String(i[u]), h.appendChild(_);
        }
    }
    if (h._lnRecord = i, i && i.id != null && (h.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      h.classList.add("ln-item-selected");
      const u = h.querySelector("[data-ln-item-select]");
      u && (u.checked = !0);
    }
    return h;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let r = 0; r < i.length; r++) {
      const h = i[r].getAttribute("data-ln-item-id"), u = h != null && this.selectedIds.has(String(h));
      i[r].classList.toggle("ln-item-selected", u);
      const _ = i[r].querySelector("[data-ln-item-select]");
      _ && (_.checked = u);
    }
    this._updateSelectAll();
  }, b.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(r) {
      const h = r.target.closest("[data-ln-item-select]");
      if (!h) return;
      const u = h.closest("[data-ln-item]");
      if (!u) return;
      const _ = u.getAttribute("data-ln-item-id");
      _ != null && (h.checked ? (i.selectedIds.add(String(_)), u.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(_)), u.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, h = i.tbody.querySelectorAll("[data-ln-item]");
      for (let u = 0; u < h.length; u++) {
        const _ = h[u], E = _.getAttribute("data-ln-item-id"), a = _.querySelector("[data-ln-item-select]");
        E != null && (r ? (i.selectedIds.add(String(E)), _.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(E)), _.classList.remove("ln-item-selected")), a && (a.checked = r));
      }
      L(i.dom, "ln-list:select-all", { list: i.name, selected: r }), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, b.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let r = i.length > 0;
    for (let h = 0; h < i.length; h++) {
      const u = i[h].getAttribute("data-ln-item-id");
      if (u != null && !this.selectedIds.has(String(u))) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ge(this, "ln-list:request-data", "list");
  }, b.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, h = parseInt(r.getAttribute("data-ln-list-window"), 10), u = parseInt(r.getAttribute("data-ln-list-window-page"), 10), _ = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Xt(this._onCacheChange), this._cache = ln({
      windowSize: h > 0 ? h : 1e3,
      pageSize: u > 0 ? u : 200,
      threshold: _ >= 0 ? _ : 25,
      fetchDebounce: 120,
      requestPage: function(E, a, v) {
        L(r, "ln-list:request-data", {
          list: i.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: a,
          limit: v,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const i = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), r = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: r,
        filtered: r
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, b.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, b.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const h = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = c(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = h ? c(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !h), this._selectedSpan) {
      const u = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = u > 0 ? c(u, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", u === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, b, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, r) {
      const h = i[e];
      if (!(!h || !h.isDataDriven)) {
        if (r === "data-ln-list-window") {
          const u = i.hasAttribute("data-ln-list-window");
          if (u && !h._windowed)
            h._enterWindowedMode(), h._kickWindowInitial();
          else if (!u && h._windowed)
            h._exitWindowedMode();
          else if (u && h._windowed) {
            const _ = parseInt(i.getAttribute("data-ln-list-window"), 10);
            _ > 0 && h._cache.configure({ windowSize: _ });
          }
          return;
        }
        if (!(!h._windowed || !h._cache)) {
          if (r === "data-ln-list-window-page") {
            const u = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            u > 0 && h._cache.configure({ pageSize: u });
          } else if (r === "data-ln-list-window-threshold") {
            const u = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            u >= 0 && h._cache.configure({ threshold: u });
          } else if (r === "data-ln-list-count") {
            const u = parseInt(i.getAttribute("data-ln-list-count"), 10);
            u >= 0 && h._cache.setGrandTotal(u);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  const l = "http://www.w3.org/2000/svg", f = 36, o = 16, p = 2 * Math.PI * o;
  function s(y) {
    return this.dom = y, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, c.call(this), d.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(y, g) {
    const m = document.createElementNS(l, y);
    for (const [b, i] of Object.entries(g))
      m.setAttribute(b, i);
    return m;
  }
  function c() {
    this.svg = n("svg", {
      viewBox: "0 0 " + f + " " + f,
      width: f,
      height: f
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: f / 2,
      cy: f / 2,
      r: o,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: f / 2,
      cy: f / 2,
      r: o,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": p,
      "stroke-dashoffset": p,
      transform: "rotate(-90 " + f / 2 + " " + f / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function d() {
    const y = this.dom.getAttribute("data-ln-circular-progress"), g = this.dom.getAttribute("data-ln-circular-progress-max"), m = hn(y, g || 100), b = p - m.percentage / 100 * p;
    this.progressCircle.setAttribute("stroke-dashoffset", b);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), r = i !== null ? i : Math.round(m.percentage) + "%";
    this.labelEl.textContent = r, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(m.min)), this.dom.setAttribute("aria-valuemax", String(m.max)), this.dom.setAttribute("aria-valuenow", String(m.clampedValue)), this.dom.setAttribute("aria-valuetext", r), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: m.value,
      max: m.max,
      percentage: m.percentage
    });
  }
  U(t, e, s, "ln-circular-progress", {
    // Value, max and label are all read live inside _render(), so one
    // default effect covers every attribute — no per-attribute map.
    onAttrChange: function(y) {
      const g = y[e];
      g && d.call(g);
    }
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", l = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  function f(p) {
    this.dom = p, this.isEnabled = p.getAttribute(t) !== "disabled", this._dragging = null, p.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(n) {
      s.isEnabled && s._handlePointerDown(n);
    }, p.addEventListener("pointerdown", this._onPointerDown), this;
  }
  f.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, f.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, f.prototype._handlePointerDown = function(p) {
    let s = p.target.closest("[" + l + "]"), n;
    if (s) {
      for (n = s; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + l + "]")) return;
      for (n = p.target; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
      s = n;
    }
    const d = Array.from(this.dom.children).indexOf(n);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: n,
      index: d
    }).defaultPrevented) return;
    p.preventDefault(), s.setPointerCapture(p.pointerId), this._dragging = n, n.classList.add("ln-sortable--dragging"), n.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: n,
      index: d
    });
    const g = this, m = function(i) {
      g._handlePointerMove(i);
    }, b = function(i) {
      g._handlePointerEnd(i), s.removeEventListener("pointermove", m), s.removeEventListener("pointerup", b), s.removeEventListener("pointercancel", b);
    };
    s.addEventListener("pointermove", m), s.addEventListener("pointerup", b), s.addEventListener("pointercancel", b);
  }, f.prototype._handlePointerMove = function(p) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), n = this._dragging;
    for (const c of s)
      c.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const c of s) {
      if (c === n) continue;
      const d = c.getBoundingClientRect(), y = d.top + d.height / 2;
      if (p.clientY >= d.top && p.clientY < y) {
        c.classList.add("ln-sortable--drop-before");
        break;
      } else if (p.clientY >= y && p.clientY <= d.bottom) {
        c.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, f.prototype._handlePointerEnd = function(p) {
    if (!this._dragging) return;
    const s = this._dragging, n = Array.from(this.dom.children), c = n.indexOf(s);
    let d = null, y = null;
    for (const g of n) {
      if (g.classList.contains("ln-sortable--drop-before")) {
        d = g, y = "before";
        break;
      }
      if (g.classList.contains("ln-sortable--drop-after")) {
        d = g, y = "after";
        break;
      }
    }
    for (const g of n)
      g.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), d && d !== s) {
      y === "before" ? this.dom.insertBefore(s, d) : this.dom.insertBefore(s, d.nextElementSibling);
      const m = Array.from(this.dom.children).indexOf(s);
      L(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: c,
        newIndex: m
      });
    }
    this._dragging = null;
  };
  function o(p) {
    const s = p[e];
    if (!s) return;
    const n = p.getAttribute(t) !== "disabled";
    n !== s.isEnabled && (s.isEnabled = n, L(p, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: p }));
  }
  U(t, e, f, "ln-sortable", {
    onAttributeChange: o
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", l = "data-ln-confirm-timeout";
  if (window[e] !== void 0) return;
  function o(s) {
    const n = parseFloat(s.getAttribute(l));
    return isNaN(n) || n <= 0 ? 3 : n;
  }
  function p(s) {
    this.dom = s, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = s.querySelector("[data-ln-confirm-idle]"), this.activeEl = s.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = s.textContent.trim(), this.confirmText = s.getAttribute(t) || "Confirm?");
    const n = this;
    return this._onClick = function(c) {
      if (!Qe(c))
        if (!n.confirming)
          c.preventDefault(), c.stopImmediatePropagation(), n._enterConfirm();
        else {
          if (n._submitted) return;
          n._submitted = !0, c.stopPropagation(), n._reset();
        }
    }, s.addEventListener("click", this._onClick), this;
  }
  p.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = s.getAttribute("href"), s.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const s = this, n = o(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      s._reset();
    }, n);
  }, p.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalIconHref && s.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], L(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, U(t, e, p, "ln-confirm");
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const l = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function f(o) {
    this.dom = o, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = o.getAttribute("data-ln-translations-default") || "", this.placeholderLabel = o.getAttribute("data-ln-translations-placeholder") || "{lang} translation", this.removeLabel = o.getAttribute("data-ln-translations-remove-label") || "Remove {lang}", this.badgesEl = o.querySelector("[data-ln-translations-active]"), this.menuEl = o.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const p = o.getAttribute("data-ln-translations-locales");
    if (this.locales = l, p)
      try {
        this.locales = JSON.parse(p);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && s.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && s.removeLanguage(n.detail.lang);
    }, o.addEventListener("ln-translations:request-add", this._onRequestAdd), o.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  f.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of o) {
      const s = p.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, f.prototype._detectExisting = function() {
    const o = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const p of o) {
      const s = p.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, f.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const o = this;
    let p = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      p++;
      const c = jt("ln-translations-menu-item", "ln-translations");
      if (!c) return;
      const d = c.querySelector("[data-ln-translations-lang]");
      d.setAttribute("data-ln-translations-lang", n), d.textContent = this.locales[n], d.addEventListener("click", function(y) {
        y.ctrlKey || y.metaKey || y.button === 1 || (y.preventDefault(), y.stopPropagation(), o.menuEl.getAttribute("data-ln-toggle") === "open" && o.menuEl.setAttribute("data-ln-toggle", "close"), o.addLanguage(n));
      }), this.menuEl.appendChild(c);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = p === 0);
  }, f.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const o = this;
    this.activeLanguages.forEach(function(p) {
      const s = jt("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", p);
      const c = n.querySelector("span");
      c.textContent = o.locales[p] || p.toUpperCase();
      const d = n.querySelector("button"), y = o.locales[p] || p.toUpperCase();
      d.setAttribute("aria-label", o.removeLabel.replace("{lang}", y)), d.addEventListener("click", function(g) {
        g.ctrlKey || g.metaKey || g.button === 1 || (g.preventDefault(), g.stopPropagation(), o.removeLanguage(p));
      }), o.badgesEl.appendChild(s);
    });
  }, f.prototype.addLanguage = function(o, p) {
    if (this.activeLanguages.has(o)) return;
    const s = this.locales[o] || o;
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: o,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(o), p = p || {};
    const c = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const d of c) {
      const y = d.getAttribute("data-ln-translatable"), g = d.getAttribute("data-ln-translations-prefix") || "", m = d.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!m) continue;
      const b = m.cloneNode(m.tagName === "SELECT");
      g ? b.name = g + "[trans][" + o + "][" + y + "]" : b.name = "trans[" + o + "][" + y + "]", b.value = p[y] !== void 0 ? p[y] : "", b.removeAttribute("id"), "placeholder" in b && (b.placeholder = this.placeholderLabel.replace("{lang}", s)), b.setAttribute("data-ln-translatable-lang", o);
      const i = d.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : m;
      r.parentNode.insertBefore(b, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: o,
      langName: s
    });
  }, f.prototype.removeLanguage = function(o) {
    if (!this.activeLanguages.has(o) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: o
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + o + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(o), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: o
    });
  }, f.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, f.prototype.hasLanguage = function(o) {
    return this.activeLanguages.has(o);
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this.defaultLang, p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of p)
      s.getAttribute("data-ln-translatable-lang") !== o && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, U(t, e, f, "ln-translations");
})();
const zi = "ln-autosave:", Ki = 1e3;
function ji(t, e) {
  return e ? zi + (t || "") + ":" + e : null;
}
function Vi(t, e = Ki) {
  if (t == null) return 0;
  if (t === "") return e;
  const l = parseInt(String(t), 10);
  return isNaN(l) || l < 0 ? e : l;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", l = "data-ln-autosave-clear", f = "data-ln-autosave-debounce-input", o = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  function p(n) {
    const c = n.tagName;
    return c === "INPUT" || c === "TEXTAREA" || c === "SELECT";
  }
  function s(n) {
    const d = n.getAttribute(t) || n.id, y = ji(window.location.pathname, d);
    if (!y) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = y;
    let g = null;
    function m() {
      const h = Ye(n, { exclude: o });
      try {
        localStorage.setItem(y, JSON.stringify(h));
      } catch {
        return;
      }
      L(n, "ln-autosave:saved", { target: n, data: h });
    }
    function b() {
      let h;
      try {
        h = localStorage.getItem(y);
      } catch {
        return;
      }
      if (!h) return;
      let u;
      try {
        u = JSON.parse(h);
      } catch {
        return;
      }
      if (W(n, "ln-autosave:before-restore", { target: n, data: u }).defaultPrevented) return;
      const E = Xe(n, u);
      for (let a = 0; a < E.length; a++)
        E[a].dispatchEvent(new Event("input", { bubbles: !0 })), E[a].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(n, "ln-autosave:restored", { target: n, data: u });
    }
    function i() {
      try {
        localStorage.removeItem(y);
      } catch {
        return;
      }
      L(n, "ln-autosave:cleared", { target: n });
    }
    this._onFocusout = function(h) {
      const u = h.target;
      p(u) && u.name && !u.matches(o) && m();
    }, this._onChange = function(h) {
      const u = h.target;
      p(u) && u.name && !u.matches(o) && m();
    }, this._onSubmit = function() {
      i();
    }, this._onReset = function() {
      i();
    }, this._onClearClick = function(h) {
      h.target.closest("[" + l + "]") && i();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick);
    const r = Vi(n.getAttribute(f));
    return r > 0 && (this._onInput = function(h) {
      const u = h.target;
      !p(u) || !u.name || u.matches(o) || (g !== null && clearTimeout(g), g = setTimeout(m, r));
    }, n.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return g;
    }, b(), this;
  }
  s.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const n = this._getInputTimer();
        n !== null && clearTimeout(n);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, s, "ln-autosave");
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  function l(f) {
    if (f.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", f.tagName), this;
    this.dom = f;
    const o = this;
    return this._onInput = function() {
      o._resize();
    }, f.addEventListener("input", this._onInput), this._resize(), this;
  }
  l.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, U(t, e, l, "ln-autoresize");
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const l = {
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
  }, f = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, o = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, p = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let s = 0;
  function n(h) {
    return !!(f[h] || o[h] || p[h] || h === "link");
  }
  function c(h) {
    this.dom = h;
    const u = this;
    if (this._textarea = h.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", h), this;
    const _ = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), _ && this._surface.setAttribute("data-placeholder", _);
    const E = this._textarea.id;
    if (E) {
      const A = h.querySelector('label[for="' + E + '"]');
      A && (A.id || (A.id = E + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = E ? E + "-surface" : "ln-editor-surface-" + ++s;
    const a = this._textarea.value.trim();
    a && (this._surface.innerHTML = a);
    const v = h.querySelector('[role="toolbar"]');
    if (v && v.nextSibling ? h.insertBefore(this._surface, v.nextSibling) : h.appendChild(this._surface), v) {
      v.setAttribute("aria-controls", this._surface.id);
      const A = v.querySelectorAll("[data-ln-editor-action]");
      for (let C = 0; C < A.length; C++) {
        const T = A[C].getAttribute("data-ln-editor-action");
        n(T) && A[C].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      u._syncToTextarea(), L(u.dom, "ln-editor:changed", {
        html: u._textarea.value,
        target: u.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const C = A.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const T = C.getAttribute("data-ln-editor-action");
      u._execAction(T);
    }, this._onPaste = function(A) {
      g(u, A);
    }, this._onKeydown = function(A) {
      i(u, A);
    }, this._onSelectionChange = function() {
      document.contains(u._surface) && u._updateActiveStates();
    }, this._onFocus = function() {
      L(u.dom, "ln-editor:focus", { target: u.dom });
    }, this._onBlur = function() {
      u._syncToTextarea(), L(u.dom, "ln-editor:blur", { target: u.dom });
    }, this._onTextareaInput = function() {
      u._surface.innerHTML !== u._textarea.value && (u._surface.innerHTML = u._textarea.value, L(u.dom, "ln-editor:changed", {
        html: u._textarea.value,
        target: u.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), v && (v.addEventListener("mousedown", this._onMousedownToolbar), v.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const C = A.detail && A.detail.html;
      C !== void 0 && (u._surface.innerHTML = C, u._syncToTextarea(), L(u.dom, "ln-editor:changed", {
        html: u._textarea.value,
        target: u.dom
      }));
    }, h.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        u._surface.innerHTML = u._textarea.value, L(h, "ln-editor:changed", {
          html: u._textarea.value,
          target: h
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  c.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, c.prototype._execAction = function(h) {
    if (!(!h || W(this.dom, "ln-editor:before-change", {
      action: h,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), f[h])
        document.execCommand(f[h], !1, null);
      else if (o[h]) {
        const _ = o[h], E = d(this._surface);
        E && E.toLowerCase() === _ ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + _ + ">");
      } else p[h] ? document.execCommand(p[h], !1, null) : h === "link" ? r(this) : h === "unlink" ? document.execCommand("unlink", !1, null) : h === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, c.prototype._updateActiveStates = function() {
    const h = this.dom.querySelector('[role="toolbar"]');
    if (!h) return;
    const u = window.getSelection();
    if (!u || u.rangeCount === 0) return;
    const _ = u.anchorNode;
    if (!_ || !this._surface.contains(_)) return;
    const E = h.querySelectorAll("[data-ln-editor-action]");
    for (let a = 0; a < E.length; a++) {
      const v = E[a], w = v.getAttribute("data-ln-editor-action");
      let A = !1;
      if (f[w])
        try {
          A = document.queryCommandState(f[w]);
        } catch {
        }
      else if (o[w]) {
        const C = d(this._surface);
        A = C && C.toLowerCase() === o[w];
      } else if (p[w])
        try {
          A = document.queryCommandState(p[w]);
        } catch {
        }
      else w === "link" && (A = !!y(u.anchorNode, "A", this._surface));
      n(w) && v.setAttribute("aria-pressed", String(A)), A ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
    }
  }, c.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, c.prototype.setHTML = function(h) {
    this._surface && (this._surface.innerHTML = h, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const h = this.dom.querySelector('[role="toolbar"]');
    h && (h.removeEventListener("mousedown", this._onMousedownToolbar), h.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const u = this._textarea ? this._textarea.form : null;
    if (u && this._onFormReset && u.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const _ = this.dom.querySelector(".ln-editor__link-popover");
      _ && _.remove();
    }
    L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function d(h) {
    const u = window.getSelection();
    if (!u || u.rangeCount === 0) return null;
    let _ = u.anchorNode;
    if (!_) return null;
    for (; _ && _ !== h; ) {
      if (_.nodeType === 1) {
        const E = _.tagName;
        if (E === "H2" || E === "H3" || E === "H4" || E === "BLOCKQUOTE" || E === "PRE" || E === "P")
          return E;
      }
      _ = _.parentNode;
    }
    return null;
  }
  function y(h, u, _) {
    for (; h && h !== _; ) {
      if (h.nodeType === 1 && h.tagName === u)
        return h;
      h = h.parentNode;
    }
    return null;
  }
  function g(h, u) {
    u.preventDefault();
    let _ = "";
    if (u.clipboardData && (_ = u.clipboardData.getData("text/html"), !_)) {
      const a = u.clipboardData.getData("text/plain");
      a && (_ = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), _ = "<p>" + _ + "</p>");
    }
    if (!_) return;
    const E = m(_);
    E && document.execCommand("insertHTML", !1, E);
  }
  function m(h) {
    const u = document.createElement("div");
    return u.innerHTML = h, b(u), u.innerHTML;
  }
  function b(h) {
    const u = Array.from(h.childNodes);
    for (let _ = 0; _ < u.length; _++) {
      const E = u[_];
      if (E.nodeType !== 3) {
        if (E.nodeType !== 1) {
          h.removeChild(E);
          continue;
        }
        if (l[E.tagName]) {
          const a = Array.from(E.attributes);
          for (let v = 0; v < a.length; v++) {
            const w = a[v].name;
            if (E.tagName === "A" && w === "href") {
              const A = E.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || E.removeAttribute("href");
            } else
              E.removeAttribute(w);
          }
          E.tagName === "A" && E.setAttribute("rel", "noopener noreferrer"), b(E);
        } else {
          for (; E.firstChild; )
            h.insertBefore(E.firstChild, E);
          h.removeChild(E);
        }
      }
    }
  }
  function i(h, u) {
    if (!(u.ctrlKey || u.metaKey)) return;
    let _ = null;
    switch (u.key.toLowerCase()) {
      case "b":
        _ = "bold";
        break;
      case "i":
        _ = "italic";
        break;
      case "u":
        _ = "underline";
        break;
      case "k":
        _ = "link";
        break;
    }
    _ && (u.preventDefault(), h._execAction(_));
  }
  function r(h) {
    const u = window.getSelection();
    if (!u || u.rangeCount === 0) return;
    const _ = y(u.anchorNode, "A", h._surface), E = u.getRangeAt(0).cloneRange();
    h._closeLinkPopover && h._closeLinkPopover();
    const a = gt(h.dom, "ln-editor-link-popover", "ln-editor");
    if (!a) return;
    const v = a.firstElementChild;
    if (!v) return;
    const w = v.querySelector('input[type="url"]'), A = v.querySelector('[data-ln-editor-action="confirm-link"]'), C = v.querySelector('[data-ln-editor-action="cancel-link"]');
    _ && (w.value = _.getAttribute("href") || "");
    const T = h.dom.querySelector('[role="toolbar"]');
    T ? T.after(v) : h.dom.insertBefore(v, h._surface), w.focus();
    function x() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(E);
    }
    function D() {
      document.removeEventListener("mousedown", N), h._closeLinkPopover = null, v.remove();
    }
    function R() {
      const B = w.value.trim();
      if (D(), x(), h._surface.focus(), B)
        if (_)
          _.setAttribute("href", B), _.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea(), L(h.dom, "ln-editor:changed", {
            html: h._textarea.value,
            target: h.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = y(H.anchorNode, "A", h._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), h._syncToTextarea());
          }
        }
      else _ && document.execCommand("unlink", !1, null);
    }
    function M() {
      D(), x(), h._surface.focus();
    }
    function P() {
      D();
    }
    function N(B) {
      const H = h.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !v.contains(B.target) && !H && P();
    }
    h._closeLinkPopover = D, A.addEventListener("click", R), C.addEventListener("click", M), w.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), R()) : B.key === "Escape" && (B.preventDefault(), M());
    }), document.addEventListener("mousedown", N);
  }
  U(t, e, c, "ln-editor");
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function l(o) {
    const p = {}, s = o.dataset;
    for (const n in s) {
      if (!n.startsWith("lnFill") || e[n]) continue;
      const c = n.slice(6);
      c && (p[c.charAt(0).toLowerCase() + c.slice(1)] = s[n]);
    }
    return p;
  }
  function f(o, p) {
    const s = window.CSS && CSS.escape ? CSS.escape(p) : p, n = document.querySelectorAll('[data-ln-fill-id="' + s + '"]');
    if (n.length === 0) return null;
    for (let c = 0; c < n.length; c++) {
      const d = n[c].getAttribute("data-ln-fill-form");
      if (d) {
        const y = document.getElementById(d);
        if (y && o.contains(y)) return n[c];
      }
    }
    return n[0];
  }
  document.addEventListener("click", function(o) {
    if (o.ctrlKey || o.metaKey || o.button === 1) return;
    const p = o.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const s = p.getAttribute("href");
    if (s && s.indexOf("#") !== -1) return;
    const n = p.getAttribute("data-ln-fill-form"), c = document.getElementById(n);
    if (!c) return;
    const d = l(p), y = Object.keys(d).length > 0;
    window.lnCore.lnFill(c, y ? d : null);
  }), document.addEventListener("ln-fill:request", function(o) {
    const p = o.detail;
    if (!p) return;
    const s = o.target, n = p.id;
    if (n == null) {
      window.lnCore.lnFill(s, null);
      return;
    }
    const c = f(s, n);
    if (!c) return;
    const d = l(c);
    window.lnCore.lnFill(s, d);
  }), window[t] = !0;
})();
function Wi(t, e = "-") {
  if (t == null) return "";
  const l = e || "-", f = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, l).replace(new RegExp(`${f}+`, "g"), l).replace(new RegExp(`^${f}+|${f}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  function l(f) {
    if (f.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", f.tagName), this;
    const o = f.form;
    if (!o)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", f), this;
    const p = f.getAttribute(t), s = o.elements[p];
    if (!s)
      return console.warn('[ln-slug] Source field "' + p + '" not found in form:', f), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + p + '" is a RadioNodeList (same-name group) — single source field required:', f), this;
    this.dom = f, this.source = s, this._pristine = f.value === "", this._mirroring = !1;
    const n = this;
    return this._onSource = function() {
      n._pristine && n._mirror();
    }, this._onSlug = function() {
      n._mirroring || (n._pristine = n.dom.value === "");
    }, s.addEventListener("input", this._onSource), f.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  l.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Wi(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, U(t, e, l, "ln-slug");
})();
function Gi(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const l = typeof e == "number" ? e : e.getTime(), f = t.getTime(), o = Math.floor((f - l) / 1e3), p = Math.abs(o);
  return p < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : p < 60 ? { value: o, unit: "second", isOlderThanMonth: !1 } : p < 3600 ? { value: Math.round(o / 60), unit: "minute", isOlderThanMonth: !1 } : p < 86400 ? { value: Math.round(o / 3600), unit: "hour", isOlderThanMonth: !1 } : p < 604800 ? { value: Math.round(o / 86400), unit: "day", isOlderThanMonth: !1 } : p < 2592e3 ? { value: Math.round(o / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(o / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Ht(t, e, l = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const f = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== l.getFullYear() && (f.year = "numeric"), f;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const l = {}, f = {};
  function o(v) {
    return v.getAttribute("data-ln-time-locale") || G(v);
  }
  function p(v, w) {
    const A = (v || "") + "|" + JSON.stringify(w);
    return l[A] || (l[A] = new Intl.DateTimeFormat(v, w)), l[A];
  }
  function s(v) {
    const w = v || "";
    return f[w] || (f[w] = new Intl.RelativeTimeFormat(v, { numeric: "auto", style: "narrow" })), f[w];
  }
  const n = /* @__PURE__ */ new Set();
  let c = null;
  function d() {
    c || (c = setInterval(g, 6e4));
  }
  function y() {
    c && (clearInterval(c), c = null);
  }
  function g() {
    for (const v of n) {
      if (!document.body.contains(v.dom)) {
        n.delete(v);
        continue;
      }
      u(v);
    }
    n.size === 0 && y();
  }
  function m(v, w) {
    const A = yt(w), C = (w || "").toLowerCase().split("-")[0], T = p(w, Ht("full", v)), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (A && x !== C && A.monthsLong) {
      const D = A.monthsLong[v.getMonth()], R = v.getDate(), M = v.getFullYear(), P = String(v.getHours()).padStart(2, "0"), N = String(v.getMinutes()).padStart(2, "0");
      return `${R} ${D} ${M} во ${P}:${N}`;
    }
    return T.format(v);
  }
  function b(v, w) {
    const A = Ht("short", v), C = yt(w), T = (w || "").toLowerCase().split("-")[0], x = p(w, A), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && D !== T && C.monthsShort) {
      const R = C.monthsShort[v.getMonth()], M = v.getDate(), P = A.year ? " " + v.getFullYear() : "";
      return `${M} ${R}${P}`;
    }
    return x.format(v);
  }
  function i(v, w) {
    return p(w, Ht("date", v)).format(v);
  }
  function r(v, w) {
    return p(w, Ht("time", v)).format(v);
  }
  function h(v, w) {
    const A = Gi(v);
    return A.isOlderThanMonth ? b(v, w) : s(w).format(A.value, A.unit);
  }
  function u(v) {
    const w = v.dom.getAttribute("datetime");
    if (!w) return;
    const A = J(w);
    if (!A) return;
    const C = v.dom.getAttribute(t) || "short", T = o(v.dom);
    let x;
    switch (C) {
      case "relative":
        x = h(A, T);
        break;
      case "full":
        x = m(A, T);
        break;
      case "date":
        x = i(A, T);
        break;
      case "time":
        x = r(A, T);
        break;
      default:
        x = b(A, T);
        break;
    }
    v.dom.textContent = x, C !== "full" && (v.dom.title = m(A, T));
  }
  function _(v) {
    this.dom = v;
    const w = this;
    return this._onLocaleChange = function() {
      u(w);
    }, Yt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), u(this), v.getAttribute(t) === "relative" && (n.add(this), d()), this;
  }
  _.prototype.render = function() {
    u(this);
  }, _.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), n.delete(this), n.size === 0 && y(), delete this.dom[e];
  };
  function E(v) {
    const w = v[e];
    if (!w) return;
    v.getAttribute(t) === "relative" ? (n.add(w), d()) : (n.delete(w), n.size === 0 && y()), u(w);
  }
  function a(v) {
    v.nodeType === 1 && v.hasAttribute && v.hasAttribute(t) && v[e] && u(v[e]);
  }
  U(t, e, _, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: E,
    onInit: a
  });
})();
function Qi(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, l = t.pageSize > 0 ? t.pageSize : 200, f = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const o = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, p = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let n = 0, c = 0, d = 0, y = !1, g = null;
  function m(r, h) {
    p.delete(r), p.set(r, h);
  }
  function b() {
    if (p.size <= e) return [];
    const r = [];
    for (; p.size > e; ) {
      const u = p.keys().next().value;
      r.push(p.get(u)), p.delete(u);
    }
    const h = new Set(p.values());
    return r.filter((u) => !h.has(u));
  }
  function i(r, h) {
    s.add(r), clearTimeout(g), g = setTimeout(() => o(r, l, h), f);
  }
  return {
    get logicalTotal() {
      return n;
    },
    set logicalTotal(r) {
      n = r;
    },
    get grandTotal() {
      return c;
    },
    set grandTotal(r) {
      c = r;
    },
    get queryGen() {
      return d;
    },
    set queryGen(r) {
      d = r;
    },
    get size() {
      return p.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return y;
    },
    getId: (r) => {
      if (!p.has(r)) return;
      const h = p.get(r);
      return m(r, h), h;
    },
    ensure: (r, h, u) => {
      if (!y && !s.has(0)) return i(0, u);
      if (n <= 0) return;
      const _ = Math.max(0, r), E = Math.min(n, h);
      for (let a = _; a < E; a++)
        if (!p.has(a)) {
          const v = Math.floor(a / l) * l;
          if (!s.has(v)) return i(v, u);
        }
    },
    ingest: (r, h, u, _, E) => {
      if (E != null && E !== d) return [];
      y = !0, u != null && (c = u), _ != null && (n = _);
      for (let a = 0; a < h.length; a++)
        m(r + a, h[a]);
      return s.delete(r), b();
    },
    reset: function() {
      d++, this.clear();
    },
    clear: () => {
      y = !1, p.clear(), s.clear(), clearTimeout(g);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (r = {}) => {
      let h = [];
      return r.windowSize > 0 && r.windowSize !== e && (e = r.windowSize, h = b()), r.pageSize > 0 && (l = r.pageSize), r.fetchDebounce >= 0 && (f = r.fetchDebounce), h;
    }
  };
}
function $i(t, e, l) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: f, direction: o } = e, p = o === "desc", s = t.map((c) => c ? c[f] : void 0), n = ge(s);
  return [...t].sort((c, d) => {
    const y = c ? c[f] : void 0, g = d ? d[f] : void 0, m = _e(y, g, n, l);
    return p ? -m : m;
  });
}
function qn(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const l = Object.keys(e).filter((f) => Array.isArray(e[f]) && e[f].length > 0);
  return l.length ? t.filter((f) => f ? l.every((o) => ve(f[o], e[o])) : !1) : t;
}
function Yi(t, e, l) {
  if (!Array.isArray(t) || !e || !l || !l.length) return t;
  const f = pn(e);
  return f.length ? t.filter((o) => o ? f.every(
    (p) => l.some((s) => {
      const n = o[s];
      return n != null && mn(String(n), [p]);
    })
  ) : !1) : t;
}
function Xi(t, e, l) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (l === "count") return t.length;
  const f = t.map((p) => p && p[e] != null ? parseFloat(p[e]) : NaN).filter((p) => Number.isFinite(p)), o = f.reduce((p, s) => p + s, 0);
  return l === "sum" ? o : l === "avg" && f.length ? o / f.length : 0;
}
function Ji(t, e = {}, l = [], f) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const o = t.length;
  let p = t;
  e.filters && (p = qn(p, e.filters)), e.search && (p = Yi(p, e.search, l));
  const s = p.length;
  if (e.sort && (p = $i(p, e.sort, f)), e.offset || e.limit) {
    const n = e.offset || 0, c = e.limit || p.length;
    p = p.slice(n, n + c);
  }
  return { records: p, total: o, filtered: s };
}
function Zi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((l) => {
    if (!l) return null;
    const f = { ...l };
    for (const [o, p] of Object.entries(e))
      if (typeof p == "function")
        try {
          f[o] = p(l);
        } catch {
          f[o] = void 0;
        }
    return f;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore", l = "data-ln-data-store-no-local-query";
  if (window[e] !== void 0) return;
  const f = "ln_app_cache", o = "_meta", p = "1.0";
  let s = null, n = null;
  const c = {};
  function d(S) {
    S && S.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: S });
  }
  function y() {
    const S = {};
    for (const q of document.querySelectorAll(`[${t}]`)) {
      const k = q.id;
      if (k) {
        const I = q.getAttribute("data-ln-data-store-indexes") || "";
        S[k] = {
          indexes: I.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return S;
  }
  function g() {
    return n || (n = new Promise((S) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), S(null);
      const q = y(), k = Object.keys(q), I = indexedDB.open(f);
      I.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), S(null);
      }, I.onsuccess = (O) => {
        const F = O.target.result, K = Array.from(F.objectStoreNames);
        if (!(!K.includes(o) || k.some((rt) => !K.includes(rt))))
          return m(F), s = F, S(F);
        const V = F.version;
        F.close();
        const $ = indexedDB.open(f, V + 1);
        $.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, $.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), S(null);
        }, $.onupgradeneeded = (rt) => {
          const Z = rt.target.result;
          Z.objectStoreNames.contains(o) || Z.createObjectStore(o, { keyPath: "key" });
          for (const _t of k)
            if (!Z.objectStoreNames.contains(_t)) {
              const Lt = Z.createObjectStore(_t, { keyPath: "id" });
              for (const ee of q[_t].indexes)
                Lt.createIndex(ee, ee, { unique: !1 });
            }
        }, $.onsuccess = (rt) => {
          const Z = rt.target.result;
          m(Z), s = Z, S(Z);
        };
      };
    }), n);
  }
  function m(S) {
    S.onversionchange = () => {
      S.close(), s = null, n = null;
    };
  }
  function b() {
    return s ? Promise.resolve(s) : (n = null, g());
  }
  async function i(S) {
    if (!ft() || !S) return S;
    const q = { ...S }, k = q.id, I = await ei(q);
    return !I || !I.encrypted ? S : {
      id: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function r(S) {
    return !S || !S.encrypted || !ft() ? S : ni(S);
  }
  const h = (S, q) => b().then((k) => k ? k.transaction(S, q).objectStore(S) : null);
  function u(S) {
    return new Promise((q, k) => {
      S.onsuccess = () => q(S.result), S.onerror = () => {
        d(S.error), k(S.error);
      };
    });
  }
  const _ = (S) => h(S, "readonly").then((q) => q ? u(q.getAll()) : []).then((q) => ft() ? Promise.all(q.map((k) => r(k))) : q), E = (S, q) => h(S, "readonly").then((k) => k ? u(k.get(q)) : null).then((k) => k ? r(k) : null), a = (S, q) => b().then((k) => {
    if (!k) return [];
    const O = k.transaction(S, "readonly").objectStore(S), F = q.map((K) => u(O.get(K)));
    return Promise.all(F).then((K) => ft() ? Promise.all(K.map((j) => r(j))) : K);
  }), v = (S, q) => (ft() ? i(q) : Promise.resolve(q)).then((I) => h(S, "readwrite").then((O) => O ? u(O.put(I)) : null)), w = (S, q) => h(S, "readwrite").then((k) => k ? u(k.delete(q)) : null), A = (S) => h(S, "readwrite").then((q) => q ? u(q.clear()) : null), C = (S) => h(S, "readonly").then((q) => q ? u(q.count()) : 0), T = (S) => h(o, "readonly").then((q) => q ? u(q.get(S)) : null), x = (S, q) => h(o, "readwrite").then((k) => {
    if (k)
      return q.key = S, u(k.put(q));
  });
  function D(S, q, k) {
    const I = S.getAttribute(q);
    if (I === "never" || I === "-1") return -1;
    const O = parseInt(I, 10);
    return isNaN(O) ? k : O;
  }
  function R(S) {
    return this.dom = S, this._name = S.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", S), li(this, S, {
      _staleThreshold: [D, "data-ln-data-store-stale", 300],
      _searchFields: [ai, "data-ln-data-store-search-fields"],
      noLocalQuery: [si, l],
      _windowSize: [qe, "data-ln-data-store-window", 1e3],
      _windowPageSize: [qe, "data-ln-data-store-window-page", 200]
    }), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, S.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Qi({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (q, k, I) => {
        L(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: q,
          limit: k,
          query: I,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), c[this._name] = this, M(this), this.ready = Zt(this), this;
  }
  function M(S) {
    S._handlers = {
      create: (q) => P(S, "create", q.detail, () => B(S, q.detail)),
      update: (q) => P(S, "update", q.detail, () => H(S, q.detail)),
      delete: (q) => P(S, "delete", q.detail, () => z(S, q.detail)),
      "bulk-delete": (q) => P(S, "bulk-delete", q.detail, () => Q(S, q.detail)),
      "sync-failed": (q) => {
        S.isSyncing = !1, L(S.dom, "ln-data-store:sync-error", {
          store: S._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, k] of Object.entries(S._handlers))
      S.dom.addEventListener(`ln-data-store:request-${q}`, k);
    S._queryHandlers = {
      "ln-search:change": (q) => {
        q.preventDefault();
        const k = q.detail && q.detail.term != null ? q.detail.term : "";
        k !== S.query.search && (S.query.search = k, te(S));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const k = q.detail && q.detail.key;
        if (!k) return;
        const I = (q.detail.values || []).slice(), O = S.query.filters[k];
        (O ? O.length === I.length && O.every((K, j) => K === I[j]) : !I.length) || (I.length ? S.query.filters[k] = I : delete S.query.filters[k], te(S));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const k = q.detail && q.detail.field, I = q.detail && q.detail.direction, O = I && I !== "none" ? { field: k, direction: I } : null, F = S.query.sort;
        !F && !O || F && O && F.field === O.field && F.direction === O.direction || (S.query.sort = O, te(S));
      }
    };
    for (const [q, k] of Object.entries(S._queryHandlers))
      S.dom.addEventListener(q, k);
  }
  function P(S, q, k, I) {
    const O = k && k.requestId;
    return S._mutationChain = S._mutationChain.then(() => S.ready).then(() => {
      if (S.initializationError) throw S.initializationError;
      return I();
    }).catch((F) => St(S, q, O, F)), S._mutationChain;
  }
  function N(S, q = 0) {
    return C(S._name).then((k) => {
      if (S._windowIndex || S.windowed) {
        const I = S.totalCount != null ? S.totalCount : k;
        S.totalCount = Math.max(0, I + q);
      } else
        S.totalCount = k;
      return S.hasCache = !0, S.isLoaded = !0, S.canServe = !0, x(S._name, {
        schema_version: p,
        last_synced_at: S.lastSyncedAt,
        has_cache: !0,
        record_count: S.totalCount
      });
    });
  }
  function B(S, { tempId: q, data: k = {}, requestId: I } = {}) {
    const O = { ...k, id: q };
    return v(S._name, O).then(() => N(S, 1)).then(() => {
      L(S.dom, "ln-data-store:created", { store: S._name, record: O, tempId: q, requestId: I });
    });
  }
  function H(S, { id: q, data: k = {}, requestId: I } = {}) {
    return E(S._name, q).then((O) => {
      if (!O) throw new Error(`Record not found: ${q}`);
      const F = { ...O, ...k }, K = k.id;
      return (K !== void 0 && K !== q ? Dn(S._name, q, F) : v(S._name, F)).then(() => N(S, 0)).then(() => {
        L(S.dom, "ln-data-store:updated", { store: S._name, record: F, previous: O, requestId: I });
      });
    });
  }
  function z(S, { id: q, requestId: k } = {}) {
    return E(S._name, q).then((I) => {
      if (!I) {
        L(S.dom, "ln-data-store:deleted", { store: S._name, id: q, requestId: k, missing: !0 });
        return;
      }
      return w(S._name, q).then(() => N(S, -1)).then(() => {
        L(S.dom, "ln-data-store:deleted", { store: S._name, id: q, requestId: k });
      });
    });
  }
  function Q(S, { ids: q = [], requestId: k } = {}) {
    return q.length ? Promise.all(q.map((I) => E(S._name, I))).then((I) => {
      const O = I.filter(Boolean).map((F) => F.id);
      return Nt(S._name, O).then(() => N(S, -O.length)).then(() => {
        L(S.dom, "ln-data-store:deleted", { store: S._name, ids: O, requestId: k });
      });
    }) : (L(S.dom, "ln-data-store:deleted", { store: S._name, ids: [], requestId: k }), Promise.resolve());
  }
  function St(S, q, k, I) {
    console.error("[ln-data-store] " + q + " failed:", I), L(S.dom, "ln-data-store:mutation-error", {
      store: S._name,
      action: q,
      requestId: k,
      error: I
    });
  }
  function Zt(S) {
    return g().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return T(S._name);
    }).then((q) => {
      if (S.initializationError = null, q && q.schema_version === p)
        S.lastSyncedAt = q.last_synced_at || null, S.totalCount = q.record_count || 0, S.hasCache = q.has_cache === !0 || S.totalCount > 0, S.hasCache && (S.isLoaded = !0, S.canServe = !0, L(S.dom, "ln-data-store:ready", { store: S._name, count: S.totalCount, source: "cache" })), S.isInitialized = !0, L(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: S.hasCache, lastSyncedAt: S.lastSyncedAt, count: S.totalCount });
      else {
        if (q && q.schema_version !== p)
          return A(S._name).then(() => x(S._name, { schema_version: p, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            S.isInitialized = !0, S.hasCache = !1, L(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        S.isInitialized = !0, S.hasCache = !1, L(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (S.isInitialized = !0, S.isLoaded = !1, S.canServe = !1, S.hasCache = !1, S.isSyncing = !1, S.initializationError = q, L(S.dom, "ln-data-store:initialization-error", { store: S._name, error: q }), { ok: !1, error: q }));
  }
  function lt(S) {
    S.isSyncing = !0, L(S.dom, "ln-data-store:request-remote-sync", { since: S.lastSyncedAt });
  }
  function Ft(S, q) {
    return b().then((k) => k ? (ft() ? Promise.all(q.map((O) => i(O))) : Promise.resolve(q)).then((O) => new Promise((F, K) => {
      const j = k.transaction(S, "readwrite"), V = j.objectStore(S);
      O.forEach(($) => V.put($)), j.oncomplete = () => F(), j.onerror = () => {
        d(j.error), K(j.error);
      };
    })) : void 0);
  }
  function Nt(S, q) {
    return b().then((k) => {
      if (k)
        return new Promise((I, O) => {
          const F = k.transaction(S, "readwrite"), K = F.objectStore(S);
          q.forEach((j) => K.delete(j)), F.oncomplete = () => I(), F.onerror = () => O(F.error);
        });
    });
  }
  function Dn(S, q, k) {
    return (ft() ? i(k) : Promise.resolve(k)).then((O) => b().then((F) => {
      if (F)
        return new Promise((K, j) => {
          const V = F.transaction(S, "readwrite"), $ = V.objectStore(S);
          $.put(O), $.delete(q), V.oncomplete = () => K(), V.onerror = () => {
            d(V.error), j(V.error);
          };
        });
    }));
  }
  const In = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Rn(S) {
    return S ? Object.keys(S).filter((q) => Array.isArray(S[q]) && S[q].length > 0) : [];
  }
  function On(S, q, k) {
    return q.every((I) => k[I].map(String).includes(String(S[I])));
  }
  function Mn(S) {
    return String(S || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Fn(S, q, k) {
    return q.every(
      (I) => k.some((O) => {
        const F = S[O];
        return F != null && String(F).toLowerCase().includes(I);
      })
    );
  }
  function Nn(S, q, k) {
    return Xi(S, q, k);
  }
  function Ct(S, q) {
    return Zi(q, S.presenters && S.presenters.computed);
  }
  function Pn(S) {
    return !S.sort && !ft();
  }
  function Bn(S, q, k) {
    const I = Rn(q.filters), O = q.search ? Mn(q.search) : [], F = S._searchFields, K = O.length > 0 && F && F.length > 0;
    return h(S._name, "readonly").then((j) => j ? new Promise((V, $) => {
      const rt = [], Z = j.openCursor();
      Z.onsuccess = () => {
        const _t = Z.result;
        if (!_t || rt.length >= k) {
          V(rt);
          return;
        }
        const Lt = _t.value;
        (!I.length || On(Lt, I, q.filters)) && (!K || Fn(Lt, O, F)) && rt.push(Lt), _t.continue();
      }, Z.onerror = () => $(Z.error);
    }) : []);
  }
  function Ae(S, q, k) {
    return Ji(q, k, S._searchFields, In);
  }
  function Se(S, q, k) {
    const I = [];
    for (let F = q; F < q + k; F++) {
      const K = S._windowIndex.getId(F);
      I.push(K);
    }
    const O = Array.from(new Set(I.filter((F) => F !== void 0)));
    return a(S._name, O).then((F) => {
      const K = /* @__PURE__ */ new Map();
      for (let V = 0; V < F.length; V++) {
        const $ = F[V];
        $ && K.set(String($.id), $);
      }
      const j = [];
      for (let V = 0; V < I.length; V++) {
        const $ = I[V];
        if ($ === void 0)
          j.push(null);
        else {
          const rt = K.get(String($));
          j.push(rt || null);
        }
      }
      return {
        data: Ct(S, j),
        total: S._windowIndex.grandTotal,
        filtered: S._windowIndex.logicalTotal,
        offset: q,
        queryGen: S._windowIndex.queryGen
      };
    });
  }
  R.prototype.getAll = function(S = {}) {
    const q = this;
    if (q._windowIndex) {
      const k = S.offset || 0, I = S.limit || 200;
      if (q._windowIndex.ensure(k, k + I, S), !q._windowIndex.hasLoaded && !q.noLocalQuery) {
        const O = k + I, F = (K) => K.length ? {
          data: Ct(q, K),
          offset: k,
          queryGen: q._windowIndex.queryGen,
          provisional: !0
        } : Se(q, k, I);
        return Pn(S) ? Bn(q, S, O).then((K) => F(K.slice(k, O))) : _(q._name).then((K) => F(Ae(q, K, S).records));
      }
      return Se(q, k, I);
    }
    return _(q._name).then((k) => {
      const I = Ae(q, k, S);
      return {
        data: Ct(q, I.records),
        total: I.total,
        filtered: I.filtered
      };
    });
  }, R.prototype.getById = function(S) {
    return E(this._name, S).then((q) => q ? Ct(this, [q])[0] : null);
  }, R.prototype.count = function(S) {
    return S && Object.keys(S).length > 0 ? _(this._name).then((k) => qn(k, S).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, R.prototype.aggregate = function(S, q) {
    return _(this._name).then((k) => Nn(k, S, q));
  }, R.prototype.setPresenters = function(S) {
    this.presenters = S;
  }, R.prototype.applySync = function(S, q, k, I) {
    I = I || {};
    const O = this;
    if (O._windowIndex && I.queryGen != null && I.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    S.length > 0 || q.length > 0;
    let F = Promise.resolve();
    return S.length > 0 && (F = F.then(() => Ft(O._name, S))), q.length > 0 && (F = F.then(() => Nt(O._name, q))), F.then(() => {
      if (O._windowIndex && (I.offset != null || I.total != null)) {
        const K = I.offset != null ? I.offset : 0, j = S.map(($) => $.id), V = O._windowIndex.ingest(K, j, I.total, I.filtered, I.queryGen);
        if (V && V.length) return Nt(O._name, V);
      }
    }).then(() => C(O._name)).then((K) => (O.totalCount = I.total !== void 0 ? I.total : K, O.hasCache = !0, x(O._name, {
      schema_version: p,
      last_synced_at: k,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const K = !O.isLoaded;
      O.isLoaded = !0, O.canServe = !0, O.isSyncing = !1, O.lastSyncedAt = k, K ? (L(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: I }), L(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: I })) : L(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: S.length,
        deleted: q.length,
        changed: !0,
        meta: I
      });
    }).catch((K) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, R.prototype.applyQuery = function(S, q) {
    q = q || {};
    const k = this;
    let I = Promise.resolve();
    return S.length > 0 && (I = I.then(() => Ft(k._name, S))), I.then(() => C(k._name)).then((O) => (k.totalCount = q.total !== void 0 ? q.total : O, S.length > 0 && (k.canServe = !0), Ct(k, S))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, R.prototype.forceSync = function() {
    this.isSyncing || lt(this);
  }, R.prototype.fullReload = function() {
    const S = this;
    return A(S._name).then(() => x(S._name, {
      schema_version: p,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      S.isLoaded = !1, S.hasCache = !1, S.lastSyncedAt = null, S.totalCount = 0, lt(S);
    });
  }, R.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [S, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${S}`, q);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [S, q] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(S, q);
      this._queryHandlers = null;
    }
    delete c[this._name], delete this.dom[e], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Hn() {
    return b().then((S) => {
      if (!S) return;
      const q = Array.from(S.objectStoreNames);
      return new Promise((k, I) => {
        const O = S.transaction(q, "readwrite");
        q.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => k(), O.onerror = () => I(O.error);
      });
    }).then(() => {
      Object.values(c).forEach((S) => {
        S.isLoaded = !1, S.canServe = !1, S.isInitialized = !1, S.initializationError = null, S.hasCache = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      });
    });
  }
  function te(S) {
    S._windowIndex && S._windowIndex.reset(), L(S.dom, "ln-data-store:query-changed", {
      store: S._name,
      query: {
        filters: Object.assign({}, S.query.filters),
        search: S.query.search,
        sort: S.query.sort ? Object.assign({}, S.query.sort) : null
      }
    });
  }
  const Un = "data-ln-data-store-frozen";
  function Ce(S, q) {
    S.setAttribute(Un, q);
  }
  function zn(S) {
    const q = S[e];
    if (!q._windowIndex) return;
    const k = q._windowIndex.configure({ windowSize: q._windowSize });
    k.length && Nt(q._name, k).catch((I) => {
      console.error("[ln-data-store] window shrink eviction failed:", I);
    });
  }
  U(t, e, R, "ln-data-store", {
    effects: {
      "data-ln-data-store-window": zn,
      "data-ln-data-store-window-page": (S) => {
        const q = S[e];
        q._windowIndex && q._windowIndex.configure({ pageSize: q._windowPageSize });
      },
      "data-ln-data-store-indexes": Ce,
      "data-ln-data-store": Ce
    }
  }), window[e].clearAll = Hn, window[e].init = window[e], window[e].setStorageKey = Te, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Te);
})();
const tr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function bt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, l) => {
    const f = String(e);
    return l === 0 ? f.replace(/\/+$/, "") : f.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function er(t, e) {
  if (!t || typeof t != "object") return "";
  const l = Object.assign({}, tr);
  if (e && typeof e == "object")
    for (const o in e)
      e[o] !== void 0 && e[o] !== null && e[o] !== "" && (l[o] = e[o]);
  const f = new URLSearchParams();
  return t.search && f.append(l.search, t.search), t.offset != null && f.append(l.offset, t.offset), t.limit != null && f.append(l.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (f.append(l.sortField, t.sort.field), f.append(l.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((o) => {
    const p = t.filters[o];
    Array.isArray(p) && p.length > 0 && f.append(o, p.join(","));
  }), f.toString();
}
function nr(t, e, l) {
  let f = bt(t, e);
  return l && (f += (f.indexOf("?") !== -1 ? "&" : "?") + l), f;
}
function Ue(t) {
  const e = t && t.content !== void 0 ? t.content : t, l = t && t.message ? t.message : null;
  return { record: e, message: l };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", l = "lnConnector";
  if (window[e] !== void 0) return;
  function f(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((c) => {
      const d = new Error("HTTP " + n.status + ": " + n.statusText);
      throw d.status = n.status, d.data = c, d;
    });
  }
  function o(n) {
    return this.dom = n, n[e] = this, n[l] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, p(this), this;
  }
  o.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = n.getAttribute("data-ln-api-headers"), this.headers = on(this.rawHeaders);
    const c = {}, d = n.getAttribute("data-ln-api-param-offset");
    d && (c.offset = d);
    const y = n.getAttribute("data-ln-api-param-limit");
    y && (c.limit = y);
    const g = n.getAttribute("data-ln-api-param-search");
    g && (c.search = g);
    const m = n.getAttribute("data-ln-api-param-sort-field");
    m && (c.sortField = m);
    const b = n.getAttribute("data-ln-api-param-sort-dir");
    b && (c.sortDir = b), this.paramKeys = c;
    const i = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = i !== null ? +i : 300, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, o.prototype._reqHeaders = function(n) {
    const c = Object.assign({}, this.headers);
    return !c.Accept && !c.accept && (c.Accept = "application/json"), !c["Content-Type"] && !c["content-type"] && (c["Content-Type"] = "application/json"), n && (c["X-Idempotency-Key"] = n), c;
  }, o.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, o.prototype.fetchDelta = function(n, c) {
    const d = this;
    let y = bt(d.baseUrl, d.path);
    n != null && n !== "" && (y += (y.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const g = c || "sync";
    d._inflight.has(g) && d._inflight.get(g).abort();
    const m = new AbortController();
    return d._inflight.set(g, m), window.fetch(y, {
      method: "GET",
      headers: d._reqHeaders(),
      credentials: d.credentials,
      signal: m.signal
    }).then(f).finally(function() {
      d._inflight.get(g) === m && d._inflight.delete(g);
    });
  }, o.prototype.query = function(n, c) {
    const d = this, y = er(n, d.paramKeys), g = nr(d.baseUrl, d.path, y), m = c || "query";
    d._inflight.has(m) && d._inflight.get(m).abort();
    const b = new AbortController();
    return d._inflight.set(m, b), window.fetch(g, {
      method: "GET",
      headers: d._reqHeaders(),
      credentials: d.credentials,
      signal: b.signal
    }).then(f).finally(function() {
      d._inflight.get(m) === b && d._inflight.delete(m);
    });
  }, o.prototype.create = function(n, c, d) {
    const y = this;
    return window.fetch(bt(y.baseUrl, c || y.path), {
      method: "POST",
      headers: y._reqHeaders(d),
      credentials: y.credentials,
      body: JSON.stringify(n)
    }).then(f);
  }, o.prototype.update = function(n, c, d, y, g) {
    const m = this;
    d != null && (c = Object.assign({}, c, { expected_version: d }));
    const b = y ? bt(m.baseUrl, y) : bt(m.baseUrl, m.path, n);
    return window.fetch(b, {
      method: "PUT",
      headers: m._reqHeaders(g),
      credentials: m.credentials,
      body: JSON.stringify(c)
    }).then(f);
  }, o.prototype.delete = function(n, c, d) {
    const y = this;
    return window.fetch(bt(y.baseUrl, c || y.path, n), {
      method: "DELETE",
      headers: y._reqHeaders(d),
      credentials: y.credentials
    }).then(f);
  }, o.prototype.bulkDelete = function(n, c, d) {
    const y = this;
    return window.fetch(bt(y.baseUrl, c || y.path, "bulk-delete"), {
      method: "DELETE",
      headers: y._reqHeaders(d),
      credentials: y.credentials,
      body: JSON.stringify({ ids: n })
    }).then(f);
  };
  function p(n) {
    n._handlers = {
      sync: function(c) {
        const d = c.detail || {}, y = d.meta && d.meta.targetEl ? d.meta.targetEl : null;
        n.fetchDelta(d.since, y).then(function(g) {
          L(n.dom, "ln-api-connector:fetched", { data: g, since: d.since, meta: d.meta || null });
        }).catch(function(g) {
          g && g.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: g.message,
            status: g.status || 0,
            data: g.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(c) {
        const d = c.detail || {}, y = d.query || d, g = d.meta && d.meta.targetEl ? d.meta.targetEl : null, m = g || "query", b = n.queryDebounce;
        function i(h, u, _) {
          n.query(u, _).then(function(E) {
            const a = E || {};
            L(n.dom, "ln-api-connector:fetched", {
              data: a.data || (Array.isArray(a) ? a : []),
              total: a.total,
              filtered: a.filtered,
              offset: u.offset,
              queryGen: u.queryGen,
              meta: h.meta || null
            });
          }).catch(function(E) {
            E && E.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
              action: "query",
              error: E.message,
              status: E.status || 0,
              data: E.data || null,
              meta: h.meta || null
            });
          });
        }
        if (b === 0) {
          i(d, y, g);
          return;
        }
        n._queryTimers.has(m) && clearTimeout(n._queryTimers.get(m));
        const r = setTimeout(function() {
          n._queryTimers.delete(m), i(d, y, g);
        }, b);
        n._queryTimers.set(m, r);
      },
      cancel: function(c) {
        const d = c.detail || {}, y = d.meta && d.meta.targetEl ? d.meta.targetEl : d.targetEl || d.key;
        y && n.cancel(y);
      },
      create: function(c) {
        const d = c.detail || {};
        n.create(d.data, d.url, d.idempotencyKey).then(function(y) {
          const g = Ue(y);
          L(n.dom, "ln-api-connector:created", {
            record: g.record,
            tempId: d.tempId,
            message: g.message,
            meta: d.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "create",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(c) {
        const d = c.detail || {};
        n.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(y) {
          const g = Ue(y);
          L(n.dom, "ln-api-connector:updated", {
            record: g.record,
            id: d.id,
            message: g.message,
            meta: d.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: d.id,
            conflictData: y.status === 409 ? y.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(c) {
        const d = c.detail || {};
        n.delete(d.id, d.url, d.idempotencyKey).then(function(y) {
          const g = y && y.message ? y.message : null;
          L(n.dom, "ln-api-connector:deleted", {
            response: y,
            id: d.id,
            message: g,
            meta: d.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(c) {
        const d = c.detail || {};
        n.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(y) {
          const g = y && y.message ? y.message : null;
          L(n.dom, "ln-api-connector:bulk-deleted", {
            response: y,
            ids: d.ids,
            message: g,
            meta: d.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(c) {
      c.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(c) {
      c && clearTimeout(c);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[l];
  };
  function s(n) {
    const c = n[e];
    c && c.refreshConfig();
  }
  U(t, e, o, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers",
      "data-ln-api-param-offset",
      "data-ln-api-param-limit",
      "data-ln-api-param-search",
      "data-ln-api-param-sort-field",
      "data-ln-api-param-sort-dir",
      "data-ln-api-connector-query-debounce"
    ],
    onAttributeChange: s
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", l = "lnConnector";
  if (window[e] !== void 0) return;
  function f(m) {
    const b = m && m.content !== void 0 ? m.content : m, i = m && m.message ? m.message : null;
    return { content: b, message: i };
  }
  function o(m) {
    return this.dom = m, m[e] = this, m[l] = this, this.refreshConfig(), this._handlers = null, y(this), this;
  }
  o.prototype.refreshConfig = function() {
    const m = this.dom;
    this.url = m.getAttribute("data-ln-couchdb-url") || "", this.db = m.getAttribute("data-ln-couchdb-db") || "", this.auth = m.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const b = m.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = on(b, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), b.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(m, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function p(m, b, i) {
    const r = Object.assign({}, Tt(m.headers, m.auth), i || {});
    return b && (r["Idempotency-Key"] = b), r;
  }
  o.prototype.fetchDelta = function(m) {
    const b = this, i = ["include_docs=true", "feed=normal"];
    m && i.push("since=" + encodeURIComponent(m));
    const r = ht(b.url, b.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: Tt(b.headers, b.auth), credentials: b.credentials }).then((h) => {
      if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
      return h.json();
    }).then((h) => {
      const u = h.results || [];
      return {
        data: u.filter((_) => !_.deleted && _.doc).map((_) => Object.assign({}, _.doc, { id: _.doc._id })),
        deleted: u.filter((_) => _.deleted).map((_) => _.id),
        synced_at: h.last_seq || m || ""
      };
    });
  };
  function s(m, b, i) {
    const r = Object.assign({ _id: b.id }, b);
    return r._id || delete r._id, window.fetch(ht(m.url, m.db), {
      method: "POST",
      headers: p(m, i),
      credentials: m.credentials,
      body: JSON.stringify(r)
    }).then((h) => {
      if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
      return h.json();
    }).then((h) => {
      const u = f(h), _ = u.content;
      return { record: Object.assign({}, r, { id: _.id, _id: _.id, _rev: _.rev }), message: u.message };
    });
  }
  o.prototype.create = function(m, b) {
    return s(this, m, b).then((i) => i.record);
  };
  function n(m, b, i, r) {
    const h = Object.assign({ id: String(b), _id: String(b) }, i), u = h._rev || h.rev;
    return (u ? Promise.resolve(u) : window.fetch(ht(m.url, m.db, null, b), { method: "GET", headers: Tt(m.headers, m.auth), credentials: m.credentials }).then((E) => {
      if (!E.ok) throw new Error("Could not retrieve document for revision mapping");
      return E.json().then((a) => a._rev);
    })).then((E) => {
      const a = Object.assign({}, h, { _rev: E });
      delete a.rev;
      const v = p(m, r, { "If-Match": E });
      return window.fetch(ht(m.url, m.db, null, b), {
        method: "PUT",
        headers: v,
        credentials: m.credentials,
        body: JSON.stringify(a)
      }).then((w) => {
        if (w.ok) return w.json().then((A) => {
          const C = f(A);
          return { record: Object.assign({}, a, { _rev: C.content.rev }), message: C.message };
        });
        if (w.status === 409) return w.json().then((A) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = A, C;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  o.prototype.update = function(m, b, i) {
    return n(this, m, b, i).then((r) => r.record);
  };
  function c(m, b, i, r) {
    return (i ? Promise.resolve(i) : window.fetch(ht(m.url, m.db, null, b), { method: "GET", headers: Tt(m.headers, m.auth), credentials: m.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision delete");
      return u.json().then((_) => _._rev);
    })).then((u) => {
      const _ = ht(m.url, m.db, null, b) + "?rev=" + encodeURIComponent(u);
      return window.fetch(_, { method: "DELETE", headers: p(m, r), credentials: m.credentials }).then((E) => {
        if (!E.ok) throw new Error("HTTP " + E.status + ": " + E.statusText);
        return E.json();
      }).then((E) => {
        const a = f(E);
        return { response: a.content, message: a.message };
      });
    });
  }
  o.prototype.delete = function(m, b, i) {
    return c(this, m, b, i).then((r) => r.response);
  };
  function d(m, b, i) {
    return !b || b.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(ht(m.url, m.db, "_all_docs"), {
      method: "POST",
      headers: Tt(m.headers, m.auth),
      credentials: m.credentials,
      body: JSON.stringify({ keys: b })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const u = (r.rows || []).filter((_) => !_.error && _.value && _.value.rev).map((_) => ({ _id: _.id, _rev: _.value.rev, _deleted: !0 }));
      return u.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(ht(m.url, m.db, "_bulk_docs"), {
        method: "POST",
        headers: p(m, i),
        credentials: m.credentials,
        body: JSON.stringify({ docs: u })
      }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const E = f(_);
        return { response: { ok: !0, results: E.content, deletedCount: u.length }, message: E.message };
      });
    });
  }
  o.prototype.bulkDelete = function(m, b) {
    return d(this, m, b).then((i) => i.response);
  };
  function y(m) {
    m._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        m.fetchDelta(r.since).then(function(h) {
          L(m.dom, "ln-couchdb-connector:fetched", { data: h, since: r.since, meta: r.meta || null });
        }).catch(function(h) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: h.message,
            status: h.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(i) {
        const r = i.detail || {};
        s(m, r.data, r.idempotencyKey).then(function(h) {
          L(m.dom, "ln-couchdb-connector:created", { record: h.record, tempId: r.tempId, message: h.message, meta: r.meta || null });
        }).catch(function(h) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: h.message,
            status: h.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(i) {
        const r = i.detail || {}, h = Object.assign({}, r.data);
        r.expected_version !== void 0 && (h._rev = r.expected_version), n(m, r.id, h, r.idempotencyKey).then(function(u) {
          L(m.dom, "ln-couchdb-connector:updated", { record: u.record, id: r.id, message: u.message, meta: r.meta || null });
        }).catch(function(u) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            id: r.id,
            data: u.status === 409 ? u.data : null,
            conflictData: u.status === 409 ? u.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(i) {
        const r = i.detail || {};
        c(m, r.id, r.rev, r.idempotencyKey).then(function(h) {
          L(m.dom, "ln-couchdb-connector:deleted", { response: h.response, id: r.id, message: h.message, meta: r.meta || null });
        }).catch(function(h) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: h.message,
            status: h.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const r = i.detail || {};
        d(m, r.ids, r.idempotencyKey).then(function(h) {
          L(m.dom, "ln-couchdb-connector:bulk-deleted", { response: h.response, ids: r.ids, message: h.message, meta: r.meta || null });
        }).catch(function(h) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: h.message,
            status: h.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      m.dom.addEventListener(i + ":request-sync", m._handlers.sync), m.dom.addEventListener(i + ":request-fetch", m._handlers.sync), m.dom.addEventListener(i + ":request-create", m._handlers.create), m.dom.addEventListener(i + ":request-update", m._handlers.update), m.dom.addEventListener(i + ":request-delete", m._handlers.delete), m.dom.addEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    });
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const m = this;
    m._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      m.dom.removeEventListener(i + ":request-sync", m._handlers.sync), m.dom.removeEventListener(i + ":request-fetch", m._handlers.sync), m.dom.removeEventListener(i + ":request-create", m._handlers.create), m.dom.removeEventListener(i + ":request-update", m._handlers.update), m.dom.removeEventListener(i + ":request-delete", m._handlers.delete), m.dom.removeEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    }), m._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[l];
  };
  function g(m) {
    const b = m[e];
    b && b.refreshConfig();
  }
  U(t, e, o, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: g
  });
})();
function ir(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function xt(t, e) {
  const l = !t || !!t.initializationError, f = !!(t && t.noLocalQuery && !t.windowed);
  return e && (l || !t.canServe || f) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Ut(t, e, l) {
  return l === "store" && !!e && !(t && t.windowed);
}
function ze(t, e) {
  const l = Object.assign({}, t);
  return e && (l.filters = e.filters, l.search = e.search, l.sort = e.sort), l;
}
class rr {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((l, f) => {
      this._pending.set(e, { resolve: l, reject: f });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const l = e || new Error("Mutation receipt registry closed");
    for (const f of this._pending.values()) f.reject(l);
    this._pending.clear();
  }
  _settle(e, l) {
    const f = e && e.requestId;
    if (!f) return !1;
    const o = this._pending.get(f);
    return o ? (this._pending.delete(f), l ? o.reject(e.error || new Error("Store mutation failed")) : o.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", l = "data-ln-data-coordinator-scope", f = "data-ln-data-coordinator-search", o = "data-ln-data-coordinator-filters", p = "data-ln-data-coordinator-sort-field", s = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new Set();
  let c = !1, d = null, y = null, g = null;
  function m() {
    c || (c = !0, d = function() {
      L(document, "ln-data-coordinator:online", {}), n.forEach(function(a) {
        a._maybeSync();
      });
    }, y = function() {
      L(document, "ln-data-coordinator:offline", {});
    }, g = function() {
      document.visibilityState === "visible" && n.forEach(function(a) {
        const v = a.findChildren(), w = v.store;
        w && v.connector && w.isInitialized && !w.initializationError && !w.isSyncing && !a._noAutosync && (!w.hasCache || a._isStale()) && w.forceSync();
      });
    }, window.addEventListener("online", d), window.addEventListener("offline", y), document.addEventListener("visibilitychange", g));
  }
  function b() {
    c && (n.size > 0 || (window.removeEventListener("online", d), window.removeEventListener("offline", y), document.removeEventListener("visibilitychange", g), d = null, y = null, g = null, c = !1));
  }
  function i() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (v) => {
        const w = Math.random() * 16 | 0;
        return (v === "x" ? w : w & 3 | 8).toString(16);
      });
    }
  }
  const r = ["ln-api-connector", "ln-couchdb-connector"];
  function h(a) {
    return a ? a.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : a.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function u(a) {
    const v = this;
    return this.dom = a, this._name = a.getAttribute("data-ln-data-coordinator") || a.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", a), a[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new rr(), this._dict = $t(a, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = Xt(function() {
      v._destroyed || v._refreshAll(null, !0);
    }), this.refreshConfig(), _(this), n.add(this), m(), this._checkInitialSync(), this;
  }
  Object.defineProperty(u.prototype, "_staleThreshold", {
    get: function() {
      const v = this.findChildren().storeEl, w = this.dom.getAttribute("data-ln-data-coordinator-stale") || (v ? v.getAttribute("data-ln-data-store-stale") : null);
      if (w === "never" || w === "-1") return -1;
      const A = parseInt(w, 10);
      return isNaN(A) ? 300 : A;
    }
  }), Object.defineProperty(u.prototype, "_noAutosync", {
    get: function() {
      const v = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (v ? v.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), u.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, u.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const v = this.findChildren().store;
    return !v || !v.lastSyncedAt ? !0 : Date.now() / 1e3 - v.lastSyncedAt > this._staleThreshold;
  }, u.prototype._maybeSync = function() {
    const a = this.findChildren(), v = a.store;
    !v || v.initializationError || !a.connector || this._noAutosync || !v.isInitialized || v.isSyncing || (!v.hasCache || this._isStale()) && v.forceSync();
  }, u.prototype._checkInitialSync = function() {
    const a = this, w = this.findChildren().store;
    w && Promise.resolve(w.ready).then(function() {
      if (a._destroyed) return;
      const A = a.findChildren(), C = A.store;
      if (C && C.initializationError) {
        a._reportReconciliationError("store-initialize", C.initializationError, null);
        return;
      }
      !C || !A.connector || a._noAutosync || C.isSyncing || (!C.hasCache || a._isStale()) && C.forceSync();
    }).catch(function(A) {
      a._destroyed || a._reportReconciliationError("store-initialize", A, null);
    });
  }, u.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const v = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    v && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(v)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(w) {
      return w;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(w) {
      return w;
    });
  }, u.prototype.findChildren = function() {
    const a = this.dom.querySelector("[data-ln-data-store]"), v = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), w = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: a,
      connectorEl: v,
      queueEl: w,
      store: a ? a.lnDataStore : null,
      connector: v ? v.lnApiConnector || v.lnCouchDbConnector : null,
      queue: w ? w.lnApiQueue : null
    };
  }, u.prototype._handleSubmitRecord = function(a) {
    const v = this.findChildren();
    if (!v.storeEl && !v.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const w = a.data || {}, A = w.id, C = w.expected_version, T = Object.assign({}, w);
    delete T.id, delete T.expected_version;
    const x = a.method.toUpperCase();
    x === "POST" ? this._fanOutCreate(v, T, a.action) : (x === "PUT" || x === "PATCH") && this._fanOutUpdate(v, A, T, C, a.action);
  }, u.prototype._fanOutCreate = function(a, v, w) {
    this.refreshMapper();
    const A = "_temp_" + i();
    a.storeEl && L(a.storeEl, "ln-data-store:request-create", { tempId: A, data: v }), a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: A,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(v),
      expectedVersion: null,
      meta: { tempId: A, action: w }
    }) : a.connector && L(a.connectorEl, h(a.connectorEl) + ":request-create", {
      data: this.mapper.egress(v),
      url: w,
      meta: { entryId: i(), queued: !1, op: "create", tempId: A }
    });
  }, u.prototype._fanOutUpdate = function(a, v, w, A, C) {
    this.refreshMapper(), a.storeEl && L(a.storeEl, "ln-data-store:request-update", { id: v, data: w }), a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: v,
      op: "update",
      targetId: v,
      payload: this.mapper.egress(w),
      expectedVersion: A,
      meta: { id: v, action: C }
    }) : a.connector && L(a.connectorEl, h(a.connectorEl) + ":request-update", {
      id: v,
      data: this.mapper.egress(w),
      expected_version: A,
      url: C,
      meta: { entryId: i(), queued: !1, op: "update", id: v }
    });
  }, u.prototype._fanOutDelete = function(a, v) {
    this.refreshMapper(), a.storeEl && L(a.storeEl, "ln-data-store:request-delete", { id: v }), a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: v,
      op: "delete",
      targetId: v,
      payload: null,
      expectedVersion: null,
      meta: { id: v }
    }) : a.connector && L(a.connectorEl, h(a.connectorEl) + ":request-delete", {
      id: v,
      meta: { entryId: i(), queued: !1, op: "delete", id: v }
    });
  }, u.prototype._fanOutBulkDelete = function(a, v) {
    this.refreshMapper();
    const w = v.join(",");
    a.storeEl && L(a.storeEl, "ln-data-store:request-bulk-delete", { ids: v }), a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: w,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: v },
      expectedVersion: null,
      meta: { bulkKey: w, ids: v }
    }) : a.connector && L(a.connectorEl, h(a.connectorEl) + ":request-bulk-delete", {
      ids: v,
      meta: { entryId: i(), queued: !1, op: "bulk-delete", bulkKey: w }
    });
  }, u.prototype._toastFromMessage = function(a) {
    a && L(window, "ln-toast:enqueue", {
      type: a.type || "success",
      title: a.title || "",
      message: a.body || ""
    });
  }, u.prototype._toastFromDict = function(a) {
    const v = this._dict[a];
    v && L(window, "ln-toast:enqueue", { type: "error", title: "", message: v });
  }, u.prototype._requestStoreMutation = function(a, v, w) {
    const A = a.storeEl;
    if (!A) return Promise.reject(new Error("Store element not found"));
    const C = i(), T = this._mutationReceipts.wait(C);
    return L(A, "ln-data-store:request-" + v, Object.assign({}, w, { requestId: C })), T;
  }, u.prototype._reportReconciliationError = function(a, v, w) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", {
      operation: a,
      error: v,
      meta: w || null
    });
  };
  function _(a) {
    a._handlers = {
      sync: function(v) {
        a.refreshMapper();
        const w = a.findChildren();
        if (!w.store || !w.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(w.connectorEl, h(w.connectorEl) + ":request-sync", { since: v.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(v) {
        const w = a.findChildren();
        if (!w.connectorEl) return;
        const A = v.detail || {};
        L(w.connectorEl, h(w.connectorEl) + ":request-query", {
          query: Object.assign({}, A.query, {
            offset: A.offset,
            limit: A.limit,
            queryGen: A.queryGen
          })
        });
      },
      reqCreate: function(v) {
        const w = a.findChildren();
        a._fanOutCreate(w, v.detail.data || {}, v.detail.action);
      },
      reqUpdate: function(v) {
        const w = a.findChildren();
        a._fanOutUpdate(w, v.detail.id, v.detail.data || {}, v.detail.expected_version, v.detail.action);
      },
      reqDelete: function(v) {
        const w = a.findChildren();
        a._fanOutDelete(w, v.detail.id);
      },
      reqBulkDelete: function(v) {
        const w = a.findChildren();
        a._fanOutBulkDelete(w, v.detail.ids || []);
      },
      queueFailed: function() {
        a._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(v) {
        a.refreshMapper();
        const w = a.findChildren();
        if (!w.store || !w.connector || !w.queue) return;
        const A = v.detail || {}, C = A.entryId, T = A.op, x = A.targetId, D = A.payload, R = A.expectedVersion, M = A.meta || {}, P = M.action || null, N = A.idempotencyKey || C;
        T === "create" ? L(w.connectorEl, h(w.connectorEl) + ":request-create", {
          data: D,
          url: P,
          idempotencyKey: N,
          meta: { entryId: C, queued: !0, op: "create", tempId: M.tempId }
        }) : T === "update" ? L(w.connectorEl, h(w.connectorEl) + ":request-update", {
          id: x,
          data: D,
          expected_version: R,
          url: P,
          idempotencyKey: N,
          meta: { entryId: C, queued: !0, op: "update", id: x }
        }) : T === "delete" ? L(w.connectorEl, h(w.connectorEl) + ":request-delete", {
          id: x,
          idempotencyKey: N,
          meta: { entryId: C, queued: !0, op: "delete", id: x }
        }) : T === "bulk-delete" ? L(w.connectorEl, h(w.connectorEl) + ":request-bulk-delete", {
          ids: D && D.ids ? D.ids : [],
          idempotencyKey: N,
          meta: { entryId: C, queued: !0, op: "bulk-delete", bulkKey: M.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", T);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(v) {
        const w = v.target;
        if (v.defaultPrevented) return;
        const A = w.hasAttribute(l) ? w.getAttribute(l) : null;
        if (A === null) return;
        let C;
        if (A ? C = a._owns(A) : C = w.closest("[data-ln-data-coordinator]") === a.dom, !C) return;
        const T = $n(w);
        if (T !== "POST" && T !== "PUT" && T !== "PATCH") return;
        v.preventDefault();
        const x = Ye(w);
        delete x._method, delete x._token, a._handleSubmitRecord({ data: x, method: T, action: w.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(v) {
        const w = v.detail.meta || {}, A = a.findChildren();
        a.refreshMapper();
        const C = v.detail.data;
        let T = [], x = [], D = null;
        Array.isArray(C) ? (T = C, D = Math.floor(Date.now() / 1e3)) : C && (T = Array.isArray(C.data) ? C.data : [], x = Array.isArray(C.deleted) ? C.deleted : [], D = C.synced_at !== void 0 ? C.synced_at : C.since !== void 0 ? C.since : null);
        const R = T.map((M) => a.mapper.ingress(M));
        if (A.store && !A.store.initializationError)
          w.kind ? w.kind === "table" || w.kind === "list" || w.kind === "chart" ? A.store.applyQuery(R, { total: v.detail.total }).then(function(M) {
            w.queryGen != null && !a._isCurrentGen(w.targetEl, w.queryGen) || (L(w.targetEl, "ln-" + w.kind + ":set-loading", { loading: !1 }), L(w.targetEl, "ln-" + w.kind + ":set-data", {
              data: M,
              total: v.detail.total !== void 0 ? v.detail.total : M.length,
              filtered: v.detail.filtered !== void 0 ? v.detail.filtered : M.length,
              offset: v.detail.offset,
              queryGen: v.detail.queryGen
            }), a._boundDelivered.set(w.targetEl, !0));
          }) : w.kind === "options" ? A.store.applyQuery(R, { total: v.detail.total }).then(function() {
            return A.store.getAll({});
          }).then(function(M) {
            w.queryGen != null && !a._isCurrentGen(w.targetEl, w.queryGen) || L(w.targetEl, "ln-options:set-data", { data: M.data });
          }) : w.kind === "stat" && A.store.applyQuery(R, { total: v.detail.total }).then(function() {
            if (w.queryGen != null && !a._isCurrentGen(w.targetEl, w.queryGen)) return;
            const M = v.detail.filtered !== void 0 ? v.detail.filtered : v.detail.total !== void 0 ? v.detail.total : R.length;
            L(w.targetEl, "ln-stat:set-count", { count: M });
          }) : A.store.applySync(R, x, D || Math.floor(Date.now() / 1e3), {
            total: v.detail.total,
            filtered: v.detail.filtered,
            offset: v.detail.offset,
            queryGen: v.detail.queryGen,
            targetEl: w.targetEl
          });
        else if (w.targetEl && w.kind) {
          if (w.kind === "table" || w.kind === "list" || w.kind === "chart")
            L(w.targetEl, "ln-" + w.kind + ":set-loading", { loading: !1 }), L(w.targetEl, "ln-" + w.kind + ":set-data", {
              data: R,
              total: v.detail.total !== void 0 ? v.detail.total : R.length,
              filtered: v.detail.filtered !== void 0 ? v.detail.filtered : R.length,
              offset: v.detail.offset,
              queryGen: v.detail.queryGen
            }), a._boundDelivered.set(w.targetEl, !0);
          else if (w.kind === "options")
            L(w.targetEl, "ln-options:set-data", { data: R });
          else if (w.kind === "stat") {
            const M = v.detail.filtered !== void 0 ? v.detail.filtered : v.detail.total !== void 0 ? v.detail.total : R.length;
            L(w.targetEl, "ln-stat:set-count", { count: M });
          }
        }
      },
      connCreated: function(v) {
        const w = a.findChildren(), A = v.detail.meta || {}, C = a.mapper.ingress(v.detail.record);
        (w.storeEl ? a._requestStoreMutation(w, "update", { id: A.tempId, data: C }) : Promise.resolve()).then(function() {
          a._toastFromMessage(v.detail.message), A.queued && w.queue && L(w.queueEl, "ln-api-queue:resolve-create", {
            entryId: A.entryId,
            oldKey: A.tempId,
            newId: C.id
          });
        }).catch(function(x) {
          a._reportReconciliationError("create-reconcile", x, A);
        });
      },
      connUpdated: function(v) {
        const w = a.findChildren(), A = v.detail.meta || {}, C = a.mapper.ingress(v.detail.record);
        (w.storeEl ? a._requestStoreMutation(w, "update", { id: A.id, data: C }) : Promise.resolve()).then(function() {
          a._toastFromMessage(v.detail.message), A.queued && w.queue && L(w.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
        }).catch(function(x) {
          a._reportReconciliationError("update-reconcile", x, A);
        });
      },
      connDeleted: function(v) {
        const w = a.findChildren(), A = v.detail.meta || {};
        a._toastFromMessage(v.detail.message), A.queued && w.queue && L(w.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
      },
      connBulkDeleted: function(v) {
        const w = a.findChildren(), A = v.detail.meta || {};
        a._toastFromMessage(v.detail.message), A.queued && w.queue && L(w.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
      },
      connError: function(v) {
        const w = v.detail || {}, A = w.meta || {}, C = A.op || w.action, T = w.status || w.error && w.error.status || 0, x = a.findChildren();
        if (C === "sync") {
          x.storeEl && L(x.storeEl, "ln-data-store:request-sync-failed", {
            error: w.error,
            status: T
          }), console.error("[ln-data-coordinator] Sync failed:", w.error);
          return;
        }
        if (C === "query") {
          A.targetEl && A.kind && (L(A.targetEl, "ln-" + A.kind + ":set-loading", { loading: !1 }), (A.kind === "table" || A.kind === "list") && L(A.targetEl, "ln-" + A.kind + ":page-failed", { offset: A.offset })), a._reportReconciliationError("query", w.error || w, A);
          return;
        }
        const D = T === 401 || T === 419, R = T === 0 || T >= 500, M = T === 409 || T === 412;
        if (D) {
          a._toastFromDict("auth"), A.queued && x.queue && L(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "auth" });
          return;
        }
        if (R) {
          A.queued && x.queue ? L(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "retry" }) : a._toastFromDict("network");
          return;
        }
        let P = Promise.resolve();
        if (M && C === "update") {
          const N = w.data && w.data.remote ? a.mapper.ingress(w.data.remote) : null;
          N && x.storeEl && (P = a._requestStoreMutation(x, "update", { id: A.id, data: N })), a._toastFromDict("conflict");
        } else C === "create" && x.storeEl && (P = a._requestStoreMutation(x, "delete", { id: A.tempId })), a._toastFromDict("rejected");
        A.queued && x.queue ? P.then(function() {
          L(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "drop" });
        }).catch(function(N) {
          a._reportReconciliationError("deterministic-reconcile", N, A);
        }) : P.catch(function(N) {
          a._reportReconciliationError("deterministic-reconcile", N, A);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(v) {
        const w = a.findChildren(), A = w.store;
        if (!A || A.initializationError || !w.connector || a._noAutosync || A.isSyncing) return;
        (v.detail || {}).hasCache ? a._isStale() && A.forceSync() : A.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(v) {
        a._serveData(v, "table");
      },
      reqListData: function(v) {
        a._serveData(v, "list");
      },
      reqChartData: function(v) {
        a._serveData(v, "chart");
      },
      reqOptions: function(v) {
        a._serveOptions(v);
      },
      reqStat: function(v) {
        a._serveStat(v);
      },
      refreshQuery: function() {
        a._refreshAll(null, !0);
      },
      refresh: function(v) {
        a._mutationReceipts.resolve(v.detail), a._refreshAll(null, !1);
      },
      mutationError: function(v) {
        a._mutationReceipts.reject(v.detail);
      },
      refreshSynced: function(v) {
        v.detail && v.detail.changed && a._refreshAll(v.detail.meta, !1);
      },
      searchChange: function(v) {
        v.preventDefault();
        const w = v.detail && v.detail.term != null ? v.detail.term : "";
        w !== (a.dom.getAttribute(f) || "") && a.dom.setAttribute(f, w);
      },
      filterChange: function(v) {
        v.preventDefault();
        const w = v.detail && v.detail.key;
        if (!w) return;
        const A = (v.detail.values || []).slice(), C = a._currentQuery().filters, T = C[w];
        if (T ? T.length === A.length && T.every((M, P) => M === A[P]) : !A.length) return;
        A.length ? C[w] = A : delete C[w];
        const D = new URLSearchParams();
        Object.keys(C).forEach(function(M) {
          C[M].forEach(function(P) {
            D.append(M, P);
          });
        });
        const R = D.toString();
        R ? a.dom.setAttribute(o, R) : a.dom.removeAttribute(o);
      },
      sortChange: function(v) {
        v.preventDefault();
        const w = v.detail && v.detail.field, A = v.detail && v.detail.direction, C = w && A && A !== "none" ? { field: w, direction: A } : null, T = a._currentQuery().sort;
        !T && !C || T && C && T.field === C.field && T.direction === C.direction || (C ? (a.dom.setAttribute(p, C.field), a.dom.setAttribute(s, C.direction)) : (a.dom.removeAttribute(p), a.dom.removeAttribute(s)));
      }
    }, a.dom.addEventListener("ln-data-store:request-remote-sync", a._handlers.sync), a.dom.addEventListener("ln-data-store:request-page", a._handlers.requestPage), a.dom.addEventListener("ln-data-coordinator:request-create", a._handlers.reqCreate), a.dom.addEventListener("ln-data-coordinator:request-update", a._handlers.reqUpdate), a.dom.addEventListener("ln-data-coordinator:request-delete", a._handlers.reqDelete), a.dom.addEventListener("ln-data-coordinator:request-bulk-delete", a._handlers.reqBulkDelete), a.dom.addEventListener("ln-api-queue:send", a._handlers.queueSend), a.dom.addEventListener("ln-api-queue:failed", a._handlers.queueFailed), a.dom.addEventListener("ln-data-store:initialized", a._handlers.storeInitialized), document.addEventListener("submit", a._handlers.formSubmit), r.forEach(function(v) {
      a.dom.addEventListener(v + ":fetched", a._handlers.connFetched), a.dom.addEventListener(v + ":created", a._handlers.connCreated), a.dom.addEventListener(v + ":updated", a._handlers.connUpdated), a.dom.addEventListener(v + ":deleted", a._handlers.connDeleted), a.dom.addEventListener(v + ":bulk-deleted", a._handlers.connBulkDeleted), a.dom.addEventListener(v + ":error", a._handlers.connError);
    }), document.addEventListener("ln-table:request-data", a._handlers.reqTableData), document.addEventListener("ln-list:request-data", a._handlers.reqListData), document.addEventListener("ln-chart:request-data", a._handlers.reqChartData), document.addEventListener("ln-options:request-data", a._handlers.reqOptions), document.addEventListener("ln-stat:request-count", a._handlers.reqStat), a.dom.addEventListener("ln-data-store:ready", a._handlers.refresh), a.dom.addEventListener("ln-data-store:created", a._handlers.refresh), a.dom.addEventListener("ln-data-store:updated", a._handlers.refresh), a.dom.addEventListener("ln-data-store:deleted", a._handlers.refresh), a.dom.addEventListener("ln-data-store:mutation-error", a._handlers.mutationError), a.dom.addEventListener("ln-data-store:synced", a._handlers.refreshSynced), a.dom.addEventListener("ln-data-store:query-changed", a._handlers.refreshQuery), a.dom.addEventListener("ln-search:change", a._handlers.searchChange), a.dom.addEventListener("ln-filter:change", a._handlers.filterChange), a.dom.addEventListener("ln-sort:change", a._handlers.sortChange);
  }
  u.prototype._owns = function(a) {
    return !!a && a === this._name;
  }, u.prototype._currentQuery = function() {
    const a = this.dom.getAttribute(p), v = this.dom.getAttribute(s), w = new URLSearchParams(this.dom.getAttribute(o) || ""), A = {};
    for (const C of new Set(w.keys())) A[C] = w.getAll(C);
    return {
      search: this.dom.getAttribute(f) || "",
      filters: A,
      sort: a && v ? { field: a, direction: v } : null
    };
  }, u.prototype._nextQueryGen = function(a) {
    const v = (this._queryGens.get(a) || 0) + 1;
    return this._queryGens.set(a, v), v;
  }, u.prototype._isCurrentGen = function(a, v) {
    return this._queryGens.get(a) === v;
  }, u.prototype._serveData = function(a, v) {
    const w = a.target, A = v === "table" ? "data-ln-table-source" : v === "list" ? "data-ln-list-source" : "data-ln-chart-source", C = w.getAttribute(A);
    if (!C || !this._owns(C)) return;
    const T = a.detail || {}, x = ir(T);
    this._boundQueries.set(w, x);
    const D = this.findChildren(), R = this, M = D.store;
    return (M && M.ready ? M.ready : Promise.resolve()).then(function() {
      if (R._destroyed) return;
      const N = xt(M, D.connector), B = ze(x, R._currentQuery());
      if (N === "remote") {
        L(w, "ln-" + v + ":set-loading", { loading: !0 }), L(D.connectorEl, h(D.connectorEl) + ":request-query", {
          query: B,
          meta: { targetEl: w, kind: v, offset: B.offset, limit: B.limit }
        });
        return;
      }
      if (N !== "store") {
        L(w, "ln-" + v + ":set-loading", { loading: !1 });
        return;
      }
      const H = Ut(M, D.connector, N), z = H ? R._nextQueryGen(w) : null;
      return H && L(D.connectorEl, h(D.connectorEl) + ":request-query", {
        query: B,
        meta: { targetEl: w, kind: v, offset: B.offset, limit: B.limit, queryGen: z }
      }), M.getAll(B).then(function(Q) {
        if (R._destroyed || !R._boundDelivered || H && !R._isCurrentGen(w, z)) return;
        const St = {
          data: Q.data,
          total: Q.total,
          filtered: Q.filtered,
          offset: T.offset !== void 0 ? T.offset : Q.offset,
          queryGen: T.queryGen !== void 0 ? T.queryGen : Q.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: H || Q.provisional === !0
        };
        L(w, "ln-" + v + ":set-data", St), R._boundDelivered.set(w, !0);
      });
    }).catch(function(N) {
      R._destroyed || (L(w, "ln-" + v + ":set-loading", { loading: !1 }), L(R.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: v,
        store: C,
        target: w,
        error: N
      }));
    });
  }, u.prototype._serveOptions = function(a) {
    const v = a.target, w = v.getAttribute("data-ln-options");
    if (!this._owns(w)) return;
    const A = this.findChildren(), C = A.store, T = C && C.ready ? C.ready : Promise.resolve(), x = this;
    return T.then(function() {
      if (x._destroyed) return;
      const D = xt(C, A.connector);
      if (D === "remote") {
        L(A.connectorEl, h(A.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: v, kind: "options" }
        });
        return;
      }
      if (D !== "store") return;
      const R = Ut(C, A.connector, D), M = R ? x._nextQueryGen(v) : null;
      return R && L(A.connectorEl, h(A.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: v, kind: "options", queryGen: M }
      }), C.getAll({}).then(function(P) {
        x._destroyed || R && !x._isCurrentGen(v, M) || L(v, "ln-options:set-data", { data: P.data });
      });
    }).catch(function(D) {
      x._destroyed || x._reportReconciliationError("options-query", D, { targetEl: v, kind: "options" });
    });
  }, u.prototype._serveStat = function(a) {
    const v = a.target, w = v.getAttribute("data-ln-stat");
    if (!this._owns(w)) return;
    const A = a.detail && a.detail.filters ? a.detail.filters : null, C = this.findChildren(), T = C.store, x = T && T.ready ? T.ready : Promise.resolve(), D = this;
    return x.then(function() {
      if (D._destroyed) return;
      const R = A && Object.keys(A).length > 0, M = !!(C.connector && T && (T.windowed && R || T.noLocalQuery)), P = M ? "remote" : xt(T, C.connector);
      if (P === "remote") {
        L(C.connectorEl, h(C.connectorEl) + ":request-query", {
          query: { filters: A },
          meta: { targetEl: v, kind: "stat" }
        });
        return;
      }
      if (P !== "store") return;
      const N = !M && Ut(T, C.connector, P), B = N ? D._nextQueryGen(v) : null;
      return N && L(C.connectorEl, h(C.connectorEl) + ":request-query", {
        query: { filters: A },
        meta: { targetEl: v, kind: "stat", queryGen: B }
      }), T.count(A).then(function(H) {
        D._destroyed || N && !D._isCurrentGen(v, B) || L(v, "ln-stat:set-count", { count: H });
      });
    }).catch(function(R) {
      D._destroyed || D._reportReconciliationError("stat-query", R, { targetEl: v, kind: "stat" });
    });
  }, u.prototype._refreshAll = function(a, v) {
    const w = this, A = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let C = 0; C < A.length; C++) {
      const T = A[C];
      let x, D;
      if (T.hasAttribute("data-ln-table-source") ? (x = T.getAttribute("data-ln-table-source"), D = "table") : T.hasAttribute("data-ln-list-source") ? (x = T.getAttribute("data-ln-list-source"), D = "list") : T.hasAttribute("data-ln-chart-source") ? (x = T.getAttribute("data-ln-chart-source"), D = "chart") : T.hasAttribute("data-ln-options") ? (x = T.getAttribute("data-ln-options"), D = "options") : T.hasAttribute("data-ln-stat") && (x = T.getAttribute("data-ln-stat"), D = "stat"), !w._owns(x)) continue;
      const R = w.findChildren(), M = R.store;
      if (D === "table" || D === "list") {
        const P = D === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (T.hasAttribute(P)) {
          L(T, "ln-" + D + (v ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (D === "table" || D === "list" || D === "chart") {
        const P = w._boundQueries.get(T) || { sort: null, filters: {}, search: "" }, N = ze(P, w._currentQuery());
        if (xt(M, R.connector) === "remote") {
          L(T, "ln-" + D + ":set-loading", { loading: !0 }), L(R.connectorEl, h(R.connectorEl) + ":request-query", {
            query: N,
            meta: { targetEl: T, kind: D, offset: N.offset, limit: N.limit }
          });
          continue;
        }
        const B = Ut(M, R.connector, xt(M, R.connector)), H = B ? w._nextQueryGen(T) : null;
        B && L(R.connectorEl, h(R.connectorEl) + ":request-query", {
          query: N,
          meta: { targetEl: T, kind: D, offset: N.offset, limit: N.limit, queryGen: H }
        }), (function(z, Q, St, Zt) {
          M.getAll(N).then(function(lt) {
            if (w._destroyed || !w._boundDelivered || St && !w._isCurrentGen(z, Zt)) return;
            const Ft = {
              data: lt.data,
              total: a && a.total !== void 0 ? a.total : lt.total,
              filtered: a && a.filtered !== void 0 ? a.filtered : lt.filtered,
              offset: lt.offset !== void 0 ? lt.offset : a && a.offset !== void 0 ? a.offset : P.offset,
              queryGen: lt.queryGen !== void 0 ? lt.queryGen : a && a.queryGen !== void 0 ? a.queryGen : P.queryGen
            };
            L(z, "ln-" + Q + ":set-loading", { loading: !1 }), L(z, "ln-" + Q + ":set-data", Ft), w._boundDelivered.set(z, !0);
          }).catch(function() {
          });
        })(T, D, B, H);
      } else if (D === "options")
        (function(P) {
          M.getAll({}).then(function(N) {
            w._destroyed || L(P, "ln-options:set-data", { data: N.data });
          }).catch(function() {
          });
        })(T);
      else if (D === "stat") {
        const P = T.getAttribute("data-ln-stat-filter");
        let N = null;
        if (P) {
          const B = P.indexOf(":");
          if (B !== -1) {
            const H = P.slice(0, B).trim(), z = P.slice(B + 1).trim();
            H && (N = {}, N[H] = [z]);
          }
        }
        (function(B, H) {
          M.count(H).then(function(z) {
            w._destroyed || L(B, "ln-stat:set-count", { count: z });
          }).catch(function() {
          });
        })(T, N);
      }
    }
  }, u.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const a = this;
    a._handlers && (a.dom.removeEventListener("ln-data-store:request-remote-sync", a._handlers.sync), a.dom.removeEventListener("ln-data-store:request-page", a._handlers.requestPage), a.dom.removeEventListener("ln-data-coordinator:request-create", a._handlers.reqCreate), a.dom.removeEventListener("ln-data-coordinator:request-update", a._handlers.reqUpdate), a.dom.removeEventListener("ln-data-coordinator:request-delete", a._handlers.reqDelete), a.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", a._handlers.reqBulkDelete), a.dom.removeEventListener("ln-api-queue:send", a._handlers.queueSend), a.dom.removeEventListener("ln-api-queue:failed", a._handlers.queueFailed), a.dom.removeEventListener("ln-data-store:initialized", a._handlers.storeInitialized), document.removeEventListener("submit", a._handlers.formSubmit), r.forEach(function(v) {
      a.dom.removeEventListener(v + ":fetched", a._handlers.connFetched), a.dom.removeEventListener(v + ":created", a._handlers.connCreated), a.dom.removeEventListener(v + ":updated", a._handlers.connUpdated), a.dom.removeEventListener(v + ":deleted", a._handlers.connDeleted), a.dom.removeEventListener(v + ":bulk-deleted", a._handlers.connBulkDeleted), a.dom.removeEventListener(v + ":error", a._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", a._handlers.reqTableData), document.removeEventListener("ln-list:request-data", a._handlers.reqListData), document.removeEventListener("ln-chart:request-data", a._handlers.reqChartData), document.removeEventListener("ln-options:request-data", a._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", a._handlers.reqStat), a.dom.removeEventListener("ln-data-store:ready", a._handlers.refresh), a.dom.removeEventListener("ln-data-store:created", a._handlers.refresh), a.dom.removeEventListener("ln-data-store:updated", a._handlers.refresh), a.dom.removeEventListener("ln-data-store:deleted", a._handlers.refresh), a.dom.removeEventListener("ln-data-store:mutation-error", a._handlers.mutationError), a.dom.removeEventListener("ln-data-store:synced", a._handlers.refreshSynced), a.dom.removeEventListener("ln-data-store:query-changed", a._handlers.refreshQuery), a.dom.removeEventListener("ln-search:change", a._handlers.searchChange), a.dom.removeEventListener("ln-filter:change", a._handlers.filterChange), a.dom.removeEventListener("ln-sort:change", a._handlers.sortChange), a._handlers = null), a._boundQueries = null, a._boundDelivered = null, a._queryGens = null, a._queueQueryRefresh = null, a._mutationReceipts.close(new Error("Data coordinator destroyed")), a._mutationReceipts = null, n.delete(this), b(), delete this.dom[e];
  };
  function E(a, v) {
    const w = a[e];
    if (w) {
      if (v === "data-ln-data-coordinator-mapper") {
        w.refreshMapper();
        return;
      }
      (v === f || v === o || v === p || v === s) && w._queueQueryRefresh();
    }
  }
  U(t, e, u, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-coordinator-mapper",
      f,
      o,
      p,
      s
    ],
    onAttributeChange: E
  });
})();
const or = "ln_api_queue", sr = 2, Y = "outbox", tt = "_queue_meta";
function it(t, e) {
  return t.error || new Error(e);
}
function vt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function Ke(t) {
  return "seq:" + t;
}
function zt(t) {
  return "paused:" + t;
}
function je(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function ar(t, e, l) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(l);
}
function lr(t, e, l, f) {
  const o = /* @__PURE__ */ new Map(), p = [], s = [];
  for (const n of t || [])
    o.has(n.chainKey) || o.set(n.chainKey, []), o.get(n.chainKey).push(n);
  return o.forEach((n, c) => {
    n.sort((y, g) => y.seq - g.seq);
    const d = n[0];
    if (!(!d || d.status === "failed")) {
      if (d.status === "inflight" && (d.leaseUntil || 0) > f) {
        s.push({ chainKey: c, at: d.leaseUntil });
        return;
      }
      if ((d.nextAttemptAt || 0) > f) {
        s.push({ chainKey: c, at: d.nextAttemptAt });
        return;
      }
      d.status = "inflight", d.leaseOwner = e, d.leaseUntil = f + l, d.updatedAt = f, p.push(d);
    }
  }), { entries: p, wakeups: s };
}
function cr(t, e, l, f, o) {
  const p = [], s = [];
  for (const n of t || []) {
    if (n.entryId === e) {
      s.push(n.entryId);
      continue;
    }
    n.chainKey === l && (n.chainKey = f, n.targetId === l && (n.targetId = f), n.meta && n.meta.id === l && (n.meta.id = f), n.meta && typeof n.meta.action == "string" && (n.meta.action = ar(n.meta.action, l, f)), n.updatedAt = o, p.push(n));
  }
  return { changed: p, deleted: s };
}
class dr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || or, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, l) => {
      const f = this.indexedDB.open(this.dbName, sr);
      f.onupgradeneeded = (o) => {
        const p = o.target.result;
        let s;
        p.objectStoreNames.contains(Y) ? s = o.target.transaction.objectStore(Y) : s = p.createObjectStore(Y, { keyPath: "entryId" }), s.indexNames.contains("by_scope_chain") || s.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), s.indexNames.contains("by_scope_seq") || s.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(tt) || p.createObjectStore(tt, { keyPath: "key" });
      }, f.onerror = () => l(it(f, "Queue database open failed")), f.onsuccess = (o) => {
        this._db = o.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, l) => {
      const f = this.indexedDB.deleteDatabase(this.dbName);
      f.onsuccess = () => e(), f.onerror = () => l(it(f, "Queue database delete failed")), f.onblocked = () => l(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((l) => l ? new Promise((f, o) => {
      const s = l.transaction(Y, "readonly").objectStore(Y).index("by_scope_seq").getAll(vt(this.keyRange, e));
      s.onsuccess = () => f(s.result || []), s.onerror = () => o(it(s, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, l) {
    return l = l || {}, this.open().then((f) => f ? new Promise((o, p) => {
      const s = f.transaction([tt, Y], "readwrite"), n = s.objectStore(tt), c = s.objectStore(Y), d = Ke(e);
      let y = null;
      const g = (b) => {
        const i = b + 1;
        y = {
          entryId: this.uuid(),
          scope: e,
          chainKey: l.chainKey,
          seq: i,
          op: l.op,
          targetId: l.targetId !== void 0 ? l.targetId : null,
          payload: l.payload,
          expectedVersion: l.expectedVersion !== void 0 ? l.expectedVersion : null,
          meta: l.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, n.put({ key: d, value: i }), c.put(y);
      }, m = n.get(d);
      m.onerror = () => p(it(m, "Queue sequence read failed")), m.onsuccess = () => {
        const b = m.result;
        if (b && typeof b.value == "number") {
          g(b.value);
          return;
        }
        const i = c.index("by_scope_seq").getAll(vt(this.keyRange, e));
        i.onerror = () => p(it(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const r = (i.result || []).reduce((h, u) => Math.max(h, u.seq || 0), 0);
          g(r);
        };
      }, s.oncomplete = () => o(y), s.onerror = () => p(s.error || new Error("Queue enqueue transaction failed")), s.onabort = () => p(s.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, l, f) {
    return this.open().then((o) => o ? new Promise((p, s) => {
      const n = o.transaction(Y, "readwrite"), c = n.objectStore(Y), d = c.index("by_scope_seq").getAll(vt(this.keyRange, e)), y = this.now();
      let g = { entries: [], wakeups: [] };
      d.onerror = () => s(it(d, "Queue claim read failed")), d.onsuccess = () => {
        g = lr(d.result || [], l, f, y);
        for (const m of g.entries) c.put(m);
      }, n.oncomplete = () => p(g), n.onerror = () => s(n.error || new Error("Queue claim transaction failed")), n.onabort = () => s(n.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, l) {
    return this._updateEntry(e, l, (f, o) => (o.delete(f.entryId), { status: "acked", entry: f }));
  }
  nack(e, l, f, o) {
    o = o || {};
    const p = o.maxAttempts || 8, s = o.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((n) => n ? new Promise((c, d) => {
      const y = n.transaction([Y, tt], "readwrite"), g = y.objectStore(Y), m = y.objectStore(tt), b = g.get(l);
      let i = null;
      b.onerror = () => d(it(b, "Queue nack read failed")), b.onsuccess = () => {
        const r = b.result;
        if (!(!r || r.scope !== e)) {
          if (f === "drop") {
            g.delete(r.entryId), i = { status: "dropped", entry: r };
            return;
          }
          if (je(r), r.updatedAt = this.now(), f === "auth") {
            r.status = "pending", g.put(r), m.put({ key: zt(e), value: "auth" }), i = { status: "auth", entry: r };
            return;
          }
          if (f === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= p) {
              r.status = "failed", r.nextAttemptAt = 0, g.put(r), i = { status: "failed", entry: r };
              return;
            }
            const h = s[Math.min(r.attempts - 1, s.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + h, g.put(r), i = { status: "retry", entry: r, delay: h };
          }
        }
      }, y.oncomplete = () => c(i), y.onerror = () => d(y.error || new Error("Queue nack transaction failed")), y.onabort = () => d(y.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, l, f) {
    return this._remapTransaction(e, null, l, f);
  }
  resolveCreate(e, l, f, o) {
    return this._remapTransaction(e, l, f, o);
  }
  _remapTransaction(e, l, f, o) {
    return this.open().then((p) => p ? new Promise((s, n) => {
      const c = p.transaction(Y, "readwrite"), d = c.objectStore(Y), y = d.index("by_scope_seq").getAll(vt(this.keyRange, e));
      let g = { changed: [], deleted: [] };
      y.onerror = () => n(it(y, "Queue remap read failed")), y.onsuccess = () => {
        g = cr(y.result || [], l, f, o, this.now());
        for (const m of g.deleted) d.delete(m);
        for (const m of g.changed) d.put(m);
      }, c.oncomplete = () => s(g.changed), c.onerror = () => n(c.error || new Error("Queue remap transaction failed")), c.onabort = () => n(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((l) => l ? new Promise((f, o) => {
      const p = l.transaction(Y, "readwrite"), s = p.objectStore(Y), n = s.index("by_scope_seq").getAll(vt(this.keyRange, e));
      let c = 0;
      n.onerror = () => o(it(n, "Queue failed-entry read failed")), n.onsuccess = () => {
        for (const d of n.result || [])
          d.status === "failed" && (d.status = "pending", d.attempts = 0, d.nextAttemptAt = 0, d.updatedAt = this.now(), je(d), s.put(d), c++);
      }, p.oncomplete = () => f(c), p.onerror = () => o(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => o(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((l) => l ? new Promise((f, o) => {
      const s = l.transaction(tt, "readonly").objectStore(tt).get(zt(e));
      s.onsuccess = () => {
        const n = s.result ? s.result.value : !1;
        f(n || !1);
      }, s.onerror = () => o(it(s, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, l) {
    return this.open().then((f) => {
      if (f)
        return new Promise((o, p) => {
          const s = f.transaction(tt, "readwrite"), n = typeof l == "string" ? l : l ? "manual" : !1;
          s.objectStore(tt).put({ key: zt(e), value: n }), s.oncomplete = () => o(), s.onerror = () => p(s.error || new Error("Queue pause-state write failed")), s.onabort = () => p(s.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((l) => {
      if (l)
        return new Promise((f, o) => {
          const p = l.transaction([Y, tt], "readwrite"), n = p.objectStore(Y).index("by_scope_seq").openCursor(vt(this.keyRange, e));
          n.onsuccess = (c) => {
            const d = c.target.result;
            d && (d.delete(), d.continue());
          }, n.onerror = () => o(it(n, "Queue clear failed")), p.objectStore(tt).delete(Ke(e)), p.objectStore(tt).delete(zt(e)), p.oncomplete = () => f(), p.onerror = () => o(p.error || new Error("Queue clear transaction failed")), p.onabort = () => o(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, l, f) {
    return this.open().then((o) => o ? new Promise((p, s) => {
      const n = o.transaction(Y, "readwrite"), c = n.objectStore(Y), d = c.get(l);
      let y = null;
      d.onerror = () => s(it(d, "Queue entry read failed")), d.onsuccess = () => {
        const g = d.result;
        !g || g.scope !== e || (y = f(g, c));
      }, n.oncomplete = () => p(y), n.onerror = () => s(n.error || new Error("Queue entry transaction failed")), n.onabort = () => s(n.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", l = [2e3, 5e3, 15e3, 6e4, 3e5], f = 8, o = 6e4;
  if (window[e] !== void 0) return;
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const g = Math.random() * 16 | 0;
        return (y === "x" ? g : g & 3 | 8).toString(16);
      });
    }
  }
  const s = new dr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: p
  });
  function n(d) {
    this.dom = d, d[e] = this;
    const y = d.closest("[data-ln-data-coordinator]");
    this.scope = d.id || (y ? y.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = p(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const g = this;
    return s.open().then((m) => m ? s.getPaused(g.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((m) => {
      if (g._paused = !!m, g._paused) {
        const b = typeof m == "string" ? m : "auth";
        L(g.dom, "ln-api-queue:paused", { reason: b, restored: !0 });
      }
      return g._emitPendingCount();
    }).then(() => g._drain()).catch((m) => {
      console.error("[ln-api-queue] Initialization failed:", m), L(g.dom, "ln-api-queue:error", { operation: "initialize", error: m });
    }), this;
  }
  n.prototype._isOnline = function() {
    const d = this.dom.getAttribute("data-ln-api-queue-online");
    return d === "true" ? !0 : d === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const d = this;
    return s.allForScope(d.scope).then((y) => (L(d.dom, "ln-api-queue:pending-count", { count: y.length, scope: d.scope }), y.length === 0 && L(d.dom, "ln-api-queue:drained", { scope: d.scope }), y));
  }, n.prototype._clearTimer = function(d) {
    const y = this._timers.get(d);
    y && (clearTimeout(y), this._timers.delete(d));
  }, n.prototype._scheduleTimer = function(d, y) {
    const g = Math.max(0, y), m = this._timers.get(d);
    m && clearTimeout(m);
    const b = this, i = setTimeout(() => {
      b._timers.delete(d), b._drain();
    }, g);
    this._timers.set(d, i);
  }, n.prototype._drain = function() {
    const d = this;
    return d._paused || !d._isOnline() ? Promise.resolve() : (d._drainPromise || (d._drainPromise = s.claimReady(d.scope, d._workerId, o).then((y) => {
      for (const g of y.wakeups)
        d._scheduleTimer(g.chainKey, g.at - Date.now());
      for (const g of y.entries)
        d._clearTimer(g.chainKey), L(d.dom, "ln-api-queue:send", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          op: g.op,
          targetId: g.targetId,
          payload: g.payload,
          expectedVersion: g.expectedVersion,
          idempotencyKey: g.entryId,
          meta: g.meta
        });
    }).catch((y) => {
      console.error("[ln-api-queue] Drain failed:", y), L(d.dom, "ln-api-queue:error", { operation: "drain", error: y });
    }).finally(() => {
      d._drainPromise = null;
    })), d._drainPromise);
  }, n.prototype._onEnqueue = function(d) {
    const y = this;
    return s.enqueue(y.scope, d.detail || {}).then((g) => {
      if (g)
        return y._emitPendingCount().then((m) => (L(y.dom, "ln-api-queue:enqueued", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          count: m.length
        }), y._drain()));
    }).catch((g) => {
      L(y.dom, "ln-api-queue:error", { operation: "enqueue", error: g });
    });
  }, n.prototype._onAck = function(d) {
    const y = this, g = d.detail || {};
    return s.ack(y.scope, g.entryId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((m) => {
      L(y.dom, "ln-api-queue:error", { operation: "ack", entryId: g.entryId, error: m });
    });
  }, n.prototype._onNack = function(d) {
    const y = this, g = d.detail || {};
    return s.nack(y.scope, g.entryId, g.reason, {
      maxAttempts: f,
      backoff: l
    }).then((m) => {
      if (m)
        return m.status === "failed" ? L(y.dom, "ln-api-queue:failed", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey,
          attempts: m.entry.attempts
        }) : m.status === "retry" ? y._scheduleTimer(m.entry.chainKey, m.delay) : m.status === "auth" && (y._paused = !0, L(y.dom, "ln-api-queue:paused", { reason: "auth" }), L(y.dom, "ln-api-queue:auth-required", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey
        })), y._emitPendingCount().then(() => {
          if (m.status === "dropped") return y._drain();
        });
    }).catch((m) => {
      L(y.dom, "ln-api-queue:error", { operation: "nack", entryId: g.entryId, error: m });
    });
  }, n.prototype._onRemap = function(d) {
    const y = this, g = d.detail || {};
    return s.remap(y.scope, g.oldKey, g.newId).catch((m) => {
      L(y.dom, "ln-api-queue:error", { operation: "remap", error: m });
    });
  }, n.prototype._onResolveCreate = function(d) {
    const y = this, g = d.detail || {};
    return s.resolveCreate(y.scope, g.entryId, g.oldKey, g.newId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((m) => {
      L(y.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: g.entryId,
        error: m
      });
    });
  }, n.prototype._onResume = function() {
    const d = this;
    return s.setPaused(d.scope, !1).then(() => (d._paused = !1, L(d.dom, "ln-api-queue:resumed", {}), d._drain())).catch((y) => {
      L(d.dom, "ln-api-queue:error", { operation: "resume", error: y });
    });
  }, n.prototype._onPause = function() {
    const d = this;
    return s.setPaused(d.scope, "manual").then(() => {
      d._paused = !0, L(d.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((y) => {
      L(d.dom, "ln-api-queue:error", { operation: "pause", error: y });
    });
  }, n.prototype._onDrain = function() {
    const d = this;
    return s.resetFailed(d.scope).then(() => {
      const y = d._drainPromise;
      return y ? y.then(() => d._drain()) : d._drain();
    }).catch((y) => {
      L(d.dom, "ln-api-queue:error", { operation: "manual-drain", error: y });
    });
  }, n.prototype._onClear = function() {
    const d = this;
    return d._timers.forEach((y) => clearTimeout(y)), d._timers.clear(), s.clear(d.scope).then(() => {
      d._paused = !1, L(d.dom, "ln-api-queue:pending-count", { count: 0, scope: d.scope }), L(d.dom, "ln-api-queue:drained", { scope: d.scope });
    }).catch((y) => {
      L(d.dom, "ln-api-queue:error", { operation: "clear", error: y });
    });
  }, n.prototype._bindEvents = function() {
    const d = this;
    d._handlers = {
      enqueue: (y) => d._onEnqueue(y),
      ack: (y) => d._onAck(y),
      nack: (y) => d._onNack(y),
      remap: (y) => d._onRemap(y),
      resolveCreate: (y) => d._onResolveCreate(y),
      resume: () => d._onResume(),
      pause: () => d._onPause(),
      drain: () => d._onDrain(),
      clear: () => d._onClear()
    }, d.dom.addEventListener("ln-api-queue:request-enqueue", d._handlers.enqueue), d.dom.addEventListener("ln-api-queue:ack", d._handlers.ack), d.dom.addEventListener("ln-api-queue:nack", d._handlers.nack), d.dom.addEventListener("ln-api-queue:request-remap", d._handlers.remap), d.dom.addEventListener("ln-api-queue:resolve-create", d._handlers.resolveCreate), d.dom.addEventListener("ln-api-queue:request-resume", d._handlers.resume), d.dom.addEventListener("ln-api-queue:request-pause", d._handlers.pause), d.dom.addEventListener("ln-api-queue:request-drain", d._handlers.drain), d.dom.addEventListener("ln-api-queue:request-clear", d._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const d = this;
    d.dom.removeEventListener("ln-api-queue:request-enqueue", d._handlers.enqueue), d.dom.removeEventListener("ln-api-queue:ack", d._handlers.ack), d.dom.removeEventListener("ln-api-queue:nack", d._handlers.nack), d.dom.removeEventListener("ln-api-queue:request-remap", d._handlers.remap), d.dom.removeEventListener("ln-api-queue:resolve-create", d._handlers.resolveCreate), d.dom.removeEventListener("ln-api-queue:request-resume", d._handlers.resume), d.dom.removeEventListener("ln-api-queue:request-pause", d._handlers.pause), d.dom.removeEventListener("ln-api-queue:request-drain", d._handlers.drain), d.dom.removeEventListener("ln-api-queue:request-clear", d._handlers.clear), window.removeEventListener("online", d._onlineHandler), d._timers.forEach((y) => clearTimeout(y)), d._timers.clear(), L(d.dom, "ln-api-queue:destroyed", { scope: d.scope }), delete d.dom[e];
  };
  function c(d) {
    const y = d[e];
    y && y._drain();
  }
  U(t, e, n, "ln-api-queue", {
    effects: {
      "data-ln-api-queue-online": c
    }
  });
})();
function xn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function wt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function ur(t, e, l) {
  const f = xn(t);
  return f === null || f < 0 ? 0 : Math.min(f, Math.min(e, l) / 2);
}
function hr(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((l) => !Number.isFinite(l)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function fr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), l = e[0].trim();
  return l ? {
    field: l,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function pr(t, e) {
  e = e || {};
  const l = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, f = e.xField || "label", o = e.yField || "value", p = e.includeZero !== !1, s = ur(e.padding, l.width, l.height), n = Array.isArray(t) ? t : [], c = [];
  for (let a = 0; a < n.length; a++) {
    const v = n[a] || {}, w = xn(v[o]);
    w !== null && c.push({
      record: v,
      sourceIndex: a,
      label: v[f] == null ? String(a + 1) : String(v[f]),
      value: w
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
      baselineY: l.y + l.height - s
    };
  let d = c[0].value, y = c[0].value;
  for (let a = 1; a < c.length; a++)
    c[a].value < d && (d = c[a].value), c[a].value > y && (y = c[a].value);
  let g = d, m = y;
  p && (g = Math.min(0, g), m = Math.max(0, m)), g === m && (m === 0 ? m = 1 : m > 0 ? g = 0 : m = 0);
  const b = Math.max(1, l.width - s * 2), i = Math.max(1, l.height - s * 2), r = m - g, h = l.y + l.height - s - (0 - g) / r * i, u = [];
  for (let a = 0; a < c.length; a++) {
    const v = c[a], w = c.length === 1 ? 0.5 : a / (c.length - 1), A = l.x + s + w * b, C = l.y + l.height - s - (v.value - g) / r * i;
    u.push({
      record: v.record,
      sourceIndex: v.sourceIndex,
      label: v.label,
      value: v.value,
      x: A,
      y: C,
      pointString: wt(A) + "," + wt(C)
    });
  }
  const _ = u.map((a) => a.pointString).join(" ");
  let E = "";
  if (u.length > 0) {
    const a = u[0], v = u[u.length - 1], w = wt(a.x) + "," + wt(h), A = wt(v.x) + "," + wt(h);
    E = w + " " + _ + " " + A;
  }
  return {
    points: u,
    linePoints: _,
    areaPoints: E,
    count: u.length,
    min: d,
    max: y,
    domainMin: g,
    domainMax: m,
    baselineY: h
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", l = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function f(s, n) {
    s && (s.textContent = n);
  }
  function o(s) {
    this.dom = s, this.name = s.getAttribute(t) || "", this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const n = this;
    return this._onSetData = function(c) {
      const d = c.detail || {};
      n._data = Array.isArray(d.data) ? d.data : [], n.isLoaded = !0, n._setLoading(!1), n._render();
    }, this._onSetLoading = function(c) {
      n._setLoading(!!(c.detail && c.detail.loading));
    }, this._onRefresh = function() {
      n.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  o.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), n = s === null ? NaN : Number(s), c = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(n) && n >= 0 ? n : 16,
      type: c === "area" || c === "polygon" ? "area" : "line",
      viewBox: this.plot && hr(this.plot.getAttribute("viewBox")) || l
    };
  }, o.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, o.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const n = this.name + "-label", c = '[data-ln-template="' + n + '"]';
    if (!this.dom.querySelector(c) && !document.querySelector(c)) return;
    const d = gt(this.dom, n, "ln-chart");
    if (!d) return;
    const y = G(this.dom);
    for (const g of s.points) {
      const m = d.cloneNode(!0);
      Ot(m, {
        label: g.label,
        value: et(g.value, y)
      }), this.labels.appendChild(m);
    }
  }, o.prototype._render = function() {
    const s = this._readOptions(), n = pr(this._data, s);
    this.model = n, this.line && (this.line.setAttribute("points", n.linePoints), this.line.toggleAttribute("hidden", n.count === 0)), this.area && (this.area.setAttribute("points", n.areaPoints), this.area.toggleAttribute("hidden", n.count === 0 || s.type !== "area"));
    const c = n.count === 0;
    this.dom.classList.toggle("ln-chart--empty", c), this.empty && this.empty.toggleAttribute("hidden", !c);
    const d = G(this.dom);
    f(this.minimum, et(n.min, d)), f(this.maximum, et(n.max, d)), f(this.count, et(n.count, d)), this._renderLabels(n), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: n.count,
      min: n.min,
      max: n.max
    });
  }, o.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: fr(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  };
  function p(s) {
    const n = s[e];
    n && n.requestData();
  }
  U(t, e, o, "ln-chart", {
    // Default effect: every other data-ln-* on the host is a render option
    // read live by _readOptions(), so a re-render is the whole reaction.
    onAttrChange: function(s) {
      const n = s[e];
      n && n._render();
    },
    effects: {
      "data-ln-chart-source": p,
      "data-ln-chart-sort": p
    }
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  function l(f) {
    this.dom = f, this._storeName = f.getAttribute(t), this._valueField = f.getAttribute("data-ln-options-value") || "id", this._labelField = f.getAttribute("data-ln-options-label") || "name";
    const o = this;
    return this._onSetData = function(p) {
      o._rebuild(p.detail.data || []);
    }, f.addEventListener("ln-options:set-data", this._onSetData), L(f, "ln-options:request-data", { options: this._storeName }), this;
  }
  l.prototype._rebuild = function(f) {
    const o = this.dom, p = this._valueField, s = this._labelField, n = o.value, c = o.querySelectorAll("option");
    for (let y = c.length - 1; y >= 0; y--)
      c[y].value !== "" && o.removeChild(c[y]);
    for (let y = 0; y < f.length; y++) {
      const g = f[y], m = document.createElement("option");
      m.value = String(g[p]), m.textContent = g[s] != null ? g[s] : "", o.appendChild(m);
    }
    const d = o.options;
    for (let y = 0; y < d.length; y++)
      if (d[y].value === n) {
        o.value = n;
        break;
      }
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, U(t, e, l, "ln-options");
})();
function mr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const l = t.slice(0, e).trim(), f = t.slice(e + 1).trim();
  if (!l) return null;
  const o = {};
  return o[l] = [f], o;
}
function gr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  function l(f) {
    return this.dom = f, this._storeName = f.getAttribute(t), this._filters = mr(f.getAttribute("data-ln-stat-filter")), this._onSetCount = function(o) {
      f.textContent = gr(o.detail && o.detail.count), f.classList.remove("is-loading");
    }, f.addEventListener("ln-stat:set-count", this._onSetCount), L(f, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, U(t, e, l, "ln-stat");
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", l = "#ln-icon-custom-", f = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  let p = null;
  const s = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", d = "lni:v", y = "1";
  function g() {
    try {
      if (localStorage.getItem(d) !== y) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const E = localStorage.key(_);
          E && E.indexOf(c) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(d, y);
      }
    } catch {
    }
  }
  g();
  function m() {
    return p || (p = document.getElementById(t), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = t, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function b(_) {
    return _.indexOf(l) === 0 ? n + "/" + _.slice(l.length) + ".svg" : s + "/" + _.slice(e.length) + ".svg";
  }
  function i(_, E) {
    const a = E.match(/viewBox="([^"]+)"/), v = a ? a[1] : "0 0 24 24", w = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", C = E.match(/<svg([^>]*)>/i), T = C ? C[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = _, x.setAttribute("viewBox", v), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const R = T.match(new RegExp(D + '="([^"]*)"'));
      R && x.setAttribute(D, R[1]);
    }), x.innerHTML = A, m().querySelector("defs").appendChild(x);
  }
  function r(_) {
    if (f.has(_) || o.has(_)) return;
    if (_.indexOf(l) === 0 && !n) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const E = _.slice(1);
    try {
      const v = localStorage.getItem(c + E);
      if (v) {
        i(E, v), f.add(_);
        return;
      }
    } catch {
    }
    o.add(_);
    const a = b(_);
    fetch(a).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      i(E, v), f.add(_), o.delete(_);
      try {
        localStorage.setItem(c + E, v);
      } catch {
      }
    }).catch(function(v) {
      console.error("[ln-icon] Fetch failed for:", E, v), o.delete(_);
    });
  }
  function h(_) {
    const E = 'use[href^="' + e + '"], use[href^="' + l + '"]', a = _.querySelectorAll ? _.querySelectorAll(E) : [];
    if (_.matches && _.matches(E)) {
      const v = _.getAttribute("href");
      v && r(v);
    }
    Array.prototype.forEach.call(a, function(v) {
      const w = v.getAttribute("href");
      w && r(w);
    });
  }
  function u() {
    h(document), new MutationObserver(function(_) {
      _.forEach(function(E) {
        if (E.type === "childList")
          E.addedNodes.forEach(function(a) {
            a.nodeType === 1 && h(a);
          });
        else if (E.type === "attributes" && E.attributeName === "href") {
          const a = E.target.getAttribute("href");
          a && (a.indexOf(e) === 0 || a.indexOf(l) === 0) && r(a);
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
const Ee = /* @__PURE__ */ new Set([
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
  "data-ln-confirm",
  "data-ln-confirm-active",
  "data-ln-confirm-idle",
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
  "data-ln-form-scope",
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
function _r(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const l = [];
  for (let f = 0; f <= e.length; f++) l[f] = [f];
  for (let f = 0; f <= t.length; f++) l[0][f] = f;
  for (let f = 1; f <= e.length; f++)
    for (let o = 1; o <= t.length; o++)
      e.charAt(f - 1) === t.charAt(o - 1) ? l[f][o] = l[f - 1][o - 1] : l[f][o] = Math.min(
        l[f - 1][o - 1] + 1,
        l[f][o - 1] + 1,
        l[f - 1][o] + 1
      );
  return l[e.length][t.length];
}
function br(t, e = Ee) {
  if (e.has(t)) return null;
  let l = null, f = 1 / 0;
  for (const p of e) {
    const s = _r(t, p);
    s < f && (f = s, l = p);
  }
  const o = Math.max(3, Math.floor(t.length * 0.4));
  return f <= o ? l : null;
}
function kn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function yr(t = document) {
  const e = t.ownerDocument || t, l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], o = [l, ...l.querySelectorAll("*")];
  for (let p = 0; p < o.length; p++) {
    const s = o[p];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const c = s.attributes[n];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const d = (c.value || "").trim();
          if (!d) {
            f.push({
              type: "id-empty",
              element: s,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(d) || e.querySelector("#" + kn(d)) || f.push({
            type: "id-unresolved",
            element: s,
            attribute: c.name,
            targetId: d,
            message: `[ln-debug] Unresolved ID reference: <${s.tagName.toLowerCase()} ${c.name}="${d}"> targets "#${d}", but no element with id="${d}" exists in the document.`
          });
        }
      }
  }
  return f;
}
function vr(t = document) {
  const e = t.ownerDocument || t, l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], o = [l, ...l.querySelectorAll("*")];
  for (let p = 0; p < o.length; p++) {
    const s = o[p];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const c = s.attributes[n];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const y = (c.value || "").trim();
          if (!y) {
            f.push({
              type: "store-empty",
              element: s,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${s.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const g = kn(y), m = e.querySelector(`[data-ln-data-store="${g}"], [data-ln-store="${g}"]`), b = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(y);
          !m && !b && f.push({
            type: "store-unresolved",
            element: s,
            attribute: c.name,
            storeName: y,
            message: `[ln-debug] Unresolved store reference: <${s.tagName.toLowerCase()} ${c.name}="${y}"> targets store "${y}", but no [data-ln-data-store="${y}"] exists in the document.`
          });
        }
      }
  }
  return f;
}
function wr(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const l = [], f = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && f.unshift(e);
  const o = /* @__PURE__ */ new Map();
  for (let p = 0; p < f.length; p++) {
    const s = f[p], n = (s.getAttribute("data-ln-data-store") || "").trim();
    n && (o.has(n) || o.set(n, []), o.get(n).push(s));
  }
  for (const [p, s] of o.entries())
    s.length > 1 && l.push({
      type: "store-duplicate",
      storeName: p,
      elements: s,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${p}". Store names must be unique across the document.`
    });
  return l;
}
function Er(t = document, e = Ee) {
  const l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], o = [l, ...l.querySelectorAll("*")];
  for (let p = 0; p < o.length; p++) {
    const s = o[p];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const c = s.attributes[n];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const d = br(c.name, e), y = d ? ` Did you mean "${d}"?` : "";
          f.push({
            type: "attribute-unknown",
            element: s,
            attribute: c.name,
            suggestion: d,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${s.tagName.toLowerCase()}>.${y}`
          });
        }
      }
  }
  return f;
}
function pe(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const l = e.validAttributes || Ee, f = yr(t), o = vr(t), p = wr(t), s = Er(t, l), n = [
    ...f,
    ...o,
    ...p,
    ...s
  ];
  if (!e.silent)
    for (let c = 0; c < n.length; c++)
      console.warn(n[c].message);
  return {
    idIssues: f,
    storeIssues: o,
    uniquenessIssues: p,
    spellingIssues: s,
    total: n.length
  };
}
let kt = null;
function Kt(t = typeof document < "u" ? document : null, e = 50, l = null) {
  if (!t) return;
  kt && (clearTimeout(kt), kt = null);
  function f() {
    kt = setTimeout(() => {
      kt = null;
      const o = pe(t);
      l && l(o);
    }, e);
  }
  Ze() > 0 ? st(f) : f();
}
function Ve(t, e, l, f) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", l), console.log("detail", f), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", l), console.log("old → new", f.oldValue, "→", f.newValue), console.groupEnd());
}
let At = [];
function Ar() {
  At = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && At.push(document.body);
}
function Sr(t) {
  for (let e = 0; e < At.length; e++)
    if (At[e].contains(t)) return !0;
  return !1;
}
function Cr(t, e, l, f) {
  if (l === window || l === document) {
    At.indexOf(document.body) !== -1 && Ve(t, e, l, f);
    return;
  }
  Sr(l) && Ve(t, e, l, f);
}
function me() {
  Ar(), Kn(At.length > 0 ? Cr : null);
}
function We() {
  me();
}
function Lr() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, at(function() {
    me(), Mt(["data-ln-debug"], me);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  Lr();
  function l(o) {
    return this.dom = o, Kt(o.ownerDocument || document), We(), this;
  }
  l.prototype.verify = function(o, p) {
    return pe(o || (this.dom ? this.dom.ownerDocument || this.dom : document), p);
  }, l.prototype.destroy = function() {
    delete this.dom[e], We();
  };
  const f = U(t, e, l, "ln-debug", {
    onInit: function(o) {
      typeof document < "u" && Kt(o && o.ownerDocument ? o.ownerDocument : document);
    },
    onSubtreeChange: function(o) {
      typeof document < "u" && Kt(o && o.ownerDocument ? o.ownerDocument : document);
    }
  });
  f.verify = function(o, p) {
    return pe(o || document, p);
  }, f.schedule = function(o, p, s) {
    return Kt(o || document, p, s);
  };
})();
