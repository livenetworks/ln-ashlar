function xe(t, e, c) {
  const d = parseInt(t.getAttribute(e), 10);
  return isNaN(d) ? c : d;
}
function be(t, e) {
  return t.hasAttribute(e);
}
function Xn(t, e) {
  return (t.getAttribute(e) || "").split(",").map((c) => c.trim()).filter(Boolean);
}
function Yn(t, e, c) {
  for (const d in c) {
    const [m, g, n] = c[d];
    Object.defineProperty(t, d, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return m(e, g, n);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function Jn(t) {
  const e = {};
  for (const c in t) {
    const d = t[c];
    !d || !d.prop || (e[d.prop] = [d.read, c, d.fallback]);
  }
  return e;
}
function Zn(t) {
  const e = {};
  for (const c in t) {
    const d = t[c];
    d && d.effect && (e[c] = d.effect);
  }
  return Object.keys(e).length ? e : null;
}
function ye(t) {
  let e = !1;
  for (let c = 0; c < t.length; c++) {
    const d = t[c];
    if (!(d === "" || d == null) && (e = !0, !Number.isFinite(Number(d))))
      return "string";
  }
  return e ? "number" : "string";
}
function ve(t, e, c, d) {
  if (c === "number") {
    const n = parseFloat(t), l = parseFloat(e);
    return (isNaN(n) ? 0 : n) - (isNaN(l) ? 0 : l);
  }
  const m = t != null ? String(t) : "", g = e != null ? String(e) : "";
  return d ? d.compare(m, g) : m < g ? -1 : m > g ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const ie = {};
function Wt(t, e) {
  ie[t] || (ie[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const c = ie[t];
  return c ? c.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function ti(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function ei(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function T(t, e, c) {
  const d = c || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: d
  }));
}
function Y(t, e, c) {
  const d = c || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d);
  const m = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d
  });
  return t.dispatchEvent(m), m;
}
function Xe(t, e, c) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const d = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  d[c] = t.name, T(t.dom, e, d);
}
function dt(t, e) {
  if (!t || !e) return t;
  const c = t.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < c.length; n++) {
    const l = c[n], o = l.getAttribute("data-ln-field");
    e[o] != null && (l.textContent = e[o]);
  }
  const d = t.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < d.length; n++) {
    const l = d[n], o = l.getAttribute("data-ln-attr").split(",");
    for (let f = 0; f < o.length; f++) {
      const u = o[f].trim().split(":");
      if (u.length !== 2) continue;
      const y = u[0].trim(), w = u[1].trim();
      e[w] != null && l.setAttribute(y, e[w]);
    }
  }
  const m = t.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < m.length; n++) {
    const l = m[n], o = l.getAttribute("data-ln-show");
    o in e && l.classList.toggle("hidden", !e[o]);
  }
  const g = t.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < g.length; n++) {
    const l = g[n], o = l.getAttribute("data-ln-class").split(",");
    for (let f = 0; f < o.length; f++) {
      const u = o[f].trim().split(":");
      if (u.length !== 2) continue;
      const y = u[0].trim(), w = u[1].trim();
      w in e && l.classList.toggle(y, !!e[w]);
    }
  }
  return t;
}
function ni(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const c = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let d = 0; d < c.length; d++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", c[d], e ?? null), c[d].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      dt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let c = 0; c < e.length; c++)
        e[c].textContent = "";
    }
})));
function Pt(t, e) {
  if (!t || !e) return t;
  const c = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; c.nextNode(); ) {
    const g = c.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(n, l) {
        return e[l] !== void 0 ? e[l] : "";
      }
    ));
  }
  const d = function(g, n) {
    return e[n] !== void 0 ? e[n] : "";
  }, m = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && m.push(t);
  for (let g = 0; g < m.length; g++) {
    const n = m[g], l = n.attributes;
    for (let o = 0; o < l.length; o++) {
      const f = l[o];
      f.value.indexOf("{{") !== -1 && n.setAttribute(f.name, f.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function ii(t, e, c, d, m, g) {
  const n = {};
  for (let o = 0; o < t.children.length; o++) {
    const f = t.children[o], u = f.getAttribute("data-ln-render-key");
    u && (n[u] = f);
  }
  const l = document.createDocumentFragment();
  for (let o = 0; o < e.length; o++) {
    const f = e[o], u = String(d(f));
    let y = n[u];
    if (y)
      m(y, f, o);
    else {
      const w = Wt(c, g);
      if (!w || (Pt(w, f), y = w.firstElementChild, !y)) continue;
      y.setAttribute("data-ln-render-key", u), m(y, f, o);
    }
    l.appendChild(y);
  }
  t.textContent = "", t.appendChild(l);
}
function ht(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ht(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function vt(t, e, c) {
  if (t) {
    const d = t.querySelector('[data-ln-template="' + e + '"]');
    if (d) return d.content.cloneNode(!0);
  }
  return Wt(e, c);
}
function Yt(t, e) {
  const c = {}, d = t.querySelectorAll("[" + e + "]");
  for (let m = 0; m < d.length; m++)
    c[d[m].getAttribute(e)] = d[m].textContent, d[m].remove();
  return c;
}
function le(t, e, c, d) {
  if (t.nodeType !== 1) return;
  const g = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", n = Array.from(t.querySelectorAll(g));
  t.matches && t.matches(g) && n.push(t);
  for (const l of n)
    l[c] || (window.lnCore._persistSink && l.hasAttribute("data-ln-persist") && window.lnCore._persistSink(l, e), l[c] = new d(l));
}
function Ft(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Ye(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function ri(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Je(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function oi(t, e) {
  return !t || !document.contains(t) || Je(t) || e && typeof t[e] != "function" ? !1 : Ft(t);
}
function si(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Ze(t, e) {
  const c = !!(e && e.typed), d = e && e.exclude, m = {}, g = t.elements, n = {};
  if (c)
    for (let l = 0; l < g.length; l++) {
      const o = g[l];
      o.name && o.type === "checkbox" && !o.disabled && (n[o.name] = (n[o.name] || 0) + 1);
    }
  for (let l = 0; l < g.length; l++) {
    const o = g[l];
    if (!(!o.name || o.disabled || o.type === "file" || o.type === "submit" || o.type === "button") && !(d && o.matches && o.matches(d)))
      if (o.type === "checkbox")
        c && n[o.name] === 1 ? m[o.name] = o.checked : (m[o.name] || (m[o.name] = []), o.checked && m[o.name].push(o.value));
      else if (o.type === "radio")
        o.checked && (m[o.name] = o.value);
      else if (o.type === "select-multiple") {
        m[o.name] = [];
        for (let f = 0; f < o.options.length; f++)
          o.options[f].selected && m[o.name].push(o.options[f].value);
      } else if (c && o.type === "hidden")
        m[o.name] = o.value;
      else if (c && (o.type === "number" || o.type === "range")) {
        const f = Number(o.value);
        m[o.name] = o.value === "" || isNaN(f) ? null : f;
      } else
        m[o.name] = o.value;
  }
  return m;
}
function ai(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function tn(t, e) {
  const c = t.elements, d = [], m = {};
  for (let g = 0; g < c.length; g++) {
    const n = c[g];
    n.name && n.type === "checkbox" && (m[n.name] = (m[n.name] || 0) + 1);
  }
  for (let g = 0; g < c.length; g++) {
    const n = c[g];
    if (n.type === "file" || n.type === "submit" || n.type === "button") continue;
    const l = n.getAttribute("data-ln-fill-as") || n.name;
    if (!l || !(l in e)) continue;
    const o = e[l];
    if (n.type === "checkbox") {
      if (Array.isArray(o))
        n.checked = o.indexOf(n.value) !== -1;
      else if (m[n.name] > 1) {
        const f = String(o).split(",").map(function(u) {
          return u.trim();
        });
        n.checked = f.indexOf(n.value) !== -1;
      } else
        n.checked = ai(o);
      d.push(n);
    } else if (n.type === "radio")
      n.checked = n.value === String(o), d.push(n);
    else if (n.type === "select-multiple") {
      if (Array.isArray(o))
        for (let f = 0; f < n.options.length; f++)
          n.options[f].selected = o.indexOf(n.options[f].value) !== -1;
      d.push(n);
    } else
      n.value = o, d.push(n);
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
function J(t) {
  const e = t ? t.closest("[lang]") : null, c = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!c) return "en-US";
  const d = c.trim().toLowerCase();
  return d.indexOf("-") === -1 && ke[d] ? ke[d] : c;
}
function Jt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ht(function() {
    new MutationObserver(function() {
      T(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
function Lt(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.textContent.trim();
}
function en(t, e, { get: c, set: d }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return c ? c.call(this) : e.get.call(this);
    },
    set: function(m) {
      d ? d.call(this, m, (g) => e.set.call(this, g)) : e.set.call(this, m);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function li() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function re() {
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
function ut(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function rn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] }, window.lnCore._attrRegistry;
}
function on(t) {
  const e = rn(), c = t.observed || [];
  for (let d = 0; d < c.length; d++) {
    const m = c[d];
    e.byAttr.has(m) || e.byAttr.set(m, []), e.byAttr.get(m).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t), t.persist && e.persist.push(t);
}
function ci(t) {
  const e = t.target, c = t.attributeName;
  if (t.oldValue === e.getAttribute(c)) return;
  const d = rn(), m = d.byAttr.get(c);
  if (window.lnCore._debugSink && (c.indexOf("data-ln-") === 0 || m) && window.lnCore._debugSink("attr", c, e, { oldValue: t.oldValue, newValue: e.getAttribute(c) }), c.indexOf("data-ln-") === 0)
    for (let g = 0; g < d.reactive.length; g++) {
      const n = d.reactive[g];
      if (!e[n.attribute]) continue;
      const l = n.effects && n.effects[c];
      l ? l(e, c, t.oldValue) : n.onAttrChange && (!n.declared || n.declared.has(c)) && n.onAttrChange(e, c, t.oldValue);
    }
  if (m)
    for (let g = 0; g < m.length; g++) {
      const n = m[g];
      if (n.handler) {
        n.handler(e, c, t.oldValue);
        continue;
      }
      n.onAttributeChange && e[n.attribute] ? n.onAttributeChange(e, c) : (le(e, n.selector, n.attribute, n.ComponentFn), n.onInit && n.onInit(e));
    }
}
function sn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ht(function() {
    new MutationObserver(function(e) {
      for (let c = 0; c < e.length; c++)
        ci(e[c]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Bt(t, e) {
  on({ observed: t, handler: e }), sn();
}
function U(t, e, c, d, m = {}) {
  const g = m.extraAttributes || [], n = m.onAttributeChange || null, l = m.onSubtreeChange || null, o = m.onInit || null, f = m.onAttrChange || null, u = m.effects || null, y = m.attributes || null, w = y ? Zn(y) : u, E = y ? new Set(Object.keys(y)) : null, _ = m.persist || null;
  function A(s) {
    const i = s || document.body;
    le(i, t, e, c), o && o(i);
  }
  const a = [];
  if (t.indexOf("[") !== -1) {
    const s = /\[([\w-]+)/g;
    let i;
    for (; (i = s.exec(t)) !== null; )
      a.push(i[1]);
  } else
    a.push(t);
  on({
    selector: t,
    attribute: e,
    ComponentFn: c,
    onInit: o,
    observed: a.concat(g),
    onAttributeChange: n,
    onAttrChange: f,
    effects: w,
    declared: E,
    persist: _
  }), sn(), ht(function() {
    new MutationObserver(function(i) {
      for (let h = 0; h < i.length; h++) {
        const v = i[h];
        if (v.type === "childList") {
          if (l && v.target) {
            const b = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", S = v.target.nodeType === 1 ? v.target.matches(b) ? v.target : v.target.closest(b) : v.target.parentElement ? v.target.parentElement.closest(b) : null;
            S && l(S, v);
          }
          for (let r = 0; r < v.addedNodes.length; r++) {
            const b = v.addedNodes[r];
            b.nodeType === 1 && (le(b, t, e, c), o && o(b));
          }
          for (let r = 0; r < v.removedNodes.length; r++) {
            const b = v.removedNodes[r];
            if (b.nodeType === 1) {
              const L = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", q = Array.from(b.querySelectorAll(L));
              b.matches && b.matches(L) && q.push(b);
              for (let k = 0; k < q.length; k++) {
                const D = q[k];
                if (!document.contains(D)) {
                  const I = D[e];
                  I && typeof I.destroy == "function" && I.destroy();
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
  }, d || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[e] = A;
  function p() {
    nn() > 0 ? ut(function() {
      A(document.body);
    }) : A(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p(), A;
}
function an(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const c = e.getAttribute("href");
  return !(!c || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || c.startsWith("mailto:") || c.startsWith("tel:") || c === "#" || c.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function gt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, c) => c === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function It(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function ln(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (c) {
    return console.error(`[${e}] Invalid headers JSON:`, c), {};
  }
}
const cn = {};
function di(t, e) {
  cn[t] = e;
}
function ui(t) {
  return cn[t] || { ingress: (e) => e, egress: (e) => e };
}
const dn = {};
function we(t, e) {
  if (!t || typeof e != "object") return;
  const c = t.toLowerCase().split("-")[0];
  dn[c] = e;
}
function At(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return dn[e] || null;
}
we("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = di, window.lnCore.getDataMapper = ui, window.lnCore.registerLocaleFallback = we, window.lnCore.getLocaleFallback = At, window.lnCore.fillTemplate = Pt, window.lnCore.fill = dt, window.lnCore.lnFill = ni, window.lnCore.renderList = ii, window.lnCore.ensureLocaleObserver = Jt);
function Zt(t, e) {
  let c = !1;
  return function() {
    c || (c = !0, queueMicrotask(function() {
      c = !1, t();
    }));
  };
}
function un(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, c = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, m = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const g = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, n = typeof t.onChange == "function" ? t.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
  let u = 0, y = 0, w = 0, E = { sort: null, filters: {}, search: "" }, _ = null, A = 0, a = 0, p = !1;
  function s(r) {
    o.set(r, ++A);
  }
  function i() {
    return !!(E && (E.search || E.filters && Object.keys(E.filters).length));
  }
  function h() {
    if (l.size <= e) return;
    const r = Array.from(l.keys()).sort(function(S, L) {
      return (o.get(S) || 0) - (o.get(L) || 0);
    });
    let b = 0;
    for (; l.size > e && b < r.length; )
      l.delete(r[b]), o.delete(r[b]), b++;
  }
  function v(r, b) {
    f.add(r), g(E, r, b);
  }
  return {
    get: function(r) {
      return l.get(r);
    },
    has: function(r) {
      return l.has(r);
    },
    peek: function() {
      return l.size ? l.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return y;
    },
    get queryGen() {
      return w;
    },
    get size() {
      return l.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(r, b) {
      clearTimeout(_), a = r;
      for (let I = r; I < b; I++)
        l.has(I) && s(I);
      if (u <= 0) return;
      const S = Math.max(0, r - d), L = Math.min(u, b + d), q = Math.floor(S / c), k = Math.floor(Math.max(0, L - 1) / c);
      let D = -1;
      for (let I = q; I <= k; I++) {
        const O = I * c, N = Math.min(c, u - O);
        let P = !1;
        const H = Math.max(O, S), K = Math.min(O + N, L);
        for (let W = H; W < K; W++)
          if (!l.has(W)) {
            P = !0;
            break;
          }
        if (P && !f.has(O)) {
          D = O;
          break;
        }
      }
      D !== -1 && (_ = setTimeout(function() {
        v(D, c);
      }, m));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(r) {
      if (r = r || {}, r.queryGen != null && r.queryGen !== w) return !1;
      const b = r.offset || 0, S = r.data || [];
      let L = 0;
      for (let q = 0; q < S.length; q++)
        S[q] != null && L++;
      if (L === 0 && (r.provisional || r.filtered > 0))
        return f.delete(b), !1;
      p && (l.clear(), o.clear(), p = !1), r.provisional || (y = r.total != null ? r.total : y, u = r.filtered != null ? r.filtered : r.data ? r.data.length : u);
      for (let q = 0; q < S.length; q++)
        S[q] != null && (l.set(b + q, S[q]), s(b + q));
      return f.delete(b), h(), n(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(r) {
      r && (E = r), v(0, c);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(r) {
      w++, f.clear(), clearTimeout(_), r && (E = r), p = !0, v(0, c);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      w++, f.clear(), clearTimeout(_), p = !0;
      const r = Math.max(0, Math.floor(a / c) * c);
      v(r, c);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(r) {
      f.delete(r);
    },
    destroy: function() {
      clearTimeout(_), l.clear(), o.clear(), f.clear();
    },
    configure: function(r) {
      r = r || {};
      let b = !1;
      if (r.windowSize != null && r.windowSize > 0 && r.windowSize !== e) {
        const S = r.windowSize < e;
        e = r.windowSize, S && h(), b = !0;
      }
      r.pageSize != null && r.pageSize > 0 && (c = r.pageSize), r.threshold != null && r.threshold >= 0 && (d = r.threshold), r.fetchDebounce != null && r.fetchDebounce >= 0 && (m = r.fetchDebounce), b && n();
    },
    setGrandTotal: function(r) {
      r == null || isNaN(r) || r < 0 || (y = r, i() || (u = r), n());
    }
  };
}
function hn(t) {
  return (t || "").replace(/^#/, "");
}
function te(t) {
  const e = t === void 0 ? location.hash : t, c = {}, d = hn(e);
  if (!d) return c;
  const m = d.split("&");
  for (let g = 0; g < m.length; g++) {
    const n = m[g];
    if (!n) continue;
    const l = n.indexOf(":"), o = l > -1 ? n.slice(0, l) : n, f = l > -1 ? n.slice(l + 1) : "";
    if (o)
      try {
        c[o] = decodeURIComponent(f);
      } catch {
        c[o] = f;
      }
  }
  return c;
}
function nt(t) {
  if (!t) return null;
  const e = te();
  return t in e ? e[t] : null;
}
function at(t, e) {
  if (!t) return;
  const c = te();
  e == null ? delete c[t] : c[t] = String(e);
  const m = Object.keys(c).map(function(g) {
    const n = c[g];
    return n === "" ? g : g + ":" + encodeURIComponent(n);
  }).join("&");
  hn(location.hash) !== m && (location.hash = m);
}
function Ee(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function mt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const c = t.getAttribute("data-ln-hash");
  if (c && c.trim() !== "") return c.trim();
  const d = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return d ? e ? d + "-" + e : d : e || null;
}
function fn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function ce(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function pn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function de(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const c = t.slice(0, e), d = t.slice(e + 1), m = d ? d.split(",").map(function(g) {
    try {
      return decodeURIComponent(g);
    } catch {
      return g;
    }
  }).filter(Boolean) : [];
  return { key: c, values: m };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = te, window.lnCore.hashGet = nt, window.lnCore.hashSet = at, window.lnCore.hashLinkClick = Ee, window.lnCore.resolveHashNamespace = mt, window.lnCore.hashSortEncode = fn, window.lnCore.hashSortDecode = ce, window.lnCore.hashFilterEncode = pn, window.lnCore.hashFilterDecode = de);
function Gt(t, e, c, d) {
  const m = typeof d == "number" ? d : 4, g = window.innerWidth, n = window.innerHeight, l = e.width, o = e.height, f = (c || "bottom").split("-"), u = f[0], y = f[1] === "start" || f[1] === "end" ? f[1] : "center", w = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, E = w[u] || w.bottom;
  function _(i) {
    return i === "top" || i === "bottom" ? y === "start" ? t.left : y === "end" ? t.right - l : t.left + (t.width - l) / 2 : y === "start" ? t.top : y === "end" ? t.bottom - o : t.top + (t.height - o) / 2;
  }
  function A(i) {
    let h, v, r = !0;
    return i === "top" ? (h = t.top - m - o, v = _(i), h < 0 && (r = !1)) : i === "bottom" ? (h = t.bottom + m, v = _(i), h + o > n && (r = !1)) : i === "left" ? (h = _(i), v = t.left - m - l, v < 0 && (r = !1)) : (h = _(i), v = t.right + m, v + l > g && (r = !1)), { top: h, left: v, side: i, fits: r };
  }
  let a = null;
  for (let i = 0; i < E.length; i++) {
    const h = A(E[i]);
    if (h.fits) {
      a = h;
      break;
    }
  }
  a || (a = A(E[0]));
  let p = a.top, s = a.left;
  return l >= g ? s = 0 : (s < 0 && (s = 0), s + l > g && (s = g - l)), o >= n ? p = 0 : (p < 0 && (p = 0), p + o > n && (p = n - o)), { top: p, left: s, placement: a.side };
}
function ue(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, c = e.visibility, d = e.display, m = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const g = t.offsetWidth, n = t.offsetHeight;
  return e.visibility = c, e.display = d, e.position = m, { width: g, height: n };
}
let yt = null;
async function Ie(t) {
  if (!t) {
    yt = null;
    return;
  }
  try {
    const e = new TextEncoder(), c = await crypto.subtle.digest("SHA-256", e.encode(t));
    yt = await crypto.subtle.importKey(
      "raw",
      c,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    console.error("[ln-core/crypto] Key derivation failed:", e), yt = null;
  }
}
function _t() {
  return yt;
}
async function hi(t, e = yt) {
  const c = e || yt;
  if (!c || t === void 0 || t === null) return t;
  try {
    const d = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), g = typeof t == "string" ? t : JSON.stringify(t), n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      c,
      d.encode(g)
    ), l = btoa(String.fromCharCode(...m)), o = btoa(String.fromCharCode(...new Uint8Array(n)));
    return {
      encrypted: !0,
      iv: l,
      data: o
    };
  } catch (d) {
    return console.error("[ln-core/crypto] Encryption failed:", d), t;
  }
}
async function fi(t, e = yt) {
  const c = e || yt;
  if (!t || !t.encrypted || !c) return t;
  try {
    const d = new TextDecoder(), m = Uint8Array.from(atob(t.iv), (o) => o.charCodeAt(0)), g = Uint8Array.from(atob(t.data), (o) => o.charCodeAt(0)), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: m },
      c,
      g
    ), l = d.decode(n);
    try {
      return JSON.parse(l);
    } catch {
      return l;
    }
  } catch (d) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", d), { ...t, decryptionError: !0 };
  }
}
function mn(t, e = 100, c = 0) {
  const d = parseFloat(String(t)) || 0, m = parseFloat(String(e)) || 100, g = parseFloat(String(c)) || 0, n = Math.max(g, Math.min(d, m)), l = m - g;
  let o = 0;
  return l > 0 && (o = (n - g) / l * 100), o = Math.max(0, Math.min(100, o)), {
    value: d,
    min: g,
    max: m,
    clampedValue: n,
    percentage: o
  };
}
function it(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const c = e < 1e11 ? e * 1e3 : e, d = new Date(c);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof t == "string") {
    const c = t.trim();
    if (!c) return null;
    const d = new Date(c);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function Dt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), c = String(t.getMonth() + 1).padStart(2, "0"), d = String(t.getDate()).padStart(2, "0");
  return e + "-" + c + "-" + d;
}
const pt = {};
function Qt(t) {
  const e = t || "default";
  if (!pt[e]) {
    const c = new Intl.NumberFormat(t, { useGrouping: !0 }), d = c.formatToParts(1234.5);
    let m = "", g = ".";
    for (let n = 0; n < d.length; n++)
      d[n].type === "group" && (m = d[n].value), d[n].type === "decimal" && (g = d[n].value);
    pt[e] = { groupSep: m, decimalSep: g, fmt: c };
  }
  return pt[e];
}
function gn(t, e, c) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), c && c !== "." && (d = d.replace(c, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function pi(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const c = t.trim();
  if (c === "" || c === "-") return NaN;
  const d = Qt(e), m = gn(c, d.groupSep, d.decimalSep);
  if (m === "" || m === "-") return NaN;
  const g = parseFloat(m);
  return isNaN(g) ? NaN : g;
}
function st(t, e, c = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", m = c.maxDecimals != null ? parseInt(c.maxDecimals, 10) : null, g = c.userDecimals != null ? c.userDecimals : null;
  if (m !== null) {
    const n = d + "|max:" + m;
    return pt[n] || (pt[n] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: m
    })), pt[n].format(t);
  }
  if (g !== null && g > 0) {
    const n = d + "|exact:" + g;
    return pt[n] || (pt[n] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: g,
      maximumFractionDigits: g
    })), pt[n].format(t);
  }
  return Qt(e).fmt.format(t);
}
function he(t) {
  return String(t || "").trim().toLowerCase();
}
function _n(t) {
  const e = he(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function mi(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((c) => c.trim()).filter(Boolean);
  return e.length ? e : null;
}
function bn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const c = String(t).toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (c.indexOf(e[d]) === -1) return !1;
  return !0;
}
function gi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ae(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const c = String(t).trim().toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (String(e[d]).trim().toLowerCase() === c)
      return !0;
  return !1;
}
function _i(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function bi(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function yi(t, e) {
  return (e || "GET") + " " + (t || "");
}
function vi(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  function d(n, l) {
    l = l || {};
    const o = _i(n), f = bi(n, l), u = yi(o, f);
    vi(f) && e.has(u) && (e.get(u).abort(), e.delete(u));
    const y = new AbortController(), w = l.signal;
    let E = null;
    w && (w.aborted ? y.abort(w.reason) : (E = function() {
      y.abort(w.reason);
    }, w.addEventListener("abort", E, { once: !0 })));
    const _ = Object.assign({}, l, { signal: y.signal });
    return e.set(u, y), t(n, _).finally(function() {
      w && E && w.removeEventListener("abort", E), e.get(u) === y && e.delete(u);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function m(n) {
    if (!n.detail || !n.detail.url) return;
    const l = n.target, o = (n.detail.method || (n.detail.body ? "POST" : "GET")).toUpperCase(), f = n.detail.key;
    f && c.has(f) && (c.get(f).abort(), c.delete(f));
    const u = new AbortController(), y = n.detail.signal;
    let w = null;
    y && (y.aborted ? u.abort(y.reason) : (w = function() {
      u.abort(y.reason);
    }, y.addEventListener("abort", w, { once: !0 }))), f && c.set(f, u);
    const E = { method: o, signal: u.signal };
    n.detail.body !== void 0 && (E.body = n.detail.body), window.fetch(n.detail.url, E).then(function(_) {
      y && w && y.removeEventListener("abort", w), f && c.get(f) === u && c.delete(f), T(l, "ln-http:response", {
        ok: _.ok,
        status: _.status,
        response: _
      });
    }).catch(function(_) {
      y && w && y.removeEventListener("abort", w), f && c.get(f) === u && c.delete(f), !(_ && _.name === "AbortError") && T(l, "ln-http:error", {
        ok: !1,
        status: 0,
        error: _
      });
    });
  }
  function g(n) {
    const l = n.detail || {};
    l.all ? window.lnHttp.cancelAll() : l.key ? window.lnHttp.cancelByKey(l.key) : l.url && window.lnHttp.cancel(l.url);
  }
  document.addEventListener("ln-http:request", m), document.addEventListener("ln-http:cancel", g), window.lnHttp = {
    cancel: function(n) {
      let l = !1;
      return e.forEach(function(o, f) {
        f.endsWith(" " + n) && (o.abort(), e.delete(f), l = !0);
      }), l;
    },
    cancelByKey: function(n) {
      return c.has(n) ? (c.get(n).abort(), c.delete(n), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(n) {
        n.abort();
      }), e.clear(), c.forEach(function(n) {
        n.abort();
      }), c.clear();
    },
    get inflight() {
      const n = [];
      return e.forEach(function(l, o) {
        const f = o.indexOf(" ");
        n.push({ method: o.slice(0, f), url: o.slice(f + 1) });
      }), c.forEach(function(l, o) {
        n.push({ key: o });
      }), n;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", m), document.removeEventListener("ln-http:cancel", g), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const c = /* @__PURE__ */ new Map();
  function d(m) {
    if (this.dom = m, this.url = m.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    li(), this._held = !0;
    const g = this, n = this.url;
    let l = c.get(n);
    return l || (l = fetch(n).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw c.delete(n), o;
    }), c.set(n, l)), l.then(function(o) {
      if (g._destroyed) return;
      const f = document.createElement("template");
      f.innerHTML = o, g.dom.content.appendChild(f.content), T(g.dom, "ln-include:loaded", { target: g.dom, url: g.url }), g._held && (g._held = !1, re());
    }).catch(function(o) {
      g._destroyed || (console.error("[ln-include] Failed to fetch template from " + g.url + ":", o), T(g.dom, "ln-include:error", { target: g.dom, url: g.url, error: o }), g._held && (g._held = !1, re()));
    }), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, re()), delete this.dom[e]);
  }, U(t, e, d, "ln-include");
})();
(function() {
  const t = "data-ln-form", e = "lnForm", c = "data-ln-form-action-edit", d = "data-ln-form-action-method";
  if (window[e] !== void 0) return;
  function m(g) {
    this.dom = g, this._baseAction = g.getAttribute("action") || "";
    const n = this;
    return this._onLnFill = function(l) {
      l.target === n.dom && (l.detail ? (n.fill(l.detail), n._applyActionMode(l.detail)) : n.dom.reset());
    }, this._onReset = function() {
      n._applyActionMode(null);
    }, g.addEventListener("ln-fill", this._onLnFill), g.addEventListener("reset", this._onReset), this;
  }
  m.prototype.fill = function(g) {
    const n = tn(this.dom, g);
    for (let l = 0; l < n.length; l++) {
      const o = n[l], f = o.tagName === "SELECT" || o.type === "checkbox" || o.type === "radio";
      o.dispatchEvent(new Event(f ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let g = this.dom.querySelector('input[name="_method"]');
    return g || (g = document.createElement("input"), g.type = "hidden", g.name = "_method", g.value = "", this.dom.appendChild(g)), g;
  }, m.prototype._applyActionMode = function(g) {
    if (!this.dom.hasAttribute(c)) return;
    const n = g && g.id != null && g.id !== "" ? g.id : null, l = this._ensureMethodInput();
    if (n !== null) {
      const o = this.dom.getAttribute(c);
      o ? this.dom.setAttribute("action", o.replace(":id", encodeURIComponent(n))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(n)), l.value = this.dom.getAttribute(d) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, m, "ln-form");
})();
const De = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Re(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function wi(t, e) {
  const c = [];
  if (t) {
    const d = Object.keys(De);
    for (let m = 0; m < d.length; m++) {
      const g = d[m], n = De[g];
      t[n] && c.push(g);
    }
  }
  if (e) {
    const d = Array.from(e);
    for (let m = 0; m < d.length; m++)
      d[m] && c.indexOf(d[m]) === -1 && c.push(d[m]);
  }
  return c;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", c = "data-ln-validate-errors", d = "data-ln-validate-error", m = "ln-validate-valid", g = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  function n(l) {
    this.dom = l, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, f = l.tagName, u = l.type, y = f === "SELECT" || u === "checkbox" || u === "radio";
    this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(_) {
      const A = _.detail && _.detail.error;
      if (!A) return;
      o._customErrors.add(A), o._touched = !0;
      const a = l.closest(".form-element");
      if (a) {
        const p = a.querySelector("[" + d + '="' + A + '"]');
        p && p.classList.remove("hidden");
      }
      l.classList.remove(m), l.classList.add(g), l.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(_) {
      const A = _.detail && _.detail.error, a = l.closest(".form-element");
      if (A) {
        if (o._customErrors.delete(A), a) {
          const p = a.querySelector("[" + d + '="' + A + '"]');
          p && p.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(p) {
          if (a) {
            const s = a.querySelector("[" + d + '="' + p + '"]');
            s && s.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, y || l.addEventListener("input", this._onInput), l.addEventListener("change", this._onChange), l.addEventListener("ln-validate:set-custom", this._onSetCustom), l.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = l.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      o.reset();
    }, this._onValidateRequest = function(_) {
      o._touched = !0, !o.validate() && _.detail && _.detail.invalidFields && _.detail.invalidFields.push(o.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(_) {
      const A = { invalidFields: [] };
      T(w, "ln-validate:request-validate", A), A.invalidFields.length > 0 && (_.preventDefault(), A.invalidFields.sort((a, p) => a.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), A.invalidFields[0].focus());
    }))), (l.value && l.value.trim() !== "" || l.checked) && (this._touched = !0, this.validate()), this;
  }
  n.prototype.validate = function() {
    const l = this.dom, o = l.validity, f = Re(o, this._customErrors.size), u = wi(o, this._customErrors), y = l.closest(".form-element");
    if (y) {
      const E = y.querySelector("[" + c + "]");
      if (E) {
        const _ = E.querySelectorAll("[" + d + "]");
        for (let A = 0; A < _.length; A++) {
          const a = _[A].getAttribute(d);
          _[A].classList.toggle("hidden", !u.includes(a));
        }
      }
    }
    return l.classList.toggle(m, f), l.classList.toggle(g, !f), l.setAttribute("aria-invalid", f ? "false" : "true"), T(l, f ? "ln-validate:valid" : "ln-validate:invalid", { target: l, field: l.name, errors: u }), f;
  }, n.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, g), this.dom.removeAttribute("aria-invalid");
    const l = this.dom.closest(".form-element");
    if (l) {
      const o = l.querySelectorAll("[" + d + "]");
      for (let f = 0; f < o.length; f++)
        o[f].classList.add("hidden");
    }
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      return Re(this.dom.validity, this._customErrors.size);
    }
  }), n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const l = this.dom.form;
    l && (this._onFormReset && l.removeEventListener("reset", this._onFormReset), this._onValidateRequest && l.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(m, g), this.dom.removeAttribute("aria-invalid"), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, n, "ln-validate");
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", c = "data-ln-form-scope";
  if (window[e] !== void 0) return;
  function d(y) {
    if (!y.hasAttribute(t) || y[e]) return;
    y[e] = !0;
    const w = o(y);
    m(w.links), g(w.forms);
  }
  function m(y) {
    for (const w of y) {
      if (w[e + "Trigger"] || w.hostname && w.hostname !== window.location.hostname) continue;
      const E = w.getAttribute("href");
      if (E && E.includes("#")) continue;
      const _ = function(A) {
        if (!an(A, w)) return;
        A.preventDefault();
        const a = w.getAttribute("href");
        a && l("GET", a, null, w);
      };
      w.addEventListener("click", _), w[e + "Trigger"] = _;
    }
  }
  function g(y) {
    for (const w of y) {
      if (w[e + "Trigger"]) continue;
      if (w.hasAttribute(c)) {
        w[e + "ScopeWarned"] || (w[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const E = function(_) {
        if (_.defaultPrevented) return;
        _.preventDefault();
        const A = w.method.toUpperCase(), a = w.action, p = new FormData(w);
        for (const s of w.querySelectorAll('button, input[type="submit"]'))
          s.disabled = !0;
        l(A, a, p, w, function() {
          for (const s of w.querySelectorAll('button, input[type="submit"]'))
            s.disabled = !1;
        });
      };
      w.addEventListener("submit", E), w[e + "Trigger"] = E;
    }
  }
  function n(y) {
    if (!y[e]) return;
    const w = o(y);
    for (const E of w.links)
      E[e + "Trigger"] && (E.removeEventListener("click", E[e + "Trigger"]), delete E[e + "Trigger"]);
    for (const E of w.forms)
      E[e + "Trigger"] && (E.removeEventListener("submit", E[e + "Trigger"]), delete E[e + "Trigger"]);
    delete y[e];
  }
  function l(y, w, E, _, A) {
    if (Y(_, "ln-ajax:before-start", { method: y, url: w }).defaultPrevented) return;
    T(_, "ln-ajax:start", { method: y, url: w }), _.classList.add("ln-ajax--loading");
    const p = document.createElement("span");
    p.className = "ln-ajax-spinner", _.appendChild(p);
    function s() {
      _.classList.remove("ln-ajax--loading");
      const b = _.querySelector(".ln-ajax-spinner");
      b && b.remove(), A && A();
    }
    let i = w;
    const h = document.querySelector('meta[name="csrf-token"]'), v = h ? h.getAttribute("content") : null;
    E instanceof FormData && v && E.append("_token", v);
    const r = {
      method: y,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (v && (r.headers["X-CSRF-TOKEN"] = v), y === "GET" && E) {
      const b = new URLSearchParams(E);
      i = w + (w.includes("?") ? "&" : "?") + b.toString();
    } else y !== "GET" && E && (r.body = E);
    fetch(i, r).then(function(b) {
      const S = b.ok, L = b.status;
      return b.text().then(function(q) {
        let k = null, D = null;
        if (q && q.trim())
          try {
            k = JSON.parse(q);
          } catch (I) {
            D = I;
          }
        return { ok: S, status: L, data: k, parseError: D };
      });
    }).then(function(b) {
      const S = b.status, L = b.data, q = b.parseError;
      if (b.ok && !q) {
        if (L && L.title && (document.title = L.title), L && L.content)
          for (const k in L.content) {
            const D = document.getElementById(k);
            D && (D.innerHTML = L.content[k]);
          }
        if (_.tagName === "A") {
          const k = _.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else _.tagName === "FORM" && _.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", i);
        T(_, "ln-ajax:success", { method: y, url: i, data: L });
      } else
        T(_, "ln-ajax:error", {
          method: y,
          url: i,
          status: S,
          data: L,
          error: q || null
        });
      T(_, "ln-ajax:complete", { method: y, url: i }), s();
    }).catch(function(b) {
      T(_, "ln-ajax:error", { method: y, url: i, status: 0, data: null, error: b }), T(_, "ln-ajax:complete", { method: y, url: i }), s();
    });
  }
  function o(y) {
    const w = { links: [], forms: [] };
    return y.tagName === "A" && y.getAttribute(t) !== "false" ? w.links.push(y) : y.tagName === "FORM" && y.getAttribute(t) !== "false" ? w.forms.push(y) : (w.links = Array.from(y.querySelectorAll('a:not([data-ln-ajax="false"])')), w.forms = Array.from(y.querySelectorAll('form:not([data-ln-ajax="false"])'))), w;
  }
  function f() {
    ht(function() {
      new MutationObserver(function(w) {
        for (const E of w)
          if (E.type === "childList") {
            for (const _ of E.addedNodes)
              if (_.nodeType === 1 && (d(_), !_.hasAttribute(t))) {
                for (const a of _.querySelectorAll("[" + t + "]"))
                  d(a);
                const A = _.closest && _.closest("[" + t + "]");
                if (A && A.getAttribute(t) !== "false") {
                  const a = o(_);
                  m(a.links), g(a.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Bt([t], function(w) {
        d(w);
      });
    }, "ln-ajax");
  }
  function u() {
    for (const y of document.querySelectorAll("[" + t + "]"))
      d(y);
  }
  window[e] = d, window[e].destroy = n, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
function Ei(t, { isHydration: e = !1, hasPrimaryRegion: c = !1, primaryMatch: d = null } = {}) {
  const m = c ? !d : !t.some((f) => f.match), g = [], n = [];
  for (const f of t)
    if (!(!f.targetEl && !f.isPending)) {
      if (!f.match) {
        const u = e && f.hasHydrate && f.hasChildren;
        !f.hasKeep && f.hasChildren && !u && f.targetEl && g.push(f);
        continue;
      }
      f.hasKeep && f.mountedTemplate === f.match.route.templateNode || n.push(Object.assign({}, f, {
        skipMount: e && f.hasHydrate && f.hasChildren
      }));
    }
  n.sort((f, u) => f.regionKey === "__primary__" ? -1 : u.regionKey === "__primary__" ? 1 : 0);
  const o = n.find((f) => f.regionKey === "__primary__") || n[0] || null;
  return { notFound: m, clears: g, swaps: n, owner: o };
}
const yn = {
  navigate: function(t) {
    Nt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Nt(t, { historyAction: "replace" });
  },
  current: function() {
    return $t === null ? null : {
      path: $t,
      params: En,
      query: An,
      route: Sn,
      regions: wn
    };
  }
}, Se = "data-ln-route", vn = "lnRoute";
typeof window < "u" && (window.lnRouter = yn);
function oe(t) {
  xn(t), qn(t), ft.size > 0 && Ln();
}
const Ai = {
  "data-ln-route": { effect: oe },
  "data-ln-route-target": { effect: oe },
  "data-ln-route-title": { effect: oe }
}, ft = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new WeakMap();
let wn = /* @__PURE__ */ new Map(), Oe = !1, $t = null, En = {}, An = {}, Sn = null, fe = !1;
function Me(t, e, c) {
  fe ? queueMicrotask(function() {
    T(t, e, c);
  }) : T(t, e, c);
}
function Xt(t) {
  try {
    const g = new URL(t, window.location.origin);
    t = g.pathname + g.search + g.hash;
  } catch {
  }
  let [e] = t.split("#"), [c, d] = e.split("?");
  const m = {};
  if (d) {
    const g = new URLSearchParams(d);
    for (const [n, l] of g.entries())
      m[n] = l;
  }
  return c = c.replace(/\/+$/, ""), c === "" && (c = "/"), { path: c, query: m };
}
function Cn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const c = t.segments, d = e.segments, m = Math.max(c.length, d.length);
  for (let g = 0; g < m; g++) {
    const n = c[g], l = d[g];
    if (n === void 0) return 1;
    if (l === void 0) return -1;
    if (n === "*") return 1;
    if (l === "*") return -1;
    const o = n.startsWith(":"), f = l.startsWith(":");
    if (o && !f) return 1;
    if (!o && f) return -1;
  }
  return 0;
}
function Tn(t, e) {
  const c = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const m = d.segments, g = {};
    let n = !0;
    if (!(c.length > m.length && m[m.length - 1] !== "*")) {
      for (let l = 0; l < m.length; l++) {
        const o = m[l], f = c[l];
        if (o === "*") {
          g.wildcard = c.slice(l).join("/");
          break;
        }
        if (f === void 0) {
          n = !1;
          break;
        }
        if (o.startsWith(":"))
          g[o.slice(1)] = decodeURIComponent(f);
        else if (o !== f) {
          n = !1;
          break;
        }
      }
      if (n && (m.indexOf("*") !== -1 || c.length <= m.length))
        return { route: d, params: g };
    }
  }
  return null;
}
function pe(t, e = {}) {
  const c = e.warn !== !1;
  if (t !== "__primary__") {
    const m = document.getElementById(t);
    return !m && c && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), m;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !d && c && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function Fe(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), c = [t].concat(e);
  for (const m of c)
    for (const g of Object.keys(m))
      if (g.startsWith("ln") && m[g] && typeof m[g].destroy == "function")
        try {
          m[g].destroy();
        } catch (n) {
          console.error(`[ln-router] Error destroying component ${g} on element:`, m, n);
        }
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const m of d) {
    const g = m.lnPopover;
    if (g && g.trigger && t.contains(g.trigger))
      try {
        g.destroy();
      } catch (n) {
        console.error("[ln-router] Error destroying open popover:", n);
      }
  }
}
function Nt(t, e = {}) {
  const { path: c, query: d } = Xt(t), m = /* @__PURE__ */ new Map();
  for (const [w, E] of ft)
    m.set(w, Tn(c, E.sorted));
  const g = m.get("__primary__") || null, n = pe("__primary__", { warn: !!g }), l = ft.has("__primary__"), o = [];
  for (const [w, E] of m) {
    const _ = w === "__primary__" ? n : pe(w, { warn: !1 }), A = !_ && !!(g && g.route && g.route.templateNode && g.route.templateNode.content && g.route.templateNode.content.querySelector("#" + CSS.escape(w)));
    !_ && !A && E && console.warn(`[ln-router] Explicit target element #${w} not found in DOM`), o.push({
      regionKey: w,
      match: E,
      targetEl: _,
      isPending: A,
      hasKeep: !!_ && _.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!_ && _.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!_ && _.children.length > 0,
      mountedTemplate: _ && se.get(_) || null
    });
  }
  const f = Ei(o, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: l,
    primaryMatch: g
  });
  if (f.notFound) {
    Me(document.body, "ln-router:not-found", { path: c });
    return;
  }
  if (Y(n || document.body, "ln-router:before-navigate", {
    from: $t,
    to: t,
    params: g ? g.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const y = function() {
    for (const w of f.clears)
      Fe(w.targetEl), w.targetEl.replaceChildren(), se.delete(w.targetEl);
    for (const w of f.swaps) {
      if ((w.isPending || !w.targetEl || !document.contains(w.targetEl)) && (w.targetEl = w.regionKey === "__primary__" ? n : document.getElementById(w.regionKey)), !w.targetEl) {
        console.warn(`[ln-router] Target element #${w.regionKey} could not be resolved`);
        continue;
      }
      if (w.skipMount || (Fe(w.targetEl), w.targetEl.replaceChildren(w.match.route.templateNode.content.cloneNode(!0))), se.set(w.targetEl, w.match.route.templateNode), f.owner && w.regionKey === f.owner.regionKey) {
        if (w.match.route.title) {
          let E = w.match.route.title;
          if (w.match.params)
            for (const [_, A] of Object.entries(w.match.params))
              E = E.replace(new RegExp("\\{\\{\\s*" + _ + "\\s*\\}\\}", "g"), A);
          document.title = E;
        }
        if (!e.isHydration) {
          w.targetEl.hasAttribute("tabindex") || w.targetEl.setAttribute("tabindex", "-1");
          const E = w.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          E ? (E.setAttribute("tabindex", "-1"), E.focus()) : w.targetEl.focus(), w.regionKey === "__primary__" && w.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Me(w.targetEl, "ln-router:navigated", {
        path: t,
        params: w.match.params,
        query: d,
        route: w.match.route,
        target: w.targetEl,
        region: w.regionKey
      });
    }
    $t = t, An = d, Sn = g ? g.route : null, En = g ? g.params : {}, wn = new Map(
      Array.from(m.entries()).map(([w, E]) => [w, E ? { route: E.route, params: E.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(y) : y();
}
function Si(t) {
  const e = t.target.closest("a");
  if (!e || !an(t, e)) return;
  const c = e.getAttribute("href"), { path: d } = Xt(c);
  for (const m of ft.values())
    if (Tn(d, m.sorted)) {
      t.preventDefault(), Nt(c, { historyAction: "push" });
      return;
    }
}
function Ci(t, e) {
  const c = Object.keys(t), d = Object.keys(e);
  if (c.length !== d.length) return !1;
  for (let m = 0; m < c.length; m++) {
    const g = c[m];
    if (t[g] !== e[g]) return !1;
  }
  return !0;
}
function Ti() {
  const t = window.location.pathname + window.location.search, e = yn.current();
  if (e && e.path != null) {
    const c = Xt(t);
    if (Xt(e.path).path === c.path && Ci(e.query, c.query))
      return;
  }
  Nt(t, { historyAction: "skip" });
}
function Ln() {
  Oe || (Oe = !0, ht(function() {
    document.addEventListener("click", Si), window.addEventListener("popstate", Ti), fe = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Nt(t, { historyAction: "replace", isHydration: !0 }), fe = !1;
  }, "ln-router"));
}
function qn(t) {
  const e = t.getAttribute(Se);
  if (!e) return;
  const c = t.getAttribute("data-ln-route-target") || null;
  if (c === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const d = c || "__primary__";
  ft.has(d) || ft.set(d, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const m = ft.get(d);
  if (m.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${d}"`);
    return;
  }
  const g = t.getAttribute("data-ln-route-title"), n = e.split("/").filter(Boolean), l = {
    pattern: e,
    segments: n,
    target: c,
    title: g,
    templateNode: t
  }, o = pe(d);
  o && o.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), m.routes.set(e, l), m.sorted = Array.from(m.routes.values()).sort(Cn);
}
function xn(t) {
  const e = t.getAttribute(Se);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", m = ft.get(d);
  m && (m.routes.delete(e), m.sorted = Array.from(m.routes.values()).sort(Cn), m.routes.size === 0 && ft.delete(d));
}
function kn(t) {
  return this.dom = t, qn(t), this;
}
kn.prototype.destroy = function() {
  xn(this.dom), delete this.dom[vn];
};
U(Se, vn, kn, "ln-router", {
  attributes: Ai,
  onInit: function() {
    ft.size > 0 && Ln();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-modal": { effect: m }
  };
  function d(g) {
    this.dom = g, this.isOpen = g.getAttribute(t) === "open";
    const n = this;
    return this._onRequestOpen = function() {
      n.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      n.dom.setAttribute(t, "close");
    }, this._onCancel = function(l) {
      l.preventDefault(), n.dom.setAttribute(t, "close");
    }, this._onClickClose = function(l) {
      const o = l.target.closest("[data-ln-modal-close]");
      o && n.dom.contains(o) && (l.preventDefault(), n.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  d.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, d.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, d.prototype.toggle = function() {
    const g = this.dom.getAttribute(t);
    this.dom.setAttribute(t, g === "open" ? "close" : "open");
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const g = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(l) {
            return l !== g;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[e];
    }
  };
  function m(g) {
    const n = g[e];
    if (!n) return;
    const o = g.getAttribute(t) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (Y(g, "ln-modal:before-open", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(t, "close");
          return;
        }
        n.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof g.showModal == "function" && g.showModal();
        const u = g.querySelector("[autofocus]");
        if (u && Ft(u))
          u.focus();
        else {
          const y = g.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), w = Array.prototype.find.call(y, Ft);
          if (w) w.focus();
          else {
            const E = g.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(E, Ft);
            _ && _.focus();
          }
        }
        T(g, "ln-modal:open", { modalId: g.id, target: g });
      } else {
        if (Y(g, "ln-modal:before-close", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(t, "open");
          return;
        }
        n.isOpen = !1, T(g, "ln-modal:close", { modalId: g.id, target: g }), typeof g.close == "function" && g.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(t, e, d, "ln-modal", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", c = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  function d(a) {
    const p = {};
    let s = a;
    const i = [];
    for (; s; ) {
      const h = s.closest("[" + t + "]");
      if (!h) break;
      h[e] && h[e].dict && i.unshift(h[e].dict), s = h.parentElement;
    }
    for (const h of i)
      Object.assign(p, h);
    return p;
  }
  function m(a, p) {
    if (p) {
      if (a) {
        const i = a.closest("[" + t + "]");
        if (i) {
          if (i.id === p && i.hasAttribute("data-ln-modal")) return i;
          const h = i.querySelector("#" + CSS.escape(p) + '[data-ln-modal], [data-ln-modal="' + p + '"]');
          if (h) return h;
        }
      }
      const s = document.getElementById(p) || document.querySelector('[data-ln-modal="' + p + '"]');
      if (s) return s;
    }
    if (a) {
      const s = a.closest("[" + t + "]");
      if (s) {
        if (s.hasAttribute("data-ln-modal")) return s;
        const h = s.querySelector("[data-ln-modal]");
        if (h) return h;
      }
      const i = a.closest("[data-ln-modal]");
      if (i) return i;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function g(a, p) {
    if (a !== "edit") return "";
    if (p) {
      const s = p.getAttribute("data-ln-fill-id");
      if (s) return s;
    }
    return "edit";
  }
  function n(a) {
    if (!a) return;
    const p = a.querySelectorAll("[data-ln-field]");
    for (let i = 0; i < p.length; i++)
      p[i].textContent = "";
    const s = a.querySelectorAll("form");
    for (let i = 0; i < s.length; i++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(s[i], null) : s[i].reset();
  }
  document.addEventListener("click", function(a) {
    if (a.ctrlKey || a.metaKey || a.button === 1) return;
    const p = a.target.closest("[data-ln-modal-for]");
    if (p) {
      const i = p.getAttribute("data-ln-modal-for"), h = m(p, i);
      if (h && h.lnModal) {
        a.preventDefault();
        const v = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, r = {}, b = p.dataset;
        for (const q in b) {
          if (!q.startsWith("lnModal") || v[q]) continue;
          const k = q.slice(7);
          k && (r[k.charAt(0).toLowerCase() + k.slice(1)] = b[q]);
        }
        const S = Object.keys(r).length > 0;
        p.hasAttribute("data-ln-modal-mode") ? h.dataset.lnModalMode = p.getAttribute("data-ln-modal-mode") : h.dataset.lnModalMode = S ? "edit" : "new", S && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(h, r) : h.dataset.lnModalMode === "new" && n(h), h.getAttribute("data-ln-modal") === "open" ? T(h, "ln-modal:request-close", {}) : (h.id && at(h.id, g(h.dataset.lnModalMode, p)), T(h, "ln-modal:request-open", {}));
      }
      return;
    }
    const s = a.target.closest('a[href^="#"]');
    if (s) {
      const i = te(s.getAttribute("href"));
      for (const h in i) {
        const v = document.getElementById(h);
        if (v && v.lnModal) {
          if (!Ee(a)) return;
          at(h, i[h]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(a) {
    const p = a.target;
    if (!p || !p.lnModal) return;
    (p.dataset.lnModalMode || "new") === "new" && n(p);
  }), document.addEventListener("ln-modal:open", function(a) {
    const p = a.target;
    if (!p || !p.lnModal || !p.id) return;
    let s = nt(p.id);
    s === null && (s = g(p.dataset.lnModalMode, null), at(p.id, s)), s ? (p.dataset.lnModalMode = "edit", T(p, "ln-fill:request", { id: s })) : (p.dataset.lnModalMode = "new", n(p));
  });
  let l = !1;
  function o() {
    if (!l) {
      l = !0;
      try {
        const a = document.querySelectorAll("[data-ln-modal][id]");
        for (let p = 0; p < a.length; p++) {
          const s = a[p];
          if (!s.lnModal) continue;
          const i = s.id, h = nt(i), v = h !== null, r = s.lnModal.isOpen;
          if (v) {
            const b = h ? "edit" : "new";
            s.dataset.lnModalMode = b, r ? h ? T(s, "ln-fill:request", { id: h }) : n(s) : T(s, "ln-modal:request-open", {});
          } else r && T(s, "ln-modal:request-close", {});
        }
      } finally {
        l = !1;
      }
    }
  }
  function f() {
    const a = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let p = 0; p < a.length; p++) {
      const s = a[p];
      s.lnModal && nt(s.id) === null && at(s.id, g(s.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", o);
  function u() {
    f(), o();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    ut(u);
  }) : ut(u);
  function y(a) {
    const s = (a.detail || {}).data;
    if (s && s.message) {
      const h = s.message;
      T(window, "ln-toast:enqueue", {
        type: h.type || "success",
        title: h.title || "",
        message: h.body || ""
      });
    }
    const i = a.target.closest("[data-ln-modal]");
    i && i.lnModal && (i.id && at(i.id, null), T(i, "ln-modal:request-close", {}), n(i));
  }
  function w(a) {
    const p = a.detail || {}, s = p.data, i = p.status || 0, h = d(a.target);
    if (s && s.message) {
      const v = s.message;
      T(window, "ln-toast:enqueue", {
        type: v.type || "error",
        title: v.title || "",
        message: v.body || ""
      });
    } else i === 0 ? T(window, "ln-toast:enqueue", {
      type: "error",
      title: h["network-error-title"] || "",
      message: h["network-error"] || "Network error"
    }) : T(window, "ln-toast:enqueue", {
      type: "error",
      title: h["server-error-title"] || "",
      message: h["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", y), document.addEventListener("ln-ajax:error", w);
  function E(a) {
    const p = a.detail || {}, s = d(a.target), i = p.message || (p.reason === "max-size" ? s["upload-max-size"] || "File is too large" : p.reason === "max-files" ? s["upload-max-files"] || "Maximum file count exceeded" : s["upload-invalid-type"] || "This file type is not allowed"), h = s["upload-invalid-title"] || "Invalid File";
    T(window, "ln-toast:enqueue", {
      type: "error",
      title: h,
      message: i
    });
  }
  function _(a) {
    const p = a.detail || {}, s = d(a.target), i = p.message || s["upload-failed"] || "Failed to upload file", h = s["upload-error-title"] || "Upload Error";
    T(window, "ln-toast:enqueue", {
      type: "error",
      title: h,
      message: i
    });
  }
  document.addEventListener("ln-upload:invalid", E), document.addEventListener("ln-upload:error", _), document.addEventListener("ln-modal:close", function(a) {
    const p = a.target;
    !p || !p.lnModal || (p.id && nt(p.id) !== null && at(p.id, null), p.dataset.lnModalMode === "new" && n(p));
  });
  function A(a) {
    return this.dom = a, this.dict = Yt(a, c), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, U(t, e, A, "ln-ui-coordinator");
})();
function Li(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let c = e, d = 0;
  for (let m = 0; m < t.length && c > 0; m++)
    d = m + 1, /[0-9]/.test(t[m]) && c--;
  return c > 0 && (d = t.length), d;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function c(n) {
    const l = n[e];
    l && (l.isTextElement ? l._initTextElement() : isNaN(l.value) || l._displayFormatted(l.value));
  }
  const d = {
    "data-ln-number": { effect: c },
    "data-ln-value": { effect: c },
    "data-ln-number-decimals": { effect: c },
    "data-ln-number-min": { effect: c },
    "data-ln-number-max": { effect: c }
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const l = this;
    if (this._onLocaleChange = function() {
      l.isTextElement ? l._formatTextContent() : isNaN(l.value) || l._displayFormatted(l.value);
    }, Jt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const o = document.createElement("input");
    o.type = "hidden", o.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && o.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", o), this._hidden = o, Object.defineProperty(o, "value", {
      get: function() {
        return m.get.call(o);
      },
      set: function(u) {
        if (m.set.call(o, u), u !== "" && !isNaN(parseFloat(u))) {
          const y = l.dom.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(st(parseFloat(u), J(l.dom), { maxDecimals: y }));
        } else
          l._setDisplayRaw("");
        l.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), en(n, m, {
      get: function() {
        return m.get.call(n);
      },
      set: function(u) {
        if (u === "") {
          l._setDisplayRaw(""), l._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const y = typeof u == "number" ? u : parseFloat(String(u));
        if (isNaN(y))
          l._setDisplayRaw(String(u)), l._setHiddenRaw("");
        else {
          l._setHiddenRaw(y);
          const w = n.getAttribute("data-ln-number-decimals");
          l._setDisplayRaw(st(y, J(n), { maxDecimals: w }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      l._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(u) {
      if (u.key !== "Backspace") return;
      const y = n.selectionStart, w = n.selectionEnd;
      if (y !== w || y === 0) return;
      const E = Qt(J(n)), _ = m.get.call(n), A = _[y - 1];
      if (A === E.groupSep || /\s/.test(A)) {
        u.preventDefault();
        const a = y - 2 >= 0 ? y - 2 : 0, p = _.slice(0, a) + _.slice(y);
        m.set.call(n, p), n.setSelectionRange(a, a), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(u) {
      u.preventDefault();
      const y = (u.clipboardData || window.clipboardData).getData("text"), w = pi(y, J(n));
      l.value = isNaN(w) ? NaN : w;
    }, n.addEventListener("paste", this._onPaste);
    const f = n.value;
    if (f !== "") {
      const u = parseFloat(f);
      if (!isNaN(u)) {
        const y = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(u), this._setDisplayRaw(st(u, J(n), { maxDecimals: y })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  g.prototype._initTextElement = function() {
    const n = this.dom;
    let l = n.getAttribute("data-ln-value"), o = n.getAttribute("data-ln-number"), f = null;
    l !== null && l !== "" ? f = l : o !== null && o !== "" && o !== "true" ? f = o : f = n.textContent.trim();
    const u = parseFloat(f);
    isNaN(u) ? this._rawValue = null : (this._rawValue = u, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(u)), this._formatTextContent());
  }, g.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const n = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = st(this._rawValue, J(this.dom), { maxDecimals: n });
    }
  }, g.prototype._handleInput = function() {
    const n = this.dom, l = m.get.call(n);
    if (l === "") {
      this._setHiddenRaw(""), T(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (l === "-") {
      this._setHiddenRaw(""), T(n, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const o = n.selectionStart;
    let f = 0;
    for (let v = 0; v < o; v++)
      /[0-9]/.test(l[v]) && f++;
    const u = J(n), y = Qt(u);
    let w = l, E = gn(l, y.groupSep, y.decimalSep), _ = parseFloat(E);
    if (isNaN(_)) {
      this._setHiddenRaw(""), T(n, "ln-number:input", { value: NaN, formatted: l });
      return;
    }
    const A = n.getAttribute("data-ln-number-decimals"), a = E.indexOf(".");
    if (A !== null && a !== -1) {
      const v = parseInt(A, 10), r = E.slice(a + 1);
      if (v === 0)
        E = E.slice(0, a), w = w.split(y.decimalSep)[0], _ = parseFloat(E), this._setDisplayRaw(w);
      else if (r.length > v) {
        E = E.slice(0, a + 1 + v);
        const b = w.split(y.decimalSep);
        w = b[0] + y.decimalSep + b[1].slice(0, v), _ = parseFloat(E), this._setDisplayRaw(w);
      }
    }
    const p = n.getAttribute("data-ln-number-max");
    if (p !== null && _ > parseFloat(p)) {
      const v = parseFloat(p), r = st(v, u, { maxDecimals: A });
      this._setDisplayRaw(r), this._setHiddenRaw(v), n.setSelectionRange(r.length, r.length), T(n, "ln-number:input", { value: v, formatted: r });
      return;
    }
    if (w.endsWith(y.decimalSep) || y.decimalSep !== "." && w.endsWith(".")) {
      this._setHiddenRaw(_), T(n, "ln-number:input", { value: _, formatted: w });
      return;
    }
    const s = E.indexOf(".");
    if (s !== -1 && E.slice(s + 1).endsWith("0")) {
      this._setHiddenRaw(_), T(n, "ln-number:input", { value: _, formatted: w });
      return;
    }
    let i;
    if (A !== null)
      i = st(_, u, { maxDecimals: A });
    else {
      const v = s !== -1 ? E.slice(s + 1).length : 0;
      i = st(_, u, { userDecimals: v });
    }
    this._setDisplayRaw(i);
    const h = Li(i, f);
    n.setSelectionRange(h, h), this._setHiddenRaw(_), T(n, "ln-number:input", { value: _, formatted: i });
  }, g.prototype._setHiddenRaw = function(n) {
    this._hidden && m.set.call(this._hidden, String(n));
  }, g.prototype._setDisplayRaw = function(n) {
    this.isTextElement ? this.dom.textContent = String(n) : m.set.call(this.dom, String(n));
  }, g.prototype._displayFormatted = function(n) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const l = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(st(n, J(this.dom), { maxDecimals: l }));
    }
  }, Object.defineProperty(g.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const n = m.get.call(this._hidden);
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      const l = typeof n == "number" ? n : parseFloat(n);
      if (this.isTextElement) {
        isNaN(l) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = l, this.dom.setAttribute("data-ln-value", String(l)), this._formatTextContent());
        return;
      }
      if (isNaN(l)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(l);
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(st(l, J(this.dom), { maxDecimals: o })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(g.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : m.get.call(this.dom);
    }
  }), g.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, g, "ln-number", {
    attributes: d,
    extraAttributes: ["lang"],
    onAttributeChange: c
  });
})();
const me = /^(short|medium|long)(\s+datetime)?$/, qi = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function xi(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(me) ? qi[t.trim()] : null;
}
function Ht(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let c, d;
  if (e.indexOf(".") !== -1)
    c = ".", d = e.split(".");
  else if (e.indexOf("/") !== -1)
    c = "/", d = e.split("/");
  else if (e.indexOf("-") !== -1)
    c = "-", d = e.split("-");
  else
    return null;
  if (d.length !== 3) return null;
  const m = [];
  for (let f = 0; f < 3; f++) {
    const u = parseInt(d[f], 10);
    if (isNaN(u)) return null;
    m.push(u);
  }
  let g, n, l;
  c === "." ? (g = m[0], n = m[1], l = m[2]) : c === "/" ? (n = m[0], g = m[1], l = m[2]) : d[0].length === 4 ? (l = m[0], n = m[1], g = m[2]) : (g = m[0], n = m[1], l = m[2]), l < 100 && (l += l < 50 ? 2e3 : 1900);
  const o = new Date(l, n - 1, g);
  return o.getFullYear() !== l || o.getMonth() !== n - 1 || o.getDate() !== g ? null : o;
}
function ae(t, e, c, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const m = t.getDate(), g = t.getMonth(), n = t.getFullYear(), l = t.getHours(), o = t.getMinutes();
  let f, u;
  const y = (c || "").toLowerCase().split("-")[0];
  let w = !1;
  try {
    const A = new Intl.DateTimeFormat(c, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    w = !!(d && A !== y);
  } catch {
    w = !!d;
  }
  if (w && d && d.monthsLong)
    f = d.monthsLong[g];
  else
    try {
      f = new Intl.DateTimeFormat(c, { month: "long" }).format(t);
    } catch {
      f = String(g + 1);
    }
  if (w && d && d.monthsShort)
    u = d.monthsShort[g];
  else
    try {
      u = new Intl.DateTimeFormat(c, { month: "short" }).format(t);
    } catch {
      u = String(g + 1);
    }
  const E = {
    yyyy: String(n),
    yy: String(n).slice(-2),
    MMMM: f,
    MMM: u,
    MM: String(g + 1).padStart(2, "0"),
    M: String(g + 1),
    dd: String(m).padStart(2, "0"),
    d: String(m),
    HH: String(l).padStart(2, "0"),
    mm: String(o).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(_) {
    return E[_] !== void 0 ? E[_] : _;
  });
}
function Ut(t, e, c, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const m = xi(e);
  if (m)
    try {
      const g = new Intl.DateTimeFormat(c, m), n = (c || "").toLowerCase().split("-")[0], l = g.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && l !== n ? ae(t, "dd.MM.yyyy", c, d) : g.format(t);
    } catch {
      return ae(t, "dd.MM.yyyy", c, d);
    }
  return ae(t, e || "dd.MM.yyyy", c, d);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function c(f) {
    const u = f[e];
    if (u) {
      if (u.isTextElement)
        u._initTextElement();
      else if (u.value) {
        const y = it(u.value);
        y && u._displayFormatted(y);
      }
    }
  }
  const d = {
    "data-ln-date": { effect: c },
    "data-ln-date-format": { effect: c },
    "data-ln-date-locale": { effect: c },
    "data-ln-value": { effect: c }
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(f, u, y) {
    T(f.dom, "ln-date:change", {
      value: u,
      formatted: f.dom.value,
      date: y
    }), f.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function n(f, u, y, w) {
    f._setHiddenRaw(u), m.set.call(f._picker, u), f._lastISO = u, w !== void 0 ? (f._isFormatting = !0, f.dom.value = w, f._isFormatting = !1) : y && f._displayFormatted(y), g(f, u, y);
  }
  function l(f) {
    f._setHiddenRaw(""), m.set.call(f._picker, ""), f._isFormatting = !0, f.dom.value = "", f._isFormatting = !1, f._lastISO = "", g(f, "", null);
  }
  function o(f) {
    if (f[e]) return f[e];
    f[e] = this, this.dom = f;
    const u = this;
    if (this._onLocaleChange = function() {
      if (u.isTextElement)
        u._formatTextContent();
      else if (u.value) {
        const s = it(u.value);
        s && u._displayFormatted(s);
      }
    }, Jt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), f.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const y = f.value, w = f.name, E = f.closest(".form-element, form") || f.parentNode;
    if (E) {
      const s = E.querySelectorAll("[data-ln-date-dict]");
      for (let i = 0; i < s.length; i++) {
        const h = s[i].getAttribute("data-ln-date-dict");
        if (h) {
          const v = Yt(s[i], "data-ln-date-dict-key");
          v["months-long"] && (v.monthsLong = v["months-long"].split(",").map((r) => r.trim())), v["months-short"] && (v.monthsShort = v["months-short"].split(",").map((r) => r.trim())), we(h, v);
        }
      }
    }
    const _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), f.parentNode.insertBefore(_, f), _.appendChild(f), this._wrapper = _;
    const A = document.createElement("input");
    A.type = "hidden", A.name = w, f.removeAttribute("name"), f.hasAttribute("data-ln-fill-as") && A.setAttribute("data-ln-fill-as", f.getAttribute("data-ln-fill-as")), f.insertAdjacentElement("afterend", A), this._hidden = A;
    const a = document.createElement("input");
    a.type = "date", a.tabIndex = -1, a.setAttribute("tabindex", "-1"), a.setAttribute("aria-hidden", "true"), a.setAttribute("aria-label", f.getAttribute("data-ln-date-label") || "Date picker"), a.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", A.insertAdjacentElement("afterend", a), this._picker = a, f.type = "text";
    const p = document.createElement("button");
    if (p.type = "button", p.setAttribute("aria-label", f.getAttribute("data-ln-date-label") || "Open date picker"), p.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', a.insertAdjacentElement("afterend", p), this._btn = p, this._lastISO = "", Object.defineProperty(A, "value", {
      get: function() {
        return m.get.call(A);
      },
      set: function(s) {
        if (m.set.call(A, s), s && s !== "") {
          const i = it(s);
          i && n(u, s, i);
        } else s === "" && l(u);
      }
    }), en(f, m, {
      get: function() {
        return m.get.call(f);
      },
      set: function(s, i) {
        if (u._isFormatting) {
          i(s);
          return;
        }
        if (!s || s === "") {
          i(""), l(u);
          return;
        }
        const h = it(s) || Ht(s);
        if (h) {
          const v = Dt(h), r = f.getAttribute(t) || "", b = J(f), S = At(b), L = Ut(h, r, b, S);
          i(L), n(u, v, h, L);
        } else
          i(String(s)), l(u);
      }
    }), this._onPickerChange = function() {
      const s = a.value;
      if (s) {
        const i = it(s);
        i && n(u, s, i);
      } else
        l(u);
    }, a.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const s = u.dom.value.trim();
      if (s === "") {
        u._lastISO !== "" && l(u);
        return;
      }
      if (u._lastISO) {
        const h = it(u._lastISO);
        if (h) {
          const v = u.dom.getAttribute(t) || "", r = J(u.dom), b = At(r);
          if (s === Ut(h, v, r, b)) return;
        }
      }
      const i = Ht(s);
      if (i) {
        const h = Dt(i);
        n(u, h, i);
      } else if (u._lastISO) {
        const h = it(u._lastISO);
        h && u._displayFormatted(h);
      } else
        u.dom.value = "";
    }, f.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      u._openPicker();
    }, p.addEventListener("click", this._onBtnClick), y && y !== "") {
      const s = it(y);
      s && n(u, y, s);
    }
    return this;
  }
  o.prototype._initTextElement = function() {
    const f = this.dom, u = f.getAttribute("data-ln-value"), y = f.getAttribute("data-ln-date"), w = f.getAttribute("datetime");
    let E = null;
    u !== null && u !== "" ? E = u : w !== null && w !== "" ? E = w : y !== null && y !== "" && y !== "true" && !me.test(y) ? E = y : E = f.textContent.trim();
    const _ = it(E) || Ht(E);
    if (_ && !isNaN(_.getTime())) {
      const A = Dt(_);
      this._rawValue = A, f.hasAttribute("data-ln-value") || f.setAttribute("data-ln-value", A), this._formatTextContent();
    } else
      this._rawValue = null;
  }, o.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const f = it(this._rawValue);
      if (f) {
        let y = this.dom.getAttribute("data-ln-date-format");
        if (!y) {
          const _ = this.dom.getAttribute("data-ln-date");
          _ && me.test(_) && (y = _);
        }
        const w = J(this.dom), E = At(w);
        this.dom.textContent = Ut(f, y || "medium", w, E);
      }
    }
  }, o.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, o.prototype._setHiddenRaw = function(f) {
    m.set.call(this._hidden, f);
  }, o.prototype._displayFormatted = function(f) {
    const u = this.dom.getAttribute(t) || "", y = J(this.dom), w = At(y);
    this._isFormatting = !0, this.dom.value = Ut(f, u, y, w), this._isFormatting = !1;
  }, Object.defineProperty(o.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : m.get.call(this._hidden);
    },
    set: function(f) {
      if (this.isTextElement) {
        if (!f || f === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const y = it(f) || Ht(f);
        if (!y) return;
        const w = Dt(y);
        this._rawValue = w, this.dom.setAttribute("data-ln-value", w), this._formatTextContent();
        return;
      }
      if (!f || f === "") {
        l(this);
        return;
      }
      const u = it(f);
      u && n(this, f, u);
    }
  }), Object.defineProperty(o.prototype, "date", {
    get: function() {
      const f = this.value;
      return f ? it(f) : null;
    },
    set: function(f) {
      if (!f || !(f instanceof Date) || isNaN(f.getTime())) {
        this.value = "";
        return;
      }
      this.value = Dt(f);
    }
  }), Object.defineProperty(o.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const f = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", f && (this.dom.value = f), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[e];
  }, U(t, e, o, "ln-date", {
    attributes: d,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: c
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-nav": { effect: g },
    "data-ln-nav-exact": { effect: g }
  };
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const n = history.pushState;
    history.pushState = function() {
      n.apply(history, arguments);
      for (const o of history._lnNavCallbacks)
        o();
    };
    const l = history.replaceState;
    history.replaceState = function() {
      l.apply(history, arguments);
      for (const o of history._lnNavCallbacks)
        o();
    }, history._lnNavPatched = !0;
  }
  function d(n) {
    return this.dom = n, this.activeClass = n.getAttribute(t) || "active", this.exact = n.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(n, { childList: !0, subtree: !0 }), this.update(), this;
  }
  d.prototype.update = function() {
    if (!this.activeClass || Y(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const l = Array.from(this.dom.querySelectorAll("a")), o = window.location.pathname, f = m(o), u = [];
    for (const y of l) {
      const w = y.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      if (y.hostname && y.hostname !== window.location.hostname) {
        y.classList.remove(this.activeClass), y.removeAttribute("aria-current");
        continue;
      }
      const E = m(w), _ = E === f, A = !this.exact && E !== "/" && f.startsWith(E + "/");
      _ || A ? (y.classList.add(this.activeClass), y.setAttribute("aria-current", "page"), u.push(y)) : (y.classList.remove(this.activeClass), y.removeAttribute("aria-current"));
    }
    T(this.dom, "ln-nav:update", { target: this.dom, activeLinks: u });
  }, d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const n = history._lnNavCallbacks.indexOf(this.updateHandler);
    n !== -1 && history._lnNavCallbacks.splice(n, 1), T(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function m(n) {
    try {
      return new URL(n, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return n.replace(/\/$/, "") || "/";
    }
  }
  function g(n, l) {
    const o = n[e];
    if (o) {
      if (l === t) {
        if (!n.hasAttribute(t)) {
          o.destroy();
          return;
        }
        const f = o.activeClass, u = n.getAttribute(t) || "active";
        if (f !== u) {
          const y = n.querySelectorAll("a");
          for (const w of y)
            f && w.classList.remove(f);
          o.activeClass = u;
        }
      } else l === "data-ln-nav-exact" && (o.exact = n.hasAttribute("data-ln-nav-exact"));
      o.update();
    }
  }
  U(t, e, d, "ln-nav", {
    attributes: c
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(n, l) {
    const o = n.getAttribute("data-ln-persist"), f = o !== null && o !== "" ? o : n.id;
    return f ? n.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + f + ":" + t() + ":" + l : "ln:" + f + ":" + l : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', n), null);
  }
  let c = null;
  function d() {
    if (c !== null) return c;
    try {
      if (typeof localStorage > "u") return c = !1;
      const n = "__ln_persist_test__";
      return localStorage.setItem(n, n), localStorage.removeItem(n), c = !0;
    } catch {
      return c = !1;
    }
  }
  const m = /* @__PURE__ */ new Set();
  function g(n, l) {
    const o = window.lnCore && window.lnCore._attrRegistry, f = o && o.persist || [];
    let u = null;
    for (let _ = 0; _ < f.length; _++)
      if (f[_].selector === l) {
        u = f[_];
        break;
      }
    if (!u) return;
    const y = u.persist;
    if (m.has(y.attr) || (m.add(y.attr), Bt([y.attr], function(_, A) {
      if (!_.hasAttribute("data-ln-persist") || y.hashActive && y.hashActive(_)) return;
      const a = e(_, A);
      if (!a || !d()) return;
      const p = _.getAttribute(A);
      try {
        p === null ? localStorage.removeItem(a) : localStorage.setItem(a, p);
      } catch {
      }
    })), y.hashActive && y.hashActive(n)) return;
    const w = e(n, y.attr);
    if (!w || !d()) return;
    const E = localStorage.getItem(w);
    E !== null && n.setAttribute(y.attr, E);
  }
  ei(g);
})();
function Ne(t, e, c, d) {
  const m = (t || "").toLowerCase().trim();
  if (m) return m;
  if ((e || "").toUpperCase() !== "A") return "";
  const g = c || "";
  if (!g.startsWith("#")) return "";
  const n = g.slice(1);
  if (!n) return "";
  const l = n.split("&"), o = (d || "").toLowerCase().trim();
  if (o)
    for (const y of l) {
      const w = y.indexOf(":");
      if (w > 0 && y.slice(0, w).toLowerCase().trim() === o)
        return y.slice(w + 1).toLowerCase().trim();
    }
  const f = l[l.length - 1] || "", u = f.indexOf(":");
  return (u > 0 ? f.slice(u + 1) : f).toLowerCase().trim();
}
function Pe(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const c = t.filter(
    (g) => (g.tagName || "").toUpperCase() === "A" && (g.href || "").startsWith("#")
  ), d = c.length > 0 && c.length === t.length, m = (e || "").toLowerCase().trim();
  return c.length > 0 && c.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : d && !m ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: d && !!m,
    warning: null
  };
}
function Be(t, e, c) {
  const d = (t || "").toLowerCase().trim();
  return d && Array.isArray(e) && e.includes(d) ? d : (c || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function c(n) {
    const l = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(l);
  }
  const d = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: c },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": {},
    "data-ln-tabs-key": {}
  };
  function m(n) {
    return this.dom = n, this.activeKey = null, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.map((f) => ({
      tagName: f.tagName,
      href: f.getAttribute("href")
    }));
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim();
    const l = Pe(n, this.nsKey);
    this.hashEnabled = l.hashEnabled, l.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : l.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const f of this.tabs) {
      const u = Ne(f.getAttribute("data-ln-tab"), f.tagName, f.getAttribute("href"), this.nsKey);
      u ? this.mapTabs[u] = f : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', f);
    }
    for (const f of this.panels) {
      const u = (f.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      u && (this.mapPanels[u] = f);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const f of this.tabs) {
      if (f[e + "Trigger"]) continue;
      const u = function(y) {
        const w = f.tagName === "A";
        if (!w && (y.ctrlKey || y.metaKey || y.button === 1)) return;
        const E = Ne(f.getAttribute("data-ln-tab"), f.tagName, f.getAttribute("href"), o.nsKey);
        E && (w && !Ee(y) || (o.hashEnabled ? nt(o.nsKey) === E ? o.dom.setAttribute("data-ln-tabs-active", E) : at(o.nsKey, E) : o.dom.setAttribute("data-ln-tabs-active", E)));
      };
      f.addEventListener("click", u), f[e + "Trigger"] = u, o._clickHandlers.push({ el: f, handler: u });
    }
    if (this._onRequestSelect = function(f) {
      const u = f.detail && (f.detail.key || f.detail.tab);
      u && o.select(u);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const f = nt(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", f !== null ? f : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const f = Be(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", f);
    }
  }
  m.prototype.select = function(n) {
    const l = (n + "").toLowerCase().trim();
    l && (this.hashEnabled ? nt(this.nsKey) === l ? this.dom.setAttribute("data-ln-tabs-active", l) : at(this.nsKey, l) : this.dom.setAttribute("data-ln-tabs-active", l));
  }, m.prototype._applyActive = function(n) {
    var o;
    if (n = Be(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
    const l = this.activeKey;
    if (l !== null && Y(this.dom, "ln-tabs:before-change", {
      key: n,
      previousKey: l,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    }).defaultPrevented) {
      l in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", l), this.hashEnabled && nt(this.nsKey) !== l && at(this.nsKey, l));
      return;
    }
    this.activeKey = n;
    for (const f in this.mapTabs) {
      const u = this.mapTabs[f];
      f === n ? (u.setAttribute("data-active", ""), u.setAttribute("aria-selected", "true")) : (u.removeAttribute("data-active"), u.setAttribute("aria-selected", "false"));
    }
    for (const f in this.mapPanels) {
      const u = this.mapPanels[f], y = f === n;
      u.classList.toggle("hidden", !y), u.setAttribute("aria-hidden", y ? "false" : "true");
    }
    if (this.autoFocus) {
      const f = (o = this.mapPanels[n]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      f && setTimeout(() => f.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", {
      key: n,
      previousKey: l,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    });
  }, m.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: n, handler: l } of this._clickHandlers)
        n.removeEventListener("click", l), delete n[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, m, "ln-tabs", {
    attributes: d,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(n) {
        const l = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(f) {
          return { tagName: f.tagName, href: f.getAttribute("href") };
        }), o = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return Pe(l, o).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", c = "data-ln-toggle-for", d = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-toggle": { effect: w }
  }, g = /* @__PURE__ */ new Set();
  let n = null;
  function l(E, _) {
    return _ === "open" ? "open" : _ === "close" || E === "open" ? "close" : "open";
  }
  function o() {
    n || (n = function(E) {
      if (Ye(E)) return;
      const _ = E.target.closest("[" + c + "]");
      if (!_ || Je(_)) return;
      const A = _.getAttribute(c);
      if (!A) return;
      const a = document.getElementById(A);
      if (!a || !a[e]) return;
      E.preventDefault();
      const p = _.getAttribute(d) || "toggle", s = a.getAttribute(t);
      a.setAttribute(t, l(s, p));
    }, document.addEventListener("click", n));
  }
  function f() {
    g.size > 0 || !n || (document.removeEventListener("click", n), n = null);
  }
  function u(E, _) {
    if (!E || !E.id) return;
    const A = document.querySelectorAll(
      "[" + c + '="' + E.id + '"]'
    );
    for (let a = 0; a < A.length; a++)
      A[a].setAttribute("aria-expanded", _ ? "true" : "false");
  }
  function y(E) {
    this.dom = E;
    const _ = this;
    return this._onRequestOpen = function() {
      _.open();
    }, this._onRequestClose = function() {
      _.close();
    }, this._onRequestToggle = function() {
      _.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = E.getAttribute(t) === "open", this.isOpen && E.classList.add("open"), u(E, this.isOpen), g.add(this), o(), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, y.prototype.toggle = function() {
    const E = this.dom.getAttribute(t);
    this.dom.setAttribute(t, l(E, "toggle"));
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.delete(this), delete this.dom[e], f(), T(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function w(E) {
    const _ = E[e];
    if (!_) return;
    const a = E.getAttribute(t) === "open";
    if (a !== _.isOpen)
      if (a) {
        if (Y(E, "ln-toggle:before-open", { target: E }).defaultPrevented) {
          E.setAttribute(t, "close");
          return;
        }
        _.isOpen = !0, E.classList.add("open"), u(E, !0), T(E, "ln-toggle:open", { target: E });
      } else {
        if (Y(E, "ln-toggle:before-close", { target: E }).defaultPrevented) {
          E.setAttribute(t, "open");
          return;
        }
        _.isOpen = !1, E.classList.remove("open"), u(E, !1), T(E, "ln-toggle:close", { target: E });
      }
  }
  U(t, e, y, "ln-toggle", {
    attributes: m,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  function c(d) {
    return this.dom = d, this._onToggleOpen = function(m) {
      if (m.detail.target.closest("[data-ln-accordion]") !== d) return;
      const g = d.querySelectorAll("[data-ln-toggle]");
      for (const n of g)
        n !== m.detail.target && n.closest("[data-ln-accordion]") === d && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      T(d, "ln-accordion:change", { target: m.detail.target });
    }, d.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, c, "ln-accordion");
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", c = "data-ln-dropdown-position", d = "data-ln-dropdown-placement", m = "bottom-end";
  if (window[e] !== void 0) return;
  function g(n) {
    this.dom = n, this.toggleEl = n.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = n.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const l = this;
    return this._onRequestOpen = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (l.toggleEl) {
        const o = l.toggleEl.getAttribute("data-ln-toggle");
        l.toggleEl.setAttribute("data-ln-toggle", o === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(o) {
      const f = l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (o.key === "Escape") {
        f && (o.preventDefault(), o.stopPropagation(), l.toggleEl.setAttribute("data-ln-toggle", "close"), l.triggerBtn && l.triggerBtn.focus());
        return;
      }
      if (o.key === "Tab") {
        f && (l.triggerBtn && l.triggerBtn.focus(), l.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const u = l._getMenuItems();
      if (u.length === 0) return;
      if (!f && (o.key === "ArrowDown" || o.key === "ArrowUp")) {
        o.preventDefault(), l.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const w = l._getMenuItems();
          w.length > 0 && l._focusItem(w, o.key === "ArrowDown" ? 0 : w.length - 1);
        }, 0);
        return;
      }
      if (!f) return;
      const y = u.indexOf(document.activeElement);
      if (o.key === "ArrowDown") {
        o.preventDefault();
        const w = y < u.length - 1 ? y + 1 : 0;
        l._focusItem(u, w);
      } else if (o.key === "ArrowUp") {
        o.preventDefault();
        const w = y > 0 ? y - 1 : u.length - 1;
        l._focusItem(u, w);
      } else o.key === "Home" ? (o.preventDefault(), l._focusItem(u, 0)) : o.key === "End" && (o.preventDefault(), l._focusItem(u, u.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(o) {
      !o.detail || o.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "true"), typeof l.toggleEl.showPopover == "function" && l.toggleEl.showPopover(), l._initMenuAria(), l._reposition(), l._addOutsideClickListener(), l._addScrollRepositionListener(), l._addResizeCloseListener(), T(n, "ln-dropdown:open", { target: o.detail.target }));
    }, this._onToggleClose = function(o) {
      !o.detail || o.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "false"), l._removeOutsideClickListener(), l._removeScrollRepositionListener(), l._removeResizeCloseListener(), l.toggleEl.style.top = "", l.toggleEl.style.left = "", l.toggleEl.removeAttribute(d), typeof l.toggleEl.hidePopover == "function" && l.toggleEl.matches(":popover-open") && l.toggleEl.hidePopover(), T(n, "ln-dropdown:close", { target: o.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  g.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const n = this.toggleEl.querySelectorAll("li");
    for (const o of n)
      o.setAttribute("role", "none");
    const l = this._getMenuItems();
    for (let o = 0; o < l.length; o++)
      l[o].setAttribute("role", "menuitem"), l[o].setAttribute("tabindex", o === 0 ? "0" : "-1");
  }, g.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, g.prototype._focusItem = function(n, l) {
    for (let o = 0; o < n.length; o++)
      n[o].setAttribute("tabindex", o === l ? "0" : "-1");
    n[l] && n[l].focus();
  }, g.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const n = this.triggerBtn.getBoundingClientRect(), l = ue(this.toggleEl), o = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, f = this.dom.getAttribute(c) || m, u = Gt(n, l, f, o);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px", this.toggleEl.setAttribute(d, u.placement);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const n = this;
    this._boundDocClick = function(l) {
      n.dom.contains(l.target) || n.toggleEl && n.toggleEl.contains(l.target) || n.toggleEl && n.toggleEl.getAttribute("data-ln-toggle") === "open" && n.toggleEl.setAttribute("data-ln-toggle", "close");
    }, n._docClickTimeout = setTimeout(function() {
      n._docClickTimeout = null, document.addEventListener("click", n._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const n = this;
    this._boundScrollReposition = function() {
      n._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const n = this;
    this._boundResizeClose = function() {
      n.toggleEl && n.toggleEl.getAttribute("data-ln-toggle") === "open" && n.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(d), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[e]);
  }, U(t, e, g, "ln-dropdown");
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", c = "data-ln-popover-for", d = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-popover": { effect: y },
    "data-ln-popover-position": {}
  }, g = [];
  let n = null;
  function l() {
    n || (n = function(w) {
      if (w.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", n));
  }
  function o() {
    g.length > 0 || n && (document.removeEventListener("keydown", n), n = null);
  }
  function f(w) {
    this.dom = w, this.isOpen = w.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const E = this;
    return this._onRequestOpen = function(_) {
      const A = _.detail && _.detail.trigger ? _.detail.trigger : null;
      E.open(A);
    }, this._onRequestClose = function() {
      E.close();
    }, this._onRequestToggle = function(_) {
      const A = _.detail && _.detail.trigger ? _.detail.trigger : null;
      E.toggle(A);
    }, w.addEventListener("ln-popover:request-open", this._onRequestOpen), w.addEventListener("ln-popover:request-close", this._onRequestClose), w.addEventListener("ln-popover:request-toggle", this._onRequestToggle), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1"), w.hasAttribute("role") || w.setAttribute("role", "dialog"), w.hasAttribute("popover") || w.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  f.prototype.open = function(w) {
    this.isOpen || (this.trigger = w || null, this.dom.setAttribute(t, "open"));
  }, f.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, f.prototype.toggle = function(w) {
    this.isOpen ? this.close() : this.open(w);
  }, f.prototype._applyOpen = function(w) {
    this.isOpen = !0, w && (this.trigger = w), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const E = ue(this.dom);
    if (this.trigger) {
      const p = this.trigger.getBoundingClientRect(), s = this.dom.getAttribute(d) || "bottom", i = Gt(p, E, s, 8);
      this.dom.style.top = i.top + "px", this.dom.style.left = i.left + "px", this.dom.setAttribute("data-ln-popover-placement", i.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const _ = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), A = Array.prototype.find.call(_, Ft);
    A ? A.focus() : this.dom.focus();
    const a = this;
    this._boundDocClick = function(p) {
      a.dom.contains(p.target) || a.trigger && a.trigger.contains(p.target) || a.close();
    }, a._docClickTimeout = setTimeout(function() {
      a._docClickTimeout = null, document.addEventListener("click", a._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!a.trigger) return;
      const p = a.trigger.getBoundingClientRect(), s = ue(a.dom), i = a.dom.getAttribute(d) || "bottom", h = Gt(p, s, i, 8);
      a.dom.style.top = h.top + "px", a.dom.style.left = h.left + "px", a.dom.setAttribute("data-ln-popover-placement", h.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), l(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, f.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const w = g.indexOf(this);
    w !== -1 && g.splice(w, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function u(w) {
    this.dom = w;
    const E = w.getAttribute(c);
    return w.setAttribute("aria-haspopup", "dialog"), w.setAttribute("aria-expanded", "false"), w.setAttribute("aria-controls", E), this._onClick = function(_) {
      if (_.ctrlKey || _.metaKey || _.button === 1) return;
      _.preventDefault();
      const A = document.getElementById(E);
      if (!A) return;
      A[e] && (A[e].trigger = w);
      const a = A.getAttribute(t);
      A.setAttribute(t, a === "open" ? "closed" : "open");
    }, w.addEventListener("click", this._onClick), this;
  }
  u.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function y(w) {
    const E = w[e];
    if (!E) return;
    const A = w.getAttribute(t) === "open";
    if (A !== E.isOpen)
      if (A) {
        if (Y(w, "ln-popover:before-open", {
          popoverId: w.id,
          target: w,
          trigger: E.trigger
        }).defaultPrevented) {
          w.setAttribute(t, "closed");
          return;
        }
        E._applyOpen(E.trigger);
      } else {
        if (Y(w, "ln-popover:before-close", {
          popoverId: w.id,
          target: w,
          trigger: E.trigger
        }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        E._applyClose();
      }
  }
  U(t, e, f, "ln-popover", {
    attributes: m
  }), U(c, e + "Trigger", u, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", c = "data-ln-tooltip-position", d = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  let g = 0, n = null, l = null, o = null, f = null, u = null, y = null;
  function w() {
    return n && n.parentNode || (n = document.getElementById(m), n || (n = document.createElement("div"), n.id = m, document.body.appendChild(n)), n.hasAttribute("popover") || n.setAttribute("popover", "manual")), n;
  }
  function E() {
    y || (y = function(s) {
      s.key === "Escape" && a();
    }, document.addEventListener("keydown", y));
  }
  function _() {
    y && (document.removeEventListener("keydown", y), y = null);
  }
  function A(s) {
    if (o === s) return;
    a();
    const i = s.getAttribute(e) || s.getAttribute("title");
    if (!i) return;
    w(), typeof n.showPopover == "function" && n.showPopover(), s.hasAttribute("title") && (f = s.getAttribute("title"), s.removeAttribute("title"));
    const h = s.getAttribute("aria-describedby");
    h ? u = h : u = null;
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = i, s[d + "Uid"] || (g += 1, s[d + "Uid"] = "ln-tooltip-" + g), v.id = s[d + "Uid"], n.appendChild(v);
    const r = v.offsetWidth, b = v.offsetHeight, S = s.getBoundingClientRect(), L = s.getAttribute(c) || "top", q = Gt(S, { width: r, height: b }, L, 6);
    v.style.top = q.top + "px", v.style.left = q.left + "px", v.setAttribute("data-ln-tooltip-placement", q.placement), u ? s.setAttribute("aria-describedby", u + " " + v.id) : s.setAttribute("aria-describedby", v.id), l = v, o = s, E();
  }
  function a() {
    if (!l) {
      _();
      return;
    }
    o && (u !== null ? o.setAttribute("aria-describedby", u) : o.removeAttribute("aria-describedby"), u = null, f !== null && o.setAttribute("title", f)), f = null, l.parentNode && l.parentNode.removeChild(l), l = null, o = null, n && typeof n.hidePopover == "function" && n.matches(":popover-open") && n.hidePopover(), _();
  }
  function p(s) {
    return this.dom = s, s.hasAttribute("data-ln-tooltip-enhanced") || (s.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(s);
    }, this._onLeave = function() {
      o === s && !s.contains(document.activeElement) && a();
    }, this._onFocus = function() {
      A(s);
    }, this._onBlur = function() {
      o === s && !s.matches(":hover") && a();
    }, s.addEventListener("mouseenter", this._onEnter), s.addEventListener("mouseleave", this._onLeave), s.addEventListener("focus", this._onFocus, !0), s.addEventListener("blur", this._onBlur, !0), this;
  }
  p.prototype.destroy = function() {
    const s = this.dom;
    s.removeEventListener("mouseenter", this._onEnter), s.removeEventListener("mouseleave", this._onLeave), s.removeEventListener("focus", this._onFocus, !0), s.removeEventListener("blur", this._onBlur, !0), o === s && a(), this._addedEnhancedAttr && s.removeAttribute("data-ln-tooltip-enhanced"), delete s[d], delete s[d + "Uid"], T(s, "ln-tooltip:destroyed", { trigger: s });
  }, U(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    p,
    "ln-tooltip"
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", c = "ln-toast-item";
  if (window[e] !== void 0) return;
  function d(_) {
    if (!(!_ || !(_ instanceof HTMLElement)) && (_.hasAttribute("popover") || _.setAttribute("popover", "manual"), typeof _.showPopover == "function")) {
      if (_.matches(":popover-open"))
        try {
          _.hidePopover();
        } catch {
        }
      try {
        _.showPopover();
      } catch {
      }
    }
  }
  function m(_) {
    if (!_ || !(_ instanceof HTMLElement)) return;
    if (_.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof _.hidePopover == "function" && _.matches(":popover-open"))
      try {
        _.hidePopover();
      } catch {
      }
  }
  function g(_) {
    this.dom = _, this.timeoutDefault = +(_.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(_.getAttribute("data-ln-toast-max") ?? 5);
    const A = Array.from(_.querySelectorAll("[data-ln-toast-item]"));
    for (; A.length > this.max; ) _.removeChild(A.shift());
    for (const a of A) y(a, this);
    return A.length > 0 && d(_), this;
  }
  g.prototype.enqueue = function(_) {
    if (!_) return;
    const A = n(_, this.dom);
    if (!A) return;
    const a = Number.isFinite(_.timeout) ? _.timeout : this.timeoutDefault;
    o(this, A), a > 0 && (A._timer = setTimeout(() => f(A), a));
  }, g.prototype.clear = function() {
    for (const _ of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      f(_);
  }, g.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const _ of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        f(_);
      m(this.dom), T(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[e];
    }
  };
  function n(_, A) {
    const a = ((_.type || "") + "").trim().toLowerCase(), p = vt(A, c, "ln-toast");
    if (!p)
      return console.warn('[ln-toast] Template "' + c + '" not found'), null;
    dt(p, {
      type: a,
      title: _.title,
      message: typeof _.message == "string" ? _.message : void 0
    });
    const s = p.firstElementChild;
    if (!s) return null;
    s.hasAttribute("data-ln-toast-item") || s.setAttribute("data-ln-toast-item", ""), s.classList.add("ln-enter");
    const i = s.querySelector(".body");
    i && l(i, _);
    const h = s.querySelector("[data-ln-toast-close]");
    return h && h.addEventListener("click", function() {
      f(s);
    }), s;
  }
  function l(_, A) {
    if (Array.isArray(A.message)) {
      const a = document.createElement("ul");
      for (const p of A.message) {
        const s = document.createElement("li");
        s.textContent = p, a.appendChild(s);
      }
      _.appendChild(a);
    }
    if (A.data && A.data.errors) {
      const a = document.createElement("ul");
      for (const p of Object.values(A.data.errors).flat()) {
        const s = document.createElement("li");
        s.textContent = p, a.appendChild(s);
      }
      _.appendChild(a);
    }
  }
  function o(_, A) {
    const a = Array.from(_.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length >= _.max && a.length > 0; ) _.dom.removeChild(a.shift());
    _.dom.appendChild(A), d(_.dom), requestAnimationFrame(() => A.classList.remove("ln-enter"));
  }
  function f(_) {
    if (!_ || !_.parentNode) return;
    const A = _.parentNode;
    clearTimeout(_._timer), _.classList.remove("ln-enter"), _.classList.add("ln-out"), setTimeout(() => {
      _.parentNode && (_.parentNode.removeChild(_), m(A));
    }, 200);
  }
  function u(_) {
    let A = _ && _.container;
    return typeof A == "string" && (A = document.querySelector(A)), A instanceof HTMLElement || (A = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), A || null;
  }
  function y(_, A) {
    if (_._lnToastHydrated) return;
    _._lnToastHydrated = !0;
    const a = _.querySelector("[data-ln-toast-close]");
    a && a.addEventListener("click", function() {
      f(_);
    });
    const p = +(_.getAttribute("data-ln-toast-timeout") ?? A.timeoutDefault);
    p > 0 && (_._timer = setTimeout(function() {
      f(_);
    }, p));
  }
  function w(_) {
    const A = _.detail || {}, a = u(A);
    if (!a) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (a[e] || (a[e] = new g(a))).enqueue(A);
  }
  function E(_) {
    const A = _ && _.detail || {};
    if (A.container) {
      const a = u(A);
      a && (a[e] || (a[e] = new g(a))).clear();
    } else {
      const a = document.querySelectorAll("[" + t + "]");
      for (const p of Array.from(a))
        (p[e] || (p[e] = new g(p))).clear();
    }
  }
  ht(function() {
    window.addEventListener("ln-toast:enqueue", w), window.addEventListener("ln-toast:clear", E), window.addEventListener("ln-modal:open", function() {
      const _ = document.querySelectorAll("[" + t + "]");
      for (const A of Array.from(_))
        A.querySelectorAll("[data-ln-toast-item]").length > 0 && d(A);
    });
  }, "ln-toast"), U(t, e, g, "ln-toast");
})();
function ki(t) {
  if (!t) return null;
  const e = String(t).split(",").map((c) => c.trim().toLowerCase()).filter(Boolean).map((c) => c.startsWith(".") ? c.slice(1) : c);
  return e.length ? e : null;
}
function In(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Ii(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const c = In(t.name), d = String(t.type || "").toLowerCase();
  return e.some((m) => {
    if (m.includes("/")) {
      if (m.endsWith("/*")) {
        const g = m.slice(0, -1);
        return d.startsWith(g);
      }
      return d === m;
    }
    return c === m;
  });
}
function Di(t, e = "en", c = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (c["unit-b"] || "B");
  const d = 1024, m = [
    c["unit-b"] || "B",
    c["unit-kb"] || "KB",
    c["unit-mb"] || "MB",
    c["unit-gb"] || "GB"
  ], g = Math.floor(Math.log(t) / Math.log(d)), n = Math.min(g, m.length - 1), l = t / Math.pow(d, n);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(l) + " " + m[n];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", c = "data-ln-upload-dict", d = "data-ln-upload-accept", m = "data-ln-upload-delete", g = "data-ln-upload-max-size", n = "data-ln-upload-max-files", l = "data-ln-upload-file-field", o = "data-ln-upload-ids-field", f = "file", u = "file_ids[]";
  if (window[e] !== void 0) return;
  function y(_, A, a) {
    return Di(_, A, a);
  }
  function w() {
    const _ = document.querySelector('meta[name="csrf-token"]');
    return _ ? _.getAttribute("content") : "";
  }
  function E(_) {
    this.dom = _, this.dict = Yt(_, c), this.locale = J(_), this.zone = _.querySelector("[data-ln-upload-zone]") || _, this.list = _.querySelector("[data-ln-upload-list]"), this.input = _.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', _), this.uploadUrl = _.getAttribute(t) || "", this.deleteUrlPattern = _.getAttribute(m) || "", this.fileFieldName = _.getAttribute(l) || f, this.idsFieldName = _.getAttribute(o) || u, this.maxSize = +_.getAttribute(g) || 0, this.maxFiles = +_.getAttribute(n) || 0;
    const A = _.getAttribute(d) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = ki(A), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  E.prototype._hydrate = function() {
    const _ = this;
    if (!this.list) return;
    const A = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let p = 0; p < A.length; p++) {
      const s = A[p], i = s.getAttribute("data-ln-upload-id"), h = "file-" + ++_.fileIdCounter;
      s.setAttribute("data-ln-upload-local-id", h);
      const v = s.querySelector('[data-ln-field="name"]'), r = s.querySelector('[data-ln-field="sizeText"]'), b = s.getAttribute("data-ln-upload-size"), S = b ? parseInt(b, 10) : null;
      _.uploadedFiles.set(h, {
        serverId: i || null,
        name: v ? v.textContent.trim() : "",
        size: S !== null && !isNaN(S) ? S : r ? r.textContent.trim() : ""
      });
    }
    const a = this.dom.querySelectorAll('input[type="hidden"]');
    for (let p = 0; p < a.length; p++) {
      const s = a[p];
      if (s.name === _.idsFieldName && s.value && !Array.from(_.uploadedFiles.values()).some(function(h) {
        return String(h.serverId) === String(s.value);
      })) {
        const h = "file-" + ++_.fileIdCounter;
        _.uploadedFiles.set(h, {
          serverId: s.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, E.prototype._syncHiddenInputs = function() {
    const _ = this, A = this.dom.querySelectorAll('input[type="hidden"]');
    for (let a = 0; a < A.length; a++)
      A[a].name === _.idsFieldName && A[a].remove();
    for (const [, a] of this.uploadedFiles)
      if (a.serverId) {
        const p = document.createElement("input");
        p.type = "hidden", p.name = _.idsFieldName, p.value = a.serverId, _.dom.appendChild(p);
      }
  }, E.prototype._bindEvents = function() {
    const _ = this;
    this._onZoneClick = function(A) {
      _.zone === _.dom && A.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || _.input && A.target !== _.input && _.input.click();
    }, this._onInputChange = function() {
      _.input && _.input.files && (_.upload(_.input.files), _.input.value = "");
    }, this._onDragEnter = function(A) {
      A.preventDefault(), A.stopPropagation(), _._dragDepth++, _.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(A) {
      A.preventDefault(), A.stopPropagation(), _.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(A) {
      A.preventDefault(), A.stopPropagation(), _._dragDepth--, _._dragDepth <= 0 && (_._dragDepth = 0, _.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(A) {
      A.preventDefault(), A.stopPropagation(), _._dragDepth = 0, _.zone.removeAttribute("data-ln-upload-state"), A.dataTransfer && A.dataTransfer.files && _.upload(A.dataTransfer.files);
    }, this._onListClick = function(A) {
      const a = A.target.closest('[data-ln-upload-action="remove"]');
      if (!a || !_.list || !_.list.contains(a) || a.disabled) return;
      const p = a.closest("[data-ln-upload-item]");
      if (p) {
        const s = p.getAttribute("data-ln-upload-local-id");
        s && _.remove(s);
      }
    }, this._onRequestUpload = function(A) {
      A.detail && A.detail.files && _.upload(A.detail.files);
    }, this._onRequestRemove = function(A) {
      if (A.detail) {
        const a = A.detail.localId !== void 0 ? A.detail.localId : A.detail.serverId;
        a !== void 0 && _.remove(a);
      }
    }, this._onRequestClear = function() {
      _.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, E.prototype.upload = function(_) {
    const A = this, a = Array.from(_);
    for (let p = 0; p < a.length; p++) {
      const s = a[p];
      if (A.maxFiles > 0 && A.uploadedFiles.size >= A.maxFiles) {
        T(A.dom, "ln-upload:invalid", {
          file: s,
          reason: "max-files"
        });
        continue;
      }
      if (!Ii(s, A.allowedExts)) {
        T(A.dom, "ln-upload:invalid", {
          file: s,
          reason: "accept"
        });
        continue;
      }
      if (A.maxSize > 0 && s.size > A.maxSize) {
        T(A.dom, "ln-upload:invalid", {
          file: s,
          reason: "max-size"
        });
        continue;
      }
      Y(A.dom, "ln-upload:before-upload", { file: s }).defaultPrevented || A._uploadSingleFile(s);
    }
  }, E.prototype._uploadSingleFile = function(_) {
    const A = this, a = "file-" + ++A.fileIdCounter, p = In(_.name);
    let s = null;
    if (this.list) {
      const b = vt(this.dom, "ln-upload-item", "ln-upload");
      if (b && (s = b.firstElementChild, s)) {
        s.setAttribute("data-ln-upload-item", ""), s.setAttribute("data-ln-upload-local-id", a), s.setAttribute("data-ln-upload-ext", p), s.setAttribute("data-ln-upload-state", "uploading"), dt(s, {
          name: _.name,
          sizeText: "0%",
          removeLabel: A.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const S = s.querySelector('[data-ln-upload-action="remove"]');
        S && (S.disabled = !0);
        const L = s.querySelector("[data-ln-progress]");
        L && L.setAttribute("data-ln-progress", "0"), A.list.appendChild(s);
      }
    }
    const i = new FormData();
    i.append(A.fileFieldName, _);
    const h = this.dom.querySelectorAll("input, select, textarea");
    for (let b = 0; b < h.length; b++) {
      const S = h[b];
      !S.name || S.name === A.idsFieldName || S.type === "file" || (S.type === "checkbox" || S.type === "radio") && !S.checked || i.append(S.name, S.value);
    }
    const v = new XMLHttpRequest();
    A.uploadedFiles.set(a, {
      serverId: null,
      name: _.name,
      size: _.size,
      xhr: v
    }), v.upload.addEventListener("progress", function(b) {
      if (b.lengthComputable) {
        const S = Math.round(b.loaded / b.total * 100);
        if (s) {
          const L = s.querySelector("[data-ln-progress]");
          L && L.setAttribute("data-ln-progress", String(S)), dt(s, { sizeText: S + "%" });
        }
        T(A.dom, "ln-upload:progress", {
          localId: a,
          file: _,
          percent: S,
          loaded: b.loaded,
          total: b.total
        });
      }
    }), v.addEventListener("load", function() {
      const b = A.uploadedFiles.get(a);
      if (b && delete b.xhr, v.status >= 200 && v.status < 300) {
        let S;
        try {
          S = JSON.parse(v.responseText);
        } catch (q) {
          r(A.dict.error || "Error", v.status, q);
          return;
        }
        const L = S.id || S.serverId;
        if (s) {
          s.removeAttribute("data-ln-upload-state"), L && s.setAttribute("data-ln-upload-id", String(L)), dt(s, {
            sizeText: y(S.size || _.size, A.locale, A.dict),
            uploading: !1
          });
          const q = s.querySelector('[data-ln-upload-action="remove"]');
          q && (q.disabled = !1);
        }
        b && (b.serverId = L, b.size = S.size || _.size, b.name = S.name || _.name), A._syncHiddenInputs(), T(A.dom, "ln-upload:uploaded", {
          localId: a,
          serverId: L,
          name: S.name || _.name,
          size: S.size || _.size,
          response: S
        });
      } else {
        let S = "";
        try {
          S = JSON.parse(v.responseText).message || "";
        } catch {
        }
        r(S, v.status, null);
      }
    }), v.addEventListener("error", function() {
      const b = A.uploadedFiles.get(a);
      b && delete b.xhr, r("", 0, null);
    });
    function r(b, S, L) {
      if (s) {
        s.setAttribute("data-ln-upload-state", "error"), dt(s, {
          sizeText: A.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const q = s.querySelector('[data-ln-upload-action="remove"]');
        q && (q.disabled = !1);
      }
      T(A.dom, "ln-upload:error", {
        file: _,
        message: b,
        status: S,
        error: L
      });
    }
    A.uploadUrl ? (v.open("POST", A.uploadUrl), v.setRequestHeader("X-CSRF-TOKEN", w()), v.setRequestHeader("X-Requested-With", "XMLHttpRequest"), v.setRequestHeader("Accept", "application/json"), v.send(i)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, E.prototype.remove = function(_) {
    const A = this;
    let a = null, p = null;
    if (A.uploadedFiles.has(_))
      a = _, p = A.uploadedFiles.get(_);
    else
      for (const [v, r] of A.uploadedFiles)
        if (String(r.serverId) === String(_)) {
          a = v, p = r;
          break;
        }
    if (!a || !p || Y(A.dom, "ln-upload:before-remove", {
      localId: a,
      serverId: p.serverId
    }).defaultPrevented) return;
    const i = A.list ? A.list.querySelector('[data-ln-upload-local-id="' + a + '"]') : null;
    if (p.xhr && typeof p.xhr.abort == "function" && p.xhr.abort(), !p.serverId) {
      i && i.remove(), A.uploadedFiles.delete(a), A._syncHiddenInputs(), T(A.dom, "ln-upload:removed", { localId: a, serverId: null });
      return;
    }
    let h = null;
    if (A.deleteUrlPattern ? h = A.deleteUrlPattern.replace("{id}", encodeURIComponent(p.serverId)) : A.uploadUrl && A.uploadUrl.includes("{id}") && (h = A.uploadUrl.replace("{id}", encodeURIComponent(p.serverId))), !h) {
      i && i.remove(), A.uploadedFiles.delete(a), A._syncHiddenInputs(), T(A.dom, "ln-upload:removed", { localId: a, serverId: p.serverId });
      return;
    }
    i && (i.setAttribute("data-ln-upload-state", "deleting"), dt(i, { deleting: !0 })), fetch(h, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": w(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(v) {
      v.ok ? (i && i.remove(), A.uploadedFiles.delete(a), A._syncHiddenInputs(), T(A.dom, "ln-upload:removed", {
        localId: a,
        serverId: p.serverId
      })) : (i && (i.removeAttribute("data-ln-upload-state"), dt(i, { deleting: !1 })), T(A.dom, "ln-upload:error", {
        file: p,
        message: "",
        status: v.status
      }));
    }).catch(function(v) {
      i && (i.removeAttribute("data-ln-upload-state"), dt(i, { deleting: !1 })), T(A.dom, "ln-upload:error", {
        file: p,
        message: "",
        status: 0,
        error: v
      });
    });
  }, E.prototype.clear = function() {
    const _ = this;
    if (!Y(_.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, a] of this.uploadedFiles)
        if (a.xhr && typeof a.xhr.abort == "function" && a.xhr.abort(), a.serverId) {
          let p = null;
          _.deleteUrlPattern ? p = _.deleteUrlPattern.replace("{id}", encodeURIComponent(a.serverId)) : _.uploadUrl && _.uploadUrl.includes("{id}") && (p = _.uploadUrl.replace("{id}", encodeURIComponent(a.serverId))), p && fetch(p, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": w(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      _.uploadedFiles.clear(), _.list && (_.list.innerHTML = ""), _._syncHiddenInputs(), T(_.dom, "ln-upload:cleared", {});
    }
  }, E.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(_) {
      return _.serverId;
    }).filter(Boolean);
  }, E.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(_) {
      return {
        serverId: _.serverId,
        name: _.name,
        size: _.size
      };
    });
  }, E.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, _] of this.uploadedFiles)
        _.xhr && typeof _.xhr.abort == "function" && _.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, T(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, E, "ln-upload");
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function c(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !e(l)) return;
    l.target = "_blank";
    const o = (l.rel || "").split(/\s+/).filter(Boolean);
    o.includes("noopener") || o.push("noopener"), o.includes("noreferrer") || o.push("noreferrer"), l.rel = o.join(" ");
    const f = document.createElement("span");
    f.className = "sr-only", f.textContent = "(opens in new tab)", l.appendChild(f), l.setAttribute("data-ln-external-link", "processed"), T(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function d(l) {
    l = l || document.body;
    for (const o of l.querySelectorAll("a, area"))
      c(o);
  }
  function m() {
    ht(function() {
      document.body.addEventListener("click", function(l) {
        const o = l.target.closest("a, area");
        o && o.getAttribute("data-ln-external-link") === "processed" && T(o, "ln-external-links:clicked", {
          link: o,
          href: o.href,
          text: o.textContent || o.title || ""
        });
      });
    }, "ln-external-links");
  }
  function g() {
    ht(function() {
      new MutationObserver(function(o) {
        for (const f of o)
          if (f.type === "childList") {
            for (const u of f.addedNodes)
              if (u.nodeType === 1 && (u.matches && (u.matches("a") || u.matches("area")) && c(u), u.querySelectorAll))
                for (const y of u.querySelectorAll("a, area"))
                  c(y);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Bt(["href"], function(o) {
        o.matches && (o.matches("a") || o.matches("area")) && c(o);
      });
    }, "ln-external-links");
  }
  function n() {
    m(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      d();
    }) : d();
  }
  window[t] = {
    process: d
  }, n();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let c = null;
  function d() {
    c = document.createElement("div"), c.className = "ln-link-status", document.body.appendChild(c);
  }
  function m(p) {
    c && (c.textContent = p, c.classList.add("ln-link-status--visible"));
  }
  function g() {
    c && c.classList.remove("ln-link-status--visible");
  }
  function n(p, s) {
    if (s.target.closest("a, button, input, select, textarea")) return;
    const i = p.querySelector("a");
    if (!i) return;
    const h = i.getAttribute("href");
    if (!h) return;
    if (s.ctrlKey || s.metaKey || s.button === 1) {
      window.open(h, "_blank", "noopener,noreferrer");
      return;
    }
    Y(p, "ln-link:navigate", { target: p, href: h, link: i }).defaultPrevented || i.click();
  }
  function l(p) {
    const s = p.querySelector("a");
    if (!s) return;
    const i = s.getAttribute("href");
    i && m(i);
  }
  function o() {
    g();
  }
  function f(p) {
    p[e + "Row"] || !p.querySelector("a") || (p[e + "Row"] = !0, p._lnLinkClick = function(i) {
      n(p, i);
    }, p._lnLinkEnter = function() {
      l(p);
    }, p.addEventListener("click", p._lnLinkClick), p.addEventListener("mouseenter", p._lnLinkEnter), p.addEventListener("mouseleave", o));
  }
  function u(p) {
    p[e + "Row"] && (p._lnLinkClick && p.removeEventListener("click", p._lnLinkClick), p._lnLinkEnter && p.removeEventListener("mouseenter", p._lnLinkEnter), p.removeEventListener("mouseleave", o), delete p._lnLinkClick, delete p._lnLinkEnter, delete p[e + "Row"]);
  }
  function y(p) {
    if (!p[e + "Init"]) return;
    const s = p.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const i = s === "TABLE" && p.querySelector("tbody") || p;
      for (const h of i.querySelectorAll("tr"))
        u(h);
    } else
      u(p);
    delete p[e + "Init"];
  }
  function w(p) {
    if (p[e + "Init"]) return;
    p[e + "Init"] = !0;
    const s = p.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const i = s === "TABLE" && p.querySelector("tbody") || p;
      for (const h of i.querySelectorAll("tr"))
        f(h);
    } else
      f(p);
  }
  function E(p) {
    p.hasAttribute && p.hasAttribute(t) && w(p);
    const s = p.querySelectorAll ? p.querySelectorAll("[" + t + "]") : [];
    for (const i of s)
      w(i);
  }
  function _() {
    ht(function() {
      new MutationObserver(function(s) {
        for (const i of s)
          if (i.type === "childList") {
            for (const h of i.addedNodes)
              if (h.nodeType === 1) {
                E(h);
                const v = h.closest("[" + t + "]");
                if (v)
                  if (h.tagName === "TR")
                    f(h);
                  else {
                    const r = v.tagName;
                    if (r === "TABLE" || r === "TBODY") {
                      const b = h.querySelectorAll ? h.querySelectorAll("tr") : [];
                      for (const S of b)
                        f(S);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Bt([t], function(s) {
        s.hasAttribute && s.hasAttribute(t) ? E(s) : y(s);
      });
    }, "ln-link");
  }
  function A(p) {
    E(p);
  }
  window[e] = { init: A, destroy: y };
  function a() {
    d(), _(), A(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
const Mt = ["Ctrl", "Alt", "Shift", "Meta"], Ri = {
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
function Dn(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const c = Ri[e.toLowerCase()];
  return c || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Rn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const c = e.split("+"), d = /* @__PURE__ */ new Set();
  let m = "";
  for (let n = 0; n < c.length; n++) {
    const l = Dn(c[n]);
    if (!l) return "";
    if (Mt.indexOf(l) !== -1) {
      d.add(l);
      continue;
    }
    if (m) return "";
    m = l;
  }
  if (!m) return "";
  const g = [];
  for (let n = 0; n < Mt.length; n++)
    d.has(Mt[n]) && g.push(Mt[n]);
  return g.push(m), g.join("+");
}
function Oi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const c = e.split(/[\s,]+/), d = [];
  for (let m = 0; m < c.length; m++) {
    const g = Rn(c[m]);
    g && d.indexOf(g) === -1 && d.push(g);
  }
  return d;
}
function Mi(t, e) {
  const c = String(e || "").trim();
  if (!c || /[\s,]/.test(c)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : Rn(d ? d + "+" + c : c);
}
function Fi(t) {
  if (!t) return "";
  const e = Dn(t.key);
  if (!e || Mt.indexOf(e) !== -1) return "";
  const c = [];
  return t.ctrlKey && c.push("Ctrl"), t.altKey && c.push("Alt"), t.shiftKey && c.push("Shift"), t.metaKey && c.push("Meta"), c.push(e), c.join("+");
}
function Ni(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const c = t.getAttribute("contenteditable");
    if (c === "" || String(c).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Pi(t, e, c, d) {
  if (!t || !e || c !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const m = String(e.tagName || "").toLowerCase();
  return m === "button" ? d === "Enter" || d === "Space" : m === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", c = "data-ln-key-target", d = "data-ln-key-allow-input", m = "data-ln-key-modifier", g = "data-ln-key-for", n = "lnKeyFor";
  if (window[e] !== void 0) return;
  function l(s) {
    const i = s[e];
    if (i) {
      if (!s.hasAttribute(t)) {
        i.destroy();
        return;
      }
      i.sync();
    }
  }
  function o(s) {
    const i = s[n];
    i && !s.hasAttribute(g) && i.destroy();
  }
  const f = {
    "data-ln-key": { effect: l },
    "data-ln-key-target": { effect: l },
    "data-ln-key-allow-input": { effect: l }
  }, u = {
    "data-ln-key-for": { effect: o }
  }, y = /* @__PURE__ */ new Set();
  let w = null;
  function E() {
    w || (w = function(s) {
      if (s.defaultPrevented || s.isComposing || s.repeat) return;
      const i = Fi(s);
      if (!i) return;
      const h = ri(s.target), v = document.querySelectorAll("[" + t + "], [" + g + "]");
      let r = null, b = !1, S = !1;
      for (let k = 0; k < v.length; k++) {
        const D = v[k], I = D[e] || D[n];
        if (!I || !I.matches(i) || h && !I.allowsInput()) continue;
        const O = I.resolveTarget(), N = Ni(O);
        if (!(!N || !oi(O, N))) {
          if (Pi(s, O, N, i)) {
            S = !0;
            continue;
          }
          r ? b = !0 : r = { host: D, target: O, action: N };
        }
      }
      if (S || !r) return;
      b && console.warn('[ln-key] Duplicate active shortcut "' + i + '"; first DOM match wins.');
      const L = {
        source: r.host,
        target: r.target,
        action: r.action,
        key: i,
        event: s
      };
      Y(r.host, "ln-key:before-trigger", L).defaultPrevented || (s.preventDefault(), r.target[r.action](), T(r.host, "ln-key:trigger", L));
    }, document.addEventListener("keydown", w));
  }
  function _() {
    y.size > 0 || !w || (document.removeEventListener("keydown", w), w = null);
  }
  function A(s) {
    return this.dom = s, this.shortcuts = [], y.add(this), this.sync(), E(), this;
  }
  A.prototype.sync = function() {
    this.shortcuts = Oi(this.dom.getAttribute(t));
  }, A.prototype.matches = function(s) {
    return this.shortcuts.indexOf(s) !== -1;
  }, A.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, A.prototype.resolveTarget = function() {
    const s = this.dom.getAttribute(c);
    return s ? p(s, c) : this.dom;
  }, A.prototype.destroy = function() {
    this.dom[e] && (y.delete(this), delete this.dom[e], _(), T(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function a(s) {
    return this.dom = s, y.add(this), E(), this;
  }
  a.prototype._modifierContext = function() {
    return this.dom.closest("[" + m + "]");
  }, a.prototype.shortcut = function() {
    const s = this._modifierContext(), i = s ? s.getAttribute(m) : "";
    return Mi(i, this.dom.textContent);
  }, a.prototype.matches = function(s) {
    return this.shortcut() === s;
  }, a.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const s = this._modifierContext();
    return !!(s && s.hasAttribute(d));
  }, a.prototype.resolveTarget = function() {
    return p(this.dom.getAttribute(g), g);
  }, a.prototype.destroy = function() {
    this.dom[n] && (y.delete(this), delete this.dom[n], _(), T(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function p(s, i) {
    if (!s) return null;
    try {
      const h = document.querySelector(s);
      return h || console.warn("[ln-key] Target not found for " + i + ' selector "' + s + '".'), h;
    } catch {
      return console.warn("[ln-key] Invalid " + i + ' selector "' + s + '".'), null;
    }
  }
  U(t, e, A, "ln-key", {
    attributes: f
  }), U(g, n, a, "ln-key-for", {
    attributes: u
  });
})();
function Bi(t, e, c = 100) {
  if (e != null && e !== "") {
    const d = parseFloat(String(e));
    if (!isNaN(d) && d > 0) return d;
  }
  if (t != null && t !== "") {
    const d = parseFloat(String(t));
    if (!isNaN(d) && d > 0) return d;
  }
  return c;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function c(l) {
    const o = l[e];
    o && n.call(o);
  }
  const d = {
    "data-ln-progress": { effect: c },
    "data-ln-progress-max": { effect: c }
  };
  function m(l) {
    return this.dom = l, this._parentObserver = null, n.call(this), g.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function g() {
    const l = this, o = this.dom.parentElement;
    if (!o) return;
    const f = new MutationObserver(function(u) {
      for (const y of u)
        y.attributeName === "data-ln-progress-max" && n.call(l);
    });
    f.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = f;
  }
  function n() {
    const l = this.dom.getAttribute("data-ln-progress"), o = this.dom.parentElement, f = o ? o.getAttribute("data-ln-progress-max") : null, u = this.dom.getAttribute("data-ln-progress-max"), y = Bi(u, f, 100), w = mn(l, y);
    this.dom.style.width = w.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(w.min)), this.dom.setAttribute("aria-valuemax", String(w.max)), this.dom.setAttribute("aria-valuenow", String(w.clampedValue)), T(this.dom, "ln-progress:change", {
      target: this.dom,
      value: w.value,
      max: w.max,
      percentage: w.percentage
    });
  }
  U(
    t,
    e,
    m,
    "ln-progress",
    {
      attributes: d
    }
  );
})();
function Hi(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let c = 0; c < t.length; c++)
    if (t[c] !== e[c]) return !0;
  return !1;
}
function Ui(t, e) {
  if (!e || typeof e != "object") return !0;
  const c = Object.keys(e);
  if (c.length === 0) return !0;
  for (let d = 0; d < c.length; d++) {
    const m = e[c[d]], g = t[m.col] || "";
    if (!Ae(g, m.values))
      return !1;
  }
  return !0;
}
function zi(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const c = [];
  for (let d = 0; d < t.length; d++) {
    const m = t[d];
    !e && m.key && (e = m.key), m.checked && !m.isReset && m.value && c.push(m.value);
  }
  return { key: e, values: c };
}
function Ki(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function He(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", c = "data-ln-filter-key", d = "data-ln-filter-value", m = "data-ln-filter-hide", g = "data-ln-filter-reset", n = "data-ln-filter-col", l = "data-ln-hash", o = "data-ln-filter-values", f = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-filter": {},
    "data-ln-hash": { effect: A },
    "data-ln-filter-values": { effect: A },
    "data-ln-filter-col": {},
    "data-ln-filter-key": {},
    "data-ln-filter-reset": {},
    "data-ln-filter-value": {}
  };
  function y(a) {
    return a.hasAttribute(g) || !a.getAttribute(d);
  }
  function w(a) {
    const p = a.dom.querySelectorAll("[" + c + "]"), s = [];
    for (let h = 0; h < p.length; h++) {
      const v = p[h];
      s.push({
        key: v.getAttribute(c),
        value: v.getAttribute(d) || "",
        checked: v.checked,
        isReset: y(v)
      });
    }
    const i = zi(s);
    return { key: i.key, values: i.values, targetId: a.targetId };
  }
  function E(a, p, s) {
    const i = a.querySelectorAll("[" + c + "]"), h = Array.isArray(s) && s.length > 0;
    for (let v = 0; v < i.length; v++) {
      const r = i[v];
      y(r) ? r.checked = !h : h && r.getAttribute(c) === p && s.indexOf(r.getAttribute(d)) !== -1 ? r.checked = !0 : r.checked = !1;
    }
  }
  function _(a) {
    this.dom = a, this.targetId = a.getAttribute(t);
    const p = a.getAttribute(n);
    this.colIndex = p !== null ? parseInt(p, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = mt(a, "filter"), this.hashEnabled = !!this.nsKey;
    const s = this, i = Zt(function() {
      s._render();
    });
    this._queueRender = i, this._attachHandlers(), this._onHashChange = function() {
      if (s._destroyed || !s.hashEnabled) return;
      const v = nt(s.nsKey), r = de(v);
      r && r.key && r.values.length > 0 ? E(s.dom, r.key, r.values) : E(s.dom, null, []), s._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let h = !1;
    if (this.hashEnabled) {
      const v = nt(this.nsKey), r = de(v);
      r && r.key && r.values.length > 0 && (E(a, r.key, r.values), ut(function() {
        s._destroyed || s._render();
      }), h = !0);
    }
    if (!h) {
      const v = He(a.getAttribute(o));
      if (v.length > 0) {
        const r = a.querySelector("[" + c + "]"), b = r ? r.getAttribute(c) : null;
        b && (E(a, b, v), ut(function() {
          s._destroyed || s._render();
        }), h = !0);
      }
    }
    if (!h) {
      const v = a.querySelectorAll("[" + c + "]");
      for (let r = 0; r < v.length; r++)
        if (v[r].checked && !y(v[r])) {
          ut(function() {
            s._destroyed || s._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const a = this;
    this._onDomChange = function(p) {
      const s = p.target;
      if (!s || !s.hasAttribute || !s.hasAttribute(c)) return;
      const i = Array.from(a.dom.querySelectorAll("[" + c + "]"));
      if (y(s)) {
        for (let h = 0; h < i.length; h++)
          y(i[h]) || (i[h].checked = !1);
        s.checked = !0, a._queueRender();
        return;
      }
      if (s.checked) {
        for (let v = 0; v < i.length; v++)
          y(i[v]) && (i[v].checked = !1);
        let h = !1;
        for (let v = 0; v < i.length; v++)
          if (y(i[v])) {
            h = !0;
            break;
          }
        if (h) {
          let v = !0;
          for (let r = 0; r < i.length; r++)
            if (!y(i[r]) && !i[r].checked) {
              v = !1;
              break;
            }
          if (v)
            for (let r = 0; r < i.length; r++)
              y(i[r]) ? i[r].checked = !0 : i[r].checked = !1;
        }
      } else {
        let h = !1;
        for (let v = 0; v < i.length; v++)
          if (!y(i[v]) && i[v].checked) {
            h = !0;
            break;
          }
        if (!h)
          for (let v = 0; v < i.length; v++)
            y(i[v]) && (i[v].checked = !0);
      }
      a._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const a = this, p = w(this), s = this._lastSnapshot;
    if (!(!s || s.key !== p.key || Hi(s.values, p.values))) return;
    const h = p.key === null || p.values.length === 0, v = document.getElementById(a.targetId), r = {
      key: p.key,
      values: p.values.slice(),
      targetId: a.targetId
    };
    T(a.dom, "ln-filter:change", r);
    let b = !1;
    v && v !== a.dom && Y(v, "ln-filter:change", r).defaultPrevented && (b = !0);
    const S = s && s.values.length > 0, L = p.values.length === 0;
    if (S && L) {
      const k = { targetId: a.targetId };
      T(a.dom, "ln-filter:reset", k), v && v !== a.dom && T(v, "ln-filter:reset", k);
    }
    this._lastSnapshot = { key: p.key, values: p.values.slice() };
    const q = Ki(p.values);
    if (q ? this.dom.setAttribute(o, q) : this.dom.removeAttribute(o), this.hashEnabled) {
      const k = pn(p.key, p.values);
      at(this.nsKey, k);
    }
    if (!b)
      if (a.colIndex !== null)
        a._filterTableRows(p);
      else {
        if (!v) return;
        const k = v.children;
        for (let D = 0; D < k.length; D++) {
          const I = k[D];
          if (I.removeAttribute(m), h) continue;
          const O = I.getAttribute("data-" + p.key);
          O !== null && (Ae(O, p.values) || I.setAttribute(m, "true"));
        }
      }
  }, _.prototype._filterTableRows = function(a) {
    const p = document.getElementById(this.targetId);
    if (!p) return;
    const s = p.tagName === "TABLE" ? p : p.querySelector("table");
    if (!s) return;
    const i = a.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, h = a.values;
    f.has(s) || f.set(s, {});
    const v = f.get(s);
    i && h.length > 0 ? v[i] = { col: this.colIndex, values: h.slice() } : i && delete v[i];
    const r = s.tBodies;
    for (let b = 0; b < r.length; b++) {
      const S = r[b].rows;
      for (let L = 0; L < S.length; L++) {
        const q = S[L], k = {};
        for (let D = 0; D < q.cells.length; D++)
          k[D] = q.cells[D].textContent.trim();
        Ui(k, v) ? q.removeAttribute(m) : q.setAttribute(m, "true");
      }
    }
  }, _.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const a = document.getElementById(this.targetId);
        if (a) {
          const p = a.tagName === "TABLE" ? a : a.querySelector("table");
          if (p && f.has(p)) {
            const s = f.get(p), i = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            i && s[i] && delete s[i], Object.keys(s).length === 0 && f.delete(p);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
    }
  };
  function A(a, p) {
    const s = a[e];
    if (!(!s || s._destroyed)) {
      if (p === l)
        s.hashEnabled && s._onHashChange && window.removeEventListener("hashchange", s._onHashChange), s.nsKey = mt(a, "filter"), s.hashEnabled = !!s.nsKey, s.hashEnabled && window.addEventListener("hashchange", s._onHashChange);
      else if (p === o) {
        const i = He(a.getAttribute(o)), h = a.querySelector("[" + c + "]"), v = h ? h.getAttribute(c) : null;
        v && (E(a, v, i), s._render());
      }
    }
  }
  U(t, e, _, "ln-filter", {
    attributes: u,
    persist: {
      attr: o,
      hashActive: function(a) {
        return !!mt(a, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", c = "data-ln-search-for", d = "lnSearchControl", m = "data-ln-search-items", g = "data-ln-search-fields", n = "data-ln-search-exclude", l = "data-ln-search-hide", o = "data-ln-hash";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-search": { effect: s },
    "data-ln-hash": { effect: s }
  };
  function u(i) {
    const h = mt(i, "search");
    if (h) return h;
    if (i.id) {
      const v = document.querySelector("[" + c + '="' + i.id + '"]');
      if (v) {
        const r = mt(v, "search");
        if (r) return r;
      }
    }
    return null;
  }
  function y(i) {
    return i.matches("input, textarea") ? i : i.querySelector("input, textarea");
  }
  function w(i, h) {
    const v = i.childNodes;
    for (let r = 0; r < v.length; r++) {
      const b = v[r];
      if (b.nodeType === 3) {
        h.push(b.nodeValue);
        continue;
      }
      b.nodeType === 1 && (b.hasAttribute(n) || w(b, h));
    }
  }
  function E(i) {
    if (i._lnSearchText !== void 0) return i._lnSearchText;
    const h = [];
    w(i, h);
    const v = gi(h);
    return i._lnSearchText = v, v;
  }
  function _(i, h) {
    if (!i.id) return;
    const v = document.querySelectorAll("[" + c + '="' + i.id + '"]');
    for (const r of v) {
      const b = y(r);
      b && b.value !== h && (b.value = h);
    }
  }
  function A(i) {
    this.dom = i, this.term = i.getAttribute(t) || "", this._destroyed = !1;
    const h = this;
    return this.nsKey = u(i), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const v = nt(h.nsKey), r = h.dom.getAttribute(t) || "";
      v !== null && v !== r ? h.dom.setAttribute(t, v) : v === null && r !== "" && h.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), ut(function() {
      if (!h._destroyed) {
        if (h.hashEnabled) {
          const v = nt(h.nsKey);
          if (v !== null && v !== h.term) {
            h.term = v, h.dom.setAttribute(t, v), _(h.dom, v), h._apply();
            return;
          }
        }
        he(h.term) && (_(h.dom, h.term), h._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const i = this.dom, h = he(this.term), v = _n(h);
    this.hashEnabled && at(this.nsKey, this.term ? this.term : null);
    const r = mi(i.getAttribute(g));
    if (Y(i, "ln-search:change", {
      term: h,
      tokens: v,
      targetId: i.id,
      fields: r
    }).defaultPrevented) return;
    const S = i.getAttribute(m), L = S ? i.querySelectorAll(S) : i.children;
    for (let q = 0; q < L.length; q++) {
      const k = L[q];
      if (k.removeAttribute(l), k.hasAttribute(n) || v.length === 0) continue;
      const D = E(k);
      bn(D, v) || k.setAttribute(l, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function a(i) {
    if (this.dom = i, this.targetId = i.getAttribute(c), this.input = y(i), this._attachHandler(), this.input && this.input.value.trim()) {
      const h = this;
      ut(function() {
        const v = document.getElementById(h.targetId);
        v && ((v.getAttribute(t) || "").trim() || h._write(h.input.value));
      });
    }
    return this;
  }
  a.prototype._write = function(i) {
    const h = document.getElementById(this.targetId);
    h && h.getAttribute(t) !== i && h.setAttribute(t, i);
  }, a.prototype._attachHandler = function() {
    if (!this.input) return;
    const i = this;
    this._onInput = function() {
      i._write(i.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, a.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function p(i) {
    const h = i.getAttribute("data-ln-search-clear-for");
    if (h) {
      const L = document.getElementById(h), q = document.querySelector("[" + c + '="' + h + '"]'), k = q ? y(q) : null;
      return { target: L, input: k };
    }
    const v = i.closest("[" + t + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + c + '="' + v.id + '"]') : null, q = L ? y(L) : null;
      return { target: v, input: q };
    }
    const r = i.closest("[data-ln-table-source], [data-ln-list-source]");
    if (r) {
      const L = r.getAttribute("data-ln-table-source") || r.getAttribute("data-ln-list-source"), q = L ? document.getElementById(L) : null;
      if (q && q.hasAttribute(t)) {
        const k = document.querySelector("[" + c + '="' + L + '"]'), D = k ? y(k) : null;
        return { target: q, input: D };
      }
    }
    const b = i.closest("[" + c + "]");
    if (b) {
      const L = b.getAttribute(c), q = L ? document.getElementById(L) : null, k = y(b);
      return { target: q, input: k };
    }
    const S = i.parentElement;
    if (S) {
      const L = S.querySelector("[" + c + "]");
      if (L) {
        const q = L.getAttribute(c), k = q ? document.getElementById(q) : null, D = y(L);
        return { target: k, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(i) {
    const h = i.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!h) return;
    const v = p(h);
    !v.target && !v.input || (i.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(t, ""));
  });
  function s(i, h) {
    const v = i[e];
    if (!v || v._destroyed) return;
    if (h === o) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = u(i), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const r = i.getAttribute(t) || "";
    r !== v.term && (v.term = r, _(i, r), v._apply());
  }
  U(t, e, A, "ln-search", {
    attributes: f,
    onSubtreeChange: function(i, h) {
      const v = h.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(i) {
        return !!u(i);
      }
    }
  }), U(c, d, a, "ln-search-control");
})();
function bt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function ji(t) {
  const e = bt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Vi(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Wi(t, e, c, d) {
  const m = bt(t);
  if (m === "none") return () => 0;
  const g = m === "desc" ? -1 : 1, n = typeof d == "function" ? d : (l) => l;
  return function(l, o) {
    const f = n(l), u = n(o);
    return ve(f, u, e, c) * g;
  };
}
(function() {
  const t = "data-ln-sort", e = "lnSort", c = "data-ln-sort-field", d = "data-ln-sort-state", m = "data-ln-sort-dir", g = "data-ln-sort-items", n = "data-ln-hash";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-sort": { effect: y },
    "data-ln-sort-field": { effect: y },
    "data-ln-sort-dir": {},
    "data-ln-sort-items": { effect: y },
    "data-ln-sort-state": { effect: y },
    "data-ln-hash": { effect: y }
  }, o = /* @__PURE__ */ new WeakMap();
  function f(w, E) {
    if (E) {
      const _ = w.querySelector('[data-ln-field="' + E + '"]');
      return _ ? Lt(_) : "";
    }
    return Lt(w);
  }
  function u(w) {
    this.dom = w, this.targetId = w.getAttribute(t), this.field = w.getAttribute(c) || null;
    const E = w.closest("th");
    this.column = !this.field && E ? E.cellIndex : null, this.itemsSelector = w.getAttribute(g) || null, this._state = bt(w.getAttribute(d)), this._destroyed = !1, this.nsKey = mt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const _ = this;
    this._onClick = function(a) {
      const p = a.target.closest("[" + m + "]");
      if (!p) return;
      const s = bt(p.getAttribute(m));
      _._apply(s);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(a) {
      if (_._destroyed || !a.detail) return;
      const p = _._resolveTarget();
      if (!(p && (a.target === p || p.contains(a.target)) || a.detail.targetId && a.detail.targetId === _.targetId)) return;
      if (Vi(
        { field: _.field, column: _.column },
        { field: a.detail.field, column: a.detail.column }
      )) {
        const h = bt(a.detail.direction);
        h && w.getAttribute(d) !== h && (_._state = h, w.setAttribute(d, h), _._updateAriaSort(h));
        return;
      }
      w.getAttribute(d) !== "none" && (_._state = "none", w.setAttribute(d, "none"), _._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const a = nt(_.nsKey), p = ce(a);
      if (p)
        _.field !== null && p.fieldOrColumn === _.field || _.column !== null && String(_.column) === p.fieldOrColumn ? _._state !== p.direction && _._apply(p.direction, !0) : _._state !== "none" && (_._state = "none", w.setAttribute(d, "none"), _._updateAriaSort("none"));
      else if (_._state !== "none") {
        _._state = "none", w.setAttribute(d, "none"), _._updateAriaSort("none");
        const s = _._resolveTarget();
        s && (Y(s, "ln-sort:change", {
          field: _.field,
          column: _.column,
          direction: "none",
          targetId: _.targetId
        }).defaultPrevented || _._defaultSort(s, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const a = nt(this.nsKey), p = ce(a);
      p && ((_.field !== null && p.fieldOrColumn === _.field || _.column !== null && String(_.column) === p.fieldOrColumn) && ut(function() {
        _._destroyed || _._apply(p.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const a = bt(w.getAttribute(d));
      a && a !== "none" && ut(function() {
        _._destroyed || _._apply(a, !0);
      });
    }
    return this;
  }
  u.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, u.prototype._updateAriaSort = function(w) {
    const E = this.dom.closest("th");
    E && E.setAttribute("aria-sort", ji(w));
  }, u.prototype._apply = function(w, E) {
    if (this._destroyed) return;
    const _ = bt(w);
    this._state = _, this.dom.getAttribute(d) !== _ && this.dom.setAttribute(d, _), this._updateAriaSort(_);
    const A = this._resolveTarget();
    if (!A) return;
    const a = {
      field: this.field,
      column: this.column,
      direction: _,
      targetId: this.targetId
    };
    if (!E && this.hashEnabled) {
      const s = fn(this.field !== null ? this.field : this.column, _);
      at(this.nsKey, s);
    }
    Y(A, "ln-sort:change", a).defaultPrevented || this._defaultSort(A, _);
  }, u.prototype._defaultSort = function(w, E) {
    const _ = this.itemsSelector ? Array.from(w.querySelectorAll(this.itemsSelector)) : Array.from(w.children);
    if (!_.length) return;
    const A = _[0].parentNode;
    o.has(w) || o.set(w, _.slice());
    let a;
    if (E === "none")
      a = (o.get(w) || _).filter(function(i) {
        return i.parentNode === A;
      });
    else {
      const s = this.field, i = _.map(function(b) {
        return f(b, s);
      }), h = ye(i), v = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, r = Wi(E, h, v, function(b) {
        return f(b, s);
      });
      a = _.slice().sort(r);
    }
    const p = document.createDocumentFragment();
    for (let s = 0; s < a.length; s++) p.appendChild(a[s]);
    A.appendChild(p);
  }, u.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function y(w, E) {
    const _ = w[e];
    if (!(!_ || _._destroyed))
      if (E === c) {
        _.field = w.getAttribute(c) || null;
        const A = w.closest("th");
        _.column = !_.field && A ? A.cellIndex : null;
      } else if (E === g)
        _.itemsSelector = w.getAttribute(g) || null;
      else if (E === d) {
        const A = bt(w.getAttribute(d));
        A !== _._state && _._apply(A);
      } else E === t ? _.targetId = w.getAttribute(t) : E === n && (_.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = mt(w, "sort"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange));
  }
  U(t, e, u, "ln-sort", {
    attributes: l,
    persist: {
      attr: d,
      hashActive: function(w) {
        return !!mt(w, "sort");
      }
    }
  });
})();
function Ue(t, e, c, d, m = 15) {
  if (d <= 0 || c <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const g = Math.max(0, t || 0), n = Math.max(0, e || 0), l = Math.floor(g / c), o = Math.ceil(n / c), f = Math.max(0, l - m), u = Math.min(d, l + o + m), y = f * c, w = Math.max(0, (d - u) * c);
  return { start: f, end: u, topPadding: y, bottomPadding: w };
}
function Gi(t, e) {
  const c = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let m = 0;
  if (Array.isArray(t))
    for (let l = 0; l < t.length; l++)
      d.has(t[l]) && m++;
  else
    m = d.size;
  const g = c > 0 && m === c, n = m > 0 && m < c;
  return { totalCount: c, selectedCount: m, isAllSelected: g, isIndeterminate: n };
}
function ze(t, e, c) {
  const d = new Set(t);
  return e == null || ((c !== void 0 ? c : !d.has(e)) ? d.add(e) : d.delete(e)), d;
}
function Ke(t, e, c) {
  const d = new Set(t);
  if (!Array.isArray(e)) return d;
  if (c)
    for (let m = 0; m < e.length; m++)
      e[m] != null && d.add(e[m]);
  else
    for (let m = 0; m < e.length; m++)
      d.delete(e[m]);
  return d;
}
(function() {
  const t = "data-ln-table", e = "lnTable", c = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function o(a, p) {
    if (!a || !a.isDataDriven) return;
    const s = a.dom.hasAttribute("data-ln-table-window");
    if (s && !a._windowed)
      a._enterWindowedMode(), a._kickWindowInitial();
    else if (!s && a._windowed)
      a._exitWindowedMode();
    else if (s && a._windowed) {
      const i = parseInt(p, 10);
      i > 0 && a._cache.configure({ windowSize: i });
    }
  }
  function f(a, p) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const s = parseInt(p, 10);
    s > 0 && a._cache.configure({ pageSize: s });
  }
  function u(a, p) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const s = parseInt(p, 10);
    s >= 0 && a._cache.configure({ threshold: s });
  }
  function y(a, p) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const s = parseInt(p, 10);
    s >= 0 && a._cache.setGrandTotal(s);
  }
  const w = {
    "data-ln-table": { prop: "name" },
    "data-ln-table-source": { prop: "source" },
    "data-ln-table-selectable": { prop: "_selectable", read: be },
    "data-ln-table-window": { effect: o },
    "data-ln-table-window-page": { effect: f },
    "data-ln-table-window-threshold": { effect: u },
    "data-ln-table-count": { effect: y }
  };
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function E(a, p) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(J(p)).format(a);
    } catch {
      return String(a);
    }
  }
  function _(a) {
    let p = a.parentElement;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const i = getComputedStyle(p).overflowY;
      if (i === "auto" || i === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function A(a) {
    this.dom = a, this.table = a.querySelector("table"), this.tbody = a.querySelector("[data-ln-table-body]") || a.querySelector("tbody"), this.thead = a.querySelector("thead");
    const p = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = p ? Array.from(p.querySelectorAll("th")) : [], this._totalSpan = a.querySelector("[data-ln-table-total]"), this._filteredSpan = a.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this.isDataDriven = a.hasAttribute("data-ln-table-source"), this.name = a.getAttribute(t) || "", this.source = a.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const s = this;
    return this._onSetSearch = function(i) {
      const h = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      s.isDataDriven ? (s.currentSearch = h, T(a, "ln-table:search", {
        table: s.name,
        query: s.currentSearch
      }), s._requestData()) : (s._searchTerm = h.toLowerCase(), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), T(a, "ln-table:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, a.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), s._onSetSearch(i);
    }, a.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      s.isDataDriven ? (s.currentFilters = {}, s.currentSearch = "", T(a, "ln-table:clear-filters", { table: s.name }), s._requestData()) : (s._searchTerm = "", s._columnFilters = {}, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), T(a, "ln-table:filter", {
        term: "",
        matched: s._filteredData.length,
        total: s._data.length
      }));
    }, a.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = a.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && a.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(i) {
      const h = i.detail || {}, v = h.data || [], r = h.total != null ? h.total : v.length;
      if (!(s._hasInitialSeed && !s.isLoaded && v.length === 0 && r === 0)) {
        if (s._windowed) {
          s._cache.ingest(h) && !h.provisional && a.classList.remove("ln-table--loading");
          return;
        }
        s._data = v, s._lastTotal = r, s._lastFiltered = h.filtered != null ? h.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, s._hasInitialSeed = !1, a.classList.remove("ln-table--loading"), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), T(a, "ln-table:rendered", {
          table: s.name,
          total: s.totalCount,
          visible: s.visibleCount
        });
      }
    }, a.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const h = i.detail && i.detail.loading;
      a.classList.toggle("ln-table--loading", !!h), h && (s.isLoaded = !1);
    }, a.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(i) {
      !s._windowed || !s._cache || s._cache.release(i.detail && i.detail.offset);
    }, a.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !s._windowed || !s._cache || s._cache.revalidate();
    }, a.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !s._windowed || !s._cache || s._requestData();
    }, a.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(i) {
      i.preventDefault(), s.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, s._requestData();
    }, a.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const h = i.target.closest("[data-ln-table-row]");
      if (!h) return;
      const v = h.getAttribute("data-ln-table-row-id"), r = h._lnRecord || {};
      T(a, "ln-table:row-click", {
        table: s.name,
        id: v,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const h = i.target.closest("[data-ln-table-row-action]");
      if (!h) return;
      const v = h.closest("[data-ln-table-row]");
      if (!v) return;
      const r = h.getAttribute("data-ln-table-row-action"), b = v.getAttribute("data-ln-table-row-id"), S = v._lnRecord || {};
      T(a, "ln-table:row-action", {
        table: s.name,
        id: b,
        action: r,
        record: S
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : T(a, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      s.tbody.rows.length > 0 && (s._emptyTbodyObserver.disconnect(), s._emptyTbodyObserver = null, s._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      i.preventDefault();
      const h = i.detail.direction === "none" ? null : i.detail.direction;
      s._sortCol = h === null ? -1 : i.detail.column, s._sortDir = h, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), T(a, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, a.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const h = i.detail.key, v = i.detail.values || [];
      if (h) {
        if (v.length === 0)
          delete s._columnFilters[h];
        else {
          const r = [];
          for (let b = 0; b < v.length; b++)
            r.push(v[b].toLowerCase());
          s._columnFilters[h] = r;
        }
        s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), s._updateFooter(), T(a, "ln-table:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }
    }, a.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const a = this.tbody.rows, p = this.ths;
    this._data = [], a.length > 0 && (this._rowHeight = a[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < a.length; s++) {
      const i = a[s], h = [], v = [], r = [];
      for (let S = 0; S < i.cells.length; S++) {
        const L = i.cells[S], q = L.textContent.trim();
        h[S] = Lt(L), v[S] = q.toLowerCase(), L.querySelector("[data-ln-table-row-action]") || r.push(q.toLowerCase());
      }
      let b = null;
      if (this.isDataDriven) {
        b = {};
        const S = i.getAttribute("data-ln-table-row-id");
        S != null && (b.id = S);
        for (let L = 0; L < p.length; L++) {
          const q = p[L].getAttribute("data-ln-table-col");
          if (q) {
            const k = L;
            if (k < i.cells.length) {
              const D = i.cells[k];
              b[q] = Lt(D);
            }
          }
        }
      }
      this._data.push({
        values: h,
        rawTexts: v,
        html: i.outerHTML,
        searchText: r.join(" "),
        id: this.isDataDriven && b ? b.id : void 0,
        ...b
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const a = document.createElement("colgroup");
    this.ths.forEach(function(p) {
      const s = document.createElement("col");
      s.style.width = p.offsetWidth + "px", a.appendChild(s);
    }), this.table.insertBefore(a, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = a;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const a = this._lastTotal, p = this.visibleCount;
        if (a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, p = document.createDocumentFragment();
      for (let s = 0; s < a.length; s++) {
        const i = this._buildRow(a[s]);
        if (!i) break;
        p.appendChild(i);
      }
      this.tbody.replaceChildren(p), this._selectable && this._updateSelectAll();
    } else {
      const a = [], p = this._filteredData;
      for (let s = 0; s < p.length; s++) a.push(p[s].html);
      this.tbody.innerHTML = a.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let s = null;
        if (this._windowed) {
          const i = this._cache ? this._cache.peek() : null;
          s = i ? this._buildRow(i) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (s = this._buildRow(this._data[0]));
        s && this.tbody && (this.tbody.appendChild(s), this._rowHeight = s.offsetHeight || 40, s.remove());
      }
    this.isDataDriven ? this._scrollContainer = _(this.dom) : this._scrollContainer = null;
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const a = this._filteredData, p = a.length, s = this._rowHeight;
    if (!s || !p) return;
    const i = this.thead ? this.thead.offsetHeight : 0, h = this._scrollContainer;
    let v, r;
    if (h) {
      const I = this.table.getBoundingClientRect(), O = h.getBoundingClientRect(), N = I.top - O.top + h.scrollTop + i;
      v = h.scrollTop - N, r = h.clientHeight;
    } else {
      const N = this.table.getBoundingClientRect().top + window.scrollY + i;
      v = window.scrollY - N, r = window.innerHeight;
    }
    const b = Ue(v, r, s, p, 15), S = b.start, L = b.end;
    if (S === this._vStart && L === this._vEnd) return;
    this._vStart = S, this._vEnd = L;
    const q = this.ths.length || 1, k = b.topPadding, D = b.bottomPadding;
    if (this.isDataDriven) {
      const I = document.createDocumentFragment();
      if (k > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const N = document.createElement("td");
        N.setAttribute("colspan", q), N.style.height = k + "px", O.appendChild(N), I.appendChild(O);
      }
      for (let O = S; O < L; O++) {
        const N = this._buildRow(a[O]);
        N && I.appendChild(N);
      }
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const N = document.createElement("td");
        N.setAttribute("colspan", q), N.style.height = D + "px", O.appendChild(N), I.appendChild(O);
      }
      this.tbody.replaceChildren(I), this._selectable && this._updateSelectAll();
    } else {
      let I = "";
      k > 0 && (I += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + k + 'px;padding:0;border:none"></td></tr>');
      for (let O = S; O < L; O++) I += a[O].html;
      D > 0 && (I += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = I, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const a = document.createElement("tr");
    a.className = "ln-table__placeholder", a.setAttribute("aria-hidden", "true");
    const p = document.createElement("td");
    return p.setAttribute("colspan", this.ths.length || 1), p.style.height = this._rowHeight + "px", a.appendChild(p), a;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._rowHeight;
    if (!a) return;
    const p = this._cache.logicalTotal, s = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let h, v;
    if (i) {
      const I = this.table.getBoundingClientRect(), O = i.getBoundingClientRect(), N = I.top - O.top + i.scrollTop + s;
      h = i.scrollTop - N, v = i.clientHeight;
    } else {
      const N = this.table.getBoundingClientRect().top + window.scrollY + s;
      h = window.scrollY - N, v = window.innerHeight;
    }
    const r = Ue(h, v, a, p, 15), b = r.start, S = r.end, L = this.ths.length || 1, q = r.topPadding, k = r.bottomPadding, D = document.createDocumentFragment();
    if (q > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", L), O.style.height = q + "px", I.appendChild(O), D.appendChild(I);
    }
    for (let I = b; I < S; I++)
      if (this._cache.has(I)) {
        const O = this._buildRow(this._cache.get(I));
        O && D.appendChild(O);
      } else
        D.appendChild(this._buildPlaceholderRow());
    if (k > 0) {
      const I = document.createElement("tr");
      I.className = "ln-table__spacer", I.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", L), O.style.height = k + "px", I.appendChild(O), D.appendChild(I);
    }
    this.tbody.replaceChildren(D), this._vStart = b, this._vEnd = S, this._cache.ensure(b, S);
  }, A.prototype._showEmptyState = function() {
    const a = this.ths.length || 1;
    let p = null, s = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, v = this.visibleCount === 0 && i > 0, r = v ? this.name + "-empty-filtered" : this.name + "-empty";
      if (s = vt(this.dom, r, "ln-table"), !s) {
        const b = this.dom.querySelector("template[data-ln-table-empty]");
        if (b) {
          const S = v ? "search" : "initial", L = b.content.querySelector('[data-ln-table-empty-when="' + S + '"]') || b.content.firstElementChild;
          L && (s = document.importNode(L, !0));
        }
      }
      if (s)
        if (s.tagName === "TR")
          p = s;
        else {
          const b = document.createElement("td");
          b.setAttribute("colspan", String(a)), b.appendChild(s);
          const S = document.createElement("tr");
          S.className = "ln-table__empty", S.appendChild(b), p = S;
        }
    } else {
      const i = this.dom.querySelector("template[" + c + "]"), h = document.createElement("td");
      h.setAttribute("colspan", String(a)), i && h.appendChild(document.importNode(i.content, !0));
      const v = document.createElement("tr");
      v.className = "ln-table__empty", v.appendChild(h), p = v;
    }
    p ? this.tbody.replaceChildren(p) : this.tbody.replaceChildren(), T(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(a, p) {
    Pt(a, p);
    const s = a.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < s.length; i++) {
      const h = s[i], v = h.getAttribute("data-ln-table-cell-attr").split(",");
      for (let r = 0; r < v.length; r++) {
        const b = v[r].trim().split(":");
        if (b.length !== 2) continue;
        const S = b[0].trim(), L = b[1].trim();
        p[S] != null && h.setAttribute(L, p[S]);
      }
    }
  }, A.prototype._buildRow = function(a) {
    let p = vt(this.dom, this.name + "-row", "ln-table");
    if (!p) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (p = document.importNode(i.content, !0));
    }
    let s = p ? p.querySelector("[data-ln-table-row]") || p.firstElementChild : null;
    if (s)
      this._fillRow(s, a);
    else if (a && a.html) {
      const i = document.createElement("tbody");
      i.innerHTML = a.html, s = i.firstElementChild;
    } else {
      s = document.createElement("tr"), s.setAttribute("data-ln-table-row", "");
      const i = this.ths;
      for (let h = 0; h < i.length; h++) {
        const v = i[h].hasAttribute("data-ln-table-col-select"), r = document.createElement("td");
        if (v) {
          const b = document.createElement("input");
          b.type = "checkbox", b.setAttribute("data-ln-table-row-select", ""), b.setAttribute("aria-label", "Select row"), r.appendChild(b);
        } else {
          const b = i[h].getAttribute("data-ln-table-col");
          b && a[b] != null && (r.textContent = String(a[b]));
        }
        s.appendChild(r);
      }
    }
    if (s._lnRecord = a, a.id != null && s.setAttribute("data-ln-table-row-id", a.id), this._selectable && a.id != null && this.selectedIds.has(String(a.id))) {
      s.classList.add("ln-row-selected");
      const i = s.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return s;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Xe(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const a = this, p = this.dom, s = parseInt(p.getAttribute("data-ln-table-window"), 10), i = parseInt(p.getAttribute("data-ln-table-window-page"), 10), h = parseInt(p.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), T(p, "ln-table:rendered", {
        table: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = Zt(this._onCacheChange), this._cache = un({
      windowSize: s > 0 ? s : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: h >= 0 ? h : 25,
      fetchDebounce: 120,
      requestPage: function(v, r, b) {
        T(p, "ln-table:request-data", {
          table: a.name,
          sort: v.sort,
          filters: v.filters,
          search: v.search,
          offset: r,
          limit: b,
          queryGen: a._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let a = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(a) && this._totalSpan) {
        const s = this._totalSpan.textContent.replace(/[^\d]/g, "");
        s && (a = parseInt(s, 10));
      }
      const p = a > 0 ? a : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: p,
        filtered: p
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
    const a = this.tbody.querySelectorAll("[data-ln-table-row]"), p = [];
    for (let i = 0; i < a.length; i++) {
      const h = a[i].getAttribute("data-ln-table-row-id");
      h != null && p.push(h);
    }
    const s = Gi(p, this.selectedIds);
    this._selectAllCheckbox.checked = s.isAllSelected, this._selectAllCheckbox.indeterminate = s.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let p = 0; p < a.length; p++) {
      const s = a[p].getAttribute("data-ln-table-row-id"), i = s != null && this.selectedIds.has(s);
      a[p].classList.toggle("ln-row-selected", i);
      const h = a[p].querySelector("[data-ln-table-row-select]");
      h && (h.checked = i);
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
    const a = this;
    if (this._onSelectionChange = function(p) {
      const s = p.target.closest("[data-ln-table-row-select]");
      if (!s) return;
      const i = s.closest("[data-ln-table-row]");
      if (!i) return;
      const h = i.getAttribute("data-ln-table-row-id");
      h != null && (a.selectedIds = ze(a.selectedIds, h, s.checked), i.classList.toggle("ln-row-selected", s.checked), a.selectedCount = a.selectedIds.size, a._updateSelectAll(), a._updateFooter(), T(a.dom, "ln-table:select", {
        table: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const p = document.createElement("input");
      p.type = "checkbox";
      const s = a.dom.querySelector('[data-ln-table-dict="select-all"]'), i = a.dom.getAttribute("data-ln-table-select-all-label") || (s ? s.textContent.trim() : null) || "Select all";
      p.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(p), this._selectAllCheckbox = p;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = a._selectAllCheckbox.checked, s = a.tbody ? a.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let h = 0; h < s.length; h++) {
        const v = s[h].getAttribute("data-ln-table-row-id"), r = s[h].querySelector("[data-ln-table-row-select]");
        v != null && (i.push(v), s[h].classList.toggle("ln-row-selected", p), r && (r.checked = p));
      }
      a.selectedIds = Ke(a.selectedIds, i, p), a.selectedCount = a.selectedIds.size, T(a.dom, "ln-table:select-all", {
        table: a.name,
        selected: p
      }), T(a.dom, "ln-table:select", {
        table: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedCount
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let s = 0; s < p.length; s++) {
        const i = p[s].querySelector("[data-ln-table-row-select]"), h = p[s].getAttribute("data-ln-table-row-id");
        i && i.checked && h != null && (a.selectedIds = ze(a.selectedIds, h, !0), p[s].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const a = this.dom.querySelector("[data-ln-table-col-select]");
    if (a) {
      const p = a.querySelector('input[type="checkbox"]');
      p && p.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = Ke(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let s = 0; s < p.length; s++) {
        p[s].classList.remove("ln-row-selected");
        const i = p[s].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let a = 0, p = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount) : (a = this._data.length, p = this._filteredData.length);
    const s = p < a;
    if (this._totalSpan && (this._totalSpan.textContent = E(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = s ? E(p, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !s), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? E(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, A, "ln-table", {
    attributes: w
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  document.addEventListener("keydown", function(n) {
    if (n.key !== "/" || n.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const l = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!l) return;
    const o = l.tagName === "INPUT" || l.tagName === "TEXTAREA" ? l : l.querySelector('input[type="search"], input[type="text"], input');
    o && (n.preventDefault(), o.focus());
  });
  function c(n) {
    return this.dom = n, g(this), this;
  }
  function d(n, l) {
    const o = l ? '[data-ln-search-for="' + l + '"]' : "[data-ln-search-for]", f = n.querySelector(o) || document.querySelector(o);
    return f ? f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector("input, textarea") : null;
  }
  function m(n, l) {
    if (l) {
      const f = n.querySelectorAll('[data-ln-filter="' + l + '"]');
      if (f.length > 0) return f;
      const u = document.querySelectorAll('[data-ln-filter="' + l + '"]');
      if (u.length > 0) return u;
    }
    const o = n.querySelectorAll("[data-ln-filter]");
    return o.length > 0 ? o : document.querySelectorAll("[data-ln-filter]");
  }
  function g(n) {
    const l = n.dom;
    function o(f) {
      const u = f.target;
      if (u && u.hasAttribute && u.hasAttribute("data-ln-table")) return u;
      const y = f.detail && f.detail.targetId || u && u.id;
      return y ? l.querySelector('[data-ln-table-source="' + y + '"]') || l.querySelector('[data-ln-table="' + y + '"]') : null;
    }
    n._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(f) {
        if (!f.detail) return;
        const u = o(f);
        if (!u || !u.hasAttribute || !u.hasAttribute("data-ln-table")) return;
        const y = f.detail.key, w = f.detail.values || [], E = u.querySelectorAll("th");
        for (let _ = 0; _ < E.length; _++)
          if (E[_].getAttribute("data-ln-table-filter-col") === y) {
            const A = E[_].querySelector("[data-ln-table-col-filter]");
            A && A.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(f) {
        const u = f.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!u) return;
        const y = u.closest("[data-ln-table]") || l.querySelector("[data-ln-table]");
        if (!y || !y.lnTable) return;
        const w = y.lnTable.name || y.id, E = y.querySelectorAll("th");
        for (let p = 0; p < E.length; p++) {
          const s = E[p].querySelector("[data-ln-table-col-filter]");
          s && s.classList.remove("ln-filter-active");
        }
        const _ = y.getAttribute("data-ln-table-source") || y.id, A = _ ? document.getElementById(_) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const p = d(l, _);
          p && p.value !== "" && (p.value = "", p.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const a = m(l, _);
        for (let p = 0; p < a.length; p++) {
          const s = a[p].querySelector("[data-ln-filter-reset]");
          if (!s) continue;
          const i = a[p].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!s.checked || i) && (s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        y.hasAttribute("data-ln-table-source") || T(y, "ln-table:request-clear-filters", { table: w });
      }
    }, l.addEventListener("ln-filter:change", n._handlers.filter), l.addEventListener("click", n._handlers.clear);
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, U(t, e, c, "ln-table-coordinator");
})();
(function() {
  const t = "data-ln-list", e = "lnList", c = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function o(i, h) {
    if (!i || !i.isDataDriven) return;
    const v = i.dom.hasAttribute("data-ln-list-window");
    if (v && !i._windowed)
      i._enterWindowedMode(), i._kickWindowInitial();
    else if (!v && i._windowed)
      i._exitWindowedMode();
    else if (v && i._windowed) {
      const r = parseInt(h, 10);
      r > 0 && i._cache.configure({ windowSize: r });
    }
  }
  function f(i, h) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const v = parseInt(h, 10);
    v > 0 && i._cache.configure({ pageSize: v });
  }
  function u(i, h) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const v = parseInt(h, 10);
    v >= 0 && i._cache.configure({ threshold: v });
  }
  function y(i, h) {
    if (!i || !i.isDataDriven || !i._windowed || !i._cache) return;
    const v = parseInt(h, 10);
    v >= 0 && i._cache.setGrandTotal(v);
  }
  const w = {
    "data-ln-list": { prop: "name" },
    "data-ln-list-source": { prop: "source" },
    "data-ln-list-selectable": { prop: "_selectable", read: be },
    "data-ln-list-window": { effect: o },
    "data-ln-list-window-page": { effect: f },
    "data-ln-list-window-threshold": { effect: u },
    "data-ln-list-count": { effect: y }
  };
  function E(i, h) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(J(h)).format(i);
    } catch {
      return String(i);
    }
  }
  function _(i) {
    let h = i;
    for (; h && h !== document.body && h !== document.documentElement; ) {
      const r = getComputedStyle(h).overflowY;
      if (r === "auto" || r === "scroll") return h;
      h = h.parentElement;
    }
    return null;
  }
  function A(i) {
    const h = i._scrollContainer || _(i.dom);
    return {
      container: h,
      top: h ? h.scrollTop : window.scrollY
    };
  }
  function a(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function p(i) {
    if (!i) return 0;
    const h = getComputedStyle(i), v = parseFloat(h.marginTop) || 0, r = parseFloat(h.marginBottom) || 0;
    return i.offsetHeight + v + r;
  }
  function s(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(t) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const h = this;
    return this._onSetSearch = function(v) {
      const r = (v.detail && v.detail.query != null ? v.detail.query : v.detail && v.detail.term != null ? v.detail.term : "").trim();
      h.isDataDriven ? (h.currentSearch = r, T(i, "ln-list:search", {
        list: h.name,
        query: h.currentSearch
      }), h._requestData()) : (h._searchTerm = r.toLowerCase(), h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), T(i, "ln-list:filter", {
        term: h._searchTerm,
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, i.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(v) {
      v.preventDefault(), h._onSetSearch(v);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      h.isDataDriven ? (h.currentFilters = {}, h.currentSearch = "", T(i, "ln-list:clear-filters", { list: h.name }), h._requestData()) : (h._searchTerm = "", h._filters = {}, h._sortField = null, h._sortDir = null, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), T(i, "ln-list:filter", {
        term: "",
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(v) {
      const r = v.detail || {}, b = r.data || [], S = r.total != null ? r.total : b.length;
      if (!(h._hasInitialSeed && !h.isLoaded && b.length === 0 && S === 0)) {
        if (h._windowed) {
          h._cache.ingest(r) && !r.provisional && i.classList.remove("ln-list--loading");
          return;
        }
        h._data = b, h._lastTotal = S, h._lastFiltered = r.filtered != null ? r.filtered : h._data.length, h.totalCount = h._lastTotal, h.visibleCount = h._lastFiltered, h.isLoaded = !0, h._hasInitialSeed = !1, i.classList.remove("ln-list--loading"), h._vStart = -1, h._vEnd = -1, h._applyFilterAndSort(), h._render(), h._updateFooter(), T(i, "ln-list:rendered", {
          list: h.name,
          total: h.totalCount,
          visible: h.visibleCount
        });
      }
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(v) {
      const r = v.detail && v.detail.loading;
      i.classList.toggle("ln-list--loading", !!r), r && (h.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(v) {
      !h._windowed || !h._cache || h._cache.release(v.detail && v.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !h._windowed || !h._cache || h._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !h._windowed || !h._cache || h._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(v) {
      v.detail.field != null && (v.preventDefault(), h.currentSort = v.detail.direction === "none" ? null : { field: v.detail.field, direction: v.detail.direction }, h._requestData());
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(v) {
      if (v.target.closest("[data-ln-item-select]") || v.target.closest("[data-ln-item-action]") || v.target.closest("a") || v.target.closest("button") || v.ctrlKey || v.metaKey || v.button === 1) return;
      const r = v.target.closest("[data-ln-item]");
      if (!r) return;
      const b = r.getAttribute("data-ln-item-id"), S = r._lnRecord || {};
      T(i, "ln-list:item-click", {
        list: h.name,
        id: b,
        record: S
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(v) {
      const r = v.target.closest("[data-ln-item-action]");
      if (!r) return;
      const b = r.closest("[data-ln-item]");
      if (!b) return;
      const S = r.getAttribute("data-ln-item-action"), L = b.getAttribute("data-ln-item-id"), q = b._lnRecord || {};
      T(i, "ln-list:item-action", {
        list: h.name,
        id: L,
        action: S,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : T(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      h.tbody.children.length > 0 && (h._emptyObserver.disconnect(), h._emptyObserver = null, h._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(v) {
      if (v.preventDefault(), !v.detail) return;
      const r = v.detail.key, b = v.detail.values || [];
      if (r) {
        if (b.length === 0)
          delete h._filters[r];
        else {
          const S = [];
          for (let L = 0; L < b.length; L++)
            S.push(b[L].toLowerCase());
          h._filters[r] = S;
        }
        h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), T(i, "ln-list:filter", {
          term: h._searchTerm,
          matched: h._filteredData.length,
          total: h._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(v) {
      if (v.detail && v.detail.field == null) return;
      v.preventDefault();
      const r = v.detail && v.detail.direction === "none" ? null : v.detail && v.detail.direction;
      h._sortField = r === null ? null : v.detail && v.detail.field, h._sortDir = r, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), T(i, "ln-list:sorted", {
        field: h._sortField,
        direction: v.detail && v.detail.direction,
        matched: h._filteredData.length,
        total: h._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  s.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((h) => !h.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = p(i[0]) || 50);
    for (let h = 0; h < i.length; h++) {
      const v = i[h], r = v.getAttribute("data-ln-item-id") || v.getAttribute("id"), b = v.textContent.trim().toLowerCase();
      let S = null;
      if (this.isDataDriven) {
        S = {}, r != null && (S.id = r);
        const k = v.querySelectorAll("[data-ln-list-field]");
        for (let D = 0; D < k.length; D++) {
          const I = k[D], O = I.getAttribute("data-ln-list-field");
          O && (S[O] = Lt(I));
        }
      }
      const L = {}, q = v.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let k = 0; k < q.length; k++) {
        const D = q[k], I = D.getAttribute("data-ln-list-field") || D.getAttribute("data-ln-field");
        I && (L[I] = Lt(D));
      }
      for (let k = 0; k < v.attributes.length; k++) {
        const D = v.attributes[k];
        if (D.name.startsWith("data-") && !D.name.startsWith("data-ln-")) {
          const I = D.name.slice(5);
          I && (L[I] = D.value);
        }
      }
      this._data.push({
        html: v.outerHTML,
        id: r,
        searchText: b,
        fields: L,
        ...S || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), T(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const i = this._searchTerm, h = i ? i.split(/\s+/).filter(Boolean) : [], v = this._filters || {}, r = Object.keys(v).length > 0;
      if (h.length === 0 && !r ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(b) {
        if (h.length > 0 && !h.every(function(L) {
          return b.searchText && b.searchText.indexOf(L) !== -1;
        }))
          return !1;
        if (r)
          for (const S in v) {
            const L = v[S];
            if (L && L.length > 0) {
              const q = b.fields && b.fields[S] !== void 0 ? b.fields[S] : b[S] !== void 0 ? b[S] : null, k = q != null ? String(q).toLowerCase() : "";
              if (L.indexOf(k) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const b = this._sortField, S = this._sortDir === "desc" ? -1 : 1, L = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(D) {
          return D.fields && D.fields[b] !== void 0 ? D.fields[b] : D[b];
        }), k = ye(q);
        this._filteredData.sort(function(D, I) {
          const O = D.fields && D.fields[b] !== void 0 ? D.fields[b] : D[b], N = I.fields && I.fields[b] !== void 0 ? I.fields[b] : I[b];
          return ve(O, N, k, L) * S;
        });
      }
    }
  }, s.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, h = this.visibleCount;
        if (i === 0 || this._filteredData.length === 0 || h === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, s.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, h = document.createDocumentFragment();
      for (let r = 0; r < i.length; r++) {
        const b = this._buildItem(i[r]);
        b && h.appendChild(b);
      }
      const v = A(this);
      this.tbody.replaceChildren(h), a(v), this._selectable && this._updateSelectAll();
    } else {
      const i = [], h = this._filteredData;
      for (let r = 0; r < h.length; r++) i.push(h[r].html);
      const v = A(this);
      this.tbody.innerHTML = i.join(""), a(v), this._selectable && this._restoreSelection();
    }
  }, s.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), h = i.gridTemplateColumns;
    let v = 1;
    if (h && h !== "none") {
      const b = h.trim().split(/\s+/).filter(Boolean);
      b.length > 0 && (v = b.length);
    }
    const r = parseFloat(i.rowGap);
    return { columns: v, rowGap: isNaN(r) ? 0 : r };
  }, s.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const i = this._cache.peek(), h = i ? this._buildItem(i) : this._buildPlaceholderItem();
      h && (this.tbody.textContent = "", this.tbody.appendChild(h), this._itemHeight = p(h) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const i = this._buildItem(this._data[0]);
        i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = p(i) || 50, this.tbody.textContent = "");
      }
    } else {
      const i = this.tbody.children;
      i.length > 0 && (this._itemHeight = p(i[0]) || 50);
    }
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = _(this.dom);
    const h = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      i._itemHeight = 0, i._measureItemHeight(), i._vStart = -1, i._vEnd = -1, i._windowed ? i._renderWindowed() : i._renderVirtual();
    }, h.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const i = this._filteredData, h = i.length, v = this._itemHeight;
    if (!v || !h) return;
    const r = this._scrollContainer;
    let b, S;
    if (r) {
      const G = this.tbody.getBoundingClientRect(), j = r.getBoundingClientRect(), V = r === this.tbody ? 0 : G.top - j.top + r.scrollTop;
      b = r.scrollTop - V, S = r.clientHeight;
    } else {
      const j = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - j, S = window.innerHeight;
    }
    const L = this._readGridLayout(), q = L.columns, k = L.rowGap, D = v + k, I = Math.ceil(h / q);
    let O = Math.max(0, Math.floor(b / D) - 15);
    O = Math.min(O, I);
    const N = Math.ceil(S / D) + 30, P = Math.min(O + N, I), H = Math.min(O * q, h), K = Math.min(P * q, h);
    if (H === this._vStart && K === this._vEnd) return;
    this._vStart = H, this._vEnd = K;
    const W = O * D, Q = (I - P) * D;
    if (this.isDataDriven) {
      const G = document.createDocumentFragment();
      if (W > 0) {
        const V = document.createElement(this.isUl ? "li" : "div");
        V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = W + "px", G.appendChild(V);
      }
      for (let V = H; V < K; V++) {
        const et = this._buildItem(i[V]);
        et && G.appendChild(et);
      }
      if (Q > 0) {
        const V = document.createElement(this.isUl ? "li" : "div");
        V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = Q + "px", G.appendChild(V);
      }
      const j = A(this);
      this.tbody.replaceChildren(G), a(j), this._selectable && this._updateSelectAll();
    } else {
      let G = "";
      W > 0 && (G += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${W}px"></${this.isUl ? "li" : "div"}>`);
      for (let V = H; V < K; V++)
        G += i[V].html;
      Q > 0 && (G += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Q}px"></${this.isUl ? "li" : "div"}>`);
      const j = A(this);
      this.tbody.innerHTML = G, a(j), this._selectable && this._restoreSelection();
    }
  }, s.prototype._buildPlaceholderItem = function() {
    const i = document.createElement(this.isUl ? "li" : "div");
    return i.className = "ln-list__placeholder", i.setAttribute("aria-hidden", "true"), i.style.height = this._itemHeight + "px", i;
  }, s.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._itemHeight;
    if (!i) return;
    const h = this._scrollContainer;
    let v, r;
    if (h) {
      const j = this.tbody.getBoundingClientRect(), V = h.getBoundingClientRect(), et = h === this.tbody ? 0 : j.top - V.top + h.scrollTop;
      v = h.scrollTop - et, r = h.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      v = window.scrollY - V, r = window.innerHeight;
    }
    const b = this._readGridLayout(), S = b.columns, L = b.rowGap, q = i + L, k = this._cache.logicalTotal, D = Math.ceil(k / S);
    let I = Math.max(0, Math.floor(v / q) - 15);
    I = Math.min(I, D);
    const O = Math.ceil(r / q) + 30, N = Math.min(I + O, D), P = Math.min(I * S, k), H = Math.min(N * S, k), K = I * q, W = (D - N) * q, Q = document.createDocumentFragment();
    if (K > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = K + "px", Q.appendChild(j);
    }
    for (let j = P; j < H; j++)
      if (this._cache.has(j)) {
        const V = this._buildItem(this._cache.get(j));
        V && Q.appendChild(V);
      } else
        Q.appendChild(this._buildPlaceholderItem());
    if (W > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.setAttribute("aria-hidden", "true"), j.style.height = W + "px", Q.appendChild(j);
    }
    const G = A(this);
    this.tbody.replaceChildren(Q), a(G), this._vStart = P, this._vEnd = H, this._cache.ensure(P, H);
  }, s.prototype._showEmptyState = function() {
    let i = null;
    if (this.isDataDriven) {
      const h = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount === 0 && h > 0, b = r ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = vt(this.dom, b, "ln-list"), !i) {
        const S = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (S) {
          const L = r ? "search" : "initial", q = S.content.querySelector(`[data-ln-empty-when="${L}"]`) || S.content.firstElementChild;
          q && (i = document.importNode(q, !0));
        }
      }
    } else {
      const h = this.dom.querySelector(`template[${c}]`);
      if (h) {
        const v = h.content.firstElementChild;
        v && (i = document.importNode(v, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.replaceChildren(i);
      else {
        const h = document.createElement(this.isUl ? "li" : "div");
        h.appendChild(i), this.tbody.replaceChildren(h);
      }
    else
      this.tbody.replaceChildren();
    T(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, s.prototype._buildItem = function(i) {
    let h = vt(this.dom, this.name + "-row", "ln-list");
    if (!h) {
      const r = this.dom.querySelector("template[data-ln-item]");
      r && (h = document.importNode(r.content, !0));
    }
    let v = h ? h.querySelector("[data-ln-item]") || h.firstElementChild : null;
    if (v)
      Pt(v, i), dt(v, i);
    else if (i && i.html) {
      const r = document.createElement(this.isUl ? "ul" : "div");
      r.innerHTML = i.html, v = r.firstElementChild;
    } else if (v = document.createElement(this.isUl ? "li" : "div"), v.setAttribute("data-ln-item", ""), i && typeof i == "object") {
      for (const r in i)
        if (r !== "html" && i[r] != null) {
          const b = document.createElement("span");
          b.setAttribute("data-ln-field", r), b.textContent = String(i[r]), v.appendChild(b);
        }
    }
    if (v._lnRecord = i, i && i.id != null && (v.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      v.classList.add("ln-item-selected");
      const r = v.querySelector("[data-ln-item-select]");
      r && (r.checked = !0);
    }
    return v;
  }, s.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let h = 0; h < i.length; h++) {
      const v = i[h].getAttribute("data-ln-item-id"), r = v != null && this.selectedIds.has(String(v));
      i[h].classList.toggle("ln-item-selected", r);
      const b = i[h].querySelector("[data-ln-item-select]");
      b && (b.checked = r);
    }
    this._updateSelectAll();
  }, s.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(h) {
      const v = h.target.closest("[data-ln-item-select]");
      if (!v) return;
      const r = v.closest("[data-ln-item]");
      if (!r) return;
      const b = r.getAttribute("data-ln-item-id");
      b != null && (v.checked ? (i.selectedIds.add(String(b)), r.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(b)), r.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), T(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const h = i._selectAllCheckbox.checked, v = i.tbody.querySelectorAll("[data-ln-item]");
      for (let r = 0; r < v.length; r++) {
        const b = v[r], S = b.getAttribute("data-ln-item-id"), L = b.querySelector("[data-ln-item-select]");
        S != null && (h ? (i.selectedIds.add(String(S)), b.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(S)), b.classList.remove("ln-item-selected")), L && (L.checked = h));
      }
      T(i.dom, "ln-list:select-all", { list: i.name, selected: h }), T(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let h = i.length > 0;
    for (let v = 0; v < i.length; v++) {
      const r = i[v].getAttribute("data-ln-item-id");
      if (r != null && !this.selectedIds.has(String(r))) {
        h = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = h;
  }, s.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Xe(this, "ln-list:request-data", "list");
  }, s.prototype._enterWindowedMode = function() {
    const i = this, h = this.dom, v = parseInt(h.getAttribute("data-ln-list-window"), 10), r = parseInt(h.getAttribute("data-ln-list-window-page"), 10), b = parseInt(h.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), T(h, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Zt(this._onCacheChange), this._cache = un({
      windowSize: v > 0 ? v : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: b >= 0 ? b : 25,
      fetchDebounce: 120,
      requestPage: function(S, L, q) {
        T(h, "ln-list:request-data", {
          list: i.name,
          sort: S.sort,
          filters: S.filters,
          search: S.search,
          offset: L,
          limit: q,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, s.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const i = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), h = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: h,
        filtered: h
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, s.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, s.prototype._updateFooter = function() {
    let i = 0, h = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, h = this.visibleCount) : (i = this._data.length, h = this._filteredData.length);
    const v = h < i;
    if (this._totalSpan && (this._totalSpan.textContent = E(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = v ? E(h, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !v), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? E(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, s, "ln-list", {
    attributes: w
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function c(w) {
    const E = w[e];
    E && y.call(E);
  }
  const d = {
    "data-ln-circular-progress": { effect: c },
    "data-ln-circular-progress-max": { effect: c },
    "data-ln-circular-progress-label": { effect: c }
  }, m = "http://www.w3.org/2000/svg", g = 36, n = 16, l = 2 * Math.PI * n;
  function o(w) {
    return this.dom = w, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, u.call(this), y.call(this), this;
  }
  o.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function f(w, E) {
    const _ = document.createElementNS(m, w);
    for (const [A, a] of Object.entries(E))
      _.setAttribute(A, a);
    return _;
  }
  function u() {
    this.svg = f("svg", {
      viewBox: "0 0 " + g + " " + g,
      width: g,
      height: g
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = f("circle", {
      cx: g / 2,
      cy: g / 2,
      r: n,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = f("circle", {
      cx: g / 2,
      cy: g / 2,
      r: n,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": l,
      "stroke-dashoffset": l,
      transform: "rotate(-90 " + g / 2 + " " + g / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function y() {
    const w = this.dom.getAttribute("data-ln-circular-progress"), E = this.dom.getAttribute("data-ln-circular-progress-max"), _ = mn(w, E || 100), A = l - _.percentage / 100 * l;
    this.progressCircle.setAttribute("stroke-dashoffset", A);
    const a = this.dom.getAttribute("data-ln-circular-progress-label"), p = a !== null ? a : Math.round(_.percentage) + "%";
    this.labelEl.textContent = p, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(_.min)), this.dom.setAttribute("aria-valuemax", String(_.max)), this.dom.setAttribute("aria-valuenow", String(_.clampedValue)), this.dom.setAttribute("aria-valuetext", p), T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: _.value,
      max: _.max,
      percentage: _.percentage
    });
  }
  U(t, e, o, "ln-circular-progress", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", c = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-sortable": { effect: g }
  };
  function m(n) {
    this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this._dragging = null, n.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(o) {
      l.isEnabled && l._handlePointerDown(o);
    }, n.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, m.prototype._handlePointerDown = function(n) {
    let l = n.target.closest("[" + c + "]"), o;
    if (l) {
      for (o = l; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + c + "]")) return;
      for (o = n.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      l = o;
    }
    const u = Array.from(this.dom.children).indexOf(o);
    if (Y(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: u
    }).defaultPrevented) return;
    n.preventDefault(), l.setPointerCapture(n.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: u
    });
    const w = this, E = function(A) {
      w._handlePointerMove(A);
    }, _ = function(A) {
      w._handlePointerEnd(A), l.removeEventListener("pointermove", E), l.removeEventListener("pointerup", _), l.removeEventListener("pointercancel", _);
    };
    l.addEventListener("pointermove", E), l.addEventListener("pointerup", _), l.addEventListener("pointercancel", _);
  }, m.prototype._handlePointerMove = function(n) {
    if (!this._dragging) return;
    const l = Array.from(this.dom.children), o = this._dragging;
    for (const f of l)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const f of l) {
      if (f === o) continue;
      const u = f.getBoundingClientRect(), y = u.top + u.height / 2;
      if (n.clientY >= u.top && n.clientY < y) {
        f.classList.add("ln-sortable--drop-before");
        break;
      } else if (n.clientY >= y && n.clientY <= u.bottom) {
        f.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(n) {
    if (!this._dragging) return;
    const l = this._dragging, o = Array.from(this.dom.children), f = o.indexOf(l);
    let u = null, y = null;
    for (const w of o) {
      if (w.classList.contains("ln-sortable--drop-before")) {
        u = w, y = "before";
        break;
      }
      if (w.classList.contains("ln-sortable--drop-after")) {
        u = w, y = "after";
        break;
      }
    }
    for (const w of o)
      w.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (l.classList.remove("ln-sortable--dragging"), l.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), u && u !== l) {
      y === "before" ? this.dom.insertBefore(l, u) : this.dom.insertBefore(l, u.nextElementSibling);
      const E = Array.from(this.dom.children).indexOf(l);
      T(this.dom, "ln-sortable:reordered", {
        item: l,
        oldIndex: f,
        newIndex: E
      });
    }
    this._dragging = null;
  };
  function g(n) {
    const l = n[e];
    if (!l) return;
    const o = n.getAttribute(t) !== "disabled";
    o !== l.isEnabled && (l.isEnabled = o, T(n, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: n }));
  }
  U(t, e, m, "ln-sortable", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", c = "data-ln-confirm-timeout";
  if (window[e] !== void 0) return;
  function m(n) {
    const l = parseFloat(n.getAttribute(c));
    return isNaN(l) || l <= 0 ? 3 : l;
  }
  function g(n) {
    this.dom = n, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = n.querySelector("[data-ln-confirm-idle]"), this.activeEl = n.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = n.textContent.trim(), this.confirmText = n.getAttribute(t) || "Confirm?");
    const l = this;
    return this._onClick = function(o) {
      if (!Ye(o))
        if (!l.confirming)
          o.preventDefault(), o.stopImmediatePropagation(), l._enterConfirm();
        else {
          if (l._submitted) return;
          l._submitted = !0, o.stopPropagation(), l._reset();
        }
    }, n.addEventListener("click", this._onClick), this;
  }
  g.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const n = this.activeEl ? this.activeEl.textContent.trim() : "";
      n && (this.dom.setAttribute("aria-label", n), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const n = this.dom.querySelector("svg.ln-icon use");
      n && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = n.getAttribute("href"), n.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const n = this, l = m(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      n._reset();
    }, l);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const n = this.dom.querySelector("svg.ln-icon use");
      n && this.originalIconHref && n.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], T(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, U(t, e, g, "ln-confirm");
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const c = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function d(m) {
    this.dom = m, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = m.getAttribute("data-ln-translations-default") || "", this.placeholderLabel = m.getAttribute("data-ln-translations-placeholder") || "{lang} translation", this.removeLabel = m.getAttribute("data-ln-translations-remove-label") || "Remove {lang}", this.badgesEl = m.querySelector("[data-ln-translations-active]"), this.menuEl = m.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const g = m.getAttribute("data-ln-translations-locales");
    if (this.locales = c, g)
      try {
        this.locales = JSON.parse(g);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(l) {
      l.detail && l.detail.lang && n.addLanguage(l.detail.lang);
    }, this._onRequestRemove = function(l) {
      l.detail && l.detail.lang && n.removeLanguage(l.detail.lang);
    }, m.addEventListener("ln-translations:request-add", this._onRequestAdd), m.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  d.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of m) {
      const n = g.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const l of n)
        l.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, d.prototype._detectExisting = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const g of m) {
      const n = g.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, d.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const m = this;
    let g = 0;
    for (const l in this.locales) {
      if (!this.locales.hasOwnProperty(l) || this.activeLanguages.has(l)) continue;
      g++;
      const o = Wt("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const f = o.querySelector("[data-ln-translations-lang]");
      f.setAttribute("data-ln-translations-lang", l), f.textContent = this.locales[l], f.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), m.menuEl.getAttribute("data-ln-toggle") === "open" && m.menuEl.setAttribute("data-ln-toggle", "close"), m.addLanguage(l));
      }), this.menuEl.appendChild(o);
    }
    const n = this.dom.querySelector("[data-ln-translations-add]");
    n && (n.hidden = g === 0);
  }, d.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const m = this;
    this.activeLanguages.forEach(function(g) {
      const n = Wt("ln-translations-badge", "ln-translations");
      if (!n) return;
      const l = n.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", g);
      const o = l.querySelector("span");
      o.textContent = m.locales[g] || g.toUpperCase();
      const f = l.querySelector("button"), u = m.locales[g] || g.toUpperCase();
      f.setAttribute("aria-label", m.removeLabel.replace("{lang}", u)), f.addEventListener("click", function(y) {
        y.ctrlKey || y.metaKey || y.button === 1 || (y.preventDefault(), y.stopPropagation(), m.removeLanguage(g));
      }), m.badgesEl.appendChild(n);
    });
  }, d.prototype.addLanguage = function(m, g) {
    if (this.activeLanguages.has(m)) return;
    const n = this.locales[m] || m;
    if (Y(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: m,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(m), g = g || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of o) {
      const u = f.getAttribute("data-ln-translatable"), y = f.getAttribute("data-ln-translations-prefix") || "", w = f.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!w) continue;
      const E = w.cloneNode(w.tagName === "SELECT");
      y ? E.name = y + "[trans][" + m + "][" + u + "]" : E.name = "trans[" + m + "][" + u + "]", E.value = g[u] !== void 0 ? g[u] : "", E.removeAttribute("id"), "placeholder" in E && (E.placeholder = this.placeholderLabel.replace("{lang}", n)), E.setAttribute("data-ln-translatable-lang", m);
      const _ = f.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), A = _.length > 0 ? _[_.length - 1] : w;
      A.parentNode.insertBefore(E, A.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: m,
      langName: n
    });
  }, d.prototype.removeLanguage = function(m) {
    if (!this.activeLanguages.has(m) || Y(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: m
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + m + '"]');
    for (const l of n)
      l.parentNode.removeChild(l);
    this.activeLanguages.delete(m), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: m
    });
  }, d.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, d.prototype.hasLanguage = function(m) {
    return this.activeLanguages.has(m);
  }, d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const m = this.defaultLang, g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of g)
      n.getAttribute("data-ln-translatable-lang") !== m && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, U(t, e, d, "ln-translations");
})();
const Qi = "ln-autosave:", $i = 1e3;
function Xi(t, e) {
  return e ? Qi + (t || "") + ":" + e : null;
}
function Yi(t, e = $i) {
  if (t == null) return 0;
  if (t === "") return e;
  const c = parseInt(String(t), 10);
  return isNaN(c) || c < 0 ? e : c;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", c = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", m = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  function g(l) {
    const o = l.tagName;
    return o === "INPUT" || o === "TEXTAREA" || o === "SELECT";
  }
  function n(l) {
    const f = l.getAttribute(t) || l.id, u = Xi(window.location.pathname, f);
    if (!u) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", l);
      return;
    }
    this.dom = l, this.key = u;
    let y = null;
    function w() {
      const a = Ze(l, { exclude: m });
      try {
        localStorage.setItem(u, JSON.stringify(a));
      } catch {
        return;
      }
      T(l, "ln-autosave:saved", { target: l, data: a });
    }
    function E() {
      let a;
      try {
        a = localStorage.getItem(u);
      } catch {
        return;
      }
      if (!a) return;
      let p;
      try {
        p = JSON.parse(a);
      } catch {
        return;
      }
      if (Y(l, "ln-autosave:before-restore", { target: l, data: p }).defaultPrevented) return;
      const i = tn(l, p);
      for (let h = 0; h < i.length; h++)
        i[h].dispatchEvent(new Event("input", { bubbles: !0 })), i[h].dispatchEvent(new Event("change", { bubbles: !0 }));
      T(l, "ln-autosave:restored", { target: l, data: p });
    }
    function _() {
      try {
        localStorage.removeItem(u);
      } catch {
        return;
      }
      T(l, "ln-autosave:cleared", { target: l });
    }
    this._onFocusout = function(a) {
      const p = a.target;
      g(p) && p.name && !p.matches(m) && w();
    }, this._onChange = function(a) {
      const p = a.target;
      g(p) && p.name && !p.matches(m) && w();
    }, this._onSubmit = function() {
      _();
    }, this._onReset = function() {
      _();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + c + "]") && _();
    }, l.addEventListener("focusout", this._onFocusout), l.addEventListener("change", this._onChange), l.addEventListener("submit", this._onSubmit), l.addEventListener("reset", this._onReset), l.addEventListener("click", this._onClearClick);
    const A = Yi(l.getAttribute(d));
    return A > 0 && (this._onInput = function(a) {
      const p = a.target;
      !g(p) || !p.name || p.matches(m) || (y !== null && clearTimeout(y), y = setTimeout(w, A));
    }, l.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return y;
    }, E(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const l = this._getInputTimer();
        l !== null && clearTimeout(l);
      }
      T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, U(t, e, n, "ln-autosave");
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  function c(d) {
    if (d.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", d.tagName), this;
    this.dom = d;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, d.addEventListener("input", this._onInput), this._resize(), this;
  }
  c.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, U(t, e, c, "ln-autoresize");
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const c = {
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
  }, m = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, g = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let n = 0;
  function l(a) {
    return !!(d[a] || m[a] || g[a] || a === "link");
  }
  function o(a) {
    this.dom = a;
    const p = this;
    if (this._textarea = a.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", a), this;
    const s = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), s && this._surface.setAttribute("data-placeholder", s);
    const i = this._textarea.id;
    if (i) {
      const b = a.querySelector('label[for="' + i + '"]');
      b && (b.id || (b.id = i + "-label"), this._surface.setAttribute("aria-labelledby", b.id));
    }
    this._surface.id = i ? i + "-surface" : "ln-editor-surface-" + ++n;
    const h = this._textarea.value.trim();
    h && (this._surface.innerHTML = h);
    const v = a.querySelector('[role="toolbar"]');
    if (v && v.nextSibling ? a.insertBefore(this._surface, v.nextSibling) : a.appendChild(this._surface), v) {
      v.setAttribute("aria-controls", this._surface.id);
      const b = v.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < b.length; S++) {
        const L = b[S].getAttribute("data-ln-editor-action");
        l(L) && b[S].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      p._syncToTextarea(), T(p.dom, "ln-editor:changed", {
        html: p._textarea.value,
        target: p.dom
      });
    }, this._onMousedownToolbar = function(b) {
      b.target.closest("[data-ln-editor-action]") && b.preventDefault();
    }, this._onClickToolbar = function(b) {
      const S = b.target.closest("[data-ln-editor-action]");
      if (!S) return;
      const L = S.getAttribute("data-ln-editor-action");
      p._execAction(L);
    }, this._onPaste = function(b) {
      y(p, b);
    }, this._onKeydown = function(b) {
      _(p, b);
    }, this._onSelectionChange = function() {
      document.contains(p._surface) && p._updateActiveStates();
    }, this._onFocus = function() {
      T(p.dom, "ln-editor:focus", { target: p.dom });
    }, this._onBlur = function() {
      p._syncToTextarea(), T(p.dom, "ln-editor:blur", { target: p.dom });
    }, this._onTextareaInput = function() {
      p._surface.innerHTML !== p._textarea.value && (p._surface.innerHTML = p._textarea.value, T(p.dom, "ln-editor:changed", {
        html: p._textarea.value,
        target: p.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), v && (v.addEventListener("mousedown", this._onMousedownToolbar), v.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(b) {
      const S = b.detail && b.detail.html;
      S !== void 0 && (p._surface.innerHTML = S, p._syncToTextarea(), T(p.dom, "ln-editor:changed", {
        html: p._textarea.value,
        target: p.dom
      }));
    }, a.addEventListener("ln-editor:set-content", this._onSetContent);
    const r = this._textarea.form;
    return r && (this._onFormReset = function() {
      setTimeout(function() {
        p._surface.innerHTML = p._textarea.value, T(a, "ln-editor:changed", {
          html: p._textarea.value,
          target: a
        });
      }, 0);
    }, r.addEventListener("reset", this._onFormReset)), this;
  }
  o.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, o.prototype._execAction = function(a) {
    if (!(!a || Y(this.dom, "ln-editor:before-change", {
      action: a,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), d[a])
        document.execCommand(d[a], !1, null);
      else if (m[a]) {
        const s = m[a], i = f(this._surface);
        i && i.toLowerCase() === s ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + s + ">");
      } else g[a] ? document.execCommand(g[a], !1, null) : a === "link" ? A(this) : a === "unlink" ? document.execCommand("unlink", !1, null) : a === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, o.prototype._updateActiveStates = function() {
    const a = this.dom.querySelector('[role="toolbar"]');
    if (!a) return;
    const p = window.getSelection();
    if (!p || p.rangeCount === 0) return;
    const s = p.anchorNode;
    if (!s || !this._surface.contains(s)) return;
    const i = a.querySelectorAll("[data-ln-editor-action]");
    for (let h = 0; h < i.length; h++) {
      const v = i[h], r = v.getAttribute("data-ln-editor-action");
      let b = !1;
      if (d[r])
        try {
          b = document.queryCommandState(d[r]);
        } catch {
        }
      else if (m[r]) {
        const S = f(this._surface);
        b = S && S.toLowerCase() === m[r];
      } else if (g[r])
        try {
          b = document.queryCommandState(g[r]);
        } catch {
        }
      else r === "link" && (b = !!u(p.anchorNode, "A", this._surface));
      l(r) && v.setAttribute("aria-pressed", String(b)), b ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
    }
  }, o.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, o.prototype.setHTML = function(a) {
    this._surface && (this._surface.innerHTML = a, this._syncToTextarea(), T(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const a = this.dom.querySelector('[role="toolbar"]');
    a && (a.removeEventListener("mousedown", this._onMousedownToolbar), a.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const p = this._textarea ? this._textarea.form : null;
    if (p && this._onFormReset && p.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const s = this.dom.querySelector(".ln-editor__link-popover");
      s && s.remove();
    }
    T(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function f(a) {
    const p = window.getSelection();
    if (!p || p.rangeCount === 0) return null;
    let s = p.anchorNode;
    if (!s) return null;
    for (; s && s !== a; ) {
      if (s.nodeType === 1) {
        const i = s.tagName;
        if (i === "H2" || i === "H3" || i === "H4" || i === "BLOCKQUOTE" || i === "PRE" || i === "P")
          return i;
      }
      s = s.parentNode;
    }
    return null;
  }
  function u(a, p, s) {
    for (; a && a !== s; ) {
      if (a.nodeType === 1 && a.tagName === p)
        return a;
      a = a.parentNode;
    }
    return null;
  }
  function y(a, p) {
    p.preventDefault();
    let s = "";
    if (p.clipboardData && (s = p.clipboardData.getData("text/html"), !s)) {
      const h = p.clipboardData.getData("text/plain");
      h && (s = h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), s = "<p>" + s + "</p>");
    }
    if (!s) return;
    const i = w(s);
    i && document.execCommand("insertHTML", !1, i);
  }
  function w(a) {
    const p = document.createElement("div");
    return p.innerHTML = a, E(p), p.innerHTML;
  }
  function E(a) {
    const p = Array.from(a.childNodes);
    for (let s = 0; s < p.length; s++) {
      const i = p[s];
      if (i.nodeType !== 3) {
        if (i.nodeType !== 1) {
          a.removeChild(i);
          continue;
        }
        if (c[i.tagName]) {
          const h = Array.from(i.attributes);
          for (let v = 0; v < h.length; v++) {
            const r = h[v].name;
            if (i.tagName === "A" && r === "href") {
              const b = i.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(b) || i.removeAttribute("href");
            } else
              i.removeAttribute(r);
          }
          i.tagName === "A" && i.setAttribute("rel", "noopener noreferrer"), E(i);
        } else {
          for (; i.firstChild; )
            a.insertBefore(i.firstChild, i);
          a.removeChild(i);
        }
      }
    }
  }
  function _(a, p) {
    if (!(p.ctrlKey || p.metaKey)) return;
    let s = null;
    switch (p.key.toLowerCase()) {
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
    s && (p.preventDefault(), a._execAction(s));
  }
  function A(a) {
    const p = window.getSelection();
    if (!p || p.rangeCount === 0) return;
    const s = u(p.anchorNode, "A", a._surface), i = p.getRangeAt(0).cloneRange();
    a._closeLinkPopover && a._closeLinkPopover();
    const h = vt(a.dom, "ln-editor-link-popover", "ln-editor");
    if (!h) return;
    const v = h.firstElementChild;
    if (!v) return;
    const r = v.querySelector('input[type="url"]'), b = v.querySelector('[data-ln-editor-action="confirm-link"]'), S = v.querySelector('[data-ln-editor-action="cancel-link"]');
    s && (r.value = s.getAttribute("href") || "");
    const L = a.dom.querySelector('[role="toolbar"]');
    L ? L.after(v) : a.dom.insertBefore(v, a._surface), r.focus();
    function q() {
      const P = window.getSelection();
      P.removeAllRanges(), P.addRange(i);
    }
    function k() {
      document.removeEventListener("mousedown", N), a._closeLinkPopover = null, v.remove();
    }
    function D() {
      const P = r.value.trim();
      if (k(), q(), a._surface.focus(), P)
        if (s)
          s.setAttribute("href", P), s.setAttribute("rel", "noopener noreferrer"), a._syncToTextarea(), T(a.dom, "ln-editor:changed", {
            html: a._textarea.value,
            target: a.dom
          });
        else {
          document.execCommand("createLink", !1, P);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const K = u(H.anchorNode, "A", a._surface);
            K && (K.setAttribute("rel", "noopener noreferrer"), a._syncToTextarea());
          }
        }
      else s && document.execCommand("unlink", !1, null);
    }
    function I() {
      k(), q(), a._surface.focus();
    }
    function O() {
      k();
    }
    function N(P) {
      const H = a.dom.contains(P.target) && P.target.closest('[data-ln-editor-action="link"]');
      !v.contains(P.target) && !H && O();
    }
    a._closeLinkPopover = k, b.addEventListener("click", D), S.addEventListener("click", I), r.addEventListener("keydown", function(P) {
      P.key === "Enter" ? (P.preventDefault(), D()) : P.key === "Escape" && (P.preventDefault(), I());
    }), document.addEventListener("mousedown", N);
  }
  U(t, e, o, "ln-editor");
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function c(m) {
    const g = {}, n = m.dataset;
    for (const l in n) {
      if (!l.startsWith("lnFill") || e[l]) continue;
      const o = l.slice(6);
      o && (g[o.charAt(0).toLowerCase() + o.slice(1)] = n[l]);
    }
    return g;
  }
  function d(m, g) {
    const n = window.CSS && CSS.escape ? CSS.escape(g) : g, l = document.querySelectorAll('[data-ln-fill-id="' + n + '"]');
    if (l.length === 0) return null;
    for (let o = 0; o < l.length; o++) {
      const f = l[o].getAttribute("data-ln-fill-form");
      if (f) {
        const u = document.getElementById(f);
        if (u && m.contains(u)) return l[o];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const g = m.target.closest("[data-ln-fill-form]");
    if (!g) return;
    const n = g.getAttribute("href");
    if (n && n.indexOf("#") !== -1) return;
    const l = g.getAttribute("data-ln-fill-form"), o = document.getElementById(l);
    if (!o) return;
    const f = c(g), u = Object.keys(f).length > 0;
    window.lnCore.lnFill(o, u ? f : null);
  }), document.addEventListener("ln-fill:request", function(m) {
    const g = m.detail;
    if (!g) return;
    const n = m.target, l = g.id;
    if (l == null) {
      window.lnCore.lnFill(n, null);
      return;
    }
    const o = d(n, l);
    if (!o) return;
    const f = c(o);
    window.lnCore.lnFill(n, f);
  }), window[t] = !0;
})();
function Ji(t, e = "-") {
  if (t == null) return "";
  const c = e || "-", d = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, c).replace(new RegExp(`${d}+`, "g"), c).replace(new RegExp(`^${d}+|${d}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  function c(d) {
    if (d.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", d.tagName), this;
    const m = d.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", d), this;
    const g = d.getAttribute(t), n = m.elements[g];
    if (!n)
      return console.warn('[ln-slug] Source field "' + g + '" not found in form:', d), this;
    if (typeof n.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + g + '" is a RadioNodeList (same-name group) — single source field required:', d), this;
    this.dom = d, this.source = n, this._pristine = d.value === "", this._mirroring = !1;
    const l = this;
    return this._onSource = function() {
      l._pristine && l._mirror();
    }, this._onSlug = function() {
      l._mirroring || (l._pristine = l.dom.value === "");
    }, n.addEventListener("input", this._onSource), d.addEventListener("input", this._onSlug), this._pristine && n.value && n.value.trim() !== "" && this._mirror(), this;
  }
  c.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Ji(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, U(t, e, c, "ln-slug");
})();
function Zi(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const c = typeof e == "number" ? e : e.getTime(), d = t.getTime(), m = Math.floor((d - c) / 1e3), g = Math.abs(m);
  return g < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : g < 60 ? { value: m, unit: "second", isOlderThanMonth: !1 } : g < 3600 ? { value: Math.round(m / 60), unit: "minute", isOlderThanMonth: !1 } : g < 86400 ? { value: Math.round(m / 3600), unit: "hour", isOlderThanMonth: !1 } : g < 604800 ? { value: Math.round(m / 86400), unit: "day", isOlderThanMonth: !1 } : g < 2592e3 ? { value: Math.round(m / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(m / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function zt(t, e, c = /* @__PURE__ */ new Date()) {
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
      return e && e.getFullYear() !== c.getFullYear() && (d.year = "numeric"), d;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-time": { effect: h },
    "data-ln-time-locale": { effect: h }
  }, d = {}, m = {};
  function g(r) {
    return r.getAttribute("data-ln-time-locale") || J(r);
  }
  function n(r, b) {
    const S = (r || "") + "|" + JSON.stringify(b);
    return d[S] || (d[S] = new Intl.DateTimeFormat(r, b)), d[S];
  }
  function l(r) {
    const b = r || "";
    return m[b] || (m[b] = new Intl.RelativeTimeFormat(r, { numeric: "auto", style: "narrow" })), m[b];
  }
  const o = /* @__PURE__ */ new Set();
  let f = null;
  function u() {
    f || (f = setInterval(w, 6e4));
  }
  function y() {
    f && (clearInterval(f), f = null);
  }
  function w() {
    for (const r of o) {
      if (!document.body.contains(r.dom)) {
        o.delete(r);
        continue;
      }
      s(r);
    }
    o.size === 0 && y();
  }
  function E(r, b) {
    const S = At(b), L = (b || "").toLowerCase().split("-")[0], q = n(b, zt("full", r)), k = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && k !== L && S.monthsLong) {
      const D = S.monthsLong[r.getMonth()], I = r.getDate(), O = r.getFullYear(), N = String(r.getHours()).padStart(2, "0"), P = String(r.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${O} во ${N}:${P}`;
    }
    return q.format(r);
  }
  function _(r, b) {
    const S = zt("short", r), L = At(b), q = (b || "").toLowerCase().split("-")[0], k = n(b, S), D = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && D !== q && L.monthsShort) {
      const I = L.monthsShort[r.getMonth()], O = r.getDate(), N = S.year ? " " + r.getFullYear() : "";
      return `${O} ${I}${N}`;
    }
    return k.format(r);
  }
  function A(r, b) {
    return n(b, zt("date", r)).format(r);
  }
  function a(r, b) {
    return n(b, zt("time", r)).format(r);
  }
  function p(r, b) {
    const S = Zi(r);
    return S.isOlderThanMonth ? _(r, b) : l(b).format(S.value, S.unit);
  }
  function s(r) {
    const b = r.dom.getAttribute("datetime");
    if (!b) return;
    const S = it(b);
    if (!S) return;
    const L = r.dom.getAttribute(t) || "short", q = g(r.dom);
    let k;
    switch (L) {
      case "relative":
        k = p(S, q);
        break;
      case "full":
        k = E(S, q);
        break;
      case "date":
        k = A(S, q);
        break;
      case "time":
        k = a(S, q);
        break;
      default:
        k = _(S, q);
        break;
    }
    r.dom.textContent = k, L !== "full" && (r.dom.title = E(S, q));
  }
  function i(r) {
    this.dom = r;
    const b = this;
    return this._onLocaleChange = function() {
      s(b);
    }, Jt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), s(this), r.getAttribute(t) === "relative" && (o.add(this), u()), this;
  }
  i.prototype.render = function() {
    s(this);
  }, i.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), o.delete(this), o.size === 0 && y(), delete this.dom[e];
  };
  function h(r) {
    const b = r[e];
    if (!b) return;
    r.getAttribute(t) === "relative" ? (o.add(b), u()) : (o.delete(b), o.size === 0 && y()), s(b);
  }
  function v(r) {
    r.nodeType === 1 && r.hasAttribute && r.hasAttribute(t) && r[e] && s(r[e]);
  }
  U(t, e, i, "ln-time", {
    attributes: c,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: h,
    onInit: v
  });
})();
function tr(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, c = t.pageSize > 0 ? t.pageSize : 200, d = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, g = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let l = 0, o = 0, f = 0, u = !1, y = null;
  function w(A, a) {
    g.delete(A), g.set(A, a);
  }
  function E() {
    if (g.size <= e) return [];
    const A = [];
    for (; g.size > e; ) {
      const p = g.keys().next().value;
      A.push(g.get(p)), g.delete(p);
    }
    const a = new Set(g.values());
    return A.filter((p) => !a.has(p));
  }
  function _(A, a) {
    n.add(A), clearTimeout(y), y = setTimeout(() => m(A, c, a), d);
  }
  return {
    get logicalTotal() {
      return l;
    },
    set logicalTotal(A) {
      l = A;
    },
    get grandTotal() {
      return o;
    },
    set grandTotal(A) {
      o = A;
    },
    get queryGen() {
      return f;
    },
    set queryGen(A) {
      f = A;
    },
    get size() {
      return g.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return u;
    },
    getId: (A) => {
      if (!g.has(A)) return;
      const a = g.get(A);
      return w(A, a), a;
    },
    ensure: (A, a, p) => {
      if (!u && !n.has(0)) return _(0, p);
      if (l <= 0) return;
      const s = Math.max(0, A), i = Math.min(l, a);
      for (let h = s; h < i; h++)
        if (!g.has(h)) {
          const v = Math.floor(h / c) * c;
          if (!n.has(v)) return _(v, p);
        }
    },
    ingest: (A, a, p, s, i) => {
      if (i != null && i !== f) return [];
      u = !0, p != null && (o = p), s != null && (l = s);
      for (let h = 0; h < a.length; h++)
        w(A + h, a[h]);
      return n.delete(A), E();
    },
    reset: function() {
      f++, this.clear();
    },
    clear: () => {
      u = !1, g.clear(), n.clear(), clearTimeout(y);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (A = {}) => {
      let a = [];
      return A.windowSize > 0 && A.windowSize !== e && (e = A.windowSize, a = E()), A.pageSize > 0 && (c = A.pageSize), A.fetchDebounce >= 0 && (d = A.fetchDebounce), a;
    }
  };
}
function er(t, e, c) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: m } = e, g = m === "desc", n = t.map((o) => o ? o[d] : void 0), l = ye(n);
  return [...t].sort((o, f) => {
    const u = o ? o[d] : void 0, y = f ? f[d] : void 0, w = ve(u, y, l, c);
    return g ? -w : w;
  });
}
function On(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const c = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return c.length ? t.filter((d) => d ? c.every((m) => Ae(d[m], e[m])) : !1) : t;
}
function nr(t, e, c) {
  if (!Array.isArray(t) || !e || !c || !c.length) return t;
  const d = _n(e);
  return d.length ? t.filter((m) => m ? d.every(
    (g) => c.some((n) => {
      const l = m[n];
      return l != null && bn(String(l), [g]);
    })
  ) : !1) : t;
}
function ir(t, e, c) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (c === "count") return t.length;
  const d = t.map((g) => g && g[e] != null ? parseFloat(g[e]) : NaN).filter((g) => Number.isFinite(g)), m = d.reduce((g, n) => g + n, 0);
  return c === "sum" ? m : c === "avg" && d.length ? m / d.length : 0;
}
function rr(t, e = {}, c = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const m = t.length;
  let g = t;
  e.filters && (g = On(g, e.filters)), e.search && (g = nr(g, e.search, c));
  const n = g.length;
  if (e.sort && (g = er(g, e.sort, d)), e.offset || e.limit) {
    const l = e.offset || 0, o = e.limit || g.length;
    g = g.slice(l, l + o);
  }
  return { records: g, total: m, filtered: n };
}
function or(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((c) => {
    if (!c) return null;
    const d = { ...c };
    for (const [m, g] of Object.entries(e))
      if (typeof g == "function")
        try {
          d[m] = g(c);
        } catch {
          d[m] = void 0;
        }
    return d;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function c(C, x, R) {
    const M = C.getAttribute(x);
    if (M === "never" || M === "-1") return -1;
    const F = parseInt(M, 10);
    return isNaN(F) ? R : F;
  }
  const d = {
    "data-ln-data-store": { effect: qe },
    "data-ln-data-store-indexes": { effect: qe },
    "data-ln-data-store-stale": { prop: "_staleThreshold", read: c, fallback: 300 },
    "data-ln-data-store-search-fields": { prop: "_searchFields", read: Xn },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", read: be },
    "data-ln-data-store-window": { prop: "_windowSize", read: xe, fallback: 1e3, effect: Qn },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", read: xe, fallback: 200, effect: $n }
  }, m = Jn(d), g = "ln_app_cache", n = "_meta", l = "1.0";
  let o = null, f = null;
  const u = {};
  function y(C) {
    C && C.name === "QuotaExceededError" && T(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function w() {
    const C = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const R = x.id;
      if (R) {
        const M = x.getAttribute("data-ln-data-store-indexes") || "";
        C[R] = {
          indexes: M.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function E() {
    return f || (f = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const x = w(), R = Object.keys(x), M = indexedDB.open(g);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (F) => {
        const B = F.target.result, z = Array.from(B.objectStoreNames);
        if (!(!z.includes(n) || R.some((ct) => !z.includes(ct))))
          return _(B), o = B, C(B);
        const X = B.version;
        B.close();
        const Z = indexedDB.open(g, X + 1);
        Z.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Z.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, Z.onupgradeneeded = (ct) => {
          const rt = ct.target.result;
          rt.objectStoreNames.contains(n) || rt.createObjectStore(n, { keyPath: "key" });
          for (const wt of R)
            if (!rt.objectStoreNames.contains(wt)) {
              const kt = rt.createObjectStore(wt, { keyPath: "id" });
              for (const ne of x[wt].indexes)
                kt.createIndex(ne, ne, { unique: !1 });
            }
        }, Z.onsuccess = (ct) => {
          const rt = ct.target.result;
          _(rt), o = rt, C(rt);
        };
      };
    }), f);
  }
  function _(C) {
    C.onversionchange = () => {
      C.close(), o = null, f = null;
    };
  }
  function A() {
    return o ? Promise.resolve(o) : (f = null, E());
  }
  async function a(C) {
    if (!_t() || !C) return C;
    const x = { ...C }, R = x.id, M = await hi(x);
    return !M || !M.encrypted ? C : {
      id: R,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function p(C) {
    return !C || !C.encrypted || !_t() ? C : fi(C);
  }
  const s = (C, x) => A().then((R) => R ? R.transaction(C, x).objectStore(C) : null);
  function i(C) {
    return new Promise((x, R) => {
      C.onsuccess = () => x(C.result), C.onerror = () => {
        y(C.error), R(C.error);
      };
    });
  }
  const h = (C) => s(C, "readonly").then((x) => x ? i(x.getAll()) : []).then((x) => _t() ? Promise.all(x.map((R) => p(R))) : x), v = (C, x) => s(C, "readonly").then((R) => R ? i(R.get(x)) : null).then((R) => R ? p(R) : null), r = (C, x) => A().then((R) => {
    if (!R) return [];
    const F = R.transaction(C, "readonly").objectStore(C), B = x.map((z) => i(F.get(z)));
    return Promise.all(B).then((z) => _t() ? Promise.all(z.map(($) => p($))) : z);
  }), b = (C, x) => (_t() ? a(x) : Promise.resolve(x)).then((M) => s(C, "readwrite").then((F) => F ? i(F.put(M)) : null)), S = (C, x) => s(C, "readwrite").then((R) => R ? i(R.delete(x)) : null), L = (C) => s(C, "readwrite").then((x) => x ? i(x.clear()) : null), q = (C) => s(C, "readonly").then((x) => x ? i(x.count()) : 0), k = (C) => s(n, "readonly").then((x) => x ? i(x.get(C)) : null), D = (C, x) => s(n, "readwrite").then((R) => {
    if (R)
      return x.key = C, i(R.put(x));
  });
  function I(C) {
    return this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C), Yn(this, C, m), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, C.hasAttribute("data-ln-data-store-window") ? this._windowIndex = tr({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, R, M) => {
        T(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: R,
          query: M,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), u[this._name] = this, O(this), this.ready = j(this), this;
  }
  function O(C) {
    C._handlers = {
      create: (x) => N(C, "create", x.detail, () => H(C, x.detail)),
      update: (x) => N(C, "update", x.detail, () => K(C, x.detail)),
      delete: (x) => N(C, "delete", x.detail, () => W(C, x.detail)),
      "bulk-delete": (x) => N(C, "bulk-delete", x.detail, () => Q(C, x.detail)),
      "sync-failed": (x) => {
        C.isSyncing = !1, T(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: x.detail && x.detail.error,
          status: x.detail && x.detail.status
        });
      }
    };
    for (const [x, R] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${x}`, R);
    C._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.term != null ? x.detail.term : "";
        R !== C.query.search && (C.query.search = R, ee(C));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.key;
        if (!R) return;
        const M = (x.detail.values || []).slice(), F = C.query.filters[R];
        (F ? F.length === M.length && F.every((z, $) => z === M[$]) : !M.length) || (M.length ? C.query.filters[R] = M : delete C.query.filters[R], ee(C));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.field, M = x.detail && x.detail.direction, F = M && M !== "none" ? { field: R, direction: M } : null, B = C.query.sort;
        !B && !F || B && F && B.field === F.field && B.direction === F.direction || (C.query.sort = F, ee(C));
      }
    };
    for (const [x, R] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(x, R);
  }
  function N(C, x, R, M) {
    const F = R && R.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return M();
    }).catch((B) => G(C, x, F, B)), C._mutationChain;
  }
  function P(C, x = 0) {
    return q(C._name).then((R) => {
      if (C._windowIndex || C.windowed) {
        const M = C.totalCount != null ? C.totalCount : R;
        C.totalCount = Math.max(0, M + x);
      } else
        C.totalCount = R;
      return C.hasCache = !0, C.isLoaded = !0, C.canServe = !0, D(C._name, {
        schema_version: l,
        last_synced_at: C.lastSyncedAt,
        has_cache: !0,
        record_count: C.totalCount
      });
    });
  }
  function H(C, { tempId: x, data: R = {}, requestId: M } = {}) {
    const F = { ...R, id: x };
    return b(C._name, F).then(() => P(C, 1)).then(() => {
      T(C.dom, "ln-data-store:created", { store: C._name, record: F, tempId: x, requestId: M });
    });
  }
  function K(C, { id: x, data: R = {}, requestId: M } = {}) {
    return v(C._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const B = { ...F, ...R }, z = R.id;
      return (z !== void 0 && z !== x ? Nn(C._name, x, B) : b(C._name, B)).then(() => P(C, 0)).then(() => {
        T(C.dom, "ln-data-store:updated", { store: C._name, record: B, previous: F, requestId: M });
      });
    });
  }
  function W(C, { id: x, requestId: R } = {}) {
    return v(C._name, x).then((M) => {
      if (!M) {
        T(C.dom, "ln-data-store:deleted", { store: C._name, id: x, requestId: R, missing: !0 });
        return;
      }
      return S(C._name, x).then(() => P(C, -1)).then(() => {
        T(C.dom, "ln-data-store:deleted", { store: C._name, id: x, requestId: R });
      });
    });
  }
  function Q(C, { ids: x = [], requestId: R } = {}) {
    return x.length ? Promise.all(x.map((M) => v(C._name, M))).then((M) => {
      const F = M.filter(Boolean).map((B) => B.id);
      return St(C._name, F).then(() => P(C, -F.length)).then(() => {
        T(C.dom, "ln-data-store:deleted", { store: C._name, ids: F, requestId: R });
      });
    }) : (T(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: R }), Promise.resolve());
  }
  function G(C, x, R, M) {
    console.error("[ln-data-store] " + x + " failed:", M), T(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: x,
      requestId: R,
      error: M
    });
  }
  function j(C) {
    return E().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return k(C._name);
    }).then((x) => {
      if (C.initializationError = null, x && x.schema_version === l)
        C.lastSyncedAt = x.last_synced_at || null, C.totalCount = x.record_count || 0, C.hasCache = x.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, C.canServe = !0, T(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, T(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (x && x.schema_version !== l)
          return L(C._name).then(() => D(C._name, { schema_version: l, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, T(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, T(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (C.isInitialized = !0, C.isLoaded = !1, C.canServe = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = x, T(C.dom, "ln-data-store:initialization-error", { store: C._name, error: x }), { ok: !1, error: x }));
  }
  function V(C) {
    C.isSyncing = !0, T(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function et(C, x) {
    return A().then((R) => R ? (_t() ? Promise.all(x.map((F) => a(F))) : Promise.resolve(x)).then((F) => new Promise((B, z) => {
      const $ = R.transaction(C, "readwrite"), X = $.objectStore(C);
      F.forEach((Z) => X.put(Z)), $.oncomplete = () => B(), $.onerror = () => {
        y($.error), z($.error);
      };
    })) : void 0);
  }
  function St(C, x) {
    return A().then((R) => {
      if (R)
        return new Promise((M, F) => {
          const B = R.transaction(C, "readwrite"), z = B.objectStore(C);
          x.forEach(($) => z.delete($)), B.oncomplete = () => M(), B.onerror = () => F(B.error);
        });
    });
  }
  function Nn(C, x, R) {
    return (_t() ? a(R) : Promise.resolve(R)).then((F) => A().then((B) => {
      if (B)
        return new Promise((z, $) => {
          const X = B.transaction(C, "readwrite"), Z = X.objectStore(C);
          Z.put(F), Z.delete(x), X.oncomplete = () => z(), X.onerror = () => {
            y(X.error), $(X.error);
          };
        });
    }));
  }
  const Pn = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Bn(C) {
    return C ? Object.keys(C).filter((x) => Array.isArray(C[x]) && C[x].length > 0) : [];
  }
  function Hn(C, x, R) {
    return x.every((M) => R[M].map(String).includes(String(C[M])));
  }
  function Un(C) {
    return String(C || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function zn(C, x, R) {
    return x.every(
      (M) => R.some((F) => {
        const B = C[F];
        return B != null && String(B).toLowerCase().includes(M);
      })
    );
  }
  function Kn(C, x, R) {
    return ir(C, x, R);
  }
  function xt(C, x) {
    return or(x, C.presenters && C.presenters.computed);
  }
  function jn(C) {
    return !C.sort && !_t();
  }
  function Vn(C, x, R) {
    const M = Bn(x.filters), F = x.search ? Un(x.search) : [], B = C._searchFields, z = F.length > 0 && B && B.length > 0;
    return s(C._name, "readonly").then(($) => $ ? new Promise((X, Z) => {
      const ct = [], rt = $.openCursor();
      rt.onsuccess = () => {
        const wt = rt.result;
        if (!wt || ct.length >= R) {
          X(ct);
          return;
        }
        const kt = wt.value;
        (!M.length || Hn(kt, M, x.filters)) && (!z || zn(kt, F, B)) && ct.push(kt), wt.continue();
      }, rt.onerror = () => Z(rt.error);
    }) : []);
  }
  function Te(C, x, R) {
    return rr(x, R, C._searchFields, Pn);
  }
  function Le(C, x, R) {
    const M = [];
    for (let B = x; B < x + R; B++) {
      const z = C._windowIndex.getId(B);
      M.push(z);
    }
    const F = Array.from(new Set(M.filter((B) => B !== void 0)));
    return r(C._name, F).then((B) => {
      const z = /* @__PURE__ */ new Map();
      for (let X = 0; X < B.length; X++) {
        const Z = B[X];
        Z && z.set(String(Z.id), Z);
      }
      const $ = [];
      for (let X = 0; X < M.length; X++) {
        const Z = M[X];
        if (Z === void 0)
          $.push(null);
        else {
          const ct = z.get(String(Z));
          $.push(ct || null);
        }
      }
      return {
        data: xt(C, $),
        total: C._windowIndex.grandTotal,
        filtered: C._windowIndex.logicalTotal,
        offset: x,
        queryGen: C._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(C = {}) {
    const x = this;
    if (x._windowIndex) {
      const R = C.offset || 0, M = C.limit || 200;
      if (x._windowIndex.ensure(R, R + M, C), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const F = R + M, B = (z) => z.length ? {
          data: xt(x, z),
          offset: R,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Le(x, R, M);
        return jn(C) ? Vn(x, C, F).then((z) => B(z.slice(R, F))) : h(x._name).then((z) => B(Te(x, z, C).records));
      }
      return Le(x, R, M);
    }
    return h(x._name).then((R) => {
      const M = Te(x, R, C);
      return {
        data: xt(x, M.records),
        total: M.total,
        filtered: M.filtered
      };
    });
  }, I.prototype.getById = function(C) {
    return v(this._name, C).then((x) => x ? xt(this, [x])[0] : null);
  }, I.prototype.count = function(C) {
    return C && Object.keys(C).length > 0 ? h(this._name).then((R) => On(R, C).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : q(this._name);
  }, I.prototype.aggregate = function(C, x) {
    return h(this._name).then((R) => Kn(R, C, x));
  }, I.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, I.prototype.applySync = function(C, x, R, M) {
    M = M || {};
    const F = this;
    if (F._windowIndex && M.queryGen != null && M.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    C.length > 0 || x.length > 0;
    let B = Promise.resolve();
    return C.length > 0 && (B = B.then(() => et(F._name, C))), x.length > 0 && (B = B.then(() => St(F._name, x))), B.then(() => {
      if (F._windowIndex && (M.offset != null || M.total != null)) {
        const z = M.offset != null ? M.offset : 0, $ = C.map((Z) => Z.id), X = F._windowIndex.ingest(z, $, M.total, M.filtered, M.queryGen);
        if (X && X.length) return St(F._name, X);
      }
    }).then(() => q(F._name)).then((z) => (F.totalCount = M.total !== void 0 ? M.total : z, F.hasCache = !0, D(F._name, {
      schema_version: l,
      last_synced_at: R,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const z = !F.isLoaded;
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = R, z ? (T(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: M }), T(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: M })) : T(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: C.length,
        deleted: x.length,
        changed: !0,
        meta: M
      });
    }).catch((z) => {
      F.isSyncing = !1, console.error("[ln-data-store] applySync failed:", z);
    });
  }, I.prototype.applyQuery = function(C, x) {
    x = x || {};
    const R = this;
    let M = Promise.resolve();
    return C.length > 0 && (M = M.then(() => et(R._name, C))), M.then(() => q(R._name)).then((F) => (R.totalCount = x.total !== void 0 ? x.total : F, C.length > 0 && (R.canServe = !0), xt(R, C))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const C = this;
    return L(C._name).then(() => D(C._name, {
      schema_version: l,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, V(C);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [C, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, x);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, x] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, x);
      this._queryHandlers = null;
    }
    delete u[this._name], delete this.dom[e], T(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Wn() {
    return A().then((C) => {
      if (!C) return;
      const x = Array.from(C.objectStoreNames);
      return new Promise((R, M) => {
        const F = C.transaction(x, "readwrite");
        x.forEach((B) => F.objectStore(B).clear()), F.oncomplete = () => R(), F.onerror = () => M(F.error);
      });
    }).then(() => {
      Object.values(u).forEach((C) => {
        C.isLoaded = !1, C.canServe = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function ee(C) {
    C._windowIndex && C._windowIndex.reset(), T(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  const Gn = "data-ln-data-store-frozen";
  function qe(C, x) {
    C.setAttribute(Gn, x);
  }
  function Qn(C) {
    const x = C[e];
    if (!x._windowIndex) return;
    const R = x._windowIndex.configure({ windowSize: x._windowSize });
    R.length && St(x._name, R).catch((M) => {
      console.error("[ln-data-store] window shrink eviction failed:", M);
    });
  }
  function $n(C) {
    const x = C[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  U(t, e, I, "ln-data-store", {
    attributes: d
  }), window[e].clearAll = Wn, window[e].init = window[e], window[e].setStorageKey = Ie, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ie);
})();
const sr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, c) => {
    const d = String(e);
    return c === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function ar(t, e) {
  if (!t || typeof t != "object") return "";
  const c = Object.assign({}, sr);
  if (e && typeof e == "object")
    for (const m in e)
      e[m] !== void 0 && e[m] !== null && e[m] !== "" && (c[m] = e[m]);
  const d = new URLSearchParams();
  return t.search && d.append(c.search, t.search), t.offset != null && d.append(c.offset, t.offset), t.limit != null && d.append(c.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(c.sortField, t.sort.field), d.append(c.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((m) => {
    const g = t.filters[m];
    Array.isArray(g) && g.length > 0 && d.append(m, g.join(","));
  }), d.toString();
}
function lr(t, e, c) {
  let d = Et(t, e);
  return c && (d += (d.indexOf("?") !== -1 ? "&" : "?") + c), d;
}
function je(t) {
  const e = t && t.content !== void 0 ? t.content : t, c = t && t.message ? t.message : null;
  return { record: e, message: c };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", c = "lnConnector";
  if (window[e] !== void 0) return;
  function d(o) {
    const f = o[e];
    f && f.refreshConfig();
  }
  const m = {
    "data-ln-api-connector": {},
    "data-ln-api-base-url": { effect: d },
    "data-ln-api-path": { effect: d },
    "data-ln-api-headers": { effect: d },
    "data-ln-api-param-offset": { effect: d },
    "data-ln-api-param-limit": { effect: d },
    "data-ln-api-param-search": { effect: d },
    "data-ln-api-param-sort-field": { effect: d },
    "data-ln-api-param-sort-dir": { effect: d },
    "data-ln-api-connector-query-debounce": { effect: d }
  };
  function g(o) {
    return o.ok ? o.status === 204 ? null : o.json() : o.json().catch(() => null).then((f) => {
      const u = new Error("HTTP " + o.status + ": " + o.statusText);
      throw u.status = o.status, u.data = f, u;
    });
  }
  function n(o) {
    return this.dom = o, o[e] = this, o[c] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, l(this), this;
  }
  n.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = o.getAttribute("data-ln-api-headers"), this.headers = ln(this.rawHeaders);
    const f = {}, u = o.getAttribute("data-ln-api-param-offset");
    u && (f.offset = u);
    const y = o.getAttribute("data-ln-api-param-limit");
    y && (f.limit = y);
    const w = o.getAttribute("data-ln-api-param-search");
    w && (f.search = w);
    const E = o.getAttribute("data-ln-api-param-sort-field");
    E && (f.sortField = E);
    const _ = o.getAttribute("data-ln-api-param-sort-dir");
    _ && (f.sortDir = _), this.paramKeys = f;
    const A = o.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, T(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, n.prototype._reqHeaders = function(o) {
    const f = Object.assign({}, this.headers);
    return !f.Accept && !f.accept && (f.Accept = "application/json"), !f["Content-Type"] && !f["content-type"] && (f["Content-Type"] = "application/json"), o && (f["X-Idempotency-Key"] = o), f;
  }, n.prototype.cancel = function(o) {
    return o && this._inflight.has(o) ? (this._inflight.get(o).abort(), this._inflight.delete(o), !0) : !1;
  }, n.prototype.fetchDelta = function(o, f) {
    const u = this;
    let y = Et(u.baseUrl, u.path);
    o != null && o !== "" && (y += (y.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o));
    const w = f || "sync";
    u._inflight.has(w) && u._inflight.get(w).abort();
    const E = new AbortController();
    return u._inflight.set(w, E), window.fetch(y, {
      method: "GET",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      signal: E.signal
    }).then(g).finally(function() {
      u._inflight.get(w) === E && u._inflight.delete(w);
    });
  }, n.prototype.query = function(o, f) {
    const u = this, y = ar(o, u.paramKeys), w = lr(u.baseUrl, u.path, y), E = f || "query";
    u._inflight.has(E) && u._inflight.get(E).abort();
    const _ = new AbortController();
    return u._inflight.set(E, _), window.fetch(w, {
      method: "GET",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      signal: _.signal
    }).then(g).finally(function() {
      u._inflight.get(E) === _ && u._inflight.delete(E);
    });
  }, n.prototype.create = function(o, f, u) {
    const y = this;
    return window.fetch(Et(y.baseUrl, f || y.path), {
      method: "POST",
      headers: y._reqHeaders(u),
      credentials: y.credentials,
      body: JSON.stringify(o)
    }).then(g);
  }, n.prototype.update = function(o, f, u, y, w) {
    const E = this;
    u != null && (f = Object.assign({}, f, { expected_version: u }));
    const _ = y ? Et(E.baseUrl, y) : Et(E.baseUrl, E.path, o);
    return window.fetch(_, {
      method: "PUT",
      headers: E._reqHeaders(w),
      credentials: E.credentials,
      body: JSON.stringify(f)
    }).then(g);
  }, n.prototype.delete = function(o, f, u) {
    const y = this;
    return window.fetch(Et(y.baseUrl, f || y.path, o), {
      method: "DELETE",
      headers: y._reqHeaders(u),
      credentials: y.credentials
    }).then(g);
  }, n.prototype.bulkDelete = function(o, f, u) {
    const y = this;
    return window.fetch(Et(y.baseUrl, f || y.path, "bulk-delete"), {
      method: "DELETE",
      headers: y._reqHeaders(u),
      credentials: y.credentials,
      body: JSON.stringify({ ids: o })
    }).then(g);
  };
  function l(o) {
    o._handlers = {
      sync: function(f) {
        const u = f.detail || {}, y = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        o.fetchDelta(u.since, y).then(function(w) {
          T(o.dom, "ln-api-connector:fetched", { data: w, since: u.since, meta: u.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      query: function(f) {
        const u = f.detail || {}, y = u.query || u, w = u.meta && u.meta.targetEl ? u.meta.targetEl : null, E = w || "query", _ = o.queryDebounce;
        function A(p, s, i) {
          o.query(s, i).then(function(h) {
            const v = h || {};
            T(o.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: s.offset,
              queryGen: s.queryGen,
              meta: p.meta || null
            });
          }).catch(function(h) {
            h && h.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
              action: "query",
              error: h.message,
              status: h.status || 0,
              data: h.data || null,
              meta: p.meta || null
            });
          });
        }
        if (_ === 0) {
          A(u, y, w);
          return;
        }
        o._queryTimers.has(E) && clearTimeout(o._queryTimers.get(E));
        const a = setTimeout(function() {
          o._queryTimers.delete(E), A(u, y, w);
        }, _);
        o._queryTimers.set(E, a);
      },
      cancel: function(f) {
        const u = f.detail || {}, y = u.meta && u.meta.targetEl ? u.meta.targetEl : u.targetEl || u.key;
        y && o.cancel(y);
      },
      create: function(f) {
        const u = f.detail || {};
        o.create(u.data, u.url, u.idempotencyKey).then(function(y) {
          const w = je(y);
          T(o.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: u.tempId,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
            action: "create",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(f) {
        const u = f.detail || {};
        o.update(u.id, u.data, u.expected_version, u.url, u.idempotencyKey).then(function(y) {
          const w = je(y);
          T(o.dom, "ln-api-connector:updated", {
            record: w.record,
            id: u.id,
            message: w.message,
            meta: u.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: u.id,
            conflictData: y.status === 409 ? y.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(f) {
        const u = f.detail || {};
        o.delete(u.id, u.url, u.idempotencyKey).then(function(y) {
          const w = y && y.message ? y.message : null;
          T(o.dom, "ln-api-connector:deleted", {
            response: y,
            id: u.id,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const u = f.detail || {};
        o.bulkDelete(u.ids, u.url, u.idempotencyKey).then(function(y) {
          const w = y && y.message ? y.message : null;
          T(o.dom, "ln-api-connector:bulk-deleted", {
            response: y,
            ids: u.ids,
            message: w,
            meta: u.meta || null
          });
        }).catch(function(y) {
          y && y.name === "AbortError" || T(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, o.dom.addEventListener("ln-api-connector:request-sync", o._handlers.sync), o.dom.addEventListener("ln-api-connector:request-query", o._handlers.query), o.dom.addEventListener("ln-api-connector:request-fetch", o._handlers.query), o.dom.addEventListener("ln-api-connector:request-cancel", o._handlers.cancel), o.dom.addEventListener("ln-api-connector:request-create", o._handlers.create), o.dom.addEventListener("ln-api-connector:request-update", o._handlers.update), o.dom.addEventListener("ln-api-connector:request-delete", o._handlers.delete), o.dom.addEventListener("ln-api-connector:request-bulk-delete", o._handlers.bulkDelete);
  }
  n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this;
    o._inflight && (o._inflight.forEach(function(f) {
      f.abort();
    }), o._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(f) {
      f && clearTimeout(f);
    }), this._queryTimers.clear()), this._handlers && (o.dom.removeEventListener("ln-api-connector:request-sync", o._handlers.sync), o.dom.removeEventListener("ln-api-connector:request-query", o._handlers.query), o.dom.removeEventListener("ln-api-connector:request-fetch", o._handlers.query), o.dom.removeEventListener("ln-api-connector:request-cancel", o._handlers.cancel), o.dom.removeEventListener("ln-api-connector:request-create", o._handlers.create), o.dom.removeEventListener("ln-api-connector:request-update", o._handlers.update), o.dom.removeEventListener("ln-api-connector:request-delete", o._handlers.delete), o.dom.removeEventListener("ln-api-connector:request-bulk-delete", o._handlers.bulkDelete), o._handlers = null), T(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[c];
  }, U(t, e, n, "ln-api-connector", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", c = "lnConnector";
  if (window[e] !== void 0) return;
  function d(E) {
    const _ = E[e];
    _ && _.refreshConfig();
  }
  const m = {
    "data-ln-couchdb-connector": {},
    "data-ln-couchdb-url": { effect: d },
    "data-ln-couchdb-db": { effect: d },
    "data-ln-couchdb-auth": { effect: d },
    "data-ln-couchdb-headers": { effect: d }
  };
  function g(E) {
    const _ = E && E.content !== void 0 ? E.content : E, A = E && E.message ? E.message : null;
    return { content: _, message: A };
  }
  function n(E) {
    return this.dom = E, E[e] = this, E[c] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  n.prototype.refreshConfig = function() {
    const E = this.dom;
    this.url = E.getAttribute("data-ln-couchdb-url") || "", this.db = E.getAttribute("data-ln-couchdb-db") || "", this.auth = E.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const _ = E.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ln(_, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), _.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), T(E, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function l(E, _, A) {
    const a = Object.assign({}, It(E.headers, E.auth), A || {});
    return _ && (a["Idempotency-Key"] = _), a;
  }
  n.prototype.fetchDelta = function(E) {
    const _ = this, A = ["include_docs=true", "feed=normal"];
    E && A.push("since=" + encodeURIComponent(E));
    const a = gt(_.url, _.db, "_changes") + "?" + A.join("&");
    return window.fetch(a, { method: "GET", headers: It(_.headers, _.auth), credentials: _.credentials }).then((p) => {
      if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
      return p.json();
    }).then((p) => {
      const s = p.results || [];
      return {
        data: s.filter((i) => !i.deleted && i.doc).map((i) => Object.assign({}, i.doc, { id: i.doc._id })),
        deleted: s.filter((i) => i.deleted).map((i) => i.id),
        synced_at: p.last_seq || E || ""
      };
    });
  };
  function o(E, _, A) {
    const a = Object.assign({ _id: _.id }, _);
    return a._id || delete a._id, window.fetch(gt(E.url, E.db), {
      method: "POST",
      headers: l(E, A),
      credentials: E.credentials,
      body: JSON.stringify(a)
    }).then((p) => {
      if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
      return p.json();
    }).then((p) => {
      const s = g(p), i = s.content;
      return { record: Object.assign({}, a, { id: i.id, _id: i.id, _rev: i.rev }), message: s.message };
    });
  }
  n.prototype.create = function(E, _) {
    return o(this, E, _).then((A) => A.record);
  };
  function f(E, _, A, a) {
    const p = Object.assign({ id: String(_), _id: String(_) }, A), s = p._rev || p.rev;
    return (s ? Promise.resolve(s) : window.fetch(gt(E.url, E.db, null, _), { method: "GET", headers: It(E.headers, E.auth), credentials: E.credentials }).then((h) => {
      if (!h.ok) throw new Error("Could not retrieve document for revision mapping");
      return h.json().then((v) => v._rev);
    })).then((h) => {
      const v = Object.assign({}, p, { _rev: h });
      delete v.rev;
      const r = l(E, a, { "If-Match": h });
      return window.fetch(gt(E.url, E.db, null, _), {
        method: "PUT",
        headers: r,
        credentials: E.credentials,
        body: JSON.stringify(v)
      }).then((b) => {
        if (b.ok) return b.json().then((S) => {
          const L = g(S);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (b.status === 409) return b.json().then((S) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = S, L;
        });
        throw new Error("HTTP " + b.status + ": " + b.statusText);
      });
    });
  }
  n.prototype.update = function(E, _, A) {
    return f(this, E, _, A).then((a) => a.record);
  };
  function u(E, _, A, a) {
    return (A ? Promise.resolve(A) : window.fetch(gt(E.url, E.db, null, _), { method: "GET", headers: It(E.headers, E.auth), credentials: E.credentials }).then((s) => {
      if (!s.ok) throw new Error("Could not retrieve document for revision delete");
      return s.json().then((i) => i._rev);
    })).then((s) => {
      const i = gt(E.url, E.db, null, _) + "?rev=" + encodeURIComponent(s);
      return window.fetch(i, { method: "DELETE", headers: l(E, a), credentials: E.credentials }).then((h) => {
        if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
        return h.json();
      }).then((h) => {
        const v = g(h);
        return { response: v.content, message: v.message };
      });
    });
  }
  n.prototype.delete = function(E, _, A) {
    return u(this, E, _, A).then((a) => a.response);
  };
  function y(E, _, A) {
    return !_ || _.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(gt(E.url, E.db, "_all_docs"), {
      method: "POST",
      headers: It(E.headers, E.auth),
      credentials: E.credentials,
      body: JSON.stringify({ keys: _ })
    }).then((a) => {
      if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
      return a.json();
    }).then((a) => {
      const s = (a.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return s.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(gt(E.url, E.db, "_bulk_docs"), {
        method: "POST",
        headers: l(E, A),
        credentials: E.credentials,
        body: JSON.stringify({ docs: s })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => {
        const h = g(i);
        return { response: { ok: !0, results: h.content, deletedCount: s.length }, message: h.message };
      });
    });
  }
  n.prototype.bulkDelete = function(E, _) {
    return y(this, E, _).then((A) => A.response);
  };
  function w(E) {
    E._handlers = {
      sync: function(A) {
        const a = A.detail || {};
        E.fetchDelta(a.since).then(function(p) {
          T(E.dom, "ln-couchdb-connector:fetched", { data: p, since: a.since, meta: a.meta || null });
        }).catch(function(p) {
          T(E.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            since: a.since,
            meta: a.meta || null
          });
        });
      },
      create: function(A) {
        const a = A.detail || {};
        o(E, a.data, a.idempotencyKey).then(function(p) {
          T(E.dom, "ln-couchdb-connector:created", { record: p.record, tempId: a.tempId, message: p.message, meta: a.meta || null });
        }).catch(function(p) {
          T(E.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: p.message,
            status: p.status || 0,
            tempId: a.tempId,
            meta: a.meta || null
          });
        });
      },
      update: function(A) {
        const a = A.detail || {}, p = Object.assign({}, a.data);
        a.expected_version !== void 0 && (p._rev = a.expected_version), f(E, a.id, p, a.idempotencyKey).then(function(s) {
          T(E.dom, "ln-couchdb-connector:updated", { record: s.record, id: a.id, message: s.message, meta: a.meta || null });
        }).catch(function(s) {
          T(E.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: s.message,
            status: s.status || 0,
            id: a.id,
            data: s.status === 409 ? s.data : null,
            conflictData: s.status === 409 ? s.data : null,
            meta: a.meta || null
          });
        });
      },
      delete: function(A) {
        const a = A.detail || {};
        u(E, a.id, a.rev, a.idempotencyKey).then(function(p) {
          T(E.dom, "ln-couchdb-connector:deleted", { response: p.response, id: a.id, message: p.message, meta: a.meta || null });
        }).catch(function(p) {
          T(E.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: p.message,
            status: p.status || 0,
            id: a.id,
            meta: a.meta || null
          });
        });
      },
      bulkDelete: function(A) {
        const a = A.detail || {};
        y(E, a.ids, a.idempotencyKey).then(function(p) {
          T(E.dom, "ln-couchdb-connector:bulk-deleted", { response: p.response, ids: a.ids, message: p.message, meta: a.meta || null });
        }).catch(function(p) {
          T(E.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: p.message,
            status: p.status || 0,
            ids: a.ids,
            meta: a.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      E.dom.addEventListener(A + ":request-sync", E._handlers.sync), E.dom.addEventListener(A + ":request-fetch", E._handlers.sync), E.dom.addEventListener(A + ":request-create", E._handlers.create), E.dom.addEventListener(A + ":request-update", E._handlers.update), E.dom.addEventListener(A + ":request-delete", E._handlers.delete), E.dom.addEventListener(A + ":request-bulk-delete", E._handlers.bulkDelete);
    });
  }
  n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const E = this;
    E._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(A) {
      E.dom.removeEventListener(A + ":request-sync", E._handlers.sync), E.dom.removeEventListener(A + ":request-fetch", E._handlers.sync), E.dom.removeEventListener(A + ":request-create", E._handlers.create), E.dom.removeEventListener(A + ":request-update", E._handlers.update), E.dom.removeEventListener(A + ":request-delete", E._handlers.delete), E.dom.removeEventListener(A + ":request-bulk-delete", E._handlers.bulkDelete);
    }), E._handlers = null), T(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[c];
  }, U(t, e, n, "ln-couchdb-connector", {
    attributes: m
  });
})();
function cr(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Rt(t, e) {
  const c = !t || !!t.initializationError, d = !!(t && t.noLocalQuery && !t.windowed);
  return e && (c || !t.canServe || d) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Kt(t, e, c) {
  return c === "store" && !!e && !(t && t.windowed);
}
function Ve(t, e) {
  const c = Object.assign({}, t);
  return e && (c.filters = e.filters, c.search = e.search, c.sort = e.sort), c;
}
class dr {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((c, d) => {
      this._pending.set(e, { resolve: c, reject: d });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const c = e || new Error("Mutation receipt registry closed");
    for (const d of this._pending.values()) d.reject(c);
    this._pending.clear();
  }
  _settle(e, c) {
    const d = e && e.requestId;
    if (!d) return !1;
    const m = this._pending.get(d);
    return m ? (this._pending.delete(d), c ? m.reject(e.error || new Error("Store mutation failed")) : m.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", c = "data-ln-data-coordinator-scope", d = "data-ln-data-coordinator-search", m = "data-ln-data-coordinator-filters", g = "data-ln-data-coordinator-sort-field", n = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function l(r) {
    const b = r[e];
    b && b.refreshMapper();
  }
  function o(r) {
    const b = r[e];
    b && b._queueQueryRefresh();
  }
  const f = {
    "data-ln-data-coordinator": {},
    "data-ln-data-coordinator-scope": {},
    "data-ln-data-coordinator-mapper": { effect: l },
    "data-ln-data-coordinator-search": { effect: o },
    "data-ln-data-coordinator-filters": { effect: o },
    "data-ln-data-coordinator-sort-field": { effect: o },
    "data-ln-data-coordinator-sort-direction": { effect: o },
    "data-ln-data-coordinator-stale": {},
    "data-ln-data-coordinator-no-autosync": {}
  }, u = /* @__PURE__ */ new Set();
  let y = !1, w = null, E = null, _ = null;
  function A() {
    y || (y = !0, w = function() {
      T(document, "ln-data-coordinator:online", {}), u.forEach(function(r) {
        r._maybeSync();
      });
    }, E = function() {
      T(document, "ln-data-coordinator:offline", {});
    }, _ = function() {
      document.visibilityState === "visible" && u.forEach(function(r) {
        const b = r.findChildren(), S = b.store;
        S && b.connector && S.isInitialized && !S.initializationError && !S.isSyncing && !r._noAutosync && (!S.hasCache || r._isStale()) && S.forceSync();
      });
    }, window.addEventListener("online", w), window.addEventListener("offline", E), document.addEventListener("visibilitychange", _));
  }
  function a() {
    y && (u.size > 0 || (window.removeEventListener("online", w), window.removeEventListener("offline", E), document.removeEventListener("visibilitychange", _), w = null, E = null, _ = null, y = !1));
  }
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (b) => {
        const S = Math.random() * 16 | 0;
        return (b === "x" ? S : S & 3 | 8).toString(16);
      });
    }
  }
  const s = ["ln-api-connector", "ln-couchdb-connector"];
  function i(r) {
    return r ? r.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : r.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function h(r) {
    const b = this;
    return this.dom = r, this._name = r.getAttribute("data-ln-data-coordinator") || r.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", r), r[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new dr(), this._dict = Yt(r, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = Zt(function() {
      b._destroyed || b._refreshAll(null, !0);
    }), this.refreshConfig(), v(this), u.add(this), A(), this._checkInitialSync(), this;
  }
  Object.defineProperty(h.prototype, "_staleThreshold", {
    get: function() {
      const b = this.findChildren().storeEl, S = this.dom.getAttribute("data-ln-data-coordinator-stale") || (b ? b.getAttribute("data-ln-data-store-stale") : null);
      if (S === "never" || S === "-1") return -1;
      const L = parseInt(S, 10);
      return isNaN(L) ? 300 : L;
    }
  }), Object.defineProperty(h.prototype, "_noAutosync", {
    get: function() {
      const b = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (b ? b.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), h.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, h.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const b = this.findChildren().store;
    return !b || !b.lastSyncedAt ? !0 : Date.now() / 1e3 - b.lastSyncedAt > this._staleThreshold;
  }, h.prototype._maybeSync = function() {
    const r = this.findChildren(), b = r.store;
    !b || b.initializationError || !r.connector || this._noAutosync || !b.isInitialized || b.isSyncing || (!b.hasCache || this._isStale()) && b.forceSync();
  }, h.prototype._checkInitialSync = function() {
    const r = this, S = this.findChildren().store;
    S && Promise.resolve(S.ready).then(function() {
      if (r._destroyed) return;
      const L = r.findChildren(), q = L.store;
      if (q && q.initializationError) {
        r._reportReconciliationError("store-initialize", q.initializationError, null);
        return;
      }
      !q || !L.connector || r._noAutosync || q.isSyncing || (!q.hasCache || r._isStale()) && q.forceSync();
    }).catch(function(L) {
      r._destroyed || r._reportReconciliationError("store-initialize", L, null);
    });
  }, h.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const b = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    b && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(b)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(S) {
      return S;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(S) {
      return S;
    });
  }, h.prototype.findChildren = function() {
    const r = this.dom.querySelector("[data-ln-data-store]"), b = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), S = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: r,
      connectorEl: b,
      queueEl: S,
      store: r ? r.lnDataStore : null,
      connector: b ? b.lnApiConnector || b.lnCouchDbConnector : null,
      queue: S ? S.lnApiQueue : null
    };
  }, h.prototype._handleSubmitRecord = function(r) {
    const b = this.findChildren();
    if (!b.storeEl && !b.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const S = r.data || {}, L = S.id, q = S.expected_version, k = Object.assign({}, S);
    delete k.id, delete k.expected_version;
    const D = r.method.toUpperCase();
    D === "POST" ? this._fanOutCreate(b, k, r.action) : (D === "PUT" || D === "PATCH") && this._fanOutUpdate(b, L, k, q, r.action);
  }, h.prototype._fanOutCreate = function(r, b, S) {
    this.refreshMapper();
    const L = "_temp_" + p();
    r.storeEl && T(r.storeEl, "ln-data-store:request-create", { tempId: L, data: b }), r.queue ? T(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: L,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(b),
      expectedVersion: null,
      meta: { tempId: L, action: S }
    }) : r.connector && T(r.connectorEl, i(r.connectorEl) + ":request-create", {
      data: this.mapper.egress(b),
      url: S,
      meta: { entryId: p(), queued: !1, op: "create", tempId: L }
    });
  }, h.prototype._fanOutUpdate = function(r, b, S, L, q) {
    this.refreshMapper(), r.storeEl && T(r.storeEl, "ln-data-store:request-update", { id: b, data: S }), r.queue ? T(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: b,
      op: "update",
      targetId: b,
      payload: this.mapper.egress(S),
      expectedVersion: L,
      meta: { id: b, action: q }
    }) : r.connector && T(r.connectorEl, i(r.connectorEl) + ":request-update", {
      id: b,
      data: this.mapper.egress(S),
      expected_version: L,
      url: q,
      meta: { entryId: p(), queued: !1, op: "update", id: b }
    });
  }, h.prototype._fanOutDelete = function(r, b) {
    this.refreshMapper(), r.storeEl && T(r.storeEl, "ln-data-store:request-delete", { id: b }), r.queue ? T(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: b,
      op: "delete",
      targetId: b,
      payload: null,
      expectedVersion: null,
      meta: { id: b }
    }) : r.connector && T(r.connectorEl, i(r.connectorEl) + ":request-delete", {
      id: b,
      meta: { entryId: p(), queued: !1, op: "delete", id: b }
    });
  }, h.prototype._fanOutBulkDelete = function(r, b) {
    this.refreshMapper();
    const S = b.join(",");
    r.storeEl && T(r.storeEl, "ln-data-store:request-bulk-delete", { ids: b }), r.queue ? T(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: S,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: b },
      expectedVersion: null,
      meta: { bulkKey: S, ids: b }
    }) : r.connector && T(r.connectorEl, i(r.connectorEl) + ":request-bulk-delete", {
      ids: b,
      meta: { entryId: p(), queued: !1, op: "bulk-delete", bulkKey: S }
    });
  }, h.prototype._toastFromMessage = function(r) {
    r && T(window, "ln-toast:enqueue", {
      type: r.type || "success",
      title: r.title || "",
      message: r.body || ""
    });
  }, h.prototype._toastFromDict = function(r) {
    const b = this._dict[r];
    b && T(window, "ln-toast:enqueue", { type: "error", title: "", message: b });
  }, h.prototype._requestStoreMutation = function(r, b, S) {
    const L = r.storeEl;
    if (!L) return Promise.reject(new Error("Store element not found"));
    const q = p(), k = this._mutationReceipts.wait(q);
    return T(L, "ln-data-store:request-" + b, Object.assign({}, S, { requestId: q })), k;
  }, h.prototype._reportReconciliationError = function(r, b, S) {
    this._destroyed || T(this.dom, "ln-data-coordinator:error", {
      operation: r,
      error: b,
      meta: S || null
    });
  };
  function v(r) {
    r._handlers = {
      sync: function(b) {
        r.refreshMapper();
        const S = r.findChildren();
        if (!S.store || !S.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        T(S.connectorEl, i(S.connectorEl) + ":request-sync", { since: b.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(b) {
        const S = r.findChildren();
        if (!S.connectorEl) return;
        const L = b.detail || {};
        T(S.connectorEl, i(S.connectorEl) + ":request-query", {
          query: Object.assign({}, L.query, {
            offset: L.offset,
            limit: L.limit,
            queryGen: L.queryGen
          })
        });
      },
      reqCreate: function(b) {
        const S = r.findChildren();
        r._fanOutCreate(S, b.detail.data || {}, b.detail.action);
      },
      reqUpdate: function(b) {
        const S = r.findChildren();
        r._fanOutUpdate(S, b.detail.id, b.detail.data || {}, b.detail.expected_version, b.detail.action);
      },
      reqDelete: function(b) {
        const S = r.findChildren();
        r._fanOutDelete(S, b.detail.id);
      },
      reqBulkDelete: function(b) {
        const S = r.findChildren();
        r._fanOutBulkDelete(S, b.detail.ids || []);
      },
      queueFailed: function() {
        r._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(b) {
        r.refreshMapper();
        const S = r.findChildren();
        if (!S.store || !S.connector || !S.queue) return;
        const L = b.detail || {}, q = L.entryId, k = L.op, D = L.targetId, I = L.payload, O = L.expectedVersion, N = L.meta || {}, P = N.action || null, H = L.idempotencyKey || q;
        k === "create" ? T(S.connectorEl, i(S.connectorEl) + ":request-create", {
          data: I,
          url: P,
          idempotencyKey: H,
          meta: { entryId: q, queued: !0, op: "create", tempId: N.tempId }
        }) : k === "update" ? T(S.connectorEl, i(S.connectorEl) + ":request-update", {
          id: D,
          data: I,
          expected_version: O,
          url: P,
          idempotencyKey: H,
          meta: { entryId: q, queued: !0, op: "update", id: D }
        }) : k === "delete" ? T(S.connectorEl, i(S.connectorEl) + ":request-delete", {
          id: D,
          idempotencyKey: H,
          meta: { entryId: q, queued: !0, op: "delete", id: D }
        }) : k === "bulk-delete" ? T(S.connectorEl, i(S.connectorEl) + ":request-bulk-delete", {
          ids: I && I.ids ? I.ids : [],
          idempotencyKey: H,
          meta: { entryId: q, queued: !0, op: "bulk-delete", bulkKey: N.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", k);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(b) {
        const S = b.target;
        if (b.defaultPrevented) return;
        const L = S.hasAttribute(c) ? S.getAttribute(c) : null;
        if (L === null) return;
        let q;
        if (L ? q = r._owns(L) : q = S.closest("[data-ln-data-coordinator]") === r.dom, !q) return;
        const k = si(S);
        if (k !== "POST" && k !== "PUT" && k !== "PATCH") return;
        b.preventDefault();
        const D = Ze(S);
        delete D._method, delete D._token, r._handleSubmitRecord({ data: D, method: k, action: S.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(b) {
        const S = b.detail.meta || {}, L = r.findChildren();
        r.refreshMapper();
        const q = b.detail.data;
        let k = [], D = [], I = null;
        Array.isArray(q) ? (k = q, I = Math.floor(Date.now() / 1e3)) : q && (k = Array.isArray(q.data) ? q.data : [], D = Array.isArray(q.deleted) ? q.deleted : [], I = q.synced_at !== void 0 ? q.synced_at : q.since !== void 0 ? q.since : null);
        const O = k.map((N) => r.mapper.ingress(N));
        if (L.store && !L.store.initializationError)
          S.kind ? S.kind === "table" || S.kind === "list" || S.kind === "chart" ? L.store.applyQuery(O, { total: b.detail.total }).then(function(N) {
            S.queryGen != null && !r._isCurrentGen(S.targetEl, S.queryGen) || (T(S.targetEl, "ln-" + S.kind + ":set-loading", { loading: !1 }), T(S.targetEl, "ln-" + S.kind + ":set-data", {
              data: N,
              total: b.detail.total !== void 0 ? b.detail.total : N.length,
              filtered: b.detail.filtered !== void 0 ? b.detail.filtered : N.length,
              offset: b.detail.offset,
              queryGen: b.detail.queryGen
            }), r._boundDelivered.set(S.targetEl, !0));
          }) : S.kind === "options" ? L.store.applyQuery(O, { total: b.detail.total }).then(function() {
            return L.store.getAll({});
          }).then(function(N) {
            S.queryGen != null && !r._isCurrentGen(S.targetEl, S.queryGen) || T(S.targetEl, "ln-options:set-data", { data: N.data });
          }) : S.kind === "stat" && L.store.applyQuery(O, { total: b.detail.total }).then(function() {
            if (S.queryGen != null && !r._isCurrentGen(S.targetEl, S.queryGen)) return;
            const N = b.detail.filtered !== void 0 ? b.detail.filtered : b.detail.total !== void 0 ? b.detail.total : O.length;
            T(S.targetEl, "ln-stat:set-count", { count: N });
          }) : L.store.applySync(O, D, I || Math.floor(Date.now() / 1e3), {
            total: b.detail.total,
            filtered: b.detail.filtered,
            offset: b.detail.offset,
            queryGen: b.detail.queryGen,
            targetEl: S.targetEl
          });
        else if (S.targetEl && S.kind) {
          if (S.kind === "table" || S.kind === "list" || S.kind === "chart")
            T(S.targetEl, "ln-" + S.kind + ":set-loading", { loading: !1 }), T(S.targetEl, "ln-" + S.kind + ":set-data", {
              data: O,
              total: b.detail.total !== void 0 ? b.detail.total : O.length,
              filtered: b.detail.filtered !== void 0 ? b.detail.filtered : O.length,
              offset: b.detail.offset,
              queryGen: b.detail.queryGen
            }), r._boundDelivered.set(S.targetEl, !0);
          else if (S.kind === "options")
            T(S.targetEl, "ln-options:set-data", { data: O });
          else if (S.kind === "stat") {
            const N = b.detail.filtered !== void 0 ? b.detail.filtered : b.detail.total !== void 0 ? b.detail.total : O.length;
            T(S.targetEl, "ln-stat:set-count", { count: N });
          }
        }
      },
      connCreated: function(b) {
        const S = r.findChildren(), L = b.detail.meta || {}, q = r.mapper.ingress(b.detail.record);
        (S.storeEl ? r._requestStoreMutation(S, "update", { id: L.tempId, data: q }) : Promise.resolve()).then(function() {
          r._toastFromMessage(b.detail.message), L.queued && S.queue && T(S.queueEl, "ln-api-queue:resolve-create", {
            entryId: L.entryId,
            oldKey: L.tempId,
            newId: q.id
          });
        }).catch(function(D) {
          r._reportReconciliationError("create-reconcile", D, L);
        });
      },
      connUpdated: function(b) {
        const S = r.findChildren(), L = b.detail.meta || {}, q = r.mapper.ingress(b.detail.record);
        (S.storeEl ? r._requestStoreMutation(S, "update", { id: L.id, data: q }) : Promise.resolve()).then(function() {
          r._toastFromMessage(b.detail.message), L.queued && S.queue && T(S.queueEl, "ln-api-queue:ack", { entryId: L.entryId });
        }).catch(function(D) {
          r._reportReconciliationError("update-reconcile", D, L);
        });
      },
      connDeleted: function(b) {
        const S = r.findChildren(), L = b.detail.meta || {};
        r._toastFromMessage(b.detail.message), L.queued && S.queue && T(S.queueEl, "ln-api-queue:ack", { entryId: L.entryId });
      },
      connBulkDeleted: function(b) {
        const S = r.findChildren(), L = b.detail.meta || {};
        r._toastFromMessage(b.detail.message), L.queued && S.queue && T(S.queueEl, "ln-api-queue:ack", { entryId: L.entryId });
      },
      connError: function(b) {
        const S = b.detail || {}, L = S.meta || {}, q = L.op || S.action, k = S.status || S.error && S.error.status || 0, D = r.findChildren();
        if (q === "sync") {
          D.storeEl && T(D.storeEl, "ln-data-store:request-sync-failed", {
            error: S.error,
            status: k
          }), console.error("[ln-data-coordinator] Sync failed:", S.error);
          return;
        }
        if (q === "query") {
          L.targetEl && L.kind && (T(L.targetEl, "ln-" + L.kind + ":set-loading", { loading: !1 }), (L.kind === "table" || L.kind === "list") && T(L.targetEl, "ln-" + L.kind + ":page-failed", { offset: L.offset })), r._reportReconciliationError("query", S.error || S, L);
          return;
        }
        const I = k === 401 || k === 419, O = k === 0 || k >= 500, N = k === 409 || k === 412;
        if (I) {
          r._toastFromDict("auth"), L.queued && D.queue && T(D.queueEl, "ln-api-queue:nack", { entryId: L.entryId, reason: "auth" });
          return;
        }
        if (O) {
          L.queued && D.queue ? T(D.queueEl, "ln-api-queue:nack", { entryId: L.entryId, reason: "retry" }) : r._toastFromDict("network");
          return;
        }
        let P = Promise.resolve();
        if (N && q === "update") {
          const H = S.data && S.data.remote ? r.mapper.ingress(S.data.remote) : null;
          H && D.storeEl && (P = r._requestStoreMutation(D, "update", { id: L.id, data: H })), r._toastFromDict("conflict");
        } else q === "create" && D.storeEl && (P = r._requestStoreMutation(D, "delete", { id: L.tempId })), r._toastFromDict("rejected");
        L.queued && D.queue ? P.then(function() {
          T(D.queueEl, "ln-api-queue:nack", { entryId: L.entryId, reason: "drop" });
        }).catch(function(H) {
          r._reportReconciliationError("deterministic-reconcile", H, L);
        }) : P.catch(function(H) {
          r._reportReconciliationError("deterministic-reconcile", H, L);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(b) {
        const S = r.findChildren(), L = S.store;
        if (!L || L.initializationError || !S.connector || r._noAutosync || L.isSyncing) return;
        (b.detail || {}).hasCache ? r._isStale() && L.forceSync() : L.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(b) {
        r._serveData(b, "table");
      },
      reqListData: function(b) {
        r._serveData(b, "list");
      },
      reqChartData: function(b) {
        r._serveData(b, "chart");
      },
      reqOptions: function(b) {
        r._serveOptions(b);
      },
      reqStat: function(b) {
        r._serveStat(b);
      },
      refreshQuery: function() {
        r._refreshAll(null, !0);
      },
      refresh: function(b) {
        r._mutationReceipts.resolve(b.detail), r._refreshAll(null, !1);
      },
      mutationError: function(b) {
        r._mutationReceipts.reject(b.detail);
      },
      refreshSynced: function(b) {
        b.detail && b.detail.changed && r._refreshAll(b.detail.meta, !1);
      },
      searchChange: function(b) {
        b.preventDefault();
        const S = b.detail && b.detail.term != null ? b.detail.term : "";
        S !== (r.dom.getAttribute(d) || "") && r.dom.setAttribute(d, S);
      },
      filterChange: function(b) {
        b.preventDefault();
        const S = b.detail && b.detail.key;
        if (!S) return;
        const L = (b.detail.values || []).slice(), q = r._currentQuery().filters, k = q[S];
        if (k ? k.length === L.length && k.every((N, P) => N === L[P]) : !L.length) return;
        L.length ? q[S] = L : delete q[S];
        const I = new URLSearchParams();
        Object.keys(q).forEach(function(N) {
          q[N].forEach(function(P) {
            I.append(N, P);
          });
        });
        const O = I.toString();
        O ? r.dom.setAttribute(m, O) : r.dom.removeAttribute(m);
      },
      sortChange: function(b) {
        b.preventDefault();
        const S = b.detail && b.detail.field, L = b.detail && b.detail.direction, q = S && L && L !== "none" ? { field: S, direction: L } : null, k = r._currentQuery().sort;
        !k && !q || k && q && k.field === q.field && k.direction === q.direction || (q ? (r.dom.setAttribute(g, q.field), r.dom.setAttribute(n, q.direction)) : (r.dom.removeAttribute(g), r.dom.removeAttribute(n)));
      }
    }, r.dom.addEventListener("ln-data-store:request-remote-sync", r._handlers.sync), r.dom.addEventListener("ln-data-store:request-page", r._handlers.requestPage), r.dom.addEventListener("ln-data-coordinator:request-create", r._handlers.reqCreate), r.dom.addEventListener("ln-data-coordinator:request-update", r._handlers.reqUpdate), r.dom.addEventListener("ln-data-coordinator:request-delete", r._handlers.reqDelete), r.dom.addEventListener("ln-data-coordinator:request-bulk-delete", r._handlers.reqBulkDelete), r.dom.addEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.addEventListener("ln-api-queue:failed", r._handlers.queueFailed), r.dom.addEventListener("ln-data-store:initialized", r._handlers.storeInitialized), document.addEventListener("submit", r._handlers.formSubmit), s.forEach(function(b) {
      r.dom.addEventListener(b + ":fetched", r._handlers.connFetched), r.dom.addEventListener(b + ":created", r._handlers.connCreated), r.dom.addEventListener(b + ":updated", r._handlers.connUpdated), r.dom.addEventListener(b + ":deleted", r._handlers.connDeleted), r.dom.addEventListener(b + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.addEventListener(b + ":error", r._handlers.connError);
    }), document.addEventListener("ln-table:request-data", r._handlers.reqTableData), document.addEventListener("ln-list:request-data", r._handlers.reqListData), document.addEventListener("ln-chart:request-data", r._handlers.reqChartData), document.addEventListener("ln-options:request-data", r._handlers.reqOptions), document.addEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.addEventListener("ln-data-store:ready", r._handlers.refresh), r.dom.addEventListener("ln-data-store:created", r._handlers.refresh), r.dom.addEventListener("ln-data-store:updated", r._handlers.refresh), r.dom.addEventListener("ln-data-store:deleted", r._handlers.refresh), r.dom.addEventListener("ln-data-store:mutation-error", r._handlers.mutationError), r.dom.addEventListener("ln-data-store:synced", r._handlers.refreshSynced), r.dom.addEventListener("ln-data-store:query-changed", r._handlers.refreshQuery), r.dom.addEventListener("ln-search:change", r._handlers.searchChange), r.dom.addEventListener("ln-filter:change", r._handlers.filterChange), r.dom.addEventListener("ln-sort:change", r._handlers.sortChange);
  }
  h.prototype._owns = function(r) {
    return !!r && r === this._name;
  }, h.prototype._currentQuery = function() {
    const r = this.dom.getAttribute(g), b = this.dom.getAttribute(n), S = new URLSearchParams(this.dom.getAttribute(m) || ""), L = {};
    for (const q of new Set(S.keys())) L[q] = S.getAll(q);
    return {
      search: this.dom.getAttribute(d) || "",
      filters: L,
      sort: r && b ? { field: r, direction: b } : null
    };
  }, h.prototype._nextQueryGen = function(r) {
    const b = (this._queryGens.get(r) || 0) + 1;
    return this._queryGens.set(r, b), b;
  }, h.prototype._isCurrentGen = function(r, b) {
    return this._queryGens.get(r) === b;
  }, h.prototype._serveData = function(r, b) {
    const S = r.target, L = b === "table" ? "data-ln-table-source" : b === "list" ? "data-ln-list-source" : "data-ln-chart-source", q = S.getAttribute(L);
    if (!q || !this._owns(q)) return;
    const k = r.detail || {}, D = cr(k);
    this._boundQueries.set(S, D);
    const I = this.findChildren(), O = this, N = I.store;
    return (N && N.ready ? N.ready : Promise.resolve()).then(function() {
      if (O._destroyed) return;
      const H = Rt(N, I.connector), K = Ve(D, O._currentQuery());
      if (H === "remote") {
        T(S, "ln-" + b + ":set-loading", { loading: !0 }), T(I.connectorEl, i(I.connectorEl) + ":request-query", {
          query: K,
          meta: { targetEl: S, kind: b, offset: K.offset, limit: K.limit }
        });
        return;
      }
      if (H !== "store") {
        T(S, "ln-" + b + ":set-loading", { loading: !1 });
        return;
      }
      const W = Kt(N, I.connector, H), Q = W ? O._nextQueryGen(S) : null;
      return W && T(I.connectorEl, i(I.connectorEl) + ":request-query", {
        query: K,
        meta: { targetEl: S, kind: b, offset: K.offset, limit: K.limit, queryGen: Q }
      }), N.getAll(K).then(function(G) {
        if (O._destroyed || !O._boundDelivered || W && !O._isCurrentGen(S, Q)) return;
        const j = {
          data: G.data,
          total: G.total,
          filtered: G.filtered,
          offset: k.offset !== void 0 ? k.offset : G.offset,
          queryGen: k.queryGen !== void 0 ? k.queryGen : G.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: W || G.provisional === !0
        };
        T(S, "ln-" + b + ":set-data", j), O._boundDelivered.set(S, !0);
      });
    }).catch(function(H) {
      O._destroyed || (T(S, "ln-" + b + ":set-loading", { loading: !1 }), T(O.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: b,
        store: q,
        target: S,
        error: H
      }));
    });
  }, h.prototype._serveOptions = function(r) {
    const b = r.target, S = b.getAttribute("data-ln-options");
    if (!this._owns(S)) return;
    const L = this.findChildren(), q = L.store, k = q && q.ready ? q.ready : Promise.resolve(), D = this;
    return k.then(function() {
      if (D._destroyed) return;
      const I = Rt(q, L.connector);
      if (I === "remote") {
        T(L.connectorEl, i(L.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: b, kind: "options" }
        });
        return;
      }
      if (I !== "store") return;
      const O = Kt(q, L.connector, I), N = O ? D._nextQueryGen(b) : null;
      return O && T(L.connectorEl, i(L.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: b, kind: "options", queryGen: N }
      }), q.getAll({}).then(function(P) {
        D._destroyed || O && !D._isCurrentGen(b, N) || T(b, "ln-options:set-data", { data: P.data });
      });
    }).catch(function(I) {
      D._destroyed || D._reportReconciliationError("options-query", I, { targetEl: b, kind: "options" });
    });
  }, h.prototype._serveStat = function(r) {
    const b = r.target, S = b.getAttribute("data-ln-stat");
    if (!this._owns(S)) return;
    const L = r.detail && r.detail.filters ? r.detail.filters : null, q = this.findChildren(), k = q.store, D = k && k.ready ? k.ready : Promise.resolve(), I = this;
    return D.then(function() {
      if (I._destroyed) return;
      const O = L && Object.keys(L).length > 0, N = !!(q.connector && k && (k.windowed && O || k.noLocalQuery)), P = N ? "remote" : Rt(k, q.connector);
      if (P === "remote") {
        T(q.connectorEl, i(q.connectorEl) + ":request-query", {
          query: { filters: L },
          meta: { targetEl: b, kind: "stat" }
        });
        return;
      }
      if (P !== "store") return;
      const H = !N && Kt(k, q.connector, P), K = H ? I._nextQueryGen(b) : null;
      return H && T(q.connectorEl, i(q.connectorEl) + ":request-query", {
        query: { filters: L },
        meta: { targetEl: b, kind: "stat", queryGen: K }
      }), k.count(L).then(function(W) {
        I._destroyed || H && !I._isCurrentGen(b, K) || T(b, "ln-stat:set-count", { count: W });
      });
    }).catch(function(O) {
      I._destroyed || I._reportReconciliationError("stat-query", O, { targetEl: b, kind: "stat" });
    });
  }, h.prototype._refreshAll = function(r, b) {
    const S = this, L = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let q = 0; q < L.length; q++) {
      const k = L[q];
      let D, I;
      if (k.hasAttribute("data-ln-table-source") ? (D = k.getAttribute("data-ln-table-source"), I = "table") : k.hasAttribute("data-ln-list-source") ? (D = k.getAttribute("data-ln-list-source"), I = "list") : k.hasAttribute("data-ln-chart-source") ? (D = k.getAttribute("data-ln-chart-source"), I = "chart") : k.hasAttribute("data-ln-options") ? (D = k.getAttribute("data-ln-options"), I = "options") : k.hasAttribute("data-ln-stat") && (D = k.getAttribute("data-ln-stat"), I = "stat"), !S._owns(D)) continue;
      const O = S.findChildren(), N = O.store;
      if (I === "table" || I === "list") {
        const P = I === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (k.hasAttribute(P)) {
          T(k, "ln-" + I + (b ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (I === "table" || I === "list" || I === "chart") {
        const P = S._boundQueries.get(k) || { sort: null, filters: {}, search: "" }, H = Ve(P, S._currentQuery());
        if (Rt(N, O.connector) === "remote") {
          T(k, "ln-" + I + ":set-loading", { loading: !0 }), T(O.connectorEl, i(O.connectorEl) + ":request-query", {
            query: H,
            meta: { targetEl: k, kind: I, offset: H.offset, limit: H.limit }
          });
          continue;
        }
        const K = Kt(N, O.connector, Rt(N, O.connector)), W = K ? S._nextQueryGen(k) : null;
        K && T(O.connectorEl, i(O.connectorEl) + ":request-query", {
          query: H,
          meta: { targetEl: k, kind: I, offset: H.offset, limit: H.limit, queryGen: W }
        }), (function(Q, G, j, V) {
          N.getAll(H).then(function(et) {
            if (S._destroyed || !S._boundDelivered || j && !S._isCurrentGen(Q, V)) return;
            const St = {
              data: et.data,
              total: r && r.total !== void 0 ? r.total : et.total,
              filtered: r && r.filtered !== void 0 ? r.filtered : et.filtered,
              offset: et.offset !== void 0 ? et.offset : r && r.offset !== void 0 ? r.offset : P.offset,
              queryGen: et.queryGen !== void 0 ? et.queryGen : r && r.queryGen !== void 0 ? r.queryGen : P.queryGen
            };
            T(Q, "ln-" + G + ":set-loading", { loading: !1 }), T(Q, "ln-" + G + ":set-data", St), S._boundDelivered.set(Q, !0);
          }).catch(function() {
          });
        })(k, I, K, W);
      } else if (I === "options")
        (function(P) {
          N.getAll({}).then(function(H) {
            S._destroyed || T(P, "ln-options:set-data", { data: H.data });
          }).catch(function() {
          });
        })(k);
      else if (I === "stat") {
        const P = k.getAttribute("data-ln-stat-filter");
        let H = null;
        if (P) {
          const K = P.indexOf(":");
          if (K !== -1) {
            const W = P.slice(0, K).trim(), Q = P.slice(K + 1).trim();
            W && (H = {}, H[W] = [Q]);
          }
        }
        (function(K, W) {
          N.count(W).then(function(Q) {
            S._destroyed || T(K, "ln-stat:set-count", { count: Q });
          }).catch(function() {
          });
        })(k, H);
      }
    }
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const r = this;
    r._handlers && (r.dom.removeEventListener("ln-data-store:request-remote-sync", r._handlers.sync), r.dom.removeEventListener("ln-data-store:request-page", r._handlers.requestPage), r.dom.removeEventListener("ln-data-coordinator:request-create", r._handlers.reqCreate), r.dom.removeEventListener("ln-data-coordinator:request-update", r._handlers.reqUpdate), r.dom.removeEventListener("ln-data-coordinator:request-delete", r._handlers.reqDelete), r.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", r._handlers.reqBulkDelete), r.dom.removeEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.removeEventListener("ln-api-queue:failed", r._handlers.queueFailed), r.dom.removeEventListener("ln-data-store:initialized", r._handlers.storeInitialized), document.removeEventListener("submit", r._handlers.formSubmit), s.forEach(function(b) {
      r.dom.removeEventListener(b + ":fetched", r._handlers.connFetched), r.dom.removeEventListener(b + ":created", r._handlers.connCreated), r.dom.removeEventListener(b + ":updated", r._handlers.connUpdated), r.dom.removeEventListener(b + ":deleted", r._handlers.connDeleted), r.dom.removeEventListener(b + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.removeEventListener(b + ":error", r._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", r._handlers.reqTableData), document.removeEventListener("ln-list:request-data", r._handlers.reqListData), document.removeEventListener("ln-chart:request-data", r._handlers.reqChartData), document.removeEventListener("ln-options:request-data", r._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.removeEventListener("ln-data-store:ready", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:created", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:updated", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:deleted", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:mutation-error", r._handlers.mutationError), r.dom.removeEventListener("ln-data-store:synced", r._handlers.refreshSynced), r.dom.removeEventListener("ln-data-store:query-changed", r._handlers.refreshQuery), r.dom.removeEventListener("ln-search:change", r._handlers.searchChange), r.dom.removeEventListener("ln-filter:change", r._handlers.filterChange), r.dom.removeEventListener("ln-sort:change", r._handlers.sortChange), r._handlers = null), r._boundQueries = null, r._boundDelivered = null, r._queryGens = null, r._queueQueryRefresh = null, r._mutationReceipts.close(new Error("Data coordinator destroyed")), r._mutationReceipts = null, u.delete(this), a(), delete this.dom[e];
  }, U(t, e, h, "ln-data-coordinator", {
    attributes: f
  });
})();
const ur = "ln_api_queue", hr = 2, tt = "outbox", ot = "_queue_meta";
function lt(t, e) {
  return t.error || new Error(e);
}
function Ct(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function We(t) {
  return "seq:" + t;
}
function jt(t) {
  return "paused:" + t;
}
function Ge(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function fr(t, e, c) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(c);
}
function pr(t, e, c, d) {
  const m = /* @__PURE__ */ new Map(), g = [], n = [];
  for (const l of t || [])
    m.has(l.chainKey) || m.set(l.chainKey, []), m.get(l.chainKey).push(l);
  return m.forEach((l, o) => {
    l.sort((u, y) => u.seq - y.seq);
    const f = l[0];
    if (!(!f || f.status === "failed")) {
      if (f.status === "inflight" && (f.leaseUntil || 0) > d) {
        n.push({ chainKey: o, at: f.leaseUntil });
        return;
      }
      if ((f.nextAttemptAt || 0) > d) {
        n.push({ chainKey: o, at: f.nextAttemptAt });
        return;
      }
      f.status = "inflight", f.leaseOwner = e, f.leaseUntil = d + c, f.updatedAt = d, g.push(f);
    }
  }), { entries: g, wakeups: n };
}
function mr(t, e, c, d, m) {
  const g = [], n = [];
  for (const l of t || []) {
    if (l.entryId === e) {
      n.push(l.entryId);
      continue;
    }
    l.chainKey === c && (l.chainKey = d, l.targetId === c && (l.targetId = d), l.meta && l.meta.id === c && (l.meta.id = d), l.meta && typeof l.meta.action == "string" && (l.meta.action = fr(l.meta.action, c, d)), l.updatedAt = m, g.push(l));
  }
  return { changed: g, deleted: n };
}
class gr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || ur, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, c) => {
      const d = this.indexedDB.open(this.dbName, hr);
      d.onupgradeneeded = (m) => {
        const g = m.target.result;
        let n;
        g.objectStoreNames.contains(tt) ? n = m.target.transaction.objectStore(tt) : n = g.createObjectStore(tt, { keyPath: "entryId" }), n.indexNames.contains("by_scope_chain") || n.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), n.indexNames.contains("by_scope_seq") || n.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), g.objectStoreNames.contains(ot) || g.createObjectStore(ot, { keyPath: "key" });
      }, d.onerror = () => c(lt(d, "Queue database open failed")), d.onsuccess = (m) => {
        this._db = m.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, c) => {
      const d = this.indexedDB.deleteDatabase(this.dbName);
      d.onsuccess = () => e(), d.onerror = () => c(lt(d, "Queue database delete failed")), d.onblocked = () => c(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((c) => c ? new Promise((d, m) => {
      const n = c.transaction(tt, "readonly").objectStore(tt).index("by_scope_seq").getAll(Ct(this.keyRange, e));
      n.onsuccess = () => d(n.result || []), n.onerror = () => m(lt(n, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, c) {
    return c = c || {}, this.open().then((d) => d ? new Promise((m, g) => {
      const n = d.transaction([ot, tt], "readwrite"), l = n.objectStore(ot), o = n.objectStore(tt), f = We(e);
      let u = null;
      const y = (E) => {
        const _ = E + 1;
        u = {
          entryId: this.uuid(),
          scope: e,
          chainKey: c.chainKey,
          seq: _,
          op: c.op,
          targetId: c.targetId !== void 0 ? c.targetId : null,
          payload: c.payload,
          expectedVersion: c.expectedVersion !== void 0 ? c.expectedVersion : null,
          meta: c.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, l.put({ key: f, value: _ }), o.put(u);
      }, w = l.get(f);
      w.onerror = () => g(lt(w, "Queue sequence read failed")), w.onsuccess = () => {
        const E = w.result;
        if (E && typeof E.value == "number") {
          y(E.value);
          return;
        }
        const _ = o.index("by_scope_seq").getAll(Ct(this.keyRange, e));
        _.onerror = () => g(lt(_, "Queue sequence migration failed")), _.onsuccess = () => {
          const A = (_.result || []).reduce((a, p) => Math.max(a, p.seq || 0), 0);
          y(A);
        };
      }, n.oncomplete = () => m(u), n.onerror = () => g(n.error || new Error("Queue enqueue transaction failed")), n.onabort = () => g(n.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, c, d) {
    return this.open().then((m) => m ? new Promise((g, n) => {
      const l = m.transaction(tt, "readwrite"), o = l.objectStore(tt), f = o.index("by_scope_seq").getAll(Ct(this.keyRange, e)), u = this.now();
      let y = { entries: [], wakeups: [] };
      f.onerror = () => n(lt(f, "Queue claim read failed")), f.onsuccess = () => {
        y = pr(f.result || [], c, d, u);
        for (const w of y.entries) o.put(w);
      }, l.oncomplete = () => g(y), l.onerror = () => n(l.error || new Error("Queue claim transaction failed")), l.onabort = () => n(l.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, c) {
    return this._updateEntry(e, c, (d, m) => (m.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, c, d, m) {
    m = m || {};
    const g = m.maxAttempts || 8, n = m.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((l) => l ? new Promise((o, f) => {
      const u = l.transaction([tt, ot], "readwrite"), y = u.objectStore(tt), w = u.objectStore(ot), E = y.get(c);
      let _ = null;
      E.onerror = () => f(lt(E, "Queue nack read failed")), E.onsuccess = () => {
        const A = E.result;
        if (!(!A || A.scope !== e)) {
          if (d === "drop") {
            y.delete(A.entryId), _ = { status: "dropped", entry: A };
            return;
          }
          if (Ge(A), A.updatedAt = this.now(), d === "auth") {
            A.status = "pending", y.put(A), w.put({ key: jt(e), value: "auth" }), _ = { status: "auth", entry: A };
            return;
          }
          if (d === "retry") {
            if (A.attempts = (A.attempts || 0) + 1, A.attempts >= g) {
              A.status = "failed", A.nextAttemptAt = 0, y.put(A), _ = { status: "failed", entry: A };
              return;
            }
            const a = n[Math.min(A.attempts - 1, n.length - 1)];
            A.status = "pending", A.nextAttemptAt = this.now() + a, y.put(A), _ = { status: "retry", entry: A, delay: a };
          }
        }
      }, u.oncomplete = () => o(_), u.onerror = () => f(u.error || new Error("Queue nack transaction failed")), u.onabort = () => f(u.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, c, d) {
    return this._remapTransaction(e, null, c, d);
  }
  resolveCreate(e, c, d, m) {
    return this._remapTransaction(e, c, d, m);
  }
  _remapTransaction(e, c, d, m) {
    return this.open().then((g) => g ? new Promise((n, l) => {
      const o = g.transaction(tt, "readwrite"), f = o.objectStore(tt), u = f.index("by_scope_seq").getAll(Ct(this.keyRange, e));
      let y = { changed: [], deleted: [] };
      u.onerror = () => l(lt(u, "Queue remap read failed")), u.onsuccess = () => {
        y = mr(u.result || [], c, d, m, this.now());
        for (const w of y.deleted) f.delete(w);
        for (const w of y.changed) f.put(w);
      }, o.oncomplete = () => n(y.changed), o.onerror = () => l(o.error || new Error("Queue remap transaction failed")), o.onabort = () => l(o.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((c) => c ? new Promise((d, m) => {
      const g = c.transaction(tt, "readwrite"), n = g.objectStore(tt), l = n.index("by_scope_seq").getAll(Ct(this.keyRange, e));
      let o = 0;
      l.onerror = () => m(lt(l, "Queue failed-entry read failed")), l.onsuccess = () => {
        for (const f of l.result || [])
          f.status === "failed" && (f.status = "pending", f.attempts = 0, f.nextAttemptAt = 0, f.updatedAt = this.now(), Ge(f), n.put(f), o++);
      }, g.oncomplete = () => d(o), g.onerror = () => m(g.error || new Error("Queue failed-entry reset failed")), g.onabort = () => m(g.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((c) => c ? new Promise((d, m) => {
      const n = c.transaction(ot, "readonly").objectStore(ot).get(jt(e));
      n.onsuccess = () => {
        const l = n.result ? n.result.value : !1;
        d(l || !1);
      }, n.onerror = () => m(lt(n, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, c) {
    return this.open().then((d) => {
      if (d)
        return new Promise((m, g) => {
          const n = d.transaction(ot, "readwrite"), l = typeof c == "string" ? c : c ? "manual" : !1;
          n.objectStore(ot).put({ key: jt(e), value: l }), n.oncomplete = () => m(), n.onerror = () => g(n.error || new Error("Queue pause-state write failed")), n.onabort = () => g(n.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((c) => {
      if (c)
        return new Promise((d, m) => {
          const g = c.transaction([tt, ot], "readwrite"), l = g.objectStore(tt).index("by_scope_seq").openCursor(Ct(this.keyRange, e));
          l.onsuccess = (o) => {
            const f = o.target.result;
            f && (f.delete(), f.continue());
          }, l.onerror = () => m(lt(l, "Queue clear failed")), g.objectStore(ot).delete(We(e)), g.objectStore(ot).delete(jt(e)), g.oncomplete = () => d(), g.onerror = () => m(g.error || new Error("Queue clear transaction failed")), g.onabort = () => m(g.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, c, d) {
    return this.open().then((m) => m ? new Promise((g, n) => {
      const l = m.transaction(tt, "readwrite"), o = l.objectStore(tt), f = o.get(c);
      let u = null;
      f.onerror = () => n(lt(f, "Queue entry read failed")), f.onsuccess = () => {
        const y = f.result;
        !y || y.scope !== e || (u = d(y, o));
      }, l.oncomplete = () => g(u), l.onerror = () => n(l.error || new Error("Queue entry transaction failed")), l.onabort = () => n(l.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", c = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, m = 6e4;
  if (window[e] !== void 0) return;
  function g(u) {
    const y = u[e];
    y && y._drain();
  }
  const n = {
    "data-ln-api-queue": {},
    "data-ln-api-queue-online": { effect: g }
  };
  function l() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const w = Math.random() * 16 | 0;
        return (y === "x" ? w : w & 3 | 8).toString(16);
      });
    }
  }
  const o = new gr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: l
  });
  function f(u) {
    this.dom = u, u[e] = this;
    const y = u.closest("[data-ln-data-coordinator]");
    this.scope = u.id || (y ? y.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = l(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const w = this;
    return o.open().then((E) => E ? o.getPaused(w.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((E) => {
      if (w._paused = !!E, w._paused) {
        const _ = typeof E == "string" ? E : "auth";
        T(w.dom, "ln-api-queue:paused", { reason: _, restored: !0 });
      }
      return w._emitPendingCount();
    }).then(() => w._drain()).catch((E) => {
      console.error("[ln-api-queue] Initialization failed:", E), T(w.dom, "ln-api-queue:error", { operation: "initialize", error: E });
    }), this;
  }
  f.prototype._isOnline = function() {
    const u = this.dom.getAttribute("data-ln-api-queue-online");
    return u === "true" ? !0 : u === "false" ? !1 : navigator.onLine;
  }, f.prototype._emitPendingCount = function() {
    const u = this;
    return o.allForScope(u.scope).then((y) => (T(u.dom, "ln-api-queue:pending-count", { count: y.length, scope: u.scope }), y.length === 0 && T(u.dom, "ln-api-queue:drained", { scope: u.scope }), y));
  }, f.prototype._clearTimer = function(u) {
    const y = this._timers.get(u);
    y && (clearTimeout(y), this._timers.delete(u));
  }, f.prototype._scheduleTimer = function(u, y) {
    const w = Math.max(0, y), E = this._timers.get(u);
    E && clearTimeout(E);
    const _ = this, A = setTimeout(() => {
      _._timers.delete(u), _._drain();
    }, w);
    this._timers.set(u, A);
  }, f.prototype._drain = function() {
    const u = this;
    return u._paused || !u._isOnline() ? Promise.resolve() : (u._drainPromise || (u._drainPromise = o.claimReady(u.scope, u._workerId, m).then((y) => {
      for (const w of y.wakeups)
        u._scheduleTimer(w.chainKey, w.at - Date.now());
      for (const w of y.entries)
        u._clearTimer(w.chainKey), T(u.dom, "ln-api-queue:send", {
          entryId: w.entryId,
          chainKey: w.chainKey,
          op: w.op,
          targetId: w.targetId,
          payload: w.payload,
          expectedVersion: w.expectedVersion,
          idempotencyKey: w.entryId,
          meta: w.meta
        });
    }).catch((y) => {
      console.error("[ln-api-queue] Drain failed:", y), T(u.dom, "ln-api-queue:error", { operation: "drain", error: y });
    }).finally(() => {
      u._drainPromise = null;
    })), u._drainPromise);
  }, f.prototype._onEnqueue = function(u) {
    const y = this;
    return o.enqueue(y.scope, u.detail || {}).then((w) => {
      if (w)
        return y._emitPendingCount().then((E) => (T(y.dom, "ln-api-queue:enqueued", {
          entryId: w.entryId,
          chainKey: w.chainKey,
          count: E.length
        }), y._drain()));
    }).catch((w) => {
      T(y.dom, "ln-api-queue:error", { operation: "enqueue", error: w });
    });
  }, f.prototype._onAck = function(u) {
    const y = this, w = u.detail || {};
    return o.ack(y.scope, w.entryId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((E) => {
      T(y.dom, "ln-api-queue:error", { operation: "ack", entryId: w.entryId, error: E });
    });
  }, f.prototype._onNack = function(u) {
    const y = this, w = u.detail || {};
    return o.nack(y.scope, w.entryId, w.reason, {
      maxAttempts: d,
      backoff: c
    }).then((E) => {
      if (E)
        return E.status === "failed" ? T(y.dom, "ln-api-queue:failed", {
          entryId: E.entry.entryId,
          chainKey: E.entry.chainKey,
          attempts: E.entry.attempts
        }) : E.status === "retry" ? y._scheduleTimer(E.entry.chainKey, E.delay) : E.status === "auth" && (y._paused = !0, T(y.dom, "ln-api-queue:paused", { reason: "auth" }), T(y.dom, "ln-api-queue:auth-required", {
          entryId: E.entry.entryId,
          chainKey: E.entry.chainKey
        })), y._emitPendingCount().then(() => {
          if (E.status === "dropped") return y._drain();
        });
    }).catch((E) => {
      T(y.dom, "ln-api-queue:error", { operation: "nack", entryId: w.entryId, error: E });
    });
  }, f.prototype._onRemap = function(u) {
    const y = this, w = u.detail || {};
    return o.remap(y.scope, w.oldKey, w.newId).catch((E) => {
      T(y.dom, "ln-api-queue:error", { operation: "remap", error: E });
    });
  }, f.prototype._onResolveCreate = function(u) {
    const y = this, w = u.detail || {};
    return o.resolveCreate(y.scope, w.entryId, w.oldKey, w.newId).then(() => y._emitPendingCount()).then(() => y._drain()).catch((E) => {
      T(y.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: w.entryId,
        error: E
      });
    });
  }, f.prototype._onResume = function() {
    const u = this;
    return o.setPaused(u.scope, !1).then(() => (u._paused = !1, T(u.dom, "ln-api-queue:resumed", {}), u._drain())).catch((y) => {
      T(u.dom, "ln-api-queue:error", { operation: "resume", error: y });
    });
  }, f.prototype._onPause = function() {
    const u = this;
    return o.setPaused(u.scope, "manual").then(() => {
      u._paused = !0, T(u.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((y) => {
      T(u.dom, "ln-api-queue:error", { operation: "pause", error: y });
    });
  }, f.prototype._onDrain = function() {
    const u = this;
    return o.resetFailed(u.scope).then(() => {
      const y = u._drainPromise;
      return y ? y.then(() => u._drain()) : u._drain();
    }).catch((y) => {
      T(u.dom, "ln-api-queue:error", { operation: "manual-drain", error: y });
    });
  }, f.prototype._onClear = function() {
    const u = this;
    return u._timers.forEach((y) => clearTimeout(y)), u._timers.clear(), o.clear(u.scope).then(() => {
      u._paused = !1, T(u.dom, "ln-api-queue:pending-count", { count: 0, scope: u.scope }), T(u.dom, "ln-api-queue:drained", { scope: u.scope });
    }).catch((y) => {
      T(u.dom, "ln-api-queue:error", { operation: "clear", error: y });
    });
  }, f.prototype._bindEvents = function() {
    const u = this;
    u._handlers = {
      enqueue: (y) => u._onEnqueue(y),
      ack: (y) => u._onAck(y),
      nack: (y) => u._onNack(y),
      remap: (y) => u._onRemap(y),
      resolveCreate: (y) => u._onResolveCreate(y),
      resume: () => u._onResume(),
      pause: () => u._onPause(),
      drain: () => u._onDrain(),
      clear: () => u._onClear()
    }, u.dom.addEventListener("ln-api-queue:request-enqueue", u._handlers.enqueue), u.dom.addEventListener("ln-api-queue:ack", u._handlers.ack), u.dom.addEventListener("ln-api-queue:nack", u._handlers.nack), u.dom.addEventListener("ln-api-queue:request-remap", u._handlers.remap), u.dom.addEventListener("ln-api-queue:resolve-create", u._handlers.resolveCreate), u.dom.addEventListener("ln-api-queue:request-resume", u._handlers.resume), u.dom.addEventListener("ln-api-queue:request-pause", u._handlers.pause), u.dom.addEventListener("ln-api-queue:request-drain", u._handlers.drain), u.dom.addEventListener("ln-api-queue:request-clear", u._handlers.clear);
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const u = this;
    u.dom.removeEventListener("ln-api-queue:request-enqueue", u._handlers.enqueue), u.dom.removeEventListener("ln-api-queue:ack", u._handlers.ack), u.dom.removeEventListener("ln-api-queue:nack", u._handlers.nack), u.dom.removeEventListener("ln-api-queue:request-remap", u._handlers.remap), u.dom.removeEventListener("ln-api-queue:resolve-create", u._handlers.resolveCreate), u.dom.removeEventListener("ln-api-queue:request-resume", u._handlers.resume), u.dom.removeEventListener("ln-api-queue:request-pause", u._handlers.pause), u.dom.removeEventListener("ln-api-queue:request-drain", u._handlers.drain), u.dom.removeEventListener("ln-api-queue:request-clear", u._handlers.clear), window.removeEventListener("online", u._onlineHandler), u._timers.forEach((y) => clearTimeout(y)), u._timers.clear(), T(u.dom, "ln-api-queue:destroyed", { scope: u.scope }), delete u.dom[e];
  }, U(t, e, f, "ln-api-queue", {
    attributes: n
  });
})();
function Mn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Tt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function _r(t, e, c) {
  const d = Mn(t);
  return d === null || d < 0 ? 0 : Math.min(d, Math.min(e, c) / 2);
}
function br(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((c) => !Number.isFinite(c)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function yr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), c = e[0].trim();
  return c ? {
    field: c,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function vr(t, e) {
  e = e || {};
  const c = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", m = e.yField || "value", g = e.includeZero !== !1, n = _r(e.padding, c.width, c.height), l = Array.isArray(t) ? t : [], o = [];
  for (let h = 0; h < l.length; h++) {
    const v = l[h] || {}, r = Mn(v[m]);
    r !== null && o.push({
      record: v,
      sourceIndex: h,
      label: v[d] == null ? String(h + 1) : String(v[d]),
      value: r
    });
  }
  if (o.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: c.y + c.height - n
    };
  let f = o[0].value, u = o[0].value;
  for (let h = 1; h < o.length; h++)
    o[h].value < f && (f = o[h].value), o[h].value > u && (u = o[h].value);
  let y = f, w = u;
  g && (y = Math.min(0, y), w = Math.max(0, w)), y === w && (w === 0 ? w = 1 : w > 0 ? y = 0 : w = 0);
  const E = Math.max(1, c.width - n * 2), _ = Math.max(1, c.height - n * 2), A = w - y, a = c.y + c.height - n - (0 - y) / A * _, p = [];
  for (let h = 0; h < o.length; h++) {
    const v = o[h], r = o.length === 1 ? 0.5 : h / (o.length - 1), b = c.x + n + r * E, S = c.y + c.height - n - (v.value - y) / A * _;
    p.push({
      record: v.record,
      sourceIndex: v.sourceIndex,
      label: v.label,
      value: v.value,
      x: b,
      y: S,
      pointString: Tt(b) + "," + Tt(S)
    });
  }
  const s = p.map((h) => h.pointString).join(" ");
  let i = "";
  if (p.length > 0) {
    const h = p[0], v = p[p.length - 1], r = Tt(h.x) + "," + Tt(a), b = Tt(v.x) + "," + Tt(a);
    i = r + " " + s + " " + b;
  }
  return {
    points: p,
    linePoints: s,
    areaPoints: i,
    count: p.length,
    min: f,
    max: u,
    domainMin: y,
    domainMax: w,
    baselineY: a
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", c = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function d(o) {
    const f = o[e];
    f && f.requestData();
  }
  function m(o) {
    const f = o[e];
    f && f._render();
  }
  const g = {
    "data-ln-chart": { effect: m },
    "data-ln-chart-source": { effect: d },
    "data-ln-chart-sort": { effect: d },
    "data-ln-chart-type": { effect: m },
    "data-ln-chart-x": { effect: m },
    "data-ln-chart-y": { effect: m },
    "data-ln-chart-padding": { effect: m },
    "data-ln-chart-zero": { effect: m }
  };
  function n(o, f) {
    o && (o.textContent = f);
  }
  function l(o) {
    this.dom = o, this.name = o.getAttribute(t) || "", this.source = o.getAttribute("data-ln-chart-source") || this.name, this.plot = o.querySelector("[data-ln-chart-plot]"), this.line = o.querySelector("[data-ln-chart-line]"), this.area = o.querySelector("[data-ln-chart-area]"), this.labels = o.querySelector("[data-ln-chart-labels]"), this.empty = o.querySelector("[data-ln-chart-empty]"), this.minimum = o.querySelector("[data-ln-chart-min]"), this.maximum = o.querySelector("[data-ln-chart-max]"), this.count = o.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const f = this;
    return this._onSetData = function(u) {
      const y = u.detail || {};
      f._data = Array.isArray(y.data) ? y.data : [], f.isLoaded = !0, f._setLoading(!1), f._render();
    }, this._onSetLoading = function(u) {
      f._setLoading(!!(u.detail && u.detail.loading));
    }, this._onRefresh = function() {
      f.requestData();
    }, o.addEventListener("ln-chart:set-data", this._onSetData), o.addEventListener("ln-chart:set-loading", this._onSetLoading), o.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  l.prototype._readOptions = function() {
    const o = this.dom.getAttribute("data-ln-chart-padding"), f = o === null ? NaN : Number(o), u = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(f) && f >= 0 ? f : 16,
      type: u === "area" || u === "polygon" ? "area" : "line",
      viewBox: this.plot && br(this.plot.getAttribute("viewBox")) || c
    };
  }, l.prototype._setLoading = function(o) {
    this.dom.classList.toggle("ln-chart--loading", o), this.dom.setAttribute("aria-busy", o ? "true" : "false");
  }, l.prototype._renderLabels = function(o) {
    if (!this.labels || (this.labels.replaceChildren(), o.count === 0)) return;
    const f = this.name + "-label", u = '[data-ln-template="' + f + '"]';
    if (!this.dom.querySelector(u) && !document.querySelector(u)) return;
    const y = vt(this.dom, f, "ln-chart");
    if (!y) return;
    const w = J(this.dom);
    for (const E of o.points) {
      const _ = y.cloneNode(!0);
      Pt(_, {
        label: E.label,
        value: st(E.value, w)
      }), this.labels.appendChild(_);
    }
  }, l.prototype._render = function() {
    const o = this._readOptions(), f = vr(this._data, o);
    this.model = f, this.line && (this.line.setAttribute("points", f.linePoints), this.line.toggleAttribute("hidden", f.count === 0)), this.area && (this.area.setAttribute("points", f.areaPoints), this.area.toggleAttribute("hidden", f.count === 0 || o.type !== "area"));
    const u = f.count === 0;
    this.dom.classList.toggle("ln-chart--empty", u), this.empty && this.empty.toggleAttribute("hidden", !u);
    const y = J(this.dom);
    n(this.minimum, st(f.min, y)), n(this.maximum, st(f.max, y)), n(this.count, st(f.count, y)), this._renderLabels(f), T(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: f.count,
      min: f.min,
      max: f.max
    });
  }, l.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, T(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: yr(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, U(t, e, l, "ln-chart", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  function c(d) {
    this.dom = d, this._storeName = d.getAttribute(t), this._valueField = d.getAttribute("data-ln-options-value") || "id", this._labelField = d.getAttribute("data-ln-options-label") || "name";
    const m = this;
    return this._onSetData = function(g) {
      m._rebuild(g.detail.data || []);
    }, d.addEventListener("ln-options:set-data", this._onSetData), T(d, "ln-options:request-data", { options: this._storeName }), this;
  }
  c.prototype._rebuild = function(d) {
    const m = this.dom, g = this._valueField, n = this._labelField, l = m.value, o = m.querySelectorAll("option");
    for (let u = o.length - 1; u >= 0; u--)
      o[u].value !== "" && m.removeChild(o[u]);
    for (let u = 0; u < d.length; u++) {
      const y = d[u], w = document.createElement("option");
      w.value = String(y[g]), w.textContent = y[n] != null ? y[n] : "", m.appendChild(w);
    }
    const f = m.options;
    for (let u = 0; u < f.length; u++)
      if (f[u].value === l) {
        m.value = l;
        break;
      }
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, U(t, e, c, "ln-options");
})();
function wr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const c = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!c) return null;
  const m = {};
  return m[c] = [d], m;
}
function Er(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  function c(d) {
    return this.dom = d, this._storeName = d.getAttribute(t), this._filters = wr(d.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      d.textContent = Er(m.detail && m.detail.count), d.classList.remove("is-loading");
    }, d.addEventListener("ln-stat:set-count", this._onSetCount), T(d, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, U(t, e, c, "ln-stat");
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", c = "#ln-icon-custom-", d = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let g = null;
  const n = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), o = "lni:", f = "lni:v", u = "1";
  function y() {
    try {
      if (localStorage.getItem(f) !== u) {
        for (let s = localStorage.length - 1; s >= 0; s--) {
          const i = localStorage.key(s);
          i && i.indexOf(o) === 0 && localStorage.removeItem(i);
        }
        localStorage.setItem(f, u);
      }
    } catch {
    }
  }
  y();
  function w() {
    return g || (g = document.getElementById(t), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = t, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function E(s) {
    return s.indexOf(c) === 0 ? l + "/" + s.slice(c.length) + ".svg" : n + "/" + s.slice(e.length) + ".svg";
  }
  function _(s, i) {
    const h = i.match(/viewBox="([^"]+)"/), v = h ? h[1] : "0 0 24 24", r = i.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), b = r ? r[1].trim() : "", S = i.match(/<svg([^>]*)>/i), L = S ? S[1] : "", q = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    q.id = s, q.setAttribute("viewBox", v), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const D = L.match(new RegExp(k + '="([^"]*)"'));
      D && q.setAttribute(k, D[1]);
    }), q.innerHTML = b, w().querySelector("defs").appendChild(q);
  }
  function A(s) {
    if (d.has(s) || m.has(s)) return;
    if (s.indexOf(c) === 0 && !l) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", s);
      return;
    }
    const i = s.slice(1);
    try {
      const v = localStorage.getItem(o + i);
      if (v) {
        _(i, v), d.add(s);
        return;
      }
    } catch {
    }
    m.add(s);
    const h = E(s);
    fetch(h).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      _(i, v), d.add(s), m.delete(s);
      try {
        localStorage.setItem(o + i, v);
      } catch {
      }
    }).catch(function(v) {
      console.error("[ln-icon] Fetch failed for:", i, v), m.delete(s);
    });
  }
  function a(s) {
    const i = 'use[href^="' + e + '"], use[href^="' + c + '"]', h = s.querySelectorAll ? s.querySelectorAll(i) : [];
    if (s.matches && s.matches(i)) {
      const v = s.getAttribute("href");
      v && A(v);
    }
    Array.prototype.forEach.call(h, function(v) {
      const r = v.getAttribute("href");
      r && A(r);
    });
  }
  function p() {
    a(document), new MutationObserver(function(s) {
      s.forEach(function(i) {
        if (i.type === "childList")
          i.addedNodes.forEach(function(h) {
            h.nodeType === 1 && a(h);
          });
        else if (i.type === "attributes" && i.attributeName === "href") {
          const h = i.target.getAttribute("href");
          h && (h.indexOf(e) === 0 || h.indexOf(c) === 0) && A(h);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
const Ce = /* @__PURE__ */ new Set([
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
function Ar(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const c = [];
  for (let d = 0; d <= e.length; d++) c[d] = [d];
  for (let d = 0; d <= t.length; d++) c[0][d] = d;
  for (let d = 1; d <= e.length; d++)
    for (let m = 1; m <= t.length; m++)
      e.charAt(d - 1) === t.charAt(m - 1) ? c[d][m] = c[d - 1][m - 1] : c[d][m] = Math.min(
        c[d - 1][m - 1] + 1,
        c[d][m - 1] + 1,
        c[d - 1][m] + 1
      );
  return c[e.length][t.length];
}
function Sr(t, e = Ce) {
  if (e.has(t)) return null;
  let c = null, d = 1 / 0;
  for (const g of e) {
    const n = Ar(t, g);
    n < d && (d = n, c = g);
  }
  const m = Math.max(3, Math.floor(t.length * 0.4));
  return d <= m ? c : null;
}
function Fn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Cr(t = document) {
  const e = t.ownerDocument || t, c = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!c) return [];
  const d = [], m = [c, ...c.querySelectorAll("*")];
  for (let g = 0; g < m.length; g++) {
    const n = m[g];
    if (n.attributes)
      for (let l = 0; l < n.attributes.length; l++) {
        const o = n.attributes[l];
        if (o.name.startsWith("data-ln-") && o.name.endsWith("-for")) {
          const f = (o.value || "").trim();
          if (!f) {
            d.push({
              type: "id-empty",
              element: n,
              attribute: o.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${n.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          e.getElementById(f) || e.querySelector("#" + Fn(f)) || d.push({
            type: "id-unresolved",
            element: n,
            attribute: o.name,
            targetId: f,
            message: `[ln-debug] Unresolved ID reference: <${n.tagName.toLowerCase()} ${o.name}="${f}"> targets "#${f}", but no element with id="${f}" exists in the document.`
          });
        }
      }
  }
  return d;
}
function Tr(t = document) {
  const e = t.ownerDocument || t, c = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!c) return [];
  const d = [], m = [c, ...c.querySelectorAll("*")];
  for (let g = 0; g < m.length; g++) {
    const n = m[g];
    if (n.attributes)
      for (let l = 0; l < n.attributes.length; l++) {
        const o = n.attributes[l];
        if (o.name.startsWith("data-ln-") && (o.name.endsWith("-source") || o.name.endsWith("-store")) && o.name !== "data-ln-data-store") {
          const u = (o.value || "").trim();
          if (!u) {
            d.push({
              type: "store-empty",
              element: n,
              attribute: o.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${n.tagName.toLowerCase()} ${o.name}="">.`
            });
            continue;
          }
          const y = Fn(u), w = e.querySelector(`[data-ln-data-store="${y}"], [data-ln-store="${y}"]`), E = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(u);
          !w && !E && d.push({
            type: "store-unresolved",
            element: n,
            attribute: o.name,
            storeName: u,
            message: `[ln-debug] Unresolved store reference: <${n.tagName.toLowerCase()} ${o.name}="${u}"> targets store "${u}", but no [data-ln-data-store="${u}"] exists in the document.`
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
  const c = [], d = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && d.unshift(e);
  const m = /* @__PURE__ */ new Map();
  for (let g = 0; g < d.length; g++) {
    const n = d[g], l = (n.getAttribute("data-ln-data-store") || "").trim();
    l && (m.has(l) || m.set(l, []), m.get(l).push(n));
  }
  for (const [g, n] of m.entries())
    n.length > 1 && c.push({
      type: "store-duplicate",
      storeName: g,
      elements: n,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${g}". Store names must be unique across the document.`
    });
  return c;
}
function qr(t = document, e = Ce) {
  const c = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!c) return [];
  const d = [], m = [c, ...c.querySelectorAll("*")];
  for (let g = 0; g < m.length; g++) {
    const n = m[g];
    if (n.attributes)
      for (let l = 0; l < n.attributes.length; l++) {
        const o = n.attributes[l];
        if (o.name.startsWith("data-ln-") && !e.has(o.name)) {
          const f = Sr(o.name, e), u = f ? ` Did you mean "${f}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: n,
            attribute: o.name,
            suggestion: f,
            message: `[ln-debug] Unknown attribute "${o.name}" on <${n.tagName.toLowerCase()}>.${u}`
          });
        }
      }
  }
  return d;
}
function ge(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const c = e.validAttributes || Ce, d = Cr(t), m = Tr(t), g = Lr(t), n = qr(t, c), l = [
    ...d,
    ...m,
    ...g,
    ...n
  ];
  if (!e.silent)
    for (let o = 0; o < l.length; o++)
      console.warn(l[o].message);
  return {
    idIssues: d,
    storeIssues: m,
    uniquenessIssues: g,
    spellingIssues: n,
    total: l.length
  };
}
let Ot = null;
function Vt(t = typeof document < "u" ? document : null, e = 50, c = null) {
  if (!t) return;
  Ot && (clearTimeout(Ot), Ot = null);
  function d() {
    Ot = setTimeout(() => {
      Ot = null;
      const m = ge(t);
      c && c(m);
    }, e);
  }
  nn() > 0 ? ut(d) : d();
}
function Qe(t, e, c, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", c), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", c), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let qt = [];
function xr() {
  qt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && qt.push(document.body);
}
function kr(t) {
  for (let e = 0; e < qt.length; e++)
    if (qt[e].contains(t)) return !0;
  return !1;
}
function Ir(t, e, c, d) {
  if (c === window || c === document) {
    qt.indexOf(document.body) !== -1 && Qe(t, e, c, d);
    return;
  }
  kr(c) && Qe(t, e, c, d);
}
function _e() {
  xr(), ti(qt.length > 0 ? Ir : null);
}
function $e() {
  _e();
}
function Dr() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ht(function() {
    _e(), Bt(["data-ln-debug"], _e);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  Dr();
  function c(m) {
    return this.dom = m, Vt(m.ownerDocument || document), $e(), this;
  }
  c.prototype.verify = function(m, g) {
    return ge(m || (this.dom ? this.dom.ownerDocument || this.dom : document), g);
  }, c.prototype.destroy = function() {
    delete this.dom[e], $e();
  };
  const d = U(t, e, c, "ln-debug", {
    onInit: function(m) {
      typeof document < "u" && Vt(m && m.ownerDocument ? m.ownerDocument : document);
    },
    onSubtreeChange: function(m) {
      typeof document < "u" && Vt(m && m.ownerDocument ? m.ownerDocument : document);
    }
  });
  d.verify = function(m, g) {
    return ge(m || document, g);
  }, d.schedule = function(m, g, n) {
    return Vt(m || document, g, n);
  };
})();
