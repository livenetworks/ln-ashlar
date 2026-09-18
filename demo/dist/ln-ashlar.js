function Q(t, e, l) {
  const f = t.getAttribute(e);
  return f === null ? l : f;
}
function Dt(t, e, l) {
  const f = parseInt(t.getAttribute(e), 10);
  return isNaN(f) ? l : f;
}
function Kt(t, e) {
  return t.hasAttribute(e);
}
function er(t, e) {
  return (t.getAttribute(e) || "").split(",").map((l) => l.trim()).filter(Boolean);
}
function tt(t, e, l) {
  for (const f in l) {
    const [y, _, i] = l[f];
    Object.defineProperty(t, f, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return y(e, _, i);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function et(t) {
  const e = {};
  for (const l in t) {
    const f = t[l];
    !f || !f.prop || (e[f.prop] = [f.read, l, f.fallback]);
  }
  return e;
}
function nr(t) {
  const e = {};
  for (const l in t) {
    const f = t[l];
    f && f.effect && (e[l] = f.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Te(t) {
  let e = !1;
  for (let l = 0; l < t.length; l++) {
    const f = t[l];
    if (!(f === "" || f == null) && (e = !0, !Number.isFinite(Number(f))))
      return "string";
  }
  return e ? "number" : "string";
}
function Le(t, e, l, f) {
  if (l === "number") {
    const i = parseFloat(t), s = parseFloat(e);
    return (isNaN(i) ? 0 : i) - (isNaN(s) ? 0 : s);
  }
  const y = t != null ? String(t) : "", _ = e != null ? String(e) : "";
  return f ? f.compare(y, _) : y < _ ? -1 : y > _ ? 1 : 0;
}
if (typeof window < "u") {
  const t = console.warn;
  console.warn = function(...e) {
    typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || t.apply(console, e);
  };
}
const de = {};
function Jt(t, e) {
  de[t] || (de[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const l = de[t];
  return l ? l.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function rr(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t;
}
function ir(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function q(t, e, l) {
  const f = l || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, f), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: f
  }));
}
function Z(t, e, l) {
  const f = l || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, f);
  const y = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: f
  });
  return t.dispatchEvent(y), y;
}
function rn(t, e, l) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const f = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  f[l] = t.name, q(t.dom, e, f);
}
function pt(t, e) {
  if (!t || !e) return t;
  const l = t.querySelectorAll("[data-ln-field]");
  for (let i = 0; i < l.length; i++) {
    const s = l[i], c = s.getAttribute("data-ln-field");
    e[c] != null && (s.textContent = e[c]);
  }
  const f = t.querySelectorAll("[data-ln-attr]");
  for (let i = 0; i < f.length; i++) {
    const s = f[i], c = s.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const p = o[0].trim(), u = o[1].trim();
      e[u] != null && s.setAttribute(p, e[u]);
    }
  }
  const y = t.querySelectorAll("[data-ln-show]");
  for (let i = 0; i < y.length; i++) {
    const s = y[i], c = s.getAttribute("data-ln-show");
    c in e && s.classList.toggle("hidden", !e[c]);
  }
  const _ = t.querySelectorAll("[data-ln-class]");
  for (let i = 0; i < _.length; i++) {
    const s = _[i], c = s.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < c.length; n++) {
      const o = c[n].trim().split(":");
      if (o.length !== 2) continue;
      const p = o[0].trim(), u = o[1].trim();
      u in e && s.classList.toggle(p, !!e[u]);
    }
  }
  return t;
}
function or(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const l = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let f = 0; f < l.length; f++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", l[f], e ?? null), l[f].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      pt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let l = 0; l < e.length; l++)
        e[l].textContent = "";
    }
})));
function jt(t, e) {
  if (!t || !e) return t;
  const l = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; l.nextNode(); ) {
    const _ = l.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(i, s) {
        return e[s] !== void 0 ? e[s] : "";
      }
    ));
  }
  const f = function(_, i) {
    return e[i] !== void 0 ? e[i] : "";
  }, y = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && y.push(t);
  for (let _ = 0; _ < y.length; _++) {
    const i = y[_], s = i.attributes;
    for (let c = 0; c < s.length; c++) {
      const n = s[c];
      n.value.indexOf("{{") !== -1 && i.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, f));
    }
  }
  return t;
}
function ar(t, e, l, f, y, _) {
  const i = {};
  for (let c = 0; c < t.children.length; c++) {
    const n = t.children[c], o = n.getAttribute("data-ln-render-key");
    o && (i[o] = n);
  }
  const s = document.createDocumentFragment();
  for (let c = 0; c < e.length; c++) {
    const n = e[c], o = String(f(n));
    let p = i[o];
    if (p)
      y(p, n, c);
    else {
      const u = Jt(l, _);
      if (!u || (jt(u, n), p = u.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-render-key", o), y(p, n, c);
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
function Tt(t, e, l) {
  if (t) {
    const f = t.querySelector('[data-ln-template="' + e + '"]');
    if (f) return f.content.cloneNode(!0);
  }
  return Jt(e, l);
}
function re(t, e) {
  const l = {}, f = t.querySelectorAll("[" + e + "]");
  for (let y = 0; y < f.length; y++)
    l[f[y].getAttribute(e)] = f[y].textContent, f[y].remove();
  return l;
}
function ge(t, e, l, f) {
  if (t.nodeType !== 1) return;
  const _ = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", i = Array.from(t.querySelectorAll(_));
  t.matches && t.matches(_) && i.push(t);
  for (const s of i)
    s[l] || (window.lnCore._persistSink && s.hasAttribute("data-ln-persist") && window.lnCore._persistSink(s, e), s[l] = new f(s));
}
function Ut(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function on(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function sr(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function an(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function lr(t, e) {
  return !t || !document.contains(t) || an(t) || e && typeof t[e] != "function" ? !1 : Ut(t);
}
function cr(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function sn(t, e) {
  const l = !!(e && e.typed), f = e && e.exclude, y = {}, _ = t.elements, i = {};
  if (l)
    for (let s = 0; s < _.length; s++) {
      const c = _[s];
      c.name && c.type === "checkbox" && !c.disabled && (i[c.name] = (i[c.name] || 0) + 1);
    }
  for (let s = 0; s < _.length; s++) {
    const c = _[s];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(f && c.matches && c.matches(f)))
      if (c.type === "checkbox")
        l && i[c.name] === 1 ? y[c.name] = c.checked : (y[c.name] || (y[c.name] = []), c.checked && y[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (y[c.name] = c.value);
      else if (c.type === "select-multiple") {
        y[c.name] = [];
        for (let n = 0; n < c.options.length; n++)
          c.options[n].selected && y[c.name].push(c.options[n].value);
      } else if (l && c.type === "hidden")
        y[c.name] = c.value;
      else if (l && (c.type === "number" || c.type === "range")) {
        const n = Number(c.value);
        y[c.name] = c.value === "" || isNaN(n) ? null : n;
      } else
        y[c.name] = c.value;
  }
  return y;
}
function dr(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function ln(t, e) {
  const l = t.elements, f = [], y = {};
  for (let _ = 0; _ < l.length; _++) {
    const i = l[_];
    i.name && i.type === "checkbox" && (y[i.name] = (y[i.name] || 0) + 1);
  }
  for (let _ = 0; _ < l.length; _++) {
    const i = l[_];
    if (i.type === "file" || i.type === "submit" || i.type === "button") continue;
    const s = i.getAttribute("data-ln-fill-as") || i.name;
    if (!s || !(s in e)) continue;
    const c = e[s];
    if (i.type === "checkbox") {
      if (Array.isArray(c))
        i.checked = c.indexOf(i.value) !== -1;
      else if (y[i.name] > 1) {
        const n = String(c).split(",").map(function(o) {
          return o.trim();
        });
        i.checked = n.indexOf(i.value) !== -1;
      } else
        i.checked = dr(c);
      f.push(i);
    } else if (i.type === "radio")
      i.checked = i.value === String(c), f.push(i);
    else if (i.type === "select-multiple") {
      if (Array.isArray(c))
        for (let n = 0; n < i.options.length; n++)
          i.options[n].selected = c.indexOf(i.options[n].value) !== -1;
      f.push(i);
    } else
      i.value = c, f.push(i);
  }
  return f;
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
  const e = t ? t.closest("[lang]") : null, l = (e ? e.getAttribute("lang") || e.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!l) return "en-US";
  const f = l.trim().toLowerCase();
  return f.indexOf("-") === -1 && Ne[f] ? Ne[f] : l;
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
function cn(t, e, { get: l, set: f }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return l ? l.call(this) : e.get.call(this);
    },
    set: function(y) {
      f ? f.call(this, y, (_) => e.set.call(this, _)) : e.set.call(this, y);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ur() {
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
function dn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function un() {
  return window.lnCore = window.lnCore || {}, window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] }, window.lnCore._attrRegistry;
}
function hn(t) {
  const e = un(), l = t.observed || [];
  for (let f = 0; f < l.length; f++) {
    const y = l[f];
    e.byAttr.has(y) || e.byAttr.set(y, []), e.byAttr.get(y).push(t);
  }
  (t.onAttrChange || t.effects) && e.reactive.push(t), t.persist && e.persist.push(t);
}
function hr(t) {
  const e = t.target, l = t.attributeName;
  if (t.oldValue === e.getAttribute(l)) return;
  const f = un(), y = f.byAttr.get(l);
  if (window.lnCore._debugSink && (l.indexOf("data-ln-") === 0 || y) && window.lnCore._debugSink("attr", l, e, { oldValue: t.oldValue, newValue: e.getAttribute(l) }), l.indexOf("data-ln-") === 0)
    for (let _ = 0; _ < f.reactive.length; _++) {
      const i = f.reactive[_];
      if (!e[i.attribute]) continue;
      const s = i.effects && i.effects[l];
      s ? s(e, l, t.oldValue) : i.onAttrChange && (!i.declared || i.declared.has(l)) && i.onAttrChange(e, l, t.oldValue);
    }
  if (y)
    for (let _ = 0; _ < y.length; _++) {
      const i = y[_];
      if (i.handler) {
        i.handler(e, l, t.oldValue);
        continue;
      }
      i.onAttributeChange && e[i.attribute] ? i.onAttributeChange(e, l) : (ge(e, i.selector, i.attribute, i.ComponentFn), i.onInit && i.onInit(e));
    }
}
function fn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let l = 0; l < e.length; l++)
        hr(e[l]);
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Vt(t, e) {
  hn({ observed: t, handler: e }), fn();
}
function j(t, e, l, f, y = {}) {
  const _ = y.extraAttributes || [], i = y.onAttributeChange || null, s = y.onSubtreeChange || null, c = y.onInit || null, n = y.onAttrChange || null, o = y.effects || null, p = y.attributes || null, u = p ? nr(p) : o, w = p ? new Set(Object.keys(p)) : null, v = y.persist || null;
  function S(g) {
    const a = g || document.body;
    ge(a, t, e, l), c && c(a);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const g = /\[([\w-]+)/g;
    let a;
    for (; (a = g.exec(t)) !== null; )
      A.push(a[1]);
  } else
    A.push(t);
  hn({
    selector: t,
    attribute: e,
    ComponentFn: l,
    onInit: c,
    observed: A.concat(_),
    onAttributeChange: i,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: v
  }), fn(), gt(function() {
    new MutationObserver(function(a) {
      for (let r = 0; r < a.length; r++) {
        const h = a[r];
        if (h.type === "childList") {
          if (s && h.target) {
            const T = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", m = h.target.nodeType === 1 ? h.target.matches(T) ? h.target : h.target.closest(T) : h.target.parentElement ? h.target.parentElement.closest(T) : null;
            m && s(m, h);
          }
          for (let b = 0; b < h.addedNodes.length; b++) {
            const T = h.addedNodes[b];
            T.nodeType === 1 && (ge(T, t, e, l), c && c(T));
          }
          for (let b = 0; b < h.removedNodes.length; b++) {
            const T = h.removedNodes[b];
            if (T.nodeType === 1) {
              const E = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]", C = Array.from(T.querySelectorAll(E));
              T.matches && T.matches(E) && C.push(T);
              for (let k = 0; k < C.length; k++) {
                const D = C[k];
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
  }, f || (t.indexOf("[") === -1 ? t.replace("data-", "") : "component")), window[e] = S;
  function d() {
    dn() > 0 ? mt(function() {
      S(document.body);
    }) : S(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), S;
}
function pn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const l = e.getAttribute("href");
  return !(!l || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || l.startsWith("mailto:") || l.startsWith("tel:") || l === "#" || l.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, l) => l === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Nt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function mn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (l) {
    return console.error(`[${e}] Invalid headers JSON:`, l), {};
  }
}
const gn = {};
function fr(t, e) {
  gn[t] = e;
}
function pr(t) {
  return gn[t] || { ingress: (e) => e, egress: (e) => e };
}
const _n = {};
function qe(t, e) {
  if (!t || typeof e != "object") return;
  const l = t.toLowerCase().split("-")[0];
  _n[l] = e;
}
function kt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return _n[e] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = fr, window.lnCore.getDataMapper = pr, window.lnCore.registerLocaleFallback = qe, window.lnCore.getLocaleFallback = kt, window.lnCore.fillTemplate = jt, window.lnCore.fill = pt, window.lnCore.lnFill = or, window.lnCore.renderList = ar, window.lnCore.ensureLocaleObserver = ie);
function oe(t, e) {
  let l = !1;
  return function() {
    l || (l = !0, queueMicrotask(function() {
      l = !1, t();
    }));
  };
}
function bn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, l = t.pageSize > 0 ? t.pageSize : 200, f = t.threshold != null ? t.threshold : 25, y = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const _ = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, i = typeof t.onChange == "function" ? t.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let o = 0, p = 0, u = 0, w = { sort: null, filters: {}, search: "" }, v = null, S = 0, A = 0, d = !1;
  function g(b) {
    c.set(b, ++S);
  }
  function a() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function r() {
    if (s.size <= e) return;
    const b = Array.from(s.keys()).sort(function(m, E) {
      return (c.get(m) || 0) - (c.get(E) || 0);
    });
    let T = 0;
    for (; s.size > e && T < b.length; )
      s.delete(b[T]), c.delete(b[T]), T++;
  }
  function h(b, T) {
    n.add(b), _(w, b, T);
  }
  return {
    get: function(b) {
      return s.get(b);
    },
    has: function(b) {
      return s.has(b);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return o;
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
    ensure: function(b, T) {
      clearTimeout(v), A = b;
      for (let I = b; I < T; I++)
        s.has(I) && g(I);
      if (o <= 0) return;
      const m = Math.max(0, b - f), E = Math.min(o, T + f), C = Math.floor(m / l), k = Math.floor(Math.max(0, E - 1) / l);
      let D = -1;
      for (let I = C; I <= k; I++) {
        const R = I * l, O = Math.min(l, o - R);
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
        h(D, l);
      }, y));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== u) return !1;
      const T = b.offset || 0, m = b.data || [];
      let E = 0;
      for (let C = 0; C < m.length; C++)
        m[C] != null && E++;
      if (E === 0 && (b.provisional || b.filtered > 0))
        return n.delete(T), !1;
      d && (s.clear(), c.clear(), d = !1), b.provisional || (p = b.total != null ? b.total : p, o = b.filtered != null ? b.filtered : b.data ? b.data.length : o);
      for (let C = 0; C < m.length; C++)
        m[C] != null && (s.set(T + C, m[C]), g(T + C));
      return n.delete(T), r(), i(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (w = b), h(0, l);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(b) {
      u++, n.clear(), clearTimeout(v), b && (w = b), d = !0, h(0, l);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(v), d = !0;
      const b = Math.max(0, Math.floor(A / l) * l);
      h(b, l);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(b) {
      n.delete(b);
    },
    destroy: function() {
      clearTimeout(v), s.clear(), c.clear(), n.clear();
    },
    configure: function(b) {
      b = b || {};
      let T = !1;
      if (b.windowSize != null && b.windowSize > 0 && b.windowSize !== e) {
        const m = b.windowSize < e;
        e = b.windowSize, m && r(), T = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (l = b.pageSize), b.threshold != null && b.threshold >= 0 && (f = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (y = b.fetchDebounce), T && i();
    },
    setGrandTotal: function(b) {
      b == null || isNaN(b) || b < 0 || (p = b, a() || (o = b), i());
    }
  };
}
function yn(t) {
  return (t || "").replace(/^#/, "");
}
function ae(t) {
  const e = t === void 0 ? location.hash : t, l = {}, f = yn(e);
  if (!f) return l;
  const y = f.split("&");
  for (let _ = 0; _ < y.length; _++) {
    const i = y[_];
    if (!i) continue;
    const s = i.indexOf(":"), c = s > -1 ? i.slice(0, s) : i, n = s > -1 ? i.slice(s + 1) : "";
    if (c)
      try {
        l[c] = decodeURIComponent(n);
      } catch {
        l[c] = n;
      }
  }
  return l;
}
function ot(t) {
  if (!t) return null;
  const e = ae();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const l = ae();
  e == null ? delete l[t] : l[t] = String(e);
  const y = Object.keys(l).map(function(_) {
    const i = l[_];
    return i === "" ? _ : _ + ":" + encodeURIComponent(i);
  }).join("&");
  yn(location.hash) !== y && (location.hash = y);
}
function ke(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const l = t.getAttribute("data-ln-hash");
  if (l && l.trim() !== "") return l.trim();
  const f = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return f ? e ? f + "-" + e : f : e || null;
}
function vn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function _e(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function wn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function be(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const l = t.slice(0, e), f = t.slice(e + 1), y = f ? f.split(",").map(function(_) {
    try {
      return decodeURIComponent(_);
    } catch {
      return _;
    }
  }).filter(Boolean) : [];
  return { key: l, values: y };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = ae, window.lnCore.hashGet = ot, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = ke, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = vn, window.lnCore.hashSortDecode = _e, window.lnCore.hashFilterEncode = wn, window.lnCore.hashFilterDecode = be);
function Zt(t, e, l, f) {
  const y = typeof f == "number" ? f : 4, _ = window.innerWidth, i = window.innerHeight, s = e.width, c = e.height, n = (l || "bottom").split("-"), o = n[0], p = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[o] || u.bottom;
  function v(a) {
    return a === "top" || a === "bottom" ? p === "start" ? t.left : p === "end" ? t.right - s : t.left + (t.width - s) / 2 : p === "start" ? t.top : p === "end" ? t.bottom - c : t.top + (t.height - c) / 2;
  }
  function S(a) {
    let r, h, b = !0;
    return a === "top" ? (r = t.top - y - c, h = v(a), r < 0 && (b = !1)) : a === "bottom" ? (r = t.bottom + y, h = v(a), r + c > i && (b = !1)) : a === "left" ? (r = v(a), h = t.left - y - s, h < 0 && (b = !1)) : (r = v(a), h = t.right + y, h + s > _ && (b = !1)), { top: r, left: h, side: a, fits: b };
  }
  let A = null;
  for (let a = 0; a < w.length; a++) {
    const r = S(w[a]);
    if (r.fits) {
      A = r;
      break;
    }
  }
  A || (A = S(w[0]));
  let d = A.top, g = A.left;
  return s >= _ ? g = 0 : (g < 0 && (g = 0), g + s > _ && (g = _ - s)), c >= i ? d = 0 : (d < 0 && (d = 0), d + c > i && (d = i - c)), { top: d, left: g, placement: A.side };
}
function ye(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, l = e.visibility, f = e.display, y = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const _ = t.offsetWidth, i = t.offsetHeight;
  return e.visibility = l, e.display = f, e.position = y, { width: _, height: i };
}
let Ct = null;
async function Fe(t) {
  if (!t) {
    Ct = null;
    return;
  }
  try {
    const e = new TextEncoder(), l = await crypto.subtle.digest("SHA-256", e.encode(t));
    Ct = await crypto.subtle.importKey(
      "raw",
      l,
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
async function mr(t, e = Ct) {
  const l = e || Ct;
  if (!l || t === void 0 || t === null) return t;
  try {
    const f = new TextEncoder(), y = crypto.getRandomValues(new Uint8Array(12)), _ = typeof t == "string" ? t : JSON.stringify(t), i = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: y },
      l,
      f.encode(_)
    ), s = btoa(String.fromCharCode(...y)), c = btoa(String.fromCharCode(...new Uint8Array(i)));
    return {
      encrypted: !0,
      iv: s,
      data: c
    };
  } catch (f) {
    return console.error("[ln-core/crypto] Encryption failed:", f), t;
  }
}
async function gr(t, e = Ct) {
  const l = e || Ct;
  if (!t || !t.encrypted || !l) return t;
  try {
    const f = new TextDecoder(), y = Uint8Array.from(atob(t.iv), (c) => c.charCodeAt(0)), _ = Uint8Array.from(atob(t.data), (c) => c.charCodeAt(0)), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: y },
      l,
      _
    ), s = f.decode(i);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (f) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", f), { ...t, decryptionError: !0 };
  }
}
function En(t, e = 100, l = 0) {
  const f = parseFloat(String(t)) || 0, y = parseFloat(String(e)) || 100, _ = parseFloat(String(l)) || 0, i = Math.max(_, Math.min(f, y)), s = y - _;
  let c = 0;
  return s > 0 && (c = (i - _) / s * 100), c = Math.max(0, Math.min(100, c)), {
    value: f,
    min: _,
    max: y,
    clampedValue: i,
    percentage: c
  };
}
function at(t) {
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
function Ft(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), l = String(t.getMonth() + 1).padStart(2, "0"), f = String(t.getDate()).padStart(2, "0");
  return e + "-" + l + "-" + f;
}
const yt = {};
function te(t) {
  const e = t || "default";
  if (!yt[e]) {
    const l = new Intl.NumberFormat(t, { useGrouping: !0 }), f = l.formatToParts(1234.5);
    let y = "", _ = ".";
    for (let i = 0; i < f.length; i++)
      f[i].type === "group" && (y = f[i].value), f[i].type === "decimal" && (_ = f[i].value);
    yt[e] = { groupSep: y, decimalSep: _, fmt: l };
  }
  return yt[e];
}
function An(t, e, l) {
  if (t == null || typeof t != "string") return "";
  let f = t.trim();
  return f === "" ? "" : (f = f.replace(/[$€£¥]/g, ""), e && (f = f.split(e).join("")), f = f.replace(/\s/g, ""), l && l !== "." && (f = f.replace(l, ".")), f = f.replace(/[^\d.-]/g, ""), f);
}
function _r(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const l = t.trim();
  if (l === "" || l === "-") return NaN;
  const f = te(e), y = An(l, f.groupSep, f.decimalSep);
  if (y === "" || y === "-") return NaN;
  const _ = parseFloat(y);
  return isNaN(_) ? NaN : _;
}
function ct(t, e, l = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const f = e || "default", y = l.maxDecimals != null ? parseInt(l.maxDecimals, 10) : null, _ = l.userDecimals != null ? l.userDecimals : null;
  if (y !== null) {
    const i = f + "|max:" + y;
    return yt[i] || (yt[i] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: y
    })), yt[i].format(t);
  }
  if (_ !== null && _ > 0) {
    const i = f + "|exact:" + _;
    return yt[i] || (yt[i] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: _,
      maximumFractionDigits: _
    })), yt[i].format(t);
  }
  return te(e).fmt.format(t);
}
function ve(t) {
  return String(t || "").trim().toLowerCase();
}
function Sn(t) {
  const e = ve(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function br(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((l) => l.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Cn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const l = String(t).toLowerCase();
  for (let f = 0; f < e.length; f++)
    if (l.indexOf(e[f]) === -1) return !1;
  return !0;
}
function yr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function xe(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const l = String(t).trim().toLowerCase();
  for (let f = 0; f < e.length; f++)
    if (String(e[f]).trim().toLowerCase() === l)
      return !0;
  return !1;
}
function vr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function wr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Er(t, e) {
  return (e || "GET") + " " + (t || "");
}
function Ar(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  function f(i, s) {
    s = s || {};
    const c = vr(i), n = wr(i, s), o = Er(c, n);
    Ar(n) && e.has(o) && (e.get(o).abort(), e.delete(o));
    const p = new AbortController(), u = s.signal;
    let w = null;
    u && (u.aborted ? p.abort(u.reason) : (w = function() {
      p.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, s, { signal: p.signal });
    return e.set(o, p), t(i, v).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(o) === p && e.delete(o);
    });
  }
  f.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = f;
  function y(i) {
    if (!i.detail || !i.detail.url) return;
    const s = i.target, c = (i.detail.method || (i.detail.body ? "POST" : "GET")).toUpperCase(), n = i.detail.key;
    n && l.has(n) && (l.get(n).abort(), l.delete(n));
    const o = new AbortController(), p = i.detail.signal;
    let u = null;
    p && (p.aborted ? o.abort(p.reason) : (u = function() {
      o.abort(p.reason);
    }, p.addEventListener("abort", u, { once: !0 }))), n && l.set(n, o);
    const w = { method: c, signal: o.signal };
    i.detail.body !== void 0 && (w.body = i.detail.body), window.fetch(i.detail.url, w).then(function(v) {
      p && u && p.removeEventListener("abort", u), n && l.get(n) === o && l.delete(n), q(s, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      p && u && p.removeEventListener("abort", u), n && l.get(n) === o && l.delete(n), !(v && v.name === "AbortError") && q(s, "ln-http:error", {
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
  document.addEventListener("ln-http:request", y), document.addEventListener("ln-http:cancel", _), window.lnHttp = {
    cancel: function(i) {
      let s = !1;
      return e.forEach(function(c, n) {
        n.endsWith(" " + i) && (c.abort(), e.delete(n), s = !0);
      }), s;
    },
    cancelByKey: function(i) {
      return l.has(i) ? (l.get(i).abort(), l.delete(i), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(i) {
        i.abort();
      }), e.clear(), l.forEach(function(i) {
        i.abort();
      }), l.clear();
    },
    get inflight() {
      const i = [];
      return e.forEach(function(s, c) {
        const n = c.indexOf(" ");
        i.push({ method: c.slice(0, n), url: c.slice(n + 1) });
      }), l.forEach(function(s, c) {
        i.push({ key: c });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", y), document.removeEventListener("ln-http:cancel", _), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-include": { prop: "url", read: Q, fallback: "" }
  }, f = et(l), y = /* @__PURE__ */ new Map();
  function _(i) {
    if (this.dom = i, tt(this, i, f), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ur(), this._held = !0;
    const s = this, c = this.url;
    let n = y.get(c);
    return n || (n = fetch(c).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw y.delete(c), o;
    }), y.set(c, n)), n.then(function(o) {
      if (s._destroyed) return;
      const p = document.createElement("template");
      p.innerHTML = o, s.dom.content.appendChild(p.content), q(s.dom, "ln-include:loaded", { target: s.dom, url: s.url }), s._held && (s._held = !1, ue());
    }).catch(function(o) {
      s._destroyed || (console.error("[ln-include] Failed to fetch template from " + s.url + ":", o), q(s.dom, "ln-include:error", { target: s.dom, url: s.url, error: o }), s._held && (s._held = !1, ue()));
    }), this;
  }
  _.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ue()), delete this.dom[e]);
  }, j(t, e, _, "ln-include", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-form": {},
    "data-ln-form-action-edit": { prop: "_actionEdit", read: Q, fallback: "" },
    "data-ln-form-action-method": { prop: "_actionMethod", read: Q, fallback: "PUT" }
  }, f = et(l);
  function y(_) {
    this.dom = _, tt(this, _, f), this._baseAction = _.getAttribute("action") || "";
    const i = this;
    return this._onLnFill = function(s) {
      s.target === i.dom && (s.detail ? (i.fill(s.detail), i._applyActionMode(s.detail)) : i.dom.reset());
    }, this._onReset = function() {
      i._applyActionMode(null);
    }, _.addEventListener("ln-fill", this._onLnFill), _.addEventListener("reset", this._onReset), this;
  }
  y.prototype.fill = function(_) {
    const i = ln(this.dom, _);
    for (let s = 0; s < i.length; s++) {
      const c = i[s], n = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, y.prototype._ensureMethodInput = function() {
    let _ = this.dom.querySelector('input[name="_method"]');
    return _ || (_ = document.createElement("input"), _.type = "hidden", _.name = "_method", _.value = "", this.dom.appendChild(_)), _;
  }, y.prototype._applyActionMode = function(_) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const i = _ && _.id != null && _.id !== "" ? _.id : null, s = this._ensureMethodInput();
    if (i !== null) {
      const c = this._actionEdit;
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(i))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(i)), s.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), q(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, y, "ln-form", {
    attributes: l
  });
})();
const Pe = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Be(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function Sr(t, e) {
  const l = [];
  if (t) {
    const f = Object.keys(Pe);
    for (let y = 0; y < f.length; y++) {
      const _ = f[y], i = Pe[_];
      t[i] && l.push(_);
    }
  }
  if (e) {
    const f = Array.from(e);
    for (let y = 0; y < f.length; y++)
      f[y] && l.indexOf(f[y]) === -1 && l.push(f[y]);
  }
  return l;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", l = "data-ln-validate-errors", f = "data-ln-validate-error", y = "ln-validate-valid", _ = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-validate": {},
    "data-ln-validate-errors": {},
    "data-ln-validate-error": {}
  };
  function s(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, o = c.tagName, p = c.type, u = o === "SELECT" || p === "checkbox" || p === "radio";
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
        const g = d.querySelector("[" + f + '="' + A + '"]');
        g && g.classList.remove("hidden");
      }
      c.classList.remove(y), c.classList.add(_), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(S) {
      const A = S.detail && S.detail.error, d = c.closest(".form-element");
      if (A) {
        if (n._customErrors.delete(A), d) {
          const g = d.querySelector("[" + f + '="' + A + '"]');
          g && g.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(g) {
          if (d) {
            const a = d.querySelector("[" + f + '="' + g + '"]');
            a && a.classList.add("hidden");
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
    const c = this.dom, n = c.validity, o = Be(n, this._customErrors.size), p = Sr(n, this._customErrors), u = c.closest(".form-element");
    if (u) {
      const v = u.querySelector("[" + l + "]");
      if (v) {
        const S = v.querySelectorAll("[" + f + "]");
        for (let A = 0; A < S.length; A++) {
          const d = S[A].getAttribute(f);
          S[A].classList.toggle("hidden", !p.includes(d));
        }
      }
    }
    return c.classList.toggle(y, o), c.classList.toggle(_, !o), c.setAttribute("aria-invalid", o ? "false" : "true"), q(c, o ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name, errors: p }), o;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(y, _), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const n = c.querySelectorAll("[" + f + "]");
      for (let o = 0; o < n.length; o++)
        n[o].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return Be(this.dom.validity, this._customErrors.size);
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(y, _), this.dom.removeAttribute("aria-invalid"), q(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[e];
  }, j(t, e, s, "ln-validate", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", l = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function f(p) {
    if (!p.hasAttribute(t) || p[e]) return;
    p[e] = !0;
    const u = c(p);
    y(u.links), _(u.forms);
  }
  function y(p) {
    for (const u of p) {
      if (u[e + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const w = u.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(S) {
        if (!pn(S, u)) return;
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
      if (u.hasAttribute(l)) {
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
    let a = u;
    const r = document.querySelector('meta[name="csrf-token"]'), h = r ? r.getAttribute("content") : null;
    w instanceof FormData && h && w.append("_token", h);
    const b = {
      method: p,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (h && (b.headers["X-CSRF-TOKEN"] = h), p === "GET" && w) {
      const T = new URLSearchParams(w);
      a = u + (u.includes("?") ? "&" : "?") + T.toString();
    } else p !== "GET" && w && (b.body = w);
    fetch(a, b).then(function(T) {
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
        } else v.tagName === "FORM" && v.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", a);
        q(v, "ln-ajax:success", { method: p, url: a, data: E });
      } else
        q(v, "ln-ajax:error", {
          method: p,
          url: a,
          status: m,
          data: E,
          error: C || null
        });
      q(v, "ln-ajax:complete", { method: p, url: a }), g();
    }).catch(function(T) {
      q(v, "ln-ajax:error", { method: p, url: a, status: 0, data: null, error: T }), q(v, "ln-ajax:complete", { method: p, url: a }), g();
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
              if (v.nodeType === 1 && (f(v), !v.hasAttribute(t))) {
                for (const A of v.querySelectorAll("[" + t + "]"))
                  f(A);
                const S = v.closest && v.closest("[" + t + "]");
                if (S && S.getAttribute(t) !== "false") {
                  const A = c(v);
                  y(A.links), _(A.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt([t], function(u) {
        f(u);
      });
    }, "ln-ajax");
  }
  function o() {
    for (const p of document.querySelectorAll("[" + t + "]"))
      f(p);
  }
  window[e] = f, window[e].destroy = i, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
function Cr(t, { isHydration: e = !1, hasPrimaryRegion: l = !1, primaryMatch: f = null } = {}) {
  const y = l ? !f : !t.some((n) => n.match), _ = [], i = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const o = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !o && n.targetEl && _.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || i.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  i.sort((n, o) => n.regionKey === "__primary__" ? -1 : o.regionKey === "__primary__" ? 1 : 0);
  const c = i.find((n) => n.regionKey === "__primary__") || i[0] || null;
  return { notFound: y, clears: _, swaps: i, owner: c };
}
const Tn = {
  navigate: function(t) {
    zt(t, { historyAction: "push" });
  },
  replace: function(t) {
    zt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: kn,
      query: xn,
      route: In,
      regions: qn
    };
  }
}, Ie = "data-ln-route", Ln = "lnRoute";
typeof window < "u" && (window.lnRouter = Tn);
function he(t) {
  Nn(t), Mn(t), _t.size > 0 && On();
}
const Tr = {
  "data-ln-route": { effect: he },
  "data-ln-route-target": { effect: he },
  "data-ln-route-title": { effect: he },
  "data-ln-route-keep": {},
  "data-ln-router-hydrate": {}
}, _t = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new WeakMap();
let qn = /* @__PURE__ */ new Map(), He = !1, ee = null, kn = {}, xn = {}, In = null, we = !1;
function Ue(t, e, l) {
  we ? queueMicrotask(function() {
    q(t, e, l);
  }) : q(t, e, l);
}
function ne(t) {
  try {
    const _ = new URL(t, window.location.origin);
    t = _.pathname + _.search + _.hash;
  } catch {
  }
  let [e] = t.split("#"), [l, f] = e.split("?");
  const y = {};
  if (f) {
    const _ = new URLSearchParams(f);
    for (const [i, s] of _.entries())
      y[i] = s;
  }
  return l = l.replace(/\/+$/, ""), l === "" && (l = "/"), { path: l, query: y };
}
function Dn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const l = t.segments, f = e.segments, y = Math.max(l.length, f.length);
  for (let _ = 0; _ < y; _++) {
    const i = l[_], s = f[_];
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
function Rn(t, e) {
  const l = t.split("/").filter(Boolean);
  for (const f of e) {
    if (f.pattern === "*")
      return {
        route: f,
        params: { wildcard: t }
      };
    const y = f.segments, _ = {};
    let i = !0;
    if (!(l.length > y.length && y[y.length - 1] !== "*")) {
      for (let s = 0; s < y.length; s++) {
        const c = y[s], n = l[s];
        if (c === "*") {
          _.wildcard = l.slice(s).join("/");
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
      if (i && (y.indexOf("*") !== -1 || l.length <= y.length))
        return { route: f, params: _ };
    }
  }
  return null;
}
function Ee(t, e = {}) {
  const l = e.warn !== !1;
  if (t !== "__primary__") {
    const y = document.getElementById(t);
    return !y && l && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), y;
  }
  const f = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !f && l && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), f;
}
function ze(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), l = [t].concat(e);
  for (const y of l)
    for (const _ of Object.keys(y))
      if (_.startsWith("ln") && y[_] && typeof y[_].destroy == "function")
        try {
          y[_].destroy();
        } catch (i) {
          console.error(`[ln-router] Error destroying component ${_} on element:`, y, i);
        }
  const f = document.querySelectorAll('[data-ln-popover="open"]');
  for (const y of f) {
    const _ = y.lnPopover;
    if (_ && _.trigger && t.contains(_.trigger))
      try {
        _.destroy();
      } catch (i) {
        console.error("[ln-router] Error destroying open popover:", i);
      }
  }
}
function zt(t, e = {}) {
  const { path: l, query: f } = ne(t), y = /* @__PURE__ */ new Map();
  for (const [u, w] of _t)
    y.set(u, Rn(l, w.sorted));
  const _ = y.get("__primary__") || null, i = Ee("__primary__", { warn: !!_ }), s = _t.has("__primary__"), c = [];
  for (const [u, w] of y) {
    const v = u === "__primary__" ? i : Ee(u, { warn: !1 }), S = !v && !!(_ && _.route && _.route.templateNode && _.route.templateNode.content && _.route.templateNode.content.querySelector("#" + CSS.escape(u)));
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
  const n = Cr(c, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: s,
    primaryMatch: _
  });
  if (n.notFound) {
    Ue(document.body, "ln-router:not-found", { path: l });
    return;
  }
  if (Z(i || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: _ ? _.params : {},
    query: f
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const p = function() {
    for (const u of n.clears)
      ze(u.targetEl), u.targetEl.replaceChildren(), fe.delete(u.targetEl);
    for (const u of n.swaps) {
      if ((u.isPending || !u.targetEl || !document.contains(u.targetEl)) && (u.targetEl = u.regionKey === "__primary__" ? i : document.getElementById(u.regionKey)), !u.targetEl) {
        console.warn(`[ln-router] Target element #${u.regionKey} could not be resolved`);
        continue;
      }
      if (u.skipMount || (ze(u.targetEl), u.targetEl.replaceChildren(u.match.route.templateNode.content.cloneNode(!0))), fe.set(u.targetEl, u.match.route.templateNode), n.owner && u.regionKey === n.owner.regionKey) {
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
      Ue(u.targetEl, "ln-router:navigated", {
        path: t,
        params: u.match.params,
        query: f,
        route: u.match.route,
        target: u.targetEl,
        region: u.regionKey
      });
    }
    ee = t, xn = f, In = _ ? _.route : null, kn = _ ? _.params : {}, qn = new Map(
      Array.from(y.entries()).map(([u, w]) => [u, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(p) : p();
}
function Lr(t) {
  const e = t.target.closest("a");
  if (!e || !pn(t, e)) return;
  const l = e.getAttribute("href"), { path: f } = ne(l);
  for (const y of _t.values())
    if (Rn(f, y.sorted)) {
      t.preventDefault(), zt(l, { historyAction: "push" });
      return;
    }
}
function qr(t, e) {
  const l = Object.keys(t), f = Object.keys(e);
  if (l.length !== f.length) return !1;
  for (let y = 0; y < l.length; y++) {
    const _ = l[y];
    if (t[_] !== e[_]) return !1;
  }
  return !0;
}
function kr() {
  const t = window.location.pathname + window.location.search, e = Tn.current();
  if (e && e.path != null) {
    const l = ne(t);
    if (ne(e.path).path === l.path && qr(e.query, l.query))
      return;
  }
  zt(t, { historyAction: "skip" });
}
function On() {
  He || (He = !0, gt(function() {
    document.addEventListener("click", Lr), window.addEventListener("popstate", kr), we = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    zt(t, { historyAction: "replace", isHydration: !0 }), we = !1;
  }, "ln-router"));
}
function Mn(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null;
  if (l === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const f = l || "__primary__";
  _t.has(f) || _t.set(f, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const y = _t.get(f);
  if (y.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${f}"`);
    return;
  }
  const _ = t.getAttribute("data-ln-route-title"), i = e.split("/").filter(Boolean), s = {
    pattern: e,
    segments: i,
    target: l,
    title: _,
    templateNode: t
  }, c = Ee(f);
  c && c.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), y.routes.set(e, s), y.sorted = Array.from(y.routes.values()).sort(Dn);
}
function Nn(t) {
  const e = t.getAttribute(Ie);
  if (!e) return;
  const f = t.getAttribute("data-ln-route-target") || null || "__primary__", y = _t.get(f);
  y && (y.routes.delete(e), y.sorted = Array.from(y.routes.values()).sort(Dn), y.routes.size === 0 && _t.delete(f));
}
function Fn(t) {
  return this.dom = t, Mn(t), this;
}
Fn.prototype.destroy = function() {
  Nn(this.dom), delete this.dom[Ln];
};
j(Ie, Ln, Fn, "ln-router", {
  attributes: Tr,
  onInit: function() {
    _t.size > 0 && On();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-modal": { effect: y }
  };
  function f(_) {
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
  f.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, f.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, f.prototype.toggle = function() {
    const _ = this.dom.getAttribute(t);
    this.dom.setAttribute(t, _ === "open" ? "close" : "open");
  }, f.prototype.destroy = function() {
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
  function y(_) {
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
        const o = _.querySelector("[autofocus]");
        if (o && Ut(o))
          o.focus();
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
  j(t, e, f, "ln-modal", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", l = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-ui-coordinator": {},
    "data-ln-ui-coordinator-dict": {}
  };
  function y(d) {
    const g = {};
    let a = d;
    const r = [];
    for (; a; ) {
      const h = a.closest("[" + t + "]");
      if (!h) break;
      h[e] && h[e].dict && r.unshift(h[e].dict), a = h.parentElement;
    }
    for (const h of r)
      Object.assign(g, h);
    return g;
  }
  function _(d, g) {
    if (g) {
      if (d) {
        const r = d.closest("[" + t + "]");
        if (r) {
          if (r.id === g && r.hasAttribute("data-ln-modal")) return r;
          const h = r.querySelector("#" + CSS.escape(g) + '[data-ln-modal], [data-ln-modal="' + g + '"]');
          if (h) return h;
        }
      }
      const a = document.getElementById(g) || document.querySelector('[data-ln-modal="' + g + '"]');
      if (a) return a;
    }
    if (d) {
      const a = d.closest("[" + t + "]");
      if (a) {
        if (a.hasAttribute("data-ln-modal")) return a;
        const h = a.querySelector("[data-ln-modal]");
        if (h) return h;
      }
      const r = d.closest("[data-ln-modal]");
      if (r) return r;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function i(d, g) {
    if (d !== "edit") return "";
    if (g) {
      const a = g.getAttribute("data-ln-fill-id");
      if (a) return a;
    }
    return "edit";
  }
  function s(d) {
    if (!d) return;
    const g = d.querySelectorAll("[data-ln-field]");
    for (let r = 0; r < g.length; r++)
      g[r].textContent = "";
    const a = d.querySelectorAll("form");
    for (let r = 0; r < a.length; r++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(a[r], null) : a[r].reset();
  }
  document.addEventListener("click", function(d) {
    if (d.ctrlKey || d.metaKey || d.button === 1) return;
    const g = d.target.closest("[data-ln-modal-for]");
    if (g) {
      const r = g.getAttribute("data-ln-modal-for"), h = _(g, r);
      if (h && h.lnModal) {
        d.preventDefault();
        const b = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, m = g.dataset;
        for (const k in m) {
          if (!k.startsWith("lnModal") || b[k]) continue;
          const D = k.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = m[k]);
        }
        const E = Object.keys(T).length > 0;
        g.hasAttribute("data-ln-modal-mode") ? h.dataset.lnModalMode = g.getAttribute("data-ln-modal-mode") : h.dataset.lnModalMode = E ? "edit" : "new", E && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(h, T) : h.dataset.lnModalMode === "new" && s(h), h.getAttribute("data-ln-modal") === "open" ? q(h, "ln-modal:request-close", {}) : (h.id && dt(h.id, i(h.dataset.lnModalMode, g)), q(h, "ln-modal:request-open", {}));
      }
      return;
    }
    const a = d.target.closest('a[href^="#"]');
    if (a) {
      const r = ae(a.getAttribute("href"));
      for (const h in r) {
        const b = document.getElementById(h);
        if (b && b.lnModal) {
          if (!ke(d)) return;
          dt(h, r[h]);
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
    let a = ot(g.id);
    a === null && (a = i(g.dataset.lnModalMode, null), dt(g.id, a)), a ? (g.dataset.lnModalMode = "edit", q(g, "ln-fill:request", { id: a })) : (g.dataset.lnModalMode = "new", s(g));
  });
  let c = !1;
  function n() {
    if (!c) {
      c = !0;
      try {
        const d = document.querySelectorAll("[data-ln-modal][id]");
        for (let g = 0; g < d.length; g++) {
          const a = d[g];
          if (!a.lnModal) continue;
          const r = a.id, h = ot(r), b = h !== null, T = a.lnModal.isOpen;
          if (b) {
            const m = h ? "edit" : "new";
            a.dataset.lnModalMode = m, T ? h ? q(a, "ln-fill:request", { id: h }) : s(a) : q(a, "ln-modal:request-open", {});
          } else T && q(a, "ln-modal:request-close", {});
        }
      } finally {
        c = !1;
      }
    }
  }
  function o() {
    const d = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let g = 0; g < d.length; g++) {
      const a = d[g];
      a.lnModal && ot(a.id) === null && dt(a.id, i(a.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function p() {
    o(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(p);
  }) : mt(p);
  function u(d) {
    const a = (d.detail || {}).data;
    if (a && a.message) {
      const h = a.message;
      q(window, "ln-toast:enqueue", {
        type: h.type || "success",
        title: h.title || "",
        message: h.body || ""
      });
    }
    const r = d.target.closest("[data-ln-modal]");
    r && r.lnModal && (r.id && dt(r.id, null), q(r, "ln-modal:request-close", {}), s(r));
  }
  function w(d) {
    const g = d.detail || {}, a = g.data, r = g.status || 0, h = y(d.target);
    if (a && a.message) {
      const b = a.message;
      q(window, "ln-toast:enqueue", {
        type: b.type || "error",
        title: b.title || "",
        message: b.body || ""
      });
    } else r === 0 ? q(window, "ln-toast:enqueue", {
      type: "error",
      title: h["network-error-title"] || "",
      message: h["network-error"] || "Network error"
    }) : q(window, "ln-toast:enqueue", {
      type: "error",
      title: h["server-error-title"] || "",
      message: h["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", u), document.addEventListener("ln-ajax:error", w);
  function v(d) {
    const g = d.detail || {}, a = y(d.target), r = g.message || (g.reason === "max-size" ? a["upload-max-size"] || "File is too large" : g.reason === "max-files" ? a["upload-max-files"] || "Maximum file count exceeded" : a["upload-invalid-type"] || "This file type is not allowed"), h = a["upload-invalid-title"] || "Invalid File";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: h,
      message: r
    });
  }
  function S(d) {
    const g = d.detail || {}, a = y(d.target), r = g.message || a["upload-failed"] || "Failed to upload file", h = a["upload-error-title"] || "Upload Error";
    q(window, "ln-toast:enqueue", {
      type: "error",
      title: h,
      message: r
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", S), document.addEventListener("ln-modal:close", function(d) {
    const g = d.target;
    !g || !g.lnModal || (g.id && ot(g.id) !== null && dt(g.id, null), g.dataset.lnModalMode === "new" && s(g));
  });
  function A(d) {
    return this.dom = d, this.dict = re(d, l), this;
  }
  A.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, A, "ln-ui-coordinator", {
    attributes: f
  });
})();
function xr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let l = e, f = 0;
  for (let y = 0; y < t.length && l > 0; y++)
    f = y + 1, /[0-9]/.test(t[y]) && l--;
  return l > 0 && (f = t.length), f;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function l(i) {
    const s = i[e];
    s && (s.isTextElement ? s._initTextElement() : isNaN(s.value) || s._displayFormatted(s.value));
  }
  const f = {
    "data-ln-number": { effect: l },
    "data-ln-value": { effect: l },
    "data-ln-number-decimals": { effect: l },
    "data-ln-number-min": { effect: l },
    "data-ln-number-max": { effect: l }
  }, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
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
        return y.get.call(c);
      },
      set: function(o) {
        if (y.set.call(c, o), o !== "" && !isNaN(parseFloat(o))) {
          const p = s.dom.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ct(parseFloat(o), rt(s.dom), { maxDecimals: p }));
        } else
          s._setDisplayRaw("");
        s.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), cn(i, y, {
      get: function() {
        return y.get.call(i);
      },
      set: function(o) {
        if (o === "") {
          s._setDisplayRaw(""), s._setHiddenRaw(""), i.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const p = typeof o == "number" ? o : parseFloat(String(o));
        if (isNaN(p))
          s._setDisplayRaw(String(o)), s._setHiddenRaw("");
        else {
          s._setHiddenRaw(p);
          const u = i.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ct(p, rt(i), { maxDecimals: u }));
        }
        i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      s._handleInput();
    }, i.addEventListener("input", this._onInput), this._onKeyDown = function(o) {
      if (o.key !== "Backspace") return;
      const p = i.selectionStart, u = i.selectionEnd;
      if (p !== u || p === 0) return;
      const w = te(rt(i)), v = y.get.call(i), S = v[p - 1];
      if (S === w.groupSep || /\s/.test(S)) {
        o.preventDefault();
        const A = p - 2 >= 0 ? p - 2 : 0, d = v.slice(0, A) + v.slice(p);
        y.set.call(i, d), i.setSelectionRange(A, A), i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, i.addEventListener("keydown", this._onKeyDown), this._onPaste = function(o) {
      o.preventDefault();
      const p = (o.clipboardData || window.clipboardData).getData("text"), u = _r(p, rt(i));
      s.value = isNaN(u) ? NaN : u;
    }, i.addEventListener("paste", this._onPaste);
    const n = i.value;
    if (n !== "") {
      const o = parseFloat(n);
      if (!isNaN(o)) {
        const p = i.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(o), this._setDisplayRaw(ct(o, rt(i), { maxDecimals: p })), i.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  _.prototype._initTextElement = function() {
    const i = this.dom;
    let s = i.getAttribute("data-ln-value"), c = i.getAttribute("data-ln-number"), n = null;
    s !== null && s !== "" ? n = s : c !== null && c !== "" && c !== "true" ? n = c : n = i.textContent.trim();
    const o = parseFloat(n);
    isNaN(o) ? this._rawValue = null : (this._rawValue = o, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", String(o)), this._formatTextContent());
  }, _.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const i = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, rt(this.dom), { maxDecimals: i });
    }
  }, _.prototype._handleInput = function() {
    const i = this.dom, s = y.get.call(i);
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
    for (let h = 0; h < c; h++)
      /[0-9]/.test(s[h]) && n++;
    const o = rt(i), p = te(o);
    let u = s, w = An(s, p.groupSep, p.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), q(i, "ln-number:input", { value: NaN, formatted: s });
      return;
    }
    const S = i.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (S !== null && A !== -1) {
      const h = parseInt(S, 10), b = w.slice(A + 1);
      if (h === 0)
        w = w.slice(0, A), u = u.split(p.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(u);
      else if (b.length > h) {
        w = w.slice(0, A + 1 + h);
        const T = u.split(p.decimalSep);
        u = T[0] + p.decimalSep + T[1].slice(0, h), v = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const d = i.getAttribute("data-ln-number-max");
    if (d !== null && v > parseFloat(d)) {
      const h = parseFloat(d), b = ct(h, o, { maxDecimals: S });
      this._setDisplayRaw(b), this._setHiddenRaw(h), i.setSelectionRange(b.length, b.length), q(i, "ln-number:input", { value: h, formatted: b });
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
    let a;
    if (S !== null)
      a = ct(v, o, { maxDecimals: S });
    else {
      const h = g !== -1 ? w.slice(g + 1).length : 0;
      a = ct(v, o, { userDecimals: h });
    }
    this._setDisplayRaw(a);
    const r = xr(a, n);
    i.setSelectionRange(r, r), this._setHiddenRaw(v), q(i, "ln-number:input", { value: v, formatted: a });
  }, _.prototype._setHiddenRaw = function(i) {
    this._hidden && y.set.call(this._hidden, String(i));
  }, _.prototype._setDisplayRaw = function(i) {
    this.isTextElement ? this.dom.textContent = String(i) : y.set.call(this.dom, String(i));
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
      const i = y.get.call(this._hidden);
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
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), _.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), q(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, _, "ln-number", {
    attributes: f,
    extraAttributes: ["lang"],
    onAttributeChange: l
  });
})();
const Ae = /^(short|medium|long)(\s+datetime)?$/, Ir = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Dr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ae) ? Ir[t.trim()] : null;
}
function Wt(t) {
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
  const y = [];
  for (let n = 0; n < 3; n++) {
    const o = parseInt(f[n], 10);
    if (isNaN(o)) return null;
    y.push(o);
  }
  let _, i, s;
  l === "." ? (_ = y[0], i = y[1], s = y[2]) : l === "/" ? (i = y[0], _ = y[1], s = y[2]) : f[0].length === 4 ? (s = y[0], i = y[1], _ = y[2]) : (_ = y[0], i = y[1], s = y[2]), s < 100 && (s += s < 50 ? 2e3 : 1900);
  const c = new Date(s, i - 1, _);
  return c.getFullYear() !== s || c.getMonth() !== i - 1 || c.getDate() !== _ ? null : c;
}
function pe(t, e, l, f) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const y = t.getDate(), _ = t.getMonth(), i = t.getFullYear(), s = t.getHours(), c = t.getMinutes();
  let n, o;
  const p = (l || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const S = new Intl.DateTimeFormat(l, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(f && S !== p);
  } catch {
    u = !!f;
  }
  if (u && f && f.monthsLong)
    n = f.monthsLong[_];
  else
    try {
      n = new Intl.DateTimeFormat(l, { month: "long" }).format(t);
    } catch {
      n = String(_ + 1);
    }
  if (u && f && f.monthsShort)
    o = f.monthsShort[_];
  else
    try {
      o = new Intl.DateTimeFormat(l, { month: "short" }).format(t);
    } catch {
      o = String(_ + 1);
    }
  const w = {
    yyyy: String(i),
    yy: String(i).slice(-2),
    MMMM: n,
    MMM: o,
    MM: String(_ + 1).padStart(2, "0"),
    M: String(_ + 1),
    dd: String(y).padStart(2, "0"),
    d: String(y),
    HH: String(s).padStart(2, "0"),
    mm: String(c).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, l, f) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const y = Dr(e);
  if (y)
    try {
      const _ = new Intl.DateTimeFormat(l, y), i = (l || "").toLowerCase().split("-")[0], s = _.resolvedOptions().locale.toLowerCase().split("-")[0];
      return f && s !== i ? pe(t, "dd.MM.yyyy", l, f) : _.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", l, f);
    }
  return pe(t, e || "dd.MM.yyyy", l, f);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function l(n) {
    const o = n[e];
    if (o) {
      if (o.isTextElement)
        o._initTextElement();
      else if (o.value) {
        const p = at(o.value);
        p && o._displayFormatted(p);
      }
    }
  }
  const f = {
    "data-ln-date": { effect: l },
    "data-ln-date-format": { effect: l },
    "data-ln-date-locale": { effect: l },
    "data-ln-value": { effect: l },
    "data-ln-date-dict": {},
    "data-ln-date-dict-key": {},
    "data-ln-date-field": {},
    "data-ln-date-label": {}
  }, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n, o, p) {
    q(n.dom, "ln-date:change", {
      value: o,
      formatted: n.dom.value,
      date: p
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function i(n, o, p, u) {
    n._setHiddenRaw(o), y.set.call(n._picker, o), n._lastISO = o, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : p && n._displayFormatted(p), _(n, o, p);
  }
  function s(n) {
    n._setHiddenRaw(""), y.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", _(n, "", null);
  }
  function c(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const g = at(o.value);
        g && o._displayFormatted(g);
      }
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const g = w.querySelectorAll("[data-ln-date-dict]");
      for (let a = 0; a < g.length; a++) {
        const r = g[a].getAttribute("data-ln-date-dict");
        if (r) {
          const h = re(g[a], "data-ln-date-dict-key");
          h["months-long"] && (h.monthsLong = h["months-long"].split(",").map((b) => b.trim())), h["months-short"] && (h.monthsShort = h["months-short"].split(",").map((b) => b.trim())), qe(r, h);
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
        return y.get.call(S);
      },
      set: function(g) {
        if (y.set.call(S, g), g && g !== "") {
          const a = at(g);
          a && i(o, g, a);
        } else g === "" && s(o);
      }
    }), cn(n, y, {
      get: function() {
        return y.get.call(n);
      },
      set: function(g, a) {
        if (o._isFormatting) {
          a(g);
          return;
        }
        if (!g || g === "") {
          a(""), s(o);
          return;
        }
        const r = at(g) || Wt(g);
        if (r) {
          const h = Ft(r), b = n.getAttribute(t) || "", T = rt(n), m = kt(T), E = Gt(r, b, T, m);
          a(E), i(o, h, r, E);
        } else
          a(String(g)), s(o);
      }
    }), this._onPickerChange = function() {
      const g = A.value;
      if (g) {
        const a = at(g);
        a && i(o, g, a);
      } else
        s(o);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const g = o.dom.value.trim();
      if (g === "") {
        o._lastISO !== "" && s(o);
        return;
      }
      if (o._lastISO) {
        const r = at(o._lastISO);
        if (r) {
          const h = o.dom.getAttribute(t) || "", b = rt(o.dom), T = kt(b);
          if (g === Gt(r, h, b, T)) return;
        }
      }
      const a = Wt(g);
      if (a) {
        const r = Ft(a);
        i(o, r, a);
      } else if (o._lastISO) {
        const r = at(o._lastISO);
        r && o._displayFormatted(r);
      } else
        o.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, d.addEventListener("click", this._onBtnClick), p && p !== "") {
      const g = at(p);
      g && i(o, p, g);
    }
    return this;
  }
  c.prototype._initTextElement = function() {
    const n = this.dom, o = n.getAttribute("data-ln-value"), p = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    o !== null && o !== "" ? w = o : u !== null && u !== "" ? w = u : p !== null && p !== "" && p !== "true" && !Ae.test(p) ? w = p : w = n.textContent.trim();
    const v = at(w) || Wt(w);
    if (v && !isNaN(v.getTime())) {
      const S = Ft(v);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, c.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = at(this._rawValue);
      if (n) {
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Ae.test(v) && (p = v);
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
    y.set.call(this._hidden, n);
  }, c.prototype._displayFormatted = function(n) {
    const o = this.dom.getAttribute(t) || "", p = rt(this.dom), u = kt(p);
    this._isFormatting = !0, this.dom.value = Gt(n, o, p, u), this._isFormatting = !1;
  }, Object.defineProperty(c.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const p = at(n) || Wt(n);
        if (!p) return;
        const u = Ft(p);
        this._rawValue = u, this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        s(this);
        return;
      }
      const o = at(n);
      o && i(this, n, o);
    }
  }), Object.defineProperty(c.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? at(n) : null;
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
    attributes: f,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: l
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-nav": { effect: i },
    "data-ln-nav-exact": { prop: "exact", read: Kt, effect: i }
  }, f = et(l);
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
  function y(s) {
    return this.dom = s, tt(this, s, f), this.activeClass = s.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(s, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, o = _(n), p = [];
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
      const v = _(w), S = v === o, A = !this.exact && v !== "/" && o.startsWith(v + "/");
      S || A ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), p.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    q(this.dom, "ln-nav:update", { target: this.dom, activeLinks: p });
  }, y.prototype.destroy = function() {
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
        const o = n.activeClass, p = s.getAttribute(t) || "active";
        if (o !== p) {
          const u = s.querySelectorAll("a");
          for (const w of u)
            o && w.classList.remove(o);
          n.activeClass = p;
        }
      }
      n.update();
    }
  }
  j(t, e, y, "ln-nav", {
    attributes: l
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
  let l = null;
  function f() {
    if (l !== null) return l;
    try {
      if (typeof localStorage > "u") return l = !1;
      const i = "__ln_persist_test__";
      return localStorage.setItem(i, i), localStorage.removeItem(i), l = !0;
    } catch {
      return l = !1;
    }
  }
  const y = /* @__PURE__ */ new Set();
  function _(i, s) {
    const c = window.lnCore && window.lnCore._attrRegistry, n = c && c.persist || [];
    let o = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === s) {
        o = n[v];
        break;
      }
    if (!o) return;
    const p = o.persist;
    if (y.has(p.attr) || (y.add(p.attr), Vt([p.attr], function(v, S) {
      if (!v.hasAttribute("data-ln-persist") || p.hashActive && p.hashActive(v)) return;
      const A = e(v, S);
      if (!A || !f()) return;
      const d = v.getAttribute(S);
      try {
        d === null ? localStorage.removeItem(A) : localStorage.setItem(A, d);
      } catch {
      }
    })), p.hashActive && p.hashActive(i)) return;
    const u = e(i, p.attr);
    if (!u || !f()) return;
    const w = localStorage.getItem(u);
    w !== null && i.setAttribute(p.attr, w);
  }
  ir(_);
})();
function Ke(t, e, l, f) {
  const y = (t || "").toLowerCase().trim();
  if (y) return y;
  if ((e || "").toUpperCase() !== "A") return "";
  const _ = l || "";
  if (!_.startsWith("#")) return "";
  const i = _.slice(1);
  if (!i) return "";
  const s = i.split("&"), c = (f || "").toLowerCase().trim();
  if (c)
    for (const p of s) {
      const u = p.indexOf(":");
      if (u > 0 && p.slice(0, u).toLowerCase().trim() === c)
        return p.slice(u + 1).toLowerCase().trim();
    }
  const n = s[s.length - 1] || "", o = n.indexOf(":");
  return (o > 0 ? n.slice(o + 1) : n).toLowerCase().trim();
}
function je(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const l = t.filter(
    (_) => (_.tagName || "").toUpperCase() === "A" && (_.href || "").startsWith("#")
  ), f = l.length > 0 && l.length === t.length, y = (e || "").toLowerCase().trim();
  return l.length > 0 && l.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : f && !y ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: f && !!y,
    warning: null
  };
}
function Ve(t, e, l) {
  const f = (t || "").toLowerCase().trim();
  return f && Array.isArray(e) && e.includes(f) ? f : (l || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function l(n) {
    const o = n.getAttribute("data-ln-tabs-active");
    n[e] && n[e]._applyActive(o);
  }
  function f(n, o) {
    return (n.getAttribute(o) || n.id || "").toLowerCase().trim();
  }
  function y(n, o) {
    return (n.getAttribute(o) || "true").toLowerCase() !== "false";
  }
  const _ = {
    "data-ln-tabs": {},
    "data-ln-tabs-active": { effect: l },
    "data-ln-tabs-default": {},
    "data-ln-tabs-focus": { prop: "autoFocus", read: y },
    "data-ln-tabs-key": { prop: "nsKey", read: f },
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
    })), o = je(n, this.nsKey);
    this.hashEnabled = o.hashEnabled, o.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : o.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const u of this.tabs) {
      const w = Ke(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), this.nsKey);
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
        const A = Ke(u.getAttribute("data-ln-tab"), u.tagName, u.getAttribute("href"), p.nsKey);
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
      const u = Ve(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", u);
    }
  }
  s.prototype.select = function(n) {
    const o = (n + "").toLowerCase().trim();
    o && (this.hashEnabled ? ot(this.nsKey) === o ? this.dom.setAttribute("data-ln-tabs-active", o) : dt(this.nsKey, o) : this.dom.setAttribute("data-ln-tabs-active", o));
  }, s.prototype._applyActive = function(n) {
    var p;
    if (n = Ve(n, Object.keys(this.mapPanels), this.defaultKey), n === this.activeKey) return;
    const o = this.activeKey;
    if (o !== null && Z(this.dom, "ln-tabs:before-change", {
      key: n,
      previousKey: o,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    }).defaultPrevented) {
      o in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", o), this.hashEnabled && ot(this.nsKey) !== o && dt(this.nsKey, o));
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
      previousKey: o,
      tab: this.mapTabs[n],
      panel: this.mapPanels[n],
      target: this.dom
    });
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: n, handler: o } of this._clickHandlers)
        n.removeEventListener("click", o), delete n[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), q(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[e];
    }
  }, j(t, e, s, "ln-tabs", {
    attributes: _,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(n) {
        const o = Array.from(n.querySelectorAll("[data-ln-tab]")).map(function(u) {
          return { tagName: u.tagName, href: u.getAttribute("href") };
        }), p = (n.getAttribute("data-ln-tabs-key") || n.id || "").toLowerCase().trim();
        return je(o, p).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", l = "data-ln-toggle-for", f = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const y = {
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
      if (on(w)) return;
      const v = w.target.closest("[" + l + "]");
      if (!v || an(v)) return;
      const S = v.getAttribute(l);
      if (!S) return;
      const A = document.getElementById(S);
      if (!A || !A[e]) return;
      w.preventDefault();
      const d = v.getAttribute(f) || "toggle", g = A.getAttribute(t);
      A.setAttribute(t, s(g, d));
    }, document.addEventListener("click", i));
  }
  function n() {
    _.size > 0 || !i || (document.removeEventListener("click", i), i = null);
  }
  function o(w, v) {
    if (!w || !w.id) return;
    const S = document.querySelectorAll(
      "[" + l + '="' + w.id + '"]'
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
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), o(w, this.isOpen), _.add(this), c(), this;
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
        v.isOpen = !0, w.classList.add("open"), o(w, !0), q(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), o(w, !1), q(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, p, "ln-toggle", {
    attributes: y,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-accordion": {}
  };
  function f(y) {
    return this.dom = y, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== y) return;
      const i = y.querySelectorAll("[data-ln-toggle]");
      for (const s of i)
        s !== _.detail.target && s.closest("[data-ln-accordion]") === y && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      q(y, "ln-accordion:change", { target: _.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), q(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[e]);
  }, j(t, e, f, "ln-accordion", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", l = "bottom-end";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-dropdown": {},
    "data-ln-dropdown-position": { prop: "position", read: Q, fallback: l },
    "data-ln-dropdown-placement": {},
    "data-ln-dropdown-menu": {}
  }, y = et(f);
  function _(i) {
    this.dom = i, tt(this, i, y), this.toggleEl = i.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = i.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
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
      const o = s._getMenuItems();
      if (o.length === 0) return;
      if (!n && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = s._getMenuItems();
          u.length > 0 && s._focusItem(u, c.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const p = o.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const u = p < o.length - 1 ? p + 1 : 0;
        s._focusItem(o, u);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const u = p > 0 ? p - 1 : o.length - 1;
        s._focusItem(o, u);
      } else c.key === "Home" ? (c.preventDefault(), s._focusItem(o, 0)) : c.key === "End" && (c.preventDefault(), s._focusItem(o, o.length - 1));
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
    const i = this.triggerBtn.getBoundingClientRect(), s = ye(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || l, o = Zt(i, s, n, c);
    this.toggleEl.style.top = o.top + "px", this.toggleEl.style.left = o.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", o.placement);
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
    attributes: f
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", l = "data-ln-popover-for", f = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const y = {
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
    const w = ye(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(f) || "bottom", a = Zt(d, w, g, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
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
      const d = A.trigger.getBoundingClientRect(), g = ye(A.dom), a = A.dom.getAttribute(f) || "bottom", r = Zt(d, g, a, 8);
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
  function o(u) {
    this.dom = u;
    const w = u.getAttribute(l);
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
  o.prototype.destroy = function() {
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
    attributes: y
  }), j(l, e + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", l = "data-ln-tooltip-position", f = "lnTooltipEnhance", y = "ln-tooltip-portal";
  if (window[f] !== void 0) return;
  const _ = {
    "data-ln-tooltip-enhance": {},
    "data-ln-tooltip-enhanced": {},
    "data-ln-tooltip": {},
    "data-ln-tooltip-position": {},
    "data-ln-tooltip-placement": {}
  };
  let i = 0, s = null, c = null, n = null, o = null, p = null, u = null;
  function w() {
    return s && s.parentNode || (s = document.getElementById(y), s || (s = document.createElement("div"), s.id = y, document.body.appendChild(s)), s.hasAttribute("popover") || s.setAttribute("popover", "manual")), s;
  }
  function v() {
    u || (u = function(a) {
      a.key === "Escape" && d();
    }, document.addEventListener("keydown", u));
  }
  function S() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function A(a) {
    if (n === a) return;
    d();
    const r = a.getAttribute(e) || a.getAttribute("title");
    if (!r) return;
    w(), typeof s.showPopover == "function" && s.showPopover(), a.hasAttribute("title") && (o = a.getAttribute("title"), a.removeAttribute("title"));
    const h = a.getAttribute("aria-describedby");
    h ? p = h : p = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = r, a[f + "Uid"] || (i += 1, a[f + "Uid"] = "ln-tooltip-" + i), b.id = a[f + "Uid"], s.appendChild(b);
    const T = b.offsetWidth, m = b.offsetHeight, E = a.getBoundingClientRect(), C = a.getAttribute(l) || "top", k = Zt(E, { width: T, height: m }, C, 6);
    b.style.top = k.top + "px", b.style.left = k.left + "px", b.setAttribute("data-ln-tooltip-placement", k.placement), p ? a.setAttribute("aria-describedby", p + " " + b.id) : a.setAttribute("aria-describedby", b.id), c = b, n = a, v();
  }
  function d() {
    if (!c) {
      S();
      return;
    }
    n && (p !== null ? n.setAttribute("aria-describedby", p) : n.removeAttribute("aria-describedby"), p = null, o !== null && n.setAttribute("title", o)), o = null, c.parentNode && c.parentNode.removeChild(c), c = null, n = null, s && typeof s.hidePopover == "function" && s.matches(":popover-open") && s.hidePopover(), S();
  }
  function g(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(a);
    }, this._onLeave = function() {
      n === a && !a.contains(document.activeElement) && d();
    }, this._onFocus = function() {
      A(a);
    }, this._onBlur = function() {
      n === a && !a.matches(":hover") && d();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), n === a && d(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[f], delete a[f + "Uid"], q(a, "ln-tooltip:destroyed", { trigger: a });
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    f,
    g,
    "ln-tooltip",
    {
      attributes: _
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", l = "ln-toast-item";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-toast": {},
    "data-ln-toast-timeout": { prop: "timeoutDefault", read: Dt, fallback: 6e3 },
    "data-ln-toast-max": { prop: "max", read: Dt, fallback: 5 },
    "data-ln-toast-close": {},
    "data-ln-toast-item": {}
  }, y = et(f);
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
    this.dom = A, tt(this, A, y);
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
    o(this, d), g > 0 && (d._timer = setTimeout(() => p(d), g));
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
    const g = ((A.type || "") + "").trim().toLowerCase(), a = Tt(d, l, "ln-toast");
    if (!a)
      return console.warn('[ln-toast] Template "' + l + '" not found'), null;
    pt(a, {
      type: g,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const r = a.firstElementChild;
    if (!r) return null;
    r.hasAttribute("data-ln-toast-item") || r.setAttribute("data-ln-toast-item", ""), r.classList.add("ln-enter");
    const h = r.querySelector(".body");
    h && n(h, A);
    const b = r.querySelector("[data-ln-toast-close]");
    return b && b.addEventListener("click", function() {
      p(r);
    }), r;
  }
  function n(A, d) {
    if (Array.isArray(d.message)) {
      const g = document.createElement("ul");
      for (const a of d.message) {
        const r = document.createElement("li");
        r.textContent = a, g.appendChild(r);
      }
      A.appendChild(g);
    }
    if (d.data && d.data.errors) {
      const g = document.createElement("ul");
      for (const a of Object.values(d.data.errors).flat()) {
        const r = document.createElement("li");
        r.textContent = a, g.appendChild(r);
      }
      A.appendChild(g);
    }
  }
  function o(A, d) {
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
    const a = +(A.getAttribute("data-ln-toast-timeout") ?? d.timeoutDefault);
    a > 0 && (A._timer = setTimeout(function() {
      p(A);
    }, a));
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
      for (const a of Array.from(g))
        (a[e] || (a[e] = new s(a))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", S), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "]");
      for (const d of Array.from(A))
        d.querySelectorAll("[data-ln-toast-item]").length > 0 && _(d);
    });
  }, "ln-toast"), j(t, e, s, "ln-toast", {
    attributes: f
  });
})();
function Rr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((l) => l.trim().toLowerCase()).filter(Boolean).map((l) => l.startsWith(".") ? l.slice(1) : l);
  return e.length ? e : null;
}
function Pn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function Or(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const l = Pn(t.name), f = String(t.type || "").toLowerCase();
  return e.some((y) => {
    if (y.includes("/")) {
      if (y.endsWith("/*")) {
        const _ = y.slice(0, -1);
        return f.startsWith(_);
      }
      return f === y;
    }
    return l === y;
  });
}
function Mr(t, e = "en", l = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (l["unit-b"] || "B");
  const f = 1024, y = [
    l["unit-b"] || "B",
    l["unit-kb"] || "KB",
    l["unit-mb"] || "MB",
    l["unit-gb"] || "GB"
  ], _ = Math.floor(Math.log(t) / Math.log(f)), i = Math.min(_, y.length - 1), s = t / Math.pow(f, i);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(s) + " " + y[i];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", l = "file", f = "file_ids[]";
  if (window[e] !== void 0) return;
  const y = {
    "data-ln-upload": { prop: "uploadUrl", read: Q, fallback: "" },
    "data-ln-upload-accept": {},
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: Q, fallback: "" },
    "data-ln-upload-max-size": { prop: "maxSize", read: Dt, fallback: 0 },
    "data-ln-upload-max-files": { prop: "maxFiles", read: Dt, fallback: 0 },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: Q, fallback: l },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: Q, fallback: f },
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
  }, _ = et(y);
  function i(n, o, p) {
    return Mr(n, o, p);
  }
  function s() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function c(n) {
    this.dom = n, tt(this, n, _), this.dict = re(n, "data-ln-upload-dict"), this.locale = rt(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const o = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = Rr(o), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  c.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const o = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < o.length; u++) {
      const w = o[u], v = w.getAttribute("data-ln-upload-id"), S = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", S);
      const A = w.querySelector('[data-ln-field="name"]'), d = w.querySelector('[data-ln-field="sizeText"]'), g = w.getAttribute("data-ln-upload-size"), a = g ? parseInt(g, 10) : null;
      n.uploadedFiles.set(S, {
        serverId: v || null,
        name: A ? A.textContent.trim() : "",
        size: a !== null && !isNaN(a) ? a : d ? d.textContent.trim() : ""
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
    const n = this, o = this.dom.querySelectorAll('input[type="hidden"]');
    for (let p = 0; p < o.length; p++)
      o[p].name === n.idsFieldName && o[p].remove();
    for (const [, p] of this.uploadedFiles)
      if (p.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = p.serverId, n.dom.appendChild(u);
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
      const p = o.target.closest('[data-ln-upload-action="remove"]');
      if (!p || !n.list || !n.list.contains(p) || p.disabled) return;
      const u = p.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(o) {
      o.detail && o.detail.files && n.upload(o.detail.files);
    }, this._onRequestRemove = function(o) {
      if (o.detail) {
        const p = o.detail.localId !== void 0 ? o.detail.localId : o.detail.serverId;
        p !== void 0 && n.remove(p);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, c.prototype.upload = function(n) {
    const o = this, p = Array.from(n);
    for (let u = 0; u < p.length; u++) {
      const w = p[u];
      if (o.maxFiles > 0 && o.uploadedFiles.size >= o.maxFiles) {
        q(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!Or(w, o.allowedExts)) {
        q(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (o.maxSize > 0 && w.size > o.maxSize) {
        q(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(o.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || o._uploadSingleFile(w);
    }
  }, c.prototype._uploadSingleFile = function(n) {
    const o = this, p = "file-" + ++o.fileIdCounter, u = Pn(n.name);
    let w = null;
    if (this.list) {
      const g = Tt(this.dom, "ln-upload-item", "ln-upload");
      if (g && (w = g.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", p), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: o.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const a = w.querySelector('[data-ln-upload-action="remove"]');
        a && (a.disabled = !0);
        const r = w.querySelector("[data-ln-progress]");
        r && r.setAttribute("data-ln-progress", "0"), o.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(o.fileFieldName, n);
    const S = this.dom.querySelectorAll("input, select, textarea");
    for (let g = 0; g < S.length; g++) {
      const a = S[g];
      !a.name || a.name === o.idsFieldName || a.type === "file" || (a.type === "checkbox" || a.type === "radio") && !a.checked || v.append(a.name, a.value);
    }
    const A = new XMLHttpRequest();
    o.uploadedFiles.set(p, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(g) {
      if (g.lengthComputable) {
        const a = Math.round(g.loaded / g.total * 100);
        if (w) {
          const r = w.querySelector("[data-ln-progress]");
          r && r.setAttribute("data-ln-progress", String(a)), pt(w, { sizeText: a + "%" });
        }
        q(o.dom, "ln-upload:progress", {
          localId: p,
          file: n,
          percent: a,
          loaded: g.loaded,
          total: g.total
        });
      }
    }), A.addEventListener("load", function() {
      const g = o.uploadedFiles.get(p);
      if (g && delete g.xhr, A.status >= 200 && A.status < 300) {
        let a;
        try {
          a = JSON.parse(A.responseText);
        } catch (h) {
          d(o.dict.error || "Error", A.status, h);
          return;
        }
        const r = a.id || a.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), r && w.setAttribute("data-ln-upload-id", String(r)), pt(w, {
            sizeText: i(a.size || n.size, o.locale, o.dict),
            uploading: !1
          });
          const h = w.querySelector('[data-ln-upload-action="remove"]');
          h && (h.disabled = !1);
        }
        g && (g.serverId = r, g.size = a.size || n.size, g.name = a.name || n.name), o._syncHiddenInputs(), q(o.dom, "ln-upload:uploaded", {
          localId: p,
          serverId: r,
          name: a.name || n.name,
          size: a.size || n.size,
          response: a
        });
      } else {
        let a = "";
        try {
          a = JSON.parse(A.responseText).message || "";
        } catch {
        }
        d(a, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const g = o.uploadedFiles.get(p);
      g && delete g.xhr, d("", 0, null);
    });
    function d(g, a, r) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: o.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const h = w.querySelector('[data-ln-upload-action="remove"]');
        h && (h.disabled = !1);
      }
      q(o.dom, "ln-upload:error", {
        file: n,
        message: g,
        status: a,
        error: r
      });
    }
    o.uploadUrl ? (A.open("POST", o.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", s()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, c.prototype.remove = function(n) {
    const o = this;
    let p = null, u = null;
    if (o.uploadedFiles.has(n))
      p = n, u = o.uploadedFiles.get(n);
    else
      for (const [A, d] of o.uploadedFiles)
        if (String(d.serverId) === String(n)) {
          p = A, u = d;
          break;
        }
    if (!p || !u || Z(o.dom, "ln-upload:before-remove", {
      localId: p,
      serverId: u.serverId
    }).defaultPrevented) return;
    const v = o.list ? o.list.querySelector('[data-ln-upload-local-id="' + p + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      v && v.remove(), o.uploadedFiles.delete(p), o._syncHiddenInputs(), q(o.dom, "ln-upload:removed", { localId: p, serverId: null });
      return;
    }
    let S = null;
    if (o.deleteUrlPattern ? S = o.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : o.uploadUrl && o.uploadUrl.includes("{id}") && (S = o.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !S) {
      v && v.remove(), o.uploadedFiles.delete(p), o._syncHiddenInputs(), q(o.dom, "ln-upload:removed", { localId: p, serverId: u.serverId });
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
      A.ok ? (v && v.remove(), o.uploadedFiles.delete(p), o._syncHiddenInputs(), q(o.dom, "ln-upload:removed", {
        localId: p,
        serverId: u.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(o.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), q(o.dom, "ln-upload:error", {
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
    attributes: y
  });
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function l(s) {
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
  function f(s) {
    s = s || document.body;
    for (const c of s.querySelectorAll("a, area"))
      l(c);
  }
  function y() {
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
            for (const o of n.addedNodes)
              if (o.nodeType === 1 && (o.matches && (o.matches("a") || o.matches("area")) && l(o), o.querySelectorAll))
                for (const p of o.querySelectorAll("a, area"))
                  l(p);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Vt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && l(c);
      });
    }, "ln-external-links");
  }
  function i() {
    y(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      f();
    }) : f();
  }
  window[t] = {
    process: f
  }, i();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let l = null;
  function f() {
    l = document.createElement("div"), l.className = "ln-link-status", document.body.appendChild(l);
  }
  function y(d) {
    l && (l.textContent = d, l.classList.add("ln-link-status--visible"));
  }
  function _() {
    l && l.classList.remove("ln-link-status--visible");
  }
  function i(d, g) {
    if (g.target.closest("a, button, input, select, textarea")) return;
    const a = d.querySelector("a");
    if (!a) return;
    const r = a.getAttribute("href");
    if (!r) return;
    if (g.ctrlKey || g.metaKey || g.button === 1) {
      window.open(r, "_blank", "noopener,noreferrer");
      return;
    }
    Z(d, "ln-link:navigate", { target: d, href: r, link: a }).defaultPrevented || a.click();
  }
  function s(d) {
    const g = d.querySelector("a");
    if (!g) return;
    const a = g.getAttribute("href");
    a && y(a);
  }
  function c() {
    _();
  }
  function n(d) {
    d[e + "Row"] || !d.querySelector("a") || (d[e + "Row"] = !0, d._lnLinkClick = function(a) {
      i(d, a);
    }, d._lnLinkEnter = function() {
      s(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", c));
  }
  function o(d) {
    d[e + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", c), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[e + "Row"]);
  }
  function p(d) {
    if (!d[e + "Init"]) return;
    const g = d.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const a = g === "TABLE" && d.querySelector("tbody") || d;
      for (const r of a.querySelectorAll("tr"))
        o(r);
    } else
      o(d);
    delete d[e + "Init"];
  }
  function u(d) {
    if (d[e + "Init"]) return;
    d[e + "Init"] = !0;
    const g = d.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const a = g === "TABLE" && d.querySelector("tbody") || d;
      for (const r of a.querySelectorAll("tr"))
        n(r);
    } else
      n(d);
  }
  function w(d) {
    d.hasAttribute && d.hasAttribute(t) && u(d);
    const g = d.querySelectorAll ? d.querySelectorAll("[" + t + "]") : [];
    for (const a of g)
      u(a);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(g) {
        for (const a of g)
          if (a.type === "childList") {
            for (const r of a.addedNodes)
              if (r.nodeType === 1) {
                w(r);
                const h = r.closest("[" + t + "]");
                if (h)
                  if (r.tagName === "TR")
                    n(r);
                  else {
                    const b = h.tagName;
                    if (b === "TABLE" || b === "TBODY") {
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
    f(), v(), S(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
})();
const Ht = ["Ctrl", "Alt", "Shift", "Meta"], Nr = {
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
function Bn(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const l = Nr[e.toLowerCase()];
  return l || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function Hn(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const l = e.split("+"), f = /* @__PURE__ */ new Set();
  let y = "";
  for (let i = 0; i < l.length; i++) {
    const s = Bn(l[i]);
    if (!s) return "";
    if (Ht.indexOf(s) !== -1) {
      f.add(s);
      continue;
    }
    if (y) return "";
    y = s;
  }
  if (!y) return "";
  const _ = [];
  for (let i = 0; i < Ht.length; i++)
    f.has(Ht[i]) && _.push(Ht[i]);
  return _.push(y), _.join("+");
}
function Fr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const l = e.split(/[\s,]+/), f = [];
  for (let y = 0; y < l.length; y++) {
    const _ = Hn(l[y]);
    _ && f.indexOf(_) === -1 && f.push(_);
  }
  return f;
}
function Pr(t, e) {
  const l = String(e || "").trim();
  if (!l || /[\s,]/.test(l)) return "";
  const f = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(f) ? "" : Hn(f ? f + "+" + l : l);
}
function Br(t) {
  if (!t) return "";
  const e = Bn(t.key);
  if (!e || Ht.indexOf(e) !== -1) return "";
  const l = [];
  return t.ctrlKey && l.push("Ctrl"), t.altKey && l.push("Alt"), t.shiftKey && l.push("Shift"), t.metaKey && l.push("Meta"), l.push(e), l.join("+");
}
function Hr(t) {
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
function Ur(t, e, l, f) {
  if (!t || !e || l !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const y = String(e.tagName || "").toLowerCase();
  return y === "button" ? f === "Enter" || f === "Space" : y === "a" && e.hasAttribute && e.hasAttribute("href") && f === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", l = "data-ln-key-target", f = "data-ln-key-allow-input", y = "data-ln-key-modifier", _ = "data-ln-key-for", i = "lnKeyFor";
  if (window[e] !== void 0) return;
  function s(g) {
    const a = g[e];
    if (a) {
      if (!g.hasAttribute(t)) {
        a.destroy();
        return;
      }
      a.sync();
    }
  }
  function c(g) {
    const a = g[i];
    a && !g.hasAttribute(_) && a.destroy();
  }
  const n = {
    "data-ln-key": { effect: s },
    "data-ln-key-target": { effect: s },
    "data-ln-key-allow-input": { effect: s }
  }, o = {
    "data-ln-key-for": { effect: c },
    "data-ln-key-modifier": {}
  }, p = /* @__PURE__ */ new Set();
  let u = null;
  function w() {
    u || (u = function(g) {
      if (g.defaultPrevented || g.isComposing || g.repeat) return;
      const a = Br(g);
      if (!a) return;
      const r = sr(g.target), h = document.querySelectorAll("[" + t + "], [" + _ + "]");
      let b = null, T = !1, m = !1;
      for (let k = 0; k < h.length; k++) {
        const D = h[k], I = D[e] || D[i];
        if (!I || !I.matches(a) || r && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = Hr(R);
        if (!(!O || !lr(R, O))) {
          if (Ur(g, R, O, a)) {
            m = !0;
            continue;
          }
          b ? T = !0 : b = { host: D, target: R, action: O };
        }
      }
      if (m || !b) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + a + '"; first DOM match wins.');
      const E = {
        source: b.host,
        target: b.target,
        action: b.action,
        key: a,
        event: g
      };
      Z(b.host, "ln-key:before-trigger", E).defaultPrevented || (g.preventDefault(), b.target[b.action](), q(b.host, "ln-key:trigger", E));
    }, document.addEventListener("keydown", u));
  }
  function v() {
    p.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function S(g) {
    return this.dom = g, this.shortcuts = [], p.add(this), this.sync(), w(), this;
  }
  S.prototype.sync = function() {
    this.shortcuts = Fr(this.dom.getAttribute(t));
  }, S.prototype.matches = function(g) {
    return this.shortcuts.indexOf(g) !== -1;
  }, S.prototype.allowsInput = function() {
    return this.dom.hasAttribute(f);
  }, S.prototype.resolveTarget = function() {
    const g = this.dom.getAttribute(l);
    return g ? d(g, l) : this.dom;
  }, S.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), delete this.dom[e], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function A(g) {
    return this.dom = g, p.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + y + "]");
  }, A.prototype.shortcut = function() {
    const g = this._modifierContext(), a = g ? g.getAttribute(y) : "";
    return Pr(a, this.dom.textContent);
  }, A.prototype.matches = function(g) {
    return this.shortcut() === g;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(f)) return !0;
    const g = this._modifierContext();
    return !!(g && g.hasAttribute(f));
  }, A.prototype.resolveTarget = function() {
    return d(this.dom.getAttribute(_), _);
  }, A.prototype.destroy = function() {
    this.dom[i] && (p.delete(this), delete this.dom[i], v(), q(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function d(g, a) {
    if (!g) return null;
    try {
      const r = document.querySelector(g);
      return r || console.warn("[ln-key] Target not found for " + a + ' selector "' + g + '".'), r;
    } catch {
      return console.warn("[ln-key] Invalid " + a + ' selector "' + g + '".'), null;
    }
  }
  j(t, e, S, "ln-key", {
    attributes: n
  }), j(_, i, A, "ln-key-for", {
    attributes: o
  });
})();
function zr(t, e, l = 100) {
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
  function l(s) {
    const c = s[e];
    c && i.call(c);
  }
  const f = {
    "data-ln-progress": { effect: l },
    "data-ln-progress-max": { effect: l }
  };
  function y(s) {
    return this.dom = s, this._parentObserver = null, i.call(this), _.call(this), this;
  }
  y.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function _() {
    const s = this, c = this.dom.parentElement;
    if (!c) return;
    const n = new MutationObserver(function(o) {
      for (const p of o)
        p.attributeName === "data-ln-progress-max" && i.call(s);
    });
    n.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function i() {
    const s = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, n = c ? c.getAttribute("data-ln-progress-max") : null, o = this.dom.getAttribute("data-ln-progress-max"), p = zr(o, n, 100), u = En(s, p);
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
    y,
    "ln-progress",
    {
      attributes: f
    }
  );
})();
function Kr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let l = 0; l < t.length; l++)
    if (t[l] !== e[l]) return !0;
  return !1;
}
function jr(t, e, l) {
  if (!e || typeof e != "object") return !0;
  const f = Object.keys(e);
  if (f.length === 0) return !0;
  for (let y = 0; y < f.length; y++) {
    const _ = e[f[y]];
    let i = "";
    if (_.col !== null && _.col !== void 0 ? i = t[_.col] || "" : _.attr && l && typeof l.getAttribute == "function" && (i = l.getAttribute(_.attr) || ""), !xe(i, _.values))
      return !1;
  }
  return !0;
}
function We(t, e, l, f) {
  if (f != null && !isNaN(f))
    return parseInt(f, 10);
  if (e && typeof e.getAttribute == "function") {
    const y = e.getAttribute("data-ln-filter-col");
    if (y !== null && !isNaN(parseInt(y, 10)))
      return parseInt(y, 10);
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
  if (t && l && typeof t.querySelectorAll == "function") {
    const y = t.querySelectorAll("thead th, tr:first-child th"), _ = String(l).trim().toLowerCase();
    for (let i = 0; i < y.length; i++) {
      const s = y[i], c = s.getAttribute("data-ln-table-filter-col") || s.getAttribute("data-ln-filter-col") || s.getAttribute("data-ln-filter-key") || s.getAttribute("data-ln-table-col") || s.getAttribute("data-ln-col") || s.getAttribute("data-ln-field");
      if (c && c.trim().toLowerCase() === _)
        return typeof s.cellIndex == "number" ? s.cellIndex : i;
    }
    if (e) {
      const i = e.closest ? e.closest("[data-ln-popover], [id]") : null, s = i && i.id || e.id || null;
      if (s)
        for (let c = 0; c < y.length; c++) {
          const n = y[c];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + s + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : c;
        }
    }
    for (let i = 0; i < y.length; i++) {
      const s = y[i], n = Array.from(s.childNodes || []).filter((p) => p.nodeType === 3), o = (n.length > 0 ? n.map((p) => p.textContent.trim()).join(" ") : s.textContent || "").trim().toLowerCase();
      if (o && o === _)
        return typeof s.cellIndex == "number" ? s.cellIndex : i;
    }
  }
  return null;
}
function Vr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const l = [];
  for (let f = 0; f < t.length; f++) {
    const y = t[f];
    !e && y.key && (e = y.key), y.checked && !y.isReset && y.value && l.push(y.value);
  }
  return { key: e, values: l };
}
function Wr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Ge(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", l = "data-ln-filter-key", f = "data-ln-filter-value", y = "data-ln-filter-hide", _ = "data-ln-filter-reset", i = "data-ln-filter-col", s = "data-ln-hash", c = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-filter": { prop: "targetId", read: Q, fallback: null },
    "data-ln-hash": { effect: g },
    "data-ln-filter-values": { effect: g },
    "data-ln-filter-col": {},
    "data-ln-filter-key": {},
    "data-ln-filter-reset": {},
    "data-ln-filter-value": {},
    "data-ln-filter-hide": {}
  }, p = et(o);
  function u(a) {
    return a.hasAttribute(_) || !a.getAttribute(f);
  }
  function w(a) {
    const r = a.dom.querySelectorAll("[" + l + "]"), h = [];
    for (let T = 0; T < r.length; T++) {
      const m = r[T];
      h.push({
        key: m.getAttribute(l),
        value: m.getAttribute(f) || "",
        checked: m.checked,
        isReset: u(m)
      });
    }
    const b = Vr(h);
    return { key: b.key, values: b.values, targetId: a.targetId };
  }
  function v(a, r, h) {
    const b = a.querySelectorAll("[" + l + "]"), T = Array.isArray(h) && h.length > 0;
    for (let m = 0; m < b.length; m++) {
      const E = b[m];
      u(E) ? E.checked = !T : T && E.getAttribute(l) === r && h.indexOf(E.getAttribute(f)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function S(a) {
    this.dom = a, tt(this, a, p);
    const r = a.getAttribute(i);
    this.colIndex = r !== null ? parseInt(r, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(a, "filter"), this.hashEnabled = !!this.nsKey;
    const h = this, b = oe(function() {
      h._render();
    });
    this._queueRender = b, this._attachHandlers(), this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const m = ot(h.nsKey), E = be(m);
      E && E.key && E.values.length > 0 ? v(h.dom, E.key, E.values) : v(h.dom, null, []), h._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const m = ot(this.nsKey), E = be(m);
      E && E.key && E.values.length > 0 && (v(a, E.key, E.values), mt(function() {
        h._destroyed || h._render();
      }), T = !0);
    }
    if (!T) {
      const m = Ge(a.getAttribute(c));
      if (m.length > 0) {
        const E = a.querySelector("[" + l + "]"), C = E ? E.getAttribute(l) : null;
        C && (v(a, C, m), mt(function() {
          h._destroyed || h._render();
        }), T = !0);
      }
    }
    if (!T) {
      const m = a.querySelectorAll("[" + l + "]");
      for (let E = 0; E < m.length; E++)
        if (m[E].checked && !u(m[E])) {
          mt(function() {
            h._destroyed || h._render();
          });
          break;
        }
    }
    return this;
  }
  S.prototype._attachHandlers = function() {
    const a = this;
    this._onDomChange = function(r) {
      const h = r.target;
      if (!h || !h.hasAttribute || !h.hasAttribute(l)) return;
      const b = Array.from(a.dom.querySelectorAll("[" + l + "]"));
      if (u(h)) {
        for (let T = 0; T < b.length; T++)
          u(b[T]) || (b[T].checked = !1);
        h.checked = !0, a._queueRender();
        return;
      }
      if (h.checked) {
        for (let m = 0; m < b.length; m++)
          u(b[m]) && (b[m].checked = !1);
        let T = !1;
        for (let m = 0; m < b.length; m++)
          if (u(b[m])) {
            T = !0;
            break;
          }
        if (T) {
          let m = !0;
          for (let E = 0; E < b.length; E++)
            if (!u(b[E]) && !b[E].checked) {
              m = !1;
              break;
            }
          if (m)
            for (let E = 0; E < b.length; E++)
              u(b[E]) ? b[E].checked = !0 : b[E].checked = !1;
        }
      } else {
        let T = !1;
        for (let m = 0; m < b.length; m++)
          if (!u(b[m]) && b[m].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let m = 0; m < b.length; m++)
            u(b[m]) && (b[m].checked = !0);
      }
      a._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, S.prototype._render = function() {
    const a = this, r = w(this), h = this._lastSnapshot;
    if (!(!h || h.key !== r.key || Kr(h.values, r.values))) return;
    const T = r.key === null || r.values.length === 0, m = document.getElementById(a.targetId), E = {
      key: r.key,
      values: r.values.slice(),
      targetId: a.targetId
    };
    q(a.dom, "ln-filter:change", E);
    let C = !1;
    m && m !== a.dom && Z(m, "ln-filter:change", E).defaultPrevented && (C = !0);
    const k = h && h.values.length > 0, D = r.values.length === 0;
    if (k && D) {
      const O = { targetId: a.targetId };
      q(a.dom, "ln-filter:reset", O), m && m !== a.dom && q(m, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: r.key, values: r.values.slice() };
    const I = Wr(r.values);
    if (I ? this.dom.setAttribute(c, I) : this.dom.removeAttribute(c), this.hashEnabled) {
      const O = wn(r.key, r.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = m && (m.tagName === "TABLE" ? m : m.querySelector ? m.querySelector("table") : null);
    if (R)
      a._filterTableRows(r, R);
    else {
      if (!m) return;
      const O = m.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(y), T) continue;
        const U = B.getAttribute("data-" + r.key);
        U !== null && (xe(U, r.values) || B.setAttribute(y, "true"));
      }
    }
  };
  function A(a) {
    if (!a) return "";
    const r = a.querySelector ? a.querySelector("[data-ln-value]") : null;
    return vt(r || a);
  }
  function d(a) {
    return !!(!a || typeof a != "object" || a.tagName === "TEMPLATE" || typeof a.hasAttribute == "function" && (a.hasAttribute("data-ln-sort-exclude") || a.hasAttribute("hidden")) || a.classList && a.classList.contains("hidden") || a.style && a.style.display === "none" || typeof a.matches == "function" && a.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof a.querySelector == "function" && a.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  S.prototype._filterTableRows = function(a, r) {
    if (!r) {
      const C = document.getElementById(this.targetId);
      if (!C || (r = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !r)) return;
    }
    const h = We(r, this.dom, a.key, this.colIndex), b = a.key || this.dom.getAttribute("data-ln-filter-key") || (h !== null ? "col" + h : "attr-filter"), T = a.values;
    n.has(r) || n.set(r, {});
    const m = n.get(r);
    b && T.length > 0 ? m[b] = {
      col: h,
      values: T.slice(),
      attr: "data-" + b
    } : b && delete m[b];
    const E = r.tBodies;
    for (let C = 0; C < E.length; C++) {
      const k = E[C].rows;
      for (let D = 0; D < k.length; D++) {
        const I = k[D];
        if (d(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        jr(R, m, I) ? I.removeAttribute(y) : I.setAttribute(y, "true");
      }
    }
  }, S.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const a = document.getElementById(this.targetId);
    if (a) {
      const r = a.tagName === "TABLE" ? a : a.querySelector ? a.querySelector("table") : null;
      if (r && n.has(r)) {
        const h = n.get(r), b = We(r, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (b !== null ? "col" + b : this.colIndex !== null ? "col" + this.colIndex : null);
        T && h[T] && (delete h[T], this._filterTableRows({ key: null, values: [] }, r)), Object.keys(h).length === 0 && n.delete(r);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function g(a, r) {
    const h = a[e];
    if (!(!h || h._destroyed)) {
      if (r === s)
        h.hashEnabled && h._onHashChange && window.removeEventListener("hashchange", h._onHashChange), h.nsKey = wt(a, "filter"), h.hashEnabled = !!h.nsKey, h.hashEnabled && window.addEventListener("hashchange", h._onHashChange);
      else if (r === c) {
        const b = Ge(a.getAttribute(c)), T = a.querySelector("[" + l + "]"), m = T ? T.getAttribute(l) : null;
        m && (v(a, m, b), h._render());
      }
    }
  }
  j(t, e, S, "ln-filter", {
    attributes: o,
    persist: {
      attr: c,
      hashActive: function(a) {
        return !!wt(a, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", l = "data-ln-search-for", f = "lnSearchControl", y = "data-ln-search-items", _ = "data-ln-search-fields", i = "data-ln-search-exclude", s = "data-ln-search-hide", c = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { effect: a },
    "data-ln-hash": { effect: a },
    "data-ln-search-for": { prop: "targetId", read: Q, fallback: null },
    "data-ln-search-fields": {},
    "data-ln-search-items": {},
    "data-ln-search-exclude": {},
    "data-ln-search-hide": {},
    "data-ln-search-clear-for": {}
  }, o = et(n);
  function p(r) {
    const h = wt(r, "search");
    if (h) return h;
    if (r.id) {
      const b = document.querySelector("[" + l + '="' + r.id + '"]');
      if (b) {
        const T = wt(b, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(r) {
    return r.matches("input, textarea") ? r : r.querySelector("input, textarea");
  }
  function w(r, h) {
    const b = r.childNodes;
    for (let T = 0; T < b.length; T++) {
      const m = b[T];
      if (m.nodeType === 3) {
        h.push(m.nodeValue);
        continue;
      }
      m.nodeType === 1 && (m.hasAttribute(i) || w(m, h));
    }
  }
  function v(r) {
    if (r._lnSearchText !== void 0) return r._lnSearchText;
    const h = [];
    w(r, h);
    const b = yr(h);
    return r._lnSearchText = b, b;
  }
  function S(r, h) {
    if (!r.id) return;
    const b = document.querySelectorAll("[" + l + '="' + r.id + '"]');
    for (const T of b) {
      const m = u(T);
      m && m.value !== h && (m.value = h);
    }
  }
  function A(r) {
    this.dom = r, this.term = r.getAttribute(t) || "", this._destroyed = !1;
    const h = this;
    return this.nsKey = p(r), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const b = ot(h.nsKey), T = h.dom.getAttribute(t) || "";
      b !== null && b !== T ? h.dom.setAttribute(t, b) : b === null && T !== "" && h.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!h._destroyed) {
        if (h.hashEnabled) {
          const b = ot(h.nsKey);
          if (b !== null && b !== h.term) {
            h.term = b, h.dom.setAttribute(t, b), S(h.dom, b), h._apply();
            return;
          }
        }
        ve(h.term) && (S(h.dom, h.term), h._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const r = this.dom, h = ve(this.term), b = Sn(h);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = br(r.getAttribute(_));
    if (Z(r, "ln-search:change", {
      term: h,
      tokens: b,
      targetId: r.id,
      fields: T
    }).defaultPrevented) return;
    const E = r.getAttribute(y), C = E ? r.querySelectorAll(E) : r.children;
    for (let k = 0; k < C.length; k++) {
      const D = C[k];
      if (D.removeAttribute(s), D.hasAttribute(i) || b.length === 0) continue;
      const I = v(D);
      Cn(I, b) || D.setAttribute(s, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function d(r) {
    if (this.dom = r, tt(this, r, o), this.input = u(r), this._attachHandler(), this.input && this.input.value.trim()) {
      const h = this;
      mt(function() {
        const b = document.getElementById(h.targetId);
        b && ((b.getAttribute(t) || "").trim() || h._write(h.input.value));
      });
    }
    return this;
  }
  d.prototype._write = function(r) {
    const h = document.getElementById(this.targetId);
    h && h.getAttribute(t) !== r && h.setAttribute(t, r);
  }, d.prototype._attachHandler = function() {
    if (!this.input) return;
    const r = this;
    this._onInput = function() {
      r._write(r.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, d.prototype.destroy = function() {
    this.dom[f] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[f]);
  };
  function g(r) {
    const h = r.getAttribute("data-ln-search-clear-for");
    if (h) {
      const C = document.getElementById(h), k = document.querySelector("[" + l + '="' + h + '"]'), D = k ? u(k) : null;
      return { target: C, input: D };
    }
    const b = r.closest("[" + t + "]");
    if (b) {
      const C = b.id ? document.querySelector("[" + l + '="' + b.id + '"]') : null, k = C ? u(C) : null;
      return { target: b, input: k };
    }
    const T = r.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), k = C ? document.getElementById(C) : null;
      if (k && k.hasAttribute(t)) {
        const D = document.querySelector("[" + l + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: k, input: I };
      }
    }
    const m = r.closest("[" + l + "]");
    if (m) {
      const C = m.getAttribute(l), k = C ? document.getElementById(C) : null, D = u(m);
      return { target: k, input: D };
    }
    const E = r.parentElement;
    if (E) {
      const C = E.querySelector("[" + l + "]");
      if (C) {
        const k = C.getAttribute(l), D = k ? document.getElementById(k) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(r) {
    const h = r.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!h) return;
    const b = g(h);
    !b.target && !b.input || (r.preventDefault(), b.input && (b.input.value = "", b.input.focus()), b.target && b.target.setAttribute(t, ""));
  });
  function a(r, h) {
    const b = r[e];
    if (!b || b._destroyed) return;
    if (h === c) {
      b._onHashChange && window.removeEventListener("hashchange", b._onHashChange), b.nsKey = p(r), b.hashEnabled = !!b.nsKey, b.hashEnabled && window.addEventListener("hashchange", b._onHashChange);
      return;
    }
    const T = r.getAttribute(t) || "";
    T !== b.term && (b.term = T, S(r, T), b._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(r, h) {
      const b = h.target;
      b && b._lnSearchText !== void 0 && delete b._lnSearchText, b && b.parentElement && b.parentElement._lnSearchText !== void 0 && delete b.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(r) {
        return !!p(r);
      }
    }
  }), j(l, f, d, "ln-search-control");
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Gr(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Qr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function $r(t, e, l, f) {
  const y = St(t);
  if (y === "none") return () => 0;
  const _ = y === "desc" ? -1 : 1, i = typeof f == "function" ? f : (s) => s;
  return function(s, c) {
    const n = i(s), o = i(c);
    return Le(n, o, e, l) * _;
  };
}
function me(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Yr(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const l = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (l && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(l));
  if (t.tagName === "TABLE") {
    const f = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (f)
      return Array.from(f.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", l = "data-ln-sort-field", f = "data-ln-sort-state", y = "data-ln-sort-dir", _ = "data-ln-hash";
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
  function o(w, v, S) {
    if (v) {
      const A = w.querySelector('[data-ln-field="' + v + '"]');
      return A ? vt(A) : "";
    }
    return S != null && w.cells && w.cells[S] ? vt(w.cells[S]) : vt(w);
  }
  function p(w) {
    this.dom = w, tt(this, w, c);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(f)), w.hasAttribute(f) || w.setAttribute(f, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const S = this;
    this._onClick = function(d) {
      const g = d.target.closest("[" + y + "]");
      if (!g) return;
      const a = St(g.getAttribute(y));
      S._apply(a);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(d) {
      if (S._destroyed || !d.detail) return;
      const g = S._resolveTarget();
      if (!(g && (d.target === g || g.contains(d.target)) || d.detail.targetId && d.detail.targetId === S.targetId)) return;
      if (Qr(
        { field: S.field, column: S.column },
        { field: d.detail.field, column: d.detail.column }
      )) {
        const h = St(d.detail.direction);
        h && w.getAttribute(f) !== h && (S._state = h, w.setAttribute(f, h), S._updateAriaSort(h));
        return;
      }
      w.getAttribute(f) !== "none" && (S._state = "none", w.setAttribute(f, "none"), S._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const d = ot(S.nsKey), g = _e(d);
      if (g)
        S.field !== null && g.fieldOrColumn === S.field || S.column !== null && String(S.column) === g.fieldOrColumn ? S._state !== g.direction && S._apply(g.direction, !0) : S._state !== "none" && (S._state = "none", w.setAttribute(f, "none"), S._updateAriaSort("none"));
      else if (S._state !== "none") {
        S._state = "none", w.setAttribute(f, "none"), S._updateAriaSort("none");
        const a = S._resolveTarget();
        a && (Z(a, "ln-sort:change", {
          field: S.field,
          column: S.column,
          direction: "none",
          targetId: S.targetId
        }).defaultPrevented || S._defaultSort(a, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const d = ot(this.nsKey), g = _e(d);
      g && ((S.field !== null && g.fieldOrColumn === S.field || S.column !== null && String(S.column) === g.fieldOrColumn) && mt(function() {
        S._destroyed || S._apply(g.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const d = St(w.getAttribute(f));
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
    v && v.setAttribute("aria-sort", Gr(w));
  }, p.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const a = this.dom.closest("th");
      a && a.cellIndex !== void 0 && (this.column = a.cellIndex);
    }
    const S = St(w);
    this._state = S, this.dom.getAttribute(f) !== S && this.dom.setAttribute(f, S), this._updateAriaSort(S);
    const A = this._resolveTarget();
    if (!A) return;
    const d = {
      field: this.field,
      column: this.column,
      direction: S,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const a = vn(this.field !== null ? this.field : this.column, S);
      dt(this.nsKey, a);
    }
    Z(A, "ln-sort:change", d).defaultPrevented || this._defaultSort(A, S);
  }, p.prototype._defaultSort = function(w, v) {
    const S = Yr(w, this.itemsSelector);
    if (!S.length) return;
    const A = S[0].parentNode, d = S.filter(function(h) {
      return !me(h);
    });
    if (!d.length) return;
    n.has(w) || n.set(w, d.slice());
    let g;
    if (v === "none") {
      const h = n.get(w) || d;
      n.delete(w), g = h.filter(function(b) {
        return b.parentNode === A && !me(b);
      });
    } else {
      const h = this.field, b = this.column, T = d.map(function(k) {
        return o(k, h, b);
      }), m = Te(T), E = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = $r(v, m, E, function(k) {
        return o(k, h, b);
      });
      g = d.slice().sort(C);
    }
    const a = document.createDocumentFragment();
    let r = 0;
    for (let h = 0; h < S.length; h++) {
      const b = S[h];
      me(b) ? a.appendChild(b) : r < g.length && a.appendChild(g[r++]);
    }
    A.appendChild(a);
  }, p.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, v) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (v === l) {
        const A = w.closest("th");
        S.column = !S.field && A ? A.cellIndex : null;
      } else if (v === f) {
        const A = St(w.getAttribute(f));
        A !== S._state && S._apply(A);
      } else v === _ && (S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = wt(w, "sort"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange));
  }
  j(t, e, p, "ln-sort", {
    attributes: s,
    persist: {
      attr: f,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function Qe(t, e, l, f, y = 15) {
  if (f <= 0 || l <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const _ = Math.max(0, t || 0), i = Math.max(0, e || 0), s = Math.floor(_ / l), c = Math.ceil(i / l), n = Math.max(0, s - y), o = Math.min(f, s + c + y), p = n * l, u = Math.max(0, (f - o) * l);
  return { start: n, end: o, topPadding: p, bottomPadding: u };
}
function Xr(t, e) {
  const l = Array.isArray(t) ? t.length : 0, f = e instanceof Set ? e : new Set(e || []);
  let y = 0;
  if (Array.isArray(t))
    for (let s = 0; s < t.length; s++)
      f.has(t[s]) && y++;
  else
    y = f.size;
  const _ = l > 0 && y === l, i = y > 0 && y < l;
  return { totalCount: l, selectedCount: y, isAllSelected: _, isIndeterminate: i };
}
function $e(t, e, l) {
  const f = new Set(t);
  return e == null || ((l !== void 0 ? l : !f.has(e)) ? f.add(e) : f.delete(e)), f;
}
function Ye(t, e, l) {
  const f = new Set(t);
  if (!Array.isArray(e)) return f;
  if (l)
    for (let y = 0; y < e.length; y++)
      e[y] != null && f.add(e[y]);
  else
    for (let y = 0; y < e.length; y++)
      f.delete(e[y]);
  return f;
}
(function() {
  const t = "data-ln-table", e = "lnTable", l = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function c(d, g) {
    if (!d || !d.isDataDriven) return;
    const a = d.dom.hasAttribute("data-ln-table-window");
    if (a && !d._windowed)
      d._enterWindowedMode(), d._kickWindowInitial();
    else if (!a && d._windowed)
      d._exitWindowedMode();
    else if (a && d._windowed) {
      const r = parseInt(g, 10);
      r > 0 && d._cache.configure({ windowSize: r });
    }
  }
  function n(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const a = parseInt(g, 10);
    a > 0 && d._cache.configure({ pageSize: a });
  }
  function o(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const a = parseInt(g, 10);
    a >= 0 && d._cache.configure({ threshold: a });
  }
  function p(d, g) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const a = parseInt(g, 10);
    a >= 0 && d._cache.setGrandTotal(a);
  }
  const u = {
    "data-ln-table": { prop: "name", read: Q, fallback: "" },
    "data-ln-table-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-table-selectable": { prop: "_selectable", read: Kt },
    "data-ln-table-window": { effect: c },
    "data-ln-table-window-page": { effect: n },
    "data-ln-table-window-threshold": { effect: o },
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
    const a = this;
    return this._onSetSearch = function(r) {
      const h = (r.detail && r.detail.query != null ? r.detail.query : r.detail && r.detail.term != null ? r.detail.term : "").trim();
      a.isDataDriven ? (a.currentSearch = h, q(d, "ln-table:search", {
        table: a.name,
        query: a.currentSearch
      }), a._requestData()) : (a._searchTerm = h.toLowerCase(), a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), q(d, "ln-table:filter", {
        term: a._searchTerm,
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, d.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(r) {
      r.preventDefault(), a._onSetSearch(r);
    }, d.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      a.isDataDriven ? (a.currentFilters = {}, a.currentSearch = "", q(d, "ln-table:clear-filters", { table: a.name }), a._requestData()) : (a._searchTerm = "", a._columnFilters = {}, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), q(d, "ln-table:filter", {
        term: "",
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, d.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && d.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(r) {
      const h = r.detail || {}, b = h.data || [], T = h.total != null ? h.total : b.length;
      if (!(a._hasInitialSeed && !a.isLoaded && b.length === 0 && T === 0)) {
        if (a._windowed) {
          a._cache.ingest(h) && !h.provisional && d.classList.remove("ln-table--loading");
          return;
        }
        a._data = b, a._lastTotal = T, a._lastFiltered = h.filtered != null ? h.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, a._hasInitialSeed = !1, d.classList.remove("ln-table--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), q(d, "ln-table:rendered", {
          table: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }
    }, d.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
      const h = r.detail && r.detail.loading;
      d.classList.toggle("ln-table--loading", !!h), h && (a.isLoaded = !1);
    }, d.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(r) {
      !a._windowed || !a._cache || a._cache.release(r.detail && r.detail.offset);
    }, d.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !a._windowed || !a._cache || a._cache.revalidate();
    }, d.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !a._windowed || !a._cache || a._requestData();
    }, d.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(r) {
      r.preventDefault(), a.currentSort = r.detail.direction === "none" ? null : { field: r.detail.field, direction: r.detail.direction }, a._requestData();
    }, d.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(r) {
      if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const h = r.target.closest("[data-ln-table-row]");
      if (!h) return;
      const b = h.getAttribute("data-ln-table-row-id"), T = h._lnRecord || {};
      q(d, "ln-table:row-click", {
        table: a.name,
        id: b,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
      const h = r.target.closest("[data-ln-table-row-action]");
      if (!h) return;
      const b = h.closest("[data-ln-table-row]");
      if (!b) return;
      const T = h.getAttribute("data-ln-table-row-action"), m = b.getAttribute("data-ln-table-row-id"), E = b._lnRecord || {};
      q(d, "ln-table:row-action", {
        table: a.name,
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
      a.tbody.rows.length > 0 && (a._emptyTbodyObserver.disconnect(), a._emptyTbodyObserver = null, a._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(r) {
      r.preventDefault();
      const h = r.detail.direction === "none" ? null : r.detail.direction;
      a._sortCol = h === null ? -1 : r.detail.column, a._sortDir = h, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), q(d, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: a._filteredData.length,
        total: a._data.length
      });
    }, d.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(r) {
      if (r.preventDefault(), !r.detail) return;
      const h = r.detail.key, b = r.detail.values || [];
      if (h) {
        if (b.length === 0)
          delete a._columnFilters[h];
        else {
          const T = [];
          for (let m = 0; m < b.length; m++)
            T.push(b[m].toLowerCase());
          a._columnFilters[h] = T;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), q(d, "ln-table:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, d.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const d = this.tbody.rows, g = this.ths;
    this._data = [], d.length > 0 && (this._rowHeight = d[0].offsetHeight || 40), this._lockColumnWidths();
    for (let a = 0; a < d.length; a++) {
      const r = d[a], h = [], b = [], T = [];
      for (let E = 0; E < r.cells.length; E++) {
        const C = r.cells[E], k = C.textContent.trim();
        h[E] = vt(C), b[E] = k.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(k.toLowerCase());
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
        values: h,
        rawTexts: b,
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
      const a = document.createElement("col");
      a.style.width = g.offsetWidth + "px", d.appendChild(a);
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
      for (let a = 0; a < d.length; a++) {
        const r = this._buildRow(d[a]);
        if (!r) break;
        g.appendChild(r);
      }
      this.tbody.replaceChildren(g), this._selectable && this._updateSelectAll();
    } else {
      const d = [], g = this._filteredData;
      for (let a = 0; a < g.length; a++) d.push(g[a].html);
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
        let a = null;
        if (this._windowed) {
          const r = this._cache ? this._cache.peek() : null;
          a = r ? this._buildRow(r) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (a = this._buildRow(this._data[0]));
        a && this.tbody && (this.tbody.appendChild(a), this._rowHeight = a.offsetHeight || 40, a.remove());
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
    const d = this._filteredData, g = d.length, a = this._rowHeight;
    if (!a || !g) return;
    const r = this.thead ? this.thead.offsetHeight : 0, h = this._scrollContainer;
    let b, T;
    if (h) {
      const R = this.table.getBoundingClientRect(), O = h.getBoundingClientRect(), P = R.top - O.top + h.scrollTop + r;
      b = h.scrollTop - P, T = h.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + r;
      b = window.scrollY - P, T = window.innerHeight;
    }
    const m = Qe(b, T, a, g, 15), E = m.start, C = m.end;
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
    const g = this._cache.logicalTotal, a = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let h, b;
    if (r) {
      const R = this.table.getBoundingClientRect(), O = r.getBoundingClientRect(), P = R.top - O.top + r.scrollTop + a;
      h = r.scrollTop - P, b = r.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + a;
      h = window.scrollY - P, b = window.innerHeight;
    }
    const T = Qe(h, b, d, g, 15), m = T.start, E = T.end, C = this.ths.length || 1, k = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
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
    let g = null, a = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount === 0 && r > 0, T = b ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = Tt(this.dom, T, "ln-table"), !a) {
        const m = this.dom.querySelector("template[data-ln-table-empty]");
        if (m) {
          const E = b ? "search" : "initial", C = m.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || m.content.firstElementChild;
          C && (a = document.importNode(C, !0));
        }
      }
      if (a)
        if (a.tagName === "TR")
          g = a;
        else {
          const m = document.createElement("td");
          m.setAttribute("colspan", String(d)), m.appendChild(a);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(m), g = E;
        }
    } else {
      const r = this.dom.querySelector("template[" + l + "]"), h = document.createElement("td");
      h.setAttribute("colspan", String(d)), r && h.appendChild(document.importNode(r.content, !0));
      const b = document.createElement("tr");
      b.className = "ln-table__empty", b.appendChild(h), g = b;
    }
    g ? this.tbody.replaceChildren(g) : this.tbody.replaceChildren(), q(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(d, g) {
    jt(d, g);
    const a = d.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < a.length; r++) {
      const h = a[r], b = h.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < b.length; T++) {
        const m = b[T].trim().split(":");
        if (m.length !== 2) continue;
        const E = m[0].trim(), C = m[1].trim();
        g[E] != null && h.setAttribute(C, g[E]);
      }
    }
  }, A.prototype._buildRow = function(d) {
    let g = Tt(this.dom, this.name + "-row", "ln-table");
    if (!g) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (g = document.importNode(r.content, !0));
    }
    let a = g ? g.querySelector("[data-ln-table-row]") || g.firstElementChild : null;
    if (a)
      this._fillRow(a, d);
    else if (d && d.html) {
      const r = document.createElement("tbody");
      r.innerHTML = d.html, a = r.firstElementChild;
    } else {
      a = document.createElement("tr"), a.setAttribute("data-ln-table-row", "");
      const r = this.ths;
      for (let h = 0; h < r.length; h++) {
        const b = r[h].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (b) {
          const m = document.createElement("input");
          m.type = "checkbox", m.setAttribute("data-ln-table-row-select", ""), m.setAttribute("aria-label", "Select row"), T.appendChild(m);
        } else {
          const m = r[h].getAttribute("data-ln-table-col");
          m && d[m] != null && (T.textContent = String(d[m]));
        }
        a.appendChild(T);
      }
    }
    if (a._lnRecord = d, d.id != null && a.setAttribute("data-ln-table-row-id", d.id), this._selectable && d.id != null && this.selectedIds.has(String(d.id))) {
      a.classList.add("ln-row-selected");
      const r = a.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return a;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    rn(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const d = this, g = this.dom, a = parseInt(g.getAttribute("data-ln-table-window"), 10), r = parseInt(g.getAttribute("data-ln-table-window-page"), 10), h = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !d._windowed || !d._cache || (d.totalCount = d._cache.grandTotal, d.visibleCount = d._cache.logicalTotal, d._lastTotal = d._cache.grandTotal, d.isLoaded = !0, d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), q(g, "ln-table:rendered", {
        table: d.name,
        total: d.totalCount,
        visible: d.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = bn({
      windowSize: a > 0 ? a : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: h >= 0 ? h : 25,
      fetchDebounce: 120,
      requestPage: function(b, T, m) {
        q(g, "ln-table:request-data", {
          table: d.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
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
        const a = this._totalSpan.textContent.replace(/[^\d]/g, "");
        a && (d = parseInt(a, 10));
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
      const h = d[r].getAttribute("data-ln-table-row-id");
      h != null && g.push(h);
    }
    const a = Xr(g, this.selectedIds);
    this._selectAllCheckbox.checked = a.isAllSelected, this._selectAllCheckbox.indeterminate = a.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const d = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let g = 0; g < d.length; g++) {
      const a = d[g].getAttribute("data-ln-table-row-id"), r = a != null && this.selectedIds.has(a);
      d[g].classList.toggle("ln-row-selected", r);
      const h = d[g].querySelector("[data-ln-table-row-select]");
      h && (h.checked = r);
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
      const a = g.target.closest("[data-ln-table-row-select]");
      if (!a) return;
      const r = a.closest("[data-ln-table-row]");
      if (!r) return;
      const h = r.getAttribute("data-ln-table-row-id");
      h != null && (d.selectedIds = $e(d.selectedIds, h, a.checked), r.classList.toggle("ln-row-selected", a.checked), d.selectedCount = d.selectedIds.size, d._updateSelectAll(), d._updateFooter(), q(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const g = document.createElement("input");
      g.type = "checkbox";
      const a = d.dom.querySelector('[data-ln-table-dict="select-all"]'), r = d.dom.getAttribute("data-ln-table-select-all-label") || (a ? a.textContent.trim() : null) || "Select all";
      g.setAttribute("aria-label", r), this._selectAllCheckbox.appendChild(g), this._selectAllCheckbox = g;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = d._selectAllCheckbox.checked, a = d.tbody ? d.tbody.querySelectorAll("[data-ln-table-row]") : [], r = [];
      for (let h = 0; h < a.length; h++) {
        const b = a[h].getAttribute("data-ln-table-row-id"), T = a[h].querySelector("[data-ln-table-row-select]");
        b != null && (r.push(b), a[h].classList.toggle("ln-row-selected", g), T && (T.checked = g));
      }
      d.selectedIds = Ye(d.selectedIds, r, g), d.selectedCount = d.selectedIds.size, q(d.dom, "ln-table:select-all", {
        table: d.name,
        selected: g
      }), q(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }), d._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < g.length; a++) {
        const r = g[a].querySelector("[data-ln-table-row-select]"), h = g[a].getAttribute("data-ln-table-row-id");
        r && r.checked && h != null && (d.selectedIds = $e(d.selectedIds, h, !0), g[a].classList.add("ln-row-selected"));
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
    if (this._selectAllCheckbox = null, this.selectedIds = Ye(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < g.length; a++) {
        g[a].classList.remove("ln-row-selected");
        const r = g[a].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let d = 0, g = 0;
    this.isDataDriven ? (d = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (d = this._data.length, g = this._filteredData.length);
    const a = g < d;
    if (this._totalSpan && (this._totalSpan.textContent = v(d, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = a ? v(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !a), this._selectedSpan) {
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
  const l = {
    "data-ln-table-coordinator": {}
  };
  document.addEventListener("keydown", function(s) {
    if (s.key !== "/" || s.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const c = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!c) return;
    const n = c.tagName === "INPUT" || c.tagName === "TEXTAREA" ? c : c.querySelector('input[type="search"], input[type="text"], input');
    n && (s.preventDefault(), n.focus());
  });
  function f(s) {
    return this.dom = s, i(this), this;
  }
  function y(s, c) {
    const n = c ? '[data-ln-search-for="' + c + '"]' : "[data-ln-search-for]", o = s.querySelector(n) || document.querySelector(n);
    return o ? o.tagName === "INPUT" || o.tagName === "TEXTAREA" ? o : o.querySelector("input, textarea") : null;
  }
  function _(s, c) {
    if (c) {
      const o = s.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (o.length > 0) return o;
      const p = document.querySelectorAll('[data-ln-filter="' + c + '"]');
      if (p.length > 0) return p;
    }
    const n = s.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function i(s) {
    const c = s.dom;
    function n(o) {
      const p = o.target;
      if (p && p.hasAttribute && (p.hasAttribute("data-ln-table") || p.tagName === "TABLE")) return p;
      const u = o.detail && o.detail.targetId || p && p.id;
      return u ? c.querySelector('[data-ln-table-source="' + u + '"]') || c.querySelector('[data-ln-table="' + u + '"]') || c.querySelector("#" + u) || (c.id === u ? c : null) || document.getElementById(u) : null;
    }
    s._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const p = n(o);
        if (!p) return;
        const u = o.detail.key, w = o.detail.values || [], v = p.querySelectorAll("th");
        for (let S = 0; S < v.length; S++)
          if ((v[S].getAttribute("data-ln-table-filter-col") || v[S].getAttribute("data-ln-filter-col") || v[S].getAttribute("data-ln-filter-key") || v[S].getAttribute("data-ln-field")) === u) {
            const d = v[S].querySelector("[data-ln-table-col-filter], .table-filter");
            d && d.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const p = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!p) return;
        const u = p.closest("[data-ln-table], table") || c.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, v = u.querySelectorAll("th");
        for (let g = 0; g < v.length; g++) {
          const a = v[g].querySelector("[data-ln-table-col-filter], .table-filter");
          a && a.classList.remove("ln-filter-active");
        }
        const S = u.getAttribute("data-ln-table-source") || u.id, A = S ? document.getElementById(S) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const g = y(c, S);
          g && g.value !== "" && (g.value = "", g.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const d = _(c, S);
        for (let g = 0; g < d.length; g++) {
          const a = d[g].querySelector("[data-ln-filter-reset]");
          if (!a) continue;
          const r = d[g].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!a.checked || r) && (a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && q(u, "ln-table:request-clear-filters", { table: w });
      }
    }, c.addEventListener("ln-filter:change", s._handlers.filter), c.addEventListener("click", s._handlers.clear);
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, f, "ln-table-coordinator", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", l = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function c(r, h) {
    if (!r || !r.isDataDriven) return;
    const b = r.dom.hasAttribute("data-ln-list-window");
    if (b && !r._windowed)
      r._enterWindowedMode(), r._kickWindowInitial();
    else if (!b && r._windowed)
      r._exitWindowedMode();
    else if (b && r._windowed) {
      const T = parseInt(h, 10);
      T > 0 && r._cache.configure({ windowSize: T });
    }
  }
  function n(r, h) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const b = parseInt(h, 10);
    b > 0 && r._cache.configure({ pageSize: b });
  }
  function o(r, h) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const b = parseInt(h, 10);
    b >= 0 && r._cache.configure({ threshold: b });
  }
  function p(r, h) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const b = parseInt(h, 10);
    b >= 0 && r._cache.setGrandTotal(b);
  }
  const u = {
    "data-ln-list": { prop: "name", read: Q, fallback: "" },
    "data-ln-list-source": { prop: "source", read: Q, fallback: "" },
    "data-ln-list-selectable": { prop: "_selectable", read: Kt },
    "data-ln-list-window": { effect: c },
    "data-ln-list-window-page": { effect: n },
    "data-ln-list-window-threshold": { effect: o },
    "data-ln-list-count": { effect: p },
    "data-ln-list-empty": {},
    "data-ln-list-field": {}
  }, w = et(u);
  function v(r, h) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(rt(h)).format(r);
    } catch {
      return String(r);
    }
  }
  function S(r) {
    let h = r;
    for (; h && h !== document.body && h !== document.documentElement; ) {
      const T = getComputedStyle(h).overflowY;
      if (T === "auto" || T === "scroll") return h;
      h = h.parentElement;
    }
    return null;
  }
  function A(r) {
    const h = r._scrollContainer || S(r.dom);
    return {
      container: h,
      top: h ? h.scrollTop : window.scrollY
    };
  }
  function d(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function g(r) {
    if (!r) return 0;
    const h = getComputedStyle(r), b = parseFloat(h.marginTop) || 0, T = parseFloat(h.marginBottom) || 0;
    return r.offsetHeight + b + T;
  }
  function a(r) {
    this.dom = r, tt(this, r, w), this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const h = this;
    return this._onSetSearch = function(b) {
      const T = (b.detail && b.detail.query != null ? b.detail.query : b.detail && b.detail.term != null ? b.detail.term : "").trim();
      h.isDataDriven ? (h.currentSearch = T, q(r, "ln-list:search", {
        list: h.name,
        query: h.currentSearch
      }), h._requestData()) : (h._searchTerm = T.toLowerCase(), h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), q(r, "ln-list:filter", {
        term: h._searchTerm,
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, r.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(b) {
      b.preventDefault(), h._onSetSearch(b);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      h.isDataDriven ? (h.currentFilters = {}, h.currentSearch = "", q(r, "ln-list:clear-filters", { list: h.name }), h._requestData()) : (h._searchTerm = "", h._filters = {}, h._sortField = null, h._sortDir = null, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), q(r, "ln-list:filter", {
        term: "",
        matched: h._filteredData.length,
        total: h._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(b) {
      const T = b.detail || {}, m = T.data || [], E = T.total != null ? T.total : m.length;
      if (!(h._hasInitialSeed && !h.isLoaded && m.length === 0 && E === 0)) {
        if (h._windowed) {
          h._cache.ingest(T) && !T.provisional && r.classList.remove("ln-list--loading");
          return;
        }
        h._data = m, h._lastTotal = E, h._lastFiltered = T.filtered != null ? T.filtered : h._data.length, h.totalCount = h._lastTotal, h.visibleCount = h._lastFiltered, h.isLoaded = !0, h._hasInitialSeed = !1, r.classList.remove("ln-list--loading"), h._vStart = -1, h._vEnd = -1, h._applyFilterAndSort(), h._render(), h._updateFooter(), q(r, "ln-list:rendered", {
          list: h.name,
          total: h.totalCount,
          visible: h.visibleCount
        });
      }
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(b) {
      const T = b.detail && b.detail.loading;
      r.classList.toggle("ln-list--loading", !!T), T && (h.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(b) {
      !h._windowed || !h._cache || h._cache.release(b.detail && b.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !h._windowed || !h._cache || h._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !h._windowed || !h._cache || h._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(b) {
      b.detail.field != null && (b.preventDefault(), h.currentSort = b.detail.direction === "none" ? null : { field: b.detail.field, direction: b.detail.direction }, h._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(b) {
      if (b.target.closest("[data-ln-item-select]") || b.target.closest("[data-ln-item-action]") || b.target.closest("a") || b.target.closest("button") || b.ctrlKey || b.metaKey || b.button === 1) return;
      const T = b.target.closest("[data-ln-item]");
      if (!T) return;
      const m = T.getAttribute("data-ln-item-id"), E = T._lnRecord || {};
      q(r, "ln-list:item-click", {
        list: h.name,
        id: m,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(b) {
      const T = b.target.closest("[data-ln-item-action]");
      if (!T) return;
      const m = T.closest("[data-ln-item]");
      if (!m) return;
      const E = T.getAttribute("data-ln-item-action"), C = m.getAttribute("data-ln-item-id"), k = m._lnRecord || {};
      q(r, "ln-list:item-action", {
        list: h.name,
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
      h.tbody.children.length > 0 && (h._emptyObserver.disconnect(), h._emptyObserver = null, h._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(b) {
      if (b.preventDefault(), !b.detail) return;
      const T = b.detail.key, m = b.detail.values || [];
      if (T) {
        if (m.length === 0)
          delete h._filters[T];
        else {
          const E = [];
          for (let C = 0; C < m.length; C++)
            E.push(m[C].toLowerCase());
          h._filters[T] = E;
        }
        h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), q(r, "ln-list:filter", {
          term: h._searchTerm,
          matched: h._filteredData.length,
          total: h._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(b) {
      if (b.detail && b.detail.field == null) return;
      b.preventDefault();
      const T = b.detail && b.detail.direction === "none" ? null : b.detail && b.detail.direction;
      h._sortField = T === null ? null : b.detail && b.detail.field, h._sortDir = T, h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), q(r, "ln-list:sorted", {
        field: h._sortField,
        direction: b.detail && b.detail.direction,
        matched: h._filteredData.length,
        total: h._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  a.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((h) => !h.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = g(r[0]) || 50);
    for (let h = 0; h < r.length; h++) {
      const b = r[h], T = b.getAttribute("data-ln-item-id") || b.getAttribute("id"), m = b.textContent.trim().toLowerCase();
      let E = null;
      if (this.isDataDriven) {
        E = {}, T != null && (E.id = T);
        const D = b.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (E[O] = vt(R));
        }
      }
      const C = {}, k = b.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < k.length; D++) {
        const I = k[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
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
        searchText: m,
        fields: C,
        ...E || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), q(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const r = this._searchTerm, h = r ? r.split(/\s+/).filter(Boolean) : [], b = this._filters || {}, T = Object.keys(b).length > 0;
      if (h.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(m) {
        if (h.length > 0 && !h.every(function(C) {
          return m.searchText && m.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const E in b) {
            const C = b[E];
            if (C && C.length > 0) {
              const k = m.fields && m.fields[E] !== void 0 ? m.fields[E] : m[E] !== void 0 ? m[E] : null, D = k != null ? String(k).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const m = this._sortField, E = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(rt(this.dom), { sensitivity: "base" }) : null, k = this._filteredData.map(function(I) {
          return I.fields && I.fields[m] !== void 0 ? I.fields[m] : I[m];
        }), D = Te(k);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[m] !== void 0 ? I.fields[m] : I[m], P = R.fields && R.fields[m] !== void 0 ? R.fields[m] : R[m];
          return Le(O, P, D, C) * E;
        });
      }
    }
  }, a.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, h = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || h === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, a.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, h = document.createDocumentFragment();
      for (let T = 0; T < r.length; T++) {
        const m = this._buildItem(r[T]);
        m && h.appendChild(m);
      }
      const b = A(this);
      this.tbody.replaceChildren(h), d(b), this._selectable && this._updateSelectAll();
    } else {
      const r = [], h = this._filteredData;
      for (let T = 0; T < h.length; T++) r.push(h[T].html);
      const b = A(this);
      this.tbody.innerHTML = r.join(""), d(b), this._selectable && this._restoreSelection();
    }
  }, a.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), h = r.gridTemplateColumns;
    let b = 1;
    if (h && h !== "none") {
      const m = h.trim().split(/\s+/).filter(Boolean);
      m.length > 0 && (b = m.length);
    }
    const T = parseFloat(r.rowGap);
    return { columns: b, rowGap: isNaN(T) ? 0 : T };
  }, a.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), h = r ? this._buildItem(r) : this._buildPlaceholderItem();
      h && (this.tbody.textContent = "", this.tbody.appendChild(h), this._itemHeight = g(h) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = g(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = g(r[0]) || 50);
    }
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = S(this.dom);
    const h = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, h.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, a.prototype._renderVirtual = function() {
    const r = this._filteredData, h = r.length, b = this._itemHeight;
    if (!b || !h) return;
    const T = this._scrollContainer;
    let m, E;
    if (T) {
      const Y = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : Y.top - V.top + T.scrollTop;
      m = T.scrollTop - G, E = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      m = window.scrollY - V, E = window.innerHeight;
    }
    const C = this._readGridLayout(), k = C.columns, D = C.rowGap, I = b + D, R = Math.ceil(h / k);
    let O = Math.max(0, Math.floor(m / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(E / I) + 30, B = Math.min(O + P, R), U = Math.min(O * k, h), z = Math.min(B * k, h);
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
  }, a.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, a.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const h = this._scrollContainer;
    let b, T;
    if (h) {
      const V = this.tbody.getBoundingClientRect(), G = h.getBoundingClientRect(), ht = h === this.tbody ? 0 : V.top - G.top + h.scrollTop;
      b = h.scrollTop - ht, T = h.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - G, T = window.innerHeight;
    }
    const m = this._readGridLayout(), E = m.columns, C = m.rowGap, k = r + C, D = this._cache.logicalTotal, I = Math.ceil(D / E);
    let R = Math.max(0, Math.floor(b / k) - 15);
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
  }, a.prototype._showEmptyState = function() {
    let r = null;
    if (this.isDataDriven) {
      const h = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && h > 0, m = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = Tt(this.dom, m, "ln-list"), !r) {
        const E = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (E) {
          const C = T ? "search" : "initial", k = E.content.querySelector(`[data-ln-empty-when="${C}"]`) || E.content.firstElementChild;
          k && (r = document.importNode(k, !0));
        }
      }
    } else {
      const h = this.dom.querySelector(`template[${l}]`);
      if (h) {
        const b = h.content.firstElementChild;
        b && (r = document.importNode(b, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.replaceChildren(r);
      else {
        const h = document.createElement(this.isUl ? "li" : "div");
        h.appendChild(r), this.tbody.replaceChildren(h);
      }
    else
      this.tbody.replaceChildren();
    q(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, a.prototype._buildItem = function(r) {
    let h = Tt(this.dom, this.name + "-row", "ln-list");
    if (!h) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (h = document.importNode(T.content, !0));
    }
    let b = h ? h.querySelector("[data-ln-item]") || h.firstElementChild : null;
    if (b)
      jt(b, r), pt(b, r);
    else if (r && r.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = r.html, b = T.firstElementChild;
    } else if (b = document.createElement(this.isUl ? "li" : "div"), b.setAttribute("data-ln-item", ""), r && typeof r == "object") {
      for (const T in r)
        if (T !== "html" && r[T] != null) {
          const m = document.createElement("span");
          m.setAttribute("data-ln-field", T), m.textContent = String(r[T]), b.appendChild(m);
        }
    }
    if (b._lnRecord = r, r && r.id != null && (b.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      b.classList.add("ln-item-selected");
      const T = b.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return b;
  }, a.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let h = 0; h < r.length; h++) {
      const b = r[h].getAttribute("data-ln-item-id"), T = b != null && this.selectedIds.has(String(b));
      r[h].classList.toggle("ln-item-selected", T);
      const m = r[h].querySelector("[data-ln-item-select]");
      m && (m.checked = T);
    }
    this._updateSelectAll();
  }, a.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(h) {
      const b = h.target.closest("[data-ln-item-select]");
      if (!b) return;
      const T = b.closest("[data-ln-item]");
      if (!T) return;
      const m = T.getAttribute("data-ln-item-id");
      m != null && (b.checked ? (r.selectedIds.add(String(m)), T.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(m)), T.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), q(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const h = r._selectAllCheckbox.checked, b = r.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < b.length; T++) {
        const m = b[T], E = m.getAttribute("data-ln-item-id"), C = m.querySelector("[data-ln-item-select]");
        E != null && (h ? (r.selectedIds.add(String(E)), m.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(E)), m.classList.remove("ln-item-selected")), C && (C.checked = h));
      }
      q(r.dom, "ln-list:select-all", { list: r.name, selected: h }), q(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, a.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let h = r.length > 0;
    for (let b = 0; b < r.length; b++) {
      const T = r[b].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        h = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = h;
  }, a.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    rn(this, "ln-list:request-data", "list");
  }, a.prototype._enterWindowedMode = function() {
    const r = this, h = this.dom, b = parseInt(h.getAttribute("data-ln-list-window"), 10), T = parseInt(h.getAttribute("data-ln-list-window-page"), 10), m = parseInt(h.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), q(h, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = bn({
      windowSize: b > 0 ? b : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: m >= 0 ? m : 25,
      fetchDebounce: 120,
      requestPage: function(E, C, k) {
        q(h, "ln-list:request-data", {
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
  }, a.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), h = r > 0 ? r : this._data.length;
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
  }, a.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, a.prototype._updateFooter = function() {
    let r = 0, h = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, h = this.visibleCount) : (r = this._data.length, h = this._filteredData.length);
    const b = h < r;
    if (this._totalSpan && (this._totalSpan.textContent = v(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? v(h, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, a.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, a, "ln-list", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function l(u) {
    const w = u[e];
    w && p.call(w);
  }
  const f = {
    "data-ln-circular-progress": { effect: l },
    "data-ln-circular-progress-max": { effect: l },
    "data-ln-circular-progress-label": { effect: l }
  }, y = "http://www.w3.org/2000/svg", _ = 36, i = 16, s = 2 * Math.PI * i;
  function c(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, o.call(this), p.call(this), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(u, w) {
    const v = document.createElementNS(y, u);
    for (const [S, A] of Object.entries(w))
      v.setAttribute(S, A);
    return v;
  }
  function o() {
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
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = En(u, w || 100), S = s - v.percentage / 100 * s;
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
    attributes: f
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", l = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-sortable": { effect: _ },
    "data-ln-sortable-handle": {}
  };
  function y(i) {
    this.dom = i, this.isEnabled = i.getAttribute(t) !== "disabled", this._dragging = null, i.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(c) {
      s.isEnabled && s._handlePointerDown(c);
    }, i.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(t, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(t, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), q(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[e]);
  }, y.prototype._handlePointerDown = function(i) {
    let s = i.target.closest("[" + l + "]"), c;
    if (s) {
      for (c = s; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + l + "]")) return;
      for (c = i.target; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
      s = c;
    }
    const o = Array.from(this.dom.children).indexOf(c);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: c,
      index: o
    }).defaultPrevented) return;
    i.preventDefault(), s.setPointerCapture(i.pointerId), this._dragging = c, c.classList.add("ln-sortable--dragging"), c.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), q(this.dom, "ln-sortable:drag-start", {
      item: c,
      index: o
    });
    const u = this, w = function(S) {
      u._handlePointerMove(S);
    }, v = function(S) {
      u._handlePointerEnd(S), s.removeEventListener("pointermove", w), s.removeEventListener("pointerup", v), s.removeEventListener("pointercancel", v);
    };
    s.addEventListener("pointermove", w), s.addEventListener("pointerup", v), s.addEventListener("pointercancel", v);
  }, y.prototype._handlePointerMove = function(i) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), c = this._dragging;
    for (const n of s)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of s) {
      if (n === c) continue;
      const o = n.getBoundingClientRect(), p = o.top + o.height / 2;
      if (i.clientY >= o.top && i.clientY < p) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (i.clientY >= p && i.clientY <= o.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(i) {
    if (!this._dragging) return;
    const s = this._dragging, c = Array.from(this.dom.children), n = c.indexOf(s);
    let o = null, p = null;
    for (const u of c) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, p = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, p = "after";
        break;
      }
    }
    for (const u of c)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== s) {
      p === "before" ? this.dom.insertBefore(s, o) : this.dom.insertBefore(s, o.nextElementSibling);
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
  j(t, e, y, "ln-sortable", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", l = "data-ln-confirm-state", f = "data-ln-confirm-announcer";
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
    return u.setAttribute(f, ""), u.setAttribute("role", "alert"), u.textContent = p, u;
  }
  const c = {
    "data-ln-confirm": { prop: "confirmText", read: _, fallback: "Confirm?" },
    "data-ln-confirm-timeout": { prop: "timeout", read: i, fallback: 3 },
    "data-ln-confirm-state": { prop: "confirming", read: Kt }
  }, n = et(c);
  function o(p) {
    this.dom = p, tt(this, p, n), this.revertTimer = null, this._submitted = !1, this.idleEl = p.querySelector("[data-ln-confirm-idle]"), this.activeEl = p.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : p.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!on(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, w.stopPropagation(), u._reset();
        }
    }, p.addEventListener("click", this._onClick), this;
  }
  o.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(l, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const p = this.activeEl ? this.activeEl.textContent.trim() : "";
      p && (this.dom.setAttribute("aria-label", p), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = p.getAttribute("href"), p.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(s(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), q(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, o.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const p = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      p._reset();
    }, u);
  }, o.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(l), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalIconHref && p.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + f + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e], q(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, j(t, e, o, "ln-confirm", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const l = {
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
  }, f = et(l), y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function _(i) {
    if (this.dom = i, tt(this, i, f), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = i.querySelector("[data-ln-translations-active]"), this.menuEl = i.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = y, this._localesRaw)
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
      const o = Jt("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const p = o.querySelector("[data-ln-translations-lang]");
      p.setAttribute("data-ln-translations-lang", n), p.textContent = this.locales[n], p.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), i.menuEl.getAttribute("data-ln-toggle") === "open" && i.menuEl.setAttribute("data-ln-toggle", "close"), i.addLanguage(n));
      }), this.menuEl.appendChild(o);
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
      const o = n.querySelector("span");
      o.textContent = i.locales[s] || s.toUpperCase();
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
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of o) {
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
    attributes: l
  });
})();
const Jr = "ln-autosave:", Zr = 1e3;
function ti(t, e) {
  return e ? Jr + (t || "") + ":" + e : null;
}
function ei(t, e = Zr) {
  if (t == null) return 0;
  if (t === "") return e;
  const l = parseInt(String(t), 10);
  return isNaN(l) || l < 0 ? e : l;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", l = "data-ln-autosave-clear", f = "data-ln-autosave-debounce-input", y = '[data-ln-autosave-exclude], input[type="password"]';
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
    const o = c.getAttribute(t) || c.id, p = ti(window.location.pathname, o);
    if (!p) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", c);
      return;
    }
    this.dom = c, this.key = p;
    let u = null;
    function w() {
      const d = sn(c, { exclude: y });
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
      const r = ln(c, g);
      for (let h = 0; h < r.length; h++)
        r[h].dispatchEvent(new Event("input", { bubbles: !0 })), r[h].dispatchEvent(new Event("change", { bubbles: !0 }));
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
      i(g) && g.name && !g.matches(y) && w();
    }, this._onChange = function(d) {
      const g = d.target;
      i(g) && g.name && !g.matches(y) && w();
    }, this._onSubmit = function() {
      S();
    }, this._onReset = function() {
      S();
    }, this._onClearClick = function(d) {
      d.target.closest("[" + l + "]") && S();
    }, c.addEventListener("focusout", this._onFocusout), c.addEventListener("change", this._onChange), c.addEventListener("submit", this._onSubmit), c.addEventListener("reset", this._onReset), c.addEventListener("click", this._onClearClick);
    const A = ei(c.getAttribute(f));
    return A > 0 && (this._onInput = function(d) {
      const g = d.target;
      !i(g) || !g.name || g.matches(y) || (u !== null && clearTimeout(u), u = setTimeout(w, A));
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
  const l = {
    "data-ln-autoresize": {}
  };
  function f(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  f.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, f, "ln-autoresize", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-editor": {},
    "data-ln-editor-action": {},
    "data-ln-editor-source": {}
  }, f = {
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
  }, y = {
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
    return !!(y[d] || _[d] || i[d] || d === "link");
  }
  function n(d) {
    this.dom = d;
    const g = this;
    if (this._textarea = d.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", d), this;
    const a = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), a && this._surface.setAttribute("data-placeholder", a);
    const r = this._textarea.id;
    if (r) {
      const m = d.querySelector('label[for="' + r + '"]');
      m && (m.id || (m.id = r + "-label"), this._surface.setAttribute("aria-labelledby", m.id));
    }
    this._surface.id = r ? r + "-surface" : "ln-editor-surface-" + ++s;
    const h = this._textarea.value.trim();
    h && (this._surface.innerHTML = h);
    const b = d.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? d.insertBefore(this._surface, b.nextSibling) : d.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const m = b.querySelectorAll("[data-ln-editor-action]");
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
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(m) {
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
      if (this._surface.focus(), y[d])
        document.execCommand(y[d], !1, null);
      else if (_[d]) {
        const a = _[d], r = o(this._surface);
        r && r.toLowerCase() === a ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + a + ">");
      } else i[d] ? document.execCommand(i[d], !1, null) : d === "link" ? A(this) : d === "unlink" ? document.execCommand("unlink", !1, null) : d === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const d = this.dom.querySelector('[role="toolbar"]');
    if (!d) return;
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const a = g.anchorNode;
    if (!a || !this._surface.contains(a)) return;
    const r = d.querySelectorAll("[data-ln-editor-action]");
    for (let h = 0; h < r.length; h++) {
      const b = r[h], T = b.getAttribute("data-ln-editor-action");
      let m = !1;
      if (y[T])
        try {
          m = document.queryCommandState(y[T]);
        } catch {
        }
      else if (_[T]) {
        const E = o(this._surface);
        m = E && E.toLowerCase() === _[T];
      } else if (i[T])
        try {
          m = document.queryCommandState(i[T]);
        } catch {
        }
      else T === "link" && (m = !!p(g.anchorNode, "A", this._surface));
      c(T) && b.setAttribute("aria-pressed", String(m)), m ? b.classList.add("ln-editor-active") : b.classList.remove("ln-editor-active");
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
      const a = this.dom.querySelector(".ln-editor__link-popover");
      a && a.remove();
    }
    q(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[e];
  };
  function o(d) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return null;
    let a = g.anchorNode;
    if (!a) return null;
    for (; a && a !== d; ) {
      if (a.nodeType === 1) {
        const r = a.tagName;
        if (r === "H2" || r === "H3" || r === "H4" || r === "BLOCKQUOTE" || r === "PRE" || r === "P")
          return r;
      }
      a = a.parentNode;
    }
    return null;
  }
  function p(d, g, a) {
    for (; d && d !== a; ) {
      if (d.nodeType === 1 && d.tagName === g)
        return d;
      d = d.parentNode;
    }
    return null;
  }
  function u(d, g) {
    g.preventDefault();
    let a = "";
    if (g.clipboardData && (a = g.clipboardData.getData("text/html"), !a)) {
      const h = g.clipboardData.getData("text/plain");
      h && (a = h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), a = "<p>" + a + "</p>");
    }
    if (!a) return;
    const r = w(a);
    r && document.execCommand("insertHTML", !1, r);
  }
  function w(d) {
    const g = document.createElement("div");
    return g.innerHTML = d, v(g), g.innerHTML;
  }
  function v(d) {
    const g = Array.from(d.childNodes);
    for (let a = 0; a < g.length; a++) {
      const r = g[a];
      if (r.nodeType !== 3) {
        if (r.nodeType !== 1) {
          d.removeChild(r);
          continue;
        }
        if (f[r.tagName]) {
          const h = Array.from(r.attributes);
          for (let b = 0; b < h.length; b++) {
            const T = h[b].name;
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
    let a = null;
    switch (g.key.toLowerCase()) {
      case "b":
        a = "bold";
        break;
      case "i":
        a = "italic";
        break;
      case "u":
        a = "underline";
        break;
      case "k":
        a = "link";
        break;
    }
    a && (g.preventDefault(), d._execAction(a));
  }
  function A(d) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const a = p(g.anchorNode, "A", d._surface), r = g.getRangeAt(0).cloneRange();
    d._closeLinkPopover && d._closeLinkPopover();
    const h = Tt(d.dom, "ln-editor-link-popover", "ln-editor");
    if (!h) return;
    const b = h.firstElementChild;
    if (!b) return;
    const T = b.querySelector('input[type="url"]'), m = b.querySelector('[data-ln-editor-action="confirm-link"]'), E = b.querySelector('[data-ln-editor-action="cancel-link"]');
    a && (T.value = a.getAttribute("href") || "");
    const C = d.dom.querySelector('[role="toolbar"]');
    C ? C.after(b) : d.dom.insertBefore(b, d._surface), T.focus();
    function k() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(r);
    }
    function D() {
      document.removeEventListener("mousedown", P), d._closeLinkPopover = null, b.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), k(), d._surface.focus(), B)
        if (a)
          a.setAttribute("href", B), a.setAttribute("rel", "noopener noreferrer"), d._syncToTextarea(), q(d.dom, "ln-editor:changed", {
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
      else a && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), k(), d._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const U = d.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !b.contains(B.target) && !U && O();
    }
    d._closeLinkPopover = D, m.addEventListener("click", I), E.addEventListener("click", R), T.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), I()) : B.key === "Escape" && (B.preventDefault(), R());
    }), document.addEventListener("mousedown", P);
  }
  j(t, e, n, "ln-editor", {
    attributes: l
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function l(y) {
    const _ = {}, i = y.dataset;
    for (const s in i) {
      if (!s.startsWith("lnFill") || e[s]) continue;
      const c = s.slice(6);
      c && (_[c.charAt(0).toLowerCase() + c.slice(1)] = i[s]);
    }
    return _;
  }
  function f(y, _) {
    const i = window.CSS && CSS.escape ? CSS.escape(_) : _, s = document.querySelectorAll('[data-ln-fill-id="' + i + '"]');
    if (s.length === 0) return null;
    for (let c = 0; c < s.length; c++) {
      const n = s[c].getAttribute("data-ln-fill-form");
      if (n) {
        const o = document.getElementById(n);
        if (o && y.contains(o)) return s[c];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(y) {
    if (y.ctrlKey || y.metaKey || y.button === 1) return;
    const _ = y.target.closest("[data-ln-fill-form]");
    if (!_) return;
    const i = _.getAttribute("href");
    if (i && i.indexOf("#") !== -1) return;
    const s = _.getAttribute("data-ln-fill-form"), c = document.getElementById(s);
    if (!c) return;
    const n = l(_), o = Object.keys(n).length > 0;
    window.lnCore.lnFill(c, o ? n : null);
  }), document.addEventListener("ln-fill:request", function(y) {
    const _ = y.detail;
    if (!_) return;
    const i = y.target, s = _.id;
    if (s == null) {
      window.lnCore.lnFill(i, null);
      return;
    }
    const c = f(i, s);
    if (!c) return;
    const n = l(c);
    window.lnCore.lnFill(i, n);
  }), window[t] = !0;
})();
function ni(t, e = "-") {
  if (t == null) return "";
  const l = e || "-", f = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, l).replace(new RegExp(`${f}+`, "g"), l).replace(new RegExp(`^${f}+|${f}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-slug-from": { prop: "sourceName", read: Q, fallback: "" }
  }, f = et(l);
  function y(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const i = _.form;
    if (!i)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    tt(this, _, f);
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
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = ni(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, y, "ln-slug", {
    attributes: l
  });
})();
function ri(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const l = typeof e == "number" ? e : e.getTime(), f = t.getTime(), y = Math.floor((f - l) / 1e3), _ = Math.abs(y);
  return _ < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : _ < 60 ? { value: y, unit: "second", isOlderThanMonth: !1 } : _ < 3600 ? { value: Math.round(y / 60), unit: "minute", isOlderThanMonth: !1 } : _ < 86400 ? { value: Math.round(y / 3600), unit: "hour", isOlderThanMonth: !1 } : _ < 604800 ? { value: Math.round(y / 86400), unit: "day", isOlderThanMonth: !1 } : _ < 2592e3 ? { value: Math.round(y / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(y / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Qt(t, e, l = /* @__PURE__ */ new Date()) {
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
  const l = {
    "data-ln-time": { effect: r },
    "data-ln-time-locale": { effect: r }
  }, f = {}, y = {};
  function _(b) {
    return b.getAttribute("data-ln-time-locale") || rt(b);
  }
  function i(b, T) {
    const m = (b || "") + "|" + JSON.stringify(T);
    return f[m] || (f[m] = new Intl.DateTimeFormat(b, T)), f[m];
  }
  function s(b) {
    const T = b || "";
    return y[T] || (y[T] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), y[T];
  }
  const c = /* @__PURE__ */ new Set();
  let n = null;
  function o() {
    n || (n = setInterval(u, 6e4));
  }
  function p() {
    n && (clearInterval(n), n = null);
  }
  function u() {
    for (const b of c) {
      if (!document.body.contains(b.dom)) {
        c.delete(b);
        continue;
      }
      g(b);
    }
    c.size === 0 && p();
  }
  function w(b, T) {
    const m = kt(T), E = (T || "").toLowerCase().split("-")[0], C = i(T, Qt("full", b)), k = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (m && k !== E && m.monthsLong) {
      const D = m.monthsLong[b.getMonth()], I = b.getDate(), R = b.getFullYear(), O = String(b.getHours()).padStart(2, "0"), P = String(b.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R} во ${O}:${P}`;
    }
    return C.format(b);
  }
  function v(b, T) {
    const m = Qt("short", b), E = kt(T), C = (T || "").toLowerCase().split("-")[0], k = i(T, m), D = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (E && D !== C && E.monthsShort) {
      const I = E.monthsShort[b.getMonth()], R = b.getDate(), O = m.year ? " " + b.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return k.format(b);
  }
  function S(b, T) {
    return i(T, Qt("date", b)).format(b);
  }
  function A(b, T) {
    return i(T, Qt("time", b)).format(b);
  }
  function d(b, T) {
    const m = ri(b);
    return m.isOlderThanMonth ? v(b, T) : s(T).format(m.value, m.unit);
  }
  function g(b) {
    const T = b.dom.getAttribute("datetime");
    if (!T) return;
    const m = at(T);
    if (!m) return;
    const E = b.dom.getAttribute(t) || "short", C = _(b.dom);
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
    b.dom.textContent = k, E !== "full" && (b.dom.title = w(m, C));
  }
  function a(b) {
    this.dom = b;
    const T = this;
    return this._onLocaleChange = function() {
      g(T);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), g(this), b.getAttribute(t) === "relative" && (c.add(this), o()), this;
  }
  a.prototype.render = function() {
    g(this);
  }, a.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), c.delete(this), c.size === 0 && p(), delete this.dom[e];
  };
  function r(b) {
    const T = b[e];
    if (!T) return;
    b.getAttribute(t) === "relative" ? (c.add(T), o()) : (c.delete(T), c.size === 0 && p()), g(T);
  }
  function h(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(t) && b[e] && g(b[e]);
  }
  j(t, e, a, "ln-time", {
    attributes: l,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: r,
    onInit: h
  });
})();
function ii(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, l = t.pageSize > 0 ? t.pageSize : 200, f = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const y = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, _ = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  let s = 0, c = 0, n = 0, o = !1, p = null;
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
    i.add(S), clearTimeout(p), p = setTimeout(() => y(S, l, A), f);
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
      return o;
    },
    getId: (S) => {
      if (!_.has(S)) return;
      const A = _.get(S);
      return u(S, A), A;
    },
    ensure: (S, A, d) => {
      if (!o && !i.has(0)) return v(0, d);
      if (s <= 0) return;
      const g = Math.max(0, S), a = Math.min(s, A);
      for (let r = g; r < a; r++)
        if (!_.has(r)) {
          const h = Math.floor(r / l) * l;
          if (!i.has(h)) return v(h, d);
        }
    },
    ingest: (S, A, d, g, a) => {
      if (a != null && a !== n) return [];
      o = !0, d != null && (c = d), g != null && (s = g);
      for (let r = 0; r < A.length; r++)
        u(S + r, A[r]);
      return i.delete(S), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      o = !1, _.clear(), i.clear(), clearTimeout(p);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (S = {}) => {
      let A = [];
      return S.windowSize > 0 && S.windowSize !== e && (e = S.windowSize, A = w()), S.pageSize > 0 && (l = S.pageSize), S.fetchDebounce >= 0 && (f = S.fetchDebounce), A;
    }
  };
}
function oi(t, e, l) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: f, direction: y } = e, _ = y === "desc", i = t.map((c) => c ? c[f] : void 0), s = Te(i);
  return [...t].sort((c, n) => {
    const o = c ? c[f] : void 0, p = n ? n[f] : void 0, u = Le(o, p, s, l);
    return _ ? -u : u;
  });
}
function Un(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const l = Object.keys(e).filter((f) => Array.isArray(e[f]) && e[f].length > 0);
  return l.length ? t.filter((f) => f ? l.every((y) => xe(f[y], e[y])) : !1) : t;
}
function ai(t, e, l) {
  if (!Array.isArray(t) || !e || !l || !l.length) return t;
  const f = Sn(e);
  return f.length ? t.filter((y) => y ? f.every(
    (_) => l.some((i) => {
      const s = y[i];
      return s != null && Cn(String(s), [_]);
    })
  ) : !1) : t;
}
function si(t, e, l) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (l === "count") return t.length;
  const f = t.map((_) => _ && _[e] != null ? parseFloat(_[e]) : NaN).filter((_) => Number.isFinite(_)), y = f.reduce((_, i) => _ + i, 0);
  return l === "sum" ? y : l === "avg" && f.length ? y / f.length : 0;
}
function li(t, e = {}, l = [], f) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const y = t.length;
  let _ = t;
  e.filters && (_ = Un(_, e.filters)), e.search && (_ = ai(_, e.search, l));
  const i = _.length;
  if (e.sort && (_ = oi(_, e.sort, f)), e.offset || e.limit) {
    const s = e.offset || 0, c = e.limit || _.length;
    _ = _.slice(s, s + c);
  }
  return { records: _, total: y, filtered: i };
}
function ci(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((l) => {
    if (!l) return null;
    const f = { ...l };
    for (const [y, _] of Object.entries(e))
      if (typeof _ == "function")
        try {
          f[y] = _(l);
        } catch {
          f[y] = void 0;
        }
    return f;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function l(L, x, M) {
    const N = L.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const f = {
    "data-ln-data-store": { effect: Me },
    "data-ln-data-store-indexes": { effect: Me },
    "data-ln-data-store-stale": { prop: "_staleThreshold", read: l, fallback: 300 },
    "data-ln-data-store-search-fields": { prop: "_searchFields", read: er },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", read: Kt },
    "data-ln-data-store-window": { prop: "_windowSize", read: Dt, fallback: 1e3, effect: Zn },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", read: Dt, fallback: 200, effect: tr },
    "data-ln-data-store-frozen": {}
  }, y = et(f), _ = "ln_app_cache", i = "_meta", s = "1.0";
  let c = null, n = null;
  const o = {};
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
          const st = ft.target.result;
          st.objectStoreNames.contains(i) || st.createObjectStore(i, { keyPath: "key" });
          for (const Lt of M)
            if (!st.objectStoreNames.contains(Lt)) {
              const Mt = st.createObjectStore(Lt, { keyPath: "id" });
              for (const ce of x[Lt].indexes)
                Mt.createIndex(ce, ce, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const st = ft.target.result;
          v(st), c = st, L(st);
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
    const x = { ...L }, M = x.id, N = await mr(x);
    return !N || !N.encrypted ? L : {
      id: M,
      encrypted: !0,
      iv: N.iv,
      data: N.data
    };
  }
  async function d(L) {
    return !L || !L.encrypted || !At() ? L : gr(L);
  }
  const g = (L, x) => S().then((M) => M ? M.transaction(L, x).objectStore(L) : null);
  function a(L) {
    return new Promise((x, M) => {
      L.onsuccess = () => x(L.result), L.onerror = () => {
        p(L.error), M(L.error);
      };
    });
  }
  const r = (L) => g(L, "readonly").then((x) => x ? a(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => d(M))) : x), h = (L, x) => g(L, "readonly").then((M) => M ? a(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? a(M.get(Number(x))) : typeof x == "number" ? a(M.get(String(x))) : null) : null).then((M) => M ? d(M) : null), b = (L, x) => S().then((M) => {
    if (!M) return [];
    const F = M.transaction(L, "readonly").objectStore(L), H = x.map((K) => a(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? a(F.get(Number(K))) : typeof K == "number" ? a(F.get(String(K))) : null));
    return Promise.all(H).then((K) => At() ? Promise.all(K.map((W) => W ? d(W) : null)) : K);
  }), T = (L, x) => (At() ? A(x) : Promise.resolve(x)).then((N) => g(L, "readwrite").then((F) => F ? a(F.put(N)) : null)), m = (L, x) => g(L, "readwrite").then((M) => M ? a(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return a(M.delete(Number(x)));
    if (typeof x == "number")
      return a(M.delete(String(x)));
  }) : null), E = (L) => g(L, "readwrite").then((x) => x ? a(x.clear()) : null), C = (L) => g(L, "readonly").then((x) => x ? a(x.count()) : 0), k = (L) => g(i, "readonly").then((x) => x ? a(x.get(L)) : null), D = (L, x) => g(i, "readwrite").then((M) => {
    if (M)
      return x.key = L, a(M.put(x));
  });
  function I(L) {
    return this.dom = L, this._name = L.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", L), tt(this, L, y), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, L.hasAttribute("data-ln-data-store-window") ? this._windowIndex = ii({
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
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, R(this), this.ready = Y(this), this;
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
    return h(L._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const H = F.id, K = { ...F, ...M, id: H }, W = M.id, J = W !== void 0 && W !== H;
      return (J ? bt(L._name, H, { ...K, id: W }) : T(L._name, K)).then(() => P(L, 0)).then(() => {
        q(L.dom, "ln-data-store:updated", { store: L._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(L, { id: x, requestId: M } = {}) {
    return h(L._name, x).then((N) => {
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
    return x.length ? Promise.all(x.map((N) => h(L._name, N))).then((N) => {
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
  const se = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function jn(L) {
    return L ? Object.keys(L).filter((x) => Array.isArray(L[x]) && L[x].length > 0) : [];
  }
  function Vn(L, x, M) {
    return x.every((N) => M[N].map(String).includes(String(L[N])));
  }
  function Wn(L) {
    return String(L || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Gn(L, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const H = L[F];
        return H != null && String(H).toLowerCase().includes(N);
      })
    );
  }
  function Qn(L, x, M) {
    return si(L, x, M);
  }
  function Ot(L, x) {
    return ci(x, L.presenters && L.presenters.computed);
  }
  function $n(L) {
    return !L.sort && !At();
  }
  function Yn(L, x, M) {
    const N = jn(x.filters), F = x.search ? Wn(x.search) : [], H = L._searchFields, K = F.length > 0 && H && H.length > 0;
    return g(L._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ft = [], st = W.openCursor();
      st.onsuccess = () => {
        const Lt = st.result;
        if (!Lt || ft.length >= M) {
          J(ft);
          return;
        }
        const Mt = Lt.value;
        (!N.length || Vn(Mt, N, x.filters)) && (!K || Gn(Mt, F, H)) && ft.push(Mt), Lt.continue();
      }, st.onerror = () => nt(st.error);
    }) : []);
  }
  function Re(L, x, M) {
    return li(x, M, L._searchFields, se);
  }
  function Oe(L, x, M) {
    const N = [];
    for (let H = x; H < x + M; H++) {
      const K = L._windowIndex.getId(H);
      N.push(K);
    }
    const F = Array.from(new Set(N.filter((H) => H !== void 0)));
    return b(L._name, F).then((H) => {
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
        return $n(L) ? Yn(x, L, F).then((K) => H(K.slice(M, F))) : r(x._name).then((K) => H(Re(x, K, L).records));
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
    return h(this._name, L).then((x) => x ? Ot(this, [x])[0] : null);
  }, I.prototype.count = function(L) {
    return L && Object.keys(L).length > 0 ? r(this._name).then((M) => Un(M, L).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(L, x) {
    return r(this._name).then((M) => Qn(M, L, x));
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
    delete o[this._name], delete this.dom[e], q(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Xn() {
    return S().then((L) => {
      if (!L) return;
      const x = Array.from(L.objectStoreNames);
      return new Promise((M, N) => {
        const F = L.transaction(x, "readwrite");
        x.forEach((H) => F.objectStore(H).clear()), F.oncomplete = () => M(), F.onerror = () => N(F.error);
      });
    }).then(() => {
      Object.values(o).forEach((L) => {
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
  const Jn = "data-ln-data-store-frozen";
  function Me(L, x) {
    L.setAttribute(Jn, x);
  }
  function Zn(L) {
    const x = L[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ht(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function tr(L) {
    const x = L[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: f
  }), window[e].clearAll = Xn, window[e].init = window[e], window[e].setStorageKey = Fe, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Fe);
})();
const di = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function qt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, l) => {
    const f = String(e);
    return l === 0 ? f.replace(/\/+$/, "") : f.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function ui(t, e) {
  if (!t || typeof t != "object") return "";
  const l = Object.assign({}, di);
  if (e && typeof e == "object")
    for (const y in e)
      e[y] !== void 0 && e[y] !== null && e[y] !== "" && (l[y] = e[y]);
  const f = new URLSearchParams();
  return t.search && f.append(l.search, t.search), t.offset != null && f.append(l.offset, t.offset), t.limit != null && f.append(l.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (f.append(l.sortField, t.sort.field), f.append(l.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((y) => {
    const _ = t.filters[y];
    Array.isArray(_) && _.length > 0 && f.append(y, _.join(","));
  }), f.toString();
}
function hi(t, e, l) {
  let f = qt(t, e);
  return l && (f += (f.indexOf("?") !== -1 ? "&" : "?") + l), f;
}
function Xe(t) {
  const e = t && t.content !== void 0 ? t.content : t, l = t && t.message ? t.message : null;
  return { record: e, message: l };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", l = "lnConnector";
  if (window[e] !== void 0) return;
  function f(n) {
    const o = n[e];
    o && o.refreshConfig();
  }
  const y = {
    "data-ln-api-connector": {},
    "data-ln-api-base-url": { prop: "baseUrl", read: Q, fallback: "", effect: f },
    "data-ln-api-path": { prop: "path", read: Q, fallback: "", effect: f },
    "data-ln-api-headers": { prop: "rawHeaders", read: Q, fallback: null, effect: f },
    "data-ln-api-param-offset": { effect: f },
    "data-ln-api-param-limit": { effect: f },
    "data-ln-api-param-search": { effect: f },
    "data-ln-api-param-sort-field": { effect: f },
    "data-ln-api-param-sort-dir": { effect: f },
    "data-ln-api-connector-query-debounce": { effect: f }
  }, _ = et(y);
  function i(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((o) => {
      const p = new Error("HTTP " + n.status + ": " + n.statusText);
      throw p.status = n.status, p.data = o, p;
    });
  }
  function s(n) {
    return this.dom = n, tt(this, n, _), n[e] = this, n[l] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, c(this), this;
  }
  s.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = mn(this.rawHeaders);
    const o = {}, p = n.getAttribute("data-ln-api-param-offset");
    p && (o.offset = p);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (o.limit = u);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (o.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (o.sortField = v);
    const S = n.getAttribute("data-ln-api-param-sort-dir");
    S && (o.sortDir = S), this.paramKeys = o;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, q(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, s.prototype._reqHeaders = function(n) {
    const o = Object.assign({}, this.headers);
    return !o.Accept && !o.accept && (o.Accept = "application/json"), !o["Content-Type"] && !o["content-type"] && (o["Content-Type"] = "application/json"), n && (o["X-Idempotency-Key"] = n), o;
  }, s.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, s.prototype.fetchDelta = function(n, o) {
    const p = this;
    let u = qt(p.baseUrl, p.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = o || "sync";
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
  }, s.prototype.query = function(n, o) {
    const p = this, u = ui(n, p.paramKeys), w = hi(p.baseUrl, p.path, u), v = o || "query";
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
  }, s.prototype.create = function(n, o, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, o || u.path), {
      method: "POST",
      headers: u._reqHeaders(p),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(i);
  }, s.prototype.update = function(n, o, p, u, w) {
    const v = this;
    p != null && (o = Object.assign({}, o, { expected_version: p }));
    const S = u ? qt(v.baseUrl, u) : qt(v.baseUrl, v.path, n);
    return window.fetch(S, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(o)
    }).then(i);
  }, s.prototype.delete = function(n, o, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, o || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(p),
      credentials: u.credentials
    }).then(i);
  }, s.prototype.bulkDelete = function(n, o, p) {
    const u = this;
    return window.fetch(qt(u.baseUrl, o || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(p),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(i);
  };
  function c(n) {
    n._handlers = {
      sync: function(o) {
        const p = o.detail || {}, u = p.meta && p.meta.targetEl ? p.meta.targetEl : null;
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
      query: function(o) {
        const p = o.detail || {}, u = p.query || p, w = p.meta && p.meta.targetEl ? p.meta.targetEl : null, v = w || "query", S = n.queryDebounce;
        function A(g, a, r) {
          n.query(a, r).then(function(h) {
            const b = h || {};
            q(n.dom, "ln-api-connector:fetched", {
              data: b.data || (Array.isArray(b) ? b : []),
              total: b.total,
              filtered: b.filtered,
              offset: a.offset,
              queryGen: a.queryGen,
              meta: g.meta || null
            });
          }).catch(function(h) {
            h && h.name === "AbortError" || q(n.dom, "ln-api-connector:error", {
              action: "query",
              error: h.message,
              status: h.status || 0,
              data: h.data || null,
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
      cancel: function(o) {
        const p = o.detail || {}, u = p.meta && p.meta.targetEl ? p.meta.targetEl : p.targetEl || p.key;
        u && n.cancel(u);
      },
      create: function(o) {
        const p = o.detail || {};
        n.create(p.data, p.url, p.idempotencyKey).then(function(u) {
          const w = Xe(u);
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
      update: function(o) {
        const p = o.detail || {};
        n.update(p.id, p.data, p.expected_version, p.url, p.idempotencyKey).then(function(u) {
          const w = Xe(u);
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
      delete: function(o) {
        const p = o.detail || {};
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
      bulkDelete: function(o) {
        const p = o.detail || {};
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
    n._inflight && (n._inflight.forEach(function(o) {
      o.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(o) {
      o && clearTimeout(o);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-fetch", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), q(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[l];
  }, j(t, e, s, "ln-api-connector", {
    attributes: y
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", l = "lnConnector";
  if (window[e] !== void 0) return;
  function f(v) {
    const S = v[e];
    S && S.refreshConfig();
  }
  const y = {
    "data-ln-couchdb-connector": {},
    "data-ln-couchdb-url": { prop: "url", read: Q, fallback: "", effect: f },
    "data-ln-couchdb-db": { prop: "db", read: Q, fallback: "", effect: f },
    "data-ln-couchdb-auth": { prop: "auth", read: Q, fallback: "", effect: f },
    "data-ln-couchdb-headers": { effect: f }
  }, _ = et(y);
  function i(v) {
    const S = v && v.content !== void 0 ? v.content : v, A = v && v.message ? v.message : null;
    return { content: S, message: A };
  }
  function s(v) {
    return this.dom = v, tt(this, v, _), v[e] = this, v[l] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  s.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const S = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = mn(S, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), q(v, "ln-couchdb-connector:config-changed", {
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
      const a = g.results || [];
      return {
        data: a.filter((r) => !r.deleted && r.doc).map((r) => Object.assign({}, r.doc, { id: r.doc._id })),
        deleted: a.filter((r) => r.deleted).map((r) => r.id),
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
      const a = i(g), r = a.content;
      return { record: Object.assign({}, d, { id: r.id, _id: r.id, _rev: r.rev }), message: a.message };
    });
  }
  s.prototype.create = function(v, S) {
    return n(this, v, S).then((A) => A.record);
  };
  function o(v, S, A, d) {
    const g = Object.assign({ id: String(S), _id: String(S) }, A), a = g._rev || g.rev;
    return (a ? Promise.resolve(a) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((h) => {
      if (!h.ok) throw new Error("Could not retrieve document for revision mapping");
      return h.json().then((b) => b._rev);
    })).then((h) => {
      const b = Object.assign({}, g, { _rev: h });
      delete b.rev;
      const T = c(v, d, { "If-Match": h });
      return window.fetch(Et(v.url, v.db, null, S), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(b)
      }).then((m) => {
        if (m.ok) return m.json().then((E) => {
          const C = i(E);
          return { record: Object.assign({}, b, { _rev: C.content.rev }), message: C.message };
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
    return o(this, v, S, A).then((d) => d.record);
  };
  function p(v, S, A, d) {
    return (A ? Promise.resolve(A) : window.fetch(Et(v.url, v.db, null, S), { method: "GET", headers: Nt(v.headers, v.auth), credentials: v.credentials }).then((a) => {
      if (!a.ok) throw new Error("Could not retrieve document for revision delete");
      return a.json().then((r) => r._rev);
    })).then((a) => {
      const r = Et(v.url, v.db, null, S) + "?rev=" + encodeURIComponent(a);
      return window.fetch(r, { method: "DELETE", headers: c(v, d), credentials: v.credentials }).then((h) => {
        if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
        return h.json();
      }).then((h) => {
        const b = i(h);
        return { response: b.content, message: b.message };
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
      const a = (d.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return a.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: c(v, A),
        credentials: v.credentials,
        body: JSON.stringify({ docs: a })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => {
        const h = i(r);
        return { response: { ok: !0, results: h.content, deletedCount: a.length }, message: h.message };
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
        d.expected_version !== void 0 && (g._rev = d.expected_version), o(v, d.id, g, d.idempotencyKey).then(function(a) {
          q(v.dom, "ln-couchdb-connector:updated", { record: a.record, id: d.id, message: a.message, meta: d.meta || null });
        }).catch(function(a) {
          q(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: a.message,
            status: a.status || 0,
            id: d.id,
            data: a.status === 409 ? a.data : null,
            conflictData: a.status === 409 ? a.data : null,
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
    }), v._handlers = null), q(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[e], delete this.dom[l];
  }, j(t, e, s, "ln-couchdb-connector", {
    attributes: y
  });
})();
function fi(t) {
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
  const l = !t || !!t.initializationError, f = !!(t && t.noLocalQuery && !t.windowed);
  return e && (l || !t.canServe || f) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function $t(t, e, l) {
  return l === "store" && !!e && !(t && t.windowed);
}
function Je(t, e) {
  const l = Object.assign({}, t);
  return e && (l.filters = e.filters, l.search = e.search, l.sort = e.sort), l;
}
class pi {
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
    const y = this._pending.get(f);
    return y ? (this._pending.delete(f), l ? y.reject(e.error || new Error("Store mutation failed")) : y.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", l = "data-ln-data-coordinator-scope", f = "data-ln-data-coordinator-search", y = "data-ln-data-coordinator-filters", _ = "data-ln-data-coordinator-sort-field", i = "data-ln-data-coordinator-sort-direction";
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
  const o = {
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
  }, p = et(o), u = /* @__PURE__ */ new Set();
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
  function a() {
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
  function h(m) {
    return m ? m.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : m.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function b(m) {
    const E = this;
    return this.dom = m, tt(this, m, p), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", m), m[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new pi(), this._dict = re(m, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      E._destroyed || E._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), d(), this._checkInitialSync(), this;
  }
  Object.defineProperty(b.prototype, "_staleThreshold", {
    get: function() {
      const E = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (E ? E.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const k = parseInt(C, 10);
      return isNaN(k) ? 300 : k;
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
    const m = this.findChildren(), E = m.store;
    !E || E.initializationError || !m.connector || this._noAutosync || !E.isInitialized || E.isSyncing || (!E.hasCache || this._isStale()) && E.forceSync();
  }, b.prototype._checkInitialSync = function() {
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
  }, b.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const E = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    E && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(E)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(C) {
      return C;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(C) {
      return C;
    });
  }, b.prototype.findChildren = function() {
    const m = this.dom.querySelector("[data-ln-data-store]"), E = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: m,
      connectorEl: E,
      queueEl: C,
      store: m ? m.lnDataStore : null,
      connector: E ? E.lnApiConnector || E.lnCouchDbConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, b.prototype._handleSubmitRecord = function(m) {
    const E = this.findChildren();
    if (!E.storeEl && !E.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = m.data || {}, k = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = m.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(E, I, m.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(E, k, I, D, m.action);
  }, b.prototype._fanOutCreate = function(m, E, C) {
    this.refreshMapper();
    const k = "_temp_" + a();
    m.storeEl && q(m.storeEl, "ln-data-store:request-create", { tempId: k, data: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: k,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(E),
      expectedVersion: null,
      meta: { tempId: k, action: C }
    }) : m.connector && q(m.connectorEl, h(m.connectorEl) + ":request-create", {
      data: this.mapper.egress(E),
      url: C,
      meta: { entryId: a(), queued: !1, op: "create", tempId: k }
    });
  }, b.prototype._fanOutUpdate = function(m, E, C, k, D) {
    this.refreshMapper(), m.storeEl && q(m.storeEl, "ln-data-store:request-update", { id: E, data: C }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "update",
      targetId: E,
      payload: this.mapper.egress(C),
      expectedVersion: k,
      meta: { id: E, action: D }
    }) : m.connector && q(m.connectorEl, h(m.connectorEl) + ":request-update", {
      id: E,
      data: this.mapper.egress(C),
      expected_version: k,
      url: D,
      meta: { entryId: a(), queued: !1, op: "update", id: E }
    });
  }, b.prototype._fanOutDelete = function(m, E) {
    this.refreshMapper(), m.storeEl && q(m.storeEl, "ln-data-store:request-delete", { id: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: E,
      op: "delete",
      targetId: E,
      payload: null,
      expectedVersion: null,
      meta: { id: E }
    }) : m.connector && q(m.connectorEl, h(m.connectorEl) + ":request-delete", {
      id: E,
      meta: { entryId: a(), queued: !1, op: "delete", id: E }
    });
  }, b.prototype._fanOutBulkDelete = function(m, E) {
    this.refreshMapper();
    const C = E.join(",");
    m.storeEl && q(m.storeEl, "ln-data-store:request-bulk-delete", { ids: E }), m.queue ? q(m.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: E },
      expectedVersion: null,
      meta: { bulkKey: C, ids: E }
    }) : m.connector && q(m.connectorEl, h(m.connectorEl) + ":request-bulk-delete", {
      ids: E,
      meta: { entryId: a(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, b.prototype._toastFromMessage = function(m) {
    m && q(window, "ln-toast:enqueue", {
      type: m.type || "success",
      title: m.title || "",
      message: m.body || ""
    });
  }, b.prototype._toastFromDict = function(m) {
    const E = this._dict[m];
    E && q(window, "ln-toast:enqueue", { type: "error", title: "", message: E });
  }, b.prototype._requestStoreMutation = function(m, E, C) {
    const k = m.storeEl;
    if (!k) return Promise.reject(new Error("Store element not found"));
    const D = a(), I = this._mutationReceipts.wait(D);
    return q(k, "ln-data-store:request-" + E, Object.assign({}, C, { requestId: D })), I;
  }, b.prototype._reportReconciliationError = function(m, E, C) {
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
        q(C.connectorEl, h(C.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(E) {
        const C = m.findChildren();
        if (!C.connectorEl) return;
        const k = E.detail || {};
        q(C.connectorEl, h(C.connectorEl) + ":request-query", {
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
        I === "create" ? q(C.connectorEl, h(C.connectorEl) + ":request-create", {
          data: O,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? q(C.connectorEl, h(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: U,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? q(C.connectorEl, h(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? q(C.connectorEl, h(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: B.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(E) {
        const C = E.target;
        if (E.defaultPrevented) return;
        const k = C.hasAttribute(l) ? C.getAttribute(l) : null;
        if (k === null) return;
        let D;
        if (k ? D = m._owns(k) : D = C.closest("[data-ln-data-coordinator]") === m.dom, !D) return;
        const I = cr(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        E.preventDefault();
        const R = sn(C);
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
        C !== (m.dom.getAttribute(f) || "") && m.dom.setAttribute(f, C);
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
        P ? m.dom.setAttribute(y, P) : m.dom.removeAttribute(y);
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
  b.prototype._owns = function(m) {
    return !!m && m === this._name;
  }, b.prototype._currentQuery = function() {
    const m = this.dom.getAttribute(_), E = this.dom.getAttribute(i), C = new URLSearchParams(this.dom.getAttribute(y) || ""), k = {};
    for (const D of new Set(C.keys())) k[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(f) || "",
      filters: k,
      sort: m && E ? { field: m, direction: E } : null
    };
  }, b.prototype._nextQueryGen = function(m) {
    const E = (this._queryGens.get(m) || 0) + 1;
    return this._queryGens.set(m, E), E;
  }, b.prototype._isCurrentGen = function(m, E) {
    return this._queryGens.get(m) === E;
  }, b.prototype._serveData = function(m, E) {
    const C = m.target, k = E === "table" ? "data-ln-table-source" : E === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(k);
    if (!D || !this._owns(D)) return;
    const I = m.detail || {}, R = fi(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Pt(B, O.connector), $ = Je(R, P._currentQuery());
      if (z === "remote") {
        const V = P._nextQueryGen(C);
        q(C, "ln-" + E + ":set-loading", { loading: !0 }), q(O.connectorEl, h(O.connectorEl) + ":request-query", {
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
      return X && q(O.connectorEl, h(O.connectorEl) + ":request-query", {
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
  }, b.prototype._serveOptions = function(m) {
    const E = m.target, C = E.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const k = this.findChildren(), D = k.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Pt(D, k.connector);
      if (O === "remote") {
        const U = R._nextQueryGen(E);
        q(k.connectorEl, h(k.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: E, kind: "options", queryGen: U }
        });
        return;
      }
      if (O !== "store") return;
      const P = $t(D, k.connector, O), B = P ? R._nextQueryGen(E) : null;
      return P && q(k.connectorEl, h(k.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: E, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(U) {
        R._destroyed || P && !R._isCurrentGen(E, B) || q(E, "ln-options:set-data", { data: U.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: E, kind: "options" });
    });
  }, b.prototype._serveStat = function(m) {
    const E = m.target, C = E.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const k = m.detail && m.detail.filters ? m.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = k && Object.keys(k).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), U = B ? "remote" : Pt(I, D.connector);
      if (U === "remote") {
        const X = O._nextQueryGen(E);
        q(D.connectorEl, h(D.connectorEl) + ":request-query", {
          query: { filters: k },
          meta: { targetEl: E, kind: "stat", queryGen: X }
        });
        return;
      }
      if (U !== "store") return;
      const z = !B && $t(I, D.connector, U), $ = z ? O._nextQueryGen(E) : null;
      return z && q(D.connectorEl, h(D.connectorEl) + ":request-query", {
        query: { filters: k },
        meta: { targetEl: E, kind: "stat", queryGen: $ }
      }), I.count(k).then(function(X) {
        O._destroyed || z && !O._isCurrentGen(E, $) || q(E, "ln-stat:set-count", { count: X });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: E, kind: "stat" });
    });
  }, b.prototype._refreshAll = function(m, E) {
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
        const U = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = Je(U, C._currentQuery());
        if (Pt(B, P.connector) === "remote") {
          const Y = C._nextQueryGen(I);
          q(I, "ln-" + O + ":set-loading", { loading: !0 }), q(P.connectorEl, h(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
          });
          continue;
        }
        const $ = $t(B, P.connector, Pt(B, P.connector)), X = $ ? C._nextQueryGen(I) : null;
        $ && q(P.connectorEl, h(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
        }), (function(Y, V, G, ht) {
          B.getAll(z).then(function(bt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(Y, ht)) return;
            const se = {
              data: bt.data,
              total: m && m.total !== void 0 ? m.total : bt.total,
              filtered: m && m.filtered !== void 0 ? m.filtered : bt.filtered,
              offset: bt.offset !== void 0 ? bt.offset : m && m.offset !== void 0 ? m.offset : U.offset,
              queryGen: bt.queryGen !== void 0 ? bt.queryGen : m && m.queryGen !== void 0 ? m.queryGen : U.queryGen
            };
            q(Y, "ln-" + V + ":set-loading", { loading: !1 }), q(Y, "ln-" + V + ":set-data", se), C._boundDelivered.set(Y, !0);
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
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const m = this;
    m._handlers && (m.dom.removeEventListener("ln-data-store:request-remote-sync", m._handlers.sync), m.dom.removeEventListener("ln-data-store:request-page", m._handlers.requestPage), m.dom.removeEventListener("ln-data-coordinator:request-create", m._handlers.reqCreate), m.dom.removeEventListener("ln-data-coordinator:request-update", m._handlers.reqUpdate), m.dom.removeEventListener("ln-data-coordinator:request-delete", m._handlers.reqDelete), m.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", m._handlers.reqBulkDelete), m.dom.removeEventListener("ln-api-queue:send", m._handlers.queueSend), m.dom.removeEventListener("ln-api-queue:failed", m._handlers.queueFailed), m.dom.removeEventListener("ln-data-store:initialized", m._handlers.storeInitialized), document.removeEventListener("submit", m._handlers.formSubmit), r.forEach(function(E) {
      m.dom.removeEventListener(E + ":fetched", m._handlers.connFetched), m.dom.removeEventListener(E + ":created", m._handlers.connCreated), m.dom.removeEventListener(E + ":updated", m._handlers.connUpdated), m.dom.removeEventListener(E + ":deleted", m._handlers.connDeleted), m.dom.removeEventListener(E + ":bulk-deleted", m._handlers.connBulkDeleted), m.dom.removeEventListener(E + ":error", m._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", m._handlers.reqTableData), document.removeEventListener("ln-list:request-data", m._handlers.reqListData), document.removeEventListener("ln-chart:request-data", m._handlers.reqChartData), document.removeEventListener("ln-options:request-data", m._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", m._handlers.reqStat), m.dom.removeEventListener("ln-data-store:ready", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:created", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:updated", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:deleted", m._handlers.refresh), m.dom.removeEventListener("ln-data-store:mutation-error", m._handlers.mutationError), m.dom.removeEventListener("ln-data-store:synced", m._handlers.refreshSynced), m.dom.removeEventListener("ln-data-store:query-changed", m._handlers.refreshQuery), m.dom.removeEventListener("ln-search:change", m._handlers.searchChange), m.dom.removeEventListener("ln-filter:change", m._handlers.filterChange), m.dom.removeEventListener("ln-sort:change", m._handlers.sortChange), m._handlers = null), m._boundQueries = null, m._boundDelivered = null, m._queryGens = null, m._queueQueryRefresh = null, m._mutationReceipts.close(new Error("Data coordinator destroyed")), m._mutationReceipts = null, u.delete(this), g(), delete this.dom[e];
  }, j(t, e, b, "ln-data-coordinator", {
    attributes: o
  });
})();
const mi = "ln_api_queue", gi = 2, it = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function xt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function Ze(t) {
  return "seq:" + t;
}
function Yt(t) {
  return "paused:" + t;
}
function tn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function _i(t, e, l) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(l);
}
function bi(t, e, l, f) {
  const y = /* @__PURE__ */ new Map(), _ = [], i = [];
  for (const s of t || [])
    y.has(s.chainKey) || y.set(s.chainKey, []), y.get(s.chainKey).push(s);
  return y.forEach((s, c) => {
    s.sort((o, p) => o.seq - p.seq);
    const n = s[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > f) {
        i.push({ chainKey: c, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > f) {
        i.push({ chainKey: c, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = f + l, n.updatedAt = f, _.push(n);
    }
  }), { entries: _, wakeups: i };
}
function yi(t, e, l, f, y) {
  const _ = [], i = [];
  for (const s of t || []) {
    if (s.entryId === e) {
      i.push(s.entryId);
      continue;
    }
    s.chainKey === l && (s.chainKey = f, s.targetId === l && (s.targetId = f), s.meta && s.meta.id === l && (s.meta.id = f), s.meta && typeof s.meta.action == "string" && (s.meta.action = _i(s.meta.action, l, f)), s.updatedAt = y, _.push(s));
  }
  return { changed: _, deleted: i };
}
class vi {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || mi, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, l) => {
      const f = this.indexedDB.open(this.dbName, gi);
      f.onupgradeneeded = (y) => {
        const _ = y.target.result;
        let i;
        _.objectStoreNames.contains(it) ? i = y.target.transaction.objectStore(it) : i = _.createObjectStore(it, { keyPath: "entryId" }), i.indexNames.contains("by_scope_chain") || i.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), i.indexNames.contains("by_scope_seq") || i.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), _.objectStoreNames.contains(lt) || _.createObjectStore(lt, { keyPath: "key" });
      }, f.onerror = () => l(ut(f, "Queue database open failed")), f.onsuccess = (y) => {
        this._db = y.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, l) => {
      const f = this.indexedDB.deleteDatabase(this.dbName);
      f.onsuccess = () => e(), f.onerror = () => l(ut(f, "Queue database delete failed")), f.onblocked = () => l(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((l) => l ? new Promise((f, y) => {
      const i = l.transaction(it, "readonly").objectStore(it).index("by_scope_seq").getAll(xt(this.keyRange, e));
      i.onsuccess = () => f(i.result || []), i.onerror = () => y(ut(i, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, l) {
    return l = l || {}, this.open().then((f) => f ? new Promise((y, _) => {
      const i = f.transaction([lt, it], "readwrite"), s = i.objectStore(lt), c = i.objectStore(it), n = Ze(e);
      let o = null;
      const p = (w) => {
        const v = w + 1;
        o = {
          entryId: this.uuid(),
          scope: e,
          chainKey: l.chainKey,
          seq: v,
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
        }, s.put({ key: n, value: v }), c.put(o);
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
      }, i.oncomplete = () => y(o), i.onerror = () => _(i.error || new Error("Queue enqueue transaction failed")), i.onabort = () => _(i.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, l, f) {
    return this.open().then((y) => y ? new Promise((_, i) => {
      const s = y.transaction(it, "readwrite"), c = s.objectStore(it), n = c.index("by_scope_seq").getAll(xt(this.keyRange, e)), o = this.now();
      let p = { entries: [], wakeups: [] };
      n.onerror = () => i(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        p = bi(n.result || [], l, f, o);
        for (const u of p.entries) c.put(u);
      }, s.oncomplete = () => _(p), s.onerror = () => i(s.error || new Error("Queue claim transaction failed")), s.onabort = () => i(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, l) {
    return this._updateEntry(e, l, (f, y) => (y.delete(f.entryId), { status: "acked", entry: f }));
  }
  nack(e, l, f, y) {
    y = y || {};
    const _ = y.maxAttempts || 8, i = y.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((c, n) => {
      const o = s.transaction([it, lt], "readwrite"), p = o.objectStore(it), u = o.objectStore(lt), w = p.get(l);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const S = w.result;
        if (!(!S || S.scope !== e)) {
          if (f === "drop") {
            p.delete(S.entryId), v = { status: "dropped", entry: S };
            return;
          }
          if (tn(S), S.updatedAt = this.now(), f === "auth") {
            S.status = "pending", p.put(S), u.put({ key: Yt(e), value: "auth" }), v = { status: "auth", entry: S };
            return;
          }
          if (f === "retry") {
            if (S.attempts = (S.attempts || 0) + 1, S.attempts >= _) {
              S.status = "failed", S.nextAttemptAt = 0, p.put(S), v = { status: "failed", entry: S };
              return;
            }
            const A = i[Math.min(S.attempts - 1, i.length - 1)];
            S.status = "pending", S.nextAttemptAt = this.now() + A, p.put(S), v = { status: "retry", entry: S, delay: A };
          }
        }
      }, o.oncomplete = () => c(v), o.onerror = () => n(o.error || new Error("Queue nack transaction failed")), o.onabort = () => n(o.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, l, f) {
    return this._remapTransaction(e, null, l, f);
  }
  resolveCreate(e, l, f, y) {
    return this._remapTransaction(e, l, f, y);
  }
  _remapTransaction(e, l, f, y) {
    return this.open().then((_) => _ ? new Promise((i, s) => {
      const c = _.transaction(it, "readwrite"), n = c.objectStore(it), o = n.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let p = { changed: [], deleted: [] };
      o.onerror = () => s(ut(o, "Queue remap read failed")), o.onsuccess = () => {
        p = yi(o.result || [], l, f, y, this.now());
        for (const u of p.deleted) n.delete(u);
        for (const u of p.changed) n.put(u);
      }, c.oncomplete = () => i(p.changed), c.onerror = () => s(c.error || new Error("Queue remap transaction failed")), c.onabort = () => s(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((l) => l ? new Promise((f, y) => {
      const _ = l.transaction(it, "readwrite"), i = _.objectStore(it), s = i.index("by_scope_seq").getAll(xt(this.keyRange, e));
      let c = 0;
      s.onerror = () => y(ut(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const n of s.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), tn(n), i.put(n), c++);
      }, _.oncomplete = () => f(c), _.onerror = () => y(_.error || new Error("Queue failed-entry reset failed")), _.onabort = () => y(_.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((l) => l ? new Promise((f, y) => {
      const i = l.transaction(lt, "readonly").objectStore(lt).get(Yt(e));
      i.onsuccess = () => {
        const s = i.result ? i.result.value : !1;
        f(s || !1);
      }, i.onerror = () => y(ut(i, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, l) {
    return this.open().then((f) => {
      if (f)
        return new Promise((y, _) => {
          const i = f.transaction(lt, "readwrite"), s = typeof l == "string" ? l : l ? "manual" : !1;
          i.objectStore(lt).put({ key: Yt(e), value: s }), i.oncomplete = () => y(), i.onerror = () => _(i.error || new Error("Queue pause-state write failed")), i.onabort = () => _(i.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((l) => {
      if (l)
        return new Promise((f, y) => {
          const _ = l.transaction([it, lt], "readwrite"), s = _.objectStore(it).index("by_scope_seq").openCursor(xt(this.keyRange, e));
          s.onsuccess = (c) => {
            const n = c.target.result;
            n && (n.delete(), n.continue());
          }, s.onerror = () => y(ut(s, "Queue clear failed")), _.objectStore(lt).delete(Ze(e)), _.objectStore(lt).delete(Yt(e)), _.oncomplete = () => f(), _.onerror = () => y(_.error || new Error("Queue clear transaction failed")), _.onabort = () => y(_.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, l, f) {
    return this.open().then((y) => y ? new Promise((_, i) => {
      const s = y.transaction(it, "readwrite"), c = s.objectStore(it), n = c.get(l);
      let o = null;
      n.onerror = () => i(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const p = n.result;
        !p || p.scope !== e || (o = f(p, c));
      }, s.oncomplete = () => _(o), s.onerror = () => i(s.error || new Error("Queue entry transaction failed")), s.onabort = () => i(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", l = [2e3, 5e3, 15e3, 6e4, 3e5], f = 8, y = 6e4;
  if (window[e] !== void 0) return;
  function _(o) {
    const p = o[e];
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
  const c = new vi({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: s
  });
  function n(o) {
    this.dom = o, o[e] = this;
    const p = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (p ? p.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = s(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
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
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const o = this;
    return c.allForScope(o.scope).then((p) => (q(o.dom, "ln-api-queue:pending-count", { count: p.length, scope: o.scope }), p.length === 0 && q(o.dom, "ln-api-queue:drained", { scope: o.scope }), p));
  }, n.prototype._clearTimer = function(o) {
    const p = this._timers.get(o);
    p && (clearTimeout(p), this._timers.delete(o));
  }, n.prototype._scheduleTimer = function(o, p) {
    const u = Math.max(0, p), w = this._timers.get(o);
    w && clearTimeout(w);
    const v = this, S = setTimeout(() => {
      v._timers.delete(o), v._drain();
    }, u);
    this._timers.set(o, S);
  }, n.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = c.claimReady(o.scope, o._workerId, y).then((p) => {
      for (const u of p.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of p.entries)
        o._clearTimer(u.chainKey), q(o.dom, "ln-api-queue:send", {
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
      console.error("[ln-api-queue] Drain failed:", p), q(o.dom, "ln-api-queue:error", { operation: "drain", error: p });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, n.prototype._onEnqueue = function(o) {
    const p = this;
    return c.enqueue(p.scope, o.detail || {}).then((u) => {
      if (u)
        return p._emitPendingCount().then((w) => (q(p.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), p._drain()));
    }).catch((u) => {
      q(p.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(o) {
    const p = this, u = o.detail || {};
    return c.ack(p.scope, u.entryId).then(() => p._emitPendingCount()).then(() => p._drain()).catch((w) => {
      q(p.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(o) {
    const p = this, u = o.detail || {};
    return c.nack(p.scope, u.entryId, u.reason, {
      maxAttempts: f,
      backoff: l
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
  }, n.prototype._onRemap = function(o) {
    const p = this, u = o.detail || {};
    return c.remap(p.scope, u.oldKey, u.newId).catch((w) => {
      q(p.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(o) {
    const p = this, u = o.detail || {};
    return c.resolveCreate(p.scope, u.entryId, u.oldKey, u.newId).then(() => p._emitPendingCount()).then(() => p._drain()).catch((w) => {
      q(p.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const o = this;
    return c.setPaused(o.scope, !1).then(() => (o._paused = !1, q(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((p) => {
      q(o.dom, "ln-api-queue:error", { operation: "resume", error: p });
    });
  }, n.prototype._onPause = function() {
    const o = this;
    return c.setPaused(o.scope, "manual").then(() => {
      o._paused = !0, q(o.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((p) => {
      q(o.dom, "ln-api-queue:error", { operation: "pause", error: p });
    });
  }, n.prototype._onDrain = function() {
    const o = this;
    return c.resetFailed(o.scope).then(() => {
      const p = o._drainPromise;
      return p ? p.then(() => o._drain()) : o._drain();
    }).catch((p) => {
      q(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: p });
    });
  }, n.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((p) => clearTimeout(p)), o._timers.clear(), c.clear(o.scope).then(() => {
      o._paused = !1, q(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), q(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((p) => {
      q(o.dom, "ln-api-queue:error", { operation: "clear", error: p });
    });
  }, n.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (p) => o._onEnqueue(p),
      ack: (p) => o._onAck(p),
      nack: (p) => o._onNack(p),
      remap: (p) => o._onRemap(p),
      resolveCreate: (p) => o._onResolveCreate(p),
      resume: () => o._onResume(),
      pause: () => o._onPause(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((p) => clearTimeout(p)), o._timers.clear(), q(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: i
  });
})();
function zn(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function It(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function wi(t, e, l) {
  const f = zn(t);
  return f === null || f < 0 ? 0 : Math.min(f, Math.min(e, l) / 2);
}
function Ei(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((l) => !Number.isFinite(l)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Ai(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), l = e[0].trim();
  return l ? {
    field: l,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Si(t, e) {
  e = e || {};
  const l = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, f = e.xField || "label", y = e.yField || "value", _ = e.includeZero !== !1, i = wi(e.padding, l.width, l.height), s = Array.isArray(t) ? t : [], c = [];
  for (let r = 0; r < s.length; r++) {
    const h = s[r] || {}, b = zn(h[y]);
    b !== null && c.push({
      record: h,
      sourceIndex: r,
      label: h[f] == null ? String(r + 1) : String(h[f]),
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
      baselineY: l.y + l.height - i
    };
  let n = c[0].value, o = c[0].value;
  for (let r = 1; r < c.length; r++)
    c[r].value < n && (n = c[r].value), c[r].value > o && (o = c[r].value);
  let p = n, u = o;
  _ && (p = Math.min(0, p), u = Math.max(0, u)), p === u && (u === 0 ? u = 1 : u > 0 ? p = 0 : u = 0);
  const w = Math.max(1, l.width - i * 2), v = Math.max(1, l.height - i * 2), S = u - p, A = l.y + l.height - i - (0 - p) / S * v, d = [];
  for (let r = 0; r < c.length; r++) {
    const h = c[r], b = c.length === 1 ? 0.5 : r / (c.length - 1), T = l.x + i + b * w, m = l.y + l.height - i - (h.value - p) / S * v;
    d.push({
      record: h.record,
      sourceIndex: h.sourceIndex,
      label: h.label,
      value: h.value,
      x: T,
      y: m,
      pointString: It(T) + "," + It(m)
    });
  }
  const g = d.map((r) => r.pointString).join(" ");
  let a = "";
  if (d.length > 0) {
    const r = d[0], h = d[d.length - 1], b = It(r.x) + "," + It(A), T = It(h.x) + "," + It(A);
    a = b + " " + g + " " + T;
  }
  return {
    points: d,
    linePoints: g,
    areaPoints: a,
    count: d.length,
    min: n,
    max: o,
    domainMin: p,
    domainMax: u,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", l = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function f(n) {
    const o = n[e];
    o && o.requestData();
  }
  function y(n) {
    const o = n[e];
    o && o._render();
  }
  const _ = {
    "data-ln-chart": { prop: "name", read: Q, fallback: "", effect: y },
    "data-ln-chart-source": { effect: f },
    "data-ln-chart-sort": { effect: f },
    "data-ln-chart-type": { effect: y },
    "data-ln-chart-x": { effect: y },
    "data-ln-chart-y": { effect: y },
    "data-ln-chart-padding": { effect: y },
    "data-ln-chart-zero": { effect: y }
  }, i = et(_);
  function s(n, o) {
    n && (n.textContent = o);
  }
  function c(n) {
    this.dom = n, tt(this, n, i), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const o = this;
    return this._onSetData = function(p) {
      const u = p.detail || {};
      o._data = Array.isArray(u.data) ? u.data : [], o.isLoaded = !0, o._setLoading(!1), o._render();
    }, this._onSetLoading = function(p) {
      o._setLoading(!!(p.detail && p.detail.loading));
    }, this._onRefresh = function() {
      o.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  c.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), o = n === null ? NaN : Number(n), p = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(o) && o >= 0 ? o : 16,
      type: p === "area" || p === "polygon" ? "area" : "line",
      viewBox: this.plot && Ei(this.plot.getAttribute("viewBox")) || l
    };
  }, c.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, c.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const o = this.name + "-label", p = '[data-ln-template="' + o + '"]';
    if (!this.dom.querySelector(p) && !document.querySelector(p)) return;
    const u = Tt(this.dom, o, "ln-chart");
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
    const n = this._readOptions(), o = Si(this._data, n);
    this.model = o, this.line && (this.line.setAttribute("points", o.linePoints), this.line.toggleAttribute("hidden", o.count === 0)), this.area && (this.area.setAttribute("points", o.areaPoints), this.area.toggleAttribute("hidden", o.count === 0 || n.type !== "area"));
    const p = o.count === 0;
    this.dom.classList.toggle("ln-chart--empty", p), this.empty && this.empty.toggleAttribute("hidden", !p);
    const u = rt(this.dom);
    s(this.minimum, ct(o.min, u)), s(this.maximum, ct(o.max, u)), s(this.count, ct(o.count, u)), this._renderLabels(o), q(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: o.count,
      min: o.min,
      max: o.max
    });
  }, c.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, q(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Ai(this.dom.getAttribute("data-ln-chart-sort")),
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
  const l = {
    "data-ln-options": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-options-value": { prop: "_valueField", read: Q, fallback: "id" },
    "data-ln-options-label": { prop: "_labelField", read: Q, fallback: "name" }
  }, f = et(l);
  function y(_) {
    this.dom = _, tt(this, _, f);
    const i = this;
    return this._onSetData = function(s) {
      i._rebuild(s.detail.data || []);
    }, _.addEventListener("ln-options:set-data", this._onSetData), q(_, "ln-options:request-data", { options: this._storeName }), this;
  }
  y.prototype._rebuild = function(_) {
    const i = this.dom, s = this._valueField, c = this._labelField, n = i.value, o = i.querySelectorAll("option");
    for (let u = o.length - 1; u >= 0; u--)
      o[u].value !== "" && i.removeChild(o[u]);
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
  }, y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, y, "ln-options", {
    attributes: l
  });
})();
function Ci(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const l = t.slice(0, e).trim(), f = t.slice(e + 1).trim();
  if (!l) return null;
  const y = {};
  return y[l] = [f], y;
}
function Ti(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-stat": { prop: "_storeName", read: Q, fallback: "" },
    "data-ln-stat-filter": { prop: "_filterRaw", read: Q, fallback: "" }
  }, f = et(l);
  function y(_) {
    return this.dom = _, tt(this, _, f), this._onSetCount = function(i) {
      _.textContent = Ti(i.detail && i.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), q(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Ci(this._filterRaw)
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, y, "ln-stat", {
    attributes: l
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", l = "#ln-icon-custom-", f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
  let _ = null;
  const i = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", n = "lni:v", o = "1";
  function p() {
    try {
      if (localStorage.getItem(n) !== o) {
        for (let g = localStorage.length - 1; g >= 0; g--) {
          const a = localStorage.key(g);
          a && a.indexOf(c) === 0 && localStorage.removeItem(a);
        }
        localStorage.setItem(n, o);
      }
    } catch {
    }
  }
  p();
  function u() {
    return _ || (_ = document.getElementById(t), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = t, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function w(g) {
    return g.indexOf(l) === 0 ? s + "/" + g.slice(l.length) + ".svg" : i + "/" + g.slice(e.length) + ".svg";
  }
  function v(g, a) {
    const r = a.match(/viewBox="([^"]+)"/), h = r ? r[1] : "0 0 24 24", b = a.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = b ? b[1].trim() : "", m = a.match(/<svg([^>]*)>/i), E = m ? m[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = g, C.setAttribute("viewBox", h), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const D = E.match(new RegExp(k + '="([^"]*)"'));
      D && C.setAttribute(k, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function S(g) {
    if (f.has(g) || y.has(g)) return;
    if (g.indexOf(l) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", g);
      return;
    }
    const a = g.slice(1);
    try {
      const h = localStorage.getItem(c + a);
      if (h) {
        v(a, h), f.add(g);
        return;
      }
    } catch {
    }
    y.add(g);
    const r = w(g);
    fetch(r).then(function(h) {
      if (!h.ok) throw new Error(h.status);
      return h.text();
    }).then(function(h) {
      v(a, h), f.add(g), y.delete(g);
      try {
        localStorage.setItem(c + a, h);
      } catch {
      }
    }).catch(function(h) {
      console.error("[ln-icon] Fetch failed for:", a, h), y.delete(g);
    });
  }
  function A(g) {
    const a = 'use[href^="' + e + '"], use[href^="' + l + '"]', r = g.querySelectorAll ? g.querySelectorAll(a) : [];
    if (g.matches && g.matches(a)) {
      const h = g.getAttribute("href");
      h && S(h);
    }
    Array.prototype.forEach.call(r, function(h) {
      const b = h.getAttribute("href");
      b && S(b);
    });
  }
  function d() {
    A(document), new MutationObserver(function(g) {
      g.forEach(function(a) {
        if (a.type === "childList")
          a.addedNodes.forEach(function(r) {
            r.nodeType === 1 && A(r);
          });
        else if (a.type === "attributes" && a.attributeName === "href") {
          const r = a.target.getAttribute("href");
          r && (r.indexOf(e) === 0 || r.indexOf(l) === 0) && S(r);
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
function Li(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const l = [];
  for (let f = 0; f <= e.length; f++) l[f] = [f];
  for (let f = 0; f <= t.length; f++) l[0][f] = f;
  for (let f = 1; f <= e.length; f++)
    for (let y = 1; y <= t.length; y++)
      e.charAt(f - 1) === t.charAt(y - 1) ? l[f][y] = l[f - 1][y - 1] : l[f][y] = Math.min(
        l[f - 1][y - 1] + 1,
        l[f][y - 1] + 1,
        l[f - 1][y] + 1
      );
  return l[e.length][t.length];
}
function qi(t, e = De) {
  if (e.has(t)) return null;
  let l = null, f = 1 / 0;
  for (const _ of e) {
    const i = Li(t, _);
    i < f && (f = i, l = _);
  }
  const y = Math.max(3, Math.floor(t.length * 0.4));
  return f <= y ? l : null;
}
function Kn(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function ki(t = document) {
  const e = t.ownerDocument || t, l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], y = [l, ...l.querySelectorAll("*")];
  for (let _ = 0; _ < y.length; _++) {
    const i = y[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && c.name.endsWith("-for")) {
          const n = (c.value || "").trim();
          if (!n) {
            f.push({
              type: "id-empty",
              element: i,
              attribute: c.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${i.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + Kn(n)) || f.push({
            type: "id-unresolved",
            element: i,
            attribute: c.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${i.tagName.toLowerCase()} ${c.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return f;
}
function xi(t = document) {
  const e = t.ownerDocument || t, l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], y = [l, ...l.querySelectorAll("*")];
  for (let _ = 0; _ < y.length; _++) {
    const i = y[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && (c.name.endsWith("-source") || c.name.endsWith("-store")) && c.name !== "data-ln-data-store") {
          const o = (c.value || "").trim();
          if (!o) {
            f.push({
              type: "store-empty",
              element: i,
              attribute: c.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${i.tagName.toLowerCase()} ${c.name}="">.`
            });
            continue;
          }
          const p = Kn(o), u = e.querySelector(`[data-ln-data-store="${p}"], [data-ln-store="${p}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(o);
          !u && !w && f.push({
            type: "store-unresolved",
            element: i,
            attribute: c.name,
            storeName: o,
            message: `[ln-debug] Unresolved store reference: <${i.tagName.toLowerCase()} ${c.name}="${o}"> targets store "${o}", but no [data-ln-data-store="${o}"] exists in the document.`
          });
        }
      }
  }
  return f;
}
function Ii(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const l = [], f = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && f.unshift(e);
  const y = /* @__PURE__ */ new Map();
  for (let _ = 0; _ < f.length; _++) {
    const i = f[_], s = (i.getAttribute("data-ln-data-store") || "").trim();
    s && (y.has(s) || y.set(s, []), y.get(s).push(i));
  }
  for (const [_, i] of y.entries())
    i.length > 1 && l.push({
      type: "store-duplicate",
      storeName: _,
      elements: i,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${_}". Store names must be unique across the document.`
    });
  return l;
}
function Di(t = document, e = De) {
  const l = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!l) return [];
  const f = [], y = [l, ...l.querySelectorAll("*")];
  for (let _ = 0; _ < y.length; _++) {
    const i = y[_];
    if (i.attributes)
      for (let s = 0; s < i.attributes.length; s++) {
        const c = i.attributes[s];
        if (c.name.startsWith("data-ln-") && !e.has(c.name)) {
          const n = qi(c.name, e), o = n ? ` Did you mean "${n}"?` : "";
          f.push({
            type: "attribute-unknown",
            element: i,
            attribute: c.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${c.name}" on <${i.tagName.toLowerCase()}>.${o}`
          });
        }
      }
  }
  return f;
}
function Se(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const l = e.validAttributes || De, f = ki(t), y = xi(t), _ = Ii(t), i = Di(t, l), s = [
    ...f,
    ...y,
    ..._,
    ...i
  ];
  if (!e.silent)
    for (let c = 0; c < s.length; c++)
      console.warn(s[c].message);
  return {
    idIssues: f,
    storeIssues: y,
    uniquenessIssues: _,
    spellingIssues: i,
    total: s.length
  };
}
let Bt = null;
function Xt(t = typeof document < "u" ? document : null, e = 50, l = null) {
  if (!t) return;
  Bt && (clearTimeout(Bt), Bt = null);
  function f() {
    Bt = setTimeout(() => {
      Bt = null;
      const y = Se(t);
      l && l(y);
    }, e);
  }
  dn() > 0 ? mt(f) : f();
}
function en(t, e, l, f) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", l), console.log("detail", f), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", l), console.log("old → new", f.oldValue, "→", f.newValue), console.groupEnd());
}
let Rt = [];
function Ri() {
  Rt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Rt.push(document.body);
}
function Oi(t) {
  for (let e = 0; e < Rt.length; e++)
    if (Rt[e].contains(t)) return !0;
  return !1;
}
function Mi(t, e, l, f) {
  if (l === window || l === document) {
    Rt.indexOf(document.body) !== -1 && en(t, e, l, f);
    return;
  }
  Oi(l) && en(t, e, l, f);
}
function Ce() {
  Ri(), rr(Rt.length > 0 ? Mi : null);
}
function nn() {
  Ce();
}
function Ni() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Ce(), Vt(["data-ln-debug"], Ce);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const l = {
    "data-ln-debug": {}
  };
  Ni();
  function f(_) {
    return this.dom = _, Xt(_.ownerDocument || document), nn(), this;
  }
  f.prototype.verify = function(_, i) {
    return Se(_ || (this.dom ? this.dom.ownerDocument || this.dom : document), i);
  }, f.prototype.destroy = function() {
    delete this.dom[e], nn();
  };
  const y = j(t, e, f, "ln-debug", {
    attributes: l,
    onInit: function(_) {
      typeof document < "u" && Xt(_ && _.ownerDocument ? _.ownerDocument : document);
    },
    onSubtreeChange: function(_) {
      typeof document < "u" && Xt(_ && _.ownerDocument ? _.ownerDocument : document);
    }
  });
  y.verify = function(_, i) {
    return Se(_ || document, i);
  }, y.schedule = function(_, i, s) {
    return Xt(_ || document, i, s);
  };
})();
