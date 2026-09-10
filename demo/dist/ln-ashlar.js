function ue(t) {
  let e = !1;
  for (let d = 0; d < t.length; d++) {
    const h = t[d];
    if (!(h === "" || h == null) && (e = !0, !Number.isFinite(Number(h))))
      return "string";
  }
  return e ? "number" : "string";
}
function he(t, e, d, h) {
  if (d === "number") {
    const c = parseFloat(t), i = parseFloat(e);
    return (isNaN(c) ? 0 : c) - (isNaN(i) ? 0 : i);
  }
  const l = t != null ? String(t) : "", u = e != null ? String(e) : "";
  return h ? h.compare(l, u) : l < u ? -1 : l > u ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const Jt = {};
function Ut(t, e) {
  Jt[t] || (Jt[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const d = Jt[t];
  return d ? d.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function S(t, e, d) {
  t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: d || {}
  }));
}
function G(t, e, d) {
  const h = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d || {}
  });
  return t.dispatchEvent(h), h;
}
function Ue(t, e, d) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const h = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  h[d] = t.name, S(t.dom, e, h);
}
function ot(t, e) {
  if (!t || !e) return t;
  const d = t.querySelectorAll("[data-ln-field]");
  for (let c = 0; c < d.length; c++) {
    const i = d[c], f = i.getAttribute("data-ln-field");
    e[f] != null && (i.textContent = e[f]);
  }
  const h = t.querySelectorAll("[data-ln-attr]");
  for (let c = 0; c < h.length; c++) {
    const i = h[c], f = i.getAttribute("data-ln-attr").split(",");
    for (let p = 0; p < f.length; p++) {
      const y = f[p].trim().split(":");
      if (y.length !== 2) continue;
      const m = y[0].trim(), _ = y[1].trim();
      e[_] != null && i.setAttribute(m, e[_]);
    }
  }
  const l = t.querySelectorAll("[data-ln-show]");
  for (let c = 0; c < l.length; c++) {
    const i = l[c], f = i.getAttribute("data-ln-show");
    f in e && i.classList.toggle("hidden", !e[f]);
  }
  const u = t.querySelectorAll("[data-ln-class]");
  for (let c = 0; c < u.length; c++) {
    const i = u[c], f = i.getAttribute("data-ln-class").split(",");
    for (let p = 0; p < f.length; p++) {
      const y = f[p].trim().split(":");
      if (y.length !== 2) continue;
      const m = y[0].trim(), _ = y[1].trim();
      _ in e && i.classList.toggle(m, !!e[_]);
    }
  }
  return t;
}
function Un(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  const d = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let h = 0; h < d.length; h++)
    d[h].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ot(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let d = 0; d < e.length; d++)
        e[d].textContent = "";
    }
})));
function Dt(t, e) {
  if (!t || !e) return t;
  const d = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; d.nextNode(); ) {
    const u = d.currentNode;
    u.textContent.indexOf("{{") !== -1 && (u.textContent = u.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(c, i) {
        return e[i] !== void 0 ? e[i] : "";
      }
    ));
  }
  const h = function(u, c) {
    return e[c] !== void 0 ? e[c] : "";
  }, l = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && l.push(t);
  for (let u = 0; u < l.length; u++) {
    const c = l[u], i = c.attributes;
    for (let f = 0; f < i.length; f++) {
      const p = i[f];
      p.value.indexOf("{{") !== -1 && c.setAttribute(p.name, p.value.replace(/\{\{\s*(\w+)\s*\}\}/g, h));
    }
  }
  return t;
}
function zn(t, e, d, h, l, u) {
  const c = {};
  for (let f = 0; f < t.children.length; f++) {
    const p = t.children[f], y = p.getAttribute("data-ln-render-key");
    y && (c[y] = p);
  }
  const i = document.createDocumentFragment();
  for (let f = 0; f < e.length; f++) {
    const p = e[f], y = String(h(p));
    let m = c[y];
    if (m)
      l(m, p, f);
    else {
      const _ = Ut(d, u);
      if (!_ || (Dt(_, p), m = _.firstElementChild, !m)) continue;
      m.setAttribute("data-ln-render-key", y), l(m, p, f);
    }
    i.appendChild(m);
  }
  t.textContent = "", t.appendChild(i);
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
function pt(t, e, d) {
  if (t) {
    const h = t.querySelector('[data-ln-template="' + e + '"]');
    if (h) return h.content.cloneNode(!0);
  }
  return Ut(e, d);
}
function Wt(t, e) {
  const d = {}, h = t.querySelectorAll("[" + e + "]");
  for (let l = 0; l < h.length; l++)
    d[h[l].getAttribute(e)] = h[l].textContent, h[l].remove();
  return d;
}
function ne(t, e, d, h) {
  if (t.nodeType !== 1) return;
  const u = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", c = Array.from(t.querySelectorAll(u));
  t.matches && t.matches(u) && c.push(t);
  for (const i of c)
    i[d] || (i[d] = new h(i));
}
function kt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function ze(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Kn(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Ke(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function jn(t, e) {
  return !t || !document.contains(t) || Ke(t) || e && typeof t[e] != "function" ? !1 : kt(t);
}
function Vn(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function je(t, e) {
  const d = !!(e && e.typed), h = e && e.exclude, l = {}, u = t.elements, c = {};
  if (d)
    for (let i = 0; i < u.length; i++) {
      const f = u[i];
      f.name && f.type === "checkbox" && !f.disabled && (c[f.name] = (c[f.name] || 0) + 1);
    }
  for (let i = 0; i < u.length; i++) {
    const f = u[i];
    if (!(!f.name || f.disabled || f.type === "file" || f.type === "submit" || f.type === "button") && !(h && f.matches && f.matches(h)))
      if (f.type === "checkbox")
        d && c[f.name] === 1 ? l[f.name] = f.checked : (l[f.name] || (l[f.name] = []), f.checked && l[f.name].push(f.value));
      else if (f.type === "radio")
        f.checked && (l[f.name] = f.value);
      else if (f.type === "select-multiple") {
        l[f.name] = [];
        for (let p = 0; p < f.options.length; p++)
          f.options[p].selected && l[f.name].push(f.options[p].value);
      } else if (d && f.type === "hidden")
        l[f.name] = f.value;
      else if (d && (f.type === "number" || f.type === "range")) {
        const p = Number(f.value);
        l[f.name] = f.value === "" || isNaN(p) ? null : p;
      } else
        l[f.name] = f.value;
  }
  return l;
}
function Wn(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function Ve(t, e) {
  const d = t.elements, h = [], l = {};
  for (let u = 0; u < d.length; u++) {
    const c = d[u];
    c.name && c.type === "checkbox" && (l[c.name] = (l[c.name] || 0) + 1);
  }
  for (let u = 0; u < d.length; u++) {
    const c = d[u];
    if (c.type === "file" || c.type === "submit" || c.type === "button") continue;
    const i = c.getAttribute("data-ln-fill-as") || c.name;
    if (!i || !(i in e)) continue;
    const f = e[i];
    if (c.type === "checkbox") {
      if (Array.isArray(f))
        c.checked = f.indexOf(c.value) !== -1;
      else if (l[c.name] > 1) {
        const p = String(f).split(",").map(function(y) {
          return y.trim();
        });
        c.checked = p.indexOf(c.value) !== -1;
      } else
        c.checked = Wn(f);
      h.push(c);
    } else if (c.type === "radio")
      c.checked = c.value === String(f), h.push(c);
    else if (c.type === "select-multiple") {
      if (Array.isArray(f))
        for (let p = 0; p < c.options.length; p++)
          c.options[p].selected = f.indexOf(c.options[p].value) !== -1;
      h.push(c);
    } else
      c.value = f, h.push(c);
  }
  return h;
}
const Ce = {
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
function W(t) {
  const e = t ? t.closest("[lang]") : null, d = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!d) return "en-US";
  const h = d.trim().toLowerCase();
  return h.indexOf("-") === -1 && Ce[h] ? Ce[h] : d;
}
function Gt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, at(function() {
    new MutationObserver(function() {
      document.dispatchEvent(new CustomEvent("ln-core:locale-change", {
        bubbles: !0,
        detail: {}
      }));
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function At(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function We(t, e, { get: d, set: h }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return d ? d.call(this) : e.get.call(this);
    },
    set: function(l) {
      h ? h.call(this, l, (u) => e.set.call(this, u)) : e.set.call(this, l);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Gn() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Zt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Ge() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function $e() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [] }, window.lnCore._attrRegistry;
}
function Qe(t) {
  const e = $e(), d = t.observed || [];
  for (let h = 0; h < d.length; h++) {
    const l = d[h];
    e.byAttr.has(l) || e.byAttr.set(l, []), e.byAttr.get(l).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t);
}
function $n(t) {
  const e = t.target, d = t.attributeName;
  if (t.oldValue === e.getAttribute(d)) return;
  const h = $e(), l = h.byAttr.get(d);
  if (d.indexOf("data-ln-") === 0)
    for (let u = 0; u < h.reactive.length; u++) {
      const c = h.reactive[u];
      if (!e[c.attribute]) continue;
      const i = c.effects && c.effects[d];
      i ? i(e, d, t.oldValue) : c.onAttrChange && c.onAttrChange(e, d, t.oldValue);
    }
  if (l)
    for (let u = 0; u < l.length; u++) {
      const c = l[u];
      if (c.handler) {
        c.handler(e, d, t.oldValue);
        continue;
      }
      c.onAttributeChange && e[c.attribute] ? c.onAttributeChange(e, d) : (ne(e, c.selector, c.attribute, c.ComponentFn), c.onInit && c.onInit(e));
    }
}
function Xe() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, at(function() {
    new MutationObserver(function(e) {
      for (let d = 0; d < e.length; d++)
        $n(e[d]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function fe(t, e) {
  Qe({ observed: t, handler: e }), Xe();
}
function F(t, e, d, h, l = {}) {
  const u = l.extraAttributes || [], c = l.onAttributeChange || null, i = l.onSubtreeChange || null, f = l.onInit || null, p = l.onAttrChange || null, y = l.effects || null;
  function m(r) {
    const a = r || document.body;
    ne(a, t, e, d), f && f(a);
  }
  const _ = [];
  if (t.indexOf("[") !== -1) {
    const r = /\[([\w-]+)/g;
    let a;
    for (; (a = r.exec(t)) !== null; )
      _.push(a[1]);
  } else
    _.push(t);
  Qe({
    selector: t,
    attribute: e,
    ComponentFn: d,
    onInit: f,
    observed: _.concat(u),
    onAttributeChange: c,
    onAttrChange: p,
    effects: y
  }), Xe(), at(function() {
    new MutationObserver(function(a) {
      for (let n = 0; n < a.length; n++) {
        const o = a[n];
        if (o.type === "childList") {
          if (i && o.target) {
            const b = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", v = o.target.nodeType === 1 ? o.target.matches(b) ? o.target : o.target.closest(b) : o.target.parentElement ? o.target.parentElement.closest(b) : null;
            v && i(v, o);
          }
          for (let s = 0; s < o.addedNodes.length; s++) {
            const b = o.addedNodes[s];
            b.nodeType === 1 && (ne(b, t, e, d), f && f(b));
          }
          for (let s = 0; s < o.removedNodes.length; s++) {
            const b = o.removedNodes[s];
            if (b.nodeType === 1) {
              const w = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", A = Array.from(b.querySelectorAll(w));
              b.matches && b.matches(w) && A.push(b);
              for (let C = 0; C < A.length; C++) {
                const L = A[C];
                if (!document.contains(L)) {
                  const q = L[e];
                  q && typeof q.destroy == "function" && q.destroy();
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
  }, h || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[e] = m;
  function g() {
    Ge() > 0 ? it(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g(), m;
}
function Ye(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const d = e.getAttribute("href");
  return !(!d || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || d.startsWith("mailto:") || d.startsWith("tel:") || d === "#" || d.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function dt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, d) => d === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Lt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function Je(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (d) {
    return console.error(`[${e}] Invalid headers JSON:`, d), {};
  }
}
const Ze = {};
function Qn(t, e) {
  Ze[t] = e;
}
function Xn(t) {
  return Ze[t] || { ingress: (e) => e, egress: (e) => e };
}
const tn = {};
function pe(t, e) {
  if (!t || typeof e != "object") return;
  const d = t.toLowerCase().split("-")[0];
  tn[d] = e;
}
function _t(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return tn[e] || null;
}
pe("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Qn, window.lnCore.getDataMapper = Xn, window.lnCore.registerLocaleFallback = pe, window.lnCore.getLocaleFallback = _t, window.lnCore.fillTemplate = Dt, window.lnCore.fill = ot, window.lnCore.lnFill = Un, window.lnCore.renderList = zn, window.lnCore.ensureLocaleObserver = Gt);
function me(t, e) {
  let d = !1;
  return function() {
    d || (d = !0, queueMicrotask(function() {
      d = !1, t();
    }));
  };
}
function en(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, d = t.pageSize > 0 ? t.pageSize : 200, h = t.threshold != null ? t.threshold : 25, l = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const u = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, c = typeof t.onChange == "function" ? t.onChange : function() {
  }, i = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
  let y = 0, m = 0, _ = 0, g = { sort: null, filters: {}, search: "" }, r = null, a = 0, n = 0, o = !1;
  function s(A) {
    f.set(A, ++a);
  }
  function b() {
    return !!(g && (g.search || g.filters && Object.keys(g.filters).length));
  }
  function v() {
    if (i.size <= e) return;
    const A = Array.from(i.keys()).sort(function(L, q) {
      return (f.get(L) || 0) - (f.get(q) || 0);
    });
    let C = 0;
    for (; i.size > e && C < A.length; )
      i.delete(A[C]), f.delete(A[C]), C++;
  }
  function w(A, C) {
    p.add(A), u(g, A, C);
  }
  return {
    get: function(A) {
      return i.get(A);
    },
    has: function(A) {
      return i.has(A);
    },
    peek: function() {
      return i.size ? i.values().next().value : void 0;
    },
    get logicalTotal() {
      return y;
    },
    get grandTotal() {
      return m;
    },
    get queryGen() {
      return _;
    },
    get size() {
      return i.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(A, C) {
      clearTimeout(r), n = A;
      for (let N = A; N < C; N++)
        i.has(N) && s(N);
      if (y <= 0) return;
      const L = Math.max(0, A - h), q = Math.min(y, C + h), x = Math.floor(L / d), R = Math.floor(Math.max(0, q - 1) / d);
      let M = -1;
      for (let N = x; N <= R; N++) {
        const B = N * d, K = Math.min(d, y - B);
        let H = !1;
        const U = Math.max(B, L), z = Math.min(B + K, q);
        for (let st = U; st < z; st++)
          if (!i.has(st)) {
            H = !0;
            break;
          }
        if (H && !p.has(B)) {
          M = B;
          break;
        }
      }
      M !== -1 && (r = setTimeout(function() {
        w(M, d);
      }, l));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(A) {
      if (A = A || {}, A.queryGen != null && A.queryGen !== _) return !1;
      const C = A.offset || 0, L = A.data || [];
      let q = 0;
      for (let x = 0; x < L.length; x++)
        L[x] != null && q++;
      if (q === 0 && (A.provisional || A.filtered > 0))
        return p.delete(C), !1;
      o && (i.clear(), f.clear(), o = !1), A.provisional || (m = A.total != null ? A.total : m, y = A.filtered != null ? A.filtered : A.data ? A.data.length : y);
      for (let x = 0; x < L.length; x++)
        L[x] != null && (i.set(C + x, L[x]), s(C + x));
      return p.delete(C), v(), c(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(A) {
      A && (g = A), w(0, d);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(A) {
      _++, p.clear(), clearTimeout(r), A && (g = A), o = !0, w(0, d);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      _++, p.clear(), clearTimeout(r), o = !0;
      const A = Math.max(0, Math.floor(n / d) * d);
      w(A, d);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(A) {
      p.delete(A);
    },
    destroy: function() {
      clearTimeout(r), i.clear(), f.clear(), p.clear();
    },
    configure: function(A) {
      A = A || {};
      let C = !1;
      if (A.windowSize != null && A.windowSize > 0 && A.windowSize !== e) {
        const L = A.windowSize < e;
        e = A.windowSize, L && v(), C = !0;
      }
      A.pageSize != null && A.pageSize > 0 && (d = A.pageSize), A.threshold != null && A.threshold >= 0 && (h = A.threshold), A.fetchDebounce != null && A.fetchDebounce >= 0 && (l = A.fetchDebounce), C && c();
    },
    setGrandTotal: function(A) {
      A == null || isNaN(A) || A < 0 || (m = A, b() || (y = A), c());
    }
  };
}
const Yn = "ln:";
let vt = null;
function nn() {
  if (vt !== null) return vt;
  try {
    if (typeof localStorage > "u")
      return vt = !1, !1;
    const t = "__ln_test__";
    localStorage.setItem(t, t), localStorage.removeItem(t), vt = !0;
  } catch {
    vt = !1;
  }
  return vt;
}
function Jn() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function rn(t, e) {
  const d = e.getAttribute("data-ln-persist"), h = d !== null && d !== "" ? d : e.id;
  return h ? Yn + t + ":" + Jn() + ":" + h : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', e), null);
}
function $t(t, e) {
  if (!nn()) return null;
  const d = rn(t, e);
  if (!d) return null;
  try {
    const h = localStorage.getItem(d);
    return h !== null ? JSON.parse(h) : null;
  } catch {
    return null;
  }
}
function bt(t, e, d) {
  if (!nn()) return;
  const h = rn(t, e);
  if (h)
    try {
      d == null ? localStorage.removeItem(h) : localStorage.setItem(h, JSON.stringify(d));
    } catch {
    }
}
function on(t) {
  return (t || "").replace(/^#/, "");
}
function Qt(t) {
  const e = t === void 0 ? location.hash : t, d = {}, h = on(e);
  if (!h) return d;
  const l = h.split("&");
  for (let u = 0; u < l.length; u++) {
    const c = l[u];
    if (!c) continue;
    const i = c.indexOf(":"), f = i > -1 ? c.slice(0, i) : c, p = i > -1 ? c.slice(i + 1) : "";
    if (f)
      try {
        d[f] = decodeURIComponent(p);
      } catch {
        d[f] = p;
      }
  }
  return d;
}
function X(t) {
  if (!t) return null;
  const e = Qt();
  return t in e ? e[t] : null;
}
function et(t, e) {
  if (!t) return;
  const d = Qt();
  e == null ? delete d[t] : d[t] = String(e);
  const l = Object.keys(d).map(function(u) {
    const c = d[u];
    return c === "" ? u : u + ":" + encodeURIComponent(c);
  }).join("&");
  on(location.hash) !== l && (location.hash = l);
}
function ge(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function yt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const d = t.getAttribute("data-ln-hash");
  if (d && d.trim() !== "") return d.trim();
  const h = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return h ? e ? h + "-" + e : h : e || null;
}
function sn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ie(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function an(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function re(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const d = t.slice(0, e), h = t.slice(e + 1), l = h ? h.split(",").map(function(u) {
    try {
      return decodeURIComponent(u);
    } catch {
      return u;
    }
  }).filter(Boolean) : [];
  return { key: d, values: l };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Qt, window.lnCore.hashGet = X, window.lnCore.hashSet = et, window.lnCore.hashLinkClick = ge, window.lnCore.resolveHashNamespace = yt, window.lnCore.hashSortEncode = sn, window.lnCore.hashSortDecode = ie, window.lnCore.hashFilterEncode = an, window.lnCore.hashFilterDecode = re);
function zt(t, e, d, h) {
  const l = typeof h == "number" ? h : 4, u = window.innerWidth, c = window.innerHeight, i = e.width, f = e.height, p = (d || "bottom").split("-"), y = p[0], m = p[1] === "start" || p[1] === "end" ? p[1] : "center", _ = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, g = _[y] || _.bottom;
  function r(b) {
    return b === "top" || b === "bottom" ? m === "start" ? t.left : m === "end" ? t.right - i : t.left + (t.width - i) / 2 : m === "start" ? t.top : m === "end" ? t.bottom - f : t.top + (t.height - f) / 2;
  }
  function a(b) {
    let v, w, A = !0;
    return b === "top" ? (v = t.top - l - f, w = r(b), v < 0 && (A = !1)) : b === "bottom" ? (v = t.bottom + l, w = r(b), v + f > c && (A = !1)) : b === "left" ? (v = r(b), w = t.left - l - i, w < 0 && (A = !1)) : (v = r(b), w = t.right + l, w + i > u && (A = !1)), { top: v, left: w, side: b, fits: A };
  }
  let n = null;
  for (let b = 0; b < g.length; b++) {
    const v = a(g[b]);
    if (v.fits) {
      n = v;
      break;
    }
  }
  n || (n = a(g[0]));
  let o = n.top, s = n.left;
  return i >= u ? s = 0 : (s < 0 && (s = 0), s + i > u && (s = u - i)), f >= c ? o = 0 : (o < 0 && (o = 0), o + f > c && (o = c - f)), { top: o, left: s, placement: n.side };
}
function oe(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, d = e.visibility, h = e.display, l = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const u = t.offsetWidth, c = t.offsetHeight;
  return e.visibility = d, e.display = h, e.position = l, { width: u, height: c };
}
let ft = null;
async function Le(t) {
  if (!t) {
    ft = null;
    return;
  }
  try {
    const e = new TextEncoder(), d = await crypto.subtle.digest("SHA-256", e.encode(t));
    ft = await crypto.subtle.importKey(
      "raw",
      d,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    console.error("[ln-core/crypto] Key derivation failed:", e), ft = null;
  }
}
function ut() {
  return ft;
}
async function Zn(t, e = ft) {
  const d = e || ft;
  if (!d || t === void 0 || t === null) return t;
  try {
    const h = new TextEncoder(), l = crypto.getRandomValues(new Uint8Array(12)), u = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: l },
      d,
      h.encode(u)
    ), i = btoa(String.fromCharCode(...l)), f = btoa(String.fromCharCode(...new Uint8Array(c)));
    return {
      encrypted: !0,
      iv: i,
      data: f
    };
  } catch (h) {
    return console.error("[ln-core/crypto] Encryption failed:", h), t;
  }
}
async function ti(t, e = ft) {
  const d = e || ft;
  if (!t || !t.encrypted || !d) return t;
  try {
    const h = new TextDecoder(), l = Uint8Array.from(atob(t.iv), (f) => f.charCodeAt(0)), u = Uint8Array.from(atob(t.data), (f) => f.charCodeAt(0)), c = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: l },
      d,
      u
    ), i = h.decode(c);
    try {
      return JSON.parse(i);
    } catch {
      return i;
    }
  } catch (h) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", h), { ...t, decryptionError: !0 };
  }
}
function ln(t, e = 100, d = 0) {
  const h = parseFloat(String(t)) || 0, l = parseFloat(String(e)) || 100, u = parseFloat(String(d)) || 0, c = Math.max(u, Math.min(h, l)), i = l - u;
  let f = 0;
  return i > 0 && (f = (c - u) / i * 100), f = Math.max(0, Math.min(100, f)), {
    value: h,
    min: u,
    max: l,
    clampedValue: c,
    percentage: f
  };
}
function Y(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const d = e < 1e11 ? e * 1e3 : e, h = new Date(d);
    return isNaN(h.getTime()) ? null : h;
  }
  if (typeof t == "string") {
    const d = t.trim();
    if (!d) return null;
    const h = new Date(d);
    return isNaN(h.getTime()) ? null : h;
  }
  return null;
}
function Tt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), d = String(t.getMonth() + 1).padStart(2, "0"), h = String(t.getDate()).padStart(2, "0");
  return e + "-" + d + "-" + h;
}
const lt = {};
function Kt(t) {
  const e = t || "default";
  if (!lt[e]) {
    const d = new Intl.NumberFormat(t, { useGrouping: !0 }), h = d.formatToParts(1234.5);
    let l = "", u = ".";
    for (let c = 0; c < h.length; c++)
      h[c].type === "group" && (l = h[c].value), h[c].type === "decimal" && (u = h[c].value);
    lt[e] = { groupSep: l, decimalSep: u, fmt: d };
  }
  return lt[e];
}
function cn(t, e, d) {
  if (t == null || typeof t != "string") return "";
  let h = t.trim();
  return h === "" ? "" : (h = h.replace(/[$€£¥]/g, ""), e && (h = h.split(e).join("")), h = h.replace(/\s/g, ""), d && d !== "." && (h = h.replace(d, ".")), h = h.replace(/[^\d.-]/g, ""), h);
}
function Ot(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const d = t.trim();
  if (d === "" || d === "-") return NaN;
  const h = Kt(e), l = cn(d, h.groupSep, h.decimalSep);
  if (l === "" || l === "-") return NaN;
  const u = parseFloat(l);
  return isNaN(u) ? NaN : u;
}
function tt(t, e, d = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const h = e || "default", l = d.maxDecimals != null ? parseInt(d.maxDecimals, 10) : null, u = d.userDecimals != null ? d.userDecimals : null;
  if (l !== null) {
    const c = h + "|max:" + l;
    return lt[c] || (lt[c] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: l
    })), lt[c].format(t);
  }
  if (u !== null && u > 0) {
    const c = h + "|exact:" + u;
    return lt[c] || (lt[c] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: u,
      maximumFractionDigits: u
    })), lt[c].format(t);
  }
  return Kt(e).fmt.format(t);
}
function se(t) {
  return String(t || "").trim().toLowerCase();
}
function dn(t) {
  const e = se(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ei(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((d) => d.trim()).filter(Boolean);
  return e.length ? e : null;
}
function un(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const d = String(t).toLowerCase();
  for (let h = 0; h < e.length; h++)
    if (d.indexOf(e[h]) === -1) return !1;
  return !0;
}
function ni(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function _e(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const d = String(t).trim().toLowerCase();
  for (let h = 0; h < e.length; h++)
    if (String(e[h]).trim().toLowerCase() === d)
      return !0;
  return !1;
}
function Te(t, e, d) {
  const h = parseInt(t.getAttribute(e), 10);
  return isNaN(h) ? d : h;
}
function ii(t, e) {
  return t.hasAttribute(e);
}
function ri(t, e) {
  return (t.getAttribute(e) || "").split(",").map((d) => d.trim()).filter(Boolean);
}
function oi(t, e, d) {
  for (const h in d) {
    const [l, u, c] = d[h];
    Object.defineProperty(t, h, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return l(e, u, c);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function si(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function ai(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function li(t, e) {
  return (e || "GET") + " " + (t || "");
}
function ci(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
  function h(c, i) {
    i = i || {};
    const f = si(c), p = ai(c, i), y = li(f, p);
    ci(p) && e.has(y) && (e.get(y).abort(), e.delete(y));
    const m = new AbortController(), _ = i.signal;
    let g = null;
    _ && (_.aborted ? m.abort(_.reason) : (g = function() {
      m.abort(_.reason);
    }, _.addEventListener("abort", g, { once: !0 })));
    const r = Object.assign({}, i, { signal: m.signal });
    return e.set(y, m), t(c, r).finally(function() {
      _ && g && _.removeEventListener("abort", g), e.get(y) === m && e.delete(y);
    });
  }
  h.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = h;
  function l(c) {
    if (!c.detail || !c.detail.url) return;
    const i = c.target, f = (c.detail.method || (c.detail.body ? "POST" : "GET")).toUpperCase(), p = c.detail.key;
    p && d.has(p) && (d.get(p).abort(), d.delete(p));
    const y = new AbortController(), m = c.detail.signal;
    let _ = null;
    m && (m.aborted ? y.abort(m.reason) : (_ = function() {
      y.abort(m.reason);
    }, m.addEventListener("abort", _, { once: !0 }))), p && d.set(p, y);
    const g = { method: f, signal: y.signal };
    c.detail.body !== void 0 && (g.body = c.detail.body), window.fetch(c.detail.url, g).then(function(r) {
      m && _ && m.removeEventListener("abort", _), p && d.get(p) === y && d.delete(p), S(i, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      m && _ && m.removeEventListener("abort", _), p && d.get(p) === y && d.delete(p), !(r && r.name === "AbortError") && S(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  function u(c) {
    const i = c.detail || {};
    i.all ? window.lnHttp.cancelAll() : i.key ? window.lnHttp.cancelByKey(i.key) : i.url && window.lnHttp.cancel(i.url);
  }
  document.addEventListener("ln-http:request", l), document.addEventListener("ln-http:cancel", u), window.lnHttp = {
    cancel: function(c) {
      let i = !1;
      return e.forEach(function(f, p) {
        p.endsWith(" " + c) && (f.abort(), e.delete(p), i = !0);
      }), i;
    },
    cancelByKey: function(c) {
      return d.has(c) ? (d.get(c).abort(), d.delete(c), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(c) {
        c.abort();
      }), e.clear(), d.forEach(function(c) {
        c.abort();
      }), d.clear();
    },
    get inflight() {
      const c = [];
      return e.forEach(function(i, f) {
        const p = f.indexOf(" ");
        c.push({ method: f.slice(0, p), url: f.slice(p + 1) });
      }), d.forEach(function(i, f) {
        c.push({ key: f });
      }), c;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", l), document.removeEventListener("ln-http:cancel", u), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const d = /* @__PURE__ */ new Map();
  function h(l) {
    if (this.dom = l, this.url = l.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Gn(), this._held = !0;
    const u = this, c = this.url;
    let i = d.get(c);
    return i || (i = fetch(c).then(function(f) {
      if (!f.ok)
        throw new Error("HTTP error! status: " + f.status);
      return f.text();
    }).catch(function(f) {
      throw d.delete(c), f;
    }), d.set(c, i)), i.then(function(f) {
      if (u._destroyed) return;
      const p = document.createElement("template");
      p.innerHTML = f, u.dom.content.appendChild(p.content), S(u.dom, "ln-include:loaded", { target: u.dom, url: u.url }), u._held && (u._held = !1, Zt());
    }).catch(function(f) {
      u._destroyed || (console.error("[ln-include] Failed to fetch template from " + u.url + ":", f), S(u.dom, "ln-include:error", { target: u.dom, url: u.url, error: f }), u._held && (u._held = !1, Zt()));
    }), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, Zt()), delete this.dom[e]);
  }, F(t, e, h, "ln-include");
})();
(function() {
  const t = "data-ln-form", e = "lnForm", d = "data-ln-form-action-edit", h = "data-ln-form-action-method";
  if (window[e] !== void 0) return;
  function l(u) {
    this.dom = u, this._baseAction = u.getAttribute("action") || "";
    const c = this;
    return this._onLnFill = function(i) {
      i.target === c.dom && (i.detail ? (c.fill(i.detail), c._applyActionMode(i.detail)) : c.dom.reset());
    }, this._onReset = function() {
      c._applyActionMode(null);
    }, u.addEventListener("ln-fill", this._onLnFill), u.addEventListener("reset", this._onReset), this;
  }
  l.prototype.fill = function(u) {
    const c = Ve(this.dom, u);
    for (let i = 0; i < c.length; i++) {
      const f = c[i], p = f.tagName === "SELECT" || f.type === "checkbox" || f.type === "radio";
      f.dispatchEvent(new Event(p ? "change" : "input", { bubbles: !0 }));
    }
  }, l.prototype._ensureMethodInput = function() {
    let u = this.dom.querySelector('input[name="_method"]');
    return u || (u = document.createElement("input"), u.type = "hidden", u.name = "_method", u.value = "", this.dom.appendChild(u)), u;
  }, l.prototype._applyActionMode = function(u) {
    if (!this.dom.hasAttribute(d)) return;
    const c = u && u.id != null && u.id !== "" ? u.id : null, i = this._ensureMethodInput();
    if (c !== null) {
      const f = this.dom.getAttribute(d);
      f ? this.dom.setAttribute("action", f.replace(":id", encodeURIComponent(c))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(c)), i.value = this.dom.getAttribute(h) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), i.value = "";
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, F(t, e, l, "ln-form");
})();
const qe = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function xe(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function di(t, e) {
  const d = [];
  if (t) {
    const h = Object.keys(qe);
    for (let l = 0; l < h.length; l++) {
      const u = h[l], c = qe[u];
      t[c] && d.push(u);
    }
  }
  if (e) {
    const h = Array.from(e);
    for (let l = 0; l < h.length; l++)
      h[l] && d.indexOf(h[l]) === -1 && d.push(h[l]);
  }
  return d;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", d = "data-ln-validate-errors", h = "data-ln-validate-error", l = "ln-validate-valid", u = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  function c(i) {
    this.dom = i, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const f = this, p = i.tagName, y = i.type, m = p === "SELECT" || y === "checkbox" || y === "radio";
    this._onInput = function() {
      f._touched = !0, f.validate();
    }, this._onChange = function() {
      f._touched = !0, f.validate();
    }, this._onSetCustom = function(r) {
      const a = r.detail && r.detail.error;
      if (!a) return;
      f._customErrors.add(a), f._touched = !0;
      const n = i.closest(".form-element");
      if (n) {
        const o = n.querySelector("[" + h + '="' + a + '"]');
        o && o.classList.remove("hidden");
      }
      i.classList.remove(l), i.classList.add(u), i.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(r) {
      const a = r.detail && r.detail.error, n = i.closest(".form-element");
      if (a) {
        if (f._customErrors.delete(a), n) {
          const o = n.querySelector("[" + h + '="' + a + '"]');
          o && o.classList.add("hidden");
        }
      } else
        f._customErrors.forEach(function(o) {
          if (n) {
            const s = n.querySelector("[" + h + '="' + o + '"]');
            s && s.classList.add("hidden");
          }
        }), f._customErrors.clear();
      f._touched && f.validate();
    }, m || i.addEventListener("input", this._onInput), i.addEventListener("change", this._onChange), i.addEventListener("ln-validate:set-custom", this._onSetCustom), i.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = i.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      f.reset();
    }, this._onValidateRequest = function(r) {
      f._touched = !0, !f.validate() && r.detail && r.detail.invalidFields && r.detail.invalidFields.push(f.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(r) {
      const a = { invalidFields: [] };
      S(_, "ln-validate:request-validate", a), a.invalidFields.length > 0 && (r.preventDefault(), a.invalidFields.sort((n, o) => n.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), a.invalidFields[0].focus());
    }))), (i.value && i.value.trim() !== "" || i.checked) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const i = this.dom, f = i.validity, p = xe(f, this._customErrors.size), y = di(f, this._customErrors), m = i.closest(".form-element");
    if (m) {
      const g = m.querySelector("[" + d + "]");
      if (g) {
        const r = g.querySelectorAll("[" + h + "]");
        for (let a = 0; a < r.length; a++) {
          const n = r[a].getAttribute(h);
          r[a].classList.toggle("hidden", !y.includes(n));
        }
      }
    }
    return i.classList.toggle(l, p), i.classList.toggle(u, !p), i.setAttribute("aria-invalid", p ? "false" : "true"), S(i, p ? "ln-validate:valid" : "ln-validate:invalid", { target: i, field: i.name, errors: y }), p;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(l, u), this.dom.removeAttribute("aria-invalid");
    const i = this.dom.closest(".form-element");
    if (i) {
      const f = i.querySelectorAll("[" + h + "]");
      for (let p = 0; p < f.length; p++)
        f[p].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return xe(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const i = this.dom.form;
    i && (this._onFormReset && i.removeEventListener("reset", this._onFormReset), this._onValidateRequest && i.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(l, u), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, F(t, e, c, "ln-validate");
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", d = "data-ln-form-scope";
  if (window[e] !== void 0) return;
  function h(m) {
    if (!m.hasAttribute(t) || m[e]) return;
    m[e] = !0;
    const _ = f(m);
    l(_.links), u(_.forms);
  }
  function l(m) {
    for (const _ of m) {
      if (_[e + "Trigger"] || _.hostname && _.hostname !== window.location.hostname) continue;
      const g = _.getAttribute("href");
      if (g && g.includes("#")) continue;
      const r = function(a) {
        if (!Ye(a, _)) return;
        a.preventDefault();
        const n = _.getAttribute("href");
        n && i("GET", n, null, _);
      };
      _.addEventListener("click", r), _[e + "Trigger"] = r;
    }
  }
  function u(m) {
    for (const _ of m) {
      if (_[e + "Trigger"]) continue;
      if (_.hasAttribute(d)) {
        _[e + "ScopeWarned"] || (_[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const g = function(r) {
        if (r.defaultPrevented) return;
        r.preventDefault();
        const a = _.method.toUpperCase(), n = _.action, o = new FormData(_);
        for (const s of _.querySelectorAll('button, input[type="submit"]'))
          s.disabled = !0;
        i(a, n, o, _, function() {
          for (const s of _.querySelectorAll('button, input[type="submit"]'))
            s.disabled = !1;
        });
      };
      _.addEventListener("submit", g), _[e + "Trigger"] = g;
    }
  }
  function c(m) {
    if (!m[e]) return;
    const _ = f(m);
    for (const g of _.links)
      g[e + "Trigger"] && (g.removeEventListener("click", g[e + "Trigger"]), delete g[e + "Trigger"]);
    for (const g of _.forms)
      g[e + "Trigger"] && (g.removeEventListener("submit", g[e + "Trigger"]), delete g[e + "Trigger"]);
    delete m[e];
  }
  function i(m, _, g, r, a) {
    if (G(r, "ln-ajax:before-start", { method: m, url: _ }).defaultPrevented) return;
    S(r, "ln-ajax:start", { method: m, url: _ }), r.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", r.appendChild(o);
    function s() {
      r.classList.remove("ln-ajax--loading");
      const C = r.querySelector(".ln-ajax-spinner");
      C && C.remove(), a && a();
    }
    let b = _;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    g instanceof FormData && w && g.append("_token", w);
    const A = {
      method: m,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (A.headers["X-CSRF-TOKEN"] = w), m === "GET" && g) {
      const C = new URLSearchParams(g);
      b = _ + (_.includes("?") ? "&" : "?") + C.toString();
    } else m !== "GET" && g && (A.body = g);
    fetch(b, A).then(function(C) {
      const L = C.ok, q = C.status;
      return C.text().then(function(x) {
        let R = null, M = null;
        if (x && x.trim())
          try {
            R = JSON.parse(x);
          } catch (N) {
            M = N;
          }
        return { ok: L, status: q, data: R, parseError: M };
      });
    }).then(function(C) {
      const L = C.status, q = C.data, x = C.parseError;
      if (C.ok && !x) {
        if (q && q.title && (document.title = q.title), q && q.content)
          for (const R in q.content) {
            const M = document.getElementById(R);
            M && (M.innerHTML = q.content[R]);
          }
        if (r.tagName === "A") {
          const R = r.getAttribute("href");
          R && window.history.pushState({ ajax: !0 }, "", R);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        S(r, "ln-ajax:success", { method: m, url: b, data: q });
      } else
        S(r, "ln-ajax:error", {
          method: m,
          url: b,
          status: L,
          data: q,
          error: x || null
        });
      S(r, "ln-ajax:complete", { method: m, url: b }), s();
    }).catch(function(C) {
      S(r, "ln-ajax:error", { method: m, url: b, status: 0, data: null, error: C }), S(r, "ln-ajax:complete", { method: m, url: b }), s();
    });
  }
  function f(m) {
    const _ = { links: [], forms: [] };
    return m.tagName === "A" && m.getAttribute(t) !== "false" ? _.links.push(m) : m.tagName === "FORM" && m.getAttribute(t) !== "false" ? _.forms.push(m) : (_.links = Array.from(m.querySelectorAll('a:not([data-ln-ajax="false"])')), _.forms = Array.from(m.querySelectorAll('form:not([data-ln-ajax="false"])'))), _;
  }
  function p() {
    at(function() {
      new MutationObserver(function(_) {
        for (const g of _)
          if (g.type === "childList") {
            for (const r of g.addedNodes)
              if (r.nodeType === 1 && (h(r), !r.hasAttribute(t))) {
                for (const n of r.querySelectorAll("[" + t + "]"))
                  h(n);
                const a = r.closest && r.closest("[" + t + "]");
                if (a && a.getAttribute(t) !== "false") {
                  const n = f(r);
                  l(n.links), u(n.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), fe([t], function(_) {
        h(_);
      });
    }, "ln-ajax");
  }
  function y() {
    for (const m of document.querySelectorAll("[" + t + "]"))
      h(m);
  }
  window[e] = h, window[e].destroy = c, p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y();
})();
function ui(t, { isHydration: e = !1, hasPrimaryRegion: d = !1, primaryMatch: h = null } = {}) {
  const l = d ? !h : !t.some((p) => p.match), u = [], c = [];
  for (const p of t)
    if (!(!p.targetEl && !p.isPending)) {
      if (!p.match) {
        const y = e && p.hasHydrate && p.hasChildren;
        !p.hasKeep && p.hasChildren && !y && p.targetEl && u.push(p);
        continue;
      }
      p.hasKeep && p.mountedTemplate === p.match.route.templateNode || c.push(Object.assign({}, p, {
        skipMount: e && p.hasHydrate && p.hasChildren
      }));
    }
  c.sort((p, y) => p.regionKey === "__primary__" ? -1 : y.regionKey === "__primary__" ? 1 : 0);
  const f = c.find((p) => p.regionKey === "__primary__") || c[0] || null;
  return { notFound: l, clears: u, swaps: c, owner: f };
}
const hn = {
  navigate: function(t) {
    It(t, { historyAction: "push" });
  },
  replace: function(t) {
    It(t, { historyAction: "replace" });
  },
  current: function() {
    return jt === null ? null : {
      path: jt,
      params: mn,
      query: gn,
      route: _n,
      regions: pn
    };
  }
}, be = "data-ln-route", fn = "lnRoute";
typeof window < "u" && (window.lnRouter = hn);
const ct = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new WeakMap();
let pn = /* @__PURE__ */ new Map(), ke = !1, jt = null, mn = {}, gn = {}, _n = null, ae = !1;
function Ie(t, e, d) {
  ae ? queueMicrotask(function() {
    S(t, e, d);
  }) : S(t, e, d);
}
function Vt(t) {
  try {
    const u = new URL(t, window.location.origin);
    t = u.pathname + u.search + u.hash;
  } catch {
  }
  let [e] = t.split("#"), [d, h] = e.split("?");
  const l = {};
  if (h) {
    const u = new URLSearchParams(h);
    for (const [c, i] of u.entries())
      l[c] = i;
  }
  return d = d.replace(/\/+$/, ""), d === "" && (d = "/"), { path: d, query: l };
}
function bn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const d = t.segments, h = e.segments, l = Math.max(d.length, h.length);
  for (let u = 0; u < l; u++) {
    const c = d[u], i = h[u];
    if (c === void 0) return 1;
    if (i === void 0) return -1;
    if (c === "*") return 1;
    if (i === "*") return -1;
    const f = c.startsWith(":"), p = i.startsWith(":");
    if (f && !p) return 1;
    if (!f && p) return -1;
  }
  return 0;
}
function yn(t, e) {
  const d = t.split("/").filter(Boolean);
  for (const h of e) {
    if (h.pattern === "*")
      return {
        route: h,
        params: { wildcard: t }
      };
    const l = h.segments, u = {};
    let c = !0;
    if (!(d.length > l.length && l[l.length - 1] !== "*")) {
      for (let i = 0; i < l.length; i++) {
        const f = l[i], p = d[i];
        if (f === "*") {
          u.wildcard = d.slice(i).join("/");
          break;
        }
        if (p === void 0) {
          c = !1;
          break;
        }
        if (f.startsWith(":"))
          u[f.slice(1)] = decodeURIComponent(p);
        else if (f !== p) {
          c = !1;
          break;
        }
      }
      if (c && (l.indexOf("*") !== -1 || d.length <= l.length))
        return { route: h, params: u };
    }
  }
  return null;
}
function le(t, e = {}) {
  const d = e.warn !== !1;
  if (t !== "__primary__") {
    const l = document.getElementById(t);
    return !l && d && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), l;
  }
  const h = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !h && d && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), h;
}
function De(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), d = [t].concat(e);
  for (const l of d)
    for (const u of Object.keys(l))
      if (u.startsWith("ln") && l[u] && typeof l[u].destroy == "function")
        try {
          l[u].destroy();
        } catch (c) {
          console.error(`[ln-router] Error destroying component ${u} on element:`, l, c);
        }
  const h = document.querySelectorAll('[data-ln-popover="open"]');
  for (const l of h) {
    const u = l.lnPopover;
    if (u && u.trigger && t.contains(u.trigger))
      try {
        u.destroy();
      } catch (c) {
        console.error("[ln-router] Error destroying open popover:", c);
      }
  }
}
function It(t, e = {}) {
  const { path: d, query: h } = Vt(t), l = /* @__PURE__ */ new Map();
  for (const [_, g] of ct)
    l.set(_, yn(d, g.sorted));
  const u = l.get("__primary__") || null, c = le("__primary__", { warn: !!u }), i = ct.has("__primary__"), f = [];
  for (const [_, g] of l) {
    const r = _ === "__primary__" ? c : le(_, { warn: !1 }), a = !r && !!(u && u.route && u.route.templateNode && u.route.templateNode.content && u.route.templateNode.content.querySelector("#" + CSS.escape(_)));
    !r && !a && g && console.warn(`[ln-router] Explicit target element #${_} not found in DOM`), f.push({
      regionKey: _,
      match: g,
      targetEl: r,
      isPending: a,
      hasKeep: !!r && r.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!r && r.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!r && r.children.length > 0,
      mountedTemplate: r && te.get(r) || null
    });
  }
  const p = ui(f, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: i,
    primaryMatch: u
  });
  if (p.notFound) {
    Ie(document.body, "ln-router:not-found", { path: d });
    return;
  }
  if (G(c || document.body, "ln-router:before-navigate", {
    from: jt,
    to: t,
    params: u ? u.params : {},
    query: h
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const m = function() {
    for (const _ of p.clears)
      De(_.targetEl), _.targetEl.replaceChildren(), te.delete(_.targetEl);
    for (const _ of p.swaps) {
      if ((_.isPending || !_.targetEl || !document.contains(_.targetEl)) && (_.targetEl = _.regionKey === "__primary__" ? c : document.getElementById(_.regionKey)), !_.targetEl) {
        console.warn(`[ln-router] Target element #${_.regionKey} could not be resolved`);
        continue;
      }
      if (_.skipMount || (De(_.targetEl), _.targetEl.replaceChildren(_.match.route.templateNode.content.cloneNode(!0))), te.set(_.targetEl, _.match.route.templateNode), p.owner && _.regionKey === p.owner.regionKey) {
        if (_.match.route.title) {
          let g = _.match.route.title;
          if (_.match.params)
            for (const [r, a] of Object.entries(_.match.params))
              g = g.replace(new RegExp("\\{\\{\\s*" + r + "\\s*\\}\\}", "g"), a);
          document.title = g;
        }
        if (!e.isHydration) {
          _.targetEl.hasAttribute("tabindex") || _.targetEl.setAttribute("tabindex", "-1");
          const g = _.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          g ? (g.setAttribute("tabindex", "-1"), g.focus()) : _.targetEl.focus(), _.regionKey === "__primary__" && _.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Ie(_.targetEl, "ln-router:navigated", {
        path: t,
        params: _.match.params,
        query: h,
        route: _.match.route,
        target: _.targetEl,
        region: _.regionKey
      });
    }
    jt = t, gn = h, _n = u ? u.route : null, mn = u ? u.params : {}, pn = new Map(
      Array.from(l.entries()).map(([_, g]) => [_, g ? { route: g.route, params: g.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(m) : m();
}
function hi(t) {
  const e = t.target.closest("a");
  if (!e || !Ye(t, e)) return;
  const d = e.getAttribute("href"), { path: h } = Vt(d);
  for (const l of ct.values())
    if (yn(h, l.sorted)) {
      t.preventDefault(), It(d, { historyAction: "push" });
      return;
    }
}
function fi(t, e) {
  const d = Object.keys(t), h = Object.keys(e);
  if (d.length !== h.length) return !1;
  for (let l = 0; l < d.length; l++) {
    const u = d[l];
    if (t[u] !== e[u]) return !1;
  }
  return !0;
}
function pi() {
  const t = window.location.pathname + window.location.search, e = hn.current();
  if (e && e.path != null) {
    const d = Vt(t);
    if (Vt(e.path).path === d.path && fi(e.query, d.query))
      return;
  }
  It(t, { historyAction: "skip" });
}
function mi() {
  ke || (ke = !0, at(function() {
    document.addEventListener("click", hi), window.addEventListener("popstate", pi), ae = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    It(t, { historyAction: "replace", isHydration: !0 }), ae = !1;
  }, "ln-router"));
}
function gi(t) {
  const e = t.getAttribute(be);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null;
  if (d === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const h = d || "__primary__";
  ct.has(h) || ct.set(h, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const l = ct.get(h);
  if (l.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${h}"`);
    return;
  }
  const u = t.getAttribute("data-ln-route-title"), c = e.split("/").filter(Boolean), i = {
    pattern: e,
    segments: c,
    target: d,
    title: u,
    templateNode: t
  }, f = le(h);
  f && f.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), l.routes.set(e, i), l.sorted = Array.from(l.routes.values()).sort(bn);
}
function _i(t) {
  const e = t.getAttribute(be);
  if (!e) return;
  const h = t.getAttribute("data-ln-route-target") || null || "__primary__", l = ct.get(h);
  l && (l.routes.delete(e), l.sorted = Array.from(l.routes.values()).sort(bn), l.routes.size === 0 && ct.delete(h));
}
function vn(t) {
  return this.dom = t, gi(t), this;
}
vn.prototype.destroy = function() {
  _i(this.dom), delete this.dom[fn];
};
F(be, fn, vn, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ct.size > 0 && mi();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  function d(l) {
    this.dom = l, this.isOpen = l.getAttribute(t) === "open";
    const u = this;
    return this._onRequestOpen = function() {
      u.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      u.dom.setAttribute(t, "close");
    }, this._onCancel = function(c) {
      c.preventDefault(), u.dom.setAttribute(t, "close");
    }, this._onClickClose = function(c) {
      const i = c.target.closest("[data-ln-modal-close]");
      i && u.dom.contains(i) && (c.preventDefault(), u.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  d.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, d.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, d.prototype.toggle = function() {
    const l = this.dom.getAttribute(t);
    this.dom.setAttribute(t, l === "open" ? "close" : "open");
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const l = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(c) {
            return c !== l;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function h(l) {
    const u = l[e];
    if (!u) return;
    const i = l.getAttribute(t) === "open";
    if (i !== u.isOpen)
      if (i) {
        if (G(l, "ln-modal:before-open", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(t, "close");
          return;
        }
        u.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof l.showModal == "function" && l.showModal();
        const p = l.querySelector("[autofocus]");
        if (p && kt(p))
          p.focus();
        else {
          const y = l.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), m = Array.prototype.find.call(y, kt);
          if (m) m.focus();
          else {
            const _ = l.querySelectorAll("a[href], button:not([disabled])"), g = Array.prototype.find.call(_, kt);
            g && g.focus();
          }
        }
        S(l, "ln-modal:open", { modalId: l.id, target: l });
      } else {
        if (G(l, "ln-modal:before-close", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(t, "open");
          return;
        }
        u.isOpen = !1, S(l, "ln-modal:close", { modalId: l.id, target: l }), typeof l.close == "function" && l.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  F(t, e, d, "ln-modal", {
    onAttributeChange: h
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", d = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  function h(n) {
    const o = {};
    let s = n;
    const b = [];
    for (; s; ) {
      const v = s.closest("[" + t + "]");
      if (!v) break;
      v[e] && v[e].dict && b.unshift(v[e].dict), s = v.parentElement;
    }
    for (const v of b)
      Object.assign(o, v);
    return o;
  }
  function l(n, o) {
    if (o) {
      if (n) {
        const b = n.closest("[" + t + "]");
        if (b) {
          if (b.id === o && b.hasAttribute("data-ln-modal")) return b;
          const v = b.querySelector("#" + CSS.escape(o) + '[data-ln-modal], [data-ln-modal="' + o + '"]');
          if (v) return v;
        }
      }
      const s = document.getElementById(o) || document.querySelector('[data-ln-modal="' + o + '"]');
      if (s) return s;
    }
    if (n) {
      const s = n.closest("[" + t + "]");
      if (s) {
        if (s.hasAttribute("data-ln-modal")) return s;
        const v = s.querySelector("[data-ln-modal]");
        if (v) return v;
      }
      const b = n.closest("[data-ln-modal]");
      if (b) return b;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function u(n, o) {
    if (n !== "edit") return "";
    if (o) {
      const s = o.getAttribute("data-ln-fill-id");
      if (s) return s;
    }
    return "edit";
  }
  function c(n) {
    if (!n) return;
    const o = n.querySelectorAll("[data-ln-field]");
    for (let b = 0; b < o.length; b++)
      o[b].textContent = "";
    const s = n.querySelectorAll("form");
    for (let b = 0; b < s.length; b++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(s[b], null) : s[b].reset();
  }
  document.addEventListener("click", function(n) {
    if (n.ctrlKey || n.metaKey || n.button === 1) return;
    const o = n.target.closest("[data-ln-modal-for]");
    if (o) {
      const b = o.getAttribute("data-ln-modal-for"), v = l(o, b);
      if (v && v.lnModal) {
        n.preventDefault();
        const w = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, A = {}, C = o.dataset;
        for (const x in C) {
          if (!x.startsWith("lnModal") || w[x]) continue;
          const R = x.slice(7);
          R && (A[R.charAt(0).toLowerCase() + R.slice(1)] = C[x]);
        }
        const L = Object.keys(A).length > 0;
        o.hasAttribute("data-ln-modal-mode") ? v.dataset.lnModalMode = o.getAttribute("data-ln-modal-mode") : v.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v, A) : v.dataset.lnModalMode === "new" && c(v), v.getAttribute("data-ln-modal") === "open" ? S(v, "ln-modal:request-close", {}) : (v.id && et(v.id, u(v.dataset.lnModalMode, o)), S(v, "ln-modal:request-open", {}));
      }
      return;
    }
    const s = n.target.closest('a[href^="#"]');
    if (s) {
      const b = Qt(s.getAttribute("href"));
      for (const v in b) {
        const w = document.getElementById(v);
        if (w && w.lnModal) {
          if (!ge(n)) return;
          et(v, b[v]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(n) {
    const o = n.target;
    if (!o || !o.lnModal) return;
    (o.dataset.lnModalMode || "new") === "new" && c(o);
  }), document.addEventListener("ln-modal:open", function(n) {
    const o = n.target;
    if (!o || !o.lnModal || !o.id) return;
    let s = X(o.id);
    s === null && (s = u(o.dataset.lnModalMode, null), et(o.id, s)), s ? (o.dataset.lnModalMode = "edit", o.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: s }
    }))) : (o.dataset.lnModalMode = "new", c(o));
  });
  let i = !1;
  function f() {
    if (!i) {
      i = !0;
      try {
        const n = document.querySelectorAll("[data-ln-modal][id]");
        for (let o = 0; o < n.length; o++) {
          const s = n[o];
          if (!s.lnModal) continue;
          const b = s.id, v = X(b), w = v !== null, A = s.lnModal.isOpen;
          if (w) {
            const C = v ? "edit" : "new";
            s.dataset.lnModalMode = C, A ? v ? s.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : c(s) : S(s, "ln-modal:request-open", {});
          } else A && S(s, "ln-modal:request-close", {});
        }
      } finally {
        i = !1;
      }
    }
  }
  function p() {
    const n = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let o = 0; o < n.length; o++) {
      const s = n[o];
      s.lnModal && X(s.id) === null && et(s.id, u(s.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", f);
  function y() {
    p(), f();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(y);
  }) : it(y);
  function m(n) {
    const s = (n.detail || {}).data;
    if (s && s.message) {
      const v = s.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: v.type || "success",
          title: v.title || "",
          message: v.body || ""
        }
      }));
    }
    const b = n.target.closest("[data-ln-modal]");
    b && b.lnModal && (b.id && et(b.id, null), S(b, "ln-modal:request-close", {}), c(b));
  }
  function _(n) {
    const o = n.detail || {}, s = o.data, b = o.status || 0, v = h(n.target);
    if (s && s.message) {
      const w = s.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: w.type || "error",
          title: w.title || "",
          message: w.body || ""
        }
      }));
    } else b === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v["network-error-title"] || "",
        message: v["network-error"] || "Network error"
      }
    })) : window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v["server-error-title"] || "",
        message: v["server-error"] || "Server error"
      }
    }));
  }
  document.addEventListener("ln-ajax:success", m), document.addEventListener("ln-ajax:error", _);
  function g(n) {
    const o = n.detail || {}, s = h(n.target), b = o.message || (o.reason === "max-size" ? s["upload-max-size"] || "File is too large" : o.reason === "max-files" ? s["upload-max-files"] || "Maximum file count exceeded" : s["upload-invalid-type"] || "This file type is not allowed"), v = s["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: b
      }
    }));
  }
  function r(n) {
    const o = n.detail || {}, s = h(n.target), b = o.message || s["upload-failed"] || "Failed to upload file", v = s["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: b
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", g), document.addEventListener("ln-upload:error", r), document.addEventListener("ln-modal:close", function(n) {
    const o = n.target;
    !o || !o.lnModal || (o.id && X(o.id) !== null && et(o.id, null), o.dataset.lnModalMode === "new" && c(o));
  });
  function a(n) {
    return this.dom = n, this.dict = Wt(n, d), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, F(t, e, a, "ln-ui-coordinator");
})();
function bi(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let d = e, h = 0;
  for (let l = 0; l < t.length && d > 0; l++)
    h = l + 1, /[0-9]/.test(t[l]) && d--;
  return d > 0 && (h = t.length), h;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(l) {
    if (l[e]) return l[e];
    l[e] = this, this.dom = l;
    const u = this;
    if (this._onLocaleChange = function() {
      u.isTextElement ? u._formatTextContent() : isNaN(u.value) || u._displayFormatted(u.value);
    }, Gt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), l.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const c = document.createElement("input");
    c.type = "hidden", c.name = l.name, l.removeAttribute("name"), l.hasAttribute("data-ln-fill-as") && c.setAttribute("data-ln-fill-as", l.getAttribute("data-ln-fill-as")), l.type = "text", l.setAttribute("inputmode", "decimal"), l.insertAdjacentElement("afterend", c), this._hidden = c, Object.defineProperty(c, "value", {
      get: function() {
        return d.get.call(c);
      },
      set: function(f) {
        if (d.set.call(c, f), f !== "" && !isNaN(parseFloat(f))) {
          const p = u.dom.getAttribute("data-ln-number-decimals");
          u._setDisplayRaw(tt(parseFloat(f), W(u.dom), { maxDecimals: p }));
        } else
          u._setDisplayRaw("");
        u.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), We(l, d, {
      get: function() {
        return d.get.call(l);
      },
      set: function(f) {
        if (f === "") {
          u._setDisplayRaw(""), u._setHiddenRaw(""), l.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const p = typeof f == "number" ? f : Ot(String(f), W(l));
        if (isNaN(p))
          u._setDisplayRaw(String(f)), u._setHiddenRaw("");
        else {
          u._setHiddenRaw(p);
          const y = l.getAttribute("data-ln-number-decimals");
          u._setDisplayRaw(tt(p, W(l), { maxDecimals: y }));
        }
        l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      u._handleInput();
    }, l.addEventListener("input", this._onInput), this._onKeyDown = function(f) {
      if (f.key !== "Backspace") return;
      const p = l.selectionStart, y = l.selectionEnd;
      if (p !== y || p === 0) return;
      const m = Kt(W(l)), _ = d.get.call(l), g = _[p - 1];
      if (g === m.groupSep || /\s/.test(g)) {
        f.preventDefault();
        const r = p - 2 >= 0 ? p - 2 : 0, a = _.slice(0, r) + _.slice(p);
        d.set.call(l, a), l.setSelectionRange(r, r), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, l.addEventListener("keydown", this._onKeyDown), this._onPaste = function(f) {
      f.preventDefault();
      const p = (f.clipboardData || window.clipboardData).getData("text"), y = Ot(p, W(l));
      u.value = isNaN(y) ? NaN : y;
    }, l.addEventListener("paste", this._onPaste);
    const i = l.value;
    if (i !== "") {
      const f = Ot(i, W(l));
      if (!isNaN(f)) {
        const p = l.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(f), this._setDisplayRaw(tt(f, W(l), { maxDecimals: p })), l.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  h.prototype._initTextElement = function() {
    const l = this.dom;
    let u = l.getAttribute("data-ln-value"), c = l.getAttribute("data-ln-number"), i = null;
    u !== null && u !== "" ? i = u : c !== null && c !== "" && c !== "true" ? i = c : i = l.textContent.trim();
    const f = Ot(i, W(l));
    isNaN(f) ? this._rawValue = null : (this._rawValue = f, l.hasAttribute("data-ln-value") || l.setAttribute("data-ln-value", String(f)), this._formatTextContent());
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const l = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = tt(this._rawValue, W(this.dom), { maxDecimals: l });
    }
  }, h.prototype._handleInput = function() {
    const l = this.dom, u = d.get.call(l);
    if (u === "") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (u === "-") {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const c = l.selectionStart;
    let i = 0;
    for (let b = 0; b < c; b++)
      /[0-9]/.test(u[b]) && i++;
    const f = W(l), p = Kt(f);
    let y = u, m = cn(u, p.groupSep, p.decimalSep), _ = parseFloat(m);
    if (isNaN(_)) {
      this._setHiddenRaw(""), S(l, "ln-number:input", { value: NaN, formatted: u });
      return;
    }
    const g = l.getAttribute("data-ln-number-decimals"), r = m.indexOf(".");
    if (g !== null && r !== -1) {
      const b = parseInt(g, 10), v = m.slice(r + 1);
      if (b === 0)
        m = m.slice(0, r), y = y.split(p.decimalSep)[0], _ = parseFloat(m), this._setDisplayRaw(y);
      else if (v.length > b) {
        m = m.slice(0, r + 1 + b);
        const w = y.split(p.decimalSep);
        y = w[0] + p.decimalSep + w[1].slice(0, b), _ = parseFloat(m), this._setDisplayRaw(y);
      }
    }
    const a = l.getAttribute("data-ln-number-max");
    if (a !== null && _ > parseFloat(a)) {
      const b = parseFloat(a), v = tt(b, f, { maxDecimals: g });
      this._setDisplayRaw(v), this._setHiddenRaw(b), l.setSelectionRange(v.length, v.length), S(l, "ln-number:input", { value: b, formatted: v });
      return;
    }
    if (y.endsWith(p.decimalSep) || p.decimalSep !== "." && y.endsWith(".")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: y });
      return;
    }
    const n = m.indexOf(".");
    if (n !== -1 && m.slice(n + 1).endsWith("0")) {
      this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: y });
      return;
    }
    let o;
    if (g !== null)
      o = tt(_, f, { maxDecimals: g });
    else {
      const b = n !== -1 ? m.slice(n + 1).length : 0;
      o = tt(_, f, { userDecimals: b });
    }
    this._setDisplayRaw(o);
    const s = bi(o, i);
    l.setSelectionRange(s, s), this._setHiddenRaw(_), S(l, "ln-number:input", { value: _, formatted: o });
  }, h.prototype._setHiddenRaw = function(l) {
    this._hidden && d.set.call(this._hidden, String(l));
  }, h.prototype._setDisplayRaw = function(l) {
    this.isTextElement ? this.dom.textContent = String(l) : d.set.call(this.dom, String(l));
  }, h.prototype._displayFormatted = function(l) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, W(this.dom), { maxDecimals: u }));
    }
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const l = d.get.call(this._hidden);
      return l === "" ? NaN : parseFloat(l);
    },
    set: function(l) {
      if (this.isTextElement) {
        typeof l != "number" || isNaN(l) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = l, this.dom.setAttribute("data-ln-value", String(l)), this._formatTextContent());
        return;
      }
      if (typeof l != "number" || isNaN(l)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(l);
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(tt(l, W(this.dom), { maxDecimals: u })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : d.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, F(t, e, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(l) {
      const u = l[e];
      u && (u.isTextElement ? u._initTextElement() : isNaN(u.value) || u._displayFormatted(u.value));
    }
  });
})();
const ce = /^(short|medium|long)(\s+datetime)?$/, yi = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function vi(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(ce) ? yi[t.trim()] : null;
}
function Mt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let d, h;
  if (e.indexOf(".") !== -1)
    d = ".", h = e.split(".");
  else if (e.indexOf("/") !== -1)
    d = "/", h = e.split("/");
  else if (e.indexOf("-") !== -1)
    d = "-", h = e.split("-");
  else
    return null;
  if (h.length !== 3) return null;
  const l = [];
  for (let p = 0; p < 3; p++) {
    const y = parseInt(h[p], 10);
    if (isNaN(y)) return null;
    l.push(y);
  }
  let u, c, i;
  d === "." ? (u = l[0], c = l[1], i = l[2]) : d === "/" ? (c = l[0], u = l[1], i = l[2]) : h[0].length === 4 ? (i = l[0], c = l[1], u = l[2]) : (u = l[0], c = l[1], i = l[2]), i < 100 && (i += i < 50 ? 2e3 : 1900);
  const f = new Date(i, c - 1, u);
  return f.getFullYear() !== i || f.getMonth() !== c - 1 || f.getDate() !== u ? null : f;
}
function ee(t, e, d, h) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const l = t.getDate(), u = t.getMonth(), c = t.getFullYear(), i = t.getHours(), f = t.getMinutes();
  let p, y;
  const m = (d || "").toLowerCase().split("-")[0];
  let _ = !1;
  try {
    const a = new Intl.DateTimeFormat(d, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    _ = !!(h && a !== m);
  } catch {
    _ = !!h;
  }
  if (_ && h && h.monthsLong)
    p = h.monthsLong[u];
  else
    try {
      p = new Intl.DateTimeFormat(d, { month: "long" }).format(t);
    } catch {
      p = String(u + 1);
    }
  if (_ && h && h.monthsShort)
    y = h.monthsShort[u];
  else
    try {
      y = new Intl.DateTimeFormat(d, { month: "short" }).format(t);
    } catch {
      y = String(u + 1);
    }
  const g = {
    yyyy: String(c),
    yy: String(c).slice(-2),
    MMMM: p,
    MMM: y,
    MM: String(u + 1).padStart(2, "0"),
    M: String(u + 1),
    dd: String(l).padStart(2, "0"),
    d: String(l),
    HH: String(i).padStart(2, "0"),
    mm: String(f).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(r) {
    return g[r] !== void 0 ? g[r] : r;
  });
}
function Ft(t, e, d, h) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const l = vi(e);
  if (l)
    try {
      const u = new Intl.DateTimeFormat(d, l), c = (d || "").toLowerCase().split("-")[0], i = u.resolvedOptions().locale.toLowerCase().split("-")[0];
      return h && i !== c ? ee(t, "dd.MM.yyyy", d, h) : u.format(t);
    } catch {
      return ee(t, "dd.MM.yyyy", d, h);
    }
  return ee(t, e || "dd.MM.yyyy", d, h);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(i, f, p) {
    S(i.dom, "ln-date:change", {
      value: f,
      formatted: i.dom.value,
      date: p
    }), i.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(i, f, p, y) {
    i._setHiddenRaw(f), d.set.call(i._picker, f), i._lastISO = f, y !== void 0 ? (i._isFormatting = !0, i.dom.value = y, i._isFormatting = !1) : p && i._displayFormatted(p), h(i, f, p);
  }
  function u(i) {
    i._setHiddenRaw(""), d.set.call(i._picker, ""), i._isFormatting = !0, i.dom.value = "", i._isFormatting = !1, i._lastISO = "", h(i, "", null);
  }
  function c(i) {
    if (i[e]) return i[e];
    i[e] = this, this.dom = i;
    const f = this;
    if (this._onLocaleChange = function() {
      if (f.isTextElement)
        f._formatTextContent();
      else if (f.value) {
        const n = Y(f.value);
        n && f._displayFormatted(n);
      }
    }, Gt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = i.value, y = i.name, m = i.closest(".form-element, form") || i.parentNode;
    if (m) {
      const n = m.querySelectorAll("[data-ln-date-dict]");
      for (let o = 0; o < n.length; o++) {
        const s = n[o].getAttribute("data-ln-date-dict");
        if (s) {
          const b = Wt(n[o], "data-ln-date-dict-key");
          b["months-long"] && (b.monthsLong = b["months-long"].split(",").map((v) => v.trim())), b["months-short"] && (b.monthsShort = b["months-short"].split(",").map((v) => v.trim())), pe(s, b);
        }
      }
    }
    const _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(_, i), _.appendChild(i), this._wrapper = _;
    const g = document.createElement("input");
    g.type = "hidden", g.name = y, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && g.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.insertAdjacentElement("afterend", g), this._hidden = g;
    const r = document.createElement("input");
    r.type = "date", r.tabIndex = -1, r.setAttribute("tabindex", "-1"), r.setAttribute("aria-hidden", "true"), r.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Date picker"), r.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", g.insertAdjacentElement("afterend", r), this._picker = r, i.type = "text";
    const a = document.createElement("button");
    if (a.type = "button", a.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Open date picker"), a.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', r.insertAdjacentElement("afterend", a), this._btn = a, this._lastISO = "", Object.defineProperty(g, "value", {
      get: function() {
        return d.get.call(g);
      },
      set: function(n) {
        if (d.set.call(g, n), n && n !== "") {
          const o = Y(n);
          o && l(f, n, o);
        } else n === "" && u(f);
      }
    }), We(i, d, {
      get: function() {
        return d.get.call(i);
      },
      set: function(n, o) {
        if (f._isFormatting) {
          o(n);
          return;
        }
        if (!n || n === "") {
          o(""), u(f);
          return;
        }
        const s = Y(n) || Mt(n);
        if (s) {
          const b = Tt(s), v = i.getAttribute(t) || "", w = W(i), A = _t(w), C = Ft(s, v, w, A);
          o(C), l(f, b, s, C);
        } else
          o(String(n)), u(f);
      }
    }), this._onPickerChange = function() {
      const n = r.value;
      if (n) {
        const o = Y(n);
        o && l(f, n, o);
      } else
        u(f);
    }, r.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const n = f.dom.value.trim();
      if (n === "") {
        f._lastISO !== "" && u(f);
        return;
      }
      if (f._lastISO) {
        const s = Y(f._lastISO);
        if (s) {
          const b = f.dom.getAttribute(t) || "", v = W(f.dom), w = _t(v);
          if (n === Ft(s, b, v, w)) return;
        }
      }
      const o = Mt(n);
      if (o) {
        const s = Tt(o);
        l(f, s, o);
      } else if (f._lastISO) {
        const s = Y(f._lastISO);
        s && f._displayFormatted(s);
      } else
        f.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      f._openPicker();
    }, a.addEventListener("click", this._onBtnClick), p && p !== "") {
      const n = Y(p);
      n && l(f, p, n);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const i = this.dom, f = i.getAttribute("data-ln-value"), p = i.getAttribute("data-ln-date"), y = i.getAttribute("datetime");
    let m = null;
    f !== null && f !== "" ? m = f : y !== null && y !== "" ? m = y : p !== null && p !== "" && p !== "true" && !ce.test(p) ? m = p : m = i.textContent.trim();
    const _ = Y(m) || Mt(m);
    if (_ && !isNaN(_.getTime())) {
      const g = Tt(_);
      this._rawValue = g, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", g), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const i = Y(this._rawValue);
      if (i) {
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const _ = this.dom.getAttribute("data-ln-date");
          _ && ce.test(_) && (p = _);
        }
        const y = W(this.dom), m = _t(y);
        this.dom.textContent = Ft(i, p || "medium", y, m);
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
  }, c.prototype._setHiddenRaw = function(i) {
    d.set.call(this._hidden, i);
  }, c.prototype._displayFormatted = function(i) {
    const f = this.dom.getAttribute(t) || "", p = W(this.dom), y = _t(p);
    this._isFormatting = !0, this.dom.value = Ft(i, f, p, y), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : d.get.call(this._hidden);
    },
    set: function(i) {
      if (this.isTextElement) {
        if (!i || i === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const p = Y(i) || Mt(i);
        if (!p) return;
        const y = Tt(p);
        this._rawValue = y, this.dom.setAttribute("data-ln-value", y), this._formatTextContent();
        return;
      }
      if (!i || i === "") {
        u(this);
        return;
      }
      const f = Y(i);
      f && l(this, i, f);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? Y(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      this.value = Tt(i);
    }
  }), Object.defineProperty(c.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", i && (this.dom.value = i), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, F(t, e, c, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(i) {
      const f = i[e];
      if (f) {
        if (f.isTextElement)
          f._initTextElement();
        else if (f.value) {
          const p = Y(f.value);
          p && f._displayFormatted(p);
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const u = history.pushState;
    history.pushState = function() {
      u.apply(history, arguments);
      for (const i of history._lnNavCallbacks)
        i();
    };
    const c = history.replaceState;
    history.replaceState = function() {
      c.apply(history, arguments);
      for (const i of history._lnNavCallbacks)
        i();
    }, history._lnNavPatched = !0;
  }
  function d(u) {
    return this.dom = u, this.activeClass = u.getAttribute(t) || "active", this.exact = u.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(u, { childList: !0, subtree: !0 }), this.update(), this;
  }
  d.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), i = window.location.pathname, f = h(i), p = [];
    for (const y of c) {
      const m = y.getAttribute("href");
      if (!m || m === "#" || m.startsWith("#") || m.startsWith("javascript:") || m.startsWith("mailto:") || m.startsWith("tel:")) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      if (y.hostname && y.hostname !== window.location.hostname) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      const _ = h(m), g = _ === f, r = !this.exact && _ !== "/" && f.startsWith(_ + "/");
      g || r ? (y.classList.add(this.activeClass), y.setAttribute("aria-current", "page"), p.push(y)) : (y.classList.remove(this.activeClass), y.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom, activeLinks: p });
  }, d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const u = history._lnNavCallbacks.indexOf(this.updateHandler);
    u !== -1 && history._lnNavCallbacks.splice(u, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function h(u) {
    try {
      return new URL(u, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return u.replace(/\/$/, "") || "/";
    }
  }
  function l(u, c) {
    const i = u[e];
    if (i) {
      if (c === t) {
        if (!u.hasAttribute(t)) {
          i.destroy();
          return;
        }
        const f = i.activeClass, p = u.getAttribute(t) || "active";
        if (f !== p) {
          const y = u.querySelectorAll("a");
          for (const m of y)
            f && m.classList.remove(f);
          i.activeClass = p;
        }
      } else c === "data-ln-nav-exact" && (i.exact = u.hasAttribute("data-ln-nav-exact"));
      i.update();
    }
  }
  F(t, e, d, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: l
  });
})();
function Re(t, e, d, h) {
  const l = (t || "").toLowerCase().trim();
  if (l) return l;
  if ((e || "").toUpperCase() !== "A") return "";
  const u = d || "";
  if (!u.startsWith("#")) return "";
  const c = u.slice(1);
  if (!c) return "";
  const i = c.split("&"), f = (h || "").toLowerCase().trim();
  if (f)
    for (const m of i) {
      const _ = m.indexOf(":");
      if (_ > 0 && m.slice(0, _).toLowerCase().trim() === f)
        return m.slice(_ + 1).toLowerCase().trim();
    }
  const p = i[i.length - 1] || "", y = p.indexOf(":");
  return (y > 0 ? p.slice(y + 1) : p).toLowerCase().trim();
}
function wi(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const d = t.filter(
    (u) => (u.tagName || "").toUpperCase() === "A" && (u.href || "").startsWith("#")
  ), h = d.length > 0 && d.length === t.length, l = (e || "").toLowerCase().trim();
  return d.length > 0 && d.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : h && !l ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: h && !!l,
    warning: null
  };
}
function Ei(t, e, d) {
  const h = (t || "").toLowerCase().trim();
  return h && Array.isArray(e) && e.includes(h) ? h : (d || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function d(l) {
    return this.dom = l, this.activeKey = null, h.call(this), this;
  }
  function h() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const l = this.tabs.map((i) => ({
      tagName: i.tagName,
      href: i.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const u = wi(l, this.nsKey);
    this.hashEnabled = u.hashEnabled, u.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : u.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const f = Re(i.getAttribute("data-ln-tab"), i.tagName, i.getAttribute("href"), this.nsKey);
      f ? this.mapTabs[f] = i : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', i);
    }
    for (const i of this.panels) {
      const f = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      f && (this.mapPanels[f] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const c = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[e + "Trigger"]) continue;
      const f = function(p) {
        const y = i.tagName === "A";
        if (!y && (p.ctrlKey || p.metaKey || p.button === 1)) return;
        const m = Re(i.getAttribute("data-ln-tab"), i.tagName, i.getAttribute("href"), c.nsKey);
        m && (y && !ge(p) || (c.hashEnabled ? X(c.nsKey) === m ? c.dom.setAttribute("data-ln-tabs-active", m) : et(c.nsKey, m) : c.dom.setAttribute("data-ln-tabs-active", m)));
      };
      i.addEventListener("click", f), i[e + "Trigger"] = f, c._clickHandlers.push({ el: i, handler: f });
    }
    if (this._onRequestSelect = function(i) {
      const f = i.detail && (i.detail.key || i.detail.tab);
      f && c.select(f);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!c.hashEnabled) return;
      const i = X(c.nsKey);
      c.dom.setAttribute("data-ln-tabs-active", i !== null ? i : c.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let i = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const f = $t("tabs", this.dom);
        f !== null && f in this.mapPanels && (i = f);
      }
      this.dom.setAttribute("data-ln-tabs-active", i);
    }
  }
  d.prototype.select = function(l) {
    const u = (l + "").toLowerCase().trim();
    u && (this.hashEnabled ? X(this.nsKey) === u ? this.dom.setAttribute("data-ln-tabs-active", u) : et(this.nsKey, u) : this.dom.setAttribute("data-ln-tabs-active", u));
  }, d.prototype._applyActive = function(l) {
    var c;
    if (l = Ei(l, Object.keys(this.mapPanels), this.defaultKey), l === this.activeKey) return;
    const u = this.activeKey;
    if (u !== null && G(this.dom, "ln-tabs:before-change", {
      key: l,
      previousKey: u,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }).defaultPrevented) {
      u in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", u), this.hashEnabled && X(this.nsKey) !== u && et(this.nsKey, u));
      return;
    }
    this.activeKey = l;
    for (const i in this.mapTabs) {
      const f = this.mapTabs[i];
      i === l ? (f.setAttribute("data-active", ""), f.setAttribute("aria-selected", "true")) : (f.removeAttribute("data-active"), f.setAttribute("aria-selected", "false"));
    }
    for (const i in this.mapPanels) {
      const f = this.mapPanels[i], p = i === l;
      f.classList.toggle("hidden", !p), f.setAttribute("aria-hidden", p ? "false" : "true");
    }
    if (this.autoFocus) {
      const i = (c = this.mapPanels[l]) == null ? void 0 : c.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      i && setTimeout(() => i.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", {
      key: l,
      previousKey: u,
      tab: this.mapTabs[l],
      panel: this.mapPanels[l],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && bt("tabs", this.dom, l);
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: l, handler: u } of this._clickHandlers)
        l.removeEventListener("click", u), delete l[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, F(t, e, d, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(l) {
      const u = l.getAttribute("data-ln-tabs-active");
      l[e]._applyActive(u);
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", d = "data-ln-toggle-for", h = "data-ln-toggle-action", l = "data-ln-persist";
  if (window[e] !== void 0) return;
  const u = /* @__PURE__ */ new Set();
  let c = null;
  function i(g, r) {
    return r === "open" ? "open" : r === "close" || g === "open" ? "close" : "open";
  }
  function f() {
    c || (c = function(g) {
      if (ze(g)) return;
      const r = g.target.closest("[" + d + "]");
      if (!r || Ke(r)) return;
      const a = r.getAttribute(d);
      if (!a) return;
      const n = document.getElementById(a);
      if (!n || !n[e]) return;
      g.preventDefault();
      const o = r.getAttribute(h) || "toggle", s = n.getAttribute(t);
      n.setAttribute(t, i(s, o));
    }, document.addEventListener("click", c));
  }
  function p() {
    u.size > 0 || !c || (document.removeEventListener("click", c), c = null);
  }
  function y(g, r) {
    if (!g || !g.id) return;
    const a = document.querySelectorAll(
      "[" + d + '="' + g.id + '"]'
    );
    for (let n = 0; n < a.length; n++)
      a[n].setAttribute("aria-expanded", r ? "true" : "false");
  }
  function m(g) {
    this.dom = g;
    const r = this;
    if (this._onRequestOpen = function() {
      r.open();
    }, this._onRequestClose = function() {
      r.close();
    }, this._onRequestToggle = function() {
      r.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.hasAttribute(l)) {
      const a = $t("toggle", g);
      a !== null && g.setAttribute(t, a === "open" ? "open" : "close");
    }
    return this.isOpen = g.getAttribute(t) === "open", this.isOpen && g.classList.add("open"), y(g, this.isOpen), u.add(this), f(), this;
  }
  m.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, m.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, m.prototype.toggle = function() {
    const g = this.dom.getAttribute(t);
    this.dom.setAttribute(t, i(g, "toggle"));
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), u.delete(this), delete this.dom[e], p(), S(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function _(g) {
    const r = g[e];
    if (!r) return;
    const n = g.getAttribute(t) === "open";
    if (n !== r.isOpen)
      if (n) {
        if (G(g, "ln-toggle:before-open", { target: g }).defaultPrevented) {
          g.setAttribute(t, "close");
          return;
        }
        r.isOpen = !0, g.classList.add("open"), y(g, !0), S(g, "ln-toggle:open", { target: g }), g.hasAttribute(l) && bt("toggle", g, "open");
      } else {
        if (G(g, "ln-toggle:before-close", { target: g }).defaultPrevented) {
          g.setAttribute(t, "open");
          return;
        }
        r.isOpen = !1, g.classList.remove("open"), y(g, !1), S(g, "ln-toggle:close", { target: g }), g.hasAttribute(l) && bt("toggle", g, "close");
      }
  }
  F(t, e, m, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  function d(h) {
    return this.dom = h, this._onToggleOpen = function(l) {
      if (l.detail.target.closest("[data-ln-accordion]") !== h) return;
      const u = h.querySelectorAll("[data-ln-toggle]");
      for (const c of u)
        c !== l.detail.target && c.closest("[data-ln-accordion]") === h && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      S(h, "ln-accordion:change", { target: l.detail.target });
    }, h.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, F(t, e, d, "ln-accordion");
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", d = "data-ln-dropdown-position", h = "data-ln-dropdown-placement", l = "bottom-end";
  if (window[e] !== void 0) return;
  function u(c) {
    this.dom = c, this.toggleEl = c.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = c.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const i = this;
    return this._onRequestOpen = function() {
      i.toggleEl && i.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      i.toggleEl && i.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (i.toggleEl) {
        const f = i.toggleEl.getAttribute("data-ln-toggle");
        i.toggleEl.setAttribute("data-ln-toggle", f === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(f) {
      const p = i.toggleEl && i.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (f.key === "Escape") {
        p && (f.preventDefault(), f.stopPropagation(), i.toggleEl.setAttribute("data-ln-toggle", "close"), i.triggerBtn && i.triggerBtn.focus());
        return;
      }
      if (f.key === "Tab") {
        p && (i.triggerBtn && i.triggerBtn.focus(), i.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const y = i._getMenuItems();
      if (y.length === 0) return;
      if (!p && (f.key === "ArrowDown" || f.key === "ArrowUp")) {
        f.preventDefault(), i.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const _ = i._getMenuItems();
          _.length > 0 && i._focusItem(_, f.key === "ArrowDown" ? 0 : _.length - 1);
        }, 0);
        return;
      }
      if (!p) return;
      const m = y.indexOf(document.activeElement);
      if (f.key === "ArrowDown") {
        f.preventDefault();
        const _ = m < y.length - 1 ? m + 1 : 0;
        i._focusItem(y, _);
      } else if (f.key === "ArrowUp") {
        f.preventDefault();
        const _ = m > 0 ? m - 1 : y.length - 1;
        i._focusItem(y, _);
      } else f.key === "Home" ? (f.preventDefault(), i._focusItem(y, 0)) : f.key === "End" && (f.preventDefault(), i._focusItem(y, y.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(f) {
      !f.detail || f.detail.target !== i.toggleEl || (i.triggerBtn && i.triggerBtn.setAttribute("aria-expanded", "true"), typeof i.toggleEl.showPopover == "function" && i.toggleEl.showPopover(), i._initMenuAria(), i._reposition(), i._addOutsideClickListener(), i._addScrollRepositionListener(), i._addResizeCloseListener(), S(c, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      !f.detail || f.detail.target !== i.toggleEl || (i.triggerBtn && i.triggerBtn.setAttribute("aria-expanded", "false"), i._removeOutsideClickListener(), i._removeScrollRepositionListener(), i._removeResizeCloseListener(), i.toggleEl.style.top = "", i.toggleEl.style.left = "", i.toggleEl.removeAttribute(h), typeof i.toggleEl.hidePopover == "function" && i.toggleEl.matches(":popover-open") && i.toggleEl.hidePopover(), S(c, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  u.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const c = this.toggleEl.querySelectorAll("li");
    for (const f of c)
      f.setAttribute("role", "none");
    const i = this._getMenuItems();
    for (let f = 0; f < i.length; f++)
      i[f].setAttribute("role", "menuitem"), i[f].setAttribute("tabindex", f === 0 ? "0" : "-1");
  }, u.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, u.prototype._focusItem = function(c, i) {
    for (let f = 0; f < c.length; f++)
      c[f].setAttribute("tabindex", f === i ? "0" : "-1");
    c[i] && c[i].focus();
  }, u.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const c = this.triggerBtn.getBoundingClientRect(), i = oe(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, p = this.dom.getAttribute(d) || l, y = zt(c, i, p, f);
    this.toggleEl.style.top = y.top + "px", this.toggleEl.style.left = y.left + "px", this.toggleEl.setAttribute(h, y.placement);
  }, u.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const c = this;
    this._boundDocClick = function(i) {
      c.dom.contains(i.target) || c.toggleEl && c.toggleEl.contains(i.target) || c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, c._docClickTimeout = setTimeout(function() {
      c._docClickTimeout = null, document.addEventListener("click", c._boundDocClick);
    }, 0);
  }, u.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, u.prototype._addScrollRepositionListener = function() {
    const c = this;
    this._boundScrollReposition = function() {
      c._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, u.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, u.prototype._addResizeCloseListener = function() {
    const c = this;
    this._boundResizeClose = function() {
      c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open" && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, u.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(h), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, F(t, e, u, "ln-dropdown");
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", d = "data-ln-popover-for", h = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const l = [];
  let u = null;
  function c() {
    u || (u = function(y) {
      if (y.key !== "Escape" || l.length === 0) return;
      l[l.length - 1].close();
    }, document.addEventListener("keydown", u));
  }
  function i() {
    l.length > 0 || u && (document.removeEventListener("keydown", u), u = null);
  }
  function f(y) {
    this.dom = y, this.isOpen = y.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const m = this;
    return this._onRequestOpen = function(_) {
      const g = _.detail && _.detail.trigger ? _.detail.trigger : null;
      m.open(g);
    }, this._onRequestClose = function() {
      m.close();
    }, this._onRequestToggle = function(_) {
      const g = _.detail && _.detail.trigger ? _.detail.trigger : null;
      m.toggle(g);
    }, y.addEventListener("ln-popover:request-open", this._onRequestOpen), y.addEventListener("ln-popover:request-close", this._onRequestClose), y.addEventListener("ln-popover:request-toggle", this._onRequestToggle), y.hasAttribute("tabindex") || y.setAttribute("tabindex", "-1"), y.hasAttribute("role") || y.setAttribute("role", "dialog"), y.hasAttribute("popover") || y.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  f.prototype.open = function(y) {
    this.isOpen || (this.trigger = y || null, this.dom.setAttribute(t, "open"));
  }, f.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, f.prototype.toggle = function(y) {
    this.isOpen ? this.close() : this.open(y);
  }, f.prototype._applyOpen = function(y) {
    this.isOpen = !0, y && (this.trigger = y), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const m = oe(this.dom);
    if (this.trigger) {
      const a = this.trigger.getBoundingClientRect(), n = this.dom.getAttribute(h) || "bottom", o = zt(a, m, n, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const _ = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), g = Array.prototype.find.call(_, kt);
    g ? g.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(a) {
      r.dom.contains(a.target) || r.trigger && r.trigger.contains(a.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const a = r.trigger.getBoundingClientRect(), n = oe(r.dom), o = r.dom.getAttribute(h) || "bottom", s = zt(a, n, o, 8);
      r.dom.style.top = s.top + "px", r.dom.style.left = s.left + "px", r.dom.setAttribute("data-ln-popover-placement", s.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), l.push(this), c(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, f.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const y = l.indexOf(this);
    y !== -1 && l.splice(y, 1), i(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function p(y) {
    this.dom = y;
    const m = y.getAttribute(d);
    return y.setAttribute("aria-haspopup", "dialog"), y.setAttribute("aria-expanded", "false"), y.setAttribute("aria-controls", m), this._onClick = function(_) {
      if (_.ctrlKey || _.metaKey || _.button === 1) return;
      _.preventDefault();
      const g = document.getElementById(m);
      if (!g) return;
      g[e] && (g[e].trigger = y);
      const r = g.getAttribute(t);
      g.setAttribute(t, r === "open" ? "closed" : "open");
    }, y.addEventListener("click", this._onClick), this;
  }
  p.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  }, F(t, e, f, "ln-popover", {
    onAttributeChange: function(y) {
      const m = y[e];
      if (!m) return;
      const g = y.getAttribute(t) === "open";
      if (g !== m.isOpen)
        if (g) {
          if (G(y, "ln-popover:before-open", {
            popoverId: y.id,
            target: y,
            trigger: m.trigger
          }).defaultPrevented) {
            y.setAttribute(t, "closed");
            return;
          }
          m._applyOpen(m.trigger);
        } else {
          if (G(y, "ln-popover:before-close", {
            popoverId: y.id,
            target: y,
            trigger: m.trigger
          }).defaultPrevented) {
            y.setAttribute(t, "open");
            return;
          }
          m._applyClose();
        }
    }
  }), F(d, e + "Trigger", p, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", d = "data-ln-tooltip-position", h = "lnTooltipEnhance", l = "ln-tooltip-portal";
  if (window[h] !== void 0) return;
  let u = 0, c = null, i = null, f = null, p = null, y = null, m = null;
  function _() {
    return c && c.parentNode || (c = document.getElementById(l), c || (c = document.createElement("div"), c.id = l, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function g() {
    m || (m = function(s) {
      s.key === "Escape" && n();
    }, document.addEventListener("keydown", m));
  }
  function r() {
    m && (document.removeEventListener("keydown", m), m = null);
  }
  function a(s) {
    if (f === s) return;
    n();
    const b = s.getAttribute(e) || s.getAttribute("title");
    if (!b) return;
    _(), typeof c.showPopover == "function" && c.showPopover(), s.hasAttribute("title") && (p = s.getAttribute("title"), s.removeAttribute("title"));
    const v = s.getAttribute("aria-describedby");
    v ? y = v : y = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = b, s[h + "Uid"] || (u += 1, s[h + "Uid"] = "ln-tooltip-" + u), w.id = s[h + "Uid"], c.appendChild(w);
    const A = w.offsetWidth, C = w.offsetHeight, L = s.getBoundingClientRect(), q = s.getAttribute(d) || "top", x = zt(L, { width: A, height: C }, q, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), y ? s.setAttribute("aria-describedby", y + " " + w.id) : s.setAttribute("aria-describedby", w.id), i = w, f = s, g();
  }
  function n() {
    if (!i) {
      r();
      return;
    }
    f && (y !== null ? f.setAttribute("aria-describedby", y) : f.removeAttribute("aria-describedby"), y = null, p !== null && f.setAttribute("title", p)), p = null, i.parentNode && i.parentNode.removeChild(i), i = null, f = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), r();
  }
  function o(s) {
    return this.dom = s, s.hasAttribute("data-ln-tooltip-enhanced") || (s.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      a(s);
    }, this._onLeave = function() {
      f === s && !s.contains(document.activeElement) && n();
    }, this._onFocus = function() {
      a(s);
    }, this._onBlur = function() {
      f === s && !s.matches(":hover") && n();
    }, s.addEventListener("mouseenter", this._onEnter), s.addEventListener("mouseleave", this._onLeave), s.addEventListener("focus", this._onFocus, !0), s.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const s = this.dom;
    s.removeEventListener("mouseenter", this._onEnter), s.removeEventListener("mouseleave", this._onLeave), s.removeEventListener("focus", this._onFocus, !0), s.removeEventListener("blur", this._onBlur, !0), f === s && n(), this._addedEnhancedAttr && s.removeAttribute("data-ln-tooltip-enhanced"), delete s[h], delete s[h + "Uid"], S(s, "ln-tooltip:destroyed", { trigger: s });
  }, F(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    h,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", d = "ln-toast-item";
  if (window[e] !== void 0) return;
  function h(r) {
    if (!(!r || !(r instanceof HTMLElement)) && (r.hasAttribute("popover") || r.setAttribute("popover", "manual"), typeof r.showPopover == "function")) {
      if (r.matches(":popover-open"))
        try {
          r.hidePopover();
        } catch {
        }
      try {
        r.showPopover();
      } catch {
      }
    }
  }
  function l(r) {
    if (!r || !(r instanceof HTMLElement)) return;
    if (r.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof r.hidePopover == "function" && r.matches(":popover-open"))
      try {
        r.hidePopover();
      } catch {
      }
  }
  function u(r) {
    this.dom = r, this.timeoutDefault = +(r.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(r.getAttribute("data-ln-toast-max") ?? 5);
    const a = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length > this.max; ) r.removeChild(a.shift());
    for (const n of a) m(n, this);
    return a.length > 0 && h(r), this;
  }
  u.prototype.enqueue = function(r) {
    if (!r) return;
    const a = c(r, this.dom);
    if (!a) return;
    const n = Number.isFinite(r.timeout) ? r.timeout : this.timeoutDefault;
    f(this, a), n > 0 && (a._timer = setTimeout(() => p(a), n));
  }, u.prototype.clear = function() {
    for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      p(r);
  }, u.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        p(r);
      l(this.dom), S(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function c(r, a) {
    const n = ((r.type || "") + "").trim().toLowerCase(), o = pt(a, d, "ln-toast");
    if (!o)
      return console.warn('[ln-toast] Template "' + d + '" not found'), null;
    ot(o, {
      type: n,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const s = o.firstElementChild;
    if (!s) return null;
    s.hasAttribute("data-ln-toast-item") || s.setAttribute("data-ln-toast-item", ""), s.classList.add("ln-enter");
    const b = s.querySelector(".body");
    b && i(b, r);
    const v = s.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      p(s);
    }), s;
  }
  function i(r, a) {
    if (Array.isArray(a.message)) {
      const n = document.createElement("ul");
      for (const o of a.message) {
        const s = document.createElement("li");
        s.textContent = o, n.appendChild(s);
      }
      r.appendChild(n);
    }
    if (a.data && a.data.errors) {
      const n = document.createElement("ul");
      for (const o of Object.values(a.data.errors).flat()) {
        const s = document.createElement("li");
        s.textContent = o, n.appendChild(s);
      }
      r.appendChild(n);
    }
  }
  function f(r, a) {
    const n = Array.from(r.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; n.length >= r.max && n.length > 0; ) r.dom.removeChild(n.shift());
    r.dom.appendChild(a), h(r.dom), requestAnimationFrame(() => a.classList.remove("ln-enter"));
  }
  function p(r) {
    if (!r || !r.parentNode) return;
    const a = r.parentNode;
    clearTimeout(r._timer), r.classList.remove("ln-enter"), r.classList.add("ln-out"), setTimeout(() => {
      r.parentNode && (r.parentNode.removeChild(r), l(a));
    }, 200);
  }
  function y(r) {
    let a = r && r.container;
    return typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), a || null;
  }
  function m(r, a) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const n = r.querySelector("[data-ln-toast-close]");
    n && n.addEventListener("click", function() {
      p(r);
    });
    const o = +(r.getAttribute("data-ln-toast-timeout") ?? a.timeoutDefault);
    o > 0 && (r._timer = setTimeout(function() {
      p(r);
    }, o));
  }
  function _(r) {
    const a = r.detail || {}, n = y(a);
    if (!n) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (n[e] || (n[e] = new u(n))).enqueue(a);
  }
  function g(r) {
    const a = r && r.detail || {};
    if (a.container) {
      const n = y(a);
      n && (n[e] || (n[e] = new u(n))).clear();
    } else {
      const n = document.querySelectorAll("[" + t + "]");
      for (const o of Array.from(n))
        (o[e] || (o[e] = new u(o))).clear();
    }
  }
  at(function() {
    window.addEventListener("ln-toast:enqueue", _), window.addEventListener("ln-toast:clear", g), window.addEventListener("ln-modal:open", function() {
      const r = document.querySelectorAll("[" + t + "]");
      for (const a of Array.from(r))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && h(a);
    });
  }, "ln-toast"), F(t, e, u, "ln-toast");
})();
function Ai(t) {
  if (!t) return null;
  const e = String(t).split(",").map((d) => d.trim().toLowerCase()).filter(Boolean).map((d) => d.startsWith(".") ? d.slice(1) : d);
  return e.length ? e : null;
}
function wn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Si(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const d = wn(t.name), h = String(t.type || "").toLowerCase();
  return e.some((l) => {
    if (l.includes("/")) {
      if (l.endsWith("/*")) {
        const u = l.slice(0, -1);
        return h.startsWith(u);
      }
      return h === l;
    }
    return d === l;
  });
}
function Ci(t, e = "en", d = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (d["unit-b"] || "B");
  const h = 1024, l = [
    d["unit-b"] || "B",
    d["unit-kb"] || "KB",
    d["unit-mb"] || "MB",
    d["unit-gb"] || "GB"
  ], u = Math.floor(Math.log(t) / Math.log(h)), c = Math.min(u, l.length - 1), i = t / Math.pow(h, c);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(i) + " " + l[c];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", d = "data-ln-upload-dict", h = "data-ln-upload-accept", l = "data-ln-upload-delete", u = "data-ln-upload-max-size", c = "data-ln-upload-max-files", i = "data-ln-upload-file-field", f = "data-ln-upload-ids-field", p = "file", y = "file_ids[]";
  if (window[e] !== void 0) return;
  function m(r, a, n) {
    return Ci(r, a, n);
  }
  function _() {
    const r = document.querySelector('meta[name="csrf-token"]');
    return r ? r.getAttribute("content") : "";
  }
  function g(r) {
    this.dom = r, this.dict = Wt(r, d), this.locale = W(r), this.zone = r.querySelector("[data-ln-upload-zone]") || r, this.list = r.querySelector("[data-ln-upload-list]"), this.input = r.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', r), this.uploadUrl = r.getAttribute(t) || "", this.deleteUrlPattern = r.getAttribute(l) || "", this.fileFieldName = r.getAttribute(i) || p, this.idsFieldName = r.getAttribute(f) || y, this.maxSize = +r.getAttribute(u) || 0, this.maxFiles = +r.getAttribute(c) || 0;
    const a = r.getAttribute(h) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Ai(a), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  g.prototype._hydrate = function() {
    const r = this;
    if (!this.list) return;
    const a = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let o = 0; o < a.length; o++) {
      const s = a[o], b = s.getAttribute("data-ln-upload-id"), v = "file-" + ++r.fileIdCounter;
      s.setAttribute("data-ln-upload-local-id", v);
      const w = s.querySelector('[data-ln-field="name"]'), A = s.querySelector('[data-ln-field="sizeText"]'), C = s.getAttribute("data-ln-upload-size"), L = C ? parseInt(C, 10) : null;
      r.uploadedFiles.set(v, {
        serverId: b || null,
        name: w ? w.textContent.trim() : "",
        size: L !== null && !isNaN(L) ? L : A ? A.textContent.trim() : ""
      });
    }
    const n = this.dom.querySelectorAll('input[type="hidden"]');
    for (let o = 0; o < n.length; o++) {
      const s = n[o];
      if (s.name === r.idsFieldName && s.value && !Array.from(r.uploadedFiles.values()).some(function(v) {
        return String(v.serverId) === String(s.value);
      })) {
        const v = "file-" + ++r.fileIdCounter;
        r.uploadedFiles.set(v, {
          serverId: s.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, g.prototype._syncHiddenInputs = function() {
    const r = this, a = this.dom.querySelectorAll('input[type="hidden"]');
    for (let n = 0; n < a.length; n++)
      a[n].name === r.idsFieldName && a[n].remove();
    for (const [, n] of this.uploadedFiles)
      if (n.serverId) {
        const o = document.createElement("input");
        o.type = "hidden", o.name = r.idsFieldName, o.value = n.serverId, r.dom.appendChild(o);
      }
  }, g.prototype._bindEvents = function() {
    const r = this;
    this._onZoneClick = function(a) {
      r.zone === r.dom && a.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || r.input && a.target !== r.input && r.input.click();
    }, this._onInputChange = function() {
      r.input && r.input.files && (r.upload(r.input.files), r.input.value = "");
    }, this._onDragEnter = function(a) {
      a.preventDefault(), a.stopPropagation(), r._dragDepth++, r.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(a) {
      a.preventDefault(), a.stopPropagation(), r.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(a) {
      a.preventDefault(), a.stopPropagation(), r._dragDepth--, r._dragDepth <= 0 && (r._dragDepth = 0, r.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(a) {
      a.preventDefault(), a.stopPropagation(), r._dragDepth = 0, r.zone.removeAttribute("data-ln-upload-state"), a.dataTransfer && a.dataTransfer.files && r.upload(a.dataTransfer.files);
    }, this._onListClick = function(a) {
      const n = a.target.closest('[data-ln-upload-action="remove"]');
      if (!n || !r.list || !r.list.contains(n) || n.disabled) return;
      const o = n.closest("[data-ln-upload-item]");
      if (o) {
        const s = o.getAttribute("data-ln-upload-local-id");
        s && r.remove(s);
      }
    }, this._onRequestUpload = function(a) {
      a.detail && a.detail.files && r.upload(a.detail.files);
    }, this._onRequestRemove = function(a) {
      if (a.detail) {
        const n = a.detail.localId !== void 0 ? a.detail.localId : a.detail.serverId;
        n !== void 0 && r.remove(n);
      }
    }, this._onRequestClear = function() {
      r.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, g.prototype.upload = function(r) {
    const a = this, n = Array.from(r);
    for (let o = 0; o < n.length; o++) {
      const s = n[o];
      if (a.maxFiles > 0 && a.uploadedFiles.size >= a.maxFiles) {
        S(a.dom, "ln-upload:invalid", {
          file: s,
          reason: "max-files"
        });
        continue;
      }
      if (!Si(s, a.allowedExts)) {
        S(a.dom, "ln-upload:invalid", {
          file: s,
          reason: "accept"
        });
        continue;
      }
      if (a.maxSize > 0 && s.size > a.maxSize) {
        S(a.dom, "ln-upload:invalid", {
          file: s,
          reason: "max-size"
        });
        continue;
      }
      G(a.dom, "ln-upload:before-upload", { file: s }).defaultPrevented || a._uploadSingleFile(s);
    }
  }, g.prototype._uploadSingleFile = function(r) {
    const a = this, n = "file-" + ++a.fileIdCounter, o = wn(r.name);
    let s = null;
    if (this.list) {
      const C = pt(this.dom, "ln-upload-item", "ln-upload");
      if (C && (s = C.firstElementChild, s)) {
        s.setAttribute("data-ln-upload-item", ""), s.setAttribute("data-ln-upload-local-id", n), s.setAttribute("data-ln-upload-ext", o), s.setAttribute("data-ln-upload-state", "uploading"), ot(s, {
          name: r.name,
          sizeText: "0%",
          removeLabel: a.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const L = s.querySelector('[data-ln-upload-action="remove"]');
        L && (L.disabled = !0);
        const q = s.querySelector("[data-ln-progress]");
        q && q.setAttribute("data-ln-progress", "0"), a.list.appendChild(s);
      }
    }
    const b = new FormData();
    b.append(a.fileFieldName, r);
    const v = this.dom.querySelectorAll("input, select, textarea");
    for (let C = 0; C < v.length; C++) {
      const L = v[C];
      !L.name || L.name === a.idsFieldName || L.type === "file" || (L.type === "checkbox" || L.type === "radio") && !L.checked || b.append(L.name, L.value);
    }
    const w = new XMLHttpRequest();
    a.uploadedFiles.set(n, {
      serverId: null,
      name: r.name,
      size: r.size,
      xhr: w
    }), w.upload.addEventListener("progress", function(C) {
      if (C.lengthComputable) {
        const L = Math.round(C.loaded / C.total * 100);
        if (s) {
          const q = s.querySelector("[data-ln-progress]");
          q && q.setAttribute("data-ln-progress", String(L)), ot(s, { sizeText: L + "%" });
        }
        S(a.dom, "ln-upload:progress", {
          localId: n,
          file: r,
          percent: L,
          loaded: C.loaded,
          total: C.total
        });
      }
    }), w.addEventListener("load", function() {
      const C = a.uploadedFiles.get(n);
      if (C && delete C.xhr, w.status >= 200 && w.status < 300) {
        let L;
        try {
          L = JSON.parse(w.responseText);
        } catch (x) {
          A(a.dict.error || "Error", w.status, x);
          return;
        }
        const q = L.id || L.serverId;
        if (s) {
          s.removeAttribute("data-ln-upload-state"), q && s.setAttribute("data-ln-upload-id", String(q)), ot(s, {
            sizeText: m(L.size || r.size, a.locale, a.dict),
            uploading: !1
          });
          const x = s.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        C && (C.serverId = q, C.size = L.size || r.size, C.name = L.name || r.name), a._syncHiddenInputs(), S(a.dom, "ln-upload:uploaded", {
          localId: n,
          serverId: q,
          name: L.name || r.name,
          size: L.size || r.size,
          response: L
        });
      } else {
        let L = "";
        try {
          L = JSON.parse(w.responseText).message || "";
        } catch {
        }
        A(L, w.status, null);
      }
    }), w.addEventListener("error", function() {
      const C = a.uploadedFiles.get(n);
      C && delete C.xhr, A("", 0, null);
    });
    function A(C, L, q) {
      if (s) {
        s.setAttribute("data-ln-upload-state", "error"), ot(s, {
          sizeText: a.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = s.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      S(a.dom, "ln-upload:error", {
        file: r,
        message: C,
        status: L,
        error: q
      });
    }
    a.uploadUrl ? (w.open("POST", a.uploadUrl), w.setRequestHeader("X-CSRF-TOKEN", _()), w.setRequestHeader("X-Requested-With", "XMLHttpRequest"), w.setRequestHeader("Accept", "application/json"), w.send(b)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, g.prototype.remove = function(r) {
    const a = this;
    let n = null, o = null;
    if (a.uploadedFiles.has(r))
      n = r, o = a.uploadedFiles.get(r);
    else
      for (const [w, A] of a.uploadedFiles)
        if (String(A.serverId) === String(r)) {
          n = w, o = A;
          break;
        }
    if (!n || !o || G(a.dom, "ln-upload:before-remove", {
      localId: n,
      serverId: o.serverId
    }).defaultPrevented) return;
    const b = a.list ? a.list.querySelector('[data-ln-upload-local-id="' + n + '"]') : null;
    if (o.xhr && typeof o.xhr.abort == "function" && o.xhr.abort(), !o.serverId) {
      b && b.remove(), a.uploadedFiles.delete(n), a._syncHiddenInputs(), S(a.dom, "ln-upload:removed", { localId: n, serverId: null });
      return;
    }
    let v = null;
    if (a.deleteUrlPattern ? v = a.deleteUrlPattern.replace("{id}", encodeURIComponent(o.serverId)) : a.uploadUrl && a.uploadUrl.includes("{id}") && (v = a.uploadUrl.replace("{id}", encodeURIComponent(o.serverId))), !v) {
      b && b.remove(), a.uploadedFiles.delete(n), a._syncHiddenInputs(), S(a.dom, "ln-upload:removed", { localId: n, serverId: o.serverId });
      return;
    }
    b && (b.setAttribute("data-ln-upload-state", "deleting"), ot(b, { deleting: !0 })), fetch(v, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": _(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(w) {
      w.ok ? (b && b.remove(), a.uploadedFiles.delete(n), a._syncHiddenInputs(), S(a.dom, "ln-upload:removed", {
        localId: n,
        serverId: o.serverId
      })) : (b && (b.removeAttribute("data-ln-upload-state"), ot(b, { deleting: !1 })), S(a.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: w.status
      }));
    }).catch(function(w) {
      b && (b.removeAttribute("data-ln-upload-state"), ot(b, { deleting: !1 })), S(a.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: 0,
        error: w
      });
    });
  }, g.prototype.clear = function() {
    const r = this;
    if (!G(r.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, n] of this.uploadedFiles)
        if (n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort(), n.serverId) {
          let o = null;
          r.deleteUrlPattern ? o = r.deleteUrlPattern.replace("{id}", encodeURIComponent(n.serverId)) : r.uploadUrl && r.uploadUrl.includes("{id}") && (o = r.uploadUrl.replace("{id}", encodeURIComponent(n.serverId))), o && fetch(o, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": _(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      r.uploadedFiles.clear(), r.list && (r.list.innerHTML = ""), r._syncHiddenInputs(), S(r.dom, "ln-upload:cleared", {});
    }
  }, g.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(r) {
      return r.serverId;
    }).filter(Boolean);
  }, g.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(r) {
      return {
        serverId: r.serverId,
        name: r.name,
        size: r.size
      };
    });
  }, g.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, r] of this.uploadedFiles)
        r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, S(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, F(t, e, g, "ln-upload");
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(i) {
    return i.hostname && i.hostname !== window.location.hostname;
  }
  function d(i) {
    if (i.getAttribute("data-ln-external-link") === "processed" || !e(i)) return;
    i.target = "_blank";
    const f = (i.rel || "").split(/\s+/).filter(Boolean);
    f.includes("noopener") || f.push("noopener"), f.includes("noreferrer") || f.push("noreferrer"), i.rel = f.join(" ");
    const p = document.createElement("span");
    p.className = "sr-only", p.textContent = "(opens in new tab)", i.appendChild(p), i.setAttribute("data-ln-external-link", "processed"), S(i, "ln-external-links:processed", {
      link: i,
      href: i.href
    });
  }
  function h(i) {
    i = i || document.body;
    for (const f of i.querySelectorAll("a, area"))
      d(f);
  }
  function l() {
    at(function() {
      document.body.addEventListener("click", function(i) {
        const f = i.target.closest("a, area");
        f && f.getAttribute("data-ln-external-link") === "processed" && S(f, "ln-external-links:clicked", {
          link: f,
          href: f.href,
          text: f.textContent || f.title || ""
        });
      });
    }, "ln-external-links");
  }
  function u() {
    at(function() {
      new MutationObserver(function(f) {
        for (const p of f)
          if (p.type === "childList") {
            for (const y of p.addedNodes)
              if (y.nodeType === 1 && (y.matches && (y.matches("a") || y.matches("area")) && d(y), y.querySelectorAll))
                for (const m of y.querySelectorAll("a, area"))
                  d(m);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), fe(["href"], function(f) {
        f.matches && (f.matches("a") || f.matches("area")) && d(f);
      });
    }, "ln-external-links");
  }
  function c() {
    l(), u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      h();
    }) : h();
  }
  window[t] = {
    process: h
  }, c();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let d = null;
  function h() {
    d = document.createElement("div"), d.className = "ln-link-status", document.body.appendChild(d);
  }
  function l(o) {
    d && (d.textContent = o, d.classList.add("ln-link-status--visible"));
  }
  function u() {
    d && d.classList.remove("ln-link-status--visible");
  }
  function c(o, s) {
    if (s.target.closest("a, button, input, select, textarea")) return;
    const b = o.querySelector("a");
    if (!b) return;
    const v = b.getAttribute("href");
    if (!v) return;
    if (s.ctrlKey || s.metaKey || s.button === 1) {
      window.open(v, "_blank", "noopener,noreferrer");
      return;
    }
    G(o, "ln-link:navigate", { target: o, href: v, link: b }).defaultPrevented || b.click();
  }
  function i(o) {
    const s = o.querySelector("a");
    if (!s) return;
    const b = s.getAttribute("href");
    b && l(b);
  }
  function f() {
    u();
  }
  function p(o) {
    o[e + "Row"] || !o.querySelector("a") || (o[e + "Row"] = !0, o._lnLinkClick = function(b) {
      c(o, b);
    }, o._lnLinkEnter = function() {
      i(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", f));
  }
  function y(o) {
    o[e + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", f), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[e + "Row"]);
  }
  function m(o) {
    if (!o[e + "Init"]) return;
    const s = o.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const b = s === "TABLE" && o.querySelector("tbody") || o;
      for (const v of b.querySelectorAll("tr"))
        y(v);
    } else
      y(o);
    delete o[e + "Init"];
  }
  function _(o) {
    if (o[e + "Init"]) return;
    o[e + "Init"] = !0;
    const s = o.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const b = s === "TABLE" && o.querySelector("tbody") || o;
      for (const v of b.querySelectorAll("tr"))
        p(v);
    } else
      p(o);
  }
  function g(o) {
    o.hasAttribute && o.hasAttribute(t) && _(o);
    const s = o.querySelectorAll ? o.querySelectorAll("[" + t + "]") : [];
    for (const b of s)
      _(b);
  }
  function r() {
    at(function() {
      new MutationObserver(function(s) {
        for (const b of s)
          if (b.type === "childList") {
            for (const v of b.addedNodes)
              if (v.nodeType === 1) {
                g(v);
                const w = v.closest("[" + t + "]");
                if (w)
                  if (v.tagName === "TR")
                    p(v);
                  else {
                    const A = w.tagName;
                    if (A === "TABLE" || A === "TBODY") {
                      const C = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of C)
                        p(L);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), fe([t], function(s) {
        s.hasAttribute && s.hasAttribute(t) ? g(s) : m(s);
      });
    }, "ln-link");
  }
  function a(o) {
    g(o);
  }
  window[e] = { init: a, destroy: m };
  function n() {
    h(), r(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
const xt = ["Ctrl", "Alt", "Shift", "Meta"], Li = {
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
function En(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const d = Li[e.toLowerCase()];
  return d || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function An(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const d = e.split("+"), h = /* @__PURE__ */ new Set();
  let l = "";
  for (let c = 0; c < d.length; c++) {
    const i = En(d[c]);
    if (!i) return "";
    if (xt.indexOf(i) !== -1) {
      h.add(i);
      continue;
    }
    if (l) return "";
    l = i;
  }
  if (!l) return "";
  const u = [];
  for (let c = 0; c < xt.length; c++)
    h.has(xt[c]) && u.push(xt[c]);
  return u.push(l), u.join("+");
}
function Ti(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const d = e.split(/[\s,]+/), h = [];
  for (let l = 0; l < d.length; l++) {
    const u = An(d[l]);
    u && h.indexOf(u) === -1 && h.push(u);
  }
  return h;
}
function qi(t, e) {
  const d = String(e || "").trim();
  if (!d || /[\s,]/.test(d)) return "";
  const h = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(h) ? "" : An(h ? h + "+" + d : d);
}
function xi(t) {
  if (!t) return "";
  const e = En(t.key);
  if (!e || xt.indexOf(e) !== -1) return "";
  const d = [];
  return t.ctrlKey && d.push("Ctrl"), t.altKey && d.push("Alt"), t.shiftKey && d.push("Shift"), t.metaKey && d.push("Meta"), d.push(e), d.join("+");
}
function ki(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const d = t.getAttribute("contenteditable");
    if (d === "" || String(d).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Ii(t, e, d, h) {
  if (!t || !e || d !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const l = String(e.tagName || "").toLowerCase();
  return l === "button" ? h === "Enter" || h === "Space" : l === "a" && e.hasAttribute && e.hasAttribute("href") && h === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", d = "data-ln-key-target", h = "data-ln-key-allow-input", l = "data-ln-key-modifier", u = "data-ln-key-for", c = "lnKeyFor";
  if (window[e] !== void 0) return;
  const i = /* @__PURE__ */ new Set();
  let f = null;
  function p() {
    f || (f = function(r) {
      if (r.defaultPrevented || r.isComposing || r.repeat) return;
      const a = xi(r);
      if (!a) return;
      const n = Kn(r.target), o = document.querySelectorAll("[" + t + "], [" + u + "]");
      let s = null, b = !1, v = !1;
      for (let C = 0; C < o.length; C++) {
        const L = o[C], q = L[e] || L[c];
        if (!q || !q.matches(a) || n && !q.allowsInput()) continue;
        const x = q.resolveTarget(), R = ki(x);
        if (!(!R || !jn(x, R))) {
          if (Ii(r, x, R, a)) {
            v = !0;
            continue;
          }
          s ? b = !0 : s = { host: L, target: x, action: R };
        }
      }
      if (v || !s) return;
      b && console.warn('[ln-key] Duplicate active shortcut "' + a + '"; first DOM match wins.');
      const w = {
        source: s.host,
        target: s.target,
        action: s.action,
        key: a,
        event: r
      };
      G(s.host, "ln-key:before-trigger", w).defaultPrevented || (r.preventDefault(), s.target[s.action](), S(s.host, "ln-key:trigger", w));
    }, document.addEventListener("keydown", f));
  }
  function y() {
    i.size > 0 || !f || (document.removeEventListener("keydown", f), f = null);
  }
  function m(r) {
    return this.dom = r, this.shortcuts = [], i.add(this), this.sync(), p(), this;
  }
  m.prototype.sync = function() {
    this.shortcuts = Ti(this.dom.getAttribute(t));
  }, m.prototype.matches = function(r) {
    return this.shortcuts.indexOf(r) !== -1;
  }, m.prototype.allowsInput = function() {
    return this.dom.hasAttribute(h);
  }, m.prototype.resolveTarget = function() {
    const r = this.dom.getAttribute(d);
    return r ? g(r, d) : this.dom;
  }, m.prototype.destroy = function() {
    this.dom[e] && (i.delete(this), delete this.dom[e], y(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function _(r) {
    return this.dom = r, i.add(this), p(), this;
  }
  _.prototype._modifierContext = function() {
    return this.dom.closest("[" + l + "]");
  }, _.prototype.shortcut = function() {
    const r = this._modifierContext(), a = r ? r.getAttribute(l) : "";
    return qi(a, this.dom.textContent);
  }, _.prototype.matches = function(r) {
    return this.shortcut() === r;
  }, _.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(h)) return !0;
    const r = this._modifierContext();
    return !!(r && r.hasAttribute(h));
  }, _.prototype.resolveTarget = function() {
    return g(this.dom.getAttribute(u), u);
  }, _.prototype.destroy = function() {
    this.dom[c] && (i.delete(this), delete this.dom[c], y(), S(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function g(r, a) {
    if (!r) return null;
    try {
      const n = document.querySelector(r);
      return n || console.warn("[ln-key] Target not found for " + a + ' selector "' + r + '".'), n;
    } catch {
      return console.warn("[ln-key] Invalid " + a + ' selector "' + r + '".'), null;
    }
  }
  F(t, e, m, "ln-key", {
    extraAttributes: [d, h],
    onAttributeChange: function(r) {
      const a = r[e];
      if (a) {
        if (!r.hasAttribute(t)) {
          a.destroy();
          return;
        }
        a.sync();
      }
    }
  }), F(u, c, _, "ln-key-for", {
    onAttributeChange: function(r) {
      const a = r[c];
      a && !r.hasAttribute(u) && a.destroy();
    }
  });
})();
function Di(t, e, d = 100) {
  if (e != null && e !== "") {
    const h = parseFloat(String(e));
    if (!isNaN(h) && h > 0) return h;
  }
  if (t != null && t !== "") {
    const h = parseFloat(String(t));
    if (!isNaN(h) && h > 0) return h;
  }
  return d;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function d(u) {
    return this.dom = u, this._parentObserver = null, l.call(this), h.call(this), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function h() {
    const u = this, c = this.dom.parentElement;
    if (!c) return;
    const i = new MutationObserver(function(f) {
      for (const p of f)
        p.attributeName === "data-ln-progress-max" && l.call(u);
    });
    i.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function l() {
    const u = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, i = c ? c.getAttribute("data-ln-progress-max") : null, f = this.dom.getAttribute("data-ln-progress-max"), p = Di(f, i, 100), y = ln(u, p);
    this.dom.style.width = y.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(y.min)), this.dom.setAttribute("aria-valuemax", String(y.max)), this.dom.setAttribute("aria-valuenow", String(y.clampedValue)), S(this.dom, "ln-progress:change", {
      target: this.dom,
      value: y.value,
      max: y.max,
      percentage: y.percentage
    });
  }
  F(
    t,
    e,
    d,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(u) {
        const c = u[e];
        c && l.call(c);
      }
    }
  );
})();
function Ri(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let d = 0; d < t.length; d++)
    if (t[d] !== e[d]) return !0;
  return !1;
}
function Oi(t, e) {
  if (!e || typeof e != "object") return !0;
  const d = Object.keys(e);
  if (d.length === 0) return !0;
  for (let h = 0; h < d.length; h++) {
    const l = e[d[h]], u = t[l.col] || "";
    if (!_e(u, l.values))
      return !1;
  }
  return !0;
}
function Mi(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const d = [];
  for (let h = 0; h < t.length; h++) {
    const l = t[h];
    !e && l.key && (e = l.key), l.checked && !l.isReset && l.value && d.push(l.value);
  }
  return { key: e, values: d };
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", d = "data-ln-filter-key", h = "data-ln-filter-value", l = "data-ln-filter-hide", u = "data-ln-filter-reset", c = "data-ln-filter-col", i = "data-ln-hash", f = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  function p(r) {
    return r.hasAttribute(u) || !r.getAttribute(h);
  }
  function y(r) {
    const a = r.dom.querySelectorAll("[" + d + "]"), n = [];
    for (let s = 0; s < a.length; s++) {
      const b = a[s];
      n.push({
        key: b.getAttribute(d),
        value: b.getAttribute(h) || "",
        checked: b.checked,
        isReset: p(b)
      });
    }
    const o = Mi(n);
    return { key: o.key, values: o.values, targetId: r.targetId };
  }
  function m(r, a, n) {
    const o = r.querySelectorAll("[" + d + "]"), s = Array.isArray(n) && n.length > 0;
    for (let b = 0; b < o.length; b++) {
      const v = o[b];
      p(v) ? v.checked = !s : s && v.getAttribute(d) === a && n.indexOf(v.getAttribute(h)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function _(r) {
    this.dom = r, this.targetId = r.getAttribute(t);
    const a = r.getAttribute(c);
    this.colIndex = a !== null ? parseInt(a, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = yt(r, "filter"), this.hashEnabled = !!this.nsKey;
    const n = this, o = me(function() {
      n._render();
    });
    this._queueRender = o, this._attachHandlers(), this._onHashChange = function() {
      if (n._destroyed || !n.hashEnabled) return;
      const b = X(n.nsKey), v = re(b);
      v && v.key && v.values.length > 0 ? m(n.dom, v.key, v.values) : m(n.dom, null, []), n._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let s = !1;
    if (this.hashEnabled) {
      const b = X(this.nsKey), v = re(b);
      v && v.key && v.values.length > 0 && (m(r, v.key, v.values), it(function() {
        n._destroyed || n._render();
      }), s = !0);
    }
    if (!s && r.hasAttribute("data-ln-persist")) {
      const b = $t("filter", r);
      b && b.key && Array.isArray(b.values) && b.values.length > 0 && (m(r, b.key, b.values), it(function() {
        n._destroyed || n._render();
      }), s = !0);
    }
    if (!s) {
      const b = r.querySelectorAll("[" + d + "]");
      for (let v = 0; v < b.length; v++)
        if (b[v].checked && !p(b[v])) {
          it(function() {
            n._destroyed || n._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(a) {
      const n = a.target;
      if (!n || !n.hasAttribute || !n.hasAttribute(d)) return;
      const o = Array.from(r.dom.querySelectorAll("[" + d + "]"));
      if (p(n)) {
        for (let s = 0; s < o.length; s++)
          p(o[s]) || (o[s].checked = !1);
        n.checked = !0, r._queueRender();
        return;
      }
      if (n.checked) {
        for (let b = 0; b < o.length; b++)
          p(o[b]) && (o[b].checked = !1);
        let s = !1;
        for (let b = 0; b < o.length; b++)
          if (p(o[b])) {
            s = !0;
            break;
          }
        if (s) {
          let b = !0;
          for (let v = 0; v < o.length; v++)
            if (!p(o[v]) && !o[v].checked) {
              b = !1;
              break;
            }
          if (b)
            for (let v = 0; v < o.length; v++)
              p(o[v]) ? o[v].checked = !0 : o[v].checked = !1;
        }
      } else {
        let s = !1;
        for (let b = 0; b < o.length; b++)
          if (!p(o[b]) && o[b].checked) {
            s = !0;
            break;
          }
        if (!s)
          for (let b = 0; b < o.length; b++)
            p(o[b]) && (o[b].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const r = this, a = y(this), n = this._lastSnapshot;
    if (!(!n || n.key !== a.key || Ri(n.values, a.values))) return;
    const s = a.key === null || a.values.length === 0, b = document.getElementById(r.targetId), v = {
      key: a.key,
      values: a.values.slice(),
      targetId: r.targetId
    };
    S(r.dom, "ln-filter:change", v);
    let w = !1;
    b && b !== r.dom && G(b, "ln-filter:change", v).defaultPrevented && (w = !0);
    const A = n && n.values.length > 0, C = a.values.length === 0;
    if (A && C) {
      const L = { targetId: r.targetId };
      S(r.dom, "ln-filter:reset", L), b && b !== r.dom && S(b, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: a.key, values: a.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (a.key && a.values.length > 0 ? bt("filter", this.dom, { key: a.key, values: a.values.slice() }) : bt("filter", this.dom, null)), this.hashEnabled) {
      const L = an(a.key, a.values);
      et(this.nsKey, L);
    }
    if (!w)
      if (r.colIndex !== null)
        r._filterTableRows(a);
      else {
        if (!b) return;
        const L = b.children;
        for (let q = 0; q < L.length; q++) {
          const x = L[q];
          if (x.removeAttribute(l), s) continue;
          const R = x.getAttribute("data-" + a.key);
          R !== null && (_e(R, a.values) || x.setAttribute(l, "true"));
        }
      }
  }, _.prototype._filterTableRows = function(r) {
    const a = document.getElementById(this.targetId);
    if (!a) return;
    const n = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!n) return;
    const o = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, s = r.values;
    f.has(n) || f.set(n, {});
    const b = f.get(n);
    o && s.length > 0 ? b[o] = { col: this.colIndex, values: s.slice() } : o && delete b[o];
    const v = n.tBodies;
    for (let w = 0; w < v.length; w++) {
      const A = v[w].rows;
      for (let C = 0; C < A.length; C++) {
        const L = A[C], q = {};
        for (let x = 0; x < L.cells.length; x++)
          q[x] = L.cells[x].textContent.trim();
        Oi(q, b) ? L.removeAttribute(l) : L.setAttribute(l, "true");
      }
    }
  }, _.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const a = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (a && f.has(a)) {
            const n = f.get(a), o = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            o && n[o] && delete n[o], Object.keys(n).length === 0 && f.delete(a);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
    }
  };
  function g(r, a) {
    const n = r[e];
    !n || n._destroyed || a === i && (n.hashEnabled && n._onHashChange && window.removeEventListener("hashchange", n._onHashChange), n.nsKey = yt(r, "filter"), n.hashEnabled = !!n.nsKey, n.hashEnabled && window.addEventListener("hashchange", n._onHashChange));
  }
  F(t, e, _, "ln-filter", {
    extraAttributes: [i],
    onAttributeChange: g
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", d = "data-ln-search-for", h = "lnSearchControl", l = "data-ln-search-items", u = "data-ln-search-fields", c = "data-ln-search-exclude", i = "data-ln-search-hide", f = "data-ln-hash";
  if (window[e] !== void 0) return;
  function p(s) {
    const b = yt(s, "search");
    if (b) return b;
    if (s.id) {
      const v = document.querySelector("[" + d + '="' + s.id + '"]');
      if (v) {
        const w = yt(v, "search");
        if (w) return w;
      }
    }
    return null;
  }
  function y(s) {
    return s.matches("input, textarea") ? s : s.querySelector("input, textarea");
  }
  function m(s, b) {
    const v = s.childNodes;
    for (let w = 0; w < v.length; w++) {
      const A = v[w];
      if (A.nodeType === 3) {
        b.push(A.nodeValue);
        continue;
      }
      A.nodeType === 1 && (A.hasAttribute(c) || m(A, b));
    }
  }
  function _(s) {
    if (s._lnSearchText !== void 0) return s._lnSearchText;
    const b = [];
    m(s, b);
    const v = ni(b);
    return s._lnSearchText = v, v;
  }
  function g(s, b) {
    if (!s.id) return;
    const v = document.querySelectorAll("[" + d + '="' + s.id + '"]');
    for (const w of v) {
      const A = y(w);
      A && A.value !== b && (A.value = b);
    }
  }
  function r(s) {
    this.dom = s, this.term = s.getAttribute(t) || "", this._destroyed = !1;
    const b = this;
    return this.nsKey = p(s), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (b._destroyed || !b.hashEnabled) return;
      const v = X(b.nsKey), w = b.dom.getAttribute(t) || "";
      v !== null && v !== w ? b.dom.setAttribute(t, v) : v === null && w !== "" && b.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!b._destroyed) {
        if (b.hashEnabled) {
          const v = X(b.nsKey);
          if (v !== null && v !== b.term) {
            b.term = v, b.dom.setAttribute(t, v), g(b.dom, v), b._apply();
            return;
          }
        }
        se(b.term) && (g(b.dom, b.term), b._apply());
      }
    }), this;
  }
  r.prototype._apply = function() {
    const s = this.dom, b = se(this.term), v = dn(b);
    this.hashEnabled && et(this.nsKey, this.term ? this.term : null);
    const w = ei(s.getAttribute(u));
    if (G(s, "ln-search:change", {
      term: b,
      tokens: v,
      targetId: s.id,
      fields: w
    }).defaultPrevented) return;
    const C = s.getAttribute(l), L = C ? s.querySelectorAll(C) : s.children;
    for (let q = 0; q < L.length; q++) {
      const x = L[q];
      if (x.removeAttribute(i), x.hasAttribute(c) || v.length === 0) continue;
      const R = _(x);
      un(R, v) || x.setAttribute(i, "true");
    }
  }, r.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function a(s) {
    if (this.dom = s, this.targetId = s.getAttribute(d), this.input = y(s), this._attachHandler(), this.input && this.input.value.trim()) {
      const b = this;
      it(function() {
        const v = document.getElementById(b.targetId);
        v && ((v.getAttribute(t) || "").trim() || b._write(b.input.value));
      });
    }
    return this;
  }
  a.prototype._write = function(s) {
    const b = document.getElementById(this.targetId);
    b && b.getAttribute(t) !== s && b.setAttribute(t, s);
  }, a.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._onInput = function() {
      s._write(s.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, a.prototype.destroy = function() {
    this.dom[h] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[h]);
  };
  function n(s) {
    const b = s.getAttribute("data-ln-search-clear-for");
    if (b) {
      const L = document.getElementById(b), q = document.querySelector("[" + d + '="' + b + '"]'), x = q ? y(q) : null;
      return { target: L, input: x };
    }
    const v = s.closest("[" + t + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + d + '="' + v.id + '"]') : null, q = L ? y(L) : null;
      return { target: v, input: q };
    }
    const w = s.closest("[data-ln-table-source], [data-ln-list-source]");
    if (w) {
      const L = w.getAttribute("data-ln-table-source") || w.getAttribute("data-ln-list-source"), q = L ? document.getElementById(L) : null;
      if (q && q.hasAttribute(t)) {
        const x = document.querySelector("[" + d + '="' + L + '"]'), R = x ? y(x) : null;
        return { target: q, input: R };
      }
    }
    const A = s.closest("[" + d + "]");
    if (A) {
      const L = A.getAttribute(d), q = L ? document.getElementById(L) : null, x = y(A);
      return { target: q, input: x };
    }
    const C = s.parentElement;
    if (C) {
      const L = C.querySelector("[" + d + "]");
      if (L) {
        const q = L.getAttribute(d), x = q ? document.getElementById(q) : null, R = y(L);
        return { target: x, input: R };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(s) {
    const b = s.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!b) return;
    const v = n(b);
    !v.target && !v.input || (s.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(t, ""));
  });
  function o(s, b) {
    const v = s[e];
    if (!v || v._destroyed) return;
    if (b === f) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = p(s), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const w = s.getAttribute(t) || "";
    w !== v.term && (v.term = w, g(s, w), v._apply());
  }
  F(t, e, r, "ln-search", {
    extraAttributes: [f],
    onAttributeChange: o,
    onSubtreeChange: function(s, b) {
      const v = b.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    }
  }), F(d, h, a, "ln-search-control");
})();
function ht(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Fi(t) {
  const e = ht(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Ni(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Pi(t, e, d, h) {
  const l = ht(t);
  if (l === "none") return () => 0;
  const u = l === "desc" ? -1 : 1, c = typeof h == "function" ? h : (i) => i;
  return function(i, f) {
    const p = c(i), y = c(f);
    return he(p, y, e, d) * u;
  };
}
(function() {
  const t = "data-ln-sort", e = "lnSort", d = "data-ln-sort-field", h = "data-ln-sort-state", l = "data-ln-sort-dir", u = "data-ln-sort-items", c = "data-ln-hash";
  if (window[e] !== void 0) return;
  const i = /* @__PURE__ */ new WeakMap();
  function f(m, _) {
    if (_) {
      const g = m.querySelector('[data-ln-field="' + _ + '"]');
      if (g) return At(g);
    }
    return At(m);
  }
  function p(m) {
    this.dom = m, this.targetId = m.getAttribute(t), this.field = m.getAttribute(d) || null;
    const _ = m.closest("th");
    this.column = !this.field && _ ? _.cellIndex : null, this.itemsSelector = m.getAttribute(u) || null, this._state = ht(m.getAttribute(h)), this._destroyed = !1, this.nsKey = yt(m, "sort"), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._onClick = function(a) {
      const n = a.target.closest("[" + l + "]");
      if (!n) return;
      const o = ht(n.getAttribute(l));
      g._apply(o);
    }, m.addEventListener("click", this._onClick), this._onSortChange = function(a) {
      if (g._destroyed || !a.detail) return;
      const n = g._resolveTarget();
      if (!(n && (a.target === n || n.contains(a.target)) || a.detail.targetId && a.detail.targetId === g.targetId)) return;
      if (Ni(
        { field: g.field, column: g.column },
        { field: a.detail.field, column: a.detail.column }
      )) {
        const b = ht(a.detail.direction);
        b && m.getAttribute(h) !== b && (g._state = b, m.setAttribute(h, b), g._updateAriaSort(b));
        return;
      }
      m.getAttribute(h) !== "none" && (g._state = "none", m.setAttribute(h, "none"), g._updateAriaSort("none")), m.hasAttribute("data-ln-persist") && bt("sort", m, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const a = X(g.nsKey), n = ie(a);
      if (n)
        g.field !== null && n.fieldOrColumn === g.field || g.column !== null && String(g.column) === n.fieldOrColumn ? g._state !== n.direction && g._apply(n.direction, !0) : g._state !== "none" && (g._state = "none", m.setAttribute(h, "none"), g._updateAriaSort("none"));
      else if (g._state !== "none") {
        g._state = "none", m.setAttribute(h, "none"), g._updateAriaSort("none");
        const o = g._resolveTarget();
        o && (G(o, "ln-sort:change", {
          field: g.field,
          column: g.column,
          direction: "none",
          targetId: g.targetId
        }).defaultPrevented || g._defaultSort(o, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let r = !1;
    if (this.hashEnabled) {
      const a = X(this.nsKey), n = ie(a);
      n && ((g.field !== null && n.fieldOrColumn === g.field || g.column !== null && String(g.column) === n.fieldOrColumn) && it(function() {
        g._destroyed || g._apply(n.direction, !0);
      }), r = !0);
    }
    if (!r && m.hasAttribute("data-ln-persist")) {
      const a = $t("sort", m);
      a && a.direction && a.direction !== "none" && it(function() {
        g._destroyed || g._apply(a.direction, !0);
      }), r = !0;
    }
    if (!r) {
      const a = ht(m.getAttribute(h));
      a && a !== "none" && it(function() {
        g._destroyed || g._apply(a, !0);
      });
    }
    return this;
  }
  p.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, p.prototype._updateAriaSort = function(m) {
    const _ = this.dom.closest("th");
    _ && _.setAttribute("aria-sort", Fi(m));
  }, p.prototype._apply = function(m, _) {
    if (this._destroyed) return;
    const g = ht(m);
    this._state = g, this.dom.getAttribute(h) !== g && this.dom.setAttribute(h, g), this._updateAriaSort(g);
    const r = this._resolveTarget();
    if (!r) return;
    const a = {
      field: this.field,
      column: this.column,
      direction: g,
      targetId: this.targetId
    };
    if (!_ && (this.dom.hasAttribute("data-ln-persist") && bt("sort", this.dom, g === "none" ? null : a), this.hashEnabled)) {
      const o = sn(this.field !== null ? this.field : this.column, g);
      et(this.nsKey, o);
    }
    G(r, "ln-sort:change", a).defaultPrevented || this._defaultSort(r, g);
  }, p.prototype._defaultSort = function(m, _) {
    const g = this.itemsSelector ? Array.from(m.querySelectorAll(this.itemsSelector)) : Array.from(m.children);
    if (!g.length) return;
    const r = g[0].parentNode;
    i.has(m) || i.set(m, g.slice());
    let a;
    if (_ === "none")
      a = (i.get(m) || g).filter(function(s) {
        return s.parentNode === r;
      });
    else {
      const o = this.field, s = g.map(function(A) {
        return f(A, o);
      }), b = ue(s), v = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, w = Pi(_, b, v, function(A) {
        return f(A, o);
      });
      a = g.slice().sort(w);
    }
    const n = document.createDocumentFragment();
    for (let o = 0; o < a.length; o++) n.appendChild(a[o]);
    r.appendChild(n);
  }, p.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function y(m, _) {
    const g = m[e];
    if (!(!g || g._destroyed))
      if (_ === d) {
        g.field = m.getAttribute(d) || null;
        const r = m.closest("th");
        g.column = !g.field && r ? r.cellIndex : null;
      } else if (_ === u)
        g.itemsSelector = m.getAttribute(u) || null;
      else if (_ === h) {
        const r = ht(m.getAttribute(h));
        r !== g._state && g._apply(r);
      } else _ === t ? g.targetId = m.getAttribute(t) : _ === c && (g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = yt(m, "sort"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange));
  }
  F(t, e, p, "ln-sort", {
    extraAttributes: [d, u, h, c],
    onAttributeChange: y
  });
})();
function Oe(t, e, d, h, l = 15) {
  if (h <= 0 || d <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const u = Math.max(0, t || 0), c = Math.max(0, e || 0), i = Math.floor(u / d), f = Math.ceil(c / d), p = Math.max(0, i - l), y = Math.min(h, i + f + l), m = p * d, _ = Math.max(0, (h - y) * d);
  return { start: p, end: y, topPadding: m, bottomPadding: _ };
}
function Bi(t, e) {
  const d = Array.isArray(t) ? t.length : 0, h = e instanceof Set ? e : new Set(e || []);
  let l = 0;
  if (Array.isArray(t))
    for (let i = 0; i < t.length; i++)
      h.has(t[i]) && l++;
  else
    l = h.size;
  const u = d > 0 && l === d, c = l > 0 && l < d;
  return { totalCount: d, selectedCount: l, isAllSelected: u, isIndeterminate: c };
}
function Me(t, e, d) {
  const h = new Set(t);
  return e == null || ((d !== void 0 ? d : !h.has(e)) ? h.add(e) : h.delete(e)), h;
}
function Fe(t, e, d) {
  const h = new Set(t);
  if (!Array.isArray(e)) return h;
  if (d)
    for (let l = 0; l < e.length; l++)
      e[l] != null && h.add(e[l]);
  else
    for (let l = 0; l < e.length; l++)
      h.delete(e[l]);
  return h;
}
(function() {
  const t = "data-ln-table", e = "lnTable", d = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function f(m, _) {
    if (m == null || isNaN(m)) return "";
    try {
      return new Intl.NumberFormat(W(_)).format(m);
    } catch {
      return String(m);
    }
  }
  function p(m) {
    let _ = m.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const r = getComputedStyle(_).overflowY;
      if (r === "auto" || r === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function y(m) {
    this.dom = m, this.table = m.querySelector("table"), this.tbody = m.querySelector("[data-ln-table-body]") || m.querySelector("tbody"), this.thead = m.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = m.querySelector("[data-ln-table-total]"), this._filteredSpan = m.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== m ? this._filteredSpan.parentElement : null), this._selectedSpan = m.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== m ? this._selectedSpan.parentElement : null), this.isDataDriven = m.hasAttribute("data-ln-table-source"), this.name = m.getAttribute(t) || "", this.source = m.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const g = this;
    return this._onSetSearch = function(r) {
      const a = (r.detail && r.detail.query != null ? r.detail.query : r.detail && r.detail.term != null ? r.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = a, S(m, "ln-table:search", {
        table: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = a.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(m, "ln-table:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, m.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(r) {
      r.preventDefault(), g._onSetSearch(r);
    }, m.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", S(m, "ln-table:clear-filters", { table: g.name }), g._requestData()) : (g._searchTerm = "", g._columnFilters = {}, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(m, "ln-table:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, m.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = m.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && m.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(r) {
      const a = r.detail || {}, n = a.data || [], o = a.total != null ? a.total : n.length;
      if (!(g._hasInitialSeed && !g.isLoaded && n.length === 0 && o === 0)) {
        if (g._windowed) {
          g._cache.ingest(a) && !a.provisional && m.classList.remove("ln-table--loading");
          return;
        }
        g._data = n, g._lastTotal = o, g._lastFiltered = a.filtered != null ? a.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, m.classList.remove("ln-table--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), S(m, "ln-table:rendered", {
          table: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, m.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
      const a = r.detail && r.detail.loading;
      m.classList.toggle("ln-table--loading", !!a), a && (g.isLoaded = !1);
    }, m.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(r) {
      !g._windowed || !g._cache || g._cache.release(r.detail && r.detail.offset);
    }, m.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, m.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, m.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(r) {
      r.preventDefault(), g.currentSort = r.detail.direction === "none" ? null : { field: r.detail.field, direction: r.detail.direction }, g._requestData();
    }, m.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(r) {
      if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const a = r.target.closest("[data-ln-table-row]");
      if (!a) return;
      const n = a.getAttribute("data-ln-table-row-id"), o = a._lnRecord || {};
      S(m, "ln-table:row-click", {
        table: g.name,
        id: n,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
      const a = r.target.closest("[data-ln-table-row-action]");
      if (!a) return;
      const n = a.closest("[data-ln-table-row]");
      if (!n) return;
      const o = a.getAttribute("data-ln-table-row-action"), s = n.getAttribute("data-ln-table-row-id"), b = n._lnRecord || {};
      S(m, "ln-table:row-action", {
        table: g.name,
        id: s,
        action: o,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(m, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      g.tbody.rows.length > 0 && (g._emptyTbodyObserver.disconnect(), g._emptyTbodyObserver = null, g._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(r) {
      r.preventDefault();
      const a = r.detail.direction === "none" ? null : r.detail.direction;
      g._sortCol = a === null ? -1 : r.detail.column, g._sortDir = a, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), S(m, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, m.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(r) {
      if (r.preventDefault(), !r.detail) return;
      const a = r.detail.key, n = r.detail.values || [];
      if (a) {
        if (n.length === 0)
          delete g._columnFilters[a];
        else {
          const o = [];
          for (let s = 0; s < n.length; s++)
            o.push(n[s].toLowerCase());
          g._columnFilters[a] = o;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), S(m, "ln-table:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, m.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  y.prototype._parseRows = function() {
    const m = this.tbody.rows, _ = this.ths;
    this._data = [], m.length > 0 && (this._rowHeight = m[0].offsetHeight || 40), this._lockColumnWidths();
    for (let g = 0; g < m.length; g++) {
      const r = m[g], a = [], n = [], o = [];
      for (let b = 0; b < r.cells.length; b++) {
        const v = r.cells[b], w = v.textContent.trim();
        a[b] = At(v), n[b] = w.toLowerCase(), v.querySelector("[data-ln-table-row-action]") || o.push(w.toLowerCase());
      }
      let s = null;
      if (this.isDataDriven) {
        s = {};
        const b = r.getAttribute("data-ln-table-row-id");
        b != null && (s.id = b);
        for (let v = 0; v < _.length; v++) {
          const w = _[v].getAttribute("data-ln-table-col");
          if (w) {
            const A = v;
            if (A < r.cells.length) {
              const C = r.cells[A];
              s[w] = At(C);
            }
          }
        }
      }
      this._data.push({
        values: a,
        rawTexts: n,
        html: r.outerHTML,
        searchText: o.join(" "),
        id: this.isDataDriven && s ? s.id : void 0,
        ...s
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, y.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const m = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const g = document.createElement("col");
      g.style.width = _.offsetWidth + "px", m.appendChild(g);
    }), this.table.insertBefore(m, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = m;
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const m = this._lastTotal, _ = this.visibleCount;
        if (m === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const m = this._filteredData.length;
        m === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : m > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const m = this._filteredData, _ = document.createDocumentFragment();
      for (let g = 0; g < m.length; g++) {
        const r = this._buildRow(m[g]);
        if (!r) break;
        _.appendChild(r);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const m = [], _ = this._filteredData;
      for (let g = 0; g < _.length; g++) m.push(_[g].html);
      this.tbody.innerHTML = m.join(""), this._selectable && this._restoreSelection();
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const m = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let g = null;
        if (this._windowed) {
          const r = this._cache ? this._cache.peek() : null;
          g = r ? this._buildRow(r) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (g = this._buildRow(this._data[0]));
        g && this.tbody && (this.tbody.appendChild(g), this._rowHeight = g.offsetHeight || 40, g.remove());
      }
    this.isDataDriven ? this._scrollContainer = p(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      m._rafId || (m._rafId = requestAnimationFrame(function() {
        m._rafId = null, m._windowed ? m._renderWindowed() : m._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const m = this._filteredData, _ = m.length, g = this._rowHeight;
    if (!g || !_) return;
    const r = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let n, o;
    if (a) {
      const L = this.table.getBoundingClientRect(), q = a.getBoundingClientRect(), x = L.top - q.top + a.scrollTop + r;
      n = a.scrollTop - x, o = a.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + r;
      n = window.scrollY - x, o = window.innerHeight;
    }
    const s = Oe(n, o, g, _, 15), b = s.start, v = s.end;
    if (b === this._vStart && v === this._vEnd) return;
    this._vStart = b, this._vEnd = v;
    const w = this.ths.length || 1, A = s.topPadding, C = s.bottomPadding;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (A > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = A + "px", q.appendChild(x), L.appendChild(q);
      }
      for (let q = b; q < v; q++) {
        const x = this._buildRow(m[q]);
        x && L.appendChild(x);
      }
      if (C > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = C + "px", q.appendChild(x), L.appendChild(q);
      }
      this.tbody.replaceChildren(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      A > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let q = b; q < v; q++) L += m[q].html;
      C > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderRow = function() {
    const m = document.createElement("tr");
    m.className = "ln-table__placeholder", m.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", m.appendChild(_), m;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const m = this._rowHeight;
    if (!m) return;
    const _ = this._cache.logicalTotal, g = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let a, n;
    if (r) {
      const L = this.table.getBoundingClientRect(), q = r.getBoundingClientRect(), x = L.top - q.top + r.scrollTop + g;
      a = r.scrollTop - x, n = r.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + g;
      a = window.scrollY - x, n = window.innerHeight;
    }
    const o = Oe(a, n, m, _, 15), s = o.start, b = o.end, v = this.ths.length || 1, w = o.topPadding, A = o.bottomPadding, C = document.createDocumentFragment();
    if (w > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", v), q.style.height = w + "px", L.appendChild(q), C.appendChild(L);
    }
    for (let L = s; L < b; L++)
      if (this._cache.has(L)) {
        const q = this._buildRow(this._cache.get(L));
        q && C.appendChild(q);
      } else
        C.appendChild(this._buildPlaceholderRow());
    if (A > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", v), q.style.height = A + "px", L.appendChild(q), C.appendChild(L);
    }
    this.tbody.replaceChildren(C), this._vStart = s, this._vEnd = b, this._cache.ensure(s, b);
  }, y.prototype._showEmptyState = function() {
    const m = this.ths.length || 1;
    let _ = null, g = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && r > 0, o = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (g = pt(this.dom, o, "ln-table"), !g) {
        const s = this.dom.querySelector("template[data-ln-table-empty]");
        if (s) {
          const b = n ? "search" : "initial", v = s.content.querySelector('[data-ln-table-empty-when="' + b + '"]') || s.content.firstElementChild;
          v && (g = document.importNode(v, !0));
        }
      }
      if (g)
        if (g.tagName === "TR")
          _ = g;
        else {
          const s = document.createElement("td");
          s.setAttribute("colspan", String(m)), s.appendChild(g);
          const b = document.createElement("tr");
          b.className = "ln-table__empty", b.appendChild(s), _ = b;
        }
    } else {
      const r = this.dom.querySelector("template[" + d + "]"), a = document.createElement("td");
      a.setAttribute("colspan", String(m)), r && a.appendChild(document.importNode(r.content, !0));
      const n = document.createElement("tr");
      n.className = "ln-table__empty", n.appendChild(a), _ = n;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._fillRow = function(m, _) {
    Dt(m, _);
    const g = m.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < g.length; r++) {
      const a = g[r], n = a.getAttribute("data-ln-table-cell-attr").split(",");
      for (let o = 0; o < n.length; o++) {
        const s = n[o].trim().split(":");
        if (s.length !== 2) continue;
        const b = s[0].trim(), v = s[1].trim();
        _[b] != null && a.setAttribute(v, _[b]);
      }
    }
  }, y.prototype._buildRow = function(m) {
    let _ = pt(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (_ = document.importNode(r.content, !0));
    }
    let g = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (g)
      this._fillRow(g, m);
    else if (m && m.html) {
      const r = document.createElement("tbody");
      r.innerHTML = m.html, g = r.firstElementChild;
    } else {
      g = document.createElement("tr"), g.setAttribute("data-ln-table-row", "");
      const r = this.ths;
      for (let a = 0; a < r.length; a++) {
        const n = r[a].hasAttribute("data-ln-table-col-select"), o = document.createElement("td");
        if (n) {
          const s = document.createElement("input");
          s.type = "checkbox", s.setAttribute("data-ln-table-row-select", ""), s.setAttribute("aria-label", "Select row"), o.appendChild(s);
        } else {
          const s = r[a].getAttribute("data-ln-table-col");
          s && m[s] != null && (o.textContent = String(m[s]));
        }
        g.appendChild(o);
      }
    }
    if (g._lnRecord = m, m.id != null && g.setAttribute("data-ln-table-row-id", m.id), this._selectable && m.id != null && this.selectedIds.has(String(m.id))) {
      g.classList.add("ln-row-selected");
      const r = g.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return g;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ue(this, "ln-table:request-data", "table");
  }, y.prototype._enterWindowedMode = function() {
    const m = this, _ = this.dom, g = parseInt(_.getAttribute("data-ln-table-window"), 10), r = parseInt(_.getAttribute("data-ln-table-window-page"), 10), a = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !m._windowed || !m._cache || (m.totalCount = m._cache.grandTotal, m.visibleCount = m._cache.logicalTotal, m._lastTotal = m._cache.grandTotal, m.isLoaded = !0, m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), S(_, "ln-table:rendered", {
        table: m.name,
        total: m.totalCount,
        visible: m.visibleCount
      }));
    }, this._renderBatch = me(this._onCacheChange), this._cache = en({
      windowSize: g > 0 ? g : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: a >= 0 ? a : 25,
      fetchDebounce: 120,
      requestPage: function(n, o, s) {
        S(_, "ln-table:request-data", {
          table: m.name,
          sort: n.sort,
          filters: n.filters,
          search: n.search,
          offset: o,
          limit: s,
          queryGen: m._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let m = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(m) && this._totalSpan) {
        const g = this._totalSpan.textContent.replace(/[^\d]/g, "");
        g && (m = parseInt(g, 10));
      }
      const _ = m > 0 ? m : this._data.length;
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
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let r = 0; r < m.length; r++) {
      const a = m[r].getAttribute("data-ln-table-row-id");
      a != null && _.push(a);
    }
    const g = Bi(_, this.selectedIds);
    this._selectAllCheckbox.checked = g.isAllSelected, this._selectAllCheckbox.indeterminate = g.isIndeterminate;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < m.length; _++) {
      const g = m[_].getAttribute("data-ln-table-row-id"), r = g != null && this.selectedIds.has(g);
      m[_].classList.toggle("ln-row-selected", r);
      const a = m[_].querySelector("[data-ln-table-row-select]");
      a && (a.checked = r);
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
    const m = this;
    if (this._onSelectionChange = function(_) {
      const g = _.target.closest("[data-ln-table-row-select]");
      if (!g) return;
      const r = g.closest("[data-ln-table-row]");
      if (!r) return;
      const a = r.getAttribute("data-ln-table-row-id");
      a != null && (m.selectedIds = Me(m.selectedIds, a, g.checked), r.classList.toggle("ln-row-selected", g.checked), m.selectedCount = m.selectedIds.size, m._updateSelectAll(), m._updateFooter(), S(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const g = m.dom.querySelector('[data-ln-table-dict="select-all"]'), r = m.dom.getAttribute("data-ln-table-select-all-label") || (g ? g.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", r), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = m._selectAllCheckbox.checked, g = m.tbody ? m.tbody.querySelectorAll("[data-ln-table-row]") : [], r = [];
      for (let a = 0; a < g.length; a++) {
        const n = g[a].getAttribute("data-ln-table-row-id"), o = g[a].querySelector("[data-ln-table-row-select]");
        n != null && (r.push(n), g[a].classList.toggle("ln-row-selected", _), o && (o.checked = _));
      }
      m.selectedIds = Fe(m.selectedIds, r, _), m.selectedCount = m.selectedIds.size, S(m.dom, "ln-table:select-all", {
        table: m.name,
        selected: _
      }), S(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }), m._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        const r = _[g].querySelector("[data-ln-table-row-select]"), a = _[g].getAttribute("data-ln-table-row-id");
        r && r.checked && a != null && (m.selectedIds = Me(m.selectedIds, a, !0), _[g].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, y.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const m = this.dom.querySelector("[data-ln-table-col-select]");
    if (m) {
      const _ = m.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Fe(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        _[g].classList.remove("ln-row-selected");
        const r = _[g].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, y.prototype._updateFooter = function() {
    let m = 0, _ = 0;
    this.isDataDriven ? (m = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (m = this._data.length, _ = this._filteredData.length);
    const g = _ < m;
    if (this._totalSpan && (this._totalSpan.textContent = f(m, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = g ? f(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !g), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? f(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, F(t, e, y, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(m, _) {
      const g = m[e];
      if (!(!g || !g.isDataDriven)) {
        if (_ === "data-ln-table-window") {
          const r = m.hasAttribute("data-ln-table-window");
          if (r && !g._windowed)
            g._enterWindowedMode(), g._kickWindowInitial();
          else if (!r && g._windowed)
            g._exitWindowedMode();
          else if (r && g._windowed) {
            const a = parseInt(m.getAttribute("data-ln-table-window"), 10);
            a > 0 && g._cache.configure({ windowSize: a });
          }
          return;
        }
        if (!(!g._windowed || !g._cache)) {
          if (_ === "data-ln-table-window-page") {
            const r = parseInt(m.getAttribute("data-ln-table-window-page"), 10);
            r > 0 && g._cache.configure({ pageSize: r });
          } else if (_ === "data-ln-table-window-threshold") {
            const r = parseInt(m.getAttribute("data-ln-table-window-threshold"), 10);
            r >= 0 && g._cache.configure({ threshold: r });
          } else if (_ === "data-ln-table-count") {
            const r = parseInt(m.getAttribute("data-ln-table-count"), 10);
            r >= 0 && g._cache.setGrandTotal(r);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  document.addEventListener("keydown", function(c) {
    if (c.key !== "/" || c.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const i = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!i) return;
    const f = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector('input[type="search"], input[type="text"], input');
    f && (c.preventDefault(), f.focus());
  });
  function d(c) {
    return this.dom = c, u(this), this;
  }
  function h(c, i) {
    const f = i ? '[data-ln-search-for="' + i + '"]' : "[data-ln-search-for]", p = c.querySelector(f) || document.querySelector(f);
    return p ? p.tagName === "INPUT" || p.tagName === "TEXTAREA" ? p : p.querySelector("input, textarea") : null;
  }
  function l(c, i) {
    if (i) {
      const p = c.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (p.length > 0) return p;
      const y = document.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (y.length > 0) return y;
    }
    const f = c.querySelectorAll("[data-ln-filter]");
    return f.length > 0 ? f : document.querySelectorAll("[data-ln-filter]");
  }
  function u(c) {
    const i = c.dom;
    function f(p) {
      const y = p.target;
      if (y && y.hasAttribute && y.hasAttribute("data-ln-table")) return y;
      const m = p.detail && p.detail.targetId || y && y.id;
      return m ? i.querySelector('[data-ln-table-source="' + m + '"]') || i.querySelector('[data-ln-table="' + m + '"]') : null;
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(p) {
        if (!p.detail) return;
        const y = f(p);
        if (!y || !y.hasAttribute || !y.hasAttribute("data-ln-table")) return;
        const m = p.detail.key, _ = p.detail.values || [], g = y.querySelectorAll("th");
        for (let r = 0; r < g.length; r++)
          if (g[r].getAttribute("data-ln-table-filter-col") === m) {
            const a = g[r].querySelector("[data-ln-table-col-filter]");
            a && a.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(p) {
        const y = p.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!y) return;
        const m = y.closest("[data-ln-table]") || i.querySelector("[data-ln-table]");
        if (!m || !m.lnTable) return;
        const _ = m.lnTable.name || m.id, g = m.querySelectorAll("th");
        for (let o = 0; o < g.length; o++) {
          const s = g[o].querySelector("[data-ln-table-col-filter]");
          s && s.classList.remove("ln-filter-active");
        }
        const r = m.getAttribute("data-ln-table-source") || m.id, a = r ? document.getElementById(r) : null;
        if (a && a.hasAttribute("data-ln-search"))
          a.setAttribute("data-ln-search", "");
        else {
          const o = h(i, r);
          o && o.value !== "" && (o.value = "", o.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const n = l(i, r);
        for (let o = 0; o < n.length; o++) {
          const s = n[o].querySelector("[data-ln-filter-reset]");
          if (!s) continue;
          const b = n[o].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!s.checked || b) && (s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        m.hasAttribute("data-ln-table-source") || S(m, "ln-table:request-clear-filters", { table: _ });
      }
    }, i.addEventListener("ln-filter:change", c._handlers.filter), i.addEventListener("click", c._handlers.clear);
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, F(t, e, d, "ln-table-coordinator");
})();
(function() {
  const t = "data-ln-list", e = "lnList", d = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function f(r, a) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(W(a)).format(r);
    } catch {
      return String(r);
    }
  }
  function p(r) {
    let a = r;
    for (; a && a !== document.body && a !== document.documentElement; ) {
      const o = getComputedStyle(a).overflowY;
      if (o === "auto" || o === "scroll") return a;
      a = a.parentElement;
    }
    return null;
  }
  function y(r) {
    const a = r._scrollContainer || p(r.dom);
    return {
      container: a,
      top: a ? a.scrollTop : window.scrollY
    };
  }
  function m(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function _(r) {
    if (!r) return 0;
    const a = getComputedStyle(r), n = parseFloat(a.marginTop) || 0, o = parseFloat(a.marginBottom) || 0;
    return r.offsetHeight + n + o;
  }
  function g(r) {
    this.dom = r, this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this.name = r.getAttribute(t) || "", this.source = r.getAttribute("data-ln-list-source") || "", this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const a = this;
    return this._onSetSearch = function(n) {
      const o = (n.detail && n.detail.query != null ? n.detail.query : n.detail && n.detail.term != null ? n.detail.term : "").trim();
      a.isDataDriven ? (a.currentSearch = o, S(r, "ln-list:search", {
        list: a.name,
        query: a.currentSearch
      }), a._requestData()) : (a._searchTerm = o.toLowerCase(), a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), S(r, "ln-list:filter", {
        term: a._searchTerm,
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, r.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(n) {
      n.preventDefault(), a._onSetSearch(n);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      a.isDataDriven ? (a.currentFilters = {}, a.currentSearch = "", S(r, "ln-list:clear-filters", { list: a.name }), a._requestData()) : (a._searchTerm = "", a._filters = {}, a._sortField = null, a._sortDir = null, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), S(r, "ln-list:filter", {
        term: "",
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = r.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(n) {
      const o = n.detail || {}, s = o.data || [], b = o.total != null ? o.total : s.length;
      if (!(a._hasInitialSeed && !a.isLoaded && s.length === 0 && b === 0)) {
        if (a._windowed) {
          a._cache.ingest(o) && !o.provisional && r.classList.remove("ln-list--loading");
          return;
        }
        a._data = s, a._lastTotal = b, a._lastFiltered = o.filtered != null ? o.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, a._hasInitialSeed = !1, r.classList.remove("ln-list--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), S(r, "ln-list:rendered", {
          list: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(n) {
      const o = n.detail && n.detail.loading;
      r.classList.toggle("ln-list--loading", !!o), o && (a.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(n) {
      !a._windowed || !a._cache || a._cache.release(n.detail && n.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !a._windowed || !a._cache || a._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !a._windowed || !a._cache || a._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(n) {
      n.detail.field != null && (n.preventDefault(), a.currentSort = n.detail.direction === "none" ? null : { field: n.detail.field, direction: n.detail.direction }, a._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(n) {
      if (n.target.closest("[data-ln-item-select]") || n.target.closest("[data-ln-item-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const o = n.target.closest("[data-ln-item]");
      if (!o) return;
      const s = o.getAttribute("data-ln-item-id"), b = o._lnRecord || {};
      S(r, "ln-list:item-click", {
        list: a.name,
        id: s,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(n) {
      const o = n.target.closest("[data-ln-item-action]");
      if (!o) return;
      const s = o.closest("[data-ln-item]");
      if (!s) return;
      const b = o.getAttribute("data-ln-item-action"), v = s.getAttribute("data-ln-item-id"), w = s._lnRecord || {};
      S(r, "ln-list:item-action", {
        list: a.name,
        id: v,
        action: b,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(r, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      a.tbody.children.length > 0 && (a._emptyObserver.disconnect(), a._emptyObserver = null, a._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(n) {
      if (n.preventDefault(), !n.detail) return;
      const o = n.detail.key, s = n.detail.values || [];
      if (o) {
        if (s.length === 0)
          delete a._filters[o];
        else {
          const b = [];
          for (let v = 0; v < s.length; v++)
            b.push(s[v].toLowerCase());
          a._filters[o] = b;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), S(r, "ln-list:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(n) {
      if (n.detail && n.detail.field == null) return;
      n.preventDefault();
      const o = n.detail && n.detail.direction === "none" ? null : n.detail && n.detail.direction;
      a._sortField = o === null ? null : n.detail && n.detail.field, a._sortDir = o, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), S(r, "ln-list:sorted", {
        field: a._sortField,
        direction: n.detail && n.detail.direction,
        matched: a._filteredData.length,
        total: a._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  g.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((a) => !a.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = _(r[0]) || 50);
    for (let a = 0; a < r.length; a++) {
      const n = r[a], o = n.getAttribute("data-ln-item-id") || n.getAttribute("id"), s = n.textContent.trim().toLowerCase();
      let b = null;
      if (this.isDataDriven) {
        b = {}, o != null && (b.id = o);
        const A = n.querySelectorAll("[data-ln-list-field]");
        for (let C = 0; C < A.length; C++) {
          const L = A[C], q = L.getAttribute("data-ln-list-field");
          q && (b[q] = At(L));
        }
      }
      const v = {}, w = n.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let A = 0; A < w.length; A++) {
        const C = w[A], L = C.getAttribute("data-ln-list-field") || C.getAttribute("data-ln-field");
        L && (v[L] = At(C));
      }
      for (let A = 0; A < n.attributes.length; A++) {
        const C = n.attributes[A];
        if (C.name.startsWith("data-") && !C.name.startsWith("data-ln-")) {
          const L = C.name.slice(5);
          L && (v[L] = C.value);
        }
      }
      this._data.push({
        html: n.outerHTML,
        id: o,
        searchText: s,
        fields: v,
        ...b || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const r = this._searchTerm, a = r ? r.split(/\s+/).filter(Boolean) : [], n = this._filters || {}, o = Object.keys(n).length > 0;
      if (a.length === 0 && !o ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(s) {
        if (a.length > 0 && !a.every(function(v) {
          return s.searchText && s.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (o)
          for (const b in n) {
            const v = n[b];
            if (v && v.length > 0) {
              const w = s.fields && s.fields[b] !== void 0 ? s.fields[b] : s[b] !== void 0 ? s[b] : null, A = w != null ? String(w).toLowerCase() : "";
              if (v.indexOf(A) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const s = this._sortField, b = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, w = this._filteredData.map(function(C) {
          return C.fields && C.fields[s] !== void 0 ? C.fields[s] : C[s];
        }), A = ue(w);
        this._filteredData.sort(function(C, L) {
          const q = C.fields && C.fields[s] !== void 0 ? C.fields[s] : C[s], x = L.fields && L.fields[s] !== void 0 ? L.fields[s] : L[s];
          return he(q, x, A, v) * b;
        });
      }
    }
  }, g.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, a = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, a = document.createDocumentFragment();
      for (let o = 0; o < r.length; o++) {
        const s = this._buildItem(r[o]);
        s && a.appendChild(s);
      }
      const n = y(this);
      this.tbody.replaceChildren(a), m(n), this._selectable && this._updateSelectAll();
    } else {
      const r = [], a = this._filteredData;
      for (let o = 0; o < a.length; o++) r.push(a[o].html);
      const n = y(this);
      this.tbody.innerHTML = r.join(""), m(n), this._selectable && this._restoreSelection();
    }
  }, g.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), a = r.gridTemplateColumns;
    let n = 1;
    if (a && a !== "none") {
      const s = a.trim().split(/\s+/).filter(Boolean);
      s.length > 0 && (n = s.length);
    }
    const o = parseFloat(r.rowGap);
    return { columns: n, rowGap: isNaN(o) ? 0 : o };
  }, g.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), a = r ? this._buildItem(r) : this._buildPlaceholderItem();
      a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = _(a) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = _(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = _(r[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = p(this.dom);
    const a = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, a.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const r = this._filteredData, a = r.length, n = this._itemHeight;
    if (!n || !a) return;
    const o = this._scrollContainer;
    let s, b;
    if (o) {
      const H = this.tbody.getBoundingClientRect(), U = o.getBoundingClientRect(), z = o === this.tbody ? 0 : H.top - U.top + o.scrollTop;
      s = o.scrollTop - z, b = o.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      s = window.scrollY - U, b = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, A = v.rowGap, C = n + A, L = Math.ceil(a / w);
    let q = Math.max(0, Math.floor(s / C) - 15);
    q = Math.min(q, L);
    const x = Math.ceil(b / C) + 30, R = Math.min(q + x, L), M = Math.min(q * w, a), N = Math.min(R * w, a);
    if (M === this._vStart && N === this._vEnd) return;
    this._vStart = M, this._vEnd = N;
    const B = q * C, K = (L - R) * C;
    if (this.isDataDriven) {
      const H = document.createDocumentFragment();
      if (B > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = B + "px", H.appendChild(z);
      }
      for (let z = M; z < N; z++) {
        const st = this._buildItem(r[z]);
        st && H.appendChild(st);
      }
      if (K > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = K + "px", H.appendChild(z);
      }
      const U = y(this);
      this.tbody.replaceChildren(H), m(U), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      B > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${B}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = M; z < N; z++)
        H += r[z].html;
      K > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${K}px"></${this.isUl ? "li" : "div"}>`);
      const U = y(this);
      this.tbody.innerHTML = H, m(U), this._selectable && this._restoreSelection();
    }
  }, g.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, g.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const a = this._scrollContainer;
    let n, o;
    if (a) {
      const U = this.tbody.getBoundingClientRect(), z = a.getBoundingClientRect(), st = a === this.tbody ? 0 : U.top - z.top + a.scrollTop;
      n = a.scrollTop - st, o = a.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - z, o = window.innerHeight;
    }
    const s = this._readGridLayout(), b = s.columns, v = s.rowGap, w = r + v, A = this._cache.logicalTotal, C = Math.ceil(A / b);
    let L = Math.max(0, Math.floor(n / w) - 15);
    L = Math.min(L, C);
    const q = Math.ceil(o / w) + 30, x = Math.min(L + q, C), R = Math.min(L * b, A), M = Math.min(x * b, A), N = L * w, B = (C - x) * w, K = document.createDocumentFragment();
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", K.appendChild(U);
    }
    for (let U = R; U < M; U++)
      if (this._cache.has(U)) {
        const z = this._buildItem(this._cache.get(U));
        z && K.appendChild(z);
      } else
        K.appendChild(this._buildPlaceholderItem());
    if (B > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = B + "px", K.appendChild(U);
    }
    const H = y(this);
    this.tbody.replaceChildren(K), m(H), this._vStart = R, this._vEnd = M, this._cache.ensure(R, M);
  }, g.prototype._showEmptyState = function() {
    let r = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount === 0 && a > 0, s = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = pt(this.dom, s, "ln-list"), !r) {
        const b = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (b) {
          const v = o ? "search" : "initial", w = b.content.querySelector(`[data-ln-empty-when="${v}"]`) || b.content.firstElementChild;
          w && (r = document.importNode(w, !0));
        }
      }
    } else {
      const a = this.dom.querySelector(`template[${d}]`);
      if (a) {
        const n = a.content.firstElementChild;
        n && (r = document.importNode(n, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.replaceChildren(r);
      else {
        const a = document.createElement(this.isUl ? "li" : "div");
        a.appendChild(r), this.tbody.replaceChildren(a);
      }
    else
      this.tbody.replaceChildren();
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._buildItem = function(r) {
    let a = pt(this.dom, this.name + "-row", "ln-list");
    if (!a) {
      const o = this.dom.querySelector("template[data-ln-item]");
      o && (a = document.importNode(o.content, !0));
    }
    let n = a ? a.querySelector("[data-ln-item]") || a.firstElementChild : null;
    if (n)
      Dt(n, r), ot(n, r);
    else if (r && r.html) {
      const o = document.createElement(this.isUl ? "ul" : "div");
      o.innerHTML = r.html, n = o.firstElementChild;
    } else if (n = document.createElement(this.isUl ? "li" : "div"), n.setAttribute("data-ln-item", ""), r && typeof r == "object") {
      for (const o in r)
        if (o !== "html" && r[o] != null) {
          const s = document.createElement("span");
          s.setAttribute("data-ln-field", o), s.textContent = String(r[o]), n.appendChild(s);
        }
    }
    if (n._lnRecord = r, r && r.id != null && (n.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      n.classList.add("ln-item-selected");
      const o = n.querySelector("[data-ln-item-select]");
      o && (o.checked = !0);
    }
    return n;
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let a = 0; a < r.length; a++) {
      const n = r[a].getAttribute("data-ln-item-id"), o = n != null && this.selectedIds.has(String(n));
      r[a].classList.toggle("ln-item-selected", o);
      const s = r[a].querySelector("[data-ln-item-select]");
      s && (s.checked = o);
    }
    this._updateSelectAll();
  }, g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(a) {
      const n = a.target.closest("[data-ln-item-select]");
      if (!n) return;
      const o = n.closest("[data-ln-item]");
      if (!o) return;
      const s = o.getAttribute("data-ln-item-id");
      s != null && (n.checked ? (r.selectedIds.add(String(s)), o.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(s)), o.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), S(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const a = r._selectAllCheckbox.checked, n = r.tbody.querySelectorAll("[data-ln-item]");
      for (let o = 0; o < n.length; o++) {
        const s = n[o], b = s.getAttribute("data-ln-item-id"), v = s.querySelector("[data-ln-item-select]");
        b != null && (a ? (r.selectedIds.add(String(b)), s.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(b)), s.classList.remove("ln-item-selected")), v && (v.checked = a));
      }
      S(r.dom, "ln-list:select-all", { list: r.name, selected: a }), S(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let a = r.length > 0;
    for (let n = 0; n < r.length; n++) {
      const o = r[n].getAttribute("data-ln-item-id");
      if (o != null && !this.selectedIds.has(String(o))) {
        a = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = a;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Ue(this, "ln-list:request-data", "list");
  }, g.prototype._enterWindowedMode = function() {
    const r = this, a = this.dom, n = parseInt(a.getAttribute("data-ln-list-window"), 10), o = parseInt(a.getAttribute("data-ln-list-window-page"), 10), s = parseInt(a.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), S(a, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = me(this._onCacheChange), this._cache = en({
      windowSize: n > 0 ? n : 1e3,
      pageSize: o > 0 ? o : 200,
      threshold: s >= 0 ? s : 25,
      fetchDebounce: 120,
      requestPage: function(b, v, w) {
        S(a, "ln-list:request-data", {
          list: r.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
          offset: v,
          limit: w,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, g.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), a = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: a,
        filtered: a
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, g.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, g.prototype._updateFooter = function() {
    let r = 0, a = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, a = this.visibleCount) : (r = this._data.length, a = this._filteredData.length);
    const n = a < r;
    if (this._totalSpan && (this._totalSpan.textContent = f(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = n ? f(a, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const o = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = o > 0 ? f(o, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, F(t, e, g, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(r, a) {
      const n = r[e];
      if (!(!n || !n.isDataDriven)) {
        if (a === "data-ln-list-window") {
          const o = r.hasAttribute("data-ln-list-window");
          if (o && !n._windowed)
            n._enterWindowedMode(), n._kickWindowInitial();
          else if (!o && n._windowed)
            n._exitWindowedMode();
          else if (o && n._windowed) {
            const s = parseInt(r.getAttribute("data-ln-list-window"), 10);
            s > 0 && n._cache.configure({ windowSize: s });
          }
          return;
        }
        if (!(!n._windowed || !n._cache)) {
          if (a === "data-ln-list-window-page") {
            const o = parseInt(r.getAttribute("data-ln-list-window-page"), 10);
            o > 0 && n._cache.configure({ pageSize: o });
          } else if (a === "data-ln-list-window-threshold") {
            const o = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
            o >= 0 && n._cache.configure({ threshold: o });
          } else if (a === "data-ln-list-count") {
            const o = parseInt(r.getAttribute("data-ln-list-count"), 10);
            o >= 0 && n._cache.setGrandTotal(o);
          }
        }
      }
    }
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  const d = "http://www.w3.org/2000/svg", h = 36, l = 16, u = 2 * Math.PI * l;
  function c(y) {
    return this.dom = y, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, f.call(this), p.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function i(y, m) {
    const _ = document.createElementNS(d, y);
    for (const [g, r] of Object.entries(m))
      _.setAttribute(g, r);
    return _;
  }
  function f() {
    this.svg = i("svg", {
      viewBox: "0 0 " + h + " " + h,
      width: h,
      height: h
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = i("circle", {
      cx: h / 2,
      cy: h / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: h / 2,
      cy: h / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": u,
      "stroke-dashoffset": u,
      transform: "rotate(-90 " + h / 2 + " " + h / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function p() {
    const y = this.dom.getAttribute("data-ln-circular-progress"), m = this.dom.getAttribute("data-ln-circular-progress-max"), _ = ln(y, m || 100), g = u - _.percentage / 100 * u;
    this.progressCircle.setAttribute("stroke-dashoffset", g);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), a = r !== null ? r : Math.round(_.percentage) + "%";
    this.labelEl.textContent = a, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(_.min)), this.dom.setAttribute("aria-valuemax", String(_.max)), this.dom.setAttribute("aria-valuenow", String(_.clampedValue)), this.dom.setAttribute("aria-valuetext", a), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: _.value,
      max: _.max,
      percentage: _.percentage
    });
  }
  F(t, e, c, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(y) {
      const m = y[e];
      m && p.call(m);
    }
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", d = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  function h(u) {
    this.dom = u, this.isEnabled = u.getAttribute(t) !== "disabled", this._dragging = null, u.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(i) {
      c.isEnabled && c._handlePointerDown(i);
    }, u.addEventListener("pointerdown", this._onPointerDown), this;
  }
  h.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, h.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, h.prototype._handlePointerDown = function(u) {
    let c = u.target.closest("[" + d + "]"), i;
    if (c) {
      for (i = c; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + d + "]")) return;
      for (i = u.target; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
      c = i;
    }
    const p = Array.from(this.dom.children).indexOf(i);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: i,
      index: p
    }).defaultPrevented) return;
    u.preventDefault(), c.setPointerCapture(u.pointerId), this._dragging = i, i.classList.add("ln-sortable--dragging"), i.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: i,
      index: p
    });
    const m = this, _ = function(r) {
      m._handlePointerMove(r);
    }, g = function(r) {
      m._handlePointerEnd(r), c.removeEventListener("pointermove", _), c.removeEventListener("pointerup", g), c.removeEventListener("pointercancel", g);
    };
    c.addEventListener("pointermove", _), c.addEventListener("pointerup", g), c.addEventListener("pointercancel", g);
  }, h.prototype._handlePointerMove = function(u) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), i = this._dragging;
    for (const f of c)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const f of c) {
      if (f === i) continue;
      const p = f.getBoundingClientRect(), y = p.top + p.height / 2;
      if (u.clientY >= p.top && u.clientY < y) {
        f.classList.add("ln-sortable--drop-before");
        break;
      } else if (u.clientY >= y && u.clientY <= p.bottom) {
        f.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, h.prototype._handlePointerEnd = function(u) {
    if (!this._dragging) return;
    const c = this._dragging, i = Array.from(this.dom.children), f = i.indexOf(c);
    let p = null, y = null;
    for (const m of i) {
      if (m.classList.contains("ln-sortable--drop-before")) {
        p = m, y = "before";
        break;
      }
      if (m.classList.contains("ln-sortable--drop-after")) {
        p = m, y = "after";
        break;
      }
    }
    for (const m of i)
      m.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), p && p !== c) {
      y === "before" ? this.dom.insertBefore(c, p) : this.dom.insertBefore(c, p.nextElementSibling);
      const _ = Array.from(this.dom.children).indexOf(c);
      S(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: f,
        newIndex: _
      });
    }
    this._dragging = null;
  };
  function l(u) {
    const c = u[e];
    if (!c) return;
    const i = u.getAttribute(t) !== "disabled";
    i !== c.isEnabled && (c.isEnabled = i, S(u, i ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: u }));
  }
  F(t, e, h, "ln-sortable", {
    onAttributeChange: l
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", d = "data-ln-confirm-timeout";
  if (window[e] !== void 0) return;
  function l(c) {
    const i = parseFloat(c.getAttribute(d));
    return isNaN(i) || i <= 0 ? 3 : i;
  }
  function u(c) {
    this.dom = c, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = c.querySelector("[data-ln-confirm-idle]"), this.activeEl = c.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = c.textContent.trim(), this.confirmText = c.getAttribute(t) || "Confirm?");
    const i = this;
    return this._onClick = function(f) {
      if (!ze(f))
        if (!i.confirming)
          f.preventDefault(), f.stopImmediatePropagation(), i._enterConfirm();
        else {
          if (i._submitted) return;
          i._submitted = !0, f.stopPropagation(), i._reset();
        }
    }, c.addEventListener("click", this._onClick), this;
  }
  u.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const c = this.activeEl ? this.activeEl.textContent.trim() : "";
      c && (this.dom.setAttribute("aria-label", c), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = c.getAttribute("href"), c.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, u.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const c = this, i = l(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      c._reset();
    }, i);
  }, u.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalIconHref && c.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], S(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, F(t, e, u, "ln-confirm");
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const d = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function h(l) {
    this.dom = l, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = l.getAttribute("data-ln-translations-default") || "", this.placeholderLabel = l.getAttribute("data-ln-translations-placeholder") || "{lang} translation", this.removeLabel = l.getAttribute("data-ln-translations-remove-label") || "Remove {lang}", this.badgesEl = l.querySelector("[data-ln-translations-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const u = l.getAttribute("data-ln-translations-locales");
    if (this.locales = d, u)
      try {
        this.locales = JSON.parse(u);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const c = this;
    return this._onRequestAdd = function(i) {
      i.detail && i.detail.lang && c.addLanguage(i.detail.lang);
    }, this._onRequestRemove = function(i) {
      i.detail && i.detail.lang && c.removeLanguage(i.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  h.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of l) {
      const c = u.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const i of c)
        i.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, h.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of l) {
      const c = u.getAttribute("data-ln-translatable-lang");
      c && c !== this.defaultLang && this.activeLanguages.add(c);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, h.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let u = 0;
    for (const i in this.locales) {
      if (!this.locales.hasOwnProperty(i) || this.activeLanguages.has(i)) continue;
      u++;
      const f = Ut("ln-translations-menu-item", "ln-translations");
      if (!f) return;
      const p = f.querySelector("[data-ln-translations-lang]");
      p.setAttribute("data-ln-translations-lang", i), p.textContent = this.locales[i], p.addEventListener("click", function(y) {
        y.ctrlKey || y.metaKey || y.button === 1 || (y.preventDefault(), y.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(i));
      }), this.menuEl.appendChild(f);
    }
    const c = this.dom.querySelector("[data-ln-translations-add]");
    c && (c.hidden = u === 0);
  }, h.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(u) {
      const c = Ut("ln-translations-badge", "ln-translations");
      if (!c) return;
      const i = c.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", u);
      const f = i.querySelector("span");
      f.textContent = l.locales[u] || u.toUpperCase();
      const p = i.querySelector("button"), y = l.locales[u] || u.toUpperCase();
      p.setAttribute("aria-label", l.removeLabel.replace("{lang}", y)), p.addEventListener("click", function(m) {
        m.ctrlKey || m.metaKey || m.button === 1 || (m.preventDefault(), m.stopPropagation(), l.removeLanguage(u));
      }), l.badgesEl.appendChild(c);
    });
  }, h.prototype.addLanguage = function(l, u) {
    if (this.activeLanguages.has(l)) return;
    const c = this.locales[l] || l;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: c
    }).defaultPrevented) return;
    this.activeLanguages.add(l), u = u || {};
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of f) {
      const y = p.getAttribute("data-ln-translatable"), m = p.getAttribute("data-ln-translations-prefix") || "", _ = p.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!_) continue;
      const g = _.cloneNode(_.tagName === "SELECT");
      m ? g.name = m + "[trans][" + l + "][" + y + "]" : g.name = "trans[" + l + "][" + y + "]", g.value = u[y] !== void 0 ? u[y] : "", g.removeAttribute("id"), "placeholder" in g && (g.placeholder = this.placeholderLabel.replace("{lang}", c)), g.setAttribute("data-ln-translatable-lang", l);
      const r = p.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = r.length > 0 ? r[r.length - 1] : _;
      a.parentNode.insertBefore(g, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: c
    });
  }, h.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const c = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const i of c)
      i.parentNode.removeChild(i);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, h.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, h.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const l = this.defaultLang, u = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of u)
      c.getAttribute("data-ln-translatable-lang") !== l && c.parentNode.removeChild(c);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, F(t, e, h, "ln-translations");
})();
const Hi = "ln-autosave:", Ui = 1e3;
function zi(t, e) {
  return e ? Hi + (t || "") + ":" + e : null;
}
function Ki(t, e = Ui) {
  if (t == null) return 0;
  if (t === "") return e;
  const d = parseInt(String(t), 10);
  return isNaN(d) || d < 0 ? e : d;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", d = "data-ln-autosave-clear", h = "data-ln-autosave-debounce-input", l = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  function u(i) {
    const f = i.tagName;
    return f === "INPUT" || f === "TEXTAREA" || f === "SELECT";
  }
  function c(i) {
    const p = i.getAttribute(t) || i.id, y = zi(window.location.pathname, p);
    if (!y) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", i);
      return;
    }
    this.dom = i, this.key = y;
    let m = null;
    function _() {
      const n = je(i, { exclude: l });
      try {
        localStorage.setItem(y, JSON.stringify(n));
      } catch {
        return;
      }
      S(i, "ln-autosave:saved", { target: i, data: n });
    }
    function g() {
      let n;
      try {
        n = localStorage.getItem(y);
      } catch {
        return;
      }
      if (!n) return;
      let o;
      try {
        o = JSON.parse(n);
      } catch {
        return;
      }
      if (G(i, "ln-autosave:before-restore", { target: i, data: o }).defaultPrevented) return;
      const b = Ve(i, o);
      for (let v = 0; v < b.length; v++)
        b[v].dispatchEvent(new Event("input", { bubbles: !0 })), b[v].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(i, "ln-autosave:restored", { target: i, data: o });
    }
    function r() {
      try {
        localStorage.removeItem(y);
      } catch {
        return;
      }
      S(i, "ln-autosave:cleared", { target: i });
    }
    this._onFocusout = function(n) {
      const o = n.target;
      u(o) && o.name && !o.matches(l) && _();
    }, this._onChange = function(n) {
      const o = n.target;
      u(o) && o.name && !o.matches(l) && _();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(n) {
      n.target.closest("[" + d + "]") && r();
    }, i.addEventListener("focusout", this._onFocusout), i.addEventListener("change", this._onChange), i.addEventListener("submit", this._onSubmit), i.addEventListener("reset", this._onReset), i.addEventListener("click", this._onClearClick);
    const a = Ki(i.getAttribute(h));
    return a > 0 && (this._onInput = function(n) {
      const o = n.target;
      !u(o) || !o.name || o.matches(l) || (m !== null && clearTimeout(m), m = setTimeout(_, a));
    }, i.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return m;
    }, g(), this;
  }
  c.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const i = this._getInputTimer();
        i !== null && clearTimeout(i);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, F(t, e, c, "ln-autosave");
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  function d(h) {
    if (h.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", h.tagName), this;
    this.dom = h;
    const l = this;
    return this._onInput = function() {
      l._resize();
    }, h.addEventListener("input", this._onInput), this._resize(), this;
  }
  d.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, F(t, e, d, "ln-autoresize");
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const d = {
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
  }, h = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, l = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, u = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let c = 0;
  function i(n) {
    return !!(h[n] || l[n] || u[n] || n === "link");
  }
  function f(n) {
    this.dom = n;
    const o = this;
    if (this._textarea = n.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", n), this;
    const s = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), s && this._surface.setAttribute("data-placeholder", s);
    const b = this._textarea.id;
    if (b) {
      const C = n.querySelector('label[for="' + b + '"]');
      C && (C.id || (C.id = b + "-label"), this._surface.setAttribute("aria-labelledby", C.id));
    }
    this._surface.id = b ? b + "-surface" : "ln-editor-surface-" + ++c;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const w = n.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? n.insertBefore(this._surface, w.nextSibling) : n.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const C = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < C.length; L++) {
        const q = C[L].getAttribute("data-ln-editor-action");
        i(q) && C[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      });
    }, this._onMousedownToolbar = function(C) {
      C.target.closest("[data-ln-editor-action]") && C.preventDefault();
    }, this._onClickToolbar = function(C) {
      const L = C.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const q = L.getAttribute("data-ln-editor-action");
      o._execAction(q);
    }, this._onPaste = function(C) {
      m(o, C);
    }, this._onKeydown = function(C) {
      r(o, C);
    }, this._onSelectionChange = function() {
      document.contains(o._surface) && o._updateActiveStates();
    }, this._onFocus = function() {
      S(o.dom, "ln-editor:focus", { target: o.dom });
    }, this._onBlur = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:blur", { target: o.dom });
    }, this._onTextareaInput = function() {
      o._surface.innerHTML !== o._textarea.value && (o._surface.innerHTML = o._textarea.value, S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(C) {
      const L = C.detail && C.detail.html;
      L !== void 0 && (o._surface.innerHTML = L, o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, n.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        o._surface.innerHTML = o._textarea.value, S(n, "ln-editor:changed", {
          html: o._textarea.value,
          target: n
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  f.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, f.prototype._execAction = function(n) {
    if (!(!n || G(this.dom, "ln-editor:before-change", {
      action: n,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), h[n])
        document.execCommand(h[n], !1, null);
      else if (l[n]) {
        const s = l[n], b = p(this._surface);
        b && b.toLowerCase() === s ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + s + ">");
      } else u[n] ? document.execCommand(u[n], !1, null) : n === "link" ? a(this) : n === "unlink" ? document.execCommand("unlink", !1, null) : n === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, f.prototype._updateActiveStates = function() {
    const n = this.dom.querySelector('[role="toolbar"]');
    if (!n) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const s = o.anchorNode;
    if (!s || !this._surface.contains(s)) return;
    const b = n.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < b.length; v++) {
      const w = b[v], A = w.getAttribute("data-ln-editor-action");
      let C = !1;
      if (h[A])
        try {
          C = document.queryCommandState(h[A]);
        } catch {
        }
      else if (l[A]) {
        const L = p(this._surface);
        C = L && L.toLowerCase() === l[A];
      } else if (u[A])
        try {
          C = document.queryCommandState(u[A]);
        } catch {
        }
      else A === "link" && (C = !!y(o.anchorNode, "A", this._surface));
      i(A) && w.setAttribute("aria-pressed", String(C)), C ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, f.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, f.prototype.setHTML = function(n) {
    this._surface && (this._surface.innerHTML = n, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const n = this.dom.querySelector('[role="toolbar"]');
    n && (n.removeEventListener("mousedown", this._onMousedownToolbar), n.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const o = this._textarea ? this._textarea.form : null;
    if (o && this._onFormReset && o.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const s = this.dom.querySelector(".ln-editor__link-popover");
      s && s.remove();
    }
    S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function p(n) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return null;
    let s = o.anchorNode;
    if (!s) return null;
    for (; s && s !== n; ) {
      if (s.nodeType === 1) {
        const b = s.tagName;
        if (b === "H2" || b === "H3" || b === "H4" || b === "BLOCKQUOTE" || b === "PRE" || b === "P")
          return b;
      }
      s = s.parentNode;
    }
    return null;
  }
  function y(n, o, s) {
    for (; n && n !== s; ) {
      if (n.nodeType === 1 && n.tagName === o)
        return n;
      n = n.parentNode;
    }
    return null;
  }
  function m(n, o) {
    o.preventDefault();
    let s = "";
    if (o.clipboardData && (s = o.clipboardData.getData("text/html"), !s)) {
      const v = o.clipboardData.getData("text/plain");
      v && (s = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), s = "<p>" + s + "</p>");
    }
    if (!s) return;
    const b = _(s);
    b && document.execCommand("insertHTML", !1, b);
  }
  function _(n) {
    const o = document.createElement("div");
    return o.innerHTML = n, g(o), o.innerHTML;
  }
  function g(n) {
    const o = Array.from(n.childNodes);
    for (let s = 0; s < o.length; s++) {
      const b = o[s];
      if (b.nodeType !== 3) {
        if (b.nodeType !== 1) {
          n.removeChild(b);
          continue;
        }
        if (d[b.tagName]) {
          const v = Array.from(b.attributes);
          for (let w = 0; w < v.length; w++) {
            const A = v[w].name;
            if (b.tagName === "A" && A === "href") {
              const C = b.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(C) || b.removeAttribute("href");
            } else
              b.removeAttribute(A);
          }
          b.tagName === "A" && b.setAttribute("rel", "noopener noreferrer"), g(b);
        } else {
          for (; b.firstChild; )
            n.insertBefore(b.firstChild, b);
          n.removeChild(b);
        }
      }
    }
  }
  function r(n, o) {
    if (!(o.ctrlKey || o.metaKey)) return;
    let s = null;
    switch (o.key.toLowerCase()) {
      case "b":
        s = "bold";
        break;
      case "i":
        s = "italic";
        break;
      case "u":
        s = "underline";
        break;
      case "k":
        s = "link";
        break;
    }
    s && (o.preventDefault(), n._execAction(s));
  }
  function a(n) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const s = y(o.anchorNode, "A", n._surface), b = o.getRangeAt(0).cloneRange();
    n._closeLinkPopover && n._closeLinkPopover();
    const v = pt(n.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const w = v.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), C = w.querySelector('[data-ln-editor-action="confirm-link"]'), L = w.querySelector('[data-ln-editor-action="cancel-link"]');
    s && (A.value = s.getAttribute("href") || "");
    const q = n.dom.querySelector('[role="toolbar"]');
    q ? q.after(w) : n.dom.insertBefore(w, n._surface), A.focus();
    function x() {
      const H = window.getSelection();
      H.removeAllRanges(), H.addRange(b);
    }
    function R() {
      document.removeEventListener("mousedown", K), n._closeLinkPopover = null, w.remove();
    }
    function M() {
      const H = A.value.trim();
      if (R(), x(), n._surface.focus(), H)
        if (s)
          s.setAttribute("href", H), s.setAttribute("rel", "noopener noreferrer"), n._syncToTextarea(), S(n.dom, "ln-editor:changed", {
            html: n._textarea.value,
            target: n.dom
          });
        else {
          document.execCommand("createLink", !1, H);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const z = y(U.anchorNode, "A", n._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), n._syncToTextarea());
          }
        }
      else s && document.execCommand("unlink", !1, null);
    }
    function N() {
      R(), x(), n._surface.focus();
    }
    function B() {
      R();
    }
    function K(H) {
      const U = n.dom.contains(H.target) && H.target.closest('[data-ln-editor-action="link"]');
      !w.contains(H.target) && !U && B();
    }
    n._closeLinkPopover = R, C.addEventListener("click", M), L.addEventListener("click", N), A.addEventListener("keydown", function(H) {
      H.key === "Enter" ? (H.preventDefault(), M()) : H.key === "Escape" && (H.preventDefault(), N());
    }), document.addEventListener("mousedown", K);
  }
  F(t, e, f, "ln-editor");
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function d(l) {
    const u = {}, c = l.dataset;
    for (const i in c) {
      if (!i.startsWith("lnFill") || e[i]) continue;
      const f = i.slice(6);
      f && (u[f.charAt(0).toLowerCase() + f.slice(1)] = c[i]);
    }
    return u;
  }
  function h(l, u) {
    const c = window.CSS && CSS.escape ? CSS.escape(u) : u, i = document.querySelectorAll('[data-ln-fill-id="' + c + '"]');
    if (i.length === 0) return null;
    for (let f = 0; f < i.length; f++) {
      const p = i[f].getAttribute("data-ln-fill-form");
      if (p) {
        const y = document.getElementById(p);
        if (y && l.contains(y)) return i[f];
      }
    }
    return i[0];
  }
  document.addEventListener("click", function(l) {
    if (l.ctrlKey || l.metaKey || l.button === 1) return;
    const u = l.target.closest("[data-ln-fill-form]");
    if (!u) return;
    const c = u.getAttribute("href");
    if (c && c.indexOf("#") !== -1) return;
    const i = u.getAttribute("data-ln-fill-form"), f = document.getElementById(i);
    if (!f) return;
    const p = d(u), y = Object.keys(p).length > 0;
    window.lnCore.lnFill(f, y ? p : null);
  }), document.addEventListener("ln-fill:request", function(l) {
    const u = l.detail;
    if (!u) return;
    const c = l.target, i = u.id;
    if (i == null) {
      window.lnCore.lnFill(c, null);
      return;
    }
    const f = h(c, i);
    if (!f) return;
    const p = d(f);
    window.lnCore.lnFill(c, p);
  }), window[t] = !0;
})();
function ji(t, e = "-") {
  if (t == null) return "";
  const d = e || "-", h = d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, d).replace(new RegExp(`${h}+`, "g"), d).replace(new RegExp(`^${h}+|${h}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  function d(h) {
    if (h.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", h.tagName), this;
    const l = h.form;
    if (!l)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", h), this;
    const u = h.getAttribute(t), c = l.elements[u];
    if (!c)
      return console.warn('[ln-slug] Source field "' + u + '" not found in form:', h), this;
    if (typeof c.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + u + '" is a RadioNodeList (same-name group) — single source field required:', h), this;
    this.dom = h, this.source = c, this._pristine = h.value === "", this._mirroring = !1;
    const i = this;
    return this._onSource = function() {
      i._pristine && i._mirror();
    }, this._onSlug = function() {
      i._mirroring || (i._pristine = i.dom.value === "");
    }, c.addEventListener("input", this._onSource), h.addEventListener("input", this._onSlug), this._pristine && c.value && c.value.trim() !== "" && this._mirror(), this;
  }
  d.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = ji(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, F(t, e, d, "ln-slug");
})();
function Vi(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const d = typeof e == "number" ? e : e.getTime(), h = t.getTime(), l = Math.floor((h - d) / 1e3), u = Math.abs(l);
  return u < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : u < 60 ? { value: l, unit: "second", isOlderThanMonth: !1 } : u < 3600 ? { value: Math.round(l / 60), unit: "minute", isOlderThanMonth: !1 } : u < 86400 ? { value: Math.round(l / 3600), unit: "hour", isOlderThanMonth: !1 } : u < 604800 ? { value: Math.round(l / 86400), unit: "day", isOlderThanMonth: !1 } : u < 2592e3 ? { value: Math.round(l / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(l / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Nt(t, e, d = /* @__PURE__ */ new Date()) {
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
      return e && e.getFullYear() !== d.getFullYear() && (h.year = "numeric"), h;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const d = {}, h = {};
  function l(w) {
    return w.getAttribute("data-ln-time-locale") || W(w);
  }
  function u(w, A) {
    const C = (w || "") + "|" + JSON.stringify(A);
    return d[C] || (d[C] = new Intl.DateTimeFormat(w, A)), d[C];
  }
  function c(w) {
    const A = w || "";
    return h[A] || (h[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), h[A];
  }
  const i = /* @__PURE__ */ new Set();
  let f = null;
  function p() {
    f || (f = setInterval(m, 6e4));
  }
  function y() {
    f && (clearInterval(f), f = null);
  }
  function m() {
    for (const w of i) {
      if (!document.body.contains(w.dom)) {
        i.delete(w);
        continue;
      }
      o(w);
    }
    i.size === 0 && y();
  }
  function _(w, A) {
    const C = _t(A), L = (A || "").toLowerCase().split("-")[0], q = u(A, Nt("full", w)), x = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && x !== L && C.monthsLong) {
      const R = C.monthsLong[w.getMonth()], M = w.getDate(), N = w.getFullYear(), B = String(w.getHours()).padStart(2, "0"), K = String(w.getMinutes()).padStart(2, "0");
      return `${M} ${R} ${N} во ${B}:${K}`;
    }
    return q.format(w);
  }
  function g(w, A) {
    const C = Nt("short", w), L = _t(A), q = (A || "").toLowerCase().split("-")[0], x = u(A, C), R = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && R !== q && L.monthsShort) {
      const M = L.monthsShort[w.getMonth()], N = w.getDate(), B = C.year ? " " + w.getFullYear() : "";
      return `${N} ${M}${B}`;
    }
    return x.format(w);
  }
  function r(w, A) {
    return u(A, Nt("date", w)).format(w);
  }
  function a(w, A) {
    return u(A, Nt("time", w)).format(w);
  }
  function n(w, A) {
    const C = Vi(w);
    return C.isOlderThanMonth ? g(w, A) : c(A).format(C.value, C.unit);
  }
  function o(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const C = Y(A);
    if (!C) return;
    const L = w.dom.getAttribute(t) || "short", q = l(w.dom);
    let x;
    switch (L) {
      case "relative":
        x = n(C, q);
        break;
      case "full":
        x = _(C, q);
        break;
      case "date":
        x = r(C, q);
        break;
      case "time":
        x = a(C, q);
        break;
      default:
        x = g(C, q);
        break;
    }
    w.dom.textContent = x, L !== "full" && (w.dom.title = _(C, q));
  }
  function s(w) {
    this.dom = w;
    const A = this;
    return this._onLocaleChange = function() {
      o(A);
    }, Gt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), o(this), w.getAttribute(t) === "relative" && (i.add(this), p()), this;
  }
  s.prototype.render = function() {
    o(this);
  }, s.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), i.delete(this), i.size === 0 && y(), delete this.dom[e];
  };
  function b(w) {
    const A = w[e];
    if (!A) return;
    w.getAttribute(t) === "relative" ? (i.add(A), p()) : (i.delete(A), i.size === 0 && y()), o(A);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(t) && w[e] && o(w[e]);
  }
  F(t, e, s, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: b,
    onInit: v
  });
})();
function Wi(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, d = t.pageSize > 0 ? t.pageSize : 200, h = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const l = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, u = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let i = 0, f = 0, p = 0, y = !1, m = null;
  function _(a, n) {
    u.delete(a), u.set(a, n);
  }
  function g() {
    if (u.size <= e) return [];
    const a = [];
    for (; u.size > e; ) {
      const o = u.keys().next().value;
      a.push(u.get(o)), u.delete(o);
    }
    const n = new Set(u.values());
    return a.filter((o) => !n.has(o));
  }
  function r(a, n) {
    c.add(a), clearTimeout(m), m = setTimeout(() => l(a, d, n), h);
  }
  return {
    get logicalTotal() {
      return i;
    },
    set logicalTotal(a) {
      i = a;
    },
    get grandTotal() {
      return f;
    },
    set grandTotal(a) {
      f = a;
    },
    get queryGen() {
      return p;
    },
    set queryGen(a) {
      p = a;
    },
    get size() {
      return u.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return y;
    },
    getId: (a) => {
      if (!u.has(a)) return;
      const n = u.get(a);
      return _(a, n), n;
    },
    ensure: (a, n, o) => {
      if (!y && !c.has(0)) return r(0, o);
      if (i <= 0) return;
      const s = Math.max(0, a), b = Math.min(i, n);
      for (let v = s; v < b; v++)
        if (!u.has(v)) {
          const w = Math.floor(v / d) * d;
          if (!c.has(w)) return r(w, o);
        }
    },
    ingest: (a, n, o, s, b) => {
      if (b != null && b !== p) return [];
      y = !0, o != null && (f = o), s != null && (i = s);
      for (let v = 0; v < n.length; v++)
        _(a + v, n[v]);
      return c.delete(a), g();
    },
    reset: function() {
      p++, this.clear();
    },
    clear: () => {
      y = !1, u.clear(), c.clear(), clearTimeout(m);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (a = {}) => {
      let n = [];
      return a.windowSize > 0 && a.windowSize !== e && (e = a.windowSize, n = g()), a.pageSize > 0 && (d = a.pageSize), a.fetchDebounce >= 0 && (h = a.fetchDebounce), n;
    }
  };
}
function Gi(t, e, d) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: h, direction: l } = e, u = l === "desc", c = t.map((f) => f ? f[h] : void 0), i = ue(c);
  return [...t].sort((f, p) => {
    const y = f ? f[h] : void 0, m = p ? p[h] : void 0, _ = he(y, m, i, d);
    return u ? -_ : _;
  });
}
function Sn(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const d = Object.keys(e).filter((h) => Array.isArray(e[h]) && e[h].length > 0);
  return d.length ? t.filter((h) => h ? d.every((l) => _e(h[l], e[l])) : !1) : t;
}
function $i(t, e, d) {
  if (!Array.isArray(t) || !e || !d || !d.length) return t;
  const h = dn(e);
  return h.length ? t.filter((l) => l ? h.every(
    (u) => d.some((c) => {
      const i = l[c];
      return i != null && un(String(i), [u]);
    })
  ) : !1) : t;
}
function Qi(t, e, d) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (d === "count") return t.length;
  const h = t.map((u) => u && u[e] != null ? parseFloat(u[e]) : NaN).filter((u) => Number.isFinite(u)), l = h.reduce((u, c) => u + c, 0);
  return d === "sum" ? l : d === "avg" && h.length ? l / h.length : 0;
}
function Xi(t, e = {}, d = [], h) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const l = t.length;
  let u = t;
  e.filters && (u = Sn(u, e.filters)), e.search && (u = $i(u, e.search, d));
  const c = u.length;
  if (e.sort && (u = Gi(u, e.sort, h)), e.offset || e.limit) {
    const i = e.offset || 0, f = e.limit || u.length;
    u = u.slice(i, i + f);
  }
  return { records: u, total: l, filtered: c };
}
function Yi(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((d) => {
    if (!d) return null;
    const h = { ...d };
    for (const [l, u] of Object.entries(e))
      if (typeof u == "function")
        try {
          h[l] = u(d);
        } catch {
          h[l] = void 0;
        }
    return h;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore", d = "data-ln-data-store-no-local-query";
  if (window[e] !== void 0) return;
  const h = "ln_app_cache", l = "_meta", u = "1.0";
  let c = null, i = null;
  const f = {};
  function p(E) {
    E && E.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: E });
  }
  function y() {
    const E = {};
    for (const T of document.querySelectorAll(`[${t}]`)) {
      const k = T.id;
      if (k) {
        const I = T.getAttribute("data-ln-data-store-indexes") || "";
        E[k] = {
          indexes: I.split(",").map((D) => D.trim()).filter(Boolean)
        };
      }
    }
    return E;
  }
  function m() {
    return i || (i = new Promise((E) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), E(null);
      const T = y(), k = Object.keys(T), I = indexedDB.open(h);
      I.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), E(null);
      }, I.onsuccess = (D) => {
        const O = D.target.result, P = Array.from(O.objectStoreNames);
        if (!(!P.includes(l) || k.some((rt) => !P.includes(rt))))
          return _(O), c = O, E(O);
        const V = O.version;
        O.close();
        const $ = indexedDB.open(h, V + 1);
        $.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, $.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), E(null);
        }, $.onupgradeneeded = (rt) => {
          const J = rt.target.result;
          J.objectStoreNames.contains(l) || J.createObjectStore(l, { keyPath: "key" });
          for (const mt of k)
            if (!J.objectStoreNames.contains(mt)) {
              const Ct = J.createObjectStore(mt, { keyPath: "id" });
              for (const Yt of T[mt].indexes)
                Ct.createIndex(Yt, Yt, { unique: !1 });
            }
        }, $.onsuccess = (rt) => {
          const J = rt.target.result;
          _(J), c = J, E(J);
        };
      };
    }), i);
  }
  function _(E) {
    E.onversionchange = () => {
      E.close(), c = null, i = null;
    };
  }
  function g() {
    return c ? Promise.resolve(c) : (i = null, m());
  }
  async function r(E) {
    if (!ut() || !E) return E;
    const T = { ...E }, k = T.id, I = await Zn(T);
    return !I || !I.encrypted ? E : {
      id: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function a(E) {
    return !E || !E.encrypted || !ut() ? E : ti(E);
  }
  const n = (E, T) => g().then((k) => k ? k.transaction(E, T).objectStore(E) : null);
  function o(E) {
    return new Promise((T, k) => {
      E.onsuccess = () => T(E.result), E.onerror = () => {
        p(E.error), k(E.error);
      };
    });
  }
  const s = (E) => n(E, "readonly").then((T) => T ? o(T.getAll()) : []).then((T) => ut() ? Promise.all(T.map((k) => a(k))) : T), b = (E, T) => n(E, "readonly").then((k) => k ? o(k.get(T)) : null).then((k) => k ? a(k) : null), v = (E, T) => g().then((k) => {
    if (!k) return [];
    const D = k.transaction(E, "readonly").objectStore(E), O = T.map((P) => o(D.get(P)));
    return Promise.all(O).then((P) => ut() ? Promise.all(P.map((j) => a(j))) : P);
  }), w = (E, T) => (ut() ? r(T) : Promise.resolve(T)).then((I) => n(E, "readwrite").then((D) => D ? o(D.put(I)) : null)), A = (E, T) => n(E, "readwrite").then((k) => k ? o(k.delete(T)) : null), C = (E) => n(E, "readwrite").then((T) => T ? o(T.clear()) : null), L = (E) => n(E, "readonly").then((T) => T ? o(T.count()) : 0), q = (E) => n(l, "readonly").then((T) => T ? o(T.get(E)) : null), x = (E, T) => n(l, "readwrite").then((k) => {
    if (k)
      return T.key = E, o(k.put(T));
  });
  function R(E, T, k) {
    const I = E.getAttribute(T);
    if (I === "never" || I === "-1") return -1;
    const D = parseInt(I, 10);
    return isNaN(D) ? k : D;
  }
  function M(E) {
    return this.dom = E, this._name = E.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", E), oi(this, E, {
      _staleThreshold: [R, "data-ln-data-store-stale", 300],
      _searchFields: [ri, "data-ln-data-store-search-fields"],
      noLocalQuery: [ii, d],
      _windowSize: [Te, "data-ln-data-store-window", 1e3],
      _windowPageSize: [Te, "data-ln-data-store-window-page", 200]
    }), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, E.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Wi({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (T, k, I) => {
        S(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: T,
          limit: k,
          query: I,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), f[this._name] = this, N(this), this.ready = qn(this), this;
  }
  function N(E) {
    E._handlers = {
      create: (T) => B(E, "create", T.detail, () => H(E, T.detail)),
      update: (T) => B(E, "update", T.detail, () => U(E, T.detail)),
      delete: (T) => B(E, "delete", T.detail, () => z(E, T.detail)),
      "bulk-delete": (T) => B(E, "bulk-delete", T.detail, () => st(E, T.detail)),
      "sync-failed": (T) => {
        E.isSyncing = !1, S(E.dom, "ln-data-store:sync-error", {
          store: E._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, k] of Object.entries(E._handlers))
      E.dom.addEventListener(`ln-data-store:request-${T}`, k);
    E._queryHandlers = {
      "ln-search:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.term != null ? T.detail.term : "";
        k !== E.query.search && (E.query.search = k, Xt(E));
      },
      "ln-filter:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.key;
        if (!k) return;
        const I = (T.detail.values || []).slice(), D = E.query.filters[k];
        (D ? D.length === I.length && D.every((P, j) => P === I[j]) : !I.length) || (I.length ? E.query.filters[k] = I : delete E.query.filters[k], Xt(E));
      },
      "ln-sort:change": (T) => {
        T.preventDefault();
        const k = T.detail && T.detail.field, I = T.detail && T.detail.direction, D = I && I !== "none" ? { field: k, direction: I } : null, O = E.query.sort;
        !O && !D || O && D && O.field === D.field && O.direction === D.direction || (E.query.sort = D, Xt(E));
      }
    };
    for (const [T, k] of Object.entries(E._queryHandlers))
      E.dom.addEventListener(T, k);
  }
  function B(E, T, k, I) {
    const D = k && k.requestId;
    return E._mutationChain = E._mutationChain.then(() => E.ready).then(() => {
      if (E.initializationError) throw E.initializationError;
      return I();
    }).catch((O) => Tn(E, T, D, O)), E._mutationChain;
  }
  function K(E, T = 0) {
    return L(E._name).then((k) => {
      if (E._windowIndex || E.windowed) {
        const I = E.totalCount != null ? E.totalCount : k;
        E.totalCount = Math.max(0, I + T);
      } else
        E.totalCount = k;
      return E.hasCache = !0, E.isLoaded = !0, E.canServe = !0, x(E._name, {
        schema_version: u,
        last_synced_at: E.lastSyncedAt,
        has_cache: !0,
        record_count: E.totalCount
      });
    });
  }
  function H(E, { tempId: T, data: k = {}, requestId: I } = {}) {
    const D = { ...k, id: T };
    return w(E._name, D).then(() => K(E, 1)).then(() => {
      S(E.dom, "ln-data-store:created", { store: E._name, record: D, tempId: T, requestId: I });
    });
  }
  function U(E, { id: T, data: k = {}, requestId: I } = {}) {
    return b(E._name, T).then((D) => {
      if (!D) throw new Error(`Record not found: ${T}`);
      const O = { ...D, ...k }, P = k.id;
      return (P !== void 0 && P !== T ? xn(E._name, T, O) : w(E._name, O)).then(() => K(E, 0)).then(() => {
        S(E.dom, "ln-data-store:updated", { store: E._name, record: O, previous: D, requestId: I });
      });
    });
  }
  function z(E, { id: T, requestId: k } = {}) {
    return b(E._name, T).then((I) => {
      if (!I) {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k, missing: !0 });
        return;
      }
      return A(E._name, T).then(() => K(E, -1)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: T, requestId: k });
      });
    });
  }
  function st(E, { ids: T = [], requestId: k } = {}) {
    return T.length ? Promise.all(T.map((I) => b(E._name, I))).then((I) => {
      const D = I.filter(Boolean).map((O) => O.id);
      return Rt(E._name, D).then(() => K(E, -D.length)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, ids: D, requestId: k });
      });
    }) : (S(E.dom, "ln-data-store:deleted", { store: E._name, ids: [], requestId: k }), Promise.resolve());
  }
  function Tn(E, T, k, I) {
    console.error("[ln-data-store] " + T + " failed:", I), S(E.dom, "ln-data-store:mutation-error", {
      store: E._name,
      action: T,
      requestId: k,
      error: I
    });
  }
  function qn(E) {
    return m().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return q(E._name);
    }).then((T) => {
      if (E.initializationError = null, T && T.schema_version === u)
        E.lastSyncedAt = T.last_synced_at || null, E.totalCount = T.record_count || 0, E.hasCache = T.has_cache === !0 || E.totalCount > 0, E.hasCache && (E.isLoaded = !0, E.canServe = !0, S(E.dom, "ln-data-store:ready", { store: E._name, count: E.totalCount, source: "cache" })), E.isInitialized = !0, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: E.hasCache, lastSyncedAt: E.lastSyncedAt, count: E.totalCount });
      else {
        if (T && T.schema_version !== u)
          return C(E._name).then(() => x(E._name, { schema_version: u, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (E.isInitialized = !0, E.isLoaded = !1, E.canServe = !1, E.hasCache = !1, E.isSyncing = !1, E.initializationError = T, S(E.dom, "ln-data-store:initialization-error", { store: E._name, error: T }), { ok: !1, error: T }));
  }
  function ve(E) {
    E.isSyncing = !0, S(E.dom, "ln-data-store:request-remote-sync", { since: E.lastSyncedAt });
  }
  function we(E, T) {
    return g().then((k) => k ? (ut() ? Promise.all(T.map((D) => r(D))) : Promise.resolve(T)).then((D) => new Promise((O, P) => {
      const j = k.transaction(E, "readwrite"), V = j.objectStore(E);
      D.forEach(($) => V.put($)), j.oncomplete = () => O(), j.onerror = () => {
        p(j.error), P(j.error);
      };
    })) : void 0);
  }
  function Rt(E, T) {
    return g().then((k) => {
      if (k)
        return new Promise((I, D) => {
          const O = k.transaction(E, "readwrite"), P = O.objectStore(E);
          T.forEach((j) => P.delete(j)), O.oncomplete = () => I(), O.onerror = () => D(O.error);
        });
    });
  }
  function xn(E, T, k) {
    return (ut() ? r(k) : Promise.resolve(k)).then((D) => g().then((O) => {
      if (O)
        return new Promise((P, j) => {
          const V = O.transaction(E, "readwrite"), $ = V.objectStore(E);
          $.put(D), $.delete(T), V.oncomplete = () => P(), V.onerror = () => {
            p(V.error), j(V.error);
          };
        });
    }));
  }
  const kn = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function In(E) {
    return E ? Object.keys(E).filter((T) => Array.isArray(E[T]) && E[T].length > 0) : [];
  }
  function Dn(E, T, k) {
    return T.every((I) => k[I].map(String).includes(String(E[I])));
  }
  function Rn(E) {
    return String(E || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function On(E, T, k) {
    return T.every(
      (I) => k.some((D) => {
        const O = E[D];
        return O != null && String(O).toLowerCase().includes(I);
      })
    );
  }
  function Mn(E, T, k) {
    return Qi(E, T, k);
  }
  function St(E, T) {
    return Yi(T, E.presenters && E.presenters.computed);
  }
  function Fn(E) {
    return !E.sort && !ut();
  }
  function Nn(E, T, k) {
    const I = In(T.filters), D = T.search ? Rn(T.search) : [], O = E._searchFields, P = D.length > 0 && O && O.length > 0;
    return n(E._name, "readonly").then((j) => j ? new Promise((V, $) => {
      const rt = [], J = j.openCursor();
      J.onsuccess = () => {
        const mt = J.result;
        if (!mt || rt.length >= k) {
          V(rt);
          return;
        }
        const Ct = mt.value;
        (!I.length || Dn(Ct, I, T.filters)) && (!P || On(Ct, D, O)) && rt.push(Ct), mt.continue();
      }, J.onerror = () => $(J.error);
    }) : []);
  }
  function Ee(E, T, k) {
    return Xi(T, k, E._searchFields, kn);
  }
  function Ae(E, T, k) {
    const I = [];
    for (let O = T; O < T + k; O++) {
      const P = E._windowIndex.getId(O);
      I.push(P);
    }
    const D = Array.from(new Set(I.filter((O) => O !== void 0)));
    return v(E._name, D).then((O) => {
      const P = /* @__PURE__ */ new Map();
      for (let V = 0; V < O.length; V++) {
        const $ = O[V];
        $ && P.set(String($.id), $);
      }
      const j = [];
      for (let V = 0; V < I.length; V++) {
        const $ = I[V];
        if ($ === void 0)
          j.push(null);
        else {
          const rt = P.get(String($));
          j.push(rt || null);
        }
      }
      return {
        data: St(E, j),
        total: E._windowIndex.grandTotal,
        filtered: E._windowIndex.logicalTotal,
        offset: T,
        queryGen: E._windowIndex.queryGen
      };
    });
  }
  M.prototype.getAll = function(E = {}) {
    const T = this;
    if (T._windowIndex) {
      const k = E.offset || 0, I = E.limit || 200;
      if (T._windowIndex.ensure(k, k + I, E), !T._windowIndex.hasLoaded && !T.noLocalQuery) {
        const D = k + I, O = (P) => P.length ? {
          data: St(T, P),
          offset: k,
          queryGen: T._windowIndex.queryGen,
          provisional: !0
        } : Ae(T, k, I);
        return Fn(E) ? Nn(T, E, D).then((P) => O(P.slice(k, D))) : s(T._name).then((P) => O(Ee(T, P, E).records));
      }
      return Ae(T, k, I);
    }
    return s(T._name).then((k) => {
      const I = Ee(T, k, E);
      return {
        data: St(T, I.records),
        total: I.total,
        filtered: I.filtered
      };
    });
  }, M.prototype.getById = function(E) {
    return b(this._name, E).then((T) => T ? St(this, [T])[0] : null);
  }, M.prototype.count = function(E) {
    return E && Object.keys(E).length > 0 ? s(this._name).then((k) => Sn(k, E).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, M.prototype.aggregate = function(E, T) {
    return s(this._name).then((k) => Mn(k, E, T));
  }, M.prototype.setPresenters = function(E) {
    this.presenters = E;
  }, M.prototype.applySync = function(E, T, k, I) {
    I = I || {};
    const D = this;
    if (D._windowIndex && I.queryGen != null && I.queryGen !== D._windowIndex.queryGen)
      return Promise.resolve();
    E.length > 0 || T.length > 0;
    let O = Promise.resolve();
    return E.length > 0 && (O = O.then(() => we(D._name, E))), T.length > 0 && (O = O.then(() => Rt(D._name, T))), O.then(() => {
      if (D._windowIndex && (I.offset != null || I.total != null)) {
        const P = I.offset != null ? I.offset : 0, j = E.map(($) => $.id), V = D._windowIndex.ingest(P, j, I.total, I.filtered, I.queryGen);
        if (V && V.length) return Rt(D._name, V);
      }
    }).then(() => L(D._name)).then((P) => (D.totalCount = I.total !== void 0 ? I.total : P, D.hasCache = !0, x(D._name, {
      schema_version: u,
      last_synced_at: k,
      has_cache: !0,
      record_count: D.totalCount
    }))).then(() => {
      const P = !D.isLoaded;
      D.isLoaded = !0, D.canServe = !0, D.isSyncing = !1, D.lastSyncedAt = k, P ? (S(D.dom, "ln-data-store:loaded", { store: D._name, count: D.totalCount, meta: I }), S(D.dom, "ln-data-store:ready", { store: D._name, count: D.totalCount, source: "server", meta: I })) : S(D.dom, "ln-data-store:synced", {
        store: D._name,
        added: E.length,
        deleted: T.length,
        changed: !0,
        meta: I
      });
    }).catch((P) => {
      D.isSyncing = !1, console.error("[ln-data-store] applySync failed:", P);
    });
  }, M.prototype.applyQuery = function(E, T) {
    T = T || {};
    const k = this;
    let I = Promise.resolve();
    return E.length > 0 && (I = I.then(() => we(k._name, E))), I.then(() => L(k._name)).then((D) => (k.totalCount = T.total !== void 0 ? T.total : D, E.length > 0 && (k.canServe = !0), St(k, E))).catch((D) => (console.error("[ln-data-store] applyQuery failed:", D), []));
  }, M.prototype.forceSync = function() {
    this.isSyncing || ve(this);
  }, M.prototype.fullReload = function() {
    const E = this;
    return C(E._name).then(() => x(E._name, {
      schema_version: u,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      E.isLoaded = !1, E.hasCache = !1, E.lastSyncedAt = null, E.totalCount = 0, ve(E);
    });
  }, M.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [E, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${E}`, T);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [E, T] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(E, T);
      this._queryHandlers = null;
    }
    delete f[this._name], delete this.dom[e], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Pn() {
    return g().then((E) => {
      if (!E) return;
      const T = Array.from(E.objectStoreNames);
      return new Promise((k, I) => {
        const D = E.transaction(T, "readwrite");
        T.forEach((O) => D.objectStore(O).clear()), D.oncomplete = () => k(), D.onerror = () => I(D.error);
      });
    }).then(() => {
      Object.values(f).forEach((E) => {
        E.isLoaded = !1, E.canServe = !1, E.isInitialized = !1, E.initializationError = null, E.hasCache = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      });
    });
  }
  function Xt(E) {
    E._windowIndex && E._windowIndex.reset(), S(E.dom, "ln-data-store:query-changed", {
      store: E._name,
      query: {
        filters: Object.assign({}, E.query.filters),
        search: E.query.search,
        sort: E.query.sort ? Object.assign({}, E.query.sort) : null
      }
    });
  }
  const Bn = "data-ln-data-store-frozen";
  function Se(E, T) {
    E.setAttribute(Bn, T);
  }
  function Hn(E) {
    const T = E[e];
    if (!T._windowIndex) return;
    const k = T._windowIndex.configure({ windowSize: T._windowSize });
    k.length && Rt(T._name, k).catch((I) => {
      console.error("[ln-data-store] window shrink eviction failed:", I);
    });
  }
  F(t, e, M, "ln-data-store", {
    effects: {
      "data-ln-data-store-window": Hn,
      "data-ln-data-store-window-page": (E) => {
        const T = E[e];
        T._windowIndex && T._windowIndex.configure({ pageSize: T._windowPageSize });
      },
      "data-ln-data-store-indexes": Se,
      "data-ln-data-store": Se
    }
  }), window[e].clearAll = Pn, window[e].init = window[e], window[e].setStorageKey = Le, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Le);
})();
const Ji = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function gt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, d) => {
    const h = String(e);
    return d === 0 ? h.replace(/\/+$/, "") : h.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Zi(t, e) {
  if (!t || typeof t != "object") return "";
  const d = Object.assign({}, Ji);
  if (e && typeof e == "object")
    for (const l in e)
      e[l] !== void 0 && e[l] !== null && e[l] !== "" && (d[l] = e[l]);
  const h = new URLSearchParams();
  return t.search && h.append(d.search, t.search), t.offset != null && h.append(d.offset, t.offset), t.limit != null && h.append(d.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (h.append(d.sortField, t.sort.field), h.append(d.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((l) => {
    const u = t.filters[l];
    Array.isArray(u) && u.length > 0 && h.append(l, u.join(","));
  }), h.toString();
}
function tr(t, e, d) {
  let h = gt(t, e);
  return d && (h += (h.indexOf("?") !== -1 ? "&" : "?") + d), h;
}
function Ne(t) {
  const e = t && t.content !== void 0 ? t.content : t, d = t && t.message ? t.message : null;
  return { record: e, message: d };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", d = "lnConnector";
  if (window[e] !== void 0) return;
  function h(i) {
    return i.ok ? i.status === 204 ? null : i.json() : i.json().catch(() => null).then((f) => {
      const p = new Error("HTTP " + i.status + ": " + i.statusText);
      throw p.status = i.status, p.data = f, p;
    });
  }
  function l(i) {
    return this.dom = i, i[e] = this, i[d] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, u(this), this;
  }
  l.prototype.refreshConfig = function() {
    const i = this.dom;
    this.baseUrl = i.getAttribute("data-ln-api-base-url") || "", this.path = i.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = i.getAttribute("data-ln-api-headers"), this.headers = Je(this.rawHeaders);
    const f = {}, p = i.getAttribute("data-ln-api-param-offset");
    p && (f.offset = p);
    const y = i.getAttribute("data-ln-api-param-limit");
    y && (f.limit = y);
    const m = i.getAttribute("data-ln-api-param-search");
    m && (f.search = m);
    const _ = i.getAttribute("data-ln-api-param-sort-field");
    _ && (f.sortField = _);
    const g = i.getAttribute("data-ln-api-param-sort-dir");
    g && (f.sortDir = g), this.paramKeys = f;
    const r = i.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = r !== null ? +r : 300, S(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, l.prototype._reqHeaders = function(i) {
    const f = Object.assign({}, this.headers);
    return !f.Accept && !f.accept && (f.Accept = "application/json"), !f["Content-Type"] && !f["content-type"] && (f["Content-Type"] = "application/json"), i && (f["X-Idempotency-Key"] = i), f;
  }, l.prototype.cancel = function(i) {
    return i && this._inflight.has(i) ? (this._inflight.get(i).abort(), this._inflight.delete(i), !0) : !1;
  }, l.prototype.fetchDelta = function(i, f) {
    const p = this;
    let y = gt(p.baseUrl, p.path);
    i != null && i !== "" && (y += (y.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(i));
    const m = f || "sync";
    p._inflight.has(m) && p._inflight.get(m).abort();
    const _ = new AbortController();
    return p._inflight.set(m, _), window.fetch(y, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: _.signal
    }).then(h).finally(function() {
      p._inflight.get(m) === _ && p._inflight.delete(m);
    });
  }, l.prototype.query = function(i, f) {
    const p = this, y = Zi(i, p.paramKeys), m = tr(p.baseUrl, p.path, y), _ = f || "query";
    p._inflight.has(_) && p._inflight.get(_).abort();
    const g = new AbortController();
    return p._inflight.set(_, g), window.fetch(m, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: g.signal
    }).then(h).finally(function() {
      p._inflight.get(_) === g && p._inflight.delete(_);
    });
  }, l.prototype.create = function(i, f, p) {
    const y = this;
    return window.fetch(gt(y.baseUrl, f || y.path), {
      method: "POST",
      headers: y._reqHeaders(p),
      credentials: y.credentials,
      body: JSON.stringify(i)
    }).then(h);
  }, l.prototype.update = function(i, f, p, y, m) {
    const _ = this;
    p != null && (f = Object.assign({}, f, { expected_version: p }));
    const g = y ? gt(_.baseUrl, y) : gt(_.baseUrl, _.path, i);
    return window.fetch(g, {
      method: "PUT",
      headers: _._reqHeaders(m),
      credentials: _.credentials,
      body: JSON.stringify(f)
    }).then(h);
  }, l.prototype.delete = function(i, f, p) {
    const y = this;
    return window.fetch(gt(y.baseUrl, f || y.path, i), {
      method: "DELETE",
      headers: y._reqHeaders(p),
      credentials: y.credentials
    }).then(h);
  }, l.prototype.bulkDelete = function(i, f, p) {
    const y = this;
    return window.fetch(gt(y.baseUrl, f || y.path, "bulk-delete"), {
      method: "DELETE",
      headers: y._reqHeaders(p),
      credentials: y.credentials,
      body: JSON.stringify({ ids: i })
    }).then(h);
  };
  function u(i) {
    i._handlers = {
      sync: function(f) {
        const p = f.detail || {}, y = p.meta && p.meta.targetEl ? p.meta.targetEl : null;
        i.fetchDelta(p.since, y).then(function(m) {
          S(i.dom, "ln-api-connector:fetched", { data: m, since: p.since, meta: p.meta || null });
        }).catch(function(m) {
          m && m.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "sync",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            since: p.since,
            meta: p.meta || null
          });
        });
      },
      query: function(f) {
        const p = f.detail || {}, y = p.query || p, m = p.meta && p.meta.targetEl ? p.meta.targetEl : null, _ = m || "query", g = i.queryDebounce;
        function r(n, o, s) {
          i.query(o, s).then(function(b) {
            const v = b || {};
            S(i.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: o.offset,
              queryGen: o.queryGen,
              meta: n.meta || null
            });
          }).catch(function(b) {
            b && b.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
              action: "query",
              error: b.message,
              status: b.status || 0,
              data: b.data || null,
              meta: n.meta || null
            });
          });
        }
        if (g === 0) {
          r(p, y, m);
          return;
        }
        i._queryTimers.has(_) && clearTimeout(i._queryTimers.get(_));
        const a = setTimeout(function() {
          i._queryTimers.delete(_), r(p, y, m);
        }, g);
        i._queryTimers.set(_, a);
      },
      cancel: function(f) {
        const p = f.detail || {}, y = p.meta && p.meta.targetEl ? p.meta.targetEl : p.targetEl || p.key;
        y && i.cancel(y);
      },
      create: function(f) {
        const p = f.detail || {};
        i.create(p.data, p.url, p.idempotencyKey).then(function(y) {
          const m = Ne(y);
          S(i.dom, "ln-api-connector:created", {
            record: m.record,
            tempId: p.tempId,
            message: m.message,
            meta: p.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "create",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            tempId: p.tempId,
            meta: p.meta || null
          });
        });
      },
      update: function(f) {
        const p = f.detail || {};
        i.update(p.id, p.data, p.expected_version, p.url, p.idempotencyKey).then(function(y) {
          const m = Ne(y);
          S(i.dom, "ln-api-connector:updated", {
            record: m.record,
            id: p.id,
            message: m.message,
            meta: p.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: p.id,
            conflictData: y.status === 409 ? y.data : null,
            meta: p.meta || null
          });
        });
      },
      delete: function(f) {
        const p = f.detail || {};
        i.delete(p.id, p.url, p.idempotencyKey).then(function(y) {
          const m = y && y.message ? y.message : null;
          S(i.dom, "ln-api-connector:deleted", {
            response: y,
            id: p.id,
            message: m,
            meta: p.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: p.id,
            meta: p.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const p = f.detail || {};
        i.bulkDelete(p.ids, p.url, p.idempotencyKey).then(function(y) {
          const m = y && y.message ? y.message : null;
          S(i.dom, "ln-api-connector:bulk-deleted", {
            response: y,
            ids: p.ids,
            message: m,
            meta: p.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || S(i.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            ids: p.ids,
            meta: p.meta || null
          });
        });
      }
    }, i.dom.addEventListener("ln-api-connector:request-sync", i._handlers.sync), i.dom.addEventListener("ln-api-connector:request-query", i._handlers.query), i.dom.addEventListener("ln-api-connector:request-fetch", i._handlers.query), i.dom.addEventListener("ln-api-connector:request-cancel", i._handlers.cancel), i.dom.addEventListener("ln-api-connector:request-create", i._handlers.create), i.dom.addEventListener("ln-api-connector:request-update", i._handlers.update), i.dom.addEventListener("ln-api-connector:request-delete", i._handlers.delete), i.dom.addEventListener("ln-api-connector:request-bulk-delete", i._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const i = this;
    i._inflight && (i._inflight.forEach(function(f) {
      f.abort();
    }), i._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(f) {
      f && clearTimeout(f);
    }), this._queryTimers.clear()), this._handlers && (i.dom.removeEventListener("ln-api-connector:request-sync", i._handlers.sync), i.dom.removeEventListener("ln-api-connector:request-query", i._handlers.query), i.dom.removeEventListener("ln-api-connector:request-fetch", i._handlers.query), i.dom.removeEventListener("ln-api-connector:request-cancel", i._handlers.cancel), i.dom.removeEventListener("ln-api-connector:request-create", i._handlers.create), i.dom.removeEventListener("ln-api-connector:request-update", i._handlers.update), i.dom.removeEventListener("ln-api-connector:request-delete", i._handlers.delete), i.dom.removeEventListener("ln-api-connector:request-bulk-delete", i._handlers.bulkDelete), i._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[d];
  };
  function c(i) {
    const f = i[e];
    f && f.refreshConfig();
  }
  F(t, e, l, "ln-api-connector", {
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
    onAttributeChange: c
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", d = "lnConnector";
  if (window[e] !== void 0) return;
  function h(_) {
    const g = _ && _.content !== void 0 ? _.content : _, r = _ && _.message ? _.message : null;
    return { content: g, message: r };
  }
  function l(_) {
    return this.dom = _, _[e] = this, _[d] = this, this.refreshConfig(), this._handlers = null, y(this), this;
  }
  l.prototype.refreshConfig = function() {
    const _ = this.dom;
    this.url = _.getAttribute("data-ln-couchdb-url") || "", this.db = _.getAttribute("data-ln-couchdb-db") || "", this.auth = _.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const g = _.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Je(g, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), g.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(_, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function u(_, g, r) {
    const a = Object.assign({}, Lt(_.headers, _.auth), r || {});
    return g && (a["Idempotency-Key"] = g), a;
  }
  l.prototype.fetchDelta = function(_) {
    const g = this, r = ["include_docs=true", "feed=normal"];
    _ && r.push("since=" + encodeURIComponent(_));
    const a = dt(g.url, g.db, "_changes") + "?" + r.join("&");
    return window.fetch(a, { method: "GET", headers: Lt(g.headers, g.auth), credentials: g.credentials }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const o = n.results || [];
      return {
        data: o.filter((s) => !s.deleted && s.doc).map((s) => Object.assign({}, s.doc, { id: s.doc._id })),
        deleted: o.filter((s) => s.deleted).map((s) => s.id),
        synced_at: n.last_seq || _ || ""
      };
    });
  };
  function c(_, g, r) {
    const a = Object.assign({ _id: g.id }, g);
    return a._id || delete a._id, window.fetch(dt(_.url, _.db), {
      method: "POST",
      headers: u(_, r),
      credentials: _.credentials,
      body: JSON.stringify(a)
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const o = h(n), s = o.content;
      return { record: Object.assign({}, a, { id: s.id, _id: s.id, _rev: s.rev }), message: o.message };
    });
  }
  l.prototype.create = function(_, g) {
    return c(this, _, g).then((r) => r.record);
  };
  function i(_, g, r, a) {
    const n = Object.assign({ id: String(g), _id: String(g) }, r), o = n._rev || n.rev;
    return (o ? Promise.resolve(o) : window.fetch(dt(_.url, _.db, null, g), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((b) => {
      if (!b.ok) throw new Error("Could not retrieve document for revision mapping");
      return b.json().then((v) => v._rev);
    })).then((b) => {
      const v = Object.assign({}, n, { _rev: b });
      delete v.rev;
      const w = u(_, a, { "If-Match": b });
      return window.fetch(dt(_.url, _.db, null, g), {
        method: "PUT",
        headers: w,
        credentials: _.credentials,
        body: JSON.stringify(v)
      }).then((A) => {
        if (A.ok) return A.json().then((C) => {
          const L = h(C);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (A.status === 409) return A.json().then((C) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = C, L;
        });
        throw new Error("HTTP " + A.status + ": " + A.statusText);
      });
    });
  }
  l.prototype.update = function(_, g, r) {
    return i(this, _, g, r).then((a) => a.record);
  };
  function f(_, g, r, a) {
    return (r ? Promise.resolve(r) : window.fetch(dt(_.url, _.db, null, g), { method: "GET", headers: Lt(_.headers, _.auth), credentials: _.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision delete");
      return o.json().then((s) => s._rev);
    })).then((o) => {
      const s = dt(_.url, _.db, null, g) + "?rev=" + encodeURIComponent(o);
      return window.fetch(s, { method: "DELETE", headers: u(_, a), credentials: _.credentials }).then((b) => {
        if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
        return b.json();
      }).then((b) => {
        const v = h(b);
        return { response: v.content, message: v.message };
      });
    });
  }
  l.prototype.delete = function(_, g, r) {
    return f(this, _, g, r).then((a) => a.response);
  };
  function p(_, g, r) {
    return !g || g.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(dt(_.url, _.db, "_all_docs"), {
      method: "POST",
      headers: Lt(_.headers, _.auth),
      credentials: _.credentials,
      body: JSON.stringify({ keys: g })
    }).then((a) => {
      if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
      return a.json();
    }).then((a) => {
      const o = (a.rows || []).filter((s) => !s.error && s.value && s.value.rev).map((s) => ({ _id: s.id, _rev: s.value.rev, _deleted: !0 }));
      return o.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(dt(_.url, _.db, "_bulk_docs"), {
        method: "POST",
        headers: u(_, r),
        credentials: _.credentials,
        body: JSON.stringify({ docs: o })
      }).then((s) => {
        if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
        return s.json();
      }).then((s) => {
        const b = h(s);
        return { response: { ok: !0, results: b.content, deletedCount: o.length }, message: b.message };
      });
    });
  }
  l.prototype.bulkDelete = function(_, g) {
    return p(this, _, g).then((r) => r.response);
  };
  function y(_) {
    _._handlers = {
      sync: function(r) {
        const a = r.detail || {};
        _.fetchDelta(a.since).then(function(n) {
          S(_.dom, "ln-couchdb-connector:fetched", { data: n, since: a.since, meta: a.meta || null });
        }).catch(function(n) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: n.message,
            status: n.status || 0,
            since: a.since,
            meta: a.meta || null
          });
        });
      },
      create: function(r) {
        const a = r.detail || {};
        c(_, a.data, a.idempotencyKey).then(function(n) {
          S(_.dom, "ln-couchdb-connector:created", { record: n.record, tempId: a.tempId, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: n.message,
            status: n.status || 0,
            tempId: a.tempId,
            meta: a.meta || null
          });
        });
      },
      update: function(r) {
        const a = r.detail || {}, n = Object.assign({}, a.data);
        a.expected_version !== void 0 && (n._rev = a.expected_version), i(_, a.id, n, a.idempotencyKey).then(function(o) {
          S(_.dom, "ln-couchdb-connector:updated", { record: o.record, id: a.id, message: o.message, meta: a.meta || null });
        }).catch(function(o) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: a.id,
            data: o.status === 409 ? o.data : null,
            conflictData: o.status === 409 ? o.data : null,
            meta: a.meta || null
          });
        });
      },
      delete: function(r) {
        const a = r.detail || {};
        f(_, a.id, a.rev, a.idempotencyKey).then(function(n) {
          S(_.dom, "ln-couchdb-connector:deleted", { response: n.response, id: a.id, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: n.message,
            status: n.status || 0,
            id: a.id,
            meta: a.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const a = r.detail || {};
        p(_, a.ids, a.idempotencyKey).then(function(n) {
          S(_.dom, "ln-couchdb-connector:bulk-deleted", { response: n.response, ids: a.ids, message: n.message, meta: a.meta || null });
        }).catch(function(n) {
          S(_.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: n.message,
            status: n.status || 0,
            ids: a.ids,
            meta: a.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      _.dom.addEventListener(r + ":request-sync", _._handlers.sync), _.dom.addEventListener(r + ":request-fetch", _._handlers.sync), _.dom.addEventListener(r + ":request-create", _._handlers.create), _.dom.addEventListener(r + ":request-update", _._handlers.update), _.dom.addEventListener(r + ":request-delete", _._handlers.delete), _.dom.addEventListener(r + ":request-bulk-delete", _._handlers.bulkDelete);
    });
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const _ = this;
    _._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(r) {
      _.dom.removeEventListener(r + ":request-sync", _._handlers.sync), _.dom.removeEventListener(r + ":request-fetch", _._handlers.sync), _.dom.removeEventListener(r + ":request-create", _._handlers.create), _.dom.removeEventListener(r + ":request-update", _._handlers.update), _.dom.removeEventListener(r + ":request-delete", _._handlers.delete), _.dom.removeEventListener(r + ":request-bulk-delete", _._handlers.bulkDelete);
    }), _._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[d];
  };
  function m(_) {
    const g = _[e];
    g && g.refreshConfig();
  }
  F(t, e, l, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: m
  });
})();
function er(t) {
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
  const d = !t || !!t.initializationError, h = !!(t && t.noLocalQuery && !t.windowed);
  return e && (d || !t.canServe || h) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Pe(t, e) {
  const d = Object.assign({}, t);
  return e && (d.filters = e.filters, d.search = e.search, d.sort = e.sort), d;
}
class nr {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((d, h) => {
      this._pending.set(e, { resolve: d, reject: h });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const d = e || new Error("Mutation receipt registry closed");
    for (const h of this._pending.values()) h.reject(d);
    this._pending.clear();
  }
  _settle(e, d) {
    const h = e && e.requestId;
    if (!h) return !1;
    const l = this._pending.get(h);
    return l ? (this._pending.delete(h), d ? l.reject(e.error || new Error("Store mutation failed")) : l.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", d = "lnCoordinator", h = "data-ln-form-scope";
  if (window[e] !== void 0) return;
  const l = /* @__PURE__ */ new Set();
  let u = !1, c = null, i = null, f = null;
  function p() {
    u || (u = !0, c = function() {
      S(document, "ln-data-store:online", {}), l.forEach(function(n) {
        n._maybeSync();
      });
    }, i = function() {
      S(document, "ln-data-store:offline", {});
    }, f = function() {
      document.visibilityState === "visible" && l.forEach(function(n) {
        const o = n.findChildren(), s = o.store;
        s && o.connector && s.isInitialized && !s.initializationError && !s.isSyncing && !n._noAutosync && (!s.hasCache || n._isStale()) && s.forceSync();
      });
    }, window.addEventListener("online", c), window.addEventListener("offline", i), document.addEventListener("visibilitychange", f));
  }
  function y() {
    u && (l.size > 0 || (window.removeEventListener("online", c), window.removeEventListener("offline", i), document.removeEventListener("visibilitychange", f), c = null, i = null, f = null, u = !1));
  }
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o) => {
        const s = Math.random() * 16 | 0;
        return (o === "x" ? s : s & 3 | 8).toString(16);
      });
    }
  }
  const _ = ["ln-api-connector", "ln-couchdb-connector"];
  function g(n) {
    return this.dom = n, this._name = n.getAttribute("data-ln-data-coordinator") || n.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", n), n[e] = this, n[d] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new nr(), this._dict = Wt(n, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), r(this), l.add(this), p(), this._checkInitialSync(), this;
  }
  g.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, s = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), b = parseInt(s, 10);
    this._staleThreshold = s === "never" || s === "-1" ? -1 : isNaN(b) ? 300 : b;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, g.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, g.prototype._maybeSync = function() {
    const n = this.findChildren(), o = n.store;
    !o || o.initializationError || !n.connector || this._noAutosync || !o.isInitialized || o.isSyncing || (!o.hasCache || this._isStale()) && o.forceSync();
  }, g.prototype._checkInitialSync = function() {
    const n = this, s = this.findChildren().store;
    s && Promise.resolve(s.ready).then(function() {
      const b = n.findChildren(), v = b.store;
      if (v && v.initializationError) {
        n._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !b.connector || n._noAutosync || v.isSyncing || (!v.hasCache || n._isStale()) && v.forceSync();
    }).catch(function(b) {
      n._reportReconciliationError("store-initialize", b, null);
    });
  }, g.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(s) {
      return s;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(s) {
      return s;
    });
  }, g.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), s = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: n,
      connectorEl: o,
      queueEl: s,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: s ? s.lnApiQueue : null
    };
  }, g.prototype._handleSubmitRecord = function(n) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const s = n.data || {}, b = s.id, v = s.expected_version, w = Object.assign({}, s);
    delete w.id, delete w.expected_version;
    const A = n.method.toUpperCase();
    A === "POST" ? this._fanOutCreate(o, w, n.action) : (A === "PUT" || A === "PATCH") && this._fanOutUpdate(o, b, w, v, n.action);
  }, g.prototype._fanOutCreate = function(n, o, s) {
    this.refreshMapper();
    const b = "_temp_" + m();
    S(n.storeEl, "ln-data-store:request-create", { tempId: b, data: o }), n.queue ? S(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: b,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: b, action: s }
    }) : n.connector && S(n.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: s,
      meta: { entryId: m(), queued: !1, op: "create", tempId: b }
    });
  }, g.prototype._fanOutUpdate = function(n, o, s, b, v) {
    this.refreshMapper(), S(n.storeEl, "ln-data-store:request-update", { id: o, data: s }), n.queue ? S(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(s),
      expectedVersion: b,
      meta: { id: o, action: v }
    }) : n.connector && S(n.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(s),
      expected_version: b,
      url: v,
      meta: { entryId: m(), queued: !1, op: "update", id: o }
    });
  }, g.prototype._fanOutDelete = function(n, o) {
    this.refreshMapper(), S(n.storeEl, "ln-data-store:request-delete", { id: o }), n.queue ? S(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "delete",
      targetId: o,
      payload: null,
      expectedVersion: null,
      meta: { id: o }
    }) : n.connector && S(n.connectorEl, "ln-api-connector:request-delete", {
      id: o,
      meta: { entryId: m(), queued: !1, op: "delete", id: o }
    });
  }, g.prototype._fanOutBulkDelete = function(n, o) {
    this.refreshMapper();
    const s = o.join(",");
    S(n.storeEl, "ln-data-store:request-bulk-delete", { ids: o }), n.queue ? S(n.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: s,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: o },
      expectedVersion: null,
      meta: { bulkKey: s, ids: o }
    }) : n.connector && S(n.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: o,
      meta: { entryId: m(), queued: !1, op: "bulk-delete", bulkKey: s }
    });
  }, g.prototype._toastFromMessage = function(n) {
    n && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: n.type || "success",
        title: n.title || "",
        message: n.body || ""
      }
    }));
  }, g.prototype._toastFromDict = function(n) {
    const o = this._dict[n];
    o && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: o }
    }));
  }, g.prototype._requestStoreMutation = function(n, o, s) {
    const b = n.storeEl;
    if (!b) return Promise.reject(new Error("Store element not found"));
    const v = m(), w = this._mutationReceipts.wait(v);
    return S(b, "ln-data-store:request-" + o, Object.assign({}, s, { requestId: v })), w;
  }, g.prototype._reportReconciliationError = function(n, o, s) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: n,
      error: o,
      meta: s || null
    });
  };
  function r(n) {
    n._handlers = {
      sync: function(o) {
        n.refreshMapper();
        const s = n.findChildren();
        if (!s.store || !s.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(s.connectorEl, "ln-api-connector:request-sync", { since: o.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(o) {
        const s = n.findChildren();
        if (!s.connectorEl) return;
        const b = o.detail || {};
        S(s.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, b.query, {
            offset: b.offset,
            limit: b.limit,
            queryGen: b.queryGen
          })
        });
      },
      reqCreate: function(o) {
        const s = n.findChildren();
        s.storeEl && n._fanOutCreate(s, o.detail.data || {}, o.detail.action);
      },
      reqUpdate: function(o) {
        const s = n.findChildren();
        s.storeEl && n._fanOutUpdate(s, o.detail.id, o.detail.data || {}, o.detail.expected_version, o.detail.action);
      },
      reqDelete: function(o) {
        const s = n.findChildren();
        s.storeEl && n._fanOutDelete(s, o.detail.id);
      },
      reqBulkDelete: function(o) {
        const s = n.findChildren();
        s.storeEl && n._fanOutBulkDelete(s, o.detail.ids || []);
      },
      queueFailed: function() {
        n._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(o) {
        n.refreshMapper();
        const s = n.findChildren();
        if (!s.store || !s.connector || !s.queue) return;
        const b = o.detail || {}, v = b.entryId, w = b.op, A = b.targetId, C = b.payload, L = b.expectedVersion, q = b.meta || {}, x = q.action || null, R = b.idempotencyKey || v;
        w === "create" ? S(s.connectorEl, "ln-api-connector:request-create", {
          data: C,
          url: x,
          idempotencyKey: R,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : w === "update" ? S(s.connectorEl, "ln-api-connector:request-update", {
          id: A,
          data: C,
          expected_version: L,
          url: x,
          idempotencyKey: R,
          meta: { entryId: v, queued: !0, op: "update", id: A }
        }) : w === "delete" ? S(s.connectorEl, "ln-api-connector:request-delete", {
          id: A,
          idempotencyKey: R,
          meta: { entryId: v, queued: !0, op: "delete", id: A }
        }) : w === "bulk-delete" ? S(s.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: C && C.ids ? C.ids : [],
          idempotencyKey: R,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", w);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(o) {
        const s = o.target;
        if (o.defaultPrevented) return;
        const b = s.hasAttribute(h) ? s.getAttribute(h) : null;
        if (b === null) return;
        let v;
        if (b ? v = b === n._name || n._ownsStore(b) : v = s.closest("[data-ln-data-coordinator]") === n.dom, !v) return;
        const w = Vn(s);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        o.preventDefault();
        const A = je(s);
        delete A._method, delete A._token, n._handleSubmitRecord({ data: A, method: w, action: s.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const s = o.detail.meta || {}, b = n.findChildren();
        n.refreshMapper();
        const v = o.detail.data;
        let w = [], A = [], C = null;
        Array.isArray(v) ? (w = v, C = Math.floor(Date.now() / 1e3)) : v && (w = Array.isArray(v.data) ? v.data : [], A = Array.isArray(v.deleted) ? v.deleted : [], C = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = w.map((q) => n.mapper.ingress(q));
        if (b.store && !b.store.initializationError)
          s.kind ? s.kind === "table" || s.kind === "list" || s.kind === "chart" ? b.store.applyQuery(L, { total: o.detail.total }).then(function(q) {
            S(s.targetEl, "ln-" + s.kind + ":set-loading", { loading: !1 }), S(s.targetEl, "ln-" + s.kind + ":set-data", {
              data: q,
              total: o.detail.total !== void 0 ? o.detail.total : q.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : q.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), n._boundDelivered.set(s.targetEl, !0);
          }) : s.kind === "options" ? b.store.applyQuery(L, { total: o.detail.total }).then(function() {
            return b.store.getAll({});
          }).then(function(q) {
            S(s.targetEl, "ln-options:set-data", { data: q.data });
          }) : s.kind === "stat" && b.store.applyQuery(L, { total: o.detail.total }).then(function() {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(s.targetEl, "ln-stat:set-count", { count: q });
          }) : b.store.applySync(L, A, C || Math.floor(Date.now() / 1e3), {
            total: o.detail.total,
            filtered: o.detail.filtered,
            offset: o.detail.offset,
            queryGen: o.detail.queryGen,
            targetEl: s.targetEl
          });
        else if (s.targetEl && s.kind) {
          if (s.kind === "table" || s.kind === "list" || s.kind === "chart")
            S(s.targetEl, "ln-" + s.kind + ":set-loading", { loading: !1 }), S(s.targetEl, "ln-" + s.kind + ":set-data", {
              data: L,
              total: o.detail.total !== void 0 ? o.detail.total : L.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : L.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), n._boundDelivered.set(s.targetEl, !0);
          else if (s.kind === "options")
            S(s.targetEl, "ln-options:set-data", { data: L });
          else if (s.kind === "stat") {
            const q = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(s.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(o) {
        const s = n.findChildren();
        if (!s.storeEl) return;
        const b = o.detail.meta || {}, v = n.mapper.ingress(o.detail.record);
        n._requestStoreMutation(s, "update", { id: b.tempId, data: v }).then(function() {
          n._toastFromMessage(o.detail.message), b.queued && s.queue && S(s.queueEl, "ln-api-queue:resolve-create", {
            entryId: b.entryId,
            oldKey: b.tempId,
            newId: v.id
          });
        }).catch(function(w) {
          n._reportReconciliationError("create-reconcile", w, b);
        });
      },
      connUpdated: function(o) {
        const s = n.findChildren();
        if (!s.storeEl) return;
        const b = o.detail.meta || {}, v = n.mapper.ingress(o.detail.record);
        n._requestStoreMutation(s, "update", { id: b.id, data: v }).then(function() {
          n._toastFromMessage(o.detail.message), b.queued && s.queue && S(s.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
        }).catch(function(w) {
          n._reportReconciliationError("update-reconcile", w, b);
        });
      },
      connDeleted: function(o) {
        const s = n.findChildren();
        if (!s.storeEl) return;
        const b = o.detail.meta || {};
        n._toastFromMessage(o.detail.message), b.queued && s.queue && S(s.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      },
      connBulkDeleted: function(o) {
        const s = n.findChildren();
        if (!s.storeEl) return;
        const b = o.detail.meta || {};
        n._toastFromMessage(o.detail.message), b.queued && s.queue && S(s.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      },
      connError: function(o) {
        const s = o.detail || {}, b = s.meta || {}, v = b.op || s.action, w = s.status || 0, A = n.findChildren();
        if (v === "sync") {
          A.storeEl && S(A.storeEl, "ln-data-store:request-sync-failed", {
            error: s.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", s.error);
          return;
        }
        if (v === "query") {
          b.targetEl && b.kind && (S(b.targetEl, "ln-" + b.kind + ":set-loading", { loading: !1 }), (b.kind === "table" || b.kind === "list") && S(b.targetEl, "ln-" + b.kind + ":page-failed", { offset: b.offset })), n._reportReconciliationError("query", s.error || s, b);
          return;
        }
        if (!A.storeEl) return;
        const C = w === 401 || w === 419, L = w === 0 || w >= 500, q = w === 409 || w === 412;
        if (C) {
          n._toastFromDict("auth"), b.queued && A.queue && S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "auth" });
          return;
        }
        if (L) {
          b.queued && A.queue ? S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "retry" }) : n._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const R = s.data && s.data.remote ? n.mapper.ingress(s.data.remote) : null;
          R && (x = n._requestStoreMutation(A, "update", { id: b.id, data: R })), n._toastFromDict("conflict");
        } else v === "create" && (x = n._requestStoreMutation(A, "delete", { id: b.tempId })), n._toastFromDict("rejected");
        b.queued && A.queue ? x.then(function() {
          S(A.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: "drop" });
        }).catch(function(R) {
          n._reportReconciliationError("deterministic-reconcile", R, b);
        }) : x.catch(function(R) {
          n._reportReconciliationError("deterministic-reconcile", R, b);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const s = n.findChildren(), b = s.store;
        if (!b || b.initializationError || !s.connector || n._noAutosync || b.isSyncing) return;
        (o.detail || {}).hasCache ? n._isStale() && b.forceSync() : b.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(o) {
        n._serveData(o, "table");
      },
      reqListData: function(o) {
        n._serveData(o, "list");
      },
      reqChartData: function(o) {
        n._serveData(o, "chart");
      },
      reqOptions: function(o) {
        n._serveOptions(o);
      },
      reqStat: function(o) {
        n._serveStat(o);
      },
      refreshQuery: function() {
        n._refreshAll(null, !0);
      },
      refresh: function(o) {
        n._mutationReceipts.resolve(o.detail), n._refreshAll(null, !1);
      },
      mutationError: function(o) {
        n._mutationReceipts.reject(o.detail);
      },
      refreshSynced: function(o) {
        o.detail && o.detail.changed && n._refreshAll(o.detail.meta, !1);
      }
    }, n.dom.addEventListener("ln-data-store:request-remote-sync", n._handlers.sync), n.dom.addEventListener("ln-data-store:request-page", n._handlers.requestPage), n.dom.addEventListener("ln-data-coordinator:request-create", n._handlers.reqCreate), n.dom.addEventListener("ln-data-coordinator:request-update", n._handlers.reqUpdate), n.dom.addEventListener("ln-data-coordinator:request-delete", n._handlers.reqDelete), n.dom.addEventListener("ln-data-coordinator:request-bulk-delete", n._handlers.reqBulkDelete), n.dom.addEventListener("ln-api-queue:send", n._handlers.queueSend), n.dom.addEventListener("ln-api-queue:failed", n._handlers.queueFailed), n.dom.addEventListener("ln-data-store:initialized", n._handlers.storeInitialized), document.addEventListener("submit", n._handlers.formSubmit), _.forEach(function(o) {
      n.dom.addEventListener(o + ":fetched", n._handlers.connFetched), n.dom.addEventListener(o + ":created", n._handlers.connCreated), n.dom.addEventListener(o + ":updated", n._handlers.connUpdated), n.dom.addEventListener(o + ":deleted", n._handlers.connDeleted), n.dom.addEventListener(o + ":bulk-deleted", n._handlers.connBulkDeleted), n.dom.addEventListener(o + ":error", n._handlers.connError);
    }), document.addEventListener("ln-table:request-data", n._handlers.reqTableData), document.addEventListener("ln-list:request-data", n._handlers.reqListData), document.addEventListener("ln-chart:request-data", n._handlers.reqChartData), document.addEventListener("ln-options:request-data", n._handlers.reqOptions), document.addEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.addEventListener("ln-data-store:ready", n._handlers.refresh), n.dom.addEventListener("ln-data-store:created", n._handlers.refresh), n.dom.addEventListener("ln-data-store:updated", n._handlers.refresh), n.dom.addEventListener("ln-data-store:deleted", n._handlers.refresh), n.dom.addEventListener("ln-data-store:mutation-error", n._handlers.mutationError), n.dom.addEventListener("ln-data-store:synced", n._handlers.refreshSynced), n.dom.addEventListener("ln-data-store:query-changed", n._handlers.refreshQuery);
  }
  g.prototype._ownsStore = function(n) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === n && n);
  }, g.prototype._serveData = function(n, o) {
    const s = n.target, b = o === "table" ? "data-ln-table-source" : o === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = s.getAttribute(b);
    if (!v || !this._ownsStore(v)) return;
    const w = n.detail || {}, A = er(w);
    this._boundQueries.set(s, A);
    const C = this.findChildren(), L = this, q = C.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const R = Pt(q, C.connector), M = Pe(A, q && q.query);
      if (R === "remote") {
        S(s, "ln-" + o + ":set-loading", { loading: !0 }), S(C.connectorEl, "ln-api-connector:request-query", {
          query: M,
          meta: { targetEl: s, kind: o, offset: M.offset, limit: M.limit }
        });
        return;
      }
      if (R !== "store") {
        S(s, "ln-" + o + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(M).then(function(N) {
        const B = {
          data: N.data,
          total: N.total,
          filtered: N.filtered,
          offset: w.offset !== void 0 ? w.offset : N.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : N.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: N.provisional === !0
        };
        S(s, "ln-" + o + ":set-data", B), L._boundDelivered.set(s, !0);
      });
    }).catch(function(R) {
      S(s, "ln-" + o + ":set-loading", { loading: !1 }), S(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: o,
        store: v,
        target: s,
        error: R
      });
    });
  }, g.prototype._serveOptions = function(n) {
    const o = n.target, s = o.getAttribute("data-ln-options");
    if (!this._ownsStore(s)) return;
    const b = this.findChildren(), v = b.store, w = v && v.ready ? v.ready : Promise.resolve(), A = this;
    return w.then(function() {
      const C = Pt(v, b.connector);
      if (C === "remote") {
        S(b.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: o, kind: "options" }
        });
        return;
      }
      if (C === "store")
        return v.getAll({}).then(function(L) {
          S(o, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(C) {
      A._reportReconciliationError("options-query", C, { targetEl: o, kind: "options" });
    });
  }, g.prototype._serveStat = function(n) {
    const o = n.target, s = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(s)) return;
    const b = n.detail && n.detail.filters ? n.detail.filters : null, v = this.findChildren(), w = v.store, A = w && w.ready ? w.ready : Promise.resolve(), C = this;
    return A.then(function() {
      const L = b && Object.keys(b).length > 0, x = !!(v.connector && w && ((w.windowed || w._windowIndex) && L || w.noLocalQuery)) ? "remote" : Pt(w, v.connector);
      if (x === "remote") {
        S(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: b },
          meta: { targetEl: o, kind: "stat" }
        });
        return;
      }
      if (x === "store")
        return w.count(b).then(function(R) {
          S(o, "ln-stat:set-count", { count: R });
        });
    }).catch(function(L) {
      C._reportReconciliationError("stat-query", L, { targetEl: o, kind: "stat" });
    });
  }, g.prototype._refreshAll = function(n, o) {
    const s = this, b = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < b.length; v++) {
      const w = b[v];
      let A, C;
      if (w.hasAttribute("data-ln-table-source") ? (A = w.getAttribute("data-ln-table-source"), C = "table") : w.hasAttribute("data-ln-list-source") ? (A = w.getAttribute("data-ln-list-source"), C = "list") : w.hasAttribute("data-ln-chart-source") ? (A = w.getAttribute("data-ln-chart-source"), C = "chart") : w.hasAttribute("data-ln-options") ? (A = w.getAttribute("data-ln-options"), C = "options") : w.hasAttribute("data-ln-stat") && (A = w.getAttribute("data-ln-stat"), C = "stat"), !s._ownsStore(A)) continue;
      const L = s.findChildren(), q = L.store;
      if (C === "table" || C === "list") {
        const x = C === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (w.hasAttribute(x)) {
          S(w, "ln-" + C + (o ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (C === "table" || C === "list" || C === "chart") {
        const x = s._boundQueries.get(w) || { sort: null, filters: {}, search: "" }, R = Pe(x, q.query);
        if (Pt(q, L.connector) === "remote") {
          S(w, "ln-" + C + ":set-loading", { loading: !0 }), S(L.connectorEl, "ln-api-connector:request-query", {
            query: R,
            meta: { targetEl: w, kind: C, offset: R.offset, limit: R.limit }
          });
          continue;
        }
        (function(M, N) {
          q.getAll(R).then(function(B) {
            const K = {
              data: B.data,
              total: n && n.total !== void 0 ? n.total : B.total,
              filtered: n && n.filtered !== void 0 ? n.filtered : B.filtered,
              offset: B.offset !== void 0 ? B.offset : n && n.offset !== void 0 ? n.offset : x.offset,
              queryGen: B.queryGen !== void 0 ? B.queryGen : n && n.queryGen !== void 0 ? n.queryGen : x.queryGen
            };
            S(M, "ln-" + N + ":set-loading", { loading: !1 }), S(M, "ln-" + N + ":set-data", K), s._boundDelivered.set(M, !0);
          });
        })(w, C);
      } else if (C === "options")
        (function(x) {
          q.getAll({}).then(function(R) {
            S(x, "ln-options:set-data", { data: R.data });
          });
        })(w);
      else if (C === "stat") {
        const x = w.getAttribute("data-ln-stat-filter");
        let R = null;
        if (x) {
          const M = x.indexOf(":");
          if (M !== -1) {
            const N = x.slice(0, M), B = x.slice(M + 1);
            R = {}, R[N] = [B];
          }
        }
        (function(M, N) {
          q.count(N).then(function(B) {
            S(M, "ln-stat:set-count", { count: B });
          });
        })(w, R);
      }
    }
  }, g.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-data-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-data-store:request-page", n._handlers.requestPage), n.dom.removeEventListener("ln-data-coordinator:request-create", n._handlers.reqCreate), n.dom.removeEventListener("ln-data-coordinator:request-update", n._handlers.reqUpdate), n.dom.removeEventListener("ln-data-coordinator:request-delete", n._handlers.reqDelete), n.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", n._handlers.reqBulkDelete), n.dom.removeEventListener("ln-api-queue:send", n._handlers.queueSend), n.dom.removeEventListener("ln-api-queue:failed", n._handlers.queueFailed), n.dom.removeEventListener("ln-data-store:initialized", n._handlers.storeInitialized), document.removeEventListener("submit", n._handlers.formSubmit), _.forEach(function(o) {
      n.dom.removeEventListener(o + ":fetched", n._handlers.connFetched), n.dom.removeEventListener(o + ":created", n._handlers.connCreated), n.dom.removeEventListener(o + ":updated", n._handlers.connUpdated), n.dom.removeEventListener(o + ":deleted", n._handlers.connDeleted), n.dom.removeEventListener(o + ":bulk-deleted", n._handlers.connBulkDeleted), n.dom.removeEventListener(o + ":error", n._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-chart:request-data", n._handlers.reqChartData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-data-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-data-store:mutation-error", n._handlers.mutationError), n.dom.removeEventListener("ln-data-store:synced", n._handlers.refreshSynced), n.dom.removeEventListener("ln-data-store:query-changed", n._handlers.refreshQuery), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, n._mutationReceipts.close(new Error("Data coordinator destroyed")), n._mutationReceipts = null, l.delete(this), y(), delete this.dom[e], delete this.dom[d];
  };
  function a(n, o) {
    const s = n[e];
    s && o === "data-ln-data-mapper" && s.refreshMapper();
  }
  F(t, e, g, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: a
  });
})();
const ir = "ln_api_queue", rr = 2, Q = "outbox", Z = "_queue_meta";
function nt(t, e) {
  return t.error || new Error(e);
}
function wt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function Be(t) {
  return "seq:" + t;
}
function Bt(t) {
  return "paused:" + t;
}
function He(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function or(t, e, d) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(d);
}
function sr(t, e, d, h) {
  const l = /* @__PURE__ */ new Map(), u = [], c = [];
  for (const i of t || [])
    l.has(i.chainKey) || l.set(i.chainKey, []), l.get(i.chainKey).push(i);
  return l.forEach((i, f) => {
    i.sort((y, m) => y.seq - m.seq);
    const p = i[0];
    if (!(!p || p.status === "failed")) {
      if (p.status === "inflight" && (p.leaseUntil || 0) > h) {
        c.push({ chainKey: f, at: p.leaseUntil });
        return;
      }
      if ((p.nextAttemptAt || 0) > h) {
        c.push({ chainKey: f, at: p.nextAttemptAt });
        return;
      }
      p.status = "inflight", p.leaseOwner = e, p.leaseUntil = h + d, p.updatedAt = h, u.push(p);
    }
  }), { entries: u, wakeups: c };
}
function ar(t, e, d, h, l) {
  const u = [], c = [];
  for (const i of t || []) {
    if (i.entryId === e) {
      c.push(i.entryId);
      continue;
    }
    i.chainKey === d && (i.chainKey = h, i.targetId === d && (i.targetId = h), i.meta && i.meta.id === d && (i.meta.id = h), i.meta && typeof i.meta.action == "string" && (i.meta.action = or(i.meta.action, d, h)), i.updatedAt = l, u.push(i));
  }
  return { changed: u, deleted: c };
}
class lr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || ir, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, d) => {
      const h = this.indexedDB.open(this.dbName, rr);
      h.onupgradeneeded = (l) => {
        const u = l.target.result;
        let c;
        u.objectStoreNames.contains(Q) ? c = l.target.transaction.objectStore(Q) : c = u.createObjectStore(Q, { keyPath: "entryId" }), c.indexNames.contains("by_scope_chain") || c.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), c.indexNames.contains("by_scope_seq") || c.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), u.objectStoreNames.contains(Z) || u.createObjectStore(Z, { keyPath: "key" });
      }, h.onerror = () => d(nt(h, "Queue database open failed")), h.onsuccess = (l) => {
        this._db = l.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, d) => {
      const h = this.indexedDB.deleteDatabase(this.dbName);
      h.onsuccess = () => e(), h.onerror = () => d(nt(h, "Queue database delete failed")), h.onblocked = () => d(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((d) => d ? new Promise((h, l) => {
      const c = d.transaction(Q, "readonly").objectStore(Q).index("by_scope_seq").getAll(wt(this.keyRange, e));
      c.onsuccess = () => h(c.result || []), c.onerror = () => l(nt(c, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, d) {
    return d = d || {}, this.open().then((h) => h ? new Promise((l, u) => {
      const c = h.transaction([Z, Q], "readwrite"), i = c.objectStore(Z), f = c.objectStore(Q), p = Be(e);
      let y = null;
      const m = (g) => {
        const r = g + 1;
        y = {
          entryId: this.uuid(),
          scope: e,
          chainKey: d.chainKey,
          seq: r,
          op: d.op,
          targetId: d.targetId !== void 0 ? d.targetId : null,
          payload: d.payload,
          expectedVersion: d.expectedVersion !== void 0 ? d.expectedVersion : null,
          meta: d.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, i.put({ key: p, value: r }), f.put(y);
      }, _ = i.get(p);
      _.onerror = () => u(nt(_, "Queue sequence read failed")), _.onsuccess = () => {
        const g = _.result;
        if (g && typeof g.value == "number") {
          m(g.value);
          return;
        }
        const r = f.index("by_scope_seq").getAll(wt(this.keyRange, e));
        r.onerror = () => u(nt(r, "Queue sequence migration failed")), r.onsuccess = () => {
          const a = (r.result || []).reduce((n, o) => Math.max(n, o.seq || 0), 0);
          m(a);
        };
      }, c.oncomplete = () => l(y), c.onerror = () => u(c.error || new Error("Queue enqueue transaction failed")), c.onabort = () => u(c.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, d, h) {
    return this.open().then((l) => l ? new Promise((u, c) => {
      const i = l.transaction(Q, "readwrite"), f = i.objectStore(Q), p = f.index("by_scope_seq").getAll(wt(this.keyRange, e)), y = this.now();
      let m = { entries: [], wakeups: [] };
      p.onerror = () => c(nt(p, "Queue claim read failed")), p.onsuccess = () => {
        m = sr(p.result || [], d, h, y);
        for (const _ of m.entries) f.put(_);
      }, i.oncomplete = () => u(m), i.onerror = () => c(i.error || new Error("Queue claim transaction failed")), i.onabort = () => c(i.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, d) {
    return this._updateEntry(e, d, (h, l) => (l.delete(h.entryId), { status: "acked", entry: h }));
  }
  nack(e, d, h, l) {
    l = l || {};
    const u = l.maxAttempts || 8, c = l.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((i) => i ? new Promise((f, p) => {
      const y = i.transaction([Q, Z], "readwrite"), m = y.objectStore(Q), _ = y.objectStore(Z), g = m.get(d);
      let r = null;
      g.onerror = () => p(nt(g, "Queue nack read failed")), g.onsuccess = () => {
        const a = g.result;
        if (!(!a || a.scope !== e)) {
          if (h === "drop") {
            m.delete(a.entryId), r = { status: "dropped", entry: a };
            return;
          }
          if (He(a), a.updatedAt = this.now(), h === "auth") {
            a.status = "pending", m.put(a), _.put({ key: Bt(e), value: "auth" }), r = { status: "auth", entry: a };
            return;
          }
          if (h === "retry") {
            if (a.attempts = (a.attempts || 0) + 1, a.attempts >= u) {
              a.status = "failed", a.nextAttemptAt = 0, m.put(a), r = { status: "failed", entry: a };
              return;
            }
            const n = c[Math.min(a.attempts - 1, c.length - 1)];
            a.status = "pending", a.nextAttemptAt = this.now() + n, m.put(a), r = { status: "retry", entry: a, delay: n };
          }
        }
      }, y.oncomplete = () => f(r), y.onerror = () => p(y.error || new Error("Queue nack transaction failed")), y.onabort = () => p(y.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, d, h) {
    return this._remapTransaction(e, null, d, h);
  }
  resolveCreate(e, d, h, l) {
    return this._remapTransaction(e, d, h, l);
  }
  _remapTransaction(e, d, h, l) {
    return this.open().then((u) => u ? new Promise((c, i) => {
      const f = u.transaction(Q, "readwrite"), p = f.objectStore(Q), y = p.index("by_scope_seq").getAll(wt(this.keyRange, e));
      let m = { changed: [], deleted: [] };
      y.onerror = () => i(nt(y, "Queue remap read failed")), y.onsuccess = () => {
        m = ar(y.result || [], d, h, l, this.now());
        for (const _ of m.deleted) p.delete(_);
        for (const _ of m.changed) p.put(_);
      }, f.oncomplete = () => c(m.changed), f.onerror = () => i(f.error || new Error("Queue remap transaction failed")), f.onabort = () => i(f.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((d) => d ? new Promise((h, l) => {
      const u = d.transaction(Q, "readwrite"), c = u.objectStore(Q), i = c.index("by_scope_seq").getAll(wt(this.keyRange, e));
      let f = 0;
      i.onerror = () => l(nt(i, "Queue failed-entry read failed")), i.onsuccess = () => {
        for (const p of i.result || [])
          p.status === "failed" && (p.status = "pending", p.attempts = 0, p.nextAttemptAt = 0, p.updatedAt = this.now(), He(p), c.put(p), f++);
      }, u.oncomplete = () => h(f), u.onerror = () => l(u.error || new Error("Queue failed-entry reset failed")), u.onabort = () => l(u.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((d) => d ? new Promise((h, l) => {
      const c = d.transaction(Z, "readonly").objectStore(Z).get(Bt(e));
      c.onsuccess = () => {
        const i = c.result ? c.result.value : !1;
        h(i || !1);
      }, c.onerror = () => l(nt(c, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, d) {
    return this.open().then((h) => {
      if (h)
        return new Promise((l, u) => {
          const c = h.transaction(Z, "readwrite"), i = typeof d == "string" ? d : d ? "manual" : !1;
          c.objectStore(Z).put({ key: Bt(e), value: i }), c.oncomplete = () => l(), c.onerror = () => u(c.error || new Error("Queue pause-state write failed")), c.onabort = () => u(c.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((d) => {
      if (d)
        return new Promise((h, l) => {
          const u = d.transaction([Q, Z], "readwrite"), i = u.objectStore(Q).index("by_scope_seq").openCursor(wt(this.keyRange, e));
          i.onsuccess = (f) => {
            const p = f.target.result;
            p && (p.delete(), p.continue());
          }, i.onerror = () => l(nt(i, "Queue clear failed")), u.objectStore(Z).delete(Be(e)), u.objectStore(Z).delete(Bt(e)), u.oncomplete = () => h(), u.onerror = () => l(u.error || new Error("Queue clear transaction failed")), u.onabort = () => l(u.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, d, h) {
    return this.open().then((l) => l ? new Promise((u, c) => {
      const i = l.transaction(Q, "readwrite"), f = i.objectStore(Q), p = f.get(d);
      let y = null;
      p.onerror = () => c(nt(p, "Queue entry read failed")), p.onsuccess = () => {
        const m = p.result;
        !m || m.scope !== e || (y = h(m, f));
      }, i.oncomplete = () => u(y), i.onerror = () => c(i.error || new Error("Queue entry transaction failed")), i.onabort = () => c(i.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", d = [2e3, 5e3, 15e3, 6e4, 3e5], h = 8, l = 6e4;
  if (window[e] !== void 0) return;
  function u() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const m = Math.random() * 16 | 0;
        return (y === "x" ? m : m & 3 | 8).toString(16);
      });
    }
  }
  const c = new lr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: u
  });
  function i(p) {
    this.dom = p, p[e] = this;
    const y = p.closest("[data-ln-data-coordinator]");
    this.scope = p.id || (y ? y.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = u(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const m = this;
    return c.open().then((_) => _ ? c.getPaused(m.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((_) => {
      if (m._paused = !!_, m._paused) {
        const g = typeof _ == "string" ? _ : "auth";
        S(m.dom, "ln-api-queue:paused", { reason: g, restored: !0 });
      }
      return m._emitPendingCount();
    }).then(() => m._drain()).catch((_) => {
      console.error("[ln-api-queue] Initialization failed:", _), S(m.dom, "ln-api-queue:error", { operation: "initialize", error: _ });
    }), this;
  }
  i.prototype._isOnline = function() {
    const p = this.dom.getAttribute("data-ln-api-queue-online");
    return p === "true" ? !0 : p === "false" ? !1 : navigator.onLine;
  }, i.prototype._emitPendingCount = function() {
    const p = this;
    return c.allForScope(p.scope).then((y) => (S(p.dom, "ln-api-queue:pending-count", { count: y.length, scope: p.scope }), y.length === 0 && S(p.dom, "ln-api-queue:drained", { scope: p.scope }), y));
  }, i.prototype._clearTimer = function(p) {
    const y = this._timers.get(p);
    y && (clearTimeout(y), this._timers.delete(p));
  }, i.prototype._scheduleTimer = function(p, y) {
    const m = Math.max(0, y), _ = this._timers.get(p);
    _ && clearTimeout(_);
    const g = this, r = setTimeout(() => {
      g._timers.delete(p), g._drain();
    }, m);
    this._timers.set(p, r);
  }, i.prototype._drain = function() {
    const p = this;
    return p._paused || !p._isOnline() ? Promise.resolve() : (p._drainPromise || (p._drainPromise = c.claimReady(p.scope, p._workerId, l).then((y) => {
      for (const m of y.wakeups)
        p._scheduleTimer(m.chainKey, m.at - Date.now());
      for (const m of y.entries)
        p._clearTimer(m.chainKey), S(p.dom, "ln-api-queue:send", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          op: m.op,
          targetId: m.targetId,
          payload: m.payload,
          expectedVersion: m.expectedVersion,
          idempotencyKey: m.entryId,
          meta: m.meta
        });
    }).catch((y) => {
      console.error("[ln-api-queue] Drain failed:", y), S(p.dom, "ln-api-queue:error", { operation: "drain", error: y });
    }).finally(() => {
      p._drainPromise = null;
    })), p._drainPromise);
  }, i.prototype._onEnqueue = function(p) {
    const y = this;
    return c.enqueue(y.scope, p.detail || {}).then((m) => {
      if (m)
        return y._emitPendingCount().then((_) => (S(y.dom, "ln-api-queue:enqueued", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          count: _.length
        }), y._drain()));
    }).catch((m) => {
      S(y.dom, "ln-api-queue:error", { operation: "enqueue", error: m });
    });
  }, i.prototype._onAck = function(p) {
    const y = this, m = p.detail || {};
    return c.ack(y.scope, m.entryId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "ack", entryId: m.entryId, error: _ });
    });
  }, i.prototype._onNack = function(p) {
    const y = this, m = p.detail || {};
    return c.nack(y.scope, m.entryId, m.reason, {
      maxAttempts: h,
      backoff: d
    }).then((_) => {
      if (_)
        return _.status === "failed" ? S(y.dom, "ln-api-queue:failed", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey,
          attempts: _.entry.attempts
        }) : _.status === "retry" ? y._scheduleTimer(_.entry.chainKey, _.delay) : _.status === "auth" && (y._paused = !0, S(y.dom, "ln-api-queue:paused", { reason: "auth" }), S(y.dom, "ln-api-queue:auth-required", {
          entryId: _.entry.entryId,
          chainKey: _.entry.chainKey
        })), y._emitPendingCount().then(() => {
          if (_.status === "dropped") return y._drain();
        });
    }).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "nack", entryId: m.entryId, error: _ });
    });
  }, i.prototype._onRemap = function(p) {
    const y = this, m = p.detail || {};
    return c.remap(y.scope, m.oldKey, m.newId).catch((_) => {
      S(y.dom, "ln-api-queue:error", { operation: "remap", error: _ });
    });
  }, i.prototype._onResolveCreate = function(p) {
    const y = this, m = p.detail || {};
    return c.resolveCreate(y.scope, m.entryId, m.oldKey, m.newId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((_) => {
      S(y.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: m.entryId,
        error: _
      });
    });
  }, i.prototype._onResume = function() {
    const p = this;
    return c.setPaused(p.scope, !1).then(() => (p._paused = !1, S(p.dom, "ln-api-queue:resumed", {}), p._drain())).catch((y) => {
      S(p.dom, "ln-api-queue:error", { operation: "resume", error: y });
    });
  }, i.prototype._onPause = function() {
    const p = this;
    return c.setPaused(p.scope, "manual").then(() => {
      p._paused = !0, S(p.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((y) => {
      S(p.dom, "ln-api-queue:error", { operation: "pause", error: y });
    });
  }, i.prototype._onDrain = function() {
    const p = this;
    return c.resetFailed(p.scope).then(() => {
      const y = p._drainPromise;
      return y ? y.then(() => p._drain()) : p._drain();
    }).catch((y) => {
      S(p.dom, "ln-api-queue:error", { operation: "manual-drain", error: y });
    });
  }, i.prototype._onClear = function() {
    const p = this;
    return p._timers.forEach((y) => clearTimeout(y)), p._timers.clear(), c.clear(p.scope).then(() => {
      p._paused = !1, S(p.dom, "ln-api-queue:pending-count", { count: 0, scope: p.scope }), S(p.dom, "ln-api-queue:drained", { scope: p.scope });
    }).catch((y) => {
      S(p.dom, "ln-api-queue:error", { operation: "clear", error: y });
    });
  }, i.prototype._bindEvents = function() {
    const p = this;
    p._handlers = {
      enqueue: (y) => p._onEnqueue(y),
      ack: (y) => p._onAck(y),
      nack: (y) => p._onNack(y),
      remap: (y) => p._onRemap(y),
      resolveCreate: (y) => p._onResolveCreate(y),
      resume: () => p._onResume(),
      pause: () => p._onPause(),
      drain: () => p._onDrain(),
      clear: () => p._onClear()
    }, p.dom.addEventListener("ln-api-queue:request-enqueue", p._handlers.enqueue), p.dom.addEventListener("ln-api-queue:ack", p._handlers.ack), p.dom.addEventListener("ln-api-queue:nack", p._handlers.nack), p.dom.addEventListener("ln-api-queue:request-remap", p._handlers.remap), p.dom.addEventListener("ln-api-queue:resolve-create", p._handlers.resolveCreate), p.dom.addEventListener("ln-api-queue:request-resume", p._handlers.resume), p.dom.addEventListener("ln-api-queue:request-pause", p._handlers.pause), p.dom.addEventListener("ln-api-queue:request-drain", p._handlers.drain), p.dom.addEventListener("ln-api-queue:request-clear", p._handlers.clear);
  }, i.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const p = this;
    p.dom.removeEventListener("ln-api-queue:request-enqueue", p._handlers.enqueue), p.dom.removeEventListener("ln-api-queue:ack", p._handlers.ack), p.dom.removeEventListener("ln-api-queue:nack", p._handlers.nack), p.dom.removeEventListener("ln-api-queue:request-remap", p._handlers.remap), p.dom.removeEventListener("ln-api-queue:resolve-create", p._handlers.resolveCreate), p.dom.removeEventListener("ln-api-queue:request-resume", p._handlers.resume), p.dom.removeEventListener("ln-api-queue:request-pause", p._handlers.pause), p.dom.removeEventListener("ln-api-queue:request-drain", p._handlers.drain), p.dom.removeEventListener("ln-api-queue:request-clear", p._handlers.clear), window.removeEventListener("online", p._onlineHandler), p._timers.forEach((y) => clearTimeout(y)), p._timers.clear(), S(p.dom, "ln-api-queue:destroyed", { scope: p.scope }), delete p.dom[e];
  };
  function f(p) {
    const y = p[e];
    y && y._drain();
  }
  F(t, e, i, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: f
  });
})();
function Cn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Et(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function cr(t, e, d) {
  const h = Cn(t);
  return h === null || h < 0 ? 0 : Math.min(h, Math.min(e, d) / 2);
}
function dr(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((d) => !Number.isFinite(d)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function ur(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), d = e[0].trim();
  return d ? {
    field: d,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function hr(t, e) {
  e = e || {};
  const d = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, h = e.xField || "label", l = e.yField || "value", u = e.includeZero !== !1, c = cr(e.padding, d.width, d.height), i = Array.isArray(t) ? t : [], f = [];
  for (let v = 0; v < i.length; v++) {
    const w = i[v] || {}, A = Cn(w[l]);
    A !== null && f.push({
      record: w,
      sourceIndex: v,
      label: w[h] == null ? String(v + 1) : String(w[h]),
      value: A
    });
  }
  if (f.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: d.y + d.height - c
    };
  let p = f[0].value, y = f[0].value;
  for (let v = 1; v < f.length; v++)
    f[v].value < p && (p = f[v].value), f[v].value > y && (y = f[v].value);
  let m = p, _ = y;
  u && (m = Math.min(0, m), _ = Math.max(0, _)), m === _ && (_ === 0 ? _ = 1 : _ > 0 ? m = 0 : _ = 0);
  const g = Math.max(1, d.width - c * 2), r = Math.max(1, d.height - c * 2), a = _ - m, n = d.y + d.height - c - (0 - m) / a * r, o = [];
  for (let v = 0; v < f.length; v++) {
    const w = f[v], A = f.length === 1 ? 0.5 : v / (f.length - 1), C = d.x + c + A * g, L = d.y + d.height - c - (w.value - m) / a * r;
    o.push({
      record: w.record,
      sourceIndex: w.sourceIndex,
      label: w.label,
      value: w.value,
      x: C,
      y: L,
      pointString: Et(C) + "," + Et(L)
    });
  }
  const s = o.map((v) => v.pointString).join(" ");
  let b = "";
  if (o.length > 0) {
    const v = o[0], w = o[o.length - 1], A = Et(v.x) + "," + Et(n), C = Et(w.x) + "," + Et(n);
    b = A + " " + s + " " + C;
  }
  return {
    points: o,
    linePoints: s,
    areaPoints: b,
    count: o.length,
    min: p,
    max: y,
    domainMin: m,
    domainMax: _,
    baselineY: n
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", d = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function h(u, c) {
    u && (u.textContent = c);
  }
  function l(u) {
    this.dom = u, this.name = u.getAttribute(t) || "", this.source = u.getAttribute("data-ln-chart-source") || this.name, this.plot = u.querySelector("[data-ln-chart-plot]"), this.line = u.querySelector("[data-ln-chart-line]"), this.area = u.querySelector("[data-ln-chart-area]"), this.labels = u.querySelector("[data-ln-chart-labels]"), this.empty = u.querySelector("[data-ln-chart-empty]"), this.minimum = u.querySelector("[data-ln-chart-min]"), this.maximum = u.querySelector("[data-ln-chart-max]"), this.count = u.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(i) {
      const f = i.detail || {};
      c._data = Array.isArray(f.data) ? f.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(i) {
      c._setLoading(!!(i.detail && i.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, u.addEventListener("ln-chart:set-data", this._onSetData), u.addEventListener("ln-chart:set-loading", this._onSetLoading), u.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  l.prototype._readOptions = function() {
    const u = this.dom.getAttribute("data-ln-chart-padding"), c = u === null ? NaN : Number(u), i = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: i === "area" || i === "polygon" ? "area" : "line",
      viewBox: this.plot && dr(this.plot.getAttribute("viewBox")) || d
    };
  }, l.prototype._setLoading = function(u) {
    this.dom.classList.toggle("ln-chart--loading", u), this.dom.setAttribute("aria-busy", u ? "true" : "false");
  }, l.prototype._renderLabels = function(u) {
    if (!this.labels || (this.labels.replaceChildren(), u.count === 0)) return;
    const c = this.name + "-label", i = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(i) && !document.querySelector(i)) return;
    const f = pt(this.dom, c, "ln-chart");
    if (!f) return;
    const p = W(this.dom);
    for (const y of u.points) {
      const m = f.cloneNode(!0);
      Dt(m, {
        label: y.label,
        value: tt(y.value, p)
      }), this.labels.appendChild(m);
    }
  }, l.prototype._render = function() {
    const u = this._readOptions(), c = hr(this._data, u);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || u.type !== "area"));
    const i = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", i), this.empty && this.empty.toggleAttribute("hidden", !i);
    const f = W(this.dom);
    h(this.minimum, tt(c.min, f)), h(this.maximum, tt(c.max, f)), h(this.count, tt(c.count, f)), this._renderLabels(c), S(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
    });
  }, l.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, S(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: ur(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, F(t, e, l, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(u, c) {
      const i = u[e];
      if (i) {
        if (c === "data-ln-chart-source" || c === "data-ln-chart-sort") {
          i.requestData();
          return;
        }
        i._render();
      }
    }
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  function d(h) {
    this.dom = h, this._storeName = h.getAttribute(t), this._valueField = h.getAttribute("data-ln-options-value") || "id", this._labelField = h.getAttribute("data-ln-options-label") || "name";
    const l = this;
    return this._onSetData = function(u) {
      l._rebuild(u.detail.data || []);
    }, h.addEventListener("ln-options:set-data", this._onSetData), S(h, "ln-options:request-data", { options: this._storeName }), this;
  }
  d.prototype._rebuild = function(h) {
    const l = this.dom, u = this._valueField, c = this._labelField, i = l.value, f = l.querySelectorAll("option");
    for (let y = f.length - 1; y >= 0; y--)
      f[y].value !== "" && l.removeChild(f[y]);
    for (let y = 0; y < h.length; y++) {
      const m = h[y], _ = document.createElement("option");
      _.value = String(m[u]), _.textContent = m[c] != null ? m[c] : "", l.appendChild(_);
    }
    const p = l.options;
    for (let y = 0; y < p.length; y++)
      if (p[y].value === i) {
        l.value = i;
        break;
      }
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, F(t, e, d, "ln-options");
})();
function fr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const d = t.slice(0, e).trim(), h = t.slice(e + 1).trim();
  if (!d) return null;
  const l = {};
  return l[d] = [h], l;
}
function pr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  function d(h) {
    return this.dom = h, this._storeName = h.getAttribute(t), this._filters = fr(h.getAttribute("data-ln-stat-filter")), this._onSetCount = function(l) {
      h.textContent = pr(l.detail && l.detail.count), h.classList.remove("is-loading");
    }, h.addEventListener("ln-stat:set-count", this._onSetCount), S(h, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, F(t, e, d, "ln-stat");
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", d = "#ln-icon-custom-", h = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  let u = null;
  const c = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), i = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), f = "lni:", p = "lni:v", y = "1";
  function m() {
    try {
      if (localStorage.getItem(p) !== y) {
        for (let s = localStorage.length - 1; s >= 0; s--) {
          const b = localStorage.key(s);
          b && b.indexOf(f) === 0 && localStorage.removeItem(b);
        }
        localStorage.setItem(p, y);
      }
    } catch {
    }
  }
  m();
  function _() {
    return u || (u = document.getElementById(t), u || (u = document.createElementNS("http://www.w3.org/2000/svg", "svg"), u.id = t, u.setAttribute("hidden", ""), u.setAttribute("aria-hidden", "true"), u.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(u, document.body.firstChild))), u;
  }
  function g(s) {
    return s.indexOf(d) === 0 ? i + "/" + s.slice(d.length) + ".svg" : c + "/" + s.slice(e.length) + ".svg";
  }
  function r(s, b) {
    const v = b.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", A = b.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", L = b.match(/<svg([^>]*)>/i), q = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = s, x.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(R) {
      const M = q.match(new RegExp(R + '="([^"]*)"'));
      M && x.setAttribute(R, M[1]);
    }), x.innerHTML = C, _().querySelector("defs").appendChild(x);
  }
  function a(s) {
    if (h.has(s) || l.has(s)) return;
    if (s.indexOf(d) === 0 && !i) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", s);
      return;
    }
    const b = s.slice(1);
    try {
      const w = localStorage.getItem(f + b);
      if (w) {
        r(b, w), h.add(s);
        return;
      }
    } catch {
    }
    l.add(s);
    const v = g(s);
    fetch(v).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      r(b, w), h.add(s), l.delete(s);
      try {
        localStorage.setItem(f + b, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", b, w), l.delete(s);
    });
  }
  function n(s) {
    const b = 'use[href^="' + e + '"], use[href^="' + d + '"]', v = s.querySelectorAll ? s.querySelectorAll(b) : [];
    if (s.matches && s.matches(b)) {
      const w = s.getAttribute("href");
      w && a(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const A = w.getAttribute("href");
      A && a(A);
    });
  }
  function o() {
    n(document), new MutationObserver(function(s) {
      s.forEach(function(b) {
        if (b.type === "childList")
          b.addedNodes.forEach(function(v) {
            v.nodeType === 1 && n(v);
          });
        else if (b.type === "attributes" && b.attributeName === "href") {
          const v = b.target.getAttribute("href");
          v && (v.indexOf(e) === 0 || v.indexOf(d) === 0) && a(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const ye = /* @__PURE__ */ new Set([
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
  "data-ln-data-coordinator-no-autosync",
  "data-ln-data-coordinator-stale",
  "data-ln-data-mapper",
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
function mr(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const d = [];
  for (let h = 0; h <= e.length; h++) d[h] = [h];
  for (let h = 0; h <= t.length; h++) d[0][h] = h;
  for (let h = 1; h <= e.length; h++)
    for (let l = 1; l <= t.length; l++)
      e.charAt(h - 1) === t.charAt(l - 1) ? d[h][l] = d[h - 1][l - 1] : d[h][l] = Math.min(
        d[h - 1][l - 1] + 1,
        d[h][l - 1] + 1,
        d[h - 1][l] + 1
      );
  return d[e.length][t.length];
}
function gr(t, e = ye) {
  if (e.has(t)) return null;
  let d = null, h = 1 / 0;
  for (const u of e) {
    const c = mr(t, u);
    c < h && (h = c, d = u);
  }
  const l = Math.max(3, Math.floor(t.length * 0.4));
  return h <= l ? d : null;
}
function Ln(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function _r(t = document) {
  const e = t.ownerDocument || t, d = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!d) return [];
  const h = [], l = [d, ...d.querySelectorAll("*")];
  for (let u = 0; u < l.length; u++) {
    const c = l[u];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && f.name.endsWith("-for")) {
          const p = (f.value || "").trim();
          if (!p) {
            h.push({
              type: "id-empty",
              element: c,
              attribute: f.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${c.tagName.toLowerCase()} ${f.name}="">.`
            });
            continue;
          }
          e.getElementById(p) || e.querySelector("#" + Ln(p)) || h.push({
            type: "id-unresolved",
            element: c,
            attribute: f.name,
            targetId: p,
            message: `[ln-debug] Unresolved ID reference: <${c.tagName.toLowerCase()} ${f.name}="${p}"> targets "#${p}", but no element with id="${p}" exists in the document.`
          });
        }
      }
  }
  return h;
}
function br(t = document) {
  const e = t.ownerDocument || t, d = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!d) return [];
  const h = [], l = [d, ...d.querySelectorAll("*")];
  for (let u = 0; u < l.length; u++) {
    const c = l[u];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && (f.name.endsWith("-source") || f.name.endsWith("-store")) && f.name !== "data-ln-data-store") {
          const y = (f.value || "").trim();
          if (!y) {
            h.push({
              type: "store-empty",
              element: c,
              attribute: f.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${c.tagName.toLowerCase()} ${f.name}="">.`
            });
            continue;
          }
          const m = Ln(y), _ = e.querySelector(`[data-ln-data-store="${m}"], [data-ln-store="${m}"]`), g = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(y);
          !_ && !g && h.push({
            type: "store-unresolved",
            element: c,
            attribute: f.name,
            storeName: y,
            message: `[ln-debug] Unresolved store reference: <${c.tagName.toLowerCase()} ${f.name}="${y}"> targets store "${y}", but no [data-ln-data-store="${y}"] exists in the document.`
          });
        }
      }
  }
  return h;
}
function yr(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const d = [], h = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && h.unshift(e);
  const l = /* @__PURE__ */ new Map();
  for (let u = 0; u < h.length; u++) {
    const c = h[u], i = (c.getAttribute("data-ln-data-store") || "").trim();
    i && (l.has(i) || l.set(i, []), l.get(i).push(c));
  }
  for (const [u, c] of l.entries())
    c.length > 1 && d.push({
      type: "store-duplicate",
      storeName: u,
      elements: c,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${u}". Store names must be unique across the document.`
    });
  return d;
}
function vr(t = document, e = ye) {
  const d = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!d) return [];
  const h = [], l = [d, ...d.querySelectorAll("*")];
  for (let u = 0; u < l.length; u++) {
    const c = l[u];
    if (c.attributes)
      for (let i = 0; i < c.attributes.length; i++) {
        const f = c.attributes[i];
        if (f.name.startsWith("data-ln-") && !e.has(f.name)) {
          const p = gr(f.name, e), y = p ? ` Did you mean "${p}"?` : "";
          h.push({
            type: "attribute-unknown",
            element: c,
            attribute: f.name,
            suggestion: p,
            message: `[ln-debug] Unknown attribute "${f.name}" on <${c.tagName.toLowerCase()}>.${y}`
          });
        }
      }
  }
  return h;
}
function de(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const d = e.validAttributes || ye, h = _r(t), l = br(t), u = yr(t), c = vr(t, d), i = [
    ...h,
    ...l,
    ...u,
    ...c
  ];
  if (!e.silent)
    for (let f = 0; f < i.length; f++)
      console.warn(i[f].message);
  return {
    idIssues: h,
    storeIssues: l,
    uniquenessIssues: u,
    spellingIssues: c,
    total: i.length
  };
}
let qt = null;
function Ht(t = typeof document < "u" ? document : null, e = 50, d = null) {
  if (!t) return;
  qt && (clearTimeout(qt), qt = null);
  function h() {
    qt = setTimeout(() => {
      qt = null;
      const l = de(t);
      d && d(l);
    }, e);
  }
  Ge() > 0 ? it(h) : h();
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  function d(h) {
    return this.dom = h, Ht(h.ownerDocument || document), this;
  }
  d.prototype.verify = function(h, l) {
    return de(h || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, d.prototype.destroy = function() {
    delete this.dom[e];
  }, typeof window < "u" && (window.lnDebug = {
    verify: function(h, l) {
      return de(h || document, l);
    },
    schedule: function(h, l, u) {
      return Ht(h || document, l, u);
    }
  }), F(t, e, d, "ln-debug", {
    onInit: function(h) {
      typeof document < "u" && Ht(h && h.ownerDocument ? h.ownerDocument : document);
    },
    onSubtreeChange: function(h) {
      typeof document < "u" && Ht(h && h.ownerDocument ? h.ownerDocument : document);
    }
  });
})();
