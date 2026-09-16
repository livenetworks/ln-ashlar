function ve(t) {
  let e = !1;
  for (let a = 0; a < t.length; a++) {
    const d = t[a];
    if (!(d === "" || d == null) && (e = !0, !Number.isFinite(Number(d))))
      return "string";
  }
  return e ? "number" : "string";
}
function we(t, e, a, d) {
  if (a === "number") {
    const s = parseFloat(t), n = parseFloat(e);
    return (isNaN(s) ? 0 : s) - (isNaN(n) ? 0 : n);
  }
  const o = t != null ? String(t) : "", c = e != null ? String(e) : "";
  return d ? d.compare(o, c) : o < c ? -1 : o > c ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const ae = {};
function Qt(t, e) {
  ae[t] || (ae[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const a = ae[t];
  return a ? a.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Qn(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function C(t, e, a) {
  const d = a || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: d
  }));
}
function W(t, e, a) {
  const d = a || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d);
  const o = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d
  });
  return t.dispatchEvent(o), o;
}
function Xe(t, e, a) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const d = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  d[a] = t.name, C(t.dom, e, d);
}
function st(t, e) {
  if (!t || !e) return t;
  const a = t.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < a.length; s++) {
    const n = a[s], h = n.getAttribute("data-ln-field");
    e[h] != null && (n.textContent = e[h]);
  }
  const d = t.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < d.length; s++) {
    const n = d[s], h = n.getAttribute("data-ln-attr").split(",");
    for (let p = 0; p < h.length; p++) {
      const b = h[p].trim().split(":");
      if (b.length !== 2) continue;
      const m = b[0].trim(), g = b[1].trim();
      e[g] != null && n.setAttribute(m, e[g]);
    }
  }
  const o = t.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < o.length; s++) {
    const n = o[s], h = n.getAttribute("data-ln-show");
    h in e && n.classList.toggle("hidden", !e[h]);
  }
  const c = t.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < c.length; s++) {
    const n = c[s], h = n.getAttribute("data-ln-class").split(",");
    for (let p = 0; p < h.length; p++) {
      const b = h[p].trim().split(":");
      if (b.length !== 2) continue;
      const m = b[0].trim(), g = b[1].trim();
      g in e && n.classList.toggle(m, !!e[g]);
    }
  }
  return t;
}
function $n(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const a = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let d = 0; d < a.length; d++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", a[d], e ?? null), a[d].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      st(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let a = 0; a < e.length; a++)
        e[a].textContent = "";
    }
})));
function Nt(t, e) {
  if (!t || !e) return t;
  const a = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; a.nextNode(); ) {
    const c = a.currentNode;
    c.textContent.indexOf("{{") !== -1 && (c.textContent = c.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(s, n) {
        return e[n] !== void 0 ? e[n] : "";
      }
    ));
  }
  const d = function(c, s) {
    return e[s] !== void 0 ? e[s] : "";
  }, o = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && o.push(t);
  for (let c = 0; c < o.length; c++) {
    const s = o[c], n = s.attributes;
    for (let h = 0; h < n.length; h++) {
      const p = n[h];
      p.value.indexOf("{{") !== -1 && s.setAttribute(p.name, p.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function Xn(t, e, a, d, o, c) {
  const s = {};
  for (let h = 0; h < t.children.length; h++) {
    const p = t.children[h], b = p.getAttribute("data-ln-render-key");
    b && (s[b] = p);
  }
  const n = document.createDocumentFragment();
  for (let h = 0; h < e.length; h++) {
    const p = e[h], b = String(d(p));
    let m = s[b];
    if (m)
      o(m, p, h);
    else {
      const g = Qt(a, c);
      if (!g || (Nt(g, p), m = g.firstElementChild, !m)) continue;
      m.setAttribute("data-ln-render-key", b), o(m, p, h);
    }
    n.appendChild(m);
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
function mt(t, e, a) {
  if (t) {
    const d = t.querySelector('[data-ln-template="' + e + '"]');
    if (d) return d.content.cloneNode(!0);
  }
  return Qt(e, a);
}
function Zt(t, e) {
  const a = {}, d = t.querySelectorAll("[" + e + "]");
  for (let o = 0; o < d.length; o++)
    a[d[o].getAttribute(e)] = d[o].textContent, d[o].remove();
  return a;
}
function ue(t, e, a, d) {
  if (t.nodeType !== 1) return;
  const c = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", s = Array.from(t.querySelectorAll(c));
  t.matches && t.matches(c) && s.push(t);
  for (const n of s)
    n[a] || (n[a] = new d(n));
}
function Mt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Ye(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Yn(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Je(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Jn(t, e) {
  return !t || !document.contains(t) || Je(t) || e && typeof t[e] != "function" ? !1 : Mt(t);
}
function Zn(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Ze(t, e) {
  const a = !!(e && e.typed), d = e && e.exclude, o = {}, c = t.elements, s = {};
  if (a)
    for (let n = 0; n < c.length; n++) {
      const h = c[n];
      h.name && h.type === "checkbox" && !h.disabled && (s[h.name] = (s[h.name] || 0) + 1);
    }
  for (let n = 0; n < c.length; n++) {
    const h = c[n];
    if (!(!h.name || h.disabled || h.type === "file" || h.type === "submit" || h.type === "button") && !(d && h.matches && h.matches(d)))
      if (h.type === "checkbox")
        a && s[h.name] === 1 ? o[h.name] = h.checked : (o[h.name] || (o[h.name] = []), h.checked && o[h.name].push(h.value));
      else if (h.type === "radio")
        h.checked && (o[h.name] = h.value);
      else if (h.type === "select-multiple") {
        o[h.name] = [];
        for (let p = 0; p < h.options.length; p++)
          h.options[p].selected && o[h.name].push(h.options[p].value);
      } else if (a && h.type === "hidden")
        o[h.name] = h.value;
      else if (a && (h.type === "number" || h.type === "range")) {
        const p = Number(h.value);
        o[h.name] = h.value === "" || isNaN(p) ? null : p;
      } else
        o[h.name] = h.value;
  }
  return o;
}
function ti(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function tn(t, e) {
  const a = t.elements, d = [], o = {};
  for (let c = 0; c < a.length; c++) {
    const s = a[c];
    s.name && s.type === "checkbox" && (o[s.name] = (o[s.name] || 0) + 1);
  }
  for (let c = 0; c < a.length; c++) {
    const s = a[c];
    if (s.type === "file" || s.type === "submit" || s.type === "button") continue;
    const n = s.getAttribute("data-ln-fill-as") || s.name;
    if (!n || !(n in e)) continue;
    const h = e[n];
    if (s.type === "checkbox") {
      if (Array.isArray(h))
        s.checked = h.indexOf(s.value) !== -1;
      else if (o[s.name] > 1) {
        const p = String(h).split(",").map(function(b) {
          return b.trim();
        });
        s.checked = p.indexOf(s.value) !== -1;
      } else
        s.checked = ti(h);
      d.push(s);
    } else if (s.type === "radio")
      s.checked = s.value === String(h), d.push(s);
    else if (s.type === "select-multiple") {
      if (Array.isArray(h))
        for (let p = 0; p < s.options.length; p++)
          s.options[p].selected = h.indexOf(s.options[p].value) !== -1;
      d.push(s);
    } else
      s.value = h, d.push(s);
  }
  return d;
}
const ke = {
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
  const e = t ? t.closest("[lang]") : null, a = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!a) return "en-US";
  const d = a.trim().toLowerCase();
  return d.indexOf("-") === -1 && ke[d] ? ke[d] : a;
}
function te() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, at(function() {
    new MutationObserver(function() {
      C(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function St(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function en(t, e, { get: a, set: d }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return a ? a.call(this) : e.get.call(this);
    },
    set: function(o) {
      d ? d.call(this, o, (c) => e.set.call(this, c)) : e.set.call(this, o);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ei() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function le() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function nn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function rt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function rn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [] }, window.lnCore._attrRegistry;
}
function on(t) {
  const e = rn(), a = t.observed || [];
  for (let d = 0; d < a.length; d++) {
    const o = a[d];
    e.byAttr.has(o) || e.byAttr.set(o, []), e.byAttr.get(o).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t);
}
function ni(t) {
  const e = t.target, a = t.attributeName;
  if (t.oldValue === e.getAttribute(a)) return;
  const d = rn(), o = d.byAttr.get(a);
  if (window.lnCore._debugSink && (a.indexOf("data-ln-") === 0 || o) && window.lnCore._debugSink("attr", a, e, { oldValue: t.oldValue, newValue: e.getAttribute(a) }), a.indexOf("data-ln-") === 0)
    for (let c = 0; c < d.reactive.length; c++) {
      const s = d.reactive[c];
      if (!e[s.attribute]) continue;
      const n = s.effects && s.effects[a];
      n ? n(e, a, t.oldValue) : s.onAttrChange && s.onAttrChange(e, a, t.oldValue);
    }
  if (o)
    for (let c = 0; c < o.length; c++) {
      const s = o[c];
      if (s.handler) {
        s.handler(e, a, t.oldValue);
        continue;
      }
      s.onAttributeChange && e[s.attribute] ? s.onAttributeChange(e, a) : (ue(e, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(e));
    }
}
function sn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, at(function() {
    new MutationObserver(function(e) {
      for (let a = 0; a < e.length; a++)
        ni(e[a]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function ee(t, e) {
  on({ observed: t, handler: e }), sn();
}
function U(t, e, a, d, o = {}) {
  const c = o.extraAttributes || [], s = o.onAttributeChange || null, n = o.onSubtreeChange || null, h = o.onInit || null, p = o.onAttrChange || null, b = o.effects || null;
  function m(i) {
    const r = i || document.body;
    ue(r, t, e, a), h && h(r);
  }
  const g = [];
  if (t.indexOf("[") !== -1) {
    const i = /\[([\w-]+)/g;
    let r;
    for (; (r = i.exec(t)) !== null; )
      g.push(r[1]);
  } else
    g.push(t);
  on({
    selector: t,
    attribute: e,
    ComponentFn: a,
    onInit: h,
    observed: g.concat(c),
    onAttributeChange: s,
    onAttrChange: p,
    effects: b
  }), sn(), at(function() {
    new MutationObserver(function(r) {
      for (let l = 0; l < r.length; l++) {
        const f = r[l];
        if (f.type === "childList") {
          if (n && f.target) {
            const w = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", u = f.target.nodeType === 1 ? f.target.matches(w) ? f.target : f.target.closest(w) : f.target.parentElement ? f.target.parentElement.closest(w) : null;
            u && n(u, f);
          }
          for (let v = 0; v < f.addedNodes.length; v++) {
            const w = f.addedNodes[v];
            w.nodeType === 1 && (ue(w, t, e, a), h && h(w));
          }
          for (let v = 0; v < f.removedNodes.length; v++) {
            const w = f.removedNodes[v];
            if (w.nodeType === 1) {
              const y = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", E = Array.from(w.querySelectorAll(y));
              w.matches && w.matches(y) && E.push(w);
              for (let A = 0; A < E.length; A++) {
                const L = E[A];
                if (!document.contains(L)) {
                  const T = L[e];
                  T && typeof T.destroy == "function" && T.destroy();
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
  }, d || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[e] = m;
  function _() {
    nn() > 0 ? rt(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _(), m;
}
function an(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const a = e.getAttribute("href");
  return !(!a || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || a.startsWith("mailto:") || a.startsWith("tel:") || a === "#" || a.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function ut(...t) {
  return t.filter((e) => e != null && e !== "").map((e, a) => a === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function xt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function ln(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (a) {
    return console.error(`[${e}] Invalid headers JSON:`, a), {};
  }
}
const cn = {};
function ii(t, e) {
  cn[t] = e;
}
function ri(t) {
  return cn[t] || { ingress: (e) => e, egress: (e) => e };
}
const dn = {};
function Ee(t, e) {
  if (!t || typeof e != "object") return;
  const a = t.toLowerCase().split("-")[0];
  dn[a] = e;
}
function yt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return dn[e] || null;
}
Ee("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ii, window.lnCore.getDataMapper = ri, window.lnCore.registerLocaleFallback = Ee, window.lnCore.getLocaleFallback = yt, window.lnCore.fillTemplate = Nt, window.lnCore.fill = st, window.lnCore.lnFill = $n, window.lnCore.renderList = Xn, window.lnCore.ensureLocaleObserver = te);
function ne(t, e) {
  let a = !1;
  return function() {
    a || (a = !0, queueMicrotask(function() {
      a = !1, t();
    }));
  };
}
function un(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, a = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, o = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const c = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, s = typeof t.onChange == "function" ? t.onChange : function() {
  }, n = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
  let b = 0, m = 0, g = 0, _ = { sort: null, filters: {}, search: "" }, i = null, r = 0, l = 0, f = !1;
  function v(E) {
    h.set(E, ++r);
  }
  function w() {
    return !!(_ && (_.search || _.filters && Object.keys(_.filters).length));
  }
  function u() {
    if (n.size <= e) return;
    const E = Array.from(n.keys()).sort(function(L, T) {
      return (h.get(L) || 0) - (h.get(T) || 0);
    });
    let A = 0;
    for (; n.size > e && A < E.length; )
      n.delete(E[A]), h.delete(E[A]), A++;
  }
  function y(E, A) {
    p.add(E), c(_, E, A);
  }
  return {
    get: function(E) {
      return n.get(E);
    },
    has: function(E) {
      return n.has(E);
    },
    peek: function() {
      return n.size ? n.values().next().value : void 0;
    },
    get logicalTotal() {
      return b;
    },
    get grandTotal() {
      return m;
    },
    get queryGen() {
      return g;
    },
    get size() {
      return n.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(E, A) {
      clearTimeout(i), l = E;
      for (let M = E; M < A; M++)
        n.has(M) && v(M);
      if (b <= 0) return;
      const L = Math.max(0, E - d), T = Math.min(b, A + d), x = Math.floor(L / a), I = Math.floor(Math.max(0, T - 1) / a);
      let R = -1;
      for (let M = x; M <= I; M++) {
        const P = M * a, N = Math.min(a, b - P);
        let B = !1;
        const H = Math.max(P, L), z = Math.min(P + N, T);
        for (let Q = H; Q < z; Q++)
          if (!n.has(Q)) {
            B = !0;
            break;
          }
        if (B && !p.has(P)) {
          R = P;
          break;
        }
      }
      R !== -1 && (i = setTimeout(function() {
        y(R, a);
      }, o));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(E) {
      if (E = E || {}, E.queryGen != null && E.queryGen !== g) return !1;
      const A = E.offset || 0, L = E.data || [];
      let T = 0;
      for (let x = 0; x < L.length; x++)
        L[x] != null && T++;
      if (T === 0 && (E.provisional || E.filtered > 0))
        return p.delete(A), !1;
      f && (n.clear(), h.clear(), f = !1), E.provisional || (m = E.total != null ? E.total : m, b = E.filtered != null ? E.filtered : E.data ? E.data.length : b);
      for (let x = 0; x < L.length; x++)
        L[x] != null && (n.set(A + x, L[x]), v(A + x));
      return p.delete(A), u(), s(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (_ = E), y(0, a);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      g++, p.clear(), clearTimeout(i), E && (_ = E), f = !0, y(0, a);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      g++, p.clear(), clearTimeout(i), f = !0;
      const E = Math.max(0, Math.floor(l / a) * a);
      y(E, a);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      p.delete(E);
    },
    destroy: function() {
      clearTimeout(i), n.clear(), h.clear(), p.clear();
    },
    configure: function(E) {
      E = E || {};
      let A = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== e) {
        const L = E.windowSize < e;
        e = E.windowSize, L && u(), A = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (a = E.pageSize), E.threshold != null && E.threshold >= 0 && (d = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (o = E.fetchDebounce), A && s();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (m = E, w() || (b = E), s());
    }
  };
}
const Ie = "ln:", De = "page:";
let wt = null;
function hn() {
  if (wt !== null) return wt;
  try {
    if (typeof localStorage > "u")
      return wt = !1, !1;
    const t = "__ln_test__";
    localStorage.setItem(t, t), localStorage.removeItem(t), wt = !0;
  } catch {
    wt = !1;
  }
  return wt;
}
function oi() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function fn(t, e) {
  const a = e.getAttribute("data-ln-persist"), d = a !== null && a !== "" ? a : null;
  if (d !== null && d.indexOf(De) === 0) {
    const c = d.slice(De.length);
    return c ? Ie + t + ":" + oi() + ":" + c : (console.warn('[ln-persist] data-ln-persist="page:" needs a key after the prefix', e), null);
  }
  const o = d !== null ? d : e.id;
  return o ? Ie + t + ":" + o : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', e), null);
}
function Pt(t, e) {
  if (!hn()) return null;
  const a = fn(t, e);
  if (!a) return null;
  try {
    const d = localStorage.getItem(a);
    return d !== null ? JSON.parse(d) : null;
  } catch {
    return null;
  }
}
function gt(t, e, a) {
  if (!hn()) return;
  const d = fn(t, e);
  if (d)
    try {
      a == null ? localStorage.removeItem(d) : localStorage.setItem(d, JSON.stringify(a));
    } catch {
    }
}
function pn(t) {
  return (t || "").replace(/^#/, "");
}
function ie(t) {
  const e = t === void 0 ? location.hash : t, a = {}, d = pn(e);
  if (!d) return a;
  const o = d.split("&");
  for (let c = 0; c < o.length; c++) {
    const s = o[c];
    if (!s) continue;
    const n = s.indexOf(":"), h = n > -1 ? s.slice(0, n) : s, p = n > -1 ? s.slice(n + 1) : "";
    if (h)
      try {
        a[h] = decodeURIComponent(p);
      } catch {
        a[h] = p;
      }
  }
  return a;
}
function Y(t) {
  if (!t) return null;
  const e = ie();
  return t in e ? e[t] : null;
}
function nt(t, e) {
  if (!t) return;
  const a = ie();
  e == null ? delete a[t] : a[t] = String(e);
  const o = Object.keys(a).map(function(c) {
    const s = a[c];
    return s === "" ? c : c + ":" + encodeURIComponent(s);
  }).join("&");
  pn(location.hash) !== o && (location.hash = o);
}
function Ae(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function vt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const a = t.getAttribute("data-ln-hash");
  if (a && a.trim() !== "") return a.trim();
  const d = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return d ? e ? d + "-" + e : d : e || null;
}
function mn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function he(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function gn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function fe(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const a = t.slice(0, e), d = t.slice(e + 1), o = d ? d.split(",").map(function(c) {
    try {
      return decodeURIComponent(c);
    } catch {
      return c;
    }
  }).filter(Boolean) : [];
  return { key: a, values: o };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = ie, window.lnCore.hashGet = Y, window.lnCore.hashSet = nt, window.lnCore.hashLinkClick = Ae, window.lnCore.resolveHashNamespace = vt, window.lnCore.hashSortEncode = mn, window.lnCore.hashSortDecode = he, window.lnCore.hashFilterEncode = gn, window.lnCore.hashFilterDecode = fe);
function $t(t, e, a, d) {
  const o = typeof d == "number" ? d : 4, c = window.innerWidth, s = window.innerHeight, n = e.width, h = e.height, p = (a || "bottom").split("-"), b = p[0], m = p[1] === "start" || p[1] === "end" ? p[1] : "center", g = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, _ = g[b] || g.bottom;
  function i(w) {
    return w === "top" || w === "bottom" ? m === "start" ? t.left : m === "end" ? t.right - n : t.left + (t.width - n) / 2 : m === "start" ? t.top : m === "end" ? t.bottom - h : t.top + (t.height - h) / 2;
  }
  function r(w) {
    let u, y, E = !0;
    return w === "top" ? (u = t.top - o - h, y = i(w), u < 0 && (E = !1)) : w === "bottom" ? (u = t.bottom + o, y = i(w), u + h > s && (E = !1)) : w === "left" ? (u = i(w), y = t.left - o - n, y < 0 && (E = !1)) : (u = i(w), y = t.right + o, y + n > c && (E = !1)), { top: u, left: y, side: w, fits: E };
  }
  let l = null;
  for (let w = 0; w < _.length; w++) {
    const u = r(_[w]);
    if (u.fits) {
      l = u;
      break;
    }
  }
  l || (l = r(_[0]));
  let f = l.top, v = l.left;
  return n >= c ? v = 0 : (v < 0 && (v = 0), v + n > c && (v = c - n)), h >= s ? f = 0 : (f < 0 && (f = 0), f + h > s && (f = s - h)), { top: f, left: v, placement: l.side };
}
function pe(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, a = e.visibility, d = e.display, o = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const c = t.offsetWidth, s = t.offsetHeight;
  return e.visibility = a, e.display = d, e.position = o, { width: c, height: s };
}
let pt = null;
async function Re(t) {
  if (!t) {
    pt = null;
    return;
  }
  try {
    const e = new TextEncoder(), a = await crypto.subtle.digest("SHA-256", e.encode(t));
    pt = await crypto.subtle.importKey(
      "raw",
      a,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    console.error("[ln-core/crypto] Key derivation failed:", e), pt = null;
  }
}
function ht() {
  return pt;
}
async function si(t, e = pt) {
  const a = e || pt;
  if (!a || t === void 0 || t === null) return t;
  try {
    const d = new TextEncoder(), o = crypto.getRandomValues(new Uint8Array(12)), c = typeof t == "string" ? t : JSON.stringify(t), s = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: o },
      a,
      d.encode(c)
    ), n = btoa(String.fromCharCode(...o)), h = btoa(String.fromCharCode(...new Uint8Array(s)));
    return {
      encrypted: !0,
      iv: n,
      data: h
    };
  } catch (d) {
    return console.error("[ln-core/crypto] Encryption failed:", d), t;
  }
}
async function ai(t, e = pt) {
  const a = e || pt;
  if (!t || !t.encrypted || !a) return t;
  try {
    const d = new TextDecoder(), o = Uint8Array.from(atob(t.iv), (h) => h.charCodeAt(0)), c = Uint8Array.from(atob(t.data), (h) => h.charCodeAt(0)), s = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: o },
      a,
      c
    ), n = d.decode(s);
    try {
      return JSON.parse(n);
    } catch {
      return n;
    }
  } catch (d) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", d), { ...t, decryptionError: !0 };
  }
}
function _n(t, e = 100, a = 0) {
  const d = parseFloat(String(t)) || 0, o = parseFloat(String(e)) || 100, c = parseFloat(String(a)) || 0, s = Math.max(c, Math.min(d, o)), n = o - c;
  let h = 0;
  return n > 0 && (h = (s - c) / n * 100), h = Math.max(0, Math.min(100, h)), {
    value: d,
    min: c,
    max: o,
    clampedValue: s,
    percentage: h
  };
}
function J(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const a = e < 1e11 ? e * 1e3 : e, d = new Date(a);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof t == "string") {
    const a = t.trim();
    if (!a) return null;
    const d = new Date(a);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function kt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), a = String(t.getMonth() + 1).padStart(2, "0"), d = String(t.getDate()).padStart(2, "0");
  return e + "-" + a + "-" + d;
}
const ct = {};
function Xt(t) {
  const e = t || "default";
  if (!ct[e]) {
    const a = new Intl.NumberFormat(t, { useGrouping: !0 }), d = a.formatToParts(1234.5);
    let o = "", c = ".";
    for (let s = 0; s < d.length; s++)
      d[s].type === "group" && (o = d[s].value), d[s].type === "decimal" && (c = d[s].value);
    ct[e] = { groupSep: o, decimalSep: c, fmt: a };
  }
  return ct[e];
}
function bn(t, e, a) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), a && a !== "." && (d = d.replace(a, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function Ut(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const a = t.trim();
  if (a === "" || a === "-") return NaN;
  const d = Xt(e), o = bn(a, d.groupSep, d.decimalSep);
  if (o === "" || o === "-") return NaN;
  const c = parseFloat(o);
  return isNaN(c) ? NaN : c;
}
function et(t, e, a = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", o = a.maxDecimals != null ? parseInt(a.maxDecimals, 10) : null, c = a.userDecimals != null ? a.userDecimals : null;
  if (o !== null) {
    const s = d + "|max:" + o;
    return ct[s] || (ct[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: o
    })), ct[s].format(t);
  }
  if (c !== null && c > 0) {
    const s = d + "|exact:" + c;
    return ct[s] || (ct[s] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: c,
      maximumFractionDigits: c
    })), ct[s].format(t);
  }
  return Xt(e).fmt.format(t);
}
function Rt(t) {
  return String(t || "").trim().toLowerCase();
}
function yn(t) {
  const e = Rt(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function li(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((a) => a.trim()).filter(Boolean);
  return e.length ? e : null;
}
function vn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const a = String(t).toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (a.indexOf(e[d]) === -1) return !1;
  return !0;
}
function ci(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Se(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const a = String(t).trim().toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (String(e[d]).trim().toLowerCase() === a)
      return !0;
  return !1;
}
function Oe(t, e, a) {
  const d = parseInt(t.getAttribute(e), 10);
  return isNaN(d) ? a : d;
}
function di(t, e) {
  return t.hasAttribute(e);
}
function ui(t, e) {
  return (t.getAttribute(e) || "").split(",").map((a) => a.trim()).filter(Boolean);
}
function hi(t, e, a) {
  for (const d in a) {
    const [o, c, s] = a[d];
    Object.defineProperty(t, d, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return o(e, c, s);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function fi(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function pi(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function mi(t, e) {
  return (e || "GET") + " " + (t || "");
}
function gi(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  function d(s, n) {
    n = n || {};
    const h = fi(s), p = pi(s, n), b = mi(h, p);
    gi(p) && e.has(b) && (e.get(b).abort(), e.delete(b));
    const m = new AbortController(), g = n.signal;
    let _ = null;
    g && (g.aborted ? m.abort(g.reason) : (_ = function() {
      m.abort(g.reason);
    }, g.addEventListener("abort", _, { once: !0 })));
    const i = Object.assign({}, n, { signal: m.signal });
    return e.set(b, m), t(s, i).finally(function() {
      g && _ && g.removeEventListener("abort", _), e.get(b) === m && e.delete(b);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function o(s) {
    if (!s.detail || !s.detail.url) return;
    const n = s.target, h = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), p = s.detail.key;
    p && a.has(p) && (a.get(p).abort(), a.delete(p));
    const b = new AbortController(), m = s.detail.signal;
    let g = null;
    m && (m.aborted ? b.abort(m.reason) : (g = function() {
      b.abort(m.reason);
    }, m.addEventListener("abort", g, { once: !0 }))), p && a.set(p, b);
    const _ = { method: h, signal: b.signal };
    s.detail.body !== void 0 && (_.body = s.detail.body), window.fetch(s.detail.url, _).then(function(i) {
      m && g && m.removeEventListener("abort", g), p && a.get(p) === b && a.delete(p), C(n, "ln-http:response", {
        ok: i.ok,
        status: i.status,
        response: i
      });
    }).catch(function(i) {
      m && g && m.removeEventListener("abort", g), p && a.get(p) === b && a.delete(p), !(i && i.name === "AbortError") && C(n, "ln-http:error", {
        ok: !1,
        status: 0,
        error: i
      });
    });
  }
  function c(s) {
    const n = s.detail || {};
    n.all ? window.lnHttp.cancelAll() : n.key ? window.lnHttp.cancelByKey(n.key) : n.url && window.lnHttp.cancel(n.url);
  }
  document.addEventListener("ln-http:request", o), document.addEventListener("ln-http:cancel", c), window.lnHttp = {
    cancel: function(s) {
      let n = !1;
      return e.forEach(function(h, p) {
        p.endsWith(" " + s) && (h.abort(), e.delete(p), n = !0);
      }), n;
    },
    cancelByKey: function(s) {
      return a.has(s) ? (a.get(s).abort(), a.delete(s), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(s) {
        s.abort();
      }), e.clear(), a.forEach(function(s) {
        s.abort();
      }), a.clear();
    },
    get inflight() {
      const s = [];
      return e.forEach(function(n, h) {
        const p = h.indexOf(" ");
        s.push({ method: h.slice(0, p), url: h.slice(p + 1) });
      }), a.forEach(function(n, h) {
        s.push({ key: h });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", o), document.removeEventListener("ln-http:cancel", c), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const a = /* @__PURE__ */ new Map();
  function d(o) {
    if (this.dom = o, this.url = o.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ei(), this._held = !0;
    const c = this, s = this.url;
    let n = a.get(s);
    return n || (n = fetch(s).then(function(h) {
      if (!h.ok)
        throw new Error("HTTP error! status: " + h.status);
      return h.text();
    }).catch(function(h) {
      throw a.delete(s), h;
    }), a.set(s, n)), n.then(function(h) {
      if (c._destroyed) return;
      const p = document.createElement("template");
      p.innerHTML = h, c.dom.content.appendChild(p.content), C(c.dom, "ln-include:loaded", { target: c.dom, url: c.url }), c._held && (c._held = !1, le());
    }).catch(function(h) {
      c._destroyed || (console.error("[ln-include] Failed to fetch template from " + c.url + ":", h), C(c.dom, "ln-include:error", { target: c.dom, url: c.url, error: h }), c._held && (c._held = !1, le()));
    }), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, le()), delete this.dom[e]);
  }, U(t, e, d, "ln-include");
})();
(function() {
  const t = "data-ln-form", e = "lnForm", a = "data-ln-form-action-edit", d = "data-ln-form-action-method";
  if (window[e] !== void 0) return;
  function o(c) {
    this.dom = c, this._baseAction = c.getAttribute("action") || "";
    const s = this;
    return this._onLnFill = function(n) {
      n.target === s.dom && (n.detail ? (s.fill(n.detail), s._applyActionMode(n.detail)) : s.dom.reset());
    }, this._onReset = function() {
      s._applyActionMode(null);
    }, c.addEventListener("ln-fill", this._onLnFill), c.addEventListener("reset", this._onReset), this;
  }
  o.prototype.fill = function(c) {
    const s = tn(this.dom, c);
    for (let n = 0; n < s.length; n++) {
      const h = s[n], p = h.tagName === "SELECT" || h.type === "checkbox" || h.type === "radio";
      h.dispatchEvent(new Event(p ? "change" : "input", { bubbles: !0 }));
    }
  }, o.prototype._ensureMethodInput = function() {
    let c = this.dom.querySelector('input[name="_method"]');
    return c || (c = document.createElement("input"), c.type = "hidden", c.name = "_method", c.value = "", this.dom.appendChild(c)), c;
  }, o.prototype._applyActionMode = function(c) {
    if (!this.dom.hasAttribute(a)) return;
    const s = c && c.id != null && c.id !== "" ? c.id : null, n = this._ensureMethodInput();
    if (s !== null) {
      const h = this.dom.getAttribute(a);
      h ? this.dom.setAttribute("action", h.replace(":id", encodeURIComponent(s))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(s)), n.value = this.dom.getAttribute(d) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), n.value = "";
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), C(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, o, "ln-form");
})();
const Me = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Fe(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function _i(t, e) {
  const a = [];
  if (t) {
    const d = Object.keys(Me);
    for (let o = 0; o < d.length; o++) {
      const c = d[o], s = Me[c];
      t[s] && a.push(c);
    }
  }
  if (e) {
    const d = Array.from(e);
    for (let o = 0; o < d.length; o++)
      d[o] && a.indexOf(d[o]) === -1 && a.push(d[o]);
  }
  return a;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", a = "data-ln-validate-errors", d = "data-ln-validate-error", o = "ln-validate-valid", c = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  function s(n) {
    this.dom = n, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const h = this, p = n.tagName, b = n.type, m = p === "SELECT" || b === "checkbox" || b === "radio";
    this._onInput = function() {
      h._touched = !0, h.validate();
    }, this._onChange = function() {
      h._touched = !0, h.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      h._customErrors.add(r), h._touched = !0;
      const l = n.closest(".form-element");
      if (l) {
        const f = l.querySelector("[" + d + '="' + r + '"]');
        f && f.classList.remove("hidden");
      }
      n.classList.remove(o), n.classList.add(c), n.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, l = n.closest(".form-element");
      if (r) {
        if (h._customErrors.delete(r), l) {
          const f = l.querySelector("[" + d + '="' + r + '"]');
          f && f.classList.add("hidden");
        }
      } else
        h._customErrors.forEach(function(f) {
          if (l) {
            const v = l.querySelector("[" + d + '="' + f + '"]');
            v && v.classList.add("hidden");
          }
        }), h._customErrors.clear();
      h._touched && h.validate();
    }, m || n.addEventListener("input", this._onInput), n.addEventListener("change", this._onChange), n.addEventListener("ln-validate:set-custom", this._onSetCustom), n.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const g = n.form;
    return g && (g.hasAttribute("novalidate") || g.setAttribute("novalidate", ""), this._onFormReset = function() {
      h.reset();
    }, this._onValidateRequest = function(i) {
      h._touched = !0, !h.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(h.dom);
    }, g.addEventListener("reset", this._onFormReset), g.addEventListener("ln-validate:request-validate", this._onValidateRequest), g._lnValidateGateBound || (g._lnValidateGateBound = !0, g.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      C(g, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((l, f) => l.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), (n.value && n.value.trim() !== "" || n.checked) && (this._touched = !0, this.validate()), this;
  }
  s.prototype.validate = function() {
    const n = this.dom, h = n.validity, p = Fe(h, this._customErrors.size), b = _i(h, this._customErrors), m = n.closest(".form-element");
    if (m) {
      const _ = m.querySelector("[" + a + "]");
      if (_) {
        const i = _.querySelectorAll("[" + d + "]");
        for (let r = 0; r < i.length; r++) {
          const l = i[r].getAttribute(d);
          i[r].classList.toggle("hidden", !b.includes(l));
        }
      }
    }
    return n.classList.toggle(o, p), n.classList.toggle(c, !p), n.setAttribute("aria-invalid", p ? "false" : "true"), C(n, p ? "ln-validate:valid" : "ln-validate:invalid", { target: n, field: n.name, errors: b }), p;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(o, c), this.dom.removeAttribute("aria-invalid");
    const n = this.dom.closest(".form-element");
    if (n) {
      const h = n.querySelectorAll("[" + d + "]");
      for (let p = 0; p < h.length; p++)
        h[p].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return Fe(this.dom.validity, this._customErrors.size);
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const n = this.dom.form;
    n && (this._onFormReset && n.removeEventListener("reset", this._onFormReset), this._onValidateRequest && n.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(o, c), this.dom.removeAttribute("aria-invalid"), C(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, s, "ln-validate");
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", a = "data-ln-form-scope";
  if (window[e] !== void 0) return;
  function d(m) {
    if (!m.hasAttribute(t) || m[e]) return;
    m[e] = !0;
    const g = h(m);
    o(g.links), c(g.forms);
  }
  function o(m) {
    for (const g of m) {
      if (g[e + "Trigger"] || g.hostname && g.hostname !== window.location.hostname) continue;
      const _ = g.getAttribute("href");
      if (_ && _.includes("#")) continue;
      const i = function(r) {
        if (!an(r, g)) return;
        r.preventDefault();
        const l = g.getAttribute("href");
        l && n("GET", l, null, g);
      };
      g.addEventListener("click", i), g[e + "Trigger"] = i;
    }
  }
  function c(m) {
    for (const g of m) {
      if (g[e + "Trigger"]) continue;
      if (g.hasAttribute(a)) {
        g[e + "ScopeWarned"] || (g[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const _ = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = g.method.toUpperCase(), l = g.action, f = new FormData(g);
        for (const v of g.querySelectorAll('button, input[type="submit"]'))
          v.disabled = !0;
        n(r, l, f, g, function() {
          for (const v of g.querySelectorAll('button, input[type="submit"]'))
            v.disabled = !1;
        });
      };
      g.addEventListener("submit", _), g[e + "Trigger"] = _;
    }
  }
  function s(m) {
    if (!m[e]) return;
    const g = h(m);
    for (const _ of g.links)
      _[e + "Trigger"] && (_.removeEventListener("click", _[e + "Trigger"]), delete _[e + "Trigger"]);
    for (const _ of g.forms)
      _[e + "Trigger"] && (_.removeEventListener("submit", _[e + "Trigger"]), delete _[e + "Trigger"]);
    delete m[e];
  }
  function n(m, g, _, i, r) {
    if (W(i, "ln-ajax:before-start", { method: m, url: g }).defaultPrevented) return;
    C(i, "ln-ajax:start", { method: m, url: g }), i.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", i.appendChild(f);
    function v() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let w = g;
    const u = document.querySelector('meta[name="csrf-token"]'), y = u ? u.getAttribute("content") : null;
    _ instanceof FormData && y && _.append("_token", y);
    const E = {
      method: m,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (y && (E.headers["X-CSRF-TOKEN"] = y), m === "GET" && _) {
      const A = new URLSearchParams(_);
      w = g + (g.includes("?") ? "&" : "?") + A.toString();
    } else m !== "GET" && _ && (E.body = _);
    fetch(w, E).then(function(A) {
      const L = A.ok, T = A.status;
      return A.text().then(function(x) {
        let I = null, R = null;
        if (x && x.trim())
          try {
            I = JSON.parse(x);
          } catch (M) {
            R = M;
          }
        return { ok: L, status: T, data: I, parseError: R };
      });
    }).then(function(A) {
      const L = A.status, T = A.data, x = A.parseError;
      if (A.ok && !x) {
        if (T && T.title && (document.title = T.title), T && T.content)
          for (const I in T.content) {
            const R = document.getElementById(I);
            R && (R.innerHTML = T.content[I]);
          }
        if (i.tagName === "A") {
          const I = i.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", w);
        C(i, "ln-ajax:success", { method: m, url: w, data: T });
      } else
        C(i, "ln-ajax:error", {
          method: m,
          url: w,
          status: L,
          data: T,
          error: x || null
        });
      C(i, "ln-ajax:complete", { method: m, url: w }), v();
    }).catch(function(A) {
      C(i, "ln-ajax:error", { method: m, url: w, status: 0, data: null, error: A }), C(i, "ln-ajax:complete", { method: m, url: w }), v();
    });
  }
  function h(m) {
    const g = { links: [], forms: [] };
    return m.tagName === "A" && m.getAttribute(t) !== "false" ? g.links.push(m) : m.tagName === "FORM" && m.getAttribute(t) !== "false" ? g.forms.push(m) : (g.links = Array.from(m.querySelectorAll('a:not([data-ln-ajax="false"])')), g.forms = Array.from(m.querySelectorAll('form:not([data-ln-ajax="false"])'))), g;
  }
  function p() {
    at(function() {
      new MutationObserver(function(g) {
        for (const _ of g)
          if (_.type === "childList") {
            for (const i of _.addedNodes)
              if (i.nodeType === 1 && (d(i), !i.hasAttribute(t))) {
                for (const l of i.querySelectorAll("[" + t + "]"))
                  d(l);
                const r = i.closest && i.closest("[" + t + "]");
                if (r && r.getAttribute(t) !== "false") {
                  const l = h(i);
                  o(l.links), c(l.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), ee([t], function(g) {
        d(g);
      });
    }, "ln-ajax");
  }
  function b() {
    for (const m of document.querySelectorAll("[" + t + "]"))
      d(m);
  }
  window[e] = d, window[e].destroy = s, p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
})();
function bi(t, { isHydration: e = !1, hasPrimaryRegion: a = !1, primaryMatch: d = null } = {}) {
  const o = a ? !d : !t.some((p) => p.match), c = [], s = [];
  for (const p of t)
    if (!(!p.targetEl && !p.isPending)) {
      if (!p.match) {
        const b = e && p.hasHydrate && p.hasChildren;
        !p.hasKeep && p.hasChildren && !b && p.targetEl && c.push(p);
        continue;
      }
      p.hasKeep && p.mountedTemplate === p.match.route.templateNode || s.push(Object.assign({}, p, {
        skipMount: e && p.hasHydrate && p.hasChildren
      }));
    }
  s.sort((p, b) => p.regionKey === "__primary__" ? -1 : b.regionKey === "__primary__" ? 1 : 0);
  const h = s.find((p) => p.regionKey === "__primary__") || s[0] || null;
  return { notFound: o, clears: c, swaps: s, owner: h };
}
const wn = {
  navigate: function(t) {
    Ft(t, { historyAction: "push" });
  },
  replace: function(t) {
    Ft(t, { historyAction: "replace" });
  },
  current: function() {
    return Yt === null ? null : {
      path: Yt,
      params: Sn,
      query: Cn,
      route: Ln,
      regions: An
    };
  }
}, Ce = "data-ln-route", En = "lnRoute";
typeof window < "u" && (window.lnRouter = wn);
const dt = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new WeakMap();
let An = /* @__PURE__ */ new Map(), Ne = !1, Yt = null, Sn = {}, Cn = {}, Ln = null, me = !1;
function Pe(t, e, a) {
  me ? queueMicrotask(function() {
    C(t, e, a);
  }) : C(t, e, a);
}
function Jt(t) {
  try {
    const c = new URL(t, window.location.origin);
    t = c.pathname + c.search + c.hash;
  } catch {
  }
  let [e] = t.split("#"), [a, d] = e.split("?");
  const o = {};
  if (d) {
    const c = new URLSearchParams(d);
    for (const [s, n] of c.entries())
      o[s] = n;
  }
  return a = a.replace(/\/+$/, ""), a === "" && (a = "/"), { path: a, query: o };
}
function Tn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const a = t.segments, d = e.segments, o = Math.max(a.length, d.length);
  for (let c = 0; c < o; c++) {
    const s = a[c], n = d[c];
    if (s === void 0) return 1;
    if (n === void 0) return -1;
    if (s === "*") return 1;
    if (n === "*") return -1;
    const h = s.startsWith(":"), p = n.startsWith(":");
    if (h && !p) return 1;
    if (!h && p) return -1;
  }
  return 0;
}
function qn(t, e) {
  const a = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const o = d.segments, c = {};
    let s = !0;
    if (!(a.length > o.length && o[o.length - 1] !== "*")) {
      for (let n = 0; n < o.length; n++) {
        const h = o[n], p = a[n];
        if (h === "*") {
          c.wildcard = a.slice(n).join("/");
          break;
        }
        if (p === void 0) {
          s = !1;
          break;
        }
        if (h.startsWith(":"))
          c[h.slice(1)] = decodeURIComponent(p);
        else if (h !== p) {
          s = !1;
          break;
        }
      }
      if (s && (o.indexOf("*") !== -1 || a.length <= o.length))
        return { route: d, params: c };
    }
  }
  return null;
}
function ge(t, e = {}) {
  const a = e.warn !== !1;
  if (t !== "__primary__") {
    const o = document.getElementById(t);
    return !o && a && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), o;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !d && a && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function Be(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), a = [t].concat(e);
  for (const o of a)
    for (const c of Object.keys(o))
      if (c.startsWith("ln") && o[c] && typeof o[c].destroy == "function")
        try {
          o[c].destroy();
        } catch (s) {
          console.error(`[ln-router] Error destroying component ${c} on element:`, o, s);
        }
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const o of d) {
    const c = o.lnPopover;
    if (c && c.trigger && t.contains(c.trigger))
      try {
        c.destroy();
      } catch (s) {
        console.error("[ln-router] Error destroying open popover:", s);
      }
  }
}
function Ft(t, e = {}) {
  const { path: a, query: d } = Jt(t), o = /* @__PURE__ */ new Map();
  for (const [g, _] of dt)
    o.set(g, qn(a, _.sorted));
  const c = o.get("__primary__") || null, s = ge("__primary__", { warn: !!c }), n = dt.has("__primary__"), h = [];
  for (const [g, _] of o) {
    const i = g === "__primary__" ? s : ge(g, { warn: !1 }), r = !i && !!(c && c.route && c.route.templateNode && c.route.templateNode.content && c.route.templateNode.content.querySelector("#" + CSS.escape(g)));
    !i && !r && _ && console.warn(`[ln-router] Explicit target element #${g} not found in DOM`), h.push({
      regionKey: g,
      match: _,
      targetEl: i,
      isPending: r,
      hasKeep: !!i && i.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!i && i.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!i && i.children.length > 0,
      mountedTemplate: i && ce.get(i) || null
    });
  }
  const p = bi(h, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: c
  });
  if (p.notFound) {
    Pe(document.body, "ln-router:not-found", { path: a });
    return;
  }
  if (W(s || document.body, "ln-router:before-navigate", {
    from: Yt,
    to: t,
    params: c ? c.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const m = function() {
    for (const g of p.clears)
      Be(g.targetEl), g.targetEl.replaceChildren(), ce.delete(g.targetEl);
    for (const g of p.swaps) {
      if ((g.isPending || !g.targetEl || !document.contains(g.targetEl)) && (g.targetEl = g.regionKey === "__primary__" ? s : document.getElementById(g.regionKey)), !g.targetEl) {
        console.warn(`[ln-router] Target element #${g.regionKey} could not be resolved`);
        continue;
      }
      if (g.skipMount || (Be(g.targetEl), g.targetEl.replaceChildren(g.match.route.templateNode.content.cloneNode(!0))), ce.set(g.targetEl, g.match.route.templateNode), p.owner && g.regionKey === p.owner.regionKey) {
        if (g.match.route.title) {
          let _ = g.match.route.title;
          if (g.match.params)
            for (const [i, r] of Object.entries(g.match.params))
              _ = _.replace(new RegExp("\\{\\{\\s*" + i + "\\s*\\}\\}", "g"), r);
          document.title = _;
        }
        if (!e.isHydration) {
          g.targetEl.hasAttribute("tabindex") || g.targetEl.setAttribute("tabindex", "-1");
          const _ = g.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          _ ? (_.setAttribute("tabindex", "-1"), _.focus()) : g.targetEl.focus(), g.regionKey === "__primary__" && g.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Pe(g.targetEl, "ln-router:navigated", {
        path: t,
        params: g.match.params,
        query: d,
        route: g.match.route,
        target: g.targetEl,
        region: g.regionKey
      });
    }
    Yt = t, Cn = d, Ln = c ? c.route : null, Sn = c ? c.params : {}, An = new Map(
      Array.from(o.entries()).map(([g, _]) => [g, _ ? { route: _.route, params: _.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(m) : m();
}
function yi(t) {
  const e = t.target.closest("a");
  if (!e || !an(t, e)) return;
  const a = e.getAttribute("href"), { path: d } = Jt(a);
  for (const o of dt.values())
    if (qn(d, o.sorted)) {
      t.preventDefault(), Ft(a, { historyAction: "push" });
      return;
    }
}
function vi(t, e) {
  const a = Object.keys(t), d = Object.keys(e);
  if (a.length !== d.length) return !1;
  for (let o = 0; o < a.length; o++) {
    const c = a[o];
    if (t[c] !== e[c]) return !1;
  }
  return !0;
}
function wi() {
  const t = window.location.pathname + window.location.search, e = wn.current();
  if (e && e.path != null) {
    const a = Jt(t);
    if (Jt(e.path).path === a.path && vi(e.query, a.query))
      return;
  }
  Ft(t, { historyAction: "skip" });
}
function Ei() {
  Ne || (Ne = !0, at(function() {
    document.addEventListener("click", yi), window.addEventListener("popstate", wi), me = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Ft(t, { historyAction: "replace", isHydration: !0 }), me = !1;
  }, "ln-router"));
}
function Ai(t) {
  const e = t.getAttribute(Ce);
  if (!e) return;
  const a = t.getAttribute("data-ln-route-target") || null;
  if (a === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const d = a || "__primary__";
  dt.has(d) || dt.set(d, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const o = dt.get(d);
  if (o.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${d}"`);
    return;
  }
  const c = t.getAttribute("data-ln-route-title"), s = e.split("/").filter(Boolean), n = {
    pattern: e,
    segments: s,
    target: a,
    title: c,
    templateNode: t
  }, h = ge(d);
  h && h.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), o.routes.set(e, n), o.sorted = Array.from(o.routes.values()).sort(Tn);
}
function Si(t) {
  const e = t.getAttribute(Ce);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", o = dt.get(d);
  o && (o.routes.delete(e), o.sorted = Array.from(o.routes.values()).sort(Tn), o.routes.size === 0 && dt.delete(d));
}
function xn(t) {
  return this.dom = t, Ai(t), this;
}
xn.prototype.destroy = function() {
  Si(this.dom), delete this.dom[En];
};
U(Ce, En, xn, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    dt.size > 0 && Ei();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  function a(o) {
    this.dom = o, this.isOpen = o.getAttribute(t) === "open";
    const c = this;
    return this._onRequestOpen = function() {
      c.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      c.dom.setAttribute(t, "close");
    }, this._onCancel = function(s) {
      s.preventDefault(), c.dom.setAttribute(t, "close");
    }, this._onClickClose = function(s) {
      const n = s.target.closest("[data-ln-modal-close]");
      n && c.dom.contains(n) && (s.preventDefault(), c.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  a.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, a.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, a.prototype.toggle = function() {
    const o = this.dom.getAttribute(t);
    this.dom.setAttribute(t, o === "open" ? "close" : "open");
  }, a.prototype.destroy = function() {
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
      C(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function d(o) {
    const c = o[e];
    if (!c) return;
    const n = o.getAttribute(t) === "open";
    if (n !== c.isOpen)
      if (n) {
        if (W(o, "ln-modal:before-open", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(t, "close");
          return;
        }
        c.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof o.showModal == "function" && o.showModal();
        const p = o.querySelector("[autofocus]");
        if (p && Mt(p))
          p.focus();
        else {
          const b = o.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), m = Array.prototype.find.call(b, Mt);
          if (m) m.focus();
          else {
            const g = o.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(g, Mt);
            _ && _.focus();
          }
        }
        C(o, "ln-modal:open", { modalId: o.id, target: o });
      } else {
        if (W(o, "ln-modal:before-close", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(t, "open");
          return;
        }
        c.isOpen = !1, C(o, "ln-modal:close", { modalId: o.id, target: o }), typeof o.close == "function" && o.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(t, e, a, "ln-modal", {
    onAttributeChange: d
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", a = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  function d(l) {
    const f = {};
    let v = l;
    const w = [];
    for (; v; ) {
      const u = v.closest("[" + t + "]");
      if (!u) break;
      u[e] && u[e].dict && w.unshift(u[e].dict), v = u.parentElement;
    }
    for (const u of w)
      Object.assign(f, u);
    return f;
  }
  function o(l, f) {
    if (f) {
      if (l) {
        const w = l.closest("[" + t + "]");
        if (w) {
          if (w.id === f && w.hasAttribute("data-ln-modal")) return w;
          const u = w.querySelector("#" + CSS.escape(f) + '[data-ln-modal], [data-ln-modal="' + f + '"]');
          if (u) return u;
        }
      }
      const v = document.getElementById(f) || document.querySelector('[data-ln-modal="' + f + '"]');
      if (v) return v;
    }
    if (l) {
      const v = l.closest("[" + t + "]");
      if (v) {
        if (v.hasAttribute("data-ln-modal")) return v;
        const u = v.querySelector("[data-ln-modal]");
        if (u) return u;
      }
      const w = l.closest("[data-ln-modal]");
      if (w) return w;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function c(l, f) {
    if (l !== "edit") return "";
    if (f) {
      const v = f.getAttribute("data-ln-fill-id");
      if (v) return v;
    }
    return "edit";
  }
  function s(l) {
    if (!l) return;
    const f = l.querySelectorAll("[data-ln-field]");
    for (let w = 0; w < f.length; w++)
      f[w].textContent = "";
    const v = l.querySelectorAll("form");
    for (let w = 0; w < v.length; w++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v[w], null) : v[w].reset();
  }
  document.addEventListener("click", function(l) {
    if (l.ctrlKey || l.metaKey || l.button === 1) return;
    const f = l.target.closest("[data-ln-modal-for]");
    if (f) {
      const w = f.getAttribute("data-ln-modal-for"), u = o(f, w);
      if (u && u.lnModal) {
        l.preventDefault();
        const y = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, E = {}, A = f.dataset;
        for (const x in A) {
          if (!x.startsWith("lnModal") || y[x]) continue;
          const I = x.slice(7);
          I && (E[I.charAt(0).toLowerCase() + I.slice(1)] = A[x]);
        }
        const L = Object.keys(E).length > 0;
        f.hasAttribute("data-ln-modal-mode") ? u.dataset.lnModalMode = f.getAttribute("data-ln-modal-mode") : u.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(u, E) : u.dataset.lnModalMode === "new" && s(u), u.getAttribute("data-ln-modal") === "open" ? C(u, "ln-modal:request-close", {}) : (u.id && nt(u.id, c(u.dataset.lnModalMode, f)), C(u, "ln-modal:request-open", {}));
      }
      return;
    }
    const v = l.target.closest('a[href^="#"]');
    if (v) {
      const w = ie(v.getAttribute("href"));
      for (const u in w) {
        const y = document.getElementById(u);
        if (y && y.lnModal) {
          if (!Ae(l)) return;
          nt(u, w[u]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(l) {
    const f = l.target;
    if (!f || !f.lnModal) return;
    (f.dataset.lnModalMode || "new") === "new" && s(f);
  }), document.addEventListener("ln-modal:open", function(l) {
    const f = l.target;
    if (!f || !f.lnModal || !f.id) return;
    let v = Y(f.id);
    v === null && (v = c(f.dataset.lnModalMode, null), nt(f.id, v)), v ? (f.dataset.lnModalMode = "edit", C(f, "ln-fill:request", { id: v })) : (f.dataset.lnModalMode = "new", s(f));
  });
  let n = !1;
  function h() {
    if (!n) {
      n = !0;
      try {
        const l = document.querySelectorAll("[data-ln-modal][id]");
        for (let f = 0; f < l.length; f++) {
          const v = l[f];
          if (!v.lnModal) continue;
          const w = v.id, u = Y(w), y = u !== null, E = v.lnModal.isOpen;
          if (y) {
            const A = u ? "edit" : "new";
            v.dataset.lnModalMode = A, E ? u ? C(v, "ln-fill:request", { id: u }) : s(v) : C(v, "ln-modal:request-open", {});
          } else E && C(v, "ln-modal:request-close", {});
        }
      } finally {
        n = !1;
      }
    }
  }
  function p() {
    const l = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let f = 0; f < l.length; f++) {
      const v = l[f];
      v.lnModal && Y(v.id) === null && nt(v.id, c(v.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", h);
  function b() {
    p(), h();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    rt(b);
  }) : rt(b);
  function m(l) {
    const v = (l.detail || {}).data;
    if (v && v.message) {
      const u = v.message;
      C(window, "ln-toast:enqueue", {
        type: u.type || "success",
        title: u.title || "",
        message: u.body || ""
      });
    }
    const w = l.target.closest("[data-ln-modal]");
    w && w.lnModal && (w.id && nt(w.id, null), C(w, "ln-modal:request-close", {}), s(w));
  }
  function g(l) {
    const f = l.detail || {}, v = f.data, w = f.status || 0, u = d(l.target);
    if (v && v.message) {
      const y = v.message;
      C(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else w === 0 ? C(window, "ln-toast:enqueue", {
      type: "error",
      title: u["network-error-title"] || "",
      message: u["network-error"] || "Network error"
    }) : C(window, "ln-toast:enqueue", {
      type: "error",
      title: u["server-error-title"] || "",
      message: u["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", m), document.addEventListener("ln-ajax:error", g);
  function _(l) {
    const f = l.detail || {}, v = d(l.target), w = f.message || (f.reason === "max-size" ? v["upload-max-size"] || "File is too large" : f.reason === "max-files" ? v["upload-max-files"] || "Maximum file count exceeded" : v["upload-invalid-type"] || "This file type is not allowed"), u = v["upload-invalid-title"] || "Invalid File";
    C(window, "ln-toast:enqueue", {
      type: "error",
      title: u,
      message: w
    });
  }
  function i(l) {
    const f = l.detail || {}, v = d(l.target), w = f.message || v["upload-failed"] || "Failed to upload file", u = v["upload-error-title"] || "Upload Error";
    C(window, "ln-toast:enqueue", {
      type: "error",
      title: u,
      message: w
    });
  }
  document.addEventListener("ln-upload:invalid", _), document.addEventListener("ln-upload:error", i), document.addEventListener("ln-modal:close", function(l) {
    const f = l.target;
    !f || !f.lnModal || (f.id && Y(f.id) !== null && nt(f.id, null), f.dataset.lnModalMode === "new" && s(f));
  });
  function r(l) {
    return this.dom = l, this.dict = Zt(l, a), this;
  }
  r.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, U(t, e, r, "ln-ui-coordinator");
})();
function Ci(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let a = e, d = 0;
  for (let o = 0; o < t.length && a > 0; o++)
    d = o + 1, /[0-9]/.test(t[o]) && a--;
  return a > 0 && (d = t.length), d;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  const a = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function d(o) {
    if (o[e]) return o[e];
    o[e] = this, this.dom = o;
    const c = this;
    if (this._onLocaleChange = function() {
      c.isTextElement ? c._formatTextContent() : isNaN(c.value) || c._displayFormatted(c.value);
    }, te(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const s = document.createElement("input");
    s.type = "hidden", s.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && s.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", s), this._hidden = s, Object.defineProperty(s, "value", {
      get: function() {
        return a.get.call(s);
      },
      set: function(h) {
        if (a.set.call(s, h), h !== "" && !isNaN(parseFloat(h))) {
          const p = c.dom.getAttribute("data-ln-number-decimals");
          c._setDisplayRaw(et(parseFloat(h), G(c.dom), { maxDecimals: p }));
        } else
          c._setDisplayRaw("");
        c.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), en(o, a, {
      get: function() {
        return a.get.call(o);
      },
      set: function(h) {
        if (h === "") {
          c._setDisplayRaw(""), c._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const p = typeof h == "number" ? h : Ut(String(h), G(o));
        if (isNaN(p))
          c._setDisplayRaw(String(h)), c._setHiddenRaw("");
        else {
          c._setHiddenRaw(p);
          const b = o.getAttribute("data-ln-number-decimals");
          c._setDisplayRaw(et(p, G(o), { maxDecimals: b }));
        }
        o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      c._handleInput();
    }, o.addEventListener("input", this._onInput), this._onKeyDown = function(h) {
      if (h.key !== "Backspace") return;
      const p = o.selectionStart, b = o.selectionEnd;
      if (p !== b || p === 0) return;
      const m = Xt(G(o)), g = a.get.call(o), _ = g[p - 1];
      if (_ === m.groupSep || /\s/.test(_)) {
        h.preventDefault();
        const i = p - 2 >= 0 ? p - 2 : 0, r = g.slice(0, i) + g.slice(p);
        a.set.call(o, r), o.setSelectionRange(i, i), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, o.addEventListener("keydown", this._onKeyDown), this._onPaste = function(h) {
      h.preventDefault();
      const p = (h.clipboardData || window.clipboardData).getData("text"), b = Ut(p, G(o));
      c.value = isNaN(b) ? NaN : b;
    }, o.addEventListener("paste", this._onPaste);
    const n = o.value;
    if (n !== "") {
      const h = Ut(n, G(o));
      if (!isNaN(h)) {
        const p = o.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(h), this._setDisplayRaw(et(h, G(o), { maxDecimals: p })), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  d.prototype._initTextElement = function() {
    const o = this.dom;
    let c = o.getAttribute("data-ln-value"), s = o.getAttribute("data-ln-number"), n = null;
    c !== null && c !== "" ? n = c : s !== null && s !== "" && s !== "true" ? n = s : n = o.textContent.trim();
    const h = Ut(n, G(o));
    isNaN(h) ? this._rawValue = null : (this._rawValue = h, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(h)), this._formatTextContent());
  }, d.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = et(this._rawValue, G(this.dom), { maxDecimals: o });
    }
  }, d.prototype._handleInput = function() {
    const o = this.dom, c = a.get.call(o);
    if (c === "") {
      this._setHiddenRaw(""), C(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (c === "-") {
      this._setHiddenRaw(""), C(o, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const s = o.selectionStart;
    let n = 0;
    for (let w = 0; w < s; w++)
      /[0-9]/.test(c[w]) && n++;
    const h = G(o), p = Xt(h);
    let b = c, m = bn(c, p.groupSep, p.decimalSep), g = parseFloat(m);
    if (isNaN(g)) {
      this._setHiddenRaw(""), C(o, "ln-number:input", { value: NaN, formatted: c });
      return;
    }
    const _ = o.getAttribute("data-ln-number-decimals"), i = m.indexOf(".");
    if (_ !== null && i !== -1) {
      const w = parseInt(_, 10), u = m.slice(i + 1);
      if (w === 0)
        m = m.slice(0, i), b = b.split(p.decimalSep)[0], g = parseFloat(m), this._setDisplayRaw(b);
      else if (u.length > w) {
        m = m.slice(0, i + 1 + w);
        const y = b.split(p.decimalSep);
        b = y[0] + p.decimalSep + y[1].slice(0, w), g = parseFloat(m), this._setDisplayRaw(b);
      }
    }
    const r = o.getAttribute("data-ln-number-max");
    if (r !== null && g > parseFloat(r)) {
      const w = parseFloat(r), u = et(w, h, { maxDecimals: _ });
      this._setDisplayRaw(u), this._setHiddenRaw(w), o.setSelectionRange(u.length, u.length), C(o, "ln-number:input", { value: w, formatted: u });
      return;
    }
    if (b.endsWith(p.decimalSep) || p.decimalSep !== "." && b.endsWith(".")) {
      this._setHiddenRaw(g), C(o, "ln-number:input", { value: g, formatted: b });
      return;
    }
    const l = m.indexOf(".");
    if (l !== -1 && m.slice(l + 1).endsWith("0")) {
      this._setHiddenRaw(g), C(o, "ln-number:input", { value: g, formatted: b });
      return;
    }
    let f;
    if (_ !== null)
      f = et(g, h, { maxDecimals: _ });
    else {
      const w = l !== -1 ? m.slice(l + 1).length : 0;
      f = et(g, h, { userDecimals: w });
    }
    this._setDisplayRaw(f);
    const v = Ci(f, n);
    o.setSelectionRange(v, v), this._setHiddenRaw(g), C(o, "ln-number:input", { value: g, formatted: f });
  }, d.prototype._setHiddenRaw = function(o) {
    this._hidden && a.set.call(this._hidden, String(o));
  }, d.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : a.set.call(this.dom, String(o));
  }, d.prototype._displayFormatted = function(o) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(et(o, G(this.dom), { maxDecimals: c }));
    }
  }, Object.defineProperty(d.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = a.get.call(this._hidden);
      return o === "" ? NaN : parseFloat(o);
    },
    set: function(o) {
      if (this.isTextElement) {
        typeof o != "number" || isNaN(o) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = o, this.dom.setAttribute("data-ln-value", String(o)), this._formatTextContent());
        return;
      }
      if (typeof o != "number" || isNaN(o)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(o);
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(et(o, G(this.dom), { maxDecimals: c })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(d.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : a.get.call(this.dom);
    }
  }), d.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), C(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, d, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const c = o[e];
      c && (c.isTextElement ? c._initTextElement() : isNaN(c.value) || c._displayFormatted(c.value));
    }
  });
})();
const _e = /^(short|medium|long)(\s+datetime)?$/, Li = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Ti(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(_e) ? Li[t.trim()] : null;
}
function zt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let a, d;
  if (e.indexOf(".") !== -1)
    a = ".", d = e.split(".");
  else if (e.indexOf("/") !== -1)
    a = "/", d = e.split("/");
  else if (e.indexOf("-") !== -1)
    a = "-", d = e.split("-");
  else
    return null;
  if (d.length !== 3) return null;
  const o = [];
  for (let p = 0; p < 3; p++) {
    const b = parseInt(d[p], 10);
    if (isNaN(b)) return null;
    o.push(b);
  }
  let c, s, n;
  a === "." ? (c = o[0], s = o[1], n = o[2]) : a === "/" ? (s = o[0], c = o[1], n = o[2]) : d[0].length === 4 ? (n = o[0], s = o[1], c = o[2]) : (c = o[0], s = o[1], n = o[2]), n < 100 && (n += n < 50 ? 2e3 : 1900);
  const h = new Date(n, s - 1, c);
  return h.getFullYear() !== n || h.getMonth() !== s - 1 || h.getDate() !== c ? null : h;
}
function de(t, e, a, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const o = t.getDate(), c = t.getMonth(), s = t.getFullYear(), n = t.getHours(), h = t.getMinutes();
  let p, b;
  const m = (a || "").toLowerCase().split("-")[0];
  let g = !1;
  try {
    const r = new Intl.DateTimeFormat(a, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    g = !!(d && r !== m);
  } catch {
    g = !!d;
  }
  if (g && d && d.monthsLong)
    p = d.monthsLong[c];
  else
    try {
      p = new Intl.DateTimeFormat(a, { month: "long" }).format(t);
    } catch {
      p = String(c + 1);
    }
  if (g && d && d.monthsShort)
    b = d.monthsShort[c];
  else
    try {
      b = new Intl.DateTimeFormat(a, { month: "short" }).format(t);
    } catch {
      b = String(c + 1);
    }
  const _ = {
    yyyy: String(s),
    yy: String(s).slice(-2),
    MMMM: p,
    MMM: b,
    MM: String(c + 1).padStart(2, "0"),
    M: String(c + 1),
    dd: String(o).padStart(2, "0"),
    d: String(o),
    HH: String(n).padStart(2, "0"),
    mm: String(h).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(i) {
    return _[i] !== void 0 ? _[i] : i;
  });
}
function Kt(t, e, a, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const o = Ti(e);
  if (o)
    try {
      const c = new Intl.DateTimeFormat(a, o), s = (a || "").toLowerCase().split("-")[0], n = c.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && n !== s ? de(t, "dd.MM.yyyy", a, d) : c.format(t);
    } catch {
      return de(t, "dd.MM.yyyy", a, d);
    }
  return de(t, e || "dd.MM.yyyy", a, d);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  const a = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function d(n, h, p) {
    C(n.dom, "ln-date:change", {
      value: h,
      formatted: n.dom.value,
      date: p
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function o(n, h, p, b) {
    n._setHiddenRaw(h), a.set.call(n._picker, h), n._lastISO = h, b !== void 0 ? (n._isFormatting = !0, n.dom.value = b, n._isFormatting = !1) : p && n._displayFormatted(p), d(n, h, p);
  }
  function c(n) {
    n._setHiddenRaw(""), a.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", d(n, "", null);
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const h = this;
    if (this._onLocaleChange = function() {
      if (h.isTextElement)
        h._formatTextContent();
      else if (h.value) {
        const l = J(h.value);
        l && h._displayFormatted(l);
      }
    }, te(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = n.value, b = n.name, m = n.closest(".form-element, form") || n.parentNode;
    if (m) {
      const l = m.querySelectorAll("[data-ln-date-dict]");
      for (let f = 0; f < l.length; f++) {
        const v = l[f].getAttribute("data-ln-date-dict");
        if (v) {
          const w = Zt(l[f], "data-ln-date-dict-key");
          w["months-long"] && (w.monthsLong = w["months-long"].split(",").map((u) => u.trim())), w["months-short"] && (w.monthsShort = w["months-short"].split(",").map((u) => u.trim())), Ee(v, w);
        }
      }
    }
    const g = document.createElement("span");
    g.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(g, n), g.appendChild(n), this._wrapper = g;
    const _ = document.createElement("input");
    _.type = "hidden", _.name = b, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && _.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", _), this._hidden = _;
    const i = document.createElement("input");
    i.type = "date", i.tabIndex = -1, i.setAttribute("tabindex", "-1"), i.setAttribute("aria-hidden", "true"), i.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), i.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", _.insertAdjacentElement("afterend", i), this._picker = i, n.type = "text";
    const r = document.createElement("button");
    if (r.type = "button", r.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), r.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', i.insertAdjacentElement("afterend", r), this._btn = r, this._lastISO = "", Object.defineProperty(_, "value", {
      get: function() {
        return a.get.call(_);
      },
      set: function(l) {
        if (a.set.call(_, l), l && l !== "") {
          const f = J(l);
          f && o(h, l, f);
        } else l === "" && c(h);
      }
    }), en(n, a, {
      get: function() {
        return a.get.call(n);
      },
      set: function(l, f) {
        if (h._isFormatting) {
          f(l);
          return;
        }
        if (!l || l === "") {
          f(""), c(h);
          return;
        }
        const v = J(l) || zt(l);
        if (v) {
          const w = kt(v), u = n.getAttribute(t) || "", y = G(n), E = yt(y), A = Kt(v, u, y, E);
          f(A), o(h, w, v, A);
        } else
          f(String(l)), c(h);
      }
    }), this._onPickerChange = function() {
      const l = i.value;
      if (l) {
        const f = J(l);
        f && o(h, l, f);
      } else
        c(h);
    }, i.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const l = h.dom.value.trim();
      if (l === "") {
        h._lastISO !== "" && c(h);
        return;
      }
      if (h._lastISO) {
        const v = J(h._lastISO);
        if (v) {
          const w = h.dom.getAttribute(t) || "", u = G(h.dom), y = yt(u);
          if (l === Kt(v, w, u, y)) return;
        }
      }
      const f = zt(l);
      if (f) {
        const v = kt(f);
        o(h, v, f);
      } else if (h._lastISO) {
        const v = J(h._lastISO);
        v && h._displayFormatted(v);
      } else
        h.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      h._openPicker();
    }, r.addEventListener("click", this._onBtnClick), p && p !== "") {
      const l = J(p);
      l && o(h, p, l);
    }
    return this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom, h = n.getAttribute("data-ln-value"), p = n.getAttribute("data-ln-date"), b = n.getAttribute("datetime");
    let m = null;
    h !== null && h !== "" ? m = h : b !== null && b !== "" ? m = b : p !== null && p !== "" && p !== "true" && !_e.test(p) ? m = p : m = n.textContent.trim();
    const g = J(m) || zt(m);
    if (g && !isNaN(g.getTime())) {
      const _ = kt(g);
      this._rawValue = _, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", _), this._formatTextContent();
    } else
      this._rawValue = null;
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = J(this._rawValue);
      if (n) {
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const g = this.dom.getAttribute("data-ln-date");
          g && _e.test(g) && (p = g);
        }
        const b = G(this.dom), m = yt(b);
        this.dom.textContent = Kt(n, p || "medium", b, m);
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
    a.set.call(this._hidden, n);
  }, s.prototype._displayFormatted = function(n) {
    const h = this.dom.getAttribute(t) || "", p = G(this.dom), b = yt(p);
    this._isFormatting = !0, this.dom.value = Kt(n, h, p, b), this._isFormatting = !1;
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : a.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const p = J(n) || zt(n);
        if (!p) return;
        const b = kt(p);
        this._rawValue = b, this.dom.setAttribute("data-ln-value", b), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        c(this);
        return;
      }
      const h = J(n);
      h && o(this, n, h);
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
      this.value = kt(n);
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, s, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const h = n[e];
      if (h) {
        if (h.isTextElement)
          h._initTextElement();
        else if (h.value) {
          const p = J(h.value);
          p && h._displayFormatted(p);
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const c = history.pushState;
    history.pushState = function() {
      c.apply(history, arguments);
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
  function a(c) {
    return this.dom = c, this.activeClass = c.getAttribute(t) || "active", this.exact = c.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(c, { childList: !0, subtree: !0 }), this.update(), this;
  }
  a.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, h = d(n), p = [];
    for (const b of s) {
      const m = b.getAttribute("href");
      if (!m || m === "#" || m.startsWith("#") || m.startsWith("javascript:") || m.startsWith("mailto:") || m.startsWith("tel:")) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      if (b.hostname && b.hostname !== window.location.hostname) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      const g = d(m), _ = g === h, i = !this.exact && g !== "/" && h.startsWith(g + "/");
      _ || i ? (b.classList.add(this.activeClass), b.setAttribute("aria-current", "page"), p.push(b)) : (b.classList.remove(this.activeClass), b.removeAttribute("aria-current"));
    }
    C(this.dom, "ln-nav:update", { target: this.dom, activeLinks: p });
  }, a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const c = history._lnNavCallbacks.indexOf(this.updateHandler);
    c !== -1 && history._lnNavCallbacks.splice(c, 1), C(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function d(c) {
    try {
      return new URL(c, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return c.replace(/\/$/, "") || "/";
    }
  }
  function o(c, s) {
    const n = c[e];
    if (n) {
      if (s === t) {
        if (!c.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const h = n.activeClass, p = c.getAttribute(t) || "active";
        if (h !== p) {
          const b = c.querySelectorAll("a");
          for (const m of b)
            h && m.classList.remove(h);
          n.activeClass = p;
        }
      } else s === "data-ln-nav-exact" && (n.exact = c.hasAttribute("data-ln-nav-exact"));
      n.update();
    }
  }
  U(t, e, a, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: o
  });
})();
function He(t, e, a, d) {
  const o = (t || "").toLowerCase().trim();
  if (o) return o;
  if ((e || "").toUpperCase() !== "A") return "";
  const c = a || "";
  if (!c.startsWith("#")) return "";
  const s = c.slice(1);
  if (!s) return "";
  const n = s.split("&"), h = (d || "").toLowerCase().trim();
  if (h)
    for (const m of n) {
      const g = m.indexOf(":");
      if (g > 0 && m.slice(0, g).toLowerCase().trim() === h)
        return m.slice(g + 1).toLowerCase().trim();
    }
  const p = n[n.length - 1] || "", b = p.indexOf(":");
  return (b > 0 ? p.slice(b + 1) : p).toLowerCase().trim();
}
function qi(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const a = t.filter(
    (c) => (c.tagName || "").toUpperCase() === "A" && (c.href || "").startsWith("#")
  ), d = a.length > 0 && a.length === t.length, o = (e || "").toLowerCase().trim();
  return a.length > 0 && a.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : d && !o ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: d && !!o,
    warning: null
  };
}
function xi(t, e, a) {
  const d = (t || "").toLowerCase().trim();
  return d && Array.isArray(e) && e.includes(d) ? d : (a || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function a(o) {
    return this.dom = o, this.activeKey = null, d.call(this), this;
  }
  function d() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const o = this.tabs.map((n) => ({
      tagName: n.tagName,
      href: n.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const c = qi(o, this.nsKey);
    this.hashEnabled = c.hashEnabled, c.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : c.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const h = He(n.getAttribute("data-ln-tab"), n.tagName, n.getAttribute("href"), this.nsKey);
      h ? this.mapTabs[h] = n : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', n);
    }
    for (const n of this.panels) {
      const h = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      h && (this.mapPanels[h] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[e + "Trigger"]) continue;
      const h = function(p) {
        const b = n.tagName === "A";
        if (!b && (p.ctrlKey || p.metaKey || p.button === 1)) return;
        const m = He(n.getAttribute("data-ln-tab"), n.tagName, n.getAttribute("href"), s.nsKey);
        m && (b && !Ae(p) || (s.hashEnabled ? Y(s.nsKey) === m ? s.dom.setAttribute("data-ln-tabs-active", m) : nt(s.nsKey, m) : s.dom.setAttribute("data-ln-tabs-active", m)));
      };
      n.addEventListener("click", h), n[e + "Trigger"] = h, s._clickHandlers.push({ el: n, handler: h });
    }
    if (this._onRequestSelect = function(n) {
      const h = n.detail && (n.detail.key || n.detail.tab);
      h && s.select(h);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const n = Y(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", n !== null ? n : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let n = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const h = Pt("tabs", this.dom);
        h !== null && h in this.mapPanels && (n = h);
      }
      this.dom.setAttribute("data-ln-tabs-active", n);
    }
  }
  a.prototype.select = function(o) {
    const c = (o + "").toLowerCase().trim();
    c && (this.hashEnabled ? Y(this.nsKey) === c ? this.dom.setAttribute("data-ln-tabs-active", c) : nt(this.nsKey, c) : this.dom.setAttribute("data-ln-tabs-active", c));
  }, a.prototype._applyActive = function(o) {
    var s;
    if (o = xi(o, Object.keys(this.mapPanels), this.defaultKey), o === this.activeKey) return;
    const c = this.activeKey;
    if (c !== null && W(this.dom, "ln-tabs:before-change", {
      key: o,
      previousKey: c,
      tab: this.mapTabs[o],
      panel: this.mapPanels[o],
      target: this.dom
    }).defaultPrevented) {
      c in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", c), this.hashEnabled && Y(this.nsKey) !== c && nt(this.nsKey, c));
      return;
    }
    this.activeKey = o;
    for (const n in this.mapTabs) {
      const h = this.mapTabs[n];
      n === o ? (h.setAttribute("data-active", ""), h.setAttribute("aria-selected", "true")) : (h.removeAttribute("data-active"), h.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const h = this.mapPanels[n], p = n === o;
      h.classList.toggle("hidden", !p), h.setAttribute("aria-hidden", p ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (s = this.mapPanels[o]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    C(this.dom, "ln-tabs:change", {
      key: o,
      previousKey: c,
      tab: this.mapTabs[o],
      panel: this.mapPanels[o],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && gt("tabs", this.dom, o);
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: o, handler: c } of this._clickHandlers)
        o.removeEventListener("click", c), delete o[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), C(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, a, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(o) {
      const c = o.getAttribute("data-ln-tabs-active");
      o[e]._applyActive(c);
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", a = "data-ln-toggle-for", d = "data-ln-toggle-action", o = "data-ln-persist";
  if (window[e] !== void 0) return;
  const c = /* @__PURE__ */ new Set();
  let s = null;
  function n(_, i) {
    return i === "open" ? "open" : i === "close" || _ === "open" ? "close" : "open";
  }
  function h() {
    s || (s = function(_) {
      if (Ye(_)) return;
      const i = _.target.closest("[" + a + "]");
      if (!i || Je(i)) return;
      const r = i.getAttribute(a);
      if (!r) return;
      const l = document.getElementById(r);
      if (!l || !l[e]) return;
      _.preventDefault();
      const f = i.getAttribute(d) || "toggle", v = l.getAttribute(t);
      l.setAttribute(t, n(v, f));
    }, document.addEventListener("click", s));
  }
  function p() {
    c.size > 0 || !s || (document.removeEventListener("click", s), s = null);
  }
  function b(_, i) {
    if (!_ || !_.id) return;
    const r = document.querySelectorAll(
      "[" + a + '="' + _.id + '"]'
    );
    for (let l = 0; l < r.length; l++)
      r[l].setAttribute("aria-expanded", i ? "true" : "false");
  }
  function m(_) {
    this.dom = _;
    const i = this;
    if (this._onRequestOpen = function() {
      i.open();
    }, this._onRequestClose = function() {
      i.close();
    }, this._onRequestToggle = function() {
      i.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), _.hasAttribute(o)) {
      const r = Pt("toggle", _);
      r !== null && _.setAttribute(t, r === "open" ? "open" : "close");
    }
    return this.isOpen = _.getAttribute(t) === "open", this.isOpen && _.classList.add("open"), b(_, this.isOpen), c.add(this), h(), this;
  }
  m.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, m.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, m.prototype.toggle = function() {
    const _ = this.dom.getAttribute(t);
    this.dom.setAttribute(t, n(_, "toggle"));
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), c.delete(this), delete this.dom[e], p(), C(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function g(_) {
    const i = _[e];
    if (!i) return;
    const l = _.getAttribute(t) === "open";
    if (l !== i.isOpen)
      if (l) {
        if (W(_, "ln-toggle:before-open", { target: _ }).defaultPrevented) {
          _.setAttribute(t, "close");
          return;
        }
        i.isOpen = !0, _.classList.add("open"), b(_, !0), C(_, "ln-toggle:open", { target: _ }), _.hasAttribute(o) && gt("toggle", _, "open");
      } else {
        if (W(_, "ln-toggle:before-close", { target: _ }).defaultPrevented) {
          _.setAttribute(t, "open");
          return;
        }
        i.isOpen = !1, _.classList.remove("open"), b(_, !1), C(_, "ln-toggle:close", { target: _ }), _.hasAttribute(o) && gt("toggle", _, "close");
      }
  }
  U(t, e, m, "ln-toggle", {
    onAttributeChange: g
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  function a(d) {
    return this.dom = d, this._onToggleOpen = function(o) {
      if (o.detail.target.closest("[data-ln-accordion]") !== d) return;
      const c = d.querySelectorAll("[data-ln-toggle]");
      for (const s of c)
        s !== o.detail.target && s.closest("[data-ln-accordion]") === d && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      C(d, "ln-accordion:change", { target: o.detail.target });
    }, d.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), C(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, a, "ln-accordion");
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", a = "data-ln-dropdown-position", d = "data-ln-dropdown-placement", o = "bottom-end";
  if (window[e] !== void 0) return;
  function c(s) {
    this.dom = s, this.toggleEl = s.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = s.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const n = this;
    return this._onRequestOpen = function() {
      n.toggleEl && n.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      n.toggleEl && n.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (n.toggleEl) {
        const h = n.toggleEl.getAttribute("data-ln-toggle");
        n.toggleEl.setAttribute("data-ln-toggle", h === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(h) {
      const p = n.toggleEl && n.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (h.key === "Escape") {
        p && (h.preventDefault(), h.stopPropagation(), n.toggleEl.setAttribute("data-ln-toggle", "close"), n.triggerBtn && n.triggerBtn.focus());
        return;
      }
      if (h.key === "Tab") {
        p && (n.triggerBtn && n.triggerBtn.focus(), n.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const b = n._getMenuItems();
      if (b.length === 0) return;
      if (!p && (h.key === "ArrowDown" || h.key === "ArrowUp")) {
        h.preventDefault(), n.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const g = n._getMenuItems();
          g.length > 0 && n._focusItem(g, h.key === "ArrowDown" ? 0 : g.length - 1);
        }, 0);
        return;
      }
      if (!p) return;
      const m = b.indexOf(document.activeElement);
      if (h.key === "ArrowDown") {
        h.preventDefault();
        const g = m < b.length - 1 ? m + 1 : 0;
        n._focusItem(b, g);
      } else if (h.key === "ArrowUp") {
        h.preventDefault();
        const g = m > 0 ? m - 1 : b.length - 1;
        n._focusItem(b, g);
      } else h.key === "Home" ? (h.preventDefault(), n._focusItem(b, 0)) : h.key === "End" && (h.preventDefault(), n._focusItem(b, b.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(h) {
      !h.detail || h.detail.target !== n.toggleEl || (n.triggerBtn && n.triggerBtn.setAttribute("aria-expanded", "true"), typeof n.toggleEl.showPopover == "function" && n.toggleEl.showPopover(), n._initMenuAria(), n._reposition(), n._addOutsideClickListener(), n._addScrollRepositionListener(), n._addResizeCloseListener(), C(s, "ln-dropdown:open", { target: h.detail.target }));
    }, this._onToggleClose = function(h) {
      !h.detail || h.detail.target !== n.toggleEl || (n.triggerBtn && n.triggerBtn.setAttribute("aria-expanded", "false"), n._removeOutsideClickListener(), n._removeScrollRepositionListener(), n._removeResizeCloseListener(), n.toggleEl.style.top = "", n.toggleEl.style.left = "", n.toggleEl.removeAttribute(d), typeof n.toggleEl.hidePopover == "function" && n.toggleEl.matches(":popover-open") && n.toggleEl.hidePopover(), C(s, "ln-dropdown:close", { target: h.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  c.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const s = this.toggleEl.querySelectorAll("li");
    for (const h of s)
      h.setAttribute("role", "none");
    const n = this._getMenuItems();
    for (let h = 0; h < n.length; h++)
      n[h].setAttribute("role", "menuitem"), n[h].setAttribute("tabindex", h === 0 ? "0" : "-1");
  }, c.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, c.prototype._focusItem = function(s, n) {
    for (let h = 0; h < s.length; h++)
      s[h].setAttribute("tabindex", h === n ? "0" : "-1");
    s[n] && s[n].focus();
  }, c.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const s = this.triggerBtn.getBoundingClientRect(), n = pe(this.toggleEl), h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, p = this.dom.getAttribute(a) || o, b = $t(s, n, p, h);
    this.toggleEl.style.top = b.top + "px", this.toggleEl.style.left = b.left + "px", this.toggleEl.setAttribute(d, b.placement);
  }, c.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const s = this;
    this._boundDocClick = function(n) {
      s.dom.contains(n.target) || s.toggleEl && s.toggleEl.contains(n.target) || s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0);
  }, c.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, c.prototype._addScrollRepositionListener = function() {
    const s = this;
    this._boundScrollReposition = function() {
      s._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, c.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, c.prototype._addResizeCloseListener = function() {
    const s = this;
    this._boundResizeClose = function() {
      s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open" && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, c.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(d), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), C(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, c, "ln-dropdown");
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", a = "data-ln-popover-for", d = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const o = [];
  let c = null;
  function s() {
    c || (c = function(b) {
      if (b.key !== "Escape" || o.length === 0) return;
      o[o.length - 1].close();
    }, document.addEventListener("keydown", c));
  }
  function n() {
    o.length > 0 || c && (document.removeEventListener("keydown", c), c = null);
  }
  function h(b) {
    this.dom = b, this.isOpen = b.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const m = this;
    return this._onRequestOpen = function(g) {
      const _ = g.detail && g.detail.trigger ? g.detail.trigger : null;
      m.open(_);
    }, this._onRequestClose = function() {
      m.close();
    }, this._onRequestToggle = function(g) {
      const _ = g.detail && g.detail.trigger ? g.detail.trigger : null;
      m.toggle(_);
    }, b.addEventListener("ln-popover:request-open", this._onRequestOpen), b.addEventListener("ln-popover:request-close", this._onRequestClose), b.addEventListener("ln-popover:request-toggle", this._onRequestToggle), b.hasAttribute("tabindex") || b.setAttribute("tabindex", "-1"), b.hasAttribute("role") || b.setAttribute("role", "dialog"), b.hasAttribute("popover") || b.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  h.prototype.open = function(b) {
    this.isOpen || (this.trigger = b || null, this.dom.setAttribute(t, "open"));
  }, h.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, h.prototype.toggle = function(b) {
    this.isOpen ? this.close() : this.open(b);
  }, h.prototype._applyOpen = function(b) {
    this.isOpen = !0, b && (this.trigger = b), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const m = pe(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), l = this.dom.getAttribute(d) || "bottom", f = $t(r, m, l, 8);
      this.dom.style.top = f.top + "px", this.dom.style.left = f.left + "px", this.dom.setAttribute("data-ln-popover-placement", f.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const g = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), _ = Array.prototype.find.call(g, Mt);
    _ ? _.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(r) {
      i.dom.contains(r.target) || i.trigger && i.trigger.contains(r.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const r = i.trigger.getBoundingClientRect(), l = pe(i.dom), f = i.dom.getAttribute(d) || "bottom", v = $t(r, l, f, 8);
      i.dom.style.top = v.top + "px", i.dom.style.left = v.left + "px", i.dom.setAttribute("data-ln-popover-placement", v.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), o.push(this), s(), C(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, h.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const b = o.indexOf(this);
    b !== -1 && o.splice(b, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, C(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], C(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function p(b) {
    this.dom = b;
    const m = b.getAttribute(a);
    return b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-expanded", "false"), b.setAttribute("aria-controls", m), this._onClick = function(g) {
      if (g.ctrlKey || g.metaKey || g.button === 1) return;
      g.preventDefault();
      const _ = document.getElementById(m);
      if (!_) return;
      _[e] && (_[e].trigger = b);
      const i = _.getAttribute(t);
      _.setAttribute(t, i === "open" ? "closed" : "open");
    }, b.addEventListener("click", this._onClick), this;
  }
  p.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  }, U(t, e, h, "ln-popover", {
    onAttributeChange: function(b) {
      const m = b[e];
      if (!m) return;
      const _ = b.getAttribute(t) === "open";
      if (_ !== m.isOpen)
        if (_) {
          if (W(b, "ln-popover:before-open", {
            popoverId: b.id,
            target: b,
            trigger: m.trigger
          }).defaultPrevented) {
            b.setAttribute(t, "closed");
            return;
          }
          m._applyOpen(m.trigger);
        } else {
          if (W(b, "ln-popover:before-close", {
            popoverId: b.id,
            target: b,
            trigger: m.trigger
          }).defaultPrevented) {
            b.setAttribute(t, "open");
            return;
          }
          m._applyClose();
        }
    }
  }), U(a, e + "Trigger", p, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", a = "data-ln-tooltip-position", d = "lnTooltipEnhance", o = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  let c = 0, s = null, n = null, h = null, p = null, b = null, m = null;
  function g() {
    return s && s.parentNode || (s = document.getElementById(o), s || (s = document.createElement("div"), s.id = o, document.body.appendChild(s)), s.hasAttribute("popover") || s.setAttribute("popover", "manual")), s;
  }
  function _() {
    m || (m = function(v) {
      v.key === "Escape" && l();
    }, document.addEventListener("keydown", m));
  }
  function i() {
    m && (document.removeEventListener("keydown", m), m = null);
  }
  function r(v) {
    if (h === v) return;
    l();
    const w = v.getAttribute(e) || v.getAttribute("title");
    if (!w) return;
    g(), typeof s.showPopover == "function" && s.showPopover(), v.hasAttribute("title") && (p = v.getAttribute("title"), v.removeAttribute("title"));
    const u = v.getAttribute("aria-describedby");
    u ? b = u : b = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = w, v[d + "Uid"] || (c += 1, v[d + "Uid"] = "ln-tooltip-" + c), y.id = v[d + "Uid"], s.appendChild(y);
    const E = y.offsetWidth, A = y.offsetHeight, L = v.getBoundingClientRect(), T = v.getAttribute(a) || "top", x = $t(L, { width: E, height: A }, T, 6);
    y.style.top = x.top + "px", y.style.left = x.left + "px", y.setAttribute("data-ln-tooltip-placement", x.placement), b ? v.setAttribute("aria-describedby", b + " " + y.id) : v.setAttribute("aria-describedby", y.id), n = y, h = v, _();
  }
  function l() {
    if (!n) {
      i();
      return;
    }
    h && (b !== null ? h.setAttribute("aria-describedby", b) : h.removeAttribute("aria-describedby"), b = null, p !== null && h.setAttribute("title", p)), p = null, n.parentNode && n.parentNode.removeChild(n), n = null, h = null, s && typeof s.hidePopover == "function" && s.matches(":popover-open") && s.hidePopover(), i();
  }
  function f(v) {
    return this.dom = v, v.hasAttribute("data-ln-tooltip-enhanced") || (v.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(v);
    }, this._onLeave = function() {
      h === v && !v.contains(document.activeElement) && l();
    }, this._onFocus = function() {
      r(v);
    }, this._onBlur = function() {
      h === v && !v.matches(":hover") && l();
    }, v.addEventListener("mouseenter", this._onEnter), v.addEventListener("mouseleave", this._onLeave), v.addEventListener("focus", this._onFocus, !0), v.addEventListener("blur", this._onBlur, !0), this;
  }
  f.prototype.destroy = function() {
    const v = this.dom;
    v.removeEventListener("mouseenter", this._onEnter), v.removeEventListener("mouseleave", this._onLeave), v.removeEventListener("focus", this._onFocus, !0), v.removeEventListener("blur", this._onBlur, !0), h === v && l(), this._addedEnhancedAttr && v.removeAttribute("data-ln-tooltip-enhanced"), delete v[d], delete v[d + "Uid"], C(v, "ln-tooltip:destroyed", { trigger: v });
  }, U(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    f,
    "ln-tooltip"
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", a = "ln-toast-item";
  if (window[e] !== void 0) return;
  function d(i) {
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
  function c(i) {
    this.dom = i, this.timeoutDefault = +(i.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(i.getAttribute("data-ln-toast-max") ?? 5);
    const r = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length > this.max; ) i.removeChild(r.shift());
    for (const l of r) m(l, this);
    return r.length > 0 && d(i), this;
  }
  c.prototype.enqueue = function(i) {
    if (!i) return;
    const r = s(i, this.dom);
    if (!r) return;
    const l = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    h(this, r), l > 0 && (r._timer = setTimeout(() => p(r), l));
  }, c.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      p(i);
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        p(i);
      o(this.dom), C(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function s(i, r) {
    const l = ((i.type || "") + "").trim().toLowerCase(), f = mt(r, a, "ln-toast");
    if (!f)
      return console.warn('[ln-toast] Template "' + a + '" not found'), null;
    st(f, {
      type: l,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const v = f.firstElementChild;
    if (!v) return null;
    v.hasAttribute("data-ln-toast-item") || v.setAttribute("data-ln-toast-item", ""), v.classList.add("ln-enter");
    const w = v.querySelector(".body");
    w && n(w, i);
    const u = v.querySelector("[data-ln-toast-close]");
    return u && u.addEventListener("click", function() {
      p(v);
    }), v;
  }
  function n(i, r) {
    if (Array.isArray(r.message)) {
      const l = document.createElement("ul");
      for (const f of r.message) {
        const v = document.createElement("li");
        v.textContent = f, l.appendChild(v);
      }
      i.appendChild(l);
    }
    if (r.data && r.data.errors) {
      const l = document.createElement("ul");
      for (const f of Object.values(r.data.errors).flat()) {
        const v = document.createElement("li");
        v.textContent = f, l.appendChild(v);
      }
      i.appendChild(l);
    }
  }
  function h(i, r) {
    const l = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; l.length >= i.max && l.length > 0; ) i.dom.removeChild(l.shift());
    i.dom.appendChild(r), d(i.dom), requestAnimationFrame(() => r.classList.remove("ln-enter"));
  }
  function p(i) {
    if (!i || !i.parentNode) return;
    const r = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), o(r));
    }, 200);
  }
  function b(i) {
    let r = i && i.container;
    return typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), r || null;
  }
  function m(i, r) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const l = i.querySelector("[data-ln-toast-close]");
    l && l.addEventListener("click", function() {
      p(i);
    });
    const f = +(i.getAttribute("data-ln-toast-timeout") ?? r.timeoutDefault);
    f > 0 && (i._timer = setTimeout(function() {
      p(i);
    }, f));
  }
  function g(i) {
    const r = i.detail || {}, l = b(r);
    if (!l) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (l[e] || (l[e] = new c(l))).enqueue(r);
  }
  function _(i) {
    const r = i && i.detail || {};
    if (r.container) {
      const l = b(r);
      l && (l[e] || (l[e] = new c(l))).clear();
    } else {
      const l = document.querySelectorAll("[" + t + "]");
      for (const f of Array.from(l))
        (f[e] || (f[e] = new c(f))).clear();
    }
  }
  at(function() {
    window.addEventListener("ln-toast:enqueue", g), window.addEventListener("ln-toast:clear", _), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + t + "]");
      for (const r of Array.from(i))
        r.querySelectorAll("[data-ln-toast-item]").length > 0 && d(r);
    });
  }, "ln-toast"), U(t, e, c, "ln-toast");
})();
function ki(t) {
  if (!t) return null;
  const e = String(t).split(",").map((a) => a.trim().toLowerCase()).filter(Boolean).map((a) => a.startsWith(".") ? a.slice(1) : a);
  return e.length ? e : null;
}
function kn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Ii(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const a = kn(t.name), d = String(t.type || "").toLowerCase();
  return e.some((o) => {
    if (o.includes("/")) {
      if (o.endsWith("/*")) {
        const c = o.slice(0, -1);
        return d.startsWith(c);
      }
      return d === o;
    }
    return a === o;
  });
}
function Di(t, e = "en", a = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (a["unit-b"] || "B");
  const d = 1024, o = [
    a["unit-b"] || "B",
    a["unit-kb"] || "KB",
    a["unit-mb"] || "MB",
    a["unit-gb"] || "GB"
  ], c = Math.floor(Math.log(t) / Math.log(d)), s = Math.min(c, o.length - 1), n = t / Math.pow(d, s);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(n) + " " + o[s];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", a = "data-ln-upload-dict", d = "data-ln-upload-accept", o = "data-ln-upload-delete", c = "data-ln-upload-max-size", s = "data-ln-upload-max-files", n = "data-ln-upload-file-field", h = "data-ln-upload-ids-field", p = "file", b = "file_ids[]";
  if (window[e] !== void 0) return;
  function m(i, r, l) {
    return Di(i, r, l);
  }
  function g() {
    const i = document.querySelector('meta[name="csrf-token"]');
    return i ? i.getAttribute("content") : "";
  }
  function _(i) {
    this.dom = i, this.dict = Zt(i, a), this.locale = G(i), this.zone = i.querySelector("[data-ln-upload-zone]") || i, this.list = i.querySelector("[data-ln-upload-list]"), this.input = i.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', i), this.uploadUrl = i.getAttribute(t) || "", this.deleteUrlPattern = i.getAttribute(o) || "", this.fileFieldName = i.getAttribute(n) || p, this.idsFieldName = i.getAttribute(h) || b, this.maxSize = +i.getAttribute(c) || 0, this.maxFiles = +i.getAttribute(s) || 0;
    const r = i.getAttribute(d) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = ki(r), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  _.prototype._hydrate = function() {
    const i = this;
    if (!this.list) return;
    const r = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let f = 0; f < r.length; f++) {
      const v = r[f], w = v.getAttribute("data-ln-upload-id"), u = "file-" + ++i.fileIdCounter;
      v.setAttribute("data-ln-upload-local-id", u);
      const y = v.querySelector('[data-ln-field="name"]'), E = v.querySelector('[data-ln-field="sizeText"]'), A = v.getAttribute("data-ln-upload-size"), L = A ? parseInt(A, 10) : null;
      i.uploadedFiles.set(u, {
        serverId: w || null,
        name: y ? y.textContent.trim() : "",
        size: L !== null && !isNaN(L) ? L : E ? E.textContent.trim() : ""
      });
    }
    const l = this.dom.querySelectorAll('input[type="hidden"]');
    for (let f = 0; f < l.length; f++) {
      const v = l[f];
      if (v.name === i.idsFieldName && v.value && !Array.from(i.uploadedFiles.values()).some(function(u) {
        return String(u.serverId) === String(v.value);
      })) {
        const u = "file-" + ++i.fileIdCounter;
        i.uploadedFiles.set(u, {
          serverId: v.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, _.prototype._syncHiddenInputs = function() {
    const i = this, r = this.dom.querySelectorAll('input[type="hidden"]');
    for (let l = 0; l < r.length; l++)
      r[l].name === i.idsFieldName && r[l].remove();
    for (const [, l] of this.uploadedFiles)
      if (l.serverId) {
        const f = document.createElement("input");
        f.type = "hidden", f.name = i.idsFieldName, f.value = l.serverId, i.dom.appendChild(f);
      }
  }, _.prototype._bindEvents = function() {
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
      const l = r.target.closest('[data-ln-upload-action="remove"]');
      if (!l || !i.list || !i.list.contains(l) || l.disabled) return;
      const f = l.closest("[data-ln-upload-item]");
      if (f) {
        const v = f.getAttribute("data-ln-upload-local-id");
        v && i.remove(v);
      }
    }, this._onRequestUpload = function(r) {
      r.detail && r.detail.files && i.upload(r.detail.files);
    }, this._onRequestRemove = function(r) {
      if (r.detail) {
        const l = r.detail.localId !== void 0 ? r.detail.localId : r.detail.serverId;
        l !== void 0 && i.remove(l);
      }
    }, this._onRequestClear = function() {
      i.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, _.prototype.upload = function(i) {
    const r = this, l = Array.from(i);
    for (let f = 0; f < l.length; f++) {
      const v = l[f];
      if (r.maxFiles > 0 && r.uploadedFiles.size >= r.maxFiles) {
        C(r.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-files"
        });
        continue;
      }
      if (!Ii(v, r.allowedExts)) {
        C(r.dom, "ln-upload:invalid", {
          file: v,
          reason: "accept"
        });
        continue;
      }
      if (r.maxSize > 0 && v.size > r.maxSize) {
        C(r.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-size"
        });
        continue;
      }
      W(r.dom, "ln-upload:before-upload", { file: v }).defaultPrevented || r._uploadSingleFile(v);
    }
  }, _.prototype._uploadSingleFile = function(i) {
    const r = this, l = "file-" + ++r.fileIdCounter, f = kn(i.name);
    let v = null;
    if (this.list) {
      const A = mt(this.dom, "ln-upload-item", "ln-upload");
      if (A && (v = A.firstElementChild, v)) {
        v.setAttribute("data-ln-upload-item", ""), v.setAttribute("data-ln-upload-local-id", l), v.setAttribute("data-ln-upload-ext", f), v.setAttribute("data-ln-upload-state", "uploading"), st(v, {
          name: i.name,
          sizeText: "0%",
          removeLabel: r.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const L = v.querySelector('[data-ln-upload-action="remove"]');
        L && (L.disabled = !0);
        const T = v.querySelector("[data-ln-progress]");
        T && T.setAttribute("data-ln-progress", "0"), r.list.appendChild(v);
      }
    }
    const w = new FormData();
    w.append(r.fileFieldName, i);
    const u = this.dom.querySelectorAll("input, select, textarea");
    for (let A = 0; A < u.length; A++) {
      const L = u[A];
      !L.name || L.name === r.idsFieldName || L.type === "file" || (L.type === "checkbox" || L.type === "radio") && !L.checked || w.append(L.name, L.value);
    }
    const y = new XMLHttpRequest();
    r.uploadedFiles.set(l, {
      serverId: null,
      name: i.name,
      size: i.size,
      xhr: y
    }), y.upload.addEventListener("progress", function(A) {
      if (A.lengthComputable) {
        const L = Math.round(A.loaded / A.total * 100);
        if (v) {
          const T = v.querySelector("[data-ln-progress]");
          T && T.setAttribute("data-ln-progress", String(L)), st(v, { sizeText: L + "%" });
        }
        C(r.dom, "ln-upload:progress", {
          localId: l,
          file: i,
          percent: L,
          loaded: A.loaded,
          total: A.total
        });
      }
    }), y.addEventListener("load", function() {
      const A = r.uploadedFiles.get(l);
      if (A && delete A.xhr, y.status >= 200 && y.status < 300) {
        let L;
        try {
          L = JSON.parse(y.responseText);
        } catch (x) {
          E(r.dict.error || "Error", y.status, x);
          return;
        }
        const T = L.id || L.serverId;
        if (v) {
          v.removeAttribute("data-ln-upload-state"), T && v.setAttribute("data-ln-upload-id", String(T)), st(v, {
            sizeText: m(L.size || i.size, r.locale, r.dict),
            uploading: !1
          });
          const x = v.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        A && (A.serverId = T, A.size = L.size || i.size, A.name = L.name || i.name), r._syncHiddenInputs(), C(r.dom, "ln-upload:uploaded", {
          localId: l,
          serverId: T,
          name: L.name || i.name,
          size: L.size || i.size,
          response: L
        });
      } else {
        let L = "";
        try {
          L = JSON.parse(y.responseText).message || "";
        } catch {
        }
        E(L, y.status, null);
      }
    }), y.addEventListener("error", function() {
      const A = r.uploadedFiles.get(l);
      A && delete A.xhr, E("", 0, null);
    });
    function E(A, L, T) {
      if (v) {
        v.setAttribute("data-ln-upload-state", "error"), st(v, {
          sizeText: r.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = v.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      C(r.dom, "ln-upload:error", {
        file: i,
        message: A,
        status: L,
        error: T
      });
    }
    r.uploadUrl ? (y.open("POST", r.uploadUrl), y.setRequestHeader("X-CSRF-TOKEN", g()), y.setRequestHeader("X-Requested-With", "XMLHttpRequest"), y.setRequestHeader("Accept", "application/json"), y.send(w)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, _.prototype.remove = function(i) {
    const r = this;
    let l = null, f = null;
    if (r.uploadedFiles.has(i))
      l = i, f = r.uploadedFiles.get(i);
    else
      for (const [y, E] of r.uploadedFiles)
        if (String(E.serverId) === String(i)) {
          l = y, f = E;
          break;
        }
    if (!l || !f || W(r.dom, "ln-upload:before-remove", {
      localId: l,
      serverId: f.serverId
    }).defaultPrevented) return;
    const w = r.list ? r.list.querySelector('[data-ln-upload-local-id="' + l + '"]') : null;
    if (f.xhr && typeof f.xhr.abort == "function" && f.xhr.abort(), !f.serverId) {
      w && w.remove(), r.uploadedFiles.delete(l), r._syncHiddenInputs(), C(r.dom, "ln-upload:removed", { localId: l, serverId: null });
      return;
    }
    let u = null;
    if (r.deleteUrlPattern ? u = r.deleteUrlPattern.replace("{id}", encodeURIComponent(f.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (u = r.uploadUrl.replace("{id}", encodeURIComponent(f.serverId))), !u) {
      w && w.remove(), r.uploadedFiles.delete(l), r._syncHiddenInputs(), C(r.dom, "ln-upload:removed", { localId: l, serverId: f.serverId });
      return;
    }
    w && (w.setAttribute("data-ln-upload-state", "deleting"), st(w, { deleting: !0 })), fetch(u, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": g(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(y) {
      y.ok ? (w && w.remove(), r.uploadedFiles.delete(l), r._syncHiddenInputs(), C(r.dom, "ln-upload:removed", {
        localId: l,
        serverId: f.serverId
      })) : (w && (w.removeAttribute("data-ln-upload-state"), st(w, { deleting: !1 })), C(r.dom, "ln-upload:error", {
        file: f,
        message: "",
        status: y.status
      }));
    }).catch(function(y) {
      w && (w.removeAttribute("data-ln-upload-state"), st(w, { deleting: !1 })), C(r.dom, "ln-upload:error", {
        file: f,
        message: "",
        status: 0,
        error: y
      });
    });
  }, _.prototype.clear = function() {
    const i = this;
    if (!W(i.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, l] of this.uploadedFiles)
        if (l.xhr && typeof l.xhr.abort == "function" && l.xhr.abort(), l.serverId) {
          let f = null;
          i.deleteUrlPattern ? f = i.deleteUrlPattern.replace("{id}", encodeURIComponent(l.serverId)) : i.uploadUrl && i.uploadUrl.includes("{id}") && (f = i.uploadUrl.replace("{id}", encodeURIComponent(l.serverId))), f && fetch(f, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": g(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      i.uploadedFiles.clear(), i.list && (i.list.innerHTML = ""), i._syncHiddenInputs(), C(i.dom, "ln-upload:cleared", {});
    }
  }, _.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return i.serverId;
    }).filter(Boolean);
  }, _.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(i) {
      return {
        serverId: i.serverId,
        name: i.name,
        size: i.size
      };
    });
  }, _.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, i] of this.uploadedFiles)
        i.xhr && typeof i.xhr.abort == "function" && i.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, C(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, _, "ln-upload");
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function a(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !e(n)) return;
    n.target = "_blank";
    const h = (n.rel || "").split(/\s+/).filter(Boolean);
    h.includes("noopener") || h.push("noopener"), h.includes("noreferrer") || h.push("noreferrer"), n.rel = h.join(" ");
    const p = document.createElement("span");
    p.className = "sr-only", p.textContent = "(opens in new tab)", n.appendChild(p), n.setAttribute("data-ln-external-link", "processed"), C(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function d(n) {
    n = n || document.body;
    for (const h of n.querySelectorAll("a, area"))
      a(h);
  }
  function o() {
    at(function() {
      document.body.addEventListener("click", function(n) {
        const h = n.target.closest("a, area");
        h && h.getAttribute("data-ln-external-link") === "processed" && C(h, "ln-external-links:clicked", {
          link: h,
          href: h.href,
          text: h.textContent || h.title || ""
        });
      });
    }, "ln-external-links");
  }
  function c() {
    at(function() {
      new MutationObserver(function(h) {
        for (const p of h)
          if (p.type === "childList") {
            for (const b of p.addedNodes)
              if (b.nodeType === 1 && (b.matches && (b.matches("a") || b.matches("area")) && a(b), b.querySelectorAll))
                for (const m of b.querySelectorAll("a, area"))
                  a(m);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), ee(["href"], function(h) {
        h.matches && (h.matches("a") || h.matches("area")) && a(h);
      });
    }, "ln-external-links");
  }
  function s() {
    o(), c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
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
  let a = null;
  function d() {
    a = document.createElement("div"), a.className = "ln-link-status", document.body.appendChild(a);
  }
  function o(f) {
    a && (a.textContent = f, a.classList.add("ln-link-status--visible"));
  }
  function c() {
    a && a.classList.remove("ln-link-status--visible");
  }
  function s(f, v) {
    if (v.target.closest("a, button, input, select, textarea")) return;
    const w = f.querySelector("a");
    if (!w) return;
    const u = w.getAttribute("href");
    if (!u) return;
    if (v.ctrlKey || v.metaKey || v.button === 1) {
      window.open(u, "_blank", "noopener,noreferrer");
      return;
    }
    W(f, "ln-link:navigate", { target: f, href: u, link: w }).defaultPrevented || w.click();
  }
  function n(f) {
    const v = f.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    w && o(w);
  }
  function h() {
    c();
  }
  function p(f) {
    f[e + "Row"] || !f.querySelector("a") || (f[e + "Row"] = !0, f._lnLinkClick = function(w) {
      s(f, w);
    }, f._lnLinkEnter = function() {
      n(f);
    }, f.addEventListener("click", f._lnLinkClick), f.addEventListener("mouseenter", f._lnLinkEnter), f.addEventListener("mouseleave", h));
  }
  function b(f) {
    f[e + "Row"] && (f._lnLinkClick && f.removeEventListener("click", f._lnLinkClick), f._lnLinkEnter && f.removeEventListener("mouseenter", f._lnLinkEnter), f.removeEventListener("mouseleave", h), delete f._lnLinkClick, delete f._lnLinkEnter, delete f[e + "Row"]);
  }
  function m(f) {
    if (!f[e + "Init"]) return;
    const v = f.tagName;
    if (v === "TABLE" || v === "TBODY") {
      const w = v === "TABLE" && f.querySelector("tbody") || f;
      for (const u of w.querySelectorAll("tr"))
        b(u);
    } else
      b(f);
    delete f[e + "Init"];
  }
  function g(f) {
    if (f[e + "Init"]) return;
    f[e + "Init"] = !0;
    const v = f.tagName;
    if (v === "TABLE" || v === "TBODY") {
      const w = v === "TABLE" && f.querySelector("tbody") || f;
      for (const u of w.querySelectorAll("tr"))
        p(u);
    } else
      p(f);
  }
  function _(f) {
    f.hasAttribute && f.hasAttribute(t) && g(f);
    const v = f.querySelectorAll ? f.querySelectorAll("[" + t + "]") : [];
    for (const w of v)
      g(w);
  }
  function i() {
    at(function() {
      new MutationObserver(function(v) {
        for (const w of v)
          if (w.type === "childList") {
            for (const u of w.addedNodes)
              if (u.nodeType === 1) {
                _(u);
                const y = u.closest("[" + t + "]");
                if (y)
                  if (u.tagName === "TR")
                    p(u);
                  else {
                    const E = y.tagName;
                    if (E === "TABLE" || E === "TBODY") {
                      const A = u.querySelectorAll ? u.querySelectorAll("tr") : [];
                      for (const L of A)
                        p(L);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), ee([t], function(v) {
        v.hasAttribute && v.hasAttribute(t) ? _(v) : m(v);
      });
    }, "ln-link");
  }
  function r(f) {
    _(f);
  }
  window[e] = { init: r, destroy: m };
  function l() {
    d(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
const Ot = ["Ctrl", "Alt", "Shift", "Meta"], Ri = {
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
function In(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const a = Ri[e.toLowerCase()];
  return a || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Dn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const a = e.split("+"), d = /* @__PURE__ */ new Set();
  let o = "";
  for (let s = 0; s < a.length; s++) {
    const n = In(a[s]);
    if (!n) return "";
    if (Ot.indexOf(n) !== -1) {
      d.add(n);
      continue;
    }
    if (o) return "";
    o = n;
  }
  if (!o) return "";
  const c = [];
  for (let s = 0; s < Ot.length; s++)
    d.has(Ot[s]) && c.push(Ot[s]);
  return c.push(o), c.join("+");
}
function Oi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const a = e.split(/[\s,]+/), d = [];
  for (let o = 0; o < a.length; o++) {
    const c = Dn(a[o]);
    c && d.indexOf(c) === -1 && d.push(c);
  }
  return d;
}
function Mi(t, e) {
  const a = String(e || "").trim();
  if (!a || /[\s,]/.test(a)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : Dn(d ? d + "+" + a : a);
}
function Fi(t) {
  if (!t) return "";
  const e = In(t.key);
  if (!e || Ot.indexOf(e) !== -1) return "";
  const a = [];
  return t.ctrlKey && a.push("Ctrl"), t.altKey && a.push("Alt"), t.shiftKey && a.push("Shift"), t.metaKey && a.push("Meta"), a.push(e), a.join("+");
}
function Ni(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const a = t.getAttribute("contenteditable");
    if (a === "" || String(a).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Pi(t, e, a, d) {
  if (!t || !e || a !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const o = String(e.tagName || "").toLowerCase();
  return o === "button" ? d === "Enter" || d === "Space" : o === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", a = "data-ln-key-target", d = "data-ln-key-allow-input", o = "data-ln-key-modifier", c = "data-ln-key-for", s = "lnKeyFor";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new Set();
  let h = null;
  function p() {
    h || (h = function(i) {
      if (i.defaultPrevented || i.isComposing || i.repeat) return;
      const r = Fi(i);
      if (!r) return;
      const l = Yn(i.target), f = document.querySelectorAll("[" + t + "], [" + c + "]");
      let v = null, w = !1, u = !1;
      for (let A = 0; A < f.length; A++) {
        const L = f[A], T = L[e] || L[s];
        if (!T || !T.matches(r) || l && !T.allowsInput()) continue;
        const x = T.resolveTarget(), I = Ni(x);
        if (!(!I || !Jn(x, I))) {
          if (Pi(i, x, I, r)) {
            u = !0;
            continue;
          }
          v ? w = !0 : v = { host: L, target: x, action: I };
        }
      }
      if (u || !v) return;
      w && console.warn('[ln-key] Duplicate active shortcut "' + r + '"; first DOM match wins.');
      const y = {
        source: v.host,
        target: v.target,
        action: v.action,
        key: r,
        event: i
      };
      W(v.host, "ln-key:before-trigger", y).defaultPrevented || (i.preventDefault(), v.target[v.action](), C(v.host, "ln-key:trigger", y));
    }, document.addEventListener("keydown", h));
  }
  function b() {
    n.size > 0 || !h || (document.removeEventListener("keydown", h), h = null);
  }
  function m(i) {
    return this.dom = i, this.shortcuts = [], n.add(this), this.sync(), p(), this;
  }
  m.prototype.sync = function() {
    this.shortcuts = Oi(this.dom.getAttribute(t));
  }, m.prototype.matches = function(i) {
    return this.shortcuts.indexOf(i) !== -1;
  }, m.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, m.prototype.resolveTarget = function() {
    const i = this.dom.getAttribute(a);
    return i ? _(i, a) : this.dom;
  }, m.prototype.destroy = function() {
    this.dom[e] && (n.delete(this), delete this.dom[e], b(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function g(i) {
    return this.dom = i, n.add(this), p(), this;
  }
  g.prototype._modifierContext = function() {
    return this.dom.closest("[" + o + "]");
  }, g.prototype.shortcut = function() {
    const i = this._modifierContext(), r = i ? i.getAttribute(o) : "";
    return Mi(r, this.dom.textContent);
  }, g.prototype.matches = function(i) {
    return this.shortcut() === i;
  }, g.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const i = this._modifierContext();
    return !!(i && i.hasAttribute(d));
  }, g.prototype.resolveTarget = function() {
    return _(this.dom.getAttribute(c), c);
  }, g.prototype.destroy = function() {
    this.dom[s] && (n.delete(this), delete this.dom[s], b(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function _(i, r) {
    if (!i) return null;
    try {
      const l = document.querySelector(i);
      return l || console.warn("[ln-key] Target not found for " + r + ' selector "' + i + '".'), l;
    } catch {
      return console.warn("[ln-key] Invalid " + r + ' selector "' + i + '".'), null;
    }
  }
  U(t, e, m, "ln-key", {
    extraAttributes: [a, d],
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
  }), U(c, s, g, "ln-key-for", {
    onAttributeChange: function(i) {
      const r = i[s];
      r && !i.hasAttribute(c) && r.destroy();
    }
  });
})();
function Bi(t, e, a = 100) {
  if (e != null && e !== "") {
    const d = parseFloat(String(e));
    if (!isNaN(d) && d > 0) return d;
  }
  if (t != null && t !== "") {
    const d = parseFloat(String(t));
    if (!isNaN(d) && d > 0) return d;
  }
  return a;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function a(c) {
    return this.dom = c, this._parentObserver = null, o.call(this), d.call(this), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function d() {
    const c = this, s = this.dom.parentElement;
    if (!s) return;
    const n = new MutationObserver(function(h) {
      for (const p of h)
        p.attributeName === "data-ln-progress-max" && o.call(c);
    });
    n.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function o() {
    const c = this.dom.getAttribute("data-ln-progress"), s = this.dom.parentElement, n = s ? s.getAttribute("data-ln-progress-max") : null, h = this.dom.getAttribute("data-ln-progress-max"), p = Bi(h, n, 100), b = _n(c, p);
    this.dom.style.width = b.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(b.min)), this.dom.setAttribute("aria-valuemax", String(b.max)), this.dom.setAttribute("aria-valuenow", String(b.clampedValue)), C(this.dom, "ln-progress:change", {
      target: this.dom,
      value: b.value,
      max: b.max,
      percentage: b.percentage
    });
  }
  U(
    t,
    e,
    a,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(c) {
        const s = c[e];
        s && o.call(s);
      }
    }
  );
})();
function Hi(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let a = 0; a < t.length; a++)
    if (t[a] !== e[a]) return !0;
  return !1;
}
function Ui(t, e) {
  if (!e || typeof e != "object") return !0;
  const a = Object.keys(e);
  if (a.length === 0) return !0;
  for (let d = 0; d < a.length; d++) {
    const o = e[a[d]], c = t[o.col] || "";
    if (!Se(c, o.values))
      return !1;
  }
  return !0;
}
function zi(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const a = [];
  for (let d = 0; d < t.length; d++) {
    const o = t[d];
    !e && o.key && (e = o.key), o.checked && !o.isReset && o.value && a.push(o.value);
  }
  return { key: e, values: a };
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", a = "data-ln-filter-key", d = "data-ln-filter-value", o = "data-ln-filter-hide", c = "data-ln-filter-reset", s = "data-ln-filter-col", n = "data-ln-hash", h = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  function p(i) {
    return i.hasAttribute(c) || !i.getAttribute(d);
  }
  function b(i) {
    const r = i.dom.querySelectorAll("[" + a + "]"), l = [];
    for (let v = 0; v < r.length; v++) {
      const w = r[v];
      l.push({
        key: w.getAttribute(a),
        value: w.getAttribute(d) || "",
        checked: w.checked,
        isReset: p(w)
      });
    }
    const f = zi(l);
    return { key: f.key, values: f.values, targetId: i.targetId };
  }
  function m(i, r, l) {
    const f = i.querySelectorAll("[" + a + "]"), v = Array.isArray(l) && l.length > 0;
    for (let w = 0; w < f.length; w++) {
      const u = f[w];
      p(u) ? u.checked = !v : v && u.getAttribute(a) === r && l.indexOf(u.getAttribute(d)) !== -1 ? u.checked = !0 : u.checked = !1;
    }
  }
  function g(i) {
    this.dom = i, this.targetId = i.getAttribute(t);
    const r = i.getAttribute(s);
    this.colIndex = r !== null ? parseInt(r, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = vt(i, "filter"), this.hashEnabled = !!this.nsKey;
    const l = this, f = ne(function() {
      l._render();
    });
    this._queueRender = f, this._attachHandlers(), this._onHashChange = function() {
      if (l._destroyed || !l.hashEnabled) return;
      const w = Y(l.nsKey), u = fe(w);
      u && u.key && u.values.length > 0 ? m(l.dom, u.key, u.values) : m(l.dom, null, []), l._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let v = !1;
    if (this.hashEnabled) {
      const w = Y(this.nsKey), u = fe(w);
      u && u.key && u.values.length > 0 && (m(i, u.key, u.values), rt(function() {
        l._destroyed || l._render();
      }), v = !0);
    }
    if (!v && i.hasAttribute("data-ln-persist")) {
      const w = Pt("filter", i);
      w && w.key && Array.isArray(w.values) && w.values.length > 0 && (m(i, w.key, w.values), rt(function() {
        l._destroyed || l._render();
      }), v = !0);
    }
    if (!v) {
      const w = i.querySelectorAll("[" + a + "]");
      for (let u = 0; u < w.length; u++)
        if (w[u].checked && !p(w[u])) {
          rt(function() {
            l._destroyed || l._render();
          });
          break;
        }
    }
    return this;
  }
  g.prototype._attachHandlers = function() {
    const i = this;
    this._onDomChange = function(r) {
      const l = r.target;
      if (!l || !l.hasAttribute || !l.hasAttribute(a)) return;
      const f = Array.from(i.dom.querySelectorAll("[" + a + "]"));
      if (p(l)) {
        for (let v = 0; v < f.length; v++)
          p(f[v]) || (f[v].checked = !1);
        l.checked = !0, i._queueRender();
        return;
      }
      if (l.checked) {
        for (let w = 0; w < f.length; w++)
          p(f[w]) && (f[w].checked = !1);
        let v = !1;
        for (let w = 0; w < f.length; w++)
          if (p(f[w])) {
            v = !0;
            break;
          }
        if (v) {
          let w = !0;
          for (let u = 0; u < f.length; u++)
            if (!p(f[u]) && !f[u].checked) {
              w = !1;
              break;
            }
          if (w)
            for (let u = 0; u < f.length; u++)
              p(f[u]) ? f[u].checked = !0 : f[u].checked = !1;
        }
      } else {
        let v = !1;
        for (let w = 0; w < f.length; w++)
          if (!p(f[w]) && f[w].checked) {
            v = !0;
            break;
          }
        if (!v)
          for (let w = 0; w < f.length; w++)
            p(f[w]) && (f[w].checked = !0);
      }
      i._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, g.prototype._render = function() {
    const i = this, r = b(this), l = this._lastSnapshot;
    if (!(!l || l.key !== r.key || Hi(l.values, r.values))) return;
    const v = r.key === null || r.values.length === 0, w = document.getElementById(i.targetId), u = {
      key: r.key,
      values: r.values.slice(),
      targetId: i.targetId
    };
    C(i.dom, "ln-filter:change", u);
    let y = !1;
    w && w !== i.dom && W(w, "ln-filter:change", u).defaultPrevented && (y = !0);
    const E = l && l.values.length > 0, A = r.values.length === 0;
    if (E && A) {
      const L = { targetId: i.targetId };
      C(i.dom, "ln-filter:reset", L), w && w !== i.dom && C(w, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: r.key, values: r.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (r.key && r.values.length > 0 ? gt("filter", this.dom, { key: r.key, values: r.values.slice() }) : gt("filter", this.dom, null)), this.hashEnabled) {
      const L = gn(r.key, r.values);
      nt(this.nsKey, L);
    }
    if (!y)
      if (i.colIndex !== null)
        i._filterTableRows(r);
      else {
        if (!w) return;
        const L = w.children;
        for (let T = 0; T < L.length; T++) {
          const x = L[T];
          if (x.removeAttribute(o), v) continue;
          const I = x.getAttribute("data-" + r.key);
          I !== null && (Se(I, r.values) || x.setAttribute(o, "true"));
        }
      }
  }, g.prototype._filterTableRows = function(i) {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const l = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!l) return;
    const f = i.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, v = i.values;
    h.has(l) || h.set(l, {});
    const w = h.get(l);
    f && v.length > 0 ? w[f] = { col: this.colIndex, values: v.slice() } : f && delete w[f];
    const u = l.tBodies;
    for (let y = 0; y < u.length; y++) {
      const E = u[y].rows;
      for (let A = 0; A < E.length; A++) {
        const L = E[A], T = {};
        for (let x = 0; x < L.cells.length; x++)
          T[x] = L.cells[x].textContent.trim();
        Ui(T, w) ? L.removeAttribute(o) : L.setAttribute(o, "true");
      }
    }
  }, g.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const i = document.getElementById(this.targetId);
        if (i) {
          const r = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (r && h.has(r)) {
            const l = h.get(r), f = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            f && l[f] && delete l[f], Object.keys(l).length === 0 && h.delete(r);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
    }
  };
  function _(i, r) {
    const l = i[e];
    !l || l._destroyed || r === n && (l.hashEnabled && l._onHashChange && window.removeEventListener("hashchange", l._onHashChange), l.nsKey = vt(i, "filter"), l.hashEnabled = !!l.nsKey, l.hashEnabled && window.addEventListener("hashchange", l._onHashChange));
  }
  U(t, e, g, "ln-filter", {
    extraAttributes: [n],
    onAttributeChange: _
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", a = "data-ln-search-for", d = "lnSearchControl", o = "data-ln-search-items", c = "data-ln-search-fields", s = "data-ln-search-exclude", n = "data-ln-search-hide", h = "data-ln-hash", p = "data-ln-persist";
  if (window[e] !== void 0) return;
  function b(w) {
    const u = vt(w, "search");
    if (u) return u;
    if (w.id) {
      const y = document.querySelector("[" + a + '="' + w.id + '"]');
      if (y) {
        const E = vt(y, "search");
        if (E) return E;
      }
    }
    return null;
  }
  function m(w) {
    return w.matches("input, textarea") ? w : w.querySelector("input, textarea");
  }
  function g(w, u) {
    const y = w.childNodes;
    for (let E = 0; E < y.length; E++) {
      const A = y[E];
      if (A.nodeType === 3) {
        u.push(A.nodeValue);
        continue;
      }
      A.nodeType === 1 && (A.hasAttribute(s) || g(A, u));
    }
  }
  function _(w) {
    if (w._lnSearchText !== void 0) return w._lnSearchText;
    const u = [];
    g(w, u);
    const y = ci(u);
    return w._lnSearchText = y, y;
  }
  function i(w, u) {
    if (!w.id) return;
    const y = document.querySelectorAll("[" + a + '="' + w.id + '"]');
    for (const E of y) {
      const A = m(E);
      A && A.value !== u && (A.value = u);
    }
  }
  function r(w) {
    this.dom = w, this.term = w.getAttribute(t) || "", this._destroyed = !1;
    const u = this;
    return this.nsKey = b(w), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (u._destroyed || !u.hashEnabled) return;
      const y = Y(u.nsKey), E = u.dom.getAttribute(t) || "";
      y !== null && y !== E ? u.dom.setAttribute(t, y) : y === null && E !== "" && u.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), rt(function() {
      if (!u._destroyed) {
        if (u.hashEnabled) {
          const y = Y(u.nsKey);
          if (y !== null && y !== u.term) {
            u.term = y, u.dom.setAttribute(t, y), i(u.dom, y), u._apply();
            return;
          }
        }
        if (w.hasAttribute(p)) {
          const y = Pt("search", w);
          if (typeof y == "string" && Rt(y) && y !== u.term) {
            u.term = y, u.dom.setAttribute(t, y), i(u.dom, y), u._apply();
            return;
          }
        }
        Rt(u.term) && (i(u.dom, u.term), u._apply());
      }
    }), this;
  }
  r.prototype._apply = function() {
    const w = this.dom, u = Rt(this.term), y = yn(u);
    this.hashEnabled && nt(this.nsKey, this.term ? this.term : null);
    const E = li(w.getAttribute(c));
    if (W(w, "ln-search:change", {
      term: u,
      tokens: y,
      targetId: w.id,
      fields: E
    }).defaultPrevented) return;
    const L = w.getAttribute(o), T = L ? w.querySelectorAll(L) : w.children;
    for (let x = 0; x < T.length; x++) {
      const I = T[x];
      if (I.removeAttribute(n), I.hasAttribute(s) || y.length === 0) continue;
      const R = _(I);
      vn(R, y) || I.setAttribute(n, "true");
    }
  }, r.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function l(w) {
    if (this.dom = w, this.targetId = w.getAttribute(a), this.input = m(w), this._attachHandler(), this.input && this.input.value.trim()) {
      const u = this;
      rt(function() {
        const y = document.getElementById(u.targetId);
        y && ((y.getAttribute(t) || "").trim() || u._write(u.input.value));
      });
    }
    return this;
  }
  l.prototype._write = function(w) {
    const u = document.getElementById(this.targetId);
    u && u.getAttribute(t) !== w && u.setAttribute(t, w);
  }, l.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      w._write(w.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, l.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function f(w) {
    const u = w.getAttribute("data-ln-search-clear-for");
    if (u) {
      const T = document.getElementById(u), x = document.querySelector("[" + a + '="' + u + '"]'), I = x ? m(x) : null;
      return { target: T, input: I };
    }
    const y = w.closest("[" + t + "]");
    if (y) {
      const T = y.id ? document.querySelector("[" + a + '="' + y.id + '"]') : null, x = T ? m(T) : null;
      return { target: y, input: x };
    }
    const E = w.closest("[data-ln-table-source], [data-ln-list-source]");
    if (E) {
      const T = E.getAttribute("data-ln-table-source") || E.getAttribute("data-ln-list-source"), x = T ? document.getElementById(T) : null;
      if (x && x.hasAttribute(t)) {
        const I = document.querySelector("[" + a + '="' + T + '"]'), R = I ? m(I) : null;
        return { target: x, input: R };
      }
    }
    const A = w.closest("[" + a + "]");
    if (A) {
      const T = A.getAttribute(a), x = T ? document.getElementById(T) : null, I = m(A);
      return { target: x, input: I };
    }
    const L = w.parentElement;
    if (L) {
      const T = L.querySelector("[" + a + "]");
      if (T) {
        const x = T.getAttribute(a), I = x ? document.getElementById(x) : null, R = m(T);
        return { target: I, input: R };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(w) {
    const u = w.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!u) return;
    const y = f(u);
    !y.target && !y.input || (w.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function v(w, u) {
    const y = w[e];
    if (!y || y._destroyed) return;
    if (u === h) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = b(w), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const E = w.getAttribute(t) || "";
    E !== y.term && (y.term = E, w.hasAttribute(p) && gt("search", w, Rt(E) ? E : null), i(w, E), y._apply());
  }
  U(t, e, r, "ln-search", {
    extraAttributes: [h],
    onAttributeChange: v,
    onSubtreeChange: function(w, u) {
      const y = u.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    }
  }), U(a, d, l, "ln-search-control");
})();
function ft(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Ki(t) {
  const e = ft(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function ji(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Vi(t, e, a, d) {
  const o = ft(t);
  if (o === "none") return () => 0;
  const c = o === "desc" ? -1 : 1, s = typeof d == "function" ? d : (n) => n;
  return function(n, h) {
    const p = s(n), b = s(h);
    return we(p, b, e, a) * c;
  };
}
(function() {
  const t = "data-ln-sort", e = "lnSort", a = "data-ln-sort-field", d = "data-ln-sort-state", o = "data-ln-sort-dir", c = "data-ln-sort-items", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new WeakMap();
  function h(m, g) {
    if (g) {
      const _ = m.querySelector('[data-ln-field="' + g + '"]');
      if (_) return St(_);
    }
    return St(m);
  }
  function p(m) {
    this.dom = m, this.targetId = m.getAttribute(t), this.field = m.getAttribute(a) || null;
    const g = m.closest("th");
    this.column = !this.field && g ? g.cellIndex : null, this.itemsSelector = m.getAttribute(c) || null, this._state = ft(m.getAttribute(d)), this._destroyed = !1, this.nsKey = vt(m, "sort"), this.hashEnabled = !!this.nsKey;
    const _ = this;
    this._onClick = function(r) {
      const l = r.target.closest("[" + o + "]");
      if (!l) return;
      const f = ft(l.getAttribute(o));
      _._apply(f);
    }, m.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (_._destroyed || !r.detail) return;
      const l = _._resolveTarget();
      if (!(l && (r.target === l || l.contains(r.target)) || r.detail.targetId && r.detail.targetId === _.targetId)) return;
      if (ji(
        { field: _.field, column: _.column },
        { field: r.detail.field, column: r.detail.column }
      )) {
        const w = ft(r.detail.direction);
        w && m.getAttribute(d) !== w && (_._state = w, m.setAttribute(d, w), _._updateAriaSort(w));
        return;
      }
      m.getAttribute(d) !== "none" && (_._state = "none", m.setAttribute(d, "none"), _._updateAriaSort("none")), m.hasAttribute("data-ln-persist") && gt("sort", m, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const r = Y(_.nsKey), l = he(r);
      if (l)
        _.field !== null && l.fieldOrColumn === _.field || _.column !== null && String(_.column) === l.fieldOrColumn ? _._state !== l.direction && _._apply(l.direction, !0) : _._state !== "none" && (_._state = "none", m.setAttribute(d, "none"), _._updateAriaSort("none"));
      else if (_._state !== "none") {
        _._state = "none", m.setAttribute(d, "none"), _._updateAriaSort("none");
        const f = _._resolveTarget();
        f && (W(f, "ln-sort:change", {
          field: _.field,
          column: _.column,
          direction: "none",
          targetId: _.targetId
        }).defaultPrevented || _._defaultSort(f, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const r = Y(this.nsKey), l = he(r);
      l && ((_.field !== null && l.fieldOrColumn === _.field || _.column !== null && String(_.column) === l.fieldOrColumn) && rt(function() {
        _._destroyed || _._apply(l.direction, !0);
      }), i = !0);
    }
    if (!i && m.hasAttribute("data-ln-persist")) {
      const r = Pt("sort", m);
      r && r.direction && r.direction !== "none" && rt(function() {
        _._destroyed || _._apply(r.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const r = ft(m.getAttribute(d));
      r && r !== "none" && rt(function() {
        _._destroyed || _._apply(r, !0);
      });
    }
    return this;
  }
  p.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, p.prototype._updateAriaSort = function(m) {
    const g = this.dom.closest("th");
    g && g.setAttribute("aria-sort", Ki(m));
  }, p.prototype._apply = function(m, g) {
    if (this._destroyed) return;
    const _ = ft(m);
    this._state = _, this.dom.getAttribute(d) !== _ && this.dom.setAttribute(d, _), this._updateAriaSort(_);
    const i = this._resolveTarget();
    if (!i) return;
    const r = {
      field: this.field,
      column: this.column,
      direction: _,
      targetId: this.targetId
    };
    if (!g && (this.dom.hasAttribute("data-ln-persist") && gt("sort", this.dom, _ === "none" ? null : r), this.hashEnabled)) {
      const f = mn(this.field !== null ? this.field : this.column, _);
      nt(this.nsKey, f);
    }
    W(i, "ln-sort:change", r).defaultPrevented || this._defaultSort(i, _);
  }, p.prototype._defaultSort = function(m, g) {
    const _ = this.itemsSelector ? Array.from(m.querySelectorAll(this.itemsSelector)) : Array.from(m.children);
    if (!_.length) return;
    const i = _[0].parentNode;
    n.has(m) || n.set(m, _.slice());
    let r;
    if (g === "none")
      r = (n.get(m) || _).filter(function(v) {
        return v.parentNode === i;
      });
    else {
      const f = this.field, v = _.map(function(E) {
        return h(E, f);
      }), w = ve(v), u = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, y = Vi(g, w, u, function(E) {
        return h(E, f);
      });
      r = _.slice().sort(y);
    }
    const l = document.createDocumentFragment();
    for (let f = 0; f < r.length; f++) l.appendChild(r[f]);
    i.appendChild(l);
  }, p.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function b(m, g) {
    const _ = m[e];
    if (!(!_ || _._destroyed))
      if (g === a) {
        _.field = m.getAttribute(a) || null;
        const i = m.closest("th");
        _.column = !_.field && i ? i.cellIndex : null;
      } else if (g === c)
        _.itemsSelector = m.getAttribute(c) || null;
      else if (g === d) {
        const i = ft(m.getAttribute(d));
        i !== _._state && _._apply(i);
      } else g === t ? _.targetId = m.getAttribute(t) : g === s && (_.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = vt(m, "sort"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange));
  }
  U(t, e, p, "ln-sort", {
    extraAttributes: [a, c, d, s],
    onAttributeChange: b
  });
})();
function Ue(t, e, a, d, o = 15) {
  if (d <= 0 || a <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const c = Math.max(0, t || 0), s = Math.max(0, e || 0), n = Math.floor(c / a), h = Math.ceil(s / a), p = Math.max(0, n - o), b = Math.min(d, n + h + o), m = p * a, g = Math.max(0, (d - b) * a);
  return { start: p, end: b, topPadding: m, bottomPadding: g };
}
function Gi(t, e) {
  const a = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let o = 0;
  if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      d.has(t[n]) && o++;
  else
    o = d.size;
  const c = a > 0 && o === a, s = o > 0 && o < a;
  return { totalCount: a, selectedCount: o, isAllSelected: c, isIndeterminate: s };
}
function ze(t, e, a) {
  const d = new Set(t);
  return e == null || ((a !== void 0 ? a : !d.has(e)) ? d.add(e) : d.delete(e)), d;
}
function Ke(t, e, a) {
  const d = new Set(t);
  if (!Array.isArray(e)) return d;
  if (a)
    for (let o = 0; o < e.length; o++)
      e[o] != null && d.add(e[o]);
  else
    for (let o = 0; o < e.length; o++)
      d.delete(e[o]);
  return d;
}
(function() {
  const t = "data-ln-table", e = "lnTable", a = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function h(m, g) {
    if (m == null || isNaN(m)) return "";
    try {
      return new Intl.NumberFormat(G(g)).format(m);
    } catch {
      return String(m);
    }
  }
  function p(m) {
    let g = m.parentElement;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const i = getComputedStyle(g).overflowY;
      if (i === "auto" || i === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function b(m) {
    this.dom = m, this.table = m.querySelector("table"), this.tbody = m.querySelector("[data-ln-table-body]") || m.querySelector("tbody"), this.thead = m.querySelector("thead");
    const g = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = g ? Array.from(g.querySelectorAll("th")) : [], this._totalSpan = m.querySelector("[data-ln-table-total]"), this._filteredSpan = m.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== m ? this._filteredSpan.parentElement : null), this._selectedSpan = m.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== m ? this._selectedSpan.parentElement : null), this.isDataDriven = m.hasAttribute("data-ln-table-source"), this.name = m.getAttribute(t) || "", this.source = m.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const _ = this;
    return this._onSetSearch = function(i) {
      const r = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      _.isDataDriven ? (_.currentSearch = r, C(m, "ln-table:search", {
        table: _.name,
        query: _.currentSearch
      }), _._requestData()) : (_._searchTerm = r.toLowerCase(), _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), C(m, "ln-table:filter", {
        term: _._searchTerm,
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, m.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), _._onSetSearch(i);
    }, m.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      _.isDataDriven ? (_.currentFilters = {}, _.currentSearch = "", C(m, "ln-table:clear-filters", { table: _.name }), _._requestData()) : (_._searchTerm = "", _._columnFilters = {}, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), C(m, "ln-table:filter", {
        term: "",
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, m.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = m.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && m.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(i) {
      const r = i.detail || {}, l = r.data || [], f = r.total != null ? r.total : l.length;
      if (!(_._hasInitialSeed && !_.isLoaded && l.length === 0 && f === 0)) {
        if (_._windowed) {
          _._cache.ingest(r) && !r.provisional && m.classList.remove("ln-table--loading");
          return;
        }
        _._data = l, _._lastTotal = f, _._lastFiltered = r.filtered != null ? r.filtered : _._data.length, _.totalCount = _._lastTotal, _.visibleCount = _._lastFiltered, _.isLoaded = !0, _._hasInitialSeed = !1, m.classList.remove("ln-table--loading"), _._vStart = -1, _._vEnd = -1, _._applyFilterAndSort(), _._render(), _._updateFooter(), C(m, "ln-table:rendered", {
          table: _.name,
          total: _.totalCount,
          visible: _.visibleCount
        });
      }
    }, m.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const r = i.detail && i.detail.loading;
      m.classList.toggle("ln-table--loading", !!r), r && (_.isLoaded = !1);
    }, m.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(i) {
      !_._windowed || !_._cache || _._cache.release(i.detail && i.detail.offset);
    }, m.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !_._windowed || !_._cache || _._cache.revalidate();
    }, m.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !_._windowed || !_._cache || _._requestData();
    }, m.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(i) {
      i.preventDefault(), _.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, _._requestData();
    }, m.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const r = i.target.closest("[data-ln-table-row]");
      if (!r) return;
      const l = r.getAttribute("data-ln-table-row-id"), f = r._lnRecord || {};
      C(m, "ln-table:row-click", {
        table: _.name,
        id: l,
        record: f
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const r = i.target.closest("[data-ln-table-row-action]");
      if (!r) return;
      const l = r.closest("[data-ln-table-row]");
      if (!l) return;
      const f = r.getAttribute("data-ln-table-row-action"), v = l.getAttribute("data-ln-table-row-id"), w = l._lnRecord || {};
      C(m, "ln-table:row-action", {
        table: _.name,
        id: v,
        action: f,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : C(m, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      _.tbody.rows.length > 0 && (_._emptyTbodyObserver.disconnect(), _._emptyTbodyObserver = null, _._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      i.preventDefault();
      const r = i.detail.direction === "none" ? null : i.detail.direction;
      _._sortCol = r === null ? -1 : i.detail.column, _._sortDir = r, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), C(m, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: _._filteredData.length,
        total: _._data.length
      });
    }, m.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const r = i.detail.key, l = i.detail.values || [];
      if (r) {
        if (l.length === 0)
          delete _._columnFilters[r];
        else {
          const f = [];
          for (let v = 0; v < l.length; v++)
            f.push(l[v].toLowerCase());
          _._columnFilters[r] = f;
        }
        _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), C(m, "ln-table:filter", {
          term: _._searchTerm,
          matched: _._filteredData.length,
          total: _._data.length
        });
      }
    }, m.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const m = this.tbody.rows, g = this.ths;
    this._data = [], m.length > 0 && (this._rowHeight = m[0].offsetHeight || 40), this._lockColumnWidths();
    for (let _ = 0; _ < m.length; _++) {
      const i = m[_], r = [], l = [], f = [];
      for (let w = 0; w < i.cells.length; w++) {
        const u = i.cells[w], y = u.textContent.trim();
        r[w] = St(u), l[w] = y.toLowerCase(), u.querySelector("[data-ln-table-row-action]") || f.push(y.toLowerCase());
      }
      let v = null;
      if (this.isDataDriven) {
        v = {};
        const w = i.getAttribute("data-ln-table-row-id");
        w != null && (v.id = w);
        for (let u = 0; u < g.length; u++) {
          const y = g[u].getAttribute("data-ln-table-col");
          if (y) {
            const E = u;
            if (E < i.cells.length) {
              const A = i.cells[E];
              v[y] = St(A);
            }
          }
        }
      }
      this._data.push({
        values: r,
        rawTexts: l,
        html: i.outerHTML,
        searchText: f.join(" "),
        id: this.isDataDriven && v ? v.id : void 0,
        ...v
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, b.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, b.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const m = document.createElement("colgroup");
    this.ths.forEach(function(g) {
      const _ = document.createElement("col");
      _.style.width = g.offsetWidth + "px", m.appendChild(_);
    }), this.table.insertBefore(m, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = m;
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const m = this._lastTotal, g = this.visibleCount;
        if (m === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const m = this._filteredData.length;
        m === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : m > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const m = this._filteredData, g = document.createDocumentFragment();
      for (let _ = 0; _ < m.length; _++) {
        const i = this._buildRow(m[_]);
        if (!i) break;
        g.appendChild(i);
      }
      this.tbody.replaceChildren(g), this._selectable && this._updateSelectAll();
    } else {
      const m = [], g = this._filteredData;
      for (let _ = 0; _ < g.length; _++) m.push(g[_].html);
      this.tbody.innerHTML = m.join(""), this._selectable && this._restoreSelection();
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const m = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let _ = null;
        if (this._windowed) {
          const i = this._cache ? this._cache.peek() : null;
          _ = i ? this._buildRow(i) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (_ = this._buildRow(this._data[0]));
        _ && this.tbody && (this.tbody.appendChild(_), this._rowHeight = _.offsetHeight || 40, _.remove());
      }
    this.isDataDriven ? this._scrollContainer = p(this.dom) : this._scrollContainer = null;
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      m._rafId || (m._rafId = requestAnimationFrame(function() {
        m._rafId = null, m._windowed ? m._renderWindowed() : m._renderVirtual();
      }));
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const m = this._filteredData, g = m.length, _ = this._rowHeight;
    if (!_ || !g) return;
    const i = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let l, f;
    if (r) {
      const L = this.table.getBoundingClientRect(), T = r.getBoundingClientRect(), x = L.top - T.top + r.scrollTop + i;
      l = r.scrollTop - x, f = r.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + i;
      l = window.scrollY - x, f = window.innerHeight;
    }
    const v = Ue(l, f, _, g, 15), w = v.start, u = v.end;
    if (w === this._vStart && u === this._vEnd) return;
    this._vStart = w, this._vEnd = u;
    const y = this.ths.length || 1, E = v.topPadding, A = v.bottomPadding;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (E > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", y), x.style.height = E + "px", T.appendChild(x), L.appendChild(T);
      }
      for (let T = w; T < u; T++) {
        const x = this._buildRow(m[T]);
        x && L.appendChild(x);
      }
      if (A > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", y), x.style.height = A + "px", T.appendChild(x), L.appendChild(T);
      }
      this.tbody.replaceChildren(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      E > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + y + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
      for (let T = w; T < u; T++) L += m[T].html;
      A > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + y + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderRow = function() {
    const m = document.createElement("tr");
    m.className = "ln-table__placeholder", m.setAttribute("aria-hidden", "true");
    const g = document.createElement("td");
    return g.setAttribute("colspan", this.ths.length || 1), g.style.height = this._rowHeight + "px", m.appendChild(g), m;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const m = this._rowHeight;
    if (!m) return;
    const g = this._cache.logicalTotal, _ = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let r, l;
    if (i) {
      const L = this.table.getBoundingClientRect(), T = i.getBoundingClientRect(), x = L.top - T.top + i.scrollTop + _;
      r = i.scrollTop - x, l = i.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + _;
      r = window.scrollY - x, l = window.innerHeight;
    }
    const f = Ue(r, l, m, g, 15), v = f.start, w = f.end, u = this.ths.length || 1, y = f.topPadding, E = f.bottomPadding, A = document.createDocumentFragment();
    if (y > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", u), T.style.height = y + "px", L.appendChild(T), A.appendChild(L);
    }
    for (let L = v; L < w; L++)
      if (this._cache.has(L)) {
        const T = this._buildRow(this._cache.get(L));
        T && A.appendChild(T);
      } else
        A.appendChild(this._buildPlaceholderRow());
    if (E > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", u), T.style.height = E + "px", L.appendChild(T), A.appendChild(L);
    }
    this.tbody.replaceChildren(A), this._vStart = v, this._vEnd = w, this._cache.ensure(v, w);
  }, b.prototype._showEmptyState = function() {
    const m = this.ths.length || 1;
    let g = null, _ = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, l = this.visibleCount === 0 && i > 0, f = l ? this.name + "-empty-filtered" : this.name + "-empty";
      if (_ = mt(this.dom, f, "ln-table"), !_) {
        const v = this.dom.querySelector("template[data-ln-table-empty]");
        if (v) {
          const w = l ? "search" : "initial", u = v.content.querySelector('[data-ln-table-empty-when="' + w + '"]') || v.content.firstElementChild;
          u && (_ = document.importNode(u, !0));
        }
      }
      if (_)
        if (_.tagName === "TR")
          g = _;
        else {
          const v = document.createElement("td");
          v.setAttribute("colspan", String(m)), v.appendChild(_);
          const w = document.createElement("tr");
          w.className = "ln-table__empty", w.appendChild(v), g = w;
        }
    } else {
      const i = this.dom.querySelector("template[" + a + "]"), r = document.createElement("td");
      r.setAttribute("colspan", String(m)), i && r.appendChild(document.importNode(i.content, !0));
      const l = document.createElement("tr");
      l.className = "ln-table__empty", l.appendChild(r), g = l;
    }
    g ? this.tbody.replaceChildren(g) : this.tbody.replaceChildren(), C(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(m, g) {
    Nt(m, g);
    const _ = m.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < _.length; i++) {
      const r = _[i], l = r.getAttribute("data-ln-table-cell-attr").split(",");
      for (let f = 0; f < l.length; f++) {
        const v = l[f].trim().split(":");
        if (v.length !== 2) continue;
        const w = v[0].trim(), u = v[1].trim();
        g[w] != null && r.setAttribute(u, g[w]);
      }
    }
  }, b.prototype._buildRow = function(m) {
    let g = mt(this.dom, this.name + "-row", "ln-table");
    if (!g) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (g = document.importNode(i.content, !0));
    }
    let _ = g ? g.querySelector("[data-ln-table-row]") || g.firstElementChild : null;
    if (_)
      this._fillRow(_, m);
    else if (m && m.html) {
      const i = document.createElement("tbody");
      i.innerHTML = m.html, _ = i.firstElementChild;
    } else {
      _ = document.createElement("tr"), _.setAttribute("data-ln-table-row", "");
      const i = this.ths;
      for (let r = 0; r < i.length; r++) {
        const l = i[r].hasAttribute("data-ln-table-col-select"), f = document.createElement("td");
        if (l) {
          const v = document.createElement("input");
          v.type = "checkbox", v.setAttribute("data-ln-table-row-select", ""), v.setAttribute("aria-label", "Select row"), f.appendChild(v);
        } else {
          const v = i[r].getAttribute("data-ln-table-col");
          v && m[v] != null && (f.textContent = String(m[v]));
        }
        _.appendChild(f);
      }
    }
    if (_._lnRecord = m, m.id != null && _.setAttribute("data-ln-table-row-id", m.id), this._selectable && m.id != null && this.selectedIds.has(String(m.id))) {
      _.classList.add("ln-row-selected");
      const i = _.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return _;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Xe(this, "ln-table:request-data", "table");
  }, b.prototype._enterWindowedMode = function() {
    const m = this, g = this.dom, _ = parseInt(g.getAttribute("data-ln-table-window"), 10), i = parseInt(g.getAttribute("data-ln-table-window-page"), 10), r = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !m._windowed || !m._cache || (m.totalCount = m._cache.grandTotal, m.visibleCount = m._cache.logicalTotal, m._lastTotal = m._cache.grandTotal, m.isLoaded = !0, m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), C(g, "ln-table:rendered", {
        table: m.name,
        total: m.totalCount,
        visible: m.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = un({
      windowSize: _ > 0 ? _ : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: r >= 0 ? r : 25,
      fetchDebounce: 120,
      requestPage: function(l, f, v) {
        C(g, "ln-table:request-data", {
          table: m.name,
          sort: l.sort,
          filters: l.filters,
          search: l.search,
          offset: f,
          limit: v,
          queryGen: m._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let m = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(m) && this._totalSpan) {
        const _ = this._totalSpan.textContent.replace(/[^\d]/g, "");
        _ && (m = parseInt(_, 10));
      }
      const g = m > 0 ? m : this._data.length;
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
  }, b.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, b.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]"), g = [];
    for (let i = 0; i < m.length; i++) {
      const r = m[i].getAttribute("data-ln-table-row-id");
      r != null && g.push(r);
    }
    const _ = Gi(g, this.selectedIds);
    this._selectAllCheckbox.checked = _.isAllSelected, this._selectAllCheckbox.indeterminate = _.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let g = 0; g < m.length; g++) {
      const _ = m[g].getAttribute("data-ln-table-row-id"), i = _ != null && this.selectedIds.has(_);
      m[g].classList.toggle("ln-row-selected", i);
      const r = m[g].querySelector("[data-ln-table-row-select]");
      r && (r.checked = i);
    }
    this._updateSelectAll();
  }, Object.defineProperty(b.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), b.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const m = this;
    if (this._onSelectionChange = function(g) {
      const _ = g.target.closest("[data-ln-table-row-select]");
      if (!_) return;
      const i = _.closest("[data-ln-table-row]");
      if (!i) return;
      const r = i.getAttribute("data-ln-table-row-id");
      r != null && (m.selectedIds = ze(m.selectedIds, r, _.checked), i.classList.toggle("ln-row-selected", _.checked), m.selectedCount = m.selectedIds.size, m._updateSelectAll(), m._updateFooter(), C(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const g = document.createElement("input");
      g.type = "checkbox";
      const _ = m.dom.querySelector('[data-ln-table-dict="select-all"]'), i = m.dom.getAttribute("data-ln-table-select-all-label") || (_ ? _.textContent.trim() : null) || "Select all";
      g.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(g), this._selectAllCheckbox = g;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = m._selectAllCheckbox.checked, _ = m.tbody ? m.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let r = 0; r < _.length; r++) {
        const l = _[r].getAttribute("data-ln-table-row-id"), f = _[r].querySelector("[data-ln-table-row-select]");
        l != null && (i.push(l), _[r].classList.toggle("ln-row-selected", g), f && (f.checked = g));
      }
      m.selectedIds = Ke(m.selectedIds, i, g), m.selectedCount = m.selectedIds.size, C(m.dom, "ln-table:select-all", {
        table: m.name,
        selected: g
      }), C(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }), m._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let _ = 0; _ < g.length; _++) {
        const i = g[_].querySelector("[data-ln-table-row-select]"), r = g[_].getAttribute("data-ln-table-row-id");
        i && i.checked && r != null && (m.selectedIds = ze(m.selectedIds, r, !0), g[_].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const m = this.dom.querySelector("[data-ln-table-col-select]");
    if (m) {
      const g = m.querySelector('input[type="checkbox"]');
      g && g.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Ke(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let _ = 0; _ < g.length; _++) {
        g[_].classList.remove("ln-row-selected");
        const i = g[_].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let m = 0, g = 0;
    this.isDataDriven ? (m = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (m = this._data.length, g = this._filteredData.length);
    const _ = g < m;
    if (this._totalSpan && (this._totalSpan.textContent = h(m, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = _ ? h(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !_), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? h(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, b, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(m, g) {
      const _ = m[e];
      if (!(!_ || !_.isDataDriven)) {
        if (g === "data-ln-table-window") {
          const i = m.hasAttribute("data-ln-table-window");
          if (i && !_._windowed)
            _._enterWindowedMode(), _._kickWindowInitial();
          else if (!i && _._windowed)
            _._exitWindowedMode();
          else if (i && _._windowed) {
            const r = parseInt(m.getAttribute("data-ln-table-window"), 10);
            r > 0 && _._cache.configure({ windowSize: r });
          }
          return;
        }
        if (!(!_._windowed || !_._cache)) {
          if (g === "data-ln-table-window-page") {
            const i = parseInt(m.getAttribute("data-ln-table-window-page"), 10);
            i > 0 && _._cache.configure({ pageSize: i });
          } else if (g === "data-ln-table-window-threshold") {
            const i = parseInt(m.getAttribute("data-ln-table-window-threshold"), 10);
            i >= 0 && _._cache.configure({ threshold: i });
          } else if (g === "data-ln-table-count") {
            const i = parseInt(m.getAttribute("data-ln-table-count"), 10);
            i >= 0 && _._cache.setGrandTotal(i);
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
    const h = n.tagName === "INPUT" || n.tagName === "TEXTAREA" ? n : n.querySelector('input[type="search"], input[type="text"], input');
    h && (s.preventDefault(), h.focus());
  });
  function a(s) {
    return this.dom = s, c(this), this;
  }
  function d(s, n) {
    const h = n ? '[data-ln-search-for="' + n + '"]' : "[data-ln-search-for]", p = s.querySelector(h) || document.querySelector(h);
    return p ? p.tagName === "INPUT" || p.tagName === "TEXTAREA" ? p : p.querySelector("input, textarea") : null;
  }
  function o(s, n) {
    if (n) {
      const p = s.querySelectorAll('[data-ln-filter="' + n + '"]');
      if (p.length > 0) return p;
      const b = document.querySelectorAll('[data-ln-filter="' + n + '"]');
      if (b.length > 0) return b;
    }
    const h = s.querySelectorAll("[data-ln-filter]");
    return h.length > 0 ? h : document.querySelectorAll("[data-ln-filter]");
  }
  function c(s) {
    const n = s.dom;
    function h(p) {
      const b = p.target;
      if (b && b.hasAttribute && b.hasAttribute("data-ln-table")) return b;
      const m = p.detail && p.detail.targetId || b && b.id;
      return m ? n.querySelector('[data-ln-table-source="' + m + '"]') || n.querySelector('[data-ln-table="' + m + '"]') : null;
    }
    s._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(p) {
        if (!p.detail) return;
        const b = h(p);
        if (!b || !b.hasAttribute || !b.hasAttribute("data-ln-table")) return;
        const m = p.detail.key, g = p.detail.values || [], _ = b.querySelectorAll("th");
        for (let i = 0; i < _.length; i++)
          if (_[i].getAttribute("data-ln-table-filter-col") === m) {
            const r = _[i].querySelector("[data-ln-table-col-filter]");
            r && r.classList.toggle("ln-filter-active", g.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(p) {
        const b = p.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!b) return;
        const m = b.closest("[data-ln-table]") || n.querySelector("[data-ln-table]");
        if (!m || !m.lnTable) return;
        const g = m.lnTable.name || m.id, _ = m.querySelectorAll("th");
        for (let f = 0; f < _.length; f++) {
          const v = _[f].querySelector("[data-ln-table-col-filter]");
          v && v.classList.remove("ln-filter-active");
        }
        const i = m.getAttribute("data-ln-table-source") || m.id, r = i ? document.getElementById(i) : null;
        if (r && r.hasAttribute("data-ln-search"))
          r.setAttribute("data-ln-search", "");
        else {
          const f = d(n, i);
          f && f.value !== "" && (f.value = "", f.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const l = o(n, i);
        for (let f = 0; f < l.length; f++) {
          const v = l[f].querySelector("[data-ln-filter-reset]");
          if (!v) continue;
          const w = l[f].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!v.checked || w) && (v.checked = !0, v.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        m.hasAttribute("data-ln-table-source") || C(m, "ln-table:request-clear-filters", { table: g });
      }
    }, n.addEventListener("ln-filter:change", s._handlers.filter), n.addEventListener("click", s._handlers.clear);
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, U(t, e, a, "ln-table-coordinator");
})();
(function() {
  const t = "data-ln-list", e = "lnList", a = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function h(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(G(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function p(i) {
    let r = i;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const f = getComputedStyle(r).overflowY;
      if (f === "auto" || f === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function b(i) {
    const r = i._scrollContainer || p(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function m(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function g(i) {
    if (!i) return 0;
    const r = getComputedStyle(i), l = parseFloat(r.marginTop) || 0, f = parseFloat(r.marginBottom) || 0;
    return i.offsetHeight + l + f;
  }
  function _(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(t) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const r = this;
    return this._onSetSearch = function(l) {
      const f = (l.detail && l.detail.query != null ? l.detail.query : l.detail && l.detail.term != null ? l.detail.term : "").trim();
      r.isDataDriven ? (r.currentSearch = f, C(i, "ln-list:search", {
        list: r.name,
        query: r.currentSearch
      }), r._requestData()) : (r._searchTerm = f.toLowerCase(), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), C(i, "ln-list:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(l) {
      l.preventDefault(), r._onSetSearch(l);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      r.isDataDriven ? (r.currentFilters = {}, r.currentSearch = "", C(i, "ln-list:clear-filters", { list: r.name }), r._requestData()) : (r._searchTerm = "", r._filters = {}, r._sortField = null, r._sortDir = null, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), C(i, "ln-list:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(l) {
      const f = l.detail || {}, v = f.data || [], w = f.total != null ? f.total : v.length;
      if (!(r._hasInitialSeed && !r.isLoaded && v.length === 0 && w === 0)) {
        if (r._windowed) {
          r._cache.ingest(f) && !f.provisional && i.classList.remove("ln-list--loading");
          return;
        }
        r._data = v, r._lastTotal = w, r._lastFiltered = f.filtered != null ? f.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, r._hasInitialSeed = !1, i.classList.remove("ln-list--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), C(i, "ln-list:rendered", {
          list: r.name,
          total: r.totalCount,
          visible: r.visibleCount
        });
      }
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(l) {
      const f = l.detail && l.detail.loading;
      i.classList.toggle("ln-list--loading", !!f), f && (r.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(l) {
      !r._windowed || !r._cache || r._cache.release(l.detail && l.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !r._windowed || !r._cache || r._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !r._windowed || !r._cache || r._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(l) {
      l.detail.field != null && (l.preventDefault(), r.currentSort = l.detail.direction === "none" ? null : { field: l.detail.field, direction: l.detail.direction }, r._requestData());
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(l) {
      if (l.target.closest("[data-ln-item-select]") || l.target.closest("[data-ln-item-action]") || l.target.closest("a") || l.target.closest("button") || l.ctrlKey || l.metaKey || l.button === 1) return;
      const f = l.target.closest("[data-ln-item]");
      if (!f) return;
      const v = f.getAttribute("data-ln-item-id"), w = f._lnRecord || {};
      C(i, "ln-list:item-click", {
        list: r.name,
        id: v,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(l) {
      const f = l.target.closest("[data-ln-item-action]");
      if (!f) return;
      const v = f.closest("[data-ln-item]");
      if (!v) return;
      const w = f.getAttribute("data-ln-item-action"), u = v.getAttribute("data-ln-item-id"), y = v._lnRecord || {};
      C(i, "ln-list:item-action", {
        list: r.name,
        id: u,
        action: w,
        record: y
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : C(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      r.tbody.children.length > 0 && (r._emptyObserver.disconnect(), r._emptyObserver = null, r._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(l) {
      if (l.preventDefault(), !l.detail) return;
      const f = l.detail.key, v = l.detail.values || [];
      if (f) {
        if (v.length === 0)
          delete r._filters[f];
        else {
          const w = [];
          for (let u = 0; u < v.length; u++)
            w.push(v[u].toLowerCase());
          r._filters[f] = w;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), C(i, "ln-list:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(l) {
      if (l.detail && l.detail.field == null) return;
      l.preventDefault();
      const f = l.detail && l.detail.direction === "none" ? null : l.detail && l.detail.direction;
      r._sortField = f === null ? null : l.detail && l.detail.field, r._sortDir = f, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), C(i, "ln-list:sorted", {
        field: r._sortField,
        direction: l.detail && l.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  _.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((r) => !r.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = g(i[0]) || 50);
    for (let r = 0; r < i.length; r++) {
      const l = i[r], f = l.getAttribute("data-ln-item-id") || l.getAttribute("id"), v = l.textContent.trim().toLowerCase();
      let w = null;
      if (this.isDataDriven) {
        w = {}, f != null && (w.id = f);
        const E = l.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < E.length; A++) {
          const L = E[A], T = L.getAttribute("data-ln-list-field");
          T && (w[T] = St(L));
        }
      }
      const u = {}, y = l.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let E = 0; E < y.length; E++) {
        const A = y[E], L = A.getAttribute("data-ln-list-field") || A.getAttribute("data-ln-field");
        L && (u[L] = St(A));
      }
      for (let E = 0; E < l.attributes.length; E++) {
        const A = l.attributes[E];
        if (A.name.startsWith("data-") && !A.name.startsWith("data-ln-")) {
          const L = A.name.slice(5);
          L && (u[L] = A.value);
        }
      }
      this._data.push({
        html: l.outerHTML,
        id: f,
        searchText: v,
        fields: u,
        ...w || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], l = this._filters || {}, f = Object.keys(l).length > 0;
      if (r.length === 0 && !f ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(v) {
        if (r.length > 0 && !r.every(function(u) {
          return v.searchText && v.searchText.indexOf(u) !== -1;
        }))
          return !1;
        if (f)
          for (const w in l) {
            const u = l[w];
            if (u && u.length > 0) {
              const y = v.fields && v.fields[w] !== void 0 ? v.fields[w] : v[w] !== void 0 ? v[w] : null, E = y != null ? String(y).toLowerCase() : "";
              if (u.indexOf(E) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const v = this._sortField, w = this._sortDir === "desc" ? -1 : 1, u = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, y = this._filteredData.map(function(A) {
          return A.fields && A.fields[v] !== void 0 ? A.fields[v] : A[v];
        }), E = ve(y);
        this._filteredData.sort(function(A, L) {
          const T = A.fields && A.fields[v] !== void 0 ? A.fields[v] : A[v], x = L.fields && L.fields[v] !== void 0 ? L.fields[v] : L[v];
          return we(T, x, E, u) * w;
        });
      }
    }
  }, _.prototype._render = function() {
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
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let f = 0; f < i.length; f++) {
        const v = this._buildItem(i[f]);
        v && r.appendChild(v);
      }
      const l = b(this);
      this.tbody.replaceChildren(r), m(l), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let f = 0; f < r.length; f++) i.push(r[f].html);
      const l = b(this);
      this.tbody.innerHTML = i.join(""), m(l), this._selectable && this._restoreSelection();
    }
  }, _.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), r = i.gridTemplateColumns;
    let l = 1;
    if (r && r !== "none") {
      const v = r.trim().split(/\s+/).filter(Boolean);
      v.length > 0 && (l = v.length);
    }
    const f = parseFloat(i.rowGap);
    return { columns: l, rowGap: isNaN(f) ? 0 : f };
  }, _.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), r = i ? this._buildItem(i) : this._buildPlaceholderItem();
      r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = g(r) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = g(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = g(i[0]) || 50);
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = p(this.dom);
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, l = this._itemHeight;
    if (!l || !r) return;
    const f = this._scrollContainer;
    let v, w;
    if (f) {
      const B = this.tbody.getBoundingClientRect(), H = f.getBoundingClientRect(), z = f === this.tbody ? 0 : B.top - H.top + f.scrollTop;
      v = f.scrollTop - z, w = f.clientHeight;
    } else {
      const H = this.tbody.getBoundingClientRect().top + window.scrollY;
      v = window.scrollY - H, w = window.innerHeight;
    }
    const u = this._readGridLayout(), y = u.columns, E = u.rowGap, A = l + E, L = Math.ceil(r / y);
    let T = Math.max(0, Math.floor(v / A) - 15);
    T = Math.min(T, L);
    const x = Math.ceil(w / A) + 30, I = Math.min(T + x, L), R = Math.min(T * y, r), M = Math.min(I * y, r);
    if (R === this._vStart && M === this._vEnd) return;
    this._vStart = R, this._vEnd = M;
    const P = T * A, N = (L - I) * A;
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
      const H = b(this);
      this.tbody.replaceChildren(B), m(H), this._selectable && this._updateSelectAll();
    } else {
      let B = "";
      P > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${P}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = R; z < M; z++)
        B += i[z].html;
      N > 0 && (B += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      const H = b(this);
      this.tbody.innerHTML = B, m(H), this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const r = this._scrollContainer;
    let l, f;
    if (r) {
      const H = this.tbody.getBoundingClientRect(), z = r.getBoundingClientRect(), Q = r === this.tbody ? 0 : H.top - z.top + r.scrollTop;
      l = r.scrollTop - Q, f = r.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      l = window.scrollY - z, f = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, u = v.rowGap, y = i + u, E = this._cache.logicalTotal, A = Math.ceil(E / w);
    let L = Math.max(0, Math.floor(l / y) - 15);
    L = Math.min(L, A);
    const T = Math.ceil(f / y) + 30, x = Math.min(L + T, A), I = Math.min(L * w, E), R = Math.min(x * w, E), M = L * y, P = (A - x) * y, N = document.createDocumentFragment();
    if (M > 0) {
      const H = document.createElement(this.isUl ? "li" : "div");
      H.className = "ln-list__spacer", H.setAttribute("aria-hidden", "true"), H.style.height = M + "px", N.appendChild(H);
    }
    for (let H = I; H < R; H++)
      if (this._cache.has(H)) {
        const z = this._buildItem(this._cache.get(H));
        z && N.appendChild(z);
      } else
        N.appendChild(this._buildPlaceholderItem());
    if (P > 0) {
      const H = document.createElement(this.isUl ? "li" : "div");
      H.className = "ln-list__spacer", H.setAttribute("aria-hidden", "true"), H.style.height = P + "px", N.appendChild(H);
    }
    const B = b(this);
    this.tbody.replaceChildren(N), m(B), this._vStart = I, this._vEnd = R, this._cache.ensure(I, R);
  }, _.prototype._showEmptyState = function() {
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, f = this.visibleCount === 0 && r > 0, v = f ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = mt(this.dom, v, "ln-list"), !i) {
        const w = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (w) {
          const u = f ? "search" : "initial", y = w.content.querySelector(`[data-ln-empty-when="${u}"]`) || w.content.firstElementChild;
          y && (i = document.importNode(y, !0));
        }
      }
    } else {
      const r = this.dom.querySelector(`template[${a}]`);
      if (r) {
        const l = r.content.firstElementChild;
        l && (i = document.importNode(l, !0));
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
    C(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._buildItem = function(i) {
    let r = mt(this.dom, this.name + "-row", "ln-list");
    if (!r) {
      const f = this.dom.querySelector("template[data-ln-item]");
      f && (r = document.importNode(f.content, !0));
    }
    let l = r ? r.querySelector("[data-ln-item]") || r.firstElementChild : null;
    if (l)
      Nt(l, i), st(l, i);
    else if (i && i.html) {
      const f = document.createElement(this.isUl ? "ul" : "div");
      f.innerHTML = i.html, l = f.firstElementChild;
    } else if (l = document.createElement(this.isUl ? "li" : "div"), l.setAttribute("data-ln-item", ""), i && typeof i == "object") {
      for (const f in i)
        if (f !== "html" && i[f] != null) {
          const v = document.createElement("span");
          v.setAttribute("data-ln-field", f), v.textContent = String(i[f]), l.appendChild(v);
        }
    }
    if (l._lnRecord = i, i && i.id != null && (l.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      l.classList.add("ln-item-selected");
      const f = l.querySelector("[data-ln-item-select]");
      f && (f.checked = !0);
    }
    return l;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let r = 0; r < i.length; r++) {
      const l = i[r].getAttribute("data-ln-item-id"), f = l != null && this.selectedIds.has(String(l));
      i[r].classList.toggle("ln-item-selected", f);
      const v = i[r].querySelector("[data-ln-item-select]");
      v && (v.checked = f);
    }
    this._updateSelectAll();
  }, _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(r) {
      const l = r.target.closest("[data-ln-item-select]");
      if (!l) return;
      const f = l.closest("[data-ln-item]");
      if (!f) return;
      const v = f.getAttribute("data-ln-item-id");
      v != null && (l.checked ? (i.selectedIds.add(String(v)), f.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(v)), f.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), C(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, l = i.tbody.querySelectorAll("[data-ln-item]");
      for (let f = 0; f < l.length; f++) {
        const v = l[f], w = v.getAttribute("data-ln-item-id"), u = v.querySelector("[data-ln-item-select]");
        w != null && (r ? (i.selectedIds.add(String(w)), v.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(w)), v.classList.remove("ln-item-selected")), u && (u.checked = r));
      }
      C(i.dom, "ln-list:select-all", { list: i.name, selected: r }), C(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let r = i.length > 0;
    for (let l = 0; l < i.length; l++) {
      const f = i[l].getAttribute("data-ln-item-id");
      if (f != null && !this.selectedIds.has(String(f))) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, _.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Xe(this, "ln-list:request-data", "list");
  }, _.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, l = parseInt(r.getAttribute("data-ln-list-window"), 10), f = parseInt(r.getAttribute("data-ln-list-window-page"), 10), v = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), C(r, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = ne(this._onCacheChange), this._cache = un({
      windowSize: l > 0 ? l : 1e3,
      pageSize: f > 0 ? f : 200,
      threshold: v >= 0 ? v : 25,
      fetchDebounce: 120,
      requestPage: function(w, u, y) {
        C(r, "ln-list:request-data", {
          list: i.name,
          sort: w.sort,
          filters: w.filters,
          search: w.search,
          offset: u,
          limit: y,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
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
  }, _.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, _.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const l = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = h(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = l ? h(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const f = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = f > 0 ? h(f, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", f === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, _, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, r) {
      const l = i[e];
      if (!(!l || !l.isDataDriven)) {
        if (r === "data-ln-list-window") {
          const f = i.hasAttribute("data-ln-list-window");
          if (f && !l._windowed)
            l._enterWindowedMode(), l._kickWindowInitial();
          else if (!f && l._windowed)
            l._exitWindowedMode();
          else if (f && l._windowed) {
            const v = parseInt(i.getAttribute("data-ln-list-window"), 10);
            v > 0 && l._cache.configure({ windowSize: v });
          }
          return;
        }
        if (!(!l._windowed || !l._cache)) {
          if (r === "data-ln-list-window-page") {
            const f = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            f > 0 && l._cache.configure({ pageSize: f });
          } else if (r === "data-ln-list-window-threshold") {
            const f = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            f >= 0 && l._cache.configure({ threshold: f });
          } else if (r === "data-ln-list-count") {
            const f = parseInt(i.getAttribute("data-ln-list-count"), 10);
            f >= 0 && l._cache.setGrandTotal(f);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  const a = "http://www.w3.org/2000/svg", d = 36, o = 16, c = 2 * Math.PI * o;
  function s(b) {
    return this.dom = b, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, h.call(this), p.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(b, m) {
    const g = document.createElementNS(a, b);
    for (const [_, i] of Object.entries(m))
      g.setAttribute(_, i);
    return g;
  }
  function h() {
    this.svg = n("svg", {
      viewBox: "0 0 " + d + " " + d,
      width: d,
      height: d
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: d / 2,
      cy: d / 2,
      r: o,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: d / 2,
      cy: d / 2,
      r: o,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": c,
      "stroke-dashoffset": c,
      transform: "rotate(-90 " + d / 2 + " " + d / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function p() {
    const b = this.dom.getAttribute("data-ln-circular-progress"), m = this.dom.getAttribute("data-ln-circular-progress-max"), g = _n(b, m || 100), _ = c - g.percentage / 100 * c;
    this.progressCircle.setAttribute("stroke-dashoffset", _);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), r = i !== null ? i : Math.round(g.percentage) + "%";
    this.labelEl.textContent = r, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(g.min)), this.dom.setAttribute("aria-valuemax", String(g.max)), this.dom.setAttribute("aria-valuenow", String(g.clampedValue)), this.dom.setAttribute("aria-valuetext", r), C(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: g.value,
      max: g.max,
      percentage: g.percentage
    });
  }
  U(t, e, s, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(b) {
      const m = b[e];
      m && p.call(m);
    }
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", a = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  function d(c) {
    this.dom = c, this.isEnabled = c.getAttribute(t) !== "disabled", this._dragging = null, c.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(n) {
      s.isEnabled && s._handlePointerDown(n);
    }, c.addEventListener("pointerdown", this._onPointerDown), this;
  }
  d.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, d.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), C(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, d.prototype._handlePointerDown = function(c) {
    let s = c.target.closest("[" + a + "]"), n;
    if (s) {
      for (n = s; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + a + "]")) return;
      for (n = c.target; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
      s = n;
    }
    const p = Array.from(this.dom.children).indexOf(n);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: n,
      index: p
    }).defaultPrevented) return;
    c.preventDefault(), s.setPointerCapture(c.pointerId), this._dragging = n, n.classList.add("ln-sortable--dragging"), n.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), C(this.dom, "ln-sortable:drag-start", {
      item: n,
      index: p
    });
    const m = this, g = function(i) {
      m._handlePointerMove(i);
    }, _ = function(i) {
      m._handlePointerEnd(i), s.removeEventListener("pointermove", g), s.removeEventListener("pointerup", _), s.removeEventListener("pointercancel", _);
    };
    s.addEventListener("pointermove", g), s.addEventListener("pointerup", _), s.addEventListener("pointercancel", _);
  }, d.prototype._handlePointerMove = function(c) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), n = this._dragging;
    for (const h of s)
      h.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const h of s) {
      if (h === n) continue;
      const p = h.getBoundingClientRect(), b = p.top + p.height / 2;
      if (c.clientY >= p.top && c.clientY < b) {
        h.classList.add("ln-sortable--drop-before");
        break;
      } else if (c.clientY >= b && c.clientY <= p.bottom) {
        h.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, d.prototype._handlePointerEnd = function(c) {
    if (!this._dragging) return;
    const s = this._dragging, n = Array.from(this.dom.children), h = n.indexOf(s);
    let p = null, b = null;
    for (const m of n) {
      if (m.classList.contains("ln-sortable--drop-before")) {
        p = m, b = "before";
        break;
      }
      if (m.classList.contains("ln-sortable--drop-after")) {
        p = m, b = "after";
        break;
      }
    }
    for (const m of n)
      m.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), p && p !== s) {
      b === "before" ? this.dom.insertBefore(s, p) : this.dom.insertBefore(s, p.nextElementSibling);
      const g = Array.from(this.dom.children).indexOf(s);
      C(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: h,
        newIndex: g
      });
    }
    this._dragging = null;
  };
  function o(c) {
    const s = c[e];
    if (!s) return;
    const n = c.getAttribute(t) !== "disabled";
    n !== s.isEnabled && (s.isEnabled = n, C(c, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: c }));
  }
  U(t, e, d, "ln-sortable", {
    onAttributeChange: o
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", a = "data-ln-confirm-timeout";
  if (window[e] !== void 0) return;
  function o(s) {
    const n = parseFloat(s.getAttribute(a));
    return isNaN(n) || n <= 0 ? 3 : n;
  }
  function c(s) {
    this.dom = s, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = s.querySelector("[data-ln-confirm-idle]"), this.activeEl = s.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = s.textContent.trim(), this.confirmText = s.getAttribute(t) || "Confirm?");
    const n = this;
    return this._onClick = function(h) {
      if (!Ye(h))
        if (!n.confirming)
          h.preventDefault(), h.stopImmediatePropagation(), n._enterConfirm();
        else {
          if (n._submitted) return;
          n._submitted = !0, h.stopPropagation(), n._reset();
        }
    }, s.addEventListener("click", this._onClick), this;
  }
  c.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = s.getAttribute("href"), s.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), C(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, c.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const s = this, n = o(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      s._reset();
    }, n);
  }, c.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalIconHref && s.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], C(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, U(t, e, c, "ln-confirm");
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const a = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function d(o) {
    this.dom = o, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = o.getAttribute("data-ln-translations-default") || "", this.placeholderLabel = o.getAttribute("data-ln-translations-placeholder") || "{lang} translation", this.removeLabel = o.getAttribute("data-ln-translations-remove-label") || "Remove {lang}", this.badgesEl = o.querySelector("[data-ln-translations-active]"), this.menuEl = o.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const c = o.getAttribute("data-ln-translations-locales");
    if (this.locales = a, c)
      try {
        this.locales = JSON.parse(c);
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
  d.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of o) {
      const s = c.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, d.prototype._detectExisting = function() {
    const o = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of o) {
      const s = c.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, d.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const o = this;
    let c = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      c++;
      const h = Qt("ln-translations-menu-item", "ln-translations");
      if (!h) return;
      const p = h.querySelector("[data-ln-translations-lang]");
      p.setAttribute("data-ln-translations-lang", n), p.textContent = this.locales[n], p.addEventListener("click", function(b) {
        b.ctrlKey || b.metaKey || b.button === 1 || (b.preventDefault(), b.stopPropagation(), o.menuEl.getAttribute("data-ln-toggle") === "open" && o.menuEl.setAttribute("data-ln-toggle", "close"), o.addLanguage(n));
      }), this.menuEl.appendChild(h);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = c === 0);
  }, d.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const o = this;
    this.activeLanguages.forEach(function(c) {
      const s = Qt("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", c);
      const h = n.querySelector("span");
      h.textContent = o.locales[c] || c.toUpperCase();
      const p = n.querySelector("button"), b = o.locales[c] || c.toUpperCase();
      p.setAttribute("aria-label", o.removeLabel.replace("{lang}", b)), p.addEventListener("click", function(m) {
        m.ctrlKey || m.metaKey || m.button === 1 || (m.preventDefault(), m.stopPropagation(), o.removeLanguage(c));
      }), o.badgesEl.appendChild(s);
    });
  }, d.prototype.addLanguage = function(o, c) {
    if (this.activeLanguages.has(o)) return;
    const s = this.locales[o] || o;
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: o,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(o), c = c || {};
    const h = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of h) {
      const b = p.getAttribute("data-ln-translatable"), m = p.getAttribute("data-ln-translations-prefix") || "", g = p.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!g) continue;
      const _ = g.cloneNode(g.tagName === "SELECT");
      m ? _.name = m + "[trans][" + o + "][" + b + "]" : _.name = "trans[" + o + "][" + b + "]", _.value = c[b] !== void 0 ? c[b] : "", _.removeAttribute("id"), "placeholder" in _ && (_.placeholder = this.placeholderLabel.replace("{lang}", s)), _.setAttribute("data-ln-translatable-lang", o);
      const i = p.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : g;
      r.parentNode.insertBefore(_, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: o,
      langName: s
    });
  }, d.prototype.removeLanguage = function(o) {
    if (!this.activeLanguages.has(o) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: o
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + o + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(o), this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: o
    });
  }, d.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, d.prototype.hasLanguage = function(o) {
    return this.activeLanguages.has(o);
  }, d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this.defaultLang, c = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of c)
      s.getAttribute("data-ln-translatable-lang") !== o && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, U(t, e, d, "ln-translations");
})();
const Wi = "ln-autosave:", Qi = 1e3;
function $i(t, e) {
  return e ? Wi + (t || "") + ":" + e : null;
}
function Xi(t, e = Qi) {
  if (t == null) return 0;
  if (t === "") return e;
  const a = parseInt(String(t), 10);
  return isNaN(a) || a < 0 ? e : a;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", a = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", o = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  function c(n) {
    const h = n.tagName;
    return h === "INPUT" || h === "TEXTAREA" || h === "SELECT";
  }
  function s(n) {
    const p = n.getAttribute(t) || n.id, b = $i(window.location.pathname, p);
    if (!b) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = b;
    let m = null;
    function g() {
      const l = Ze(n, { exclude: o });
      try {
        localStorage.setItem(b, JSON.stringify(l));
      } catch {
        return;
      }
      C(n, "ln-autosave:saved", { target: n, data: l });
    }
    function _() {
      let l;
      try {
        l = localStorage.getItem(b);
      } catch {
        return;
      }
      if (!l) return;
      let f;
      try {
        f = JSON.parse(l);
      } catch {
        return;
      }
      if (W(n, "ln-autosave:before-restore", { target: n, data: f }).defaultPrevented) return;
      const w = tn(n, f);
      for (let u = 0; u < w.length; u++)
        w[u].dispatchEvent(new Event("input", { bubbles: !0 })), w[u].dispatchEvent(new Event("change", { bubbles: !0 }));
      C(n, "ln-autosave:restored", { target: n, data: f });
    }
    function i() {
      try {
        localStorage.removeItem(b);
      } catch {
        return;
      }
      C(n, "ln-autosave:cleared", { target: n });
    }
    this._onFocusout = function(l) {
      const f = l.target;
      c(f) && f.name && !f.matches(o) && g();
    }, this._onChange = function(l) {
      const f = l.target;
      c(f) && f.name && !f.matches(o) && g();
    }, this._onSubmit = function() {
      i();
    }, this._onReset = function() {
      i();
    }, this._onClearClick = function(l) {
      l.target.closest("[" + a + "]") && i();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick);
    const r = Xi(n.getAttribute(d));
    return r > 0 && (this._onInput = function(l) {
      const f = l.target;
      !c(f) || !f.name || f.matches(o) || (m !== null && clearTimeout(m), m = setTimeout(g, r));
    }, n.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return m;
    }, _(), this;
  }
  s.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const n = this._getInputTimer();
        n !== null && clearTimeout(n);
      }
      C(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, s, "ln-autosave");
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  function a(d) {
    if (d.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", d.tagName), this;
    this.dom = d;
    const o = this;
    return this._onInput = function() {
      o._resize();
    }, d.addEventListener("input", this._onInput), this._resize(), this;
  }
  a.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, U(t, e, a, "ln-autoresize");
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const a = {
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
  }, d = {
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
  }, c = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let s = 0;
  function n(l) {
    return !!(d[l] || o[l] || c[l] || l === "link");
  }
  function h(l) {
    this.dom = l;
    const f = this;
    if (this._textarea = l.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", l), this;
    const v = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), v && this._surface.setAttribute("data-placeholder", v);
    const w = this._textarea.id;
    if (w) {
      const A = l.querySelector('label[for="' + w + '"]');
      A && (A.id || (A.id = w + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = w ? w + "-surface" : "ln-editor-surface-" + ++s;
    const u = this._textarea.value.trim();
    u && (this._surface.innerHTML = u);
    const y = l.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? l.insertBefore(this._surface, y.nextSibling) : l.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const A = y.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < A.length; L++) {
        const T = A[L].getAttribute("data-ln-editor-action");
        n(T) && A[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      f._syncToTextarea(), C(f.dom, "ln-editor:changed", {
        html: f._textarea.value,
        target: f.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const L = A.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const T = L.getAttribute("data-ln-editor-action");
      f._execAction(T);
    }, this._onPaste = function(A) {
      m(f, A);
    }, this._onKeydown = function(A) {
      i(f, A);
    }, this._onSelectionChange = function() {
      document.contains(f._surface) && f._updateActiveStates();
    }, this._onFocus = function() {
      C(f.dom, "ln-editor:focus", { target: f.dom });
    }, this._onBlur = function() {
      f._syncToTextarea(), C(f.dom, "ln-editor:blur", { target: f.dom });
    }, this._onTextareaInput = function() {
      f._surface.innerHTML !== f._textarea.value && (f._surface.innerHTML = f._textarea.value, C(f.dom, "ln-editor:changed", {
        html: f._textarea.value,
        target: f.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const L = A.detail && A.detail.html;
      L !== void 0 && (f._surface.innerHTML = L, f._syncToTextarea(), C(f.dom, "ln-editor:changed", {
        html: f._textarea.value,
        target: f.dom
      }));
    }, l.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        f._surface.innerHTML = f._textarea.value, C(l, "ln-editor:changed", {
          html: f._textarea.value,
          target: l
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, h.prototype._execAction = function(l) {
    if (!(!l || W(this.dom, "ln-editor:before-change", {
      action: l,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), d[l])
        document.execCommand(d[l], !1, null);
      else if (o[l]) {
        const v = o[l], w = p(this._surface);
        w && w.toLowerCase() === v ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + v + ">");
      } else c[l] ? document.execCommand(c[l], !1, null) : l === "link" ? r(this) : l === "unlink" ? document.execCommand("unlink", !1, null) : l === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, h.prototype._updateActiveStates = function() {
    const l = this.dom.querySelector('[role="toolbar"]');
    if (!l) return;
    const f = window.getSelection();
    if (!f || f.rangeCount === 0) return;
    const v = f.anchorNode;
    if (!v || !this._surface.contains(v)) return;
    const w = l.querySelectorAll("[data-ln-editor-action]");
    for (let u = 0; u < w.length; u++) {
      const y = w[u], E = y.getAttribute("data-ln-editor-action");
      let A = !1;
      if (d[E])
        try {
          A = document.queryCommandState(d[E]);
        } catch {
        }
      else if (o[E]) {
        const L = p(this._surface);
        A = L && L.toLowerCase() === o[E];
      } else if (c[E])
        try {
          A = document.queryCommandState(c[E]);
        } catch {
        }
      else E === "link" && (A = !!b(f.anchorNode, "A", this._surface));
      n(E) && y.setAttribute("aria-pressed", String(A)), A ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, h.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, h.prototype.setHTML = function(l) {
    this._surface && (this._surface.innerHTML = l, this._syncToTextarea(), C(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const l = this.dom.querySelector('[role="toolbar"]');
    l && (l.removeEventListener("mousedown", this._onMousedownToolbar), l.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const f = this._textarea ? this._textarea.form : null;
    if (f && this._onFormReset && f.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const v = this.dom.querySelector(".ln-editor__link-popover");
      v && v.remove();
    }
    C(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function p(l) {
    const f = window.getSelection();
    if (!f || f.rangeCount === 0) return null;
    let v = f.anchorNode;
    if (!v) return null;
    for (; v && v !== l; ) {
      if (v.nodeType === 1) {
        const w = v.tagName;
        if (w === "H2" || w === "H3" || w === "H4" || w === "BLOCKQUOTE" || w === "PRE" || w === "P")
          return w;
      }
      v = v.parentNode;
    }
    return null;
  }
  function b(l, f, v) {
    for (; l && l !== v; ) {
      if (l.nodeType === 1 && l.tagName === f)
        return l;
      l = l.parentNode;
    }
    return null;
  }
  function m(l, f) {
    f.preventDefault();
    let v = "";
    if (f.clipboardData && (v = f.clipboardData.getData("text/html"), !v)) {
      const u = f.clipboardData.getData("text/plain");
      u && (v = u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), v = "<p>" + v + "</p>");
    }
    if (!v) return;
    const w = g(v);
    w && document.execCommand("insertHTML", !1, w);
  }
  function g(l) {
    const f = document.createElement("div");
    return f.innerHTML = l, _(f), f.innerHTML;
  }
  function _(l) {
    const f = Array.from(l.childNodes);
    for (let v = 0; v < f.length; v++) {
      const w = f[v];
      if (w.nodeType !== 3) {
        if (w.nodeType !== 1) {
          l.removeChild(w);
          continue;
        }
        if (a[w.tagName]) {
          const u = Array.from(w.attributes);
          for (let y = 0; y < u.length; y++) {
            const E = u[y].name;
            if (w.tagName === "A" && E === "href") {
              const A = w.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || w.removeAttribute("href");
            } else
              w.removeAttribute(E);
          }
          w.tagName === "A" && w.setAttribute("rel", "noopener noreferrer"), _(w);
        } else {
          for (; w.firstChild; )
            l.insertBefore(w.firstChild, w);
          l.removeChild(w);
        }
      }
    }
  }
  function i(l, f) {
    if (!(f.ctrlKey || f.metaKey)) return;
    let v = null;
    switch (f.key.toLowerCase()) {
      case "b":
        v = "bold";
        break;
      case "i":
        v = "italic";
        break;
      case "u":
        v = "underline";
        break;
      case "k":
        v = "link";
        break;
    }
    v && (f.preventDefault(), l._execAction(v));
  }
  function r(l) {
    const f = window.getSelection();
    if (!f || f.rangeCount === 0) return;
    const v = b(f.anchorNode, "A", l._surface), w = f.getRangeAt(0).cloneRange();
    l._closeLinkPopover && l._closeLinkPopover();
    const u = mt(l.dom, "ln-editor-link-popover", "ln-editor");
    if (!u) return;
    const y = u.firstElementChild;
    if (!y) return;
    const E = y.querySelector('input[type="url"]'), A = y.querySelector('[data-ln-editor-action="confirm-link"]'), L = y.querySelector('[data-ln-editor-action="cancel-link"]');
    v && (E.value = v.getAttribute("href") || "");
    const T = l.dom.querySelector('[role="toolbar"]');
    T ? T.after(y) : l.dom.insertBefore(y, l._surface), E.focus();
    function x() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(w);
    }
    function I() {
      document.removeEventListener("mousedown", N), l._closeLinkPopover = null, y.remove();
    }
    function R() {
      const B = E.value.trim();
      if (I(), x(), l._surface.focus(), B)
        if (v)
          v.setAttribute("href", B), v.setAttribute("rel", "noopener noreferrer"), l._syncToTextarea(), C(l.dom, "ln-editor:changed", {
            html: l._textarea.value,
            target: l.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = b(H.anchorNode, "A", l._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), l._syncToTextarea());
          }
        }
      else v && document.execCommand("unlink", !1, null);
    }
    function M() {
      I(), x(), l._surface.focus();
    }
    function P() {
      I();
    }
    function N(B) {
      const H = l.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !y.contains(B.target) && !H && P();
    }
    l._closeLinkPopover = I, A.addEventListener("click", R), L.addEventListener("click", M), E.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), R()) : B.key === "Escape" && (B.preventDefault(), M());
    }), document.addEventListener("mousedown", N);
  }
  U(t, e, h, "ln-editor");
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function a(o) {
    const c = {}, s = o.dataset;
    for (const n in s) {
      if (!n.startsWith("lnFill") || e[n]) continue;
      const h = n.slice(6);
      h && (c[h.charAt(0).toLowerCase() + h.slice(1)] = s[n]);
    }
    return c;
  }
  function d(o, c) {
    const s = window.CSS && CSS.escape ? CSS.escape(c) : c, n = document.querySelectorAll('[data-ln-fill-id="' + s + '"]');
    if (n.length === 0) return null;
    for (let h = 0; h < n.length; h++) {
      const p = n[h].getAttribute("data-ln-fill-form");
      if (p) {
        const b = document.getElementById(p);
        if (b && o.contains(b)) return n[h];
      }
    }
    return n[0];
  }
  document.addEventListener("click", function(o) {
    if (o.ctrlKey || o.metaKey || o.button === 1) return;
    const c = o.target.closest("[data-ln-fill-form]");
    if (!c) return;
    const s = c.getAttribute("href");
    if (s && s.indexOf("#") !== -1) return;
    const n = c.getAttribute("data-ln-fill-form"), h = document.getElementById(n);
    if (!h) return;
    const p = a(c), b = Object.keys(p).length > 0;
    window.lnCore.lnFill(h, b ? p : null);
  }), document.addEventListener("ln-fill:request", function(o) {
    const c = o.detail;
    if (!c) return;
    const s = o.target, n = c.id;
    if (n == null) {
      window.lnCore.lnFill(s, null);
      return;
    }
    const h = d(s, n);
    if (!h) return;
    const p = a(h);
    window.lnCore.lnFill(s, p);
  }), window[t] = !0;
})();
function Yi(t, e = "-") {
  if (t == null) return "";
  const a = e || "-", d = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, a).replace(new RegExp(`${d}+`, "g"), a).replace(new RegExp(`^${d}+|${d}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  function a(d) {
    if (d.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", d.tagName), this;
    const o = d.form;
    if (!o)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", d), this;
    const c = d.getAttribute(t), s = o.elements[c];
    if (!s)
      return console.warn('[ln-slug] Source field "' + c + '" not found in form:', d), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + c + '" is a RadioNodeList (same-name group) — single source field required:', d), this;
    this.dom = d, this.source = s, this._pristine = d.value === "", this._mirroring = !1;
    const n = this;
    return this._onSource = function() {
      n._pristine && n._mirror();
    }, this._onSlug = function() {
      n._mirroring || (n._pristine = n.dom.value === "");
    }, s.addEventListener("input", this._onSource), d.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  a.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Yi(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, U(t, e, a, "ln-slug");
})();
function Ji(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const a = typeof e == "number" ? e : e.getTime(), d = t.getTime(), o = Math.floor((d - a) / 1e3), c = Math.abs(o);
  return c < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : c < 60 ? { value: o, unit: "second", isOlderThanMonth: !1 } : c < 3600 ? { value: Math.round(o / 60), unit: "minute", isOlderThanMonth: !1 } : c < 86400 ? { value: Math.round(o / 3600), unit: "hour", isOlderThanMonth: !1 } : c < 604800 ? { value: Math.round(o / 86400), unit: "day", isOlderThanMonth: !1 } : c < 2592e3 ? { value: Math.round(o / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(o / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function jt(t, e, a = /* @__PURE__ */ new Date()) {
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
      return e && e.getFullYear() !== a.getFullYear() && (d.year = "numeric"), d;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const a = {}, d = {};
  function o(y) {
    return y.getAttribute("data-ln-time-locale") || G(y);
  }
  function c(y, E) {
    const A = (y || "") + "|" + JSON.stringify(E);
    return a[A] || (a[A] = new Intl.DateTimeFormat(y, E)), a[A];
  }
  function s(y) {
    const E = y || "";
    return d[E] || (d[E] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), d[E];
  }
  const n = /* @__PURE__ */ new Set();
  let h = null;
  function p() {
    h || (h = setInterval(m, 6e4));
  }
  function b() {
    h && (clearInterval(h), h = null);
  }
  function m() {
    for (const y of n) {
      if (!document.body.contains(y.dom)) {
        n.delete(y);
        continue;
      }
      f(y);
    }
    n.size === 0 && b();
  }
  function g(y, E) {
    const A = yt(E), L = (E || "").toLowerCase().split("-")[0], T = c(E, jt("full", y)), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (A && x !== L && A.monthsLong) {
      const I = A.monthsLong[y.getMonth()], R = y.getDate(), M = y.getFullYear(), P = String(y.getHours()).padStart(2, "0"), N = String(y.getMinutes()).padStart(2, "0");
      return `${R} ${I} ${M} во ${P}:${N}`;
    }
    return T.format(y);
  }
  function _(y, E) {
    const A = jt("short", y), L = yt(E), T = (E || "").toLowerCase().split("-")[0], x = c(E, A), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && I !== T && L.monthsShort) {
      const R = L.monthsShort[y.getMonth()], M = y.getDate(), P = A.year ? " " + y.getFullYear() : "";
      return `${M} ${R}${P}`;
    }
    return x.format(y);
  }
  function i(y, E) {
    return c(E, jt("date", y)).format(y);
  }
  function r(y, E) {
    return c(E, jt("time", y)).format(y);
  }
  function l(y, E) {
    const A = Ji(y);
    return A.isOlderThanMonth ? _(y, E) : s(E).format(A.value, A.unit);
  }
  function f(y) {
    const E = y.dom.getAttribute("datetime");
    if (!E) return;
    const A = J(E);
    if (!A) return;
    const L = y.dom.getAttribute(t) || "short", T = o(y.dom);
    let x;
    switch (L) {
      case "relative":
        x = l(A, T);
        break;
      case "full":
        x = g(A, T);
        break;
      case "date":
        x = i(A, T);
        break;
      case "time":
        x = r(A, T);
        break;
      default:
        x = _(A, T);
        break;
    }
    y.dom.textContent = x, L !== "full" && (y.dom.title = g(A, T));
  }
  function v(y) {
    this.dom = y;
    const E = this;
    return this._onLocaleChange = function() {
      f(E);
    }, te(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), f(this), y.getAttribute(t) === "relative" && (n.add(this), p()), this;
  }
  v.prototype.render = function() {
    f(this);
  }, v.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), n.delete(this), n.size === 0 && b(), delete this.dom[e];
  };
  function w(y) {
    const E = y[e];
    if (!E) return;
    y.getAttribute(t) === "relative" ? (n.add(E), p()) : (n.delete(E), n.size === 0 && b()), f(E);
  }
  function u(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && f(y[e]);
  }
  U(t, e, v, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: w,
    onInit: u
  });
})();
function Zi(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, a = t.pageSize > 0 ? t.pageSize : 200, d = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const o = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let n = 0, h = 0, p = 0, b = !1, m = null;
  function g(r, l) {
    c.delete(r), c.set(r, l);
  }
  function _() {
    if (c.size <= e) return [];
    const r = [];
    for (; c.size > e; ) {
      const f = c.keys().next().value;
      r.push(c.get(f)), c.delete(f);
    }
    const l = new Set(c.values());
    return r.filter((f) => !l.has(f));
  }
  function i(r, l) {
    s.add(r), clearTimeout(m), m = setTimeout(() => o(r, a, l), d);
  }
  return {
    get logicalTotal() {
      return n;
    },
    set logicalTotal(r) {
      n = r;
    },
    get grandTotal() {
      return h;
    },
    set grandTotal(r) {
      h = r;
    },
    get queryGen() {
      return p;
    },
    set queryGen(r) {
      p = r;
    },
    get size() {
      return c.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return b;
    },
    getId: (r) => {
      if (!c.has(r)) return;
      const l = c.get(r);
      return g(r, l), l;
    },
    ensure: (r, l, f) => {
      if (!b && !s.has(0)) return i(0, f);
      if (n <= 0) return;
      const v = Math.max(0, r), w = Math.min(n, l);
      for (let u = v; u < w; u++)
        if (!c.has(u)) {
          const y = Math.floor(u / a) * a;
          if (!s.has(y)) return i(y, f);
        }
    },
    ingest: (r, l, f, v, w) => {
      if (w != null && w !== p) return [];
      b = !0, f != null && (h = f), v != null && (n = v);
      for (let u = 0; u < l.length; u++)
        g(r + u, l[u]);
      return s.delete(r), _();
    },
    reset: function() {
      p++, this.clear();
    },
    clear: () => {
      b = !1, c.clear(), s.clear(), clearTimeout(m);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (r = {}) => {
      let l = [];
      return r.windowSize > 0 && r.windowSize !== e && (e = r.windowSize, l = _()), r.pageSize > 0 && (a = r.pageSize), r.fetchDebounce >= 0 && (d = r.fetchDebounce), l;
    }
  };
}
function tr(t, e, a) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: o } = e, c = o === "desc", s = t.map((h) => h ? h[d] : void 0), n = ve(s);
  return [...t].sort((h, p) => {
    const b = h ? h[d] : void 0, m = p ? p[d] : void 0, g = we(b, m, n, a);
    return c ? -g : g;
  });
}
function Rn(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const a = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return a.length ? t.filter((d) => d ? a.every((o) => Se(d[o], e[o])) : !1) : t;
}
function er(t, e, a) {
  if (!Array.isArray(t) || !e || !a || !a.length) return t;
  const d = yn(e);
  return d.length ? t.filter((o) => o ? d.every(
    (c) => a.some((s) => {
      const n = o[s];
      return n != null && vn(String(n), [c]);
    })
  ) : !1) : t;
}
function nr(t, e, a) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (a === "count") return t.length;
  const d = t.map((c) => c && c[e] != null ? parseFloat(c[e]) : NaN).filter((c) => Number.isFinite(c)), o = d.reduce((c, s) => c + s, 0);
  return a === "sum" ? o : a === "avg" && d.length ? o / d.length : 0;
}
function ir(t, e = {}, a = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const o = t.length;
  let c = t;
  e.filters && (c = Rn(c, e.filters)), e.search && (c = er(c, e.search, a));
  const s = c.length;
  if (e.sort && (c = tr(c, e.sort, d)), e.offset || e.limit) {
    const n = e.offset || 0, h = e.limit || c.length;
    c = c.slice(n, n + h);
  }
  return { records: c, total: o, filtered: s };
}
function rr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((a) => {
    if (!a) return null;
    const d = { ...a };
    for (const [o, c] of Object.entries(e))
      if (typeof c == "function")
        try {
          d[o] = c(a);
        } catch {
          d[o] = void 0;
        }
    return d;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore", a = "data-ln-data-store-no-local-query";
  if (window[e] !== void 0) return;
  const d = "ln_app_cache", o = "_meta", c = "1.0";
  let s = null, n = null;
  const h = {};
  function p(S) {
    S && S.name === "QuotaExceededError" && C(document, "ln-data-store:quota-exceeded", { error: S });
  }
  function b() {
    const S = {};
    for (const q of document.querySelectorAll(`[${t}]`)) {
      const k = q.id;
      if (k) {
        const D = q.getAttribute("data-ln-data-store-indexes") || "";
        S[k] = {
          indexes: D.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return S;
  }
  function m() {
    return n || (n = new Promise((S) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), S(null);
      const q = b(), k = Object.keys(q), D = indexedDB.open(d);
      D.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), S(null);
      }, D.onsuccess = (O) => {
        const F = O.target.result, K = Array.from(F.objectStoreNames);
        if (!(!K.includes(o) || k.some((ot) => !K.includes(ot))))
          return g(F), s = F, S(F);
        const V = F.version;
        F.close();
        const $ = indexedDB.open(d, V + 1);
        $.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, $.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), S(null);
        }, $.onupgradeneeded = (ot) => {
          const Z = ot.target.result;
          Z.objectStoreNames.contains(o) || Z.createObjectStore(o, { keyPath: "key" });
          for (const _t of k)
            if (!Z.objectStoreNames.contains(_t)) {
              const qt = Z.createObjectStore(_t, { keyPath: "id" });
              for (const se of q[_t].indexes)
                qt.createIndex(se, se, { unique: !1 });
            }
        }, $.onsuccess = (ot) => {
          const Z = ot.target.result;
          g(Z), s = Z, S(Z);
        };
      };
    }), n);
  }
  function g(S) {
    S.onversionchange = () => {
      S.close(), s = null, n = null;
    };
  }
  function _() {
    return s ? Promise.resolve(s) : (n = null, m());
  }
  async function i(S) {
    if (!ht() || !S) return S;
    const q = { ...S }, k = q.id, D = await si(q);
    return !D || !D.encrypted ? S : {
      id: k,
      encrypted: !0,
      iv: D.iv,
      data: D.data
    };
  }
  async function r(S) {
    return !S || !S.encrypted || !ht() ? S : ai(S);
  }
  const l = (S, q) => _().then((k) => k ? k.transaction(S, q).objectStore(S) : null);
  function f(S) {
    return new Promise((q, k) => {
      S.onsuccess = () => q(S.result), S.onerror = () => {
        p(S.error), k(S.error);
      };
    });
  }
  const v = (S) => l(S, "readonly").then((q) => q ? f(q.getAll()) : []).then((q) => ht() ? Promise.all(q.map((k) => r(k))) : q), w = (S, q) => l(S, "readonly").then((k) => k ? f(k.get(q)) : null).then((k) => k ? r(k) : null), u = (S, q) => _().then((k) => {
    if (!k) return [];
    const O = k.transaction(S, "readonly").objectStore(S), F = q.map((K) => f(O.get(K)));
    return Promise.all(F).then((K) => ht() ? Promise.all(K.map((j) => r(j))) : K);
  }), y = (S, q) => (ht() ? i(q) : Promise.resolve(q)).then((D) => l(S, "readwrite").then((O) => O ? f(O.put(D)) : null)), E = (S, q) => l(S, "readwrite").then((k) => k ? f(k.delete(q)) : null), A = (S) => l(S, "readwrite").then((q) => q ? f(q.clear()) : null), L = (S) => l(S, "readonly").then((q) => q ? f(q.count()) : 0), T = (S) => l(o, "readonly").then((q) => q ? f(q.get(S)) : null), x = (S, q) => l(o, "readwrite").then((k) => {
    if (k)
      return q.key = S, f(k.put(q));
  });
  function I(S, q, k) {
    const D = S.getAttribute(q);
    if (D === "never" || D === "-1") return -1;
    const O = parseInt(D, 10);
    return isNaN(O) ? k : O;
  }
  function R(S) {
    return this.dom = S, this._name = S.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", S), hi(this, S, {
      _staleThreshold: [I, "data-ln-data-store-stale", 300],
      _searchFields: [ui, "data-ln-data-store-search-fields"],
      noLocalQuery: [di, a],
      _windowSize: [Oe, "data-ln-data-store-window", 1e3],
      _windowPageSize: [Oe, "data-ln-data-store-window-page", 200]
    }), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, S.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Zi({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (q, k, D) => {
        C(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: q,
          limit: k,
          query: D,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), h[this._name] = this, M(this), this.ready = re(this), this;
  }
  function M(S) {
    S._handlers = {
      create: (q) => P(S, "create", q.detail, () => B(S, q.detail)),
      update: (q) => P(S, "update", q.detail, () => H(S, q.detail)),
      delete: (q) => P(S, "delete", q.detail, () => z(S, q.detail)),
      "bulk-delete": (q) => P(S, "bulk-delete", q.detail, () => Q(S, q.detail)),
      "sync-failed": (q) => {
        S.isSyncing = !1, C(S.dom, "ln-data-store:sync-error", {
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
        k !== S.query.search && (S.query.search = k, oe(S));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const k = q.detail && q.detail.key;
        if (!k) return;
        const D = (q.detail.values || []).slice(), O = S.query.filters[k];
        (O ? O.length === D.length && O.every((K, j) => K === D[j]) : !D.length) || (D.length ? S.query.filters[k] = D : delete S.query.filters[k], oe(S));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const k = q.detail && q.detail.field, D = q.detail && q.detail.direction, O = D && D !== "none" ? { field: k, direction: D } : null, F = S.query.sort;
        !F && !O || F && O && F.field === O.field && F.direction === O.direction || (S.query.sort = O, oe(S));
      }
    };
    for (const [q, k] of Object.entries(S._queryHandlers))
      S.dom.addEventListener(q, k);
  }
  function P(S, q, k, D) {
    const O = k && k.requestId;
    return S._mutationChain = S._mutationChain.then(() => S.ready).then(() => {
      if (S.initializationError) throw S.initializationError;
      return D();
    }).catch((F) => Lt(S, q, O, F)), S._mutationChain;
  }
  function N(S, q = 0) {
    return L(S._name).then((k) => {
      if (S._windowIndex || S.windowed) {
        const D = S.totalCount != null ? S.totalCount : k;
        S.totalCount = Math.max(0, D + q);
      } else
        S.totalCount = k;
      return S.hasCache = !0, S.isLoaded = !0, S.canServe = !0, x(S._name, {
        schema_version: c,
        last_synced_at: S.lastSyncedAt,
        has_cache: !0,
        record_count: S.totalCount
      });
    });
  }
  function B(S, { tempId: q, data: k = {}, requestId: D } = {}) {
    const O = { ...k, id: q };
    return y(S._name, O).then(() => N(S, 1)).then(() => {
      C(S.dom, "ln-data-store:created", { store: S._name, record: O, tempId: q, requestId: D });
    });
  }
  function H(S, { id: q, data: k = {}, requestId: D } = {}) {
    return w(S._name, q).then((O) => {
      if (!O) throw new Error(`Record not found: ${q}`);
      const F = { ...O, ...k }, K = k.id;
      return (K !== void 0 && K !== q ? Fn(S._name, q, F) : y(S._name, F)).then(() => N(S, 0)).then(() => {
        C(S.dom, "ln-data-store:updated", { store: S._name, record: F, previous: O, requestId: D });
      });
    });
  }
  function z(S, { id: q, requestId: k } = {}) {
    return w(S._name, q).then((D) => {
      if (!D) {
        C(S.dom, "ln-data-store:deleted", { store: S._name, id: q, requestId: k, missing: !0 });
        return;
      }
      return E(S._name, q).then(() => N(S, -1)).then(() => {
        C(S.dom, "ln-data-store:deleted", { store: S._name, id: q, requestId: k });
      });
    });
  }
  function Q(S, { ids: q = [], requestId: k } = {}) {
    return q.length ? Promise.all(q.map((D) => w(S._name, D))).then((D) => {
      const O = D.filter(Boolean).map((F) => F.id);
      return Ht(S._name, O).then(() => N(S, -O.length)).then(() => {
        C(S.dom, "ln-data-store:deleted", { store: S._name, ids: O, requestId: k });
      });
    }) : (C(S.dom, "ln-data-store:deleted", { store: S._name, ids: [], requestId: k }), Promise.resolve());
  }
  function Lt(S, q, k, D) {
    console.error("[ln-data-store] " + q + " failed:", D), C(S.dom, "ln-data-store:mutation-error", {
      store: S._name,
      action: q,
      requestId: k,
      error: D
    });
  }
  function re(S) {
    return m().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return T(S._name);
    }).then((q) => {
      if (S.initializationError = null, q && q.schema_version === c)
        S.lastSyncedAt = q.last_synced_at || null, S.totalCount = q.record_count || 0, S.hasCache = q.has_cache === !0 || S.totalCount > 0, S.hasCache && (S.isLoaded = !0, S.canServe = !0, C(S.dom, "ln-data-store:ready", { store: S._name, count: S.totalCount, source: "cache" })), S.isInitialized = !0, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: S.hasCache, lastSyncedAt: S.lastSyncedAt, count: S.totalCount });
      else {
        if (q && q.schema_version !== c)
          return A(S._name).then(() => x(S._name, { schema_version: c, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            S.isInitialized = !0, S.hasCache = !1, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        S.isInitialized = !0, S.hasCache = !1, C(S.dom, "ln-data-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (S.isInitialized = !0, S.isLoaded = !1, S.canServe = !1, S.hasCache = !1, S.isSyncing = !1, S.initializationError = q, C(S.dom, "ln-data-store:initialization-error", { store: S._name, error: q }), { ok: !1, error: q }));
  }
  function lt(S) {
    S.isSyncing = !0, C(S.dom, "ln-data-store:request-remote-sync", { since: S.lastSyncedAt });
  }
  function Bt(S, q) {
    return _().then((k) => k ? (ht() ? Promise.all(q.map((O) => i(O))) : Promise.resolve(q)).then((O) => new Promise((F, K) => {
      const j = k.transaction(S, "readwrite"), V = j.objectStore(S);
      O.forEach(($) => V.put($)), j.oncomplete = () => F(), j.onerror = () => {
        p(j.error), K(j.error);
      };
    })) : void 0);
  }
  function Ht(S, q) {
    return _().then((k) => {
      if (k)
        return new Promise((D, O) => {
          const F = k.transaction(S, "readwrite"), K = F.objectStore(S);
          q.forEach((j) => K.delete(j)), F.oncomplete = () => D(), F.onerror = () => O(F.error);
        });
    });
  }
  function Fn(S, q, k) {
    return (ht() ? i(k) : Promise.resolve(k)).then((O) => _().then((F) => {
      if (F)
        return new Promise((K, j) => {
          const V = F.transaction(S, "readwrite"), $ = V.objectStore(S);
          $.put(O), $.delete(q), V.oncomplete = () => K(), V.onerror = () => {
            p(V.error), j(V.error);
          };
        });
    }));
  }
  const Nn = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Pn(S) {
    return S ? Object.keys(S).filter((q) => Array.isArray(S[q]) && S[q].length > 0) : [];
  }
  function Bn(S, q, k) {
    return q.every((D) => k[D].map(String).includes(String(S[D])));
  }
  function Hn(S) {
    return String(S || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Un(S, q, k) {
    return q.every(
      (D) => k.some((O) => {
        const F = S[O];
        return F != null && String(F).toLowerCase().includes(D);
      })
    );
  }
  function zn(S, q, k) {
    return nr(S, q, k);
  }
  function Tt(S, q) {
    return rr(q, S.presenters && S.presenters.computed);
  }
  function Kn(S) {
    return !S.sort && !ht();
  }
  function jn(S, q, k) {
    const D = Pn(q.filters), O = q.search ? Hn(q.search) : [], F = S._searchFields, K = O.length > 0 && F && F.length > 0;
    return l(S._name, "readonly").then((j) => j ? new Promise((V, $) => {
      const ot = [], Z = j.openCursor();
      Z.onsuccess = () => {
        const _t = Z.result;
        if (!_t || ot.length >= k) {
          V(ot);
          return;
        }
        const qt = _t.value;
        (!D.length || Bn(qt, D, q.filters)) && (!K || Un(qt, O, F)) && ot.push(qt), _t.continue();
      }, Z.onerror = () => $(Z.error);
    }) : []);
  }
  function Te(S, q, k) {
    return ir(q, k, S._searchFields, Nn);
  }
  function qe(S, q, k) {
    const D = [];
    for (let F = q; F < q + k; F++) {
      const K = S._windowIndex.getId(F);
      D.push(K);
    }
    const O = Array.from(new Set(D.filter((F) => F !== void 0)));
    return u(S._name, O).then((F) => {
      const K = /* @__PURE__ */ new Map();
      for (let V = 0; V < F.length; V++) {
        const $ = F[V];
        $ && K.set(String($.id), $);
      }
      const j = [];
      for (let V = 0; V < D.length; V++) {
        const $ = D[V];
        if ($ === void 0)
          j.push(null);
        else {
          const ot = K.get(String($));
          j.push(ot || null);
        }
      }
      return {
        data: Tt(S, j),
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
      const k = S.offset || 0, D = S.limit || 200;
      if (q._windowIndex.ensure(k, k + D, S), !q._windowIndex.hasLoaded && !q.noLocalQuery) {
        const O = k + D, F = (K) => K.length ? {
          data: Tt(q, K),
          offset: k,
          queryGen: q._windowIndex.queryGen,
          provisional: !0
        } : qe(q, k, D);
        return Kn(S) ? jn(q, S, O).then((K) => F(K.slice(k, O))) : v(q._name).then((K) => F(Te(q, K, S).records));
      }
      return qe(q, k, D);
    }
    return v(q._name).then((k) => {
      const D = Te(q, k, S);
      return {
        data: Tt(q, D.records),
        total: D.total,
        filtered: D.filtered
      };
    });
  }, R.prototype.getById = function(S) {
    return w(this._name, S).then((q) => q ? Tt(this, [q])[0] : null);
  }, R.prototype.count = function(S) {
    return S && Object.keys(S).length > 0 ? v(this._name).then((k) => Rn(k, S).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, R.prototype.aggregate = function(S, q) {
    return v(this._name).then((k) => zn(k, S, q));
  }, R.prototype.setPresenters = function(S) {
    this.presenters = S;
  }, R.prototype.applySync = function(S, q, k, D) {
    D = D || {};
    const O = this;
    if (O._windowIndex && D.queryGen != null && D.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    S.length > 0 || q.length > 0;
    let F = Promise.resolve();
    return S.length > 0 && (F = F.then(() => Bt(O._name, S))), q.length > 0 && (F = F.then(() => Ht(O._name, q))), F.then(() => {
      if (O._windowIndex && (D.offset != null || D.total != null)) {
        const K = D.offset != null ? D.offset : 0, j = S.map(($) => $.id), V = O._windowIndex.ingest(K, j, D.total, D.filtered, D.queryGen);
        if (V && V.length) return Ht(O._name, V);
      }
    }).then(() => L(O._name)).then((K) => (O.totalCount = D.total !== void 0 ? D.total : K, O.hasCache = !0, x(O._name, {
      schema_version: c,
      last_synced_at: k,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const K = !O.isLoaded;
      O.isLoaded = !0, O.canServe = !0, O.isSyncing = !1, O.lastSyncedAt = k, K ? (C(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: D }), C(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: D })) : C(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: S.length,
        deleted: q.length,
        changed: !0,
        meta: D
      });
    }).catch((K) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, R.prototype.applyQuery = function(S, q) {
    q = q || {};
    const k = this;
    let D = Promise.resolve();
    return S.length > 0 && (D = D.then(() => Bt(k._name, S))), D.then(() => L(k._name)).then((O) => (k.totalCount = q.total !== void 0 ? q.total : O, S.length > 0 && (k.canServe = !0), Tt(k, S))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, R.prototype.forceSync = function() {
    this.isSyncing || lt(this);
  }, R.prototype.fullReload = function() {
    const S = this;
    return A(S._name).then(() => x(S._name, {
      schema_version: c,
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
    delete h[this._name], delete this.dom[e], C(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Vn() {
    return _().then((S) => {
      if (!S) return;
      const q = Array.from(S.objectStoreNames);
      return new Promise((k, D) => {
        const O = S.transaction(q, "readwrite");
        q.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => k(), O.onerror = () => D(O.error);
      });
    }).then(() => {
      Object.values(h).forEach((S) => {
        S.isLoaded = !1, S.canServe = !1, S.isInitialized = !1, S.initializationError = null, S.hasCache = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      });
    });
  }
  function oe(S) {
    S._windowIndex && S._windowIndex.reset(), C(S.dom, "ln-data-store:query-changed", {
      store: S._name,
      query: {
        filters: Object.assign({}, S.query.filters),
        search: S.query.search,
        sort: S.query.sort ? Object.assign({}, S.query.sort) : null
      }
    });
  }
  const Gn = "data-ln-data-store-frozen";
  function xe(S, q) {
    S.setAttribute(Gn, q);
  }
  function Wn(S) {
    const q = S[e];
    if (!q._windowIndex) return;
    const k = q._windowIndex.configure({ windowSize: q._windowSize });
    k.length && Ht(q._name, k).catch((D) => {
      console.error("[ln-data-store] window shrink eviction failed:", D);
    });
  }
  U(t, e, R, "ln-data-store", {
    effects: {
      "data-ln-data-store-window": Wn,
      "data-ln-data-store-window-page": (S) => {
        const q = S[e];
        q._windowIndex && q._windowIndex.configure({ pageSize: q._windowPageSize });
      },
      "data-ln-data-store-indexes": xe,
      "data-ln-data-store": xe
    }
  }), window[e].clearAll = Vn, window[e].init = window[e], window[e].setStorageKey = Re, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Re);
})();
const or = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function bt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, a) => {
    const d = String(e);
    return a === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function sr(t, e) {
  if (!t || typeof t != "object") return "";
  const a = Object.assign({}, or);
  if (e && typeof e == "object")
    for (const o in e)
      e[o] !== void 0 && e[o] !== null && e[o] !== "" && (a[o] = e[o]);
  const d = new URLSearchParams();
  return t.search && d.append(a.search, t.search), t.offset != null && d.append(a.offset, t.offset), t.limit != null && d.append(a.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(a.sortField, t.sort.field), d.append(a.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((o) => {
    const c = t.filters[o];
    Array.isArray(c) && c.length > 0 && d.append(o, c.join(","));
  }), d.toString();
}
function ar(t, e, a) {
  let d = bt(t, e);
  return a && (d += (d.indexOf("?") !== -1 ? "&" : "?") + a), d;
}
function je(t) {
  const e = t && t.content !== void 0 ? t.content : t, a = t && t.message ? t.message : null;
  return { record: e, message: a };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", a = "lnConnector";
  if (window[e] !== void 0) return;
  function d(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((h) => {
      const p = new Error("HTTP " + n.status + ": " + n.statusText);
      throw p.status = n.status, p.data = h, p;
    });
  }
  function o(n) {
    return this.dom = n, n[e] = this, n[a] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  o.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = n.getAttribute("data-ln-api-headers"), this.headers = ln(this.rawHeaders);
    const h = {}, p = n.getAttribute("data-ln-api-param-offset");
    p && (h.offset = p);
    const b = n.getAttribute("data-ln-api-param-limit");
    b && (h.limit = b);
    const m = n.getAttribute("data-ln-api-param-search");
    m && (h.search = m);
    const g = n.getAttribute("data-ln-api-param-sort-field");
    g && (h.sortField = g);
    const _ = n.getAttribute("data-ln-api-param-sort-dir");
    _ && (h.sortDir = _), this.paramKeys = h;
    const i = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = i !== null ? +i : 300, C(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, o.prototype._reqHeaders = function(n) {
    const h = Object.assign({}, this.headers);
    return !h.Accept && !h.accept && (h.Accept = "application/json"), !h["Content-Type"] && !h["content-type"] && (h["Content-Type"] = "application/json"), n && (h["X-Idempotency-Key"] = n), h;
  }, o.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, o.prototype.fetchDelta = function(n, h) {
    const p = this;
    let b = bt(p.baseUrl, p.path);
    n != null && n !== "" && (b += (b.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const m = h || "sync";
    p._inflight.has(m) && p._inflight.get(m).abort();
    const g = new AbortController();
    return p._inflight.set(m, g), window.fetch(b, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: g.signal
    }).then(d).finally(function() {
      p._inflight.get(m) === g && p._inflight.delete(m);
    });
  }, o.prototype.query = function(n, h) {
    const p = this, b = sr(n, p.paramKeys), m = ar(p.baseUrl, p.path, b), g = h || "query";
    p._inflight.has(g) && p._inflight.get(g).abort();
    const _ = new AbortController();
    return p._inflight.set(g, _), window.fetch(m, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: _.signal
    }).then(d).finally(function() {
      p._inflight.get(g) === _ && p._inflight.delete(g);
    });
  }, o.prototype.create = function(n, h, p) {
    const b = this;
    return window.fetch(bt(b.baseUrl, h || b.path), {
      method: "POST",
      headers: b._reqHeaders(p),
      credentials: b.credentials,
      body: JSON.stringify(n)
    }).then(d);
  }, o.prototype.update = function(n, h, p, b, m) {
    const g = this;
    p != null && (h = Object.assign({}, h, { expected_version: p }));
    const _ = b ? bt(g.baseUrl, b) : bt(g.baseUrl, g.path, n);
    return window.fetch(_, {
      method: "PUT",
      headers: g._reqHeaders(m),
      credentials: g.credentials,
      body: JSON.stringify(h)
    }).then(d);
  }, o.prototype.delete = function(n, h, p) {
    const b = this;
    return window.fetch(bt(b.baseUrl, h || b.path, n), {
      method: "DELETE",
      headers: b._reqHeaders(p),
      credentials: b.credentials
    }).then(d);
  }, o.prototype.bulkDelete = function(n, h, p) {
    const b = this;
    return window.fetch(bt(b.baseUrl, h || b.path, "bulk-delete"), {
      method: "DELETE",
      headers: b._reqHeaders(p),
      credentials: b.credentials,
      body: JSON.stringify({ ids: n })
    }).then(d);
  };
  function c(n) {
    n._handlers = {
      sync: function(h) {
        const p = h.detail || {}, b = p.meta && p.meta.targetEl ? p.meta.targetEl : null;
        n.fetchDelta(p.since, b).then(function(m) {
          C(n.dom, "ln-api-connector:fetched", { data: m, since: p.since, meta: p.meta || null });
        }).catch(function(m) {
          m && m.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            since: p.since,
            meta: p.meta || null
          });
        });
      },
      query: function(h) {
        const p = h.detail || {}, b = p.query || p, m = p.meta && p.meta.targetEl ? p.meta.targetEl : null, g = m || "query", _ = n.queryDebounce;
        function i(l, f, v) {
          n.query(f, v).then(function(w) {
            const u = w || {};
            C(n.dom, "ln-api-connector:fetched", {
              data: u.data || (Array.isArray(u) ? u : []),
              total: u.total,
              filtered: u.filtered,
              offset: f.offset,
              queryGen: f.queryGen,
              meta: l.meta || null
            });
          }).catch(function(w) {
            w && w.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
              action: "query",
              error: w.message,
              status: w.status || 0,
              data: w.data || null,
              meta: l.meta || null
            });
          });
        }
        if (_ === 0) {
          i(p, b, m);
          return;
        }
        n._queryTimers.has(g) && clearTimeout(n._queryTimers.get(g));
        const r = setTimeout(function() {
          n._queryTimers.delete(g), i(p, b, m);
        }, _);
        n._queryTimers.set(g, r);
      },
      cancel: function(h) {
        const p = h.detail || {}, b = p.meta && p.meta.targetEl ? p.meta.targetEl : p.targetEl || p.key;
        b && n.cancel(b);
      },
      create: function(h) {
        const p = h.detail || {};
        n.create(p.data, p.url, p.idempotencyKey).then(function(b) {
          const m = je(b);
          C(n.dom, "ln-api-connector:created", {
            record: m.record,
            tempId: p.tempId,
            message: m.message,
            meta: p.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
            action: "create",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            tempId: p.tempId,
            meta: p.meta || null
          });
        });
      },
      update: function(h) {
        const p = h.detail || {};
        n.update(p.id, p.data, p.expected_version, p.url, p.idempotencyKey).then(function(b) {
          const m = je(b);
          C(n.dom, "ln-api-connector:updated", {
            record: m.record,
            id: p.id,
            message: m.message,
            meta: p.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: p.id,
            conflictData: b.status === 409 ? b.data : null,
            meta: p.meta || null
          });
        });
      },
      delete: function(h) {
        const p = h.detail || {};
        n.delete(p.id, p.url, p.idempotencyKey).then(function(b) {
          const m = b && b.message ? b.message : null;
          C(n.dom, "ln-api-connector:deleted", {
            response: b,
            id: p.id,
            message: m,
            meta: p.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: p.id,
            meta: p.meta || null
          });
        });
      },
      bulkDelete: function(h) {
        const p = h.detail || {};
        n.bulkDelete(p.ids, p.url, p.idempotencyKey).then(function(b) {
          const m = b && b.message ? b.message : null;
          C(n.dom, "ln-api-connector:bulk-deleted", {
            response: b,
            ids: p.ids,
            message: m,
            meta: p.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            ids: p.ids,
            meta: p.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(h) {
      h.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(h) {
      h && clearTimeout(h);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), C(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[a];
  };
  function s(n) {
    const h = n[e];
    h && h.refreshConfig();
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
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", a = "lnConnector";
  if (window[e] !== void 0) return;
  function d(g) {
    const _ = g && g.content !== void 0 ? g.content : g, i = g && g.message ? g.message : null;
    return { content: _, message: i };
  }
  function o(g) {
    return this.dom = g, g[e] = this, g[a] = this, this.refreshConfig(), this._handlers = null, b(this), this;
  }
  o.prototype.refreshConfig = function() {
    const g = this.dom;
    this.url = g.getAttribute("data-ln-couchdb-url") || "", this.db = g.getAttribute("data-ln-couchdb-db") || "", this.auth = g.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const _ = g.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ln(_, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), _.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), C(g, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function c(g, _, i) {
    const r = Object.assign({}, xt(g.headers, g.auth), i || {});
    return _ && (r["Idempotency-Key"] = _), r;
  }
  o.prototype.fetchDelta = function(g) {
    const _ = this, i = ["include_docs=true", "feed=normal"];
    g && i.push("since=" + encodeURIComponent(g));
    const r = ut(_.url, _.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: xt(_.headers, _.auth), credentials: _.credentials }).then((l) => {
      if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
      return l.json();
    }).then((l) => {
      const f = l.results || [];
      return {
        data: f.filter((v) => !v.deleted && v.doc).map((v) => Object.assign({}, v.doc, { id: v.doc._id })),
        deleted: f.filter((v) => v.deleted).map((v) => v.id),
        synced_at: l.last_seq || g || ""
      };
    });
  };
  function s(g, _, i) {
    const r = Object.assign({ _id: _.id }, _);
    return r._id || delete r._id, window.fetch(ut(g.url, g.db), {
      method: "POST",
      headers: c(g, i),
      credentials: g.credentials,
      body: JSON.stringify(r)
    }).then((l) => {
      if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
      return l.json();
    }).then((l) => {
      const f = d(l), v = f.content;
      return { record: Object.assign({}, r, { id: v.id, _id: v.id, _rev: v.rev }), message: f.message };
    });
  }
  o.prototype.create = function(g, _) {
    return s(this, g, _).then((i) => i.record);
  };
  function n(g, _, i, r) {
    const l = Object.assign({ id: String(_), _id: String(_) }, i), f = l._rev || l.rev;
    return (f ? Promise.resolve(f) : window.fetch(ut(g.url, g.db, null, _), { method: "GET", headers: xt(g.headers, g.auth), credentials: g.credentials }).then((w) => {
      if (!w.ok) throw new Error("Could not retrieve document for revision mapping");
      return w.json().then((u) => u._rev);
    })).then((w) => {
      const u = Object.assign({}, l, { _rev: w });
      delete u.rev;
      const y = c(g, r, { "If-Match": w });
      return window.fetch(ut(g.url, g.db, null, _), {
        method: "PUT",
        headers: y,
        credentials: g.credentials,
        body: JSON.stringify(u)
      }).then((E) => {
        if (E.ok) return E.json().then((A) => {
          const L = d(A);
          return { record: Object.assign({}, u, { _rev: L.content.rev }), message: L.message };
        });
        if (E.status === 409) return E.json().then((A) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = A, L;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  o.prototype.update = function(g, _, i) {
    return n(this, g, _, i).then((r) => r.record);
  };
  function h(g, _, i, r) {
    return (i ? Promise.resolve(i) : window.fetch(ut(g.url, g.db, null, _), { method: "GET", headers: xt(g.headers, g.auth), credentials: g.credentials }).then((f) => {
      if (!f.ok) throw new Error("Could not retrieve document for revision delete");
      return f.json().then((v) => v._rev);
    })).then((f) => {
      const v = ut(g.url, g.db, null, _) + "?rev=" + encodeURIComponent(f);
      return window.fetch(v, { method: "DELETE", headers: c(g, r), credentials: g.credentials }).then((w) => {
        if (!w.ok) throw new Error("HTTP " + w.status + ": " + w.statusText);
        return w.json();
      }).then((w) => {
        const u = d(w);
        return { response: u.content, message: u.message };
      });
    });
  }
  o.prototype.delete = function(g, _, i) {
    return h(this, g, _, i).then((r) => r.response);
  };
  function p(g, _, i) {
    return !_ || _.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(ut(g.url, g.db, "_all_docs"), {
      method: "POST",
      headers: xt(g.headers, g.auth),
      credentials: g.credentials,
      body: JSON.stringify({ keys: _ })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const f = (r.rows || []).filter((v) => !v.error && v.value && v.value.rev).map((v) => ({ _id: v.id, _rev: v.value.rev, _deleted: !0 }));
      return f.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(ut(g.url, g.db, "_bulk_docs"), {
        method: "POST",
        headers: c(g, i),
        credentials: g.credentials,
        body: JSON.stringify({ docs: f })
      }).then((v) => {
        if (!v.ok) throw new Error("HTTP " + v.status + ": " + v.statusText);
        return v.json();
      }).then((v) => {
        const w = d(v);
        return { response: { ok: !0, results: w.content, deletedCount: f.length }, message: w.message };
      });
    });
  }
  o.prototype.bulkDelete = function(g, _) {
    return p(this, g, _).then((i) => i.response);
  };
  function b(g) {
    g._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        g.fetchDelta(r.since).then(function(l) {
          C(g.dom, "ln-couchdb-connector:fetched", { data: l, since: r.since, meta: r.meta || null });
        }).catch(function(l) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: l.message,
            status: l.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(i) {
        const r = i.detail || {};
        s(g, r.data, r.idempotencyKey).then(function(l) {
          C(g.dom, "ln-couchdb-connector:created", { record: l.record, tempId: r.tempId, message: l.message, meta: r.meta || null });
        }).catch(function(l) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: l.message,
            status: l.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(i) {
        const r = i.detail || {}, l = Object.assign({}, r.data);
        r.expected_version !== void 0 && (l._rev = r.expected_version), n(g, r.id, l, r.idempotencyKey).then(function(f) {
          C(g.dom, "ln-couchdb-connector:updated", { record: f.record, id: r.id, message: f.message, meta: r.meta || null });
        }).catch(function(f) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: f.message,
            status: f.status || 0,
            id: r.id,
            data: f.status === 409 ? f.data : null,
            conflictData: f.status === 409 ? f.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(i) {
        const r = i.detail || {};
        h(g, r.id, r.rev, r.idempotencyKey).then(function(l) {
          C(g.dom, "ln-couchdb-connector:deleted", { response: l.response, id: r.id, message: l.message, meta: r.meta || null });
        }).catch(function(l) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: l.message,
            status: l.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const r = i.detail || {};
        p(g, r.ids, r.idempotencyKey).then(function(l) {
          C(g.dom, "ln-couchdb-connector:bulk-deleted", { response: l.response, ids: r.ids, message: l.message, meta: r.meta || null });
        }).catch(function(l) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: l.message,
            status: l.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      g.dom.addEventListener(i + ":request-sync", g._handlers.sync), g.dom.addEventListener(i + ":request-fetch", g._handlers.sync), g.dom.addEventListener(i + ":request-create", g._handlers.create), g.dom.addEventListener(i + ":request-update", g._handlers.update), g.dom.addEventListener(i + ":request-delete", g._handlers.delete), g.dom.addEventListener(i + ":request-bulk-delete", g._handlers.bulkDelete);
    });
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const g = this;
    g._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(i) {
      g.dom.removeEventListener(i + ":request-sync", g._handlers.sync), g.dom.removeEventListener(i + ":request-fetch", g._handlers.sync), g.dom.removeEventListener(i + ":request-create", g._handlers.create), g.dom.removeEventListener(i + ":request-update", g._handlers.update), g.dom.removeEventListener(i + ":request-delete", g._handlers.delete), g.dom.removeEventListener(i + ":request-bulk-delete", g._handlers.bulkDelete);
    }), g._handlers = null), C(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[a];
  };
  function m(g) {
    const _ = g[e];
    _ && _.refreshConfig();
  }
  U(t, e, o, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: m
  });
})();
function lr(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function It(t, e) {
  const a = !t || !!t.initializationError, d = !!(t && t.noLocalQuery && !t.windowed);
  return e && (a || !t.canServe || d) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Vt(t, e, a) {
  return a === "store" && !!e && !(t && t.windowed);
}
function Ve(t, e) {
  const a = Object.assign({}, t);
  return e && (a.filters = e.filters, a.search = e.search, a.sort = e.sort), a;
}
class cr {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((a, d) => {
      this._pending.set(e, { resolve: a, reject: d });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const a = e || new Error("Mutation receipt registry closed");
    for (const d of this._pending.values()) d.reject(a);
    this._pending.clear();
  }
  _settle(e, a) {
    const d = e && e.requestId;
    if (!d) return !1;
    const o = this._pending.get(d);
    return o ? (this._pending.delete(d), a ? o.reject(e.error || new Error("Store mutation failed")) : o.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", a = "data-ln-data-coordinator-scope", d = "data-ln-data-coordinator-search", o = "data-ln-data-coordinator-filters", c = "data-ln-data-coordinator-sort-field", s = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  const n = /* @__PURE__ */ new Set();
  let h = !1, p = null, b = null, m = null;
  function g() {
    h || (h = !0, p = function() {
      C(document, "ln-data-coordinator:online", {}), n.forEach(function(u) {
        u._maybeSync();
      });
    }, b = function() {
      C(document, "ln-data-coordinator:offline", {});
    }, m = function() {
      document.visibilityState === "visible" && n.forEach(function(u) {
        const y = u.findChildren(), E = y.store;
        E && y.connector && E.isInitialized && !E.initializationError && !E.isSyncing && !u._noAutosync && (!E.hasCache || u._isStale()) && E.forceSync();
      });
    }, window.addEventListener("online", p), window.addEventListener("offline", b), document.addEventListener("visibilitychange", m));
  }
  function _() {
    h && (n.size > 0 || (window.removeEventListener("online", p), window.removeEventListener("offline", b), document.removeEventListener("visibilitychange", m), p = null, b = null, m = null, h = !1));
  }
  function i() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const E = Math.random() * 16 | 0;
        return (y === "x" ? E : E & 3 | 8).toString(16);
      });
    }
  }
  const r = ["ln-api-connector", "ln-couchdb-connector"];
  function l(u) {
    return u ? u.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : u.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function f(u) {
    const y = this;
    return this.dom = u, this._name = u.getAttribute("data-ln-data-coordinator") || u.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", u), u[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new cr(), this._dict = Zt(u, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = ne(function() {
      y._destroyed || y._refreshAll(null, !0);
    }), this.refreshConfig(), v(this), n.add(this), g(), this._checkInitialSync(), this;
  }
  Object.defineProperty(f.prototype, "_staleThreshold", {
    get: function() {
      const y = this.findChildren().storeEl, E = this.dom.getAttribute("data-ln-data-coordinator-stale") || (y ? y.getAttribute("data-ln-data-store-stale") : null);
      if (E === "never" || E === "-1") return -1;
      const A = parseInt(E, 10);
      return isNaN(A) ? 300 : A;
    }
  }), Object.defineProperty(f.prototype, "_noAutosync", {
    get: function() {
      const y = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (y ? y.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), f.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, f.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const y = this.findChildren().store;
    return !y || !y.lastSyncedAt ? !0 : Date.now() / 1e3 - y.lastSyncedAt > this._staleThreshold;
  }, f.prototype._maybeSync = function() {
    const u = this.findChildren(), y = u.store;
    !y || y.initializationError || !u.connector || this._noAutosync || !y.isInitialized || y.isSyncing || (!y.hasCache || this._isStale()) && y.forceSync();
  }, f.prototype._checkInitialSync = function() {
    const u = this, E = this.findChildren().store;
    E && Promise.resolve(E.ready).then(function() {
      if (u._destroyed) return;
      const A = u.findChildren(), L = A.store;
      if (L && L.initializationError) {
        u._reportReconciliationError("store-initialize", L.initializationError, null);
        return;
      }
      !L || !A.connector || u._noAutosync || L.isSyncing || (!L.hasCache || u._isStale()) && L.forceSync();
    }).catch(function(A) {
      u._destroyed || u._reportReconciliationError("store-initialize", A, null);
    });
  }, f.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const y = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    y && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(y)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(E) {
      return E;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(E) {
      return E;
    });
  }, f.prototype.findChildren = function() {
    const u = this.dom.querySelector("[data-ln-data-store]"), y = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), E = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: u,
      connectorEl: y,
      queueEl: E,
      store: u ? u.lnDataStore : null,
      connector: y ? y.lnApiConnector || y.lnCouchDbConnector : null,
      queue: E ? E.lnApiQueue : null
    };
  }, f.prototype._handleSubmitRecord = function(u) {
    const y = this.findChildren();
    if (!y.storeEl && !y.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const E = u.data || {}, A = E.id, L = E.expected_version, T = Object.assign({}, E);
    delete T.id, delete T.expected_version;
    const x = u.method.toUpperCase();
    x === "POST" ? this._fanOutCreate(y, T, u.action) : (x === "PUT" || x === "PATCH") && this._fanOutUpdate(y, A, T, L, u.action);
  }, f.prototype._fanOutCreate = function(u, y, E) {
    this.refreshMapper();
    const A = "_temp_" + i();
    u.storeEl && C(u.storeEl, "ln-data-store:request-create", { tempId: A, data: y }), u.queue ? C(u.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: A,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(y),
      expectedVersion: null,
      meta: { tempId: A, action: E }
    }) : u.connector && C(u.connectorEl, l(u.connectorEl) + ":request-create", {
      data: this.mapper.egress(y),
      url: E,
      meta: { entryId: i(), queued: !1, op: "create", tempId: A }
    });
  }, f.prototype._fanOutUpdate = function(u, y, E, A, L) {
    this.refreshMapper(), u.storeEl && C(u.storeEl, "ln-data-store:request-update", { id: y, data: E }), u.queue ? C(u.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: y,
      op: "update",
      targetId: y,
      payload: this.mapper.egress(E),
      expectedVersion: A,
      meta: { id: y, action: L }
    }) : u.connector && C(u.connectorEl, l(u.connectorEl) + ":request-update", {
      id: y,
      data: this.mapper.egress(E),
      expected_version: A,
      url: L,
      meta: { entryId: i(), queued: !1, op: "update", id: y }
    });
  }, f.prototype._fanOutDelete = function(u, y) {
    this.refreshMapper(), u.storeEl && C(u.storeEl, "ln-data-store:request-delete", { id: y }), u.queue ? C(u.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: y,
      op: "delete",
      targetId: y,
      payload: null,
      expectedVersion: null,
      meta: { id: y }
    }) : u.connector && C(u.connectorEl, l(u.connectorEl) + ":request-delete", {
      id: y,
      meta: { entryId: i(), queued: !1, op: "delete", id: y }
    });
  }, f.prototype._fanOutBulkDelete = function(u, y) {
    this.refreshMapper();
    const E = y.join(",");
    u.storeEl && C(u.storeEl, "ln-data-store:request-bulk-delete", { ids: y }), u.queue ? C(u.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: y },
      expectedVersion: null,
      meta: { bulkKey: E, ids: y }
    }) : u.connector && C(u.connectorEl, l(u.connectorEl) + ":request-bulk-delete", {
      ids: y,
      meta: { entryId: i(), queued: !1, op: "bulk-delete", bulkKey: E }
    });
  }, f.prototype._toastFromMessage = function(u) {
    u && C(window, "ln-toast:enqueue", {
      type: u.type || "success",
      title: u.title || "",
      message: u.body || ""
    });
  }, f.prototype._toastFromDict = function(u) {
    const y = this._dict[u];
    y && C(window, "ln-toast:enqueue", { type: "error", title: "", message: y });
  }, f.prototype._requestStoreMutation = function(u, y, E) {
    const A = u.storeEl;
    if (!A) return Promise.reject(new Error("Store element not found"));
    const L = i(), T = this._mutationReceipts.wait(L);
    return C(A, "ln-data-store:request-" + y, Object.assign({}, E, { requestId: L })), T;
  }, f.prototype._reportReconciliationError = function(u, y, E) {
    this._destroyed || C(this.dom, "ln-data-coordinator:error", {
      operation: u,
      error: y,
      meta: E || null
    });
  };
  function v(u) {
    u._handlers = {
      sync: function(y) {
        u.refreshMapper();
        const E = u.findChildren();
        if (!E.store || !E.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        C(E.connectorEl, l(E.connectorEl) + ":request-sync", { since: y.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(y) {
        const E = u.findChildren();
        if (!E.connectorEl) return;
        const A = y.detail || {};
        C(E.connectorEl, l(E.connectorEl) + ":request-query", {
          query: Object.assign({}, A.query, {
            offset: A.offset,
            limit: A.limit,
            queryGen: A.queryGen
          })
        });
      },
      reqCreate: function(y) {
        const E = u.findChildren();
        u._fanOutCreate(E, y.detail.data || {}, y.detail.action);
      },
      reqUpdate: function(y) {
        const E = u.findChildren();
        u._fanOutUpdate(E, y.detail.id, y.detail.data || {}, y.detail.expected_version, y.detail.action);
      },
      reqDelete: function(y) {
        const E = u.findChildren();
        u._fanOutDelete(E, y.detail.id);
      },
      reqBulkDelete: function(y) {
        const E = u.findChildren();
        u._fanOutBulkDelete(E, y.detail.ids || []);
      },
      queueFailed: function() {
        u._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(y) {
        u.refreshMapper();
        const E = u.findChildren();
        if (!E.store || !E.connector || !E.queue) return;
        const A = y.detail || {}, L = A.entryId, T = A.op, x = A.targetId, I = A.payload, R = A.expectedVersion, M = A.meta || {}, P = M.action || null, N = A.idempotencyKey || L;
        T === "create" ? C(E.connectorEl, l(E.connectorEl) + ":request-create", {
          data: I,
          url: P,
          idempotencyKey: N,
          meta: { entryId: L, queued: !0, op: "create", tempId: M.tempId }
        }) : T === "update" ? C(E.connectorEl, l(E.connectorEl) + ":request-update", {
          id: x,
          data: I,
          expected_version: R,
          url: P,
          idempotencyKey: N,
          meta: { entryId: L, queued: !0, op: "update", id: x }
        }) : T === "delete" ? C(E.connectorEl, l(E.connectorEl) + ":request-delete", {
          id: x,
          idempotencyKey: N,
          meta: { entryId: L, queued: !0, op: "delete", id: x }
        }) : T === "bulk-delete" ? C(E.connectorEl, l(E.connectorEl) + ":request-bulk-delete", {
          ids: I && I.ids ? I.ids : [],
          idempotencyKey: N,
          meta: { entryId: L, queued: !0, op: "bulk-delete", bulkKey: M.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", T);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(y) {
        const E = y.target;
        if (y.defaultPrevented) return;
        const A = E.hasAttribute(a) ? E.getAttribute(a) : null;
        if (A === null) return;
        let L;
        if (A ? L = u._owns(A) : L = E.closest("[data-ln-data-coordinator]") === u.dom, !L) return;
        const T = Zn(E);
        if (T !== "POST" && T !== "PUT" && T !== "PATCH") return;
        y.preventDefault();
        const x = Ze(E);
        delete x._method, delete x._token, u._handleSubmitRecord({ data: x, method: T, action: E.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(y) {
        const E = y.detail.meta || {}, A = u.findChildren();
        u.refreshMapper();
        const L = y.detail.data;
        let T = [], x = [], I = null;
        Array.isArray(L) ? (T = L, I = Math.floor(Date.now() / 1e3)) : L && (T = Array.isArray(L.data) ? L.data : [], x = Array.isArray(L.deleted) ? L.deleted : [], I = L.synced_at !== void 0 ? L.synced_at : L.since !== void 0 ? L.since : null);
        const R = T.map((M) => u.mapper.ingress(M));
        if (A.store && !A.store.initializationError)
          E.kind ? E.kind === "table" || E.kind === "list" || E.kind === "chart" ? A.store.applyQuery(R, { total: y.detail.total }).then(function(M) {
            E.queryGen != null && !u._isCurrentGen(E.targetEl, E.queryGen) || (C(E.targetEl, "ln-" + E.kind + ":set-loading", { loading: !1 }), C(E.targetEl, "ln-" + E.kind + ":set-data", {
              data: M,
              total: y.detail.total !== void 0 ? y.detail.total : M.length,
              filtered: y.detail.filtered !== void 0 ? y.detail.filtered : M.length,
              offset: y.detail.offset,
              queryGen: y.detail.queryGen
            }), u._boundDelivered.set(E.targetEl, !0));
          }) : E.kind === "options" ? A.store.applyQuery(R, { total: y.detail.total }).then(function() {
            return A.store.getAll({});
          }).then(function(M) {
            E.queryGen != null && !u._isCurrentGen(E.targetEl, E.queryGen) || C(E.targetEl, "ln-options:set-data", { data: M.data });
          }) : E.kind === "stat" && A.store.applyQuery(R, { total: y.detail.total }).then(function() {
            if (E.queryGen != null && !u._isCurrentGen(E.targetEl, E.queryGen)) return;
            const M = y.detail.filtered !== void 0 ? y.detail.filtered : y.detail.total !== void 0 ? y.detail.total : R.length;
            C(E.targetEl, "ln-stat:set-count", { count: M });
          }) : A.store.applySync(R, x, I || Math.floor(Date.now() / 1e3), {
            total: y.detail.total,
            filtered: y.detail.filtered,
            offset: y.detail.offset,
            queryGen: y.detail.queryGen,
            targetEl: E.targetEl
          });
        else if (E.targetEl && E.kind) {
          if (E.kind === "table" || E.kind === "list" || E.kind === "chart")
            C(E.targetEl, "ln-" + E.kind + ":set-loading", { loading: !1 }), C(E.targetEl, "ln-" + E.kind + ":set-data", {
              data: R,
              total: y.detail.total !== void 0 ? y.detail.total : R.length,
              filtered: y.detail.filtered !== void 0 ? y.detail.filtered : R.length,
              offset: y.detail.offset,
              queryGen: y.detail.queryGen
            }), u._boundDelivered.set(E.targetEl, !0);
          else if (E.kind === "options")
            C(E.targetEl, "ln-options:set-data", { data: R });
          else if (E.kind === "stat") {
            const M = y.detail.filtered !== void 0 ? y.detail.filtered : y.detail.total !== void 0 ? y.detail.total : R.length;
            C(E.targetEl, "ln-stat:set-count", { count: M });
          }
        }
      },
      connCreated: function(y) {
        const E = u.findChildren(), A = y.detail.meta || {}, L = u.mapper.ingress(y.detail.record);
        (E.storeEl ? u._requestStoreMutation(E, "update", { id: A.tempId, data: L }) : Promise.resolve()).then(function() {
          u._toastFromMessage(y.detail.message), A.queued && E.queue && C(E.queueEl, "ln-api-queue:resolve-create", {
            entryId: A.entryId,
            oldKey: A.tempId,
            newId: L.id
          });
        }).catch(function(x) {
          u._reportReconciliationError("create-reconcile", x, A);
        });
      },
      connUpdated: function(y) {
        const E = u.findChildren(), A = y.detail.meta || {}, L = u.mapper.ingress(y.detail.record);
        (E.storeEl ? u._requestStoreMutation(E, "update", { id: A.id, data: L }) : Promise.resolve()).then(function() {
          u._toastFromMessage(y.detail.message), A.queued && E.queue && C(E.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
        }).catch(function(x) {
          u._reportReconciliationError("update-reconcile", x, A);
        });
      },
      connDeleted: function(y) {
        const E = u.findChildren(), A = y.detail.meta || {};
        u._toastFromMessage(y.detail.message), A.queued && E.queue && C(E.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
      },
      connBulkDeleted: function(y) {
        const E = u.findChildren(), A = y.detail.meta || {};
        u._toastFromMessage(y.detail.message), A.queued && E.queue && C(E.queueEl, "ln-api-queue:ack", { entryId: A.entryId });
      },
      connError: function(y) {
        const E = y.detail || {}, A = E.meta || {}, L = A.op || E.action, T = E.status || E.error && E.error.status || 0, x = u.findChildren();
        if (L === "sync") {
          x.storeEl && C(x.storeEl, "ln-data-store:request-sync-failed", {
            error: E.error,
            status: T
          }), console.error("[ln-data-coordinator] Sync failed:", E.error);
          return;
        }
        if (L === "query") {
          A.targetEl && A.kind && (C(A.targetEl, "ln-" + A.kind + ":set-loading", { loading: !1 }), (A.kind === "table" || A.kind === "list") && C(A.targetEl, "ln-" + A.kind + ":page-failed", { offset: A.offset })), u._reportReconciliationError("query", E.error || E, A);
          return;
        }
        const I = T === 401 || T === 419, R = T === 0 || T >= 500, M = T === 409 || T === 412;
        if (I) {
          u._toastFromDict("auth"), A.queued && x.queue && C(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "auth" });
          return;
        }
        if (R) {
          A.queued && x.queue ? C(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "retry" }) : u._toastFromDict("network");
          return;
        }
        let P = Promise.resolve();
        if (M && L === "update") {
          const N = E.data && E.data.remote ? u.mapper.ingress(E.data.remote) : null;
          N && x.storeEl && (P = u._requestStoreMutation(x, "update", { id: A.id, data: N })), u._toastFromDict("conflict");
        } else L === "create" && x.storeEl && (P = u._requestStoreMutation(x, "delete", { id: A.tempId })), u._toastFromDict("rejected");
        A.queued && x.queue ? P.then(function() {
          C(x.queueEl, "ln-api-queue:nack", { entryId: A.entryId, reason: "drop" });
        }).catch(function(N) {
          u._reportReconciliationError("deterministic-reconcile", N, A);
        }) : P.catch(function(N) {
          u._reportReconciliationError("deterministic-reconcile", N, A);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(y) {
        const E = u.findChildren(), A = E.store;
        if (!A || A.initializationError || !E.connector || u._noAutosync || A.isSyncing) return;
        (y.detail || {}).hasCache ? u._isStale() && A.forceSync() : A.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(y) {
        u._serveData(y, "table");
      },
      reqListData: function(y) {
        u._serveData(y, "list");
      },
      reqChartData: function(y) {
        u._serveData(y, "chart");
      },
      reqOptions: function(y) {
        u._serveOptions(y);
      },
      reqStat: function(y) {
        u._serveStat(y);
      },
      refreshQuery: function() {
        u._refreshAll(null, !0);
      },
      refresh: function(y) {
        u._mutationReceipts.resolve(y.detail), u._refreshAll(null, !1);
      },
      mutationError: function(y) {
        u._mutationReceipts.reject(y.detail);
      },
      refreshSynced: function(y) {
        y.detail && y.detail.changed && u._refreshAll(y.detail.meta, !1);
      },
      searchChange: function(y) {
        y.preventDefault();
        const E = y.detail && y.detail.term != null ? y.detail.term : "";
        E !== (u.dom.getAttribute(d) || "") && u.dom.setAttribute(d, E);
      },
      filterChange: function(y) {
        y.preventDefault();
        const E = y.detail && y.detail.key;
        if (!E) return;
        const A = (y.detail.values || []).slice(), L = u._currentQuery().filters, T = L[E];
        if (T ? T.length === A.length && T.every((M, P) => M === A[P]) : !A.length) return;
        A.length ? L[E] = A : delete L[E];
        const I = new URLSearchParams();
        Object.keys(L).forEach(function(M) {
          L[M].forEach(function(P) {
            I.append(M, P);
          });
        });
        const R = I.toString();
        R ? u.dom.setAttribute(o, R) : u.dom.removeAttribute(o);
      },
      sortChange: function(y) {
        y.preventDefault();
        const E = y.detail && y.detail.field, A = y.detail && y.detail.direction, L = E && A && A !== "none" ? { field: E, direction: A } : null, T = u._currentQuery().sort;
        !T && !L || T && L && T.field === L.field && T.direction === L.direction || (L ? (u.dom.setAttribute(c, L.field), u.dom.setAttribute(s, L.direction)) : (u.dom.removeAttribute(c), u.dom.removeAttribute(s)));
      }
    }, u.dom.addEventListener("ln-data-store:request-remote-sync", u._handlers.sync), u.dom.addEventListener("ln-data-store:request-page", u._handlers.requestPage), u.dom.addEventListener("ln-data-coordinator:request-create", u._handlers.reqCreate), u.dom.addEventListener("ln-data-coordinator:request-update", u._handlers.reqUpdate), u.dom.addEventListener("ln-data-coordinator:request-delete", u._handlers.reqDelete), u.dom.addEventListener("ln-data-coordinator:request-bulk-delete", u._handlers.reqBulkDelete), u.dom.addEventListener("ln-api-queue:send", u._handlers.queueSend), u.dom.addEventListener("ln-api-queue:failed", u._handlers.queueFailed), u.dom.addEventListener("ln-data-store:initialized", u._handlers.storeInitialized), document.addEventListener("submit", u._handlers.formSubmit), r.forEach(function(y) {
      u.dom.addEventListener(y + ":fetched", u._handlers.connFetched), u.dom.addEventListener(y + ":created", u._handlers.connCreated), u.dom.addEventListener(y + ":updated", u._handlers.connUpdated), u.dom.addEventListener(y + ":deleted", u._handlers.connDeleted), u.dom.addEventListener(y + ":bulk-deleted", u._handlers.connBulkDeleted), u.dom.addEventListener(y + ":error", u._handlers.connError);
    }), document.addEventListener("ln-table:request-data", u._handlers.reqTableData), document.addEventListener("ln-list:request-data", u._handlers.reqListData), document.addEventListener("ln-chart:request-data", u._handlers.reqChartData), document.addEventListener("ln-options:request-data", u._handlers.reqOptions), document.addEventListener("ln-stat:request-count", u._handlers.reqStat), u.dom.addEventListener("ln-data-store:ready", u._handlers.refresh), u.dom.addEventListener("ln-data-store:created", u._handlers.refresh), u.dom.addEventListener("ln-data-store:updated", u._handlers.refresh), u.dom.addEventListener("ln-data-store:deleted", u._handlers.refresh), u.dom.addEventListener("ln-data-store:mutation-error", u._handlers.mutationError), u.dom.addEventListener("ln-data-store:synced", u._handlers.refreshSynced), u.dom.addEventListener("ln-data-store:query-changed", u._handlers.refreshQuery), u.dom.addEventListener("ln-search:change", u._handlers.searchChange), u.dom.addEventListener("ln-filter:change", u._handlers.filterChange), u.dom.addEventListener("ln-sort:change", u._handlers.sortChange);
  }
  f.prototype._owns = function(u) {
    return !!u && u === this._name;
  }, f.prototype._currentQuery = function() {
    const u = this.dom.getAttribute(c), y = this.dom.getAttribute(s), E = new URLSearchParams(this.dom.getAttribute(o) || ""), A = {};
    for (const L of new Set(E.keys())) A[L] = E.getAll(L);
    return {
      search: this.dom.getAttribute(d) || "",
      filters: A,
      sort: u && y ? { field: u, direction: y } : null
    };
  }, f.prototype._nextQueryGen = function(u) {
    const y = (this._queryGens.get(u) || 0) + 1;
    return this._queryGens.set(u, y), y;
  }, f.prototype._isCurrentGen = function(u, y) {
    return this._queryGens.get(u) === y;
  }, f.prototype._serveData = function(u, y) {
    const E = u.target, A = y === "table" ? "data-ln-table-source" : y === "list" ? "data-ln-list-source" : "data-ln-chart-source", L = E.getAttribute(A);
    if (!L || !this._owns(L)) return;
    const T = u.detail || {}, x = lr(T);
    this._boundQueries.set(E, x);
    const I = this.findChildren(), R = this, M = I.store;
    return (M && M.ready ? M.ready : Promise.resolve()).then(function() {
      if (R._destroyed) return;
      const N = It(M, I.connector), B = Ve(x, R._currentQuery());
      if (N === "remote") {
        C(E, "ln-" + y + ":set-loading", { loading: !0 }), C(I.connectorEl, l(I.connectorEl) + ":request-query", {
          query: B,
          meta: { targetEl: E, kind: y, offset: B.offset, limit: B.limit }
        });
        return;
      }
      if (N !== "store") {
        C(E, "ln-" + y + ":set-loading", { loading: !1 });
        return;
      }
      const H = Vt(M, I.connector, N), z = H ? R._nextQueryGen(E) : null;
      return H && C(I.connectorEl, l(I.connectorEl) + ":request-query", {
        query: B,
        meta: { targetEl: E, kind: y, offset: B.offset, limit: B.limit, queryGen: z }
      }), M.getAll(B).then(function(Q) {
        if (R._destroyed || !R._boundDelivered || H && !R._isCurrentGen(E, z)) return;
        const Lt = {
          data: Q.data,
          total: Q.total,
          filtered: Q.filtered,
          offset: T.offset !== void 0 ? T.offset : Q.offset,
          queryGen: T.queryGen !== void 0 ? T.queryGen : Q.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: H || Q.provisional === !0
        };
        C(E, "ln-" + y + ":set-data", Lt), R._boundDelivered.set(E, !0);
      });
    }).catch(function(N) {
      R._destroyed || (C(E, "ln-" + y + ":set-loading", { loading: !1 }), C(R.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: y,
        store: L,
        target: E,
        error: N
      }));
    });
  }, f.prototype._serveOptions = function(u) {
    const y = u.target, E = y.getAttribute("data-ln-options");
    if (!this._owns(E)) return;
    const A = this.findChildren(), L = A.store, T = L && L.ready ? L.ready : Promise.resolve(), x = this;
    return T.then(function() {
      if (x._destroyed) return;
      const I = It(L, A.connector);
      if (I === "remote") {
        C(A.connectorEl, l(A.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: y, kind: "options" }
        });
        return;
      }
      if (I !== "store") return;
      const R = Vt(L, A.connector, I), M = R ? x._nextQueryGen(y) : null;
      return R && C(A.connectorEl, l(A.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: y, kind: "options", queryGen: M }
      }), L.getAll({}).then(function(P) {
        x._destroyed || R && !x._isCurrentGen(y, M) || C(y, "ln-options:set-data", { data: P.data });
      });
    }).catch(function(I) {
      x._destroyed || x._reportReconciliationError("options-query", I, { targetEl: y, kind: "options" });
    });
  }, f.prototype._serveStat = function(u) {
    const y = u.target, E = y.getAttribute("data-ln-stat");
    if (!this._owns(E)) return;
    const A = u.detail && u.detail.filters ? u.detail.filters : null, L = this.findChildren(), T = L.store, x = T && T.ready ? T.ready : Promise.resolve(), I = this;
    return x.then(function() {
      if (I._destroyed) return;
      const R = A && Object.keys(A).length > 0, M = !!(L.connector && T && (T.windowed && R || T.noLocalQuery)), P = M ? "remote" : It(T, L.connector);
      if (P === "remote") {
        C(L.connectorEl, l(L.connectorEl) + ":request-query", {
          query: { filters: A },
          meta: { targetEl: y, kind: "stat" }
        });
        return;
      }
      if (P !== "store") return;
      const N = !M && Vt(T, L.connector, P), B = N ? I._nextQueryGen(y) : null;
      return N && C(L.connectorEl, l(L.connectorEl) + ":request-query", {
        query: { filters: A },
        meta: { targetEl: y, kind: "stat", queryGen: B }
      }), T.count(A).then(function(H) {
        I._destroyed || N && !I._isCurrentGen(y, B) || C(y, "ln-stat:set-count", { count: H });
      });
    }).catch(function(R) {
      I._destroyed || I._reportReconciliationError("stat-query", R, { targetEl: y, kind: "stat" });
    });
  }, f.prototype._refreshAll = function(u, y) {
    const E = this, A = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let L = 0; L < A.length; L++) {
      const T = A[L];
      let x, I;
      if (T.hasAttribute("data-ln-table-source") ? (x = T.getAttribute("data-ln-table-source"), I = "table") : T.hasAttribute("data-ln-list-source") ? (x = T.getAttribute("data-ln-list-source"), I = "list") : T.hasAttribute("data-ln-chart-source") ? (x = T.getAttribute("data-ln-chart-source"), I = "chart") : T.hasAttribute("data-ln-options") ? (x = T.getAttribute("data-ln-options"), I = "options") : T.hasAttribute("data-ln-stat") && (x = T.getAttribute("data-ln-stat"), I = "stat"), !E._owns(x)) continue;
      const R = E.findChildren(), M = R.store;
      if (I === "table" || I === "list") {
        const P = I === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (T.hasAttribute(P)) {
          C(T, "ln-" + I + (y ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (I === "table" || I === "list" || I === "chart") {
        const P = E._boundQueries.get(T) || { sort: null, filters: {}, search: "" }, N = Ve(P, E._currentQuery());
        if (It(M, R.connector) === "remote") {
          C(T, "ln-" + I + ":set-loading", { loading: !0 }), C(R.connectorEl, l(R.connectorEl) + ":request-query", {
            query: N,
            meta: { targetEl: T, kind: I, offset: N.offset, limit: N.limit }
          });
          continue;
        }
        const B = Vt(M, R.connector, It(M, R.connector)), H = B ? E._nextQueryGen(T) : null;
        B && C(R.connectorEl, l(R.connectorEl) + ":request-query", {
          query: N,
          meta: { targetEl: T, kind: I, offset: N.offset, limit: N.limit, queryGen: H }
        }), (function(z, Q, Lt, re) {
          M.getAll(N).then(function(lt) {
            if (E._destroyed || !E._boundDelivered || Lt && !E._isCurrentGen(z, re)) return;
            const Bt = {
              data: lt.data,
              total: u && u.total !== void 0 ? u.total : lt.total,
              filtered: u && u.filtered !== void 0 ? u.filtered : lt.filtered,
              offset: lt.offset !== void 0 ? lt.offset : u && u.offset !== void 0 ? u.offset : P.offset,
              queryGen: lt.queryGen !== void 0 ? lt.queryGen : u && u.queryGen !== void 0 ? u.queryGen : P.queryGen
            };
            C(z, "ln-" + Q + ":set-loading", { loading: !1 }), C(z, "ln-" + Q + ":set-data", Bt), E._boundDelivered.set(z, !0);
          }).catch(function() {
          });
        })(T, I, B, H);
      } else if (I === "options")
        (function(P) {
          M.getAll({}).then(function(N) {
            E._destroyed || C(P, "ln-options:set-data", { data: N.data });
          }).catch(function() {
          });
        })(T);
      else if (I === "stat") {
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
            E._destroyed || C(B, "ln-stat:set-count", { count: z });
          }).catch(function() {
          });
        })(T, N);
      }
    }
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const u = this;
    u._handlers && (u.dom.removeEventListener("ln-data-store:request-remote-sync", u._handlers.sync), u.dom.removeEventListener("ln-data-store:request-page", u._handlers.requestPage), u.dom.removeEventListener("ln-data-coordinator:request-create", u._handlers.reqCreate), u.dom.removeEventListener("ln-data-coordinator:request-update", u._handlers.reqUpdate), u.dom.removeEventListener("ln-data-coordinator:request-delete", u._handlers.reqDelete), u.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", u._handlers.reqBulkDelete), u.dom.removeEventListener("ln-api-queue:send", u._handlers.queueSend), u.dom.removeEventListener("ln-api-queue:failed", u._handlers.queueFailed), u.dom.removeEventListener("ln-data-store:initialized", u._handlers.storeInitialized), document.removeEventListener("submit", u._handlers.formSubmit), r.forEach(function(y) {
      u.dom.removeEventListener(y + ":fetched", u._handlers.connFetched), u.dom.removeEventListener(y + ":created", u._handlers.connCreated), u.dom.removeEventListener(y + ":updated", u._handlers.connUpdated), u.dom.removeEventListener(y + ":deleted", u._handlers.connDeleted), u.dom.removeEventListener(y + ":bulk-deleted", u._handlers.connBulkDeleted), u.dom.removeEventListener(y + ":error", u._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", u._handlers.reqTableData), document.removeEventListener("ln-list:request-data", u._handlers.reqListData), document.removeEventListener("ln-chart:request-data", u._handlers.reqChartData), document.removeEventListener("ln-options:request-data", u._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", u._handlers.reqStat), u.dom.removeEventListener("ln-data-store:ready", u._handlers.refresh), u.dom.removeEventListener("ln-data-store:created", u._handlers.refresh), u.dom.removeEventListener("ln-data-store:updated", u._handlers.refresh), u.dom.removeEventListener("ln-data-store:deleted", u._handlers.refresh), u.dom.removeEventListener("ln-data-store:mutation-error", u._handlers.mutationError), u.dom.removeEventListener("ln-data-store:synced", u._handlers.refreshSynced), u.dom.removeEventListener("ln-data-store:query-changed", u._handlers.refreshQuery), u.dom.removeEventListener("ln-search:change", u._handlers.searchChange), u.dom.removeEventListener("ln-filter:change", u._handlers.filterChange), u.dom.removeEventListener("ln-sort:change", u._handlers.sortChange), u._handlers = null), u._boundQueries = null, u._boundDelivered = null, u._queryGens = null, u._queueQueryRefresh = null, u._mutationReceipts.close(new Error("Data coordinator destroyed")), u._mutationReceipts = null, n.delete(this), _(), delete this.dom[e];
  };
  function w(u, y) {
    const E = u[e];
    if (E) {
      if (y === "data-ln-data-coordinator-mapper") {
        E.refreshMapper();
        return;
      }
      (y === d || y === o || y === c || y === s) && E._queueQueryRefresh();
    }
  }
  U(t, e, f, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-coordinator-mapper",
      d,
      o,
      c,
      s
    ],
    onAttributeChange: w
  });
})();
const dr = "ln_api_queue", ur = 2, X = "outbox", tt = "_queue_meta";
function it(t, e) {
  return t.error || new Error(e);
}
function Et(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function Ge(t) {
  return "seq:" + t;
}
function Gt(t) {
  return "paused:" + t;
}
function We(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function hr(t, e, a) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(a);
}
function fr(t, e, a, d) {
  const o = /* @__PURE__ */ new Map(), c = [], s = [];
  for (const n of t || [])
    o.has(n.chainKey) || o.set(n.chainKey, []), o.get(n.chainKey).push(n);
  return o.forEach((n, h) => {
    n.sort((b, m) => b.seq - m.seq);
    const p = n[0];
    if (!(!p || p.status === "failed")) {
      if (p.status === "inflight" && (p.leaseUntil || 0) > d) {
        s.push({ chainKey: h, at: p.leaseUntil });
        return;
      }
      if ((p.nextAttemptAt || 0) > d) {
        s.push({ chainKey: h, at: p.nextAttemptAt });
        return;
      }
      p.status = "inflight", p.leaseOwner = e, p.leaseUntil = d + a, p.updatedAt = d, c.push(p);
    }
  }), { entries: c, wakeups: s };
}
function pr(t, e, a, d, o) {
  const c = [], s = [];
  for (const n of t || []) {
    if (n.entryId === e) {
      s.push(n.entryId);
      continue;
    }
    n.chainKey === a && (n.chainKey = d, n.targetId === a && (n.targetId = d), n.meta && n.meta.id === a && (n.meta.id = d), n.meta && typeof n.meta.action == "string" && (n.meta.action = hr(n.meta.action, a, d)), n.updatedAt = o, c.push(n));
  }
  return { changed: c, deleted: s };
}
class mr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || dr, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, a) => {
      const d = this.indexedDB.open(this.dbName, ur);
      d.onupgradeneeded = (o) => {
        const c = o.target.result;
        let s;
        c.objectStoreNames.contains(X) ? s = o.target.transaction.objectStore(X) : s = c.createObjectStore(X, { keyPath: "entryId" }), s.indexNames.contains("by_scope_chain") || s.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), s.indexNames.contains("by_scope_seq") || s.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), c.objectStoreNames.contains(tt) || c.createObjectStore(tt, { keyPath: "key" });
      }, d.onerror = () => a(it(d, "Queue database open failed")), d.onsuccess = (o) => {
        this._db = o.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, a) => {
      const d = this.indexedDB.deleteDatabase(this.dbName);
      d.onsuccess = () => e(), d.onerror = () => a(it(d, "Queue database delete failed")), d.onblocked = () => a(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((a) => a ? new Promise((d, o) => {
      const s = a.transaction(X, "readonly").objectStore(X).index("by_scope_seq").getAll(Et(this.keyRange, e));
      s.onsuccess = () => d(s.result || []), s.onerror = () => o(it(s, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, a) {
    return a = a || {}, this.open().then((d) => d ? new Promise((o, c) => {
      const s = d.transaction([tt, X], "readwrite"), n = s.objectStore(tt), h = s.objectStore(X), p = Ge(e);
      let b = null;
      const m = (_) => {
        const i = _ + 1;
        b = {
          entryId: this.uuid(),
          scope: e,
          chainKey: a.chainKey,
          seq: i,
          op: a.op,
          targetId: a.targetId !== void 0 ? a.targetId : null,
          payload: a.payload,
          expectedVersion: a.expectedVersion !== void 0 ? a.expectedVersion : null,
          meta: a.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, n.put({ key: p, value: i }), h.put(b);
      }, g = n.get(p);
      g.onerror = () => c(it(g, "Queue sequence read failed")), g.onsuccess = () => {
        const _ = g.result;
        if (_ && typeof _.value == "number") {
          m(_.value);
          return;
        }
        const i = h.index("by_scope_seq").getAll(Et(this.keyRange, e));
        i.onerror = () => c(it(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const r = (i.result || []).reduce((l, f) => Math.max(l, f.seq || 0), 0);
          m(r);
        };
      }, s.oncomplete = () => o(b), s.onerror = () => c(s.error || new Error("Queue enqueue transaction failed")), s.onabort = () => c(s.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, a, d) {
    return this.open().then((o) => o ? new Promise((c, s) => {
      const n = o.transaction(X, "readwrite"), h = n.objectStore(X), p = h.index("by_scope_seq").getAll(Et(this.keyRange, e)), b = this.now();
      let m = { entries: [], wakeups: [] };
      p.onerror = () => s(it(p, "Queue claim read failed")), p.onsuccess = () => {
        m = fr(p.result || [], a, d, b);
        for (const g of m.entries) h.put(g);
      }, n.oncomplete = () => c(m), n.onerror = () => s(n.error || new Error("Queue claim transaction failed")), n.onabort = () => s(n.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, a) {
    return this._updateEntry(e, a, (d, o) => (o.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, a, d, o) {
    o = o || {};
    const c = o.maxAttempts || 8, s = o.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((n) => n ? new Promise((h, p) => {
      const b = n.transaction([X, tt], "readwrite"), m = b.objectStore(X), g = b.objectStore(tt), _ = m.get(a);
      let i = null;
      _.onerror = () => p(it(_, "Queue nack read failed")), _.onsuccess = () => {
        const r = _.result;
        if (!(!r || r.scope !== e)) {
          if (d === "drop") {
            m.delete(r.entryId), i = { status: "dropped", entry: r };
            return;
          }
          if (We(r), r.updatedAt = this.now(), d === "auth") {
            r.status = "pending", m.put(r), g.put({ key: Gt(e), value: "auth" }), i = { status: "auth", entry: r };
            return;
          }
          if (d === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= c) {
              r.status = "failed", r.nextAttemptAt = 0, m.put(r), i = { status: "failed", entry: r };
              return;
            }
            const l = s[Math.min(r.attempts - 1, s.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + l, m.put(r), i = { status: "retry", entry: r, delay: l };
          }
        }
      }, b.oncomplete = () => h(i), b.onerror = () => p(b.error || new Error("Queue nack transaction failed")), b.onabort = () => p(b.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, a, d) {
    return this._remapTransaction(e, null, a, d);
  }
  resolveCreate(e, a, d, o) {
    return this._remapTransaction(e, a, d, o);
  }
  _remapTransaction(e, a, d, o) {
    return this.open().then((c) => c ? new Promise((s, n) => {
      const h = c.transaction(X, "readwrite"), p = h.objectStore(X), b = p.index("by_scope_seq").getAll(Et(this.keyRange, e));
      let m = { changed: [], deleted: [] };
      b.onerror = () => n(it(b, "Queue remap read failed")), b.onsuccess = () => {
        m = pr(b.result || [], a, d, o, this.now());
        for (const g of m.deleted) p.delete(g);
        for (const g of m.changed) p.put(g);
      }, h.oncomplete = () => s(m.changed), h.onerror = () => n(h.error || new Error("Queue remap transaction failed")), h.onabort = () => n(h.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((a) => a ? new Promise((d, o) => {
      const c = a.transaction(X, "readwrite"), s = c.objectStore(X), n = s.index("by_scope_seq").getAll(Et(this.keyRange, e));
      let h = 0;
      n.onerror = () => o(it(n, "Queue failed-entry read failed")), n.onsuccess = () => {
        for (const p of n.result || [])
          p.status === "failed" && (p.status = "pending", p.attempts = 0, p.nextAttemptAt = 0, p.updatedAt = this.now(), We(p), s.put(p), h++);
      }, c.oncomplete = () => d(h), c.onerror = () => o(c.error || new Error("Queue failed-entry reset failed")), c.onabort = () => o(c.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((a) => a ? new Promise((d, o) => {
      const s = a.transaction(tt, "readonly").objectStore(tt).get(Gt(e));
      s.onsuccess = () => {
        const n = s.result ? s.result.value : !1;
        d(n || !1);
      }, s.onerror = () => o(it(s, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, a) {
    return this.open().then((d) => {
      if (d)
        return new Promise((o, c) => {
          const s = d.transaction(tt, "readwrite"), n = typeof a == "string" ? a : a ? "manual" : !1;
          s.objectStore(tt).put({ key: Gt(e), value: n }), s.oncomplete = () => o(), s.onerror = () => c(s.error || new Error("Queue pause-state write failed")), s.onabort = () => c(s.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((a) => {
      if (a)
        return new Promise((d, o) => {
          const c = a.transaction([X, tt], "readwrite"), n = c.objectStore(X).index("by_scope_seq").openCursor(Et(this.keyRange, e));
          n.onsuccess = (h) => {
            const p = h.target.result;
            p && (p.delete(), p.continue());
          }, n.onerror = () => o(it(n, "Queue clear failed")), c.objectStore(tt).delete(Ge(e)), c.objectStore(tt).delete(Gt(e)), c.oncomplete = () => d(), c.onerror = () => o(c.error || new Error("Queue clear transaction failed")), c.onabort = () => o(c.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, a, d) {
    return this.open().then((o) => o ? new Promise((c, s) => {
      const n = o.transaction(X, "readwrite"), h = n.objectStore(X), p = h.get(a);
      let b = null;
      p.onerror = () => s(it(p, "Queue entry read failed")), p.onsuccess = () => {
        const m = p.result;
        !m || m.scope !== e || (b = d(m, h));
      }, n.oncomplete = () => c(b), n.onerror = () => s(n.error || new Error("Queue entry transaction failed")), n.onabort = () => s(n.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", a = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, o = 6e4;
  if (window[e] !== void 0) return;
  function c() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (b) => {
        const m = Math.random() * 16 | 0;
        return (b === "x" ? m : m & 3 | 8).toString(16);
      });
    }
  }
  const s = new mr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: c
  });
  function n(p) {
    this.dom = p, p[e] = this;
    const b = p.closest("[data-ln-data-coordinator]");
    this.scope = p.id || (b ? b.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = c(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const m = this;
    return s.open().then((g) => g ? s.getPaused(m.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((g) => {
      if (m._paused = !!g, m._paused) {
        const _ = typeof g == "string" ? g : "auth";
        C(m.dom, "ln-api-queue:paused", { reason: _, restored: !0 });
      }
      return m._emitPendingCount();
    }).then(() => m._drain()).catch((g) => {
      console.error("[ln-api-queue] Initialization failed:", g), C(m.dom, "ln-api-queue:error", { operation: "initialize", error: g });
    }), this;
  }
  n.prototype._isOnline = function() {
    const p = this.dom.getAttribute("data-ln-api-queue-online");
    return p === "true" ? !0 : p === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const p = this;
    return s.allForScope(p.scope).then((b) => (C(p.dom, "ln-api-queue:pending-count", { count: b.length, scope: p.scope }), b.length === 0 && C(p.dom, "ln-api-queue:drained", { scope: p.scope }), b));
  }, n.prototype._clearTimer = function(p) {
    const b = this._timers.get(p);
    b && (clearTimeout(b), this._timers.delete(p));
  }, n.prototype._scheduleTimer = function(p, b) {
    const m = Math.max(0, b), g = this._timers.get(p);
    g && clearTimeout(g);
    const _ = this, i = setTimeout(() => {
      _._timers.delete(p), _._drain();
    }, m);
    this._timers.set(p, i);
  }, n.prototype._drain = function() {
    const p = this;
    return p._paused || !p._isOnline() ? Promise.resolve() : (p._drainPromise || (p._drainPromise = s.claimReady(p.scope, p._workerId, o).then((b) => {
      for (const m of b.wakeups)
        p._scheduleTimer(m.chainKey, m.at - Date.now());
      for (const m of b.entries)
        p._clearTimer(m.chainKey), C(p.dom, "ln-api-queue:send", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          op: m.op,
          targetId: m.targetId,
          payload: m.payload,
          expectedVersion: m.expectedVersion,
          idempotencyKey: m.entryId,
          meta: m.meta
        });
    }).catch((b) => {
      console.error("[ln-api-queue] Drain failed:", b), C(p.dom, "ln-api-queue:error", { operation: "drain", error: b });
    }).finally(() => {
      p._drainPromise = null;
    })), p._drainPromise);
  }, n.prototype._onEnqueue = function(p) {
    const b = this;
    return s.enqueue(b.scope, p.detail || {}).then((m) => {
      if (m)
        return b._emitPendingCount().then((g) => (C(b.dom, "ln-api-queue:enqueued", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          count: g.length
        }), b._drain()));
    }).catch((m) => {
      C(b.dom, "ln-api-queue:error", { operation: "enqueue", error: m });
    });
  }, n.prototype._onAck = function(p) {
    const b = this, m = p.detail || {};
    return s.ack(b.scope, m.entryId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      C(b.dom, "ln-api-queue:error", { operation: "ack", entryId: m.entryId, error: g });
    });
  }, n.prototype._onNack = function(p) {
    const b = this, m = p.detail || {};
    return s.nack(b.scope, m.entryId, m.reason, {
      maxAttempts: d,
      backoff: a
    }).then((g) => {
      if (g)
        return g.status === "failed" ? C(b.dom, "ln-api-queue:failed", {
          entryId: g.entry.entryId,
          chainKey: g.entry.chainKey,
          attempts: g.entry.attempts
        }) : g.status === "retry" ? b._scheduleTimer(g.entry.chainKey, g.delay) : g.status === "auth" && (b._paused = !0, C(b.dom, "ln-api-queue:paused", { reason: "auth" }), C(b.dom, "ln-api-queue:auth-required", {
          entryId: g.entry.entryId,
          chainKey: g.entry.chainKey
        })), b._emitPendingCount().then(() => {
          if (g.status === "dropped") return b._drain();
        });
    }).catch((g) => {
      C(b.dom, "ln-api-queue:error", { operation: "nack", entryId: m.entryId, error: g });
    });
  }, n.prototype._onRemap = function(p) {
    const b = this, m = p.detail || {};
    return s.remap(b.scope, m.oldKey, m.newId).catch((g) => {
      C(b.dom, "ln-api-queue:error", { operation: "remap", error: g });
    });
  }, n.prototype._onResolveCreate = function(p) {
    const b = this, m = p.detail || {};
    return s.resolveCreate(b.scope, m.entryId, m.oldKey, m.newId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      C(b.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: m.entryId,
        error: g
      });
    });
  }, n.prototype._onResume = function() {
    const p = this;
    return s.setPaused(p.scope, !1).then(() => (p._paused = !1, C(p.dom, "ln-api-queue:resumed", {}), p._drain())).catch((b) => {
      C(p.dom, "ln-api-queue:error", { operation: "resume", error: b });
    });
  }, n.prototype._onPause = function() {
    const p = this;
    return s.setPaused(p.scope, "manual").then(() => {
      p._paused = !0, C(p.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((b) => {
      C(p.dom, "ln-api-queue:error", { operation: "pause", error: b });
    });
  }, n.prototype._onDrain = function() {
    const p = this;
    return s.resetFailed(p.scope).then(() => {
      const b = p._drainPromise;
      return b ? b.then(() => p._drain()) : p._drain();
    }).catch((b) => {
      C(p.dom, "ln-api-queue:error", { operation: "manual-drain", error: b });
    });
  }, n.prototype._onClear = function() {
    const p = this;
    return p._timers.forEach((b) => clearTimeout(b)), p._timers.clear(), s.clear(p.scope).then(() => {
      p._paused = !1, C(p.dom, "ln-api-queue:pending-count", { count: 0, scope: p.scope }), C(p.dom, "ln-api-queue:drained", { scope: p.scope });
    }).catch((b) => {
      C(p.dom, "ln-api-queue:error", { operation: "clear", error: b });
    });
  }, n.prototype._bindEvents = function() {
    const p = this;
    p._handlers = {
      enqueue: (b) => p._onEnqueue(b),
      ack: (b) => p._onAck(b),
      nack: (b) => p._onNack(b),
      remap: (b) => p._onRemap(b),
      resolveCreate: (b) => p._onResolveCreate(b),
      resume: () => p._onResume(),
      pause: () => p._onPause(),
      drain: () => p._onDrain(),
      clear: () => p._onClear()
    }, p.dom.addEventListener("ln-api-queue:request-enqueue", p._handlers.enqueue), p.dom.addEventListener("ln-api-queue:ack", p._handlers.ack), p.dom.addEventListener("ln-api-queue:nack", p._handlers.nack), p.dom.addEventListener("ln-api-queue:request-remap", p._handlers.remap), p.dom.addEventListener("ln-api-queue:resolve-create", p._handlers.resolveCreate), p.dom.addEventListener("ln-api-queue:request-resume", p._handlers.resume), p.dom.addEventListener("ln-api-queue:request-pause", p._handlers.pause), p.dom.addEventListener("ln-api-queue:request-drain", p._handlers.drain), p.dom.addEventListener("ln-api-queue:request-clear", p._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const p = this;
    p.dom.removeEventListener("ln-api-queue:request-enqueue", p._handlers.enqueue), p.dom.removeEventListener("ln-api-queue:ack", p._handlers.ack), p.dom.removeEventListener("ln-api-queue:nack", p._handlers.nack), p.dom.removeEventListener("ln-api-queue:request-remap", p._handlers.remap), p.dom.removeEventListener("ln-api-queue:resolve-create", p._handlers.resolveCreate), p.dom.removeEventListener("ln-api-queue:request-resume", p._handlers.resume), p.dom.removeEventListener("ln-api-queue:request-pause", p._handlers.pause), p.dom.removeEventListener("ln-api-queue:request-drain", p._handlers.drain), p.dom.removeEventListener("ln-api-queue:request-clear", p._handlers.clear), window.removeEventListener("online", p._onlineHandler), p._timers.forEach((b) => clearTimeout(b)), p._timers.clear(), C(p.dom, "ln-api-queue:destroyed", { scope: p.scope }), delete p.dom[e];
  };
  function h(p) {
    const b = p[e];
    b && b._drain();
  }
  U(t, e, n, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: h
  });
})();
function On(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function At(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function gr(t, e, a) {
  const d = On(t);
  return d === null || d < 0 ? 0 : Math.min(d, Math.min(e, a) / 2);
}
function _r(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((a) => !Number.isFinite(a)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function br(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), a = e[0].trim();
  return a ? {
    field: a,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function yr(t, e) {
  e = e || {};
  const a = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", o = e.yField || "value", c = e.includeZero !== !1, s = gr(e.padding, a.width, a.height), n = Array.isArray(t) ? t : [], h = [];
  for (let u = 0; u < n.length; u++) {
    const y = n[u] || {}, E = On(y[o]);
    E !== null && h.push({
      record: y,
      sourceIndex: u,
      label: y[d] == null ? String(u + 1) : String(y[d]),
      value: E
    });
  }
  if (h.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: a.y + a.height - s
    };
  let p = h[0].value, b = h[0].value;
  for (let u = 1; u < h.length; u++)
    h[u].value < p && (p = h[u].value), h[u].value > b && (b = h[u].value);
  let m = p, g = b;
  c && (m = Math.min(0, m), g = Math.max(0, g)), m === g && (g === 0 ? g = 1 : g > 0 ? m = 0 : g = 0);
  const _ = Math.max(1, a.width - s * 2), i = Math.max(1, a.height - s * 2), r = g - m, l = a.y + a.height - s - (0 - m) / r * i, f = [];
  for (let u = 0; u < h.length; u++) {
    const y = h[u], E = h.length === 1 ? 0.5 : u / (h.length - 1), A = a.x + s + E * _, L = a.y + a.height - s - (y.value - m) / r * i;
    f.push({
      record: y.record,
      sourceIndex: y.sourceIndex,
      label: y.label,
      value: y.value,
      x: A,
      y: L,
      pointString: At(A) + "," + At(L)
    });
  }
  const v = f.map((u) => u.pointString).join(" ");
  let w = "";
  if (f.length > 0) {
    const u = f[0], y = f[f.length - 1], E = At(u.x) + "," + At(l), A = At(y.x) + "," + At(l);
    w = E + " " + v + " " + A;
  }
  return {
    points: f,
    linePoints: v,
    areaPoints: w,
    count: f.length,
    min: p,
    max: b,
    domainMin: m,
    domainMax: g,
    baselineY: l
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", a = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function d(c, s) {
    c && (c.textContent = s);
  }
  function o(c) {
    this.dom = c, this.name = c.getAttribute(t) || "", this.source = c.getAttribute("data-ln-chart-source") || this.name, this.plot = c.querySelector("[data-ln-chart-plot]"), this.line = c.querySelector("[data-ln-chart-line]"), this.area = c.querySelector("[data-ln-chart-area]"), this.labels = c.querySelector("[data-ln-chart-labels]"), this.empty = c.querySelector("[data-ln-chart-empty]"), this.minimum = c.querySelector("[data-ln-chart-min]"), this.maximum = c.querySelector("[data-ln-chart-max]"), this.count = c.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const s = this;
    return this._onSetData = function(n) {
      const h = n.detail || {};
      s._data = Array.isArray(h.data) ? h.data : [], s.isLoaded = !0, s._setLoading(!1), s._render();
    }, this._onSetLoading = function(n) {
      s._setLoading(!!(n.detail && n.detail.loading));
    }, this._onRefresh = function() {
      s.requestData();
    }, c.addEventListener("ln-chart:set-data", this._onSetData), c.addEventListener("ln-chart:set-loading", this._onSetLoading), c.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  o.prototype._readOptions = function() {
    const c = this.dom.getAttribute("data-ln-chart-padding"), s = c === null ? NaN : Number(c), n = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(s) && s >= 0 ? s : 16,
      type: n === "area" || n === "polygon" ? "area" : "line",
      viewBox: this.plot && _r(this.plot.getAttribute("viewBox")) || a
    };
  }, o.prototype._setLoading = function(c) {
    this.dom.classList.toggle("ln-chart--loading", c), this.dom.setAttribute("aria-busy", c ? "true" : "false");
  }, o.prototype._renderLabels = function(c) {
    if (!this.labels || (this.labels.replaceChildren(), c.count === 0)) return;
    const s = this.name + "-label", n = '[data-ln-template="' + s + '"]';
    if (!this.dom.querySelector(n) && !document.querySelector(n)) return;
    const h = mt(this.dom, s, "ln-chart");
    if (!h) return;
    const p = G(this.dom);
    for (const b of c.points) {
      const m = h.cloneNode(!0);
      Nt(m, {
        label: b.label,
        value: et(b.value, p)
      }), this.labels.appendChild(m);
    }
  }, o.prototype._render = function() {
    const c = this._readOptions(), s = yr(this._data, c);
    this.model = s, this.line && (this.line.setAttribute("points", s.linePoints), this.line.toggleAttribute("hidden", s.count === 0)), this.area && (this.area.setAttribute("points", s.areaPoints), this.area.toggleAttribute("hidden", s.count === 0 || c.type !== "area"));
    const n = s.count === 0;
    this.dom.classList.toggle("ln-chart--empty", n), this.empty && this.empty.toggleAttribute("hidden", !n);
    const h = G(this.dom);
    d(this.minimum, et(s.min, h)), d(this.maximum, et(s.max, h)), d(this.count, et(s.count, h)), this._renderLabels(s), C(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: s.count,
      min: s.min,
      max: s.max
    });
  }, o.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, C(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: br(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, U(t, e, o, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(c, s) {
      const n = c[e];
      if (n) {
        if (s === "data-ln-chart-source" || s === "data-ln-chart-sort") {
          n.requestData();
          return;
        }
        n._render();
      }
    }
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  function a(d) {
    this.dom = d, this._storeName = d.getAttribute(t), this._valueField = d.getAttribute("data-ln-options-value") || "id", this._labelField = d.getAttribute("data-ln-options-label") || "name";
    const o = this;
    return this._onSetData = function(c) {
      o._rebuild(c.detail.data || []);
    }, d.addEventListener("ln-options:set-data", this._onSetData), C(d, "ln-options:request-data", { options: this._storeName }), this;
  }
  a.prototype._rebuild = function(d) {
    const o = this.dom, c = this._valueField, s = this._labelField, n = o.value, h = o.querySelectorAll("option");
    for (let b = h.length - 1; b >= 0; b--)
      h[b].value !== "" && o.removeChild(h[b]);
    for (let b = 0; b < d.length; b++) {
      const m = d[b], g = document.createElement("option");
      g.value = String(m[c]), g.textContent = m[s] != null ? m[s] : "", o.appendChild(g);
    }
    const p = o.options;
    for (let b = 0; b < p.length; b++)
      if (p[b].value === n) {
        o.value = n;
        break;
      }
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, U(t, e, a, "ln-options");
})();
function vr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const a = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!a) return null;
  const o = {};
  return o[a] = [d], o;
}
function wr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  function a(d) {
    return this.dom = d, this._storeName = d.getAttribute(t), this._filters = vr(d.getAttribute("data-ln-stat-filter")), this._onSetCount = function(o) {
      d.textContent = wr(o.detail && o.detail.count), d.classList.remove("is-loading");
    }, d.addEventListener("ln-stat:set-count", this._onSetCount), C(d, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, U(t, e, a, "ln-stat");
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", a = "#ln-icon-custom-", d = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  let c = null;
  const s = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), h = "lni:", p = "lni:v", b = "1";
  function m() {
    try {
      if (localStorage.getItem(p) !== b) {
        for (let v = localStorage.length - 1; v >= 0; v--) {
          const w = localStorage.key(v);
          w && w.indexOf(h) === 0 && localStorage.removeItem(w);
        }
        localStorage.setItem(p, b);
      }
    } catch {
    }
  }
  m();
  function g() {
    return c || (c = document.getElementById(t), c || (c = document.createElementNS("http://www.w3.org/2000/svg", "svg"), c.id = t, c.setAttribute("hidden", ""), c.setAttribute("aria-hidden", "true"), c.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(c, document.body.firstChild))), c;
  }
  function _(v) {
    return v.indexOf(a) === 0 ? n + "/" + v.slice(a.length) + ".svg" : s + "/" + v.slice(e.length) + ".svg";
  }
  function i(v, w) {
    const u = w.match(/viewBox="([^"]+)"/), y = u ? u[1] : "0 0 24 24", E = w.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = E ? E[1].trim() : "", L = w.match(/<svg([^>]*)>/i), T = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = v, x.setAttribute("viewBox", y), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const R = T.match(new RegExp(I + '="([^"]*)"'));
      R && x.setAttribute(I, R[1]);
    }), x.innerHTML = A, g().querySelector("defs").appendChild(x);
  }
  function r(v) {
    if (d.has(v) || o.has(v)) return;
    if (v.indexOf(a) === 0 && !n) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", v);
      return;
    }
    const w = v.slice(1);
    try {
      const y = localStorage.getItem(h + w);
      if (y) {
        i(w, y), d.add(v);
        return;
      }
    } catch {
    }
    o.add(v);
    const u = _(v);
    fetch(u).then(function(y) {
      if (!y.ok) throw new Error(y.status);
      return y.text();
    }).then(function(y) {
      i(w, y), d.add(v), o.delete(v);
      try {
        localStorage.setItem(h + w, y);
      } catch {
      }
    }).catch(function(y) {
      console.error("[ln-icon] Fetch failed for:", w, y), o.delete(v);
    });
  }
  function l(v) {
    const w = 'use[href^="' + e + '"], use[href^="' + a + '"]', u = v.querySelectorAll ? v.querySelectorAll(w) : [];
    if (v.matches && v.matches(w)) {
      const y = v.getAttribute("href");
      y && r(y);
    }
    Array.prototype.forEach.call(u, function(y) {
      const E = y.getAttribute("href");
      E && r(E);
    });
  }
  function f() {
    l(document), new MutationObserver(function(v) {
      v.forEach(function(w) {
        if (w.type === "childList")
          w.addedNodes.forEach(function(u) {
            u.nodeType === 1 && l(u);
          });
        else if (w.type === "attributes" && w.attributeName === "href") {
          const u = w.target.getAttribute("href");
          u && (u.indexOf(e) === 0 || u.indexOf(a) === 0) && r(u);
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
const Le = /* @__PURE__ */ new Set([
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
function Er(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const a = [];
  for (let d = 0; d <= e.length; d++) a[d] = [d];
  for (let d = 0; d <= t.length; d++) a[0][d] = d;
  for (let d = 1; d <= e.length; d++)
    for (let o = 1; o <= t.length; o++)
      e.charAt(d - 1) === t.charAt(o - 1) ? a[d][o] = a[d - 1][o - 1] : a[d][o] = Math.min(
        a[d - 1][o - 1] + 1,
        a[d][o - 1] + 1,
        a[d - 1][o] + 1
      );
  return a[e.length][t.length];
}
function Ar(t, e = Le) {
  if (e.has(t)) return null;
  let a = null, d = 1 / 0;
  for (const c of e) {
    const s = Er(t, c);
    s < d && (d = s, a = c);
  }
  const o = Math.max(3, Math.floor(t.length * 0.4));
  return d <= o ? a : null;
}
function Mn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Sr(t = document) {
  const e = t.ownerDocument || t, a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const d = [], o = [a, ...a.querySelectorAll("*")];
  for (let c = 0; c < o.length; c++) {
    const s = o[c];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const h = s.attributes[n];
        if (h.name.startsWith("data-ln-") && h.name.endsWith("-for")) {
          const p = (h.value || "").trim();
          if (!p) {
            d.push({
              type: "id-empty",
              element: s,
              attribute: h.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${s.tagName.toLowerCase()} ${h.name}="">.`
            });
            continue;
          }
          e.getElementById(p) || e.querySelector("#" + Mn(p)) || d.push({
            type: "id-unresolved",
            element: s,
            attribute: h.name,
            targetId: p,
            message: `[ln-debug] Unresolved ID reference: <${s.tagName.toLowerCase()} ${h.name}="${p}"> targets "#${p}", but no element with id="${p}" exists in the document.`
          });
        }
      }
  }
  return d;
}
function Cr(t = document) {
  const e = t.ownerDocument || t, a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const d = [], o = [a, ...a.querySelectorAll("*")];
  for (let c = 0; c < o.length; c++) {
    const s = o[c];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const h = s.attributes[n];
        if (h.name.startsWith("data-ln-") && (h.name.endsWith("-source") || h.name.endsWith("-store")) && h.name !== "data-ln-data-store") {
          const b = (h.value || "").trim();
          if (!b) {
            d.push({
              type: "store-empty",
              element: s,
              attribute: h.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${s.tagName.toLowerCase()} ${h.name}="">.`
            });
            continue;
          }
          const m = Mn(b), g = e.querySelector(`[data-ln-data-store="${m}"], [data-ln-store="${m}"]`), _ = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(b);
          !g && !_ && d.push({
            type: "store-unresolved",
            element: s,
            attribute: h.name,
            storeName: b,
            message: `[ln-debug] Unresolved store reference: <${s.tagName.toLowerCase()} ${h.name}="${b}"> targets store "${b}", but no [data-ln-data-store="${b}"] exists in the document.`
          });
        }
      }
  }
  return d;
}
function Lr(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const a = [], d = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && d.unshift(e);
  const o = /* @__PURE__ */ new Map();
  for (let c = 0; c < d.length; c++) {
    const s = d[c], n = (s.getAttribute("data-ln-data-store") || "").trim();
    n && (o.has(n) || o.set(n, []), o.get(n).push(s));
  }
  for (const [c, s] of o.entries())
    s.length > 1 && a.push({
      type: "store-duplicate",
      storeName: c,
      elements: s,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${c}". Store names must be unique across the document.`
    });
  return a;
}
function Tr(t = document, e = Le) {
  const a = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!a) return [];
  const d = [], o = [a, ...a.querySelectorAll("*")];
  for (let c = 0; c < o.length; c++) {
    const s = o[c];
    if (s.attributes)
      for (let n = 0; n < s.attributes.length; n++) {
        const h = s.attributes[n];
        if (h.name.startsWith("data-ln-") && !e.has(h.name)) {
          const p = Ar(h.name, e), b = p ? ` Did you mean "${p}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: s,
            attribute: h.name,
            suggestion: p,
            message: `[ln-debug] Unknown attribute "${h.name}" on <${s.tagName.toLowerCase()}>.${b}`
          });
        }
      }
  }
  return d;
}
function be(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const a = e.validAttributes || Le, d = Sr(t), o = Cr(t), c = Lr(t), s = Tr(t, a), n = [
    ...d,
    ...o,
    ...c,
    ...s
  ];
  if (!e.silent)
    for (let h = 0; h < n.length; h++)
      console.warn(n[h].message);
  return {
    idIssues: d,
    storeIssues: o,
    uniquenessIssues: c,
    spellingIssues: s,
    total: n.length
  };
}
let Dt = null;
function Wt(t = typeof document < "u" ? document : null, e = 50, a = null) {
  if (!t) return;
  Dt && (clearTimeout(Dt), Dt = null);
  function d() {
    Dt = setTimeout(() => {
      Dt = null;
      const o = be(t);
      a && a(o);
    }, e);
  }
  nn() > 0 ? rt(d) : d();
}
function Qe(t, e, a, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", a), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", a), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let Ct = [];
function qr() {
  Ct = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Ct.push(document.body);
}
function xr(t) {
  for (let e = 0; e < Ct.length; e++)
    if (Ct[e].contains(t)) return !0;
  return !1;
}
function kr(t, e, a, d) {
  if (a === window || a === document) {
    Ct.indexOf(document.body) !== -1 && Qe(t, e, a, d);
    return;
  }
  xr(a) && Qe(t, e, a, d);
}
function ye() {
  qr(), Qn(Ct.length > 0 ? kr : null);
}
function $e() {
  ye();
}
function Ir() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, at(function() {
    ye(), ee(["data-ln-debug"], ye);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  Ir();
  function a(o) {
    return this.dom = o, Wt(o.ownerDocument || document), $e(), this;
  }
  a.prototype.verify = function(o, c) {
    return be(o || (this.dom ? this.dom.ownerDocument || this.dom : document), c);
  }, a.prototype.destroy = function() {
    delete this.dom[e], $e();
  };
  const d = U(t, e, a, "ln-debug", {
    onInit: function(o) {
      typeof document < "u" && Wt(o && o.ownerDocument ? o.ownerDocument : document);
    },
    onSubtreeChange: function(o) {
      typeof document < "u" && Wt(o && o.ownerDocument ? o.ownerDocument : document);
    }
  });
  d.verify = function(o, c) {
    return be(o || document, c);
  }, d.schedule = function(o, c, s) {
    return Wt(o || document, c, s);
  };
})();
